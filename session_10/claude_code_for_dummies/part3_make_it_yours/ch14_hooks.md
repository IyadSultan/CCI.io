# Chapter 14: Hooks

Everything we've covered so far depends on Claude *choosing* to follow your rules. Hooks are what you reach for when *choice* is no longer good enough.

A hook is a shell command that Claude Code runs automatically at a lifecycle event: before a tool runs, after a tool runs, when a session starts, when the agent stops. The hook always fires. It costs zero tokens. It's not advice for the model. It's plumbing.

Suryansh Tiwari's rule #33 puts it perfectly: **`CLAUDE.md` for suggestions. Hooks for requirements.**

## The Lifecycle Events

There are several hook types. The four that matter most for daily work:

- **`PreToolUse`**: Fires *before* Claude is allowed to use a tool. Can inspect the tool name and arguments. Can block the action by exiting with a non-zero status. This is your safety net.
- **`PostToolUse`**: Fires *after* a tool completes. Cannot block (the action already happened) but can react — format the file, run a linter, log the change, notify a webhook.
- **`Stop`**: Fires when the agent finishes its turn and is about to return control to you. This is the magic ingredient in the Ralph loop (Chapter 18); a `Stop` hook can re-feed Claude its own task list and keep it working overnight.
- **`SessionStart`** / **`SessionEnd`**: Fire at the bookends of a session. Good for logging, environment setup, or printing a daily reminder.

> 🧠 **Remember.** Hooks always run. There is no "Claude decided not to" with a hook. If the hook is configured, the hook fires, every time, no exceptions. That's why they're the right tool for non-negotiable rules.

## Where They Live

Hooks are configured in `.claude/settings.json` under the `"hooks"` key:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

Three pieces:

- **`PostToolUse`**: the event.
- **`matcher`**: a regex against the tool name. `Edit|Write` means "any time Claude edits or writes a file." Use `Bash` to match shell commands; use `.*` to match every tool.
- **`command`**: the shell command to run. Environment variables (`$CLAUDE_FILE_PATH`, `$CLAUDE_TOOL_INPUT`, etc.) are populated with the context of the tool call.

> 🔧 **Technical Stuff.** The exact set of environment variables depends on the tool and the hook event. `PostToolUse` on `Edit` gives you `$CLAUDE_FILE_PATH`. `PreToolUse` on `Bash` gives you `$CLAUDE_TOOL_INPUT` with the full command. Check the docs for the full table, and when in doubt, write a hook that just prints `env` and read what's available.

## Example 1: Auto-Format with Prettier

Suryansh's rule #34. The hook above runs Prettier on every file Claude edits or writes. The `|| true` keeps the hook from failing (and blocking subsequent work) if Prettier doesn't recognize the file type. The `2>/dev/null` suppresses noise.

Drop that block into `.claude/settings.json` and you will never again ask Claude to "remember to format the file." It happens automatically. Forever.

Same idea for Python:

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

R:

```json
{
  "type": "command",
  "command": "Rscript -e \"styler::style_file('$CLAUDE_FILE_PATH')\" 2>/dev/null || true"
}
```

> 💡 **Tip.** Stack multiple `PostToolUse` hooks for different file types. The matcher is regex against the *tool name*, not the file. Filter inside the command itself with `case "$CLAUDE_FILE_PATH" in ... esac`.

## Example 2: Block Destructive Commands

Suryansh's rule #35. The other side of the safety net: a `PreToolUse` hook that inspects every bash command and refuses the dangerous ones.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE '(rm\\s+-rf\\s+/|DROP\\s+TABLE|TRUNCATE|DELETE\\s+FROM.*WHERE\\s+1\\s*=\\s*1)'; then echo 'BLOCKED: destructive command' >&2; exit 1; fi"
          }
        ]
      }
    ]
  }
}
```

If the regex matches, the hook exits non-zero, and Claude Code refuses to run the command. The model sees the rejection and tries something else.

This is what makes it safe to run Claude with broader permissions. The hook is a hard floor under your trust. Even if Claude decides creatively that `rm -rf` is the right answer, the hook stops it.

> ⚠️ **Warning.** A hook is only as good as its regex. The example above blocks `rm -rf /` but not `rm -rf $HOME` or `rm -rf ~`. Write your blocklist for *your* worst-case scenarios. And remember: a hook can be bypassed if Claude finds another path (e.g., `find / -delete`). Hooks are a floor, not a ceiling.

## Example 3: Log Every Edit

Audit trails matter, especially in a regulated environment.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) $CLAUDE_FILE_PATH\" >> .claude/edit-log.txt"
          }
        ]
      }
    ]
  }
}
```

Now every file Claude touches is recorded with a timestamp. No token cost. No prompt engineering. Just a tail of the log when you need to know what happened.

## A KHCC Hook: Protect the Eval Cohort

Here's one worth writing today. The frozen deceased-patient cohort lives in `aidi_catalog.dbo.eval_runs`. If a non-eval session accidentally writes to that table, the eval baseline is corrupted and future regressions become invisible. This is the worst-case failure mode for a clinical AI eval suite.

A `PreToolUse` hook can prevent it:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'aidi_catalog\\.dbo\\.eval_runs'; then if [ \"$AIDI_EVAL_SESSION\" != \"1\" ]; then echo 'BLOCKED: eval_runs touched from non-eval session. Set AIDI_EVAL_SESSION=1 to override.' >&2; exit 1; fi; fi"
          }
        ]
      }
    ]
  }
}
```

What this does:

1. Inspect every bash command for the string `aidi_catalog.dbo.eval_runs`.
2. If found, check whether the environment variable `AIDI_EVAL_SESSION` is set to `1`.
3. If it isn't, block the command with a clear error message.

Now an analyst exploring AKI cases can't accidentally `UPDATE` the eval table because they typoed a filter. An automation script that's *supposed* to write to `eval_runs` sets the environment variable up front and proceeds normally. The hook is invisible when behavior is correct and hard-stops when it isn't.

Pair this with the `aidi-eval-runner` subagent from Chapter 13: the subagent sets `AIDI_EVAL_SESSION=1` before its work and is the only path through which the eval table changes. Defense in depth.

> 💡 **Tip.** Pair hooks with explicit override mechanisms (an environment variable, a flag file) rather than making them unconditional. Unconditional hooks frustrate users into disabling them. A clear override path keeps the hook on permanently while still permitting deliberate work.

## The `Stop` Hook (A Preview)

We'll cover the Ralph loop properly in Chapter 18, but the seed is here. A `Stop` hook fires when Claude finishes its turn:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "if [ -s TODO.md ]; then echo 'Tasks remain in TODO.md. Continue.'; fi"
          }
        ]
      }
    ]
  }
}
```

When the hook prints to stdout, that output is fed back into Claude's context as a new turn. So if `TODO.md` has any content, Claude doesn't stop; it sees a new instruction telling it to continue. That's a Ralph loop in seven lines of shell. The version that runs all night is more elaborate, but the mechanism is exactly this.

> 🧠 **Remember.** `Stop` hooks turn Claude from a chat session into an autonomous worker. The agent only truly stops when the hook agrees there's nothing left to do.

## When to Reach for a Hook vs. a Rule

- **Rule in `CLAUDE.md`**: anything Claude can be expected to follow voluntarily and where the consequence of a slip is "minor annoyance." Use conventions, naming, style, default model choice.
- **Hook**: anything where a slip is costly, irreversible, or invisible. Formatting (because catching unformatted code in review is friction). Destructive command blocking (because `rm -rf` doesn't have an undo). Audit logging (because you can't fake what wasn't recorded). Eval-table protection (because corrupted baselines hide future regressions).

> ⚠️ **Warning.** Don't put every rule in a hook. Hooks are powerful and noisy. The more hooks you have, the harder Claude is to work with. Reserve them for the non-negotiables. Everything else stays in `CLAUDE.md`.

## Where Settings Live

- `.claude/settings.json`: project-level. Checked into git. Shared with the team.
- `.claude/settings.local.json`: project-level, gitignored. Your personal overrides for the project.
- `~/.claude/settings.json`: user-level. Applies everywhere.

Hooks compose across the three: a user-level hook fires on every project, a project-level hook fires only there, and a local file lets one developer add hooks without inflicting them on the team.

## Try This

1. Open `.claude/settings.json` (create it if it doesn't exist). Add the Prettier or `ruff format` hook above, adapted to your language. Make Claude edit a file. Watch the formatting happen without you asking.
2. Add the destructive-command blocker. Then explicitly ask Claude to `rm -rf` something benign in a sandbox. Confirm the hook blocks it. Read the rejection message.
3. Add an audit log hook. Work for an hour. Then `cat .claude/edit-log.txt` and see exactly what got touched.

## Watch Out

- **A bad hook can wedge your session.** A `PreToolUse` hook that always exits non-zero will block every action. If Claude seems frozen, check your hooks.
- **Hooks run with your shell's permissions.** Don't write a hook that does anything you wouldn't run yourself. There's no sandbox.
- **Regex blocklists leak.** A blocklist for `rm -rf /` is bypassed by `cd /; rm -rf .`. Treat the blocklist as a tripwire, not a fortress. Layer with permission settings and `/sandbox` when stakes are high.
- **Stop hooks can loop forever.** If your `Stop` hook always prints something, Claude never stops. Always have a termination condition: empty TODO list, max iterations, time of day.
- **Don't commit secrets via hook environment variables.** If your hook reads `$AZURE_OPENAI_KEY`, don't echo it. Don't log it. Don't pipe it through anything that might end up in `.claude/edit-log.txt`.
