---
layout: page
title: "Lesson 1: Why Evaluate — and Where Evals Live"
permalink: /session-07/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 1: Why Evaluate, and Where Evals Live

**Estimated time:** 25 minutes (15 min content / 10 min discussion)
**Lab mode:** Slide-based discussion (no Colab)

---

## Instructor Introduction

You have built things in the previous sessions -- prompts, agents, RAG pipelines. They work on the five examples you tested. Now imagine I deploy your Oncology Summary Assistant at KHCC tomorrow and 200 oncologists use it on real patient cases for a week. How do you know -- at the end of the week -- whether it helped or harmed? Vibe-checking does not scale, and in clinical settings vibe-checking is dangerous: a confident wrong drug dose is a patient safety event that no amount of "looks good" on five samples will catch. This lesson is the foundation of everything else in the session. Evaluation is not a single thing -- it lives in three places: while you develop the tool, when you decide whether a change is safe to merge, and continuously on live traffic in production. We will name these three layers, separate evaluators from guardrails, and set the trap that the rest of the session disarms.

---

## NotebookLM Summary

Evaluation is the discipline of measuring whether your AI system actually does what you want it to do -- and the most expensive bug in clinical AI is the one nobody measured for. Without evaluation, every change to a prompt, a retrieval setting, a model version, or a system prompt is a guess. Vibe-checking -- looking at five outputs and saying "seems fine" -- feels efficient but breaks down silently. The output that looks fine on Tuesday's case may hallucinate a chemotherapy dose on Thursday's, and unless you measured systematically you will not know until a clinician notices. In a regulated cancer-care setting, the cost of "did not notice" is too high. Evaluation is how you move from intuition to evidence.

There are two perspectives on evaluation that pull in different directions, and the right answer depends on which you are. The model builder is asking "is my system improving?" -- they need fast, repeatable benchmarks they can run on every change. The model user is asking "is this system good enough for my specific task?" -- they need evaluations that match the actual workflow. Most clinical AI work is the user perspective.

Evaluation lives in three layers. Development optimization is fast offline benchmarks during iteration, ideally in seconds. Pre-merge regression testing is a curated test suite that runs on every commit, catching regressions before they ship -- the equivalent of unit tests in software engineering. Production monitoring is continuous evaluation on live traffic, sampling real interactions and detecting drift from silent vendor model updates, input distribution changes, or reference document updates.

Guardrails are not evaluators. A guardrail is a runtime check that blocks or modifies a bad output before it reaches the user (a regex blocking PHI in a summary). An evaluator is an offline scorer that tells you, after the fact, how good your outputs are on a labeled dataset. Both matter, and the threshold of a guardrail is itself something you should evaluate. Finally, evaluations are proxies for capability, never guarantees of real-world performance. Two recurring pitfalls: saturation (the benchmark is too easy and no longer discriminates between models) and contamination (the benchmark leaked into the model's training data, so high scores reflect memorization). Both are why benchmark-shopping is a weak way to choose a clinical model.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Hugging Face Evaluation Guidebook PDF as a source, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** Hugging Face LLM Evaluation Guidebook, sections "What is model evaluation about?" and "LLM basics to understand evaluation": <https://github.com/huggingface/evaluation-guidebook>
- **Read:** Paul Iusztin, "The AI Evals Roadmap I Wish I Had", Lesson 1 (Integration Strategy): <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had>
- **Warm-up exercise:** List five clinical workflows at KHCC where you have heard "the AI tool seems fine, we tested it." For each one, write one sentence on what could go silently wrong if no systematic evaluation is in place.

### During Class -- What to Focus On

1. **The three layers** -- understand what activity belongs in development, regression, and production monitoring. Each has different speed/cost/signal characteristics; mature systems use all three.
2. **Guardrails ≠ evaluators** -- guardrails defend the user at runtime; evaluators defend the engineer's ability to know whether the system is improving. Both matter. The threshold of a guardrail is itself something to evaluate.
3. **Benchmarks are proxies, not guarantees** -- a high MedQA score does not mean a model will be safe on YOUR clinical task with YOUR data. Saturation and contamination are real and recurring.
4. **The model-builder vs model-user perspective** -- most KHCC work is the user perspective: choosing/prompting/orchestrating models for specific clinical workflows.

**Common traps:**

- Conflating guardrails with evaluators -- the question "should I add a check that blocks PHI?" is a guardrail question; "how often does my tool produce PHI on a labeled set?" is an evaluator question.
- Assuming that a high benchmark score is a substitute for evaluation on YOUR data.
- Skipping production monitoring because "the eval suite passed in CI" -- model providers update silently, input distributions drift.

### After Class -- Practice & Lab Work

**Practice (no Colab this lesson):**

- Complete the interactive practice artifact "Place the Activity in the Right Layer" (in `practices/practice_lesson1_eval_layer.jsx` or embedded in the curriculum doc) -- 5 scenarios where you classify each as development / regression / production / guardrail.
- Take one CCI tool you have built or seen, and write one sentence per layer describing what you would do at each layer for that tool.

**Self-check questions:**

1. What are the three layers of evaluation, and what activity belongs in each?
2. What is the difference between a guardrail and an evaluator?
3. Why are saturation and contamination problems for benchmark-based decisions?
4. What is the model-builder vs model-user perspective on evaluation, and which one applies to most KHCC work?

### Resources

| Resource | Link |
|----------|------|
| Hugging Face LLM Evaluation Guidebook | <https://github.com/huggingface/evaluation-guidebook> |
| Hugging Face Evaluation Guidebook (Spaces preview) | <https://huggingface.co/spaces/OpenEvals/evaluation-guidebook> |
| AI Evals Roadmap (Iusztin) | <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had> |
| OWASP Top 10 for LLM Applications | <https://owasp.org/www-project-top-10-for-large-language-model-applications/> |
| FDA SaMD overview (background for Lesson 5) | <https://www.fda.gov/medical-devices/software-medical-device-samd> |
