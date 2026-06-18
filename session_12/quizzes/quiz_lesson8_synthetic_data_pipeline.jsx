import React, { useState } from 'react';

const questions = [
  {
    question: "According to the AI Office doctrine, what is the safest patient data?",
    options: [
      "Data that is heavily encrypted",
      "Data that was never real — realistic-but-fake synthetic data",
      "Data stored on a server with no internet connection",
      "Data that only senior doctors can access"
    ],
    correct: 1,
    explanation: "Encryption, access control, and firewalls all guard data that is still dangerous. Synthetic data removes the danger at the source: there is no real patient to re-identify, no chart to subpoena, no duty of care. The safest patient data is data that was never real."
  },
  {
    question: "What is the difference between a reactive and a preventive posture toward PHI?",
    options: [
      "Reactive is faster; preventive is slower",
      "Reactive guards dangerous data wherever it lands and must never fail; preventive makes the data safe once, at the source",
      "They are the same approach with different names",
      "Preventive means deleting all data immediately"
    ],
    correct: 1,
    explanation: "Reactive security lets real PHI flow everywhere and then tries to protect every copy — exhausting, and you only have to slip once. Preventive de-identification makes the data safe by default, at the source, before any output exists. The doctrine is the preventive posture made into an unmissable habit."
  },
  {
    question: "When you run the PHI scanner on the synthetic generator's output, you get zero findings. Why?",
    options: [
      "The scanner is broken or lazy",
      "The generator put nothing identifying into the shareable notes — every MRN was encoded and every name encrypted before output, and the prose carries no identifiers",
      "Synthetic data is never scanned",
      "The scanner skips files it created"
    ],
    correct: 1,
    explanation: "It is the doctrine working, not the scanner failing. The generator applies rules 1 and 2 — encode every MRN, encrypt every name — before writing, and the free-text notes carry no identifiers at all. The same rules that lit up the dirty note find nothing, because there is nothing to find."
  },
  {
    question: "Which of these is a 'leaky generator' that does NOT produce genuinely safe synthetic data?",
    options: [
      "One that builds each record fresh from distributions and rules",
      "One that takes real charts and just swaps the name, keeping the real MRN, date, and rare diagnosis",
      "One that encodes every MRN and encrypts every name",
      "One whose output scans to zero findings"
    ],
    correct: 1,
    explanation: "Lightly editing real records — change the name, keep the real MRN, date, and rare diagnosis — is not synthetic data; it is thinly-disguised real data that can be re-identified. Genuinely synthetic data is generated from distributions and rules, so nothing real survives."
  },
  {
    question: "In the doctrine, where do the encryption keys live?",
    options: [
      "Hard-coded in the source code so the app always works",
      "Emailed to the team so everyone has a copy",
      "In a managed secret vault, never in the code, never committed",
      "Written on a sticky note by the server"
    ],
    correct: 2,
    explanation: "Rule 3: keys live in a managed key vault, pulled at runtime, never hard-coded or committed. Your Session 11 app read them from environment variables as a teaching stand-in; production uses the AI Office's vault with key rotation and access logging behind it."
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
          {score >= 4 ? "Excellent — safe by design: encode every MRN, encrypt every name, keys in a vault, and synthetic data so there is nothing to leak." : score >= 3 ? "Good — revisit why a 'leaky generator' isn't safe and why the scan returns zero." : "Review the lesson — preventive de-identification makes data safe before it can move."}
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
