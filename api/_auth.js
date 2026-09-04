// Password hashing (PBKDF2-SHA256 via Web Crypto — available in both the
// Edge runtime and Node, no extra dependency) for the app_users table.
const enc = new TextEncoder();
const PBKDF2_ITERATIONS = 100000;

function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function deriveKey(password, saltBytes) {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveKey(password, saltBytes);
  return { hash: toHex(derived), salt: toHex(saltBytes) };
}

export async function verifyPassword(password, hash, salt) {
  const derived = await deriveKey(password, fromHex(salt));
  const candidate = toHex(derived);
  if (candidate.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

// Which dashboard nav sections each role can reach. Enforced both here
// (server-side, on every api/*.js that touches data) and mirrored in
// js/dashboard.js (to actually hide/show nav items) — that copy must be
// kept in sync with this one.
export const ROLE_NAV = {
  admin: ['home', 'form', 'registrations', 'leads', 'users', 'sync'],
  poc: ['home', 'form'],
  reader: ['home', 'registrations', 'leads'],
};

export function canAccess(role, navKey) {
  return (ROLE_NAV[role] || []).includes(navKey);
}
