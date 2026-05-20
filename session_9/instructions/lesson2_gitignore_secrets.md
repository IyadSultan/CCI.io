# CCI Session 9 -- Lesson 2: .gitignore and the Secrets Mindset

**Estimated time:** 15 minutes (8 min content / 7 min lab)
**Lab mode:** Guided step-by-step (local laptop)

---

## Instructor Introduction

This is the most important 15 minutes of today. We're going to talk about what NOT to share. Every week, somewhere in the world, a clinician leaks an API key or a patient list to GitHub. Some of you will work with PHI eventually -- MRNs, names, pathology reports -- and the same instinct that protects an OpenAI key protects a patient identifier. Let's build the habit now, on a project where the stakes are zero, so that when you are working with real KHCC data the reflex is already there. By the end of this lesson you will know the three-file pattern (`.env`, `.env.example`, `.gitignore`), why a leaked secret is forever even after you "delete" the commit, and how `python-dotenv` loads secrets at runtime without ever putting them on disk in your repo.

---

## NotebookLM Summary

Git, by default, tracks every file in your project folder. That is a feature for source code and a disaster for secrets. The `.gitignore` file is a plain-text list of patterns that tells git "ignore these forever" -- the moment you create one with `.venv/`, `__pycache__/`, `*.pyc`, `.env`, `.DS_Store`, `*.db`, and `data/`, those paths are invisible to git status, git add, and git commit. The order matters: create `.gitignore` before your first commit, so the secret files never enter the history in the first place.

The pattern used in every serious Python project is three files working together. The first is `.env`, a key-value file that holds your real secrets like `OPENAI_API_KEY=sk-...`. This file is listed in `.gitignore` and never enters the repository. The second is `.env.example`, which contains the same keys with empty or placeholder values like `OPENAI_API_KEY=your-key-here`. This file IS committed, because it documents the shape of the environment any new contributor needs to set up. The third is `.gitignore` itself, which is also committed. A new developer cloning your repo reads `.env.example`, makes a copy named `.env`, fills in their own keys, and is up and running -- without your secrets ever touching their machine.

The reason this matters is irreversibility. Secrets pushed to GitHub live forever. Even after you delete the file, force-push to rewrite history, or make the repo private, scraper bots that index GitHub in real time have already cloned the commit. Within minutes, a leaked OpenAI key is being used to mine cryptocurrency on your bill. The correct response when you leak a secret is not to try to delete the commit -- it is to immediately rotate the key in the provider's dashboard and assume the old one is compromised. A live demo searching GitHub for `sk-` returns thousands of active keys that scrapers have already harvested.

Loading secrets in Python uses the `python-dotenv` library. At the top of your script you call `from dotenv import load_dotenv` and then `load_dotenv()`, which reads `.env` and copies its values into the process environment. From then on you retrieve them with `os.getenv("OPENAI_API_KEY")` exactly as if they had been set in your shell. The mental rule that prevents 99 percent of leaks is simple: if a file contains anything you wouldn't print in a journal article, it goes in `.gitignore`. MRNs, patient lists, API keys, internal hostnames, database dumps -- all of them.

Example `.gitignore` for a Python project:

```
.venv/
__pycache__/
*.pyc
.env
.DS_Store
*.db
data/
```

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the GitHub secret scanning documentation, and generate an *Audio Overview* covering the "what to do when you leak" workflow.

---

## Student Study Guide

### Before Class -- Preparation (10-15 min)

- **Read:** GitHub guide on removing sensitive data: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository>
- **Skim:** The `python-dotenv` README: <https://github.com/theskumar/python-dotenv>
- **Warm-up question:** If you accidentally commit `OPENAI_API_KEY=sk-real-key-here` and immediately delete the file and commit again, is the key safe? Why or why not? Write a one-sentence answer and bring it to class.

### During Class -- What to Focus On

1. **The three-file pattern** -- `.env` (real, ignored), `.env.example` (shape, committed), `.gitignore` (the rule, committed).
2. **Order of operations** -- create `.gitignore` before your first `git add .`. If you stage `.env` before adding it to `.gitignore`, git will keep tracking it.
3. **Loading at runtime** -- `load_dotenv()` reads `.env` into environment variables; your code calls `os.getenv("KEY_NAME")`. No secrets in source.
4. **Rotation, not deletion** -- if a secret leaks, rotate immediately in the provider dashboard. Do not try to "git delete" it away.

**Common traps:**

- Adding `.env` to `.gitignore` AFTER you have already committed it. The fix is `git rm --cached .env`, then commit the removal -- but the secret is still in the history and must be rotated.
- Putting `.env.example` in `.gitignore` -- the example file is meant to be committed.
- Hardcoding a key in `app.py` "just for testing" and forgetting to remove it before the push.

### After Class -- Practice & Lab Work

**Lab work (required):**

1. In your `crcl-app` folder, create `.gitignore` with the seven lines from the summary above.
2. Create `.env` with one fake key like `OPENAI_API_KEY=sk-fake-not-real`.
3. Create `.env.example` with `OPENAI_API_KEY=your-key-here`.
4. In a small `test_env.py` script: `from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv("OPENAI_API_KEY"))`. Run it and confirm it prints the fake key.
5. Run `git init` then `git status`. Confirm `.env` does NOT appear in the file list and `.env.example` DOES.
6. Search GitHub for `OPENAI_API_KEY=sk-` (in class, with the instructor). Note how many results return.

**Extra practice (optional):**

- Read about GitHub's secret scanning and push protection: <https://docs.github.com/en/code-security/secret-scanning>
- Try to push a fake key that starts with `sk-proj-` to a public test repo. GitHub will block the push -- read the warning carefully.

**Self-check questions:**

1. Which two files in the three-file pattern are committed, and which one is ignored?
2. Why is rotating a leaked key the correct response rather than rewriting git history?
3. What does `load_dotenv()` actually do under the hood, and why is `os.getenv()` safe in committed code?

### Resources

| Resource | Link |
|----------|------|
| python-dotenv README | <https://github.com/theskumar/python-dotenv> |
| GitHub -- Removing Sensitive Data | <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository> |
| GitHub Secret Scanning | <https://docs.github.com/en/code-security/secret-scanning> |
| gitignore.io -- Templates | <https://www.toptal.com/developers/gitignore> |
| OWASP -- Secrets Management Cheat Sheet | <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html> |
| OpenAI -- Best Practices for API Keys | <https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety> |
