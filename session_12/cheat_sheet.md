---
layout: page
title: Session 12 Cheat Sheet
permalink: /session_12/cheat_sheet/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Session 12 — Lock-Down Reference

*The one-page card you keep open before you put anything on the internet.*

**The one rule:** a publicly reachable system with real patient data is a different universe from a teaching demo. **Open the minimum. Encrypt in transit AND at rest. Log in with keys. De-identify by default. Delete what you don't need.**

---

## Ports — the numbered doors

| Port | Service | Open to the public? |
|---|---|---|
| **443** | HTTPS (encrypted web) | **Yes** — the one public door |
| **80** | HTTP (plain web) | No — a postcard; redirect to 443 |
| **22** | SSH (remote login) | No — your IP only |
| **3389** | RDP (remote desktop) | No — never to the internet |
| (db) | database | No — give it no street door at all |

Full address = `IP:port` (e.g. `142.250.65.78:443`). Firewall / NSG = the reception desk: allow a few doors, shut the rest. **Every open port is attack surface.**

---

## HTTP vs HTTPS

- **HTTP = a postcard** anyone on the path can read. **HTTPS = a sealed envelope** (encrypted in transit).
- The **padlock proves encrypted, NOT trustworthy.** A scam site can have a valid padlock.
- Patient data over `http://` = a postcard. Always HTTPS.

---

## Encryption — two axes

| | One key (symmetric) | Key pair (asymmetric) |
|---|---|---|
| Examples | AES-256, **Fernet** | RSA, the TLS handshake |
| Solves | fast bulk encryption | key exchange with strangers |

- **In transit** = moving (TLS/HTTPS).  **At rest** = stored (the database, the disk). **Do both.**
- S11 app: Fernet encrypts the name *at rest*; HTTPS protects it *in transit*.
- **Never roll your own crypto** — use vetted standards.

---

## The attack chain → the brake at each link

```
zero-day → exploit → backdoor/RAT → persistence →
lateral movement → exfiltration → encrypt-as-weapon → ransomware
```

| Brake | Stops |
|---|---|
| **Patch** | known holes (most breaches use old, unpatched ones) |
| **Least privilege** | the blast radius of a compromised account |
| **Segmentation** | lateral movement |
| **Tested offline backups** | ransomware — restore, don't pay |

Most breaches = an old hole + a human click.

---

## Passwords & MFA

- **Length > complexity.** A 4-word passphrase beats `P@ssw0rd!`.
- **Never reuse** — one breach becomes a master key. Use a **password manager**.
- **MFA** = two of {know, have, are}. Ranking: **SMS < authenticator app < hardware key / passkey** (phishing-resistant).
- Never approve a login prompt you didn't start (MFA fatigue).

---

## Detection: canary tokens

Prevention fails sometimes — lay tripwires. **canarytokens.org** (free): your **own email**, a memo, **fake bait only — never real PHI**, low-traffic spot, IT in the loop. An alert's IP is a **lead, not an identity**.

---

## PHI & HIPAA

**PHI = health information + an identifier.** The **18 identifiers** (Safe Harbor): names · geography < state · dates < year · phone · fax · email · national ID · **MRN** · health-plan # · account # · license # · vehicle # · device # · URL · IP · biometrics · full-face photo · any other unique trait. *(Dates → year; ages > 89 → "90+".)*

Three different jobs — don't substitute one for another:

- **De-identification** removes identifiers (no longer PHI).
- **Encryption** scrambles it (encrypted PHI is *still PHI*).
- **Access control** decides who may log in.

**Minimum necessary.** Re-identification by *combination* (rare dx + date + town) survives a field scan.

---

## Safe data by design (preventive de-identification)

1. **Encode every MRN** before storage/output (`encode_mrn`).
2. **Encrypt every name** before any output (`encrypt_name`).
3. **Keys in a vault**, never in code.
4. **Evaluate on a frozen, governed deceased-patient cohort.**

Use **synthetic** (realistic-but-fake) data for demos/tests → scan it → **zero findings**. Real PHI only at secure ingest + governed eval; synthetic everywhere else.

---

## Azure hardening + teardown checklist

```
□ Resource group         one box per experiment
□ VM: --generate-ssh-keys   key login, not a password
□ VM: non-root admin user   least privilege
□ VM: current patched image
□ NSG: 443 → Any            public website door
□ NSG: 22  → your-IP/32     never 0.0.0.0/0
□ everything else SHUT
□ HTTPS (443) + certificate for real traffic
□ verify from outside; audit the rule list
□ ask an AI: "what's still exposed?"
□ DELETE the resource group when done   ← do not skip
```

A running VM is a **bill that never sleeps AND a 24/7 attack surface.** The most secure server is one that no longer exists.

---

*CCI · Session 12 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*
