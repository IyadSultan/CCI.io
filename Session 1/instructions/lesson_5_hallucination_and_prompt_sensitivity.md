# CCI Session 1 — Lesson 5 of 5: Hallucination, Prompt Sensitivity, and Why Every Word Matters

**Estimated time:** 20 minutes (12 content + 8 practice)

---

## Instructor Introduction

This is the lesson that keeps me up at night. Everything we have built today, the ROLES framework, prompting patterns, JSON mode, all of it can produce output that looks perfect but is completely wrong. This is hallucination, and it is the single biggest risk in clinical AI. The model will confidently tell you a patient has stage IIIB non-small cell lung cancer with a specific TNM classification, and it will be fabricated. Not guessed, not approximated, fabricated, because the model is predicting probable tokens, not retrieving facts. The second risk is prompt sensitivity: changing one word in your prompt can flip the model's output from correct to incorrect. By the end of this lesson, you will be able to identify hallucinated clinical content, demonstrate prompt sensitivity with a live example, and apply three mitigation strategies to your prompts.

---

## NotebookLM Summary

Hallucination in LLMs refers to the generation of content that is fluent, confident, and entirely fabricated. Unlike human errors, which often come with hedging or uncertainty, LLM hallucinations are delivered with the same linguistic confidence as accurate responses. This is particularly dangerous in clinical settings where a hallucinated diagnosis, medication dose, or staging classification could directly impact patient care decisions.

Hallucination occurs because of how Transformers generate text. The model predicts the most probable next token based on patterns in its training data and the current context. When the context does not contain enough information to produce an accurate answer, the model does not say "I don't know." Instead, it generates the most statistically likely completion, which may be a plausible-sounding but incorrect clinical fact. For example, asked to extract a TNM stage from a pathology report that does not contain explicit staging, the model might generate "T2N1M0" because that is a common staging pattern in its training data for the described tumor type, not because it is present in the document.

Prompt sensitivity is the closely related problem that small, seemingly insignificant changes in prompt wording can produce dramatically different outputs. Changing "Extract the diagnoses" to "List the diagnoses" might alter which conditions the model includes. Changing "primary diagnosis" to "main diagnosis" might shift the model's interpretation of hierarchy. In clinical benchmarks, synonym substitution in prompts has been shown to cause accuracy swings of 10-25 percentage points on identical datasets. This matters because it means clinical AI systems are fragile unless prompts are rigorously tested and locked down.

Three key mitigation strategies are grounding, citation prompting, and confidence calibration. Grounding means explicitly instructing the model to only use information present in the provided text: "Only extract information that is explicitly stated in the note. Do not infer, assume, or add information not present in the text." Citation prompting asks the model to quote the exact text it used to justify each extraction: "For each diagnosis, include the exact sentence from the note that supports it." This makes hallucinations visible because fabricated content cannot be cited. Confidence calibration asks the model to rate its own certainty: "For each field, rate your confidence as HIGH (explicitly stated), MEDIUM (strongly implied), or LOW (inferred)." While not perfectly calibrated, this provides a useful signal for human reviewers to prioritize their attention.

The overarching lesson for clinical AI practitioners is that validation is not optional. Every prompt must be tested against known ground truth, every output must be reviewed with awareness that it may be fabricated, and every production system must include guardrails that catch hallucinated content before it reaches clinical workflows.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

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
3. Prepare a clinic note that deliberately OMITS staging information
4. Prepare a second note with ambiguous diagnosis language
```

**Step-by-step instructions:**
1. **Hallucination demo**: Submit the staging-free note with the prompt: "Extract the TNM staging from this note." Observe: the model will likely generate a plausible staging even though none exists in the note. Show the class the fabricated output.
2. **Grounding fix**: Add to the prompt: "Only extract information explicitly stated in the note. If staging is not mentioned, respond with NOT_FOUND." Resubmit. The model should now correctly return NOT_FOUND.
3. **Citation fix**: Add: "For each extracted field, quote the exact sentence from the note that supports it." Resubmit. Show how citation prompting makes hallucinations self-evident (no quote = fabricated).
4. **Prompt sensitivity demo**: Take the ambiguous note. Submit: "What is the primary diagnosis?" Then submit: "What is the main problem?" Then submit: "What condition is being treated?" Compare all three outputs. Highlight differences.
5. **Class discussion**: What are the implications for clinical AI deployment? How do we decide which prompt wording to use? Why must prompts be version-controlled?

**Expected output:**
Students observe: (a) a confident hallucination from an ungrounded prompt, (b) correct NOT_FOUND behavior from a grounded prompt, (c) citation-based auditability, and (d) output variation from synonym-level prompt changes.

**Stretch challenge:**
Ask the model to rate its confidence (HIGH/MEDIUM/LOW) for each extracted field. Does the confidence rating correlate with actual accuracy?

**KHCC connection:**
> Hallucination detection and grounding are mandatory components of every AIDI production prompt. All extraction prompts at KHCC include citation requirements and confidence ratings as standard practice.
