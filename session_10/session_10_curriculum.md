# CCI Session 10 — Building Clinical AI Software with Claude Code

*From PRD to production: 10 lessons + capstone*

**Author:** Iyad Sultan, MD — Medical Director, AI Office, King Hussein Cancer Center
**Audience:** CCI students who completed Session 9 (local development with VS Code)
**Format:** 10 lessons, ~4.5 hours total. Lessons 1–7 + 9 are the core (~3 hr); Lessons 8a–8b are the capstone (~1.5 hr) and can be assigned as a graded lab if time is short.
**Companion reference:** the book *Claude Code for Doctors, Nurses, Pharmacists and Everyone Else* (Session 10 book folder) is the deep reference. This curriculum is the applied course.

---

## Why this session exists

Session 9 taught the IDE — VS Code, a virtual environment, git, a small Gradio app, a Hugging Face Space. Session 10 teaches the **agent that lives inside the IDE**. By the end, students will have used Claude Code's full feature surface (skills, MCP, subagents, hooks, worktrees, loops, schedules) to ship a working clinical Django application end-to-end through the seven-agent **Software Factory** pipeline.

## The arc

| Movement | Lessons | What it covers |
|---|---|---|
| Decide & instruct | 1–2 | PRD → CLAUDE.md |
| Build the toolbox | 3–7 | Skills, MCP/Connectors, subagents, worktrees+workflows, loops+schedules+hooks |
| Capstone | 8a–8b | The Software Factory pipeline ships a Django ER triage app |
| Close | 9 | Cheat sheet + summary |

## Lesson titles

1. **Writing a PRD with the PRD-Builder Skill** *(20 min)*
2. **Memory: CLAUDE.md** *(20 min)*
3. **Skills (and a footnote on output styles)** *(25 min)*
4. **MCP Servers and Anthropic Connectors** *(25 min)*
5. **Subagents and Agent Teams** *(25 min)*
6. **Worktrees and Workflows** *(25 min)*
7. **Long-Running: Loops, Schedules, Hooks** *(25 min)*
8. **The Software Factory, Part 1 — PRD → Story → Brief** *(45 min)*
9. **The Software Factory, Part 2 — Build → Test → Validate** *(45 min)*
10. **Cheat Sheet + What to Ship Next** *(15 min)*

(Note: lessons 8 and 9 in this list correspond to the capstone *8a* and *8b* in the plan; lesson 10 in the list is the *9* close.)

## Materials inventory

For each of the 10 lessons:
- `instructions/lesson<N>_<slug>.md` — instructor narrative + student reading
- `quizzes/quiz_lesson<N>_<slug>.jsx` — 5-question React component
- `practices/practice_lesson<N>_<slug>.jsx` — hands-on React exercise

Plus, at the session root:
- `templates/skills/prd-builder/` — Dr. Sultan's PRD-Builder skill (used in Lesson 1)
- `templates/student/` and `templates/solutions/` — code skeletons for lessons that build something
- `templates/solutions/er_triage_app/` — full Django ER triage app produced by the capstone
- `data/notebooklm_sources.md` — 10 paste-ready NotebookLM sources, one per lesson
- `cheat_sheet.md` — Lesson 10 reference card

## The Software Factory framework

Lessons 8a–8b adapt the seven-agent pipeline from the freeCodeCamp "Software Factory" article. The three approval gates (story, brief, validator) are explicit human checkpoints — the same discipline as a consent, a tumor board sign-off, and an attending's final review.

| Stage | Agent | Tools | Model | What it produces |
|---|---|---|---|---|
| 1 | codebase-researcher | Read, Grep, Glob | Haiku | File inventory + risks |
| 2 | story-writer | Read | Sonnet | User story + acceptance criteria *(gate)* |
| 3 | spec-writer | Read, Grep, Glob | Sonnet | Technical brief *(gate)* |
| 4 | backend-builder | Read, Edit, Write, Bash | Sonnet | Models, services, unit tests |
| 5 | frontend-builder | Read, Edit, Write, Bash | Sonnet | Templates, htmx, styles |
| 6 | test-verifier | Read, Edit, Write, Bash | Sonnet | Acceptance test |
| 7 | implementation-validator | Read, Grep, Glob | Sonnet | Findings report *(gate)* |

## The capstone app: ER Triage

A two-screen Django + Postgres app, built end-to-end via the seven-agent pipeline.

**Nurse screen.** Triage form: chief complaint (free text), age, vitals, oncology-specific context (known malignancy yes/no, on chemotherapy yes/no, days since last cycle, neutropenia known yes/no). On submit, the system computes an ESI-like acuity (1–5), runs the chief complaint through an LLM extraction looking for oncologic emergencies (neutropenic fever, tumor lysis, cord compression, hypercalcemia of malignancy), and queues the patient.

**Doctor screen.** Live queue sorted by acuity, color-coded flags for oncologic emergencies, click into a patient view → nurse note + AI extraction + recommended next steps.

By the end of Lesson 9, students have a running Django app with the eval-suite hook from Lesson 7 wired in.

## Time budget

| Lesson | Minutes | Cumulative |
|---|---|---|
| 1. PRD | 20 | 20 |
| 2. CLAUDE.md | 20 | 40 |
| 3. Skills | 25 | 65 |
| 4. MCP / Connectors | 25 | 90 |
| 5. Subagents | 25 | 115 |
| 6. Worktrees / Workflows | 25 | 140 |
| 7. Loops / Schedules / Hooks | 25 | 165 |
| 8. Software Factory 1 | 45 | 210 |
| 9. Software Factory 2 | 45 | 255 |
| 10. Cheat sheet | 15 | 270 |

**Total: ~4.5 hours.** Instructors with only 3 hours teach Lessons 1–7 + 10 and assign 8 + 9 as a graded lab.

## Connecting the dots

The chain Session 10 teaches is the same chain the AI Office uses on real production work at KHCC. PRD → CLAUDE.md → skills + agents + hooks → worktree-parallelized build → eval-gated deploy. Every concept maps to something already running in the `aidi_catalog`. The ER triage capstone is the simplest illustration of that chain that still ships a usable clinical tool.
