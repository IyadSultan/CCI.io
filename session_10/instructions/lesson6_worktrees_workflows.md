---
layout: page
title: "Lesson 6: Worktrees and Workflows"
permalink: /session_10/instructions/lesson6_worktrees_workflows/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 6 — Worktrees and Workflows

This lesson covers two distinct ideas that often appear side by side and get confused. Flagging it up front:

- **Worktrees** are about **isolation** — running several Claudes on the same repo without them stepping on each other.
- **Workflows** are about **orchestration** — chaining several agents (often with human approval gates) into a scripted pipeline from idea to shipped code.

They are commonly used together — a workflow often runs inside a worktree — but they solve different problems. Keep them straight and the rest of the course gets easier.

## First, a quick word on branches

Worktrees hold branches, so we have to name what a branch is.

A **branch** in git is a parallel version of the codebase. You can experiment in one branch — change files, add code, break things — while another branch (usually `main`) sits untouched and safe. When the experiment works, you merge it back into `main`. When it does not, you throw the branch away and `main` is unaffected.

The clinical analogy: a branch is like working on a draft of a chemotherapy protocol in a side document while the live protocol stays in effect. Your changes do not affect any patient until you formally merge them in.

Normally, your repo shows you one branch at a time. To switch from branch A to branch B you run `git checkout B`, and the contents of your folder change to match branch B. Branch A is still there in git's memory, but you cannot see it on disk anymore.

That is fine when you do one thing at a time. It is painful when you are juggling three.

## Worktrees: isolation

A **git worktree** is a feature git has had since 2015 that almost no one uses. It lets one repository have *multiple working folders on disk at once*, each checked out to a different branch, all sharing the same history.

In plain terms: instead of `git checkout feature-X` (which destroys your current folder's state on `main`), you ask git to create a second folder next door, with the same repo, on a different branch. Two folders. Two branches. One history. Zero conflicts.

> 🧠 **Remember.** A worktree is not the same as a *clone*. Cloning duplicates the entire history, takes minutes for a big repo, and loses your local configuration. A worktree is instantaneous, shares the same history, and is designed to be thrown away when the task is done.

Claude Code, by default, operates inside whatever folder you launched it from. One terminal, one Claude, one branch. If you open a second terminal and run `claude` in the same folder, you now have **two Claudes editing the same files at the same time** — a recipe for one of them silently overwriting the other's work. Worktrees fix this cleanly: one worktree per task means one Claude per task with no interference.

### The `--worktree` flag

Claude Code wraps the whole flow in one flag:

```bash
claude --worktree feature-pathology-prompt
```

or the short form:

```bash
claude -w feature-pathology-prompt
```

That single command does three things:

1. Creates a new git worktree in a sibling folder next to your current one.
2. Checks out (or creates) the branch named `feature-pathology-prompt`.
3. Launches Claude with that worktree as its working directory.

When you exit that Claude session, if the worktree has **no uncommitted changes and no new commits**, Claude Code cleans it up automatically — the folder is removed, the empty branch is deleted. If you made changes, the worktree stays around until you deal with it manually.

> 💡 **Tip.** Useful supporting commands: `git worktree list` shows every worktree currently attached to the repo. `git worktree remove <path>` cleans one up. `git worktree prune` removes references to worktrees whose folders you deleted by hand. These are the three commands you actually need.

### Three terminals, three Claudes — the KHCC Tuesday afternoon

Picture Tuesday at the AI Office. You have three things on your plate:

```bash
# Terminal 1
claude -w feature-pathology-prompt

# Terminal 2
claude -w bugfix-aki-cohort-sql

# Terminal 3
claude -w refactor-chemo-dashboard
```

Three Claudes, three branches, three working folders. They cannot step on each other because they are literally in different directories. Claude 1 is updating the Pathology Extraction prompt to handle a new tumor subtype. Claude 2 is fixing a join bug in the AKI cohort SQL. Claude 3 is refactoring the Chemotherapy Preparation dashboard so the patient card is a reusable component.

You start them in that order, then rotate your attention. While Claude 1 reads the prompt files, you supervise Claude 2's first SQL draft. While Claude 2 runs a sample query, you peek at Claude 3's refactor plan. By the end of the afternoon, all three branches have draft pull requests. None of them touched the others' files. None of them got confused about which branch they were on.

This is what people mean when they say Claude Code multiplies throughput. Not that one Claude writes faster than you. What multiplies throughput is **three Claudes running in parallel while you supervise one at a time**.

> 🔧 **Technical Stuff.** Each worktree has its own untracked-file state and can have its own `.claude/` configuration if you want one per worktree. Hooks, slash commands, and skills installed at the user scope are shared across all worktrees. The project-scope `CLAUDE.md` is shared because it lives in the tracked code — which is usually what you want.

### When to use a worktree (and when not to)

**Use a worktree when:**

- You have two or more genuinely independent tasks and want them in parallel.
- You are starting an experiment you might throw away.
- You are mid-refactor on one branch and an urgent fix needs to land on another.
- You are running an overnight Ralph loop on one task (Lesson 7) and want to keep working on something else in the morning.

**Skip the worktree when:**

- The task is a one-line fix. The setup cost is not worth it; `git stash` is faster.
- You are exploring a single repo with no plan to branch.
- You are still learning git basics. Get fluent with branches first; worktrees click the moment branching does.

> ⚠️ **Warning.** A worktree is a real folder on disk holding real, possibly uncommitted, changes. If you delete a worktree folder by hand (`rm -rf`) while it has uncommitted work, that work is gone forever — there is no undo. Always use `git worktree remove`, which refuses to delete worktrees with uncommitted changes.

## Workflows: orchestration

Now switch gears. A worktree is *where* a Claude runs. A workflow is *what sequence of agents* run, *in what order*, *with which approval gates*.

A **workflow** is a scripted chain of agents that turns an idea into a shipped artifact. Some stages are subagents (Lesson 5). Some stages are human approval gates. The chain is defined once and reused on every new feature.

The clinical analogy is a **clinical pathway**: the well-defined sequence a patient with a particular diagnosis moves through, with explicit checkpoints. A newly diagnosed breast cancer patient does not float through the system. She moves through a defined pathway — initial assessment, imaging, biopsy, MDT discussion, treatment plan signed off — with named handoffs and named decision points. Each handoff has a checklist. Each decision point has a sign-off.

A software workflow has the same shape. Each stage produces an artifact. Some artifacts need a human signature before the chain advances. The workflow file enumerates the stages, the agents at each stage, and the approval rules.

### The Software Factory workflow (Lessons 8 and 9)

The capstone you will build in Lessons 8 and 9 is a workflow with seven stages and three approval gates:

| Stage | Agent | Tools | Model | Produces | Gate |
|---|---|---|---|---|---|
| 1 | codebase-researcher | Read, Grep, Glob | Haiku | File inventory + risks | — |
| 2 | story-writer | Read | Sonnet | User story + acceptance criteria | **Human** |
| 3 | spec-writer | Read, Grep, Glob | Sonnet | Technical brief | **Human** |
| 4 | backend-builder | Read, Edit, Write, Bash | Sonnet | Models, services, unit tests | — |
| 5 | frontend-builder | Read, Edit, Write, Bash | Sonnet | Templates, htmx, styles | — |
| 6 | test-verifier | Read, Edit, Write, Bash | Sonnet | Acceptance tests pass | — |
| 7 | implementation-validator | Read, Grep, Glob | Sonnet | Findings report | **Human** |

Three subagents from Lesson 5 (the researcher, the story writer, the spec writer) appear in stages 1-3. Four more are introduced in Lesson 8. Three checkpoints have a human in the loop — the same discipline as a consent, a tumor-board sign-off, and an attending's final review on a discharge summary.

An **approval gate** is exactly what it sounds like: at that point in the chain, the workflow stops and waits for a human to read the artifact, write *approve* or *reject*, and only then advance. The gate is the firewall between "Claude thinks this is done" and "this is what we are going to build."

### Workflows live as skills

A workflow in Claude Code is most cleanly expressed as a **workflow skill** — a folder with a `SKILL.md` file that names the stages, the subagents at each stage, the approval prompts, and the loop-back rules. The skeleton looks like this:

```markdown
---
name: feature-factory
description: End-to-end workflow that turns a one-line feature request into a shipped, validated feature. Use whenever the user asks to build a new feature for the ER triage app or any AIDI Django service. Do not use for one-file fixes or experiments.
---

# Feature Factory Workflow

## Stage 1 — Research
Invoke the `codebase-researcher` subagent. Pass it the target directory. Receive the inventory. Save as `.workflow/01-inventory.md`.

## Stage 2 — Story (gate)
Invoke the `story-writer` subagent with the inventory and the user's request. Save the story as `.workflow/02-story.md`. Then STOP and ask the human:
> "Approve this story? (yes / revise / reject)"
If revise, loop back to Stage 2 with the human's notes. If reject, abort. If yes, advance.

## Stage 3 — Brief (gate)
Invoke the `spec-writer` subagent with the approved story. Save the brief as `.workflow/03-brief.md`. Ask the human:
> "Approve this brief? (yes / revise / reject)"
Loop-back rules as Stage 2.

## Stage 4 — Backend
Invoke the `backend-builder` subagent with the approved brief. Save changes. Run `pytest`.
If tests fail, loop back once with the failures. After two failed attempts, escalate to the human.

## Stage 5 — Frontend
Invoke the `frontend-builder` subagent. Save changes.

## Stage 6 — Verify
Invoke the `test-verifier` subagent. Run the full acceptance suite. If any test fails, loop back to the relevant builder once.

## Stage 7 — Validate (gate)
Invoke the `implementation-validator` subagent. Save the findings as `.workflow/07-findings.md`. Ask the human:
> "Ship it? (yes / revise / reject)"

## Stop conditions
- Two failed loop-backs at any builder stage → escalate to the human and stop.
- Any approval gate returns reject → archive the workflow folder and stop.
```

That single `SKILL.md` file is the whole workflow. You invoke it by name (*"use feature-factory to build patient-search"*) and Claude follows the script — calling the right subagent at each stage, saving the artifact, pausing at each gate.

> 💡 **Tip.** Always write the artifact at every stage to a numbered file in a `.workflow/` folder. The numbered files are the audit trail. When something goes wrong at Stage 6, you go back to read `.workflow/03-brief.md` to find out what the workflow thought it was building. Without that trail, debugging a multi-stage workflow is guessing.

### Worktrees + workflows together

The two ideas compose. The right way to run the Software Factory on a new feature is:

```bash
claude -w feature-patient-search
```

— and then, inside that worktree, invoke the workflow. Now you have isolation (the worktree) **and** orchestration (the workflow). The branch holds the work. The numbered artifacts in `.workflow/` hold the rationale. The gates keep a human in the loop at the points where human judgment is needed. When the workflow finishes, the worktree holds a clean branch with a tested, validated feature, ready to merge.

> 🧠 **Remember.** Worktree = a folder on disk holding one branch. Workflow = a script that runs several agents in order. You can use either alone. The full-power configuration uses both: one worktree per feature, one workflow per worktree, one merge per finished feature.

## Try This

1. In your capstone project folder, run `git worktree add ../experiment experiment-branch`. Open the new folder. Confirm it looks like a normal checkout on a different branch.
2. In your original folder, edit a file but do not commit it. Switch into the worktree folder. Notice your uncommitted change is **not** there. Each worktree has its own working state.
3. Now run `claude -w try-worktree`. Make no changes. Exit. Confirm the worktree was auto-cleaned.
4. Create `.claude/skills/feature-factory/SKILL.md` with the skeleton above. Do not run it yet — Lessons 8 and 9 will. Just read it and notice how it reads like a clinical pathway with explicit checkpoints.

## Watch Out

- **Worktree is not workflow.** Spinning up a worktree does not run a workflow inside it. You still have to invoke the workflow.
- **Workflow is not worktree.** Running the Software Factory in your main folder will work, but parallel features will collide on `main`. Always pair the workflow with a worktree.
- **Do not share a worktree across two Claude sessions.** That defeats the whole point of isolation.
- **Auto-cleanup only happens on a clean exit.** If you force-kill Claude (Ctrl-C aggressively, or close the terminal), the worktree stays. Run `git worktree prune` periodically.
- **Approval gates are not optional.** A workflow without approval gates is just a script. The gates are what make the workflow safe to run on real clinical features. If you find yourself wanting to skip the gates "because it's faster," you are about to ship the wrong thing.
- **`CLAUDE.md` is shared across worktrees.** A change you make in one worktree's `CLAUDE.md` will appear in the others after you commit and merge. Do not put per-task instructions there; put project-wide ones.
