---
layout: page
title: "Lesson 5: Meet the ER-Triage App"
permalink: /session_11/instructions/lesson5_meet_the_app/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 5 — Meet the ER-Triage App

*25 minutes. By the end you will have a real clinical Django app running on your machine, clicked through both screens, and traced one button all the way back to the Python that runs it.*

In Session 10 you *designed* this app — wrote its PRD, its user story, its technical brief, watched the agent pipeline plan it. Now you get the finished thing, built and runnable, and you learn to read it. Reading an existing codebase is the single most common thing a working developer does — far more than writing from scratch. This lesson is that skill, on a real clinical app, with everything you learned in Lessons 1–4 finally assembled in one place.

The app is the **ER Triage Extractor**. A triage nurse submits a patient's vitals and chief complaint; the system assigns an acuity (1–5) and flags suspected oncologic emergencies; the on-call doctor sees a live queue sorted by acuity. You will find nothing in it you have not already met in miniature.

> 🧠 **Remember.** You are not expected to understand every line today. The goal is to *find your way around* — to know which file to open when you want to change a given thing. That is what "reading a codebase" means.

## Get it running (5 minutes)

The app lives in `templates/solutions/er_triage_app/`. Copy that folder somewhere you like to work, open a terminal in it, and run the same dance from Lesson 4:

```bash
cd er_triage_app
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_demo          # adds 5 demo patients so the queue isn't empty
python manage.py runserver
```

`requirements.txt` is the list of packages this app needs (Django, plus a few you will meet shortly); `pip install -r` installs them all at once. `seed_demo` is a custom command that drops five fake patients into the database so you have something to look at.

Open `http://127.0.0.1:8000/`:

- **`/`** — the doctor queue, five patients sorted by acuity, color-coded.
- **`/triage/new`** — the nurse form.
- Click any patient's complaint in the queue to reach **`/triage/<id>`**, the detail view.

Fill out the nurse form for a fake patient and submit. You land on a confirmation page with an acuity and (maybe) an emergency flag, and the new patient appears in the queue. **You are running a clinical web app, end to end, on your own machine.**

> 💡 **Tip.** No OpenAI key? The app still runs. The emergency-flag step degrades gracefully — triages save with no flags and a status of "failed" instead of crashing. You will see *why* that matters when you read the extractor. To get real flags, copy `.env.example` to `.env` and paste in an `OPENAI_API_KEY`.

## The tour — project first

Open the folder in VS Code. Start where Lesson 4 taught you to: the **project**.

`er_triage/settings.py` — the configuration. Find `INSTALLED_APPS`. There is the line you wrote by hand in Lesson 4:

```python
INSTALLED_APPS = [
    # ... the built-in Django apps ...
    "triage",
    # Lesson 6 adds a new app on the line below:
    # "dashboard",
]
```

`triage` is the one app this project currently has. (That commented line is a breadcrumb for next lesson — ignore it for now.) Scroll and you will also recognize, from Lesson 3 and 4 vocabulary, the database setting (SQLite — a database in a single file, perfect for development) and a few production knobs read from the environment. Do not change anything; just notice you can read it.

`er_triage/urls.py` — the master URL map. Short and clear:

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("triage.urls")),
]
```

`include("triage.urls")` is new: instead of listing every URL here, the project *delegates* all the triage URLs to the app's own `urls.py`. This is how real projects stay organized — each app owns its own URLs, and the project just points at them.

## The tour — the triage app

Now open the `triage/` folder. This is where the feature lives. Walk it in the order a request flows.

**`triage/urls.py` — the app's routes.** Four lines, four screens:

```python
urlpatterns = [
    path("", views.doctor_queue_view, name="doctor_queue"),
    path("triage/new", views.nurse_form_view, name="nurse_form"),
    path("triage/<int:event_id>/confirm", views.triage_confirmation_view, name="triage_confirmation"),
    path("triage/<int:event_id>", views.patient_detail_view, name="patient_detail"),
]
```

Each line maps a URL to a view and gives it a `name`. `<int:event_id>` is a *slot* in the URL — `/triage/7/confirm` captures `event_id = 7` and hands it to the view. The `name=` is a nickname templates use to link to a page without hardcoding its URL.

**`triage/models.py` — the data.** Two models, exactly as Session 10's brief specified:

- `Patient` — one row per person. The MRN is stored *encoded*, the name *encrypted* — open `triage/crypto.py` to see the PHI protection (Optimus for the MRN, Fernet for the name). This is the KHCC rule from your CLAUDE.md made real: raw PHI never sits in the database in the clear.
- `TriageEvent` — one row per ER arrival: the chief complaint, the vitals, the oncology context, the computed acuity, the emergency flags.

A model is a Python class that Django turns into a database table. You define fields in Python; Django writes the SQL. This is the `models.py` that was empty in Lesson 4, now full.

**`triage/services/` — the brains.** Two files, and the split between them is the most important design idea in the app:

- `acuity.py` — a pure-Python class that computes the 1–5 acuity from vitals. **No LLM, no network, just arithmetic and `if` statements.** Acuity is a number that goes in the record, so it must be deterministic, testable, and impossible for a model to drift on. This is the Lesson 3 rule — trusted logic on the backend — in its purest form.
- `oncologic_emergency.py` — the LLM call. It sends the chief complaint to OpenAI and asks which of four oncologic emergencies are suspected. Two things to notice: it only accepts answers from a *closed set* of four labels (anything else is dropped), and if the call fails *for any reason* it returns "failed" instead of crashing. That graceful degradation is why the app runs without a key.

> 🔧 **Technical Stuff.** The division between `acuity.py` and `oncologic_emergency.py` encodes a clinical-safety rule in the architecture itself: **the LLM never computes acuity.** Acuity is arithmetic, so it lives in code you can unit-test. The LLM is reserved for the judgment call — reading free text for emergency patterns — and even there it is fenced into a closed set of allowed answers. The code *cannot* accidentally hand acuity to the model, because the model is never given that job. Structure enforcing safety: that is the lesson.

**`triage/forms.py` — the form definition.** `NurseTriageForm` lists every field and its valid range (heart rate 30–220, SpO₂ 50–100, and so on). Django uses this to *validate on the backend* — the Lesson 3 law. A junk value is rejected here, server-side, no matter what the browser did.

**`triage/views.py` — the logic.** Open `nurse_form_view` and read it top to bottom. On a POST it: validates the form, computes acuity (deterministic), calls the extractor (LLM), upserts the patient (PHI-protected), creates the `TriageEvent`, and redirects to the confirmation page. That is the server walkthrough diagram from Lesson 3, written out in Python you can now read.

**`triage/templates/triage/` — the screens.** `base.html` is the shared frame (the header, the Tailwind styling link); the others — `nurse_form.html`, `doctor_queue.html`, `triage_confirmation.html`, `patient_detail.html` — fill in the content. Open `doctor_queue.html` and find the `{% for event in events %}` loop building the table rows. That is the exact `{% for %}` you used in Lesson 4's *Try This*, now drawing a clinical queue.

## Trace one click

Reading clicks into the right files end to end is the skill. Do this one out loud:

> A doctor opens the queue. The browser requests `/`. → `er_triage/urls.py` sends it to `triage.urls`. → `triage/urls.py` maps `""` to `doctor_queue_view`. → That view (in `views.py`) reads all `TriageEvent` rows, ordered by acuity, and renders `doctor_queue.html`. → The template's `{% for %}` loop draws one colored row per patient. → The finished HTML goes back to the browser.

Five files, one request. If you can narrate that, you can read this codebase — and most others.

## Try This — a code scavenger hunt

Find the file and line for each. (Answers in the practice exercise.)

1. Where is the acuity for a septic-shock patient (systolic BP < 90) decided?
2. Where are the four allowed oncologic-emergency labels listed?
3. Where is the patient's name encrypted before it is saved?
4. Which template draws the colored acuity badge in the queue?
5. Where would you change the valid range for SpO₂?

## Watch Out

When you read an unfamiliar codebase, resist the urge to understand everything before you touch anything. You will drown. The working method is the opposite: **start from what the user does** (clicks the queue), **find the URL**, follow it to the **view**, and only open the files that view actually uses. Let the request be your guide. The five-file trace above is the whole technique. Everything you do not need for *this* change, you are allowed to ignore — for now.

You can now run and read a real clinical Django app. Next lesson you change it — you add a brand-new screen of your own.
