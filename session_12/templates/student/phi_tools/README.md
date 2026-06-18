# PHI Tools — CCI Session 12 (STUDENT version)

This is the **student** copy. It runs out of the box, and it has a few small
`TODO` exercises marked in the code (see `STUDENT_TASKS.md`). The complete answers
live in `../../solutions/phi_tools/`.

Two tools that teach "safe data by design":

- **A PHI scanner** (`phi_scanner.py` + `run_scan.py`) — flags HIPAA identifiers in
  a note. Always runs a **rules pass** (regex, no key, no internet); adds an
  optional **AI pass** for the subtle cases. (Lesson 7.)
- **A synthetic-data generator** (`synthetic/`) — makes realistic-but-fake notes
  with no real PHI, reusing the *exact* encryption from your Session 11 app.
  (Lesson 8.)

> ⚠️ **Run the scanner only on the provided synthetic notes (or your own synthetic
> data). Never paste a real patient chart into this script or any external model.**

## Run it (3 minutes)

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt    # optional — only for the AI pass / generator

python run_scan.py sample_notes/note_dirty.txt    # lights up with findings
python run_scan.py sample_notes/note_clean.txt    # quiet
```

No OpenAI key needed — the rules pass runs without one (the AI pass just reports
`ai_status="failed"`, by design). Add a key in `.env` to enable the AI pass.

## The round trip (Lesson 8)

```bash
cd synthetic && python generate.py && cd ..
python run_scan.py synthetic/out/synthetic_notes.txt    # expect: ✅ No PHI found
```

## Your tasks

Open `STUDENT_TASKS.md` and complete the three `TODO`s marked in the code. Each is
small and safe; check your work against the `solutions/` folder.

---

*CCI · Session 12 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*
