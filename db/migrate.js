#!/usr/bin/env node
// One-off setup script: creates the schema, and — only the first time,
// when app_users is empty — seeds an initial admin from DASHBOARD_USERS so
// login isn't broken by this migration. Run with: node db/migrate.js
//
// Reads NEON_URL (and, for seeding, DASHBOARD_USERS) from .env.local.
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
  const env = { ...loadEnvLocal(), ...process.env };
  if (!env.NEON_URL) {
    console.error('NEON_URL is not set (checked .env.local and the environment).');
    process.exit(1);
  }

  const sql = neon(env.NEON_URL);
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  console.log('Applying schema...');
  await sql.transaction((tx) =>
    schema
      .split(/;\s*(?:\n|$)/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((statement) => tx.query(statement))
  );
  console.log('Schema applied.');

  const [{ c: userCount }] = await sql`select count(*)::int as c from app_users`;
  if (userCount > 0) {
    console.log(`app_users already has ${userCount} row(s) — skipping seed.`);
    return;
  }

  if (!env.DASHBOARD_USERS) {
    console.log('No DASHBOARD_USERS in .env.local to seed from, and app_users is empty.');
    console.log('Create your first admin manually, e.g.:');
    console.log('  node db/create-user.js <username> <password> admin');
    return;
  }

  let users;
  try {
    users = JSON.parse(env.DASHBOARD_USERS);
  } catch {
    console.error('DASHBOARD_USERS is not valid JSON — skipping seed.');
    return;
  }

  for (const [username, password] of Object.entries(users)) {
    const { hash, salt } = hashPassword(password);
    await sql`
      insert into app_users (username, password_hash, password_salt, role, districts)
      values (${username}, ${hash}, ${salt}, 'admin', '{}')
      on conflict (username) do nothing
    `;
    console.log(`Seeded admin user: ${username}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
