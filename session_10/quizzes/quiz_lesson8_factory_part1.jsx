import React, { useState } from 'react';

const questions = [
  {
    question: "In the Software Factory pipeline, what does Stage 1 (codebase-researcher) produce — and what does it NOT produce?",
    options: [
      "It produces working Python code; it does not produce documentation",
      "It produces a file inventory, public surfaces, existing tests, and a risks list; it does NOT produce code or recommendations for new features",
      "It produces the user story; the story-writer just reviews it",
      "It produces the technical brief that the backend-builder will execute against"
    ],
    correct: 1,
    explanation: "codebase-researcher is read-only by design (its only tools are Read, Grep, Glob) and runs on Haiku for speed. Its job is to remove uncertainty for the next stage — what's there, what's missing, what's fragile — not to write code and not to make recommendations. Story-writer (Stage 2) writes the story; spec-writer (Stage 3) writes the brief."
  },
  {
    question: "The story-writer returns a user story PLUS acceptance criteria. What makes an acceptance criterion correctly written?",
    options: [
      "It is at least three sentences long and uses formal language",
      "It is independently checkable — a reader can confirm yes/no whether the implementation satisfies it",
      "It names the specific Python file that will implement it",
      "It quotes the PRD verbatim"
    ],
    correct: 1,
    explanation: "An acceptance criterion is a contract. 'The form rejects out-of-range vitals with a field-level error and re-renders' is checkable. 'The form should be user-friendly' is not. Length and formality don't matter; checkability does. Implementation details (which Python file) belong in the technical brief, not the story."
  },
  {
    question: "Why does the pipeline have three approval gates (after the story, after the brief, after the validator) instead of one big review at the end?",
    options: [
      "Three gates is just a freeCodeCamp convention with no real reason",
      "If a wrong story is approved and the brief and code build on it, every downstream artifact is wrong; gating early catches errors before they propagate",
      "The gates are there to slow Claude down so it uses fewer tokens",
      "Each gate triggers a different model — Haiku at gate 1, Sonnet at gate 2, Opus at gate 3"
    ],
    correct: 1,
    explanation: "Approval gates are read-backs. A wrong story makes a wrong brief; a wrong brief makes wrong code. Catching the error at the gate where the artifact was produced is orders of magnitude cheaper than catching it at the end. The medical analogy in the lesson: read-back orders, signed consent, attending sign-off. Same discipline."
  },
  {
    question: "Beyond the user story, what does a technical brief from the spec-writer contain?",
    options: [
      "Just the rewritten story in more technical language",
      "Data model, services, views/URL routes, a named test list, and the complete list of files to be created or modified",
      "The Azure deployment scripts and the production secrets",
      "Only the test list — the rest is left to the backend-builder to invent"
    ],
    correct: 1,
    explanation: "The brief is the contract Stage 4 executes against. It names every file, every service, every test. If the brief is missing a field, the build stage won't write it. If the brief is missing a test, the test-verifier won't check it. The brief is also the document the validator reads at Stage 7 to decide whether the code matches the design. Vagueness here propagates everywhere."
  },
  {
    question: "Why is the codebase-researcher subagent assigned to Haiku while the story-writer and spec-writer are on Sonnet?",
    options: [
      "Haiku is the only model with file-reading tools",
      "Inventory work is mechanical and bounded; Haiku is fast and cheap and good enough. Writing the story and the brief is where the actual judgment happens, which is what Sonnet is worth paying for",
      "Haiku is more accurate at reading code than Sonnet",
      "The model assignments are random — they make no difference to output quality"
    ],
    correct: 1,
    explanation: "Pick the cheapest model that can do the job. Walking a file tree and listing exports is mechanical — Haiku does it well in seconds. Writing a precise acceptance-criteria list or a technical brief requires judgment about what to include, what to leave out, and how to phrase it — that's Sonnet's job. This is the same model-selection logic you wired into Lesson 5."
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
          {score >= 4 ? "Excellent — you understand the front half of the Software Factory and why the gates matter." : score >= 3 ? "Good foundation — re-read the approval-gates section before Lesson 9." : "Review Lesson 8. The pipeline discipline is the point of the capstone."}
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
