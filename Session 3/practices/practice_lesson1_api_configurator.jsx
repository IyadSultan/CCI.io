import React, { useState } from 'react';

const scenarios = [
  {
    title: "Clinical Note Classification",
    description: "A nurse uploads a clinical note and needs it classified as: Discharge Summary, Progress Note, Pathology Report, or Consultation Note.",
    correctModel: "gpt-4o-mini",
    correctTemp: "0.0",
    correctSystemPrompt: "classification",
    hint: "Classification is a simple task — you don't need the most expensive model. You want deterministic output."
  },
  {
    title: "Oncology Differential Diagnosis",
    description: "An oncologist pastes a complex case with imaging, labs, and history. They want a differential diagnosis with reasoning.",
    correctModel: "gpt-4o",
    correctTemp: "0.3",
    correctSystemPrompt: "reasoning",
    hint: "Complex reasoning needs the most capable model. A small amount of temperature allows nuanced reasoning without randomness."
  },
  {
    title: "Batch Processing 10,000 Lab Results",
    description: "Process 10,000 lab result strings and flag each as normal/abnormal. Budget is limited.",
    correctModel: "gpt-4o-mini",
    correctTemp: "0.0",
    correctSystemPrompt: "classification",
    hint: "High volume + simple task + budget constraints = smallest capable model with zero temperature for consistency."
  },
  {
    title: "Patient Education Letter",
    description: "Generate a warm, personalized letter explaining a treatment plan to a patient with breast cancer, in simple language.",
    correctModel: "gpt-4o",
    correctTemp: "0.7",
    correctSystemPrompt: "creative",
    hint: "Patient-facing content benefits from natural language variety. Higher temperature produces more natural, less robotic text."
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selections, setSelections] = useState({ model: '', temp: '', prompt: '' });
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[currentScenario];

  const checkAnswer = () => {
    let points = 0;
    if (selections.model === s.correctModel) points++;
    if (selections.temp === s.correctTemp) points++;
    if (selections.prompt === s.correctSystemPrompt) points++;
    setScores([...scores, points]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentScenario(c => c + 1);
    setSelections({ model: '', temp: '', prompt: '' });
    setSubmitted(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = scores.length * 3;

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>API Configuration Practice Complete!</h2>
        <p style={{ fontSize: 20 }}>You scored {totalScore} / {scenarios.length * 3} configuration points</p>
        <div style={{ background: totalScore >= 10 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {totalScore >= 10 ? "Excellent clinical API intuition!" : "Review when to use different models and temperature settings for clinical tasks."}
        </div>
        <button onClick={() => { setCurrentScenario(0); setScores([]); setSubmitted(false); setSelections({ model: '', temp: '', prompt: '' }); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {currentScenario + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{s.description}</p>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Model:</label>
        <select value={selections.model} onChange={e => setSelections({ ...selections, model: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select model...</option>
          <option value="gpt-4o">gpt-4o (most capable, higher cost)</option>
          <option value="gpt-4o-mini">gpt-4o-mini (fast, cost-effective)</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Temperature:</label>
        <select value={selections.temp} onChange={e => setSelections({ ...selections, temp: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select temperature...</option>
          <option value="0.0">0.0 (deterministic)</option>
          <option value="0.3">0.3 (slightly creative)</option>
          <option value="0.7">0.7 (balanced creativity)</option>
          <option value="1.5">1.5 (highly random)</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>System Prompt Type:</label>
        <select value={selections.prompt} onChange={e => setSelections({ ...selections, prompt: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select prompt approach...</option>
          <option value="classification">Classification (strict categories, no reasoning)</option>
          <option value="reasoning">Reasoning (step-by-step analysis required)</option>
          <option value="creative">Creative (natural, varied language)</option>
        </select>
      </div>

      {!submitted && <button onClick={checkAnswer} disabled={!selections.model || !selections.temp || !selections.prompt} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: (!selections.model || !selections.temp || !selections.prompt) ? 0.5 : 1 }}>Submit Configuration</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {scores[scores.length - 1]} / 3</strong></p>
          <p>{selections.model === s.correctModel ? '✅' : '❌'} Model: best choice is <strong>{s.correctModel}</strong></p>
          <p>{selections.temp === s.correctTemp ? '✅' : '❌'} Temperature: best choice is <strong>{s.correctTemp}</strong></p>
          <p>{selections.prompt === s.correctSystemPrompt ? '✅' : '❌'} System prompt: best choice is <strong>{s.correctSystemPrompt}</strong></p>
          <p style={{ marginTop: 8, fontStyle: 'italic' }}>{s.hint}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}