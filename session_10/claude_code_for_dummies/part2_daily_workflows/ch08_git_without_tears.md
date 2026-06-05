# Chapter 8: Git Without Tears

If you've ever rage-quit a `git rebase`, this chapter is for you. Claude Code can handle most of the git plumbing you used to dread, leaving you to do the part that actually requires a human: reading the diff.

## What Claude Does on Your Behalf

Out of the box, Claude Code knows git. Ask it to:

- Stage files.
- Write a commit message.
- Commit.
- Push.
- Pull.
- Branch.
- Diff.
- Show recent history.
- Open a PR.

...and it does, by running the same `git` commands you'd type, in the same shell. No magic. No proprietary wrapper. Just `git` through the Bash tool.

```
Stage the changes in @notebooks/aki_extraction.py and write
a commit message that explains why the baseline computation
changed.
```

Claude will run `git diff`, read the change, draft a commit message that actually reflects the diff, then `git add` and `git commit`. You review the message before it commits. Claude shows you the diff and the proposed message in the same turn.

> 🧠 **Remember.** Claude doesn't know your repo's *intent*. It knows the diff. The commit message it writes is only as good as the diff explains itself. If your change is half-finished and Claude writes a vague message, the right fix is finishing the change, not retitling the commit.

## The Commit Message Habit

Bad commit messages are a project-wide tax. "fix bug." "update code." "wip." Six months from now, when you're tracing why the AKI alerts started double-counting, those commits are useless.

Claude writes better commit messages than most humans, *if* you let it look at the diff. The recipe:

```
Look at the staged diff. Write a commit message that
follows our convention (subject under 70 chars, body
explaining the why, not the what). Don't commit yet — show
me the message first.
```

Claude shows you the message. You read it. You either say "good, commit" or you tweak the message and *then* commit.

> 💡 **Tip.** Put your commit-message style in `CLAUDE.md` once. "Use conventional commits. Subject under 70 chars. Body wraps at 72. Explain the why." Claude will follow it forever after.

## `gh` Is the PR Friend

For anything that touches GitHub (pull requests, issues, reviews, releases), Claude Code prefers the **`gh` CLI** over any MCP integration.

Why? Two reasons:

1. **Context efficiency.** `gh` returns clean, scoped text. A GitHub MCP server returns a lot of metadata you didn't ask for, and that metadata lands in your context window.
2. **It's already on every developer's laptop.** `gh` is GitHub's official CLI. If you have git, you can have `gh`.

```
gh pr create --title "fix: baseline creatinine null for K-prefix MRNs" --body "..."
```

Claude will run that for you. You don't memorize the flags.

> 🔧 **Technical Stuff.** If you have a GitHub MCP server installed *and* `gh` available, Claude tends to reach for `gh` first because it's lighter. You can pin this behavior in `CLAUDE.md`: "For GitHub operations, always prefer `gh` over MCP."

## Opening a PR

The whole flow, in one prompt:

```
Push the current branch, open a PR against main, and write
a description that summarizes the three commits I just
made. Title under 70 chars. Don't mark it ready yet —
open it as draft.
```

Claude will:

1. `git push -u origin <branch>` (set upstream if needed).
2. `git log main..HEAD` to read the commits.
3. `gh pr create --draft --title "..." --body "..."` with a body that actually reflects what changed.

You review the PR URL in the terminal, click it in your browser, and finish the description if needed.

> 💡 **Tip.** Ask Claude to include a "Test plan" checklist in the PR body. Even on solo projects, future-you appreciates the breadcrumbs.

## Reviewing the Diff Before You Approve

This is the load-bearing habit of working with an AI on git.

**Always read the diff before you say "commit."**

```
Show me the diff for the staged changes before we commit.
```

Claude prints `git diff --staged`. You read it. You catch:

- The print statement Claude left in for debugging.
- The unrelated whitespace change that crept into a file Claude was just supposed to read.
- The hardcoded path that should have been a variable.

If you don't review, none of those land in CI. They land in `main`. And then you spend Friday afternoon reverting.

> ⚠️ **Warning.** It is faster to read a diff than to revert a commit. Always. No exceptions.

## The Checkpoint System (and Why Git Still Matters)

Claude Code has its own session-level checkpoint system: every file edit creates a local snapshot, and `/rewind` (or Esc-Esc) lets you roll back without touching git. We covered this in Chapter 6.

But checkpoints are **local, session-scoped, and ephemeral**. They live in your `~/.claude` directory. They go away.

Git is the *durable* record. Checkpoints are for "oh god, undo the last fifteen minutes." Git is for "this work needs to survive a laptop crash and be reviewable by my team six months from now."

> 🧠 **Remember.** Checkpoint first, commit second. Use checkpoints liberally (they cost you nothing). Use commits deliberately (each one is a permanent record).

## Worktrees: A Coming Attraction

Git has a feature called **worktrees**: multiple working directories sharing the same repository, so you can have feature-A checked out in one folder and feature-B in another, simultaneously, no stashing.

Claude Code leans into this hard. You can have one Claude session refactoring the AKI pipeline in `aidi-extractions-feature-aki/`, another writing tests in `aidi-extractions-tests/`, and a third reviewing a teammate's PR in `aidi-extractions-review/` — all backed by the same git repo, none of them stepping on each other.

We give worktrees their own chapter later (Chapter 17). For now, just know they exist, and that they're the right answer when you find yourself wanting to "pause this and try something else without losing my place."

## The Two Rules About Force and Amend

There are two git operations Claude Code will *not* do unless you explicitly ask:

- **`git commit --amend`**: rewriting the previous commit. If the previous commit was pushed and shared, amend rewrites history and breaks teammates' clones.
- **`git push --force`** (and `--force-with-lease`): rewriting the remote branch's history. Same problem, bigger blast radius.

Claude will warn you if you ask for either. On a shared branch (especially `main`), it will push back. You can override, but you have to mean it.

> ⚠️ **Warning.** `git push --force` to `main` has ended careers. Don't ask Claude to do it. If you must rewrite shared history, do it yourself, slowly, with the team watching.

Similarly:

- **`--no-verify`** (skipping pre-commit hooks): Claude won't do it unless you ask. Pre-commit hooks exist for a reason. If a hook is failing, fix the underlying problem, don't bypass.

## A KHCC Walkthrough: A Clinician's Git Day on aidi-extractions

You start the morning with a bug report: the chemo prep extractor is missing the protocol name for cyclophosphamide-based regimens. You open Claude Code.

```
/clear

Open @notebooks/chemo_prep_extractor.py. There's a bug:
cyclophosphamide protocols are returning null for protocol_name.
Find the cause, fix it, and explain what you changed.
```

Claude reads the file, finds the regex that misses "cyclo-" prefixed names, proposes a fix, and shows the diff. You read the diff. It's clean: one line of regex, one line in the test case. You approve.

```
Stage the change. Show me the proposed commit message.
```

Claude proposes:

```
fix(chemo): handle cyclo-prefixed protocol names

The protocol-name extractor regex required a word boundary
that excluded hyphen-prefixed variants like "cyclo-CHOP".
Loosened the boundary and added a unit test for the variant.
```

You approve. Claude commits.

```
Run the test suite.
```

Claude runs `pytest tests/test_chemo_prep.py`, all green.

```
Push the branch and open a draft PR against main. Title
under 70 chars. Include a test plan with three boxes:
unit tests pass, eval cohort re-run, downstream alert
volume check.
```

Claude pushes, runs `gh pr create --draft`, prints the URL. You click. You review. You toggle the PR to "ready for review." You go get coffee.

Total time: about eight minutes. Time you spent on git plumbing: zero. Time you spent reading the diff and judging the change: about three minutes. That's the right ratio.

> 🧠 **Remember.** You are the reviewer. Claude is the typist. Don't reverse those roles.

## Try This

1. In any repo, make a small change (a typo fix in a comment, even). Ask Claude to stage, write a commit message, and show you the message before committing. Read the message. Edit if needed. Commit.
2. Open a draft PR with Claude. Read the body Claude wrote and compare to what you would have written. Note which is more useful.
3. Run `gh pr list` through Claude and ask for a summary of open PRs in a repo you care about. Notice how clean the output is compared to clicking through GitHub's UI.
4. Practice the discipline: every time Claude proposes a commit, *read the diff first*. Build the muscle.

## Watch Out

- **Don't trust commit messages without reading the diff.** Claude writes good messages, but the message reflects the diff, not the intent. If the diff is wrong, the message is confidently wrong.
- **Don't `--force` push, ever, on a shared branch.** If Claude proposes it, push back.
- **Don't `--no-verify` to skip a failing hook.** Fix the hook's complaint.
- **Don't conflate checkpoints with commits.** Checkpoints rescue you mid-session. Commits are the durable record. You need both.
- **Don't let Claude do git on a repo you haven't backed up.** First-time use, on a non-toy repo: have a remote, push often. Git is your safety net only if it actually exists.
