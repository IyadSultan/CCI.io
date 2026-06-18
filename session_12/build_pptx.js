// CCI Session 12 — Educational PowerPoint Deck
// "Locking the Front Door — PHI, Cybersecurity & Cloud Governance"
// Run:  npm i pptxgenjs   (or: npm i -g pptxgenjs)
//       node build_pptx.js   (writes Session_12_Locking_the_Front_Door.pptx)

const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "CCI Session 12 — Locking the Front Door";
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
  slide.addText(label || "CCI Session 12 · Iyad Sultan, MD · AI Office, KHCC", {
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

  s.addText("CCI · SESSION 12", {
    x: 0.7, y: 1.3, w: 12, h: 0.4, fontFace: SANS, fontSize: 16, color: ACCENT, bold: true, charSpacing: 6,
  });
  s.addText("Locking the Front Door", {
    x: 0.7, y: 1.9, w: 12, h: 1.0, fontFace: SANS, fontSize: 44, color: "FFFFFF", bold: true,
  });
  s.addText("PHI, Cybersecurity & Cloud Governance", {
    x: 0.7, y: 3.0, w: 12, h: 0.7, fontFace: SANS, fontSize: 26, color: "FFFFFF", bold: true,
  });
  s.addText("What stands between a teaching demo and a tool that touches a real patient", {
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

// ---------- agenda ----------

(function agenda() {
  const s = newSlide();
  titleBar(s, "Three movements, each resting on the one before");
  bullets(s, [
    { text: "Foundations (Lessons 1–3)", bold: true, color: SKY },
    { text: "What a network is → what encryption is → how the keys actually work", sub: true },
    { text: "Threats & Defenses (Lessons 4–6)", bold: true, color: SKY },
    { text: "How attacks unfold → passwords & MFA → detection with canary tokens", sub: true },
    { text: "Clinical Governance & Cloud (Lessons 7–9)", bold: true, color: SKY },
    { text: "PHI & HIPAA → safe data by design → a hardened cloud server, then teardown", sub: true },
    { text: "You do not need to write code. Three hands-on kits + a live Azure demo.", color: GRAY },
  ], { y: 1.7, h: 5.0, lineSpacing: 30 });
  footer(s, n++);
})();

// ---------- section divider ----------

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

// ===================================================================
// MOVEMENT 1 — FOUNDATIONS
// ===================================================================

sectionDivider("Movement 1 · Lessons 1–3", "Foundations");

// --- L1 network ---
(function l1() {
  const s = newSlide();
  titleBar(s, "What is a network, really?", "Lesson 1 · Networks");
  bullets(s, [
    { text: "A network is computers passing messages; the internet is networks of networks.", bold: true },
    { text: "IP address = a room's number. localhost (127.0.0.1) = this computer only, no public door.", sub: true },
    { text: "Ports = thousands of numbered doors; a service listens on one. Address = IP:port.", sub: true },
    { text: "Firewall = the reception desk: allow a few doors, shut the rest. It checks where, not what.", sub: true },
  ], { y: 1.7, h: 2.0, lineSpacing: 26 });
  codeBlock(s, [
    "  Port 443  HTTPS  →  the public website door (open)",
    "  Port 80   HTTP   →  plain web, a postcard (avoid)",
    "  Port 22   SSH    →  remote login (your IP only)",
    "  Port 3389 RDP    →  remote desktop (never public)",
  ].join("\n"), { y: 3.9, h: 1.9, label: "The four doors worth memorising" });
  calloutBox(s, "The tension", "'Reachable from anywhere' is the whole point of deployment AND the whole danger. Open the minimum: 443 to the public, the rest shut. Every open port is attack surface.", SKY, { h: 0.95 });
  footer(s, n++);
})();

// --- L2 encryption basics ---
(function l2() {
  const s = newSlide();
  titleBar(s, "Encryption, plainly: postcard vs sealed envelope", "Lesson 2 · Encryption");
  bullets(s, [
    { text: "Encryption = scrambling a message with a key; without the key it is gibberish.", bold: true },
    { text: "HTTP is a postcard anyone on the path can read; HTTPS is a sealed envelope.", sub: true },
    { text: "A man-in-the-middle sits on the path and reads/alters anything not encrypted.", sub: true },
    { text: "Your Session 11 app was https:// so the data was encrypted in transit.", sub: true },
  ], { y: 1.7, h: 2.6, lineSpacing: 28 });
  calloutBox(s, "The padlock", "The padlock proves the connection is ENCRYPTED — not that the site is honest or safe. A scam site can hold a valid padlock. Encrypted ≠ trustworthy.", RED, { y: 4.7, h: 0.95, bg: "FEF2F2" });
  footer(s, n++);
})();

// --- L3 encryption types ---
(function l3() {
  const s = newSlide();
  titleBar(s, "Two kinds of keys; in transit vs at rest", "Lesson 3 · Encryption");
  bullets(s, [
    { text: "Symmetric = one shared key (fast). Asymmetric = public/private pair (solves key exchange).", bold: true },
    { text: "In transit = data moving (TLS/HTTPS). At rest = data stored (the database, the disk). Do both.", sub: true },
    { text: "TLS handshake = asymmetric setting up a fast symmetric session key.", sub: true },
  ], { y: 1.6, h: 1.8, lineSpacing: 26 });
  codeBlock(s, [
    "  Session 11, two protections on ONE name:",
    "    Fernet encrypts the name in the database   →  AT REST (symmetric)",
    "    HTTPS protects it on the way to the server →  IN TRANSIT",
  ].join("\n"), { y: 3.6, h: 1.5, label: "The real example from the app you built" });
  calloutBox(s, "Iron rule", "Never roll your own crypto. Use vetted standards — AES-256, RSA, TLS 1.3, Fernet. Home-made ciphers fail invisibly.", SKY, { y: 5.4, h: 0.85 });
  footer(s, n++);
})();

// ===================================================================
// MOVEMENT 2 — THREATS & DEFENSES
// ===================================================================

sectionDivider("Movement 2 · Lessons 4–6", "Threats & Defenses");

// --- L4 attacks ---
(function l4() {
  const s = newSlide();
  titleBar(s, "How attacks actually work (defensively)", "Lesson 4 · Threats");
  codeBlock(s, [
    "zero-day → exploit → backdoor/RAT → persistence →",
    "lateral movement → exfiltration → encrypt-as-weapon → ransomware",
  ].join("\n"), { y: 1.7, h: 1.3, fontSize: 12, label: "The attack chain — one defender's story" });
  bullets(s, [
    { text: "Most breaches = an OLD, unpatched hole + a human click. Not exotic zero-days.", bold: true, color: RED },
    { text: "Patch → closes known holes.   Least privilege → shrinks the blast radius.", sub: true },
    { text: "Segmentation → stops lateral movement.   Tested offline backups → beat ransomware.", sub: true },
  ], { y: 3.4, h: 2.2, lineSpacing: 28 });
  calloutBox(s, "Each brake, one link", "No single wall is enough. Assume one fails and make the next hold. Tested backups are why you can restore and refuse to pay.", SKY, { y: 5.7, h: 0.85 });
  footer(s, n++);
})();

// --- L5 passwords & MFA ---
(function l5() {
  const s = newSlide();
  titleBar(s, "Defending yourself: passwords, MFA, least privilege", "Lesson 5 · Defenses");
  bullets(s, [
    { text: "Length beats complexity: a 4-word passphrase beats P@ssw0rd!.", bold: true },
    { text: "Never reuse — one breach becomes a master key. Use a password manager.", sub: true },
    { text: "MFA = two of {know, have, are}. Your KHCC login + phone code IS MFA.", sub: true },
    { text: "Ranking: SMS < authenticator app < hardware key / passkey (phishing-resistant).", sub: true },
    { text: "Never approve a login prompt you didn't start (MFA fatigue).", sub: true },
  ], { y: 1.7, h: 3.4, lineSpacing: 28 });
  calloutBox(s, "Least privilege", "Work in a normal account; reach for admin only when needed; request the minimum access. The same idea returns in Lesson 9 as an SSH-key, non-root server.", SKY, { y: 5.5, h: 0.9 });
  footer(s, n++);
})();

// --- L6 canary tokens ---
(function l6() {
  const s = newSlide();
  titleBar(s, "The honeypot trick: canary tokens", "Lesson 6 · Detection");
  bullets(s, [
    { text: "You can't prevent everything — so add DETECTION. A canary token is a tripwire.", bold: true },
    { text: "A planted decoy that does nothing but email you the instant it is touched.", sub: true },
    { text: "canarytokens.org — free, no login (Thinkst). e.g. a fake Patient_List_2026.docx.", sub: true },
    { text: "The alert gives a timestamp + source IP — a lead, NOT an identity.", sub: true },
  ], { y: 1.7, h: 3.0, lineSpacing: 28 });
  calloutBox(s, "Ethics — read twice", "Detection on YOUR OWN assets: your own email, fake bait (never real PHI), low-traffic placement, IT in the loop. Pointed outward it becomes surveillance.", RED, { y: 5.2, h: 0.95, bg: "FEF2F2" });
  footer(s, n++);
})();

// ===================================================================
// MOVEMENT 3 — CLINICAL GOVERNANCE & CLOUD
// ===================================================================

sectionDivider("Movement 3 · Lessons 7–9", "Clinical Governance & Cloud");

// --- L7 PHI & HIPAA ---
(function l7() {
  const s = newSlide();
  titleBar(s, "PHI and HIPAA: the rules of the road", "Lesson 7 · Governance");
  bullets(s, [
    { text: "PHI = health information + an identifier that points to a person.", bold: true },
    { text: "The HIPAA 18 identifiers (Safe Harbor). Dates → year; ages > 89 → '90+'.", sub: true },
    { text: "Three different jobs:", bold: true, color: SKY },
    { text: "De-identification removes identifiers · Encryption scrambles (encrypted PHI is STILL PHI) · Access control decides who logs in.", sub: true },
    { text: "Minimum necessary. Beware re-identification by combination (rare dx + date + town).", sub: true },
  ], { y: 1.7, h: 3.6, lineSpacing: 27 });
  calloutBox(s, "Session 11", "The app encrypted the name and encoded the MRN — but had NO login. That missing access control is exactly why it was 'not for clinical use'.", SKY, { y: 5.7, h: 0.85 });
  footer(s, n++);
})();

// --- L8 synthetic data ---
(function l8() {
  const s = newSlide();
  titleBar(s, "Safe data by design: the synthetic-data pipeline", "Lesson 8 · Governance");
  bullets(s, [
    { text: "The safest patient data is data that was never real. De-identify at the SOURCE, by default.", bold: true },
  ], { y: 1.55, h: 0.7 });
  codeBlock(s, [
    "  1. Encode every MRN     (encode_mrn)   before storage/output",
    "  2. Encrypt every name   (encrypt_name) before any output",
    "  3. Keys in a vault, never in code",
    "  4. Evaluate on a frozen, governed deceased-patient cohort",
  ].join("\n"), { y: 2.4, h: 1.9, label: "The four rules — the same crypto as your Session 11 app" });
  calloutBox(s, "Scanner + generator", "Scan a real-style note → many findings. Scan the generator's synthetic output → ZERO. Same rules, nothing to find. That round trip is the whole lesson.", GREEN, { y: 4.7, h: 0.95, bg: "F0FDF4" });
  footer(s, n++);
})();

// --- L9 azure hardening ---
(function l9() {
  const s = newSlide();
  titleBar(s, "The cloud, hardened: resource group to teardown", "Lesson 9 · Cloud");
  codeBlock(s, [
    "01  Resource group     a box that holds everything",
    "02  Hardened VM        SSH-key login, non-root, patched image",
    "03  Lock the NSG       443 → public, 22 → you, rest SHUT",
    "04  Serve a page       nginx (443 + cert for real traffic)",
    "05  Verify             page loads; audit the open doors",
    "99  DELETE EVERYTHING  one command erases the whole box",
  ].join("\n"), { y: 1.8, h: 2.4, fontSize: 12, label: "The full lifecycle in Azure Cloud Shell (instructor-led + replay runbook)" });
  bullets(s, [
    { text: "SSH key = a secret no one can phish. NSG = Lesson 1's reception desk, written down.", bold: true, color: SKY },
    { text: "Then ask an AI: 'what's still exposed?' — the cheapest security review you'll ever run.", sub: true },
  ], { y: 4.4, h: 1.1, lineSpacing: 24 });
  calloutBox(s, "Delete it", "A running VM is a bill that never sleeps AND a 24/7 attack surface. The most secure server is one that no longer exists.", RED, { y: 5.7, h: 0.85, bg: "FEF2F2" });
  footer(s, n++);
})();

// ===================================================================
// CLOSE
// ===================================================================

// --- cheat sheet ---
(function cheat() {
  const s = newSlide();
  titleBar(s, "Lock-down reference — one page", "Cheat Sheet");
  bullets(s, [
    { text: "Open the minimum (443 public; 22 your IP; rest shut).", bold: true },
    { text: "Encrypt in transit (HTTPS) AND at rest. Never roll your own crypto.", sub: true },
    { text: "Patch · least privilege · segmentation · tested backups break the attack chain.", sub: true },
    { text: "Passphrase, never reuse, MFA (hardware key > app > SMS).", sub: true },
    { text: "PHI = health info + identifier. De-id ≠ encryption ≠ access control.", sub: true },
    { text: "Safe by design: encode every MRN, encrypt every name, keys in a vault, use synthetic data.", sub: true },
    { text: "Log in with keys, and DELETE what you don't need.", sub: true },
  ], { y: 1.7, h: 4.8, lineSpacing: 28 });
  footer(s, n++);
})();

// --- closing ---
(function closing() {
  const s = newSlide();
  s.background = { color: NAVY };
  s.addShape("rect", { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: NAVY }, line: { type: "none" } });
  s.addShape("rect", { x: 0, y: 5.7, w: 13.333, h: 0.04, fill: { color: ACCENT }, line: { type: "none" } });

  s.addText("You know what the front door is made of.", {
    x: 0.7, y: 2.3, w: 12, h: 0.8, fontFace: SANS, fontSize: 32, color: "FFFFFF", bold: true,
  });
  s.addText("A public system with real patient data is a different universe from a demo.", {
    x: 0.7, y: 3.1, w: 12, h: 0.8, fontFace: SANS, fontSize: 22, color: ACCENT, bold: true,
  });
  s.addText("network → encryption → attacks → defenses → PHI → safe-by-design → hardened cloud", {
    x: 0.7, y: 4.4, w: 12, h: 0.6, fontFace: SERIF, fontSize: 17, color: "94A3B8", italic: true,
  });
  s.addText("Ship demos freely. Ship patient data only through the front door governance builds.", {
    x: 0.7, y: 6.0, w: 12, h: 0.6, fontFace: SANS, fontSize: 20, color: "FFFFFF",
  });
  s.addText("CCI · Session 12 · Iyad Sultan, MD · AI Office, KHCC · 2026", {
    x: 0.7, y: 6.9, w: 12, h: 0.3, fontFace: SANS, fontSize: 10, color: "64748B",
  });
})();

// ---------- Save ----------

const out = path.join(__dirname, "Session_12_Locking_the_Front_Door.pptx");
pres.writeFile({ fileName: out }).then((f) => {
  console.log("Wrote", f);
});
