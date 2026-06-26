---
layout: default
title: "Session 8"
permalink: /session-08/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #F4511E !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #F4511E !important; font-weight: 800 !important; }
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
    color: #F4511E;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #FFAB91;
    background: #FBE9E7;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #FFCCBC; }

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
    background: linear-gradient(135deg, #FBE9E7, #FFF3E0);
    border: 1px solid #FFAB91;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #E64A19;
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

  .s1-block-head .presenter {
    font-size: 0.78rem;
    color: #78909C;
    margin: 0.25rem 0 0;
    font-weight: 600;
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

  .s1-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.85rem;
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

  .s1-btn-slides {
    background: #FBE9E7;
    border-color: #FFAB91;
    color: #E64A19 !important;
  }
  .s1-btn-slides:hover { background: #FFCCBC; transform: translateY(-1px); }

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
    <h1>Session 8: Mid-term Presentations</h1>
    <p class="meta">Journal club &middot; evaluation critiques &middot; peer feedback &middot; student talks archived below</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session format</p>
  <p>Each student presents a clinical AI paper or their own project. Every presentation must include an <strong>evaluation critique</strong> using the <a href="{{ site.baseurl }}/session-07/">Session 7</a> framework. Peer feedback is structured around clinical relevance, evaluation rigor, and safety considerations. Slides from completed talks are posted here for the cohort.</p>
</div>

<div class="s1-block">
  <div class="s1-block-head">
    <h3>Evaluation critique checklist (required in every talk)</h3>
  </div>
  <div class="s1-block-body">
    <ul>
      <li>Which evaluation layer(s) did the authors use (development / pre-merge / production)?</li>
      <li>Were evaluators functional, LLM-as-judge, or human — and was the judge validated?</li>
      <li>Was harm asymmetry addressed? What are the worst-case failure modes?</li>
      <li>Are clinical safety sub-metrics reported (contraindication recall, refusal calibration, hallucination rate, demographic fairness)?</li>
      <li>Is there an audit trail (dataset version, model version, prompt version)?</li>
    </ul>
  </div>
</div>

<!-- ─── Talk 1 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>Rethinking Retrieval-Augmented Generation for Medicine</h3>
    <p class="presenter">Presenter: Dana Elkhatib Toghoj</p>
  </div>
  <div class="s1-block-body">
    <p>This journal-club talk walks through Kim et al. (2025) — a large-scale expert evaluation of medical RAG in which 18 clinicians produced 80,502 annotations across 200 queries (patient K-QA and USMLE-style cases), decomposing the pipeline into evidence retrieval, evidence selection, and response generation. The central finding is sobering for anyone building clinical RAG: standard retrieval-augmented generation often <em>degrades</em> factuality and completeness versus non-RAG baselines, with only about 22% of top-16 retrieved passages judged relevant and frequent citation of irrelevant or hallucinated references (especially in smaller models). The presentation explains stage-aware evaluation, qualitative failure modes such as misleading numerical anchoring and lexical ambiguity, and the paper's proposed mitigations — evidence filtering plus query reformulation — which recovered up to +12% on benchmarks. Dana closes with six practical steps to adapt the framework for oncology at King Hussein Cancer Center, including NCCN/guideline corpora, cancer-specific must-have statements, and validating on a small holdout set before deployment.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-slides" href="https://docs.google.com/presentation/d/1RI2q7cIyFxMW0yLrq-E9dWbA_OVYTEFIhYIayi5TA00/edit?slide=id.g3e284362854_1_115#slide=id.g3e284362854_1_115" target="_blank" rel="noopener noreferrer">
        &#128202; View Slides
      </a>
    </div>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 8 of 15
</div>
