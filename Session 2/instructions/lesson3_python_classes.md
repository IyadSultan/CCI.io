---
layout: page
title: "Lesson 3: Python Classes"
permalink: /session-02/lesson-3-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 3: Python Classes — Modeling Clinical Data with Objects
**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"So far you've used dictionaries to represent patients — and that works fine for simple cases. But what happens when you have a patient who also has a list of medications, a treatment history, and you want to calculate their risk score? Dictionaries get messy fast. Classes let you create your own data types. Instead of a dictionary, you'll have a `Patient` object with built-in behaviors — like a method that calculates whether their labs are critical. Think of a class as a blueprint for a smart medical record."

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Review the Patient dictionary from Lesson 1 — think about what's missing (validation, methods, structure)
- Warm-up question: *If you could add a "button" to a patient record that automatically calculated whether the patient's labs are critical, how would that work?*

### During Class — What to Focus On
- Make sure you understand the relationship between a class (blueprint) and an object (instance)
- Make sure you understand why `self` appears as the first parameter in every method
- Make sure you can write a class with `__init__` and at least one custom method
- Common trap: Don't forget `self` — writing `def is_critical():` without `self` will cause errors when called on an instance

### After Class — Practice & Lab Work
- **Lab work (required):** Complete the Patient and OncologyPatient classes in Colab. Create 5 patient objects and call methods on each. Push notebook to GitHub. Estimated time: 15 min.
- **Extra practice:** Add a `Medication` class with attributes for drug name, dose, and frequency, and a method that checks for common interactions.
- **Self-check:**
  1. What is the difference between a class and an instance?
  2. Why do we use `self.hemoglobin` instead of just `hemoglobin` inside a class?
  3. What does inheritance allow you to do?

### Resources
- [Python Classes Tutorial](https://docs.python.org/3/tutorial/classes.html)

---

## Lab Exercise

**Title:** Building a Patient Class Hierarchy
**Duration:** 10 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> The AIDI team is building a Python-based patient data model that will be used across multiple clinical AI applications. You need to create a base Patient class and an OncologyPatient subclass.

### Objective
By the end of this lab, students will have a working Patient class with clinical methods and an OncologyPatient subclass with cancer-specific attributes.

### Setup
```
1. Open Google Colab
2. Create: "Session2_Lab3_Classes.ipynb"
3. Follow the 9-section template from Lesson 2
```

### Step-by-step instructions
1. **Define the Patient class** with `__init__` accepting: name, mrn, age, hemoglobin, wbc, medications (list)
2. **Add methods:**
   - `is_anemic()` — returns True if hemoglobin < 10
   - `has_abnormal_wbc()` — returns True if WBC outside 4.0–11.0
   - `get_alerts()` — returns a list of alert strings
   - `summary()` — returns a formatted string with all patient info
3. **Define OncologyPatient(Patient)** subclass adding: tumor_site, stage, treatment_protocol
4. **Add methods to OncologyPatient:**
   - `is_neutropenic()` — returns True if WBC < 1.5 (chemo-related risk)
   - `summary()` — override parent to include oncology-specific info
5. **Create 5 OncologyPatient objects** with varied data, loop through them, and print summaries and alerts.

### Expected output
```
Patient: Ahmad (P-1001) | Age: 58 | Tumor: Lung, Stage III
  Alerts: Low hemoglobin (9.1), Neutropenic (WBC 1.2)
Patient: Sara (P-1002) | Age: 34 | Tumor: Breast, Stage I
  Alerts: None
...
```

### Stretch challenge
Add a `__str__` method to both classes so `print(patient)` outputs the summary directly.

### KHCC connection
> This class hierarchy mirrors the data models used in AIDI-DB where patient records are organized into base demographic tables and specialty-specific extension tables.
