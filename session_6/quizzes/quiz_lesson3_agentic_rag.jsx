import React, { useState } from 'react';

const questions = [
  {
    question: "Basic RAG retrieves once and generates. What is the core limitation that agentic RAG addresses?",
    options: [
      "Basic RAG is slower than agentic RAG",
      "Basic RAG cannot decide whether retrieval was good, cannot reformulate the query, and cannot retrieve again — it has no feedback loop",
      "Basic RAG cannot use OpenAI models",
      "Basic RAG requires a vector store and agentic RAG does not"
    ],
    correct: 1,
    explanation: "The core limitation is the lack of a feedback loop. Basic RAG has no way to notice that the retrieved chunks are bad, no way to reformulate the query, no way to decompose a complex question. Agentic RAG turns retrieval into a tool the agent can call — possibly multiple times — based on what it sees."
  },
  {
    question: "A user asks 'what if my patient has bad kidneys?' Which agentic RAG pattern is most likely to help most BEFORE retrieval happens?",
    options: [
      "Self-RAG (grade retrieved documents)",
      "Query rewriting (reformulate the question into a retrieval-optimized form)",
      "Corrective RAG (fall back to web search)",
      "Multi-step decomposition"
    ],
    correct: 1,
    explanation: "The user's phrasing ('bad kidneys') will not match how the guideline phrases it ('renal impairment dose modifications'). Query rewriting normalizes the question into terminology that matches the document — often the cheapest and highest-impact agentic pattern."
  },
  {
    question: "Self-RAG grades retrieved documents before generation. What does that buy you?",
    options: [
      "Faster retrieval",
      "A check that filters out irrelevant chunks and triggers re-retrieval if too few good chunks survive — preventing confident-wrong answers from bad context",
      "Lower API costs",
      "Better embeddings"
    ],
    correct: 1,
    explanation: "Self-RAG explicitly inspects each retrieved chunk for relevance. Bad chunks are dropped. If not enough good chunks survive, the agent re-retrieves or declines to answer. This guards directly against the failure mode where the retriever returns junk and the generator confidently hallucinates from it."
  },
  {
    question: "A complex question: 'For a 4-year-old with stage III favorable-histology Wilms tumor AND renal impairment, what regimen modifications apply?' Which agentic RAG pattern is most natural?",
    options: [
      "Basic RAG with a larger top-k (e.g., k=20)",
      "Multi-step decomposition: split into sub-questions, retrieve for each, synthesize",
      "Embed the full question once and trust the embedding",
      "Use a bigger LLM and skip RAG"
    ],
    correct: 1,
    explanation: "Multi-hop questions like this combine multiple distinct topics (staging, regimen, age, organ dysfunction). Decomposing into sub-questions and retrieving for each ensures each topic gets its own targeted context. A single embedding of the full question averages all topics together and tends to retrieve a generic blob."
  },
  {
    question: "In a LangGraph agentic RAG, what role does the conditional edge play after the grade_documents node?",
    options: [
      "It records logs to a file",
      "It routes to generate_answer if enough good chunks survived, or back to rewrite_query if not — implementing the retrieval feedback loop",
      "It always routes directly to generate_answer regardless of grade",
      "It calls a different LLM model"
    ],
    correct: 1,
    explanation: "The conditional edge reads the grade_documents result from state and decides where to go next. Good chunks → generate. Bad chunks → rewrite the query and try again (with an iteration cap to avoid loops). This is the retrieval feedback loop that distinguishes agentic from basic RAG."
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
          {score >= 4 ? "Excellent! You can pick the right agentic RAG pattern for the question." : score >= 3 ? "Good — review query rewriting vs self-RAG vs decomposition." : "Review the agentic RAG patterns and what each one fixes."}
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
