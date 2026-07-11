# Prescriptions — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | **Core Domain** — safety-critical lifecycle + interaction checking; the doctor→patient→pharmacy loop is the platform's viral spine |
| **Phases** | P013, P020 (CDSS) |
| **Repo mapping** | `Balsm-API-DotNet`: `Modules/Prescription` (shell today) |
| **PHI posture** | High: medication data is PHI. Field-level encryption; exhaustive edge-case test coverage constitutional for validation/interaction/dosage logic. |

## Purpose

The prescription lifecycle as an explicit state machine, drug-safety checking, and the QR published language that lets any pharmacy dispense safely. Owns validity; Pharmacy owns the physical dispensation fact.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Prescription | `draft → issued → (cancelled | superseded | dispensed | expired)` |
| Supersede | Replacing an issued prescription with a corrected one; the old QR auto-redirects to the replacement |
| Prescription QR | Patient-generated token (one-time or reusable, doctor's choice) resolving to current status |
| Interaction Warning | Rule-based drug-drug/allergy flag at issue time (P013); AI-augmented CDSS at P020 |
| Recurring Prescription | Chronic-medication template that re-issues on schedule |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Prescription` | encounter ref, medications (dosage, duration, refills), status FSM, QR policy | All transitions valid per FSM + audit-logged; `dispensed` only via `DispensationCompleted`; expiry automatic |
| `RecurringPrescription` | template, schedule | Re-issue produces new `Prescription` roots |
| `InteractionRuleSet` | drug-drug, drug-allergy, dosage rules | Versioned; warnings recorded with the prescription |

## Integration Events

**Consumed:** `DispensationCompleted` (Pharmacy) → marks `dispensed`.

**Published:** `PrescriptionIssued`, `PrescriptionCancelled` (with reason), `PrescriptionSuperseded` (with replacement ref), `PrescriptionExpired` → Personal Health mirrors; Pharmacy status checks.

## Published Language / OHS

- **QR payload + status API** — the contract Pharmacy dispenses against: signed payload, current status, redirect-on-superseded. Cancelled/superseded/expired resolve to a blocked verdict with status shown. Pharmacy never reads these tables.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Clinical Records | downstream | C-S | Created inside encounters |
| Pharmacy | upstream | C-S, PL | QR/status contract above |
| Personal Health | upstream | C-S (ACL downstream) | Issued/dispensed facts mirror to patient timeline |
| Drug databases / AI CDSS (BYOK) | downstream of external | ACL | Rule sources versioned; AI suggestions advisory-only, physician confirms (P020, CR-03 gate) |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P013 | Lifecycle FSM: draft → issued → (cancelled \| superseded \| dispensed \| expired), all transitions audit-logged |
| P013 | Prescription within encounter: medications, dosage, duration, refills |
| P013 | Patient-generated QR (one-time or reusable per doctor); superseded auto-redirect; dispense blocking with status shown |
| P013 | Cancel with reason; supersede with replacement reference |
| P013 | Rule-based drug interaction warnings |
| P013 | Recurring prescriptions for chronic medications |
| P020 | AI CDSS: interactions, allergy checks, dosing (BYOK, advisory-only, CR-03 gate) |

Modules: .NET `Modules/Prescription`.

## Boundary Notes

- Basic rule-based interaction warnings ship at P013; the AI CDSS (P020) upgrades the rule source, not the boundary.
- Medication *catalog identity* (what a drug is) comes from Inventory's catalog for dispensing purposes; prescribing uses its own clinical medication model — translate at the boundary, don't unify.
