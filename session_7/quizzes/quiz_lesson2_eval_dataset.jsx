import React, { useState } from 'react';

const questions = [
  {
    question: "You are starting a new evaluation dataset for the Oncology Summary Assistant. What is the best starting point?",
    options: [
      "Ask GPT-4 to generate 200 synthetic patient cases",
      "Use the MedQA public benchmark — it is well-validated",
      "Collect 20–50 real (or realistic) production traces and label them carefully — the error-analysis flywheel",
      "Wait until you have 1000+ cases before starting evaluation"
    ],
    correct: 2,
    explanation: "The error-analysis flywheel starts small with real traces. Synthetic-only datasets capture what the generator already understands and miss real failure modes. Public benchmarks rarely match your specific workflow. 20–50 well-labeled real cases beat 200 synthetic ones for predicting production behavior."
  },
  {
    question: "You decide to use synthetic data to expand your evaluation set. What is the critical rule?",
    options: [
      "Generate both inputs and outputs synthetically — it is faster",
      "Generate inputs only, then run those inputs through your real system to produce the outputs you evaluate",
      "Only use synthetic data from the same model you are evaluating",
      "Generate at least 1000 cases to drown out noise"
    ],
    correct: 1,
    explanation: "If you generate both inputs and outputs, you have measured nothing about your system — you have measured the generator. The rule is: synthetic INPUTS are fine (they expand coverage of edge cases), but the OUTPUTS must always come from your real system, because that is what you are evaluating."
  },
  {
    question: "Your team has 4 clinicians available to label cases. What should you do first?",
    options: [
      "Have all 4 label different cases in parallel to maximize throughput",
      "Pick ONE labeler as the authority — their rubric is the rubric. Others can flag disagreements, but the authority's call is ground truth. Re-introduce parallelism later by training others against the authority",
      "Have all 4 label the same cases and average their scores",
      "Use an LLM judge instead and skip human labeling"
    ],
    correct: 1,
    explanation: "Multiple labelers without a single authority produce inconsistencies that fight each other. The one-labeler authority principle trades parallelism for consistency, and consistency is what makes the dataset useful as a measurement instrument. You can train other labelers against the authority later, once inter-annotator agreement is high enough to trust them."
  },
  {
    question: "You measure Cohen's kappa between two annotators on a 50-case sample and get 0.42. What does this tell you?",
    options: [
      "Excellent agreement — ship the dataset",
      "Substantial agreement — slightly below ideal but acceptable",
      "Moderate agreement at best — your rubric is probably too vague or the guidelines do not cover edge cases. Refine the rubric, re-label, re-measure",
      "Cohen's kappa is irrelevant for clinical work"
    ],
    correct: 2,
    explanation: "Kappa of 0.42 is moderate agreement — below the ≥ 0.6 substantial-agreement threshold typically required for clinical evaluation work. The problem is almost always the rubric, not the annotators. Tighten the rubric with more examples and decision rules for edge cases, then re-measure. This iteration is unglamorous but essential."
  },
  {
    question: "Which dataset is most likely to catch regressions in clinical use?",
    options: [
      "500 GPT-4-generated synthetic cases",
      "50 carefully-labeled real cases covering the failure patterns observed in production",
      "1000 cases from MedQA",
      "5 hand-picked perfect cases"
    ],
    correct: 1,
    explanation: "50 high-quality cases beat 500 sloppy ones for clinical evaluation. The dataset should target the failure patterns you have actually seen, not the failures an LLM imagines you might have. As your tool matures the set grows — but the foundation is small, careful, and real."
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
          {score >= 4 ? "Excellent! You can build an evaluation dataset that actually predicts production behavior." : score >= 3 ? "Good — review the synthetic-data rule and Cohen's kappa interpretation." : "Review the error-analysis flywheel and the one-labeler authority principle."}
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
