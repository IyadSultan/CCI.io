---
layout: page
title: "Lesson 3: Git + GitHub from VS Code"
permalink: /session_9/instructions/lesson3_git_github/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #1565C0!important}.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#BBDEFB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-09/">&#8249; Back to Session 9</a>

# CCI Session 9 — Lesson 3: Git + GitHub from VS Code

**Estimated time:** 25 minutes (10 min content / 15 min lab)
**Lab mode:** Guided step-by-step (local laptop + github.com)

---

## Instructor Introduction

Git tracks every change you make. GitHub is just a place where git repos live online. Most of you have seen the buttons in VS Code already -- the little branch icon in the sidebar, the blue "Sync Changes" button at the bottom -- but today I want you to understand the mental model. Because when something breaks, and it will, you need to know what the buttons are actually doing. Once you understand the four states a file moves through (working directory, staged, committed, pushed) and the three commands behind every button (`git add`, `git commit`, `git push`), the GUI becomes a convenience rather than a magic spell. We'll initialize a repo locally, make our first commit, and then push it to a brand-new GitHub repository.

---

## NotebookLM Summary

Git is a content-addressed snapshot system, but the practical mental model is four locations a file can live in. The **working directory** is the folder on disk -- when you edit `app.py`, the change exists only here. The **staging area** (also called the index) is a list of changes you have told git you want to include in the next commit -- you put files here with `git add`. A **commit** is a permanent, named snapshot of the staging area, created with `git commit -m "message"`. Finally, **push** copies your local commits up to GitHub. Every button in the VS Code Source Control panel maps directly to one of these transitions: the `+` icon next to a file runs `git add`, the checkmark with a message runs `git commit`, and the "Sync Changes" or cloud-arrow button runs `git push`. The single most useful command is `git status`, which prints exactly what is in each of these locations right now -- if you only memorize one command, memorize that one.

The lesson splits into two halves. **Part A is local**: initialize a repo with `git init`, configure your identity once per machine with `git config --global user.name "Your Name"` and `git config --global user.email "you@khcc.jo"`, then open the Source Control panel with `Ctrl+Shift+G`. Before you stage anything, do the pre-flight check: scroll through the Changes list and confirm `.venv/` is NOT there -- if it is, your `.gitignore` from Lesson 2 is wrong or missing. Once the list looks right, click the `+` next to "Changes" to stage everything, write a short commit message like "Initial project setup", and press `Ctrl+Enter` to commit. Run `git log` in the terminal and you should see exactly one commit with your name and email on it.

**Part B connects to GitHub**: go to github.com, click **New repository**, give it the same name as your folder, and critically do NOT tick "Initialize with a README" -- that would create a conflicting initial commit. GitHub then shows a code snippet for an existing local repo; copy the three lines that start with `git remote add origin`, then `git branch -M main`, then `git push -u origin main`. The first push will prompt for authentication. VS Code usually opens a browser window for sign-in; if that fails, generate a **Personal Access Token** at Settings -> Developer settings -> Personal access tokens -> Generate new token (classic), tick the `repo` scope, and paste the token as the password.

Common pitfalls to recognize from the error message alone: **"Permission denied (publickey)"** means git is trying SSH but you have no SSH key configured -- the easiest fix is to switch the remote to HTTPS with `git remote set-url origin https://github.com/USER/REPO.git`. **"Remote origin already exists"** means you ran `git remote add` twice -- use `git remote set-url origin <new-url>` to replace it. **"Updates were rejected because the remote contains work you do not have locally"** means GitHub has a commit (usually because you ticked the README box) that you don't -- run `git pull --rebase` then push again.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the Pro Git book chapter on basics, and generate an *Audio Overview* focused on the four-state mental model.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Install:** Git for Windows or confirm `git --version` works on Mac/Linux: <https://git-scm.com/downloads>
- **Create:** A free GitHub account if you do not have one already, using your KHCC or personal email: <https://github.com/signup>
- **Read:** Pro Git Book, Chapter 2.1 and 2.2 (Getting a Git Repository, Recording Changes): <https://git-scm.com/book/en/v2>
- **Warm-up question:** What is the difference between saving a file in VS Code (`Ctrl+S`), staging a file in git, and committing it? Write one sentence for each and bring them to class.

### During Class -- What to Focus On

1. **The four states** -- working directory, staged, committed, pushed. Every button in the Source Control panel moves a file between two of these.
2. **`git status` is your truth source** -- run it before and after every git action until the mental model is solid.
3. **Pre-flight check before staging** -- the Changes list in the Source Control panel must NOT contain `.venv/`, `.env`, `__pycache__/`, or `*.db`. If it does, your `.gitignore` is broken.
4. **Authentication on first push** -- browser sign-in is easiest. Personal Access Token (classic, `repo` scope) is the reliable fallback.

**Common traps:**

- Ticking "Initialize this repository with a README" on GitHub when creating the remote -- creates a phantom commit that blocks your first push.
- Committing the `.venv` folder by accident because you forgot `.gitignore`. Fix: `git rm -r --cached .venv` then commit and push.
- Configuring `user.email` to something that does not match your GitHub account -- commits will not be attributed to you on the GitHub UI.

### After Class -- Practice & Lab Work

**Lab work (required):**

**Part A -- Local repo:**

1. In your `crcl-app` folder terminal, run `git init`.
2. Configure identity (once per machine): `git config --global user.name "Your Name"` and `git config --global user.email "you@khcc.jo"`.
3. Open the Source Control panel with `Ctrl+Shift+G`. Pre-flight: confirm `.venv/`, `.env`, and `__pycache__/` do NOT appear.
4. Click `+` next to "Changes" to stage everything. Type the commit message "Initial project setup" in the box. Press `Ctrl+Enter`.
5. Run `git log` in the terminal -- confirm one commit with your name.

**Part B -- Push to GitHub:**

6. On github.com, click **New repository**. Name it `crcl-app`. Public. **Do NOT tick "Initialize with a README"**. Create repository.
7. Copy the three commands GitHub shows under "...or push an existing repository". Run them in your terminal.
8. When prompted for authentication, sign in via browser or paste a Personal Access Token. Refresh github.com and confirm your files are there.

**Extra practice (optional):**

- Make a small edit to `README.md`, then watch the Source Control panel update in real time. Stage, commit, push. See the new commit appear on GitHub.
- Read about `.gitignore` precedence rules: <https://git-scm.com/docs/gitignore>

**Self-check questions:**

1. What are the four states a file can be in, and which git command moves it between each pair?
2. Why is `git status` more useful than the Source Control panel when something goes wrong?
3. What is the difference between a Personal Access Token and your GitHub password, and why do modern workflows use the token?

### Resources

| Resource | Link |
|----------|------|
| Pro Git Book (Free, Official) | <https://git-scm.com/book/en/v2> |
| VS Code Source Control Guide | <https://code.visualstudio.com/docs/sourcecontrol/overview> |
| GitHub -- Creating a Repo | <https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository> |
| GitHub -- Personal Access Tokens | <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens> |
| Git Cheat Sheet (GitHub) | <https://education.github.com/git-cheat-sheet-education.pdf> |
| Oh Shit, Git!?! (Recovery) | <https://ohshitgit.com/> |
