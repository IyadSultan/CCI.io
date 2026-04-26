---
layout: page
title: "Lesson 5: The Wiki Approach (Karpathy)"
permalink: /session-06/lesson-5-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 5: The Wiki Approach -- RAG Without Retrieval

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

You have now built three increasingly sophisticated RAG systems on the Wilms tumor guideline -- basic vector RAG, agentic RAG with grading and rewriting, and GraphRAG with entity extraction and community detection. Each adds capability and adds complexity. In this final lesson we step back and look at a fourth approach that is in some ways the most radical and in some ways the simplest: Andrej Karpathy's "wiki" or "catalog" approach to RAG, sketched in his 2024 gist. The core insight is that vector RAG re-derives an answer to your question every time it is asked, by re-retrieving and re-stuffing context. But for a stable knowledge base like a clinical guideline, almost everything worth knowing can be *compiled once* into a structured wiki -- an index, a set of entity pages, a log of changes -- by an LLM acting as a wiki maintainer. Then queries become *navigation* of that wiki, not retrieval over chunks. There is no embedding model, no vector store, no chunking. The pages are just markdown files. For a small, stable corpus like WT.pdf this can be more transparent, more debuggable, and -- surprisingly -- more accurate than vector RAG, because the LLM has already done the synthesis work offline. It does not scale to millions of documents and it requires updating when the source changes, but for KHCC clinical pathways and protocols it is a profoundly underused pattern.

---

## NotebookLM Summary

**Class notebook (Lesson 5):** [Open in NotebookLM](https://notebooklm.google.com/notebook/dd0d26da-a9c7-4633-8b6a-ae5eb03a0704)

Andrej Karpathy's wiki approach to RAG, published as a gist in 2024, reframes the entire retrieval problem. Standard RAG re-derives an answer per query by retrieving chunks and prompting an LLM with them. The wiki approach instead has an LLM compile the corpus -- once, offline -- into a human-readable wiki structured as markdown files. Queries are answered by navigating that wiki. The structure is deliberately simple. An `index.md` is the table of contents -- a list of entity pages with one-line descriptions. A `log.md` records the LLM's reasoning about what entities were extracted and why, providing an audit trail. Then there is one markdown file per major entity. For a Wilms tumor wiki built from WT.pdf you would have `regimen_EE-4A.md`, `regimen_DD-4A.md`, `regimen_I.md`, `regimen_M.md`, `histology_favorable.md`, `histology_diffuse_anaplastic.md`, `stage_III.md`, `radiation_indications.md`, and so on. Each entity page is a self-contained synthesis -- not a chunk of the source, but a clean rewriting of everything the source says about that entity, with citations back to page numbers.

The compile step is straightforward. You load WT.pdf, you give an LLM a system prompt that says "You are a wiki maintainer. Read this source and produce an `index.md` listing every clinically meaningful entity, then produce one markdown page per entity that synthesizes everything the source says about it, with page citations." You iterate -- the LLM proposes the index, you approve or edit, then it generates pages. You version the resulting wiki in git. The wiki itself becomes the artifact you ship.

Querying is then dead simple. The user's question goes to an LLM with the `index.md` in context. The LLM picks one or two relevant entity pages, those pages are loaded into context (they are usually 500-2000 words each), and the LLM answers. There is no embedding similarity, no chunk boundary issue, no retrieval recall metric to worry about -- if the entity exists in the index, it will be found.

The pros are real. Transparency: you can read the wiki yourself and verify it. Debuggability: if an answer is wrong, you fix the entity page and the next query is correct forever. No infrastructure: no vector store, no embedding model, no API at index time. The cons are also real. It does not scale to a million documents because the index itself becomes too large for context. It requires re-compilation when the source changes. And it depends on the LLM's ability to do good synthesis at compile time -- garbage in, garbage out. For KHCC's stable clinical pathways and a few canonical protocols, these trade-offs strongly favor the wiki approach.

> **NotebookLM tip:** This lesson essentially asks you to build, by hand, what NotebookLM does internally for you. Compare your hand-built Wilms tumor wiki to NotebookLM's auto-generated study guide for WT.pdf and note what each captures.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Data:** Fresh Colab runtime? Clone the repo so **`WT.pdf`** is available: `!git clone --depth 1 https://github.com/IyadSultan/CCI.io.git` → `/content/CCI.io/session_6/data/WT.pdf`. Guide: <https://github.com/IyadSultan/CCI.io/blob/main/session_6/data/README.md>
- **Read:** Karpathy's wiki/catalog gist: <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>
- **Skim:** Any internal clinical wiki or pathway document you have access to at KHCC. Notice how the human authors structured it -- index, entity pages, cross-references. The LLM is going to do the same thing.
- **Warm-up exercise:** On paper, write what you think the `index.md` of a Wilms tumor wiki should contain. Aim for 15-25 entries grouped by category (regimens, histologies, stages, procedures, side effects, follow-up).

### During Class -- What to Focus On

1. **Compile-once vs re-derive-per-query** -- this is the conceptual pivot. Vector RAG is the latter; wiki is the former. Understand why each fits different problems.
2. **The index as the retrieval mechanism** -- in the wiki approach, the index is your retriever. If something is not in the index, it cannot be answered. So index quality is everything.
3. **LLM as wiki maintainer** -- the prompt that compiles the wiki is the most important prompt in the system. It defines structure, level of detail, citation style, and synthesis depth.
4. **When to use this** -- small, stable, high-value corpora. Clinical guidelines. Internal SOPs. Drug formulary entries. Not patient notes, not the literature.

**Common traps:**

- Letting the LLM produce entity pages that are just chunks of the source pasted in. The whole point is synthesis. Verify the pages are rewritten, not extracted.
- Skipping the log. Without the reasoning log you cannot tell why an entity was included or excluded.
- Trying to use the wiki approach on a corpus that changes daily. The compile cost dominates.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Reuse your LlamaParse output of WT.pdf from Lesson 1. Concatenate the parsed text into a single string (it should fit in a 128k context window).
2. Write a system prompt that instructs GPT-4o (use the larger model here -- this is a one-time compile) to produce an `index.md` listing all clinically meaningful entities in WT.pdf, grouped by category, with one-line descriptions and a slug for each.
3. For each entity in the index, prompt GPT-4o to produce a self-contained `entity_<slug>.md` page that synthesizes everything the source says about that entity, with `[p. N]` page citations.
4. Save all files to a `wt_wiki/` directory and commit them.
5. Build a query function: load `index.md`, send it with the user question to GPT-4o-mini, ask it to return the slugs of the 1-3 most relevant entity pages. Load those pages, pass them with the question to GPT-4o-mini, and return the answer.
6. Run the same three questions from Lesson 4 through (a) basic RAG, (b) GraphRAG, and (c) the wiki approach. Build a four-row comparison table: question, basic RAG answer, GraphRAG answer, wiki answer, and your subjective rating of each.

**Extra practice (optional):**

- Add a `log.md` that records the index decisions and the synthesis decisions for each entity.
- Add cross-reference links between entity pages so the wiki is navigable as a hypertext.

**Self-check questions:**

1. What is the central conceptual difference between the wiki approach and vector RAG?
2. Why does the wiki approach not scale to a million documents?
3. For which kinds of KHCC clinical content is the wiki approach the right tool, and for which is it the wrong tool?

### Resources

| Resource | Link |
|----------|------|
| Karpathy Wiki/Catalog Gist | <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f> |
| NotebookLM (reference implementation of the idea) | <https://notebooklm.google.com> |
| LangChain Long-Context Patterns | <https://python.langchain.com/docs/how_to/long_context_reorder/> |
| GPT-4o Long Context Documentation | <https://platform.openai.com/docs/models/gpt-4o> |
| Markdown for Technical Documentation | <https://www.markdownguide.org/basic-syntax/> |
