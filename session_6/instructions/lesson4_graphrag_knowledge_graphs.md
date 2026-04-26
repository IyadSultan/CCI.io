---
layout: page
title: "Lesson 4: GraphRAG — Knowledge Graphs"
permalink: /session-06/lesson-4-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 4: GraphRAG -- Knowledge Graphs for Clinical Knowledge

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

By Lesson 3 your RAG system handles single-document, mostly-local questions on the Wilms tumor guideline well. But a class of clinical questions still fails -- and they fail no matter how clever your retriever or your agent is. These are *multi-hop* and *thematic* questions. "Across all chemotherapy regimens in this protocol, which one has the highest cumulative anthracycline dose?" cannot be answered by retrieving a single chunk because no single chunk contains the answer -- the answer requires aggregating facts from chunks describing each of EE-4A, DD-4A, Regimen I, and Regimen M, then comparing. "What are the recurring themes around late effects in this protocol?" is similar -- it asks for a synthesis across the entire document, not retrieval of a specific passage. Vector RAG is bad at both because cosine similarity on individual chunks does not surface the structural relationships between entities. GraphRAG, introduced by Microsoft Research in 2024, addresses this by extracting entities and relationships from your documents into a knowledge graph, clustering related entities into communities, and then routing queries to either a local graph traversal (for entity-specific questions) or a global community-summary aggregation (for thematic questions). In this lesson you will build a small in-memory NetworkX graph from WT.pdf, see when GraphRAG dramatically beats vector RAG, and -- equally important -- see when it does not justify the engineering cost.

---

## NotebookLM Summary

**Class notebook (Lesson 4):** [Open in NotebookLM](https://notebooklm.google.com/notebook/9939af33-a948-440e-8893-3049af84e0ca)

GraphRAG is a retrieval architecture that supplements or replaces vector similarity search with a graph of entities and their relationships extracted from the source corpus. The pipeline has four stages. First, **entity extraction** uses an LLM to read each chunk and emit structured entities and relationships -- in the Wilms tumor domain these include drugs (Vincristine, Dactinomycin, Doxorubicin), regimens (EE-4A, DD-4A, Regimen I, Regimen M), stages (I, II, III, IV, V), histologies (Favorable, Diffuse Anaplastic, Focal Anaplastic), and procedures (Nephrectomy, Radiation), with relationships like `EE-4A INCLUDES Vincristine` or `Stage_III TREATED_WITH DD-4A`. Second, **graph construction** loads these triples into a graph database -- Neo4j for production, NetworkX for in-memory tutorials and small documents. Third, **community detection** runs an algorithm like Leiden or Louvain to cluster densely connected entities into communities, and an LLM generates a natural-language summary of each community. For WT.pdf you might end up with a "Stage III favorable histology treatment" community grouping the regimen, drugs, dosing, and indications. Fourth, **query-time routing** distinguishes local from global queries. Local queries ("What dose of Doxorubicin is in Regimen DD-4A?") traverse the graph from the named entity. Global queries ("What are the cross-cutting themes around late cardiac effects?") aggregate community summaries.

The strength of GraphRAG is precisely the weakness of vector RAG: it can answer questions that require *combining* facts spread across the document. A vector store sees "Doxorubicin 45 mg/m^2 in Regimen DD-4A" and "Doxorubicin 30 mg/m^2 in Regimen I" as two unrelated chunks. The graph sees them as two edges from the Doxorubicin node and lets you compute the total cumulative exposure across a treatment plan. The cost is real engineering work -- entity extraction is LLM-expensive, graphs require schema design, and community summarization runs once per document update. For a static guideline like WT.pdf the upfront cost amortizes; for rapidly changing patient notes it may not.

NetworkX is the right starting point for clinical teams because it runs in-process, has no infrastructure, and lets you visualize the graph in Colab with `matplotlib`. You define a `MultiDiGraph`, add nodes with type attributes (drug, regimen, stage), add typed edges, and traverse with `networkx.descendants` or `networkx.shortest_path`. For a small protocol document this is enough; for the entire KHCC clinical knowledge base you would migrate to Neo4j.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com) and ask it to draw a mind map of the WT.pdf entities -- this is essentially a hand-drawn knowledge graph that previews what the LLM extractor will produce.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Data:** Fresh Colab runtime? Clone the repo so **`WT.pdf`** is available: `!git clone --depth 1 https://github.com/IyadSultan/CCI.io.git` → `/content/CCI.io/session_6/data/WT.pdf`. Guide: <https://github.com/IyadSultan/CCI.io/blob/main/session_6/data/README.md>
- **Read:** Microsoft GraphRAG introduction: <https://microsoft.github.io/graphrag/> and the launch blog: <https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/>
- **Skim:** NetworkX tutorial introduction: <https://networkx.org/documentation/stable/tutorial.html>
- **Warm-up exercise:** On paper, sketch the entities and relationships you would expect to extract from the Wilms tumor regimen tables. Use boxes for entities (drugs, regimens, stages) and arrows for relationships. This is the schema you will implement in NetworkX.

### During Class -- What to Focus On

1. **Local vs global queries** -- the most important distinction in GraphRAG. Local queries name a specific entity; global queries ask about themes. Different retrieval strategies, different prompts.
2. **Schema first** -- decide on entity types (Drug, Regimen, Stage, Histology, Procedure, Side_Effect) and relationship types before extraction. Unschematized extraction produces a mess of synonyms.
3. **Community detection intuition** -- think of communities as topical clusters. The Stage III favorable histology cluster, the late effects cluster, the relapse therapy cluster. Each gets an LLM-generated paragraph summary.
4. **Cost reality** -- entity extraction over a 50-page PDF can be a few dollars in API calls. Cache aggressively and version the extracted graph in git.

**Common traps:**

- Letting the LLM invent synonymous entities -- "Adriamycin", "Doxorubicin", and "Dox" become three separate nodes. Use entity resolution or constrain the LLM with a fixed vocabulary.
- Building a graph for a use case that vector RAG already handles -- if your questions are all local-factual, GraphRAG is overkill.
- Skipping community summaries -- without them you cannot answer global queries efficiently.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install `networkx`, `matplotlib`, and reuse your existing LangChain and OpenAI installs.
2. Define a Pydantic schema for entities (`name`, `type`, `description`) and relationships (`source`, `target`, `relation`, `description`). Constrain `type` to a fixed Wilms-tumor vocabulary.
3. For each chunk from your WT.pdf parse, call `ChatOpenAI(model="gpt-4o-mini").with_structured_output()` to extract entities and relationships. Aggregate across chunks, deduplicating by entity name.
4. Build a `networkx.MultiDiGraph`. Add nodes and edges. Visualize with `nx.draw_networkx`.
5. Implement two retrieval functions: (a) `local_query(entity_name, question)` -- pull the entity, its neighbors at distance 1-2, and pass them as context to GPT-4o-mini; (b) `global_query(question)` -- detect communities with `nx.community.louvain_communities`, summarize each with an LLM, and pass the summaries as context.
6. Compare on three questions: (a) "What drugs are in Regimen DD-4A?" (local), (b) "Which regimen has the highest cumulative anthracycline dose?" (multi-hop), (c) "What are the recurring themes around treatment toxicity in this protocol?" (global). Run each through basic RAG (Lesson 1) and through GraphRAG. Where does each shine?

**Extra practice (optional):**

- Persist the graph as a `.gml` or `.json` file so it can be re-loaded without re-extraction.
- Try the same pipeline on a second short clinical PDF and merge the two graphs.

**Self-check questions:**

1. What kind of question is GraphRAG demonstrably better at than vector RAG, and why?
2. What are the four stages of the GraphRAG pipeline?
3. Name two scenarios where GraphRAG is *not* worth the engineering cost.

### Resources

| Resource | Link |
|----------|------|
| Microsoft GraphRAG | <https://microsoft.github.io/graphrag/> |
| GraphRAG Launch Blog | <https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/> |
| NetworkX Tutorial | <https://networkx.org/documentation/stable/tutorial.html> |
| LangChain Graph Transformers | <https://python.langchain.com/docs/how_to/graph_constructing/> |
| Leiden Community Detection | <https://www.nature.com/articles/s41598-019-41695-z> |
| Neo4j for Clinical Knowledge Graphs | <https://neo4j.com/use-cases/life-sciences/> |
