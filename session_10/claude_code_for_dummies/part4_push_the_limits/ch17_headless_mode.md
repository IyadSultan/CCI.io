# Chapter 17: Headless Mode and Automation

Claude Code is, on the surface, a chat program. You type, it thinks, it asks permission, you approve, it edits. That is one mode. There is another mode where Claude is a Unix tool, no chat, no prompts, no terminal at all, just a process that reads input, does the work, and writes output to stdout. That mode is how you put Claude inside a cron job, a GitHub Action, or a nightly pipeline.

## The `-p` Flag

The whole feature is one flag: `-p` (short for "print"). It used to be called *headless mode* in the early docs. The newer documentation calls it *CLI mode* or *non-interactive mode*. Same feature.

```bash
claude -p "fix the failing tests in this repo"
```

When you run that, Claude does **not** open the interactive UI. It reads the prompt, runs the agentic loop until it thinks it's done, prints the final answer to stdout, and exits with a status code. No prompts. No approval dialogs. No "are you sure?" because there is no human to ask.

That last part is the whole point and also the whole danger.

> 🧠 **Remember.** `-p` turns Claude from a *conversational tool* into a *CLI tool*. It's what you reach for when there is no human in the loop. Anything you wouldn't trust to run without supervision should not go through `-p`.

## Allowlists Are Mandatory

Because there is no human to approve actions, you must pre-approve them. The flag is `--allowedTools`:

```bash
claude -p "summarize today's pipeline errors" \
  --allowedTools "Read,Grep,Bash(grep:*)"
```

This says: Claude may read files, grep them, and run `grep` from bash, but nothing else. Try to write a file? Denied. Try to `rm -rf`? Denied. Try to `curl evil.com`? Denied.

The opposite flag is `--disallowedTools`, which inverts the logic (allow everything except these). I do not recommend it. **Allowlist surgically; never blanket-allow.**

> ⚠️ **Warning.** Combining `-p` with `--dangerously-skip-permissions` (the nuclear flag from Chapter 4) is how people lose data overnight. Even Boris Cherny, who built Claude Code, says he never uses skip-permissions. In headless mode it is doubly true. If you find yourself reaching for it, you have under-specified your allowlist. Fix the allowlist instead.

## Piping In, Piping Out

Because `-p` reads stdin and writes stdout, it composes with everything Unix already gives you:

```bash
# Pipe a log file in, get an explanation out
cat error.log | claude -p "explain this stack trace and suggest a fix"

# Pipe a diff in, get a review out
git diff main | claude -p "review this change for SQL injection risks"

# Pipe Claude's output into another tool
claude -p "list every TODO in this repo" --allowedTools "Read,Grep" | tee todos.txt
```

This is the Unix philosophy applied to an AI agent: small programs that read text and write text, glued together with pipes.

> 💡 **Tip.** Combine `-p` with `--output-format json` to get structured output you can parse in a script. The shape includes the assistant's final message, token counts, and any tool calls made. Perfect for logging or for feeding into a second pipeline stage.

## CI/CD Integration

The poster-child use case is a GitHub Action that reviews every PR. The Action checks out the PR, runs:

```bash
claude -p "Review the diff in this PR for bugs, security issues, and KHCC clinical-pipeline conventions. Post your findings as inline review comments. Use the gh CLI." \
  --allowedTools "Read,Grep,Bash(gh:*)"
```

Claude reads the diff, runs `gh pr view` and `gh pr diff` to get context, evaluates the change, and uses `gh pr review --comment` to leave findings. No human sits at a console. The Action runs in seconds-to-minutes per PR.

The same shape works for:

- **Nightly migration sanity checks.** A cron job runs Claude against last night's ETL output and writes a report.
- **Dependabot triage.** When a bot opens a PR bumping a dependency, Claude reads the changelog and flags whether the bump is safe to auto-merge.
- **Stale-issue triage.** A weekly job reads every issue older than 60 days and labels them.

> 🔧 **Technical Stuff.** Inside a GitHub Action, the `ANTHROPIC_API_KEY` environment variable is what Claude Code looks for. Store it as a repo secret. Never echo it into logs. The Action `actions/setup-node` plus `npm install -g @anthropic-ai/claude-code` is the whole install dance.

## Cron Jobs and Scheduled Tasks

On Linux, `cron`. On macOS, `launchd`. On Windows, Task Scheduler. The shape is identical: at a fixed time, run a script. That script invokes `claude -p`.

```bash
# /etc/cron.d/aidi-nightly
0 6 * * * aidi-bot /opt/aidi/scripts/nightly-summary.sh >> /var/log/aidi-claude.log 2>&1
```

The `nightly-summary.sh` script is just bash glue around a `claude -p` call. The log captures stdout. The exit code captures pass/fail.

> 🧠 **Remember.** Cron + `-p` is how Claude Code goes from "an interactive tool I open" to "a service that runs whether I'm at my desk or not." This is the leap from coding agent to teammate.

## The Safety Math

Here is the rule I want you to commit to memory:

**Headless × surgical allowlist = safe automation.**
**Headless × skip-permissions = uncontrolled execution.**

Every `-p` invocation should look like a recipe: a tight prompt, a tight allowlist, a tight output destination. The day you find yourself writing `claude -p "..." --dangerously-skip-permissions` in a cron job is the day to step back and ask which specific tools the job actually needs.

> ⚠️ **Warning.** A headless Claude that can write files and run bash, scheduled to run at 3 AM, is functionally indistinguishable from a malicious script you wrote on purpose. Treat the allowlist like a firewall rule. Default deny.

## The KHCC Example

Here is the nightly job that runs on the AIDI bastion at 6:00 AM every weekday.

A new VistA extract lands in `/data/vista/incoming/` around 5:30 AM. The AIDI team wants a one-page summary every morning before standup: row counts, new MRN counts, any unusual nulls or schema drifts compared to the previous day, and a flag if any column unexpectedly went 100% null (which usually means an upstream rename).

The script:

```bash
#!/bin/bash
# /opt/aidi/scripts/vista-morning-summary.sh

set -euo pipefail
cd /data/vista/incoming

claude -p "Compare today's VistA extract files to yesterday's. \
  For each file: report row count delta, new column count, columns whose null rate \
  changed by more than 5 percentage points. Flag anything that looks like a schema rename. \
  Output as markdown. Then send the markdown body to the AIDI team list via the \
  'aidi-email' CLI tool." \
  --allowedTools "Read,Grep,Bash(ls:*),Bash(wc:*),Bash(head:*),Bash(aidi-email:*)" \
  --output-format text \
  > /var/log/aidi/vista-summary-$(date +%F).md
```

Tight allowlist: read files, grep them, run a few read-only bash commands, send one email through the AIDI internal mailer. Cannot write to the data directory. Cannot delete. Cannot connect to anything but the mailer. Cannot run arbitrary bash.

By 6:05 AM the AIDI team has a markdown summary in their inbox. The on-call data engineer sees it on her phone before she's at her desk. If the summary is empty or the script failed, the cron log shows it. If there's a real schema drift, the summary surfaces it before any downstream pipeline runs.

> 💡 **Tip.** For any new headless job, run it interactively (without `-p`) first, watching what tools Claude actually reaches for. The set of tools it used is your allowlist. Don't guess.

## Try This

1. In a sandbox folder with a couple of files, run:
   ```bash
   echo "list every TODO comment" | claude -p --allowedTools "Read,Grep"
   ```
   Confirm you get a clean text answer with no UI prompts.
2. Add `--output-format json` and pipe through `jq .` to see the structured response. Note the `total_cost_usd` field: this is how you budget cron jobs.
3. Write a one-line cron job that runs `claude -p "summarize what changed in this repo in the last 24 hours"` and writes the output to a file. Read it the next morning.
4. Now imagine that job ran with `--dangerously-skip-permissions` and a buggy prompt. That thought should make you uncomfortable. Good.

## Watch Out

- **No human = no recovery.** A headless run that goes off the rails will keep going off the rails until it exits, hits an allowlist wall, or burns its turn limit. Set `--max-turns` (e.g. `--max-turns 20`) for jobs that should be short.
- **Costs add up.** A nightly job that runs Claude with Opus on a 200-file repo can be $5–$20 per run. That's $150–$600/month for one nightly job. Use Sonnet for routine jobs; reserve Opus for ones where quality genuinely matters. Check `/cost` or the JSON output.
- **Secrets in prompts.** Anything you put in the `-p` prompt or in files Claude reads is sent to Anthropic. Don't embed PHI, MRNs, or API keys. For KHCC pipelines, encode MRNs with Optimus *before* anything reaches the prompt.
- **Surgical allowlists, every time.** If you find yourself blanket-allowing `Bash`, you're one prompt injection away from a bad day.
