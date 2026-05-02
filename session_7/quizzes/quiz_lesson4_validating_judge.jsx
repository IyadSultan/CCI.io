import React, { useState } from 'react';

const questions = [
  {
    question: "You build an LLM judge for clinical relevance, run it on 500 cases, and report an average score of 4.2 / 5. Why is this number, on its own, untrustworthy?",
    options: [
      "Because 500 cases is too few",
      "Because the judge has not been validated against clinician labels — its scores may be systematically biased and you have no way to know",
      "Because the judge model is too small",
      "Because LLM judges always overscore"
    ],
    correct: 1,
    explanation: "An unvalidated judge produces a number, but the number is meaningless until you have measured how well it agrees with clinicians on a labeled baseline. Validation — the judge-clinician alignment loop — is the step that turns the judge from a black box into a calibrated measurement instrument."
  },
  {
    question: "What are the steps of the judge–clinician alignment loop?",
    options: [
      "Build judge → ship → fix in production",
      "Build judge → run on labeled baseline → measure agreement → diagnose disagreements → refine prompt → re-measure (iterate until threshold)",
      "Build judge → ask clinician if it is good → ship",
      "Build judge → run on 10,000 cases → report average"
    ],
    correct: 1,
    explanation: "The loop is: pick a small labeled baseline → run the judge → compute agreement → inspect disagreements case-by-case → refine the judge prompt with targeted few-shot examples and anti-bias instructions → re-measure. Iterate until agreement crosses the trust threshold for the metric type."
  },
  {
    question: "You measure Cohen's kappa between your LLM judge and clinician labels and get 0.45 on a categorical (correct/partial/incorrect) task. What does this tell you?",
    options: [
      "Excellent agreement — ship it",
      "Substantial agreement — ship it",
      "Moderate agreement at best — below the ≥ 0.6 substantial threshold typically needed for clinical work; the judge needs prompt refinement before it can drive decisions",
      "Cohen's kappa is irrelevant for LLM judges"
    ],
    correct: 2,
    explanation: "Kappa of 0.45 is moderate — it means your judge agrees with clinicians more than chance, but not enough to trust as a measurement instrument. Inspect the disagreements, refine the prompt with targeted few-shot examples, and re-measure. If after 2–3 iterations you cannot pass the threshold, the metric may not be amenable to LLM judging and you should fall back."
  },
  {
    question: "When sizing your alignment baseline, what is the right rule?",
    options: [
      "Use the largest baseline you can afford — more is always better",
      "Use the smallest baseline that gives signal (often ~50 cases), but make sure it covers the range of inputs and includes the failure modes you most care about",
      "Use only easy cases to give the judge a fair start",
      "Use 1000+ cases to drown out noise"
    ],
    correct: 1,
    explanation: "Quality over quantity at this stage. Fifty well-chosen cases — covering the range and including hard cases — beat 500 sloppy ones. The baseline must include the failure modes you observed in production; otherwise the judge can pass the threshold on easy cases and still be wrong where it matters."
  },
  {
    question: "Did Session 6 already cover the four DeepEval RAG metrics (Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall)? Do you need to re-teach them in Session 7?",
    options: [
      "No, Session 6 did not cover them — teach all four from scratch in Lesson 4",
      "Yes — Session 6 covered the four DeepEval RAG metrics in detail. Session 7 references back to them for RAG-style tools but adds the general LLM-judge validation loop you apply to any custom judge you write yourself",
      "Session 6 covered only Faithfulness — re-teach the other three",
      "DeepEval is deprecated — do not use it"
    ],
    correct: 1,
    explanation: "Session 6 covered the four DeepEval RAG metrics with the Wilms tumor pipeline. Session 7 does not repeat them; instead it adds the general validation method (judge-clinician alignment loop) that applies to any custom LLM judge you write — including the DeepEval ones, which themselves should be spot-checked on your specific clinical data."
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
          {score >= 4 ? "Excellent! You will not ship an unvalidated judge." : score >= 3 ? "Good — review Cohen's kappa thresholds and the alignment loop steps." : "Review the judge-clinician alignment loop and why an unvalidated judge produces meaningless numbers."}
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
