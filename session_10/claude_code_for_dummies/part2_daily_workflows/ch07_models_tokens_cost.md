# Chapter 7: Models, Tokens, and Cost

Claude Code isn't one model. It's a family, and using the wrong family member for the job is how you accidentally spend $80 on a typo fix.

This chapter is about picking the right model, understanding what you're paying for, and knowing the difference between a subscription that saves you money and an API key that quietly drains it.

## The Family

Three models, three personalities, three price points.

- **Haiku**: fast, cheap, light. Good at classification, extraction with a tight schema, structured rewrites, batch jobs over thousands of inputs. Not so good at reasoning through ambiguity, multi-file refactors, anything where "judgment" matters.
- **Sonnet**: the default. Smart, fast enough, priced for daily use. This is the model you'll spend 80% of your time with. Good at everything. Great at the kind of mixed reading/writing/debugging that fills your workday.
- **Opus**: the smartest one. Slower. More expensive. Worth it for hard architectural decisions, gnarly SQL that has to be right the first time, multi-step planning, anything where a wrong answer costs you an hour.

> 🧠 **Remember.** The model is a dial, not a religion. Sonnet for most things, Opus when it matters, Haiku when the task is small and repetitive. Match the model to the task, not the task to the model.

## Switching Mid-Session

You don't commit to a model when you open Claude Code. Switch any time with:

```
/model
```

That pops a picker. Or be explicit:

```
/model opus
/model sonnet
/model haiku
/model opus[1m]
```

The `[1m]` suffix asks for the 1M-token context window (covered in Chapter 6). It's only available on Sonnet and Opus.

> 💡 **Tip.** A common workflow: start in Sonnet, hit a wall on a hard problem, `/model opus`, get past the wall, `/model sonnet` to keep iterating cheaply. The hard part doesn't have to cost premium for the whole session.

## What's a Token, Really?

A token is roughly ¾ of a word in English. "Patient" is one token. "Patients" is one token. "Pneumocystis jirovecii" is probably four tokens. Code tokenizes differently again: a Python `def` is one token, an obscure variable name might be three.

The numbers you want to keep in your head:

- **1,000 tokens ≈ 750 words ≈ one short page.**
- A typical Claude Code prompt: 50–200 tokens.
- A typical response with a small edit: 500–2,000 tokens.
- A typical file Read: 500–5,000 tokens.
- A massive PDF: 50,000+ tokens.
- A 1M-token window: enough to hold a small book and still have room to work.

> 🔧 **Technical Stuff.** Input tokens and output tokens are priced differently: output is more expensive. Cached prompt prefixes (the `CLAUDE.md`, the tool definitions, the system prompt) are billed at a steep discount on cache hits. The TUI handles caching automatically; you don't tune it.

## `/cost` and `/stats`

Two commands. Memorize both.

**`/cost`**: what you've spent in *this session*. Total dollars, broken down by model. You'll see lines like "Sonnet 4.6: 142,000 tokens in, 18,000 tokens out, $0.83." Run it before and after a big task to know what that task actually cost you.

**`/stats`**: a richer view. Shows tokens by model, cache hit rates, the breakdown of input vs. output, and (depending on version) a running total across recent sessions.

> 💡 **Tip.** Run `/cost` at the end of every working day for a week. You'll quickly learn which tasks are cheap and which are expensive. After that, your sense of "is this prompt going to cost a quarter or four dollars" gets accurate, and you'll stop over-thinking small spend.

## Pro, Max, or API?

Three ways to pay. Pick the one that matches your *actual* usage, not the one that sounds impressive at dinner.

### Claude Pro ($20/month)

Generous for the hobbyist or the clinician who codes for an hour a day. All models included. Predictable. Tells you when you're rate-limited, doesn't surprise-bill you. If you're not sure whether you'll stick with Claude Code, this is where to start.

### Claude Max ($100/month or $200/month)

For people who live inside Claude Code. The $100 tier is enough for a serious solo developer working full-time. The $200 tier ("Max 20×") is for the heavy operator: multiple sessions in parallel, agent teams, big context windows, long sessions. Both include all models, both rate-limit before they bill you.

> 💡 **Tip.** If you find yourself doing math like "can I afford to switch to Opus for this?", you're on the wrong plan. Max exists so you stop counting.

### API (pay-as-you-go)

You bring an Anthropic API key, Claude Code uses it, you pay per token. No subscription, no rate limits beyond the API's own quotas.

When the API wins:

- Very light usage. A few sessions a week, mostly Haiku/Sonnet. You'll pay $5–20/month and beat any subscription.
- Headless / CLI-mode automation. Scheduled jobs, Ralph loops, batch extractions. These don't benefit from a Max plan's interactive limits; they benefit from per-token billing.
- You're a team and you want centralized billing across many users via Anthropic's API.

When the API loses:

- Daily interactive coding. You'll blow past $200/month easily and have no rate limit telling you to slow down.

> ⚠️ **Warning.** The API has *no soft warning* before it gets expensive. A bug in a Ralph loop can chew through $100 in an afternoon if you're not watching. Set spending caps in the Anthropic console. Treat your API key like a credit card.

## "Ultrathink" and the Old Magic Words

A bit of history is owed here.

In earlier versions of Claude Code, you'd type words like **`think`**, **`think hard`**, **`think harder`**, or **`ultrathink`** in your prompt to nudge the model into spending more reasoning tokens before answering. Each word allocated a bigger thinking budget.

On Opus 4.6 (and Sonnet 4.6), this is largely automatic: extended thinking is on by default, with an adaptive budget. The model decides how much to think based on the difficulty of the prompt.

But the keywords still work, and on hard problems they still help. `ultrathink` on Opus 4.6 cranks the reasoning budget to its maximum, and you'll feel it on problems like:

- "Plan a refactor of the AKI staging logic so we can swap KDIGO versions without rewriting the alert pipeline."
- "Here are three SQL queries that should give the same answer but don't. Find the difference."
- "Design the schema for an evals table that supports retries, partial matches, and frozen ground truth."

> 🔧 **Technical Stuff.** Thinking tokens are billed like output tokens. `ultrathink` on Opus can mean tens of thousands of extra tokens before the model writes a single word of response. Worth it for the right problem. Wasted on "rename this variable."

## A KHCC Walkthrough: Picking Models Through a Workday

Morning. You're iterating on the chemo prep extractor prompt. Twenty cycles of "tweak prompt, run on 5 examples, look at output, tweak again." This is **Sonnet** work. Cheap, fast, perfectly capable.

11am. You hit a snag: the SQL that pulls the cohort is double-counting patients with multiple admissions in the same week, and you've been staring at it for fifteen minutes. **`/model opus`**, paste the query, **`ultrathink — explain why this is double-counting and propose a fix that doesn't break the multi-admission case`**. Five minutes later, you have it.

```
/model sonnet
```

Back to iterating.

Afternoon. The prompt is locked. You need to run it over 4,000 historical notes for the validation set. This is not an interactive job. You write a small Python script that calls the Anthropic API directly with **Haiku** for each note. Haiku is plenty for structured extraction once the prompt is solid, and at Haiku prices, 4,000 notes costs you a few dollars instead of several hundred.

> 🧠 **Remember.** Sonnet for tuning. Opus for the hard moments. Haiku for the batch. Three models, three jobs. Don't pay Opus prices to do Haiku work, and don't ask Haiku to plan your architecture.

## A Word on Cost Discipline

The dollar amounts in this chapter sound small until they aren't.

A solo clinician using Claude Code an hour a day on Sonnet might spend $30–50/month on the API, or get the same usage covered by a $20 Pro plan.

An AIDI engineer running multiple sessions, Opus for hard tasks, occasional 1M-context dives, agent teams, and a few automated CLI jobs in the background can easily spend $400–800/month on the API, and would be far better off on Max 20×.

A Ralph loop misconfigured to keep retrying a failing eval forever can spend $200 overnight on the API. Don't ask me how I know.

> ⚠️ **Warning.** Two rules. (1) Set a hard spending cap on any API key Claude Code uses. (2) If you're spending more than $200/month on the API for interactive work, you're on the wrong plan.

## Try This

1. Run `/cost` right now, in your current session. Note the number. Run it again at end of day. You'll be calibrated within a week.
2. Find the most recent prompt where you felt Claude "didn't quite get it." Switch to `/model opus`, paste the same prompt with `ultrathink`, and compare. Decide whether the answer was worth the price.
3. If you have an API key, log into the Anthropic console and set a monthly spending cap. Pick a number that would *hurt* if you hit it accidentally. Then build the habit of staying well under.
4. Try one batch job in Haiku. Pick a task you'd normally do in Sonnet (classifying a few hundred lines of text, extracting fields from a list of forms). Run it once in Sonnet, once in Haiku. Compare quality and cost. Decide for yourself.

## Watch Out

- **Don't default to Opus for everything.** It's a screwdriver, not a hammer. Most of your work is Sonnet work.
- **Don't run batch jobs on a Max plan thinking it's "free."** Max has rate limits. Hit them, and your interactive sessions stall.
- **Don't use the API without a spending cap.** A bug in a loop will out-spend a Max plan in a single afternoon.
- **Don't paste secret keys into Claude Code thinking the cost is the worry.** It isn't. The keys land in your transcript and possibly your logs. That's a security problem, not a billing problem.
- **Don't switch to 1M context just because you can.** It costs more per token, and a bigger room doesn't help if you can't keep it tidy (re-read Chapter 6).
