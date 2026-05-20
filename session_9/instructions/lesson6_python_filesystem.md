---
layout: page
title: "Lesson 6: Python Instead of the Command Line — os, pathlib, shutil, subprocess"
permalink: /session_9/instructions/lesson6_python_filesystem/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #1565C0!important}.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#BBDEFB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-09/">&#8249; Back to Session 9</a>

# CCI Session 9 — Lesson 6: Python Instead of the Command Line — os, pathlib, shutil, subprocess

**Estimated time:** 20 minutes (8 min content / 12 min lab)
**Lab mode:** Guided step-by-step
**Prerequisites:** Lessons 1–5 of Session 9 (you have a working local Python project and know basic terminal commands).

---

## Instructor Introduction

> "You've been using the terminal — `ls`, `mkdir`, `cp`, `rm`. That works fine on your Mac. But the moment you ship a script to a Windows colleague, half those commands stop working. `ls` becomes `dir`, `cp` becomes `copy`, and your beautiful bash one-liner is suddenly broken across the office. Python's standard library gives you the same power — but it runs the same way on every operating system. Today you learn the four modules that replace the command line: `pathlib` for paths, `os` for environment and walking, `shutil` for copying and moving, and `subprocess` when you really do need to call out to a shell. By the end of this lesson, you'll be able to script clinical file workflows that run identically on your laptop, a KHCC server, and a Hugging Face Space."

---

## NotebookLM Summary

Clinical data pipelines move files. Every day, AIDI scripts at KHCC pull CSV extracts from VistA, organize them into dated folders, archive the previous day's batch, and trigger a downstream R analysis. Doing that in bash works on Linux servers but breaks the moment a colleague tries to run the same logic on a Windows laptop. Python's standard library solves this by giving you the same file operations in a single cross-platform API.

The four modules you need are `pathlib`, `os`, `shutil`, and `subprocess`. `pathlib` is the modern path-handling library — `Path("data") / "vitals.csv"` works on Windows and Mac equally well, replacing fragile string concatenation with forward and back slashes. `Path` objects have methods for everything: `.exists()`, `.is_dir()`, `.glob("*.csv")`, `.mkdir(parents=True, exist_ok=True)`, `.read_text()`, `.write_text()`. This is the first thing to reach for in any clinical script.

The `os` module covers environment variables (`os.getenv("OPENAI_API_KEY")`, the same pattern from Lesson 2), platform detection (`os.name`), and the workhorse `os.walk()` which recursively traverses a directory tree yielding `(dirpath, dirnames, filenames)` for each folder. `os.walk` is how you build "find all PDF reports older than 30 days" scripts without ever touching `find` or `Get-ChildItem`. The newer `pathlib` provides `.rglob("*.pdf")` for the same use case in a more readable form.

The `shutil` module handles higher-level file operations: `shutil.copy()` and `shutil.copy2()` copy files, `shutil.copytree()` clones entire directory trees, `shutil.move()` renames or moves across drives, `shutil.rmtree()` recursively deletes a directory, and `shutil.disk_usage()` checks free space before a large write. In clinical contexts, `shutil.copy2` is usually what you want because it preserves modification times — useful for audit trails. `shutil.make_archive()` packages a folder into a zip or tar file in one call, perfect for daily backups.

The `subprocess` module is your escape hatch when you really do need to call a shell tool — `git`, `pdftotext`, a domain-specific binary, or a one-off command. `subprocess.run(["git", "status"], capture_output=True, text=True)` is the modern pattern: pass arguments as a list (no shell injection), capture stdout and stderr, check the returncode. Avoid `shell=True` unless you absolutely need shell features, and never pass untrusted user input to a shell — that's how command injection happens.

The clinical pattern at KHCC: a single Python script using `pathlib` for path math, `os.walk` to find files, `shutil.copy2` to organize them, and `subprocess.run` to call out only when needed. Everything else stays inside Python where it's testable, debuggable, and cross-platform.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the official Python docs for each module as sources, and generate an *Audio Overview* for commute-friendly review.

---

## Key Commands Cheat Sheet

### `pathlib` — modern paths
```python
from pathlib import Path

p = Path("data") / "patients" / "vitals.csv"   # cross-platform path
p.exists(), p.is_file(), p.is_dir()            # existence checks
p.parent, p.name, p.stem, p.suffix             # decomposition
p.mkdir(parents=True, exist_ok=True)           # create folder safely
p.read_text(), p.write_text("hello")           # read/write
list(Path("data").glob("*.csv"))               # one-level matches
list(Path("data").rglob("*.csv"))              # recursive matches
```

### `os` — environment and walking
```python
import os

os.getenv("OPENAI_API_KEY")                    # env var (matches Lesson 2)
os.environ["VAR"] = "value"                    # set env var
os.cpu_count()                                 # available CPUs
os.getcwd()                                    # current working dir

for root, dirs, files in os.walk("data"):      # recursive walk
    for f in files:
        full = os.path.join(root, f)
```

### `shutil` — higher-level operations
```python
import shutil

shutil.copy2("a.txt", "backup/a.txt")          # copy + preserve mtime
shutil.copytree("data", "data_backup")         # copy whole tree
shutil.move("old/path", "new/path")            # move or rename
shutil.rmtree("temp")                          # recursive delete (careful!)
shutil.make_archive("backup_2026_03_15",       # zip a folder in one line
                    "zip", "data")
free = shutil.disk_usage("/").free             # bytes free on disk
```

### `subprocess` — call external tools safely
```python
import subprocess

result = subprocess.run(
    ["git", "status"],            # args as list — no shell injection
    capture_output=True,
    text=True,
    check=True,                   # raise on non-zero exit
)
print(result.stdout)
```

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Skim the official Python docs for [`pathlib`](https://docs.python.org/3/library/pathlib.html) (intro section only — about 5 min)
- Warm-up question: *Imagine you need a script that runs every morning at KHCC. It pulls 200 CSV files from `extracts/today/`, copies them into `archive/2026-03-15/`, and writes a zip of yesterday's archive to `backups/`. Could your current bash workflow do this on a Windows server? What would break?*

### During Class — What to Focus On
- Make sure you understand the difference between `pathlib.Path` (modern, object-oriented) and `os.path` (older, string-based) — prefer `pathlib` in new code
- Make sure you understand why passing arguments as a **list** to `subprocess.run` is safer than `shell=True`
- Make sure you can read code that uses `os.walk` and `Path.rglob` and explain what they do
- Common trap: `shutil.rmtree` is permanently destructive — no recycle bin. Always print the path you're about to delete first.
- Common trap: `Path("data").glob("*.csv")` is one level only; use `.rglob` for recursive.

### After Class — Practice & Lab Work
- **Lab work (required):** Write a Python script `organize_extracts.py` that:
  1. Creates a folder named with today's date (`YYYY-MM-DD`) inside `archive/`
  2. Moves all `.csv` files from `extracts/` into that dated folder
  3. Zips yesterday's folder if it exists, writes the zip into `backups/`
  4. Prints a summary: how many files moved, total bytes archived
  Estimated time: 15 min.
- **Extra practice:** Rewrite a one-line bash command from your terminal history using only Python — pick something with `find`, `xargs`, or `tar`.
- **Self-check:**
  1. What does `Path("a") / "b" / "c.txt"` evaluate to on Windows vs Linux?
  2. When would you reach for `subprocess.run` instead of a Python library?
  3. What does `parents=True, exist_ok=True` mean in `mkdir`, and why use both?

### Resources

| Resource | Purpose |
|---|---|
| [pathlib docs](https://docs.python.org/3/library/pathlib.html) | Modern path-handling reference |
| [os module docs](https://docs.python.org/3/library/os.html) | Environment, walking, OS details |
| [shutil docs](https://docs.python.org/3/library/shutil.html) | Copy, move, archive, delete |
| [subprocess docs](https://docs.python.org/3/library/subprocess.html) | Calling external programs |
| [Real Python: pathlib](https://realpython.com/python-pathlib/) | Friendly tutorial with examples |
| [Real Python: subprocess](https://realpython.com/python-subprocess/) | Common patterns and pitfalls |

---

## Lab Exercise

**Title:** Cross-platform Clinical File Organizer
**Duration:** 12 minutes
**Mode:** Guided

**Clinical Scenario:**
> A KHCC pipeline drops daily VistA CSV extracts into `extracts/`. Each morning you need to move them into a dated archive folder, zip yesterday's archive for backup, and produce a summary log. The script must run on Linux servers and on a colleague's Windows laptop without modification.

**Objective:**
Write `organize_extracts.py` using only `pathlib`, `os`, `shutil`, and `subprocess` — no external packages.

**Setup:**
```bash
# Inside your Session 9 project folder, create test data
mkdir -p extracts archive backups
touch extracts/vitals_01.csv extracts/vitals_02.csv extracts/labs_01.csv
```

**Step-by-step:**
1. Use `pathlib.Path` for every path in the script. No string concatenation with slashes.
2. Build today's archive folder name with `datetime.date.today().isoformat()` — produces `2026-03-15`.
3. `Path("archive") / today` → call `.mkdir(parents=True, exist_ok=True)`.
4. Loop over `Path("extracts").glob("*.csv")`; for each file use `shutil.move(str(f), str(target))`.
5. If `Path("archive") / yesterday` exists, call `shutil.make_archive(base_name, "zip", root_dir)` to zip it into `backups/`.
6. Print: how many CSV files were moved, the archive folder path, the backup zip path, total bytes archived.
7. Use `subprocess.run(["git", "status"], capture_output=True, text=True)` at the end to confirm your script ran — bonus pattern.

**Expected output:**
```
Moved 3 CSV files to archive/2026-03-15
Backed up archive/2026-03-14 → backups/archive_2026-03-14.zip (4096 bytes)
git status: clean
```

**Stretch challenge:**
Add a `--dry-run` flag (using `argparse`) that prints what would happen without actually moving or zipping. This is exactly how AIDI scripts ship safely to production.

**KHCC connection:**
> This mirrors the nightly `etl_orchestrator.py` script in the AIDI pipeline that organizes raw VistA exports before the downstream R analysis runs at 6:00 AM.
