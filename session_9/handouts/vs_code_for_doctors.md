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

> ⚠️ **First thing to do when you open VS Code:** turn on Auto Save — **File → Auto Save** (click it once so a checkmark appears). Without it, VS Code does not save your file until you press `Ctrl+S`, which means Python will keep running the old version of your code and you'll spend 20 minutes debugging a problem that doesn't exist. Turn it on once; it stays on.

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

**Finding the right package name and version — PyPI:**

Before you `pip install` anything, look it up at **[pypi.org](https://pypi.org)**. PyPI (the Python Package Index) is the official registry where every package `pip` downloads from.

| What to check on PyPI | Why it matters |
|---|---|
| **Exact package name** | `pip install scikit-learn` not `sklearn` — the import name and the install name are often different. PyPI shows the correct install name. |
| **Latest stable version** | Shown at the top of every package page. Pin it in `requirements.txt` as `gradio==4.44.0` to prevent surprise upgrades from breaking your app. |
| **Release history** | Click *Release history* to find the version that was current when a colleague's code was written. |
| **Project links** | Every package page links to its GitHub repo and documentation — the fastest way to find usage examples. |

```
# Unpinned — installs whatever is newest today (can break later)
gradio

# Pinned — always installs exactly this version (reproducible)
gradio==4.44.0
python-dotenv==1.0.1
```

> 💡 **Rule of thumb:** use unpinned packages while you're developing and experimenting. Once your app works and you're ready to deploy or share it, run `pip freeze > requirements.txt` to lock every version. Future installations will then be byte-for-byte identical to what you tested.

**Additional commands worth knowing:**

| Command | What it does | Example |
|---|---|---|
| `echo "text"` | Print text to the terminal — or write it into a file | `echo "gradio" > requirements.txt` writes the word gradio into the file; `echo "flask" >> requirements.txt` appends without overwriting |
| `export VAR=value` (Mac/Linux) | Set an environment variable for the current terminal session | `export DEBUG=true` — Python can then read it with `os.getenv("DEBUG")`. Lasts until the terminal closes. |
| `$env:VAR="value"` (Windows PowerShell) | Same as `export` but PowerShell syntax | `$env:DEBUG="true"` |
| `echo $VAR` (Mac/Linux) | Print the current value of an environment variable | `echo $OPENAI_API_KEY` — useful to confirm it was set correctly |
| `echo $env:VAR` (Windows) | Same on PowerShell | `echo $env:OPENAI_API_KEY` |

> 💡 **`export` vs `.env`:** `export` sets a variable only for the current terminal session — it disappears when you close the tab. For persistent secrets that survive restarts, use a `.env` file with `python-dotenv`. Use `export` for quick one-off tests; use `.env` for anything you commit to a workflow.

**Working with files from the terminal:**

| Task | Mac / Linux | Windows (PowerShell) |
|---|---|---|
| **Create an empty file** | `touch README.md` | `New-Item README.md` |
| **Open a file in VS Code** | `code README.md` | `code README.md` |
| **Open the whole folder in VS Code** | `code .` | `code .` |
| **Read / print a file** | `cat requirements.txt` | `Get-Content requirements.txt` |
| **Write a single line to a file** (overwrites) | `echo "gradio" > requirements.txt` | `echo "gradio" > requirements.txt` |
| **Append a line to a file** (keeps existing content) | `echo "python-dotenv" >> requirements.txt` | `echo "python-dotenv" >> requirements.txt` |
| **Write multiple lines at once** | See below | See below |

Writing more than one line at a time — use this pattern in the terminal:

```bash
# Mac / Linux  — type each line, then Ctrl+D to save
cat > .env << 'EOF'
OPENAI_API_KEY=sk-your-key-here
DEBUG=false
EOF

# Windows PowerShell equivalent
@"
OPENAI_API_KEY=sk-your-key-here
DEBUG=false
"@ | Set-Content .env
```

> 💡 **Quickest way to create and edit any file:** type `code filename` in the terminal. VS Code opens the file (creating it if it doesn't exist) and you can type normally. Save with `Ctrl+S`. This is faster than `echo` for anything longer than one line.

---

## Chapter 3 — Git

Git tracks changes to files. GitHub is a website that stores git repos. They are not the same thing.

**The mental model:**

```
Working directory  →  Staging area  →  Local commit  →  Remote (GitHub)
       (edit)            (git add)      (git commit)       (git push)
```

---

**One-time machine setup — do this once, ever:**

Before git can attach your name to any commit, it needs to know who you are. Run these two commands once after installing git — you never need to repeat them on the same machine:

```
git config --global user.name  "Iyad Sultan"
git config --global user.email "iyad.sultan@khcc.jo"
```

Verify it worked:

```
git config --global --list
# user.name=Iyad Sultan
# user.email=iyad.sultan@khcc.jo
```

> ⚠️ If you skip this, git will still work but your commits will show a blank or wrong author — which matters when reviewing who changed what in a shared clinical codebase.

---

**Step 0 — Starting a repository (do this once per project)**

There are exactly two ways to begin:

| Situation | Command | What it does |
|---|---|---|
| You are **starting fresh** — a new folder, no repo yet | `git init` | Creates a hidden `.git` folder in the current directory. Your folder is now a git repository. Nothing is committed yet. |
| You are **joining an existing project** — a repo already exists on GitHub | `git clone https://github.com/org/repo.git` | Downloads the entire repo (all files + full history) into a new sub-folder on your machine. Already connected to GitHub. |

```
# Starting fresh
cd my-new-project
git init
# → Initialized empty Git repository in my-new-project/.git/

# Joining an existing repo
git clone https://github.com/KHCC-AI/crcl-app.git
cd crcl-app
# → All files + history are here, remote already configured
```

> **Rule of thumb:** Use `git init` when you create the project. Use `git clone` when the project already exists on GitHub and you are setting it up on a new machine or for a new team member.

---

**Your two most important diagnostic commands:**

`git status` — run this before and after everything. It tells you exactly what git sees right now: which files are modified, which are staged, which are untracked, and whether you're ahead or behind the remote. When something seems wrong, `git status` is always your first move — not `git commit`, not `git push`.

```
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   app.py          ← you edited this but haven't staged it yet

Untracked files:
  .env                        ← git sees it but is ignoring it (check .gitignore)
  init_db.py                  ← new file, git doesn't know about it yet
```

`git log --oneline` — shows your commit history, one line per commit, newest first. Use it to review what you've done, find a commit to roll back to, or confirm a push actually landed.

```
$ git log --oneline
a3f92c1 (HEAD -> main, origin/main) add nephrotoxic drug alerts
b81e044 add SQLite init and CrCl formula
c2d0178 initial project structure
```

> `HEAD -> main` means your latest local commit. `origin/main` means the same commit is on GitHub. If `origin/main` is missing or behind, you haven't pushed yet.

---

**The commands you'll actually type (every day):**

| Command | When |
|---|---|
| `git status` | At least 10 times a day. Always your first move when confused. |
| `git log --oneline` | Check history — see what was committed and whether it was pushed. |
| `git add .` | Stage all changed files |
| `git add filename` | Stage one specific file |
| `git commit -m "message"` | Snapshot the staged changes |
| `git push` | Send your commits to GitHub |
| `git pull` | Get other people's commits from GitHub |
| `git log --oneline` | See history, one line per commit |
| `git diff` | See what you changed since the last commit |
| `git restore .` | Throw away unsaved changes to **all** files at once |
| `git checkout -- file` | Throw away unsaved changes to one specific file |

**Connecting a fresh `git init` repo to GitHub:**

After `git init` you still need to link it to a remote on GitHub. Three steps — run once per project:

```
# 1. Create an empty repo on github.com (no README, no .gitignore — leave them blank)
#    Copy the HTTPS URL shown on the empty repo page, then:

# 2. Point your local repo at GitHub
git remote add origin https://github.com/your-username/your-repo.git

# 3. Rename the default branch to 'main' and push
git branch -M main
git push -u origin main
#    The -u flag sets the upstream so future 'git push' and 'git pull' need no arguments
```

Check your remote is set correctly at any time:

```
git remote -v
# origin  https://github.com/your-username/your-repo.git (fetch)
# origin  https://github.com/your-username/your-repo.git (push)
```

Change a wrong remote URL without starting over:

```
git remote set-url origin https://github.com/correct-username/correct-repo.git
```

After the first push, everyday use is just:

```
git pull        # get latest from GitHub before you start
git add .
git commit -m "your message"
git push        # send your commits up
```

**Authentication options:**

- **HTTPS + Personal Access Token (easiest):** github.com → Settings → Developer settings → Personal access tokens. Use the token as your password when git prompts.
- **SSH key (cleaner long-term):** `ssh-keygen -t ed25519 -C "you@khcc.jo"`, then add the `.pub` file at github.com/settings/keys.
- **GitHub CLI (`gh auth login`):** one command, handles everything. Recommended for new students.

**Undoing things — the cheat sheet:**

| You want to... | Run this |
|---|---|
| Discard changes to **all** unstaged files | `git restore .` |
| Discard changes to one specific file | `git restore filename` |
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
