/* এআই বন্ধু — shared interactivity (vanilla JS, progressive enhancement) */
(function () {
  "use strict";
  function get(k, f) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; }
  }
  function set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  var BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  function bn(num) {
    return String(num).replace(/\d/g, function (d) { return BN[+d]; });
  }

  function doneDays() {
    var d = get("aib_done", []);
    if (!d || typeof d.length !== "number") return [];
    var out = [];
    for (var i = 0; i < d.length; i++) {
      var n = parseInt(d[i], 10);
      if (n >= 1 && n <= 30 && out.indexOf(n) === -1) out.push(n);
    }
    return out;
  }

  /* font-size control */
  var fontStep = parseInt(get("aib_font", 0), 10);
  if (!(fontStep >= 0 && fontStep <= 2)) fontStep = 0;
  function applyFont(s) {
    document.documentElement.classList.remove("fs-1", "fs-2");
    if (s > 0) document.documentElement.classList.add("fs-" + s);
  }
  applyFont(fontStep);
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-font-dec]")) { fontStep = Math.max(0, fontStep - 1); applyFont(fontStep); set("aib_font", fontStep); }
    else if (e.target.closest("[data-font-inc]")) { fontStep = Math.min(2, fontStep + 1); applyFont(fontStep); set("aib_font", fontStep); }
  });

  /* step checkboxes */
  var steps = get("aib_steps", {});
  // Stored data can be damaged (null, a number, an array): fall back to empty so the
  // copy and "complete day" handlers below still get attached.
  if (!steps || typeof steps !== "object" || Array.isArray(steps)) steps = {};
  document.querySelectorAll("[data-step-id]").forEach(function (cb) {
    var id = cb.getAttribute("data-step-id");
    if (steps[id]) cb.checked = true;
    cb.addEventListener("change", function () { steps[id] = cb.checked; set("aib_steps", steps); });
  });

  /* copy buttons */
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      var ok = document.execCommand("copy"); document.body.removeChild(ta);
      return ok === true;
    } catch (e) { return false; }
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector(".copy-label");
    var orig = label ? label.textContent : btn.textContent;
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy"));
      var text = target ? target.textContent.replace(/\s+/g, " ").trim() : "";
      function done() {
        (label || btn).textContent = "কপি হয়েছে ✓";
        btn.classList.add("is-copied");
        setTimeout(function () { (label || btn).textContent = orig; btn.classList.remove("is-copied"); }, 2000);
      }
      function failed() {
        (label || btn).textContent = "কপি হয়নি";
        var box = btn.parentNode;
        if (box && !box.querySelector(".copy-note")) {
          var note = document.createElement("p");
          note.className = "copy-note";
          note.setAttribute("role", "status");
          note.textContent = "কপি করা গেল না — উপরের লেখাটা আঙুল দিয়ে নির্বাচন করে কপি করুন।";
          box.appendChild(note);
        }
        setTimeout(function () { (label || btn).textContent = orig; }, 3000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { if (fallbackCopy(text)) done(); else failed(); });
      } else if (fallbackCopy(text)) done();
      else failed();
    });
  });

  /* মিলিয়ে নিন quiz */
  document.querySelectorAll(".quiz-q").forEach(function (quiz) {
    var opts = quiz.querySelectorAll("[data-opt]");
    var fb = quiz.querySelector(".quiz-feedback");
    opts.forEach(function (opt) {
      opt.addEventListener("click", function () {
        var ok = this.getAttribute("data-correct") === "true";
        opts.forEach(function (o) { o.classList.remove("is-right", "is-wrong"); });
        if (!fb) return;
        if (ok) {
          this.classList.add("is-right");
          fb.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-check"></use></svg><span><strong>ঠিক বলেছেন।</strong> ' + quiz.getAttribute("data-explain") + "</span>";
          fb.className = "quiz-feedback is-good";
          opts.forEach(function (o) { o.disabled = true; });
          fb.hidden = false;
          fb.setAttribute("tabindex", "-1");
          try { fb.focus(); } catch (err) {}
        } else {
          this.classList.add("is-wrong");
          fb.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-retry"></use></svg><span>চিন্তার কিছু নেই, তাড়াহুড়ো নেই — আরেকবার পড়ে দেখুন আর চেষ্টা করুন।</span>';
          fb.className = "quiz-feedback is-nudge";
        }
        fb.hidden = false;
      });
    });
  });

  var done = doneDays();

  /* completed-day marks: used by the homepage's full 30-day grid AND the
     day pages' "this week" sidebar list — both use [data-day-card]. Kept as
     a named function (not a one-shot forEach) so it can be re-run the
     instant a day is marked complete, instead of only on next page load. */
  function markDoneCards() {
    document.querySelectorAll("[data-day-card]").forEach(function (a) {
      var n = parseInt(a.getAttribute("data-day-card"), 10);
      if (done.indexOf(n) === -1 || a.classList.contains("is-done")) return;
      a.classList.add("is-done");
      var s = document.createElement("span");
      s.className = "sr-only";
      s.textContent = " — সম্পূর্ণ";
      a.appendChild(s);
    });
  }
  markDoneCards();

  /* দিন সম্পূর্ণ button */
  var completeBtn = document.querySelector("[data-day-complete]");
  if (completeBtn) {
    var day = parseInt(completeBtn.getAttribute("data-day-complete"), 10);
    var confirmBox = document.querySelector(".day-done-confirm");
    var showDone = function () { completeBtn.hidden = true; if (confirmBox) confirmBox.hidden = false; };
    if (done.indexOf(day) !== -1) showDone();
    completeBtn.addEventListener("click", function () {
      var d = get("aib_done", []);
      if (!d || typeof d.length !== "number") d = [];
      if (d.indexOf(day) === -1) d.push(day);
      if (!set("aib_done", d)) {
        var err = document.createElement("p");
        err.className = "save-error"; err.setAttribute("role", "alert");
        err.textContent = "এই ব্রাউজারে অগ্রগতি সেভ করা যাচ্ছে না (হয়তো প্রাইভেট মোড বা ফেসবুক/হোয়াটসঅ্যাপের ভেতরের ব্রাউজার)। Chrome-এ সাইটটা খুলে আবার চেষ্টা করুন।";
        completeBtn.insertAdjacentElement("afterend", err);
        return;
      }
      done = d;
      showDone();
      markDoneCards();
    });
    if (confirmBox) {
      var undo = document.createElement("button");
      undo.type = "button"; undo.className = "btn-undo";
      undo.textContent = "ভুল করে চাপ দিয়েছেন? ফিরিয়ে নিন";
      undo.addEventListener("click", function () {
        var d = get("aib_done", []);
        if (!d || typeof d.length !== "number") d = [];
        d = d.filter(function (n) { return n !== day; });
        set("aib_done", d); done = d;
        confirmBox.hidden = true; completeBtn.hidden = false; completeBtn.focus();
        document.querySelectorAll('[data-day-card="' + day + '"]').forEach(function (a) {
          a.classList.remove("is-done"); var sr = a.querySelector(".sr-only"); if (sr) sr.remove();
        });
      });
      confirmBox.appendChild(undo);
    }
  }

  /* homepage hero: returning learners continue where they stopped */
  var heroCta = document.querySelector(".hero-actions .cta-button");
  if (heroCta && done.length > 0 && done.length < 30) {
    for (var h = 1; h <= 30 && done.indexOf(h) !== -1; h++) {}
    heroCta.setAttribute("href", "din-" + h + ".html");
    heroCta.firstChild.textContent = "চালিয়ে যান — দিন " + bn(h) + " ";
  }

  /* share bar on lessons, profession and earning pages */
  if (/\/(din-\d+|pesha-[a-z]+|aay-\d+)\.html$/.test(location.pathname)) {
    var host = document.querySelector("main");
    if (host) {
      var url = location.href.split("#")[0];
      var msg = document.title + " — সহজ বাংলায় AI শিখুন, ফ্রি: " + url;
      var bar = document.createElement("aside");
      bar.className = "share-bar"; bar.setAttribute("aria-label", "শেয়ার করুন");
      bar.innerHTML = '<p>উপকারী লাগলে পরিচিতদের পাঠান:</p>';
      [["হোয়াটসঅ্যাপে পাঠান", "https://wa.me/?text=" + encodeURIComponent(msg)],
       ["ফেসবুকে শেয়ার করুন", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)]]
        .forEach(function (x) {
          var a = document.createElement("a");
          a.href = x[1]; a.textContent = x[0]; a.target = "_blank"; a.rel = "noopener";
          bar.appendChild(a);
        });
      host.appendChild(bar);
    }
  }

  /* progress backup / restore code (course page) */
  var progSec = document.getElementById("progress");
  if (progSec) {
    var mask = 0;
    done.forEach(function (n) { if (n >= 1 && n <= 30) mask |= (1 << (n - 1)); });
    var box = document.createElement("details");
    box.className = "backup-box";
    box.innerHTML = '<summary>নতুন ফোনে অগ্রগতি নিয়ে যান</summary>' +
      '<p>এই কোডটা লিখে রাখুন। নতুন ফোন বা ব্রাউজারে এখানে কোডটা দিলে আপনার সম্পূর্ণ করা দিনগুলো ফিরে আসবে।</p>' +
      '<p class="backup-code">আপনার কোড: <strong></strong></p>' +
      '<label for="backup-in">আগের কোড দিন:</label> <input id="backup-in" type="text" autocomplete="off" spellcheck="false"> ' +
      '<button type="button" class="btn-undo">ফিরিয়ে আনুন</button><p class="backup-msg" aria-live="polite"></p>';
    box.querySelector("strong").textContent = "AIB-" + mask.toString(36).toUpperCase();
    box.querySelector("button").addEventListener("click", function () {
      var v = box.querySelector("input").value.trim().toUpperCase().replace(/^AIB-?/, "");
      var m = /^[0-9A-Z]{1,6}$/.test(v) ? parseInt(v, 36) : NaN;
      var out = box.querySelector(".backup-msg");
      if (isNaN(m) || m < 0 || m >= (1 << 30)) { out.textContent = "কোডটা ঠিক মনে হচ্ছে না — আবার দেখে লিখুন।"; return; }
      var d = [];
      for (var i = 0; i < 30; i++) if (m & (1 << i)) d.push(i + 1);
      if (set("aib_done", d)) { out.textContent = "অগ্রগতি ফিরে এসেছে — " + bn(d.length) + " দিন। পাতাটা আবার লোড হচ্ছে…"; setTimeout(function () { location.reload(); }, 900); }
      else out.textContent = "এই ব্রাউজারে সেভ করা যাচ্ছে না। Chrome-এ খুলে চেষ্টা করুন।";
    });
    progSec.appendChild(box);
  }

  var fill = document.querySelector("[data-prog-fill]");
  if (fill) {
    var count = done.length;
    var pct = Math.round((count / 30) * 100);
    fill.style.width = pct + "%";

    var bar = document.querySelector("[data-prog-bar]");
    if (bar) bar.setAttribute("aria-label", "অগ্রগতি: ৩০ দিনের মধ্যে " + bn(count) + " দিন সম্পূর্ণ");

    document.querySelectorAll("[data-prog-done], [data-prog-done2]").forEach(function (el) {
      el.textContent = bn(count);
    });
    var leftEl = document.querySelector("[data-prog-left]");
    if (leftEl) leftEl.textContent = bn(30 - count);

    var next = 0;
    for (var k = 1; k <= 30; k++) { if (done.indexOf(k) === -1) { next = k; break; } }

    var cta = document.querySelector("[data-prog-cta]");
    var ctaLabel = document.querySelector("[data-prog-cta-label]");
    var sub = document.querySelector("[data-prog-sub]");
    if (next === 0) {
      if (cta) cta.setAttribute("href", "din-1.html");
      if (ctaLabel) ctaLabel.textContent = "আবার শুরু থেকে দেখুন";
      if (sub) sub.textContent = "৩০ দিনই সম্পূর্ণ হয়েছে। চাইলে যেকোনো দিন আবার দেখে নিতে পারেন।";
    } else if (count === 0) {
      if (cta) cta.setAttribute("href", "din-1.html");
      if (ctaLabel) ctaLabel.textContent = "দিন ১ থেকে শুরু করুন";
    } else {
      if (cta) cta.setAttribute("href", "din-" + next + ".html");
      if (ctaLabel) ctaLabel.textContent = "দিন " + bn(next) + " থেকে চালিয়ে যান";
      if (sub) sub.textContent = "চালিয়ে যান — পরের পাঠ দিন " + bn(next) + "।";
    }
  }
})();

/* ---------- top menu: close siblings, outside click, Escape ----------
   Progressive enhancement only. With JS off the <details> menus still
   open and close natively; this just stops two being open at once. */
(function () {
  var nav = document.querySelector('.main-nav');
  if (!nav) return;
  var items = Array.prototype.slice.call(nav.querySelectorAll('.nav-item'));
  if (!items.length) return;

  function closeAll(except) {
    items.forEach(function (d) { if (d !== except) d.open = false; });
  }

  items.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) closeAll(d); });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) || e.target.closest('.nav-item a')) closeAll(null);
  });
  items.forEach(function (d) {
    d.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !d.contains(e.relatedTarget)) d.open = false;
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = items.filter(function (d) { return d.open; });
    if (!open.length) return;
    closeAll(null);
    var s = open[0].querySelector('summary');
    if (s) s.focus();
  });
})();
