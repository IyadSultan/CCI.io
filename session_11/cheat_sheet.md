---
layout: page
title: Session 11 Cheat Sheet
permalink: /session_11/cheat_sheet/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
.post-header{display:none!important}
</style>

# CCI Session 11 — Cheat Sheet

*From a web page to a deployed clinical app. Keep this open the next time you build.*

---

## The stack in one picture

```
  FRONTEND (browser)              BACKEND (server)              DATABASE
  HTML  = structure               Python + Django               rows & tables
  CSS   = appearance              URL → view → template          Patient
  JS    = behavior                models · forms · services      TriageEvent
  React = (frameworks)            deterministic logic + secrets
```

**The one rule:** display & interaction → frontend. Data & trusted logic & secrets → backend. *Validate on the backend. Never trust the browser.*

---

## HTML essentials

```html
<!DOCTYPE html>
<html>
<head><title>Tab title</title></head>
<body>
  <h1>Heading</h1>          <p>Paragraph</p>
  <ul><li>Item</li></ul>    <a href="url">Link</a>
  <form>
    <input type="text">  <input type="number">  <button>Submit</button>
  </form>
</body>
</html>
```

HTML = structure · CSS = looks · JavaScript = behavior. A page that "does nothing" on click needs JavaScript.

---

## Django commands

| Command | Does |
|---|---|
| `django-admin startproject mysite .` | Create the **project** (whole site) |
| `python manage.py startapp triage` | Create an **app** (one feature) |
| `python manage.py runserver` | Run locally → `127.0.0.1:8000` |
| `python manage.py makemigrations` | Record model changes |
| `python manage.py migrate` | Apply changes to the database |
| `python manage.py createsuperuser` | Make an admin login |
| `python manage.py test` | Run the tests |

---

## Django file map

| File | Job |
|---|---|
| `manage.py` | Run every command |
| `settings.py` | `INSTALLED_APPS`, database, config |
| `urls.py` (project) | Master map — `include()` each app |
| `urls.py` (app) | The app's own routes |
| `views.py` | Python that runs on a request |
| `models.py` | Data → database tables |
| `forms.py` | Fields + backend validation |
| `services/` | Business logic, out of the view |
| `templates/<app>/x.html` | HTML with `{{ slots }}` |

---

## The loop for adding any feature

```
1. python manage.py startapp <name>     (if it's its own feature)
2. add "<name>" to INSTALLED_APPS        ← the forgotten step
3. write the view        (views.py)
4. write the template    (templates/<name>/<name>.html)
5. wire the URL          (app urls.py + project include)
```

---

## Template tags

{% raw %}
```django
{{ variable }}                              fill a slot
{% for x in items %} ... {% endfor %}        loop
{% if c %} ... {% else %} ... {% endif %}    branch
{% url 'name' %}                             link by route name (never hardcode)
{% extends "triage/base.html" %}             inherit a frame
{% block content %} ... {% endblock %}        fill a block
```
{% endraw %}

---

## Deploy to Render — checklist

```
□ requirements.txt lists every package
□ .gitignore excludes .env, db.sqlite3, .venv   ← NEVER commit secrets
□ build.sh:  pip install  →  collectstatic  →  migrate
□ start command:  gunicorn er_triage.wsgi:application
□ DEBUG = False   in production
□ ALLOWED_HOSTS includes the host (Render adds its own automatically)
□ SECRET_KEY / OPENAI_API_KEY / FERNET_KEY set as env vars in the dashboard
□ git push  →  Render auto-deploys
```

`runserver` is for your laptop. **gunicorn** serves real traffic. **whitenoise** + `collectstatic` serve CSS/JS in production.

---

## Two failure modes that catch everyone

1. **New Django feature does nothing** → you forgot `INSTALLED_APPS`, or the template path isn't `app/templates/app/file.html`.
2. **App breaks on Render but not locally** → `DEBUG`, `ALLOWED_HOSTS`, a missing package in `requirements.txt`, or a secret not set as an env var.

---

## PHI line (carry it into Session 12)

A public URL + real patient data = a different universe. It needs **auth, audit logging, de-identification, and governance sign-off** — none of which this teaching app has. Ship demos freely; ship patient data only through the front door governance builds.

---

*CCI · Session 11 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*
