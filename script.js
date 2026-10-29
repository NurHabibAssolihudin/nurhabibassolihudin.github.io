/* ============================================================
   NUR — one builder, two worlds
   Vanilla, static, no build step. One core, one iris.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var IS_ID = root.lang === "id";
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); };

  /* ---------------- theme ---------------- */
  var THEME_COLORS = { builder: { light: "#0b0c0f", dark: "#0b0c0f" }, creator: { light: "#0b0c0f", dark: "#0b0c0f" } };
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

  /* Compact thumbnails retain access to the original image through a native dialog. */
  if (typeof HTMLDialogElement !== "undefined" && HTMLDialogElement.prototype.showModal) {
    var preview = document.createElement("dialog");
    preview.className = "preview-dialog";
    preview.setAttribute("aria-labelledby", "preview-title");
    preview.innerHTML = '<div class="preview-dialog__bar"><p class="preview-dialog__title" id="preview-title"></p><button type="button" class="preview-dialog__close" autofocus aria-label="' + (IS_ID ? 'Tutup gambar' : 'Close image') + '">×</button></div><img alt="" />';
    document.body.appendChild(preview);
    $("button", preview).addEventListener("click", function () { preview.close(); });
    preview.addEventListener("click", function (event) {
      if (event.target !== preview) return;
      var bounds = preview.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) preview.close();
    });
    preview.addEventListener("close", function () { root.classList.remove("is-previewing"); });
    $$(".panel__media > img").forEach(function (image) {
      var title = $(".panel__title", image.closest(".panel")).textContent;
      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "project-preview";
      trigger.setAttribute("aria-label", (IS_ID ? "Perbesar gambar " : "Enlarge image of ") + title);
      trigger.setAttribute("aria-haspopup", "dialog");
      image.replaceWith(trigger);
      trigger.appendChild(image);
      var label = document.createElement("span");
      label.className = "project-preview__label";
      label.textContent = IS_ID ? "Perbesar" : "View image";
      trigger.appendChild(label);
      trigger.addEventListener("click", function () {
        var enlarged = $("img", preview);
        enlarged.src = image.currentSrc || image.src;
        enlarged.alt = image.alt;
        $(".preview-dialog__title", preview).textContent = title;
        preview.showModal();
        root.classList.add("is-previewing");
      });
    });
  }

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
    menuBtn.setAttribute("aria-label", IS_ID ? "Buka menu" : "Open menu");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      if (open) { closeMenu(); return; }
      menu.hidden = false;
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", IS_ID ? "Tutup menu" : "Close menu");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ============================================================
     WORLD ENGINE — the split between worlds
     ============================================================ */
  var worlds = { builder: $('.world[data-world="builder"]'), creator: $('.world[data-world="creator"]') };
  var rift = $("#rift");
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
    worlds.builder.inert = name !== "builder";
    worlds.creator.inert = name !== "creator";
    $(".brand").setAttribute("href", name === "creator" ? "#ctop" : "#top");
    syncThemeColor();
  }

  /* The entire world changes together: brand, navigation, content and material. */
  function applySwap(name, focusHeading) {
    var next = name;
    if (next === current) return;
    setWorld(next);
    window.scrollTo(0, 0);
    saveState.scroll = 0;
    closeMenu();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search + (name === "creator" ? "#ctop" : "#top"));
    if (focusHeading) {
      var heading = $(".hero__h1", worlds[name]);
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    armReveals(true);
    if (window.NurField) window.NurField.sync();
  }

  async function runRift(name, origin) {
    if(window.NurTransit)return window.NurTransit.run({root:root,rift:rift,worlds:worlds,name:name,origin:origin,swap:applySwap,closeMenu:closeMenu});
    applySwap(name, origin && origin.matches(":focus-visible"));
  }

  $$("[data-cross]").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      if (busy) return;
      busy = true;
      var next = current === "builder" ? "creator" : "builder";
      try { await runRift(next, btn); }
      finally { busy = false; }
    });
  });


  /* restore the last world after a refresh */
  try {
    var st = JSON.parse(sessionStorage.getItem(STATE_KEY));
    if (st && st.world && worlds[st.world]) setWorld(st.world);
  } catch (err) {}

  // Direct links select the world that owns the requested section.
  try {
    var anchor = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var anchorWorld = anchor && anchor.closest(".world");
    if (anchorWorld) current = anchorWorld.getAttribute("data-world");
  } catch (err) {}
  setWorld(current);

  /* ============================================================
     MOTION — section entrances, staggered, once
     ============================================================ */
  var REVEAL_SELECTOR = [
    ".hero__h1", ".hero__lead", ".hero__actions", ".hero__core",
    ".band__cap", ".about__statement", ".about__body p",
    ".platforms__lead > p", ".build", ".work__lead",
    ".panel__media", ".panel__text", ".more__h", ".more__list li",
    ".stack__grid > div", ".table", ".card"
  ].join(",");

  var revealObserver;
  function armReveals(rearm) {
    if(revealObserver)revealObserver.disconnect();
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
    var io = revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px", threshold: 0.08 });
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
