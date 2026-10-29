# এআই বন্ধু (AI Bondhu)

A free 30-day Bangla course that teaches AI to ordinary, non-technical people — 10 minutes a day.

It is a plain static website. No build step, no framework, no dependencies, no external
requests. Every page is hand-written HTML sharing one stylesheet and one small script.

Created by **Hasan Shahriar Fahim**, a Bangladeshi software engineer who uses AI daily in his
work and trains his team. Solo project, built at roughly five hours a week.

---

## Who it is for

People in Bangladesh who hear the word "AI" every day but have never used an AI tool. Students,
office workers, teachers, parents, older people. No technical background is assumed and no
English is required — the whole course is in Bangla, and the few English terms that appear
(ChatGPT, Gemini, "prompt") are explained in Bangla each time.

The reader's device is assumed to be a low-end Android phone on a slow mobile connection. That
assumption drives every engineering decision below.

---

## The 30-day structure

Thirty lessons, one per day, each designed to take about 10 minutes. Every day builds on the day
before, so the reader never meets a concept cold.

Each day has the same four-part shape:

1. **আজকের কথা** — the idea, explained as a story or an everyday analogy.
2. **নিজে করুন** (3 minutes) — a hands-on task the reader does alone, with a ready-made Bangla
   prompt they can copy.
3. **একসাথে করুন** (5 minutes) — the same skill practised with another person (a child, a
   parent, a friend, a colleague). Learning together is a deliberate part of the design.
4. **আজকের মূল কথা** — one sentence worth remembering, which also becomes the day's shareable
   quote card.

Around those sit a short opening question, a two-question self-check quiz, and a one-line teaser
for tomorrow.

---

## Design constraints that matter

These are not preferences. Breaking one of them breaks the product for its actual audience.

- **Zero external requests.** No CDN, no web fonts, no analytics scripts, no embedded video, no
  third-party widgets. Everything a page needs ships from the same origin. A page that reaches
  out to a third party will stall or fail on a weak connection, and it leaks the reader to
  someone else's servers.
- **~25KB per page, 2G-friendly.** Pages must stay small enough to open on a slow connection.
  Illustrations are inline SVG, not images. Nothing is lazy-loaded because nothing is heavy.
- **System Bangla fonts only.** The font stack is
  `"Noto Sans Bengali", "Kalpurush", "SolaimanLipi", "Nirmala UI", system-ui, sans-serif` — all
  resolved from the device. No font file is ever downloaded. A downloaded Bangla font would cost
  more than the rest of the page combined.
- **Progressive enhancement — the page works with JavaScript disabled.** The lesson text, the
  prompts, the navigation and the full 30-day index are plain HTML and anchors. JavaScript only
  adds conveniences: font-size control, copy-to-clipboard, step checkboxes, the quiz, and
  progress tracking. With JS off, a `<noscript>` block still lists all 30 days as links.
- **No backend, no accounts, no cookies.** Progress lives in the reader's own browser via
  `localStorage` (keys `aib_font`, `aib_steps`, `aib_done`). Nothing is collected, nothing is
  sent anywhere. Clearing browser data simply resets progress — that is an accepted trade.
- **Accessibility and comfort.** Skip link, visible focus outlines, ARIA labels on controls,
  generous line height, a reader-controlled font size, and tap targets of at least 48px.

---

## Repository layout

```
ai-bondhu/
├─ content/              Source of truth for the lessons (Markdown)
│  ├─ day-01.md … day-30.md
│  └─ landing-copy.md
├─ docs/                 What actually deploys — the published website
│  ├─ index.html         Landing page
│  ├─ din-1.html … din-30.html
│  ├─ 404.html
│  ├─ style.css          One stylesheet for the whole site
│  ├─ script.js          One script, ~5KB, vanilla JS, no dependencies
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ .nojekyll          Tells GitHub Pages not to run Jekyll
├─ README.md
├─ LAUNCH-CHECKLIST.md
├─ EMAIL-CAPTURE.md
└─ .gitignore
```

Two rules about this layout:

- **`content/` is the source of truth for lesson text.** If wording changes, change it there
  first, then carry it into the matching HTML page.
- **`docs/` is the only directory that deploys.** GitHub Pages serves that folder and nothing
  else. `content/` stays in the repository for authoring and history.

Note the filename difference: lessons are authored as `content/day-13.md` (zero-padded) and
published as `docs/din-13.html` (not padded). `din` is the Bangla word দিন, "day".

---

## Running it locally

There is no build step. The simplest way is to open `docs/index.html` in a browser.

To exercise it the way a visitor will — correct relative URLs, a real 404 — serve the folder
over HTTP instead:

```bash
# Python 3 (already present on most machines)
cd site
python -m http.server 8000
# then open http://localhost:8000

# or, with Node installed
npx serve site
```

Testing checklist while developing:

- Use the browser's device emulation to check a narrow phone viewport.
- Throttle the network to "Slow 3G" or lower and confirm the page still appears quickly.
- Open DevTools → Network and confirm **no request leaves the origin**. The only requests should
  be the HTML page, `style.css`, and `script.js`.
- Disable JavaScript and reload. Everything must still be readable and navigable.

---

## Deploying to GitHub Pages

The repository belongs on the personal GitHub account **`Shasan7774`** (not the work account).

```bash
cd C:\Users\BS01681\source\repos\ai-bondhu

git init
git branch -M main

# Pin the personal identity to this repo only (there is deliberately no global git identity)
git config --local credential.https://github.com.username Shasan7774
git config --local user.name  "Hasan Shahriar Fahim"
git config --local user.email "26799315+Shasan7774@users.noreply.github.com"

git add .
git commit -m "Initial commit: 30-day Bangla AI course"

# Make sure the personal account is the active gh account before this step
gh auth switch -u Shasan7774
gh repo create ai-bondhu --public --source=. --remote=origin --push
```

Then in the repository on GitHub: **Settings → Pages → Build and deployment**

- Source: *Deploy from a branch*
- Branch: `main`, folder: **`/site`**

Pages will publish at `https://shasan7774.github.io/ai-bondhu/` within a couple of minutes.

Two things to know:

- **`.nojekyll` must stay in `docs/`.** Without it Pages runs Jekyll over the folder, which can
  swallow files and slow deploys for no benefit here.
- **A custom domain** is configured under the same Pages settings; doing so also requires adding
  a `CNAME` file to `docs/`. Until a domain is chosen, `sitemap.xml` and `robots.txt` carry the
  placeholder host `https://ai-bondhu.example` — see `LAUNCH-CHECKLIST.md`.
- **Relative paths in `404.html`.** Like the rest of the site, it links to `style.css` and
  `script.js` relatively. This is correct for a flat site where almost every bad URL lands at the
  top level. If deep nested paths are ever introduced, those stylesheet links will need
  revisiting.

---

## Adding or editing a lesson

Every file in `content/` follows exactly the same seven-section template — all 30 do, with no
exceptions. Keep it that way; the HTML pages are built one-to-one from these sections.

````markdown
# দিন ১৩: কাগজপত্র বোঝা

## আপনার কী মনে হয়?

A single opening question that provokes the reader's instinct before they are taught anything.

**উত্তর:** The short, honest answer — usually a gentle correction of the common assumption.

## আজকের কথা

Two or three paragraphs. Open with an everyday Bangladeshi analogy (a neighbourhood elder, a
bus ticket, a bazaar), then explain the actual idea, then state the limitation or caution
plainly. No hype, no jargon left unexplained.

## নিজে করুন  (সময়: ৩ মিনিট)

1. Numbered steps the reader performs on their phone.
2. Short, concrete, one action each.
3. The prompt to use goes in a blockquote, indented under its step:

   > এই কাগজে কী লেখা আছে, আমাকে সহজ বাংলায় ধাপে ধাপে বুঝিয়ে বলো।

4. A closing step that tells them what to check or verify in the answer.

## একসাথে করুন  (সময়: ৫ মিনিট)

One line naming who to do it with, then one short paragraph describing the shared activity.

## মিলিয়ে নিন

**প্রশ্ন ১:** The first self-check question.
- ক) Wrong option
- খ) Wrong option
- গ) Correct option

**সঠিক:** গ — one sentence explaining why.

**প্রশ্ন ২:** The second question, same shape.
- ক) Correct option
- খ) Wrong option
- গ) Wrong option

**সঠিক:** ক — one sentence explaining why.

## আজকের মূল কথা

One sentence. This is also the quote that appears on the day's shareable card in the HTML, so
it has to stand on its own out of context.

## আগামীকাল

One line previewing tomorrow. This becomes the `.teaser-box` at the bottom of the page.
````

### Carrying a lesson into the site

The HTML page mirrors those sections with fixed markup. When editing `docs/din-N.html`:

| Markdown section | HTML it maps to |
|---|---|
| `# দিন N: …` | `<title>`, the page `<h1>`, and `<body data-day="N">` |
| `## আপনার কী মনে হয়?` | the opening card with `.reveal-hint` / `.reveal-answer` |
| `## আজকের কথা` | `<section class="card">` |
| `## নিজে করুন` | `<section class="card">` with `.step-list`, `.step-check` boxes, and a `.prompt-box` holding the blockquote plus its `.copy-btn` |
| `## একসাথে করুন` | `<section class="card together-card">` |
| `## মিলিয়ে নিন` | `<section class="card quiz-card">`, one `.quiz-q` per question |
| `## আজকের মূল কথা` | `<section class="card key-point">` **and** the `.share-text` quote card |
| `## আগামীকাল` | `.teaser-box` at the foot of the page |

Points to get right when hand-editing a page:

- `<body data-day="N">` must match the day number, or the progress trail will not highlight the
  current day.
- `data-day-complete="N"` on the completion button must match too.
- Each `.prompt-box` blockquote needs an `id`, and its copy button needs
  `data-copy="<that id>"`. The script copies the element's text content.
- Each `.step-check` checkbox needs a unique `data-step-id` so progress persists per step.
- Each `.quiz-q` carries `data-explain="…"`, and the correct option carries `data-correct="true"`.
- Prev/next links in `.day-nav` point to `din-(N-1).html` and `din-(N+1).html`. Day 1 has a
  disabled prev; day 30 has a disabled next.
- Keep all SVG inline and all text in Bangla. Do not add a font link, an image file, or any
  external script.

### Adding a day beyond 30

Not currently planned, but if it happens: add `content/day-NN.md`, copy an existing
`docs/din-N.html` as the skeleton, update the day numbers above, extend the `<noscript>` day list
in `index.html` and in every day page's header, raise the loop bound in `script.js`
(`for (var n = 1; n <= 30; n++)`), and add the new URL to `docs/sitemap.xml`.

---

## Licence

Not yet decided. Pick one before the repository goes public.
