import React, { useState } from 'react';

const SNIPPETS = [
  { code: '<h1>Triage</h1>', broken: false, reason: 'Correct — opening tag, content, closing tag.' },
  { code: '<h1>Triage', broken: true, reason: 'Missing </h1> closing tag — the classic bug; the whole page becomes giant heading text.' },
  { code: '<p>Patient is stable.</p>', broken: false, reason: 'Correct — a properly closed paragraph.' },
  { code: '<url>https://khcc.jo</url>', broken: true, reason: 'There is no <url> tag. Links use <a href="...">, not <url>.' },
  { code: '<a href="https://khcc.jo">KHCC</a>', broken: false, reason: 'Correct — an anchor with a proper href attribute.' },
  { code: '<a href=https://khcc.jo>KHCC</a>', broken: true, reason: 'Attribute value needs quotes: href="https://khcc.jo".' },
  { code: '<ul><li>Fever</li><li>Chills</li></ul>', broken: false, reason: 'Correct — a list with two properly closed items.' },
  { code: '<input type="number">', broken: false, reason: 'Correct — <input> is a standalone tag with no closing tag.' },
  { code: '<button>Submit<button>', broken: true, reason: 'The second tag is missing its slash; the closer must be </button>.' },
  { code: '<paragraph>Notes here</paragraph>', broken: true, reason: 'There is no <paragraph> tag — paragraphs use <p>...</p>.' },
];

export default function Practice() {
  const [flagged, setFlagged] = useState({});
  const [checked, setChecked] = useState(false);

  const toggle = (i) => {
    if (checked) return;
    setFlagged({ ...flagged, [i]: !flagged[i] });
  };

  const reset = () => {
    setFlagged({});
    setChecked(false);
  };

  const isCorrect = (i) => Boolean(flagged[i]) === SNIPPETS[i].broken;
  const score = SNIPPETS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

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
    if (!checked) {
      if (flagged[i]) return { ...base, border: '2px solid #0d6efd', background: '#e7f1ff' };
      return base;
    }
    if (isCorrect(i)) return { ...base, border: '2px solid #198754', background: '#d4edda' };
    return { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1 style={{ marginBottom: 8 }}>Spot the Broken HTML</h1>

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20, lineHeight: 1.5 }}>
        Lesson 1 taught the entire grammar of HTML: <strong>open, content, close</strong>. A tag is a word in
        angle brackets; most come in pairs (<code>{'<p>...</p>'}</code>), and some configure with attributes like
        <code> href="..."</code>. Below are 10 short snippets from a patient intake page. Some are valid; some
        carry a classic error (a missing closing tag, a made-up tag, an attribute without quotes, a link without a
        proper <code>href</code>). <strong>Click the snippets you think are BROKEN</strong>, then press Check.
      </div>

      {SNIPPETS.map((s, i) => (
        <div key={i} style={cardStyle(i)} onClick={() => toggle(i)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15 }}>{s.code}</code>
            <span style={{ fontSize: 13, color: '#6c757d', marginLeft: 12, whiteSpace: 'nowrap' }}>
              {checked ? (s.broken ? 'BROKEN' : 'valid') : (flagged[i] ? 'flagged broken' : 'click to flag')}
            </span>
          </div>
          {checked && (
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <strong>{isCorrect(i) ? '✓ Correct' : '✗ Not quite'}</strong> — {s.reason}
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
          You scored <strong>{score} / {SNIPPETS.length}</strong>. Remember: HTML never shows a red error — a
          forgotten closing tag just makes the page look wrong. When in doubt, find the tag you opened and never
          closed.
        </div>
      )}
    </div>
  );
}
