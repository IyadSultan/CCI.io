# CCI Session 1 — Lesson 3 of 5: Prompting Patterns — Zero-Shot, Few-Shot, and Chain-of-Thought

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

You now have the ROLES framework as your scaffold. But within that framework, there are different strategies for how you ask the model to reason. Think of it this way: ROLES is the form you fill out, but zero-shot, few-shot, and chain-of-thought are different ways of instructing the model to think before it answers. This matters enormously in clinical work. When I ask a model to classify a tumor as benign or malignant from a pathology report, a zero-shot prompt gets it right about 70% of the time. Add two examples and that jumps to 85%. Add chain-of-thought reasoning and you are looking at over 90%. Those percentages are the difference between a tool you can trust and one you cannot. By the end of this lesson, you will be able to choose the right prompting pattern for a given clinical task and explain why.

---

## NotebookLM Summary

Prompting patterns define how much guidance and reasoning structure you provide to an LLM. The three foundational patterns are zero-shot, few-shot, and chain-of-thought (CoT), and each has distinct strengths and costs in clinical applications.

Zero-shot prompting means giving the model a task with no examples. You simply state what you want: "Classify this radiology report as normal or abnormal." This is the fastest to write and uses the least tokens, but it relies entirely on the model's pre-training knowledge to interpret what "normal" and "abnormal" mean in your specific clinical context. For well-defined, common tasks, zero-shot can work well. For nuanced clinical classification, it often produces inconsistent results because the model has no reference point for your specific criteria.

Few-shot prompting adds one to five examples of the desired input-output mapping before presenting the actual task. This is the most reliable improvement technique available. When you show the model two examples of discharge summaries with their correct extracted diagnoses, you are not just teaching it the task; you are defining the output format, the level of detail, the terminology, and the edge cases all at once. Clinical NLP benchmarks consistently show 15-30 percentage point improvements from zero-shot to few-shot, with diminishing returns after three to five examples.

Chain-of-thought prompting asks the model to reason step by step before producing its final answer. Instead of jumping directly from a clinic note to a diagnosis code, the model first identifies relevant clinical findings, considers differential diagnoses, weighs supporting evidence, and then produces its classification. In clinical reasoning tasks, CoT has been shown to improve accuracy by over 20 percentage points compared to direct zero-shot prompting. The key insight is that CoT makes the model's reasoning visible and auditable, which is essential for clinical trust. When a model explains why it classified a tumor as T3N1M0, the clinician can verify each step rather than trusting a black-box output.

The practical skill is learning when to use each pattern. Zero-shot for simple, well-defined extractions. Few-shot for any task requiring consistent formatting or domain-specific judgment. Chain-of-thought for complex clinical reasoning where auditability matters. In production clinical systems, few-shot with chain-of-thought is often the default because it maximizes both accuracy and transparency.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

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
3. Instructor provides 3 sample clinic notes with known treatment intent labels
4. Prepare a simple tracking sheet: Pattern | Note | Predicted Intent | Correct? | Reasoning Quality
```

**Step-by-step instructions:**
1. **Zero-shot test**: Prompt: "Classify the following clinic note by treatment intent (curative, palliative, or surveillance): [note]". Run on all 3 notes. Record results.
2. **Few-shot test**: Add 2 examples before the task note:
   - Example 1: [curative note] -> "curative"
   - Example 2: [palliative note] -> "palliative"
   Then classify the same 3 notes. Record results.
3. **Chain-of-thought test**: Add the instruction: "Think step by step. First identify the key clinical findings, then consider what treatment approach they suggest, then classify as curative, palliative, or surveillance." Run on all 3 notes. Record results.
4. Compare your tracking sheet. Which pattern was most accurate? Which gave the best reasoning?
5. Discuss as a class: when would you use each pattern in a real clinical pipeline?

**Expected output:**
A completed comparison table showing that few-shot and CoT generally outperform zero-shot, with CoT providing the most auditable reasoning. Students should observe at least one case where zero-shot fails but few-shot or CoT succeeds.

**Stretch challenge:**
Combine few-shot AND chain-of-thought in a single prompt. Does the combination outperform either alone?

**KHCC connection:**
> Treatment intent classification is actively used in KHCC's clinical analytics to stratify patient cohorts for outcomes research and resource planning.
