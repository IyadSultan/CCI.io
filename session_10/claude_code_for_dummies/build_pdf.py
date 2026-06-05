"""
Build "Claude Code For Dummies" as a single attractive PDF.

Pipeline:
  1. Read all chapter markdown files in book order.
  2. Render each to HTML (markdown + pygments code highlighting).
  3. Wrap with a print-stylesheet HTML template (title page, TOC, page-break
     between chapters, icon-styled blockquotes, page numbers via @page).
  4. Invoke headless Chrome to print HTML -> PDF.

Usage:
  python build_pdf.py
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

import markdown as md_lib  # pip install markdown pygments


HERE = Path(__file__).parent.resolve()
OUT_HTML = HERE / "book.html"
OUT_PDF = HERE / "Claude_Code_For_Dummies.pdf"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


# --- book order ---------------------------------------------------------------

BOOK = [
    ("front", "00_introduction.md", "Introduction"),
    ("part", None, "Part I — Getting Started with Claude Code"),
    ("ch", "part1_getting_started/ch01_meet_claude_code.md", "1. Meet Claude Code"),
    ("ch", "part1_getting_started/ch02_install_and_launch.md", "2. Installing and Launching"),
    ("ch", "part1_getting_started/ch03_speaking_claude.md", "3. Speaking Claude"),
    ("ch", "part1_getting_started/ch04_permissions_and_safety.md", "4. Permissions and Safety"),
    ("part", None, "Part II — Daily Workflows"),
    ("ch", "part2_daily_workflows/ch05_files_tools_terminal.md", "5. Files, Tools, and the Terminal"),
    ("ch", "part2_daily_workflows/ch06_context_like_a_pro.md", "6. Context Like a Pro"),
    ("ch", "part2_daily_workflows/ch07_models_tokens_cost.md", "7. Models, Tokens, and Cost"),
    ("ch", "part2_daily_workflows/ch08_git_without_tears.md", "8. Git Without Tears"),
    ("ch", "part2_daily_workflows/ch09_plan_mode_and_thinking.md", "9. Plan Mode and Thinking"),
    ("part", None, "Part III — Making Claude Code Yours"),
    ("ch", "part3_make_it_yours/ch10_claude_md.md", "10. CLAUDE.md — Your Project Instruction Manual"),
    ("ch", "part3_make_it_yours/ch11_slash_commands.md", "11. Slash Commands"),
    ("ch", "part3_make_it_yours/ch12_skills.md", "12. Skills"),
    ("ch", "part3_make_it_yours/ch13_subagents_and_teams.md", "13. Subagents and Agent Teams"),
    ("ch", "part3_make_it_yours/ch14_hooks.md", "14. Hooks"),
    ("part", None, "Part IV — Pushing the Limits"),
    ("ch", "part4_push_the_limits/ch15_mcp_servers.md", "15. MCP Servers"),
    ("ch", "part4_push_the_limits/ch16_worktrees.md", "16. Worktrees and Parallel Claudes"),
    ("ch", "part4_push_the_limits/ch17_headless_mode.md", "17. Headless Mode and Automation"),
    ("ch", "part4_push_the_limits/ch18_running_for_hours.md", "18. Running for Hours"),
    ("part", None, "Part V — The Part of Tens"),
    ("ch", "part5_part_of_tens/ch19_ten_clinical_workflows.md", "19. Ten Killer Workflows for Clinical AI Teams"),
    ("ch", "part5_part_of_tens/ch20_ten_mistakes.md", "20. Ten Rookie Mistakes to Avoid"),
    ("ch", "part5_part_of_tens/ch21_ten_slash_commands.md", "21. Ten Slash Commands Worth Memorizing"),
    ("ch", "part5_part_of_tens/ch22_ten_claude_md_lines.md", "22. Ten Things to Put in Your CLAUDE.md Today"),
    ("part", None, "Appendices"),
    ("ch", "appendices/cheat_sheet.md", "A. The Claude Code Cheat Sheet"),
    ("ch", "appendices/agent_sdk.md", "B. Build Your Own Agent with the Claude Agent SDK"),
]


# --- CSS template -------------------------------------------------------------

CSS = r"""
@page {
  size: A4;
  margin: 22mm 18mm 24mm 18mm;
  @bottom-center {
    content: counter(page);
    font-family: "Georgia", serif;
    font-size: 9pt;
    color: #666;
  }
  @top-right {
    content: "Claude Code For Dummies";
    font-family: "Georgia", serif;
    font-size: 8.5pt;
    color: #999;
    font-style: italic;
  }
}
@page :first {
  margin: 0;
  @top-right { content: ""; }
  @bottom-center { content: ""; }
}
@page chapter-first {
  @top-right { content: ""; }
}

html, body {
  font-family: "Georgia", "Cambria", "Times New Roman", serif;
  font-size: 11pt;
  line-height: 1.55;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
}

/* ---------- Title page ---------- */
.titlepage {
  page: cover;
  page-break-after: always;
  height: 100vh;
  background: linear-gradient(135deg, #f7d343 0%, #f7b91a 100%);
  color: #111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60mm 25mm;
  box-sizing: border-box;
  text-align: center;
}
.titlepage .marker {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 14pt;
  background: #111;
  color: #f7d343;
  padding: 6mm 10mm;
  border-radius: 2mm;
  margin-bottom: 12mm;
}
.titlepage h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 900;
  font-size: 52pt;
  line-height: 1.05;
  margin: 0 0 6mm 0;
  letter-spacing: -1px;
}
.titlepage h1 em {
  font-style: italic;
  font-weight: 900;
}
.titlepage .subtitle {
  font-family: "Georgia", serif;
  font-style: italic;
  font-size: 16pt;
  margin: 0 0 18mm 0;
  max-width: 130mm;
}
.titlepage .footline {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 10pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: auto;
  opacity: 0.85;
}

/* ---------- TOC ---------- */
.toc {
  page-break-after: always;
}
.toc h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 28pt;
  border-bottom: 3px solid #111;
  padding-bottom: 4mm;
  margin-bottom: 8mm;
}
.toc .part {
  font-family: "Helvetica Neue", Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-size: 11pt;
  margin-top: 8mm;
  margin-bottom: 3mm;
  color: #b8860b;
}
.toc .ch {
  font-size: 11pt;
  margin: 1.2mm 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 0.5mm;
}
.toc .ch .num {
  color: #555;
}

/* ---------- Part dividers ---------- */
.part-divider {
  page-break-before: always;
  page-break-after: always;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.part-divider .label {
  font-family: "Helvetica Neue", Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 6px;
  font-size: 12pt;
  color: #b8860b;
  margin-bottom: 8mm;
}
.part-divider h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 900;
  font-size: 36pt;
  max-width: 130mm;
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

/* ---------- Chapter ---------- */
.chapter {
  page-break-before: always;
}
.chapter > h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 26pt;
  font-weight: 900;
  letter-spacing: -0.5px;
  border-bottom: 3px solid #f7b91a;
  padding-bottom: 3mm;
  margin-bottom: 6mm;
  margin-top: 0;
}
.chapter h2 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 16pt;
  font-weight: 700;
  margin-top: 8mm;
  margin-bottom: 3mm;
  color: #111;
}
.chapter h3 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 13pt;
  font-weight: 700;
  margin-top: 6mm;
  margin-bottom: 2mm;
  color: #333;
}
.chapter h2 + p,
.chapter h3 + p { margin-top: 1mm; }

.chapter p { margin: 0 0 3mm 0; text-align: justify; hyphens: auto; }
.chapter ul, .chapter ol { margin: 0 0 3mm 6mm; }
.chapter li { margin: 0 0 1mm 0; }

/* ---------- Icon callouts (blockquote with leading emoji) ---------- */
blockquote {
  border-left: 4px solid #999;
  background: #fafafa;
  margin: 4mm 0 4mm 0;
  padding: 3mm 5mm;
  border-radius: 0 2mm 2mm 0;
  page-break-inside: avoid;
  font-size: 10.5pt;
}
blockquote.tip      { border-left-color: #2b9348; background: #eef9f0; }
blockquote.remember { border-left-color: #1d4ed8; background: #eef2ff; }
blockquote.warning  { border-left-color: #b91c1c; background: #fdecec; }
blockquote.tech     { border-left-color: #6b7280; background: #f3f4f6; }
blockquote p { margin: 0; }

/* ---------- Code ---------- */
code {
  font-family: "Consolas", "Menlo", "Monaco", monospace;
  font-size: 9.5pt;
  background: #f3f3f3;
  padding: 0.4mm 1.2mm;
  border-radius: 1mm;
}
pre {
  background: #1e1e1e;
  color: #f8f8f2;
  font-family: "Consolas", "Menlo", "Monaco", monospace;
  font-size: 9pt;
  padding: 3mm 4mm;
  border-radius: 1.5mm;
  overflow-x: auto;
  margin: 3mm 0;
  page-break-inside: avoid;
  line-height: 1.4;
}
pre code { background: transparent; color: inherit; padding: 0; }

/* Pygments — minimal dark */
.codehilite .k, .codehilite .kn, .codehilite .kd { color: #ff79c6; }
.codehilite .s, .codehilite .s1, .codehilite .s2 { color: #f1fa8c; }
.codehilite .c, .codehilite .c1, .codehilite .cm { color: #6272a4; font-style: italic; }
.codehilite .n  { color: #f8f8f2; }
.codehilite .nf, .codehilite .nc { color: #50fa7b; }
.codehilite .nb { color: #8be9fd; }
.codehilite .o  { color: #ff79c6; }
.codehilite .mi, .codehilite .mf { color: #bd93f9; }

/* ---------- Tables ---------- */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 3mm 0;
  font-size: 10pt;
  page-break-inside: avoid;
}
th, td {
  border: 1px solid #ccc;
  padding: 2mm 3mm;
  text-align: left;
  vertical-align: top;
}
th { background: #f7b91a; color: #111; font-family: "Helvetica Neue", Arial, sans-serif; }
tr:nth-child(even) td { background: #fafafa; }

/* ---------- Links ---------- */
a { color: #1d4ed8; text-decoration: none; }
a:visited { color: #1d4ed8; }

hr { border: none; border-top: 1px solid #ccc; margin: 6mm 0; }

/* avoid widows/orphans */
p, li { orphans: 3; widows: 3; }
"""


# --- helpers ------------------------------------------------------------------

ICON_MAP = [
    ("💡", "tip"),
    ("🧠", "remember"),
    ("⚠️", "warning"),
    ("🔧", "tech"),
]


def classify_blockquotes(html: str) -> str:
    """Add CSS class to blockquotes based on the leading icon."""
    def repl(m):
        inner = m.group(1)
        cls = ""
        for emoji, name in ICON_MAP:
            if emoji in inner[:80]:
                cls = f' class="{name}"'
                break
        return f"<blockquote{cls}>{inner}</blockquote>"
    return re.sub(r"<blockquote>(.*?)</blockquote>", repl, html, flags=re.DOTALL)


def render_md(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    # Strip duplicate H1 if first non-empty line is "# Chapter N: ..." — we'll
    # use the entry's title from BOOK instead. But for now keep it; the chapter
    # opener H1 carries the brand styling.
    html = md_lib.markdown(
        text,
        extensions=["fenced_code", "tables", "codehilite", "sane_lists"],
        extension_configs={"codehilite": {"guess_lang": False}},
    )
    html = classify_blockquotes(html)
    return html


def build_html() -> str:
    parts = []
    parts.append(f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Claude Code For Dummies</title>
<style>{CSS}</style>
</head>
<body>
""")

    # Title page
    parts.append("""
<div class="titlepage">
  <div class="marker">A Clinical AI Field Guide</div>
  <h1>Claude Code <em>For&nbsp;Dummies</em></h1>
  <div class="subtitle">The clinical AI builder's guide to shipping software with Claude as your pair programmer</div>
  <div class="footline">King Hussein Cancer Center · CCI Curriculum · Session 10</div>
</div>
""")

    # TOC
    parts.append('<div class="toc"><h1>Contents</h1>')
    for kind, path, title in BOOK:
        if kind == "part":
            parts.append(f'<div class="part">{title}</div>')
        elif kind == "front":
            parts.append(f'<div class="ch"><span>{title}</span><span class="num"></span></div>')
        elif kind == "ch":
            parts.append(f'<div class="ch"><span>{title}</span><span class="num"></span></div>')
    parts.append("</div>")

    # Body
    for kind, path, title in BOOK:
        if kind == "part":
            label, _, name = title.partition(" — ")
            parts.append(f"""
<div class="part-divider">
  <div class="label">{label}</div>
  <h1>{name}</h1>
</div>
""")
        else:
            md_path = HERE / path
            if not md_path.exists():
                print(f"  WARN missing: {md_path}", file=sys.stderr)
                continue
            html = render_md(md_path)
            parts.append(f'<div class="chapter">{html}</div>')

    parts.append("</body></html>")
    return "".join(parts)


def main():
    print("Rendering markdown -> HTML ...")
    html = build_html()
    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"  wrote {OUT_HTML} ({OUT_HTML.stat().st_size // 1024} KB)")

    print("Invoking Chrome headless -> PDF ...")
    file_url = OUT_HTML.as_uri()
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={OUT_PDF}",
        "--virtual-time-budget=10000",
        file_url,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0 or not OUT_PDF.exists():
        print("Chrome stdout:", res.stdout)
        print("Chrome stderr:", res.stderr)
        sys.exit(1)
    size_mb = OUT_PDF.stat().st_size / (1024 * 1024)
    print(f"  wrote {OUT_PDF} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
