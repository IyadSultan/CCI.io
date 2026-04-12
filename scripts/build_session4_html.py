"""Wrap Session 4 .jsx practices/quizzes as static HTML for GitHub Pages."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SESSION4 = ROOT / "session_4"

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
<a href="https://IyadSultan.github.io/CCI.io/session-04/" style="position:fixed;top:12px;left:12px;z-index:9999;display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#00897B;text-decoration:none;padding:6px 12px;border-radius:6px;border:1px solid #B2DFDB;background:#E0F2F1;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:background .15s" onmouseover="this.style.background='#B2DFDB'" onmouseout="this.style.background='#E0F2F1'">&#8249; Session 4</a>
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
        ("practices/practice_lesson1_model_card_reader.jsx", "practices/practice_lesson1_model_card_reader.html", "Lesson 1 Practice — Model Card Reader"),
        ("practices/practice_lesson2_clinical_task_matcher.jsx", "practices/practice_lesson2_clinical_task_matcher.html", "Lesson 2 Practice — Clinical Task Matcher"),
        ("practices/practice_lesson3_training_configurator.jsx", "practices/practice_lesson3_training_configurator.html", "Lesson 3 Practice — Training Configurator"),
        ("practices/practice_lesson4_confusion_matrix.jsx", "practices/practice_lesson4_confusion_matrix.html", "Lesson 4 Practice — Confusion Matrix"),
        ("practices/practice_lesson5_transformer_builder.jsx", "practices/practice_lesson5_transformer_builder.html", "Lesson 5 Practice — Transformer Builder"),
        ("quizzes/quiz_lesson1_huggingface_ecosystem.jsx", "quizzes/quiz_lesson1_huggingface_ecosystem.html", "Lesson 1 Quiz — HuggingFace Ecosystem"),
        ("quizzes/quiz_lesson2_clinical_pipeline.jsx", "quizzes/quiz_lesson2_clinical_pipeline.html", "Lesson 2 Quiz — Clinical Pipeline"),
        ("quizzes/quiz_lesson3_radiology_finetuning.jsx", "quizzes/quiz_lesson3_radiology_finetuning.html", "Lesson 3 Quiz — Radiology Fine-Tuning"),
        ("quizzes/quiz_lesson4_cxr_pneumonia.jsx", "quizzes/quiz_lesson4_cxr_pneumonia.html", "Lesson 4 Quiz — CXR Pneumonia"),
        ("quizzes/quiz_lesson5_microgpt.jsx", "quizzes/quiz_lesson5_microgpt.html", "Lesson 5 Quiz — microGPT"),
    ]
    for rel_in, rel_out, title in items:
        convert(SESSION4 / rel_in, SESSION4 / rel_out, title)


if __name__ == "__main__":
    main()
