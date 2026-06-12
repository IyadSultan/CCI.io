// CCI Session 11 — Educational PowerPoint Deck
// "From a Web Page to a Deployed Clinical App — Web Foundations and Django, on Render"
// Run:  npm i pptxgenjs   (or: npm i -g pptxgenjs)
//       node build_pptx.js   (writes Session_11_Web_to_Deployed_App.pptx)

const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "CCI Session 11 — From a Web Page to a Deployed Clinical App";
pres.author = "Iyad Sultan, MD — AI Office, KHCC";

const NAVY = "0C4A6E";
const SKY = "0369A1";
const ACCENT = "38BDF8";
const BG = "F8FAFC";
const CODEBG = "0F172A";
const CODEFG = "E2E8F0";
const GRAY = "6B7280";
const RED = "B91C1C";
const GREEN = "15803D";

const SANS = "Calibri";
const SERIF = "Cambria";
const MONO = "Consolas";

// ---------- helpers ----------

function footer(slide, num, label) {
  slide.addShape("rect", {
    x: 0, y: 7.2, w: 13.333, h: 0.3, fill: { color: NAVY }, line: { type: "none" },
  });
  slide.addText(label || "CCI Session 11 · Iyad Sultan, MD · AI Office, KHCC", {
    x: 0.3, y: 7.22, w: 10, h: 0.26, fontFace: SANS, fontSize: 9, color: "FFFFFF",
  });
  slide.addText(String(num), {
    x: 12.5, y: 7.22, w: 0.6, h: 0.26, fontFace: SANS, fontSize: 9, color: "FFFFFF",
    align: "right",
  });
}

function titleBar(slide, title, sectionLabel) {
  slide.background = { color: BG };
  if (sectionLabel) {
    slide.addText(sectionLabel.toUpperCase(), {
      x: 0.5, y: 0.3, w: 12.3, h: 0.3,
      fontFace: SANS, fontSize: 11, color: SKY, bold: true, charSpacing: 4,
    });
  }
  slide.addText(title, {
    x: 0.5, y: sectionLabel ? 0.6 : 0.4, w: 12.3, h: 0.8,
    fontFace: SANS, fontSize: 28, color: NAVY, bold: true,
  });
  slide.addShape("rect", {
    x: 0.5, y: sectionLabel ? 1.4 : 1.2, w: 1.2, h: 0.04, fill: { color: ACCENT }, line: { type: "none" },
  });
}

function bullets(slide, items, opts = {}) {
  const x = opts.x ?? 0.7;
  const y = opts.y ?? 1.7;
  const w = opts.w ?? 12;
  const h = opts.h ?? 5.2;
  const fontSize = opts.fontSize ?? 16;
  const lineSpacing = opts.lineSpacing ?? 28;
  const text = items.map((it) => {
    if (typeof it === "string") return { text: it, options: { bullet: { code: "25CF" }, fontSize, color: "1F2937" } };
    return {
      text: it.text,
      options: {
        bullet: it.sub ? { indent: 30, code: "25E6" } : { code: "25CF" },
        fontSize: it.fontSize ?? fontSize,
        color: it.color ?? "1F2937",
        bold: it.bold ?? false,
      },
    };
  });
  slide.addText(text, { x, y, w, h, fontFace: SERIF, paraSpaceAfter: 4, lineSpacing });
}

function codeBlock(slide, code, opts = {}) {
  const x = opts.x ?? 0.7;
  const y = opts.y ?? 4.0;
  const w = opts.w ?? 12;
  const h = opts.h ?? 2.7;
  const fontSize = opts.fontSize ?? 11;
  slide.addShape("rect", {
    x, y, w, h, fill: { color: CODEBG }, line: { color: NAVY, width: 0.5 },
    rectRadius: 0.05,
  });
  slide.addText(code, {
    x: x + 0.15, y: y + 0.08, w: w - 0.3, h: h - 0.16,
    fontFace: MONO, fontSize, color: CODEFG, paraSpaceAfter: 0,
    valign: "top",
  });
  if (opts.label) {
    slide.addText(opts.label, {
      x, y: y - 0.32, w, h: 0.25,
      fontFace: SANS, fontSize: 10, color: GRAY, italic: true,
    });
  }
}

function calloutBox(slide, label, body, color, opts = {}) {
  const x = opts.x ?? 0.7;
  const y = opts.y ?? 6.2;
  const w = opts.w ?? 12;
  const h = opts.h ?? 0.8;
  slide.addShape("rect", {
    x, y, w, h, fill: { color: opts.bg ?? "EFF6FF" }, line: { color, width: 1 },
    rectRadius: 0.04,
  });
  slide.addText(
    [
      { text: label.toUpperCase() + "  ", options: { bold: true, color, fontFace: SANS, fontSize: 11 } },
      { text: body, options: { color: "1F2937", fontFace: SERIF, fontSize: 12 } },
    ],
    { x: x + 0.2, y: y + 0.08, w: w - 0.4, h: h - 0.16, valign: "middle" }
  );
}

let n = 1;
function newSlide() { return pres.addSlide(); }

// ---------- title slide ----------

(function titleSlide() {
  const s = newSlide();
  s.background = { color: NAVY };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: NAVY }, line: { type: "none" } });
  s.addShape("rect", { x: 0, y: 5.5, w: 13.333, h: 0.05, fill: { color: ACCENT }, line: { type: "none" } });
  s.addShape("rect", { x: 0, y: 5.8, w: 13.333, h: 0.02, fill: { color: SKY }, line: { type: "none" } });

  s.addText("CCI · SESSION 11", {
    x: 0.7, y: 1.3, w: 12, h: 0.4, fontFace: SANS, fontSize: 16, color: ACCENT, bold: true, charSpacing: 6,
  });
  s.addText("From a Web Page to a", {
    x: 0.7, y: 1.9, w: 12, h: 1.0, fontFace: SANS, fontSize: 42, color: "FFFFFF", bold: true,
  });
  s.addText("Deployed Clinical App", {
    x: 0.7, y: 2.8, w: 12, h: 1.0, fontFace: SANS, fontSize: 42, color: "FFFFFF", bold: true,
  });
  s.addText("Web foundations and Django, shipped on Render", {
    x: 0.7, y: 4.2, w: 12, h: 0.6, fontFace: SERIF, fontSize: 18, color: "E2E8F0", italic: true,
  });
  s.addText("Iyad Sultan, MD", {
    x: 0.7, y: 6.0, w: 12, h: 0.4, fontFace: SANS, fontSize: 18, color: "FFFFFF", bold: true,
  });
  s.addText("Medical Director, AI Office · King Hussein Cancer Center", {
    x: 0.7, y: 6.4, w: 12, h: 0.4, fontFace: SANS, fontSize: 12, color: "94A3B8",
  });
  n++;
})();

// ---------- arc / agenda ----------

(function agenda() {
  const s = newSlide();
  titleBar(s, "The climb: text file → app on the internet");
  bullets(s, [
    { text: "Web foundations (Lessons 1–4)", bold: true, color: SKY },
    { text: "HTML → JavaScript & frontend frameworks → the full stack → the smallest Django", sub: true },
    { text: "The ER-triage app (Lessons 5–7)", bold: true, color: SKY },
    { text: "Tour the ready-made app → extend it with a new Django app → deploy it on Render", sub: true },
    { text: "Close (Lesson 8)", bold: true, color: SKY },
    { text: "Cheat sheet + what to build next", sub: true },
    { text: "Every rung is the smallest thing that makes the next rung make sense.", color: GRAY },
  ], { y: 1.7, h: 5.0, lineSpacing: 30 });
  footer(s, n++);
})();

// ===================================================================
// SECTION 1 — WEB FOUNDATIONS
// ===================================================================

function sectionDivider(label, name) {
  const s = newSlide();
  s.background = { color: NAVY };
  s.addText(label.toUpperCase(), {
    x: 0.7, y: 3.0, w: 12, h: 0.5, fontFace: SANS, fontSize: 18, color: ACCENT, bold: true, charSpacing: 6,
  });
  s.addText(name, {
    x: 0.7, y: 3.6, w: 12, h: 1.5, fontFace: SANS, fontSize: 40, color: "FFFFFF", bold: true,
  });
  s.addShape("rect", { x: 0.7, y: 5.0, w: 1.5, h: 0.06, fill: { color: ACCENT }, line: { type: "none" } });
  n++;
}

sectionDivider("Movement 1 · Lessons 1–4", "Web Foundations");

// --- L1 HTML concept ---
(function l1a() {
  const s = newSlide();
  titleBar(s, "What is a web page?", "Lesson 1 · HTML");
  bullets(s, [
    { text: "A web page is a text file the browser knows how to draw. Nothing more.", bold: true },
    { text: "HTML marks up content with tags: <h1>, <p>, <ul>/<li>, <a>, <button>.", sub: true },
    { text: "Grammar is always: open, content, close.  <h1>Triage</h1>", sub: true },
    { text: "Attributes configure a tag: <a href=\"https://khcc.jo\">KHCC</a>", sub: true },
    { text: "Every page shares one skeleton: <head> (title, styling) + <body> (what you see).", sub: true },
  ], { y: 1.7, h: 2.0, lineSpacing: 26 });
  codeBlock(s, [
    "<!DOCTYPE html>",
    "<html>",
    "  <head><title>Patient Intake</title></head>",
    "  <body>",
    "    <h1>Hello, KHCC</h1>",
    "    <p>My first web page.</p>",
    "  </body>",
    "</html>",
  ].join("\n"), { y: 3.9, h: 2.2, label: "Save as intake.html, double-click — no server needed" });
  calloutBox(s, "Remember", "HTML = structure. CSS = appearance. A form that 'does nothing' on click is where HTML ends.", SKY);
  footer(s, n++);
})();

// --- L2 JavaScript ---
(function l2() {
  const s = newSlide();
  titleBar(s, "Making it move — JavaScript", "Lesson 2 · JS & Frontends");
  bullets(s, [
    { text: "HTML names things; JavaScript gives them verbs — it runs in every browser.", bold: true },
    { text: "An event (click) triggers a function; the function reads a value and writes back.", sub: true },
  ], { y: 1.6, h: 1.2, lineSpacing: 24 });
  codeBlock(s, [
    "function checkTemp() {",
    "  const t = parseFloat(document.getElementById('temp').value);",
    "  document.getElementById('out').textContent =",
    "    t >= 38 ? '⚠️ Febrile — escalate if on chemo.' : 'Afebrile.';",
    "}",
  ].join("\n"), { y: 2.9, h: 1.7, label: "Reads an input, decides, updates the page" });
  calloutBox(s, "Watch out", "This runs in the browser, on the user's machine — fine as a warning, NEVER the official clinical decision. Trusted logic lives on the backend.", RED, { bg: "FEF2F2" });
  footer(s, n++);
})();

// --- L2b frontend landscape ---
(function l2b() {
  const s = newSlide();
  titleBar(s, "The frontend framework landscape", "Lesson 2 · JS & Frontends");
  bullets(s, [
    { text: "Frameworks exist to manage scale — keeping a busy screen and its data in sync.", bold: true },
    { text: "React (Meta) — dominant; reusable components. The course's .jsx files are React.", sub: true },
    { text: "Vue — gentler. Angular (Google) — big, opinionated. Svelte — work done at build time.", sub: true },
    { text: "They share ONE idea: describe the UI for given data; the framework keeps them synced.", sub: true },
    { text: "We deliberately use NO framework: the triage app is a form + a queue, server-rendered by Django with a little plain JS. Reach for a framework only when the screen's complexity earns it.", color: GRAY },
  ], { y: 1.7, h: 4.6, lineSpacing: 28 });
  footer(s, n++);
})();

// --- L3 full stack ---
(function l3() {
  const s = newSlide();
  titleBar(s, "The full stack & the request/response cycle", "Lesson 3 · Full Stack");
  bullets(s, [
    { text: "Frontend = browser (display & interaction). Backend = server (data & trusted logic).", bold: true },
  ], { y: 1.55, h: 0.7, lineSpacing: 22 });
  codeBlock(s, [
    "  BROWSER (frontend)        SERVER (backend)            DATABASE",
    "  triage form  ── request ─► 1. validate the form",
    "               'a patient'   2. compute acuity  ── save ─► Patient",
    "                             3. ask the LLM              TriageEvent",
    "  confirmation ◄─ response ─ 4. save the row   ◄─ read ─",
    "               'acuity 1'    5. render the reply",
  ].join("\n"), { y: 2.4, h: 2.2, fontSize: 11, label: "Every action on every site is some version of this loop" });
  calloutBox(s, "Django's place", "Django is the backend done in Python — the ASP/PHP lineage: receive the request, run code, read/write the DB, render the HTML page back (server-side rendering).", SKY, { h: 0.9 });
  footer(s, n++);
})();

// --- L3b the two mistakes ---
(function l3b() {
  const s = newSlide();
  titleBar(s, "The two expensive clinical mistakes", "Lesson 3 · Full Stack");
  bullets(s, [
    { text: "Trusting the browser", bold: true, color: RED },
    { text: "Validation or a rule that runs only in JavaScript can be bypassed. Anything that must be true is enforced on the backend. The frontend version is a courtesy; the backend version is the law.", sub: true },
    { text: "Leaking a secret", bold: true, color: RED },
    { text: "Anything sent to the browser can be read by anyone. API keys, DB passwords, another patient's PHI — they stay on the backend, always.", sub: true },
    { text: "Frontend ↔ display & interaction.   Backend ↔ data, trusted logic, secrets.", bold: true, color: GREEN },
  ], { y: 1.7, h: 4.6, lineSpacing: 30 });
  footer(s, n++);
})();

// --- L4 smallest django ---
(function l4() {
  const s = newSlide();
  titleBar(s, "The smallest Django that runs", "Lesson 4 · Django");
  bullets(s, [
    { text: "Project = the whole site.  App = one feature.  One project, many apps.", bold: true },
  ], { y: 1.55, h: 0.6 });
  codeBlock(s, [
    "django-admin startproject mysite .   # the PROJECT",
    "python manage.py startapp pages      # an APP (one feature)",
    "python manage.py migrate             # set up the database",
    "python manage.py runserver           # serve at 127.0.0.1:8000",
  ].join("\n"), { y: 2.3, h: 1.6, label: "manage.py is the control panel for every command" });
  bullets(s, [
    { text: "Three moves to serve a page:  (1) register the app in INSTALLED_APPS → (2) write a view → (3) connect a URL.  Rhythm: URL → view → response.", bold: true, color: SKY },
  ], { y: 4.1, h: 1.0, lineSpacing: 24 });
  calloutBox(s, "Server-side rendering", "render(request, 'pages/home.html', {'name': 'KHCC'}) — Python decides the data, bakes it into {{ slots }}, sends finished HTML. Templates live in app/templates/app/.", SKY, { y: 5.3, h: 0.95 });
  footer(s, n++);
})();

// ===================================================================
// SECTION 2 — THE ER-TRIAGE APP
// ===================================================================

sectionDivider("Movement 2 · Lessons 5–7", "The ER-Triage App");

// --- L5 meet the app ---
(function l5() {
  const s = newSlide();
  titleBar(s, "Meet the ER-triage app", "Lesson 5 · Read a Codebase");
  bullets(s, [
    { text: "Reading a codebase = find your way around, not understand every line.", bold: true },
    { text: "pip install -r requirements.txt → migrate → seed_demo → runserver.", sub: true },
    { text: "Nurse form (/triage/new) · doctor queue (/) · detail (/triage/<id>).", sub: true },
    { text: "Runs with no OpenAI key — the LLM extractor degrades gracefully (status 'failed').", sub: true },
    { text: "The services/ split is the key design idea:", bold: true, color: SKY },
    { text: "acuity.py — pure Python, deterministic, testable. The LLM NEVER computes acuity.", sub: true },
    { text: "oncologic_emergency.py — LLM on a CLOSED SET of 4 labels; returns 'failed' on any error.", sub: true },
    { text: "PHI: MRN Optimus-encoded, name Fernet-encrypted (crypto.py). Never in the clear.", color: GRAY },
  ], { y: 1.7, h: 4.8, lineSpacing: 25 });
  footer(s, n++);
})();

// --- L5b trace a click ---
(function l5b() {
  const s = newSlide();
  titleBar(s, "Trace one click — five files, one request", "Lesson 5 · Read a Codebase");
  codeBlock(s, [
    "Doctor opens the queue → browser requests '/'",
    "  → er_triage/urls.py     include('triage.urls')",
    "  → triage/urls.py        ''  →  doctor_queue_view",
    "  → triage/views.py       reads TriageEvent rows, ordered by acuity",
    "  → doctor_queue.html     {% for event in events %} draws one row each",
    "  → finished HTML back to the browser",
  ].join("\n"), { y: 1.9, h: 2.4, fontSize: 12, label: "Start from what the user does; let the request be your guide" });
  calloutBox(s, "Technique", "Open only the files the view actually uses. Everything you don't need for THIS change, you're allowed to ignore.", SKY, { y: 4.7, h: 0.9 });
  footer(s, n++);
})();

// --- L6 extend it ---
(function l6() {
  const s = newSlide();
  titleBar(s, "Extend it — add your own Django app", "Lesson 6 · The Lab");
  bullets(s, [
    { text: "The most realistic task: add a feature to a working app. We add a dashboard.", bold: true },
  ], { y: 1.55, h: 0.6 });
  codeBlock(s, [
    "1. python manage.py startapp dashboard      # create it",
    "2. add 'dashboard' to INSTALLED_APPS        # ← the forgotten step",
    "3. dashboard/views.py    from triage.models import TriageEvent",
    "4. dashboard/templates/dashboard/dashboard.html   {% extends 'triage/base.html' %}",
    "5. wire the URL   app urls.py + include() in the project urls.py",
  ].join("\n"), { y: 2.3, h: 2.0, label: "The five-step loop for adding ANY feature" });
  calloutBox(s, "Two failure modes", "App does nothing? (1) you forgot INSTALLED_APPS, or (2) the template isn't at app/templates/app/file.html. Both are one-line fixes.", RED, { y: 4.6, h: 0.9, bg: "FEF2F2" });
  footer(s, n++);
})();

// --- L7 ship on render ---
(function l7() {
  const s = newSlide();
  titleBar(s, "Ship it — GitHub → Render → live URL", "Lesson 7 · Deploy");
  bullets(s, [
    { text: "Deployment = move the backend onto an always-on, internet-reachable computer.", bold: true },
    { text: "The request/response loop is unchanged — only the address: localhost → onrender.com.", sub: true },
    { text: "requirements.txt (packages) · build.sh (pip install → collectstatic → migrate)", sub: true },
    { text: "gunicorn replaces runserver · whitenoise serves static files · render.yaml = blueprint", sub: true },
    { text: "Production: DEBUG=False · ALLOWED_HOSTS (Render host auto-added) · SECRET_KEY generated", sub: true },
    { text: "git push → Render auto-redeploys. The first deploy often fails; the log tells you why.", sub: true },
  ], { y: 1.7, h: 3.6, lineSpacing: 26 });
  calloutBox(s, "Never commit secrets", ".gitignore excludes .env, db.sqlite3, .venv. A committed key is leaked even if you delete it — it stays in git history. Set OPENAI_API_KEY / FERNET_KEY in the dashboard.", RED, { y: 5.5, h: 0.95, bg: "FEF2F2" });
  footer(s, n++);
})();

// ===================================================================
// SECTION 3 — CLOSE
// ===================================================================

sectionDivider("Movement 3 · Lesson 8", "Close & What's Next");

// --- L8 cheat sheet ---
(function l8() {
  const s = newSlide();
  titleBar(s, "The whole stack on one page", "Lesson 8 · Cheat Sheet");
  codeBlock(s, [
    "  FRONTEND (browser)      BACKEND (server)         DATABASE",
    "  HTML  = structure       Python + Django          rows & tables",
    "  CSS   = appearance      URL → view → template    Patient",
    "  JS    = behavior        models · forms · services  TriageEvent",
    "  React = (frameworks)    deterministic logic + secrets live here",
  ].join("\n"), { y: 1.8, h: 2.0, fontSize: 12, label: "The one rule: display→frontend; data, trusted logic, secrets→backend" });
  bullets(s, [
    { text: "Add any feature:  startapp → INSTALLED_APPS → view → template → url.", bold: true, color: SKY },
    { text: "Two universal failures: feature does nothing = INSTALLED_APPS / template path; breaks on Render = DEBUG / ALLOWED_HOSTS / missing package / secret not set.", color: GRAY },
  ], { y: 4.1, h: 1.6, lineSpacing: 26 });
  footer(s, n++);
})();

// --- whats next ---
(function whatsNext() {
  const s = newSlide();
  titleBar(s, "What to build next", "Lesson 8 · Close");
  bullets(s, [
    { text: "1. Harden this app", bold: true },
    { text: "Add the login it deliberately lacks; add 'recall last triage'; move to Render Postgres.", sub: true },
    { text: "2. Build your own", bold: true },
    { text: "One screen your unit actually needs — handoff board, protocol lookup, intake form. Small and shipped beats large and theoretical.", sub: true },
    { text: "3. Connect the chain", bold: true },
    { text: "Use Claude Code's agents (Session 10) to build the next feature through the pipeline, then deploy it with what you learned today.", sub: true },
    { text: "S10 built software · S11 shipped it · S12 makes it safe (PHI, audit, governance).", color: GRAY },
  ], { y: 1.7, h: 4.8, lineSpacing: 27 });
  footer(s, n++);
})();

// ---------- Closing ----------

(function closing() {
  const s = newSlide();
  s.background = { color: NAVY };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: NAVY }, line: { type: "none" } });
  s.addShape("rect", { x: 0, y: 5.7, w: 13.333, h: 0.04, fill: { color: ACCENT }, line: { type: "none" } });

  s.addText("You crossed the whole stack.", {
    x: 0.7, y: 2.3, w: 12, h: 0.8, fontFace: SANS, fontSize: 34, color: "FFFFFF", bold: true,
  });
  s.addText("From a text file your browser draws — to an app the world can open.", {
    x: 0.7, y: 3.0, w: 12, h: 0.8, fontFace: SANS, fontSize: 24, color: ACCENT, bold: true,
  });
  s.addText("HTML  →  the stack  →  Django  →  extend it  →  git push  →  live URL", {
    x: 0.7, y: 4.4, w: 12, h: 0.6, fontFace: SERIF, fontSize: 18, color: "94A3B8", italic: true,
  });
  s.addText("Now build something your unit needs.", {
    x: 0.7, y: 6.0, w: 12, h: 0.6, fontFace: SANS, fontSize: 22, color: "FFFFFF",
  });
  s.addText("CCI · Session 11 · Iyad Sultan, MD · AI Office, KHCC · 2026", {
    x: 0.7, y: 6.9, w: 12, h: 0.3, fontFace: SANS, fontSize: 10, color: "64748B",
  });
})();

// ---------- Save ----------

const out = path.join(__dirname, "Session_11_Web_to_Deployed_App.pptx");
pres.writeFile({ fileName: out }).then((f) => {
  console.log("Wrote", f);
});
