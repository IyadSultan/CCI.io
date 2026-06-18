# Synthetic-Data Generator — CCI Session 12, Lesson 8

The "cure" half of the PHI kit. It mints realistic-but-**fake** oncology triage
records and applies the AI Office doctrine — **every MRN encoded, every name
encrypted, before any output** — using the *exact* crypto module from your
Session 11 app (`crypto.py`, copied here verbatim).

## Run it

```bash
# from the phi_tools/synthetic folder (no key needed — crypto.py has dev fallbacks)
python generate.py
```

It writes two files into `out/`:

| File | What it is | Safe to share? |
|---|---|---|
| `synthetic_notes.txt` | De-identified free-text notes — no name, MRN, date, or exact age in the prose | **Yes** — this is the demo/test/teaching artifact |
| `protected_records.jsonl` | The re-identification linkage: `ref` = `encode_mrn(mrn)`, `name_token` = base64 of `encrypt_name(name)`, plus non-identifying clinical fields | Stays in the secure zone — it's protected, not anonymous |

## The whole point: prove it with the scanner

```bash
cd ..
python run_scan.py synthetic/out/synthetic_notes.txt
```

Expected result: **✅ No PHI found** — using the same rules that lit up
`sample_notes/note_dirty.txt`. The generator put nothing identifying into the
shareable notes, so the detector finds nothing. Problem (scanner) → cure
(generator) → proof (clean scan).

## Why this is genuinely safe

- The records are built **fresh from distributions**, not copied from real charts —
  so nothing real survives (no leaky "swap the name, keep the MRN" shortcut).
- Identifiers exist only in **encoded/encrypted** form, only in the sidecar.
- Dates are reduced to the **year**; ages to a **band** — the Lesson 7 rules.

> ⚠️ `crypto.py` here is a verbatim copy of Session 11's module — do not edit it.
> The dev key fallbacks make it run out of the box; production reads `FERNET_KEY` /
> `OPTIMUS_RANDOM` from the AI Office's managed vault, never from a file.

---

*CCI · Session 12 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*
