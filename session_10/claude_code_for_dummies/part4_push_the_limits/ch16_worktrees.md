# Chapter 16: Worktrees and Parallel Claudes

You're halfway through a prompt-tuning session on the pathology extractor when the chemotherapy dashboard catches fire and an analyst asks you to look at the AKI cohort SQL "real quick." Three tasks, one repo, one Claude. Somewhere in the next ten minutes you will paste the wrong file into the wrong context and waste an hour. Git worktrees are how you stop doing that.

## What a Worktree Actually Is

A **git worktree** is a feature git has had since version 2.5, and almost nobody uses. It lets one git repository have *multiple working directories* at once, each checked out to a different branch, sharing the same `.git/` object store underneath.

In plain terms: instead of `git checkout feature-auth` (which destroys your current uncommitted state on `main`), you run `git worktree add ../aidi-feature-auth feature-auth` and now you have a second folder on disk, with the same repo, on a different branch, that you can open in a second terminal. Two folders. Two branches. One repo. Zero conflicts.

> 🧠 **Remember.** A worktree is not a clone. Cloning duplicates history, takes minutes, and loses your local config. A worktree is instant, shares all history, and is meant to be thrown away.

## Why This Matters for Claude Code

Claude Code, by default, operates in whatever directory you launched it from. One terminal, one Claude, one branch. If you open a second terminal and run `claude` in the same folder, you now have two Claudes editing the same files: a race condition with opinions.

Worktrees fix it cleanly. One worktree per task = one Claude per task = no interference.

## The `--worktree` Flag

Claude Code has a built-in shortcut for the whole flow:

```bash
claude --worktree feature-auth
```

or the short form:

```bash
claude -w feature-auth
```

This does three things in one shot:

1. Creates a new git worktree in a sibling directory.
2. Checks out (or creates) the branch `feature-auth`.
3. Launches Claude with that worktree as its working directory.

When you exit that Claude session, if the worktree has **no uncommitted changes and no new commits**, it gets cleaned up automatically: the directory removed, the branch left intact if it had commits, deleted if it didn't. If you made changes, the worktree stays around until you deal with it manually.

> 💡 **Tip.** `git worktree list` shows every worktree currently attached to the repo. `git worktree remove <path>` cleans one up. `git worktree prune` cleans up references to worktrees whose directories you deleted manually.

## Three Terminals, Three Claudes

The real power move: open three terminals. In each one, launch Claude with a different worktree.

```bash
# Terminal 1
claude -w aki-cohort-sql

# Terminal 2
claude -w pathology-prompt-tweak

# Terminal 3
claude -w dashboard-refactor
```

Three Claudes, three branches, three working directories. They cannot step on each other because they are literally in different folders. You can task each one and rotate attention between them as they think.

> 🔧 **Technical Stuff.** Each worktree gets its own untracked-file state and its own `.claude/` configuration if you set one per-worktree. Hooks, slash commands, and skills inherit from the user-scope configuration; project-scope `CLAUDE.md` is shared because it lives in the tracked tree. This is usually what you want.

## Subagents Get Their Own Worktrees Automatically

This is the under-advertised feature. When Claude spawns a subagent (Chapter 13), the subagent runs in *its own* worktree by default. So if your main Claude delegates "refactor the lab-reconciliation pipeline" to a subagent, that subagent gets a clean worktree, does its work, and reports back the diff, without ever touching the file you're editing in the main session.

This is why agent teams (Chapter 13) actually work in practice. Five subagents would be chaos if they all wrote to the same directory. Five worktrees, one per subagent, is just five normal Claude sessions running in parallel.

> 🧠 **Remember.** Worktrees are what make parallel Claude work safe. Without them, "two agents on one repo" is a foot-gun. With them, it's a force multiplier.

## When to Use a Worktree (and When Not To)

**Use a worktree when:**

- You have two or more genuinely independent tasks and want them in parallel.
- You're starting an experiment you might throw away and don't want to pollute your main branch.
- You're doing a long-running refactor on one branch and need to ship a hotfix on another.
- You're running a Ralph loop (Chapter 18) overnight on one task and want to keep working on another in the morning.

**Don't bother when:**

- The task is a one-line fix. Worktree setup is faster than your terminal startup, but `git stash` is still faster.
- You're exploring a single repo with no intent to branch. Just use `main`.
- You're new to git and worktrees feel confusing. Get fluent with branches first; worktrees will make sense the moment branching does.

> ⚠️ **Warning.** A worktree is a real directory on disk with real uncommitted changes. If you delete a worktree directory manually (`rm -rf`) while it has uncommitted work, that work is gone. Use `git worktree remove` instead; it refuses to delete dirty worktrees.

## Merging Back

When a worktree's work is ready to land, the flow is unremarkable:

```bash
cd ../aidi-feature-auth      # the worktree
git push -u origin feature-auth
gh pr create                 # if you use GitHub
# or merge locally:
cd ../aidi                   # back to main worktree
git merge feature-auth
git worktree remove ../aidi-feature-auth
git branch -d feature-auth   # if you're done with the branch
```

Same as branches you'd merge any other way. The only worktree-specific step is the cleanup at the end.

## The KHCC Example

It's Tuesday afternoon. You have three things on your plate:

1. **New AKI cohort SQL.** A surgeon asked for a cohort of post-op AKI cases stratified by procedure type. You haven't written the cohort query yet.
2. **Pathology extraction prompt tweak.** The eval run last night flagged a regression on T-stage extraction for breast cases. Needs a prompt change and a re-run.
3. **Dashboard refactor.** The chemo-prep dashboard's Streamlit code has been on your conscience for two weeks. You want to extract the patient-card component into a reusable widget.

You could try to do all three sequentially. You could try to do them in one Claude session and watch the context window meltdown by task #2. Or:

```bash
claude -w aki-cohort-sql
# Terminal 2:
claude -w path-prompt-fix
# Terminal 3:
claude -w dashboard-refactor
```

Now you have three Claudes thinking in parallel. Claude #1 is reading `aidi-extractions/` to learn the AKI cohort conventions. Claude #2 is loading the frozen deceased-patient eval cohort and looking at the T-stage mismatches. Claude #3 is mapping out the Streamlit component split.

You start them in that order, then circle back to Claude #1 first, review the cohort SQL it drafted, kick off a sample query, then move to Claude #2 while #1 runs. By the end of the afternoon all three branches have draft PRs and you've context-switched between them about six times. None of them touched the other's files. None of them got confused about which branch they were on. None of them had a conflict.

This is what people mean when they say Claude Code multiplies throughput. Not "Claude writes faster than you." Claude doesn't. What multiplies throughput is *three Claudes running while you supervise one at a time*.

> 💡 **Tip.** Name your worktrees the same as the branch they hold. `aki-cohort-sql` (worktree dir) holds branch `aki-cohort-sql`. When you have eight worktrees open and need to remember what each one does, `git worktree list` will read like a to-do list.

## Try This

1. In an existing git repo, run `git worktree add ../experiment experiment-branch`. Open the new directory in your file explorer. Confirm it looks like a normal checkout.
2. In your original repo, edit a file but don't commit. Switch to the worktree. Notice your uncommitted change is **not** there: each worktree has its own working tree state.
3. Now exit and try `claude -w try-worktree`. Make no changes, exit. Confirm the worktree was auto-cleaned.
4. Open three terminals, three worktrees, three tasks. Notice how the cognitive load of "which branch am I on" disappears.

## Watch Out

- **Don't share a worktree across two Claude sessions.** That defeats the whole point. One worktree, one Claude.
- **Don't worktree everything.** Three is a sweet spot. Eight worktrees is eight Claudes you can't supervise.
- **Clean up.** `git worktree list` should not have entries from three months ago. Stale worktrees rot.
- **Auto-cleanup only happens on a clean exit.** If you `kill -9` Claude, the worktree stays. Run `git worktree prune` periodically.
- **CLAUDE.md is shared across worktrees.** A change you make in one worktree's `CLAUDE.md` will appear in the others as soon as you commit and merge. Don't put per-task instructions there.
