---
layout: page
title: "Lesson 1: Basic RAG with LlamaParse"
permalink: /session-06/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-06/">&#8249; Back to Session 6</a>

# CCI Session 6 -- Lesson 1: Basic RAG with LlamaParse -- Parse, Chunk, Embed, Retrieve

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Welcome to Session 6. Over the past five sessions you have learned prompt engineering, Python, the OpenAI API, HuggingFace models, and the LangChain v1 framework with stateful LangGraph agents. Today we tackle one of the most important real-world patterns in clinical AI: Retrieval-Augmented Generation, or RAG. The core problem RAG solves is simple but critical at KHCC -- a base GPT-4o-mini does not know the contents of our internal protocols, the National Wilms Tumor Study (NWTS) treatment guidelines, or any KHCC-specific clinical pathway. If you ask it about risk-adapted chemotherapy dosing for a Stage III favorable-histology Wilms tumor, it will either hallucinate or give a generic textbook answer that ignores the document we actually want to follow. RAG fixes this by retrieving the relevant pages from our PDF guidelines at query time and giving them to the LLM as grounded context. In this first lesson you will build the complete RAG pipeline end-to-end on the WT.pdf treatment guideline -- parse with LlamaParse, chunk with a recursive splitter, embed with OpenAI's text-embedding-3-small, store in ChromaDB, and retrieve with a similarity search. By the end you will have a working assistant that can answer questions grounded in the actual Wilms tumor protocol our pediatric oncology team uses.

---

## NotebookLM Summary

**Class notebook (Lesson 1):** [Open in NotebookLM](https://notebooklm.google.com/notebook/f47e638f-168a-4625-a39f-7ba9c21e99d9)

Retrieval-Augmented Generation (RAG) is a pattern that injects external knowledge into a language model at inference time. Instead of fine-tuning the model or hoping it memorized your documents, you store your documents in a searchable index, retrieve only the most relevant chunks for each user question, and pass those chunks into the prompt as context. The LLM then answers using both its general knowledge and the retrieved evidence. For clinical AI at KHCC this matters because protocols like the National Wilms Tumor Study guideline are too long to fit in a single prompt, change over time, and must be cited verbatim for safety. RAG gives you a clear chain from answer back to source page.

A RAG pipeline has five stages. **Document loaders** ingest source files -- LlamaParse is purpose-built for complex clinical PDFs because it preserves tables, multi-column layouts, and figure captions that naive parsers like PyPDF flatten or skip. For WT.pdf this matters because the staging tables and chemotherapy regimen tables would otherwise be lost. **Text splitters** break long documents into chunks small enough to embed but large enough to be self-contained. The most common is `RecursiveCharacterTextSplitter` with chunk sizes around 800-1200 tokens and 100-200 token overlap so context is not severed at chunk boundaries. **Embeddings** convert each chunk into a dense vector. OpenAI's `text-embedding-3-small` produces 1536-dimensional vectors at low cost and is the practical default for most clinical RAG projects. **Vector stores** index those vectors for similarity search. ChromaDB is a lightweight, open-source option that runs in-process and persists to disk, which is ideal for a Colab tutorial or a single-clinic deployment. Production deployments at scale move to Pinecone, Weaviate, or pgvector. **Retrievers** wrap the vector store with a clean interface -- `vectorstore.as_retriever(search_kwargs={"k": 4})` returns the top-4 chunks for any query.

The final piece is the generation chain. In LangChain v1 you compose a retriever, a prompt template that includes a `{context}` variable, a chat model, and an output parser into a single Runnable using the pipe operator. When the user asks "What is the chemotherapy regimen for Stage III favorable-histology Wilms tumor?", the retriever pulls the relevant pages from WT.pdf, the prompt stuffs them into the context window, and the model produces a grounded answer. This is the foundation that the rest of Session 6 builds on.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add **WT.pdf** as a source (upload the file, or download it from the repo after `git clone` as in *Before Class*), and ask for an Audio Overview of the Wilms tumor treatment protocol so you arrive at class already familiar with the document.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Optional primer:** Worked notebook **Lab 0 — Search spectrum** (exact match through lexical search to semantic retrieval and a tiny RAG): [Open in Colab](https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session6/solutions/Lab0_Search_Spectrum_Solutions.ipynb) · [GitHub](https://github.com/IyadSultan/CCI/blob/main/session6/solutions/Lab0_Search_Spectrum_Solutions.ipynb)
- **Read:** LangChain RAG tutorial (Part 1): <https://python.langchain.com/docs/tutorials/rag/>
- **Skim:** LlamaParse documentation introduction: <https://docs.cloud.llamaindex.ai/llamaparse/getting_started>
- **Get `WT.pdf` (National Wilms Tumor guideline):** The file lives in the course repo under `session_6/data/WT.pdf`. **In Google Colab**, clone the repo once per runtime so that path exists on disk:
  - Run: `!git clone --depth 1 https://github.com/IyadSultan/CCI.io.git`
  - Then use path: `/content/CCI.io/session_6/data/WT.pdf` (see [data/README.md](https://github.com/IyadSultan/CCI.io/blob/main/session_6/data/README.md) for copy-paste checks).
  - **Locally:** if you already cloned `CCI.io`, open `session_6/data/WT.pdf` from your working tree.
  - Skim the PDF table of contents -- staging, histology, regimens (EE-4A, DD-4A, Regimen I, Regimen M) -- these are what your RAG must retrieve well.
- **Warm-up question:** If a fellow asks GPT-4o-mini "What is the recommended therapy for a 4-year-old with Stage III favorable-histology Wilms tumor with loss of heterozygosity at 1p and 16q?", why might the answer be unsafe to act on without RAG? Write down two specific risks.

### During Class -- What to Focus On

1. **Why parsing matters** -- compare what LlamaParse extracts from a chemotherapy dosing table in WT.pdf versus what `PyPDFLoader` extracts. The difference is the difference between a useful clinical assistant and a dangerous one.
2. **Chunk size trade-offs** -- larger chunks preserve context but dilute relevance; smaller chunks are more precise but may sever a sentence mid-dose. For clinical guidelines, 800-1200 tokens with 150 overlap is a reasonable starting default.
3. **Embedding the question vs the document** -- both go through the same embedding model. The vector store finds chunks whose vectors are closest (cosine similarity) to the question vector.
4. **The prompt template's `{context}` slot** -- this is where retrieved chunks are stuffed before the LLM sees the question. The system message should explicitly tell the model to answer only from the provided context and to cite the page or section.

**Common traps:**

- Forgetting to persist ChromaDB -- if you do not pass a `persist_directory` your index dies with the kernel.
- Using a different embedding model at index time and at query time -- the vectors are not comparable. Always store the embedding model name with the index.
- Stuffing too many chunks (`k=20`) into context -- this dilutes the answer and increases cost. Start with `k=4`.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install `langchain`, `langchain-openai`, `langchain-community`, `chromadb`, and `llama-parse`. Set your `OPENAI_API_KEY` and `LLAMA_CLOUD_API_KEY` from Colab secrets.
2. Use `LlamaParse` to parse WT.pdf into LangChain `Document` objects. Print the first 500 characters of two documents and confirm tables are preserved as Markdown.
3. Apply `RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)` to produce chunks. Print how many chunks were produced and inspect chunk 0 and chunk 10.
4. Embed all chunks with `OpenAIEmbeddings(model="text-embedding-3-small")` and store them in a Chroma vector store with `persist_directory="./wt_chroma"`.
5. Build a retrieval chain: `prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()`, where `prompt` includes a `{context}` and `{question}` placeholder and a system instruction to cite the source page.
6. Ask three clinical questions about WT.pdf: (a) "What is the staging system for Wilms tumor?", (b) "What is the chemotherapy regimen for Stage III favorable histology?", (c) "When is radiation therapy indicated?" Compare the grounded RAG answer to a plain `ChatOpenAI` call without retrieval.

**Extra practice (optional):**

- Try `chunk_size=500` and `chunk_size=2000` and observe how answer quality changes.
- Swap `text-embedding-3-small` for `text-embedding-3-large` and measure retrieval quality on the same questions.

**Self-check questions:**

1. What are the five stages of a basic RAG pipeline, and what does each produce?
2. Why is LlamaParse preferred over PyPDFLoader for WT.pdf specifically?
3. What happens if you index documents with one embedding model and query with another?

### Resources

| Resource | Link |
|----------|------|
| **RAG Quest** (interactive — be the retriever) | [Open in browser]({{ site.baseurl }}/session_6/practices/rag_game.html) |
| **Lab 0 solutions — Search spectrum** (exact → RAG): [Colab](https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session6/solutions/Lab0_Search_Spectrum_Solutions.ipynb) · [GitHub](https://github.com/IyadSultan/CCI/blob/main/session6/solutions/Lab0_Search_Spectrum_Solutions.ipynb) | Optional primer before Lab 1 |
| **Lab 1 solutions (instructor / after class)** — [Open in Colab](https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session6/solutions/Lab1_Basic_RAG_LlamaParse_Solutions.ipynb) · [View on GitHub](https://github.com/IyadSultan/CCI/blob/main/session6/solutions/Lab1_Basic_RAG_LlamaParse_Solutions.ipynb) | Same notebook as the student lab, fully worked |
| Colab + `session_6/data/` (clone + `WT.pdf` path) | <https://github.com/IyadSultan/CCI.io/blob/main/session_6/data/README.md> |
| LangChain RAG Tutorial | <https://python.langchain.com/docs/tutorials/rag/> |
| LlamaParse Getting Started | <https://docs.cloud.llamaindex.ai/llamaparse/getting_started> |
| OpenAI Embeddings Guide | <https://platform.openai.com/docs/guides/embeddings> |
| ChromaDB Docs | <https://docs.trychroma.com/> |
| RecursiveCharacterTextSplitter | <https://python.langchain.com/docs/how_to/recursive_text_splitter/> |
| Children's Oncology Group Wilms Protocols (background) | <https://www.childrensoncologygroup.org/> |
