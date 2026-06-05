# Appendix A: The Claude Code Cheat Sheet

*Print this. Tape it to your monitor.*

---

## Open / close / reset

| What | How |
|---|---|
| Open Claude Code | `claude` |
| Close | `Ctrl+C` twice |
| Clear conversation | `/clear` |
| Resume last session | `claude --resume` |
| Help (list commands) | `/help` |

## The ten essential slash commands

| Command | What it does |
|---|---|
| `/init` | Generate starter `CLAUDE.md` (then cut in half) |
| `/clear` | Wipe conversation, keep project |
| `/compact <focus>` | Summarize history, keep going |
| `/rewind` | Restore code or conversation to any prior point |
| `/model <name>` | Switch model mid-session (`haiku`/`sonnet`/`opus`/`opus[1m]`) |
| `/cost` | Session spend in dollars |
| `/permissions` | Edit allow/deny lists |
| `/agents` | Manage subagents |
| `/btw <question>` | Side-question without polluting history |
| `/statusline` | Live HUD at bottom of terminal |

## Keystrokes

| Key | What it does |
|---|---|
| `Shift+Tab` | Enter Plan Mode |
| `Ctrl+G` | Edit Claude's plan in your editor |
| `Esc` | Stop Claude mid-action |
| `Esc Esc` | Open `/rewind` menu |
| `Ctrl+S` | Stash a draft prompt |
| `Ctrl+B` | Background a long-running task |
| `!cmd` | Run bash, land output in context |
| `@path/to/file` | Reference a file directly |
| `Cmd+V` / `Ctrl+V` | Paste a screenshot |

## Models

| Model | When |
|---|---|
| Haiku | Bulk classification, simple file ops |
| Sonnet | Daily default, most coding |
| Opus | Hard reasoning, suspicious bugs, architecture |
| Opus 4.6 with `ultrathink` | Adaptive deep reasoning on hard problems |
| `opus[1m]` | When you need the 1M-token context window |

## The 8 built-in tools

`Read` `Write` `Edit` `Bash` `Glob` `Grep` `WebSearch` `WebFetch`

## File layout

```
~/.claude/                      # personal, global
├── CLAUDE.md                   # your global preferences
├── settings.json               # global permissions + hooks
├── commands/                   # personal slash commands
└── agents/                     # personal subagents

<your-project>/
├── CLAUDE.md                   # project preferences
├── .claude/
│   ├── settings.json           # project allow/deny + hooks
│   ├── commands/               # project slash commands
│   ├── agents/                 # project subagents
│   ├── skills/<name>/SKILL.md  # project skills
│   └── rules/                  # conditional rules (path frontmatter)
```

## Permissions one-liner (`.claude/settings.json`)

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Bash(npm test)",
      "Bash(pytest *)",
      "Bash(pre-commit run *)",
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
  }
}
```

## Auto-format hook (`.claude/settings.json`)

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
      }]
    }]
  }
}
```

## Headless / scripting

```bash
# One-shot, no prompts
claude -p "fix the failing tests" --allowedTools Read,Edit,Bash

# Pipe stuff in
cat error.log | claude -p "explain this error and suggest a fix"

# Parallel worktrees
claude --worktree feature-auth
claude --worktree bugfix-login
claude --worktree refactor-api
```

## Pricing (as of writing)

| Plan | Cost | When |
|---|---|---|
| Pro | $20/mo | Light daily use |
| Max 5× | $100/mo | Regular dev work |
| Max 20× | $200/mo | Heavy power-user, long sessions |
| API pay-as-you-go | Per-token | Light + irregular use, or scripted batches |

## The starter `CLAUDE.md`

```markdown
# CLAUDE.md
## Stack
<your stack in one sentence>

## Run / test
- Tests: <command>
- Eval: <command>
- Lint: <command>

## Behavior rules
1. Think before coding: verify, don't guess.
2. Simplicity first: minimum code that solves the problem.
3. Surgical changes: don't touch adjacent code.
4. Tests encode intent.
5. Fail loud: surface every skipped row, null, partial success.

## PHI rules (KHCC)
- MRNs: Optimus-encoded only in outputs.
- Names: Fernet-encrypted, never in logs.
- Eval cohort: frozen deceased-patient set only.
```

## Daily flow

1. `claude` (or `cc` if you've configured the alias)
2. `/statusline` (one-time per laptop)
3. `Shift+Tab` for anything bigger than a one-liner
4. Read the plan, `Ctrl+G` to edit if needed
5. Watch the diff before approving each change
6. `/clear` between unrelated tasks
7. `/cost` before lunch, `/cost` before you leave
