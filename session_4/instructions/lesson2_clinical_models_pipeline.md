---
layout: page
title: "Lesson 2: Clinical Models & the Pipeline API"
permalink: /session-04/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-04/">&#8249; Back to Session 4</a>

# CCI Session 4 -- Lesson 2: Clinical Models & the Pipeline API

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

In the last lesson you toured the HuggingFace ecosystem and learned to read model cards. Now you are going to actually use these models. The good news is that HuggingFace designed an entry point so simple that you can run a state-of-the-art clinical NLP model in three lines of Python. That entry point is the `pipeline()` function. You give it a task name -- like "ner" for named entity recognition or "summarization" -- optionally specify a model, and call it on your text. Behind the scenes, the library downloads the model, tokenizes your input, runs inference, and formats the output. By the end of this lesson you will understand how tokenization works, how to pick the right model for a clinical task, and how to compare multiple models on the same oncology clinical note.

---

## NotebookLM Summary

The `pipeline()` function from the HuggingFace Transformers library is the simplest way to run inference with a pre-trained model. You import it with `from transformers import pipeline`, specify a task, and optionally pass a model name. If you omit the model name, HuggingFace selects a sensible default, but for clinical work you will almost always want to specify a domain-specific model explicitly. The supported tasks most relevant to oncology informatics include token classification for named entity recognition (extracting drug names, tumor sites, or lab values from clinical text), text classification for categorizing documents or sentences (e.g., classifying a radiology impression as normal versus abnormal), summarization for condensing lengthy operative notes or discharge summaries, text generation for producing draft clinical text, question answering for extracting specific facts from a clinical passage, and fill-mask for understanding how a model represents biomedical language by predicting masked tokens.

Before a model can process text, that text must be converted into numbers through a process called tokenization. The tokenizer splits text into subword units called tokens, maps each token to an integer ID using a fixed vocabulary, and those IDs are then converted into dense vector representations called embeddings that the model actually processes. The vocabulary a model uses is determined during its pre-training and has significant implications for clinical NLP. A general-domain tokenizer trained on Wikipedia and web text may split a word like "cholangiocarcinoma" into five or six subword pieces, while a biomedical tokenizer trained on PubMed might represent it as a single token or two. Fewer tokens mean more efficient processing and often better understanding of domain-specific terms. This is why models like PubMedBERT, which was trained from scratch on biomedical text with its own vocabulary, can outperform general-domain BERT on clinical benchmarks even when both have the same architecture.

Loading a specific model is straightforward: you pass the model identifier from the Hub to the `pipeline()` call. For biomedical named entity recognition, the model `d4data/biomedical-ner-all` is trained to extract entities such as diseases, drugs, and procedures from clinical text. For understanding clinical language, `emilyalsentzer/Bio_ClinicalBERT` was fine-tuned on MIMIC-III clinical notes and captures the abbreviations, shorthand, and implicit context common in real hospital documentation. `microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext` provides strong general biomedical understanding trained exclusively on PubMed. For text generation and summarization tasks with smaller compute budgets, `google/flan-t5-small` offers a capable instruction-following model that runs comfortably on a free Colab GPU.

Running inference is as simple as calling the pipeline object on a string or a list of strings. When you pass a list, the library automatically handles batching -- processing multiple inputs together for efficiency. This is particularly useful when you need to process dozens of pathology reports or clinical notes in a single session. After running inference, you can compare outputs from different models on the same clinical note to see which one captures oncology-specific entities more accurately -- for example, testing whether a biomedical NER model correctly identifies "invasive ductal carcinoma" as a disease entity and "left mastectomy" as a procedure, versus a general-domain model that might miss or misclassify these terms.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** The HuggingFace Transformers pipeline documentation -- focus on the "Quick tour" section: <https://huggingface.co/docs/transformers/pipeline_tutorial>
- **Skim:** The tokenizer summary page to understand what tokenization does at a high level: <https://huggingface.co/docs/transformers/tokenizer_summary>
- **Warm-up question:** A KHCC pathologist gives you a free-text biopsy report and asks you to automatically highlight all mentions of cancer types, anatomical locations, and medications. Which HuggingFace pipeline task would you use, and why? Write your answer in one or two sentences.

### During Class -- What to Focus On

1. **The tokenization flow** -- understand the full chain: raw text to tokens to integer IDs to embeddings. Know why biomedical tokenizers produce fewer tokens for medical terms than general-domain tokenizers.
2. **How to pick a model** -- learn the decision process: identify your task, search the Hub for domain-specific models, read the model card, check the license, and test on a sample input before committing.
3. **Pipeline syntax** -- be comfortable with `pipeline(task, model=...)` and calling the result on a string or list of strings.
4. **Comparing models** -- understand why running two or three models on the same clinical note is the fastest way to evaluate which one works best for your specific KHCC use case.

**Common traps:**

- Using a general-domain model for clinical text and wondering why it misses oncology-specific entities -- always check what data the model was trained on.
- Forgetting that tokenizer vocabulary differences mean the same sentence will produce different token counts with different models, which affects context window limits and processing time.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install the Transformers library and import the `pipeline` function.
2. Create an NER pipeline using `d4data/biomedical-ner-all` and run it on a sample oncology clinical note that mentions a diagnosis, a drug, and a procedure.
3. Create a second NER pipeline using a general-domain model and run it on the same note. Compare the two outputs side by side.
4. Use the `AutoTokenizer` to tokenize a clinical sentence with both a biomedical and a general-domain tokenizer. Count the tokens produced by each and note the difference.
5. Create a fill-mask pipeline with `Bio_ClinicalBERT` and test it by masking a clinical term in a sentence (e.g., "The patient was diagnosed with [MASK] carcinoma of the breast.") to see what the model predicts.

**Extra practice (optional):**

- Build a function that takes a list of clinical notes and a model name, runs NER on each note, and collects all unique entities into a pandas DataFrame with columns for entity text, entity type, and confidence score.
- Try a summarization pipeline with `google/flan-t5-small` on a long discharge summary and evaluate whether the output captures the key clinical information.

**Self-check questions:**

1. What are the three steps in the tokenization process, and why does vocabulary choice matter for clinical NLP?
2. If you need to extract drug names and diagnoses from KHCC pathology reports, which pipeline task and which model would you choose? Justify your answer.
3. Why is it valuable to compare multiple models on the same clinical note before selecting one for a production workflow?

### Resources

| Resource | Link |
|----------|------|
| HuggingFace Transformers -- Pipeline Tutorial | <https://huggingface.co/docs/transformers/pipeline_tutorial> |
| HuggingFace Tokenizer Summary | <https://huggingface.co/docs/transformers/tokenizer_summary> |
| d4data/biomedical-ner-all Model Card | <https://huggingface.co/d4data/biomedical-ner-all> |
| Bio_ClinicalBERT Model Card | <https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT> |
| BiomedBERT Model Card | <https://huggingface.co/microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext> |
| HuggingFace Tasks Overview | <https://huggingface.co/tasks> |
