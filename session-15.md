---
layout: default
title: "Session 15"
permalink: /session-15/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #4E342E !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #4E342E !important; font-weight: 800 !important; }
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
    color: #4E342E;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #BCAAA4;
    background: #EFEBE9;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #D7CCC8; }

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
    background: linear-gradient(135deg, #EFEBE9, #FFF8E1);
    border: 1px solid #BCAAA4;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #4E342E;
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

  .s1-dates {
    background: #FFF8E1;
    border: 1px solid #FFE082;
    border-radius: 0.75rem;
    padding: 0.85rem 1.25rem;
    margin-bottom: 2rem;
    font-size: 0.82rem;
    color: #5D4037;
    line-height: 1.55;
  }

  .s1-dates strong { color: #4E342E; }

  .s1-block {
    border: 1px solid #E0E0E0;
    border-radius: 0.85rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
  }

  .s1-block-head {
    padding: 1rem 1.25rem;
    background: #FAFAFA;
    border-bottom: 1px solid #F0F0F0;
  }

  .s1-block-head h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #263238;
  }

  .s1-block-body {
    padding: 1rem 1.25rem;
    font-size: 0.85rem;
    color: #455A64;
    line-height: 1.6;
  }

  .s1-block-body ul {
    margin: 0;
    padding-left: 1.1rem;
  }

  .s1-block-body ul li { margin-bottom: 0.35rem; }

  .s1-block-body ol {
    margin: 0;
    padding-left: 1.25rem;
  }

  .s1-block-body ol li { margin-bottom: 0.5rem; }

  .s1-submit {
    background: #1B2A4A;
    color: #fff;
    border-radius: 0.85rem;
    padding: 1.5rem;
    margin-top: 0.5rem;
  }

  .s1-submit h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: #BCAAA4;
  }

  .s1-submit p {
    color: #CFD8DC;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0 0 1rem;
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
    <h1>Session 15: Capstone Project 2 — Clinical Decision Support or Reporting Pipeline</h1>
    <p class="meta">Graded assignment &middot; PRD + GitHub repo &middot; submit on CCI Academy</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Project Goal</p>
  <p>Design and build an <strong>end-to-end Clinical Decision Support or Reporting Pipeline</strong> that uses large language models to help clinicians make decisions or to generate clinical reports in an oncology setting. Capstone 1 proved you can extract structure from text; Capstone 2 proves you can deliver a <em>clinical-facing</em> workflow — with RAG, agents, evaluation, and safety baked in — that respects governance and could be discussed with a clinical committee.</p>
</div>

<div class="s1-dates">
  <strong>Schedule:</strong> Opened Friday, 26 June 2026, 12:00 AM &middot; <strong>Due Tuesday, 1 September 2026, 12:00 AM</strong> &middot; Submit on <a href="https://academy.khcc.jo/mod/assign/view.php?id=2486" target="_blank" rel="noopener noreferrer">CCI Academy — Capstone Project 2</a> (login required).
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>What your system must demonstrate</h3></div>
  <div class="s1-block-body">
    <ul>
      <li><strong>A well-defined clinical use case</strong> — decision support (e.g., triage hint, protocol reminder) <em>or</em> report generation (e.g., structured oncology summary)</li>
      <li><strong>Course techniques integrated</strong> — RAG, agents, evaluation, and safety controls as appropriate to your design</li>
      <li><strong>A validation framework</strong> — how you know the output is useful and safe on realistic cases</li>
      <li><strong>Regulatory and safety considerations</strong> for a clinical-facing AI tool — scope limits, human oversight, PHI, incident path</li>
    </ul>
  </div>
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>Example directions (pick one lane)</h3></div>
  <div class="s1-block-body">
    <ul>
      <li><strong>Decision support</strong> — ER/oncology triage assistant, treatment-pathway checker, drug–interaction flagger with citations</li>
      <li><strong>Reporting pipeline</strong> — multi-source note → structured tumor-board summary, discharge summary draft with source grounding</li>
    </ul>
    <p style="margin:0.75rem 0 0;font-size:0.82rem;color:#78909C;">Either lane is acceptable if the use case is narrow, evaluated, and honestly scoped.</p>
  </div>
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>Suggested building blocks (from the course)</h3></div>
  <div class="s1-block-body">
    <ul>
      <li>LangChain / LangGraph agents &amp; tools (Session 5)</li>
      <li>RAG &amp; agentic RAG with evaluation (Session 6)</li>
      <li>Deployed web app pattern — Django, Render, HTTPS (Sessions 11–12)</li>
      <li>Claude Code / skills / MCP for build workflow (Session 10)</li>
      <li>Ethics pillars, MLOps monitoring &amp; rollback in your PRD (Session 13)</li>
    </ul>
  </div>
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>PRD document — what to include</h3></div>
  <div class="s1-block-body">
    <ol>
      <li><strong>Clinical use case</strong> — user, workflow moment, what changes if the tool works</li>
      <li><strong>System design &amp; architecture</strong> — RAG/agent flow, data sources, human-in-the-loop points</li>
      <li><strong>Safety &amp; governance</strong> — PHI handling, limitations label, override path, named owners</li>
      <li><strong>Evaluation results</strong> — test cases, metrics, qualitative clinician review if available</li>
      <li><strong>Limitations</strong> — out-of-scope uses, known failure modes, drift/monitoring plan</li>
      <li><strong>Deployment considerations</strong> — hosting, secrets, versioning, rollback trigger</li>
    </ol>
  </div>
</div>

<div class="s1-submit">
  <h3>Submission requirements (CCI Academy)</h3>
  <p>Upload <strong>two items</strong> to the assignment on CCI Academy:</p>
  <ol style="color:#CFD8DC;font-size:0.85rem;line-height:1.7;margin:0 0 1.25rem;padding-left:1.25rem;">
    <li><strong style="color:#EFEBE9;">PRD document</strong> — PDF or Word covering design, use case, architecture, evaluation, limitations, and deployment</li>
    <li><strong style="color:#EFEBE9;">GitHub repository link</strong> — public repo, <em>or</em> private repo with <strong>IyadSultan</strong> added as collaborator</li>
  </ol>
  <p style="color:#90A4AE;font-size:0.8rem;margin-bottom:1rem;">
    <strong style="color:#BCAAA4;">Safety:</strong> label demos "not for clinical use" unless formally approved; no real PHI in repos; no secrets in git.
  </p>
  <a href="https://academy.khcc.jo/mod/assign/view.php?id=2486" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#BCAAA4;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;" onmouseover="this.style.background='#D7CCC8'" onmouseout="this.style.background='#BCAAA4'">
    Open Capstone 2 on CCI Academy &#8594;
  </a>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 15 of 15
</div>
