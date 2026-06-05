---
layout: page
title: "Lesson 2: Memory with CLAUDE.md"
permalink: /session_10/instructions/lesson2_claude_md/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 2 — Memory: CLAUDE.md

A PRD tells you what to build. It does not tell Claude how to behave while building it. Every time you start a new Claude Code session, the agent comes in fresh — no memory of yesterday's session, no idea which test command you use, no awareness of your project's conventions. Without something to fix that, you spend the first ten minutes of every session re-explaining the same rules. That something is a file called **CLAUDE.md**.

## CCI master `CLAUDE.md` (start here)

This course ships a **top-level `CLAUDE.md`** you can copy into `~/.claude/CLAUDE.md` (personal, all projects) or `./CLAUDE.md` (one repo). It builds on [Andrej Karpathy's CLAUDE.md guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) and adds CCI rules for mistakes, tests, git, secrets, dependencies, Context7 MCP, and LangChain/LangGraph.

<p style="margin:1rem 0;">
  <a href="/CCI.io/session_10/templates/CLAUDE.md.txt" download="CLAUDE.md" style="display:inline-flex;align-items:center;gap:.4rem;font-weight:600;color:#00838F;text-decoration:none;padding:.5rem .85rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;">
    &#128229; Download CCI master CLAUDE.md
  </a>
  &nbsp;
  <a href="https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md" target="_blank" rel="noopener noreferrer" style="font-size:0.88rem;color:#00838F;">
    Karpathy original on GitHub &#8594;
  </a>
</p>

**Install it:** download the file, rename if needed to `CLAUDE.md`, and place it in your home `~/.claude/` folder or your project root. Then add project-specific stack and test commands at the bottom (the template has a placeholder section for that).

## What CLAUDE.md is

**CLAUDE.md** is a Markdown file at the root of your project that Claude Code reads automatically at the start of every session, before you say a word. It is the agent's persistent **project instruction manual** — stack, run commands, behavior rules, PHI handling, the three tool quirks you keep tripping on.

The medical analogy is the **order-set template** every new resident on the service learns on day one. The resident does not invent vancomycin dosing from scratch each shift; they follow the order set. CLAUDE.md is the same idea, written once, applied automatically forever after.

> 🧠 **Remember.** CLAUDE.md is read every session, before your first message. Anything in it is implicitly part of every prompt you write. That is why it is the highest-leverage file in any Claude Code project — and why it must stay short enough that the agent actually pays attention to all of it.

## Three levels

CLAUDE.md is hierarchical. Claude reads three locations and merges them, most-specific wins:

- **Personal level** — `~/.claude/CLAUDE.md` (in your home directory). Rules that follow *you* across every project on your laptop. Good for things like "always respond in concise prose, no preamble" or "I am a clinician at KHCC, the user email is isultan@khcc.jo."
- **Project level** — `./CLAUDE.md` (in the project's root folder). Rules for *this codebase*. Stack, test command, PHI policy, the eval gate. This is the one most lessons in this session edit.
- **Directory level** — a `CLAUDE.md` placed in any subfolder. Rules that apply only when Claude is working inside that subfolder. Useful when the same repo has a backend and a frontend with different conventions, or a `notebooks/` folder where the rules are looser than the production code.

In your home directory you already have one — your global instructions about KHCC AIDI work that opens every conversation. That is the personal level doing its job.

> 🔧 **Technical Stuff.** Claude Code also supports a slash command `/init` that scans an existing repo and proposes a starter CLAUDE.md based on what it finds — your stack, your test runner, your obvious conventions. Run it once in a new project, then prune what it suggests using the litmus test below.

## The litmus test

Every line you add to CLAUDE.md must pass one question:

> *Would Claude make a real mistake without this line?*

If the answer is no — if it is a vague preference, a style suggestion, a polite request — delete it. Claude already has good defaults for the polite stuff. The file should only contain the rules whose absence causes a concrete, repeated failure.

Why so strict? Because CLAUDE.md is part of Claude's context window on every turn. A 600-line CLAUDE.md crowds out the actual code Claude is supposed to be reading. The working compliance budget is roughly **150–200 lines**. Past that, Claude starts skimming, and the rules silently stop applying. Anthropic's own internal teams keep theirs under 100.

> ⚠️ **Warning.** A bloated CLAUDE.md is worse than no CLAUDE.md. With no file, you re-explain rules in chat where Claude pays attention. With a 500-line file, Claude pretends to know the rules and then quietly ignores half of them. Prune ruthlessly.

## @imports — keep the root file lean

When CLAUDE.md genuinely needs to grow, do not stuff everything into the root file. Use **`@imports`** — a line like:

```
@.claude/rules/sql-conventions.md
```

…tells Claude to load that file's contents inline. The root CLAUDE.md becomes a short table of contents pointing to topic-specific rule files. This way the agent loads only what is relevant, and the human reader of the project root is not overwhelmed.

## Conditional rules

A step further: you can put rule files in `.claude/rules/` with a tiny **frontmatter** block at the top specifying which file paths they apply to. A rule file with frontmatter `globs: ["**/*.ts"]` only activates when Claude is working on TypeScript files. The R conventions file only activates on `.R` and `.Rmd` files. This is how a single repo can hold backend Python rules, frontend TypeScript rules, and analysis R rules without any of them polluting the others.

> 💡 **Tip.** Start without conditional rules. Add them only when you can name a specific case where a rule in the root CLAUDE.md was confusing Claude on the wrong file type.

## Auto-update — the most underused habit

The single highest-payoff CLAUDE.md habit is this: every time Claude makes a mistake you have to correct, end the correction with:

> *Update CLAUDE.md so this doesn't happen again.*

Claude proposes a one-line addition. You approve or edit. The file grows by one line that day. Over a month, your CLAUDE.md becomes a precise reflection of the actual mistakes Claude has made in your specific codebase — which is far more valuable than any generic template. Anthropic's data infrastructure team does this at the end of every working session.

## Worked example: turning a PRD into a CLAUDE.md

Take the PubMed Chrome-extension PRD from Lesson 1. Most of the PRD is about *what to build*. CLAUDE.md is about *how to behave while building it*. Distil only the non-negotiables:

```markdown
# CLAUDE.md

## Stack
TypeScript + React, Manifest V3 Chrome extension. Vite build.
LLM call via user's own OpenAI API key, stored in chrome.storage.local.

## Run / test
- Build: `npm run build`
- Tests: `npm test -- --run`
- Lint: `npm run lint`
Never claim "done" without `npm test` passing.

## Behavior rules
1. No telemetry. Ever. No analytics packages.
2. The user's API key is read from chrome.storage.local — never log it,
   never bundle it, never include it in error messages sent anywhere.
3. Summaries are PICO-structured. If the input is not a clinical paper,
   say so and refuse — do not produce a non-PICO summary.
4. Surgical changes only. Don't touch the manifest unless asked.
```

Sixteen lines. Every line passes the litmus test — without it, Claude would default to adding analytics, would log the API key in stack traces, would happily summarize a recipe blog as a clinical paper, would "improve" the manifest. With it, none of those happens.

Run the same session twice — once with no CLAUDE.md, once with this one — and you will see Claude reach for an analytics package the first time and skip past it the second. That is the entire value proposition of the file.

## A KHCC starter CLAUDE.md — annotated

For real AIDI work the file is longer. Here is the starter Dr. Sultan recommends, with each block explained:

```markdown
# CLAUDE.md

## Stack
PySpark + Databricks (`aidi_catalog`), PydanticAI for extraction,
Azure OpenAI `gpt-4.1-mini`, R + tidymodels for analysis,
Django + Postgres for apps.
```

*Why:* without this Claude guesses your tools every time. With it, code suggestions land in the right place on the first try.

```markdown
## Run / test
- Tests: `pytest tests/ -q`
- Eval: `python aidi/eval/run_deceased_cohort.py`
- Lint: `pre-commit run --all-files`
Never claim "done" without one of these passing.
```

*Why:* tests are how Claude verifies its own work without you watching. If it does not know how to run them, it cannot close the loop. The eval suite is the binary gate for any prompt change — see the AKI and Pathology pipelines in `ch00b_what_aidi_builds.md`.

```markdown
## PHI rules
- MRNs: Optimus-encoded only in any output. Never plaintext.
- Names: Fernet-encrypted at rest, never in logs.
- Eval cohort: frozen deceased-patient set only. Never living patients.
```

*Why:* this is the single most important block. Hospital data-protection rules and most countries' laws forbid plaintext PHI from leaving controlled systems. **Optimus** scrambles MRNs into reversible identifiers like `A8X4-92`; **Fernet** symmetrically encrypts names at rest. The deceased-patient cohort exists precisely so eval data can be shared internally without privacy exposure.

```markdown
## Behavior rules
1. Think before coding: verify schemas against actual tables; don't guess.
2. Simplicity first: minimum code that solves the problem.
3. Surgical changes: don't refactor adjacent code or rename existing columns.
4. LLM only for judgment: KDIGO staging is rules — compute it, don't ask the model.
5. Fail loud: surface every skipped row, null, partial success.
6. Token budget: 4k per task. Summarize and start fresh if approaching.
```

*Why:* these are the rules in your global `~/.claude/CLAUDE.md` re-stated at the project level so they are unambiguous in this codebase. Rule 4 in particular saves real money — without it, Claude will happily ask GPT-4.1-mini to "decide" the KDIGO stage from creatinine values, which is both wasteful and wrong (KDIGO is arithmetic, not language).

```markdown
## Tool quirks
- Use `pytest`, not `python -m pytest`
- Prefer `gh` CLI over the GitHub MCP server (more context-efficient)
- Don't skip pre-commit hooks
- JDBC: PySpark JDBC queries cannot use CTEs or `ORDER BY`
```

*Why:* every project develops three or four of these. Write them down here. The JDBC quirk in particular has burned every new engineer at the AI Office.

Sixty lines total. Well under the budget. Every line earns its place.

## CLAUDE.md vs hooks — they are different

Quick disambiguation that will save confusion later. **CLAUDE.md is a *prompt*** — it shapes the model's behavior by telling it what to do. **Hooks** (Lesson 7) are *deterministic code* that runs before or after specific tool calls and can block actions outright. CLAUDE.md says "never log MRNs in plaintext"; the hook actually scans every `Bash` command for a string that looks like an MRN and refuses to run it. Use CLAUDE.md for *judgment* rules and hooks for *enforcement*. Belt and suspenders.

## Try This

Open whichever project you are currently working on. If there is no CLAUDE.md, run `/init` in Claude Code and let it propose one. If there already is one, count the lines. If you are past 200, spend ten minutes deleting the ones that fail the litmus test. Then add this single line at the bottom:

```
PHI: MRNs Optimus-encoded in any output. Names Fernet-encrypted at rest.
Never include either in logs or commit messages.
```

That one line alone justifies the file.

## Watch Out

- **Vague rules are noise.** "Write good code" earns its place in no CLAUDE.md. "Use `pytest`, not `python -m pytest`" does.
- **Do not put secrets in CLAUDE.md.** It is committed to git. Anything sensitive belongs in `.env` (Session 9, Lesson 2).
- **The file is alive, not frozen.** End every working session by asking Claude to suggest one improvement to the file. Accept or reject. Over six months that loop is the difference between a starter file and a *good* one.

Next lesson: skills. You already used one (PRD-Builder). Now we look at how to write your own.
