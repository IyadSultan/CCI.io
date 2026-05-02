import React, { useState } from 'react';

const questions = [
  {
    question: "You want to check that every Oncology Summary Assistant output includes a stage in valid TNM format (e.g., T2N1M0). Which evaluator family should you use?",
    options: [
      "LLM-as-judge with a clinical-relevance rubric",
      "Functional evaluator (a regex or schema validator) — it is structure you can express in code",
      "Human evaluator only",
      "All three at once"
    ],
    correct: 1,
    explanation: "Functional first. Anything you can express as code (formats, required fields, numeric ranges, refusals) should be a functional check — it is instant, free, perfectly reproducible, and unambiguous. Reserve LLM judges for properties that resist code."
  },
  {
    question: "You want to score whether the summary captures the clinically most important findings from the input case. Which evaluator family fits best?",
    options: [
      "Functional evaluator — write a regex that checks for keywords",
      "LLM-as-judge with a rubric like 'rate clinical relevance 1–5' — this is the kind of judgment that resists code",
      "Use only human evaluators",
      "Use exact string matching against a reference summary"
    ],
    correct: 1,
    explanation: "Clinical relevance is exactly the kind of subjective, context-dependent judgment that functional checks cannot capture and that LLM judges handle well. You write a clear rubric, you validate the judge against human labels (next lesson), then you can use it at scale."
  },
  {
    question: "Which of these is a known bias of LLM-as-judge evaluators?",
    options: [
      "They prefer shorter answers because shorter is faster to read",
      "Position bias (in pairwise comparisons, preference for first or second option) — and verbosity bias, self-preference, format bias, and inconsistency at non-zero temperature",
      "They are immune to biases when temperature is set to 0",
      "They always agree with human annotators"
    ],
    correct: 1,
    explanation: "LLM judges have a documented bias catalog: position, verbosity (preference for LONGER answers), self-preference (preference for outputs from their own model family), format, and inconsistency. Each has a mitigation — randomize positions, length-normalize, use a jury, follow training format, run with self-consistency."
  },
  {
    question: "Why is pairwise comparison generally more robust than absolute 1–5 scoring with an LLM judge?",
    options: [
      "Pairwise comparison is faster to compute",
      "'Is A better than B' is a question judges answer reliably; '1–5 scoring' suffers from scale drift, compression, and inconsistency",
      "Absolute scoring is forbidden by clinical guidelines",
      "Pairwise comparison does not require a rubric"
    ],
    correct: 1,
    explanation: "Pairwise comparison is structurally easier for the judge: it is a discrimination task, not an absolute calibration task. Absolute scoring drifts (yesterday's '4' is today's '3'), compresses (every output gets a 4), and is inconsistent across runs. When you can structure an evaluation as pairwise, do so."
  },
  {
    question: "Where should human evaluation sit in a mature evaluation pipeline for the Oncology Summary Assistant?",
    options: [
      "Humans should evaluate every CI run",
      "Humans should never be used — LLM judges are sufficient",
      "Humans build the labeled ground-truth dataset that other evaluators are validated against, and act as a final check on a small sample of production traces; the bulk of CI runs use functional + LLM-judge evaluators",
      "Humans should only be used for failure analysis"
    ],
    correct: 2,
    explanation: "Humans are the gold standard for what matters most (clinical correctness, safety) but do not scale. The right pattern: humans produce ground truth (Lesson 2) and review a sample of production traces; functional and LLM-judge evaluators carry the load on every CI run. Trying to use humans for every run is unsustainable; skipping humans entirely is risky."
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
          {score >= 4 ? "Excellent! You can choose the right evaluator family for any metric." : score >= 3 ? "Good — review the LLM-judge bias catalog and the pairwise-vs-scoring rule." : "Review the three evaluator families and the 'functional first, judge second, human as ground truth' rule."}
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
