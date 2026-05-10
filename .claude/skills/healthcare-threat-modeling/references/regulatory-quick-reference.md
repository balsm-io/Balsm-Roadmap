# Regulatory Quick Reference

A short pointer guide to the regulatory regimes that most often constrain healthcare and regulated systems. The threat model itself **should not restate compliance requirements** — that's what a compliance review is for. Use this reference to make sure threats and mitigations are consistent with the applicable regimes, and to know which regime to point to in the "Out-of-Scope (Tracked Elsewhere)" section.

> The model should ask the user which jurisdictions apply if it isn't obvious from the system docs.

***

## EU & adjacent

| Regime | Scope | Key constraints relevant to threat models |
| --- | --- | --- |
| **GDPR** (EU 2016/679) | EU residents' personal data | Lawful basis, consent, data-minimisation, right to access/erasure, 72h breach notification, DPIA for high-risk processing |
| **EU AI Act** | AI systems in EU | Risk-tiering; clinical decision support ⇒ high-risk; logging, human oversight, transparency required |
| **NIS2** | Essential / important entities (incl. healthcare) | Incident reporting, supply-chain security, MFA, encryption, vulnerability handling |

## United States

| Regime | Scope | Key constraints relevant to threat models |
| --- | --- | --- |
| **HIPAA** (Privacy + Security Rules) | PHI in US | Administrative/physical/technical safeguards, access controls, audit logs, encryption (addressable), breach notification within 60 days |
| **HITECH** | Reinforces HIPAA | Increased penalties, business-associate liability |
| **21 CFR Part 11** | FDA-regulated electronic records | E-signatures, audit trails (immutable), system validation |
| **FDA SaMD** | Software as a Medical Device | Risk classification (Class I/II/III), pre-market submission for Class II/III clinical decision support |
| **State laws** | Patchwork | CMIA (CA), TX HB300, etc. — often stricter than HIPAA |

## MENA / Egypt / GCC

| Regime | Scope | Key constraints relevant to threat models |
| --- | --- | --- |
| **Egypt PDPL — Law 151/2020** | Personal data in Egypt | Consent, access/erasure, breach notification, cross-border transfer restrictions, data-protection officer for large processors |
| **Egypt Law 182/1960** | Narcotics & controlled substances | Mandatory tracking, prescription requirements, dispensing audit |
| **Egypt Pharmacy Law** | Pharmacy operations | Pharmacist licensing, dispensing standards |
| **Egypt MoH licensing** | Clinic / hospital operations | Entity licensing, professional registration |
| **Saudi PDPL — Royal Decree M/19** | Personal data in KSA | Consent, residency, breach notification, DPO for sensitive-data processors |
| **SFDA Controlled Drug Regs** | KSA controlled substances | Tracking, prescription, dispensing |
| **SFDA SaMD / IMDRF** | KSA medical-device software | CDSS may require pre-market review |
| **MoH Telemedicine Regulations** (Egypt + GCC variants) | Cross-border telemedicine | Doctor licensed in patient's jurisdiction; cross-border restrictions |
| **Anti-Corruption / Anti-Kickback** (Egypt + KSA) | Pharma / prescriber relationships | No individual prescriber analytics, only anonymised aggregates above threshold |

## Cross-cutting patterns

These patterns recur across regimes and should usually be reflected in mitigations:

- **Audit logs as immutable evidence.** PDPL/HIPAA/Part 11 all expect tamper-evident audit. Default to append-only, hash-chained.
- **Breach notification windows.** GDPR 72h, HIPAA 60 days, KSA PDPL ~72h. Mitigations should support detection within these windows (Information Disclosure threats).
- **Right to erasure with clinical exception.** Most regimes permit refusal of erasure where retention is medically or legally required. The system must support both — "delete when permitted, retain when required."
- **Cross-border transfer restrictions.** Both PDPLs and GDPR restrict outbound data transfer. AI BYOK / cloud sync threats (I12 in healthcare-threat-library) trigger this.
- **Controlled substances.** Both Egypt Law 182/1960 and SFDA controls require strong audit and pharmacist-only dispensing. Pharmacy threats (T06, R03) tie back here.
- **SaMD risk tiering.** FDA / SFDA / EU AI Act all classify clinical-decision software by risk. A clinical AI feature in any of these jurisdictions likely needs formal regulatory review — flag it as out-of-scope for the threat model and refer to the AI governance / regulatory plan.

## How to use this in the threat model

1. Ask the user which jurisdictions apply if not obvious.
2. In the "Out-of-Scope (Tracked Elsewhere)" section of the output document, link to the project's compliance review (if it exists). Don't restate the regime requirements.
3. Where a threat connects to a specific compliance constraint, mention the constraint in the **mitigation** (e.g., "see [COMPLIANCE_REVIEW.md] §HR-05 for cross-border telemedicine licensing"). This anchors the mitigation in the team's existing compliance work.
4. If the user has no compliance review, flag this as a gap — the threat model alone is not a compliance assessment.
