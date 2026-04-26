"""One-off: wrap session_6 practices/quizzes .jsx as Jekyll-friendly .html for GitHub Pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PR = ROOT / "practices"
QZ = ROOT / "quizzes"

HEAD = """---
layout: null
---
<!DOCTYPE html>
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
<a href="{{{{ site.baseurl }}}}/session-06/" style="position:fixed;top:12px;left:12px;z-index:9999;display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#0277BD;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid #B3E5FC;background:#E1F5FE;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:background .15s" onmouseover="this.style.background='#B3E5FC'" onmouseout="this.style.background='#E1F5FE'">&#8249; Session 6</a>
<div id="root"></div>
<script type="text/babel">
{{% raw %}}
const {{ useState }} = React;

"""

TAIL = """
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<{comp} />);
{{% endraw %}}
</script>
</body>
</html>
"""


def transform_jsx(src: str) -> tuple[str, str]:
    lines = src.splitlines()
    if lines and lines[0].strip().startswith("import React"):
        lines = lines[1:]
    body = "\n".join(lines).strip()
    if "export default function Practice" in body:
        body = body.replace("export default function Practice", "function Practice")
        return body, "Practice"
    if "export default function Quiz" in body:
        body = body.replace("export default function Quiz", "function Quiz")
        return body, "Quiz"
    raise ValueError("Unexpected export in " + body[:80])


def write_html(jsx_path: Path, html_path: Path, title: str) -> None:
    body, comp = transform_jsx(jsx_path.read_text(encoding="utf-8"))
    out = HEAD.format(title=title) + body + "\n" + TAIL.format(comp=comp)
    html_path.write_text(out, encoding="utf-8")
    print("Wrote", html_path.relative_to(ROOT.parent))


def main() -> None:
    mapping = [
        (PR / "practice_lesson1_pipeline_builder.jsx", PR / "practice_lesson1_pipeline_builder.html", "Lesson 1 Practice — RAG Pipeline Builder"),
        (PR / "practice_lesson2_score_the_rag.jsx", PR / "practice_lesson2_score_the_rag.html", "Lesson 2 Practice — Score the RAG"),
        (PR / "practice_lesson3_agentic_designer.jsx", PR / "practice_lesson3_agentic_designer.html", "Lesson 3 Practice — Agentic RAG Designer"),
        (PR / "practice_lesson4_extract_kg.jsx", PR / "practice_lesson4_extract_kg.html", "Lesson 4 Practice — Extract KG"),
        (PR / "practice_lesson5_design_wiki.jsx", PR / "practice_lesson5_design_wiki.html", "Lesson 5 Practice — Design Wiki"),
        (QZ / "quiz_lesson1_basic_rag.jsx", QZ / "quiz_lesson1_basic_rag.html", "Lesson 1 Quiz — Basic RAG"),
        (QZ / "quiz_lesson2_deepeval.jsx", QZ / "quiz_lesson2_deepeval.html", "Lesson 2 Quiz — DeepEval"),
        (QZ / "quiz_lesson3_agentic_rag.jsx", QZ / "quiz_lesson3_agentic_rag.html", "Lesson 3 Quiz — Agentic RAG"),
        (QZ / "quiz_lesson4_graphrag.jsx", QZ / "quiz_lesson4_graphrag.html", "Lesson 4 Quiz — GraphRAG"),
        (QZ / "quiz_lesson5_wiki_approach.jsx", QZ / "quiz_lesson5_wiki_approach.html", "Lesson 5 Quiz — Wiki Approach"),
    ]
    for jsx, html, title in mapping:
        if not jsx.is_file():
            raise SystemExit(f"Missing {jsx}")
        write_html(jsx, html, title)


if __name__ == "__main__":
    main()
