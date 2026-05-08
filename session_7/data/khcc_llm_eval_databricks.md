---
layout: page
title: "LLM Evaluation at KHCC — Databricks Production Guide"
permalink: /session-07/databricks-guide/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-07/">&#8249; Back to Session 7</a>

# LLM Evaluation at KHCC — Applying Session 7 in Databricks Production

**Audience:** CCI students who completed Session 7 and have access to Azure Databricks at KHCC.  
**Goal:** Map every Session 7 concept to a concrete Databricks service so you can wire the full eval pipeline — development → CI regression → production monitoring — without leaving your institutional environment.

---

## Why Databricks for Clinical AI Evaluation

KHCC runs on Azure. Databricks on Azure sits inside your network perimeter, connects to existing data governance controls (Unity Catalog, Azure Active Directory), and keeps PHI from leaving the environment. For clinical AI evaluation this matters: your labeled datasets, traces, and judge outputs contain case data that cannot go to an external SaaS eval platform. Databricks gives you all three evaluation layers in one governed workspace.

---

## The Three Layers — KHCC Mapping

| Session 7 Layer | What it does | Databricks service |
|---|---|---|
| **Development optimization** | Fast offline benchmarks while iterating on a prompt | Databricks Notebook + MLflow `mlflow.evaluate()` |
| **Pre-merge regression testing** | Eval suite runs on every commit, gates merges | Databricks Workflow (Jobs) triggered by git push via Azure DevOps / GitHub Actions |
| **Production monitoring** | Continuous scoring of live traffic, drift detection | Delta Live Tables + MLflow Model Monitoring (Lakehouse Monitoring) |

---

## Layer 1 — Development: Notebooks + MLflow Evaluate

When you are iterating on a prompt for the Oncology Summary Assistant, run evaluations directly in a Databricks notebook using MLflow's built-in eval framework.

```python
import mlflow
import pandas as pd

# Your labeled 30-case eval set stored as a Delta table
eval_df = spark.table("khcc_ai.oncology.eval_dataset_v1").toPandas()

# Define a functional evaluator (schema check)
def schema_check(row):
    required = {"diagnosis", "stage", "recommended_regimen", "monitoring"}
    output = set(row["output"].lower().split())
    return int(all(k in output for k in required))

eval_df["schema_score"] = eval_df.apply(schema_check, axis=1)

# Log everything — dataset version, prompt version, scores — as one MLflow run
with mlflow.start_run(run_name="prompt-v3-chain-of-thought"):
    mlflow.log_param("prompt_version", "v3")
    mlflow.log_param("model", "gpt-4o")
    mlflow.log_param("eval_dataset", "eval_dataset_v1")
    mlflow.log_metric("schema_pass_rate", eval_df["schema_score"].mean())
    mlflow.log_table(eval_df, artifact_file="eval_results.json")
```

**Audit trail for free:** every MLflow run records `prompt_version`, `model`, `eval_dataset` version, and all metric values. This is the version-traceability required under IMDRF GMLP from day one.

---

## Layer 2 — Pre-Merge Regression Testing: Databricks Workflows

Create a Databricks Workflow job that runs your eval suite automatically on every pull request. Connect it to Azure DevOps or GitHub Actions via the Databricks REST API.

**Workflow structure:**

```
Task 1: load_eval_dataset     — read Delta table, check schema, assert row count ≥ 30
Task 2: run_functional_evals  — schema check, contraindication flag check, refusal rate
Task 3: run_judge_evals       — LLM-as-judge for clinical relevance (validated, κ ≥ 0.6)
Task 4: assert_thresholds     — fail the job if any metric drops below floor
Task 5: log_to_mlflow         — write all scores + dataset/model/prompt versions
```

**Task 4 — threshold gate:**

```python
# Fail the Databricks job (and block the merge) if quality drops
assert schema_pass_rate >= 0.90,  f"Schema pass rate {schema_pass_rate:.2f} < 0.90 floor"
assert contraindication_recall >= 0.95, "Contraindication recall below 0.95 — BLOCK MERGE"
assert hallucination_rate <= 0.05, "Hallucination rate above 5% floor"
```

Wire this job to your Azure DevOps pipeline's PR gate. The merge is blocked until the Databricks Workflow exits with code 0.

---

## Layer 3 — Production Monitoring: Lakehouse Monitoring + Delta Live Tables

Once the Oncology Summary Assistant is deployed (via Databricks Model Serving or Azure API Management + your inference code), every request/response pair is logged to a Delta table. Databricks Lakehouse Monitoring then runs your evaluators on a rolling window and alerts on drift.

### Step 1 — Log every inference to Delta

```python
import opik  # or log directly to Delta

@opik.track(name="oncology-summary")
def run_summary(patient_case: str) -> str:
    response = openai_client.chat.completions.create(...)
    # Also write to Delta for batch eval
    spark.createDataFrame([{
        "timestamp": datetime.utcnow().isoformat(),
        "input": patient_case,
        "output": response.choices[0].message.content,
        "model": "gpt-4o",
        "prompt_version": PROMPT_VERSION
    }]).write.mode("append").saveAsTable("khcc_ai.oncology.production_traces")
    return response.choices[0].message.content
```

### Step 2 — Delta Live Tables pipeline scores every trace

```python
import dlt

@dlt.table(comment="Scored production traces — runs hourly")
def scored_traces():
    traces = dlt.read("production_traces")
    # Apply functional + judge evaluators
    return traces.withColumn("schema_ok", schema_check_udf("output")) \
                 .withColumn("contraindication_flagged", contra_check_udf("input", "output")) \
                 .withColumn("judge_score", judge_udf("input", "output"))
```

### Step 3 — Lakehouse Monitoring detects drift

Enable Databricks Lakehouse Monitoring on the `scored_traces` table. Set alert thresholds:

| Metric | Floor | Alert action |
|---|---|---|
| `schema_ok` rate | 0.90 | Page on-call via Azure Monitor |
| `contraindication_flagged` miss rate | 0.05 | Immediate escalation |
| `judge_score` (7-day rolling mean) | 0.75 | Slack alert to CCI team |
| `hallucination_rate` | 0.05 | Page on-call |

The monitoring dashboard updates hourly. A silent GPT-4o model update shows up as a judge score drop within 24 hours — not when a clinician complains.

---

## Storing Evaluation Datasets in Delta Lake

Never store your labeled dataset in a flat CSV. Use Delta Lake with Unity Catalog so it is versioned, auditable, and governed.

```sql
-- Create versioned eval table under Unity Catalog
CREATE TABLE khcc_ai.oncology.eval_dataset_v1 (
  case_id        STRING,
  input          STRING,
  reference_output STRING,
  label          STRING,   -- correct / partial / incorrect_harmful
  labeler_id     STRING,
  labeled_at     TIMESTAMP,
  kappa_version  STRING    -- rubric version used for this labeling round
)
USING DELTA
COMMENT 'Session 7 eval dataset — Oncology Summary Assistant — labeled by authority labeler'
TBLPROPERTIES ('delta.enableChangeDataFeed' = 'true');
```

When you update the rubric and re-label, write to `eval_dataset_v2`. MLflow runs always reference the exact Delta table version (`@v1`, `@v2`). This is the dataset-version traceability that FDA SaMD audit trails require.

---

## Secrets Management — No API Keys in Notebooks

Replace Colab secrets with Databricks Secrets:

```bash
# One-time setup in Databricks CLI
databricks secrets create-scope khcc-ai
databricks secrets put --scope khcc-ai --key OPENAI_API_KEY
databricks secrets put --scope khcc-ai --key OPIK_API_KEY
databricks secrets put --scope khcc-ai --key OPIK_WORKSPACE
```

```python
# In any notebook or job
import os
from databricks.sdk.runtime import dbutils

os.environ["OPENAI_API_KEY"] = dbutils.secrets.get("khcc-ai", "OPENAI_API_KEY")
os.environ["OPIK_API_KEY"]   = dbutils.secrets.get("khcc-ai", "OPIK_API_KEY")
```

Secrets are never logged, never stored in notebooks, and are governed by Unity Catalog ACLs — only members of the `khcc-ai-engineers` group can read them.

---

## Four Clinical Safety Metrics — Implementation Pattern

Each metric maps cleanly to a Databricks UDF or SQL function you register in Unity Catalog and reuse across all eval jobs.

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import FloatType

# 1. Contraindication recall
@udf(returnType=FloatType())
def contraindication_recall_udf(input_text, output_text):
    known_contras = load_contraindication_list()  # from Delta table
    return check_flagged(input_text, output_text, known_contras)

# 2. Calibrated refusal — did the tool refuse when it should?
@udf(returnType=FloatType())
def refusal_calibration_udf(input_text, output_text):
    ambiguous_markers = ["insufficient information", "unclear", "consult"]
    return float(any(m in output_text.lower() for m in ambiguous_markers))

# 3. Hallucination rate — checked against guideline Delta table
@udf(returnType=FloatType())
def hallucination_udf(output_text):
    guideline_facts = spark.table("khcc_ai.oncology.guideline_facts")
    return check_factual_claims(output_text, guideline_facts)

# 4. Demographic fairness — compare scores across patient subgroups
def demographic_fairness_report(scored_df):
    return (scored_df
        .groupBy("patient_age_group", "patient_sex")
        .agg({"judge_score": "mean", "schema_ok": "mean"})
        .orderBy("patient_age_group"))
```

Register these UDFs in Unity Catalog (`khcc_ai.oncology.contraindication_recall_v1`) so every eval job — development, CI, production — uses the same implementation.

---

## Summary — Session 7 Concepts → Databricks Services

| Session 7 concept | Databricks service |
|---|---|
| Three evaluation layers | Notebooks (dev) → Workflows (CI) → Lakehouse Monitoring (prod) |
| Labeled eval dataset | Delta Lake table under Unity Catalog, versioned |
| Functional evaluators | Spark UDFs registered in Unity Catalog |
| LLM-as-judge evaluators | `mlflow.evaluate()` with custom judge function |
| Judge-clinician alignment loop | MLflow experiment comparing judge vs human labels |
| Production monitoring | Delta Live Tables + Lakehouse Monitoring alerts |
| Audit trail | MLflow run params: dataset version + model + prompt version |
| Secrets | Databricks Secrets + Unity Catalog ACLs |
| Drift detection | Lakehouse Monitoring rolling-window metric alerts |
| Opik observability | Opik SDK logging to Comet Cloud, or log traces directly to Delta |

---

## One-Page Quick-Start Checklist

- [ ] Create Unity Catalog schema `khcc_ai.oncology`
- [ ] Load eval dataset as versioned Delta table `eval_dataset_v1`
- [ ] Store OpenAI + Opik keys in Databricks Secrets scope `khcc-ai`
- [ ] Write functional UDFs (schema check, contraindication, refusal) and register in Unity Catalog
- [ ] Validate LLM judge: run alignment loop in a Databricks notebook, log κ to MLflow
- [ ] Create Databricks Workflow with 5 tasks (load → functional → judge → assert → log)
- [ ] Wire Workflow to Azure DevOps PR gate via REST API trigger
- [ ] Instrument inference function with Opik `@opik.track` + Delta append
- [ ] Enable DLT pipeline on `production_traces` table
- [ ] Enable Lakehouse Monitoring on `scored_traces`, set alert thresholds
- [ ] Add `data/eval_dataset_v1` and `mlflow_runs/` to your audit-trail documentation

---

*KHCC Cancer Care Informatics · Session 7 Supplement · May 2026*
