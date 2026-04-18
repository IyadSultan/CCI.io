---
layout: page
title: "Lesson 3: LangGraph — Stateful Workflows"
permalink: /session-05/lesson-3-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-05/">&#8249; Back to Session 5</a>

# CCI Session 5 -- Lesson 3: LangGraph -- Stateful Workflows

**Estimated time:** 25 minutes (13 min content / 12 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

So far you have used `create_agent` to build a prebuilt agent that handles the tool-calling loop for you. That is powerful for straightforward question-and-answer tasks, but real clinical workflows are rarely straightforward. Imagine a triage system at KHCC: a patient query arrives, you need to classify its urgency, route it to the right department, and optionally escalate to a human oncologist -- all with different logic at each step. This is where LangGraph shines. LangGraph lets you define a workflow as a directed graph: you create nodes (each node is a function that does one thing), connect them with edges (which determine the flow), and add conditional routing so the graph can branch based on the current state. In this lesson you will build your first `StateGraph`, define typed state with `TypedDict`, add nodes and edges, use conditional edges for branching, and learn how `Command` objects let a node directly control where execution goes next. By the end you will have a working clinical triage workflow that routes patient queries to different processing paths based on urgency.

---

## NotebookLM Summary

LangGraph is a library for building stateful, multi-step applications as directed graphs. Unlike a simple chain where data flows linearly from input to output, a LangGraph workflow can branch, loop, and converge based on runtime conditions. The core abstraction is `StateGraph`, which you import from `langgraph.graph`. You initialize it with a state schema -- a `TypedDict` that defines every piece of data your workflow tracks. For example, a clinical triage workflow might track `patient_query`, `urgency_level`, `department`, and `response` as string fields, plus a `messages` field using LangGraph's `add_messages` annotation for accumulating conversation history.

Nodes are Python functions that receive the current state and return a partial state update (a dictionary with only the fields that changed). You add them to the graph with `graph.add_node("node_name", function)`. For instance, a `classify_urgency` node might call a language model to determine whether a patient query is routine, urgent, or emergency, and return `{"urgency_level": "urgent"}`. A `route_department` node might read the urgency level and assign the appropriate department. Each node focuses on a single responsibility, making the workflow modular and testable.

Edges define how execution flows between nodes. A simple edge (`graph.add_edge("node_a", "node_b")`) creates unconditional flow. Conditional edges (`graph.add_conditional_edges("node_a", routing_function, {"path_1": "node_b", "path_2": "node_c"})`) let you branch based on state. The routing function receives the current state and returns a string key that maps to the next node. This is how you implement clinical decision logic: after classifying urgency, a conditional edge routes emergency cases directly to an escalation node while routine cases proceed to a standard response node.

LangGraph also provides `Command` objects as an alternative to conditional edges. When a node returns a `Command(goto="next_node", update={"field": "value"})`, it simultaneously updates the state and tells the graph where to go next. This is particularly useful when the routing decision and the state update happen in the same function, keeping the logic self-contained rather than split between a node and a separate routing function.

Every graph must define an entry point with `graph.set_entry_point("first_node")` or by using the `START` constant, and at least one path must reach the `END` constant to terminate execution. After defining all nodes and edges, you compile the graph with `graph.compile()`, which validates the structure and returns a runnable object. You invoke it with `.invoke({"patient_query": "I have severe chest pain after my last chemo session"})`, and LangGraph executes each node in order, following edges and conditional branches, until it reaches `END`. The returned value is the final state dictionary containing all accumulated updates -- the urgency classification, routed department, and generated response.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** LangGraph introduction tutorial -- focus on the graph concepts section: <https://langchain-ai.github.io/langgraph/tutorials/introduction/>
- **Skim:** The `StateGraph` reference documentation: <https://langchain-ai.github.io/langgraph/reference/graphs/>
- **Warm-up question:** Think about a clinical decision pathway at KHCC -- for example, how a new patient referral gets triaged. Draw a simple flowchart (on paper or in your head) with three or four steps and at least one decision branch. Which steps would become nodes, and where would you need a conditional edge?

### During Class -- What to Focus On

1. **State as a `TypedDict`** -- understand that the state schema defines every field your workflow uses, and that nodes read from and write to this shared state.
2. **Nodes as focused functions** -- each node receives the full state, does one thing, and returns only the fields it changed. It does not need to return the entire state.
3. **Conditional edges vs `Command`** -- know the two ways to implement branching. Conditional edges use a separate routing function; `Command` combines routing and state update in the node itself.
4. **`START` and `END` constants** -- every graph needs an entry point and at least one termination path.

**Common traps:**

- Forgetting to compile the graph with `.compile()` before invoking it -- you will get an error that the object is not callable.
- Returning the full state from a node instead of just the changed fields, which can accidentally overwrite updates made by previous nodes.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Define a `TypedDict` called `TriageState` with fields: `patient_query` (str), `urgency` (str), `department` (str), `response` (str), and `messages` (annotated with `add_messages`).
2. Write a `classify_urgency` node function that uses `ChatOpenAI` to classify the patient query as "routine", "urgent", or "emergency". The function should return `{"urgency": classification}`.
3. Write a `route_department` node that maps urgency levels to departments: routine goes to "general_oncology", urgent goes to "oncology_on_call", emergency goes to "emergency_department".
4. Write a conditional edge after `classify_urgency` that routes emergency cases to an `escalate` node and all other cases to `route_department`. Use a routing function that inspects `state["urgency"]`.
5. Compile and invoke the graph with three different patient queries (one routine, one urgent, one emergency) and verify that each follows the correct path through the workflow.

**Extra practice (optional):**

- Refactor the conditional edge to use `Command` instead: have the `classify_urgency` node return a `Command` object that sets the urgency and directly specifies the next node.
- Add a `generate_response` node at the end that uses the department and urgency to craft an appropriate response message, then connect it to `END`.

**Self-check questions:**

1. What is the difference between a regular edge and a conditional edge in a `StateGraph`?
2. Why should a node function return only the fields it changed rather than the entire state dictionary?
3. How does a `Command` object combine state updates and routing in a single return value?

### Resources

| Resource | Link |
|----------|------|
| LangGraph Introduction Tutorial | <https://langchain-ai.github.io/langgraph/tutorials/introduction/> |
| LangGraph StateGraph Reference | <https://langchain-ai.github.io/langgraph/reference/graphs/> |
| LangGraph Conditional Edges Guide | <https://langchain-ai.github.io/langgraph/how-tos/branching/> |
| LangGraph Command Reference | <https://langchain-ai.github.io/langgraph/reference/command/> |
| LangGraph Concepts -- State | <https://langchain-ai.github.io/langgraph/concepts/low_level/#state> |
| LangGraph Visualization | <https://langchain-ai.github.io/langgraph/how-tos/visualization/> |
