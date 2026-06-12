# Session 11 — Plan (for review before writing)

**Title:** *From a Web Page to a Deployed Clinical App — Web Foundations and Django, Shipped on Render*
**Author:** Iyad Sultan, MD — Medical Director, AI Office, King Hussein Cancer Center
**Audience:** CCI students who completed Session 10 (Claude Code + clinical app building)
**Format:** 8 lessons, ~3 hours of teaching + a hands-on extend-and-deploy lab
**Companion artifact:** the Session 10 ER-triage Django app is the running example students load, extend, and publish.

---

## What changed from the v4 syllabus

The syllabus bullet for Session 11 was *"Django **& FastAPI** Deployment / Azure App Service."* Two deliberate changes, decided with Dr. Sultan:

1. **No FastAPI.** This is a pure web-foundations → Django session. FastAPI is dropped (can return in a later session if needed). Rationale: the audience is clinicians who have never built a web page; teaching two frameworks in one session buries the concept under syntax.
2. **Render, not Azure.** Students push to GitHub and connect the repo on Render to get a live URL. Free tier, GitHub-native, no cloud-console maze — deployment becomes genuinely hands-on instead of a screenshot tour.

---

## The arc

A deliberate climb from "what is a web page" to "my clinical app is live on the internet." Each rung is the smallest thing that makes the next rung make sense.

1. **Lessons 1–3 — Web foundations.** HTML → JavaScript & the frontend framework landscape → the full-stack picture (frontend/backend, request/response).
2. **Lesson 4 — The smallest Django.** A minimal Django site so students see the skeleton with nothing else in the way.
3. **Lessons 5–6 — The ER-triage app.** Tour the ready-made Session 10 app, then **extend it**: register a new Django app in `INSTALLED_APPS` and wire up a new feature.
4. **Lesson 7 — Ship it.** Push to GitHub → deploy on Render → live URL.
5. **Lesson 8 — Cheat sheet + what to build next.**

> ⚠️ **Build dependency.** The "ready-made ER-triage app" that Lessons 5–7 depend on **does not yet exist as runnable code.** Session 10 only *narrated* building it; `session_10/templates/{student,solutions}` are empty and there is no `manage.py` in the repo. So a core deliverable of Session 11 is **actually building the runnable ER-triage Django project** — a ready-made version, a student starter, a solution, and a Render deploy config. See "Materials inventory."

---

## The lessons

### Lesson 1 — What Is a Web Page? HTML from Scratch *(20 min)*
**Concept.** A web page is just a text file the browser knows how to draw. Tags, elements, structure (headings, paragraphs, lists, links, a form). A *very* light touch of CSS so it isn't ugly. No tooling — open an `.html` file in the browser.
**Worked example.** Hand-build a one-page "patient intake" sheet: a heading, a short form (name, age, chief complaint), a submit button that does nothing yet. That "does nothing yet" is the hook for Lesson 2.
**Deliverables.** Instructions MD, 5-Q quiz (HTML anatomy), practice (build a small page), a starter `index.html`.

### Lesson 2 — Making It Move: JavaScript & the Frontend Landscape *(25 min)*
**Concept.** JavaScript is what makes the page *do* things (the submit button now reacts). Then zoom out: the frontend framework landscape — React, Vue, Angular, Svelte — *what each is for* and why they exist, without teaching any of them deeply. The single message: frameworks manage complexity you don't have yet, so we'll stay simple.
**Worked example.** Add ~15 lines of vanilla JS so the Lesson 1 form shows an alert / appends the entry to a list on the page. Then a one-screen "map" of the framework ecosystem.
**Deliverables.** Instructions MD, 5-Q quiz, practice (add a small JS behavior), the enhanced page.

### Lesson 3 — The Full Stack: Frontend, Backend, and Where Django Lives *(20 min)*
**Concept.** Everything so far ran in the browser (frontend). But where does the data *live*? Enter the backend: a server that holds data and logic. The request/response cycle. A brief historical nod to server-rendered pages (the old Active Server Pages / PHP model) so students see Django is part of a long lineage, not a novelty. Where Django sits: a backend that renders HTML *and* holds the database.
**Worked example.** A diagram-driven walkthrough: nurse fills form (frontend) → request → Django (backend) computes acuity, saves to DB → response → page updates. Maps directly onto the ER-triage app they'll meet in Lesson 5.
**Deliverables.** Instructions MD, 5-Q quiz, practice (label the parts of a full-stack request), the stack diagram as a reusable asset.

### Lesson 4 — The Smallest Django That Runs *(25 min)*
**Concept.** `django-admin startproject`, the project vs. app distinction, `settings.py`, `INSTALLED_APPS`, one view, one URL route, one template, `python manage.py runserver`. Nothing else. The goal is to demystify the skeleton.
**Worked example.** Build a one-page Django site live: a single app, a view returning a template that says "Hello, KHCC." Students run it locally and see it in the browser.
**Deliverables.** Instructions MD, 5-Q quiz (project vs app, what each file does), practice (add a second page/route), the minimal project as a template.

### Lesson 5 — Meet the ER-Triage App *(25 min)*
**Concept.** Load the ready-made Session 10 ER-triage Django app. Orientation tour: project layout, `settings.py` / `INSTALLED_APPS`, the `triage` app, models (Patient, TriageEvent), the acuity service, views, templates, URLs, where the LLM extraction lives. How to run it locally and click through nurse → doctor screens. This is the "read a real codebase" skill from a clinician's seat.
**Worked example.** Run the app, submit a triage, watch the doctor queue update; then trace one click back through the code.
**Deliverables.** Instructions MD, 5-Q quiz (find-the-file: "where does acuity get computed?"), practice (a guided code scavenger hunt), the ready-made app.

### Lesson 6 — Extend It: Add Your Own Django App *(30 min) — the core lab*
**Concept.** The payoff. Students don't build from zero — they add a **new Django app** to a working project: `python manage.py startapp <name>`, register it in `INSTALLED_APPS`, add a model/view/URL/template, run it. The exact loop real teams use.
**Worked example (proposed).** Add a `dashboard` app: a read-only page that queries existing `TriageEvent` rows and shows counts by acuity (a tiny clinical ops view). Clean because it reuses existing data, needs no new form, and is visually rewarding. *Alternatives if you prefer:* a "recall last triage event" feature (from the S10 practice list) or a simple shift-handoff notes app.
**Deliverables.** Instructions MD, 5-Q quiz, practice (add a *second* feature solo), student starter + solution for the dashboard app.

### Lesson 7 — Ship It: GitHub → Render → Live URL *(25 min)*
**Concept.** Push the extended app to GitHub. Connect the repo on Render. The deploy essentials: `requirements.txt`, `gunicorn`, build & start commands, `ALLOWED_HOSTS`, `DEBUG=False`, environment variables for secrets (no keys in git), static files (`collectstatic` / WhiteNoise), and a managed Postgres add-on. End state: a public URL the student can text to a colleague.
**Worked example.** Take the Lesson 6 app from local to live on Render, step by step, including the first failed deploy and the fix (the realistic part).
**Deliverables.** Instructions MD, 5-Q quiz (what each deploy setting does), practice (deploy your solo feature), the Render config files (`render.yaml` / `build.sh` / settings deltas) as templates.

### Lesson 8 — Cheat Sheet + What to Build Next *(15 min)*
**Concept.** One-page reference: HTML tags, the request/response cycle, Django file map, the `startapp` → `INSTALLED_APPS` → url/view/template loop, the Render deploy checklist. Plus a short "what to ship next" reading list.
**Deliverables.** Cheat sheet, 200-word session summary, exit-ticket reflection.

---

## Time budget

| Lesson | Min | Cum |
|---|---|---|
| 1. HTML | 20 | 20 |
| 2. JS & frontends | 25 | 45 |
| 3. Full stack | 20 | 65 |
| 4. Smallest Django | 25 | 90 |
| 5. Meet ER-triage app | 25 | 115 |
| 6. Extend it (lab) | 30 | 145 |
| 7. Ship on Render | 25 | 170 |
| 8. Cheat sheet | 15 | 185 |

**Total: ~3 hours.**

---

## Materials inventory

Following the established per-session pattern:
- `session_11_curriculum.md` — master document
- `instructions/lessonN_<slug>.md` — instructor narrative + student reading, ×8
- `quizzes/quiz_lessonN_<slug>.jsx` — 5-Q React component, ×8
- `practices/practice_lessonN_<slug>.jsx` — hands-on React exercise, ×8
- `templates/student/` and `templates/solutions/` — code skeletons + solutions (Lessons 1, 2, 4, 6, 7)
- `data/notebooklm_sources.md` — one NotebookLM source set per lesson
- `cheat_sheet.md` — Lesson 8 reference
- `build_pptx.js` + `Session_11_*.pptx` — the deck

**Plus the big build (the dependency above):**
- `templates/solutions/er_triage_app/` — the **runnable** ER-triage Django project (the ready-made app for Lesson 5). Built fresh for this session.
- `templates/student/er_triage_app/` — the same app as the Lesson 6 starting point.
- `templates/solutions/er_triage_app_dashboard/` — the app with the dashboard feature added (Lesson 6 solution).
- Render deploy config (`requirements.txt`, `render.yaml` or `build.sh`, production `settings` deltas).

---

## Open questions before I write

1. **Build the ER-triage app, or do you have it?** The plan assumes I build the runnable Django app from scratch (it doesn't exist in-repo). If you already have an ER-triage Django project somewhere, point me at it and I'll adapt instead of build.
2. **The Lesson 6 extension feature.** I propose a read-only `dashboard` app (counts by acuity). OK, or would you rather the new app be something else (recall-last-event, handoff notes, audit log)?
3. **LLM extraction in the deployed app.** The S10 app calls an LLM (Azure OpenAI) for oncologic-emergency extraction. On Render, that needs an API key as an env var. Keep the live LLM call (and have students supply a key), or stub/mock it for the public demo so deployment doesn't depend on credentials? (Recommend: make it optional — works with a key, degrades gracefully without.)
4. **Database on Render.** SQLite (zero-config, fine for a demo) vs. Render's managed Postgres (more realistic, one extra step). Recommend SQLite for the lab, mention Postgres as the production upgrade.
5. **Deck + jsx now, or instructions first?** Same full material set as S10, or write the instruction MDs first for your review and add quizzes/practices/PPTX after?
