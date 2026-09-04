// Shared Neon Postgres connection (HTTP-based, works in the Edge runtime —
// no TCP needed). Reads the connection string from NEON_URL.
import { neon } from '@neondatabase/serverless';

let cached = null;

export function db() {
  if (!cached) {
    const url = process.env.NEON_URL;
    if (!url) throw new Error('NEON_URL is not configured');
    cached = neon(url);
  }
  return cached;
}
