import React, { useState } from 'react';

// Lesson 1 practice — "Open to the street, or shut?"
// Decide which doors (ports/services) a public web server should expose to the
// internet, and which must stay inside-only or shut. Tap a card to set its answer.

const BUCKETS = ['Open to public', 'Inside-only / shut'];
const COLORS = { 'Open to public': '#0d6efd', 'Inside-only / shut': '#6f42c1' };

const ITEMS = [
  { item: 'Port 443 — HTTPS (the encrypted website door)', answer: 'Open to public',
    reason: 'A public site must be publicly reachable. 443 is the one door that belongs open to the street.' },
  { item: 'Port 22 — SSH (remote command-line login)', answer: 'Inside-only / shut',
    reason: 'The staff service entrance. Left open to the whole internet, scanners knock on it all day. Restrict it to known addresses.' },
  { item: 'Port 3389 — RDP (remote desktop control)', answer: 'Inside-only / shut',
    reason: 'The "drive my whole computer from afar" door. Never expose it to the public internet.' },
  { item: 'Port 80 — HTTP (unencrypted website)', answer: 'Inside-only / shut',
    reason: 'Plain HTTP is a postcard (Lesson 2). A clinical site serves on 443; 80 is at most redirected, not left serving real traffic.' },
  { item: 'An internal database listening on its own port', answer: 'Inside-only / shut',
    reason: 'A database needs no street door at all. The strongest move is to give it no public door in the first place.' },
];

export default function Practice() {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const cycle = (i) => {
    if (checked) return;
    setChoice((prev) => {
      const cur = prev[i];
      const nextIdx = cur === undefined ? 0 : (BUCKETS.indexOf(cur) + 1) % BUCKETS.length;
      return { ...prev, [i]: BUCKETS[nextIdx] };
    });
  };

  const reset = () => { setChoice({}); setChecked(false); };
  const picked = (i) => choice[i];
  const isCorrect = (i) => picked(i) === ITEMS[i].answer;
  const allAnswered = ITEMS.every((_, i) => picked(i) !== undefined);
  const score = ITEMS.reduce((n, _, i) => n + (isCorrect(i) ? 1 : 0), 0);

  const cardStyle = (i) => {
    const base = { border: '2px solid #ced4da', borderRadius: 8, padding: '12px 16px', margin: '10px 0',
      cursor: checked ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    if (!checked) return base;
    return isCorrect(i)
      ? { ...base, border: '2px solid #198754', background: '#d4edda' }
      : { ...base, border: '2px solid #dc3545', background: '#f8d7da' };
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui', color: '#212529' }}>
      <h1>Open to the street, or shut?</h1>
      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        A web server should <strong>open the minimum</strong>. For each door below, tap to choose
        whether it belongs <strong>open to the public</strong> or <strong>inside-only / shut</strong>.
        Then press <strong>Check</strong>.
      </div>

      {ITEMS.map((it, i) => (
        <div key={i} style={cardStyle(i)} onClick={() => cycle(i)}>
          <span>{it.item}</span>
          <span style={{
            minWidth: 150, textAlign: 'center', padding: '6px 10px', borderRadius: 6, fontSize: 14,
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
              {isCorrect(i) ? '✓' : '✗'} <strong>{it.item.split(' — ')[0]}:</strong> {it.answer}. {it.reason}
            </p>
          ))}
        </div>
      )}

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
          <strong>Score: {score} / {ITEMS.length}.</strong> The rule from Lesson 1: open only 443 to the
          public, keep login doors like 22 and 3389 off the public internet, and let the firewall (the
          reception desk) turn everyone else away.
        </div>
      )}
    </div>
  );
}
