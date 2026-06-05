# Chapter 22: Ten Things to Put in Your CLAUDE.md Today

Your `CLAUDE.md` is the single highest-payoff file in any project. These are the ten lines that earn their keep at a cancer center.

Apply the litmus test to every one of them: "Would Claude make a mistake without this?" If your project doesn't need it, skip it. But for clinical AI work at KHCC, the answer is yes more often than not.

## 1. Your stack, in one sentence

```markdown
Stack: PySpark on Databricks (Unity Catalog `aidi_catalog`), PydanticAI for
structured extraction, Azure OpenAI `gpt-4.1-mini`, R + tidymodels for analysis,
Django + Postgres for dashboards.
```

Without this, Claude guesses. With this, every code suggestion lands in the right place on the first try.

## 2. The test command

```markdown
Tests: `pytest tests/ -q`. Eval suite: `python aidi/eval/run_deceased_cohort.py`.
Never claim "done" without one of these passing.
```

Tests are how Claude works autonomously. If it doesn't know how to run them, it can't close the loop on its own work.

## 3. The PHI rule

```markdown
PHI: Never log MRNs or names in plaintext. MRNs are Optimus-encoded,
names are Fernet-encrypted. Outputs to email/dashboards use encoded MRNs only.
Eval cohorts use the frozen deceased-patient set; never include living patients.
```

Non-negotiable. This line alone justifies every minute you spend on `CLAUDE.md`.

> ⚠️ **Warning.** Pair this rule with a `PreToolUse` hook that blocks any `Bash` command containing patterns that look like raw MRNs. Belt and suspenders.

## 4. The simplicity rule

```markdown
Simplicity: minimum code that solves the problem. No CLI flags, config files, or
parameterization "in case." If a senior engineer would say it's overcomplicated,
simplify.
```

Claude defaults to over-engineering. The Anthropic Data Science team uses the explicit prompt "Why are you doing this? Try something simpler" as their override. Codify it in your `CLAUDE.md` and you won't have to say it twice a day.

## 5. The surgical-changes rule

```markdown
Surgical changes: touch only what's needed. Don't refactor adjacent code,
comments, or formatting. Don't rename existing columns in extraction tables;
downstream R/dashboard code depends on them. Add new columns; don't reorder.
```

This is the line that prevents Claude from "improving" the code review you didn't ask it to improve.

## 6. The fail-loud rule

```markdown
Fail loud. "Pipeline completed" is wrong if any rows were skipped silently.
"Eval passed" is wrong if any cases were skipped. Always surface skipped rows,
null fields, parse failures, partial successes.
```

Silent failures kill clinical pipelines. A patient missing from the AKI alert run because of a join error is worse than the pipeline crashing. Make this rule explicit.

## 7. The eval gate

```markdown
Verification gate: no prompt or extraction logic change ships without an eval
run against the frozen deceased-patient cohort. The eval is the test.
```

Without this, prompt regressions ship silently. With this, every change has a binary gate.

## 8. Tool-calling quirks

```markdown
Tool calls: run `pytest`, not `python -m pytest`. Don't `cd` unnecessarily;
use the full path. Prefer `gh` CLI over the GitHub MCP server (more
context-efficient). Don't skip pre-commit hooks.
```

These look petty in isolation. They are the difference between a smooth session and a chaotic one. The Anthropic RL Engineering team has the exact tic about `pytest` written in their `CLAUDE.md`. Yours probably needs its own.

## 9. The token-budget rule

```markdown
Token budget per task: 4,000. Per session: 30,000. If approaching, summarize
and start fresh; don't push through. Log token usage per call in extraction
loops; fail loud when an outlier note blows the budget.
```

Karpathy's Rule 6, slightly KHCC-flavored. Without a budget, a single 50-page discharge summary quietly eats your daily quota.

## 10. Read-before-write

```markdown
Before adding to a file: read the file's exports, the immediate caller, and
shared utilities. Before adding a column to an extraction table, check what
currently consumes it. "Looks orthogonal to me" is the most dangerous phrase
in this codebase.
```

The line that prevents 90% of regressions in mature pipelines.

---

## The starter CLAUDE.md, in full

Copy this into any new KHCC project and tune from there:

```markdown
# CLAUDE.md

## Stack
PySpark + Databricks (`aidi_catalog`), PydanticAI for extraction,
Azure OpenAI `gpt-4.1-mini`, R + tidymodels for analysis,
Django + Postgres for apps.

## Run / test
- Tests: `pytest tests/ -q`
- Eval: `python aidi/eval/run_deceased_cohort.py`
- Lint: `pre-commit run --all-files`

## Behavior rules
1. Think before coding: verify schemas/codes against actual tables; don't guess.
2. Simplicity first: minimum code that solves the problem.
3. Surgical changes: don't touch adjacent code.
4. Goal-driven: define success criteria, loop until verified.
5. LLM only for judgment: KDIGO staging is rules, compute it.
6. Token budgets: 4k/task, 30k/session.
7. Surface conflicts: don't blend contradictory patterns.
8. Read before write.
9. Tests encode intent: eval cases test clinical meaning.
10. Checkpoint after every significant step.
11. Match codebase conventions even if you disagree.
12. Fail loud: surface every skipped row, null, partial success.

## PHI rules
- MRNs: Optimus-encoded only in any output.
- Names: Fernet-encrypted at rest, never in logs.
- Eval cohort: frozen deceased-patient set only.

## Tool quirks
- `pytest`, not `python -m pytest`
- `gh` CLI > GitHub MCP
- Don't skip pre-commit hooks
```

That's it. Sixty lines. Under the 150-line compliance budget. Every line earns its place.

## Try This

Open whatever project you're working on right now. Copy the starter `CLAUDE.md` above into it. Then spend 15 minutes adapting each line to your actual situation. Delete what doesn't apply. Add three project-specific quirks you've already noticed Claude getting wrong.

## Watch Out

`CLAUDE.md` is a living file. The Anthropic Data Infra team ends every session by asking Claude to summarize the session and suggest improvements to `CLAUDE.md`. That feedback loop is what turns a starter file into a *good* file over six months. Do it.
