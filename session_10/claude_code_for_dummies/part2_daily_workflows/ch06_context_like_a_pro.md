# Chapter 6: Context Like a Pro

The single biggest reason Claude Code gives you a bad answer is not that the model is dumb. It's that the context window is dirty.

This chapter is about how to keep it clean.

## What the Context Window Actually Is

Think of it as Claude's short-term memory. Everything Claude can "see" right now lives inside one fixed-size buffer: the system prompt, the `CLAUDE.md` file, the conversation so far, every file Claude has Read, every tool result, every screenshot. When that buffer fills up, things start falling out or getting fuzzy.

The numbers, in 2026:

- Sonnet 4.6: 200K tokens default, **1M tokens** if you pop `/model opus[1m]` or `/model sonnet[1m]`.
- Opus 4.6: same, 1M-token mode available.
- Haiku: smaller, but still generous.

> 🧠 **Remember.** A million tokens is roughly 750,000 words. That's eight novels of memory. You will not run out by accident. You *will* run out by being sloppy.

## The Green Bar (and What It's Trying to Tell You)

At the bottom of the Claude Code TUI there's a status line, and on it there's a thin bar — usually green, sometimes yellow, sometimes red. It tracks how full your context window is right now.

- **Green**: you have plenty of room. Keep working.
- **Yellow**: past halfway. Start being intentional about what you load.
- **Red**: close to the auto-compact threshold (~85%). Either compact now on your terms, or let the system do it on its terms.

> 💡 **Tip.** Glance at the green bar at the end of every prompt. It's a free signal. Most people ignore it until things go sideways.

## Context Rot: The Symptoms

You'll know it when you feel it.

- Claude forgets a constraint you stated ten messages ago ("I told you not to touch `prompts.py`").
- Answers become more generic and less grounded in your actual code.
- Claude re-reads files it has already read.
- Suggestions contradict earlier ones.
- Tool selection gets erratic.

These are the symptoms of a context window full of stale and conflicting information. The model isn't broken. The conversation is.

## The `/clear` Reflex

`/clear` wipes the conversation and starts a fresh session. Same `CLAUDE.md`, same project, same permissions, but no memory of what just happened.

The Suryansh rule (tip #13 from his "Claude Code tips" list, and it's the right rule): **between unrelated tasks, `/clear`.**

You just finished refactoring the AKI baseline-creatinine logic. You're about to start writing a Press Ganey survey parser. These tasks share *zero* context. Carrying the AKI conversation into the new task buys you nothing and costs you signal.

```
/clear
```

That's the whole command. One word. Use it more than you think you should.

> 🧠 **Remember.** `/clear` is not destructive. Your code is on disk. Your `CLAUDE.md` is on disk. Your git history is on disk. The only thing you lose is the chat, which was about to start rotting anyway.

## The Two-Failed-Corrections Rule

This one is tip #14 from the same list, and it has saved me hours.

**If Claude has failed to fix the same bug twice in a row, stop. Don't try a third time in the same context. Start fresh.**

Why? Because by the time Claude has flailed at a bug twice, the context contains two wrong hypotheses, two failed diffs, and two rounds of apologies. The third attempt is fighting *that noise* as much as the actual bug. A clean context with a sharper prompt ("the bug is in `compute_baseline()`, the failure mode is null returns for MRNs starting with K, here's the function") will out-perform the third correction every time.

> ⚠️ **Warning.** "Just one more try" in a polluted context is the surest way to burn an hour and not ship anything. Two strikes, you clear.

## `/compact`: The Surgical Option

Sometimes you don't want to throw the conversation away. You just want it slimmer. That's what `/compact` is for.

`/compact` asks Claude to summarize the conversation so far, drop the raw tool calls and file reads, and keep going with the summary in place of the verbose history.

The trick is the optional argument. You can *guide* the summary:

```
/compact focus on the API changes and the failing test cases
```

```
/compact keep the column schema and the eval results, drop everything else
```

> 💡 **Tip.** A guided `/compact` is dramatically better than an unguided one. Tell the summarizer what matters. It's not a mind reader.

Auto-compaction triggers at around 85% of the context window: same mechanism, no guidance, takes its best guess. If you have a long session going and you know what matters, run a guided `/compact` *before* the auto-compact fires, so you control what survives.

## `/rewind` and Esc-Esc: Time Travel

Sometimes the problem isn't memory. It's that Claude went down a wrong path five edits ago and you want to undo.

**`/rewind`** opens a list of every prompt in the session and lets you jump back to any of them. You can choose to restore *just the code*, *just the conversation*, or *both*. The conversation snapshots are taken at every turn; the code snapshots are taken before every edit.

**Esc-Esc** is the keyboard shortcut for the same thing.

```
Esc Esc
[pick a point in the list]
[choose: code only / conversation only / both]
```

> 🔧 **Technical Stuff.** Checkpoints are stored locally per session. They're separate from git. You can rewind a file Claude touched even if you never committed. They're cheap insurance.

> 💡 **Tip.** When Claude does something destructive and weird, your reflex should be Esc-Esc, not panic. Rewind first, diagnose second.

## The 1M Token Context: When It's Worth It

`/model opus[1m]` (or `/model sonnet[1m]`) switches you into the 1M-token context mode. It's not free (bigger context costs more per token) but for the right task it's a different tool.

When 1M earns its keep:

- Reading a giant codebase to plan a refactor.
- Cross-referencing a long protocol document (a 200-page CAP PDF, a full clinical guideline) against your extraction code.
- A multi-hour analysis session where you can't tolerate auto-compacts dropping detail.

When it doesn't:

- Daily prompt iteration. 200K is plenty.
- Quick fixes. You'll never get past 5%.
- Batch jobs over thousands of small inputs. Haiku in CLI mode is cheaper.

> ⚠️ **Warning.** A bigger context isn't a substitute for a clean context. Bad signal at 1M is worse than good signal at 200K. Don't reach for the big context as a way to avoid thinking.

## A KHCC Walkthrough: 200 Pathology Notes

You're running a pathology extraction over 200 notes. Each note is 1–3 pages. You're iterating on the prompt as you go.

Here's the rhythm.

**Note 1–10:** Iterate freely. Look at outputs, tweak the prompt, re-run. Context fills with examples and failure modes. This is good. You want it in context while you're tuning.

**Around note 30 (green bar yellow):** Run `/compact focus on the prompt iterations and the three remaining failure modes`. Drop the raw note text and the successful extractions. Keep what matters for further tuning.

**Note 60 (you've nailed the prompt):** `/clear`. The prompt is now stable, lives in a file, and you don't need the tuning history anymore. Start fresh for the bulk run.

**Bulk run, notes 1–200:** Don't do this conversationally. This is a CLI-mode (`claude -p`) job. The 200 notes don't belong in your interactive context window at all. Each note gets its own invocation, its own clean context. (More on this in Chapter 16.)

**If extractions start drifting halfway through:** You're not seeing context rot. There is no context. Each note is fresh. If quality drops, it's the prompt or the model. Not memory.

> 🧠 **Remember.** Long batches don't belong in interactive context. Interactive context is for *tuning*. CLI mode is for *running*. Mixing them is the single most common waste of money I see.



## When to Start a Brand New Session

A new session (just close Claude and run `claude` again, or `/clear` if you want to stay in place) is the right move when:

- You're switching projects or repos.
- You're switching tasks that share no files.
- The conversation has been wrong twice in a row.
- The green bar has been yellow for a while and a guided compact would lose too much.
- You want to test "is this a context problem or a real bug?" Clearing is the diagnostic.

> 💡 **Tip.** When you finish a chunk of work, take 60 seconds to write what you accomplished into a markdown file in the repo *before* you clear. Future-you will be able to resume by reading the file. Don't rely on the chat to remember.

## Try This

1. Open a long-running Claude Code session. Run `/compact focus on [the thing you care about]` and read the summary. Notice what survived and what didn't.
2. Make Claude do something wrong on purpose ("change this file to break the import"). Then Esc-Esc and roll it back. Confirm the file is restored without touching git.
3. Switch to 1M context with `/model opus[1m]`. Run `/cost` (we'll dig into this next chapter) and compare. Decide whether the extra capacity is worth the price for what you're doing.
4. Next time you catch yourself on a third "actually, the problem is..." correction, stop, `/clear`, and write a sharper prompt. Notice how much faster the third attempt resolves than it would have on the polluted context.

## Watch Out

- **Don't ignore the green bar.** Yellow is your cue to compact. Red is your cue to be embarrassed you didn't compact already.
- **Don't `/compact` without a focus hint.** Unguided summaries lose the thing you actually cared about.
- **Don't run batch jobs in interactive context.** That's what CLI mode is for. Mixing them wastes money.
- **Don't rely on the chat as memory.** Anything you'll need tomorrow goes in a file. The chat is short-term memory only.
- **Don't switch to 1M context as a band-aid.** A bigger room doesn't clean itself. Compact and clear first.
