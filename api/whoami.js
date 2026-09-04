// Vercel Edge Function — lets the dashboard page check on load whether it
// already has a valid session cookie, without exposing any sheet data.
export const config = { runtime: 'edge' };

import { getSession, jsonResponse } from './_session.js';

export default async function handler(request) {
  const session = await getSession(request);
  if (!session) {
    return jsonResponse({ authenticated: false }, 401);
  }
  return jsonResponse({
    authenticated: true,
    username: session.u,
    role: session.role,
    districts: session.districts || [],
  });
}
