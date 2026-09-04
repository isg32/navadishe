// Writes registrations straight to Neon Postgres (source of truth). Google
// Sheets is now only touched by /api/sync-sheets, an explicit admin action,
// not on every submission.
//
// source=Website (the public quick-lead form): public, no login needed.
// source=Dashboard (the staff form): requires a session with "form" access
// (admin or poc) — so every row can be attributed to who submitted it, and
// the POC role has nowhere it can do anything BUT submit this form.
import { getSession, jsonResponse } from '@/lib/session';
import { canAccess } from '@/lib/auth';
import { db } from '@/lib/db';

function toInt(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function toDate(v) {
  return v ? v : null; // input type="date" already gives YYYY-MM-DD
}

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ result: 'error', error: 'Invalid form submission' }, 400);
  }
  const p = Object.fromEntries(formData.entries());

  // Honeypot: silently accept and drop, same as before.
  if (p.website) {
    return jsonResponse({ result: 'ignored' });
  }

  const sql = db();

  try {
    if (p.source === 'Dashboard') {
      const session = await getSession(request);
      if (!session || !canAccess(session.role, 'form')) {
        return jsonResponse({ result: 'error', error: 'Not authorized to submit this form' }, 401);
      }

      await sql`
        insert into school_registrations (
          created_by, school_name, school_address, city, district, state, pincode,
          board, branch_name, school_phone, school_email,
          principal_name, principal_phone, principal_email,
          coordinator_name, coordinator_phone, coordinator_email,
          students_1_9, students_10, students_11, students_12,
          news_first_poc_name, news_first_poc_phone, vendor_name, vendor_phone,
          test_date, message
        ) values (
          ${session.u}, ${p.schoolName || ''}, ${p.schoolAddress || ''}, ${p.city || ''}, ${p.district || ''}, ${p.state || ''}, ${p.pincode || ''},
          ${p.board || ''}, ${p.branchName || ''}, ${p.schoolPhone || ''}, ${p.schoolEmail || ''},
          ${p.principalName || ''}, ${p.principalPhone || ''}, ${p.principalEmail || ''},
          ${p.coordinatorName || ''}, ${p.coordinatorPhone || ''}, ${p.coordinatorEmail || ''},
          ${toInt(p.studentsClass1to9)}, ${toInt(p.studentsClass10)}, ${toInt(p.studentsClass11)}, ${toInt(p.studentsClass12)},
          ${p.newsFirstPocName || ''}, ${p.newsFirstPocPhone || ''}, ${p.vendorName || ''}, ${p.vendorPhone || ''},
          ${toDate(p.testDate)}, ${p.message || ''}
        )
      `;
    } else {
      await sql`
        insert into website_leads (name, district, phone, request_callback)
        values (${p.name || ''}, ${p.district || ''}, ${p.phone || ''}, ${!!p.requestCallback})
      `;
    }

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
