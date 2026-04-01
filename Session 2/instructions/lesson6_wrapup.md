---
layout: page
title: "Lesson 6: Wrap-Up"
permalink: /session-02/lesson-6-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 6: Wrap-Up — Review & Consolidation
**Estimated time:** 10 minutes
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"That was a packed session — you went from zero Python to building structured notebooks, creating classes, merging datasets with pandas, and pushing everything to GitHub. That's a huge jump. Don't worry if it doesn't all feel natural yet — that's what practice is for. The assignment will push you to combine everything you learned today into one cohesive notebook. And the NotebookLM review materials will help you revisit anything that felt fast. Next session, we'll take these Python skills and start working with real databases using SQL."

---

## Session Review — Key Concepts Recap

| # | Lesson Title | Core Concept | Clinical Relevance |
|---|-------------|-------------|-------------------|
| 1 | Python Fundamentals | Variables, types, control flow, dictionaries | Store and check patient data programmatically |
| 2 | Robust Notebook Template | 9-section notebook structure (installs -> summary) | Standardized, auditable notebooks for clinical work |
| 3 | Python Classes | OOP — blueprints with data + behavior | Model patients as objects with built-in clinical checks |
| 4 | Pandas & Merging | DataFrames, filtering, merge types | Combine multi-source clinical datasets for analysis |
| 5 | GitHub | Repositories, commits, .gitignore | Version control and audit trails for clinical code |

**Connecting the Dots:** These five lessons form a complete workflow: you learn the language (Python), structure your work professionally (notebook template), model your data intelligently (classes), manipulate data at scale (pandas), and track everything safely (GitHub). In Sessions 3-6, you'll add SQL databases, LLMs, and retrieval pipelines on top of this foundation. Every future session builds directly on what you learned today.

---

## Common Mistakes & Gotchas

1. **Using `=` instead of `==` in conditions** — `if hgb = 10` assigns, `if hgb == 10` compares. Python will throw a syntax error, but the message isn't always clear.
2. **Forgetting colons after `if`, `for`, `def`, `class`** — Python requires `:` at the end of these statements. If you get "SyntaxError: expected ':'", this is almost always why.
3. **Forgetting `self` in class methods** — Writing `def is_anemic():` without `self` means the method can't access instance data. Always include `self` as the first parameter.
4. **Using `pd.concat()` when you need `pd.merge()`** — Concat stacks rows (same columns, different data). Merge joins columns (same key, different columns). Mixing them up silently produces wrong results.
5. **Pushing sensitive data to GitHub** — Even in private repos, patient data should never be on GitHub. Always check your notebook for hardcoded MRNs or API keys before pushing. Use `.gitignore`.

---

## Quick Self-Check (No-Code)

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
5. Go to the GitHub repo -> click the file -> click "History" to see all commits that changed that file, with dates and messages.
</details>

---

## NotebookLM Review Notebook

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

## What's Next

In Session 3, you'll connect Python to databases using SQL, learning how to query clinical data directly from a database and use LLMs to translate natural language questions into SQL queries. The notebook template, pandas skills, and GitHub workflow you learned today will be used in every session going forward.

---

## Session Assignment: The Complete Clinical Intake Pipeline

**Due:** Before Session 3
**Estimated effort:** 3-5 hours
**Submission:** Push to your `cci-course-notebooks` GitHub repo under `assignments/session-2/` and share the link with Dr. Iyad

---

### Clinical Scenario

> KHCC's outpatient oncology clinic receives 30-50 new patient intake forms daily. Each form contains demographics, initial lab results, current medications, and a brief clinical note. Currently, a data entry clerk manually reviews each form, flags abnormal labs, checks for drug interactions, and prepares a summary report for the oncologist. This takes 2-3 hours per day. You've been asked to build a Python notebook that automates this workflow.

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

Write 200-400 words (in a markdown cell) addressing:
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
