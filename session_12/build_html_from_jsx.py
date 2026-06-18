"""Build standalone HTML pages from session_12 quiz/practice JSX files."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASEURL = "/CCI.io"
SESSION_URL = f"{BASEURL}/session-12/"

QUIZ_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #AD1457; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #F8BBD0; background: #FCE4EC; margin-bottom: 1rem; }
    .back-link:hover { background: #F8BBD0; }
"""

PRACTICE_STYLE = """
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #6A1B9A; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #CE93D8; background: #F3E5F5; margin-bottom: 1rem; }
    .back-link:hover { background: #E1BEE7; }
"""

TITLES = {
    "quiz_lesson1_what_is_a_network": "Quiz: What Is a Network?",
    "quiz_lesson2_encryption_basics": "Quiz: Encryption, Plainly",
    "quiz_lesson3_encryption_types": "Quiz: Two Kinds of Keys",
    "quiz_lesson4_how_attacks_work": "Quiz: How Attacks Actually Work",
    "quiz_lesson5_passwords_and_mfa": "Quiz: Passwords, MFA & Least Privilege",
    "quiz_lesson6_canary_tokens": "Quiz: Canary Tokens",
    "quiz_lesson7_phi_and_hipaa": "Quiz: PHI and HIPAA",
    "quiz_lesson8_synthetic_data_pipeline": "Quiz: The Synthetic-Data Pipeline",
    "quiz_lesson9_cloud_hardened_azure": "Quiz: The Cloud, Hardened",
    "practice_lesson1_what_is_a_network": "Practice: Open to the Street, or Shut?",
    "practice_lesson2_encryption_basics": "Practice: Postcard or Sealed Envelope?",
    "practice_lesson3_encryption_types": "Practice: At Rest or In Transit?",
    "practice_lesson4_how_attacks_work": "Practice: Order the Ransomware Chain",
    "practice_lesson5_passwords_and_mfa": "Practice: Passphrase Strength + Would MFA Stop It?",
    "practice_lesson6_canary_tokens": "Practice: Canary Tokens — Good Practice or Mistake?",
    "practice_lesson7_phi_and_hipaa": "Practice: Spot the PHI",
    "practice_lesson8_synthetic_data_pipeline": "Practice: Build a Safe Record",
    "practice_lesson9_cloud_hardened_azure": "Practice: Sequence the Azure Commands + Audit the NSG",
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
  <a class="back-link" href="{SESSION_URL}">&#8249; Back to Session 12</a>
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
