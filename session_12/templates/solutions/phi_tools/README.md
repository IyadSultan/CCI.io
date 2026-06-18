# PHI Tools — CCI Session 12

Two small, **runnable** tools that together teach the AI Office's "safe data by
design" doctrine:

- **A PHI scanner** (`phi_scanner.py` + `run_scan.py`) — reads a clinical note and
  flags the HIPAA identifiers it finds. It always runs a **rules pass** (regex, no
  key, no internet) and adds an optional **AI pass** for the subtle, unlabelled
  cases. This is the tool from **Lesson 7**.
- **A synthetic-data generator** (`synthetic/`) — produces realistic-but-fake
  clinical notes with no real PHI, reusing the *exact* encryption from your
  Session 11 app. This is the tool from **Lesson 8**.

The pair proves each other: the scanner lights up on a real-style note, and finds
**nothing** in the generator's output. That round trip is the whole point.

> ⚠️ **Run the scanner only on the provided synthetic notes (or your own synthetic
> data). Never paste a real patient chart into this script or any external model.**
> Lesson 8 exists precisely so you never have to.

## Run it (3 minutes)

From inside the `phi_tools` folder:

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt    # optional — only needed for the AI pass / generator

# 1. Scan a "dirty" note — it lights up with findings:
python run_scan.py sample_notes/note_dirty.txt

# 2. Scan a hand-de-identified note — far fewer / zero findings:
python run_scan.py sample_notes/note_clean.txt
```

You do **not** need an OpenAI key to run the scanner. Without one, the rules pass
runs and the AI pass reports `ai_status="failed"` — by design. To enable the AI
pass for the subtle cases, copy `.env.example` to `.env` and paste your key.

```bash
python run_scan.py sample_notes/note_dirty.txt --no-ai    # force rules-only
```

## The round trip (Lesson 8)

```bash
cd synthetic
python generate.py                 # writes out/synthetic_notes.txt (+ protected sidecar)
cd ..
python run_scan.py synthetic/out/synthetic_notes.txt
```

The scan of the generator's notes should report **✅ No PHI found** — using the very
same rules that found everything in `note_dirty.txt`. The generator put nothing
identifying into the shareable notes, so the detector finds nothing. The cure
passes the test set by the detector.

## What's inside

```
phi_tools/
├── hipaa.py            # the HIPAA 18 identifiers + regex patterns for the structured ones
├── phi_scanner.py      # two-tier scanner: scan_rules() (always) + scan_ai() (optional, degrades)
├── run_scan.py         # CLI: python run_scan.py <note.txt> [--no-ai]
├── sample_notes/
│   ├── note_dirty.txt  # synthetic note full of identifiers — lights up
│   └── note_clean.txt  # the same story, de-identified by hand — quiet
├── requirements.txt    # all optional (rules pass needs only the stdlib)
├── .env.example        # OPENAI_API_KEY (AI pass) + FERNET_KEY / OPTIMUS_RANDOM (generator)
├── .gitignore          # excludes .env, keys, out/
└── synthetic/          # the generator — see synthetic/README.md
```

## How the AI pass degrades (and why)

`scan_ai()` is a deliberate copy of the Session 11 oncologic-emergency extractor's
discipline:

1. No `OPENAI_API_KEY` → return nothing, status `failed`.
2. `openai` package not installed → return nothing, status `failed`.
3. Any API error (network, timeout, auth) → return nothing, status `failed`.
4. The model may only return identifier **categories** — anything it invents is dropped.

A scan therefore never crashes and never depends on the internet to be useful. The
rules pass always stands on its own.

## Watch Out

- A scanner is a **power tool for a human reviewer, not a replacement.** Rules miss
  unlabelled names; AI can miss an oddly-formatted number or hallucinate a match.
  For anything leaving the hospital, a human still signs off.
- "Zero findings" means *no identifier the scanner recognises* — not a mathematical
  proof of anonymity. Re-identification by **combination** (a rare diagnosis + an
  exact date + a small town) can survive a field-by-field scan. Think, don't just scan.

---

*CCI · Session 12 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*
