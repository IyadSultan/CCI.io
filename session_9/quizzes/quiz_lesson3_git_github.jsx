import React, { useState } from 'react';

const questions = [
  {
    question: "You edited app.py. You haven't run any git commands yet. What state is the change in?",
    options: [
      "Committed",
      "Staged",
      "Working directory (modified, not yet staged)",
      "Pushed to GitHub"
    ],
    correct: 2,
    explanation: "The flow is working directory → staged → committed → pushed. Just editing a file puts the change in the working directory. `git add` moves it to staged. `git commit` saves a snapshot locally. `git push` uploads to GitHub."
  },
  {
    question: "You run `git status` and see a new file `.venv/` in the list of untracked changes. What should you do?",
    options: [
      "Run git add .venv/ and commit — it's part of your project",
      "Add `.venv/` to .gitignore BEFORE committing — venvs are hundreds of MB and should never be in git",
      "Delete the .venv folder",
      "Push it anyway — GitHub handles large folders"
    ],
    correct: 1,
    explanation: ".venv contains hundreds of MB of installed packages, regenerated from requirements.txt by anyone who clones the repo. If .venv shows up in `git status`, your .gitignore is missing the entry. Fix .gitignore first, then commit. This is the pre-flight check before every push."
  },
  {
    question: "What does `git status` actually show you?",
    options: [
      "Only files that have been committed",
      "The state of every file: untracked, modified, staged, or up-to-date",
      "A summary of all git commands run today",
      "How many commits ahead of GitHub you are, nothing else"
    ],
    correct: 1,
    explanation: "`git status` is the most-used git command. It tells you which files are untracked, modified, staged for the next commit, and whether your local branch is ahead/behind the remote. When you are confused about git, `git status` is the first answer."
  },
  {
    question: "You push and get: `error: failed to push some refs ... Updates were rejected because the remote contains work that you do not have`. What does this mean?",
    options: [
      "GitHub is down",
      "Your code has a bug",
      "Someone else (or you on another machine) pushed commits to GitHub that you don't have locally — you need to git pull first",
      "Your authentication failed"
    ],
    correct: 2,
    explanation: "GitHub has commits your local clone is missing. Git refuses to overwrite them. Run `git pull` to merge the remote commits into your branch, then `git push` again. NEVER use `git push --force` to bypass this — it overwrites the other person's work."
  },
  {
    question: "What is the safest authentication method for a new student pushing their first repo to GitHub?",
    options: [
      "Type your GitHub password into the terminal",
      "HTTPS + Personal Access Token (PAT) — generate a PAT in GitHub settings and use it as the 'password' when prompted",
      "Copy your password into the URL like https://user:pass@github.com/...",
      "Disable authentication on the repo"
    ],
    correct: 1,
    explanation: "GitHub disabled password authentication for git operations years ago. You either use a Personal Access Token (PAT) over HTTPS — easiest to set up — or an SSH key — cleaner long-term. Both are safe; never embed passwords in URLs and never type your actual GitHub login password into a git command."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand the git mental model." : score >= 3 ? "Good — review the four states (working/staged/committed/pushed)." : "Review the lesson before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
