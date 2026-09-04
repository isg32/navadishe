# Nava Dishe — Setup

A **Next.js** (App Router) app: the public site plus a login-gated internal **dashboard** for News First staff. **Neon Postgres is the source of truth** for both forms; Google Sheets is an optional, admin-triggered export ("Sync to Sheets" in the dashboard), not written on every submission.

- `/` — the public site. Its registration section is a quick lead form: Name, District, Phone, "request a callback" → `website_leads` table.
- `/dashboard` — staff-only, behind real login (`app_users` table, not an env-var dictionary). A sidebar (drawer + hamburger on mobile) with:
  - **Home** — an analytics screen: totals, board/district breakdowns, recent activity. Scoped to what the signed-in user is allowed to see.
  - **New Registration** — the full Disha-style form → `school_registrations` table.
  - **Registrations** / **From Website** — searchable, sortable, filterable tables over the two Postgres tables.
  - **Users** (admin only) — create logins, set roles and district access.
  - **Sync to Sheets** (admin only) — pushes the current Postgres data into the Google Sheet.

Nothing secret ever reaches the browser — the Neon connection string, Apps Script URL, and session-signing secret are all read server-side (Route Handlers under `app/api/*`, and `proxy.js` for the dashboard's auth gate) from environment variables.

The previous plain-HTML implementation (static `index.html`/`dashboard.html`, vanilla JS, Vercel Edge Functions under `api/`) is preserved under `archive-static-html/` for reference — this rewrite ports it 1:1 in content and design, just as React components.

## 1. Roles

Set on each row in `app_users`, enforced both server-side (every `app/api/*/route.js`, plus `proxy.js` blocking page access) and in the sidebar:

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
npm install
npm run dev
```

Next.js reads `.env.local` natively — no extra registration step needed for local dev (unlike the old Vercel-Edge-Function setup, where `vercel dev` only saw variables registered per-environment via `vercel env add`). In the real Vercel deployment, add the same five variables in Project Settings → Environment Variables (Production/Preview).

`.env.local` is git-ignored — never commit it.

## 3. Database

Schema lives in `db/schema.sql` (three tables: `app_users`, `website_leads`, `school_registrations`). Apply it — and seed a first admin from `DASHBOARD_USERS` if `app_users` is still empty — with:

```bash
node db/migrate.js
```

It's idempotent (`create table if not exists`), safe to re-run any time you pull schema changes.

> **Neon Auth note:** this Neon project already has Neon's managed-auth schema provisioned (`neon_auth.*`, visible via the Neon console's Auth tab) — but that's Neon's own *hosted* auth service, requiring a `NEON_AUTH_BASE_URL` and a cookie secret from Console → Auth → Configuration that weren't available when this was built. The roles system above uses a plain `app_users` table with its own PBKDF2 password hashing and the same signed-cookie session mechanism as before — genuinely real accounts, stored in the same Neon database, just not Neon's specific hosted product. Swapping to the managed service later only touches `lib/session.js`/`app/api/login/route.js`, not the roles/permissions logic.

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
3. Deploy. Vercel auto-detects Next.js from `package.json`/`next.config.js` — no extra config needed.
4. Run `node db/migrate.js` once (pointed at the same `NEON_URL`) to set up the schema and your first admin.

`/dashboard/*` isn't linked from the public site and carries `robots: {index: false}` metadata — share its URL with staff directly.

## 6. Project structure

```
app/layout.jsx                  Root layout — fonts (next/font), global <head> metadata/SEO/OG
app/page.jsx                    The public site — assembles components/site/*
app/globals.css                  Site-wide styling (brand tokens, layout, responsive rules)
components/site/                 One component per section (Hero, About, Eligibility, ...);
                                  Masthead and RegisterForm are 'use client' (interactive)

app/dashboard/layout.jsx         Shared by /dashboard/login and the shell — just the CSS import
app/dashboard/dashboard.css       Dashboard-only styling (sidebar, stat cards, tables, users)
app/dashboard/login/page.jsx      Login page
app/dashboard/(shell)/layout.jsx  Sidebar + topbar shell (client component: whoami, hamburger)
app/dashboard/(shell)/page.jsx           Home — analytics
app/dashboard/(shell)/new/page.jsx       New Registration
app/dashboard/(shell)/registrations/…    Registrations table
app/dashboard/(shell)/leads/…            From Website table
app/dashboard/(shell)/users/…            Users management (admin only)
app/dashboard/(shell)/sync/…             Sync to Sheets (admin only)
components/dashboard/             Shared pieces: SessionContext, StatCard, MiniTable,
                                   DetailOverlay, RegisterForm (the dashboard's full form)
hooks/useTableState.js            Client-side search/sort/filter, shared by both tables

proxy.js                          Dashboard auth gate (Next 16's "proxy", formerly middleware.js):
                                   redirects unauthenticated requests, and blocks page access
                                   by role (belt-and-suspenders on top of every route handler)

app/api/register/route.js         Writes a submission to Postgres (website_leads or school_registrations)
app/api/leads/route.js            Session+role+district-gated reader for either Postgres table
app/api/analytics/route.js        Session+role+district-gated aggregates for the Home page
app/api/login/route.js            Checks app_users (Postgres), issues a signed session cookie
app/api/logout/route.js           Clears the session cookie
app/api/whoami/route.js           Lets the dashboard shell check for an existing session on load
app/api/users/route.js            Admin-only CRUD over app_users
app/api/sync-sheets/route.js      Admin-only: pushes Postgres data into Google Sheets
lib/session.js                    Shared HMAC session-signing helpers
lib/auth.js                       Password hashing (PBKDF2) + ROLE_NAV permissions table
lib/db.js                         Shared Neon connection helper
lib/format.js                     formatDate()

db/schema.sql                     Table definitions
db/migrate.js                     Applies schema.sql, seeds a first admin from DASHBOARD_USERS
db/create-user.js                 CLI to create/update a dashboard user

public/images/                    01_NavaDishe_emblem_icon.png (site logo/favicon),
                                   02_News1st_logo.png (partner), stock photography
apps-script/Code.gs                Google Apps Script source — paste into script.google.com
.env.example                       Template for the local .env.local (git-ignored)
archive-static-html/               The previous static-HTML implementation, kept for reference
```

## 7. Image credits

Photography sourced from [Pexels](https://www.pexels.com) under the Pexels License (free for commercial use, no attribution required).
