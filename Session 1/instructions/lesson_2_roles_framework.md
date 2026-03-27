---
layout: page
title: "Lesson 2: ROLES Framework"
permalink: /session-01/lesson-2-instructions/
---

# CCI Session 1 — Lesson 2 of 5: The ROLES Framework for Clinical Prompting

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

Now that you know what an LLM is, let me tell you the single most important thing I have learned building clinical AI systems at KHCC: the prompt is not optional. It is the interface between your clinical intent and the model's statistical output. Many people treat prompting as typing a question and hoping for the best. That is like writing a lab order that says "check the blood" and expecting the lab to know exactly which panel you need. The ROLES framework gives you a structured way to write clinical prompts that are precise, reproducible, and auditable. By the end of this lesson, you will be able to construct a clinical prompt using all five ROLES components and explain why each one matters for patient safety.

---

## NotebookLM Summary

The ROLES framework is a structured approach to prompt engineering designed specifically for clinical and high-stakes applications. ROLES stands for Role, Objective, Language, Examples, and Structure. Each component serves a specific function in guiding the LLM toward accurate and consistent output.

Role defines who the model should act as. In clinical contexts, this is not decorative: telling the model "You are an oncology data abstractor with experience in ICD-10 coding" activates different statistical patterns than "You are a helpful assistant." The role primes the model's vocabulary, tone, and decision-making patterns. Objective states exactly what the model should do, including what it should not do. A vague objective like "summarize this note" produces unpredictable output. A precise objective like "Extract the TNM staging from this pathology report; if staging is not explicitly stated, respond with NOT_FOUND" tells the model both the target and the failure mode. Language specifies the terminology, reading level, and domain conventions expected. For clinical work, this might mean "Use ICD-10-CM codes," "Write at a health literacy level appropriate for patient education," or "Use SNOMED CT preferred terms."

Examples are the most powerful component. Providing one or two examples of the desired input-output pair transforms model accuracy dramatically. In clinical NLP benchmarks, few-shot prompts with examples outperform zero-shot prompts by 15-30 percentage points on structured extraction tasks. Structure defines the output format: JSON, table, bullet list, or narrative. Without explicit structure, the model chooses its own format, which varies across runs and breaks downstream pipelines.

The critical insight for beginners is that prompt engineering is not a soft skill or an afterthought. It is the primary control mechanism for clinical AI systems. A well-constructed ROLES prompt is the difference between a system that extracts diagnoses at 95% accuracy and one that hallucinates at 60%. Every minute spent crafting a better prompt saves hours of debugging, validation, and clinical review downstream.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

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
3. Have two sample discharge summaries ready (provided by instructor)
```

**Step-by-step instructions:**
1. Start with a naive prompt: "What are the diagnoses in this note?" Submit it with discharge summary 1. Copy the output.
2. Now build a ROLES prompt step by step:
   - **R**: "You are a clinical data abstractor specializing in oncology discharge summaries at a comprehensive cancer center."
   - **O**: "Extract the primary diagnosis, all secondary diagnoses, and TNM staging if present. If any field is not found, output NOT_FOUND."
   - **L**: "Use ICD-10-CM codes where possible. Use standard oncology terminology."
   - **E**: Provide one example input/output pair using a sample note.
   - **S**: "Return output as a JSON object with keys: primary_diagnosis, secondary_diagnoses (array), tnm_staging."
3. Submit the ROLES prompt with the same discharge summary 1. Compare with the naive output.
4. Submit the ROLES prompt with discharge summary 2. Verify the output follows the same structure.
5. Document the differences in a brief note: accuracy, consistency, format.

**Expected output:**
The naive prompt produces free-text, inconsistent output. The ROLES prompt produces structured JSON with consistent fields across both notes.

**Stretch challenge:**
Remove the Examples (E) component and resubmit. How much does output quality degrade without the example?

**KHCC connection:**
> The ROLES framework is the foundation of every prompt template used in AIDI production pipelines, from ER note extraction to pathology report parsing.
