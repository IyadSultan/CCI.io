---
layout: page
title: "Lesson 1: VS Code Setup — Terminal, venv, requirements, README"
permalink: /session_9/instructions/lesson1_vscode_setup/
---

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #1565C0!important}
.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}
.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;transition:all .15s}
.back-btn:hover{background:#BBDEFB}

/* ── Layout ── */
.l1-body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1F2937; line-height: 1.65; max-width: 860px; margin: 0 auto; }

/* ── Section headers ── */
.l1-section { background: #fff; border: 1px solid #E3F2FD; border-left: 5px solid #1565C0; border-radius: 0 0.5rem 0.5rem 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
.l1-section h2 { margin: 0 0 0.75rem; font-size: 1.1rem; color: #1565C0; display: flex; align-items: center; gap: 0.5rem; }

/* ── Info / tip / warning boxes ── */
.l1-tip   { background: #E8F5E9; border-left: 4px solid #2E7D32; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.88rem; }
.l1-warn  { background: #FFF3E0; border-left: 4px solid #E65100; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.88rem; }
.l1-danger{ background: #FFEBEE; border-left: 4px solid #B71C1C; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.88rem; }
.l1-info  { background: #E3F2FD; border-left: 4px solid #1565C0; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.88rem; }

/* ── Terminal command tables ── */
.cmd-table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.85rem; }
.cmd-table th { background: #1565C0; color: #fff; padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; }
.cmd-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #E3F2FD; vertical-align: top; }
.cmd-table tr:hover td { background: #F0F7FF; }
.cmd-table code { background: #1e1e1e; color: #9CDCFE; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; white-space: nowrap; }
.cmd-table td:first-child { width: 42%; }
.win-badge  { display:inline-block; background:#0078D4; color:#fff; font-size:0.65rem; font-weight:700; padding:1px 5px; border-radius:3px; margin-left:4px; vertical-align:middle; }
.mac-badge  { display:inline-block; background:#555; color:#fff; font-size:0.65rem; font-weight:700; padding:1px 5px; border-radius:3px; margin-left:4px; vertical-align:middle; }
.both-badge { display:inline-block; background:#2E7D32; color:#fff; font-size:0.65rem; font-weight:700; padding:1px 5px; border-radius:3px; margin-left:4px; vertical-align:middle; }

/* ── OS tabs ── */
.os-tabs { display: flex; gap: 0; margin: 1rem 0 0; }
.os-tab { padding: 0.4rem 1rem; font-size: 0.82rem; font-weight: 600; border: 1px solid #ccc; background: #f5f5f5; cursor: default; border-radius: 0.4rem 0.4rem 0 0; }
.os-tab.win { background: #0078D4; color: #fff; border-color: #0078D4; }
.os-tab.mac { background: #555; color: #fff; border-color: #555; margin-left: 4px; }
.os-block { border: 1px solid #ccc; border-radius: 0 0.4rem 0.4rem 0.4rem; padding: 0.75rem 1rem; background: #1e1e1e; font-family: 'Courier New', monospace; font-size: 0.84rem; color: #D4D4D4; line-height: 1.8; }
.os-block .prompt { color: #4EC9B0; user-select: none; }
.os-block .comment { color: #6A9955; }
.os-block .cmd     { color: #9CDCFE; }
.os-block .arg     { color: #CE9178; }
.os-block .out     { color: #888; }

/* ── Numbered steps ── */
.steps { list-style: none; padding: 0; margin: 0.75rem 0; }
.steps li { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.65rem 0; border-bottom: 1px solid #F0F4FF; font-size: 0.9rem; }
.steps li:last-child { border-bottom: none; }
.step-n { flex-shrink: 0; width: 28px; height: 28px; background: #1565C0; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; }
.steps code { background: #EEF2FF; color: #3730A3; padding: 1px 5px; border-radius: 3px; font-size: 0.82rem; }

/* ── Meta bar ── */
.meta-bar { display: flex; gap: 1rem; flex-wrap: wrap; background: #F8F9FA; border: 1px solid #E0E0E0; border-radius: 0.5rem; padding: 0.65rem 1rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #555; }
.meta-bar span { display: flex; align-items: center; gap: 0.3rem; }

/* ── Checklist ── */
.checklist { list-style: none; padding: 0; margin: 0.5rem 0; }
.checklist li { padding: 0.3rem 0; font-size: 0.88rem; display: flex; align-items: flex-start; gap: 0.5rem; }
.checklist li::before { content: "☐"; color: #1565C0; font-size: 1rem; flex-shrink: 0; }
</style>

<a class="back-btn" href="{{ site.baseurl }}/session-09/">&#8249; Back to Session 9</a>

<div class="l1-body">

<h1 style="color:#1565C0;border-bottom:3px solid #1565C0;padding-bottom:0.4rem;">Lesson 1 — VS Code Setup</h1>
<p style="font-size:0.95rem;color:#37474F;">Terminal · Virtual Environments · requirements.txt · README</p>

<div class="meta-bar">
  <span>⏱ 20 min total</span>
  <span>📖 10 min content</span>
  <span>🧪 10 min lab</span>
  <span>💻 Local laptop</span>
  <span>🎯 Session 9, Lesson 1 of 6</span>
</div>

---

<!-- ══════════════════════════════════════════
     SECTION 1 — WHY WE LEAVE NOTEBOOKS
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>🎓 Why We Leave Notebooks</h2>

Up until now you have been writing code in notebooks — Colab, Jupyter, Databricks. Notebooks are perfect for experiments, but every real clinical AI system at KHCC runs as a folder of `.py` files on a server. Today you learn to set that folder up on your own laptop.

By the end of this lesson you will have a clean project structure that **any colleague — or future-you — can reopen in six months and still run**.

<div class="l1-info">
<strong>The four habits that separate code that survives from code that rots:</strong><br>
1. A <strong>virtual environment</strong> that isolates packages per project<br>
2. A <strong>requirements.txt</strong> that pins what's needed to reproduce the environment<br>
3. A <strong>README.md</strong> that explains what the project is and how to run it<br>
4. A <strong>properly selected VS Code interpreter</strong> that points into the venv
</div>
</div>

---

<!-- ══════════════════════════════════════════
     SECTION 2 — TERMINAL COMMANDS REFERENCE
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>🖥️ Terminal Commands Every KHCC Developer Must Know</h2>

<p style="font-size:0.85rem;color:#37474F;">Open the terminal in VS Code with <code>Ctrl+`</code> (backtick, top-left of keyboard). Every command below runs there. Green = works on both OS, Blue = Windows only, Grey = Mac/Linux only.</p>

---

**📂 Navigation — moving around the file system**

<table class="cmd-table">
  <tr><th>Command</th><th>What it does</th><th>Example</th></tr>
  <tr>
    <td><code>pwd</code> <span class="both-badge">BOTH</span></td>
    <td>Print working directory — where am I right now?</td>
    <td><code>pwd</code> → <code>/Users/iyad/cci-session9</code></td>
  </tr>
  <tr>
    <td><code>ls</code> <span class="mac-badge">MAC</span> &nbsp; <code>dir</code> <span class="win-badge">WIN</span></td>
    <td>List files and folders in the current directory</td>
    <td><code>ls -la</code> shows hidden files too (like <code>.env</code>)</td>
  </tr>
  <tr>
    <td><code>cd foldername</code> <span class="both-badge">BOTH</span></td>
    <td>Change directory — go into a folder</td>
    <td><code>cd cci-session9</code></td>
  </tr>
  <tr>
    <td><code>cd ..</code> <span class="both-badge">BOTH</span></td>
    <td>Go up one level to the parent folder</td>
    <td><code>cd ..</code> from <code>cci-session9</code> → home folder</td>
  </tr>
  <tr>
    <td><code>cd ~</code> <span class="both-badge">BOTH</span></td>
    <td>Go straight to your home directory no matter where you are</td>
    <td><code>cd ~</code></td>
  </tr>
  <tr>
    <td><code>cd "path with spaces"</code> <span class="both-badge">BOTH</span></td>
    <td>Always quote paths that have spaces in them</td>
    <td><code>cd "OneDrive/My Projects"</code></td>
  </tr>
</table>

---

**🗂️ Files & Folders — create, copy, move, delete**

<table class="cmd-table">
  <tr><th>Command</th><th>What it does</th><th>Example</th></tr>
  <tr>
    <td><code>mkdir foldername</code> <span class="both-badge">BOTH</span></td>
    <td>Make a new directory</td>
    <td><code>mkdir crcl-app</code></td>
  </tr>
  <tr>
    <td><code>mkdir -p a/b/c</code> <span class="mac-badge">MAC</span></td>
    <td>Create nested directories in one command</td>
    <td><code>mkdir -p data/raw/2026</code></td>
  </tr>
  <tr>
    <td><code>New-Item -ItemType Directory -Path a\b\c -Force</code> <span class="win-badge">WIN</span></td>
    <td>PowerShell equivalent of <code>mkdir -p</code></td>
    <td>Create nested folders on Windows</td>
  </tr>
  <tr>
    <td><code>touch filename</code> <span class="mac-badge">MAC</span></td>
    <td>Create an empty file (or update its timestamp)</td>
    <td><code>touch README.md</code></td>
  </tr>
  <tr>
    <td><code>New-Item filename</code> <span class="win-badge">WIN</span></td>
    <td>PowerShell equivalent of <code>touch</code></td>
    <td><code>New-Item README.md</code></td>
  </tr>
  <tr>
    <td><code>cp source dest</code> <span class="mac-badge">MAC</span> &nbsp; <code>Copy-Item source dest</code> <span class="win-badge">WIN</span></td>
    <td>Copy a file</td>
    <td><code>cp app.py app_backup.py</code></td>
  </tr>
  <tr>
    <td><code>mv source dest</code> <span class="mac-badge">MAC</span> &nbsp; <code>Move-Item source dest</code> <span class="win-badge">WIN</span></td>
    <td>Move or rename a file</td>
    <td><code>mv old_name.py new_name.py</code></td>
  </tr>
  <tr>
    <td><code>rm filename</code> <span class="mac-badge">MAC</span> &nbsp; <code>Remove-Item filename</code> <span class="win-badge">WIN</span></td>
    <td>Delete a file — no recycle bin, no undo</td>
    <td><code>rm temp.txt</code></td>
  </tr>
  <tr>
    <td><code>rm -rf foldername</code> <span class="mac-badge">MAC</span></td>
    <td>Recursively delete a whole folder ⚠️ permanent</td>
    <td><code>rm -rf .venv</code> to wipe and recreate venv</td>
  </tr>
  <tr>
    <td><code>Remove-Item -Recurse -Force foldername</code> <span class="win-badge">WIN</span></td>
    <td>PowerShell equivalent of <code>rm -rf</code></td>
    <td><code>Remove-Item -Recurse -Force .venv</code></td>
  </tr>
</table>

---

**🐍 Python & pip — packages and environments**

<table class="cmd-table">
  <tr><th>Command</th><th>What it does</th><th>Example</th></tr>
  <tr>
    <td><code>python --version</code> <span class="both-badge">BOTH</span></td>
    <td>Check which Python version is active</td>
    <td>Should show 3.10 or higher</td>
  </tr>
  <tr>
    <td><code>python -m venv .venv</code> <span class="both-badge">BOTH</span></td>
    <td>Create a virtual environment in a folder called <code>.venv</code></td>
    <td>Run once per project</td>
  </tr>
  <tr>
    <td><code>.venv\Scripts\activate</code> <span class="win-badge">WIN</span></td>
    <td>Activate the venv — you will see <code>(.venv)</code> in the prompt</td>
    <td>Run every time you open a new terminal</td>
  </tr>
  <tr>
    <td><code>source .venv/bin/activate</code> <span class="mac-badge">MAC</span></td>
    <td>Same — activate the venv on Mac/Linux</td>
    <td>Run every time you open a new terminal</td>
  </tr>
  <tr>
    <td><code>deactivate</code> <span class="both-badge">BOTH</span></td>
    <td>Turn off the venv and go back to system Python</td>
    <td>Rarely needed</td>
  </tr>
  <tr>
    <td><code>pip install package</code> <span class="both-badge">BOTH</span></td>
    <td>Install a Python package into the active environment</td>
    <td><code>pip install gradio</code></td>
  </tr>
  <tr>
    <td><code>pip install -r requirements.txt</code> <span class="both-badge">BOTH</span></td>
    <td>Install everything listed in requirements.txt</td>
    <td>Run after cloning a repo</td>
  </tr>
  <tr>
    <td><code>pip freeze</code> <span class="both-badge">BOTH</span></td>
    <td>List every installed package with exact version numbers</td>
    <td><code>pip freeze > requirements.txt</code> to save them</td>
  </tr>
  <tr>
    <td><code>pip list</code> <span class="both-badge">BOTH</span></td>
    <td>Show installed packages in a readable table</td>
    <td>Quick visual check</td>
  </tr>
  <tr>
    <td><code>pip uninstall package</code> <span class="both-badge">BOTH</span></td>
    <td>Remove a package</td>
    <td><code>pip uninstall gradio</code></td>
  </tr>
  <tr>
    <td><code>pip show package</code> <span class="both-badge">BOTH</span></td>
    <td>Show version and location of an installed package</td>
    <td><code>pip show numpy</code></td>
  </tr>
  <tr>
    <td><code>which python</code> <span class="mac-badge">MAC</span> &nbsp; <code>where python</code> <span class="win-badge">WIN</span></td>
    <td>Show the full path to the active Python — use this to confirm venv is active</td>
    <td>Should contain <code>.venv</code> in the path</td>
  </tr>
</table>

---

**📄 Reading & writing files from the terminal**

<table class="cmd-table">
  <tr><th>Command</th><th>What it does</th><th>Example</th></tr>
  <tr>
    <td><code>cat filename</code> <span class="mac-badge">MAC</span> &nbsp; <code>Get-Content filename</code> <span class="win-badge">WIN</span></td>
    <td>Print the contents of a file to the terminal</td>
    <td><code>cat requirements.txt</code></td>
  </tr>
  <tr>
    <td><code>echo "text" > file</code> <span class="both-badge">BOTH</span></td>
    <td>Write text into a file — <strong>overwrites</strong> the file</td>
    <td><code>echo "gradio" > requirements.txt</code></td>
  </tr>
  <tr>
    <td><code>echo "text" >> file</code> <span class="both-badge">BOTH</span></td>
    <td>Append text to a file without overwriting</td>
    <td><code>echo "python-dotenv" >> requirements.txt</code></td>
  </tr>
  <tr>
    <td><code>code filename</code> <span class="both-badge">BOTH</span></td>
    <td>Open a file in VS Code from the terminal</td>
    <td><code>code README.md</code></td>
  </tr>
  <tr>
    <td><code>code .</code> <span class="both-badge">BOTH</span></td>
    <td>Open the current folder as a VS Code workspace</td>
    <td>The fastest way to start</td>
  </tr>
</table>

---

**🔎 Other useful commands**

<table class="cmd-table">
  <tr><th>Command</th><th>What it does</th><th>Example</th></tr>
  <tr>
    <td><code>clear</code> <span class="mac-badge">MAC</span> &nbsp; <code>cls</code> <span class="win-badge">WIN</span></td>
    <td>Clear the terminal screen</td>
    <td>Use when the output is getting messy</td>
  </tr>
  <tr>
    <td>↑ / ↓ arrow keys</td>
    <td>Scroll through previous commands — never retype</td>
    <td>Press ↑ twice to get the command from two steps ago</td>
  </tr>
  <tr>
    <td>Tab key</td>
    <td>Autocomplete file names and folder names</td>
    <td>Type <code>cd src</code> then Tab → completes to full name</td>
  </tr>
  <tr>
    <td><code>Ctrl+C</code></td>
    <td>Stop a running program immediately</td>
    <td>Use this to stop a running Gradio server</td>
  </tr>
  <tr>
    <td><code>Ctrl+L</code></td>
    <td>Clear screen (works in most terminals on both OS)</td>
    <td>Shortcut for clear/cls</td>
  </tr>
  <tr>
    <td><code>history</code> <span class="mac-badge">MAC</span></td>
    <td>List your last 500 commands</td>
    <td>Useful for writing documentation</td>
  </tr>
  <tr>
    <td><code>python script.py</code> <span class="both-badge">BOTH</span></td>
    <td>Run a Python file</td>
    <td><code>python app.py</code></td>
  </tr>
  <tr>
    <td><code>python -c "code"</code> <span class="both-badge">BOTH</span></td>
    <td>Run a single line of Python inline</td>
    <td><code>python -c "import sys; print(sys.version)"</code></td>
  </tr>
</table>

<div class="l1-warn">
<strong>⚠️ Windows PowerShell note:</strong> If activation fails with a red "running scripts is disabled" error, run this <em>once</em> to fix it:<br>
<code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code><br>
Type <code>Y</code> and press Enter. This only needs to be done once per machine.
</div>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 3 — THE VIRTUAL ENVIRONMENT
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>🧪 Virtual Environments — The Most Important Habit</h2>

A virtual environment is a **private copy of Python and its packages** that lives inside your project folder. It means:

- Project A can use `gradio 4.x` and Project B can use `gradio 5.x` — they never conflict
- You can delete the whole `.venv` folder to start fresh — your code is untouched
- Your colleague clones your repo, runs `pip install -r requirements.txt`, and has an identical environment

<div class="os-tabs"><div class="os-tab win">🪟 Windows</div><div class="os-tab mac">🍎 Mac / Linux</div></div>
<div class="os-block">
<div><span class="prompt">PS C:\Users\iyad\crcl-app&gt; </span><span class="cmd">python -m venv .venv</span>  <span class="comment">  # create the venv</span></div>
<div><span class="prompt">PS C:\Users\iyad\crcl-app&gt; </span><span class="cmd">.venv\Scripts\activate</span>  <span class="comment"> # activate it</span></div>
<div><span class="prompt">(.venv) PS C:\Users\iyad\crcl-app&gt; </span><span class="out">              # (.venv) prefix = it worked ✓</span></div>
<div><span class="prompt">(.venv) PS C:\Users\iyad\crcl-app&gt; </span><span class="cmd">where python</span></div>
<div><span class="out">C:\Users\iyad\crcl-app\.venv\Scripts\python.exe  ← must contain .venv</span></div>
<br>
<div><span class="comment"># Mac / Linux equivalent:</span></div>
<div><span class="prompt">$ </span><span class="cmd">python -m venv .venv</span></div>
<div><span class="prompt">$ </span><span class="cmd">source .venv/bin/activate</span></div>
<div><span class="prompt">(.venv) $ </span><span class="cmd">which python</span></div>
<div><span class="out">/Users/iyad/crcl-app/.venv/bin/python  ← must contain .venv</span></div>
</div>

<div class="l1-danger">
<strong>🚨 The step everyone forgets:</strong> After creating the venv, you must also tell VS Code which Python to use. Click the Python version shown in the <strong>bottom-right corner</strong> of VS Code → select the interpreter that contains <code>.venv</code>. Without this, VS Code's IntelliSense and the Run button will use a different Python than your terminal.
</div>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 4 — REQUIREMENTS & README
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>📋 requirements.txt and README.md</h2>

**requirements.txt** — a plain text list of packages, one per line:

<div class="os-block">
<div><span class="comment"># requirements.txt — list one package per line</span></div>
<div><span class="arg">gradio</span></div>
<div><span class="arg">python-dotenv</span></div>
<div><span class="arg">requests</span></div>
<div><span class="out"></span></div>
<div><span class="comment"># install everything in one command:</span></div>
<div><span class="prompt">(.venv) $ </span><span class="cmd">pip install -r requirements.txt</span></div>
<div><span class="out">Successfully installed gradio-4.x python-dotenv-1.x requests-2.x ...</span></div>
</div>

**README.md** — the front door of your project. Minimum required sections:

<div class="os-block">
<div><span class="comment"># README.md — minimum template</span></div>
<div><span class="out"></span></div>
<div><span class="arg"># CrCl Calculator — Cockcroft-Gault</span></div>
<div><span class="out">Estimates creatinine clearance for KHCC oncology dosing.</span></div>
<div><span class="out"></span></div>
<div><span class="arg">## Setup</span></div>
<div><span class="out">```bash</span></div>
<div><span class="out">python -m venv .venv</span></div>
<div><span class="out">source .venv/bin/activate  # Windows: .venv\Scripts\activate</span></div>
<div><span class="out">pip install -r requirements.txt</span></div>
<div><span class="out">cp .env.example .env       # fill in your API keys</span></div>
<div><span class="out">python app.py</span></div>
<div><span class="out">```</span></div>
<div><span class="out"></span></div>
<div><span class="arg">## Environment Variables</span></div>
<div><span class="out">See `.env.example` for required keys.</span></div>
<div><span class="out"></span></div>
<div><span class="arg">## Clinical Notes</span></div>
<div><span class="out">For CKD-EPI or pediatric dosing adjustments, see ...</span></div>
</div>

<div class="l1-tip">
<strong>💡 pip freeze vs requirements.txt:</strong> Your hand-written <code>requirements.txt</code> lists the packages <em>you</em> care about. <code>pip freeze > requirements.lock.txt</code> captures <em>every</em> package including auto-installed sub-dependencies with exact versions. Use <code>requirements.txt</code> for day-to-day use; use a lock file when reproducibility is critical (e.g., production deployments or clinical validation runs).
</div>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 5 — STEP-BY-STEP LAB
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>🧪 Lab — Do This Now (10 min)</h2>

<ul class="steps">
  <li>
    <div class="step-n">1</div>
    <div><strong>Create the project folder.</strong> In your terminal:<br>
    <code>mkdir crcl-app</code> then <code>cd crcl-app</code><br>
    Or use VS Code: <strong>File → Open Folder</strong> → create a new folder called <code>crcl-app</code>.</div>
  </li>
  <li>
    <div class="step-n">2</div>
    <div><strong>Open the integrated terminal.</strong> Press <code>Ctrl+`</code> (backtick). You should see your terminal prompt pointing to the <code>crcl-app</code> folder. If it doesn't, type <code>cd crcl-app</code>.</div>
  </li>
  <li>
    <div class="step-n">3</div>
    <div><strong>Create the virtual environment.</strong><br>
    <code>python -m venv .venv</code><br>
    Wait a few seconds. A new <code>.venv</code> folder will appear in your Explorer sidebar.</div>
  </li>
  <li>
    <div class="step-n">4</div>
    <div><strong>Activate the venv.</strong><br>
    Windows: <code>.venv\Scripts\activate</code><br>
    Mac/Linux: <code>source .venv/bin/activate</code><br>
    ✅ You should see <code>(.venv)</code> appear at the start of your terminal prompt.</div>
  </li>
  <li>
    <div class="step-n">5</div>
    <div><strong>Confirm you are using the right Python.</strong><br>
    Windows: <code>where python</code> &nbsp;|&nbsp; Mac/Linux: <code>which python</code><br>
    The path must contain <code>.venv</code>. If it shows a system Python, activation failed — try again.</div>
  </li>
  <li>
    <div class="step-n">6</div>
    <div><strong>Select the VS Code interpreter.</strong> Click the Python version in the <strong>bottom-right corner</strong> of VS Code → pick the interpreter that contains <code>.venv</code>. This is the step everyone forgets.</div>
  </li>
  <li>
    <div class="step-n">7</div>
    <div><strong>Create requirements.txt.</strong> In the terminal:<br>
    <code>echo gradio > requirements.txt</code><br>
    <code>echo python-dotenv >> requirements.txt</code><br>
    Then install: <code>pip install -r requirements.txt</code></div>
  </li>
  <li>
    <div class="step-n">8</div>
    <div><strong>Create README.md.</strong> In VS Code, press <code>Ctrl+N</code> → type a one-paragraph description of the CrCl calculator → save as <code>README.md</code> in the project root. Include the setup commands shown above.</div>
  </li>
  <li>
    <div class="step-n">9</div>
    <div><strong>Check your structure.</strong> Run <code>ls -la</code> (Mac) or <code>dir</code> (Windows). You should see: <code>.venv/</code>, <code>requirements.txt</code>, <code>README.md</code>. That's a real project.</div>
  </li>
</ul>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 6 — COMMON TRAPS
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>🪤 Common Traps</h2>

<div class="l1-danger">
<strong>🚨 Trap 1 — "I installed the package but Python can't find it"</strong><br>
You created the venv but didn't activate it. The <code>pip install</code> went to global Python. Fix: activate the venv (<code>.venv\Scripts\activate</code>), then install again.
</div>

<div class="l1-danger">
<strong>🚨 Trap 2 — "It works in terminal but VS Code says the import doesn't exist"</strong><br>
You activated the venv in the terminal but VS Code is still pointing at system Python. Fix: click the Python version in the bottom-right corner → select the <code>.venv</code> interpreter.
</div>

<div class="l1-warn">
<strong>⚠️ Trap 3 — "I activated in one terminal tab and ran pip in another"</strong><br>
Each terminal tab has its own shell state. Activation in Tab 1 does not carry over to Tab 2. Check for the <code>(.venv)</code> prefix in every tab you use.
</div>

<div class="l1-warn">
<strong>⚠️ Trap 4 — "PowerShell says running scripts is disabled"</strong><br>
Run once: <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code> → type Y → Enter. Done.
</div>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 7 — SELF-CHECK
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>✅ Self-Check — Can You Answer These?</h2>

<ul class="checklist">
  <li>What command creates a virtual environment, and where does it store the packages?</li>
  <li>What does the <code>(.venv)</code> prefix in the terminal prompt tell you?</li>
  <li>Why does VS Code need a separate "interpreter selection" step even after you activate the venv in the terminal?</li>
  <li>What is the difference between <code>pip install package</code> and <code>pip install -r requirements.txt</code>?</li>
  <li>A colleague clones your repo. What single command installs everything they need?</li>
  <li>You accidentally install a package globally. How do you check which Python you're using?</li>
</ul>

</div>

---

<!-- ══════════════════════════════════════════
     SECTION 8 — RESOURCES
     ══════════════════════════════════════════ -->
<div class="l1-section">
<h2>📚 Resources</h2>

| Resource | Link |
|---|---|
| VS Code Python Tutorial | [code.visualstudio.com/docs/python/python-tutorial](https://code.visualstudio.com/docs/python/python-tutorial) |
| VS Code Integrated Terminal | [code.visualstudio.com/docs/terminal/basics](https://code.visualstudio.com/docs/terminal/basics) |
| Python venv — Official Docs | [docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html) |
| VS Code Python Environments | [code.visualstudio.com/docs/python/environments](https://code.visualstudio.com/docs/python/environments) |
| pip User Guide | [pip.pypa.io/en/stable/user_guide](https://pip.pypa.io/en/stable/user_guide/) |
| Making a Good README | [makeareadme.com](https://www.makeareadme.com/) |
| Command Line Crash Course | [learnpythonthehardway.org/python3/appendixa.html](https://learnpythonthehardway.org/python3/appendixa.html) |

</div>

</div>
