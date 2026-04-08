# CCI Session 3 — Lesson 3: Conversation Memory & Tool Calling
**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"So far our API calls have been one-shot — the model has no memory of previous questions. If you ask about a patient's hemoglobin and then follow up with 'is that normal?', the model has no idea what 'that' refers to. But real clinical assistants need context. And they need to DO things — look up patient records, check lab ranges, query databases. Today we build both: conversation memory so the model remembers what was said, and tool calling so it can reach out and fetch real data."

---

## NotebookLM Summary

Large language models are fundamentally stateless. Every time you call the OpenAI API, the model starts fresh with no memory of any previous interaction. It does not remember the patient you just asked about, the lab result it just interpreted, or the recommendation it just made. Each request is completely independent. This is by design — the model processes only what you send it in a single request and returns a response. Understanding this is critical because clinical assistants that forget the conversation after every turn are not useful in practice.

The solution is to manage memory yourself by maintaining a messages list in your code. You start with a system message that sets the assistant's role (for example, "You are an oncology clinical assistant at KHCC"). When the user sends a message, you append it to the list with `role: "user"`. You send the entire list to the API. When the model responds, you append that response to the list with `role: "assistant"`. The next time the user speaks, you append again and send the full, growing list. The model sees the entire conversation history each time, giving it the context it needs to handle follow-up questions like "What about her WBC?" after discussing a specific patient.

This approach has a practical limit: the context window. Every model has a maximum number of tokens it can process in a single call — for GPT-4o, that is 128,000 tokens. As your conversation grows, you consume more of that window. When you approach the limit, you need strategies: truncate older messages (drop the earliest turns), summarize the conversation history into a condensed message and replace the old turns, or use a sliding window that keeps only the most recent N exchanges. In clinical workflows where discussions can span many patients and lab results, token budget management becomes essential. You can estimate token counts using the `tiktoken` library, which lets you measure exactly how many tokens a conversation consumes before sending it.

The second major capability is tool calling, which is the current OpenAI mechanism for letting the model invoke external functions. When you define a list of tools using JSON schema and pass them in the `tools` parameter of your API call, the model can decide during its response that it needs to call one of those functions. Instead of returning a normal text message, the model returns a response with `tool_calls` — a structured request specifying which function to call and what arguments to pass. Your code then executes that function locally, gathers the result, and sends it back to the model in a message with `role: "tool"`. The model uses that result to formulate its final answer to the user. This is not the deprecated `function_calling` parameter — the `tools` API is the current, supported approach.

Consider three clinical tools that a KHCC oncology assistant might use. First, `lookup_vitals(mrn)` takes a medical record number and returns the patient's most recent vital signs — heart rate, blood pressure, temperature, SpO2 — from the hospital system. Second, `check_abnormal_range(vital_type, value)` accepts a vital sign type and its value, then returns whether the value falls within normal, borderline, or critical range according to KHCC clinical protocols. Third, `get_patient_summary(mrn)` returns a narrative summary of the patient's recent data including active diagnoses, current chemotherapy regimen, and last three sets of lab results. Each tool is defined with a JSON schema that specifies the function name, a description, and the expected parameters with their types. The model reads these definitions and decides when a tool is appropriate for answering the user's question.

The model can also make parallel tool calls when it needs multiple pieces of information. If a physician asks "Show me the vitals and patient summary for MRN-40892," the model can issue both `lookup_vitals` and `get_patient_summary` in a single response, and your code executes both before sending the results back together.

The complete loop works as follows: the user asks a question, the model examines its available tools and decides whether one or more are needed, it returns `tool_calls` instead of a text response, your code validates the arguments and executes the function, you append the tool result to the messages list, you call the API again, and the model uses the tool output to compose its final natural-language answer. This creates a powerful pattern where the model reasons about what information it needs, requests it through a controlled interface, and synthesizes the result for the clinician.

Safety is paramount in this architecture. The model should never execute arbitrary code — it only requests function calls, and your code decides whether and how to execute them. Always validate tool inputs: check that MRN values match expected formats, confirm that vital_type is one of your supported types, and reject any unexpected arguments. Never pass raw model output directly to a database query without sanitization. You control the execution layer, and the model only participates in the reasoning layer.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the OpenAI tool calling documentation as a URL source, and use *Audio Overview* to generate a podcast-style review students can listen to before or after class.

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Read: [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling) — focus on the `tools` parameter and the message flow diagram
- Warm-up question: *A physician is chatting with a clinical AI assistant and asks: "What were this patient's last three hemoglobin results?" The AI has no database access. What would it need to answer this question, and how would the interaction flow between the AI and an external data source?*

### During Class — What to Focus On
- Make sure you understand that the messages list IS the model's memory — nothing is remembered automatically
- Make sure you understand the tool definition schema: `name`, `description`, `parameters` with JSON types
- Make sure you can trace the full tool calling loop: user message, model returns `tool_calls`, you execute, you send `role: "tool"` result, model gives final answer
- Pay attention to how `finish_reason` changes — `"stop"` means a normal response, `"tool_calls"` means the model wants to call a function
- Common trap: Forgetting to append the assistant's response (including tool_calls) back to the messages list before sending tool results
- Common trap: Not handling the case where the model returns `tool_calls` — if you only check for `message.content`, you will miss tool call responses
- Common trap: Sending tool results without the matching `tool_call_id` — each tool result must reference the specific call it answers

### After Class — Practice & Lab Work
- **Lab work (required):** Complete the Colab notebook from today's session. Build a multi-turn conversation with memory and implement at least two clinical tools with the full calling loop. Estimated time: 13 min.
- **Extra practice:** Add a third tool, `get_medication_list(mrn)`, that returns a list of current medications. Test a conversation where the model calls multiple tools in sequence to answer a complex question like "Is this patient on any drugs that could explain their low WBC?"
- **Self-check:**
  1. What happens if you send a new user message to the API without including the previous messages? Why?
  2. What is the difference between the `tools` parameter and the deprecated `functions` parameter?
  3. In the tool calling flow, what role do you use when sending the function's result back to the model?
  4. Why should you validate tool arguments before executing a function?

### Resources
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [OpenAI API Reference — Chat Completions](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Cookbook — How to call functions with chat models](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models)
- [tiktoken — Token counting library](https://github.com/openai/tiktoken)
- Session 3 NotebookLM review notebook (link provided after class)

---

## Lab Exercise

**Title:** Building a Clinical Assistant with Memory and Tool Calling
**Duration:** 13 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> You are building a prototype clinical AI assistant for the oncology department at KHCC. Physicians want to ask follow-up questions about patients without re-stating context, and they want the assistant to pull patient vitals and check whether values are abnormal — all through natural conversation.

### Objective
By the end of this lab, students will have a working Colab notebook that maintains multi-turn conversation memory and implements two clinical tools (`lookup_vitals` and `check_abnormal_range`) using the OpenAI tool calling API.

### Setup
```
1. Open Google Colab: https://colab.research.google.com
2. Create a new notebook: File -> New Notebook
3. Rename it: "Session3_Lab3_Memory_and_Tools.ipynb"
```

### Step-by-step instructions

1. **Cell 1 — Install and configure:**
   Install `openai` and set your API key. Import `openai` and `json`.

2. **Cell 2 — Simulated patient database:**
   Create a dictionary that maps MRNs to patient data. Include at least three patients with fields: name, age, diagnosis, heart_rate, blood_pressure_systolic, temperature, spo2, current_regimen. Use realistic KHCC oncology values (e.g., a breast cancer patient on AC-T, a lymphoma patient on R-CHOP).

3. **Cell 3 — Define tool functions:**
   Write two Python functions:
   - `lookup_vitals(mrn)` — looks up the patient in your dictionary and returns their vitals as a JSON string. Return an error message if MRN not found.
   - `check_abnormal_range(vital_type, value)` — compares the value against clinical ranges (e.g., heart rate normal 60–100, temperature normal 36.1–37.8, SpO2 normal 95–100) and returns "normal", "borderline", or "critical" with an explanation.

4. **Cell 4 — Define tool schemas:**
   Create the `tools` list with JSON schema definitions for both functions. Each tool needs `type: "function"`, a `function` object with `name`, `description`, and `parameters` (including parameter types and descriptions). Write descriptions that help the model know when to use each tool.

5. **Cell 5 — Conversation loop with memory:**
   Build the main conversation function:
   - Initialize a `messages` list with a system prompt: "You are a clinical assistant at King Hussein Cancer Center. You help oncologists review patient data."
   - Create a loop that takes user input, appends it to messages, calls the API with `tools=tools`.
   - Check if the response has `tool_calls`. If yes, execute the matching Python function, append the assistant message and tool results to the messages list, and call the API again.
   - If no tool calls, print the assistant's response and append it to messages.
   - Continue until the user types "exit".

6. **Cell 6 — Test the conversation:**
   Run a multi-turn test. First ask "Look up vitals for MRN-40892." Then follow up with "Is the heart rate normal?" (the model should remember which patient you are discussing). Then ask "What about the temperature?" Verify that the model maintains context across turns and calls tools as needed.

### Expected behavior
- The model should call `lookup_vitals` when asked about a patient's vitals
- The model should call `check_abnormal_range` when asked whether a value is normal
- Follow-up questions like "What about the temperature?" should work without re-specifying the patient, because the conversation history provides context
- The model should synthesize tool results into natural clinical language

### Stretch goal
Add a third tool, `get_patient_summary(mrn)`, and test a question that triggers parallel tool calls: "Give me the vitals and summary for MRN-40892."
