# Chapter 21: Ten Slash Commands Worth Memorizing

There are dozens of slash commands. You only need ten in muscle memory.

## 1. `/init`

Run this once per project, on day one. It scans the codebase and drafts a starter `CLAUDE.md`. Then (per Chapter 10) you cut the result in half. Without `/init`, every new project starts cold. With it, Claude knows your stack, your test command, and your folder layout before you say a word.

## 2. `/clear`

The reset button. Wipes the conversation, keeps the project. Use it between unrelated tasks, after two failed corrections, and at the start of every new session that isn't a deliberate resume. The single most-used command in any serious user's day, and the one beginners use the least.

> 🧠 **Remember.** A clean 30-minute conversation beats a confused 3-hour one. `/clear` is how you get there.

## 3. `/compact`

When you want to keep going but the context window is filling up, `/compact` summarizes everything so far and continues with the summary in place of the full transcript. Always pass an argument: `/compact focus on the schema migration decisions`. Without guidance, compaction can lose the thread.

## 4. `/rewind`

The "I changed my mind" command. Opens a list of every prompt from your session and lets you jump back to any point. Pair with `Esc+Esc` for the keyboard shortcut. Restore code only, conversation only, or both. This is your undo for ideas you were only 40% sure about.

## 5. `/model`

Switch models mid-session. `/model haiku` when you're doing trivial bulk work. `/model sonnet` for the default daily flow. `/model opus` for the hard reasoning, the architecture choice, the suspicious bug. `/model opus[1m]` if you need the 1-million-token context window. Match the model to the task and you'll halve your spend.

## 6. `/cost`

How much have you spent? `/cost` answers in real dollars for the current session. `/stats` adds tokens and per-model breakdown. Check this before lunch and before you go home. The number teaches you which kinds of work are expensive and which are cheap, which is half of using the tool well.

## 7. `/permissions`

The allowlist editor without the JSON. Type `/permissions`, get a UI, tick the boxes for the commands you trust. The result is written to `.claude/settings.json`, which you can check into git so your teammates inherit the same trust list. This is the safer alternative to `--dangerously-skip-permissions`, and the one Boris Cherny recommends.

## 8. `/agents`

Open the subagent manager. Create new specialized agents (a strict-TypeScript reviewer, a Haiku-based quick-search agent, a docs writer) and save them to `.claude/agents/`. Once saved, you can summon them by description: "Use the security-reviewer to check this file." The setup is 5 minutes per agent and pays off forever.

## 9. `/btw`

A side-question overlay. "By the way, why this approach?" You get an answer without polluting the main conversation history. Useful when you want a clarification but don't want it in the transcript that compaction will summarize. Small command, big effect on long sessions.

## 10. `/statusline`

Run once. Get a live HUD at the bottom of your terminal: current directory, git branch, context usage percentage, model in use. Suddenly you can see when you're at 78% of your context window without guessing. Suddenly you notice you're still on `opus` for the trivial work. Visibility pays off.

---

## Honorable mentions

A few that didn't make the top ten but earn their keep:

- **`/help`**: every command, alphabetical. Use it when your brain blanks.
- **`/voice`**: push-to-talk. People speak more context than they type.
- **`/loop`**: schedule a recurring background check ("check if the deploy succeeded in 5 minutes").
- **`/sandbox`**: OS-level isolation for risky experiments.
- **`/config`**: pick your output style (Explanatory, Concise, Technical).

## Try This

Make yourself a `~/.claude/commands/aidi-eval.md` file with this content:

```markdown
---
description: Run the deceased-patient eval suite and report deltas
---
Run the eval suite at aidi_catalog.dbo.eval_runs against the frozen
deceased-patient cohort. Compare counts to yesterday's baseline. Report
each delta with the patient MRN (Optimus-encoded only) and the diff
in the structured output. Don't proceed if any case is skipped.
```

You now have `/aidi-eval` as a custom slash command in every Claude Code session, forever. Multiply this by twenty rituals and you've built your own command-line.

## Watch Out

Don't memorize every slash command; you'll forget half of them by Friday. Memorize **these ten**, and learn `/help` so you can find the rest when you need them. The goal is fluency, not encyclopedic recall.
