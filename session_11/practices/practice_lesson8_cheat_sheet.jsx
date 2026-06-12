import React, { useState } from 'react';

const BUCKETS = ['Frontend', 'Backend', 'Deploy/Git'];

const BUCKET_COLOR = {
  Frontend: '#0d6efd',
  Backend: '#6f42c1',
  'Deploy/Git': '#fd7e14',
};

const ITEMS = [
  {
    id: 'html',
    label: 'HTML tags & the page skeleton',
    answer: 'Frontend',
    why: 'Frontend: HTML is the structure the browser draws — display lives in the frontend.',
  },
  {
    id: 'forloop',
    label: '{% for %} template loop',
    answer: 'Backend',
    why: 'Backend: Django templates are rendered server-side; the loop runs on the backend, then sends finished HTML.',
  },
  {
    id: 'acuity',
    label: 'AcuityCalculator pure-Python rule',
    answer: 'Backend',
    why: 'Backend: deterministic, testable logic lives on the server — never let the browser be the law.',
  },
  {
    id: 'onclick',
    label: 'onclick event handler',
    answer: 'Frontend',
    why: 'Frontend: JavaScript behavior in the browser handles interaction.',
  },
  {
    id: 'gunicorn',
    label: 'gunicorn er_triage.wsgi',
    answer: 'Deploy/Git',
    why: 'Deploy/Git: gunicorn is the production start command that serves the app on the server.',
  },
  {
    id: 'gitignore',
    label: '.gitignore excludes .env',
    answer: 'Deploy/Git',
    why: 'Deploy/Git: keeping secrets out of the repo is part of shipping safely.',
  },
  {
    id: 'allowedhosts',
    label: 'ALLOWED_HOSTS / DEBUG=False',
    answer: 'Deploy/Git',
    why: 'Deploy/Git: production settings flipped at deploy time so the live app is safe.',
  },
  {
    id: 'queue',
    label: 'The doctor queue table the user sees',
    answer: 'Frontend',
    why: 'Frontend: the rendered table is what the user sees and interacts with in the browser.',
  },
  {
    id: 'installed',
    label: 'INSTALLED_APPS registration',
    answer: 'Backend',
    why: 'Backend: settings.py configuration that tells the Django server which apps to load.',
  },
  {
    id: 'gitpush',
    label: 'git push auto-deploys',
    answer: 'Deploy/Git',
    why: 'Deploy/Git: pushing to GitHub triggers Render to redeploy — the push-to-deploy loop.',
  },
];

const EXIT_TICKET = [
  'Name one thing that belongs on the backend and explain why it cannot live in the browser.',
  'You added a billing app and /billing/ shows nothing. List the first two files you would check.',
  'What is the single most important file to keep out of GitHub, and why?',
];

export default function Practice() {
  // start each item at bucket index 0 (Frontend); click cycles through buckets
  const [assign, setAssign] = useState(ITEMS.map(() => 0));
  const [checked, setChecked] = useState(false);

  const cycle = (i) => {
    if (checked) return;
    const next = [...assign];
    next[i] = (next[i] + 1) % BUCKETS.length;
    setAssign(next);
  };

  const reset = () => {
    setAssign(ITEMS.map(() => 0));
    setChecked(false);
  };

  const score = ITEMS.reduce(
    (acc, it, i) => acc + (BUCKETS[assign[i]] === it.answer ? 1 : 0),
    0
  );

  const btn = (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
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
      <h1 style={{ fontSize: 26 }}>Session 11 Review — Sort the Whole Stack</h1>

      <p
        style={{
          background: '#f8f9fa',
          padding: 16,
          borderRadius: 8,
          lineHeight: 1.5,
        }}
      >
        The whole session on one screen. Each item below belongs to one layer of
        the stack: <strong>Frontend</strong> (what the browser draws and the user
        clicks), <strong>Backend</strong> (Python/Django logic and config on the
        server — including templates, which render server-side), or{' '}
        <strong>Deploy/Git</strong> (shipping it live). <strong>Click an item</strong>{' '}
        to cycle its bucket, then press <strong>Check</strong>.
      </p>

      <div style={{ marginBottom: 14, fontSize: 14 }}>
        {BUCKETS.map((b) => (
          <span
            key={b}
            style={{
              display: 'inline-block',
              background: BUCKET_COLOR[b],
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 12,
              marginRight: 8,
              fontWeight: 600,
            }}
          >
            {b}
          </span>
        ))}
      </div>

      {ITEMS.map((it, i) => {
        const chosen = BUCKETS[assign[i]];
        const correct = chosen === it.answer;
        const border = !checked
          ? '2px solid ' + BUCKET_COLOR[chosen]
          : correct
          ? '2px solid #198754'
          : '2px solid #dc3545';
        const bg = !checked ? '#ffffff' : correct ? '#d4edda' : '#f8d7da';
        return (
          <div
            key={it.id}
            onClick={() => cycle(i)}
            style={{
              border,
              background: bg,
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              cursor: checked ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span style={{ fontWeight: 600 }}>{it.label}</span>
            <span
              style={{
                background: BUCKET_COLOR[chosen],
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {chosen}
            </span>
          </div>
        );
      })}

      {checked && (
        <div style={{ marginBottom: 14 }}>
          {ITEMS.map((it, i) => {
            const correct = BUCKETS[assign[i]] === it.answer;
            return (
              <div
                key={it.id}
                style={{ fontSize: 14, marginBottom: 6 }}
              >
                <strong
                  style={{ color: correct ? '#198754' : '#dc3545' }}
                >
                  {correct ? '✓' : '✗'} {it.label}
                </strong>{' '}
                — {it.why}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        {!checked ? (
          <button onClick={() => setChecked(true)} style={btn('#198754')}>
            Check
          </button>
        ) : (
          <button onClick={reset} style={btn('#0d6efd')}>
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
            You sorted {score} of {ITEMS.length} correctly.
          </strong>{' '}
          The one rule that organizes it all: display and interaction go in the
          frontend; data and trusted logic go in the backend; secrets and the live
          config go in deploy. Validate on the backend, keep secrets off the
          browser, never let the browser be the law.
        </div>
      )}

      <div
        style={{
          marginTop: 28,
          background: '#fff8e1',
          border: '2px solid #fd7e14',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 19, marginTop: 0 }}>Exit ticket (reflect — not graded)</h2>
        <ol style={{ lineHeight: 1.6, marginBottom: 0 }}>
          {EXIT_TICKET.map((q, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {q}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
