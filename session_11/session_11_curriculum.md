# CCI Session 11 — From a Web Page to a Deployed Clinical App

*Web foundations and Django, shipped on Render: 8 lessons, ~3 hours*

**Author:** Iyad Sultan, MD — Medical Director, AI Office, King Hussein Cancer Center
**Audience:** CCI students who completed Session 10 (Claude Code + clinical app building)
**Format:** 8 lessons, ~3 hours total. Lessons 1–4 are web foundations (~1.5 hr); Lessons 5–7 are the ER-triage app — tour, extend, deploy (~1.5 hr); Lesson 8 closes.
**Companion artifact:** the runnable **ER Triage Extractor** Django app (`templates/solutions/er_triage_app/`) — the same clinical app Session 10 designed, now built, that students tour, extend, and publish to the internet.

---

## Why this session exists

Session 10 taught students to *design and build* clinical software with Claude Code — the PRD, the pipeline, the agents. But every student stopped at the same wall: the app ran on their laptop and nobody else could see it. Session 11 takes down that wall. It starts from the very bottom — what a web page actually is — climbs through the full stack, and ends with each student's clinical app live on the public internet at a URL they can text to a colleague.

The arc is deliberately gentle. Most CCI students have never written a line of HTML. So we begin there, and every rung of the ladder is the smallest thing that makes the next rung make sense.

## The arc

| Movement | Lessons | What it covers |
|---|---|---|
| Web foundations | 1–4 | HTML → JavaScript & frontend frameworks → the full stack → the smallest Django |
| The ER-triage app | 5–7 | Tour the ready-made app → extend it with a new Django app → deploy to Render |
| Close | 8 | Cheat sheet + what to build next |

## Lesson titles

1. **What Is a Web Page? HTML from Scratch** *(20 min)*
2. **Making It Move: JavaScript & the Frontend Landscape** *(25 min)*
3. **The Full Stack: Frontend, Backend, and Where Django Lives** *(20 min)*
4. **The Smallest Django That Runs** *(25 min)*
5. **Meet the ER-Triage App** *(25 min)*
6. **Extend It: Add Your Own Django App** *(30 min)*
7. **Ship It: GitHub → Render → Live URL** *(25 min)*
8. **Cheat Sheet + What to Build Next** *(15 min)*

## What changed from the v4 syllabus

The syllabus listed Session 11 as *"Django & FastAPI Deployment / Azure App Service."* Two deliberate changes:

1. **No FastAPI.** This is a pure web-foundations → Django session. Teaching two backend frameworks to clinicians who have never built a web page buries the concept under syntax. FastAPI can return in a later session.
2. **Render, not Azure.** Students push to GitHub and connect the repo on Render for a live URL — free tier, GitHub-native, no cloud-console maze. Deployment becomes genuinely hands-on instead of a screenshot tour.

## Materials inventory

For each of the 8 lessons:
- `instructions/lesson<N>_<slug>.md` — instructor narrative + student reading (NotebookLM-friendly)
- `quizzes/quiz_lesson<N>_<slug>.jsx` — 5-question React component
- `practices/practice_lesson<N>_<slug>.jsx` — hands-on React exercise

Plus, at the session root:
- `templates/solutions/er_triage_app/` — the **runnable** ER-triage Django app (Lesson 5 tour, Lesson 6 starting point)
- `templates/student/er_triage_app/` — the same app, the Lesson 6 starting point students copy
- `templates/solutions/er_triage_app_with_dashboard/` — the Lesson 6 solution (adds a `dashboard` app)
- `data/notebooklm_sources.md` — paste-ready NotebookLM sources, one per lesson
- `cheat_sheet.md` — Lesson 8 reference card

## The capstone app: ER Triage Extractor

The same two-screen Django app Session 10 designed, now built and runnable:

**Nurse screen** (`/triage/new`). A triage form: chief complaint, age, vitals, oncology context. On submit, the system computes an ESI-like acuity (1–5) with a deterministic rule (never the LLM), runs the chief complaint through OpenAI looking for four oncologic emergencies (neutropenic fever, tumor lysis, cord compression, hypercalcemia of malignancy), and records the event. The LLM call **degrades gracefully** — no key, no crash.

**Doctor screen** (`/`). A live queue sorted by acuity, color-coded, with the AI flags surfaced. Click into any patient for the full detail view.

PHI is protected the KHCC way: MRNs Optimus-encoded, patient names Fernet-encrypted, never logged.

In Lesson 6 students add a third screen — a **dashboard** — as a brand-new Django app, the cleanest possible illustration of the `startapp → INSTALLED_APPS → url → view → template` loop. In Lesson 7 they push the whole thing to GitHub and deploy it on Render.

## Time budget

| Lesson | Minutes | Cumulative |
|---|---|---|
| 1. HTML | 20 | 20 |
| 2. JS & frontends | 25 | 45 |
| 3. Full stack | 20 | 65 |
| 4. Smallest Django | 25 | 90 |
| 5. Meet the app | 25 | 115 |
| 6. Extend it | 30 | 145 |
| 7. Ship on Render | 25 | 170 |
| 8. Cheat sheet | 15 | 185 |

**Total: ~3 hours.**

## Connecting the dots

Session 10 ended with an app that ran on one laptop. Session 11 ends with an app on the internet. The chain — HTML you can read, a stack you can reason about, a Django app you can extend, a GitHub push that becomes a live URL — is the same chain the AI Office walks every time it ships an internal tool. The ER-triage app is the simplest illustration of that chain that still does something a clinician would actually use.
