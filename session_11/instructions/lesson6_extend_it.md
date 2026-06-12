---
layout: page
title: "Lesson 6: Extend It — Add Your Own Django App"
permalink: /session_11/instructions/lesson6_extend_it/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 6 — Extend It: Add Your Own Django App

*30 minutes. The core lab of the session. By the end you will have added a brand-new screen — a dashboard — to the ER-triage app, as a new Django app you registered yourself.*

You can run the app and you can read it. Now you change it. This is the moment the whole session has been climbing toward, and it is the most realistic thing you will do all course: you are handed a working application and asked to *add a feature* — not build from scratch, but extend. That is 90% of real software work. Someone says "the app is great, can it also show me X?" and you make it so.

Our X: a **dashboard**. The doctor queue shows individual patients. The unit manager wants the *shape* of the queue — how many patients at each acuity level, how many oncologic emergencies flagged today. One new read-only screen. We will build it the proper Django way: as a **new app** inside the project.

> 🧠 **Remember.** A new feature that is conceptually its own thing gets its own Django *app*. The dashboard is not part of triage — it is a different view onto the same data — so it earns its own app. This is the project/app distinction from Lesson 4, used in anger.

## Start from the ready-made app

Work from your running copy of `er_triage` from Lesson 5 (or clone it fresh with `git clone https://github.com/IyadSultan/er_triage.git` and run `migrate`, `seed_demo`). Make sure it runs and you can see the queue before you change anything. **Always start a change from a working state** — so that when something breaks, you know your change caused it.

## Step 1 — create the app

One command, the same one from Lesson 4:

```bash
python manage.py startapp dashboard
```

A new `dashboard/` folder appears next to `triage/`, with the familiar empty files (`views.py`, `models.py`, etc.). The app *exists on disk* — but the project does not know about it yet. That is the next step, and it is the step people forget.

## Step 2 — register it in INSTALLED_APPS

This is the line you memorized in Lesson 4. Open `er_triage/settings.py`, find `INSTALLED_APPS`, and uncomment / add the dashboard:

```python
INSTALLED_APPS = [
    # ... built-in apps ...
    "triage",
    "dashboard",          # ← the app you just created
]
```

That single line is what connects your new app to the project. Without it, nothing in `dashboard/` will ever run. **If your dashboard mysteriously does nothing later, this is the first place to look.**

## Step 3 — write the view

The dashboard reads existing `TriageEvent` data and counts it up. It creates *no new data and no new model* — it is a new lens on data the triage app already collects. Open `dashboard/views.py` and write:

```python
from collections import Counter

from django.db.models import Count
from django.shortcuts import render

from triage.models import TriageEvent          # reuse the triage app's model


def dashboard_view(request):
    events = TriageEvent.objects.all()
    total = events.count()

    # Count events per acuity level (1..5), filling zeros for empty levels.
    by_acuity_raw = dict(
        events.values_list("acuity").annotate(n=Count("id")).values_list("acuity", "n")
    )
    by_acuity = [{"acuity": a, "count": by_acuity_raw.get(a, 0)} for a in range(1, 6)]

    # Tally each oncologic-emergency flag across all events.
    flag_counter = Counter()
    for flags in events.values_list("oncologic_emergency_flags", flat=True):
        flag_counter.update(flags or [])

    context = {
        "total": total,
        "by_acuity": by_acuity,
        "emergencies": sorted(flag_counter.items(), key=lambda kv: -kv[1]),
        "emergency_total": sum(flag_counter.values()),
        "max_count": max([row["count"] for row in by_acuity] + [1]),
    }
    return render(request, "dashboard/dashboard.html", context)
```

The one new idea is `from triage.models import TriageEvent` — your dashboard app *reaches into* the triage app to read its model. Apps in the same project can use each other's models freely. That is the payoff of the project/app structure: features stay in their own folders but share one database. The rest is plain Python counting, plus Django's `.count()` and `.annotate()` for asking the database to total things for you.

## Step 4 — the template

Make the file `dashboard/templates/dashboard/dashboard.html` (the doubled-folder pattern from Lesson 4). It `extends` the triage app's `base.html` so it inherits the same header and styling — another example of apps sharing:

{% raw %}
```html
{% extends "triage/base.html" %}
{% block title %}Dashboard{% endblock %}

{% block content %}
<h1 class="text-2xl font-bold mb-1">Triage dashboard</h1>

<div class="grid sm:grid-cols-3 gap-4 mb-8">
  <div class="bg-white rounded-lg shadow p-5">
    <p class="text-slate-500 text-sm">Total triages</p>
    <p class="text-4xl font-bold">{{ total }}</p>
  </div>
  <div class="bg-white rounded-lg shadow p-5">
    <p class="text-slate-500 text-sm">With emergency flag</p>
    <p class="text-4xl font-bold text-red-600">{{ emergency_total }}</p>
  </div>
</div>

<div class="bg-white rounded-lg shadow p-5">
  <h2 class="font-semibold mb-4">Patients by acuity</h2>
  {% for row in by_acuity %}
    <div class="flex items-center gap-3 mb-2">
      <span class="w-16 text-sm">Acuity {{ row.acuity }}</span>
      <div class="flex-1 bg-slate-100 rounded h-6">
        <div class="h-6 rounded bg-blue-500" style="width: {% widthratio row.count max_count 100 %}%"></div>
      </div>
      <span class="w-8 text-right font-semibold">{{ row.count }}</span>
    </div>
  {% endfor %}
</div>
{% endblock %}
```
{% endraw %}

{% raw %}
`{% extends %}` and `{% block %}` are how templates share a frame: the base file defines the header and a `content` block; this file fills that block in. `{% for row in by_acuity %}` is the loop you already know. `{% widthratio %}` is a small Django helper that turns a count into a bar width. (The full solution adds a styled emergencies list too — see `templates/solutions/er_triage_app_with_dashboard/`.)
{% endraw %}

## Step 5 — connect the URL

Two small wirings, mirroring Lesson 4 and the `include` pattern from Lesson 5.

First, give the dashboard app its own `urls.py` — create `dashboard/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard_view, name="dashboard"),
]
```

Then tell the *project* to delegate a URL prefix to it. Open `er_triage/urls.py` and add the include:

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("triage.urls")),
    path("dashboard/", include("dashboard.urls")),   # ← your new app
]
```

Now `/dashboard/` routes into your app. Save everything, run `python manage.py runserver`, and open `http://127.0.0.1:8000/dashboard/`.

**There it is** — your dashboard, counting the seeded patients by acuity, built as an app you created, registered, and wired yourself.

{% raw %}
> 💡 **Tip.** Add a link to it so people can find it. Open `triage/templates/triage/base.html` and add one line to the nav:
> ```html
> <a href="{% url 'dashboard' %}" class="hover:underline">Dashboard</a>
> ```
> `{% url 'dashboard' %}` looks up the URL by the `name=` you gave it — never hardcode the path.
{% endraw %}

## What you just practiced

Step back and name the loop, because you will run it for every feature you ever add to a Django project:

1. `startapp` — create the app.
2. `INSTALLED_APPS` — register it.
3. **view** — write the Python.
4. **template** — write the HTML.
5. **url** — wire it in (app `urls.py` + project `include`).

That is the entire rhythm of extending a Django application. The dashboard was a gentle example — read-only, no new data — but the loop is identical for a feature that *writes* data; you would just add a model and a form, exactly as the triage app has.

## Try This

Add a *second* feature on your own, the same five-step way. Pick one:

- **Recall the last triage.** A page at `/triage/recall` that shows the single most recent `TriageEvent` (hint: `TriageEvent.objects.order_by("-timestamp").first()`). This can live in the `triage` app — not every feature needs a new app; a new *screen within an existing feature* is just a new view + url + template.
- **Emergencies-only queue.** A dashboard page listing only the events that have an emergency flag.
- **Today's count.** Add a card to the dashboard showing how many triages happened today.

Run the five steps from memory. That fluency — not the dashboard itself — is the deliverable.

## Watch Out

Two failure modes catch everyone the first time:

- **Forgot `INSTALLED_APPS`.** You created the app, wrote the view, wired the URL — and you get a `TemplateDoesNotExist` or the app's templates simply are not found. Django does not look inside apps it has not been told about. Step 2 is not optional.
- **The doubled template folder.** The file must be at `dashboard/templates/dashboard/dashboard.html`. If you put it at `dashboard/templates/dashboard.html`, Django will not find it the way the `render()` call asks for it. Match the path exactly.

Both errors are loud and both are fixed in one line. When a Django change "does nothing," it is almost always one of these two — check them before you debug anything deeper.

You have extended a real clinical app with a feature of your own. It runs on your laptop. Next lesson: we put it on the internet.
