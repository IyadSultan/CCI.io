---
layout: page
title: "Lesson 2: Tools & the Agent Loop"
permalink: /session-05/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-05/">&#8249; Back to Session 5</a>

# CCI Session 5 -- Lesson 2: Tools & the Agent Loop

**Estimated time:** 25 minutes (13 min content / 12 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

In Session 3 you defined tools as JSON schemas, sent them to the OpenAI API, parsed `tool_calls` from the response, executed Python functions, and appended results back into the message list -- all manually. It worked, but it was fragile. LangChain gives you a much cleaner way to do this. In this lesson you will learn to define tools using the `@tool` decorator, which automatically generates the JSON schema from your function's docstring and type hints. You will see how the agent loop works inside `create_agent` -- the cycle of reasoning, selecting a tool, executing it, observing the result, and deciding whether to continue or stop. You will also learn how to handle errors gracefully, set stopping conditions, and design tools that are genuinely useful for clinical workflows at KHCC. By the end of this lesson you will have a working agent with custom clinical tools that can look up drug interactions, check lab reference ranges, and summarize patient data.

---

## NotebookLM Summary

Tools in LangChain are Python functions decorated with `@tool` from `langchain_core.tools`. The decorator inspects the function's name, docstring, and type annotations to automatically generate the tool schema that the language model uses to decide when and how to call the function. A well-designed tool has a clear, descriptive name (such as `check_drug_interaction`), a docstring that explains exactly what it does and what inputs it expects, and typed parameters with sensible defaults. The model reads the tool's description to decide whether to invoke it, so writing a precise docstring is just as important as writing correct function logic.

When you pass a list of tools to `create_agent`, LangGraph builds a compiled graph with two primary nodes: the agent node (which calls the language model) and the tool node (which executes whichever tool the model selected). The agent loop follows a fixed cycle. First, the agent node sends the current conversation state to the model along with the tool schemas. The model either returns a plain text response -- signaling that it has enough information to answer -- or returns one or more tool calls. If tool calls are present, the graph routes execution to the tool node, which runs the corresponding Python functions and appends the results as `ToolMessage` objects. Control then returns to the agent node, which sees the new tool results and decides its next step. This loop continues until the model produces a response with no tool calls, at which point the graph terminates and returns the final state.

Error handling is critical for production clinical tools. If a tool raises an exception -- for example, a database lookup fails because a drug name is misspelled -- the default behavior crashes the agent. LangChain provides a `handle_tool_error` parameter on the `@tool` decorator that catches exceptions and returns a user-friendly error message to the model instead. This lets the model recover gracefully: it might rephrase the query, ask the user for clarification, or try a different tool. For clinical applications at KHCC, this resilience is essential because patient-facing systems must not fail silently or crash on unexpected input.

Tool design follows several best practices. Each tool should do one thing well -- a tool that both looks up drug information and calculates dosing is harder for the model to use correctly than two separate tools. Input parameters should be typed and validated; for example, a `lookup_lab_range` tool should accept a `test_name: str` parameter and validate it against known test codes. Returning structured data (dictionaries or formatted strings) rather than raw database rows makes it easier for the model to incorporate results into a coherent clinical response. Finally, limiting the number of tools to those genuinely needed prevents the model from being overwhelmed with choices -- five to ten well-designed tools typically outperform thirty loosely defined ones.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** LangChain tools documentation -- focus on the `@tool` decorator and how schemas are generated: <https://python.langchain.com/docs/concepts/tools/>
- **Skim:** The LangGraph "How agent loops work" conceptual guide: <https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/>
- **Warm-up question:** A KHCC pharmacist wants an AI assistant that can check whether two chemotherapy drugs interact and also look up the recommended dose adjustment for renal impairment. Should this be one tool or two? Write a brief justification.

### During Class -- What to Focus On

1. **The `@tool` decorator** -- understand how the function name, docstring, and type hints map to the JSON schema the model receives. A poor docstring means the model will not know when to use the tool.
2. **The agent loop** -- trace the cycle: model call, tool selection, tool execution, result appended, model called again. Know when the loop terminates (no tool calls in the response).
3. **Error handling with `handle_tool_error`** -- understand why catching tool errors is essential for clinical reliability and how the model can recover from a failed tool call.
4. **Tool design principles** -- single responsibility, typed parameters, structured return values, and limiting tool count.

**Common traps:**

- Writing a vague docstring like "This tool does stuff with drugs" -- the model cannot determine when to invoke it and will either overuse or ignore it.
- Forgetting to handle errors in tools that call external services (databases, APIs), causing the entire agent to crash on a single bad input.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Define a `@tool` function called `get_drug_side_effects` that takes a `drug_name: str` parameter and returns a hardcoded dictionary of common side effects for three chemotherapy drugs (cisplatin, doxorubicin, paclitaxel). Include a descriptive docstring.
2. Define a second `@tool` function called `check_lab_range` that takes `test_name: str` and `value: float` and returns whether the value is below, within, or above the normal reference range for common oncology labs (hemoglobin, WBC, platelets, creatinine).
3. Create an agent using `create_agent` with `ChatOpenAI` and both tools. Invoke it with the query "My patient's creatinine is 2.3 and they are on cisplatin. What side effects should I watch for and is the creatinine concerning?"
4. Observe the agent's trace: note how many times the model called each tool, what arguments it passed, and how it synthesized the results into a final response.
5. Add `handle_tool_error=True` to one of your tools, then deliberately pass an invalid input to see how the agent recovers instead of crashing.

**Extra practice (optional):**

- Build a third tool called `calculate_bsa` that computes body surface area from height and weight using the Mosteller formula. Wire it into your agent and ask a dosing question that requires BSA.
- Experiment with writing an intentionally bad docstring and observe how the model misuses the tool. Then fix the docstring and compare.

**Self-check questions:**

1. What three pieces of information does the `@tool` decorator extract from your function to build the tool schema?
2. In the agent loop, what condition causes the loop to terminate and return a final answer?
3. Why is `handle_tool_error` important for clinical tools, and what happens when it is not set and a tool raises an exception?

### Resources

| Resource | Link |
|----------|------|
| LangChain Tools Concept Guide | <https://python.langchain.com/docs/concepts/tools/> |
| LangChain @tool Decorator Reference | <https://python.langchain.com/docs/how_to/custom_tools/> |
| LangGraph Agent Concepts | <https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/> |
| LangChain Tool Error Handling | <https://python.langchain.com/docs/how_to/tools_error/> |
| LangGraph Prebuilt create_agent | <https://langchain-ai.github.io/langgraph/reference/prebuilt/> |
| OpenAI Function Calling (for comparison) | <https://platform.openai.com/docs/guides/function-calling> |
