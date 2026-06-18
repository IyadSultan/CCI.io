import React, { useState } from 'react';

// Lesson 7 practice — "Spot the PHI."
// Below is a synthetic note, broken into spans. Click the spans that are HIPAA
// identifiers (leave the generic clinical facts alone). Then Check.

const SPANS = [
  { text: 'Omar Haddad', phi: true, id: 1, note: 'Name (identifier #1).' },
  { text: 'known AML', phi: false, note: 'A diagnosis alone is not an identifier — it could be anyone.' },
  { text: 'MRN 4415567', phi: true, id: 8, note: 'Medical record number (identifier #8).' },
  { text: 'fever to 38.7C', phi: false, note: 'A clinical fact, not an identifier.' },
  { text: '12/03/1958 (DOB)', phi: true, id: 3, note: 'A date finer than a year, tied to a person (identifier #3).' },
  { text: '+962 79 555 1234', phi: true, id: 4, note: 'Telephone number (identifier #4).' },
  { text: '92 years old', phi: true, id: 2, note: 'Age over 89 — must be bundled as "90+" (relates to identifier #2 / the age rule).' },
  { text: 'neutropenic precautions', phi: false, note: 'A care action, not an identifier.' },
  { text: 'his daughter Salma', phi: true, id: 1, note: 'A relative’s name is still a name (identifier #1).' },
  { text: 'the camp near Irbid', phi: true, id: 2, note: 'Geographic detail smaller than a state (identifier #2).' },
];

export default function Practice() {
  const [flagged, setFlagged] = useState({});
  const [checked, setChecked] = useState(false);

  const toggle = (i) => {
    if (checked) return;
    setFlagged((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const reset = () => { setFlagged({}); setChecked(false); };
  const isFlagged = (i) => !!flagged[i];
  const isCorrect = (i) => isFlagged(i) === SPANS[i].phi;
  const score = SPANS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

  const chipStyle = (i) => {
    const base = { display: 'inline-block', padding: '6px 10px', margin: 4, borderRadius: 16,
      cursor: checked ? 'default' : 'pointer', border: '2px solid #ced4da',
      background: isFlagged(i) ? '#fff3cd' : '#fff' };
    if (!checked) return base;
    return isCorrect(i)
      ? { ...base, border: '2px solid #198754', background: '#d4edda' }
      : { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1>Spot the PHI</h1>
      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        This is a <strong>synthetic</strong> note. Click every span that is a HIPAA identifier — and leave
        the generic clinical facts alone. Remember: PHI = health information <em>plus</em> an identifier.
        Then press <strong>Check</strong>.
      </div>

      <div style={{ lineHeight: 2.4, fontSize: 17 }}>
        {SPANS.map((s, i) => (
          <span key={i} style={chipStyle(i)} onClick={() => toggle(i)}>{s.text}</span>
        ))}
      </div>

      {checked && (
        <div style={{ marginTop: 16 }}>
          {SPANS.map((s, i) => (
            <p key={i} style={{ margin: '6px 0', color: isCorrect(i) ? '#198754' : '#dc3545' }}>
              {isCorrect(i) ? '✓' : '✗'} <strong>{s.text}</strong> — {s.phi ? 'IDENTIFIER. ' : 'not an identifier. '}{s.note}
            </p>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {!checked
          ? <button onClick={() => setChecked(true)}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Check</button>
          : <button onClick={reset}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#6c757d', color: '#fff', cursor: 'pointer' }}>Try Again</button>}
      </div>

      {checked && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 16, borderLeft: '4px solid #0d6efd' }}>
          <strong>Score: {score} / {SPANS.length}.</strong> The hard part is free text: an unlabelled name
          or an indirect location ("the camp near Irbid") hides mid-sentence. A rules pass catches the
          shaped identifiers; an AI pass catches the rest — and a human still signs off.
        </div>
      )}
    </div>
  );
}
