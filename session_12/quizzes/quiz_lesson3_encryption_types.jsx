import React, { useState } from 'react';

const questions = [
  {
    question: "What is the key difference between symmetric and asymmetric encryption?",
    options: [
      "Symmetric is older and no longer used; asymmetric replaced it entirely",
      "Symmetric uses one shared key for both locking and unlocking; asymmetric uses a public/private key pair",
      "Symmetric works only at rest; asymmetric works only in transit",
      "Symmetric is illegal for medical data; asymmetric is required"
    ],
    correct: 1,
    explanation: "Symmetric encryption uses a single shared secret key to both encrypt and decrypt — fast, but both sides must already share the key. Asymmetric uses a public/private pair: anyone can encrypt with the public key, but only the holder of the private key can decrypt. Asymmetric solves the problem of how to exchange a key safely in the first place."
  },
  {
    question: "Encryption 'at rest' versus 'in transit' — which pair is correct?",
    options: [
      "At rest = data moving over the network; in transit = data sitting in storage",
      "At rest = data sitting in storage (the database, the disk); in transit = data moving over the network",
      "They mean the same thing",
      "At rest applies only to backups; in transit applies only to email"
    ],
    correct: 1,
    explanation: "In transit protects data while it moves (TLS/HTTPS — the sealed envelope from Lesson 2). At rest protects data while it sits stored on a disk or in a database. You want both: a system can encrypt traffic perfectly and still leave the stored database readable to anyone who steals the disk."
  },
  {
    question: "In your Session 11 app, the patient's name was Fernet-encrypted before being saved to the database. That is an example of:",
    options: [
      "Encryption in transit, using an asymmetric key",
      "Encryption at rest, using a symmetric key",
      "De-identification, removing the name entirely",
      "Access control, requiring a login"
    ],
    correct: 1,
    explanation: "Fernet encrypts the stored name — that is encryption at rest — and Fernet is symmetric (one key both encrypts and decrypts). HTTPS protected the same name in transit. Two different jobs, two different mechanisms, protecting the same identifier at two different moments."
  },
  {
    question: "What actually happens during the TLS handshake that starts an HTTPS connection?",
    options: [
      "The browser sends your password in plain text to verify it",
      "Asymmetric encryption is used to securely set up a shared symmetric key for the rest of the session",
      "The server turns off encryption to speed things up",
      "Nothing — HTTPS uses no keys at all"
    ],
    correct: 1,
    explanation: "TLS uses asymmetric encryption at the start to safely agree on a shared symmetric session key, then switches to that fast symmetric key for the bulk of the conversation. It is the best of both: asymmetric solves the key-exchange problem, symmetric does the heavy lifting."
  },
  {
    question: "Why do security professionals say 'never roll your own crypto'?",
    options: [
      "Because writing encryption is illegal without a licence",
      "Because home-made encryption almost always has subtle, invisible flaws — use vetted standards like AES, RSA, and TLS instead",
      "Because custom encryption is too slow to be practical",
      "Because only governments are allowed to design ciphers"
    ],
    correct: 1,
    explanation: "Cryptography is extraordinarily easy to get subtly wrong in ways that look fine but are catastrophically broken. The standards (AES-256, RSA, TLS 1.3) have survived decades of expert attack. Your Session 11 app used Fernet — a vetted standard — precisely so you were not inventing your own."
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
          {score >= 4 ? "Excellent — symmetric vs asymmetric, at-rest vs in-transit, and why you never roll your own crypto." : score >= 3 ? "Good — revisit the TLS handshake (asymmetric setting up a symmetric session) and the Session 11 example." : "Review the lesson — protect data both in transit AND at rest, with vetted standards."}
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
