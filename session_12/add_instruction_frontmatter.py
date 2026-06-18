"""Add Jekyll front matter to session_12 instruction markdown files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "instructions"

LESSONS = [
    (
        "lesson1_what_is_a_network.md",
        "Lesson 1: What Is a Network, Really?",
        "lesson1_what_is_a_network",
    ),
    (
        "lesson2_encryption_basics.md",
        "Lesson 2: Encryption, Plainly — Secrets, Eavesdroppers & HTTPS",
        "lesson2_encryption_basics",
    ),
    (
        "lesson3_encryption_types.md",
        "Lesson 3: Two Kinds of Keys — Symmetric, Asymmetric, At-Rest vs In-Transit",
        "lesson3_encryption_types",
    ),
    (
        "lesson4_how_attacks_work.md",
        "Lesson 4: How Attacks Actually Work",
        "lesson4_how_attacks_work",
    ),
    (
        "lesson5_passwords_and_mfa.md",
        "Lesson 5: Defending Yourself — Passwords, MFA & Least Privilege",
        "lesson5_passwords_and_mfa",
    ),
    (
        "lesson6_canary_tokens.md",
        "Lesson 6: The Honeypot Trick — Canary Tokens",
        "lesson6_canary_tokens",
    ),
    (
        "lesson7_phi_and_hipaa.md",
        "Lesson 7: PHI and HIPAA — The Rules of the Road",
        "lesson7_phi_and_hipaa",
    ),
    (
        "lesson8_synthetic_data_pipeline.md",
        "Lesson 8: The Synthetic-Data Pipeline — Safe Data by Design",
        "lesson8_synthetic_data_pipeline",
    ),
    (
        "lesson9_cloud_hardened_azure.md",
        "Lesson 9: The Cloud, Hardened — Azure CLI from Resource Group to Teardown",
        "lesson9_cloud_hardened_azure",
    ),
]

HEADER = """---
layout: page
title: "{title}"
permalink: /session_12/instructions/{slug}/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{{display:none!important}}
.site-header{{border-top:5px solid #AD1457!important}}
.site-title,.site-title:visited{{color:#AD1457!important;font-weight:800!important}}
</style>

"""


def main() -> None:
    for filename, title, slug in LESSONS:
        path = ROOT / filename
        text = path.read_text(encoding="utf-8")
        if text.startswith("---"):
            print(f"Skip (already has front matter): {filename}")
            continue
        path.write_text(HEADER.format(title=title, slug=slug) + text, encoding="utf-8")
        print(f"Updated {filename}")


if __name__ == "__main__":
    main()
