import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you built tool calling by manually writing a while-loop that checked for tool_calls in the response. In LangChain, what replaces all of that manual plumbing?",
    options: [
      "You still write the while-loop but LangChain provides helper functions",
      "create_agent() from langgraph.prebuilt handles the entire agent loop automatically",
      "LangChain connects directly to OpenAI's server-side agent runtime",
      "You use ConversationChain which manages everything"
    ],
    correct: 1,
    explanation: "create_agent() is the modern LangChain entry point. It takes a model and tools, and returns a fully functional agent that handles the observe-reason-act loop, tool execution, and message management automatically. No manual while-loop needed."
  },
  {
    question: "What is the relationship between LangChain and LangGraph?",
    options: [
      "LangGraph is a newer version that replaces LangChain entirely",
      "LangChain is for Python and LangGraph is for JavaScript",
      "LangChain provides building blocks (models, tools, prompts) and LangGraph provides the orchestration runtime (state, routing, persistence)",
      "They are competing frameworks from different companies"
    ],
    correct: 2,
    explanation: "LangChain and LangGraph are complementary. LangChain gives you the components — model wrappers, tool definitions, output parsers. LangGraph gives you the execution engine — stateful workflows, conditional routing, checkpointing, human-in-the-loop. They are designed to work together."
  },
  {
    question: "A clinical assistant needs to: (1) answer simple questions about drug dosing, and (2) sometimes look up a patient's medication list. Which approach is most appropriate?",
    options: [
      "Build a full LangGraph StateGraph with multiple nodes and conditional edges",
      "Use create_agent with ChatOpenAI and a lookup_medications tool",
      "Write raw OpenAI API calls with manual tool handling like Session 3",
      "Fine-tune a HuggingFace model on medication data"
    ],
    correct: 1,
    explanation: "For a simple agent with a few tools, create_agent is the right choice — it handles the tool calling loop automatically. You only need LangGraph's StateGraph when you have complex workflows with branching, conditional routing, or multi-agent coordination."
  },
  {
    question: "In LangChain, the Runnable interface lets you compose components with the pipe operator: prompt | model | parser. What does this create?",
    options: [
      "A new Python class that inherits from all three components",
      "A processing pipeline where output of each step feeds into the next",
      "Three separate API calls that run in parallel",
      "A configuration file that describes the pipeline"
    ],
    correct: 1,
    explanation: "The pipe operator composes Runnables into a chain. Data flows through: the prompt formats the input, the model generates a response, and the parser extracts structured output. Each component implements the same Runnable interface (invoke, stream, batch)."
  },
  {
    question: "When should you use LangGraph instead of a simple LangChain create_agent?",
    options: [
      "Whenever you use any LLM — LangGraph is always better",
      "Only when you need to use open-source models instead of OpenAI",
      "When your workflow needs branching, conditional routing, persistence, or human approval steps",
      "When your agent has more than 2 tools"
    ],
    correct: 2,
    explanation: "LangGraph is for complex workflows: multi-step processes with conditional branches (route patient to different specialists), persistence (resume after failure), and human-in-the-loop (approve risky actions). A simple Q&A agent with tools does not need LangGraph."
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
          {score >= 4 ? "Excellent! You understand when and why to use LangChain and LangGraph." : score >= 3 ? "Good foundation — review the relationship between LangChain and LangGraph." : "Review the lesson material before moving on."}
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