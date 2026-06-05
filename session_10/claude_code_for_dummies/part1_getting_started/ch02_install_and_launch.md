# Chapter 2: Installing and Launching

Five minutes from now you'll have Claude Code installed, authenticated, and waiting for its first prompt.

## The One-Line Install

Claude Code is distributed as an npm package. That means if you have Node.js 18 or newer, you have everything you need:

```bash
npm install -g @anthropic-ai/claude-code
```

That's it. One command. The `-g` flag installs globally, so `claude` becomes a command you can run from anywhere on your machine.

> 💡 **Tip.** Check your Node version first with `node --version`. If it says anything below 18, upgrade. The official Node site has installers for every platform, but if you already use a version manager (`nvm`, `fnm`, `volta`), use that instead. It's easier to swap versions later.

If you don't have Node at all yet, install it once and forget about it:

- **macOS:** `brew install node` (or download from nodejs.org)
- **Linux:** Your package manager (`apt install nodejs npm` on Ubuntu, `dnf install nodejs` on Fedora), or use `nvm`.
- **Windows:** Use **WSL2** (Windows Subsystem for Linux) and install Node inside Ubuntu. You *can* run Claude Code in native PowerShell, but WSL is closer to the environment every tutorial and skill is written against. Save yourself the headaches.

> ⚠️ **Warning.** Do not install Node as root with `sudo`. On a shared workstation or a Databricks driver node, that creates permission tangles you will spend an hour debugging later. Use `nvm` per user.

## Authenticating

The first time you run `claude`, you'll be walked through one of two auth flows:

1. **Claude account login.** If you have a Claude Pro or Max subscription, sign in with your account. Usage runs against your plan. This is the option you almost certainly want.
2. **API key.** Paste an Anthropic API key. Usage is metered per token. Good for headless servers and CI. Bad for casual interactive use, because you'll spend more thinking about cost than coding.

The login is a browser handshake: Claude Code prints a URL, you open it, you click approve, and the terminal picks up where it left off.

> 🧠 **Remember.** Most KHCC users want the Pro or Max subscription. The API key path is for the day you start running headless pipelines from a server (Chapter 17), not for your daily work.

## Your First Session

Open a terminal. Go to a project directory. Type:

```bash
claude
```

A welcome panel appears, the cursor blinks, and you are inside. Type:

> What is in this directory? Give me a one-paragraph summary.

Watch Claude run `Glob` and `Read`, then write you a short paragraph. Congratulations. You have used Claude Code.

## The Three Keystrokes That Matter Most

You can use Claude Code professionally with only three commands. Memorize these and ignore the rest until you need them.

- **`claude`**: open a new session in the current directory.
- **`Ctrl+C` twice**: exit. The first press cancels whatever Claude is doing right now. The second press closes the session. (Pressing it once will *not* close Claude Code by itself, which is by design.)
- **`/clear`**: wipe the current conversation and start fresh, without leaving the session. Use this between unrelated tasks. Context rot is real.

> 💡 **Tip.** When in doubt, `/clear`. A clean session beats a messy three-hour one every time. Free advice from people who have lived a messy three-hour session.

## `/help` and the Other Slash Commands

Inside Claude Code, anything starting with `/` is a built-in command. Type `/help` and you get the full list. The handful you'll meet in this chapter and the next:

- `/clear`: wipe the conversation.
- `/help`: list every slash command.
- `/cost`: show what this session has spent in tokens.
- `/model`: switch between Haiku, Sonnet, and Opus mid-session.
- `/permissions`: open the permissions panel (Chapter 4).
- `/statusline`: install a live HUD at the bottom of your terminal.

Don't try to learn all of them today. They will arrive one chapter at a time, in the order you actually need them.

## Resuming a Session

You closed your laptop. You went to a meeting. You came back. Now what?

```bash
claude --resume
```

You'll see a list of every previous session, organized by project and timestamp. Pick the one you want. Claude reloads the full conversation history and you pick up exactly where you left off: same files in context, same plan, same opinions about your code.

> 🧠 **Remember.** Sessions are saved automatically. You do not need to do anything to enable this. If you ever wonder "did I save that?", yes, you did.

This is how serious work actually happens with Claude Code. Almost nobody finishes a real project in one sitting. You build, you stop, you resume, you build, you stop. Treat sessions as resumable workspaces, not one-shot conversations.

## The `cc` Alias Trick (Handle With Care)

Power users get tired of typing `claude` and even more tired of approving every action. There is a famous shortcut, from Suryansh Tiwari's "40 Practices," that you'll see all over the internet:

```bash
alias cc='claude --dangerously-skip-permissions'
```

Add that to your `~/.zshrc` or `~/.bashrc`, run `source ~/.zshrc`, and now `cc` launches Claude Code in YOLO mode, with no permission prompts on any action.

It is fast. It is also exactly what its name says.

> ⚠️ **Warning.** Boris Cherny, the creator of Claude Code, has said publicly that he *never* uses `--dangerously-skip-permissions`. If the person who built the thing won't use that flag, you should think carefully before aliasing it as your default. Chapter 4 walks through the safer alternative, an allowlist in `settings.json`, that gets you most of the speed without the risk.

If you do want a shortcut alias, here is a less ruinous version:

```bash
alias cc='claude'
```

You save four keystrokes. You also still get to keep your filesystem.

## The `/statusline` HUD

Once your basics are working, run this inside a Claude Code session:

```
/statusline
```

It installs a small shell script that displays a live status line at the bottom of your terminal after every turn: current directory, git branch, model in use, percentage of context window consumed. It is the closest thing Claude Code has to a dashboard, and it pays for itself the first time you avoid blowing past your context limit.

## Installing on a Databricks Driver vs. a Personal Laptop

At KHCC, you are likely to install Claude Code in two very different places. The mechanics are the same. The expectations are not.

**On a personal laptop:**

- Standard `npm install -g`.
- Pro or Max subscription on your own KHCC SSO-linked Claude account.
- Use it for everything that doesn't touch patient data directly: local R analyses, dashboards, plot generation, building Django scaffolds, drafting policy documents, hammering on a `CLAUDE.md`.

**On a Databricks driver node (or any shared compute):**

- Install Node and Claude Code per-user, never as root.
- Authenticate with an **API key**, not interactive login. There is no browser on a driver node.
- Mount your code from a Databricks Repo, not from `/tmp`.
- Never paste patient identifiers into the conversation. Even on Databricks, the conversation transcript leaves the cluster.
- Treat the driver as a production-adjacent surface. The `aidi_catalog` is one accidental SQL statement away from a long Monday.

> ⚠️ **Warning.** On any shared environment touching real cohort data, install Claude Code in **plan mode** or behind an allowlist. The right default on a Databricks driver is "ask before everything." See Chapter 4.

> 🔧 **Technical Stuff.** If you want Claude Code in a Databricks notebook cell instead of the driver shell, you can, but the experience is awkward. The terminal is the native habitat. Use `%sh` cells only for one-off `claude -p` headless calls (Chapter 17), not for interactive work.

## Try This

Install Claude Code on your laptop right now. Authenticate. Then `cd` into any project folder and type:

```bash
claude
```

When the cursor appears, type:

> /statusline

Approve the script when it asks. Then type `/help` and read the list of available commands once, slowly. Then `/clear`. Then exit with `Ctrl+C` twice.

You have now used six different controls in Claude Code. You are ahead of 80% of people who downloaded it.

## Watch Out

Don't add `alias cc='claude --dangerously-skip-permissions'` to your shell config on day one. It is the single most common reason new users wreck a working repo in their first week. Build the habit of seeing permission prompts before you build the habit of skipping them. The flow you save is not worth the file you lose.
