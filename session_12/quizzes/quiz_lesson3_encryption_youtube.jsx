import React, { useState } from 'react';

const questions = [
  {
    question: "Why is encryption needed when you shop online, use a banking app, or send private messages?",
    options: [
      "To make the internet faster by compressing all traffic",
      "So data traveling between devices stays protected — anyone who intercepts it sees unreadable ciphertext instead of the real content",
      "To prove that a website is owned by a trustworthy company",
      "To replace the need for passwords entirely"
    ],
    correct: 1,
    explanation: "The video opens with everyday transfers of sensitive data. Encryption scrambles the message so an eavesdropper in the middle cannot read or understand what was sent — only the intended recipient with the right key can."
  },
  {
    question: "What is a man-in-the-middle (MITM) attack in the video's two-party message example?",
    options: [
      "A virus that deletes files on the server after login",
      "An outsider intercepts a message between two parties, reads or alters it, and forwards it as if nothing happened",
      "A firewall that blocks all incoming ports",
      "Encrypting data twice with two different keys"
    ],
    correct: 1,
    explanation: "The video describes a stranger in the middle of the path who cuts the message, reads the plaintext, and passes it along. Encryption is the defense: the interceptor only sees meaningless symbols."
  },
  {
    question: "In the video, what is an encryption algorithm (cipher)?",
    options: [
      "A physical USB device that stores passwords",
      "A mathematical formula both sides agree on to scramble plaintext into ciphertext and reverse it with the correct key",
      "A browser setting that hides your search history",
      "A type of firewall rule on port 443"
    ],
    correct: 1,
    explanation: "The sender applies the agreed formula before sending. The receiver uses the same formula (or the matching private key) to recover the original message. Without the key, the ciphertext has no clear meaning."
  },
  {
    question: "The Caesar cipher demonstrated in the video works by:",
    options: [
      "Replacing each letter with a random emoji",
      "Shifting each letter in the alphabet by a fixed number of positions",
      "Deleting every vowel from the message",
      "Splitting the message into two separate files"
    ],
    correct: 1,
    explanation: "Caesar cipher (one of the oldest ciphers) shifts each character by a set amount — e.g. shift by 2 so ا becomes ت in the Arabic example. Simple, but it illustrates the core idea: transform every character by a rule only key-holders know."
  },
  {
    question: "What defines symmetric encryption?",
    options: [
      "Two different keys: one public and one private",
      "The same secret key is used to encrypt and decrypt on both sides",
      "Only the server holds any key; the client has none",
      "Data is encrypted once and never decrypted"
    ],
    correct: 1,
    explanation: "Symmetric encryption means both parties share one equal key — like one shared lock combination. It is efficient, but delivering that key safely across an insecure network is the hard part."
  },
  {
    question: "Which algorithm does the video name as a famous example of symmetric encryption?",
    options: [
      "RSA",
      "AES (Advanced Encryption Standard)",
      "SHA-256",
      "HTML5"
    ],
    correct: 1,
    explanation: "AES is the video's headline symmetric example. RSA is named later as an asymmetric algorithm. SHA-256 is a hash, not encryption for two-way messaging."
  },
  {
    question: "What is the main weakness of symmetric encryption highlighted in the video?",
    options: [
      "It is too slow for any real-world use",
      "Both sides must share the same secret key — and sending that key over the network risks an interceptor copying it",
      "It cannot work with HTTPS",
      "It only encrypts numbers, not text"
    ],
    correct: 1,
    explanation: "Symmetric crypto is fast and strong, but the key-exchange problem remains: if you send the key the same way you send messages, a man in the middle can steal it and read everything. That motivates asymmetric encryption."
  },
  {
    question: "In asymmetric encryption, how do the public and private keys differ?",
    options: [
      "They are identical copies of the same key",
      "Anyone can use the public key to encrypt, but only the private key holder can decrypt — and the private key must never be shared",
      "The public key decrypts; the private key encrypts",
      "Both keys must be emailed to every user who visits the site"
    ],
    correct: 1,
    explanation: "The video's mailbox analogy: the public key is the slot anyone can drop a message into; only the private key opens the box. Publishing the public key is safe; leaking the private key breaks everything."
  },
  {
    question: "Which asymmetric algorithm does the video mention by name?",
    options: [
      "AES",
      "RSA",
      "Fernet",
      "SQLite"
    ],
    correct: 1,
    explanation: "RSA is named as a well-known asymmetric algorithm (named after Rivest, Shamir, and Adleman). AES belongs to symmetric encryption. Fernet and SQLite appear in your Session 11 app, not in this video."
  },
  {
    question: "How does HTTPS (TLS) use BOTH symmetric and asymmetric encryption, according to the video?",
    options: [
      "It uses only asymmetric encryption for every byte of every page",
      "It uses asymmetric encryption to exchange symmetric keys safely, then uses fast symmetric encryption for the ongoing conversation",
      "It uses symmetric keys only and never needs asymmetric math",
      "It encrypts the URL but leaves the page body in plaintext"
    ],
    correct: 1,
    explanation: "HTTPS combines the strengths of both: asymmetric (e.g. RSA) solves the key-delivery problem once; then symmetric (e.g. AES) handles bulk traffic efficiently. This is exactly the hybrid model Lesson 3 teaches — and what protects your Session 11 app in transit."
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
        <div style={{ background: score >= 8 ? '#d4edda' : score >= 6 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 8
            ? "Excellent — you grasp symmetric vs asymmetric encryption, the key-exchange problem, and how HTTPS combines both."
            : score >= 6
              ? "Good — rewatch the sections on Caesar cipher, AES, RSA, and the HTTPS handshake before the at-rest/in-transit lab."
              : "Review the video — these ideas are the foundation for everything else in Session 12."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#AD1457', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
        Based on <em>What Is Encryption and How Does It Work?</em> (Tarmeez Academy) — English quiz
      </p>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#AD1457', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#AD1457' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#FCE4EC', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #AD1457' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#AD1457', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
