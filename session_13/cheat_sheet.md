---
layout: page
title: Session 13 Cheat Sheet
permalink: /session_13/cheat_sheet/
---

<a class="back-btn" href="/CCI.io/session-13/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#1565C0;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #90CAF9;background:#E3F2FD;margin-bottom:1rem;">&#8249; Back to Session 13</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #1565C0!important}
.site-title,.site-title:visited{color:#1565C0!important;font-weight:800!important}
</style>

# Session 13 — Responsible Clinical AI Reference

*Ethics + MLOps on one card. No code required.*

**The one rule:** if it touches patients, you need **ethical permission**, **clinical validation**, and **operational ownership** — not just a good demo.

---

## Six ethical pillars (Healthcare AI Research, 2024)

| Pillar | Ask |
|---|---|
| **Protect people & data** | Who consented? What identifiers remain? Minimum access? |
| **Safety** | When it fails, is harm bounded? Human override? |
| **Fairness** | Who is under-represented? Subgroup performance? |
| **Transparency** | Limits documented? Version known? Confidence shown? |
| **Accountability** | Named owner? Incident path? Audit trail? |
| **Human oversight** | Clinician responsible for the decision that reaches the patient? |

**Red flags:** "just research," accuracy without subgroup context, "clinicians will figure it out," unexplainable black box for high stakes, "fix bias after launch."

---

## Clinical ML lifecycle (MLOps loop)

```
Define → Data → Train → Validate → Deploy → Monitor → Retrain or Retire
```

| Phase | Must-show |
|---|---|
| **Validate** | External + subgroup metrics; clinical usefulness |
| **Deploy** | Version pinned; feature parity; fallback workflow |
| **Monitor** | Input/output/performance drift; named alert owner |
| **Retire** | Rollback runbook; clinical re-approval for changes |

**ML fails quietly** — still returns a number while the world drifts. Monitoring is not optional.

---

## Deployment checklist (questions before go-live)

- [ ] Model version logged with every prediction
- [ ] Training vs production features match (units, columns, timing)
- [ ] UI states scope, limits, and uncertainty in plain language
- [ ] Human-only path when model down or low confidence
- [ ] PHI handled per Session 12 (encrypt, minimum access, synthetic in teaching)
- [ ] Named clinical + technical owner; on-call for incidents
- [ ] Rollback tested — not just documented

---

## Governance gates (quick)

| Stage | Gate question |
|---|---|
| Idea | Who benefits / who could be harmed? |
| Data | Lawful access + adequate de-identification? |
| Pilot | Monitoring + opt-out + workflow fit? |
| Scale | Drift alerts + change control + re-approval? |

---

## Carry forward to capstone (Sessions 14–15)

Every capstone pitch should answer in one slide each: **pillar check**, **validation plan**, **MLOps owner**, **kill switch**. If you cannot, you are still in Lesson 1 — not ready to ship.
