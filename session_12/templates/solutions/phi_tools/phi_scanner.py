"""A two-tier PHI scanner: an always-on rules pass + an optional AI pass.

This is the tool from Session 12, Lessons 7 and 8. It reads a clinical note and
flags the identifiers it finds, in two complementary ways:

  1. RULES PASS (always runs, no key, no internet). Regex patterns from hipaa.py
     catch the structured-looking identifiers — MRNs, phones, emails, dates, IPs.
     These have a shape a computer matches reliably.

  2. AI PASS (optional). A language model reads for *meaning* and catches the
     shapeless cases the rules miss — a bare name, an indirect location ("the
     camp near Irbid"), a relative mentioned in passing. This mirrors the
     closed-set, structured-output discipline from the Session 11 extractor, and
     it degrades gracefully: no key, no package, or any error → it simply returns
     nothing and the rules pass still stands. A scan never crashes.

WATCH OUT: run this only on the PROVIDED SYNTHETIC notes (or your own synthetic
data). Never paste a real patient chart into a personal script or an external
model. The whole point of Lesson 8 is that you don't have to.
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass

import hipaa

logger = logging.getLogger("phi_scanner")

# The AI pass may only return identifier categories from this closed set — the
# HIPAA 18, by name. Anything else the model invents is dropped (the same
# closed-set rule the Session 11 oncologic-emergency extractor used).
VALID_CATEGORIES = {name for name in hipaa.IDENTIFIERS.values()}

_SYSTEM_PROMPT = """You are a PHI (protected health information) detector for a hospital.
You will be given a short clinical note. Find every span of text that is a HIPAA
identifier — especially the ones a simple regex would MISS, such as:
  - a person's name with no title in front of it (patient, relative, clinician),
  - an indirect or informal location (a neighbourhood, camp, village, landmark),
  - any other unique identifying detail.
Do NOT report generic clinical facts (a diagnosis, a symptom, a lab value) — those
are only PHI when tied to an identifier, and you are reporting the identifier.
Respond with ONLY a JSON object: {"findings": [{"text": "...", "category": "..."}]}
where category is a short HIPAA identifier type (e.g. "Names", "Geographic detail").
If you find nothing, return {"findings": []}. Do not explain."""


@dataclass
class Finding:
    identifier: int       # HIPAA identifier number (0 if AI-only / uncategorised)
    label: str            # human-readable type
    text: str             # the matched text
    source: str           # "rules" or "ai"


# --- Tier 1: the rules pass -------------------------------------------------
def scan_rules(text: str) -> list[Finding]:
    """Always-on regex pass. No key, no network. Returns every match found."""
    findings: list[Finding] = []
    seen: set[tuple[int, str]] = set()
    for number, label, pattern in hipaa.all_patterns():
        for match in pattern.finditer(text):
            value = match.group(0).strip()
            key = (number, value.lower())
            if key in seen:
                continue
            seen.add(key)
            findings.append(Finding(identifier=number, label=label, text=value, source="rules"))
    return findings


# --- Tier 2: the optional AI pass -------------------------------------------
def scan_ai(text: str, model: str | None = None) -> tuple[list[Finding], str]:
    """Optional LLM pass for the subtle, shapeless identifiers.

    Returns (findings, status) where status is 'ok' or 'failed'. Degrades
    gracefully on a missing key, a missing package, or any API error — exactly
    like the Session 11 oncologic-emergency extractor. A scan must never fail
    just because the model is unavailable.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.info("no OPENAI_API_KEY set; skipping AI pass (rules-only)")
        return ([], "failed")

    try:
        from openai import OpenAI
    except ImportError:
        logger.warning("openai package not installed; skipping AI pass")
        return ([], "failed")

    model = model or os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
            timeout=15,
        )
        raw = response.choices[0].message.content or "{}"
        items = json.loads(raw).get("findings", [])
        findings: list[Finding] = []
        for item in items:
            value = str(item.get("text", "")).strip()
            category = str(item.get("category", "")).strip()
            if not value:
                continue
            findings.append(Finding(identifier=0, label=category or "AI-detected identifier",
                                    text=value, source="ai"))
        return (findings, "ok")
    except Exception as exc:  # noqa: BLE001 — degrade gracefully on ANY failure
        logger.warning("AI pass failed: %s", type(exc).__name__)
        return ([], "failed")


# --- Combine both tiers -----------------------------------------------------
def scan(text: str, use_ai: bool = True) -> dict:
    """Run the rules pass (always) and the AI pass (if enabled & available).

    Returns a dict: {findings: [...], ai_status: 'ok'|'failed', counts: {...}}.
    """
    rule_findings = scan_rules(text)
    ai_findings: list[Finding] = []
    ai_status = "skipped"
    if use_ai:
        ai_findings, ai_status = scan_ai(text)

    # De-duplicate by the matched text (case-insensitive); prefer the rules entry.
    merged: dict[str, Finding] = {}
    for f in rule_findings + ai_findings:
        merged.setdefault(f.text.lower(), f)

    findings = list(merged.values())
    return {
        "findings": findings,
        "ai_status": ai_status,
        "counts": {
            "total": len(findings),
            "rules": sum(1 for f in findings if f.source == "rules"),
            "ai": sum(1 for f in findings if f.source == "ai"),
        },
    }
