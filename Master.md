# MASTER PROMPT — Build the "Nava Dishe" Landing Page

Paste everything below this line into the other AI as a single message. It is fully self-contained — all content, copy, design tokens, and code are included. Do not ask clarifying questions; where something is ambiguous, make the decision that best matches the design system and instructions below.

---

## 1. What you're building

A single-page, static marketing/lead-gen website for **Nava Dishe**, a free, statewide "mega-scholarship and talent recognition exam" for Class 10–12 students in Karnataka, India, presented by a media company called **News First**. The page introduces the exam, builds trust and urgency, and ends with a **school registration form** that writes submissions into a **Google Sheet via a Google Apps Script web app** (no other backend).

This is a **static site**: plain HTML/CSS/vanilla JS. No frameworks, no build step, no npm install required to run it — it should open directly in a browser or deploy as-is to any static host (Netlify, Vercel, GitHub Pages).

## 2. Deliverables

Produce these files, cleanly separated:

```
index.html
/css/styles.css
/js/main.js
/apps-script/Code.gs        (Google Apps Script source, for the user to paste into script.google.com)
README.md                    (setup instructions — see section 8)
```

Inline critical CSS is not required — a linked stylesheet is fine. Keep JS dependency-free (no jQuery, no build tools). You may use a CDN for an icon set (see §5) and for Google Fonts.

## 3. Design system — follow this exactly

Use the design tokens and rules below as the single source of truth for all visual decisions (color, type, spacing, radius, shadow, components). **Do not** invent a different palette or typography.

```yaml
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  primary: '#0037b1'
  on-primary: '#ffffff'
  primary-container: '#1f4fd8'
  on-primary-container: '#ccd4ff'
  inverse-primary: '#b7c4ff'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#ff7a19'
  on-secondary-container: '#5e2700'
  tertiary: '#7f2700'
  on-tertiary: '#ffffff'
  tertiary-container: '#a73600'
  on-tertiary-container: '#ffcab9'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  background: '#FFFFFF'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  success: '#10B981'

typography:
  display-lg:    { font: 'Plus Jakarta Sans', size: 48px, weight: 700, lineHeight: 60px, tracking: -0.02em }
  headline-lg:   { font: 'Plus Jakarta Sans', size: 32px, weight: 700, lineHeight: 40px, tracking: -0.01em }
  headline-lg-mobile: { font: 'Plus Jakarta Sans', size: 28px, weight: 700, lineHeight: 36px }
  headline-md:   { font: 'Plus Jakarta Sans', size: 24px, weight: 600, lineHeight: 32px }
  body-lg:       { font: 'Inter', size: 18px, weight: 400, lineHeight: 28px }
  body-md:       { font: 'Inter', size: 16px, weight: 400, lineHeight: 24px }
  label-md:      { font: 'Inter', size: 14px, weight: 500, lineHeight: 20px, tracking: 0.01em }
  label-sm:      { font: 'Inter', size: 12px, weight: 600, lineHeight: 16px }

rounded: { sm: 0.25rem, DEFAULT: 0.5rem, md: 0.75rem, lg: 1rem, xl: 1.5rem, full: 9999px }

spacing:
  base: 8px, xs: 4px, sm: 12px, md: 24px, lg: 48px, xl: 80px
  container-max: 1280px, gutter: 24px
```

**Brand & style direction:** Corporate / Modern. High-trust educational platform. Deep primary blue (`#1F4FD8`) for institutional authority and navigation/interactive states, energetic orange (`#FF7A18`) reserved for CTAs, progress indicators, and milestone highlights. Generous whitespace, structured grid, no visual clutter. `#F0F4FF` soft tint for card backgrounds and section offsets.

**Typography pairing:** Headlines in **Plus Jakarta Sans** (weights 600–700, uppercase not required — this is a friendly geometric sans, not the condensed serif look), body copy in **Inter** at 400 weight. Label/UI text is tighter, sometimes uppercase, to separate functional UI from narrative copy. Load both from Google Fonts.

**Layout:** 12-column grid, 1280px max-width, 24px gutters, 48px outer margins on desktop (≥1280px). 8-column fluid grid, 24px gutters, 32px margins on tablet (768–1279px). 4-column fluid grid, 16px gutters/margins on mobile (≤767px). Vertical rhythm between sections: 48px mobile → 80px desktop.

**Elevation:** Base background `#FFFFFF`. Subtle sectioning uses `#F0F4FF`. Cards use `box-shadow: 0 4px 20px rgba(31,79,216,0.08)`. Modals/overlays (e.g. mobile menu) use `0 12px 32px rgba(0,0,0,0.12)`. Avoid heavy borders — use `#E2E8F0` hairlines only where needed against white.

**Shapes:** Buttons/inputs/small cards: 8px radius. Hero sections/large cards: 16px radius. Search bars, status chips, pills: fully rounded. Icons should have slightly rounded terminals (use a rounded-style icon set, e.g. Lucide with `stroke-linecap="round"`).

**Components:**
- **Primary button:** solid `#1F4FD8` bg, white text, 8px radius, medium/high emphasis.
- **Secondary button:** solid `#FF7A18` bg, white text — for "Register" / "Start Now" / high-priority actions.
- **Outline button:** 2px `#1F4FD8` border, `#1F4FD8` text, transparent bg — for secondary page actions.
- **Inputs:** 1px `#CBD5E1` border, 8px radius, 12px horizontal padding; focus state = 2px `#1F4FD8` border + soft blue outer glow.
- **Cards:** white bg, 16px radius, Level-2 shadow. Featured/header cards may use `#F0F4FF` tint.
- **Chips/Tags:** 8px radius, light primary-blue bg (`#E0E7FF`), dark blue text.
- **Progress bars:** linear, orange (`#FF7A18`) fill.

## 4. Where the content comes from (and how to treat it)

Two source files informed this brief:

1. **A slide deck** containing the full marketing copy for Nava Dishe (an illustrated, vintage-editorial-styled PowerPoint — think sepia newspaper aesthetic, hand-illustrated students, OMR sheets, Karnataka landmarks). **Use only the text/copy and factual content from it — all of it is transcribed for you in §6 below, so you don't need the original file.** Do **not** try to reproduce its illustrated art style or its images — they clash with the corporate/modern design system in §3. Each "slide" in that deck is a single flattened illustration (no separate logo/photo assets exist to extract), so there is nothing usable to lift as an image asset.
2. **A reference HTML file** that shows one possible site *structure* (section order, section headings, a registration CTA, a footer with three link columns, sticky nav, mobile burger menu, scroll-reveal animation). **Reuse its information architecture and interaction patterns — ignore its fonts, colors, and vintage-newspaper visual style entirely.** Rebuild every section visually from scratch using the §3 design system.

**No photography or illustration assets are available.** Do not source stock photos. Build the page as a clean, **icon- and shape-driven** design instead:
- Use an icon library via CDN for all iconography — **Lucide** is recommended (`https://unpkg.com/lucide@latest/dist/umd/lucide.js` or the static SVG sprite), rounded stroke style, colored to match tokens (primary blue or secondary orange on tint backgrounds).
- Where the reference site used a photo, substitute a composition of: a soft gradient/blob shape in `primary-container`/`secondary-container` tones, a large icon or icon badge, a stat number, or a simple custom SVG (e.g., a minimal Karnataka state outline with 8 labeled city dots for the "Reach" section — draw this as an inline SVG path, stylized/simplified is fine, colored `primary-container` fill with white dots).
- **Logo:** there is no logo file. Build a simple wordmark lock-up: a rounded-square badge (`primary` bg, 12px radius) containing a small graduation-cap icon in white, next to the text "Nava Dishe" set in Plus Jakarta Sans 700. Use this same mark as the favicon (inline SVG saved as `favicon.svg`, referenced in `<head>`).

## 5. Icons

Use Lucide (or an equivalent rounded-line icon set) via CDN for: graduation cap (logo/hero), rupee/coin (rewards pool), clock (exam duration), file-check/list-checks (MCQs/marks), shield-off or ban (no negative marking), book-open (English), puzzle/brain (reasoning), globe/newspaper (general awareness), map-pin (reach/cities), award/medal (rewards), bike, laptop, tablet-smartphone, watch (reward icons), building-2/school (partner schools), users (partners), check-circle (steps/form success), send (form submit). Keep stroke width consistent (≈1.75–2px) across the whole page.

## 6. Full site content, section by section

Build the page in this exact order. All copy below is final — use it verbatim unless a field explicitly says otherwise. Section IDs are given for anchor links.

### Sticky header / masthead
- Thin utility bar above the nav: left `Karnataka Edition · 2026`, right `A News First Initiative` (small, muted label-sm text).
- Nav row: logo lock-up (left) · center/right nav links: `About` `Eligibility` `Exam Pattern` `Rewards` `Reach` `Partners` `How to Join` (anchor to `#about #eligibility #pattern #rewards #reach #partners #join`) · right-aligned primary button `Register Your School` linking to `#register`.
- Collapses to a hamburger menu below 980px, opening a full-width dropdown panel (same link list, stacked) with the Level-3 overlay shadow.
- Sticky on scroll, white background, subtle bottom hairline once scrolled.

### Hero
- Eyebrow label: `Presented by News First`
- H1 (display-lg / headline-lg, scales up on desktop): `Nava Dishe`
- Subhead (label-md, uppercase, muted): `Annual Mega-Scholarship & Talent Recognition Exam`
- Pull-quote (italic-styled body-lg or a serif fallback is fine here as the one intentional accent, in `on-surface-variant`): *"A statewide search for Karnataka's brightest minds."*
- Two CTAs: primary button `Register Your School` → `#register`; outline button `Explore the Exam` → `#about`.
- Right side: a hero visual built from shapes/icons per §4 (no photo) — e.g. a large soft blue blob with a graduation-cap icon, an orange "Free to Enter" badge/pill overlapping the corner.
- Below the fold of the hero, a **stat strip** (dark `inverse-surface` or `primary` background, 4 equal columns, divided by hairlines): 
  - `₹1 Cr` — Total Rewards Pool
  - `Karnataka` — Statewide Exam
  - `10–12` — Class Eligibility
  - `₹0` — Entry Fee

### About — `#about`
- Eyebrow: `About the Exam`
- H2: `What is Nava Dishe?`
- Intro line next to heading: `A talent movement built for every classroom in Karnataka — not just the ones that can afford it.`
- Body copy (two paragraphs):
  1. "Nava Dishe is an annual, free-of-cost talent recognition exam open to high-school students across Karnataka. It's built as a benchmarking platform — one that measures critical thinking, aptitude and general awareness, while removing the financial barriers that usually stand between a student and a fair shot."
  2. "No coaching-class fees. No entry cost. Just a single, well-designed paper that lets ability speak for itself."
- Three chips: `Free to Enter` · `Merit-Based` · `Statewide Reach`
- Companion visual: a stylized OMR answer-sheet card (build with CSS/HTML — a white card, 16px radius, Level-2 shadow, rows of small circular "bubbles" with a couple filled in primary/orange to look authentic) — this is a graphic you construct with divs, not an image.

### Eligibility — `#eligibility` (use `surface-container-low`/`#F0F4FF` section background)
- Eyebrow: `Who Can Participate`
- H2: `Open Doors, Zero Fees`
- Sub-line: `Open to all high-school and higher-secondary students, regardless of board.`
- Two large cards side by side:
  - Card 1 — tag `Category 1`, big number `10`, caption `Class 10 Students`
  - Card 2 — tag `Category 2`, big number `11/12`, caption `Class 11 & 12 Students`
- Boards row beneath, centered, label-md uppercase: `CBSE` · `ICSE` · `State Boards`

### Exam pattern — `#pattern`
- Eyebrow: `The Exam at a Glance`
- H2: `Familiar Format, Real Stakes`
- Sub-line: `Offline · OMR-based · conducted right on school campuses.`
- 4-cell stat grid (bordered/card grid): `40` Minutes · `40` MCQs · `80` Total Marks · `0` Negative Marking (make this last cell's number secondary/orange to flag it as the reassuring stat).
- Pull-quote beside or beneath: *"A familiar OMR-based experience, designed to mirror real competitive exams."*

### Three pillars (no separate H2 anchor needed, place right after pattern; use `surface-container-low` background)
- Eyebrow: `What Every Student Is Evaluated On`
- H2: `Three Pillars of the Test`
- Sub-line: `A statewide benchmark of competitive readiness.`
- Three columns, each with an icon badge, index label, title, description:
  1. `01 / English` — **English** — "Comprehension, grammar and vocabulary fundamentals."
  2. `02 / Reasoning` — **Logical Reasoning** — "Pattern recognition, deduction and analytical thinking."
  3. `03 / Awareness` — **General Awareness & Aptitude** — "Current affairs, civics, and quantitative aptitude."
- Closing line under the grid: *"A statewide benchmark of competitive readiness."* (only include once — either as sub-line or closing line, don't repeat both)

### ₹1 Crore highlight — full-bleed dark section (`primary` or `inverse-surface` background, white/on-primary text)
- Small label: `Total Scholarship & Rewards Pool`
- Huge display figure: `₹1 Crore` (largest type on the page, display-lg scaled way up, rupee symbol in secondary/orange)
- Right-aligned or stacked list with orange bullet dots: `For Karnataka's Brightest` · `Across the State` · `Awarded to Class 10 / 11 / 12 Toppers`
- Caption: "A scholarship movement on a statewide scale."

### Rewards — `#rewards`
- Eyebrow: `State Rankers Win Life-Upgrade Prizes`
- H2: `Rewards for the Toppers`
- Sub-line: `Every prize is designed to power what comes next.`
- 4 cards in a row (2×2 on mobile), each: rounded rank pill badge, icon, title:
  1. `State 1st` — bike icon — **E-Bike / Electric Scooter**
  2. `State 2nd` — laptop icon — **Laptop**
  3. `State 3rd` — tablet-smartphone icon — **Tablet / Smartphone**
  4. `Also Awarded` — watch icon — **Smartwatch + Career Counselling**
- Hover state: card lifts slightly with a stronger shadow.

### Reach — `#reach` (`surface-container-low` background)
- Eyebrow: `News First's Home State`
- H2: `Across Karnataka`
- Sub-line: `A focused regional reach — touching hundreds of thousands of students.`
- Two-column layout: left = list of 8 cities with a map-pin icon each (`Belagavi`, `Hubballi-Dharwad`, `Kalaburagi`, `Shivamogga`, `Udupi`, `Mangaluru`, `Mysuru`, `Bengaluru`); right = the simplified inline-SVG Karnataka outline described in §4 with 8 dots roughly positioned and labeled to match the list.

### Partners — `#partners`
- Eyebrow: `Building the Bridge from Exam to Career`
- H2: `An Ecosystem of Partners`
- Sub-line: `Where a single test opens many doors.`
- Four category blocks (cards or bordered panels), each with a small orange label pill + partner names as a text list (no logos available — just typeset names clearly, Plus Jakarta Sans 600–700):
  1. **Civil Services** — Drishti IAS
  2. **Defence** — Centurion Defence Academy, Dreamers
  3. **Coaching & Technology** — PhysicsWallah (Vidyapeeth), Saffalta, Scholars Den
  4. **University Partners** — Galgotias University, Chandigarh University, GLA University, Graphic Era University

### How schools join — `#join` (`surface-container-low` background)
- Eyebrow: `A Bulk-Enrolment Drive, Not an Individual Sign-Up`
- H2: `How Schools Join`
- Sub-line: `Designed to reach hundreds of thousands of students — together.`
- 4-step horizontal process (numbered, icon per step):
  1. `Step 01` **Partner School Connects** — "School coordinates with its local News First bureau."
  2. `Step 02` **On-Campus Exam Day** — "Nava Dishe is conducted at the school using OMR sheets."
  3. `Step 03` **Evaluation & Ranking** — "Papers are graded; state-level ranks are determined."
  4. `Step 04` **Online Results Dashboard** — "Score dashboards are published on the official Nava Dishe portal."
- Centered CTA button below: `Register Your School Today` → `#register`

### Register — `#register` (NEW section — this did not exist in the reference site; build it as specified in §7)
Card/panel titled **Register Your School**, sub-line: `Tell us about your school and our Karnataka bureau team will get in touch to schedule your exam day.` Contains the form specified in §7.

### Final CTA (full-width, `surface-container-low` or a soft gradient of `primary-container`)
- Eyebrow: `The Mission`
- H2 (large): `Give every student a ` + orange-accented `fair` + ` shot.`
- Italic/serif-style body copy: "Nava Dishe is more than an exam. It is a doorway — to scholarships, to mentors, to a future built on merit, not means."
- Inline stat row: `Free to Enter` · `₹1 Crore in Rewards` · `Open to Class 10–12`
- Primary button: `Partner With News First` → `#register`

### Footer
- Brand column: logo lock-up + `Nava Dishe is an annual, free-of-cost scholarship and talent recognition exam by News First, open to Class 10–12 students across Karnataka.`
- Column "Explore": `About the Exam` `Eligibility` `Exam Pattern` `Rewards`
- Column "Programme": `Our Reach` `Partners` `How Schools Join`
- Column "Partner With Us": `Register Your School` `Download Info Kit` `Contact the Bureau`
- Bottom bar: `© 2026 Nava Dishe · A News First Initiative`  ·  `Karnataka State · Class 10–12 · Free to Enter`
- Dark background (`inverse-surface` or `primary`), light text, orange link-hover state.

Page `<title>`: `Nava Dishe — Annual Mega-Scholarship & Talent Recognition Exam`
Meta description: `Nava Dishe by News First — a free, statewide scholarship and talent recognition exam for Class 10–12 students across Karnataka. ₹1 Crore in total rewards.`

## 7. Registration form → Google Sheets (via Apps Script)

Build a real `<form id="registerForm">` inside the `#register` section with these fields (use these exact `name` attributes):

| Field | `name` | Type | Required |
|---|---|---|---|
| School Name | `schoolName` | text | yes |
| Contact Person | `contactName` | text | yes |
| Designation | `designation` | text (e.g. Principal, Coordinator) | no |
| Phone Number | `phone` | tel | yes |
| Email Address | `email` | email | yes |
| City / District | `city` | select — options: the 8 cities from §6 Reach, plus `Other` | yes |
| Board | `board` | select — options: `CBSE`, `ICSE`, `State Board`, `Other` | yes |
| Participating Class(es) | `classLevel` | select — options: `Class 10`, `Class 11 & 12`, `Both` | yes |
| Approx. Number of Students | `approxStudents` | number | no |
| Message / Notes | `message` | textarea | no |
| Consent | `consent` | checkbox — label: "I agree to be contacted by the News First Nava Dishe team regarding this registration." | yes |
| Spam honeypot | `website` | text input, visually hidden (`position:absolute; left:-9999px` — not `display:none`, and not `type="hidden"`, so real bots fill it but it's invisible to people), `tabindex="-1"`, `autocomplete="off"` | leave empty |

Style the form using the §3 input/button component rules. On submit: disable the button, show a "Submitting…" state, then either a success message (replace the form with a check-icon + "Thank you! Your school's registration has been received. Our team will reach out shortly.") or an inline error message if the request fails.

### 7a. Frontend JS (`/js/main.js`)

```javascript
// ==== Google Apps Script endpoint ====
// Replace with the Web App URL from your Apps Script deployment (see README / §8 below)
const SCRIPT_URL = "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE";

const form = document.getElementById('registerForm');
const formWrap = document.getElementById('registerFormWrap');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if this hidden field got filled, it's a bot — silently stop
    if (form.website && form.website.value) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const formData = new FormData(form);

    try {
      // Apps Script's CORS handling is limited, so we POST as a simple
      // multipart/form-data request in no-cors mode. We can't read the
      // response body, but a resolved fetch (no thrown network error)
      // is a reliable enough signal that the request reached the sheet.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      formWrap.hidden = true;
      statusEl.hidden = false;
      statusEl.className = 'form-status form-status--success';
      statusEl.innerHTML = "Thank you! Your school's registration has been received. Our team will reach out shortly.";
    } catch (err) {
      statusEl.hidden = false;
      statusEl.className = 'form-status form-status--error';
      statusEl.textContent = 'Something went wrong sending your registration. Please try again in a moment.';
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
```

Also include in `main.js`: sticky-header scroll class toggle, mobile menu open/close, smooth-scroll anchor handling, and an `IntersectionObserver`-based scroll-reveal for elements with a `.reveal` class (fade + translateY(18px) → opacity 1 / translateY(0) once ~12% visible; respect `prefers-reduced-motion`).

### 7b. Apps Script backend (`/apps-script/Code.gs`)

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations');
    if (!sheet) {
      sheet = ss.insertSheet('Registrations');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'School Name', 'Contact Person', 'Designation',
        'Phone', 'Email', 'City / District', 'Board',
        'Participating Class(es)', 'Approx. Students', 'Message'
      ]);
    }

    var p = e.parameter;

    // Ignore bot submissions caught by the honeypot field
    if (p.website) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      p.schoolName      || '',
      p.contactName      || '',
      p.designation      || '',
      p.phone            || '',
      p.email             || '',
      p.city              || '',
      p.board             || '',
      p.classLevel        || '',
      p.approxStudents    || '',
      p.message           || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by visiting the web app URL directly in a browser
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'Nava Dishe registration endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 8. README.md — include these setup steps verbatim (for the human, not the AI)

```markdown
# Nava Dishe — Setup

## 1. Connect the registration form to Google Sheets

1. Go to https://sheets.google.com and create a new spreadsheet — name it e.g. "Nava Dishe Registrations".
2. In the sheet, go to Extensions → Apps Script.
3. Delete any starter code, then paste in the contents of `apps-script/Code.gs`.
4. Click Deploy → New deployment.
5. Click the gear icon next to "Select type" → choose Web app.
6. Set "Execute as" to Me, and "Who has access" to Anyone.
7. Click Deploy, and authorize the script when prompted (you'll see an "unverified app" warning — click Advanced → Go to [project name] → Allow; this is expected for your own script).
8. Copy the Web app URL you're given.
9. Open `js/main.js` and replace `PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE` with that URL.
10. Submit a test entry from the live form and confirm a new row appears in the "Registrations" tab of your sheet.

Whenever you edit Code.gs later, you must go to Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy for the changes to go live — saving the script alone does not update the deployed web app.

## 2. Running locally / hosting

This is a fully static site — no build step. Open `index.html` directly, or deploy the folder as-is to Netlify, Vercel, GitHub Pages, or any static host.
```

## 9. Responsive requirements
- Breakpoints at 980px (nav collapses to burger, most grids go from 3–4 cols to 2) and 600px (2 cols → 1 where content-heavy, stat grids stay 2-up).
- Touch targets ≥ 44px on mobile, form fields full-width and stacked.
- Hero visual reflows above the headline on mobile.

## 10. Accessibility
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), one `h1` (hero), sequential `h2`s per section.
- All icons decorative unless meaningful — meaningful icons get `aria-label` or adjacent visible text.
- Form fields have associated `<label>`s (not just placeholders); required fields marked with `aria-required` / native `required`; error/success states are announced via `aria-live="polite"` on `#formStatus`.
- Color contrast must meet the AA targets implied by the design system's on-surface/on-primary pairs — don't put `on-surface-variant` text on `primary-container` backgrounds, etc.
- Focus-visible states on all interactive elements (use the input focus glow style from §3 as the pattern to follow for links/buttons too).

## 11. Before you finish, self-check
- [ ] Every content string in §6 appears on the page, in that order, with no placeholder/lorem text left anywhere.
- [ ] Zero references to photos/images that don't exist — everything renders from CSS/SVG/icons/type.
- [ ] Colors and fonts match §3 exactly (Plus Jakarta Sans headings, Inter body, the blue/orange palette) — no leftover serif/newspaper styling from the old reference site.
- [ ] The registration form's field `name`s exactly match the table in §7 and the `Code.gs` parameter names.
- [ ] `SCRIPT_URL` is clearly marked as a placeholder the user must fill in.
- [ ] Sticky nav, mobile menu, smooth scroll, and scroll-reveal all work.
- [ ] Page is fully responsive at 375px, 768px, 1280px, and 1440px+ widths.
- [ ] `README.md` setup steps are included and accurate.
