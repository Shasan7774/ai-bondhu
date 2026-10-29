# এআই বন্ধু — pre-launch checklist

Written for one person working evenings. Work top to bottom; the order is deliberate.

Each item is marked:

- **[BLOCKING]** — do not publish, or do not announce, until this is done.
- **[FOLLOW-UP]** — can land in the days after launch without hurting anyone.

Tick boxes as you go. Nothing here needs a second person.

---

## 1. Content and copy

- [ ] **[BLOCKING] Replace the placeholder domain everywhere.**
      The placeholder is `https://ai-bondhu.example`. Decide the real address first — either
      `https://shasan7774.github.io/ai-bondhu/` or a custom domain — then replace it in:
  - `docs/sitemap.xml` — every `<loc>` (31 of them) and the comment at the top
  - `docs/robots.txt` — the `Sitemap:` line
  - `README.md` — the deploy section, if you wrote a different address there
  - any `og:url`, `og:image` or `<link rel="canonical">` tag in the `<head>` of
    `docs/index.html` and `docs/din-1.html` … `docs/din-30.html`
  - `docs/CNAME` — only if you are using a custom domain; create it with the bare hostname
      Search the whole repo for `ai-bondhu.example` afterwards and confirm zero hits.

- [ ] **[BLOCKING] Read several lessons end to end and check the Bangla voice.**
      Not a spell-check — a tone check. Pick at least day 1, one mid-course day, and day 30, plus
      two at random. For each, ask:
  - Would someone who has never used an AI tool follow this without stopping?
  - Is every English term explained in Bangla the first time it appears?
  - Does the analogy in **আজকের কথা** feel local and familiar, not translated?
  - Does the prompt in **নিজে করুন** actually produce a sensible answer? Run it yourself in
    ChatGPT and Gemini and see.
  - Is the tone a friend explaining something, not a teacher lecturing?
      Read at least a couple of them aloud. Awkward Bangla is audible before it is visible.

- [ ] **[FOLLOW-UP] Have one non-technical person read day 1 in front of you.**
      A relative or neighbour who fits the audience. Say nothing, watch where they pause. This is
      the single highest-value test available, but it needs another person's time, so it does not
      block launch.

---

## 2. Device and connection testing

- [ ] **[BLOCKING] Test on a real low-end Android phone.**
      Not a desktop browser's phone emulator — a genuine budget device, ideally an older one with
      a small screen and limited memory. Check:
  - Bangla text renders correctly, with no boxes or broken conjuncts (the site uses whatever
    Bangla font the device already has — this is exactly where that assumption gets tested)
  - the ক- / ক+ font size buttons work and the larger sizes stay readable
  - tap targets are comfortable with a thumb
  - nothing overflows sideways; the page never scrolls horizontally
  - scroll down a full lesson page — no jank

- [ ] **[BLOCKING] Test on a genuinely slow connection.**
      Either throttle in DevTools to "Slow 3G" or slower, or test on a real 2G/EDGE connection in
      an area with weak coverage. A lesson page should appear quickly and completely. Open the
      Network tab and confirm:
  - **no request leaves the origin** — only the HTML, `style.css`, `script.js`
  - each page is in the region of 25KB
  - `style.css` and `script.js` come from cache on the second page, not re-downloaded

- [ ] **[BLOCKING] Test with JavaScript disabled.**
      In the browser settings, turn JS off and reload. Confirm:
  - all lesson text is readable
  - the `<noscript>` list of all 30 days appears and every link works
  - prev/next navigation works
  - the copy buttons and checkboxes simply do nothing visible rather than looking broken
      The site must be usable, if plainer, with JS off. If anything is unreadable, that is a bug
      to fix before publishing.

- [ ] **[BLOCKING] Verify the copy-to-clipboard buttons on mobile.**
      Test on an actual phone, in Chrome and in the in-app browser inside the Facebook app —
      that in-app browser is where a large share of your traffic will land. For each: tap
      **কপি করুন**, confirm the label changes to **কপি হয়েছে ✓**, then paste into the ChatGPT or
      Gemini app and confirm the full prompt arrived.
      One thing to know: `navigator.clipboard` only works in a secure context. Over HTTPS (which
      GitHub Pages always is) it works; if you are testing over plain `http://` on a LAN IP it
      falls back to the older `execCommand` path, so test the real HTTPS URL before you trust the
      result.

- [ ] **[BLOCKING] Confirm progress survives a browser restart.**
      Progress is stored in the browser's own `localStorage` under the keys `aib_font`,
      `aib_steps` and `aib_done`. On a phone:
  1. Complete a day, tick some step checkboxes, change the font size.
  2. Fully close the browser (swipe it out of recents, not just background it).
  3. Reopen and return to the site.
      The completed day should still show as complete in the trail, the checkboxes still ticked,
      the font size still applied. Also check the same thing on a second day page so the trail
      itself is confirmed.
      Then test the failure case honestly: open the site in a private/incognito window and
      confirm it still works normally with no stored progress. Some readers will be in that mode
      permanently.

- [ ] **[FOLLOW-UP] Test the 404 page.**
      Once published, visit a URL that does not exist (e.g. `/din-31.html`) and confirm
      `404.html` is served and styled correctly, with working links home and to day 1.

---

## 3. Sharing and discovery

- [ ] **[BLOCKING] Check the Facebook link preview.**
      Facebook is your main distribution channel, so a broken preview costs you real reach. Paste
      the live URL into the
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and confirm:
  - the title and description appear, in Bangla, not garbled
  - a preview image appears — note that this site contains no image files at all (every
    illustration is inline SVG), so an `og:image` needs a real raster image added to `docs/`,
    referenced by an absolute URL. If no image exists yet, either add one or accept the
    text-only preview knowingly.
  - press **Scrape Again** after any change; Facebook caches aggressively and will keep showing
    an old preview otherwise
      Do the same once for a day page, not just the landing page — people will share individual
      days.

- [ ] **[FOLLOW-UP] Check the preview on WhatsApp and Messenger too.**
      Those are where a link actually spreads in Bangladesh. Send yourself the link in each and
      see what renders.

- [ ] **[FOLLOW-UP] Submit the sitemap to Google Search Console.**
      Verify ownership of the domain, then submit `/sitemap.xml`. Low effort, slow payoff — it
      does not block anything.

---

## 4. Email capture

- [ ] **[BLOCKING — decision, not necessarily code] Decide how you are capturing email.**
      There is currently **no signup form on the site**. A non-functional one was deliberately
      removed rather than shipping something that silently swallows addresses. The CSS hooks
      (`.signup-form`, `.form-note`) are still in `style.css`, unused.
      Read `EMAIL-CAPTURE.md` and pick one of the three options. The decision is blocking because
      launching without any capture means the people who finish day 30 — your most engaged
      readers — leave with no way to hear from you again, and you cannot get them back.
      Implementing it can be a single link; it does not have to be a form.

- [ ] **[FOLLOW-UP] Test the capture end to end once it is live.**
      Submit a real address yourself from a phone and confirm it arrives where you expect.

---

## 5. Analytics

- [ ] **[FOLLOW-UP] Add analytics — but choose one that does not break the constraints.**
      This is deliberately a follow-up, not blocking. You can publish without it; you just will
      not know what happened on day one.
      The hard constraint: the site currently makes **zero external requests**, and a standard
      analytics snippet breaks that. Before adding anything, decide which you care about more.
      Realistic options, cheapest first:
  - **GitHub Pages gives you nothing** — there are no server logs available to you. Accept that.
  - **A privacy-light hosted analytics service** (Plausible, Fathom, GoatCounter and similar).
    One small script, no cookies, no consent banner needed in most readings. Costs money, or is
    free for GoatCounter's non-commercial tier. This does add one external request — load it
    with `defer` so it never delays the lesson text.
  - **Count nothing on-site, count the entry points instead.** Use a link shortener or UTM
    parameters on the links you post to Facebook and LinkedIn, and read the click counts there.
    Keeps the zero-external-request promise completely intact.
      If you add a script, re-run the "no external requests" check above and knowingly record
      that it is now one request, not zero.

---

## 6. Publish

- [ ] **[BLOCKING] Confirm the correct GitHub account is active.**
      This is the **personal** account `Shasan7774`, not the work account.
      ```
      gh auth status          # confirm "Active account: true" against Shasan7774
      gh auth switch -u Shasan7774
      ```

- [ ] **[BLOCKING] Initialise the repo and pin the personal identity locally.**
      There is no global git identity on this machine by design. Pin it per-repo:
      ```
      git init && git branch -M main
      git config --local credential.https://github.com.username Shasan7774
      git config --local user.name  "Hasan Shahriar Fahim"
      git config --local user.email "26799315+Shasan7774@users.noreply.github.com"
      ```

- [ ] **[BLOCKING] Decide the licence before the repo is public.**
      `README.md` currently says "not yet decided". A public repo with no licence means nobody
      may legally reuse the lessons — which may or may not be what you want. Decide
      deliberately.

- [ ] **[BLOCKING] Commit and push, then enable Pages.**
      ```
      git add . && git commit -m "Initial commit: 30-day Bangla AI course"
      gh repo create ai-bondhu --public --source=. --remote=origin --push
      ```
      Then **Settings → Pages → Deploy from a branch → `main` / `/site`**.
      Confirm `docs/.nojekyll` is present in the pushed tree.

- [ ] **[BLOCKING] Smoke-test the live site before telling anyone.**
      On a phone, on mobile data, not on your laptop:
  - landing page loads
  - day 1 loads, the prompt copies, the day marks complete
  - day 30 loads and the links around it work
  - a bad URL shows the 404 page
      Only after this passes do you move to section 7.

---

## 7. Phase 0 — distribution

Do not start this until everything blocking above is ticked. A link shared once into a group
that then fails to load does not get shared again.

- [ ] **[FOLLOW-UP] Write the Bangla share post first, before posting anywhere.**
      Two or three sentences in the same voice as the course. Say what it is, who it is for, that
      it is free, and that it takes 10 minutes a day. No hype, no "revolutionary". Keep one
      version short enough for a comment and one long enough for a standalone post.

- [ ] **[FOLLOW-UP] Post into Bangladeshi Facebook groups — a few at a time, not all at once.**
  - Read each group's rules first; several ban links outright and will remove the post and you.
  - Start with three or four groups in the first week, not twenty. Posting the same link
    everywhere the same hour is the fastest route to being flagged as spam.
  - Prefer groups about learning, students, teachers, freelancing and technology for beginners
    over general chat groups.
  - Post as yourself with a short personal note about why you built it. A bare link reads as an
    advert.
  - **Stay in the comments for the first few hours.** Answering questions is what converts a
    post into shares.
  - Keep a short note of which group you posted to and when, so you do not repeat yourself and
    can see which ones actually sent people.

- [ ] **[FOLLOW-UP] Post on LinkedIn.**
      Different audience, different angle: here it is the professional story — a software
      engineer teaching AI to non-technical people in their own language, and why that matters.
      Write it in English or in both. Link to the landing page, not to a lesson.

- [ ] **[FOLLOW-UP] Ask ten people directly.**
      Message colleagues, friends and family individually and ask them to try day 1 and tell you
      honestly where they got stuck. Ten real responses will teach you more than a thousand
      anonymous visits.

- [ ] **[FOLLOW-UP] After a week, write down what you learned.**
      Which group sent people, where readers dropped off, what questions came up repeatedly. That
      note is the input to whatever you do next.
