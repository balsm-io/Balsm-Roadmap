# Appointment — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P011 (scheduling), P017 (house-visit reuse by Labs), P019 (telehealth booking), P020 (AI scheduling optimization) |
| **Repo mapping** | new .NET module at P011 (`Modules/Appointment`); Balsm Pro app scheduling UI |
| **PHI posture** | Low-moderate: pre-visit questionnaire responses may contain health info. |

## Purpose

Supply-meets-demand: doctor availability → bookable slots → confirmed appointments, with waiting lists, pre-visit questionnaires, cost estimates, and house visits. The booking model is deliberately reusable — Labs conforms to it for home collection (P017), Care Delivery books teleconsults through it (P019).

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Slot Template | A doctor's weekly recurring availability pattern |
| Slot | One bookable time unit generated from a template |
| Appointment | A booked slot: `scheduled → confirmed → in-progress → completed | cancelled | no-show` |
| Waiting List | Ordered queue for fully-booked slots |
| House Visit | An appointment at the patient's address (entity-configurable) |
| Pre-visit Questionnaire / Cost Estimate | Configurable per doctor/entity, attached before the visit |

"Appointment", never "reservation" or "booking" as a noun (ubiquitous-language rule).

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Schedule` | doctor ref, slot templates, generated slots | Double-booking prevented under concurrent access (P011 exit criterion); cancellation releases the slot |
| `Appointment` | slot ref, patient ref, status FSM, attachments, questionnaire response, cost estimate | Status transitions audit-logged |
| `WaitingList` | slot scope, ordered entries | Promotion on release |

## Integration Events

**Published:** `AppointmentScheduled`, `AppointmentConfirmed`, `AppointmentCompleted` (→ Clinical Records opens encounter), `AppointmentCancelled` (→ waiting-list promotion, notifications).

**Consumed:** booking requests from balsm.health (P016, via Balsm Network), house-visit bookings from Labs (CF).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Clinical Records | upstream | C-S, events | `AppointmentCompleted` triggers encounter |
| Labs | upstream | **CF** | House-visit collection reuses slot/booking as-is — Labs conforms, no translation layer |
| Care Delivery | upstream | C-S | Teleconsult sessions bind to appointments |
| Messaging & Notifications | upstream | C-S | Confirmations, reminders (configurable timing), cancellations |
| Balsm Network | downstream | OHS consumer | Online booking from balsm.health lands on the local server (P016 exit criterion) |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P011 | Weekly slot templates (configurable working hours); booking by receptionist or patient; double-booking prevented under concurrency |
| P011 | Status FSM: scheduled/confirmed/in-progress/completed/cancelled/no-show; cancellation releases slot; waiting list for full slots |
| P011 | Pre-visit cost estimate + questionnaire (per doctor/entity); document attachments; house-visit toggle; calendar views |
| P011 | Booking notifications: confirmation, configurable reminder, cancellation (via Messaging) |
| P016 | Online booking from balsm.health lands on local server |
| P017 | House-visit collection booking reused by Labs (slots, reschedule, cancellation, technician assignment tracking) |
| P020 | AI scheduling optimization (BYOK) |

Modules: .NET `Modules/Appointment` (planned P011); Balsm Pro app scheduling UI.

## Boundary Notes

- Doctor profile (specialty, license, education, bio) is layered on the user account — profile identity belongs to Identity & Access; the *schedule* belongs here.
- AI scheduling optimization (P020) is a feature inside this context, not a separate one.
