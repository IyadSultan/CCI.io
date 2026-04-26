---
layout: page
title: "Lesson 2: RAG Evaluation with DeepEval"
permalink: /session-06/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 2: RAG Evaluation with DeepEval

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

In Lesson 1 you built a working RAG pipeline on the Wilms tumor guideline. It feels like it works -- you ask a question, you get an answer that sounds plausible, and the answer cites WT.pdf. But "feels like it works" is not a standard you can take to a tumor board. In clinical AI we need to know quantitatively: is this system retrieving the right pages? Is the answer faithful to those pages, or is it hallucinating? Is the answer actually addressing the question, or wandering? Lesson 2 introduces DeepEval, an open-source LLM evaluation framework modeled on pytest, and the four canonical RAG metrics: Faithfulness, Answer Relevancy, Contextual Relevancy, and Contextual Recall. Together these four numbers tell you both whether your retriever is doing its job and whether your generator is doing its job, and they pinpoint exactly which half is broken when the system fails. You will build a small test set of clinician-style questions about WT.pdf, run DeepEval against both a deliberately bad RAG (chunk size 100, k=1) and the good RAG from Lesson 1, and see the metrics drop and rise accordingly. By the end you will have a reusable evaluation harness that any future RAG change at KHCC must pass before going live.

---

## NotebookLM Summary

**Class notebook (Lesson 2):** [Open in NotebookLM](https://notebooklm.google.com/notebook/a931223a-e147-4e0e-849a-c09e31bd7db5)

Evaluating a RAG system means answering two distinct questions. First, did the retriever find the relevant context? Second, given that context, did the generator produce a faithful and on-topic answer? DeepEval, an open-source Python framework that mirrors the structure of pytest, decomposes RAG quality into four metrics that map cleanly onto these two questions. Each metric is computed by an LLM-as-judge -- typically GPT-4o-mini -- which receives the question, the retrieved context, the generated answer, and (for some metrics) a ground-truth reference, and returns a score between 0 and 1 along with a textual rationale.

**Faithfulness** measures whether the generated answer is supported by the retrieved context. The judge breaks the answer into atomic claims and checks each claim against the context. A score below 0.8 typically signals hallucination -- the model is asserting things the retrieved chunks do not say. **Answer Relevancy** measures whether the answer actually addresses the question that was asked. A model can produce a faithful answer that is also off-topic; this metric catches that. **Contextual Relevancy** asks whether the retrieved chunks are pertinent to the question. Low scores here mean the retriever is pulling noise -- this is a retriever problem, not a generator problem. **Contextual Recall** requires a ground-truth reference answer and asks whether the retrieved context contains the information needed to produce that reference. Low recall means the right pages are not being surfaced even if the chunks that are surfaced are on-topic.

The diagnostic value of these four metrics together is what makes them powerful. If Faithfulness is high but Contextual Recall is low, your retriever is missing the right pages and your generator is honestly admitting it does not know. If Faithfulness is low but Contextual Relevancy is high, your retriever is fine but your generator is hallucinating beyond the evidence. If Answer Relevancy is low across the board, your prompt template is letting the model wander. For a Wilms tumor RAG system this maps directly onto clinical safety -- a faithful but recall-poor system silently misses indications for radiation therapy, while a faithful, high-recall system can be trusted to either answer or escalate.

The workflow is to assemble a `test_set` of `LLMTestCase` objects with input, actual_output, retrieval_context, and expected_output, then call `evaluate(test_cases, metrics)`. DeepEval prints a per-metric pass/fail table and an aggregate score. You version this test set in git alongside your RAG code, and any pull request that drops a metric below threshold gets blocked.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com) along with WT.pdf and ask it to generate 10 clinician-style Q&A pairs you can use as your test set seed.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Read:** DeepEval introduction and metrics overview: <https://docs.confident-ai.com/docs/getting-started> and <https://docs.confident-ai.com/docs/metrics-introduction>
- **Skim:** The RAGAS paper or blog summary on the four-metric RAG evaluation framework (DeepEval and RAGAS use the same conceptual metrics): <https://docs.ragas.io/en/stable/concepts/metrics/index.html>
- **Warm-up exercise:** Write down five clinical questions about Wilms tumor that a KHCC pediatric oncology fellow might realistically ask. For each, write the ideal answer in one sentence. This will become your test set seed.

### During Class -- What to Focus On

1. **The retriever vs generator split** -- Faithfulness and Answer Relevancy evaluate the generator; Contextual Relevancy and Contextual Recall evaluate the retriever. Knowing which side of the pipeline a low metric indicts is the whole point.
2. **LLM-as-judge limitations** -- the judge is itself a model and can be wrong. Always sanity-check failing test cases by reading the rationale.
3. **Ground truth construction** -- Contextual Recall and any reference-based metric need a human-curated `expected_output`. Spend the time to write these carefully; they are the source of truth.
4. **Bad RAG vs good RAG** -- watch the metrics move when you change `chunk_size`, `k`, or the embedding model. This is your evidence base for design decisions.

**Common traps:**

- Building a test set of only easy questions -- your metrics will look great but tell you nothing.
- Using the same model as both generator and judge -- this biases scores upward. Use GPT-4o for judging when your generator is GPT-4o-mini.
- Treating a 0.85 score as "good enough" without inspecting the 15% of failing cases. In clinical AI the failure modes matter more than the average.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install `deepeval` and authenticate with your OpenAI key.
2. Construct a list of 10 `LLMTestCase` objects covering Wilms tumor staging, histology, chemotherapy regimens, radiation indications, surgical timing, and follow-up. For each, populate `input`, `expected_output`, and (you will fill `actual_output` and `retrieval_context` from your RAG pipeline).
3. Wire your good RAG pipeline from Lesson 1 to populate `actual_output` and `retrieval_context` for each test case.
4. Run `evaluate(test_cases, [FaithfulnessMetric(), AnswerRelevancyMetric(), ContextualRelevancyMetric(), ContextualRecallMetric()])`. Inspect the report.
5. Build a deliberately bad RAG: `chunk_size=100`, `chunk_overlap=0`, `k=1`. Re-run the same 10 test cases through it. Compare the four metrics side by side.
6. Pick the test case with the largest gap and read both rationales. Identify whether the bad RAG failed at the retriever or generator stage.

**Extra practice (optional):**

- Add a `BiasMetric` and a `ToxicityMetric` to verify your clinical assistant does not produce biased or harmful content.
- Export the test set as JSON so it can live in version control.

**Self-check questions:**

1. Which two metrics evaluate the retriever, and which two evaluate the generator?
2. If Faithfulness is 0.95 but Contextual Recall is 0.40, what is the system doing wrong and what should you change?
3. Why is it bad practice to use the same LLM as both the generator under test and the judge?

### Resources

| Resource | Link |
|----------|------|
| DeepEval Documentation | <https://docs.confident-ai.com/docs/getting-started> |
| DeepEval RAG Metrics | <https://docs.confident-ai.com/docs/metrics-introduction> |
| RAGAS Conceptual Reference | <https://docs.ragas.io/en/stable/concepts/metrics/index.html> |
| LLM-as-Judge Best Practices | <https://huggingface.co/learn/cookbook/en/llm_judge> |
| RAG Failure Modes (Pinecone blog) | <https://www.pinecone.io/learn/series/rag/rag-evaluation/> |
