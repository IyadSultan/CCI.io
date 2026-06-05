---
layout: page
title: "Lesson 3: Claude Code Skills"
permalink: /session_10/instructions/lesson3_skills/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 3 — Skills (and a Footnote on Output Styles)

*25 minutes. Reading + one worked build + a 5-minute footnote on `/config`.*

A senior resident is about to admit a febrile-neutropenia patient at 2 AM. She does not page the attending to ask which cultures to draw. She opens the febrile-neutropenia clinical pathway taped to the workroom wall — blood cultures times two, urine culture, chest X-ray, piperacillin-tazobactam within sixty minutes, vancomycin if a line is in — and she follows it. The pathway does not do the work. It tells the person at the bedside *how the work is done here*.

A Claude **skill** is the same idea. A folder on disk, with a written playbook inside, that Claude reads when the task in front of it matches the skill's description. The skill does nothing on its own. It is a packaged piece of institutional memory that Claude pulls in when the situation calls for it.

> 🧠 **Remember.** A skill is a folder containing a playbook. There is no plugin to install, no marketplace to browse. If the folder is in the right place, the skill is available.

## Skills vs CLAUDE.md — the distinction that matters

You met CLAUDE.md in Lesson 2. It is the file that loads at the start of *every* Claude Code session. Universal rules — "never log MRNs in plaintext," "GPT-4.1-mini is our default model," "match the Lancet plotting theme" — belong there because they apply to everything.

A skill loads **only when invoked**. If the user has not asked you to draft a manuscript, the `scientific-writing` skill costs nothing. Its description (a single sentence) is visible to Claude at session start; the playbook itself is read off disk the moment Claude decides the task matches.

A simple test:

- *Does this apply to every session, no matter what the user is doing?* → CLAUDE.md.
- *Does this apply only when the user is doing a specific kind of task?* → Skill.

The KDIGO AKI thresholds you read about in Chapter 0.5 are a CLAUDE.md rule across the AKI repo because every script in that repo touches them. The PydanticAI schema for tumor staging is a skill, because only the pathology extraction pipelines need it.

> ⚠️ **Watch out.** If a CLAUDE.md rule and a skill contradict each other, Claude does the worst possible thing: it averages them. Pick one home for each piece of guidance.

## What a skill looks like on disk

A skill lives at `.claude/skills/<skill-name>/SKILL.md`. The minimum viable skill is one file:

```markdown
---
name: pathology-extraction
description: Use when the user asks to extract structured fields (tumor size, T-stage, N-stage, margins, grade, histology) from a free-text pathology report. Applies KHCC AI Office conventions — Azure OpenAI GPT-4.1-mini via PydanticAI, strict schema, eval against the deceased-patient cohort before shipping.
---

# Pathology Extraction Skill

Steps to extract a structured row from a free-text pathology report...
```

Two fields are required in the frontmatter (the block fenced by `---` lines at the top):

- **`name`** — the identifier. Lowercase, hyphens, matches the folder name.
- **`description`** — by far the most important line in the file. This is what Claude reads to decide whether the skill applies. A vague description ("for pathology stuff") triggers on everything and becomes noise. A specific description ("Use when the user asks to extract T-stage, margins, grade, or histology from a free-text pathology report") triggers when it should and stays quiet when it shouldn't.

Everything below the frontmatter is the playbook. Write it in plain Markdown.

> 🔧 **Technical Stuff.** The match between the user's request and a skill's description is made by Claude itself, not by a regex or keyword filter. That is why descriptions are written as instructions to the model — "Use when…" phrasing works because it tells the model what to do, not what to look for.

## How a mature skill is laid out

Real skills are usually more than one file. The `SKILL.md` is the spine, and supporting material lives alongside:

```
.claude/skills/pathology-extraction/
├── SKILL.md
├── references/
│   └── tumor-staging-pitfalls.md
├── templates/
│   └── pydantic-schema.py
└── scripts/
    └── verify-eval.py
```

`references/` holds long-form documents Claude reads *only when it actually needs them mid-task*. `templates/` holds files Claude can copy as a starting point. `scripts/` holds small deterministic helpers Claude can run.

The clever part: `SKILL.md` only references these files. Claude does not load them at session start. It does not load them when the skill fires. It loads `tumor-staging-pitfalls.md` only at the moment, mid-extraction, when it actually needs the pitfall catalog. The reference doc can be hundreds of lines and it costs zero attention until the moment it matters.

Look at the **CCI PRD-Builder** skill you installed in Lesson 1 ([download](/CCI.io/session_10/skills/cci-prd-builder.skill)). Its `SKILL.md` frontmatter names every phrase a user might say ("create a PRD", "build a PRD", "spec out") so the skill fires reliably. The body references clinical and generic PRD templates in `references/`; those load only when the skill is actually drafting a PRD.

## A worked build — `pathology-extraction-skill`

Let's build a real one. Three files, roughly fifteen minutes of typing.

### File 1: `SKILL.md`

```markdown
---
name: pathology-extraction
description: Use when the user asks to extract structured fields (tumor size, T-stage, N-stage, margins, grade, histology) from a free-text pathology report at KHCC. Applies AI Office conventions — Azure OpenAI gpt-4.1-mini via PydanticAI, eval against the deceased-patient cohort before shipping.
---

# Pathology Extraction Skill

## When this fires
A clinician pastes a pathology report or asks to "extract fields from this path report".

## Process
1. Read `references/tumor-staging-pitfalls.md` before drafting the prompt. The four common errors are documented there.
2. Copy `templates/pydantic-schema.py` as the starting schema. Add or remove fields based on the report's cancer type.
3. Call `gpt-4.1-mini` through PydanticAI with `temperature=0` for determinism.
4. Before shipping, run against the frozen deceased-patient eval cohort. If F1 drops on any field, surface the diff and stop.
5. Optimus-encode every MRN. Fernet-encrypt every patient name. Nothing in plaintext leaves the extractor.

## Output
A structured row matching the Pydantic schema, plus a confidence note for any field the model marked uncertain.
```

### File 2: `references/tumor-staging-pitfalls.md`

```markdown
# Tumor Staging Pitfalls

Four mistakes the extractor has historically made. Read before drafting any new prompt.

1. **Confusing clinical (cT) with pathologic (pT) stage.** The report often contains both. Always extract pT; mark cT as a separate field if present. The hand-curated eval cohort uses pT.

2. **Margin status ambiguity.** "Margins close" is not the same as "margins positive". The schema must allow `close`, `positive`, `negative`, and `unable to assess` as distinct values. Do not collapse them.

3. **Multifocal disease.** A report describing three foci should produce three rows, not one row with the largest size. The schema's `focus_id` field exists for this reason.

4. **Re-excision vs primary specimens.** The same patient can have two pathology reports for the same lesion. The schema flag `specimen_type` (`primary`, `re_excision`, `lymph_node`) must be populated, or downstream survival analyses will double-count.
```

### File 3: `templates/pydantic-schema.py`

```python
from pydantic import BaseModel, Field
from typing import Literal, Optional

class PathologyExtraction(BaseModel):
    tumor_size_cm: Optional[float] = Field(None, description="Largest dimension in cm")
    t_stage_pathologic: Literal["pT1", "pT2", "pT3", "pT4", "pTX"]
    n_stage_pathologic: Literal["pN0", "pN1", "pN2", "pN3", "pNX"]
    margin_status: Literal["negative", "close", "positive", "unable_to_assess"]
    grade: Literal["1", "2", "3", "unknown"]
    histology: str
    specimen_type: Literal["primary", "re_excision", "lymph_node"]
    focus_id: int = 1
    confidence_notes: Optional[str] = None
```

Now save this folder at `.claude/skills/pathology-extraction/`. Start a fresh Claude session. Paste a pathology report and ask: *"Extract the structured fields from this report."* Claude reads the descriptions of every installed skill, matches yours, opens `SKILL.md`, sees the references to the two supporting files, opens *those* at the moment it needs them, and produces a structured row that obeys all four staging-pitfall rules.

You just packaged a piece of institutional knowledge that every pathologist-extraction task in the repo will now follow.

> 💡 **Tip.** Write the supporting files first, then the `SKILL.md`. Articulating the staging pitfalls and the schema forces you to think clearly. The `SKILL.md` becomes a short spine that ties them together — usually much shorter than your first draft.

## Three more skills the AI Office could build

Don't build these now; sketch them in your head as you read so you start seeing the skill shape everywhere.

**`aidi-extractions`** — the general-purpose KHCC extraction playbook. Every clinical pipeline in the AI Office, underneath the surface, does the same thing: read a free-text source, run it through GPT-4.1-mini via PydanticAI, decrypt names with Fernet, encode MRNs with Optimus, append to a `GOLD_*` table, gate on the deceased-patient eval. A single skill could capture that whole pattern. References would hold the silver-vs-gold schema and the PydanticAI patterns. Templates would hold a Databricks notebook skeleton.

**`r-clinical-analysis`** — the KHCC R analysis spine. The BMT outcomes paper, the Wilms tumor analyses, the post-surgery microbiology cohort all follow the same arc: a baseline-characteristics table from `gtsummary`, Kaplan-Meier curves with Lancet theming via `survminer`, Cox regression via `finalfit`, a calibration plot, standard sanity checks. Every clinician on a new project currently rebuilds this from memory. A skill would make the patterns consistent.

**`scientific-writing`** — drafts publication-ready academic prose with the two-stage outline-then-prose process, citation discipline, and reporting-guideline compliance (CONSORT for trials, STROBE for cohort studies, PRISMA for reviews).

## Skills vs slash commands

In a later lesson you'll meet **slash commands** (`/commit`, `/eval`). Both are markdown files holding instructions, but the trigger is different.

- A slash command is **explicit**. You type `/commit` and the command runs. You decide.
- A skill is **implicit**. You phrase a request in plain English and Claude matches it against the descriptions of all installed skills, pulling in the one that fits.

A rule of thumb: if the trigger is a verb you'd want to type yourself ("commit this"), make it a slash command. If the trigger is a *kind of task* you want Claude to recognise on its own ("the user pasted a path report"), make it a skill. Sometimes a workflow wants both.

## Footnote: output styles (5 minutes)

A small but useful feature, run from inside Claude Code: type `/config` and you can pick an **output style** — Explanatory, Concise, or Technical.

- **Explanatory** — Claude narrates what it is doing and why. Good when you are learning, or when you want a transcript you can paste into a teaching session.
- **Concise** — Claude does the work and reports the result in two lines. Good when you have used the tool a hundred times and you want the result, not the narration.
- **Technical** — Claude leans on precise terminology, type signatures, and command-line syntax. Good when you are pair-programming with the agent and you want it to talk to you like another engineer.

Same prompt — *"Why is this Cockcroft-Gault calculation returning NaN?"* — gives you three meaningfully different replies. Explanatory walks through the formula and points at the dividing-by-zero risk when creatinine is missing. Concise says "missing creatinine for MRN 12345 — fix the query." Technical says "`pd.eval` returns NaN when `serum_creatinine` is None; coerce upstream or filter before the join." All three are correct. Pick the voice that suits the moment.

> 💡 **Tip.** Default to Concise once you are past the learning phase. The tokens saved across a long session add up, and the answers are easier to scan.

## Try This

1. Pick one workflow you have explained to Claude more than twice this month — pulling labs into a cohort, summarising a discharge note, drafting a peer-review reply. Write the explanation down once. That draft is your `SKILL.md`.
2. Rewrite the description as two sentences that name the exact phrases a user might say to trigger the skill ("Use when the user asks to…"). The description is the contract; spend ten minutes on it.
3. Save the folder under `.claude/skills/<your-skill-name>/`. Start a fresh session. Phrase a request that should fire it. Notice Claude reading it in.
4. Phrase a request that should *not* fire it. If it fires anyway, the description is too broad. Tighten it.

## Watch Out

- **Vague descriptions are noise.** "Use this skill for clinical work" matches everything and trains Claude to ignore you. Be specific about when to fire and — equally important — when not to.
- **Skills can carry executable scripts.** Anyone who installs your skill is trusting your scripts to behave. Read scripts before installing skills from outside your team.
- **Skills are not a dumping ground for CLAUDE.md content.** Rules that apply to every session belong in CLAUDE.md. Skills are for *conditional* playbooks.
- **Test the trigger before shipping.** Open a fresh session, phrase three different requests that should fire the skill, confirm it loads each time, then phrase one that should not, and confirm it stays quiet. A skill you have not trigger-tested is a skill you have not built.
