---
layout: page
title: "Lesson 7: Ship It — GitHub to Render to a Live URL"
permalink: /session_11/instructions/lesson7_ship_on_render/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 7 — Ship It: GitHub → Render → Live URL

*25 minutes. By the end your clinical app is on the public internet, at a URL you can open on your phone and text to a colleague.*

Your app runs at `127.0.0.1:8000` — and that address means *this computer only*. Close your laptop and the app is gone; nobody else can reach it. Everything so far has been rehearsal. This lesson is opening night: we take the app off your laptop and put it on a computer that is always on and reachable from anywhere. That is what **deployment** means.

The path has two stops. First **GitHub** — your code goes up to a repository in the cloud. Then **Render** — a hosting service that watches that repository, runs your app, and gives it a public web address. Push to GitHub, connect Render, get a URL. That is the whole journey.

> 🧠 **Remember.** Deployment is just *moving the backend onto an always-on, internet-reachable computer*. The request/response cycle from Lesson 3 does not change one bit — only the address does. `localhost` becomes `your-app.onrender.com`.

## Why Render (and not Azure)

The syllabus once said Azure. We use **Render** instead, on purpose: it connects straight to a GitHub repo, has a free tier, and turns deployment into a few clicks instead of a cloud-console expedition. The *concepts* — a build step, a start command, environment variables for secrets, static files, a database — are identical everywhere. Learn them on Render and you can read the Azure, AWS, or Google Cloud version of the same checklist.

## What's already in the box

Open the app folder. Three files exist that you did not need on your laptop but that a real server does. They were written for you; understand what each is for.

**`requirements.txt`** — the exact list of packages the server must install. On your laptop you ran `pip install` yourself; the server reads this file and does it automatically. Beyond Django it lists `gunicorn` (below), `whitenoise` (below), and the rest.

**`build.sh`** — the *build step*: the commands Render runs once, each time you deploy, to get ready:

```bash
pip install -r requirements.txt          # install packages
python manage.py collectstatic --no-input  # gather CSS/JS into one folder
python manage.py migrate                  # set up / update the database
```

`collectstatic` is new. In development Django serves your static files (CSS, the styling) for you; in production a package called **whitenoise** serves them efficiently, and `collectstatic` gathers them into one folder for it. You do not need to understand the internals — just know the build step installs, gathers static files, and migrates the database, every deploy.

**`render.yaml`** — the *blueprint*. It tells Render everything about how to run the app in one file: use Python, run `build.sh` to build, run `gunicorn er_triage.wsgi` to start, attach a small persistent disk for the database, and which environment variables to set. **Gunicorn** is the production web server that replaces `runserver` — `runserver` is a development toy with a warning printed right on it; gunicorn is the real thing that serves real traffic.

> 🔧 **Technical Stuff.** Three production settings in `er_triage/settings.py` matter and are already wired to read from the environment, so you flip them with env vars rather than code edits:
> - **`DEBUG`** — `True` on your laptop (shows helpful error pages), must be **`False`** in production (those error pages leak internal details). The blueprint sets it false.
> - **`ALLOWED_HOSTS`** — the list of hostnames the app will answer to. Render's hostname is added automatically. Without this, Django refuses the request as a security measure.
> - **`SECRET_KEY`** — a cryptographic secret. The blueprint has Render *generate* a strong one, so it is never written in your code.

## Step 1 — push to GitHub

You learned git in Session 9. From inside the app folder:

```bash
git init
git add .
git commit -m "ER triage app, ready to deploy"
```

Then create a new **empty** repository on github.com (no README, since you have files), and follow GitHub's "push an existing repository" lines:

```bash
git remote add origin https://github.com/<you>/er-triage.git
git branch -M main
git push -u origin main
```

Refresh the GitHub page — your code is in the cloud.

> ⚠️ **Watch out.** Look at the files that did *not* get committed. The app ships a `.gitignore` that deliberately excludes `.env`, `db.sqlite3`, and the virtual environment. **Your `.env` — with your OpenAI key — must never reach GitHub.** A committed secret is a leaked secret, even if you delete it later; it stays in the history. Before every first push, confirm `.env` is in `.gitignore`. This one is already done for you; the habit is yours to keep.

## Step 2 — create the Render service

1. Sign in at **render.com** with your GitHub account.
2. Click **New +** → **Web Service**.
3. Connect the `er-triage` repository. Render detects the `render.yaml` blueprint and reads your build command, start command, and disk from it. (If it does not auto-detect, set Build Command to `./build.sh` and Start Command to `gunicorn er_triage.wsgi:application` by hand — same thing.)
4. Choose the **Free** instance type.

## Step 3 — set the secrets

The blueprint marks two values as `sync: false` — meaning *you* paste them in the dashboard, so they never live in your code or your repo. Under the service's **Environment**:

- **`OPENAI_API_KEY`** — your key. (Leave blank and the app still runs; the extractor just degrades, exactly as on your laptop.)
- **`FERNET_KEY`** — the patient-name encryption key. Generate one locally and paste it:
  ```bash
  python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
  ```

Render generates `SECRET_KEY` for you and sets `DEBUG=false` from the blueprint. Click **Create Web Service**.

## Step 4 — watch it deploy (and the first failure)

Render runs your build: installing packages, collecting static files, migrating the database. Watch the live log. **Your first deploy may go red** — that is normal, and the log tells you why. The classic first-timer failures, and their fixes:

- **`ALLOWED_HOSTS` error / "Bad Request (400)".** The app booted before the host was set. The blueprint and settings handle Render's hostname automatically; if you see this, confirm `DEBUG` is being read and redeploy.
- **A missing package.** Something is imported but not in `requirements.txt`. Add it, commit, push — Render redeploys automatically on every push.
- **Build command not found.** `build.sh` needs to be executable. Run `chmod +x build.sh`, commit, push.

When it goes **green**, Render shows your URL: `https://er-triage-xxxx.onrender.com`. Open it. **Your clinical app is live on the internet.** Open it on your phone. Send the link to the person next to you and watch them load your doctor queue. That moment — someone else, on their own device, using software you built and shipped — is the whole point of the session.

> 💡 **Tip.** On the free tier the app "sleeps" after inactivity and takes ~30 seconds to wake on the first request. That is the free plan, not a bug. A paid instance stays awake. For a class demo, load the page once a minute before you present.

## Step 5 — the deploy loop

Now the magic of connecting Render to GitHub pays off. Change something — add the Lesson 6 dashboard if it is not already in this copy, or edit a heading. Then:

```bash
git add .
git commit -m "add dashboard"
git push
```

Render sees the push and redeploys automatically. A minute later your change is live, at the same URL. **Push to deploy** — that is the loop real teams live in. Your laptop, GitHub, and the live site stay in sync through `git push`.

## Try This

1. Deploy the app, then deploy *your own* feature from Lesson 6's *Try This* by pushing it — watch it appear live.
2. Visit your live URL's `/admin` page. It is there, but you have no account on the server. Render gives you a **Shell** for the service; from it run `python manage.py createsuperuser`, then log into the live admin. (Now you have seen how to run a one-off command against a deployed app.)
3. Seed the live database so your demo queue is not empty: in the Render Shell, run `python manage.py seed_demo`.

## Watch Out

You have put a clinical-*looking* app on the public internet. For this course that is exactly right — it is fake data, a teaching app, labeled "not for clinical use." But carry the line clearly into real work: **a publicly reachable URL with real patient data is a different universe.** That needs authentication (this app has none — it is a v1 deliberately), it needs the AI Office's PHI controls, audit logging, and governance sign-off, and it does not run on a hobby tier. The skill you learned today — push to GitHub, deploy, get a URL — is the same skill the AI Office uses; the *safeguards* wrapped around it for a real deployment are the subject of Session 12. Ship demos freely. Ship patient data only through the front door governance builds.

You shipped. Last lesson: the one-page card that keeps the whole session at your fingertips.
