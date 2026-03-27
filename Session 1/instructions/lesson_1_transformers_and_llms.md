---
layout: page
title: "Lesson 1: Transformers & LLMs"
permalink: /session-01/lesson-1-instructions/
---

# CCI Session 1 — Lesson 1 of 5: What Are LLMs and the Transformer Revolution in Medicine

**Estimated time:** 25 minutes (15 content + 10 practice)

---

## Instructor Introduction

Welcome to the CCI Prompt Engineering course. Before we touch a single prompt, we need to understand what we are actually talking to. Today we start with the engine behind every clinical AI tool you will encounter: the Transformer architecture. I want you to walk out of this lesson understanding that an LLM is not a doctor, not a database, and not a search engine. It is a statistical pattern-matcher trained on text. Once you understand that, everything else in this course will click: why prompts matter, why hallucinations happen, and why evaluation is non-negotiable. By the end of this lesson, you will be able to explain in plain language what tokens, embeddings, attention, and context windows are, and why they matter for clinical text.

---

## NotebookLM Summary

Large Language Models (LLMs) like GPT-4, Claude, and Gemini are built on the Transformer architecture, introduced in the 2017 paper "Attention Is All You Need." At their core, Transformers process text by first breaking it into tokens: subword units that the model uses as its vocabulary. Each token is converted into a numerical embedding, a high-dimensional vector that captures semantic meaning. The breakthrough of the Transformer is the self-attention mechanism, which allows the model to weigh relationships between every token in a sequence simultaneously, rather than reading left to right like older recurrent networks.

For clinicians, the critical insight is that LLMs are statistical pattern-matchers, not reasoning engines. When an LLM generates a response about a patient's diagnosis, it is predicting the most probable next token based on patterns learned during training. It has no access to a patient's actual medical record unless you provide it in the prompt. This is why the context window matters: it defines how much text the model can see at once, typically ranging from 4,000 to 200,000 tokens depending on the model.

Consider a clinical example. When you paste a discharge summary into an LLM and ask it to extract the primary diagnosis, the model reads every token in that summary, uses attention to identify which tokens are most relevant to the concept of "primary diagnosis," and generates output token by token. If the summary mentions both "Type 2 diabetes mellitus" and "acute myeloid leukemia," the attention mechanism helps the model weigh which condition the document treats as primary based on context clues like section headers, frequency of mention, and clinical narrative structure.

Understanding these fundamentals is essential because every technique we learn in later lessons, from prompt engineering to structured output to hallucination mitigation, is a strategy for working within the constraints and capabilities of this architecture. The Transformer does not "know" medicine; it has learned statistical patterns from medical text. Our job as clinical AI practitioners is to guide those patterns toward accurate, safe, and useful outputs.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Lab Exercise

**Title:** Exploring the OpenAI Playground: Your First Clinical Prompt
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> You are a clinical informatics fellow who has just received a batch of 50 oncology discharge summaries. Before building any automation, you want to understand how the LLM "sees" your text by experimenting with the Playground.

**Objective:**
By the end of this lab, students will have submitted their first prompt in the OpenAI Playground and observed how changing a single word in the prompt changes the output.

**Setup:**
```
1. Open platform.openai.com/playground
2. Select GPT-4o model
3. Set temperature to 0
4. Set max tokens to 500
```

**Step-by-step instructions:**
1. Paste the following sample discharge summary excerpt into the system message: "You are a clinical data extraction assistant."
2. In the user message, type: "Extract the primary diagnosis from the following note:" followed by a sample discharge summary.
3. Submit and observe the output.
4. Now change "Extract the primary diagnosis" to "List all diagnoses mentioned in the following note:" and resubmit.
5. Compare the two outputs. Note how a small change in the prompt produced a completely different structure.
6. Try once more: "What is wrong with this patient?" and observe the difference in tone, specificity, and clinical accuracy.

**Expected output:**
Three different responses from the same note, demonstrating that the LLM's behavior is directly controlled by prompt wording, not by "understanding" the note.

**Stretch challenge:**
Try setting temperature to 1.0 and resubmitting the same prompt 3 times. Observe how the outputs vary. Why does this happen?

**KHCC connection:**
> This mirrors the first step in building any AIDI extraction pipeline: understanding how the model responds to different prompt formulations before writing production code.
