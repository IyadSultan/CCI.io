# Appendix B: Build Your Own Agent with the Claude Agent SDK

The rest of this book treated Claude Code as a tool you talk to. This appendix treats it as a library you build with.

If you've used Claude Code, you've seen what an AI agent can actually do: read files, run commands, edit code, figure out the steps to accomplish a task. The **Claude Agent SDK** is that same engine, exposed as a library you can point at whatever problem you want. You get the agent loop, the built-in tools, context management — basically everything you'd otherwise have to build yourself.

This appendix walks you through building a small agent end to end. Pick it up when you've outgrown the interactive workflow and want to embed a Claude agent in a Python script, a CI job, or a Django backend.

> 🧠 **Remember.** Agent SDK = Claude Code minus the terminal UI, plus a programmatic API. Same loop, same tools, same context system. You're not learning a new model; you're learning a new front door.

## When to reach for the SDK

You probably want the SDK if:

- You're building a service (a webhook, a CI bot, a scheduled job) that calls Claude.
- You want **structured output** that downstream code can parse (JSON Schema enforced).
- You need **custom tools** (your own database, your own API) that Claude can call directly.
- You want to run Claude **inside a Django view** or behind an Azure Function.

You probably don't need it if you're sitting at a keyboard doing daily dev work; that's what the CLI is for.

## Install

```bash
# Node.js 18+
npm install -g @anthropic-ai/claude-code   # the runtime
npm install @anthropic-ai/claude-agent-sdk # the library
export ANTHROPIC_API_KEY=sk-ant-...
```

Python bindings exist too (`pip install claude-agent-sdk`). The patterns below are TypeScript because that's what Anthropic ships first, but they translate one-to-one.

## Your first agent

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "What files are in this directory?",
  options: {
    model: "opus",
    allowedTools: ["Glob", "Read"],
    maxTurns: 250
  }
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  }
  if (message.type === "result") {
    console.log("Done:", message.subtype);
  }
}
```

That's the whole loop. `query()` returns an async generator that streams messages: assistant text, tool calls, system events, the final result. The SDK handles the agent loop: call the model, check if it wants a tool, execute it, feed the result back, repeat until done.

## Message types

```typescript
case "system":
  // Session init: capture session_id for resuming later
  if (message.subtype === "init") {
    sessionId = message.session_id;
  }
  break;

case "assistant":
  // Claude's text and tool calls
  break;

case "result":
  // Final outcome: message.subtype is "success" or an error type
  // message.total_cost_usd is the spend
  // message.usage has token counts
  break;
```

## Structured output

For programmatic use, force JSON Schema:

```typescript
const reviewSchema = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { enum: ["low", "medium", "high", "critical"] },
          category: { enum: ["bug", "security", "performance", "style"] },
          file: { type: "string" },
          line: { type: "number" },
          description: { type: "string" },
          suggestion: { type: "string" }
        },
        required: ["severity", "category", "file", "description"]
      }
    },
    summary: { type: "string" },
    overallScore: { type: "number" }
  }
};

for await (const message of query({
  prompt: "Review the code in ./src and identify all issues.",
  options: {
    model: "opus",
    allowedTools: ["Read", "Glob", "Grep"],
    outputFormat: { type: "json_schema", schema: reviewSchema }
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    const review = message.structured_output;
    // review.issues is now a typed array; feed it to Slack, a DB, anything.
  }
}
```

This is the unlock for production use. The result is parseable. You don't regex-match on natural language anymore.

## Permission modes

```typescript
options: {
  permissionMode: "default",          // Prompt for approval (interactive only)
  // OR
  permissionMode: "acceptEdits",      // Auto-approve file edits
  // OR
  permissionMode: "bypassPermissions" // No prompts; use in CI only
}
```

For fine-grained control, supply a `canUseTool` callback:

```typescript
options: {
  canUseTool: async (toolName, input) => {
    if (["Read", "Glob", "Grep"].includes(toolName)) {
      return { behavior: "allow", updatedInput: input };
    }
    if (toolName === "Write" && input.file_path?.includes(".env")) {
      return { behavior: "deny", message: "Cannot modify .env files" };
    }
    return { behavior: "allow", updatedInput: input };
  }
}
```

> ⚠️ **Warning.** `bypassPermissions` in a clinical pipeline that touches `aidi_catalog` is a fast way to lose evening sleep. Always wrap with `canUseTool` and at minimum block writes to PHI paths.

## Subagents in the SDK

You can define specialists inline:

```typescript
options: {
  allowedTools: ["Read", "Glob", "Grep", "Task"], // Task enables subagents
  agents: {
    "security-reviewer": {
      description: "Security specialist for vulnerability detection",
      prompt: "You are a security expert. Focus on injection, secrets, auth.",
      tools: ["Read", "Grep", "Glob"],
      model: "sonnet"
    },
    "test-analyzer": {
      description: "Test coverage and quality analyzer",
      prompt: "You are a testing expert. Find gaps and missing edge cases.",
      tools: ["Read", "Grep", "Glob"],
      model: "haiku"   // Cheaper model for simpler analysis
    }
  }
}
```

The main agent decides when to delegate. Each subagent runs in its own context window with its own tools and (optionally) a cheaper model.

## Custom tools via MCP

When the built-in tools aren't enough, expose your own via the Model Context Protocol:

```typescript
import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const aidiServer = createSdkMcpServer({
  name: "aidi-db",
  version: "1.0.0",
  tools: [
    tool(
      "query_aidi",
      "Query aidi_catalog read-only. Returns up to 100 rows.",
      { sql: z.string().describe("SELECT-only SQL") },
      async (args) => {
        const rows = await runReadOnlyQuery(args.sql);
        return { content: [{ type: "text", text: JSON.stringify(rows) }] };
      }
    )
  ]
});

for await (const message of query({
  prompt: "Find all deceased patients with stage 3 AKI in 2025.",
  options: {
    model: "opus",
    mcpServers: { "aidi-db": aidiServer },
    allowedTools: ["mcp__aidi-db__query_aidi"]
  }
})) {
  // ...
}
```

You've just given Claude SQL access to `aidi_catalog` with a single read-only handler, with no tool-loop boilerplate. This is the pattern for embedding Claude into real KHCC services.

## Hooks in the SDK

Same hooks as the CLI, exposed programmatically:

```typescript
const blockDangerous: HookCallback = async (input) => {
  if (input.hook_event_name === "PreToolUse" && input.tool_name === "Bash") {
    const cmd = input.tool_input.command || "";
    if (cmd.includes("rm -rf") || cmd.includes("DROP TABLE")) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "Dangerous command blocked"
        }
      };
    }
  }
  return {};
};

options: {
  hooks: {
    PreToolUse: [
      { matcher: "Bash", hooks: [blockDangerous] }
    ]
  }
}
```

> 🔧 **Technical Stuff.** Hooks have signatures `(input, toolUseId, { signal }) => Promise<HookResult>`. The `signal` is an `AbortSignal` for cancellation. Return `{}` to allow the operation.

## Session resumption

Multi-turn conversations from a service:

```typescript
let sessionId;
for await (const msg of query({ prompt: "Review the codebase.", options })) {
  if (msg.type === "system" && msg.subtype === "init") sessionId = msg.session_id;
}

// Later, in another HTTP request:
for await (const msg of query({
  prompt: "Now fix the most critical issue.",
  options: { ...options, resume: sessionId }
})) {
  // Claude remembers everything from the first call.
}
```

This is how you build a stateful Claude-backed service without re-sending the whole history.

## Cost tracking

```typescript
if (message.type === "result" && message.subtype === "success") {
  console.log("Cost:", message.total_cost_usd);
  console.log("Tokens:", message.usage);
  for (const [model, usage] of Object.entries(message.modelUsage)) {
    console.log(`${model}: $${usage.costUSD.toFixed(4)}`);
  }
}
```

Per-model breakdown is essential when subagents are in play. You'll discover the Haiku-based search agent is essentially free and the Opus reviewer is the entire bill.

## A real KHCC pattern

A nightly extraction service:

1. Azure Function fires at 02:00.
2. Spawns a `query()` call with the AIDI extraction prompt, JSON Schema output, and a `canUseTool` callback that blocks writes outside `extracts/`.
3. Custom MCP server lets Claude query schema from `AIDI-DB` read-only.
4. Subagent `security-reviewer` (Sonnet) scans the output for accidental PHI leakage.
5. `Stop` hook runs the eval suite, blocks return if anything regressed.
6. Result lands as JSON in blob storage; downstream pipeline picks it up at 02:30.

No human in the loop. Full audit trail (every tool call logged via `PreToolUse` audit hook). Total cost: under $2 per night.

## Where to go next

- **Official docs:** the SDK reference covers all message types, options, and tool schemas.
- **The CLI is the SDK with a UI.** Everything you can do interactively, you can script, so use the CLI to prototype, then port to the SDK.
- **Skills package up SDK-friendly capabilities.** A skill you write in `.claude/skills/` works equally well in the CLI and via `query()`.

## Closing

You now have a complete picture. Claude Code (the CLI you've been using for 22 chapters) is one front door to the agent. The SDK is the other. Same engine, different ergonomics. Pick the one that fits the job in front of you.

The clinical AI office at KHCC will outlive any individual tool, model, or library on this list. Build with that in mind: small, testable, surgical, fail-loud. Claude Code is a force multiplier on those habits. It is not a substitute for them.

Now go ship something.
