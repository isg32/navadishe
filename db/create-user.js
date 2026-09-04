#!/usr/bin/env node
// Create (or update) a dashboard user directly from the CLI — useful before
// the in-dashboard Users page exists, or for scripting.
//
// Usage:
//   node db/create-user.js <username> <password> <admin|poc|reader> [district,district,...]
//
// Examples:
//   node db/create-user.js priya@navadishe secret123 admin
//   node db/create-user.js coordinator@navadishe secret123 poc
//   node db/create-user.js viewer@navadishe secret123 reader "Bengaluru Urban,Mysuru"
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

function loadEnvLocal() {
  const p = path.join(__dirname, '..', '.env.local');
  const out = {};
  if (!fs.existsSync(p)) return out;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return { hash: hash.toString('hex'), salt: salt.toString('hex') };
}

async function main() {
  const [username, password, role, districtsArg] = process.argv.slice(2);
  if (!username || !password || !['admin', 'poc', 'reader'].includes(role)) {
    console.error('Usage: node db/create-user.js <username> <password> <admin|poc|reader> [district,district,...]');
    process.exit(1);
  }
  const districts = districtsArg ? districtsArg.split(',').map((d) => d.trim()).filter(Boolean) : [];

  const env = { ...loadEnvLocal(), ...process.env };
  if (!env.NEON_URL) {
    console.error('NEON_URL is not set.');
    process.exit(1);
  }
  const sql = neon(env.NEON_URL);
  const { hash, salt } = hashPassword(password);

  await sql`
    insert into app_users (username, password_hash, password_salt, role, districts)
    values (${username}, ${hash}, ${salt}, ${role}, ${districts})
    on conflict (username) do update
      set password_hash = excluded.password_hash,
          password_salt = excluded.password_salt,
          role = excluded.role,
          districts = excluded.districts
  `;
  console.log(`Saved user "${username}" (role: ${role}${districts.length ? `, districts: ${districts.join(', ')}` : ''}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
