# Specification Quality Checklist: Local Server Foundation (Phase 0)

**Purpose**: Validate specification completeness and quality before proceeding to planning  
**Created**: 2026-05-29  
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- All items pass. Spec is ready for `/speckit.plan`.
- Phase 0 is ~70% already implemented; planning phase should treat existing deliverables
  as constraints and focus on the remaining gaps: SQLite migrations, workspace/entity/branch
  CRUD, database backup, first-run wizard, and system tray / CLI status indicator.

## Revision 2026-05-30

Review pass applied. Changes:

- Phase numbering normalized (`P001–P021` not `P2–P21`).
- FR-001 dropped `.AppImage` (cannot register systemd unit).
- FR-002 added macOS `launchd`.
- FR-003 specified default port `8443`; banned privileged ports.
- FR-004 carved out `/api/v1/health` and `/server-info` from wizard redirect.
- FR-006 entity type list marked configurable / extensible.
- FR-008 added 5s mDNS visibility timing.
- FR-009 added TLS certificate fingerprint to server-info payload.
- FR-010 added refusal-to-serve on incomplete migrations; new FR-010a covers
  crash-during-migration recovery.
- FR-011 mandates SQLite online backup API (not raw file copy).
- FR-013 generalized "Cloudflare tunnel" → "outbound reverse tunnel provider";
  vendor selection deferred to planning phase.
- FR-015 split: soft-delete-only on domain tables.
- FR-016 added: structured audit log scope (create/update/soft-delete/mode/backup/restore).
- FR-017 added: TLS 1.2+, Argon2id password hashing, wizard/login rate limiting,
  configurable session idle expiry (default 30 min).
- FR-018 added: single admin enforced in Phase 0.
- FR-019 added: Arabic + English admin UI with RTL.
- SC-005 mirrored FR-011's 1 GB cap.
- SC-006 quantified "50 simultaneous reads" with workload, duration, and p95 bound.
- SC-008 narrowed to domain tables and tightened audit-log coverage statement.
- US1 AS#1 specified surfaces where admin URL is displayed (installer dialog + tray + CLI).
- mDNS pre-setup instance name documented in Assumptions.
- Code-signing line stays in Assumptions but should move to plan if reviewer prefers
  strict spec/operational separation.

Still open for planner attention:

- Spec is partially retrofitted to existing ~70% implementation; verify FR set is not
  bent around current `.NET` shape.
- Phase directory naming (`phases/001-server-foundation/` vs spec `000-…`) outside
  this spec's scope but should be reconciled at planning time.
