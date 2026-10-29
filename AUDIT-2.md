# এআই বন্ধু — audit #2: the expanded multi-module site

**Scope:** all 52 pages in `docs/`, `style.css`, `script.js`, `sitemap.xml`, `robots.txt`, and the 51 markdown sources in `content/`.
**Date:** 2026-10-29. **Mode:** read-only. No file in the project was modified except this one.
**Baseline:** `AUDIT.md` (30-day course only). Items it raised that are now fixed are listed in PASSED → *Carried-over fixes*; items it raised that are still open are marked **[carry-over]** and not re-litigated.

Every count below is **verified across all 52 pages** by script unless the finding says *(sample)*.

| Severity | Count |
|---|---|
| BLOCKING | 1 |
| SHOULD-FIX | 6 |
| MINOR | 12 |

**Headline:** the four parallel builds held together far better than expected. Zero broken links, zero dead anchors, all 106 copy buttons resolve, one header and two footer variants across 52 pages, and the content-safety work on the earn track and the profession guides is genuinely strong. The defects that remain are consistency and polish, concentrated in the seven `pesha-*` pages — the only module built without a `.day-rail`, without step checkboxes, and without a layout override to match.

---

# BLOCKING

## B1 — The seven profession pages render a ~290px empty column at ≥1320px, squeezing the article to ~73% of its intended width

**Files:** `docs/style.css:420-432` and `docs/style.css:927-929`; affects `docs/pesha-bebshayi.html`, `pesha-chakrijibi.html`, `pesha-grihini.html`, `pesha-krishok.html`, `pesha-shasthokormi.html`, `pesha-shikkharthi.html`, `pesha-shikkhok.html`.

**What is wrong.** `.page-grid` is declared at `style.css:421`:

```css
@media (min-width:1320px){
  .page-grid{
    grid-template-columns:minmax(190px,.9fr) minmax(0,3.2fr) minmax(240px,1.2fr);
    grid-template-areas:"side main rail";
  }
```

Three tracks, three named areas. Verified by script, the pages that use `.page-grid` split into exactly three shapes:

| Shape | Pages | Has `.day-side` | Has `.day-rail` | Has a 2-col override |
|---|---|---|---|---|
| day + rail | 38 (`din-1…30`, `aay-1…8`) | yes | yes | n/a — needs 3 cols |
| day, no rail | **7 (`pesha-*`)** | yes | **no** | **no** |
| prompt | 1 (`prompt.html`) | yes | no | **yes**, `style.css:927` |

`prompt.html` was given the correct escape at `style.css:927`:

```css
@media (min-width:1320px){
  body.prompt-page .page-grid{ grid-template-columns:minmax(190px,.9fr) minmax(0,1fr); grid-template-areas:"side main"; }
}
```

The `pesha-*` pages carry `<body class="day-page" data-pesha="…">` and were never given one. A grid track exists whether or not anything is placed in it, so at ≥1320px those seven pages lay out as `[sidebar | main | nothing]`. With `--shell:1400px`, `padding:0 1.5rem` and `column-gap:1.9rem`, the rail track takes roughly **1.2/5.3 of ~1291px ≈ 290px of dead whitespace**, and `main` drops from the ~1070px it would otherwise get to about **780px**.

Nothing is lost and nothing breaks — this is cosmetic only — but it is visibly wrong on any laptop 1320px or wider, on one of the five headline modules, in a push whose stated purpose is the responsive redesign. If the push is time-critical, this is the one item to fix; everything below can follow.

**Fix.** One line, no markup change. The `pesha-*` bodies already carry a unique hook (`data-pesha`). At `style.css:927`, extend the existing selector:

```css
@media (min-width:1320px){
  body.prompt-page .page-grid,
  body[data-pesha] .page-grid{ grid-template-columns:minmax(190px,.9fr) minmax(0,1fr); grid-template-areas:"side main"; }
}
```

(If you would rather the profession pages *gain* a rail for symmetry with `aay-*` — share card plus a prev/next through the seven professions — that is a design decision, not a fix, and it is a larger change. The CSS above is the minimal correct answer.)

---

# SHOULD-FIX

## S2 — `.caution-card` and `.caution-box` are two classes for one component, and they are **not** visually identical

**Files:** `docs/style.css:254-266` (`.caution-card`), `docs/style.css:838-850` (`.caution-box`), plus `docs/style.css:852-855` (a byte-identical duplicate of `style.css:445`).

**Usage, verified across all 52 pages:**

| Class | Pages | Instances |
|---|---|---|
| `.caution-card` | 8 (`aay-1…8`) | 9 (`aay-7.html` has two, lines 109 and 196) |
| `.caution-box` | 7 (`pesha-*`) | 7 |

The markup is already interchangeable — both are `<section class="card caution-X" aria-labelledby="…"><h2><svg …/>…</h2><ul>…</ul></section>`. **The styling is not.** Four real differences:

| Property | `.caution-card` | `.caution-box` | Visible effect |
|---|---|---|---|
| background | `linear-gradient(180deg, var(--terracotta-tint) 0%, var(--card-bg) 55%)` | flat `var(--terracotta-tint)` | aay cards fade to white halfway down; pesha boxes stay peach to the bottom |
| accent border | `border-left:4px` (physical) | `border-inline-start:4px` (logical) | identical in LTR Bangla; logical is the better property |
| `h2` spacing | no `margin-bottom` → inherits the global `h2{margin:0 0 .75em}` | `margin-bottom:.9rem` | ~2px apart; not the issue |
| list indent | `ul,ol{margin:0}` only → UA default `padding-inline-start:40px` | `ul{margin:0; padding-inline-start:1.3em}` | **aay bullets sit ~17px further right than pesha bullets** |

So "near-duplicate" understates it: the same safety callout looks measurably different between the earn track and the profession guides. Consolidating fixes a visual inconsistency as well as removing the duplicate class.

### Recommendation: keep `.caution-card`, delete `.caution-box`, merge `.caution-box`'s better declarations in

Keep `.caution-card` because the name matches the rest of the system — the callout family is `.key-point`, `.together-card`, `.quiz-card`, all `<section class="card …">` — and because its gradient *is* the house pattern: `.together-card` (`style.css:243`) uses exactly the same `linear-gradient(180deg, <tint> 0%, var(--card-bg) 50%)` construction. `.caution-box`'s flat fill is the outlier. But `.caution-box` has the two better declarations (logical border, sane list indent), so take those with it.

**Exact changes — four edits:**

1. **`docs/style.css:254-266`** — replace the `.caution-card` block with:

```css
/* caution / warning card (সতর্কতা) */
.caution-card{
  border-color:#e9c9b6; border-inline-start:4px solid var(--terracotta);
  background:linear-gradient(180deg,var(--terracotta-tint) 0%, var(--card-bg) 55%);
}
.caution-card h2{
  color:#9a4a2c; display:flex; align-items:center; gap:.5rem; margin-bottom:.9rem;
}
.caution-card h2 .icon{ width:22px; height:22px; flex-shrink:0; color:var(--terracotta); }
.caution-card ul,.caution-card ol{ margin:0; padding-inline-start:1.3em; }
.caution-card li{ margin-bottom:.6rem; }
.caution-card li:last-child{ margin-bottom:0; }
```

2. **`docs/style.css:838-850`** — delete the whole `.caution-box` block (7 rules, ~430 B).

3. **`docs/style.css:852-855`** — delete the duplicate `.side-jump a[aria-current="page"]` rule. It is a declaration-for-declaration copy of `style.css:445`, at the same specificity, later in the cascade, so it is a pure no-op costing ~140 B. **Keep `style.css:445`** (it is the one that sits with the rest of the `.side-jump` rules). The adjacent `.day-card[aria-current="page"]` rule at `style.css:856-858` is **not** a duplicate — leave it.

4. **The 7 profession pages** — change `class="card caution-box"` → `class="card caution-card"`, one occurrence each:
   `pesha-bebshayi.html:199` · `pesha-chakrijibi.html:199` · `pesha-grihini.html:200` · `pesha-krishok.html:199` · `pesha-shasthokormi.html:196` · `pesha-shikkharthi.html:197` · `pesha-shikkhok.html:202`

**Optional fifth edit, for pixel parity:** the pesha `h2` wraps its text in a `<span>`, the aay `h2` leaves it as a bare text node. Under `display:flex` a bare text node becomes an anonymous flex item, which wraps differently from a `<span>` once the heading runs to two lines (reachable at the `fs-2` font step on a 320px screen). Add the `<span>` to the 9 aay headings so all 16 behave identically.

**Net:** ~570 B of CSS removed, one component instead of two, and the bullet-indent mismatch gone.

## S3 — The profession pages style their step list as interactive, but there is nothing to interact with

**Files:** all 7 `pesha-*.html`, the `<ol class="step-list">` block (e.g. `pesha-krishok.html:149-155`); CSS at `docs/style.css:230`.

Verified across all 52 pages: `data-step-id` appears **172 times on 38 pages** — 30 `din-*` and 8 `aay-*` — and **zero times on the 7 `pesha-*` pages**. The profession pages do carry `.step-list`, `.step`, `.step-row`, `.step-icon`, `.step-num`, `.step-text` and `.step-label` (7/7 each), but they use `<span class="step-label">` where the other 38 pages use `<input type="checkbox" class="step-check" data-step-id="…">` + `<label for="…" class="step-label">`.

Two consequences:

- **Misleading affordance.** `style.css:230` sets `.step-label{ cursor:pointer; … min-height:48px; }` unconditionally. On the profession pages the user gets a 48px-tall pointer-cursor target that does nothing when clicked or tapped.
- **A silent feature gap.** A reader who completes the 30-day course and the earn track learns that steps tick off and persist; the profession guides look the same and quietly do not.

**Fix — pick one and apply it to all seven:**
- *Match the other modules (preferred, consistent):* convert each `<span class="step-label">` to `<input type="checkbox" id="p-<slug>-s<n>" class="step-check" data-step-id="p-<slug>-s<n>"> <label for="…" class="step-label">`. `script.js:54-58` picks these up with no JS change, and `style.css:235-237` already handles the checked-state text dimming.
- *Keep them static:* add `.pesha-page .step-label{ cursor:default; }` (or scope on `body[data-pesha]`) so the page stops advertising a control it does not have.

## S4 — `pesha.html` skips from `<h1>` straight to seven `<h3>`s

**File:** `docs/pesha.html` — `h1` at line 99, then `<h3>` at lines 106, 114, 122, 130, 138, 146, 154. No `<h2>` anywhere in `<main>`.

This is the **only** heading-order break on the whole site; the other 51 pages are clean (verified: exactly one `h1` each, no level skipped). Its sibling hub does it correctly — `aay.html:103` has `<h2>৮টি পাতা</h2>` before its eight `<h3>`s. A screen-reader user navigating by heading level on `pesha.html` gets seven orphaned level-3 items under the page title.

**Fix.** Insert a level-2 heading before the `<ul class="module-grid">` at `pesha.html:~104`, mirroring `aay.html`:

```html
<h2>৭টি পেশা</h2>
```

(or `<h2 class="sr-only">৭টি পেশা</h2>` if the design does not want a visible label — but `aay.html` shows one visibly, so visible is the consistent choice).

## S5 — `tools.html` repeats its own `<h1>` verbatim as an `<h2>`

**File:** `docs/tools.html:53` and `docs/tools.html:76`.

```html
<h1 id="h-title">AI টুল গাইড: কোন দরকারে কোন টুল</h1>
…
<div class="band-head"><h2 id="h-needs">AI টুল গাইড: কোন দরকারে কোন টুল</h2></div>
```

Identical strings. The reader scrolls past "চারটা পরিচিত নাম" and is shown the page title again as if a new section had started; a screen-reader heading list shows the same text twice at two levels.

This heading does not come from the source. `content/tools-guide.md` has `# AI টুল গাইড: কোন দরকারে কোন টুল` as the title and then `## প্রশ্ন করে উত্তর বা ব্যাখ্যা পাওয়া`, `## লেখা আর লেখা ভালো করা`, … as the sections — which the build correctly demoted to `<h3>` inside `.need-card`s. The `<h2>` wrapper was invented to group them and was given the title text by default.

**Fix.** Change `tools.html:76` to a heading that names the section, e.g. `<h2 id="h-needs">দরকার অনুযায়ী কোন টুল</h2>` or `<h2 id="h-needs">কোন দরকারে কী খুঁজবেন</h2>`. Nothing links to `#h-needs` (verified — the page has no in-page TOC), so the id can stay as is.

## S6 — `prompt.html` inlines the same copy icon 44 times: ~12.0 KB, 22% of the site's largest page

**File:** `docs/prompt.html`. Page weight **53,841 B** uncompressed (7,830 B gzip -9).

Measured breakdown:

| Component | Bytes | Share |
|---|---|---|
| inline SVG, total | 13,691 | 25% |
| — of which: the copy icon, **×44 at 273 B** | **12,012** | **22%** |
| `<head>` | 3,235 | 6% |
| full footer | 3,019 | 6% |
| sprite `<svg class="icon-defs">` (`ix-github` only) | 592 | 1% |

The page already ships the sprite mechanism — `<svg class="icon-defs">` with one symbol, referenced once via `<use href="#ix-github">` at 92 B. The copy icon simply was never put in it. The same 273 B literal appears inside all 106 copy buttons site-wide:

```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
```

**Fix.** Add the icon to each page's sprite as `<symbol id="ic-copy" viewBox="0 0 24 24">…</symbol>` (~290 B once) and replace every inline copy with `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-copy"></use></svg>` (92 B).

| Scope | Saving (uncompressed) |
|---|---|
| `prompt.html` alone | **~7.7 KB** → 53,841 B drops to ~46,100 B |
| all 106 buttons site-wide | **~19.2 KB** |

Because HTML is not cached the way `style.css` and `script.js` are, this is paid on every page view. On the 2G target it is the single cheapest weight win available. See *Page weight* in PASSED for the full picture — the honest summary is that the site is comfortable on 2G *if the host gzips*, and this fix makes the worst page comfortable either way.

## S7 — On the profession pages, the sidebar's "মূল কথা" link jumps to a heading that is invisible

**Files:** all 7 `pesha-*.html` — sidebar entry `<li><a href="#h-key">মূল কথা</a></li>`, target `<h2 id="h-key" class="sr-only">মূল কথা</h2>`.

Verified split across all 52 pages:

| `<h2 id="h-key">` | Pages |
|---|---|
| visible | 38 (`din-1…30`, `aay-1…8`) |
| `class="sr-only"` | 10 (7 `pesha-*`, `tools.html`, `shobdokosh.html`, `prompt.html`) |

Hiding it is fine on `tools.html`, `shobdokosh.html` and `prompt.html` — none of them links to it. On the seven profession pages the sidebar **does** offer it as a visible jump link, so a sighted reader clicks "মূল কথা" and lands on what looks like an unlabelled share card with no heading above it.

**Fix.** On the 7 `pesha-*.html` pages, drop `class="sr-only"` from the `<h2 id="h-key">` so it matches the 38 day/earn pages the sidebar pattern was copied from. (Alternative: remove the `#h-key` entry from the pesha sidebar — but that loses a useful jump target and widens the gap with `aay-*`, whose sidebar lists it and shows it.)

---

# MINOR

**M1 — `404.html` is the only page of 52 without `<meta name="theme-color">`.** All 51 others carry `content="#0F6E6E"`. The browser chrome colour changes on exactly one page. One line at `docs/404.html:9`. (The missing canonical/og/twitter on `404.html` is **correct** — it is `noindex` — and is not a finding.)

**M2 — `robots.txt` still tells the reader to replace a placeholder host that is no longer a placeholder.** `docs/robots.txt:5` reads `# Replace the placeholder host below with the real domain before launch.` The host below it is `https://shasan7774.github.io/ai-bondhu/sitemap.xml`, which is the real GitHub Pages URL and matches all 204 absolute URLs across the site. The comment is now false and is English debug text in a Bangla-only product. Delete the line.

**M3 — ~1.3 KB of dead CSS.** Verified against all 52 pages' `class` attributes *and* against `script.js` (so runtime-applied classes are excluded):

| Selector | Rules | Approx. bytes |
|---|---|---|
| `.signup-form` and children | 5 | 590 |
| `.trust` | 2 | 255 |
| `.hero-art--index` | 2 | 146 |
| `.is-locked` | 1 | 94 |
| `.wrap` | 1 | 79 |
| `.form-note` | 1 | 73 |
| `.how-section` | 1 | 35 |
| `.measure` | 1 | 28 |

`.is-locked` was AUDIT M7 — the unreachable `script.js` branch that produced it has since been removed, so the style is now fully dead and can go with the rest. (`.fs-1`, `.fs-2`, `.trail-dot`, `.td-n`, `.td-t`, `.is-complete`, `.is-current`, `.is-right`, `.is-wrong`, `.is-good`, `.is-nudge`, `.is-copied`, `.copy-note` match no static markup but **are** applied at runtime by `script.js` — not dead, do not remove.)

**M4 — The slim footer's link row is a bare `<div>`, not a `<nav>`.** `<div class="band-inner foot-slim">` with seven links, on 48 pages. The full footer used by `index.html`, `tools.html`, `shobdokosh.html` and `prompt.html` wraps each column in a labelled `<nav aria-labelledby="h-foot-…">`. A screen-reader user gets footer navigation as a landmark on 4 pages and as loose links on 48. Change the `<div>` to `<nav aria-label="সাইটের অন্য অংশ">` in the 48 slim footers.

**M5 — The three sidebar modules order their blocks differently, and one is missing the font control.** Verified:

| Page type | Sidebar order | Font control in sidebar |
|---|---|---|
| `din-*` (30) | back-link → 30-day trail → in-page TOC | yes |
| `aay-*` (8) | back-link → **module list** → **in-page TOC** | yes |
| `pesha-*` (7) | back-link → **in-page TOC** → **module list** | yes |
| `prompt.html` | back-link → in-page TOC | **no** |

A reader moving between the earn track and the profession guides finds the same two blocks swapped. Pick one order — module-list-then-TOC matches `din-*`, where the trail (the module list) comes first. The missing font control on `prompt.html` is harmless (its `<body class="prompt-page">` is not `.day-page`, so `style.css:383` never hides the header copy — verified) but it is one more small divergence.

**M6 — The "back to hub" link says something different in each module.** `din-*`: "সব পাঠের তালিকা" → `index.html` · `aay-*`: "সব পাতার তালিকা" → `aay.html` · `pesha-*`: "পেশা হাব" → `pesha.html` · `prompt.html`: "হোমপেজে ফিরে যান" → `index.html`. "পেশা হাব" is the odd one — "হাব" is an English loanword in a product that otherwise avoids them, and the other three use a "সব X-এর তালিকা" pattern. Suggest "সব পেশার তালিকা".

**M7 — The takeaway card is assembled three ways.** Beyond the visible/`sr-only` split in S7: on `tools.html` and `shobdokosh.html` the heading plus share card sit inside `<section class="band" aria-labelledby="h-key">`; on `prompt.html` they are bare children of `<main>` with no wrapping section, so the heading labels nothing. Wrap `prompt.html`'s in the same `<section class="band" aria-labelledby="h-key">`.

**M8 — The `[ ]` placeholder convention is explained three different ways.** All three work; none is missing. For the record, verified across all 52 pages: `din-*` uses a per-prompt `<p class="prompt-hint">` (13 pages, matching the 13 that have a placeholder prompt); `aay-*` uses the same hint on all 8; `pesha-*` folds it into the step text ("বর্গাকার বন্ধনীর [ ] ভেতরের অংশটুকু মুছে…", present on 7/7); `prompt.html` uses one page-level `.notice-box` covering all 34 of its 44 prompts that contain a placeholder. Coverage is complete — this is a style note, not a gap. If you want one convention, the per-prompt hint is the most robust, since a reader who lands on `prompt.html#g6` never sees the notice at the top.

**M9 — The glossary filter announces nothing when it finds matches.** `docs/shobdokosh.html:64-83`. The inline script writes to `#gFilterStatus` (`aria-live="polite"`) only on zero results: `st.textContent=(q&&n===0)?'কোনো মিল নেই।':''`. A screen-reader user typing into the filter hears silence while 32 cards narrow to 3. Change to announce the count, e.g. `st.textContent = q ? (n===0 ? 'কোনো মিল নেই।' : n + 'টি শব্দ পাওয়া গেছে।') : ''` — with the number in Bangla digits to match the rest of the site.

**M10 — `tools.html` makes one capability claim that sits oddly against its own stated rule.** `docs/tools.html`, the "ছবি তৈরি করা" card. The page opens with "এই লেখায় কোনো নির্দিষ্ট দাম, সীমা বা 'এত পর্যন্ত ফ্রি' জাতীয় কথা বলা হয়নি" and "কোনো একটা টুলকে 'সবচেয়ে ভালো' বলা হবে না" — and holds that line everywhere else, which is excellent. Then: *"একটা কথা মোটামুটি নিশ্চিত করে বলা যায়: Claude মূলত লেখা, নথি আর তথ্য নিয়ে কাজের জন্য বেশি পরিচিত, ছবি তৈরির টুল হিসেবে না।"* It is true today, it is hedged with "মোটামুটি", and it is not pricing — but it is a per-product feature claim in a page that just promised not to make any, and it is exactly the kind of statement that silently goes stale. Either drop the sentence or add "— তবে এটাও বদলাতে পারে" to match the hedging used elsewhere on the page.

**M11 — 45 pages carry two `.font-ctrl` groups in the DOM with the same `aria-label`.** `data-font-dec` / `data-font-inc` appear 97 times across 52 pages: one in `.header-row` on every page, plus a second inside `.day-side` on the 45 pages that have a sidebar. CSS shows exactly one at a time (`style.css:357` hides the sidebar copy below 1100px; `style.css:383` hides the header copy on `.day-page` above it), and `script.js:47-50` uses delegated click so both work — so this is **not** a functional bug. But two `role="group" aria-label="লেখার আকার নিয়ন্ত্রণ"` elements exist in the accessibility tree simultaneously, and a tool that ignores `display:none` (or a user with CSS off) sees duplicate controls. Low priority; noted because it is easy to mistake for a bug on inspection.

**M12 [carry-over from AUDIT S6] — the 1px decorative borders are still 1.1–1.4:1.** Measured: `--border:#E3DACB` on `--card-bg:#FFFFFF` = **1.39:1**, on `--bg:#FBF8F4` = **1.31:1**; `#CFE4E2` on `--teal-tint` = **1.15:1**; `#E9C9B6` on `--terracotta-tint` = **1.32:1**. Two of the three S6 complaints have been **fixed** (see PASSED → *Carried-over fixes*), and the remaining ones are the decorative card outlines, not controls. For the new callouts specifically this is **not** a 1.4.11 failure — the caution block is identified by its 4px terracotta accent at **4.0:1** against the page background, well over the 3:1 threshold, plus its own tinted fill. The open item is the generic `.card` outline, where white-on-cream (1.04:1) plus a 1.39:1 border is the only thing separating a card from the page. Darkening `--border` to roughly `#CFC2AC` would clear 3:1 on both grounds without changing the palette's character.

---

# PASSED

Each item was verified programmatically across every file of its class, except where marked *(sample)*.

### Navigation — 0 defects in 52 pages
- **Every internal `href` resolves.** All non-`http` link targets on all 52 pages were checked against the real directory listing: **0 broken file links**.
- **Every same-page anchor resolves.** All `href="#…"` targets checked against the `id` attributes of their own page: **0 dead anchors**. This includes the eight `#g1…#g8` TOC links on `prompt.html` and the five `#h-…` links in each profession sidebar.
- **Hub ↔ child is complete both ways.** `aay.html` links to all 8 children and all 8 link back. `pesha.html` links to all 7 and all 7 link back.
- **All five modules plus the course are reachable from every page.** `index.html`, `aay.html`, `tools.html`, `shobdokosh.html`, `prompt.html` and `pesha.html` each appear in the footer of all 51 other pages — **0 pages missing any module link**.
- **The index module grid lists all six destinations** (`din-1.html`, `aay.html`, `tools.html`, `shobdokosh.html`, `prompt.html`, `pesha.html`).
- **Sequential chains are unbroken.** `din-1…30` prev/next verified 1→30 with correctly disabled ends; `aay-1…8` likewise.
- **`404.html` — all 9 links work** (`index.html`, `din-1.html`, and all five modules twice over).
- **No duplicate `id` on any page** (checked with a strict attribute-boundary match; an earlier loose pattern false-positived on `data-step-id`).
- **Skip links work on all 52 pages** — every `class="skip-link" href="#main"` has a matching `id="main"`.

### Interactivity wiring — every hook in `script.js` matches markup on all 52 pages
- **All 106 `data-copy` buttons resolve**, and all 106 targets are `<blockquote>` elements. Distribution: `prompt.html` 44, `din-*` 40, `aay-*` 8, `pesha-*` 14. **0 unresolved.**
- **All 106 copy buttons share byte-identical markup** (`<button type="button" class="copy-btn" data-copy="…"><svg …></svg><span class="copy-label">কপি করুন</span></button>`), so `script.js:70-98` — which looks up `.copy-label` and falls back to `btn.textContent` — behaves identically everywhere.
- **`.trail-track` is used on the 30 `din-*` pages only.** No other page carries it, so the 30-day trail that `script.js:129-142` writes into cannot corrupt a non-course page. Confirmed by class census across all 52 pages.
- **`data-day` guard is safe.** `script.js:131` reads `document.body.getAttribute("data-day")` only inside the `tracks.length` branch; `index.html` and `404.html` carry `data-day="0"` but no `.trail-track`, so that branch never runs there.
- **Quiz wiring:** `data-opt` ×180 and `data-correct` ×180 on the 30 `din-*` pages — one `data-correct` per option, 60 questions, `data-explain` ×60. No other module declares a quiz.
- **`data-step-id` ×172** across the 38 pages that have checkboxes, each paired with a matching `id` on its `<input>` and a matching `for` on its `<label>`.
- **`data-day-complete` ×30** — exactly one per `din-*` page, each with a `.day-done-confirm` sibling.
- **`data-trail-count` ×30** — one per `din-*` page.
- **The index progress dashboard is fully wired:** all nine hooks (`data-prog-bar`, `-fill`, `-done`, `-done2`, `-left`, `-sub`, `-cta`, `-cta-label`, and the 30 `data-day-card`s) are present exactly once on `index.html` and nowhere else.
- **Font controls on all 52 pages** — `data-font-dec` and `data-font-inc` ×97, and `script.js:47-50` uses delegated `click` with `closest()`, so every instance works regardless of position.
- **`script.js` loads last on all 52 pages**, with no `defer`/`async`, after `style.css`, with `<meta charset="UTF-8">` on each.
- **The glossary filter script is self-contained and guarded** — wrapped in `try{}catch(e){}`, all three element lookups null-checked, and it runs before `script.js` without touching anything `script.js` owns.
- **No page where an interaction silently fails was found.** The one gap is the inert profession step list (S3), which is a missing control rather than a broken hook.

### JavaScript disabled — all content readable and navigable
- **The glossary degrades exactly as required.** `<div class="gloss-filter" id="gFilterWrap" hidden>` ships hidden and is un-hidden only by the inline script (`fw.hidden=false`). With JS off the search box never appears, and **all 32 `.gloss-card` entries stay visible** — verified: 32 cards in the markup, none carries `hidden`.
- **The filter input is labelled** — `<label for="gFilterInput" class="sr-only">শব্দ খুঁজুন</label>`, not placeholder-only.
- **Copy buttons degrade without breaking.** All 106 are `type="button"`, so none submits anything; the prompt text they would copy is already visible in the `<blockquote>` beside them and can be selected by hand.
- **The index progress dashboard degrades cleanly.** With JS off it shows static `০ / ৩০ দিন সম্পূর্ণ`, an empty bar whose `role="img" aria-label` already reads "অগ্রগতি: ৩০ দিনের মধ্যে ০ দিন সম্পূর্ণ", and a CTA whose static `href="din-1.html"` works. No `<noscript>` needed, and the markup never shows a broken or empty state.
- **The 30 course pages ship 4 `<noscript>` blocks each** — 120 in total — covering the quiz answers and the day-trail fallback (AUDIT S3's fix, confirmed in place).
- **Step checkboxes are real `<input type="checkbox">`**, so they still tick with JS off; only persistence is lost.
- **Zero `<img>`, `<iframe>`, `<video>`, `<audio>`, `<table>` or `<pre>` anywhere on the site** — nothing that could fail to load or overflow.

### Zero external requests
Every `<script>`, `<link>`, `<img>` and `<svg>` reference on all 52 pages is relative. The only absolute URLs are `canonical`, `og:url`, `og:image`, `twitter:image` (metadata, not fetched by the page) and the GitHub repo link in the footer. **No webfont, no CDN, no analytics, no tracking pixel.**

### Metadata — 51/51 content pages complete
| Tag | Coverage |
|---|---|
| `<html lang="bn">` | **52/52** (identical string) |
| `<title>` | 52/52, all Bangla |
| `<meta name="description">` | 52/52, all Bangla |
| `<meta name="viewport">` | 52/52 |
| `rel="icon"` → `favicon.svg` | **52/52** (AUDIT M11 fixed) |
| `theme-color` `#0F6E6E` | 51/52 — see M1 |
| `canonical` | 51/51 content pages (`404.html` correctly excluded, `noindex`) |
| `og:title` / `og:description` / `og:url` / `og:image` | 51/51 |
| `twitter:card` / `:title` / `:description` / `:image` | 51/51 |

- **No `canonical` ↔ `og:url` mismatch, and no filename mismatch**, on any page.
- **No placeholder domain anywhere.** AUDIT B1 is fully closed: the only two hosts in the entire codebase are `shasan7774.github.io` (204 occurrences) and `github.com` (56, the repo link). `index.html` canonicalises to the bare directory `https://shasan7774.github.io/ai-bondhu/`.
- **`og:image` and `twitter:image` both resolve** to the single `share.png` (48,385 B, present on disk) on all 51 pages.
- **`sitemap.xml` is exact: 51 `<loc>` entries, 0 duplicates, 0 pointing at a file that does not exist, 0 files missing** — the only `.html` not listed is `404.html`, which is correct.

### Content safety and honesty — the strongest part of the build

**The earn track (`aay.html` + `aay-1…8`).** A targeted scan for money amounts, percentages, guarantees, income timelines and success stories across all nine pages found **zero earnings promises**. Every hit on "নিশ্চয়তা"/"গ্যারান্টি" is the page *warning against* one:
- `aay-1.html`: "এই কোর্সের কোনো অংশ, কোনো পাতা, কোনো পরামর্শ আয়ের নিশ্চয়তা দেয় না। কেউ যদি দেয়, তাকেই বরং সন্দেহ করুন।"
- `aay-1.html`: "এখানে আপনি পাবেন না — 'এত দিনে এত টাকা' জাতীয় কোনো হিসাব। কারণ সেই হিসাব কেউ সৎভাবে দিতে পারে না।"
- `aay-7.html` catalogues the "চাকরি গ্যারান্টি" paid-training scam explicitly: "যারা নিশ্চয়তা দেয় তারা প্রশিক্ষণ নয়, আশা বিক্রি করছে।"
- `aay-8.html`, the page most at risk of implying a timeline, says the opposite twice: "তিন, এই ৩০ দিনে আয়ের আশা করবেন না" and "৩০ দিনে সফলতা মানে আয় নয়" — then redefines success as three non-monetary outcomes.
- **No invented statistic.** The only numeral attached to money anywhere in the module set is `২৫০০ টাকা` inside a bracketed example product description on `pesha-bebshayi.html`. **No success story, no named individual, no testimonial.**
- **No paid course or service is recommended.** The only brand names in the track are `Fiverr`, `Upwork`, `Freelancer` (`aay-4.html`, described as marketplaces), `Payoneer`, `bKash`, `Nagad` (`aay-6.html`/`aay-7.html`, described as payment rails). Each appears once, descriptively. `aay-1.html` states the rule up front: "কোনো কোর্স, কোনো প্রতিষ্ঠান বা কোনো সেবার নাম সুপারিশ করা হবে না."

**The profession guides — all four mandated cautions present, prominent, and reinforced three times.** Each page states its rule in the opening "এক নজরে", again as the first bullet of the caution block, and again in the closing "মূল কথা":

| Page | Mandated caution | Present |
|---|---|---|
| `pesha-shasthokormi.html` | never use AI for diagnosis | **yes** — "কোনো অবস্থাতেই AI-কে রোগ নির্ণয় বা চিকিৎসার সিদ্ধান্তের জন্য ব্যবহার করবেন না… চূড়ান্ত সিদ্ধান্ত নেবেন যোগ্য চিকিৎসক… আপনি নন, আর AI তো নয়ই।" Reinforced in "এক নজরে" and "মূল কথা" ("এখানে কোনো ছাড় নেই") |
| `pesha-krishok.html` | consult an agriculture officer | **yes** — "চূড়ান্ত সিদ্ধান্ত সবসময় যোগ্য কৃষি কর্মকর্তার কাছ থেকে নিন, কারণ ভুল কীটনাশক প্রয়োগে পুরো ফসল নষ্ট হয়ে যেতে পারে।" The activity itself bakes the caveat into the copyable prompt and makes step 4 "কৃষি সম্প্রসারণ অফিসে গিয়ে… আসল পরামর্শ নিন" |
| `pesha-chakrijibi.html` | never enter confidential data | **yes** — "অফিসের গোপনীয় তথ্য, ক্লায়েন্টের তথ্য, কারো ব্যক্তিগত ডেটা বা কোম্পানির অপ্রকাশিত নথি — এগুলোর কোনোটাই কখনো AI অ্যাপে লিখবেন না বা পেস্ট করবেন না, সারাংশ করার জন্যও না।" |
| `pesha-shikkharthi.html` | learning vs cheating | **yes** — "AI দিয়ে বিষয়টা বুঝে, নিজের ভাষায় লিখলে সেটা শেখা। পরীক্ষার খাতায় বা জমা দেওয়া অ্যাসাইনমেন্টে AI-এর লেখা হুবহু তুলে দেওয়া হলো নকল করা…" |

All seven pages additionally carry a hallucination warning and a personal-data warning. `pesha-grihini.html` adds the doctor rule for family health; `pesha-shikkhok.html` adds a verify-before-it-reaches-students rule and "AI আপনার শিক্ষকতার অভিজ্ঞতা আর বিচার-বুদ্ধির বিকল্প না".

One structural note, not a defect: the caution block sits **after** the "নিজে করুন" activity in the document order on all seven pages. That is mitigated — the same rule already appears in the opening paragraph, and on `pesha-krishok.html` it is written into the copyable prompt itself — so the reader meets the warning before the activity regardless. Worth keeping in mind if the activity section ever grows.

**The tools guide carries no pricing and no stability claim.** `tools.html` states the rule explicitly: "এই লেখায় কোনো নির্দিষ্ট দাম, সীমা বা 'এত পর্যন্ত ফ্রি' জাতীয় কথা বলা হয়নি… আর কোনো একটা টুলকে 'সবচেয়ে ভালো' বলা হবে না এখানে." A scan of the page found **no price, no quota, no free-tier limit, no superlative**. The four products are described by maker and general purpose only. The one borderline sentence is M10.

### Text fidelity — markdown vs rendered HTML
**929 source units** (sentence-level, markdown syntax stripped, Unicode NFC-normalised) from the 19 new-module source files were searched literally in the rendered `<main>` of their page. **923 matched.** All six non-matches were confirmed false positives on manual inspection:
- 4 in `tools.html` — the markdown's "Name — description" lines were deliberately split into `<h3>Name</h3><p>description</p>` cards. Content identical.
- 1 in `aay-1.html` and 1 in `aay-5.html` — whitespace introduced by stripping an inline `<a>` and `<strong>`.

Per-module result: `aay-2…8` **0 divergences in 447 units** · all 7 `pesha-*` **0 divergences in 142 units** · `shobdokosh.html` **0 in 75** · `prompt.html` **0 in 92**. The 30-day course was verified in AUDIT (M1 and M12 were its only two divergences; both remain as described there and are not re-reported).

**Nukta observation (reported, no action recommended).** Across all 52 HTML pages: **5,069 decomposed** sequences (consonant + U+09BC) and **84 precomposed** (য়/ড়/ঢ়). All 51 markdown sources are **100% decomposed** (3,331 occurrences, 0 precomposed). The 84 precomposed characters are not scattered — they are **the same two characters in one shared string**, the meta description/`og:description` boilerplate "এআই বন্ধু — দিনে ১০ মিনিট, সহজ বাংলায় AI শেখার ৩০ দিনের কোর্স", repeated across 42 pages. Both forms render identically in every Bangla font in the stack. **Do not normalise** — a normalisation pass already corrupted this text once. Recorded here only so a future reader does not mistake the mixture for damage.

### Accessibility
- **Heading order is clean on 51 of 52 pages** — exactly one `<h1>` each, no skipped level. The single exception is `pesha.html` (S4).
- **Every SVG on the site is either `aria-hidden` or labelled.** A scan that walks up to the nearest enclosing open tag (so `<div class="section-divider" aria-hidden="true"><svg>` counts as hidden) found **0 unlabelled, unhidden SVGs** across all 52 pages — including the sprite `<use>` references, the 106 copy icons, the step icons and the share-card motifs.
- **AUDIT S7 is fixed.** Zero SVGs now carry an `aria-label` that an `aria-hidden="true"` ancestor would cancel (was 32).
- **The glossary filter input is properly labelled** with a visible-to-AT `<label for>` (M9 is about its live region, not its label).
- **Caution blocks are announced meaningfully.** Both variants are `<section class="card caution-…" aria-labelledby="h-caution|h-warning">` with a real `<h2>` — they expose as named regions, not anonymous divs. All 16 instances verified.
- **Tap targets clear WCAG 2.2 SC 2.5.8 (24px) everywhere, and most clear 44px:** `.copy-btn` 48 · `.step-label` 48 · `.quiz-options button` 48 · `.font-ctrl button` 48 · `.nav-prev a`/`.nav-next a` 48 · `.gloss-filter input` 48 · `details.reveal summary` **48** (AUDIT M5 fixed, was 28) · `.faq summary` 48 · `.btn-primary`/`.btn-next`/`.cta-button` 52 · `.day-card` 56 · `.foot-slim a` 40 · `.foot-col li a` 34 · `.trail-dot` 32.
- **Focus states are global and visible:** `a:focus-visible, button:focus-visible, summary:focus-visible, input:focus-visible { outline:3px solid var(--teal); outline-offset:2px; }` — teal on the page background is **4.00:1**, over the 3:1 non-text requirement.
- **`prefers-reduced-motion:reduce` is honoured** (`*{transition:none !important}`).
- **All new colour pairs clear AA.** Measured:

| Pair | Ratio | AA |
|---|---|---|
| caution `h2` `#9A4A2C` on `--terracotta-tint` | **5.27:1** | pass (normal text) |
| caution `h2` `#9A4A2C` on `--card-bg` | **6.19:1** | pass |
| caution body `--ink` on `--terracotta-tint` | **12.64:1** | pass |
| caution 4px terracotta accent vs page bg | **4.00:1** | pass (non-text, 3:1) |
| `.copy-btn` text `#9a4a2c` on white / on prompt-box | **6.19 / 5.27:1** | pass — **AUDIT S9 fixed** (was 4.24:1) |
| `.step-check` border `--border-interactive` `#8C8475` on white | **3.70:1** | pass (non-text, 3:1) — **AUDIT S6's checkbox fixed** (was 1.31:1) |
| `side-jump a[aria-current]` `--teal-dark` on `--teal-tint` | **7.57:1** | pass |
| `--ink-soft` on page bg / on card | **6.87 / 7.27:1** | pass |
| white on `--teal` (CTA) / on `--teal-dark` | **6.04 / 8.71:1** | pass |
| `--ink` on hero-band `#F3EFE7` | **12.95:1** | pass |
| progress fill `--teal` on track `#EFE8DC` | **4.96:1** | pass |
| `--ink` on page bg | **14.03:1** | pass |

### Cross-module consistency — what is actually identical
- **One header, 52/52 pages, byte-identical markup** (brand link + font control group).
- **Two footer variants, both internally identical:** the slim footer is byte-identical across **48 pages**; the full footer is identical across `tools.html`, `shobdokosh.html` and `prompt.html`, and `index.html`'s differs only in using bare `#days`/`#progress`/`#faq`/`#whom`/`#modules` anchors where the others correctly prefix `index.html`. Both variants link to all five modules.
- **The share/takeaway card is one component everywhere it appears** — `.share-wrap > figure.share-card > [motif, quote, blockquote.share-text, figcaption.share-foot > span.share-day + span.share-brand] + p.share-caption` — identical on all 46 pages that use it (30 `din-*`, 8 `aay-*`, 7 `pesha-*`, `tools`, `shobdokosh`, `prompt`).
- **The `.day-rail` is identical across its 38 pages**, varying only in the prev/next hrefs and the correct `aria-label` change on the last page of each sequence.
- **`aria-current="page"` is applied correctly** on every cross-page sidebar list (8 `aay-*`, 7 `pesha-*`) and on the "আরও পেশা" self-link.
- **Icon sprites are now clean.** AUDIT M4 (48% of the sprite unused) is largely closed: `index.html` uses 16/16 symbols, and the only symbol unreferenced in static markup is `ic-retry` on 26 `din-*` pages — which `script.js:119` injects at runtime on a wrong quiz answer, so it is **not** waste.

### Page weight / 2G
Only **two of 52 pages exceed 35 KB**:

| Page | Uncompressed | gzip -9 | Driver |
|---|---|---|---|
| `prompt.html` | **53,841 B** | 7,830 B | 44 inlined copy icons = 12,012 B (22%); the remaining 41.8 KB is 44 full prompts plus an 8-section TOC — that is the page's actual content |
| `index.html` | **45,052 B** | 7,863 B | 16,320 B of SVG (36%), of which 6,679 B is the 16-symbol sprite — all 16 referenced — plus the 30-day card grid, the week grid, the FAQ and the progress dashboard |

Shared, cached assets: `style.css` 39,833 B (8,475 B gzip), `script.js` 10,887 B (3,483 B gzip), `favicon.svg` 694 B.

**Assessment: the 53.8 KB page is justified, not bloated — with one exception.** Strip the 12 KB of duplicated copy icon (S6) and `prompt.html` lands at ~46 KB, where essentially all of it is prompt text the reader came for. Nothing else on either page is padding: no webfont, no framework, no tracking, no images, and the sprite is fully referenced.

Worst-case first view (`prompt.html` cold, no cache): **105,255 B uncompressed / ~19.8 KB gzipped**. On a 2G connection (~40 kbit/s effective) that is roughly 21 s uncompressed versus ~4 s gzipped — so the real dependency is whether the host compresses. **GitHub Pages serves gzip for `text/html`, `text/css` and `application/javascript` by default**, so the deployed target is fine; the uncompressed figure matters only if the site is ever moved to a host that does not. Every subsequent page view costs HTML only: 13.8–31.4 KB uncompressed, 2.8–7.8 KB gzipped.

### 320px layout
No source-level overflow risk found: **zero fixed `width` or `min-width` declarations above 300px** anywhere in `style.css`; no `<table>`, `<pre>`, `<code>`, `<img>` or `<iframe>` on any page; `.trail-track` is `overflow-x:auto`; `.share-text` is capped at `30ch`; the only `white-space:nowrap` outside `.sr-only` is `.day-side .td-t`, which is inside a `@media (min-width:1100px)` block and pairs with `overflow:hidden; text-overflow:ellipsis`. As in AUDIT, **a real 320px render was not performed** — this is a source-level clearance, not a device test.

### Carried-over fixes confirmed in place
Verified fixed since `AUDIT.md`: **B1** (placeholder domain — 0 occurrences remain) · **S6 in part** (the custom checkbox is now `--border-interactive` at 3.70:1; the generic card outline is still open, see M12) · **S7** (0 SVGs with a cancelled `aria-label`) · **S9** (`.copy-btn` now 6.19:1) · **M4 in part** (sprites fully referenced) · **M5** (`details.reveal summary` now 48px) · **M7** (the unreachable locked-day branch is gone from `script.js`; only its dead CSS remains — see M3) · **M9** (`script.js:81-92` now shows a "কপি হয়নি" state and an instruction) · **M10** (`script.js:115-116` moves focus to `.quiz-feedback` with `tabindex="-1"`) · **M11** (`404.html` has the favicon).

---

# Open — cannot be settled without a browser or device

Not findings. Listed so they are not mistaken for passes.

1. **Live-region announcement.** `.quiz-feedback` (`role="status"`), `.day-done-confirm` and `#gFilterStatus` all begin `hidden` or empty. Some screen-reader/browser combinations do not announce a region that was absent at the time of change. Needs a TalkBack run.
2. **Rendered tap-target sizes** under the Bangla font stack at the `fs-1`/`fs-2` zoom steps. The figures above are CSS declarations.
3. **A real 320px render**, especially of the pesha caution block's long first bullet and the `prompt.html` two-column grid at its 860px breakpoint.
4. **Clipboard on target devices** — whether `document.execCommand("copy")` succeeds on the low-end Android browsers in scope when served over plain HTTP.
5. **Font fallback** — no webfont is loaded (correct for 2G), so rendering depends entirely on the device.
6. **Actual gzip behaviour of the final host**, which decides whether the figures in *Page weight* are the 20 KB number or the 105 KB number.

---

# Suggested order of work

1. **B1** — one line in `style.css`. Fixes the only visibly-wrong-on-screen defect.
2. **S2** — the caution consolidation and the duplicate-rule deletion. Four edits, ~570 B saved, removes a real visual inconsistency.
3. **S4, S5, S7** — three small markup edits, all accessibility-facing.
4. **S6** — the copy-icon sprite. ~19 KB site-wide; do `prompt.html` first if you only do one.
5. **S3** — decide whether the profession steps become interactive or stop pretending to be.
6. **M1, M2, M3** — three one-liners, do them with any of the above.
7. The remaining MINORs are consistency polish and can wait for the next pass.
