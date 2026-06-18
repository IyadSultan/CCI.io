"""Synthetic clinical-data generator — safe data by design (Session 12, Lesson 8).

This is the "cure" half of the PHI kit. It mints realistic-but-FAKE oncology
triage records and writes two artifacts:

  out/synthetic_notes.txt      free-text notes, DE-IDENTIFIED by construction —
                               no names, no MRNs, no dates, no exact ages in the
                               prose. This is the shareable/demo/test artifact.
                               Scan it and you should get ZERO findings.

  out/protected_records.jsonl  the protected re-identification linkage that would
                               stay inside the secure zone: the MRN run through
                               encode_mrn(), the name run through encrypt_name()
                               (stored as base64 ciphertext), plus non-identifying
                               clinical fields. Demonstrates the doctrine's rules
                               1 & 2 using the EXACT Session 11 crypto.

The doctrine (Lesson 8): every MRN encoded, every name encrypted BEFORE any
output exists. The identifiers never appear in the clear anywhere — they live
only in encoded/encrypted form, and only in the sidecar.

No real patients. No network. No keys required (crypto.py uses dev-safe fallbacks,
exactly like Session 11; production reads keys from the AI Office vault).
"""
from __future__ import annotations

import base64
import json
import os
import random

from crypto import decode_mrn, decrypt_name, encode_mrn, encrypt_name

# --- Fake building blocks (clearly not real people) -------------------------
GIVEN = ["Omar", "Layla", "Sami", "Noor", "Kareem", "Salma", "Yousef", "Dana",
         "Tariq", "Maya", "Hadi", "Rania", "Faris", "Lina", "Ziad", "Hala"]
FAMILY = ["Haddad", "Khalil", "Nasser", "Saleh", "Darwish", "Aziz", "Mansour",
          "Qasim", "Barakat", "Hijazi", "Salem", "Toukan"]
DIAGNOSES = ["AML", "ALL", "Hodgkin lymphoma", "non-Hodgkin lymphoma",
             "multiple myeloma", "breast carcinoma", "colorectal carcinoma",
             "osteosarcoma"]
PRESENTATIONS = [
    ("fever to {temp}C, rigors, and fatigue", 1),
    ("new back pain with leg weakness", 1),
    ("confusion, constipation, and profound fatigue", 2),
    ("reduced urine output and palpitations after recent chemotherapy", 1),
    ("mucositis and poor oral intake", 3),
    ("shortness of breath on exertion", 2),
]
AGE_BANDS = ["in their 20s", "in their 30s", "in their 40s", "in their 50s",
             "in their 60s", "in their 70s"]


def make_record(rng: random.Random) -> dict:
    """One fake record. The raw name/MRN exist ONLY long enough to protect them."""
    name = f"{rng.choice(GIVEN)} {rng.choice(FAMILY)}"     # fake person
    mrn = rng.randint(1_000_000, 9_999_999)                # fake 7-digit MRN
    dx = rng.choice(DIAGNOSES)
    presentation, acuity = rng.choice(PRESENTATIONS)
    presentation = presentation.format(temp=round(rng.uniform(38.0, 39.6), 1))
    age_band = rng.choice(AGE_BANDS)
    day = rng.randint(1, 21)

    # De-identified prose: NO name, NO MRN, NO date, NO exact age. (Lesson 7's
    # rules: dates -> year only; this note carries no date at all.)
    note = (f"A patient {age_band} with known {dx}, day {day} post-chemotherapy, "
            f"presented with {presentation}. Neutropenic precautions considered; "
            f"on-call heme-onc informed. Triage acuity: {acuity}.")

    # Protected linkage (rules 1 & 2): encode the MRN, encrypt the name, BEFORE output.
    # >>> STUDY THIS (Lesson 8): the two lines marked "rule 1" / "rule 2" ARE the
    #     doctrine. The raw mrn and name never reach an output file in the clear —
    #     they are encoded/encrypted first. This is the whole lesson, in two lines.
    #     TODO (Task 3): add one more fake diagnosis to the DIAGNOSES list above,
    #     re-run, and confirm a scan of out/synthetic_notes.txt still finds ZERO PHI.
    protected = {
        "ref": encode_mrn(mrn),                                          # rule 1
        "name_token": base64.b64encode(encrypt_name(name)).decode("ascii"),  # rule 2
        "year": 2026,                                                    # date -> year only
        "age_band": age_band,
        "dx": dx,
        "acuity": acuity,
    }
    return {"note": note, "protected": protected, "_raw_name": name, "_raw_mrn": mrn}


def main(n: int = 12, seed: int = 12) -> None:
    rng = random.Random(seed)                # seeded -> reproducible, no Math.random surprises
    records = [make_record(rng) for _ in range(n)]

    out_dir = os.path.join(os.path.dirname(__file__), "out")
    os.makedirs(out_dir, exist_ok=True)

    notes_path = os.path.join(out_dir, "synthetic_notes.txt")
    with open(notes_path, "w", encoding="utf-8") as fh:
        fh.write("*** SYNTHETIC NOTES — generated, no real patients. CCI Session 12. ***\n\n")
        for i, rec in enumerate(records, 1):
            fh.write(f"--- Synthetic note {i} ---\n{rec['note']}\n\n")

    sidecar_path = os.path.join(out_dir, "protected_records.jsonl")
    with open(sidecar_path, "w", encoding="utf-8") as fh:
        for rec in records:
            fh.write(json.dumps(rec["protected"]) + "\n")

    # Prove the protection is reversible inside the secure zone (the vault can recover it).
    first = records[0]
    recovered_mrn = decode_mrn(first["protected"]["ref"])
    recovered_name = decrypt_name(base64.b64decode(first["protected"]["name_token"]))

    print(f"Generated {n} synthetic records.")
    print(f"  Encoded {n} MRNs and encrypted {n} names (Session 11 crypto, dev keys).")
    print(f"  Wrote {notes_path}")
    print(f"  Wrote {sidecar_path}")
    print(f"\nReversibility check on record 1 (inside the secure zone only):")
    print(f"  raw MRN {first['_raw_mrn']} -> ref {first['protected']['ref']} -> decoded {recovered_mrn}")
    print(f"  raw name {first['_raw_name']!r} -> token (base64 ciphertext) -> decrypted {recovered_name!r}")
    print(f"\nNow scan the de-identified notes — expect ZERO findings:")
    print(f"  python ../run_scan.py out/synthetic_notes.txt")


if __name__ == "__main__":
    main()
