---
layout: page
title: "Lesson 3: Agentic RAG with LangGraph"
permalink: /session-06/lesson-3-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 3: Agentic RAG with LangGraph

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

The basic RAG pipeline you built in Lesson 1 has a fundamental weakness: it always retrieves once, with the user's raw question, and always answers from whatever it retrieved -- even when the retrieved chunks are off-topic, incomplete, or contradict each other. For simple questions this is fine. For real clinical questions it breaks. Consider a fellow asking "Is radiation indicated for a Stage III favorable-histology Wilms tumor patient who had spillage during nephrectomy?" -- this is a multi-condition query that may require pulling chunks about Stage III indications, about spillage, and about radiation thresholds, then reasoning across them. A single retrieval with k=4 is unlikely to surface all three. Agentic RAG fixes this by giving the LLM control over the retrieval process itself. The model can rewrite the query, judge whether the retrieved context is sufficient, decompose the question into sub-questions, or re-retrieve with a refined query if the first pass fails. LangGraph -- which you met briefly in Session 5 -- is the natural framework for this because agentic RAG is fundamentally a stateful graph with conditional edges. In this lesson you will build a retrieve→grade→answer-or-re-retrieve loop on top of your Wilms tumor RAG and see, with the same DeepEval metrics from Lesson 2, that complex multi-condition clinical questions improve substantially.

---

## NotebookLM Summary

**Class notebook (Lesson 3):** [Open in NotebookLM](https://notebooklm.google.com/notebook/efa06fa9-5c74-46e0-9b35-423b47e74002)

Basic RAG is a one-shot pipeline: query in, retrieve once, answer. Agentic RAG turns RAG into a loop where the LLM is an active participant in retrieval, not just a passive consumer of whatever the vector store returned. Four canonical patterns dominate the literature. **Query rewriting** has the LLM rephrase a vague or conversational user question into a precise retrieval query before searching -- "what about radiation for that case?" becomes "Indications for radiation therapy in Stage III favorable-histology Wilms tumor with intraoperative tumor spillage". **Self-RAG grading** has the LLM evaluate each retrieved chunk for relevance and discard noise before generating; only chunks that pass the grade reach the answer prompt. **Corrective RAG (CRAG)** combines grading with a fallback: if too few chunks pass the relevance grade, the system rewrites the query and retrieves again, possibly from a different source. **Multi-step decomposition** breaks a compound question into sub-questions, retrieves and answers each independently, then synthesizes a final answer.

LangGraph is the right framework for these patterns because every one of them is a state graph with conditional edges. You define a `TypedDict` state with fields like `question`, `documents`, `generation`, and `iterations`. You define nodes -- `retrieve`, `grade_documents`, `generate`, `rewrite_query` -- each of which is a function that takes the state and returns an updated state. Then you wire them with edges and conditional edges. After `grade_documents` runs, a conditional edge routes to `generate` if enough chunks passed the grade and to `rewrite_query` otherwise, capping the loop at three iterations to prevent runaway costs.

The simplest useful agentic RAG, and the one we build in this lesson, is a retrieve→grade→answer-or-re-retrieve loop. The grader is a small LLM call that returns "yes" or "no" for each retrieved document against the question. If at least two documents pass, we generate. If fewer pass, we ask the LLM to rewrite the query and we retrieve again. If after three iterations we still cannot get two passing documents, we return "I cannot answer this from the available guideline" -- which, for a clinical assistant, is the correct safe behavior.

The cost trade-off is real. Agentic RAG can use 3-5x the tokens of basic RAG because of the grading and rewriting calls. For a Wilms tumor assistant this is acceptable for complex reasoning queries but wasteful for simple factual lookups. A common production pattern is to route queries by complexity -- simple lookups go to basic RAG, multi-condition or ambiguous queries go to agentic RAG.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com) and ask it to generate a mind map of the four agentic RAG patterns so you can see when to reach for each.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Read:** LangGraph Agentic RAG tutorial: <https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_agentic_rag/>
- **Skim:** The Self-RAG paper abstract (Asai et al., 2023): <https://arxiv.org/abs/2310.11511> and the CRAG paper (Yan et al., 2024): <https://arxiv.org/abs/2401.15884>
- **Warm-up question:** Write down a Wilms tumor question your basic RAG from Lesson 1 answered poorly. Why do you think it failed -- bad query phrasing, missing context, or generator issue? Predict whether agentic RAG would help.

### During Class -- What to Focus On

1. **State as a TypedDict** -- in LangGraph, state is the data that flows through the graph. For agentic RAG it includes the question, current retrieved documents, current generation, and an iteration counter.
2. **Conditional edges** -- the difference between a basic chain and an agent is the conditional edge. After grading, the graph branches based on the grade outcome.
3. **Iteration cap** -- always bound the loop. Three retries is usually enough; without a cap you can burn dollars on a single bad question.
4. **Graceful failure** -- a clinical agent that says "I cannot answer this from the guideline" is safer than one that confabulates. Make the safe-refusal path a first-class node.

**Common traps:**

- Forgetting that conditional edges return the *name of the next node*, not a boolean. A common bug is returning True/False from the routing function.
- Letting the grader use the same prompt as the generator -- the grader needs a tight, structured prompt that returns only "yes" or "no" per document.
- Not logging the path through the graph -- when an answer surprises you, you need to know whether you took the rewrite branch.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Define a `GraphState` `TypedDict` with `question: str`, `documents: list`, `generation: str`, and `iterations: int`.
2. Implement four node functions: `retrieve`, `grade_documents`, `generate`, `rewrite_query`. Reuse your Wilms tumor Chroma retriever from Lesson 1.
3. Build the graph with `StateGraph(GraphState)`. Add the four nodes. Wire `retrieve → grade_documents`. Add a conditional edge from `grade_documents` that routes to `generate` if at least two documents passed and to `rewrite_query` otherwise. Wire `rewrite_query → retrieve` (the loop). Cap iterations at 3 by routing to `generate` with whatever documents you have if `iterations >= 3`.
4. Compile the graph and invoke it on three complex Wilms tumor questions: (a) "Is radiation indicated for a Stage III favorable-histology patient with intraoperative tumor spillage?", (b) "How does treatment differ for diffuse anaplastic histology vs favorable histology at Stage III?", (c) "What follow-up imaging is recommended after completion of Regimen DD-4A?".
5. Run the same three questions through your basic RAG from Lesson 1.
6. Score both with DeepEval (the four metrics from Lesson 2) and present a comparison table.

**Extra practice (optional):**

- Add a query-rewriting node that runs *before* the first retrieval to clean up conversational phrasing.
- Add a sub-question decomposition node for compound questions joined by "and".

**Self-check questions:**

1. What two LangGraph primitives are most important for agentic RAG, and what does each do?
2. Why must you cap the rewrite-and-retry loop, and what is a reasonable cap?
3. When is basic RAG sufficient, and when should you reach for agentic RAG?

### Resources

| Resource | Link |
|----------|------|
| LangGraph Agentic RAG Tutorial | <https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_agentic_rag/> |
| Self-RAG Paper | <https://arxiv.org/abs/2310.11511> |
| CRAG Paper | <https://arxiv.org/abs/2401.15884> |
| LangGraph Conditional Edges | <https://langchain-ai.github.io/langgraph/concepts/low_level/#conditional-edges> |
| LangChain Query Rewriting Patterns | <https://python.langchain.com/docs/how_to/query_constructing_filters/> |
