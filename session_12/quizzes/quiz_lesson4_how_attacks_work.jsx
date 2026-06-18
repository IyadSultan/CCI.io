import React, { useState } from 'react';

const questions = [
  {
    question: "What is the single most common way attackers get into an organisation?",
    options: [
      "A brilliant, never-seen-before zero-day exploit",
      "Old, unpatched vulnerabilities combined with a human clicking something they shouldn't",
      "Physically breaking into the data centre",
      "Guessing a random encryption key"
    ],
    correct: 1,
    explanation: "The dramatic zero-day is rare. The overwhelming majority of breaches ride in on holes that were patched months ago but never updated, plus a person who clicked a phishing link or typed a password into the wrong box. That is why patching and human awareness matter more than any clever defence."
  },
  {
    question: "In the attack chain, what is 'lateral movement'?",
    options: [
      "Encrypting the victim's files to demand a ransom",
      "Moving from one compromised machine to others across the network, hunting for more valuable access",
      "Sending the stolen data out of the building",
      "Installing the first piece of malware"
    ],
    correct: 1,
    explanation: "After the first foothold, attackers move sideways — machine to machine — looking for higher-value targets like the EHR or backups. Network segmentation is the brake: if the network is divided into compartments, a breach in one cannot freely roam into the rest."
  },
  {
    question: "Ransomware turns a defensive tool into a weapon. Which defence most directly lets a hospital recover without paying?",
    options: [
      "A stronger firewall",
      "Tested, offline backups that the attacker could not also encrypt",
      "A faster internet connection",
      "Changing everyone's password after the attack"
    ],
    correct: 1,
    explanation: "Ransomware encrypts your data and demands payment for the key. If you have backups that are tested and kept where the attacker cannot reach and encrypt them too, you can restore and refuse to pay. Untested or online-only backups are the ones found useless on the worst day."
  },
  {
    question: "How does 'least privilege' limit the damage of an attack?",
    options: [
      "It makes passwords longer",
      "It encrypts the network traffic",
      "It shrinks the blast radius — a compromised account can only do what that account was allowed to do",
      "It hides the server from the internet"
    ],
    correct: 2,
    explanation: "If every account has only the access it truly needs, then compromising one account yields only that account's limited powers — not the keys to everything. Least privilege turns 'one limited account was exposed' into a footnote instead of a headline. It is a brake on a runaway attack."
  },
  {
    question: "An attacker exploits a vulnerability that was fixed by the vendor six months ago. Which defence would have broken the chain right there?",
    options: [
      "Buying cyber-insurance",
      "Applying the patch — keeping software up to date",
      "Using a longer password",
      "Adding a second firewall"
    ],
    correct: 1,
    explanation: "A known, patched vulnerability is only a danger to systems that never applied the patch. Timely patching closes the exact holes attackers reach for first. Patching, least privilege, segmentation, and tested backups are the brakes that break the chain at successive stages."
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
          {score >= 4 ? "Excellent — you can trace the attack chain and name the defence that breaks it at each stage." : score >= 3 ? "Good — revisit lateral movement, segmentation, and why tested backups beat ransomware." : "Review the lesson — most breaches use old holes and a human click; patch, least-privilege, back up."}
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
