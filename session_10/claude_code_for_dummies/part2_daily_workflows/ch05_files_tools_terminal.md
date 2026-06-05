# Chapter 5: Files, Tools, and the Terminal

Every useful thing Claude Code does (reading a notebook, fixing a bug, grepping a repo, pulling a doc off the web) happens through a small set of built-in tools, and the sooner you stop thinking of them as magic the sooner you'll start steering them.

This chapter is the deep dive on those tools. Not a reference card (those live in Appendix A) but the working clinician's mental model of *which tool gets reached for when*, and how to nudge Claude toward the right one without micromanaging it.

## The Toolbox

Claude Code ships with a handful of built-in tools. You'll see them flash by in the transcript as Claude works.

- **Read**: opens a file and pulls its contents into context. Line-numbered, partial reads supported, image-aware.
- **Write**: creates a new file (or overwrites one, if you let it).
- **Edit**: surgical string replacement on an existing file. This is what Claude reaches for 90% of the time when changing code.
- **Bash**: runs a shell command. `ls`, `git status`, `pytest`, `python script.py`, anything your terminal can do.
- **Glob**: fast file-pattern search. `**/*.py`, `src/extractors/*.sql`. Returns paths, not content.
- **Grep**: content search built on ripgrep. Regex-capable, fast, scoped by glob or filetype.
- **WebFetch**: pulls a URL and feeds its content to a sub-model that answers a question about it.
- **WebSearch**: a Google-style search that returns links and snippets.

> 🧠 **Remember.** You don't pick the tool. Claude does. Your job is to describe the goal clearly enough that the right tool is the obvious choice.

## When Claude Picks Which

There's a logic to it, and once you see it you stop being surprised.

- "What does this function do?" → **Read** on a known path, or **Grep** to find it first.
- "Find every place we call `optimus_encode`." → **Grep**.
- "List all the SQL files in the extractions repo." → **Glob**.
- "Run the test suite." → **Bash**.
- "Add a column to this table definition." → **Read** then **Edit**.
- "Create a new notebook for the chemo prep extractor." → **Write**.
- "What does the KDIGO 2024 guideline say about Stage 3 timing?" → **WebSearch** then **WebFetch** on the best hit.

> 💡 **Tip.** If Claude reaches for Grep when you wanted it to just read a file, the fix is to *name the file*. Vague prompt = exploratory tool. Specific prompt = surgical tool.

## The `@` File Reference

This is the single most useful keystroke in Part 2 of this book.

Type `@` in the prompt and Claude Code opens a fuzzy file picker. Pick a file, and its path is dropped into your prompt with a sigil that tells Claude to read it *before* doing anything else.

```
Take a look at @notebooks/aki_extraction.py and tell me
why the baseline creatinine is null for MRN-encoded patients.
```

Without `@`, Claude might glob the repo, grep for "baseline creatinine," read three wrong files, blow 8,000 tokens, and *then* find the one you wanted. With `@`, it goes straight to the file.

> 💡 **Tip.** Use `@` ruthlessly. Every time you know which file matters, name it. Your context window is finite. Don't pay Claude to find what you already know.

You can `@` multiple files in one prompt:

```
Compare the staging logic in @notebooks/aki_v3.py and
@notebooks/aki_v4.py and tell me what changed.
```

## The `!` Bash Prefix

Less famous than `@`, just as useful.

Type `!` at the start of a line and the rest is run as a bash command, but instead of just printing the output, **the output is captured into context**. Claude sees it as if you had pasted it.

```
!git log --oneline -20
What changed in the eval pipeline in the last two weeks?
```

Or:

```
!python -c "import polars as pl; print(pl.read_parquet('data/cohort.parquet').schema)"
Now write the extraction prompt assuming those columns.
```

> 🔧 **Technical Stuff.** Under the hood, `!` is just a Bash tool call where the output is teed straight into the next prompt. It's a shortcut for "run this, then think about the result." You can do the same thing in two messages. `!` saves you the round trip.

## Show, Don't Tell: Pasting Screenshots

Claude Code is multimodal in the terminal. You can paste an image directly into the prompt (a Databricks error screenshot, a chart that looks wrong, a slide from a CAP protocol PDF) and Claude will read it.

On Mac, ⌘V. On Windows, Ctrl+V. WSL users, your terminal emulator needs to support it (Windows Terminal does, most do now).

> 💡 **Tip.** For visual bugs (a Plotly chart with the wrong axis, an R Markdown output with a busted gtsummary table) screenshotting and pasting is *always* faster than describing the problem in words. Show, don't tell.

The image goes into context like any other source. It costs tokens (vision tokens are pricier than text), so don't paste a screenshot of something Claude could read as text.

## Bash Directly, or Through Claude?

This is the question that separates the tourists from the residents.

**Run it yourself when:**
- It's a one-liner you've typed a thousand times. `git status`. `ls -la`. `du -sh`.
- It's destructive and you want zero ambiguity. `rm -rf node_modules` is your finger on the trigger, not Claude's.
- You want the output for *yourself*, not for Claude. (Why pay tokens to put `ps aux` in context?)

**Let Claude run it when:**
- The output is going to inform the *next* thing Claude does.
- It's a multi-step pipeline that benefits from Claude reasoning about intermediate output.
- You want it logged in the transcript so future-you can see what happened.

> ⚠️ **Warning.** Do not let Claude run `rm`, `git reset --hard`, `git push --force`, or any destructive operation without reading the diff first. Permissions can be set to gate these (see Chapter 4). The default settings protect you. Custom settings can un-protect you. Be deliberate.

## A KHCC Walkthrough: Pointing at One Notebook

Say you're working on the AKI alerting pipeline. The `aidi-extractions` repo has 80 notebooks. You want to fix a bug in one.

The slow way:

```
Find the AKI extraction code and fix the bug where baseline
creatinine is sometimes null.
```

Claude will glob, grep, read four files, build a mental model of the repo, then maybe find it. Easily 10,000 tokens before any actual work happens.

The fast way:

```
@notebooks/aki_extraction.py — the baseline_creatinine
column is null for ~12% of patients in the last run.
Read the function that computes it and tell me why before
proposing a fix.
```

Now Claude reads exactly one file, has the function in context, and starts reasoning about the bug. Maybe 2,000 tokens to a hypothesis.

The difference compounds. Over a workday of twenty prompts, the `@` habit saves an hour and tens of thousands of tokens.

> 🧠 **Remember.** Tokens are time *and* money *and* signal-to-noise. Every token Claude reads that wasn't necessary is a token of noise crowding out the thing you actually wanted it to focus on.



## When Glob and Grep Earn Their Keep

`@` is right when you know the file. When you don't, Glob and Grep are your friends.

```
Grep the aidi-extractions repo for any call to
azure_openai_client. I want to know which pipelines still
use the old wrapper.
```

That's a Grep job. Claude will pull back every match with line numbers, and you can decide which ones matter.

```
Glob every R Markdown file under analyses/ that was modified
in the last 30 days.
```

That's Glob plus a tiny bit of Bash. Don't fight the tool.

> 🔧 **Technical Stuff.** Grep here is ripgrep under the hood: fast, regex-aware, respects `.gitignore`. If you're used to BSD grep, the syntax is mostly the same but a few flags differ. Claude knows. You don't have to.

## WebFetch and WebSearch: Use Sparingly

These pull external content into context. They're great for:

- Looking up a library's current API ("does pandas 2.2 still ship `read_clipboard`?").
- Pulling a guideline you don't have locally (a specific CAP protocol page, a KDIGO update).
- Checking whether a specific error message has a known fix.

They're terrible for:

- Replacing documentation you should have downloaded once and put in the repo.
- Random fact-checking that doesn't change the code.
- "Just look around the internet a bit." You'll burn context with nothing to show.

> ⚠️ **Warning.** Never WebFetch a page that might contain credentials, internal URLs, or patient data. The page contents land in your transcript. Treat WebFetch like any other external read: it leaves a trace.

## The Mental Model

Here's the whole thing in one sentence.

**Claude has a small set of hands. Your prompts decide which hand reaches.**

`@` says *use the Read hand on this file*. `!` says *use the Bash hand on this command, then think*. A vague prompt says *figure out which hand to use, and good luck*. Specificity does the steering.

## Try This

1. Open Claude Code in any project. Type `@` and watch the file picker appear. Pick a file. Ask "summarize this file in three sentences." Notice how the first thing Claude does is Read, with no exploration.
2. Run `!git log --oneline -10` and follow with "what's the theme of the last ten commits?" Confirm Claude has the log in context without you having to paste it.
3. Take a screenshot of any error message in your editor or a Databricks cell. Paste it into Claude Code and ask "what's wrong here?" Notice how much faster this is than typing the error out.
4. Ask Claude to "find every place we use the old Fernet wrapper" and watch which tool it picks. Then ask the same thing but say "grep for `legacy_fernet`." Compare the cost.

## Watch Out

- **Don't let Claude grep what you can `@`.** Naming the file is always cheaper than searching for it.
- **Don't paste screenshots when text would do.** Vision tokens are expensive. Use images for things that are genuinely visual.
- **Don't let Claude run destructive Bash without reviewing.** Read the command before you approve. Permissions are not a substitute for paying attention.
- **Don't WebFetch sensitive pages.** Treat the web tools like any external network call. Assume the response lands in your transcript and your logs.
- **Don't fight the tool selection.** If Claude consistently reaches for Grep when you wanted Read, the prompt is the bug, not the agent.
