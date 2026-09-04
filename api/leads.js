// Vercel Edge Function — the dashboard's "All Registrations" view reads
// through here. Requires a valid session cookie (set by api/login.js), then
// proxies to the Apps Script web app's ?action=list endpoint, passing the
// server-side SHEET_READ_KEY so the sheet contents stay unreadable to
// anyone who only has the Apps Script exec URL.
export const config = { runtime: 'edge' };

import { getSession, jsonResponse } from './_session.js';

export default async function handler(request) {
  const session = await getSession(request);
  if (!session) {
    return jsonResponse({ result: 'error', error: 'Not authenticated' }, 401);
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  const readKey = process.env.SHEET_READ_KEY;
  if (!scriptUrl || !readKey) {
    return jsonResponse({ result: 'error', error: 'Server is not configured' }, 500);
  }

  try {
    const upstream = await fetch(`${scriptUrl}?action=list&key=${encodeURIComponent(readKey)}`);
    const text = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { result: 'error', error: 'Unexpected response from the sheet' };
    }
    return jsonResponse(parsed, 200);
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 502);
  }
}
