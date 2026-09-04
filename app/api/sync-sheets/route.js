// Admin-only. Pushes every row currently in Neon Postgres (the real source
// of truth) into the two Google Sheets tabs, replacing their contents
// wholesale. Sheets is an optional export/backup now, not written on every
// submission — this is how you refresh it.
import { getSession, jsonResponse } from '@/lib/session';
import { db } from '@/lib/db';

async function pushSheet(scriptUrl, readKey, sheet, rows) {
  const res = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'syncReplace', key: readKey, sheet, rows }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { result: 'error', error: `Unexpected response for ${sheet}: ${text.slice(0, 200)}` };
  }
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return jsonResponse({ result: 'error', error: 'Admin access required' }, 403);
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  const readKey = process.env.SHEET_READ_KEY;
  if (!scriptUrl || !readKey) {
    return jsonResponse({ result: 'error', error: 'Server is not configured' }, 500);
  }

  try {
    const sql = db();
    const [leads, regs] = await Promise.all([
      sql`select * from website_leads order by created_at asc`,
      sql`select * from school_registrations order by created_at asc`,
    ]);

    const websiteRows = leads.map((r) => ({
      Timestamp: r.created_at,
      Name: r.name,
      District: r.district,
      Phone: r.phone,
      'Request Callback': r.request_callback ? 'Yes' : 'No',
    }));

    const dashboardRows = regs.map((r) => ({
      Timestamp: r.created_at,
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

    const [websiteResult, dashboardResult] = await Promise.all([
      pushSheet(scriptUrl, readKey, 'website', websiteRows),
      pushSheet(scriptUrl, readKey, 'dashboard', dashboardRows),
    ]);

    if (websiteResult.result !== 'success' || dashboardResult.result !== 'success') {
      return jsonResponse({
        result: 'error',
        error: websiteResult.error || dashboardResult.error || 'Sync failed',
      }, 502);
    }

    return jsonResponse({
      result: 'success',
      websiteRows: websiteResult.written,
      dashboardRows: dashboardResult.written,
    });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
