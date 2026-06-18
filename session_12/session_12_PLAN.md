# Session 12 — Plan (for review before writing)

**Title:** Locking the Front Door — PHI, Cybersecurity & Cloud Governance
**Author:** Iyad Sultan, MD — Medical Director, AI Office, King Hussein Cancer Center
**Audience:** CCI clinicians who completed Session 11 (built and deployed the ER-triage Django app). No coding background assumed.
**Format:** 9 lessons + cheat sheet, ~3.4 hours.
**Companion artifacts:** three small, runnable template sets — an Azure Cloud Shell "hardened VM" lab, a two-tier PHI scanner, and a synthetic-data generator — all reusing Session 11's real PHI crypto layer.

---

## What changed from the v4 syllabus

The v4 syllabus lists S12 as "PHI / Cybersecurity / Governance." This build keeps that theme and makes it concrete, with five deliberate decisions (confirmed with the author):

- **Re-introduce Azure — but via the CLI, not App Service.** Session 11 dropped Azure App Service as too complex for non-coders and deployed apps on Render instead. Session 12 brings Azure back for what it is genuinely the right teacher of: *infrastructure security*. Students learn the full VM lifecycle — create, harden, serve, **delete** — in **Azure Cloud Shell** (browser-based, free, nothing installed locally).
- **Instructor-led Azure lab + a replay runbook.** The Azure lesson is demonstrated live by the instructor; each student gets a numbered runbook to replay later. No student needs their own Azure subscription during class.
- **Two encryption lessons + a standalone PHI/HIPAA lesson.** Encryption is split into "the idea" (Lesson 2) and "the mechanics" (Lesson 3); PHI/HIPAA gets its own lesson (Lesson 7). This is the right pacing for a no-background audience.
- **Reuse Session 11's real crypto, don't reinvent.** The PHI tools import the exact `encode_mrn`/`decode_mrn` (Optimus) and `encrypt_name`/`decrypt_name` (Fernet) from the S11 ER-triage app — continuity, and proof these are not toy ideas.
- **Representative AIDI synthetic-data pipeline.** Lesson 8 teaches the AIDI "preventive de-identification" doctrine and ships a clean teaching generator that cites the doctrine without exposing internal pipeline specifics.

---

## The arc

Three movements, sequenced so each lesson rests on the one before — a clinician cannot reason about "lock the inbound ports" before "ports are numbered doors."

1. **Foundations (L1–3)** — Build the mental model: what a network is, then what encryption is, then how the keys actually work (and the real S11 example of at-rest + in-transit).
2. **Threats & Defenses (L4–6)** — How attacks actually work (defensive framing), the highest-value personal defense (passwords + MFA), and detection when prevention fails (canary tokens).
3. **Clinical Governance & Cloud (L7–9)** — The clinical core: PHI and HIPAA, the synthetic-data pipeline that makes data safe by design, and the hardened-cloud hands-on that operationalizes everything — ending with using AI to check your own security.

---

## The lessons

### Lesson 1 — What Is a Network, Really? *(15 min)*
**Concept.** A network is computers passing messages; the internet is networks of networks. IP addresses, ports as numbered doors, client/server, the firewall as reception desk.
**Worked example.** The hospital building: rooms = computers, hallways = network, numbered doors = ports, reception = firewall. `localhost` (no door open) vs the S11 public URL (a door to the whole internet).
**Deliverables.** Lesson MD, quiz, practice (label-the-network-diagram), NotebookLM source.

### Lesson 2 — Encryption, Plainly: Secrets, Eavesdroppers & HTTPS *(20 min)*
**Concept.** Encryption = scrambling with a key; man-in-the-middle eavesdropping; HTTP (postcard) vs HTTPS (sealed envelope); what the padlock proves and what it does not.
**Worked example.** Why the S11 Render URL was `https://`, and why patient data over `http://` is a postcard.
**Deliverables.** Lesson MD, quiz, practice (postcard-vs-envelope sorter with a MITM toggle), NotebookLM source.

### Lesson 3 — Two Kinds of Keys: Symmetric, Asymmetric, At-Rest vs In-Transit *(25 min)*
**Concept.** Symmetric (one shared key) vs asymmetric (public/private pair, solves key exchange); encryption in transit (TLS/HTTPS) vs at rest (the stored database); AES-256/RSA/TLS 1.3; why you never roll your own crypto.
**Worked example.** The real S11 layer: Fernet encrypts the patient name *at rest* (`crypto.py`); HTTPS protects it *in transit*; the TLS handshake is asymmetric setting up a symmetric session.
**Deliverables.** Lesson MD, quiz, practice (at-rest vs in-transit sorter), NotebookLM source.

### Lesson 4 — How Attacks Actually Work *(25 min)*
**Concept.** The attack chain as one defender's story: zero-day → exploit → backdoor/RAT → persistence → lateral movement → data exfiltration → encryption-as-weapon → ransomware/extortion. Patching, least privilege, segmentation, and tested backups as the brakes.
**Worked example.** A ward-by-ward intruder; a hospital that cannot reach its EHR. Defensive framing only — no operational technique.
**Deliverables.** Lesson MD, quiz, practice (order the 8 ransomware-chain steps + name the defense), NotebookLM source.

### Lesson 5 — Defending Yourself: Passwords, MFA & Least Privilege *(20 min)*
**Concept.** Length beats complexity; never reuse; password managers; what MFA is and why it stops most credential attacks; MFA types ranked by phishing resistance; least privilege as a daily habit.
**Worked example.** The hospital login + phone code *is* MFA; foreshadows the SSH-key VM in Lesson 9.
**Deliverables.** Lesson MD, quiz, practice (passphrase-strength + "would MFA have stopped this?"), NotebookLM source.

### Lesson 6 — The Honeypot Trick: Canary Tokens *(15 min)*
**Concept.** Detection vs prevention; a canary token as a tripwire document that emails you when opened; canarytokens.org (free, no login). Ethics: your own assets, your own email, never bait with real PHI.
**Worked example.** A fake `Patient_List_2026.docx` on a shared drive that flags snooping.
**Deliverables.** Lesson MD, quiz, practice (guided walk-through + alert-triage matcher). No code template.

### Lesson 7 — PHI and HIPAA: The Rules of the Road *(25 min)*
**Concept.** What counts as PHI; the HIPAA 18 identifiers; de-identification vs encryption vs access control; minimum-necessary; finding PHI in free text.
**Worked example.** A synthetic clinical note read line by line; how the S11 app's choices (encrypt name, encode MRN) map onto specific identifiers.
**Deliverables.** Lesson MD, quiz, practice (spot-the-PHI in a note), NotebookLM source. Pairs with the PHI-scanner template.

### Lesson 8 — The Synthetic-Data Pipeline: Safe Data by Design *(25 min)*
**Concept.** The AIDI preventive de-id doctrine — every MRN encoded, every name encrypted before any output; keys in a secret vault, never in code; eval on a frozen deceased-patient cohort; and generating realistic-but-fake data so there is nothing to leak.
**Worked example.** The PHI scanner finds the problem; the generator is the cure. Run the scanner on the generator's output → zero findings.
**Deliverables.** Lesson MD, quiz, practice (build-a-safe-record toggle board), NotebookLM source. Pairs with the synthetic-data template.

### Lesson 9 — The Cloud, Hardened: Azure CLI from Resource Group to Teardown *(35 min)*
**Concept.** The full infrastructure lifecycle in Azure Cloud Shell: resource group → hardened Linux VM (SSH-key auth, locked NSG, patched image, least privilege) → one-page nginx site → verify → **delete everything**. Then: paste your config into an AI assistant / the AIDI skill and ask "what's still exposed?"
**Worked example.** Standing up a server the way the AI Office does, then tearing it down so it can be neither attacked nor billed.
**Deliverables.** Lesson MD, quiz, practice (az-command sequencer + NSG-rule auditor), NotebookLM source. Pairs with the Azure template.

### Cheat Sheet — Lock-Down Reference *(reference)*
One page: ports, HTTP vs HTTPS, symmetric/asymmetric, the attack chain → defenses, MFA ranking, the HIPAA 18, the Azure hardening + teardown checklist.

---

## Time budget

| Lesson | Min | Cum |
|---|---|---|
| 1. What Is a Network | 15 | 15 |
| 2. Encryption Basics | 20 | 35 |
| 3. Encryption Types | 25 | 60 |
| 4. How Attacks Work | 25 | 85 |
| 5. Passwords & MFA | 20 | 105 |
| 6. Canary Tokens | 15 | 120 |
| 7. PHI & HIPAA | 25 | 145 |
| 8. Synthetic Data | 25 | 170 |
| 9. Azure CLI Hardening | 35 | 205 |

**Total: ~205 min (~3.4 hours).** Trim L1/L6 or fold the cheat-sheet walkthrough to land near 3 hours.

---

## Materials inventory

- `session_12_PLAN.md` (this file), `session_12_curriculum.md`
- `instructions/lesson1..9_<slug>.md` (9)
- `quizzes/quiz_lesson1..9_<slug>.jsx` (9, 5 MCQ each)
- `practices/practice_lesson1..9_<slug>.jsx` (9, bespoke interactions)
- `data/notebooklm_sources.md` (9 dense paragraphs)
- `cheat_sheet.md`
- `templates/{student,solutions}/azure_hardened_vm/` — numbered Cloud Shell scripts + site + README
- `templates/{student,solutions}/phi_tools/` — PHI scanner (hipaa.py, phi_scanner.py, run_scan.py, sample notes) + `synthetic/` generator (importing S11 crypto)
- `build_pptx.js` + `package.json` → `Session_12_Locking_the_Front_Door.pptx`

---

## Cross-cutting safety rules (in every relevant README + "Watch Out")

- Run the PHI scanner **only on the provided synthetic notes** — never real charts on a personal laptop.
- No secrets in any file: Azure uses `--generate-ssh-keys` (key stays in Cloud Shell); OpenAI key from `.env`/env only; `.gitignore` excludes `.env`, `out/`, keys.
- The Azure VM lab **must end with teardown** — a running VM is both a bill and a 24/7 attack surface.
- Canary tokens: your own email, your own assets, bait stays fake.

---

## Open questions before I write — RESOLVED

1. Azure delivery → **instructor-led live demo + student replay runbook**.
2. Lesson count → **9 lessons + cheat sheet**.
3. Synthetic-data pipeline → **representative teaching version**.
4. PHI-scanner LLM → **OpenAI** (S11 continuity), note that AIDI production uses Azure OpenAI via the vault.
