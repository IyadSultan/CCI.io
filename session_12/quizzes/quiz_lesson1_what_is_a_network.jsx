import React, { useState } from 'react';

const questions = [
  {
    question: "What is a 'port', in the hospital-building analogy from this lesson?",
    options: [
      "Another name for a computer's IP address",
      "One of thousands of numbered doors on a computer, each leading to a different service",
      "The cable that connects a computer to the network",
      "The reception desk that blocks unwanted traffic"
    ],
    correct: 1,
    explanation: "A computer has thousands of numbered doors called ports, and a service inside listens on one of them. The IP address is the room number; the port is which door of that room. A full address is IP + port, like 142.250.65.78:443 — exactly the shape of 127.0.0.1:8000 you typed all of Session 11."
  },
  {
    question: "Your Session 11 app ran at 127.0.0.1:8000 (localhost) before you deployed it. What did that mean?",
    options: [
      "It was reachable by anyone on the internet, but slowly",
      "It was reachable only from your own laptop — a room with no door to the outside hallway",
      "It was encrypted and therefore safe",
      "It was running on Render's servers"
    ],
    correct: 1,
    explanation: "127.0.0.1, or localhost, means 'this computer only'. It is a room with no door to the hallway: close the lid and it is gone, and nobody outside can knock. Deployment to a public URL was the jump from that safe, private room to a room the whole internet can reach."
  },
  {
    question: "A public hospital website needs exactly one door open to the street. Which is it?",
    options: [
      "Port 22 (SSH)",
      "Port 3389 (RDP)",
      "Port 443 (HTTPS)",
      "Port 8000"
    ],
    correct: 2,
    explanation: "443 is the encrypted website door (HTTPS) — the padlock in the browser. A web server needs 443 open to the world and nothing else facing the street. Login doors like 22 (SSH) and 3389 (RDP) left open to the public internet hand strangers your staff entrance and remote-control door."
  },
  {
    question: "What does a firewall actually do?",
    options: [
      "It reads the contents of every message and removes viruses",
      "It encrypts all traffic leaving the building",
      "It checks which room and door each message is trying to reach, and allows or blocks it per a list of rules",
      "It speeds up the network by caching pages"
    ],
    correct: 2,
    explanation: "The firewall is the reception desk. It does not look at what a message says — it looks only at which room and which door it is trying to reach, then waves it through or stops it cold per its rule list. Deciding which doors may be reached, by whom, and shutting the rest is the single most important network control."
  },
  {
    question: "Why is 'reachable from anywhere' described as both the whole point of deployment and the whole danger?",
    options: [
      "Because public servers are always slower than private ones",
      "Because the same open door that lets your users in lets attackers walk up and try the handle too",
      "Because the internet charges money for every visitor",
      "Because HTTPS only works on private networks"
    ],
    correct: 1,
    explanation: "There is no version of 'on the public internet' that is reachable by your users but invisible to everyone else. Every door you open to the street is, by definition, a door an attacker can find — automated scanners knock on every public address all day. The discipline is 'open the minimum': one locked door for the public, the rest shut at the reception desk."
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
          {score >= 4 ? "Excellent — you can picture the network as a building: rooms, IP addresses, numbered doors (ports), and the reception-desk firewall." : score >= 3 ? "Good — review ports as numbered doors and why only 443 belongs open to the street." : "Review the lesson — the hospital-building picture is the foundation for the whole session."}
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
