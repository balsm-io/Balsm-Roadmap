# Customer Relations — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P008 (profiles + history), P010 (claim flow) |
| **Repo mapping** | `Balsm-API-DotNet`: `Modules/Customer` (shell today) |
| **PHI posture** | Moderate: purchase history + manually recorded paper prescriptions are health-adjacent. National ID searchable. Standard PHI logging rules apply. |

## Purpose

The pharmacy's model of a person: who buys, what they bought, and the bridge that later links that person to their Balsm patient identity. "Customer" here is deliberately not "Patient" — a customer is a commercial relationship of one entity; a patient identity is platform-wide and patient-owned. The unclaimed-profile → claim flow (P010) is the seam between the two.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Customer | A person known to this entity: name, phone(s), email, national ID, DOB, gender, address |
| Unclaimed Profile | A customer record created by the pharmacy before the person has connected their Balsm account |
| Claim | Binding an unclaimed profile to a Supabase identity on phone/email/national-ID match (`supabase_user_id`) |
| Purchase History | The customer's sales, projected from POS events |
| Paper Prescription Note | Manually recorded: doctor name, medication, dosage, date |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Customer` | demographics, contact, national ID, `supabase_user_id?`, unclaimed flag | Claim binds exactly one Supabase identity; national-ID search instant (P008 exit criterion) |
| `PaperPrescriptionNote` | doctor, medication, dosage, date | Append-only record of paper scripts |

Purchase history is a CQRS projection over `SaleCompleted` — not an aggregate.

## Integration Events

**Consumed:** `SaleCompleted`, `SaleReturned` (Point of Sale) → purchase history; claim matches via Identity & Access.

**Published:** `CustomerClaimed` (→ links pharmacy history into the patient's connected view, P010).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Point of Sale | downstream | events | History projection |
| Identity & Access | downstream | C-S | Claim matching (phone/email/national ID); Supabase JWT presented at connection time (P010) |
| Personal Health | upstream (indirect) | via events | After claim, purchase/dispensation facts may mirror into the patient timeline through the standard ACL path |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P008 | Customer record: name, phone(s), email, national ID, DOB, gender, address |
| P008 | Purchase history linked to customer (projection over `SaleCompleted`) |
| P008 | Manual paper-prescription recording (doctor, medication, dosage, date) |
| P008 | Search by name/phone/national ID — national-ID lookup instant |
| P008 | Unclaimed profiles: pharmacy-created, claimable later |
| P010 | Claim flow: patient connects → auto-link on matching phone/email/national ID → `supabase_user_id` bound |

Modules: .NET `Modules/Customer`.

## Boundary Notes

- Analytics dashboards (P008) are read models over POS/Inventory/Customer projections — they live with their owning contexts, not here.
- Loyalty programs (future) would extend this context.
