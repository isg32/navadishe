# Nava Dishe — Setup

A single-page marketing site for **Nava Dishe**, presented by News First, plus a login-gated internal **dashboard** (`dashboard.html`) for staff. Both write into the same Google Sheet (via a Google Apps Script web app), but into two separate tabs:

- `index.html` — the public site. Its registration section is a quick lead form: Name, District, Phone, "request a callback". Rows land in the **"Website Leads"** sheet tab.
- `dashboard.html` — staff-only. After signing in, staff can (1) fill in the full Disha-style registration form once a school is confirmed — rows land in the **"School Registrations"** sheet tab — and (2) search/sort/filter each of those two tabs in its own table.

None of the following are ever visible to a browser: the Apps Script URL, the dashboard login credentials, or the session-signing secret. Each is read server-side by a Vercel Edge Function from an environment variable.

## 1. Deploying to Vercel

1. Push this project to a Git repo and import it into Vercel (or run `vercel` from this directory).
2. In Vercel → Project Settings → Environment Variables, add the four variables described in §2 below.
3. Deploy. Vercel auto-detects `index.html`/`dashboard.html`/`css`/`js`/`images` as static output and everything under `api/` as serverless functions — no build command or `vercel.json` needed.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local testing, and set the same four in Vercel for production:

| Variable | What it's for |
|---|---|
| `APPS_SCRIPT_URL` | Your deployed Apps Script web app URL (§3). |
| `DASHBOARD_USERS` | A JSON object of dashboard logins, e.g. `{"admin":"a-real-password","priya":"another-password"}`. Add or remove staff by editing this — no code changes. |
| `SESSION_SECRET` | A long random string used to sign the dashboard's login session cookie. Generate one with `openssl rand -hex 32`. |
| `SHEET_READ_KEY` | A long random string that lets the dashboard *read* sheet rows. Must exactly match a Script Property of the same name in the Apps Script project (§3, step 8). |

```bash
cp .env.example .env.local
# fill in real values, then:
vercel dev
```

`vercel dev` serves the static site and runs everything under `api/` locally. `.env.local` is git-ignored — never commit it.

If you just want to preview the static pages, `python3 -m http.server` also works — but the registration form and the whole dashboard need `vercel dev` (or a real deployment) since they depend on the `api/` functions.

## 3. Connect it to Google Sheets

1. Go to https://sheets.google.com and create a new spreadsheet — name it e.g. "Nava Dishe Registrations".
2. In the sheet, go to Extensions → Apps Script.
3. Delete any starter code, then paste in the contents of `apps-script/Code.gs`.
4. Click Deploy → New deployment.
5. Click the gear icon next to "Select type" → choose Web app.
6. Set "Execute as" to Me, and "Who has access" to Anyone.
7. Click Deploy, and authorize the script when prompted (you'll see an "unverified app" warning — click Advanced → Go to [project name] → Allow; this is expected for your own script).
8. In the Apps Script editor, go to Project Settings → Script properties → Add script property. Add one named `READ_KEY`, with the **same value** as `SHEET_READ_KEY` in your `.env.local` / Vercel env vars. This is what stops anyone who merely finds the Apps Script URL from reading your data — only requests carrying the matching key can list rows.
9. Copy the Web app URL you're given — this is the value that goes into `APPS_SCRIPT_URL`, never into a committed file.
10. Submit a test entry from the live site and confirm a new row appears in the "Website Leads" tab, and a dashboard entry appears in "School Registrations" — both tabs are created automatically the first time each form is used.

Whenever you edit `Code.gs` later, you must go to Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy for the changes to go live — saving the script alone does not update the deployed web app.

## 4. Using the dashboard

Visit `/dashboard.html` and sign in with one of the `DASHBOARD_USERS` credentials. Nothing under it is indexed by search engines (`<meta name="robots" content="noindex, nofollow">`), but it isn't linked from the public site either — share the URL directly with staff.

- **New Registration** — the full form (school, principal, coordinator, student strength, News First/vendor coordination, test date). Saves to the "School Registrations" sheet tab. The form resets after each save so staff can enter several schools in a row.
- **Registrations** — every row from "School Registrations", with free-text search, column sorting, and a board filter. Click a row for its full details.
- **From Website** — every row from "Website Leads" (the public quick-lead form), with free-text search, column sorting, and a callback-requested filter.

## 5. Project structure

```
index.html                The public site — structure and copy
dashboard.html             Staff dashboard — login, entry form, and registrations table
css/styles.css              Shared styling (colors, type, layout, responsive rules)
css/dashboard.css           Dashboard-only styling (login card, tabs, table)
js/main.js                   Mobile menu, scroll-reveal, public quick-lead form submit
js/dashboard.js              Login, tab switching, entry form submit, table search/sort/filter
api/register.js              Vercel Edge Function — proxies form POSTs, keeps APPS_SCRIPT_URL server-side
api/login.js                 Vercel Edge Function — checks DASHBOARD_USERS, issues a signed session cookie
api/logout.js                Vercel Edge Function — clears the session cookie
api/whoami.js                Vercel Edge Function — lets dashboard.html check for an existing session on load
api/leads.js                 Vercel Edge Function — session-gated proxy that lists rows for either sheet tab (?sheet=website|dashboard)
api/_session.js              Shared HMAC session-signing helpers used by the four api/*.js above
images/                      Stock photography (Pexels, free license) + favicon.svg
apps-script/Code.gs           Google Apps Script source — paste into script.google.com
.env.example                  Template for the local .env.local (git-ignored)
```

## 6. Image credits

Photography sourced from [Pexels](https://www.pexels.com) under the Pexels License (free for commercial use, no attribution required).
