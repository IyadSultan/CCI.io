---
layout: page
title: "Lesson 1: Writing a PRD with the PRD-Builder Skill"
permalink: /session_10/instructions/lesson1_prd/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 1 — Writing a PRD with the PRD-Builder Skill

> 📽️ **Session slides:** [Claude Code presentation](https://docs.google.com/presentation/d/1p7xHIDY2fA2Gtxw_zD8IEJa6Rs9aCfTVuBdVcAk58ok/edit?usp=sharing) — overview of Claude Code before we dive into PRDs.

A clinical team meets on Tuesday, decides to "build a triage tool," opens Claude Code on Thursday, and by Friday afternoon has a half-working app that nobody asked for, missing the one feature the charge nurse actually needed. The fix is not faster typing. The fix is a piece of paper before the typing starts. That piece of paper is called a **PRD** — a *Product Requirements Document* — and this lesson teaches you to write one in about twenty minutes using a Claude Code skill that Dr. Sultan built specifically for the AI Office.

## What a PRD is

A **PRD** is a short structured document that names the clinical problem, the user, what success looks like, and what the v1 will and will not do. It is the contract between the person who wants the tool and the person (or agent) who is going to build it.

The medical analogy is the **study protocol** you write before opening an IRB submission. You do not start enrolling patients and then figure out the inclusion criteria. You write the criteria first, you circulate them, you fix the obvious holes, and then you enroll. A PRD plays the same role for software: it is the thing you write before you let anyone — junior developer, contractor, or AI agent — start producing code.

> 🧠 **Remember.** The whole point of a PRD is to prevent the "build-then-realize" failure mode. The cost of a missing requirement at PRD time is a sentence. The cost of the same missing requirement after two weeks of coding is two weeks of coding.

A clinical PRD typically answers seven questions on its first page: *Who is the patient? Who is the clinician using this? What data are we reading? What does it produce? Where does the output go? What does success look like? What are the explicit non-goals?* If a PRD cannot answer those seven questions cleanly, it is not finished.

## The PRD-Builder skill

You do not write a PRD from a blank file. Inside this session's templates folder lives a Claude Code **skill** called `prd-builder`. (We will go deep on skills as a concept in Lesson 3 — for now treat it as a named workflow Claude can invoke when you ask.) The skill lives at:

```
session_10/templates/skills/prd-builder/
```

Open it. There is a `SKILL.md` file that defines the workflow, and a `references/` folder with two PRD templates. The skill is invoked by asking Claude to use it by name — e.g. *"Use prd-builder to draft a PRD for X."*

> 🔧 **Technical Stuff.** A skill in Claude Code is a folder with a `SKILL.md` file at its root. The first lines of that file (the **frontmatter**) tell Claude when to load the skill. The rest is the instructions Claude follows once it is loaded. Skills are how Anthropic and the AI Office package repeated workflows — extraction patterns, security reviews, document generation — so they can be triggered by name without re-explaining the recipe each time.

The skill runs three steps every time:

1. **Classify.** Read your input and decide which template applies — the AIDI clinical PRD or the generic PRD. If the signal is mixed, it asks you once.
2. **Checkpoint.** Compare what you said against the five **critical sections** for that template. If anything is missing, it asks one focused, batched question covering only the gaps. It never interrogates you item by item.
3. **Draft.** Produce a complete Markdown PRD with `[TBD]` markers for anything still unknown and `[assumed — confirm]` markers for sensible inferences. Every gap surfaces in an Open Questions section at the bottom.

That third step is the discipline that matters. **Every PRD has gaps.** The skill does not pretend otherwise — it surfaces the gaps in one place so a human can fill them in the next conversation.

## The two templates

Two templates ship with the skill. You pick (or the skill picks for you) based on whether you are building a KHCC clinical AI product or anything else.

**The AIDI clinical template** (`references/aidi-clinical-template.md`) is the long one — twenty top-level sections including Clinical Context, Data Sources, Users & Stakeholders, Functional Requirements, Non-functional Requirements, Architecture, LLM Use, Validation & Evaluation, Risks, Compliance, Rollout Plan, Dependencies, and Timeline. It assumes the standard AIDI stack (Databricks Unity Catalog, Azure SQL `AIDI-DB`, GPT-4.1-mini, Azure Communication Services for email, Fernet/Optimus for PHI) and pre-populates those fields. The five **critical sections** the skill insists on before drafting are:

1. Clinical problem & patient population
2. Data sources (which VISTA/SILVER/GOLD tables)
3. Output channel (Django UI / email / dashboard / SQL table)
4. Primary clinical user
5. Success criteria

**The generic template** (`references/generic-template.md`) is the shorter one — seventeen sections: TL;DR, Background, Goals, Non-goals, Personas, User Experience, Functional Requirements, Non-functional Requirements, Tech, Dependencies, Metrics, Risks, Rollout, Timeline, Open Questions, Appendix. The five critical sections here are:

1. Problem statement
2. Target users
3. Core goal
4. Out-of-scope boundaries
5. Constraints

> 💡 **Tip.** When in doubt, the skill will ask. Do not try to force-fit a Chrome extension into the AIDI clinical template — Validation against the deceased-patient cohort is not what a Chrome extension needs.

## A worked example: a Chrome extension that summarizes PubMed papers

Let us walk one through end to end. You open Claude Code in an empty project folder. You type:

```
Use prd-builder to draft a PRD for a Chrome extension that summarizes PubMed
papers when I hover over the abstract.
```

The skill loads. It classifies: this is **generic** (no KHCC data, no clinical workflow, no extraction pipeline). It scans your sentence against the five generic critical sections. It has the problem (rough), the user (you-as-clinician, but who else?), and the core goal (summarize). It is missing concrete constraints. So it asks **one batched question**:

> Before I draft, I need three quick answers:
> 1. Target user — clinicians, students, researchers, or all three?
> 2. Summary format — three bullet points, one paragraph, or structured (population/intervention/outcome)?
> 3. Where does the LLM call run — on-device, cloud via your own API key, or a centrally hosted backend?

You answer: clinicians, structured (PICO), cloud via BYO key. The skill drafts a complete PRD — roughly two pages of Markdown — and saves it as `chrome-pubmed-summarizer-PRD.md`. The Open Questions section at the bottom lists what is still unresolved: which browsers besides Chrome, distribution channel (Chrome Web Store vs internal sideload), telemetry, and a few others. Those become next-conversation work.

The whole exchange took three messages. You now have a PRD.

## The KHCC angle

This is the same skill Dr. Sultan uses on real production work. The **AKI Notification Pipeline** (see `ch00b_what_aidi_builds.md` for the full project list) started as a one-page PRD from this skill — clinical context (KDIGO criteria, adult inpatients), data source (`VISTA_LAB` creatinine, `VISTA_ADT` for admit dates), output channel (ACS email to on-call nephrology), success metric (no stage 2/3 missed in a 90-day silent shadow). The **Chemotherapy Preparation Checker** started the same way. So did the **ER Triage Extractor** that you will rebuild as your capstone in Lessons 8 and 9.

In every case the first-draft PRD was full of `[TBD]`s. That is the point. Over the next week, a champion clinician and an AIDI engineer sat with the document and filled in the gaps — the renal-dose thresholds, the exact alert recipient list, the eval cohort size, the rollout phasing. The PRD is the *frame*; the week after is the *picture*.

> ⚠️ **Warning.** A PRD with no `[TBD]` markers is probably lying. Either the author wrote a brief description and the skill silently invented details, or the project really is that simple. If you see a v1 PRD with zero open questions, read it three more times. Something is almost certainly assumed without being checked.

## When NOT to use this skill

A PRD is overkill for a one-off ad-hoc query, a five-line script you will throw away tomorrow, or a code review. The PRD-Builder skill is for products — things you intend to ship, run on a schedule, or hand to another human. If your task is "extract last quarter's vancomycin troughs into a CSV so I can look at them this afternoon," skip the PRD and just write the SQL. The skill itself flags this: clinical study protocols belong in a different skill, technical design docs are a different document, and one-line marketing pitches are not PRDs at all.

## Try This

Open Claude Code in any empty folder. Type:

```
Use prd-builder to draft a PRD for a small web app that lets ICU nurses
log boluses and have the system flag patients exceeding 30 mL/kg in 24 h.
```

The skill should classify this as AIDI clinical (ICU, clinical workflow, alerting). It should ask one batched question covering data source (VISTA fluid balance table? new manual entry?), output channel, alert recipient, and success criterion. Answer however you like — the point is the *shape* of the conversation, not the right answers.

When the draft appears, open the Open Questions section first. Count the `[TBD]`s. Those are the things you would now take to a real ICU consultant before writing any code.

## Watch Out

Three failure modes the first time you use this skill:

- **Skipping the checkpoint by giving too much detail.** If you paste a five-paragraph brain dump, the skill may decide all five critical sections are answered and go straight to drafting. Read the draft carefully — anything you did not actually specify will be tagged `[assumed — confirm]`, and you need to confirm them, not nod past them.
- **Treating the PRD as final.** It is a v0.1 draft. Real PRDs at the AI Office go through three to five revisions with the clinical champion before anyone writes code.
- **Putting PHI in the PRD.** The PRD is a planning document, not a data file. Real MRNs and patient names never go in it. Use placeholders like "test MRN" or encoded examples.

Next lesson: you have a PRD. How do you teach Claude itself to follow the rules in it, every session, automatically? That is `CLAUDE.md`.
