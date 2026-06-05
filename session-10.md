---
layout: default
title: "Session 10"
permalink: /session-10/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #00838F !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #00838F !important; font-weight: 800 !important; }
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
    color: #00838F;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #80DEEA;
    background: #E0F7FA;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #B2EBF2; }

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
    background: linear-gradient(135deg, #E0F7FA, #E8F5E9);
    border: 1px solid #80DEEA;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #00838F;
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
    background: #E0F7FA;
    border-color: #80DEEA;
    color: #00838F !important;
  }
  .s1-btn-quiz:hover { background: #B2EBF2; transform: translateY(-1px); }

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
    <h1>Session 10: Building Clinical AI Software with Claude Code</h1>
    <p class="meta">10 lessons + capstone &middot; Interactive practice &amp; quizzes &middot; Software Factory assignment &middot; ~4.5 hours</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Session 9 taught the IDE. Session 10 teaches the <strong>agent inside the IDE</strong>. By the end you will have used Claude Code's full feature surface — PRDs, CLAUDE.md, skills, MCP, subagents, worktrees, hooks, and the seven-agent <strong>Software Factory</strong> pipeline — to ship a working Django ER triage application. The chain is the same one the KHCC AI Office uses on production work: PRD &rarr; CLAUDE.md &rarr; skills + agents + hooks &rarr; worktree-parallelized build &rarr; eval-gated deploy.</p>
</div>

<div class="s1-prereq">
  <strong>Pre-session homework:</strong> Complete Session 9 (venv, git, .env/.gitignore). Install <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank" rel="noopener noreferrer">Claude Code</a> and authenticate with your Anthropic account. Bring a laptop with VS Code open and a terminal ready. &middot; <strong>Clinical anchor:</strong> Django ER triage app — nurse intake form, ESI-like acuity, oncologic-emergency extraction, doctor queue.
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00838F;">1</div>
    <div>
      <h3>Writing a PRD with the PRD-Builder Skill</h3>
      <p class="time">~20 min &middot; 10 min content / 10 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Explain why a PRD prevents the "build-then-realize" failure mode before any code is written</li>
      <li>Invoke the PRD-Builder skill: classify (AIDI clinical vs generic) &rarr; checkpoint &rarr; draft</li>
      <li>Read <code>[TBD]</code> and <code>[assumed — confirm]</code> markers as surfaced gaps, not errors</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson1_prd/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_10/templates/skills/prd-builder/SKILL.md" target="_blank">
        <span class="s1-btn-icon">&#128209;</span> PRD-Builder Skill
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson1_prd.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: PRD Triage
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson1_prd.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_10/claude_code_for_dummies/book.html" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Claude Code for Dummies
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00695C;">2</div>
    <div>
      <h3>Memory: CLAUDE.md</h3>
      <p class="time">~20 min &middot; 10 min content / 10 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Distinguish personal, project, and directory-level CLAUDE.md files and when each applies</li>
      <li>Apply the litmus test: "Would Claude make a mistake without this line?" — keep under ~150 instructions</li>
      <li>Write a starter clinical CLAUDE.md: stack, run/test commands, PHI rules, tool quirks</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson2_claude_md/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson2_claude_md.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: CLAUDE.md Editor
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson2_claude_md.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.anthropic.com/en/docs/claude-code/memory" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Claude Code memory docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#5E35B1;">3</div>
    <div>
      <h3>Skills (and Output Styles)</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Contrast CLAUDE.md (always-on rules) with skills (on-demand playbooks in <code>.claude/skills/</code>)</li>
      <li>Write a SKILL.md with YAML frontmatter — the description field is the trigger Claude matches on</li>
      <li>Organize <code>references/</code>, <code>templates/</code>, and <code>scripts/</code> subfolders without bloating baseline context</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson3_skills/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson3_skills.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Skill Description Writer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson3_skills.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.anthropic.com/en/docs/claude-code/skills" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Claude Code skills docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">4</div>
    <div>
      <h3>MCP Servers and Anthropic Connectors</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Explain MCP as Claude's interface engine — Connectors (curated) vs custom servers (self-hosted)</li>
      <li>Choose install scope: local, user, or project (<code>.mcp.json</code> checked into git for team databases)</li>
      <li>Apply the clinical rule: database MCPs are <strong>read-only by default</strong> — SELECT only</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson4_mcp_connectors/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson4_mcp_connectors.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: MCP Scope Picker
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson4_mcp_connectors.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Model Context Protocol
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">5</div>
    <div>
      <h3>Subagents and Agent Teams</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Define a subagent: own context window, system prompt, tool whitelist, optional model (Haiku vs Sonnet)</li>
      <li>Know when to use a subagent (context hygiene, focused expertise, parallelism) vs the main agent</li>
      <li>Install the three Factory subagents: codebase-researcher, story-writer, spec-writer</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson5_subagents/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson5_subagents.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Subagent Designer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson5_subagents.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.anthropic.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Subagents docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1565C0;">6</div>
    <div>
      <h3>Worktrees and Workflows</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Separate worktrees (parallel isolated branches) from workflows (orchestrated agent chains with approval gates)</li>
      <li>Launch parallel Claudes with <code>claude --worktree feature-name</code> without file conflicts</li>
      <li>Encode a multi-stage workflow as a skill — the Software Factory is the capstone example</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson6_worktrees_workflows/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson6_worktrees_workflows.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Worktree vs Workflow
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson6_worktrees_workflows.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.anthropic.com/en/docs/claude-code/common-workflows" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Common workflows docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 7 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#558B2F;">7</div>
    <div>
      <h3>Long-Running: Loops, Schedules, Hooks</h3>
      <p class="time">~25 min &middot; 12 min content / 13 min lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Use <code>/loop</code> for recurring checks and headless <code>claude -p</code> for scheduled cron jobs</li>
      <li>Configure hooks in <code>.claude/settings.json</code> — PreToolUse blocks, PostToolUse formats, Stop runs eval suite</li>
      <li>Apply the principle: CLAUDE.md for suggestions (~80%), hooks for requirements (100%)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson7_loops_schedules_hooks/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson7_loops_schedules_hooks.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Hook Event Matcher
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson7_loops_schedules_hooks.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.anthropic.com/en/docs/claude-code/hooks" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Hooks docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 8 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#6A1B9A;">8</div>
    <div>
      <h3>The Software Factory, Part 1 &mdash; PRD to Story to Brief</h3>
      <p class="time">~45 min &middot; 20 min content / 25 min lab &middot; capstone begins</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run Stages 0&ndash;3 of the seven-agent pipeline: PRD &rarr; codebase inventory &rarr; user story &rarr; technical brief</li>
      <li>Approve the first two human gates: story acceptance criteria and technical brief before any code is written</li>
      <li>Scaffold the Django ER triage project with starter CLAUDE.md and three Factory subagents installed</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson8_factory_part1/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson8_factory_part1.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Factory Gates Part 1
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson8_factory_part1.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_10/claude_code_for_dummies/book.html" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Claude Code for Dummies
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 9 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#AD1457;">9</div>
    <div>
      <h3>The Software Factory, Part 2 &mdash; Build, Test, Validate</h3>
      <p class="time">~45 min &middot; 20 min content / 25 min lab &middot; capstone ships</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run Stages 4&ndash;7: backend-builder &rarr; frontend-builder &rarr; test-verifier &rarr; implementation-validator</li>
      <li>Handle a deliberate validator finding (missing timeout handling) and loop back through the pipeline</li>
      <li>Wire the eval-suite Stop hook so future code changes trigger the deceased-patient test cohort automatically</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson9_factory_part2/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson9_factory_part2.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Factory Gates Part 2
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson9_factory_part2.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.djangoproject.com/start/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Django quickstart
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 10 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">10</div>
    <div>
      <h3>Cheat Sheet + What to Ship Next</h3>
      <p class="time">~15 min &middot; reference card + reflection</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Session takeaways</p>
    <ul>
      <li><strong>The chain:</strong> PRD &rarr; CLAUDE.md &rarr; skills + subagents + hooks &rarr; worktree build &rarr; eval-gated deploy</li>
      <li><strong>Ten slash commands:</strong> <code>/init</code>, <code>/clear</code>, <code>/compact</code>, <code>/rewind</code>, <code>/model</code>, <code>/cost</code>, <code>/permissions</code>, <code>/agents</code>, <code>/config</code>, <code>/statusline</code></li>
      <li><strong>Five next steps:</strong> deploy ER triage to sandbox Azure, add the doctor queue screen, wire PRD-Builder into a personal project, replace one Excel workflow, build your own subagent library</li>
      <li><strong>Closing rule:</strong> the Software Factory gives speed; the eval cohort gives safety — they are not interchangeable</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_10/instructions/lesson10_cheat_sheet/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_10/practices/practice_lesson10_cheat_sheet.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Session 10 Synthesis
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_10/quizzes/quiz_lesson10_cheat_sheet.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_10/claude_code_for_dummies/appendices/cheat_sheet.md" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Printable Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_10/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 10 Assignment &mdash; Ship the ER Triage App via the Software Factory</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Complete the seven-agent Software Factory pipeline to ship the Django ER triage nurse screen (minimum) through all three approval gates. Push the repo to GitHub with a complete <code>.claude/</code> folder (CLAUDE.md, at least one skill, three subagents, hooks in settings.json). Submit the GitHub URL, a screenshot of the running app, and a 200&ndash;300-word reflection on what the eval gate caught (or would catch) in your build.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.75rem;">
    <strong style="color:#FFC107;">Stretch goals:</strong> add the doctor's queue screen through the same pipeline &middot; deploy to a sandbox Azure App Service &middot; wire a deceased-patient eval cohort as a Stop hook.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Grading Rubric</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">PRD + gates (25%):</strong> AIDI clinical PRD with Open Questions; approved story and brief before code; three human checkpoints documented</li>
      <li><strong style="color:#CFD8DC;">Claude Code setup (25%):</strong> project CLAUDE.md under 200 lines; PRD-Builder skill installed; three Factory subagents; PreToolUse + Stop hooks configured</li>
      <li><strong style="color:#CFD8DC;">Working app (25%):</strong> nurse form submits; acuity calculated; oncologic-emergency extraction runs; graceful fallback on API timeout; tests pass</li>
      <li><strong style="color:#CFD8DC;">Written reflection (25%):</strong> names a specific validator finding, explains the eval-gate vs speed trade-off, identifies one PHI risk with mitigation</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 10 of 15
</div>
