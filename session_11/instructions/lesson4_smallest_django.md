---
layout: page
title: "Lesson 4: The Smallest Django That Runs"
permalink: /session_11/instructions/lesson4_smallest_django/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 4 — The Smallest Django That Runs

*25 minutes. By the end you will have created a Django project from nothing, written one page, and seen it in your browser — and you will know what every file is for.*

In Lesson 3 you learned what Django *is*: the backend that receives a request, runs Python, and sends back an HTML page. Now you build one. We are going to make the smallest Django site that exists — a single page that says hello — because the goal here is not the page. The goal is to demystify the **skeleton**, so that when you open the real ER-triage app in Lesson 5, every file already has a name and a job.

> 🧠 **Remember.** Two words you must not mix up. A Django **project** is the whole website (its settings, its database config). A Django **app** is one feature *inside* the project (triage, billing, dashboard). One project contains many apps. We will create one of each and watch the difference.

## Setup — a folder and a virtual environment

Open a terminal. We do the same dance you learned in Session 9: a fresh folder, a virtual environment, an install.

```bash
mkdir hello_django && cd hello_django
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install django
```

The `(.venv)` that appears in your prompt means the virtual environment is active — Python packages you install now live in this folder and do not pollute the rest of your machine. This is the same hygiene from Session 9; Django is just another package.

## Create the project, then the app

Two commands create the skeleton. Read what each one makes.

```bash
django-admin startproject mysite .
python manage.py startapp pages
```

The trailing dot in the first command matters — it means "create the project *here*, in this folder," rather than nesting another folder. After both commands, you have:

```
hello_django/
├── manage.py            ← your control panel: you run every command through this
├── mysite/              ← the PROJECT
│   ├── settings.py      ←   all configuration (which apps, which database)
│   ├── urls.py          ←   the master URL map
│   └── wsgi.py          ←   the entry point a real server uses (Lesson 7)
└── pages/               ← the APP (one feature)
    ├── views.py         ←   the Python that runs on a request
    ├── models.py        ←   the data definitions (empty for now)
    └── ...
```

Run it immediately, before writing a line of code:

```bash
python manage.py migrate          # sets up the starter database
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. You get Django's friendly "the install worked" rocket page. **You are running a backend.** `runserver` started a small web server on your machine; `127.0.0.1` (also called `localhost`) means "this very computer." Stop the server any time with Ctrl-C.

> 💡 **Tip.** `manage.py` is how you talk to your project. Every Django command is `python manage.py something` — `runserver`, `migrate`, `startapp`, `test`. When you see those in Lesson 5, you now know `manage.py` is the control panel they go through.

## Wire one page — the three moves

Right now the `pages` app exists but does nothing. To serve a page, Django needs three things, and they are the same three things *every* Django page needs. Learn the pattern once.

**Move 1 — register the app.** Open `mysite/settings.py`, find `INSTALLED_APPS`, and add your app:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    # ... the built-in ones ...
    "pages",          # ← our app
]
```

This line is how the project knows the app exists. **Memorize this step** — it is literally the whole of Lesson 6. Adding a feature to a Django project always includes "register it in `INSTALLED_APPS`."

**Move 2 — write a view.** A *view* is a Python function that takes a request and returns a response. Open `pages/views.py`:

```python
from django.http import HttpResponse


def home(request):
    return HttpResponse("<h1>Hello, KHCC</h1><p>My first Django page.</p>")
```

That is a backend in miniature: a request comes in, the function runs, it returns HTML. (Real views return rendered templates, not a raw string — we will do that next — but this is the essence.)

**Move 3 — connect a URL.** Django needs to know *which URL* runs that view. Open `mysite/urls.py` and wire the root URL to your `home` view:

```python
from django.contrib import admin
from django.urls import path
from pages.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home),          # the empty path "" is the homepage
]
```

Save everything, run `python manage.py runserver`, and refresh `http://127.0.0.1:8000/`. Your "Hello, KHCC" page appears. **You wrote a backend page.** Request came in for `/`, the URL router sent it to `home`, the view returned HTML, the browser drew it — the exact request/response cycle from Lesson 3, now in your own code.

> 🧠 **Remember.** The three moves — **register the app, write the view, connect the URL** — are the rhythm of all Django work. URL → view → response. Everything else is more elaborate versions of these three.

## One step better — a real template

Returning HTML as a Python string gets ugly fast. The right way is a **template**: an HTML file with slots for data. Make the folder and file `pages/templates/pages/home.html`:

{% raw %}
```html
<!DOCTYPE html>
<html>
<head><title>Hello</title></head>
<body>
  <h1>Hello, {{ name }}</h1>
  <p>Rendered by Django from a template.</p>
</body>
</html>
```
{% endraw %}

That `{{ name }}` is a **template variable** — a slot the backend fills in. Now change the view to render the template and pass it a value:

```python
from django.shortcuts import render


def home(request):
    return render(request, "pages/home.html", {"name": "KHCC"})
```

Refresh. Same page, but now the HTML lives in a proper `.html` file and the `{{ name }}` slot was filled with `"KHCC"` by the backend. **This is server-side rendering** — the exact pattern from Lesson 3, the exact pattern the ER-triage app uses for every screen. The data (`"KHCC"`) is decided by Python on the server and baked into the HTML before it is sent.

> 🔧 **Technical Stuff.** Why the doubled folder, `pages/templates/pages/`? Django searches every app's `templates/` folder and pools them together. If two apps both had a `home.html`, they would collide. Namespacing each template under its app's name (`pages/home.html`) keeps them distinct. It looks redundant; it prevents real bugs. The ER-triage app does exactly this: `triage/templates/triage/nurse_form.html`.

## The map you now hold

Every file you touched, and why:

| File | Project or App | Its job |
|---|---|---|
| `manage.py` | project | Run every command |
| `mysite/settings.py` | project | `INSTALLED_APPS`, database, config |
| `mysite/urls.py` | project | Master URL map |
| `pages/views.py` | app | Python that runs on a request |
| `pages/templates/pages/home.html` | app | The HTML page with data slots |
| `pages/models.py` | app | Data definitions (empty here; full in the real app) |

That table *is* the ER-triage app, only larger. When you open it next lesson, you will recognize every file.

## Try This

1. Add a second page. Write a new view `about(request)` that renders a template saying something about your unit, and wire it to `path("about/", about)` in `urls.py`. Visit `/about/`.
2. In your `home.html`, add a link to the about page: `<a href="/about/">About</a>`. Click between them. You have a two-page site.
{% raw %}
3. Pass a list to a template: `render(request, "pages/home.html", {"vitals": ["HR", "BP", "Temp"]})`, and in the template loop over it with `{% for v in vitals %}<li>{{ v }}</li>{% endfor %}`. This `{% for %}` tag is exactly how the doctor queue lists patients.
{% endraw %}

## Watch Out

Three beginner snags, all common, all quick to fix:

- **Server not restarting changes.** Django's `runserver` reloads most edits automatically, but if a change does not show, stop it (Ctrl-C) and start it again. When truly confused, restart the server before you debug anything else.
- **`TemplateDoesNotExist`.** Almost always the doubled-folder path is wrong. The file must be at `pages/templates/pages/home.html`, and the app must be in `INSTALLED_APPS`. Check both.
- **Forgetting to activate the venv.** New terminal? You must `source .venv/bin/activate` again, or `python` will not find Django. The `(.venv)` in your prompt is the tell.

You have built a Django backend from zero and you can name every part. Next lesson we open a real one — the ER-triage app — and you will find nothing in it you have not already met in miniature.
