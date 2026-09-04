// Vercel Edge Function — clears the dashboard session cookie.
export const config = { runtime: 'edge' };

import { clearSessionCookie } from './_session.js';

export default async function handler() {
  const headers = new Headers({ 'content-type': 'application/json' });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ result: 'success' }), { status: 200, headers });
}
