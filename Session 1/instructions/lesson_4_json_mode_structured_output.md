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

## NotebookLM Summary

Structured output is the bridge between an LLM's natural language capabilities and the structured data requirements of clinical information systems. In clinical AI pipelines, the LLM is rarely the final destination: its output feeds into databases, EHR fields, analytics dashboards, or downstream processing steps. If the output format varies across runs, the entire pipeline breaks.

JSON mode is a feature available in modern LLM APIs (OpenAI, Azure OpenAI, Claude) that constrains the model to output valid JSON. Without JSON mode, a model asked to return patient data might sometimes produce a JSON object, sometimes a markdown table, and sometimes a narrative paragraph, even with explicit formatting instructions. JSON mode eliminates this variability by guaranteeing that every response is parseable JSON.

The key to effective structured output is schema design. A well-designed clinical JSON schema includes field names that map directly to database columns or EHR fields, controlled vocabularies for categorical values (ICD-10 codes, TNM staging values, ECOG performance status levels), required versus optional fields with sensible defaults, and explicit handling of missing data (null values or sentinel strings like "NOT_FOUND" rather than leaving fields empty or omitting them). For example, an oncology discharge extraction schema might define primary_diagnosis as a required string with ICD-10 format, secondary_diagnoses as an array of strings, tnm_staging as an object with T, N, and M string fields, and discharge_disposition as an enum of "home", "facility", "hospice", or "deceased".

The clinical importance of structured output extends beyond convenience. When extraction results are structured and consistent, they become auditable, queryable, and comparable across patients. A clinical research team can run the same extraction prompt across 10,000 discharge summaries and aggregate results directly because every output follows the same schema. Without structure, each result would require manual review and reformatting, defeating the purpose of automation.

Combining JSON mode with the ROLES framework and few-shot examples creates a robust extraction pipeline: the Role and Objective define the clinical context, the Examples show the exact JSON format expected, and JSON mode guarantees compliance. This combination is the standard architecture for production clinical NLP at scale.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

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
4. Instructor provides 2 sample operative notes
```

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
