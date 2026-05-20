# CCI Session 9 -- Lesson 5: Deploy to Hugging Face Space

**Estimated time:** 25 minutes (10 min content / 15 min lab)
**Lab mode:** Guided step-by-step (local laptop + huggingface.co)

---

## Instructor Introduction

GitHub holds your code. A Hugging Face Space actually runs it. In 10 minutes your app is going to be live on a URL anyone in the world can open. That's the magic of Spaces -- and also the thing that should make you nervous about what you put inside them. Spaces are public infrastructure. They are perfect for demos, prototypes, and educational tools. They are not where PHI ever goes, they are not where internal KHCC hostnames go, and they are not where a database of real patient MRNs goes. Build the reflex now: before you push to a Space, look at every file and ask, "would I be comfortable if this were on the front page of a newspaper?" If not, it does not go to the Space.

---

## NotebookLM Summary

A **Hugging Face Space** is, under the hood, just a git repository hosted at `huggingface.co/spaces/USER/REPO`. The difference from GitHub is that the Space has a container runtime attached: when you push, HF detects the SDK declared in your `README.md` header, installs your `requirements.txt`, and runs `app.py` automatically. The free tier gives you a 2-vCPU container that sleeps after about 48 hours of inactivity and wakes up on the next request -- perfect for a demo, useless for production. For Gradio apps the entire deployment is "git push and wait two minutes for the build log to finish."

The lesson is four concrete steps. **Step 1** is creating the Space on the HF website: go to huggingface.co, click your profile, **New Space**, name it `crcl-calculator` (the URL will be `huggingface.co/spaces/YOUR_USERNAME/crcl-calculator`), select **SDK: Gradio**, license MIT, visibility **Public**, and click Create.

**Step 2** is cloning the Space repo in a NEW terminal in a separate folder from your original project -- typically `cd ~` first. The reason for the separate folder is to avoid tangling two git remotes (your GitHub repo and your HF Space) in the same working directory; keeping them physically separate keeps `git push` unambiguous. The clone URL is `https://huggingface.co/spaces/YOUR_USERNAME/crcl-calculator`. Authentication uses your HF username and an access token generated at `huggingface.co/settings/tokens` with the **write** scope -- not the read-only default. The token replaces your password on the first push.

**Step 3** is copying `app.py`, `init_db.py`, and `requirements.txt` from your original project folder into the cloned Space folder. Then replace the auto-generated `README.md` with one that contains the HF Spaces YAML header at the very top of the file:

```yaml
---
title: CrCl Calculator
emoji: 💊
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---
```

The header is parsed by HF to choose the SDK, pick the icon, and locate your entrypoint. Without it the Space will fail to build.

**Step 4** is the deploy: `git add .`, `git commit -m "Initial deploy"`, `git push`. Then open the Space URL in your browser. The first build takes one to two minutes -- watch the build log under the "Logs" tab. When the log shows "Running on local URL", the app is live and the URL works from any browser on the internet.

**Secrets on Spaces** never go in the repo. Open the Space, click **Settings**, scroll to **Variables and secrets**, and add `OPENAI_API_KEY` (or whatever) with its real value. HF injects this as an environment variable at container startup, so your existing `os.getenv("OPENAI_API_KEY")` code works without any change. This is the same `python-dotenv` pattern from Lesson 2 -- the only difference is where the environment variable comes from.

A final reminder: **never put PHI on a Space, even on a Private Space**. Private restricts who can open the URL, but HF staff still administer the infrastructure. For anything involving real patient data, the deployment target is an internal KHCC server, not a public cloud demo platform.

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add the HF Spaces overview PDF, and generate an *Audio Overview* covering the "what belongs on a Space" decision.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Create:** A free Hugging Face account at <https://huggingface.co/join>.
- **Generate:** An access token with WRITE scope at <https://huggingface.co/settings/tokens>. Save it somewhere safe -- you cannot view it again after creation.
- **Read:** HF Spaces overview: <https://huggingface.co/docs/hub/spaces-overview>
- **Skim:** HF Spaces configuration reference (the YAML header keys): <https://huggingface.co/docs/hub/spaces-config-reference>
- **Warm-up question:** Why do we clone the Space repo into a separate folder from the original GitHub project rather than just pushing the existing repo to a new remote? Write one sentence and bring it to class.

### During Class -- What to Focus On

1. **A Space is a git repo with a runtime** -- the only difference from a GitHub repo is the build-and-run step that fires on every push.
2. **The YAML header is mandatory** -- `sdk: gradio`, `sdk_version: ...`, and `app_file: app.py` are how HF knows what to build and run.
3. **Secrets via Settings, not files** -- environment variables are injected at runtime, exactly like `python-dotenv` did locally.
4. **Public vs Private is a visibility setting, not a security boundary** -- never PHI on either.

**Common traps:**

- Forgetting the YAML header in `README.md`. Build will succeed and the Space will show a static README instead of running your app.
- Using a read-only HF token -- the first push fails with an authentication error. Generate a token with **write** scope.
- Pinning the wrong `sdk_version` -- if you pin a version that no longer exists, the build fails. Use the latest stable Gradio version shown in the HF Spaces docs.
- Tangling two remotes in one folder -- pushing to GitHub accidentally pushes to HF or vice versa. Use two separate folders.

### After Class -- Practice & Lab Work

**Lab work (required):**

1. On huggingface.co, click **New Space**. Name `crcl-calculator`, SDK Gradio, license MIT, Public. Create.
2. Open a NEW terminal. `cd ~`. Clone the Space: `git clone https://huggingface.co/spaces/YOUR_USERNAME/crcl-calculator`. Authenticate with HF username and your write-scope token.
3. Copy `app.py`, `init_db.py`, and `requirements.txt` from your original `crcl-app` folder into the new `crcl-calculator` folder.
4. Replace the auto-generated `README.md` with one containing the YAML header from the summary above, plus a short description below.
5. `git add .`, `git commit -m "Initial deploy"`, `git push`.
6. Open `https://huggingface.co/spaces/YOUR_USERNAME/crcl-calculator` in your browser. Click the **Logs** tab and watch the build complete (1-2 minutes).
7. Test the live app with age 65, weight 70, creatinine 1.8, sex Female. Confirm CrCl ~26 and all drugs flagged. Share the URL with a classmate.

**Extra practice (optional):**

- Go to **Settings -> Variables and secrets** on your Space and add a fake `OPENAI_API_KEY`. Add a line to `app.py` that does `os.getenv("OPENAI_API_KEY")` and prints whether it found a key. Push and verify the secret was injected.
- Change the Space visibility to Private and confirm you can still open it while signed in. Switch it back to Public.
- Add a custom emoji and `colorFrom`/`colorTo` and watch the Space card update.

**Self-check questions:**

1. What does the YAML header in `README.md` tell Hugging Face, and what happens if you omit it?
2. Where do secrets like API keys live for a Space, and why is putting them in the repo dangerous?
3. Why is a Private Space still not an acceptable home for PHI?

### Resources

| Resource | Link |
|----------|------|
| HF Spaces Overview | <https://huggingface.co/docs/hub/spaces-overview> |
| HF Spaces -- Gradio SDK | <https://huggingface.co/docs/hub/spaces-sdks-gradio> |
| HF Spaces -- Configuration Reference (YAML) | <https://huggingface.co/docs/hub/spaces-config-reference> |
| HF Spaces -- Managing Secrets | <https://huggingface.co/docs/hub/spaces-overview#managing-secrets> |
| HF Access Tokens | <https://huggingface.co/docs/hub/security-tokens> |
| Gradio -- Sharing Your App | <https://www.gradio.app/guides/sharing-your-app> |
