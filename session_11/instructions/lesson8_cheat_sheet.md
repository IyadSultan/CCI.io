---
layout: page
title: "Lesson 8: Cheat Sheet + What to Build Next"
permalink: /session_11/instructions/lesson8_cheat_sheet/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 8 — Cheat Sheet + What to Build Next

*15 minutes. The one-page reference you keep open the next time you build, plus where to go from here.*

You started this session unable to write a line of HTML. You are ending it with a clinical web application live on the internet that you built, extended, and deployed. Between those two points you crossed the entire web stack. This lesson pins it all to one page, and points at what comes next.

> 🧠 **Remember.** You do not need to memorize any of this. You need to *recognize* it — to know the thing exists and roughly where it goes — so that when you sit down to build, you know what to look up. Recognition, not recall, is the working developer's skill.

## The whole stack on one page

```
  FRONTEND (browser)              BACKEND (server)              DATABASE
  ─────────────────               ────────────────              ────────
  HTML    = structure             Python + Django               rows & tables
  CSS     = appearance            URL → view → template         Patient
  JS      = behavior              models, forms, services       TriageEvent
  React   = (frameworks,          deterministic logic here
            for complex UIs)      secrets live here
```

The one rule that organizes it all: **display and interaction go in the frontend; data and trusted logic go in the backend.** Validate on the backend. Keep secrets on the backend. Never let the browser be the law.

## HTML — the tags you'll reuse

| Tag | Job |
|---|---|
| `<h1>`…`<h6>` | Headings |
| `<p>` | Paragraph |
| `<ul>` / `<li>` | List / list item |
| `<a href="...">` | Link |
| `<form>` / `<input>` / `<button>` | Form, field, button |
| `<strong>` | Bold / important |

Every page = `<!DOCTYPE html>` → `<html>` → `<head>` (title, styling) + `<body>` (what you see).

## Django — the commands

```bash
django-admin startproject mysite .   # create the PROJECT (whole site)
python manage.py startapp triage     # create an APP (one feature)
python manage.py runserver           # run locally at 127.0.0.1:8000
python manage.py migrate             # apply model changes to the database
python manage.py makemigrations      # record model changes
python manage.py createsuperuser     # make an admin login
python manage.py test                # run the tests
```

## Django — the file map

| File | Project / App | Job |
|---|---|---|
| `manage.py` | project | Run every command |
| `settings.py` | project | `INSTALLED_APPS`, database, config |
| `urls.py` (project) | project | Master URL map (`include()` each app) |
| `urls.py` (app) | app | The app's own routes |
| `views.py` | app | Python that runs on a request |
| `models.py` | app | Data definitions → database tables |
| `forms.py` | app | Form fields + backend validation |
| `templates/<app>/*.html` | app | HTML pages with `{{ slots }}` |
| `services/` | app | Business logic (kept out of views) |

## The loop for adding any feature

```
1. python manage.py startapp <name>     (only if it's its own feature)
2. add "<name>" to INSTALLED_APPS        ← the step everyone forgets
3. write the view        (views.py)
4. write the template    (templates/<name>/<name>.html)
5. wire the URL          (app urls.py + project include)
```

## Template syntax you'll see

```django
{{ variable }}                      slot filled by the backend
{% for x in items %}...{% endfor %} loop
{% if cond %}...{% else %}...{% endif %}  branch
{% url 'name' %}                    link to a named route (never hardcode)
{% extends "triage/base.html" %}    inherit a shared frame
{% block content %}...{% endblock %} fill a block in the parent
```

## Deploy to Render — the checklist

```
□ requirements.txt lists every package
□ .gitignore excludes .env, db.sqlite3, .venv   (NEVER commit secrets)
□ build.sh:  pip install → collectstatic → migrate
□ start command:  gunicorn er_triage.wsgi:application
□ DEBUG = False in production
□ ALLOWED_HOSTS includes the host (Render adds it automatically)
□ SECRET_KEY, OPENAI_API_KEY, FERNET_KEY set as env vars in the dashboard
□ git push  →  Render auto-deploys
```

## What you built

The **ER Triage Extractor**: a two-screen Django app (nurse form + doctor queue), a deterministic acuity calculator, a gracefully-degrading LLM extractor on a closed set of oncologic emergencies, PHI protected with MRN encoding and name encryption — extended with a dashboard you added yourself, and deployed live on Render. That is a real full-stack clinical application, shipped.

## What to build next

Three directions, in rising order of ambition:

1. **Harden this app.** Add the authentication it deliberately lacks (Django's built-in login). Add the "recall last triage" and emergency-only views from the Lesson 6 *Try This*. Move the database to Render Postgres.
2. **Build your own.** Pick a one-screen tool your unit actually needs — a handoff board, a protocol lookup, a simple intake form that emails the result — and run the five-step loop end to end. Small and shipped beats large and theoretical.
3. **Connect the chain.** This is the deployment half of the Session 10 Software Factory. Use Claude Code's agents to build the *next* feature of this app through the pipeline, then deploy it with what you learned today. PRD → build → ship, the whole arc, by yourself.

## Where this sits in the course

Session 10 built software. Session 11 shipped it. **Session 12 makes it safe** — PHI de-identification, audit logging, API-key hygiene, the governance that stands between a teaching demo and a tool that touches a real patient. Everything you deployed today on a hobby tier with no auth is exactly what Session 12 will teach you to do *responsibly*. Hold the excitement of a live URL next to the discipline of governance; a clinical AI developer needs both hands.

## Exit ticket

Answer in two or three sentences for yourself:

1. Name one thing that belongs on the backend and explain why it cannot live in the browser.
2. You added a `billing` app and `/billing/` shows nothing. List the first two files you would check.
3. What is the single most important file to keep *out* of GitHub, and why?

If those come easily, you have the session. You crossed the whole stack — from a text file your browser draws, to an app the world can open. Go build something your unit needs.
