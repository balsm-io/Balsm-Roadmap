# Radiology — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting — stable domain anchored on DICOM standards |
| **Phases** | P018 |
| **Repo mapping** | new .NET module at P018 (`Modules/Radiology`) |
| **PHI posture** | High: imaging + reports are PHI. Patient-facing report URLs follow the Labs share-link pattern. |

## Purpose

Imaging orders, studies, and structured reporting. DICOM/PACS complexity is contained behind an anti-corruption layer — the domain model speaks orders/studies/reports, not DICOM tags.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Imaging Order | Physician request from an encounter for a modality + body part |
| Study | The acquired image set for one order (DICOM reference, not inline storage) |
| Structured Report | RadLex-terminology findings + impression |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `ImagingOrder` | encounter ref, modality, indication | — |
| `Study` | order ref, PACS/DICOM identifiers, QR tracking code | Images live in PACS; the aggregate holds references |
| `RadiologyReport` | RadLex-structured findings, verification state | Released reports immutable; addenda pattern follows Clinical Records |

## Integration Events

**Consumed:** `ImagingOrderRequested` (Clinical Records).

**Published:** `StudyAcquired`, `ReportReleased` (→ Personal Health mirror; → ordering physician).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Clinical Records | downstream | C-S | Orders from encounters |
| PACS / DICOM | downstream of external | **ACL** | DICOM adapters; foreign identifiers wrapped, never leaked into other contexts |
| Personal Health | upstream | C-S (ACL downstream) | Released reports mirror with viewer URL |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P018 | Imaging orders from encounter |
| P018 | Structured reporting with RadLex terminology |
| P018 | DICOM integration for image storage/retrieval; PACS integration |
| P018 | Patient-facing report URL with image viewer |
| P018 | Imaging QR codes for tracking |

Modules: .NET `Modules/Radiology` (planned P018).

## Boundary Notes

- Patient-facing image viewer URL follows the OTP/TTL/audit pattern established by Labs' `ResultShareLink` — shared pattern, separate implementation per context.
