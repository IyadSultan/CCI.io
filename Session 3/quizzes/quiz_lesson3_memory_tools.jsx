import React, { useState } from 'react';

const questions = [
  {
    question: "A doctor asks your clinical assistant: 'What is this patient's temperature?' then asks 'Is that normal?' Without memory, what happens on the second question?",
    options: [
      "The model remembers the temperature and answers correctly",
      "The model has no idea what 'that' refers to and gives a generic answer",
      "The model asks the doctor to repeat the question",
      "The model crashes with an error"
    ],
    correct: 1,
    explanation: "LLMs are stateless — each API call is independent. Without conversation memory (sending previous messages), the model has no context for 'that'. You must maintain and send the full message history."
  },
  {
    question: "Your conversation history has grown to 100,000 tokens and the model's context window is 128,000. A user sends a 5,000-token clinical note. What should your code do?",
    options: [
      "Send it anyway — there's still room",
      "Check total tokens, and if close to the limit, summarize or truncate older messages first",
      "Start a new conversation automatically",
      "Increase the context window size"
    ],
    correct: 1,
    explanation: "You need room for both the input AND the model's response. At 100K + 5K = 105K tokens, you have only 23K left for the response. Best practice: monitor token count and trim/summarize when approaching ~75% of the context window."
  },
  {
    question: "You define a tool: lookup_vitals(mrn: str) -> dict. The user asks 'Show me vitals for patient 18887304731609.' What does the model return?",
    options: [
      "The actual vitals data directly",
      "A tool_calls response requesting to call lookup_vitals with mrn='18887304731609'",
      "An error because the model can't access databases",
      "A text response guessing the patient's vitals"
    ],
    correct: 1,
    explanation: "The model doesn't execute tools itself — it returns a tool_calls response indicating which function to call and with what arguments. YOUR code executes the function, then sends the result back to the model to formulate an answer."
  },
  {
    question: "After the model calls lookup_vitals and you execute it, what do you send back to the API?",
    options: [
      "A new user message with the results",
      "A message with role='tool' containing the function result and the tool_call_id",
      "Nothing — the model already has the data",
      "A system message updating the context"
    ],
    correct: 1,
    explanation: "Tool results are sent back as messages with role='tool', including the tool_call_id that links the result to the specific tool call. The model then uses this data to formulate a natural language response to the user."
  },
  {
    question: "Your clinical assistant has tools: lookup_vitals, check_abnormal_range, get_patient_summary. A nurse asks: 'Is patient 21307's blood pressure concerning?' How many tool calls might the model make?",
    options: [
      "Exactly 1 — lookup_vitals only",
      "Exactly 2 — lookup_vitals then check_abnormal_range",
      "Up to 2 — the model may call both lookup_vitals and check_abnormal_range in parallel",
      "All 3 tools are called every time"
    ],
    correct: 2,
    explanation: "The model can make parallel tool calls. It might call lookup_vitals to get the BP reading AND check_abnormal_range to verify the range — potentially in a single response. The model intelligently decides which tools are needed."
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
          {score >= 4 ? "Excellent! You understand memory and tool calling patterns." : score >= 3 ? "Good foundation — review the tool calling flow carefully." : "Review the lesson material, especially the message list pattern and tool calling flow."}
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