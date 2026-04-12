import React, { useState } from 'react';

const questions = [
  {
    question: "HuggingFace hosts over 800,000 models. What is the primary document you should read before using any model for a clinical task?",
    options: [
      "The model's Python source code",
      "The model card — which describes training data, intended use, limitations, and license",
      "The model's download count and popularity ranking",
      "The model's file size and parameter count"
    ],
    correct: 1,
    explanation: "The model card is the most important document. It tells you what data the model was trained on (PubMed vs Reddit matters enormously for clinical use), its intended use cases, known limitations, and license terms. A model trained on general web text may perform poorly on clinical notes."
  },
  {
    question: "A KHCC oncologist wants to use an AI model to extract entities from clinical notes containing patient data. Why is an open-source model running locally preferred over the OpenAI API for this task?",
    options: [
      "Open-source models are always more accurate than OpenAI",
      "The OpenAI API is too expensive for clinical use",
      "Patient data (PHI) stays within KHCC infrastructure — no data leaves the hospital servers",
      "Open-source models are faster than the OpenAI API"
    ],
    correct: 2,
    explanation: "Data sovereignty is the primary advantage. When you use the OpenAI API, clinical notes containing PHI are transmitted to external servers. With open-source models running locally, all patient data stays within KHCC's infrastructure — a critical requirement for healthcare data privacy."
  },
  {
    question: "You find a model on HuggingFace tagged with tasks: 'token-classification' and trained on 'PubMed + MIMIC-III'. What does this model most likely do?",
    options: [
      "Generates clinical notes from scratch",
      "Classifies entire documents as positive or negative",
      "Identifies and labels specific entities (diseases, drugs, procedures) within text",
      "Translates clinical notes between languages"
    ],
    correct: 2,
    explanation: "Token-classification is the HuggingFace task name for Named Entity Recognition (NER). A model trained on PubMed and MIMIC-III clinical notes with this task tag extracts and labels individual entities — like diseases, medications, and procedures — from biomedical text."
  },
  {
    question: "Which HuggingFace feature lets you test a model's output directly in your browser without installing anything or writing any code?",
    options: [
      "The Transformers library",
      "The Datasets Hub",
      "Spaces and the Inference API widget on model pages",
      "The model card"
    ],
    correct: 2,
    explanation: "Spaces are interactive web demos, and the Inference API widget on each model's page lets you type input text and see the model's output directly in the browser. This is the fastest way to evaluate whether a model is worth downloading for your clinical use case."
  },
  {
    question: "You are choosing between two NER models for extracting cancer types from pathology reports. Model A was trained on Wikipedia text. Model B was trained on PubMed abstracts. Which should you choose and why?",
    options: [
      "Model A — Wikipedia has broader knowledge coverage",
      "Model B — it was trained on biomedical literature, so it understands medical terminology and cancer nomenclature",
      "Either model — NER works the same regardless of training data",
      "Neither — you need a model trained specifically on pathology reports"
    ],
    correct: 1,
    explanation: "Training data determines a model's domain expertise. Model B, trained on PubMed, has seen millions of biomedical texts with cancer terminology, drug names, and clinical language. Model A has general knowledge but lacks specialized medical vocabulary. Domain-matched training data is critical for clinical NLP."
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
          {score >= 4 ? "Excellent! You understand the HuggingFace ecosystem and why open-source matters for clinical AI." : score >= 3 ? "Good foundation — review model cards and data sovereignty concepts." : "Review the lesson material on the HuggingFace ecosystem before moving on."}
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