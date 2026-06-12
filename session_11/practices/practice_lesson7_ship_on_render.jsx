import React, { useState } from 'react';

const CHECKLIST = [
  {
    id: 'requirements',
    label: 'requirements.txt lists every package (Django, gunicorn, whitenoise, ...)',
    must: true,
    why: 'Must be true. The server installs exactly what this file lists — a missing line becomes a ModuleNotFoundError at build time.',
  },
  {
    id: 'gitignore',
    label: '.gitignore excludes .env, db.sqlite3, and .venv',
    must: true,
    why: 'Must be true. Secrets and the local DB must never reach GitHub. A committed secret is a leaked secret — it stays in history.',
  },
  {
    id: 'debugfalse',
    label: 'DEBUG = False in production',
    must: true,
    why: 'Must be true. Debug error pages leak internal details. The blueprint sets DEBUG false via an env var.',
  },
  {
    id: 'allowedhosts',
    label: 'ALLOWED_HOSTS is set (Render host added automatically)',
    must: true,
    why: 'Must be true. Without the host listed, Django refuses the request as a security measure (Bad Request 400).',
  },
  {
    id: 'secretsenv',
    label: 'OPENAI_API_KEY, FERNET_KEY, SECRET_KEY set as env vars (not in the repo)',
    must: true,
    why: 'Must be true. Secrets live in the dashboard as env vars, never in code or the repository.',
  },
  {
    id: 'buildsh',
    label: 'build.sh does pip install + collectstatic + migrate',
    must: true,
    why: 'Must be true. The build step installs packages, gathers static files for whitenoise, and applies migrations every deploy.',
  },
  {
    id: 'gunicorn',
    label: 'Start command is gunicorn er_triage.wsgi:application',
    must: true,
    why: 'Must be true. Gunicorn is the production server. runserver is a development toy with a warning printed on it.',
  },
  {
    id: 'commitenv',
    label: 'Commit your .env so Render can read the key',
    must: false,
    why: 'WRONG — never. Committing .env leaks your secrets into git history. Set keys as env vars in the dashboard instead.',
  },
  {
    id: 'debugtrue',
    label: 'Set DEBUG=True so you can see errors in production',
    must: false,
    why: 'WRONG. DEBUG=True exposes internal details to the public. Read the deploy log for errors, keep DEBUG=False.',
  },
  {
    id: 'runserver',
    label: 'Run runserver in production',
    must: false,
    why: 'WRONG. runserver is for development only. Use gunicorn to serve real traffic.',
  },
];

const SCENARIOS = [
  {
    id: 's1',
    log: 'Bad Request (400) — ALLOWED_HOSTS error in the deploy log.',
    answer: 'allowed',
    fixes: [
      { id: 'allowed', text: 'Confirm DEBUG and ALLOWED_HOSTS are read from env, then redeploy.' },
      { id: 'pip', text: 'Add the missing package to requirements.txt, commit, push.' },
      { id: 'chmod', text: 'Run chmod +x build.sh, commit, push.' },
    ],
    why: 'The app booted before the host was accepted. Settings read DEBUG/ALLOWED_HOSTS from the environment and Render adds its hostname automatically — confirm and redeploy.',
  },
  {
    id: 's2',
    log: 'ModuleNotFoundError: No module named "whitenoise".',
    answer: 'pip',
    fixes: [
      { id: 'allowed', text: 'Confirm DEBUG and ALLOWED_HOSTS are read from env, then redeploy.' },
      { id: 'pip', text: 'Add the missing package to requirements.txt, commit, push.' },
      { id: 'chmod', text: 'Run chmod +x build.sh, commit, push.' },
    ],
    why: 'Something is imported but not installed. Add the package to requirements.txt, commit, and push — Render redeploys automatically.',
  },
  {
    id: 's3',
    log: 'build.sh: permission denied.',
    answer: 'chmod',
    fixes: [
      { id: 'allowed', text: 'Confirm DEBUG and ALLOWED_HOSTS are read from env, then redeploy.' },
      { id: 'pip', text: 'Add the missing package to requirements.txt, commit, push.' },
      { id: 'chmod', text: 'Run chmod +x build.sh, commit, push.' },
    ],
    why: 'The build script is not marked executable. chmod +x build.sh, commit, and push.',
  },
];

export default function Practice() {
  const [picks, setPicks] = useState([]); // checklist ids
  const [fixes, setFixes] = useState(SCENARIOS.map(() => ''));
  const [checked, setChecked] = useState(false);

  const toggle = (id) => {
    if (checked) return;
    setPicks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const setFix = (i, val) => {
    if (checked) return;
    const next = [...fixes];
    next[i] = val;
    setFixes(next);
  };

  const reset = () => {
    setPicks([]);
    setFixes(SCENARIOS.map(() => ''));
    setChecked(false);
  };

  const checklistRight = CHECKLIST.filter(
    (c) => picks.includes(c.id) === c.must
  ).length;
  const fixRight = SCENARIOS.reduce(
    (acc, s, i) => acc + (fixes[i] === s.answer ? 1 : 0),
    0
  );

  const allFixed = fixes.every((f) => f !== '');
  const canCheck = allFixed; // checklist can be any selection; scenarios required

  const btn = (bg, enabled) => ({
    background: enabled ? bg : '#adb5bd',
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 6,
    fontSize: 16,
    cursor: enabled ? 'pointer' : 'not-allowed',
  });

  return (
    <div
      style={{
        maxWidth: 820,
        margin: '40px auto',
        fontFamily: 'system-ui',
        padding: '0 16px',
        color: '#212529',
      }}
    >
      <h1 style={{ fontSize: 26 }}>Ship It — Render Deploy Checklist &amp; Debugging</h1>

      <p
        style={{
          background: '#f8f9fa',
          padding: 16,
          borderRadius: 8,
          lineHeight: 1.5,
        }}
      >
        Deployment is moving the backend onto an always-on, internet-reachable
        computer. Before you push the ER-Triage app to Render, some things{' '}
        <strong>must be true</strong>. In <strong>Part A</strong>, select only the
        items that should be true before deploying — some entries are traps you
        must <em>not</em> select. In <strong>Part B</strong>, the deploy log went
        red; pick the fix for each failure. Then press <strong>Check</strong>.
      </p>

      <h2 style={{ fontSize: 19 }}>Part A — Pre-deploy checklist</h2>
      {CHECKLIST.map((c) => {
        const picked = picks.includes(c.id);
        const right = checked && picked === c.must;
        const border = !checked
          ? picked
            ? '2px solid #0d6efd'
            : '2px solid #dee2e6'
          : right
          ? '2px solid #198754'
          : '2px solid #dc3545';
        const bg = !checked
          ? '#ffffff'
          : right
          ? '#d4edda'
          : '#f8d7da';
        return (
          <div
            key={c.id}
            onClick={() => toggle(c.id)}
            style={{
              border,
              background: bg,
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              cursor: checked ? 'default' : 'pointer',
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {picked ? '☑' : '☐'} {c.label}
            </div>
            {checked && (
              <div style={{ marginTop: 6, fontSize: 14 }}>{c.why}</div>
            )}
          </div>
        );
      })}

      <h2 style={{ fontSize: 19, marginTop: 26 }}>
        Part B — The deploy log is red. What is the fix?
      </h2>
      {SCENARIOS.map((s, i) => {
        const correct = fixes[i] === s.answer;
        const border = !checked
          ? '2px solid #dee2e6'
          : correct
          ? '2px solid #198754'
          : '2px solid #dc3545';
        const bg = !checked ? '#ffffff' : correct ? '#d4edda' : '#f8d7da';
        return (
          <div
            key={s.id}
            style={{
              border,
              background: bg,
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                background: '#212529',
                color: '#f8d7da',
                padding: '8px 10px',
                borderRadius: 6,
                marginBottom: 10,
                fontSize: 14,
              }}
            >
              {s.log}
            </div>
            <select
              value={fixes[i]}
              onChange={(e) => setFix(i, e.target.value)}
              disabled={checked}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontFamily: 'system-ui',
                fontSize: 15,
                borderRadius: 6,
                border: '1px solid #adb5bd',
              }}
            >
              <option value="">— choose the fix —</option>
              {s.fixes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.text}
                </option>
              ))}
            </select>
            {checked && (
              <div style={{ marginTop: 8, fontSize: 14 }}>
                {correct ? (
                  <span style={{ color: '#198754', fontWeight: 600 }}>
                    Correct.{' '}
                  </span>
                ) : (
                  <span style={{ color: '#dc3545', fontWeight: 600 }}>
                    Not the right fix.{' '}
                  </span>
                )}
                {s.why}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 8 }}>
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!canCheck}
            style={btn('#198754', canCheck)}
          >
            Check
          </button>
        ) : (
          <button onClick={reset} style={btn('#0d6efd', true)}>
            Try Again
          </button>
        )}
      </div>

      {checked && (
        <div
          style={{
            marginTop: 20,
            background: '#f0f4ff',
            borderLeft: '4px solid #0d6efd',
            padding: 16,
            borderRadius: 6,
          }}
        >
          <strong>
            Checklist: {checklistRight} of {CHECKLIST.length} judged correctly.
            Debugging: {fixRight} of {SCENARIOS.length} fixes right.
          </strong>
          <div style={{ marginTop: 8 }}>
            Never commit your .env, keep DEBUG=False, serve with gunicorn, and read
            the deploy log — it tells you exactly why a deploy went red. Fix,
            commit, push, and Render redeploys automatically.
          </div>
        </div>
      )}
    </div>
  );
}
