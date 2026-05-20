import React, { useState } from 'react';

const scenarios = [
  {
    title: "You want to see which files have changed",
    options: ["git status", "git add .", "git commit -m 'changes'", "git push", "git pull", "git restore <file>", "git log"],
    correct: "git status",
    explanation: "`git status` shows the current state of every file — modified, staged, untracked. It is the most-used command and the answer 80% of the time when you are confused about git."
  },
  {
    title: "You finished a feature and want to record a snapshot locally (not push yet)",
    options: ["git status", "git add . && git commit -m 'add feature'", "git push", "git pull", "git restore .", "git log"],
    correct: "git add . && git commit -m 'add feature'",
    explanation: "Two-step: `git add .` stages all changes, then `git commit -m '...'` saves the snapshot locally. The commit is local only until you `git push`."
  },
  {
    title: "You accidentally typed random characters into app.py and want to throw away the change (revert to the last committed version)",
    options: ["git push", "git commit -m 'undo'", "git restore app.py", "git status", "Delete app.py and pull again"],
    correct: "git restore app.py",
    explanation: "`git restore <file>` discards uncommitted changes in the working directory and reverts the file to its last committed state. Use it when you want to throw away a recent edit."
  },
  {
    title: "Your committed code is on your laptop. You want to upload it to GitHub.",
    options: ["git status", "git add .", "git commit", "git push", "git pull"],
    correct: "git push",
    explanation: "`git push` uploads your local commits to the remote (GitHub). It only works after `git commit` — push moves committed snapshots, not uncommitted edits."
  },
  {
    title: "A colleague pushed changes to GitHub. You want to pull those changes down to your laptop before you start working.",
    options: ["git status", "git push", "git pull", "git commit", "git restore"],
    correct: "git pull",
    explanation: "`git pull` fetches commits from GitHub and merges them into your local branch. Always pull before starting work if anyone else might have pushed in between."
  },
  {
    title: "You ran `git push` and got: 'Updates were rejected because the remote contains work that you do not have.'",
    options: ["git push --force", "git pull, then git push again", "Delete the repo and start over", "git restore ."],
    correct: "git pull, then git push again",
    explanation: "GitHub has commits you don't. `git pull` brings them into your branch and merges. Then `git push` works. NEVER `--force` push to fix this — it overwrites your colleague's work."
  }
];

export default function Practice() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[current];

  const check = () => {
    setScores([...scores, selected === s.correct ? 1 : 0]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrent(c => c + 1);
    setSelected(null);
    setSubmitted(false);
  };

  const reset = () => {
    setCurrent(0); setSelected(null); setSubmitted(false); setScores([]);
  };

  const total = scores.reduce((a, b) => a + b, 0);

  if (current >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Git Command Picker Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {total} / {scenarios.length}</p>
        <div style={{ background: total >= 5 ? '#d4edda' : total >= 4 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {total >= 5 ? "Excellent! You know the day-to-day git commands." : total >= 4 ? "Good — review the recovery scenarios (restore, pull-then-push)." : "Review the lesson on git states and commands."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {current + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, color: '#444' }}>Which git command (or sequence) is correct?</p>
      {s.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(opt)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt === s.correct ? '#198754' : opt === selected ? '#dc3545' : '#dee2e6') : opt === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt === s.correct ? '#d4edda' : opt === selected && opt !== s.correct ? '#f8d7da' : '#fff') : '#fff',
          fontFamily: 'monospace'
        }}>{opt}</div>
      ))}

      {!submitted && <button onClick={check} disabled={!selected} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: !selected ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>{selected === s.correct ? 'Correct!' : 'Not quite.'}</strong></p>
          <p>{s.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{current + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
