# CCI Session 12 — Locking the Front Door
### PHI, Cybersecurity & Cloud Governance

*Iyad Sultan, MD — Medical Director, AI Office, King Hussein Cancer Center*

---

## Where this session sits

In Session 11 you built a clinical app and put it on the public internet at a URL anyone could open. That was the right way to *learn* shipping — but the app had fake data, no login, and a label that said "not for clinical use." Session 11 closed with a promise: the safeguards that stand between a teaching demo and a tool that touches a real patient are the subject of Session 12.

This is that session. By the end you will understand, in plain terms, how the internet actually carries a message, how encryption protects it, how attacks really unfold, how to defend yourself, what the law requires you to do with patient data, and how to stand up — and tear down — a hardened server in the cloud. You will leave able to look at any system and ask the right questions about its front door.

You do not need to write code. Three small hands-on kits are provided; you run them by copying and pasting, and the Azure lab is demonstrated live.

---

## Who this is for

Clinicians who completed Session 11. No programming background is assumed. Every technical idea is anchored to a hospital analogy and to the app you already built.

---

## Learning objectives

By the end of Session 12 you will be able to:

1. Explain what a network, an IP address, a port, and a firewall are — and why "reachable from anywhere" is both useful and dangerous.
2. Explain what encryption is, distinguish HTTP from HTTPS, and say exactly what the browser padlock does and does not prove.
3. Distinguish symmetric from asymmetric encryption and encryption *in transit* from *at rest*, using the real example from your Session 11 app.
4. Recognize the stages of a real cyberattack — from zero-day to ransomware — and name the defense that breaks the chain at each stage.
5. Build strong passphrases, use a password manager, and choose phishing-resistant MFA; apply least privilege as a daily habit.
6. Use a canary token to detect snooping on your own assets, ethically.
7. Define PHI, recall the HIPAA 18 identifiers, and tell de-identification apart from encryption and access control.
8. Describe the AIDI "safe data by design" doctrine and why synthetic data and preventive de-identification protect patients.
9. Walk the full Azure VM lifecycle — create a resource group, harden a VM, serve a site, and delete everything — and use an AI assistant to review a configuration for exposure.

---

## The nine lessons

| # | Lesson | Min | The one thing to remember |
|---|---|---|---|
| 1 | What Is a Network, Really? | 15 | A network is computers passing messages; ports are numbered doors; every open door is risk. |
| 2 | Encryption, Plainly | 20 | HTTP is a postcard; HTTPS is a sealed envelope. The padlock means encrypted, not trustworthy. |
| 3 | Two Kinds of Keys | 25 | One shared key (symmetric) vs a public/private pair (asymmetric); protect data in transit AND at rest. |
| 4 | How Attacks Actually Work | 25 | Most breaches use old, unpatched holes and a human click. Patch, least-privilege, back up. |
| 5 | Passwords, MFA & Least Privilege | 20 | Length beats complexity; never reuse; MFA stops most attacks even if your password leaks. |
| 6 | The Honeypot Trick: Canary Tokens | 15 | You can't prevent everything — so lay tripwires that tell you the moment someone snoops. |
| 7 | PHI and HIPAA | 25 | 18 identifiers make data "protected." De-id, encryption, and access control are three different things. |
| 8 | The Synthetic-Data Pipeline | 25 | The safest patient data is data that was never real. Encode every MRN, encrypt every name, before any output. |
| 9 | The Cloud, Hardened | 35 | Open the minimum, log in with keys not passwords, and **delete what you don't need** — cost and attack surface both. |

---

## The three hands-on kits

All three live under `templates/` with a `student/` (fill-in-the-blanks) and a `solutions/` (complete) copy.

- **`azure_hardened_vm/`** — numbered scripts you paste into Azure Cloud Shell, in order, to create a resource group, a hardened Linux VM, a one-page website, verify it, and then delete everything. The instructor runs this live; you keep the runbook to replay later.
- **`phi_tools/`** — a PHI scanner that reads a clinical note and flags the identifiers it finds. It always runs a regex pass (no key needed) and adds an optional AI pass for the subtle cases. **Run it only on the provided synthetic notes.**
- **`phi_tools/synthetic/`** — a generator that produces realistic-but-fake clinical records with no real PHI, reusing the same encryption your Session 11 app used. Run the scanner on its output and you get zero findings — that is the whole point.

---

## How to use the materials

1. **Read** the lesson (`instructions/`) or paste its NotebookLM source (`data/notebooklm_sources.md`) into a notebook and ask it questions.
2. **Quiz** yourself (`quizzes/`) — five questions, instant explanations.
3. **Practice** (`practices/`) — one short interactive exercise per lesson.
4. For Lessons 7–9, **open the matching kit** in `templates/` and follow its README.
5. Keep the **cheat sheet** (`cheat_sheet.md`) open for your next real project.

---

## The line we carry into the rest of the course

Everything here serves one rule: **a publicly reachable system with real patient data is a different universe from a teaching demo.** It needs encryption in transit and at rest, strong authentication, least privilege, audit logging, de-identification, and governance sign-off. Ship demos freely. Ship patient data only through the front door that governance builds — and now you know what that door is made of.
