---
layout: page
title: "Lesson 3: Choosing Your Evaluator"
permalink: /session-07/lesson-3-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 3: Choosing Your Evaluator

**Estimated time:** 30 minutes (15 min content / 15 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

You have a labeled dataset. Now you need an evaluator -- the function that takes (input, output, ground truth) and returns a score. There are three families to choose from, and the wrong choice costs you either money or trust. Functional evaluators are deterministic code: a regex that checks the output contains a TNM stage in valid format, a JSON-schema validator, an exact-numeric match for a lab value. They are cheap, instant, perfectly reproducible, and cover only what you can express as code. LLM-as-judge evaluators are flexible -- you write a rubric prompt and a strong LLM scores the output. They can judge clinical relevance, fluency, helpfulness, things you cannot regex. But they have biases, they cost money per call, and they need to be validated themselves (which is the next lesson). Human evaluators are the gold standard but do not scale. The skill is matching the right evaluator family to the right metric. Today we build one of each, on the same task, and compare their cost, speed, and disagreement.

---

## NotebookLM Summary

The choice of evaluator determines what you can measure and what you cannot. There are three families, and a mature evaluation suite uses all three for different metrics on the same system. Functional evaluators are the cheapest and most reproducible -- they are just code. For tasks with verifiable structure (formatting, presence of required fields, numeric correctness, refusal-to-answer) functional evaluators should always be the first choice.

LLM-as-judge evaluators trade reproducibility for flexibility. You write a rubric prompt and a strong LLM (typically GPT-4-class) reads (input, output, optionally ground truth) and produces the score. This is the only practical way to measure properties that resist code: clinical relevance, fluency, helpfulness, faithfulness to a long context. DeepEval's metrics from Session 6 are LLM-as-judge under the hood.

LLM judges have a documented bias catalog: position bias (preference for first/second in pairwise -- mitigate by randomizing position), verbosity bias (preference for longer answers -- mitigate by length-normalizing), self-preference bias (preference for outputs from the same model family -- mitigate by using a different judge family or jury), format bias (degraded scoring if prompt format differs from training), and inconsistency at non-zero temperature (mitigate by self-consistency -- run N times, take majority).

A sharp practical rule: pairwise comparison is more robust than absolute scoring. "Is output A better than output B" is a question judges answer reliably; "rate this 1--5" suffers from drift, compression, and inconsistency. When you can structure an evaluation as pairwise, do so.

Human evaluators are the gold standard for what matters most clinically -- correctness, safety, calibrated uncertainty -- but they do not scale and have their own biases. The right places to use humans are building the labeled ground-truth dataset (Lesson 2) and acting as a final check on safety-critical production samples. Selection rule of thumb: functional first, judge second, human as ground truth and final check.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Hugging Face Evaluation Guidebook as a source, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Read:** Hugging Face Evaluation Guidebook, "Evaluation's main challenge: Scoring free form text" -- the sections on automatic metrics, human evaluation, and LLM-as-judge: <https://github.com/huggingface/evaluation-guidebook>
- **Read:** Paul Iusztin, "The AI Evals Roadmap I Wish I Had", Lesson 4 (Evaluator Design): <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had>
- **Skim:** DeepEval custom metrics docs (you used DeepEval in Session 6 -- this is a refresher): <https://docs.confident-ai.com/docs/metrics-introduction>
- **Warm-up exercise:** For your Oncology Summary Assistant (or any clinical tool you have built), write down 5 properties you would want to measure. For each, decide which evaluator family fits best and why.

### During Class -- What to Focus On

1. **Functional first** -- if you can express it as code (regex, schema, numeric range, presence-of-keyword), do so. It is instant, free, and perfectly reproducible.
2. **LLM-as-judge for things that resist code** -- clinical relevance, fluency, helpfulness, faithfulness, refusal appropriateness. The judge needs a clear rubric and validation (next lesson).
3. **Pairwise > absolute scoring** -- judges are reliable on "is A better than B" and unreliable on "rate this 1--5". Restructure when possible.
4. **The bias catalog** -- position, verbosity, self-preference, format, inconsistency. Each has a mitigation -- know them.

**Common traps:**

- Reaching for an LLM judge when a regex would do -- wastes money and adds noise.
- Using absolute 1--5 scoring without realizing the scale drifts and compresses.
- Using the same model family as both the system under evaluation and the judge -- introduces self-preference bias.
- Skipping the judge validation step (Lesson 4) and trusting raw scores at face value.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook (`Lab3_Choosing_Evaluator_Student.ipynb`), complete the guided exercises:

1. Load the 30-case dataset from Lab 2.
2. Implement a functional evaluator: a JSON-schema validator that checks the output has the required sections (Diagnosis, Stage, Histology, Recommendation, Monitoring).
3. Implement a second functional evaluator: a regex check that any drug name in the output is from a permitted list.
4. Implement an LLM-as-judge evaluator using DeepEval (or a custom OpenAI call) that rates "clinical relevance" 1--5 with a clear rubric.
5. Run all three on the 30-case dataset. Report cost, time, and disagreement between functional and judge.
6. Restructure the LLM judge as a pairwise comparison (your tool's output vs. a baseline simpler-prompt output) and compare consistency.

**Extra practice (optional):**

- Add a jury of 3 LLM judges (different temperatures or different models) and aggregate by majority vote. Compare against the single judge.
- Implement length-normalization in the judge to mitigate verbosity bias.

**Self-check questions:**

1. When should you reach for a functional evaluator vs. an LLM-as-judge vs. a human?
2. Name 3 LLM-judge biases and their mitigations.
3. Why is pairwise comparison generally more robust than absolute scoring?
4. Where does human evaluation belong in a mature pipeline?

### Resources

| Resource | Link |
|----------|------|
| HF Guidebook -- Scoring free-form text | <https://github.com/huggingface/evaluation-guidebook> |
| AI Evals Roadmap, Lesson 4 (Evaluator Design) | <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had> |
| DeepEval G-Eval & Custom Metrics | <https://docs.confident-ai.com/docs/metrics-introduction> |
| LLM-as-Judge Best Practices (HF Cookbook) | <https://huggingface.co/learn/cookbook/en/llm_judge> |
| Chatbot Arena (LMSYS) -- pairwise human eval at scale | <https://chat.lmsys.org/> |
