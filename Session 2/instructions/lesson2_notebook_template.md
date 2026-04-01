---
layout: page
title: "Lesson 2: Notebook Template"
permalink: /session-02/lesson-2-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 2: Building a Robust Colab Notebook — The Clinical Notebook Template
**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"Now that you can write basic Python, let me show you how professionals structure their notebooks. If you've ever opened someone's messy Jupyter notebook with 50 unnamed cells and no comments — you know the pain. In clinical informatics, a well-structured notebook isn't just nice to have, it's a safety requirement. We're going to build a template notebook with clear sections: installations, imports, configs, prompts, functions, main code, CSV output, email, and a markdown summary. Every notebook you build in this course will follow this structure."

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Open Google Colab and create a blank notebook to make sure you can access it
- Warm-up question: *You receive a messy notebook from a colleague with 40 cells, no comments, and the API key hardcoded on line 237. What could go wrong?*

### During Class — What to Focus On
- Make sure you understand why each section exists and what goes in it
- Make sure you understand the difference between Configuration and Main Code
- Make sure you can write a Python function with `def`
- Common trap: Don't put `!pip install` inside a function — it belongs in the installations cell only

### After Class — Practice & Lab Work
- **Lab work (required):** Complete the template notebook in Colab. All 9 sections must have at least one cell with working code. The notebook should process 5 mock patients and export a CSV. Run all cells top-to-bottom and screenshot the final output. Estimated time: 20 min.
- **Extra practice:** Add a 10th section "Logging" that timestamps each major step.
- **Self-check:**
  1. In which section do you define clinical thresholds?
  2. Why should prompts be separate from functions?
  3. What is the purpose of the Markdown Summary section?

### Resources
- [Google Colab Welcome Notebook](https://colab.research.google.com/notebooks/intro.ipynb)
- [PEP 8 — Python Style Guide](https://peps.python.org/pep-0008/)

---

## Lab Exercise

**Title:** Build the KHCC Clinical Notebook Template
**Duration:** 13 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> The AIDI team needs a standardized notebook template that every data analyst uses when processing daily lab results. You're building the template that will become the team standard.

### Objective
By the end of this lab, students will have a complete 9-section Colab notebook template that processes mock patient data and exports results.

### Setup
```
1. Open Google Colab
2. Create a new notebook: "Session2_Lab2_Notebook_Template.ipynb"
```

### Step-by-step instructions

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

### Expected output
```
ALERT [2026-03-27] Ahmad (MRN: P-1001): Low HGB: 9.1
ALERT [2026-03-27] Sara (MRN: P-1002): Abnormal WBC: 12.3
ALERT [2026-03-27] Khaled (MRN: P-1003): Low HGB: 7.8, Abnormal WBC: 3.5
ALERT [2026-03-27] Omar (MRN: P-1005): Low HGB: 8.5
Saved 4 alerts to lab_alerts.csv
EMAIL SIMULATED: 4 alerts would be sent to lab-team@khcc.jo
```

### Stretch challenge
Add a cell between Email and Summary that generates a markdown table of all alerts (formatted for pasting into a Slack message).

### KHCC connection
> This template mirrors the standardized notebook structure used by the AIDI team for all production Databricks notebooks. Adopting it in Colab builds the right habits before students move to cloud environments.
