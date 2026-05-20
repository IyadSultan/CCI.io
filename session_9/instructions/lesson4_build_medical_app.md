---
layout: page
title: "Lesson 4: Build the Medical App — Gradio + SQLite"
permalink: /session_9/instructions/lesson4_build_medical_app/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #1565C0!important}.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#BBDEFB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-09/">&#8249; Back to Session 9</a>

# CCI Session 9 — Lesson 4: Build the Medical App — Gradio + SQLite

**Estimated time:** 30 minutes (10 min content / 20 min lab)
**Lab mode:** Guided step-by-step (local laptop)

---

## Instructor Introduction

Project is set up, secrets are safe, code is on GitHub. Now let's put something real inside it. We'll build a small Cockcroft-Gault calculator with a Gradio UI and a SQLite table of nephrotoxic drugs. The shape -- Python logic plus a small database plus a UI -- is exactly the shape of iNotes and half the tools we ship at KHCC. The clinical idea is simple: a pharmacist enters age, weight, creatinine, and sex; the app returns the estimated creatinine clearance and a list of nephrotoxic drugs that need dose adjustment at or below that clearance. The point of the lesson is not the formula -- the point is that by the end of 30 minutes, you have written, run, and committed your first real local Python application.

---

## NotebookLM Summary

**Gradio** is a Python library that turns a regular function into a web UI. You write `def calculate_crcl(age, weight, creatinine, sex): ...` and Gradio wraps it in `gr.Interface(...)` to give you input boxes, a button, and an output panel -- all without writing any HTML. When you call `.launch()`, Gradio starts a local web server on `http://127.0.0.1:7860` and your browser opens automatically. This is the same pattern used by every HuggingFace Space, which we will exploit in Lesson 5.

**SQLite** is a single-file relational database with no server -- the entire database is one `.db` file on disk, accessed through the standard-library `sqlite3` module. For a clinical lookup table of 5 to 50 rows, SQLite is dramatically simpler than a real database server, and the Python API is just `conn = sqlite3.connect("drugs.db")` followed by `cursor.execute("SELECT ...")`. The price is no concurrent writers and no network access, but for a local pharmacist tool that is exactly the right trade-off.

The **Cockcroft-Gault formula** estimates creatinine clearance in mL/min as `CrCl = ((140 - age) * weight) / (72 * serum_cr)`, multiplied by 0.85 if the patient is female. It is the standard formula KHCC pharmacists use for renal dose adjustment despite newer alternatives like CKD-EPI being more accurate for staging -- Cockcroft-Gault remains the FDA reference for drug-label dose adjustments.

The lesson has three concrete steps. **Step 1** is `init_db.py`, a one-shot script that creates a `nephrotoxic_drugs` table with columns `name`, `class`, `crcl_threshold`, and `note`, then inserts five rows: Vancomycin (50), Gentamicin (60), Cisplatin (60), Methotrexate (60), and Acyclovir (50). Run it once with `python init_db.py` and you have a `drugs.db` file. **Step 2** is `app.py`: a `calculate_crcl` function that validates inputs (positive numbers, sensible ranges), applies the formula with the sex correction, queries the database for `SELECT * FROM nephrotoxic_drugs WHERE crcl_threshold >= ?` (drugs whose threshold is at or above the patient's clearance, meaning the drug needs adjustment), and returns two strings -- the calculated CrCl and a formatted drug list. The Gradio interface uses `gr.Number` for age, weight, and creatinine, `gr.Radio(["Male", "Female"])` for sex, and two `gr.Textbox` outputs. A useful auto-init pattern at the top of `app.py` is `if not os.path.exists("drugs.db"): import init_db`, so a fresh clone runs without a separate setup step.

**Step 3** is the commit and push. Use `git add app.py init_db.py requirements.txt README.md` -- specific files, not `git add .`, to avoid accidentally staging `drugs.db` or `.env`. Run `git status` to confirm only the four intended files are staged, commit with a meaningful message like "Add CrCl calculator with nephrotoxic drug DB", and push. Open the diff view on GitHub to walk through what changed.

A quick clinical sanity check: age 65, weight 70 kg, creatinine 1.8 mg/dL, female -- expected CrCl is approximately 26 mL/min, and all five drugs in the table should be flagged for adjustment.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Gradio Quickstart PDF and the FDA Cockcroft-Gault guidance, and generate an *Audio Overview* tying the formula to dose-adjustment workflow.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Read:** Gradio Quickstart: <https://www.gradio.app/guides/quickstart>
- **Skim:** Python `sqlite3` tutorial: <https://docs.python.org/3/library/sqlite3.html#tutorial>
- **Refresh:** Cockcroft-Gault formula and its role in renal dose adjustment -- one paragraph from any pharmacology reference.
- **Warm-up question:** Why might a pharmacist prefer Cockcroft-Gault over CKD-EPI even though CKD-EPI is more accurate for CKD staging? Write a one-sentence answer.

### During Class -- What to Focus On

1. **Function-first design** -- write `calculate_crcl` as a pure Python function that returns two strings. Get it working with print statements before adding Gradio.
2. **Parameterized SQL** -- always use `cursor.execute("... WHERE crcl_threshold >= ?", (crcl,))` with a tuple, never f-strings. SQL injection is real even in single-user apps.
3. **The auto-init pattern** -- `if not os.path.exists("drugs.db"): import init_db` lets your app bootstrap itself on a fresh clone.
4. **Selective `git add`** -- `git add app.py init_db.py requirements.txt` (named files) is safer than `git add .` until your `.gitignore` is battle-tested.

**Common traps:**

- Forgetting the 0.85 multiplier for female patients -- the CrCl is overestimated by 18 percent.
- Using f-strings to build SQL queries -- works once, then someone passes `'; DROP TABLE` and your database is gone.
- Committing `drugs.db` to git -- the DB is a build artifact, regenerable from `init_db.py`. It belongs in `.gitignore` (already there from Lesson 2 via `*.db`).

### After Class -- Practice & Lab Work

**Lab work (required):**

1. Add `gradio` to `requirements.txt` if it is not already there, and `pip install -r requirements.txt`.
2. Create `init_db.py` that creates a `drugs.db` SQLite file with a `nephrotoxic_drugs` table and inserts the five drugs listed in the summary. Run it once: `python init_db.py`.
3. Create `app.py` with the `calculate_crcl` function, the SQLite query, and the `gr.Interface` definition. Add the auto-init `if not os.path.exists(...)` guard at the top.
4. Run `python app.py`. Open `http://127.0.0.1:7860` in your browser. Enter age 65, weight 70, creatinine 1.8, sex Female. Confirm CrCl ~26 and all five drugs appear in the output.
5. `git status` -- confirm `drugs.db` does NOT appear (because `*.db` is in `.gitignore`).
6. `git add app.py init_db.py requirements.txt`, then `git commit -m "Add CrCl calculator with nephrotoxic drug DB"`, then `git push`.
7. Open the commit on GitHub and review the diff side by side.

**Extra practice (optional):**

- Add a third output that lists drugs which do NOT need adjustment (threshold below CrCl), to confirm the threshold logic is correct.
- Add a few unit tests with `pytest` for `calculate_crcl` edge cases (age 0, creatinine 0, very high creatinine).
- Replace the drug list with one expanded from the KHCC formulary (with the instructor's approval).

**Self-check questions:**

1. Why do we query `WHERE crcl_threshold >= ?` rather than `<=`? What clinical question does each one answer?
2. What does `gr.Interface` actually do under the hood when you call `.launch()`?
3. Why is `drugs.db` in `.gitignore`, and how does a teammate get a working database after cloning your repo?

### Resources

| Resource | Link |
|----------|------|
| Gradio Quickstart | <https://www.gradio.app/guides/quickstart> |
| Gradio Interface Docs | <https://www.gradio.app/docs/gradio/interface> |
| Python sqlite3 Tutorial | <https://docs.python.org/3/library/sqlite3.html#tutorial> |
| FDA -- Cockcroft-Gault in Drug Labeling | <https://www.fda.gov/regulatory-information/search-fda-guidance-documents/pharmacokinetics-patients-impaired-renal-function-study-design-data-analysis-and-impact-dosing> |
| SQLite Browser (GUI to inspect .db) | <https://sqlitebrowser.org/> |
| Real Python -- SQLite Tutorial | <https://realpython.com/python-sqlite-sqlalchemy/> |
