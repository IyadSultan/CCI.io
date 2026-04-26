# CCI Session 6: RAG & Clinical Document Retrieval
## Curriculum — 5 Lessons + Wrap-Up Challenge

**Audience:** Completed Sessions 1-5 (prompt engineering, Python, OpenAI API, HuggingFace, LangChain/LangGraph). First time doing RAG.
**Clinical Anchor:** National Wilms Tumor treatment guidelines — query a complex pediatric oncology PDF
**Session Duration:** 2.5 hours
**Lab Mode:** Guided step-by-step (Google Colab)
**Content/Practice Split:** 50/50
**Environment:** Google Colab notebooks (LlamaParse API key required for Lessons 1-5)

---

## LESSON 1 OF 6: Basic RAG with LlamaParse — Parse, Chunk, Embed, Retrieve

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Until now we've fed text directly to LLMs. We pasted lab reports, drug names, patient summaries — small things that fit in the prompt. But what if the knowledge lives in a 200-page PDF with figures, tables, and complex layouts? Like KHCC's pediatric Wilms tumor treatment guidelines. You cannot stuff 200 pages into every prompt — you would blow past the context window, pay enormous token costs, and the model would still struggle to find the right passage. RAG — Retrieval Augmented Generation — solves this. The idea is simple: index the document once, retrieve only the relevant chunks per query, and let the LLM answer over those chunks. Today we parse a real clinical PDF with LlamaParse, chunk it intelligently, embed it, store it in a vector database, and let an LLM answer questions over it. By the end of the lesson, you will have a working RAG pipeline on the National Wilms Tumor guidelines."

---

### NotebookLM Summary

Retrieval-Augmented Generation (RAG) is the standard pattern for letting an LLM answer questions over documents that are too large, too current, or too specialized to fit in its training data or its context window. The motivation comes from four real constraints: context windows are finite (even 200K tokens cannot hold every clinical guideline at KHCC), training data is frozen at a cutoff date (the model does not know last week's protocol update), hallucinations are unacceptable in clinical settings (you need grounded answers with citations), and you want freshness without retraining (just re-index when the document changes). RAG addresses all four.

The standard RAG pipeline has five stages. First, **loaders** pull raw content from a source — a PDF, a webpage, a database. Second, **splitters** break that content into chunks small enough to embed and retrieve usefully. Third, **embedding models** turn each chunk into a dense vector that captures its meaning. Fourth, **vector stores** index those vectors so you can search by similarity. Fifth, **retrievers** wrap the vector store with a query interface — given a user question, return the top-k most relevant chunks. The LLM then sees the question plus the retrieved chunks and generates an answer.

Why simple PDF parsers fail on clinical documents matters here. The Wilms tumor guidelines have multi-column layouts, embedded tables of dose schedules, figures with staging diagrams, and footnotes referencing other sections. A naive PyPDF extractor produces garbled text where columns interleave, tables collapse into unreadable rows, and figure captions float free of their figures. **LlamaParse** is a parsing service designed for exactly this — it uses layout-aware models to preserve structure, tables become Markdown tables you can embed, and figures get described rather than dropped.

Chunking strategy matters more than most students expect. **Fixed-size chunking** (e.g., 500 tokens with 50-token overlap) is the default and works surprisingly well. **Semantic chunking** splits at natural boundaries — paragraphs, headings, sections — so a chunk corresponds to a coherent unit of meaning. **Hierarchical chunking** stores chunks at multiple granularities (section, paragraph, sentence) and retrieves the right level for the query. For clinical guidelines with clear section structure, semantic chunking aligned to headings usually wins.

Embedding models trade quality for cost and latency. OpenAI's `text-embedding-3-small` is cheap, fast, and a strong general-purpose default. For specialized clinical text, biomedical embedding models from HuggingFace (like BioBERT-derived embeddings) can outperform on domain queries. The vector store — we use **ChromaDB** for teaching because it runs in-memory in Colab — stores the (chunk, vector) pairs and supports k-nearest-neighbor search. The **retriever** is the queryable wrapper: `retriever.invoke("dose for stage III")` returns the top-k chunks. The full pipeline: parse with LlamaParse → split into chunks → embed with OpenAI → store in Chroma → wrap as retriever → feed into an LLM with a prompt template that injects the chunks.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
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
```

---

## LESSON 2 OF 6: RAG Evaluation with DeepEval

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"RAG is easy to build poorly. The model gives a confident, fluent answer based on the wrong chunks — and unless you measure it, you will not know. In a clinical setting, that is not just embarrassing; it is dangerous. A confident wrong answer about a chemotherapy dose is a patient safety event. Today we learn to *measure* RAG quality with DeepEval. Four metrics: faithfulness (does the answer actually stick to the retrieved context, or did the model make things up?), answer relevance (does the answer address the question?), context relevance (are the retrieved chunks even relevant?), and context recall (did we retrieve all the relevant information, or did we miss things?). By the end of the lesson, you will know how to score your own RAG and where it fails."

---

### NotebookLM Summary

RAG evaluation is the discipline of measuring whether your pipeline actually works. Without evaluation you are flying blind — every change to chunking, embedding, or prompting is a guess. DeepEval is an open-source framework that gives you reproducible scores on the four core RAG metrics, using LLM-as-judge under the hood. The judge model reads the question, the retrieved chunks, the generated answer, and (for some metrics) a ground-truth answer, and produces a score between 0 and 1.

The four core metrics each catch a different failure mode. **Faithfulness** asks: does every claim in the answer appear in the retrieved context? A faithfulness score of 0.6 means roughly 40% of the claims were not supported by the retrieved chunks — those are hallucinations. In clinical contexts, this is the most important metric. The answer might sound right and even be right by coincidence, but if it is not grounded in the retrieved guideline, you cannot trust it. **Answer relevance** asks: does the answer actually address the user's question, or does it ramble into related topics? A long answer that never directly answers "what is the cisplatin dose" scores low.

**Context relevance** is the first generation-independent metric. It asks: of the chunks the retriever returned, how many are actually relevant to the question? If you retrieved 5 chunks and only 2 are about the topic, your context relevance is around 0.4 — your retriever is noisy. Improving this means better chunking, better embeddings, or hybrid retrieval (combining vector search with keyword search). **Context recall** asks the inverse: did the retriever find all the chunks it should have? You need a ground-truth list of relevant chunks (or a ground-truth answer the judge can check against the retrieved context). A recall of 0.5 means the retriever missed half of the relevant material — even with a perfect generator, the answer will be incomplete.

Building a clinical test set from the Wilms tumor PDF is the practical work. You write 5–10 question-answer pairs grounded in specific sections — questions a real KHCC oncologist might ask. For each, you note the ground-truth answer and ideally the section(s) the answer comes from. This becomes your evaluation set. You run your RAG pipeline on each question and feed (question, retrieved chunks, generated answer, ground truth) into DeepEval.

The most instructive exercise is comparing a deliberately bad RAG (tiny 50-token chunks, no overlap, no reranking) against a deliberately good RAG (semantic chunks aligned to headings, hybrid retrieval, top-10 with reranking down to top-3). The bad pipeline will show low context relevance (chunks too small to carry meaning) and low recall (relevant info split across chunks). The good pipeline will score noticeably higher on all four metrics. Once you see the numbers move, the abstract advice ("use better chunks") becomes concrete.

Common RAG failure modes that the metrics expose: stale index (the document was updated but the index was not re-built — recall drops to zero on new content), poor chunking (semantic units split mid-sentence — context relevance suffers), ranking issues (the right chunk is at position 8 but you only return top-5 — recall fails), and prompt issues (the LLM ignores the retrieved context and uses its training data instead — faithfulness fails). Each failure mode has a metric that catches it.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
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
```

---

### Practice — Interactive Artifact

```jsx
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
```

---

## LESSON 3 OF 6: Agentic RAG with LangGraph

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Basic RAG retrieves once and answers. That works for simple questions like 'what is the dose for vincristine?' but fails for the complex questions oncologists actually ask: 'Given a 4-year-old with stage III favorable-histology Wilms tumor and existing renal impairment, what regimen modifications should be considered?' That question requires multiple retrievals — staging criteria, standard regimens, dose modifications for organ dysfunction, and pediatric considerations. Basic RAG cannot do that. Agentic RAG can. We use what you learned in Session 5 — LangGraph agents — and let the agent decide when to retrieve, what to retrieve, and whether to retrieve again. Today we build an agentic RAG system on the Wilms tumor guidelines."

---

### NotebookLM Summary

Basic RAG has a fixed shape: receive question, embed question, retrieve top-k chunks, stuff into prompt, generate answer. One retrieval, one answer. This is fine for narrow lookup questions but breaks down for three reasons. First, the user's question may not match how the document phrases the answer — embeddings of "what is the dose for the youngest patients?" may miss a chunk titled "Pediatric Dosing in Patients Under 5 Years." Second, the retrieved chunks may be irrelevant or insufficient — basic RAG has no mechanism to notice or recover. Third, complex questions decompose into sub-questions that each need their own retrieval — basic RAG handles them as one big embedding, retrieving an averaged blob.

Agentic RAG uses an agent (Session 5) to make retrieval a *tool* the agent can call repeatedly with refined queries. The agent decides: do I have enough information, or do I need to retrieve again? Was the retrieval relevant, or should I reformulate? Several patterns build on this.

**Query rewriting** is the simplest. Before retrieval, an LLM call rewrites the user's natural-language question into one or more retrieval-optimized queries. "What if my patient has bad kidneys?" becomes "renal impairment dose modifications for Wilms tumor chemotherapy." This single change often improves retrieval more than any embedding upgrade.

**Self-RAG** (the family of self-reflective RAG patterns) grades the retrieved documents before generating. After retrieval, an LLM looks at each chunk and asks: is this relevant to the question? Irrelevant chunks are dropped. If too few survive, the agent re-retrieves with a different query or admits it does not have the answer. This guards against the confident-wrong-answer failure mode where bad chunks lead to bad answers.

**Corrective RAG (CRAG)** extends this: if grading shows retrieval failed, the system falls back to a different source — a web search, a different index, or a different retrieval strategy — rather than hallucinating from a bad context.

**Multi-step decomposition** handles complex questions by breaking them into sub-questions, retrieving for each, and synthesizing. The Wilms tumor question above naturally decomposes into "stage III FH standard regimen" + "renal impairment dose modifications" + "pediatric considerations" — three retrievals, three contexts, then a synthesis call.

LangGraph is the natural orchestration runtime for this. You define a `StateGraph` with nodes: `rewrite_query`, `retrieve_documents`, `grade_documents`, `generate_answer`, with conditional edges that route based on grading results. The `retrieve_documents` tool wraps your Lesson 1 retriever and exposes it as a `@tool`-decorated function the agent can call. State holds the original question, current query, retrieved chunks, grade results, and accumulated context. When grading says "no good chunks," a conditional edge routes back to `rewrite_query` for another attempt, with a max-iteration safeguard.

The comparison on a complex clinical question — basic RAG returns a partial, generic answer; agentic RAG retrieves three times, grades each retrieval, and synthesizes a complete response — makes the cost-benefit clear. Agentic RAG uses more tokens and more time. For simple questions it is overkill. For complex multi-hop clinical questions it is worth every cent.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "Basic RAG retrieves once and generates. What is the core limitation that agentic RAG addresses?",
    options: [
      "Basic RAG is slower than agentic RAG",
      "Basic RAG cannot decide whether retrieval was good, cannot reformulate the query, and cannot retrieve again — it has no feedback loop",
      "Basic RAG cannot use OpenAI models",
      "Basic RAG requires a vector store and agentic RAG does not"
    ],
    correct: 1,
    explanation: "The core limitation is the lack of a feedback loop. Basic RAG has no way to notice that the retrieved chunks are bad, no way to reformulate the query, no way to decompose a complex question. Agentic RAG turns retrieval into a tool the agent can call — possibly multiple times — based on what it sees."
  },
  {
    question: "A user asks 'what if my patient has bad kidneys?' Which agentic RAG pattern is most likely to help most BEFORE retrieval happens?",
    options: [
      "Self-RAG (grade retrieved documents)",
      "Query rewriting (reformulate the question into a retrieval-optimized form)",
      "Corrective RAG (fall back to web search)",
      "Multi-step decomposition"
    ],
    correct: 1,
    explanation: "The user's phrasing ('bad kidneys') will not match how the guideline phrases it ('renal impairment dose modifications'). Query rewriting normalizes the question into terminology that matches the document — often the cheapest and highest-impact agentic pattern."
  },
  {
    question: "Self-RAG grades retrieved documents before generation. What does that buy you?",
    options: [
      "Faster retrieval",
      "A check that filters out irrelevant chunks and triggers re-retrieval if too few good chunks survive — preventing confident-wrong answers from bad context",
      "Lower API costs",
      "Better embeddings"
    ],
    correct: 1,
    explanation: "Self-RAG explicitly inspects each retrieved chunk for relevance. Bad chunks are dropped. If not enough good chunks survive, the agent re-retrieves or declines to answer. This guards directly against the failure mode where the retriever returns junk and the generator confidently hallucinates from it."
  },
  {
    question: "A complex question: 'For a 4-year-old with stage III favorable-histology Wilms tumor AND renal impairment, what regimen modifications apply?' Which agentic RAG pattern is most natural?",
    options: [
      "Basic RAG with a larger top-k (e.g., k=20)",
      "Multi-step decomposition: split into sub-questions, retrieve for each, synthesize",
      "Embed the full question once and trust the embedding",
      "Use a bigger LLM and skip RAG"
    ],
    correct: 1,
    explanation: "Multi-hop questions like this combine multiple distinct topics (staging, regimen, age, organ dysfunction). Decomposing into sub-questions and retrieving for each ensures each topic gets its own targeted context. A single embedding of the full question averages all topics together and tends to retrieve a generic blob."
  },
  {
    question: "In a LangGraph agentic RAG, what role does the conditional edge play after the grade_documents node?",
    options: [
      "It records logs to a file",
      "It routes to generate_answer if enough good chunks survived, or back to rewrite_query if not — implementing the retrieval feedback loop",
      "It always routes directly to generate_answer regardless of grade",
      "It calls a different LLM model"
    ],
    correct: 1,
    explanation: "The conditional edge reads the grade_documents result from state and decides where to go next. Good chunks → generate. Bad chunks → rewrite the query and try again (with an iteration cap to avoid loops). This is the retrieval feedback loop that distinguishes agentic from basic RAG."
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
          {score >= 4 ? "Excellent! You can pick the right agentic RAG pattern for the question." : score >= 3 ? "Good — review query rewriting vs self-RAG vs decomposition." : "Review the agentic RAG patterns and what each one fixes."}
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

const NODES = [
  { id: 'rewrite', label: 'rewrite_query', desc: 'LLM reformulates the user question into a retrieval-optimized query' },
  { id: 'retrieve', label: 'retrieve_documents', desc: 'Vector store returns top-k chunks for the current query' },
  { id: 'grade', label: 'grade_documents', desc: 'LLM grades each chunk for relevance; drops irrelevant ones' },
  { id: 'decompose', label: 'decompose_question', desc: 'LLM splits a complex question into sub-questions' },
  { id: 'generate', label: 'generate_answer', desc: 'LLM produces the final grounded answer from accumulated context' }
];

const scenarios = [
  {
    title: "Simple lookup",
    question: "What is the dose of vincristine in the standard Wilms regimen?",
    correctNodes: ['retrieve', 'generate'],
    explanation: "A narrow lookup question against a well-structured guideline. Basic RAG (retrieve → generate) is enough. Adding rewrite, grade, or decomposition just burns tokens for no quality gain."
  },
  {
    title: "Vague natural language",
    question: "What if my kid has weak kidneys before chemo starts?",
    correctNodes: ['rewrite', 'retrieve', 'generate'],
    explanation: "The user's phrasing ('kid has weak kidneys') will not embed close to guideline language ('pediatric renal impairment'). Query rewriting fixes this. Then retrieve and generate. No decomposition needed — it is one topic."
  },
  {
    title: "Multi-hop synthesis",
    question: "For a 4-year-old with stage III favorable-histology Wilms tumor and renal impairment, what regimen modifications apply?",
    correctNodes: ['decompose', 'retrieve', 'grade', 'generate'],
    explanation: "Three distinct topics (staging/regimen, age/pediatric, renal impairment). Decompose into sub-questions, retrieve per sub-question, grade to drop irrelevant chunks, synthesize. This is the canonical agentic-RAG case."
  },
  {
    title: "Ambiguous query likely to retrieve junk",
    question: "What about side effects?",
    correctNodes: ['rewrite', 'retrieve', 'grade', 'generate'],
    explanation: "The question is dangerously vague — without rewriting it will pull random side-effect mentions across the entire document. Rewrite (e.g., 'most common side effects of standard Wilms tumor chemotherapy regimen'), retrieve, grade to filter junk, then generate."
  }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const s = scenarios[idx];

  const toggle = (id) => {
    if (submitted) return;
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const submit = () => {
    const correctSet = new Set(s.correctNodes);
    const pickedSet = new Set(picked);
    const exact = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x));
    if (exact) setScore(sc => sc + 1);
    setSubmitted(true);
  };

  const next = () => { setIdx(i => i + 1); setPicked([]); setSubmitted(false); };
  const reset = () => { setIdx(0); setPicked([]); setSubmitted(false); setScore(0); };

  if (idx >= scenarios.length) {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Agentic RAG Designer Complete!</h2>
        <p style={{ fontSize: 20 }}>Exactly correct: {score} / {scenarios.length}</p>
        <div style={{ background: score >= 3 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 3 ? "Excellent — you match agentic patterns to question complexity." : "Review when each node earns its cost. Simple questions do not need every node."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Design {idx + 1} of {scenarios.length}: {s.title}</h3>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8 }}><strong>Clinical question:</strong> {s.question}</p>
      <p style={{ marginTop: 12, fontWeight: 'bold' }}>Which nodes belong in your agentic RAG flow? (Select all that apply.)</p>
      {NODES.map(n => {
        const isPicked = picked.includes(n.id);
        const isCorrect = s.correctNodes.includes(n.id);
        return (
          <div key={n.id} onClick={() => toggle(n.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${submitted ? (isCorrect ? '#198754' : isPicked ? '#dc3545' : '#dee2e6') : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: submitted ? (isCorrect ? '#d4edda' : isPicked && !isCorrect ? '#f8d7da' : '#fff') : isPicked ? '#e7f1ff' : '#fff'
          }}>
            <div style={{ fontWeight: 'bold' }}>{n.label}</div>
            <div style={{ fontSize: 13, color: '#555' }}>{n.desc}</div>
          </div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={picked.length === 0} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.5 : 1 }}>Submit Design</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{s.explanation}</p>
          <p style={{ fontSize: 13, color: '#555' }}>Correct nodes: {s.correctNodes.join(' → ')}.</p>
          <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < scenarios.length ? 'Next Scenario' : 'See Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 6: GraphRAG — Knowledge Graphs for Clinical Knowledge

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Vector RAG is great for 'what is the dose for stage III Wilms tumor?' — a question whose answer is a single chunk. But it fails on questions like 'what are the relationships between staging, histology, and treatment regimens?' — questions that require traversing connections across the document. The information is there, but spread across many sections. Vector similarity cannot follow relationships. That is where GraphRAG shines. We extract entities (Disease, Stage, Drug, Side Effect) and relationships (TREATS, CAUSES, INDICATES) from the clinical text, build a knowledge graph, and answer multi-hop questions by traversing it. Today we build a small knowledge graph from the Wilms tumor guidelines and query it."

---

### NotebookLM Summary

Vector RAG works by similarity in embedding space. That is excellent for retrieval where the answer is contained in a small number of textually similar chunks. It struggles when the answer requires *connecting* information across chunks. "Which drugs in the standard regimen cause cardiotoxicity?" needs three things: the list of drugs in the regimen, the side-effect profile of each drug, and the ability to filter the second by the first. No single chunk contains the answer; vector similarity averages them into noise. **GraphRAG** is a family of techniques that build an explicit knowledge graph from the text and query it via graph traversal or community summaries.

The architecture has four phases. **Phase 1: chunk the document** the same way as basic RAG. **Phase 2: extract entities and relationships** with an LLM. For each chunk, prompt the LLM to identify entities (typed nodes) and relationships (typed edges) and emit them as structured output. In clinical text, common entity types include Disease, Stage, Drug, SideEffect, Procedure, BodyPart, Patient, AgeGroup. Common edge types include TREATS, CAUSES, INDICATES, CONTRAINDICATED_WITH, MODIFIED_BY, PART_OF. **Phase 3: assemble the graph**, deduplicating entities (the same drug mentioned in different chunks should be one node), aggregating evidence, and optionally running community detection — Microsoft's GraphRAG paper popularized using the Leiden algorithm to find dense clusters of related entities and summarize each cluster. **Phase 4: query**. Local queries traverse the graph from a seed entity outward. Global queries scan community summaries to answer thematic questions.

Tools span a range. **NetworkX** is an in-memory Python library — perfect for teaching and prototypes up to a few thousand entities. **Neo4j** is a production graph database with the Cypher query language — what you would use at KHCC scale. **LlamaIndex's PropertyGraphIndex** wraps the extraction-and-query workflow into a unified API on top of either backend. For this lesson we use NetworkX because it runs in Colab without a database server.

When does GraphRAG earn its cost? Three signals. First, **multi-hop questions** — answers that require chaining multiple facts. "What side effects does the regimen for stage III favorable histology have?" hops Stage → Regimen → Drug → SideEffect. Second, **thematic questions** — "what are the major complications across the document?" — which need a global summary, not a local lookup. Third, **relationship-heavy domains** — clinical guidelines, drug interactions, biological pathways — where the relationships *are* the knowledge.

When is GraphRAG overkill? When questions are narrow lookups, when the corpus is small enough that a single retrieval covers most queries, when you cannot afford the LLM extraction cost (extracting entities from a 200-page PDF costs real money), or when you cannot maintain the graph (every document update requires re-extraction). Many production systems use **hybrid RAG**: vector RAG for narrow questions, GraphRAG for multi-hop questions, with a router that decides which to use.

The mental model: vector RAG retrieves *passages*; GraphRAG retrieves *structure*. The hands-on exercise — extracting a small graph from a Wilms tumor paragraph — is the fastest way to feel why both matter.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What kind of clinical question is GraphRAG most likely to answer better than vector RAG?",
    options: [
      "What is the dose of vincristine? (single fact lookup)",
      "Which drugs in the standard Wilms regimen cause cardiotoxicity? (multi-hop: regimen → drugs → side effects)",
      "What is the title of section 3? (literal text match)",
      "What is the page count of the PDF?"
    ],
    correct: 1,
    explanation: "Multi-hop questions are the GraphRAG sweet spot. Vector RAG would retrieve chunks about 'cardiotoxicity' and chunks about 'standard regimen' but cannot reliably JOIN them. The graph encodes the join explicitly: regimen-INCLUDES->drug, drug-CAUSES->side_effect."
  },
  {
    question: "In a GraphRAG extraction step, what is an LLM doing exactly?",
    options: [
      "Embedding the chunks into vectors",
      "Reading each chunk and producing structured (entity, type) and (entity, relationship, entity) tuples",
      "Running graph algorithms like PageRank",
      "Translating the chunks into Cypher queries"
    ],
    correct: 1,
    explanation: "Extraction is structured output: the LLM reads a chunk and produces a list of typed entities (e.g., Drug: cisplatin) and typed edges (e.g., cisplatin -CAUSES-> nephrotoxicity). After extraction across all chunks, you deduplicate entities and assemble the graph."
  },
  {
    question: "After assembling a graph from a 200-page PDF, you have ~5000 nodes and ~12000 edges. Which question type is best served by 'community summaries' rather than direct traversal?",
    options: [
      "What is the dose for stage III Wilms tumor?",
      "What are the major themes and complications discussed across the entire document?",
      "Does drug A interact with drug B?",
      "Who wrote the guideline?"
    ],
    correct: 1,
    explanation: "Thematic / global questions ('major themes', 'overall complications') are answered by summarizing communities (clusters of densely connected entities) rather than walking from a seed. Local questions ('what is the dose?') are answered by traversal from a starting entity."
  },
  {
    question: "When is GraphRAG NOT worth the cost?",
    options: [
      "When all your questions are narrow lookups against a small corpus and entity extraction would dominate the bill",
      "When you have multi-hop questions",
      "When relationships matter to your domain",
      "When you have a clinical guideline corpus"
    ],
    correct: 0,
    explanation: "Entity extraction across a large PDF is expensive (LLM calls per chunk) and the graph must be re-built on every update. If your questions are narrow lookups (vector RAG handles them well) and your corpus is small, the extra cost of GraphRAG buys you little. Use vector RAG by default; reach for GraphRAG when multi-hop or thematic questions dominate."
  },
  {
    question: "Which tool combination is appropriate for a teaching/prototype scale GraphRAG in Colab?",
    options: [
      "Neo4j Aura cluster + Cypher queries",
      "NetworkX in memory + LLM extraction + Python traversal",
      "A custom C++ graph engine",
      "A vector store only — no graph needed"
    ],
    correct: 1,
    explanation: "NetworkX is in-memory, free, and perfect for teaching and prototypes up to a few thousand entities. For production scale at KHCC you would graduate to Neo4j with Cypher, but every concept you learn in NetworkX maps directly."
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
          {score >= 4 ? "Excellent! You can tell when GraphRAG earns its cost." : score >= 3 ? "Good — review when to choose vector RAG vs GraphRAG." : "Review the GraphRAG architecture and the multi-hop question pattern."}
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

const PARAGRAPH = "Stage III favorable-histology Wilms tumor in pediatric patients is treated with a regimen of vincristine, actinomycin-D, and doxorubicin combined with flank radiotherapy. Doxorubicin is associated with cardiotoxicity and requires baseline echocardiogram. Vincristine commonly causes peripheral neuropathy. In patients with renal impairment, actinomycin-D dosing should be modified.";

const ENTITY_OPTIONS = [
  { id: 'wilms', label: 'Wilms tumor', type: 'Disease', correct: true },
  { id: 'stage3', label: 'Stage III', type: 'Stage', correct: true },
  { id: 'fh', label: 'favorable histology', type: 'Histology', correct: true },
  { id: 'vincristine', label: 'vincristine', type: 'Drug', correct: true },
  { id: 'actd', label: 'actinomycin-D', type: 'Drug', correct: true },
  { id: 'dox', label: 'doxorubicin', type: 'Drug', correct: true },
  { id: 'radio', label: 'flank radiotherapy', type: 'Procedure', correct: true },
  { id: 'cardio', label: 'cardiotoxicity', type: 'SideEffect', correct: true },
  { id: 'neuro', label: 'peripheral neuropathy', type: 'SideEffect', correct: true },
  { id: 'renal', label: 'renal impairment', type: 'Condition', correct: true },
  { id: 'echo', label: 'echocardiogram', type: 'Procedure', correct: true },
  { id: 'pediatric', label: 'pediatric patients', type: 'AgeGroup', correct: true },
  { id: 'aspirin', label: 'aspirin', type: 'Drug', correct: false },
  { id: 'lung', label: 'lung cancer', type: 'Disease', correct: false },
  { id: 'mri', label: 'MRI', type: 'Procedure', correct: false }
];

const RELATION_OPTIONS = [
  { id: 'r1', text: 'vincristine — TREATS → Wilms tumor', correct: true },
  { id: 'r2', text: 'doxorubicin — CAUSES → cardiotoxicity', correct: true },
  { id: 'r3', text: 'vincristine — CAUSES → peripheral neuropathy', correct: true },
  { id: 'r4', text: 'actinomycin-D — MODIFIED_BY → renal impairment', correct: true },
  { id: 'r5', text: 'flank radiotherapy — TREATS → Wilms tumor', correct: true },
  { id: 'r6', text: 'aspirin — TREATS → Wilms tumor', correct: false },
  { id: 'r7', text: 'echocardiogram — INDICATES → cardiotoxicity', correct: true },
  { id: 'r8', text: 'MRI — TREATS → Wilms tumor', correct: false },
  { id: 'r9', text: 'doxorubicin — CAUSES → peripheral neuropathy', correct: false }
];

export default function Practice() {
  const [step, setStep] = useState('entities');
  const [pickedEntities, setPickedEntities] = useState([]);
  const [pickedRelations, setPickedRelations] = useState([]);
  const [submittedE, setSubmittedE] = useState(false);
  const [submittedR, setSubmittedR] = useState(false);

  const toggleE = (id) => { if (!submittedE) setPickedEntities(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };
  const toggleR = (id) => { if (!submittedR) setPickedRelations(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };

  const submitE = () => setSubmittedE(true);
  const submitR = () => setSubmittedR(true);
  const reset = () => { setStep('entities'); setPickedEntities([]); setPickedRelations([]); setSubmittedE(false); setSubmittedR(false); };

  const eCorrect = ENTITY_OPTIONS.filter(o => o.correct && pickedEntities.includes(o.id)).length;
  const eWrong = ENTITY_OPTIONS.filter(o => !o.correct && pickedEntities.includes(o.id)).length;
  const eMissed = ENTITY_OPTIONS.filter(o => o.correct && !pickedEntities.includes(o.id)).length;

  const rCorrect = RELATION_OPTIONS.filter(o => o.correct && pickedRelations.includes(o.id)).length;
  const rWrong = RELATION_OPTIONS.filter(o => !o.correct && pickedRelations.includes(o.id)).length;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Extract the Knowledge Graph</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        <strong>Clinical paragraph:</strong> {PARAGRAPH}
      </p>

      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <button onClick={() => setStep('entities')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: step === 'entities' ? '#0d6efd' : '#e9ecef', color: step === 'entities' ? '#fff' : '#000', cursor: 'pointer' }}>Step 1: Entities</button>
        <button onClick={() => setStep('relations')} disabled={!submittedE} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: step === 'relations' ? '#0d6efd' : '#e9ecef', color: step === 'relations' ? '#fff' : '#000', cursor: !submittedE ? 'not-allowed' : 'pointer', opacity: !submittedE ? 0.5 : 1 }}>Step 2: Relationships</button>
      </div>

      {step === 'entities' && (
        <div>
          <p style={{ fontWeight: 'bold' }}>Select all entities present in the paragraph (and only those).</p>
          {ENTITY_OPTIONS.map(o => {
            const isPicked = pickedEntities.includes(o.id);
            const showCorrect = submittedE && o.correct;
            const showWrong = submittedE && isPicked && !o.correct;
            const showMissed = submittedE && o.correct && !isPicked;
            return (
              <div key={o.id} onClick={() => toggleE(o.id)} style={{
                display: 'inline-block', padding: '6px 12px', margin: 4, borderRadius: 16, cursor: submittedE ? 'default' : 'pointer',
                border: `2px solid ${showCorrect ? '#198754' : showWrong ? '#dc3545' : showMissed ? '#ffc107' : isPicked ? '#0d6efd' : '#dee2e6'}`,
                background: showCorrect ? '#d4edda' : showWrong ? '#f8d7da' : showMissed ? '#fff3cd' : isPicked ? '#e7f1ff' : '#fff',
                fontSize: 13
              }}>{o.label} <span style={{ color: '#666', fontSize: 11 }}>({o.type})</span></div>
            );
          })}
          {!submittedE && <div><button onClick={submitE} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Entities</button></div>}
          {submittedE && (
            <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
              <p>Correctly identified: {eCorrect}. Incorrectly included (not in paragraph): {eWrong}. Missed: {eMissed}.</p>
              <p style={{ fontSize: 13 }}>The paragraph contains 12 entities across types Disease, Stage, Histology, Drug, Procedure, SideEffect, Condition, AgeGroup. The distractors (aspirin, lung cancer, MRI) are not mentioned. Notice how typing matters — 'flank radiotherapy' is a Procedure, not a Drug.</p>
              <button onClick={() => setStep('relations')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Next: Identify Relationships</button>
            </div>
          )}
        </div>
      )}

      {step === 'relations' && (
        <div>
          <p style={{ fontWeight: 'bold' }}>Select all relationships supported by the paragraph.</p>
          {RELATION_OPTIONS.map(o => {
            const isPicked = pickedRelations.includes(o.id);
            const showCorrect = submittedR && o.correct;
            const showWrong = submittedR && isPicked && !o.correct;
            return (
              <div key={o.id} onClick={() => toggleR(o.id)} style={{
                padding: 10, margin: '6px 0', borderRadius: 8, cursor: submittedR ? 'default' : 'pointer',
                border: `2px solid ${showCorrect ? '#198754' : showWrong ? '#dc3545' : isPicked ? '#0d6efd' : '#dee2e6'}`,
                background: showCorrect ? '#d4edda' : showWrong ? '#f8d7da' : isPicked ? '#e7f1ff' : '#fff',
                fontFamily: 'monospace', fontSize: 13
              }}>{o.text}</div>
            );
          })}
          {!submittedR && <div><button onClick={submitR} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Relationships</button></div>}
          {submittedR && (
            <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
              <p>Correct relationships selected: {rCorrect}. Incorrect (not supported by paragraph): {rWrong}.</p>
              <p style={{ fontSize: 13 }}>The valid edges are TREATS (drug→disease, procedure→disease), CAUSES (drug→side effect — only as written), MODIFIED_BY (drug→condition), and INDICATES (procedure→side effect monitoring). Watch out for relationships that "feel right" but are not actually stated — vincristine causes neuropathy is in the text; doxorubicin causing neuropathy is NOT — extracting it would be a hallucination.</p>
              <button onClick={reset} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 6: The Wiki Approach — RAG Without Retrieval

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Here is a paradigm shift from Andrej Karpathy. Instead of retrieving raw chunks per query, what if you maintained a living wiki — entity pages, summaries, an index — that compounds knowledge over time? No embeddings. No vector DB. Just markdown files updated by an LLM. The LLM is now the *librarian* who reads new sources and updates the right pages, not just a question-answerer who looks things up. At query time you read the index and drill down to the right page. It is deterministic, debuggable, transparent, and at moderate scale it can outperform vector RAG. Today we build this approach for the Wilms tumor guidelines and compare it to the systems we built in Lessons 1–4."

---

### NotebookLM Summary

Andrej Karpathy posted a [gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) describing a different way to think about RAG: instead of re-deriving an answer from raw chunks every query, you maintain a living wiki. The core insight is that RAG, as commonly practiced, is wasteful — every query re-reads raw text and re-derives the same understanding. A wiki compiles that understanding *once* and keeps it current. At query time you read a structured page, not raw chunks.

The structure mirrors a small Wikipedia for your domain. There is an **index.md** (the table of contents), a **log.md** (a chronological journal of what has been ingested and changed), and many **entity pages** — one per concept. For the Wilms tumor guideline, entity pages might include `staging.md`, `histology.md`, `drug-cisplatin.md`, `drug-vincristine.md`, `regimen-stage-III-FH.md`, `side-effect-cardiotoxicity.md`, `procedure-nephrectomy.md`. Each page is a clean, curated markdown summary with cross-references (`[[drug-vincristine]]`) to other pages.

The LLM is no longer a question-answerer at query time — it is a **wiki maintainer at ingest time**. When a new source arrives (a guideline update, a new clinical paper), the LLM reads it, identifies which entity pages need updates, and edits each page accordingly with cross-references to related pages. This is more LLM work per ingest than basic RAG, but each query then becomes much cheaper and more accurate.

Querying is delightful in its simplicity. You read the index to find the relevant pages, then read those pages directly. No embeddings. No vector DB. No top-k tuning. For a question about stage III FH regimens, you open `regimen-stage-III-FH.md`, follow the cross-references to the constituent drug pages, and write the answer from those structured summaries. At moderate scale (hundreds of pages, not millions), this is competitive with vector RAG and often beats it on multi-hop questions because the cross-references *are* the graph structure — no extraction step needed.

The pros are real. **Transparency**: every answer's provenance is the entity pages, which are human-readable. **Debuggability**: when an answer is wrong, you read the page, see what is wrong, and edit it — no chunking, embeddings, or rerankers to debug. **No embedding drift**: there are no embeddings. **Cross-references built-in**: the wiki structure encodes relationships explicitly, similar to GraphRAG but as markdown rather than a graph database. **Compounds over time**: each ingest adds curated knowledge rather than just raw text.

The cons are also real. **Does not scale to millions of documents**: at very large scale, retrieval beats reading the index. **Requires careful prompt engineering** for the ingest step — a sloppy maintainer LLM produces a sloppy wiki that compounds errors. **Adversarial to incremental sources** — when sources contradict each other, the wiki must reconcile them, which is a hard prompt-engineering problem. The right mental model: this is RAG for the regime where you have tens to thousands of authoritative sources and you actually want to *understand* them, not just search them. KHCC clinical guidelines are exactly that regime.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What is the core philosophical difference between Karpathy's wiki approach and vector RAG?",
    options: [
      "The wiki uses a different LLM model",
      "The wiki compiles understanding once at ingest time and stores it as curated pages; vector RAG re-derives understanding from raw chunks every query",
      "The wiki only works for code, not clinical text",
      "Vector RAG is open-source and the wiki is proprietary"
    ],
    correct: 1,
    explanation: "Karpathy's framing: most RAG re-reads raw chunks every query and re-derives the same understanding repeatedly. A wiki shifts the work to ingest time — the LLM curates pages once, and queries become structured page reads. The expensive work happens at ingest, not query."
  },
  {
    question: "In the wiki approach, what role does the LLM play at INGEST time?",
    options: [
      "It generates embeddings",
      "It acts as a wiki maintainer — reads the new source, decides which entity pages need updating, edits each one with cross-references",
      "It chunks the document",
      "It produces a vector index"
    ],
    correct: 1,
    explanation: "At ingest the LLM is a librarian/maintainer. It reads the new source and updates the relevant entity pages — adding facts, reconciling contradictions, adding cross-references. Querying then becomes much cheaper because the curation is already done."
  },
  {
    question: "Which is NOT a component of a Karpathy-style wiki for clinical knowledge?",
    options: [
      "index.md (table of contents)",
      "log.md (chronological ingest journal)",
      "entity pages like staging.md, drug-cisplatin.md",
      "A ChromaDB vector store of embedded chunks"
    ],
    correct: 3,
    explanation: "The wiki approach explicitly does not use embeddings or a vector DB. It uses markdown files with cross-references — the index, the log, and many entity pages. That is the whole point: deterministic, debuggable, no embedding drift."
  },
  {
    question: "When does the wiki approach win over vector RAG?",
    options: [
      "When you have millions of unstructured documents and need millisecond retrieval",
      "When you have tens to thousands of authoritative sources, want transparency and debuggability, and care about multi-hop relationships",
      "When you cannot afford any LLM calls",
      "When you have no documents at all"
    ],
    correct: 1,
    explanation: "The wiki shines at moderate scale (tens to thousands of authoritative sources) where you want to actually understand the corpus, not just search it. KHCC clinical guidelines fit this profile. At millions of documents, retrieval beats reading the index."
  },
  {
    question: "What is the biggest practical risk in a wiki-based RAG?",
    options: [
      "Embedding drift over time",
      "A sloppy maintainer prompt produces a sloppy wiki, and errors compound across ingests",
      "Vector store latency",
      "Token limits during retrieval"
    ],
    correct: 1,
    explanation: "Because the LLM curates the wiki, the maintainer prompt is critical. A bad maintainer prompt that misclassifies entities or fails to reconcile contradictions will degrade the wiki over time. Unlike vector RAG where re-indexing fixes things cheaply, fixing a polluted wiki may require re-ingesting everything with a better prompt."
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
          {score >= 4 ? "Excellent! You understand the wiki paradigm and where it wins." : score >= 3 ? "Good — review the ingest-vs-query work split that defines the wiki approach." : "Re-read the lesson summary on Karpathy's wiki approach before moving on."}
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

const PAGES = [
  { id: 'index', name: 'index.md', desc: 'Table of contents linking to every entity page', correct: true },
  { id: 'log', name: 'log.md', desc: 'Chronological journal of ingested sources and edits', correct: true },
  { id: 'staging', name: 'staging.md', desc: 'Wilms tumor staging system (Stage I–V) with criteria', correct: true },
  { id: 'histology', name: 'histology.md', desc: 'Favorable vs anaplastic histology, prognostic implications', correct: true },
  { id: 'drug-vincristine', name: 'drug-vincristine.md', desc: 'Vincristine: dosing, mechanism, side effects, cross-refs to regimens', correct: true },
  { id: 'drug-actd', name: 'drug-actinomycin-d.md', desc: 'Actinomycin-D: dosing, modifications, side effects', correct: true },
  { id: 'drug-dox', name: 'drug-doxorubicin.md', desc: 'Doxorubicin: dosing, cardiotoxicity monitoring, cross-refs', correct: true },
  { id: 'regimen-3fh', name: 'regimen-stage-III-FH.md', desc: 'Standard regimen for stage III favorable histology', correct: true },
  { id: 'se-cardio', name: 'side-effect-cardiotoxicity.md', desc: 'Cardiotoxicity: causes, monitoring, drugs that cause it', correct: true },
  { id: 'se-neuro', name: 'side-effect-neuropathy.md', desc: 'Peripheral neuropathy: causes, drugs', correct: true },
  { id: 'proc-nephrectomy', name: 'procedure-nephrectomy.md', desc: 'Surgical approach including nephron-sparing in bilateral disease', correct: true },
  { id: 'pediatric', name: 'pediatric-considerations.md', desc: 'Age-specific dosing and monitoring', correct: true },
  { id: 'breast-cancer', name: 'disease-breast-cancer.md', desc: 'Breast cancer staging and treatment', correct: false },
  { id: 'covid', name: 'disease-covid.md', desc: 'COVID-19 protocols', correct: false },
  { id: 'random-news', name: 'news-2024.md', desc: 'General news headlines from 2024', correct: false }
];

export default function Practice() {
  const [picked, setPicked] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => { if (!submitted) setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };
  const submit = () => setSubmitted(true);
  const reset = () => { setPicked([]); setSubmitted(false); };

  const correctIncluded = PAGES.filter(p => p.correct && picked.includes(p.id)).length;
  const wrongIncluded = PAGES.filter(p => !p.correct && picked.includes(p.id)).length;
  const missed = PAGES.filter(p => p.correct && !picked.includes(p.id)).length;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Design Your Wiki</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        <strong>Scenario:</strong> You are designing a Karpathy-style wiki for the National Wilms Tumor treatment guidelines. The corpus covers staging, histology, drugs, regimens, side effects, and surgical procedures. Pick the pages that belong in this wiki and reject those that do not.
      </p>

      {PAGES.map(p => {
        const isPicked = picked.includes(p.id);
        const showCorrect = submitted && p.correct;
        const showWrong = submitted && isPicked && !p.correct;
        const showMissed = submitted && p.correct && !isPicked;
        return (
          <div key={p.id} onClick={() => toggle(p.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${showCorrect ? '#198754' : showWrong ? '#dc3545' : showMissed ? '#ffc107' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: showCorrect ? '#d4edda' : showWrong ? '#f8d7da' : showMissed ? '#fff3cd' : isPicked ? '#e7f1ff' : '#fff'
          }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: '#555' }}>{p.desc}</div>
          </div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={picked.length === 0} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.5 : 1 }}>Lock in Wiki Design</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Included correctly:</strong> {correctIncluded} / {PAGES.filter(p => p.correct).length} <strong>Wrongly included:</strong> {wrongIncluded} <strong>Missed:</strong> {missed}</p>
          <p style={{ fontSize: 13 }}>Every entity page should be a stable concept your domain queries return to repeatedly: staging, histology, each drug, each regimen, each major side effect, each procedure, plus pediatric considerations. Index and log are mandatory infrastructure. Pages about unrelated diseases (breast cancer, COVID) or generic news pollute the wiki — at ingest time the maintainer LLM should refuse to create these.</p>
          <p style={{ fontSize: 13 }}><strong>Cross-reference example:</strong> regimen-stage-III-FH.md should link to drug-vincristine, drug-actinomycin-d, drug-doxorubicin, staging, histology, side-effect-cardiotoxicity, side-effect-neuropathy. The links ARE the graph.</p>
          <button onClick={reset} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 6: Wrap-Up Challenge — Build Your Best RAG

**Estimated time:** 20 minutes

---

### Instructor Introduction

"Let us step back. You started by parsing a complex clinical PDF with LlamaParse and building a basic vector RAG. You learned to measure RAG quality with DeepEval — faithfulness, answer relevance, context relevance, context recall. You upgraded to agentic RAG with LangGraph — query rewriting, document grading, multi-step decomposition. You built a knowledge graph from clinical text and saw why GraphRAG handles multi-hop questions vector RAG cannot. And finally you saw a paradigm shift: Karpathy's wiki approach where the LLM curates the knowledge once instead of re-deriving it every query. Now we put it all together with a live challenge — five hard clinical questions, four RAG approaches, one decision per question. Pick well."

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|---|---|---|
| 1 | Basic RAG with LlamaParse | 5-stage pipeline (load, split, embed, store, retrieve), layout-aware PDF parsing, chunking strategies | Query a 200-page Wilms tumor guideline without stuffing it into every prompt |
| 2 | RAG Evaluation with DeepEval | Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall — LLM-as-judge | Measure clinical RAG safety: catch hallucinations and missed retrievals before they reach a patient |
| 3 | Agentic RAG with LangGraph | Query rewriting, self-RAG grading, corrective fallback, multi-step decomposition | Handle complex multi-condition oncology questions that need multiple targeted retrievals |
| 4 | GraphRAG | Entity/relationship extraction, graph traversal, communities, local vs global queries | Answer multi-hop questions like "which drugs in the regimen cause cardiotoxicity?" |
| 5 | Wiki Approach | Karpathy's wiki — LLM as ingest-time librarian, entity pages with cross-references, no embeddings | Transparent, debuggable knowledge management for KHCC's curated clinical protocols |

**Connecting the Dots:** This session built a RAG toolbox in increasing sophistication. Lesson 1 gave you the baseline — the 5-stage pipeline that handles 80% of clinical lookup questions. Lesson 2 gave you the measurement discipline — without DeepEval scores, "improving" RAG is a guess. Lesson 3 added intelligence at the orchestration layer using the LangGraph patterns from Session 5 — agents that decide when to retrieve again. Lesson 4 added structural retrieval for multi-hop questions vector similarity cannot capture. Lesson 5 reframed everything: instead of more retrieval mechanisms, what if you compiled the knowledge once into a wiki? These are not five competing approaches — they are five points on a spectrum. Real KHCC systems will mix them: vector RAG for fast lookups, agentic patterns for complex questions, graph or wiki for relationship-heavy domains. The skill is choosing the right approach per question.

---

### Live Challenge — Pick the Right RAG

For each of these five Wilms tumor questions, pick the RAG approach you would build first and defend the choice as a group. There is rarely one right answer; the goal is to articulate the tradeoffs.

| # | Clinical question | Hint |
|---|---|---|
| 1 | "What is the recommended dose of vincristine in the standard regimen?" | Narrow lookup — single fact in a likely single chunk |
| 2 | "For a 4-year-old with stage III FH Wilms tumor and pre-existing renal impairment, what regimen modifications apply?" | Multi-hop, multiple conditions — staging × age × renal × regimen |
| 3 | "Which drugs in the standard regimen cause cardiotoxicity, and what monitoring is required?" | Multi-hop relationship — regimen → drugs → side effects → monitoring |
| 4 | "Summarize the major themes and complication categories across the entire guideline." | Thematic / global — no single chunk has the answer |
| 5 | "We have ten more KHCC-specific protocol PDFs to add over the next year and physicians want to query everything together with high transparency on provenance." | Long-term curation problem; each ingest should compound knowledge |

Suggested first-choices (debate these): (1) basic vector RAG; (2) agentic RAG with decomposition; (3) GraphRAG; (4) GraphRAG with community summaries; (5) Wiki approach.

**Stretch:** Pick one of your pipelines from Lessons 1–5, run it on questions 1–5, score with DeepEval, and compare the metrics across approaches. Highest-scoring student gets bragging rights.

---

### Common Mistakes & Gotchas

1. **Using a naive PyPDF parser on layout-heavy clinical PDFs** — multi-column reflow, dropped tables, lost figure captions. Always use a layout-aware parser like LlamaParse for clinical documents. Garbage parsing leads to garbage retrieval, no matter how good your embeddings are.

2. **Shipping RAG without measuring it** — confident-wrong answers in clinical contexts are patient-safety events. Build a small DeepEval test set from real clinical Q&A early, and gate every change to the pipeline on the metrics. If you cannot measure, you cannot improve.

3. **Reaching for agentic / graph / wiki when basic RAG would do** — extra patterns cost tokens, latency, and complexity. Start with basic RAG, measure, and add patterns only when the metrics show specific failures.

4. **Trusting the model to ignore its training data** — if your prompt does not explicitly say "answer ONLY from the retrieved context, and say 'I don't know' if the context is insufficient," the model will fall back to its training data. This destroys faithfulness. Be explicit in the prompt and verify with DeepEval.

5. **Forgetting that the index goes stale** — KHCC guidelines change. A RAG over a six-month-old index will confidently quote outdated dose schedules. Plan for re-indexing on every guideline update, and version-stamp your index so you can tell which version a given answer came from.

---

### Quick Self-Check (No-Code)

1. What are the five stages of a basic RAG pipeline, and which run at index time vs query time?
2. What does each of the four DeepEval metrics measure, and which is most important in a clinical setting?
3. When does agentic RAG with query rewriting earn its cost over basic RAG?
4. What kind of clinical question is GraphRAG well-suited to that vector RAG handles poorly?
5. What is the core philosophical difference between Karpathy's wiki approach and vector RAG?

<details>
<summary>Answers</summary>

1. Load → Split → Embed → Store → Retrieve. The first four run at index time (once when ingesting the document); Retrieve runs at query time (every question).
2. Faithfulness measures whether answer claims appear in retrieved context (catches hallucinations). Answer Relevancy measures whether the answer addresses the question. Contextual Relevancy measures whether retrieved chunks are on-topic. Contextual Recall measures whether the retriever found everything it should. In clinical settings, Faithfulness is most important — an unfaithful answer about a chemotherapy dose is a patient safety event.
3. When the user's natural language phrasing does not match the document's terminology (e.g., "weak kidneys" vs "renal impairment"). Query rewriting normalizes the question into terms close to the document, often improving retrieval more than any embedding upgrade.
4. Multi-hop questions — answers that require chaining multiple facts across distinct chunks (e.g., regimen → drugs → side effects). Vector similarity averages topics into noise; the graph encodes the join explicitly.
5. The wiki compiles knowledge once at ingest time into curated entity pages; vector RAG re-derives knowledge from raw chunks every query. The wiki shifts work from query time to ingest time.
</details>

---

### NotebookLM Notebook

Create a NotebookLM notebook for this session:
1. Paste all 5 lesson summaries as text sources
2. Add the National Wilms Tumor guideline PDF and Karpathy's wiki gist as sources
3. Generate an Audio Overview for pre-class listening
4. Use the notebook to quiz yourself on which RAG approach to pick for which question type

---

### What's Next

In Session 7, you will move from retrieval to **deployment and clinical validation**. Building a RAG that works in a Colab notebook is one milestone; deploying it as a service KHCC clinicians can actually use — with monitoring, audit logs, access control, and ongoing evaluation pipelines — is the next. You will also learn the regulatory and validation considerations that distinguish a research demo from a production clinical AI system.

---

## SESSION 6 ASSIGNMENT: Clinical Knowledge Retrieval System

**Due:** Before Session 7
**Estimated effort:** 5–7 hours
**Submission:** Push to your personal GitHub repo under `assignments/session-6/` and share the link with Dr. Iyad

---

### Clinical Scenario

> KHCC's outpatient oncology team needs a knowledge retrieval system grounded in authoritative oncology guidelines. Physicians frequently ask questions whose answers exist in long PDF protocols but are slow to look up during clinic. Your job is to build, evaluate, and harden a RAG system on a clinical guideline PDF that is NOT the Wilms tumor guideline used in class. You will demonstrate measurement discipline (DeepEval), agentic retrieval for complex questions, and one stretch implementation (GraphRAG or wiki approach) — and write a critical analysis comparing approaches on real multi-hop questions.

### Requirements

**Part 1 — Foundation (30%): Basic RAG over a New Clinical PDF**
Pick a clinical guideline PDF that was NOT used in class (suggested: NCCN guidelines for breast cancer, ESMO guidelines for colorectal cancer, or any other oncology guideline at least 30 pages long). Build a basic RAG that:
- Parses the PDF with **LlamaParse** (not PyPDF or PDFPlumber)
- Chunks with a justified strategy (semantic or fixed-size, document the choice)
- Embeds with `text-embedding-3-small` (or a HuggingFace biomedical embedding model — document choice)
- Stores in **ChromaDB**
- Wraps as a retriever and queries with an LLM via a clear "answer only from retrieved context" prompt
- Demonstrates at least 3 working clinical Q&A interactions
- Must produce a working Colab notebook

**Part 2 — Evaluation (30%): DeepEval on 5 Ground-Truth Pairs**
Create a clinical evaluation set:
- Author 5 question-answer pairs grounded in specific sections of YOUR PDF (with section/page references for ground truth)
- At least 2 questions should require multi-hop reasoning (information from multiple sections)
- Run your basic RAG on all 5
- Score with DeepEval on **all four metrics**: Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall
- Report per-question scores in a markdown table and identify which metric fails most often

**Part 3 — Agentic Upgrade (20%)**
Add ONE agentic capability to your pipeline:
- **Query rewriting** before retrieval (LangGraph node that reformulates the question), OR
- **Self-correction** (grade retrieved documents and re-retrieve with a refined query if grading fails)
Re-run DeepEval on the same 5 questions and compare metrics before vs after. Report a delta table and a 100–150 word interpretation of what changed and why.

**Part 4 — Stretch (20%)**
Pick ONE:
- **GraphRAG:** Extract a small knowledge graph (entities + relationships) from at least 5 chunks of YOUR PDF using an LLM. Build the graph in NetworkX. Answer at least 3 multi-hop questions by graph traversal and compare against your basic RAG answers on the same questions.
- **Wiki Approach:** Build a Karpathy-style wiki for YOUR PDF. Create at least 6 entity pages with cross-references, an index.md, and a log.md. Implement a maintainer-prompt LLM that ingests sections of the PDF and updates the right pages. Answer the same 3 multi-hop questions by reading the wiki and compare against your basic RAG.

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Code quality & correctness | 25% | Clean, runs without errors, proper LlamaParse + ChromaDB + LangChain/LangGraph usage | Runs with minor issues, some sloppy chunking or prompt design | Broken, non-runnable, or missing required components |
| Clinical relevance | 25% | Realistic clinical questions, ground truth grounded in actual PDF sections, meaningful multi-hop cases | Questions reasonable but generic, ground truth thin | Questions disconnected from clinical context or made up |
| Evaluation rigor (Parts 2, 3) | 25% | All four metrics reported, per-question table, clear interpretation of failures, before/after delta makes the agentic gain visible | Metrics reported but interpretation is shallow | Missing metrics or no before/after comparison |
| Stretch (Part 4) | 25% | Functioning GraphRAG or wiki with comparison against basic RAG on the same multi-hop questions; differences explained | Attempted but partial — graph too small or wiki uncurated | Not attempted |

### Anti-Shortcut Rules
- The PDF must NOT be the National Wilms Tumor guideline used in class — pick a genuinely different oncology document
- Your 5 evaluation Q&A pairs must include at least 2 multi-hop questions with section-level ground-truth references
- Part 3 must show the actual numeric DeepEval delta on your 5 questions (a screenshot or a markdown table — generic "metrics improved" is not acceptable)
- For the GraphRAG stretch, the graph must contain at least 8 distinct entities and at least 10 edges, all extracted from your PDF (not made up)
- For the wiki stretch, at least 6 entity pages with at least 3 cross-references each — and a working maintainer prompt that demonstrably edits at least 2 pages on a new ingest
- Include screenshots or printed output showing your pipeline answering each evaluation question

---

**KHCC connection:** This assignment mirrors the clinical knowledge retrieval system being scoped for KHCC outpatient oncology, where physicians need fast, grounded answers from authoritative protocol PDFs during clinic. The DeepEval discipline reflects the validation requirements for any AI system touching clinical decisions — measure before you ship, and keep measuring after. The choice between agentic, graph, and wiki approaches reflects real architectural decisions KHCC will face as the protocol corpus grows from one guideline to dozens.
