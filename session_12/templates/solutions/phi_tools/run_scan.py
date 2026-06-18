"""Command-line entry point for the PHI scanner.

Usage:
    python run_scan.py sample_notes/note_dirty.txt
    python run_scan.py sample_notes/note_clean.txt
    python run_scan.py synthetic/out/synthetic_notes.txt   # after generating

    # rules pass only (no AI, even if a key is set):
    python run_scan.py sample_notes/note_dirty.txt --no-ai

The dirty note should light up with findings. The clean note — and the synthetic
generator's output — should return zero. That round trip is the whole lesson:
the generator is the cure, the scanner is the proof (Session 12, Lesson 8).
"""
from __future__ import annotations

import argparse
import sys

# Load a local .env if python-dotenv is installed (so OPENAI_API_KEY is picked up).
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from phi_scanner import scan


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan a note for PHI (HIPAA 18 identifiers).")
    parser.add_argument("path", help="path to a .txt note to scan")
    parser.add_argument("--no-ai", action="store_true",
                        help="run the rules pass only, even if an API key is set")
    args = parser.parse_args()

    try:
        with open(args.path, "r", encoding="utf-8") as fh:
            text = fh.read()
    except OSError as exc:
        print(f"Could not read {args.path}: {exc}", file=sys.stderr)
        return 2

    result = scan(text, use_ai=not args.no_ai)
    findings = result["findings"]
    counts = result["counts"]

    print(f"\nScanned: {args.path}")
    print(f"AI pass: {result['ai_status']}  "
          f"(rules always run; 'failed'/'skipped' means rules-only)\n")

    if not findings:
        print("✅ No PHI found. (For synthetic / properly de-identified notes, this is the goal.)")
        return 0

    print(f"⚠️  {counts['total']} potential identifier(s) found "
          f"[{counts['rules']} by rules, {counts['ai']} by AI]:\n")
    for f in sorted(findings, key=lambda x: (x.identifier, x.source)):
        tag = f"#{f.identifier}" if f.identifier else "AI"
        print(f"  [{tag:>3}] {f.label:<42} → {f.text!r}  ({f.source})")

    print("\nA scanner makes a human reviewer faster — it does not replace one. "
          "For anything leaving the hospital, a person still signs off.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
