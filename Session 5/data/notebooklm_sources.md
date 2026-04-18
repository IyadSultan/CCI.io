# Session 5 NotebookLM Sources — Ready to Paste

Instructions: Create 6 notebooks in NotebookLM (notebooklm.google.com), then paste each source text below.

---

## Notebook 1: CCI Session 5 - Lesson 1: LangChain v1 Foundations

LangChain is an application framework for building LLM-powered systems with reusable building blocks: models, messages, tools, agents, memory, middleware, and streaming. LangGraph is the lower-level orchestration runtime for stateful, long-running, controllable agent workflows modeled as graphs of state, nodes, and edges. They are complementary: LangChain provides the high-level agent API via create_agent, while LangGraph gives fine-grained control over transitions and state. The Runnable interface standardizes how components (prompts, models, retrievers) are invoked, batched, and streamed. Composition with the pipe operator makes chains readable as dataflows. In Session 3, students built tool calling and memory manually with the raw OpenAI API. LangChain abstracts that plumbing: the same clinical assistant that took 50 lines of manual code becomes 5 lines with create_agent. Use LangChain alone for standard tool-calling assistants and straightforward chatbots. Drop to LangGraph when you need branching workflows, human approvals, checkpointing, or recovery from failures.

---

## Notebook 2: CCI Session 5 - Lesson 2: Tools and the Agent Loop

Tools in LangChain are callable functions with defined input schemas that agents use to interact with external systems. The @tool decorator turns any Python function into an agent tool with automatic schema generation from type hints and docstrings. Well-designed tools have narrow purpose, clear names, precise parameters, and predictable outputs. The agent loop cycles through: read messages, decide next action, call a tool if needed, incorporate the result, repeat until a final answer or stop condition. Stop conditions include the model returning a final response, reaching max iterations, hitting a middleware guardrail, or requiring human approval. Tool errors should be first-class events with structured signals, not hidden exceptions. Middleware sits between the agent API and underlying actions for logging, guardrails, rate limits, and PII detection. Clinical tools at KHCC include lookup_patient for retrieving patient records, check_vitals for reference range checking, and check_drug_interaction for medication safety. Defense in depth means guardrails at multiple layers: prompt, middleware, tool validation, and business code.

---

## Notebook 3: CCI Session 5 - Lesson 3: LangGraph Stateful Workflows

LangGraph applications have three core pieces: state (shared data snapshot), nodes (functions that do work and return updates), and edges (determine what runs next). StateGraph defines workflows that evolve shared state over time using TypedDict schemas. Nodes should do the work while edges decide routing. Conditional routing means the next node depends on current state rather than being fixed, enabling controlled flexibility. Command combines state updates with routing instructions in a single return value. A clinical triage workflow demonstrates this: an intake node collects symptoms, a classify node uses an LLM to determine severity (low/medium/high), conditional edges route to appropriate handler nodes (self-care advice, appointment scheduling, or emergency alert). The graph makes the workflow explicit and inspectable rather than buried in nested function calls. This is especially valuable in clinical settings where decision paths must be auditable and regulatory-compliant.

---

## Notebook 4: CCI Session 5 - Lesson 4: Memory and Persistence

LLMs are stateless but clinical assistants need continuity. Short-term memory is thread-scoped: information within a single conversation maintained via checkpointers like MemorySaver. Threads organize multiple interactions within the same execution history, isolating one patient conversation from another. Checkpointing saves state snapshots at each step, enabling resume after interruption, conversation persistence, and debugging via time travel. Long-term memory persists across sessions using LangGraph stores that save JSON documents by namespace and key, separate from thread state. Long-term memory enables personalization: remembering patient language preferences, known allergies, or recurring concerns. Context trimming matters when message history grows large enough to hurt latency and quality. The trim_messages utility keeps recent turns raw while summarizing older ones. Compared to Session 3 where students manually maintained a messages list and counted tokens with tiktoken, LangGraph handles this automatically through checkpointers and provides thread isolation, resumability, and persistence for free.

---

## Notebook 5: CCI Session 5 - Lesson 5: Multi-Agent Patterns and Human-in-the-Loop

Real clinical AI systems use teams of specialized agents. The orchestrator-worker pattern has one coordinator dispatching to specialists: a triage agent routes to oncology, general medicine, or palliative care agents based on case classification. The supervisor pattern has a manager agent reviewing and directing worker outputs. Shared state passes information between agents while private state keeps specialist reasoning contained. The interrupt() function pauses graph execution for human approval, critical for medication changes, treatment modifications, or any irreversible clinical action. After human review, Command(resume=value) continues execution with the approval decision. Preventing agent ping-pong requires iteration limits and clear termination conditions. Safety guardrails include logging all tool calls for audit, requiring human approval for medication changes, and separating read-only tools from action-taking tools. This multi-agent pattern mirrors KHCC tumor board workflows where multiple specialists review cases and a senior oncologist provides final approval.

---

## Notebook 6: CCI Session 5 - LangChain/LangGraph Review

Session 5 taught the LangChain/LangGraph ecosystem for building clinical AI agents. Lesson 1 introduced LangChain v1 foundations: create_agent, Runnables, composition, and comparison with raw OpenAI API from Session 3. Lesson 2 covered tools with the @tool decorator, the agent loop cycle, error handling, middleware, and clinical tool design. Lesson 3 built LangGraph stateful workflows with StateGraph, conditional routing, and a clinical triage system. Lesson 4 added memory and persistence: thread-scoped short-term memory via checkpointers, long-term memory via stores, context trimming, and resumability after disconnection. Lesson 5 combined everything into multi-agent patterns with orchestrator-worker architecture, specialist handoffs, and human-in-the-loop approvals using interrupt(). The progression moved from using frameworks to orchestrating complex clinical workflows with safety guardrails. Key insight: LangChain simplifies what Session 3 built manually, while LangGraph adds capabilities (persistence, human approval, recovery) that would be extremely difficult to build from scratch.
