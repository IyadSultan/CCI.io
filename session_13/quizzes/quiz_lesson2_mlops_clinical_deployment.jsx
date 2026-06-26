import React, { useState } from 'react';

const questions = [
  {
    question: "What is the core idea of MLOps in clinical practice?",
    options: [
      "Training the largest possible neural network",
      "Everything that turns a trained model into a reliable, monitored clinical service — including versioning, deployment, monitoring, and rollback",
      "Replacing software engineers with data scientists",
      "Publishing accuracy once before go-live"
    ],
    correct: 1,
    explanation: "MLOps is the operational loop around ML: define, data, train, validate, deploy, monitor, retrain or retire. Without it, models fail quietly — still returning numbers while inputs and populations drift."
  },
  {
    question: "Why is 'feature parity' critical at deployment time?",
    options: [
      "It makes the UI look consistent",
      "Training and production must send the same features in the same format — mismatched columns or units can produce silent wrong outputs",
      "It is only needed for image models",
      "It replaces clinical validation"
    ],
    correct: 1,
    explanation: "If production labs use different units or missing columns than training, the model may not crash — it may just be wrong. Feature parity is a deployment discipline, not a cosmetic check."
  },
  {
    question: "Which monitoring signal best catches 'the world changed but the model did not'?",
    options: [
      "Git commit count",
      "Input drift — patient mix, documentation style, or lab format shifting over time",
      "Number of Jupyter notebooks",
      "Marketing page visits"
    ],
    correct: 1,
    explanation: "Input drift means the data arriving at the model no longer matches what it learned from. That is a leading indicator of performance drift — especially dangerous when outputs still look confident."
  },
  {
    question: "A model passes held-out AUROC on a single hospital dataset. What is still missing before ward use?",
    options: [
      "Nothing — AUROC is sufficient for clinical deployment",
      "Clinical and operational validation: realistic workflow fit, subgroup performance, and safe fallback when the model is down or uncertain",
      "A larger logo on the dashboard",
      "Removal of human override to reduce variance"
    ],
    correct: 1,
    explanation: "Technical metrics are necessary, not sufficient. Clinical validation asks whether decisions improve on real cases; operational validation asks whether staff can use it safely. MLOps without those layers is fast wrongness."
  },
  {
    question: "What should happen when model version changes from v1.4 to v1.5 in production?",
    options: [
      "Silent swap — clinicians should not be bothered",
      "Version logged on every prediction; clinicians told what changed; rollback path tested",
      "Delete all v1.4 logs to save storage",
      "Disable monitoring until the next quarter"
    ],
    correct: 1,
    explanation: "Version pinning and change communication are basic MLOps. Every prediction should trace to a version; updates need clinical re-approval when appropriate; rollback must be rehearsed, not imaginary."
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
          {score >= 4 ? "Excellent — you understand the clinical ML lifecycle and what production really requires." : score >= 3 ? "Good — review monitoring, feature parity, and the gap between technical and clinical validation." : "Review Lesson 2 — MLOps is the loop that keeps models safe after the notebook ends."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#1565C0', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#1565C0', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#1565C0' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#E3F2FD', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #1565C0' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#1565C0', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
