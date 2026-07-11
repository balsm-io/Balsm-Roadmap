# Charitable Donations — Bounded Context

| | |
|---|---|
| **Plane** | Provider (case origin) / Platform (fundraising reach) |
| **Classification** | Supporting (constitution v1.8.0; the earlier "Core" label in `subdomain-classification.md` was stale) |
| **Phases** | P021 |
| **Repo mapping** | new module at P021 |
| **PHI posture** | High sensitivity: patient stories must be anonymized (HR-10); donor privacy protected. |

## Purpose

Medical-case fundraising with transparent tracking: anonymized patient stories, donation collection, and case updates. Viral in the MENA region — but Supporting, not Core: differentiation is the transparency workflow, not deep domain complexity.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Donation Case | An anonymized, consented medical fundraising case with target amount |
| Case Update | Progress report to donors (treatment milestones, fund usage) |
| Donation | A contribution against a case |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `DonationCase` | anonymized story, consent ref, target, status | Publish only with explicit patient consent; anonymization verified before publish (HR-10) |
| `Donation` | case ref, amount, donor (optionally anonymous) | Funds traceable case-level; transparency ledger append-only |
| `CaseUpdate` | case ref, milestone, spend record | Append-only |

## Integration Events

**Consumed:** case candidacy signals from Clinical Records (with consent); payment settlement from Billing & Finance.

**Published:** `DonationReceived`, `CaseFunded`, `CaseUpdatePublished`.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Clinical Records | downstream | C-S + ACL | Case built from clinical facts only through an anonymizing translation — raw records never enter |
| Billing & Finance | downstream | C-S | Payment processing reused; this context owns the case ledger |
| Balsm Network | downstream | policy gate | Public case publishing passes sharing/consent policy |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P021 | Medical case fundraising with anonymized patient stories (consent-gated, HR-10) |
| P021 | Donation collection + case-level transparency ledger |
| P021 | Case updates to donors (milestones, fund usage) |

Modules: planned P021.
