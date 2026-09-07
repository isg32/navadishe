// The dashboard's "Registrations" and "From Website" views read through
// here, straight from Neon Postgres. A "reader" role only ever sees rows in
// their assigned districts; "admin" sees everything; "poc" has no list
// access at all (matches ROLE_NAV).
//
// GET    ?sheet=website | dashboard (default: dashboard)   — list rows
// PATCH  { sheet, id, fields:{col:val} }                   — admin: edit a row
// DELETE ?sheet=...&id=...                                 — admin: delete a row
import { getSession, jsonResponse } from '@/lib/session';
import { canAccess } from '@/lib/auth';
import { db } from '@/lib/db';

const REG_COLUMNS = [
  'school_name', 'school_address', 'city', 'district', 'pincode', 'board', 'branch_name',
  'school_phone', 'school_email', 'principal_name', 'principal_phone', 'principal_email',
  'coordinator_name', 'coordinator_phone', 'coordinator_email',
  'students_1_9', 'students_10', 'students_11', 'students_12',
  'news_first_poc_name', 'news_first_poc_phone', 'vendor_name', 'vendor_phone',
  'test_date', 'message',
];
const LEAD_COLUMNS = ['name', 'district', 'phone', 'request_callback'];
const INT_COLUMNS = new Set(['students_1_9', 'students_10', 'students_11', 'students_12']);

function normalize(col, value) {
  if (INT_COLUMNS.has(col)) {
    if (value === '' || value === null || value === undefined) return null;
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  }
  if (col === 'test_date') return value ? value : null;
  if (col === 'request_callback') return !!value;
  return value == null ? '' : String(value);
}

function mapRegistration(r) {
  return {
    Id: r.id,
    Code: r.code,
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
  };
}

export async function GET(request) {
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
        Id: r.id,
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
      rows = rows.map(mapRegistration);
    }

    return jsonResponse({ result: 'success', rows });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}

export async function PATCH(request) {
  const session = await getSession(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Not authenticated' }, 401);
  if (session.role !== 'admin') {
    return jsonResponse({ result: 'error', error: 'Only an admin can edit entries' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ result: 'error', error: 'Invalid JSON body' }, 400);
  }

  const sheet = body.sheet === 'website' ? 'website' : 'dashboard';
  const id = parseInt(body.id, 10);
  if (!Number.isFinite(id)) return jsonResponse({ result: 'error', error: 'Missing or invalid id' }, 400);

  const table = sheet === 'website' ? 'website_leads' : 'school_registrations';
  const allowed = sheet === 'website' ? LEAD_COLUMNS : REG_COLUMNS;
  const fields = body.fields && typeof body.fields === 'object' ? body.fields : {};
  const cols = Object.keys(fields).filter((c) => allowed.includes(c));
  if (!cols.length) return jsonResponse({ result: 'error', error: 'No editable fields provided' }, 400);

  const setClause = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const values = cols.map((c) => normalize(c, fields[c]));

  try {
    const sql = db();
    await sql.query(`update ${table} set ${setClause} where id = $${cols.length + 1}`, [...values, id]);
    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}

export async function DELETE(request) {
  const session = await getSession(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Not authenticated' }, 401);
  if (session.role !== 'admin') {
    return jsonResponse({ result: 'error', error: 'Only an admin can delete entries' }, 403);
  }

  const url = new URL(request.url);
  const sheet = url.searchParams.get('sheet') === 'website' ? 'website' : 'dashboard';
  const id = parseInt(url.searchParams.get('id'), 10);
  if (!Number.isFinite(id)) return jsonResponse({ result: 'error', error: 'Missing or invalid id' }, 400);

  const table = sheet === 'website' ? 'website_leads' : 'school_registrations';

  try {
    const sql = db();
    await sql.query(`delete from ${table} where id = $1`, [id]);
    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
