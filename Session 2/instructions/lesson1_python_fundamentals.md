---
layout: page
title: "Lesson 1: Python Fundamentals"
permalink: /session-02/lesson-1-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 1: Python Fundamentals — Variables, Types & Control Flow
**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"Welcome back, everyone. Last session you learned how to talk to AI models using prompts — today you learn how to talk to computers using Python. Don't worry if you've never written a line of code before. By the end of this lesson, you'll be able to store patient data in variables, make decisions with if-statements, and loop through a list of lab results. This is the foundation everything else in this course builds on."

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Watch: Google's "What is Python?" intro (5 min) or listen to the Session 1 wrap-up NotebookLM audio
- Warm-up question: *A nurse checks 20 patients' hemoglobin levels every morning and flags any below 10 g/dL. How would you automate this if you could write instructions a computer could follow?*

### During Class — What to Focus On
- Make sure you understand the difference between strings, integers, floats, and booleans
- Make sure you understand when to use a list vs. a dictionary
- Make sure you can write an `if` statement with a comparison operator
- Common trap: Don't confuse `=` (assignment) with `==` (comparison)

### After Class — Practice & Lab Work
- **Lab work (required):** Open the Colab notebook shared in class. Complete all TODO cells: create patient variables, write a lab result checker loop, and build a patient dictionary. Run all cells and verify output matches expected results. Estimated time: 15 min.
- **Extra practice:** Modify the loop to also flag WBC counts outside 4.0–11.0 range.
- **Self-check:**
  1. What data type would you use to store a patient's MRN?
  2. How do you access a value from a dictionary?
  3. What's the difference between `for` and `while`?

### Resources
- [Python Official Tutorial — Informal Introduction](https://docs.python.org/3/tutorial/introduction.html)
- Session 2 NotebookLM review notebook (link provided after class)

---

## Lab Exercise

**Title:** Your First Clinical Python Notebook
**Duration:** 10 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> You are a data analyst at KHCC and receive a daily list of 10 patients with their hemoglobin and WBC counts. You need to flag abnormal values automatically instead of checking them manually.

### Objective
By the end of this lab, students will have a working Colab notebook that stores patient data in variables and dictionaries, loops through lab results, and prints clinical alerts.

### Setup
```
1. Open Google Colab: https://colab.research.google.com
2. Create a new notebook: File → New Notebook
3. Rename it: "Session2_Lab1_Python_Fundamentals.ipynb"
```

### Step-by-step instructions
1. **Cell 1 — Variables:** Create variables for a single patient: `patient_name` (string), `mrn` (string), `hemoglobin` (float), `wbc` (float), `on_chemo` (boolean). Print them all.
2. **Cell 2 — Dictionary:** Store the same patient as a dictionary with keys: name, mrn, hgb, wbc, on_chemo. Access and print each value.
3. **Cell 3 — List of patients:** Create a list of 5 dictionaries, each representing a patient with different lab values (some normal, some abnormal).
4. **Cell 4 — Alert loop:** Write a `for` loop that iterates through the patient list and prints a warning if hemoglobin < 10 or WBC > 11.
5. **Cell 5 — Summary:** Print a count of how many patients have abnormal values.

### Expected output
```
ALERT: Patient Ahmad — Hemoglobin 9.1 (LOW)
ALERT: Patient Sara — WBC 12.3 (HIGH)
Summary: 2 of 5 patients have abnormal values
```

### Stretch challenge
Add a severity classification: hemoglobin < 7 = "CRITICAL", 7–10 = "LOW", 10+ = "NORMAL".

### KHCC connection
> This mirrors the daily lab review process used by the AIDI team to flag abnormal results before morning rounds.
