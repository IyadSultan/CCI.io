---
layout: default
title: "Session 11"
permalink: /session-11/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #EF6C00 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #EF6C00 !important; font-weight: 800 !important; }
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
    color: #EF6C00;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #FFCC80;
    background: #FFF3E0;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #FFE0B2; }

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
    background: linear-gradient(135deg, #FFF3E0, #FBE9E7);
    border: 1px solid #FFCC80;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #E65100;
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
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #EF6C00 !important;
  }
  .s1-btn-quiz:hover { background: #FFE0B2; transform: translateY(-1px); }

  .s1-btn-instructions {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #7B1FA2 !important;
  }
  .s1-btn-instructions:hover { background: #E1BEE7; transform: translateY(-1px); }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }
  .s1-btn-resource:hover { background: #CFD8DC; transform: translateY(-1px); }

  .s1-btn-handout {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }
  .s1-btn-handout:hover { background: #FFE0B2; transform: translateY(-1px); }

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
    <h1>Session 11: From a Web Page to a Deployed Clinical App</h1>
    <p class="meta">8 lessons + capstone &middot; Interactive practice &amp; quizzes &middot; ER triage deploy assignment &middot; ~3 hours</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Session 10 taught you to <em>design and build</em> clinical software with Claude Code. Session 11 takes down the wall every student hits next: the app runs only on your laptop. You will climb from HTML in a text editor through the full web stack, tour and extend the runnable <strong>ER Triage Extractor</strong> Django app, and end with a live URL on Render you can text to a colleague. The Django project lives in your own <strong>private GitHub repo</strong> — not this course site.</p>
</div>

<div class="s1-prereq">
  <strong>Pre-session homework:</strong> Complete Session 9 (venv, git, .env/.gitignore) and Session 10 (Claude Code + ER triage PRD). Create a free <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a> account and a free <a href="https://render.com" target="_blank" rel="noopener noreferrer">Render</a> account. Bring a laptop with Python 3.11+ and VS Code ready. &middot; <strong>Clinical anchor:</strong> ER Triage Extractor — nurse intake, ESI-like acuity, oncologic-emergency flags, doctor queue, optional dashboard extension.
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#EF6C00;">1</div>
    <div>
      <h3>What Is a Web Page? HTML from Scratch</h3>
      <p class="time">~20 min &middot; 10 min content / 10 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Explain that a web page is a text file the browser draws — tags mark structure (headings, lists, links, forms)</li>
      <li>Build a page from the standard skeleton: <code>DOCTYPE</code>, <code>head</code>, <code>body</code>, save as <code>.html</code>, open in the browser</li>
      <li>Apply the edit-save-refresh loop; debug unclosed tags (the most common beginner mistake)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson1_html/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson1_html.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Spot the Broken HTML
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson1_html.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> MDN HTML docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#F57C00;">2</div>
    <div>
      <h3>Making It Move: JavaScript &amp; the Frontend Landscape</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Distinguish HTML (structure), CSS (appearance), and JavaScript (behavior)</li>
      <li>Wire a click handler: read an input, compute a value, write a warning back to the page</li>
      <li>Know why clinical logic that must be trusted belongs on the backend, not in the browser</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson2_javascript_frontends/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson2_javascript_frontends.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Frontend or Backend?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson2_javascript_frontends.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> MDN JavaScript docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">3</div>
    <div>
      <h3>The Full Stack: Frontend, Backend, and Where Django Lives</h3>
      <p class="time">~20 min &middot; 10 min content / 10 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Map the request/response cycle: browser sends data, server validates and decides, browser draws the result</li>
      <li>Place trusted logic and secrets on the backend; never let the browser be the law</li>
      <li>Explain Django as server-side rendering: URL &rarr; view &rarr; template, with models and a database</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson3_full_stack/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson3_full_stack.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Frontend, Backend, or Database?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson3_full_stack.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.djangoproject.com/en/stable/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Django documentation
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#BF360C;">4</div>
    <div>
      <h3>The Smallest Django That Runs</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Distinguish a Django <em>project</em> (whole site) from an <em>app</em> (one feature)</li>
      <li>Run <code>startproject</code>, <code>startapp</code>, <code>migrate</code>, and <code>runserver</code> on localhost</li>
      <li>Wire the URL &rarr; view &rarr; template loop; register the app in <code>INSTALLED_APPS</code></li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson4_smallest_django/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson4_smallest_django.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Build the Smallest Django
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson4_smallest_django.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.djangoproject.com/start/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Django quickstart
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00838F;">5</div>
    <div>
      <h3>Meet the ER-Triage App</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab &middot; capstone begins</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run the ER Triage Extractor locally: venv, <code>pip install -r requirements.txt</code>, <code>seed_demo</code>, <code>runserver</code></li>
      <li>Trace a button from URL &rarr; view &rarr; services: deterministic acuity in <code>acuity.py</code>, LLM flags in <code>oncologic_emergency.py</code></li>
      <li>Read a codebase by following the request — not by memorizing every line</li>
    </ul>
    <p style="margin:0 0 0.75rem;font-size:0.82rem;color:#006064;background:#E0F7FA;border:2px solid #00838F;border-radius:0.5rem;padding:0.55rem 0.75rem;line-height:1.45;">
      <strong>&#11088; Your Django app:</strong> Copy <code>session_11/templates/solutions/er_triage_app/</code> into your own folder, then push it to a <strong>private GitHub repo</strong>. The course site hosts reference copies only — your deployable project stays in your repo.
    </p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson5_meet_the_app/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_11/templates/solutions/er_triage_app/" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Reference App (solution)
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson5_meet_the_app.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Code Scavenger Hunt
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson5_meet_the_app.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1565C0;">6</div>
    <div>
      <h3>Extend It: Add Your Own Django App</h3>
      <p class="time">~30 min &middot; 15 min content / 15 min lab &middot; core lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Add a <code>dashboard</code> app: <code>startapp</code> &rarr; <code>INSTALLED_APPS</code> &rarr; view &rarr; template &rarr; URL</li>
      <li>Query existing <code>TriageEvent</code> rows from another app — one database, many apps</li>
      <li>Inherit <code>base.html</code> with <code>extends</code> and <code>block</code> for shared layout</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson6_extend_it/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_11/templates/student/er_triage_app/" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> Student Starter
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_11/templates/solutions/er_triage_app_with_dashboard/" target="_blank">
        <span class="s1-btn-icon">&#9989;</span> Solution (with dashboard)
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson6_extend_it.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Add App in Order
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson6_extend_it.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 7 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#2E7D32;">7</div>
    <div>
      <h3>Ship It: GitHub &rarr; Render &rarr; Live URL</h3>
      <p class="time">~25 min &middot; 10 min content / 15 min lab &middot; capstone ships</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Push the extended app to a <strong>private GitHub repo</strong> with <code>.env</code> and <code>db.sqlite3</code> excluded</li>
      <li>Deploy on Render: <code>build.sh</code>, gunicorn, <code>DEBUG=False</code>, <code>ALLOWED_HOSTS</code>, env vars for secrets</li>
      <li>Debug a first failed deploy from the log — then celebrate a URL that works on your phone</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson7_ship_on_render/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Source
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson7_ship_on_render.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Render Deploy Checklist
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson7_ship_on_render.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://render.com/docs/deploy-django" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Render Django deploy docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 8 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">8</div>
    <div>
      <h3>Cheat Sheet + What to Build Next</h3>
      <p class="time">~15 min &middot; reference card + reflection</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Session takeaways</p>
    <ul>
      <li><strong>The stack:</strong> HTML/CSS/JS in the browser; Django + Python on the server; SQLite (or Postgres) for rows</li>
      <li><strong>The Django loop:</strong> <code>startapp</code> &rarr; <code>INSTALLED_APPS</code> &rarr; view &rarr; template &rarr; URL</li>
      <li><strong>The deploy loop:</strong> <code>git push</code> &rarr; Render rebuilds &rarr; same live URL — secrets only in env vars</li>
      <li><strong>Closing rule:</strong> Session 10 built software; Session 11 shipped it; Session 12 makes it safe</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_11/instructions/lesson8_cheat_sheet/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_11/cheat_sheet/" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Printable Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_11/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_11/practices/practice_lesson8_cheat_sheet.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Sort the Whole Stack
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_11/quizzes/quiz_lesson8_cheat_sheet.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 11 Assignment &mdash; Deploy Your ER Triage App with Dashboard</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Extend the ER Triage Extractor with the <code>dashboard</code> app (acuity counts + emergency flags), push the full Django project to a <strong>private GitHub repository</strong>, and deploy it live on Render. Submit the Render URL, grant instructor access to your private repo, a screenshot of the dashboard at <code>/dashboard/</code>, and a 200&ndash;300-word reflection on one deploy failure you fixed and why <code>.env</code> must never be committed.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.75rem;">
    <strong style="color:#FFC107;">Stretch goals:</strong> add a second small feature through the same <code>startapp</code> loop &middot; wire an optional <code>OPENAI_API_KEY</code> on Render and confirm oncologic-emergency flags &middot; upgrade from SQLite to Render Postgres.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Grading Rubric</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Dashboard extension (25%):</strong> new <code>dashboard</code> app registered, view queries <code>TriageEvent</code>, template extends <code>base.html</code>, URL at <code>/dashboard/</code></li>
      <li><strong style="color:#CFD8DC;">Private repo hygiene (25%):</strong> <code>.gitignore</code> excludes <code>.env</code>, <code>.venv</code>, <code>db.sqlite3</code>; <code>.env.example</code> present; &ge;3 meaningful commits; no secrets in history</li>
      <li><strong style="color:#CFD8DC;">Live deployment (25%):</strong> Render URL loads doctor queue and dashboard; <code>build.sh</code> runs migrate; <code>DEBUG=False</code>; secrets set as env vars only</li>
      <li><strong style="color:#CFD8DC;">Written reflection (25%):</strong> names a specific deploy error and fix, explains frontend vs backend for acuity, identifies one risk of a public URL with fake data vs real PHI</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 11 of 15
</div>
