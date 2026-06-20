import { useState } from "react";

// ── Font injection ──────────────────────────────────────────────────────────
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  button { font-family: inherit; cursor: pointer; }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.10) !important; }
  input[type=range] { cursor: pointer; }
`;
if (!document.head.querySelector("[data-pfa-style]")) {
  styleTag.setAttribute("data-pfa-style", "1");
  document.head.appendChild(styleTag);
}

const serif = "'Lora', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";
const mono  = "'DM Mono', monospace";

// ── Design tokens ───────────────────────────────────────────────────────────
const T = {
  cream: "#faf8f4", white: "#ffffff", faint: "#f1f5f9",
  ink: "#1c1917", inkLight: "#44403c", muted: "#78716c",
  border: "#e7e4df", borderDk: "#d6d3ce",
  blue: "#2563eb",   blueL:   "#eff6ff",   blueMid: "#bfdbfe",
  teal: "#0d9488",   tealL:   "#f0fdfa",
  orange: "#ea580c", orangeL: "#fff7ed",
  purple: "#7c3aed", purpleL: "#f5f3ff",
  green: "#16a34a",  greenL:  "#f0fdf4",
  red: "#dc2626",    redL:    "#fef2f2",
  yellow: "#ca8a04", yellowL: "#fefce8",
};

// ── Primitives ───────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: "22px 24px", ...style }}>
      {children}
    </div>
  );
}
function Callout({ icon, color = T.blue, bg, children, style = {} }) {
  return (
    <div style={{ background: bg || T.blueL, border: `1px solid ${color}30`, borderLeft: `4px solid ${color}`, borderRadius: "0 12px 12px 0", padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", ...style }}>
      {icon && <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <div style={{ fontSize: 13.5, color: T.inkLight, lineHeight: 1.75, fontFamily: sans }}>{children}</div>
    </div>
  );
}
function Analogy({ children }) {
  return (
    <div style={{ background: T.yellowL, border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", fontSize: 13.5, color: T.inkLight, lineHeight: 1.75, fontFamily: sans }}>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: T.yellow, marginRight: 8 }}>💡 ANALOGY</span>
      {children}
    </div>
  );
}
function SectionHeading({ label, color = T.blue }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 4, height: 24, background: color, borderRadius: 2 }} />
      <span style={{ fontFamily: serif, fontSize: 20, color: T.ink, fontWeight: 600 }}>{label}</span>
    </div>
  );
}
function SubHeading({ children, color = T.blue }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase", color, marginBottom: 8 }}>
      {children}
    </div>
  );
}
function Prose({ children, style = {} }) {
  return <p style={{ fontSize: 14, color: T.inkLight, lineHeight: 1.85, fontFamily: sans, ...style }}>{children}</p>;
}
function CheckItem({ done, children, color }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{done ? "✅" : "⬜"}</span>
      <span style={{ fontSize: 13, color: T.inkLight, fontFamily: sans, lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

// ── TABS config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  icon: "🏠", label: "Security Overview",  short: "the big picture",  color: T.blue,
    intro: "Security isn't optional — it's the foundation everything else rests on. This interactive guide walks you through the 16 core security principles that every AIDI app and pipeline must satisfy, from the simplest Django view to the most complex Databricks pipeline handling patient data." },
  { id: "secrets",   icon: "🔐", label: "Secrets & Auth",     short: "credentials & login", color: T.teal,
    intro: "Hardcoded credentials are the single most common cause of security breaches. This tab covers how to manage secrets safely using Azure Key Vault and Managed Identity, how Django stores passwords securely, and what makes a cookie 'secure' in the technical sense." },
  { id: "input",     icon: "🛡️", label: "Input & SQL Safety",  short: "validation & injection", color: T.orange,
    intro: "Every piece of data that enters your system from the outside world is untrusted until proven otherwise. This tab covers input validation, sanitization against XSS attacks, and SQL injection — all of which are prevented by Django's ORM when used correctly." },
  { id: "api",       icon: "🌐", label: "API & Headers",       short: "endpoints & policies",  color: T.purple,
    intro: "Your API endpoints are the public doors into your application. This tab covers CSRF protection for forms, CORS policies for cross-origin requests, security headers that tell browsers how to behave, and rate limiting to prevent abuse." },
  { id: "phi",       icon: "🏥", label: "PHI & Healthcare",    short: "patient data rules",    color: T.green,
    intro: "KHCC handles real patient data — MRNs, diagnoses, names, and dates of birth. The rules here are not optional: PHI must be encrypted at rest, never appear in log files, and never leak into error messages. This tab covers the healthcare-specific requirements that sit on top of standard security." },
  { id: "pipelines", icon: "☁️", label: "Pipelines & Azure",   short: "databricks & cloud",    color: T.red,
    intro: "Databricks notebooks are where most AIDI pipelines live — and they have unique security pitfalls. Credentials hardcoded in notebook cells, PHI in print() statements, and plain-text MRNs written to Delta tables are the most common failures. This tab covers the correct patterns for every AIDI pipeline." },
];

// ── Tab 1: Overview ──────────────────────────────────────────────────────────
function OverviewTab() {
  const [open, setOpen] = useState(null);
  const principles = [
    { icon: "🔒", title: "HTTPS Everywhere", risk: "HIGH", desc: "All traffic must be encrypted in transit. SECURE_SSL_REDIRECT = True in production settings ensures Django redirects any HTTP request to HTTPS automatically." },
    { icon: "✅", title: "Input Validation & Sanitization", risk: "HIGH", desc: "Every value coming from a user — form fields, URL parameters, API payloads — must be validated against an expected schema before use. Django Forms and DRF Serializers do this automatically when used correctly." },
    { icon: "🚫", title: "No Sensitive Data in Browser", risk: "HIGH", desc: "Never store tokens, session IDs, or patient data in localStorage or client-side JavaScript. These are readable by any script on the page. Use httpOnly cookies instead." },
    { icon: "🛡️", title: "CSRF Protection", risk: "MEDIUM", desc: "Cross-Site Request Forgery tricks a logged-in user's browser into submitting a form to your app. The fix is a CSRF token — a secret value embedded in every form that an attacker can't know. Django does this automatically; don't disable it." },
    { icon: "🔑", title: "No Secrets in Client-Side Code", risk: "CRITICAL", desc: "API keys, database passwords, and encryption keys must never appear in frontend code or notebook cells. Anyone who uses your app can inspect the network requests and see them. Use environment variables or Azure Key Vault." },
    { icon: "👤", title: "Authentication & Password Storage", risk: "HIGH", desc: "Passwords must never be stored in plain text. Django uses Argon2/PBKDF2 to convert passwords into one-way hashes. Even if the database is compromised, attackers cannot recover the original passwords." },
    { icon: "🎫", title: "Authorization Checks", risk: "HIGH", desc: "Authentication asks 'who are you?' Authorization asks 'are you allowed to do this?' Every endpoint must verify the user has permission for the specific object they're accessing, not just that they're logged in." },
    { icon: "🔌", title: "API Endpoint Protection", risk: "HIGH", desc: "All API endpoints must require authentication. CORS must be configured to only allow requests from your own domains. Rate limiting prevents brute-force and abuse." },
    { icon: "💉", title: "SQL Injection Prevention", risk: "CRITICAL", desc: "Never build SQL queries by concatenating user input as strings. An attacker can inject their own SQL commands and read or delete your entire database. Django's ORM prevents this automatically — raw SQL must use parameterized queries." },
    { icon: "📋", title: "Security Headers", risk: "MEDIUM", desc: "HTTP headers like Content-Security-Policy, X-Frame-Options, and X-Content-Type-Options tell the browser how to handle your pages securely. They prevent clickjacking, MIME sniffing, and script injection from external domains." },
    { icon: "🌊", title: "DoS Protection", risk: "MEDIUM", desc: "Distributed Denial of Service attacks flood your app with requests until it crashes. Azure WAF and Google Cloud Armor handle network-level protection. Rate limiting at the application level provides an additional layer." },
    { icon: "📦", title: "Keep Dependencies Updated", risk: "MEDIUM", desc: "Most real-world breaches exploit known vulnerabilities in outdated libraries, not novel attacks. Run pip-audit and npm audit regularly. Subscribe to security advisories for your key dependencies." },
    { icon: "🚨", title: "Proper Error Handling", risk: "MEDIUM", desc: "Error messages and stack traces must never be shown to users in production. They reveal internal structure — file paths, library versions, database schemas — that attackers use to craft targeted attacks. Log details server-side only." },
    { icon: "🍪", title: "Secure Cookies", risk: "HIGH", desc: "Session cookies must have three attributes: HttpOnly (JavaScript can't read them), Secure (HTTPS only), and SameSite=Lax (CSRF mitigation). For KHCC, session lifetime must not exceed 8 hours." },
    { icon: "📎", title: "File Upload Security", risk: "HIGH", desc: "File uploads are a common vector for malicious code execution. Validate file type (extension AND MIME type), enforce size limits, and never use user-supplied filenames as file paths. Store uploads outside the Django project directory." },
    { icon: "⚡", title: "Rate Limiting", risk: "MEDIUM", desc: "All endpoints, especially login and password reset, must be rate-limited. Without it, attackers can make millions of login attempts per hour. DRF's throttling system or django-ratelimit provide per-IP and per-user limits." },
  ];

  const critCount = principles.filter(p => p.risk === "CRITICAL").length;
  const highCount = principles.filter(p => p.risk === "HIGH").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "CRITICAL", count: critCount, color: T.red, bg: T.redL, desc: "Blocks deployment" },
          { label: "HIGH", count: highCount, color: T.orange, bg: T.orangeL, desc: "Fix before go-live" },
          { label: "MEDIUM", count: principles.length - critCount - highCount, color: T.purple, bg: T.purpleL, desc: "Fix in next sprint" },
        ].map(s => (
          <Card key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.color}40`, textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1.2, color: s.color, margin: "4px 0" }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: T.muted, fontFamily: sans }}>{s.desc}</div>
          </Card>
        ))}
      </div>

      <Analogy>
        Think of app security like a hospital building: HTTPS is the locked front door, authentication is the ID badge reader, authorization is the room-by-room access card, and SQL injection prevention is the reason you can't walk into a supply closet and steal the master keys. Each layer is independent — failing one can compromise everything downstream.
      </Analogy>

      <Card>
        <SectionHeading label="The 16 Principles — Click to Explore" color={T.blue} />
        <Prose style={{ marginBottom: 16 }}>Each of the 16 items below is a distinct security requirement. Click any to see what it means, why it matters, and what the fix looks like. The ones marked CRITICAL block deployment — they must be resolved before any AIDI system goes live.</Prose>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {principles.map((p, i) => (
            <div key={i} className="hover-lift" onClick={() => setOpen(open === i ? null : i)} style={{ background: open === i ? T.blueL : T.white, border: `1.5px solid ${open === i ? T.blue : T.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.22s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, fontFamily: sans }}>{p.title}</span>
                </div>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: p.risk === "CRITICAL" ? T.red : p.risk === "HIGH" ? T.orange : T.purple, background: p.risk === "CRITICAL" ? T.redL : p.risk === "HIGH" ? T.orangeL : T.purpleL, padding: "2px 8px", borderRadius: 20 }}>{p.risk}</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: T.muted }}>{open === i ? "▲" : "▼"}</span>
              </div>
              {open === i && (
                <div className="fade-in" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.blue}30` }}>
                  <Prose style={{ fontSize: 13 }}>{p.desc}</Prose>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Callout icon="🎯" color={T.blue} bg={T.blueL}>
        <strong>Key insight:</strong> Security is not a feature you add at the end — it's a set of constraints you design around from the start. The good news: Django and Azure handle most of these automatically when configured correctly. Your job is to not accidentally turn them off.
      </Callout>
    </div>
  );
}

// ── Tab 2: Secrets & Auth ────────────────────────────────────────────────────
function SecretsTab() {
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [checklist, setChecklist] = useState({});

  const secretMethods = [
    { label: "❌ Hardcoded", color: T.red, bg: T.redL, bad: true,
      code: `# NEVER DO THIS\nSECRET_KEY = "my-django-secret-123"\napi_key = "sk-openai-xxxx"\nSQL_PASSWORD = "P@ssw0rd"`,
      explain: "Hardcoded secrets appear in version control forever. Even if you delete them later, they remain in git history. Anyone with repo access — or who finds a leaked repo — has your credentials." },
    { label: "✅ Environment Variables", color: T.teal, bg: T.tealL, bad: false,
      code: `import os\n\nSECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')\nif not SECRET_KEY:\n    raise ImproperlyConfigured(\n        'DJANGO_SECRET_KEY not set'\n    )`,
      explain: "Environment variables are set outside your code and not committed to git. This is the minimum acceptable pattern. The explicit check ensures the app fails loudly if the variable is missing, rather than running with an empty secret." },
    { label: "🏆 Azure Key Vault + Managed Identity", color: T.green, bg: T.greenL, bad: false,
      code: `from azure.identity import ManagedIdentityCredential\nfrom azure.keyvault.secrets import SecretClient\n\ncredential = ManagedIdentityCredential()\nclient = SecretClient(\n    vault_url="https://khcc-aidi-kv.vault.azure.net/",\n    credential=credential\n)\nsecret = client.get_secret("django-secret-key").value`,
      explain: "Managed Identity means your Azure App Service has an identity that Key Vault trusts — no passwords needed at all. This is the AIDI gold standard: no credentials in code, no credentials in environment variables, no credentials anywhere a human can read them." },
  ];

  const checks = [
    "No hardcoded API keys, tokens, or passwords in any .py, .env, .yml, or .json file",
    "All secrets accessed via os.environ or Azure Key Vault SDK",
    ".env files listed in .gitignore",
    "Argon2 password hasher configured as primary hasher",
    "SESSION_COOKIE_AGE ≤ 28800 (8 hours — KHCC healthcare policy)",
    "SESSION_COOKIE_SECURE = True",
    "SESSION_COOKIE_HTTPONLY = True",
    "SESSION_COOKIE_SAMESITE = 'Lax' or 'Strict'",
    "JWT tokens stored in httpOnly cookies — not localStorage",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <SectionHeading label="How to Store Secrets" color={T.teal} />
        <Prose>A secret is any value that grants access to something: database passwords, API keys, Django's SECRET_KEY, encryption keys. The rule is absolute — secrets must never appear in source code. The question is where they <em>should</em> live. There are three tiers, from worst to best.</Prose>
        <div style={{ marginTop: 20 }}>
          <SubHeading color={T.teal}>STEP 1 — CHOOSE A PATTERN</SubHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
            {secretMethods.map((m, i) => (
              <button key={i} className="hover-lift" onClick={() => setSelectedMethod(i)} style={{ background: selectedMethod === i ? m.bg : T.white, border: `2px solid ${selectedMethod === i ? m.color : T.border}`, borderRadius: 12, padding: "12px 10px", transition: "all 0.2s", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, fontFamily: mono, color: selectedMethod === i ? m.color : T.muted }}>{m.label}</div>
              </button>
            ))}
          </div>
          <div className="fade-in" key={selectedMethod} style={{ background: secretMethods[selectedMethod].bg, border: `1.5px solid ${secretMethods[selectedMethod].color}50`, borderRadius: 14, padding: "20px 22px" }}>
            <SubHeading color={secretMethods[selectedMethod].color}>STEP 2 — SEE THE CODE</SubHeading>
            <pre style={{ fontFamily: mono, fontSize: 12, color: secretMethods[selectedMethod].bad ? T.red : T.ink, background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", overflowX: "auto", lineHeight: 1.7, marginBottom: 14 }}>
              {secretMethods[selectedMethod].code}
            </pre>
            <SubHeading color={secretMethods[selectedMethod].color}>STEP 3 — WHY THIS MATTERS</SubHeading>
            <Prose style={{ fontSize: 13 }}>{secretMethods[selectedMethod].explain}</Prose>
          </div>
        </div>
      </Card>

      <Analogy>
        Think of secrets like a hospital's master key. You wouldn't print the key code on the front door. You wouldn't write it in the maintenance log that every contractor can read. You'd store it in a locked cabinet with an access log. Azure Key Vault is that cabinet — with the added benefit that the cabinet authenticates the app automatically, so no one even needs to know the combination.
      </Analogy>

      <Card>
        <SectionHeading label="Password Hashing — Why Plain Text is Catastrophic" color={T.teal} />
        <Prose>When a user sets a password, your database must store a hash — a one-way mathematical transformation — not the password itself. If an attacker steals your database, they get hashes they can't reverse. Django uses Argon2 (when configured) or PBKDF2 by default. Configure the strongest available.</Prose>
        <div style={{ background: T.faint, borderRadius: 10, padding: "16px", marginTop: 16, fontFamily: mono, fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
          <div style={{ color: T.muted, marginBottom: 8 }}># settings/production.py</div>
          <div>PASSWORD_HASHERS = [</div>
          <div style={{ paddingLeft: 20, color: T.teal }}>'django.contrib.auth.hashers.Argon2PasswordHasher',</div>
          <div style={{ paddingLeft: 20, color: T.muted }}>'django.contrib.auth.hashers.PBKDF2PasswordHasher',</div>
          <div>]</div>
        </div>
      </Card>

      <Card>
        <SectionHeading label="Secrets & Auth Checklist" color={T.teal} />
        <SubHeading color={T.teal}>STEP 1 — CHECK OFF EACH ITEM BEFORE DEPLOYMENT</SubHeading>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {checks.map((c, i) => (
            <div key={i} onClick={() => setChecklist(p => ({ ...p, [i]: !p[i] }))} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{checklist[i] ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 13, color: T.inkLight, fontFamily: sans, lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 11, color: T.teal }}>
          {Object.values(checklist).filter(Boolean).length} / {checks.length} complete
        </div>
      </Card>

      <Callout icon="🔐" color={T.teal} bg={T.tealL}>
        <strong>Key insight:</strong> The goal of Managed Identity is that no human ever needs to know the credential. The App Service authenticates to Key Vault using its Azure identity — like an employee badge that the building recognizes automatically, rather than a password someone types.
      </Callout>
    </div>
  );
}

// ── Tab 3: Input & SQL ───────────────────────────────────────────────────────
function InputTab() {
  const [attack, setAttack] = useState(0);
  const [inputVal, setInputVal] = useState("O'Brien");

  const attacks = [
    { label: "SQL Injection", icon: "💉", color: T.orange,
      bad: `# ❌ VULNERABLE\ndef get_user(email):\n    query = f"SELECT * FROM users WHERE email = '{email}'"\n    return db.execute(query)\n\n# Attacker enters: ' OR '1'='1\n# Becomes: ...WHERE email = '' OR '1'='1'\n# Returns every user in the database`,
      good: `# ✅ SAFE — Django ORM\ndef get_user(email):\n    return User.objects.filter(email__iexact=email)\n\n# Or with raw SQL:\nUser.objects.raw(\n    'SELECT * FROM users WHERE email = %s',\n    [email]  # Parameter — never interpolated\n)`,
      explain: "SQL injection inserts SQL syntax into user input. The database can't tell where the query ends and the data begins if they're concatenated as strings. Parameterized queries keep them separate — the database treats the parameter as pure data, never as executable code." },
    { label: "XSS Attack", icon: "📜", color: T.red,
      bad: `# ❌ VULNERABLE — Template\n{{ user_comment|safe }}\n\n# ❌ VULNERABLE — Python\nfrom django.utils.safestring import mark_safe\ndef render(comment):\n    return mark_safe(comment)  # Never do this with user input`,
      good: `# ✅ SAFE — Django auto-escapes by default\n{{ user_comment }}\n\n# ✅ If you must render HTML, sanitize first:\nfrom django.utils.html import escape, format_html\n\ndef render(comment):\n    return format_html('<p>{}</p>', escape(comment))`,
      explain: "Cross-Site Scripting (XSS) injects malicious JavaScript into your page. When another user loads the page, their browser executes the attacker's script — stealing cookies, redirecting them, or worse. Django auto-escapes template variables by default. Never use |safe on user-supplied content." },
    { label: "Mass Assignment", icon: "📦", color: T.purple,
      bad: `# ❌ VULNERABLE — accepts ANY field\nclass UserSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = User\n        fields = '__all__'  # Attacker can set is_admin=True`,
      good: `# ✅ SAFE — explicit field list\nclass UserSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = User\n        fields = ['email', 'name', 'phone']\n        read_only_fields = ['is_admin', 'is_staff']`,
      explain: "Mass assignment lets an attacker set any field on a model, including ones you didn't intend to expose — like is_admin or role. Always specify fields explicitly in ModelForms and DRF Serializers. Never use __all__ in production serializers." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <SectionHeading label="The Three Input Attacks" color={T.orange} />
        <Prose>Every piece of data entering your app is a potential attack vector. The three most common attacks — SQL injection, XSS, and mass assignment — all share the same root cause: the app trusts user input more than it should. Click each to see the vulnerable pattern and the fix.</Prose>
        <div style={{ marginTop: 20 }}>
          <SubHeading color={T.orange}>STEP 1 — CHOOSE AN ATTACK TYPE</SubHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {attacks.map((a, i) => (
              <button key={i} className="hover-lift" onClick={() => setAttack(i)} style={{ background: attack === i ? T.orangeL : T.white, border: `2px solid ${attack === i ? a.color : T.border}`, borderRadius: 12, padding: "14px 10px", transition: "all 0.2s", textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{a.icon}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: attack === i ? a.color : T.muted, marginTop: 6 }}>{a.label}</div>
              </button>
            ))}
          </div>
          <div className="fade-in" key={attack} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <SubHeading color={T.red}>❌ VULNERABLE PATTERN</SubHeading>
              <pre style={{ fontFamily: mono, fontSize: 12, color: T.red, background: T.redL, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "14px 16px", overflowX: "auto", lineHeight: 1.7 }}>
                {attacks[attack].bad}
              </pre>
            </div>
            <div>
              <SubHeading color={T.green}>✅ SAFE PATTERN</SubHeading>
              <pre style={{ fontFamily: mono, fontSize: 12, color: T.green, background: T.greenL, border: `1px solid ${T.green}30`, borderRadius: 8, padding: "14px 16px", overflowX: "auto", lineHeight: 1.7 }}>
                {attacks[attack].good}
              </pre>
            </div>
            <Callout icon="💡" color={attacks[attack].color} bg={T.orangeL}>
              <strong>Why this works:</strong> {attacks[attack].explain}
            </Callout>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading label="Live: SQL Injection Demo" color={T.orange} />
        <SubHeading color={T.orange}>STEP 2 — TRY A PAYLOAD</SubHeading>
        <Prose style={{ marginBottom: 14 }}>Type in the input below and see how a vulnerable query versus a parameterized query handles your input. Try entering: <span style={{ fontFamily: mono, background: T.faint, padding: "1px 6px", borderRadius: 4 }}>O'Brien</span> or <span style={{ fontFamily: mono, background: T.faint, padding: "1px 6px", borderRadius: 4 }}>'; DROP TABLE users;--</span></Prose>
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Enter a name or attack payload..." style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: mono, color: T.ink, outline: "none", marginBottom: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <SubHeading color={T.red}>❌ Vulnerable query</SubHeading>
            <div style={{ fontFamily: mono, fontSize: 12, background: T.redL, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.8, wordBreak: "break-all", color: T.red }}>
              SELECT * FROM users<br />WHERE name = '<strong>{inputVal}</strong>'
            </div>
            {inputVal.includes("'") && <div style={{ marginTop: 8, fontSize: 12, color: T.red, fontFamily: sans }}>⚠️ Quote character breaks the query syntax!</div>}
          </div>
          <div>
            <SubHeading color={T.green}>✅ Parameterized query</SubHeading>
            <div style={{ fontFamily: mono, fontSize: 12, background: T.greenL, border: `1px solid ${T.green}30`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.8, color: T.green }}>
              SELECT * FROM users<br />WHERE name = <strong>%s</strong><br /><br />
              <span style={{ color: T.muted }}>Params: ["{inputVal}"]</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: T.green, fontFamily: sans }}>✓ Input treated as pure data, never executed</div>
          </div>
        </div>
      </Card>

      <Analogy>
        SQL injection is like ordering at a restaurant by writing your order on a notepad and handing it to the kitchen. If you write "Burger and also FIRE THE HEAD CHEF", a naive kitchen might execute both instructions. A parameterized query is the waiter who reads your notepad but only passes the food order to the kitchen — the editorial commentary gets ignored.
      </Analogy>

      <Callout icon="🛡️" color={T.orange} bg={T.orangeL}>
        <strong>Key insight:</strong> Django's ORM prevents SQL injection automatically for all standard queries. The risk appears only when you use .raw(), .extra(), or cursor.execute() — and even then, the fix is simply to use %s placeholders with a parameters list, never f-strings or .format().
      </Callout>
    </div>
  );
}

// ── Tab 4: API & Headers ─────────────────────────────────────────────────────
function ApiTab() {
  const [headerSel, setHeaderSel] = useState(null);
  const [ratePos, setRatePos] = useState(3);

  const headers = [
    { id: "csp", emoji: "📜", label: "Content-Security-Policy", color: T.purple, bg: T.purpleL,
      simple: "Controls which scripts and resources can load",
      detail: "CSP tells the browser which origins are allowed to serve scripts, stylesheets, images, and fonts on your page. Without it, any injected <script> tag from any domain can run. For AIDI apps: default-src 'self' — only content from your own domain is trusted.",
      example: "Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data:" },
    { id: "xframe", emoji: "🖼️", label: "X-Frame-Options", color: T.blue, bg: T.blueL,
      simple: "Prevents your page from being embedded in iframes",
      detail: "Clickjacking attacks embed your page in an invisible iframe and trick users into clicking on elements without knowing. X-Frame-Options: DENY prevents any framing entirely. Set this to DENY on all AIDI apps — there's no legitimate reason for them to be embedded elsewhere.",
      example: "X-Frame-Options: DENY" },
    { id: "nosniff", emoji: "👃", label: "X-Content-Type-Options", color: T.teal, bg: T.tealL,
      simple: "Stops browsers from guessing file types",
      detail: "Browsers can 'sniff' file content and decide it's a different type than declared — turning an uploaded text file into executable JavaScript. X-Content-Type-Options: nosniff forces the browser to trust the declared Content-Type and not improvise. SECURE_CONTENT_TYPE_NOSNIFF = True enables this in Django.",
      example: "X-Content-Type-Options: nosniff" },
    { id: "hsts", emoji: "🔒", label: "Strict-Transport-Security", color: T.green, bg: T.greenL,
      simple: "Forces HTTPS for future visits — even before a redirect",
      detail: "HTTPS redirect happens server-side, but the first request can be HTTP. HSTS tells the browser to always use HTTPS for your domain from now on — stored in the browser, not negotiated each visit. SECURE_HSTS_SECONDS = 31536000 (1 year) is the AIDI requirement.",
      example: "Strict-Transport-Security: max-age=31536000; includeSubDomains" },
    { id: "referrer", emoji: "🔗", label: "Referrer-Policy", color: T.orange, bg: T.orangeL,
      simple: "Controls what URL is shared when users click links",
      detail: "When a user clicks a link from your app to an external site, the Referrer header can reveal the full URL — including path parameters that might contain patient IDs. strict-origin-when-cross-origin sends only the domain to external sites, never the full path.",
      example: "Referrer-Policy: strict-origin-when-cross-origin" },
  ];

  const rateLabels = ["No limit ❌", "1000/day", "500/day", "100/day ✅", "10/hour (login)"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <SectionHeading label="Security Headers — Clickable Reference" color={T.purple} />
        <Prose style={{ marginBottom: 16 }}>Security headers are instructions your server sends to the browser about how to handle your page. They're a second line of defense against injection and framing attacks — if your code has a bug, headers can limit the damage. Click each header to understand what it does.</Prose>
        <SubHeading color={T.purple}>STEP 1 — CLICK ANY HEADER TO EXPLORE</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {headers.map((h, i, arr) => (
              <div key={h.id}>
                <button className="hover-lift" onClick={() => setHeaderSel(headerSel === h.id ? null : h.id)} style={{ width: "100%", background: headerSel === h.id ? h.bg : T.white, border: `1.5px solid ${headerSel === h.id ? h.color : T.border}`, borderRadius: 10, padding: "12px 14px", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
                  <span style={{ fontSize: 18 }}>{h.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: headerSel === h.id ? h.color : T.ink, fontFamily: mono }}>{h.label}</div>
                    <div style={{ fontSize: 11, color: T.muted, fontFamily: sans, marginTop: 2 }}>{h.simple}</div>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 10, color: headerSel === h.id ? h.color : T.muted }}>{headerSel === h.id ? "▲" : "▼"}</span>
                </button>
                {i < arr.length - 1 && <div style={{ display: "flex", justifyContent: "center", margin: "1px 0" }}><div style={{ width: 2, height: 8, background: T.border }} /></div>}
              </div>
            ))}
          </div>
          <div style={{ position: "sticky", top: 20 }}>
            {headerSel ? (() => { const h = headers.find(x => x.id === headerSel); return (
              <div className="fade-in" style={{ background: h.bg, border: `1.5px solid ${h.color}50`, borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{h.emoji}</div>
                <SubHeading color={h.color}>{h.label}</SubHeading>
                <Prose style={{ fontSize: 13, marginBottom: 14 }}>{h.detail}</Prose>
                <div style={{ fontFamily: mono, fontSize: 11, background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: h.color, wordBreak: "break-all" }}>{h.example}</div>
              </div>
            ); })() : (
              <div style={{ background: T.cream, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, textAlign: "center" }}>
                <div style={{ fontSize: 36 }}>👈</div>
                <Prose style={{ fontSize: 13, marginTop: 10 }}>Click any header to see its explanation and example value</Prose>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading label="Rate Limiting — Visualized" color={T.purple} />
        <Prose style={{ marginBottom: 14 }}>Rate limiting caps how many requests a single IP or user can make in a time window. Without it, an attacker can make millions of login attempts per hour. Drag the slider to see how different limits affect protection versus usability.</Prose>
        <SubHeading color={T.purple}>STEP 2 — ADJUST THE RATE LIMIT</SubHeading>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: T.purple, minWidth: 120 }}>{rateLabels[ratePos]}</div>
          <input type="range" min={0} max={4} value={ratePos} onChange={e => setRatePos(Number(e.target.value))} style={{ flex: 1, accentColor: T.purple, height: 6 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {["Brute force possible", "Slows attackers", "Balanced protection", "AIDI recommended ✅", "Login endpoint ✅"].map((label, i) => (
            <div key={i} style={{ background: i === ratePos ? T.purpleL : T.faint, border: `1.5px solid ${i === ratePos ? T.purple : T.border}`, borderRadius: 10, padding: "12px 8px", textAlign: "center", transition: "all 0.22s" }}>
              <div style={{ fontSize: 11, color: i === ratePos ? T.purple : T.muted, fontFamily: sans, lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Analogy>
        CORS (Cross-Origin Resource Sharing) is like a bouncer at a private club. Your API is the club. When a browser from a different domain tries to call your API, it first asks the bouncer "is this domain on the list?" CORS_ALLOWED_ORIGINS is the list. If the domain isn't on it, the bouncer turns the request away before it even reaches your API code. CORS_ALLOW_ALL_ORIGINS = True removes the bouncer entirely — never do this.
      </Analogy>

      <Callout icon="🌐" color={T.purple} bg={T.purpleL}>
        <strong>Key insight:</strong> A missing security header is not a bug in your code — it's the absence of a protection your browser expects. Django's SecurityMiddleware adds most of these automatically when the corresponding settings (SECURE_HSTS_SECONDS, SECURE_CONTENT_TYPE_NOSNIFF, X_FRAME_OPTIONS) are set in production settings.
      </Callout>
    </div>
  );
}

// ── Tab 5: PHI & Healthcare ──────────────────────────────────────────────────
function PhiTab() {
  const [checklist, setChecklist] = useState({});
  const [logSel, setLogSel] = useState(null);

  const logExamples = [
    { icon: "❌", label: "PHI in log — CRITICAL VIOLATION", color: T.red, bg: T.redL,
      code: `logger.info(f"Processing patient {patient_name} MRN {mrn}")\nprint(f"AKI Stage 3: {patient_name}, DOB {dob}")\nlogger.debug(f"Diagnosis: {diagnosis} for {name}")`,
      explain: "Log files are often stored unencrypted, rotated to disk, and accessible to more people than the patient record system. PHI in logs creates a secondary breach surface — and may violate Jordanian healthcare data regulations." },
    { icon: "✅", label: "Safe logging pattern", color: T.green, bg: T.greenL,
      code: `# Encode MRN, never log names\nfrom src.utils.optimus import encode_mrn\n\nlogger.info(\n    "Processing encoded MRN: %s — stage: %s",\n    encode_mrn(mrn),   # Reversible but pseudonymized\n    aki_stage          # Clinical value, not a name\n)`,
      explain: "Optimus encoding converts the real MRN to a pseudonymized ID that can be reversed by authorized systems, but isn't meaningful to anyone who reads the log file. Clinical values (stage, lab results) without a patient name are generally safe to log." },
  ];

  const phiChecks = [
    "No patient names, MRNs, dates of birth, or diagnoses appear in any log file",
    "PHI encrypted with Fernet before writing to Delta tables or Azure SQL",
    "Optimus encoding applied to all MRNs at rest",
    "Plain PHI columns dropped before writing to Delta (PatientName, MRN dropped after encryption)",
    "Error messages shown to users contain no patient data",
    "No PHI in ACS email subject lines",
    "Django SESSION_COOKIE_AGE ≤ 28800 (8 hours — healthcare policy maximum)",
    "HTTPS enforced — SECURE_SSL_REDIRECT = True",
    "All external API calls use https:// (not http://)",
    "file upload paths use sanitized names — not user-supplied filenames",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Callout icon="⚕️" color={T.green} bg={T.greenL} style={{ marginBottom: 4 }}>
        <strong>Why healthcare data is different:</strong> A leaked credit card can be cancelled. A leaked cancer diagnosis, HIV status, or mental health record can affect employment, insurance, relationships, and personal safety for years — or permanently. KHCC patients trust the institution with the most sensitive information in their lives. That trust is non-negotiable.
      </Callout>

      <Card>
        <SectionHeading label="PHI in Logs — The Hidden Breach Surface" color={T.green} />
        <Prose>The most common PHI leak in AIDI pipelines is not a database breach — it's a print() statement or logger.info() call left in from debugging. Log files are stored differently from clinical data, with weaker access controls and longer retention. Click each pattern to see the violation and the fix.</Prose>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <SubHeading color={T.green}>STEP 1 — COMPARE THE PATTERNS</SubHeading>
          {logExamples.map((ex, i) => (
            <div key={i} className="hover-lift" onClick={() => setLogSel(logSel === i ? null : i)} style={{ background: logSel === i ? ex.bg : T.white, border: `1.5px solid ${logSel === i ? ex.color : T.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.22s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{ex.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: ex.color, fontFamily: sans }}>{ex.label}</span>
                <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 10, color: T.muted }}>{logSel === i ? "▲" : "▼"}</span>
              </div>
              {logSel === i && (
                <div className="fade-in" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${ex.color}30` }}>
                  <pre style={{ fontFamily: mono, fontSize: 12, color: ex.color, background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.7, overflowX: "auto", marginBottom: 12 }}>
                    {ex.code}
                  </pre>
                  <Prose style={{ fontSize: 13 }}>{ex.explain}</Prose>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading label="Encryption at Rest — The Fernet/Optimus Pattern" color={T.green} />
        <Prose>Azure SQL TDE (Transparent Data Encryption) encrypts the database files on disk — but it doesn't protect against someone with database access running a SELECT query. Application-layer encryption with Fernet means even a person with direct database access sees only ciphertext. MRNs use Optimus encoding — a reversible integer obfuscation that keeps the format recognizable.</Prose>
        <div style={{ background: T.faint, borderRadius: 10, padding: "16px", marginTop: 16, fontFamily: mono, fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
          <div style={{ color: T.muted, marginBottom: 8 }}># Before writing any PHI to Delta or Azure SQL:</div>
          <div style={{ color: T.green }}>fernet_key = dbutils.secrets.get(scope="aidi-secrets", key="fernet-key")</div>
          <div>f = Fernet(fernet_key.encode())</div>
          <div style={{ marginTop: 8 }}>df = df.withColumn(<span style={{ color: T.teal }}>"PatientName_enc"</span>, encrypt_udf(<span style={{ color: T.orange }}>"PatientName"</span>))</div>
          <div>df = df.withColumn(<span style={{ color: T.teal }}>"MRN_enc"</span>, optimus_encode_udf(<span style={{ color: T.orange }}>"MRN"</span>))</div>
          <div style={{ color: T.red }}>df = df.drop(<span style={{ color: T.red }}>"PatientName", "MRN"</span>)  <span style={{ color: T.muted }}># Remove plaintext</span></div>
        </div>
      </Card>

      <Analogy>
        PHI encryption is like the difference between locking your filing cabinet and putting the files inside a safe that's inside the cabinet. Azure TDE locks the cabinet. Fernet is the inner safe. Even if someone breaks the cabinet lock (gains database access), they still can't read the documents without the safe combination (the Fernet key, stored separately in Key Vault).
      </Analogy>

      <Card>
        <SectionHeading label="PHI & Healthcare Checklist" color={T.green} />
        <SubHeading color={T.green}>STEP 2 — CHECK OFF BEFORE ANY PIPELINE DEPLOYS</SubHeading>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {phiChecks.map((c, i) => (
            <div key={i} onClick={() => setChecklist(p => ({ ...p, [i]: !p[i] }))} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{checklist[i] ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 13, color: T.inkLight, fontFamily: sans, lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 11, color: T.green }}>
          {Object.values(checklist).filter(Boolean).length} / {phiChecks.length} complete
        </div>
      </Card>
    </div>
  );
}

// ── Tab 6: Pipelines & Azure ─────────────────────────────────────────────────
function PipelinesTab() {
  const [step, setStep] = useState(0);
  const [checklist, setChecklist] = useState({});

  const patterns = [
    { key: "Credentials", icon: "🔑", color: T.red, bg: T.redL,
      label: "No Hardcoded Credentials",
      plain: "Databricks notebook cells are stored in version control, synced to Azure DevOps, and visible to anyone with repo access. A credential in a cell is a credential that is permanently public.",
      bad: `# ❌ NEVER in a notebook cell\nOPENAI_API_KEY = "sk-proj-xxxxx"\nSQL_PASSWORD = "P@ssw0rd123"\nFERNET_KEY = "abc123="`,
      good: `# ✅ CORRECT — Databricks secrets scope\nopenai_key = dbutils.secrets.get(\n    scope="aidi-secrets",\n    key="openai-api-key"\n)\n\n# ✅ For Azure SQL — Managed Identity\n# No credential needed at all` },
    { key: "Managed Identity", icon: "🪪", color: T.teal, bg: T.tealL,
      label: "Managed Identity for Azure SQL",
      plain: "Managed Identity lets your Databricks cluster authenticate to Azure SQL using its Azure identity — no password, no connection string, no secret to rotate or leak.",
      bad: `# ❌ Connection string with password\nconn_str = (\n    "mssql+pyodbc://sa:P@ssword@server/db"\n    "?driver=ODBC+Driver+18+for+SQL+Server"\n)`,
      good: `# ✅ Managed Identity — zero credentials\nconn_str = (\n    "mssql+pyodbc://@khcc-aidi-sql.database.windows.net/AIDI-DB"\n    "?driver=ODBC+Driver+18+for+SQL+Server"\n    "&Authentication=ActiveDirectoryMsi"\n)\nengine = create_engine(conn_str)` },
    { key: "ACS Email", icon: "📧", color: T.orange, bg: T.orangeL,
      label: "ACS Email via Managed Identity",
      plain: "ACS email via Managed Identity replaces the old Gmail SMTP + app password pattern. No password to rotate, no app password to leak, and no dependency on personal Gmail accounts.",
      bad: `# ❌ Old pattern — Gmail SMTP\nimport smtplib\nserver = smtplib.SMTP('smtp.gmail.com', 587)\nserver.login('aidi@gmail.com', 'app_password_here')`,
      good: `# ✅ ACS + Managed Identity\nfrom azure.identity import ManagedIdentityCredential\nfrom azure.communication.email import EmailClient\n\ncredential = ManagedIdentityCredential()\nclient = EmailClient(\n    endpoint="https://khcc-aidi-acs.communication.azure.com",\n    credential=credential\n)` },
    { key: "PHI in Logs", icon: "📋", color: T.purple, bg: T.purpleL,
      label: "No PHI in Notebook Output",
      plain: "Notebook output cells — print() and display() — are saved with the notebook. Anyone who opens the notebook sees the last run's output, including any patient data you printed.",
      bad: `# ❌ PHI visible in notebook output\nprint(f"Patient: {patient_name}, MRN: {mrn}")\ndisplay(df.select("PatientName", "MRN", "Diagnosis"))`,
      good: `# ✅ Aggregate counts or encoded IDs only\nprint(f"Processed {len(df)} records — {n_alerts} alerts")\nprint(f"Encoded MRN: {encode_mrn(mrn)} — stage: {stage}")\n# Never display a DataFrame with raw PHI columns` },
    { key: "Unity Catalog", icon: "📂", color: T.green, bg: T.greenL,
      label: "Least-Privilege Unity Catalog",
      plain: "Unity Catalog controls which service principals can read or write which tables. Grant the minimum permissions needed — read access to silver tables, write access only to the specific gold table the pipeline produces.",
      bad: `# ❌ Wildcard grants — too permissive\n-- GRANT ALL PRIVILEGES ON SCHEMA aidi_catalog.dbo\n--   TO 'pipeline-service-principal'`,
      good: `# ✅ Table-level scoped grants\n-- GRANT SELECT ON aidi_catalog.dbo.silver_er_notes_esi\n--   TO 'er-pipeline-sp';\n-- GRANT INSERT, UPDATE ON aidi_catalog.dbo.gold_er_alerts\n--   TO 'er-pipeline-sp';` },
  ];

  const checks = [
    "No hardcoded credentials in any notebook cell",
    "Managed Identity used for Azure SQL connection (ActiveDirectoryMsi)",
    "Managed Identity used for ACS email (no connection string)",
    "Non-Managed-Identity secrets in dbutils.secrets.get, not hardcoded",
    "PHI encrypted (Fernet/Optimus) before writing to Delta or Azure SQL",
    "Plain PHI columns dropped after encryption — never written to Delta",
    "No patient names or MRNs in print() or logger.* calls",
    "No PHI in ACS email subject lines",
    "Pipeline service principal has table-level grants only — no wildcard",
    "Databricks cluster has Managed Identity enabled",
    "Azure Defender for SQL enabled on AIDI-DB",
    "Storage account has no public blob access",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <SectionHeading label="The 5 Databricks Security Patterns" color={T.red} />
        <Prose style={{ marginBottom: 20 }}>Databricks notebooks have unique security risks that don't apply to Django apps. Most stem from the same problem: notebooks are development environments that get promoted to production without a proper security review. Click through each pattern to see the common mistake and the correct AIDI approach.</Prose>
        <SubHeading color={T.red}>STEP 1 — CHOOSE A PATTERN</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 }}>
          {patterns.map((p, i) => (
            <button key={i} className="hover-lift" onClick={() => setStep(i)} style={{ background: step === i ? p.bg : T.white, border: `2px solid ${step === i ? p.color : T.border}`, borderRadius: 12, padding: "12px 8px", transition: "all 0.2s", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{p.icon}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: step === i ? p.color : T.muted, marginTop: 6, lineHeight: 1.3 }}>{p.key}</div>
            </button>
          ))}
        </div>
        <div className="fade-in" key={step} style={{ background: patterns[step].bg, border: `1.5px solid ${patterns[step].color}40`, borderRadius: 14, padding: "20px 22px" }}>
          <SubHeading color={patterns[step].color}>{patterns[step].label}</SubHeading>
          <Prose style={{ fontSize: 13, marginBottom: 16 }}>{patterns[step].plain}</Prose>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.red, marginBottom: 6, letterSpacing: 1 }}>❌ COMMON MISTAKE</div>
              <pre style={{ fontFamily: mono, fontSize: 11, color: T.red, background: T.white, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {patterns[step].bad}
              </pre>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.green, marginBottom: 6, letterSpacing: 1 }}>✅ CORRECT AIDI PATTERN</div>
              <pre style={{ fontFamily: mono, fontSize: 11, color: T.green, background: T.white, border: `1px solid ${T.green}30`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {patterns[step].good}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      <Analogy>
        Managed Identity is like giving your Databricks cluster an employee ID badge that Azure recognizes. When the cluster walks up to the Azure SQL door, it shows its badge and gets in — no password, no secret handshake. The badge is managed by Azure and automatically renewed. You never see the credential, so you can't accidentally commit it to git.
      </Analogy>

      <Card>
        <SectionHeading label="Pipeline & Azure Checklist" color={T.red} />
        <SubHeading color={T.red}>STEP 2 — CHECK OFF BEFORE ANY PIPELINE DEPLOYS</SubHeading>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {checks.map((c, i) => (
            <div key={i} onClick={() => setChecklist(p => ({ ...p, [i]: !p[i] }))} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{checklist[i] ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 13, color: T.inkLight, fontFamily: sans, lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 11, color: T.red }}>
          {Object.values(checklist).filter(Boolean).length} / {checks.length} complete
        </div>
      </Card>

      <Callout icon="☁️" color={T.red} bg={T.redL}>
        <strong>Key insight:</strong> The old Gmail SMTP pattern created a dependency on a personal email account and an "app password" that someone had to manage, rotate, and share. ACS + Managed Identity eliminates all of that — the cluster authenticates itself to ACS automatically, and the credential lifecycle is managed by Azure, not by AIDI engineers.
      </Callout>
    </div>
  );
}

// ── Tab components map ───────────────────────────────────────────────────────
const TAB_COMPONENTS = {
  overview:  OverviewTab,
  secrets:   SecretsTab,
  input:     InputTab,
  api:       ApiTab,
  phi:       PhiTab,
  pipelines: PipelinesTab,
};

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find(t => t.id === active);
  const activeIdx = TABS.findIndex(t => t.id === active);
  const TabComponent = TAB_COMPONENTS[active];

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: sans, display: "flex", flexDirection: "column" }}>

      {/* Sticky header */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "12px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, background: tab.color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{tab.icon}</div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 16, color: T.ink, fontWeight: 600, lineHeight: 1.1 }}>AIDI Security Skill</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.muted, letterSpacing: 0.5 }}>KING HUSSEIN CANCER CENTER — AI OFFICE</div>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: 11, color: T.muted }}>{activeIdx + 1} / {TABS.length}</div>
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)} style={{ flexShrink: 0, background: active === t.id ? t.color : T.faint, border: `1.5px solid ${active === t.id ? t.color : T.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: active === t.id ? "#fff" : T.muted, fontFamily: sans, fontWeight: active === t.id ? 600 : 400, transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 980, margin: "0 auto", padding: "28px 24px", width: "100%" }}>
        {/* Tab intro banner */}
        <div style={{ background: T.white, border: `1.5px solid ${tab.color}30`, borderLeft: `5px solid ${tab.color}`, borderRadius: "0 14px 14px 0", padding: "18px 22px", marginBottom: 28, boxShadow: `0 2px 12px ${tab.color}12` }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: tab.color, letterSpacing: 1.5, marginBottom: 6 }}>{tab.icon} {tab.short.toUpperCase()}</div>
          <div style={{ fontFamily: serif, fontSize: 20, color: T.ink, fontWeight: 600, marginBottom: 8 }}>{tab.label}</div>
          <Prose style={{ fontSize: 14 }}>{tab.intro}</Prose>
        </div>

        {/* Tab content */}
        <div className="fade-in" key={active}>
          <TabComponent />
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
          {activeIdx > 0 ? (
            <button className="hover-lift" onClick={() => setActive(TABS[activeIdx - 1].id)} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, color: T.inkLight, fontFamily: sans }}>
              ← {TABS[activeIdx - 1].label}
            </button>
          ) : <div />}
          {activeIdx < TABS.length - 1 ? (
            <button className="hover-lift" onClick={() => setActive(TABS[activeIdx + 1].id)} style={{ background: tab.color, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#fff", fontFamily: sans, fontWeight: 600 }}>
              {TABS[activeIdx + 1].label} →
            </button>
          ) : (
            <button className="hover-lift" onClick={() => setActive(TABS[0].id)} style={{ background: tab.color, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#fff", fontFamily: sans, fontWeight: 600 }}>
              ↩ Back to start
            </button>
          )}
        </div>
      </div>

      {/* Dot footer */}
      <div style={{ background: T.white, borderTop: `1px solid ${T.border}`, padding: "12px 24px", display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} title={t.label} style={{ width: active === t.id ? 28 : 8, height: 8, borderRadius: 4, background: active === t.id ? t.color : T.borderDk, border: "none", padding: 0, transition: "all 0.25s" }} />
        ))}
      </div>
    </div>
  );
}
