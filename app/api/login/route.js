// Checks a submitted username/password against the app_users table in Neon
// Postgres, and on success issues a signed, HttpOnly session cookie
// carrying the user's role and district scope.
import { createSessionToken, setSessionCookie, jsonResponse } from '@/lib/session';
import { verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    return jsonResponse({ result: 'error', error: 'Dashboard login is not configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    return jsonResponse({ result: 'error', error: 'Invalid username or password' }, 401);
  }

  try {
    const sql = db();
    const rows = await sql`
      select username, password_hash, password_salt, role, districts
      from app_users
      where username = ${username}
    `;
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash, user.password_salt))) {
      return jsonResponse({ result: 'error', error: 'Invalid username or password' }, 401);
    }

    const token = await createSessionToken(
      { u: user.username, role: user.role, districts: user.districts || [] },
      sessionSecret
    );
    const headers = new Headers({ 'content-type': 'application/json' });
    setSessionCookie(headers, token);

    return new Response(
      JSON.stringify({ result: 'success', username: user.username, role: user.role, districts: user.districts || [] }),
      { status: 200, headers }
    );
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
