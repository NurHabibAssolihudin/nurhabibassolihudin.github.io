/* ============================================================
   OVERTAKEN-LIFE — two worlds, one core
   ============================================================ */

/* ============ Theme ============ */
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", saved || (prefersLight ? "light" : "dark"));
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* ============ Flags ============ */
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const GSAP_OK = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
let lenis = null;

/* ============ Year ============ */
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ============ Helpers ============ */
const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
const lockScroll = () => { document.documentElement.classList.add("is-locked"); if (lenis) lenis.stop(); };
const unlockScroll = () => { document.documentElement.classList.remove("is-locked"); if (lenis) lenis.start(); };

/* ============================================================
   DATA — World A (builder)
   ============================================================ */
const projectsA = [
  { id: "OC", name: "Ocaty", tag: "platform / e-commerce", url: null,
    problem: "Design a product surface that multiple teams can ship to independently.",
    built: "Module Federation micro-frontends, a design system shipped as a package, and FastAPI services (account, notification) on PostgreSQL.",
    stack: ["TypeScript", "React", "Module Federation", "FastAPI", "PostgreSQL"] },
  { id: "AI.1", name: "Tony", tag: "ai / self-hosted assistant", url: "https://github.com/NurHabibAssolihudin/Tony",
    problem: "Build an AI assistant I can run myself, that remembers and can act.",
    built: "A stateful agent with memory (Letta) + a custom React UI + an automation layer, composed as one monorepo.",
    stack: ["Letta", "React", "Activepieces", "TypeScript"] },
  { id: "AI.2", name: "Oxelot", tag: "web / low-level library", url: "https://github.com/NurHabibAssolihudin/Oxelot",
    problem: "Give PWAs native-level storage, background processing, and hardware access over the open web.",
    built: "A spec-driven library @oxelot/core + @oxelot/react with WASM SQLite VFS, OPFS storage, a worker pool, and offline sync.",
    stack: ["TypeScript", "WASM", "Workers", "OPFS"] },
  { id: "AI.3", name: "GenUI", tag: "ai / configurable dashboard", url: "https://github.com/NurHabibAssolihudin/GenUI",
    problem: "Let an AI reshape a dashboard's layout from plain language.",
    built: "FastAPI + server-rendered Jinja2, where the AI emits JSON describing UI components rendered from a small library.",
    stack: ["Python", "FastAPI", "Jinja2", "LLM"] },
  { id: "BT", name: "Backtrade CLI", tag: "trading / backtesting", url: "https://github.com/NurHabibAssolihudin/ZeroGrowth_Backtrade",
    problem: "Test crypto strategies before risking real capital.",
    built: "A Python CLI with a menu-driven UI (rich + questionary): data collection & formatting, a backtest engine, and pluggable strategies (buy-and-hold, MA crossover, random).",
    stack: ["Python", "Rich", "Questionary"] },
  { id: "SY", name: "RabbitMQ-Chat-App", tag: "systems / realtime", url: "https://github.com/NurHabibAssolihudin/RabbitMQ-Chat-App",
    problem: "Feel how message brokers coordinate realtime services.",
    built: "A FastAPI chat over RabbitMQ quorum queues with a WebSocket broadcast hub — pub/sub & durability in practice.",
    stack: ["Python", "FastAPI", "RabbitMQ", "WebSocket"] },
];

const stackA = [
  { domain: "Languages", items: ["Python", "TypeScript", "JavaScript"] },
  { domain: "Backend & AI", items: ["FastAPI", "Jinja2", "Letta", "LLM Agents", "WASM"] },
  { domain: "Frontend & Platforms", items: ["React", "Next.js", "Vite", "Module Federation", "Design Systems"] },
  { domain: "Data & Infra", items: ["PostgreSQL", "Redis", "RabbitMQ", "Docker", "WebSocket"] },
  { domain: "Tooling", items: ["Bun", "uv", "pnpm", "Git"] },
];

const philosophyA = [
  { t: "Ship, then understand deeper", d: "Plans are great, but shipping is where you learn what the system actually demands. Build real things, then dig into why they work." },
  { t: "Productize AI, don't wrap it", d: "The value isn't a prompt box — it's turning models into products with real memory, real actions, and real interfaces." },
  { t: "Prefer internals over abstractions", d: "Abstractions are easier to learn, internals are easier to debug. I want both, in that order." },
  { t: "Make it observable before fast", d: "If you can't see what a system is doing, you can't make it reliable — let alone fast. Observability is the first optimization." },
];

/* ============================================================
   DATA — World B (creator)
   ============================================================ */
const worldsB = [
  { id: "STUDIO", name: "alimagine", tag: "the studio", url: "https://alimaginegames.com",
    problem: "Bring imagination to life, one world at a time.",
    built: "The studio I build with — games and interactive stories shaped by combining visual, audio, and story into a moment you feel.",
    stack: ["Godot", "GDScript", "Story"] },
  { id: "GOING-HOME", name: "Going Home", tag: "godot / narrative", url: "https://github.com/alimagine/Going-Home",
    problem: "A quiet, bittersweet walk back.",
    built: "A Godot game tethered to that feeling — grown in GDScript, one scene at a time.",
    stack: ["Godot", "GDScript"] },
  { id: "EREBUS", name: "0-Day Project Erebus", tag: "project / experiment", url: "https://github.com/alimagine/0-Day-Project-EREBUS",
    problem: "A world with a name and a mystery.",
    built: "A game project codenamed Erebus, and the site that documents its 0-day.",
    stack: ["Story", "Web"] },
  { id: "STORIES", name: "Interactive stories", tag: "narrative / trilogy", url: "https://alimaginegames.com",
    problem: "Tell stories where the world reacts to you.",
    built: "From a platformer to a world-building political thriller trilogy — narratives that grow as questions do.",
    stack: ["Godot", "Narrative", "World-building"] },
];

const toolsB = [
  { domain: "Engine", items: ["Godot", "GDScript"] },
  { domain: "Story craft", items: ["Visual", "Audio", "Narrative", "World-building"] },
  { domain: "Experiments", items: ["pyxel", "Interactive fiction"] },
  { domain: "Studio", items: ["alimagine", "alimaginegames.com"] },
];

const craftB = [
  { t: "Moment before mechanics", d: "Build the feeling first, then the systems that hold it up. A mechanic without a feeling is just a rule." },
  { t: "Worlds are systems too", d: "Characters, rules, and consequences — narrative runs on cause & effect. The best worlds are the ones that answer back." },
  { t: "Story under the surface", d: "What you see is the tip of the world built underneath. The rest lives in notes, failures, and the quiet details." },
  { t: "Ship small worlds often", d: "Every project is a moon. The studio is the orbit they share." },
];

/* ============================================================
   RENDER
   ============================================================ */
document.getElementById("a-work-list").innerHTML = projectsA.map(p => `
  <article class="work">
    <div>
      <div class="work-id">[${esc(p.id)}]</div>
      <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.name)} ↗</a>` : esc(p.name)}</h3>
      <div class="chip" style="margin-top:.6rem">${esc(p.tag)}</div>
    </div>
    <div>
      <div class="wrow"><span class="wlabel">Problem</span><p>${esc(p.problem)}</p></div>
      <div class="wrow"><span class="wlabel">What I built</span><p>${esc(p.built)}</p></div>
    </div>
    <div><div class="wtags">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
  </article>
`).join("");

document.getElementById("a-stack-grid").innerHTML = stackA.map(s => `
  <div class="stack-card">
    <span class="sdomain">${esc(s.domain)}</span>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>
`).join("");

document.getElementById("a-phil-list").innerHTML = philosophyA.map(p => `
  <div class="phil-item">
    <span class="mark" aria-hidden="true"></span>
    <div>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>
  </div>
`).join("");

document.getElementById("b-worlds-list").innerHTML = worldsB.map(p => `
  <article class="work">
    <div>
      <div class="work-id">[${esc(p.id)}]</div>
      <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.name)} ↗</a>` : esc(p.name)}</h3>
      <div class="chip" style="margin-top:.6rem">${esc(p.tag)}</div>
    </div>
    <div>
      <div class="wrow"><span class="wlabel">Why</span><p>${esc(p.problem)}</p></div>
      <div class="wrow"><span class="wlabel">What it is</span><p>${esc(p.built)}</p></div>
    </div>
    <div><div class="wtags">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
  </article>
`).join("");

document.getElementById("b-tools-grid").innerHTML = toolsB.map(s => `
  <div class="stack-card">
    <span class="sdomain">${esc(s.domain)}</span>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>
`).join("");

document.getElementById("b-craft-list").innerHTML = craftB.map(p => `
  <div class="phil-item">
    <span class="mark" aria-hidden="true"></span>
    <div>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>
  </div>
`).join("");

/* ============================================================
   WORLD ENGINE
   ============================================================ */
const worlds = { builder: document.getElementById("world-builder"), creator: document.getElementById("world-creator") };
let currentWorld = "builder";
const scrollPos = { builder: 0, creator: 0 };
const motion = { builder: null, creator: null };
const introDone = { builder: false, creator: false };

/* Persist current world + scroll across refresh (sessionStorage) */
const STATE_KEY = "overtaken-life-state";
function saveState() {
  scrollPos[currentWorld] = window.scrollY;
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify({ world: currentWorld, scroll: scrollPos })); } catch (_) {}
}
function loadState() {
  try { return JSON.parse(sessionStorage.getItem(STATE_KEY)) || null; } catch (_) { return null; }
}
window.addEventListener("scroll", () => { scrollPos[currentWorld] = window.scrollY; }, { passive: true });
window.addEventListener("pagehide", saveState);

function initMotion(name, el, introDelay = 0) {
  if (REDUCE || !GSAP_OK) return () => {};
  const sts = [];
  const tweens = [];
  const hero = $(".hero", el);
  const visual = $("#a-orbit, #b-glyph", el);
  const visualWrap = $(".orbit-wrap, .world-glyph-wrap", el);

  if (!introDone[name]) {
    if (hero) {
      const introTargets = [$(".eyebrow", hero), $("h1", hero), $(".lead", hero), $(".cta-row", hero)].filter(Boolean);
      if (introTargets.length) tweens.push(gsap.from(introTargets, { y: 26, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: introDelay }));
    }
    if (visual) {
      const visTargets = [visual, el.querySelector(".core")].filter(Boolean);
      tweens.push(gsap.from(visTargets, { scale: 0.92, opacity: 0, duration: 1.1, ease: "power3.out", delay: introDelay + 0.25 }));
    }
    introDone[name] = true;
  }

  el.querySelectorAll(".section-head, .reveal, .work, .stack-card, .phil-item, .node-card").forEach((item) => {
    gsap.set(item, { y: 24, opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: item, start: "top 90%", once: true,
      onEnter: () => tweens.push(gsap.to(item, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })),
    });
    sts.push(st);
  });

  if (hero && visualWrap) {
    sts.push(ScrollTrigger.create({
      trigger: hero, start: "top top", end: "bottom top", scrub: true,
      onUpdate: (self) => gsap.set(visualWrap, { y: -10 * self.progress }),
    }));
  }

  const nav = $(".nav", el);
  if (nav) sts.push(ScrollTrigger.create({ start: 24, onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 24) }));

  return () => {
    tweens.forEach((t) => { try { t.kill(); } catch (_) {} });
    sts.forEach((s) => { try { s.kill(); } catch (_) {} });
    if (el) el.querySelectorAll(".section-head, .reveal, .work, .stack-card, .phil-item, .node-card, .eyebrow, h1, .lead, .cta-row, #a-orbit, #b-glyph").forEach((n) => gsap.set(n, { clearProps: "all" }));
  };
}

function doSwap(next) {
  const prev = currentWorld;
  scrollPos[prev] = window.scrollY;
  currentWorld = next;
  document.documentElement.dataset.world = next;
  if (motion[prev]) { motion[prev](); motion[prev] = null; }
  worlds[prev].classList.remove("is-active");
  worlds[next].classList.add("is-active");
  motion[next] = initMotion(next, worlds[next], 0.1);
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollPos[next] || 0);
    if (lenis) lenis.scrollTo(scrollPos[next] || 0, { immediate: true });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    saveState();
  });
}

/* ============================================================
   CORE + CRYSTAL WAVE
   ============================================================ */
const cores = document.querySelectorAll(".core");
const wave = document.getElementById("wave");
const waveFront = $(".wave-front", wave);
const waveRing = $(".wave-ring", wave);
let busy = false;

/* Core variant switcher: per-core default, or ?core=cube | rings | morph overrides all */
(function setCoreVariant() {
  const param = new URLSearchParams(location.search).get("core");
  document.querySelectorAll(".core").forEach((c) => {
    const variant = ["cube", "rings", "morph"].includes(param) ? param : (c.dataset.variant || "cube");
    c.classList.remove("is-cube", "is-rings", "is-morph");
    c.classList.add("is-" + variant);
    c.dataset.variant = variant;
  });
})();

function runCrystalWave(next, origin) {
  const prev = currentWorld;
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const cover = Math.hypot(window.innerWidth, window.innerHeight) / 16;

  lockScroll();
  wave.classList.add("is-run");
  waveFront.classList.add("is-crystal");
  gsap.set([waveFront, waveRing], { x, y, scale: 0, opacity: 1, transformOrigin: "0 0" });

  const tl = gsap.timeline({
    onComplete: () => {
      waveFront.classList.remove("is-crystal");
      wave.classList.remove("is-run");
      unlockScroll();
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPos[next] || 0);
        if (lenis) lenis.scrollTo(scrollPos[next] || 0, { immediate: true });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        saveState();
      });
    },
  });

  tl.to(origin, { scale: 1.5, opacity: 0, duration: 0.28, ease: "power2.out" }, 0)
    .to(waveFront, { scale: cover, duration: 0.95, ease: "power3.inOut", transformOrigin: "0 0" }, 0)
    .to(waveRing, { scale: cover, opacity: 0, duration: 0.95, ease: "power3.inOut", transformOrigin: "0 0" }, 0)
    .add(() => {
      scrollPos[prev] = window.scrollY;
      currentWorld = next;
      document.documentElement.dataset.world = next;
      if (motion[prev]) { motion[prev](); motion[prev] = null; }
      worlds[prev].classList.remove("is-active");
      worlds[next].classList.add("is-active");
      motion[next] = initMotion(next, worlds[next], 0.5);
    }, 0.4)
    .to(waveFront, { opacity: 0, duration: 0.3 }, 0.85)
    .to(origin, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, 1.0);
}

cores.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    const next = currentWorld === "builder" ? "creator" : "builder";
    if (!REDUCE && GSAP_OK) runCrystalWave(next, btn); else doSwap(next);
    setTimeout(() => { busy = false; }, 1500);
  });
});

/* core leans toward the pointer when it is near */
if (!REDUCE && window.matchMedia("(hover: hover)").matches && GSAP_OK) {
  const sets = Array.from(cores).map((c) => ({
    byX: gsap.quickTo(c, "x", { duration: 0.8, ease: "power3.out" }),
    byY: gsap.quickTo(c, "y", { duration: 0.8, ease: "power3.out" }),
  }));
  window.addEventListener("mousemove", (e) => {
    Array.from(cores).forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 240) { const t = 1 - dist / 240; sets[i].byX(dx * 0.12 * t); sets[i].byY(dy * 0.12 * t); }
      else { sets[i].byX(0); sets[i].byY(0); }
    });
  });
}

/* ============================================================
   LENIS + SCROLL
   ============================================================ */
if (!REDUCE && GSAP_OK) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -70, duration: 1.2 });
      }
    });
  });
}

/* ============================================================
   CURSOR + MAGNETIC + BOOT
   ============================================================ */
(function () {
  if (REDUCE || !GSAP_OK) return;
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  const dot = document.querySelector(".cursor-dot");
  if (!dot) return;
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  gsap.ticker.add(() => gsap.set(dot, { x: mouse.x, y: mouse.y }));
})();

if (!REDUCE && GSAP_OK) {
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = 12;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
      const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power3.out" }));
  });
}

/* Boot — restore last world + scroll after refresh */
const bootState = loadState();
if (bootState && bootState.world === "creator" && worlds.creator) {
  currentWorld = "creator";
  document.documentElement.dataset.world = "creator";
  worlds.builder.classList.remove("is-active");
  worlds.creator.classList.add("is-active");
}
if (bootState && bootState.scroll) {
  scrollPos.builder = bootState.scroll.builder || 0;
  scrollPos.creator = bootState.scroll.creator || 0;
}

motion[currentWorld] = initMotion(currentWorld, worlds[currentWorld], 0.15);

requestAnimationFrame(() => {
  window.scrollTo(0, scrollPos[currentWorld] || 0);
  if (lenis) lenis.scrollTo(scrollPos[currentWorld] || 0, { immediate: true });
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});

if (GSAP_OK && window.ScrollTrigger) {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* core press feedback (CSS :active loses to GSAP inline transforms) */
document.addEventListener("pointerdown", (e) => { const b = e.target.closest(".core"); if (b) b.classList.add("is-pressed"); });
const releaseCore = (e) => { const b = e.target.closest(".core"); if (b) b.classList.remove("is-pressed"); };
document.addEventListener("pointerup", releaseCore);
document.addEventListener("pointerleave", releaseCore);
