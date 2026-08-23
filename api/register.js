// Vercel Edge Function — proxies the registration form to the Apps Script
// web app, so the real APPS_SCRIPT_URL never ships to the browser.
// Set APPS_SCRIPT_URL in Vercel Project Settings → Environment Variables
// (and in .env.local for local `vercel dev`).
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ result: 'error', error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return new Response(
      JSON.stringify({ result: 'error', error: 'APPS_SCRIPT_URL is not configured' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const formData = await request.formData();

    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    });

    const text = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { result: 'success' }; // Apps Script sometimes returns non-JSON on redirect
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ result: 'error', error: String(err) }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
