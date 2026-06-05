---
layout: page
title: "Lesson 10: Cheat Sheet + What to Ship Next"
permalink: /session_10/instructions/lesson10_cheat_sheet/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 10 — Cheat Sheet + What to Ship Next

Three hours ago you knew Claude Code existed. Now you have shipped a clinical Django application through a seven-agent pipeline you understand top to bottom. This lesson is the one-page reference you tape to your monitor, plus a short list of where to take the work next.

> 🧠 **Remember.** The chain is small. PRD → CLAUDE.md → skills + agents + hooks → worktree-parallelized build → eval-gated deploy. Everything in this session was one of those six links.

---

## The cheat sheet

### Open / close / reset

| What | How |
|---|---|
| Open Claude Code in this folder | `claude` |
| Close | `Ctrl+C` twice |
| Wipe the conversation, keep the project | `/clear` |
| Resume the last session | `claude --resume` |
| List every slash command | `/help` |

### Ten slash commands to memorize

| Command | What it does |
|---|---|
| `/init` | Draft a starter `CLAUDE.md` (then cut it in half) |
| `/clear` | Reset the conversation |
| `/compact <focus>` | Summarize the conversation so far, keep going |
| `/rewind` | Restore code or conversation to any prior point |
| `/model` | Switch model mid-session (`haiku` / `sonnet` / `opus`) |
| `/cost` | What this session has spent in dollars |
| `/permissions` | Edit your allow/deny lists |
| `/agents` | Create or pick a subagent |
| `/config` | Output style: Explanatory / Concise / Technical |
| `/statusline` | Install the live HUD at the bottom of the terminal |

### Keystrokes worth knowing

| Key | What it does |
|---|---|
| `Shift+Tab` | Enter Plan Mode (Claude plans before editing) |
| `Ctrl+G` | Edit Claude's plan in your editor |
| `Esc` | Stop Claude mid-action |
| `Esc Esc` | Open the `/rewind` menu |
| `!cmd` | Run a bash command and feed the output into Claude's context |
| `@path/to/file` | Reference a file directly in a prompt |
| `Cmd+V` / `Ctrl+V` | Paste a screenshot |

### File layout — your project after this session

```
your-project/
├── CLAUDE.md                       # the persistent instruction manual
├── .claude/
│   ├── settings.json               # allow / deny / hooks
│   ├── commands/                   # custom slash commands
│   ├── agents/                     # subagents (one .md per agent)
│   ├── skills/<name>/SKILL.md      # skills (one folder per skill)
│   └── rules/                      # conditional rules (path frontmatter)
└── ... your code ...
```

### A safe `.claude/settings.json` for clinical work

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Bash(pytest *)",
      "Bash(python manage.py test *)",
      "Bash(ruff *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(gh pr *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(secrets/**)",
      "Read(data/patients/**)",
      "Read(*.key)",
      "Read(*.pem)"
    ]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command",
        "command": "ruff format \"$CLAUDE_FILE_PATH\" 2>/dev/null || true" }]
    }],
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command",
        "command": "scripts/block_destructive.sh \"$CLAUDE_TOOL_INPUT\"" }]
    }]
  }
}
```

### The CCI master `CLAUDE.md`

Download the course template: [CCI master CLAUDE.md](/CCI.io/session_10/templates/CLAUDE.md.txt) (based on [Karpathy's guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)). It covers think-first, simplicity, surgical edits, goal-driven execution, mistake logging, tests-before-commit, git hygiene, `.gitignore`, README updates, `.env` never touched, pinned PyPI versions, Context7 MCP for live docs, and LangChain/LangGraph as the preferred agent stack. Add project-specific stack and PHI rules at the bottom.

### The Software Factory pipeline at a glance

| Stage | Agent | Tools | Model | Gate? |
|---|---|---|---|---|
| 1 | codebase-researcher | Read, Grep, Glob | Haiku | – |
| 2 | story-writer | Read | Sonnet | ✅ |
| 3 | spec-writer | Read, Grep, Glob | Sonnet | ✅ |
| 4 | backend-builder | Read, Edit, Write, Bash | Sonnet | – |
| 5 | frontend-builder | Read, Edit, Write, Bash | Sonnet | – |
| 6 | test-verifier | Read, Edit, Write, Bash | Sonnet | – |
| 7 | implementation-validator | Read, Grep, Glob | Sonnet | ✅ |

Critical findings at Stage 7 → loop back to Stage 4 or 5, re-run 6, re-run 7.

### Hook cheats

| Hook | Fires when | Good for |
|---|---|---|
| `PreToolUse` | Before Claude runs any tool | Blocking `rm -rf`, `DROP TABLE`, writes to PHI paths |
| `PostToolUse` | After a tool finishes | Auto-format, linting, audit log |
| `Stop` | When Claude tries to end the session | Eval suite, Ralph loop |
| `SessionStart` | At the beginning of a session | Loading project secrets |
| `SessionEnd` | When the session closes | Cleanup, notifications |

### MCP / Connectors

- **Connectors** (Anthropic productized): Slack, Gmail, Google Drive, Calendar, Notion, Linear, GitHub — install in Claude.ai or Claude Desktop with a click.
- **Custom MCP servers** (write your own): wrap a database, internal API, monitoring tool. Use in Claude Code with `claude mcp add`.
- **Scope:** local (this folder), user (your machine), project (`.mcp.json` shared via git).
- **Rule:** read-only for any MCP that touches clinical data. No exceptions.

---

## Where to take this next

Five suggestions in order of effort.

### 1. Ship Lesson 9's ER triage to a sandbox Azure App Service
The deploy is in the optional appendix of Lesson 9. Half a day of work. Now your nurses can actually click into it on a test URL.

### 2. Add the doctor's queue screen
The `## Try This` exercise at the end of Lesson 9 has you do this through the same seven-stage pipeline. It's the right second pass — you'll see how much faster the second feature ships once the skills and agents are reused.

### 3. Wire the CCI PRD-Builder skill into a personal project
[Download CCI PRD-Builder](/CCI.io/session_10/skills/cci-prd-builder.skill) and use it on your next product idea. The skill cares about structure, not domain — clinical or generic.

### 4. Replace one Excel workflow with a Claude Code script
The AI Office didn't start with Django apps. It started with someone replacing a Tuesday-night Excel ritual with a Python script. Find your Tuesday-night ritual and use what you learned to script it. Two hours of work; weeks of saved time.

### 5. Build your own subagent library
The three subagents from Lesson 5 (codebase-researcher, story-writer, spec-writer) plus the four from Lessons 8–9 (backend-builder, frontend-builder, test-verifier, implementation-validator) are a starting set. Add one a month — a `methods-section-writer` for manuscripts, a `cohort-sql-reviewer` for AIDI pipelines, a `consent-form-translator` for IRB submissions. The library compounds.

---

## Reading list

- *Claude Code for Dummies* (`session_10/claude_code_for_dummies/`) — the companion book for this session. Full reference for every concept here.
- The freeCodeCamp Software Factory article — origin of the seven-agent pipeline.
- Anthropic's documentation on Skills, MCP, hooks — for the technical depth this session skipped.
- Boris Cherny's tweet on stop hooks — the canonical Ralph-loop pattern.

---

## A two-line summary of Session 10

You learned how to turn a clinical idea into a PRD, the PRD into a CLAUDE.md, the CLAUDE.md into skills and subagents, the skills and subagents into a pipeline, and the pipeline into a shipped application. The discipline is small; the leverage is enormous.

Now build something.

## Try This

Open a new folder. `claude`. Type one sentence describing a tool you want — anything from a vancomycin nomogram checker to a tumor-board agenda generator to a journal-club paper triage queue. Watch what Claude does. Notice what stages of the pipeline you skipped without thinking. That's your next lesson.

## Watch Out

Don't ship anything with a clinical decision component without the eval discipline from Chapter 0.5 of the book — a frozen test cohort and a binary regression gate. The Software Factory pipeline gives you speed. The eval cohort gives you safety. They are not interchangeable.
