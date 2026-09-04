// Shared helpers for the dashboard's cookie-based session, used by
// login.js, logout.js, whoami.js and leads.js. Uses only Web Crypto / Web
// APIs (available in the Edge runtime) so there's no dependency to bundle.

const COOKIE_NAME = 'nd_session';
const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64Url(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(username, secret, maxAgeSeconds = 8 * 60 * 60) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + maxAgeSeconds * 1000 });
  const payloadB64 = toBase64Url(enc.encode(payload));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(sig));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || !secret || token.indexOf('.') === -1) return null;
  const [payloadB64, sigB64] = token.split('.');
  const key = await hmacKey(secret);
  const expectedSig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64)));
  const expectedSigB64 = toBase64Url(expectedSig);
  if (!timingSafeEqual(expectedSigB64, sigB64)) return null;
  try {
    const payload = JSON.parse(dec.decode(fromBase64Url(payloadB64)));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload; // { u, exp }
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  });
  return out;
}

export function setSessionCookie(headers, token, maxAgeSeconds = 8 * 60 * 60) {
  headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`
  );
}

export function clearSessionCookie(headers) {
  headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

export async function getSession(request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const cookies = parseCookies(request.headers.get('cookie'));
  return verifySessionToken(cookies[COOKIE_NAME], secret);
}

export function jsonResponse(obj, status = 200, extraHeaders) {
  const headers = extraHeaders || new Headers({ 'content-type': 'application/json' });
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(obj), { status, headers });
}
