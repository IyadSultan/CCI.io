# CCI Session 4: HuggingFace & Open-Source Models
## Curriculum — 5 Lessons + Wrap-Up

**Audience:** Completed Sessions 1-3 (prompt engineering, Python, OpenAI API, SQL, text-to-SQL). Students can make API calls, build extraction pipelines, and query databases. This is their first time using HuggingFace and open-source models.
**Clinical Anchor:** Multi-domain — radiology report summarization, clinical NER, chest X-ray classification, and understanding transformer architecture from scratch
**Session Duration:** 2.5 hours
**Lab Mode:** Guided step-by-step (Google Colab)
**Content/Practice Split:** 50/50
**Environment:** Google Colab notebooks with GPU runtime (T4)

---

## LESSON 1 OF 6: The HuggingFace Ecosystem — A Guided Tour

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"In Sessions 1-3 you used OpenAI — a closed-source API where you send data to someone else's server. Today we enter the open-source world. HuggingFace is the GitHub of AI — over 800,000 models, 200,000 datasets, all free to download and run on your own machine. No API key. No usage fees. No sending patient data to external servers. For clinical AI at KHCC, this changes everything."

---

### NotebookLM Summary

HuggingFace is the central hub of the open-source AI ecosystem — think of it as GitHub, but specifically for machine learning models and datasets. Understanding this ecosystem is essential because it gives you access to hundreds of thousands of pre-trained models that you can download, run locally, and customize for clinical applications at KHCC.

The **Model Hub** hosts over 800,000 models organized by task (text classification, named entity recognition, summarization, image classification, and more), framework (PyTorch, TensorFlow, JAX), language, and license. Every model has a **model card** — a documentation page that describes what the model was trained on, its intended use cases, performance benchmarks, limitations, and license terms. Reading model cards is critical in clinical AI: a model trained on Reddit comments will perform very differently on radiology reports than one trained on PubMed abstracts. Key clinical models include BioBERT (trained on PubMed), ClinicalBERT (trained on clinical notes from MIMIC-III), BiomedNLP-BiomedBERT from Microsoft, and PubMedBERT from Google.

The **Datasets Hub** hosts over 200,000 datasets that you can load with a single line of Python. Clinical datasets include PubMedQA, medical NER corpora, and radiology report collections. **Spaces** are interactive web demos where you can test models in your browser before writing any code. The **Inference API** lets you test models directly on the HuggingFace website — type in text, see the output, no installation required.

The **Transformers library** (`pip install transformers`) is the Python interface to all of this. It provides a unified API to load any model from the Hub, run inference, and fine-tune on your own data. Whether you want to extract diseases from clinical notes, summarize pathology reports, or classify chest X-rays, the code pattern is the same.

Why does open-source matter for clinical AI? First, **data sovereignty** — patient data never leaves KHCC servers. With OpenAI, every clinical note you process crosses the internet to external servers. With open-source models running locally, PHI stays within your infrastructure. Second, **cost** — no per-token billing, no usage limits, no surprise invoices. Third, **customization** — you can fine-tune models on KHCC-specific oncology data. Fourth, **reproducibility** — you can freeze a model version and guarantee identical results months later.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const mockModelCard = {
  name: "emilyalsentzer/Bio_ClinicalBERT",
  pipeline_tag: "fill-mask",
  training_data: "MIMIC-III clinical notes (discharge summaries, nursing notes, radiology reports) + PubMed abstracts",
  base_model: "BioBERT (pre-trained on PubMed)",
  parameters: "110M",
  license: "MIT",
  languages: ["English"],
  intended_use: "Clinical NLP tasks including named entity recognition, relation extraction, and clinical text classification on English clinical notes",
  limitations: "Trained only on English clinical notes from a single US hospital (MIMIC-III / Beth Israel Deaconess). May not generalize well to notes from other countries, specialties not well represented in MIMIC-III, or non-English text. Not validated for direct clinical decision-making.",
  metrics: "Outperforms general BERT on clinical NER (i2b2 2010: F1 0.877 vs 0.847) and clinical NLI (MedNLI: accuracy 0.832 vs 0.782)",
  last_updated: "2020-04-15"
};

const questions = [
  {
    id: 'training_data',
    label: 'What clinical data was this model trained on?',
    options: [
      'Wikipedia and BookCorpus',
      'MIMIC-III clinical notes + PubMed abstracts',
      'Reddit medical forums',
      'KHCC oncology notes'
    ],
    correct: 1,
    hint: 'Look at the "Training Data" field in the model card.'
  },
  {
    id: 'task_type',
    label: 'What HuggingFace task type is this model tagged with?',
    options: [
      'text-generation',
      'summarization',
      'fill-mask (masked language model)',
      'question-answering'
    ],
    correct: 2,
    hint: 'The pipeline_tag tells you the primary task. Fill-mask models predict missing words — they are the base for fine-tuning on downstream tasks.'
  },
  {
    id: 'limitation',
    label: 'A KHCC oncologist wants to use this model on Arabic clinical notes. Based on the model card, what is the main concern?',
    options: [
      'The model is too large for clinical use',
      'The license does not permit clinical applications',
      'It was trained only on English text from a single US hospital — it may not work for Arabic or KHCC-specific notes',
      'The model has not been updated recently enough'
    ],
    correct: 2,
    hint: 'Check the "Limitations" section — it explicitly mentions language and hospital specificity.'
  },
  {
    id: 'license',
    label: 'Can KHCC legally use this model in a clinical data pipeline?',
    options: [
      'No — clinical models require a medical device license',
      'Yes — the MIT license permits commercial and clinical use with minimal restrictions',
      'Only if KHCC pays a licensing fee to the authors',
      'Only for research, not production'
    ],
    correct: 1,
    hint: 'The MIT license is one of the most permissive open-source licenses.'
  },
  {
    id: 'appropriate',
    label: 'Overall, is this model appropriate as a STARTING POINT for building a clinical NER system at KHCC for English pathology reports?',
    options: [
      'No — it was not trained on oncology data specifically',
      'Yes — it was trained on clinical notes and outperforms general BERT on clinical NER, making it a strong base for fine-tuning on KHCC oncology data',
      'No — it is too old (2020) to be useful',
      'Yes — it can be deployed directly without any adaptation'
    ],
    correct: 1,
    hint: 'Consider that fine-tuning adapts a pre-trained model to your specific domain. A model pre-trained on clinical text is a much better starting point than a general-purpose model.'
  }
];

export default function Practice() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId, optIdx) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const getScore = () => questions.filter(q => answers[q.id] === q.correct).length;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Model Card Reader</h2>
      <p style={{ color: '#666', marginBottom: 12 }}>Read the model card below and answer the questions. This is exactly how you will evaluate models before using them in clinical pipelines.</p>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 24, border: '1px solid #dee2e6' }}>
        <h3 style={{ marginTop: 0, color: '#0d6efd' }}>{mockModelCard.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px', fontSize: 14, lineHeight: 1.6 }}>
          <strong>Pipeline Tag:</strong> <span>{mockModelCard.pipeline_tag}</span>
          <strong>Training Data:</strong> <span>{mockModelCard.training_data}</span>
          <strong>Base Model:</strong> <span>{mockModelCard.base_model}</span>
          <strong>Parameters:</strong> <span>{mockModelCard.parameters}</span>
          <strong>License:</strong> <span>{mockModelCard.license}</span>
          <strong>Languages:</strong> <span>{mockModelCard.languages.join(', ')}</span>
          <strong>Intended Use:</strong> <span>{mockModelCard.intended_use}</span>
          <strong>Limitations:</strong> <span>{mockModelCard.limitations}</span>
          <strong>Metrics:</strong> <span>{mockModelCard.metrics}</span>
          <strong>Last Updated:</strong> <span>{mockModelCard.last_updated}</span>
        </div>
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} style={{ marginBottom: 20, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #dee2e6' }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>{qi + 1}. {q.label}</p>
          {q.options.map((opt, oi) => (
            <div key={oi} onClick={() => handleSelect(q.id, oi)} style={{
              padding: '10px 14px', margin: '6px 0', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
              border: `2px solid ${submitted ? (oi === q.correct ? '#198754' : oi === answers[q.id] ? '#dc3545' : '#dee2e6') : answers[q.id] === oi ? '#0d6efd' : '#dee2e6'}`,
              background: submitted ? (oi === q.correct ? '#d4edda' : oi === answers[q.id] && oi !== q.correct ? '#f8d7da' : '#fff') : '#fff',
              fontSize: 14
            }}>{opt}</div>
          ))}
          {submitted && answers[q.id] !== q.correct && (
            <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 4 }}>Hint: {q.hint}</p>
          )}
        </div>
      ))}

      {!submitted && (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16, opacity: Object.keys(answers).length < questions.length ? 0.5 : 1 }}>
          Check My Answers
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / {questions.length}</h3>
          <p>{getScore() >= 4 ? "Excellent model card reading skills! You can evaluate HuggingFace models for clinical appropriateness." : "Review the model card fields — in the lab you will evaluate real models on the HuggingFace Hub."}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 2 OF 6: Clinical Models & the Pipeline API

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Now let's actually USE these models. HuggingFace's pipeline() is the fastest way to go from zero to working inference. In 3 lines of Python you can extract medical entities from clinical notes, classify text, or summarize reports — using models that were trained on biomedical literature. Let's see what open-source clinical NLP can do."

---

### NotebookLM Summary

The `pipeline()` function from the Transformers library is the simplest way to use any model on HuggingFace. It handles tokenization, model loading, and post-processing in a single call. In three lines of Python — `from transformers import pipeline`, `ner = pipeline("ner", model="d4data/biomedical-ner-all")`, `results = ner("Patient diagnosed with non-small cell lung cancer, started on pembrolizumab.")` — you have a working clinical NER system.

HuggingFace organizes models by **task type**, and each task maps to a pipeline name. **text-classification** assigns a label to an entire text (e.g., classifying a note as "discharge summary" vs "progress note"). **ner** (or token-classification) labels individual tokens — extracting diseases, drugs, and procedures from clinical text. **summarization** condenses long text into shorter summaries. **text-generation** produces new text given a prompt. **fill-mask** predicts masked words (used in pre-training, useful for probing what a model "knows"). **question-answering** extracts answers from a provided context passage.

To load a specific model, pass its HuggingFace identifier: `pipeline("ner", model="d4data/biomedical-ner-all")`. Key clinical models include: **d4data/biomedical-ner-all** for extracting diseases, drugs, and procedures; **emilyalsentzer/Bio_ClinicalBERT** for clinical text understanding; **microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract** for biomedical NLP tasks; and **google/flan-t5-small** for summarization and text generation.

**Tokenization** is how text becomes numbers the model can process. Every model has its own tokenizer that splits text into tokens — sub-word units that map to integer IDs, which then map to embedding vectors. Clinical text tokenizes differently than general text: "pembrolizumab" might be one token in a biomedical tokenizer but split into "pem", "bro", "liz", "umab" in a general one. This affects model performance — a biomedical tokenizer preserves medical terms as meaningful units.

Running inference is straightforward: pass text to the pipeline and get structured results back. For NER, you get a list of dictionaries with entity text, label (DISEASE, DRUG, etc.), confidence score, and character positions. For summarization, you get the condensed text. You can also process multiple texts at once (batching) for efficiency when running a pipeline over hundreds of clinical notes.

Comparing models on the same input is a critical evaluation step. Run the same clinical note through `d4data/biomedical-ner-all` and `dslim/bert-base-NER` (a general-purpose NER model) — the biomedical model will catch medical entities the general model misses entirely.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const scenarios = [
  {
    id: 1,
    title: "Extracting Diseases from Pathology Reports",
    description: "The KHCC tumor registry needs to automatically extract disease names (cancer types, conditions) from pathology report text. Example input: 'Invasive ductal carcinoma, grade 2, ER-positive.'",
    correctTask: "ner",
    correctModel: "d4data/biomedical-ner-all",
    taskOptions: ["text-classification", "ner", "summarization", "text-generation", "question-answering"],
    modelOptions: ["gpt2", "d4data/biomedical-ner-all", "facebook/bart-large-cnn", "bert-base-uncased"],
    explanation: "NER (token-classification) extracts individual entities from text. d4data/biomedical-ner-all was trained specifically on biomedical text to recognize diseases, drugs, and procedures."
  },
  {
    id: 2,
    title: "Summarizing Radiology Reports",
    description: "Radiologists write detailed findings sections. The department wants to auto-generate a brief impression (2-3 sentences) from the full findings. Example: a 500-word CT chest report needs a 50-word summary.",
    correctTask: "summarization",
    correctModel: "google/flan-t5-small",
    taskOptions: ["text-classification", "ner", "summarization", "text-generation", "question-answering"],
    modelOptions: ["d4data/biomedical-ner-all", "google/flan-t5-small", "dslim/bert-base-NER", "distilbert-base-uncased"],
    explanation: "Summarization condenses long text into shorter versions. google/flan-t5-small is a versatile text-to-text model capable of summarization that runs efficiently on a T4 GPU in Colab."
  },
  {
    id: 3,
    title: "Classifying Clinical Note Types",
    description: "KHCC receives thousands of clinical notes daily. Each needs to be routed to the correct department. The system must classify each note as: Discharge Summary, Progress Note, Pathology Report, or Radiology Report.",
    correctTask: "text-classification",
    correctModel: "emilyalsentzer/Bio_ClinicalBERT",
    taskOptions: ["text-classification", "ner", "summarization", "text-generation", "question-answering"],
    modelOptions: ["emilyalsentzer/Bio_ClinicalBERT", "d4data/biomedical-ner-all", "gpt2", "google/flan-t5-small"],
    explanation: "Text-classification assigns one label to the entire document. Bio_ClinicalBERT, trained on clinical notes, understands the structure and language patterns that distinguish note types."
  },
  {
    id: 4,
    title: "Answering Questions About a Clinical Note",
    description: "A nurse pastes a discharge summary and asks: 'What medications was the patient prescribed at discharge?' The system should find and extract the answer from the note text.",
    correctTask: "question-answering",
    correctModel: "microsoft/BiomedNLP-BiomedBERT-base",
    taskOptions: ["text-classification", "ner", "summarization", "text-generation", "question-answering"],
    modelOptions: ["gpt2", "dslim/bert-base-NER", "microsoft/BiomedNLP-BiomedBERT-base", "facebook/bart-large-cnn"],
    explanation: "Question-answering extracts a span from the provided context that answers the question. BiomedBERT understands biomedical terminology, making it effective at finding clinical information within notes."
  },
  {
    id: 5,
    title: "Identifying Drug Names in Prescription Text",
    description: "The pharmacy department needs to extract all drug names from free-text prescription notes. Example: 'Start tamoxifen 20mg daily, continue ondansetron 8mg PRN, discontinue metformin.'",
    correctTask: "ner",
    correctModel: "d4data/biomedical-ner-all",
    taskOptions: ["text-classification", "ner", "summarization", "text-generation", "question-answering"],
    modelOptions: ["bert-base-uncased", "google/flan-t5-small", "d4data/biomedical-ner-all", "emilyalsentzer/Bio_ClinicalBERT"],
    explanation: "Extracting individual drug names from text is NER (token-classification). d4data/biomedical-ner-all recognizes DRUG entities specifically, having been trained on biomedical corpora with annotated drug mentions."
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selections, setSelections] = useState({ task: '', model: '' });
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[currentScenario];

  const checkAnswer = () => {
    let points = 0;
    if (selections.task === s.correctTask) points++;
    if (selections.model === s.correctModel) points++;
    setScores([...scores, points]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentScenario(c => c + 1);
    setSelections({ task: '', model: '' });
    setSubmitted(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Clinical Task Matcher Complete!</h2>
        <p style={{ fontSize: 20 }}>You scored {totalScore} / {scenarios.length * 2} points</p>
        <div style={{ background: totalScore >= 8 ? '#d4edda' : totalScore >= 6 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {totalScore >= 8 ? "Excellent! You can match clinical scenarios to the right HuggingFace tasks and models." : totalScore >= 6 ? "Good intuition — review the distinction between NER and text-classification." : "Review the different HuggingFace task types and which clinical models fit each."}
        </div>
        <button onClick={() => { setCurrentScenario(0); setScores([]); setSubmitted(false); setSelections({ task: '', model: '' }); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {currentScenario + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{s.description}</p>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>HuggingFace Task Type:</label>
        <select value={selections.task} onChange={e => setSelections({ ...selections, task: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select task...</option>
          {s.taskOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Best Model:</label>
        <select value={selections.model} onChange={e => setSelections({ ...selections, model: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select model...</option>
          {s.modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {!submitted && <button onClick={checkAnswer} disabled={!selections.task || !selections.model} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: (!selections.task || !selections.model) ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {scores[scores.length - 1]} / 2</strong></p>
          <p>{selections.task === s.correctTask ? 'Correct' : 'Incorrect'} Task: best choice is <strong>{s.correctTask}</strong></p>
          <p>{selections.model === s.correctModel ? 'Correct' : 'Incorrect'} Model: best choice is <strong>{s.correctModel}</strong></p>
          <p style={{ marginTop: 8, fontStyle: 'italic', fontSize: 14 }}>{s.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 3 OF 6: Fine-Tuning for Radiology Report Summarization

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Off-the-shelf models are good — but they weren't trained on YOUR data. A general summarization model doesn't know radiology terminology. Fine-tuning is how you take a pre-trained model and teach it your specific task. Today we'll fine-tune a model on 1000+ radiology reports to generate impressions from findings. This is one of the most requested AI features by radiologists at KHCC."

---

### NotebookLM Summary

Fine-tuning is the process of taking a pre-trained model and continuing its training on your specific dataset and task. The pre-trained model already understands language — grammar, semantics, and (if biomedical) medical terminology. Fine-tuning teaches it your specific task format: given radiology findings, generate the impression section. This is **transfer learning** — transferring general knowledge to a specialized task.

When should you fine-tune vs. prompt engineer? Use prompt engineering (like you did with OpenAI in Session 3) when you have few examples, need flexibility across tasks, or want to iterate quickly. Fine-tune when you have hundreds or thousands of examples for a specific task format, need consistent performance on that exact task, and want a model that runs locally without API costs. Radiology report summarization is a perfect fine-tuning candidate: thousands of reports exist with clear input (findings) and output (impression) pairs.

The **Open-I Indiana University Chest X-Ray dataset** contains approximately 3,800 radiology reports with both findings and impressions sections. Loading it is simple with the HuggingFace datasets library: `from datasets import load_dataset; dataset = load_dataset("dataset_name")`. Data preprocessing involves tokenizing both the input (findings text) and the target (impression text) using the model's tokenizer, then padding and truncating to consistent lengths.

The **Trainer API** from HuggingFace simplifies the training loop. You configure **TrainingArguments** with hyperparameters: `num_train_epochs` (how many times to iterate over the dataset — typically 3-5), `learning_rate` (how aggressively to update weights — 2e-5 is a common starting point for fine-tuning), `per_device_train_batch_size` (how many examples to process in parallel — limited by GPU memory, typically 4-8 on a T4), and `weight_decay` (regularization to prevent overfitting). Then you create a Trainer with the model, arguments, and datasets, and call `trainer.train()`.

Evaluation uses **ROUGE metrics** — the standard for summarization. ROUGE-1 measures unigram overlap between generated and reference summaries. ROUGE-2 measures bigram overlap (captures phrase-level accuracy). ROUGE-L measures the longest common subsequence (captures sentence structure). Higher scores mean the generated impression is closer to what the radiologist actually wrote. A ROUGE-L above 0.40 is generally considered good for clinical summarization.

The before/after comparison is the most powerful demonstration: run the same radiology report through the base model (before fine-tuning) and the fine-tuned model. The base model produces generic summaries. The fine-tuned model produces radiology-appropriate impressions with correct terminology and format. This single comparison demonstrates why fine-tuning matters for clinical AI.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const parameters = [
  {
    name: 'learning_rate',
    label: 'Learning Rate',
    options: [
      { value: '0.1', label: '0.1 (very high)', effect: { memory: 0, time: 1, risk: 'Catastrophic forgetting — destroys pre-trained knowledge', quality: 'Very Poor' } },
      { value: '5e-4', label: '5e-4 (high for fine-tuning)', effect: { memory: 0, time: 1, risk: 'May overwrite pre-trained weights too aggressively', quality: 'Risky' } },
      { value: '2e-5', label: '2e-5 (recommended)', effect: { memory: 0, time: 1, risk: 'Balanced — preserves pre-trained knowledge while learning the task', quality: 'Good' } },
      { value: '1e-7', label: '1e-7 (very low)', effect: { memory: 0, time: 3, risk: 'Too slow to learn — model barely changes from base', quality: 'Poor (undertrained)' } }
    ],
    correct: '2e-5',
    explanation: 'For fine-tuning, 2e-5 is the standard starting point. It is small enough to preserve the pre-trained foundation but large enough to adapt the model to your specific task within a few epochs.'
  },
  {
    name: 'num_train_epochs',
    label: 'Number of Epochs',
    options: [
      { value: '1', label: '1 epoch', effect: { memory: 0, time: 0.5, risk: 'May not see enough examples to learn the task well', quality: 'Undertrained' } },
      { value: '3', label: '3 epochs (recommended)', effect: { memory: 0, time: 1, risk: 'Good balance — sees each example 3 times', quality: 'Good' } },
      { value: '10', label: '10 epochs', effect: { memory: 0, time: 3.3, risk: 'High risk of overfitting — memorizes training data', quality: 'Risky (overfit)' } },
      { value: '50', label: '50 epochs', effect: { memory: 0, time: 16.7, risk: 'Extreme overfitting guaranteed on small datasets', quality: 'Very Poor' } }
    ],
    correct: '3',
    explanation: 'For fine-tuning with 1,000-4,000 examples, 3-5 epochs is standard. The model sees each example multiple times to learn patterns. Too many epochs leads to overfitting, especially on smaller datasets like radiology reports.'
  },
  {
    name: 'per_device_train_batch_size',
    label: 'Batch Size',
    options: [
      { value: '1', label: '1 (minimum)', effect: { memory: 2, time: 4, risk: 'Very noisy gradient updates, slow training', quality: 'Unstable' } },
      { value: '4', label: '4 (recommended for T4)', effect: { memory: 6, time: 1, risk: 'Good balance of speed and GPU memory for T4 Colab', quality: 'Good' } },
      { value: '16', label: '16 (large)', effect: { memory: 14, time: 0.4, risk: 'May run out of memory on T4 (15GB) with larger models', quality: 'Good if it fits' } },
      { value: '64', label: '64 (very large)', effect: { memory: 48, time: 0.15, risk: 'Will crash — exceeds T4 GPU memory (15GB VRAM)', quality: 'Crash' } }
    ],
    correct: '4',
    explanation: 'Batch size determines how many examples are processed in parallel. On a T4 GPU (15GB VRAM) with flan-t5-small, batch size 4 uses about 6GB — leaving room for the model and optimizer. Batch size 64 would require ~48GB, far exceeding the T4.'
  },
  {
    name: 'weight_decay',
    label: 'Weight Decay (Regularization)',
    options: [
      { value: '0.0', label: '0.0 (no regularization)', effect: { memory: 0, time: 1, risk: 'No protection against overfitting', quality: 'Risky on small data' } },
      { value: '0.01', label: '0.01 (recommended)', effect: { memory: 0, time: 1, risk: 'Mild regularization — helps prevent overfitting', quality: 'Good' } },
      { value: '0.5', label: '0.5 (aggressive)', effect: { memory: 0, time: 1, risk: 'Over-regularized — model cannot learn effectively', quality: 'Undertrained' } },
      { value: '1.0', label: '1.0 (extreme)', effect: { memory: 0, time: 1, risk: 'Weights are heavily penalized — severe underfitting', quality: 'Very Poor' } }
    ],
    correct: '0.01',
    explanation: 'Weight decay adds a small penalty for large weights, acting as regularization against overfitting. 0.01 is a standard value for fine-tuning — it gently discourages memorization without preventing learning.'
  }
];

export default function Practice() {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (paramName, value) => {
    if (submitted) return;
    setSelections({ ...selections, [paramName]: value });
  };

  const getSelectedEffect = (param) => {
    const sel = selections[param.name];
    if (!sel) return null;
    return param.options.find(o => o.value === sel)?.effect;
  };

  const getScore = () => parameters.filter(p => selections[p.name] === p.correct).length;

  const totalMemory = parameters.reduce((sum, p) => {
    const effect = getSelectedEffect(p);
    return sum + (effect?.memory || 0);
  }, 0);

  const totalTimeMultiplier = parameters.reduce((prod, p) => {
    const effect = getSelectedEffect(p);
    return prod * (effect?.time || 1);
  }, 1);

  const estimatedMinutes = Math.round(15 * totalTimeMultiplier);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Training Configuration Builder</h2>
      <p style={{ color: '#666', marginBottom: 8 }}>Configure hyperparameters for fine-tuning <strong>google/flan-t5-small</strong> on 3,000 radiology reports using a <strong>T4 GPU</strong> (15GB VRAM) in Google Colab.</p>

      {parameters.map((param, pi) => (
        <div key={param.name} style={{ marginBottom: 20, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #dee2e6' }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>{pi + 1}. {param.label}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {param.options.map(opt => (
              <div key={opt.value} onClick={() => handleSelect(param.name, opt.value)} style={{
                padding: '10px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${submitted ? (opt.value === param.correct ? '#198754' : opt.value === selections[param.name] ? '#dc3545' : '#dee2e6') : selections[param.name] === opt.value ? '#0d6efd' : '#dee2e6'}`,
                background: submitted ? (opt.value === param.correct ? '#d4edda' : opt.value === selections[param.name] && opt.value !== param.correct ? '#f8d7da' : '#fff') : selections[param.name] === opt.value ? '#e7f1ff' : '#fff',
                fontSize: 14
              }}>{opt.label}</div>
            ))}
          </div>
          {selections[param.name] && !submitted && (
            <div style={{ marginTop: 8, padding: 8, background: '#f8f9fa', borderRadius: 6, fontSize: 13 }}>
              <strong>Impact:</strong> {getSelectedEffect(param)?.risk} | <strong>Expected quality:</strong> {getSelectedEffect(param)?.quality}
            </div>
          )}
          {submitted && (
            <div style={{ marginTop: 8, padding: 8, background: '#f0f4ff', borderRadius: 6, fontSize: 13, borderLeft: '3px solid #0d6efd' }}>
              {param.explanation}
            </div>
          )}
        </div>
      ))}

      {Object.keys(selections).length === parameters.length && !submitted && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, marginBottom: 16, border: '1px solid #dee2e6' }}>
          <h4 style={{ marginTop: 0 }}>Estimated Training Configuration</h4>
          <p>GPU Memory Usage: ~{totalMemory}GB / 15GB (T4) {totalMemory > 15 ? ' -- WILL CRASH' : ' -- fits'}</p>
          <p>Estimated Training Time: ~{estimatedMinutes} minutes</p>
        </div>
      )}

      {!submitted && (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(selections).length < parameters.length} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16, opacity: Object.keys(selections).length < parameters.length ? 0.5 : 1 }}>
          Check Configuration
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / {parameters.length} optimal choices</h3>
          <p>{getScore() >= 3 ? "Great configuration instinct! In the lab you will use these exact parameters to fine-tune flan-t5-small." : "Review what each hyperparameter does — understanding these is essential for successful fine-tuning."}</p>
          <button onClick={() => { setSelections({}); setSubmitted(false); }} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 6: Clinical Vision — Chest X-Ray Pneumonia Detection

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"AI isn't just about text — medical imaging is one of the biggest frontiers. Chest X-rays are the most common diagnostic imaging exam in the world. Today you'll load a pre-trained image classification model, test it on real chest X-ray images, then fine-tune it to detect pneumonia. By the end of this lesson you'll have a working pneumonia detector — trained by you, running on your machine."

---

### NotebookLM Summary

Medical imaging AI is one of the most active areas in clinical AI, and image classification — determining whether an image belongs to one category or another — is the foundational task. For chest X-rays, this means classifying an image as NORMAL or PNEUMONIA, a task with direct clinical value for screening and triage.

**Transfer learning** is even more critical in medical imaging than in NLP. Training an image classifier from scratch requires millions of labeled images. Medical datasets are typically small (thousands, not millions). The solution: start with a model pre-trained on ImageNet (14 million general images — animals, objects, scenes) that has already learned to detect edges, textures, shapes, and patterns. Then fine-tune it on your medical images. The low-level features (edges, gradients) transfer directly; only the high-level features (what constitutes "pneumonia" vs "normal") need to be learned.

**MobileNet** is a lightweight, efficient architecture designed for mobile and edge deployment. It uses depthwise separable convolutions to achieve competitive accuracy with far fewer parameters than larger models like ResNet. For clinical settings with limited compute resources, MobileNet is an excellent choice — fast inference, small model size, and reasonable accuracy.

The **Kaggle Chest X-Ray Pneumonia dataset** contains 5,863 pediatric chest X-ray images organized into NORMAL (1,583 images) and PNEUMONIA (4,273 images) categories, with pre-defined train/validation/test splits. Images must be preprocessed: resize to a consistent dimension (224x224 for MobileNet), normalize pixel values, and optionally apply **data augmentation** — random rotations, horizontal flips, and brightness adjustments that create training variety without requiring new images.

The fine-tuning process involves replacing MobileNet's original classification head (designed for 1,000 ImageNet categories) with a new binary classifier (NORMAL vs PNEUMONIA), freezing the early convolutional layers (which detect generic visual features), and training only the later layers and new classifier on the chest X-ray data.

**Evaluation metrics** are especially critical in clinical imaging. **Accuracy** alone can be misleading — if 73% of images are pneumonia, a model that always predicts "pneumonia" achieves 73% accuracy while being clinically useless. **Precision** measures what fraction of pneumonia predictions are correct. **Recall** (sensitivity) measures what fraction of actual pneumonia cases are detected. In a screening context, **recall matters more** — a missed pneumonia (false negative) is clinically worse than a false alarm (false positive) that gets caught on follow-up. The **confusion matrix** visualizes all four outcomes (true positives, false positives, true negatives, false negatives) and is the single most important evaluation tool for clinical classifiers.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "A chest X-ray pneumonia detector has 95% accuracy. The dataset is 73% pneumonia, 27% normal. A colleague points out a problem. What is it?",
    options: [
      "95% accuracy is too high — the model must be cheating",
      "A model that always predicts 'pneumonia' would achieve 73% accuracy, so 95% might not be as impressive as it seems — and class imbalance means accuracy alone is misleading",
      "The dataset is too small for meaningful accuracy",
      "Accuracy should always be 100% for clinical applications"
    ],
    correct: 1,
    explanation: "With 73% pneumonia prevalence, the baseline 'always predict pneumonia' strategy gives 73% accuracy for free. When classes are imbalanced, accuracy alone is misleading. You need precision, recall, and the confusion matrix to understand real performance."
  },
  {
    question: "For a pneumonia screening tool used in an emergency department, which metric matters MOST?",
    options: [
      "Precision — every positive prediction must be correct",
      "Recall (sensitivity) — the model must catch as many actual pneumonia cases as possible, even if some false positives occur",
      "Accuracy — overall correctness is what matters",
      "Specificity — correctly identifying normal cases matters most"
    ],
    correct: 1,
    explanation: "In a screening context, missing a pneumonia case (false negative) means a sick patient goes untreated — potentially life-threatening. A false positive (flagging a normal case) leads to additional testing, which is inconvenient but safe. Recall prioritizes catching all true cases."
  },
  {
    question: "Why does fine-tuning a MobileNet pre-trained on ImageNet work for chest X-rays, even though ImageNet contains no medical images?",
    options: [
      "It does not work — you need a model pre-trained on medical images",
      "ImageNet pre-training teaches the model to detect edges, textures, and shapes that transfer to any image domain — only the high-level features need to be learned for X-rays",
      "MobileNet automatically adapts to any image type",
      "The model ignores the ImageNet weights and trains from scratch"
    ],
    correct: 1,
    explanation: "Transfer learning works because low-level visual features (edges, gradients, textures) are universal across image domains. A model pre-trained on ImageNet has already learned these. Fine-tuning teaches only the high-level, domain-specific features — like what opacity patterns indicate pneumonia in a chest X-ray."
  },
  {
    question: "During fine-tuning, you 'freeze the early layers' of MobileNet. What does this mean and why?",
    options: [
      "You delete the early layers to make the model smaller",
      "You prevent the early layers from being updated during training — they already detect useful low-level features (edges, textures) and updating them could damage this knowledge",
      "You convert the early layers to a different data type",
      "You copy the early layers to a separate model"
    ],
    correct: 1,
    explanation: "Freezing means setting requires_grad=False so these layers' weights are not updated during training. Early convolutional layers detect edges, textures, and basic shapes — these are universally useful and were already well-learned from ImageNet. Updating them on a small medical dataset risks losing this knowledge."
  },
  {
    question: "Your pneumonia detector confusion matrix shows: TP=380, FP=45, FN=20, TN=155. What is the recall, and is it clinically acceptable for screening?",
    options: [
      "Recall = 380/(380+45) = 89.4% — needs improvement for screening",
      "Recall = 380/(380+20) = 95.0% — good for screening, as it catches 95% of pneumonia cases",
      "Recall = 155/(155+20) = 88.6% — moderate performance",
      "Recall = (380+155)/600 = 89.2% — acceptable"
    ],
    correct: 1,
    explanation: "Recall = TP / (TP + FN) = 380 / (380 + 20) = 95.0%. This means the model correctly identifies 95% of actual pneumonia cases, missing only 5%. For a screening tool, 95% recall is strong — most pneumonia cases are caught. The 45 false positives would receive follow-up, which is the safe clinical outcome."
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
          {score >= 4 ? "Excellent! You understand clinical image classification and evaluation metrics." : score >= 3 ? "Good foundation — review precision vs recall in clinical contexts." : "Review transfer learning and clinical evaluation metrics before the lab."}
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const confusionMatrices = [
  {
    id: 1,
    title: "Model A — Pneumonia Screening Tool",
    context: "Emergency department triage: this model flags X-rays for radiologist review. False negatives mean missed pneumonia. False positives mean extra radiologist reviews.",
    tp: 420, fp: 80, fn: 10, tn: 90,
    priorityMetric: "recall",
    clinicalQuestion: "Is this model safe for ER screening where missing pneumonia is dangerous?",
    idealAnswer: "Yes — recall is 97.7% (only misses 2.3% of pneumonia cases). The 80 false positives add radiologist workload but are clinically safe."
  },
  {
    id: 2,
    title: "Model B — Diagnostic Confirmation Tool",
    context: "Used after initial suspicion to CONFIRM pneumonia diagnosis. False positives lead to unnecessary antibiotics. High precision is needed.",
    tp: 350, fp: 10, fn: 80, tn: 160,
    priorityMetric: "precision",
    clinicalQuestion: "Is this model safe for diagnostic confirmation where false positives lead to unnecessary treatment?",
    idealAnswer: "Precision is 97.2% (very few false positives), but recall is only 81.4% — it misses 19% of cases. Good for confirmation, but should not be used alone for screening."
  },
  {
    id: 3,
    title: "Model C — Balanced Clinical Model",
    context: "General-purpose clinical support. Used as a second opinion alongside radiologist interpretation.",
    tp: 390, fp: 40, fn: 40, tn: 130,
    priorityMetric: "f1",
    clinicalQuestion: "How balanced is this model's performance across both classes?",
    idealAnswer: "F1 = 0.907, balancing precision (90.7%) and recall (90.7%). Solid general-purpose performance as a second opinion tool, but may need higher recall for standalone screening."
  }
];

export default function Practice() {
  const [currentMatrix, setCurrentMatrix] = useState(0);
  const [answers, setAnswers] = useState({ accuracy: '', precision: '', recall: '', f1: '', safe: '' });
  const [checked, setChecked] = useState(false);

  const m = confusionMatrices[currentMatrix];
  const total = m.tp + m.fp + m.fn + m.tn;
  const correctAccuracy = ((m.tp + m.tn) / total * 100).toFixed(1);
  const correctPrecision = (m.tp / (m.tp + m.fp) * 100).toFixed(1);
  const correctRecall = (m.tp / (m.tp + m.fn) * 100).toFixed(1);
  const p = m.tp / (m.tp + m.fp);
  const r = m.tp / (m.tp + m.fn);
  const correctF1 = (2 * p * r / (p + r) * 100).toFixed(1);

  const checkTolerance = (userVal, correctVal) => {
    const uv = parseFloat(userVal);
    const cv = parseFloat(correctVal);
    return !isNaN(uv) && Math.abs(uv - cv) < 2;
  };

  const next = () => {
    setCurrentMatrix(c => c + 1);
    setAnswers({ accuracy: '', precision: '', recall: '', f1: '', safe: '' });
    setChecked(false);
  };

  if (currentMatrix >= confusionMatrices.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Clinical Metrics Practice Complete!</h2>
        <p style={{ fontSize: 18 }}>You have evaluated {confusionMatrices.length} clinical models using confusion matrices.</p>
        <div style={{ background: '#d4edda', padding: 20, borderRadius: 8 }}>
          Understanding precision vs recall in clinical context is essential. In screening, prioritize recall. In diagnosis confirmation, prioritize precision. Always show the full confusion matrix to clinicians.
        </div>
        <button onClick={() => { setCurrentMatrix(0); setChecked(false); setAnswers({ accuracy: '', precision: '', recall: '', f1: '', safe: '' }); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentMatrix + 1) / confusionMatrices.length) * 100}%` }} />
      </div>
      <h3>{m.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, fontSize: 14, lineHeight: 1.6 }}>{m.context}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, maxWidth: 350, margin: '16px auto', textAlign: 'center' }}>
        <div style={{ background: '#e8e8e8', padding: 8, fontWeight: 'bold' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div style={{ background: '#e8e8e8', padding: 8, fontWeight: 'bold', fontSize: 13 }}>Pred: Pneumonia</div>
          <div style={{ background: '#e8e8e8', padding: 8, fontWeight: 'bold', fontSize: 13 }}>Pred: Normal</div>
        </div>
        <div style={{ background: '#e8e8e8', padding: 8, fontWeight: 'bold', fontSize: 13 }}>Actual: Pneumonia</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div style={{ background: '#d4edda', padding: 12, fontWeight: 'bold' }}>TP = {m.tp}</div>
          <div style={{ background: '#f8d7da', padding: 12, fontWeight: 'bold' }}>FN = {m.fn}</div>
        </div>
        <div style={{ background: '#e8e8e8', padding: 8, fontWeight: 'bold', fontSize: 13 }}>Actual: Normal</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div style={{ background: '#fff3cd', padding: 12, fontWeight: 'bold' }}>FP = {m.fp}</div>
          <div style={{ background: '#d4edda', padding: 12, fontWeight: 'bold' }}>TN = {m.tn}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Accuracy (%):</label>
          <input type="text" value={answers.accuracy} onChange={e => setAnswers({...answers, accuracy: e.target.value})} disabled={checked} placeholder="(TP+TN)/Total" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Precision (%):</label>
          <input type="text" value={answers.precision} onChange={e => setAnswers({...answers, precision: e.target.value})} disabled={checked} placeholder="TP/(TP+FP)" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Recall (%):</label>
          <input type="text" value={answers.recall} onChange={e => setAnswers({...answers, recall: e.target.value})} disabled={checked} placeholder="TP/(TP+FN)" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>F1 Score (%):</label>
          <input type="text" value={answers.f1} onChange={e => setAnswers({...answers, f1: e.target.value})} disabled={checked} placeholder="2*P*R/(P+R)" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', fontSize: 14 }}>{m.clinicalQuestion}</label>
        <textarea value={answers.safe} onChange={e => setAnswers({...answers, safe: e.target.value})} disabled={checked} placeholder="Your clinical assessment..." style={{ width: '100%', minHeight: 60, padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4, boxSizing: 'border-box' }} />
      </div>

      {!checked && <button onClick={() => setChecked(true)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Calculations</button>}

      {checked && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{checkTolerance(answers.accuracy, correctAccuracy) ? 'Correct' : 'Incorrect'} <strong>Accuracy:</strong> {correctAccuracy}%</p>
          <p>{checkTolerance(answers.precision, correctPrecision) ? 'Correct' : 'Incorrect'} <strong>Precision:</strong> {correctPrecision}%</p>
          <p>{checkTolerance(answers.recall, correctRecall) ? 'Correct' : 'Incorrect'} <strong>Recall:</strong> {correctRecall}%</p>
          <p>{checkTolerance(answers.f1, correctF1) ? 'Correct' : 'Incorrect'} <strong>F1:</strong> {correctF1}%</p>
          <p style={{ marginTop: 8, fontStyle: 'italic', fontSize: 14 }}><strong>Clinical assessment:</strong> {m.idealAnswer}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentMatrix + 1 < confusionMatrices.length ? 'Next Model' : 'See Summary'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 6: Build a Language Model from Scratch — microGPT

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"You've now USED pre-trained models and FINE-TUNED them. But how do they actually work inside? Today we open the black box. Using Andrej Karpathy's legendary teaching code, we'll build a tiny GPT model from scratch — attention mechanism, embeddings, training loop, the whole thing. This won't be a production model — it will be a 10-million parameter toy trained on Shakespeare. But when you see it generate text after training, you'll understand what's happening inside every LLM you've used in this course."

---

### NotebookLM Summary

Every model you have used in this course — GPT-4o, BioBERT, ClinicalBERT, flan-t5 — is built on the **transformer architecture**. This lesson opens the black box and shows you what is happening inside, piece by piece.

It starts with **token embeddings**. The model cannot process text directly — it needs numbers. Each token in the vocabulary (a word, sub-word, or character) is mapped to a dense vector of numbers called an embedding. These embeddings are learned during training. Tokens with similar meanings end up with similar vectors, and the model uses these representations to understand language.

Next, **positional encodings** tell the model where each token sits in the sequence. Unlike RNNs that process tokens one at a time (inherently knowing order), transformers process all tokens in parallel. Without positional encodings, the model cannot distinguish "the patient treated the doctor" from "the doctor treated the patient." Positional encodings are added to the token embeddings so each token knows its position.

The core mechanism is **self-attention** — this is what makes transformers transformative. For each token, the model computes three vectors: a Query (what am I looking for?), a Key (what do I contain?), and a Value (what information do I carry?). Attention scores are computed by comparing each token's Query against every other token's Key. High scores mean strong attention — the model learns which tokens are relevant to which. In "the patient was diagnosed with stage IIIA NSCLC", the word "IIIA" should attend strongly to "stage" and "NSCLC" to understand it is a cancer staging descriptor.

**Multi-head attention** runs multiple attention patterns in parallel. One head might capture syntactic relationships, another semantic relationships, another positional relationships. The outputs are concatenated and projected, giving the model rich, multi-dimensional understanding of each token's context.

After attention, tokens pass through a **feed-forward network** — two linear layers with a nonlinear activation. This is where individual token representations are transformed. **Layer normalization** stabilizes training by normalizing activations. These components stack into **transformer blocks**, and the model is made of multiple stacked blocks.

The **training loop** is remarkably simple: take a sequence, predict the next token at each position, compute the cross-entropy loss between predictions and actual tokens, backpropagate gradients, and update weights with an optimizer. Repeat millions of times. Karpathy's microGPT implements this entire architecture in approximately 300 lines of Python — a minimal but complete GPT. Students train it on a text corpus and watch the output evolve from random characters to increasingly coherent text. This is the same fundamental process that produced GPT-4o, just at a much smaller scale.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "In a transformer, tokens are converted into dense numerical vectors before processing. What are these vectors called?",
    options: [
      "Attention weights",
      "Token embeddings — learned vector representations where similar tokens have similar vectors",
      "Positional encodings",
      "Gradient vectors"
    ],
    correct: 1,
    explanation: "Token embeddings are the foundation of transformer processing. Each token is mapped to a dense vector (e.g., 768 dimensions for BERT). These embeddings are learned during training — tokens that appear in similar contexts end up with similar vector representations."
  },
  {
    question: "Why do transformers need positional encodings? What problem do they solve?",
    options: [
      "They make the model faster by indicating which tokens to skip",
      "They tell the model the position of each token in the sequence — without them, 'patient treated doctor' and 'doctor treated patient' would be indistinguishable",
      "They encode the language of the input text",
      "They reduce the number of parameters in the model"
    ],
    correct: 1,
    explanation: "Transformers process all tokens in parallel (unlike RNNs which process sequentially). Without positional encodings, the model has no way to know token order — it sees a 'bag of tokens.' Positional encodings are added to embeddings so each token carries both its meaning and its position."
  },
  {
    question: "In self-attention, each token computes three vectors: Query, Key, and Value. What does the attention score between two tokens represent?",
    options: [
      "The physical distance between the two tokens in the text",
      "How relevant one token is to another — computed by comparing the Query of one token with the Key of another",
      "The grammatical relationship between the tokens",
      "The probability that both tokens appear in the same sentence"
    ],
    correct: 1,
    explanation: "The attention score is computed as the dot product of one token's Query with another token's Key, then scaled and softmax-normalized. A high score means the model has learned that these tokens are highly relevant to each other in context. This is how the model learns relationships like 'IIIA' attending to 'stage' and 'NSCLC.'"
  },
  {
    question: "Multi-head attention runs multiple attention patterns in parallel rather than a single attention computation. Why is this beneficial?",
    options: [
      "It makes the model train faster by parallelizing computation",
      "Each head can learn different types of relationships — one head might capture syntax, another semantics, another long-range dependencies — giving richer understanding",
      "It reduces the total number of parameters",
      "It is required for the model to process batches of inputs"
    ],
    correct: 1,
    explanation: "Different attention heads specialize in different patterns. One might learn that adjectives attend to their nouns, another that verbs attend to their subjects, another that clinical values attend to their measurement types. Multiple heads give the model a richer, multi-faceted understanding of each token's context."
  },
  {
    question: "Karpathy's microGPT has ~10 million parameters. GPT-4 has an estimated 1+ trillion. Both use the same fundamental architecture. What primarily changes as you scale up?",
    options: [
      "The architecture changes completely at larger scales",
      "The number of transformer blocks, attention heads, and embedding dimensions increase — and with enough scale, emergent capabilities appear that the small model cannot exhibit",
      "Larger models use a fundamentally different training algorithm",
      "Larger models do not need tokenization"
    ],
    correct: 1,
    explanation: "Scale means more transformer blocks (depth), more attention heads per block, and larger embedding dimensions (width). The architecture is the same — but at scale, emergent capabilities appear: reasoning, in-context learning, and instruction following that small models cannot achieve. Understanding the small model helps you understand the foundation of the large one."
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
          {score >= 4 ? "Excellent! You understand transformer internals — embeddings, attention, and how scale creates capability." : score >= 3 ? "Good grasp — review self-attention and multi-head attention." : "Review the transformer architecture components before the lab."}
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const components = [
  { id: 'embed', name: 'Token Embedding', description: 'Converts each token (word/sub-word) into a dense numerical vector. The vocabulary maps text to integers, and the embedding layer maps integers to learned vectors (e.g., 768 dimensions).', correctOrder: 1 },
  { id: 'pos', name: 'Positional Encoding', description: 'Adds position information to each token embedding. Without this, the model cannot distinguish word order — "patient treated doctor" would equal "doctor treated patient."', correctOrder: 2 },
  { id: 'attn', name: 'Multi-Head Self-Attention', description: 'Each token computes Query, Key, Value vectors. Attention scores determine which tokens are relevant to each other. Multiple heads capture different relationship types (syntax, semantics, long-range).', correctOrder: 3 },
  { id: 'norm1', name: 'Layer Normalization (post-attention)', description: 'Normalizes activations after attention to stabilize training. Applied with a residual connection — the input is added back to the output (skip connection) to preserve information flow.', correctOrder: 4 },
  { id: 'ff', name: 'Feed-Forward Network', description: 'Two linear layers with a nonlinear activation (GELU/ReLU) in between. Transforms each token representation independently. This is where individual token features are refined.', correctOrder: 5 },
  { id: 'norm2', name: 'Layer Normalization (post-FFN)', description: 'Second normalization with residual connection after the feed-forward network. Together with the first, these form one complete transformer block. Multiple blocks are stacked.', correctOrder: 6 },
  { id: 'output', name: 'Output Projection (LM Head)', description: 'A linear layer that maps the final hidden state to vocabulary-sized logits. Softmax converts these to probabilities over all tokens. The highest probability token is the prediction.', correctOrder: 7 }
];

export default function Practice() {
  const [arrangement, setArrangement] = useState(() => {
    const shuffled = [...components].sort(() => Math.random() - 0.5);
    return shuffled.map(c => c.id);
  });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleClick = (idx) => {
    if (checked) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      const newArr = [...arrangement];
      [newArr[selectedIdx], newArr[idx]] = [newArr[idx], newArr[selectedIdx]];
      setArrangement(newArr);
      setSelectedIdx(null);
    }
  };

  const getComponent = (id) => components.find(c => c.id === id);

  const getScore = () => {
    return arrangement.reduce((score, id, idx) => {
      const comp = getComponent(id);
      return score + (comp.correctOrder === idx + 1 ? 1 : 0);
    }, 0);
  };

  const correctOrder = [...components].sort((a, b) => a.correctOrder - b.correctOrder);

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Transformer Architecture Builder</h2>
      <p style={{ color: '#666', marginBottom: 8 }}>Arrange the transformer components in the correct order (input at top, output at bottom). Click two components to swap them. Click a component name to see its description.</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ background: '#e9ecef', padding: '6px 16px', borderRadius: '8px 8px 0 0', fontSize: 13, fontWeight: 'bold', color: '#666' }}>INPUT: Raw text tokens</div>
        <div style={{ width: 2, height: 12, background: '#adb5bd' }} />
      </div>

      {arrangement.map((id, idx) => {
        const comp = getComponent(id);
        const isCorrect = checked && comp.correctOrder === idx + 1;
        const isWrong = checked && comp.correctOrder !== idx + 1;
        return (
          <div key={id}>
            <div onClick={() => handleClick(idx)} style={{
              padding: '14px 18px', margin: '4px 0', borderRadius: 8, cursor: checked ? 'default' : 'pointer',
              border: `2px solid ${checked ? (isCorrect ? '#198754' : '#dc3545') : selectedIdx === idx ? '#0d6efd' : '#dee2e6'}`,
              background: checked ? (isCorrect ? '#d4edda' : '#f8d7da') : selectedIdx === idx ? '#e7f1ff' : '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>
                <span style={{ color: '#666', marginRight: 8 }}>{idx + 1}.</span>
                {comp.name}
              </span>
              <span onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === id ? null : id); }} style={{ cursor: 'pointer', color: '#0d6efd', fontSize: 13 }}>
                {expandedId === id ? 'hide' : 'info'}
              </span>
            </div>
            {expandedId === id && (
              <div style={{ padding: '8px 18px', margin: '0 0 4px 0', background: '#f8f9fa', borderRadius: '0 0 8px 8px', fontSize: 13, lineHeight: 1.5, borderLeft: '3px solid #0d6efd' }}>
                {comp.description}
              </div>
            )}
            {idx < arrangement.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 2, height: 8, background: '#adb5bd' }} />
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <div style={{ width: 2, height: 12, background: '#adb5bd' }} />
        <div style={{ background: '#e9ecef', padding: '6px 16px', borderRadius: '0 0 8px 8px', fontSize: 13, fontWeight: 'bold', color: '#666' }}>OUTPUT: Next token prediction</div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {!checked && (
          <button onClick={() => setChecked(true)} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16 }}>
            Check Order
          </button>
        )}
      </div>

      {checked && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / {components.length} components in correct position</h3>
          <p style={{ marginBottom: 8 }}>Correct order:</p>
          <ol style={{ fontSize: 14, lineHeight: 1.8 }}>
            {correctOrder.map(c => (
              <li key={c.id}><strong>{c.name}</strong></li>
            ))}
          </ol>
          <p style={{ marginTop: 12, fontStyle: 'italic', fontSize: 14 }}>
            This sequence repeats for each transformer block. A model like BERT has 12 blocks, GPT-3 has 96 blocks. The microGPT you will build in the lab has 6 blocks — the same architecture, just smaller.
          </p>
          <button onClick={() => {
            setArrangement([...components].sort(() => Math.random() - 0.5).map(c => c.id));
            setChecked(false); setSelectedIdx(null); setExpandedId(null);
          }} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Shuffle & Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 6: Wrap-Up — Review & Consolidation

**Estimated time:** 10 minutes

---

### Review Table

| Lesson | Topic | Core Concepts | Clinical Application |
|--------|-------|---------------|---------------------|
| 1 | The HuggingFace Ecosystem | Model Hub, Datasets Hub, Spaces, model cards, open-source vs closed-source | Evaluate and select clinical AI models with data sovereignty — no PHI leaves KHCC |
| 2 | Clinical Models & Pipeline API | pipeline() API, task types (NER, classification, summarization), tokenization, model comparison | Extract entities from clinical notes, classify documents, summarize reports using biomedical models |
| 3 | Fine-Tuning for Radiology Summarization | Transfer learning, Trainer API, hyperparameters, ROUGE metrics, overfitting | Fine-tune a model to generate radiology impressions from findings — KHCC radiologists' most requested feature |
| 4 | Clinical Vision — CXR Pneumonia Detection | Image classification, MobileNet, data augmentation, precision/recall/F1, confusion matrices | Build a chest X-ray pneumonia detector; understand why recall matters more than accuracy in screening |
| 5 | Build a Language Model from Scratch | Token embeddings, positional encodings, self-attention, multi-head attention, training loop | Demystify the transformer architecture powering every LLM — understand what happens inside GPT-4o |

**Connecting the Dots:** This session moved you from AI consumer to AI builder. In Lesson 1 you learned to navigate the open-source ecosystem and evaluate models. In Lesson 2 you used pre-trained clinical models with a single function call. In Lesson 3 you went further — fine-tuning a model on domain-specific data to outperform general models on radiology reports. In Lesson 4 you applied the same transfer learning concept to medical imaging, building a pneumonia detector from a general vision model. And in Lesson 5 you opened the black box to understand the transformer architecture that powers every model you have used in this entire course. The progression — use, fine-tune, understand from scratch — gives you the full picture: you can now evaluate any model, adapt it to your clinical needs, and understand why it works.

---

### Common Mistakes & Gotchas

1. **Not reading the model card before using a clinical model** — A model trained on Reddit will fail on clinical text. Always check training data, intended use, and limitations before deploying any model in a clinical context.

2. **Using a general NER model for biomedical entities** — Models like `dslim/bert-base-NER` recognize person names and organizations but miss diseases and drugs entirely. Always use biomedical-specific models (d4data/biomedical-ner-all) for clinical NER.

3. **Setting the learning rate too high during fine-tuning** — A learning rate of 0.01 instead of 2e-5 will destroy the pre-trained knowledge (catastrophic forgetting). Fine-tuning learning rates should be 10-100x smaller than pre-training rates.

4. **Evaluating image classifiers with accuracy alone on imbalanced data** — A pneumonia dataset with 73% positive cases makes accuracy misleading. Always report precision, recall, F1, and show the confusion matrix.

5. **Running fine-tuning without a GPU** — Fine-tuning on CPU is orders of magnitude slower. In Google Colab, always verify you have a GPU runtime (Runtime > Change runtime type > T4 GPU) before starting any training.

---

### Quick Self-Check (No-Code)

1. Name three advantages of open-source models over the OpenAI API for clinical AI at KHCC.
2. What is the difference between text-classification and token-classification (NER)?
3. When should you fine-tune vs. prompt engineer?
4. Why does recall matter more than precision for a pneumonia screening tool?
5. In a transformer, what do Query, Key, and Value vectors do in self-attention?

<details>
<summary>Answers</summary>

1. Data sovereignty (PHI stays within KHCC), no per-token costs, ability to fine-tune on domain-specific data. Also: reproducibility (frozen model versions) and no dependency on external API availability.
2. Text-classification assigns one label to the entire input (e.g., "this note is a discharge summary"). Token-classification (NER) assigns labels to individual tokens within the text (e.g., "carboplatin" is a DRUG, "NSCLC" is a DISEASE).
3. Fine-tune when you have hundreds/thousands of examples for a specific task format and need consistent local performance. Prompt engineer when you have few examples, need flexibility, or want to iterate quickly without training.
4. In screening, missing a true positive (false negative) means a sick patient goes untreated — potentially life-threatening. A false positive leads to additional testing, which is safe. Recall measures how many actual positives are caught.
5. Query = "what am I looking for?", Key = "what do I contain?", Value = "what information do I carry?" Attention scores are computed by comparing Queries with Keys, and these scores weight the Values to produce the attention output.
</details>

---

### NotebookLM Review Notebook

Create a review notebook in [NotebookLM](https://notebooklm.google.com) with these sources:
- This curriculum document (all 5 lesson summaries)
- The HuggingFace Transformers documentation (pipeline API section)
- Andrej Karpathy's "Let's build GPT" video transcript
- Any Colab notebooks from the lab

Use the Audio Overview feature to generate a review podcast, then use the chat to quiz yourself on concepts you found challenging.

---

### What's Next

In Session 5, you will build on everything from Sessions 1-4 by exploring AI agents and LangChain. You will combine the OpenAI API skills from Session 3 with the open-source model knowledge from Session 4 to build autonomous clinical assistants that can reason, use tools, access databases, and chain multiple steps together. The fine-tuning and evaluation skills you learned today will help you understand when to use local models vs. API models in your agent pipelines.

---

## SESSION 4 ASSIGNMENT: Clinical NER Fine-Tuning Pipeline

**Due:** Before Session 5
**Estimated effort:** 3-5 hours
**Submission:** Push to your personal GitHub repo under `assignments/session-4/` and share the link with Dr. Iyad

---

### Clinical Scenario

> The KHCC tumor registry needs to extract cancer-related entities (cancer type, stage, biomarkers, treatments) from pathology reports. Currently, tumor registrars manually read each report and enter data into the registry — a process that takes 15-20 minutes per report and is prone to inconsistency between registrars. The registry director wants an automated extraction pipeline that can pre-populate fields, with registrars reviewing and correcting the output. You will fine-tune a HuggingFace NER model on annotated clinical text, evaluate with entity-level precision/recall/F1, and compare against the OpenAI extraction approach from Session 3.

### Requirements

**Part 1 — Foundation (30%): Load & Run Biomedical NER**
Build a pipeline that:
- Loads the `d4data/biomedical-ner-all` model using the HuggingFace pipeline API
- Creates 10 synthetic pathology report excerpts (varying in style, completeness, and complexity — some with staging, some without, some with abbreviations)
- Runs NER inference on all 10 notes and displays the extracted entities with their labels and confidence scores
- Analyzes the results: which entity types are detected, which are missed, what confidence thresholds would you set for production use?
- Must produce a working Colab notebook

**Part 2 — Application (30%): Fine-Tune on a Clinical NER Dataset**
Fine-tune a biomedical NER model:
- Load the BC5CDR (BioCreative V CDR) corpus or NCBI Disease corpus from HuggingFace datasets
- Preprocess the data: tokenize, align labels with sub-word tokens, create train/validation splits
- Fine-tune using the Trainer API with appropriate hyperparameters (document your choices)
- Evaluate with entity-level precision, recall, and F1 (using `seqeval` or manual computation)
- Show before/after comparison: base model vs fine-tuned model on the same test examples
- Must produce a working Colab notebook with GPU runtime

**Part 3 — Analysis & Critical Thinking (20%)**
Write 300-400 words addressing:
- Compare HuggingFace fine-tuned NER vs OpenAI API extraction (from Session 3) across four dimensions: cost per 1,000 notes, accuracy on your test examples, data privacy implications for KHCC, and inference latency
- What entity types are hardest for the model to extract and why? (Include specific examples from your pipeline)
- How would you validate this NER system before deploying it to assist tumor registrars at KHCC?
- What are the risks of a false negative (missed entity) vs false positive (hallucinated entity) in the tumor registry context?

**Part 4 — Stretch Challenge (20%)**
Choose one:
- **Different clinical task:** Fine-tune on a different clinical NER or classification dataset (e.g., i2b2 medication extraction, clinical sentiment, or radiology report classification) and compare performance
- **Model benchmarking:** Run the same 10 pathology notes through 3 different HuggingFace NER models (e.g., d4data/biomedical-ner-all, samrawal/bert-base-uncased_clinical-ner, alvaroalon2/biobert_diseases_ner) and create a comparison table with precision, recall, F1, and inference time per note
- **End-to-end pipeline:** Build a complete pipeline that takes a raw pathology report, runs NER extraction, structures the output as JSON (matching a schema like your Session 3 Pydantic models), and stores results in a SQLite database

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Code quality & correctness | 25% | Clean, runs without errors on Colab with GPU, handles edge cases | Runs with minor issues | Broken or incomplete |
| Clinical relevance | 25% | Directly applicable to KHCC tumor registry, realistic pathology report patterns, meaningful entity analysis | Clinically reasonable but generic | Abstract/disconnected from oncology context |
| Critical analysis (Part 3) | 25% | Identifies non-obvious tradeoffs between open-source and API approaches, proposes realistic validation strategy | Surface-level comparison | Missing or generic |
| Stretch challenge (Part 4) | 25% | Creative, well-implemented, demonstrates independent thinking and technical growth | Attempted but shallow | Not attempted |

### Anti-Shortcut Rules
- Your 10 pathology notes must be different in style and complexity from any examples used in class
- Your fine-tuning hyperparameters must be documented with justification — do not just copy defaults without explanation
- Part 3 must reference YOUR specific pipeline's results, not generic comparisons between open-source and API models
- Include a screenshot of your fine-tuned model's entity extraction output on at least one pathology note
- If you use ChatGPT/Claude to generate your pathology notes, state this clearly and explain what you modified to make them realistic

---

**KHCC connection:** This assignment mirrors the actual workflow being planned by the KHCC tumor registry, where manual entity extraction from pathology reports is one of the most time-consuming steps. A validated NER pipeline could reduce registration time by 60-70%, allowing registrars to focus on verification and complex cases rather than initial data entry.
