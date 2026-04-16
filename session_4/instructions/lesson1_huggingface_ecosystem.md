---
layout: page
title: "Lesson 1: The HuggingFace Ecosystem"
permalink: /session-04/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-04/">&#8249; Back to Session 4</a>

# CCI Session 4 -- Lesson 1: The HuggingFace Ecosystem -- A Guided Tour

**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Welcome to Session 4. Over the past three sessions you learned how to craft effective prompts, write Python code, and call the OpenAI API to extract structured clinical data. All of that work relied on proprietary models -- you sent data to OpenAI's servers and paid per token. Today we enter a completely different world: open-source AI. The center of that world is HuggingFace, which you can think of as the GitHub of artificial intelligence. It hosts over 800,000 models and 200,000 datasets that anyone can download, inspect, and run locally. For a cancer center like KHCC, this matters enormously -- you can process patient data without sending a single byte outside your network, there are no API fees, and you can customize models for your exact clinical tasks. By the end of this lesson you will know how to navigate the HuggingFace ecosystem, read a model card, understand licensing, and identify which clinical models are relevant to oncology work at KHCC.

---

## NotebookLM Summary

HuggingFace is an open-source platform that serves as the central hub for sharing and discovering machine learning models, datasets, and applications. The platform is organized around several core components. The Model Hub hosts hundreds of thousands of pre-trained models spanning natural language processing, computer vision, audio, and multimodal tasks. Each model is accompanied by a model card -- a structured document that describes what the model does, what data it was trained on, how it performs, what its limitations are, and how it should be used. Learning to read model cards critically is an essential skill, much like reading a drug label before prescribing a medication. The Datasets Hub provides curated collections of training and evaluation data, including biomedical corpora, clinical note collections, and radiology report datasets that are directly relevant to cancer care informatics. Spaces allow developers to build and share interactive demos powered by Gradio or Streamlit, so you can test a model in your browser before writing any code. The Inference API lets you send a quick request to a hosted model for rapid prototyping, and the Transformers library is the Python package that ties everything together, letting you load and run any model in just a few lines of code.

For clinical AI at KHCC, the open-source ecosystem offers three decisive advantages. First, data sovereignty: patient data never leaves your infrastructure when you run models locally, which is critical for handling Protected Health Information and complying with institutional data governance policies. Second, cost: once you download a model, running inference costs only the electricity to power your GPU -- there are no per-token fees that scale with volume, making it feasible to process thousands of pathology reports or radiology findings without budget constraints. Third, customization: you can fine-tune any open-source model on KHCC-specific data -- Arabic clinical notes, Jordanian dialect terms, or institution-specific reporting formats -- something that is impossible with closed APIs.

Several pre-trained models are particularly relevant to oncology and clinical NLP. BioBERT was trained on PubMed abstracts and PMC full-text articles, giving it a strong understanding of biomedical language. ClinicalBERT extends BERT with training on clinical notes from the MIMIC-III dataset, making it more attuned to the informal, abbreviated style of real clinical documentation. PubMedBERT was trained exclusively on PubMed text from scratch rather than being initialized from general-domain BERT, which gives it a vocabulary that is natively biomedical. When selecting a model, licensing matters: Apache 2.0 and MIT licenses allow unrestricted commercial and clinical use, while some models carry research-only restrictions that would limit deployment in a production clinical workflow.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Watch (recommended):** [What is Hugging Face? — Models, Datasets & Spaces](https://www.youtube.com/watch?v=qP9mbY3wuWk&t=419s) (~20 min) — a beginner-friendly walkthrough covering the three pillars of the ecosystem. After watching, [take the video quiz]({{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_video.html) to check your understanding.
- **Action:** Create a free HuggingFace account at <https://huggingface.co/join> -- you will need it for the labs.
- **Browse:** Spend 10 minutes exploring the Model Hub at <https://huggingface.co/models>. Filter by task (e.g., "Token Classification" or "Text Classification") and by language (English). Note how many models exist for each task.
- **Warm-up question:** A radiation oncologist at KHCC asks you to build a tool that extracts tumor locations from Arabic radiology reports. Would you prefer to use the OpenAI API or a locally-run open-source model? List two reasons for your choice, thinking about data privacy and cost.

### During Class -- What to Focus On

1. **Model cards** -- learn to read them critically. Pay attention to the "Training Data," "Intended Use," and "Limitations" sections, just as you would read contraindications on a drug label.
2. **Task taxonomy** -- understand how HuggingFace categorizes models by task (NER, classification, summarization, question-answering, text generation) and why choosing the right task category is the first step when solving a clinical problem.
3. **Licensing** -- know the difference between Apache 2.0 (use anywhere, including clinical production), MIT (similarly permissive), and research-only licenses (cannot deploy in patient-facing systems).
4. **Clinical model landscape** -- note the names BioBERT, ClinicalBERT, and PubMedBERT and understand when each is most appropriate.

**Common traps:**

- Assuming that a model with millions of downloads is automatically the best choice for your clinical task -- popularity does not equal domain fitness.
- Ignoring the license field on a model card and later discovering that a research-only model cannot be used in a deployed clinical tool at KHCC.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Log in to HuggingFace and generate an access token from your account settings.
2. Browse the Model Hub and find three models designed for biomedical or clinical NLP tasks.
3. For each model, read its model card and record: (a) what task it performs, (b) what data it was trained on, (c) what license it uses, and (d) one stated limitation.

**Extra practice (optional):**

- Find a model trained on clinical notes (not just PubMed abstracts) and compare its model card to one trained only on biomedical literature. Write a short paragraph explaining which you would prefer for processing KHCC discharge summaries and why.
- Explore HuggingFace Spaces and find one interactive demo related to biomedical text. Try it with a sample oncology sentence and note the result.

**Self-check questions:**

1. What are the three main advantages of using open-source models instead of proprietary APIs for clinical AI at a cancer center like KHCC?
2. What is the difference between BioBERT and ClinicalBERT in terms of training data, and when would you choose one over the other?
3. A model card lists the license as "CC BY-NC-SA 4.0." Can you deploy this model in a production clinical system at KHCC? Why or why not?

### Resources

| Resource | Link |
|----------|------|
| Video: What is Hugging Face? (Models, Datasets & Spaces) | <https://www.youtube.com/watch?v=qP9mbY3wuWk&t=419s> |
| Video Quiz | [Take the video quiz]({{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_video.html) |
| Slides: Hugging Face Models | [Google Slides](https://docs.google.com/presentation/d/1UHwp_HqYJALr2FBdDm4q0aZe49B_1j-8LBtrcW0V3AA/edit?usp=sharing) |
| HuggingFace Model Hub | <https://huggingface.co/models> |
| HuggingFace Datasets Hub | <https://huggingface.co/datasets> |
| HuggingFace Spaces | <https://huggingface.co/spaces> |
| BioBERT Model Card | <https://huggingface.co/dmis-lab/biobert-base-cased-v1.2> |
| PubMedBERT Model Card | <https://huggingface.co/microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext> |
| HuggingFace Documentation -- Getting Started | <https://huggingface.co/docs/hub/index> |
