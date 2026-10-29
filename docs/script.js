/* এআই বন্ধু — shared interactivity (vanilla JS, progressive enhancement) */
(function () {
  "use strict";
  function get(k, f) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; }
  }
  function set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
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
  var tracks = document.querySelectorAll(".trail-track");
  if (tracks.length) {
    var done = get("aib_done", []);
    var curDay = parseInt(document.body.getAttribute("data-day") || "0", 10);
    var html = "";
    for (var n = 1; n <= 30; n++) {
      var live = n <= 30;
      var cls = "trail-dot" + (done.indexOf(n) !== -1 ? " is-complete" : "") + (n === curDay ? " is-current" : "") + (live ? "" : " is-locked");
      html += live
        ? '<a href="din-' + n + '.html" class="' + cls + '" aria-label="দিন ' + n + '">' + n + "</a>"
        : '<span class="' + cls + '" aria-label="দিন ' + n + ' (শীঘ্রই আসছে)">' + n + "</span>";
    }
    tracks.forEach(function (t) { t.innerHTML = html; });
  }

  /* দিন সম্পূর্ণ button */
  var completeBtn = document.querySelector("[data-day-complete]");
  if (completeBtn) {
    var day = parseInt(completeBtn.getAttribute("data-day-complete"), 10);
    var confirmBox = document.querySelector(".day-done-confirm");
    function showDone() { completeBtn.hidden = true; if (confirmBox) confirmBox.hidden = false; }
    if (get("aib_done", []).indexOf(day) !== -1) showDone();
    completeBtn.addEventListener("click", function () {
      var d = get("aib_done", []);
      if (d.indexOf(day) === -1) { d.push(day); set("aib_done", d); }
      showDone();
    });
  }
})();
