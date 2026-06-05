# Chapter 15: MCP Servers

Your AIDI pipeline lives in three places (Azure SQL, a Databricks notebook, and a Slack channel where the on-call pharmacist asks why last night's AKI alert was empty) and Claude Code, by default, can only see the third of those if you paste it in by hand. MCP servers are how you fix that.

## What MCP Actually Is

MCP stands for **Model Context Protocol**. It is an open standard, originally published by Anthropic, that lets an AI agent talk to an external tool or data source through a small, well-defined wire format. The agent says "list the tools you offer," the server replies with a menu, and from then on Claude can call those tools the same way it calls `Read` or `Bash`.

In practice, an MCP server is a tiny program (sometimes a single Node script, sometimes a Docker container) that sits between Claude Code and something Claude can't otherwise reach. Airtable, Notion, Slack, Postgres, Figma, Playwright, GitHub, Jira, your own internal API. Each one ships a server. You install it once. Claude treats it like a built-in.

> 🧠 **Remember.** MCP doesn't make Claude smarter. It makes Claude's *reach* bigger. The same model that can edit a Python file can now also query your production database, read a Slack thread, or click a button in a real browser, because an MCP server exposed those actions as tools.

## Installing One

The command is short:

```bash
claude mcp add <name> <command-or-url>
```

For a local server that runs as a subprocess:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

For a remote server reachable over HTTP:

```bash
claude mcp add aidi-sql https://mcp.khcc.jo/aidi-db
```

Once it's added, `claude mcp list` shows what's installed and `/mcp` inside a Claude session shows which servers are connected and which tools they expose. Removing one is `claude mcp remove <name>`.

> 💡 **Tip.** MCP servers can be installed at three scopes: local (this directory), user (every project on this machine), or project (shared via `.mcp.json` checked into git). Use project scope when your whole team needs the same connection (like Azure SQL) and user scope for personal stuff like your Notion workspace.

## The Four to Install First

There are hundreds of MCP servers in the wild. Most of them you do not need. The community consensus (Suryansh's #24) is that four cover 80% of the real-world value:

1. **Playwright**: gives Claude a real browser. After Claude builds a UI, it can click through it, take a screenshot, and *verify* the button actually does what the user asked. This single capability moves Claude from "writes code that compiles" to "writes code that works."
2. **Postgres / MySQL / SQL Server**: Claude can describe your schema, run `SELECT` queries, and explain a slow plan, without you pasting `\d+ patients` into chat every time. For KHCC, this is the big one.
3. **Slack**: Claude reads the bug thread directly. The pharmacist's complaint, the timestamp, the screenshot — all of it becomes context without manual copy-paste.
4. **Figma**: for teams that ship UI. Claude reads the design file and writes the component to match. Design-to-code in one hop.

> 🧠 **Remember.** Four MCP servers, used well, beats forty installed and forgotten. Every connected server adds tool definitions to Claude's context window. More servers = less room for your actual work.

## When CLI Tools Beat MCP Servers

Here is the contrarian rule, and it is one of the most useful in this book: **a CLI tool is almost always more context-efficient than an MCP server that does the same job.**

Why? An MCP server registers its tools with Claude at session start. Every tool gets a name, a description, a schema. Even if you never call them, they sit in the context window costing tokens. Ten MCP servers with eight tools each is eighty tool definitions Claude must read on every turn.

A CLI tool, by contrast, costs zero tokens until Claude actually runs it. Claude already knows how to call `gh`, `git`, `kubectl`, `aws`, `az`, `sentry-cli`, `psql`, and `curl` from training, and if it doesn't, it can run `--help` once and learn.

So:

- **Need to open a GitHub PR?** Don't install a GitHub MCP server. Teach Claude to run `gh pr create` and give it the auth token.
- **Debugging a production crash?** `sentry-cli events list --org khcc` is one command. The Sentry MCP server is forty.
- **Querying a Postgres dev database?** `psql -c "SELECT ..."` works fine. The Postgres MCP shines when you need *stateful* exploration of schema you don't know.

> 🔧 **Technical Stuff.** The context cost difference is real and measurable. Run `claude mcp list` after installing five servers and watch `/cost` on your next session. You will see the per-turn input tokens climb by 2,000–6,000 just from registered tool definitions.

## When MCP Actually Wins

MCP is the right answer when:

- **The tool has no good CLI.** Figma is a design app, not a command. Playwright has a CLI but exposing browser state to an LLM through it is awkward; the MCP server is the right interface.
- **The integration is stateful.** Notion pages, Slack threads, Airtable bases: these have IDs, relations, and pagination that benefit from a typed tool surface.
- **You want type-safe arguments.** An MCP tool with a JSON schema is harder for Claude to call wrong than a bash command with positional args.
- **The tool is shared across your team.** A `.mcp.json` checked into your repo gives every teammate the same `aidi-sql` connection on `claude mcp add`. There is no equivalent for "we all use the same shell aliases."

> ⚠️ **Warning.** Every MCP server you install can read whatever it's connected to. A Postgres MCP pointed at production can `DROP TABLE`. A Slack MCP can post to any channel your token has access to. Treat MCP credentials like database credentials, because that's what they are. Never install a third-party MCP server from a random GitHub repo without reading the code.

## The KHCC Example

Here is the AIDI setup that earns its keep.

**An MCP server for Azure SQL `AIDI-DB`.** A small Python server, running on the AIDI bastion, exposes three tools to Claude: `list_tables`, `describe_table`, and `run_select` (read-only, hard-coded to reject anything that isn't a `SELECT`). Now when an analyst asks Claude "build me a cohort of bone-only metastatic breast cancer patients from the last three years," Claude doesn't have to guess that the table is `GOLD_DIAGNOSIS` and the column is `met_site_bone`. It calls `describe_table GOLD_DIAGNOSIS`, sees the schema, writes the right query, runs it through `run_select`, sanity-checks the row count, and only then asks you to approve the final SQL. No DBA paged. No schema docs out of date.

**An MCP server for the KHCC Optimus encoding service.** The Optimus encoder turns a real MRN into the obfuscated ID that gets logged, emailed, and dashboarded. Without an MCP, Claude either hard-codes an MRN (a privacy violation waiting to happen) or asks you for the encoded form (a workflow break). With the MCP, Claude calls `optimus_encode "<mrn>"`, gets the safe ID back, and uses it in the script. The real MRN never leaves the encoder process.

Both of these are about 200 lines of Python each. They sit in `aidi-mcp-servers/` in the AIDI repo. Every analyst who pulls the repo and runs `claude mcp add aidi-sql ...` gets the same connection.

> 💡 **Tip.** When you write your own MCP server, give every tool a description that tells Claude *when not to use it*. "Runs a read-only SELECT against AIDI-DB. Use only for cohort queries. Do not use to count rows; use `describe_table` for size estimates." Claude follows tool descriptions far more reliably than it follows your prompts.

## Try This

1. Run `claude mcp list` to see what (if anything) is already installed.
2. Install one. Playwright is the most fun. `claude mcp add playwright npx @playwright/mcp@latest`.
3. In a Claude session, ask: "Open google.com, search for 'KHCC', and tell me the title of the first result." Watch Claude drive a real browser.
4. Now uninstall it: `claude mcp remove playwright`. Compare the `/cost` of a one-turn session before and after. That delta is what every always-installed MCP costs you.

## Watch Out

- **Don't install five servers before you've used one.** Tool definitions are context tax. Pay only for the ones you use this week.
- **Read the source of any third-party MCP server before connecting it to a database.** "Open source" is not "safe."
- **Read-only by default.** Your AIDI-DB MCP should refuse anything but `SELECT`. The day someone writes `DELETE FROM patients WHERE ...` in a prompt is the day you learn this the hard way.
- **CLI first, MCP second.** If `gh`, `psql`, or `az` will do the job, use them. Save MCP for tools that genuinely need a typed interface.
