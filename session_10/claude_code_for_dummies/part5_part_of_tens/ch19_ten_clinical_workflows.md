# Chapter 19: Ten Killer Workflows for Clinical AI Teams

The rest of this book taught you the moving parts. This chapter shows you what to actually build with them on a Tuesday morning at a cancer center.

Every workflow below maps directly to something AIDI, pharmacy informatics, or the data science team at KHCC already does, or should be doing. Pick two. Try them this week.

---

## 1. The Nightly Extraction Eval Run

You change a prompt. You wonder if it broke anything. The deceased-patient eval cohort sits there waiting.

Wire up a Stop hook to a `/eval` slash command that runs your frozen eval suite against `aidi_catalog.dbo.eval_runs` and diffs against last night's baseline. Claude commits the prompt change, runs the eval, posts a markdown summary to the team Slack with delta counts ("AKI worsening: 142 → 141, one patient flipped: review case MRN A8X4-92"). Pair it with a Ralph loop and you can iterate on a prompt for an hour while you eat dinner.

> 🧠 **Remember.** No prompt change ships without an eval run. That's Rule 4 from the global `CLAUDE.md`. Wire it into a hook so you can't forget.

## 2. The Pathology Triage Inbox

Wilms tumor cases land as PDFs. The clinician wants T-stage, histology, and margin status pulled out before clinic.

Build a small project: a `pathology-inbox/` folder Claude watches via a Stop hook, a Pydantic schema for the structured output, and a slash command `/process-inbox` that calls `client.beta.chat.completions.parse(...)` for each new file and writes a `.json` next to it. Add a Hook that runs `tools/check_pii.py` before any file moves out of the inbox folder.

## 3. The "Why Did This Patient Get Missed?" Auditor

A patient who should have triggered an AKI alert didn't. Three pipelines touch their record, two teams own them, and nobody wants to start the spelunking.

Spin up a subagent with read-only tools (`Read`, `Grep`, `Glob`) pointed at the AIDI extraction repo, the cohort SQL, and the alert dispatcher. Prompt: "MRN A8X4-92 should have triggered the AKI worsening alert on 2026-04-12. Trace every step. Report where the patient was filtered out and which table is responsible." Subagent context stays clean, main session stays clean, and you get a 200-word root cause in two minutes instead of two hours.

> 💡 **Tip.** Security at Anthropic shaved 10–15 minutes of stack-trace tracing down to ~5 minutes with this exact pattern. The pattern is real. The numbers are real.

## 4. The Two-Tool Plan-Then-Build Workflow

For anything bigger than one file, don't start in Claude Code. Start in Claude.ai.

Brainstorm the design in the chat app: trade-offs, schema, edge cases, what to *not* build. When you have a plan, ask Claude.ai to write you the implementation prompt for Claude Code. Paste that into Claude Code as your opening message. The Anthropic Growth Marketing team and the Legal team both discovered this independently. It works.

## 5. The Dashboard Screenshot Debug

A clinician slacks you a screenshot of the chemotherapy dashboard with three red boxes and the message "this is wrong." You don't know which "this."

Paste the screenshot into Claude Code. Say "the user reports the three highlighted rows are wrong; find the bug." Claude reads the image, identifies the columns, traces the query, finds the join error, fixes it. Data Infra at Anthropic uses this pattern to diagnose Kubernetes outages from GCP screenshots. It works on Power BI screenshots too.

> 🧠 **Remember.** Images use context, but they're often cheaper than the 600 words you'd need to describe the bug in prose.

## 6. The Friday Ralph Loop

You have a `todo.md` with 17 unchecked items: refactor four prompts, regenerate three figures, update a Cox model, write the methods section, run three more evals. You also have a flight to catch.

Set up the Ralph loop with a `completion_promise` that requires every checkbox ticked and the eval suite green. Set `max_iterations` to 30. Launch. Get on the plane. By the time you land, most of it's done, the failed items are flagged with explanations, and you owe somebody a coffee but not a weekend.

## 7. The R Survival Analysis Buddy

You have a `survminer` chart that needs Lancet styling: stratified by treatment arm, p-value box, risk table, color palette from the published figure.

Open Claude Code in the project folder. Paste the target figure as an image. Say "match this with our `tidymodels` cohort, theme it for Lancet, save as PNG and PDF." Claude reads `theme_lancet.R` from your existing code, writes the new script, runs it, shows you the result. If wrong, paste the rendered PNG back in. Iterate until it matches. The whole loop is twenty minutes.

## 8. The MCP-Powered AIDI-DB Schema Inspector

Half your day is "wait, what's that column called in `SILVER_aki_episodes`?"

Install a Postgres/Azure SQL MCP server pointed at `AIDI-DB`. Once it's connected, you ask in plain English: "Which silver tables have a `creatinine_baseline` column, and which gold table aggregates them?" Claude queries `information_schema`, returns the answer, and remembers it for the rest of the session. The Anthropic Data Infra team replaced their data catalog with this exact pattern.

## 9. The Custom Slash Command Library

Every team has rituals: "make a commit message in the AIDI style," "open a PR against the dev branch with the standard template," "regenerate the patient cohort SQL with today's date." Each of these is one markdown file in `.claude/commands/`.

Spend a Friday afternoon writing eight of them. Check them into the repo. Now everyone on the team gets the same `/commit-aidi`, `/pr-dev`, `/refresh-cohort`. Security at Anthropic owns *half* of all custom slash commands in the entire company monorepo. They are the visible signature of a team that takes the tool seriously.

## 10. The Non-Coder Workflow Translator

A clinician comes to you with: "I want to pull yesterday's referral count, filter to oncology, group by service, and email the top five doctors."

You don't write the script. You teach them to write the *prompt*. Open Claude Code in a sandboxed folder, hand them the keyboard, watch them describe what they want in plain English. Claude writes the code, runs it, shows the result. You add a Hook that prevents anything destructive. The Anthropic Finance team trained their non-coders to do exactly this. The long-term value is not the script they got today; it's the dozen scripts they'll write next month without you.

> ⚠️ **Warning.** Sandbox aggressively for non-coders. `.claude/settings.json` deny-list everything in `/data/patients/` and any `*.key` / `*.env` file. The Hook chapter (14) covers the `PreToolUse` blockers you'll want.

---

## Try This

Pick workflow #1 (the eval run) and stand it up before you read Chapter 20. It's the single highest-payoff automation in this list, and it touches every concept in the book: hooks, slash commands, subagents, CLAUDE.md. If you can ship #1, you can ship the other nine.

## Watch Out

Don't try to build all ten in a week. Pick two. The trap with Claude Code is that everything is just-possible-enough that you'll over-commit. Two workflows shipped beats ten started.
