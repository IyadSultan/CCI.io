import React, { useState } from 'react';

const BUCKETS = ['Frontend', 'Backend', 'Database'];

const ITEMS = [
  {
    item: 'Checking a temperature is a number before sending it',
    answer: 'Frontend',
    reason: 'A frontend convenience — instant feedback in the browser. (The backend re-checks it, because the browser can be bypassed.)',
  },
  {
    item: 'The official acuity score that goes in the record',
    answer: 'Backend',
    reason: 'Trusted clinical logic the user must not be able to rewrite. The server computes it.',
  },
  {
    item: 'The list of every patient triaged today',
    answer: 'Database',
    reason: 'Stored rows and tables, read by the backend when the doctor opens the queue.',
  },
  {
    item: 'Turning a button blue when the mouse hovers over it',
    answer: 'Frontend',
    reason: 'Pure appearance in the browser — nothing stored, nothing trusted.',
  },
  {
    item: 'The OpenAI API key',
    answer: 'Backend',
    reason: 'A secret. Anything that reaches the browser can be read, so keys stay on the server — never the frontend.',
  },
  {
    item: 'Computing the ESI acuity rule',
    answer: 'Backend',
    reason: 'The trusted rule runs as Python on the server; the browser only shows the result.',
  },
  {
    item: 'The HTML form the nurse sees',
    answer: 'Frontend',
    reason: 'Structure drawn in the browser — HTML, CSS, and a little JavaScript on the user’s screen.',
  },
  {
    item: 'A saved TriageEvent row',
    answer: 'Database',
    reason: 'A persisted record in a table — it survives after the tab closes, unlike anything in the frontend.',
  },
];

export default function Practice() {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const cycle = (i) => {
    if (checked) return;
    const cur = choice[i] || 'Frontend';
    const idx = BUCKETS.indexOf(cur);
    const next = BUCKETS[(idx + 1) % BUCKETS.length];
    setChoice({ ...choice, [i]: next });
  };

  const reset = () => {
    setChoice({});
    setChecked(false);
  };

  const picked = (i) => choice[i] || 'Frontend';
  const isCorrect = (i) => picked(i) === ITEMS[i].answer;
  const score = ITEMS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

  const bucketColor = (b) =>
    b === 'Frontend' ? '#0d6efd' : b === 'Backend' ? '#6f42c1' : '#fd7e14';

  const cardStyle = (i) => {
    const base = {
      border: '2px solid #ced4da',
      borderRadius: 8,
      padding: '12px 14px',
      marginBottom: 10,
      cursor: checked ? 'default' : 'pointer',
      background: '#fff',
      fontFamily: 'system-ui',
    };
    if (!checked) return base;
    if (isCorrect(i)) return { ...base, border: '2px solid #198754', background: '#d4edda' };
    return { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1 style={{ marginBottom: 8 }}>Frontend, Backend, or Database?</h1>

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20, lineHeight: 1.5 }}>
        Lesson 3 named the whole stack. The <strong>frontend</strong> (browser) shows and reacts; the
        <strong> backend</strong> (a server running Python/Django) holds trusted logic and secrets; the
        <strong> database</strong> keeps the rows that must survive after the tab closes. This is the Lesson 3
        Try-This list. <strong>Click each card to cycle</strong> it through Frontend → Backend → Database, then
        press Check.
      </div>

      {ITEMS.map((it, i) => (
        <div key={i} style={cardStyle(i)} onClick={() => cycle(i)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15 }}>{it.item}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                padding: '4px 12px',
                borderRadius: 14,
                color: '#fff',
                background: bucketColor(picked(i)),
              }}
            >
              {picked(i)}
            </span>
          </div>
          {checked && (
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <strong>{isCorrect(i) ? '✓ Correct' : '✗ Should be ' + ITEMS[i].answer}</strong> — {it.reason}
            </div>
          )}
        </div>
      ))}

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
          You scored <strong>{score} / {ITEMS.length}</strong>. The path of a triage form: the browser
          (frontend) sends a request → the server (backend) validates, computes acuity, and saves → the database
          stores the row → a response is drawn back. Knowing which work goes where is the whole art of the stack.
        </div>
      )}
    </div>
  );
}
