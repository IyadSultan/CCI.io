# CCI Session 5: LangChain / LangGraph, Tools & Agents
## Curriculum — 5 Lessons + Wrap-Up

**Audience:** Completed Sessions 1-4. Students can make OpenAI API calls with tool calling and memory, extract structured data with Pydantic, build text-to-SQL pipelines, and fine-tune HuggingFace models. This is their first time using LangChain/LangGraph frameworks.
**Clinical Anchor:** Multi-domain — clinical triage routing, drug interaction checking, multi-agent specialist handoff with human approval
**Session Duration:** 2.5 hours
**Lab Mode:** Guided step-by-step (Google Colab)
**Content/Practice Split:** 50/50
**Environment:** Google Colab notebooks (no local installation required)

---

## LESSON 1 OF 6: LangChain v1 Foundations

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"In Session 3 you built tool calling and memory from scratch with the OpenAI API. It worked — but it was a lot of manual plumbing. You manually appended messages to a list. You wrote the tool execution loop yourself. You handled JSON schemas by hand. LangChain is the framework that handles that plumbing for you. And LangGraph adds stateful workflows with persistence, human approvals, and recovery. Today we learn both — and by the end of the session, you'll have a multi-agent clinical system with human-in-the-loop approval that would have taken hundreds of lines of raw API code."

---

### NotebookLM Summary

LangChain is an application framework for building systems powered by large language models. If the OpenAI API is the engine, LangChain is the car — it provides the chassis, steering, and brakes so you can focus on where you want to go rather than how the engine works. LangGraph is the complementary orchestration runtime for building stateful, multi-step workflows. Think of LangGraph as the GPS and traffic routing system — it determines which roads to take, when to reroute, and when to stop for human approval.

The two frameworks are complementary and designed to work together. LangChain provides the building blocks — model wrappers, tool definitions, prompt templates, and output parsers. LangGraph provides the execution engine — state management, conditional routing, persistence, and human-in-the-loop patterns. You start with LangChain for simple agent tasks and graduate to LangGraph when you need explicit workflow control.

The standard entry point in modern LangChain is `create_agent` from `langgraph.prebuilt`. This single function replaces hundreds of lines of boilerplate you wrote in Session 3. You pass it a model (like `ChatOpenAI(model="gpt-4o")`), a list of tools, and optional instructions — and it returns a fully functional agent with automatic tool calling, message management, and response handling. No more manual message list appending. No more writing the tool execution while-loop. No more parsing tool_calls responses by hand.

The core building blocks you will use throughout this session are: models (the LLM wrappers like `ChatOpenAI`), messages (the conversation units — `HumanMessage`, `AIMessage`, `ToolMessage`), tools (Python functions decorated with `@tool` that the agent can call), agents (the reasoning loop that decides when to call tools), memory (conversation persistence across turns), and middleware (guardrails and preprocessing). These map directly to concepts you already know from Session 3 — the difference is that LangChain manages the orchestration so you write less code and make fewer mistakes.

The Runnable interface is LangChain's composition model. Every component — models, tools, chains, agents — implements the same interface with methods like `invoke()`, `stream()`, and `batch()`. This means you can chain components together with the pipe operator (`|`) and they compose naturally. A prompt template piped to a model piped to an output parser creates a complete processing pipeline in one line.

Compared to the raw OpenAI API from Session 3, LangChain reduces boilerplate by roughly 60-70 percent for simple agents. But the real advantage comes with LangGraph: features like checkpointing, conditional routing, and human-in-the-loop would require hundreds of lines of custom code with the raw API. With LangGraph, they are built-in primitives.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you built tool calling by manually writing a while-loop that checked for tool_calls in the response. In LangChain, what replaces all of that manual plumbing?",
    options: [
      "You still write the while-loop but LangChain provides helper functions",
      "create_agent() from langgraph.prebuilt handles the entire agent loop automatically",
      "LangChain connects directly to OpenAI's server-side agent runtime",
      "You use ConversationChain which manages everything"
    ],
    correct: 1,
    explanation: "create_agent() is the modern LangChain entry point. It takes a model and tools, and returns a fully functional agent that handles the observe-reason-act loop, tool execution, and message management automatically. No manual while-loop needed."
  },
  {
    question: "What is the relationship between LangChain and LangGraph?",
    options: [
      "LangGraph is a newer version that replaces LangChain entirely",
      "LangChain is for Python and LangGraph is for JavaScript",
      "LangChain provides building blocks (models, tools, prompts) and LangGraph provides the orchestration runtime (state, routing, persistence)",
      "They are competing frameworks from different companies"
    ],
    correct: 2,
    explanation: "LangChain and LangGraph are complementary. LangChain gives you the components — model wrappers, tool definitions, output parsers. LangGraph gives you the execution engine — stateful workflows, conditional routing, checkpointing, human-in-the-loop. They are designed to work together."
  },
  {
    question: "A clinical assistant needs to: (1) answer simple questions about drug dosing, and (2) sometimes look up a patient's medication list. Which approach is most appropriate?",
    options: [
      "Build a full LangGraph StateGraph with multiple nodes and conditional edges",
      "Use create_agent with ChatOpenAI and a lookup_medications tool",
      "Write raw OpenAI API calls with manual tool handling like Session 3",
      "Fine-tune a HuggingFace model on medication data"
    ],
    correct: 1,
    explanation: "For a simple agent with a few tools, create_agent is the right choice — it handles the tool calling loop automatically. You only need LangGraph's StateGraph when you have complex workflows with branching, conditional routing, or multi-agent coordination."
  },
  {
    question: "In LangChain, the Runnable interface lets you compose components with the pipe operator: prompt | model | parser. What does this create?",
    options: [
      "A new Python class that inherits from all three components",
      "A processing pipeline where output of each step feeds into the next",
      "Three separate API calls that run in parallel",
      "A configuration file that describes the pipeline"
    ],
    correct: 1,
    explanation: "The pipe operator composes Runnables into a chain. Data flows through: the prompt formats the input, the model generates a response, and the parser extracts structured output. Each component implements the same Runnable interface (invoke, stream, batch)."
  },
  {
    question: "When should you use LangGraph instead of a simple LangChain create_agent?",
    options: [
      "Whenever you use any LLM — LangGraph is always better",
      "Only when you need to use open-source models instead of OpenAI",
      "When your workflow needs branching, conditional routing, persistence, or human approval steps",
      "When your agent has more than 2 tools"
    ],
    correct: 2,
    explanation: "LangGraph is for complex workflows: multi-step processes with conditional branches (route patient to different specialists), persistence (resume after failure), and human-in-the-loop (approve risky actions). A simple Q&A agent with tools does not need LangGraph."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand when and why to use LangChain and LangGraph." : score >= 3 ? "Good foundation — review the relationship between LangChain and LangGraph." : "Review the lesson material before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const scenarios = [
  {
    title: "Simple Drug Dosing Q&A",
    description: "A pharmacist wants a chatbot that answers questions about standard drug dosages. It has access to a formulary database via a lookup tool. No branching logic. No approvals needed.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langchain",
    explanation: "Simple Q&A with one tool is a perfect fit for create_agent. It handles the tool loop automatically. Raw API works but is unnecessary plumbing. LangGraph is overkill — there is no branching or complex state."
  },
  {
    title: "Clinical Triage Router",
    description: "A patient describes symptoms. The system classifies urgency (emergency, urgent, routine), routes to the appropriate specialist (oncology, cardiology, general), and requires a human nurse to approve emergency escalations before paging the doctor.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langgraph",
    explanation: "This needs conditional routing (different paths based on urgency), multiple processing steps (classify then route then approve), and human-in-the-loop (nurse approval for emergencies). This is exactly what LangGraph is built for."
  },
  {
    title: "Batch Lab Report Summarization",
    description: "Process 200 pathology lab reports overnight. For each report, extract key findings into a structured JSON format. No conversation, no tools, no branching — just input-output processing.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "raw",
    explanation: "Batch extraction with no tools, no conversation, and no branching is a simple API call in a loop. LangChain adds overhead without benefit here. Use client.chat.completions.create() with Pydantic structured output — exactly what you learned in Session 3."
  },
  {
    title: "Multi-Specialist Consultation",
    description: "An oncology case requires input from three specialists: a medical oncologist reviews treatment options, a radiologist reviews imaging, and a pathologist reviews biopsy results. A coordinator agent synthesizes their opinions and presents a unified recommendation. Each specialist has its own tools and prompt.",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langgraph",
    explanation: "Multi-agent coordination with separate specialists, shared state, and a synthesizer is a complex workflow. LangGraph's StateGraph lets you define each specialist as a node, route between them, manage shared state, and coordinate the final synthesis."
  },
  {
    title: "Interactive Medication Checker",
    description: "A doctor types a medication name and the system checks for interactions with the patient's current medications, flags warnings, and suggests alternatives. Single conversation turn, two tools (get_current_meds, check_interactions).",
    options: [
      { label: "Raw OpenAI API (manual tool loop)", value: "raw" },
      { label: "LangChain create_agent (automatic tool loop)", value: "langchain" },
      { label: "LangGraph StateGraph (stateful workflow)", value: "langgraph" }
    ],
    correct: "langchain",
    explanation: "A conversational agent with two tools and no complex routing is ideal for create_agent. The agent will call get_current_meds, then check_interactions, and formulate a response — all handled automatically by the agent loop."
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[currentScenario];

  const checkAnswer = () => {
    const correct = selected === s.correct;
    setScores([...scores, correct ? 1 : 0]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentScenario(c => c + 1);
    setSelected('');
    setSubmitted(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Framework Decision Tree Complete!</h2>
        <p style={{ fontSize: 20 }}>You scored {totalScore} / {scenarios.length}</p>
        <div style={{ background: totalScore >= 4 ? '#d4edda' : totalScore >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {totalScore >= 4 ? "Excellent! You know when to use raw API, LangChain, or LangGraph." : totalScore >= 3 ? "Good intuition — review the criteria for choosing LangGraph over LangChain." : "Review the lesson material on when each approach is appropriate."}
        </div>
        <button onClick={() => { setCurrentScenario(0); setScores([]); setSubmitted(false); setSelected(''); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {currentScenario + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{s.description}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Which approach is most appropriate?</p>
      {s.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(opt.value)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt.value === s.correct ? '#198754' : opt.value === selected ? '#dc3545' : '#dee2e6') : opt.value === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt.value === s.correct ? '#d4edda' : opt.value === selected && opt.value !== s.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt.label}</div>
      ))}

      {!submitted && <button onClick={checkAnswer} disabled={!selected} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: !selected ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>{selected === s.correct ? 'Correct!' : 'Not quite.'}</strong></p>
          <p>{s.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 2 OF 6: Tools & the Agent Loop

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"In Session 3 you defined tools as JSON schemas and wrote the execution loop yourself. You had to describe each parameter in a JSON object, handle the tool_calls response, execute the function, append the result with the right role and tool_call_id, and loop back. LangChain makes this dramatically simpler. The `@tool` decorator turns any Python function into an agent tool — one line replaces twenty. And the agent loop — reason, act, observe, repeat — is handled automatically by `create_agent`. Let's see how."

---

### NotebookLM Summary

In Session 3 you defined tools using verbose JSON schemas — specifying type, function name, description, and parameters manually. In LangChain, the `@tool` decorator transforms any Python function into a fully-specified agent tool in one line. You write a normal Python function with a docstring and type hints, add `@tool` above it, and LangChain automatically generates the JSON schema from the function signature. The function name becomes the tool name. The docstring becomes the description the model reads when deciding whether to call it. The type hints become the parameter schema. This is not just syntactic sugar — it eliminates an entire class of bugs where your JSON schema and your actual function signature drift apart.

Tool design is critical because the model chooses tools based entirely on their names and descriptions. A tool named `f1` with no description will never be called correctly. A tool named `check_drug_interaction` with the description "Check if two medications have known interactions. Returns severity level and clinical recommendation" gives the model everything it needs to decide when and how to use it. The description is your contract with the model — it is the most important part of tool design.

The agent loop is the core reasoning pattern: the model observes the current state (user question plus conversation history), reasons about what to do next (answer directly or call a tool), acts (generates text or a tool call), and observes the result. This cycle repeats until the model decides it has enough information to give a final answer or hits a stopping condition. In LangChain, `create_agent` implements this entire loop. You never write it yourself.

Stopping conditions prevent infinite loops. The agent stops when it generates a final text response (no tool calls), when it hits a maximum number of iterations (configurable), or when middleware intercepts the response. In clinical contexts, you want explicit iteration limits — an agent that keeps calling tools in a loop is burning tokens and potentially taking contradictory actions.

Error handling for tools matters in production clinical systems. If `check_drug_interaction` raises an exception because the drug name is misspelled, the agent should recover gracefully — not crash. LangChain tools can return error messages that the model sees and adjusts to. For example, returning "Drug 'cispltin' not found. Did you mean 'cisplatin'?" lets the model retry with the corrected name.

Middleware and guardrails wrap around the agent loop. You can add preprocessing (validate inputs before they reach the model), postprocessing (check outputs for safety), and logging (track every tool call for audit trails). In clinical applications, guardrails might prevent the agent from making recommendations outside its scope or ensure that every drug interaction check is logged.

Clinical tool examples that you will build in the lab include: `lookup_patient(mrn)` which returns patient demographics and current status, `query_vitals_db(mrn, vital_type)` which queries the vitals database from Session 3, and `check_drug_interaction(drug_a, drug_b)` which checks a drug interaction reference. These are the same operations you built manually in Session 3 — but now the agent calls them automatically based on the conversation.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you defined a tool with a 15-line JSON schema. In LangChain, what replaces that entire schema definition?",
    options: [
      "A YAML configuration file that describes the tool",
      "The @tool decorator on a Python function — the schema is generated from the function's docstring and type hints",
      "A call to register_tool() with the function name",
      "You still write the JSON schema but LangChain validates it for you"
    ],
    correct: 1,
    explanation: "The @tool decorator automatically generates the JSON schema from the function's name (tool name), docstring (description), and type hints (parameter schema). One decorator replaces twenty lines of JSON."
  },
  {
    question: "You have two tools: get_patient_info(mrn: str) with docstring 'Retrieve patient demographics' and f(x: str) with no docstring. Which will the model use correctly?",
    options: [
      "Both — the model figures out what functions do from their code",
      "Only get_patient_info — the model relies on the name and description to choose tools",
      "Only f — shorter names are easier for the model to process",
      "Neither — the model needs explicit instructions to use each tool"
    ],
    correct: 1,
    explanation: "The model decides which tool to call based entirely on the tool's name and description. A descriptive name and clear docstring are essential. The model never sees the function's implementation code — only the schema."
  },
  {
    question: "The agent calls check_drug_interaction('cispltin', 'ondansetron') but 'cispltin' is misspelled. What should the tool return?",
    options: [
      "Raise a Python exception that crashes the agent",
      "Return an empty result and let the model figure it out",
      "Return an error message like 'Drug cispltin not found. Did you mean cisplatin?' so the model can retry",
      "Silently correct the spelling and return the result"
    ],
    correct: 2,
    explanation: "Returning a descriptive error message lets the agent self-correct. The model reads the error, understands the issue, and retries with the correct spelling. This is more robust than crashing and more transparent than silent correction."
  },
  {
    question: "What prevents a LangChain agent from calling tools in an infinite loop?",
    options: [
      "The OpenAI API automatically stops after 5 tool calls",
      "Stopping conditions: the model gives a final answer, hits a max iteration limit, or middleware intervenes",
      "Tools can only be called once each per conversation",
      "The agent always stops after exactly one tool call"
    ],
    correct: 1,
    explanation: "Agents stop when they have enough information (final text response), when they hit a configured max iteration limit, or when middleware intercepts. In clinical contexts, always set explicit iteration limits to prevent runaway agents."
  },
  {
    question: "In the agent loop pattern (observe, reason, act, observe), what does the 'reason' step actually involve?",
    options: [
      "The agent runs a separate reasoning algorithm before calling the model",
      "The model reads the current state (messages, tool results) and decides whether to call a tool or give a final answer",
      "The developer writes if-else logic to determine the next action",
      "The agent searches a knowledge base for relevant information"
    ],
    correct: 1,
    explanation: "The 'reason' step is the model itself reading all available context — the user question, conversation history, tool descriptions, and previous tool results — and deciding the next action. This is the intelligence at the heart of the agent pattern."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand tool design and the agent loop." : score >= 3 ? "Good foundation — review tool descriptions and error handling." : "Review the lesson material on @tool and the agent loop before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const toolPairs = [
  {
    scenario: "A nurse asks: 'Does cisplatin interact with warfarin?' The agent needs a drug interaction checker.",
    optionA: {
      name: "check",
      description: "Checks things",
      params: "drug1: str, drug2: str",
      label: "Tool A"
    },
    optionB: {
      name: "check_drug_interaction",
      description: "Check if two medications have known interactions. Returns severity (none/minor/moderate/major/contraindicated), clinical effect, and recommended action.",
      params: "drug_a: str, drug_b: str",
      label: "Tool B"
    },
    correct: "B",
    explanation: "Tool B has a descriptive name, detailed description that tells the model exactly what it returns (severity, effect, action), and clear parameter names. Tool A's vague name 'check' and description 'Checks things' gives the model almost no information to decide when or how to use it."
  },
  {
    scenario: "A doctor asks: 'What are the latest vitals for patient 18887304731609?' The agent needs a vitals lookup tool.",
    optionA: {
      name: "query_vitals_db",
      description: "Query the KHCC vista_vitals database for a patient's most recent vital signs. Returns a list of vitals (blood pressure, pulse, temperature, respiration, pulse oximetry) with timestamps.",
      params: "mrn: str, vital_type: Optional[str] = None",
      label: "Tool A"
    },
    optionB: {
      name: "get_vitals",
      description: "Get vitals for a patient",
      params: "patient_id: int",
      label: "Tool B"
    },
    correct: "A",
    explanation: "Tool A wins on every dimension: descriptive name referencing the actual database, detailed description listing what vital types are available, Optional vital_type parameter for filtering, and the correct type (str for MRN, not int). Tool B's description is too vague and uses the wrong type for patient ID."
  },
  {
    scenario: "A pharmacist asks: 'Look up the current medications for this patient and check if the new prescription is safe.' This requires two tools working together.",
    optionA: {
      name: "lookup_patient_medications",
      description: "Retrieve the current active medication list for a patient by MRN. Returns medication names, doses, frequencies, and prescribing dates.",
      params: "mrn: str",
      label: "Tool: lookup_patient_medications"
    },
    optionB: {
      name: "do_everything",
      description: "Look up patient medications and check all interactions in one call. Pass the MRN and new drug name.",
      params: "mrn: str, new_drug: str",
      label: "Tool: do_everything"
    },
    correct: "A",
    explanation: "Single-responsibility tools are better than 'do everything' tools. Tool A does one thing well — the agent can call it first, then call check_drug_interaction for each current medication against the new drug. Tool B hides the logic inside the tool, making it inflexible and harder to debug. Composable tools let the agent reason about each step."
  },
  {
    scenario: "The agent needs to flag patients with abnormal lab results. Which error handling approach is better?",
    optionA: {
      name: "check_lab_result",
      description: "Check if a lab value is within normal range. Returns status (normal/abnormal/critical) and reference range.",
      params: "lab_type: str, value: float",
      label: "Returns error message on invalid input"
    },
    optionB: {
      name: "check_lab_result",
      description: "Check if a lab value is within normal range.",
      params: "lab_type: str, value: float",
      label: "Raises Python exception on invalid input"
    },
    correct: "A",
    explanation: "Returning an error message (e.g., 'Unknown lab type: CBC. Valid types are: WBC, RBC, HGB, PLT') lets the agent read the error and retry with corrected input. A Python exception crashes the agent entirely. In clinical systems, graceful error handling is essential."
  }
];

export default function Practice() {
  const [currentPair, setCurrentPair] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const pair = toolPairs[currentPair];

  const handleSubmit = () => {
    if (selected === pair.correct) setScore(s => s + 1);
    setSubmitted(true);
  };

  const next = () => {
    setCurrentPair(c => c + 1);
    setSelected('');
    setSubmitted(false);
  };

  if (currentPair >= toolPairs.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Tool Design Workshop Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {score} / {toolPairs.length}</p>
        <div style={{ background: score >= 3 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {score >= 3 ? "Excellent tool design instincts! You know what makes a tool effective for an agent." : "Review tool naming, descriptions, and single-responsibility design before the lab."}
        </div>
        <button onClick={() => { setCurrentPair(0); setScore(0); setSelected(''); setSubmitted(false); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentPair + 1) / toolPairs.length) * 100}%` }} />
      </div>
      <h3>Tool Design {currentPair + 1} of {toolPairs.length}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{pair.scenario}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Which tool design is better?</p>

      {[pair.optionA, pair.optionB].map((opt, i) => {
        const letter = i === 0 ? 'A' : 'B';
        return (
          <div key={letter} onClick={() => !submitted && setSelected(letter)} style={{
            padding: 16, margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${submitted ? (letter === pair.correct ? '#198754' : letter === selected ? '#dc3545' : '#dee2e6') : letter === selected ? '#0d6efd' : '#dee2e6'}`,
            background: submitted ? (letter === pair.correct ? '#d4edda' : letter === selected && letter !== pair.correct ? '#f8d7da' : '#fff') : '#fff'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{opt.label}</p>
            <pre style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: 8, borderRadius: 4 }}>
{`name: "${opt.name}"
description: "${opt.description}"
params: ${opt.params}`}
            </pre>
          </div>
        );
      })}

      {!submitted && selected && (
        <button onClick={handleSubmit} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answer</button>
      )}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{pair.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentPair + 1 < toolPairs.length ? 'Next Comparison' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 3 OF 6: LangGraph — Stateful Workflows

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"LangChain agents are powerful but they are a single loop — the model reasons, calls tools, and answers. What if your workflow needs to branch? What if a triage system needs to route patients to different specialists based on symptoms? What if some paths need human approval and others do not? That is LangGraph — explicit stateful workflows with nodes, edges, and conditional routing. Think of it as a flowchart that the computer executes, where each box is a function and each arrow can have conditions."

---

### NotebookLM Summary

LangGraph introduces `StateGraph`, a way to define workflows as directed graphs where nodes are functions and edges are transitions. Unlike a simple agent loop that just reasons and calls tools, a StateGraph gives you explicit control over the workflow structure — which steps happen, in what order, and under what conditions.

State is defined using Python's `TypedDict`. You declare the shape of your workflow's data — what fields exist, their types, and how they update. For a clinical triage workflow, state might include `patient_symptoms: str`, `urgency_level: str`, `specialist: str`, `recommendation: str`, and `messages: list`. Every node in the graph reads from and writes to this shared state. This is fundamentally different from the raw OpenAI API where you managed a flat messages list — here, state is structured and typed.

Nodes are Python functions that receive the current state and return updates. A `classify_urgency` node might read `patient_symptoms` from state, call an LLM to classify urgency, and return `{"urgency_level": "emergency"}`. A `route_to_specialist` node reads the urgency level and symptoms, determines the appropriate specialist, and returns `{"specialist": "oncology"}`. Each node does one thing and updates specific state fields.

Edges define transitions between nodes. Simple edges always go from A to B. Conditional edges branch based on state — after the `classify_urgency` node, a conditional edge checks `state["urgency_level"]`: if "emergency" go to the `emergency_protocol` node, if "urgent" go to `specialist_consult`, if "routine" go to `schedule_appointment`. This branching logic is declared in the graph structure, not buried in if-else chains in your code.

The `Command` object combines a state update with a routing decision in a single return value. Instead of updating state and then having a separate conditional edge function, a node can return `Command(update={"urgency_level": "emergency"}, goto="emergency_protocol")`. This makes the node self-routing — it decides both what to update and where to go next.

LangGraph offers two APIs: the Graph API and the Functional API. The Graph API (`StateGraph`) is what you use when you want explicit visual structure — nodes and edges you can diagram. The Functional API uses `@entrypoint` and `@task` decorators for simpler workflows that feel more like regular Python functions. For this session, we focus on the Graph API because it maps directly to clinical workflow diagrams.

Building a clinical triage workflow brings all of this together. The graph has five nodes: an `intake` node that collects patient information, a `classify` node that determines urgency using an LLM, a conditional route that branches to `emergency_handler`, `specialist_referral`, or `routine_care`, and a final `output` node that generates the response. Each node is a focused function, the branching is explicit and auditable, and the entire workflow is visible as a graph structure — which matters enormously for clinical systems where you need to explain and audit every decision path.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "In a LangGraph StateGraph, what is the role of a 'node'?",
    options: [
      "A node stores data like a database table",
      "A node is a function that reads the current state, does some processing, and returns state updates",
      "A node is an LLM that generates text responses",
      "A node is a connection between two other components"
    ],
    correct: 1,
    explanation: "Nodes are functions. Each node receives the current state (a TypedDict), performs processing (which might include LLM calls, tool execution, or pure logic), and returns a dictionary of state updates. Nodes are the 'boxes' in your workflow flowchart."
  },
  {
    question: "A clinical triage system needs to route patients to different specialists based on urgency: emergency goes to the ER, urgent goes to a specialist, routine goes to scheduling. Which LangGraph feature handles this?",
    options: [
      "Multiple StateGraphs running in parallel",
      "Conditional edges that branch based on state values",
      "A single node with if-else logic inside it",
      "Tool calling within the agent loop"
    ],
    correct: 1,
    explanation: "Conditional edges check state values and route to different nodes. After the classify_urgency node sets urgency_level in state, a conditional edge reads that value and routes to the appropriate next node. This keeps routing logic explicit and auditable."
  },
  {
    question: "You define state as: class TriageState(TypedDict): symptoms: str; urgency: str; specialist: str. A node returns {'urgency': 'emergency'}. What happens to the other state fields?",
    options: [
      "They are deleted — the state is replaced entirely",
      "They remain unchanged — nodes only update the fields they return",
      "They are set to None automatically",
      "The graph raises an error because all fields must be updated"
    ],
    correct: 1,
    explanation: "State updates are merged, not replaced. When a node returns {'urgency': 'emergency'}, only the urgency field changes. The symptoms and specialist fields keep their current values. This is why each node can focus on updating just its relevant fields."
  },
  {
    question: "What does Command(update={'specialist': 'oncology'}, goto='specialist_consult') do when returned from a node?",
    options: [
      "It creates a new specialist_consult node dynamically",
      "It updates the specialist field in state AND routes the workflow to the specialist_consult node in one step",
      "It sends a command to an external oncology system",
      "It replaces the current node with specialist_consult"
    ],
    correct: 1,
    explanation: "Command combines state update and routing in a single return value. It updates state (sets specialist to 'oncology') and tells the graph where to go next (specialist_consult node). This is cleaner than having separate update logic and conditional edge functions."
  },
  {
    question: "Why is a StateGraph better than a single agent loop for a clinical triage workflow with multiple specialist paths?",
    options: [
      "StateGraph is faster because it uses parallel processing",
      "StateGraph makes the workflow structure explicit and auditable — every path, branch, and decision point is visible in the graph definition",
      "A single agent loop cannot use tools",
      "StateGraph does not require an LLM"
    ],
    correct: 1,
    explanation: "In clinical systems, you need to explain and audit every decision. A StateGraph makes the workflow visible: you can see every node, every conditional edge, every possible path. A single agent loop buries this logic in the model's reasoning, which is harder to audit and explain."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand StateGraph, nodes, edges, and conditional routing." : score >= 3 ? "Good grasp — review conditional edges and the Command object." : "Review the lesson material on StateGraph fundamentals before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const nodes = [
  { id: 'intake', label: 'Intake: Collect patient symptoms and history', order: 1 },
  { id: 'classify', label: 'Classify: LLM determines urgency level (emergency/urgent/routine)', order: 2 },
  { id: 'route', label: 'Conditional Route: Branch based on urgency_level in state', order: 3 },
  { id: 'emergency', label: 'Emergency: Page on-call physician immediately', order: 4 },
  { id: 'specialist', label: 'Specialist: Route to appropriate department (oncology/cardiology/etc)', order: 4 },
  { id: 'routine', label: 'Routine: Schedule next available appointment', order: 4 },
  { id: 'output', label: 'Output: Generate patient-facing summary and next steps', order: 5 },
];

const routingQuestions = [
  {
    scenario: "Patient reports sudden severe chest pain, shortness of breath, and dizziness that started 10 minutes ago.",
    options: ["Emergency", "Specialist (Cardiology)", "Routine"],
    correct: 0,
    explanation: "Acute chest pain with shortness of breath and dizziness is a potential cardiac emergency. The conditional edge routes to the emergency_handler node, which pages the on-call physician immediately."
  },
  {
    scenario: "Patient has a slowly growing mole on their back that has changed color over the past 3 months. No pain, no bleeding.",
    options: ["Emergency", "Specialist (Dermatology/Oncology)", "Routine"],
    correct: 1,
    explanation: "A changing mole is concerning for melanoma and needs specialist evaluation, but it is not an emergency. The conditional edge routes to the specialist_referral node with dermatology/oncology as the target."
  },
  {
    scenario: "Patient needs a routine medication refill for hypertension. Blood pressure well-controlled at last visit. No new symptoms.",
    options: ["Emergency", "Specialist (Cardiology)", "Routine"],
    correct: 2,
    explanation: "A stable, well-controlled condition needing only a refill is routine. The conditional edge routes to the routine_care node, which schedules the next available appointment."
  }
];

export default function Practice() {
  const [phase, setPhase] = useState('build');
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState(() => [...nodes].sort(() => Math.random() - 0.5));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [routeScore, setRouteScore] = useState(0);

  if (phase === 'build') {
    const isCorrect = placed.length === nodes.length && placed.every((n, i) => {
      if (i < 3) return n.order === i + 1;
      if (i >= 3 && i <= 5) return n.order === 4;
      return n.order === 5;
    });

    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2>Part 1: Build the Clinical Triage Workflow</h2>
        <p>Arrange the nodes in the correct order. The three specialist paths (Emergency, Specialist, Routine) are parallel branches that all come after the conditional route.</p>

        <div style={{ minHeight: 50, marginBottom: 16 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Your workflow:</p>
          {placed.map((n, i) => (
            <div key={n.id} style={{ padding: '8px 12px', margin: 4, background: '#e3f2fd', borderRadius: 6, display: 'inline-block', cursor: 'pointer', fontSize: 13 }} onClick={() => {
              setPlaced(placed.filter(x => x.id !== n.id));
              setAvailable([...available, n]);
            }}>
              {i + 1}. {n.label} x
            </div>
          ))}
          {placed.length === 0 && <span style={{ color: '#999' }}>Click nodes below to add them...</span>}
        </div>

        <div>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Available nodes:</p>
          {available.map(n => (
            <div key={n.id} onClick={() => {
              setPlaced([...placed, n]);
              setAvailable(available.filter(x => x.id !== n.id));
            }} style={{ padding: '10px 14px', margin: 6, background: '#f8f9fa', borderRadius: 6, cursor: 'pointer', border: '1px solid #dee2e6', display: 'inline-block', fontSize: 13 }}>
              {n.label}
            </div>
          ))}
        </div>

        {placed.length === nodes.length && (
          <div style={{ marginTop: 16, padding: 16, background: isCorrect ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
            {isCorrect ? (
              <>
                <p><strong>Correct!</strong> Intake -> Classify -> Conditional Route -> [Emergency | Specialist | Routine] -> Output</p>
                <button onClick={() => setPhase('route')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Continue to Part 2: Route Patients</button>
              </>
            ) : (
              <p><strong>Not quite.</strong> Remember: Intake first, then Classify, then Conditional Route, then the three parallel branches, then Output. Click nodes to remove and reorder.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (currentQ >= routingQuestions.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Clinical Workflow Designer Complete!</h2>
        <p style={{ fontSize: 20 }}>Routing Score: {routeScore} / {routingQuestions.length}</p>
        <div style={{ background: '#d4edda', padding: 16, borderRadius: 8 }}>
          You have designed the workflow structure AND made routing decisions. In the lab, you will implement this as a real LangGraph StateGraph with Python code.
        </div>
      </div>
    );
  }

  const q = routingQuestions[currentQ];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Part 2: Route Patients ({currentQ + 1}/{routingQuestions.length})</h2>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}><strong>Patient presentation:</strong> {q.scenario}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Which path should the conditional edge take?</p>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : i === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}

      {!submitted && selected !== null && (
        <button onClick={() => { setSubmitted(true); if (selected === q.correct) setRouteScore(s => s + 1); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Route</button>
      )}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{q.explanation}</p>
          <button onClick={() => { setCurrentQ(c => c + 1); setSelected(null); setSubmitted(false); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentQ + 1 < routingQuestions.length ? 'Next Patient' : 'See Results'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 6: Memory & Persistence

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"In Session 3 you built memory by appending messages to a Python list. It worked for a single conversation — but what happens when the user closes the browser? The list is gone. What if the workflow crashes halfway through? You start over. What if a patient comes back next week and the doctor wants the AI to remember the previous conversation? No way to do that with a list. LangGraph takes memory much further — checkpointing saves state at every step so conversations persist across sessions, workflows can resume after failure, and you can even time-travel to debug what went wrong. Plus long-term memory lets you remember patient preferences across completely separate conversations."

---

### NotebookLM Summary

In Session 3 you built conversation memory by maintaining a Python list of messages. Every user message and assistant response was appended to the list, and the entire list was sent with each API call. This approach has three fundamental limitations: the memory is lost when the program stops (no persistence), if processing fails mid-conversation you cannot resume (no recovery), and there is no way to remember information across separate conversations (no long-term memory). LangGraph solves all three.

Short-term memory in LangGraph is thread-scoped. A thread is an execution context — think of it as one conversation session. Every message within a thread is automatically tracked in the graph's state. When the user sends a message, the state is updated. When the agent responds, the state is updated again. You do not manually append messages to a list — the framework handles it. Each thread has a unique `thread_id` that identifies it, and all state is scoped to that thread.

Checkpointing is LangGraph's persistence layer. A checkpointer saves the complete graph state after every node execution. `MemorySaver` stores checkpoints in memory (good for development). `PostgresSaver` stores checkpoints in a PostgreSQL database (good for production). With checkpointing enabled, you can stop the program, restart it, and resume a conversation exactly where you left off by providing the same `thread_id`. More importantly, if a workflow fails at step 3 of 5, you can resume from step 3 rather than starting over — critical for long-running clinical workflows where reprocessing is expensive.

Checkpointing also enables time-travel debugging. Because state is saved at every step, you can inspect what the state looked like at any point in the workflow. If a triage system made an incorrect routing decision, you can go back to the state just before the routing node and examine exactly what information was available. This is invaluable for debugging and auditing clinical AI systems.

Long-term memory in LangGraph uses a separate store — a key-value database organized by namespaces. While short-term memory (thread state) disappears when a thread ends, long-term memory persists across all threads. You might store patient preferences in a namespace keyed by MRN: the patient prefers Arabic language, has a history of anxiety about procedures, and responds well to detailed explanations. Any future conversation involving that patient can retrieve these preferences and adapt accordingly.

The key design decision is what goes where. Short-term memory holds the current conversation: the messages, tool results, and intermediate state of the current workflow. Long-term memory holds cross-conversation knowledge: patient preferences, historical summaries, clinician notes about communication style. A common mistake is stuffing everything into short-term memory — this fills the context window quickly. Instead, use selective recall: store summaries and preferences in long-term memory, and pull only what is relevant into the current conversation.

Context trimming and summarization strategies prevent the context window from overflowing. You can set a maximum message count (keep only the last N messages), summarize older messages into a condensed form, or use a sliding window that preserves the system message and most recent exchanges while dropping the middle. These strategies mirror what you did manually in Session 3 with token counting — but LangGraph can automate them.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "In Session 3, you built memory with a Python list of messages. What is the biggest limitation of that approach?",
    options: [
      "The list gets too long and Python runs out of memory",
      "The memory is lost when the program stops — there is no persistence across sessions",
      "The model cannot read messages from a Python list",
      "Lists are slower than dictionaries for message storage"
    ],
    correct: 1,
    explanation: "A Python list exists only in RAM. When the program stops, the conversation is gone. LangGraph's checkpointing saves state to a persistent store (memory, database, etc.) so conversations survive restarts."
  },
  {
    question: "What is a 'thread' in LangGraph?",
    options: [
      "A Python threading object for parallel processing",
      "A unique execution context that scopes one conversation session — identified by a thread_id",
      "A connection to the OpenAI API",
      "A sequence of tool calls in the agent loop"
    ],
    correct: 1,
    explanation: "A thread is a conversation scope. All messages, state updates, and checkpoints within a conversation belong to one thread_id. Starting a new conversation means creating a new thread_id. Resuming an old conversation means using its existing thread_id."
  },
  {
    question: "A clinical triage workflow crashes at step 3 of 5 due to a network error. With checkpointing enabled, what happens when you restart?",
    options: [
      "The entire workflow restarts from step 1",
      "The workflow resumes from step 3 because state was checkpointed after each step",
      "The workflow skips to step 5 and guesses the missing results",
      "Checkpointing only saves the final result, not intermediate steps"
    ],
    correct: 1,
    explanation: "Checkpointing saves state after every node execution. When you restart with the same thread_id, the graph loads the last checkpoint (after step 2) and resumes from step 3. This is critical for expensive clinical workflows."
  },
  {
    question: "A patient visited the oncology clinic 3 weeks ago and discussed treatment preferences. Today they are back for a follow-up. Where should those preferences be stored so the AI remembers them?",
    options: [
      "In the current thread's short-term memory (message history)",
      "In long-term memory (LangGraph store, keyed by patient MRN)",
      "In the system prompt, which is the same for all patients",
      "In the OpenAI model's training data"
    ],
    correct: 1,
    explanation: "Long-term memory (the LangGraph store) persists across threads. Patient preferences stored with the MRN as key are available to any future conversation about that patient. Short-term memory only lasts for one conversation thread."
  },
  {
    question: "Your clinical assistant's conversation history has grown to 90,000 tokens. The model's context window is 128,000. What should the system do?",
    options: [
      "Continue adding messages until the context window is full",
      "Apply a trimming strategy: summarize older messages or keep only the most recent N exchanges to free up context space",
      "Start a new thread and lose all conversation history",
      "Switch to a model with a larger context window"
    ],
    correct: 1,
    explanation: "Context trimming prevents overflow while preserving essential information. Options include summarizing older messages, keeping a sliding window of recent exchanges, or selectively retaining only the most relevant messages. This automates what you did manually with tiktoken in Session 3."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand threads, checkpointing, and memory architecture." : score >= 3 ? "Good grasp — review long-term memory and context trimming." : "Review the lesson material on memory persistence before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const scenarios = [
  {
    title: "Oncology Follow-up Clinic",
    description: "A patient visits the oncology clinic every 3 weeks for chemotherapy. Each visit, the AI assistant helps the oncologist review symptoms, check labs, and adjust treatment. The patient has specific communication preferences (prefers Arabic, anxious about side effects, wants detailed explanations).",
    items: [
      { text: "Current conversation messages (today's symptoms, lab results)", correct: "short" },
      { text: "Patient communication preferences (language, anxiety level, explanation detail)", correct: "long" },
      { text: "Tool call results from today's lab lookup", correct: "short" },
      { text: "Summary of last visit's treatment adjustments", correct: "long" },
      { text: "Agent's intermediate reasoning steps for today's recommendation", correct: "short" },
      { text: "List of all prior chemotherapy cycles and responses", correct: "long" }
    ]
  },
  {
    title: "Emergency Triage System",
    description: "A 24/7 triage system handles incoming patient calls. Each call is a separate conversation. The system must remember that certain patients have recurring presentations (e.g., a patient with sickle cell crisis who presents frequently and has a standing protocol).",
    items: [
      { text: "The current caller's described symptoms", correct: "short" },
      { text: "Standing protocols for known recurring patients", correct: "long" },
      { text: "Triage classification result for this call", correct: "short" },
      { text: "Patient allergy list", correct: "long" },
      { text: "The conditional routing decision (emergency vs urgent vs routine)", correct: "short" },
      { text: "Historical pattern: this patient calls about sickle cell crisis monthly", correct: "long" }
    ]
  }
];

export default function Practice() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const s = scenarios[currentScenario];

  const handleSelect = (idx, value) => {
    if (checked) return;
    setAnswers({ ...answers, [idx]: value });
  };

  const checkAnswers = () => setChecked(true);

  const getScore = () => s.items.filter((item, i) => answers[i] === item.correct).length;

  const next = () => {
    setCurrentScenario(c => c + 1);
    setAnswers({});
    setChecked(false);
  };

  if (currentScenario >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Memory Architecture Designer Complete!</h2>
        <div style={{ background: '#d4edda', padding: 20, borderRadius: 8 }}>
          You have designed memory architectures for two clinical systems. The key insight: short-term memory holds the current conversation, long-term memory holds cross-conversation knowledge that any future session can retrieve.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {currentScenario + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{s.description}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>For each item, decide: Short-term memory (thread state) or Long-term memory (persistent store)?</p>

      {s.items.map((item, i) => (
        <div key={i} style={{ padding: 12, margin: '8px 0', borderRadius: 8, border: '1px solid #dee2e6', background: checked ? (answers[i] === item.correct ? '#d4edda' : '#f8d7da') : '#fff' }}>
          <p style={{ marginBottom: 8, fontSize: 14 }}>{item.text}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleSelect(i, 'short')} disabled={checked} style={{
              padding: '6px 16px', borderRadius: 6, border: `2px solid ${answers[i] === 'short' ? '#0d6efd' : '#dee2e6'}`,
              background: answers[i] === 'short' ? '#e3f2fd' : '#fff', cursor: checked ? 'default' : 'pointer', fontSize: 13
            }}>Short-term</button>
            <button onClick={() => handleSelect(i, 'long')} disabled={checked} style={{
              padding: '6px 16px', borderRadius: 6, border: `2px solid ${answers[i] === 'long' ? '#0d6efd' : '#dee2e6'}`,
              background: answers[i] === 'long' ? '#e3f2fd' : '#fff', cursor: checked ? 'default' : 'pointer', fontSize: 13
            }}>Long-term</button>
          </div>
          {checked && answers[i] !== item.correct && (
            <p style={{ fontSize: 12, color: '#dc3545', marginTop: 4 }}>Should be: <strong>{item.correct === 'short' ? 'Short-term' : 'Long-term'}</strong></p>
          )}
        </div>
      ))}

      {!checked && Object.keys(answers).length === s.items.length && (
        <button onClick={checkAnswers} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answers</button>
      )}

      {checked && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {getScore()} / {s.items.length}</strong></p>
          <p>Rule of thumb: if the data is only relevant to THIS conversation, it is short-term. If it is useful across FUTURE conversations, it is long-term.</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'See Final Results'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 6: Multi-Agent Patterns & Human-in-the-Loop

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Real clinical AI systems are not one agent — they are teams. A triage agent routes to an oncology specialist, who consults a drug interaction checker, who flags a risky prescription for human approval before it goes through. No single agent can handle all of this safely. Today you build that kind of system using LangGraph's multi-agent patterns. You will learn when to use an orchestrator versus a supervisor, how agents hand off work to each other, and most importantly — how to put a human in the loop for critical decisions."

---

### NotebookLM Summary

Multi-agent systems split complex tasks across specialized agents rather than relying on one agent to do everything. The reason is the same as in medicine: specialization produces better results. An oncology specialist agent has a focused prompt, specific tools (cancer staging databases, treatment protocols), and deep domain knowledge. A drug interaction agent has access to interaction databases and pharmacology tools. A triage agent knows how to classify urgency and route appropriately. Each agent excels at its narrow task.

The orchestrator-worker pattern uses one coordinator agent that dispatches tasks to specialized workers. The orchestrator reads the patient's initial presentation, decides which specialists are needed, sends them relevant information, collects their responses, and synthesizes a unified recommendation. This mirrors a clinical coordinator who manages a multidisciplinary tumor board — one person orchestrates, many specialists contribute.

The supervisor pattern is similar but the supervisor actively monitors and redirects worker agents. If the oncology agent's response is incomplete, the supervisor sends it back for more detail. If two agents give contradictory recommendations, the supervisor resolves the conflict. The supervisor has authority to override or redirect, not just dispatch.

Agent handoff is how one agent transfers control to another. In LangGraph, this happens through state updates and routing. The triage agent sets `state["specialist"] = "oncology"` and the graph routes to the oncology node. The oncology agent reads the full state (including the triage classification), does its work, and updates state with its findings. Shared state is the communication channel between agents.

Shared versus private state is an important design decision. Some state is shared — the patient's symptoms, the urgency classification, the final recommendation. But some state should be private to each agent. The oncology agent's intermediate reasoning steps about treatment options do not need to be visible to the triage agent. In LangGraph, you can structure state to have both shared fields (visible to all nodes) and private subsets that only specific nodes read or write.

The `interrupt()` function is LangGraph's mechanism for human-in-the-loop workflows. When a node calls `interrupt("Approve this medication change?")`, the graph execution pauses and returns the interrupt message to the calling application. The application presents this to a human (a nurse, a pharmacist, a physician), collects their response, and resumes the graph with that input. This is essential for clinical systems — the AI can recommend, but a human must approve actions with patient safety implications.

After a human provides input through an interrupt, the graph resumes exactly where it paused. The human's response is incorporated into the state, and the next node can read it. For example, an interrupt might pause before executing a high-risk medication change. The pharmacist reviews, approves with a note ("Reduce dose by 25% per protocol"), and the graph resumes with that annotation included.

Preventing agent ping-pong is a practical concern. If Agent A asks Agent B a question, and Agent B asks Agent A for clarification, they can loop indefinitely. Solutions include maximum handoff limits, clear handoff protocols (each handoff must include all necessary context), and supervisor agents that detect and break loops. In clinical systems, runaway agent loops waste time and money — and could delay critical care.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "A clinical AI system uses three specialist agents (oncology, radiology, pathology) coordinated by one orchestrator. What is this pattern called?",
    options: [
      "Single-agent with multiple tools",
      "Orchestrator-worker pattern",
      "Peer-to-peer agent network",
      "Fine-tuned multi-model ensemble"
    ],
    correct: 1,
    explanation: "The orchestrator-worker pattern has one coordinator that dispatches tasks to specialized workers and synthesizes their results. It mirrors a clinical coordinator managing a multidisciplinary team."
  },
  {
    question: "The oncology agent recommends adding a new chemotherapy drug. Before the prescription is processed, a pharmacist must review and approve it. Which LangGraph feature enables this?",
    options: [
      "A conditional edge that routes to a 'pharmacist_review' node",
      "The interrupt() function, which pauses the graph and waits for human input",
      "A tool called 'get_pharmacist_approval' that the agent calls",
      "A middleware function that blocks all medication changes"
    ],
    correct: 1,
    explanation: "interrupt() pauses graph execution and sends a message to the application, which presents it to a human. The pharmacist reviews, provides input (approve/reject/modify), and the graph resumes with that input incorporated into state."
  },
  {
    question: "The triage agent classifies a patient and hands off to the oncology agent. What is the communication channel between them?",
    options: [
      "They send messages to each other through an internal chat",
      "Shared state — the triage agent updates state fields that the oncology agent reads",
      "The triage agent calls the oncology agent as a tool",
      "They communicate through the OpenAI API"
    ],
    correct: 1,
    explanation: "In LangGraph, agents communicate through shared state. The triage agent writes to state (urgency_level, specialist, initial_assessment), and the oncology agent reads those fields when it starts executing. State is the shared memory between all nodes."
  },
  {
    question: "Agent A asks Agent B for a drug interaction check. Agent B asks Agent A for the patient's medication list. Agent A asks Agent B to check each medication individually. This loop continues. What prevents this?",
    options: [
      "LangGraph automatically detects loops and stops them",
      "Maximum handoff limits, clear handoff protocols, and supervisor oversight",
      "Agents cannot communicate with each other directly",
      "The OpenAI API has a built-in loop detector"
    ],
    correct: 1,
    explanation: "You must design against ping-pong explicitly: set maximum handoff counts, require each handoff to include all necessary context (so the receiving agent does not need to ask back), and optionally use a supervisor agent that detects and breaks loops."
  },
  {
    question: "When should you use a human-in-the-loop interrupt in a clinical AI system?",
    options: [
      "For every single decision the AI makes, to be safe",
      "Only for high-stakes actions: medication changes, treatment modifications, emergency escalations — where errors have patient safety consequences",
      "Never — the AI should be fully autonomous for efficiency",
      "Only when the AI explicitly says it is unsure"
    ],
    correct: 1,
    explanation: "Human-in-the-loop should be applied to high-stakes decisions where errors have real patient consequences. Interrupting every decision makes the system unusable. The design question is: which actions are risky enough to require human approval?"
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You understand multi-agent patterns and human-in-the-loop design." : score >= 3 ? "Good foundation — review interrupt() and agent handoff patterns." : "Review multi-agent patterns and human-in-the-loop before moving on."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

```jsx
import React, { useState } from 'react';

const systemDesign = {
  description: "Design a multi-agent clinical system for a cancer center's new patient intake process. A patient arrives, describes their symptoms, and needs to be triaged, evaluated by the right specialist, have their medications checked for interactions, and receive a treatment plan — with human approval for any high-risk recommendations.",
  agents: [
    { id: 'triage', name: 'Triage Agent', desc: 'Classifies urgency and identifies the appropriate specialist department' },
    { id: 'oncology', name: 'Oncology Specialist', desc: 'Reviews cancer-specific symptoms, staging, and treatment history' },
    { id: 'pharmacy', name: 'Pharmacy Agent', desc: 'Checks drug interactions and validates medication safety' },
    { id: 'coordinator', name: 'Coordinator/Orchestrator', desc: 'Manages the workflow, dispatches to specialists, synthesizes results' }
  ],
  patternQuestion: {
    text: "Which multi-agent pattern should coordinate these agents?",
    options: [
      { label: "Peer-to-peer: agents talk to each other directly with no coordinator", value: "peer" },
      { label: "Orchestrator-worker: coordinator dispatches to specialists and synthesizes results", value: "orchestrator" },
      { label: "Sequential chain: triage then oncology then pharmacy in fixed order always", value: "chain" }
    ],
    correct: "orchestrator",
    explanation: "The orchestrator pattern is best here because not every patient needs every specialist. The coordinator decides which agents to involve based on the triage result, collects their outputs, and synthesizes a unified plan."
  },
  interruptQuestions: [
    { action: "Triage agent classifies a patient as 'routine' for a scheduled follow-up", needsInterrupt: false, explanation: "Routine scheduling is low-risk. No human approval needed — the system can book the appointment automatically." },
    { action: "Oncology agent recommends starting a new chemotherapy regimen", needsInterrupt: true, explanation: "Starting chemotherapy is a high-stakes clinical decision. A human oncologist must review and approve before any treatment begins." },
    { action: "Pharmacy agent finds a major drug interaction between two prescribed medications", needsInterrupt: true, explanation: "Major drug interactions can be life-threatening. A pharmacist must review and decide whether to modify the prescription or accept the risk with monitoring." },
    { action: "Coordinator agent generates a summary of the patient's visit for the medical record", needsInterrupt: false, explanation: "Generating a summary is informational and low-risk. It can be generated automatically, though a human might review it later." },
    { action: "Pharmacy agent recommends substituting a medication with a cheaper generic equivalent", needsInterrupt: true, explanation: "Medication substitution affects the patient's treatment. A clinician should approve the substitution to ensure the generic is appropriate for this patient's specific condition." }
  ]
};

export default function Practice() {
  const [phase, setPhase] = useState('pattern');
  const [patternSelected, setPatternSelected] = useState('');
  const [patternSubmitted, setPatternSubmitted] = useState(false);
  const [currentInterrupt, setCurrentInterrupt] = useState(0);
  const [interruptAnswer, setInterruptAnswer] = useState(null);
  const [interruptSubmitted, setInterruptSubmitted] = useState(false);
  const [interruptScore, setInterruptScore] = useState(0);

  if (phase === 'pattern') {
    const pq = systemDesign.patternQuestion;
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2>Multi-Agent Architecture Design</h2>
        <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>{systemDesign.description}</p>

        <h3 style={{ marginTop: 20 }}>Available Agents:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {systemDesign.agents.map(a => (
            <div key={a.id} style={{ padding: 12, background: '#e3f2fd', borderRadius: 8 }}>
              <strong>{a.name}</strong>
              <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0' }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h3>{pq.text}</h3>
        {pq.options.map((opt, i) => (
          <div key={i} onClick={() => !patternSubmitted && setPatternSelected(opt.value)} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: patternSubmitted ? 'default' : 'pointer',
            border: `2px solid ${patternSubmitted ? (opt.value === pq.correct ? '#198754' : opt.value === patternSelected ? '#dc3545' : '#dee2e6') : opt.value === patternSelected ? '#0d6efd' : '#dee2e6'}`,
            background: patternSubmitted ? (opt.value === pq.correct ? '#d4edda' : opt.value === patternSelected && opt.value !== pq.correct ? '#f8d7da' : '#fff') : '#fff'
          }}>{opt.label}</div>
        ))}

        {!patternSubmitted && patternSelected && (
          <button onClick={() => setPatternSubmitted(true)} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answer</button>
        )}

        {patternSubmitted && (
          <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
            <p>{pq.explanation}</p>
            <button onClick={() => setPhase('interrupts')} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Continue to Part 2: Human-in-the-Loop Decisions</button>
          </div>
        )}
      </div>
    );
  }

  const iq = systemDesign.interruptQuestions;

  if (currentInterrupt >= iq.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Multi-Agent Architecture Complete!</h2>
        <p style={{ fontSize: 20 }}>Human-in-the-Loop Score: {interruptScore} / {iq.length}</p>
        <div style={{ background: interruptScore >= 4 ? '#d4edda' : '#fff3cd', padding: 20, borderRadius: 8 }}>
          {interruptScore >= 4 ? "Excellent! You correctly identified where human approval is needed in a clinical multi-agent system." : "Review which clinical actions are high-risk enough to require human approval."}
        </div>
      </div>
    );
  }

  const q = iq[currentInterrupt];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((currentInterrupt + 1) / iq.length) * 100}%` }} />
      </div>
      <h2>Part 2: Where Does Human Approval Go? ({currentInterrupt + 1}/{iq.length})</h2>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}><strong>Action:</strong> {q.action}</p>

      <p style={{ fontWeight: 'bold', marginTop: 16 }}>Does this action need interrupt() for human approval?</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={() => !interruptSubmitted && setInterruptAnswer(true)} disabled={interruptSubmitted} style={{
          padding: '12px 24px', borderRadius: 8, cursor: interruptSubmitted ? 'default' : 'pointer', fontSize: 16,
          border: `2px solid ${interruptSubmitted ? (q.needsInterrupt === true ? '#198754' : interruptAnswer === true ? '#dc3545' : '#dee2e6') : interruptAnswer === true ? '#0d6efd' : '#dee2e6'}`,
          background: interruptSubmitted ? (q.needsInterrupt === true ? '#d4edda' : interruptAnswer === true ? '#f8d7da' : '#fff') : '#fff'
        }}>Yes — needs human approval</button>
        <button onClick={() => !interruptSubmitted && setInterruptAnswer(false)} disabled={interruptSubmitted} style={{
          padding: '12px 24px', borderRadius: 8, cursor: interruptSubmitted ? 'default' : 'pointer', fontSize: 16,
          border: `2px solid ${interruptSubmitted ? (q.needsInterrupt === false ? '#198754' : interruptAnswer === false ? '#dc3545' : '#dee2e6') : interruptAnswer === false ? '#0d6efd' : '#dee2e6'}`,
          background: interruptSubmitted ? (q.needsInterrupt === false ? '#d4edda' : interruptAnswer === false ? '#f8d7da' : '#fff') : '#fff'
        }}>No — safe to automate</button>
      </div>

      {interruptAnswer !== null && !interruptSubmitted && (
        <button onClick={() => { setInterruptSubmitted(true); if (interruptAnswer === q.needsInterrupt) setInterruptScore(s => s + 1); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check</button>
      )}

      {interruptSubmitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p>{q.explanation}</p>
          <button onClick={() => { setCurrentInterrupt(c => c + 1); setInterruptAnswer(null); setInterruptSubmitted(false); }} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{currentInterrupt + 1 < iq.length ? 'Next Action' : 'See Results'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 6: Wrap-Up — Review & Consolidation

**Estimated time:** 20 minutes

---

### Instructor Introduction

"Let us step back and look at what you have accomplished today. You started by understanding when to use LangChain versus LangGraph versus raw API calls. Then you designed tools with the @tool decorator and saw how the agent loop handles everything automatically. You built stateful workflows with StateGraph — nodes, edges, conditional routing for clinical triage. You added memory that persists across sessions and survives failures. And you designed multi-agent systems with human-in-the-loop approval for high-stakes clinical decisions. That is a complete clinical agent architecture — from single tools to multi-agent workflows with human oversight. In Session 3 this would have taken hundreds of lines of manual code. Today you did it with frameworks designed for exactly this purpose."

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|---|---|---|
| 1 | LangChain v1 Foundations | create_agent, Runnables, LangChain vs LangGraph, when to use each | Choose the right tool: raw API for simple tasks, LangChain for agents, LangGraph for workflows |
| 2 | Tools & the Agent Loop | @tool decorator, tool design, agent loop (observe-reason-act), stopping conditions | Build clinical tools (drug lookup, interaction check) that agents call automatically |
| 3 | LangGraph — Stateful Workflows | StateGraph, nodes, edges, conditional routing, Command | Triage workflows that route patients to different specialists based on symptoms |
| 4 | Memory & Persistence | Threads, checkpointing (MemorySaver), long-term memory, context trimming | Conversations that persist across sessions, patient preferences that carry over |
| 5 | Multi-Agent Patterns & Human-in-the-Loop | Orchestrator-worker, handoff, interrupt(), shared state | Multi-specialist clinical teams with pharmacist/physician approval gates |

**Connecting the Dots:** This session built a complete agent architecture in layers. Lesson 1 gave you the framework foundations. Lesson 2 gave agents their capabilities (tools). Lesson 3 gave workflows their structure (StateGraph). Lesson 4 gave workflows their memory (persistence). Lesson 5 brought it all together with multi-agent coordination and human oversight. Each lesson built on the previous one — you cannot have meaningful multi-agent systems without stateful workflows, and you cannot have stateful workflows without tools and the agent loop. Compare this to Session 3: in Session 3 you built tool calling and memory manually with the raw OpenAI API. Today you built the same capabilities in far less code, and then went dramatically further — to stateful workflows, persistence, conditional routing, and human-in-the-loop — features that would have required hundreds of lines of custom code with the raw API.

---

### Common Mistakes & Gotchas

1. **Using deprecated LangChain patterns** — `ConversationChain`, `AgentExecutor`, and `LLMChain` are all deprecated. Use `create_agent` from `langgraph.prebuilt` and `StateGraph` from `langgraph.graph`. If you find old tutorials using these patterns, they are outdated.

2. **Vague tool descriptions** — The model chooses tools based entirely on their names and docstrings. A tool named `f1` with description "does stuff" will never be called correctly. Write tool descriptions as if you were explaining the tool to a new colleague who has never seen your codebase.

3. **Putting everything in one mega-agent instead of using StateGraph** — If your workflow has conditional branches (different paths for different patients), do not try to encode that logic in a single agent's system prompt. Use StateGraph with conditional edges — it is explicit, auditable, and debuggable.

4. **Forgetting to set iteration limits on agents** — An agent without a max iteration limit can loop indefinitely, calling tools that return errors, retrying, and burning tokens. Always configure a sensible maximum.

5. **Not using interrupt() for high-stakes clinical decisions** — If your system can recommend medication changes, treatment modifications, or emergency escalations, those actions MUST have human approval gates. An AI system that prescribes without human oversight is a liability, not a feature.

---

### Quick Self-Check (No-Code)

1. What is the difference between `create_agent` and `StateGraph`?
2. How does the `@tool` decorator generate the tool schema?
3. What is a thread in LangGraph, and how does it relate to checkpointing?
4. When should you use long-term memory versus short-term memory?
5. What does `interrupt()` do, and when should you use it in a clinical system?

<details>
<summary>Answers</summary>

1. `create_agent` creates a simple agent with an automatic tool-calling loop — good for Q&A with tools. `StateGraph` creates an explicit workflow with nodes, edges, and conditional routing — good for complex multi-step processes with branching logic.
2. The `@tool` decorator reads the function's name (tool name), docstring (description), and type hints (parameter schema) to automatically generate the JSON schema that the model uses to decide when and how to call the tool.
3. A thread is an execution context identified by a `thread_id` that scopes one conversation. Checkpointing saves the complete graph state after every node execution within a thread, enabling resume-after-failure and time-travel debugging.
4. Short-term memory (thread state) holds the current conversation — messages, tool results, intermediate state. Long-term memory (persistent store) holds cross-conversation knowledge — patient preferences, historical summaries, standing protocols. If it is useful beyond the current conversation, it belongs in long-term memory.
5. `interrupt()` pauses graph execution and sends a message to the application for human input. Use it before high-stakes clinical actions: starting new treatments, changing medications, escalating emergencies — any action where an error has patient safety consequences.
</details>

---

### NotebookLM Notebook

Create a NotebookLM notebook for this session:
1. Paste all 5 lesson summaries as text sources
2. Add the LangChain v1 documentation page and LangGraph documentation as URL sources
3. Generate an Audio Overview for pre-class listening
4. Use the notebook to quiz yourself on key concepts

---

### What's Next

In Session 6, you will learn Retrieval-Augmented Generation (RAG) — giving your agents access to large document collections. Instead of relying solely on the model's training data, RAG lets your agents search through clinical guidelines, drug formularies, and hospital protocols to ground their responses in authoritative sources. You will combine LangChain's retrieval tools with the agent and workflow patterns from today to build systems that cite their sources.

---

## SESSION 5 ASSIGNMENT: Clinical Agent Pipeline

**Due:** Before Session 6
**Estimated effort:** 4-6 hours
**Submission:** Push to your personal GitHub repo under `assignments/session-5/` and share the link with Dr. Iyad

---

### Clinical Scenario

> The KHCC oncology department wants a clinical agent system that helps physicians during patient consultations. The system should be able to look up patient records, check current medications, verify drug interactions, and route patients through a triage workflow based on their presenting symptoms. Currently, physicians must manually check multiple systems — the EHR for patient data, the pharmacy system for medications, and drug interaction databases for safety checks. This takes time during consultations and increases the risk of missing critical interactions. The department wants a unified conversational interface that handles all of this, with human approval required before any medication changes are recommended to the patient.

### Requirements

**Part 1 — Foundation (30%): LangChain Agent with Clinical Tools**
Build a LangChain agent using `create_agent` that:
- Uses `ChatOpenAI(model="gpt-4o-mini")` as the model
- Has 3 clinical tools built with the `@tool` decorator:
  - `lookup_patient(mrn: str)` — returns patient demographics, diagnosis, and current status (use simulated data)
  - `check_labs(mrn: str, lab_type: Optional[str] = None)` — returns recent lab results (use simulated data)
  - `check_medications(mrn: str)` — returns current active medication list (use simulated data)
- Demonstrates at least 3 multi-turn conversations where the agent uses multiple tools
- Must produce a working Colab notebook

**Part 2 — Application (30%): LangGraph StateGraph Workflow**
Convert the system to a LangGraph `StateGraph` with conditional routing:
- Define a `TriageState` using `TypedDict` with appropriate fields
- Build at least 4 nodes: `intake`, `assess_vitals`, `route_patient`, and separate specialist nodes
- Implement conditional routing: normal vitals route to `routine_followup`, abnormal vitals route to `specialist_consult`, critical vitals route to `emergency_handler`
- Enable checkpointing with `MemorySaver`
- Demonstrate the workflow handling at least 2 different patient scenarios that take different paths

**Part 3 — Analysis & Critical Thinking (20%)**
Write 300-400 words comparing the LangGraph approach (Part 2) versus the raw OpenAI tool calling approach from Session 3:
- **Complexity:** How many lines of code? How much boilerplate was eliminated?
- **Reliability:** Which approach handles errors better? What happens when a tool fails?
- **Maintainability:** Which is easier to modify when requirements change (e.g., adding a new specialist)?
- **Cost:** Does the framework add overhead in terms of API calls or tokens?
- Reference specific examples from your code, not generic observations.

**Part 4 — Stretch Challenge (20%)**
Choose one:
- **Human-in-the-loop:** Add `interrupt()` to your StateGraph so that when the pharmacy agent detects a major drug interaction, execution pauses for human pharmacist approval before proceeding. Demonstrate the pause-approve-resume flow.
- **Long-term memory:** Add a LangGraph memory store that remembers patient preferences (language preference, communication style, known allergies) across separate conversation threads. Demonstrate two separate conversations about the same patient where the second conversation retrieves preferences from the first.

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Code quality & correctness | 25% | Clean, runs without errors, proper use of LangChain/LangGraph v1 APIs | Runs with minor issues, some deprecated patterns | Broken, uses deprecated APIs, or incomplete |
| Clinical relevance | 25% | Realistic clinical workflow, meaningful triage logic, appropriate tool design | Clinically reasonable but generic | Abstract/disconnected from clinical context |
| Critical analysis (Part 3) | 25% | Specific code comparisons, identifies non-obvious tradeoffs, references own implementation | Surface-level comparison | Missing or generic "frameworks are better" |
| Stretch challenge (Part 4) | 25% | Creative, well-implemented, demonstrates understanding of interrupt() or memory stores | Attempted but shallow | Not attempted |

### Anti-Shortcut Rules
- Your clinical tools must return different simulated data than any demonstrated in class
- Your StateGraph must have a different structure than the triage example shown in the lesson
- Part 3 must include specific line counts and code snippets from YOUR implementation, not generic comparisons
- If choosing the human-in-the-loop stretch, demonstrate at least one approval AND one rejection scenario
- If choosing the memory stretch, the stored preferences must be clinically meaningful (not just "favorite color")
- Include a screenshot or text output showing your StateGraph processing at least one patient through the complete workflow

---

**KHCC connection:** This assignment mirrors the clinical decision support system being prototyped for KHCC outpatient oncology clinics, where physicians need real-time access to patient data, medication safety checks, and structured triage workflows during consultations. The human-in-the-loop pattern directly reflects KHCC pharmacy protocols where medication changes require pharmacist verification.
