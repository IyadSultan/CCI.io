# CCI Session 9 -- Lesson 1: VS Code Setup -- Terminal, venv, requirements, README

**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (local laptop)

---

## Instructor Introduction

Up till now most of you have been writing code in notebooks -- Colab, Jupyter, Databricks. Notebooks are great for experiments, but every real clinical AI system at KHCC lives in a folder of `.py` files on a server. Today we learn how to set that folder up on your own laptop. By the end of this lesson, you'll have a clean project structure that any colleague -- or future you -- can reopen six months from now and still run. We'll cover the integrated terminal inside VS Code, virtual environments that isolate one project's packages from another, a `requirements.txt` that records exactly what your project needs, and a `README.md` that explains what the project is. These four habits are what separate code that survives from code that rots after one demo.

---

## NotebookLM Summary

Visual Studio Code is the editor most KHCC AIDI developers use day to day, and the mental model is simple: a workspace is just a folder on your laptop. When you choose **File -> Open Folder**, VS Code reads everything in that folder, including any hidden files like `.env` or `.gitignore`, and from then on every terminal command, every git operation, and every Python interpreter selection is scoped to that folder. The integrated terminal, opened with `Ctrl+`` (backtick), is the same shell you would launch from the Start menu, but it is automatically positioned in the project directory, which removes a huge class of "wrong working directory" errors that plague notebook users moving to local development.

The most important habit to build on day one is the virtual environment. A Python virtual environment is a private copy of the Python interpreter and its packages that lives inside your project folder, typically in a directory called `.venv`. You create it with `python -m venv .venv` and then activate it -- on Windows the command is `.venv\Scripts\activate`, on macOS or Linux it is `source .venv/bin/activate`. Once activated, every `pip install` writes packages into the project's `.venv` rather than polluting your global Python. This means two AIDI projects can depend on different versions of `pydantic` or `gradio` without breaking each other, and you can delete the whole `.venv` folder to start fresh. The single most-missed step is telling VS Code which interpreter to use after activation: click the Python version in the bottom-right status bar and explicitly select the `.venv` interpreter, otherwise the editor's IntelliSense and the terminal will disagree about which packages exist.

A `requirements.txt` file is a plain-text list of packages, one per line, optionally pinned to versions. Today you will create one with two lines, `gradio` and `python-dotenv`, and install everything with `pip install -r requirements.txt`. The `README.md` is the front door of your project -- one short paragraph saying what the project does, a code block showing how to install and run it, and a note about which environment variables are required. A useful diagnostic trick is to run `which python` (or `where python` on Windows) before and after activation to confirm the shell is pointing at your `.venv` and not at the system Python.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the VS Code Python tutorial PDF, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Install:** VS Code from <https://code.visualstudio.com/> and the Microsoft Python extension from the Extensions marketplace.
- **Read:** VS Code Python tutorial, sections "Install Python and the Python extension" and "Create a Python Hello World source code file": <https://code.visualstudio.com/docs/python/python-tutorial>
- **Skim:** Python venv documentation: <https://docs.python.org/3/library/venv.html>
- **Warm-up question:** Think about the last time you opened a Colab notebook from three months ago and tried to re-run it. What broke? Write down two reasons (package versions, missing keys, dead links, etc.) and bring them to class.

### During Class -- What to Focus On

1. **Workspace = folder** -- VS Code does not have "projects" in the heavy sense. It is just a folder, and every command runs relative to that folder.
2. **The integrated terminal** -- `Ctrl+`` opens it. The prompt shows your current directory and, after activation, the venv name in parentheses like `(.venv)`.
3. **Virtual environment activation** -- the prefix in your terminal prompt is the only reliable sign that activation worked. If you do not see `(.venv)`, the activation failed.
4. **Interpreter selection** -- the bottom-right status bar shows the active Python interpreter. After creating a venv, click it and pick the one inside `.venv`.

**Common traps:**

- Creating the venv but forgetting to activate it -- `pip install` then writes to global Python and you wonder why imports fail next session.
- Activating in one terminal tab and running `pip` in a different one -- each tab has its own shell state.
- On Windows, PowerShell may block activation with an execution policy error. Fix once with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### After Class -- Practice & Lab Work

**Lab work (required):**

1. Create a folder `~/cci-session9/crcl-app` and open it in VS Code with **File -> Open Folder**.
2. Open the integrated terminal (`Ctrl+``) and run `python -m venv .venv`.
3. Activate the venv: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux). Verify the `(.venv)` prefix appears.
4. Run `which python` (Mac/Linux) or `where python` (Windows) and confirm the path points inside your project's `.venv` folder.
5. Click the Python version in the bottom-right status bar and select the `.venv` interpreter.
6. Create `requirements.txt` with two lines: `gradio` and `python-dotenv`. Run `pip install -r requirements.txt`.
7. Create `README.md` with one paragraph describing the project (a Cockcroft-Gault calculator) and a fenced code block showing the install command.

**Extra practice (optional):**

- Run `pip freeze > requirements.lock.txt` and compare it to your `requirements.txt`. Discuss with a peer when you would commit each one.
- Open a second project folder in a new VS Code window and verify the two projects have independent venvs.

**Self-check questions:**

1. What command creates a virtual environment, and where does it store the packages?
2. How can you tell from the terminal prompt whether a venv is currently active?
3. Why does VS Code need a separate "interpreter selection" step even after you activate the venv in the terminal?

### Resources

| Resource | Link |
|----------|------|
| VS Code Python Tutorial | <https://code.visualstudio.com/docs/python/python-tutorial> |
| VS Code Integrated Terminal | <https://code.visualstudio.com/docs/terminal/basics> |
| Python venv -- Official Docs | <https://docs.python.org/3/library/venv.html> |
| VS Code Python Environments | <https://code.visualstudio.com/docs/python/environments> |
| pip User Guide | <https://pip.pypa.io/en/stable/user_guide/> |
| Writing a Good README | <https://www.makeareadme.com/> |
