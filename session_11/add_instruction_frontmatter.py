"""Add Jekyll front matter to session_11 instruction markdown files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "instructions"

LESSONS = [
    ("lesson1_html.md", "Lesson 1: What Is a Web Page? HTML from Scratch", "lesson1_html"),
    (
        "lesson2_javascript_frontends.md",
        "Lesson 2: Making It Move — JavaScript & the Frontend Landscape",
        "lesson2_javascript_frontends",
    ),
    (
        "lesson3_full_stack.md",
        "Lesson 3: The Full Stack — Frontend, Backend, and Where Django Lives",
        "lesson3_full_stack",
    ),
    ("lesson4_smallest_django.md", "Lesson 4: The Smallest Django That Runs", "lesson4_smallest_django"),
    ("lesson5_meet_the_app.md", "Lesson 5: Meet the ER-Triage App", "lesson5_meet_the_app"),
    ("lesson6_extend_it.md", "Lesson 6: Extend It — Add Your Own Django App", "lesson6_extend_it"),
    ("lesson7_ship_on_render.md", "Lesson 7: Ship It — GitHub to Render to a Live URL", "lesson7_ship_on_render"),
    ("lesson8_cheat_sheet.md", "Lesson 8: Cheat Sheet + What to Build Next", "lesson8_cheat_sheet"),
]

HEADER = """---
layout: page
title: "{title}"
permalink: /session_11/instructions/{slug}/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{{display:none!important}}
.site-header{{border-top:5px solid #EF6C00!important}}
.site-title,.site-title:visited{{color:#EF6C00!important;font-weight:800!important}}
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
