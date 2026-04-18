---
layout: page
title: "Lesson 1: LangChain v1 Foundations"
permalink: /session-05/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-05/">&#8249; Back to Session 5</a>

# CCI Session 5 -- Lesson 1: LangChain v1 Foundations

**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Welcome to Session 5. Over the past four sessions you have built a strong foundation: prompt engineering in Session 1, Python programming in Session 2, direct OpenAI API calls with tool calling and conversation memory in Session 3, and HuggingFace models in Session 4. Today we step up to a framework that ties all of these pieces together. LangChain is an open-source Python library that gives you reusable building blocks for working with large language models -- think of it as a toolkit that handles the boilerplate so you can focus on your clinical application logic. LangGraph, its companion library, adds stateful graph-based workflows on top. In this first lesson you will install LangChain, create your first agent with `create_agent`, understand the Runnable interface that powers every component, and see exactly how a LangChain call compares to the raw `client.chat.completions.create()` you wrote in Session 3. By the end you will appreciate why a framework matters when your application grows beyond a single API call.

---

## NotebookLM Summary

LangChain (version 0.3+ with the v1 API) is a composable framework for building applications powered by large language models. Rather than writing raw HTTP calls or manually managing message lists, LangChain provides standardized abstractions -- chat models, prompts, output parsers, tools, and retrievers -- that snap together through a unified interface called Runnables. Every component in LangChain implements the Runnable protocol, which means it exposes `.invoke()`, `.batch()`, `.stream()`, and `.ainvoke()` methods. This consistency lets you chain components together, swap one model for another, or add logging without rewriting your application.

The central chat model wrapper is `ChatOpenAI` from `langchain_openai`. You instantiate it with a model name and optional parameters such as temperature, and then call `.invoke()` with a list of messages. Under the hood, `ChatOpenAI` translates your call into the same OpenAI API request you wrote manually in Session 3, but it returns a LangChain `AIMessage` object that carries metadata like token usage and tool calls in a standardized format. This abstraction matters because you can later replace `ChatOpenAI` with `ChatAnthropic` or a local HuggingFace model and none of your downstream code changes.

The quickest way to build a functional agent is `create_agent` from `langgraph.prebuilt`. You pass it a chat model and a list of tools, and it returns a compiled LangGraph agent that handles the full reasoning-action-observation loop automatically. This is equivalent to what you manually orchestrated with `while` loops and `tool_calls` parsing in Session 3, but now the framework manages state, tool dispatch, and stopping conditions for you.

Prompt templates in LangChain use `ChatPromptTemplate.from_messages()` to define reusable message structures with placeholder variables. For example, you might define a system message that instructs the model to act as a KHCC oncology assistant and a user message with a `{patient_query}` variable. Calling `.invoke({"patient_query": "What are the side effects of cisplatin?"})` fills in the placeholder and sends the completed messages to the model. This separation of template from data is especially useful when you process many patient queries with the same clinical instructions.

The Runnable interface also supports the pipe operator (`|`), allowing you to chain a prompt template into a model into an output parser in a single readable expression. This declarative style makes your clinical pipelines easy to read, test, and modify -- a significant improvement over deeply nested function calls.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** LangChain official introduction and concepts page -- focus on "Why LangChain" and "Runnables": <https://python.langchain.com/docs/concepts/>
- **Skim:** The `create_agent` documentation in the LangGraph prebuilt module: <https://langchain-ai.github.io/langgraph/reference/prebuilt/>
- **Warm-up question:** In Session 3 you wrote a `while` loop that called `client.chat.completions.create()`, checked for tool calls, executed them, appended results, and called the API again. What problems might arise if you need to add error handling, logging, memory, and five more tools to that loop? Write down two or three pain points in plain English.

### During Class -- What to Focus On

1. **The Runnable interface** -- understand that every LangChain component (model, prompt, parser) exposes `.invoke()`, `.stream()`, and `.batch()`, and that this consistency is what makes components composable.
2. **`ChatOpenAI` vs raw OpenAI SDK** -- notice what the wrapper adds: standardized message types (`HumanMessage`, `AIMessage`, `SystemMessage`), automatic token tracking, and seamless tool integration.
3. **`create_agent`** -- understand that this single function builds a complete agent graph with tool-calling, state management, and a stopping condition, replacing the manual loop from Session 3.
4. **Prompt templates** -- learn how `ChatPromptTemplate.from_messages()` separates your clinical instructions from patient-specific data.

**Common traps:**

- Importing from deprecated paths like `langchain.chat_models` instead of `langchain_openai`. Always use the integration packages (`langchain_openai`, `langchain_anthropic`).
- Confusing `invoke()` (single input) with `batch()` (list of inputs) -- using the wrong one produces confusing errors.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Install `langchain`, `langchain-openai`, and `langgraph` using pip. Verify the installation by importing `ChatOpenAI`.
2. Create a `ChatOpenAI` instance with `model="gpt-4o-mini"` and `temperature=0`. Send a single `HumanMessage` asking "What is the standard first-line treatment for stage III non-small cell lung cancer?" and print the response.
3. Build a `ChatPromptTemplate` with a system message instructing the model to act as a KHCC oncology pharmacist and a user message with a `{drug_name}` placeholder. Invoke it for three different chemotherapy drugs and compare outputs.
4. Use `create_agent` with your `ChatOpenAI` instance and an empty tool list. Invoke it with a clinical question and examine the returned state dictionary.
5. Compare your LangChain code side by side with equivalent raw OpenAI SDK code from Session 3. Note the differences in lines of code, error handling, and readability.

**Extra practice (optional):**

- Chain a prompt template, `ChatOpenAI`, and a `StrOutputParser` using the pipe operator (`|`). Stream the output token by token to the console.
- Experiment with replacing `ChatOpenAI` with a different model wrapper to see how the Runnable interface keeps your code stable.

**Self-check questions:**

1. What method do you call on any LangChain Runnable to process a single input, and what is the equivalent method for processing a list of inputs?
2. Why does LangChain use separate packages like `langchain-openai` rather than bundling all model providers in one library?
3. How does `create_agent` simplify the tool-calling loop you built manually in Session 3?

### Resources

| Resource | Link |
|----------|------|
| LangChain Concepts & Architecture | <https://python.langchain.com/docs/concepts/> |
| LangChain OpenAI Integration | <https://python.langchain.com/docs/integrations/chat/openai/> |
| LangGraph Prebuilt Agents | <https://langchain-ai.github.io/langgraph/reference/prebuilt/> |
| LangChain Runnables Interface | <https://python.langchain.com/docs/concepts/runnables/> |
| LangChain Prompt Templates | <https://python.langchain.com/docs/concepts/prompt_templates/> |
| LangGraph Quick Start | <https://langchain-ai.github.io/langgraph/tutorials/introduction/> |
