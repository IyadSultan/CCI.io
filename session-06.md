---
layout: default
title: "Session 6"
permalink: /session-06/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #00897B !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #00897B !important; font-weight: 800 !important; }
  .page-content { padding-top: 0 !important; }

  .s1-header {
    padding: 1.75rem 0;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .s1-header .back {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #00897B;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #B2DFDB;
    background: #E0F2F1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover {
    background: #B2DFDB;
  }

  .s1-header-text h1 {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1B2A4A;
    margin: 0;
    line-height: 1.25;
  }

  .s1-header-text .meta {
    font-size: 0.78rem;
    color: #90A4AE;
    margin: 0.2rem 0 0;
  }

  .s1-goal {
    background: linear-gradient(135deg, #E0F2F1, #E8EAF6);
    border: 1px solid #B2DFDB;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #00695C;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.3rem;
  }

  .s1-goal p {
    margin: 0;
    font-size: 0.88rem;
    color: #37474F;
    line-height: 1.55;
  }

  .s1-lesson {
    border: 1px solid #E0E0E0;
    border-radius: 0.85rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .s1-lesson:hover {
    border-color: #B0BEC5;
  }

  .s1-lesson-head {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.25rem;
    background: #FAFAFA;
    border-bottom: 1px solid #F0F0F0;
  }

  .s1-lesson-num {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  .s1-lesson-head h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #263238;
    line-height: 1.3;
  }

  .s1-lesson-head .time {
    font-size: 0.7rem;
    color: #90A4AE;
    margin: 0.1rem 0 0;
  }

  .s1-lesson-body {
    padding: 1rem 1.25rem;
  }

  .s1-lesson-body .goals-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #78909C;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 0.4rem;
  }

  .s1-lesson-body ul {
    margin: 0 0 1rem;
    padding-left: 1.1rem;
    list-style: none;
  }

  .s1-lesson-body ul li {
    font-size: 0.85rem;
    color: #455A64;
    line-height: 1.5;
    margin-bottom: 0.25rem;
    position: relative;
    padding-left: 0.2rem;
  }

  .s1-lesson-body ul li::before {
    content: "▸";
    position: absolute;
    left: -1rem;
    color: #B0BEC5;
  }

  .s1-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .s1-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.85rem;
    border-radius: 0.5rem;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.15s ease;
    border: 1px solid;
  }

  .s1-btn:visited { color: inherit; }

  .s1-btn-notebook {
    background: #FFF8E1;
    border-color: #FFE082;
    color: #F57F17 !important;
  }

  .s1-btn-notebook:hover {
    background: #FFECB3;
    transform: translateY(-1px);
  }

  .s1-btn-practice {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }

  .s1-btn-practice:hover {
    background: #C8E6C9;
    transform: translateY(-1px);
  }

  .s1-btn-quiz {
    background: #E3F2FD;
    border-color: #90CAF9;
    color: #1565C0 !important;
  }

  .s1-btn-quiz:hover {
    background: #BBDEFB;
    transform: translateY(-1px);
  }

  .s1-btn-instructions {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #7B1FA2 !important;
  }

  .s1-btn-instructions:hover {
    background: #E1BEE7;
    transform: translateY(-1px);
  }

  .s1-btn-colab {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }

  .s1-btn-colab:hover {
    background: #FFE0B2;
    transform: translateY(-1px);
  }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }

  .s1-btn-resource:hover {
    background: #CFD8DC;
    transform: translateY(-1px);
  }

  .s1-btn-skill {
    background: #FFF3E0;
    border-color: #FFB74D;
    color: #BF360C !important;
  }

  .s1-btn-skill:hover {
    background: #FFE0B2;
    transform: translateY(-1px);
  }

  .s1-btn-icon {
    font-size: 0.9rem;
    line-height: 1;
  }

  .s1-assignment {
    background: #1B2A4A;
    color: #fff;
    border-radius: 0.85rem;
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .s1-assignment h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: #FFC107;
  }

  .s1-assignment ol {
    margin: 0;
    padding-left: 1.25rem;
    color: #CFD8DC;
    font-size: 0.85rem;
    line-height: 1.7;
  }

  .s1-footer-note {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    font-size: 0.72rem;
    color: #B0BEC5;
    border-top: 1px solid #ECEFF1;
    margin-top: 2rem;
  }
</style>

<div class="s1-header">
  <a class="back" href="{{ site.baseurl }}/">&#8249; Home</a>
  <div class="s1-header-text">
    <h1>Session 6: RAG &amp; Clinical Document Retrieval</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Build and evaluate retrieval-augmented pipelines on real clinical PDFs &mdash; from basic vector RAG and DeepEval metrics through agentic LangGraph patterns, GraphRAG, and the wiki/catalog mindset &mdash; so you can choose the right retrieval strategy at KHCC and prove it with measurements, not vibes.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>Basic RAG with LlamaParse</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run the five-stage RAG pipeline: load, split, embed, store, retrieve</li>
      <li>Use LlamaParse for layout-heavy PDFs (Wilms tumor guideline)</li>
      <li>Ground answers with ChromaDB + <code>text-embedding-3-small</code></li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/f47e638f-168a-4625-a39f-7ba9c21e99d9" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_6/practices/practice_lesson1_pipeline_builder.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Pipeline Builder
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_6/quizzes/quiz_lesson1_basic_rag.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_6/data/WT.pdf" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> WT.pdf (guideline)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/CCI.io/blob/main/session_6/data/README.md" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128190;</span> Colab: clone repo for <code>data/</code>
      </a>
      <a class="s1-btn s1-btn-resource" href="https://python.langchain.com/docs/tutorials/rag/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LangChain RAG tutorial
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.cloud.llamaindex.ai/llamaparse/getting_started" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LlamaParse docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>RAG Evaluation with DeepEval</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Interpret faithfulness, answer relevancy, contextual relevancy, and contextual recall</li>
      <li>Build a small clinical Q&amp;A gold set tied to PDF sections</li>
      <li>Compare &quot;bad&quot; vs &quot;good&quot; chunking with measurable deltas</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/a931223a-e147-4e0e-849a-c09e31bd7db5" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_6/practices/practice_lesson2_score_the_rag.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Score the RAG
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_6/quizzes/quiz_lesson2_deepeval.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.confident-ai.com/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> DeepEval docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Agentic RAG with LangGraph</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Add query rewriting, grading, and corrective re-retrieval loops</li>
      <li>Model the flow as a LangGraph <code>StateGraph</code> with conditional edges</li>
      <li>Know when agentic RAG earns its extra latency and cost</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/efa06fa9-5c74-46e0-9b35-423b47e74002" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_6/practices/practice_lesson3_agentic_designer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Agentic Designer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_6/quizzes/quiz_lesson3_agentic_rag.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_agentic_rag/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LangGraph agentic RAG
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>GraphRAG &mdash; Knowledge Graphs</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Extract entities and relations from guideline text into a graph</li>
      <li>Query with multi-hop traversals (NetworkX for teaching scale)</li>
      <li>Contrast vector RAG vs graph answers on relational questions</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/9939af33-a948-440e-8893-3049af84e0ca" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_6/practices/practice_lesson4_extract_kg.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Extract KG
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_6/quizzes/quiz_lesson4_graphrag.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://microsoft.github.io/graphrag/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Microsoft GraphRAG
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>The Wiki Approach (Karpathy)</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Understand ingest-time compilation vs query-time vector search</li>
      <li>Sketch index.md, entity pages, and maintainer prompts</li>
      <li>Articulate tradeoffs vs embedding-first RAG at KHCC scale</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/dd0d26da-a9c7-4633-8b6a-ae5eb03a0704" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_6/practices/practice_lesson5_design_wiki.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Design Wiki
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_6/quizzes/quiz_lesson5_wiki_approach.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Karpathy wiki gist
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">6</div>
    <div>
      <h3>Wrap-Up &mdash; Review &amp; Consolidation</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Map clinical question shapes to RAG patterns (vector, agentic, graph, wiki)</li>
      <li>Review common failure modes (parse quality, stale index, over-trust)</li>
      <li>Preview Session 7: deployment, monitoring, and validation</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-06/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Review
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/391b5876-e522-45e4-9fbe-af316f5b1461" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM: Summary
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI.io/tree/main/session_6" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/CCI.io/blob/main/session_6/session_6_curriculum.md" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Full curriculum (markdown)
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 6 Assignment &mdash; Clinical Knowledge Retrieval System</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Build, evaluate, and harden a <strong>RAG system</strong> on a <strong>new</strong> oncology guideline PDF (not the in-class Wilms file). Use <strong>LlamaParse</strong>, justified chunking, <strong>ChromaDB</strong>, and an &quot;answer only from retrieved context&quot; prompt. Add a <strong>DeepEval</strong> suite on five grounded Q&amp;A pairs (all four metrics). Implement <strong>one agentic upgrade</strong> (query rewrite or grade-and-retry) and report metric deltas. For the stretch, add either a small <strong>GraphRAG</strong> slice or a <strong>Karpathy-style wiki</strong>. Full rubric and submission instructions: <code>session_6/session_6_curriculum.md</code> on the course repo.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.5rem;">
    <strong style="color:#FFC107;">Due:</strong> Before Session 7 &middot; <strong style="color:#FFC107;">Effort:</strong> ~5&ndash;7 hours &middot; <strong style="color:#FFC107;">Submit:</strong> per Dr. Iyad / CCI Academy (GitHub <code>assignments/session-6/</code> per curriculum).
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading (typical):</strong> Code &amp; correctness &middot; Clinical relevance &middot; Critical analysis &middot; Stretch (GraphRAG or wiki) &mdash; see rubric table in the curriculum file.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Hints &mdash; Common pitfalls to avoid</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Parsing quality gates everything.</strong> If you skip LlamaParse for a layout-heavy PDF, DeepEval will blame the retriever when the real bug is garbage text.</li>
      <li><strong style="color:#CFD8DC;">Same embedding model at index and query.</strong> Mixing models makes vectors incomparable &mdash; answers look random.</li>
      <li><strong style="color:#CFD8DC;">Version your index.</strong> Note which PDF build and chunk settings produced each score so you can audit &quot;which guideline&quot; an answer came from.</li>
      <li><strong style="color:#CFD8DC;">Faithfulness first in clinic.</strong> High answer relevancy with low faithfulness is still unsafe; design prompts to refuse when context is thin.</li>
      <li><strong style="color:#CFD8DC;">Do not ship agentic/graph/wiki complexity without a metric win.</strong> Show before/after tables so the extra cost is justified.</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
    <a href="https://github.com/IyadSultan/CCI.io/blob/main/session_6/session_6_curriculum.md" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:rgba(255,255,255,0.12);color:#ECEFF1;font-weight:600;font-size:0.85rem;text-decoration:none;border:1px solid rgba(255,255,255,0.25);">
      Assignment rubric on GitHub &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 6 of 15
</div>
