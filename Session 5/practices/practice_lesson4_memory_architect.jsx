import React, { useState } from 'react';

const scenarios = [
  {
    title: "Oncology Follow-up Clinic",
    description: "A patient visits the oncology clinic every 3 weeks for chemotherapy. Each visit, the AI assistant helps the oncologist review symptoms, check labs, and adjust treatment. The patient has specific communication preferences (prefers Arabic, anxious about side effects, wants detailed explanations).",
    items: [
      { text: "Current conversation messages (today's symptoms, lab results)", correct: "short" },
      { text: "Patient communication preferences (language, anxiety level, explanation detail)", correct: "long" },
      { text: "Tool call results from today's lab lookup", correct: "short" },
      { text: "Summary of last visit's treatment adjustments", correct: "long" },
      { text: "Agent's intermediate reasoning steps for today's recommendation", correct: "short" },
      { text: "List of all prior chemotherapy cycles and responses", correct: "long" }
    ]
  },
  {
    title: "Emergency Triage System",
    description: "A 24/7 triage system handles incoming patient calls. Each call is a separate conversation. The system must remember that certain patients have recurring presentations (e.g., a patient with sickle cell crisis who presents frequently and has a standing protocol).",
    items: [
      { text: "The current caller's described symptoms", correct: "short" },
      { text: "Standing protocols for known recurring patients", correct: "long" },
      { text: "Triage classification result for this call", correct: "short" },
      { text: "Patient allergy list", correct: "long" },
      { text: "The conditional routing decision (emergency vs urgent vs routine)", correct: "short" },
      { text: "Historical pattern: this patient calls about sickle cell crisis monthly", correct: "long" }
    ]
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const s = scenarios[currentScenario];

  const handleSelect = (idx, value) => {
    if (checked) return;
    setAnswers({ ...answers, [idx]: value });
  };

  const checkAnswers = () => setChecked(true);

  const getScore = () => s.items.filter((item, i) => answers[i] === item.correct).length;

  const next = () => {
    setCurrentScenario(c => c + 1);
    setAnswers({});
    setChecked(false);
  };

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Memory Architecture Designer Complete!</h2>
        <div style={{ background: '#d4edda', padding: 20, borderRadius: 8 }}>
          You have designed memory architectures for two clinical systems. The key insight: short-term memory holds the current conversation, long-term memory holds cross-conversation knowledge that any future session can retrieve.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {currentScenario + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{s.description}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>For each item, decide: Short-term memory (thread state) or Long-term memory (persistent store)?</p>

      {s.items.map((item, i) => (
        <div key={i} style={{ padding: 12, margin: '8px 0', borderRadius: 8, border: '1px solid #dee2e6', background: checked ? (answers[i] === item.correct ? '#d4edda' : '#f8d7da') : '#fff' }}>
          <p style={{ marginBottom: 8, fontSize: 14 }}>{item.text}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleSelect(i, 'short')} disabled={checked} style={{
              padding: '6px 16px', borderRadius: 6, border: `2px solid ${answers[i] === 'short' ? '#0d6efd' : '#dee2e6'}`,
              background: answers[i] === 'short' ? '#e3f2fd' : '#fff', cursor: checked ? 'default' : 'pointer', fontSize: 13
            }}>Short-term</button>
            <button onClick={() => handleSelect(i, 'long')} disabled={checked} style={{
              padding: '6px 16px', borderRadius: 6, border: `2px solid ${answers[i] === 'long' ? '#0d6efd' : '#dee2e6'}`,
              background: answers[i] === 'long' ? '#e3f2fd' : '#fff', cursor: checked ? 'default' : 'pointer', fontSize: 13
            }}>Long-term</button>
          </div>
          {checked && answers[i] !== item.correct && (
            <p style={{ fontSize: 12, color: '#dc3545', marginTop: 4 }}>Should be: <strong>{item.correct === 'short' ? 'Short-term' : 'Long-term'}</strong></p>
          )}
        </div>
      ))}

      {!checked && Object.keys(answers).length === s.items.length && (
        <button onClick={checkAnswers} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answers</button>
      )}

      {checked && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {getScore()} / {s.items.length}</strong></p>
          <p>Rule of thumb: if the data is only relevant to THIS conversation, it is short-term. If it is useful across FUTURE conversations, it is long-term.</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Results'}</button>
        </div>
      )}
    </div>
  );
}