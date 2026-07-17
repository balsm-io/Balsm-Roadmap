---
description: "P001 tasks — cross-cutting (no single project)"
---

# P001 Tasks — Cross-Cutting Track

> **Module & Context Scope** *(retrofitted 2026-07-17 per Constitution 1.8.0 Principle IV)*: cross-cutting by nature — tasks here touch multiple contexts (Identity & Access, Personal Health) or none (docs, verification). None may introduce cross-context coupling: docs/runbooks describe per-context behavior through published language only.

Filtered from `../tasks.md`. Tasks without a single project label (touch multiple repos or pure verification).

## Phase 1.7: Patient App-aligned absorption — Q1-Q5 (Session 2026-06-17)

- [X] T035br Create runbook at `../docs/runbooks/account-recovery.md` — operational guide for support staff: verification floor (2 of 4 facts), token-issuance procedure, 30-day cooling-off communication template, audit-log requirements (PDPL data-minimization). Per Q5 (research.md §24).
- [X] T035bs [P] Create `../docs/compliance-risks.md` with RR-001 (Q3 2026-06-16 UAE DOB residency gap) + RR-002 (Q5 2026-06-17 manual recovery procedure). Per plan.md §Outstanding Clarifications.

## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T190 Run the `quickstart.md` walkthrough end-to-end on iOS Simulator + Android Emulator; record pass/fail per SC-001a, US2, SC-004, US4, SC-006, SC-016, SC-011, Q1-Q5 sessions 2026-06-16 + 2026-06-17, FR-300..FR-305
- [X] T191 Update `../balsm_app_flutter/AGENTS.md` + `../Balsm-Core/AGENTS.md` notes to mention the project structure (12 Flutter packages + 7 .NET modules, boundary lint rules, core shared kernel) + 3 flavors + 4 sub-processors (Resend, iCloud, Drive, reCAPTCHA). Backend is .NET 10 (no Supabase).
