# Entity Management — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P000 (workspace + CRUD, done), P005 (pharmacy entity + Egypt settings), P014 (departments/rooms/beds, staff, multi-branch) |
| **Repo mapping** | `Balsm-API-DotNet`: `Modules/Entity` (Workspace/Entities/Branches/EntityTypes controllers, MediatR CQRS — implemented) |
| **PHI posture** | None. Organizational structure only. |

## Purpose

The organizational skeleton: workspace (one per server), entities (pharmacy → clinics, hospitals, labs at P014), branches, departments, rooms, beds, and entity-level settings (EGP currency, 14% VAT, Africa/Cairo). Structure only — occupancy workflow (who's in the bed) is Care Delivery; staffing roles are Identity & Access.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Workspace | The single tenancy root of one server installation — exactly one per server |
| Entity | A legal healthcare organization (pharmacy, clinic, hospital, lab, radiology center) with license number |
| Branch | A physical location of an entity |
| Department / Room / Bed | Physical structure inside a branch (P014) — identity + attributes, not clinical state |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Workspace` | name, settings | One per server, enforced at creation (`CreateWorkspaceCommandHandler`) |
| `Entity` | type, name, license number, settings (currency/tax/timezone), branches | Soft-delete + reactivate; entity owner transfer (P014) |
| `Branch` | address, contact, per-branch access scope | — |
| `Department` → `Room` → `Bed` | physical hierarchy (P014) | Referenced by ID from Care Delivery; never carry occupancy state |

## Integration Events

**Published:** `WorkspaceCreated`, `EntityCreated`, `BranchCreated`, `EntityProfilePublished` (→ Balsm Network → Provider Directory, P016).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Care Delivery | upstream | C-S (by ID) | Beds/rooms referenced by ID; occupancy lives downstream |
| Provider Directory | upstream | C-S via Balsm Network | Profile publishing passes sharing policy |
| Identity & Access | peer | C-S | Workspace membership/roles live in Identity; Entity owns the org chart, not the people |
| All provider contexts | upstream | shared reference | Entity/branch IDs scope everything (stock per branch, sales per branch, …) |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P000 | Workspace creation (one per server, enforced); entity/branch/entity-type CRUD with soft-delete + reactivate — ✅ done (24 integration tests) |
| P005 | Pharmacy entity setup: name, license, branches; settings: EGP, 14% VAT, Africa/Cairo; server-discovery QR generation |
| P014 | Entity expansion: clinics, hospitals, labs; departments/rooms/beds; staff onboarding/scheduling/shifts; owner transfer; per-branch access control |
| P016 | Entity profile publishing to network (via Balsm Network sharing policy) |

Modules: .NET `Modules/Entity`.

## Boundary Notes

- Egypt L10n primitives (governorates seed, +20 phone validation, 14-digit National ID, EGP formatting, RTL) are cross-cutting platform concerns delivered in P005 alongside this context — the *entity settings* live here, the validators live in SharedKernel.
- Staff onboarding/scheduling/shifts (P014) sit here as org structure; permissions stay in Identity & Access.
