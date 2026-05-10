---
name: healthcare-threat-modeling
description: Produce a comprehensive STRIDE-based threat model for a healthcare or other regulated software system, covering cybersecurity, application security, and AI/ML security in one unified document. Use this whenever the user asks for a threat model, security analysis, STRIDE catalog, security review of an architecture, "what could go wrong" analysis, or risk assessment of a healthcare/clinical/pharmacy/EHR/EMR/medical/fintech/government system — even if they don't say "STRIDE" or "threat model" explicitly. Also trigger when a user shares system requirements, an architecture doc, a phased roadmap, or a compliance review and asks about security or threats. The output is a single markdown document the team can drop into their docs folder.
---

# Healthcare & Regulated System Threat Modeling

## Purpose

This skill produces a **comprehensive STRIDE-based threat model** for a healthcare or regulated software system. It is tuned for healthcare (PHI, clinical safety, audit, compliance) but the same methodology applies to fintech, government, and any system handling sensitive personal data.

The output is a single, reviewable markdown document containing:

1. A trust-boundary recap
2. A STRIDE catalog of cybersecurity and application-security threats with impact scoring
3. An AI/ML-specific catalog if the system has AI features
4. Required mitigations (`BLOCKING` vs `REQUIRED`) for each threat
5. A phase coverage matrix (if the system has a phased roadmap)
6. Out-of-scope pointers to compliance, NFR, and governance docs

This skill does **not** produce attack trees, DREAD scoring, or formal risk-quantification spreadsheets — STRIDE was chosen because it is the most useful coverage checklist for engineering teams working through a phased delivery.

## When to use

Trigger this skill whenever the user:

- asks for a threat model, security analysis, STRIDE catalog, or attack-surface review
- describes a healthcare/clinical/pharmacy/EHR/EMR/medical/fintech/government system and asks "what could go wrong" or "what are the security risks"
- shares an architecture doc, requirements doc, or phased roadmap and asks for security analysis
- mentions PHI, PII, HIPAA, PDPL, GDPR, SFDA, EHDR, or similar regulatory contexts and asks for a risk catalog
- is about to ship a system that handles sensitive data and wants to know what to defend against

You do **not** need an explicit mention of "STRIDE" or "threat model" — the skill should activate any time the user wants structured security analysis of a regulated system.

## Workflow

The workflow is research → enumerate → mitigate → write. Don't rush to enumerate threats before you understand the system; a threat catalog written without research is generic and adds little value.

### 0. Read project context first (when working inside Balsm-Roadmap)

If this skill is being used inside the Balsm-Roadmap repo, read these documents **before** drafting threats — they are the canonical source of architecture, security NFRs, compliance, and existing threat-model patterns. Treat them as required reading, not optional:

- [`SYSTEM_THREAT_MODEL.md`](../../../SYSTEM_THREAT_MODEL.md) — the platform-wide threat model. Cite its threat IDs (`S01`, `T02`, `AI11`, etc.) when a phase-specific threat is a specialisation of one already catalogued. Don't redefine; reference and narrow.
- [`NON_FUNCTIONAL_REQUIREMENTS.md`](../../../NON_FUNCTIONAL_REQUIREMENTS.md) — encryption suites, rate limits, RTO/RPO, audit retention. Mitigations should align, not contradict.
- [`AI_GOVERNANCE.md`](../../../AI_GOVERNANCE.md) — when the phase introduces AI features, the AI section of `SYSTEM_THREAT_MODEL.md` is the catalog; `AI_GOVERNANCE.md` is the process layer.
- [`../Balsm-Draft/COMPLIANCE_REVIEW.md`](../../../../Balsm-Draft/COMPLIANCE_REVIEW.md) — Egypt PDPL, Saudi PDPL, Law 182/1960, SFDA, MoH telemedicine, anti-kickback thresholds. Cite the `CR-NN` / `HR-NN` IDs in mitigations.
- [`../.specify/memory/constitution.md`](../../../../.specify/memory/constitution.md) — entity-isolation rule (cross-tenant leakage = P0), append-only clinical records, offline-first, anti-kickback aggregation thresholds.
- The relevant phase spec under `phases/phase-NN-<name>/spec.md` if the threat model is for a specific phase.

Defer to project conventions when they conflict with this skill's defaults: e.g., output the document as `SYSTEM_THREAT_MODEL.md` (Balsm convention) rather than the generic `THREAT_MODEL.md`; use `EntityId`-scoped query mitigations as the canonical pattern (constitution §2.4); reference `BLOCKING` / `REQUIRED` semantics that already exist.

### 1. Understand the system

Before listing threats, you must understand:

- **What the system does** (business purpose, primary users, primary workflows)
- **Deployment topology** (cloud, on-prem, offline-capable, federated, mobile)
- **Tenant/multi-tenancy model** (single-tenant, multi-tenant, hierarchical orgs/entities)
- **Trust boundaries** (which components trust which? where do credentials cross? where does data leave the system?)
- **Sensitive data inventory** (PHI types, PII types, financial, secrets, audit logs)
- **Compliance/regulatory context** (which jurisdictions, which laws, what data residency)
- **External integrations** (payment gateways, lab/imaging, AI providers, government systems, marketplace plugins)
- **Phased delivery** if applicable (does the system ship in phases? then the threat model needs a per-phase coverage matrix)

For projects **outside** Balsm: ask the user for their constitution / NFR / compliance review / architecture map. Read everything they share before drafting. A threat model based on assumptions is worse than no threat model at all because it gives false confidence.

For systems with extensive documentation, consider delegating research to an `Explore` subagent (see "Research subagent prompt" below) — it is faster and protects your context budget.

### 2. Enumerate threats by STRIDE category

STRIDE is the spine of the catalog:

- **S — Spoofing**: identity verification failures (credential stuffing, stolen tokens, session hijack, identity fraud, certificate spoofing)
- **T — Tampering**: unauthorised modification (DB tampering, sync poisoning, record edits, lifecycle bypass, integration-boundary tampering)
- **R — Repudiation**: accountability evasion (audit suppression, clock manipulation, shared accounts, deniable offline actions)
- **I — Information Disclosure**: unauthorised access (cross-tenant leakage, PHI in logs, search enumeration, re-identification, backup leakage, mobile device loss, eavesdropping)
- **D — Denial of Service**: availability attacks (auth lockout DoS, resource exhaustion, sync flooding, ransomware, cloud cascade)
- **E — Elevation of Privilege**: capability gain (RBAC bypass, OAuth scope escalation, plugin sandbox escape, IDOR, SQL/ORM bypass)

For each category, brainstorm threats specific to **this system's** architecture, data, and integrations. Don't pad with generic web-app threats unless they actually apply. The threat library in `references/healthcare-threat-library.md` lists threats commonly relevant to healthcare systems — use it as a starting point, not a checklist to copy verbatim.

For each threat, capture:

| Field | Notes |
|---|---|
| **ID** | `S01`, `T01`, etc. — sequential within each STRIDE category |
| **Threat** | One-line description |
| **Attack Vector** | The actual mechanism, specific to this system |
| **Patient Safety Impact** | LOW / MEDIUM / HIGH / CRITICAL — does this affect clinical safety? |
| **Data Privacy Impact** | LOW / MEDIUM / HIGH / CRITICAL — does this expose PHI/PII? |
| **Integrity Impact** | LOW / MEDIUM / HIGH / CRITICAL — does this corrupt data or accountability? |
| **Priority** | Combined assessment: CRITICAL / HIGH / MEDIUM / LOW |

Score impacts **independently of likelihood**. Likelihood depends on the threat actor and is hard to estimate consistently; impact depends on the system and is concrete. Priority is the combined ceiling.

### 3. Add AI/ML threats if applicable

If the system has any AI/ML feature (clinical decision support, ambient scribing, conversational assistants, predictive analytics, generative summaries, BYOK LLM integrations), add an `AI/ML-Specific Threats` section. Treat AI threats as a parallel catalog with IDs `AI01`, `AI02`, etc., and map each one to the closest STRIDE category for cross-reference.

Common AI/ML threats: prompt injection (direct and indirect), context bleed, adversarial clinical input, jailbreak, model inversion, model extraction, training-data poisoning, supply-chain compromise, AI DoS, unauthorised capability escalation via tool-calling, AI audit-trail tampering, response data leakage, AI chat session hijack, bias-induced harm, AI-assisted social engineering.

The full AI catalog with mitigations is in `references/ai-threat-library.md`.

If the system has **no** AI features, skip this section entirely. Don't add AI threats "just in case" — it dilutes the document.

### 4. Write mitigations as `BLOCKING` or `REQUIRED`

For each threat, write the controls that mitigate it. Mark each control:

- **`BLOCKING`** — must be in place before the affected feature ships. The team cannot defer it.
- **`REQUIRED`** — must be referenced in the implementation plan and tracked, but doesn't block the immediate release.

Default to `BLOCKING` for anything affecting patient safety, regulatory compliance, or cross-tenant isolation. Default to `REQUIRED` for hardening, monitoring, and defence-in-depth.

Mitigations should:

- Cite the exact mechanism (e.g., "Ed25519 signature on prescription QR codes" not "validate prescriptions cryptographically")
- Reference existing project constraints where they exist (constitution clauses, NFR sections, compliance review IDs)
- Be implementable — if you find yourself writing "must be secure", you haven't given the team enough to act on
- Avoid duplicating existing baseline NFRs (rate limits, encryption suites, RTO/RPO) — point to those docs instead

### 5. Build the phase coverage matrix (if applicable)

If the system ships in phases, the threat model is most useful when each threat is tied to the phase that introduces it. Produce a table: phase number → threat IDs newly introduced or materially expanded.

This lets each phase spec reference threat IDs directly in its own threat-modelling section without re-deriving them.

If the system does NOT have a phased roadmap (typical for an established system), skip this section — replace it with a Component Coverage matrix (component/module → threat IDs) instead.

### 6. Write the document

Use the template in `references/template.md` as the structural skeleton. Fill in trust boundaries, sensitive data, STRIDE catalog, AI catalog (if applicable), mitigations, coverage matrix, out-of-scope pointers.

Length budget: 800–2,500 lines. Less than 800 means you probably skipped threats; more than 2,500 means you're padding.

## Research subagent prompt

When the user has provided extensive documentation (constitution, NFR, architecture, compliance, phased roadmap), delegate research to an `Explore`-type subagent rather than reading everything yourself. This is faster and protects your context budget.

Use a prompt like this:

```
I'm building a STRIDE threat model for <system name>. Research the
attached documents and return a structured summary I can use to
enumerate threats. Specifically:

1. System Architecture & Trust Boundaries (deployment, tenancy, identity,
   network exposure, data flows)
2. Sensitive Data Inventory (PHI, PII, financial, secrets, audit logs)
3. Compliance & Regulatory Requirements (jurisdictions, laws, residency,
   retention, patient rights)
4. Per-Phase Attack Surface (1-2 lines each, all phases)
5. Key NFRs Relevant to Security
6. External integrations and offline/sync interfaces

Cite paths/line numbers. Return findings under 2,500 words. Don't
analyse threats — just give me the raw inventory.

Documents to read: <list>
```

You write the threats yourself based on the inventory the subagent returns. Don't outsource threat enumeration — it requires the security judgment that's the value of this skill.

## Output format

Output is **one markdown file**. Default name:

- **Inside Balsm:** `SYSTEM_THREAT_MODEL.md` if writing the platform-wide model, or a `threats.md` section inside the relevant phase folder (`phases/phase-NN-<name>/threats.md`) if writing a phase-specific model.
- **Outside Balsm:** `THREAT_MODEL.md` unless the project uses a different convention.

The structure follows `references/template.md`.

If the project already has a threat-model doc, propose an edit/extension rather than overwriting — and check whether the user wants to merge or replace.

## Anti-patterns to avoid

- **Generic threats with no system context.** "SQL injection" alone is useless; "dynamic LINQ in tenant-scoped repositories bypasses entity isolation" is actionable.
- **Padding with low-value threats.** A 200-threat catalog where 150 are filler is worse than 40 sharp threats.
- **Compliance copy-paste.** The threat model is not a compliance doc. Reference the compliance review, don't restate it.
- **Mitigation hand-waving.** "Use strong authentication" is not a mitigation. "MFA mandatory for any role with controlled-substance, prescription, or financial-write permissions" is.
- **AI section on a non-AI system.** If there's no AI, skip it. Don't pad.
- **Skipping the research step.** A threat model written without reading the docs gives false confidence to the team. Spend the time on research; the threats will be sharper for it.

## Reference files

- `references/template.md` — structural skeleton for the output document
- `references/healthcare-threat-library.md` — common threats with attack vectors and mitigations, organised by STRIDE
- `references/ai-threat-library.md` — common AI/ML threats with mitigations
- `references/regulatory-quick-reference.md` — PDPL, HIPAA, GDPR, SFDA, EHDR, controlled-substance laws — what each one constrains
