# AIDI Clinical Product PRD — Template

Use this template for KHCC AI Office (AIDI) products: clinical AI pipelines, Django apps, alerting systems, dashboards, extraction tools, decision-support utilities.

Fill in every section. Use `[TBD]` for genuine gaps (and list them under Open Questions). Use `[assumed — confirm]` for sensible inferences from the standard AIDI stack.

---

# [Product Name] — PRD

**Owner:** [PI / lead clinician]
**Author:** Iyad Sultan, MD — CAIO & CHIIO, KHCC
**Status:** Draft | In Review | Approved
**Version:** 0.1
**Last updated:** [Date]

---

## 1. Summary

One paragraph: what this is, who it's for, the clinical or operational pain it addresses, and what v1 will ship. No marketing language.

## 2. Clinical context & problem

- **Care setting:** [inpatient / outpatient / ER / ICU / pharmacy / multi-setting]
- **Patient population:** [be specific — e.g., adult solid-tumor oncology, pediatric oncology age <18, ICU adults, neutropenic post-chemo]
- **Current state:** What clinicians do today and why it falls short — manual chart review, delayed alerts, missed flags, inconsistent documentation, etc.
- **Cost of doing nothing:** Quantify if possible — missed diagnoses, delayed treatment, wasted clinician hours, audit findings.
- **Why now:** What changed — new data available, prior pipeline maturing, leadership ask, regulatory or quality push.

## 3. Goals

- **Primary goal:** [single sentence — the outcome that defines success]
- **Secondary goals:** [optional bullets]

## 4. Non-goals

Aggressive non-goals prevent scope creep. State what this product will **not** do in v1.

## 5. Users & stakeholders

| Role | Who | What they do with the product |
|------|-----|-------------------------------|
| Primary clinical user | [e.g., ICU consultant on call] | Receives alerts, acts on them |
| Secondary user | [e.g., charge nurse, fellow] | Reviews trend dashboard |
| Data owner | [e.g., IT / VISTA admin] | Grants/maintains table access |
| Clinical champion | [name, dept] | Validates outputs, drives adoption |
| Operator | [AIDI engineer] | Owns pipeline, handles incidents |
| Approver | [Dept chair / CMO / IRB] | Signs off before deployment |

## 6. User stories / clinical scenarios

3–5 short narratives in clinical voice.

- As a [role], when [trigger event happens], I want [the product to do X], so that [clinical or operational outcome].

## 7. Functional requirements

Numbered, testable. Group by feature area.

### 7.1 Data ingestion
- FR-1.1
- FR-1.2

### 7.2 Processing / extraction / scoring
- FR-2.1

### 7.3 Output / notification / UI
- FR-3.1

### 7.4 Admin / configuration
- FR-4.1

## 8. Non-functional requirements

- **Performance:** [e.g., daily run completes < 30 min for full cohort; per-patient latency < 5 s for on-demand]
- **Reliability:** [e.g., scheduled job succeeds ≥ 95% of days; failure auto-alerts operator]
- **Security & privacy:**
  - PHI handling: MRNs Optimus-encoded in all joins and outputs.
  - PHI at rest: Fernet-encrypted; no plaintext names in logs.
  - Secrets via Databricks secrets scope `sql-credentials` and `openai-credentials`.
  - ACS uses `ManagedIdentityCredential` on standard clusters.
- **Auditability:** Every output logged to `aidi_catalog.dbo.<table>` with timestamp, MRN (encoded), payload hash, model version.
- **Accessibility:** [if user-facing UI — WCAG level if known]

## 9. Data sources

| Table / view | Purpose | Notes |
|--------------|---------|-------|
| `aidi_catalog.dbo.VISTA_<X>` | [fields used] | MRNs Optimus-encoded; names Fernet-encrypted |
| `aidi_catalog.dbo.SILVER_<Y>` | [purpose] | |
| `vw_vista_notes_combined` | Clinical notes for LLM | TEXT type — `CAST AS VARCHAR(MAX)` before string ops |
| [Other] | | |

**JDBC notes:** PySpark JDBC queries cannot use CTEs or `ORDER BY` inside the subquery string.

## 10. Architecture (high-level)

- **Compute:** Azure Databricks Unity Catalog (`aidi_catalog`)
- **Storage:** Azure SQL Server (`aidi-db-server.database.windows.net`, db `AIDI-DB`)
- **LLM:** Azure OpenAI `gpt-4.1-mini` @ `openai-aidi.openai.azure.com`
- **Messaging:** Azure Communication Services (`aidi-cs-prod.europe.communication.azure.com`, sender `DoNotReply@khcc.jo`)
- **Schedule:** [daily 06:00 Asia/Amman / hourly / on-demand]
- **Cluster:** [standard / dedicated / serverless]
- **Output destination:** [SQL table name + Django app / email recipients / dashboard]

Step-by-step flow:
1. …
2. …

## 11. LLM use (if applicable)

- **Model:** `gpt-4.1-mini` (Azure OpenAI deployment)
- **Approach:** [PydanticAI structured extraction / chain-of-prompts / single-shot / few-shot]
- **Prompt module:** [path in repo]
- **Schema (Pydantic):** [link or summary of fields]
- **Async pattern:** `nest_asyncio.apply()` before any `asyncio` / `pydantic-ai` calls
- **Token budget per call:** [estimate]
- **Failure handling:** [retries, partial-success, dead-letter]

## 12. Validation & evaluation

- **Eval cohort:** [frozen patient set — typically deceased patients in a fixed window — N=, criteria]
- **Ground truth source:** [manual chart review by X, registry, prior pipeline output]
- **Metrics:** [sensitivity, specificity, PPV/NPV, exact-match accuracy, F1, AUROC]
- **Acceptance threshold:** [must hit X before pilot deployment, Y before production]
- **Eval pipeline:** Parallel `run_evals()` job writing to `aidi_catalog.dbo.eval_runs`; daily digest email; CI gate if applicable. (See `databricks-khcc-evals` skill.)
- **Ongoing monitoring:** [weekly digest of N samples, drift detection thresholds, monthly review cadence]

## 13. Success metrics

- **Clinical impact:** [e.g., 25% reduction in time-to-antibiotics for FN patients within 6 months]
- **Adoption:** [e.g., ≥ 80% of flagged cases acknowledged within 24 h]
- **Technical:** [pipeline uptime ≥ 95%, accuracy ≥ threshold sustained]
- **Operational:** [hours saved per week, audit findings closed]

## 14. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Model hallucination on rare cases | Med | High | Human-in-loop review for high-risk alerts; confidence thresholds |
| VISTA schema drift | Low | High | Schema-validation step at job start; alert on failure |
| Alert fatigue | Med | Med | Tunable thresholds; per-physician suppression; weekly digest option |
| Clinician non-adoption | Med | High | Champion-led rollout; embed in existing workflow, not parallel to it |
| PHI leak | Low | Critical | No PHI in logs; encrypted at rest; ACS-only delivery; audit log |

## 15. Compliance & governance

- **IRB status:** [exempt / approved #IRB-XXX / quality improvement — not required]
- **Data governance:** Conforms to AIDI-POL-SEC-001
- **PHI handling:** Encrypted at rest (Fernet), encoded MRNs (Optimus), no PHI in logs or non-clinical emails
- **Retention:** [N days for raw outputs; N years for audit logs]
- **Approvals required before go-live:** [list]

## 16. Rollout plan

- **Phase 1 — Silent shadow (Weeks 1–4):** Run alongside current process; outputs not surfaced to clinicians; compare to ground truth.
- **Phase 2 — Limited pilot (Weeks 5–8):** Single ward or service line; alerts enabled; daily review with champion.
- **Phase 3 — Production:** Full scope; existing workflow retired or de-emphasized.
- **Rollback criteria:** [accuracy drops below X / clinician complaints exceed Y / critical incident]; who pauses, how to disable (kill switch).

## 17. Dependencies

- Existing pipelines or tables this builds on
- External teams: Pharmacy, Nursing, IT, Quality, [other]
- Required approvals before deployment
- Hardware / cluster provisioning

## 18. Timeline

| Milestone | Target date | Owner |
|-----------|-------------|-------|
| Spec sign-off | | |
| Data access ready | | |
| v0 silent run | | |
| Validation complete | | |
| v1 pilot live | | |
| Production cut-over | | |

## 19. Open questions

List every `[TBD]` and `[assumed — confirm]` flag from above, plus any other unresolved points.

- [ ]
- [ ]

## 20. Appendix

- Glossary of clinical and technical terms
- Links to related skills (`aidi-extractions`, `drug-clinical-extraction`, `clinical-ml-pipeline`, `databricks-khcc-evals`, etc.)
- Related manuscripts or prior pipelines
- References
