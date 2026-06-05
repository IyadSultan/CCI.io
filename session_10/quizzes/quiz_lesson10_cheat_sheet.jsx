import React, { useState } from 'react';

const questions = [
  {
    question: "You wrote a PRD for a new clinical tool. What's the immediate next artifact you should produce?",
    options: [
      "A working prototype",
      "A CLAUDE.md distilling the PRD's non-negotiable rules",
      "A subagent for each role described in the PRD",
      "An MCP server for the data source"
    ],
    correct: 1,
    explanation: "The chain Session 10 teaches is PRD → CLAUDE.md → skills/subagents/hooks → worktree build → eval-gated deploy. CLAUDE.md is the immediate next step — it encodes the rules your PRD just produced so Claude follows them in every session."
  },
  {
    question: "Which of these belongs in the `deny` list of `.claude/settings.json` for a clinical AI project?",
    options: [
      "Bash(pytest *)",
      "Read(.env)",
      "Bash(git diff *)",
      "Read(*.md)"
    ],
    correct: 1,
    explanation: ".env files typically contain API keys, database passwords, and other secrets. Reading them into the context window risks leaking the keys via screenshots, transcripts, or copy-paste. The deny list keeps Claude from discovering these files entirely."
  },
  {
    question: "A critical finding from the Stage 7 implementation-validator means what?",
    options: [
      "Discard the work and start over",
      "Loop back to Stage 4 or 5, fix, re-run Stages 6 and 7",
      "Override the finding if the test passes",
      "File a follow-up ticket and merge anyway"
    ],
    correct: 1,
    explanation: "The Software Factory loop is explicit: critical findings at Stage 7 trigger a return to the appropriate builder stage (4 backend or 5 frontend), re-running the test-verifier (Stage 6) and the validator (Stage 7). Overriding the validator defeats the whole pipeline."
  },
  {
    question: "Which keystroke enters Plan Mode (Claude plans before editing)?",
    options: [
      "Ctrl+P",
      "Shift+Tab",
      "Esc Esc",
      "Cmd+L"
    ],
    correct: 1,
    explanation: "Shift+Tab toggles Plan Mode. Use it for any structural change — multi-file refactors, architecture changes, anything you'd waste twenty minutes on if Claude went down the wrong path. Read the plan, edit it with Ctrl+G if needed, then let Claude execute."
  },
  {
    question: "What's the single non-negotiable rule before shipping any clinical decision component?",
    options: [
      "Code review by another engineer",
      "Deploy behind a feature flag",
      "Verify against a frozen eval cohort with a binary regression gate",
      "Run the unit test suite"
    ],
    correct: 2,
    explanation: "The Software Factory pipeline gives speed. The eval cohort gives safety. They are not interchangeable. The AI Office discipline at KHCC is that no prompt or extraction-logic change ships without re-running the deceased-patient eval cohort — and if accuracy drops, the change does not ship, no exceptions."
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
        <h2>Session 10 Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent. You have the chain down — go build something." : score >= 3 ? "Solid grasp. Review the cheat sheet before your first real project." : "Re-read the cheat sheet and Lessons 8–9 before starting the ER triage build."}
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
