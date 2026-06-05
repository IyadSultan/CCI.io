---
layout: page
title: "Lesson 7: Long-Running — Loops, Schedules, Hooks"
permalink: /session_10/instructions/lesson7_loops_schedules_hooks/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 7 — Long-Running: Loops, Schedules, Hooks

Most clinical work happens while someone is watching — a doctor at the bedside, a pharmacist at the dispensing window, an analyst at her dashboard. Some clinical work, by design, happens while nobody is watching. The overnight batch jobs that close the day's billing. The 4 AM lab reconciliation. The pager that fires at 2 AM because a creatinine doubled. The system runs without you because the system has been told, in advance, exactly when to act and exactly when to stop.

Claude Code can be told the same way. This lesson covers three mechanisms that let Claude work without a human present, each appropriate for a different kind of "while nobody is watching":

- **Loops** — Claude keeps going on a task until a condition is met. Useful for long, listy work.
- **Schedules** — Claude runs at a fixed time, does the job once, exits. Useful for daily/weekly maintenance.
- **Hooks** — small shell commands that fire automatically at key moments in any Claude session. The most foundational of the three; the others are partly built on top.

> 🧠 **Remember.** These three are not interchangeable. A loop runs *until done*. A schedule runs *at a time*. A hook runs *at a moment in a session*. Use the wrong one and you will either burn money in an infinite loop, miss the run window, or build the right rule in a place where it can be silently ignored.

## 1. Loops

The simplest loop is the `/loop` slash command, used for recurring background checks. You write a prompt and an interval, and Claude runs the prompt on that interval until you stop it:

```
/loop 5m check the deploy logs and report if the rollout finished
```

Every five minutes, Claude reads the logs, reports the answer, and goes back to sleep. This is a finite-attention task — you wanted to know when the deploy was done; you wanted to keep coding while waiting. The loop is the pager.

A different kind of loop runs not on a clock but until a *promise* is met. This is the **Ralph loop**, named (by Boris Cherny, the engineer who built Claude Code) after Ralph Wiggum from *The Simpsons*, whose defining trait is unshakable persistence in the face of comically bad results. The Ralph loop anchors Claude's behavior on a **Stop hook** (more on hooks in section 3): every time Claude tries to end its turn, the hook checks whether a completion promise has been satisfied. If not, the hook blocks the exit and injects a "keep going" message. The loop continues until the promise is met or a hard iteration cap is hit.

The Ralph loop is how Boris reports landing 259 PRs in 30 days with zero hand-written code. The loop runs for hours. The model writes code. The harness keeps the model on task.

> 💡 **Tip.** Two guardrails on any Ralph loop are non-negotiable: a **completion promise** the hook can actually verify ("`pytest` exits zero AND every box in `todo.md` is checked"), and a **max iterations cap** ("`--max-iterations 30`"). Without the promise, the hook has no way to recognize "done." Without the cap, a bug becomes an infinite loop that burns money until you notice.

The sweet spot for a Ralph loop is **long, listy, verifiable** work: refactor fifty notebooks, migrate every R file to a new tidymodels API, re-evaluate twelve AIDI extraction pipelines against the deceased-patient cohort. The wrong spot is open-ended research ("figure out the best architecture for X") — there is no completion check, so the loop has no way to know when to stop.

> ⚠️ **Warning.** Never start a Ralph loop without testing it on a three-iteration prefix first. Run `--max-iterations 3` on the first two items in your to-do list. Watch what Claude does. Check the cost. Then multiply by the full iteration count. If the projected total is alarming, fix the prompt, shrink the loop, or switch to Sonnet before you turn it loose overnight.

## 2. Schedules

A loop is reactive: it keeps doing something until done. A schedule is calendared: it does the thing at a fixed time, then exits.

Behind every schedule sits **headless mode** — Claude as a one-shot command instead of an interactive conversation. The flag is `-p` (for *print*):

```bash
claude -p "summarize today's pipeline errors" \
  --allowedTools "Read,Grep,Bash(grep:*)"
```

That command does not open the chat. Claude reads the instruction, runs the loop until it decides the work is done, prints the answer, exits with a status code. No human approves any tool call along the way, which is why the `--allowedTools` flag is mandatory. Surgically allowlist; never blanket-allow. A blanket allow plus a wrong prompt is how clinicians lose data overnight.

You schedule the headless invocation with whatever scheduler your operating system provides — `cron` on Linux/Mac, Task Scheduler on Windows. Here is the KHCC nightly VistA summary, scheduled at 6 AM:

```bash
# /etc/cron.d/aidi-nightly
0 6 * * * aidi-bot /opt/aidi/scripts/vista-morning-summary.sh >> /var/log/aidi-claude.log 2>&1
```

The five fields at the start (`0 6 * * *`) mean "minute 0 of hour 6, every day, every month, every weekday." The script — a one-line wrapper around `claude -p` with a tight allowlist — runs against the freshly landed VistA extract (recall from Chapter 0.5 that VistA is KHCC's EMR, refreshed nightly into Databricks tables), compares it to yesterday's, and emails the AI Office team a one-page diff. By 6:05 AM the team has the summary in their inbox.

> 🔧 **Technical Stuff.** Inside a scheduled headless run, Claude looks for `ANTHROPIC_API_KEY` as an environment variable. Store it in a place the scheduled user can read but no one else can — never in the script itself, never in a logged-in user's `.bashrc`. The exit code (`0` for success, non-zero for failure) is captured by cron; pipe stdout and stderr into a dated log file so you can find out what happened when you check Monday morning.

## 3. Hooks

Loops and schedules are *strategies*. Hooks are *plumbing* underneath both.

A **hook** is a small shell command that Claude Code runs automatically at a specific moment in any session. The hook does not ask Claude for permission. It is not advice the model can ignore. It always fires. It costs zero tokens.

The clinical analogy is the EMR's auto-action rules. When a chemotherapy order for Cisplatin is signed, the EMR does not *advise* the physician to check the creatinine. It fires the check automatically, every time, whether anyone wants it or not. The hard-stop is built into the workflow at the system level. The physician cannot accidentally bypass it by being in a hurry.

The principle to keep in mind: **`CLAUDE.md` is for suggestions. Hooks are for requirements.**

### The four lifecycle events that matter

- **`PreToolUse`** fires *before* Claude uses a tool. The hook can inspect what Claude is about to do and refuse it. This is your safety hard-stop. Clinical analogy: the EMR refusing a vincristine *intrathecal* order, every time, no matter what.
- **`PostToolUse`** fires *after* a tool completes. It cannot block the action (it already happened), but it can react — format the file, run a linter, log the change, send a notification. Clinical analogy: the EMR auto-populating the post-procedure order set after a sign-off.
- **`Stop`** fires when Claude is about to end its turn and return control to you. The hook can block the exit and inject a "keep going" message — this is the engine of the Ralph loop.
- **`SessionStart` / `SessionEnd`** fire at the bookends of a session. Good for logging, environment setup, or running the eval suite at the end of every change.

### Where hooks live

Hooks are configured in `.claude/settings.json` under the `"hooks"` key. A minimal `PostToolUse` hook that auto-formats Python after every edit:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "ruff format \"$CLAUDE_FILE_PATH\" 2>/dev/null || true; ruff check --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

The three pieces are the lifecycle event (`PostToolUse`), a regex `matcher` against the tool name (`Edit|Write` matches both editing existing files and creating new ones), and the shell `command` itself. The `$CLAUDE_FILE_PATH` environment variable is filled in by Claude Code with the file that was just touched. The `|| true` at the end ensures a missing formatter does not break the hook chain.

### Three hooks worth installing today

**A. Block destructive commands** — the patient-safety hard-stop:

```json
{
  "PreToolUse": [{
    "matcher": "Bash",
    "hooks": [{
      "type": "command",
      "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE '(rm\\s+-rf\\s+/|DROP\\s+TABLE|TRUNCATE)'; then echo 'BLOCKED: destructive command' >&2; exit 1; fi"
    }]
  }]
}
```

The hook scans every bash command Claude is about to run. If the command matches a known-destructive pattern (`rm -rf /`, `DROP TABLE`, `TRUNCATE`), the hook exits non-zero and Claude Code refuses to run it. This is the equivalent of the EMR's hard-stop on vincristine intrathecal: even if Claude decides creatively that `rm -rf` is the right answer, the hook stops it before damage is done.

**B. Auto-format on every edit** — the order-set template:

The Ruff snippet above. Every Python file Claude touches gets formatted before you ever look at it. You will never again ask Claude to "remember to run the formatter."

**C. Run the eval suite at session end** — the discipline that makes the capstone shippable:

```json
{
  "SessionEnd": [{
    "matcher": ".*",
    "hooks": [{
      "type": "command",
      "command": "if [ -f ./run_evals.sh ]; then ./run_evals.sh >> .claude/eval-log.txt 2>&1; fi"
    }]
  }]
}
```

Every time you end a session in this project, the eval suite runs (if one is present). The log is appended to `.claude/eval-log.txt`. By the time you wrap up for the day, you know whether your changes regressed any case in the eval cohort. This is the hook you will wire into the Lesson 8-9 capstone. The ER triage app you ship cannot regress its acceptance tests because the eval suite runs every time you close a session. The discipline is automatic.

> 💡 **Tip.** Pair every blocking hook with an explicit override mechanism — an environment variable, a flag file. The eval-table protector at KHCC checks `AIDI_EVAL_SESSION=1` before allowing writes; legitimate eval pipelines set the variable, casual exploration does not. An unconditional hook frustrates users into disabling it, which is worse than no hook at all.

### Why hooks beat CLAUDE.md for the rules that matter

`CLAUDE.md` is text. Claude reads it. Claude *usually* follows it. Most of the time. "Most of the time" is fine for a coding-style preference. It is not fine for "do not drop the eval table."

A hook is plumbing. It always fires. The difference between a suggestion and a requirement, in this codebase, is whether the rule lives in `CLAUDE.md` or in `.claude/settings.json`.

> ⚠️ **Warning.** A bad hook can wedge your whole session. A `PreToolUse` hook that always exits non-zero will block every action. If Claude seems frozen, check your hooks first. And remember: hooks run with your shell's permissions. Do not write a hook that does anything you would not be comfortable running yourself.

## Stacking the three

The full-power configuration is all three glued together:

- Run a **Ralph loop** for the long, listy work.
- Anchor it on a **Stop hook** that checks a completion promise.
- Run the whole thing under a **schedule** so it fires when you go home.
- Wrap it in a `--worktree` so it cannot collide with other work (Lesson 6).

That is the configuration that lets you write `friday_refresh_todo.md`, hand it to Claude with `--max-iterations 40` at 5:30 PM Friday, walk out of the hospital, and read the results Saturday morning. The Ralph loop is the engine. The schedule is the ignition. The hooks are the rails.

## Try This

1. Open `.claude/settings.json` in your capstone folder (create it if it does not exist). Add the auto-format hook for Python. Ask Claude to edit a Python file. Watch the formatting happen without you mentioning it.
2. Add the destructive-command blocker. Then deliberately ask Claude to run `rm -rf /tmp/nonexistent` in a sandbox folder. Confirm the hook blocks it and read the rejection message.
3. Write a tiny `run_evals.sh` that just runs `pytest -q`. Add the `SessionEnd` hook above. Run a session, edit a file, exit. Open `.claude/eval-log.txt` and confirm pytest ran.
4. Pick a five-item to-do list (small refactors are fine). Install the `ralph-wiggum` plugin if you have not. Run `/ralph-loop` with `--max-iterations 10` and a completion promise of "every box is checked AND pytest exits zero." Watch the Stop hook fire between iterations. Notice that Claude does not get to leave until the list is done.

## Watch Out

- **A Ralph loop without `--max-iterations` is a four-figure bill waiting to happen.** This is the single most expensive mistake in this course. Set the cap. Always.
- **A schedule without a tight `--allowedTools` is a cron job that can do anything.** Surgically allowlist; never blanket-allow.
- **A `Stop` hook that always prints something will loop forever.** Always include a termination condition: an empty TODO list, a max-iterations counter, a time-of-day cutoff.
- **Regex blocklists leak.** A blocklist for `rm -rf /` does not catch `cd /; rm -rf .`. Treat the blocklist as a tripwire, not a fortress. For the highest-stakes work, layer hooks with `/permissions` and `/sandbox`.
- **Do not leak secrets through hooks.** If your hook reads `$AZURE_OPENAI_KEY`, do not echo it to stdout or pipe it into a log. Hooks see whatever your shell sees.
- **Do not Ralph-loop a clinical pipeline change without an eval gate.** "Tests pass" is necessary but not sufficient for an AIDI pipeline. "Eval pass rate ≥ prior baseline" is the bar. The deceased-patient cohort is the only acceptable completion criterion for a prompt change.
