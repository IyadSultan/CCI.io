# Session 10 — Plan (for review before writing)

**Title:** *Building Clinical AI Software with Claude Code — From PRD to Production*
**Audience:** CCI students (clinicians who completed Session 9)
**Format:** 10 lessons, ~3–3.5 hours of teaching content + a 2-lesson capstone build
**Companion artifact:** the book *Claude Code for Dummies* (`session_10/claude_code_for_dummies/`) is the deep reference; Session 10 is the **applied** course

---

## The arc

The session has three movements:

1. **Lessons 1–2 — Decide what to build, then teach Claude your rules.** PRD → CLAUDE.md.
2. **Lessons 3–7 — Build the Claude Code toolbox.** Skills, MCP/Connectors, subagents, worktrees/workflow, loops/schedules.
3. **Lessons 8a–8b — The Software Factory capstone.** Use everything above to ship a real Django ER triage app, end-to-end, via the seven-agent pipeline from the freeCodeCamp framework.
4. **Lesson 9 — Cheat sheet and what to ship next.**

This mirrors the **five-layer foundation** from the Software Factory framework: context, knowledge (CLAUDE.md), agents, workflow, delivery. Lessons 2–7 build each layer. Lessons 8a–8b operate the whole stack.

---

## The lessons

### Lesson 1 — Writing a PRD with the PRD-Builder Skill *(20 min)*

**Why first.** Every clinical AI tool starts with someone saying "we need a thing that does X." A PRD turns that sentence into a structured spec the rest of the session (and Claude Code) can act on.

**Concept.** What a PRD is (one-page-plus document: problem, users, scope, success criteria, data model, risks, out-of-scope). Why clinicians benefit from writing one (prevents the "build then realize" cycle). What the PRD-Builder skill does (interactive Q&A → structured Markdown).

**Worked example.** Generic warm-up — students each draft a PRD for a tool they actually want (the user picks something simple, e.g., a chemotherapy round-up email summarizer). Lesson 8a will start fresh with a separate ER-triage PRD.

**Deliverables.** Instructions MD, quiz (5 Q on PRD anatomy), practice (write PRD for a stub clinical idea), reference card showing the PRD-Builder skill's expected sections.

**Note:** Content waits on the PRD skill you'll share.

---

### Lesson 2 — Memory: CLAUDE.md *(20 min)*

**Concept.** CLAUDE.md as the project's persistent instruction manual. Three levels (personal/project/directory). The litmus test ("would Claude make a mistake without this line?"). Auto-update on errors. @imports for keeping it lean. Conditional rules via `.claude/rules/` with path frontmatter.

**Worked example.** Take the Lesson 1 PRD, distill its non-negotiable rules into a 60-line CLAUDE.md. Show before/after of Claude's behavior with and without the file loaded.

**KHCC angle.** Walk through the KHCC starter CLAUDE.md (PHI rules, Optimus/Fernet, eval gate, stack constants).

**Deliverables.** Instructions MD, quiz (5 Q), practice (clean up a bloated example CLAUDE.md), the KHCC starter as a reusable template.

---

### Lesson 3 — Skills, Output Styles *(25 min)*

**Concept.** Skills are reusable Claude playbooks (`.claude/skills/<name>/SKILL.md`). Difference from CLAUDE.md (skills load on demand; CLAUDE.md loads always). Frontmatter, supporting files, scripts, references. Output styles are a 5-minute footnote (`/config` → Explanatory/Concise/Technical).

**Worked example.** Build a `clinical-pathology-extraction` skill: SKILL.md describing when to use it, a reference doc on common tumor-stage parsing pitfalls, a templates folder with the Pydantic schema. Show Claude invoking it automatically when asked to extract.

**Deliverables.** Instructions MD, quiz (5 Q), practice (write a `crcl-calculator-spec` SKILL.md from a description), one fully-worked skill folder as a starting template.

---

### Lesson 4 — MCP Servers and Anthropic Connectors *(25 min)*

**Concept.** MCP = Model Context Protocol, the standard for plugging Claude into external services. Three scopes (local/user/project). Connectors are Anthropic's curated, productized MCP integrations (Slack, Gmail, Notion, Linear, Google Drive) — install with a click; MCP servers are everything else, including ones you write yourself.

**Worked example.** Install the Slack connector to read a `#triage-alerts` channel from Claude Code. Then sketch a tiny custom MCP server in Python (or use a stub) that wraps a SELECT against an Azure SQL database — the AIDI-DB pattern from the book.

**Deliverables.** Instructions MD, quiz (5 Q distinguishing connectors vs custom MCP), practice (which MCP would solve each clinical problem), screenshots of the Connectors panel.

---

### Lesson 5 — Subagents and Agent Teams *(25 min)*

**Concept.** Subagent = a specialist with its own context window, tools, model, and system prompt. Lives in `.claude/agents/<name>.md`. Why parallelism (context hygiene, focused expertise, speed). Hub-and-spoke limitation (subagents only report to the main agent). Agent teams (experimental) for collaborative work.

**Worked example.** Create three subagents that will reappear in the capstone:
- `codebase-researcher` (Haiku, read-only — Read/Grep/Glob)
- `story-writer` (Sonnet, read-only)
- `spec-writer` (Sonnet, read-only — drafts the technical brief)

Run the researcher against a small repo.

**Deliverables.** Instructions MD, quiz (5 Q on when to use single agent vs subagent vs team), practice (write the YAML frontmatter for a `test-verifier` subagent), three subagent files as the starting block for Lesson 8.

---

### Lesson 6 — Worktrees and Workflows *(25 min)*

**Concept.** Two distinct ideas, often confused.

- **Worktrees = isolation.** `claude --worktree branch-name` clones the repo into a parallel working copy so you can run multiple Claudes on different branches without interference.
- **Workflow = orchestration.** A scripted chain of agents (often with human approval gates between them) that turns an idea into shipped code.

**Worked example.** Open three worktree panes for three independent tasks. Then write a `feature-factory` skill — a step-by-step playbook that orchestrates the seven-agent pipeline (preview of Lesson 8).

**Deliverables.** Instructions MD, quiz (5 Q), practice (draft a 4-step workflow for "fix a bug end-to-end"), one worktree cheat sheet.

---

### Lesson 7 — Long-Running: Loops, Schedules, Hooks *(25 min)*

**Concept.** Three patterns for "Claude without you watching":
- **Loops** — `/loop` for recurring background checks; the Ralph loop for hours-long autonomous runs anchored by a stop hook.
- **Schedules** — `cron` for nightly Claude jobs (headless mode + allowlist).
- **Hooks** — `PreToolUse`, `PostToolUse`, `Stop` lifecycle events that fire deterministic scripts (no LLM cost) at predictable moments. The chemotherapy-creatinine hard-stop analogy.

**Worked example.** Wire up a `Stop` hook that runs the eval suite after Claude finishes any task. Wire up a `PreToolUse` hook that blocks Bash commands containing `DROP TABLE`.

**Deliverables.** Instructions MD, quiz (5 Q on hooks/loops/schedules), practice (configure a hook that blocks rm -rf), the hook-installer template.

---

### Lesson 8a — The Software Factory, Part 1: PRD → Architecture → Skeleton *(45 min)*

**The capstone begins.** We are going to build a real ER triage application — Django + Postgres + Azure — using the Software Factory pattern. This first lesson covers the front end of the pipeline.

**The application (clinically grounded).** Two screens. **Nurse screen:** triage form (chief complaint free text, age, vitals, oncology-specific context: known malignancy yes/no, on chemotherapy yes/no, days since last cycle, neutropenia known yes/no). On submit, the system computes a triage acuity (ESI-like 1–5), runs the chief complaint through an LLM extraction for suspected oncologic emergencies (neutropenic fever, tumor lysis, cord compression, hypercalcemia), and queues the patient. **Doctor screen:** live queue sorted by acuity, color-coded flags for oncologic emergencies, click into a patient view to see the nurse note + AI extraction + recommended next steps.

**Pipeline coverage in this lesson.**

| Stage | Agent | What it produces this session |
|---|---|---|
| 0 | (student writes PRD using the PRD skill) | The ER triage PRD |
| 1 | `codebase-researcher` | (sample existing-app exploration, since we're starting fresh, just an inventory pass on a Django starter) |
| 2 | `story-writer` | First user story: *"As a triage nurse, I can submit a new arrival's vitals and chief complaint and see the system assign an acuity."* Plus acceptance criteria. **Human approval gate.** |
| 3 | `spec-writer` | Technical brief: Patient model fields, TriageEvent model, acuity calculator service, the nurse form view, the URL routing, the test list. **Human approval gate.** |

The session ends with a frozen brief and an approved scaffold. Implementation lands in Lesson 8b.

**Deliverables.** Instructions MD (long-form, walks step by step), the ER triage PRD as a saved artifact, the three approved documents (story, brief, file plan), the Django starter project at the checkpoint, quiz (5 Q on the approval gates), practice (write a second user story for the doctor's queue screen).

---

### Lesson 8b — The Software Factory, Part 2: Build → Test → Ship *(45 min)*

**The build half.** The brief from 8a meets reality.

| Stage | Agent | What it produces |
|---|---|---|
| 4 | `backend-builder` (uses `build-with-tests` skill) | Patient and TriageEvent models, migration, acuity service, Django views, URL routes, unit tests |
| 5 | `frontend-builder` | Two Django templates (nurse form + doctor queue), htmx for live updates, basic styling |
| 6 | `test-verifier` | An acceptance test that submits a nurse form and asserts the doctor queue updates with the right acuity |
| 7 | `implementation-validator` | A findings report grouped by severity. **Human approval gate** before merge. |

If the validator flags critical issues, loop back to Stage 4 or 5. We will deliberately introduce a planted bug (no rate limiting on form submit) so students see the loop in action.

**End state.** A running Django app on a local Postgres, with the eval-suite hook from Lesson 7 wired up so any prompt change re-runs the test suite automatically. Optional deploy to Azure App Service (instructions provided; not required to complete the session).

**Deliverables.** Instructions MD (long-form), the final repo as a tagged checkpoint, quiz (5 Q on what the validator caught), practice (add a third feature — "nurse can recall the last triage event" — using the same seven-stage pipeline), the deployed-app screenshot.

---

### Lesson 9 — Cheat Sheet + What to Ship Next *(15 min)*

**Concept.** One-page reference: every slash command, every keystroke, every hook signature, every artifact name from Lessons 1–8. Plus a short reading list (the book, the freeCodeCamp framework, Anthropic's Skills launch post).

**Deliverables.** Cheat sheet PDF, summary of the session in 200 words, an exit-ticket reflection prompt.

---

## Materials inventory

For each lesson:
- `instructions/lessonN_<slug>.md` — instructor narrative + student-facing content (NotebookLM-friendly)
- `quizzes/quiz_lessonN_<slug>.jsx` — React component, 5 Q per lesson
- `practices/practice_lessonN_<slug>.jsx` — React component, hands-on
- `templates/student/...` and `templates/solutions/...` where code is involved (lessons 3, 5, 6, 7, 8a, 8b)

Plus:
- `session_10_curriculum.md` — the master document tying everything together
- `data/notebooklm_sources.md` — paste-ready sources for 10 NotebookLM notebooks (one per lesson + one for the wrap-up review)
- `cheat_sheet.md` — Lesson 9 reference
- The full ER triage Django app under `templates/solutions/er_triage_app/`

## Time budget at a glance

| Lesson | Minutes | Cumulative |
|---|---|---|
| 1. PRD | 20 | 20 |
| 2. CLAUDE.md | 20 | 40 |
| 3. Skills | 25 | 65 |
| 4. MCP / Connectors | 25 | 90 |
| 5. Subagents | 25 | 115 |
| 6. Worktrees / Workflow | 25 | 140 |
| 7. Loops / Schedules / Hooks | 25 | 165 |
| 8a. Factory pipeline 1 | 45 | 210 |
| 8b. Factory pipeline 2 | 45 | 255 |
| 9. Cheat sheet | 15 | 270 |

**Total: ~4.5 hours.** If that's too long, the Software Factory capstone (8a + 8b) can be hived off into a graded lab, taking the main session back to ~3.5 hours.

---

## Open questions before I write

1. **The PRD skill.** You said you'd share it. Without it, I'll stub Lesson 1 with placeholders. Acceptable for now?

2. **Length budget.** 4.5 hours is realistic but long for one teaching session. Option to split into "Session 10" (Lessons 1–7 + 9, ~3 hr) and "Session 10 Lab" (Lessons 8a + 8b, ~1.5 hr graded).

3. **Anthropic Connectors recency.** The MCP/Connectors landscape moved fast in 2025–2026. If you want me to ground Lesson 4 in the current list of available Connectors (Slack, Google Workspace, Notion, etc.), I can WebFetch the Anthropic docs before writing.

4. **Django starter.** For Lesson 8a's "exploration" stage, I'll need a Django starter repo to seed the work. Should we use a fresh `django-admin startproject` skeleton, or do you have a KHCC Django starter template I should mirror?
