"""Wrap Session 5 .jsx practices/quizzes as static HTML for GitHub Pages."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SESSION5 = ROOT / "session_5"

TEMPLATE = """---
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
<a href="https://IyadSultan.github.io/CCI.io/session-05/" style="position:fixed;top:12px;left:12px;z-index:9999;display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#00897B;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid #B2DFDB;background:#E0F2F1;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:background .15s" onmouseover="this.style.background='#B2DFDB'" onmouseout="this.style.background='#E0F2F1'">&#8249; Session 5</a>
<div id="root"></div>
<script type="text/babel">
{{% raw %}}
const {{ useState }} = React;

{body}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<{component} />);
{{% endraw %}}
</script>
</body>
</html>
"""


def convert(src: pathlib.Path, dst: pathlib.Path, title: str) -> None:
    text = src.read_text(encoding="utf-8")
    text = re.sub(r"^import React.*from 'react';\s*\n", "", text, flags=re.M)
    text = re.sub(
        r"^export default function (\w+)\(",
        r"function \1(",
        text,
        count=1,
        flags=re.M,
    )
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
        ("practices/practice_lesson1_framework_decision.jsx", "practices/practice_lesson1_framework_decision.html", "Lesson 1 Practice — Framework Decision"),
        ("practices/practice_lesson2_tool_design.jsx", "practices/practice_lesson2_tool_design.html", "Lesson 2 Practice — Tool Design"),
        ("practices/practice_lesson3_workflow_designer.jsx", "practices/practice_lesson3_workflow_designer.html", "Lesson 3 Practice — Workflow Designer"),
        ("practices/practice_lesson4_memory_architect.jsx", "practices/practice_lesson4_memory_architect.html", "Lesson 4 Practice — Memory Architect"),
        ("practices/practice_lesson5_multiagent_architect.jsx", "practices/practice_lesson5_multiagent_architect.html", "Lesson 5 Practice — Multi-Agent Architect"),
        ("quizzes/quiz_lesson1_langchain_foundations.jsx", "quizzes/quiz_lesson1_langchain_foundations.html", "Lesson 1 Quiz — LangChain Foundations"),
        ("quizzes/quiz_lesson2_tools_agent_loop.jsx", "quizzes/quiz_lesson2_tools_agent_loop.html", "Lesson 2 Quiz — Tools & Agent Loop"),
        ("quizzes/quiz_lesson3_langgraph_workflows.jsx", "quizzes/quiz_lesson3_langgraph_workflows.html", "Lesson 3 Quiz — LangGraph Workflows"),
        ("quizzes/quiz_lesson4_memory_persistence.jsx", "quizzes/quiz_lesson4_memory_persistence.html", "Lesson 4 Quiz — Memory & Persistence"),
        ("quizzes/quiz_lesson5_multiagent_hitl.jsx", "quizzes/quiz_lesson5_multiagent_hitl.html", "Lesson 5 Quiz — Multi-Agent & HITL"),
    ]
    for rel_in, rel_out, title in items:
        convert(SESSION5 / rel_in, SESSION5 / rel_out, title)


if __name__ == "__main__":
    main()
