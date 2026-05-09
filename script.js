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

// ---------- Data ----------
const exploration = [
  { id: "EXP-001", title: "Redis internals", note: "Single-threaded event loop, AOF vs RDB, expiration semantics. Reading the source to understand why it's fast.", status: "in progress" },
  { id: "EXP-002", title: "RabbitMQ patterns", note: "Exchanges, dead-letter routing, consumer prefetch. Building small workflows to feel each tradeoff.", status: "in progress" },
  { id: "EXP-003", title: "Realtime communication", note: "WebSocket vs SSE vs long-poll. Building a tiny pub/sub layer from scratch over TCP.", status: "active" },
  { id: "EXP-004", title: "Networking concepts", note: "TCP handshakes, congestion control, latency budgets. Notes from packet captures.", status: "ongoing" },
  { id: "EXP-005", title: "Low-level programming", note: "Memory layout, syscalls, small allocators. Mostly C, occasionally assembly when curiosity wins.", status: "exploring" },
  { id: "EXP-006", title: "Robotics & simulation", note: "Sensor loops, control timing, simulation environments. Where software meets the physical world.", status: "exploring" },
];

const projects = [
  { name: "Redis Clone", tag: "systems / in-memory store",
    problem: "Understand how an event-loop-driven key/value store actually works.",
    learning: "Built a minimal RESP parser, expiration with a sampled probabilistic sweeper, and AOF-style persistence.",
    stack: ["C", "TCP sockets", "epoll"] },
  { name: "Distributed Communication System", tag: "messaging / coordination",
    problem: "Coordinate work across services without tightly coupling them.",
    learning: "Topic-based routing on RabbitMQ, idempotent consumers, retry with exponential backoff and DLQs.",
    stack: ["Python", "RabbitMQ", "Postgres"] },
  { name: "Terminal Alpha", tag: "tooling / experimental",
    problem: "A focused terminal-style workspace for navigating notes and experiments.",
    learning: "Streaming UI, keyboard-first ergonomics, command parsing.",
    stack: ["TypeScript", "Node", "ANSI"] },
  { name: "ZG_BTrade", tag: "realtime / market data",
    problem: "Process a steady firehose of market events without falling behind.",
    learning: "Bounded queues, backpressure, careful allocation in the hot path.",
    stack: ["Python", "asyncio", "Redis Streams"] },
  { name: "Automation Systems", tag: "intelligent automation",
    problem: "Reduce manual toil across personal and team workflows.",
    learning: "Composable task graphs, durable retries, a small DSL for declarative jobs.",
    stack: ["Python", "FastAPI", "Postgres"] },
];

const philosophy = [
  { n: "01", t: "Coordination is the hard part", d: "Single-process logic is mostly tractable. The interesting failures live in how components agree, retry, and recover." },
  { n: "02", t: "Prefer internals over abstractions", d: "Abstractions are easier to learn, internals are easier to debug. I want both, in that order." },
  { n: "03", t: "Make it observable before fast", d: "If you can't see what a system is doing, performance work is just guessing with extra steps." },
  { n: "04", t: "Backpressure beats bigger buffers", d: "Saying 'slow down' is more honest than pretending you have unlimited capacity." },
  { n: "05", t: "Reliability comes from boring", d: "Boring components, boring deploys, boring on-call. Excitement is a smell." },
  { n: "06", t: "Curiosity compounds", d: "Following a small question into the source has paid me back more than any framework ever has." },
];

const stack = [
  { domain: "Backend", items: ["Python", "Node.js", "Go", "FastAPI"] },
  { domain: "Messaging & Realtime", items: ["RabbitMQ", "Redis", "Kafka", "WebSockets"] },
  { domain: "Data", items: ["Postgres", "Redis Streams", "SQLite", "DuckDB"] },
  { domain: "Infra", items: ["Docker", "Linux", "nginx", "Terraform"] },
  { domain: "Systems / low-level", items: ["C", "epoll/kqueue", "TCP/IP", "perf"] },
  { domain: "Tooling", items: ["Git", "tmux", "neovim", "Wireshark"] },
];

const esc = (s) => s.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

// ---------- Render ----------
document.getElementById("exp-grid").innerHTML = exploration.map(t => `
  <article class="card exp-card">
    <div class="top">
      <span class="id">${esc(t.id)}</span>
      <span class="status">${esc(t.status)}</span>
    </div>
    <h3>${esc(t.title)}</h3>
    <p>${esc(t.note)}</p>
  </article>
`).join("");

document.getElementById("proj-list").innerHTML = projects.map((p, i) => `
  <article class="card proj">
    <div class="proj-grid">
      <div>
        <div class="pjid">PRJ-${String(i+1).padStart(2,"0")}</div>
        <h3>${esc(p.name)}</h3>
        <div class="tag">${esc(p.tag)}</div>
      </div>
      <div>
        <div class="row"><span class="label-mono">problem</span><span>${esc(p.problem)}</span></div>
        <div class="row"><span class="label-mono">learning</span><span>${esc(p.learning)}</span></div>
      </div>
      <div class="chips">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
    </div>
  </article>
`).join("");

document.getElementById("phil-grid").innerHTML = philosophy.map(p => `
  <div class="item">
    <div class="num">${esc(p.n)}</div>
    <div>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>
  </div>
`).join("");

document.getElementById("stack-grid").innerHTML = stack.map(s => `
  <div class="card">
    <div class="label-mono mb">// ${esc(s.domain.toLowerCase())}</div>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>
`).join("");
