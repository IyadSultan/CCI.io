---
layout: page
title: "Lesson 1: OpenAI API Fundamentals"
permalink: /session-03/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-03/">&#8249; Back to Session 3</a>

# CCI Session 3 -- Lesson 1: OpenAI API Fundamentals

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Welcome back, everyone. In Session 1 you explored the OpenAI Playground -- you typed prompts, adjusted settings, and watched GPT respond in real time. In Session 2 you built your Python foundation: variables, loops, functions, classes, and even some pandas work. Today we bring those two worlds together. You are going to write Python code that sends a prompt to GPT and gets a structured answer back -- no browser required. By the end of this lesson you will be able to call the OpenAI API from a Colab notebook, control how the model responds using parameters, count tokens, estimate cost, and apply prompting strategies you already know (zero-shot, few-shot, chain-of-thought) entirely in code.

---

## NotebookLM Summary

The OpenAI Python SDK (version 1.x and above) is the official library for interacting with OpenAI models programmatically. Installation is straightforward: a single `pip install openai` command in your Colab notebook. Once installed, you create a client by instantiating `OpenAI(api_key="your-key")` and then call `client.chat.completions.create(...)` to send a request to the model. This single method is the gateway to every chat-based interaction you will build throughout this course.

Every chat completion call requires a `messages` parameter -- a list of dictionaries, each with a `role` and `content` field. The three roles form the backbone of every conversation. The **system** role sets the overall behavior and persona of the model; for example, you might instruct it to act as an oncology clinical documentation assistant at KHCC. The **user** role carries the actual question or task, such as "Classify the following clinical note as progression, stable disease, or partial response." The **assistant** role contains prior model responses; including it lets you simulate multi-turn conversations or provide the model with examples of desired output format.

Key parameters give you fine-grained control over model behavior. The `model` parameter selects which GPT variant to use (e.g., `gpt-4o`, `gpt-4o-mini`). The `temperature` parameter (0.0 to 2.0) governs randomness: a value near 0 produces deterministic, consistent outputs ideal for clinical classification tasks, while higher values introduce creativity useful for generating patient-education drafts. The `max_tokens` parameter caps the length of the response, preventing runaway outputs and controlling cost. The `top_p` parameter offers an alternative way to control diversity through nucleus sampling; in practice, you typically adjust either temperature or top_p but not both simultaneously.

Understanding tokens is essential because OpenAI charges per token and every model has a finite context window. Tokens are not words -- they are subword units, and a typical English word maps to roughly 1.3 tokens while clinical terminology and Arabic text often tokenize less efficiently. The `tiktoken` library lets you count tokens before sending a request: you load the encoding for your chosen model, call `encode()` on your text, and check the length. This allows you to verify that your prompt fits within the context window and to estimate cost in advance. OpenAI pricing distinguishes between input tokens (your prompt) and output tokens (the model's reply), with output tokens typically costing more. Building a simple cost-estimation function early in your workflow prevents billing surprises, especially when processing batches of pathology reports or discharge summaries.

For longer outputs -- such as generating a comprehensive treatment summary -- streaming is valuable. By passing `stream=True` to the completion call, the model returns partial results as they are generated rather than waiting for the entire response. You iterate over the returned chunks and print each piece of content as it arrives, giving users immediate feedback.

Finally, the prompting strategies you learned in Session 1 translate directly into API calls. A zero-shot prompt sends a single user message with no examples, asking the model to classify a radiology finding. A few-shot prompt adds two or three assistant-turn examples before the actual query, showing the model exactly what format you expect -- for instance, extracting tumor size and location from a pathology report. Chain-of-thought prompting instructs the model to reason step by step before giving a final answer, which improves accuracy on complex clinical reasoning tasks such as staging a newly diagnosed lymphoma case based on multiple data points. Each of these techniques is implemented simply by structuring your messages list differently.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** OpenAI official quickstart guide -- focus on the "Chat completions" section: <https://platform.openai.com/docs/quickstart>
- **Skim:** The `tiktoken` README on GitHub to understand what token counting looks like in code: <https://github.com/openai/tiktoken>
- **Warm-up question:** A medical oncologist at KHCC asks you to build a tool that reads a free-text pathology report and extracts three fields: tumor type, grade, and margin status. Which message role would you use to define the extraction instructions, and which role would carry the actual pathology text? Write out a rough `messages` list in plain English (no code required).

### During Class -- What to Focus On

1. **The `messages` list structure** -- understand how `system`, `user`, and `assistant` roles work together and why their order matters.
2. **Temperature and its clinical implications** -- know when to use low temperature (structured extraction, classification) versus moderate temperature (drafting patient-friendly summaries).
3. **Token counting before sending** -- always count tokens with `tiktoken` before making an API call so you stay within context limits and can estimate cost.
4. **Few-shot prompting in code** -- learn how to add example assistant turns to your messages list to guide the model's output format.

**Common traps:**

- Forgetting to set a `system` message, which causes the model to lack clinical context and produce generic responses.
- Setting `max_tokens` too low, which truncates the response mid-sentence -- especially dangerous when extracting structured clinical data, because you may get incomplete JSON.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install the OpenAI SDK and create a client using your API key.
2. Write a chat completion call with a system message that instructs the model to act as a KHCC clinical documentation assistant.
3. Send a sample oncology clinical note as the user message and ask the model to classify the disease status.
4. Use `tiktoken` to count the tokens in your prompt and the response, then calculate the estimated cost using the current pricing for your chosen model.
5. Modify the temperature from 0.0 to 1.0 and compare the outputs side by side -- note which is more appropriate for clinical use.

**Extra practice (optional):**

- Build a function that takes a list of clinical notes and processes them in a loop, collecting the model's classification for each note into a pandas DataFrame.
- Experiment with few-shot prompting: add two example assistant turns that show the model how to extract tumor type and stage, then send a new note and verify it follows the format.

**Self-check questions:**

1. What is the difference between the `system` and `user` roles in a chat completion call, and why does the system message matter for clinical applications?
2. If a pathology report tokenizes to 3,200 input tokens and the model generates 450 output tokens using `gpt-4o-mini`, how would you estimate the cost? What information do you need?
3. Why should you count tokens with `tiktoken` before sending a request, rather than just relying on `max_tokens` to limit the response?

### Resources

| Resource | Link |
|----------|------|
| OpenAI API Reference -- Chat Completions | <https://platform.openai.com/docs/api-reference/chat> |
| OpenAI Python SDK GitHub | <https://github.com/openai/openai-python> |
| tiktoken -- Token Counting Library | <https://github.com/openai/tiktoken> |
| OpenAI Pricing Page | <https://openai.com/pricing> |
| OpenAI Cookbook -- How to Count Tokens | <https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken> |
| OpenAI Prompt Engineering Guide | <https://platform.openai.com/docs/guides/prompt-engineering> |
