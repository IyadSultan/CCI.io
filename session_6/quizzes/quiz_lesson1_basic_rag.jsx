import React, { useState } from 'react';

const questions = [
  {
    question: "Why is RAG needed when modern LLMs have 200K+ token context windows?",
    options: [
      "RAG is faster to compute than a long prompt",
      "Context windows are still finite, training data is frozen at a cutoff, and stuffing entire documents into every prompt is expensive and noisy",
      "LLMs cannot read PDFs without RAG",
      "RAG is required by HIPAA for clinical applications"
    ],
    correct: 1,
    explanation: "Even with large context windows, you cannot fit every KHCC guideline in every prompt — and you should not. RAG retrieves only the relevant chunks per query, keeps costs down, allows fresh indexes without retraining, and grounds answers in cited sources for clinical safety."
  },
  {
    question: "What are the five stages of a standard RAG pipeline, in order?",
    options: [
      "Embed → Load → Split → Retrieve → Store",
      "Load → Split → Embed → Store → Retrieve",
      "Retrieve → Embed → Load → Store → Split",
      "Split → Load → Embed → Retrieve → Store"
    ],
    correct: 1,
    explanation: "Load (loaders pull content), Split (splitters chunk it), Embed (embedding models vectorize chunks), Store (vector stores index vectors), Retrieve (retrievers query by similarity). The first four happen at index time; the fifth happens at query time."
  },
  {
    question: "You use PyPDF to extract text from the Wilms tumor guidelines and the resulting text has columns interleaved and tables collapsed into unreadable rows. What is the right fix?",
    options: [
      "Increase chunk size so the model can figure out the layout",
      "Use a layout-aware parser like LlamaParse that preserves structure, tables, and reading order",
      "Switch to a smaller embedding model",
      "Use a different vector store"
    ],
    correct: 1,
    explanation: "Naive PDF extractors do not understand multi-column layouts, tables, or reading order. LlamaParse uses layout-aware models to preserve structure — tables become Markdown tables, columns are read in the right order, and figures are described. Garbage parsing in means garbage retrieval out."
  },
  {
    question: "What is the difference between an embedding model and a vector store?",
    options: [
      "They are the same thing — embeddings are stored inside the embedding model",
      "An embedding model turns text into a vector; a vector store indexes vectors and supports similarity search",
      "An embedding model is for images and a vector store is for text",
      "An embedding model is used at query time and a vector store is used at index time"
    ],
    correct: 1,
    explanation: "Embedding models (e.g., text-embedding-3-small) are functions: text in, vector out. Vector stores (e.g., ChromaDB, FAISS, Pinecone) are databases: they hold (chunk, vector) pairs and support k-nearest-neighbor search. You use the embedding model both at index time (to embed chunks) and at query time (to embed the user's question)."
  },
  {
    question: "Your clinical guideline has clearly delimited sections like 'Staging', 'Chemotherapy Regimens', 'Surgical Approach'. Which chunking strategy is most likely to help retrieval?",
    options: [
      "Fixed-size chunking at 100 tokens with no overlap",
      "Semantic chunking aligned to section headings, so each chunk is a coherent unit",
      "Random chunking to maximize diversity",
      "Single chunk containing the entire document"
    ],
    correct: 1,
    explanation: "When the document has structure, use it. Semantic chunking aligned to headings keeps each chunk topically coherent — a query about staging retrieves the staging section, not half of staging plus half of chemotherapy. Fixed-size chunking is a reasonable default but loses to semantic chunking when structure is available."
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
          {score >= 4 ? "Excellent! You understand the core RAG pipeline." : score >= 3 ? "Good foundation — review chunking and the role of each stage." : "Review the lesson material on the 5 RAG stages before moving on."}
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
