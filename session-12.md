---
layout: default
title: "Session 12"
permalink: /session-12/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #AD1457 !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #AD1457 !important; font-weight: 800 !important; }
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
    color: #AD1457;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #F8BBD0;
    background: #FCE4EC;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #F8BBD0; }

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
    background: linear-gradient(135deg, #FCE4EC, #F3E5F5);
    border: 1px solid #F8BBD0;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #AD1457;
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

  .s1-prereq strong { color: #AD1457; }

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

  .s1-btn-instructions {
    background: #FCE4EC;
    border-color: #F48FB1;
    color: #AD1457 !important;
  }
  .s1-btn-instructions:hover { background: #F8BBD0; transform: translateY(-1px); }

  .s1-btn-practice {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #6A1B9A !important;
  }
  .s1-btn-practice:hover { background: #E1BEE7; transform: translateY(-1px); }

  .s1-btn-quiz {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }
  .s1-btn-quiz:hover { background: #C8E6C9; transform: translateY(-1px); }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }
  .s1-btn-resource:hover { background: #CFD8DC; transform: translateY(-1px); }

  .s1-btn-template {
    background: #E0F7FA;
    border-color: #80DEEA;
    color: #00838F !important;
  }
  .s1-btn-template:hover { background: #B2EBF2; transform: translateY(-1px); }

  .s1-btn-handout {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }
  .s1-btn-handout:hover { background: #FFE0B2; transform: translateY(-1px); }

  .s1-btn-notebook {
    background: #FFF8E1;
    border-color: #FFE082;
    color: #F57F17 !important;
  }
  .s1-btn-notebook:hover { background: #FFECB3; transform: translateY(-1px); }

  .s1-btn-video {
    background: #FCE4EC;
    border-color: #F48FB1;
    color: #C62828 !important;
  }
  .s1-btn-video:hover { background: #F8BBD9; transform: translateY(-1px); }

  .s1-btn-icon { font-size: 0.9rem; line-height: 1; }

  .s1-kit {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    color: #006064;
    background: #E0F7FA;
    border: 2px solid #00838F;
    border-radius: 0.5rem;
    padding: 0.55rem 0.75rem;
    line-height: 1.45;
  }

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
    color: #F48FB1;
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
    <h1>Session 12: Locking the Front Door — PHI, Cybersecurity &amp; Cloud Governance</h1>
    <p class="meta">9 lessons + cheat sheet &middot; Interactive practice &amp; quizzes &middot; 3 hands-on kits &middot; ~3.4 hours</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Session 11 took your clinical app off your laptop and put it on the public internet — a URL anyone could open, with fake data and a "not for clinical use" label. Session 12 is the bill that comes with that victory: the moment your app became reachable <em>from</em> anywhere, it became reachable <em>by</em> anyone. In plain language — no coding required — you will learn how the internet carries a message, how encryption protects it, how attacks really unfold, how to defend yourself, what the law requires of patient data, and how to stand up <em>and tear down</em> a hardened server in the cloud. You leave able to look at any system and ask the right questions about its front door.</p>
</div>

<div class="s1-prereq">
  <strong>Pre-session homework:</strong> Complete Session 11 (built &amp; deployed the ER-triage Django app). Skim the <a href="https://docs.google.com/presentation/d/1WiaGj8seS48YkoS3jkZ3XjGpDKD5voEMws4ZNcsGiE8/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Cybersecurity overview slides</a> for a bird's-eye view before Lesson 1. No new accounts required — the Azure VM lab is demonstrated live by the instructor and you keep a numbered runbook to replay later. &middot; <strong>Clinical anchor:</strong> the same ER-triage app you shipped, now examined through the lens of encryption at rest/in transit, PHI, and a hardened cloud server. &middot; <strong>Safety rule:</strong> run the PHI scanner <em>only</em> on the provided synthetic notes — never real charts on a personal laptop.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#AD1457;">1</div>
    <div>
      <h3>What Is a Network, Really?</h3>
      <p class="time">~15 min &middot; concept + label-the-diagram lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Picture the internet as a hospital building: rooms = computers, hallways = network, numbered doors = ports, reception = firewall</li>
      <li>Read an address as IP + port; know 80 (HTTP), 443 (HTTPS), 22 (SSH), 3389 (RDP); <code>localhost</code> vs a public URL</li>
      <li>Explain why "reachable from anywhere" is both the point of deployment and the whole danger — open the minimum</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson1_what_is_a_network/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/81998c1e-5f2c-4af1-9ca8-3ecabdf6d4dc" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson1_what_is_a_network.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Open to the Street, or Shut?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson1_what_is_a_network.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-video" href="https://docs.google.com/presentation/d/1WiaGj8seS48YkoS3jkZ3XjGpDKD5voEMws4ZNcsGiE8/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128202;</span> Cybersecurity Slides
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.cloudflare.com/learning/network-layer/what-is-a-computer-port/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Cloudflare: What is a port?
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/artifact/aidi-security-interactive.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#129504;</span> AIDI Security Guide (interactive)
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_12/skills/aidi-unified-security.skill" download>
        <span class="s1-btn-icon">&#11015;</span> Download Security Skill (.skill)
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C2185B;">2</div>
    <div>
      <h3>Encryption, Plainly: Secrets, Eavesdroppers &amp; HTTPS</h3>
      <p class="time">~20 min &middot; concept + postcard-vs-envelope lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Define encryption as scrambling with a key; picture a man-in-the-middle on the path your messages travel</li>
      <li>Tell HTTP (a postcard) from HTTPS (a sealed envelope); know why patient data over <code>http://</code> is a postcard</li>
      <li>Say exactly what the browser padlock proves (encrypted in transit) and what it does <em>not</em> (that the site is trustworthy)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson2_encryption_basics/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/eb4510ac-c07f-4496-b6ca-a48c242e5b91" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson2_encryption_basics.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Postcard or Sealed Envelope?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson2_encryption_basics.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.cloudflare.com/learning/ssl/what-is-https/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Cloudflare: What is HTTPS?
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#D81B60;">3</div>
    <div>
      <h3>Two Kinds of Keys: Symmetric, Asymmetric, At-Rest vs In-Transit</h3>
      <p class="time">~25 min &middot; concept + at-rest/in-transit sorter</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Distinguish symmetric (one shared key) from asymmetric (a public/private pair that solves key exchange)</li>
      <li>Tell encryption <em>in transit</em> (TLS/HTTPS) from <em>at rest</em> (the stored database) — you want both</li>
      <li>See the real S11 layer: Fernet encrypts the patient name at rest, HTTPS protects it in transit; never roll your own crypto</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson3_encryption_types/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/a968f869-fa9f-4cdd-b608-802c4fd153c7" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson3_encryption_types.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: At Rest or In Transit?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson3_encryption_types.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-video" href="https://www.youtube.com/watch?v=xHaxAYDt75Q" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Encryption Video
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson3_encryption_youtube.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz: Video (10 Q, English)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.cloudflare.com/learning/ssl/what-is-asymmetric-encryption/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Cloudflare: Asymmetric encryption
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#B71C1C;">4</div>
    <div>
      <h3>How Attacks Actually Work</h3>
      <p class="time">~25 min &middot; defensive framing + order-the-chain lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Follow the attack chain defensively: unpatched hole &rarr; exploit &rarr; backdoor &rarr; persistence &rarr; lateral movement &rarr; exfiltration &rarr; ransomware</li>
      <li>See that most breaches ride an old, unpatched hole plus a single human click — not a brilliant exploit</li>
      <li>Name the brake at each link: patching, least privilege, network segmentation, and tested offline backups</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson4_how_attacks_work/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/8d97ac67-e086-4bea-bf1a-e7c4da0b3832" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson4_how_attacks_work.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Order the Ransomware Chain
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson4_how_attacks_work.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-video" href="https://docs.google.com/presentation/d/1G_2LsrCgoclnE3mmlic-IFf-ABOyBaUBVw6aEqWBHf4/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128202;</span> 10 Phishing Examples (Slides)
      </a>
      <a class="s1-btn s1-btn-video" href="https://www.youtube.com/watch?v=uvKTMgWRPw4&t=5s" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Social Engineering (video)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.cisa.gov/stopransomware" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> CISA: StopRansomware
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#6A1B9A;">5</div>
    <div>
      <h3>Defending Yourself: Passwords, MFA &amp; Least Privilege</h3>
      <p class="time">~20 min &middot; concept + passphrase / "would MFA stop this?" lab</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build a passphrase (length beats complexity); never reuse a password; let a password manager carry the rest</li>
      <li>Explain MFA and rank it by phishing resistance: SMS &lt; authenticator app &lt; hardware key / passkey</li>
      <li>Spot MFA-fatigue attacks; apply least privilege as a daily habit, not just an IT policy</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson5_passwords_and_mfa/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/764227af-325b-4075-b11d-5c1b732bca65" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson5_passwords_and_mfa.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Passphrase + Would MFA Stop It?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson5_passwords_and_mfa.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.cisa.gov/secure-our-world/turn-mfa" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> CISA: Turn on MFA
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#4527A0;">6</div>
    <div>
      <h3>The Honeypot Trick: Canary Tokens</h3>
      <p class="time">~15 min &middot; guided walk-through + alert-triage matcher</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Separate prevention from detection; understand a canary token as a tripwire document that emails you when opened</li>
      <li>Generate one free at canarytokens.org with your own email and a memo — no login, no code</li>
      <li>Read the alert honestly (time is a real event, the IP is only a hint); keep the ethics line bright — your own assets, fake bait, never real PHI</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson6_canary_tokens/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/91dad1f4-6975-45aa-aa0c-627a4d3e46e5" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson6_canary_tokens.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Good Practice or Mistake?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson6_canary_tokens.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://canarytokens.org" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128229;</span> canarytokens.org (free tool)
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 7 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00838F;">7</div>
    <div>
      <h3>PHI and HIPAA: The Rules of the Road</h3>
      <p class="time">~25 min &middot; concept + spot-the-PHI lab &middot; pairs with the PHI scanner kit</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Define PHI (health information + an identifier) and recall the HIPAA 18 identifiers / Safe Harbor</li>
      <li>Keep de-identification, encryption, and access control separate — they are three different jobs</li>
      <li>Find PHI in free text; understand minimum-necessary and the re-identification trap</li>
    </ul>
    <p class="s1-kit"><strong>&#128295; Hands-on kit:</strong> the <code>phi_tools/</code> scanner reads a clinical note and flags identifiers — a regex pass (no key) plus an optional AI pass. <strong>Run it only on the provided synthetic notes.</strong></p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson7_phi_and_hipaa/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/68918cf7-967b-4b53-b599-168fd6e2b165" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson7_phi_and_hipaa.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Spot the PHI
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson7_phi_and_hipaa.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/phi_tools/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> phi_tools (GitHub)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/CCI/blob/main/session12/PHI_Detection_HuggingFace.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> PHI Detection Notebook
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session12/PHI_Detection_HuggingFace.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128640;</span> Open in Colab
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HHS: De-identification &amp; the 18 identifiers
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 8 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00695C;">8</div>
    <div>
      <h3>The Synthetic-Data Pipeline: Safe Data by Design</h3>
      <p class="time">~25 min &middot; concept + build-a-safe-record lab &middot; pairs with the generator kit</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Contrast the reactive posture ("protect every copy") with the preventive one ("make data safe by design")</li>
      <li>Learn the four AIDI rules: encode every MRN, encrypt every name, keys in a vault, evaluate on a frozen deceased-patient cohort</li>
      <li>Run the scanner on a real-style note (it lights up) and on the generator's output (zero findings) — that is the whole point</li>
    </ul>
    <p class="s1-kit"><strong>&#128295; Hands-on kit:</strong> the <code>synthetic/</code> generator mints realistic-but-fake records, reusing the exact <code>encode_mrn</code> / <code>encrypt_name</code> functions from your Session 11 app — nothing real to leak.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson8_synthetic_data_pipeline/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/c26a86c6-aa8a-4af1-bec9-b1070c636c8f" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson8_synthetic_data_pipeline.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Build a Safe Record
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson8_synthetic_data_pipeline.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/phi_tools/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> phi_tools (GitHub)
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 9 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#0277BD;">9</div>
    <div>
      <h3>The Cloud, Hardened: Azure CLI from Resource Group to Teardown</h3>
      <p class="time">~35 min &middot; instructor-led live demo + your replay runbook &middot; pairs with the Azure kit</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Walk the full Azure Cloud Shell lifecycle: resource group &rarr; hardened VM &rarr; serve a page &rarr; verify &rarr; <strong>delete everything</strong></li>
      <li>Harden by default: patched image, non-root user, SSH-key auth, an NSG open only to 443 (public) and 22 (your IP only — never <code>0.0.0.0/0</code>)</li>
      <li>Tear it all down with one command on the resource group; then paste your config into an AI assistant and ask "what's still exposed?"</li>
    </ul>
    <p class="s1-kit"><strong>&#128295; Hands-on kit:</strong> numbered <code>azure_hardened_vm/</code> scripts you paste into Azure Cloud Shell in order — create, harden, serve, verify, and <code>99_delete_everything.sh</code>. Nothing installed locally.</p>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session_12/instructions/lesson9_cloud_hardened_azure/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Runbook
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/b066a8c8-31c0-46a7-8663-4dfd8a7f9180" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_12/practices/practice_lesson9_cloud_hardened_azure.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Sequence the az Commands + Audit the NSG
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_12/quizzes/quiz_lesson9_cloud_hardened_azure.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Azure: Network Security Groups
      </a>
    </div>
  </div>
</div>

<!-- ─── Cheat Sheet / Takeaways ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">&#9733;</div>
    <div>
      <h3>Cheat Sheet + What to Carry Forward</h3>
      <p class="time">~15 min &middot; one-page reference + reflection</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Session takeaways</p>
    <ul>
      <li><strong>The picture:</strong> ports are numbered doors; the firewall is reception; open the minimum (443 for the public, 22 to your IP only)</li>
      <li><strong>The two keys:</strong> symmetric (one shared) vs asymmetric (public/private); protect data in transit (TLS) <em>and</em> at rest (the database)</li>
      <li><strong>The defenses:</strong> patch, least privilege, segmentation, tested offline backups; passphrases + phishing-resistant MFA; canary tokens for detection</li>
      <li><strong>The clinical core:</strong> the HIPAA 18, de-id ≠ encryption ≠ access control, synthetic data by design, and a hardened cloud server you remember to delete</li>
      <li><strong>The one rule:</strong> a publicly reachable system with real patient data is a different universe from a teaching demo</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-handout" href="{{ site.baseurl }}/session_12/cheat_sheet/" target="_blank">
        <span class="s1-btn-icon">&#128218;</span> Printable Cheat Sheet
      </a>
      <a class="s1-btn s1-btn-notebook" href="{{ site.baseurl }}/session_12/data/notebooklm_sources/" target="_blank">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM Sources (9)
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 12 Assignment &mdash; Run the Kits &amp; Lock the Front Door</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Put the session to work on the three provided kits. Run the PHI scanner on the synthetic <code>note_dirty.txt</code> and capture its findings; generate a batch of synthetic records and re-scan to show <strong>zero findings</strong>; replay the Azure hardened-VM runbook (or audit the provided NSG rules) and confirm only 443 is open to the public and 22 only to your own IP — then tear everything down. Finish by pasting one configuration (your NSG rules or a deploy snippet) into an AI assistant, asking "what's still exposed?", and writing a 200&ndash;300-word reflection.
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(244,143,177,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#F48FB1;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Grading Rubric</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">PHI scanner (25%):</strong> run on the synthetic dirty note, report the identifiers found, and map at least three to specific HIPAA-18 categories</li>
      <li><strong style="color:#CFD8DC;">Safe data by design (25%):</strong> generate synthetic records, re-run the scanner to zero findings, and explain why (encode MRN, encrypt name before output)</li>
      <li><strong style="color:#CFD8DC;">Hardened cloud (25%):</strong> show the NSG opens only 443 to the public and 22 to your IP, SSH-key auth (not password), and evidence the resources were deleted</li>
      <li><strong style="color:#CFD8DC;">Reflection (25%):</strong> name one thing the AI review flagged, distinguish de-id vs encryption vs access control, and say why the S11 app was labelled "not for clinical use"</li>
    </ol>
  </div>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.75rem;">
    <strong style="color:#F48FB1;">Safety:</strong> run the scanner only on the provided synthetic notes &middot; no secrets in any file (<code>--generate-ssh-keys</code>, OpenAI key from <code>.env</code>/env only) &middot; the Azure VM lab <strong>must end with teardown</strong> &middot; canary tokens use your own email and fake bait.
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#F48FB1;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#F8BBD0'" onmouseout="this.style.background='#F48FB1'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 12 of 15
</div>
