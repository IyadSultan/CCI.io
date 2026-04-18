import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you built memory with a Python list of messages. What is the biggest limitation of that approach?",
    options: [
      "The list gets too long and Python runs out of memory",
      "The memory is lost when the program stops — there is no persistence across sessions",
      "The model cannot read messages from a Python list",
      "Lists are slower than dictionaries for message storage"
    ],
    correct: 1,
    explanation: "A Python list exists only in RAM. When the program stops, the conversation is gone. LangGraph's checkpointing saves state to a persistent store (memory, database, etc.) so conversations survive restarts."
  },
  {
    question: "What is a 'thread' in LangGraph?",
    options: [
      "A Python threading object for parallel processing",
      "A unique execution context that scopes one conversation session — identified by a thread_id",
      "A connection to the OpenAI API",
      "A sequence of tool calls in the agent loop"
    ],
    correct: 1,
    explanation: "A thread is a conversation scope. All messages, state updates, and checkpoints within a conversation belong to one thread_id. Starting a new conversation means creating a new thread_id. Resuming an old conversation means using its existing thread_id."
  },
  {
    question: "A clinical triage workflow crashes at step 3 of 5 due to a network error. With checkpointing enabled, what happens when you restart?",
    options: [
      "The entire workflow restarts from step 1",
      "The workflow resumes from step 3 because state was checkpointed after each step",
      "The workflow skips to step 5 and guesses the missing results",
      "Checkpointing only saves the final result, not intermediate steps"
    ],
    correct: 1,
    explanation: "Checkpointing saves state after every node execution. When you restart with the same thread_id, the graph loads the last checkpoint (after step 2) and resumes from step 3. This is critical for expensive clinical workflows."
  },
  {
    question: "A patient visited the oncology clinic 3 weeks ago and discussed treatment preferences. Today they are back for a follow-up. Where should those preferences be stored so the AI remembers them?",
    options: [
      "In the current thread's short-term memory (message history)",
      "In long-term memory (LangGraph store, keyed by patient MRN)",
      "In the system prompt, which is the same for all patients",
      "In the OpenAI model's training data"
    ],
    correct: 1,
    explanation: "Long-term memory (the LangGraph store) persists across threads. Patient preferences stored with the MRN as key are available to any future conversation about that patient. Short-term memory only lasts for one conversation thread."
  },
  {
    question: "Your clinical assistant's conversation history has grown to 90,000 tokens. The model's context window is 128,000. What should the system do?",
    options: [
      "Continue adding messages until the context window is full",
      "Apply a trimming strategy: summarize older messages or keep only the most recent N exchanges to free up context space",
      "Start a new thread and lose all conversation history",
      "Switch to a model with a larger context window"
    ],
    correct: 1,
    explanation: "Context trimming prevents overflow while preserving essential information. Options include summarizing older messages, keeping a sliding window of recent exchanges, or selectively retaining only the most relevant messages. This automates what you did manually with tiktoken in Session 3."
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
          {score >= 4 ? "Excellent! You understand threads, checkpointing, and memory architecture." : score >= 3 ? "Good grasp — review long-term memory and context trimming." : "Review the lesson material on memory persistence before moving on."}
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