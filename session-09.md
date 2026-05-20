---
layout: default
title: "Session 9"
permalink: /session-09/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #1565C0 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #1565C0 !important; font-weight: 800 !important; }
  .page-content { padding-top: 0 !important; }

  .s1-header {
    padding: 1.75rem 0;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .s1-header .back {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #1565C0;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #90CAF9;
    background: #E3F2FD;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #BBDEFB; }

  .s1-header-text h1 {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1B2A4A;
    margin: 0;
    line-height: 1.25;
  }

  .s1-header-text .meta {
    font-size: 0.78rem;
    color: #90A4AE;
    margin: 0.2rem 0 0;
  }

  .s1-goal {
    background: linear-gradient(135deg, #E3F2FD, #EDE7F6);
    border: 1px solid #90CAF9;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #1565C0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.3rem;
  }

  .s1-goal p {
    margin: 0;
    font-size: 0.88rem;
    color: #37474F;
    line-height: 1.55;
  }

  .s1-prereq {
    background: #FFF8E1;
    border: 1px solid #FFE082;
    border-radius: 0.75rem;
    padding: 0.85rem 1.25rem;
    margin-bottom: 2rem;
    font-size: 0.82rem;
    color: #5D4037;
    line-height: 1.55;
  }

  .s1-prereq strong { color: #E65100; }

  .s1-lesson {
    border: 1px solid #E0E0E0;
    border-radius: 0.85rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .s1-lesson:hover { border-color: #B0BEC5; }

  .s1-lesson-head {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.25rem;
    background: #FAFAFA;
    border-bottom: 1px solid #F0F0F0;
  }

  .s1-lesson-num {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  .s1-lesson-head h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #263238;
    line-height: 1.3;
  }

  .s1-lesson-head .time {
    font-size: 0.7rem;
    color: #90A4AE;
    margin: 0.1rem 0 0;
  }

  .s1-lesson-body { padding: 1rem 1.25rem; }

  .s1-lesson-body .goals-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #78909C;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 0.4rem;
  }

  .s1-lesson-body ul {
    margin: 0 0 1rem;
    padding-left: 1.1rem;
    list-style: none;
  }

  .s1-lesson-body ul li {
    font-size: 0.85rem;
    color: #455A64;
    line-height: 1.5;
    margin-bottom: 0.25rem;
    position: relative;
    padding-left: 0.2rem;
  }

  .s1-lesson-body ul li::before {
    content: "▸";
    position: absolute;
    left: -1rem;
    color: #B0BEC5;
  }

  .s1-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .s1-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.85rem;
    border-radius: 0.5rem;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.15s ease;
    border: 1px solid;
  }

  .s1-btn:visited { color: inherit; }

  .s1-btn-notebook {
    background: #FFF8E1;
    border-color: #FFE082;
    color: #F57F17 !important;
  }
  .s1-btn-notebook:hover { background: #FFECB3; transform: translateY(-1px); }

  .s1-btn-practice {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }
  .s1-btn-practice:hover { background: #C8E6C9; transform: translateY(-1px); }

  .s1-btn-quiz {
    background: #E3F2FD;
    border-color: #90CAF9;
    color: #1565C0 !important;
  }
  .s1-btn-quiz:hover { background: #BBDEFB; transform: translateY(-1px); }

  .s1-btn-instructions {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #7B1FA2 !important;
  }
  .s1-btn-instructions:hover { background: #E1BEE7; transform: translateY(-1px); }

  .s1-btn-video {
    background: #FCE4EC;
    border-color: #F48FB1;
    color: #C62828 !important;
  }
  .s1-btn-video:hover { background: #F8BBD9; transform: translateY(-1px); }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }
  .s1-btn-resource:hover { background: #CFD8DC; transform: translateY(-1px); }

  .s1-btn-handout {
    background: #E0F7FA;
    border-color: #80DEEA;
    color: #00695C !important;
  }
  .s1-btn-handout:hover { background: #B2EBF2; transform: translateY(-1px); }

  .s1-btn-icon { font-size: 0.9rem; line-height: 1; }

  .s1-assignment {
    background: #1B2A4A;
    color: #fff;
    border-radius: 0.85rem;
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .s1-assignment h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: #FFC107;
  }

  .s1-assignment ol {
    margin: 0;
    padding-left: 1.25rem;
    color: #CFD8DC;
    font-size: 0.85rem;
    line-height: 1.7;
  }

  .s1-footer-note {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    font-size: 0.72rem;
    color: #B0BEC5;
    border-top: 1px solid #ECEFF1;
    margin-top: 2rem;
  }
</style>

<div class="s1-header">
  <a class="back" href="{{ site.baseurl }}/">&#8249; Home</a>
  <div class="s1-header-text">
    <h1>Session 9: Local Development — VS Code, Git &amp; Hugging Face</h1>
    <p class="meta">6 lessons + wrap-up &middot; Interactive practice &amp; quizzes &middot; 1 clinical app assignment &middot; 2 hours</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Move from notebooks to a complete local-development loop — build a clinical Cockcroft-Gault calculator with a Gradio UI and SQLite drug-alert database, version it with git, push it to GitHub, and deploy it live on Hugging Face Spaces. Every habit learned (venv, .gitignore, secrets in .env, parameterized SQL, public-infrastructure boundaries) protects you and KHCC patients when the stakes are real.</p>
</div>

<div class="s1-prereq">
  <strong>Pre-session homework:</strong> Install VS Code + Python 3.11, and create free accounts at <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a> and <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">Hugging Face</a>. Bring your laptop with VS Code open and both accounts ready. &middot; <strong>Clinical anchor:</strong> Cockcroft-Gault creatinine clearance calculator with nephrotoxic-drug alerts.
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1565C0;">1</div>
    <div>
      <h3>VS Code Setup &mdash; Terminal, venv, requirements, README</h3>
      <p class="time">~20 min &middot; 10 min content / 10 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Distinguish IDE from notebook: folder of .py files vs. cells-in-memory — why production clinical systems use the former</li>
      <li>Create a virtual environment, activate it, and select it as VS Code's interpreter (the single most-missed step)</li>
      <li>Execute the full 8-step setup ritual: open folder → terminal → venv → activate → select interpreter → requirements.txt → pip install → README.md</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson1_vscode_setup/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_9/handouts/vs_code_for_dummies/" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> VS Code for Dummies
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson1_setup_checklist.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Setup Checklist
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson1_vscode_setup.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://code.visualstudio.com/docs/python/python-tutorial" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> VS Code Python docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">2</div>
    <div>
      <h3>.gitignore and the Secrets Mindset</h3>
      <p class="time">~15 min &middot; 8 min content / 7 min lab &middot; most important 15 min of the session</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Apply the three-file pattern: .env (never committed), .env.example (committed), .gitignore (committed)</li>
      <li>Know the only correct response to a leaked API key: rotate immediately — not delete, not force-push</li>
      <li>Apply the journal-article test: "if you wouldn't print it in a methods section, it goes in .gitignore"</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson2_gitignore_secrets/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson2_should_commit.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Should I Commit?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson2_gitignore_secrets.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> GitHub: Removing sensitive data
      </a>
      <a class="s1-btn s1-btn-resource" href="https://pypi.org/project/python-dotenv/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> python-dotenv docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#2E7D32;">3</div>
    <div>
      <h3>Git + GitHub from VS Code</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Map the four git states (working → staged → committed → pushed) to VS Code Source Control panel buttons</li>
      <li>Run the pre-flight check: confirm .venv/ does NOT appear in staged changes before every push</li>
      <li>Authenticate to GitHub via HTTPS + PAT or SSH key; recover from common push errors</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson3_git_github/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-video" href="https://youtu.be/sXXtA3Jb3PI?si=extuSAa-XjN473Xg" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Git explained (video — required)
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson3_git_command_picker.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Git Command Picker
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson3_git_github.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> GitHub SSH authentication
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> GitHub Personal Access Tokens
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>Build the Medical App (Gradio + SQLite)</h3>
      <p class="time">~30 min &middot; 12 min content / 18 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build a Gradio UI from a Python function — the function-to-UI pattern used in iNotes and AIDI prototypes</li>
      <li>Apply the Cockcroft-Gault formula with the 0.85 female correction; query nephrotoxic drugs via parameterized SQLite</li>
      <li>Implement the auto-init pattern: <code>if not os.path.exists('drugs.db'): init_db.create_db()</code> — critical for Hugging Face deployment</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson4_build_medical_app/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_9/templates/student/" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Student Template
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_9/templates/solutions/" target="_blank">
        <span class="s1-btn-icon">&#9989;</span> Solution Template
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson4_crcl_logic.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: CrCl Logic Builder
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson4_medical_app.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.gradio.app/docs/gradio/interface" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Gradio Interface docs
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.python.org/3/library/sqlite3.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Python sqlite3 docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#6A1B9A;">5</div>
    <div>
      <h3>Deploy to Hugging Face Space</h3>
      <p class="time">~25 min &middot; 10 min content / 15 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Understand a Space as an auto-deploying git repo: push → rebuild → live URL in ~90 seconds</li>
      <li>Write the YAML README front-matter header (title, sdk, sdk_version, app_file, license) that HF requires</li>
      <li>Inject secrets via Settings → Variables (never in code); identify the firm boundary — PHI and internal KHCC data never touch public Spaces</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson5_huggingface_deploy/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson5_deploy_sanity.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Deployment Sanity Check
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson5_huggingface_deploy.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/docs/hub/spaces-overview" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HF Spaces docs
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/docs/hub/spaces-sdks-gradio" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HF Spaces + Gradio SDK
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00695C;">6</div>
    <div>
      <h3>Python Instead of the Command Line &mdash; os, pathlib, shutil, subprocess</h3>
      <p class="time">~20 min &middot; 8 min content / 12 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use <code>pathlib.Path</code> for cross-platform paths — <code>Path("data") / "file.csv"</code> works identically on Mac, Linux, and Windows</li>
      <li>Replace <code>find</code> / <code>ls -R</code> with <code>Path.rglob()</code> and <code>os.walk()</code>; replace <code>cp -p</code> / <code>rm -rf</code> / <code>tar</code> with <code>shutil.copy2</code> / <code>rmtree</code> / <code>make_archive</code></li>
      <li>Call shell tools safely with <code>subprocess.run([...], capture_output=True, text=True)</code> — args as list, never <code>shell=True</code> with user input</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_9/instructions/lesson6_python_filesystem/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_9/practices/practice_lesson6_bash_to_python.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Bash &#8594; Python
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_9/quizzes/quiz_lesson6_python_filesystem.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.python.org/3/library/pathlib.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> pathlib docs
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.python.org/3/library/shutil.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> shutil docs
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.python.org/3/library/subprocess.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> subprocess docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 7 Wrap-Up ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">7</div>
    <div>
      <h3>Wrap-Up &mdash; Review &amp; Consolidation</h3>
      <p class="time">~5 min &middot; reflection + self-check</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Session takeaways</p>
    <ul>
      <li><strong>Lesson 1</strong> — Folder = project; venv for isolation; select interpreter; requirements.txt for reproducibility</li>
      <li><strong>Lesson 2</strong> — .env never committed; .env.example always committed; rotate-don't-hide leaked keys</li>
      <li><strong>Lesson 3</strong> — Four states: working → staged → committed → pushed; git status is always your first move</li>
      <li><strong>Lesson 4</strong> — Gradio = function-to-UI; SQLite = single-file DB; Cockcroft-Gault + parameterized queries + auto-init</li>
      <li><strong>Lesson 5</strong> — Space = auto-deploying git repo; YAML README header required; PHI never on public Spaces</li>
      <li><strong>Lesson 6</strong> — pathlib for cross-platform paths; rglob/os.walk for recursive search; shutil.copy2/rmtree/make_archive for file ops; subprocess.run with arg-list (no shell=True)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_9/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_9/handouts/vs_code_for_dummies/" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> VS Code for Dummies — Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-resource" href="https://code.visualstudio.com/docs/python/environments" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Python environments in VS Code
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.gradio.app/guides/quickstart" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Gradio Quickstart
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 9 Assignment &mdash; Ship Your Own Clinical Mini-App</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Pick a small clinical calculator or lookup tool different from Cockcroft-Gault. Build it as a standalone Gradio + SQLite app, version it on GitHub with &ge;5 meaningful commits, and deploy it as a public Hugging Face Space. Submit both the GitHub URL and the HF Space URL plus a 200&ndash;300-word written reflection.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.75rem;">
    <strong style="color:#FFC107;">Clinical calculator ideas:</strong> BMI + obesity-class drug alerts &middot; Body Surface Area for chemo dosing &middot; MELD score for liver disease severity &middot; CHA&#8322;DS&#8322;-VASc for AFib stroke risk &middot; or your own choice.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Grading Rubric</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Local project setup (25%):</strong> correct venv, interpreter, requirements.txt, .gitignore (right exclusions), .env.example, README.md, clean initial commit</li>
      <li><strong style="color:#CFD8DC;">App functionality (25%):</strong> parameterized queries, auto-init pattern, &ge;5 meaningful commits, runs locally — no hardcoded secrets, no SQL injection</li>
      <li><strong style="color:#CFD8DC;">Deployment (25%):</strong> both URLs work; Space loads cleanly; YAML README header complete; calculator produces correct outputs end-to-end</li>
      <li><strong style="color:#CFD8DC;">Written reflection (25%):</strong> specific debug stories, concrete KHCC-deployment differences, identifies real PHI risks with specific mitigations</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 9 of 15
</div>
