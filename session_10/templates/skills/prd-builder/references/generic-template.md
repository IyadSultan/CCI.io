# Generic Software PRD — Template

Use for any product or feature outside KHCC AIDI's clinical AI portfolio: tools, web/mobile apps, SaaS features, internal utilities, browser extensions, libraries, etc.

Fill in every section. Use `[TBD]` for genuine gaps (and list them under Open Questions). Use `[assumed — confirm]` for sensible inferences.

---

# [Product Name] — PRD

**Owner:** [name, role]
**Author:** [name]
**Status:** Draft | In Review | Approved
**Version:** 0.1
**Last updated:** [Date]

---

## 1. TL;DR

One paragraph. What it is, who it's for, what changes when it ships. No marketing voice.

## 2. Background & problem

- **Problem:** What hurts today, concretely.
- **Affected users:** Who experiences this pain.
- **Why now:** What changed — new tech, new requirement, competitive pressure, expiring workaround.
- **Cost of doing nothing:** Quantify if possible — hours lost, revenue at risk, complaints, churn.

## 3. Goals

- **Primary goal:** [single sentence — the outcome that defines success]
- **Secondary goals:** [optional bullets]

## 4. Non-goals

Aggressive non-goals prevent scope creep. State what this product will **not** do in v1.

## 5. Users & personas

| Persona | Description | Key needs / jobs-to-be-done |
|---------|-------------|------------------------------|
| Primary | | |
| Secondary | | |

Add short prose paragraphs if personas are nuanced.

## 6. User stories / use cases

Group by user role or feature area.

- As a [user], I want to [action], so that [outcome].

## 7. User experience

- **Happy path:** Step-by-step description of the most common flow.
- **Key edge cases:** Errors, empty states, offline, permissions.
- **Wireframes / mockups:** [links or descriptions]
- **Interaction principles:** [e.g., progressive disclosure, undo-friendly, keyboard-first]

## 8. Functional requirements

Numbered, grouped by area. Each requirement testable.

### 8.1 [Feature area]
- FR-1.1
- FR-1.2

### 8.2 [Feature area]
- FR-2.1

## 9. Non-functional requirements

- **Performance:** [page load, API latency, throughput]
- **Scalability:** [target concurrent users / requests, growth assumption]
- **Reliability / uptime:** [SLA target]
- **Security & privacy:** [authentication, authorization, encryption, secret handling]
- **Accessibility:** [WCAG level]
- **Internationalization / localization:** [languages, RTL support]
- **Compliance:** [GDPR, HIPAA, SOC 2, PCI, etc. — if applicable]

## 10. Technical considerations

High-level architecture, key components, integrations. Not a full design doc — point at what's hard, what's already decided, and what's left for engineering to choose.

- **Stack:** [frontend, backend, data store, deployment]
- **Key integrations:** [APIs, third-party services]
- **What's hard:** [the 1–2 things that will dominate engineering effort]
- **Already-decided constraints:** [build vs buy, language, framework, hosting]

## 11. Dependencies

- Internal teams or services
- External vendors or APIs
- Required approvals or contracts (legal, security review, procurement)

## 12. Success metrics

Specific and measurable. Distinguish leading from lagging indicators.

- **Adoption:** [e.g., 30% of eligible users active within 90 days]
- **Engagement:** [retention curve, weekly active, session frequency]
- **Outcome / business:** [revenue, conversion, time saved, NPS]
- **Quality:** [error rate, bug count, support tickets per N users]

## 13. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

## 14. Rollout plan

- **Internal alpha:** [scope, duration, success criteria]
- **Beta:** [user count, opt-in mechanism, feedback channel]
- **GA:** [criteria to leave beta]
- **Rollback criteria:** [what triggers a rollback and who decides]

## 15. Timeline & milestones

| Milestone | Target date | Owner |
|-----------|-------------|-------|
| Spec sign-off | | |
| Engineering kickoff | | |
| Alpha | | |
| Beta | | |
| GA | | |

## 16. Open questions

List every `[TBD]` and `[assumed — confirm]` flag from above.

- [ ]
- [ ]

## 17. Appendix

- Glossary
- Prior art, competitive analysis
- Related docs, design files, research
- References
