// Vercel Edge Function — the dashboard's "Registrations" and "From Website"
// views read through here, straight from Neon Postgres. A "reader" role only
// ever sees rows in their assigned districts; "admin" sees everything;
// "poc" has no list access at all (matches ROLE_NAV).
//
// Query param: ?sheet=website | dashboard (default: dashboard).
export const config = { runtime: 'edge' };

import { getSession, jsonResponse } from './_session.js';
import { canAccess } from './_auth.js';
import { db } from './_db.js';

export default async function handler(request) {
  const session = await getSession(request);
  if (!session) {
    return jsonResponse({ result: 'error', error: 'Not authenticated' }, 401);
  }

  const url = new URL(request.url);
  const sheet = url.searchParams.get('sheet') === 'website' ? 'website' : 'dashboard';
  const navKey = sheet === 'website' ? 'leads' : 'registrations';

  if (!canAccess(session.role, navKey)) {
    return jsonResponse({ result: 'error', error: 'Not authorized to view this' }, 403);
  }

  const districts = session.role === 'reader' ? (session.districts || []) : null;
  if (districts && districts.length === 0) {
    // A reader with no assigned districts sees nothing, rather than everything.
    return jsonResponse({ result: 'success', rows: [] });
  }

  try {
    const sql = db();
    let rows;

    if (sheet === 'website') {
      rows = districts
        ? await sql`select * from website_leads where district = any(${districts}) order by created_at desc`
        : await sql`select * from website_leads order by created_at desc`;
      rows = rows.map((r) => ({
        Timestamp: r.created_at,
        Name: r.name,
        District: r.district,
        Phone: r.phone,
        'Request Callback': r.request_callback ? 'Yes' : 'No',
      }));
    } else {
      rows = districts
        ? await sql`select * from school_registrations where district = any(${districts}) order by created_at desc`
        : await sql`select * from school_registrations order by created_at desc`;
      rows = rows.map((r) => ({
        Timestamp: r.created_at,
        'Created By': r.created_by,
        'School Name': r.school_name,
        'School Address': r.school_address,
        City: r.city,
        District: r.district,
        State: r.state,
        'Pin-code': r.pincode,
        'School Board': r.board,
        'Branch Name': r.branch_name,
        'School Contact Number': r.school_phone,
        'School Email Id': r.school_email,
        'Principal Name': r.principal_name,
        'Principal Mobile Number': r.principal_phone,
        'Principal Email Id': r.principal_email,
        'Coordinator Name': r.coordinator_name,
        'Coordinator Mobile Number': r.coordinator_phone,
        'Coordinator Email Id': r.coordinator_email,
        'Students Class 1st-9th': r.students_1_9,
        'Students Class 10th': r.students_10,
        'Students Class 11th': r.students_11,
        'Students Class 12th': r.students_12,
        'News First POC Name': r.news_first_poc_name,
        'News First POC Mobile Number': r.news_first_poc_phone,
        'Vendor Name': r.vendor_name,
        'Vendor Mobile Number': r.vendor_phone,
        'Test Date': r.test_date,
        Message: r.message,
      }));
    }

    return jsonResponse({ result: 'success', rows });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
