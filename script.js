/* ============ Theme ============ */
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", saved || (prefersLight ? "light" : "dark"));
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* ============ Nav scroll state ============ */
const nav = document.getElementById("nav");

/* ============ Reduced-motion preference ============ */
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ GSAP availability ============ */
const GSAP_OK = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

/* ============ Year ============ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============ Data ============ */
const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const projects = [
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
  { id: "GD", name: "alimagine", tag: "games / narrative", url: "https://github.com/alimagine",
    problem: "Build moments and feelings through the combination of visual, audio, and story.",
    built: "Godot games and interactive narratives — from a platformer to a world-building political thriller trilogy.",
    stack: ["Godot", "GDScript", "Narrative"] },
];

document.getElementById("proj-list").innerHTML = projects.map(p => `
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

const stack = [
  { domain: "Languages", items: ["Python", "TypeScript", "JavaScript", "GDScript"] },
  { domain: "Backend & AI", items: ["FastAPI", "Jinja2", "Letta", "LLM Agents", "WASM"] },
  { domain: "Frontend & Platforms", items: ["React", "Next.js", "Vite", "Module Federation", "Design Systems"] },
  { domain: "Data & Infra", items: ["PostgreSQL", "Redis", "RabbitMQ", "Docker"] },
  { domain: "Tooling", items: ["Bun", "uv", "pnpm", "Git"] },
  { domain: "Games", items: ["Godot", "GDScript"] },
];
document.getElementById("stack-grid").innerHTML = stack.map(s => `
  <div class="stack-card">
    <span class="sdomain">${esc(s.domain)}</span>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>
`).join("");

const philosophy = [
  { t: "Ship, then understand deeper", d: "Plans are great, but shipping is where you learn what the system actually demands. Build real things, then dig into why they work." },
  { t: "Productize AI, don't wrap it", d: "The value isn't a prompt box — it's turning models into products with real memory, real actions, and real interfaces." },
  { t: "Prefer internals over abstractions", d: "Abstractions are easier to learn, internals are easier to debug. I want both, in that order." },
  { t: "Make it observable before fast", d: "If you can't see what a system is doing, you can't make it reliable — let alone fast. Observability is the first optimization." },
];
document.getElementById("phil-list").innerHTML = philosophy.map(p => `
  <div class="phil-item">
    <span class="mark" aria-hidden="true"></span>
    <div>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>
  </div>
`).join("");

/* ============ Motion (Lenis + GSAP) — only when supported & allowed ============ */
if (!REDUCE && GSAP_OK) {
  ScrollTrigger.create({
    start: 24,
    onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 24),
  });
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // smooth anchor scrolling
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

/* ============ Hero intro ============ */
if (!REDUCE && GSAP_OK) {
  gsap.from(".hero .eyebrow, .hero h1, .hero .lead, .hero .cta-row", {
    y: 26, opacity: 0, duration: 0.9, ease: "power3.out",
    stagger: 0.09, delay: 0.1,
  });
  gsap.from("#orbit", { scale: 0.92, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.35 });
}

/* ============ Orbit parallax ============ */
if (!REDUCE && GSAP_OK) {
  gsap.to("#orbit", {
    yPercent: -8, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

/* ============ Scroll reveals ============ */
if (!REDUCE && GSAP_OK) {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  gsap.utils.toArray(".section-head").forEach((el) => {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
  gsap.utils.toArray(".work").forEach((el, i) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: "power3.out", delay: (i % 3) * 0.06,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
  gsap.utils.toArray(".stack-card").forEach((el) => {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });
  gsap.utils.toArray(".phil-item").forEach((el) => {
    gsap.from(el, {
      y: 26, opacity: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });
}

/* ============ Custom cursor ============ */
(function () {
  if (REDUCE || !GSAP_OK) return;
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  const dot = document.querySelector(".cursor-dot");
  if (!dot) return;
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  gsap.ticker.add(() => {
    gsap.set(dot, { x: mouse.x, y: mouse.y });
  });
})();

/* ============ Magnetic buttons ============ */
if (!REDUCE && GSAP_OK) {
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = 12;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2) * strength;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    });
  });
}
