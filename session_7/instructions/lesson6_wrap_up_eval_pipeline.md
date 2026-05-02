---
layout: page
title: "Lesson 6: Wrap-Up — Build Your Best Eval Pipeline"
permalink: /session-07/lesson-6-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 6: Wrap-Up Challenge -- Build Your Best Eval Pipeline

**Estimated time:** 35 minutes
**Lab mode:** Live walkthrough (Google Colab) + take-home assignment

---

## Instructor Introduction

Let us step back. You started by understanding why evaluation is the foundation of clinical AI -- three layers, guardrails vs evaluators, the limits of benchmarks. You learned to build a labeled evaluation dataset from real traces using the error-analysis flywheel and the one-labeler authority principle. You learned to choose between functional, LLM-judge, and human evaluators and built one of each. You learned to validate the evaluator itself with the judge--clinician alignment loop, so your numbers actually mean something. You added the clinical layer -- harm asymmetry, safety as a first-class metric, regulatory framing. Now we put it all together: a live walkthrough on the Oncology Summary Assistant where we design a complete eval pipeline end-to-end, push synthetic production traces to Opik for monitoring, and demonstrate drift detection on a deliberately-degraded prompt. You will leave with a runnable scaffold you can drop into your own repo in Session 9 -- and you will have a clear answer for the question "how do you know your tool is safe?"

---

## NotebookLM Summary

Lesson 6 puts everything together with a live walkthrough on the Oncology Summary Assistant. The goal is a runnable evaluation scaffold combining all five prior lessons: dataset from real traces, mix of functional + LLM-judge evaluators, validated LLM judge, four clinical safety sub-metrics, and an audit trail.

The walkthrough covers four phases. Phase one: take an existing CCI tool (the Oncology Summary Assistant or the cohort-extraction agent from earlier sessions) and inventory its risk surface. Phase two: apply Lessons 2--4 to build a 30-case eval dataset with one functional metric (schema check) and one LLM-judge metric (clinical relevance), validated against the 30 human labels. Phase three: wrap the evals as a Python script that runs on every commit, gating merges on the metrics (preview of Session 9). Phase four: push synthetic production traces to Opik to demonstrate live observability and drift detection on a deliberately-degraded prompt.

The three integration patterns: development → CI regression check → live monitoring. The eval harness is part of the product, not a side script. Treat the agent as a data product: instrument, observe, version, and improve it like one. The eval-debt trap: shipping without evals borrows speed against future pain.

Hand-off: Session 8 (every paper presentation must include an evaluation critique using the framework from this session) and Session 9 (wire the eval harness into the student repo as a CI step).

The take-home assignment is the seed for Session 9 work -- a complete evaluation pipeline for one chosen clinical AI tool, including dataset (with Cohen's kappa reported), evaluators (one of each family), validated judge (alignment loop with before/after delta), three of four clinical safety sub-metrics, and a one-page regulatory defense framing the tool under FDA SaMD risk-class thinking.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the AI Evals Roadmap article and the Opik documentation as sources, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** Paul Iusztin, "The AI Evals Roadmap I Wish I Had", Lesson 7 (Production Implementation): <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had>
- **Browse:** Opik tracing & monitoring quickstart: <https://www.comet.com/docs/opik/>
- **Read:** Microsoft "Responsible AI dashboard" overview (regulated-environment perspective): <https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai-dashboard>
- **Skim:** HF Guidebook -- "The forgotten children of evaluation" (statistical validity, cost, environmental impact): <https://github.com/huggingface/evaluation-guidebook>
- **Set up:** Create a free Opik account (Comet free tier, ~25K spans/month) and confirm you can authenticate from a notebook.
- **Warm-up exercise:** Pick the clinical AI tool you intend to use for the assignment. Write down (a) your top 3 failure modes, (b) one functional + one judge metric per failure mode, (c) what you would monitor in production.

### During Class -- What to Focus On

1. **Three-layer integration** -- the same eval suite runs at development time, in CI on every commit, and continuously on production samples. The plumbing is the same; the cadence and cost differ.
2. **Eval harness is part of the product** -- not a side script you remember to run sometimes.
3. **Drift detection is non-optional** -- silent vendor model updates, input distribution drift, and reference document updates all cause silent quality drops. Production monitoring is how you catch them.
4. **The hand-off to Sessions 8 & 9** -- you will critique paper evaluations next session and wire your harness into your repo's CI in Session 9.

**Common traps:**

- Building evals "for now" with no path into CI -- they rot.
- Not instrumenting production -- silent drift goes unnoticed for weeks.
- Treating Opik (or any observability platform) as a logger and not a measurement instrument -- the value is in continuous scoring, not just trace storage.

### After Class -- Practice & Lab Work

**Lab work (live walkthrough, instructor-led):**

In the provided Colab notebook (`Lab6_End_to_End_Eval_Pipeline_Student.ipynb`), follow along with:

1. Inventory the risk surface of the Oncology Summary Assistant.
2. Build the 30-case eval dataset (combining work from Labs 2-4).
3. Implement one functional metric (output schema check) and one LLM-judge metric (clinical relevance) -- validated against human labels.
4. Wrap the eval suite as a Python script `run_evals.py` that returns exit code 0 on pass, 1 on fail.
5. Set up Opik tracing on every Oncology Summary Assistant call. Push 5 synthetic production traces.
6. Deliberately degrade the system prompt and re-run -- watch the metrics drop in Opik.
7. Discuss how this Python script becomes a CI step in Session 9.

**Take-home assignment (required, due before Session 9):**

See the **SESSION 7 ASSIGNMENT** section in `session_7_curriculum.md` for the full specification. Summary:

- Pick ONE clinical AI tool (Oncology Summary Assistant, cohort-extraction agent from earlier sessions, or one you have built)
- Build a 30+ case real-grounded labeled dataset with Cohen's kappa reported
- Build at least 2 functional + 1 LLM-judge evaluator
- Run the judge--clinician alignment loop with before/after delta
- Implement at least 3 of 4 clinical safety sub-metrics from Lesson 5
- Write a one-page regulatory defense (FDA SaMD risk class, audit-trail strategy, residual risks)

**Self-check questions:**

1. What are the three integration patterns, and how does the same eval suite serve all three?
2. Why is the eval harness "part of the product, not a side script"?
3. What is drift detection and why is it non-optional in production?
4. What does "treating the agent as a data product" mean operationally?

### Resources

| Resource | Link |
|----------|------|
| AI Evals Roadmap, Lesson 7 (Production) | <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had> |
| Opik Documentation | <https://www.comet.com/docs/opik/> |
| LangSmith (alternative observability) | <https://docs.smith.langchain.com/> |
| Microsoft Responsible AI Dashboard | <https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai-dashboard> |
| HF Guidebook -- Forgotten children of evaluation | <https://github.com/huggingface/evaluation-guidebook> |
| GitHub Actions for Python CI | <https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python> |
