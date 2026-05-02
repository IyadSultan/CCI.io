---
layout: page
title: "Lesson 4: Validating the Evaluator Itself"
permalink: /session-07/lesson-4-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 4: Validating the Evaluator Itself

**Estimated time:** 25 minutes (10 min content / 15 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Here is the trap that catches almost everyone: you build an LLM judge, you run it on 500 cases, you get a number, you trust the number. But the judge has never been validated against a clinician. You might be measuring the judge's biases at industrial scale and calling it a result. An unvalidated judge can give you false confidence that your tool is improving when it is not -- or worse, declare your tool safe when a clinician would say it is not. The fix is the judge--clinician alignment loop: measure how often the judge agrees with a small set of clinician-labeled cases, diagnose where they disagree, refine the judge prompt with the diagnoses, and re-measure. You do this until you reach a trust threshold -- typically 80--90% pairwise agreement or Cohen's kappa ≥ 0.6 on categorical labels -- at which point the judge can carry the load on every CI run, with humans sampling production occasionally. Today we run that loop on the LLM judge from Lesson 3, using the labeled traces from Lesson 2 as ground truth.

---

## NotebookLM Summary

Validating your evaluator is the step most teams skip and most evaluation pipelines silently fail at. The mistake is treating an LLM judge as a measurement instrument without first calibrating it. A judge that disagrees with your clinicians 40% of the time still produces a number -- but the number is meaningless.

The validation method is the judge--clinician alignment loop. Step one: pick a small but representative baseline of human-labeled cases (50 is usually enough). Step two: run the judge on the same cases. Step three: compute agreement using a metric appropriate to the label type (accuracy and confusion matrix for binary, Cohen's kappa for categorical, Pearson or Spearman correlation for continuous). Step four: inspect the disagreements case-by-case to understand the failure pattern. Step five: refine the judge prompt with targeted few-shot examples. Step six: re-measure. Iterate until agreement crosses your trust threshold.

The threshold depends on the metric type. For pairwise comparison, aim for 80--90% agreement with humans. For categorical labels, aim for Cohen's kappa ≥ 0.6 (substantial agreement); ≥ 0.8 is excellent. For continuous scores, Pearson correlation ≥ 0.7. If you cannot reach the threshold after 2--3 iterations, the metric may not be amenable to LLM judging and you should fall back to functional checks or human-only evaluation.

A note on what is reused from Session 6. In Session 6 you built four DeepEval RAG-specific metrics -- Faithfulness, Answer Relevancy, Contextual Relevancy, Contextual Recall. These are LLM-as-judge metrics under the hood, with clear rubrics built in. You do not need to re-teach those metrics here. Reuse them when your tool involves retrieval over clinical documents -- they are already validated for that pattern. What this lesson adds is the general validation method that you apply to any LLM judge you write yourself.

The hardest case in clinical evaluation is when the judge and the clinician genuinely disagree because the case is ambiguous. The right move there is not to pick a side but to flag the case for adjudication -- surface it to a second clinician, capture the resolution, and add the resolved case to the dataset.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the AI Evals Roadmap article and the HF Guidebook chapter on "Evaluating your evaluator", and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** Hugging Face Evaluation Guidebook, "With judge models" → "Evaluating your evaluator": <https://github.com/huggingface/evaluation-guidebook>
- **Read:** Paul Iusztin, "The AI Evals Roadmap I Wish I Had", Lesson 5 (Validating Evaluators): <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had>
- **Refresh:** DeepEval metrics reference (you used these in Session 6 -- this lesson references back without re-teaching): <https://docs.confident-ai.com/docs/metrics-introduction>
- **Warm-up exercise:** Take the LLM judge prompt you wrote in Lab 3. Without running anything, predict three scenarios where it might disagree with a clinician. Write them down -- you will compare against actual disagreements in lab.

### During Class -- What to Focus On

1. **Unvalidated judges produce meaningless numbers** -- this is the central lesson. Always measure judge--human agreement before trusting raw judge scores.
2. **The alignment loop** -- baseline → run judge → measure agreement → diagnose disagreements → refine prompt → re-measure. Iterate to threshold.
3. **Threshold by metric type** -- pairwise 80--90%, categorical κ ≥ 0.6, continuous Pearson ≥ 0.7. If you cannot reach the threshold in 2--3 iterations, fall back.
4. **Reference back to Session 6** -- the four DeepEval RAG metrics are already LLM-as-judge with clear rubrics. Reuse them for retrieval-grounded clinical tools and validate on YOUR clinical data; do not rebuild.

**Common traps:**

- Trusting an LLM judge's raw score without measuring agreement against human labels.
- Treating an alignment failure as "we need a bigger baseline" -- usually it is the rubric or the prompt.
- Iterating on the judge prompt without re-measuring -- you have no idea if you improved or broke things.
- Forgetting that ambiguous cases require adjudication, not a forced label.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook (`Lab4_Validate_Judge_Student.ipynb`), complete the guided exercises:

1. Load the 30-case labeled dataset from Lab 2 and the LLM judge from Lab 3.
2. Run the judge on all 30 cases. Compute accuracy and Cohen's kappa against the human labels.
3. Build a confusion matrix and identify the top 3 disagreement patterns (e.g., judge too lenient on incompleteness, judge missing histology mismatches).
4. Write 100--150 words diagnosing the failure patterns.
5. Refine the judge prompt with at least 2 targeted few-shot examples addressing the patterns.
6. Re-run the judge and report the before/after agreement delta.
7. If you cross the threshold, declare the judge ready. If not, do one more iteration.

**Extra practice (optional):**

- Implement a self-consistency check: run the judge 3 times at temperature 0.3, take majority vote, see if alignment improves.
- Try switching from absolute scoring to pairwise comparison and re-measure agreement.

**Self-check questions:**

1. Why is an unvalidated LLM judge a measurement instrument that produces meaningless numbers?
2. Walk through the steps of the judge--clinician alignment loop.
3. What is the Cohen's kappa threshold typically required for clinical work?
4. Did Session 6 cover the four DeepEval RAG metrics, and what does this lesson add on top?

### Resources

| Resource | Link |
|----------|------|
| HF Guidebook -- Evaluating your evaluator | <https://github.com/huggingface/evaluation-guidebook> |
| AI Evals Roadmap, Lesson 5 (Validating Evaluators) | <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had> |
| DeepEval Metrics Introduction | <https://docs.confident-ai.com/docs/metrics-introduction> |
| Cohen's Kappa Implementation (scikit-learn) | <https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html> |
| OpenAI Evals (GitHub) | <https://github.com/openai/evals> |
