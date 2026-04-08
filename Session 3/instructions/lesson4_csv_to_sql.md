---
layout: page
title: "Lesson 4: From CSV to SQL"
permalink: /session-03/lesson-4-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-03/">&#8249; Back to Session 3</a>

# CCI Session 3 -- Lesson 4: From CSV to SQL -- Clinical Data Foundations

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)
**Prerequisites:** Sessions 1-2 (prompting fundamentals, Python/pandas basics), Lessons 1-3 of this session (OpenAI API, structured output, memory and tool calling)

---

## Instructor Introduction

> "We've been working with LLMs -- now let's work with DATA. At KHCC, patient vitals flow from VistA into CSV extracts every day, and we also have patient demographics -- age, sex, nationality. Today you'll load both datasets, convert them to SQL, and write queries that combine them using JOINs. Want to find all female patients with fever? Or the average pulse for patients over 60? That takes a JOIN. This is the foundation for Lesson 5, where we let the LLM write SQL for us."

---

## NotebookLM Summary

### The Clinical Data Landscape at KHCC

King Hussein Cancer Center relies on VistA (Veterans Health Information Systems and Technology Architecture) as its core electronic health record system. Clinical staff record patient vitals -- temperature, blood pressure, pulse, respiration, oxygen saturation, height, and weight -- throughout each encounter. These vitals are captured in real time at the bedside and stored within VistA's database. For analysis, reporting, and quality improvement, the informatics team routinely exports this data as CSV (comma-separated values) files. These flat-file extracts serve as the starting point for most downstream analytics work, whether that is building dashboards, running research queries, or feeding data into machine learning pipelines.

### Loading and Exploring CSV Data with pandas

The pandas library in Python is the standard tool for loading CSV extracts. Using `pd.read_csv()`, you can ingest a vitals export in a single line of code. However, clinical data rarely arrives clean. Date columns may be stored as plain text rather than proper datetime objects, so you need to use `parse_dates` or `pd.to_datetime()` to convert them. Numeric fields like vital sign readings may contain missing values or unexpected text entries. After loading, your first steps should always be exploratory: check `df.shape` to see how many rows and columns you have, run `df.dtypes` to confirm each column's data type, use `df.describe()` for summary statistics on numeric columns, and call `df['VITAL_TYPE'].value_counts()` to see the distribution of vital sign categories. Checking for missing data with `df.isnull().sum()` is essential before any analysis -- missing vitals could indicate documentation gaps or system issues.

### The vista_vitals Schema

The vitals export follows a consistent structure with the following columns:

| Column | Description | Example |
|---|---|---|
| `NUMBER` | Unique record identifier | 10234 |
| `MRN` | Patient medical record number | 4400123 |
| `DATE_TIME_VITALS_TAKEN` | When the vital was measured | 2024-11-15 08:30:00 |
| `VITAL_TYPE` | Type of measurement | TEMPERATURE, PULSE, BLOOD PRESSURE |
| `DATE_TIME_VITALS_ENTERED` | When data was entered into VistA | 2024-11-15 08:35:00 |
| `HOSPITAL_LOCATION` | Ward or clinic where measured | ICU, ONCOLOGY WARD 3, ER |
| `ENTERED_BY` | Staff member who documented | NURSE.AHMAD |
| `RATE` | The measured value | 98.6, 72, 120/80 |

Understanding this schema is critical because every SQL query you write -- and every query the LLM generates in Lesson 5 -- depends on knowing exactly what columns exist and what they contain.

### Introduction to SQLite

SQLite is a lightweight, serverless database engine that runs entirely within your Python process. There is no separate database server to install or configure, which makes it ideal for use in Google Colab. Python includes SQLite support in its standard library through the `sqlite3` module. For clinical informatics work, SQLite lets you practice real SQL syntax on your vitals data without the overhead of setting up PostgreSQL or MySQL. The conversion from a pandas DataFrame to a SQLite table is straightforward: `df.to_sql('vitals', conn, if_exists='replace', index=False)` creates a table called `vitals` in your SQLite database, mapping each DataFrame column to a database column.

### SQL Fundamentals with Clinical Data

Once your data is in SQLite, you can query it using standard SQL. The essential operations for clinical data analysis include:

**Selecting and filtering.** `SELECT * FROM vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND RATE > 100.4` retrieves all fever readings. Adding date filters lets you narrow results: `WHERE DATE_TIME_VITALS_TAKEN >= '2024-11-01'` returns vitals from November onward.

**Aggregation.** `SELECT HOSPITAL_LOCATION, AVG(CAST(RATE AS FLOAT)) FROM vitals WHERE VITAL_TYPE = 'PULSE' GROUP BY HOSPITAL_LOCATION` calculates the average pulse by ward. `COUNT(*)` tells you how many readings exist for each patient or each vital type.

**Sorting and limiting.** `ORDER BY DATE_TIME_VITALS_TAKEN DESC LIMIT 10` returns the ten most recent vital sign entries, useful for checking the freshest data in the system.

**Subqueries for clinical questions.** More complex questions require nested queries. For example, finding patients with abnormal blood pressure readings involves a subquery: `SELECT DISTINCT MRN FROM vitals WHERE VITAL_TYPE = 'BLOOD PRESSURE' AND CAST(SUBSTR(RATE, 1, INSTR(RATE, '/') - 1) AS INTEGER) > 140`. These are exactly the kinds of queries that clinicians want to ask in plain English -- which is why Lesson 5 exists.

---

## Student Study Guide

### Before This Lesson

- **Review pandas basics** from Session 2: loading data, selecting columns, filtering rows, and basic summary statistics.
- **Install/verify** that your Google Colab environment has pandas and sqlite3 available (both are included by default).
- **Skim the vista_vitals schema** table above so you are familiar with the column names and what each one represents.
- **Recall** the difference between a CSV file (flat, no relationships, no query engine) and a database (structured, queryable, supports joins and aggregations).

### During This Lesson

- **Follow along in Colab** as we load the CSV, explore the data, and convert it to SQLite.
- **Pay attention to data types** -- notice how date columns need special handling and how the RATE column stores different formats for different vital types (numeric for pulse, fraction format for blood pressure).
- **Run each SQL query** yourself and modify the WHERE clause to answer your own clinical questions.
- **Take note of the GROUP BY pattern** -- it appears in nearly every clinical reporting query.
- **Ask questions** about anything that does not match your experience with KHCC data workflows.

### After This Lesson

- **Practice writing SQL queries** against the vitals database you built. Try these:
  - Count the number of temperature readings per hospital location.
  - Find the five patients with the most vital sign entries.
  - Calculate the average pulse for a specific date range.
  - List all vitals entered by a specific staff member.
- **Experiment with edge cases** -- what happens when you query for a vital type that does not exist? What does the output look like when RATE contains non-numeric values?
- **Prepare for Lesson 5** by thinking about questions a clinician might ask in plain English that would require SQL to answer.

### Resources

| Resource | Link |
|---|---|
| pandas `read_csv` documentation | https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html |
| pandas `to_sql` documentation | https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html |
| SQLite official documentation | https://www.sqlite.org/docs.html |
| Python `sqlite3` module | https://docs.python.org/3/library/sqlite3.html |
| SQL tutorial (W3Schools) | https://www.w3schools.com/sql/ |
| VistA documentation (VA) | https://www.va.gov/health/vista/ |
