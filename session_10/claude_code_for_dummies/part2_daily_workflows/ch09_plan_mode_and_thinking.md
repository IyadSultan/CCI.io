# Chapter 9: Plan Mode and Thinking

Sometimes you don't want Claude to start typing. You want it to *stop and think*, and the single keystroke that changes the outcome of your week is Shift+Tab.

## Plan Mode: What It Is

Press **Shift+Tab** in Claude Code. The status line changes. You're now in **Plan Mode**.

In Plan Mode, Claude can do everything *read-only*:

- Read files.
- Glob and Grep the repo.
- Run read-only Bash (`ls`, `git status`, `git log`, `wc -l`, you get the idea).
- Look at screenshots you paste.
- Think hard.

Claude **cannot** do anything that changes the world:

- No Write.
- No Edit.
- No `git commit`, no `pip install`, no `rm`.
- No destructive Bash.

What Claude produces in Plan Mode is *a plan*: a written breakdown of what it would do, file by file, change by change, with the rationale. You read the plan. You approve it (or you don't). Only after you approve does Claude exit Plan Mode and execute.

> 🧠 **Remember.** Plan Mode is read-only by design. It's the safe room you walk Claude into before you let it touch anything important.

## When to Use Plan Mode

Use it when *the cost of doing the wrong thing is higher than the cost of slowing down*.

Concretely:

- **Multi-file changes.** Any refactor that touches more than two files. The blast radius of "Claude misunderstood" multiplies with file count.
- **Structural changes.** Renaming a function used everywhere. Changing a schema. Splitting a module.
- **Anything you'd waste 20 minutes on.** If you'd burn an afternoon undoing the wrong version, plan first.
- **Anything you don't fully understand yourself.** "I want to add evals to this pipeline, I'm not sure where the prompts live or how they're loaded." Make Claude read first, plan second, execute third.


- **Production-touching changes.** Anything that's going to run against patient data, anything an alert depends on, anything in `main`.

When *not* to use it:

- One-line fixes you can see in your head.
- Typo fixes.
- Renaming a single variable in a single file.
- Generating boilerplate that's obvious.
- Exploring. "What does this codebase look like?" Plan Mode is overkill for browsing.

> 💡 **Tip.** A good rule of thumb: if the prompt starts with "refactor", "restructure", "migrate", or "add evals to", you want Plan Mode. If it starts with "fix typo" or "rename `x` to `y`", you don't.

## What a Good Plan Looks Like

A plan from Claude in Plan Mode should answer four questions:

1. **What files will change, and how.** Each file gets a line. Each change gets a one-sentence description.
2. **What new files will be created.** With purpose.
3. **What I'm assuming.** Listed explicitly. If those assumptions are wrong, you catch them now, not after the changes are live.
4. **What I'm leaving for the human.** Anything Claude can't decide (a credential, a clinical threshold, a naming choice).

If you get back a plan that's three vague bullet points, the prompt was vague. Ask again with more specificity.

> 🧠 **Remember.** A plan you can't critique is a plan that isn't ready. If you can't find anything to push back on, either the change is genuinely trivial or you didn't read carefully.

## Ctrl+G: Edit the Plan Before You Execute

This is the underused half of Plan Mode.

Once Claude has produced a plan, you can hit **Ctrl+G** to open the plan in your `$EDITOR` (vim, nvim, VS Code, whatever you've configured). You can:

- Delete steps you don't want.
- Add steps Claude missed.
- Rewrite the rationale for steps that were vague.
- Reorder, comment, tighten.

When you save and close the editor, the *edited* plan is what Claude executes from.

> 💡 **Tip.** Ctrl+G is where the senior engineer hides. You can write Claude's marching orders precisely, in your own language, with the surgical detail you'd want from a thoughtful human collaborator. Use it on anything non-trivial.

This is the difference between "Claude plans, you approve" and "Claude drafts, you direct." The second one ships better software.

## Extended Thinking: What's Happening Underneath

Behind Plan Mode (and increasingly behind regular prompts) there's **extended thinking**: a dedicated reasoning budget the model spends *before* it writes the visible response.

On Opus 4.6 and Sonnet 4.6, extended thinking is on by default with an adaptive budget. The model decides how much to think based on the difficulty of the prompt. You usually don't see the thinking; you see the output that came from it.

You can nudge the budget with the legacy keywords:

- **`think`**: modest extra budget.
- **`think hard`**: more.
- **`think harder`**: more still.
- **`ultrathink`**: the cap.

These are not magic incantations. They're literal hints to the inference engine to allocate more reasoning tokens. On Opus 4.6, `ultrathink` will visibly slow the response down by 30 seconds to a couple of minutes, and on the right problem, it'll be the difference between a working solution and a near-miss.

> 🔧 **Technical Stuff.** Thinking tokens are billed like output tokens. `ultrathink` on Opus can spend tens of thousands of tokens before the model writes a word of visible response. Use it when the problem deserves it. Don't sprinkle it on every prompt.

## Plan Mode Plus Ultrathink: The Heavy Combo

For a genuinely gnarly task (say, refactoring the AKI staging logic so the pipeline can swap between KDIGO 2012 and KDIGO 2024 without rewriting the alert layer) you want both:

1. Shift+Tab into Plan Mode.
2. Switch to `/model opus` if you aren't already.
3. Prompt with `ultrathink`.

```
ultrathink

Read the AKI staging code in @notebooks/aki_extraction.py
and the alert layer in @notebooks/aki_alerts.py. We need to
add support for KDIGO 2024 staging while keeping KDIGO 2012
as the default. The pipeline runs nightly against live
patient data. Plan a refactor that:

- Keeps the existing 2012 behavior identical (the eval
  suite must pass unchanged).
- Introduces a config flag (default 2012) for staging version.
- Isolates the staging logic so future versions are
  drop-in.
- Does NOT touch the alert layer's API.

Surface any assumption you're making. Surface anything
you're not sure about. Don't write code yet.
```

What you get back is a plan that's been *thought through*, not just sketched. You critique it. You Ctrl+G it. You execute when you're ready.

> 💡 **Tip.** The cost of running Opus + ultrathink + Plan Mode on a hard task is maybe a dollar or two. The cost of executing the wrong refactor and reverting it is a half-day. Math is easy.

## When Planning Is Overkill

Two real examples, to calibrate.

**Overkill:** "Add a docstring to this function."
You don't need a plan. You need three lines of code. Just type the prompt.

**Overkill:** "Rename `compute_baseline` to `compute_baseline_creatinine` in this one file."
A grep-and-replace. No planning needed.

**Not overkill:** "Rename `compute_baseline` everywhere it's used in the repo and update all callers, tests, and docstrings."
This touches many files. There may be string occurrences that look like the function name but aren't. Plan Mode catches all of it before you make the change.

**Not overkill:** "Add evals to the chemo prep extractor."
This is going to touch the prompt module, add a new test file, modify CI, and probably create a new table in `aidi_catalog`. You want the plan before you start typing.

> 🧠 **Remember.** The bigger the blast radius, the more Plan Mode earns its keep. Trivial changes don't need it. Anything you'd regret getting wrong does.

## A KHCC Walkthrough: Refactoring AKI Staging in PySpark

You're sitting down to refactor the AKI staging logic. The current code computes KDIGO 2012 stages inline inside the main extraction notebook, mixed with the alerting logic. You want to pull it into a separate, testable module.

Step 1. Shift+Tab into Plan Mode. `/model opus`.

Step 2. Prompt:

```
ultrathink

Read @notebooks/aki_extraction.py and @notebooks/aki_alerts.py.

Goal: extract the KDIGO staging logic into a new module
notebooks/staging/kdigo.py with two functions:
  - stage_kdigo_2012(creatinine_series, baseline) -> stage
  - stage_kdigo_2024(creatinine_series, baseline) -> stage

The main extraction notebook should import from there.
The alert layer should not change.

Plan the refactor. Identify:
  - Every place the 2012 staging is currently computed inline.
  - Every place baseline_creatinine is computed (so we know
    what inputs to expect).
  - The eval cases that protect existing behavior.
  - Any place this might break (silent type coercion,
    pandas vs PySpark series, null handling).

Do not write code. Plan only.
```

Step 3. Claude produces a 9-step plan, listing 4 files to change, 1 new file to create, 3 assumptions, and 2 open questions ("should we keep the inline function as a deprecation shim or remove immediately?").

Step 4. You hit Ctrl+G. You edit. You answer the open questions in the plan itself, you add a step Claude forgot ("add a unit test for the boundary case where baseline is null"), you remove a step Claude added that's out of scope.

Step 5. You save. You exit Plan Mode (Shift+Tab again). You tell Claude: "Execute the plan."

Step 6. Claude works through the steps. You watch the diffs. You run the eval suite at the end. It passes unchanged.

Total time: maybe 90 minutes for a refactor that would have been a half-day flailing without a plan.

> 🧠 **Remember.** The eval suite is the verification gate. Before-and-after the refactor, the deceased-patient eval cohort must produce identical alert counts. If it doesn't, you didn't refactor — you regressed.

## Try This

1. In any repo, pick a small refactor task. Shift+Tab into Plan Mode. Read the plan. Even if you don't execute, notice how the plan differs from what you'd have done by just typing.
2. On a harder task, run Plan Mode with `ultrathink` on Opus. Compare the plan to a Plan Mode run on Sonnet without `ultrathink`. Feel the difference.
3. The next time you get a plan back, hit Ctrl+G and edit it before approving. Add a step Claude missed. Remove one you don't want. See how the executed change tracks your edits exactly.
4. Try Plan Mode on a task you *think* is trivial. If the plan is one line, you were right; just type the prompt next time. If the plan shows three files you forgot about, you were wrong.

## Watch Out

- **Don't approve a plan you didn't read.** That's just adding ceremony without adding safety.
- **Don't use `ultrathink` on every prompt.** It's expensive and most prompts don't deserve it. Save it for the genuinely hard ones.
- **Don't skip Plan Mode on multi-file refactors because you're "in a hurry."** The hurry is what produces the broken refactor. Plan, execute, ship.
- **Don't exit Plan Mode and forget to come back.** It's per-session and per-toggle. If your next task also deserves planning, toggle it again.
- **Don't confuse "Claude wrote a plan" with "Claude executed the plan."** Plan Mode is read-only. Until you exit it and tell Claude to execute, nothing has changed on disk. That's a feature, not a bug.
