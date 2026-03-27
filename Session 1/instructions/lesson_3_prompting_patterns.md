---
layout: page
title: "Lesson 3: Prompting Patterns"
permalink: /session-01/lesson-3-instructions/
---

# CCI Session 1 — Lesson 3 of 5: Prompting Patterns — Zero-Shot, Few-Shot, and Chain-of-Thought

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

You now have the ROLES framework as your scaffold. But within that framework, there are different strategies for how you ask the model to reason. Think of it this way: ROLES is the form you fill out, but zero-shot, few-shot, and chain-of-thought are different ways of instructing the model to think before it answers. This matters enormously in clinical work. When I ask a model to classify a tumor as benign or malignant from a pathology report, a zero-shot prompt gets it right about 70% of the time. Add two examples and that jumps to 85%. Add chain-of-thought reasoning and you are looking at over 90%. Those percentages are the difference between a tool you can trust and one you cannot. By the end of this lesson, you will be able to choose the right prompting pattern for a given clinical task and explain why.

---

## Lab Exercise

**Title:** Head-to-Head Comparison: Zero-Shot vs. Few-Shot vs. CoT on Clinical Notes
**Duration:** 10 minutes
**Mode:** Demo + guided (instructor demonstrates, students replicate)

**Clinical Scenario:**
> A clinical research team needs to classify oncology clinic notes by treatment intent: curative, palliative, or surveillance. They need to choose the most accurate and efficient prompting strategy.

**Objective:**
By the end of this lab, students will have tested all three prompting patterns on the same clinical note and recorded accuracy and reasoning quality for each.

**Setup:**
```
1. Open platform.openai.com/playground
2. GPT-4o, temperature 0, max tokens 800
3. Use the 3 sample clinic notes below
4. Prepare a tracking sheet: Pattern | Note | Predicted Intent | Correct? | Reasoning Quality
```

**Sample Clinic Note 1 (Curative intent):**

> **Visit Date:** 2025-08-12 | **Provider:** Dr. Ahmad Khalil, Medical Oncology
>
> **Subjective:** 55-year-old male presents for initial oncology consultation following diagnosis of Stage II colon cancer. Patient underwent right hemicolectomy 3 weeks ago. Pathology showed T3N1aM0 moderately differentiated adenocarcinoma, 2/18 lymph nodes positive. Microsatellite stable (MSS). CEA post-surgery 2.1 (normal). Patient reports good recovery, tolerating regular diet, no complaints.
>
> **Assessment & Plan:**
> - Colon adenocarcinoma, Stage IIIA (T3N1aM0), status post right hemicolectomy with negative margins
> - Recommend adjuvant CAPOX chemotherapy x 3 months (based on IDEA trial data for low-risk Stage III)
> - Goal: cure — reduce recurrence risk from ~30% to ~15%
> - Labs and CT chest/abdomen/pelvis prior to cycle 1
> - Port placement scheduled for next week
> - Discussed expected side effects: neuropathy, hand-foot syndrome, fatigue
> - Patient agrees to proceed. Return in 1 week for cycle 1.

**Sample Clinic Note 2 (Palliative intent):**

> **Visit Date:** 2025-09-05 | **Provider:** Dr. Rania Masri, Medical Oncology
>
> **Subjective:** 71-year-old female with metastatic pancreatic adenocarcinoma (liver and peritoneal metastases) presents for follow-up after 4 cycles of gemcitabine/nab-paclitaxel. CT shows mixed response: primary tumor stable, but 2 new hepatic lesions. CA 19-9 rising from 1,200 to 2,450. ECOG performance status 2. Patient reports increasing fatigue, decreased appetite, and 3 kg weight loss over 4 weeks. Pain managed with oxycodone.
>
> **Assessment & Plan:**
> - Metastatic pancreatic adenocarcinoma, progressing on first-line therapy
> - Disease is not curable; goal is to prolong survival and maintain quality of life
> - Switch to second-line FOLFIRINOX (modified dose given PS 2)
> - Palliative care referral for symptom management and goals-of-care discussion
> - Nutrition consult for weight loss and appetite support
> - Re-image in 8 weeks to assess response
> - If further decline in performance status, will discuss transition to best supportive care

**Sample Clinic Note 3 (Surveillance intent):**

> **Visit Date:** 2025-10-01 | **Provider:** Dr. Samer Habash, Medical Oncology
>
> **Subjective:** 48-year-old female with history of Stage IIA left breast invasive ductal carcinoma (ER+/PR+/HER2-), treated 3 years ago with lumpectomy, whole-breast radiation, and adjuvant tamoxifen. Currently on tamoxifen with good tolerance. No new symptoms. Denies breast lumps, bone pain, or weight loss. Mammogram from last month showed no suspicious findings (BIRADS 1). Labs: CBC normal, CMP normal.
>
> **Assessment & Plan:**
> - Breast cancer, Stage IIA, in remission — 3 years post-treatment
> - Continue tamoxifen (plan for 5-year total course, 2 years remaining)
> - No evidence of recurrence on clinical exam and imaging
> - Surveillance plan: annual mammogram, clinical exam every 6 months
> - Discussed signs/symptoms of recurrence to watch for
> - Return in 6 months for surveillance visit

**Step-by-step instructions:**
1. **Zero-shot test**: Prompt: "Classify the following clinic note by treatment intent (curative, palliative, or surveillance): [paste note]". Run on all 3 notes. Record results in your tracking sheet.
2. **Few-shot test**: Add 2 examples before the task note:
   - Example 1: [Clinic Note 1 text] → "curative"
   - Example 2: [Clinic Note 2 text] → "palliative"
   Then classify Clinic Note 3. Record results.
3. **Chain-of-thought test**: Add the instruction: "Think step by step. First identify the key clinical findings, then consider what treatment approach they suggest, then classify as curative, palliative, or surveillance." Run on all 3 notes. Record results.
4. Compare your tracking sheet. Which pattern was most accurate? Which gave the best reasoning?
5. Discuss as a class: when would you use each pattern in a real clinical pipeline?

**Expected output:**
A completed comparison table showing that few-shot and CoT generally outperform zero-shot, with CoT providing the most auditable reasoning. Students should observe at least one case where zero-shot fails but few-shot or CoT succeeds.

**Stretch challenge:**
Combine few-shot AND chain-of-thought in a single prompt. Does the combination outperform either alone?

**KHCC connection:**
> Treatment intent classification is actively used in KHCC's clinical analytics to stratify patient cohorts for outcomes research and resource planning.
