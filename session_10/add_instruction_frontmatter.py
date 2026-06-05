"""Add Jekyll front matter to session_10 instruction markdown files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "instructions"

LESSONS = [
    ("lesson1_prd.md", "Lesson 1: Writing a PRD with the PRD-Builder Skill", "lesson1_prd"),
    ("lesson2_claude_md.md", "Lesson 2: Memory with CLAUDE.md", "lesson2_claude_md"),
    ("lesson3_skills.md", "Lesson 3: Claude Code Skills", "lesson3_skills"),
    ("lesson4_mcp_connectors.md", "Lesson 4: MCP Servers and Anthropic Connectors", "lesson4_mcp_connectors"),
    ("lesson5_subagents.md", "Lesson 5: Subagents and Agent Teams", "lesson5_subagents"),
    ("lesson6_worktrees_workflows.md", "Lesson 6: Worktrees and Workflows", "lesson6_worktrees_workflows"),
    ("lesson7_loops_schedules_hooks.md", "Lesson 7: Long-Running — Loops, Schedules, Hooks", "lesson7_loops_schedules_hooks"),
    ("lesson8_factory_part1.md", "Lesson 8: Software Factory Part 1 — PRD to Story to Brief", "lesson8_factory_part1"),
    ("lesson9_factory_part2.md", "Lesson 9: Software Factory Part 2 — Build, Test, Validate", "lesson9_factory_part2"),
    ("lesson10_cheat_sheet.md", "Lesson 10: Cheat Sheet + What to Ship Next", "lesson10_cheat_sheet"),
]

HEADER = """---
layout: page
title: "{title}"
permalink: /session_10/instructions/{slug}/
---

<a class="back-btn" href="/CCI.io/session-10/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00838F;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #80DEEA;background:#E0F7FA;margin-bottom:1rem;">&#8249; Back to Session 10</a>

<style>
.site-nav{{display:none!important}}
.site-header{{border-top:5px solid #00838F!important}}
.site-title,.site-title:visited{{color:#00838F!important;font-weight:800!important}}
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
