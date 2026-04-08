"""One-off: wrap Session 3 .jsx practices/quizzes as static HTML for GitHub Pages."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SESSION3 = ROOT / "Session 3"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {{ font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding-top: 48px; }}
  </style>
</head>
<body>
<a href="https://IyadSultan.github.io/CCI.io/session-03/" style="position:fixed;top:12px;left:12px;z-index:9999;display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#00897B;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid #B2DFDB;background:#E0F2F1;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:background .15s" onmouseover="this.style.background='#B2DFDB'" onmouseout="this.style.background='#E0F2F1'">&#8249; Session 3</a>
<div id="root"></div>
<script type="text/babel">
const {{ useState }} = React;

{body}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<{component} />);
</script>
</body>
</html>
"""


def convert(src: pathlib.Path, dst: pathlib.Path, title: str) -> None:
    text = src.read_text(encoding="utf-8")
    text = re.sub(r"^import React.*from 'react';\s*\n", "", text)
    text = re.sub(r"^export default function (\w+)\(", r"function \1(", text, count=1)
    m = re.search(r"^function (\w+)\(", text, re.M)
    comp = m.group(1) if m else "App"
    body = text.strip()
    dst.write_text(
        TEMPLATE.format(title=title, body=body, component=comp),
        encoding="utf-8",
    )
    print("Wrote", dst.relative_to(ROOT))


def main() -> None:
    items = [
        ("practices/practice_lesson1_api_configurator.jsx", "practices/practice_lesson1_api_configurator.html", "Lesson 1 Practice — API Configurator"),
        ("practices/practice_lesson2_clinical_extraction.jsx", "practices/practice_lesson2_clinical_extraction.html", "Lesson 2 Practice — Clinical Extraction"),
        ("practices/practice_lesson3_tool_calling.jsx", "practices/practice_lesson3_tool_calling.html", "Lesson 3 Practice — Tool Calling"),
        ("practices/practice_lesson4_sql_challenges.jsx", "practices/practice_lesson4_sql_challenges.html", "Lesson 4 Practice — SQL Challenges"),
        ("practices/practice_lesson5_text_to_sql_pipeline.jsx", "practices/practice_lesson5_text_to_sql_pipeline.html", "Lesson 5 Practice — Text-to-SQL Pipeline"),
        ("quizzes/quiz_lesson1_openai_api.jsx", "quizzes/quiz_lesson1_openai_api.html", "Lesson 1 Quiz — OpenAI API"),
        ("quizzes/quiz_lesson2_structured_output.jsx", "quizzes/quiz_lesson2_structured_output.html", "Lesson 2 Quiz — Structured Output"),
        ("quizzes/quiz_lesson3_memory_tools.jsx", "quizzes/quiz_lesson3_memory_tools.html", "Lesson 3 Quiz — Memory and Tools"),
        ("quizzes/quiz_lesson4_csv_to_sql.jsx", "quizzes/quiz_lesson4_csv_to_sql.html", "Lesson 4 Quiz — CSV to SQL"),
        ("quizzes/quiz_lesson5_text_to_sql.jsx", "quizzes/quiz_lesson5_text_to_sql.html", "Lesson 5 Quiz — Text-to-SQL"),
    ]
    for rel_in, rel_out, title in items:
        convert(SESSION3 / rel_in, SESSION3 / rel_out, title)


if __name__ == "__main__":
    main()
