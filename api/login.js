// Vercel Edge Function — checks a submitted username/password against the
// DASHBOARD_USERS dictionary in env, and on success issues a signed,
// HttpOnly session cookie. Credentials and the signing secret never reach
// the browser.
export const config = { runtime: 'edge' };

import { createSessionToken, setSessionCookie, jsonResponse } from './_session.js';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ result: 'error', error: 'Method not allowed' }, 405);
  }

  const sessionSecret = process.env.SESSION_SECRET;
  const usersRaw = process.env.DASHBOARD_USERS;
  if (!sessionSecret || !usersRaw) {
    return jsonResponse({ result: 'error', error: 'Dashboard login is not configured' }, 500);
  }

  let users;
  try {
    users = JSON.parse(usersRaw);
  } catch {
    return jsonResponse({ result: 'error', error: 'DASHBOARD_USERS is not valid JSON' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password || users[username] !== password) {
    return jsonResponse({ result: 'error', error: 'Invalid username or password' }, 401);
  }

  const token = await createSessionToken(username, sessionSecret);
  const headers = new Headers({ 'content-type': 'application/json' });
  setSessionCookie(headers, token);

  return new Response(JSON.stringify({ result: 'success', username }), { status: 200, headers });
}
