import React, { useState } from 'react';

const TASKS = [
  {
    task: 'Show a "Febrile" warning as the nurse types a temperature',
    answer: 'Frontend',
    reason: 'A live convenience cue in the browser. Helpful instantly, but only a courtesy — it is not the official rule.',
  },
  {
    task: 'The official acuity score that is saved to the patient record',
    answer: 'Backend',
    reason: 'Clinical logic the user must not be able to rewrite. It runs on a server you control — the law, not a courtesy.',
  },
  {
    task: 'Turn a button blue when the mouse hovers over it',
    answer: 'Frontend',
    reason: 'Pure appearance and interaction in the browser. Nothing is stored or trusted.',
  },
  {
    task: 'Validate that SpO2 is within a plausible range before the row is saved',
    answer: 'Backend',
    reason: 'Anything that MUST be true has to be enforced on the backend. The browser check is a nicety; a bug or paste can bypass it.',
  },
  {
    task: 'Store the OpenAI API key the app uses to ask about oncologic emergencies',
    answer: 'Backend',
    reason: 'A secret. Anything sent to the browser can be read by anyone — keys never live on the frontend.',
  },
  {
    task: 'Clear the warning text when the input is emptied',
    answer: 'Frontend',
    reason: 'Reading an input and updating the screen is exactly the read-compute-write cycle JavaScript does in the browser.',
  },
  {
    task: 'Decide which framework a .jsx file is written in',
    answer: 'Frontend',
    reason: 'A .jsx file is React — a frontend JavaScript framework for building UIs out of components.',
  },
  {
    task: 'Keep the triage so the next shift’s doctor can still see it after the tab closes',
    answer: 'Backend',
    reason: 'The frontend forgets everything when the tab closes. Persistence lives on the server (and its database).',
  },
];

const BUCKETS = ['Frontend', 'Backend'];
const SUB = {
  Frontend: '(convenience)',
  Backend: '(must be enforced)',
};

export default function Practice() {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const toggle = (i) => {
    if (checked) return;
    const cur = choice[i] || 'Frontend';
    const next = cur === 'Frontend' ? 'Backend' : 'Frontend';
    setChoice({ ...choice, [i]: next });
  };

  const reset = () => {
    setChoice({});
    setChecked(false);
  };

  const picked = (i) => choice[i] || 'Frontend';
  const isCorrect = (i) => picked(i) === TASKS[i].answer;
  const score = TASKS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

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
      <h1 style={{ marginBottom: 8 }}>Where Does It Belong — Frontend or Backend?</h1>

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20, lineHeight: 1.5 }}>
        Lesson 2 drew a bright line. The <strong>frontend</strong> runs in the browser — great for showing things
        and reacting to clicks, but it forgets everything when the tab closes and anyone can read or rewrite it.
        The <strong>backend</strong> runs on a server you control — the home of data that must persist, logic that
        must be trusted, and secrets that must stay hidden. For each oncology-ER triage task below,
        <strong> click the card to toggle</strong> between Frontend and Backend, then press Check.
      </div>

      {TASKS.map((t, i) => (
        <div key={i} style={cardStyle(i)} onClick={() => toggle(i)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15 }}>{t.task}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                padding: '4px 10px',
                borderRadius: 14,
                color: '#fff',
                background: picked(i) === 'Backend' ? '#6f42c1' : '#0d6efd',
              }}
            >
              {picked(i)} {SUB[picked(i)]}
            </span>
          </div>
          {checked && (
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <strong>{isCorrect(i) ? '✓ Correct' : '✗ Should be ' + TASKS[i].answer}</strong> — {t.reason}
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
          You scored <strong>{score} / {TASKS.length}</strong>. The rule of thumb: a frontend check is a courtesy;
          the backend version is the law. Secrets and trusted clinical logic never live in the browser, because the
          user can read and rewrite anything that reaches it.
        </div>
      )}
    </div>
  );
}
