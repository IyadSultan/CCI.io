# CCI Session 5 -- Lesson 4: Memory & Persistence

**Estimated time:** 25 minutes (13 min content / 12 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

In Session 3 you implemented conversation memory the manual way: you kept a Python list of messages and appended every user input and assistant response before each API call. It worked for a single conversation in a single notebook, but it had no persistence -- close the notebook and the memory was gone. LangGraph solves this with built-in support for both short-term memory (within a conversation thread) and long-term memory (across threads and sessions). In this lesson you will learn how threads and checkpointers give your agents persistent short-term memory, how the `MemorySaver` checkpointer stores state so a conversation can be resumed later, how message trimming prevents your context window from overflowing, and how LangGraph stores provide long-term cross-thread memory for facts that should persist across conversations. By the end you will have an oncology assistant at KHCC that remembers what a patient discussed last visit and carries forward essential clinical context without exceeding token limits.

---

## NotebookLM Summary

Memory in LangGraph divides into two categories: short-term (within a conversation thread) and long-term (across threads). Short-term memory is managed automatically through the graph's state and a checkpointer. Every time you invoke a compiled graph with a `config` containing a `thread_id`, LangGraph loads the previous state for that thread (if it exists), runs the graph, and saves the updated state back through the checkpointer. The simplest checkpointer is `MemorySaver` from `langgraph.checkpoint.memory`, which stores state in Python dictionaries in-memory. For production use, LangGraph provides `SqliteSaver` and `PostgresSaver` that persist state to databases, meaning your conversations survive process restarts.

The thread concept maps naturally to clinical workflows. Each patient encounter can be a separate thread, identified by a patient ID or visit number. When the oncologist reopens a conversation thread from a previous visit, the agent automatically has access to the full conversation history -- previous questions, tool results, and assistant responses. You pass the thread identifier in the config dictionary: `graph.invoke({"messages": [new_message]}, config={"configurable": {"thread_id": "patient-12345-visit-3"}})`. The checkpointer handles loading and saving transparently.

As conversations grow, the message history can exceed the model's context window. LangGraph addresses this with message trimming strategies. The `trim_messages` utility from `langchain_core.messages` lets you specify a maximum token count and a trimming strategy. You can keep the most recent messages (discarding old ones), always retain the system message, or implement custom logic that preserves clinically important messages (such as the initial diagnosis) while trimming routine exchanges. Trimming is typically applied inside a node function before calling the language model, ensuring the messages list stays within bounds while preserving the most relevant clinical context.

Long-term memory goes beyond a single conversation thread. LangGraph provides a `Store` interface that lets you save and retrieve arbitrary key-value data across threads. For example, after an agent learns that a patient is allergic to platinum-based agents, it can write this fact to the store under the patient's ID. In a future conversation thread -- even weeks later -- any agent can read from the store and incorporate that allergy information without the patient repeating it. The store uses namespaces to organize memories (for example, by patient ID or by memory type such as "allergies" or "preferences"), and each memory item can have metadata for filtering and search.

Compared to Session 3, where you manually managed a messages list and lost everything when the notebook closed, LangGraph's memory system offers three key improvements. First, persistence: checkpointers save state automatically, so conversations survive restarts. Second, scalability: trimming strategies prevent unbounded context growth that would eventually exceed the model's token limit or inflate costs. Third, cross-thread knowledge: the store system lets clinically important facts follow a patient across encounters rather than being trapped in a single conversation. These capabilities are essential for building reliable clinical assistants that maintain continuity of care.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** LangGraph persistence and memory conceptual guide: <https://langchain-ai.github.io/langgraph/concepts/persistence/>
- **Skim:** The `MemorySaver` and checkpointer documentation: <https://langchain-ai.github.io/langgraph/reference/checkpoints/>
- **Warm-up question:** Think about a patient who visits KHCC for six chemotherapy cycles over three months. What information should an AI assistant remember between visits? What information is safe to forget? Write down three things to keep and two things that can be trimmed.

### During Class -- What to Focus On

1. **Thread IDs and the `config` dictionary** -- understand that the `thread_id` in `config["configurable"]` is how LangGraph knows which conversation to load and save.
2. **Checkpointers** -- know that `MemorySaver` is for prototyping (in-memory, not persistent across restarts) and `SqliteSaver`/`PostgresSaver` are for production persistence.
3. **Message trimming** -- learn how `trim_messages` prevents context overflow by removing old messages while keeping the system prompt and recent exchanges.
4. **Stores for long-term memory** -- understand how the `Store` interface lets you save facts (like allergies or treatment history) that persist across separate conversation threads.

**Common traps:**

- Using `MemorySaver` and expecting data to survive a notebook restart -- it only persists in the Python process's memory. Use `SqliteSaver` for persistence across restarts.
- Trimming messages too aggressively and losing the system prompt, which causes the model to forget its clinical persona and instructions.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Create an agent using `create_agent` with `ChatOpenAI` and compile it with a `MemorySaver` checkpointer.
2. Invoke the agent twice with the same `thread_id`, sending different messages each time. Verify that the second invocation has access to the first conversation's history by asking "What did I just ask you?"
3. Invoke the agent with a different `thread_id` and confirm that it has no memory of the first thread's conversation, demonstrating thread isolation.
4. Implement message trimming using `trim_messages` with a token limit of 2000 tokens. Send a long series of messages to a single thread and verify that older messages are removed while the system message and recent exchanges are preserved.
5. Compare this experience with your Session 3 approach: note how many lines of code you needed there for manual memory management versus how many you need now.

**Extra practice (optional):**

- Replace `MemorySaver` with `SqliteSaver` backed by a local SQLite file. Restart the notebook kernel and verify that the conversation history persists.
- Implement a custom trimming strategy that always preserves any message containing the word "allergy" or "allergic", regardless of age, to ensure critical safety information is never trimmed.

**Self-check questions:**

1. What is the difference between short-term memory (threads with checkpointers) and long-term memory (stores) in LangGraph?
2. Why is `MemorySaver` unsuitable for production clinical applications, and what should you use instead?
3. How does message trimming protect both your token budget and the quality of the model's responses?

### Resources

| Resource | Link |
|----------|------|
| LangGraph Persistence Concepts | <https://langchain-ai.github.io/langgraph/concepts/persistence/> |
| LangGraph Memory Guide | <https://langchain-ai.github.io/langgraph/concepts/memory/> |
| LangGraph Checkpointer Reference | <https://langchain-ai.github.io/langgraph/reference/checkpoints/> |
| LangChain trim_messages Utility | <https://python.langchain.com/docs/how_to/trim_messages/> |
| LangGraph Store for Long-Term Memory | <https://langchain-ai.github.io/langgraph/concepts/memory/#long-term-memory> |
| LangGraph How-To: Add Memory to Agents | <https://langchain-ai.github.io/langgraph/how-tos/memory/manage-conversation-history/> |
