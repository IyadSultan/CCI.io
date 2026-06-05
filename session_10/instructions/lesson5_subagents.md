---
layout: page
title: "Lesson 5: Subagents and Agent Teams"
permalink: /session_10/instructions/lesson5_subagents/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 5 — Subagents and Agent Teams

When a complicated case lands in your clinic, you do not personally run the FISH probe, read the MRI, and write the pharmacogenomics report. You consult specialists. The molecular pathologist sits at her own microscope, opens a fresh case, and sends back one line — "MYCN amplified, ratio 12:1." You do not see the slides. You see the line. You act on the line.

A **subagent** is the Claude Code version of that consult. It is a second, fresh instance of Claude — a junior colleague your main session can call on — with its own narrow specialty, its own clean memory, its own restricted toolbox, and (sometimes) its own choice of model. It does the task. It sends back a summary. Your main session never sees the slides.

> 🧠 **Remember.** The first reason to reach for a subagent is not speed and not expertise. It is **context hygiene** — keeping your main conversation focused on the case while a specialist handles the side question in their own clean room.

## Three reasons to use one

Subagents earn their keep on three jobs.

**1. Context preservation.** You are an hour into building the ER triage app. Your main session is holding the whole design in its head. Now you need to know how the existing ER Extractor pipeline handles a particular edge case — that means reading twenty files. If you read those files in the main session, the design starts to slip out of memory and Claude forgets why you were building this. Delegate the read to a subagent. The subagent reads the twenty files in its own context window; your main session sees a five-line summary.

**2. Focused expertise.** A fresh session with a tight system prompt produces better answers than a long session with the same model wearing many hats. A subagent whose system prompt is "you are a senior code reviewer focused on PHI handling" produces a sharper review than the main session switching hats mid-conversation.

**3. Parallelism.** You can fire off several subagents at once. A documentation writer, a test generator, and an eval runner can all be working in parallel while you stay focused on the main task.

## Where they live

A subagent is a single Markdown file at:

```
.claude/agents/<name>.md
```

The file has YAML **frontmatter** (a small structured header between two `---` lines) followed by the subagent's system prompt. Four frontmatter fields matter:

- **`name`** — the unique handle. Your main session invokes it by this name.
- **`description`** — what the subagent is for. Claude reads this when deciding whether to delegate. **Write it like an order-set description**: precise, with examples of when to use and when not to. Include the word *PROACTIVELY* if you want the main agent to reach for the subagent on its own.
- **`tools`** — the comma-separated list of tools the subagent may use. Usually narrower than the main agent. A read-only researcher gets `Read, Grep, Glob` — not `Write`, not `Edit`, not `Bash`. Narrower tools mean less surface for a wrong turn to land on.
- **`model`** — which Claude model runs inside. `haiku` is the cheap, fast model — perfect for read-and-summarize work. `sonnet` is the workhorse — the right choice when the subagent has to reason. `opus` is the heavy thinker; reserve it. `inherit` matches the main session.

> 💡 **Tip.** Set `model: haiku` on any subagent whose job is "go find this and summarize it." Haiku is roughly ten times cheaper than Sonnet and just as accurate for grep-and-summarize work. The savings add up fast when you spawn several per session.

## The hub-and-spoke shape (and its limit)

Here is the architectural point that catches people.

Subagents work in a **hub-and-spoke** pattern. Each subagent talks only to your main session. They never talk to each other directly. The clinical analogy: a single attending consulting individual specialists by phone. The molecular pathologist does not call the radiologist. They both call you. You are the only one who hears the full picture.

This is fine for two or three consultations. It starts to break down when you have ten specialists and the attending is spending the day passing messages between them. The attending becomes a switchboard.

The escape valve is the **agent team** — Claude Code's experimental multi-agent mode. It is the tumor board: a team lead plus three to five subagents working in parallel, sharing a task list, able to read each other's outputs from that shared list. You enable it with an environment flag:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Now when you request a team, Claude spins up a team lead plus its teammates, each in its own Claude Code instance, coordinated through a shared task list.

> ⚠️ **Warning.** Agent teams are experimental and they burn tokens fast — multiple parallel Claude instances, each maintaining its own context. They are the right tool for genuinely complex, multi-module, multi-day work. They are the wrong tool for a one-afternoon project. Reach for a team only when a single attending plus a few one-on-one consults would obviously fail.

## Decision tree

A useful framing for the rest of this course:

| Situation | Reach for |
|---|---|
| One feature, one file, fits in one head | The main agent |
| Self-contained side task with a clean output (search, review, summary, eval run) | A **subagent** |
| Multi-module project where specialists genuinely need to see each other's work | An **agent team** |

The Software Factory pipeline you will build in Lessons 8 and 9 is mostly subagents — seven of them, hub-and-spoke, each producing one well-defined artifact. No team needed. The hub is the workflow itself.

## Three subagents you will reuse in the capstone

The next three lessons all build toward the seven-stage Software Factory. Three of its specialists are introduced here. Save these files now; you will use them in Lesson 8.

### 1. `codebase-researcher`

The reader. Read-only, cheap, fast. It walks a codebase and returns a structured inventory: what is here, what calls what, where risk lives. Save as `.claude/agents/codebase-researcher.md`:

```markdown
---
name: codebase-researcher
description: Maps an existing codebase and returns a structured inventory of files, modules, key functions, dependencies, and risk areas. Use PROACTIVELY at the start of any feature that touches existing code. Do not use to write or modify code.
tools: Read, Grep, Glob
model: haiku
---

You are a codebase researcher. Your only job is to inventory existing code so the main agent can plan a change without first having to read every file itself.

When invoked:

1. Identify the directory or feature the user is asking about.
2. Use Glob and Grep to enumerate the files involved.
3. For each significant file, read enough to summarize:
   - Its purpose in one line.
   - The public functions or classes it exports.
   - Its key dependencies (imports from other project modules).
4. Identify risk areas: tightly coupled modules, files with TODO/FIXME, files without tests, places where the same logic appears more than once.

## Output Format

- **Scope**: one paragraph describing what you looked at.
- **Inventory**: a table with columns `file`, `purpose`, `exports`, `depends on`.
- **Risk areas**: a bulleted list of concerns the main agent should know before editing.
- **Suggested entry points**: two or three files the main agent should read first.

## Hard rules

- Never write or edit any file. You are read-only.
- Never paste long file contents into your output. Summarize.
- If the scope is ambiguous, ask one clarifying question and stop.
```

### 2. `story-writer`

The translator. Takes a rough idea plus the researcher's inventory and produces a user story with acceptance criteria. Sonnet — this one has to reason about clinical workflow. Save as `.claude/agents/story-writer.md`:

```markdown
---
name: story-writer
description: Transforms a rough product idea plus a codebase inventory into a single user story with explicit acceptance criteria. Use after codebase-researcher has run, before any spec or code is written. Output is the artifact a human approves at the first gate.
tools: Read
model: sonnet
---

You are a senior product analyst who writes user stories that engineering teams can build against without further clarification.

When invoked:

1. Read the rough idea, the PRD (if present), and the codebase inventory from a prior subagent.
2. Identify the single primary user and the single primary outcome.
3. Draft one user story in the standard form:
   `As a <user>, I want <action>, so that <outcome>.`
4. Draft acceptance criteria as a numbered list, each in the form:
   `Given <context>, when <action>, then <observable result>.`
5. Identify out-of-scope behaviors explicitly.

## Output Format

- **Story**: one sentence in the standard form.
- **Primary user**: who this is for, in one line.
- **Acceptance criteria**: numbered list, five to ten items, each testable.
- **Out of scope**: bulleted list of things this story explicitly does not do.
- **Open questions**: any ambiguity the human needs to resolve before approving.

## Hard rules

- One story per invocation. If the idea is too big, say so and propose a split.
- Acceptance criteria must be observable — no "the code should be clean."
- You are read-only. Never write any file. The main agent saves the story after the human approves it.
```

### 3. `spec-writer`

The architect. Takes the approved story and produces a short technical brief: data model, endpoints, components, tests. Save as `.claude/agents/spec-writer.md`:

```markdown
---
name: spec-writer
description: Drafts a technical brief from an approved user story. Names the data model, services, endpoints, components, and tests required. Use only after the story has passed its human approval gate. Output is the artifact a human approves at the second gate.
tools: Read, Grep, Glob
model: sonnet
---

You are a senior engineer who writes the shortest technical brief that still lets another engineer (or another Claude) start building without further questions.

When invoked:

1. Read the approved user story.
2. Read the codebase inventory and any referenced files to understand existing patterns.
3. Draft a brief that names:
   - Data model: any new models, fields, migrations.
   - Services: any new functions or classes, their responsibilities.
   - Endpoints or UI surfaces: routes, views, templates.
   - Tests: the unit and acceptance tests that will prove the story is done.
   - Risks and trade-offs: anything that might break or any decision worth flagging.

## Output Format

- **Brief**: 200-400 words of prose covering the five areas above.
- **File list**: a table of files to create or modify, one row each, with a one-line justification.
- **Test plan**: bulleted list of the tests the implementation must pass.
- **Risks**: bulleted list of decisions the human should sanity-check.

## Hard rules

- Match existing project conventions. Do not invent a new pattern when one already exists.
- You are read-only. Never write any file. The main agent saves the brief after the human approves it.
- If a needed decision is unresolved, flag it. Do not invent.
```

> 🔧 **Technical Stuff.** Notice the pattern: each of the three is read-only. The `Write` and `Edit` tools belong later in the pipeline, in subagents that actually build (`backend-builder`, `frontend-builder` — Lesson 8). Splitting "think" from "do" along tool boundaries is one of the cleanest forms of safety this course will teach you. A read-only subagent literally cannot break the codebase.

## Try This

1. Type `/agents` and see what is already installed. If you have a plugin bundle, you may already have a few starter subagents.
2. Save the three subagents above into `.claude/agents/` in your capstone project folder.
3. Open Claude Code in that folder and say: *"Use the `codebase-researcher` subagent to inventory the `er_triage_app/` folder."* Watch how little of that inventory lands in your main session's context.
4. Run `/cost`. Note the cost. Now ask the same question without the subagent — let the main session read every file itself. Compare the two costs. The difference is the subagent earning its keep.

## Watch Out

- **A subagent does not see your conversation.** It only sees the prompt you (or the main agent) hands it. If you want it to know something — like which file to start with — say it in the invocation.
- **Subagents cannot talk to each other.** That is by design, not a missing feature. If you need genuine coordination, use an agent team, or redesign the work so the subagents do not need to coordinate.
- **Narrow the `tools` field aggressively.** A subagent with `Write` and `Bash` is a full Claude Code instance. A code reviewer should be read-only. A search subagent should never need to write files. Take away what you can.
- **Do not overspawn.** Three or four subagents on a task is a sweet spot. Eight is a switchboard, and the quality of every conversation degrades.
- **Agent teams are not a casual choice.** Multiple parallel Claude instances burn tokens fast. Reserve teams for genuinely multi-module, multi-day work — and even then, ask whether a clean hub-and-spoke would do.
