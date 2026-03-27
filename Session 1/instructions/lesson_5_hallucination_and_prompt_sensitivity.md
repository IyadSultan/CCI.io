---
layout: page
title: "Lesson 5: Hallucination & Prompt Sensitivity"
permalink: /session-01/lesson-5-instructions/
---

# CCI Session 1 — Lesson 5 of 5: Hallucination, Prompt Sensitivity, and Why Every Word Matters

**Estimated time:** 20 minutes (12 content + 8 practice)

---

## Instructor Introduction

This is the lesson that keeps me up at night. Everything we have built today, the ROLES framework, prompting patterns, JSON mode, all of it can produce output that looks perfect but is completely wrong. This is hallucination, and it is the single biggest risk in clinical AI. The model will confidently tell you a patient has stage IIIB non-small cell lung cancer with a specific TNM classification, and it will be fabricated. Not guessed, not approximated, fabricated, because the model is predicting probable tokens, not retrieving facts. The second risk is prompt sensitivity: changing one word in your prompt can flip the model's output from correct to incorrect. By the end of this lesson, you will be able to identify hallucinated clinical content, demonstrate prompt sensitivity with a live example, and apply three mitigation strategies to your prompts.

---

## Lab Exercise

**Title:** Breaking the Model: Hallucination Detection and Prompt Sensitivity Demo
**Duration:** 8 minutes
**Mode:** Demo-only (instructor-led with class discussion)

**Clinical Scenario:**
> Before deploying any clinical extraction system, the team needs to understand failure modes. This lab demonstrates how easily LLMs hallucinate clinical content and how sensitive they are to prompt wording.

**Objective:**
By the end of this lab, students will have seen live examples of hallucination and prompt sensitivity, and will be able to apply grounding and citation prompting to mitigate them.

**Setup:**
```
1. Open platform.openai.com/playground
2. GPT-4o, temperature 0, max tokens 500
3. Use both sample notes below
```

**Sample Note A — Staging deliberately OMITTED (use for hallucination demo):**

> **Patient:** 67-year-old male
> **Visit Date:** 2025-11-10 | **Provider:** Dr. Hana Abboud, Medical Oncology
>
> **History of Present Illness:**
> Patient is a 67-year-old male, former smoker (40 pack-years, quit 5 years ago), who presented with a persistent cough and hemoptysis for 6 weeks. CT chest showed a 3.8 cm right upper lobe mass with ipsilateral mediastinal lymphadenopathy. CT-guided biopsy confirmed non-small cell lung cancer, squamous cell carcinoma subtype. PD-L1 TPS 45%. Brain MRI pending.
>
> **Assessment:**
> - Newly diagnosed right upper lobe squamous cell carcinoma of the lung
> - Awaiting completion of staging workup (brain MRI and PET-CT)
> - Pulmonary function testing scheduled prior to treatment planning
> - Tumor board review planned for next week once all imaging is complete
>
> **Plan:**
> - Complete staging: Brain MRI and PET-CT this week
> - PFTs for surgical candidacy assessment
> - Present at multidisciplinary tumor board
> - Return in 1 week to discuss treatment plan based on final staging
>
> **Note:** No TNM staging has been assigned. Final staging will be determined after imaging completion and tumor board review.

**Sample Note B — Ambiguous diagnosis language (use for prompt sensitivity demo):**

> **Patient:** 52-year-old female
> **Visit Date:** 2025-10-28 | **Provider:** Dr. Omar Issa, Internal Medicine
>
> **History of Present Illness:**
> Patient presents with 3-month history of fatigue, night sweats, and unintentional weight loss of 5 kg. Physical exam reveals bilateral cervical and axillary lymphadenopathy. CBC shows WBC 14.2, hemoglobin 10.8, platelets 142. LDH elevated at 380 U/L. CT neck/chest/abdomen showed extensive lymphadenopathy above and below the diaphragm with largest node measuring 4.1 cm in the left axilla. Spleen mildly enlarged at 14 cm.
>
> **Assessment:**
> Suspected lymphoproliferative disorder — differential includes diffuse large B-cell lymphoma, follicular lymphoma, or Hodgkin lymphoma. Awaiting excisional lymph node biopsy results. Cannot rule out other hematologic malignancies.
>
> **Plan:**
> - Excisional biopsy of left axillary node performed today, pathology pending
> - Flow cytometry and immunohistochemistry ordered
> - Bone marrow biopsy scheduled if lymphoma confirmed
> - Hepatitis B and HIV screening sent
> - PET-CT to be scheduled once tissue diagnosis is confirmed
> - Referral to hematology-oncology for management once diagnosis is established

**Step-by-step instructions:**

**Part 1 — Hallucination demo (use Note A):**
1. Submit Note A with the prompt: **"Extract the TNM staging from this note."**
   Observe: the model will likely generate a plausible staging (e.g., T2N2M0) even though none exists in the note. Show the class the fabricated output.
2. **Grounding fix**: Add to the prompt: **"Only extract information explicitly stated in the note. If staging is not mentioned, respond with NOT_FOUND."** Resubmit. The model should now correctly return NOT_FOUND.
3. **Citation fix**: Add: **"For each extracted field, quote the exact sentence from the note that supports it."** Resubmit. Show how citation prompting makes hallucinations self-evident (no quote = fabricated).

**Part 2 — Prompt sensitivity demo (use Note B):**
4. Submit Note B with: **"What is the primary diagnosis?"**
5. Then submit with: **"What is the main problem?"**
6. Then submit with: **"What condition is being treated?"**
7. Compare all three outputs. Highlight differences in specificity, certainty, and clinical accuracy.

**Part 3 — Class discussion:**
8. What are the implications for clinical AI deployment?
9. How do we decide which prompt wording to use?
10. Why must prompts be version-controlled?

**Expected output:**
Students observe: (a) a confident hallucination from an ungrounded prompt, (b) correct NOT_FOUND behavior from a grounded prompt, (c) citation-based auditability, and (d) output variation from synonym-level prompt changes.

**Stretch challenge:**
Ask the model to rate its confidence (HIGH/MEDIUM/LOW) for each extracted field. Does the confidence rating correlate with actual accuracy?

**KHCC connection:**
> Hallucination detection and grounding are mandatory components of every AIDI production prompt. All extraction prompts at KHCC include citation requirements and confidence ratings as standard practice.
