---
layout: page
title: "Lesson 4: MCP Servers and Anthropic Connectors"
permalink: /session_10/instructions/lesson4_mcp_connectors/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #00838F!important}
.site-title,.site-title:visited{color:#00838F!important;font-weight:800!important}
</style>

# Lesson 4 — MCP Servers and Anthropic Connectors

*25 minutes. Two worked examples — a Connector and a custom server — plus one rule of thumb that will save you a lot of context tokens.*

When a creatinine result lands in VistA, it does not stay there. The VistA EMR talks to the lab system through an interface engine — a small piece of middleware whose entire job is translating between formats neither system natively speaks. VistA does not need to know anything about the lab system's internal database. The lab system does not need to know anything about VistA's chart structure. They just agree on a wire format.

**MCP** — the **Model Context Protocol** — is that interface engine, for Claude. It is a published standard, written by Anthropic but open to anyone, for how an AI agent connects to an external tool or service. Once an MCP connection is live, Claude can call the external tool the same way it calls its built-in `Read` or `Bash` — read your Slack threads, query an Azure SQL table, click around in a real web browser, edit a Notion page, raise a Linear issue.

> 🧠 **Remember.** MCP does not make Claude smarter. It makes Claude's *reach* longer. The same model that edits a Python file can now query a production database or read a Slack channel, because an MCP server has exposed those actions as tools Claude knows how to call.

## Connectors vs custom MCP servers — same protocol, different doorway

Two flavours, and you will use both.

**Anthropic Connectors** are Anthropic's productised integrations. Slack, Gmail, Google Drive, Google Calendar, Notion, Linear, Asana, Jira, GitHub — all available as one-click installs inside Claude.ai and Claude Desktop. You sign in with OAuth, pick which scopes the connector gets (read-only your inbox, full access to a single channel, that sort of thing), and you are done. No code, no terminal, no JSON file. Anthropic vets the implementation and the security model. The price is that you only get the connectors Anthropic has built.

**Custom MCP servers** are anything that anyone writes. There are hundreds in the wild, plus the ones you build yourself. They are added from inside Claude Code with one command:

```bash
claude mcp add <name> <command-or-url>
```

Both speak the same Model Context Protocol. The difference is curation, ease of install, and trust boundary.

> 💡 **Tip.** If the system you want to talk to already has an Anthropic Connector, use it. The OAuth flow handles credentials properly, the scopes are sane, and there is nothing to debug. Custom MCP servers are for everything else.

## The three scopes — and which one you want when

Every MCP install lands at one of three scopes. The scope decides who else gets the connection.

- **Local** — this folder only. Useful for a one-off experiment.
- **User** — every project on your machine. Use this for personal connections like your own Notion workspace, your own Gmail.
- **Project** — checked into `.mcp.json` in the repo and shared with the team. Use this when the *whole team* needs the same connection, like the AI Office's read-only Azure SQL handle for `AIDI-DB`. One person sets it up; everyone else gets it on the next `git pull`.

A good rule: if the connection is to *your* personal account, use user scope. If the connection is to a *team-shared* system, use project scope and commit the `.mcp.json`.

> ⚠️ **Watch out.** A `.mcp.json` at project scope can contain a URL but should never contain credentials. Credentials live in the developer's environment (Azure Key Vault, a `.env` file in `.gitignore`, an OS keychain). The MCP file says *where* to connect; the secrets say *how*.

## What Claude Code can actually do once an MCP is live

Concrete examples, taken straight from how the AI Office uses MCPs today:

- **Implement features from issue trackers.** A Linear connector means Claude can read the issue, understand the acceptance criteria, and start coding without you copy-pasting the description.
- **Query databases.** An Azure SQL MCP means Claude can ask "which columns does `SILVER_PATHOLOGY_REPORTS` have?" and write a correct cohort query the first time, instead of guessing schemas from memory.
- **Analyse monitoring dashboards.** A Datadog or Power BI MCP means Claude can read the actual chart and say "the AKI alert volume dropped by 40% last Tuesday — did a deploy go out?" rather than waiting for you to describe what you saw.
- **Automate workflows.** A GitHub MCP means Claude can open PRs, request reviews, and close issues. A Slack MCP means Claude can read the on-call channel and start triaging.

## Worked example 1 — the Slack connector

You want Claude to read the `#triage-alerts` channel where the AKI Notification pipeline posts each morning's alerts. Two minutes, no code.

In Claude.ai or Claude Desktop, open the Connectors panel. Click **Slack**. OAuth opens — sign in with your khcc.jo Slack account. Pick the scope: read access to channels you are already a member of is enough. Approve. Done.

Now in a Claude session: *"Read the last twenty-four hours of #triage-alerts and summarise which patients had a stage 2 or stage 3 AKI flag."* Claude calls the connector's tools, pulls the messages, parses out the encoded MRNs and the KDIGO stages, and gives you a short summary. The on-call nephrology fellow gets the same summary the next morning without you doing anything.

The same shape works for `#bug-triage`, `#deploy-failures`, `#weekly-eval-results` — any channel whose contents Claude can usefully reason about.

## Worked example 2 — sketching a custom MCP server

Now the other side. Suppose you want Claude to query the AI Office Azure SQL `AIDI-DB` directly. There is no Anthropic Connector for that — KHCC's silver/gold tables are not a public service. You write your own.

A custom MCP server is, at its smallest, a small Python program that exposes a few **tools**. Each tool has a name, a description, a typed input schema, and a handler function. Here is the shape (not the full code — about 50 lines in reality):

```python
from mcp.server import Server
from pydantic import BaseModel, Field

server = Server("aidi-sql")

class RunSelectInput(BaseModel):
    query: str = Field(..., description="A SELECT statement. Other verbs rejected.")

@server.tool(
    name="run_select",
    description=(
        "Runs a read-only SELECT against AIDI-DB. "
        "Use only for cohort queries against SILVER_* or GOLD_* tables. "
        "Do not use to count rows; use describe_table for size estimates."
    ),
)
def run_select(input: RunSelectInput) -> list[dict]:
    if not input.query.strip().lower().startswith("select"):
        raise ValueError("Only SELECT statements are allowed.")
    return execute_against_aidi_db(input.query)
```

Three things to notice. First, the tool description tells Claude *when not to use it* — that is more reliable than free-form prompt instructions. Second, the input is a typed Pydantic model — Claude reads the schema and gets the argument shape right far more often than with positional bash arguments. Third, the handler is dumb code that refuses anything but `SELECT`. The LLM never gets to "decide" whether `DELETE` is safe; the server refuses.

Add a `describe_table(table_name)` tool and a `list_tables()` tool alongside `run_select`, and you have a real schema-aware analyst at Claude's elbow. An analyst asking *"build me a cohort of bone-only metastatic breast cancer patients diagnosed in the last three years"* no longer has to remember that the column is `met_site_bone` in `GOLD_DIAGNOSIS`. Claude calls `describe_table`, sees the real schema, writes the right query, runs it through `run_select`, and shows the analyst the result.

(See Chapter 0.5 in the book for what `AIDI-DB`, silver tables, and the medallion pattern are.)

> 🔧 **Technical Stuff.** MCP servers can run as a local subprocess (started on demand by `claude mcp add aidi-sql python /path/to/server.py`) or as a long-running HTTP service (`claude mcp add aidi-sql https://mcp.khcc.jo/aidi-db`). Choose the subprocess for personal tools and the HTTP service for team-shared ones.

## Four MCP servers worth installing first

The wild has hundreds of MCP servers; you will almost never need more than four.

1. **Playwright** — gives Claude a real web browser. Open URLs, click buttons, fill forms, take screenshots. This is how Claude verifies its own UI work after building a screen. It is also how the AI Office checks whether the chemo-prep dashboard renders correctly after a deploy.
2. **Postgres / Azure SQL / MySQL** — a typed database connection. Worth its weight for schema-aware cohort building. The AIDI-DB MCP above lives in this category.
3. **Slack** — read triage channels, deploy channels, eval-result channels.
4. **GitHub** — read PRs, write reviews, close issues. (Read the next section before you install this one.)

## The CLI-beats-MCP rule

Here is a piece of advice that catches everyone off guard: **a regular command-line tool is almost always more efficient than an MCP server that does the same job.**

Why. Every MCP server you install registers all of its tools — names, descriptions, argument schemas — into Claude's context window at the start of every session. Even tools you never call sit there, taking tokens, on every turn. Ten servers with eight tools each is eighty tool definitions Claude re-reads on every message.

A CLI tool costs zero tokens until Claude actually runs it. Claude already knows from training how to call `git`, `gh` (GitHub CLI), `psql`, `az` (Azure CLI), `curl`, and most standard tools. If it does not know a flag, it runs `--help` once and learns.

So:

- **Open a GitHub PR?** `gh pr create` is one command. Skip the GitHub MCP.
- **Query a dev Postgres?** `psql -c "SELECT ..."` is fine for a one-off. The Postgres MCP earns its keep when you are exploring an unfamiliar schema repeatedly.
- **Trigger a deploy on Azure?** `az` CLI is one command. Skip the Azure MCP.

Use MCPs for the things that genuinely need a typed interface or stateful access. Use CLIs for the things a command answers.

> 🔧 **Technical Stuff.** Run `/cost` in a session, install five MCP servers, run it again. The baseline per-turn input tokens climb by 2,000–6,000 just from the registered tool definitions. Across a long session that is real money — and more importantly, real context taken from your actual work.

## Read-only by default — the clinical-data MCP rule

Every MCP server you install can read whatever it is connected to *and write back, if you let it*. A Postgres MCP pointed at production can run `DROP TABLE`. A Slack MCP can post to any channel its token reaches.

For clinical-data MCPs at KHCC, the rule is unambiguous: **read-only by default**. The Azure SQL server should refuse anything but `SELECT`. The notes-table server should refuse anything but `READ`. Writes go through a separate, audited, narrowly-scoped server with a different name, used only when the workflow genuinely requires it.

The day someone — student, vendor, you on a tired Friday — writes "delete all rows where status = 'invalid'" in a prompt is the day you learn this rule the hard way. Pre-empt it. The five lines of code that refuse non-SELECT verbs in the example above are not optional; they are the whole point.

> ⚠️ **Watch out.** "Open source" is not the same as "safe". Read the source of any third-party MCP server before pointing it at a database with patient data. A 200-line server you reviewed yourself is safer than a 20,000-line server you trust on a GitHub star count.

## Try This

1. Run `claude mcp list` to see what (if anything) is currently installed.
2. Install Playwright: `claude mcp add playwright npx @playwright/mcp@latest`. In a session, ask Claude *"open google.com, search for KHCC, tell me the title of the first result"*. Watch a real browser open.
3. Run `/cost` on a one-turn session. Note the baseline input tokens. Run `claude mcp remove playwright`. Open a fresh session and run `/cost` again. The difference is what every always-installed MCP costs you on every turn.
4. If your team has an Anthropic Connector available (Slack, Gmail, Linear), install one and ask Claude a question that genuinely needs to read the external system. Feel the difference between MCP-augmented and MCP-free responses.

## Watch Out

- **Don't install five servers before you have used one.** Tool definitions are context tax. Pay only for what you use this week.
- **CLI first, MCP second.** If `gh`, `psql`, `az`, or `git` will do the job, use them.
- **Read-only by default for clinical data.** The MCP server's code refuses destructive verbs. Don't trust the prompt to remember.
- **Project-scope `.mcp.json` files never carry credentials.** URLs and tool names only. Secrets live in the environment.
- **Connectors are vetted; random MCPs are not.** When a Connector exists for the system you want, prefer it. Save the custom-server route for the things only your team can build.
