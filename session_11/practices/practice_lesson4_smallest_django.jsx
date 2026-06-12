import React, { useState } from 'react';

// Part A — order the three moves to serve a Django page.
const MOVES = [
  {
    id: 'view',
    label: 'Write a view',
    detail: 'A Python function in views.py that takes a request and returns a response (HttpResponse or a rendered template).',
    correctOrder: 2,
  },
  {
    id: 'register',
    label: 'Register the app in INSTALLED_APPS',
    detail: 'Add "pages" to INSTALLED_APPS in settings.py so the project knows the app exists.',
    correctOrder: 1,
  },
  {
    id: 'url',
    label: 'Connect a URL in urls.py',
    detail: 'Wire path("", home) so a request to that URL runs your view. URL → view → response.',
    correctOrder: 3,
  },
];

// Part B — match each file to its job.
const JOBS = [
  'Control panel — you run every command through it',
  'INSTALLED_APPS + database + config',
  'The master URL map',
  'Python that runs on each request',
  'Data definitions',
  'HTML page with data slots',
];

const FILES = [
  { file: 'manage.py', answer: 'Control panel — you run every command through it' },
  { file: 'mysite/settings.py', answer: 'INSTALLED_APPS + database + config' },
  { file: 'mysite/urls.py', answer: 'The master URL map' },
  { file: 'pages/views.py', answer: 'Python that runs on each request' },
  { file: 'pages/models.py', answer: 'Data definitions' },
  { file: 'pages/templates/pages/home.html', answer: 'HTML page with data slots' },
];

export default function Practice() {
  const [order, setOrder] = useState([]); // array of move ids in clicked order
  const [match, setMatch] = useState({}); // file -> selected job
  const [checked, setChecked] = useState(false);

  const clickMove = (id) => {
    if (checked) return;
    if (order.includes(id)) {
      // unclick: remove it (and keep remaining order intact)
      setOrder(order.filter((m) => m !== id));
    } else {
      setOrder([...order, id]);
    }
  };

  const reset = () => {
    setOrder([]);
    setMatch({});
    setChecked(false);
  };

  const positionOf = (id) => {
    const idx = order.indexOf(id);
    return idx === -1 ? null : idx + 1;
  };

  const moveCorrect = (m) => positionOf(m.id) === m.correctOrder;
  const fileCorrect = (f) => match[f.file] === f.answer;

  const moveScore = MOVES.reduce((n, m) => n + (moveCorrect(m) ? 1 : 0), 0);
  const fileScore = FILES.reduce((n, f) => n + (fileCorrect(f) ? 1 : 0), 0);
  const total = moveScore + fileScore;
  const max = MOVES.length + FILES.length;

  const moveStyle = (m) => {
    const base = {
      border: '2px solid #ced4da',
      borderRadius: 8,
      padding: '12px 14px',
      marginBottom: 10,
      cursor: checked ? 'default' : 'pointer',
      background: '#fff',
      fontFamily: 'system-ui',
    };
    if (!checked) {
      if (positionOf(m.id)) return { ...base, border: '2px solid #0d6efd', background: '#e7f1ff' };
      return base;
    }
    if (moveCorrect(m)) return { ...base, border: '2px solid #198754', background: '#d4edda' };
    return { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  const selectStyle = (f) => {
    const base = {
      fontFamily: 'system-ui',
      fontSize: 14,
      padding: '6px 8px',
      borderRadius: 6,
      border: '2px solid #ced4da',
      minWidth: 280,
    };
    if (!checked) return base;
    if (fileCorrect(f)) return { ...base, border: '2px solid #198754', background: '#d4edda' };
    return { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1 style={{ marginBottom: 8 }}>Build the Smallest Django</h1>

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20, lineHeight: 1.5 }}>
        Lesson 4 built the smallest Django site that runs, and named every file. Serving one page takes
        <strong> three moves</strong>, and the canonical rhythm is <strong>register the app → write the view →
        connect the URL</strong> (URL → view → response). Below, <strong>click the three moves in the right
        order</strong> (your click number shows on each), then <strong>match each file to its job</strong> with the
        dropdowns. Press Check when done.
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 6 }}>Part A — Order the three moves</h2>
      <p style={{ fontSize: 14, color: '#6c757d', marginTop: 0 }}>
        Click 1st, 2nd, 3rd. Click an already-numbered card again to remove it.
      </p>
      {MOVES.map((m) => (
        <div key={m.id} style={moveStyle(m)} onClick={() => clickMove(m.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{m.label}</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                width: 30,
                height: 30,
                lineHeight: '30px',
                textAlign: 'center',
                borderRadius: '50%',
                color: '#fff',
                background: positionOf(m.id) ? '#0d6efd' : '#adb5bd',
              }}
            >
              {positionOf(m.id) || '?'}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#495057', marginTop: 6 }}>{m.detail}</div>
          {checked && (
            <div style={{ marginTop: 6, fontSize: 14 }}>
              <strong>{moveCorrect(m) ? '✓ Correct' : '✗ Should be #' + m.correctOrder}</strong>
            </div>
          )}
        </div>
      ))}

      <h2 style={{ fontSize: 18, marginBottom: 6, marginTop: 24 }}>Part B — Match each file to its job</h2>
      {FILES.map((f) => (
        <div
          key={f.file}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}
        >
          <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15, minWidth: 240 }}>{f.file}</code>
          <select
            value={match[f.file] || ''}
            disabled={checked}
            onChange={(e) => setMatch({ ...match, [f.file]: e.target.value })}
            style={selectStyle(f)}
          >
            <option value="">— choose its job —</option>
            {JOBS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
      ))}
      {checked && (
        <div style={{ fontSize: 14, marginTop: 4 }}>
          {FILES.filter((f) => !fileCorrect(f)).length === 0
            ? 'Every file matched correctly.'
            : 'Correct answers: ' + FILES.map((f) => f.file + ' → ' + f.answer).join('; ') + '.'}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            style={{ background: '#198754', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
          >
            Check
          </button>
        ) : (
          <button
            onClick={reset}
            style={{ background: '#0d6efd', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
          >
            Try Again
          </button>
        )}
      </div>

      {checked && (
        <div style={{ marginTop: 18, background: '#f0f4ff', borderLeft: '4px solid #0d6efd', padding: 16, borderRadius: 6 }}>
          You scored <strong>{total} / {max}</strong> ({moveScore}/{MOVES.length} on the moves, {fileScore}/
          {FILES.length} on the files). The rhythm of all Django work: register the app, write the view, connect
          the URL — then a request comes in, the URL router picks the view, the view returns HTML, the browser
          draws it. (In practice any order of the three edits works, but this is the sequence to memorize.)
        </div>
      )}
    </div>
  );
}
