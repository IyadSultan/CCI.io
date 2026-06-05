# Chapter 18: Running for Hours (The Ralph Loop)

Meter, the AI evaluation lab, recently published a benchmark showing that Claude Opus 4.5 can perform autonomously on real software-engineering tasks for **4 hours and 49 minutes** at a 50% completion rate. For context: when GPT-4 launched, the equivalent number was about five minutes. We have entered an era where coding agents can run for the length of a workday, and this chapter is about how to actually use that.

## The Boris Cherny Tweet

Boris Cherny is the creator of Claude Code. In late 2025 he posted a tweet that made the rounds:

> "When I created Claude Code as a side project back in September 2024, I had no idea it would grow to what it is today... Fast forward to today, the last 30 days, I landed **259 PRs, 457 commits, and 40,000 lines added, and 38,000 lines removed**. Every single line was written by Claude Code and Opus 4.5. Claude consistently runs for minutes, hours, and days at a time using **stop hooks**. Software engineering is changing."

Read that paragraph twice. The author of Claude Code lands roughly nine PRs per day, every day, with **zero hand-written lines**. The mechanism that makes it possible is one feature: the **stop hook**.

> 🧠 **Remember.** Boris's productivity is not about a magic prompt. It is about a deterministic harness around the non-deterministic model. The model writes the code. The harness keeps the model on task.

## Why Prompting Alone Goes Lazy

If you try to extract long-running behavior with prompts alone ("do all twenty of these tasks, don't stop, run tests after each") Claude will get partway through, decide it's done, and exit. Not because it's lazy in the human sense, but because the model is trained to terminate when it thinks the user's goal is met. After task seven of twenty, the conversation looks "complete enough" and out it goes.

You cannot prompt your way out of this. You need a mechanism *outside* the LLM that fires when Claude tries to stop, checks whether the work is actually done, and if not, feeds the next instruction back in.

That mechanism is the **stop hook**.

## Stop Hooks, Briefly

Chapter 14 introduced hooks: shell commands that fire at specific points in Claude's workflow. The **Stop** event fires when Claude is about to return control to you and exit the agentic turn. A stop hook is a shell command attached to that event.

Two things a stop hook can do that no prompt can:

1. **Block the stop.** If the hook exits non-zero, Claude does not return to you. The turn continues.
2. **Feed in new context.** Whatever the hook writes to stdout becomes part of the next prompt cycle. So the hook can say "check the to-do list: items 4, 5, and 7 are still unchecked. Keep going."

That is the whole trick. Block the exit. Inject the next instruction. Repeat until done.

> 🔧 **Technical Stuff.** The hook gets the session's recent state on stdin (as JSON) and can return JSON on stdout instructing Claude what to do next. The full schema is in the Claude Code docs under `Hooks → Stop`. For most uses, a 20-line shell script is enough.

## The Ralph Loop

The pattern has a name: the **Ralph loop**, after Ralph Wiggum from The Simpsons, the kid whose entire personality is "I'll keep trying." Boris named it. Anthropic ships an official plugin called `ralph-wiggum` that bundles the stop hook, a state file, and a `/ralph-loop` slash command.

The shape:

1. You give Claude a prompt and a **completion promise**: a sentence describing what "done" means. ("All items in `todo.md` are checked off and `pytest` exits zero.")
2. You set a **max iterations** cap. (Common: 20–50.)
3. You kick it off.
4. Claude works on the task. When it tries to exit, the stop hook fires.
5. The hook checks the completion promise. Not met? Re-injects the prompt with a "keep going, here's what's left" suffix.
6. Loop until either the promise is met or max iterations is hit.

Inside that loop, Claude is doing what Claude always does: reading files, editing code, running tests. The only difference is it cannot quit until the harness lets it.

> 🧠 **Remember.** Two guardrails are non-negotiable: **max iterations** and a **completion promise.** Without max iterations, a bug becomes an infinite loop that bills your card. Without a completion promise, the hook has no way to know when to stop, and it won't.

## The To-Do File Pattern

The most reliable Ralph setup uses a markdown to-do file as the source of truth:

```markdown
# refactor_todo.md

- [ ] Move AKI staging logic from notebook A to shared module
- [ ] Update pipeline B to import from shared module
- [ ] Add unit test for AKI stage 2 boundary case
- [ ] Run eval cohort and confirm alert count matches baseline
- [ ] Update CLAUDE.md to point to the new module
```

You prompt Claude something like:

> "Work through `refactor_todo.md` step by step. For each unchecked item: do the work, run the relevant tests, and only mark `[x]` when tests pass. Then move to the next. Do not stop until every item is checked."

The stop hook re-reads `refactor_todo.md` after every turn. If it finds an unchecked box, it blocks the stop and re-injects the prompt. If everything is checked, it lets Claude exit.

This is brilliant because the state lives in a *file*, not in Claude's head. Claude can forget what it was doing, lose context, get compacted, and the next iteration just re-reads the to-do file and continues from wherever it left off.

> 💡 **Tip.** Always include a validation step in each to-do item: a test, an eval run, a row-count check. Without it, Claude can mark items complete that aren't, and you'll come back in the morning to a fully-checked list and a broken pipeline.

## Overnight Refactors and Migrations

The Ralph loop's sweet spot is work that is:

- **Long.** Hours, not minutes.
- **Listy.** Decomposable into a flat list of similar tasks.
- **Verifiable.** Each task has a deterministic pass/fail check (a test, a query, a file existence check).

Examples that work beautifully:

- Refactoring fifty notebooks to use a shared helper.
- Migrating a codebase from one library version to another.
- Updating every Markdown file in a docs site to a new style guide.
- Re-prompting twenty AIDI extraction pipelines and re-running their eval cohorts.

Examples that do **not** work well:

- Open-ended research ("figure out the best architecture for X"). No completion check exists.
- Single-file feature work. Too small; just supervise it.
- Anything where each task depends on a human decision midway.

## The Three Dangers

There are exactly three ways a Ralph loop ruins your day. Memorize them.

**1. Infinite loop.** No completion promise, or a promise the hook can't actually check. The loop runs until you notice. By then it has burned an Opus subscription's worth of tokens.

> ⚠️ **Warning.** Always set `--max-iterations 30` (or whatever fits your task). Even with a completion promise, this is your circuit breaker.

**2. Token burn.** Even a well-shaped loop running on Opus across a large codebase can spend $50–$200 in a night. That can be money well spent. It can also be money wasted because you misjudged the prompt. Sanity-check the per-iteration token usage on a short run before kicking off the long one.

**3. Cascading silent failures.** Without per-iteration validation, Claude can build on top of subtly wrong work. By iteration fifteen, the codebase looks "done" but is wrong in ways the to-do checks miss. This is why every to-do item needs a real test, not just a "Claude believes it works" check.

## Combining With Worktrees and Subagents

The full-power configuration:

1. **One worktree per Ralph loop.** Run the loop in `~/aidi-prompt-refresh/` while you keep working on main features in the primary repo. (Chapter 16.)
2. **Subagents for parallel sub-tasks.** Within a Ralph iteration, Claude can spawn subagents that each refactor one notebook, run in parallel, and report back. (Chapter 13.)
3. **Headless `-p` mode for full unsupervised runs.** Combine `-p`, a tight allowlist, a Ralph loop plugin, and a max-iterations cap. (Chapter 17.) You can launch this from a cron job and walk away.

> 🧠 **Remember.** Worktrees + subagents + Ralph + headless is the configuration Boris Cherny uses. It is not magic. It is four features stacked, each one earning its keep, each one with a guardrail.

## The KHCC Example

It is Friday at 5:30 PM. You have a `to-do` list of twelve AIDI extraction pipelines that need their prompts updated for the new GPT-4.1-mini deployment and re-evaluated against the frozen deceased-patient cohort. Each one takes maybe 20 minutes of supervised work. Twelve × 20 = four hours. You don't want to stay until 9:30 PM.

You write `friday_refresh_todo.md`:

```markdown
# Friday Prompt Refresh

For each pipeline:
- Update the prompt to use the new gpt-4.1-mini system message template.
- Re-run the eval against the frozen deceased-patient cohort.
- Confirm eval pass rate is >= prior baseline (stored in eval_runs).
- Mark the item complete only if eval passes.
- If eval regresses, leave the item unchecked and add a note explaining why.

- [ ] pathology_v6_2
- [ ] er_extractor
- [ ] aki_notification
- [ ] chemo_prep
- [ ] vanco_tdm
- [ ] amr_audit_breast
- [ ] amr_audit_urology
- [ ] amr_audit_ent
- [ ] discharge_summary
- [ ] bmt_gvhd_extraction
- [ ] readmission_risk
- [ ] icu_dx_extract
```

You make a fresh worktree, launch Claude with the Ralph plugin, set `--max-iterations 40` and a completion promise of "every item in friday_refresh_todo.md is checked or annotated, and aidi_catalog.dbo.eval_runs has a new row for each pipeline."

You go home.

Saturday morning you check the worktree. Eight items checked. Three items unchecked with notes explaining mild regressions. One item flagged "needs human review: eval pass rate dropped from 0.91 to 0.74, prompt may need restructuring." Total runtime: 5 hours 12 minutes. Total cost: $34. Total of your evenings burned: zero.

Monday you spend an hour on the four flagged items. The refresh that would have taken you a week is done by Tuesday lunch.

This is what the new era of coding agents actually looks like. Not Claude replacing you. Not Claude doing the easy 80% poorly. Claude doing the listy, repetitive, verifiable 80% correctly, overnight, while you sleep, while you spend Monday on the four interesting cases where judgment is genuinely needed.

> 💡 **Tip.** Always have the Ralph loop write a per-iteration log file. When you review on Monday, you want to see *why* each item was marked or unmarked, not just the final state. A loop without an audit trail is hard to trust.

## Try This

1. Install the `ralph-wiggum` plugin (`claude plugins add ralph-wiggum`; exact command may vary by version, check the docs).
2. Make a `practice_todo.md` with five tiny tasks (create file, rename function, add a docstring, etc.) and a check for each.
3. Run `/ralph-loop` with a completion promise of "every item is checked off and tests pass" and `--max-iterations 15`.
4. Watch the stop-hook fire between iterations. Notice that Claude doesn't get to leave until the list is done.
5. Then deliberately add an impossible item ("connect to a server that doesn't exist") and watch the loop spend its iteration budget trying. This is why max iterations exists.

## Watch Out

- **Never run a Ralph loop without max iterations.** This is the single most expensive mistake in this book.
- **Never run one without a completion promise the hook can actually verify.** "Until it's good" is not a promise. "Until pytest exits zero" is.
- **Validate per-item, not just at the end.** A loop that checks twenty items and only tests at the end will hide nineteen cascading failures.
- **Watch the cost.** Set a token budget and monitor `/cost` during the first short run. Multiply by your iteration count. If the math is alarming, change the model to Sonnet or shrink the prompt.
- **Don't Ralph-loop a clinical pipeline change without a real eval gate.** The eval suite against the frozen deceased-patient cohort is the only acceptable completion criterion for AIDI prompt changes. "Tests pass" is necessary but not sufficient. "Eval pass rate ≥ baseline" is the bar.
- **Ralph is not a substitute for thought.** It is a tool for executing a plan you already have. If you wouldn't trust a junior engineer to grind through your to-do list overnight, don't trust Claude to either; fix the to-do list first.
