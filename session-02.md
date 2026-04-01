---
layout: default
title: "Session 2"
permalink: /session-02/
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
    <h1>Session 2: Python Basics + GitHub</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Learn core Python (variables, control flow, classes, pandas) and GitHub version control — building a foundation for clinical data pipelines and reproducible notebooks.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>Python Fundamentals &mdash; Variables, Types &amp; Control Flow</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Store patient data in variables, lists, and dictionaries</li>
      <li>Use if-statements, for-loops, and comparison operators</li>
      <li>Flag abnormal lab values programmatically</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/8b6d1e2f-e259-44b6-b5c8-4815050677b5" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%202/practices/practice_lesson1_code_fixer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Code Fixer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%202/quizzes/quiz_lesson1_python_fundamentals.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Lab1_Python_Fundamentals_Student.ipynb" target="_blank">
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
      <h3>Clinical Notebook Template &mdash; 9-Section Structure</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Follow the 9-section template: installs, imports, config, prompts, functions, main, CSV, email, summary</li>
      <li>Understand why each section exists and how it maps to auditability</li>
      <li>Build a reproducible, production-style Colab notebook</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/dd44ed5d-b7f4-4d08-81d5-4a0f77879171" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%202/practices/practice_lesson2_notebook_organizer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Notebook Organizer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%202/quizzes/quiz_lesson2_notebook_template.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Lab2_Notebook_Template_Student.ipynb" target="_blank">
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
      <h3>Python Classes &mdash; Modeling Clinical Data with Objects</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Create Patient and OncologyPatient classes with clinical methods</li>
      <li>Understand constructors (__init__), self, and instance variables</li>
      <li>Use inheritance to extend base classes with specialty-specific data</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/08f96553-e167-450f-aee5-f7096c9f8181" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%202/practices/practice_lesson3_flashcards.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: OOP Flashcards
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%202/quizzes/quiz_lesson3_python_classes.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Lab3_Python_Classes_Student.ipynb" target="_blank">
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
      <h3>Pandas Essentials &mdash; DataFrames, Analysis &amp; Merging</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Create DataFrames from patient data and filter with boolean indexing</li>
      <li>Merge multi-source clinical datasets (demographics + labs + meds) using join types</li>
      <li>Use groupby for summary statistics and export results to CSV</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/ffe542f3-020b-46af-b8fe-764a6b2200f4" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%202/practices/practice_lesson4_merge_decision.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Merge Decision Tree
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%202/quizzes/quiz_lesson4_pandas_merging.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Lab4_Pandas_Merging_Student.ipynb" target="_blank">
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
      <h3>GitHub Fundamentals &mdash; Version Control for Clinical Notebooks</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Create a GitHub repository and understand commits as snapshots</li>
      <li>Push Colab notebooks to GitHub with descriptive commit messages</li>
      <li>Use .gitignore to protect sensitive data and PHI</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/95ceb877-1add-4614-92cb-8d3bea352e6b" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%202/practices/practice_lesson5_git_workflow.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Git Workflow
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%202/quizzes/quiz_lesson5_github.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Lab5_GitHub_Setup_Student.ipynb" target="_blank">
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
      <p class="time">~10 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect all five lessons into one end-to-end workflow</li>
      <li>Review common mistakes: ==/=, missing colons, self, merge vs concat</li>
      <li>Prepare for Session 3 (SQL + databases)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-02/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/tree/main/session2/students" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 2 Assignment &mdash; The Complete Clinical Intake Pipeline</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Build a Python notebook that automates KHCC's outpatient oncology intake: create a PatientIntake class with clinical methods, process 15+ patients through a pandas pipeline (merge, filter, groupby), export three CSV reports, and push to GitHub with descriptive commits. Includes a critical analysis of limitations and a stretch challenge.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Code Quality (25%) &middot; Clinical Relevance (25%) &middot; Critical Analysis (25%) &middot; Stretch Challenge (25%)
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
    <a href="https://github.com/IyadSultan/CCI/blob/main/session2/students/Assignment_Clinical_Intake_Student.ipynb" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:rgba(255,255,255,0.12);color:#FFE082;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:1px solid rgba(255,255,255,0.2);" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
      Assignment Notebook &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 2 of 15
</div>
