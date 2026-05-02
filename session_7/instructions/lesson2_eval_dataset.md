---
layout: page
title: "Lesson 2: Building the Evaluation Dataset"
permalink: /session-07/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# CCI Session 7 -- Lesson 2: Building the Evaluation Dataset

**Estimated time:** 30 minutes (12 min content / 18 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

You cannot evaluate without data. The first instinct of most engineers -- and I have done this myself -- is to ask GPT-4 to generate a hundred synthetic test cases and call that the evaluation set. This is wrong, and it is wrong in a way that hides itself: synthetic data tends to capture what the generating model already understands, so your evaluation tells you "you are good at what GPT-4 thinks you should be good at" -- not what your real users actually do. The right way to build a clinical evaluation dataset is the error-analysis flywheel: take 20--50 real production traces, label them carefully, find the failure patterns, and grow the dataset around the cases that hurt most. Today you will run one full turn of that flywheel on a small set of Oncology Summary Assistant traces. By the end of the lesson you will have a labeled evaluation set, an annotation rubric, and a measurement of inter-annotator agreement -- the foundation everything else depends on.

---

## NotebookLM Summary

The evaluation dataset is the most important artifact you will create in this session, and most teams underinvest in it. Public benchmarks rarely match your specific workflow. Pure synthetic data has a more subtle problem: the generating model produces examples it already understands, so your evaluation systematically misses the failure modes you most need to catch. The right starting point is real traces from real (or realistically-mocked) usage.

The error-analysis flywheel is the practical method. Step one: collect 20--50 real production traces. Step two: have a single labeler -- a clinician or a clinically-informed engineer -- score each trace using a rubric. Step three: cluster the failures by failure pattern (hallucinated dose, missed comorbidity, wrong staging, format error). Step four: write more cases targeting the most painful failure patterns. The dataset grows organically toward the failures that matter, instead of toward the failures the LLM-generator imagines.

There is one critical rule about synthetic data when you do use it: generate inputs only, never outputs. Use an LLM to imagine new patient cases, new question phrasings, new edge scenarios -- but always run those inputs through your real system to produce the outputs. Use dimensional thinking when generating inputs (persona × feature × scenario × modality) to prevent mode collapse.

The one-labeler authority principle is counterintuitive but important. Pick one person -- typically the clinician who most owns the workflow -- to be the labeling authority. Their rubric is the rubric. This trades parallelism for consistency, and consistency is what makes the dataset useful as a measurement instrument.

Inter-annotator agreement is how you check whether your rubric is unambiguous. Cohen's kappa measures agreement between two annotators on categorical labels, correcting for chance. For clinical evaluation work, you want kappa ≥ 0.6 (substantial agreement); ≥ 0.8 is excellent. If you are below 0.6, the problem is almost always the rubric, not the annotators. For dataset size, 50 high-quality labeled cases beat 500 sloppy ones every time.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the AI Evals Roadmap article, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (20-25 min)

- **Read:** Paul Iusztin, "The AI Evals Roadmap I Wish I Had", Lessons 2 & 3 (Dataset Construction, Synthetic Data Generation): <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had>
- **Skim:** Argilla, "Best practices for building annotated datasets for LLM evaluation": <https://argilla.io/blog/>
- **Read:** A short primer on Cohen's kappa: <https://en.wikipedia.org/wiki/Cohen%27s_kappa> -- focus on the interpretation table (poor / fair / moderate / substantial / almost perfect)
- **Warm-up exercise:** Take 5 anonymized clinical cases you have personally worked with at KHCC. For each, write down the input (one sentence) and the ideal Oncology Summary Assistant output (2-3 sentences). These will become your seed dataset for Lab 2.

### During Class -- What to Focus On

1. **The error-analysis flywheel** -- the loop is real-traces → label → cluster failures → write more cases targeting failures → repeat. This grows the dataset toward the failures that matter.
2. **Synthetic inputs OK, synthetic outputs NEVER** -- if you generate both inputs and outputs synthetically, you have measured the LLM, not your system.
3. **One-labeler authority** -- consistency beats parallelism. Pick one labeler, their rubric is the rubric. Train others against the authority later.
4. **Cohen's kappa interpretation** -- 0--0.2 poor, 0.2--0.4 fair, 0.4--0.6 moderate, 0.6--0.8 substantial, 0.8--1.0 almost perfect. For clinical work target ≥ 0.6.

**Common traps:**

- Building 500 synthetic cases and never including a real production trace.
- Using "everyone labels in parallel" without a designated authority -- you get inconsistencies that make the dataset useless as a measurement instrument.
- Treating low kappa as an annotator problem instead of a rubric problem -- it is almost always the rubric.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook (`Lab2_Build_Eval_Dataset_Student.ipynb`), complete the guided exercises:

1. Load the seed of 30 anonymized Oncology Summary Assistant traces (provided in the notebook).
2. Define a 3-tier rubric (correct / partially correct / incorrect-and-harmful) -- write the rubric explicitly with examples.
3. Label all 30 traces yourself.
4. Pair with a peer (or use the provided second-annotator labels) and compute Cohen's kappa on at least 10 cases.
5. Inspect 3 disagreements -- what does each disagreement reveal about your rubric?
6. Refine the rubric and re-label the disagreement cases. Re-compute kappa.

**Extra practice (optional):**

- Use an LLM to generate 5 additional input cases targeting one failure pattern you observed. Run them through your real Oncology Summary Assistant. Label the outputs. Add them to the dataset.
- Export the dataset as JSON with versioning so it can live in git.

**Self-check questions:**

1. What is the error-analysis flywheel and why does it produce better datasets than pure synthetic generation?
2. What is the rule about synthetic data, and why?
3. Why is the one-labeler authority principle important?
4. What is Cohen's kappa and what threshold do you target for clinical work?

### Resources

| Resource | Link |
|----------|------|
| AI Evals Roadmap, Lesson 2 (Datasets) | <https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had> |
| Argilla Documentation | <https://docs.argilla.io/> |
| Cohen's Kappa Explained | <https://en.wikipedia.org/wiki/Cohen%27s_kappa> |
| Hugging Face Guidebook -- "Creating your own evaluation" | <https://github.com/huggingface/evaluation-guidebook> |
| scikit-learn cohen_kappa_score | <https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html> |
