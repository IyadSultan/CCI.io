# CCI Session 2: Python Basics + GitHub
## Curriculum — 5 Lessons + Wrap-Up

**Audience:** Completed Session 1 (Foundations, Transformers & Prompt Engineering). Students understand prompting patterns, transformers conceptually, but have never written Python code.
**Clinical Anchor:** Multi-domain — patient lab results processing, discharge summary analysis, medication reports, and cancer registry data (rotated across lessons)
**Session Duration:** 2 hours
**Lab Mode:** Guided step-by-step (Google Colab)
**Content/Practice Split:** 50/50
**Environment:** Google Colab notebooks (no local installation required)

---

## LESSON 1 OF 6: Python Fundamentals — Variables, Types & Control Flow

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"Welcome back, everyone. Last session you learned how to talk to AI models using prompts — today you learn how to talk to computers using Python. Don't worry if you've never written a line of code before. By the end of this lesson, you'll be able to store patient data in variables, make decisions with if-statements, and loop through a list of lab results. This is the foundation everything else in this course builds on."

---

### NotebookLM Summary

Python is a general-purpose programming language widely used in healthcare informatics, data science, and AI development. It reads almost like English, making it one of the most accessible languages for clinicians and researchers entering the world of clinical AI.

At its core, Python works with variables and data types. A variable is simply a name that holds a value — for example, `patient_name = "Ahmad"` stores a text string, while `hemoglobin = 12.5` stores a decimal number. Python has several fundamental types: strings (text), integers (whole numbers), floats (decimals), booleans (True/False), lists (ordered collections), and dictionaries (key-value pairs). In clinical contexts, a dictionary is particularly useful — you can represent a patient record as `{"mrn": "P-10234", "name": "Ahmad", "hgb": 12.5, "wbc": 6.2}`.

Control flow lets your code make decisions. An `if` statement checks a condition and runs code only when that condition is true — for example, flagging a hemoglobin value below 10 as abnormal. `for` loops let you repeat an action across a collection, such as checking every patient's lab result in a list. `while` loops continue until a condition changes.

These concepts connect directly to what you learned in Session 1. When you wrote prompts asking an LLM to classify a lab result as normal or abnormal, the LLM was essentially performing the same logic that an `if` statement does — but now you control that logic explicitly. In the next lessons, you will combine Python logic with structured notebooks, classes, and pandas DataFrames to build complete clinical data pipelines.

A practical example: given a list of five patients' WBC counts, you can write a three-line `for` loop that prints a warning for any count above 11.0 or below 4.0 — something that would take manual chart review for each patient. This is the power of Python in clinical informatics.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "A patient's MRN is stored as mrn = \"P-10234\". What is the data type of mrn?",
    options: ["Integer", "Float", "String", "Boolean"],
    correct: 2,
    explanation: "Text enclosed in quotes is a string in Python. MRNs contain letters and dashes, so they must be stored as strings, not numbers."
  },
  {
    question: "You write: hemoglobin = 9.8. Which Python statement correctly flags this as critically low (below 10)?",
    options: [
      "if hemoglobin < 10: print('Critical')",
      "if hemoglobin == low: print('Critical')",
      "when hemoglobin < 10 then print('Critical')",
      "check(hemoglobin < 10)"
    ],
    correct: 0,
    explanation: "Python uses 'if condition:' syntax with a colon and indented block. The comparison operator < checks if hemoglobin is less than 10."
  },
  {
    question: "You have a list: wbc_counts = [4.2, 11.5, 6.8, 3.1, 7.0]. How do you loop through every value?",
    options: [
      "for wbc in wbc_counts:",
      "loop wbc_counts as wbc:",
      "foreach(wbc_counts):",
      "while wbc in wbc_counts:"
    ],
    correct: 0,
    explanation: "Python's for-in loop iterates through each element in a list. 'for wbc in wbc_counts:' assigns each value to 'wbc' one at a time."
  },
  {
    question: "A patient record is stored as: patient = {\"name\": \"Sara\", \"age\": 45, \"diagnosis\": \"AML\"}. How do you access the diagnosis?",
    options: [
      "patient.diagnosis",
      "patient[\"diagnosis\"]",
      "patient(diagnosis)",
      "patient->diagnosis"
    ],
    correct: 1,
    explanation: "Python dictionaries use bracket notation with the key as a string: patient[\"diagnosis\"] returns \"AML\"."
  },
  {
    question: "You want to check if a platelet count is BOTH below 150 AND the patient is on chemotherapy (on_chemo = True). Which is correct?",
    options: [
      "if platelets < 150 and on_chemo:",
      "if platelets < 150 & on_chemo:",
      "if platelets < 150 AND on_chemo == True:",
      "if (platelets < 150, on_chemo):"
    ],
    correct: 0,
    explanation: "Python uses the keyword 'and' (lowercase) for logical AND. You don't need '== True' for booleans — 'on_chemo' alone evaluates to True."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <div className="bg-green-500 h-4 rounded-full" style={{width: `${(score/questions.length)*100}%`}}></div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

**Type:** Code Fixer — students identify and fix broken Python code involving patient data.

```jsx
import React, { useState } from 'react';

const challenges = [
  {
    title: "Fix the Patient Dictionary",
    broken: `patient = {"name": "Ahmad", "age" 45, "diagnosis": "CML"}
print(patient["name"])`,
    hint: "Look at the dictionary syntax — every key-value pair needs a separator.",
    answer: `patient = {"name": "Ahmad", "age": 45, "diagnosis": "CML"}
print(patient["name"])`,
    explanation: "Missing colon after \"age\". Dictionary entries use key: value format."
  },
  {
    title: "Fix the Lab Check Loop",
    broken: `lab_results = [12.5, 9.1, 14.2, 7.8, 11.0]
for hgb in lab_results
  if hgb < 10:
    print("Low hemoglobin:", hgb)`,
    hint: "Python for-loops need something at the end of the line. Also check indentation.",
    answer: `lab_results = [12.5, 9.1, 14.2, 7.8, 11.0]
for hgb in lab_results:
  if hgb < 10:
    print("Low hemoglobin:", hgb)`,
    explanation: "Missing colon at end of 'for' line. Python requires ':' after for, if, while, def, and class statements."
  },
  {
    title: "Fix the Condition Check",
    broken: `platelets = 120
on_chemo = True
if platelets < 150 or on_chemo = True:
    print("Monitor closely")`,
    hint: "There are two issues: the logical check and the comparison operator.",
    answer: `platelets = 120
on_chemo = True
if platelets < 150 and on_chemo == True:
    print("Monitor closely")`,
    explanation: "Two fixes: (1) 'or' should be 'and' — we want BOTH conditions true. (2) Single '=' is assignment, '==' is comparison."
  }
];

export default function CodeFixer() {
  const [current, setCurrent] = useState(0);
  const [userCode, setUserCode] = useState(challenges[0].broken);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(0);

  const check = () => {
    const normalized = userCode.replace(/\s+/g, ' ').trim();
    const expected = challenges[current].answer.replace(/\s+/g, ' ').trim();
    if (normalized === expected) {
      setSolved(s => s + 1);
      setShowAnswer(true);
    } else {
      setShowHint(true);
    }
  };

  const next = () => {
    if (current + 1 < challenges.length) {
      setCurrent(c => c + 1);
      setUserCode(challenges[current + 1].broken);
      setShowHint(false);
      setShowAnswer(false);
    }
  };

  const c = challenges[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Code Fixer: {c.title}</h2>
      <p className="text-sm text-gray-500 mb-4">Challenge {current+1} of {challenges.length} | Solved: {solved}</p>
      <textarea value={userCode} onChange={e => setUserCode(e.target.value)}
        className="w-full h-32 font-mono text-sm p-3 border rounded bg-gray-900 text-green-400"
        spellCheck={false} />
      <div className="flex gap-2 mt-3">
        <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check</button>
        <button onClick={() => setShowHint(true)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Hint</button>
        <button onClick={() => { setShowAnswer(true); setUserCode(c.answer); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Show Answer</button>
      </div>
      {showHint && !showAnswer && <p className="mt-3 p-3 bg-yellow-50 rounded text-sm">{c.hint}</p>}
      {showAnswer && (
        <div className="mt-3 p-3 bg-green-50 rounded">
          <p className="text-sm font-semibold text-green-800">Correct!</p>
          <p className="text-sm mt-1">{c.explanation}</p>
          {current + 1 < challenges.length && (
            <button onClick={next} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Next Challenge</button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### Student Study Guide

**Before Class — Preparation (15–20 min)**
- Watch: Google's "What is Python?" intro (5 min) or listen to the Session 1 wrap-up NotebookLM audio
- Warm-up question: *A nurse checks 20 patients' hemoglobin levels every morning and flags any below 10 g/dL. How would you automate this if you could write instructions a computer could follow?*

**During Class — What to Focus On**
- Make sure you understand the difference between strings, integers, floats, and booleans
- Make sure you understand when to use a list vs. a dictionary
- Make sure you can write an `if` statement with a comparison operator
- Common trap: Don't confuse `=` (assignment) with `==` (comparison)

**After Class — Practice & Lab Work**
- **Lab work (required):** Open the Colab notebook shared in class. Complete all TODO cells: create patient variables, write a lab result checker loop, and build a patient dictionary. Run all cells and verify output matches expected results. Estimated time: 15 min.
- **Extra practice:** Modify the loop to also flag WBC counts outside 4.0–11.0 range.
- **Self-check:**
  1. What data type would you use to store a patient's MRN?
  2. How do you access a value from a dictionary?
  3. What's the difference between `for` and `while`?

**Resources**
- [Python Official Tutorial — Informal Introduction](https://docs.python.org/3/tutorial/introduction.html)
- Session 2 NotebookLM review notebook (link provided after class)

---

### Lab Exercise

**Title:** Your First Clinical Python Notebook
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> You are a data analyst at KHCC and receive a daily list of 10 patients with their hemoglobin and WBC counts. You need to flag abnormal values automatically instead of checking them manually.

**Objective:**
By the end of this lab, students will have a working Colab notebook that stores patient data in variables and dictionaries, loops through lab results, and prints clinical alerts.

**Setup:**
```
1. Open Google Colab: https://colab.research.google.com
2. Create a new notebook: File → New Notebook
3. Rename it: "Session2_Lab1_Python_Fundamentals.ipynb"
```

**Step-by-step instructions:**
1. **Cell 1 — Variables:** Create variables for a single patient: `patient_name` (string), `mrn` (string), `hemoglobin` (float), `wbc` (float), `on_chemo` (boolean). Print them all.
2. **Cell 2 — Dictionary:** Store the same patient as a dictionary with keys: name, mrn, hgb, wbc, on_chemo. Access and print each value.
3. **Cell 3 — List of patients:** Create a list of 5 dictionaries, each representing a patient with different lab values (some normal, some abnormal).
4. **Cell 4 — Alert loop:** Write a `for` loop that iterates through the patient list and prints a warning if hemoglobin < 10 or WBC > 11.
5. **Cell 5 — Summary:** Print a count of how many patients have abnormal values.

**Expected output:**
```
ALERT: Patient Ahmad — Hemoglobin 9.1 (LOW)
ALERT: Patient Sara — WBC 12.3 (HIGH)
Summary: 2 of 5 patients have abnormal values
```

**Stretch challenge:**
Add a severity classification: hemoglobin < 7 = "CRITICAL", 7–10 = "LOW", 10+ = "NORMAL".

**KHCC connection:**
> This mirrors the daily lab review process used by the AIDI team to flag abnormal results before morning rounds.

---
---

## LESSON 2 OF 6: Building a Robust Colab Notebook — The Clinical Notebook Template

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Now that you can write basic Python, let me show you how professionals structure their notebooks. If you've ever opened someone's messy Jupyter notebook with 50 unnamed cells and no comments — you know the pain. In clinical informatics, a well-structured notebook isn't just nice to have, it's a safety requirement. We're going to build a template notebook with clear sections: installations, imports, configs, prompts, functions, main code, CSV output, email, and a markdown summary. Every notebook you build in this course will follow this structure."

---

### NotebookLM Summary

A well-structured Colab notebook is the clinical informaticist's equivalent of a well-organized patient chart. Just as a chart has standard sections — chief complaint, history, assessment, plan — a professional Python notebook follows a predictable structure that makes it readable, reproducible, and safe to share.

The standard clinical notebook template has nine sections, each in its own cell or group of cells. First, **Package Installations** — a cell at the very top that installs any external libraries not available by default in Colab, using `!pip install` commands. Second, **Imports** — all `import` statements grouped together so anyone can see at a glance what libraries the notebook depends on. Third, **Configuration** — constants like file paths, API keys (stored securely), model names, thresholds, and date ranges. This is the only section that changes between runs. Fourth, **Prompts** — if the notebook calls an LLM, all prompt templates are defined here as multi-line strings, never buried in function bodies. Fifth, **Functions** — reusable blocks of code defined with `def`. Functions should do one thing and have clear names like `flag_abnormal_labs()` or `generate_report()`. Sixth, **Main Code** — the execution logic that calls functions, processes data, and produces results. Seventh, **Build CSV** — code that exports results to a structured CSV file for downstream use. Eighth, **Email** — code to send the results or summary via email (using SMTP or Azure Communication Services at KHCC). Ninth, **Markdown Summary** — a final markdown cell that summarizes what the notebook did, what inputs it used, and what outputs it produced.

This structure matters because in clinical settings, another team member, an auditor, or your future self needs to understand what the notebook does without running it. The configuration section makes it easy to change parameters without touching logic. Separating prompts from functions ensures prompt engineering changes don't accidentally break code. And the markdown summary serves as built-in documentation.

At KHCC, the AIDI team follows this exact template for all production notebooks that run on Databricks, and adapting it for Colab ensures students develop habits that transfer directly to the workplace.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "Where should you put '!pip install pandas openpyxl' in a clinical notebook?",
    options: [
      "In the very first cell — Package Installations section",
      "Right before the cell that uses pandas",
      "At the end of the notebook",
      "In the Imports section alongside import statements"
    ],
    correct: 0,
    explanation: "All pip installs go in the first cell so the notebook installs everything upfront. This prevents failures mid-execution and makes dependencies visible."
  },
  {
    question: "You have an API key for Azure OpenAI. Where does it belong in the notebook template?",
    options: [
      "Hardcoded in the function that calls the API",
      "In the Configuration section as a variable (or loaded from environment/secrets)",
      "In the Imports section",
      "In a comment at the top of the notebook"
    ],
    correct: 1,
    explanation: "API keys belong in the Configuration section. In production, they should be loaded from environment variables or Colab secrets — never hardcoded in function bodies."
  },
  {
    question: "Why should LLM prompt templates be in their own section rather than inside functions?",
    options: [
      "Python doesn't allow strings inside functions",
      "It makes prompts easy to review, version, and modify without touching code logic",
      "Prompt strings are too long for function bodies",
      "It makes the notebook run faster"
    ],
    correct: 1,
    explanation: "Separating prompts from logic means you can iterate on prompt engineering without risk of breaking code. It also makes prompt review and auditing straightforward."
  },
  {
    question: "A colleague sends you a notebook with no markdown summary at the end. Why is this a problem in clinical informatics?",
    options: [
      "The notebook won't run without it",
      "It violates Python syntax rules",
      "Reviewers and auditors can't understand what the notebook did without running it",
      "The CSV export will fail"
    ],
    correct: 2,
    explanation: "In clinical settings, notebooks must be auditable. A markdown summary provides a human-readable record of inputs, outputs, and purpose without requiring execution."
  },
  {
    question: "Which section of the notebook template should contain: thresholds = {'hgb_low': 10.0, 'wbc_high': 11.0}?",
    options: [
      "Functions",
      "Main Code",
      "Configuration",
      "Imports"
    ],
    correct: 2,
    explanation: "Clinical thresholds are configuration values — they may change between hospitals or protocols. Keeping them in Configuration makes them easy to adjust without modifying logic."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <div className="bg-green-500 h-4 rounded-full" style={{width: `${(score/questions.length)*100}%`}}></div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

**Type:** Pipeline Designer — students arrange notebook sections in correct order.

```jsx
import React, { useState } from 'react';

const correctOrder = [
  "Package Installations (!pip install ...)",
  "Imports (import pandas, import os, ...)",
  "Configuration (API keys, thresholds, paths)",
  "Prompts (LLM prompt templates)",
  "Functions (def flag_labs(), def generate_report(), ...)",
  "Main Code (execute pipeline)",
  "Build CSV (export results to file)",
  "Email (send results via SMTP/Azure)",
  "Markdown Summary (document what was done)"
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NotebookOrderer() {
  const [items, setItems] = useState(() => shuffle(correctOrder));
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);

  const moveItem = (from, to) => {
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
    setChecked(false);
  };

  const isCorrect = items.every((item, idx) => item === correctOrder[idx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Notebook Section Organizer</h2>
      <p className="text-sm text-gray-600 mb-4">Drag the sections into the correct order for a clinical Python notebook. Use the arrow buttons to move items up/down.</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item} className={`flex items-center gap-2 p-3 rounded border ${
            checked ? (item === correctOrder[idx] ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') : 'bg-white border-gray-300'
          }`}>
            <span className="text-gray-400 font-mono w-6">{idx + 1}.</span>
            <span className="flex-1 text-sm">{item}</span>
            <div className="flex flex-col">
              <button onClick={() => idx > 0 && moveItem(idx, idx-1)} className="text-xs px-1 hover:bg-gray-100 rounded" disabled={idx === 0}>▲</button>
              <button onClick={() => idx < items.length-1 && moveItem(idx, idx+1)} className="text-xs px-1 hover:bg-gray-100 rounded" disabled={idx === items.length-1}>▼</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setChecked(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check Order</button>
        <button onClick={() => { setItems(shuffle(correctOrder)); setChecked(false); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Shuffle</button>
      </div>
      {checked && isCorrect && <p className="mt-3 p-3 bg-green-100 rounded text-green-800 font-semibold">Perfect! This is the standard clinical notebook template.</p>}
      {checked && !isCorrect && <p className="mt-3 p-3 bg-yellow-100 rounded text-yellow-800">Not quite — look at the red items and think about dependencies. Installations must come before imports, imports before config, etc.</p>}
    </div>
  );
}
```

---

### Student Study Guide

**Before Class — Preparation (15–20 min)**
- Open Google Colab and create a blank notebook to make sure you can access it
- Warm-up question: *You receive a messy notebook from a colleague with 40 cells, no comments, and the API key hardcoded on line 237. What could go wrong?*

**During Class — What to Focus On**
- Make sure you understand why each section exists and what goes in it
- Make sure you understand the difference between Configuration and Main Code
- Make sure you can write a Python function with `def`
- Common trap: Don't put `!pip install` inside a function — it belongs in the installations cell only

**After Class — Practice & Lab Work**
- **Lab work (required):** Complete the template notebook in Colab. All 9 sections must have at least one cell with working code. The notebook should process 5 mock patients and export a CSV. Run all cells top-to-bottom and screenshot the final output. Estimated time: 20 min.
- **Extra practice:** Add a 10th section "Logging" that timestamps each major step.
- **Self-check:**
  1. In which section do you define clinical thresholds?
  2. Why should prompts be separate from functions?
  3. What is the purpose of the Markdown Summary section?

**Resources**
- [Google Colab Welcome Notebook](https://colab.research.google.com/notebooks/intro.ipynb)
- [PEP 8 — Python Style Guide](https://peps.python.org/pep-0008/)

---

### Lab Exercise

**Title:** Build the KHCC Clinical Notebook Template
**Duration:** 13 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> The AIDI team needs a standardized notebook template that every data analyst uses when processing daily lab results. You're building the template that will become the team standard.

**Objective:**
By the end of this lab, students will have a complete 9-section Colab notebook template that processes mock patient data and exports results.

**Setup:**
```
1. Open Google Colab
2. Create a new notebook: "Session2_Lab2_Notebook_Template.ipynb"
```

**Step-by-step instructions:**
1. **Cell 1 — Installations (Markdown header + code):**
   ```python
   # === SECTION 1: PACKAGE INSTALLATIONS ===
   !pip install openpyxl -q
   ```
2. **Cell 2 — Imports:**
   ```python
   # === SECTION 2: IMPORTS ===
   import csv
   import os
   from datetime import datetime
   ```
3. **Cell 3 — Configuration:**
   ```python
   # === SECTION 3: CONFIGURATION ===
   HGB_LOW = 10.0
   WBC_HIGH = 11.0
   WBC_LOW = 4.0
   OUTPUT_FILE = "lab_alerts.csv"
   REPORT_DATE = datetime.now().strftime("%Y-%m-%d")
   ```
4. **Cell 4 — Prompts** (placeholder for future LLM integration):
   ```python
   # === SECTION 4: PROMPTS ===
   SUMMARY_PROMPT = """Summarize the following lab results for a morning report:
   {lab_data}
   Focus on critical values and trends."""
   ```
5. **Cell 5 — Functions:**
   ```python
   # === SECTION 5: FUNCTIONS ===
   def check_labs(patient):
       alerts = []
       if patient["hgb"] < HGB_LOW:
           alerts.append(f"Low HGB: {patient['hgb']}")
       if patient["wbc"] > WBC_HIGH or patient["wbc"] < WBC_LOW:
           alerts.append(f"Abnormal WBC: {patient['wbc']}")
       return alerts

   def format_alert(patient, alerts):
       return f"ALERT [{REPORT_DATE}] {patient['name']} (MRN: {patient['mrn']}): {', '.join(alerts)}"
   ```
6. **Cell 6 — Main Code:**
   ```python
   # === SECTION 6: MAIN CODE ===
   patients = [
       {"name": "Ahmad", "mrn": "P-1001", "hgb": 9.1, "wbc": 6.2},
       {"name": "Sara", "mrn": "P-1002", "hgb": 13.5, "wbc": 12.3},
       {"name": "Khaled", "mrn": "P-1003", "hgb": 7.8, "wbc": 3.5},
       {"name": "Lina", "mrn": "P-1004", "hgb": 11.2, "wbc": 7.1},
       {"name": "Omar", "mrn": "P-1005", "hgb": 8.5, "wbc": 9.8},
   ]

   results = []
   for patient in patients:
       alerts = check_labs(patient)
       if alerts:
           msg = format_alert(patient, alerts)
           print(msg)
           results.append({"name": patient["name"], "mrn": patient["mrn"], "alerts": "; ".join(alerts)})
   ```
7. **Cell 7 — Build CSV:**
   ```python
   # === SECTION 7: BUILD CSV ===
   with open(OUTPUT_FILE, "w", newline="") as f:
       writer = csv.DictWriter(f, fieldnames=["name", "mrn", "alerts"])
       writer.writeheader()
       writer.writerows(results)
   print(f"Saved {len(results)} alerts to {OUTPUT_FILE}")
   ```
8. **Cell 8 — Email** (placeholder):
   ```python
   # === SECTION 8: EMAIL ===
   # In production, this would use Azure Communication Services:
   # from azure.communication.email import EmailClient
   # For now, we simulate:
   print(f"EMAIL SIMULATED: {len(results)} alerts would be sent to lab-team@khcc.jo")
   ```
9. **Cell 9 — Markdown Summary** (Markdown cell):
   ```markdown
   ## Notebook Summary
   - **Purpose:** Daily lab result screening for abnormal values
   - **Date:** [auto-filled by REPORT_DATE]
   - **Input:** 5 patient records (mock data)
   - **Output:** lab_alerts.csv with flagged patients
   - **Thresholds:** HGB < 10.0, WBC outside 4.0–11.0
   - **Author:** [Your Name]
   ```

**Expected output:**
```
ALERT [2026-03-27] Ahmad (MRN: P-1001): Low HGB: 9.1
ALERT [2026-03-27] Sara (MRN: P-1002): Abnormal WBC: 12.3
ALERT [2026-03-27] Khaled (MRN: P-1003): Low HGB: 7.8, Abnormal WBC: 3.5
ALERT [2026-03-27] Omar (MRN: P-1005): Low HGB: 8.5
Saved 4 alerts to lab_alerts.csv
EMAIL SIMULATED: 4 alerts would be sent to lab-team@khcc.jo
```

**Stretch challenge:**
Add a cell between Email and Summary that generates a markdown table of all alerts (formatted for pasting into a Slack message).

**KHCC connection:**
> This template mirrors the standardized notebook structure used by the AIDI team for all production Databricks notebooks. Adopting it in Colab builds the right habits before students move to cloud environments.

---
---

## LESSON 3 OF 6: Python Classes — Modeling Clinical Data with Objects

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"So far you've used dictionaries to represent patients — and that works fine for simple cases. But what happens when you have a patient who also has a list of medications, a treatment history, and you want to calculate their risk score? Dictionaries get messy fast. Classes let you create your own data types. Instead of a dictionary, you'll have a `Patient` object with built-in behaviors — like a method that calculates whether their labs are critical. Think of a class as a blueprint for a smart medical record."

---

### NotebookLM Summary

Python classes are the building blocks of object-oriented programming, and they solve a specific problem that becomes apparent as clinical data grows more complex. When you represent a patient as a dictionary, there is nothing preventing you from accidentally misspelling a key, adding inconsistent fields, or forgetting to include required data. A class provides a structured blueprint that defines exactly what a patient object looks like and what it can do.

A class is defined using the `class` keyword, followed by the class name (conventionally in CamelCase, like `Patient` or `LabResult`). The `__init__` method is the constructor — it runs when you create a new object and sets up the initial state. Instance variables (like `self.name`, `self.mrn`, `self.hemoglobin`) store the data for each specific object. Methods are functions defined inside the class that can access and manipulate that data using `self`.

For clinical informatics, classes are powerful because they encapsulate both data and behavior. A `Patient` class can store demographics, lab values, and medications, while also providing methods like `is_critical()`, `flag_abnormal_labs()`, or `generate_summary()`. This means the logic for checking whether a patient is critical lives with the patient data, not scattered across notebook cells.

A practical example: instead of writing `if patient["hgb"] < 10` every time you check hemoglobin, you define a method `patient.is_anemic()` once inside the class, and then call it wherever needed. If the threshold changes, you update it in one place.

Classes also enable inheritance — a `OncologyPatient` class can extend `Patient` with cancer-specific attributes like staging, tumor site, and treatment protocol, while inheriting all the base methods. This maps naturally to how clinical systems organize patient data into general and specialty-specific records.

Understanding classes is essential for the later sessions where students will build Django web applications (Session 11), as Django models are Python classes that map to database tables.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What does 'self' refer to inside a Python class method?",
    options: [
      "The class definition itself",
      "The specific instance (object) calling the method",
      "The Python interpreter",
      "The parent class"
    ],
    correct: 1,
    explanation: "'self' refers to the specific instance of the class. When you write patient1.is_critical(), 'self' inside the method points to patient1's data."
  },
  {
    question: "You define: class Patient: and then def __init__(self, name, mrn):. What happens when you write p = Patient('Ahmad', 'P-1001')?",
    options: [
      "Python defines a new class called 'p'",
      "Python calls __init__ and creates a new Patient object with name='Ahmad' and mrn='P-1001'",
      "Python prints the patient information",
      "An error occurs because you need to call __init__ directly"
    ],
    correct: 1,
    explanation: "Patient('Ahmad', 'P-1001') calls __init__ automatically, creating a new Patient instance. You never call __init__ directly."
  },
  {
    question: "Inside a Patient class, you write: def is_anemic(self): return self.hemoglobin < 10. How do you use this for patient p?",
    options: [
      "is_anemic(p)",
      "Patient.is_anemic(p.hemoglobin)",
      "p.is_anemic()",
      "p.is_anemic(self)"
    ],
    correct: 2,
    explanation: "Instance methods are called with dot notation: p.is_anemic(). Python automatically passes 'p' as 'self' — you don't pass it yourself."
  },
  {
    question: "Why is a Patient class better than a dictionary for representing complex patient data?",
    options: [
      "Classes use less memory",
      "Classes enforce structure, prevent typos in field names, and bundle data with behavior",
      "Dictionaries can't store numbers",
      "Classes run faster than dictionaries"
    ],
    correct: 1,
    explanation: "Classes define a fixed structure (what attributes exist), provide validation in __init__, and attach methods (behavior) to the data. Dictionaries are flexible but unstructured."
  },
  {
    question: "An OncologyPatient class inherits from Patient. Which statement is correct?",
    options: [
      "OncologyPatient cannot have its own methods",
      "OncologyPatient gets all Patient methods and can add cancer-specific ones like tumor_stage()",
      "Patient and OncologyPatient share the same __init__",
      "Inheritance means both classes are identical"
    ],
    correct: 1,
    explanation: "Inheritance means OncologyPatient starts with everything Patient has, then adds or overrides methods for oncology-specific needs."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

**Type:** Flashcard Deck — key OOP terms with clinical examples.

```jsx
import React, { useState } from 'react';

const cards = [
  { front: "Class", back: "A blueprint for creating objects. Example: class Patient: defines what every patient object looks like." },
  { front: "__init__", back: "The constructor method — runs automatically when you create a new object. Sets up initial attributes like self.name, self.mrn." },
  { front: "self", back: "Refers to the specific instance calling the method. In p.is_critical(), self = p." },
  { front: "Instance variable", back: "Data stored on a specific object. self.hemoglobin = 12.5 means THIS patient's hemoglobin is 12.5." },
  { front: "Method", back: "A function defined inside a class. Example: def is_anemic(self): return self.hemoglobin < 10" },
  { front: "Inheritance", back: "A class can extend another. class OncologyPatient(Patient): inherits all Patient attributes and methods." },
  { front: "Encapsulation", back: "Bundling data and behavior together. A Patient object contains BOTH its data and the logic to check it." },
  { front: "Object / Instance", back: "A specific thing created from a class blueprint. p = Patient('Ahmad', 'P-1001') — p is an instance of Patient." }
];

export default function Flashcards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const next = (isKnown) => {
    if (isKnown) setKnown(k => k + 1);
    setFlipped(false);
    setIdx(i => (i + 1) % cards.length);
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <p className="text-sm text-gray-500 mb-2">Card {idx+1} of {cards.length} | Known: {known}</p>
      <div onClick={() => setFlipped(!flipped)}
        className="cursor-pointer border-2 rounded-lg p-8 min-h-[200px] flex items-center justify-center transition-all hover:shadow-lg"
        style={{backgroundColor: flipped ? '#f0fdf4' : '#eff6ff'}}>
        <div>
          <p className="text-xs text-gray-400 mb-2">{flipped ? 'DEFINITION' : 'TERM'}</p>
          <p className={`${flipped ? 'text-base' : 'text-2xl font-bold'}`}>
            {flipped ? cards[idx].back : cards[idx].front}
          </p>
          {!flipped && <p className="text-xs text-gray-400 mt-4">Click to flip</p>}
        </div>
      </div>
      {flipped && (
        <div className="flex gap-2 justify-center mt-4">
          <button onClick={() => next(false)} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Still Learning</button>
          <button onClick={() => next(true)} className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">Got It!</button>
        </div>
      )}
    </div>
  );
}
```

---

### Student Study Guide

**Before Class — Preparation (15–20 min)**
- Review the Patient dictionary from Lesson 1 — think about what's missing (validation, methods, structure)
- Warm-up question: *If you could add a "button" to a patient record that automatically calculated whether the patient's labs are critical, how would that work?*

**During Class — What to Focus On**
- Make sure you understand the relationship between a class (blueprint) and an object (instance)
- Make sure you understand why `self` appears as the first parameter in every method
- Make sure you can write a class with `__init__` and at least one custom method
- Common trap: Don't forget `self` — writing `def is_critical():` without `self` will cause errors when called on an instance

**After Class — Practice & Lab Work**
- **Lab work (required):** Complete the Patient and OncologyPatient classes in Colab. Create 5 patient objects and call methods on each. Push notebook to GitHub. Estimated time: 15 min.
- **Extra practice:** Add a `Medication` class with attributes for drug name, dose, and frequency, and a method that checks for common interactions.
- **Self-check:**
  1. What is the difference between a class and an instance?
  2. Why do we use `self.hemoglobin` instead of just `hemoglobin` inside a class?
  3. What does inheritance allow you to do?

**Resources**
- [Python Classes Tutorial](https://docs.python.org/3/tutorial/classes.html)

---

### Lab Exercise

**Title:** Building a Patient Class Hierarchy
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> The AIDI team is building a Python-based patient data model that will be used across multiple clinical AI applications. You need to create a base Patient class and an OncologyPatient subclass.

**Objective:**
By the end of this lab, students will have a working Patient class with clinical methods and an OncologyPatient subclass with cancer-specific attributes.

**Setup:**
```
1. Open Google Colab
2. Create: "Session2_Lab3_Classes.ipynb"
3. Follow the 9-section template from Lesson 2
```

**Step-by-step instructions:**
1. **Define the Patient class** with `__init__` accepting: name, mrn, age, hemoglobin, wbc, medications (list)
2. **Add methods:**
   - `is_anemic()` → returns True if hemoglobin < 10
   - `has_abnormal_wbc()` → returns True if WBC outside 4.0–11.0
   - `get_alerts()` → returns a list of alert strings
   - `summary()` → returns a formatted string with all patient info
3. **Define OncologyPatient(Patient)** subclass adding: tumor_site, stage, treatment_protocol
4. **Add methods to OncologyPatient:**
   - `is_neutropenic()` → returns True if WBC < 1.5 (chemo-related risk)
   - `summary()` → override parent to include oncology-specific info
5. **Create 5 OncologyPatient objects** with varied data, loop through them, and print summaries and alerts.

**Expected output:**
```
Patient: Ahmad (P-1001) | Age: 58 | Tumor: Lung, Stage III
  Alerts: Low hemoglobin (9.1), Neutropenic (WBC 1.2)
Patient: Sara (P-1002) | Age: 34 | Tumor: Breast, Stage I
  Alerts: None
...
```

**Stretch challenge:**
Add a `__str__` method to both classes so `print(patient)` outputs the summary directly.

**KHCC connection:**
> This class hierarchy mirrors the data models used in AIDI-DB where patient records are organized into base demographic tables and specialty-specific extension tables.

---
---

## LESSON 4 OF 6: Pandas Essentials — DataFrames, Analysis & Merging Clinical Datasets

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Everything you've built so far uses lists and dictionaries — and that's fine for 5 patients. But what about 5,000? Or 50,000? This is where pandas comes in. Pandas gives you a DataFrame — think of it as a programmable spreadsheet. You can load a CSV with one line of code, filter patients by diagnosis, calculate average lab values, and merge two datasets together. If you've ever spent hours doing VLOOKUPs in Excel, pandas is about to change your life."

---

### NotebookLM Summary

Pandas is the most important data manipulation library in Python for clinical informatics. It provides the DataFrame, a two-dimensional table similar to an Excel spreadsheet or a SQL table, but with programmable operations that can process thousands or millions of rows in seconds.

A DataFrame is created from various sources: a CSV file (`pd.read_csv()`), a list of dictionaries, an Excel file, or a SQL query. Each column is a Series — a one-dimensional array with a label. You access columns with bracket notation (`df["hemoglobin"]`) or dot notation (`df.hemoglobin`). Rows can be filtered using boolean conditions: `df[df["hemoglobin"] < 10]` returns only patients with low hemoglobin.

Key operations every clinical data analyst needs include: `df.describe()` for summary statistics, `df.groupby("diagnosis").mean()` for aggregating by category, `df.sort_values("hemoglobin")` for ordering, and `df.isna().sum()` for counting missing values — a critical quality check in clinical data.

Merging datasets is one of the most powerful pandas operations and maps directly to SQL joins. In clinical settings, patient data is often spread across multiple tables: demographics in one, lab results in another, medications in a third. `pd.merge(demographics, labs, on="mrn")` combines them using the MRN as a key, just like a SQL JOIN. The `how` parameter controls the join type: "inner" (only matching MRNs), "left" (keep all patients from the first table), "outer" (keep everything). Understanding merge types is essential because choosing the wrong one can silently drop patients from your analysis.

A common clinical example: merging a patient demographics table with a lab results table and a medications table to create a unified view for analysis. This is exactly how the AIDI team builds analysis datasets from the Azure SQL database, where data is normalized across multiple tables.

Pandas also provides `concat()` for stacking DataFrames vertically (e.g., combining monthly lab exports) and `pivot_table()` for reshaping data (e.g., converting a long-format lab results table into a wide format with one row per patient and columns for each lab type).

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You have a DataFrame 'df' with columns: mrn, name, hemoglobin, wbc. How do you get only patients with hemoglobin below 10?",
    options: [
      "df.filter(hemoglobin < 10)",
      "df[df['hemoglobin'] < 10]",
      "df.where('hemoglobin', '<', 10)",
      "df.select(hemoglobin < 10)"
    ],
    correct: 1,
    explanation: "Pandas uses boolean indexing: df[df['hemoglobin'] < 10] creates a True/False mask and returns only rows where the condition is True."
  },
  {
    question: "You have two DataFrames: 'patients' (mrn, name, age) and 'labs' (mrn, hemoglobin, wbc). How do you combine them?",
    options: [
      "patients + labs",
      "pd.concat([patients, labs])",
      "pd.merge(patients, labs, on='mrn')",
      "patients.append(labs)"
    ],
    correct: 2,
    explanation: "pd.merge() joins two DataFrames on a shared column (mrn). concat() stacks vertically, which would be wrong here since the columns are different."
  },
  {
    question: "After merging patients and labs with how='left', some patients have NaN in the hemoglobin column. What does this mean?",
    options: [
      "The hemoglobin values were zero",
      "Those patients had no matching lab results in the labs table",
      "The merge failed for those rows",
      "NaN means the values are normal"
    ],
    correct: 1,
    explanation: "In a left join, all rows from the left table are kept. NaN appears where there's no matching row in the right table — these patients had no lab results."
  },
  {
    question: "df.groupby('diagnosis')['hemoglobin'].mean() — what does this produce?",
    options: [
      "The mean hemoglobin for each unique diagnosis",
      "A list of all hemoglobin values grouped by diagnosis",
      "The overall mean hemoglobin across all patients",
      "A new column called 'mean' in the DataFrame"
    ],
    correct: 0,
    explanation: "groupby splits the data by diagnosis, then .mean() calculates the average hemoglobin within each group — useful for comparing lab values across cancer types."
  },
  {
    question: "You're merging monthly lab exports (January, February, March) — each has the same columns. Which function do you use?",
    options: [
      "pd.merge(jan, feb, mar)",
      "pd.concat([jan, feb, mar])",
      "jan.join(feb).join(mar)",
      "pd.append(jan, feb, mar)"
    ],
    correct: 1,
    explanation: "pd.concat() stacks DataFrames vertically when they have the same columns. merge() is for combining different tables with a shared key."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

**Type:** Decision Tree — choosing the right pandas merge type for clinical scenarios.

```jsx
import React, { useState } from 'react';

const scenarios = [
  {
    title: "Combining patient demographics with lab results",
    description: "You have 500 patients in demographics and 450 lab records. You want all 500 patients in your output, even if some don't have labs yet.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 1,
    explanation: "Left join keeps all rows from the left (demographics) table. Patients without labs will have NaN in lab columns — which you can then flag as 'labs pending'."
  },
  {
    title: "Merging oncology registry with pharmacy data",
    description: "You only want patients who appear in BOTH the oncology registry AND the pharmacy system (to analyze chemo patients specifically).",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 0,
    explanation: "Inner join returns only rows with matching keys in both tables — exactly the patients who are in both registry and pharmacy."
  },
  {
    title: "Stacking quarterly lab exports",
    description: "You have 4 CSV files (Q1, Q2, Q3, Q4) with identical columns. You want one big table with all records.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 3,
    explanation: "Concat stacks DataFrames vertically. Since all files have the same columns, concat([q1, q2, q3, q4]) produces a single unified table."
  },
  {
    title: "Building a complete patient view from 3 systems",
    description: "You want every patient from ALL three systems (EMR, lab, pharmacy), even if they only appear in one system.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 2,
    explanation: "Outer join keeps all rows from both tables. Patients missing from one system will have NaN in those columns — useful for identifying data gaps."
  }
];

export default function MergeDecisionTree() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === scenarios[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < scenarios.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  if (current >= scenarios.length) return null;
  const s = scenarios[current];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Choose the Right Merge</h2>
      <p className="text-sm text-gray-500 mb-4">Scenario {current+1} of {scenarios.length} | Score: {score}</p>
      <div className="p-4 bg-blue-50 rounded mb-4">
        <h3 className="font-semibold">{s.title}</h3>
        <p className="text-sm mt-1">{s.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {s.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`p-3 rounded border text-center ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === s.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm">{s.explanation}</p>
          {current + 1 < scenarios.length && (
            <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Next Scenario</button>
          )}
          {current + 1 >= scenarios.length && (
            <p className="mt-2 font-semibold">Complete! Score: {score}/{scenarios.length}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### Student Study Guide

**Before Class — Preparation (15–20 min)**
- If you've used Excel, think about the last time you did a VLOOKUP — pandas merge is the Python equivalent
- Warm-up question: *You have two spreadsheets — one with patient demographics and one with lab results. Both have an MRN column. How would you combine them into one sheet in Excel? What problems might you run into?*

**During Class — What to Focus On**
- Make sure you understand how to create a DataFrame from a list of dictionaries and from a CSV file
- Make sure you understand the difference between inner, left, and outer merge
- Make sure you can filter a DataFrame with boolean indexing
- Common trap: Don't confuse `pd.concat()` (stacking same-column tables) with `pd.merge()` (joining different tables on a key)

**After Class — Practice & Lab Work**
- **Lab work (required):** Complete the Colab notebook that creates 3 mock datasets, merges them, filters abnormal results, and exports to CSV. Screenshot the final merged DataFrame and the exported CSV. Estimated time: 20 min.
- **Extra practice:** Add a `groupby` analysis that calculates mean hemoglobin by diagnosis.
- **Self-check:**
  1. How do you filter a DataFrame for rows where WBC > 11?
  2. What merge type keeps all rows from both tables?
  3. What does `df.isna().sum()` tell you?

**Resources**
- [Pandas Getting Started Tutorial](https://pandas.pydata.org/docs/getting_started/intro_tutorials/)
- [Pandas Merge Documentation](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)

---

### Lab Exercise

**Title:** Merging Clinical Datasets — Building a Unified Patient View
**Duration:** 13 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> The oncology department needs a unified analysis dataset combining patient demographics, lab results, and medication records. Data comes from three separate systems — you need to merge them using MRN as the key and flag patients with critical values who are also on chemotherapy.

**Objective:**
By the end of this lab, students will have merged three mock KHCC datasets, performed analysis with groupby, and exported a filtered report.

**Setup:**
```
1. Open Google Colab
2. Create: "Session2_Lab4_Pandas.ipynb"
3. Follow the 9-section template
```

**Step-by-step instructions:**
1. **Create the demographics DataFrame:**
   ```python
   import pandas as pd

   demographics = pd.DataFrame([
       {"mrn": "P-1001", "name": "Ahmad", "age": 58, "gender": "M", "diagnosis": "Lung Cancer"},
       {"mrn": "P-1002", "name": "Sara", "age": 34, "gender": "F", "diagnosis": "Breast Cancer"},
       {"mrn": "P-1003", "name": "Khaled", "age": 67, "gender": "M", "diagnosis": "AML"},
       {"mrn": "P-1004", "name": "Lina", "age": 45, "gender": "F", "diagnosis": "CML"},
       {"mrn": "P-1005", "name": "Omar", "age": 52, "gender": "M", "diagnosis": "Lung Cancer"},
       {"mrn": "P-1006", "name": "Rania", "age": 41, "gender": "F", "diagnosis": "Breast Cancer"},
   ])
   ```
2. **Create the labs DataFrame** (note: P-1006 has no labs yet):
   ```python
   labs = pd.DataFrame([
       {"mrn": "P-1001", "hemoglobin": 9.1, "wbc": 6.2, "platelets": 180},
       {"mrn": "P-1002", "hemoglobin": 13.5, "wbc": 7.1, "platelets": 220},
       {"mrn": "P-1003", "hemoglobin": 7.8, "wbc": 1.2, "platelets": 45},
       {"mrn": "P-1004", "hemoglobin": 11.2, "wbc": 8.5, "platelets": 195},
       {"mrn": "P-1005", "hemoglobin": 8.5, "wbc": 4.8, "platelets": 160},
   ])
   ```
3. **Create the medications DataFrame:**
   ```python
   medications = pd.DataFrame([
       {"mrn": "P-1001", "drug": "Cisplatin", "on_chemo": True},
       {"mrn": "P-1002", "drug": "Tamoxifen", "on_chemo": False},
       {"mrn": "P-1003", "drug": "Cytarabine", "on_chemo": True},
       {"mrn": "P-1004", "drug": "Imatinib", "on_chemo": False},
       {"mrn": "P-1005", "drug": "Pembrolizumab", "on_chemo": True},
       {"mrn": "P-1006", "drug": "Letrozole", "on_chemo": False},
   ])
   ```
4. **Merge all three** using left joins on MRN (keep all patients from demographics).
5. **Check for missing data:** `df.isna().sum()` — note that P-1006 has NaN labs.
6. **Filter critical patients:** hemoglobin < 10 AND on_chemo == True.
7. **Group by diagnosis:** calculate mean hemoglobin per diagnosis.
8. **Export to CSV:** save the critical patients DataFrame.

**Expected output:**
```
Merged shape: (6, 9)
Missing values: hemoglobin 1, wbc 1, platelets 1

Critical patients (low HGB + on chemo):
  P-1001 Ahmad — HGB: 9.1, Drug: Cisplatin
  P-1003 Khaled — HGB: 7.8, Drug: Cytarabine
  P-1005 Omar — HGB: 8.5, Drug: Pembrolizumab

Mean hemoglobin by diagnosis:
  AML            7.80
  Breast Cancer  13.50
  CML            11.20
  Lung Cancer     8.80
```

**Stretch challenge:**
Create a pivot table showing mean lab values (hemoglobin, wbc, platelets) by diagnosis and gender.

**KHCC connection:**
> This exact merge pattern — demographics + labs + medications — is how the AIDI team builds analysis cohorts from the Azure SQL database tables in AIDI-DB. The MRN-based join mirrors the Optimus MRN encoding system used for data linkage.

---
---

## LESSON 5 OF 6: GitHub Fundamentals — Version Control for Clinical Notebooks

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"You've now built several notebooks with real clinical logic. But what if you accidentally delete a cell? Or your teammate changes a function and breaks the pipeline? Or your boss asks, 'What changed between the version from last week and today?' This is what GitHub solves. It's not just for storing code — it's a time machine for your work. Today you'll create a GitHub account, push your first Colab notebook, and learn the concept of commits. Every notebook you build for the rest of this course will be saved to GitHub."

---

### NotebookLM Summary

GitHub is a platform for version control — it tracks every change you make to your code over time, lets you go back to any previous version, and enables collaboration without overwriting each other's work. It is built on Git, a version control system created by Linus Torvalds (the creator of Linux) in 2005.

The core concept in Git is the commit. A commit is a snapshot of your code at a specific point in time, with a message describing what changed. Think of it as saving a version of a document with a note: "Added lab threshold configuration" or "Fixed hemoglobin alert logic." Unlike saving a file (which overwrites the previous version), commits preserve the entire history. You can always go back to any previous commit.

A repository (or "repo") is a project folder tracked by Git. When you create a GitHub repository, it lives on GitHub's servers (remote). You can also have a local copy on your computer. The workflow is: make changes locally, stage the changes you want to save (`git add`), create a commit with a message (`git commit`), then push to GitHub (`git push`) so the changes are backed up and visible to others.

For Google Colab users, the simplest workflow is: File → Save a copy in GitHub. This creates a commit directly from Colab. Students can also use the Colab + GitHub integration to open notebooks directly from a repository. For more advanced workflows, Git commands can be run in Colab cells using `!git` prefix.

Key GitHub concepts for clinical informatics: a **README.md** file describes what the repository contains. The **commit history** serves as an audit trail — essential in clinical settings where you need to trace what code ran, when, and who changed it. **Branches** allow you to experiment without affecting the main code, and **.gitignore** prevents sensitive files (like data with PHI) from being accidentally uploaded.

At KHCC, all AIDI production code is stored in Azure DevOps (similar to GitHub). Learning GitHub now prepares students for the professional version control practices used in the AI Office.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What is a 'commit' in Git?",
    options: [
      "Deleting a file from the repository",
      "A snapshot of your code at a specific point with a descriptive message",
      "Downloading code from GitHub",
      "Sharing your repository with someone"
    ],
    correct: 1,
    explanation: "A commit captures the state of all tracked files at that moment, tagged with a message like 'Added lab alert logic'. It's like a save point you can return to."
  },
  {
    question: "You accidentally deleted the functions section from your notebook last week. Your repo has 20 commits. What can you do?",
    options: [
      "Nothing — deleted code is gone forever",
      "Go back to a previous commit where the functions still existed and restore them",
      "Email GitHub support to recover the file",
      "Re-run the notebook to regenerate the functions"
    ],
    correct: 1,
    explanation: "Git preserves every version. You can view any previous commit and restore code from it — this is the core benefit of version control."
  },
  {
    question: "Which commit message is best for clinical code?",
    options: [
      "update",
      "fixed stuff",
      "Add hemoglobin threshold check for chemo patients",
      "commit 47"
    ],
    correct: 2,
    explanation: "Good commit messages describe WHAT changed and WHY. In clinical settings, this serves as an audit trail — reviewers need to understand each change without reading the code."
  },
  {
    question: "You have a CSV file with real patient MRNs in your project folder. What should you do before pushing to GitHub?",
    options: [
      "Push it — GitHub is private",
      "Add the CSV filename to .gitignore so it never gets uploaded",
      "Rename the file to hide it",
      "Encrypt the file and push the encrypted version"
    ],
    correct: 1,
    explanation: ".gitignore tells Git to ignore specific files. Patient data with PHI must NEVER be pushed to GitHub, even to private repositories. Always add data files to .gitignore."
  },
  {
    question: "In Colab, what is the easiest way to save your notebook to GitHub?",
    options: [
      "Download the .ipynb file and email it",
      "File → Save a copy in GitHub",
      "Copy-paste the code into a GitHub text editor",
      "Take screenshots of each cell"
    ],
    correct: 1,
    explanation: "Colab has built-in GitHub integration. 'Save a copy in GitHub' creates a commit directly from Colab — the simplest workflow for beginners."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Practice — Interactive Artifact

**Type:** Decision Tree — Git workflow steps in the correct order.

```jsx
import React, { useState } from 'react';

const steps = [
  { id: 1, text: "Create a GitHub account at github.com", order: 1 },
  { id: 2, text: "Create a new repository (repo) on GitHub", order: 2 },
  { id: 3, text: "Add a README.md describing your project", order: 3 },
  { id: 4, text: "Add a .gitignore file (to exclude data files with PHI)", order: 4 },
  { id: 5, text: "Open your Colab notebook and make changes", order: 5 },
  { id: 6, text: "File → Save a copy in GitHub (select your repo)", order: 6 },
  { id: 7, text: "Write a clear commit message describing your changes", order: 7 },
  { id: 8, text: "Verify the commit appears in your GitHub repo's commit history", order: 8 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GitWorkflow() {
  const [items, setItems] = useState(() => shuffle(steps));
  const [checked, setChecked] = useState(false);

  const moveItem = (from, to) => {
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
    setChecked(false);
  };

  const isCorrect = items.every((item, idx) => item.order === idx + 1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Git Workflow Organizer</h2>
      <p className="text-sm text-gray-600 mb-4">Put these steps in the correct order for pushing a Colab notebook to GitHub.</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className={`flex items-center gap-2 p-3 rounded border ${
            checked ? (item.order === idx + 1 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') : 'bg-white border-gray-300'
          }`}>
            <span className="text-gray-400 font-mono w-6">{idx + 1}.</span>
            <span className="flex-1 text-sm">{item.text}</span>
            <div className="flex flex-col">
              <button onClick={() => idx > 0 && moveItem(idx, idx-1)} className="text-xs px-1">▲</button>
              <button onClick={() => idx < items.length-1 && moveItem(idx, idx+1)} className="text-xs px-1">▼</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setChecked(true)} className="px-4 py-2 bg-blue-500 text-white rounded">Check Order</button>
        <button onClick={() => { setItems(shuffle(steps)); setChecked(false); }} className="px-4 py-2 bg-gray-500 text-white rounded">Shuffle</button>
      </div>
      {checked && isCorrect && <p className="mt-3 p-3 bg-green-100 rounded text-green-800 font-semibold">Perfect workflow!</p>}
      {checked && !isCorrect && <p className="mt-3 p-3 bg-yellow-100 rounded">Not quite — think about what needs to exist before each step can happen.</p>}
    </div>
  );
}
```

---

### Student Study Guide

**Before Class — Preparation (15–20 min)**
- Go to [github.com](https://github.com) and create your free account (if you don't already have one)
- Warm-up question: *Have you ever lost work because you saved over a file? How would you prevent that?*

**During Class — What to Focus On**
- Make sure you understand what a commit is and why commit messages matter
- Make sure you understand the difference between local and remote (GitHub)
- Make sure you can use Colab's "Save a copy in GitHub" feature
- Common trap: Don't push notebooks that contain real patient data or API keys — always check before committing

**After Class — Practice & Lab Work**
- **Lab work (required):** Create your CCI course repository on GitHub. Push all 4 lab notebooks from today's session. Each push should have a descriptive commit message. Share the repo link with Dr. Iyad. Estimated time: 15 min.
- **Extra practice:** Add a README.md to your repo explaining the purpose of each notebook.
- **Self-check:**
  1. What happens if you push a notebook with patient MRNs to a public GitHub repo?
  2. How would you find an older version of your code?
  3. What is .gitignore for?

**Resources**
- [GitHub Hello World Guide](https://docs.github.com/en/get-started/quickstart/hello-world)
- [Colab + GitHub Integration](https://colab.research.google.com/github/)

---

### Lab Exercise

**Title:** Setting Up GitHub and Pushing Your First Clinical Notebook
**Duration:** 10 minutes
**Mode:** Guided step-by-step

**Clinical Scenario:**
> KHCC's AIDI team requires all clinical notebooks to be stored in version control. You're setting up your personal GitHub repository to track all work from this course.

**Objective:**
By the end of this lab, students will have a GitHub account, a course repository, and at least one notebook pushed with a proper commit message.

**Setup:**
```
1. Open a browser tab with github.com (log in with your new account)
2. Keep Google Colab open in another tab
```

**Step-by-step instructions:**
1. **Create your GitHub account** (if not done in prep):
   - Go to github.com → Sign up
   - Use your KHCC or personal email
   - Choose a professional username (e.g., `ahmad-khcc` not `xXcoder420Xx`)
2. **Create a new repository:**
   - Click the "+" icon → New repository
   - Name: `cci-course-notebooks`
   - Description: "CCI Prompt Engineering & Clinical AI Development — Course Notebooks"
   - Select: Public (for course purposes) or Private
   - Check: "Add a README file"
   - Add .gitignore: Select "Python"
   - Click: "Create repository"
3. **Push your first notebook from Colab:**
   - Open your Session2_Lab2_Notebook_Template.ipynb in Colab
   - File → Save a copy in GitHub
   - Select your `cci-course-notebooks` repository
   - File path: `session_2/Lab2_Notebook_Template.ipynb`
   - Commit message: "Add Session 2 Lab 2 — Clinical notebook template with 9-section structure"
   - Click: "OK"
4. **Verify on GitHub:**
   - Go to your repository on github.com
   - Navigate to the session_2 folder
   - Click on the notebook — GitHub renders .ipynb files
   - Check the commit history (clock icon)
5. **Push a second notebook** with a different commit message to see multiple commits.

**Expected output:**
- GitHub repository with README, .gitignore, and at least 2 notebooks in `session_2/` folder
- 3+ commits visible in the commit history (initial commit + 2 notebook pushes)

**Stretch challenge:**
Edit the README.md on GitHub to include a table listing your session 2 notebooks with descriptions.

**KHCC connection:**
> All AIDI production code is stored in Azure DevOps with mandatory commit messages and code review. Learning GitHub now builds the version control discipline required for the AIDI team's development workflow.

---
---

## LESSON 6 OF 6: Wrap-Up — Review & Consolidation

**Estimated time:** 10 minutes

---

### Instructor Introduction

"That was a packed session — you went from zero Python to building structured notebooks, creating classes, merging datasets with pandas, and pushing everything to GitHub. That's a huge jump. Don't worry if it doesn't all feel natural yet — that's what practice is for. The assignment will push you to combine everything you learned today into one cohesive notebook. And the NotebookLM review materials will help you revisit anything that felt fast. Next session, we'll take these Python skills and start working with real databases using SQL."

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|-------------|-------------|-------------------|
| 1 | Python Fundamentals | Variables, types, control flow, dictionaries | Store and check patient data programmatically |
| 2 | Robust Notebook Template | 9-section notebook structure (installs → summary) | Standardized, auditable notebooks for clinical work |
| 3 | Python Classes | OOP — blueprints with data + behavior | Model patients as objects with built-in clinical checks |
| 4 | Pandas & Merging | DataFrames, filtering, merge types | Combine multi-source clinical datasets for analysis |
| 5 | GitHub | Repositories, commits, .gitignore | Version control and audit trails for clinical code |

**Connecting the Dots:** These five lessons form a complete workflow: you learn the language (Python), structure your work professionally (notebook template), model your data intelligently (classes), manipulate data at scale (pandas), and track everything safely (GitHub). In Sessions 3–6, you'll add SQL databases, LLMs, and retrieval pipelines on top of this foundation. Every future session builds directly on what you learned today.

---

### Common Mistakes & Gotchas

1. **Using `=` instead of `==` in conditions** — `if hgb = 10` assigns, `if hgb == 10` compares. Python will throw a syntax error, but the message isn't always clear.
2. **Forgetting colons after `if`, `for`, `def`, `class`** — Python requires `:` at the end of these statements. If you get "SyntaxError: expected ':'", this is almost always why.
3. **Forgetting `self` in class methods** — Writing `def is_anemic():` without `self` means the method can't access instance data. Always include `self` as the first parameter.
4. **Using `pd.concat()` when you need `pd.merge()`** — Concat stacks rows (same columns, different data). Merge joins columns (same key, different columns). Mixing them up silently produces wrong results.
5. **Pushing sensitive data to GitHub** — Even in private repos, patient data should never be on GitHub. Always check your notebook for hardcoded MRNs or API keys before pushing. Use `.gitignore`.

---

### Quick Self-Check (No-Code)

1. What Python data type would you use to store a patient's entire record (name, MRN, labs, medications)?
2. In the 9-section notebook template, what goes in the Configuration section vs. the Functions section?
3. What does `self.hemoglobin` mean inside a class method?
4. You merge two DataFrames with `how='left'` and see NaN values. What happened?
5. Your colleague asks "what did you change in the lab alert notebook last Thursday?" — how do you find out using GitHub?

<details>
<summary>Answers</summary>

1. A **dictionary** (for simple cases) or a **class instance** (for complex cases with methods).
2. **Configuration** holds constants/thresholds/paths that change between runs. **Functions** hold reusable logic that operates on data.
3. It refers to the hemoglobin attribute of the specific patient object calling the method.
4. Some rows in the left table had no matching key in the right table — those patients are missing data from the second source.
5. Go to the GitHub repo → click the file → click "History" to see all commits that changed that file, with dates and messages.
</details>

---

### NotebookLM Review Notebook

**Notebook title:** `CCI Session 2 — Python Basics + GitHub — Review`

**Sources to add:**

**Source 1 — Session Summary:**
Session 2 of the CCI Prompt Engineering and Clinical AI Development course covered five core topics across two hours. The session began with Python fundamentals, where students learned about variables, data types (strings, integers, floats, booleans, lists, and dictionaries), control flow with if-statements and for-loops, all applied to clinical scenarios like flagging abnormal lab values. Students then learned to build professional Colab notebooks following a 9-section template: package installations, imports, configuration, prompts, functions, main code, CSV export, email simulation, and markdown summary. This template ensures notebooks are reproducible, auditable, and follow KHCC's AIDI team standards. The third lesson introduced Python classes and object-oriented programming, where students created Patient and OncologyPatient classes with methods like is_anemic() and is_neutropenic(), modeling clinical data as structured objects. Lesson four covered pandas DataFrames — creating, filtering, grouping, and most importantly merging datasets using inner, left, and outer joins, demonstrated with mock KHCC oncology data combining demographics, labs, and medications tables. The final lesson taught GitHub fundamentals: creating accounts, building repositories, writing meaningful commit messages, using .gitignore to protect sensitive data, and pushing Colab notebooks using the built-in GitHub integration. All labs used Google Colab as the development environment. The clinical anchors included patient lab result processing, discharge summary analysis, medication reporting, and cancer registry data. Students finished the session with a complete GitHub repository containing four structured notebooks.

**Source 2 — Key Terms Glossary:**
**Variable**: A named container for a value (e.g., hemoglobin = 12.5). **String**: Text data enclosed in quotes. **Integer**: Whole number. **Float**: Decimal number. **Boolean**: True or False value. **List**: Ordered collection of items in square brackets. **Dictionary**: Key-value pairs in curly braces, like a patient record. **For loop**: Repeats code for each item in a collection. **If statement**: Executes code only when a condition is true. **Function**: Reusable block of code defined with def. **Class**: Blueprint for creating objects with data and behavior. **__init__**: Constructor method that initializes a new object. **self**: Reference to the specific instance inside a class method. **Instance**: A specific object created from a class. **Inheritance**: A class extending another class to add or modify behavior. **DataFrame**: A pandas table with rows and columns. **Series**: A single column of a DataFrame. **Boolean indexing**: Filtering a DataFrame using True/False conditions. **pd.merge()**: Combines two DataFrames on a shared column (like SQL JOIN). **pd.concat()**: Stacks DataFrames vertically. **Inner join**: Keeps only matching rows from both tables. **Left join**: Keeps all rows from the left table. **Outer join**: Keeps all rows from both tables. **NaN**: Not a Number — indicates missing data. **Repository**: A Git-tracked project folder. **Commit**: A snapshot of code with a descriptive message. **.gitignore**: File listing patterns to exclude from version control. **Push**: Upload local commits to GitHub.

**Source 3 — Lab Recap:**
Lab 1 (Python Fundamentals): Built a Colab notebook storing patient data in variables and dictionaries, wrote a for-loop to flag abnormal hemoglobin and WBC values. Tools: Google Colab, base Python. Lab 2 (Notebook Template): Created a complete 9-section clinical notebook template processing mock patient lab data with functions, CSV export, email simulation, and markdown summary. Tools: Google Colab, csv module, datetime. Lab 3 (Classes): Implemented a Patient class with clinical methods (is_anemic, has_abnormal_wbc, get_alerts, summary) and an OncologyPatient subclass with cancer-specific attributes. Tools: Google Colab, base Python OOP. Lab 4 (Pandas): Merged three mock KHCC datasets (demographics, labs, medications) using left joins, filtered critical patients, performed groupby analysis, and exported results to CSV. Tools: Google Colab, pandas. Lab 5 (GitHub): Created a GitHub account and cci-course-notebooks repository, pushed notebooks using Colab's Save to GitHub feature, wrote descriptive commit messages, verified commit history.

**Source 4 — Common Mistakes:**
Five most common mistakes: (1) Using = instead of == in conditions — assignment vs comparison. (2) Forgetting colons after if, for, def, class statements. (3) Omitting self as first parameter in class methods. (4) Confusing pd.concat (vertical stacking) with pd.merge (key-based joining). (5) Pushing notebooks with patient data or API keys to GitHub — always use .gitignore.

**Suggested NotebookLM actions:**
- Generate an *Audio Overview* (podcast) for commute-friendly revision
- Generate a *Quiz* (10 questions, MEDIUM difficulty) for self-assessment
- Generate *Flashcards* (15 cards) for term memorization
- Generate a *Mind Map* to visualize concept relationships

---

### What's Next

In Session 3, you'll connect Python to databases using SQL, learning how to query clinical data directly from a database and use LLMs to translate natural language questions into SQL queries. The notebook template, pandas skills, and GitHub workflow you learned today will be used in every session going forward.

---
---

## SESSION 2 ASSIGNMENT: The Complete Clinical Intake Pipeline

**Due:** Before Session 3
**Estimated effort:** 3–5 hours
**Submission:** Push to your `cci-course-notebooks` GitHub repo under `assignments/session-2/` and share the link with Dr. Iyad

---

### Clinical Scenario

> KHCC's outpatient oncology clinic receives 30–50 new patient intake forms daily. Each form contains demographics, initial lab results, current medications, and a brief clinical note. Currently, a data entry clerk manually reviews each form, flags abnormal labs, checks for drug interactions, and prepares a summary report for the oncologist. This takes 2–3 hours per day. You've been asked to build a Python notebook that automates this workflow.

### Requirements

**Part 1 — Foundation (30%): Build the Intake Data Model**

Create a complete Colab notebook following the 9-section template that:
- Defines a `PatientIntake` class with attributes: name, mrn, age, gender, diagnosis, hemoglobin, wbc, platelets, creatinine, medications (list of strings), clinical_note (string)
- Includes methods: `get_lab_alerts()`, `is_high_risk()` (combines multiple criteria), `summary()`, and `to_dict()` (for CSV export)
- Creates at least 15 patient intake records with varied data (some normal, some critical, some with missing values)
- Uses meaningful variable names and follows the notebook template structure exactly

**Deliverable:** A working `PatientIntake` class and 15 patient objects.

**Part 2 — Application (30%): Merge, Analyze, and Export**

Using pandas:
- Convert the 15 patients into a DataFrame using `to_dict()`
- Create a second DataFrame with a drug interaction table (at least 10 drug pairs that interact)
- Merge patient medications with the drug interaction table to flag potential interactions
- Group patients by diagnosis and calculate summary statistics (mean, min, max for all lab values)
- Export three CSV files: (1) all patients, (2) high-risk patients only, (3) drug interaction alerts
- Generate a markdown summary cell with patient counts, alert counts, and key statistics

**Deliverable:** Three CSV files and a summary analysis in the notebook.

**Part 3 — Analysis & Critical Thinking (20%)**

Write 200–400 words (in a markdown cell) addressing:
- What are at least 2 failure modes of your lab alert logic? (e.g., what if a patient has a legitimately low hemoglobin due to thalassemia trait rather than cancer treatment?)
- What lab values or clinical context are you NOT checking that a real system should?
- If this notebook were deployed at KHCC, what PHI/security considerations would apply? How would you handle the API key if using an LLM for the clinical note summary?
- How would you test this notebook to ensure it works correctly on new data?

**Part 4 — Stretch Challenge (20%): Automated Report Generation**

Choose ONE:
- **Option A — Email Report:** Write a function that generates a formatted email body (plain text or HTML) summarizing the daily intake: total patients, high-risk count, drug interaction alerts, and a table of critical patients. Simulate sending it (print the formatted output).
- **Option B — Multi-Day Trend:** Create intake data for 5 consecutive days (75+ patients total). Use pandas to analyze trends: are lab values getting worse for returning patients? Generate a markdown report with day-over-day comparisons.
- **Option C — Deployment Proposal:** Write a 1-page markdown document proposing how this notebook could be deployed at KHCC. Include: who would use it, what training they'd need, how it would integrate with existing systems (AIDI-DB, Azure), what approvals are required, and a risk assessment.

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Code quality & correctness | 25% | Clean, runs without errors, handles edge cases, follows 9-section template | Runs with minor issues | Broken or incomplete |
| Clinical relevance | 25% | Uses realistic KHCC data patterns, clinically meaningful thresholds | Clinically reasonable but generic | Abstract/disconnected from clinical context |
| Critical analysis (Part 3) | 25% | Identifies non-obvious limitations, proposes realistic tests, addresses PHI | Surface-level analysis | Missing or generic |
| Stretch challenge (Part 4) | 25% | Creative, well-researched, demonstrates independent thinking | Attempted but shallow | Not attempted |

### Anti-Shortcut Rules

- You MUST use 15+ unique patients with varied, realistic data (not just copies with changed names)
- Your Part 3 analysis must reference YOUR specific implementation, not generic statements
- All three CSV files must be produced by running the notebook top-to-bottom (include screenshots of the CSV files opened in Colab)
- Push to GitHub with at least 3 separate commits with descriptive messages (not one giant commit at the end)

---
