---
layout: default
title: CCI.io
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #00897B !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #00897B !important; font-weight: 800 !important; }
  .page-content { padding-top: 0 !important; }

  .cci-hero {
    text-align: center;
    padding: 2.5rem 1rem 2rem;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 2rem;
  }

  .cci-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
    text-decoration: none;
  }

  .cci-logo-text .name {
    font-size: 1.05rem;
    font-weight: 800;
    color: #00695C;
    letter-spacing: 0.02em;
    line-height: 1.2;
  }

  .cci-logo-text .subtitle {
    font-size: 0.78rem;
    color: #78909C;
    font-weight: 500;
  }

  .cci-hero h1 {
    color: #1B2A4A;
    font-size: 1.85rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .cci-hero .tagline {
    color: #607D8B;
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cci-qr-box {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(135deg, #E0F2F1, #E8EAF6);
    border: 1px solid #B2DFDB;
    border-radius: 0.85rem;
    padding: 0.85rem 1.25rem;
    margin: 1.75rem auto 0;
  }

  .cci-qr-box img {
    width: 72px;
    height: 72px;
    border-radius: 0.5rem;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .cci-qr-info {
    text-align: left;
  }

  .cci-qr-info .label {
    font-weight: 700;
    color: #00695C;
    font-size: 0.82rem;
    margin: 0;
  }

  .cci-qr-info .hint {
    font-size: 0.75rem;
    color: #78909C;
    margin: 0.15rem 0 0;
    line-height: 1.4;
  }

  .cci-section-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1B2A4A;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #00897B;
    display: inline-block;
  }

  .cci-grid {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 2rem;
  }

  .cci-card {
    display: flex;
    align-items: center;
    padding: 0.9rem 1.1rem;
    border-radius: 0.65rem;
    border: 1px solid #E0E0E0;
    background: #fff;
    text-decoration: none !important;
    transition: all 0.2s ease;
    gap: 0.85rem;
    color: inherit !important;
  }

  .cci-card:hover {
    border-color: #00897B;
    box-shadow: 0 4px 14px rgba(0,137,123,0.12);
    transform: translateY(-1px);
  }

  /* Active sessions: teal accent stripe (visible even if badge text is cached) */
  .cci-card-active {
    border-left: 4px solid #00897B;
    padding-left: calc(1.1rem - 3px);
  }

  .cci-card:visited { color: inherit !important; }

  .cci-num {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  .cci-card-body {
    flex: 1;
    min-width: 0;
  }

  .cci-card-body .title {
    font-weight: 600;
    color: #263238;
    font-size: 0.9rem;
    line-height: 1.3;
    margin: 0;
  }

  .cci-card-body .desc {
    font-size: 0.75rem;
    color: #90A4AE;
    margin: 0.15rem 0 0;
    line-height: 1.3;
  }

  .cci-card .arrow {
    color: #CFD8DC;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .cci-card:hover .arrow {
    color: #00897B;
    transform: translateX(3px);
  }

  .cci-active-badge {
    font-size: 0.6rem;
    font-weight: 700;
    color: #fff;
    background: #00897B;
    padding: 0.15rem 0.45rem;
    border-radius: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-left: 0.4rem;
    vertical-align: middle;
  }

  .cci-footer-note {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    font-size: 0.72rem;
    color: #B0BEC5;
    border-top: 1px solid #ECEFF1;
    margin-top: 1rem;
  }

  .cci-footer-note a {
    color: #00897B;
    text-decoration: none;
  }
</style>

<div class="cci-hero">
  <div class="cci-logo">
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="12" fill="#00897B"/>
      <path d="M12 17C16 17 21 24 25 17C29 10 34 17 38 17" stroke="#FFC107" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M12 24C16 24 21 31 25 24C29 17 34 24 38 24" stroke="#FFC107" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.45"/>
      <text x="25" y="41" text-anchor="middle" fill="white" font-size="9.5" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="0.8">KHCC</text>
    </svg>
    <div class="cci-logo-text">
      <div class="name">King Hussein Cancer Center</div>
      <div class="subtitle">Cancer Care Informatics</div>
    </div>
  </div>

  <h1>Prompt Engineering &amp; Clinical AI</h1>
  <p class="tagline">A 15-session hands-on course covering LLMs, safe prompting, RAG, deployment, and responsible AI for healthcare.</p>

  <div class="cci-qr-box">
    <img src="{{ site.baseurl }}/qr-code.png" alt="QR code to open this page" />
    <div class="cci-qr-info">
      <p class="label">Quick Access</p>
      <p class="hint">Open your phone camera and<br/>scan to bookmark this site.</p>
    </div>
  </div>
</div>

<h2 class="cci-section-title">Course Sessions</h2>

<div class="cci-grid">

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-01/">
    <div class="cci-num" style="background:#3F51B5;">1</div>
    <div class="cci-card-body">
      <p class="title">Foundations, Transformers &amp; Prompt Engineering <span class="cci-active-badge">Active</span></p>
      <p class="desc">LLMs, attention, ROLES framework, hallucination, JSON output</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-02/">
    <div class="cci-num" style="background:#00897B;">2</div>
    <div class="cci-card-body">
      <p class="title">Python Basics + GitHub <span class="cci-active-badge">Active</span></p>
      <p class="desc">Variables, classes, pandas, Colab notebooks, GitHub</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-03/">
    <div class="cci-num" style="background:#7B1FA2;">3</div>
    <div class="cci-card-body">
      <p class="title">Data Science Foundations: SQL, Python &amp; LLMs <span class="cci-active-badge">Active</span></p>
      <p class="desc">OpenAI API, structured extraction, tool calling, CSV-to-SQL, text-to-SQL</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-04/">
    <div class="cci-num" style="background:#E65100;">4</div>
    <div class="cci-card-body">
      <p class="title">HuggingFace &amp; Open-Source Models <span class="cci-active-badge">Active</span></p>
      <p class="desc">Model hub, tokenizers, fine-tuning, clinical vision, microGPT</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-05/">
    <div class="cci-num" style="background:#C62828;">5</div>
    <div class="cci-card-body">
      <p class="title">LangChain / LangGraph, Tools &amp; Agents <span class="cci-active-badge">Active</span></p>
      <p class="desc">create_agent, tools, StateGraph, memory, multi-agent HITL</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card cci-card-active" href="{{ site.baseurl }}/session-06/">
    <div class="cci-num" style="background:#0277BD;">6</div>
    <div class="cci-card-body">
      <p class="title">RAG &amp; Clinical Document Retrieval <span class="cci-active-badge">Active</span></p>
      <p class="desc">LlamaParse, DeepEval, agentic RAG, GraphRAG, wiki pattern, NotebookLM</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-07/">
    <div class="cci-num" style="background:#558B2F;">7</div>
    <div class="cci-card-body">
      <p class="title">LLM Evaluation</p>
      <p class="desc">Eval layers, eval datasets, LLM-as-judge, clinical safety metrics, Opik observability</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-08/">
    <div class="cci-num" style="background:#F4511E;">8</div>
    <div class="cci-card-body">
      <p class="title">Mid-term Presentations</p>
      <p class="desc">Journal club, evaluation critiques, peer feedback on clinical AI projects</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-09/">
    <div class="cci-num" style="background:#6A1B9A;">9</div>
    <div class="cci-card-body">
      <p class="title">IDEs &amp; Repo Building</p>
      <p class="desc">Cursor, VS Code, GitHub, CI/CD, wiring eval harness into your repo</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-10/">
    <div class="cci-num" style="background:#00838F;">10</div>
    <div class="cci-card-body">
      <p class="title">Claude Code + Azure Cloud</p>
      <p class="desc">Cloud deployment, API management</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-11/">
    <div class="cci-num" style="background:#EF6C00;">11</div>
    <div class="cci-card-body">
      <p class="title">Django &amp; FastAPI Deployment</p>
      <p class="desc">Web frameworks, REST APIs, production hosting</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-12/">
    <div class="cci-num" style="background:#AD1457;">12</div>
    <div class="cci-card-body">
      <p class="title">PHI, Cybersecurity &amp; Governance</p>
      <p class="desc">HIPAA, data protection, security best practices</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-13/">
    <div class="cci-num" style="background:#1565C0;">13</div>
    <div class="cci-card-body">
      <p class="title">Ethics, Pitfalls &amp; Responsible Clinical AI</p>
      <p class="desc">Bias, fairness, transparency, accountability</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-14/">
    <div class="cci-num" style="background:#2E7D32;">14</div>
    <div class="cci-card-body">
      <p class="title">Capstone Project 1</p>
      <p class="desc">Design and build your clinical AI solution</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

  <a class="cci-card" href="{{ site.baseurl }}/session-15/">
    <div class="cci-num" style="background:#4E342E;">15</div>
    <div class="cci-card-body">
      <p class="title">Capstone Project 2</p>
      <p class="desc">Present, evaluate, and refine</p>
    </div>
    <span class="arrow">&#8250;</span>
  </a>

</div>

<div class="cci-footer-note">
  KHCC Cancer Care Informatics &middot; Prompt Engineering &amp; Clinical AI Development<br/>
  <a href="https://www.khcc.jo" target="_blank">www.khcc.jo</a>
</div>
