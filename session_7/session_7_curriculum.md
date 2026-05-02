# CCI Session 7: LLM Evaluation
## Curriculum — 6 Lessons + Session Wrap-Up

**Audience:** Completed Sessions 1–6 (prompt engineering, Python, OpenAI API, HuggingFace, LangChain/LangGraph, RAG with LlamaParse + DeepEval). First time approaching evaluation as its own discipline.
**Clinical Anchor:** **Oncology Summary Assistant** — a tool that ingests a pediatric oncology patient case (history, labs, imaging notes, pathology) and produces a structured tumor-board-ready summary. Used as the running example across all six lessons.
**Session Duration:** 3 hours
**Lab Mode:** Mixed — Colab notebooks for Lessons 2–4 and 6, slide-based discussion for Lessons 1 and 5
**Content/Practice Split:** 50/50
**Environment:** Google Colab with `openai`, `deepeval`, `lighteval`, and a free-tier Opik account for production observability

**Hand-off:**
- **Session 8 (journal club):** every paper a student presents must include a critique of how the authors evaluated their model
- **Session 9 (IDE / building repos):** students will wire the eval harness from this session into their own repo as a CI step

---

## LESSON 1 OF 6: Why Evaluate — and Where Evals Live

**Estimated time:** 25 minutes (15 min content / 10 min discussion)

---

### Instructor Introduction

"You have built things in the previous sessions — prompts, agents, RAG pipelines. They work on the five examples you tested. Now imagine I deploy your Oncology Summary Assistant at KHCC tomorrow and 200 oncologists use it on real patient cases for a week. How do you know — at the end of the week — whether it helped or harmed? Vibe-checking does not scale, and in clinical settings vibe-checking is dangerous: a confident wrong drug dose is a patient safety event that no amount of 'looks good' on five samples will catch. This lesson is the foundation of everything else in the session. Evaluation is not a single thing — it lives in three places: while you develop the tool, when you decide whether a change is safe to merge, and continuously on live traffic in production. We will name these three layers, separate evaluators from guardrails, and set the trap that the rest of the session disarms."

---

### NotebookLM Summary

Evaluation is the discipline of measuring whether your AI system actually does what you want it to do — and the most expensive bug in clinical AI is the one nobody measured for. Without evaluation, every change to a prompt, a retrieval setting, a model version, or a system prompt is a guess. Vibe-checking — looking at five outputs and saying "seems fine" — feels efficient but breaks down silently. The output that looks fine on Tuesday's case may hallucinate a chemotherapy dose on Thursday's, and unless you measured systematically you will not know until a clinician notices. In a regulated cancer-care setting, the cost of "did not notice" is too high. Evaluation is how you move from intuition to evidence.

There are two perspectives on evaluation that pull in different directions, and the right answer depends on which you are. The **model builder** is asking "is my system improving?" — they need fast, repeatable benchmarks they can run on every change to know whether they made things better or worse. The **model user** is asking "is this system good enough for my specific task?" — they need evaluations that match the actual workflow, even if those evaluations are slow or expensive. Most clinical AI work is the user perspective: you are not training models from scratch at KHCC, you are choosing, prompting, and orchestrating them for specific clinical workflows. That changes which evaluations matter to you.

Evaluation lives in **three layers** that complement each other. The first layer is **development optimization** — fast offline benchmarks you run while iterating on a prompt or pipeline, ideally in seconds. These let you ablate ("does adding the chain-of-thought prompt help?") without breaking your flow. The second layer is **pre-merge regression testing** — a curated test suite that runs on every commit before you ship, catching regressions before they reach users. This is the equivalent of unit tests in software engineering. The third layer is **production monitoring** — continuous evaluation on live traffic, sampling real interactions and scoring them so you know when behavior drifts. Drift happens — model providers update their models silently, your input distribution changes as users discover the tool, your reference documents get updated. Without production monitoring you find out about drift from a complaint, not a metric.

A subtle but important distinction: **guardrails are not evaluators**. A guardrail is a runtime check that blocks or modifies a bad output before it reaches the user — for example, a regex that refuses any output containing a specific drug name outside an approved list, or a classifier that rejects PHI leaks. An evaluator is an offline scorer that tells you, after the fact, how good your outputs are on a labeled dataset. Both matter, and they overlap (a guardrail's threshold is itself something you should evaluate), but they do different jobs. Guardrails defend the user; evaluators defend the engineer's ability to know whether the system is improving.

What can evaluations tell you, and what can they not? An evaluation is a **proxy for capability** — never a guarantee of real-world performance. A model can score 95% on MedQA and still hallucinate doses on a real KHCC case if MedQA's question style does not match how your clinicians actually phrase questions. Two pitfalls show up everywhere: **saturation** (the benchmark is too easy — every model scores near 100% so the metric no longer discriminates) and **contamination** (the benchmark leaked into the model's training data, so high scores reflect memorization rather than capability). Both are why benchmark-shopping ("which model scores highest on X?") is a weak way to choose a model. The strongest signal you can get is from an evaluation built on your own data, for your own task, with your own quality bar.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Hugging Face Evaluation Guidebook PDF as a source, and use *Audio Overview* to generate a podcast-style summary students can listen to before class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You ship your Oncology Summary Assistant to KHCC and check 5 outputs that look great. A week later a clinician reports a hallucinated chemotherapy dose. What was the core mistake?",
    options: [
      "You used the wrong model — a bigger model would have caught it",
      "Vibe-checking on 5 examples does not scale and cannot detect rare-but-serious failures; you needed systematic evaluation",
      "Hallucinations are unavoidable with LLMs and there is no way to catch them",
      "The clinician should have used a different prompt"
    ],
    correct: 1,
    explanation: "Vibe-checking is fast and feels productive, but it cannot find rare failure modes — and in clinical settings, rare failures (a wrong dose) are exactly the ones that hurt patients. Systematic evaluation on a labeled dataset, with metrics that catch hallucinations specifically (faithfulness, factual accuracy), is the only way to know your system's true error rate."
  },
  {
    question: "What are the three layers of evaluation, and where does each one run?",
    options: [
      "Unit tests, integration tests, end-to-end tests — all in CI",
      "Development optimization (offline, while iterating), pre-merge regression testing (CI on every commit), production monitoring (continuous on live traffic)",
      "Prompt evaluation, model evaluation, output evaluation — all in production",
      "Faithfulness, relevancy, recall — all on a single test set"
    ],
    correct: 1,
    explanation: "Evaluation runs in three layers. Development is fast iteration on small benchmarks while you build. Pre-merge regression testing catches regressions before they ship. Production monitoring catches drift on live traffic. Each layer has different speed, cost, and signal characteristics — and a mature system uses all three."
  },
  {
    question: "Which statement correctly distinguishes a guardrail from an evaluator?",
    options: [
      "Guardrails and evaluators are the same thing with different names",
      "A guardrail is a runtime check that blocks or modifies a bad output before it reaches the user; an evaluator is an offline scorer that tells you how good your outputs are on a labeled dataset",
      "Guardrails are for production and evaluators are for development",
      "A guardrail uses an LLM and an evaluator uses regex"
    ],
    correct: 1,
    explanation: "Guardrails defend the user at runtime — they intercept and block bad outputs in real time. Evaluators defend the engineer — they score outputs offline so you can measure whether the system is improving. Both matter, and the threshold of a guardrail is itself something you should evaluate."
  },
  {
    question: "A model scores 95% on MedQA. What does this tell you about its performance on your KHCC oncology summary tool?",
    options: [
      "It will score 95% on KHCC tasks too — MedQA is a comprehensive medical benchmark",
      "Almost nothing — MedQA score is a proxy for one kind of medical knowledge, not for performance on your specific task with your specific data and your specific quality bar",
      "It will score lower because KHCC tasks are harder",
      "It will score higher because KHCC tasks are easier"
    ],
    correct: 1,
    explanation: "Benchmark scores are weak proxies for real-world task performance. MedQA tests one specific format of multiple-choice medical knowledge, which may not match how clinicians actually use your tool. The strongest signal comes from evaluations built on your own data, for your own task. Benchmark-shopping is a poor way to choose a clinical model."
  },
  {
    question: "What are 'saturation' and 'contamination' in the context of benchmarks?",
    options: [
      "Saturation = benchmark is too long; contamination = benchmark contains PHI",
      "Saturation = the benchmark is too easy and no longer discriminates between models; contamination = the benchmark leaked into the model's training data, so high scores reflect memorization not capability",
      "Saturation = too many users; contamination = too few annotators",
      "Saturation and contamination are both terms for prompt injection"
    ],
    correct: 1,
    explanation: "Saturation means the benchmark has lost discriminative power — every modern model scores near 100% so the metric tells you nothing about which model is better. Contamination means the benchmark questions have appeared in the model's training data, so high scores reflect memorization rather than generalization. Both are why benchmark scores should always be interpreted with skepticism."
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
          {score >= 4 ? "Excellent! You understand why evaluation is the foundation, not an afterthought." : score >= 3 ? "Good — review the three layers and the difference between guardrails and evaluators." : "Review the lesson on what evaluation is and the three layers before moving on."}
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

const SCENARIOS = [
  {
    id: 's1',
    text: "You change the system prompt of the Oncology Summary Assistant from 'be concise' to 'include all positive findings'. Before merging the change, you want to make sure summaries do not get worse on your existing 30 test cases.",
    correctLayer: 'regression',
    rationale: "This is exactly what pre-merge regression testing is for: a curated test suite that runs on every change to catch regressions before they ship."
  },
  {
    id: 's2',
    text: "You are iterating on a new chain-of-thought prompt. Each time you tweak a word, you want to know in 30 seconds whether the change helped on a small set of representative cases.",
    correctLayer: 'development',
    rationale: "Fast offline iteration with a small representative benchmark is the development optimization layer. The goal is sub-minute feedback so you can experiment without breaking flow."
  },
  {
    id: 's3',
    text: "Your tool has been deployed at KHCC for 3 months. You want to know whether GPT-4o's silent model update last week changed the quality of your summaries on real cases.",
    correctLayer: 'production',
    rationale: "Drift detection on live traffic is production monitoring. Sample real interactions, score them continuously, alert on quality drops. Without this layer, silent vendor model changes go unnoticed until a user complains."
  },
  {
    id: 's4',
    text: "You want a runtime check that automatically blocks any summary containing patient identifiers (name, MRN, date of birth) before it is shown to a clinician.",
    correctLayer: 'guardrail',
    rationale: "This is a guardrail, not an evaluator. It intercepts bad outputs at runtime and blocks them. You should still evaluate the guardrail itself (does it catch all PHI?) — but the runtime block is a guardrail by definition."
  },
  {
    id: 's5',
    text: "You want to know how often your tool produces a clinically incorrect summary on a labeled set of 100 historical cases reviewed by oncologists.",
    correctLayer: 'regression',
    rationale: "An offline scoring run against a labeled dataset is the pre-merge regression testing layer (you would run this before merging changes) — and depending on cost may also run as part of development. Either way, it is an evaluator, not a guardrail."
  }
];

const LAYERS = [
  { id: 'development', label: 'Development optimization' },
  { id: 'regression', label: 'Pre-merge regression testing' },
  { id: 'production', label: 'Production monitoring' },
  { id: 'guardrail', label: 'Guardrail (not an eval layer)' }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const s = SCENARIOS[idx];

  const submit = () => {
    if (picked === s.correctLayer) setScore(sc => sc + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked(null); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked(null); setSubmitted(false); setScore(0); };

  if (idx >= SCENARIOS.length) {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Layer Quiz Complete!</h2>
        <p style={{ fontSize: 20 }}>You got {score} / {SCENARIOS.length} scenarios right.</p>
        <div style={{ background: score >= 4 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 4 ? "Excellent — you can place an evaluation activity into the right layer." : "Review the difference between development, regression, production, and guardrails."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Place the Activity in the Right Layer</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / SCENARIOS.length) * 100}%` }} />
      </div>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8 }}><strong>Scenario {idx + 1}:</strong> {s.text}</p>

      {LAYERS.map(l => {
        const isPicked = picked === l.id;
        const isCorrect = submitted && l.id === s.correctLayer;
        const isWrong = submitted && isPicked && l.id !== s.correctLayer;
        return (
          <div key={l.id} onClick={() => !submitted && setPicked(l.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${isCorrect ? '#198754' : isWrong ? '#dc3545' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: isCorrect ? '#d4edda' : isWrong ? '#f8d7da' : isPicked ? '#e7f1ff' : '#fff'
          }}>{l.label}</div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={!picked} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: !picked ? 'default' : 'pointer', opacity: !picked ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{s.rationale}</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < SCENARIOS.length ? 'Next Scenario' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 2 OF 6: Building the Evaluation Dataset

**Estimated time:** 30 minutes (12 min content / 18 min lab)

---

### Instructor Introduction

"You cannot evaluate without data. The first instinct of most engineers — and I have done this myself — is to ask GPT-4 to generate a hundred synthetic test cases and call that the evaluation set. This is wrong, and it is wrong in a way that hides itself: synthetic data tends to capture what the generating model already understands, so your evaluation tells you 'you are good at what GPT-4 thinks you should be good at' — not what your real users actually do. The right way to build a clinical evaluation dataset is the **error-analysis flywheel**: take 20–50 real production traces, label them carefully, find the failure patterns, and grow the dataset around the cases that hurt most. Today you will run one full turn of that flywheel on a small set of Oncology Summary Assistant traces. By the end of the lesson you will have a labeled evaluation set, an annotation rubric, and a measurement of inter-annotator agreement — the foundation everything else depends on."

---

### NotebookLM Summary

The evaluation dataset is the most important artifact you will create in this session, and most teams underinvest in it. The temptation is to either (a) use a public benchmark and call it a day, or (b) ask an LLM to generate hundreds of synthetic cases. Both shortcuts fail in clinical settings. Public benchmarks rarely match your specific workflow — MedQA is multiple-choice USMLE-style questions, which is not how a clinician interacts with your Oncology Summary Assistant. Pure synthetic data has a more subtle problem: the generating model produces examples it already understands, so your evaluation systematically misses the failure modes you most need to catch. The right starting point is real traces from real (or realistically-mocked) usage.

The **error-analysis flywheel** is the practical method. Step one: collect 20–50 real production traces (or realistic test cases — at the start, you may need to seed with cases written by clinicians on your team). Step two: have a single labeler — a clinician or a clinically-informed engineer — score each trace using a rubric. Step three: cluster the failures by failure pattern (hallucinated dose, missed comorbidity, wrong staging, format error, etc.). Step four: write more cases targeting the most painful failure patterns. The dataset grows organically toward the failures that matter, instead of toward the failures the LLM-generator imagines. After three or four turns of this flywheel, you have an evaluation set that actually predicts production behavior.

There is one critical rule about synthetic data when you do use it: **generate inputs only, never outputs**. Use an LLM to imagine new patient cases, new question phrasings, new edge scenarios — but always run those inputs through your real system to produce the outputs. If you generate both inputs and outputs synthetically, you have measured nothing about your system. Use **dimensional thinking** when generating inputs: vary deliberately along axes like patient persona (pediatric vs adult, treatment-naive vs heavily pre-treated), feature (summary vs Q&A vs differential), scenario (routine vs complex vs ambiguous), and modality (text-only vs lab values vs imaging notes). This prevents mode collapse where all your synthetic cases look the same.

The **one-labeler authority** principle is counterintuitive but important. When you have multiple people labeling, you get inconsistencies that fight each other. Pick one person — typically the clinician who most owns the workflow — to be the labeling authority. Their rubric is the rubric. Other labelers can flag disagreements for discussion, but the authority's call is the ground truth. This trades parallelism for consistency, and consistency is what makes the dataset useful as a measurement instrument. You can re-introduce parallelism later by training other labelers against the authority's calls until inter-annotator agreement is high enough to trust them.

Inter-annotator agreement is how you check whether your rubric is unambiguous. **Cohen's kappa** measures agreement between two annotators on categorical labels, correcting for the agreement that would happen by chance. A kappa of 0 is chance-level agreement; 1 is perfect agreement. For clinical evaluation work, you want kappa ≥ 0.6 (substantial agreement); ≥ 0.8 is excellent. If you are below 0.6, the problem is almost always the rubric, not the annotators — your categories are too vague or your guidelines do not cover the edge cases. Refine the rubric, re-label, re-measure. This iteration is the unglamorous work that makes evaluations trustworthy.

How big does the dataset need to be? For clinical use, **50 high-quality labeled cases beat 500 sloppy ones** every time. With 50 well-chosen cases covering the failure patterns you have observed in production, you can catch most regressions. Beyond ~100 cases, you face diminishing returns from sheer count and increasing returns from coverage diversity. As your tool matures, the dataset should grow toward 200–500 cases organized by failure pattern, so you can report metrics per failure category — not just one global accuracy number.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add Paul Iusztin's AI Evals Roadmap article, and use *Audio Overview* to generate a podcast students can listen to before class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You are starting a new evaluation dataset for the Oncology Summary Assistant. What is the best starting point?",
    options: [
      "Ask GPT-4 to generate 200 synthetic patient cases",
      "Use the MedQA public benchmark — it is well-validated",
      "Collect 20–50 real (or realistic) production traces and label them carefully — the error-analysis flywheel",
      "Wait until you have 1000+ cases before starting evaluation"
    ],
    correct: 2,
    explanation: "The error-analysis flywheel starts small with real traces. Synthetic-only datasets capture what the generator already understands and miss real failure modes. Public benchmarks rarely match your specific workflow. 20–50 well-labeled real cases beat 200 synthetic ones for predicting production behavior."
  },
  {
    question: "You decide to use synthetic data to expand your evaluation set. What is the critical rule?",
    options: [
      "Generate both inputs and outputs synthetically — it is faster",
      "Generate inputs only, then run those inputs through your real system to produce the outputs you evaluate",
      "Only use synthetic data from the same model you are evaluating",
      "Generate at least 1000 cases to drown out noise"
    ],
    correct: 1,
    explanation: "If you generate both inputs and outputs, you have measured nothing about your system — you have measured the generator. The rule is: synthetic INPUTS are fine (they expand coverage of edge cases), but the OUTPUTS must always come from your real system, because that is what you are evaluating."
  },
  {
    question: "Your team has 4 clinicians available to label cases. What should you do first?",
    options: [
      "Have all 4 label different cases in parallel to maximize throughput",
      "Pick ONE labeler as the authority — their rubric is the rubric. Others can flag disagreements, but the authority's call is ground truth. Re-introduce parallelism later by training others against the authority",
      "Have all 4 label the same cases and average their scores",
      "Use an LLM judge instead and skip human labeling"
    ],
    correct: 1,
    explanation: "Multiple labelers without a single authority produce inconsistencies that fight each other. The one-labeler authority principle trades parallelism for consistency, and consistency is what makes the dataset useful as a measurement instrument. You can train other labelers against the authority later, once inter-annotator agreement is high enough to trust them."
  },
  {
    question: "You measure Cohen's kappa between two annotators on a 50-case sample and get 0.42. What does this tell you?",
    options: [
      "Excellent agreement — ship the dataset",
      "Substantial agreement — slightly below ideal but acceptable",
      "Moderate agreement at best — your rubric is probably too vague or the guidelines do not cover edge cases. Refine the rubric, re-label, re-measure",
      "Cohen's kappa is irrelevant for clinical work"
    ],
    correct: 2,
    explanation: "Kappa of 0.42 is moderate agreement — below the ≥ 0.6 substantial-agreement threshold typically required for clinical evaluation work. The problem is almost always the rubric, not the annotators. Tighten the rubric with more examples and decision rules for edge cases, then re-measure. This iteration is unglamorous but essential."
  },
  {
    question: "Which dataset is most likely to catch regressions in clinical use?",
    options: [
      "500 GPT-4-generated synthetic cases",
      "50 carefully-labeled real cases covering the failure patterns observed in production",
      "1000 cases from MedQA",
      "5 hand-picked perfect cases"
    ],
    correct: 1,
    explanation: "50 high-quality cases beat 500 sloppy ones for clinical evaluation. The dataset should target the failure patterns you have actually seen, not the failures an LLM imagines you might have. As your tool matures the set grows — but the foundation is small, careful, and real."
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
          {score >= 4 ? "Excellent! You can build an evaluation dataset that actually predicts production behavior." : score >= 3 ? "Good — review the synthetic-data rule and Cohen's kappa interpretation." : "Review the error-analysis flywheel and the one-labeler authority principle."}
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

const TRACES = [
  {
    id: 't1',
    input: "12-year-old female with abdominal mass, biopsy confirms favorable-histology Wilms tumor, stage III, no metastases. Pre-existing mild renal impairment (eGFR 70).",
    output: "12-year-old with stage III favorable-histology Wilms tumor. Recommend standard regimen of vincristine, actinomycin-D, and doxorubicin with flank radiotherapy. Cisplatin 100 mg/m² every 3 weeks for renal protection.",
    correctLabel: 'incorrect_harmful',
    rationale: "The output recommends cisplatin — which is NOT part of the standard Wilms regimen and is actively NEPHROTOXIC in a patient with pre-existing renal impairment. This is a hallucinated, harmful recommendation. Label: incorrect-and-harmful."
  },
  {
    id: 't2',
    input: "5-year-old male with stage I favorable-histology Wilms tumor, normal renal function, post-nephrectomy.",
    output: "5-year-old with stage I favorable-histology Wilms tumor, post-nephrectomy. Recommend adjuvant chemotherapy with vincristine and actinomycin-D for 18 weeks per standard protocol. Monitor renal function and growth.",
    correctLabel: 'correct',
    rationale: "Stage I FH Wilms post-nephrectomy is treated with vincristine + actinomycin-D for 18 weeks. The summary is accurate, complete, and includes appropriate monitoring guidance. Label: correct."
  },
  {
    id: 't3',
    input: "8-year-old with stage III favorable-histology Wilms tumor, normal organ function.",
    output: "8-year-old with Wilms tumor. Recommend chemotherapy and surgery.",
    correctLabel: 'partial',
    rationale: "The summary captures the diagnosis but is too vague to be clinically useful — it omits the stage, the histology, the specific regimen (VAD + radiotherapy), and any monitoring guidance. It is not wrong, just incomplete to the point of low value. Label: partially correct."
  },
  {
    id: 't4',
    input: "3-year-old female with bilateral Wilms tumor, favorable histology bilaterally, no metastases.",
    output: "3-year-old with bilateral (Stage V) favorable-histology Wilms tumor. Recommend pre-operative chemotherapy with vincristine and actinomycin-D to shrink tumors, followed by nephron-sparing surgery to preserve renal function. Coordinate closely with pediatric urology and nephrology.",
    correctLabel: 'correct',
    rationale: "Bilateral Wilms (Stage V) is correctly identified, the pre-operative chemotherapy plan matches the standard approach, nephron-sparing surgery is appropriately recommended, and the multidisciplinary coordination note is clinically relevant. Label: correct."
  },
  {
    id: 't5',
    input: "10-year-old male with newly-diagnosed Wilms tumor, anaplastic histology, stage II.",
    output: "10-year-old with stage II favorable-histology Wilms tumor. Recommend vincristine and actinomycin-D for 18 weeks per stage I/II favorable-histology protocol.",
    correctLabel: 'incorrect_harmful',
    rationale: "The input clearly states ANAPLASTIC histology — but the output ignores that and labels the case as favorable-histology, recommending the wrong (under-treated) regimen. Anaplastic Wilms requires intensified therapy. This is a critical clinical error caused by the model misreading the input. Label: incorrect-and-harmful."
  }
];

const LABELS = [
  { id: 'correct', label: '✅ Correct — clinically accurate and appropriately complete' },
  { id: 'partial', label: '⚠️ Partially correct — accurate but incomplete or ambiguous' },
  { id: 'incorrect_harmful', label: '❌ Incorrect and harmful — contains a clinical error that could harm a patient' }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const t = TRACES[idx];

  const submit = () => {
    if (picked === t.correctLabel) setScore(s => s + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked(null); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked(null); setSubmitted(false); setScore(0); };

  if (idx >= TRACES.length) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Labeling Exercise Complete!</h2>
        <p style={{ fontSize: 20 }}>You labeled {score} / {TRACES.length} traces correctly.</p>
        <div style={{ background: score >= 4 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 4 ? "Excellent — your labels match the rubric authority. You are ready to be a labeler." : "Review the rubric: 'incorrect-and-harmful' is reserved for cases that could cause patient harm, not just incompleteness."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Label the Trace — Be the Authority</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / TRACES.length) * 100}%` }} />
      </div>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Patient case (input):</strong> {t.input}</p>
      <p style={{ background: '#e7f1ff', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Tool output:</strong> {t.output}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Apply the 3-tier rubric:</p>
      {LABELS.map(l => {
        const isPicked = picked === l.id;
        const isCorrect = submitted && l.id === t.correctLabel;
        const isWrong = submitted && isPicked && l.id !== t.correctLabel;
        return (
          <div key={l.id} onClick={() => !submitted && setPicked(l.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${isCorrect ? '#198754' : isWrong ? '#dc3545' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: isCorrect ? '#d4edda' : isWrong ? '#f8d7da' : isPicked ? '#e7f1ff' : '#fff'
          }}>{l.label}</div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={!picked} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: !picked ? 'default' : 'pointer', opacity: !picked ? 0.5 : 1 }}>Submit Label</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{t.rationale}</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < TRACES.length ? 'Next Trace' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 3 OF 6: Choosing Your Evaluator

**Estimated time:** 30 minutes (15 min content / 15 min lab)

---

### Instructor Introduction

"You have a labeled dataset. Now you need an evaluator — the function that takes (input, output, ground truth) and returns a score. There are three families to choose from, and the wrong choice costs you either money or trust. **Functional evaluators** are deterministic code: a regex that checks the output contains a TNM stage in valid format, a JSON-schema validator, an exact-numeric match for a lab value. They are cheap, instant, perfectly reproducible, and cover only what you can express as code. **LLM-as-judge** evaluators are flexible — you write a rubric prompt and a strong LLM scores the output. They can judge clinical relevance, fluency, helpfulness, things you cannot regex. But they have biases, they cost money per call, and they need to be validated themselves (which is the next lesson). **Human evaluators** are the gold standard but do not scale. The skill is matching the right evaluator family to the right metric. Today we build one of each, on the same task, and compare their cost, speed, and disagreement."

---

### NotebookLM Summary

The choice of evaluator determines what you can measure and what you cannot. There are three families, and a mature evaluation suite uses all three for different metrics on the same system. **Functional evaluators** are the cheapest and most reproducible — they are just code. A regex that checks the output starts with a valid ICD-10 code, a JSON-schema validator that ensures the structured output has all required fields, a numeric-tolerance check that the recommended dose falls within ±5% of a reference value, an `assert "do not know" in output.lower() if context_insufficient else True`. They run in milliseconds, they cost nothing, they are perfectly reproducible, and they cover exactly what you can express in code. For tasks with verifiable structure — formatting, presence of required fields, numeric correctness, refusal-to-answer — functional evaluators should always be the first choice.

**LLM-as-judge** evaluators trade reproducibility for flexibility. You write a rubric prompt — for example, "On a scale of 1 to 5, rate the clinical relevance of this oncology summary to the input case. 5 means every relevant clinical detail is captured; 1 means the summary is unrelated to the case. Provide your score and a one-sentence justification" — and a strong LLM (typically GPT-4-class) reads (input, output, optionally ground truth) and produces the score. This is the only practical way to measure properties that resist code: clinical relevance, fluency, helpfulness, faithfulness to a long context. DeepEval's metrics from Session 6 (Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall) are all LLM-as-judge under the hood.

LLM judges have a well-documented bias catalog and you should know it. **Position bias**: in pairwise comparisons, judges tend to prefer the first or second option regardless of content — mitigate by randomizing position. **Verbosity bias**: judges tend to prefer longer answers — mitigate by length-normalizing or by explicitly instructing the judge to penalize unnecessary length. **Self-preference bias**: a judge tends to prefer outputs from models in its own family — mitigate by using a different judge family from the model under evaluation, or by using a jury of judges. **Format bias**: a judge follows the format it was trained on; if your prompt format is unusual the scores degrade — mitigate by testing prompt sensitivity. **Inconsistency**: ask the same judge the same question twice with non-zero temperature and you get different answers — mitigate by self-consistency (run N times, take majority).

A sharp practical rule: **pairwise comparison is more robust than absolute scoring**. "Is output A better than output B?" is a question judges answer reliably; "rate this output on a scale of 1 to 5" is a question judges answer with drift, scale compression, and inconsistency. When you can structure an evaluation as pairwise (your new prompt vs. the baseline prompt, model A vs. model B), do so — the signal is cleaner and the biases are easier to control.

**Human evaluators** are the gold standard for properties that matter most clinically — clinical correctness, safety, calibrated uncertainty — but they do not scale and they have their own biases (first-impression, tone, identity-driven). The right place to use humans is for two specific jobs: (1) building the labeled ground-truth dataset (Lesson 2) that all your other evaluators are validated against, and (2) the final check on a small sample of production traces every week or month. Trying to use humans for every CI run is unsustainable; trying to skip humans entirely is risky.

The selection rule of thumb: **functional first, judge second, human as ground truth and final check**. Start every metric by asking "can I express this as code?" — if yes, do it. If no, ask "can an LLM judge this with a clear rubric?" — if yes, build it and validate it (next lesson). Reserve humans for the things only humans can do: producing the ground truth and confirming the most safety-critical decisions.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Hugging Face Evaluation Guidebook PDF as a source, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You want to check that every Oncology Summary Assistant output includes a stage in valid TNM format (e.g., T2N1M0). Which evaluator family should you use?",
    options: [
      "LLM-as-judge with a clinical-relevance rubric",
      "Functional evaluator (a regex or schema validator) — it is structure you can express in code",
      "Human evaluator only",
      "All three at once"
    ],
    correct: 1,
    explanation: "Functional first. Anything you can express as code (formats, required fields, numeric ranges, refusals) should be a functional check — it is instant, free, perfectly reproducible, and unambiguous. Reserve LLM judges for properties that resist code."
  },
  {
    question: "You want to score whether the summary captures the clinically most important findings from the input case. Which evaluator family fits best?",
    options: [
      "Functional evaluator — write a regex that checks for keywords",
      "LLM-as-judge with a rubric like 'rate clinical relevance 1–5' — this is the kind of judgment that resists code",
      "Use only human evaluators",
      "Use exact string matching against a reference summary"
    ],
    correct: 1,
    explanation: "Clinical relevance is exactly the kind of subjective, context-dependent judgment that functional checks cannot capture and that LLM judges handle well. You write a clear rubric, you validate the judge against human labels (next lesson), then you can use it at scale."
  },
  {
    question: "Which of these is a known bias of LLM-as-judge evaluators?",
    options: [
      "They prefer shorter answers because shorter is faster to read",
      "Position bias (in pairwise comparisons, preference for first or second option) — and verbosity bias, self-preference, format bias, and inconsistency at non-zero temperature",
      "They are immune to biases when temperature is set to 0",
      "They always agree with human annotators"
    ],
    correct: 1,
    explanation: "LLM judges have a documented bias catalog: position, verbosity (preference for LONGER answers), self-preference (preference for outputs from their own model family), format, and inconsistency. Each has a mitigation — randomize positions, length-normalize, use a jury, follow training format, run with self-consistency."
  },
  {
    question: "Why is pairwise comparison generally more robust than absolute 1–5 scoring with an LLM judge?",
    options: [
      "Pairwise comparison is faster to compute",
      "'Is A better than B' is a question judges answer reliably; '1–5 scoring' suffers from scale drift, compression, and inconsistency",
      "Absolute scoring is forbidden by clinical guidelines",
      "Pairwise comparison does not require a rubric"
    ],
    correct: 1,
    explanation: "Pairwise comparison is structurally easier for the judge: it is a discrimination task, not an absolute calibration task. Absolute scoring drifts (yesterday's '4' is today's '3'), compresses (every output gets a 4), and is inconsistent across runs. When you can structure an evaluation as pairwise, do so."
  },
  {
    question: "Where should human evaluation sit in a mature evaluation pipeline for the Oncology Summary Assistant?",
    options: [
      "Humans should evaluate every CI run",
      "Humans should never be used — LLM judges are sufficient",
      "Humans build the labeled ground-truth dataset that other evaluators are validated against, and act as a final check on a small sample of production traces; the bulk of CI runs use functional + LLM-judge evaluators",
      "Humans should only be used for failure analysis"
    ],
    correct: 2,
    explanation: "Humans are the gold standard for what matters most (clinical correctness, safety) but do not scale. The right pattern: humans produce ground truth (Lesson 2) and review a sample of production traces; functional and LLM-judge evaluators carry the load on every CI run. Trying to use humans for every run is unsustainable; skipping humans entirely is risky."
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
          {score >= 4 ? "Excellent! You can choose the right evaluator family for any metric." : score >= 3 ? "Good — review the LLM-judge bias catalog and the pairwise-vs-scoring rule." : "Review the three evaluator families and the 'functional first, judge second, human as ground truth' rule."}
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

const METRICS = [
  {
    id: 'm1',
    name: 'Output contains a valid TNM stage (e.g., T2N1M0)',
    bestEvaluator: 'functional',
    explanation: "TNM format is a regex pattern (T[0-4]N[0-3]M[0-1]). A functional check is instant, free, and perfectly reproducible. Using an LLM judge here would be slower, more expensive, and noisier."
  },
  {
    id: 'm2',
    name: 'Summary captures the clinically most important findings from the input case',
    bestEvaluator: 'judge',
    explanation: "'Clinically most important' is a contextual judgment that resists code. An LLM judge with a clear rubric and a few-shot examples is the right tool. You will validate it against human labels in Lesson 4 before trusting it."
  },
  {
    id: 'm3',
    name: 'Output does not include any patient identifiers (name, MRN, date of birth)',
    bestEvaluator: 'functional',
    explanation: "PHI patterns are detectable by regex (or a fine-tuned NER model wrapped as a function). Functional first. This metric is also a candidate for a runtime guardrail — the same check used both offline (eval) and online (block)."
  },
  {
    id: 'm4',
    name: 'Recommended chemotherapy doses match KHCC-approved protocols within ±5%',
    bestEvaluator: 'functional',
    explanation: "Numeric extraction (regex for dose patterns) followed by a tolerance comparison against a reference table is functional. Build a small table of approved doses; the evaluator parses, looks up, compares. No LLM needed."
  },
  {
    id: 'm5',
    name: 'When the input case is incomplete (missing key data), the tool says it cannot summarize and explains why',
    bestEvaluator: 'judge',
    explanation: "Refusal-to-answer is a judgment call: did the tool refuse appropriately, with a useful explanation, or did it confabulate? Hard to capture in a regex. An LLM judge with a clear rubric ('rate appropriateness of refusal 1–3, with examples') works well."
  },
  {
    id: 'm6',
    name: 'For the highest-stakes 5% of cases, ground-truth label that the summary is clinically safe',
    bestEvaluator: 'human',
    explanation: "The safety-critical sample is exactly where humans belong. You cannot — and should not — automate the final safety check on the highest-risk cases. This is also how you produce ground truth that validates everything else."
  }
];

const EVALUATORS = [
  { id: 'functional', label: 'Functional (code/regex/schema)' },
  { id: 'judge', label: 'LLM-as-judge with a rubric' },
  { id: 'human', label: 'Human evaluator (clinician)' }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const m = METRICS[idx];

  const submit = () => {
    if (picked === m.bestEvaluator) setScore(s => s + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked(null); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked(null); setSubmitted(false); setScore(0); };

  if (idx >= METRICS.length) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Evaluator Selection Complete!</h2>
        <p style={{ fontSize: 20 }}>You matched {score} / {METRICS.length} metrics to the right evaluator family.</p>
        <div style={{ background: score >= 5 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 5 ? "Excellent — you have the 'functional first, judge second, human as ground truth' rule internalized." : "Review which kinds of metric resist code (clinical relevance, refusal appropriateness) vs which are pure structure (TNM, PHI, dose ranges)."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Pick the Right Evaluator</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / METRICS.length) * 100}%` }} />
      </div>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8 }}><strong>Metric {idx + 1}:</strong> {m.name}</p>

      {EVALUATORS.map(e => {
        const isPicked = picked === e.id;
        const isCorrect = submitted && e.id === m.bestEvaluator;
        const isWrong = submitted && isPicked && e.id !== m.bestEvaluator;
        return (
          <div key={e.id} onClick={() => !submitted && setPicked(e.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${isCorrect ? '#198754' : isWrong ? '#dc3545' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: isCorrect ? '#d4edda' : isWrong ? '#f8d7da' : isPicked ? '#e7f1ff' : '#fff'
          }}>{e.label}</div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={!picked} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: !picked ? 'default' : 'pointer', opacity: !picked ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{m.explanation}</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < METRICS.length ? 'Next Metric' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 6: Validating the Evaluator Itself

**Estimated time:** 25 minutes (10 min content / 15 min lab)

---

### Instructor Introduction

"Here is the trap that catches almost everyone: you build an LLM judge, you run it on 500 cases, you get a number, you trust the number. But the judge has never been validated against a clinician. You might be measuring the judge's biases at industrial scale and calling it a result. An unvalidated judge can give you false confidence that your tool is improving when it is not — or worse, declare your tool safe when a clinician would say it is not. The fix is the **judge–clinician alignment loop**: measure how often the judge agrees with a small set of clinician-labeled cases, diagnose where they disagree, refine the judge prompt with the diagnoses, and re-measure. You do this until you reach a trust threshold — typically 80–90% pairwise agreement or Cohen's kappa ≥ 0.6 on categorical labels — at which point the judge can carry the load on every CI run, with humans sampling production occasionally. Today we run that loop on the LLM judge from Lesson 3, using the labeled traces from Lesson 2 as ground truth."

---

### NotebookLM Summary

Validating your evaluator is the step most teams skip and most evaluation pipelines silently fail at. The mistake is treating an LLM judge as a measurement instrument without first calibrating it. A judge that disagrees with your clinicians 40% of the time still produces a number — but the number is meaningless. Worse, the judge has its own biases (position, verbosity, self-preference, format) that may systematically push scores in directions your clinicians would not endorse. Validation is the discipline that catches all of this before the judge is allowed to drive decisions.

The validation method is the **judge–clinician alignment loop**. Step one: pick a small but representative baseline of human-labeled cases — the labels you produced in Lesson 2. Fifty cases is usually enough to start; they need to cover the range of inputs your tool sees and include the failure modes you most care about. Step two: run the judge on the same cases and produce judge-labels. Step three: compute agreement between judge-labels and human-labels using a metric appropriate to the label type — accuracy and confusion matrix for binary/categorical labels, Cohen's kappa for categorical with chance correction, Pearson or Spearman correlation for continuous scores. Step four: inspect the disagreements case-by-case to understand the failure pattern — is the judge being too lenient, too strict, fooled by length, fooled by formatting? Step five: refine the judge prompt — add few-shot examples that target the failure pattern, add explicit anti-bias instructions, switch to pairwise from absolute scoring if drift is bad. Step six: re-measure agreement. Iterate until agreement crosses your trust threshold.

The threshold depends on the metric type. For **pairwise comparison**, aim for 80–90% agreement with humans. For **categorical labels** (correct / partial / incorrect), aim for Cohen's kappa ≥ 0.6 (substantial agreement); ≥ 0.8 is excellent. For **continuous scores**, Pearson correlation ≥ 0.7 with human scores is acceptable as a starting point but interpret cautiously — humans themselves have only ~0.6 correlation with each other on subjective scoring tasks, so very high judge-human correlation is suspicious. If you cannot reach the threshold after 2–3 iterations of prompt refinement, the metric may not be amenable to LLM judging and you should fall back to functional checks or human-only evaluation.

A few practical tips for the alignment loop. **Use the smallest baseline that gives you signal** — 50 cases beats 500 if the 50 are well-chosen and the 500 are noisy. Quality over quantity at this stage. **Always include edge cases and the failure modes you observed in production** — a judge that aligns well on easy cases but fails on hard ones is dangerous because the hard cases are exactly where you needed the judge most. **Always include cases where the right label is "I do not know" or "incomplete"** — judges have a strong tendency to give a confident score even when the case is ambiguous, which is a clinically dangerous failure mode.

A note on what is reused from Session 6. In Session 6 you built four DeepEval RAG-specific metrics — Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall. These are LLM-as-judge metrics under the hood, with clear rubrics built in. **You do not need to re-teach those metrics here.** Reuse them when your tool involves retrieval over clinical documents — they are already validated for that pattern. What this lesson adds is the *general* validation method that you apply to *any* LLM judge you write yourself. When you need a custom clinical-relevance judge or a custom safety-refusal judge, this is the loop you run. The DeepEval metrics from Session 6 should themselves be spot-checked on your specific clinical data — published metrics are validated on general data, not on KHCC oncology cases — but you do not need to rebuild them.

The hardest case in clinical evaluation is when the judge and the clinician genuinely disagree because the case is ambiguous. The right move there is not to pick a side but to flag the case for adjudication — surface it to a second clinician, capture the resolution, and add the resolved case to the dataset with both perspectives noted. This is how the dataset grows in value over time: every disagreement is a chance to clarify the rubric. The cost is real (clinician time), but in clinical AI the alternative (silent disagreement at scale) is worse.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the AI Evals Roadmap article and the Hugging Face guidebook chapter on "Evaluating your evaluator", and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You build an LLM judge for clinical relevance, run it on 500 cases, and report an average score of 4.2 / 5. Why is this number, on its own, untrustworthy?",
    options: [
      "Because 500 cases is too few",
      "Because the judge has not been validated against clinician labels — its scores may be systematically biased and you have no way to know",
      "Because the judge model is too small",
      "Because LLM judges always overscore"
    ],
    correct: 1,
    explanation: "An unvalidated judge produces a number, but the number is meaningless until you have measured how well it agrees with clinicians on a labeled baseline. Validation — the judge-clinician alignment loop — is the step that turns the judge from a black box into a calibrated measurement instrument."
  },
  {
    question: "What are the steps of the judge–clinician alignment loop?",
    options: [
      "Build judge → ship → fix in production",
      "Build judge → run on labeled baseline → measure agreement → diagnose disagreements → refine prompt → re-measure (iterate until threshold)",
      "Build judge → ask clinician if it is good → ship",
      "Build judge → run on 10,000 cases → report average"
    ],
    correct: 1,
    explanation: "The loop is: pick a small labeled baseline → run the judge → compute agreement → inspect disagreements case-by-case → refine the judge prompt with targeted few-shot examples and anti-bias instructions → re-measure. Iterate until agreement crosses the trust threshold for the metric type."
  },
  {
    question: "You measure Cohen's kappa between your LLM judge and clinician labels and get 0.45 on a categorical (correct/partial/incorrect) task. What does this tell you?",
    options: [
      "Excellent agreement — ship it",
      "Substantial agreement — ship it",
      "Moderate agreement at best — below the ≥ 0.6 substantial threshold typically needed for clinical work; the judge needs prompt refinement before it can drive decisions",
      "Cohen's kappa is irrelevant for LLM judges"
    ],
    correct: 2,
    explanation: "Kappa of 0.45 is moderate — it means your judge agrees with clinicians more than chance, but not enough to trust as a measurement instrument. Inspect the disagreements, refine the prompt with targeted few-shot examples, and re-measure. If after 2–3 iterations you cannot pass the threshold, the metric may not be amenable to LLM judging and you should fall back."
  },
  {
    question: "When sizing your alignment baseline, what is the right rule?",
    options: [
      "Use the largest baseline you can afford — more is always better",
      "Use the smallest baseline that gives signal (often ~50 cases), but make sure it covers the range of inputs and includes the failure modes you most care about",
      "Use only easy cases to give the judge a fair start",
      "Use 1000+ cases to drown out noise"
    ],
    correct: 1,
    explanation: "Quality over quantity at this stage. Fifty well-chosen cases — covering the range and including hard cases — beat 500 sloppy ones. The baseline must include the failure modes you observed in production; otherwise the judge can pass the threshold on easy cases and still be wrong where it matters."
  },
  {
    question: "Did Session 6 already cover the four DeepEval RAG metrics (Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall)? Do you need to re-teach them in Session 7?",
    options: [
      "No, Session 6 did not cover them — teach all four from scratch in Lesson 4",
      "Yes — Session 6 covered the four DeepEval RAG metrics in detail. Session 7 references back to them for RAG-style tools but adds the general LLM-judge validation loop you apply to any custom judge you write yourself",
      "Session 6 covered only Faithfulness — re-teach the other three",
      "DeepEval is deprecated — do not use it"
    ],
    correct: 1,
    explanation: "Session 6 covered the four DeepEval RAG metrics with the Wilms tumor pipeline. Session 7 does not repeat them; instead it adds the general validation method (judge-clinician alignment loop) that applies to any custom LLM judge you write — including the DeepEval ones, which themselves should be spot-checked on your specific clinical data."
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
          {score >= 4 ? "Excellent! You will not ship an unvalidated judge." : score >= 3 ? "Good — review Cohen's kappa thresholds and the alignment loop steps." : "Review the judge-clinician alignment loop and why an unvalidated judge produces meaningless numbers."}
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

const CASES = [
  {
    id: 'c1',
    input: "8-year-old with stage III favorable-histology Wilms tumor.",
    output: "Stage III FH Wilms tumor. Recommend vincristine, actinomycin-D, and doxorubicin with flank radiotherapy per standard protocol.",
    humanLabel: 'correct',
    judgeLabel: 'correct',
    agree: true,
    note: "Both agree: clinically accurate. No action needed."
  },
  {
    id: 'c2',
    input: "10-year-old with newly-diagnosed Wilms tumor, anaplastic histology, stage II.",
    output: "10-year-old with stage II favorable-histology Wilms tumor. Recommend vincristine and actinomycin-D for 18 weeks.",
    humanLabel: 'incorrect_harmful',
    judgeLabel: 'correct',
    agree: false,
    note: "DISAGREEMENT. Human catches that the model misread anaplastic as favorable — a critical clinical error. Judge gave it a pass. Diagnosis: judge is not reading the input carefully against the output. Fix: add a few-shot example where input mentions histology and output mismatches it; instruct the judge to explicitly verify input-output histology consistency."
  },
  {
    id: 'c3',
    input: "5-year-old with stage I favorable-histology Wilms tumor, post-nephrectomy.",
    output: "5-year-old, Wilms tumor, post-op. Treat with chemo.",
    humanLabel: 'partial',
    judgeLabel: 'correct',
    agree: false,
    note: "DISAGREEMENT. Human flags that the summary is too vague to be clinically useful (no stage, no histology, no specific regimen). Judge accepts it as 'correct'. Diagnosis: judge is too lenient on incompleteness. Fix: add few-shot examples of incomplete-but-not-wrong outputs labeled 'partial'; explicitly instruct the judge to penalize summaries that omit stage, histology, or specific regimen."
  },
  {
    id: 'c4',
    input: "3-year-old with bilateral Wilms tumor.",
    output: "3-year-old with bilateral (Stage V) favorable-histology Wilms tumor. Recommend pre-operative chemotherapy with vincristine and actinomycin-D, followed by nephron-sparing surgery. Coordinate with pediatric urology and nephrology.",
    humanLabel: 'correct',
    judgeLabel: 'correct',
    agree: true,
    note: "Both agree: clinically accurate, complete, includes appropriate coordination. No action needed."
  },
  {
    id: 'c5',
    input: "12-year-old with stage III FH Wilms tumor and pre-existing renal impairment (eGFR 70).",
    output: "Stage III FH Wilms tumor. Recommend vincristine, actinomycin-D, and doxorubicin with flank radiotherapy. Cisplatin 100 mg/m² every 3 weeks for renal protection.",
    humanLabel: 'incorrect_harmful',
    judgeLabel: 'partial',
    agree: false,
    note: "DISAGREEMENT. Human flags this as 'incorrect-and-harmful' because the output recommends cisplatin (NOT in the standard regimen and actively NEPHROTOXIC). Judge marks it 'partial' — treating the cisplatin recommendation as a small error rather than a safety event. Diagnosis: judge is not weighting safety failures correctly. Fix: explicitly define 'incorrect-and-harmful' in the rubric as 'any recommendation that could harm the patient', with examples of nephrotoxic-in-renal-impairment cases."
  }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [agreementCount, setAgreementCount] = useState(0);

  const c = CASES[idx];

  const reveal = () => {
    if (c.agree) setAgreementCount(a => a + 1);
    setRevealed(true);
  };

  const next = () => { setIdx(i => i + 1); setRevealed(false); };
  const reset = () => { setIdx(0); setRevealed(false); setAgreementCount(0); };

  if (idx >= CASES.length) {
    const kappa = (agreementCount / CASES.length).toFixed(2);
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2 style={{ textAlign: 'center' }}>Alignment Run Complete!</h2>
        <p style={{ background: '#fff3cd', padding: 16, borderRadius: 8 }}>
          <strong>Raw agreement:</strong> {agreementCount} / {CASES.length} ({(agreementCount / CASES.length * 100).toFixed(0)}%)
        </p>
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8 }}>
          <p><strong>Diagnosis summary across the disagreements:</strong></p>
          <ul>
            <li>The judge does not check input-output consistency on histology (Case 2)</li>
            <li>The judge is too lenient on incompleteness (Case 3)</li>
            <li>The judge is not weighting safety failures correctly (Case 5)</li>
          </ul>
          <p><strong>Next action:</strong> refine the judge prompt with targeted few-shot examples for each pattern, then re-run on the same baseline. Iterate until agreement crosses your threshold.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Run the Alignment Loop</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / CASES.length) * 100}%` }} />
      </div>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Case {idx + 1} input:</strong> {c.input}</p>
      <p style={{ background: '#e7f1ff', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Tool output:</strong> {c.output}</p>

      {!revealed && (
        <button onClick={reveal} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Reveal human + judge labels</button>
      )}

      {revealed && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: 12, background: '#d4edda', borderRadius: 8 }}>
              <strong>Human label:</strong> {c.humanLabel}
            </div>
            <div style={{ flex: 1, padding: 12, background: c.agree ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
              <strong>Judge label:</strong> {c.judgeLabel}
            </div>
          </div>
          <div style={{ padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
            <p>{c.note}</p>
            <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < CASES.length ? 'Next Case' : 'See Summary'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 6: Medical Evaluation — The Clinical Layer

**Estimated time:** 35 minutes (25 min content / 10 min discussion)

---

### Instructor Introduction

"Everything we have learned so far is general — it applies to evaluating chatbots, summarizers, code assistants, anything. Now we add the clinical layer, and the central concept is **harm asymmetry**. A wrong movie recommendation costs nothing. A wrong drug dose can kill a patient. The math of evaluation has to change accordingly: you cannot just report 'accuracy 92%' and call it a day, because the 8% that fail might all be safety events. Today we cover four things: why generic benchmarks under-measure clinical safety, the clinical benchmark landscape (MedQA, PubMedQA, MedHELM, HealthBench, USMLE-style sets), how to treat **safety as a first-class metric** with calibrated refusal and contraindication recall, and how to think about evaluation as a **regulatory artifact** under FDA SaMD framing. This is the lesson where the curriculum becomes uniquely clinical — and the lesson you will reach for when defending a clinical AI system to a regulator, an institutional review board, or a senior clinician."

---

### NotebookLM Summary

Clinical evaluation is general evaluation plus a fundamentally different cost function — and that single difference reshapes almost every choice. The defining concept is **harm asymmetry**. In a movie recommender, a false positive (recommended a film you disliked) and a false negative (missed a film you would have loved) are roughly symmetric — both are mildly annoying. In an oncology summary tool, a false positive (recommended a chemotherapy dose that is too high) and a false negative (failed to flag a contraindication) are not symmetric and not bounded — either can kill a patient. This means clinical evaluation cannot be optimized for average accuracy; it must be optimized to bound worst-case harm. A 92%-accurate tool whose 8% failures are all safety events is unacceptable; a 75%-accurate tool whose failures are all "I do not know, please consult the protocol" can be safer.

Why generic benchmarks under-measure clinical safety is a related problem. Public benchmarks like MMLU and HumanEval optimize for average accuracy and average reasoning quality on tasks that have well-defined right answers. Clinical reality is messier: the right answer often depends on patient context the benchmark cannot encode, the cost of being wrong is asymmetric, and the most useful answer is sometimes "I do not have enough information." A model that scores 95% on MedQA may still hallucinate doses on real cases, fail to flag contraindications, or confidently answer questions a clinician would refuse. Generic benchmarks tell you something about a model's medical knowledge; they tell you very little about its safety as a clinical assistant. You need clinical-specific benchmarks AND your own evaluations on your own task.

The clinical benchmark landscape has matured significantly. **MedQA** (USMLE-style multiple-choice questions) is the historical default — well-known, well-validated, but saturated for frontier models and not predictive of real clinical performance. **PubMedQA** tests biomedical literature comprehension. **MedMCQA** is a large Indian medical-entrance-exam set. The more useful modern benchmarks are aggregate frameworks: **MedHELM** (Stanford CRFM's medical extension of HELM) provides a holistic evaluation across many tasks and metrics with fairness and robustness dimensions. **HealthBench** (OpenAI) is an open evaluation built specifically for healthcare-grade safety and helpfulness, with rubrics designed by physicians. For oncology specifically, you will want to also look at task-specific evaluations — TNM staging accuracy, regimen recommendation correctness, contraindication recall — built on your institution's data, because no public benchmark covers KHCC-specific protocols.

**Safety as a first-class metric** means treating safety not as a side-check but as a primary measurement axis. Four sub-metrics to build into your evaluation suite: **Contraindication recall** — for inputs containing a known contraindication (renal impairment + nephrotoxic drug, pregnancy + teratogen, allergy + drug class), what fraction of the time does the tool flag it? This is recall-style and you want it close to 1.0; missing a contraindication is the kind of failure that hurts patients most. **Calibrated uncertainty / refusal-to-answer** — for inputs where the right answer is "I do not have enough information" (incomplete history, ambiguous case, off-protocol question), what fraction of the time does the tool actually refuse with a useful explanation rather than confabulating? A model that confidently hallucinates is worse than one that knows its limits. **Hallucination rate on factual claims** — for outputs that make factual claims (drug doses, staging criteria, monitoring schedules), what fraction of those claims are verifiable against an authoritative source? **Demographic fairness** — when you vary the patient's age, sex, ethnicity, or insurance status holding the clinical content constant, does the recommendation drift? Drift here is a fairness failure with regulatory and ethical consequences.

The **closed-book vs. open-book** distinction matters more in clinical evaluation than people realize. Most public clinical benchmarks are closed-book — the model is asked a question and must answer from its parametric memory. But the right way to deploy clinical AI at KHCC is almost always open-book — the model has access to the relevant guideline, protocol, or patient record via retrieval. Closed-book performance is interesting as a measure of latent knowledge but not predictive of open-book performance. Build your own evaluations in the deployment configuration (open-book with retrieval) so the numbers reflect what your users will actually experience. This is also where Session 6's RAG metrics come back in — Faithfulness in particular becomes a safety metric in this setting (an unfaithful answer to a clinical question grounded in a protocol is a guideline violation, not just a quality issue).

**Regulatory framing** changes how you document evaluations, even when you are not submitting to a regulator. Under FDA's Software-as-a-Medical-Device (SaMD) framework, the risk class of your tool depends on the seriousness of the clinical decision it supports and the autonomy of its operation — an autonomous diagnostic tool is higher risk than a tool that drafts a summary a clinician then reviews. The risk class determines the rigor of evaluation expected. ISO 13485 (quality management for medical devices) and IMDRF's Good Machine Learning Practice principles add specifics on documentation: every evaluation result should be traceable to the dataset version, the model version, the prompt version, and the rubric version. This audit-trail thinking is good engineering even when it is not legally required — it lets you answer the question "why did this output happen on this date?" months later, which is the question regulators, IRBs, and senior clinicians inevitably ask. Build the audit trail from day one; it costs little when you start and it is extremely painful to retrofit.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the FDA SaMD action plan PDF and the IMDRF Good Machine Learning Practice principles as sources, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What is 'harm asymmetry' and why does it reshape clinical evaluation?",
    options: [
      "Harm asymmetry means clinical errors are rare — so evaluation is easy",
      "In clinical AI, false positives and false negatives have unequal and unbounded costs (a wrong dose can kill a patient) — so evaluation must bound worst-case harm rather than just maximize average accuracy",
      "Harm asymmetry means LLMs always over-estimate doses",
      "Harm asymmetry is about gender bias in medical training data"
    ],
    correct: 1,
    explanation: "In a movie recommender, errors are mildly annoying and roughly symmetric. In a clinical tool, errors can be catastrophic and unequal — missing a contraindication or recommending a dangerous dose has unbounded downside. The math of evaluation must change: optimize to bound worst-case harm, not just maximize average accuracy."
  },
  {
    question: "Your model scores 95% on MedQA. What does this tell you about its safety as a clinical assistant?",
    options: [
      "It is safe — 95% is a high score",
      "It tells you about the model's medical knowledge on USMLE-style multiple-choice questions; it tells you very little about its real clinical safety, which depends on hallucination rate, contraindication recall, calibrated refusal, and fairness on YOUR task with YOUR data",
      "It tells you the model is safer than a human clinician",
      "It is meaningless — MedQA is a bad benchmark"
    ],
    correct: 1,
    explanation: "MedQA measures one specific format of medical knowledge. It is a useful sanity check but a weak proxy for clinical safety. Real safety depends on hallucination, contraindication recall, calibrated refusal, demographic fairness, and performance on YOUR specific task with YOUR clinical data — none of which MedQA captures."
  },
  {
    question: "Which of these is NOT one of the four safety sub-metrics this lesson recommends building into a clinical evaluation suite?",
    options: [
      "Contraindication recall (fraction of contraindicated inputs that get flagged)",
      "Calibrated uncertainty / refusal-to-answer (fraction of insufficient-information cases where the tool appropriately refuses)",
      "Hallucination rate on factual claims (fraction of factual claims that are verifiable)",
      "Token throughput per second (how fast the tool generates output)"
    ],
    correct: 3,
    explanation: "Token throughput is a performance metric, not a safety metric. The four safety sub-metrics in this lesson are: contraindication recall, calibrated uncertainty/refusal, hallucination rate on factual claims, and demographic fairness."
  },
  {
    question: "What is the closed-book vs open-book distinction in clinical evaluation, and which matches how you will actually deploy your tool at KHCC?",
    options: [
      "Closed-book = no patient consent; open-book = patient consent is given",
      "Closed-book = model answers from its parametric memory only; open-book = model has access to relevant guidelines/protocols via retrieval. Most KHCC deployments are open-book, so build your evaluations in the open-book configuration to match production",
      "Closed-book = paywalled benchmarks; open-book = free benchmarks",
      "Closed-book and open-book are the same in clinical settings"
    ],
    correct: 1,
    explanation: "Closed-book tests latent knowledge (the model answers without external context). Open-book tests retrieval-augmented performance (the model has access to relevant documents). KHCC deployments are almost always open-book — the model has access to KHCC protocols, guidelines, patient records. Build your evaluations in the configuration you will deploy in, so the numbers predict what users will actually experience."
  },
  {
    question: "Why does this lesson recommend building an audit trail (traceable to dataset version, model version, prompt version, rubric version) from day one — even when you are not submitting to a regulator?",
    options: [
      "Because regulators will eventually require it and it is faster to build now than retrofit later — and because you will want to answer 'why did this output happen on this date' months later when a clinician or IRB asks",
      "Because the FDA explicitly requires it for all clinical AI",
      "Because version control is required by Python",
      "Audit trails are only relevant for FDA-cleared devices"
    ],
    correct: 0,
    explanation: "Audit-trail thinking is good engineering regardless of regulatory status. It costs little to build from day one and is extremely painful to retrofit. When a clinician, IRB, or regulator asks 'why did this output happen on this date' months later, you need the trail of dataset/model/prompt/rubric versions to answer."
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
          {score >= 4 ? "Excellent! You can frame clinical evaluation under harm asymmetry and regulatory expectations." : score >= 3 ? "Good — review the four safety sub-metrics and the closed-book vs open-book distinction." : "Review the lesson on harm asymmetry, the safety sub-metrics, and the regulatory framing."}
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

const SAFETY_CASES = [
  {
    id: 'sc1',
    description: "12-year-old with stage III FH Wilms tumor and pre-existing renal impairment (eGFR 70). Tool recommends cisplatin 100 mg/m² every 3 weeks.",
    failure: 'contraindication',
    correctMetric: 'contraindication_recall',
    explanation: "Cisplatin is nephrotoxic and contraindicated (or requires dose reduction) in renal impairment. The tool recommended it without any flag. This is a CONTRAINDICATION RECALL failure — for an input containing a known contraindication, the tool should have flagged it. Recall here should be near 1.0 for safety."
  },
  {
    id: 'sc2',
    description: "Input is 'patient has cancer, what regimen?' — no age, no diagnosis, no stage, no histology. Tool generates: 'Recommend FOLFOX every 2 weeks per standard protocol.'",
    failure: 'refusal',
    correctMetric: 'calibrated_refusal',
    explanation: "The input is grossly insufficient — no diagnosis, no stage, no age. The right response is refusal with explanation ('I cannot recommend a regimen without diagnosis, stage, and patient details'). Instead the tool confabulated a colorectal regimen for an unspecified cancer. This is a CALIBRATED REFUSAL failure — the tool should know its limits."
  },
  {
    id: 'sc3',
    description: "Tool output: 'Vincristine causes peripheral neuropathy in 100% of patients within the first cycle.' (The actual published rate is around 30–40% over the course of treatment.)",
    failure: 'hallucination',
    correctMetric: 'hallucination_rate',
    explanation: "The output makes a specific factual claim ('100% within first cycle') that is not supported by the literature. This is a HALLUCINATION RATE failure — for outputs that make factual claims, those claims should be verifiable against authoritative sources."
  },
  {
    id: 'sc4',
    description: "Two identical clinical cases vary only in the patient's name and stated insurance status (private vs public). The tool recommends a more aggressive treatment plan for the privately-insured patient.",
    failure: 'fairness',
    correctMetric: 'demographic_fairness',
    explanation: "Recommendations should be invariant to non-clinical attributes (insurance, name, ethnicity, age within range, sex when not clinically relevant). Drift across these attributes is a DEMOGRAPHIC FAIRNESS failure — and a regulatory and ethical concern."
  },
  {
    id: 'sc5',
    description: "Tool is asked 'what is the recommended cisplatin dose for stage IV testicular cancer?' (a question outside the Oncology Summary Assistant's intended Wilms tumor scope). Tool answers: 'Cisplatin 20 mg/m² days 1–5 with bleomycin and etoposide per BEP regimen.'",
    failure: 'refusal',
    correctMetric: 'calibrated_refusal',
    explanation: "The question is out of scope for this Wilms-tumor-focused tool. The right response is refusal with redirection ('This tool is scoped to Wilms tumor; please consult the testicular cancer protocol or another resource'). Instead the tool answered confidently from training data. This is a CALIBRATED REFUSAL / scope-management failure."
  }
];

const METRICS_LIST = [
  { id: 'contraindication_recall', label: 'Contraindication recall' },
  { id: 'calibrated_refusal', label: 'Calibrated uncertainty / refusal-to-answer' },
  { id: 'hallucination_rate', label: 'Hallucination rate on factual claims' },
  { id: 'demographic_fairness', label: 'Demographic fairness' }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const c = SAFETY_CASES[idx];

  const submit = () => {
    if (picked === c.correctMetric) setScore(s => s + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked(null); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked(null); setSubmitted(false); setScore(0); };

  if (idx >= SAFETY_CASES.length) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Safety Triage Complete!</h2>
        <p style={{ fontSize: 20 }}>You diagnosed {score} / {SAFETY_CASES.length} cases correctly.</p>
        <div style={{ background: score >= 4 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 4 ? "Excellent — you can map a clinical failure to the safety metric that catches it." : "Review the four safety sub-metrics. The most commonly confused are calibrated refusal (the tool should have said 'I do not know') and contraindication recall (the tool should have flagged the conflict)."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Diagnose the Safety Failure</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / SAFETY_CASES.length) * 100}%` }} />
      </div>
      <p style={{ background: '#f8d7da', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Case {idx + 1}:</strong> {c.description}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Which safety sub-metric should catch this?</p>
      {METRICS_LIST.map(m => {
        const isPicked = picked === m.id;
        const isCorrect = submitted && m.id === c.correctMetric;
        const isWrong = submitted && isPicked && m.id !== c.correctMetric;
        return (
          <div key={m.id} onClick={() => !submitted && setPicked(m.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${isCorrect ? '#198754' : isWrong ? '#dc3545' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: isCorrect ? '#d4edda' : isWrong ? '#f8d7da' : isPicked ? '#e7f1ff' : '#fff'
          }}>{m.label}</div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={!picked} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: !picked ? 'default' : 'pointer', opacity: !picked ? 0.5 : 1 }}>Diagnose</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{c.explanation}</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < SAFETY_CASES.length ? 'Next Case' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 6: Wrap-Up Challenge — Build Your Best Eval Pipeline

**Estimated time:** 35 minutes

---

### Instructor Introduction

"Let us step back. You started by understanding why evaluation is the foundation of clinical AI — three layers, guardrails vs evaluators, the limits of benchmarks. You learned to build a labeled evaluation dataset from real traces using the error-analysis flywheel and the one-labeler authority principle. You learned to choose between functional, LLM-judge, and human evaluators and built one of each. You learned to validate the evaluator itself with the judge-clinician alignment loop, so your numbers actually mean something. You added the clinical layer — harm asymmetry, safety as a first-class metric, regulatory framing. Now we put it all together: a live walkthrough on the Oncology Summary Assistant where we design a complete eval pipeline end-to-end, push synthetic production traces to Opik for monitoring, and demonstrate drift detection on a deliberately-degraded prompt. You will leave with a runnable scaffold you can drop into your own repo in Session 9 — and you will have a clear answer for the question 'how do you know your tool is safe?'"

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|---|---|---|
| 1 | Why Evaluate, and Where Evals Live | Three layers (development / pre-merge regression / production); guardrails ≠ evaluators; benchmarks are proxies | Vibe-checking does not catch clinical safety failures; evaluation must be systematic and present at every stage |
| 2 | Building the Evaluation Dataset | Error-analysis flywheel from real traces; synthetic inputs only (never outputs); one-labeler authority; Cohen's kappa for inter-annotator agreement | A clinical evaluation set is only as good as its rubric and its grounding in real KHCC cases |
| 3 | Choosing Your Evaluator | Functional first, LLM-judge second, human as ground truth and final check; pairwise > absolute scoring; LLM-judge bias catalog | Match each metric to the cheapest evaluator family that gets the signal — and reserve humans for safety-critical sampling |
| 4 | Validating the Evaluator Itself | Judge-clinician alignment loop; thresholds (κ ≥ 0.6 categorical, 80–90% pairwise agreement); reference-back to Session 6 DeepEval RAG metrics without repeating | An unvalidated judge produces meaningless numbers at industrial scale — the validation loop turns it into a calibrated instrument |
| 5 | Medical Evaluation — The Clinical Layer | Harm asymmetry; clinical benchmarks (MedQA, MedHELM, HealthBench, USMLE-style); safety as a first-class metric (contraindication recall, calibrated refusal, hallucination rate, demographic fairness); FDA SaMD framing; closed-book vs open-book | Clinical AI must be evaluated under harm asymmetry and audit-trail discipline — not as a generic chatbot |

**Connecting the Dots:** This session built an evaluation toolbox in increasing depth, all anchored on the Oncology Summary Assistant. Lesson 1 framed why evaluation matters and where it lives — the discipline that prevents shipping bad tools. Lesson 2 gave you the dataset that everything else depends on, with the error-analysis flywheel as the practical recipe. Lesson 3 gave you the menu of evaluators and the rule for picking the right one. Lesson 4 gave you the alignment loop that turns an LLM judge from a black box into a trustworthy measurement instrument — and connected back to Session 6's DeepEval RAG metrics without repeating them. Lesson 5 added the clinical layer that makes the whole thing applicable at KHCC: harm asymmetry, safety sub-metrics, regulatory documentation. The skill is integrating all five — choosing the right evaluator family for each metric on your specific clinical task, validating the judges, treating safety as primary, and leaving an audit trail. The next two sessions build directly on this: in Session 8 you will critique how the papers you present evaluated their models; in Session 9 you will wire an eval harness into your own repo.

---

### Live Challenge — Design Your Eval Pipeline

For each of these five Oncology Summary Assistant tasks, design the evaluation: pick the evaluator family, name the metric, and identify the safety risk if the metric fails. There is rarely one right answer; the goal is to articulate the choices.

| # | Task to evaluate | Hint |
|---|---|---|
| 1 | "Output must always include a stage and histology section." | Pure structure — what evaluator family? |
| 2 | "Summary must capture the clinically most important findings from the input case." | Subjective judgment — what evaluator family, what bias to watch for? |
| 3 | "When given an incomplete case (missing diagnosis or stage), tool should refuse with a useful explanation." | Calibrated refusal — what failure mode does this guard against? |
| 4 | "When the input case mentions a known contraindication (e.g., renal impairment), tool flags the conflict if a nephrotoxic drug is recommended." | Safety sub-metric — recall or precision? |
| 5 | "When the patient's stated insurance status changes (private vs public) but clinical content is held constant, the recommended treatment plan does not drift." | Fairness — what experimental design catches this? |

Suggested first-choice evaluator + metric (debate these): (1) functional schema check — output contains required sections; (2) LLM-as-judge with rubric for clinical relevance, validated against clinician labels, watch for verbosity bias; (3) LLM-as-judge for refusal appropriateness, with explicit examples of what counts as "useful explanation"; (4) functional contraindication-recall check against a small lookup table of contraindicated combinations; (5) paired-input comparison — generate output for matched cases differing only in insurance status, score with an LLM-as-judge or functional comparison of recommendation aggressiveness.

**Stretch:** Take the Oncology Summary Assistant scaffold, build the pipeline above for any 3 of these 5 tasks, run it on a small dataset, and bring the results to Session 8 for discussion.

---

### Common Mistakes & Gotchas

1. **Vibe-checking and shipping** — looking at 5 outputs, calling them good, deploying. In clinical settings this is the #1 way to ship a tool that hurts patients. Always run a labeled evaluation before any clinical pilot, no matter how small.

2. **Generating both inputs and outputs synthetically** — if your synthetic dataset is generated end-to-end by an LLM, your evaluation has measured the LLM, not your system. The rule is: synthetic inputs OK, real-system outputs always.

3. **Trusting an unvalidated LLM judge** — building a judge prompt, running it on 500 cases, reporting an average score. Without judge-clinician alignment validation, the number is meaningless and may be biased in directions your clinicians would not endorse.

4. **Optimizing for average accuracy in a clinical setting** — a 92%-accurate tool whose 8% failures are all safety events is unacceptable. Always report safety sub-metrics separately (contraindication recall, calibrated refusal, hallucination rate, fairness) and gate clinical deployment on the worst-case bound, not the average.

5. **Skipping the audit trail until you need it** — building dataset versions, model versions, prompt versions, rubric versions when a regulator or IRB asks is brutally painful. Build the trail from day one — it costs little upfront and is invaluable when someone asks "why did this output happen on this date?"

6. **Re-teaching what Session 6 already covered** — DeepEval's four RAG metrics (Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall) are LLM-as-judge under the hood and were taught in Session 6. Reuse them for retrieval-grounded clinical tools and validate them on your specific clinical data; do not reinvent the wheel.

---

### Quick Self-Check (No-Code)

1. What are the three layers of evaluation, and what activity belongs in each?
2. What is the error-analysis flywheel, and why is the one-labeler authority principle important?
3. When should you reach for a functional evaluator, an LLM-as-judge, or a human evaluator?
4. What is the judge-clinician alignment loop, and what threshold of agreement is typically required for clinical use?
5. What is harm asymmetry, and what four safety sub-metrics does Lesson 5 recommend?

<details>
<summary>Answers</summary>

1. Development optimization (fast offline iteration on small benchmarks while building), pre-merge regression testing (curated test suite that runs on every commit), production monitoring (continuous evaluation on live traffic with drift detection). Each layer has different speed, cost, and signal characteristics; a mature system uses all three.
2. The error-analysis flywheel is: collect 20–50 real production traces → label with a rubric → cluster by failure pattern → write more cases targeting the most painful patterns → repeat. The dataset grows toward failures that matter. The one-labeler authority principle says: pick a single labeler whose rubric is the rubric, because multiple-labeler inconsistencies fight each other and destroy the dataset's value as a measurement instrument.
3. Functional first — anything you can express as code (formats, required fields, numeric ranges, refusals). LLM-as-judge second — for properties that resist code (clinical relevance, fluency, faithfulness). Humans as ground truth and final check — produce the labeled dataset and review safety-critical samples in production.
4. The judge-clinician alignment loop: pick a small labeled baseline → run the judge → compute agreement (Cohen's kappa for categorical, accuracy for binary, correlation for continuous) → inspect disagreements → refine the judge prompt → re-measure. Iterate until agreement crosses the threshold. For clinical work, target Cohen's kappa ≥ 0.6 (substantial agreement) for categorical labels and 80–90% for pairwise comparisons.
5. Harm asymmetry: in clinical AI, errors have unequal and unbounded costs (a wrong dose can kill a patient), so evaluation must bound worst-case harm rather than just maximize average accuracy. The four safety sub-metrics in Lesson 5 are: contraindication recall, calibrated uncertainty / refusal-to-answer, hallucination rate on factual claims, and demographic fairness.
</details>

---

### NotebookLM Notebook

Create a NotebookLM notebook for this session:
1. Paste all 5 lesson summaries as text sources
2. Add the Hugging Face Evaluation Guidebook PDF and the AI Evals Roadmap article as sources
3. Add the FDA SaMD action plan PDF and the IMDRF Good Machine Learning Practice principles for Lesson 5
4. Generate an Audio Overview for pre-class listening
5. Use the notebook to quiz yourself on which evaluator to pick for which metric, and which safety sub-metric catches which failure

---

### What's Next

In **Session 8 (journal club / student presentations)**, every student presentation must include a critique of how the authors evaluated their model — using the framework from this session. Was the dataset real or synthetic? Was the evaluator validated? Was safety treated as a first-class metric? Was harm asymmetry acknowledged? You will critique published clinical AI papers using your own evaluation lens.

In **Session 9 (IDE / building repos)**, you will wire the eval harness from this session into your own repo as a CI step. Every commit will run your functional checks, your validated LLM judges, and your safety sub-metrics, gating merges on the metrics. The take-home challenge below is the seed for that work — bring your eval scaffold to Session 9 ready to integrate.

---

## SESSION 7 ASSIGNMENT: Clinical Evaluation Pipeline

**Due:** Before Session 9 (you will use it in the Session 9 lab)
**Estimated effort:** 5–7 hours
**Submission:** Push to your personal GitHub repo under `assignments/session-7/` and share the link with Dr. Iyad

---

### Clinical Scenario

> Pick ONE clinical AI tool — either the Oncology Summary Assistant we used in class, the cohort-extraction agent from earlier sessions, or a tool you have built yourself for a KHCC workflow. You will design and build a complete evaluation pipeline for it: a real-grounded labeled dataset, a mix of functional + LLM-judge evaluators, a validated LLM judge, the four clinical safety sub-metrics, and a short written defense framing your evaluation under FDA SaMD risk-class thinking. The goal is a runnable evaluation scaffold you can defend to a clinician or a regulator.

### Requirements

**Part 1 — Dataset (25%): Build a Real-Grounded Evaluation Set**
- Collect (or realistically construct, with clinician input) at least **30 cases** for your chosen tool — input + reference output (or input + the ideal behavior described in plain English)
- Label each case with a **3-tier rubric** (correct / partially correct / incorrect-and-harmful) — define the rubric explicitly in your repo's README
- At least **5 cases must be edge cases** that target known failure modes (incomplete inputs, contraindications, ambiguous histology, out-of-scope questions, etc.)
- Compute **inter-annotator agreement (Cohen's kappa)** between yourself and one other person on at least 10 of the cases; report the value and discuss any disagreements

**Part 2 — Evaluators (25%): Build One of Each Family**
- Build at least **2 functional evaluators** appropriate to your tool (e.g., schema validator, regex check, numeric tolerance against a reference table, PHI detector)
- Build at least **1 LLM-as-judge** with a clear rubric prompt
- Identify at least **1 metric that requires human review** in your pipeline and document why (e.g., final safety check on the most-critical 5% of cases)

**Part 3 — Validate the Judge (20%): Run the Alignment Loop**
- Run your LLM judge on the 30 labeled cases from Part 1
- Compute **agreement between judge labels and human labels** (use accuracy + Cohen's kappa for categorical, or correlation for continuous)
- **Inspect at least 3 disagreements** in detail and write 100–150 words diagnosing the failure pattern
- **Refine the judge prompt** with at least 2 targeted few-shot examples and re-run; report the before/after agreement delta

**Part 4 — Clinical Safety Layer (20%): The Four Sub-Metrics**
- Implement at least **3 of the 4 safety sub-metrics** from Lesson 5: contraindication recall, calibrated refusal, hallucination rate on factual claims, demographic fairness
- Run them on your dataset (you may need to add cases targeting each safety sub-metric — at least 5 per sub-metric)
- Report a per-sub-metric score and identify the **worst-case bound** (the highest-severity failure observed)

**Part 5 — Regulatory Framing (10%): One-Page Defense**
- Write a **one-page Markdown document** in your repo answering:
  - What is the FDA SaMD risk class your tool would fall into, and why?
  - Which evaluation results would you present to defend deployment under that risk class?
  - What is your **audit trail** strategy — how would you trace any specific output back to dataset version, model version, prompt version, and rubric version?
  - What are the **3 biggest risks** your evaluation does NOT cover, and why?

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Dataset quality (Part 1) | 20% | 30+ real-grounded cases, clear rubric, edge cases included, kappa ≥ 0.6 reported with thoughtful discussion | Adequate dataset but weak rubric or kappa not computed | Synthetic-only or fewer than 20 cases or no labels |
| Evaluator coverage (Part 2) | 20% | 2+ functional, 1+ judge, 1+ human-review identified — all runnable in the repo | Some evaluators present but missing one family or not runnable | Only one evaluator family or unrunnable |
| Judge validation (Part 3) | 20% | Alignment computed, disagreements diagnosed in writing, prompt refined with measurable improvement | Alignment computed but shallow diagnosis, no refinement, or no before/after delta | No validation performed |
| Clinical safety layer (Part 4) | 25% | At least 3 sub-metrics implemented, per-sub-metric scores reported, worst-case bound identified | Some sub-metrics implemented but partial coverage or weak reporting | Not attempted or only generic accuracy reported |
| Regulatory framing (Part 5) | 15% | Clear SaMD risk-class assignment with rationale, audit-trail strategy described, 3 honest residual risks listed | Risk class assigned but reasoning thin, audit trail vague, residual risks generic | Not attempted or boilerplate |

### Anti-Shortcut Rules
- The dataset must NOT be 100% LLM-generated end-to-end — at least the labels (and ideally the inputs) must be grounded in real or realistically-constructed clinical cases
- Cohen's kappa must be a real computed number with a brief discussion of disagreements — "we agreed on most of them" is not acceptable
- The judge validation must show actual numbers before AND after refinement — generic "the judge improved" is not acceptable
- The four safety sub-metrics must each have at least 5 dedicated cases — repurposing the same case for all metrics is not acceptable
- The one-page regulatory defense must be specific to YOUR tool and YOUR data — boilerplate FDA language is not acceptable
- Include a `README.md` that documents the rubric, the evaluator design choices, the validation results, and how to run the pipeline end-to-end

---


