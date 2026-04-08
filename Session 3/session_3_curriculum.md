# CCI Session 3: Data Science Foundations — SQL, Python & LLMs
## Curriculum — 5 Lessons + Wrap-Up

**Audience:** Completed Session 1 (Foundations, Transformers & Prompt Engineering) and Session 2 (Python Basics + GitHub). Students understand prompting patterns, transformers conceptually, and can write Python code (variables, loops, functions, classes, basic pandas). This is their first time using the OpenAI API programmatically.
**Clinical Anchor:** Multi-domain — oncology clinical notes (data extraction), KHCC vista_vitals data (SQL pipeline), and text-to-SQL conversational interfaces
**Session Duration:** 2.5 hours
**Lab Mode:** Guided step-by-step (Google Colab)
**Content/Practice Split:** 50/50
**Environment:** Google Colab notebooks (no local installation required)

---

## LESSON 1 OF 6: OpenAI API Fundamentals

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Welcome to Session 3. In Session 1 you used the OpenAI Playground to explore prompting — you typed prompts and got responses. In Session 2 you learned Python. Today we combine both: you'll write Python code that talks to GPT. By the end of this lesson, you'll be able to make API calls, count tokens, estimate costs, and apply every prompting technique you learned in Session 1 — but now from code. This is how real clinical AI pipelines are built."

---

### NotebookLM Summary

The OpenAI Python SDK is the bridge between your Python code and GPT models. In Session 1, you used the OpenAI Playground to experiment with prompts manually. Now you will do the same thing programmatically, which means you can automate clinical workflows, process hundreds of notes, and build real applications.

To get started, you install the SDK with `pip install openai` and create a client with your API key. The core function is `client.chat.completions.create()`, which takes a model name (like `gpt-4o-mini` or `gpt-4o`) and a list of messages. Each message has a role — `system` (sets the AI's behavior and persona), `user` (the human's input), or `assistant` (previous AI responses). In clinical applications, the system message is critical: it defines guardrails like "You are a clinical data extraction assistant. Only return verified information from the note provided."

Key parameters control the model's behavior. `temperature` (0.0–2.0) controls randomness — use 0.0 for clinical extraction where you need deterministic, reproducible results, and higher values for creative tasks. `max_tokens` limits the response length. `top_p` is an alternative to temperature for controlling diversity. Understanding these parameters is essential for building reliable clinical pipelines where consistency matters.

Tokens are the fundamental unit of LLM processing — and billing. A token is roughly 3/4 of a word in English, but clinical text with medical terminology often tokenizes differently. The `tiktoken` library lets you count tokens before sending a request, so you can estimate costs and ensure you stay within context window limits. For GPT-4o, the context window is 128,000 tokens — roughly 300 pages of clinical notes. Input tokens and output tokens are priced differently, so counting both matters for budgeting.

Streaming responses (`stream=True`) returns tokens as they are generated, which is useful for long outputs like clinical summaries where you want to show progress to the user rather than waiting for the complete response.

Finally, you can implement all the prompting techniques from Session 1 through the API: zero-shot (just the question), few-shot (include examples in the messages), and chain-of-thought (instruct the model to reason step by step). For clinical differential diagnosis, chain-of-thought prompting significantly improves accuracy because it forces the model to show its reasoning before concluding.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You want the LLM to extract a diagnosis from a clinical note with maximum consistency. Which temperature setting is best?",
    options: ["temperature=1.5", "temperature=0.7", "temperature=0.0", "temperature=2.0"],
    correct: 2,
    explanation: "Temperature 0.0 produces the most deterministic output. For clinical data extraction, you want the same input to always produce the same output — reproducibility is critical in healthcare AI."
  },
  {
    question: "In the OpenAI API, you set role='system' with the message: 'You are an oncology data assistant.' What does this do?",
    options: [
      "It sends the message to OpenAI's system logs",
      "It defines the AI's persona and behavioral constraints for the entire conversation",
      "It overrides all safety filters",
      "It switches the model to a medical-specific version"
    ],
    correct: 1,
    explanation: "The system message sets the AI's behavior, persona, and guardrails. It applies to the entire conversation and is where you define clinical constraints like 'only extract information explicitly stated in the note.'"
  },
  {
    question: "A clinical note is 2,000 tokens. The model generates a 500-token response. If input costs $0.01/1K tokens and output costs $0.03/1K tokens, what is the total cost?",
    options: ["$0.02", "$0.035", "$0.05", "$0.075"],
    correct: 1,
    explanation: "Input: 2,000 × $0.01/1,000 = $0.02. Output: 500 × $0.03/1,000 = $0.015. Total: $0.02 + $0.015 = $0.035. Output tokens are typically more expensive than input tokens."
  },
  {
    question: "You are building a pipeline to process 500 discharge summaries. Which prompting technique should you use to get the model to identify cancer staging AND explain its reasoning?",
    options: [
      "Zero-shot: just ask 'What is the cancer stage?'",
      "Few-shot: provide 3 example notes with their stages",
      "Chain-of-thought: instruct the model to reason step-by-step before concluding",
      "No prompting technique — just increase max_tokens"
    ],
    correct: 2,
    explanation: "Chain-of-thought prompting forces the model to show its reasoning, which is critical when you need both the answer AND the justification. For clinical staging where errors have consequences, seeing the reasoning lets you verify the extraction."
  },
  {
    question: "You call client.chat.completions.create() with a 150,000-token clinical note using GPT-4o (128K context window). What happens?",
    options: [
      "The model processes it but slowly",
      "The API returns an error — the input exceeds the context window",
      "The model truncates the note automatically",
      "The model summarizes the note first, then processes it"
    ],
    correct: 1,
    explanation: "If your input exceeds the model's context window, the API returns an error. You must check token counts BEFORE sending. This is why tiktoken is essential — you need to know if your clinical note fits before making the API call."
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
          {score >= 4 ? "Excellent! You're ready to build clinical API pipelines." : score >= 3 ? "Good foundation — review token counting and prompting techniques." : "Review the lesson material before moving on."}
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
    title: "Clinical Note Classification",
    description: "A nurse uploads a clinical note and needs it classified as: Discharge Summary, Progress Note, Pathology Report, or Consultation Note.",
    correctModel: "gpt-4o-mini",
    correctTemp: "0.0",
    correctSystemPrompt: "classification",
    hint: "Classification is a simple task — you don't need the most expensive model. You want deterministic output."
  },
  {
    title: "Oncology Differential Diagnosis",
    description: "An oncologist pastes a complex case with imaging, labs, and history. They want a differential diagnosis with reasoning.",
    correctModel: "gpt-4o",
    correctTemp: "0.3",
    correctSystemPrompt: "reasoning",
    hint: "Complex reasoning needs the most capable model. A small amount of temperature allows nuanced reasoning without randomness."
  },
  {
    title: "Batch Processing 10,000 Lab Results",
    description: "Process 10,000 lab result strings and flag each as normal/abnormal. Budget is limited.",
    correctModel: "gpt-4o-mini",
    correctTemp: "0.0",
    correctSystemPrompt: "classification",
    hint: "High volume + simple task + budget constraints = smallest capable model with zero temperature for consistency."
  },
  {
    title: "Patient Education Letter",
    description: "Generate a warm, personalized letter explaining a treatment plan to a patient with breast cancer, in simple language.",
    correctModel: "gpt-4o",
    correctTemp: "0.7",
    correctSystemPrompt: "creative",
    hint: "Patient-facing content benefits from natural language variety. Higher temperature produces more natural, less robotic text."
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selections, setSelections] = useState({ model: '', temp: '', prompt: '' });
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[currentScenario];

  const checkAnswer = () => {
    let points = 0;
    if (selections.model === s.correctModel) points++;
    if (selections.temp === s.correctTemp) points++;
    if (selections.prompt === s.correctSystemPrompt) points++;
    setScores([...scores, points]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentScenario(c => c + 1);
    setSelections({ model: '', temp: '', prompt: '' });
    setSubmitted(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = scores.length * 3;

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>API Configuration Practice Complete!</h2>
        <p style={{ fontSize: 20 }}>You scored {totalScore} / {scenarios.length * 3} configuration points</p>
        <div style={{ background: totalScore >= 10 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {totalScore >= 10 ? "Excellent clinical API intuition!" : "Review when to use different models and temperature settings for clinical tasks."}
        </div>
        <button onClick={() => { setCurrentScenario(0); setScores([]); setSubmitted(false); setSelections({ model: '', temp: '', prompt: '' }); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
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
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Model:</label>
        <select value={selections.model} onChange={e => setSelections({ ...selections, model: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select model...</option>
          <option value="gpt-4o">gpt-4o (most capable, higher cost)</option>
          <option value="gpt-4o-mini">gpt-4o-mini (fast, cost-effective)</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Temperature:</label>
        <select value={selections.temp} onChange={e => setSelections({ ...selections, temp: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select temperature...</option>
          <option value="0.0">0.0 (deterministic)</option>
          <option value="0.3">0.3 (slightly creative)</option>
          <option value="0.7">0.7 (balanced creativity)</option>
          <option value="1.5">1.5 (highly random)</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>System Prompt Type:</label>
        <select value={selections.prompt} onChange={e => setSelections({ ...selections, prompt: e.target.value })} disabled={submitted} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Select prompt approach...</option>
          <option value="classification">Classification (strict categories, no reasoning)</option>
          <option value="reasoning">Reasoning (step-by-step analysis required)</option>
          <option value="creative">Creative (natural, varied language)</option>
        </select>
      </div>

      {!submitted && <button onClick={checkAnswer} disabled={!selections.model || !selections.temp || !selections.prompt} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: (!selections.model || !selections.temp || !selections.prompt) ? 0.5 : 1 }}>Submit Configuration</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {scores[scores.length - 1]} / 3</strong></p>
          <p>{selections.model === s.correctModel ? '✅' : '❌'} Model: best choice is <strong>{s.correctModel}</strong></p>
          <p>{selections.temp === s.correctTemp ? '✅' : '❌'} Temperature: best choice is <strong>{s.correctTemp}</strong></p>
          <p>{selections.prompt === s.correctSystemPrompt ? '✅' : '❌'} System prompt: best choice is <strong>{s.correctSystemPrompt}</strong></p>
          <p style={{ marginTop: 8, fontStyle: 'italic' }}>{s.hint}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 2 OF 6: Structured Output & Clinical Data Extraction

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Now that you can talk to GPT from Python, let's make it return structured, usable data — not just free text. In clinical AI, free text is the problem, not the solution. We need JSON. We need fields we can store in a database, validate, and pipe into downstream systems. Today you'll extract diagnoses, medications, and staging from oncology notes — and the model will give you clean, typed, validated JSON every single time."

---

### NotebookLM Summary

Clinical AI pipelines need structured data, not free text. When an LLM extracts a cancer diagnosis from a discharge summary, the result must be a precise data structure — a JSON object with fields like `diagnosis`, `stage`, `medications` — not a paragraph of text that another program has to parse. This is where structured output changes everything.

The OpenAI API offers two approaches to structured output. The simpler one is JSON mode: you set `response_format={"type": "json_object"}` and instruct the model to return JSON in your prompt. This guarantees valid JSON but does not enforce a specific schema — the model might return unexpected fields or miss required ones.

The more powerful approach is Pydantic structured outputs, introduced in the newer OpenAI SDK. You define a Pydantic model — a Python class that specifies exactly which fields you want, their types, whether they are required or optional, and any constraints. For example, a `ClinicalExtraction` model might have `diagnosis: str`, `stage: Optional[str]`, `medications: List[MedicationDetail]`, where `MedicationDetail` is a nested model with `name`, `dose`, and `frequency`. You then call `client.beta.chat.completions.parse(response_format=ClinicalExtraction)` and the API guarantees the response matches your schema exactly.

This approach is transformative for clinical data extraction. Consider ten oncology notes — some discharge summaries, some pathology reports, some consultation notes — each written in a different style, with different abbreviations, varying levels of detail. With a well-defined Pydantic model and few-shot examples, you can extract consistent, validated data from all of them. The model handles the messy text; your schema enforces the clean output.

Few-shot extraction is particularly effective here: by including 2–3 examples of notes paired with their expected JSON output in the prompt, you teach the model your exact extraction style. This is how production clinical extraction pipelines work — the prompt is the specification, the Pydantic model is the contract, and the LLM is the engine.

Edge cases matter in clinical text. Notes may be missing staging information, use non-standard abbreviations, or list medications without doses. Your Pydantic model should use `Optional` fields where data might be absent, and your prompt should instruct the model to return `null` rather than guessing.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You need to extract 5 specific fields from oncology discharge summaries into a database. Which approach guarantees your output always has exactly those fields?",
    options: [
      "JSON mode with response_format={'type': 'json_object'}",
      "Pydantic structured output with response_format=YourModel",
      "Ask the model nicely to return JSON in the system prompt",
      "Parse the free text response with regex"
    ],
    correct: 1,
    explanation: "Pydantic structured outputs guarantee the response matches your exact schema — specific fields, types, and constraints. JSON mode only guarantees valid JSON but not your specific structure."
  },
  {
    question: "Your Pydantic model has: stage: Optional[str] = None. A clinical note says 'staging workup pending.' What should the extraction return for stage?",
    options: [
      "stage: 'pending'",
      "stage: 'unknown'",
      "stage: null (None)",
      "stage: 'staging workup pending'"
    ],
    correct: 2,
    explanation: "When staging is not yet determined, the correct extraction is null/None — not a guess or the raw text. Optional fields exist precisely for this case. Your prompt should instruct: 'return null if the information is not definitively stated.'"
  },
  {
    question: "You provide 3 example note→JSON pairs in your prompt before the actual note. What prompting technique is this?",
    options: [
      "Zero-shot extraction",
      "Chain-of-thought extraction",
      "Few-shot extraction",
      "Fine-tuned extraction"
    ],
    correct: 2,
    explanation: "Including example input-output pairs is few-shot prompting. For clinical extraction, 2-3 examples dramatically improve consistency because the model learns your exact extraction style and field mapping."
  },
  {
    question: "A pathology report contains: 'ER+/PR+/HER2-negative, Ki-67 at 15%'. Which Pydantic field design best captures this?",
    options: [
      "biomarkers: str (store as one string)",
      "biomarkers: List[str] (store as list of strings)",
      "biomarkers: List[Biomarker] where Biomarker has name: str, status: str, value: Optional[float]",
      "er: bool, pr: bool, her2: bool, ki67: float"
    ],
    correct: 2,
    explanation: "A nested Biomarker model is most flexible and structured. It captures each marker's name, status (positive/negative), and optional numeric value (Ki-67). This handles varying numbers of biomarkers across different cancer types."
  },
  {
    question: "You run extraction on 100 notes. Note #47 has medications listed as 'current meds: see MAR.' Your model has medications: List[Medication]. What should happen?",
    options: [
      "The model should invent likely medications for this cancer type",
      "The extraction should fail with an error",
      "The model should return an empty list [] for medications",
      "The model should return [{'name': 'see MAR', 'dose': null}]"
    ],
    correct: 2,
    explanation: "When medication details are not in the note (just a reference to another system), the correct extraction is an empty list. The model should never hallucinate medications. Your prompt should say: 'Only extract information explicitly stated in the text.'"
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
          {score >= 4 ? "Excellent! You understand structured clinical data extraction." : score >= 3 ? "Good grasp — review Optional fields and edge case handling." : "Review Pydantic models and few-shot extraction before moving on."}
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

const sampleNote = `DISCHARGE SUMMARY - KHCC Ward 4C
Patient: Fatima Al-Hassan, MRN: 29384756102938
Diagnosis: Invasive ductal carcinoma, left breast, T2N1M0, Stage IIB
ER+/PR+/HER2-negative, Ki-67: 22%

Treatment: Completed 4 cycles AC (doxorubicin 60mg/m2 + cyclophosphamide 600mg/m2) followed by 12 weeks paclitaxel 80mg/m2 weekly. Tolerated well with Grade 1 neuropathy.
Surgery: Left modified radical mastectomy (Dr. Ahmad Khalil, 2026-02-15)
Current medications: Tamoxifen 20mg daily, Ondansetron 8mg PRN nausea, Gabapentin 300mg TID for neuropathy
Allergies: Sulfa drugs, Penicillin

Follow-up: Oncology clinic in 3 weeks (2026-03-20). Repeat imaging in 3 months.
Condition at discharge: Stable, ambulating independently.`;

const correctFields = {
  patient_name: "Fatima Al-Hassan",
  mrn: "29384756102938",
  diagnosis: "Invasive ductal carcinoma, left breast",
  stage: "T2N1M0 / Stage IIB",
  medications: ["Tamoxifen 20mg daily", "Ondansetron 8mg PRN", "Gabapentin 300mg TID"],
  allergies: ["Sulfa drugs", "Penicillin"],
  procedures: ["Left modified radical mastectomy"],
  follow_up_date: "2026-03-20"
};

const fields = [
  { key: 'patient_name', label: 'Patient Name', type: 'text' },
  { key: 'mrn', label: 'MRN', type: 'text' },
  { key: 'diagnosis', label: 'Primary Diagnosis', type: 'text' },
  { key: 'stage', label: 'Stage (TNM / Clinical)', type: 'text' },
  { key: 'medications', label: 'Medications (comma-separated)', type: 'text' },
  { key: 'allergies', label: 'Allergies (comma-separated)', type: 'text' },
  { key: 'procedures', label: 'Procedures (comma-separated)', type: 'text' },
  { key: 'follow_up_date', label: 'Follow-up Date', type: 'text' },
];

export default function Practice() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const handleChange = (key, value) => setAnswers({ ...answers, [key]: value });

  const checkAnswers = () => setChecked(true);

  const getScore = () => {
    let correct = 0;
    if ((answers.patient_name || '').toLowerCase().includes('fatima')) correct++;
    if ((answers.mrn || '').includes('29384756102938')) correct++;
    if ((answers.diagnosis || '').toLowerCase().includes('ductal carcinoma')) correct++;
    if ((answers.stage || '').includes('T2N1') || (answers.stage || '').includes('IIB')) correct++;
    if ((answers.medications || '').toLowerCase().includes('tamoxifen')) correct++;
    if ((answers.allergies || '').toLowerCase().includes('sulfa') || (answers.allergies || '').toLowerCase().includes('penicillin')) correct++;
    if ((answers.procedures || '').toLowerCase().includes('mastectomy')) correct++;
    if ((answers.follow_up_date || '').includes('2026-03-20') || (answers.follow_up_date || '').includes('3 weeks')) correct++;
    return correct;
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Manual Clinical Data Extraction</h2>
      <p style={{ color: '#666', marginBottom: 12 }}>Read the discharge summary below and extract structured data into the fields. This is exactly what you'll automate with Pydantic in the lab!</p>

      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 20, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, maxHeight: 300, overflow: 'auto', border: '1px solid #dee2e6' }}>
        {sampleNote}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ fontWeight: 'bold', fontSize: 14, display: 'block', marginBottom: 2 }}>{f.label}:</label>
            <input
              type="text"
              value={answers[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
              disabled={checked}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }}
              placeholder={`Extract ${f.label.toLowerCase()} from the note...`}
            />
            {checked && (
              <div style={{ fontSize: 13, marginTop: 4, color: '#198754' }}>
                Expected: <strong>{Array.isArray(correctFields[f.key]) ? correctFields[f.key].join(', ') : correctFields[f.key]}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {!checked && (
        <button onClick={checkAnswers} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16 }}>
          Check My Extraction
        </button>
      )}

      {checked && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / 8 fields correctly extracted</h3>
          <p>Now imagine doing this for 500 notes manually. In the lab, you'll build a Pydantic model that does this automatically using GPT — every note, every time, in seconds.</p>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 3 OF 6: Conversation Memory & Tool Calling

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"So far, every API call we've made has been one-shot — the model has no memory of what you asked before. But think about a clinical assistant: a doctor asks 'What were this patient's vitals yesterday?', then follows up with 'And how does that compare to last week?' The 'that' only makes sense if the system remembers the previous exchange. Today we build conversation memory. And then we go further — we give the model tools, so it can actually look up patient data, check reference ranges, and take actions."

---

### NotebookLM Summary

Large language models are stateless — each API call starts fresh with no memory of previous interactions. This is fundamentally different from how clinicians interact: a doctor expects to ask follow-up questions, refer to previous answers, and build on context. To create a useful clinical assistant, you need to build memory yourself.

The solution is simple but powerful: maintain a Python list of messages and send the entire conversation history with every API call. When the user asks a question, you append their message to the list. When the model responds, you append its response too. The next API call includes all previous messages, giving the model full context of the conversation. This is how ChatGPT works behind the scenes — it is not magic, it is a growing list of messages.

The challenge is context window limits. As conversations grow, the message list accumulates tokens. A long clinical discussion might exceed the model's context window. Strategies include truncating old messages, summarizing the conversation periodically, or using a sliding window that keeps only the most recent exchanges. Token counting with tiktoken helps you monitor usage and decide when to trim.

Tool calling is the other transformative capability. Instead of just generating text, the model can request to call functions you define. You describe available tools — their names, parameters, and descriptions — in the API call. When the model determines it needs external data, it returns a `tool_calls` response instead of text. Your code then executes the requested function with the provided arguments, sends the result back, and the model formulates a natural language answer.

For clinical applications, this is powerful. You can define tools like `lookup_vitals(mrn)` that queries a patient database, `check_abnormal_range(vital_type, value)` that checks clinical reference ranges, or `get_patient_summary(mrn)` that returns a structured overview. The model decides when to use each tool based on the user's question — "What was patient 1889's latest blood pressure?" triggers `lookup_vitals`, while "Is a pulse of 120 concerning?" triggers `check_abnormal_range`.

The complete flow is: user asks → model decides which tool to call → your code executes the tool → result sent back to model → model generates a natural language answer. This pattern is the foundation of clinical AI agents you will build in Session 5 with LangChain.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const steps = [
  {
    title: "Step 1: Define the Tool",
    description: "A nurse wants to ask: 'What is the latest temperature for patient 18887304731609?' First, you need to define a tool the model can use. Which tool definition is correct?",
    options: [
      {
        label: "A",
        code: `tools = [{\n  "type": "function",\n  "function": {\n    "name": "lookup_vitals",\n    "description": "Look up recent vitals for a patient by MRN",\n    "parameters": {\n      "type": "object",\n      "properties": {\n        "mrn": {"type": "string", "description": "Patient MRN"},\n        "vital_type": {"type": "string", "description": "Type of vital sign"}\n      },\n      "required": ["mrn"]\n    }\n  }\n}]`,
        correct: true
      },
      {
        label: "B",
        code: `tools = [{\n  "name": "lookup_vitals",\n  "args": ["mrn", "vital_type"],\n  "returns": "dict"\n}]`,
        correct: false
      },
      {
        label: "C",
        code: `def lookup_vitals(mrn, vital_type):\n  # OpenAI will call this automatically\n  return db.query(mrn)`,
        correct: false
      }
    ],
    explanation: "OpenAI tool definitions use JSON Schema format with type, function name, description, and parameters. The model never calls your function directly — it returns the arguments for YOU to execute."
  },
  {
    title: "Step 2: Handle the Model's Response",
    description: "The model responds with a tool_calls request. What does your code do next?",
    options: [
      { label: "Extract the function name and arguments, execute the function locally, then send results back", correct: true },
      { label: "Forward the tool_calls to OpenAI's execution server", correct: false },
      { label: "Print the tool_calls and ask the user to provide the data manually", correct: false }
    ],
    explanation: "YOUR code executes the function. The model only specifies WHAT to call and WITH WHAT arguments. You run the actual database query and send results back as a tool message."
  },
  {
    title: "Step 3: Send Results Back",
    description: "Your lookup_vitals function returns: {'vital_type': 'TEMPERATURE', 'rate': '101.2', 'datetime': '2026-01-16T14:00:00'}. How do you send this back?",
    options: [
      {
        label: "A",
        code: `messages.append({\n  "role": "tool",\n  "tool_call_id": tool_call.id,\n  "content": json.dumps(result)\n})`,
        correct: true
      },
      {
        label: "B",
        code: `messages.append({\n  "role": "user",\n  "content": f"The result is: {result}"\n})`,
        correct: false
      },
      {
        label: "C",
        code: `messages.append({\n  "role": "system",\n  "content": f"Tool output: {result}"\n})`,
        correct: false
      }
    ],
    explanation: "Tool results must use role='tool' with the matching tool_call_id. This tells the model which tool call the result belongs to. Using 'user' or 'system' would confuse the conversation structure."
  },
  {
    title: "Step 4: Final Answer",
    description: "After receiving the tool result, the model generates: 'The patient's latest temperature is 101.2°F, recorded at 2:00 PM on January 16th. This is above the normal range of 97.8-99.1°F and may indicate fever.' What made this possible?",
    options: [
      { label: "The complete loop: question → tool call → execution → result → natural language answer", correct: true },
      { label: "The model accessed the database directly through the API", correct: false },
      { label: "The model memorized the patient's vitals from training data", correct: false }
    ],
    explanation: "The model combined the structured tool result with its clinical knowledge to produce a helpful, contextualized answer. It didn't access any database — your code did that. The model just formulated the answer."
  }
];

export default function Practice() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const step = steps[currentStep];

  const handleSubmit = () => {
    setSubmitted(true);
    if (step.options[selected]?.correct) setScore(s => s + 1);
  };

  const next = () => {
    setCurrentStep(c => c + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (currentStep >= steps.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Tool Calling Walkthrough Complete!</h2>
        <p style={{ fontSize: 20 }}>You got {score} / {steps.length} steps correct</p>
        <div style={{ background: '#d4edda', padding: 16, borderRadius: 8 }}>
          You've traced the complete tool calling flow — from tool definition to final answer. In the lab, you'll implement this in real code with a clinical vitals database.
        </div>
        <button onClick={() => { setCurrentStep(0); setScore(0); setSelected(null); setSubmitted(false); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Restart</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentStep + 1) / steps.length) * 100}%` }} />
      </div>
      <h3>{step.title}</h3>
      <p style={{ lineHeight: 1.6, marginBottom: 16 }}>{step.description}</p>

      {step.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(i)} style={{
          padding: 12, margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : i === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt.correct ? '#d4edda' : i === selected && !opt.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>
          {opt.code ? (
            <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}><strong>{opt.label}:</strong>{'\n'}{opt.code}</pre>
          ) : (
            <span>{opt.label}</span>
          )}
        </div>
      ))}

      {!submitted && selected !== null && (
        <button onClick={handleSubmit} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answer</button>
      )}

      {submitted && (
        <>
          <div style={{ marginTop: 12, padding: 12, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
            {step.explanation}
          </div>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentStep + 1 < steps.length ? 'Next Step' : 'See Results'}</button>
        </>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 6: From CSV to SQL — Clinical Data Foundations

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"We've been working with LLMs — now let's work with DATA. At KHCC, patient vitals flow from VistA into CSV extracts every day. These files have thousands of rows — blood pressures, temperatures, pulse readings from every ward. And we have patient demographics too — age, sex, nationality, province. Today you'll load both datasets, convert them to SQL, and write queries that combine them using JOINs. Want to find all female patients with fever? Or the average pulse for patients over 60? That takes a JOIN. This is the foundation for Lesson 5, where we let the LLM write SQL for us."

---

### NotebookLM Summary

Clinical data at KHCC flows from the VistA electronic health record system into structured CSV extracts. Two key datasets anchor this lesson. The vista_vitals dataset contains 2000 rows of patient vital signs — blood pressure, pulse, pulse oximetry, respiration rate, and temperature — recorded across multiple hospital wards. The vista_patients dataset contains 79 patient demographic records — date of birth, sex, nationality, province, marital status, and patient type — with encrypted names and national IDs. The MRN column links the two tables: each patient in vista_patients has multiple vital sign readings in vista_vitals.

Working with this data starts with pandas, which you learned in Session 2. Loading CSVs with `pd.read_csv()` gives you DataFrames you can explore: `df.shape` tells you how many rows and columns, `df.describe()` shows statistical summaries, `df['VITAL_TYPE'].value_counts()` reveals the distribution of vital types, and `df['SEX'].value_counts()` shows the gender breakdown of your patient population.

But pandas alone is not enough for production clinical systems. SQL (Structured Query Language) is the standard for querying databases, and clinical data warehouses at KHCC and every major hospital use SQL-based systems. SQLite is a lightweight database engine that runs directly in Python with no server setup — perfect for learning and prototyping.

Converting DataFrames to SQL is one line each: `df.to_sql('vista_vitals', conn)` and `df_patients.to_sql('vista_patients', conn)`. From there, you write SQL queries. Single-table queries filter and aggregate: `SELECT * FROM vista_vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND CAST(RATE AS FLOAT) > 100.4` finds all febrile readings. But the real power comes from JOIN queries that combine both tables. `SELECT DISTINCT p.MRN, p.SEX, p.DOB FROM vista_vitals v JOIN vista_patients p ON v.MRN = p.MRN WHERE v.VITAL_TYPE = 'TEMPERATURE' AND CAST(v.RATE AS FLOAT) > 100.4 AND p.SEX = 'FEMALE'` finds all female patients with fever — a question that requires data from both tables.

SQL JOINs are essential for clinical analytics because patient data is always spread across multiple tables. Questions like "What is the average pulse for Jordanian patients over 60?" or "How many patients from Amman had abnormal blood pressure?" require combining demographics with vitals. Understanding JOINs is critical because in the next lesson, you will teach an LLM to write these multi-table queries for you.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You load vista_vitals.csv and run df.shape. It returns (2000, 8). What does this tell you?",
    options: [
      "The file is 2000 KB with 8 sheets",
      "There are 2000 rows and 8 columns in the dataset",
      "There are 8 patients with 2000 readings each",
      "The data spans 2000 days across 8 wards"
    ],
    correct: 1,
    explanation: "df.shape returns (rows, columns). 2000 rows means 2000 individual vital sign readings, and 8 columns are: NUMBER, MRN, DATE_TIME_VITALS_TAKEN, VITAL_TYPE, DATE_TIME_VITALS_ENTERED, HOSPITAL_LOCATION, ENTERED_BY, RATE."
  },
  {
    question: "You want to find all patients with fever (temperature > 100.4°F) in the ICU. Which SQL query is correct?",
    options: [
      "SELECT * FROM vista_vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND CAST(RATE AS FLOAT) > 100.4 AND HOSPITAL_LOCATION LIKE '%ICU%'",
      "SELECT * FROM vista_vitals WHERE RATE > 100.4 AND HOSPITAL_LOCATION = 'ICU'",
      "FIND patients WHERE temperature > 100.4 IN ICU",
      "SELECT TEMPERATURE FROM vista_vitals WHERE > 100.4"
    ],
    correct: 0,
    explanation: "You need three conditions: filter by VITAL_TYPE (since RATE means different things for different vitals), cast RATE to a number for comparison, and use LIKE '%ICU%' because the location name includes more than just 'ICU'."
  },
  {
    question: "df.to_sql('vista_vitals', conn, if_exists='replace') — what does if_exists='replace' do?",
    options: [
      "Replaces any rows with matching MRNs",
      "Drops the existing table and creates a new one with the DataFrame data",
      "Appends the DataFrame to the existing table",
      "Throws an error if the table already exists"
    ],
    correct: 1,
    explanation: "if_exists='replace' drops the existing table and creates a fresh one. Use 'append' to add rows to an existing table, or 'fail' (default) to raise an error if the table exists."
  },
  {
    question: "You run: SELECT HOSPITAL_LOCATION, COUNT(*) as reading_count FROM vista_vitals GROUP BY HOSPITAL_LOCATION ORDER BY reading_count DESC. What does this return?",
    options: [
      "All vital readings sorted by hospital location",
      "The total number of readings in the entire dataset",
      "A list of wards ranked by how many vital readings they have, highest first",
      "The average vital sign value per ward"
    ],
    correct: 2,
    explanation: "GROUP BY groups rows by ward, COUNT(*) counts readings per group, and ORDER BY DESC sorts from highest to lowest. This answers: 'Which ward records the most vital signs?'"
  },
  {
    question: "Blood pressure is stored as '120/80' in the RATE column. Why is this problematic for SQL analysis?",
    options: [
      "SQL can't store strings with slashes",
      "It's stored as text, so you can't directly compute averages or compare systolic/diastolic values numerically",
      "Blood pressure should be stored in a separate table",
      "The format is non-standard and should use a comma"
    ],
    correct: 1,
    explanation: "Blood pressure as '120/80' is a string — you can't AVG() it or compare systolic > 140. You'd need to split it into separate systolic and diastolic columns, or parse it in Python before analysis. This is a common real-world data cleaning challenge."
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
          {score >= 4 ? "Excellent! You're ready to query clinical data with SQL." : score >= 3 ? "Good grasp — review GROUP BY and data type handling." : "Review SQL basics and pandas-to-SQL conversion before the lab."}
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

const challenges = [
  {
    question: "Find all TEMPERATURE readings above 100.4°F (fever) from the vista_vitals table.",
    hint: "Remember: RATE is stored as text for temperatures. You need to filter by VITAL_TYPE first.",
    correctSQL: "SELECT * FROM vista_vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND CAST(RATE AS FLOAT) > 100.4",
    keywords: ["SELECT", "VITAL_TYPE", "TEMPERATURE", "RATE", "100.4"],
    minKeywords: 4
  },
  {
    question: "Count how many vital sign readings each ward (HOSPITAL_LOCATION) has, sorted from most to least.",
    hint: "Use GROUP BY to group by location, COUNT(*) to count, and ORDER BY DESC to sort.",
    correctSQL: "SELECT HOSPITAL_LOCATION, COUNT(*) as count FROM vista_vitals GROUP BY HOSPITAL_LOCATION ORDER BY count DESC",
    keywords: ["SELECT", "HOSPITAL_LOCATION", "COUNT", "GROUP BY", "ORDER BY"],
    minKeywords: 4
  },
  {
    question: "Find the number of unique patients (distinct MRNs) seen in the ICU.",
    hint: "Use COUNT(DISTINCT ...) and filter HOSPITAL_LOCATION with LIKE '%ICU%'.",
    correctSQL: "SELECT COUNT(DISTINCT MRN) FROM vista_vitals WHERE HOSPITAL_LOCATION LIKE '%ICU%'",
    keywords: ["SELECT", "COUNT", "DISTINCT", "MRN", "ICU"],
    minKeywords: 4
  },
  {
    question: "List all vitals for patient MRN '18887304731609' taken on January 16, 2026, ordered by time.",
    hint: "Filter by MRN and use DATE_TIME_VITALS_TAKEN for both filtering and sorting.",
    correctSQL: "SELECT * FROM vista_vitals WHERE MRN = '18887304731609' AND DATE_TIME_VITALS_TAKEN LIKE '2026-01-16%' ORDER BY DATE_TIME_VITALS_TAKEN",
    keywords: ["SELECT", "MRN", "18887304731609", "2026-01-16", "ORDER BY"],
    minKeywords: 3
  }
];

export default function Practice() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userSQL, setUserSQL] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const c = challenges[currentChallenge];

  const checkSQL = () => {
    const upper = userSQL.toUpperCase();
    const matchCount = c.keywords.filter(kw => upper.includes(kw.toUpperCase())).length;
    if (matchCount >= c.minKeywords) setScore(s => s + 1);
    setChecked(true);
  };

  const next = () => {
    setCurrentChallenge(cc => cc + 1);
    setUserSQL('');
    setChecked(false);
  };

  if (currentChallenge >= challenges.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>SQL Challenge Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {score} / {challenges.length}</p>
        <div style={{ background: score >= 3 ? '#d4edda' : '#fff3cd', padding: 16, borderRadius: 8 }}>
          {score >= 3 ? "Great SQL skills! Ready for text-to-SQL in Lesson 5." : "Review SQL syntax — you'll need it to verify LLM-generated queries."}
        </div>
        <button onClick={() => { setCurrentChallenge(0); setScore(0); setUserSQL(''); setChecked(false); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentChallenge + 1) / challenges.length) * 100}%` }} />
      </div>
      <h3>SQL Challenge {currentChallenge + 1} of {challenges.length}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{c.question}</p>
      <p style={{ color: '#666', fontSize: 14, fontStyle: 'italic' }}>Hint: {c.hint}</p>

      <textarea
        value={userSQL}
        onChange={e => setUserSQL(e.target.value)}
        disabled={checked}
        placeholder="Write your SQL query here..."
        style={{ width: '100%', minHeight: 80, padding: 12, fontFamily: 'monospace', fontSize: 14, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box', marginTop: 8 }}
      />

      {!checked && (
        <button onClick={checkSQL} disabled={!userSQL.trim()} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: !userSQL.trim() ? 0.5 : 1 }}>Check Query</button>
      )}

      {checked && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Example solution:</strong></p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 6, fontSize: 13, overflow: 'auto' }}>{c.correctSQL}</pre>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentChallenge + 1 < challenges.length ? 'Next Challenge' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 6: Text-to-SQL — Talk to Your Data

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"This is where everything comes together. You know the OpenAI API. You know SQL. Now imagine a nurse or oncologist asking a question in plain English — 'How many patients had fever in the ICU this week?' — and getting an instant answer from the database. No SQL knowledge required. That's text-to-SQL, and that's what we're building right now. This is the closest thing to magic in clinical informatics."

---

### NotebookLM Summary

Text-to-SQL is the capability that transforms how clinicians interact with data. Instead of writing SQL queries manually — which requires training most clinical staff do not have — a text-to-SQL system lets anyone ask questions in natural language and receive answers from the database.

The pipeline has four steps. First, you describe your database schema to the LLM: table names, column names, data types, and sample values. The model needs to know what data exists to generate valid queries. For vista_vitals, the schema description includes columns like MRN, VITAL_TYPE (with possible values BLOOD PRESSURE, PULSE, PULSE OXIMETRY, RESPIRATION, TEMPERATURE), HOSPITAL_LOCATION (with ward names), and RATE.

Second, the user asks a question in plain English: "How many patients had fever in the ICU this week?" The LLM generates a SQL query: `SELECT COUNT(DISTINCT MRN) FROM vista_vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND CAST(RATE AS FLOAT) > 100.4 AND HOSPITAL_LOCATION LIKE '%ICU%' AND DATE_TIME_VITALS_TAKEN >= '2026-01-10'`.

Third, your code executes the generated SQL against the database and captures the results. This is where safety matters — you should use read-only database connections and validate that the generated query is a SELECT statement, not a DROP TABLE or DELETE.

Fourth, you send the query results back to the LLM and ask it to formulate a natural language answer: "There were 12 patients with fever in the ICU this week." This final step transforms raw query results into a human-readable response that a clinician can immediately understand.

Few-shot examples dramatically improve SQL generation accuracy. By including 3–5 example question-SQL pairs in the system prompt, you teach the model your specific schema conventions, column names, and query patterns. Without examples, the model might use wrong column names or incorrect SQL syntax for your database.

Building a conversational interface means combining text-to-SQL with the memory pattern from Lesson 3. The user can ask follow-up questions — "Which ward had the most?" — and the system maintains context from the previous query. You can also use tool calling from Lesson 3 to make the architecture cleaner: define a `run_sql_query` tool that the model can call when it needs database access.

Common failure modes include incorrect column names, wrong data type handling (especially blood pressure as a string), and overly complex queries that could be simplified. Always show the generated SQL to the user for verification — transparency builds trust in clinical AI systems.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "A nurse asks: 'Which ward had the most vital sign readings?' Your text-to-SQL system must first tell the LLM about the database. What is this step called?",
    options: [
      "Fine-tuning the model on your database",
      "Providing the database schema in the system prompt",
      "Connecting the LLM directly to the database",
      "Training a custom SQL model"
    ],
    correct: 1,
    explanation: "You describe the schema (table names, columns, data types, sample values) in the system prompt. The model uses this description to generate valid SQL — it never connects to the database directly."
  },
  {
    question: "The LLM generates: DELETE FROM vista_vitals WHERE MRN = '18887304731609'. Your system should:",
    options: [
      "Execute it — the model must have a good reason",
      "Reject it — only allow SELECT queries for read-only safety",
      "Ask the user if they want to delete the data",
      "Modify it to a SELECT query automatically"
    ],
    correct: 1,
    explanation: "A text-to-SQL system for clinical data should ONLY allow SELECT queries. Never execute DELETE, UPDATE, DROP, or INSERT generated by an LLM. Use read-only database connections as an additional safeguard."
  },
  {
    question: "Your system prompt includes 3 example question→SQL pairs. The nurse asks a similar question. Why do few-shot examples improve accuracy?",
    options: [
      "They fine-tune the model's weights for your database",
      "They teach the model your exact column names, data patterns, and query style",
      "They make the model faster at generating SQL",
      "They are required by the OpenAI API for SQL generation"
    ],
    correct: 1,
    explanation: "Few-shot examples show the model your specific conventions — that VITAL_TYPE uses uppercase values, that RATE is a string for blood pressure, that location names have prefixes like 'KHCC-'. Without examples, the model guesses these details."
  },
  {
    question: "The LLM generates a query that returns: [(12,)]. What should happen next?",
    options: [
      "Show the raw tuple to the user",
      "Send the result back to the LLM to formulate a natural language answer like 'There are 12 patients matching your criteria'",
      "Store the result in a new database table",
      "Nothing — the query execution is the final step"
    ],
    correct: 1,
    explanation: "The final step is converting raw results to a human-readable answer. The LLM takes the SQL results and generates a clear response the clinician can understand — this is what makes text-to-SQL user-friendly."
  },
  {
    question: "A doctor asks: 'Show me the trends for that patient' (referring to a patient from the previous question). What do you need for this to work?",
    options: [
      "A more powerful model that can remember previous questions",
      "Conversation memory — the messages list containing the previous exchange so the model has context",
      "A separate database that stores previous questions",
      "The doctor must repeat the patient's MRN every time"
    ],
    correct: 1,
    explanation: "This is why Lesson 3's conversation memory pattern matters! By maintaining the messages list, follow-up questions like 'that patient' resolve correctly because the model sees the full conversation history."
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
          {score >= 4 ? "Excellent! You understand the full text-to-SQL pipeline." : score >= 3 ? "Good foundation — review safety patterns and the few-shot approach." : "Review the text-to-SQL pipeline steps before the lab."}
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

const pipelineSteps = [
  { id: 'schema', label: 'Describe database schema to LLM', order: 1 },
  { id: 'question', label: 'User asks question in plain English', order: 2 },
  { id: 'generate', label: 'LLM generates SQL query', order: 3 },
  { id: 'validate', label: 'Validate SQL is a safe SELECT query', order: 4 },
  { id: 'execute', label: 'Execute SQL against the database', order: 5 },
  { id: 'format', label: 'Send results to LLM for natural language answer', order: 6 },
];

const clinicalQuestions = [
  {
    question: "How many patients had fever in the ICU last week?",
    badSQL: "SELECT COUNT(*) FROM patients WHERE fever = true AND location = 'ICU'",
    goodSQL: "SELECT COUNT(DISTINCT MRN) FROM vista_vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND CAST(RATE AS FLOAT) > 100.4 AND HOSPITAL_LOCATION LIKE '%ICU%' AND DATE_TIME_VITALS_TAKEN >= '2026-01-09'",
    issues: ["Wrong table name (patients vs vista_vitals)", "Wrong column names (fever, location)", "Missing VITAL_TYPE filter", "Missing DISTINCT for unique patients"],
    whyBad: "The model doesn't know your schema. Without few-shot examples or schema description, it guesses generic column names."
  },
  {
    question: "What was the average pulse rate in ward 4C yesterday?",
    badSQL: "SELECT AVG(pulse_rate) FROM vitals WHERE ward = '4C' AND date = 'yesterday'",
    goodSQL: "SELECT AVG(CAST(RATE AS FLOAT)) FROM vista_vitals WHERE VITAL_TYPE = 'PULSE' AND HOSPITAL_LOCATION LIKE '%4C%' AND DATE_TIME_VITALS_TAKEN LIKE '2026-01-15%'",
    issues: ["Wrong column name (pulse_rate vs RATE)", "No VITAL_TYPE filter", "'yesterday' is not valid SQL — needs actual date", "Missing CAST for numeric comparison"],
    whyBad: "Common LLM mistakes: using relative dates, inventing column names, forgetting that RATE stores all vital types."
  },
  {
    question: "Show me all abnormal blood pressure readings this month",
    badSQL: "SELECT * FROM vista_vitals WHERE blood_pressure > 140 AND date > '2026-01-01'",
    goodSQL: "SELECT * FROM vista_vitals WHERE VITAL_TYPE = 'BLOOD PRESSURE' AND (CAST(SUBSTR(RATE, 1, INSTR(RATE, '/') - 1) AS INTEGER) > 140 OR CAST(SUBSTR(RATE, 1, INSTR(RATE, '/') - 1) AS INTEGER) < 90) AND DATE_TIME_VITALS_TAKEN >= '2026-01-01'",
    issues: ["BP is stored as '120/80' string — can't compare directly", "No VITAL_TYPE filter", "Wrong column name", "Doesn't handle both high and low BP"],
    whyBad: "Blood pressure as a compound string is the hardest data type challenge. The model needs explicit examples showing how BP is stored and parsed."
  }
];

export default function Practice() {
  const [phase, setPhase] = useState('pipeline');
  const [dragOrder, setDragOrder] = useState([]);
  const [available, setAvailable] = useState(() => [...pipelineSteps].sort(() => Math.random() - 0.5));
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (phase === 'pipeline') {
    const isCorrect = dragOrder.length === pipelineSteps.length && dragOrder.every((s, i) => s.order === i + 1);

    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2>Part 1: Order the Text-to-SQL Pipeline</h2>
        <p>Click the steps in the correct order to build the pipeline:</p>

        <div style={{ minHeight: 50, marginBottom: 16 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Your pipeline order:</p>
          {dragOrder.map((s, i) => (
            <div key={s.id} style={{ padding: '8px 12px', margin: 4, background: '#e3f2fd', borderRadius: 6, display: 'inline-block', cursor: 'pointer' }} onClick={() => {
              setDragOrder(dragOrder.filter(x => x.id !== s.id));
              setAvailable([...available, s]);
            }}>
              {i + 1}. {s.label} ✕
            </div>
          ))}
          {dragOrder.length === 0 && <span style={{ color: '#999' }}>Click steps below to add them...</span>}
        </div>

        <div>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Available steps:</p>
          {available.map(s => (
            <div key={s.id} onClick={() => {
              setDragOrder([...dragOrder, s]);
              setAvailable(available.filter(x => x.id !== s.id));
            }} style={{ padding: '10px 14px', margin: 6, background: '#f8f9fa', borderRadius: 6, cursor: 'pointer', border: '1px solid #dee2e6', display: 'inline-block' }}>
              {s.label}
            </div>
          ))}
        </div>

        {dragOrder.length === pipelineSteps.length && (
          <div style={{ marginTop: 16, padding: 16, background: isCorrect ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
            {isCorrect ? (
              <>
                <p><strong>Correct!</strong> Schema → Question → Generate SQL → Validate → Execute → Format Answer</p>
                <button onClick={() => setPhase('debug')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Continue to Part 2: Debug Bad SQL</button>
              </>
            ) : (
              <p><strong>Not quite.</strong> Think about what needs to happen before the LLM can generate SQL, and what happens after execution. Click steps to remove and reorder.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  const q = clinicalQuestions[currentQ];

  if (currentQ >= clinicalQuestions.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Practice Complete!</h2>
        <p>You've seen the full text-to-SQL pipeline and common LLM SQL mistakes. In the lab, you'll build this system for real with the vista_vitals database.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Part 2: Debug LLM-Generated SQL ({currentQ + 1}/{clinicalQuestions.length})</h2>
      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8 }}><strong>Clinical question:</strong> "{q.question}"</p>

      <div style={{ marginTop: 16 }}>
        <p><strong>LLM generated this SQL (without schema description):</strong></p>
        <pre style={{ background: '#fee', padding: 12, borderRadius: 6, fontSize: 13, border: '1px solid #fcc', overflow: 'auto' }}>{q.badSQL}</pre>
      </div>

      {!showAnswer ? (
        <button onClick={() => setShowAnswer(true)} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Show Issues & Correct SQL</button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <p><strong>Issues found:</strong></p>
          <ul>{q.issues.map((issue, i) => <li key={i} style={{ color: '#dc3545', marginBottom: 4 }}>{issue}</li>)}</ul>
          <p style={{ fontStyle: 'italic', color: '#666' }}>{q.whyBad}</p>

          <p style={{ marginTop: 12 }}><strong>Correct SQL (with proper schema):</strong></p>
          <pre style={{ background: '#efe', padding: 12, borderRadius: 6, fontSize: 13, border: '1px solid #cec', overflow: 'auto' }}>{q.goodSQL}</pre>

          <button onClick={() => { setCurrentQ(c => c + 1); setShowAnswer(false); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentQ + 1 < clinicalQuestions.length ? 'Next Example' : 'Finish'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 6: Wrap-Up — Review & Consolidation

**Estimated time:** 20 minutes

---

### Instructor Introduction

"Let's step back and look at what you've accomplished today. You started by making your first API call to GPT from Python. Then you extracted structured clinical data from messy oncology notes using Pydantic. You built conversation memory and gave your assistant tools to look up patient data. You loaded real KHCC vitals into a SQL database. And you built a system where anyone can ask questions of that database in plain English. That is a complete clinical AI data pipeline — from raw notes and CSV files to an intelligent, conversational interface. In Session 4, you'll take these same patterns to HuggingFace and open-source models."

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|---|---|---|
| 1 | OpenAI API Fundamentals | Programmatic LLM access with parameters, tokens, and prompting techniques | Foundation for every clinical AI pipeline — move from playground to production |
| 2 | Structured Output & Clinical Data Extraction | JSON mode and Pydantic models for guaranteed structured responses | Extract diagnoses, meds, and staging from clinical notes into database-ready formats |
| 3 | Conversation Memory & Tool Calling | Message history for context retention; tool calling for external data access | Build clinical assistants that remember context and can look up patient data |
| 4 | From CSV to SQL — Clinical Data Foundations | Load clinical CSV data (vitals + patients), convert to SQLite, SQL queries including JOINs | Query KHCC vitals and patient demographics with JOINs for clinical insights |
| 5 | Text-to-SQL — Talk to Your Data | LLM generates SQL from natural language over clinical databases | Enable clinicians to query databases without SQL knowledge |

**Connecting the Dots:** This session built a complete pipeline from data to intelligence. Lessons 1–3 focused on the LLM side — how to call it, get structured output, give it memory and tools. Lessons 4–5 focused on the data side — loading clinical data, structuring it in SQL, and connecting the LLM to the database. The text-to-SQL system in Lesson 5 combined every technique: API calls (Lesson 1), structured prompting (Lesson 2), conversation memory and tool calling (Lesson 3), and SQL over clinical data (Lesson 4). This is not five separate topics — it is one pipeline with five layers.

---

### Common Mistakes & Gotchas

1. **Forgetting to set temperature=0 for extraction tasks** — Using default temperature for clinical data extraction introduces randomness. Always use 0.0 when you need deterministic, reproducible results.

2. **Not counting tokens before sending long clinical notes** — A 200-page discharge summary might exceed the context window. Always check with tiktoken before making an API call.

3. **Using JSON mode without Pydantic when you need a specific schema** — JSON mode guarantees valid JSON but NOT your specific fields. Use Pydantic structured outputs when you need guaranteed field names and types.

4. **Forgetting to append assistant messages to the conversation history** — If you only append user messages, the model loses track of its own responses and cannot maintain coherent multi-turn conversations.

5. **Not validating LLM-generated SQL before execution** — Never execute DELETE, UPDATE, or DROP statements generated by an LLM. Always use read-only connections and validate that the query is a SELECT.

---

### Quick Self-Check (No-Code)

1. What is the difference between JSON mode and Pydantic structured outputs?
2. Why are LLMs stateless, and how do you build memory?
3. In the tool calling flow, who executes the function — the model or your code?
4. What does `df.to_sql('vista_vitals', conn)` do?
5. Name three safety measures for a text-to-SQL system.

<details>
<summary>Answers</summary>

1. JSON mode guarantees valid JSON but any structure. Pydantic structured outputs guarantee your exact schema with specific fields, types, and constraints.
2. Each API call is independent — the model has no memory. You build memory by maintaining a messages list and sending the full history with every call.
3. YOUR code executes the function. The model only returns which function to call and with what arguments. You execute it and send results back.
4. It converts a pandas DataFrame into a SQLite table named 'vista_vitals', writing all rows and columns to the database.
5. Read-only database connections, validate queries are SELECT only, show generated SQL to users for verification, use parameterized queries, limit result set size.
</details>

---

### What's Next

In Session 4, you'll explore HuggingFace and open-source models — clinical NLP models like BioBERT and ClinicalBERT that you can run locally without API costs. You'll use the same Python skills from today to load models, run inference, and compare results against the OpenAI API. The extraction and tool calling patterns you learned today will apply directly to open-source alternatives.

---

## SESSION 3 ASSIGNMENT: Clinical Medication Report Pipeline

**Due:** Before Session 4
**Estimated effort:** 3–5 hours
**Submission:** Push to your personal GitHub repo under `assignments/session-3/` and share the link with Dr. Iyad

---

### Clinical Scenario

> The KHCC pharmacy department needs a system to process medication administration records. They receive daily CSV extracts from VistA (`vista_medications.csv`) containing medication orders — but they also need to cross-reference with unstructured pharmacy consultation notes to catch drug interactions and dosing adjustments that aren't in the structured data. The head pharmacist wants to query this data in plain English: "Which patients on cisplatin also received ondansetron within 30 minutes?" or "Show me all dose modifications this week." Currently this takes hours of manual chart review.

### Requirements

**Part 1 — Foundation (30%): CSV to SQL Pipeline**
Build a complete pipeline that:
- Loads a provided `vista_medications.csv` file (you will create a synthetic dataset of ~500 rows with columns: ORDER_ID, MRN, MEDICATION_NAME, DOSE, ROUTE, FREQUENCY, ORDER_DATETIME, ADMINISTERING_NURSE, WARD)
- Explores the data with pandas (shape, describe, value_counts)
- Converts to a SQLite database
- Demonstrates 5 meaningful SQL queries relevant to pharmacy operations
- Must produce a working Colab notebook

**Part 2 — Application (30%): LLM-Powered Extraction + Text-to-SQL**
Combine two techniques from class:
- Create 5 synthetic pharmacy consultation notes (different from the 10 clinical notes used in class)
- Use Pydantic structured output to extract: drug_name, current_dose, adjusted_dose, reason_for_adjustment, interacting_drugs
- Build a text-to-SQL interface over your medications database
- Demonstrate 3 natural language queries with the generated SQL and formatted answers

**Part 3 — Analysis & Critical Thinking (20%)**
Write 300–400 words addressing:
- What happens when the LLM generates incorrect SQL for a medication query? What's the clinical risk?
- Identify 2 edge cases in your extraction pipeline (notes that would be hard to parse)
- How would you validate your text-to-SQL system before letting pharmacists use it?
- What PHI considerations exist when using OpenAI API with real medication data?

**Part 4 — Stretch Challenge (20%)**
Choose one:
- Add tool calling: build a pharmacy assistant with tools for `lookup_medication(mrn)`, `check_interaction(drug1, drug2)`, and `query_database(sql)` — demonstrate a multi-turn conversation
- Add memory: build a conversational text-to-SQL interface where the pharmacist can ask follow-up questions ("And what about last week?" / "Filter that by ICU only")
- Benchmark: compare extraction accuracy between gpt-4o and gpt-4o-mini on your 5 pharmacy notes — report precision, recall, and cost per note

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Code quality & correctness | 25% | Clean, runs without errors, handles edge cases | Runs with minor issues | Broken or incomplete |
| Clinical relevance | 25% | Directly applicable to KHCC pharmacy, realistic data patterns | Clinically reasonable but generic | Abstract/disconnected from pharmacy context |
| Critical analysis (Part 3) | 25% | Identifies non-obvious risks, proposes realistic validation | Surface-level analysis | Missing or generic |
| Stretch challenge (Part 4) | 25% | Creative, well-implemented, demonstrates independent thinking | Attempted but shallow | Not attempted |

### Anti-Shortcut Rules
- Your 5 pharmacy consultation notes must be different in style and complexity from the 10 notes used in class
- Your SQL queries must be different from any demonstrated in the lab notebooks
- Part 3 must reference your specific pipeline's limitations, not generic AI risks
- Include a screenshot of your text-to-SQL system answering at least one question

---

**KHCC connection:** This assignment mirrors the medication reconciliation workflow being developed in AIDI-DB, where pharmacy teams need both structured medication order data and unstructured consultation notes to make safe prescribing decisions.
