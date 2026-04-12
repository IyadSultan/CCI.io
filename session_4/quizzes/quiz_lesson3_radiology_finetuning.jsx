import React, { useState } from 'react';

const questions = [
  {
    question: "A radiologist at KHCC wants a model that generates impression sections from findings. You have 3,000 radiology reports with both sections. Should you fine-tune or prompt engineer?",
    options: [
      "Prompt engineer — it is always better to avoid training",
      "Fine-tune — you have thousands of input-output pairs for a specific task format, and want consistent local performance",
      "Neither — use a general model without modification",
      "Fine-tune only if you have more than 100,000 examples"
    ],
    correct: 1,
    explanation: "Fine-tuning is ideal here: you have thousands of examples of the exact task format (findings to impression), you want consistent performance on this specific task, and you want a local model without API costs. Prompt engineering works for flexible, few-example tasks — not for high-volume specialized formatting."
  },
  {
    question: "In transfer learning, what does the pre-trained model already know before fine-tuning?",
    options: [
      "Nothing — training starts from random weights",
      "Only the specific task you want to fine-tune for",
      "General language understanding (grammar, semantics, and if biomedical, medical terminology) from pre-training on large text corpora",
      "The exact format of radiology reports"
    ],
    correct: 2,
    explanation: "Transfer learning's power comes from the pre-trained model's existing knowledge. A model pre-trained on biomedical text already understands medical vocabulary, sentence structure, and domain concepts. Fine-tuning adds task-specific knowledge (like the findings-to-impression format) on top of this foundation."
  },
  {
    question: "You fine-tune a summarization model and get ROUGE-L = 0.15. Your colleague's model gets ROUGE-L = 0.45. What does this mean?",
    options: [
      "Your model generates longer summaries",
      "Your colleague's model produces summaries that overlap significantly more with the reference impressions — it is generating more accurate content",
      "ROUGE-L only measures length, not quality",
      "Both models are equally good — ROUGE scores are unreliable"
    ],
    correct: 1,
    explanation: "ROUGE-L measures the longest common subsequence between generated and reference text. A score of 0.45 means substantial overlap with what radiologists actually wrote. A score of 0.15 suggests the model is generating text that poorly matches the reference impressions. While ROUGE is not perfect, large differences indicate real quality gaps."
  },
  {
    question: "You set learning_rate=0.1 for fine-tuning (typical is 2e-5 = 0.00002). What will likely happen?",
    options: [
      "The model will train faster and produce better results",
      "The model will catastrophically forget its pre-trained knowledge — the large updates will destroy the weights learned during pre-training",
      "Nothing different — learning rate does not affect fine-tuning",
      "The model will become more creative"
    ],
    correct: 1,
    explanation: "A learning rate of 0.1 is roughly 5000x larger than the typical fine-tuning rate (2e-5). Such large weight updates will overwrite the pre-trained knowledge the model already has — this is called catastrophic forgetting. Fine-tuning uses small learning rates precisely to preserve the pre-trained foundation while making targeted adjustments."
  },
  {
    question: "Your fine-tuned model performs well on the training data (ROUGE-L = 0.55) but poorly on unseen reports (ROUGE-L = 0.20). What is happening?",
    options: [
      "The model is underfitting — it needs more training epochs",
      "The model is overfitting — it memorized the training examples instead of learning the general pattern",
      "The evaluation metric is broken",
      "The unseen reports are in a different language"
    ],
    correct: 1,
    explanation: "A large gap between training performance and test performance is the classic sign of overfitting. The model memorized specific training examples rather than learning the general pattern of findings-to-impression generation. Solutions include: fewer epochs, more training data, weight decay regularization, or dropout."
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
          {score >= 4 ? "Excellent! You understand fine-tuning concepts and evaluation metrics." : score >= 3 ? "Good foundation — review ROUGE metrics and overfitting." : "Review transfer learning and training hyperparameters before the lab."}
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