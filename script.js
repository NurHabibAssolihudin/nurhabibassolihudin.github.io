// ---------- Theme toggle ----------
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

// ---------- Nav scroll state ----------
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Typing effect ----------
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");
const phrases = ["build platforms.", "productize AI.", "ship games.", "understand systems."];
let pIdx = 0, cIdx = 0, deleting = false;

function tick() {
  const word = phrases[pIdx];
  if (!deleting) {
    typedTextSpan.textContent = word.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === word.length) { deleting = true; setTimeout(tick, 1800); return; }
    setTimeout(tick, 55);
  } else {
    typedTextSpan.textContent = word.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(tick, 350); return; }
    setTimeout(tick, 28);
  }
}
if (cursorSpan && typedTextSpan) { cursorSpan.classList.add("typing"); setTimeout(tick, 500); }

// ---------- Helpers & data ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const projects = [
  { id: "OC-01", name: "Ocaty", tag: "platform / e-commerce", url: null,
    problem: "Design a product surface that multiple teams can ship to independently.",
    learning: "Module Federation for micro-frontends, a design system published as a package, and FastAPI services (account, notification) on PostgreSQL.",
    stack: ["TypeScript", "React", "Module Federation", "FastAPI", "PostgreSQL"] },
  { id: "AI-01", name: "Tony", tag: "ai / self-hosted assistant", url: "https://github.com/NurHabibAssolihudin/Tony",
    problem: "build an AI assistant I can run myself, that remembers and can act.",
    learning: "Stateful agent with memory (Letta) + a custom React UI + an automation layer, composed as one monorepo.",
    stack: ["Letta", "React", "Activepieces", "TypeScript"] },
  { id: "AI-02", name: "Oxelot", tag: "web / low-level library", url: "https://github.com/NurHabibAssolihudin/Oxelot",
    problem: "give PWAs native-level storage, background processing, and hardware access over the open web.",
    learning: "Spec-driven library @oxelot/core + @oxelot/react, with WASM SQLite VFS, OPFS storage, a worker pool, and offline sync.",
    stack: ["TypeScript", "WASM", "Workers", "OPFS"] },
  { id: "AI-03", name: "GenUI", tag: "ai / configurable dashboard", url: "https://github.com/NurHabibAssolihudin/GenUI",
    problem: "let an AI reshape a dashboard's layout from plain language.",
    learning: "FastAPI + server-rendered Jinja2, where the AI emits JSON describing UI components rendered from a small library.",
    stack: ["Python", "FastAPI", "Jinja2", "LLM"] },
  { id: "SY-01", name: "RabbitMQ-Chat-App", tag: "systems / realtime", url: "https://github.com/NurHabibAssolihudin/RabbitMQ-Chat-App",
    problem: "feel how message brokers coordinate realtime services.",
    learning: "A FastAPI chat over RabbitMQ quorum queues with a WebSocket broadcast hub — pub/sub & durability in practice.",
    stack: ["Python", "FastAPI", "RabbitMQ", "WebSocket"] },
  { id: "GD-01", name: "alimagine", tag: "games / narrative", url: "https://github.com/alimagine",
    problem: "build moments and feelings through the combination of visual, audio, and story.",
    learning: "Godot games and interactive narratives — from a platformer to a world-building political thriller trilogy.",
    stack: ["Godot", "GDScript", "Narrative Design"] },
];

document.getElementById("proj-list").innerHTML = projects.map(p => `
  <article class="card proj">
    <div class="proj-grid">
      <div>
        <div class="pjid">${esc(p.id)}</div>
        <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.name)} →</a>` : esc(p.name)}</h3>
      </div>
      <div>
        <div class="row"><span class="label-mono">problem</span><span>${esc(p.problem)}</span></div>
        <div class="row"><span class="label-mono">what I built</span><span>${esc(p.learning)}</span></div>
      </div>
      <div>
        <div class="tag">// ${esc(p.tag)}</div>
        <div class="chips">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </div>
    </div>
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
  <div class="card">
    <div class="label-mono mb" style="margin-bottom:.6rem">// ${esc(s.domain.toLowerCase())}</div>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>
`).join("");

const philosophy = [
  { n: "01", t: "Ship, then understand deeper", d: "Plans are great, but shipping is where you learn what the system actually demands. Build real things, then dig into why they work." },
  { n: "02", t: "Productize AI, don't wrap it", d: "The value isn't a prompt box — it's turning models into products with real memory, real actions, and real interfaces." },
  { n: "03", t: "Prefer internals over abstractions", d: "Abstractions are easier to learn, internals are easier to debug. I want both, in that order." },
  { n: "04", t: "Make it observable before fast", d: "If you can't see what a system is doing, you can't make it reliable — let alone fast. Observability is the first optimization." },
];
document.getElementById("phil-grid").innerHTML = philosophy.map(p => `
  <div class="card item">
    <div class="num">${esc(p.n)}</div>
    <div>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>
  </div>
`).join("");

