---
layout: page
title: "Lesson 4: Pandas & Merging"
permalink: /session-02/lesson-4-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 4: Pandas Essentials — DataFrames, Analysis & Merging Clinical Datasets
**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"Everything you've built so far uses lists and dictionaries — and that's fine for 5 patients. But what about 5,000? Or 50,000? This is where pandas comes in. Pandas gives you a DataFrame — think of it as a programmable spreadsheet. You can load a CSV with one line of code, filter patients by diagnosis, calculate average lab values, and merge two datasets together. If you've ever spent hours doing VLOOKUPs in Excel, pandas is about to change your life."

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- If you've used Excel, think about the last time you did a VLOOKUP — pandas merge is the Python equivalent
- Warm-up question: *You have two spreadsheets — one with patient demographics and one with lab results. Both have an MRN column. How would you combine them into one sheet in Excel? What problems might you run into?*

### During Class — What to Focus On
- Make sure you understand how to create a DataFrame from a list of dictionaries and from a CSV file
- Make sure you understand the difference between inner, left, and outer merge
- Make sure you can filter a DataFrame with boolean indexing
- Common trap: Don't confuse `pd.concat()` (stacking same-column tables) with `pd.merge()` (joining different tables on a key)

### After Class — Practice & Lab Work
- **Lab work (required):** Complete the Colab notebook that creates 3 mock datasets, merges them, filters abnormal results, and exports to CSV. Screenshot the final merged DataFrame and the exported CSV. Estimated time: 20 min.
- **Extra practice:** Add a `groupby` analysis that calculates mean hemoglobin by diagnosis.
- **Self-check:**
  1. How do you filter a DataFrame for rows where WBC > 11?
  2. What merge type keeps all rows from both tables?
  3. What does `df.isna().sum()` tell you?

### Resources
- [Pandas Getting Started Tutorial](https://pandas.pydata.org/docs/getting_started/intro_tutorials/)
- [Pandas Merge Documentation](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)

---

## Lab Exercise

**Title:** Merging Clinical Datasets — Building a Unified Patient View
**Duration:** 13 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> The oncology department needs a unified analysis dataset combining patient demographics, lab results, and medication records. Data comes from three separate systems — you need to merge them using MRN as the key and flag patients with critical values who are also on chemotherapy.

### Objective
By the end of this lab, students will have merged three mock KHCC datasets, performed analysis with groupby, and exported a filtered report.

### Setup
```
1. Open Google Colab
2. Create: "Session2_Lab4_Pandas.ipynb"
3. Follow the 9-section template
```

### Step-by-step instructions

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

### Expected output
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

### Stretch challenge
Create a pivot table showing mean lab values (hemoglobin, wbc, platelets) by diagnosis and gender.

### KHCC connection
> This exact merge pattern — demographics + labs + medications — is how the AIDI team builds analysis cohorts from the Azure SQL database tables in AIDI-DB. The MRN-based join mirrors the Optimus MRN encoding system used for data linkage.
