# Chapter 13: Subagents and Agent Teams

The cleanest way to keep your main conversation sharp is to stop doing all the work in it. Hand the noisy stuff off to a specialist with its own context window.

A subagent is a fresh instance of Claude, spawned by your main session, with its own system prompt, its own tools, and most importantly its own context. It does a task, summarizes the result, and returns. Your main session never sees the 40,000 tokens of files the subagent had to read, only the answer.

That's the whole reason subagents exist. Not parallelism. Not specialization. **Context hygiene.**

## Why Subagents

Three real reasons to reach for one.

**1. Context preservation.** You're 90 minutes into building a feature. Your main session has the design in its head. Now you need to figure out how the payment flow currently works: that's twenty files to read. If you do that in your main session, those twenty files crowd out the design context, and Claude starts forgetting why you were building this in the first place. If you delegate to a subagent (*"use a subagent to figure out the payment flow"*) the subagent reads the twenty files, summarizes, and your main session sees only the summary.

**2. Focused expertise.** A clean context with a tight system prompt produces better answers than a 50-message session with the same model. A subagent with the system prompt "you are a senior code reviewer focused on security and performance" will outperform asking your main agent to switch hats mid-conversation.

**3. Parallelism.** You can fire off multiple subagents at once on unrelated tasks. A docs writer, a test generator, and a complexity analyzer can all run while you continue talking to the main agent.

> 🧠 **Remember.** The first rule of subagents is context hygiene. If you ever find yourself thinking "this task is going to balloon my context but I only need the answer," that's a subagent.

## The File Format

A subagent lives at `.claude/agents/<name>.md`. The structure mirrors a skill but with extra fields:

```markdown
---
name: code-reviewer
description: Expert code review specialist. Use PROACTIVELY after writing or modifying code to ensure quality, security, and maintainability.
tools: Read, Grep, Glob, Bash
model: inherit
---

# Code Reviewer Agent

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run `git diff` to see recent changes.
2. Focus on modified files.
3. Begin review immediately.

## Review Priorities (in order)

1. Security issues: authentication, authorization, data exposure.
2. Performance problems: O(n²) operations, memory leaks, inefficient queries.
3. Code quality: readability, naming, documentation.
4. Test coverage: missing tests, edge cases.
5. Design: SOLID principles, architecture.

## Output Format

For each issue:
- Severity (Critical / High / Medium / Low)
- Category
- Location (file:line)
- Issue description
- Suggested fix with code example
```

Three fields are worth understanding:

- **`description`**: the trigger. Same rules as a skill — precise descriptions trigger when they should. Including the word "PROACTIVELY" is a convention that nudges the main agent to invoke the subagent without being asked.
- **`tools`**: which tools the subagent can use. Often narrower than the main agent. A code reviewer shouldn't need `Write` or `Edit`. Take them away. A research subagent shouldn't need `Bash`. Take it away.
- **`model`**: `inherit` matches the main session's model. `haiku` runs the subagent on the cheap, fast model, perfect for grep-and-summarize tasks. `opus` only if the subagent has to reason deeply.

> 💡 **Tip.** Always set `model: haiku` for subagents whose job is read-and-summarize. Haiku is ~10x cheaper than Sonnet, and for "go find me the file that defines X" it's just as accurate.

## The Hub-and-Spoke Limitation

Subagents are isolated. That's their feature, but it's also a constraint. They can only talk to the main agent. They can't talk to each other.

If you spawn a researcher, a writer, and a reviewer as three subagents:

- The researcher can't show its findings to the writer directly. The main agent has to pass them.
- The reviewer can't see the researcher's notes. The main agent has to summarize them first.
- Everything bottlenecks through the central session.

For three subagents this is fine. For ten, the main agent becomes a switchboard operator and quality degrades.

> 🔧 **Technical Stuff.** This isn't a bug. It's a deliberate safety property: subagents can't coordinate behind your back, can't conspire, can't accidentally form a feedback loop. The main agent is the only interface, which means you're the only auditor that matters.

## Agent Teams: When the Hub Becomes a Bottleneck

For complex builds (a full app with backend, frontend, and tests, or a multi-module refactor) the hub-and-spoke pattern breaks down. Agent teams are the answer.

Enable them with the environment flag:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Now when you ask for an agent team, Claude spins up a *team lead* plus 3–5 teammates. Each teammate runs in its own Claude Code instance. They share a task list. They can read each other's outputs from that shared list. The team lead orchestrates.

It's a different category of work. You're not delegating one task; you're delegating an entire project module.

A simple decision tree:

- **One feature, one file, one head?** → Single agent.
- **Need a clean context window or a focused specialist?** → Subagent.
- **Multi-module project where teammates need to see each other's work?** → Agent team.

> ⚠️ **Warning.** Agent teams are experimental. They burn tokens fast: multiple parallel instances, each maintaining its own context. Don't enable agent teams for a one-day project. The overhead isn't worth it unless the work genuinely spans days and modules.

## Three Subagents Worth Stealing

### A Haiku-based quick-search subagent

The classic "go find me X without polluting my context." Description: "Searches the codebase for symbols, definitions, or usage patterns. Use proactively when the user asks where something is defined or how it's used."

```markdown
---
name: quick-search
description: Searches the codebase for symbols, definitions, or usage patterns. Use proactively when the user asks where something is defined or how it's used.
tools: Read, Grep, Glob
model: haiku
---

You are a code search specialist. When invoked:

1. Identify the symbol, file, or pattern the user is looking for.
2. Use Glob and Grep aggressively to locate it.
3. Read only the files that contain matches.
4. Return:
   - A one-line summary
   - File:line locations of every relevant match
   - A 5-line context snippet for the most important match

Be concise. Do not paste large file contents. The main agent does not need them.
```

Haiku is fast and cheap. Search is mostly reading. Perfect match.

### A strict-TypeScript reviewer

Description: "Reviews TypeScript code for type-safety violations, anti-patterns, and missing strictness. Use proactively after any TypeScript edit."

```markdown
---
name: strict-ts-reviewer
description: Reviews TypeScript code for type-safety violations, anti-patterns, and missing strictness. Use proactively after any TypeScript edit.
tools: Read, Grep, Bash
model: inherit
---

You are a TypeScript strict-mode enforcer.

When invoked:
1. Run `git diff` to see what changed.
2. For every changed `.ts` or `.tsx` file, check for:
   - `any` types: flag every one.
   - `as` casts: flag any that lose precision.
   - Non-null assertions (`!`): flag and demand a runtime check instead.
   - Missing return types on exported functions.
   - `// @ts-ignore` or `// @ts-expect-error`: flag and demand a reason.

Report findings inline. Do not modify code; recommend fixes only.
```

### A docs writer

Description: "Writes or updates documentation (READMEs, docstrings, API docs) based on recent code changes. Use when the user asks for docs or after a feature merges."

```markdown
---
name: docs-writer
description: Writes or updates documentation (READMEs, docstrings, API docs) based on recent code changes. Use when the user asks for docs or after a feature merges.
tools: Read, Glob, Write, Edit, Bash
model: inherit
---

You are a documentation writer. Your job is to keep docs in sync with code.

When invoked:
1. Run `git diff main` to see what changed since the main branch.
2. Identify which files have user-visible API changes.
3. For each:
   - Check whether a README, docstring, or doc page references the API.
   - Update it if it's now stale.
   - Add a new doc entry if the API is new and undocumented.
4. Report what you changed and why.

Keep prose tight. Code comments explain why, not what.
```

## A KHCC Subagent: The Deceased-Patient Eval Runner

Here's one that earns its keep. The eval suite against the deceased-patient cohort is the gate for any prompt change. Running it pulls in tens of thousands of tokens of cohort metadata, prompt files, and result tables. You don't want that in your main session.

`.claude/agents/aidi-eval-runner.md`:

```markdown
---
name: aidi-eval-runner
description: Runs the KHCC deceased-patient eval suite against an AIDI pipeline and reports pass/fail with regression details. Use whenever the user asks to evaluate, validate, or check an AIDI pipeline against the eval cohort. Do not use for other test suites.
tools: Bash, Read
model: inherit
---

You are the KHCC AIDI eval runner. Your only job is to run the deceased-patient
eval suite and report results.

## Inputs
The user will specify a pipeline name (e.g. `pathology-v6`, `er-extractor`,
`aki-notification`).

## Procedure
1. Look up the Databricks job ID for the pipeline in `docs/eval-jobs.json`.
2. Trigger the eval job with `databricks jobs run-now --job-id <id>`.
3. Poll `databricks jobs get-run` until the run completes.
4. Query `aidi_catalog.dbo.eval_runs` for:
   - The latest run for this pipeline (call it `current`).
   - The previous run for this pipeline (call it `previous`).
5. Compute the delta:
   - Accuracy, precision, recall changes.
   - New failures: rows where `previous.pass = true AND current.pass = false`.
   - New wins: rows where `previous.pass = false AND current.pass = true`.

## Output (return only this; no preamble)
- **VERDICT**: `EVAL PASSED` (zero new failures) or `EVAL FAILED` (any new failure).
- **Summary**: accuracy delta, precision delta, recall delta.
- **New failures**: list each by case ID with a one-line diff.
- **New wins**: list each by case ID.

## Hard rules
- Never modify any pipeline code, prompt, or eval table.
- Never include living-patient data in any output.
- If the job fails to start or the table query returns no rows, report
  `EVAL INCONCLUSIVE` and stop.
```

Now the main session can stay focused on prompt edits. When you're ready to verify, *"use the aidi-eval-runner subagent to evaluate pathology-v6"* spins up a clean instance, runs the gate, and reports back without ever showing your main context the eval cohort itself.

> 💡 **Tip.** A subagent's system prompt is also a contract. Spell out what it must *not* do as clearly as what it must. The `aidi-eval-runner` is explicitly told never to modify code; that one line prevents a whole class of accidents.

## Where Subagents Live

- `.claude/agents/<name>.md`: project-level, checked in, shared.
- `~/.claude/agents/<name>.md`: personal, available everywhere.

Use `/agents` to list them, edit them, or spawn one explicitly.

## Try This

1. Run `/agents` and see what's already installed. (If you've installed any Anthropic skill bundles, you may have a few.)
2. Write a `quick-search` subagent like the one above. Set `model: haiku`. Use it next time you need to find where a function is defined. Watch how little context lands in your main session.
3. Pick a task that's currently expensive in context: "look at all the files in `src/auth/` and summarize the authentication flow." Once with the main agent, once via a subagent. Compare `/cost` and the context bar.

## Watch Out

- **A subagent doesn't see your conversation.** It only sees the prompt you (or the main agent) hand it. If you want it to know something, include it in the invocation.
- **Subagents don't share state.** They can't talk to each other. If you need coordination, you need an agent team, or you need to redesign so they don't.
- **Too many subagents is worse than none.** Spawning five subagents to coordinate a small task is overhead. Use them when context hygiene actually matters.
- **A subagent with `Write` and `Bash` is a full Claude Code session.** Restrict tools aggressively. A code reviewer should be read-only. A search subagent should never need to write files.
- **Don't run agent teams casually.** They burn tokens in parallel. Save them for genuinely complex, multi-module work.
