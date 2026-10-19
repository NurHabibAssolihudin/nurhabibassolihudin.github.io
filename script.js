/* ============================================================
   NUR — one builder, two worlds
   Vanilla, static, no build step. One core, one iris.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); };

  /* ---------------- theme ---------------- */
  var THEME_COLORS = { builder: { light: "#e9e8e4", dark: "#0f0e0d" }, creator: { light: "#e7e9e5", dark: "#0c100e" } };
  function syncThemeColor() {
    var meta = $('meta[name="theme-color"]');
    if (!meta) return;
    var w = root.getAttribute("data-world") || "builder";
    var t = root.getAttribute("data-theme") || "light";
    meta.setAttribute("content", THEME_COLORS[w][t]);
  }
  syncThemeColor();

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-theme-toggle]") : null;
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (err) {}
    syncThemeColor();
  });

  /* ---------------- year ---------------- */
  $$(".year").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------------- scroll state on the bar ---------------- */
  var bar = $("#bar");
  function onScroll() { if (bar) bar.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  var menu = $("#menu");
  var menuBtn = $("[data-menu]");
  function closeMenu() {
    if (!menu || !menuBtn) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      if (open) { closeMenu(); return; }
      menu.hidden = false;
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ============================================================
     WORLD ENGINE — the iris
     ============================================================ */
  var worlds = { builder: $('.world[data-world="builder"]'), creator: $('.world[data-world="creator"]') };
  var iris = $("#iris");
  var irisFill = $(".iris__fill");
  var irisRing = $(".iris__ring");
  var current = root.getAttribute("data-world") === "creator" ? "creator" : "builder";
  var busy = false;
  var STATE_KEY = "nur-world-state";

  function saveState() {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify({ world: current, scroll: saveState.scroll || 0 })); } catch (err) {}
  }
  window.addEventListener("pagehide", saveState);

  function setWorld(name) {
    current = name;
    root.setAttribute("data-world", name);
    worlds.builder.classList.toggle("is-live", name === "builder");
    worlds.creator.classList.toggle("is-live", name === "creator");
    syncThemeColor();
  }

  /* the iris: a circle that grows out of the core, then closes behind you */
  function applySwap(name) {
    var next = name;
    if (next === current) return;
    setWorld(next);
    window.scrollTo(0, 0);
    saveState.scroll = 0;
    if (window.matchMedia("(min-width: 880px)").matches) closeMenu();
    armReveals(true);
  }

  function runIris(name, origin) {
    if (!iris || !irisFill || !irisRing || REDUCE) { applySwap(name); return; }
    var r = origin.getBoundingClientRect();
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var R = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 48;
    var d = R * 2;

    iris.setAttribute("data-to", name);
    [irisFill, irisRing].forEach(function (el) {
      el.style.width = d + "px";
      el.style.height = d + "px";
      el.style.left = (x - R) + "px";
      el.style.top = (y - R) + "px";
    });

    iris.classList.remove("is-close", "is-open");
    iris.classList.add("is-on");
    void iris.offsetWidth;               // flush layout so the transition runs
    iris.classList.add("is-open");

    window.setTimeout(function () { applySwap(name); }, 500);
    window.setTimeout(function () {
      iris.classList.remove("is-open");
      iris.classList.add("is-close");
    }, 560);
    window.setTimeout(function () {
      iris.classList.remove("is-on", "is-close");
      irisFill.removeAttribute("style");
      irisRing.removeAttribute("style");
    }, 1040);
  }

  $$("[data-cross]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (busy) return;
      busy = true;
      var next = current === "builder" ? "creator" : "builder";
      runIris(next, btn);
      window.setTimeout(function () { busy = false; }, REDUCE ? 120 : 1150);
    });
  });

  /* restore the last world after a refresh */
  try {
    var st = JSON.parse(sessionStorage.getItem(STATE_KEY));
    if (st && st.world && worlds[st.world]) setWorld(st.world);
  } catch (err) {}

  /* ============================================================
     MOTION — section entrances, staggered, once
     ============================================================ */
  var REVEAL_SELECTOR = [
    ".hero__h1", ".hero__lead", ".hero__actions", ".hero__core",
    ".band__cap", ".about__statement", ".about__body p",
    ".platforms__lead", ".build", ".work__h", ".work__lead",
    ".panel__media", ".panel__text", ".more__h", ".more__list li",
    ".stack__grid > div", ".table", ".card"
  ].join(",");

  function armReveals(rearm) {
    var list = $$(REVEAL_SELECTOR);
    list.forEach(function (el, i) {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal");
        el.style.setProperty("--i", String(Math.min(i % 4, 3)));
      }
      if (rearm) el.classList.remove("in");
    });
    if (REDUCE || !("IntersectionObserver" in window)) {
      list.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    list.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }

  armReveals(false);

  /* anchors inside the active world: close the menu, keep focus sane */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href");
    if (!id || id === "#") return;
    var target = document.querySelector(id);
    if (!target) { e.preventDefault(); return; }
    closeMenu();
  });
})();
