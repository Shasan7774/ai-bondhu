# Email capture — options and recommendation

## Where things stand

The site has **no signup form**. There was one; it was removed deliberately.

The form had no backend behind it. A reader would have typed their address, pressed the button,
and nothing would have happened — the address would have gone nowhere while the page implied it
had been received. Shipping that is worse than shipping nothing: it costs you the addresses
anyway, and it quietly misleads the one group of readers who trusted you enough to volunteer
something.

So the form is gone and the decision is still open. The CSS hooks (`.signup-form`,
`.form-note` in `site/style.css`) are still there, unused, if a real form is ever added.

The constraint that shapes every option below: **there is no backend and no server.** GitHub
Pages serves static files. It cannot receive a form submission, cannot store anything, cannot
send you an email. Any capture has to be hosted by someone else.

---

## Option 1 — A link to a Google Form

A plain link at the end of day 30 that opens a Google Form in a new tab. One question: email
address. Responses collect into a Google Sheet you already own.

**Effort:** 15 minutes, once. No code beyond an `<a href>`.

**Cost:** Free.

**Why it fits here:**

- Zero infrastructure, nothing to maintain, nothing that can silently break.
- Works on any phone, on a weak connection, and inside the Facebook in-app browser.
- It is a link, not a form, so the page itself stays static and keeps making **zero external
  requests**. Google only loads if the reader chooses to tap.
- Google Forms is already familiar to most Bangladeshi readers from work and university. That
  familiarity lowers hesitation rather than raising it.
- You can see responses immediately in a Sheet, and export to CSV whenever you want to move.

**Downsides, honestly:**

- It takes the reader off your site to a Google page. A share of people will not come back,
  and some will not tap at all.
- It looks less polished than an inline form. For this audience that matters less than it would
  for a product landing page, but it is a real cost.
- A Google Form cannot send a welcome email. There is no automatic acknowledgement.

**Privacy implication:** the addresses live in Google's systems under your personal Google
account, governed by Google's terms. You are the data controller. You must say in plain Bangla
what you will use the address for, and you should not use it for anything else. Readers see a
Google domain, which most will trust; some will reasonably object to Google specifically.

---

## Option 2 — A hosted form service

An inline `<form>` on your page that posts to a third-party endpoint — Formspree, Buttondown,
MailerLite, Tally, Netlify Forms and similar all do this. The reader never leaves the site.

**Effort:** an hour or two, including testing the failure path.

**Cost:** free tiers exist for all of them, with limits on submissions per month. Paid plans
start at a few dollars a month. If you want to actually *send* an email newsletter later, an
email-first service (Buttondown, MailerLite) is the one to pick, because it is a list and a
sender in one.

**Why you might want it:**

- Best conversion of the three. No tab switch, no context loss.
- A real list you can send to, with unsubscribe handling built in, which matters legally and
  practically the moment you send your first message.
- You can style it to match the site using the CSS hooks that are already there.

**Downsides, honestly:**

- It breaks the zero-external-request promise for whichever page carries it. Mitigate by putting
  it only on day 30, so 30 of the 31 pages stay clean.
- A form that posts to a third party **can** fail silently — a blocked request, an ad blocker, a
  dead free tier. You must handle and show the error state, and you must test it on a real phone
  before trusting it. This is the exact failure mode the original form was removed for.
- Free tiers get discontinued. One more thing that can break while you are not looking.

**Privacy implication:** addresses sit with a third-party processor, often outside Bangladesh.
You need to name them, or at least say that a third-party service handles signups, and link
their privacy terms. More to explain to the reader than Option 1.

---

## Option 3 — A small serverless endpoint

Write a tiny function (Cloudflare Workers, Vercel, Netlify Functions, Google Apps Script) that
accepts a POST and appends the address to a store you control.

**Effort:** half a day to build, plus ongoing attention.

**Cost:** free at this volume on every platform listed.

**Why you might want it:** total control, your own data, no third party in the chain, and the
freedom to do anything you like later.

**Downsides, honestly:**

- Most work, least benefit at this stage. You would be building list infrastructure before you
  have a list.
- It is a thing that can go down, get spammed, or quietly stop working after a platform change —
  and you are the only person who would notice.
- You still cannot send bulk email from it. You would need a sending service anyway, so you have
  not avoided the third party, only postponed it.
- Needs spam protection (a honeypot field at minimum) the moment it is public.

**Privacy implication:** best of the three — the data is yours, stored where you chose. But the
responsibility is also entirely yours: securing the endpoint, not leaking the store, and
deleting addresses when someone asks.

---

## Recommendation

**Start with Option 1 — the Google Form link. Move to Option 2 the day you actually have
something to send.**

The reasoning:

1. **You do not have a newsletter yet.** Until you are ready to write and send something
   regularly, the only job a capture has is to not lose the people who finish. A Google Form
   does that job completely, at zero cost and zero risk.
2. **It cannot fail silently.** That was the whole reason the old form came out. A link either
   opens Google or it does not, visibly. There is no hidden failure path.
3. **It is reversible.** Export the Sheet to CSV and import it into a real email service the
   moment you need one. You lose nothing by starting here.
4. **Your evenings are the scarce resource.** Option 3 costs a weekend you could spend on the
   lessons themselves, and buys nothing a reader would notice.

The trigger for moving to Option 2: you have decided what you will send, and when. Not before.

Whichever you pick, say in one line, in Bangla, beside the capture: what you will send, roughly
how often, and that the address will not be shared with anyone. Then hold to it.

---

## Where it goes on the site

**Primary placement: the end of day 30**, after the completion button and inside or just below
the existing `.teaser-box` that currently says "এরপর কী?".

Why there:

- The reader has just finished thirty days. That is the single highest-intent moment the site
  has, and the only point at which you have unambiguously earned the ask.
- It is also the only genuine dead end in the whole site — day 30 has no "next day". Right now
  a reader who finishes has nowhere to go. A capture turns that dead end into a continuation.
- The ask makes sense in context: *you have finished; here is how to hear about what comes next.*

**Optional secondary placement: the landing page**, low down — after the FAQ and near the
`.trust` block, never above the "আজকের পাঠ শুরু করুন" button.

Why that spot and not higher: the landing page's one job is to get people into day 1. Anything
placed above the CTA competes with it. Below the FAQ, the only people who reach it are those
already reading carefully, and for them a small "আগ্রহী কিন্তু এখন শুরু করতে পারছেন না?" line is
useful rather than intrusive. If in doubt, skip the landing page entirely and keep day 30 only.

**Why not mid-course:**

- It interrupts the one thing the course is built around — a short, complete, 10-minute daily
  habit. Anything that is not the lesson competes with finishing the lesson.
- A reader on day 7 has no idea yet whether this is worth their address. Asking early gets a
  lower response *and* costs you the trust needed to ask well later.
- It would have to be repeated across pages to be seen, and a repeated ask on every day page
  reads as nagging — exactly the tone the course avoids.
- Practically: an inline form on a mid-course page adds an external request to a page a reader
  opens on 2G, for a conversion that will be poor anyway.

One ask, at the end, where it is earned.
