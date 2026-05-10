# Threat Model — Document Template

This is the structural skeleton for the output document. Adapt section titles to the project's tone; keep the structure.

```markdown
# <System Name> — System Threat Model

> **Scope:** Comprehensive threat model covering cybersecurity, application security, and AI/ML security across the entire <system> platform.
> **Applies to:** <coverage statement — phases, components, deployment modes>
> **Maintenance rule:** Review this catalog when (a) a new phase introduces a new attack surface, (b) a new external integration is added, (c) the deployment topology changes, (d) the AI provider or model changes, or (e) a security incident occurs.

***

## How to Use This Document

* General cybersecurity and application-security threats are organised by [STRIDE](https://en.wikipedia.org/wiki/STRIDE_model): **S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege.
* AI/ML-specific threats are catalogued in their own section because their attack vectors and mitigations are conceptually distinct; they map to STRIDE where useful.
* `BLOCKING` mitigations must be implemented before the affected feature ships.
* `REQUIRED` mitigations must be referenced in the implementation plan and tracked.
* Patient-safety, data-privacy, and integrity impacts are scored independently of likelihood — priority combines both.

***

## System Context Recap

Trust boundaries that this model considers:

1. <boundary 1 — e.g., Device ↔ Server>
2. <boundary 2>
3. <boundary 3>
...

Sensitive data categories:
- **PHI:** <list>
- **PII:** <list>
- **Financial:** <list>
- **Authentication / cryptographic:** <list>
- **Audit logs:** <list>

***

## Threat Catalog

### Spoofing (S) — Identity Verification

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| S01 | <one-line threat> | <specific mechanism in this system> | <LOW/MEDIUM/HIGH/CRITICAL> | … | … | … |
| S02 | … | … | … | … | … | … |

### Tampering (T) — Unauthorised Modification

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| T01 | … | … | … | … | … | … |

### Repudiation (R) — Accountability Evasion

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| R01 | … | … | … | … | … | … |

### Information Disclosure (I) — Unauthorised Access

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| I01 | … | … | … | … | … | … |

### Denial of Service (D) — Availability

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| D01 | … | … | … | … | … | … |

### AI/ML-Specific Threats (AI)

> Include this section only if the system has AI/ML features.

These threats apply only to features that use AI/ML (CDSS, scribing, conversational assistants, predictive analytics, generative summaries, BYOK LLMs). Each row's `STRIDE` column maps the threat back to the closest classical category for cross-reference.

| ID   | STRIDE | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| ---- | ------ | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| AI01 | T / E  | Prompt injection | … | HIGH | HIGH | HIGH | CRITICAL |
| …    | …      | …                | … | …    | …    | …    | …        |

### Elevation of Privilege (E) — Capability Gain

| ID  | Threat | Attack Vector | Patient Safety | Data Privacy | Integrity | Priority |
| --- | ------ | ------------- | -------------- | ------------ | --------- | -------- |
| E01 | … | … | … | … | … | … |

***

## Required Mitigations

> Group by threat ID. Each mitigation block lists the controls that defend the threat. Mark each control `BLOCKING` or `REQUIRED`.

### S01 — <Threat name> (BLOCKING)

* <specific mitigation 1>
* <specific mitigation 2>

### S02 — <Threat name> (REQUIRED)

* <…>

… (repeat for every threat) …

***

## Phase Coverage Matrix

> Include this section only if the system ships in phases. Otherwise replace with a Component Coverage matrix.

Each phase spec must reference the threats below in its own threat-modelling section and confirm `BLOCKING` mitigations are in scope.

| Phase | Threats Newly Introduced or Materially Expanded |
| ----- | ----------------------------------------------- |
| 1     | <threat IDs>                                    |
| 2     | <threat IDs>                                    |
| …     | …                                               |

***

## Out-of-Scope (Tracked Elsewhere)

* Regulatory/legal obligations: see <link to compliance review>
* Non-functional baselines (rate limits, encryption suites, RTO/RPO): see <link to NFR>
* AI governance process (model approval, evaluation cadence): see <link to AI governance>
* Architectural invariants: see <link to constitution / ADRs>

***

## Review Cadence

* **Per phase / per release:** the phase plan lists threat IDs in scope and confirms `BLOCKING` mitigations are tasked.
* **Quarterly:** review the catalog against the prior quarter's incidents and any new attack surfaces shipped.
* **On change:** when a deployment topology, integration, or trust boundary changes, the catalog is updated before the change ships.
```
