# Nava Dishe — Setup

A single-page marketing site for **Nava Dishe**, presented by News First — static HTML/CSS/vanilla JS, plus one small serverless function. Ends in a school registration form that writes submissions into a Google Sheet via a Google Apps Script web app.

The Apps Script web app URL is a credential the browser must never see, so it's kept server-side: `api/register.js` (a Vercel Edge Function) reads it from an environment variable and proxies the form submission. The client only ever talks to `/api/register` on your own domain — the real URL never appears in any file that ships to the browser.

## 1. Deploying to Vercel

1. Push this project to a Git repo and import it into Vercel (or run `vercel` from this directory).
2. In Vercel → Project Settings → Environment Variables, add `APPS_SCRIPT_URL` with your deployed Apps Script web app URL (see §2 below for how to get one).
3. Deploy. Vercel auto-detects `index.html`/`css`/`js`/`images` as static output and `api/register.js` as a serverless function — no build command or `vercel.json` needed.

## 2. Running locally

```bash
cp .env.example .env.local
# edit .env.local and paste your real Apps Script URL in place of the placeholder
vercel dev
```

`vercel dev` serves the static site and runs `api/register.js` locally, reading `APPS_SCRIPT_URL` from `.env.local`. `.env.local` is git-ignored — never commit it.

If you just want to preview the static pages without the form working, you can instead run `python3 -m http.server` — but the registration form's POST to `/api/register` will 404 without `vercel dev` or a real Vercel deployment behind it.

## 3. Connect the registration form to Google Sheets

1. Go to https://sheets.google.com and create a new spreadsheet — name it e.g. "Nava Dishe Registrations".
2. In the sheet, go to Extensions → Apps Script.
3. Delete any starter code, then paste in the contents of `apps-script/Code.gs`.
4. Click Deploy → New deployment.
5. Click the gear icon next to "Select type" → choose Web app.
6. Set "Execute as" to Me, and "Who has access" to Anyone.
7. Click Deploy, and authorize the script when prompted (you'll see an "unverified app" warning — click Advanced → Go to [project name] → Allow; this is expected for your own script).
8. Copy the Web app URL you're given — this is the value that goes into `APPS_SCRIPT_URL` (§1 and §2 above), never into a committed file.
9. Submit a test entry from the live form and confirm a new row appears in the "Registrations" tab of your sheet.

Whenever you edit Code.gs later, you must go to Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy for the changes to go live — saving the script alone does not update the deployed web app.

## 4. Project structure

```
index.html              The whole page — structure and copy
css/styles.css           All styling (colors, type, layout, responsive rules)
js/main.js                Mobile menu, scroll-reveal, registration form submit handler
api/register.js           Vercel Edge Function — proxies the form POST, keeps APPS_SCRIPT_URL server-side
images/                   Stock photography (Pexels, free license) + favicon.svg
apps-script/Code.gs        Google Apps Script source — paste into script.google.com
.env.example               Template for the local .env.local (git-ignored)
```

## 5. Image credits

Photography sourced from [Pexels](https://www.pexels.com) under the Pexels License (free for commercial use, no attribution required).
