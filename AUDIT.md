# এআই বন্ধু — pre-launch quality audit

**Scope:** `docs/` (index.html, 404.html, din-1…din-30.html, style.css, script.js, robots.txt, sitemap.xml, favicon.svg, share.png) and `content/` (day-01…day-30.md, landing-copy.md).
**Method:** read-only. Scripted checks over all 31 HTML pages + 30 markdown files (Python/regex/HTMLParser), plus full manual reads of `script.js`, `style.css`, `index.html`, `404.html`, `din-1.html`, `din-14.html`, and the complete text of days 2, 5, 8, 10, 13, 16, 17, 18, 20, 23, 27, 30.
**Nothing in this repository was modified.** This file is the only thing written.

> **Snapshot note.** The site was being edited by other agents while this audit ran. All findings below were verified against a byte-for-byte snapshot taken **2026-10-29 16:12:32**. Two files were added after that snapshot (`share.png` at 16:13:12, `favicon.svg` at 16:12:18); both were re-checked against the live directory and are correct — `share.png` is a valid PNG at exactly the declared 1200×630. No other file changed between the snapshot and 16:22:11.

**Verification legend**
- **[ALL]** — verified programmatically across every file of that class.
- **[SAMPLE]** — judgement call from reading a subset; the count given is what was read.
- **[BROWSER]** — cannot be settled from source; needs a real device/AT run. Stated as open, not as pass or fail.

---

## Summary

| Severity | Count |
|---|---|
| BLOCKING | 2 |
| SHOULD-FIX | 10 |
| MINOR / polish | 14 |

---

# BLOCKING

## B1 — Placeholder production domain in 158 places across every page, robots.txt and sitemap.xml

**Files / lines**
- `docs/index.html:16` (canonical), `:26` (og:url), `:27` (og:image), `:35` (twitter:image)
- `docs/din-N.html` for N = 1…30 — four occurrences each, e.g. `docs/din-1.html:8, :18, :19, :27`
- `docs/robots.txt:6` — `Sitemap: https://ai-bondhu.example/sitemap.xml`
- `docs/sitemap.xml` — 32 occurrences (comment header + 31 `<loc>` elements)
- `docs/index.html:8–15` — a 7-line English HTML comment headed `LAUNCH BLOCKER` shipped to every visitor's page source

**What is wrong.** `https://ai-bondhu.example` is a reserved-TLD placeholder, not a real host. Every page's `canonical`, `og:url`, `og:image` and `twitter:image` point at it. The course's own distribution model is social sharing — day 1 through day 30 each end with *"ভালো লাগলে বন্ধুদের সাথে শেয়ার করুন"* and a share card. When a link is pasted into Facebook or WhatsApp, the crawler resolves `og:image` against `ai-bondhu.example`, gets nothing, and renders a bare link with no image and no title card. `share.png` exists locally and is correct, but no crawler will ever reach it at that URL. The canonical tags additionally tell search engines the real site is a duplicate of a host that does not exist.

The project already knows: `index.html:9` literally says `LAUNCH BLOCKER`, and `sitemap.xml:3` says `PLACEHOLDER DOMAIN … Replace every occurrence below with the real published origin before launch`.

**Fix.** Replace all 158 occurrences of `https://ai-bondhu.example` with the real origin (e.g. `https://shasan7774.github.io/ai-bondhu`). Then delete the `LAUNCH BLOCKER` comment block at `index.html:8–15` and the `PLACEHOLDER DOMAIN` comment at `sitemap.xml:2–6`. Verify afterwards with `grep -rc "ai-bondhu.example" docs/` returning 0 everywhere.

**Verification:** [ALL] — counted across all 33 files in `docs/`.

*Already tracked:* `LAUNCH-CHECKLIST.md:17–25` names this item and prescribes the same verification (`grep` for zero hits). It is listed here because it is still unfixed in the code, not because it is unknown to the project.

---

## B2 — Day 8 tells the reader to type their real income and household expenses into the AI, contradicting Day 5's own safety rule, with no caveat

**Files / lines**
- `content/day-08.md:20` — *"নিজের আসল মাসিক আয় আর প্রধান খরচগুলো (বাসা ভাড়া, বাজার, বিদ্যুৎ বিল, যাতায়াত) মনে মনে ঠিক করে নিন।"*
- `content/day-08.md:23` / `docs/din-8.html:209` — the copy-able prompt `আমার মাসিক আয় [সংখ্যা] টাকা। খরচ — বাসা ভাড়া [সংখ্যা], বাজার খরচ [সংখ্যা], বিদ্যুৎ বিল [সংখ্যা], যাতায়াত [সংখ্যা]। … একটা সহজ মাসিক বাজেট বানিয়ে দাও, যাতে প্রতি মাসে কিছু টাকা জমানো যায়।`
- Contradicts `content/day-05.md` — *"আপনি যা কিছু AI-কে টাইপ করে পাঠান, সেটা একটা কোম্পানির সার্ভারে যায়"* and the day-5 rule that personal/sensitive data stays out.

**What is wrong.** Three days after teaching that anything typed into AI lands on a company's server and that personal data should be withheld, the course instructs the reader to enter their actual salary, rent, utility and transport figures — and then produces a savings plan from them. Day 8 carries **no** privacy reminder, and **no** "check important money decisions with a qualified person" caveat. This is the only one of the three advice-domain lessons missing it: day 10 has it, day 13 has it twice (*"একজন ডাক্তার, আইনজীবী বা সংশ্লিষ্ট বিশেষজ্ঞের সাথে অবশ্যই মিলিয়ে নিতে হবে"*), day 2 has the medical one, day 23 and 27 have theirs. Day 8 and day 23 are the only money lessons and only day 23 is safe.

The damage is to trust, not just safety: the lesson's own authority rests on the course being consistent about when to hold data back. A reader who notices the contradiction has reason to doubt day 5.

**Fix.** Two additions to `content/day-08.md` and the matching `docs/din-8.html`:
1. In **আজকের কথা**, after the explanation of what AI can organise, add a sentence in the same voice as day 13 — that AI organises the numbers you give it but is not a financial adviser, and that any real decision about loans, savings products or large sums should be checked with a qualified person.
2. In **নিজে করুন** step 2, add the day-5 callback — e.g. that round or approximate figures are enough, and that account numbers, card details and bKash/Nagad information never go in.

**Verification:** [ALL] for the caveat-word scan across 30 lessons (days 2, 3, 4, 5, 10, 13, 23 carry caveat language; day 8 is the one advice-domain lesson that does not). [SAMPLE] for the judgement that the day-5 / day-8 contradiction matters — days 5, 8, 10, 13, 23 read in full.

---

# SHOULD-FIX

## S1 — 15 copy-able prompts hand the reader unresolved `[…]` placeholders, and the convention is never explained anywhere

**Files / lines** (all `docs/din-N.html`, with the matching `content/day-NN.md` blockquote)

| File:line | id | Placeholders |
|---|---|---|
| din-6.html:192 | d6-prompt-1 | `[অফিস/প্রতিবেশী/আত্মীয়]`, `[আপনার আসল বিষয় লিখুন]` |
| din-8.html:209 | d8-prompt-1 | `[সংখ্যা]` ×5 |
| din-8.html:236 | d8-prompt-2 | `[তালিকাটা লিখুন]` |
| din-9.html:192 | d9-prompt-1 | `[কারণ লিখুন]`, `[কয়দিন]` |
| din-9.html:219 | d9-prompt-2 | `[লেখাটা বসান]` |
| din-10.html:202 | d10-prompt-1 | `[এখানে ইংরেজি লেখাটা বসান]` |
| din-11.html:231 | d11-prompt-2 | `[নির্দিষ্ট প্রশ্নটা লিখুন]` |
| din-15.html:183 | d15-prompt-1 | `[বিষয়ের নাম]` |
| din-17.html:188 | d17-prompt-1 | `[কাজের নাম]` |
| din-18.html:192 | d18-prompt-1 | `[উপলক্ষ্য/বিষয়]` |
| din-21.html:189 | d21-prompt-1 | `[বিষয়ের নাম]` |
| din-22.html:199 | d22-prompt-1 | `[মেসেজটা এখানে লিখুন]` |
| din-25.html:195 | d25-prompt-1 | `[বিষয়টা লিখুন, কিন্তু … সংখ্যা ছাড়া]` |
| din-26.html:202 | d26-prompt-1 | `[আপনার কাজ লিখুন]` |
| din-29.html:202 | d29-prompt-1 | `[পরিস্থিতিটা লিখুন]` |

**What is wrong.** Each of these sits in a `.prompt-box` with a **কপি করুন** button. `script.js:46` copies the blockquote's `textContent` verbatim, so the clipboard receives the literal brackets. A reader who has never used AI — the course's stated audience, *"ছাত্র-ছাত্রী হোন বা চাকরিজীবী, শিক্ষক হোন বা প্রবীণ"* — is taught on days 1–5 that copy → paste → send works, because days 1–5 ship complete prompts. From day 6 onward the same button silently produces a half-finished prompt.

Searched the whole repo for any explanation of the bracket convention (`বন্ধনী`, `ব্র্যাকেট`, `বর্গাকার`, `এর জায়গায়`, `নিজের তথ্য বসিয়ে`): **none exists**. The nearest cues are indirect — `day-17.md:2` *"কাজটা পরিষ্কার করে বলুন, নিচের মতো:"* — which implies substitution but never says to replace the bracketed text.

**Fix.** Pick one and apply it to all 15 uniformly:
1. **Preferred** — add one line of guidance to the `.prompt-box` markup wherever a bracket appears, e.g. a `<p class="prompt-hint">` reading *"বর্গাকার বন্ধনীর `[ ]` ভেতরের অংশটুকু মুছে নিজের তথ্য বসিয়ে নিন।"*, and introduce the convention once on day 6 where it first appears.
2. Or make the brackets visually distinct (a `<mark>` or a styled `<span>`) so they read as blanks rather than as prompt text.

Keep the brackets themselves — removing them would lose the signal entirely. Note `script.js` strips tags, so option 2 is copy-safe: markup inside the blockquote does not reach the clipboard.

**Verification:** [ALL] — every blockquote on all 30 pages scanned for `[…]`; repo-wide grep for any explanatory text.

## S2 — The "reveal" device is inert on all 30 pages: the day's question is hidden inside the collapsed answer

**Files / lines:** `docs/din-N.html` for N = 1…30 — e.g. `din-1.html:139–142`, `din-14.html:143–146`, `din-30.html:139–142`.

**What is wrong.** Every page uses the identical summary text — verified: `আপনার কী মনে হয়? (ট্যাপ করে দেখুন)` appears on 30/30 pages and nothing else does. The day's actual reflective question lives **inside** `<p class="reveal-answer">`, immediately followed by its answer. On din-14: the summary says only "আপনার কী মনে হয়?", and the hidden paragraph opens *"এই সপ্তাহে AI দিয়ে শেখা কাজগুলোর মধ্যে কোনটা আপনার মনে হয় সবচেয়ে বেশি কাজে লাগবে?"* and answers itself in the next clause.

The reader therefore taps a disclosure with no idea what is being asked, and the moment it opens both question and answer are on screen together. There is no moment in which the reader can think. The markdown has the two parts correctly separated (`## আপনার কী মনে হয়?` → question → `**উত্তর:**` → answer); the HTML build merged them.

**Fix.** In each `din-N.html`, move the day's question text into the `<summary>` and leave only the `**উত্তর:**` text in `.reveal-answer`:

```html
<summary>এই সপ্তাহে শেখা কাজগুলোর কোনটা সবচেয়ে কাজে লাগবে? <span class="reveal-hint">(ট্যাপ করে দেখুন)</span></summary>
<p class="reveal-answer">এটা মানুষভেদে আলাদা হতে পারে — …</p>
```

The source data for this is already in `content/day-NN.md` as the two separate parts, so it is a mechanical regeneration.

**Verification:** [ALL] — all 30 pages compared against their markdown; question-merged on 30/30.

## S3 — With JavaScript disabled, the quizzes have no answers and the day-completion flow disappears

**Files / lines:** `docs/script.js:59–80` (quiz), `:99–110` (completion); `docs/din-N.html` — `<p class="quiz-feedback" … hidden>` and `<div class="day-done-confirm" … hidden>` on all 30 pages.

**What is wrong.** Three JS-only behaviours, measured across all 30 pages:
- **Quizzes (60 questions, 30/30 pages).** The correct answer lives only in `data-correct="true"` and the explanation only in `data-explain`. With JS off, every option is an inert button and no `<noscript>` fallback exists on any page. The reader sees the question and three options and can never learn which is right. The markdown already holds the answer in a readable form (`**সঠিক:** গ — …`); it is simply not emitted.
- **Day-complete button (30/30).** `<button data-day-complete="N">` does nothing without JS; the `.day-done-confirm` block is `hidden` in the markup and only `script.js:103` unhides it.
- **Next-day CTA on days 1–4.** That link lives inside the hidden `.day-done-confirm`, so without JS it is unreachable — though `.day-nav` at the bottom still works, so navigation survives. See S4.

The lesson *content* does remain fully readable without JS, and the 30-day trail degrades correctly (a `<noscript>` link list is present on 30/30 day pages and on index.html). So the core promise holds; the interactive layer does not.

**Fix.** Add a `<noscript>` answer block inside each `.quiz-q`, after the options:

```html
<noscript><p class="quiz-feedback is-good">সঠিক উত্তর: <strong>গ</strong> — AI কোনো মানুষ না, …</p></noscript>
```

The text is already in `content/day-NN.md` after `**সঠিক:**`. For the completion button, wrap it in `<noscript>`-aware markup or simply render the next-day link outside `.day-done-confirm` (which S4 requires anyway).

**Verification:** [ALL] — 30/30 pages have quizzes, 0/30 have a quiz fallback; 30/30 have `.day-done-confirm` carrying the `hidden` attribute; 30/30 have the trail `<noscript>`.

## S4 — The "go to next day" CTA exists on days 1–4 and is missing on days 5–29

**Files / lines:** present at `din-1.html:305`, `din-2.html`, `din-3.html`, `din-4.html` (`<a href="din-N+1.html" class="btn-next">পরবর্তী দিনে যান — দিন N+1 →</a>`); absent from `din-5.html:297` through `din-29.html` inside their `.day-done-confirm` blocks. Correctly absent on `din-30.html:277`.

**What is wrong.** On days 1–4 the reader presses **দিন সম্পূর্ণ করুন**, the confirmation panel opens, and a large pill button carries them straight into the next day. From day 5 the panel opens with only the congratulation line and dead-ends — the reader must scroll past the teaser box to the small `.day-nav` pill at the very bottom. That is exactly the point in a 30-day habit course where drop-off is most expensive, and the design clearly intended the CTA to be there.

Counted: `class="btn-next"` appears once in din-1…din-4 and zero times in din-5…din-30.

**Fix.** Add the same element to `din-5.html` … `din-29.html`, inside `.day-done-confirm`, after `<p class="done-msg">`:

```html
<a href="din-6.html" class="btn-next">পরবর্তী দিনে যান — দিন ৬ →</a>
```

with the Bengali numeral matching the target day. `.btn-next` is already styled in `style.css:272–277`.

**Verification:** [ALL] — counted on all 30 pages.

## S5 — Day 30 renders a dead, unstyled "পরবর্তী দিন" label, and the course ends with no way forward

**Files / lines:** `docs/din-30.html:294` — `<div class="nav-next disabled"><span>পরবর্তী দিন</span></div>`; `docs/style.css:309` — only `.nav-prev.disabled{ visibility:hidden; }` exists.

**What is wrong.** There is no `.nav-next.disabled` rule in the stylesheet. The pill styling at `style.css:303` targets `.nav-prev a, .nav-next a`, so a bare `<span>` gets none of it. Day 30 therefore shows plain inline text reading "পরবর্তী দিন" in the bottom-right, with no border, no link, and no indication it is intentionally inactive — it reads as a broken link on the final page of the course. Day 1 does this correctly because `.nav-prev.disabled` is hidden.

Separately, day 30 is a complete dead end: the completion panel (`din-30.html:277–282`) has no onward link, and the closing teaser invites the reader to *"মাঝেমধ্যে পুরনো দিনগুলো আবার পড়ুন"* without linking anywhere. The only escape is the header brand link or the trail.

**Fix.** Two changes:
1. In `style.css:309`, change to `.nav-prev.disabled, .nav-next.disabled{ visibility:hidden; }`.
2. In `din-30.html`, add a closing CTA inside `.day-done-confirm` — e.g. `<a href="index.html" class="btn-next">৩০ দিনের তালিকায় ফিরুন</a>` — so the finished reader has somewhere to go.

**Verification:** [ALL] — `nav-next disabled` occurs on din-30 only; CSS grepped for every `.disabled` rule.

## S6 — Interface boundaries fail WCAG 2.1 SC 1.4.11 at 1.31–1.39:1, including the custom checkbox that has no other visual form

**Files / lines:** `docs/style.css:14` (`--border:#E3DACB`), used as the sole boundary at `:198` (`.step-check`), `:243` (`.quiz-options button`), `:288` (`.signup-form input`), `:306` (`.nav-prev a, .nav-next a`), `:101` (`.trail-dot`).

**Measured contrast** (computed, WCAG 2.x relative-luminance formula):

| Boundary | Against | Ratio | Required |
|---|---|---|---|
| `#E3DACB` checkbox border | `#FFFFFF` card | **1.39:1** | 3:1 |
| `#E3DACB` quiz-option border | `#FFFFFF` card | **1.39:1** | 3:1 |
| `#E3DACB` nav pill / trail dot | `#FBF8F4` page | **1.31:1** | 3:1 |
| `#CBB9AD` wrong-answer border | `#F3ECE4` | **1.62:1** | 3:1 |

**What is wrong.** The worst case is `.step-check`: `appearance:none` strips the native checkbox, leaving a white 26×26 square on a white card whose *only* visual definition is a 1.39:1 border. For a low-vision reader — and the course explicitly targets প্রবীণ readers — the daily checklist boxes are effectively invisible until ticked (ticked state is teal on white, 6.04:1, fine). The unticked state is the one that matters, because that is what the reader is looking for.

Note this is a *non-text* contrast issue only. **Every text pair in the palette passes AA**, most of them comfortably — see the PASSED section for the full table.

**Fix.** Introduce a darker token used only for interactive boundaries — e.g. `--border-interactive:#8C8475`, which measures **3.70:1** on `#FFFFFF` and **3.50:1** on `#FBF8F4`, clearing 1.4.11 on both surfaces with headroom while staying inside the warm-neutral palette. Apply it to `.step-check`, `.quiz-options button`, `.signup-form input`, `.nav-prev a/.nav-next a`, `.trail-dot`. Leave `--border` at `#E3DACB` for purely decorative separators (`.card`, `.section-divider`, `.together-step-row`) where 1.4.11 does not apply.

**Verification:** [ALL] — ratios computed from the declared tokens, not sampled. [BROWSER] — the rendered appearance on a real low-end LCD is not verifiable from source.

## S7 — 32 illustrations carry an `aria-label` that an `aria-hidden="true"` parent cancels

**Files / lines:** `docs/index.html:76–77`, `docs/404.html:27–28`, and `docs/din-N.html:122–123` for all N = 1…30 — the pattern `<div class="hero-art" aria-hidden="true"> <svg role="img" aria-label="…">`.

**What is wrong.** `aria-hidden="true"` on an ancestor removes the entire subtree from the accessibility tree, so the carefully written Bengali alt text — e.g. din-5's *"একটি ঢাল কয়েকটি ব্যক্তিগত জিনিস রক্ষা করছে — পরিচয়…"* — never reaches a screen reader. The markup contradicts itself: someone wrote descriptions intending them to be announced, and a wrapper silences all 32.

These are concept illustrations keyed to each day's lesson, not pure ornament, so the descriptions have value.

**Fix.** Decide once and apply to all 32. Either:
- **Keep the descriptions** (recommended, since they exist and are good): remove `aria-hidden="true"` from the `.hero-art` wrapper and keep `role="img"` + `aria-label` on the `<svg>`. Nothing else in the subtree is focusable, so there is no keyboard side-effect.
- **Or treat them as decorative**: delete `role="img"` and `aria-label` from the `<svg>` and keep the wrapper's `aria-hidden`, so the markup stops lying about intent.

The 567 genuinely decorative SVGs (dividers, step icons, button glyphs) are correctly hidden and need no change.

**Verification:** [ALL] — ancestor-aware parse of every `<svg>` on all 32 pages: 567 hidden, 62 labelled, **0 unlabelled-and-exposed**, 32 labelled-inside-a-hidden-parent.

## S8 — Day 2 assumes the reader has a child, breaking the deliberate universalisation

**Files / lines:** `content/day-02.md:13` and `docs/din-2.html:180` — *"তাকে বললে তিনি সুন্দর করে একটা দরখাস্ত লিখে দিতে পারবেন, কোনো কঠিন শব্দের মানে বুঝিয়ে দিতে পারবেন, **আপনার সন্তানের** পড়া সহজ করে বুঝিয়ে দিতে পারবেন।"*

**What is wrong.** This is second-person possessive — it tells the reader *their* child's studies, as a given. The course is otherwise rigorous about not assuming family structure: the একসাথে করুন sub-line is identical on 30/30 pages and reads *"সন্তান, বাবা-মা, বন্ধু বা সহকর্মী — যে কারো সাথে।"*, which deliberately offers four alternatives. The index audience grid lists শিক্ষার্থী, চাকরিজীবী, শিক্ষক, বাবা-মা, প্রবীণ, যে কেউ. Day 2 is the only place the universalisation slips.

**Fix.** Replace the clause with a non-possessive example, e.g. *"কোনো পড়ার বিষয় সহজ করে বুঝিয়ে দিতে পারবেন"* — same meaning, no assumption. Apply to both `content/day-02.md:13` and `docs/din-2.html:180`.

The one other hit, `content/day-18.md` — *"নতুন দোকান বা সন্তানের নাম"* — is a list of generic examples of things one might name, not an assertion about the reader. No change needed.

**Verification:** [ALL] — all 30 lessons scanned for 10 parent-assumption phrases; two hits, one real.

## S9 — `.copy-btn:hover` drops to 4.24:1, below AA for its text size

**File / line:** `docs/style.css:187` — `.copy-btn:hover{ background:var(--terracotta); color:#fff; }`

**What is wrong.** `#FFFFFF` on `#C25E3A` measures **4.24:1**. The button text is `font-size:.92rem` bold ≈ 16.5px at the 18px root — below the 18.66px-bold threshold for WCAG "large text", so it needs 4.5:1 and misses. The resting state (`#9A4A2C` on white, **6.19:1**) is fine; only hover fails. Touch users never see it, desktop users do.

The same pair appears at `style.css:291–293` on `.signup-form button`, but `.signup-form` is not used on any page (see M6).

**Fix.** Darken the hover background to the already-defined `#9A4A2C` (white on it = 6.19:1). Keeping `--terracotta` and switching the text to `var(--ink)` does not work either — `#2A2724` on `#C25E3A` is only 3.50:1 — so darkening the background is the right move.

**Verification:** [ALL] — computed from the declared tokens.

## S10 — Two `<nav>` landmarks per day page, only one labelled

**Files / lines:** `docs/din-N.html` — `<nav class="trail" aria-label="৩০ দিনের অগ্রগতি">` (labelled) and `<nav class="day-nav">` at the page foot (unlabelled), on all 30 pages; also `docs/404.html:59`.

**What is wrong.** When a page has more than one landmark of the same type, each needs a distinguishing accessible name, or a screen-reader user navigating by landmark hears "navigation" twice with no way to tell the 30-day trail from the prev/next pair.

**Fix.** Add `aria-label="পাঠের মধ্যে চলাচল"` (or similar) to `<nav class="day-nav">` on all 30 day pages and on `404.html`.

Related, smaller: on `index.html:234` the trail is a plain `<div class="trail">` inside `.day-grid-section`, so the index has no `<nav>` landmark at all. Wrapping it in `<nav aria-label="৩০ দিনের তালিকা">` would make the index consistent with the day pages.

**Verification:** [ALL] — every `<nav>` element on all 32 pages enumerated.

---

# MINOR / polish

**M1 — Quiz question wording drifted from the source.** `docs/din-16.html` q1 reads *"AI ব্যবহার শেখানোর সবচেয়ে ভালো উপায় কোনটা?"*; `content/day-16.md` reads *"**কাউকে** AI ব্যবহার শেখানোর সবচেয়ে ভালো উপায় কোনটা?"*. The dropped word makes the HTML version slightly ambiguous about who is being taught. This is the **only** text divergence found in 60 questions and 180 options. [ALL]

**M2 — Teaser label style is inconsistent across the course.** Days 1–4 open the teaser with `<strong>আগামীকাল:</strong>`; days 5–29 have no bold label at all; day 30 uses `<strong>এরপর কী?</strong>`. Pick one — most likely restore `<strong>আগামীকাল:</strong>` on days 5–29 and keep day 30's variant, since it genuinely says something different. [ALL]

**M3 — The একসাথে করুন section has a copy-able prompt on only 9 of 30 days.** Days 1–6, 8, 9, 11 have one; days 7, 10, 12–30 have none. This faithfully mirrors `content/day-NN.md` (the blockquote is absent there too), so it is a content decision rather than a build bug — but the sub-line and checkbox are on 30/30, which makes the missing prompt look like an omission rather than a choice. Worth settling one way. [ALL]

**M4 — 48% of the inlined icon sprite is never used.** Each day page inlines the full `<svg class="icon-defs">` block (~4,555 B) but references only about half its symbols; the unused symbol markup averages **2,189 B per page, 65,674 B across the 30 pages**. Because HTML is not cached the way `style.css` and `script.js` are, this is paid on every page view — material on 2G. Fix by emitting only the symbols each page actually uses, or by moving the sprite to a cached external file (which costs one extra request but is paid once). [ALL]

**M5 — The reveal disclosure is the smallest control in the design.** `style.css:155` sets `details.reveal summary{ min-height:28px }` while every other interactive element declares 48px or 52px (`.font-ctrl button`, `.copy-btn`, `.step-label`, `.quiz-options button`, `.faq summary`, `.nav-prev a` all 48px; `.btn-primary`, `.btn-next`, `.cta-button` 52px). It clears WCAG 2.2 SC 2.5.8 (24px minimum) but is inconsistent and is the first control on every page. Raise to 48px.

**M6 — Dead CSS.** `.wrap` (`style.css:54`), `.signup-form` and its children (`:285–295`), `.form-note` (`:296`) match no element on any of the 32 pages — roughly 600 B of the 17,797 B stylesheet. (Note: `.fs-1`, `.fs-2`, `.trail-dot`, `.is-complete`, `.is-current`, `.is-right`, `.is-wrong`, `.is-good`, `.is-nudge`, `.is-copied` also match no static markup but are applied at runtime by `script.js` — those are **not** dead.) [ALL]

**M7 — Unreachable "locked day" branch, carrying a contrast failure if ever reached.** `script.js:89` sets `var live = n <= 30;` inside a loop bounded by `n <= 30`, so `live` is always true and the `<span class="… is-locked">` branch at `:93` can never execute. The matching style (`style.css:105–107`, `#B9B1A2` on `#FBF8F4`) measures **2.01:1**. Either delete the branch and its style, or — if days are ever released on a drip — fix the colour before re-enabling it.

**M8 — English "LAUNCH BLOCKER" comment ships to users.** `index.html:8–15`. Invisible, but it is English debug text in the page source of a Bengali-only product, and it will stop being true the moment B1 is fixed. Remove with B1.

**M9 — Copy failure is silent.** `script.js:52–54`: if `navigator.clipboard` is unavailable *and* `document.execCommand("copy")` fails, nothing happens — no label change, no message. On an older Android browser served over plain HTTP the clipboard API is unavailable, so the fallback is the real path. Consider an error state (e.g. *"কপি হয়নি — লেখাটা হাতে নির্বাচন করে কপি করুন"*).

**M10 — Focus is dropped when a quiz is answered correctly.** `script.js:71` disables every option after a correct answer, including the one the user just activated. A keyboard or switch user loses their place and focus falls to `<body>`. Consider moving focus to the `.quiz-feedback` element (with `tabindex="-1"`) instead of relying solely on the live region.

**M11 — `404.html` omits the favicon link** that all 31 other pages carry (`<link rel="icon" href="favicon.svg" type="image/svg+xml">`). Cosmetic, one line.

**M12 — `din-27.html` merges two source paragraphs.** `content/day-27.md` has five paragraphs in আজকের কথা; the HTML renders four, with the final *"AI একজন সাহায্যকারী, বিচারক না।"* appended to the preceding paragraph. No content lost, but the closing line was clearly meant to stand alone. This is the only such divergence across 30 pages. [ALL]

**M13 — Hero illustrations are reused.** 21 distinct hero SVGs cover 30 days: one is used on days 1, 6, 10, 12, 15 and 21; four more are used twice (2/8, 3/7, 4/9, 5/24). The concept diagrams inside আজকের কথা are all 30 distinct, so only the hero slot repeats. Not a defect — flagging because a reader on day 12 sees the day-1 picture again, which slightly undercuts the sense of progress. [ALL]

**M14 — Day 10's একসাথে করুন suggests decoding a medicine leaflet without repeating the caveat at the point of action.** `content/day-10.md` — *"একটা ইংরেজি লেখা (যেমন ওষুধের পাতা, কোনো প্যাকেটের নির্দেশনা) খুঁজে বের করুন"*. The lesson's আজকের কথা does carry the caveat (*"ডাক্তারের গুরুত্বপূর্ণ নির্দেশনার মতো বিষয়ে … বিশেষজ্ঞের সাথে একবার মিলিয়ে নেওয়াই নিরাপদ"*), so this is well short of B2 — but the activity is several screens below the warning. A half-line reminder in the activity itself would close it.

---

# Open — cannot be settled without a browser or device

These are **not** findings. They are checks the source cannot answer, listed so they are not mistaken for passes.

1. **Live-region announcement.** `<p class="quiz-feedback" role="status" aria-live="polite" hidden>` and `<div class="day-done-confirm" role="status" aria-live="polite" hidden>` both start with the `hidden` attribute, which keeps them out of the accessibility tree until revealed. Some screen-reader/browser combinations do not announce a live region that was absent at the time of the change. Needs a TalkBack run on Android Chrome before being claimed as working.
2. **Rendered tap-target sizes.** All figures above are the CSS `min-height`/`width` declarations. Actual rendered boxes under the Bengali font stack — and at the `fs-1`/`fs-2` zoom steps — were not measured.
3. **320px layout.** No fixed box wider than 300px exists in the stylesheet, the trail is `overflow-x:auto`, `.share-text` is capped at `30ch`, and there are no `<table>`, `<pre>`, `<code>`, `<img>` or `<iframe>` elements anywhere in the site, so the classic overflow sources are absent. But a real 320px render was not performed.
4. **Clipboard on target devices.** Whether `document.execCommand("copy")` succeeds on the specific low-end Android browsers in scope.
5. **Font fallback.** `"Noto Sans Bengali","Kalpurush","SolaimanLipi","Nirmala UI",system-ui,sans-serif` — no webfont is loaded (correct for 2G), so rendering depends entirely on what the device has installed. Not verifiable from source.
6. **2G timing.** Uncompressed first view of day 1 is **51.3 KB** (din-1.html 28,788 + style.css 17,797 + script.js 5,267 + favicon.svg 694). Subsequent days cost only the HTML (25.7–29.3 KB). Whether that is acceptable depends on the server's gzip/brotli configuration, which is not in this repository.

---

# PASSED

Every item below was verified programmatically across all files of its class unless marked otherwise.

### Interactivity wiring — 30/30 pages clean
- **`body data-day`** matches the file's day number on 30/30 pages, and `data-day-complete` matches it on 30/30. `script.js:86` and `:101` will resolve correctly everywhere.
- **`.trail-track`**, **`data-font-dec`**, **`data-font-inc`**, **`.day-done-confirm`**, **`<script src="script.js">`** present on 30/30.
- **`data-step-id`** present on every page, always on the `<input type="checkbox">` element the script queries (`script.js:25`), never on a wrapper. Every value is namespaced `d<N>-…` and **zero collisions** exist within or across pages.
- **Element ids are unique on every page** — 0 duplicates across all 32 pages.
- **Every `<label for=…>` resolves** to an existing id, and **every form control has an accessible name** — 0 orphans, 0 unlabelled inputs, across 32 pages.
- **All 40 `data-copy` buttons** point at an existing `<blockquote id>` that is non-empty, and all 40 contain the `.copy-label` span that `script.js:42` depends on. 0 broken.
- **Every `.quiz-q` carries exactly one `.quiz-feedback`** and a non-empty `data-explain` — 60/60.
- **Every `aria-labelledby` / `aria-describedby` / `aria-controls` target resolves** — 0 orphans across 32 pages.
- **No `data-explain` value contains `<`, `>` or `&`**, so the `innerHTML` path at `script.js:69` cannot produce broken markup.

### Quiz integrity — 60/60 questions correct
- **Exactly one `data-correct="true"`** per question: 60/60.
- **The HTML's correct option matches the markdown's `**সঠিক:**` letter**: 60/60, index-for-index. Zero mismatches.
- **All 180 option texts match their markdown source character-for-character** (after whitespace normalisation): 180/180.
- **No duplicate options, no empty options**: 60/60.
- **All options are `<button type="button">`** — none will submit anything.
- Only divergence found in the entire quiz corpus is M1 above.

### Navigation — unbroken 1→30
- **prev/next chain verified on all 30 pages**: day 1 has no prev and `.nav-prev.disabled`; days 2–29 have exactly `din-(N−1).html` and `din-(N+1).html`; day 30 has prev only. No gaps, no wrong targets, no off-by-one.
- **The 30-day trail resolves on every page**: the `<noscript>` fallback on 30/30 day pages and on index.html links to din-1…din-30, all 30 files exist. The JS-generated trail (`script.js:88–94`) emits the same 30 hrefs.
- **Every internal link in the site resolves to a real file** — all `href` values across 32 pages checked against the directory. **0 broken** (`favicon.svg` and `share.png` were missing at snapshot time and have since been added; both re-verified against the live directory).
- **Every `<use href="#…">` resolves to a `<symbol>` defined on the same page** — 0 unresolved across 32 pages.
- **Every in-page fragment (`href="#main"`) resolves** — 0 orphans.

### Consistency — 30/30 pages complete
- All 11 required structural elements present on 30/30 pages: `details.reveal`, আজকের কথা, নিজে করুন, একসাথে করুন, `.together-subline`, the together checkbox, আজকের মূল কথা, মিলিয়ে নিন, `.share-card`, teaser box, `.day-nav`.
- **The markdown heading set is byte-identical across all 30 lessons**: আপনার কী মনে হয়? · আজকের কথা · নিজে করুন · একসাথে করুন · মিলিয়ে নিন · আজকের মূল কথা · আগামীকাল.
- **`নিজে করুন` has at least one copy-able prompt on 30/30 pages**, and the step count matches the markdown exactly on 30/30 (0 divergences in step text).
- **No leftover content from another day found anywhere.** Checked by cross-matching every page's h1, title, day-label, share-day, key point, teaser and reveal answer against `day-NN.md`: `<h1>` matches the markdown title 30/30; আজকের মূল কথা matches 30/30; the share card echoes the key point verbatim 30/30; the teaser matches 30/30; the reveal answer matches 30/30.
- **Day numbering is internally consistent on all 30 pages** — `<title>`, `<h1>`, `.day-label` ("দিন N / ৩০") and `.share-day` all carry the same Bengali numeral. All 30 titles unique.
- **Time chips are uniform**: `সময়: ৩ মিনিট` ×30 and `সময়: ৫ মিনিট` ×30.
- **The একসাথে করুন sub-line is identical on 30/30 pages.**

### Accessibility
- **Exactly one `<h1>` on every one of the 32 pages**, and **no heading-level skips anywhere** — every page starts at h1 and steps h1→h2 only.
- **Zero unlabelled, exposed SVGs** across 32 pages. 567 decorative SVGs correctly hidden; 62 carry labels. (The 32 contradictory ones are S7.)
- **Skip link present and functional on all 32 pages** — `<a class="skip-link" href="#main">` with a matching `<main id="main">`; `style.css:56–60` moves it on-screen on `:focus` (plain `:focus`, so it works in older browsers too).
- **Focus states are defined and nothing suppresses them.** `style.css:42–45` gives `a`, `button`, `summary`, `input` a 3px teal outline on `:focus-visible`, and there is **no `outline:none` or `outline:0` anywhere in the stylesheet** — so browsers without `:focus-visible` support fall back to the UA default ring rather than losing focus indication.
- **All text contrast passes WCAG AA** (computed, not sampled):

| Pair | Ratio | AA (normal) |
|---|---|---|
| body `#2A2724` on `#FBF8F4` | 14.03 | pass |
| prompt text on `#F8EAE3` | 12.64 | pass |
| white on `--teal-dark` (buttons, share card) | 8.71 | pass |
| link `#0B5454` on `#FBF8F4` | 8.23 | pass |
| `--teal-dark` on `--teal-tint` (chips, reveal, quiz feedback) | 7.57 | pass |
| `--ink-soft` on card white | 7.27 | pass |
| `--ink-soft` on `#FBF8F4` (captions, trail label, form note) | 6.87 | pass |
| `.quiz-feedback.is-nudge` `#5B564F` on `#F3EEE6` | 6.29 | pass |
| `.together-subline` on tint | 6.31 | pass |
| `.copy-btn` resting `#9A4A2C` on white | 6.19 | pass |
| white on `--teal` (CTA, skip link) | 6.04 | pass |
| `--teal` focus ring on page bg | 5.71 | pass (≥3:1 for UI) |

  The only text exception is S9 (`.copy-btn:hover`, 4.24:1). The only non-text exceptions are S6.
- **Tap targets**: 48px minimum declared on `.font-ctrl button`, `.copy-btn`, `.step-label`, `.quiz-options button`, `.nav-prev a`/`.nav-next a`, `.faq summary`, `.signup-form input`; 52px on `.btn-primary`, `.btn-next`, `.cta-button`. `.step-check` is 26×26 but sits beside a full-width 48px `<label>` that toggles it, so the effective target is the label. Only `details.reveal summary` at 28px is out of line (M5).
- **Zoom is not blocked** — `width=device-width, initial-scale=1` with no `maximum-scale` or `user-scalable=no`, on 32/32 pages.
- **`lang="bn"`, `<title>` and `<meta name="description">` present and correct on 32/32 pages.**

### Progressive enhancement
- **All lesson prose is in the static HTML** — আজকের কথা, নিজে করুন steps, একসাথে করুন, আজকের মূল কথা, share card and teaser are plain markup on 30/30 pages and need no JS.
- **The reveal (`<details>/<summary>`) is native HTML** and opens without JS on 30/30 pages — so the day's question and answer are reachable with scripting off.
- **The 30-day trail degrades correctly** — a `<noscript>` list of all 30 links on 30/30 day pages and on index.html.
- **Navigation survives entirely without JS** — `.day-nav` prev/next are plain `<a>` elements outside any hidden container on 30/30 pages.
- What breaks is listed in S3.

### Mobile / 2G
- **No page exceeds 35 KB.** Largest is `din-14.html` at **29,346 B**; smallest day page `din-16.html` at 25,697 B; `index.html` 22,737 B; `404.html` 4,473 B. Ten pages sit in the 28–29.3 KB band.
- **Zero external requests.** No `src`/`href` on any page resolves to an external host (the only absolute URLs are the `og:`/`canonical` metadata of B1, which browsers never fetch); no webfonts, no CDN, no `@import`, no inline `<script>` blocks, no `<img>`, `<iframe>` or `<video>` anywhere. Everything is `style.css`, `script.js`, `favicon.svg` and inline SVG.
- **No horizontal-overflow source found.** No `<table>`, `<pre>`, `<code>` or raster `<img>` on any page; no long unbroken Latin or Bengali token ≥26 characters in any visible text across 32 pages; `img,svg{max-width:100%}` is set globally (`style.css:38`); the 30-dot trail is `overflow-x:auto`; `.share-text` is capped at `30ch`.
- **No fixed box wider than 300px exists in the stylesheet**, and the `@media (max-width:420px)` block collapses `.day-structure` to one column and `.audience-grid` to two, and drops the root font to 17px.

### Content safety — all 30 lessons scanned
- **No instruction anywhere leads a reader to share an OTP, PIN, password, NID or bank detail.** Every one of the 24 credential-term hits is in day 5 (the privacy lesson) or days 7, 22, 23, 29, and in every case the surrounding text is an instruction *not* to share, or a scam-recognition warning. Day 5 states the rule explicitly: *"আপনার জাতীয় পরিচয়পত্র (NID) নম্বর, ব্যাংক অ্যাকাউন্ট বা কার্ডের তথ্য, কোনো পাসওয়ার্ড … এসব না দেওয়াই নিরাপদ।"* Day 23 teaches the voice-clone scam defence correctly (hang up, call back on the known number). The one gap is B2, which is about the reader's own financial figures, not credentials.
- **Medical / legal / financial caveats are present where needed on days 2, 3, 4, 5, 10, 13 and 23.** Day 13 is exemplary — the caveat appears in the reveal answer, twice in আজকের কথা, in step 4, in quiz q2 and in the key point. Day 8 is the exception (B2); day 10's placement is slightly weak (M14).
- **Zero invented statistics or unverifiable numeric claims.** A scan for every number followed by `%`, `শতাংশ`, `কোটি`, `লাখ`, `হাজার`, `মিলিয়ন`, `বিলিয়ন` or `গুণ` across all 30 lessons returned **nothing**. The course makes no quantitative claims at all — unusual and good.
- **Zero placeholders, TODOs, lorem text or English debug text in user-visible content.** Scanned all 30 markdown files and the rendered text of all 32 pages for `TODO`, `FIXME`, `XXX`, `TBD`, `DRAFT`, `lorem`, `placeholder`, `coming soon`, `undefined`, `null`, `NaN`, `example.com`, `{{`, `Day N`. **Zero hits in visible text.** (`ai-bondhu.example` appears only inside `<meta>`/`<link>` attributes and one HTML comment — B1 and M8.)
- **No run of Latin text longer than 24 characters appears in any page's visible content** — no untranslated strings leaked through.

### Bangla consistency
- **Respectful আপনি throughout.** Scanned all 30 lessons for তুমি/তোমার/তোমাকে/তুই/তোর outside the AI-prompt blockquotes: **zero occurrences**. The তুমি-form verbs (`বলো`, `দাও`, `করো`) appear only inside prompts, where they address the AI — the correct and consistent convention.
- **Terminology is stable across all 30 days.** `AI` in Latin script on 30/30 days; `এআই` reserved exclusively for the brand name and never used in lesson prose (0 occurrences in 30 lesson bodies); no mixing with `চ্যাটবট`, `প্রম্পট` or `হ্যালুসিনেশন` anywhere. `যাচাই` is the consistent verb for verification, used on 17 days.
- **Tool naming is consistent** — `Gemini বা ChatGPT` on 24 days; day 1 introduces `gemini.google.com` concretely; days 4, 16, 17, 18 and 20 use the generic `AI অ্যাপ খুলে`, appropriate once the tool is established.
- **The universalisation holds on 29 of 30 days** — the একসাথে করুন sub-line offers four relationship options identically on 30/30, and the index audience grid spans শিক্ষার্থী / চাকরিজীবী / শিক্ষক / বাবা-মা / প্রবীণ / যে কেউ. The single slip is S8.

---

## Suggested order of work

1. **B1** — one find-and-replace plus two comment deletions. Unblocks sharing, which is the growth mechanism.
2. **B2** — two paragraphs of Bengali in `day-08.md` and `din-8.html`.
3. **S4, S5** — mechanical, ~26 small edits plus one CSS line. Fixes the completion flow end to end.
4. **S3, S1** — both are regeneration passes over the 30 pages from data already in `content/`; worth doing in the same build run.
5. **S2** — also a regeneration pass; the split question/answer already exists in the markdown.
6. **S6, S7, S9, S10** — accessibility pass; S6 is one new token plus five selectors.
7. **S8, M1, M2, M12** — copy fixes, five minutes total.
8. Remaining MINOR items as time allows; **M4** is the only one with a real user-facing cost (2 KB per page on 2G).
