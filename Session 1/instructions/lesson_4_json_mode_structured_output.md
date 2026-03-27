---
layout: page
title: "Lesson 4: JSON Mode & Structured Output"
permalink: /session-01/lesson-4-instructions/
---

# CCI Session 1 — Lesson 4 of 5: JSON Mode and Structured Output for Clinical Pipelines

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

Everything we have done so far produces free text. And free text is fine for a conversation, but it is useless for a clinical pipeline. If you want to take an LLM's extraction and write it to a database, send it to an EHR, or feed it to a downstream analytics system, you need structured output. JSON mode is how we bridge the gap between the LLM's natural language and the structured data that clinical systems require. I have seen teams waste weeks debugging extraction pipelines that fail not because the model got the answer wrong, but because it formatted the output differently on every run. JSON mode solves that in one line. By the end of this lesson, you will be able to design a JSON schema for a clinical extraction task and use JSON mode to guarantee the model's output matches that schema every time.

---

## Lab Exercise

**Title:** Designing a Clinical JSON Schema and Testing JSON Mode
**Duration:** 10 minutes
**Mode:** Open-ended challenge

**Clinical Scenario:**
> The oncology department wants to automate extraction of key fields from operative notes: procedure name, surgeon, laterality, specimen type, and margin status. You need to design the schema and test it.

**Objective:**
By the end of this lab, students will have designed a JSON schema for operative note extraction and verified that JSON mode produces consistent, parseable output across multiple notes.

**Setup:**
```
1. Open platform.openai.com/playground
2. GPT-4o, temperature 0, max tokens 500
3. Enable JSON mode (in the response format dropdown)
4. Use both sample operative notes below
```

**Sample Operative Note 1:**

> **Date of Surgery:** 2025-07-14
> **Surgeon:** Dr. Fadi Nasr, Surgical Oncology
> **Assistant:** Dr. Lina Khoury
>
> **Preoperative Diagnosis:** Left breast invasive ductal carcinoma, Stage IIA (T2N0M0)
> **Postoperative Diagnosis:** Same
>
> **Procedure:** Left partial mastectomy (lumpectomy) with sentinel lymph node biopsy
>
> **Anesthesia:** General
>
> **Findings:**
> A 2.6 cm firm mass was identified in the left breast upper outer quadrant at 10 o'clock position, 4 cm from the nipple. The mass was excised with grossly adequate margins. Specimen was oriented with short suture superior, long suture lateral. Sentinel lymph node mapping identified 3 sentinel nodes in the left axilla, all of which were removed and sent for frozen section. Frozen section was negative for all 3 nodes.
>
> **Specimen:** Left breast tissue, 4.2 x 3.8 x 2.9 cm, with tumor grossly centered. Three sentinel lymph nodes.
>
> **Margins:** Final pathology: Superior margin 0.8 cm, inferior margin 1.2 cm, medial margin 0.6 cm, lateral margin 1.5 cm, anterior margin 0.4 cm, posterior margin 1.1 cm. All margins negative. Closest margin: anterior at 0.4 cm.
>
> **Complications:** None
>
> **Estimated Blood Loss:** 45 mL
>
> **Disposition:** Patient tolerated procedure well, transferred to PACU in stable condition.

**Sample Operative Note 2:**

> **Date of Surgery:** 2025-08-22
> **Surgeon:** Dr. Khaled Barakat, Thoracic Surgery
> **Assistant:** Dr. Nour Saleh
>
> **Preoperative Diagnosis:** Right upper lobe non-small cell lung cancer (adenocarcinoma), Stage IB (T2aN0M0)
> **Postoperative Diagnosis:** Same
>
> **Procedure:** Right upper lobectomy with mediastinal lymph node dissection, video-assisted thoracoscopic surgery (VATS)
>
> **Anesthesia:** General with double-lumen endotracheal tube
>
> **Findings:**
> Right upper lobe contained a 3.4 cm solid mass in the posterior segment. No pleural effusion or chest wall invasion identified. Fissure was complete. Right upper lobe bronchus, pulmonary artery branches, and superior pulmonary vein were individually dissected and divided with endoscopic staplers. Mediastinal lymph node stations 2R, 4R, 7, and 10R were dissected and sent separately.
>
> **Specimen:** Right upper lobe with 3.4 cm tumor. Lymph nodes from stations 2R (2 nodes), 4R (3 nodes), 7 (2 nodes), and 10R (1 node).
>
> **Margins:** Bronchial margin negative (frozen section confirmed). Vascular margins negative. Final pathology: 3.4 cm moderately differentiated adenocarcinoma, 0/8 lymph nodes positive. No lymphovascular invasion.
>
> **Complications:** None
>
> **Estimated Blood Loss:** 120 mL
>
> **Disposition:** Chest tube placed. Patient extubated in OR and transferred to thoracic surgery step-down unit.

**Step-by-step instructions:**
1. Design your JSON schema on paper first. Decide: what fields do you need? What are the allowed values for each? How do you handle missing data?
2. Write a ROLES prompt that includes your schema definition in the Structure (S) component. Example:
   ```
   Return a JSON object with these exact keys:
   - procedure_name: string
   - surgeon: string
   - laterality: "left" | "right" | "bilateral" | "not_applicable"
   - specimen_type: string
   - margin_status: "negative" | "positive" | "close" | "not_reported"
   ```
3. Enable JSON mode in the Playground settings.
4. Submit with operative note 1. Verify the output is valid JSON and matches your schema.
5. Submit with operative note 2. Verify consistency.
6. Try submitting WITHOUT JSON mode enabled. Does the model still produce valid JSON? How often does it break?

**Expected output:**
Two valid JSON objects with identical structure, differing only in clinical values. Students should observe that JSON mode guarantees format compliance while non-JSON mode occasionally produces malformed or inconsistent output.

**Stretch challenge:**
Add a "complications" field as an array. Design it to handle notes that mention zero, one, or multiple complications. Test with a note that has no complications mentioned. Does your schema handle it gracefully?

**KHCC connection:**
> JSON-structured extraction is the core pattern behind AIDI-DB's automated clinical data abstraction pipeline, where LLM outputs feed directly into Azure SQL tables.
