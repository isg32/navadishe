// Admin-only CRUD over app_users (the dashboard's login accounts). GET
// lists everyone; POST creates; PATCH updates role/districts/password;
// DELETE removes one. Every verb requires an admin session — nobody else
// can even see who has accounts.
import { getSession, jsonResponse } from '@/lib/session';
import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

const ROLES = ['admin', 'poc', 'reader'];

async function requireAdmin(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') return null;
  return session;
}

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Admin access required' }, 403);

  const sql = db();
  const rows = await sql`
    select username, role, districts, created_at
    from app_users
    order by created_at asc
  `;
  return jsonResponse({ result: 'success', users: rows });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Admin access required' }, 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ result: 'error', error: 'Invalid request body' }, 400);
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const role = ROLES.includes(body.role) ? body.role : null;
  const districts = Array.isArray(body.districts) ? body.districts.filter((d) => typeof d === 'string' && d) : [];

  if (!username || !password || password.length < 6 || !role) {
    return jsonResponse({ result: 'error', error: 'username, a password of 6+ characters, and a valid role are required' }, 400);
  }

  const sql = db();
  try {
    const { hash, salt } = await hashPassword(password);
    await sql`
      insert into app_users (username, password_hash, password_salt, role, districts)
      values (${username}, ${hash}, ${salt}, ${role}, ${districts})
    `;
    return jsonResponse({ result: 'success' });
  } catch (err) {
    if (String(err).includes('duplicate key')) {
      return jsonResponse({ result: 'error', error: 'That username already exists' }, 409);
    }
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}

export async function PATCH(request) {
  const session = await requireAdmin(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Admin access required' }, 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ result: 'error', error: 'Invalid request body' }, 400);
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  if (!username) {
    return jsonResponse({ result: 'error', error: 'username is required' }, 400);
  }
  const role = ROLES.includes(body.role) ? body.role : null;
  const districts = Array.isArray(body.districts) ? body.districts.filter((d) => typeof d === 'string' && d) : [];
  const password = typeof body.password === 'string' && body.password ? body.password : null;

  if (username === session.u && role && role !== 'admin') {
    return jsonResponse({ result: 'error', error: "You can't demote your own account" }, 400);
  }

  const sql = db();
  try {
    if (password) {
      if (password.length < 6) {
        return jsonResponse({ result: 'error', error: 'Password must be at least 6 characters' }, 400);
      }
      const { hash, salt } = await hashPassword(password);
      await sql`
        update app_users
        set role = coalesce(${role}, role), districts = ${districts}, password_hash = ${hash}, password_salt = ${salt}
        where username = ${username}
      `;
    } else {
      await sql`
        update app_users
        set role = coalesce(${role}, role), districts = ${districts}
        where username = ${username}
      `;
    }
    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}

export async function DELETE(request) {
  const session = await requireAdmin(request);
  if (!session) return jsonResponse({ result: 'error', error: 'Admin access required' }, 403);

  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  if (!username) {
    return jsonResponse({ result: 'error', error: 'username is required' }, 400);
  }
  if (username === session.u) {
    return jsonResponse({ result: 'error', error: "You can't delete your own account" }, 400);
  }
  const sql = db();
  await sql`delete from app_users where username = ${username}`;
  return jsonResponse({ result: 'success' });
}
