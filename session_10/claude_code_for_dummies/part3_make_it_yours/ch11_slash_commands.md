# Chapter 11: Slash Commands

A slash command is a keystroke that replaces a paragraph: the difference between typing "please clear the conversation history and start fresh" and typing `/clear`.

Slash commands are the keyboard shortcuts of Claude Code. Some are built in. Some you write yourself. All of them collapse a recurring instruction into a single token and a tab key. After a week of using Claude Code seriously, your fingers will know `/clear`, `/cost`, and `/compact` the way they know Ctrl+C.

## The Built-Ins Worth Knowing

There are dozens of built-in slash commands. You don't need to memorize them all. `/help` lists them at any time. But these are the ones that matter for daily work.

**Session and conversation control:**

- `/init`. Scan the project and write a starter `CLAUDE.md`. Run this once at the start of any new project. Then cut the result in half (see Chapter 10).
- `/clear`. Wipe the conversation. New session, empty context. Use this between unrelated tasks. A clean session beats a messy three-hour one.
- `/compact`. Summarize the conversation so far and continue with a smaller context. Use when you're deep in a session but need to keep going. You can pass guidance: `/compact focus on the SQL changes` keeps the parts you care about.
- `/rewind`. Jump back to a previous checkpoint. Claude saves a snapshot before every edit; `/rewind` opens a list and lets you restore either the code, the conversation, or both. This is your time machine.

**Cost and model:**

- `/cost`. How much have you spent in this session?
- `/stats`. Detailed token breakdown. Input tokens, output tokens, cached tokens, per-model.
- `/model`. Switch models mid-conversation. `/model haiku` for cheap tasks, `/model sonnet` for normal work, `/model opus` for the hard ones. Sonnet 4.6 and Opus 4.6 support `/model opus[1m]` for a million-token context window.

**Configuration:**

- `/config`. Open the config UI. Pick your output style (Explanatory, Concise, Technical) once and forget about it.
- `/permissions`. Manage what Claude can do without asking. Allowlist the safe stuff (`npm test`, `git status`); keep the risky stuff (`rm`, `DROP TABLE`) gated.
- `/statusline`. Install a live HUD at the bottom of your terminal showing directory, branch, and context usage. Once you have it, you'll wonder how you worked without it.
- `/help`. The list. When you forget, type this.

**Productivity:**

- `/btw`. Pop an overlay for a quick side question that doesn't pollute the main thread. "By the way, why did you pick async here?" Ask, get the answer, your main conversation is undisturbed.
- `/voice`. Push-to-talk dictation. Counterintuitively, speaking a prompt usually produces better prompts than typing one; you naturally add more context and constraints.
- `/sandbox`. Run Claude with OS-level isolation (Seatbelt on macOS, bubblewrap on Linux). Let it run wild on an experimental refactor with zero risk to your actual system. Review the diff, merge what you like.
- `/loop 5m /check-eval-runs`. Schedule a slash command to run every five minutes in the background while your main session continues. Good for polling deploys, eval runs, or long jobs.
- `/agents`. List and manage subagents (Chapter 13).

> 🧠 **Remember.** The two most important built-ins are `/clear` and `/compact`. They are the difference between a productive day and a session that slowly rots into confused outputs. Use them aggressively.

> 💡 **Tip.** `/rewind` is criminally underused. If Claude goes off the rails, don't argue with it for ten minutes. Hit `/rewind`, pick the prompt right before things went sideways, and try a different angle. Your future self will thank you.

## Custom Slash Commands

Here's where things get interesting. Any markdown file you drop into `.claude/commands/` becomes a slash command. The filename (without `.md`) is the command name. The contents are the prompt.

That's it. No configuration, no plugin system. A file is a command.

A minimal example. Create `.claude/commands/commit.md`:

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*)
argument-hint: [message]
description: Create a git commit with context
---

## Context

- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.

If a message was provided via arguments, use it: $ARGUMENTS

Otherwise, analyze the changes and create a conventional commit message:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `test:` for adding tests
- `docs:` for documentation changes
```

Three pieces are worth noticing.

**The frontmatter.** `allowed-tools` pre-approves specific bash commands so Claude doesn't have to ask permission. `argument-hint` tells the user what to pass. `description` is what appears in the slash-command picker.

**The `!` prefix.** Lines starting with `` !` `` are shell commands that run *before* Claude sees the prompt. Their output gets injected into the prompt itself. This is how you give Claude the current git diff without asking for it.

**`$ARGUMENTS`.** Whatever the user types after the command name gets substituted in. `/commit fix the AKI null handling` puts that string into the prompt.

> 🔧 **Technical Stuff.** The `!` prefix and `$ARGUMENTS` substitution happen on the client side, before the prompt is sent to the model. They're cheap. They don't burn any extra tokens beyond the shell output itself.

## Two More Examples Worth Stealing

Here's a `/optimize` command:

```markdown
---
description: Analyze code for performance issues and suggest optimizations
---

# Code Optimization

Review the file(s) I just shared for the following, in priority order:

1. **Performance bottlenecks**: O(n²) operations, inefficient loops, repeated work.
2. **Memory issues**: unreleased resources, large intermediate copies.
3. **Algorithm improvements**: better data structures, vectorization opportunities.
4. **Caching opportunities**: repeated computations that could be memoized.
5. **Concurrency**: race conditions, missing parallelism.

For each finding, output:
- Severity (Critical / High / Medium / Low)
- Location (file:line)
- Explanation of the problem
- Recommended fix, with a code example
```

And a `/doc-refactor` that documents while it cleans up:

```markdown
---
description: Refactor the current file and update its docstrings
---

Refactor the file I have open. Follow these rules:

1. Extract any function longer than 30 lines.
2. Rename any variable named `x`, `data`, `tmp`, or `result` to something specific.
3. Add or update a one-line docstring on every function.
4. Do NOT change behavior. Run the test suite after you're done.
5. Show me the diff before committing anything.
```

Notice: these are just prompts. There's no DSL, no plugin manifest, no build step. A file is a command.

> 💡 **Tip.** Start your custom commands by copying ones that already exist. The `luongnv89/claude-howto` repo has a clean set under `01-slash-commands/`: `commit`, `pr`, `optimize`, `doc-refactor`, `unit-test-expand`, `generate-api-docs`. Copy the one closest to your need, tweak the prompt, ship it.

## A KHCC Custom Command: `/run-aidi-eval`

Here's one that matters for AIDI work. The deceased-patient eval cohort is the gate for any prompt change. You want it to be one keystroke.

Create `.claude/commands/run-aidi-eval.md`:

```markdown
---
allowed-tools: Bash(databricks jobs run-now:*), Bash(databricks jobs get-run:*)
argument-hint: [pipeline-name]
description: Run the deceased-patient eval suite against a pipeline and report results
---

## Context

- Pipeline under test: $ARGUMENTS
- Eval cohort: `aidi_catalog.dbo.eval_cohort` (frozen deceased-patient set)
- Results table: `aidi_catalog.dbo.eval_runs`

## Your task

1. Trigger the Databricks eval job for the pipeline `$ARGUMENTS`. Use the job ID
   mapped in `docs/eval-jobs.json`.
2. Poll the run until it completes (status `TERMINATED`).
3. Query `aidi_catalog.dbo.eval_runs` for the latest run of `$ARGUMENTS` and
   compare against the previous run on the same pipeline:
   - Accuracy delta
   - Precision/recall delta
   - Any new failure cases (rows where `prev_pass = true AND new_pass = false`)
4. Report:
   - Pass/fail summary
   - Regressions (must be zero to ship)
   - Any new wins
5. Do NOT modify any prompt or pipeline code. This command is read-only.

## Acceptance

If there are any regressions, the output must start with `EVAL FAILED`.
If zero regressions, start with `EVAL PASSED`.
```

Now anyone on the team types `/run-aidi-eval pathology-v6` and gets a clean pass/fail with a diff against the previous run. The command captures the entire convention (which table, which cohort, which acceptance gate) so nobody has to remember it.

> ⚠️ **Warning.** Custom commands that take bash actions are powerful and dangerous in equal measure. Always set `allowed-tools` to the narrowest set you can. A command that allowlists `Bash(*)` is a command that can `rm -rf` your repo when Claude takes a creative interpretation.

## Where Commands Live

- `.claude/commands/foo.md`: project-level, checked into git, shared with the team.
- `~/.claude/commands/foo.md`: personal, available in every project.

A project-level command shadows a personal one of the same name. Keep team-relevant workflows in the repo; keep your personal quirks in your home directory.

## Try This

1. Run `/help` and read every built-in command. Pick three you didn't know about.
2. Run `/cost` after your next hour of work. Note the number. Run `/clear`. Notice what changes on the next prompt.
3. Create `.claude/commands/standup.md` that prints `git log --since=yesterday --oneline` and asks Claude to summarize what you did. Run it the next morning.
4. Steal the `commit.md` example above. Adapt it for your project's commit style. Use `/commit` for the next week instead of typing commit messages by hand.

## Watch Out

- **Don't overload `allowed-tools`.** `Bash(*)` is not a permission, it's a security hole. Be specific: `Bash(git status:*)`, `Bash(npm test:*)`.
- **Don't put secrets in `!` shell commands.** Anything you `cat` into a prompt becomes part of the conversation and may be logged.
- **Don't make a slash command for a one-off task.** If you're going to use it twice, write one. If once, just type the prompt.
- **Don't forget to commit `.claude/commands/`.** The whole point of project-level commands is that the team gets them. If they live only on your laptop, you've reinvented a personal shortcut.
- **Don't name a custom command the same as a built-in.** It either won't override or will, and either outcome is confusing.
