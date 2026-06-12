---
layout: page
title: "Lesson 3: The Full Stack — Frontend, Backend, and Where Django Lives"
permalink: /session_11/instructions/lesson3_full_stack/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 3 — The Full Stack: Frontend, Backend, and Where Django Lives

*20 minutes. No code this lesson — this is the mental model that makes everything after it click. By the end you will be able to draw the path a triage form takes from a nurse's screen to a database and back, and say exactly which part Django is.*

Everything you built in Lessons 1 and 2 ran in one place: the browser, on the user's own machine. That has a hard limit you already bumped into. Close the tab and the data is gone. Type a password and anyone can read it. The browser is a great place to *show* things and *react* to clicks — and a terrible place to *keep* things or *guard* secrets.

So where does the patient list actually live? Where does the triage you submitted get stored so the doctor on the next shift can see it? Not in the browser. On a **server** — a computer somewhere else, running all the time, that holds the data and the trustworthy logic. The browser half is the **frontend**. The server half is the **backend**. Together they are the **full stack**.

> 🧠 **Remember.** **Frontend** = runs in the browser, on the user's screen, for *display and interaction*. **Backend** = runs on a server you control, for *data and trusted logic*. The art of web development is knowing which work goes where.

## The request/response cycle

The two halves talk through a simple, relentless ritual: **request and response.**

1. The nurse's browser sends a **request** to the server: *"here is a completed triage form"* (or just *"show me the queue"*).
2. The server **receives** the request, does its work — validates the data, runs the acuity rule, saves a row to the database, asks the LLM about oncologic emergencies.
3. The server sends back a **response**: a finished HTML page (the confirmation screen), or a redirect to another page.
4. The browser **draws** the response.

Every single thing that happens on every website is some version of this loop. Click a link: request → response. Submit a form: request → response. Refresh the queue: request → response. The browser asks; the server answers; the browser draws the answer. Billions of times a second, all day, everywhere.

A clinical walkthrough — the exact app you meet in Lesson 5:

```
  NURSE'S BROWSER                    SERVER (backend)                 DATABASE
  (frontend)
  ┌──────────────┐                 ┌──────────────────┐            ┌──────────┐
  │ triage form  │ ── request ──►  │ 1. validate form │            │          │
  │ (HTML+JS)    │   "here's a     │ 2. compute acuity│ ── save ─► │ Patient  │
  │              │    patient"     │ 3. ask the LLM   │            │ Triage   │
  │              │                 │ 4. save the row  │ ◄── read ─ │ Event    │
  │ confirmation │ ◄─ response ──  │ 5. render reply  │            │          │
  │ page         │   "acuity 1,    │                  │            │          │
  └──────────────┘    flag set"    └──────────────────┘            └──────────┘
```

The acuity calculation lives on the server — step 2 — exactly because of the warning from Lesson 2: clinical logic the user must not be able to rewrite belongs on the backend. The browser only shows the result.

## A short history, so Django feels familiar

This frontend/backend split is not new. It is one of the oldest patterns in software, and Django sits in a long lineage.

In the late 1990s and 2000s, the dominant way to build a data-driven site was to have the server *assemble the HTML page on each request* and send the finished page to the browser. Microsoft called their version **Active Server Pages (ASP)**; the PHP language did the same thing and powered (still powers) an enormous share of the web, Wikipedia and early Facebook among them. The shape was always identical: a request comes in, server code runs, the server stitches together an HTML page with the right data baked in, and ships it back.

**Django is this pattern, done well, in Python.** A request for `/triage/new` arrives; Django runs your Python code; your code pulls data from the database, drops it into an HTML template, and sends the finished page back. This is called **server-side rendering**, and it is exactly what ASP and PHP pioneered. Django is not a novelty to fear — it is a mature, batteries-included expression of a thirty-year-old idea.

> 🔧 **Technical Stuff.** You may wonder how this squares with React from Lesson 2. Two philosophies: **server-rendered** (Django, ASP, PHP) — the server sends finished HTML, the way we will work. **Client-rendered** (a React "single-page app") — the server sends a near-empty page plus a big bundle of JavaScript, and the browser builds the screen, fetching raw data as needed. Both are valid. For clinical internal tools, server-rendered is simpler, faster to ship, and easier to secure — which is why this course uses Django's server rendering.

## What Django actually is

Django is a **backend web framework** for Python. "Framework" means it hands you, pre-built, all the parts every data-driven site needs so you do not reinvent them:

- A way to define your data (the **models** — `Patient`, `TriageEvent`) and a database to store it, with no SQL to write by hand.
- A way to map URLs to Python functions (the **URL router** — `/triage/new` runs *this* function).
- A way to run your logic on each request (the **views** — the Python that validates, computes, saves).
- A way to build HTML pages with data slotted in (the **templates**).
- A free admin interface, user accounts, security protections, and more, in the box.

You will meet each of these by name in Lesson 4, in the smallest possible Django app, and then see them all working together in the real ER-triage app in Lesson 5.

> 💡 **Tip.** Hold this single sentence and the rest of the session is downhill: **Django is the backend — it receives the request, runs Python, reads and writes the database, and renders the HTML page that goes back to the browser.** Everything else is detail.

## The whole stack, named

Putting the vocabulary in one place:

| Layer | Lives | Made of | In our app |
|---|---|---|---|
| **Frontend** | The browser | HTML, CSS, JavaScript | The triage form, the queue table |
| **Backend** | A server | Python + Django | Validation, acuity rule, LLM call, saving |
| **Database** | With the server | Rows and tables | `Patient` and `TriageEvent` records |

When we "deploy" in Lesson 7, what we are really doing is *putting the backend and database on a computer that is always on and reachable from the internet* — so the request/response cycle works for anyone, not just for you on `localhost`. Render is that always-on computer.

## Try This

No code. Draw it. On paper or a whiteboard, sketch the request/response diagram from this lesson for a different action: **the on-call doctor opening the queue.** What does the browser request? What does the server do (does it write to the database, or only read)? What comes back? If you can draw that loop without looking, you understand the stack.

Then, for each item below, decide: **frontend, backend, or database?**
1. Checking that a temperature is a number before sending it.
2. The official acuity score that goes in the record.
3. The list of every patient triaged today.
4. Turning a button blue when the mouse hovers over it.
5. The OpenAI API key.

*(Answers: 1 — frontend convenience, but re-checked on the backend; 2 — backend; 3 — database, read by the backend; 4 — frontend; 5 — backend, never the frontend, because the browser can be read.)*

## Watch Out

The most expensive mistake in clinical web apps is putting backend work in the frontend. Two versions of it, both real:

- **Trusting the browser.** If your acuity rule or your validation runs only in JavaScript, a user — or a bug, or a copy-paste into the wrong field — can bypass it. Anything that must be true *has to be enforced on the backend.* The frontend version is a courtesy; the backend version is the law.
- **Leaking a secret.** Anything sent to the browser can be read by anyone, full stop. An API key, a database password, another patient's data not meant for this user — if it reaches the frontend, it is exposed. Secrets and other patients' PHI stay on the backend.

Keep those two lines bright and most security mistakes never happen. You now have the map. Next lesson, we build the smallest real backend that exists: a Django app you can run.
