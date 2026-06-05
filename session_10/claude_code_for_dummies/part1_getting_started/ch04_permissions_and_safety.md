# Chapter 4: Permissions and Safety

There is exactly one chapter in this book that, if you skip it, will eventually cost you a file, a repo, or a Monday. This is that chapter.

## Why Permissions Exist

Claude Code is not a chatbot. We hammered on this in Chapter 1, and it comes back to bite us here. Because Claude Code takes real actions on your real computer, it can also do real damage:

- Delete files.
- Overwrite working code with broken code.
- `git push --force` to main.
- Drop a table.
- Send an email to a real address.
- Hit a paid API a thousand times.
- Read an `.env` file containing real credentials and helpfully include them in a commit.

None of that is theoretical. All of it has happened to someone in the last six months.

So Claude Code ships with a permissions system. By default, before Claude does anything significant (write a file, run a shell command, hit the network) it stops and asks you. You see exactly what it wants to do. You say yes or no.

> 🧠 **Remember.** The default permissions mode is "ask before doing anything that touches the world." That is the right mode to start in. Stay there until you understand what you're being asked to approve.

## The Approval Tax

Default mode is safe, but after about an hour you notice the cost: Claude is interrupting you every fifteen seconds to ask permission for `npm run lint`, `pytest`, `git status`, and other things you'd be willing to bet your house on. This is the approval tax, and it kills flow.

The fix is not to turn permissions off. The fix is to **pre-approve** the things you trust, and keep gating the things you don't.

## `/permissions` and the Allowlist

Inside Claude Code, type:

```
/permissions
```

You'll see a panel listing:

- **Allow**: actions Claude can take without asking.
- **Deny**: actions Claude is forbidden to take, ever.
- **Ask**: the catch-all default for anything not on either list.

You can add entries inline (Claude will offer to add the current pending command), or you can edit `.claude/settings.json` directly.

A reasonable starting allowlist for most projects:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(pytest:*)",
      "Bash(Rscript -e:*)",
      "Bash(ls:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./credentials/**)",
      "Read(./**/*.key)",
      "Read(./**/*.pem)",
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)"
    ]
  }
}
```

> 💡 **Tip.** You don't have to write this JSON yourself. Inside Claude Code, just say: *"Add the common safe permissions to my settings — reading files, running tests, basic git commands, starting the dev server. Show me what you're adding before you save it."* Claude will draft the JSON and let you approve.

What belongs on each list?

**Safe to allowlist** (you do these a hundred times a day, and a mistake costs nothing):

- Reading files (`Read`, `Glob`, `Grep`).
- Running your test suite.
- Running your linter or formatter.
- Read-only git commands (`status`, `diff`, `log`, `branch`).
- Starting a local dev server.

**Keep gated** (the cost of a mistake is real):

- Installing packages.
- Deleting files or folders.
- Anything that touches the internet — API calls, web fetches, outbound HTTP.
- Anything that writes to a remote — `git push`, `dbx`, deployments.
- Anything that hits a database in write mode.

> 🧠 **Remember.** The permissions file is checked into your repo. That means every teammate on the project picks up the same allowlist. Configure once, share automatically.

## The Deny List Is Not Optional

The deny list is the other half of the system, and it matters more than the allowlist. The allowlist saves you keystrokes. The deny list saves you incidents.

Things that should be on the deny list in every single project, no exceptions:

- `Read(./.env)` and every variant (`.env.local`, `.env.production`, etc.).
- `Read(./secrets/**)`.
- `Read(./credentials/**)`.
- `Read(./**/*.key)` and `*.pem`.
- `Bash(rm -rf:*)`.
- `Bash(git push --force:*)` and `Bash(git push -f:*)`.

Once a file is on the deny list, Claude can't read it even if you explicitly ask it to. The agent doesn't see the contents; it doesn't include them in search results; it can't accidentally paste them into a commit. This is the layer that turns a careless prompt into a non-event instead of an incident.

> ⚠️ **Warning.** A surprising number of `.env` files end up in conversation transcripts because a developer asked Claude to "help me debug why this isn't connecting" and Claude helpfully read the env file. Once it's in the transcript, it's in the model provider's logs. Put the deny list in place *before* you have that thought.

## `--dangerously-skip-permissions` and Why Boris Doesn't Use It

There is a flag (you've seen it in Chapter 2) called `--dangerously-skip-permissions`. It turns off the permission prompts entirely. Claude does whatever it decides to do, with no human in the loop.

The flag is named exactly what it is. Boris Cherny, the creator of Claude Code, has said publicly that he never uses it himself. The recommended path, straight from the source, is to use a `settings.json` allowlist + the default `ask` mode for everything else.

> ⚠️ **Warning.** If the person who built Claude Code won't use `--dangerously-skip-permissions`, you should consider why. The flag is appropriate in *very* narrow circumstances (sandboxed CI jobs, ephemeral containers, Ralph loops in worktrees, Chapter 18) and inappropriate everywhere else. It is never the right default for interactive work on a repo you care about.

If you absolutely must run unattended (overnight refactor, long Ralph loop), pair the flag with **isolation**: a fresh worktree, or `--sandbox` (below). Never run it against your main checkout.

## `--sandbox` Mode: The Safer "Run Wild"

Claude Code ships with a sandbox mode that uses OS-level isolation (Seatbelt on macOS, bubblewrap on Linux) to confine the session to a restricted filesystem and network view. From inside the sandbox, Claude can do whatever it wants; outside the sandbox, nothing changed.

```bash
claude --sandbox
```

This is the right way to let Claude experiment. Try a refactor. Run a wild prototype. Let it install seven npm packages you've never heard of. When you're done, review the diff in the sandbox and only carry over what you want.

> 💡 **Tip.** `--sandbox` + a worktree (Chapter 16) is the standard recipe for "I want to let Claude work autonomously without supervising." Two layers of isolation. Trivial to throw away. Real changes get explicitly merged back, never automatically.

## Permission Modes

You can also set a session-wide mode without editing `settings.json` for every command. The most common modes:

- **`default`**: ask before risky actions, allowlist applies.
- **`plan`**: Claude can read and think and propose, but cannot write or run anything. Excellent for design-first work (Chapter 9).
- **`acceptEdits`**: auto-approve file edits, still ask before bash commands. The sweet spot for many developers.
- **`bypassPermissions`**: same as `--dangerously-skip-permissions`. Be careful.

Switch modes inside a session with `Shift+Tab`, or set a default in `settings.json`:

```json
{
  "permissionMode": "default"
}
```

## KHCC and AIDI: The Non-Negotiable Rules

Everything in this chapter applies double inside KHCC. Some rules that are not up for negotiation when working with AIDI data:

- **Never allowlist anything that touches `aidi_catalog`.** Every Databricks SQL statement against the catalog deserves a human eyeball, every time.
- **Never allowlist anything that touches `dbo.eval_runs`** or other shared eval tables. A typo costs a baseline.
- **Always deny `.env`, `*.key`, `*.pem`, `credentials/**`.** No exceptions, no project, no excuses.
- **Always deny `data/patients/**`, `data/raw/**`, and any path that could contain raw PHI.** Pasted or read, it doesn't matter. Treat the deny list as the wall.
- **Never use `--dangerously-skip-permissions` on a Databricks driver** or any node with line of sight to the catalog. Headless work against AIDI goes through reviewed, gated jobs, not interactive YOLO.
- **Never log MRNs or names in plaintext.** Optimus-encode MRNs. Fernet-encrypt names. This isn't a permissions issue; it's a habit. But your settings should at least *deny* reading the raw-name CSVs that might exist locally during a one-off pull.

> ⚠️ **Warning.** A pipeline that silently skips a deceased patient because of a missing column is worse than a pipeline that crashes. The same logic applies to permissions: a permission check that silently auto-approves a destructive command is worse than one that interrupts you. When in doubt, gate it.

A starter `settings.json` for AIDI work looks roughly like this:

```json
{
  "permissionMode": "default",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(pytest:*)",
      "Bash(Rscript -e:*)",
      "Bash(ls:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./credentials/**)",
      "Read(./data/patients/**)",
      "Read(./data/raw/**)",
      "Read(./**/*.key)",
      "Read(./**/*.pem)",
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)",
      "Bash(git push -f:*)",
      "Bash(dbx deploy:*)",
      "Bash(databricks jobs run-now:*)"
    ]
  }
}
```

Adjust the allow list per project. The deny list is the floor — add to it, never subtract.

> 🔧 **Technical Stuff.** Patterns in `allow`/`deny` use a simple glob-like syntax. `Bash(git diff:*)` allows any `git diff` invocation; `Read(./.env.*)` matches `.env`, `.env.local`, `.env.production`. When in doubt, test by typing the command in Claude Code and seeing what it asks for. The prompt will tell you the exact rule to add.

## Try This

In any project you're already working in, run `/permissions` inside Claude Code and look at what's currently allowed. (If you've never configured this, the list will be empty.) Then ask Claude:

> Draft a `.claude/settings.json` with a sensible allow list for read-only git commands and pytest, and a deny list that blocks `.env`, `secrets/**`, `credentials/**`, `*.key`, `*.pem`, `rm -rf`, and `git push --force`. Show me the file before saving it.

Read what it produces. Adjust to taste. Save it. Commit it.

## Watch Out

Don't allowlist `Bash(*)`. People do this when the prompts get annoying. It defeats the entire system: you have just promoted Claude to root on your project. If you find yourself reaching for a wildcard allow, that's a signal that you should be in plan mode, not a signal that the allowlist needs to be looser. The constraint is the safety. Keep it.
