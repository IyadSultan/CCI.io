---
layout: page
title: "Lesson 2: MLOps — Deploying Machine Learning Models in Clinical Practice"
permalink: /session_13/instructions/lesson2_mlops_clinical_deployment/
---

<a class="back-btn" href="/CCI.io/session-13/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;">&#8249; Back to Session 13</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #1565C0!important}
.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}
</style>

# Lesson 2 — MLOps: Deploying Machine Learning Models in Clinical Practice

*45 minutes. No coding. By the end you will be able to sketch the lifecycle from trained model to monitored clinical service, name what "production" means for ML (not just software), and ask the right questions before any model touches a ward workflow.*

Lesson 1 asked *whether* and *how fairly* you should build. This lesson asks what happens **after** the notebook celebration — when the model must run tomorrow on new patients, new labs, and new staff rotations, without silent drift into harm.

> **Watch first:** Open the **[NotebookLM video overview](https://notebooklm.google.com/notebook/7d147aee-fe22-4de7-b280-c6202203a999)** for this lesson, then read below.

## MLOps in one sentence

**MLOps is everything that turns a trained model into a reliable clinical service** — versioning, deployment, monitoring, retraining, and rollback — with the same seriousness you already apply to deploying a Django app (Session 11), plus extra layers because models *decay*.

Software without ML fails loudly: error 500, page blank. ML without MLOps fails quietly: still returns a number, still looks confident, **wrong on a shifting population.**

## The clinical ML lifecycle

Picture a loop, not a finish line:

```
Define → Data → Train → Validate → Deploy → Monitor → (Retrain or Retire)
         ↑___________________________________________|
```

| Phase | Clinical question | MLOps question |
|---|---|---|
| **Define** | What decision does this support? | What is in / out of scope? |
| **Data** | Is the cohort representative? | Lineage, PHI controls, drift in inputs |
| **Train** | Are labels clinically valid? | Reproducible code, frozen splits, model card |
| **Validate** | Does it help on *your* patients? | External validation, subgroup metrics |
| **Deploy** | Who sees the output, when? | API versioning, feature parity, latency |
| **Monitor** | Is it still safe this month? | Data drift, performance drift, alerts |
| **Retrain / Retire** | When is change justified? | Change control, clinical re-approval |

Skipping "Monitor" is how silent harm happens: the world moves; the model does not.

## Deployment is not "copy the pickle file"

In Session 11 you learned that shipping code means environment variables, HTTPS, and a URL. ML deployment adds:

- **Feature parity** — training used last week's lab format; production sends today's. If columns differ, the model may not fail — it may just be wrong.
- **Version pinning** — model v3 and v2 must not swap silently. Every prediction should log *which version* produced it.
- **Latency and availability** — a triage hint that arrives after discharge is not clinical support.
- **Fallback** — when the model is down or uncertain, the workflow must still be safe (human-only path).

> 💡 **Tip.** Treat the model like a drug batch: label, version, expiry logic, and a recall plan.

## Monitoring — what to watch in a hospital

| Signal | What it means |
|---|---|
| **Input drift** | Patient mix, lab units, or documentation style changed |
| **Output drift** | Sudden spike in "high risk" flags — signal or bug? |
| **Performance drift** | Agreement with chart review dropping over time |
| **Operational drift** | Fewer clinicians clicking "accept" — trust or usability problem? |

Alerts should reach a **named owner**, not a mailbox no one reads. Tie alerts to playbooks: investigate, roll back, or pause.

## Validation before the ward — three layers

1. **Technical** — accuracy, AUROC, calibration on held-out data (necessary, not sufficient).
2. **Clinical** — does the tool change decisions in the right direction on realistic cases?
3. **Operational** — does it fit nursing workflow, EHR clicks, and handoffs without adding dangerous friction?

A model can pass layer 1 and still fail layers 2–3. **MLOps without clinical validation is just fast wrongness.**

## Governance hooks (connecting to Lesson 1)

| MLOps artifact | Ethical pillar it serves |
|---|---|
| Model card + data sheet | Transparency |
| Subgroup evaluation report | Fairness |
| Access logs + audit trail | Accountability |
| Human-in-the-loop UI | Oversight |
| Rollback runbook | Safety |
| PHI encryption + minimum access | Protect people |

Ethics and MLOps are one system viewed from two sides.

## Try This

1. **Lifecycle gap.** For a hypothetical "neutropenic fever risk score," name the single most likely failure at Deploy and at Monitor.
2. **Version story.** Write two sentences a clinician should see when the model updates from v1.4 to v1.5 (what changed, what did not).
3. **Rollback trigger.** List three objective signals that should pause the model automatically (not "someone felt nervous").

## Watch Out

**Shadow mode** (run the model in parallel without showing results) is a good early step — but teams forget to leave it. **Pilot forever** without decision ownership is another trap. Set a date: either promote with monitoring or retire.

You now have the ethics frame and the operations frame. The cheat sheet compresses both into one card you can keep beside any future project.
