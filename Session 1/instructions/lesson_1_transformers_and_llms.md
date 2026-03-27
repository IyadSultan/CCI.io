---
layout: page
title: "Lesson 1: Transformers & LLMs"
permalink: /session-01/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-01/">&#8249; Back to Session 1</a>

# CCI Session 1 — Lesson 1 of 5: What Are LLMs and the Transformer Revolution in Medicine

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

Welcome to the CCI Prompt Engineering course. Before we touch a single prompt, we need to understand what we are actually talking to. Today we start with the engine behind every clinical AI tool you will encounter: the Transformer architecture. I want you to walk out of this lesson understanding that an LLM is not a doctor, not a database, and not a search engine. It is a statistical pattern-matcher trained on text. Once you understand that, everything else in this course will click: why prompts matter, why hallucinations happen, and why evaluation is non-negotiable. By the end of this lesson, you will be able to explain in plain language what tokens, embeddings, attention, and context windows are, and why they matter for clinical text.

---

## Lab Exercise

**Title:** Exploring the OpenAI Playground: Your First Clinical Prompt
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> You are a clinical informatics fellow who has just received a batch of 50 oncology discharge summaries. Before building any automation, you want to understand how the LLM "sees" your text by experimenting with the Playground.

**Objective:**
By the end of this lab, students will have submitted their first prompt in the OpenAI Playground and observed how changing a single word in the prompt changes the output.

**Setup:**
```
1. Open platform.openai.com/playground
2. Select GPT-4o model
3. Set temperature to 0
4. Set max tokens to 500
```

**Sample Discharge Summary (use this for all steps below):**

> **Patient:** 58-year-old female
> **MRN:** XXXX-DEMO
> **Admission Date:** 2025-11-02 | **Discharge Date:** 2025-11-09
>
> **Chief Complaint:** Shortness of breath and persistent cough for 3 weeks.
>
> **History of Present Illness:**
> Patient is a 58-year-old female with a 30-pack-year smoking history who presented with progressive dyspnea, hemoptysis, and unintentional weight loss of 8 kg over 2 months. CT chest revealed a 4.2 cm right upper lobe mass with mediastinal lymphadenopathy. PET-CT showed FDG-avid right upper lobe lesion (SUVmax 12.3) with uptake in ipsilateral mediastinal lymph nodes (stations 4R and 7). No distant metastases identified. Brain MRI was negative.
>
> **Pathology:** CT-guided biopsy of the right upper lobe mass confirmed non-small cell lung cancer (NSCLC), adenocarcinoma subtype. Immunohistochemistry: TTF-1 positive, PD-L1 TPS 60%. Molecular testing: EGFR wild-type, ALK negative, ROS1 negative, KRAS G12C mutation detected.
>
> **Staging:** T2bN2M0, Stage IIIA (AJCC 8th edition)
>
> **Hospital Course:**
> Patient underwent multidisciplinary tumor board review on 2025-11-04. Recommended concurrent chemoradiation with carboplatin/paclitaxel followed by durvalumab consolidation. Port-a-cath placed on 2025-11-05 without complications. Pulmonary function tests showed FEV1 72% predicted. Echocardiogram showed normal LVEF 60%. Patient educated on treatment plan, potential side effects, and follow-up schedule.
>
> **Discharge Diagnoses:**
> 1. Non-small cell lung cancer, adenocarcinoma, Stage IIIA (T2bN2M0) — C34.11
> 2. Type 2 diabetes mellitus, controlled — E11.65
> 3. Hypertension, stable — I10
>
> **Discharge Medications:** Metformin 1000 mg BID, Lisinopril 10 mg daily, Ondansetron 8 mg PRN nausea, Dexamethasone taper per protocol
>
> **Follow-up:** Oncology clinic in 7 days for cycle 1 chemoradiation planning. PFT re-check in 2 weeks.

**Step-by-step instructions:**
1. Set the system message to: "You are a clinical data extraction assistant."
2. In the user message, paste the discharge summary above and prepend: **"Extract the primary diagnosis from the following note:"**
3. Submit and observe the output.
4. Now change the prompt to: **"List all diagnoses mentioned in the following note:"** and resubmit with the same note.
5. Compare the two outputs. Note how a small change in the prompt produced a completely different structure.
6. Try once more: **"What is wrong with this patient?"** and observe the difference in tone, specificity, and clinical accuracy.

**Expected output:**
Three different responses from the same note, demonstrating that the LLM's behavior is directly controlled by prompt wording, not by "understanding" the note.

**Stretch challenge:**
Try setting temperature to 1.0 and resubmitting the same prompt 3 times. Observe how the outputs vary. Why does this happen?

**KHCC connection:**
> This mirrors the first step in building any AIDI extraction pipeline: understanding how the model responds to different prompt formulations before writing production code.
