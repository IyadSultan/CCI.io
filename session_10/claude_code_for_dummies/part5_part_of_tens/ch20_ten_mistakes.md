# Chapter 20: Ten Rookie Mistakes to Avoid

Most of these were learned by people, including the author, doing the dumb thing first.

## 1. Running `--dangerously-skip-permissions` on Day One

You'll see the `cc` alias trick on Twitter and feel left out. Don't. Boris Cherny, the creator of Claude Code, says he doesn't use it. You don't need to either, at least not until you've spent a week watching what Claude actually wants to do. Pre-approve specific safe commands with `/permissions` instead. The speed gain is 95% as good and the blast radius is 5% as bad.

> ⚠️ **Warning.** "Dangerously skip permissions" is a real thing said by adults who picked the name on purpose. Treat it that way.

## 2. Letting One Conversation Run All Day

You started at 9 AM on the AKI cohort SQL. You drifted to the pathology prompt. You wandered into a Power BI question. It's 4 PM and Claude has started to forget what year you said. This is **context rot**, and it's the silent killer of long sessions.

Use `/clear` between unrelated tasks. After two failed corrections, `/clear` and write a fresh prompt that includes what you just learned. A clean 30-minute session beats a tangled 4-hour one every single time.

## 3. Pasting an Entire CLAUDE.md from Twitter

Somebody on social media shared their 600-line `CLAUDE.md` and you copied the whole thing. Now Claude is following rules for a stack you don't use, in a language you don't write, with style preferences that don't match your team's.

Run `/init`, then **cut the result in half**. Apply the litmus test: "Would Claude make a mistake without this line?" If no, delete it. You have ~150–200 lines of effective compliance budget. Don't burn it on inherited dogma.

## 4. Describing Bugs Instead of Pasting Them

"There's some kind of error with the date column, I think it's not parsing right, the second row looks weird."

Stop. Paste the actual error log. Paste the actual row. Use the `!` prefix:

```
!python scripts/load_vitals.py 2>&1 | head -50
```

Claude doesn't need your interpretation. It needs the data. Abstractions hide the symptom.

## 5. Approving Every Single `npm install` Forever

Six months in, you're still hitting the approve button on `npm test` like a pigeon at Skinner's lab. Every approval interruption costs you flow.

Allowlist the safe stuff in `.claude/settings.json`: `npm test`, `npm run lint`, `pytest`, `pre-commit run`, the `gh` CLI, `git status`, `git diff`. Keep the gates up for `git push`, `npm install`, anything that touches the internet, anything that deletes files. The middle ground is the sweet spot.

## 6. Skipping Plan Mode for Multi-File Changes

You typed "refactor the AKI staging logic to use the new KDIGO 2024 thresholds" and hit enter. Claude immediately started editing three notebooks at once. Forty minutes later, the changes don't pass the eval and you can't tell which file caused the regression.

Use Plan Mode (`Shift+Tab`) for anything structural. Read the plan. Edit it with `Ctrl+G`. *Then* let Claude execute. The 90 seconds you spend reviewing the plan saves you the 90 minutes of un-doing.

> 🧠 **Remember.** "It went and spent 20 minutes confidently solving the wrong problem" is the most common Claude Code failure mode. Plan Mode is the antidote.

## 7. Not Reading the Diff Before You Commit

Claude is fast. The default rhythm is "describe → wait → commit → next." Somewhere in that loop, you stopped looking at the actual code changes.

Always read the diff. `git diff --stat` first to see what changed, then `git diff` on the suspicious files. Claude is good. Claude is not infallible. Boris Cherny says every single line of his last 30 days of work was Claude-written, but he's also the person who built the checkpoint system. He's checking.

## 8. Forgetting the Deny List

You'll add an allowlist on day one. You'll get to the deny list never. Then one day Claude reads your `.env` while answering a config question, the `.env` text lands in the context, and you wonder why nothing feels safe anymore.

`.claude/settings.json` deny rules for `.env`, `*.key`, `secrets/`, `data/patients/`, and anything matching `*.pem`. Claude won't even discover those files. The deny list is non-negotiable for clinical work.

## 9. Treating Subagents Like Magic

You read Chapter 13 and now every task becomes "delegate to a subagent." Suddenly you have five subagents running, you don't remember what each one was for, and the main thread is more confused than it was before.

Subagents are for **self-contained** tasks: "Read these 30 files and summarize what they do." If the task needs back-and-forth with you, keep it on the main thread. If you find yourself coordinating five subagents, you wanted an **agent team**, not a hub of subagents.

## 10. Building Without Tests, Then Asking Claude to "Make It Work"

You wrote 800 lines of cohort SQL. Nothing tests it. You hand it to Claude and say "fix the bugs." Claude makes plausible changes. You can't tell if they're correct. Two days later somebody asks why the deceased-patient count dropped 3%.

Tests are how you let Claude work autonomously. "Refactor auth. Run the test suite. Fix failures before calling it done." That one instruction produces a 2–3× quality improvement. For clinical work, the test is the eval suite. Wire it into a hook so it's automatic.

> 💡 **Tip.** If you can't test it, you can't autonomously refactor it. Investing in the eval suite is investing in your ability to use Claude Code on hard problems.

---

## Try This

Open your current Claude Code project. Check three things, in order:

1. Does `.claude/settings.json` exist? Does it have a deny list?
2. Does `CLAUDE.md` exist? Is it under 200 lines?
3. Is there a test command in the project that Claude knows about (mentioned in `CLAUDE.md` or wired to a hook)?

If any answer is no, fix it before your next session.

## Watch Out

The most expensive mistake on this list isn't a single command. It's *complacency*. The moment you stop reading the diff is the moment Claude starts shipping bugs to production with your name on the commit. Stay in the loop.
