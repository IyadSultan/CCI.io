import React, { useState } from 'react';

const questions = [
  {
    question: "When does health information become Protected Health Information (PHI)?",
    options: [
      "Whenever it is stored on a computer",
      "When health information is combined with an identifier that ties it to a specific person",
      "Only when it is written by a doctor",
      "Only when it leaves the hospital"
    ],
    correct: 1,
    explanation: "PHI = health information + an identifier pointing to a person. 'A patient had febrile neutropenia' is not PHI; 'Omar Haddad had febrile neutropenia' is. Either ingredient alone is usually harmless — it is the link to a specific person that creates the duty of care."
  },
  {
    question: "A dataset is fully encrypted. Is it still PHI?",
    options: [
      "No — encryption removes the identifiers, so it is de-identified",
      "Yes — encrypted PHI is still PHI; you have locked the filing cabinet, not emptied it",
      "No — encryption makes data anonymous",
      "Only if someone has the key"
    ],
    correct: 1,
    explanation: "Encryption scrambles the data but the identifiers are still in there, just locked. Encrypted PHI remains PHI. De-identification is different: it removes or transforms the identifiers so there is no longer a person to protect. Encryption guards the risk; de-identification removes it."
  },
  {
    question: "De-identification, encryption, and access control are:",
    options: [
      "Three names for the same thing",
      "Three different jobs — doing one does not do the others",
      "Only relevant to research data",
      "Interchangeable as long as you do at least one"
    ],
    correct: 1,
    explanation: "De-identification removes the identifiers; encryption scrambles the data so it cannot be read without a key; access control decides who is allowed in. You generally want all three. Your Session 11 app encrypted the name and encoded the MRN but had no login — that missing access control is why it was 'not for clinical use'."
  },
  {
    question: "The principle of 'minimum necessary' means:",
    options: [
      "Keep the minimum number of backups",
      "Use, access, and share only the least PHI required for the task at hand",
      "Spend the minimum money on security",
      "Write the shortest possible clinical note"
    ],
    correct: 1,
    explanation: "Pulling a whole-cohort export when you needed three columns, or opening a chart you are not treating, breaks minimum-necessary even if you never tell anyone. Curiosity is not authorisation — and a canary token (Lesson 6) is designed to catch exactly that kind of browsing."
  },
  {
    question: "A record has no name and no MRN. Why might it still not be safe to release?",
    options: [
      "Because all records are PHI forever",
      "Re-identification: a rare diagnosis plus an exact date plus a small town can point to one person even with no name",
      "Because it has not been encrypted",
      "It is always safe once the name is gone"
    ],
    correct: 1,
    explanation: "Stripping the 18 identifiers is the floor, not a guarantee. Data can carry no direct identifiers and still be traced to one person by the combination that remains — a rare tumour, an exact date, a small location, an age. For sensitive releases, someone must ask whether the leftover combination could still identify a single patient."
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
          {score >= 4 ? "Excellent — PHI = health info + identifier; de-id, encryption, and access control are three different jobs; and re-identification is real." : score >= 3 ? "Good — revisit why encrypted PHI is still PHI, and the minimum-necessary rule." : "Review the lesson — the 18 identifiers and the three distinct protections are the clinician's core."}
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
