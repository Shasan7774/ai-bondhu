/* এআই বন্ধু — shared interactivity (vanilla JS, progressive enhancement) */
(function () {
  "use strict";
  function get(k, f) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; }
  }
  function set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  var BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  function bn(num) {
    return String(num).replace(/\d/g, function (d) { return BN[+d]; });
  }

  /* short title of each day — used for the sidebar trail labels */
  var DAYS = [
    "AI আসলে কী?", "AI কী পারে, আর কী পারে না", "AI ভুল করে — কীভাবে বুঝবেন",
    "ভালো প্রশ্ন করার নিয়ম", "AI কি আপনার তথ্য নিয়ে নেয়?", "AI ব্যবহার করা কি অসততা?",
    "প্রথম সপ্তাহের রিভিউ", "দৈনন্দিন কাজে AI", "লেখার কাজে AI", "ভাষার দেয়াল",
    "ছবি দিয়ে প্রশ্ন করা", "ভয়েসে কথা বলা", "কাগজপত্র বোঝা", "দ্বিতীয় সপ্তাহের রিভিউ",
    "নতুন কিছু শেখা", "অন্যকে শেখানো", "প্রথম প্রজেক্ট", "সৃজনশীল কাজ", "ছবি বানানো",
    "AI-এর উত্তর যাচাই করা", "তৃতীয় সপ্তাহের রিভিউ", "AI দিয়ে প্রতারণা",
    "ডিপফেক ও ভুয়া ছবি-ভিডিও", "চারপাশের মানুষের নিরাপত্তা", "কাজের জায়গায় AI",
    "ভবিষ্যতের দক্ষতা", "AI-এর সীমা ও নৈতিকতা", "নিজের একটা অভ্যাস তৈরি",
    "চতুর্থ সপ্তাহের রিভিউ", "আপনি এখন কী পারেন"
  ];

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
  var fontStep = get("aib_font", 0);
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
      document.execCommand("copy"); document.body.removeChild(ta);
      return true;
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

  /* ৩০ দিনের progress trail */
  var done = doneDays();
  var tracks = document.querySelectorAll(".trail-track");
  if (tracks.length) {
    var curDay = parseInt(document.body.getAttribute("data-day") || "0", 10);
    var html = "";
    for (var n = 1; n <= 30; n++) {
      var isDone = done.indexOf(n) !== -1;
      var cls = "trail-dot" + (isDone ? " is-complete" : "") + (n === curDay ? " is-current" : "");
      var label = "দিন " + bn(n) + ": " + DAYS[n - 1] + (isDone ? " — সম্পূর্ণ" : "");
      html += '<a href="din-' + n + '.html" class="' + cls + '" aria-label="' + label + '"'
        + (n === curDay ? ' aria-current="page"' : "")
        + '><span class="td-n">' + bn(n) + '</span><span class="td-t">' + DAYS[n - 1] + "</span></a>";
    }
    tracks.forEach(function (t) { t.innerHTML = html; });
  }

  /* sidebar progress line on day pages */
  document.querySelectorAll("[data-trail-count]").forEach(function (el) {
    el.textContent = "৩০ দিনের মধ্যে " + bn(done.length) + " দিন সম্পূর্ণ";
  });

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
      if (d.indexOf(day) === -1) { d.push(day); set("aib_done", d); }
      showDone();
    });
  }

  /* ---------- homepage: completed day cards + progress dashboard ---------- */
  document.querySelectorAll("[data-day-card]").forEach(function (a) {
    var n = parseInt(a.getAttribute("data-day-card"), 10);
    if (done.indexOf(n) === -1) return;
    a.classList.add("is-done");
    var s = document.createElement("span");
    s.className = "sr-only";
    s.textContent = " — সম্পূর্ণ";
    a.appendChild(s);
  });

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
