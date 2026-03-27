---
layout: page
title: "Lesson 2: ROLES Framework"
permalink: /session-01/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-01/">&#8249; Back to Session 1</a>

# CCI Session 1 — Lesson 2 of 5: The ROLES Framework for Clinical Prompting

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

Now that you know what an LLM is, let me tell you the single most important thing I have learned building clinical AI systems at KHCC: the prompt is not optional. It is the interface between your clinical intent and the model's statistical output. Many people treat prompting as typing a question and hoping for the best. That is like writing a lab order that says "check the blood" and expecting the lab to know exactly which panel you need. The ROLES framework gives you a structured way to write clinical prompts that are precise, reproducible, and auditable. By the end of this lesson, you will be able to construct a clinical prompt using all five ROLES components and explain why each one matters for patient safety.

---

## Lab Exercise

**Title:** Building Your First ROLES Prompt for Discharge Summary Extraction
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> An oncology department needs to extract structured diagnosis data from free-text discharge summaries. You must construct a prompt that reliably extracts the primary diagnosis, secondary diagnoses, and staging information.

**Objective:**
By the end of this lab, students will have built a complete ROLES prompt and tested it against two different discharge summaries, comparing output consistency.

**Setup:**
```
1. Open platform.openai.com/playground
2. Select GPT-4o, temperature 0, max tokens 500
3. Have both sample discharge summaries ready (provided below)
```

**Sample Discharge Summary 1:**

> **Patient:** 62-year-old male
> **Admission Date:** 2025-10-15 | **Discharge Date:** 2025-10-22
>
> **History of Present Illness:**
> Patient is a 62-year-old male who presented with painless jaundice, dark urine, and 6 kg weight loss over 6 weeks. CT abdomen/pelvis revealed a 3.1 cm mass in the head of the pancreas with pancreatic duct dilation. CA 19-9 was elevated at 487 U/mL. EUS-guided FNA confirmed pancreatic ductal adenocarcinoma, moderately differentiated. Staging CT showed no vascular invasion and no distant metastases.
>
> **Staging:** T2N0M0, Stage IB (AJCC 8th edition)
>
> **Hospital Course:**
> Multidisciplinary tumor board recommended upfront surgical resection. Patient underwent Whipple procedure (pancreaticoduodenectomy) on 2025-10-17. Surgical margins were negative (R0). Pathology confirmed 2.8 cm moderately differentiated adenocarcinoma, 0/14 lymph nodes positive. Postoperative course was uncomplicated. Jackson-Pratt drain removed on POD 4. Patient tolerated regular diet by POD 5.
>
> **Discharge Diagnoses:**
> 1. Pancreatic ductal adenocarcinoma, Stage IB (T2N0M0) — C25.0
> 2. Type 2 diabetes mellitus, insulin-requiring — E11.65
> 3. Obstructive jaundice, resolved post-surgery — K83.1
>
> **Discharge Medications:** Insulin glargine 18 units nightly, Creon 36,000 units with meals, Pantoprazole 40 mg daily, Acetaminophen 500 mg PRN pain
>
> **Follow-up:** Surgical oncology in 2 weeks for wound check and discussion of adjuvant gemcitabine/capecitabine.

**Sample Discharge Summary 2:**

> **Patient:** 45-year-old female
> **Admission Date:** 2025-09-20 | **Discharge Date:** 2025-09-24
>
> **History of Present Illness:**
> Patient is a 45-year-old premenopausal female who presented with a palpable left breast mass. Diagnostic mammogram showed a 2.4 cm irregular mass at 10 o'clock position, BIRADS 5. Ultrasound-guided core biopsy confirmed invasive ductal carcinoma, grade 2. ER positive (95%), PR positive (80%), HER2 negative (IHC 1+), Ki-67 18%. Oncotype DX recurrence score: 14 (low risk). Sentinel lymph node biopsy showed 0/3 nodes positive.
>
> **Staging:** T2N0M0, Stage IIA (AJCC 8th edition)
>
> **Hospital Course:**
> Patient underwent left breast-conserving surgery (lumpectomy) with sentinel lymph node biopsy on 2025-09-21. Surgical margins negative. Postoperative recovery uneventful. Patient counseled on adjuvant treatment plan: whole-breast radiation therapy followed by endocrine therapy (tamoxifen). Chemotherapy not recommended given low Oncotype score.
>
> **Discharge Diagnoses:**
> 1. Invasive ductal carcinoma, left breast, Stage IIA (T2N0M0) — C50.412
> 2. Iron deficiency anemia — D50.9
>
> **Discharge Medications:** Tamoxifen 20 mg daily (to start after radiation), Ferrous sulfate 325 mg daily, Ibuprofen 400 mg PRN pain
>
> **Follow-up:** Radiation oncology consult in 10 days. Surgical oncology in 2 weeks.

**Step-by-step instructions:**
1. Start with a naive prompt: **"What are the diagnoses in this note?"** Submit it with discharge summary 1. Copy the output.
2. Now build a ROLES prompt step by step:
   - **R**: "You are a clinical data abstractor specializing in oncology discharge summaries at a comprehensive cancer center."
   - **O**: "Extract the primary diagnosis, all secondary diagnoses, and TNM staging if present. If any field is not found, output NOT_FOUND."
   - **L**: "Use ICD-10-CM codes where possible. Use standard oncology terminology."
   - **E**: Provide one example input/output pair using discharge summary 2.
   - **S**: "Return output as a JSON object with keys: primary_diagnosis, secondary_diagnoses (array), tnm_staging."
3. Submit the ROLES prompt with discharge summary 1. Compare with the naive output.
4. Submit the ROLES prompt with discharge summary 2. Verify the output follows the same structure.
5. Document the differences in a brief note: accuracy, consistency, format.

**Expected output:**
The naive prompt produces free-text, inconsistent output. The ROLES prompt produces structured JSON with consistent fields across both notes.

**Stretch challenge:**
Remove the Examples (E) component and resubmit. How much does output quality degrade without the example?

**KHCC connection:**
> The ROLES framework is the foundation of every prompt template used in AIDI production pipelines, from ER note extraction to pathology report parsing.
