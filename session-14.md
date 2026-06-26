---
layout: default
title: "Session 14"
permalink: /session-14/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #2E7D32 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #2E7D32 !important; font-weight: 800 !important; }
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
    color: #2E7D32;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #A5D6A7;
    background: #E8F5E9;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #C8E6C9; }

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
    background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
    border: 1px solid #A5D6A7;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #2E7D32;
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

  .s1-dates strong { color: #2E7D32; }

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
    color: #A5D6A7;
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
    <h1>Session 14: Capstone Project 1 — Clinical Extraction System</h1>
    <p class="meta">Graded assignment &middot; PRD + GitHub repo &middot; submit on CCI Academy</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Project Goal</p>
  <p>Design and build an <strong>end-to-end Clinical Extraction System</strong> that pulls structured clinical data out of unstructured oncology documents — pathology reports, discharge summaries, radiology notes, or similar — using large language models and the techniques you learned across Sessions 1–13. This is your proof that you can move from a prompt in a notebook to a governed, evaluated extraction pipeline a hospital could actually discuss.</p>
</div>

<div class="s1-dates">
  <strong>Schedule:</strong> Opened Friday, 26 June 2026, 12:00 AM &middot; <strong>Due Tuesday, 1 September 2026, 12:00 AM</strong> &middot; Submit on <a href="https://academy.khcc.jo/mod/assign/view.php?id=2485" target="_blank" rel="noopener noreferrer">CCI Academy — Capstone Project 1</a> (login required).
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>What your system must demonstrate</h3></div>
  <div class="s1-block-body">
    <ul>
      <li><strong>Robust prompt engineering or fine-tuning</strong> for structured extraction (JSON / schema-bound output)</li>
      <li><strong>Real-world clinical text variability</strong> — abbreviations, missing fields, mixed formats, noisy OCR if applicable</li>
      <li><strong>A validation approach</strong> against a labeled dataset (accuracy, field-level metrics, error analysis)</li>
      <li><strong>PHI governance and patient safety</strong> — de-identification or synthetic data, access controls, clear limitations, human review path</li>
    </ul>
  </div>
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>Suggested building blocks (from the course)</h3></div>
  <div class="s1-block-body">
    <ul>
      <li>Structured output &amp; tool calling (Sessions 2–3)</li>
      <li>Evaluation design &amp; metrics (Sessions 6–7)</li>
      <li>RAG or agent patterns if your documents need retrieval (Sessions 5–6)</li>
      <li>Security, PHI scanning, synthetic data (Session 12)</li>
      <li>Ethics pillars &amp; MLOps lifecycle in your PRD (Session 13)</li>
    </ul>
  </div>
</div>

<div class="s1-block">
  <div class="s1-block-head"><h3>PRD document — what to include</h3></div>
  <div class="s1-block-body">
    <ol>
      <li><strong>Clinical use case</strong> — who benefits, what decision or workflow this supports</li>
      <li><strong>System design &amp; architecture</strong> — diagram: inputs → model → schema → validation → output</li>
      <li><strong>Extraction schema</strong> — fields, types, required vs optional, clinical definitions</li>
      <li><strong>Evaluation results</strong> — labeled set size, metrics, failure cases, subgroup notes if possible</li>
      <li><strong>Limitations</strong> — what the system must not be used for; known failure modes</li>
      <li><strong>Deployment considerations</strong> — PHI, monitoring, versioning, rollback (Session 13 MLOps)</li>
    </ol>
  </div>
</div>

<div class="s1-submit">
  <h3>Submission requirements (CCI Academy)</h3>
  <p>Upload <strong>two items</strong> to the assignment on CCI Academy:</p>
  <ol style="color:#CFD8DC;font-size:0.85rem;line-height:1.7;margin:0 0 1.25rem;padding-left:1.25rem;">
    <li><strong style="color:#E8F5E9;">PRD document</strong> — PDF or Word covering design, use case, architecture, evaluation, limitations, and deployment</li>
    <li><strong style="color:#E8F5E9;">GitHub repository link</strong> — public repo, <em>or</em> private repo with <strong>IyadSultan</strong> added as collaborator</li>
  </ol>
  <p style="color:#90A4AE;font-size:0.8rem;margin-bottom:1rem;">
    <strong style="color:#A5D6A7;">Safety:</strong> do not commit real patient data, API keys, or credentials. Use synthetic notes or properly governed de-identified data only.
  </p>
  <a href="https://academy.khcc.jo/mod/assign/view.php?id=2485" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#A5D6A7;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;" onmouseover="this.style.background='#C8E6C9'" onmouseout="this.style.background='#A5D6A7'">
    Open Capstone 1 on CCI Academy &#8594;
  </a>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 14 of 15
</div>
