# Introduction

So there you are, staring at a black terminal window with a blinking cursor, wondering how anyone is supposed to get useful work out of *this*. Somebody told you Claude Code was going to change how you build software — that it could write whole features while you slept, refactor legacy pipelines on a Friday afternoon, and free up half your week. And maybe they're right. But right now, all you see is a cursor.

This book is the bridge between that blinking cursor and the version of you who ships software the way modern engineers ship it: with an agent doing the keystrokes, and your brain doing the deciding.

## About This Book

*Claude Code For Dummies* is a working clinician's guide to Anthropic's coding agent. It assumes you have a job to do — extract pathology from notes, build a Cockcroft-Gault calculator, plot some KDIGO trajectories, ship a Django dashboard for the chemotherapy unit — and that Claude Code is a tool, not a hobby.

The book is organized so you can read it cover to cover in a weekend, or jump to whichever chapter solves the problem in front of you. Each chapter is short. Each one ends with a "Try This" exercise and a "Watch Out" warning. Examples are drawn from real KHCC work — AIDI pipelines, clinical extractions, R analyses, Django apps — but every pattern works on any codebase.

We cover:

- **Part 1** — what Claude Code actually is, how to install it, how to talk to it, and how to keep it from doing anything you'll regret.
- **Part 2** — your daily workflow: files, context, money, git, and how to make Claude *think* before it codes.
- **Part 3** — the customization layer: `CLAUDE.md`, slash commands, skills, subagents, and hooks. This is where Claude Code goes from useful to indispensable.
- **Part 4** — pushing the limits: MCP servers, parallel worktrees, headless automation, and Ralph loops that run for hours while you sleep.
- **Part 5** — the *For Dummies* signature **Part of Tens**: ten clinical workflows, ten rookie mistakes, ten slash commands worth memorizing, ten lines for your `CLAUDE.md`.

Two appendices close the book: a one-page cheat sheet, and a short tour of the Claude Agent SDK for readers who want to build agents of their own.

## Foolish Assumptions

I assume:

- You have a laptop running macOS, Linux, or Windows (WSL works fine).
- You can write a *little* code — enough to read a Python function and tell when it's wrong.
- You have an Anthropic account, or you're willing to make one. (Pricing is covered in Chapter 7.)
- You're allergic to wasted time.

I do **not** assume you've used a coding agent before, that you know what an MCP server is, or that you've ever lived in a terminal. If any of those things sound familiar, you'll move faster. If they don't — welcome. You'll be fine.

## Icons Used in This Book

In the great tradition of the yellow-and-black tribe, this book uses four icons in the margins to flag the four kinds of paragraph that matter most.

> 💡 **Tip.** A shortcut, a keystroke, or a settings tweak that will save you time. Read these even when you're skimming.

> 🧠 **Remember.** A concept you'll use repeatedly. If you forget the rest of the chapter, hold onto these.

> ⚠️ **Warning.** Things that have cost real people real money, real data, or real sleep. Read every single one.

> 🔧 **Technical Stuff.** Optional plumbing. Safe to skip on first read; useful when you go to debug.

## Beyond the Book

Two things travel with you:

1. **The cheat sheet** in Appendix A. Print it. Tape it to your monitor. Stop alt-tabbing.
2. **A `CLAUDE.md` starter** in Chapter 10. Copy it into every new project before you write a single line of code.

## A Note on Style

You will sometimes catch the author being opinionated. Things like "don't use `--dangerously-skip-permissions` until you understand what you're allowing" or "do not let Claude touch the deceased-patient eval cohort." These are not arbitrary preferences. They are scars. They come from real production pipelines at a real cancer center, where a silent failure can mean a patient missing from an AKI alert run. When you see a strong opinion in this book, it is there because somebody, somewhere, paid for it. You're inheriting the discount.

## Where to Go from Here

If you've never opened Claude Code, **start at Chapter 1**.

If you've used Claude Code a little but feel like you're still typing into a void, **start at Part 3** — the customization chapters are where most casual users have left value on the table.

If you came to learn how to build long-running autonomous agents, **skip to Chapter 18 and Appendix B**.

If you just want the shortcuts, **flip to Appendix A**, then come back when something stops making sense.

Let's go.
