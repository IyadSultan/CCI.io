# Chapter 1: Meet Claude Code

You open a terminal, type one word, and a few minutes later fifty pathology reports have been read, graded, and dumped into a tidy CSV. And you didn't write a single line of code.

That is the trick, and that is the chapter.

## Chatbots Talk. Claude Code Acts.

You already know what a chatbot does. You open ChatGPT or claude.ai in your browser, you type a question, it types back an answer. Useful. Sometimes brilliant. But fundamentally, a chatbot is a smart pen pal. It can describe what to do. It can't go do it.

Claude Code is not a chatbot. Claude Code is an **agent**. The difference matters more than any other concept in this book, so it is worth saying twice: a chatbot gives you advice; an agent takes actions.

You ask Claude Code to "read every pathology report in `./reports/`, pull out the histologic grade, and write the results to `grades.csv`." It does not respond with a Python tutorial. It opens the directory. It reads the files. It runs the extraction. It writes the CSV. Then it tells you it's done, and shows you the diff.

> 🧠 **Remember.** Chatbots return text. Agents return changes to your filesystem. Everything else in this book follows from that one distinction.

This is the same Claude you already know: same model family, same training, same brain. What is new is the body. Claude Code is Claude with hands.

## It Lives in the Terminal

Claude Code does not run in a browser. It runs in your terminal: that black-and-white window full of cryptic-looking text that you have probably seen developers use and politely ignored.

The terminal is not as scary as it looks. It is simply a way to talk to your computer by typing instead of clicking. And with Claude Code, you don't even need to learn the terminal. You only need to learn three things:

- How to **open** Claude Code: type `claude` and press Enter.
- How to **close** Claude Code: press `Ctrl+C` twice.
- How to **clear its memory** mid-session: type `/clear`.

That is genuinely the whole interface. Everything else is just plain English.

> 💡 **Tip.** If you have used VS Code, RStudio, or even just clicked around in a file explorer, you already know more than enough to use Claude Code. The terminal here is a delivery mechanism, not a skill you need to master.

## What Claude Code Can Actually Do

If "takes actions" is too abstract, here is the concrete list of things Claude Code does for a living:

- **Reads files**: single files, whole directories, your entire repo.
- **Writes files**: creates new ones, edits existing ones, refactors across many at once.
- **Runs commands**: anything you can run in a terminal — `python`, `Rscript`, `pytest`, `dbx`, `git`, `npm`, `pip`, you name it.
- **Searches code**: by filename, by content, by pattern.
- **Hits the web**: fetches a documentation page, searches for an error message, pulls down a paper.
- **Manages git**: stages, commits, branches, pushes, opens pull requests.
- **Chains all of the above**: reads a file, sees an error, searches for the fix online, edits the file, runs the tests, commits the result.

In other words: Claude Code does the things you were going to do anyway, but faster and without typos. Your job moves up a level, from "how do I write this for loop" to "what should we actually be measuring here."

## A Brief Tour of the Eight Built-in Tools

Under the hood, Claude Code has a small toolbox. You will hear these names again throughout the book, so meet them now:

| Tool | What it does |
| --- | --- |
| **Read** | Opens a file and pulls its contents into context. |
| **Write** | Creates a new file (or fully overwrites one). |
| **Edit** | Makes a surgical change to a specific block of text inside an existing file. |
| **Bash** | Runs a shell command and returns the output. |
| **Glob** | Finds files by name pattern, e.g. `**/*.py`. |
| **Grep** | Searches *inside* files for a regex or string. |
| **WebSearch** | Looks something up on the live internet. |
| **WebFetch** | Pulls down the contents of a specific URL. |

> 🔧 **Technical Stuff.** These tools are implemented as structured function calls. When Claude decides to "read a file," it is really emitting a JSON payload that names the `Read` tool with a file path; the Claude Code harness executes the read and feeds the contents back. You will rarely need to think about this — but if you ever build your own agent with the Claude Agent SDK (Appendix B), this is the abstraction you will be working with.

You do not pick the tool. That is the magic. You describe a goal in plain English, and Claude decides which tool, or which sequence of tools, fits.

## The Mental Model: Describe the Goal, Claude Picks the Tools

This is the one mental model that, once it clicks, makes Claude Code suddenly feel obvious.

You **describe the outcome**. Claude **chooses the path**.

Compare:

- *Old way:* "Use `os.listdir` to enumerate the reports folder, then loop over the files, then open each one with UTF-8 encoding, then write a regex for 'Histologic Grade:', then..."
- *New way:* "Extract the histologic grade from every report in `./reports/` and save the result as `grades.csv`."

You stopped giving instructions and started giving a destination. Claude handles the route.

> 💡 **Tip.** When a task feels stuck, ask yourself: am I describing the goal, or am I describing the steps? Stepping back to the goal almost always unsticks things.

## A Clinical Example: Fifty Pathology Reports

Let's make this concrete with a job you might actually have on your desk this week.

You have fifty de-identified pathology reports sitting in `./reports/` as plain text files. You need the histologic grade out of each one for a small retrospective cohort. The grades are usually buried in a sentence like *"Tumor demonstrates moderately differentiated (Grade 2) features."* Sometimes the formatting is consistent. Often it isn't.

You open Claude Code in that project folder:

```bash
cd ~/projects/grade_extraction
claude
```

Then you type, in plain English:

> Read every `.txt` file in `./reports/`. For each one, extract the histologic grade (1, 2, 3, or "unspecified"). Write a CSV called `grades.csv` with columns `filename` and `grade`. Use a small Python script. Show me the script before you run it.

Here is what happens behind the scenes:

1. **Glob** — Claude lists every `.txt` file in `./reports/`.
2. **Read** — Claude opens the first two or three to see what the reports look like.
3. **Write** — Claude drafts a short Python script and shows it to you.
4. **(You approve.)**
5. **Bash** — Claude runs the script.
6. **Read** — Claude opens `grades.csv` to confirm it looks right.
7. **Edit** — Claude notices three files where the regex missed and tightens the pattern.
8. **Bash** — Claude re-runs the script.
9. Claude reports back: 47 grades extracted, 3 reports flagged as "unspecified," CSV saved.

You watched the work happen. You read the script before it ran. You can rerun it tomorrow on a hundred more reports.

> ⚠️ **Warning.** Even on a job this simple, do not run extraction on identifiable patient data in a folder that isn't approved for it. At KHCC, that means working inside Databricks or an approved AIDI environment, not on your personal laptop. The agent doesn't know the difference between de-identified text and PHI. You do.

> 🧠 **Remember.** Claude Code does not replace your judgment about *what* to extract, *how* to validate it, or *where* the data is allowed to live. It replaces the typing.

## Why This Changes Your Week

Here is what shifts once you internalize the agent model:

- The **boring half of your job** (boilerplate scripts, file munging, SQL scaffolding, regex tuning, ggplot tweaks) collapses from hours to minutes.
- The **hard half of your job** (deciding what the cohort definition actually is, whether the extraction is clinically valid, whether the model is fit for purpose) does not change at all. It is still on you. It always will be.

> 💡 **Tip.** The clinicians and data scientists who get the most out of Claude Code are not the strongest coders. They are the ones who can most clearly *describe what they want*. If you can write a good methods section, you can drive this tool.

## Try This

Open a terminal in a directory that has a few plain-text files in it — any folder will do; a notes folder works fine. Type `claude` and press Enter. When the cursor appears, ask:

> List every file in this directory, then tell me which file is the longest by line count.

Watch what Claude does. Notice that it uses `Glob` to find the files, `Bash` (or `Read`) to count lines, and then summarizes the result. You did not pick a single tool. You described a goal.

When it finishes, press `Ctrl+C` twice to exit.

## Watch Out

Do not type a vague, sprawling request the first time you open Claude Code and then judge the tool by the result. *"Build me a clinical dashboard"* is not a prompt. It's a project. Claude will make something, and it will be the wrong thing, and you will conclude the tool is overhyped.

Start small. One folder. One job. One outcome. Build trust before you build a feature.
