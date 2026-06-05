# Chapter 12: Skills

A skill is what happens when you stop explaining the same thing to Claude every week and instead write it down once, in a file Claude reads on its own when the topic comes up.

Slash commands (Chapter 11) are *explicit*: you type `/optimize` to invoke one. Skills are *implicit*: Claude notices that the current task matches a skill's description and pulls it in automatically. You don't have to remember they exist. That's the point.

## What a Skill Actually Is

A skill lives at `.claude/skills/<skill-name>/SKILL.md`. The minimum is one file with YAML frontmatter:

```markdown
---
name: code-refactor
description: Systematic code refactoring based on Martin Fowler's methodology. Use when the user asks to refactor code, improve code structure, reduce technical debt, clean up legacy code, eliminate code smells, or improve maintainability. Guides through a phased approach with research, planning, and safe incremental changes.
---

# Code Refactoring Skill

A systematic approach to refactoring code...
[rest of the playbook]
```

The frontmatter has two required fields: `name` and `description`. The description is the most important line in the whole file because that's what Claude reads to decide whether the skill is relevant to the current task. Vague descriptions trigger never; precise descriptions trigger exactly when they should.

The body of `SKILL.md` is the playbook itself. It can be as long as it needs to be. Claude only loads the body when it actually invokes the skill, so length here is cheap.

> 🧠 **Remember.** A skill is just a folder with a `SKILL.md` in it. There's no plugin manifest, no install step, no version checking. If the file is in `.claude/skills/`, it's available. If not, it isn't.

## Skills vs. Slash Commands

This trips people up at first. They look similar (both are markdown files with prompts) but they're invoked differently:

- A **slash command** is explicit. You type `/commit` and the command runs. Claude doesn't decide; you do.
- A **skill** is description-driven. When you ask Claude to do something, it scans the descriptions of all available skills and invokes the matching one on its own. You don't type a magic word; you just describe the task in plain English.

Rule of thumb:

- Use a **slash command** when *you* know you want the workflow ("commit this," "run the eval suite").
- Use a **skill** when *Claude* needs to recognize it ("the user is asking to refactor: go read the refactoring playbook").

> 💡 **Tip.** If a workflow's trigger is a verb ("refactor," "review," "draft"), it's probably a skill. If it's a noun-y shortcut ("commit," "deploy," "report"), it's probably a slash command. Some workflows want both: a skill that gets pulled in automatically and a slash command that forces it.

## The Context Trick

Skills are designed to *not* inflate your baseline context. Here's how that works:

1. At session start, Claude only loads the names and descriptions of available skills. That's typically 100 characters per skill.
2. When you ask something that matches a description, Claude loads that skill's `SKILL.md` body into context.
3. When `SKILL.md` references other files (`templates/foo.md`, `references/bar.md`, `scripts/baz.py`), Claude reads those *only when it actually needs them*.

So you can have 30 skills installed and the baseline cost is 30 short descriptions. The big playbooks only get loaded when relevant.

This is the difference between a skill and just pasting the same playbook into `CLAUDE.md`. The playbook in `CLAUDE.md` costs tokens every single turn forever. The skill costs nothing until it fires.

> 🔧 **Technical Stuff.** The matching is done by the model itself, not a regex. That's why the description has to be written for the model, not for you. "Use when..." and "Trigger for..." phrasings work because they're imperative instructions the model can act on.

## The Anatomy of a Real Skill

Let's walk through the `code-refactor` skill end to end (from the `luongnv89/claude-howto` repo).

The folder layout:

```
.claude/skills/code-refactor/
├── SKILL.md
├── references/
│   ├── code-smells.md
│   └── refactoring-catalog.md
├── templates/
│   └── refactoring-plan.md
└── scripts/
    ├── analyze-complexity.py
    └── detect-smells.py
```

`SKILL.md` is the entry point. It defines six phases (research, test coverage, code-smell ID, plan, incremental implementation, review) and references the supporting files where the detail lives:

```markdown
See [references/code-smells.md](references/code-smells.md) for the complete catalog.
See [templates/refactoring-plan.md](templates/refactoring-plan.md) for the planning template.
```

Claude doesn't read `code-smells.md` at session start. It doesn't read it when the skill fires. It only reads it when, mid-refactor, it needs the smell catalog. The full reference is hundreds of lines, and it costs zero tokens until that moment.

Supporting `scripts/` are even better: they're shell or Python tools Claude can *execute* rather than read. `python scripts/detect-smells.py src/auth.py` runs an analyzer and returns its output. Deterministic work belongs in scripts; only the judgment calls belong in the LLM.

> ⚠️ **Warning.** Skills can carry executable scripts. Anyone who installs your skill into their project is also trusting your scripts. Don't ship a skill with a `curl | bash` script in it. And don't install skills from random repos without reading the scripts first.

## Three KHCC Skills Worth Building

Here are three skills that would pay rent in any AIDI workflow.

### `aidi-extractions`

The description-driven trigger is what makes this powerful. Description:

> "SQL Server extraction patterns, gotchas, and best practices for building clinical data cohort tables at King Hussein Cancer Center (KHCC) AIDI Department. Use this skill whenever building or modifying any SQL extraction pipeline against KHCC VISTA_ / SILVER_ / GOLD_ tables — even for simple queries. Also covers Databricks notebook coding standards, Azure OpenAI (gpt-4.1-mini) integration, PydanticAI structured extraction, email sending via Azure Communication Services, Fernet encryption, Optimus MRN encoding, and Azure TTS."

Contents:

- `SKILL.md`: the spine — connection patterns, decryption pattern, MRN encoding, the deceased-patient eval gate, the email pattern.
- `references/silver-vs-gold.md`: schema reference for the SILVER_ and GOLD_ tables.
- `references/pydanticai-patterns.md`: extraction patterns with examples.
- `templates/notebook-template.py`: a starter Databricks notebook with the cell structure, imports, and Fernet/Optimus helpers wired up.
- `scripts/verify-mrn-encoding.py`: a deterministic check that every row in an output table has Optimus-encoded MRNs.

Now any time someone says "extract chemo orders for the FN cohort," Claude pulls in the playbook without anyone having to remember it exists.

### `r-clinical-analysis`

Description:

> "R Markdown template and best-practice patterns for clinical/oncology research analysis. Use when writing R code for medical datasets, survival analysis, GvHD studies, BMT outcomes, or any clinical report requiring baseline characteristics tables, Kaplan-Meier curves, univariable/multivariable Cox regression, and publication-ready output. Covers data cleaning, date handling, factor conversion, gtsummary tables, finalfit Cox regression, survminer plots with Lancet theming."

Contents:

- `SKILL.md`: the analysis spine — tidyverse setup, date handling gotchas, factor conversion rules, the order of operations for survival analysis.
- `templates/clinical-analysis.Rmd`: a complete Rmd template with KHCC headers.
- `references/lancet-theming.md`: the survminer theme customizations for Lancet-style figures.
- `references/gtsummary-recipes.md`: the table-1 patterns the team uses.

### `scientific-writing`

Description:

> "Deep research and scientific writing assistant that produces publication-ready academic documents with verified citations. Use when the user asks to write, draft, or create a scientific paper, manuscript, literature review, grant proposal, clinical report, abstract, or any academic document. Also covers IMRAD structure, CONSORT/STROBE/PRISMA reporting guidelines, and journal-specific formatting."

Contents:

- `SKILL.md`: the writing process — outline-then-prose two-stage, citation discipline, reporting-guideline compliance.
- `references/imrad-structure.md`: the IMRAD section-by-section playbook.
- `references/reporting-guidelines.md`: CONSORT, STROBE, PRISMA checklists.
- `templates/manuscript.tex`: LaTeX skeleton.
- `templates/cover-letter.md`: cover-letter template.

Notice the pattern: the `SKILL.md` is short and high-level; the heavy reference material lives in files that load on demand.

> 💡 **Tip.** Write the `SKILL.md` last. Build out the references and templates first. Then write the spine that ties them together. You'll end up with a sharper skill because you've already worked through the details.

## Where Skills Live

- `.claude/skills/<name>/SKILL.md`: project-level, checked into git.
- `~/.claude/skills/<name>/SKILL.md`: personal, available across every project.

Anthropic ships a bundle of high-quality skills you can install (`docx`, `pptx`, `xlsx`, `pdf`, `scientific-writing`, and more). Browse them, copy the ones you want, adapt them. The structure is consistent.

## Try This

1. Pick a workflow you explain to Claude every week. Write it down. The first draft is your `SKILL.md`.
2. Write the description twice. Once for what the skill does. Once for *when* Claude should use it. The second one is what actually triggers it; make it specific.
3. Drop the file at `.claude/skills/<your-skill-name>/SKILL.md`. Start a new session. Phrase a request that should trigger the skill. Notice Claude pulling it in.
4. Now intentionally ask something that should *not* trigger it. Notice Claude leaving it alone. If it triggers anyway, your description is too broad. Tighten it.

## Watch Out

- **Vague descriptions are useless.** "Use this skill for code stuff" matches every code request and degrades into noise. Be specific about what triggers and what doesn't.
- **Skills with executable scripts are a trust boundary.** Treat them like any code you'd install: read it before running it.
- **Don't put every rule into a skill.** Universal rules belong in `CLAUDE.md`. Skills are for playbooks that are conditional on what the user is doing.
- **Don't make a skill that contradicts your `CLAUDE.md`.** When they fight, Claude blends them, and that's the worst outcome. Pick one place for each rule and stick to it.
- **Don't ship a skill without testing the trigger.** Open a fresh session, phrase three different requests that should fire it, and confirm it loads each time. Then phrase one that shouldn't, and confirm it doesn't.
