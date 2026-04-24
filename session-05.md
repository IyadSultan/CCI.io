---
layout: default
title: "Session 5"
permalink: /session-05/
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
    <h1>Session 5: LangChain / LangGraph, Tools &amp; Agents</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Replace the hand-rolled tool loop from Session 3 with LangChain, then graduate to LangGraph for stateful clinical workflows — tools, memory, multi-agent specialists, and human-in-the-loop approvals — so you can build auditable KHCC workflows that persist across patient encounters.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>LangChain v1 Foundations</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use <code>ChatOpenAI</code>, messages, and prompt templates through the Runnable interface</li>
      <li>Build a first agent with <code>create_agent</code> from <code>langgraph.prebuilt</code></li>
      <li>Compare LangChain to the raw OpenAI SDK loop you wrote in Session 3</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/87a0a4d3-b31a-4f2c-8b38-6dad25a7969d" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/practices/practice_lesson1_framework_decision.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Framework Decision
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_5/quizzes/quiz_lesson1_langchain_foundations.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session5/student/Lab1_LangChain_Foundations_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://python.langchain.com/docs/concepts/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LangChain concepts
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>Tools &amp; the Agent Loop</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Define tools with the <code>@tool</code> decorator — schemas from docstrings and type hints</li>
      <li>Trace the observe-reason-act loop and know when it terminates</li>
      <li>Add <code>handle_tool_error</code>, middleware, and guardrails for clinical resilience</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/447ba678-75e8-4eb0-8b64-b917b0c5261a" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/practices/practice_lesson2_tool_design.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Tool Design
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_5/quizzes/quiz_lesson2_tools_agent_loop.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session5/student/Lab2_Tools_Agent_Loop_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://python.langchain.com/docs/concepts/tools/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Tools docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>LangGraph &mdash; Stateful Clinical Workflows</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build a <code>StateGraph</code> with typed state, nodes, and edges</li>
      <li>Use conditional edges and <code>Command</code> for dynamic clinical routing</li>
      <li>Turn a triage decision pathway into an auditable, inspectable graph</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/ef66a671-f570-4e96-990c-a23de0de2bbd" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/practices/practice_lesson3_workflow_designer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Workflow Designer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_5/quizzes/quiz_lesson3_langgraph_workflows.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session5/student/Lab3_LangGraph_Workflows_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://langchain-ai.github.io/langgraph/tutorials/introduction/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LangGraph tutorial
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>Memory &amp; Persistence</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use threads + checkpointers (<code>MemorySaver</code>, <code>SqliteSaver</code>) for short-term memory</li>
      <li>Trim messages to stay within the model's context window without losing critical clinical info</li>
      <li>Persist cross-thread facts (allergies, preferences) with the long-term <code>Store</code></li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/b8898366-a3e2-476e-bf1e-d72597573a41" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/practices/practice_lesson4_memory_architect.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Memory Architect
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_5/quizzes/quiz_lesson4_memory_persistence.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session5/student/Lab4_Memory_Persistence_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://langchain-ai.github.io/langgraph/concepts/persistence/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Persistence docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Multi-Agent Patterns &amp; Human-in-the-Loop</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Implement orchestrator-worker and supervisor patterns with <code>create_agent</code> + <code>StateGraph</code></li>
      <li>Pause graphs with <code>interrupt()</code> and resume with <code>Command(resume=...)</code></li>
      <li>Design physician sign-off into irreversible clinical actions (like a tumor board workflow)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/1cb8c75b-674b-40b8-bee6-80c04b33795b" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/practices/practice_lesson5_multiagent_architect.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Multi-Agent Architect
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_5/quizzes/quiz_lesson5_multiagent_hitl.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session5/student/Lab5_MultiAgent_HITL_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HITL docs
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
      <p class="time">~15 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect LangChain, tools, LangGraph, memory, and multi-agent HITL into one workflow</li>
      <li>Review common pitfalls (vague docstrings, missing checkpointers, wrong `trim_messages`)</li>
      <li>Preview Session 6: retrieval-augmented generation for clinical documents</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-05/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Review
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/b520f921-2314-418b-8d69-7e6450bd68d7" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM: Summary
      </a>
      <a class="s1-btn s1-btn-resource" href="https://youtu.be/IVts6ztrkFg?si=eo0_y9z0LluIqhKw" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> What are Deep Agents?
      </a>
      <a class="s1-btn s1-btn-resource" href="https://youtu.be/5tn6O0uXYEg?si=pHkgC4ckI0lc64Lz" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Build a Research Agent with Deep Agents
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/tree/main/session5/student" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_5/assets/khcc_hospital_multiagent_langgraph.svg" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128202;</span> Architecture diagram (SVG)
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_5/references/langgraph_langchain_for_doctors.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128216;</span> LangChain &amp; LangGraph For doctors (reference book)
      </a>
      <a class="s1-btn s1-btn-skill" href="{{ site.baseurl }}/session_5/assets/langchain_graph_skill.zip" download>
        <span class="s1-btn-icon">&#11088;</span> Download Claude Skill (.zip)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://langchain-ai.github.io/langgraph/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> LangGraph docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 5 Assignment &mdash; Multi-Agent Clinical Workflow with Human Approval</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Build a Colab notebook that implements a <strong>multi-agent clinical review workflow</strong> in LangGraph with at least one <code>interrupt()</code> human-approval step. Define a <code>TypedDict</code> state, at least two specialist agents built with <code>create_agent</code> (for example a lab analyst and a guideline checker), a supervisor or orchestrator node that routes between them, and a <code>recommend</code> node whose output is held for physician sign-off via <code>interrupt()</code>. Use a <code>MemorySaver</code> checkpointer so the graph can be paused and resumed. Demonstrate both an approval path (<code>Command(resume=&quot;approved&quot;)</code>) and a rejection path that loops back with feedback. Finish with a written comparison to the Session 3 manual tool-calling loop covering lines of code, persistence, auditability, and safety — and recommend when to reach for <code>create_agent</code> vs a full <code>StateGraph</code> at KHCC.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.5rem;">
    <strong style="color:#FFC107;">Stretch options (pick one):</strong> swap <code>MemorySaver</code> for <code>SqliteSaver</code> and show state surviving a kernel restart, add a long-term <code>Store</code> that remembers patient allergies across threads, or add a third specialist agent (e.g. drug-interaction checker) with parallel dispatch via <code>send()</code>.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Code Quality (25%) &middot; Clinical Relevance (25%) &middot; Critical Analysis (25%) &middot; Stretch Challenge (25%)
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Hints &mdash; Common pitfalls to avoid</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Use integration packages, not legacy paths.</strong> Import <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">ChatOpenAI</code> from <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">langchain_openai</code>, not <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">langchain.chat_models</code>.</li>
      <li><strong style="color:#CFD8DC;">Write clear tool docstrings.</strong> The <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">@tool</code> decorator builds the tool schema from the docstring and type hints. A vague description ("does stuff with drugs") makes the model either over-call or never call your tool.</li>
      <li><strong style="color:#CFD8DC;">Compile before invoke.</strong> <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">graph = builder.compile(checkpointer=memory)</code> — forgetting <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">.compile()</code> gives an opaque "not callable" error.</li>
      <li><strong style="color:#CFD8DC;">Return partial state, not the full dict.</strong> A node should return <em>only</em> the keys it changed; returning the whole state can clobber updates from parallel nodes.</li>
      <li><strong style="color:#CFD8DC;"><code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">interrupt()</code> needs a checkpointer.</strong> Pass one when compiling (<code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">MemorySaver()</code> is fine for the lab), otherwise the graph can't save state during the pause and the interrupt will raise.</li>
      <li><strong style="color:#CFD8DC;">Same <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">thread_id</code> on resume.</strong> Pass the identical <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">config={"configurable": {"thread_id": "..."}}</code> when resuming with <code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.75rem;">Command(resume=...)</code>, or LangGraph will start a fresh conversation.</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 5 of 15
</div>
