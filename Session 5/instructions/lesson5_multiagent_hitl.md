# CCI Session 5 -- Lesson 5: Multi-Agent Patterns & Human-in-the-Loop

**Estimated time:** 25 minutes (13 min content / 12 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

Everything you have built so far in this session has been a single agent doing one job. But clinical reality at KHCC is more complex -- diagnosing a patient might require one agent to review lab results, another to check imaging reports, another to search treatment guidelines, and a human oncologist to approve the final recommendation before it reaches the patient. This is the world of multi-agent systems and human-in-the-loop workflows. In this final lesson you will learn two major multi-agent patterns -- orchestrator-worker and supervisor -- and how to implement them in LangGraph using `create_agent` and `StateGraph`. More importantly, you will learn how `interrupt()` lets you pause a graph mid-execution to request human approval before continuing. This is not optional for clinical AI: any system that recommends treatment changes, flags adverse events, or communicates with patients must have a human checkpoint. By the end of this lesson you will have a multi-agent clinical system where specialized agents collaborate and a human oncologist approves critical decisions before they are finalized.

---

## NotebookLM Summary

Multi-agent systems in LangGraph follow two primary architectural patterns. In the orchestrator-worker pattern, a central orchestrator agent receives a task, breaks it into subtasks, delegates each subtask to a specialized worker agent, collects the results, and synthesizes a final response. The orchestrator is typically a language model with instructions to plan and coordinate, while workers are focused agents with specific tools. For example, at KHCC a clinical review orchestrator might delegate lab analysis to a lab-specialist agent, imaging review to a radiology agent, and guideline lookup to a literature agent, then combine their findings into a comprehensive clinical summary.

The supervisor pattern is a variation where a supervisor agent dynamically routes tasks to workers in a loop. Unlike the orchestrator, which plans all subtasks upfront, the supervisor evaluates each worker's output and decides whether to route to another worker or conclude. In LangGraph, you implement this as a `StateGraph` where the supervisor is a node that calls a language model to decide the next step, and each worker is a separate node (often a `create_agent` subgraph). Conditional edges from the supervisor node route to the appropriate worker based on the model's decision, and an edge from each worker returns control to the supervisor for the next routing decision.

The human-in-the-loop pattern is implemented through LangGraph's `interrupt()` function. When a node calls `interrupt(value)`, the graph execution pauses immediately, saves its current state to the checkpointer, and returns the interrupt value to the caller. The calling application can then display this value to a human reviewer -- for instance, showing a proposed treatment recommendation to an oncologist. The human reviews the information, makes a decision (approve, modify, or reject), and the application resumes the graph by calling `.invoke(Command(resume=human_decision), config)` with the same thread ID. The graph picks up exactly where it paused, with the human's decision available in the node that originally called `interrupt()`. This mechanism requires a checkpointer because the graph state must be persisted between the pause and resumption.

Combining multi-agent patterns with human-in-the-loop creates robust clinical workflows. Consider a treatment recommendation system: a lab agent analyzes recent bloodwork, a guidelines agent searches NCCN protocols, and a dosing agent calculates the recommended regimen. Before the final recommendation reaches the patient record, the graph hits an `interrupt()` node that presents the full recommendation to the attending oncologist. The oncologist can approve the recommendation as-is, modify the dosage, or reject it entirely and provide alternative instructions. Only after approval does the workflow proceed to its final node, which formats and delivers the recommendation. This pattern ensures that AI-generated clinical content always passes through human expert review, maintaining the safety standards that KHCC requires for patient care.

Building multi-agent graphs in LangGraph follows the same patterns you learned in Lesson 3, scaled up. Each agent becomes a node or a subgraph within a larger `StateGraph`. Communication between agents happens through the shared state -- one agent writes its findings to a state field, and the next agent reads from it. The graph's edges and conditional routing determine which agents run, in what order, and under what conditions, giving you full control over the clinical workflow.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** LangGraph multi-agent concepts guide: <https://langchain-ai.github.io/langgraph/concepts/multi_agent/>
- **Skim:** The LangGraph human-in-the-loop documentation: <https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/>
- **Warm-up question:** At KHCC, a new chemotherapy order goes through several steps: pharmacist reviews the dose, nurse confirms the patient's allergies, and the attending physician signs off. Map this to a multi-agent workflow: who are the agents, where would you place a human approval step, and what happens if the physician rejects the order?

### During Class -- What to Focus On

1. **Orchestrator-worker vs supervisor patterns** -- understand the key difference: the orchestrator plans all subtasks upfront, while the supervisor dynamically decides the next worker after each step.
2. **`interrupt()` for human-in-the-loop** -- know that `interrupt()` pauses the graph, saves state, and returns a value for human review. Resuming with `Command(resume=...)` continues execution from the pause point.
3. **Why a checkpointer is required for `interrupt()`** -- the graph state must be persisted during the pause because the human review may happen minutes or hours later.
4. **Shared state as inter-agent communication** -- agents in a multi-agent graph communicate by reading from and writing to fields in the shared `TypedDict` state.

**Common traps:**

- Trying to use `interrupt()` without a checkpointer configured -- the graph cannot save its state and the interrupt will fail.
- Building overly complex multi-agent systems when a single agent with good tools would suffice. Start simple and add agents only when distinct expertise or approval steps are needed.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Define a `TypedDict` state for a clinical review workflow with fields: `patient_query`, `lab_summary`, `guideline_summary`, `recommendation`, `approval_status`, and `messages`.
2. Create two specialized worker agents using `create_agent`: a `lab_analyst` agent with a tool that returns mock lab results, and a `guideline_checker` agent with a tool that returns mock NCCN treatment guidelines.
3. Build a `StateGraph` with a supervisor node that routes to `lab_analyst` or `guideline_checker` based on what information is still missing, then routes to a `recommend` node once both summaries are available.
4. Add a human-in-the-loop node after `recommend` that calls `interrupt()` with the proposed recommendation. Print the recommendation, simulate physician approval by resuming with `Command(resume="approved")`, and observe the graph completing.
5. Test the rejection path: resume with `Command(resume="rejected: reduce cisplatin dose by 25%")` and verify that the graph routes back to the recommendation node with the physician's feedback.

**Extra practice (optional):**

- Refactor the supervisor pattern into an orchestrator-worker pattern where the orchestrator calls both workers in parallel (using `send()`) and synthesizes their outputs.
- Add a third worker agent -- a `drug_interaction_checker` -- and update the supervisor logic to include it in the workflow when the patient is on multiple medications.

**Self-check questions:**

1. What is the key architectural difference between the orchestrator-worker and supervisor multi-agent patterns?
2. What happens to the graph's state when `interrupt()` is called, and how does the application resume execution?
3. Why is human-in-the-loop not optional for clinical AI systems at KHCC, even when the AI's accuracy is high?

### Resources

| Resource | Link |
|----------|------|
| LangGraph Multi-Agent Concepts | <https://langchain-ai.github.io/langgraph/concepts/multi_agent/> |
| LangGraph Human-in-the-Loop Guide | <https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/> |
| LangGraph interrupt() Reference | <https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/wait-user-input/> |
| LangGraph Supervisor Pattern | <https://langchain-ai.github.io/langgraph/tutorials/multi_agent/agent_supervisor/> |
| LangGraph Command Reference | <https://langchain-ai.github.io/langgraph/reference/command/> |
| LangGraph Prebuilt Agents | <https://langchain-ai.github.io/langgraph/reference/prebuilt/> |
