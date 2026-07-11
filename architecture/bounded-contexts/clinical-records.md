# Clinical Records — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | **Core Domain** — safety-critical clinical documentation, immutability + audit differentiation, AI scribe target |
| **Phases** | P012, P020 (ambient scribe) |
| **Repo mapping** | new .NET module at P012 (`Modules/ClinicalRecords`) |
| **PHI posture** | Maximum. Field-level encryption for diagnoses/notes; every access audit-logged; no PHI in logs — record IDs only. |

## Purpose

The provider-side clinical truth: encounters, notes, coding, referrals, and the append-only per-patient record across entities. Immutability is the product: finalized encounters never change (addenda only), and every view is logged. This is where Balsm's deepest modeling investment goes.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Encounter | One clinical interaction, created on appointment completion, **immutable once finalized** |
| Clinical Note | SOAP or narrative documentation inside an encounter; draft + auto-save before finalization |
| Addendum | The only post-finalization modification mechanism |
| Referral | Free-text handoff to another doctor/entity, linked to its encounter |
| Patient Record | Provider-visible, append-only encounter log across all entities — distinct from the patient-owned timeline (Personal Health) |
| Historical Entry | Doctor-entered paper-record migration item, labeled as such |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Encounter` | note (draft→final), ICD-10 codes (optional), instructions, follow-up request, referral, lab/scan order notes | Immutable after finalization; addenda append-only |
| `PatientRecord` | chronological encounter refs across entities, self-reported + historical entries | Append-only; chronological view (P012 exit criterion) |
| `Referral` | source encounter, target, free text | — |
| `AuditTrailEntry` | who, when, what action, on which record | Immutable; every record access captured |

Draft auto-save (cross-device) is a working-state store feeding `Encounter` — not separately addressable clinical truth.

## Integration Events

**Consumed:** `AppointmentCompleted` (opens encounter); ambient-scribe transcription output (P020) lands as draft note content behind an AI-gateway boundary.

**Published:** `EncounterFinalized` (→ Personal Health mirror entry via ACL; → Billing & Finance billable event), `ReferralIssued`, structured `LabOrderRequested` / `ImagingOrderRequested` (P017/P018).

## Published Language / OHS

- Encounter summary schema for patient-facing mirror (P010/P012: patient sees finalized encounters in their app).
- FHIR mapping of encounters/records at the interoperability surface (P022 bulk export) — owned here, not by a central integration context.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Appointment | downstream | C-S | Encounter opened on completion event |
| Prescriptions | upstream | C-S | Prescriptions born inside encounters, ref by ID |
| Labs / Radiology | upstream | C-S | Orders issued from encounters with clinical indication |
| Personal Health | upstream | C-S (downstream has ACL) | Finalized facts mirror into the patient timeline (`external_source`, ADR-12) |
| Billing & Finance | upstream | events | `EncounterFinalized` → billable |
| AI provider (BYOK) | downstream of external | ACL | Scribe output is untrusted input: enters as draft, physician finalizes; no recording stored (P020) |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P012 | Encounter on appointment completion — immutable once finalized, addenda only |
| P012 | Clinical note (SOAP/narrative) with draft + auto-save synced across devices; optional ICD-10 coding; instructions; follow-up request |
| P012 | Referrals (free-text, encounter-linked); lab/scan order notes (structured at P017/P018) |
| P012 | Patient record: append-only encounter log across entities; self-reported entries (labeled, immutable); doctor-entered historical entries |
| P012 | Immutable audit trail — every record access logged (user, timestamp, action) |
| P020 | Ambient clinical scribing (real-time, no recording stored) → draft notes behind AI gateway; CR-03 SaMD gate |

Modules: .NET `Modules/ClinicalRecords` (planned P012).

## Boundary Notes

- CR-03 (SaMD classification) must resolve before any AI-assisted clinical feature deploys (P020 gate).
- Consent aggregates recorded here where they gate record access; account-level guardianship consent is Identity & Access.
