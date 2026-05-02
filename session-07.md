---
layout: default
title: "Session 7"
permalink: /session-07/
---

<style>
  .site-nav { display: none !important; }
  .site-header { border-top: 5px solid #00897B !important; min-height: 46px !important; }
  .site-title, .site-title:visited { color: #00897B !important; font-weight: 800 !important; }
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
    color: #00897B;
    text-decoration: none;
    padding: 0.35rem 0.65rem;
    border-radius: 0.4rem;
    border: 1px solid #B2DFDB;
    background: #E0F2F1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .s1-header .back:hover { background: #B2DFDB; }

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
    background: linear-gradient(135deg, #E0F2F1, #E8EAF6);
    border: 1px solid #B2DFDB;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .s1-goal .label {
    font-weight: 700;
    font-size: 0.75rem;
    color: #00695C;
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

  .s1-btn-colab {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }
  .s1-btn-colab:hover { background: #FFE0B2; transform: translateY(-1px); }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }
  .s1-btn-resource:hover { background: #CFD8DC; transform: translateY(-1px); }

  .s1-btn-solution {
    background: #E8F5E9;
    border-color: #81C784;
    color: #1B5E20 !important;
  }
  .s1-btn-solution:hover { background: #C8E6C9; transform: translateY(-1px); }

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
    <h1>Session 7: LLM Evaluation</h1>
    <p class="meta">6 lessons &middot; 4 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Move from vibe-checking to systematic evaluation — build labeled datasets from real traces, choose and validate the right evaluator family, apply four clinical safety metrics, and wire the whole pipeline as a CI step so every change to your KHCC tool is measurable, not guesswork.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>Why Evaluate &mdash; and Where Evals Live</h3>
      <p class="time">~25 min &middot; discussion</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Name the three evaluation layers (development, pre-merge, production) and where each one runs</li>
      <li>Distinguish guardrails (runtime blocks) from evaluators (offline scorers)</li>
      <li>Recognise benchmark saturation and contamination as pitfalls for clinical model selection</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_7/practices/practice_lesson1_eval_layer.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Eval Layer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_7/quizzes/quiz_lesson1_why_evaluate.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/docs/leaderboards/en/index" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HF Open LLM Leaderboard
      </a>
      <a class="s1-btn s1-btn-resource" href="https://crfm.stanford.edu/helm/latest/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HELM (Stanford CRFM)
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>Building the Evaluation Dataset</h3>
      <p class="time">~30 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Apply the error-analysis flywheel to grow a labeled dataset from real production traces</li>
      <li>Use the one-labeler authority principle and generate inputs only (never outputs) with LLMs</li>
      <li>Measure inter-annotator agreement with Cohen's kappa (target &kappa; &ge; 0.6)</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_7/practices/practice_lesson2_label_traces.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Label Traces
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_7/quizzes/quiz_lesson2_eval_dataset.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session7/student/Lab2_Build_Eval_Dataset_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Student Notebook
      </a>
      <a class="s1-btn s1-btn-solution" href="https://github.com/IyadSultan/CCI/blob/main/session7/solutions/Lab2_Build_Eval_Dataset_Solutions.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9989;</span> Solutions
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.confident-ai.com/docs/evaluation-datasets" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> DeepEval dataset docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Choosing Your Evaluator</h3>
      <p class="time">~30 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Compare functional, LLM-as-judge, and human evaluators — apply the rule: functional first, judge second, human as ground truth</li>
      <li>Understand the LLM judge bias catalog (position, verbosity, self-preference) and mitigation strategies</li>
      <li>Know why pairwise comparison outperforms absolute scoring for LLM judges</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_7/practices/practice_lesson3_pick_evaluator.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Pick Evaluator
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_7/quizzes/quiz_lesson3_choosing_evaluator.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session7/student/Lab3_Choosing_Evaluator_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Student Notebook
      </a>
      <a class="s1-btn s1-btn-solution" href="https://github.com/IyadSultan/CCI/blob/main/session7/solutions/Lab3_Choosing_Evaluator_Solutions.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9989;</span> Solutions
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.confident-ai.com/docs/metrics-llm-evals" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> LLM-as-judge metrics
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>Validating the Evaluator Itself</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run the judge-clinician alignment loop and compute agreement (&kappa; &ge; 0.6 categorical, 80&ndash;90% pairwise)</li>
      <li>Refine judge prompts iteratively using disagreement case analysis</li>
      <li>Know when to fall back to functional or human-only if the threshold cannot be reached</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_7/practices/practice_lesson4_alignment_loop.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Alignment Loop
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_7/quizzes/quiz_lesson4_validating_judge.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session7/student/Lab4_Validate_Judge_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Student Notebook
      </a>
      <a class="s1-btn s1-btn-solution" href="https://github.com/IyadSultan/CCI/blob/main/session7/solutions/Lab4_Validate_Judge_Solutions.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9989;</span> Solutions
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Cohen's kappa / correlation refs
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Medical Evaluation &mdash; The Clinical Layer</h3>
      <p class="time">~35 min &middot; discussion</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Apply harm asymmetry as the defining constraint: bound worst-case failures, not average accuracy</li>
      <li>Score four clinical safety sub-metrics: contraindication recall, refusal-to-answer calibration, hallucination rate, demographic fairness</li>
      <li>Map the FDA SaMD / IMDRF regulatory framing to evaluation as an audit-trail artifact</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_7/practices/practice_lesson5_diagnose_safety.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Diagnose Safety
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_7/quizzes/quiz_lesson5_medical_evaluation.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/blog/leaderboard-medicalllm" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Medical LLM Leaderboard
      </a>
      <a class="s1-btn s1-btn-resource" href="https://openai.com/index/healthbench/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> HealthBench (OpenAI)
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> FDA SaMD / GMLP guidance
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">6</div>
    <div>
      <h3>Wrap-Up &mdash; Build Your Best Eval Pipeline</h3>
      <p class="time">~35 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Integrate dataset, functional + judge evaluators, clinical safety metrics, and Opik observability into one runnable pipeline</li>
      <li>Wire evals as a CI Python script (preview of Session 9 repo building)</li>
      <li>Detect prompt drift by pushing deliberately-degraded traces to Opik</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-07/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Review
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session7/student/Lab6_End_to_End_Eval_Pipeline_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Student Notebook
      </a>
      <a class="s1-btn s1-btn-solution" href="https://github.com/IyadSultan/CCI/blob/main/session7/solutions/Lab6_End_to_End_Eval_Pipeline_Solutions.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9989;</span> Solutions
      </a>
      <a class="s1-btn s1-btn-resource" href="https://github.com/IyadSultan/CCI/tree/main/session7" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128193;</span> All Session 7 Notebooks
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.comet.com/docs/opik/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Opik observability docs
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.confident-ai.com/" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> DeepEval docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 7 Assignment &mdash; End-to-End Evaluation Pipeline for a Clinical AI Tool</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Choose <strong>one</strong> clinical AI tool you built in Sessions 3&ndash;6 (extraction agent, RAG pipeline, or multi-agent workflow) and build a <strong>complete evaluation pipeline</strong> for it. Your pipeline must include: a labeled dataset of &ge;30 cases built from real or high-quality synthetic traces (report Cohen's kappa), at least one functional evaluator and one LLM-as-judge evaluator, a validated judge with an alignment loop (before/after delta &kappa; reported), three of the four clinical safety sub-metrics (contraindication recall, refusal calibration, hallucination rate, demographic fairness), and a one-page regulatory defense framing the tool under FDA SaMD risk-class thinking. Wrap the eval as a Python script runnable from the command line.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.5rem;">
    <strong style="color:#FFC107;">Stretch options (pick one):</strong> push synthetic production traces to Opik and demonstrate drift detection on a deliberately-degraded prompt, add a fourth safety sub-metric, or write the eval as a GitHub Actions CI step.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Dataset quality &amp; kappa (25%) &middot; Evaluator selection &amp; judge validation (25%) &middot; Clinical safety metrics (25%) &middot; Stretch &amp; regulatory framing (25%)
  </p>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,193,7,0.25);border-radius:0.6rem;padding:1rem 1.15rem;margin-bottom:1.25rem;">
    <p style="color:#FFC107;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.5rem;">&#9888; Hints &mdash; Common pitfalls to avoid</p>
    <ol style="margin:0;padding-left:1.25rem;color:#B0BEC5;font-size:0.8rem;line-height:1.7;">
      <li><strong style="color:#CFD8DC;">Generate inputs only, never outputs.</strong> Use an LLM to imagine new patient cases and edge scenarios, but always run them through your real system. Synthetic outputs are circular — they measure what the generator imagines, not what your tool does.</li>
      <li><strong style="color:#CFD8DC;">One labeler is a feature, not a bug.</strong> Pick one authority labeler whose rubric is the rubric. Multiple inconsistent labelers destroy measurement validity — train others against the authority later.</li>
      <li><strong style="color:#CFD8DC;">Validate the judge before trusting it.</strong> A judge with 40% disagreement with your clinicians still produces a number — it's just meaningless. Run the alignment loop before reporting any judge-derived metrics.</li>
      <li><strong style="color:#CFD8DC;">Faithfulness beats relevancy in clinic.</strong> A relevant answer that hallucinates a contraindication is worse than no answer. Design the rubric and prompts to penalise faithfulness failures heavily.</li>
      <li><strong style="color:#CFD8DC;">Version everything.</strong> Each eval run must record dataset version, model version, prompt version, and rubric version — audit-trail thinking is good engineering even when not legally required.</li>
    </ol>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 7 of 15
</div>
