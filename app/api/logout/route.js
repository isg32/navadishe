// Clears the dashboard session cookie.
import { clearSessionCookie } from '@/lib/session';

export async function POST() {
  const headers = new Headers({ 'content-type': 'application/json' });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ result: 'success' }), { status: 200, headers });
}
