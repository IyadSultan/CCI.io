---
layout: default
title: "VS Code for Dummies"
permalink: /session_9/handouts/vs_code_for_dummies/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #F9A825 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #F9A825 !important; font-weight: 800 !important; }
  .page-content { padding-top: 0 !important; }
  * { box-sizing: border-box; }

  body { font-family: system-ui, -apple-system, sans-serif; }

  .fd-back {
    display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem;
    font-weight: 600; color: #F57F17; text-decoration: none; padding: 0.35rem 0.65rem;
    border-radius: 0.4rem; border: 1px solid #FFE082; background: #FFF8E1;
    margin: 1rem 0; transition: all 0.15s;
  }
  .fd-back:hover { background: #FFECB3; }

  .fd-hero {
    background: linear-gradient(135deg, #F9A825, #FBC02D);
    border-radius: 1rem;
    padding: 1.5rem 1.75rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 4px 20px rgba(249,168,37,0.3);
  }
  .fd-hero-icon { font-size: 3.5rem; line-height: 1; flex-shrink: 0; }
  .fd-hero h1 { margin: 0; font-size: 1.6rem; font-weight: 900; color: #1A1A1A; line-height: 1.2; }
  .fd-hero p { margin: 0.4rem 0 0; font-size: 0.88rem; color: #4A3700; line-height: 1.5; }

  .fd-warning {
    background: #FFF3E0;
    border: 2px solid #FFB300;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
    font-size: 0.85rem;
    color: #4E342E;
    line-height: 1.6;
  }
  .fd-warning strong { color: #E65100; font-size: 0.9rem; }

  .fd-section {
    border: 2px solid #FDD835;
    border-radius: 0.85rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .fd-section-head {
    background: #FFF9C4;
    padding: 0.85rem 1.25rem;
    border-bottom: 2px solid #FDD835;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .fd-section-head .ch-icon { font-size: 1.6rem; line-height: 1; }
  .fd-section-head h2 { margin: 0; font-size: 1.05rem; font-weight: 800; color: #1A1A1A; }
  .fd-section-head .ch-sub { font-size: 0.72rem; color: #795548; margin: 0.1rem 0 0; }

  .fd-section-body { padding: 1rem 1.25rem; background: #fff; }

  .fd-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
  .fd-table th {
    background: #FFF9C4;
    color: #5D4037;
    font-weight: 700;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.5rem 0.75rem;
    border: 1px solid #FDD835;
    text-align: left;
  }
  .fd-table td {
    padding: 0.55rem 0.75rem;
    border: 1px solid #F5F5F5;
    color: #37474F;
    vertical-align: top;
    line-height: 1.5;
  }
  .fd-table tr:nth-child(even) td { background: #FFFDE7; }
  .fd-table code { background: #1e1e1e; color: #D4D4D4; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; white-space: nowrap; }

  .fd-steps { list-style: none; padding: 0; margin: 0; }
  .fd-steps li {
    display: flex;
    gap: 0.85rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid #FFF9C4;
    font-size: 0.85rem;
    color: #37474F;
    line-height: 1.55;
  }
  .fd-steps li:last-child { border-bottom: none; }
  .fd-steps .step-num {
    background: #F9A825;
    color: #1A1A1A;
    font-weight: 900;
    font-size: 0.75rem;
    min-width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .fd-steps strong { color: #1A1A1A; }

  .fd-tip {
    background: #E8F5E9;
    border-left: 4px solid #43A047;
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0 0;
    font-size: 0.82rem;
    color: #1B5E20;
    line-height: 1.5;
  }
  .fd-tip strong { color: #1B5E20; }

  .fd-danger {
    background: #FFEBEE;
    border-left: 4px solid #E53935;
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0 0;
    font-size: 0.82rem;
    color: #B71C1C;
    line-height: 1.5;
  }
  .fd-danger strong { color: #B71C1C; }

  .fd-code-block {
    background: #1e1e1e;
    color: #D4D4D4;
    border-radius: 0.6rem;
    padding: 1rem 1.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.82rem;
    line-height: 1.7;
    margin: 0.75rem 0 0;
    overflow-x: auto;
    white-space: pre;
  }
  .fd-code-block .comment { color: #6A9955; }
  .fd-code-block .keyword { color: #569CD6; }
  .fd-code-block .string { color: #CE9178; }
  .fd-code-block .prompt { color: #4EC9B0; user-select: none; }

  .fd-flow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.75rem;
    font-size: 0.82rem;
  }
  .fd-flow-box {
    background: #FFF9C4;
    border: 2px solid #FDD835;
    border-radius: 0.4rem;
    padding: 0.35rem 0.65rem;
    font-weight: 700;
    color: #4A3700;
    white-space: nowrap;
  }
  .fd-flow-arrow { color: #F9A825; font-weight: 900; font-size: 1rem; }

  .fd-footer {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    font-size: 0.72rem;
    color: #B0BEC5;
    border-top: 2px solid #FDD835;
    margin-top: 2rem;
  }

  .fd-extensions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.6rem;
    margin-top: 0.75rem;
  }
  .fd-ext-card {
    border: 1px solid #FDD835;
    border-radius: 0.5rem;
    padding: 0.6rem 0.85rem;
    background: #FFFDE7;
    font-size: 0.8rem;
    color: #37474F;
  }
  .fd-ext-card strong { color: #1A1A1A; display: block; margin-bottom: 0.2rem; }

  .fd-file-card {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.6rem 0.85rem;
    border: 1px solid #F0F0F0;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: #fff;
    font-size: 0.82rem;
    color: #37474F;
    line-height: 1.5;
  }
  .fd-file-badge {
    font-weight: 900;
    font-size: 0.65rem;
    padding: 3px 7px;
    border-radius: 4px;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .fd-badge-yes { background: #C8E6C9; color: #1B5E20; }
  .fd-badge-no { background: #FFCDD2; color: #B71C1C; }
  code { background: #EEEEEE; color: #1A1A1A; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; }
</style>

<a class="fd-back" href="{{ site.baseurl }}/session-09/">&#8249; Back to Session 9</a>

<div class="fd-hero">
  <div class="fd-hero-icon">💛</div>
  <div>
    <h1>VS Code for Dummies</h1>
    <p>A plain-English reference guide for CCI doctors learning to code. Keep this open beside your laptop during Session 9.</p>
  </div>
</div>

<div class="fd-warning">
  <strong>&#9888; Before you read anything else — the #1 mistake in Session 9:</strong><br>
  You created a venv, activated it, installed packages in the terminal — everything works. Then you press the green Run button in VS Code and it says <code>ModuleNotFoundError</code>. <strong>The fix: click the Python version in the bottom-right corner of VS Code and pick the one inside <code>.venv</code>.</strong> VS Code's Run button and your terminal are using different Pythons unless you tell VS Code which one to use.
</div>

<!-- ─── Chapter 1: General ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">🖥️</span>
    <div>
      <h2>Chapter 1 — The Big Picture</h2>
      <p class="ch-sub">What is VS Code, what is a workspace, and 5 shortcuts to live by</p>
    </div>
  </div>
  <div class="fd-section-body">
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      <strong>VS Code is a free text editor from Microsoft that understands code.</strong> Think of it as Word — but for Python files instead of documents, and with a built-in command line, spell-checker for code errors, and a git panel. A <strong>workspace</strong> is just a folder you opened with <strong>File → Open Folder</strong>. Everything you do — writing files, running commands, tracking changes — happens inside that one folder.
    </p>
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      The key mental shift from Colab/Jupyter: <strong>in VS Code, your code lives in files on your hard drive, not in cells in memory.</strong> This is what makes clinical AI tools reproducible, testable, deployable, and auditable. Every KHCC production system is a folder of <code>.py</code> files — not a notebook.
    </p>

    <table class="fd-table">
      <tr><th>Shortcut (Windows)</th><th>Shortcut (Mac)</th><th>What it does</th></tr>
      <tr><td><code>Ctrl+Shift+P</code></td><td><code>Cmd+Shift+P</code></td><td><strong>Command palette</strong> — search and run any VS Code action. If you remember nothing else, remember this.</td></tr>
      <tr><td><code>Ctrl+P</code></td><td><code>Cmd+P</code></td><td><strong>Quick open</strong> — jump to any file by typing part of its name.</td></tr>
      <tr><td><code>Ctrl+`</code></td><td><code>Ctrl+`</code></td><td><strong>Toggle terminal</strong> — open/close the command line at the bottom.</td></tr>
      <tr><td><code>Ctrl+B</code></td><td><code>Cmd+B</code></td><td><strong>Toggle sidebar</strong> — show/hide the file explorer on the left.</td></tr>
      <tr><td><code>Ctrl+Shift+G</code></td><td><code>Cmd+Shift+G</code></td><td><strong>Source control (git) panel</strong> — see changed files, stage, commit, push.</td></tr>
    </table>

    <div class="fd-tip">
      <strong>💡 The status bar is your dashboard.</strong> The bottom strip of VS Code shows: which Python you're using (left side), current git branch (left), open ports, and any errors. Click any of them to change settings. If you don't see <code>(.venv)</code> in the Python selector, you haven't selected the venv yet.
    </div>

    <div class="fd-danger">
      <strong>⚠️ First thing to do when you open VS Code: turn on Auto Save.</strong><br>
      Click <strong>File → Auto Save</strong> (a checkmark appears). Without it, VS Code does not save your file until you press <code>Ctrl+S</code> — meaning Python will keep running the <em>old</em> version of your code, and you'll spend 20 minutes debugging a problem that doesn't exist. Turn it on once; it stays on forever.
    </div>
  </div>
</div>

<!-- ─── Chapter 2: Terminal ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">⌨️</span>
    <div>
      <h2>Chapter 2 — The Terminal</h2>
      <p class="ch-sub">The 8 commands you'll type 90% of the time</p>
    </div>
  </div>
  <div class="fd-section-body">
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      The integrated terminal is just the system command line, docked at the bottom of VS Code so you don't need to leave. Open it with <code>Ctrl+`</code>. The prompt should show your project folder. If you see <code>(.venv)</code> at the start of the prompt line, the virtual environment is active.
    </p>

    <table class="fd-table">
      <tr><th>Command</th><th>Plain English — what it does</th></tr>
      <tr><td><code>pwd</code></td><td>Print working directory — <em>"where am I right now?"</em></td></tr>
      <tr><td><code>ls</code> (Mac/Linux) / <code>dir</code> (Windows)</td><td>List files in this folder — <em>"what's in here?"</em></td></tr>
      <tr><td><code>cd folder/</code></td><td>Change into a folder — <em>"go inside this folder"</em></td></tr>
      <tr><td><code>cd ..</code></td><td>Go up one folder — <em>"go back one level"</em></td></tr>
      <tr><td><code>python -m venv .venv</code></td><td>Create a virtual environment called <code>.venv</code> — do this once per project</td></tr>
      <tr><td><code>source .venv/bin/activate</code> (Mac/Linux)<br><code>.venv\Scripts\activate</code> (Windows)</td><td>Activate the venv — <em>"use this project's private Python"</em></td></tr>
      <tr><td><code>pip install -r requirements.txt</code></td><td>Install all the packages listed in requirements.txt</td></tr>
      <tr><td><code>python app.py</code></td><td>Run your Python script</td></tr>
    </table>

    <div class="fd-danger">
      <strong>🚨 If something doesn't work after pip install:</strong> Check that your prompt shows <code>(.venv)</code>. If not, the venv isn't active — your packages went to the wrong Python. Run <code>which python</code> (Mac/Linux) or <code>where python</code> (Windows) to see which Python is actually being used.
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1.25rem 0 0.5rem;">Working with files from the terminal:</p>
    <table class="fd-table">
      <tr><th>Task</th><th>Mac / Linux</th><th>Windows (PowerShell)</th></tr>
      <tr><td>Create an empty file</td><td><code>touch README.md</code></td><td><code>New-Item README.md</code></td></tr>
      <tr><td>Open a file in VS Code</td><td><code>code README.md</code></td><td><code>code README.md</code></td></tr>
      <tr><td>Open whole folder in VS Code</td><td><code>code .</code></td><td><code>code .</code></td></tr>
      <tr><td>Print a file to terminal</td><td><code>cat requirements.txt</code></td><td><code>Get-Content requirements.txt</code></td></tr>
      <tr><td>Write one line to a file <em>(overwrites)</em></td><td><code>echo "gradio" &gt; requirements.txt</code></td><td><code>echo "gradio" &gt; requirements.txt</code></td></tr>
      <tr><td>Append a line <em>(keeps existing)</em></td><td><code>echo "python-dotenv" &gt;&gt; requirements.txt</code></td><td><code>echo "python-dotenv" &gt;&gt; requirements.txt</code></td></tr>
    </table>

    <div class="fd-tip">
      <strong>💡 Fastest way to create and edit any file:</strong> type <code>code filename</code> in the terminal. VS Code opens it (creating it if it doesn't exist) and you can type normally. This is quicker than chaining <code>echo</code> commands for anything longer than one line.
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1.25rem 0 0.5rem;">Environment variables from the terminal:</p>
    <table class="fd-table">
      <tr><th>Command</th><th>What it does</th></tr>
      <tr><td><code>export VAR=value</code> <em>(Mac/Linux)</em><br><code>$env:VAR="value"</code> <em>(Windows)</em></td><td>Set an environment variable for this terminal session. Python reads it with <code>os.getenv("VAR")</code>. Disappears when you close the tab — use <code>.env</code> for persistent secrets.</td></tr>
      <tr><td><code>echo $VAR</code> <em>(Mac/Linux)</em><br><code>echo $env:VAR</code> <em>(Windows)</em></td><td>Print the current value — use to confirm a secret was set before running your script.</td></tr>
    </table>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1.25rem 0 0.5rem;">🔍 Finding the right package — PyPI:</p>
    <p style="font-size:0.82rem;color:#37474F;line-height:1.6;">Before you <code>pip install</code> anything, look it up at <a href="https://pypi.org" target="_blank" rel="noopener noreferrer" style="color:#1565C0;font-weight:700;">pypi.org</a> — the official registry every <code>pip</code> download comes from.</p>
    <table class="fd-table">
      <tr><th>What to check</th><th>Why it matters</th></tr>
      <tr><td><strong>Exact install name</strong></td><td><code>pip install scikit-learn</code> not <code>sklearn</code> — the import name and the install name are often different. PyPI shows the correct install name.</td></tr>
      <tr><td><strong>Latest stable version</strong></td><td>Pin it in <code>requirements.txt</code> as <code>gradio==4.44.0</code> to prevent surprise upgrades breaking your app later.</td></tr>
      <tr><td><strong>Release history</strong></td><td>Click <em>Release history</em> to find the version a colleague used when they wrote the code.</td></tr>
      <tr><td><strong>Project links</strong></td><td>Every page links to the GitHub repo and documentation — fastest path to usage examples.</td></tr>
    </table>
  </div>
</div>

<!-- ─── Chapter 3: Git ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">🌿</span>
    <div>
      <h2>Chapter 3 — Git in Plain English</h2>
      <p class="ch-sub">Version control without the jargon</p>
    </div>
  </div>
  <div class="fd-section-body">
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      <strong>Git is like track changes in Word — but for your entire project folder, and with a time machine built in.</strong> Every time you "commit," git saves a complete snapshot of all your files. You can go back to any snapshot at any time. GitHub is just a website that stores your git snapshots in the cloud so colleagues can see them (and so you don't lose them if your laptop dies).
    </p>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin-bottom:0.5rem;">The four states of any change you make:</p>
    <div class="fd-flow">
      <div class="fd-flow-box">📝 Working<br><span style="font-size:0.7rem;font-weight:400;">(you edited a file)</span></div>
      <span class="fd-flow-arrow">→</span>
      <div class="fd-flow-box">📋 Staged<br><span style="font-size:0.7rem;font-weight:400;">(git add)</span></div>
      <span class="fd-flow-arrow">→</span>
      <div class="fd-flow-box">💾 Committed<br><span style="font-size:0.7rem;font-weight:400;">(git commit)</span></div>
      <span class="fd-flow-arrow">→</span>
      <div class="fd-flow-box">☁️ Pushed<br><span style="font-size:0.7rem;font-weight:400;">(git push → GitHub)</span></div>
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">&#127348; Watch this before class (required):</p>
    <p style="font-size:0.82rem;color:#37474F;margin:0 0 0.75rem;">
      <a href="https://youtu.be/sXXtA3Jb3PI?si=extuSAa-XjN473Xg" target="_blank" rel="noopener noreferrer" style="color:#1565C0;font-weight:700;">Git Explained in 100 Seconds (YouTube) ↗</a> — 2 minutes, covers exactly what you need.
    </p>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:0.75rem 0 0.5rem;">⚙️ One-time machine setup — run once ever:</p>
    <div class="fd-code-block">git config --global user.name  "Your Name"
git config --global user.email "you@khcc.jo"

<span class="comment"># Verify it worked:</span>
git config --global --list
<span class="comment"># user.name=Your Name</span>
<span class="comment"># user.email=you@khcc.jo</span></div>

    <div class="fd-tip">
      <strong>💡 Why it matters:</strong> every commit is stamped with your name and email. Skip this and your commits show a blank author — which matters when reviewing who changed what in a shared clinical codebase.
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">🚀 Starting a repository — two situations:</p>
    <table class="fd-table">
      <tr><th>Situation</th><th>Command</th><th>What happens</th></tr>
      <tr><td><strong>Starting fresh</strong> — new folder, no repo yet</td><td><code>git init</code></td><td>Creates a hidden <code>.git</code> folder. Your folder is now a git repo. Nothing committed yet.</td></tr>
      <tr><td><strong>Joining an existing project</strong> — repo already on GitHub</td><td><code>git clone https://github.com/org/repo.git</code></td><td>Downloads all files + full history into a new sub-folder. Already connected to GitHub.</td></tr>
    </table>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">Connecting a new <code>git init</code> repo to GitHub:</p>
    <div class="fd-code-block"><span class="comment"># 1. Create an EMPTY repo on github.com (no README, no .gitignore)</span>
<span class="comment"># 2. Copy the HTTPS URL, then run:</span>
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main   <span class="comment"># -u sets the upstream so future push/pull need no arguments</span>

<span class="comment"># Check your remote is correct at any time:</span>
git remote -v

<span class="comment"># Fix a wrong remote URL:</span>
git remote set-url origin https://github.com/correct/repo.git</div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">Your two most important diagnostic commands:</p>
    <div class="fd-code-block"><span class="comment"># git status — run before and after everything</span>
git status
<span class="comment"># On branch main</span>
<span class="comment"># Changes not staged for commit:</span>
<span class="comment">#   modified:   app.py       ← edited, not yet staged</span>
<span class="comment"># Untracked files:</span>
<span class="comment">#   init_db.py               ← new file, git doesn't know about it yet</span>

<span class="comment"># git log --oneline — see what was committed and whether it was pushed</span>
git log --oneline
<span class="comment"># a3f92c1 (HEAD -> main, origin/main)  add nephrotoxic drug alerts</span>
<span class="comment"># b81e044  add SQLite init and CrCl formula</span>
<span class="comment"># ↑ HEAD->main AND origin/main on same line = you're in sync with GitHub</span></div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">Daily commands:</p>
    <table class="fd-table">
      <tr><th>Command</th><th>When to use it</th></tr>
      <tr><td><code>git status</code></td><td><strong>Always first.</strong> Before add, before commit, when confused — run this.</td></tr>
      <tr><td><code>git log --oneline</code></td><td>See commit history and whether your latest is on GitHub.</td></tr>
      <tr><td><code>git add .</code></td><td>Stage all changed files</td></tr>
      <tr><td><code>git add filename</code></td><td>Stage one specific file</td></tr>
      <tr><td><code>git commit -m "message"</code></td><td>Save a snapshot locally</td></tr>
      <tr><td><code>git push</code></td><td>Upload commits to GitHub</td></tr>
      <tr><td><code>git pull</code></td><td>Download commits from GitHub — do this before starting work each day</td></tr>
      <tr><td><code>git restore .</code></td><td>Throw away unsaved changes to <strong>all</strong> files</td></tr>
      <tr><td><code>git restore filename</code></td><td>Throw away unsaved changes to one file</td></tr>
      <tr><td><code>git diff</code></td><td>See exactly what changed (lines added/removed) since last commit</td></tr>
      <tr><td><code>git diff --staged</code></td><td>See what's staged but not yet committed</td></tr>
      <tr><td><code>git diff main feature/my-branch</code></td><td>Compare two branches</td></tr>
    </table>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">🌿 Branching — work without breaking main:</p>
    <p style="font-size:0.82rem;color:#37474F;line-height:1.5;">A branch is a parallel copy of your code. Experiment on a branch; <code>main</code> stays clean and working. Every AIDI feature is developed on a branch — never directly on <code>main</code>.</p>
    <table class="fd-table">
      <tr><th>Command</th><th>What it does</th></tr>
      <tr><td><code>git branch</code></td><td>List all local branches. Current branch has a <code>*</code> beside it.</td></tr>
      <tr><td><code>git checkout -b feature/my-feature</code></td><td>Create a new branch and switch to it in one command</td></tr>
      <tr><td><code>git checkout main</code></td><td>Switch back to main</td></tr>
      <tr><td><code>git push -u origin feature/my-feature</code></td><td>Push a new branch to GitHub for the first time</td></tr>
      <tr><td><code>git branch -d feature/my-feature</code></td><td>Delete a branch locally after it's merged</td></tr>
      <tr><td><code>git push origin --delete feature/my-feature</code></td><td>Delete it on GitHub too</td></tr>
    </table>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">🍴 Forking — your own copy of someone else's repo:</p>
    <table class="fd-table">
      <tr><th></th><th>Fork</th><th>Branch</th></tr>
      <tr><td><strong>Lives in</strong></td><td>Your own GitHub account</td><td>Same repo</td></tr>
      <tr><td><strong>Use when</strong></td><td>You don't have write access to the original</td><td>You do have write access</td></tr>
      <tr><td><strong>Common for</strong></td><td>Adapting a template; contributing to open-source</td><td>Team feature work</td></tr>
    </table>
    <div class="fd-code-block"><span class="comment"># After forking on github.com, clone your fork:</span>
git clone https://github.com/YOUR-username/repo.git

<span class="comment"># Add the original repo as 'upstream' to pull updates from it:</span>
git remote add upstream https://github.com/ORIGINAL-owner/repo.git
git fetch upstream
git merge upstream/main   <span class="comment"># pull latest from original into your fork</span></div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">🔀 Merging — combining branches:</p>
    <div class="fd-code-block"><span class="comment"># Switch to the branch you want to merge INTO</span>
git checkout main
git pull                             <span class="comment"># make sure you're up to date first</span>
git merge feature/my-feature
git push</div>

    <div class="fd-danger">
      <strong>🚨 Merge conflict?</strong> Git will tell you which files have conflicts. Open the file — you'll see:<br>
      <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> (your version) ... <code>=======</code> ... <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/my-feature</code> (incoming).<br>
      Edit the file to keep what you want, delete the markers, then <code>git add filename</code> and <code>git commit</code>.<br>
      💡 VS Code shows a visual merge editor — click <strong>Resolve in Merge Editor</strong> for a side-by-side view with Accept buttons. Much easier than editing conflict markers by hand.
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">Connecting to GitHub (authentication):</p>
    <table class="fd-table">
      <tr><th>Method</th><th>How to do it</th><th>Best for</th></tr>
      <tr><td><strong>HTTPS + Token</strong> (easiest)</td><td>GitHub → Settings → Developer settings → Personal access tokens. Generate a token. Paste it as your password when git prompts.</td><td>First-timers</td></tr>
      <tr><td><strong>SSH key</strong> (slicker)</td><td>Run <code>ssh-keygen -t ed25519 -C "you@khcc.jo"</code>, then add the <code>.pub</code> key at github.com/settings/keys</td><td>Daily use</td></tr>
      <tr><td><strong>GitHub CLI</strong></td><td>Install <code>gh</code>, run <code>gh auth login</code> and follow the prompts</td><td>Quickest setup</td></tr>
    </table>

    <div class="fd-tip">
      <strong>💡 Undo cheat sheet:</strong><br>
      <code>git restore .</code> — throw away all unsaved changes<br>
      <code>git restore filename</code> — throw away changes to one file<br>
      <code>git restore --staged filename</code> — unstage a file you accidentally <code>git add</code>-ed<br>
      <code>git reset --soft HEAD~1</code> — undo your last commit but keep the changes<br>
      <code>git commit --amend -m "new message"</code> — fix the message on your last commit (only if not pushed yet)
    </div>

    <div class="fd-danger">
      <strong>🚨 Golden rule:</strong> If you've already pushed to a shared branch, <strong>don't</strong> rewrite history. Make a new commit that fixes the problem instead. Never <code>git push --force</code> unless you know exactly what you're doing.
    </div>
  </div>
</div>

<!-- ─── Chapter 4: Extensions ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">🧩</span>
    <div>
      <h2>Chapter 4 — Extensions (The Good Stuff)</h2>
      <p class="ch-sub">Install only what you need — each extension has a job</p>
    </div>
  </div>
  <div class="fd-section-body">
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      Open the Extensions panel with <code>Ctrl+Shift+X</code>. Search by name and click Install. Every extension adds power — but also slight slowness. Start with the must-haves below.
    </p>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin-bottom:0.5rem;">Must-have for every CCI student:</p>
    <div class="fd-extensions-grid">
      <div class="fd-ext-card"><strong>Python (Microsoft)</strong>Language support, error highlighting, debugging</div>
      <div class="fd-ext-card"><strong>Pylance</strong>Fast IntelliSense — autocomplete and type checking</div>
      <div class="fd-ext-card"><strong>Jupyter</strong>Run notebooks inside VS Code without switching apps</div>
      <div class="fd-ext-card"><strong>GitLens</strong>See who changed each line and why — invaluable for team code</div>
      <div class="fd-ext-card"><strong>Rainbow CSV</strong>Colour-coded columns in CSV files — huge for clinical data</div>
      <div class="fd-ext-card"><strong>Error Lens</strong>Inline error messages next to the broken line — no hunting</div>
      <div class="fd-ext-card"><strong>DotENV</strong>Syntax highlighting for <code>.env</code> files</div>
      <div class="fd-ext-card"><strong>Code Spell Checker</strong>Catches typos in prompts, docstrings, SQL comments</div>
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">For database work:</p>
    <div class="fd-extensions-grid">
      <div class="fd-ext-card"><strong>SQLite Viewer</strong>Open <code>.db</code> files directly — browse tables visually</div>
      <div class="fd-ext-card"><strong>SQL Server (mssql)</strong>Connect to AIDI-DB and run queries without leaving VS Code</div>
      <div class="fd-ext-card"><strong>Databricks</strong>Run notebooks against the KHCC workspace</div>
    </div>

    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1rem 0 0.5rem;">For AI coding:</p>
    <div class="fd-extensions-grid">
      <div class="fd-ext-card"><strong>Claude (for VS Code)</strong>Anthropic's agentic AI assistant — ask it to explain, refactor, or write code</div>
      <div class="fd-ext-card"><strong>GitHub Copilot</strong>In-editor completions — it predicts what you want to type next</div>
      <div class="fd-ext-card"><strong>REST Client / Thunder Client</strong>Test API endpoints without opening a browser</div>
    </div>

    <div class="fd-tip">
      <strong>💡 Share extensions with your team:</strong> Create a file at <code>.vscode/extensions.json</code> in your project with a <code>"recommendations": [...]</code> list. Anyone who opens the folder is automatically prompted to install all of them.
    </div>
  </div>
</div>

<!-- ─── Chapter 5: Repo Structure ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">📁</span>
    <div>
      <h2>Chapter 5 — What Goes Where (Project Structure)</h2>
      <p class="ch-sub">The minimum file layout every Python project at KHCC should have</p>
    </div>
  </div>
  <div class="fd-section-body">
    <p style="font-size:0.85rem;color:#37474F;line-height:1.6;margin-top:0;">
      Every Python project you build should look like this. Each file has exactly one job. No clutter, no mystery files.
    </p>

    <!-- Visual folder tree -->
    <div style="background:#1e1e1e;border-radius:0.6rem;padding:1rem 1.25rem;margin:0.75rem 0 1rem;overflow-x:auto;border:1px solid #333;">
      <div style="font-family:'Courier New',monospace;font-size:0.82rem;line-height:1.85;color:#D4D4D4;">
        <div style="color:#6A9955;margin-bottom:0.25rem;"># Your project folder — open this in VS Code</div>
        <div style="color:#4EC9B0;font-weight:700;">my-project/</div>
        <div>├── <span style="color:#CE9178;">.venv/</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Private Python + packages — NEVER commit</span></div>
        <div>├── <span style="color:#9CDCFE;">.gitignore</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Tells git what to ignore</span></div>
        <div>├── <span style="color:#F44747;">.env</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Actual secret values — NEVER commit</span></div>
        <div>├── <span style="color:#DCDCAA;">.env.example</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Template showing which secrets exist — commit</span></div>
        <div>├── <span style="color:#9CDCFE;">README.md</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# What this is &amp; how to run it — commit</span></div>
        <div>├── <span style="color:#9CDCFE;">requirements.txt</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Python packages list — commit</span></div>
        <div>├── <span style="color:#569CD6;">app.py</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Main Python file — commit</span></div>
        <div>├── <span style="color:#569CD6;">init_db.py</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Creates the database — commit</span></div>
        <div>└── <span style="color:#CE9178;">data/</span><span style="color:#6A9955;margin-left:1rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Local data files — usually .gitignored</span></div>
      </div>
    </div>

    <!-- Commit/don't commit table -->
    <p style="font-size:0.82rem;font-weight:700;color:#4A3700;margin:1.25rem 0 0.5rem;">Every file's rule — commit or never?</p>

    <table class="fd-table">
      <tr>
        <th style="width:140px;">File</th>
        <th style="width:90px;text-align:center;">Commit?</th>
        <th>Why</th>
      </tr>
      <tr>
        <td><code>README.md</code></td>
        <td style="text-align:center;"><span style="background:#C8E6C9;color:#1B5E20;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">YES ✓</span></td>
        <td style="font-size:0.82rem;">What is this project? How do I run it? Any clinical caveats? Every repo starts here.</td>
      </tr>
      <tr>
        <td><code>requirements.txt</code></td>
        <td style="text-align:center;"><span style="background:#C8E6C9;color:#1B5E20;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">YES ✓</span></td>
        <td style="font-size:0.82rem;">The list of packages. Anyone runs <code>pip install -r requirements.txt</code> to reproduce your exact environment.</td>
      </tr>
      <tr>
        <td><code>.gitignore</code></td>
        <td style="text-align:center;"><span style="background:#C8E6C9;color:#1B5E20;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">YES ✓</span></td>
        <td style="font-size:0.82rem;">The exclusion list. Commit it so all collaborators share the same "don't track" rules.</td>
      </tr>
      <tr>
        <td><code>.env.example</code></td>
        <td style="text-align:center;"><span style="background:#C8E6C9;color:#1B5E20;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">YES ✓</span></td>
        <td style="font-size:0.82rem;">Shows <em>which</em> secret variables exist with placeholder values like <code>OPENAI_API_KEY=your-key-here</code>. Safe to share.</td>
      </tr>
      <tr>
        <td><code>app.py</code></td>
        <td style="text-align:center;"><span style="background:#C8E6C9;color:#1B5E20;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">YES ✓</span></td>
        <td style="font-size:0.82rem;">Your source code — this is the whole point of the repo.</td>
      </tr>
      <tr>
        <td><code>.env</code></td>
        <td style="text-align:center;"><span style="background:#FFCDD2;color:#B71C1C;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">NEVER ✗</span></td>
        <td style="font-size:0.82rem;"><strong>Contains your actual API keys, passwords, database strings.</strong> Must be in <code>.gitignore</code>. Not once, not by accident, not even "just to test."</td>
      </tr>
      <tr>
        <td><code>.venv/</code></td>
        <td style="text-align:center;"><span style="background:#FFCDD2;color:#B71C1C;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">NEVER ✗</span></td>
        <td style="font-size:0.82rem;">Hundreds of MB of installed packages. Anyone can recreate it with <code>pip install -r requirements.txt</code>. Never commit it.</td>
      </tr>
      <tr>
        <td><code>*.db</code></td>
        <td style="text-align:center;"><span style="background:#FFCDD2;color:#B71C1C;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">NEVER ✗</span></td>
        <td style="font-size:0.82rem;">Databases may contain patient data or PHI. Exclude by default; regenerate from <code>init_db.py</code>.</td>
      </tr>
    </table>

    <div class="fd-tip">
      <strong>💡 When you finish a project:</strong> Run <code>pip freeze &gt; requirements.txt</code> to capture the exact version of every installed package. Future-you (and your colleagues) will thank you.
    </div>

    <div class="fd-danger">
      <strong>🚨 Minimum .gitignore entries — copy this into every project:</strong>
      <div style="background:#2a0a0a;border-radius:0.4rem;padding:0.75rem 1rem;margin-top:0.5rem;font-family:'Courier New',monospace;font-size:0.82rem;line-height:1.8;color:#FFCDD2;">
        <div><span style="color:#F44747;">.env</span><span style="color:#888;margin-left:1rem;"># secrets — never commit</span></div>
        <div><span style="color:#F44747;">.venv/</span><span style="color:#888;margin-left:1rem;"># virtual environment — regenerate with pip install</span></div>
        <div><span style="color:#F44747;">__pycache__/</span><span style="color:#888;margin-left:1rem;"># compiled Python cache</span></div>
        <div><span style="color:#F44747;">*.db</span><span style="color:#888;margin-left:1rem;"># databases — may contain patient data</span></div>
        <div><span style="color:#F44747;">.DS_Store</span><span style="color:#888;margin-left:1rem;"># macOS metadata junk</span></div>
      </div>
    </div>
  </div>
</div>

<!-- ─── The Setup Ritual ─── -->
<div class="fd-section">
  <div class="fd-section-head">
    <span class="ch-icon">🚀</span>
    <div>
      <h2>The 8-Step Setup Ritual</h2>
      <p class="ch-sub">Do these steps in this exact order for every new Python project</p>
    </div>
  </div>
  <div class="fd-section-body">
    <ul class="fd-steps">
      <li><span class="step-num">1</span><div><strong>Open the project folder</strong> in VS Code — File → Open Folder, or drag the folder onto the VS Code icon.</div></li>
      <li><span class="step-num">2</span><div><strong>Open the integrated terminal</strong> — press <code>Ctrl+`</code> or go to View → Terminal.</div></li>
      <li><span class="step-num">3</span><div><strong>Create the virtual environment</strong> — type <code>python -m venv .venv</code> and press Enter. This creates a private Python for this project.</div></li>
      <li><span class="step-num">4</span><div><strong>Activate the venv</strong> — on Windows: <code>.venv\Scripts\activate</code> &nbsp;|&nbsp; on Mac/Linux: <code>source .venv/bin/activate</code>. You should see <code>(.venv)</code> appear in your prompt.</div></li>
      <li><span class="step-num">5</span><div><strong>Select the venv as the VS Code interpreter</strong> — click the Python version shown in the <strong>bottom-right</strong> corner of VS Code (or press <code>Ctrl+Shift+P</code> → "Python: Select Interpreter") and pick the one that says <code>.venv</code>. <strong>This is the step everyone forgets.</strong></div></li>
      <li><span class="step-num">6</span><div><strong>Create requirements.txt</strong> — list the packages your project needs, one per line (e.g., <code>gradio</code>, <code>python-dotenv</code>).</div></li>
      <li><span class="step-num">7</span><div><strong>Install packages</strong> — run <code>pip install -r requirements.txt</code>. Because the venv is active, packages go to the right place.</div></li>
      <li><span class="step-num">8</span><div><strong>Create README.md</strong> — write what the project does, how to run it, and any clinical caveats. Future-you will thank you.</div></li>
    </ul>

    <div class="fd-tip">
      <strong>💡 Memorise this:</strong> Create venv → activate venv → SELECT INTERPRETER → then pip install. The interpreter selection step is what connects VS Code's Run button to your private Python. Skip it and nothing works.
    </div>
  </div>
</div>

<div class="fd-footer">
  KHCC Cancer Care Informatics &middot; Session 9 &middot; VS Code for Dummies — the non-jargon edition
</div>
