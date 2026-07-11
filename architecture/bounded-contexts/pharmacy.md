# Pharmacy — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P007 (controlled-substance checkout flow), P013 (QR dispensing) |
| **Repo mapping** | dispensation features currently planned inside `Modules/POS`/`Modules/Prescription` boundaries — must land as their own module when P013 is specced |
| **PHI posture** | Prescription contents visible at dispense time; standard PHI rules. |

## Purpose

Dispensation correctness: may this medication be handed to this person, by whom, against what authorization. Owns the QR scan-to-dispense flow (the Slice-1 ↔ Slice-2 connector), controlled-substance gating, and delivery tracking. Explicitly **not** stock (Inventory — `PharmacyInventory` was moved there) and **not** payment (Point of Sale).

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Dispensation | The act of handing medication over against an authorization (digital prescription, paper script, or OTC) |
| QR Verification | Scanning a prescription QR and resolving its current lifecycle status before dispensing |
| Controlled Dispense | A dispensation requiring pharmacist-only completion and (entity-configurable, default required per DR-02) prescription attachment |
| Delivery | Out-of-store fulfillment of a dispensation |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Dispensation` | authorization ref (prescription ID / paper photo / OTC), items, dispensing pharmacist | Cancelled / superseded / expired prescriptions **blocked** with status shown; superseded auto-redirects to replacement; assistants blocked from controlled dispenses |
| `DeliveryOrder` | dispensation ref, status tracking | — |

## Integration Events

**Consumed:** prescription QR payload + lifecycle status (Prescriptions published language — never direct table reads).

**Published:** `DispensationCompleted` (→ Prescriptions marks `dispensed`; → Personal Health mirror entry; → Point of Sale checkout continues).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Prescriptions | downstream | C-S, PL | QR payload + status API; Prescriptions owns the lifecycle FSM, Pharmacy reports the dispensation fact |
| Point of Sale | peer | **Partnership** | Checkout interleaves POS payment flow with dispensation validation |
| Inventory | downstream | C-S | Stock consumption via `DeductStock` published interface |
| Identity & Access | downstream | C-S | Role check: pharmacist vs assistant |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P007 | Controlled-substance dispensation gating at checkout: pharmacist-only, assistants blocked, prescription attachment per DR-02 |
| P013 | QR scan-to-dispense: resolve prescription status, dispense, emit `DispensationCompleted` |
| P013 | Blocked dispensing for cancelled/superseded/expired with status shown; superseded auto-redirect to replacement |
| — | Delivery tracking (roadmap: subdomain-map "Delivery"; phase TBD with P013 spec) |

Modules: none yet — must land as its own module at P013 (not absorbed into POS/Prescription).

## Boundary Notes

- P007 ships the controlled-substance flow before digital prescriptions exist (paper-photo attachment path); P013 adds QR digital dispensing on the same aggregate.
- Repo note: today's module set has no Pharmacy module — when P013 is planned, dispensation must not be absorbed into POS or Prescription modules; it maps 1:1 to this context.
