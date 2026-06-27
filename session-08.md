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

  .s1-btn-download {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }
  .s1-btn-download:hover { background: #CFD8DC; transform: translateY(-1px); }

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
    <p class="meta">Journal club &middot; evaluation critiques &middot; peer feedback &middot; 7 student talks archived below</p>
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

<!-- ─── Talk 2 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>The Evaluation Illusion of Large Language Models in Medicine</h3>
    <p class="presenter">Presenter: Tuqa</p>
  </div>
  <div class="s1-block-body">
    <p>This journal-club talk summarizes Agrawal et al. (2025, <em>npj Digital Medicine</em>) — a framework arguing that headline LLM benchmark scores in medicine often create an illusion of readiness because they miss how models will actually be used in hospitals. Tuqa walks through four systematic gaps: <strong>data</strong> (only ~5% of studies use real EHR text versus clean MCQ vignettes), <strong>tasks</strong> (closed-book multiple-choice versus incomplete, evolving clinical information), <strong>metrics</strong> (ROUGE, BLEU, and BERTScore weakly — sometimes negatively — correlated with expert judgment on correctness and completeness), and <strong>translational impact</strong> (isolated accuracy scores versus whether workflows actually improve). The deck contrasts intrinsic evaluation with extrinsic in-situ testing, cites emerging rubrics such as HealthBench and MedArena, and closes with concrete recommendations for authors, reviewers, and deployers — including reporting failure modes, using real EHR when possible, and measuring cognitive burden rather than assuming time saved.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-slides" href="https://docs.google.com/presentation/d/1an78w8GxKFfXBzn5pOOTpC9UF2zSVW939SU39x2mLHw/edit?slide=id.g3efa1b33291_2_2#slide=id.g3efa1b33291_2_2" target="_blank" rel="noopener noreferrer">
        &#128202; View Slides
      </a>
    </div>
  </div>
</div>

<!-- ─── Talk 3 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>Assessment of Large Language Models in Clinical Reasoning: Script Concordance Testing</h3>
    <p class="presenter">Presenter: Ruaa</p>
  </div>
  <div class="s1-block-body">
    <p>This journal-club talk covers McCoy et al. (<em>NEJM AI</em>, 2025) — a benchmarking study that tests 10 LLMs on 750 Script Concordance Test (SCT) questions drawn from 10 international datasets, scored against 1,563 human comparators (students, residents, attendings). Unlike USMLE-style MCQs, SCT measures how clinicians update judgment under uncertainty when new findings arrive — including the expert skill of choosing <strong>no change</strong> when a finding should not alter management. Ruaa explains why models that ace licensing exams sit at roughly medical-student reasoning level on SCT, why reasoning-optimised models (o1, DeepSeek R1, Gemini 2.5) can underperform general-purpose GPT-4o, and the clinically dangerous overconfidence pattern: models use extreme ±2 ratings far more often than expert panels and systematically avoid the “0” response. The deck maps the paper onto Session 7’s three-layer evaluation framework and closes with four KHCC implications: build an oncology SCT benchmark, test multiple prompting conditions, match task difficulty to model capability, and add demographic fairness testing.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-slides" href="https://docs.google.com/presentation/d/1lqHYhL9ewZkNRmmwizGV62kwO6X4MF_HpyNBuxxmWlI/edit?slide=id.p1#slide=id.p1" target="_blank" rel="noopener noreferrer">
        &#128202; View Slides
      </a>
    </div>
  </div>
</div>

<!-- ─── Talk 4 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>VeriFact: Rigorous Multi-Layer Evaluation of AI Clinical Summaries</h3>
    <p class="presenter">Presenter: CCI cohort (name not on slide deck)</p>
  </div>
  <div class="s1-block-body">
    <p>This talk walks through the VeriFact evaluation pipeline for fact-checking AI-generated brief hospital course (BHC) summaries against clinician ground truth. The VeriFact-BHC benchmark comprises 100 real patients and 13,070 atomic propositions labeled by three or more clinicians (1,618 hours of chart review). Rather than relying on headline percent agreement alone — which can be gamed when one label dominates — the presentation explains why Matthews Correlation Coefficient (MCC) is the more honest metric: DeepSeek-R1-Distill-Llama-70B achieved the best MCC (0.31) by better detecting clinically critical <em>Not Supported</em> and <em>Not Addressed</em> claims, while high-agreement models like Gemma-3 often over-predicted “Supported.” The deck argues atomic claim-level evaluation beats full-sentence judging, and closes with a candid KHCC deployment checklist: validate on local EHR documentation (beyond MIMIC-III), invest in GPU infrastructure for large models, run a prospective validation study, and position VeriFact as a safety filter — not autonomous chart review — because it cannot catch omissions never written into the record.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-slides" href="https://docs.google.com/presentation/d/1hcrjY9MWwlia7jg9-kOI0DCXh3t6jB1A8Ao0erQYHbw/edit?slide=id.g3efa3fed4d6_2_76#slide=id.g3efa3fed4d6_2_76" target="_blank" rel="noopener noreferrer">
        &#128202; View Slides
      </a>
    </div>
  </div>
</div>

<!-- ─── Talk 5 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>LLM-Based Scalable Data Extraction from Electronic Health Records</h3>
    <p class="presenter">Presenter: Ayah Erjan, MD</p>
  </div>
  <div class="s1-block-body">
    <p>Ayah presents Stuhlmiller et al. (medRxiv 2025) — a two-method LLM pipeline that extracts analysis-ready oncology data from 3,493 US patients’ records (~231 documents each), mapping outputs to FHIR R4 and OHDSI vocabularies (SNOMED, LOINC, RxNorm, mCODE). Schema-based extraction captures granular medication, radiation, and procedure events; checklist-based RAG answers patient-level assertions (diagnosis, stage, lines of therapy, response) with cited evidence across the full chart. Human validation with double review and 10% audit enforced a strict verbatim standard (~95% F1). Compared with structured EHR fields alone, the pipeline dramatically increased capture of oncology drug ingredients (+207%), radiation procedures (+715%), and surgical procedures (+422%). Ayah applies the framework to KHCC — especially the developing brain-metastases registry — where LLM extraction could backfill staging, histology, immunotherapy/targeted therapy, and radiation details that coded EMR fields miss.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-download" href="{{ site.baseurl }}/session_8/CCI_LLM_EHR_Presentation.pptx" download>
        &#11015; Download Slides (.pptx)
      </a>
    </div>
  </div>
</div>

<!-- ─── Talk 6 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>The AI-SCE Framework: Evaluating Clinical AI Agents Like an OSCE</h3>
    <p class="presenter">Presenter: Ghadeer Alshawabkeh</p>
  </div>
  <div class="s1-block-body">
    <p>Ghadeer introduces the AI-SCE concept (<em>npj Digital Medicine</em>, 2024) — adapting the medical school Objective Structured Clinical Examination (OSCE) to evaluate LLM agents as clinical actors, not chatbots. Stations test triage, diagnosis, prescribing, multi-stakeholder communication, tool use (EHR retrieval, calculators), and safety rubrics where critical errors (missed red flags, contraindications) are weighted heavily. The talk critiques the paper through Session 7’s evaluation checklist (layers, harm asymmetry, audit trail gaps) and proposes a KHCC oncology AI-SCE sandbox: local guideline-backed scenarios (neutropenic fever, chemo toxicity, perioperative risk), simulated patient/nurse/oncologist/pharmacist roles, and a stepwise roadmap from scenario bank → pre-merge eval → shadow mode → monitored pilot with safety dashboards tracking contraindication recall, refusal calibration, hallucination rate, and clinician override frequency.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-download" href="{{ site.baseurl }}/session_8/Evaluating_Clinical_AI_Agents_KHCC_Updated.pptx" download>
        &#11015; Download Slides (.pptx)
      </a>
    </div>
  </div>
</div>

<!-- ─── Talk 7 ─── -->
<div class="s1-block">
  <div class="s1-block-head">
    <h3>MedAgentBench: Benchmarking Medical LLM Agents in a Virtual EHR</h3>
    <p class="presenter">Presenter: Abdullah Obeidat</p>
  </div>
  <div class="s1-block-body">
    <p>Abdullah presents Jiang et al. (<em>NEJM AI</em>, 2025) — MedAgentBench, a Docker-hosted FHIR EHR with 100 realistic patients, 300 clinician-written tasks, and 12 LLMs tested on live GET/POST actions rather than multiple-choice exams. Top models peak around ~70% success; many failures are engineering, not knowledge — invalid JSON wrappers, wrong FINISH formats, and brittle API orchestration that prompt engineering can fix. The talk contrasts saturated written-exam benchmarks with unsaturated agent benchmarks where autonomous record interaction matters. Abdullah’s KHCC critique highlights the oncology gap: legacy non-FHIR systems, chemotherapy/BSA dosing, free-text toxicity notes, paediatric/BMT complexity, and multi-disciplinary teams. His phased roadmap: read-only retrieval assistants now, FHIR bridge medium-term, and a KHCC-specific oncology pharmacy agent benchmark long-term.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-download" href="{{ site.baseurl }}/session_8/MedAgentBench_Final.pptx" download>
        &#11015; Download Slides (.pptx)
      </a>
    </div>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 8 of 15
</div>
