# CCI Session 7: LLM Evaluation
## Outline — 6 Lessons (3 hours)

**Audience:** Completed Sessions 1-6 (prompt engineering, Python, OpenAI API, HuggingFace, LangChain/LangGraph, RAG with LlamaParse + DeepEval).
**Clinical Anchor:** A KHCC-relevant clinical AI tool — suggested: an oncology decision-support assistant or a cohort-extraction agent the cohort has built or seen in earlier sessions.
**Session Duration:** 3 hours (6 lessons × ~25 min + breaks/Q&A)
**Lab Mode:** Mixed — Colab notebooks for Lessons 2–4, slide-based for Lessons 1, 5, 6
**Content/Practice Split:** 50/50
**Environment:** Google Colab with `openai`, `deepeval`, `lighteval` (or `lm-eval-harness`), and an Opik free-tier account for production observability demo

**Hand-off:**
- Session 8 (journal club): students will be expected to evaluate any paper they present using the framework from this session
- Session 9 (IDE / building repos): students will wire an eval harness into their own repo

---

## LESSON 1 OF 6: Why Evaluate, and Where Evals Live
**Estimated time:** 25 minutes (15 min content / 10 min discussion)

### Learning objectives
By the end of the lesson, students can:
1. Explain why "vibe-checking" fails for clinical AI products
2. Distinguish the **three layers** of evaluation: development, pre-merge regression, production monitoring
3. Distinguish **guardrails** (block bad outputs at runtime) from **evaluators** (score outputs offline)
4. State what an evaluation can and cannot tell you (proxy for capability, not ground truth)

### Key concepts
- The vibe-check trap: looks fine on 5 examples, breaks silently on the 6th
- Two perspectives: model **builder** (am I improving?) vs. model **user** (which model is best for *my* task?)
- Guardrails vs. evaluators — overlapping but different jobs
- Saturation and contamination as recurring eval failure modes

### Hands-on activity (~10 min)
**"Find the vibe-check failure"** — paired discussion.
Show a 4-prompt/4-response transcript from a clinical chatbot where 3 are correct and 1 contains a subtle dosing error. Ask pairs to identify it, then count how many minutes they would need to find it across 50 outputs. Use that to motivate the rest of the session.

### Recommended reading
- Hugging Face, [LLM Evaluation Guidebook](https://github.com/huggingface/evaluation-guidebook) — sections "What is model evaluation about?" and "LLM basics"
- Paul Iusztin, [The AI Evals Roadmap I Wish I Had](https://www.decodingai.com/p/the-ai-evals-roadmap-i-wish-i-had) — Lesson 1

---

## LESSON 2 OF 6: Building the Evaluation Dataset
**Estimated time:** 30 minutes (12 min content / 18 min lab)

### Learning objectives
1. Apply the **error-analysis flywheel** to convert 20–50 production traces into a labeled eval set
2. Generate synthetic eval **inputs** (not outputs) using dimensional thinking (persona × scenario × modality)
3. Set up a one-person labeling authority and an annotation rubric
4. Run an inter-annotator agreement check (Cohen's κ) on a small sample

### Key concepts
- Real-trace seeding > pure synthetic
- The "generate inputs only, let your real app produce outputs" rule
- Why one labeler owns the rubric (consistency > parallelism)
- Sample-size minimums: ~50 high-quality cases beats 500 sloppy ones for clinical use

### Hands-on activity (~18 min)
**Colab notebook**: students take 30 anonymized prompts from a prior cohort-extraction or clinical-summary tool, label each with a 3-tier rubric (correct / partially correct / incorrect-and-harmful), then compute pairwise κ with a peer. Discuss disagreements.

### Recommended reading
- Iusztin, Lessons 2 & 3 of the AI Evals Roadmap
- Argilla, [Building annotated datasets for LLM evaluation](https://argilla.io/blog/) (any current intro post)
- HF guidebook, "Creating your own evaluation" → "Using human annotators"

---

## LESSON 3 OF 6: Choosing Your Evaluator
**Estimated time:** 30 minutes (15 min content / 15 min lab)

### Learning objectives
1. Choose between **deterministic/functional**, **LLM-as-judge**, and **human** evaluators based on the task
2. Implement a functional verifier (e.g., IFEval-style format check, exact-numeric match for lab values)
3. Implement a basic LLM-as-judge with a clear rubric prompt
4. Recognize the major LLM-judge biases (position, verbosity, self-preference, format)

### Key concepts
- Functional first, judges second — interpretable and cheap beats flexible and noisy
- Pairwise comparison > absolute scoring (more robust to scale drift)
- Bias mitigation toolkit: position swap, length normalization, juries, self-consistency

### Hands-on activity (~15 min)
**Colab notebook**: build two evaluators for the same task — (a) a regex/JSON-schema functional check that the output contains a TNM stage in valid format, and (b) an LLM-as-judge prompt that scores clinical relevance 1–5. Run both on 20 samples and compare cost, time, and disagreement.

### Recommended reading
- HF guidebook, "Evaluation's main challenge: scoring free-form text"
- DeepEval docs, [G-Eval and custom metrics](https://docs.confident-ai.com/) (already familiar from Session 6)

---

## LESSON 4 OF 6: Validating the Evaluator Itself
**Estimated time:** 25 minutes (10 min content / 15 min lab)

### Learning objectives
1. Run the **judge ↔ clinician alignment loop** — measure, diagnose, refine, re-measure
2. Compute and interpret accuracy, precision/recall (binary), and Cohen's κ (categorical)
3. Decide a threshold for "judge is trustworthy enough to deploy"
4. Reference back to Session 6's DeepEval RAG metrics (faithfulness, contextual precision/recall) — when to reuse vs. when to design fresh

### Key concepts
- An unvalidated judge can give you false confidence at industrial scale
- 50 well-chosen baseline cases beat 500 mediocre ones for alignment
- Acceptance bars: ~80–90 % agreement for pairwise; κ ≥ 0.6 for categorical clinical labels
- Pointer (no repeat) to RAG-specific metrics already covered in Session 6

### Hands-on activity (~15 min)
**Colab notebook**: take the LLM-as-judge from Lesson 3, score the 30 labeled samples from Lesson 2, compute agreement with the human labels, identify the top 3 disagreement patterns, refine the judge prompt with 2 few-shot examples, and re-measure.

### Recommended reading
- HF guidebook, "Evaluating your evaluator"
- Iusztin, Lesson 5 of the AI Evals Roadmap
- DeepEval, [evaluating evaluators](https://docs.confident-ai.com/docs/metrics-introduction)

---

## LESSON 5 OF 6: Medical Evaluation — The Clinical Layer
**Estimated time:** 35 minutes (25 min content / 10 min discussion)

### Learning objectives
1. Articulate **harm asymmetry** as the defining feature of clinical evals (a wrong drug dose ≠ a wrong movie recommendation)
2. Map the clinical benchmark landscape: MedQA, PubMedQA, MedMCQA, **MedHELM**, **HealthBench**, USMLE-style sets, oncology-specific evaluations
3. Treat **safety as a first-class metric**: contraindication recall, calibrated uncertainty, refusal-to-answer, fairness across patient demographics
4. Frame evaluation under **regulatory expectations**: FDA SaMD risk classification, ISO 13485 audit-trail hooks, IMDRF Good Machine Learning Practice

### Key concepts
- Why generic benchmarks under-measure clinical safety
- Closed-book vs. open-book medical evals (and why open-book/RAG-grounded is the realistic setting at KHCC)
- Calibrated refusal: a model that says "I don't know" appropriately is *more* useful clinically than a confident hallucinator
- Demographic stress-testing: same question, varied patient ages / sexes / ethnicities — does the answer drift?
- Audit-trail thinking: every eval result is a regulatory artifact

### Hands-on activity (~10 min)
**Group discussion**: students bring a clinical AI tool they have built or seen at KHCC. In pairs, they list (a) the top 3 safety failure modes, (b) one functional check that would catch each, (c) which clinical benchmark (if any) covers the underlying capability. Share two examples back to the room.

### Recommended reading
- Singhal et al., [Towards Expert-Level Medical QA with Med-PaLM](https://www.nature.com/articles/s41586-023-06291-2)
- Stanford CRFM, [MedHELM](https://crfm.stanford.edu/helm/medhelm/) — landing page + the most recent leaderboard snapshot
- OpenAI, [HealthBench](https://openai.com/index/healthbench/)
- FDA, [Artificial Intelligence/Machine Learning (AI/ML)-Based Software as a Medical Device (SaMD) Action Plan](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device)
- IMDRF, [Good Machine Learning Practice for Medical Device Development: Guiding Principles](https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles)

---

## LESSON 6 OF 6: Putting It Together — KHCC Case Study & Production
**Estimated time:** 35 minutes (10 min content / 25 min walkthrough + Q&A)

### Learning objectives
1. Walk an end-to-end eval pipeline on a KHCC-realistic clinical tool (e.g., oncology summary or cohort-extraction agent)
2. Set up a basic **production observability** loop in Opik (or an equivalent open-source platform)
3. Detect **drift** on live traffic and trigger re-evaluation
4. Hand off to Session 8 (students bring an eval to a paper they present) and Session 9 (wire the harness into a repo CI step)

### Key concepts
- Three-layer integration in practice: dev experiments → CI regression check → live monitoring
- The eval harness is part of the product, not a side script
- Treat the agent as a **data product**: you instrument, observe, version, and improve it like one
- The "eval debt" trap: shipping without evals is borrowing speed against future pain

### Hands-on activity (~25 min)
**Live walkthrough** (instructor-led, students follow in their own repo if they have one):
1. Take an existing CCI tool (suggest: the cohort-extraction agent from earlier sessions or an oncology-summary prototype)
2. Apply Lessons 2–4 to build a 30-case eval dataset and one functional + one LLM-judge metric
3. Wrap evals as a Python script that runs on every commit (preview of Session 9)
4. Push 5 simulated production traces to Opik and demonstrate drift detection on a degraded prompt

### Recommended reading
- Iusztin, Lesson 7 of the AI Evals Roadmap (production lessons)
- Opik docs, [Tracing & monitoring quickstart](https://www.comet.com/docs/opik/)
- Microsoft, [Responsible AI dashboard](https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai-dashboard) — for a regulated-environment perspective
- HF guidebook, "The forgotten children of evaluation" (statistical validity, cost, environmental impact)

---

## Wrap-up Challenge (optional, take-home)
Pick one tool you have built or used at KHCC. Produce:
1. A 30-case labeled eval dataset (with rubric)
2. One functional metric + one LLM-judge metric (validated against your labels)
3. A 1-page "model card" describing what your evals do and do not cover
4. Bring it to Session 8 — be ready to defend it in 5 minutes

This becomes the seed for the eval harness you will wire into your repo in Session 9.

---

## Notes for the instructor
- Lessons 5 and 6 carry the highest novelty for clinicians — protect their time
- If running short, trim Lesson 1 to 15 min; the cohort already has eval intuition from Session 6's DeepEval lab
- All Colab notebooks should ship with anonymized data only — no PHI
- The hand-off bullets in Lesson 6 are critical: they make Sessions 8 and 9 feel like a continuation, not a reset
