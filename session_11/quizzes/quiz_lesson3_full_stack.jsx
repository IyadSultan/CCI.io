import React, { useState } from 'react';

const questions = [
  {
    question: 'In the full-stack split, what is the frontend responsible for?',
    options: [
      'Storing patient records permanently',
      'Display and interaction in the browser, on the user’s screen',
      'Running the trusted clinical logic like the acuity rule',
      'Guarding API keys and other patients’ PHI',
    ],
    correct: 1,
    explanation: 'The frontend runs in the browser and is for display and interaction. It is a great place to show things and react to clicks, but a terrible place to keep things or guard secrets. Data and trusted logic belong on the backend instead.',
  },
  {
    question: 'A nurse submits a triage form. In the request/response cycle, what does the server do before sending its response?',
    options: [
      'Nothing — it forwards the form straight back to the browser unchanged',
      'It asks the browser to compute the acuity and trusts the result',
      'It validates the data, runs the acuity rule, saves a row, and asks the LLM — then responds',
      'It only draws the confirmation page; the browser saves the data',
    ],
    correct: 2,
    explanation: 'The server receives the request, does its work — validating, computing acuity, saving to the database, calling the LLM — and then sends back a finished response. The browser only asks and draws; the server is where the real work and the saving happen.',
  },
  {
    question: 'Why is the acuity calculation done on the backend rather than in the browser?',
    options: [
      'Because clinical logic the user must not be able to rewrite belongs on the backend',
      'Because the browser cannot do arithmetic',
      'Because it is faster to run JavaScript on the server',
      'Because the database refuses to store numbers computed in JavaScript',
    ],
    correct: 0,
    explanation: 'Acuity is trusted clinical logic, and anything that must be true has to be enforced on the backend. If it ran only in JavaScript, a user, a bug, or a stray copy-paste could bypass it. The frontend version is a courtesy; the backend version is the law.',
  },
  {
    question: 'Where does Django sit in the history of web development?',
    options: [
      'It is a brand-new, untested idea with no precedent',
      'It is a client-rendered single-page-app framework like a pure React app',
      'It is a server-side-rendering backend framework in the lineage of ASP and PHP',
      'It is a database engine that replaces SQL',
    ],
    correct: 2,
    explanation: 'Django does server-side rendering: a request arrives, Python runs, data is baked into an HTML template, and the finished page is sent back. This is exactly the pattern ASP and PHP pioneered in the late 1990s and 2000s. Django is a mature, batteries-included expression of a thirty-year-old idea, not a novelty to fear.',
  },
  {
    question: 'Which is an example of the expensive mistake of "leaking a secret"?',
    options: [
      'Re-validating a temperature on the backend after the browser checked it',
      'Sending an OpenAI API key or another patient’s PHI to the browser',
      'Storing the acuity score in the database',
      'Turning a button blue when the mouse hovers over it',
    ],
    correct: 1,
    explanation: 'Anything sent to the browser can be read by anyone, full stop. An API key, a database password, or another patient’s PHI that reaches the frontend is exposed. Secrets and PHI not meant for this user must stay on the backend.',
  },
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
          {score >= 4 ? "Excellent! You can draw the request/response cycle and say exactly which work goes frontend, backend, or database — and why secrets and trusted logic stay on the server." : score >= 3 ? "Good start. Review the frontend/backend split and the two expensive mistakes: trusting the browser and leaking a secret." : "Review the lesson — frontend is display/interaction, backend is data and trusted logic, and the browser is never the law."}
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
