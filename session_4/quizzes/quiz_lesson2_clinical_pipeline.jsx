import React, { useState } from 'react';

const questions = [
  {
    question: "What is the correct way to load a biomedical NER model using the HuggingFace pipeline API?",
    options: [
      "pipeline('biomedical-ner', model='d4data')",
      "pipeline('ner', model='d4data/biomedical-ner-all')",
      "pipeline.load('d4data/biomedical-ner-all', task='ner')",
      "import d4data; d4data.ner()"
    ],
    correct: 1,
    explanation: "The pipeline() function takes the task name ('ner') as the first argument and the specific model identifier as the model parameter. The model identifier follows the format 'organization/model-name' matching the HuggingFace Hub URL."
  },
  {
    question: "You run a biomedical NER model on 'Patient has Stage IIIA NSCLC, started on carboplatin/paclitaxel.' The model returns entities with labels like DISEASE, DRUG. What HuggingFace task type is this?",
    options: [
      "text-classification — it classifies the text",
      "token-classification — it labels individual tokens/entities within the text",
      "text-generation — it generates entity labels",
      "question-answering — it answers questions about entities"
    ],
    correct: 1,
    explanation: "Named Entity Recognition is a token-classification task — it assigns labels to individual tokens (words or sub-words) within the text, not to the text as a whole. Text-classification assigns one label to the entire input."
  },
  {
    question: "The word 'pembrolizumab' is a single token in a biomedical tokenizer but gets split into 4 sub-tokens by a general tokenizer. Why does this matter for clinical NLP?",
    options: [
      "It does not matter — the model processes them the same way",
      "More tokens means higher API costs",
      "A biomedical tokenizer preserves medical terms as meaningful units, improving the model's ability to understand and extract clinical entities",
      "General tokenizers are more accurate because they see more pieces"
    ],
    correct: 2,
    explanation: "When a tokenizer preserves medical terms as single units, the model can learn their meaning as a whole. When terms are fragmented into sub-word pieces, the model must reconstruct the meaning from fragments — which degrades performance on clinical text. This is why domain-specific tokenizers matter."
  },
  {
    question: "You want to summarize 200 radiology reports using a HuggingFace pipeline. What is the most efficient approach?",
    options: [
      "Call the pipeline in a for-loop, one report at a time",
      "Pass all 200 reports as a list to the pipeline for batched inference",
      "Concatenate all reports into one giant string",
      "Use a different model for each report"
    ],
    correct: 1,
    explanation: "Batched inference — passing a list of texts to the pipeline — is more efficient because it allows the model to process multiple inputs in parallel on the GPU. A for-loop processes one at a time and wastes GPU capacity. Concatenating would exceed context limits."
  },
  {
    question: "You run the same clinical note through two NER models: a biomedical model (d4data/biomedical-ner-all) and a general model (dslim/bert-base-NER). The biomedical model finds 'non-small cell lung cancer' as a DISEASE entity. The general model misses it entirely. Why?",
    options: [
      "The general model has a bug",
      "The general model was trained on news/web text where cancer terminology rarely appears, so it never learned to recognize clinical entities",
      "The biomedical model is larger and therefore always better",
      "NER models can only find entities they were explicitly programmed to detect"
    ],
    correct: 1,
    explanation: "Models learn from their training data. A general NER model trained on news articles learned to recognize person names, organizations, and locations — not clinical entities. The biomedical model was specifically trained on medical text where disease names, drug names, and procedures appear frequently."
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
          {score >= 4 ? "Excellent! You understand the pipeline API and clinical model selection." : score >= 3 ? "Good grasp — review tokenization and model comparison concepts." : "Review the pipeline API and clinical model concepts before the lab."}
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