import React, { useState } from 'react';

const nodes = [
  { id: 'intake', label: 'Intake: Collect patient symptoms and history', order: 1 },
  { id: 'classify', label: 'Classify: LLM determines urgency level (emergency/urgent/routine)', order: 2 },
  { id: 'route', label: 'Conditional Route: Branch based on urgency_level in state', order: 3 },
  { id: 'emergency', label: 'Emergency: Page on-call physician immediately', order: 4 },
  { id: 'specialist', label: 'Specialist: Route to appropriate department (oncology/cardiology/etc)', order: 4 },
  { id: 'routine', label: 'Routine: Schedule next available appointment', order: 4 },
  { id: 'output', label: 'Output: Generate patient-facing summary and next steps', order: 5 },
];

const routingQuestions = [
  {
    scenario: "Patient reports sudden severe chest pain, shortness of breath, and dizziness that started 10 minutes ago.",
    options: ["Emergency", "Specialist (Cardiology)", "Routine"],
    correct: 0,
    explanation: "Acute chest pain with shortness of breath and dizziness is a potential cardiac emergency. The conditional edge routes to the emergency_handler node, which pages the on-call physician immediately."
  },
  {
    scenario: "Patient has a slowly growing mole on their back that has changed color over the past 3 months. No pain, no bleeding.",
    options: ["Emergency", "Specialist (Dermatology/Oncology)", "Routine"],
    correct: 1,
    explanation: "A changing mole is concerning for melanoma and needs specialist evaluation, but it is not an emergency. The conditional edge routes to the specialist_referral node with dermatology/oncology as the target."
  },
  {
    scenario: "Patient needs a routine medication refill for hypertension. Blood pressure well-controlled at last visit. No new symptoms.",
    options: ["Emergency", "Specialist (Cardiology)", "Routine"],
    correct: 2,
    explanation: "A stable, well-controlled condition needing only a refill is routine. The conditional edge routes to the routine_care node, which schedules the next available appointment."
  }
];

export default function Practice() {
  const [phase, setPhase] = useState('build');
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState(() => [...nodes].sort(() => Math.random() - 0.5));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [routeScore, setRouteScore] = useState(0);

  if (phase === 'build') {
    const isCorrect = placed.length === nodes.length && placed.every((n, i) => {
      if (i < 3) return n.order === i + 1;
      if (i >= 3 && i <= 5) return n.order === 4;
      return n.order === 5;
    });

    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2>Part 1: Build the Clinical Triage Workflow</h2>
        <p>Arrange the nodes in the correct order. The three specialist paths (Emergency, Specialist, Routine) are parallel branches that all come after the conditional route.</p>

        <div style={{ minHeight: 50, marginBottom: 16 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Your workflow:</p>
          {placed.map((n, i) => (
            <div key={n.id} style={{ padding: '8px 12px', margin: 4, background: '#e3f2fd', borderRadius: 6, display: 'inline-block', cursor: 'pointer', fontSize: 13 }} onClick={() => {
              setPlaced(placed.filter(x => x.id !== n.id));
              setAvailable([...available, n]);
            }}>
              {i + 1}. {n.label} x
            </div>
          ))}
          {placed.length === 0 && <span style={{ color: '#999' }}>Click nodes below to add them...</span>}
        </div>

        <div>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Available nodes:</p>
          {available.map(n => (
            <div key={n.id} onClick={() => {
              setPlaced([...placed, n]);
              setAvailable(available.filter(x => x.id !== n.id));
            }} style={{ padding: '10px 14px', margin: 6, background: '#f8f9fa', borderRadius: 6, cursor: 'pointer', border: '1px solid #dee2e6', display: 'inline-block', fontSize: 13 }}>
              {n.label}
            </div>
          ))}
        </div>

        {placed.length === nodes.length && (
          <div style={{ marginTop: 16, padding: 16, background: isCorrect ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
            {isCorrect ? (
              <>
                <p><strong>Correct!</strong> Intake -> Classify -> Conditional Route -> [Emergency | Specialist | Routine] -> Output</p>
                <button onClick={() => setPhase('route')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Continue to Part 2: Route Patients</button>
              </>
            ) : (
              <p><strong>Not quite.</strong> Remember: Intake first, then Classify, then Conditional Route, then the three parallel branches, then Output. Click nodes to remove and reorder.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (currentQ >= routingQuestions.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Clinical Workflow Designer Complete!</h2>
        <p style={{ fontSize: 20 }}>Routing Score: {routeScore} / {routingQuestions.length}</p>
        <div style={{ background: '#d4edda', padding: 16, borderRadius: 8 }}>
          You have designed the workflow structure AND made routing decisions. In the lab, you will implement this as a real LangGraph StateGraph with Python code.
        </div>
      </div>
    );
  }

  const q = routingQuestions[currentQ];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Part 2: Route Patients ({currentQ + 1}/{routingQuestions.length})</h2>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}><strong>Patient presentation:</strong> {q.scenario}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Which path should the conditional edge take?</p>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : i === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}

      {!submitted && selected !== null && (
        <button onClick={() => { setSubmitted(true); if (selected === q.correct) setRouteScore(s => s + 1); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Route</button>
      )}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{q.explanation}</p>
          <button onClick={() => { setCurrentQ(c => c + 1); setSelected(null); setSubmitted(false); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentQ + 1 < routingQuestions.length ? 'Next Patient' : 'See Results'}</button>
        </div>
      )}
    </div>
  );
}