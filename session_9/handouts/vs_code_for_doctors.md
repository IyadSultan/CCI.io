# 📘 VS Code for Doctors — Reference Guide

A printable cheat sheet to keep beside your laptop.

---

## Chapter 1 — General

VS Code is a free, lightweight code editor from Microsoft. A "workspace" is just a folder you opened with **File → Open Folder**. Everything you do — files, terminal, git, debugging — happens inside that folder.

**Five shortcuts to memorize:**

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+P` (`Cmd+Shift+P`) | Command palette — does everything |
| `Ctrl+P` | Quick-open any file by name |
| `` Ctrl+` `` | Toggle integrated terminal |
| `Ctrl+B` | Toggle file sidebar |
| `Ctrl+Shift+G` | Source control (git) panel |

**Useful menus:** the bottom status bar shows the active Python interpreter, current git branch, and any open ports — click any of them to switch. Sign in to **Settings Sync** (gear icon → Backup and Sync) so your settings follow you between machines.

---

## Chapter 2 — Terminal

The integrated terminal is your system shell, just docked. Open it with `` Ctrl+` ``. The prompt should always show your project folder.

**The eight commands you'll use 90% of the time:**

| Command | What it does |
|---|---|
| `pwd` | Print working directory — where am I? |
| `ls` (`dir` on Windows) | List files in this folder |
| `cd folder/` | Change into a folder |
| `cd ..` | Go up one folder |
| `python -m venv .venv` | Create a virtual environment |
| `source .venv/bin/activate` (Mac/Linux) / `.venv\Scripts\activate` (Windows) | Activate the venv |
| `pip install -r requirements.txt` | Install project dependencies |
| `python app.py` | Run a Python script |

**If something doesn't work:** check the prompt — does it show `(.venv)`? If not, the venv isn't active and `pip` is installing to the wrong Python. Run `which python` (Mac/Linux) or `where python` (Windows) to confirm.

---

## Chapter 3 — Git

Git tracks changes to files. GitHub is a website that stores git repos. They are not the same thing.

**The mental model:**

```
Working directory  →  Staging area  →  Local commit  →  Remote (GitHub)
       (edit)            (git add)      (git commit)       (git push)
```

**The commands you'll actually type:**

| Command | When |
|---|---|
| `git status` | At least 10 times a day. Always your first move when confused. |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Snapshot the staged changes |
| `git push` | Send your commits to GitHub |
| `git pull` | Get other people's commits from GitHub |
| `git log --oneline` | See history, one line per commit |
| `git diff` | See what you changed since the last commit |
| `git checkout -- file` | Throw away unsaved changes to a file |

**Authentication options:**

- **HTTPS + Personal Access Token (easiest):** github.com → Settings → Developer settings → Personal access tokens. Use the token as your password when git prompts.
- **SSH key (cleaner long-term):** `ssh-keygen -t ed25519 -C "you@khcc.jo"`, then add the `.pub` file at github.com/settings/keys.
- **GitHub CLI (`gh auth login`):** one command, handles everything. Recommended for new students.

**Undoing things — the cheat sheet:**

| You want to... | Run this |
|---|---|
| Discard changes to a file you haven't staged | `git checkout -- filename` |
| Unstage a file you `git add`-ed | `git restore --staged filename` |
| Undo your last commit but keep the changes | `git reset --soft HEAD~1` |
| Throw away the last commit entirely | `git reset --hard HEAD~1` (⚠️ destructive) |
| Fix the message of your last commit | `git commit --amend -m "new message"` |

**Golden rule:** if you've already pushed to a shared branch, **don't** rewrite history. Make a new commit that fixes the problem instead.

---

## Chapter 4 — Extensions

The Extensions panel (`Ctrl+Shift+X`) is where VS Code becomes powerful. Install only what you need — every extension slows VS Code down slightly.

**Must-have for every CCI student:**

| Extension | Why |
|---|---|
| Python (Microsoft) | Language support, debugging |
| Pylance | Fast IntelliSense and type checking |
| Jupyter | Notebooks inside VS Code |
| GitLens | Line-by-line git blame, history visualization |
| Rainbow CSV | Readable columns in CSV/TSV — huge for clinical data |
| Error Lens | Inline error messages right next to your code |
| DotENV | Syntax highlighting for `.env` files |
| Code Spell Checker | Catches typos in prompts, docstrings, SQL |

**SQL and database work:**

| Extension | Why |
|---|---|
| SQLite Viewer | Open `.db` files directly in VS Code |
| SQL Server (mssql) | Connect to AIDI-DB without leaving the editor |
| Databricks (official) | Run notebooks against the KHCC workspace |

**LLM and AI coding:**

| Extension | Why |
|---|---|
| Claude (Claude Code for VS Code) | Anthropic's agentic coding inside VS Code |
| GitHub Copilot | In-editor completions and chat |
| REST Client or Thunder Client | Test Azure OpenAI endpoints without `curl` |

**Quality of life:**

| Extension | Why |
|---|---|
| Markdown All in One | Live preview, TOC generation for `README.md` |
| indent-rainbow | Spot Python indentation bugs at a glance |
| Mermaid Preview | Render LangGraph state diagrams in Markdown |

**Later, when you cover deployment:** install **Docker**, **Azure Account**, **Azure Resources**. Skip them for now.

**How to share a curated list with your team:** create `.vscode/extensions.json` in your repo:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-toolsai.jupyter",
    "eamodio.gitlens",
    "mechatroner.rainbow-csv",
    "usernamehw.errorlens",
    "mikestead.dotenv",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

Anyone who opens the repo is prompted to install all of them at once.

---

## Chapter 5 — Repo Structure

A clean Python project at KHCC follows this minimum shape. Every file has a purpose; no clutter.

```
my-project/
├── .venv/                  ← Local virtual environment (never committed)
├── .gitignore              ← What git should ignore
├── .env                    ← Your secrets (never committed)
├── .env.example            ← Template showing what variables to set
├── README.md               ← How to install and run
├── requirements.txt        ← Python dependencies
├── app.py                  ← Entry point (or main.py)
├── src/                    ← Larger projects: put modules here
│   ├── __init__.py
│   ├── extraction.py
│   └── database.py
├── data/                   ← Local data (usually .gitignored)
├── notebooks/              ← Exploratory Jupyter work
└── tests/                  ← Pytest tests
```

**The five files every project must have:**

| File | What it does | Commit? |
|---|---|---|
| `README.md` | What is this, how do I run it | ✅ |
| `requirements.txt` | Exact dependencies to reproduce | ✅ |
| `.gitignore` | What git should ignore | ✅ |
| `.env.example` | Shape of the secrets your project needs | ✅ |
| `.env` | Actual secret values | ❌ NEVER |

**Naming conventions:**

- Folders and files: lowercase with underscores (`patient_extractor.py`), not CamelCase
- One module = one responsibility (one file for DB access, one for the LLM call, one for the UI)
- Avoid `utils.py` — it always becomes a junk drawer. Name files by what they do.

**Final habit:** when you finish a project, run `pip freeze > requirements.txt` so anyone — including future you — can reproduce your environment exactly. Future you will thank present you.
