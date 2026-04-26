import React, { useState } from 'react';

const STAGES = [
  { id: 'load', label: 'Load (LlamaParse the PDF)', desc: 'Pull raw content from the Wilms tumor PDF and produce structured Markdown' },
  { id: 'split', label: 'Split (chunk into sections)', desc: 'Break the parsed Markdown into 500-token chunks aligned to section headings' },
  { id: 'embed', label: 'Embed (text-embedding-3-small)', desc: 'Convert each chunk into a dense vector capturing its meaning' },
  { id: 'store', label: 'Store (ChromaDB)', desc: 'Index the (chunk, vector) pairs in a vector database for fast similarity search' },
  { id: 'retrieve', label: 'Retrieve (top-k by similarity)', desc: 'At query time, embed the question and return the k most similar chunks' }
];

const CORRECT = ['load', 'split', 'embed', 'store', 'retrieve'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Practice() {
  const [order, setOrder] = useState(shuffle(STAGES));
  const [submitted, setSubmitted] = useState(false);

  const move = (idx, dir) => {
    if (submitted) return;
    const newOrder = [...order];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setOrder(newOrder);
  };

  const check = () => setSubmitted(true);
  const reset = () => { setOrder(shuffle(STAGES)); setSubmitted(false); };

  const correctCount = order.filter((s, i) => s.id === CORRECT[i]).length;

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>RAG Pipeline Builder</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        <strong>Scenario:</strong> A KHCC oncologist asks "What is the recommended chemotherapy regimen for stage III favorable histology Wilms tumor?" Your RAG system will answer over the National Wilms Tumor guideline PDF. Arrange the five pipeline stages in the correct order so the question can actually be answered.
      </p>

      {order.map((stage, i) => {
        const isCorrect = submitted && stage.id === CORRECT[i];
        const isWrong = submitted && stage.id !== CORRECT[i];
        return (
          <div key={stage.id} style={{
            display: 'flex', alignItems: 'center', padding: 12, margin: '8px 0', borderRadius: 8,
            border: `2px solid ${isCorrect ? '#198754' : isWrong ? '#dc3545' : '#dee2e6'}`,
            background: isCorrect ? '#d4edda' : isWrong ? '#f8d7da' : '#fff'
          }}>
            <div style={{ fontWeight: 'bold', marginRight: 12, width: 24, textAlign: 'center' }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{stage.label}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{stage.desc}</div>
            </div>
            <div>
              <button onClick={() => move(i, -1)} disabled={submitted || i === 0} style={{ padding: '4px 10px', marginRight: 4, cursor: submitted || i === 0 ? 'default' : 'pointer' }}>↑</button>
              <button onClick={() => move(i, 1)} disabled={submitted || i === order.length - 1} style={{ padding: '4px 10px', cursor: submitted || i === order.length - 1 ? 'default' : 'pointer' }}>↓</button>
            </div>
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Order</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>{correctCount} / {STAGES.length} stages in the correct position.</strong></p>
          <p>The correct order is Load → Split → Embed → Store → Retrieve. The first four stages happen at index time (once, when you ingest the PDF). The fifth stage happens at query time (every time the oncologist asks a question). Embedding without splitting first means embedding a 200-page document as one vector — useless. Storing before embedding has nothing to store. Retrieving before storing has nothing to retrieve from.</p>
          <button onClick={reset} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
