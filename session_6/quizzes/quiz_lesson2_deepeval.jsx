import React, { useState } from 'react';

const questions = [
  {
    question: "Your RAG returns a fluent, confident answer about cisplatin dosing for Wilms tumor — but the answer contains a dose that is NOT in the retrieved context. Which DeepEval metric will catch this?",
    options: [
      "Answer Relevancy",
      "Faithfulness",
      "Contextual Relevancy",
      "Contextual Recall"
    ],
    correct: 1,
    explanation: "Faithfulness measures whether every claim in the answer is grounded in the retrieved context. A claim that does not appear in the context is a hallucination — Faithfulness drops. In clinical RAG this is the most important metric: an unfaithful answer about a chemotherapy dose is a patient safety issue."
  },
  {
    question: "Your retriever returns 5 chunks. Only 1 is actually about the user's question; the other 4 are off-topic. Which metric drops?",
    options: [
      "Faithfulness",
      "Contextual Relevancy",
      "Answer Relevancy",
      "Contextual Recall"
    ],
    correct: 1,
    explanation: "Contextual Relevancy measures the proportion of retrieved chunks that are actually relevant to the question. If 1 of 5 is on-topic, contextual relevancy is around 0.2. The fix is usually better chunking, better embeddings, hybrid retrieval, or reranking."
  },
  {
    question: "What does Contextual Recall measure that Contextual Relevancy does NOT?",
    options: [
      "Speed of retrieval",
      "Whether the retriever found ALL the relevant information, or missed some — measured against ground truth",
      "Whether the answer is factually correct",
      "Whether the embedding model is up to date"
    ],
    correct: 1,
    explanation: "Contextual Relevancy is precision-like (of what we retrieved, how much is relevant). Contextual Recall is recall-like (of what is relevant in the corpus, how much did we retrieve). Recall requires ground truth — usually a reference answer or a list of must-include facts. Both matter, and they trade off."
  },
  {
    question: "DeepEval uses 'LLM-as-judge' under the hood. What does that mean?",
    options: [
      "DeepEval ships its own custom-trained classifier",
      "DeepEval calls a strong LLM (like GPT-4) to read the question, context, and answer, and produce the metric score",
      "DeepEval requires human annotators for every evaluation",
      "DeepEval matches keywords between answer and context"
    ],
    correct: 1,
    explanation: "DeepEval's metrics rely on a strong LLM judge that reads the inputs and reasons about the score. This is fast, scalable, and surprisingly reliable when prompts are well-designed. Caveats: judges have their own biases and cost API calls, so for production you also want some human-validated samples."
  },
  {
    question: "You compare a 'bad' RAG (50-token chunks, no overlap, no rerank) to a 'good' RAG (semantic chunks, hybrid retrieval, reranking). Which pattern is most likely to appear in the evaluation results?",
    options: [
      "The bad RAG scores higher on Faithfulness because smaller chunks contain fewer claims",
      "The good RAG scores noticeably higher on Contextual Relevancy and Contextual Recall — the generator metrics may also improve as a result",
      "Both score the same — chunking does not affect evaluation metrics",
      "Only Answer Relevancy will differ; retrieval metrics are independent of chunking"
    ],
    correct: 1,
    explanation: "Better retrieval directly improves Contextual Relevancy and Recall. Because the generator sees better context, Faithfulness and Answer Relevancy usually improve too — garbage chunks force the generator to either guess (hurting faithfulness) or give vague answers (hurting answer relevancy)."
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
          {score >= 4 ? "Excellent! You can map RAG failure modes to the metrics that catch them." : score >= 3 ? "Good — review the difference between Contextual Relevancy and Contextual Recall." : "Review the four metrics and what each one measures."}
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
