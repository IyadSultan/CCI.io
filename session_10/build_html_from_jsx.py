"""Build standalone HTML pages from session_10 quiz/practice JSX files."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASEURL = "/CCI.io"
SESSION_URL = f"{BASEURL}/session-10/"

QUIZ_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #00838F; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #80DEEA; background: #E0F7FA; margin-bottom: 1rem; }
    .back-link:hover { background: #B2EBF2; }
"""

PRACTICE_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #00695C; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #A5D6A7; background: #E8F5E9; margin-bottom: 1rem; }
    .back-link:hover { background: #C8E6C9; }
"""

TITLES = {
    "quiz_lesson1_prd": "Quiz: PRD-Builder Skill",
    "quiz_lesson2_claude_md": "Quiz: CLAUDE.md Memory",
    "quiz_lesson3_skills": "Quiz: Claude Code Skills",
    "quiz_lesson4_mcp_connectors": "Quiz: MCP & Connectors",
    "quiz_lesson5_subagents": "Quiz: Subagents & Agent Teams",
    "quiz_lesson6_worktrees_workflows": "Quiz: Worktrees & Workflows",
    "quiz_lesson7_loops_schedules_hooks": "Quiz: Loops, Schedules & Hooks",
    "quiz_lesson8_factory_part1": "Quiz: Software Factory Part 1",
    "quiz_lesson9_factory_part2": "Quiz: Software Factory Part 2",
    "quiz_lesson10_cheat_sheet": "Quiz: Session 10 Cheat Sheet",
    "practice_lesson1_prd": "Practice: PRD Triage",
    "practice_lesson2_claude_md": "Practice: CLAUDE.md Editor",
    "practice_lesson3_skills": "Practice: Skill Description Writer",
    "practice_lesson4_mcp_connectors": "Practice: MCP Scope Picker",
    "practice_lesson5_subagents": "Practice: Subagent Designer",
    "practice_lesson6_worktrees_workflows": "Practice: Worktree vs Workflow",
    "practice_lesson7_loops_schedules_hooks": "Practice: Hook Event Matcher",
    "practice_lesson8_factory_part1": "Practice: Factory Gates Part 1",
    "practice_lesson9_factory_part2": "Practice: Factory Gates Part 2",
    "practice_lesson10_cheat_sheet": "Practice: Session 10 Synthesis",
}


def jsx_to_app_body(source: str) -> str:
    body = source.strip()
    body = re.sub(r"^import\s+React.*?;\s*\n", "", body, flags=re.MULTILINE)
    body = re.sub(
        r"export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{",
        "function App() {",
        body,
    )
    return body.strip()


def wrap_html(kind: str, stem: str, app_body: str) -> str:
    title = TITLES.get(stem, stem.replace("_", " ").title())
    style = QUIZ_STYLE if kind == "quiz" else PRACTICE_STYLE
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>{style}</style>
</head>
<body>
  <a class="back-link" href="{SESSION_URL}">&#8249; Back to Session 10</a>
  <div id="root"></div>
  <script type="text/babel">
    const {{ useState }} = React;

{app_body}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
"""


def build_folder(folder: str, kind: str) -> int:
    src_dir = ROOT / folder
    count = 0
    for jsx_path in sorted(src_dir.glob("*.jsx")):
        app_body = jsx_to_app_body(jsx_path.read_text(encoding="utf-8"))
        html = wrap_html(kind, jsx_path.stem, app_body)
        out_path = jsx_path.with_suffix(".html")
        out_path.write_text(html, encoding="utf-8")
        print(f"Wrote {out_path.name}")
        count += 1
    return count


def main() -> None:
    quiz_count = build_folder("quizzes", "quiz")
    practice_count = build_folder("practices", "practice")
    print(f"Done: {quiz_count} quizzes, {practice_count} practices.")


if __name__ == "__main__":
    main()
