"""The HIPAA 18 identifiers, plus regex patterns for the structured ones.

This is the reference table from Session 12, Lesson 7, turned into data the
scanner can use. The point of separating it out: the *list* of what counts as
PHI is policy (it rarely changes), and the *patterns* that detect each one are
engineering (they get tuned). Keeping them here, apart from the scanner logic,
makes both easy to read and to extend.

Not every identifier has a reliable regex. A medical record number has a shape a
computer can match; a bare patient name in the middle of a sentence does not.
The ones with patterns below are caught by the rules pass in phi_scanner.py; the
shapeless ones (names, indirect locations) are what the optional AI pass is for.
"""
from __future__ import annotations

import re

# --- The 18 HIPAA identifiers (Safe Harbor) --------------------------------
# Number, short name. Strip ALL of these and a record is de-identified.
IDENTIFIERS = {
    1: "Names",
    2: "Geographic detail smaller than a state (address, town)",
    3: "Dates finer than a year tied to a person (DOB, admission, death)",
    4: "Telephone numbers",
    5: "Fax numbers",
    6: "Email addresses",
    7: "National ID / social-security numbers",
    8: "Medical record numbers (MRN)",
    9: "Health-plan beneficiary numbers",
    10: "Account numbers",
    11: "Certificate / license numbers",
    12: "Vehicle identifiers / plates",
    13: "Device identifiers / serial numbers",
    14: "Web URLs",
    15: "IP addresses",
    16: "Biometric identifiers",
    17: "Full-face photographs and comparable images",
    18: "Any other unique identifying number or characteristic",
}

# Two rules ride along with the list (Lesson 7):
#   * dates must be reduced to the year, and
#   * ages over 89 must be bundled into a single "90+" category.

# --- Regex patterns for the structured identifiers --------------------------
# Each entry: (identifier_number, label, compiled pattern).
# These are deliberately conservative — tuned to light up on the dirty sample
# note while leaving clean, de-identified prose alone (so a scan of properly
# generated synthetic notes returns zero findings).
PATTERNS = [
    # 6 — email
    (6, "email address",
     re.compile(r"\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b")),

    # 14 — web URL
    (14, "web URL",
     re.compile(r"\bhttps?://[^\s)]+", re.IGNORECASE)),

    # 15 — IP address
    (15, "IP address",
     re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")),

    # 8 — MRN, when labelled
    (8, "medical record number (MRN)",
     re.compile(r"\bMRN[:#\s]*\d{4,10}\b", re.IGNORECASE)),

    # 7 — national ID (Jordan national number is 10 digits), when labelled
    (7, "national ID number",
     re.compile(r"\b(?:national(?:\s+id)?|nat\.?\s*no|id)[:#\s]*\d{8,12}\b",
                re.IGNORECASE)),

    # 4 / 5 — phone & fax (Jordan mobile +962 7X XXXX XXXX or 07X-XXXXXXX), when labelled
    (4, "telephone / fax number",
     re.compile(r"\b(?:phone|tel|mobile|cell|fax)[:.\s]*\+?[\d\s().-]{7,15}\d",
                re.IGNORECASE)),

    # 3 — explicit dates (DD/MM/YYYY, YYYY-MM-DD, "12 Mar 2026", "March 12, 2026")
    (3, "specific date",
     re.compile(
         r"\b("
         r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}"
         r"|\d{4}-\d{2}-\d{2}"
         r"|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+\d{4}"
         r"|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}"
         r")\b",
         re.IGNORECASE)),

    # 1 — names, ONLY when honorific- or label-prefixed (bare names are the AI pass's job)
    (1, "personal name",
     re.compile(r"\b(?:Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?")),
    (1, "personal name (labelled field)",
     re.compile(r"\b(?:patient|name|son|daughter|father|mother|wife|husband)\s*:?\s*"
                r"[A-Z][a-z]+\s+[A-Z][a-z]+")),

    # 2 — age over 89 (must be bundled as 90+)
    (2, "age over 89 (must be reported as 90+)",
     re.compile(r"\b(?:9\d|1\d\d)\s*(?:-?\s*year[s]?(?:-old)?|\s*y/?o|\s*yrs?)\b",
                re.IGNORECASE)),
]


def all_patterns():
    """Yield (identifier_number, label, compiled_regex) for each rule."""
    yield from PATTERNS
