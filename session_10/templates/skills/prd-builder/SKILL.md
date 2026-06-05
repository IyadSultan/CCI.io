---
name: prd-builder
description: Converts any text input — bullet points, brain dumps, meeting notes, transcripts, or detailed specs — into a complete, well-structured Product Requirements Document (PRD). Use this skill whenever Iyad asks to "create a PRD", "build a PRD", "write a PRD", "turn this into a PRD", "draft requirements", "spec out [feature/product]", "make a product requirements doc", "feature spec", "product spec", or pastes raw text describing a product, app, or feature that needs structured documentation. Auto-detects whether the product is a KHCC AIDI clinical AI product (Django apps, Databricks pipelines, clinical decision support, alerting/extraction tools) or a generic software product, and applies the appropriate template. Always use this skill for these tasks — it produces a far more complete and structured PRD than a generic approach, and asks targeted follow-up questions when critical sections are missing rather than guessing.
---

# PRD Builder

Converts free-form text into a complete Product Requirements Document. Two flavors:

- **AIDI clinical PRD** — for KHCC clinical AI products: Django apps, Databricks pipelines, decision-support tools, extraction pipelines, alert systems.
- **Generic software PRD** — for any other product or feature.

Output is **Markdown by default**. Produce **Word (.docx)** only if the user explicitly asks for it (delegate to the `docx` skill).

---

## Workflow

### Step 1 — Classify the input

Read the user's text and decide which template applies. Signals that this is an **AIDI clinical PRD**:

- Mentions KHCC, AIDI, VISTA, Databricks, Azure SQL, MRN, oncology, clinical, IRB, Fernet, Optimus, ACS, `gpt-4.1-mini`, or `SILVER_/GOLD_/dbo.` tables
- Talks about pipelines, extractors, alert systems, dashboards used by clinicians
- Mentions existing Django apps: `iNotes`, `APPOSE`, `KHCC iTrack`, `CRA`, `GoldMiner`
- Describes patients, cohorts, clinical workflows, or deployment to KHCC infrastructure

If the signals are mixed or absent, **ask once**: "Is this for a KHCC AIDI clinical product or a generic software product?" Don't guess — the templates differ meaningfully.

### Step 2 — Always checkpoint before drafting (ask only about genuine gaps)

**Always pause for a checkpoint before drafting — never draft on the first turn.** But keep the checkpoint proportional to what's actually missing: don't re-ask things the input already answered. The rule is *always confirm, only ask about real gaps*.

Scan the input against the **critical sections** below. Mark each as: answered, partially answered, or missing.

**Critical sections:**

For **AIDI clinical PRDs**:
1. Clinical problem & target patient population
2. Data sources (which VISTA/SILVER/GOLD tables, or new data?)
3. Output channel (Django UI, email via ACS, dashboard, alert, SQL table?)
4. Primary clinical user (oncologist, ER physician, ICU consultant, pharmacist, nurse, admin?)
5. Success criteria (clinical impact, accuracy target, adoption metric?)

For **generic PRDs**:
1. Problem statement (what hurts today?)
2. Target user(s)
3. Core goal / what success looks like
4. Out-of-scope boundaries
5. Constraints (timeline, budget, tech stack)

**What to do at the checkpoint** — pick the branch that matches:

- **One or more critical sections missing or partial** → Ask a focused, batched question set covering *only* the gaps. Use the `ask_user_input_v0` tool when the choices are constrained (single/multi-select); use plain text questions when open-ended. Don't ask one at a time; don't ask about sections the input already covers. Wait for the answer, then draft.

- **All critical sections answered** → Don't ask redundant questions. Instead, post a brief confirmation and proceed: summarize in one or two lines what you understood (product type + the gist), state that you have what you need, and invite additions before continuing — e.g. *"Got it — this reads as an AIDI clinical PRD for an ICU sepsis-alert pipeline. I have everything I need to draft. Drafting now; tell me if you want to add or change anything."* Then draft in the same turn. This honors the always-checkpoint rule without nagging.

Either way: don't interrogate the user about nice-to-haves at this stage. The checkpoint exists to confirm direction and clear genuine blockers — not to extract every detail upfront. Everything still-unknown after the checkpoint becomes a `[TBD]` in the draft and is surfaced under Open Questions.

### Step 3 — Draft the PRD

Load the appropriate template:

- AIDI clinical → `references/aidi-clinical-template.md`
- Generic → `references/generic-template.md`

Fill in every section from the input. Rules:

- Where the user provided detail → expand into prose, bullets, or tables as appropriate.
- Where input is thin but inferrable from context (e.g., AIDI products almost always use the standard stack: Databricks Unity Catalog, Azure SQL `AIDI-DB`, `gpt-4.1-mini`, ACS, Fernet/Optimus) → fill it in and flag inline with `[assumed — confirm]`.
- Where input genuinely lacks info on a non-critical section → write `[TBD]` and list under Open Questions.

**Tone:**
- Direct, declarative, no fluff. Match Iyad's operational style.
- Avoid hype words: "revolutionary", "cutting-edge", "leverages", "seamless", "robust", "empowers". Just say what it does.
- Use present/future tense ("The pipeline extracts X", "v1 ships Y") — not marketing voice.

**Length:** aim for completeness, not brevity. A PRD missing sections is worse than one with `[TBD]`s — the structure itself is the value.

### Step 4 — Save and present

Save to `/mnt/user-data/outputs/<short-product-slug>-PRD.md`. Examples: `inotes-v2-PRD.md`, `sepsis-prediction-PRD.md`, `chrome-pubmed-summarizer-PRD.md`. Call `present_files` with the path.

If the user asks for docx (upfront or after seeing the markdown):
1. Read `/mnt/skills/public/docx/SKILL.md`.
2. Convert the markdown PRD into a `.docx` using that skill's workflow.
3. Save to `/mnt/user-data/outputs/<short-product-slug>-PRD.docx` and present.

**Do not** pre-emptively generate docx. Markdown first; docx on request.

---

## Quality checklist (run before presenting)

- [ ] Every section in the template is present (even if `[TBD]`).
- [ ] Open Questions section lists every `[TBD]` and `[assumed — confirm]` flag with a one-line description of what's needed.
- [ ] Success metrics are specific and measurable, not vague aspirations ("80% adoption in 90 days" — not "wide adoption").
- [ ] For AIDI PRDs: data sources, output channel, primary clinical user, and validation approach are all named.
- [ ] For generic PRDs: problem, user, goal, and out-of-scope are all explicit.
- [ ] No marketing language slipped in.

---

## Examples of input → output behavior

**Sparse AIDI input:**
> "Build a tool to flag delayed cancer diagnoses from referral notes."

→ Too sparse. Ask in one batch: target patient population? source notes (VISTA referral vs OPD)? what defines "delayed"? who receives the flag? success criterion?

**Rich AIDI input:**
> Full description of a sepsis-prediction pipeline with SOFA computed from VISTA labs/vitals, ICU adult cohort, ACS alert to on-call consultant, validation against 6-month frozen cohort.

→ All critical sections answered. Don't draft silently and don't ask redundant questions — post the brief confirmation checkpoint ("reads as an AIDI clinical PRD for an ICU sepsis-alert pipeline; I have what I need; drafting now, say the word to adjust"), then draft in the same turn. Fill in standard infra (Databricks, Fernet, Optimus, ACS endpoint) as `[assumed — confirm]`. Surface 2–3 open questions on edge cases (e.g., alert suppression rules, escalation path).

**Generic input:**
> "Want a Chrome extension that summarizes papers from PubMed."

→ Ask in one batch: target user (researcher, clinician, student)? summary format and length? offline LLM, cloud, or BYO-key? distribution (Chrome Web Store or internal)? Then draft the generic PRD.

---

## When NOT to use this skill

- One-line product pitches or marketing copy → not a PRD.
- Clinical study protocols or IRB documents → use `scientific-writing` or `clinical-case-review`.
- Pure technical design docs / architecture specs → PRDs describe *what* and *why*, not *how* in detail. If the request is purely about engineering design, defer or hand off.
- AIDI policy documents → use the `aidi-policy` skill.
