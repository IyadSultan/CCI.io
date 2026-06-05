import React, { useState } from 'react';

const questions = [
  {
    question: "What does Stage 6 (test-verifier) produce — and how is its output different from the unit tests written in Stage 4?",
    options: [
      "It produces nothing — Stage 4 already wrote all the tests",
      "It produces a single end-to-end acceptance test that exercises the user story; the Stage 4 unit tests cover the individual pieces",
      "It produces a test report, not new tests",
      "It produces deployment scripts that wrap the unit tests"
    ],
    correct: 1,
    explanation: "Unit tests (Stage 4) check that AcuityCalculator returns the right number, that the extractor schema parses, that the view smoke-renders. The acceptance test (Stage 6) is one test that posts a real payload to /triage/new and asserts the right TriageEvent exists with the right acuity and flags. It proves the pieces wire up; the unit tests prove the pieces work."
  },
  {
    question: "Stage 7 (implementation-validator) caught a planted bug in the lesson. What was the bug?",
    options: [
      "The acuity calculator used the LLM instead of pure Python",
      "The OncologicEmergencyExtractor called Azure OpenAI without a try/except, so a network timeout would 500 the nurse form and lose the triage row",
      "The Patient model stored MRNs in plaintext",
      "The form accepted negative ages"
    ],
    correct: 1,
    explanation: "The brief's acceptance criterion 10 required graceful degradation when the LLM call fails. The backend-builder shipped without the try/except. The validator (read-only, comparing code to brief) caught it. This is exactly the failure mode CLAUDE.md Rule 12 names: silent failures in clinical pipelines are worse than crashes. A nurse losing a triage row because Azure had a 30-second blip is unacceptable."
  },
  {
    question: "After Stage 7 reports a CRITICAL finding, what happens — and what does NOT happen?",
    options: [
      "The pipeline halts permanently; the work is abandoned",
      "The implementation-validator fixes the bug itself, then re-validates",
      "Control loops back to Stage 4 (or 5) for a fix; then Stages 6 and 7 re-run. The validator never writes code itself",
      "The user must manually rewrite the affected file outside the pipeline"
    ],
    correct: 2,
    explanation: "The 4↔7 loop is the pipeline's correction mechanism. Validator (read-only) reports → builder (write-capable) fixes → test-verifier re-runs → validator re-validates. The validator's read-only-ness is what makes its findings trustworthy: it has no incentive to declare itself done. Keeping write and verify in different agents is the separation of concerns that makes the pipeline work."
  },
  {
    question: "Why does the lesson recommend wiring an eval-suite hook into .claude/settings.json after the app is built?",
    options: [
      "The hook is cosmetic — it just makes the terminal output prettier",
      "The hook automatically re-runs the test suite whenever a file under triage/services/ is edited, so no future prompt or service change can silently regress",
      "The hook is required to deploy to Azure",
      "The hook charges the AI Office for each agent call"
    ],
    correct: 1,
    explanation: "The eval-suite hook is the post-build safety net. In production it would re-run the full eval cohort against aidi_catalog.dbo.eval_runs; in the capstone it re-runs the local pytest suite. Either way, the shape is the same: any change to a service file triggers verification automatically. This is how you prevent a 'small prompt tweak' from quietly breaking the schema or dropping a sensitivity baseline."
  },
  {
    question: "Which of the following is NOT part of the implementation-validator's job?",
    options: [
      "Reading every file the brief said would be created or modified",
      "Classifying findings as CRITICAL / IMPORTANT / MINOR",
      "Fixing the bugs it finds and editing the code itself",
      "Confirming each acceptance criterion is satisfied by some part of the code"
    ],
    correct: 2,
    explanation: "The validator NEVER writes code. Its tools are Read, Grep, and Glob only — by design. The moment a validator can edit code, it has an incentive to make its own findings disappear, and you lose the trustworthy second opinion. Fixing is the backend-builder's job (or frontend-builder's). The validator finds; the builder fixes; the validator re-validates. That separation is the pipeline."
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
          {score >= 4 ? "Excellent — you understand the build-test-validate loop and why the validator stays read-only." : score >= 3 ? "Good — re-read the 4↔7 loop section and the eval-hook discussion." : "Review Lesson 9. The validator/builder separation is the heart of the pipeline."}
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
