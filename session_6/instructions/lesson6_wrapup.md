---
layout: page
title: "Lesson 6: RAG & Clinical Retrieval — Review"
permalink: /session-06/lesson-6-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 6: Review &amp; Consolidation

**Estimated time:** 20 minutes  
**Lab mode:** Discussion + NotebookLM review (no new Colab)

---

## NotebookLM review

Use the **Session 6** notebooks below (one per lesson). Each is grounded on that lesson&apos;s materials — try *Audio Overview*, flashcards, and chat self-quiz before the assignment.

| Lesson | Topic | NotebookLM |
|--------|-------|--------------|
| 1 | Basic RAG with LlamaParse | [Open notebook](https://notebooklm.google.com/notebook/f47e638f-168a-4625-a39f-7ba9c21e99d9) |
| 2 | RAG Evaluation with DeepEval | [Open notebook](https://notebooklm.google.com/notebook/a931223a-e147-4e0e-849a-c09e31bd7db5) |
| 3 | Agentic RAG with LangGraph | [Open notebook](https://notebooklm.google.com/notebook/efa06fa9-5c74-46e0-9b35-423b47e74002) |
| 4 | GraphRAG — Knowledge Graphs | [Open notebook](https://notebooklm.google.com/notebook/9939af33-a948-440e-8893-3049af84e0ca) |
| 5 | The Wiki Approach (Karpathy) | [Open notebook](https://notebooklm.google.com/notebook/dd0d26da-a9c7-4633-8b6a-ae5eb03a0704) |
| 6 | Session review &amp; consolidation | [Open notebook](https://notebooklm.google.com/notebook/391b5876-e522-45e4-9fbe-af316f5b1461) |

**Tip:** Ask the chat *when to use basic vector RAG vs agentic RAG vs GraphRAG vs a wiki* for a given clinical question shape.

### Worked lab solutions (CCI repo)

After class you can compare your notebooks to the **worked solutions** for Session 6 labs ([full folder on GitHub](https://github.com/IyadSultan/CCI/tree/main/session6/solutions)). There is **no separate Lab 6 notebook** — Lesson 6 is review — but **Lab 1’s solution notebook** is here: [Lab1_Basic_RAG_LlamaParse_Solutions.ipynb](https://github.com/IyadSultan/CCI/blob/main/session6/solutions/Lab1_Basic_RAG_LlamaParse_Solutions.ipynb) · [Open in Colab](https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session6/solutions/Lab1_Basic_RAG_LlamaParse_Solutions.ipynb). Labs 0–5 each have a matching `*_Solutions.ipynb` in that folder.

---

## Session arc (one paragraph)

You moved from **basic RAG** (parse → chunk → embed → retrieve → answer) through **DeepEval** metrics (faithfulness, relevancy, recall), then **agentic RAG** with LangGraph (rewrite, grade, re-retrieve), then **GraphRAG** for multi-hop relations, and finally the **wiki / catalog** mindset (curated markdown updated at ingest time). The assignment asks you to repeat this discipline on a **new** clinical PDF with measurement and one stretch pattern.

---

## Live challenge — pick the right RAG

In class, use the wrap-up notebook or the curriculum &quot;Pick the Right RAG&quot; table: for each Wilms-tumor-style question, defend which pattern you would ship first and what metric would prove you wrong. Full prompt list lives in `session_6/session_6_curriculum.md` near the end of Lesson 6.

---

## Assignment reminder

**Session 6 assignment:** Build, evaluate, and extend a RAG system on a **non–Wilms-tumor** clinical guideline PDF (see full rubric in the course repo `session_6/session_6_curriculum.md` — *Session 6 Assignment*). Submit per your instructor (e.g. GitHub + CCI Academy) before Session 7.

---

## What is next

**Session 7** moves from retrieval notebooks to **deployment, validation, and clinical safety** — turning a working RAG into something KHCC could responsibly operate.
