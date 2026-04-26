import React, { useState } from 'react';

const cases = [
  {
    question: "What is the recommended chemotherapy regimen for stage III favorable-histology Wilms tumor?",
    retrieved: "Chunk 1: Stage I favorable histology is treated with vincristine + actinomycin-D for 18 weeks. — Chunk 2: Surgery is the first step in localized Wilms tumor. — Chunk 3: Pathology classification distinguishes favorable from anaplastic histology.",
    answer: "Stage III favorable-histology Wilms tumor is treated with vincristine, actinomycin-D, and doxorubicin combined with flank radiotherapy.",
    options: [
      { id: 'faithfulness', label: 'Faithfulness will fail (claims not in context)' },
      { id: 'context_recall', label: 'Contextual Recall will fail (relevant info missing from retrieved chunks)' },
      { id: 'context_relevancy', label: 'Contextual Relevancy will fail (retrieved chunks are off-topic)' },
      { id: 'answer_relevancy', label: 'Answer Relevancy will fail (answer does not address the question)' }
    ],
    correct: ['faithfulness', 'context_recall'],
    explanation: "The retrieved chunks talk about stage I and general background — none of them mention the stage III regimen. Contextual Recall fails because the right chunk was not retrieved. Faithfulness also fails because the answer states a specific stage III regimen that does not appear in any retrieved chunk — the model is hallucinating from its training data."
  },
  {
    question: "What is the cisplatin dose in the standard regimen?",
    retrieved: "Chunk 1: Stage III favorable histology is treated with vincristine, actinomycin-D, and doxorubicin. Cisplatin is not part of the standard favorable-histology regimen.",
    answer: "Cisplatin is dosed at 100 mg/m² every 3 weeks based on standard pediatric protocols.",
    options: [
      { id: 'faithfulness', label: 'Faithfulness will fail (claims not in context)' },
      { id: 'context_recall', label: 'Contextual Recall will fail (relevant info missing from retrieved chunks)' },
      { id: 'context_relevancy', label: 'Contextual Relevancy will fail (retrieved chunks are off-topic)' },
      { id: 'answer_relevancy', label: 'Answer Relevancy will fail (answer does not address the question)' }
    ],
    correct: ['faithfulness'],
    explanation: "The retrieved chunk explicitly says cisplatin is NOT part of the standard regimen — but the answer makes up a specific dose anyway. This is a faithfulness failure: the model ignored the retrieved context and pulled the dose from its training data. In clinical RAG this is exactly the failure that hurts patients."
  },
  {
    question: "What are the staging criteria for Wilms tumor?",
    retrieved: "Chunk 1: Vincristine causes peripheral neuropathy. — Chunk 2: Actinomycin-D extravasation should be managed with cold compresses. — Chunk 3: Doxorubicin has cardiotoxic effects measured by echocardiogram.",
    answer: "Wilms tumor staging is based on tumor extent, with Stage I confined to kidney and Stage V being bilateral disease.",
    options: [
      { id: 'faithfulness', label: 'Faithfulness will fail (claims not in context)' },
      { id: 'context_recall', label: 'Contextual Recall will fail (relevant info missing from retrieved chunks)' },
      { id: 'context_relevancy', label: 'Contextual Relevancy will fail (retrieved chunks are off-topic)' },
      { id: 'answer_relevancy', label: 'Answer Relevancy will fail (answer does not address the question)' }
    ],
    correct: ['faithfulness', 'context_recall', 'context_relevancy'],
    explanation: "Triple failure. Contextual Relevancy fails because all retrieved chunks are about side effects, not staging. Contextual Recall fails because the staging chunk was not retrieved. Faithfulness fails because the answer's claims are not in any retrieved chunk. Answer Relevancy holds — the answer does try to address the question, just not from the retrieved context."
  },
  {
    question: "How is bilateral Wilms tumor managed?",
    retrieved: "Chunk 1: Bilateral Wilms tumor (Stage V) requires nephron-sparing surgery when possible to preserve renal function. Pre-operative chemotherapy with vincristine and actinomycin-D is given to shrink tumors before surgery.",
    answer: "The recommended treatment for renal cell carcinoma is partial nephrectomy.",
    options: [
      { id: 'faithfulness', label: 'Faithfulness will fail (claims not in context)' },
      { id: 'context_recall', label: 'Contextual Recall will fail (relevant info missing from retrieved chunks)' },
      { id: 'context_relevancy', label: 'Contextual Relevancy will fail (retrieved chunks are off-topic)' },
      { id: 'answer_relevancy', label: 'Answer Relevancy will fail (answer does not address the question)' }
    ],
    correct: ['faithfulness', 'answer_relevancy'],
    explanation: "The retrieved chunk is exactly right — bilateral Wilms management. But the answer talks about renal cell carcinoma, a completely different disease. Answer Relevancy fails (off-topic). Faithfulness fails (claims not in retrieved context). This shows how a good retriever can be undone by a bad generator."
  }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const c = cases[idx];

  const toggle = (id) => {
    if (submitted) return;
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const submit = () => {
    const correctSet = new Set(c.correct);
    const pickedSet = new Set(picked);
    const exact = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x));
    if (exact) setScore(s => s + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked([]); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked([]); setSubmitted(false); setScore(0); };

  if (idx >= cases.length) {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Score the RAG — Complete!</h2>
        <p style={{ fontSize: 20 }}>You got {score} / {cases.length} cases exactly right.</p>
        <div style={{ background: score >= 3 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 3 ? "Excellent diagnostic instincts — you can localize RAG failures by metric." : "Review the four metrics — many failures are multi-metric, and identifying all of them is the goal."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / cases.length) * 100}%` }} />
      </div>
      <h3>Case {idx + 1} of {cases.length}</h3>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8 }}><strong>Question:</strong> {c.question}</p>
      <p style={{ background: '#e7f1ff', padding: 12, borderRadius: 8, fontSize: 13 }}><strong>Retrieved chunks:</strong> {c.retrieved}</p>
      <p style={{ background: '#f8d7da', padding: 12, borderRadius: 8 }}><strong>Generated answer:</strong> {c.answer}</p>

      <p style={{ fontWeight: 'bold', marginTop: 12 }}>Which DeepEval metrics will fail? (Select all that apply)</p>
      {c.options.map(opt => {
        const isPicked = picked.includes(opt.id);
        const isCorrect = c.correct.includes(opt.id);
        return (
          <div key={opt.id} onClick={() => toggle(opt.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${submitted ? (isCorrect ? '#198754' : isPicked ? '#dc3545' : '#dee2e6') : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: submitted ? (isCorrect ? '#d4edda' : isPicked && !isCorrect ? '#f8d7da' : '#fff') : isPicked ? '#e7f1ff' : '#fff'
          }}>{opt.label}</div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={picked.length === 0} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.5 : 1 }}>Score This Case</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{c.explanation}</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < cases.length ? 'Next Case' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
