---
layout: page
title: "Lesson 8: Software Factory Part 1 — PRD to Story to Brief"
permalink: /session_10/instructions/lesson8_factory_part1/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 8 — The Software Factory, Part 1: PRD → Story → Brief

*45 minutes. The first half of the capstone. By the end you have a saved PRD, an approved user story, an approved technical brief, and three subagents wired up.*

A new attending arrives in the ER on her first morning. Before she sees a single patient she does three things, in this order. She reads the unit's standing protocol for chemotherapy-induced neutropenic fever — what counts, what to draw, what to start within sixty minutes. She listens to the night-shift handoff — who is in bed 4, what the working diagnosis is, what is pending. She skims the chart of the next patient on the board — name, age, oncologic history, vitals, the triage nurse's note. Only then does she walk to the bedside.

That sequence — *protocol*, *handoff*, *chart* — is what the first half of the Software Factory pipeline does, in software. The PRD is the protocol. The user story is the handoff. The technical brief is the chart. Three documents, written before any code is touched, each one read and approved by a human before the next one starts. You spent Lessons 1–7 building the tools. In this lesson you wire three of them together into the first half of a build pipeline and ship the first three artifacts.

> 🧠 **Remember.** No code is written in Lesson 8. The whole hour is documents. That is the point. Every minute spent on a document here saves an hour of rework when the code starts in Lesson 9.

## What we are building

A two-screen Django app, the ER Triage Extractor — the capstone project for this session. It is the simplest illustration of a real clinical software pipeline that still ships a usable tool.

- **Nurse screen** (this lesson and the first half of Lesson 9). A form: chief complaint as free text, age, vitals (heart rate, blood pressure, respiratory rate, oxygen saturation, temperature), oncology context (known malignancy yes/no, on chemotherapy yes/no, days since last cycle, neutropenia known yes/no). On submit, the system computes an ESI-like acuity 1–5, runs the chief complaint through the OpenAI API (`gpt-4o-mini`) looking for four oncologic emergencies — neutropenic fever, tumor lysis syndrome, spinal cord compression, hypercalcemia of malignancy — and writes a row to the queue.
- **Doctor screen** (the *Try This* at the end of Lesson 9). The live queue, color-coded by acuity, with the AI flags surfaced for the on-call attending.

You are going to build the nurse half through the seven-stage pipeline from the freeCodeCamp Software Factory framework: codebase-researcher, story-writer, spec-writer, backend-builder, frontend-builder, test-verifier, implementation-validator. Stages 1 through 3 are this lesson. Stages 4 through 7 are Lesson 9.

## Setup — the scaffold and the agents (5 minutes)

Open a terminal. Make a fresh folder for the capstone and let Django generate a skeleton for you.

```
$ mkdir er_triage && cd er_triage
$ python -m venv .venv
$ source .venv/bin/activate          # on Windows: .venv\Scripts\activate
$ pip install django==5.0
$ django-admin startproject er_triage .
$ python manage.py startapp triage
```

You now have a Django project (`er_triage/`) and a Django app (`triage/`) — the standard scaffold every Django developer recognizes. Django's default database is SQLite (`db.sqlite3` in the project root) — that is what we use for this demo. No database server to install. Open the folder in VS Code and start Claude Code from its integrated terminal.

Before any agent runs, three files must exist. The first is `CLAUDE.md`, your project memory.

### `CLAUDE.md` — the standing protocol

Create `CLAUDE.md` at the project root:

```markdown
# ER Triage — Claude Code Memory

## Stack
- Python 3.11, Django 5, SQLite (`db.sqlite3`) for the demo database
- OpenAI API (`gpt-4o-mini`) for the oncologic emergency extractor
- htmx for the form, Tailwind CDN for styling, pytest for tests

## Conventions
- All patient identifiers are hashed before storage or display. Never log raw identifiers.
- All patient names are encrypted at rest using application-level encryption. Never logged.
- New Django code matches the existing app's structure: views in `triage/views.py`, services in `triage/services/`, templates under `triage/templates/triage/`.
- Tests live in `triage/tests/` and use pytest-django.

## Eval gate
- No prompt change to the oncologic emergency extractor ships without re-running
  the automated eval suite against the held-out evaluation cohort.
- For this capstone, eval runs are simulated by `tests/test_acceptance.py`.

## Boundaries
- Do not invent ICD codes or KDIGO thresholds from memory.
- Do not add features the user did not ask for.
- Surface ambiguity before coding.
```

That is the standing protocol the entire pipeline is going to read at session start. Every subagent inherits it.

### Three subagents in `.claude/agents/`

Now drop in the three subagents you met in Lesson 5. Each is a file with YAML frontmatter and a system prompt. Create the folder first.

```
$ mkdir -p .claude/agents
```

**`.claude/agents/codebase-researcher.md`**

```markdown
---
name: codebase-researcher
description: Read-only inventory of an existing codebase. Returns a file map, the public surfaces of the main modules, the tests already in place, and a short risks list. Use before any new feature is planned.
tools: Read, Grep, Glob
model: haiku
---

You are a codebase researcher. You never write code. You read.

Your output is a single Markdown report with four sections:

1. **Project structure.** A tree of folders and files relevant to the question.
2. **Public surfaces.** For each main module, list its exports/views/URL routes.
3. **Tests.** What tests already exist and what they cover.
4. **Risks.** Anything missing, inconsistent, or fragile that the next agent should know.

Read the project's CLAUDE.md before anything else. Match its vocabulary.
Be concise. The next stage is going to read every word.
```

**`.claude/agents/story-writer.md`**

```markdown
---
name: story-writer
description: Turns a product requirement (PRD) section into a single user story with explicit acceptance criteria. Returns exactly one story; never expands scope.
tools: Read
model: sonnet
---

You are a story writer for clinical software.

You read the PRD section the user names, and you return:

1. **One user story** in the form: *"As a [role], I can [action], and [observable outcome]."*
2. **Acceptance criteria** — 6 to 10 bullets. Each one is independently checkable.
3. **Out of scope** — 3 to 5 bullets naming what this story does NOT include.

Stay in the bounds of the PRD section the user named. If the PRD is ambiguous, surface the ambiguity in a fourth section titled **Questions** and stop.

Do not write technical details. The brief comes later.
```

**`.claude/agents/spec-writer.md`**

```markdown
---
name: spec-writer
description: Converts an approved user story into a technical brief — data model, services, views, URL routes, file list, test list. Read-only with respect to the codebase.
tools: Read, Grep, Glob
model: sonnet
---

You are a technical brief writer.

You read the approved user story and the existing codebase (use the tools), and you return a single Markdown brief with these sections, in this order:

1. **Data model.** Each model, its fields, and the rationale for each field.
2. **Services.** Each service class or function, its inputs and outputs.
3. **Views and URL routes.** Each view's path, method, template, redirect target.
4. **Test list.** 6–10 named tests covering the acceptance criteria.
5. **File list.** Every file to be created or modified.

Match the project's CLAUDE.md conventions exactly. Do not introduce new patterns.
If two existing patterns in the codebase contradict each other, name the conflict and pick one. Do not blend them.
```

That is the toolbox for this lesson. Three subagents, each with the smallest possible permission set, each with a single job. Save those files and move on.

> 💡 **Tip.** The model field matters more than students think. `codebase-researcher` is on Haiku because inventory is fast and cheap; the other two are on Sonnet because the writing is the work. You wired this same distinction in Lesson 5.

## Stage 0 — The PRD (10 minutes)

The pipeline starts before the pipeline starts: with the PRD. You met the **CCI PRD-Builder** skill in Lesson 1. If you have not installed it yet, [download the official course skill](/CCI.io/session_10/skills/cci-prd-builder.skill) and import it into Claude Code (**Settings → Skills → Import**), then copy it into this project's `.claude/skills/` if needed.

Tell Claude what you want to build:

> Use prd-builder for an ER triage app that lets a nurse submit chief complaint + vitals + oncology context and shows the doctor a queue sorted by acuity, flagging oncologic emergencies.

The skill classifies the request as clinical and pulls in `references/clinical-template.md`. It asks one or two focused questions before drafting. Expect something like:

> *Which clinical service will use this? And what is the single success criterion you will judge the v1 against?*

Answer concretely. *"The ER medical oncology night team. Success criterion: the triage nurse can complete the form in under 90 seconds and the on-call attending sees the queue ordered correctly with the right oncologic emergency flag on at least 90% of cases."*

The skill then drafts a PRD. Saved to `docs/ER-Triage-PRD.md`. The outline you should see:

```markdown
# ER Triage Extractor — PRD

## Problem
ER triage nurses at a busy oncology center see ~30 oncology patients per evening shift. Identifying
which presentations represent oncologic emergencies — neutropenic fever, TLS,
cord compression, hypercalcemia of malignancy — currently relies on the nurse's
recall of training. The on-call medical oncology attending sees the queue
as a flat list and must triage by reading every chart.

## Users
- Primary: ER triage nurses (4-6 per shift).
- Secondary: on-call medical oncology attending (1 per shift).
- Stakeholder: ER chief, Medical Oncology chief.

## Success criteria
- Nurse form submission < 90 seconds median.
- Acuity 1-2 assignment within 3 seconds of submit.
- Oncologic emergency flag sensitivity ≥ 90% against the frozen eval cohort.
- Doctor sees queue correctly ordered by acuity within 5 seconds of refresh.

## Scope (v1)
- Nurse-side form (this story).
- Doctor-side queue (next story).
- Four oncologic emergencies: neutropenic fever, TLS, cord compression, hyperCa.

## Out of scope (v1)
- Authentication (handled by hospital SSO in v2).
- Auto-paging the attending (v2).
- Integration with the EMR (v3).

## Data and PHI
- Patient identifier stored as a one-way hash. Name encrypted at rest.
- No PHI leaves the application server. No PHI in logs.

## Stack
- Django 5 + SQLite. OpenAI API (`gpt-4o-mini`). Tailwind CDN. htmx.

## Eval gate
- Pre-deployment: held-out evaluation cohort (≥ 200 de-identified cases), sensitivity ≥ 90% per
  emergency category, no calibration drift > 5 percentage points.
```

Read it. Edit anything that does not match the unit's actual workflow. Save it. This PRD is the source of truth for the rest of the pipeline.

> 🔧 **Technical Stuff.** The PRD has eval-gate language because production clinical AI governance requires it before any feature ships. Even though our local capstone won't actually run a full production eval pipeline, the PRD names the gate so the rest of the pipeline knows it exists. That is the convention you carry into real work.

## Stage 1 — Codebase researcher (5 minutes)

With the PRD saved, fire the first subagent.

> Have codebase-researcher inventory the current Django scaffold and tell me what's in place and what's missing.

Claude delegates to `codebase-researcher` (Haiku, read-only, fast). It returns something like this:

```markdown
# Codebase Inventory — er_triage

## Project structure
er_triage/
├── manage.py
├── CLAUDE.md
├── docs/ER-Triage-PRD.md
├── er_triage/      (project settings)
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── triage/         (app — mostly empty)
    ├── apps.py
    ├── admin.py
    ├── models.py   (empty — only the import line)
    ├── views.py    (empty — only the import line)
    ├── tests.py    (empty)
    └── migrations/ (only __init__.py)

## Public surfaces
- er_triage/urls.py — root URL conf, only `admin/` is wired.
- triage/ — no models, no views, no URL routes, no templates.

## Tests
- triage/tests.py exists but is empty.
- No pytest configuration. CLAUDE.md states pytest-django is the convention.

## Risks
- No requirements.txt yet — Django is installed in the venv but not pinned.
- No `triage/services/` folder; CLAUDE.md says services live there.
- No `.env.example`; CLAUDE.md does not yet name required environment variables
  for the OpenAI client (`OPENAI_API_KEY`, `OPENAI_MODEL`).
- No `triage/templates/triage/` folder.
- `settings.py` uses Django's default SQLite backend — correct for this demo.
```

This is what a codebase-researcher report looks like — flat, factual, no recommendations. The next stage uses it.

> 🧠 **Remember.** The researcher's job is to remove uncertainty, not to fix things. It never writes code. If you ask it to start coding, the wrong agent is doing the wrong work.

## Stage 2 — Story-writer (10 minutes)

Now the first writing stage.

> Have story-writer turn the PRD's nurse-form section into a single user story with acceptance criteria.

Claude delegates to `story-writer` (Sonnet, read-only). It returns:

```markdown
# User Story — Nurse Triage Form

**As a triage nurse, I can submit a new arrival's chief complaint, vitals,
age, and oncology context, and see the system assign an ESI acuity 1–5
within 3 seconds, with any oncologic emergencies flagged.**

## Acceptance criteria
1. The form has fields: chief_complaint (textarea, required, max 2000 chars),
   age (integer 0–120, required), sex (M/F/Other, required), heart_rate (int
   30–220, required), systolic_bp and diastolic_bp (int, required),
   respiratory_rate (int 5–60, required), spo2 (int 50–100, required),
   temperature_c (decimal 30.0–43.0, required).
2. Oncology context fields: known_malignancy (yes/no, required),
   on_chemotherapy (yes/no, required), days_since_last_cycle (int 0–365,
   conditional — required only if on_chemotherapy = yes),
   neutropenia_known (yes/no, required).
3. On submit, server-side validation rejects out-of-range values with a
   field-level error and re-renders the form.
4. On valid submit, the system computes an ESI-like acuity 1–5 from a
   deterministic rule set (vitals + age + oncology context). Acuity is
   never computed by the LLM.
5. On valid submit, the system runs the chief_complaint plus the structured
   context through `gpt-4o-mini` and returns a list of suspected oncologic
   emergencies from the closed set {neutropenic_fever, tumor_lysis,
   cord_compression, hypercalcemia_of_malignancy, none}.
6. A TriageEvent row is created. Patient is upserted (hashed patient identifier
   is the key); name is encrypted before storage.
7. The nurse is redirected to a confirmation page showing the assigned
   acuity, the emergency flags (if any), and a "submit another" link.
8. Median end-to-end submit→confirmation latency is < 3 seconds on the
   test box.
9. An audit log row is written with timestamp, triage_event_id, acting
   user (placeholder for v1), and the acuity and flags assigned.
10. If the LLM call fails for any reason, the TriageEvent is still saved
    with a `extractor_status = "failed"` flag and the nurse sees the
    confirmation without emergency flags (graceful degradation).

## Out of scope
- Doctor's queue view (next story).
- Authentication / hospital SSO (v2).
- Live updates without page refresh (v2).
- Auto-paging the on-call attending (v2).
- EMR integration (v3).
```

Read every bullet. Each one has to be independently checkable — that is the contract of an acceptance criterion. Notice criterion 4 explicitly states the LLM does not compute acuity (Rule 5: the LLM is for judgment calls, not arithmetic). Notice criterion 10 anticipates failure modes.

> ⚠️ **Watch out.** If you read the story and think *"actually the doctor also needs…"* — stop. Add it to the *next* story, not this one. Scope creep at the story stage propagates through every subsequent stage. The discipline of one-story-per-pipeline-pass is the whole game.

### Approval gate 1

Stop and read the story carefully. Three possible outcomes:

- **Approve.** The story matches the PRD. Move on.
- **Revise.** A criterion is wrong or missing. Tell the story-writer specifically what to change and re-run.
- **Reject.** The story is in the wrong shape. Go back to the PRD, fix it, re-run from Stage 0.

Most teams catch one missing criterion here. That is the gate working as designed.

When you approve, save the story to `docs/stories/01-nurse-form.md`. This file is the input to Stage 3.

## Stage 3 — Spec-writer (15 minutes)

Now the brief.

> Have spec-writer turn `docs/stories/01-nurse-form.md` into a technical brief.

Claude delegates to `spec-writer` (Sonnet, read-only). It reads the story, the PRD, the CLAUDE.md, and the codebase researcher's inventory. It returns something like this:

```markdown
# Technical Brief — Nurse Triage Form

## Data model

### Patient (triage/models.py)
- patient_id_hash — CharField(64), unique, indexed. One-way hash of the patient identifier.
- name_encrypted — BinaryField. Application-level encrypted patient name.
- age — IntegerField, 0–120 enforced at form layer.
- sex — CharField(8), choices = M/F/Other.
- created_at — DateTimeField(auto_now_add=True).

### TriageEvent (triage/models.py)
- patient — ForeignKey(Patient, on_delete=PROTECT).
- timestamp — DateTimeField(auto_now_add=True), indexed.
- chief_complaint — TextField, max 2000 chars.
- vitals — JSONField. Schema: {hr, sbp, dbp, rr, spo2, temp_c}.
- oncology_context — JSONField. Schema: {known_malignancy,
  on_chemotherapy, days_since_last_cycle, neutropenia_known}.
- acuity — IntegerField, choices = 1..5.
- oncologic_emergency_flags — JSONField (list of strings).
- extractor_status — CharField(16), choices = ok/failed/timeout.
- audit_user — CharField(80), nullable for v1.

## Services

### AcuityCalculator (triage/services/acuity.py)
- Pure-Python class. No I/O.
- compute(vitals: dict, age: int, oncology: dict) -> int (1..5).
- Rule table (excerpt):
  - Acuity 1: SBP < 90, OR SpO2 < 88, OR RR > 30, OR temp ≥ 39 AND
    on_chemotherapy AND neutropenia_known.
  - Acuity 2: temp ≥ 38 AND on_chemotherapy (febrile neutropenia rule-out),
    OR SBP 90–100, OR SpO2 88–92.
  - Acuity 3: HR > 120 OR RR 22–30 OR temp 37.5–37.9.
  - Acuity 4: stable vitals + symptomatic.
  - Acuity 5: stable vitals + minor complaint.

### OncologicEmergencyExtractor (triage/services/oncologic_emergency.py)
- Calls OpenAI API (`gpt-4o-mini`) through PydanticAI.
- Input: chief_complaint (str) + oncology_context (dict).
- Output: List[Literal["neutropenic_fever", "tumor_lysis",
  "cord_compression", "hypercalcemia_of_malignancy"]].
- Temperature = 0. System prompt names the four conditions and explicit
  exclusion criteria. Pydantic schema enforces the closed set.
- Timeout: 10 seconds. On failure, returns ([], status="failed").

## Views and URL routes

### NurseForm (triage/views.py)
- GET /triage/new → render triage/nurse_form.html with empty form.
- POST /triage/new →
  1. Validate the form. On error, re-render with field errors.
  2. Compute acuity (deterministic).
  3. Call OncologicEmergencyExtractor.
  4. Upsert Patient (by hashed patient identifier).
  5. Create TriageEvent.
  6. Write audit log row.
  7. Redirect to /triage/<id>/confirm.

### TriageConfirmation (triage/views.py)
- GET /triage/<id>/confirm → render triage/triage_confirmation.html.
- Read-only. Shows acuity, flags, "submit another" link.

## Test list (triage/tests/)

1. test_acuity_septic_shock_returns_1
2. test_acuity_febrile_neutropenia_returns_2
3. test_acuity_stable_returns_5
4. test_extractor_returns_neutropenic_fever_for_known_case
5. test_extractor_returns_empty_for_unrelated_complaint
6. test_extractor_handles_timeout_gracefully
7. test_nurse_form_get_renders
8. test_nurse_form_post_creates_triage_event_and_redirects

## File list

Create:
- triage/models.py (replace)
- triage/services/__init__.py
- triage/services/acuity.py
- triage/services/oncologic_emergency.py
- triage/forms.py
- triage/views.py (replace)
- triage/urls.py
- triage/templates/triage/nurse_form.html
- triage/templates/triage/triage_confirmation.html
- triage/tests/__init__.py
- triage/tests/test_acuity.py
- triage/tests/test_extractor.py
- triage/tests/test_views.py
- requirements.txt
- .env.example
- pytest.ini

Modify:
- er_triage/urls.py (include triage.urls)
- er_triage/settings.py (add 'triage' to INSTALLED_APPS, JSONField config)
```

Read it carefully. The brief is the contract Stage 4 will execute against. If a field is missing here, Stage 4 will not write it. If a test is missing here, Stage 6 will not verify it.

### Approval gate 2

Same three options: approve, revise, reject. Most teams catch one underspecified service or one missing test at this gate. That is exactly what the gate is for.

Save the brief to `docs/briefs/01-nurse-form.md`.

> 🔧 **Technical Stuff.** Notice the brief explicitly assigns acuity computation to a pure-Python class with no I/O — not the LLM. This is Rule 5 of the project CLAUDE.md, surfaced into the spec. The brief encodes the rule in the architecture. The build stage cannot accidentally hand acuity to `gpt-4o-mini` because the brief did not give it that affordance.

## Checkpoint — what you have on disk

Before you walk away, confirm the artifacts:

```
er_triage/
├── CLAUDE.md                                  ← Lesson 8 setup
├── docs/
│   ├── ER-Triage-PRD.md                       ← Stage 0
│   ├── stories/01-nurse-form.md               ← Stage 2 (approved)
│   └── briefs/01-nurse-form.md                ← Stage 3 (approved)
├── .claude/
│   ├── agents/
│   │   ├── codebase-researcher.md
│   │   ├── story-writer.md
│   │   └── spec-writer.md
│   └── skills/prd-builder/                    ← copied from Lesson 1
├── er_triage/   (Django project — scaffolded)
└── triage/      (Django app — empty, ready for Stage 4)
```

That stack is the entire Lesson 8 deliverable. No production code yet. Three documents, three subagents, a scaffold, and a project memory. The next lesson is the build.

## Try This

Before Lesson 9, run a second pass — this time for the doctor's queue screen. The story should look something like *"As the on-call medical oncology attending, I can see all open triage events ordered by acuity, with oncologic emergency flags highlighted, and click into any patient to see the nurse note and AI extraction."*

Run only Stages 2 and 3 (story-writer, then spec-writer). Save the outputs to `docs/stories/02-doctor-queue.md` and `docs/briefs/02-doctor-queue.md`. You will use them in the *Try This* at the end of Lesson 9.

## Watch Out

The three approval gates feel like friction. They are not. They are the single most-important thing in this pipeline.

If you skip the story-writer approval and let the spec-writer run on a wrong story, the brief is wrong. If you skip the brief approval and let the backend-builder run on a wrong brief, the code is wrong. Every gate skipped is a gate the code review at the end has to catch — and the validator at Stage 7 is good, but it is not a substitute for reading what your team wrote.

The medical analogy. You would not let a resident write orders based on a verbal handoff that was never read back. You would not let an attending sign a consent that was never explained to the patient. The Software Factory gates are read-backs and consents. Treat them with the same seriousness, and Lesson 9 will be smooth.
