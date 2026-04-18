---
layout: page
title: "Lesson 6: Wrap-Up — Review & Consolidation"
permalink: /session-05/lesson-6-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-05/">&#8249; Back to Session 5</a>

# CCI Session 5 — Lesson 6: Wrap-Up — Review & Consolidation
**Estimated time:** 15 minutes
**Lab mode:** Review (NotebookLM + Colab recap)

---

## Session review

| Lesson | Topic | Core ideas | Clinical tie-in |
|--------|-------|------------|-----------------|
| 1 | LangChain v1 Foundations | `create_agent`, Runnables, `ChatOpenAI`, prompt templates | Replace the Session 3 manual tool loop with a framework |
| 2 | Tools & the Agent Loop | `@tool` decorator, schema from docstrings, error handling, middleware | Clinical tools (drug lookup, lab ranges, patient data) with graceful failure |
| 3 | LangGraph Stateful Workflows | `StateGraph`, `TypedDict`, nodes, conditional edges, `Command` | Auditable triage pathways with explicit branching |
| 4 | Memory & Persistence | Threads, checkpointers, `trim_messages`, long-term `Store` | Continuity of care across patient encounters |
| 5 | Multi-Agent & Human-in-the-Loop | Orchestrator–worker, supervisor, `interrupt()`, `Command(resume=...)` | Tumor-board style specialist handoffs with physician sign-off |

**Connecting the dots:** You moved from *writing* the tool-call loop by hand (Session 3) to *orchestrating* full clinical workflows with persistence, approvals, and multi-agent collaboration — the jump from script to system.

---

## Common mistakes

1. Importing from deprecated paths (`langchain.chat_models`) instead of integration packages (`langchain_openai`).
2. Writing a vague `@tool` docstring — the model cannot decide when to call it and either overuses or ignores it.
3. Forgetting to `.compile()` the `StateGraph` before calling `.invoke()`.
4. Using `MemorySaver` in production and losing state on restart — use `SqliteSaver` / `PostgresSaver`.
5. Calling `interrupt()` without a checkpointer configured — the graph has nowhere to save its paused state.
6. Building a multi-agent system when a single well-tooled agent would do. Start simple.

---

## NotebookLM review

Use your **Session 5 NotebookLM** (linked from the Session 5 main page) with sources such as this curriculum, the LangChain/LangGraph docs, and your Colab notebooks. Try *Audio Overview* and self-quiz in the chat about when to reach for `create_agent` vs a full `StateGraph`.

---

## Reference infographic — KHCC Hospital Multi-Agent Architecture

Below is a reference architecture that stitches together everything from Lessons 1–5 into a single clinical system. Use it as a mental model for the session assignment, and as a **prompt asset** for an LLM when you want to scaffold code quickly.

<a href="{{ site.baseurl }}/session_5/assets/khcc_hospital_multiagent_langgraph.svg" target="_blank" rel="noopener noreferrer">
  <img src="{{ site.baseurl }}/session_5/assets/khcc_hospital_multiagent_langgraph.svg" alt="KHCC Hospital Administration — LangGraph Multi-Agent System" style="width:100%;max-width:1100px;border:1px solid #E0E0E0;border-radius:0.5rem;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin:0.5rem 0 1rem;background:#FAFAFA"/>
</a>

**What the diagram shows**

- **Shared state (`TypedDict`)** — the single schema every node reads/writes: `patient_id`, `chief_complaint`, `urgency`, `lab_summary`, `imaging_summary`, `medication_list`, `recommendation`, `approval_status`, and a `messages` channel.
- **Intake Agent** — pulls the patient record from the EHR via `get_patient_record(patient_id)`.
- **Triage Supervisor Agent** — calls `ChatOpenAI(gpt-4o)` to classify urgency (`emergency` / `urgent` / `routine`) and routes via conditional edges.
- **Specialist lanes (parallel):** Lab Analyst, Radiology, Pharmacy — each built with `create_agent` and given narrow, well-typed `@tool` functions.
- **Supporting agents:** Medical Records, Scheduling, Billing / Insurance — invoked on demand by the supervisor.
- **Recommendation Synthesizer** — merges all specialist summaries into a single draft recommendation.
- **Human-in-the-Loop (`interrupt()`)** — attending physician review. Resumes with `Command(resume="approved" | "rejected: ...")`.
- **Action Executor Agent** — only fires after approval; calls `write_to_EHR()`, `send_prescription()`, `notify_nurse()`.
- **Persistence & memory:** `SqliteSaver` keyed by `thread_id` (one thread per patient), a long-term `Store` for allergies / preferences, and `trim_messages` to keep context bounded.

---

## Copy-paste prompt — generate the LangGraph code from the diagram

Paste the infographic **plus** the prompt below into an LLM (Claude, GPT-4o, Cursor agent, etc.) to get a working scaffold. Then refine with the tools and data you actually have at KHCC.

```text
You are a senior Python engineer. Using the attached architecture diagram as
ground truth, generate a runnable LangGraph multi-agent clinical workflow.

Requirements
1. Python 3.10+. Use: langchain, langchain-openai, langgraph,
   langgraph.checkpoint.sqlite, typing_extensions.
2. Define a TypedDict `ClinicalState` with exactly the fields shown in the
   "SHARED STATE" panel. Use Annotated[list, add_messages] for `messages`.
3. Implement tool functions with @tool and typed parameters + docstrings:
   - get_patient_record(patient_id)
   - fetch_labs(patient_id), check_reference_ranges(test, value)
   - fetch_imaging_report(patient_id), summarize_findings(text)
   - check_drug_interaction(drug_a, drug_b), get_formulary_dose(drug, weight_kg)
   - get_allergies(patient_id), get_history(patient_id)
   - book_appointment(...), find_OR_slot(...)
   - verify_coverage(patient_id), code_ICD10(diagnosis)
   - write_to_EHR(patient_id, note), send_prescription(rx), notify_nurse(msg)
   Each tool returns deterministic mock data for the lab (no real PHI).
4. Build specialist agents with create_agent(ChatOpenAI(model="gpt-4o"), tools=...):
   intake_agent, lab_analyst, radiology_agent, pharmacy_agent,
   medical_records_agent, scheduling_agent, billing_agent, action_executor.
5. Build the StateGraph:
   START -> intake -> triage_supervisor
   triage_supervisor has a conditional edge routing by state["urgency"]:
     "emergency" -> [lab_analyst, radiology_agent] in parallel
     "urgent"    -> [lab_analyst, pharmacy_agent]
     "routine"   -> [medical_records_agent, scheduling_agent]
   All specialist paths converge into recommendation_synthesizer.
   Then a human_review node calls interrupt({"recommendation": state["recommendation"]}).
   After resume, conditional edge by state["approval_status"]:
     "approved" -> action_executor -> END
     "rejected" -> back to recommendation_synthesizer with feedback in messages.
6. Persistence: compile with SqliteSaver("khcc.db"). Use thread_id = patient_id.
7. Apply trim_messages inside nodes that call the model: keep the system message
   plus the most recent 10 turns, max ~4000 tokens.
8. Provide a demo `if __name__ == "__main__":` that:
   (a) runs the graph for patient "P-001" with chief_complaint "severe chest pain
       after cisplatin cycle 2", prints each state transition,
   (b) hits the interrupt, prints the proposed recommendation,
   (c) resumes with Command(resume={"approval_status": "approved"}),
   (d) shows the final state with the EHR write confirmation.
9. Add clear comments mapping each block to the matching box in the diagram.
10. Print a Mermaid diagram of the compiled graph using `graph.get_graph().draw_mermaid()`.

Return a single self-contained .py file.
```

**Tip:** after the model generates the code, ask it in a follow-up: *"Now refactor `lab_analyst` and `radiology_agent` to run in parallel using `Send()` and show the speedup."* That turns the lesson-5 pattern into a real optimization.

---

## Bonus — LangChain / LangGraph Claude Skill

We packaged all of Session 5's LangChain + LangGraph knowledge into a reusable **Claude Skill**. Once uploaded to your Claude workspace, Claude will automatically invoke it whenever you ask it to build, debug, or explain a LangChain / LangGraph project — giving you much better code than a cold prompt.

<div style="background:#FFF8E1;border:1px solid #FFE082;border-radius:0.6rem;padding:1rem 1.25rem;margin:1rem 0;">
  <p style="margin:0 0 0.75rem;font-weight:700;color:#F57F17;">&#11088; Get the skill</p>
  <a href="{{ site.baseurl }}/session_5/assets/langchain_graph_skill.zip" download style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.55rem 1rem;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;border-radius:0.45rem;transition:all .15s;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
    &#11015; Download langchain_graph_skill.zip
  </a>
</div>

**How to install it in Claude (one-time setup):**

1. Click **Download** above to save `langchain_graph_skill.zip` to your computer — **do not unzip it**.
2. Open **[claude.ai](https://claude.ai)** and sign in.
3. Go to **Settings → Capabilities → Skills** (on some plans this lives under **Settings → Features → Skills**).
4. Click **Upload skill** (or **Add skill**) and select the `.zip` file you just downloaded.
5. Confirm the skill appears in your list and is toggled **On**.
6. Start a new chat and ask something like *"Using my LangGraph skill, build a two-agent supervisor pattern with an `interrupt()` for physician sign-off."* Claude will auto-load the skill and follow its conventions.

> **Note:** Skill uploads are a Pro / Team / Enterprise feature. If your plan does not show the *Skills* tab, you can still use the skill contents manually by unzipping the file and pasting the most relevant reference doc into the chat.

**What is inside the skill?** Structured reference docs covering `create_agent`, `@tool`, `StateGraph`, `MemorySaver` / `SqliteSaver`, `interrupt()` / `Command(resume=...)`, multi-agent supervisor/orchestrator patterns, and common pitfalls — the exact material we taught in Lessons 1–5, formatted so Claude can consume it as ground truth.

---

## What is next

**Session 6** layers **Retrieval-Augmented Generation (RAG)** on top of the agents you built here: embeddings, vector stores, and clinical document retrieval so your agents can cite KHCC guidelines, NCCN protocols, and patient records instead of relying on the model's pretraining alone.

---

## Assignment reminder

**Session 5 assignment:** Build a multi-agent clinical workflow in LangGraph with at least one `interrupt()` human-approval step, and submit via your course instructions (e.g. CCI Academy) before Session 6.
