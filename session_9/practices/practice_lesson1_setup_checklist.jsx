import React, { useState } from 'react';

const correctOrder = [
  { id: 1, label: "Open the project folder in VS Code (File → Open Folder)" },
  { id: 2, label: "Open the integrated terminal (View → Terminal)" },
  { id: 3, label: "Create the venv: python -m venv .venv" },
  { id: 4, label: "Activate the venv (source .venv/bin/activate or .venv\\Scripts\\activate)" },
  { id: 5, label: "Select the venv Python as VS Code interpreter (click version in status bar)" },
  { id: 6, label: "Create requirements.txt with the packages you need" },
  { id: 7, label: "Run pip install -r requirements.txt inside the activated venv" },
  { id: 8, label: "Create README.md describing what the project does and how to run it" }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const consequences = {
  "3-before-2": "You need the terminal open to run `python -m venv .venv`. Open the terminal first.",
  "4-before-3": "You cannot activate a venv that does not exist yet. Create it first.",
  "7-before-4": "If you pip install before activating the venv, the packages go to your global Python — exactly what venvs are supposed to prevent.",
  "7-before-6": "You can pip install without requirements.txt, but then there is no record of what your project needs and no one (including future-you) can reproduce the environment.",
  "5-before-4": "You can pick the interpreter before activating, but most students forget — and then VS Code's Run button uses a different Python than the terminal. The most common Session 9 bug."
};

export default function Practice() {
  const [items, setItems] = useState(shuffle(correctOrder));
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const move = (idx, dir) => {
    if (submitted) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const a = [...items];
    [a[idx], a[newIdx]] = [a[newIdx], a[idx]];
    setItems(a);
  };

  const check = () => {
    const fb = [];
    let firstWrong = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== correctOrder[i].id) {
        if (firstWrong === -1) firstWrong = i;
        fb.push({ idx: i, ok: false });
      } else {
        fb.push({ idx: i, ok: true });
      }
    }
    setFeedback(fb);
    setSubmitted(true);
  };

  const reset = () => {
    setItems(shuffle(correctOrder));
    setSubmitted(false);
    setFeedback([]);
  };

  const allCorrect = submitted && feedback.every(f => f.ok);

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>VS Code Project Setup Checklist</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        Drag (or use the arrows) to put the 8 setup steps in the correct order. Get the order wrong and your project will be broken in ways that take an hour to debug.
      </p>

      {items.map((item, i) => {
        const fb = feedback[i];
        const bg = submitted ? (fb && fb.ok ? '#d4edda' : '#f8d7da') : '#fff';
        const border = submitted ? (fb && fb.ok ? '#198754' : '#dc3545') : '#dee2e6';
        return (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', margin: '6px 0', borderRadius: 8, border: `2px solid ${border}`, background: bg }}>
            <span style={{ width: 28, fontWeight: 'bold', color: '#666' }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {!submitted && (
              <span>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ marginLeft: 4, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: i === 0 ? 'default' : 'pointer' }}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={{ marginLeft: 4, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: i === items.length - 1 ? 'default' : 'pointer' }}>↓</button>
              </span>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check My Order</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          {allCorrect ? (
            <p><strong>All correct!</strong> This is the canonical setup ritual. Run it on every new project — it will save you hours of debugging later.</p>
          ) : (
            <div>
              <p><strong>Order is not quite right.</strong> Key reasons to get this exact sequence:</p>
              <ul style={{ lineHeight: 1.7 }}>
                <li>You must <strong>activate</strong> the venv before <strong>pip install</strong> — otherwise packages go to global Python.</li>
                <li>You must <strong>select the interpreter</strong> in VS Code or the Run button uses a different Python than your terminal (most common Session 9 bug).</li>
                <li>You need the <strong>terminal open</strong> before you can run `python -m venv .venv`.</li>
                <li><strong>requirements.txt</strong> should exist before you `pip install -r` so you have a reproducible record.</li>
                <li><strong>README.md</strong> goes last but must exist — it is how a colleague (or future-you) knows what the project does.</li>
              </ul>
            </div>
          )}
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
