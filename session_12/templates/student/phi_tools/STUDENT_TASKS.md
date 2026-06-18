# Student Tasks — PHI Tools (Session 12)

Three short exercises. None require prior coding; each is one or two lines. The
complete answers are in `../../solutions/phi_tools/`.

## Task 1 — Teach the scanner to find IP addresses (Lesson 7)
**File:** `hipaa.py` → the `# 15 — IP address` block.
The IP-address pattern has been removed. Follow the `TODO` there: uncomment the
two lines and paste the `HINT` regex as the pattern. Then re-run:
```bash
python run_scan.py sample_notes/note_dirty.txt
```
You don't have an IP in the dirty note by default — add one (e.g. a line
`Accessed from 10.20.30.40`) and confirm your new `#15` finding appears.

## Task 2 — Run the round trip (Lesson 8)
Generate synthetic notes and prove they're clean:
```bash
cd synthetic && python generate.py && cd ..
python run_scan.py synthetic/out/synthetic_notes.txt
```
Write one sentence explaining *why* the scan finds zero PHI — what did the
generator do to the name and the MRN before writing the notes?

## Task 3 — Extend the generator without breaking safety (Lesson 8)
**File:** `synthetic/generate.py` → the `DIAGNOSES` list and the `STUDY THIS` note.
Add one more fake diagnosis to `DIAGNOSES`, re-run `python generate.py`, and
re-scan the output. Confirm it *still* reports zero PHI. Then find the two lines
marked `rule 1` / `rule 2` and explain, in your own words, why they are the whole
doctrine in two lines.

---

*Check your answers against `../../solutions/phi_tools/`.*
