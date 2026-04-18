import React, { useState } from 'react';

const scenarios = [
  {
    title: "Simple Drug Dosing Q&A",
    description: "A pharmacist wants a chatbot that answers questions about standard drug dosages. It has access to a formulary database via a lookup tool. No branching logic. No approvals needed.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langchain",
    explanation: "Simple Q&A with one tool is a perfect fit for create_agent. It handles the tool loop automatically. Raw API works but is unnecessary plumbing. LangGraph is overkill — there is no branching or complex state."
  },
  {
    title: "Clinical Triage Router",
    description: "A patient describes symptoms. The system classifies urgency (emergency, urgent, routine), routes to the appropriate specialist (oncology, cardiology, general), and requires a human nurse to approve emergency escalations before paging the doctor.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langgraph",
    explanation: "This needs conditional routing (different paths based on urgency), multiple processing steps (classify then route then approve), and human-in-the-loop (nurse approval for emergencies). This is exactly what LangGraph is built for."
  },
  {
    title: "Batch Lab Report Summarization",
    description: "Process 200 pathology lab reports overnight. For each report, extract key findings into a structured JSON format. No conversation, no tools, no branching — just input-output processing.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "raw",
    explanation: "Batch extraction with no tools, no conversation, and no branching is a simple API call in a loop. LangChain adds overhead without benefit here. Use client.chat.completions.create() with Pydantic structured output — exactly what you learned in Session 3."
  },
  {
    title: "Multi-Specialist Consultation",
    description: "An oncology case requires input from three specialists: a medical oncologist reviews treatment options, a radiologist reviews imaging, and a pathologist reviews biopsy results. A coordinator agent synthesizes their opinions and presents a unified recommendation. Each specialist has its own tools and prompt.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langgraph",
    explanation: "Multi-agent coordination with separate specialists, shared state, and a synthesizer is a complex workflow. LangGraph's StateGraph lets you define each specialist as a node, route between them, manage shared state, and coordinate the final synthesis."
  },
  {
    title: "Interactive Medication Checker",
    description: "A doctor types a medication name and the system checks for interactions with the patient's current medications, flags warnings, and suggests alternatives. Single conversation turn, two tools (get_current_meds, check_interactions).",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langchain",
    explanation: "A conversational agent with two tools and no complex routing is ideal for create_agent. The agent will call get_current_meds, then check_interactions, and formulate a response — all handled automatically by the agent loop."
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[currentScenario];

  const checkAnswer = () => {
    const correct = selected === s.correct;
    setScores([...scores, correct ? 1 : 0]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentScenario(c => c + 1);
    setSelected('');
    setSubmitted(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Framework Decision Tree Complete!</h2>
        <p style={{ fontSize: 20 }}>You scored {totalScore} / {scenarios.length}</p>
        <div style={{ background: totalScore >= 4 ? '#d4edda' : totalScore >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {totalScore >= 4 ? "Excellent! You know when to use raw API, LangChain, or LangGraph." : totalScore >= 3 ? "Good intuition — review the criteria for choosing LangGraph over LangChain." : "Review the lesson material on when each approach is appropriate."}
        </div>
        <button onClick={() => { setCurrentScenario(0); setScores([]); setSubmitted(false); setSelected(''); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
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

      <p style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Which approach is most appropriate?</p>
      {s.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(opt.value)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt.value === s.correct ? '#198754' : opt.value === selected ? '#dc3545' : '#dee2e6') : opt.value === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt.value === s.correct ? '#d4edda' : opt.value === selected && opt.value !== s.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt.label}</div>
      ))}

      {!submitted && <button onClick={checkAnswer} disabled={!selected} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: !selected ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>{selected === s.correct ? 'Correct!' : 'Not quite.'}</strong></p>
          <p>{s.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}