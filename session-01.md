---
layout: default
title: "Session 1"
permalink: /session-01/
---

<style>
  .site-header { border-top: 5px solid #00897B !important; }
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
    <h1>Session 1: Foundations, Transformers &amp; Prompt Engineering</h1>
    <p class="meta">6 lessons &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Understand how LLMs work, write safer prompts for clinical tasks, and produce structured outputs for EHR-ready workflows.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>The LLM Revolution in Medicine</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Learn what LLMs can and cannot do in oncology settings</li>
      <li>Compare high-value use cases: summarization, extraction, patient communication</li>
      <li>Discuss safety boundaries and human-in-the-loop review</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=9b46dbcd-14f6-476e-be2f-856510779a55" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%201/practice/lesson1-flashcards.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Flashcards
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%201/quizzes/lesson1-quiz.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Take Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>The ROLES Framework</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use ROLES: Role, Objective, Layout, Examples, Safeguards</li>
      <li>Build prompts with predictable, repeatable sections</li>
      <li>Add clinical guardrails in every section</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=b15e8b42-8bf1-4d79-bd89-26dfa1f3290b" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%201/practice/lesson2-prompt-builder.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Prompt Builder
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%201/quizzes/lesson2-quiz.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Take Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Prompting Patterns</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Learn core patterns: zero-shot, few-shot, role prompting, step-by-step constraints</li>
      <li>Understand when to use examples in prompts</li>
      <li>Use prompt templates for repeatable results</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=b14d58bd-f8e5-49ff-a530-e7a70b0ad9c4" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%201/practice/lesson3-pattern-comparison.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Pattern Comparison
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%201/quizzes/lesson3-quiz.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Take Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>JSON Mode &amp; Structured Output</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Learn why structured output is needed for clinical pipelines</li>
      <li>Define a fixed schema for extraction (diagnosis, stage, medications)</li>
      <li>Validate JSON shape before using output downstream</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=2654187c-889b-493c-9538-15ff72e5bcaf" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%201/practice/lesson4-schema-designer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Schema Designer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%201/quizzes/lesson4-quiz.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Take Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Hallucination &amp; Prompt Sensitivity</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Define hallucination in simple clinical terms</li>
      <li>Learn how sensitivity/specificity thinking applies to model outputs</li>
      <li>Review grounding techniques: ask for evidence, source, and confidence</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=4641aae7-6ea6-40b2-8d24-e4bfe2e80751" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/Session%201/practice/lesson5-hallucination-detector.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Hallucination Detector
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/Session%201/quizzes/lesson5-quiz.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Take Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">6</div>
    <div>
      <h3>AI Prompting Revolution (Wrap-Up)</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect all Session 1 concepts into one end-to-end workflow</li>
      <li>Review best practices for safe prompting in clinical contexts</li>
      <li>Prepare for Session 2 with a small GitHub-ready exercise</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=d526af63-7c6d-4af0-b630-7db8dff9eef3" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Lesson
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 1 Assignment</h3>
  <ol>
    <li>Your best final prompt (using ROLES + grounding + JSON schema).</li>
    <li>One sample model output in valid JSON.</li>
    <li>A short reflection (5-7 lines) on what improved output quality.</li>
  </ol>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 1 of 15
</div>
