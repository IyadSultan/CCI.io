---
layout: page
title: "Lesson 9: Software Factory Part 2 — Build, Test, Validate"
permalink: /session_10/instructions/lesson9_factory_part2/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 9 — The Software Factory, Part 2: Build → Test → Validate

*45 minutes. The second half of the capstone. By the end you have a running nurse form, a passing test suite, a validator-clean codebase, and the eval-suite hook wired in.*

The attending finishes her chart review. She walks to the bedside. She does the physical exam. She writes the orders. The chief resident reads the orders back. The pharmacist verifies the doses. The bedside nurse confirms the IV access. Only then is the patient treated.

That cascade — *exam*, *orders*, *read-back*, *verification*, *confirmation* — is what the second half of the Software Factory pipeline does. The backend-builder examines the brief and writes the code. The frontend-builder writes the templates. The test-verifier writes the acceptance test. The implementation-validator reads it all back against the brief and reports what is wrong. If anything is wrong, you loop. When nothing is wrong, you merge.

You finished Lesson 8 with three documents and an empty Django app. In this lesson you ship the app.

> 🧠 **Remember.** Stages 4, 5, and 6 write code. Stage 7 does not. The validator is read-only and that is its superpower — it is the only stage that compares what is on disk to what the brief said should be on disk.

## Setup — one more subagent and one new skill (5 minutes)

You already have codebase-researcher, story-writer, and spec-writer in `.claude/agents/`. Add four more.

**`.claude/agents/backend-builder.md`**

```markdown
---
name: backend-builder
description: Implements the backend half of an approved technical brief — models, migrations, services, views, URL routes, and unit tests. Uses the build-with-tests skill when present.
tools: Read, Edit, Write, Bash
model: sonnet
---

You are a backend builder. You implement exactly what the brief specifies — no more, no less.

Process:
1. Read the brief at the path the user gives you.
2. Read CLAUDE.md and match its conventions.
3. If a `build-with-tests` skill is available, follow it.
4. Write the code and the tests in the same commit.
5. Run the tests. Surface any failures.

If the brief is missing detail, do not improvise. Stop and ask.
```

**`.claude/agents/frontend-builder.md`**

```markdown
---
name: frontend-builder
description: Implements the templates, htmx wiring, and styling for an approved brief. Does not modify Python.
tools: Read, Edit, Write, Bash
model: sonnet
---

You are a frontend builder. You write HTML templates and the htmx wiring.

Process:
1. Read the brief and CLAUDE.md.
2. Write the templates listed in the brief's file list.
3. Use Tailwind CDN — no build step in this project.
4. Render the form server-side; use htmx only for the inline acuity preview.
5. Do not modify Python code. If a view is missing a context variable you need, stop and tell the user.
```

**`.claude/agents/test-verifier.md`**

```markdown
---
name: test-verifier
description: Writes a single end-to-end acceptance test that exercises the approved user story.
tools: Read, Edit, Write, Bash
model: sonnet
---

You are a test verifier. You write one acceptance test per story.

Process:
1. Read the story's acceptance criteria.
2. Write one test that posts to the form view, asserts the TriageEvent was
   created with the right acuity and emergency flags, and confirms the
   redirect target.
3. Run it. If it fails, do not fix the code — surface the failure.
```

**`.claude/agents/implementation-validator.md`**

```markdown
---
name: implementation-validator
description: Read-only review of code on disk against an approved brief. Returns a findings report classified CRITICAL / IMPORTANT / MINOR.
tools: Read, Grep, Glob
model: sonnet
---

You are an implementation validator. You never write code.

Process:
1. Read the brief.
2. Read every file the brief said would be created or modified.
3. For each acceptance criterion in the story, find the code that satisfies it.
4. For each test in the brief's test list, confirm it exists and passes.
5. Return a findings report. Each finding is classified:
   - CRITICAL — a missing safety check, a PHI leak, an unhandled error path,
     a missing acceptance criterion.
   - IMPORTANT — a deviation from the brief that affects behavior but not safety.
   - MINOR — style or naming inconsistency.
6. If you find no issues, say so explicitly.
```

Then create the `build-with-tests` skill at `.claude/skills/build-with-tests/SKILL.md`:

```markdown
---
name: build-with-tests
description: Use when implementing a brief that has a named test list. Writes code and tests in the same commit, runs the tests after every edit, and never marks a step complete until tests are green.
---

# Build with Tests — Playbook

1. Read CLAUDE.md first. Match its conventions exactly.
2. For each file in the brief's file list:
   a. Write the file.
   b. If the brief names a test for it, write the test in the same step.
   c. Run `pytest -x` after every file. Stop on the first failure.
3. After all files are written, run the full suite. Surface any failures.
4. Never silently skip a test. Never `xfail` a test the brief required.
5. If a test would require a network call (OpenAI API), mock it.
```

That is the toolbox for Lesson 9. Save and move on.

> 💡 **Tip.** Four small subagents is better than one big one. Each one has a single permission set, a single job, and a single output shape. When something goes wrong you know which agent to look at.

## Stage 4 — Backend builder (15 minutes)

Now the build.

> Use backend-builder with the build-with-tests skill to implement Stage 4 of `docs/briefs/01-nurse-form.md`.

Claude delegates to `backend-builder`. The skill fires automatically because the brief has a named test list. The agent reads CLAUDE.md, reads the brief, and starts writing files.

Expect to see, in order:

1. **`requirements.txt`** — django==5.0, pytest==8, pytest-django==4.8, pydantic-ai==0.0.13, openai==1.40, cryptography==42 (for field-level encryption), python-dotenv==1.0.
2. **`.env.example`** — `OPENAI_API_KEY=`, `OPENAI_MODEL=gpt-4o-mini`, `PHI_ENCRYPTION_KEY=`, `PATIENT_ID_HASH_SALT=`.
3. **`pytest.ini`** — points pytest-django at `er_triage.settings`.
4. **`triage/models.py`** — `Patient` and `TriageEvent` as the brief specified. JSONField for vitals, BinaryField for the encrypted name, indexed `patient_id_hash`, indexed `timestamp`.
5. **`triage/services/acuity.py`** — pure-Python class. The rule table is exactly the brief's. No I/O.
6. **`triage/services/oncologic_emergency.py`** — PydanticAI agent backed by the OpenAI API. System prompt names the four emergencies. Temperature 0. Returns the Pydantic `EmergencyExtraction` model. **Note: in the first pass, this file calls the OpenAI client without wrapping the call in try/except.** (Hold that thought for Stage 7.)
7. **`triage/forms.py`** — `NurseTriageForm` with the ten fields and the range validators.
8. **`triage/views.py`** — `nurse_form_view` (GET + POST) and `triage_confirmation_view`.
9. **`triage/urls.py`** + edit to `er_triage/urls.py` — wire `/triage/new` and `/triage/<id>/confirm`.
10. **`triage/tests/test_acuity.py`**, **`test_extractor.py`**, **`test_views.py`** — the six unit tests from the brief.

After each file the skill re-runs the test suite. The agent ends with:

```
$ pytest -x
=========================== test session starts ============================
collected 6 items

triage/tests/test_acuity.py ...                                       [ 50%]
triage/tests/test_extractor.py ..                                     [ 83%]
triage/tests/test_views.py .                                          [100%]

============================ 6 passed in 0.84s =============================
```

Six green dots. Stage 4 is done.

> 🔧 **Technical Stuff.** The extractor's tests mock the OpenAI client — `test_extractor_returns_neutropenic_fever_for_known_case` patches `openai.OpenAI` and asserts the Pydantic schema parses the mocked response. No test in the suite actually calls the OpenAI API. That is by design — unit tests run offline; the network gets exercised only when you manually submit the form in the browser.

## Stage 5 — Frontend builder (10 minutes)

> Use frontend-builder to implement Stage 5 of the brief.

Claude delegates to `frontend-builder`. The agent writes two templates.

**`triage/templates/triage/nurse_form.html`** — a single page with Tailwind classes for spacing and color, the ten form fields rendered server-side, and one htmx attribute on the vitals block that posts to `/triage/preview` for a live acuity preview (you can leave the preview endpoint as a v2 placeholder if you are short on time; the form still works without it).

**`triage/templates/triage/triage_confirmation.html`** — a thank-you page that shows the assigned acuity in a color block (red 1–2, yellow 3, green 4–5), lists any emergency flags as pill-shaped badges, and offers a "submit another" link back to `/triage/new`.

Now start the server and look at the form:

```
$ python manage.py migrate
$ python manage.py runserver
```

Open `http://127.0.0.1:8000/triage/new` in a browser.

[FIGURE 1: The nurse form rendered in a browser — chief complaint textarea at the top, two columns of vitals fields below, an oncology context section, a green "Submit" button at the bottom.]

Fill it out for a test patient. Submit. You should land on the confirmation page with the assigned acuity and (if the chief complaint described fever in a neutropenic patient on chemo) a `neutropenic_fever` flag.

> ⚠️ **Watch out.** If the form looks ugly, that's Tailwind CDN being CDN. For a real deployment we would compile Tailwind into a static asset. For the capstone, the CDN approach keeps the build step out of the lesson.

## Stage 6 — Test-verifier (5 minutes)

> Use test-verifier to write an acceptance test that exercises the user story end-to-end.

Claude delegates to `test-verifier`. The agent writes `triage/tests/test_acceptance.py`:

```python
import pytest
from django.urls import reverse
from triage.models import TriageEvent
from unittest.mock import patch

@pytest.mark.django_db
def test_nurse_can_submit_neutropenic_fever_case(client):
    """As a triage nurse, I can submit a febrile neutropenic patient on
    chemo and see the system assign acuity 1 and flag neutropenic_fever."""
    payload = {
        "mrn": "999888777",
        "name": "Test Patient",
        "age": 58, "sex": "F",
        "chief_complaint": "Fever 39.4 for 6 hours, last chemo 9 days ago.",
        "heart_rate": 118, "systolic_bp": 102, "diastolic_bp": 64,
        "respiratory_rate": 22, "spo2": 95, "temperature_c": 39.4,
        "known_malignancy": "yes", "on_chemotherapy": "yes",
        "days_since_last_cycle": 9, "neutropenia_known": "yes",
    }

    with patch("triage.services.oncologic_emergency.OncologicEmergencyExtractor.extract") as mock:
        mock.return_value = (["neutropenic_fever"], "ok")
        response = client.post(reverse("nurse_form"), payload)

    assert response.status_code == 302
    event = TriageEvent.objects.get()
    assert event.acuity in (1, 2)
    assert "neutropenic_fever" in event.oncologic_emergency_flags
    assert event.extractor_status == "ok"
```

Run it.

```
$ pytest triage/tests/test_acceptance.py
=========================== test session starts ============================
collected 1 item

triage/tests/test_acceptance.py .                                     [100%]

============================ 1 passed in 0.31s =============================
```

Green. Stage 6 done.

> 🧠 **Remember.** The acceptance test is *one* test, not many. It exercises the user story end-to-end, not the unit pieces. The six unit tests in Stage 4 already cover the pieces. The acceptance test proves they wire together correctly.

## Stage 7 — Implementation-validator, with the planted bug (10 minutes)

Now the hard part.

> Use implementation-validator to review the code on disk against `docs/briefs/01-nurse-form.md`.

Claude delegates to `implementation-validator`. The agent reads the brief, reads every file in the file list, and returns its findings. You should see something like this:

```markdown
# Validator Findings — 01-nurse-form

## CRITICAL

### 1. OncologicEmergencyExtractor does not catch network failures
File: triage/services/oncologic_emergency.py, lines 41–58.
The call to `self.client.beta.chat.completions.parse(...)` is not wrapped in
try/except. The brief's acceptance criterion 10 requires graceful degradation:
"If the LLM call fails for any reason, the TriageEvent is still saved with a
`extractor_status = 'failed'` flag." Currently a network blip, a 5xx from
OpenAI, or a Pydantic ValidationError will raise out of the view and the
nurse will see a 500 page — losing the triage row entirely.

Fix: wrap the call in try/except (openai.APITimeoutError, openai.APIError,
ValidationError). On failure, return ([], "failed"). The view already
inspects the status string.

## IMPORTANT

(none)

## MINOR

### 2. `triage/forms.py` field labels are not consistent
The label for `spo2` is "Spo2" but the brief and the nurse-facing template
use "SpO₂". Cosmetic; will confuse the nurse on first use.

Fix: set `label = "SpO₂"` in the form field definition.

## Confirmed compliant
- Data model matches the brief.
- AcuityCalculator is pure-Python with no I/O.
- LLM does not compute acuity.
- Patient identifier is hashed before storage.
- Name is encrypted at rest before storage.
- All six unit tests + the acceptance test pass.
- No PHI in any log statement found by grep.
```

There it is. The CRITICAL finding is the planted bug — the backend-builder shipped the extractor without a try/except. The validator caught it.

> 💡 **Tip.** The validator is what makes the pipeline trustworthy. The build agents are optimistic by nature; the validator is paranoid by nature. Both attitudes have their place. Putting them in different agents means each one can do its job without compromising.

### The 4 ↔ 7 loop

> Loop back to backend-builder and fix finding #1.

Claude delegates back to `backend-builder`. The agent reads the validator's finding, opens `triage/services/oncologic_emergency.py`, and edits the call:

```python
try:
    result = self.client.beta.chat.completions.parse(
        model=self.model,  # reads OPENAI_MODEL from .env, default gpt-4o-mini
        messages=messages,
        response_format=EmergencyExtraction,
        timeout=10.0,
    )
    return (result.choices[0].message.parsed.flags, "ok")
except (openai.APITimeoutError, openai.APIError) as e:
    logger.warning("oncologic_emergency_extractor_timeout id=%s", uuid4())
    return ([], "failed")
except ValidationError as e:
    logger.warning("oncologic_emergency_extractor_schema_error id=%s", uuid4())
    return ([], "failed")
```

The agent also adds a new unit test, `test_extractor_returns_failed_on_timeout`, that patches the client to raise `APITimeoutError` and asserts the return tuple is `([], "failed")`.

Re-run Stage 6 (acceptance test still passes — it mocks the call, so the change is transparent). Re-run Stage 7. The validator's report this time:

```markdown
## CRITICAL
(none)

## IMPORTANT
(none)

## MINOR
### 1. (previous #2) still present
Cosmetic label inconsistency — recommend fix but not blocking.

## Confirmed compliant
... (all checks pass) ...
```

You decide whether the MINOR is worth a third loop. For the capstone, fix it inline and move on.

### Approval gate 3

Read the final validator report. If there are no CRITICAL or IMPORTANT findings, approve the merge. Commit the whole thing.

```
$ git init && git add -A && git commit -m "ER triage nurse form, validated"
```

> ⚠️ **Watch out.** The validator is good but it is not omniscient. It cannot catch a bug the brief did not anticipate. If the brief is wrong, the validator declares the wrong thing compliant. That is why Stage 3's gate matters as much as Stage 7's.

## Wiring it up — the eval-suite hook (5 minutes)

You met hooks in Lesson 7. The single most important hook for clinical code is the eval gate: whenever a file under `triage/services/` changes, re-run the test suite automatically. That way no prompt edit ships without the tests proving the schema still parses.

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "post_tool": [
      {
        "matcher": { "tool": "Edit", "path_glob": "triage/services/**/*.py" },
        "command": "pytest triage/tests/ -x --tb=short",
        "timeout_ms": 60000
      }
    ]
  }
}
```

Now whenever any future agent edits a service file, the test suite runs automatically. If it fails, you see the failure in the next agent turn — before any other edit lands.

> 🔧 **Technical Stuff.** In a production pipeline, this hook would run the full eval suite against a held-out evaluation cohort in your organization's eval database. For the capstone, the local test suite is the eval stand-in. The shape is the same: change a prompt → automatically prove nothing regressed.

### Optional appendix — production deploy (out of scope for the demo)

This capstone deliberately uses **SQLite** and the **OpenAI API** so you can run everything on a laptop with no cloud database. For a real deployment you would swap SQLite for a managed database (Postgres, for example), move secrets into your platform's secret store, and follow your organization's deployment checklist. We do not walk through production deploy in this lesson — the focus is the Software Factory pipeline, not hosting.

## Checkpoint — what you shipped

Commit-by-commit, the final repo:

```
er_triage/
├── CLAUDE.md
├── docs/
│   ├── ER-Triage-PRD.md
│   ├── stories/01-nurse-form.md
│   └── briefs/01-nurse-form.md
├── .claude/
│   ├── agents/
│   │   ├── codebase-researcher.md
│   │   ├── story-writer.md
│   │   ├── spec-writer.md
│   │   ├── backend-builder.md
│   │   ├── frontend-builder.md
│   │   ├── test-verifier.md
│   │   └── implementation-validator.md
│   ├── skills/
│   │   ├── prd-builder/
│   │   └── build-with-tests/
│   └── settings.json                       ← eval-suite hook
├── requirements.txt
├── .env.example
├── pytest.ini
├── manage.py
├── er_triage/
│   ├── settings.py
│   └── urls.py
└── triage/
    ├── models.py
    ├── forms.py
    ├── views.py
    ├── urls.py
    ├── services/
    │   ├── acuity.py
    │   └── oncologic_emergency.py
    ├── templates/triage/
    │   ├── nurse_form.html
    │   └── triage_confirmation.html
    └── tests/
        ├── test_acuity.py
        ├── test_extractor.py
        ├── test_views.py
        └── test_acceptance.py
```

Six things you did, in order, to get here:
1. Wrote the PRD with the PRD-Builder skill (Lesson 8).
2. Inventoried the empty scaffold with `codebase-researcher` (Lesson 8).
3. Wrote and approved the user story with `story-writer` (Lesson 8).
4. Wrote and approved the technical brief with `spec-writer` (Lesson 8).
5. Built and validated the backend + frontend with `backend-builder`, `frontend-builder`, `test-verifier`, `implementation-validator` (Lesson 9, with one 4↔7 loop).
6. Wired the eval-suite hook (Lesson 9).

That is the entire Software Factory pipeline. You used every concept from Lessons 1–7: the PRD, CLAUDE.md, skills, MCP-style structured prompts, subagents, the brief gate (the worktree-style isolation lives in each agent's permission scope), the eval-suite hook.

## Try This

Run the same pipeline for the doctor's queue screen. You already wrote the story and the brief in the Lesson 8 *Try This*. Now:

1. Run `backend-builder` on `docs/briefs/02-doctor-queue.md`. Expect a `QueueView` that selects all open TriageEvents ordered by acuity, plus a couple of new unit tests.
2. Run `frontend-builder` to write `triage/templates/triage/doctor_queue.html` — a single-page table with rows color-coded by acuity and pills for the emergency flags.
3. Run `test-verifier` to write one acceptance test: the doctor sees the queue with the highest-acuity patient at the top and the right flag visible.
4. Run `implementation-validator`. There may be a CRITICAL finding (we did not plant one — but you may find one anyway).
5. Loop until clean. Commit.

By the time you finish, the app has both screens and the eval-suite hook protects every future change.

## Watch Out

The hardest lesson from this capstone is the one no agent can teach you.

For a production version of this app — the one the ER actually uses — the LLM extractor needs a **full eval governance layer**. A held-out evaluation cohort. Per-category sensitivity baselines. Drift alerts that fire when a model version change drops F1 by more than 5 points on any of the four emergencies. A clear on-call process for whoever investigates a drift alert.

The capstone version uses a mocked extractor and a local pytest suite. That is fine for the curriculum. It is **not fine for a clinical deployment**. A neutropenic fever case missed by a drifted model is a patient dead by Friday.

The Software Factory ships the *code*. Production governance — eval cohorts, drift alerts, the human on call — ships the *clinical AI*. Both layers must be in place before any prompt that influences triage touches a real patient. If you remember nothing else from Session 10, remember that.

You finished the capstone. You shipped a Django app using the same document-first pipeline professional teams use. Next lesson is the cheat sheet — the one-page reference card you keep open the next time you sit down to build.
