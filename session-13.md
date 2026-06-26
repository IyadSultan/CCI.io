---
layout: default
title: "Session 13"
permalink: /session-13/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #1565C0 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #1565C0 !important; font-weight: 800 !important; }
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
    color: #1565C0;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #90CAF9;
    background: #E3F2FD;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #BBDEFB; }

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
    background: linear-gradient(135deg, #E3F2FD, #E8EAF6);
    border: 1px solid #90CAF9;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #1565C0;
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

  .s1-prereq {
    background: #FFF8E1;
    border: 1px solid #FFE082;
    border-radius: 0.75rem;
    padding: 0.85rem 1.25rem;
    margin-bottom: 2rem;
    font-size: 0.82rem;
    color: #5D4037;
    line-height: 1.55;
  }

  .s1-prereq strong { color: #1565C0; }

  .s1-lesson {
    border: 1px solid #E0E0E0;
    border-radius: 0.85rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .s1-lesson:hover { border-color: #B0BEC5; }

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

  .s1-lesson-body { padding: 1rem 1.25rem; }

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

  .s1-btn-instructions {
    background: #E3F2FD;
    border-color: #64B5F6;
    color: #1565C0 !important;
  }
  .s1-btn-instructions:hover { background: #BBDEFB; transform: translateY(-1px); }

  .s1-btn-practice {
    background: #E8EAF6;
    border-color: #9FA8DA;
    color: #283593 !important;
  }
  .s1-btn-practice:hover { background: #C5CAE9; transform: translateY(-1px); }

  .s1-btn-quiz {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }
  .s1-btn-quiz:hover { background: #C8E6C9; transform: translateY(-1px); }

  .s1-btn-handout {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }
  .s1-btn-handout:hover { background: #FFE0B2; transform: translateY(-1px); }

  .s1-btn-notebook {
    background: #FFF8E1;
    border-color: #FFE082;
    color: #F57F17 !important;
  }
  .s1-btn-notebook:hover { background: #FFECB3; transform: translateY(-1px); }

  .s1-btn-video {
    background: #FCE4EC;
    border-color: #F48FB1;
    color: #C62828 !important;
  }
  .s1-btn-video:hover { background: #F8BBD9; transform: translateY(-1px); }

  .s1-btn-icon { font-size: 0.9rem; line-height: 1; }

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
    color: #64B5F6;
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
    <h1>Session 13: Ethics, Governance &amp; MLOps for Clinical AI</h1>
    <p class="meta">2 lessons + cheat sheet &middot; Interactive practice &amp; quizzes &middot; NotebookLM videos &middot; no code &middot; ~1.5 hours</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Session 12 locked the technical front door — encryption, PHI, hardened servers. Session 13 asks the questions that come next: <em>should</em> this system exist, <em>who</em> might it harm, and <em>how</em> does a model survive real hospital operations after the notebook ends? In plain language — <strong>no coding</strong> — you will learn the 2024 ethical guidelines for healthcare AI research and the MLOps lifecycle for deploying models in clinical practice. You leave ready for the capstone with a shared vocabulary: pillars, gates, monitoring, and kill switches.</p>
</div>

<div class="s1-prereq">
  <strong>Pre-session homework:</strong> Complete Session 12 (security, PHI, synthetic data). Skim your Session 10–11 ER-triage app notes — we will reference it as a running example. Watch each lesson's <strong>NotebookLM video</strong> before class. No new accounts or repos required. &middot; <strong>Clinical anchor:</strong> any AI that touches patient data or ward workflow — triage, documentation, trial matching, imaging assist. &middot; <strong>Safety rule:</strong> ethics and MLOps discussions use synthetic or published scenarios only — never real patient identifiers in assignments.
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1565C0;">1</div>
    <div>
      <h3>Ethical Guidelines for Healthcare Artificial Intelligence Research (2024)</h3>
      <p class="time">~45 min &middot; concept + pillar-matcher practice</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Name the six ethical pillars: protect data, safety, fairness, transparency, accountability, human oversight</li>
      <li>Apply governance gates from idea → data → development → evaluation → pilot → scale</li>
      <li>Recognize ethics red flags in vendor pitches and internal project proposals</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_13/instructions/lesson1_ethical_guidelines_hai_2024/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions
      </a>
      <a class="s1-btn s1-btn-video" href="https://notebooklm.google.com/notebook/73d19d4b-8819-4bbf-bed8-fa0d6de8c324" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> NotebookLM Video
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/73d19d4b-8819-4bbf-bed8-fa0d6de8c324" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_13/practices/practice_lesson1_ethical_guidelines_hai_2024.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Which Pillar Breaks First?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_13/quizzes/quiz_lesson1_ethical_guidelines_hai_2024.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#0D47A1;">2</div>
    <div>
      <h3>MLOps: Deploying Machine Learning Models in Clinical Practice</h3>
      <p class="time">~45 min &middot; concept + lifecycle ordering practice</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Sketch the clinical ML loop: define → data → train → validate → deploy → monitor → retrain or retire</li>
      <li>Explain why ML fails quietly (drift) and what to monitor in production</li>
      <li>Connect MLOps artifacts (model card, versioning, rollback) to the ethics pillars from Lesson 1</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_13/instructions/lesson2_mlops_clinical_deployment/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions
      </a>
      <a class="s1-btn s1-btn-video" href="https://notebooklm.google.com/notebook/7d147aee-fe22-4de7-b280-c6202203a999" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> NotebookLM Video
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/7d147aee-fe22-4de7-b280-c6202203a999" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_13/practices/practice_lesson2_mlops_clinical_deployment.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Order the MLOps Lifecycle
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_13/quizzes/quiz_lesson2_mlops_clinical_deployment.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Cheat Sheet ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">&#9733;</div>
    <div>
      <h3>Cheat Sheet + What to Carry Into the Capstone</h3>
      <p class="time">~15 min &middot; one-page reference + reflection</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Session takeaways</p>
    <ul>
      <li><strong>Ethics:</strong> six pillars — not a slide at the end; operational consent, subgroup fairness, named owners</li>
      <li><strong>Gates:</strong> idea, data, pilot, scale — each needs a show-me answer before you advance</li>
      <li><strong>MLOps:</strong> validate before deploy; monitor before you trust; version everything; rehearse rollback</li>
      <li><strong>Capstone prep:</strong> every project pitch needs pillar check, validation plan, MLOps owner, and kill switch</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_13/cheat_sheet/" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Printable Cheat Sheet
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 13 Assignment &mdash; Ethics + MLOps Brief</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Using your Session 10–11 ER-triage app (or another course project) as the example, submit a <strong>2-page brief</strong> (or equivalent slide deck): (1) map the project to all six ethical pillars with one concrete action each; (2) draw the MLOps lifecycle and mark where you are today; (3) list three monitoring signals you would track in a real pilot; (4) name the clinical and technical owners and the rollback trigger. No code required.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(100,181,246,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#64B5F6;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Grading Rubric</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Ethical pillars (30%):</strong> all six addressed with specific, operational actions — not generic slogans</li>
      <li><strong style="color:#CFD8DC;">MLOps lifecycle (30%):</strong> correct phase order; clear gap analysis between current state and production-ready</li>
      <li><strong style="color:#CFD8DC;">Monitoring plan (20%):</strong> at least one input-drift and one clinical-safety signal with named alert owner</li>
      <li><strong style="color:#CFD8DC;">Governance (20%):</strong> named owners, rollback trigger, and honest "not for clinical use" scope if applicable</li>
    </ol>
  </div>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.75rem;">
    <strong style="color:#64B5F6;">Safety:</strong> use synthetic scenarios only &middot; no real patient identifiers &middot; cite the NotebookLM sources you watched.
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#64B5F6;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#90CAF9'" onmouseout="this.style.background='#64B5F6'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 13 of 15
</div>
