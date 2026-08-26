# Care Delivery — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P019 |
| **Repo mapping** | new .NET module at P019 (`Modules/CareDelivery`) |
| **PHI posture** | High: admission and consultation records are PHI. Telemedicine sessions never recorded. |

## Purpose

Where care is physically or virtually delivered over time: inpatient admission-transfer-discharge (ADT), bed occupancy, discharge summaries with follow-up automation, and telemedicine (video consults, virtual waiting room, cross-border licensing enforcement). Distinct from Appointment (the *promise* of care) and Clinical Records (the *documentation* of care).

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Admission | An inpatient episode: `admitted → transferred* → discharged` |
| Bed Occupancy | Which admission occupies which bed (bed identity belongs to Entity Management) |
| Discharge Summary | End-of-admission document triggering post-discharge follow-up automation |
| Teleconsult | A video/audio consultation session bound to an appointment |
| Virtual Waiting Room | Queue state before a teleconsult starts |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Admission` | patient ref, ADT event history, current bed ref (by ID) | Transfers append events; one active bed per admission |
| `BedOccupancy` | bed ID ↔ admission map per branch | A bed holds at most one active admission; occupancy tracking real-time |
| `DischargeSummary` | admission ref, summary, follow-up plan | Immutable once issued; follow-ups scheduled via Appointment/Messaging |
| `TeleconsultSession` | appointment ref, session state, visit summary | **Licensing check before start**: doctor licensed in patient's jurisdiction (HR-05); no recording stored |

## Integration Events

**Consumed:** `AppointmentConfirmed` (teleconsult binding), bed/room definitions by ID (Entity Management).

**Published:** `PatientAdmitted`, `PatientTransferred`, `PatientDischarged` (→ Clinical Records, Billing), `TeleconsultCompleted` (visit summary → Clinical Records).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Entity Management | downstream | C-S (by ID) | Bed/room identity upstream; occupancy state here |
| Appointment | downstream | C-S | Teleconsults booked as appointments |
| Clinical Records | upstream | C-S | Admission events + visit summaries become clinical documentation |
| Video infrastructure | downstream of external | ACL | Streaming provider wrapped; session state is domain, transport is not |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P019 | ADT workflow: admission, transfer, discharge |
| P019 | Bed management + occupancy tracking (bed identity from Entity Management by ID) |
| P019 | Discharge summary with post-discharge follow-up automation |
| P019 | Telemedicine: video/audio consultation; virtual waiting room; visit summary on completion |
| P019 | Cross-border licensing enforcement (doctor licensed in patient's jurisdiction, HR-05) |

Modules: .NET `Modules/CareDelivery` (planned P019).

## Boundary Notes

- Ambient scribing during teleconsults (HR-06) deferred to P020 and flows through Clinical Records' AI boundary, not here.
- New context in the 20-context amendment: previously ADT would have been forced into Clinical Records + Entity Management — occupancy and session state are operational workflow, not documentation, hence the separate model.
