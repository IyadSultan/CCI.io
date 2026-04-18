---
layout: page
title: "Lesson 6: Wrap-Up — Review & Consolidation"
permalink: /session-05/lesson-6-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-05/">&#8249; Back to Session 5</a>

# CCI Session 5 — Lesson 6: Wrap-Up — Review & Consolidation
**Estimated time:** 15 minutes
**Lab mode:** Review (NotebookLM + Colab recap)

---

## Session review

| Lesson | Topic | Core ideas | Clinical tie-in |
|--------|-------|------------|-----------------|
| 1 | LangChain v1 Foundations | `create_agent`, Runnables, `ChatOpenAI`, prompt templates | Replace the Session 3 manual tool loop with a framework |
| 2 | Tools & the Agent Loop | `@tool` decorator, schema from docstrings, error handling, middleware | Clinical tools (drug lookup, lab ranges, patient data) with graceful failure |
| 3 | LangGraph Stateful Workflows | `StateGraph`, `TypedDict`, nodes, conditional edges, `Command` | Auditable triage pathways with explicit branching |
| 4 | Memory & Persistence | Threads, checkpointers, `trim_messages`, long-term `Store` | Continuity of care across patient encounters |
| 5 | Multi-Agent & Human-in-the-Loop | Orchestrator–worker, supervisor, `interrupt()`, `Command(resume=...)` | Tumor-board style specialist handoffs with physician sign-off |

**Connecting the dots:** You moved from *writing* the tool-call loop by hand (Session 3) to *orchestrating* full clinical workflows with persistence, approvals, and multi-agent collaboration — the jump from script to system.

---

## Common mistakes

1. Importing from deprecated paths (`langchain.chat_models`) instead of integration packages (`langchain_openai`).
2. Writing a vague `@tool` docstring — the model cannot decide when to call it and either overuses or ignores it.
3. Forgetting to `.compile()` the `StateGraph` before calling `.invoke()`.
4. Using `MemorySaver` in production and losing state on restart — use `SqliteSaver` / `PostgresSaver`.
5. Calling `interrupt()` without a checkpointer configured — the graph has nowhere to save its paused state.
6. Building a multi-agent system when a single well-tooled agent would do. Start simple.

---

## NotebookLM review

Use your **Session 5 NotebookLM** (linked from the Session 5 main page) with sources such as this curriculum, the LangChain/LangGraph docs, and your Colab notebooks. Try *Audio Overview* and self-quiz in the chat about when to reach for `create_agent` vs a full `StateGraph`.

---

## What is next

**Session 6** layers **Retrieval-Augmented Generation (RAG)** on top of the agents you built here: embeddings, vector stores, and clinical document retrieval so your agents can cite KHCC guidelines, NCCN protocols, and patient records instead of relying on the model's pretraining alone.

---

## Assignment reminder

**Session 5 assignment:** Build a multi-agent clinical workflow in LangGraph with at least one `interrupt()` human-approval step, and submit via your course instructions (e.g. CCI Academy) before Session 6.
