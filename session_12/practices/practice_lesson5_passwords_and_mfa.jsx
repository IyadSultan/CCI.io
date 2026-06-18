import React, { useState } from 'react';

// Lesson 5 practice — two parts in one board:
//  A) Is each password STRONG or WEAK?
//  B) Would MFA have stopped this attack?
// Each item carries its own two choices. Tap to toggle, then Check.

const ITEMS = [
  { section: 'A — Strong or weak?', item: 'correct-horse-battery-staple (four random, unrelated words)',
    buckets: ['Strong', 'Weak'], answer: 'Strong',
    reason: 'Length beats complexity. A long passphrase lives in a space too vast to sweep — and is easy to remember.' },
  { section: 'A — Strong or weak?', item: 'P@ssw0rd!',
    buckets: ['Strong', 'Weak'], answer: 'Weak',
    reason: 'Short and predictable. Attackers try every a→@ / o→0 substitution first; "complex" is not "strong".' },
  { section: 'A — Strong or weak?', item: 'Summer2024! (used on three different sites)',
    buckets: ['Strong', 'Weak'], answer: 'Weak',
    reason: 'A common pattern AND reused — the worst of both. One breach becomes a master key to the others.' },
  { section: 'B — Would MFA have stopped it?', item: 'Your password leaks in a breach, but your email needs a code from your authenticator app',
    buckets: ['MFA stops it', 'MFA would not help'], answer: 'MFA stops it',
    reason: 'The stolen password is not enough — the attacker is blocked at the second gate (something you have).' },
  { section: 'B — Would MFA have stopped it?', item: 'A fake login page phishes BOTH your password and the SMS code you typed in real time',
    buckets: ['MFA stops it', 'MFA would not help'], answer: 'MFA would not help',
    reason: 'SMS/typed codes are phishable. A phishing-resistant hardware key or passkey would have refused the fake site.' },
  { section: 'B — Would MFA have stopped it?', item: 'You reuse a password on a site that has no MFA option at all',
    buckets: ['MFA stops it', 'MFA would not help'], answer: 'MFA would not help',
    reason: 'No second factor exists to stop anything. Reuse + no MFA is exactly how one old breach cascades.' },
];

export default function Practice() {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const cycle = (i) => {
    if (checked) return;
    setChoice((prev) => {
      const cur = prev[i];
      const b = ITEMS[i].buckets;
      const nextIdx = cur === undefined ? 0 : (b.indexOf(cur) + 1) % b.length;
      return { ...prev, [i]: b[nextIdx] };
    });
  };

  const reset = () => { setChoice({}); setChecked(false); };
  const picked = (i) => choice[i];
  const isCorrect = (i) => picked(i) === ITEMS[i].answer;
  const allAnswered = ITEMS.every((_, i) => picked(i) !== undefined);
  const score = ITEMS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

  const cardStyle = (i) => {
    const base = { border: '2px solid #ced4da', borderRadius: 8, padding: '12px 16px', margin: '8px 0',
      cursor: checked ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 };
    if (!checked) return base;
    return isCorrect(i)
      ? { ...base, border: '2px solid #198754', background: '#d4edda' }
      : { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  let lastSection = null;

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1>Passwords &amp; MFA</h1>
      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        Tap each card to choose, then press <strong>Check</strong>. Part A: is the password strong or
        weak? Part B: would MFA have stopped the attack?
      </div>

      {ITEMS.map((it, i) => {
        const header = it.section !== lastSection ? it.section : null;
        lastSection = it.section;
        return (
          <div key={i}>
            {header && <h3 style={{ marginTop: 20, marginBottom: 6, color: '#0d6efd' }}>{header}</h3>}
            <div style={cardStyle(i)} onClick={() => cycle(i)}>
              <span style={{ flex: 1 }}>{it.item}</span>
              <span style={{
                minWidth: 160, textAlign: 'center', padding: '6px 10px', borderRadius: 6, fontSize: 14,
                color: '#fff', background: picked(i) ? '#0d6efd' : '#adb5bd',
              }}>
                {picked(i) || 'tap to choose'}
              </span>
            </div>
            {checked && (
              <p style={{ margin: '2px 4px 10px', color: isCorrect(i) ? '#198754' : '#dc3545' }}>
                {isCorrect(i) ? '✓' : '✗'} {it.answer}. {it.reason}
              </p>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 16 }}>
        {!checked
          ? <button onClick={() => setChecked(true)} disabled={!allAnswered}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none',
                background: allAnswered ? '#0d6efd' : '#adb5bd', color: '#fff',
                cursor: allAnswered ? 'pointer' : 'not-allowed' }}>Check</button>
          : <button onClick={reset}
              style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: 'none', background: '#6c757d', color: '#fff', cursor: 'pointer' }}>Try Again</button>}
      </div>

      {checked && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 16, borderLeft: '4px solid #0d6efd' }}>
          <strong>Score: {score} / {ITEMS.length}.</strong> Length over complexity, never reuse, and turn on
          MFA — the more phishing-resistant the better. MFA blocks the large majority of credential attacks,
          even when the attacker already knows your password.
        </div>
      )}
    </div>
  );
}
