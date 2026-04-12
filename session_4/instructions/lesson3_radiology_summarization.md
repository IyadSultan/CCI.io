---
layout: page
title: "Lesson 3: Fine-Tuning for Radiology Report Summarization"
permalink: /session-04/lesson-3-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-04/">&#8249; Back to Session 4</a>

# CCI Session 4 -- Lesson 3: Fine-Tuning for Radiology Report Summarization

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

**Interactive (optional):** [Hyperparameters explainer — LR, batch size, epochs, warmup]({{ site.baseurl }}/session_4/practices/hyperparameters_interactive_explainer.html) — toy curves and notes aligned with HuggingFace `TrainingArguments` (simulation for teaching, not a real trainer).

---

## Instructor Introduction

In the previous lesson you used pre-trained models straight off the shelf. That works well for general biomedical NLP, but when you need a model to perform a specific clinical task -- like reading a chest X-ray findings section and writing the impressions summary -- off-the-shelf models fall short. They were never trained on that exact task. This is where fine-tuning comes in. Fine-tuning takes a model that already understands language and teaches it your specific task using your data. Think of it like a medical student who has completed their basic sciences -- they understand biology and anatomy, but they still need a residency to specialize. Today we will fine-tune a language model on real radiology reports so it learns to generate the impressions section from the findings section, exactly the way a radiologist would.

---

## NotebookLM Summary

Fine-tuning is a form of transfer learning where you take a model that has already been pre-trained on a large general corpus and continue training it on a smaller, task-specific dataset. The model retains the broad language understanding it acquired during pre-training -- grammar, vocabulary, reasoning patterns -- while learning the particular input-output mapping your task requires. The key decision in clinical NLP is when to fine-tune versus when to rely on prompt engineering with a large language model. Fine-tuning is preferred when you have a well-defined task with consistent input-output structure, when you need the model to run locally without API costs, when you have labeled examples available, and when you need high reliability on domain-specific patterns. Prompt engineering with a model like GPT-4o is preferred when the task is more open-ended, when you have few or no labeled examples, or when you need rapid prototyping before investing in fine-tuning.

The dataset we use in this lesson is the Open-I Indiana University Chest X-Ray collection, which contains approximately 3,800 radiology reports with both findings and impressions sections. Each report represents a real radiological interpretation of a chest X-ray image. The findings section describes what the radiologist observes -- lung fields, cardiac silhouette, bony structures, mediastinal contours -- and the impressions section distills those observations into a concise clinical summary. This findings-to-impressions mapping is a natural summarization task and one of the most common use cases for NLP in radiology departments, including at KHCC where radiologists write hundreds of such reports daily.

Loading and preparing the data uses the HuggingFace `datasets` library. You load the dataset, inspect its structure, and then preprocess it for your model. Preprocessing involves tokenizing both the input (findings) and the target (impressions) using the model's tokenizer, truncating or padding sequences to a fixed length, and setting up the target tokens so the model learns to generate the correct output. This preprocessing step is often where beginners encounter the most confusion, because the tokenizer must be applied consistently to both inputs and labels, and the label tokens must be properly formatted for the loss function to work correctly.

The Trainer API from HuggingFace simplifies the training loop into a configuration-driven workflow. You define a `TrainingArguments` object that specifies hyperparameters: the number of epochs (how many times the model sees the entire dataset, typically two to five for fine-tuning), the learning rate (usually between 1e-5 and 5e-5 for transformer fine-tuning, much smaller than training from scratch), the batch size (limited by GPU memory -- on a free Colab T4 GPU you will typically use a batch size of 4 or 8), and the output directory where checkpoints are saved. You then create a `Trainer` object with your model, training arguments, training dataset, and evaluation dataset, and call `trainer.train()` to begin fine-tuning.

Evaluation uses ROUGE metrics, which are standard for summarization tasks. ROUGE-1 measures the overlap of individual words between the generated summary and the reference summary. ROUGE-2 measures the overlap of two-word phrases, capturing more of the structural similarity. ROUGE-L measures the longest common subsequence, reflecting the overall flow and ordering of the generated text. Comparing ROUGE scores before and after fine-tuning reveals how much the model has learned. A base model that has never seen radiology reports might produce generic summaries that score below 10 on ROUGE-L, while a fine-tuned model can reach scores of 30 or higher, generating impressions that closely mirror what a radiologist would write. The free T4 GPU available in Google Colab is sufficient for this exercise, though training will take approximately 15-20 minutes depending on the number of epochs.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** The Wikipedia article on ROUGE metrics to understand what they measure at a conceptual level: <https://en.wikipedia.org/wiki/ROUGE_(metric)>
- **Skim:** The HuggingFace Trainer documentation overview: <https://huggingface.co/docs/transformers/trainer>
- **Warm-up question:** At KHCC, a radiologist writes a chest X-ray report with a "Findings" section and an "Impressions" section. In your own words, explain the difference between these two sections and why automatically generating the impressions from the findings would be useful in a busy radiology department.

### During Class -- What to Focus On

1. **Transfer learning concept** -- understand the analogy: pre-training is like medical school (broad knowledge), fine-tuning is like residency (task specialization). The model is not learning language from scratch.
2. **Data preprocessing** -- pay close attention to how findings and impressions are tokenized and formatted as input-label pairs. This is the most error-prone step.
3. **Training configuration** -- understand what each hyperparameter controls: epochs (how long you train), learning rate (how aggressively the model updates), and batch size (how many examples it processes at once, limited by GPU memory).
4. **ROUGE interpretation** -- know what ROUGE-1, ROUGE-2, and ROUGE-L measure and why higher scores indicate better summarization quality.

**Common traps:**

- Setting the learning rate too high (e.g., 1e-3 instead of 2e-5), which causes the model to "forget" its pre-trained knowledge -- a phenomenon called catastrophic forgetting.
- Running out of GPU memory because the batch size is too large for the free Colab T4. If you see a CUDA out-of-memory error, reduce the batch size to 2 or 4.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Load the radiology report dataset using the `datasets` library and inspect the structure of a few examples, noting the findings and impressions fields.
2. Tokenize the dataset using the model's tokenizer, setting appropriate maximum lengths for input and target sequences.
3. Configure `TrainingArguments` with the provided hyperparameters (3 epochs, learning rate 2e-5, batch size 4) and create a `Trainer` instance.
4. Run training and monitor the loss curve -- it should decrease over the training steps.
5. Evaluate the fine-tuned model on the test set using ROUGE metrics and compare the scores to the base model's performance.

**Extra practice (optional):**

- Experiment with hyperparameters: try training for 5 epochs instead of 3, or change the learning rate to 5e-5. Record how ROUGE scores change and whether you observe overfitting (training loss decreasing while evaluation loss increases).
- Take a radiology findings section that was not in the training data and generate an impressions summary with both the base model and your fine-tuned model. Compare the outputs qualitatively -- does the fine-tuned version read more like a real radiology impression?

**Self-check questions:**

1. What is the difference between pre-training and fine-tuning, and why does fine-tuning require far less data and compute than training from scratch?
2. What does a ROUGE-2 score of 25 mean in practical terms? Is it a perfect summary, a good summary, or a poor summary?
3. A KHCC colleague wants to fine-tune a model to summarize pathology reports instead of radiology reports. What would they need to change about this workflow, and what would stay the same?

### Resources

| Resource | Link |
|----------|------|
| HuggingFace Trainer Documentation | <https://huggingface.co/docs/transformers/trainer> |
| HuggingFace Datasets Library | <https://huggingface.co/docs/datasets/index> |
| Open-I Indiana University CXR Collection | <https://openi.nlm.nih.gov/faq#collection> |
| ROUGE Metric -- Wikipedia | <https://en.wikipedia.org/wiki/ROUGE_(metric)> |
| HuggingFace Summarization Guide | <https://huggingface.co/docs/transformers/tasks/summarization> |
| Google Colab GPU Runtime Setup | <https://colab.research.google.com/> |
