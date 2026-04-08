---
layout: default
title: "Session 3"
permalink: /session-03/
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
    <h1>Session 3: Data Science Foundations &mdash; SQL, Python &amp; LLMs</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Use the OpenAI API from Python to extract structured clinical data, build conversation memory with tool calling, load KHCC vitals into SQL, and create a text-to-SQL interface that lets clinicians query databases in plain English.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>OpenAI API Fundamentals</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Make API calls to GPT from Python using the OpenAI SDK</li>
      <li>Control model behavior with temperature, max_tokens, and system messages</li>
      <li>Count tokens with tiktoken and estimate costs for clinical pipelines</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-03/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/ff83b40d-a4f4-412f-ba96-ec0ba22f6213" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%203/practices/practice_lesson1_api_configurator.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: API Configurator
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%203/quizzes/quiz_lesson1_openai_api.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session3/student/Lab1_OpenAI_API_Fundamentals_Student.ipynb" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>Structured Output &amp; Clinical Data Extraction</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use JSON mode and Pydantic structured outputs for guaranteed schemas</li>
      <li>Extract diagnoses, medications, and staging from oncology notes into typed JSON</li>
      <li>Handle edge cases with Optional fields and few-shot extraction examples</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-03/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/c4ef1b4b-19ed-46e1-9dcf-8b8a30175af6" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%203/practices/practice_lesson2_clinical_extraction.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Clinical Extraction
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%203/quizzes/quiz_lesson2_structured_output.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session3/student/Lab2_Structured_Output_Extraction_Student.ipynb" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Conversation Memory &amp; Tool Calling</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build conversation memory by maintaining a messages list across API calls</li>
      <li>Define tools that the model can request to call for external data access</li>
      <li>Implement the complete tool calling flow: request, execute, respond</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-03/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/0da40b49-dfe6-4864-87b3-ab13e2fcef60" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%203/practices/practice_lesson3_tool_calling.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Tool Calling
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%203/quizzes/quiz_lesson3_memory_tools.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session3/student/Lab3_Memory_and_Tool_Calling_Student.ipynb" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>From CSV to SQL &mdash; Clinical Data Foundations</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Load KHCC VistA vitals and patient CSVs into pandas and SQLite</li>
      <li>Write SQL queries with WHERE, GROUP BY, and ORDER BY for clinical insights</li>
      <li>Use JOIN queries to combine patient demographics with vital sign data</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-03/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/37a15ab1-cdad-43a8-b6a2-a240a6be9111" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%203/practices/practice_lesson4_sql_challenges.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: SQL Challenges
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%203/quizzes/quiz_lesson4_csv_to_sql.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session3/student/Lab4_CSV_to_SQL_Student.ipynb" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Text-to-SQL &mdash; Talk to Your Data</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build a text-to-SQL pipeline that converts natural language to SQL queries</li>
      <li>Use schema descriptions and few-shot examples for accurate SQL generation</li>
      <li>Add safety validation and natural language answer formatting</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-03/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/689890e8-e19b-413a-8ac0-fbb3f8d1367c" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%203/practices/practice_lesson5_text_to_sql_pipeline.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Text-to-SQL Pipeline
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%203/quizzes/quiz_lesson5_text_to_sql.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session3/student/Lab5_Text_to_SQL_Student.ipynb" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
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
      <li>Connect all five lessons into one end-to-end clinical data pipeline</li>
      <li>Review common mistakes: token limits, temperature settings, SQL validation</li>
      <li>Prepare for Session 4 (HuggingFace and open-source models)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/2cfcf240-a9ce-4d4f-b7dc-432ccf11dab7" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM: Summary
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/tree/main/session3/student" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 3 Assignment &mdash; Clinical Medication Report Pipeline</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Build a complete pharmacy pipeline: load synthetic medication CSV data into SQL, extract drug interactions from consultation notes using Pydantic structured output, and create a text-to-SQL interface for pharmacists to query medication orders in plain English. Includes critical analysis of clinical risks and a stretch challenge with tool calling or benchmarking.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Code Quality (25%) &middot; Clinical Relevance (25%) &middot; Critical Analysis (25%) &middot; Stretch Challenge (25%)
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 3 of 15
</div>
