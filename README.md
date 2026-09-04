# Nava Dishe — Setup

A public site (`index.html`) plus a login-gated internal **dashboard** (`dashboard.html`) for News First staff. **Neon Postgres is the source of truth** for both forms; Google Sheets is an optional, admin-triggered export ("Sync to Sheets" in the dashboard), not written on every submission.

- `index.html` — the public site. Its registration section is a quick lead form: Name, District, Phone, "request a callback" → `website_leads` table.
- `dashboard.html` — staff-only, behind real login (`app_users` table, not an env-var dictionary). A sidebar (drawer + hamburger on mobile) with:
  - **Home** — an analytics screen: totals, board/district breakdowns, recent activity. Scoped to what the signed-in user is allowed to see.
  - **New Registration** — the full Disha-style form → `school_registrations` table.
  - **Registrations** / **From Website** — searchable, sortable, filterable tables over the two Postgres tables.
  - **Users** (admin only) — create logins, set roles and district access.
  - **Sync to Sheets** (admin only) — pushes the current Postgres data into the Google Sheet.

Nothing secret ever reaches the browser — the Neon connection string, Apps Script URL, and session-signing secret are all read server-side by Vercel Edge Functions from environment variables.

## 1. Roles

Set on each row in `app_users`, enforced both server-side (every `api/*.js`) and in the sidebar:

| Role | Can do |
|---|---|
| `admin` | Everything — both tables (all districts), the entry form, Users, Sync to Sheets. |
| `poc` | Only the New Registration form. No list access at all (so, by construction, can submit but never edit or browse past entries). |
| `reader` | Read-only, and only for the districts listed on their account (`districts: text[]`). A reader with no districts assigned sees nothing. |

Manage users from the dashboard's **Users** page (admin-only), or via `node db/create-user.js <username> <password> <admin|poc|reader> [district,district]`.

## 2. Environment variables

| Variable | What it's for |
|---|---|
| `NEON_URL` | Postgres connection string (Neon console → Connection Details). |
| `SESSION_SECRET` | Long random string signing the login session cookie. `openssl rand -hex 32`. |
| `APPS_SCRIPT_URL` | Your deployed Apps Script web app URL (§4) — only used by "Sync to Sheets" now. |
| `SHEET_READ_KEY` | Long random string gating the sync. Must match a Script Property named `READ_KEY` in the Apps Script project. |
| `DASHBOARD_USERS` | Only read once, by `node db/migrate.js`, to seed your first admin if `app_users` is empty. Safe to delete afterward. |

```bash
cp .env.example .env.local
# fill in real values, then:
node db/migrate.js   # creates the schema, seeds an admin from DASHBOARD_USERS
vercel dev
```

**Important for `vercel dev`:** a plain `.env.local` is *not* enough for the Edge Functions under local dev — Vercel's local Edge runtime only sees variables actually registered for the `development` environment, not arbitrary `.env.local` contents. Register each one once:

```bash
for var in NEON_URL SESSION_SECRET APPS_SCRIPT_URL SHEET_READ_KEY DASHBOARD_USERS; do
  grep "^$var=" .env.local | cut -d= -f2- | vercel env add "$var" development
done
```

(In the real Vercel deployment, add the same variables for Production/Preview the normal way — Project Settings → Environment Variables.)

`.env.local` is git-ignored — never commit it.

## 3. Database

Schema lives in `db/schema.sql` (three tables: `app_users`, `website_leads`, `school_registrations`). Apply it — and seed a first admin from `DASHBOARD_USERS` if `app_users` is still empty — with:

```bash
node db/migrate.js
```

It's idempotent (`create table if not exists`), safe to re-run any time you pull schema changes.

> **Neon Auth note:** this Neon project already has Neon's managed-auth schema provisioned (`neon_auth.*`, visible via the Neon console's Auth tab) — but that's Neon's own *hosted* auth service, requiring a `NEON_AUTH_BASE_URL` and a cookie secret from Console → Auth → Configuration that weren't available when this was built. The roles system above uses a plain `app_users` table with its own PBKDF2 password hashing and the same signed-cookie session mechanism as before — genuinely real accounts, stored in the same Neon database, just not Neon's specific hosted product. Swapping to the managed service later is a contained change (only `api/login.js`/`api/_session.js`), not a rewrite of the roles/permissions logic.

## 4. Connect "Sync to Sheets" to Google Sheets

Sheets is optional now — only the admin-only "Sync to Sheets" button uses it, wholesale-replacing the sheet's contents from Postgres. If you want it:

1. Go to https://sheets.google.com and create a new spreadsheet.
2. In the sheet, go to Extensions → Apps Script.
3. Delete any starter code, then paste in the contents of `apps-script/Code.gs`.
4. Deploy → New deployment → gear icon → Web app. Execute as Me, access Anyone.
5. Authorize when prompted (Advanced → Go to [project] → Allow — expected for your own script).
6. Project Settings → Script properties → add `READ_KEY`, same value as `SHEET_READ_KEY`.
7. Copy the Web app URL into `APPS_SCRIPT_URL`.
8. From the dashboard's Sync to Sheets page, run a sync and confirm the "Website Leads" and "School Registrations" tabs populate.

Whenever you edit `Code.gs`, redeploy it (Deploy → Manage deployments → Edit → New version → Deploy) — saving alone doesn't update the live URL.

## 5. Deploying to Vercel

1. Push this project to a Git repo and import it into Vercel (or run `vercel` from this directory).
2. Add the environment variables from §2 in Project Settings → Environment Variables (Production/Preview).
3. Deploy. Vercel auto-detects the static files and everything under `api/` as Edge Functions — no build command or `vercel.json` needed.
4. Run `node db/migrate.js` once (pointed at the same `NEON_URL`) to set up the schema and your first admin.

`dashboard.html` isn't linked from the public site and carries `<meta name="robots" content="noindex, nofollow">` — share its URL with staff directly.

## 6. Project structure

```
index.html                The public site
dashboard.html             Staff dashboard — sidebar shell, all panels
css/styles.css              Shared styling (brand tokens, layout, responsive rules)
css/dashboard.css           Dashboard-only styling (sidebar, stat cards, tables, users)
js/main.js                   Mobile menu, scroll-reveal, public quick-lead form submit
js/dashboard.js              Auth/session, sidebar nav, Home analytics, tables, Users, Sync
api/register.js              Writes a submission to Postgres (website_leads or school_registrations)
api/leads.js                 Session+role+district-gated reader for either Postgres table
api/analytics.js             Session+role+district-gated aggregates for the Home page
api/login.js                 Checks app_users (Postgres), issues a signed session cookie
api/logout.js                Clears the session cookie
api/whoami.js                Lets dashboard.html check for an existing session on load
api/users.js                 Admin-only CRUD over app_users
api/sync-sheets.js            Admin-only: pushes Postgres data into Google Sheets
api/_session.js               Shared HMAC session-signing helpers
api/_auth.js                  Password hashing (PBKDF2) + ROLE_NAV permissions table
api/_db.js                    Shared Neon connection helper
db/schema.sql                 Table definitions
db/migrate.js                 Applies schema.sql, seeds a first admin from DASHBOARD_USERS
db/create-user.js             CLI to create/update a dashboard user
images/                       01_NavaDishe_emblem_icon.png (site logo/favicon), 02_News1st_logo.png (partner), stock photography
apps-script/Code.gs            Google Apps Script source — paste into script.google.com
.env.example                   Template for the local .env.local (git-ignored)
```

## 7. Image credits

Photography sourced from [Pexels](https://www.pexels.com) under the Pexels License (free for commercial use, no attribution required).
