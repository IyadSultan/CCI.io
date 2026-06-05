# Chapter 3: Speaking Claude

Prompting Claude Code isn't a new language — it's your old language, used more carefully.

## Plain English Beats Cleverness

There is no special syntax for Claude Code. No keywords. No XML tags you need to memorize. You type sentences. Claude reads them. Same as if you were briefing a junior analyst over Slack.

That's the good news. The catch is that "plain English" hides a wide gap between **a request a human can act on** and **a request an agent can act on**. The same words a colleague would charitably interpret will send Claude down the wrong road, because Claude isn't going to ask three clarifying questions before starting. It's going to start.

So the rule is simple:

> 🧠 **Remember.** The quality of your output is almost entirely a function of the specificity of your prompt. Better prompts, better results. That is the whole game.

## Bad Prompt vs. Good Prompt

Consider this prompt:

> Build me a website.

A human collaborator would push back: *which website, for whom, in what language, with what content?* Claude Code, when asked this cold, will pick something and ship it. Probably a single-page React site with a fake "Our Mission" headline and Lorem Ipsum.

Now consider:

> Build a one-page static landing page in plain HTML and CSS, no JavaScript framework. Audience is referring physicians for a chemotherapy preparation service at King Hussein Cancer Center. Sections: hero with a one-line value proposition, three feature cards (turnaround time, safety, formulary breadth), and a contact form that POSTs to `/api/contact`. Green and white color scheme. Mobile-responsive. Save it as `index.html` and `styles.css` in the current directory.

This is the same task. The second version takes ten times longer to type and saves you forty times the cleanup. Claude doesn't need you to be brief. It needs you to be specific.

> 💡 **Tip.** When in doubt, add constraints. Color, framework, file names, output format, audience, what *not* to do. Constraints don't slow Claude down; they steer it.

## The Exception: Be Vague On Purpose When Exploring

There is one place where vagueness is a *feature*, not a bug — exploring code you don't fully understand.

If you've inherited a 4,000-line R script from a colleague who left and you have no idea what's in it, the best prompt is not a detailed one. It's:

> Read `analysis.R` end to end. What would you improve in this file?

This gives Claude permission to surface things you wouldn't have thought to ask about. Hard-coded paths. Stale package calls. A loop that should be a `purrr::map`. A patient-level split that's accidentally a row-level split. Vagueness, used deliberately on unfamiliar territory, is a mapping tool.

> 🧠 **Remember.** Be specific when you know what you want. Be vague when you don't. Both are valid. Sloppy is what happens when you can't tell which mode you're in.

## Pointing Claude at Files With `@`

Inside a Claude Code session, typing `@` opens a file picker. You can also just type the path directly:

```
@scripts/extract_grades.py
```

When you reference a file with `@`, Claude reads it into context immediately. No searching the codebase, no token spent on `Glob` and `Grep`. You have told it exactly where to look.

This matters more than it sounds. Without `@`, a casual prompt like *"fix the bug in the extraction script"* sends Claude on a hunt — which directories matter, which file is the script, which function is the extraction. That hunt eats tokens and sometimes finds the wrong file. With `@scripts/extract_grades.py`, you save the search and you save yourself the wrong answer.

> 💡 **Tip.** When you know which files matter, name them with `@`. You will be right faster.

You can pile them up:

> @sql/cohort.sql @notebooks/01_extract.py @notebooks/02_dose.py — walk me through how this pipeline assembles the AKI cohort, and tell me where the deceased-patient filter is applied.

That single prompt is worth ten minutes of "where is...?"

## The `!` Prefix — Bash Output Straight Into Context

Sometimes the thing Claude needs to see isn't a file. It's the output of a command — a git status, a failing test, an error log, a row count. The `!` prefix lets you run a shell command and drop its output directly into Claude's context for the next prompt.

```
!git status
```

```
!python extract.py 2>&1 | tail -30
```

```
!Rscript -e 'sessionInfo()'
```

Now Claude can see exactly what you see. No paraphrasing. No "I think the error was something like…"

This pairs beautifully with the next idea.

## Raw Data Beats Prose

This is one of the most under-appreciated rules of prompting an agent. **Don't describe the data. Show the data.**

Bad:

> I'm getting a strange error in the extraction script — it says something about a missing column when I run it.

Good:

```
!python extract.py 2>&1 | tail -40
```

then:

> Fix this.

You have just collapsed five back-and-forth turns into one. Claude sees the actual traceback, the actual filename, the actual line number. It edits the right file on the first try.

You can chain this from the shell too:

```bash
cat error.log | claude "explain this error and suggest a fix"
```

> 💡 **Tip.** If you find yourself typing a long paragraph that *describes* a bug, stop. Paste the log. Type "fix this." You will be done in half the time.

> ⚠️ **Warning.** Before you paste a log: scrub MRNs, names, and any other identifiers. Logs are notorious for capturing real patient data when something blows up mid-pipeline. The AIDI deny-list patterns from Chapter 4 don't help here — pasted text is pasted text. Look before you paste.

## Voice Dictation Beats Typing

Run `/voice` inside Claude Code (where supported) and you get push-to-talk dictation. Hold a key, speak your prompt, release.

The interesting thing isn't speed. It's quality. When people speak a prompt out loud, they naturally include context, constraints, audience, and edge cases that they would never have bothered to type. Try it once and watch your own prompts get better.

> 🧠 **Remember.** A spoken prompt is almost always a better prompt than a typed one. Type when you must. Talk when you can.

## A KHCC Example: Bone-Only Metastatic Disease

Here is a real prompt shape that comes up constantly in AIDI work — extracting a specific clinical concept from a stack of radiology reports.

**Bad prompt:**

> Extract bone metastasis from the reports.

This is ambiguous in at least four ways. *Which reports? What does "bone metastasis" mean — any bone involvement, or bone-only? What output format? What about uncertain or "probable" findings? Should you exclude post-treatment patients?*

**Good prompt:**

> Read every `.txt` file in `data/radiology/`. For each report, decide whether the radiologist's impression supports **bone-only metastatic disease** — defined as: (a) at least one site of bone metastasis, AND (b) no evidence of visceral or nodal metastasis in the same study. Treat "no other sites identified" as supporting (b). Treat any mention of liver, lung, brain, peritoneal, or distant nodal disease as ruling out (b). For each report return one row in `bone_only.csv` with columns: `filename`, `bone_only` (TRUE/FALSE/UNCERTAIN), `evidence_quote` (the sentence you based the decision on). Use PydanticAI with the AIDI Azure OpenAI client (`gpt-4.1-mini`). MRNs in filenames are already Optimus-encoded — do not log raw names. Write the script to `notebooks/bone_only_extract.py`, but do not run it yet. Show me the script first.

That prompt is long. It is also unambiguous. Notice what it does:

- **Defines the clinical concept** ("bone-only" means bone AND not visceral/nodal).
- **Specifies the schema** (three columns, exact names).
- **Forces an evidence quote**, so you can spot-check.
- **Names the model and library** to use (so you don't get a random scikit-learn solution).
- **Reminds Claude of AIDI conventions** (Optimus, no raw PHI in logs).
- **Holds back execution** until you've reviewed the code.

> 💡 **Tip.** A useful prompting habit: write the prompt, then re-read it asking "could a smart but literal-minded reader interpret any sentence in two ways?" Every yes is a constraint you forgot to add.

## A Short Checklist Before You Press Enter

When the prompt matters, walk through this list in your head:

- **What is the goal**, expressed as a deliverable? (A file, a CSV, a chart, a passing test.)
- **Which files** does Claude need to read? (Name them with `@`.)
- **Which conventions** should it follow? (Library, language, output format.)
- **What should it not do?** (Don't run the script yet. Don't touch the database. Don't change the prompts.)
- **How will you verify** it worked? (A row count, a sanity check, a known answer.)

Five questions. Thirty seconds. You will save half an hour.

## Try This

Open Claude Code in any project. Pick one file you wrote recently — a Python script, an R analysis, a Quarto doc, a Django view. Try two prompts back to back:

1. *Vague:* "What would you improve in `@path/to/file`?"
2. *Specific:* "In `@path/to/file`, rename every variable that uses camelCase to snake_case, run the existing tests, and tell me which renames touched a public function."

Notice the difference in what comes back. Both are valid prompts — for different jobs.

## Watch Out

Don't fall into the "I'll just clarify it later" trap. If your prompt is ambiguous, Claude won't stop to ask — it will pick an interpretation and start writing code against it. By the time you notice it picked the wrong one, you've spent ten minutes of session time and a few thousand tokens on the wrong answer. Spend the extra fifteen seconds on the prompt. Always cheaper than the correction.
