# CCI Session 9: Local Development with VS Code, Git & Hugging Face
## Curriculum — 6 Lessons + Wrap-Up

**Audience:** Completed Sessions 1-8. Comfortable with Python and notebooks. First time setting up local development environment, using git from an IDE, and deploying to a public hosting platform.
**Clinical Anchor:** Cockcroft-Gault creatinine clearance calculator with nephrotoxic-drug alerts — built locally, version-controlled, deployed to Hugging Face Spaces
**Session Duration:** 2.5 hours
**Lab Mode:** Guided step-by-step (everyone ships the same app)
**Pre-session homework:** Install VS Code + Python 3.11, create GitHub and Hugging Face accounts
**Environment:** Local development on student laptops (Mac/Linux/Windows)

---

## LESSON 1 OF 7: VS Code Setup — Terminal, venv, requirements, README

**Estimated time:** 20 minutes (10 min content / 10 min lab)

---

### Instructor Introduction

"Up till now most of you have been writing code in notebooks — Colab, Jupyter, Databricks. Notebooks are great for experiments, but every real clinical AI system at KHCC lives in a folder of .py files on a server. Today we learn how to set that folder up on your own laptop. By the end of this lesson, you'll have a clean project structure that any colleague — or future you — can reopen six months from now and still run."

---

### NotebookLM Summary

An IDE — Integrated Development Environment — is what professional developers use instead of notebooks. VS Code is the most popular IDE in the world right now. The mental shift from notebooks to an IDE is this: in a notebook, code lives in cells inside a single file, and state is held in memory. In an IDE, code lives in a folder of `.py` files on disk, and state is reproduced every time you run the program. That second model is the only one that scales to production clinical systems. Every AIDI pipeline at KHCC is a folder, not a notebook.

A VS Code workspace is just a folder. When you click "Open Folder" you are opening a workspace. The integrated terminal is the system shell — bash, zsh, or PowerShell — docked at the bottom of the editor so you never have to leave VS Code to run commands. You will use the terminal heavily today.

Virtual environments — venvs — are the foundation of reproducible Python projects. Without a venv, every `pip install` writes to your global Python, and two projects with conflicting package versions will silently break each other. A venv is a private copy of Python and a private set of installed packages, scoped to one project folder. You create one with `python -m venv .venv`. You activate it on macOS or Linux with `source .venv/bin/activate`, and on Windows with `.venv\Scripts\activate`. Once activated, every `pip install` and `python` command uses the project's private Python.

The single most-missed step is telling VS Code which Python interpreter to use. After creating the venv, click the Python version shown in the bottom-right of the VS Code status bar (or run "Python: Select Interpreter" from the command palette) and pick the one inside `.venv`. If you skip this step, your terminal will use the venv but VS Code's running and debugging will use a different Python — and you will spend an hour confused about why your packages "are not installed."

A `requirements.txt` file lists the packages your project needs, one per line, optionally pinned to specific versions. Colleagues clone your repo, create their own venv, and run `pip install -r requirements.txt` to reproduce the exact environment. A `README.md` is the human-facing entry point — what the project does, how to run it, and any clinical caveats. The full setup ritual we will follow today is: open folder → open terminal → create venv → activate venv → select interpreter in VS Code → create requirements.txt → pip install → create README.md.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "Why do we create a virtual environment (venv) for every Python project instead of just using the system Python?",
    options: [
      "venvs run faster than the system Python",
      "venvs isolate each project's packages so two projects with conflicting versions don't break each other",
      "venvs are required by VS Code — it refuses to run without one",
      "venvs encrypt your code so others can't read it"
    ],
    correct: 1,
    explanation: "Without a venv, every pip install writes to your global Python. Project A needs pandas 1.5, project B needs pandas 2.1 — they silently overwrite each other. A venv is a private, project-scoped Python with its own packages. This is the single biggest source of 'works on my machine but not yours' bugs in Python."
  },
  {
    question: "You created a venv, activated it in the terminal, and ran `pip install gradio`. You then open `app.py` in VS Code and press Run. VS Code says 'ModuleNotFoundError: No module named gradio'. What did you most likely forget?",
    options: [
      "You need to restart your computer for the install to take effect",
      "You forgot to select the venv's Python as the VS Code interpreter (bottom-right of the status bar)",
      "gradio is not compatible with VS Code",
      "You need to install gradio twice — once for the terminal and once for VS Code"
    ],
    correct: 1,
    explanation: "This is THE most common Session 9 mistake. The terminal uses the venv because you activated it, but VS Code's Run button uses whatever interpreter is selected in the status bar — which defaults to the global Python. Click the version in the bottom-right and pick the one inside `.venv`."
  },
  {
    question: "What is the purpose of `requirements.txt`?",
    options: [
      "It tells Python which version of the language to use",
      "It lists the packages your project depends on so colleagues can recreate the same environment with `pip install -r requirements.txt`",
      "It is a license file that GitHub requires",
      "It contains your API keys for the project"
    ],
    correct: 1,
    explanation: "`requirements.txt` is the contract that says 'this project needs these packages.' Anyone — a colleague, a CI server, future-you — can clone the repo, create their own venv, and run `pip install -r requirements.txt` to get the exact same set of packages. API keys never go in requirements.txt — they go in .env, which we cover in Lesson 2."
  },
  {
    question: "Notebooks (Colab, Jupyter) are great for experiments but bad for production clinical systems. Why?",
    options: [
      "Notebooks cannot import any Python libraries",
      "Notebooks hold state in memory and execute cells out of order, making them hard to reproduce, version-control, test, and deploy",
      "Notebooks are slower than .py files",
      "Notebooks don't work on Windows"
    ],
    correct: 1,
    explanation: "Notebooks let you run cells in any order, hold hidden state in memory, and bury imports halfway down the file. That is fine for exploration. It is a disaster for a clinical system that needs to be reproducible, testable, version-controlled, deployable, and auditable. Every KHCC production pipeline is a folder of .py files, not a notebook."
  },
  {
    question: "Which of the following is the correct full setup ritual for a new Python project in VS Code?",
    options: [
      "pip install everything globally → open VS Code → write code",
      "Open folder → open terminal → create venv → activate venv → select interpreter → create requirements.txt → pip install → create README.md",
      "Create README first → install Python → open VS Code → done",
      "Open a Colab notebook → export to .py → upload to VS Code"
    ],
    correct: 1,
    explanation: "The order matters. You must create and activate the venv BEFORE installing packages (otherwise they go to global Python). You must select the interpreter in VS Code or your Run button will use the wrong Python. README and requirements.txt are the human-facing and machine-facing entry points to the project."
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
          {score >= 4 ? "Excellent! You understand venvs, interpreters, and the full setup ritual." : score >= 3 ? "Good foundation — review the interpreter-selection step." : "Review the lesson material before moving on."}
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

const correctOrder = [
  { id: 1, label: "Open the project folder in VS Code (File → Open Folder)" },
  { id: 2, label: "Open the integrated terminal (View → Terminal)" },
  { id: 3, label: "Create the venv: python -m venv .venv" },
  { id: 4, label: "Activate the venv (source .venv/bin/activate or .venv\\Scripts\\activate)" },
  { id: 5, label: "Select the venv Python as VS Code interpreter (click version in status bar)" },
  { id: 6, label: "Create requirements.txt with the packages you need" },
  { id: 7, label: "Run pip install -r requirements.txt inside the activated venv" },
  { id: 8, label: "Create README.md describing what the project does and how to run it" }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const consequences = {
  "3-before-2": "You need the terminal open to run `python -m venv .venv`. Open the terminal first.",
  "4-before-3": "You cannot activate a venv that does not exist yet. Create it first.",
  "7-before-4": "If you pip install before activating the venv, the packages go to your global Python — exactly what venvs are supposed to prevent.",
  "7-before-6": "You can pip install without requirements.txt, but then there is no record of what your project needs and no one (including future-you) can reproduce the environment.",
  "5-before-4": "You can pick the interpreter before activating, but most students forget — and then VS Code's Run button uses a different Python than the terminal. The most common Session 9 bug."
};

export default function Practice() {
  const [items, setItems] = useState(shuffle(correctOrder));
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const move = (idx, dir) => {
    if (submitted) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const a = [...items];
    [a[idx], a[newIdx]] = [a[newIdx], a[idx]];
    setItems(a);
  };

  const check = () => {
    const fb = [];
    let firstWrong = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== correctOrder[i].id) {
        if (firstWrong === -1) firstWrong = i;
        fb.push({ idx: i, ok: false });
      } else {
        fb.push({ idx: i, ok: true });
      }
    }
    setFeedback(fb);
    setSubmitted(true);
  };

  const reset = () => {
    setItems(shuffle(correctOrder));
    setSubmitted(false);
    setFeedback([]);
  };

  const allCorrect = submitted && feedback.every(f => f.ok);

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>VS Code Project Setup Checklist</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        Drag (or use the arrows) to put the 8 setup steps in the correct order. Get the order wrong and your project will be broken in ways that take an hour to debug.
      </p>

      {items.map((item, i) => {
        const fb = feedback[i];
        const bg = submitted ? (fb && fb.ok ? '#d4edda' : '#f8d7da') : '#fff';
        const border = submitted ? (fb && fb.ok ? '#198754' : '#dc3545') : '#dee2e6';
        return (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', margin: '6px 0', borderRadius: 8, border: `2px solid ${border}`, background: bg }}>
            <span style={{ width: 28, fontWeight: 'bold', color: '#666' }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {!submitted && (
              <span>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ marginLeft: 4, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: i === 0 ? 'default' : 'pointer' }}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={{ marginLeft: 4, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: i === items.length - 1 ? 'default' : 'pointer' }}>↓</button>
              </span>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check My Order</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          {allCorrect ? (
            <p><strong>All correct!</strong> This is the canonical setup ritual. Run it on every new project — it will save you hours of debugging later.</p>
          ) : (
            <div>
              <p><strong>Order is not quite right.</strong> Key reasons to get this exact sequence:</p>
              <ul style={{ lineHeight: 1.7 }}>
                <li>You must <strong>activate</strong> the venv before <strong>pip install</strong> — otherwise packages go to global Python.</li>
                <li>You must <strong>select the interpreter</strong> in VS Code or the Run button uses a different Python than your terminal (most common Session 9 bug).</li>
                <li>You need the <strong>terminal open</strong> before you can run `python -m venv .venv`.</li>
                <li><strong>requirements.txt</strong> should exist before you `pip install -r` so you have a reproducible record.</li>
                <li><strong>README.md</strong> goes last but must exist — it is how a colleague (or future-you) knows what the project does.</li>
              </ul>
            </div>
          )}
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 2 OF 7: .gitignore and the Secrets Mindset

**Estimated time:** 15 minutes (8 min content / 7 min lab)

---

### Instructor Introduction

"This is the most important 15 minutes of today. We're going to talk about what NOT to share. Every week, somewhere in the world, a clinician leaks an API key or a patient list to GitHub. Some of you will work with PHI eventually. Let's build the habit now, on a project where the stakes are zero."

---

### NotebookLM Summary

Git tracks every file in your project by default. That sounds harmless until you realize that "every file" includes the API key you saved to a config file, the patient list you pasted into a CSV while testing, and the 2 GB venv folder full of installed packages. A `.gitignore` file is the exclusion list — every pattern in it tells git "ignore this, do not track it, do not push it." `.gitignore` itself is committed; it is the public contract of "these are the things this project does not share."

The three-file pattern for secrets is the standard everywhere. First, `.env` holds your actual secrets — `OPENAI_API_KEY=sk-...` and similar. This file is listed in `.gitignore` and never committed. Second, `.env.example` holds the same variable names but with placeholder values like `OPENAI_API_KEY=your-key-here`. This file IS committed — it shows colleagues which environment variables your project needs without revealing actual values. Third, `.gitignore` includes `.env` (and `.venv/`, `__pycache__/`, `*.db`, `.DS_Store`, etc.) so git refuses to track them.

The reason secrets must never enter git history is that git history is forever. Once you commit a secret and push it, that secret exists in every clone, every fork, every CI cache, every backup of the repo. Deleting the file in a later commit does not remove it — it is still in the history. Force-pushing to rewrite history does not help because anyone who already pulled has a copy. The only correct response to a leaked key is to **rotate it immediately** — log into the provider, revoke the leaked key, and issue a new one. Do not delete the commit and hope no one saw it.

The live failure mode is real and fast. Automated scrapers crawl GitHub continuously for leaked credentials. OpenAI keys posted to public repos are typically harvested and used within minutes — the attackers do not need your code, they just need your billing. People have woken up to thousands of dollars in API charges from a single accidental commit.

The library that loads secrets from a `.env` file into Python environment variables is `python-dotenv`. You add `python-dotenv` to your `requirements.txt`, then in your code you write `from dotenv import load_dotenv; load_dotenv()` near the top, and `os.getenv("OPENAI_API_KEY")` returns the value. Your code never contains the key — only the variable name.

The mental rule is: **"If a file contains anything you wouldn't print in a journal article, it goes in .gitignore."** API keys, patient identifiers, sample PHI, vendor credentials, database connection strings, internal hostnames — all of it. When in doubt, exclude it; you can always add it back.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You accidentally committed and pushed a file containing your OpenAI API key. What is the correct first response?",
    options: [
      "Delete the file in a new commit and push — that removes it from history",
      "Force-push to rewrite history and hope no one cloned in between",
      "Rotate the key immediately — log into OpenAI, revoke the leaked key, issue a new one",
      "Make the repo private — that solves it"
    ],
    correct: 2,
    explanation: "Git history is forever. Once a key is pushed, it exists in every clone, every fork, every CI cache. Automated scrapers harvest leaked OpenAI keys within minutes. The only correct response is to rotate (revoke and reissue) the key. Cleanup of git history can come after, but rotation is non-negotiable and must happen first."
  },
  {
    question: "What is the purpose of `.env.example`?",
    options: [
      "It is a backup of your real .env in case you delete it",
      "It documents which environment variables the project needs, with placeholder values — and IS committed (unlike .env)",
      "It encrypts the real .env file so it can be safely committed",
      "It is identical to .env but for the testing environment"
    ],
    correct: 1,
    explanation: ".env.example shows colleagues the SHAPE of the secrets your project needs (which variable names) without revealing actual values. It is committed to git. The real .env (with real keys) is .gitignored. A new developer clones the repo, sees .env.example, copies it to .env, and fills in their own keys."
  },
  {
    question: "Which of the following should be listed in .gitignore for a typical Python project?",
    options: [
      ".env, .venv/, __pycache__/, *.db, .DS_Store",
      "README.md, app.py, requirements.txt",
      "Everything — git should track nothing by default",
      "Only .env — the rest is fine to commit"
    ],
    correct: 0,
    explanation: ".env (secrets), .venv/ (huge folder of installed packages — regenerated by pip install), __pycache__/ (compiled Python cache), *.db (databases that may contain data), .DS_Store (macOS metadata). README.md, app.py, and requirements.txt are the actual project — they MUST be committed."
  },
  {
    question: "Why do we use python-dotenv and load_dotenv() instead of hardcoding the API key in app.py?",
    options: [
      "load_dotenv() is faster than hardcoding",
      "Because the key in app.py would be committed to git when you push — load_dotenv() reads it from .env, which is .gitignored",
      "OpenAI's terms of service require it",
      "VS Code refuses to run code with hardcoded keys"
    ],
    correct: 1,
    explanation: "Hardcoded keys end up in git history the moment you commit. load_dotenv() reads keys at runtime from .env (which is .gitignored), so your source code never contains the secret — only the variable name os.getenv('OPENAI_API_KEY') appears in committed code."
  },
  {
    question: "The mental rule for what goes in .gitignore is:",
    options: [
      "Anything over 1 MB",
      "Anything you wouldn't print in a journal article — API keys, PHI, credentials, hostnames",
      "Only files ending in .env",
      "Everything not written by you"
    ],
    correct: 1,
    explanation: "The journal-article test is a useful heuristic. If you would not put it in the methods section of a paper — API keys, patient identifiers, internal hostnames, vendor credentials, database strings — it does not belong in a public git repo. When in doubt, exclude it; you can always add it back."
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
          {score >= 4 ? "Excellent! You have the secrets mindset — this habit will protect you and KHCC's patients." : score >= 3 ? "Good — but review the rotation response to a leaked key." : "Review the lesson — this is the most important 15 minutes of the session."}
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

const files = [
  { name: "README.md", commit: true, reason: "Documents what the project does and how to run it. Always committed." },
  { name: ".env", commit: false, reason: "Contains real secrets (API keys). NEVER committed. Listed in .gitignore." },
  { name: ".env.example", commit: true, reason: "Documents which environment variables exist, with placeholder values. Committed so colleagues know what to fill in." },
  { name: "drugs.db", commit: false, reason: "SQLite database file. For our toy project the data is non-sensitive, but the general rule is: databases may contain real or sample PHI — exclude by default, regenerate from init_db.py." },
  { name: ".gitignore", commit: true, reason: "The exclusion list itself IS committed — it is the public contract of what this project does not share." },
  { name: "app.py", commit: true, reason: "Your application source code. This is the whole point of the repo. Always committed." },
  { name: ".venv/", commit: false, reason: "Hundreds of MB of installed packages. Regenerated by pip install -r requirements.txt. Never committed." },
  { name: "patient_data.csv", commit: false, reason: "Patient identifiers — even sample data named this way is a red flag. Never committed, full stop. PHI does not belong in git." }
];

export default function Practice() {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (name, val) => {
    if (submitted) return;
    setChoices({ ...choices, [name]: val });
  };

  const check = () => setSubmitted(true);
  const reset = () => { setChoices({}); setSubmitted(false); };

  const score = files.filter(f => choices[f.name] === f.commit).length;
  const answeredCount = Object.keys(choices).length;

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Should This File Be Committed?</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        For each file, decide: should this go into git (committed and pushed to GitHub) or NOT (listed in .gitignore)?
      </p>

      {files.map((f) => {
        const userChoice = choices[f.name];
        const correct = submitted && userChoice === f.commit;
        const wrong = submitted && userChoice !== undefined && userChoice !== f.commit;
        return (
          <div key={f.name} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8,
            border: `2px solid ${correct ? '#198754' : wrong ? '#dc3545' : '#dee2e6'}`,
            background: correct ? '#d4edda' : wrong ? '#f8d7da' : '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <code style={{ flex: 1, fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold' }}>{f.name}</code>
              <button onClick={() => choose(f.name, true)} disabled={submitted} style={{
                marginLeft: 8, padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${userChoice === true ? '#198754' : '#ccc'}`,
                background: userChoice === true ? '#198754' : '#fff', color: userChoice === true ? '#fff' : '#000'
              }}>Commit</button>
              <button onClick={() => choose(f.name, false)} disabled={submitted} style={{
                marginLeft: 8, padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${userChoice === false ? '#dc3545' : '#ccc'}`,
                background: userChoice === false ? '#dc3545' : '#fff', color: userChoice === false ? '#fff' : '#000'
              }}>Don't Commit</button>
            </div>
            {submitted && (
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14, color: '#333' }}>
                <strong>{f.commit ? "Commit" : "Don't commit"}.</strong> {f.reason}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} disabled={answeredCount < files.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none',
          background: '#198754', color: '#fff', cursor: answeredCount < files.length ? 'default' : 'pointer',
          opacity: answeredCount < files.length ? 0.5 : 1
        }}>Check My Choices ({answeredCount}/{files.length})</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {score} / {files.length}</strong></p>
          <p>{score === files.length ? "Perfect — you have the secrets mindset." : score >= 6 ? "Good — but review the misses. In clinical work, even one wrong call can leak PHI or an API key." : "Review the lesson. This is the highest-stakes habit of the session."}</p>
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 3 OF 7: Git + GitHub from VS Code

**Estimated time:** 25 minutes (12 min content / 13 min lab)

---

### Instructor Introduction

"Git tracks every change you make. GitHub is just a place where git repos live online. Most of you have seen the buttons in VS Code already, but today I want you to understand the mental model — because when something breaks, and it will, you need to know what the buttons are actually doing."

---

### NotebookLM Summary

Git has a simple mental model with four states for any change you make: **working directory** (you edited a file, but git doesn't know about the change yet), **staged** (you told git "I want to include this change in the next commit"), **committed** (git has saved a snapshot locally on your machine), and **pushed** (the snapshot has been uploaded to GitHub). The flow is always working → staged → committed → pushed. The two most important commands you'll run are `git status` (shows what state every file is in) and `git log` (shows what has been committed). When something feels broken, `git status` is the answer 80% of the time.

A commit is a snapshot of your whole project at a moment in time, plus a message describing what changed. It is not a file or a diff — it is a full point-in-time picture. That is what makes git able to recover from any mistake: every commit is a save point you can return to.

VS Code's **Source Control panel** (the branch icon in the left sidebar) is a graphical shell over the git command-line. The "+" buttons next to changed files run `git add` (staging). The commit text box and check mark run `git commit`. The "..." menu offers push, pull, and more advanced operations. Knowing what the buttons map to means that when a button fails, you can drop to the terminal and run the underlying command to see the real error message.

Before pushing anything, run a **pre-flight check**: open the Source Control panel and confirm `.venv/` does NOT appear in the list of changes. If it does, your `.gitignore` is wrong, and you are about to push 200 MB of installed packages. Fix `.gitignore` before continuing.

Connecting your local repo to GitHub has three steps. First, create an empty repo on GitHub (no README, no .gitignore — they would conflict with your local files). Second, add the remote: `git remote add origin https://github.com/yourusername/your-repo.git`. Third, push: `git push -u origin main` (the `-u` sets up tracking so future pushes are just `git push`).

Authentication has three common options. **HTTPS + Personal Access Token (PAT)** is the easiest for beginners: GitHub will prompt for a username and password; the "password" is actually a PAT you generate in GitHub settings. **SSH keys** are cleaner long-term: generate a key with `ssh-keygen`, add the public key to GitHub, and pushes never prompt for credentials again. **GitHub CLI (`gh auth login`)** wraps both options behind a friendly command.

Common errors and their fixes: `Permission denied (publickey)` means your SSH key is not registered with GitHub — either add it or switch to HTTPS. `remote: Repository not found` means the remote URL is wrong or you lack access — check `git remote -v`. `Updates were rejected because the remote contains work` means GitHub has commits you don't have locally — `git pull` first, then push again. `error: remote origin already exists` means you ran `git remote add` twice — use `git remote set-url origin <new-url>` to change it.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You edited app.py. You haven't run any git commands yet. What state is the change in?",
    options: [
      "Committed",
      "Staged",
      "Working directory (modified, not yet staged)",
      "Pushed to GitHub"
    ],
    correct: 2,
    explanation: "The flow is working directory → staged → committed → pushed. Just editing a file puts the change in the working directory. `git add` moves it to staged. `git commit` saves a snapshot locally. `git push` uploads to GitHub."
  },
  {
    question: "You run `git status` and see a new file `.venv/` in the list of untracked changes. What should you do?",
    options: [
      "Run git add .venv/ and commit — it's part of your project",
      "Add `.venv/` to .gitignore BEFORE committing — venvs are hundreds of MB and should never be in git",
      "Delete the .venv folder",
      "Push it anyway — GitHub handles large folders"
    ],
    correct: 1,
    explanation: ".venv contains hundreds of MB of installed packages, regenerated from requirements.txt by anyone who clones the repo. If .venv shows up in `git status`, your .gitignore is missing the entry. Fix .gitignore first, then commit. This is the pre-flight check before every push."
  },
  {
    question: "What does `git status` actually show you?",
    options: [
      "Only files that have been committed",
      "The state of every file: untracked, modified, staged, or up-to-date",
      "A summary of all git commands run today",
      "How many commits ahead of GitHub you are, nothing else"
    ],
    correct: 1,
    explanation: "`git status` is the most-used git command. It tells you which files are untracked, modified, staged for the next commit, and whether your local branch is ahead/behind the remote. When you are confused about git, `git status` is the first answer."
  },
  {
    question: "You push and get: `error: failed to push some refs ... Updates were rejected because the remote contains work that you do not have`. What does this mean?",
    options: [
      "GitHub is down",
      "Your code has a bug",
      "Someone else (or you on another machine) pushed commits to GitHub that you don't have locally — you need to git pull first",
      "Your authentication failed"
    ],
    correct: 2,
    explanation: "GitHub has commits your local clone is missing. Git refuses to overwrite them. Run `git pull` to merge the remote commits into your branch, then `git push` again. NEVER use `git push --force` to bypass this — it overwrites the other person's work."
  },
  {
    question: "What is the safest authentication method for a new student pushing their first repo to GitHub?",
    options: [
      "Type your GitHub password into the terminal",
      "HTTPS + Personal Access Token (PAT) — generate a PAT in GitHub settings and use it as the 'password' when prompted",
      "Copy your password into the URL like https://user:pass@github.com/...",
      "Disable authentication on the repo"
    ],
    correct: 1,
    explanation: "GitHub disabled password authentication for git operations years ago. You either use a Personal Access Token (PAT) over HTTPS — easiest to set up — or an SSH key — cleaner long-term. Both are safe; never embed passwords in URLs and never type your actual GitHub login password into a git command."
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
          {score >= 4 ? "Excellent! You understand the git mental model." : score >= 3 ? "Good — review the four states (working/staged/committed/pushed)." : "Review the lesson before moving on."}
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
    title: "You want to see which files have changed",
    options: ["git status", "git add .", "git commit -m 'changes'", "git push", "git pull", "git restore <file>", "git log"],
    correct: "git status",
    explanation: "`git status` shows the current state of every file — modified, staged, untracked. It is the most-used command and the answer 80% of the time when you are confused about git."
  },
  {
    title: "You finished a feature and want to record a snapshot locally (not push yet)",
    options: ["git status", "git add . && git commit -m 'add feature'", "git push", "git pull", "git restore .", "git log"],
    correct: "git add . && git commit -m 'add feature'",
    explanation: "Two-step: `git add .` stages all changes, then `git commit -m '...'` saves the snapshot locally. The commit is local only until you `git push`."
  },
  {
    title: "You accidentally typed random characters into app.py and want to throw away the change (revert to the last committed version)",
    options: ["git push", "git commit -m 'undo'", "git restore app.py", "git status", "Delete app.py and pull again"],
    correct: "git restore app.py",
    explanation: "`git restore <file>` discards uncommitted changes in the working directory and reverts the file to its last committed state. Use it when you want to throw away a recent edit."
  },
  {
    title: "Your committed code is on your laptop. You want to upload it to GitHub.",
    options: ["git status", "git add .", "git commit", "git push", "git pull"],
    correct: "git push",
    explanation: "`git push` uploads your local commits to the remote (GitHub). It only works after `git commit` — push moves committed snapshots, not uncommitted edits."
  },
  {
    title: "A colleague pushed changes to GitHub. You want to pull those changes down to your laptop before you start working.",
    options: ["git status", "git push", "git pull", "git commit", "git restore"],
    correct: "git pull",
    explanation: "`git pull` fetches commits from GitHub and merges them into your local branch. Always pull before starting work if anyone else might have pushed in between."
  },
  {
    title: "You ran `git push` and got: 'Updates were rejected because the remote contains work that you do not have.'",
    options: ["git push --force", "git pull, then git push again", "Delete the repo and start over", "git restore ."],
    correct: "git pull, then git push again",
    explanation: "GitHub has commits you don't. `git pull` brings them into your branch and merges. Then `git push` works. NEVER `--force` push to fix this — it overwrites your colleague's work."
  }
];

export default function Practice() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  const s = scenarios[current];

  const check = () => {
    setScores([...scores, selected === s.correct ? 1 : 0]);
    setSubmitted(true);
  };

  const next = () => {
    setCurrent(c => c + 1);
    setSelected(null);
    setSubmitted(false);
  };

  const reset = () => {
    setCurrent(0); setSelected(null); setSubmitted(false); setScores([]);
  };

  const total = scores.reduce((a, b) => a + b, 0);

  if (current >= scenarios.length) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Git Command Picker Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {total} / {scenarios.length}</p>
        <div style={{ background: total >= 5 ? '#d4edda' : total >= 4 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {total >= 5 ? "Excellent! You know the day-to-day git commands." : total >= 4 ? "Good — review the recovery scenarios (restore, pull-then-push)." : "Review the lesson on git states and commands."}
        </div>
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / scenarios.length) * 100}%` }} />
      </div>
      <h3>Scenario {current + 1}: {s.title}</h3>
      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, color: '#444' }}>Which git command (or sequence) is correct?</p>
      {s.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(opt)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt === s.correct ? '#198754' : opt === selected ? '#dc3545' : '#dee2e6') : opt === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt === s.correct ? '#d4edda' : opt === selected && opt !== s.correct ? '#f8d7da' : '#fff') : '#fff',
          fontFamily: 'monospace'
        }}>{opt}</div>
      ))}

      {!submitted && <button onClick={check} disabled={!selected} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', opacity: !selected ? 0.5 : 1 }}>Submit</button>}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>{selected === s.correct ? 'Correct!' : 'Not quite.'}</strong></p>
          <p>{s.explanation}</p>
          <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{current + 1 < scenarios.length ? 'Next Scenario' : 'See Final Score'}</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 4 OF 7: Build the Medical App (Gradio + SQLite)

**Estimated time:** 30 minutes (12 min content / 18 min lab)

---

### Instructor Introduction

"Project is set up, secrets are safe, code is on GitHub. Now let's put something real inside it. We'll build a small Cockcroft-Gault calculator with a Gradio UI and a SQLite table of nephrotoxic drugs. The shape — Python logic + a small database + a UI — is exactly the shape of iNotes and half the tools we ship at KHCC."

---

### NotebookLM Summary

**Gradio** turns a Python function into a web UI in about ten lines. You write a normal function — `def calculate_crcl(age, weight, creatinine, sex): ...` — and pass it to `gr.Interface(fn=calculate_crcl, inputs=[...], outputs=[...])`. Gradio generates a browser UI with the right input widgets, runs the function when the user clicks Submit, and displays the return value. No HTML, no JavaScript, no front-end build step. The trade-off is that you get Gradio's look-and-feel — but for clinical demos and internal tools, that is exactly what you want.

**SQLite** is a database that lives in a single file with no server. There is no installation, no daemon, no port to configure — just a `.db` file on disk. Python's standard library includes `sqlite3` so there is nothing to pip-install. SQLite is the right choice when your app has a small structured dataset (drugs, lookup tables, configuration), a single user at a time, and zero ops budget. iNotes and many AIDI prototypes start as SQLite.

The **Cockcroft-Gault formula** estimates creatinine clearance (CrCl) — a proxy for kidney function — from age, weight, and serum creatinine: `CrCl = ((140 − age) × weight) / (72 × serum_creatinine)`. The result is in mL/min. For females, multiply the result by **0.85** (the female correction factor) because women have lower muscle mass at the same weight. CrCl below 60 mL/min is moderate impairment; below 30 is severe. Many nephrotoxic drugs require dose reduction or avoidance below specific CrCl thresholds.

Our project has two Python files. **`init_db.py`** creates `drugs.db` and seeds it with five nephrotoxic drugs (vancomycin, gentamicin, NSAIDs, contrast media, metformin) each with a CrCl threshold below which the drug must be flagged. **`app.py`** defines `calculate_crcl(age, weight, creatinine, sex)` which computes CrCl, queries `drugs.db` for any drug whose threshold the patient's CrCl falls below, and returns a formatted alert string. The Gradio interface uses `gr.Number` for age/weight/creatinine, `gr.Radio(['male', 'female'])` for sex, and `gr.Textbox` for the alert output.

The **auto-init pattern** is critical for deployment. At the top of `app.py`: `if not os.path.exists('drugs.db'): import init_db; init_db.create_db()`. Locally this means anyone running the app for the first time gets the DB created automatically. On Hugging Face Spaces (Lesson 5) this is the only reason your app works on first deploy — the Space starts from a fresh filesystem and your `.db` file is in `.gitignore` so it is not in the repo.

SQLite queries must use **parameterized queries** — `cursor.execute("SELECT * FROM drugs WHERE threshold > ?", (crcl,))` — not string formatting. Even for a toy demo, parameterization is the habit. Real systems that interpolate user input into SQL strings are how Bobby Tables happens.

The full test case for the lab: age 65, weight 70 kg, creatinine 1.8 mg/dL, female → CrCl ≈ ((140 − 65) × 70) / (72 × 1.8) × 0.85 ≈ 34 mL/min × 0.85 → actually ≈ 28 mL/min once you re-check (use ~26-28 range). All five drugs flagged. Then the workflow: build → run locally → test → `git add .` → `git commit -m "add CrCl app"` → `git push`.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What is the Cockcroft-Gault formula for creatinine clearance (CrCl) in males?",
    options: [
      "CrCl = age × weight / (72 × creatinine)",
      "CrCl = ((140 − age) × weight) / (72 × serum_creatinine)",
      "CrCl = weight / (age × creatinine)",
      "CrCl = serum_creatinine × 0.85"
    ],
    correct: 1,
    explanation: "Cockcroft-Gault: CrCl = ((140 − age) × weight_kg) / (72 × serum_creatinine_mg/dL). For females, multiply the result by 0.85. The formula gives an estimate of kidney filtration in mL/min — the basis for nephrotoxic drug dosing decisions."
  },
  {
    question: "Why do we multiply the Cockcroft-Gault result by 0.85 for female patients?",
    options: [
      "To compensate for lower muscle mass at the same body weight",
      "Because females have higher creatinine production",
      "It's an arbitrary safety margin",
      "Females have larger kidneys"
    ],
    correct: 0,
    explanation: "Serum creatinine reflects muscle mass. At the same weight, women on average have less muscle than men, which means lower creatinine production. The original Cockcroft-Gault was derived in men; the 0.85 correction empirically adjusts for the average sex difference in muscle mass."
  },
  {
    question: "In Gradio, you want the user to enter a number (age). Which component is correct?",
    options: [
      "gr.Textbox",
      "gr.Number",
      "gr.Radio",
      "gr.Slider only"
    ],
    correct: 1,
    explanation: "gr.Number is the numeric input — it enforces that the user enters a number and passes it to your Python function as a float. gr.Textbox would pass a string you'd have to parse. gr.Radio is for choosing between fixed options (like sex). gr.Slider works too but is overkill for free-form age entry."
  },
  {
    question: "Which SQL is correct for looking up drugs whose threshold exceeds the patient's CrCl?",
    options: [
      "cursor.execute(f\"SELECT * FROM drugs WHERE threshold > {crcl}\")",
      "cursor.execute(\"SELECT * FROM drugs WHERE threshold > ?\", (crcl,))",
      "cursor.execute(\"SELECT * FROM drugs WHERE threshold > \" + str(crcl))",
      "cursor.execute(\"SELECT * FROM drugs WHERE threshold > %s\" % crcl)"
    ],
    correct: 1,
    explanation: "Use parameterized queries (the `?` placeholder with a tuple). The other three interpolate Python values into the SQL string — they are SQL injection vulnerabilities. Even for a toy demo, parameterization is the habit. Real clinical systems must use it."
  },
  {
    question: "Why does app.py auto-initialize drugs.db on startup (`if not os.path.exists('drugs.db'): init_db.create_db()`)?",
    options: [
      "It makes the app start faster",
      "Because drugs.db is in .gitignore, so when the app deploys to Hugging Face Spaces, the DB file isn't in the repo and must be created on first run",
      "SQLite requires re-initialization every time",
      "It's a Gradio requirement"
    ],
    correct: 1,
    explanation: "drugs.db is in .gitignore (databases may contain data — exclude by default). So when the Space deploys, the file isn't there. The auto-init pattern checks if the DB exists and creates it from init_db.py if not. Without this, the app would crash on first deploy."
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
          {score >= 4 ? "Excellent! You understand the formula, Gradio, and the auto-init pattern." : score >= 3 ? "Good — review the parameterized query and auto-init points." : "Review the lesson before moving on."}
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

const slots = [
  {
    id: 'formula',
    prompt: "The Cockcroft-Gault formula for males. CrCl = ?",
    options: [
      "((140 - age) * weight) / (72 * creatinine)",
      "(age * weight) / (72 * creatinine)",
      "(140 + age) * weight / creatinine",
      "weight / (age * creatinine)"
    ],
    correct: "((140 - age) * weight) / (72 * creatinine)"
  },
  {
    id: 'female',
    prompt: "After computing CrCl, if sex == 'female', multiply by what?",
    options: ["0.85", "1.15", "0.5", "no adjustment"],
    correct: "0.85"
  },
  {
    id: 'sql',
    prompt: "SQL to find drugs whose threshold is above the patient's CrCl (so they should be flagged):",
    options: [
      "cursor.execute(\"SELECT name FROM drugs WHERE threshold > ?\", (crcl,))",
      "cursor.execute(f\"SELECT name FROM drugs WHERE threshold > {crcl}\")",
      "cursor.execute(\"SELECT name FROM drugs\")",
      "cursor.execute(\"DROP TABLE drugs\")"
    ],
    correct: "cursor.execute(\"SELECT name FROM drugs WHERE threshold > ?\", (crcl,))"
  }
];

const testCase = { age: 65, weight: 70, creatinine: 1.8, sex: 'female' };

function computeExpected(choices) {
  if (choices.formula !== "((140 - age) * weight) / (72 * creatinine)") return null;
  let crcl = ((140 - testCase.age) * testCase.weight) / (72 * testCase.creatinine);
  if (testCase.sex === 'female') {
    if (choices.female === '0.85') crcl *= 0.85;
    else if (choices.female === '1.15') crcl *= 1.15;
    else if (choices.female === '0.5') crcl *= 0.5;
  }
  return crcl;
}

export default function Practice() {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (id, val) => { if (!submitted) setChoices({ ...choices, [id]: val }); };

  const check = () => setSubmitted(true);
  const reset = () => { setChoices({}); setSubmitted(false); };

  const allCorrect = slots.every(s => choices[s.id] === s.correct);
  const expected = computeExpected(choices);
  const expectedTarget = 28.3; // ((140-65)*70)/(72*1.8) * 0.85

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Build the CrCl Logic</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        Fill in the three missing pieces of the <code>calculate_crcl</code> function. Then we'll run it on the test case <strong>age=65, weight=70 kg, creatinine=1.8 mg/dL, female</strong> and check the answer.
      </p>

      <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 16, borderRadius: 8, fontSize: 13, overflow: 'auto' }}>
{`def calculate_crcl(age, weight, creatinine, sex):
    # 1. Compute CrCl using Cockcroft-Gault:
    crcl = ${choices.formula || '...'}

    # 2. Apply female correction factor:
    if sex == 'female':
        crcl = crcl * ${choices.female || '...'}

    # 3. Query nephrotoxic drugs whose threshold exceeds this CrCl:
    conn = sqlite3.connect('drugs.db')
    cursor = conn.cursor()
    ${choices.sql || '# SQL here'}
    flagged = [row[0] for row in cursor.fetchall()]
    conn.close()

    return f"CrCl: {crcl:.1f} mL/min. Flagged: {', '.join(flagged) or 'none'}"`}
      </pre>

      {slots.map(s => (
        <div key={s.id} style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>{s.prompt}</p>
          {s.options.map((opt, i) => {
            const isChosen = choices[s.id] === opt;
            const isRight = submitted && opt === s.correct;
            const isWrong = submitted && isChosen && opt !== s.correct;
            return (
              <div key={i} onClick={() => set(s.id, opt)} style={{
                padding: '10px 14px', margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${isRight ? '#198754' : isWrong ? '#dc3545' : isChosen ? '#0d6efd' : '#dee2e6'}`,
                background: isRight ? '#d4edda' : isWrong ? '#f8d7da' : '#fff',
                fontFamily: 'monospace', fontSize: 13
              }}>{opt}</div>
            );
          })}
        </div>
      ))}

      {!submitted && (
        <button onClick={check} disabled={Object.keys(choices).length < slots.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff',
          cursor: 'pointer', opacity: Object.keys(choices).length < slots.length ? 0.5 : 1
        }}>Check My Code</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Test case:</strong> age=65, weight=70 kg, creatinine=1.8, female</p>
          {expected !== null ? (
            <p>Your formula produces CrCl ≈ <strong>{expected.toFixed(1)} mL/min</strong>. Expected: ~{expectedTarget} mL/min.</p>
          ) : (
            <p style={{ color: '#dc3545' }}>Your formula is wrong — can't compute a sensible CrCl.</p>
          )}
          {allCorrect ? (
            <p style={{ color: '#198754', fontWeight: 'bold' }}>All three pieces correct. With CrCl ≈ 28 mL/min, all five drugs (vancomycin, gentamicin, NSAIDs, contrast media, metformin) would be flagged.</p>
          ) : (
            <p style={{ color: '#dc3545' }}>One or more pieces are wrong. Review the lesson and try again.</p>
          )}
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 5 OF 7: Deploy to Hugging Face Space

**Estimated time:** 25 minutes (10 min content / 15 min lab)

---

### Instructor Introduction

"GitHub holds your code. A Hugging Face Space actually runs it. In 10 minutes your app is going to be live on a URL anyone in the world can open. That's the magic of Spaces — and also the thing that should make you nervous about what you put inside them. Spaces are public infrastructure. They are perfect for demos. They are not where PHI ever goes."

---

### NotebookLM Summary

A **Hugging Face Space** is a git repo that auto-deploys. You create a Space on huggingface.co, choose a runtime (Gradio, Streamlit, or static), and push code to it just like you push to GitHub. Every push triggers a rebuild — HF installs your `requirements.txt`, runs the file specified by `app_file:` (usually `app.py`), and exposes it on a public URL like `https://huggingface.co/spaces/yourname/your-app`. There is no Dockerfile to write, no server to configure, no DNS to set up. It is the easiest production deploy in machine learning.

The **Gradio SDK** is what tells HF "find app.py and run it as a Gradio app." You select it during Space creation. HF auto-detects the Gradio version from your `requirements.txt`, builds a container, and starts your `gr.Interface().launch()` on the right port. You write zero infrastructure code.

The required **README.md header** is YAML front-matter at the top of the README. HF reads it to configure the Space:

```
---
title: CrCl Calculator
emoji: 💊
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---
```

Without this header (or with the wrong `app_file:`), HF cannot start your Space.

**Secrets** on Spaces never go in code. You add them in Settings → Variables and secrets — HF injects them as environment variables at runtime, exactly as `os.getenv("OPENAI_API_KEY")` reads them locally from `.env`. The values are not visible in the repo, in logs, or in the build output. This is the secure equivalent of `.env` for cloud deploys.

The **free tier** runs on shared CPU, sleeps after about 48 hours of inactivity, and wakes on the next request (with about 30 seconds of cold-start delay). That is fine for teaching and demos. It is not appropriate for anything time-sensitive or anything carrying real clinical traffic.

The **deploy workflow** for our CrCl app: (1) Create a new Space on huggingface.co — pick "Gradio" SDK, MIT license, public visibility. (2) Clone the Space repo to a separate folder on your laptop — Spaces are git repos so `git clone https://huggingface.co/spaces/yourname/crcl-calculator` works. (3) Authenticate — username + access token (write scope, created in HF settings). (4) Copy `app.py`, `init_db.py`, and `requirements.txt` from your local project into the Space folder. (5) Write the README with the YAML header above. (6) `git add . && git commit -m "initial deploy" && git push`. (7) Watch the build log on the Space's web page — it shows the pip install and any startup errors. About 60-90 seconds later your app is live.

**Spaces are public infrastructure.** Anyone in the world can open the URL. Anyone in the world can read the repo. Anyone in the world can see your README, your `app.py`, and your `requirements.txt`. The CrCl calculator is fine because the formula is public knowledge and the seed drugs list is from textbooks. But the moment your app touches a real patient identifier, a real KHCC database, or anything PHI-adjacent — it does not belong on a public Space. Use Spaces for demos and learning; use internal KHCC infrastructure for real clinical workloads.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "What is a Hugging Face Space, architecturally?",
    options: [
      "A managed Kubernetes cluster you configure with YAML",
      "A git repo that HF auto-deploys — every push triggers a rebuild and your app goes live on a public URL",
      "A Docker image you build and upload",
      "A Jupyter notebook hosted on HF servers"
    ],
    correct: 1,
    explanation: "A Space is just a git repo with a special README header. Push to it, HF rebuilds the container, runs your app_file, and exposes it on huggingface.co/spaces/yourname/your-app. There is no Dockerfile, no server config — the platform handles it."
  },
  {
    question: "Your Space build fails because HF doesn't know which Python file to run. What did you forget?",
    options: [
      "The .gitignore file",
      "The YAML front-matter header in README.md with `app_file: app.py`",
      "To install gradio globally",
      "To convert the file to a Jupyter notebook"
    ],
    correct: 1,
    explanation: "HF reads the YAML header at the top of README.md to configure the Space. The `app_file:` field tells it which Python file to run. Without it (or with the wrong value), HF doesn't know what to start. The other required fields are `title`, `sdk`, `sdk_version`."
  },
  {
    question: "Where do you put the OpenAI API key for a deployed Space?",
    options: [
      "In app.py as a hardcoded string",
      "In a committed .env file in the Space repo",
      "In Settings → Variables and secrets on the Space's settings page — HF injects them as environment variables at runtime",
      "In the README.md header"
    ],
    correct: 2,
    explanation: "Space secrets go in the Settings → Variables and secrets panel. HF injects them as environment variables, so `os.getenv('OPENAI_API_KEY')` works exactly as it does locally with .env. They are never in the repo, never in build logs, never in the public URL."
  },
  {
    question: "What are the limitations of the free Spaces tier?",
    options: [
      "It costs $50/month",
      "It runs on shared CPU, sleeps after ~48 hours of inactivity, and has a ~30-second cold start when waking — fine for demos, not for time-sensitive workloads",
      "It only supports JavaScript apps",
      "There is no free tier"
    ],
    correct: 1,
    explanation: "Free tier: shared CPU (no GPU), sleeps when idle, wakes on next request with ~30s cold start. Great for teaching, demos, portfolios. Not appropriate for time-critical clinical traffic — for that you need either paid HF compute or internal KHCC infrastructure."
  },
  {
    question: "Why does it matter that Hugging Face Spaces are public infrastructure?",
    options: [
      "It doesn't — the data is encrypted",
      "Because anyone in the world can read your repo and call your URL — PHI, real patient identifiers, and internal KHCC data must never go on a public Space",
      "Because HF charges per visitor",
      "Because Spaces are slow"
    ],
    correct: 1,
    explanation: "Public Spaces mean public app, public repo, public README, public requirements.txt, public seed data — anyone can read them all. The CrCl calculator is fine because the formula and drug list are public knowledge. Real patient data goes nowhere near a public Space. Use them for demos and learning; KHCC clinical workloads run on KHCC infrastructure."
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
          {score >= 4 ? "Excellent! You understand Spaces architecture and the public-infrastructure boundary." : score >= 3 ? "Good — review the secrets injection and free-tier limits." : "Review the lesson — especially the public-infrastructure point."}
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
    label: "OPENAI_API_KEY = 'sk-...' hardcoded in app.py",
    safe: false,
    reason: "Hardcoded keys end up in the public Space repo — anyone can read them. Use Settings → Variables and secrets and read with os.getenv()."
  },
  {
    label: "OPENAI_API_KEY added in Settings → Variables and secrets",
    safe: true,
    reason: "HF injects this as an environment variable at runtime. Never visible in the repo, build logs, or public URL. This is the correct pattern."
  },
  {
    label: "Real patient names in seed_data.csv committed to the Space repo",
    safe: false,
    reason: "Spaces are PUBLIC. Patient names — even just for 'sample' data — are PHI and must never be on a public Space. Use synthetic data with no resemblance to real patients."
  },
  {
    label: "drugs.db generated at startup by init_db.py with five textbook drug names",
    safe: true,
    reason: "Public drug names from medical textbooks are not sensitive. Auto-init at startup is the correct pattern because drugs.db is .gitignored and not in the repo."
  },
  {
    label: "Connecting the Space to a KHCC internal database via VPN credentials in code",
    safe: false,
    reason: "Internal hospital databases must NEVER be accessible from public infrastructure. Even with the credentials in Variables, exposing a clinical database endpoint to a public app is an unacceptable risk."
  },
  {
    label: "Public README.md describing the CrCl formula and listing the seeded drugs",
    safe: true,
    reason: "The formula is public textbook content. The drug list is public knowledge. Documenting them in the README is fine and actually helpful — readers know what the app does and trust the calculation."
  }
];

export default function Practice() {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (i, val) => { if (!submitted) setChoices({ ...choices, [i]: val }); };

  const check = () => setSubmitted(true);
  const reset = () => { setChoices({}); setSubmitted(false); };

  const score = scenarios.filter((s, i) => choices[i] === s.safe).length;

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Deployment Sanity Check</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        For each scenario, decide: <strong>Safe to deploy</strong> (the right pattern) or <strong>Unsafe to deploy</strong> (don't do this on a public Space)?
      </p>

      {scenarios.map((s, i) => {
        const userChoice = choices[i];
        const correct = submitted && userChoice === s.safe;
        const wrong = submitted && userChoice !== undefined && userChoice !== s.safe;
        return (
          <div key={i} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8,
            border: `2px solid ${correct ? '#198754' : wrong ? '#dc3545' : '#dee2e6'}`,
            background: correct ? '#d4edda' : wrong ? '#f8d7da' : '#fff'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{s.label}</p>
            <button onClick={() => choose(i, true)} disabled={submitted} style={{
              marginRight: 8, padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
              border: `2px solid ${userChoice === true ? '#198754' : '#ccc'}`,
              background: userChoice === true ? '#198754' : '#fff', color: userChoice === true ? '#fff' : '#000'
            }}>Safe</button>
            <button onClick={() => choose(i, false)} disabled={submitted} style={{
              padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
              border: `2px solid ${userChoice === false ? '#dc3545' : '#ccc'}`,
              background: userChoice === false ? '#dc3545' : '#fff', color: userChoice === false ? '#fff' : '#000'
            }}>Unsafe</button>
            {submitted && (
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14 }}>
                <strong>{s.safe ? "Safe." : "Unsafe."}</strong> {s.reason}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} disabled={Object.keys(choices).length < scenarios.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff',
          cursor: 'pointer', opacity: Object.keys(choices).length < scenarios.length ? 0.5 : 1
        }}>Check My Choices ({Object.keys(choices).length}/{scenarios.length})</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {score} / {scenarios.length}</strong></p>
          <p>{score === scenarios.length ? "Perfect — you have the public-infrastructure mindset." : score >= 4 ? "Good — but review the misses. Each unsafe call is how patient data leaks." : "Review the lesson. Public Spaces are powerful AND risky."}</p>
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

---

## LESSON 6 OF 7: Python Instead of the Command Line — os, pathlib, shutil, subprocess

**Estimated time:** 20 minutes (8 min content / 12 min lab)

---

### Instructor Introduction

> "You've been using the terminal — `ls`, `mkdir`, `cp`, `rm`. That works fine on your Mac. But the moment you ship a script to a Windows colleague, half those commands stop working. `ls` becomes `dir`, `cp` becomes `copy`, and your beautiful bash one-liner is suddenly broken across the office. Python's standard library gives you the same power — but it runs the same way on every operating system. Today you learn the four modules that replace the command line: `pathlib` for paths, `os` for environment and walking, `shutil` for copying and moving, and `subprocess` when you really do need to call out to a shell. By the end of this lesson, you'll be able to script clinical file workflows that run identically on your laptop, a KHCC server, and a Hugging Face Space."

---

### NotebookLM Summary

Clinical data pipelines move files. Every day, AIDI scripts at KHCC pull CSV extracts from VistA, organize them into dated folders, archive the previous day's batch, and trigger a downstream R analysis. Doing that in bash works on Linux servers but breaks the moment a colleague tries to run the same logic on a Windows laptop. Python's standard library solves this by giving you the same file operations in a single cross-platform API.

The four modules you need are `pathlib`, `os`, `shutil`, and `subprocess`. `pathlib` is the modern path-handling library — `Path("data") / "vitals.csv"` works on Windows and Mac equally well, replacing fragile string concatenation. Path objects have methods for everything: `.exists()`, `.is_dir()`, `.glob("*.csv")`, `.mkdir(parents=True, exist_ok=True)`, `.read_text()`, `.write_text()`. This is the first thing to reach for in any clinical script.

The `os` module covers environment variables (`os.getenv("OPENAI_API_KEY")`, the same pattern from Lesson 2), platform detection (`os.name`), and the workhorse `os.walk()` which recursively traverses a directory tree yielding `(dirpath, dirnames, filenames)` for each folder. `os.walk` is how you build "find all PDF reports older than 30 days" scripts without ever touching `find` or `Get-ChildItem`. The newer `pathlib` provides `.rglob("*.pdf")` for the same use case in a more readable form.

The `shutil` module handles higher-level file operations: `shutil.copy()` and `shutil.copy2()` copy files, `shutil.copytree()` clones directory trees, `shutil.move()` renames or moves across drives, `shutil.rmtree()` recursively deletes a directory, and `shutil.disk_usage()` checks free space. In clinical contexts, `shutil.copy2` is usually what you want because it preserves modification times — useful for audit trails. `shutil.make_archive()` packages a folder into a zip or tar in one call, perfect for daily backups.

The `subprocess` module is your escape hatch when you really do need to call a shell tool — `git`, `pdftotext`, a domain-specific binary. `subprocess.run(["git", "status"], capture_output=True, text=True)` is the modern pattern: pass arguments as a list (no shell injection), capture stdout, check the returncode. Avoid `shell=True` unless you absolutely need shell features, and never pass untrusted user input to a shell — that's how command injection happens.

The clinical pattern at KHCC: a single Python script using `pathlib` for path math, `os.walk` to find files, `shutil.copy2` to organize them, and `subprocess.run` to call out only when needed. Everything else stays inside Python where it's testable, debuggable, and cross-platform.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the official Python docs for each module as sources, and generate an *Audio Overview* for commute-friendly review.

---

### Quiz — Interactive Artifact

```jsx
import React, { useState } from 'react';

const questions = [
  {
    question: "You write Path('data') / 'patients' / 'vitals.csv' in your KHCC pipeline. A colleague runs it on Windows. What happens?",
    options: [
      "It crashes because of forward slashes",
      "It works — pathlib handles OS-specific separators automatically",
      "It works only if you also import os.path",
      "It produces a malformed path that pandas can't read"
    ],
    correct: 1,
    explanation: "Path objects automatically use the correct separator for the operating system. That's the whole point of pathlib — write the same code, run it anywhere. String concatenation with hardcoded slashes is what breaks on Windows."
  },
  {
    question: "You want to find all CSV files inside data/ and every subfolder beneath it. Which is correct?",
    options: [
      "Path('data').glob('*.csv')",
      "Path('data').rglob('*.csv')",
      "Path('data').list('*.csv', recursive=True)",
      "Path('data').find('*.csv')"
    ],
    correct: 1,
    explanation: "glob is one level only. rglob is recursive — it walks into every subdirectory. For 'find all PDFs anywhere under reports/' use rglob('*.pdf'). Forgetting this is the most common pathlib mistake."
  },
  {
    question: "You're writing a script that needs to call git. Which subprocess.run call is SAFEST?",
    options: [
      "subprocess.run(f'git commit -m {user_message}', shell=True)",
      "subprocess.run(['git', 'commit', '-m', user_message], shell=True)",
      "subprocess.run(['git', 'commit', '-m', user_message], capture_output=True, text=True, check=True)",
      "subprocess.run('git commit -m ' + user_message)"
    ],
    correct: 2,
    explanation: "Pass arguments as a list (no shell injection), avoid shell=True, capture output, and use check=True to raise on failure. Options 1 and 4 are vulnerable to command injection if user_message contains shell metacharacters like ; or && — exactly how clinical scripts get compromised."
  },
  {
    question: "You write shutil.rmtree('data') and run it. What happens, and is it recoverable?",
    options: [
      "Files go to the recycle bin, recoverable for 30 days",
      "Files are permanently deleted with no recycle bin",
      "A confirmation dialog appears before deletion",
      "Only empty subfolders are removed"
    ],
    correct: 1,
    explanation: "rmtree is permanently destructive — no recycle bin, no undo. In clinical contexts where you might accidentally delete a patient data folder, always print the target path and require confirmation BEFORE calling rmtree. Better still, use shutil.move to a 'trash/' folder you can review."
  },
  {
    question: "Path('archive/2026-03-15').mkdir(parents=True, exist_ok=True) — what do parents=True and exist_ok=True do?",
    options: [
      "parents=True copies parent folders; exist_ok=True overwrites",
      "parents=True creates missing intermediate folders; exist_ok=True doesn't raise if the folder already exists",
      "parents=True sets correct permissions; exist_ok=True creates a .gitignore",
      "Both are deprecated and ignored in modern Python"
    ],
    correct: 1,
    explanation: "parents=True is like mkdir -p — it creates archive/ if it doesn't exist before creating 2026-03-15/. exist_ok=True suppresses the error if the folder already exists (idempotent, so the script can be re-run safely). Both flags are essential for daily clinical scripts."
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
          {score >= 4 ? "Excellent! Your scripts will run on any OS." : score >= 3 ? "Good grasp — review subprocess safety and rmtree carefully." : "Review pathlib, shutil, and subprocess before writing production scripts."}
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

const challenges = [
  {
    bash: "mkdir -p archive/2026-03-15",
    description: "Create a folder, including any missing parent folders. Don't error if it already exists.",
    options: [
      { code: "Path('archive/2026-03-15').mkdir()", correct: false, reason: "Fails if archive/ doesn't exist, and errors if the folder already exists." },
      { code: "Path('archive/2026-03-15').mkdir(parents=True, exist_ok=True)", correct: true, reason: "parents=True creates archive/, exist_ok=True makes it idempotent." },
      { code: "os.mkdir('archive/2026-03-15')", correct: false, reason: "os.mkdir only creates the deepest folder, fails if archive/ doesn't exist." },
      { code: "shutil.copytree('.', 'archive/2026-03-15')", correct: false, reason: "copytree clones a tree of files, not what we want." }
    ]
  },
  {
    bash: "find . -name '*.csv'",
    description: "Find all CSV files recursively from the current directory.",
    options: [
      { code: "Path('.').glob('*.csv')", correct: false, reason: "glob is one level only — won't find files in subfolders." },
      { code: "Path('.').rglob('*.csv')", correct: true, reason: "rglob walks recursively. Equivalent to find -name." },
      { code: "os.listdir('.', recursive=True)", correct: false, reason: "os.listdir has no recursive option — it's flat only." },
      { code: "subprocess.run(['find', '.', '-name', '*.csv'])", correct: false, reason: "Calls bash find — won't work on Windows. The whole point is cross-platform." }
    ]
  },
  {
    bash: "cp -p source.csv backup/source.csv",
    description: "Copy a file, preserving modification time (important for audit trails).",
    options: [
      { code: "shutil.copy('source.csv', 'backup/source.csv')", correct: false, reason: "copy doesn't preserve metadata — use copy2 instead." },
      { code: "shutil.copy2('source.csv', 'backup/source.csv')", correct: true, reason: "copy2 preserves modification time and other metadata — matches cp -p." },
      { code: "shutil.copytree('source.csv', 'backup/source.csv')", correct: false, reason: "copytree is for directories, not files." },
      { code: "Path('source.csv').rename('backup/source.csv')", correct: false, reason: "rename MOVES the file (doesn't copy)." }
    ]
  },
  {
    bash: "rm -rf temp/",
    description: "Recursively delete a folder and everything in it.",
    options: [
      { code: "os.rmdir('temp')", correct: false, reason: "rmdir only removes EMPTY directories — fails if temp/ has files." },
      { code: "Path('temp').unlink()", correct: false, reason: "unlink is for files, not directories." },
      { code: "shutil.rmtree('temp')", correct: true, reason: "rmtree recursively deletes a directory tree. ⚠️ NO recycle bin — be sure!" },
      { code: "shutil.remove('temp')", correct: false, reason: "shutil.remove doesn't exist." }
    ]
  },
  {
    bash: "tar -czf backup.tar.gz data/",
    description: "Compress an entire folder into a single archive file.",
    options: [
      { code: "shutil.make_archive('backup', 'gztar', 'data')", correct: true, reason: "make_archive packages a folder. Format options: 'zip', 'tar', 'gztar', 'bztar'." },
      { code: "subprocess.run(['tar', '-czf', 'backup.tar.gz', 'data'])", correct: false, reason: "Works on Linux/Mac but tar isn't standard on Windows. shutil.make_archive is cross-platform." },
      { code: "shutil.copytree('data', 'backup.tar.gz')", correct: false, reason: "copytree doesn't compress — it just clones the tree." },
      { code: "Path('data').compress('backup.tar.gz')", correct: false, reason: "Path doesn't have a compress method." }
    ]
  },
  {
    bash: "git status",
    description: "Call git from inside a Python script and capture its output.",
    options: [
      { code: "subprocess.run('git status', shell=True)", correct: false, reason: "shell=True is a security risk and not needed here. Also doesn't capture output." },
      { code: "subprocess.run(['git', 'status'], capture_output=True, text=True)", correct: true, reason: "Args as list (safe), capture_output=True to read stdout, text=True for strings instead of bytes." },
      { code: "os.system('git status')", correct: false, reason: "os.system is the old way — doesn't capture output, returns only the exit code." },
      { code: "Path('.git').run('status')", correct: false, reason: "Path doesn't run commands." }
    ]
  }
];

export default function Practice() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const c = challenges[current];

  const handleSubmit = () => {
    setSubmitted(true);
    if (c.options[selected]?.correct) setScore(s => s + 1);
  };

  const next = () => {
    setCurrent(cc => cc + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (current >= challenges.length) {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Bash-to-Python Practice Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {score} / {challenges.length}</p>
        <div style={{ background: score >= 5 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {score >= 5 ? "Excellent — your clinical scripts will run anywhere." : score >= 3 ? "Good — review shutil.copy2 vs shutil.copy, and subprocess.run safety." : "Review the lesson and the cheat sheet before writing production scripts."}
        </div>
        <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setSubmitted(false); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / challenges.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Challenge {current + 1} of {challenges.length}</p>

      <h3 style={{ marginBottom: 8 }}>Bash command:</h3>
      <pre style={{ background: '#1e1e1e', color: '#a3e635', padding: 12, borderRadius: 6, fontSize: 14, fontFamily: 'monospace' }}>{c.bash}</pre>

      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, marginTop: 12 }}>{c.description}</p>

      <h4 style={{ marginTop: 16 }}>Pick the cross-platform Python equivalent:</h4>
      {c.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(i)} style={{
          padding: 12, margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : i === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt.correct ? '#d4edda' : i === selected && !opt.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap' }}>{opt.code}</pre>
          {submitted && (
            <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13, color: opt.correct ? '#198754' : '#666' }}>
              <strong>{opt.correct ? '✅' : (i === selected ? '❌' : '○')}</strong> {opt.reason}
            </p>
          )}
        </div>
      ))}

      {!submitted && selected !== null && (
        <button onClick={handleSubmit} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answer</button>
      )}

      {submitted && (
        <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{current + 1 < challenges.length ? 'Next Challenge' : 'See Results'}</button>
      )}
    </div>
  );
}
```

---

## LESSON 7 OF 7: Wrap-Up — Review & Consolidation

**Estimated time:** 5 minutes

---

### Instructor Introduction

"Step back and look at what you have done in two hours. You started this session as a notebooks-only developer. You finish it with a project that lives in a folder on your laptop, is tracked in git, is on GitHub, and is running live on a public URL anyone in the world can open. That is the full local-development loop. From here on, every clinical AI tool you build can follow the same path — and every habit you learned today (venv, .gitignore, secrets in .env, parameterized SQL, public-infrastructure awareness) will protect you and KHCC's patients."

---

### Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|---|---|---|
| 1 | VS Code Setup — Terminal, venv, requirements, README | Folder = project; venv for isolation; select interpreter; requirements.txt for reproducibility | Every AIDI pipeline at KHCC is a folder, not a notebook — this is the entry point |
| 2 | .gitignore and the Secrets Mindset | Three-file pattern (.env, .env.example, .gitignore); rotate-don't-hide leaked keys; "would I print this in a journal?" | Foundational habit before touching real API keys, patient data, or KHCC internal systems |
| 3 | Git + GitHub from VS Code | Four states (working/staged/committed/pushed); Source Control panel = git CLI buttons; HTTPS+PAT or SSH | Every clinical tool you build will be code-reviewed, versioned, and collaborated on through git |
| 4 | Build the Medical App (Gradio + SQLite) | Gradio = function-to-UI; SQLite = single-file DB; Cockcroft-Gault formula; auto-init pattern for deploy | The Python+DB+UI shape is exactly the shape of iNotes and many KHCC internal tools |
| 5 | Deploy to Hugging Face Space | Space = auto-deploying git repo; YAML README header; secrets in Settings → Variables; public infrastructure boundary | Spaces are perfect for demos and learning; PHI and KHCC clinical traffic stay on internal infrastructure |
| 6 | Python Instead of the Command Line — os, pathlib, shutil, subprocess | pathlib for cross-platform paths; os.walk and rglob for recursive search; shutil.copy2/rmtree/make_archive for file ops; subprocess.run with arg-list (no shell=True) | AIDI file pipelines (VistA CSV extracts, archived batches, downstream R triggers) run the same on Mac laptop, Linux server, and Windows colleague's machine |

**Connecting the Dots:** This session moved you from notebooks to a complete local-development loop. Lesson 1 gave you the project foundation: a folder, a venv, an interpreter, requirements.txt. Lesson 2 made it safe to share: .gitignore and the secrets pattern that prevents the most common catastrophic mistakes in clinical AI. Lesson 3 gave you version control and collaboration: git states, the Source Control panel, GitHub authentication. Lesson 4 put something real inside: a Gradio UI, a SQLite database, the Cockcroft-Gault formula, drug alerts — the exact architectural shape of iNotes and most KHCC internal tools. Lesson 5 put it on the open internet: a Hugging Face Space, a public URL, secrets injected at runtime, the firm boundary against ever putting PHI on public infrastructure. Lesson 6 replaced the command line with Python's standard library — pathlib, os, shutil, subprocess — so the file-orchestration glue around your clinical pipelines runs identically on every operating system. Each lesson is a layer of the same stack. From now on, every clinical AI tool you build can follow the same path — and crucially, you now know which boundaries you must respect (no secrets in code, no PHI on public infrastructure, no databases without parameterized queries) when the stakes are real.

---

### Common Mistakes & Gotchas

1. **Forgetting to select the venv Python interpreter in VS Code** — The terminal uses the venv because you activated it, but VS Code's Run button uses whatever interpreter is in the status bar. Click the version in the bottom-right and pick the one inside `.venv`. This is THE most common Session 9 bug — students spend 30 minutes wondering why "gradio is not installed" when it actually is, just in the wrong Python.

2. **Committing .env or other secrets** — Once a secret is in git history, it is forever. Scrapers harvest leaked OpenAI keys within minutes. The pre-flight check is to look at the Source Control panel before pushing and confirm nothing sensitive appears. If you do leak a key, the only correct response is to rotate it immediately — do not try to delete the commit.

3. **Adding the wrong git remote URL or auth method** — Common failures: `git remote add origin` typo'd to a non-existent repo; HTTPS without a Personal Access Token (GitHub disabled password auth years ago); SSH key not yet added to GitHub. `git remote -v` shows what you currently have configured; `git remote set-url origin <new-url>` fixes a wrong URL without recreating the repo.

4. **Forgetting to auto-init the DB on Hugging Face Space startup** — `drugs.db` is in `.gitignore` so it is not in the repo. On the Space, the filesystem starts fresh. Without the `if not os.path.exists('drugs.db'): init_db.create_db()` guard at the top of `app.py`, the app crashes on first request because the database it expects does not exist.

5. **Putting API keys in code instead of HF Settings → Variables** — Spaces are public. Anyone can read your `app.py`. A hardcoded key is a key handed to the entire internet. Use the Variables and secrets panel; read with `os.getenv()`; the same code works locally (reading from `.env`) and in production (reading from HF Variables) with zero changes.

---

### Quick Self-Check (No-Code)

1. What is the single most-missed setup step that breaks VS Code's Run button even though the terminal works fine?
2. You leaked an OpenAI API key to GitHub 10 minutes ago. What is your FIRST action?
3. What are the four states of a change in git, in order?
4. Why does `app.py` need `if not os.path.exists('drugs.db'): init_db.create_db()` for Hugging Face deployment?
5. Where do secrets go on a Hugging Face Space — and where do they NOT go?

<details>
<summary>Answers</summary>

1. Forgetting to **select the venv Python interpreter** in VS Code's status bar (bottom-right). The terminal uses the venv because you activated it, but the Run button uses the default interpreter unless you change it. Symptom: terminal can import gradio, VS Code's Run cannot.

2. **Rotate the key.** Log into OpenAI, revoke the leaked key, issue a new one. Do this before doing anything else — automated scrapers find leaked keys within minutes. Cleanup of git history can come after rotation, but rotation must be first.

3. **Working directory → staged → committed → pushed.** Edit a file = working. `git add` = staged. `git commit` = committed locally. `git push` = pushed to GitHub.

4. Because `drugs.db` is listed in `.gitignore` so it is not in the repo. The HF Space starts with a fresh filesystem — no `drugs.db`. The auto-init guard creates the database from `init_db.py` on first startup. Without it, the app crashes immediately on the first request.

5. **Yes:** Settings → Variables and secrets (HF injects them as environment variables at runtime, never visible in the repo or logs). **No:** in `app.py`, in `requirements.txt`, in `README.md`, in a committed `.env`, or anywhere else in the repo. Spaces are public — anyone can read everything in the repo.
</details>

---

### NotebookLM Notebook

Create a NotebookLM notebook for this session:
1. Paste all 6 lesson summaries as text sources
2. Add the VS Code Python docs, the Gradio Quickstart, and the Hugging Face Spaces docs as URL sources
3. Generate an Audio Overview for pre-class listening
4. Use the notebook to quiz yourself on the four git states and the deploy workflow

---

### What's Next

In Session 10, you will move from a single-file Gradio app to a multi-file Django application — the framework KHCC AIDI uses for every production clinical tool. You will see how the habits you learned today (venv, requirements.txt, .gitignore, .env, git workflow, deploy boundaries) carry directly into a Django project, just with more files, a real database (Postgres on Azure), and authentication. The shape is the same. The stakes get higher as the projects approach real clinical use.

---

## SESSION 9 ASSIGNMENT: Ship Your Own Clinical Mini-App

**Due:** Before Session 10
**Estimated effort:** 4-6 hours
**Submission:** Provide GitHub URL AND Hugging Face Space URL, plus the written reflection — share both with Dr. Iyad

---

### Clinical Scenario

> Pick a small clinical calculator or lookup tool that you find useful in your own work. Build it as a standalone Gradio + SQLite app, version it on GitHub, and deploy it as a Hugging Face Space. The point is not to build something novel — it is to walk the full local-to-deployed path, end-to-end, on your own, with a use case you actually understand. Suggested ideas: a BMI calculator with obesity-class-based drug or dosing alerts, a BSA (body surface area) calculator for chemotherapy dosing, a MELD score calculator for liver disease severity, a CHA₂DS₂-VASc score for stroke risk in atrial fibrillation, or your own choice. **It must be different from the Cockcroft-Gault example built in class.**

---

### Requirements

**Part 1 — Local Project Setup (30%)**
Set up a new local project from scratch in VS Code:
- Create the project folder and open it as a VS Code workspace
- Create a `.venv` virtual environment and select it as the VS Code interpreter
- Create `requirements.txt` with at least `gradio` and `python-dotenv`
- Create `.gitignore` excluding at minimum `.env`, `.venv/`, `__pycache__/`, `*.db`, `.DS_Store`
- Create `.env.example` (committed) listing any environment variables your app uses, even if it is just `# no secrets needed for this demo`
- Create `README.md` describing what the app does, the clinical formula it uses, and how to run it locally
- Initialize git and make the first commit

**Part 2 — Build the App (30%)**
Build a Gradio + SQLite app for your chosen clinical calculator:
- Gradio UI with at least one input form
- SQLite database with at least one table, queried via parameterized queries
- At least one alert/warning output triggered by the calculation result (e.g., "BMI > 30: consider X", "MELD > 20: hepatology consult")
- Auto-init pattern: `if not os.path.exists('your.db'): import init_db; init_db.create_db()` at the top of `app.py`
- A separate `init_db.py` that creates and seeds the database
- The app must run locally with `python app.py`
- Your git history must show **at least 5 meaningful commits** (not 5 commits of "fix typo" — commits that show the project growing in distinct steps)

**Part 3 — Push to GitHub AND Deploy to Hugging Face (20%)**
- Push the project to a public GitHub repo
- Create a Hugging Face Space (Gradio SDK, MIT license, public), clone it, copy `app.py`, `init_db.py`, `requirements.txt`, and a `README.md` with the required YAML header (title, emoji, sdk, sdk_version, app_file, license)
- Push to the Space and confirm it builds and runs
- Provide BOTH URLs in your submission. The Space must load and the calculator must work end-to-end.

**Part 4 — Written Reflection (20%)**
Write 200-300 words covering all three of the following:
- **Hardest steps:** Which deployment steps gave you the most trouble — and what specifically did you have to debug? (Be concrete: name the error message, the misconfiguration, the missing file.)
- **What you would do differently for a real KHCC tool:** If this same app were going to be used by a real KHCC physician on real patient data, what would change about the architecture, the deployment target, the secrets handling, the database, and the authentication?
- **PHI concerns:** What patient-data risks would your app have if real MRNs or patient identifiers were entered into it on the current Hugging Face Space — and what would mitigate them?

---

### Grading Rubric

| Criterion | Weight | Excellent | Adequate | Insufficient |
|-----------|--------|-----------|----------|-------------|
| Local project setup (Part 1) | 25% | Correct venv, interpreter, requirements.txt, .gitignore (with all the right exclusions), .env.example, README.md, clean initial commit | One or two pieces missing or misconfigured | Multiple pieces missing; .venv or .env committed |
| App functionality (Part 2) | 25% | Clinically meaningful calculator, parameterized queries, auto-init pattern, ≥5 meaningful commits, runs locally without errors | Works but missing one element (e.g., no auto-init, hardcoded SQL, fewer commits) | Doesn't run, no DB, no alerts, or fewer than 3 commits |
| Deployment (Part 3) | 25% | Both URLs work; Space loads cleanly; calculator produces correct outputs end-to-end; YAML README header complete | Space loads but has minor issues; one URL missing | Space doesn't build or load; URL not provided |
| Reflection (Part 4) | 25% | Specific debug stories, concrete differences for a KHCC deploy, identifies real PHI risks with specific mitigations | Generic answers; identifies some issues | Vague, philosophical, no concrete details |

---

### Anti-Shortcut Rules
- Your clinical calculator must NOT be Cockcroft-Gault (we built that one together — pick a different formula)
- `.env`, `.venv/`, and `*.db` must NOT appear in your git history at any point (graders will check `git log --all -- .env .venv/`)
- Your reflection (Part 4) must reference specific error messages or specific config files you debugged — not generic statements like "deployment was hard"
- Your Hugging Face Space must use the Secrets/Variables panel for any API keys, not hardcoded values — even if your app does not actually call an external API, demonstrate the pattern by referencing at least one environment variable via `os.getenv()`
- At least one of your alert outputs must use a clinically-justified threshold (cite the source in a comment or in the README — e.g., "BMI ≥30 = obesity class I per WHO" or "MELD ≥15 = transplant evaluation threshold")
- The 5+ commits must tell a story: e.g., (1) initial project setup, (2) add init_db, (3) add Gradio UI, (4) add alert logic, (5) add README and prep for deploy. Five commits of `git commit -m "x"` do not count.

---

**KHCC connection:** Every production clinical tool the AIDI team ships at KHCC — iNotes, the AKI alert pipeline, the pathology extraction service, the deceased-patient eval harness — started its life exactly the way your assignment app starts its life: a folder, a venv, a `.gitignore`, a `git init`, a remote, a deploy target. The stakes scale up (Azure App Service instead of Hugging Face, internal Postgres instead of SQLite, real PHI instead of textbook drug names), but the loop is the same. Mastering this loop on a low-stakes app is the prerequisite to building anything that touches a real patient.
