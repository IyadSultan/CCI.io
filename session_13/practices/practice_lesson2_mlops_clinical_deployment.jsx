import React, { useState } from 'react';

// Lesson 2 practice — order the MLOps lifecycle steps (drag-free: tap to cycle position).

const CORRECT_ORDER = [
  'Define scope & clinical question',
  'Curate data with lineage & PHI controls',
  'Train with frozen splits & model card',
  'Validate (technical + clinical + operational)',
  'Deploy with version pin & feature parity',
  'Monitor drift & incidents',
  'Retrain or retire with change control',
];

const SHUFFLED = [
  'Monitor drift & incidents',
  'Define scope & clinical question',
  'Deploy with version pin & feature parity',
  'Train with frozen splits & model card',
  'Retrain or retire with change control',
  'Validate (technical + clinical + operational)',
  'Curate data with lineage & PHI controls',
];

export default function Practice() {
  const [order, setOrder] = useState(() => [...SHUFFLED]);
  const [checked, setChecked] = useState(false);

  const moveUp = (i) => {
    if (checked || i === 0) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i) => {
    if (checked || i === order.length - 1) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const reset = () => { setOrder([...SHUFFLED]); setChecked(false); };
  const isCorrect = order.every((step, i) => step === CORRECT_ORDER[i]);
  const score = order.filter((step, i) => step === CORRECT_ORDER[i]).length;

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1>Order the clinical MLOps lifecycle</h1>
      <div style={{ background: '#E3F2FD', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        Use <strong>↑ / ↓</strong> to sort the seven phases from first to last. Skipping
        <strong> Monitor</strong> is how models fail quietly. Press <strong>Check</strong> when done.
      </div>

      {order.map((step, i) => {
        const ok = checked && step === CORRECT_ORDER[i];
        const bad = checked && step !== CORRECT_ORDER[i];
        return (
          <div key={step} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', margin: '8px 0',
            borderRadius: 8, border: `2px solid ${bad ? '#dc3545' : ok ? '#198754' : '#ced4da'}`,
            background: bad ? '#f8d7da' : ok ? '#d4edda' : '#fff',
          }}>
            <span style={{ width: 28, fontWeight: 700, color: '#1565C0' }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>{step}</span>
            {!checked && (
              <span>
                <button onClick={() => moveUp(i)} style={{ marginRight: 4, padding: '4px 10px', cursor: 'pointer' }}>↑</button>
                <button onClick={() => moveDown(i)} style={{ padding: '4px 10px', cursor: 'pointer' }}>↓</button>
              </span>
            )}
          </div>
        );
      })}

      {checked && (
        <div style={{ marginTop: 12, fontSize: 14, color: '#455A64' }}>
          <strong>Correct sequence:</strong> {CORRECT_ORDER.map((s, i) => <span key={s}>{i > 0 ? ' → ' : ''}{s}</span>)}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {!checked
          ? <button onClick={() => setChecked(true)}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#1565C0', color: '#fff', cursor: 'pointer' }}>Check</button>
          : <button onClick={reset}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#6c757d', color: '#fff', cursor: 'pointer' }}>Try Again</button>}
      </div>

      {checked && (
        <div style={{ background: '#E3F2FD', padding: 16, borderRadius: 8, marginTop: 16, borderLeft: '4px solid #1565C0' }}>
          <strong>Score: {score} / {CORRECT_ORDER.length}.</strong>{' '}
          {isCorrect
            ? 'Perfect — validate before deploy, monitor before you trust, retire when drift wins.'
            : 'Review Lesson 2: Deploy without monitor is the most common silent-failure pattern.'}
        </div>
      )}
    </div>
  );
}
