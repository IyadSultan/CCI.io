---
layout: page
title: "Lesson 5: Medical Evaluation — The Clinical Layer"
permalink: /session-07/lesson-5-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 5: Medical Evaluation -- The Clinical Layer

**Estimated time:** 35 minutes (25 min content / 10 min discussion)
**Lab mode:** Slide-based discussion (no Colab)

---

## Instructor Introduction

Everything we have learned so far is general -- it applies to evaluating chatbots, summarizers, code assistants, anything. Now we add the clinical layer, and the central concept is harm asymmetry. A wrong movie recommendation costs nothing. A wrong drug dose can kill a patient. The math of evaluation has to change accordingly: you cannot just report "accuracy 92%" and call it a day, because the 8% that fail might all be safety events. Today we cover four things: why generic benchmarks under-measure clinical safety, the clinical benchmark landscape (MedQA, PubMedQA, MedHELM, HealthBench, USMLE-style sets), how to treat safety as a first-class metric with calibrated refusal and contraindication recall, and how to think about evaluation as a regulatory artifact under FDA SaMD framing. This is the lesson where the curriculum becomes uniquely clinical -- and the lesson you will reach for when defending a clinical AI system to a regulator, an institutional review board, or a senior clinician.

---

## NotebookLM Summary

Clinical evaluation is general evaluation plus a fundamentally different cost function -- and that single difference reshapes almost every choice. The defining concept is harm asymmetry. In an oncology summary tool, false positives and false negatives are not symmetric and not bounded -- either can kill a patient. This means clinical evaluation cannot be optimized for average accuracy; it must be optimized to bound worst-case harm.

Why generic benchmarks under-measure clinical safety: they optimize for average accuracy on tasks with well-defined right answers, but clinical reality is messier -- context-dependent answers, asymmetric costs, the right answer is often "I do not have enough information." A model that scores 95% on MedQA may still hallucinate doses, fail contraindications, or confidently answer questions a clinician would refuse.

The clinical benchmark landscape: MedQA (USMLE-style multiple-choice, historical default, mostly saturated), PubMedQA (literature comprehension), MedMCQA (Indian medical entrance exams), MedHELM (Stanford CRFM holistic medical evaluation across many tasks with fairness/robustness), HealthBench (OpenAI healthcare-grade safety and helpfulness with physician-designed rubrics), and oncology-specific evaluations on YOUR institutional data.

Safety as a first-class metric means four sub-metrics: contraindication recall (for inputs containing a known contraindication, fraction flagged); calibrated uncertainty / refusal-to-answer (for inputs where the right answer is "I do not know," fraction the tool actually refuses); hallucination rate on factual claims (fraction verifiable against authoritative sources); demographic fairness (does the recommendation drift when patient age/sex/ethnicity/insurance vary holding clinical content constant?).

Closed-book vs. open-book: most public clinical benchmarks are closed-book (parametric memory only); most KHCC deployments are open-book (retrieval over guidelines). Build evaluations in the open-book configuration to match production -- this is where Session 6's RAG metrics return as safety metrics (Faithfulness becomes a guideline-violation check).

Regulatory framing: under FDA SaMD, the risk class depends on clinical seriousness and operational autonomy. ISO 13485 and IMDRF Good Machine Learning Practice add documentation specifics. Every evaluation result should be traceable to dataset version, model version, prompt version, and rubric version. Audit-trail thinking is good engineering even when not legally required.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the FDA SaMD action plan PDF and the IMDRF Good Machine Learning Practice principles as sources, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (25-30 min)

- **Read:** Singhal et al., "Towards Expert-Level Medical QA with Med-PaLM" (Nature 2023): <https://www.nature.com/articles/s41586-023-06291-2>
- **Browse:** Stanford CRFM MedHELM landing page and the most recent leaderboard snapshot: <https://crfm.stanford.edu/helm/medhelm/>
- **Browse:** OpenAI HealthBench overview: <https://openai.com/index/healthbench/>
- **Skim:** FDA Action Plan on AI/ML-Based Software as a Medical Device: <https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device>
- **Skim:** IMDRF Good Machine Learning Practice for Medical Device Development -- Guiding Principles: <https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles>
- **Warm-up exercise:** Pick one clinical AI tool you would actually want to deploy at KHCC. Write down (a) the worst-case patient harm if it fails, (b) what regulatory class you would assign under SaMD framing.

### During Class -- What to Focus On

1. **Harm asymmetry** -- this is the single most important concept of the lesson. It changes the math of evaluation: bound worst-case harm, do not just optimize average accuracy.
2. **Generic benchmarks under-measure clinical safety** -- a high MedQA score does NOT predict safe behavior on YOUR task. Build YOUR own evaluations in YOUR deployment configuration.
3. **Four safety sub-metrics** -- contraindication recall, calibrated refusal, hallucination rate on factual claims, demographic fairness. Build all four into your suite.
4. **Closed-book vs open-book** -- public clinical benchmarks are mostly closed-book; KHCC deployments are mostly open-book. Match the eval to the deployment.
5. **Regulatory framing** -- FDA SaMD risk class, ISO 13485, IMDRF GMLP. Audit trails (dataset/model/prompt/rubric versions) from day one.

**Common traps:**

- Quoting MedQA / MMLU clinical scores as if they predict safety on YOUR task.
- Reporting a single global "accuracy" number without breaking out the safety sub-metrics.
- Optimizing for the average and ignoring worst-case bounds.
- Skipping the audit trail because "we are not submitting to the FDA right now" -- it is brutally painful to retrofit.
- Treating an open-book deployment but evaluating closed-book.

### After Class -- Practice & Discussion

**Practice (no Colab this lesson):**

- Complete the interactive practice artifact "Diagnose the Safety Failure" (in `practices/practice_lesson5_diagnose_safety.jsx` or embedded in the curriculum doc) -- 5 cases where you map a clinical failure to the safety sub-metric that catches it.
- Group discussion (10 min): students bring a clinical AI tool they have built or seen at KHCC. In pairs, list (a) the top 3 safety failure modes, (b) one functional check that would catch each, (c) which clinical benchmark (if any) covers the underlying capability. Share two examples back to the room.

**Self-check questions:**

1. What is harm asymmetry, and why does it reshape clinical evaluation?
2. Why is a high MedQA score not a guarantee of clinical safety on YOUR task?
3. Name the four safety sub-metrics from this lesson.
4. What is the closed-book vs open-book distinction, and which matches KHCC deployment patterns?
5. What is the FDA SaMD risk-class concept, and how does it shape what you document?

### Resources

| Resource | Link |
|----------|------|
| Med-PaLM Nature paper | <https://www.nature.com/articles/s41586-023-06291-2> |
| Stanford MedHELM | <https://crfm.stanford.edu/helm/medhelm/> |
| OpenAI HealthBench | <https://openai.com/index/healthbench/> |
| MedQA Dataset | <https://github.com/jind11/MedQA> |
| PubMedQA Dataset | <https://pubmedqa.github.io/> |
| FDA SaMD AI/ML Action Plan | <https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device> |
| IMDRF Good Machine Learning Practice | <https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles> |
| ISO 13485 (overview) | <https://www.iso.org/iso-13485-medical-devices.html> |
