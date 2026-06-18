---
layout: page
title: "Lesson 8: The Synthetic-Data Pipeline — Safe Data by Design"
permalink: /session_12/instructions/lesson8_synthetic_data_pipeline/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 8 — The Synthetic-Data Pipeline: Safe Data by Design

*25 minutes. By the end you will understand the one doctrine the AI Office builds every clinical pipeline around — make the data safe before it can leak, not after — and you will have seen the two tools that make it real: a scanner that finds PHI, and a generator that produces data with no PHI to find.*

Lesson 7 ended on an uncomfortable question. If real PHI is this hard to protect, this easy to leak by an unlucky combination, and this heavily governed — *why keep real PHI lying around for demos, testing, and learning at all?* This lesson is the AI Office's answer, and it is the most important habit in the whole session: **the safest patient data is data that was never real.** Everything else we have taught — encryption, access control, firewalls — guards a thing that is still dangerous. This lesson is about removing the danger at the source.

## Two ways to be safe: clean up after, or never make the mess

There are two fundamentally different postures toward PHI, and almost every data disaster in healthcare comes from confusing them.

The first is **reactive**: let real PHI flow wherever the work takes it — onto a laptop to test a model, into a spreadsheet to make a chart, attached to an email to a collaborator — and then try to protect it everywhere it landed. This is exhausting and it always loses, because protecting data in a hundred places means a hundred chances to slip, and you only have to slip once.

The second is **preventive**: arrange things so the dangerous data never leaves the one secure place it belongs, and everything *downstream* — the test run, the chart, the shared file, the demo — works on data that was made safe before it ever moved. You are not guarding a leak; you have arranged for there to be nothing to leak.

The AI Office calls this **safe data by design**, and it has a sharper name for the engineering discipline behind it: **preventive de-identification.** Not "de-identify the export when someone asks for it" — de-identify *by default, at the source, before any output exists.*

> 🧠 **Remember.** Reactive security guards dangerous data in many places and must never fail. Preventive design makes the data safe once, at the source, so a failure downstream leaks nothing. The whole AIDI doctrine is the second posture, made into a habit you cannot forget to apply.

## The doctrine, in four rules

The AI Office runs its clinical data pipelines by four rules. They are not aspirations on a poster; they are wired into the code so that doing the wrong thing takes *extra* effort, and the easy path is the safe one.

1. **Every MRN is encoded before it is stored or shown.** The raw medical record number — identifier #8 from Lesson 7 — never sits in a database, a log, or an output file in the clear. It is run through the reversible Optimus transform first. You met this exact function in your Session 11 app: `encode_mrn`.
2. **Every patient name is encrypted before any output.** The name — identifier #1 — is Fernet-encrypted at rest and never written to a log. Again, the same function from your Session 11 app: `encrypt_name`. The plaintext name exists for the briefest possible moment and is never persisted in readable form.
3. **Keys live in a secret vault, never in the code.** The Optimus seed and the Fernet key are pulled from a managed key vault at runtime — never hard-coded, never committed, never emailed. (Your Session 11 app read them from environment variables as a teaching stand-in; production reads them from the AI Office's managed vault, which is the same idea with real key rotation and access logging behind it.)
4. **Models are evaluated on a frozen deceased-patient cohort.** When the office needs *real* records to measure how well an extractor or model performs, it uses a fixed, access-controlled set drawn from deceased patients — a cohort that does not change under you, is governed and logged, and minimises the privacy exposure of the living. Evaluation is the one place real data is unavoidable, so it is fenced off tightly rather than scattered.

> 🔧 **Technical Stuff.** Rules 1 and 2 are not new code you must trust me about — they are the literal `crypto.py` from your Session 11 ER-triage app: `encode_mrn`/`decode_mrn` (Optimus, a reversible integer transform) and `encrypt_name`/`decrypt_name` (Fernet, symmetric encryption from Lesson 3). The synthetic-data kit in this lesson imports that same module, unchanged. The point is continuity: the protection you built into a teaching app in Session 11 *is* the protection the AI Office uses in production. These are not toy ideas.

## Why synthetic data is the cure, not just a convenience

Rules 1–4 handle the real data that genuinely must exist. But most of the time you do not actually need real patients at all. You need *realistic-shaped* data — records that look and behave like clinical records so your code, your demo, or your teaching example exercises the same paths real data would — without belonging to a single living person.

That is **synthetic data**: realistic but fake. A generated patient named "Layla Haddad" with MRN 4011992 and a febrile-neutropenia presentation is structurally indistinguishable from a real triage row — same fields, same value ranges, same plausibility — except that Layla Haddad does not exist. There is no patient to re-identify, no chart to subpoena, no duty of care attached. You can put it in a public demo, paste it into a slide, email it to a vendor, or commit it to a GitHub repo, and you have leaked exactly nothing.

This is the move that makes the dilemma at the end of Lesson 7 evaporate. "I'll just grab real records to test my model" — the single most common and most serious misstep — stops being tempting the moment generating a thousand fake-but-realistic records takes one command. You did not weaken the rules; you removed the reason anyone would break them.

> 💡 **Tip.** When you are about to use real patient data for *anything that is not direct patient care or governed evaluation* — a demo, a screenshot, a quick test, a teaching example, a bug report — stop and ask: *would synthetic data do the job here?* The honest answer is almost always yes. Real PHI in a demo is a risk you took for no benefit you could not have gotten for free.

## The two tools, and how they prove each other

This lesson ships with a small kit (`phi_tools/`) that contains the two halves of the doctrine, and the cleverest thing about them is that **each one tests the other.**

- **The PHI scanner** (which you also met in Lesson 7) reads a clinical note and flags every identifier it can find — a regex pass for the structured-looking ones (MRNs, phone numbers, emails, dates), plus an optional AI pass for the subtle, unlabelled ones (a bare name, an indirect location). It is the *detector*: it tells you where the PHI is.
- **The synthetic generator** (`phi_tools/synthetic/`) produces realistic-but-fake clinical records, applying rules 1 and 2 — every MRN run through `encode_mrn`, every name through `encrypt_name` — before anything is written out. It is the *cure*: it makes data that is safe by construction.

Now the proof. Run the scanner on a real-style "dirty" note and it lights up with findings — names, MRNs, phones, dates. Run the *same scanner* on the generator's output, and you should get **zero findings.** That zero is not luck and it is not the scanner being lazy; it is the doctrine working. The generator put nothing identifying into the output, so the detector — using the very same rules that found everything in the dirty note — finds nothing. The cure passes the test set by the detector. That round trip, problem-then-cure, is the whole lesson in one command.

> ⚠️ **Watch Out.** "Zero findings from the scanner" means *no PHI the scanner knows how to recognise* — it is strong evidence, not a mathematical proof of anonymity. Two cautions carry over from Lesson 7. First, re-identification by *combination* (a rare diagnosis + an exact date + a small town) can survive a field-by-field scan, so synthetic data must also avoid copying real rare combinations. Second, a scanner is a power tool for a human reviewer, never a replacement: for anything leaving the hospital, a person still signs off. Safe-by-design lowers the risk dramatically; it does not abolish the need to think.

## Where this sits in a real pipeline

Picture the AI Office building an oncologic-emergency extractor like the one in your Session 11 app. The pipeline that surrounds it looks like this:

- **Ingest** real records *only* inside the secure environment, where rules 1–3 apply automatically: MRNs encoded, names encrypted, keys from the vault.
- **Develop and demo** against *synthetic* records, generated to mimic the real distribution, so nothing identifying ever reaches a developer's laptop, a slide, or a repo.
- **Evaluate** the finished model against the *frozen deceased-patient cohort* — governed, logged, minimal — to get an honest performance number on real data without putting living patients at risk.
- **Ship** outputs that have been through the encode/encrypt layer, so even the production system's logs and exports carry no PHI in the clear.

Notice that real PHI appears in exactly two tightly-fenced places — secure ingest and governed evaluation — and *nowhere else in the entire lifecycle*. Everything a human touches day to day is synthetic. That is what "safe by design" buys you: not a promise to be careful, but an architecture where being careless is hard.

## Try This

1. **Run the round trip.** In the `phi_tools/` kit, run the scanner on `sample_notes/note_dirty.txt` and read its findings. Then run the synthetic generator and run the scanner on its output. Confirm the second scan returns zero findings — and write one sentence explaining *why* that zero is the doctrine working, not the scanner failing.
2. **Find the real data in your own week.** List every time in the last week you used real patient data for something that was *not* direct care or a governed study — a test, a screenshot, a chart for a talk, a message to a colleague. For each one, decide honestly: would synthetic data have done the job?
3. **Map the four rules onto Session 11.** Open `crypto.py` from your Session 11 app. Point to the line that satisfies rule 1 (encode the MRN) and the line that satisfies rule 2 (encrypt the name). Then name the rule your Session 11 app did *not* satisfy, and where production would get it (hint: rule 3 — the key vault).

## Watch Out

The seductive trap here is "it's only synthetic, so anything goes." Two ways that bites:

- **Leaky generators.** A generator that builds fake records by lightly editing real ones — swapping a name but keeping the real MRN, date, and rare diagnosis — is not synthetic data; it is thinly-disguised real data, and it can be re-identified. Genuinely synthetic data is generated *from distributions and rules*, not copied from a real chart. The kit's generator builds each record fresh and runs everything through the encode/encrypt layer precisely so nothing real survives.
- **Skipping the rules because "it's just a test."** The four rules are wired into the pipeline exactly so that "just a test" is not an exception. The moment you carve out "I'll skip de-id this once, it's only for me," you have rebuilt the reactive posture you were trying to escape — and you only have to be wrong once.

You now have the doctrine and the tools that make patient data safe before it can move. The last piece of the session is the place all of this eventually runs: the cloud. In Lesson 9 you will stand up a real server the way the AI Office does — locked down, minimal, logged in with keys not passwords — and, just as importantly, **tear it back down** so it can be neither attacked nor billed.
