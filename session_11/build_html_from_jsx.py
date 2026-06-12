"""Build standalone HTML pages from session_11 quiz/practice JSX files."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASEURL = "/CCI.io"
SESSION_URL = f"{BASEURL}/session-11/"

QUIZ_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #EF6C00; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #FFCC80; background: #FFF3E0; margin-bottom: 1rem; }
    .back-link:hover { background: #FFE0B2; }
"""

PRACTICE_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #E65100; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #FFAB91; background: #FBE9E7; margin-bottom: 1rem; }
    .back-link:hover { background: #FFCCBC; }
"""

TITLES = {
    "quiz_lesson1_html": "Quiz: HTML from Scratch",
    "quiz_lesson1_django_youtube": "Quiz: Django in 8 Minutes (Video)",
    "quiz_lesson2_javascript_frontends": "Quiz: JavaScript & Frontends",
    "quiz_lesson3_full_stack": "Quiz: The Full Stack",
    "quiz_lesson4_smallest_django": "Quiz: Smallest Django",
    "quiz_lesson5_meet_the_app": "Quiz: ER-Triage App",
    "quiz_lesson6_extend_it": "Quiz: Extend with a Django App",
    "quiz_lesson7_ship_on_render": "Quiz: Ship on Render",
    "quiz_lesson8_cheat_sheet": "Quiz: Session 11 Cheat Sheet",
    "practice_lesson1_html": "Practice: Spot the Broken HTML",
    "practice_lesson2_javascript_frontends": "Practice: Frontend or Backend?",
    "practice_lesson3_full_stack": "Practice: Frontend, Backend, or Database?",
    "practice_lesson4_smallest_django": "Practice: Build the Smallest Django",
    "practice_lesson5_meet_the_app": "Practice: ER-Triage Code Scavenger Hunt",
    "practice_lesson6_extend_it": "Practice: Add a Django App in Order",
    "practice_lesson7_ship_on_render": "Practice: Render Deploy Checklist",
    "practice_lesson8_cheat_sheet": "Practice: Sort the Whole Stack",
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
  <a class="back-link" href="{SESSION_URL}">&#8249; Back to Session 11</a>
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
