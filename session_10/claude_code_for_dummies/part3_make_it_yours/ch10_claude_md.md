# Chapter 10: CLAUDE.md, Your Project Instruction Manual

Every project has a culture, and Claude shows up to work on day one knowing nothing about yours. `CLAUDE.md` is the onboarding document you hand it before the first commit.

`CLAUDE.md` is a plain markdown file that lives in the root of your project. Claude Code reads it before every single session, before the first prompt, before it looks at a single line of code. Whatever you put in there becomes the operating manual that frames every decision Claude makes for the rest of the conversation. Conventions, preferences, the names of the tables it's allowed to touch, the encoding scheme for MRNs, the eval suite it must run before declaring victory: all of it goes here.

If you ignore `CLAUDE.md`, Claude will guess. And in a clinical AI codebase, guessing is how a patient ends up missing from an AKI alert run.

## What CLAUDE.md Actually Does

When Claude Code starts up in a project directory, it walks the file tree looking for `CLAUDE.md` files at three levels:

1. **Personal**: `~/.claude/CLAUDE.md`. Your private global rules. Applies to every project you open. Things like "I use uv, not pip" or "always quote PowerShell paths with spaces."
2. **Project**: `./CLAUDE.md` at the repo root. The team's shared rules. Checked into git so everyone gets the same context.
3. **Directory**: a `CLAUDE.md` anywhere deeper in the tree. Applies only when Claude is working in that subdirectory. Useful for module-specific conventions (e.g., `notebooks/extraction/CLAUDE.md` listing the AIDI extraction patterns).

All three get concatenated into the system context. They cost tokens. They drift quality if they're too long. They are the single most important configuration step in Claude Code.

> 🧠 **Remember.** `CLAUDE.md` is read every session, before every turn. It is not a README. It is not for humans. It is a system prompt addendum, and every line of it spends attention from your context window.

## Step One: `/init`, Then Cut It in Half

The fastest way to get a `CLAUDE.md` is to run `/init` inside Claude Code. It scans your repo, infers your stack, and writes a starter file: framework, package manager, build commands, test commands, directory layout.

Then (and this is Suryansh Tiwari's rule #27) you cut the result in half. Maybe more. `/init` is generous. It produces a 200-line file when 40 lines would do. Read every line and ask: did Claude actually need this? If your repo is obviously a Django app, the line "this is a Django app" is a wasted token.

The litmus test (Suryansh #28): for every line, ask **"would Claude make a mistake without this line?"** If the answer is no, delete it.

> 💡 **Tip.** Run `/init` in a brand new project, immediately commit the generated file to git, then cut it in half on a second commit. The diff between the two commits is your record of what mattered.

## The Instruction Budget

There's a soft ceiling. Anthropic's own teams and the community have converged on roughly **150–200 instructions** before compliance starts dropping. Beyond that, Claude follows your rules less reliably. Not because the model can't see them, but because attention gets diluted across a wall of prose.

So treat `CLAUDE.md` like a budget. Every rule you add subtracts from the attention available for the next one. If you find yourself writing the 47th bullet about Python imports, ask whether a hook (Chapter 14) wouldn't do the job for free, with zero context cost.

> ⚠️ **Warning.** A bloated `CLAUDE.md` doesn't just cost tokens. It quietly degrades adherence to the rules you actually need. More is not better. The rule you needed Claude to follow is now competing with 40 lines about your preferred indentation.

## Auto-Update After Mistakes

Suryansh's rule #29 is the one most people skip and the one with the highest compounding return. Every time Claude makes a mistake (picks the wrong table, forgets to encode an MRN, uses `pip` when you told it `uv`) say:

> "Update `CLAUDE.md` so this doesn't happen again."

Claude will append a line. Over the course of a project, your `CLAUDE.md` becomes a living record of every lesson learned. The bugs you've already paid for become bugs you won't pay for twice.

> 🧠 **Remember.** Your `CLAUDE.md` should be growing as your project matures. If it hasn't changed in a month, you're either not catching mistakes or not feeding them back into the file.

## `.claude/rules/` for Conditional Rules

Some rules only apply in some folders. TypeScript rules don't help when Claude is working on R scripts. Azure SQL rules don't help in a frontend directory. Stuffing all of them into the global `CLAUDE.md` wastes context every time Claude is working somewhere they don't apply.

The fix is `.claude/rules/` (Suryansh #30). Each file there can declare a path frontmatter:

```markdown
---
paths:
  - "notebooks/extraction/**/*.py"
  - "notebooks/extraction/**/*.ipynb"
---

# AIDI Extraction Rules

- Always use PydanticAI for structured LLM extraction.
- Default model is `gpt-4.1-mini`.
- Decrypt names with Fernet, encode MRNs with Optimus.
- Never log MRNs in plaintext.
```

Claude only loads that file when working on a path that matches. Zero context cost when you're elsewhere.

## `@imports` to Keep the Main File Lean

You can reference another file from inside `CLAUDE.md` with `@`:

```markdown
For git conventions, see @docs/git-conventions.md.
For the deceased-patient eval workflow, see @docs/eval-cohort.md.
```

Claude loads the referenced file only when the topic actually comes up. Your base `CLAUDE.md` stays small; the long-form policies live in their own files where humans can read them too (Suryansh #31).

> 🔧 **Technical Stuff.** `@imports` are resolved relative to the location of the `CLAUDE.md` that contains them. They can be nested — an imported file can `@import` further files. Don't go more than two levels deep; debugging gets hard.

## The Auto-Memory File

There's also a memory file Claude maintains on its own. Tell it "remember that I always use tidymodels for R ML work" and it will write that fact into a memory file Claude reads on subsequent sessions. You don't manage it directly, but you can ask Claude to show you what's in there, add to it, or remove things.

Think of it as: `CLAUDE.md` is your hand-written manual; the memory file is the running notebook Claude keeps about you.

## A Real KHCC `CLAUDE.md`

Here's a starter for an AIDI clinical AI repository. Cut it down to fit your project. The goal is the shortest file that prevents the mistakes you've actually seen.

```markdown
# KHCC AIDI Pipeline — CLAUDE.md

## Stack
- Databricks notebooks (PySpark + Python cells).
- Azure OpenAI `gpt-4.1-mini` is the default model. PydanticAI for structured extraction.
- R: tidymodels, finalfit, gtsummary, survminer (Lancet theming).
- Unity Catalog: `aidi_catalog`. Azure SQL: `AIDI-DB`.

## Patient data — non-negotiable
- Never log MRNs or names in plaintext.
- MRNs: Optimus-encode before any output (email, dashboard, log).
- Names: Fernet-encrypt before storage.
- Eval cohorts use the frozen deceased-patient set in `aidi_catalog.dbo.eval_cohort`. Never include living patients in shared eval data.

## Eval gate
- No prompt or extraction change ships without an eval run on the deceased-patient cohort.
- Results table: `aidi_catalog.dbo.eval_runs`. Append-only. Never overwrite.

## The 12 rules (Karpathy + Mnilax)
1. Think before coding. Surface assumptions; ask rather than guess.
2. Simplicity first. Minimum code that solves the problem.
3. Surgical changes. Touch only what you must. Don't "improve" adjacent code.
4. Goal-driven execution. Define success, then loop until verified.
5. Use the model only for judgment calls. KDIGO staging is rules — compute it. Don't ask the LLM.
6. Token budgets are not advisory. 4k per task, 30k per session. Surface breaches.
7. Surface conflicts, don't average them. Pick one pattern; flag the other.
8. Read before you write. Read the file, the immediate caller, and shared utilities.
9. Tests verify intent, not behavior. Eval cases must test the clinical intent.
10. Checkpoint after every significant step.
11. Match the codebase's conventions, even if you disagree. Raise objections separately.
12. Fail loud. Silent failures are the most dangerous failure mode.

## Conventions
- See @docs/aidi-extractions.md for the extraction pipeline pattern.
- See @docs/email-pattern.md for the `DoNotReply@khcc.jo` sender pattern.
- Commit messages: `type(scope): subject`. Scope = pipeline name.

## Communication
- Concise. No preambles. Lead with the diff.
- Push back honestly. Diplomatic hedging wastes time.
```

That's about 50 lines of actual instructions. Under budget. Every line passes the litmus test.

> 💡 **Tip.** Notice the use of `@docs/...` imports. The 12 rules and patient-data section live in the main file because they apply to every interaction. The pipeline-specific patterns live in imported files that load only when relevant.

## Try This

1. In a project of yours that doesn't have a `CLAUDE.md`, run `/init`. Read every line of the generated file out loud.
2. Delete every line you can't justify with the litmus test ("would Claude make a mistake without this?").
3. Now make Claude do something. When it makes its first mistake (it will), say "update `CLAUDE.md` so this doesn't happen again." Read what it adds.
4. Move one section out into a separate file under `docs/` and replace it with an `@import`. Notice that nothing breaks.

## Watch Out

- **Don't paste your README into `CLAUDE.md`.** READMEs are for humans. `CLAUDE.md` is a system prompt. Different audience, different rules.
- **Don't put secrets in `CLAUDE.md`.** It's checked into git. Treat it as public.
- **Don't write rules that contradict each other.** Claude will follow the first one it reads and quietly violate the second. If two rules conflict, pick one and delete the other.
- **Don't forget the personal layer.** Your `~/.claude/CLAUDE.md` carries across every project. If you stuff project-specific rules there, they'll leak into projects where they don't apply.
- **Don't let it grow forever.** Every quarter, re-run the litmus test on every line. Delete what's no longer earning its place.
