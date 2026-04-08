---
layout: page
title: "Lesson 2: Structured Output & Clinical Data Extraction"
permalink: /session-03/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-03/">&#8249; Back to Session 3</a>

# CCI Session 3 — Lesson 2: Structured Output & Clinical Data Extraction
**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"In Lesson 1 you learned how to call the OpenAI API from Python and get a response back as plain text. That's great for chatbots, but in clinical informatics we need data we can actually work with — structured fields we can load into a database, pass to a dashboard, or pipe into an EHR. Now that you can talk to GPT from Python, let's make it return structured, usable data — not just free text. Today we'll extract diagnoses, medications, staging, and more from oncology clinical notes and get the results back as clean, validated JSON every single time."

---

## NotebookLM Summary

When a large language model reads a clinical note and returns a free-text paragraph summarizing the diagnosis, that output is useful to a human reader but almost useless to a downstream system. An EHR integration engine cannot parse a sentence like "the patient appears to have stage IIIA non-small cell lung cancer" into the discrete fields it needs — cancer type, histology, TNM stage, treatment plan — without additional fragile string-matching code. Structured output solves this problem by forcing the model to return data in a predictable, machine-readable format from the very first token.

The simplest approach is JSON mode. When you pass `response_format={"type": "json_object"}` to the OpenAI chat completions endpoint, the API guarantees that the response will be parseable JSON. You still need to describe the schema you want inside the system or user prompt ("Return a JSON object with keys: diagnosis, stage, medications"), but the model will never break JSON syntax. This is a good starting point and works well for quick extractions where you can tolerate some variability in key names or nesting.

For production clinical pipelines, OpenAI's newer structured outputs feature is far more robust. You define a Pydantic model in Python — a class whose fields have explicit types, defaults, and validation rules — and pass it directly as the `response_format` parameter to `client.beta.chat.completions.parse()`. The API then constrains the model's output to conform exactly to your schema: every field name, every type, every enum value. If your model says `stage` is an `Optional[str]` and `medications` is a `List[Medication]`, the response is guaranteed to match.

Building Pydantic models for clinical data requires thinking carefully about the shape of medical information. A `ClinicalExtraction` model might contain a `diagnosis` string, a `stage` that is `Optional[str]` (because not every note includes staging), a list of `Medication` objects (each with `name`, `dose`, and `frequency` fields), a list of `allergy` strings, and a list of `procedure` strings. Nested models are essential: a `Medication` is its own Pydantic class embedded inside the parent. Enums are useful for constrained fields — for example, a `NoteType` enum with values like `DISCHARGE_SUMMARY`, `CLINIC_VISIT`, or `PATHOLOGY_REPORT` ensures the model picks from a fixed vocabulary rather than inventing labels.

Few-shot extraction dramatically improves accuracy. By including one or two example clinical notes in the prompt along with their expected JSON output, you show the model exactly what you want — how to handle TNM notation ("T2N1M0" should become `"stage": "T2N1M0"` or be expanded to `"stage": "Stage IIIA (T2N1M0)"`), how to parse medication lines ("Doxorubicin 60 mg/m2 IV q3w" becomes `{"name": "Doxorubicin", "dose": "60 mg/m2 IV", "frequency": "every 3 weeks"}`), and what to do when information is missing (return `null`, not an empty string or a guess).

Handling edge cases is where clinical NLP gets hard. Some notes use heavy abbreviations ("pt c/o SOB, dx NSCLC, tx w/ carbo/taxol q21d"), some mention multiple diagnoses across different body systems, and some omit staging entirely because the note is a follow-up rather than an initial consult. Your Pydantic model should use `Optional` fields generously and your prompt should include explicit instructions: "If a field is not mentioned in the note, return null. Do not infer or guess values." Testing your extraction pipeline against a set of synthetic notes with known ground truth — exactly the kind of dataset you will use in today's lab — is the standard way to measure accuracy before deploying to real clinical data.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the OpenAI structured outputs documentation and the synthetic notes JSON file, and use *Audio Overview* to generate a podcast-style review students can listen to before or after class.

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Review: Lesson 1 notebook — make sure you can make a basic `client.chat.completions.create()` call
- Read: OpenAI docs on [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) (skim the first two sections)
- Warm-up question: *You have a 200-word clinical note about a breast cancer patient. If you asked GPT to "extract the diagnosis and medications," how would you want the answer formatted so a Python program could use it automatically?*

### During Class — What to Focus On
- Understand the difference between JSON mode (`response_format={"type": "json_object"}`) and structured outputs with Pydantic
- Make sure you can define a Pydantic model with typed fields, `Optional`, and nested sub-models
- Pay attention to how few-shot examples in the prompt improve extraction accuracy
- Common trap: Forgetting to include "Return JSON" in your prompt when using JSON mode — the model may still return plain text
- Common trap: Using `str` for every field instead of `Optional[str]` — you lose the ability to distinguish "not mentioned" from "empty"

### After Class — Practice & Lab Work
- **Lab work (required):** Open the Colab notebook shared in class. Complete all TODO cells: define Pydantic models for clinical extraction, run extraction on 3 synthetic notes, and compare your output to the ground truth. Estimated time: 13 min.
- **Extra practice:** Pick 3 more notes from `synthetic_clinical_notes.json` and run your extraction pipeline. Calculate your accuracy: how many fields did you get exactly right?
- **Self-check:**
  1. What happens if you use JSON mode but don't mention JSON in your prompt?
  2. How do you represent a field that might not exist in the clinical note?
  3. Why is a Pydantic model better than a plain dictionary for clinical data extraction?
  4. What is the purpose of few-shot examples in an extraction prompt?

### Resources
- [OpenAI Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)
- [Pydantic Documentation — Models](https://docs.pydantic.dev/latest/concepts/models/)
- Synthetic clinical notes: `session_3/data/synthetic_clinical_notes.json`
- Session 3 NotebookLM review notebook (link provided after class)

---

## Lab Exercise

**Title:** Extract Structured Data from Oncology Clinical Notes
**Duration:** 13 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> You are a clinical informatics specialist at KHCC. The oncology department has asked you to build a prototype that reads free-text clinical notes and extracts structured data — diagnosis, staging, medications, and follow-up plans — into a format that can be loaded into a registry database. You have 10 synthetic notes to test with.

### Objective
By the end of this lab, students will have a working Colab notebook that defines Pydantic models for clinical data, calls the OpenAI API with structured output, extracts fields from real-looking oncology notes, and validates results against ground truth.

### Setup
```
1. Open Google Colab: https://colab.research.google.com
2. Create a new notebook: File → New Notebook
3. Rename it: "Session3_Lab2_Structured_Extraction.ipynb"
4. First cell — install dependencies:
   !pip install openai pydantic -q
```

### Step-by-step instructions

1. **Cell 1 — Setup & API Key:**
   Import `openai`, `pydantic`, and `json`. Set your API key. Load the synthetic notes JSON file (upload it to Colab or fetch from URL).

2. **Cell 2 — Define Pydantic Models:**
   Create a `Medication` model with fields: `name` (str), `dose` (str), `frequency` (str). Create a `ClinicalExtraction` model with fields: `patient_name` (str), `mrn` (str), `diagnosis` (str), `stage` (Optional[str]), `medications` (List[Medication]), `allergies` (List[str]), `procedures` (List[str]), `follow_up_date` (Optional[str]), `key_findings` (List[str]).

3. **Cell 3 — Simple JSON Mode (Baseline):**
   Pick `NOTE_001` from the dataset. Send it to `client.chat.completions.create()` with `response_format={"type": "json_object"}` and a prompt asking for structured extraction. Parse the response with `json.loads()`. Print the result and note any inconsistencies in key names or types.

4. **Cell 4 — Structured Output with Pydantic:**
   Use `client.beta.chat.completions.parse()` with `response_format=ClinicalExtraction` on the same note. Compare the output to Cell 3 — notice how every field matches your schema exactly.

5. **Cell 5 — Few-Shot Extraction:**
   Add a few-shot example to your prompt: include `NOTE_002`'s text and its expected extraction as an example, then ask the model to extract from `NOTE_003`. Compare the result to ground truth.

6. **Cell 6 — Batch Extraction & Accuracy Check:**
   Loop through all 10 notes. For each, run the Pydantic-based extraction and compare `diagnosis`, `stage`, and `medications` to the `expected_extraction` in the JSON file. Print a simple accuracy score (exact match percentage per field).

### Expected output
```
--- NOTE_001 ---
Diagnosis: Invasive ductal carcinoma, left breast   ✓ Match
Stage: T2N1M0                                        ✓ Match
Medications: 3 extracted, 3 expected                  ✓ Match

Overall accuracy across 10 notes:
  diagnosis: 9/10 (90%)
  stage: 8/10 (80%)
  medications: 7/10 (70%)
```

### Stretch challenge
Add a `confidence` field (float, 0.0–1.0) to your Pydantic model. Modify the prompt to ask the model to rate its confidence for each extraction. Filter out any extraction where confidence is below 0.7 and flag it for human review.

### KHCC connection
> This mirrors the workflow used by the KHCC cancer registry team, who manually extract diagnosis, staging, and treatment data from clinical notes to populate the national cancer registry. An AI-assisted extraction pipeline could reduce this manual effort from hours to minutes per batch of notes.
