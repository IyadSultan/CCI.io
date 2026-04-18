import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you defined a tool with a 15-line JSON schema. In LangChain, what replaces that entire schema definition?",
    options: [
      "A YAML configuration file that describes the tool",
      "The @tool decorator on a Python function — the schema is generated from the function's docstring and type hints",
      "A call to register_tool() with the function name",
      "You still write the JSON schema but LangChain validates it for you"
    ],
    correct: 1,
    explanation: "The @tool decorator automatically generates the JSON schema from the function's name (tool name), docstring (description), and type hints (parameter schema). One decorator replaces twenty lines of JSON."
  },
  {
    question: "You have two tools: get_patient_info(mrn: str) with docstring 'Retrieve patient demographics' and f(x: str) with no docstring. Which will the model use correctly?",
    options: [
      "Both — the model figures out what functions do from their code",
      "Only get_patient_info — the model relies on the name and description to choose tools",
      "Only f — shorter names are easier for the model to process",
      "Neither — the model needs explicit instructions to use each tool"
    ],
    correct: 1,
    explanation: "The model decides which tool to call based entirely on the tool's name and description. A descriptive name and clear docstring are essential. The model never sees the function's implementation code — only the schema."
  },
  {
    question: "The agent calls check_drug_interaction('cispltin', 'ondansetron') but 'cispltin' is misspelled. What should the tool return?",
    options: [
      "Raise a Python exception that crashes the agent",
      "Return an empty result and let the model figure it out",
      "Return an error message like 'Drug cispltin not found. Did you mean cisplatin?' so the model can retry",
      "Silently correct the spelling and return the result"
    ],
    correct: 2,
    explanation: "Returning a descriptive error message lets the agent self-correct. The model reads the error, understands the issue, and retries with the correct spelling. This is more robust than crashing and more transparent than silent correction."
  },
  {
    question: "What prevents a LangChain agent from calling tools in an infinite loop?",
    options: [
      "The OpenAI API automatically stops after 5 tool calls",
      "Stopping conditions: the model gives a final answer, hits a max iteration limit, or middleware intervenes",
      "Tools can only be called once each per conversation",
      "The agent always stops after exactly one tool call"
    ],
    correct: 1,
    explanation: "Agents stop when they have enough information (final text response), when they hit a configured max iteration limit, or when middleware intercepts. In clinical contexts, always set explicit iteration limits to prevent runaway agents."
  },
  {
    question: "In the agent loop pattern (observe, reason, act, observe), what does the 'reason' step actually involve?",
    options: [
      "The agent runs a separate reasoning algorithm before calling the model",
      "The model reads the current state (messages, tool results) and decides whether to call a tool or give a final answer",
      "The developer writes if-else logic to determine the next action",
      "The agent searches a knowledge base for relevant information"
    ],
    correct: 1,
    explanation: "The 'reason' step is the model itself reading all available context — the user question, conversation history, tool descriptions, and previous tool results — and deciding the next action. This is the intelligence at the heart of the agent pattern."
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
          {score >= 4 ? "Excellent! You understand tool design and the agent loop." : score >= 3 ? "Good foundation — review tool descriptions and error handling." : "Review the lesson material on @tool and the agent loop before moving on."}
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