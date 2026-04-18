import React, { useState } from 'react';

const questions = [
  {
    question: "In a LangGraph StateGraph, what is the role of a 'node'?",
    options: [
      "A node stores data like a database table",
      "A node is a function that reads the current state, does some processing, and returns state updates",
      "A node is an LLM that generates text responses",
      "A node is a connection between two other components"
    ],
    correct: 1,
    explanation: "Nodes are functions. Each node receives the current state (a TypedDict), performs processing (which might include LLM calls, tool execution, or pure logic), and returns a dictionary of state updates. Nodes are the 'boxes' in your workflow flowchart."
  },
  {
    question: "A clinical triage system needs to route patients to different specialists based on urgency: emergency goes to the ER, urgent goes to a specialist, routine goes to scheduling. Which LangGraph feature handles this?",
    options: [
      "Multiple StateGraphs running in parallel",
      "Conditional edges that branch based on state values",
      "A single node with if-else logic inside it",
      "Tool calling within the agent loop"
    ],
    correct: 1,
    explanation: "Conditional edges check state values and route to different nodes. After the classify_urgency node sets urgency_level in state, a conditional edge reads that value and routes to the appropriate next node. This keeps routing logic explicit and auditable."
  },
  {
    question: "You define state as: class TriageState(TypedDict): symptoms: str; urgency: str; specialist: str. A node returns {'urgency': 'emergency'}. What happens to the other state fields?",
    options: [
      "They are deleted — the state is replaced entirely",
      "They remain unchanged — nodes only update the fields they return",
      "They are set to None automatically",
      "The graph raises an error because all fields must be updated"
    ],
    correct: 1,
    explanation: "State updates are merged, not replaced. When a node returns {'urgency': 'emergency'}, only the urgency field changes. The symptoms and specialist fields keep their current values. This is why each node can focus on updating just its relevant fields."
  },
  {
    question: "What does Command(update={'specialist': 'oncology'}, goto='specialist_consult') do when returned from a node?",
    options: [
      "It creates a new specialist_consult node dynamically",
      "It updates the specialist field in state AND routes the workflow to the specialist_consult node in one step",
      "It sends a command to an external oncology system",
      "It replaces the current node with specialist_consult"
    ],
    correct: 1,
    explanation: "Command combines state update and routing in a single return value. It updates state (sets specialist to 'oncology') and tells the graph where to go next (specialist_consult node). This is cleaner than having separate update logic and conditional edge functions."
  },
  {
    question: "Why is a StateGraph better than a single agent loop for a clinical triage workflow with multiple specialist paths?",
    options: [
      "StateGraph is faster because it uses parallel processing",
      "StateGraph makes the workflow structure explicit and auditable — every path, branch, and decision point is visible in the graph definition",
      "A single agent loop cannot use tools",
      "StateGraph does not require an LLM"
    ],
    correct: 1,
    explanation: "In clinical systems, you need to explain and audit every decision. A StateGraph makes the workflow visible: you can see every node, every conditional edge, every possible path. A single agent loop buries this logic in the model's reasoning, which is harder to audit and explain."
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
          {score >= 4 ? "Excellent! You understand StateGraph, nodes, edges, and conditional routing." : score >= 3 ? "Good grasp — review conditional edges and the Command object." : "Review the lesson material on StateGraph fundamentals before moving on."}
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