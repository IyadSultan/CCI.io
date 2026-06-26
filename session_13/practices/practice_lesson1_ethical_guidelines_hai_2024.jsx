import React, { useState } from 'react';

// Lesson 1 practice — match each scenario to the first ethical pillar it violates.

const PILLARS = [
  'Protect people & data',
  'Safety',
  'Fairness',
  'Transparency',
  'Accountability',
  'Human oversight',
];

const COLORS = {
  'Protect people & data': '#1565C0',
  'Safety': '#C62828',
  'Fairness': '#6A1B9A',
  'Transparency': '#00838F',
  'Accountability': '#EF6C00',
  'Human oversight': '#2E7D32',
};

const ITEMS = [
  { scenario: 'Training on identifiable charts copied to a personal laptop without IRB or data agreement', answer: 'Protect people & data',
    reason: 'Lawful, proportionate data access and PHI controls are the floor — Session 12 plus governance, not "we will anonymize later."' },
  { scenario: 'Auto-discharge recommendation with no nurse override and no uncertainty display', answer: 'Human oversight',
    reason: 'High-stakes workflow automation without a licensed clinician responsible for the decision fails meaningful control.' },
  { scenario: 'Vendor will not share training cohort demographics or subgroup metrics', answer: 'Fairness',
    reason: 'You cannot assess equitable performance without knowing who was included and excluded.' },
  { scenario: 'Model version updated silently over the weekend; ward sees only "high risk" with no changelog', answer: 'Transparency',
    reason: 'Clinicians need scope, limits, version, and known failure modes — not a confident black box.' },
  { scenario: 'After a wrong alert harmed a patient, the team says "the algorithm decided"', answer: 'Accountability',
    reason: 'A named human owner and incident response path must exist — algorithms do not hold licenses.' },
  { scenario: 'Pilot launched without monitoring false negatives on neutropenic fever', answer: 'Safety',
    reason: 'Safe failure means bounded harm when wrong — especially on emergencies; monitoring is part of safety design.' },
];

export default function Practice() {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const cycle = (i) => {
    if (checked) return;
    setChoice((prev) => {
      const cur = prev[i];
      const nextIdx = cur === undefined ? 0 : (PILLARS.indexOf(cur) + 1) % PILLARS.length;
      return { ...prev, [i]: PILLARS[nextIdx] };
    });
  };

  const reset = () => { setChoice({}); setChecked(false); };
  const picked = (i) => choice[i];
  const isCorrect = (i) => picked(i) === ITEMS[i].answer;
  const allAnswered = ITEMS.every((_, i) => picked(i) !== undefined);
  const score = ITEMS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

  const cardStyle = (i) => {
    const base = { border: '2px solid #ced4da', borderRadius: 8, padding: '12px 16px', margin: '10px 0',
      cursor: checked ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 };
    if (!checked) return base;
    return isCorrect(i)
      ? { ...base, border: '2px solid #198754', background: '#d4edda' }
      : { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1>Which pillar breaks first?</h1>
      <div style={{ background: '#E3F2FD', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        For each clinical-AI scenario, tap to cycle through the <strong>six ethical pillars</strong> and pick
        the <strong>first</strong> one violated. Then press <strong>Check</strong>.
      </div>

      {ITEMS.map((it, i) => (
        <div key={i} style={cardStyle(i)} onClick={() => cycle(i)}>
          <span style={{ flex: 1 }}>{it.scenario}</span>
          <span style={{
            minWidth: 180, textAlign: 'center', padding: '6px 10px', borderRadius: 6, fontSize: 13,
            color: '#fff', background: picked(i) ? COLORS[picked(i)] : '#adb5bd',
          }}>
            {picked(i) || 'tap to choose'}
          </span>
        </div>
      ))}

      {checked && (
        <div style={{ marginTop: 8 }}>
          {ITEMS.map((it, i) => (
            <p key={i} style={{ margin: '6px 0', color: isCorrect(i) ? '#198754' : '#dc3545' }}>
              {isCorrect(i) ? '✓' : '✗'} <strong>{it.answer}:</strong> {it.reason}
            </p>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {!checked
          ? <button onClick={() => setChecked(true)} disabled={!allAnswered}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none',
                background: allAnswered ? '#1565C0' : '#adb5bd', color: '#fff',
                cursor: allAnswered ? 'pointer' : 'not-allowed' }}>Check</button>
          : <button onClick={reset}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#6c757d', color: '#fff', cursor: 'pointer' }}>Try Again</button>}
      </div>

      {checked && (
        <div style={{ background: '#E3F2FD', padding: 16, borderRadius: 8, marginTop: 16, borderLeft: '4px solid #1565C0' }}>
          <strong>Score: {score} / {ITEMS.length}.</strong> Use the six pillars as a checklist before any
          project gate — not as decoration on a slide deck.
        </div>
      )}
    </div>
  );
}
