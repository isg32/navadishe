// Lets the dashboard check on load whether it already has a valid session
// cookie, without exposing any data.
import { getSession, jsonResponse } from '@/lib/session';

export async function GET(request) {
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
