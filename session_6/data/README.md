# Session 6 — `data/` folder

This folder holds course assets used in Colab (for example **`WT.pdf`** — the National Wilms Tumor treatment guideline sample).

## Get these files inside Google Colab

Colab starts with an empty `/content` disk. To use `WT.pdf` (or anything else here), **clone the course repository** once per new runtime:

```python
# Run once after starting a new Colab notebook
!git clone --depth 1 https://github.com/IyadSultan/CCI.io.git
```

The clone creates a folder named like the repo (default: **`CCI.io`**) under `/content/`. The PDF path is:

```text
/content/CCI.io/session_6/data/WT.pdf
```

Use it in Python:

```python
import os
WT_PDF = "/content/CCI.io/session_6/data/WT.pdf"
assert os.path.isfile(WT_PDF), f"Missing {WT_PDF} — check clone finished and path matches your runtime."
```

Quick check:

```python
!ls -la /content/CCI.io/session_6/data/
```

If you cloned into a different directory or renamed the folder, update `WT_PDF` accordingly.

## Optional: shallow clone only Session 6 (advanced)

If the full repo is too large for your use case, you can still use `git clone` and delete unneeded folders, or download a single file with `curl` / Colab’s file uploader. For class, the **full shallow clone** above is the most reliable so paths match the lesson notebooks.
