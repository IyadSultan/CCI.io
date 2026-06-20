---
layout: page
title: "Lesson 7: PHI and HIPAA — The Rules of the Road"
permalink: /session_12/instructions/lesson7_phi_and_hipaa/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 7 — PHI and HIPAA: The Rules of the Road

*25 minutes. By the end you will know exactly what makes data "protected," the eighteen things that count as identifiers, and why de-identification, encryption, and access control are three different jobs you cannot substitute for one another.*

For six lessons we have talked about security in general terms — networks, encryption, attacks, defenses. Now we turn fully clinical and ask the question all of it was really for: *what, precisely, are we protecting, and what are we obliged to do with it?* This is the part of the session a clinician cannot delegate to IT, because the rules are written about your daily material — the note you just typed, the list you just exported, the screenshot you were about to send a colleague.

## What makes data "protected"

Health information becomes **Protected Health Information — PHI** when two ingredients are present together:

1. **Health information** — a diagnosis, a lab value, a medication, a visit, an image, anything about a person's care; **plus**
2. **An identifier** — something that ties that health information to a *specific person*.

Either ingredient alone is usually harmless. "A patient had febrile neutropenia" is not PHI — it could be anyone. "Omar Haddad" in a phone book is not PHI. Put them together — "Omar Haddad had febrile neutropenia" — and you have PHI, and a duty of care over it.

> 🧠 **Remember.** PHI = health information **+** an identifier that points to a person. Remove the link to the person and, done properly, it stops being PHI. That single idea is the engine behind everything in this lesson and the next.

## A word on HIPAA — and on where we actually are

**HIPAA** is the United States law (the Health Insurance Portability and Accountability Act) that defines PHI and sets rules for handling it. We are in Jordan, not the United States, and Jordanian data-protection law and KHCC policy are what bind you legally. So why teach HIPAA? Because its definitions — especially its list of identifiers — have become the international common language for health-data privacy, and the AI Office adopts its principles as a floor, not a ceiling. Learn the HIPAA framework and you can read the privacy requirements of almost any collaborator, journal, dataset, or cloud vendor in the world.

HIPAA has two halves worth naming. The **Privacy Rule** governs *who may use or share* PHI and for what. The **Security Rule** governs *how you must protect* it technically — and that is where encryption, access control, and audit logs live. Privacy is the "may you?"; Security is the "how safely?"

## The eighteen identifiers

HIPAA names eighteen kinds of identifier. If you strip *all* of them from a record, the record is considered de-identified by the "Safe Harbor" method — no longer PHI. They are worth knowing as a checklist, because the obvious ones (a name) are easy and the non-obvious ones (a device serial number, a rare diagnosis plus a date plus a town) are where leaks actually happen.

| # | Identifier | # | Identifier |
|---|---|---|---|
| 1 | Names | 10 | Account numbers |
| 2 | Geographic detail smaller than a state (address, town) | 11 | Certificate / license numbers |
| 3 | Dates finer than a year tied to a person (DOB, admission, death) | 12 | Vehicle identifiers / plates |
| 4 | Telephone numbers | 13 | Device identifiers / serial numbers |
| 5 | Fax numbers | 14 | Web URLs |
| 6 | Email addresses | 15 | IP addresses |
| 7 | National ID / social-security numbers | 16 | Biometric identifiers (fingerprints, voiceprints) |
| 8 | **Medical record numbers (MRN)** | 17 | Full-face photographs and comparable images |
| 9 | Health-plan beneficiary numbers | 18 | Any other unique identifying number or characteristic |

Two rules ride along with the list: **dates** must be reduced to the year, and **ages over 89** must be bundled into a single "90+" category (because the very old are rare enough to be identifying on their own).

> 🔧 **Technical Stuff.** Number 18 — "any other unique characteristic" — is the catch-all that trips people. A single ultra-rare tumour in a small town, on a known date, can identify a patient with no name attached at all. De-identification is not just deleting names; it is making sure no *combination* of what remains points to one person.

## Three jobs people confuse: de-identification, encryption, access control

These three words get used as if they were interchangeable. They are not. They are three different jobs, and doing one does not do the others.

- **De-identification** *removes or transforms the identifiers* so the data is no longer PHI at all. A de-identified dataset can be shared far more freely, because there is no longer a person to protect. This is the strongest protection because it removes the risk rather than guarding it.
- **Encryption** *scrambles the data* so that someone without the key cannot read it (Lessons 2–3). But encrypted PHI **is still PHI** — you have locked the filing cabinet, not emptied it. Lose the key safely and the patient is still in there.
- **Access control** *decides who is allowed in* — logins, roles, permissions, the principle of minimum-necessary. It governs the authorised; it does nothing against someone who steals the disk.

You generally want all three. The Session 11 app used two of them deliberately: it **encrypted** the patient name and **encoded** the MRN (identifiers #1 and #8) so the raw values never rested in plain sight. What it lacked — on purpose, as a teaching v1 — was real **access control**: it had no login at all. That gap is exactly why it was labelled "not for clinical use."

> 💡 **Tip.** When someone says "it's fine, the data is encrypted," ask the follow-ups: *Encrypted at rest and in transit? Who controls the key? And who is allowed to log in and decrypt it?* Encryption without access control is a strong lock with the door propped open.

## Minimum necessary, and "it's just for research"

Two principles cause most everyday violations.

**Minimum necessary:** use, access, and share the *least* PHI required for the task. Pulling a whole-cohort export when you needed three columns, or opening a chart you are not treating, breaks this even if you never tell a soul. Curiosity is not authorisation — and recall from Lesson 6 that a canary token is designed to catch exactly that browsing.

**"It's just for research" is not a free pass.** Research has its *own*, often stricter, governance: ethics-board approval, a defined dataset, data-use agreements, and de-identification before the data ever reaches an analyst's laptop. "I'll just grab real records to test my model" is one of the most common and most serious missteps — and Lesson 8 gives you the alternative that makes it unnecessary.

## Finding PHI in free text — the genuinely hard part

Structured fields are easy: a column labelled `MRN` obviously holds MRNs. The hard problem is **free text** — the progress note, the discharge summary, the referral letter — where a patient's daughter's name, a street, or a phone number sits mid-sentence with no label at all.

There are two complementary ways to find it, and you will use both in the hands-on kit for this session:

1. **Pattern matching (regex).** The structured-looking identifiers have shapes a computer can match reliably: an MRN is a run of digits, a phone number has a recognisable format, an email has an `@`, a date looks like a date. A rules pass catches these every time, with no AI and no internet.
2. **AI / language models.** The subtle cases have no fixed shape — a bare name, an indirect location ("the camp near Irbid"), a relative mentioned in passing. Here a language model, reading for *meaning*, catches what patterns miss. This is the same closed-set, structured-output discipline you used for the oncologic-emergency extractor in Session 11.

The scanner you will run combines them: the rules pass always runs (free, offline), and the AI pass is added for the subtle cases when a key is available — degrading gracefully to rules-only when it is not, exactly like the Session 11 extractor. You can clone the full kit from the **[`phi_tools` repo on GitHub](https://github.com/IyadSultan/phi_tools)** — `phi_scanner.py` plus `run_scan.py` and a pair of sample notes (`note_dirty.txt`, `note_clean.txt`) to scan.

> ⚠️ **Watch Out.** No scanner is perfect. A rules pass alone will miss an unlabelled name; an AI pass can miss an oddly-formatted number or hallucinate a match. A PHI scanner is a power tool that makes a human reviewer faster and more thorough — it is **not** a licence to stop reading. For anything leaving the hospital, a human still signs off.

## Hugging Face PHI detection lab (optional)

For a deeper hands-on pass, open the **[PHI Detection with Hugging Face](https://github.com/IyadSultan/CCI/blob/main/session12/PHI_Detection_HuggingFace.ipynb)** notebook ([run in Colab](https://colab.research.google.com/github/IyadSultan/CCI/blob/main/session12/PHI_Detection_HuggingFace.ipynb)). It loads [`mkocher/hipaa-phi-detector`](https://huggingface.co/mkocher/hipaa-phi-detector) from the Hugging Face Hub, runs NER over **synthetic** clinical notes, redacts detected spans, and audits findings across a small corpus — the same detect → redact → review loop, using a ready-made model instead of regex rules. **Synthetic notes only.** Never paste real PHI into Colab or a public LLM.

## Try This

1. Take the synthetic note in the Lesson 7 kit (`phi_tools/sample_notes/note_dirty.txt`) and, by eye, circle every identifier and label each with its number from the table above. Then run the scanner and compare — what did you miss, what did it miss?
2. For one real workflow you do weekly, name which of the three jobs — de-identification, encryption, access control — actually protects the data, and which is missing.
3. Find one example in your own recent practice where you used *more* PHI than the task strictly needed. That is the minimum-necessary principle made personal.

## Watch Out

The deepest trap is **re-identification**. Data can carry no names, no MRNs — pass a careless eye as "anonymous" — and still be traced to one person by combining what is left: a rare diagnosis, an exact date, a small town, an age. Stripping the eighteen identifiers is the floor, not a guarantee; for sensitive releases, someone has to ask whether the *combination* that remains could still point to a single patient.

Which raises the obvious question that ends this lesson: if real PHI is this hard to protect, this easy to leak, and this heavily governed — why keep real PHI lying around at all for demos, testing, and learning? Next lesson, the AI Office's answer: make the data safe by design.
