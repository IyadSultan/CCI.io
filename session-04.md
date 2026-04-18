---
layout: default
title: "Session 4"
permalink: /session-04/
---
---
layout: default
title: "Session 4"
permalink: /session-04/
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

  .s1-header .back:hover {
    background: #B2DFDB;
  }

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

  .s1-lesson:hover {
    border-color: #B0BEC5;
  }

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

  .s1-lesson-body {
    padding: 1rem 1.25rem;
  }

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

  .s1-btn-notebook:hover {
    background: #FFECB3;
    transform: translateY(-1px);
  }

  .s1-btn-practice {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }

  .s1-btn-practice:hover {
    background: #C8E6C9;
    transform: translateY(-1px);
  }

  .s1-btn-quiz {
    background: #E3F2FD;
    border-color: #90CAF9;
    color: #1565C0 !important;
  }

  .s1-btn-quiz:hover {
    background: #BBDEFB;
    transform: translateY(-1px);
  }

  .s1-btn-instructions {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #7B1FA2 !important;
  }

  .s1-btn-instructions:hover {
    background: #E1BEE7;
    transform: translateY(-1px);
  }

  .s1-btn-colab {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }

  .s1-btn-colab:hover {
    background: #FFE0B2;
    transform: translateY(-1px);
  }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }

  .s1-btn-resource:hover {
    background: #CFD8DC;
    transform: translateY(-1px);
  }

  .s1-btn-icon {
    font-size: 0.9rem;
    line-height: 1;
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
    <h1>Session 4: HuggingFace &amp; Open-Source Models</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Navigate the HuggingFace Hub, run clinical NLP and vision pipelines locally, fine-tune models for radiology text and chest X-ray tasks, and understand transformer internals — so you can keep PHI on-site and choose when open-source beats API-only workflows.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>The HuggingFace Ecosystem &mdash; A Guided Tour</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Find models and datasets on the Hub and read a model card for clinical fit</li>
      <li>Compare open-source (local) vs closed API models for PHI and cost</li>
      <li>Use Spaces and the Inference API widget for quick sanity checks</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/fc57dc83-ca11-453b-a052-b5887524b307" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson1_model_card_reader.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Model Card Reader
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_ecosystem.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab1_HuggingFace_Ecosystem_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.youtube.com/watch?v=qP9mbY3wuWk&amp;t=419s" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Video: What is Hugging Face?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_video.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Video Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.google.com/presentation/d/14zko8jqm91IKtCDi2LorUpn3_6u2iZfnX4dH0_tcFdI/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Slides: Hugging Face Models
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/attention_interactive_game.html" target="_blank">
        <span class="s1-btn-icon">&#127918;</span> Game: Attention Is All You Need
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>Clinical Models &amp; the pipeline() API</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run NER, classification, and summarization with <code>transformers.pipeline</code></li>
      <li>Map HuggingFace task tags to clinical workflows and pick biomedical checkpoints</li>
      <li>Explain why tokenizers matter for medications and long compound names</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/da2b8d00-6818-4b99-bc87-ce2623ac8748" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson2_clinical_task_matcher.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Clinical Task Matcher
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson2_clinical_pipeline.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab2_Clinical_Models_Pipeline_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Fine-Tuning for Radiology Report Summarization</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Set up a summarization fine-tune with the Trainer API and GPU runtime</li>
      <li>Track ROUGE (or similar) and watch for overfitting on small report sets</li>
      <li>Connect transfer learning to radiology &ldquo;findings &rarr; impression&rdquo; workflows</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/511b20c2-aec1-45e9-a199-1196d507f80d" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson3_training_configurator.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Training Configurator
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/practices/hyperparameters_interactive_explainer.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128295;</span> Hyperparameters explainer
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/references/CCI_Lab3_Technical_Guide_Transformer_Finetuning.pdf" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> Lab 3 technical guide (PDF)
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson3_radiology_finetuning.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab3_Radiology_Summarization_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>Clinical Vision &mdash; Chest X-Ray Pneumonia Detection</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build an image-classification fine-tune (e.g. MobileNet) for CXR inputs</li>
      <li>Report precision, recall, F1, and a confusion matrix on imbalanced labels</li>
      <li>Argue why recall often matters more than raw accuracy in screening</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/af886c42-0ecc-4579-9524-5a746504ed1a" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson4_confusion_matrix.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Confusion Matrix
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/practices/bleu_rouge_interactive_explainer.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128202;</span> BLEU &amp; ROUGE explainer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson4_cxr_pneumonia.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab4_CXR_Pneumonia_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Build a Language Model from Scratch &mdash; microGPT</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect embeddings, positional encodings, and self-attention to code you can run</li>
      <li>Train a tiny GPT-style model and relate it to large frontier models</li>
      <li>Explain when understanding internals helps debugging vs when APIs suffice</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/b1be38a7-8fc5-4600-9dff-9d466e5416c0" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson5_transformer_builder.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Transformer Builder
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson5_microgpt.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab5_MicroGPT_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">6</div>
    <div>
      <h3>Wrap-Up &mdash; Review &amp; Consolidation</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect Hub navigation, pipelines, fine-tuning, vision, and transformer internals</li>
      <li>Review common mistakes (model cards, LR, metrics, GPU runtime)</li>
      <li>Preview Session 5: agents, tools, and LangChain-style orchestration</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Review
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/55f72f96-7413-4e25-9b23-bbce5ce5c1d5" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM: Summary
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/tree/main/session4/student" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/docs/transformers/index" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> Transformers docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 4 Assignment &mdash; Clinical NER Fine-Tuning Pipeline</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Build a Colab notebook that fine-tunes BioBERT for disease NER on pathology-style tumor registry text. Start by running the <code>d4data/biomedical-ner-all</code> baseline on 5 pathology samples to see what it detects and what it misses. Load the NCBI Disease dataset (via HuggingFace Parquet files), tokenize with sub-word label alignment, and fine-tune using the HuggingFace Trainer. Evaluate with entity-level precision/recall/F1 (seqeval strict) <strong>before and after</strong> training to show the measurable impact of fine-tuning. Run inference on the same pathology samples and compare side-by-side with the baseline. Finish with a written comparison to OpenAI extraction from Session 3 covering cost, privacy, latency, accuracy, schema flexibility, and hallucination risk &mdash; and recommend when to use each approach at KHCC.
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:0.5rem;">
    <strong style="color:#FFC107;">Stretch options (pick one):</strong> multi-model benchmark (compare 3+ models on the same test set), SQLite JSON export (save predictions with entities, scores, and latency), or alternate clinical task (e.g. medication NER using the baseline model&rsquo;s broader label set).
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Code Quality (25%) &middot; Clinical Relevance (25%) &middot; Critical Analysis (25%) &middot; Stretch Challenge (25%)
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
    <a href="https://colab.research.google.com/drive/19pUdKQDMa4eW43KpXHy1G8tQQQySlRYM" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FF8F00;color:#fff;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFA000'" onmouseout="this.style.background='#FF8F00'">
      &#128209; Reference Notebook (Colab) &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 4 of 15
</div>
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

  .s1-header .back:hover {
    background: #B2DFDB;
  }

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

  .s1-lesson:hover {
    border-color: #B0BEC5;
  }

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

  .s1-lesson-body {
    padding: 1rem 1.25rem;
  }

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

  .s1-btn-notebook:hover {
    background: #FFECB3;
    transform: translateY(-1px);
  }

  .s1-btn-practice {
    background: #E8F5E9;
    border-color: #A5D6A7;
    color: #2E7D32 !important;
  }

  .s1-btn-practice:hover {
    background: #C8E6C9;
    transform: translateY(-1px);
  }

  .s1-btn-quiz {
    background: #E3F2FD;
    border-color: #90CAF9;
    color: #1565C0 !important;
  }

  .s1-btn-quiz:hover {
    background: #BBDEFB;
    transform: translateY(-1px);
  }

  .s1-btn-instructions {
    background: #F3E5F5;
    border-color: #CE93D8;
    color: #7B1FA2 !important;
  }

  .s1-btn-instructions:hover {
    background: #E1BEE7;
    transform: translateY(-1px);
  }

  .s1-btn-colab {
    background: #FFF3E0;
    border-color: #FFCC80;
    color: #E65100 !important;
  }

  .s1-btn-colab:hover {
    background: #FFE0B2;
    transform: translateY(-1px);
  }

  .s1-btn-resource {
    background: #ECEFF1;
    border-color: #B0BEC5;
    color: #37474F !important;
  }

  .s1-btn-resource:hover {
    background: #CFD8DC;
    transform: translateY(-1px);
  }

  .s1-btn-icon {
    font-size: 0.9rem;
    line-height: 1;
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
    <h1>Session 4: HuggingFace &amp; Open-Source Models</h1>
    <p class="meta">6 lessons &middot; 5 Colab labs &middot; Interactive practice &amp; quizzes &middot; 1 assignment</p>
  </div>
</div>

<div class="s1-goal">
  <p class="label">Session Goal</p>
  <p>Navigate the HuggingFace Hub, run clinical NLP and vision pipelines locally, fine-tune models for radiology text and chest X-ray tasks, and understand transformer internals — so you can keep PHI on-site and choose when open-source beats API-only workflows.</p>
</div>

<!-- ─── Lesson 1 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#3F51B5;">1</div>
    <div>
      <h3>The HuggingFace Ecosystem &mdash; A Guided Tour</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Find models and datasets on the Hub and read a model card for clinical fit</li>
      <li>Compare open-source (local) vs closed API models for PHI and cost</li>
      <li>Use Spaces and the Inference API widget for quick sanity checks</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-1-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/fc57dc83-ca11-453b-a052-b5887524b307" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson1_model_card_reader.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Model Card Reader
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_ecosystem.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab1_HuggingFace_Ecosystem_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
      <a class="s1-btn s1-btn-resource" href="https://www.youtube.com/watch?v=qP9mbY3wuWk&amp;t=419s" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#9654;</span> Video: What is Hugging Face?
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson1_huggingface_video.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Video Quiz
      </a>
      <a class="s1-btn s1-btn-resource" href="https://docs.google.com/presentation/d/14zko8jqm91IKtCDi2LorUpn3_6u2iZfnX4dH0_tcFdI/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128218;</span> Slides: Hugging Face Models
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/attention_interactive_game.html" target="_blank">
        <span class="s1-btn-icon">&#127918;</span> Game: Attention Is All You Need
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 2 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#00897B;">2</div>
    <div>
      <h3>Clinical Models &amp; the pipeline() API</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Run NER, classification, and summarization with <code>transformers.pipeline</code></li>
      <li>Map HuggingFace task tags to clinical workflows and pick biomedical checkpoints</li>
      <li>Explain why tokenizers matter for medications and long compound names</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-2-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/da2b8d00-6818-4b99-bc87-ce2623ac8748" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson2_clinical_task_matcher.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Clinical Task Matcher
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson2_clinical_pipeline.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab2_Clinical_Models_Pipeline_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 3 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#7B1FA2;">3</div>
    <div>
      <h3>Fine-Tuning for Radiology Report Summarization</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Set up a summarization fine-tune with the Trainer API and GPU runtime</li>
      <li>Track ROUGE (or similar) and watch for overfitting on small report sets</li>
      <li>Connect transfer learning to radiology &ldquo;findings &rarr; impression&rdquo; workflows</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-3-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/511b20c2-aec1-45e9-a199-1196d507f80d" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson3_training_configurator.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Training Configurator
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/practices/hyperparameters_interactive_explainer.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128295;</span> Hyperparameters explainer
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/references/CCI_Lab3_Technical_Guide_Transformer_Finetuning.pdf" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> Lab 3 technical guide (PDF)
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson3_radiology_finetuning.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab3_Radiology_Summarization_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 4 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#E65100;">4</div>
    <div>
      <h3>Clinical Vision &mdash; Chest X-Ray Pneumonia Detection</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Build an image-classification fine-tune (e.g. MobileNet) for CXR inputs</li>
      <li>Report precision, recall, F1, and a confusion matrix on imbalanced labels</li>
      <li>Argue why recall often matters more than raw accuracy in screening</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-4-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/af886c42-0ecc-4579-9524-5a746504ed1a" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson4_confusion_matrix.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Confusion Matrix
      </a>
      <a class="s1-btn s1-btn-resource" href="{{ site.baseurl }}/session_4/practices/bleu_rouge_interactive_explainer.html" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128202;</span> BLEU &amp; ROUGE explainer
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson4_cxr_pneumonia.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab4_CXR_Pneumonia_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 5 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#C62828;">5</div>
    <div>
      <h3>Build a Language Model from Scratch &mdash; microGPT</h3>
      <p class="time">~25 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect embeddings, positional encodings, and self-attention to code you can run</li>
      <li>Train a tiny GPT-style model and relate it to large frontier models</li>
      <li>Explain when understanding internals helps debugging vs when APIs suffice</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-5-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Lab
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/b1be38a7-8fc5-4600-9dff-9d466e5416c0" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM
      </a>
      <a class="s1-btn s1-btn-practice" href="{{ site.baseurl }}/session_4/practices/practice_lesson5_transformer_builder.html" target="_blank">
        <span class="s1-btn-icon">&#9997;</span> Practice: Transformer Builder
      </a>
      <a class="s1-btn s1-btn-quiz" href="{{ site.baseurl }}/session_4/quizzes/quiz_lesson5_microgpt.html" target="_blank">
        <span class="s1-btn-icon">&#10004;</span> Quiz
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/blob/main/session4/student/Lab5_MicroGPT_Student.ipynb" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> Colab Notebook
      </a>
    </div>
  </div>
</div>

<!-- ─── Lesson 6 ─── -->
<div class="s1-lesson">
  <div class="s1-lesson-head">
    <div class="s1-lesson-num" style="background:#1B2A4A;">6</div>
    <div>
      <h3>Wrap-Up &mdash; Review &amp; Consolidation</h3>
      <p class="time">~20 min</p>
    </div>
  </div>
  <div class="s1-lesson-body">
    <p class="goals-title">Learning goals</p>
    <ul>
      <li>Connect Hub navigation, pipelines, fine-tuning, vision, and transformer internals</li>
      <li>Review common mistakes (model cards, LR, metrics, GPU runtime)</li>
      <li>Preview Session 5: agents, tools, and LangChain-style orchestration</li>
    </ul>
    <div class="s1-actions">
      <a class="s1-btn s1-btn-instructions" href="{{ site.baseurl }}/session-04/lesson-6-instructions/" target="_blank">
        <span class="s1-btn-icon">&#128196;</span> Instructions &amp; Review
      </a>
      <a class="s1-btn s1-btn-notebook" href="https://notebooklm.google.com/notebook/55f72f96-7413-4e25-9b23-bbce5ce5c1d5" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128214;</span> NotebookLM: Summary
      </a>
      <a class="s1-btn s1-btn-colab" href="https://github.com/IyadSultan/CCI/tree/main/session4/student" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128209;</span> All Colab Notebooks
      </a>
      <a class="s1-btn s1-btn-resource" href="https://huggingface.co/docs/transformers/index" target="_blank" rel="noopener noreferrer">
        <span class="s1-btn-icon">&#128196;</span> Transformers docs
      </a>
    </div>
  </div>
</div>

<!-- ─── Assignment ─── -->
<div class="s1-assignment">
  <h3>Session 4 Assignment &mdash; Clinical NER Fine-Tuning Pipeline</h3>
  <p style="color:#CFD8DC;font-size:0.85rem;line-height:1.6;margin-bottom:0.75rem;">
    Fine-tune a biomedical NER model for pathology-style tumor registry text: baseline <code>d4data/biomedical-ner-all</code>, optional HF dataset (e.g. BC5CDR / NCBI Disease), Trainer setup, entity-level precision/recall/F1, and a written comparison to OpenAI extraction from Session 3 (cost, privacy, latency, accuracy). Includes stretch options (multi-model benchmark, SQLite JSON export, or alternate clinical task).
  </p>
  <p style="color:#90A4AE;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">
    <strong style="color:#FFC107;">Grading:</strong> Code Quality (25%) &middot; Clinical Relevance (25%) &middot; Critical Analysis (25%) &middot; Stretch Challenge (25%)
  </p>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <a href="https://academy.khcc.jo/course/view.php?id=208" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:#FFC107;color:#1B2A4A;font-weight:700;font-size:0.85rem;text-decoration:none;transition:all .15s;border:none;" onmouseover="this.style.background='#FFD54F'" onmouseout="this.style.background='#FFC107'">
      Open Assignment on CCI Academy &#8594;
    </a>
  </div>
</div>

<div class="s1-footer-note">
  KHCC Cancer Care Informatics &middot; Session 4 of 15
</div>
