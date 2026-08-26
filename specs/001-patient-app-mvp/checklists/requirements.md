# Specification Quality Checklist: P001 — Consumer Patient App MVP

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-06-14 (rewritten 2026-06-16 after spec.md regeneration; previous content preserved as historical reference at top of section "Historical notes")
**Feature**: [spec.md](../spec.md)
**Effort**: xhigh (deep multi-source pass + multi-locale merge + 5-clarification absorption + spec regeneration)

## Content Quality

- [x] No implementation details in Functional Requirements
      *Annotation*: Resend, iCloud Drive, Google Drive, Sentry self-hosted, Apple `/auth/revoke`, Supabase, Flutter Web appear because (i) they are sub-processor disclosures bound by Apple/Google data-safety filings, (ii) they are constraint-level distribution choices (Apple Sign In revocation is platform-required), or (iii) they are Out-of-Scope / Assumptions / Clarifications / Certification Compliance content where naming sub-processors is mandatory for regulatory compliance. Functional Requirements (FR-001 … FR-049 + FR-201 … FR-219 + FR-300 … FR-305) remain framework-agnostic.
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed: User Scenarios & Testing (7 stories), Clarifications (Session 2026-06-16), Requirements (FRs + Certification Compliance + Key Entities), Success Criteria, Assumptions, Out of Scope

## Requirement Completeness

- [x] **No [NEEDS CLARIFICATION] markers remain** — All 5 prior open clarifications (Q1 multi-device PHI restore, Q2 notification body, Q3 residency-after-country-change, Q4 support channels, Q5 OTP provider) resolved in Session 2026-06-16 and absorbed into FRs + SCs + Clarifications section.
- [x] Requirements are testable and unambiguous (49 FRs covering auth + locale + single global account + clarifications absorption; every FR maps to ≥1 acceptance scenario or success criterion)
- [x] Success criteria are measurable (SC-001a / 001b / 002 / 002a / 003 / 004 / 006 / 011 / 011a / 012 / 013 / 014 / 016 / 202 / 203 / 205 / 209 / 301 / 302 / 306 / 307 / 404 — each carries numeric thresholds or counted outcomes)
- [x] Success criteria are technology-agnostic
- [x] All acceptance scenarios are defined (7 user stories × 4–6 scenarios each, ≈35 scenarios total)
- [x] Edge cases are identified (≈13 distinct edge cases listed including multi-device-without-cloud-permission, multi-dose collision, country-locale mismatch, backup-blob-lost, locked-out-during-dose-time, country-change-between-Arabic-dialects)
- [x] Scope is clearly bounded — Out of Scope explicitly enumerates ≈22 deferred features (telemedicine, doctor surfaces, prescriptions, FHIR, SNOMED, RxNorm, drug-interaction checking, AI in-product, Hijri calendar, avatars, data export, national-ID, cross-country DOB row migration, payments, insurance, wearables, multi-account-per-device, marketing site, public API, family profiles)
- [x] Dependencies and assumptions identified (Assumptions section enumerates target audience, device baseline, connectivity, email provider, user cloud-of-record, no clinical decision-support, no FHIR/SNOMED, no data export, no telemedicine, no clinician surfaces, no national-ID, no payments, Egypt-primary market, existing brand assets, no AI in-product, Sentry self-hosted, Resend selected, iCloud+Drive selected)

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows: signup with 3-channel auth (US1 incl. denied-country scenario), handle + profile (US1a), multi-device restore (US1b — NEW from Q1 clarification), emergency card + locale-aware public page (US2), medication reminders + notification body privacy (US3 incl. Q2 absorption), self-service deletion + grace (US4), lockout + sessions + support channels (US5 incl. Q4 absorption), change country/language + Q3 residency gap acknowledged (US6)
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into Functional Requirements section (verified — sub-processor names confined to Assumptions / Clarifications / Compliance)

## Constitution Alignment

- [x] Principle I (Patient Safety First — LOCKED): Append-only dose events (FR-019), no auto-prescription, notification body redaction (FR-018) prevents drug-name leak
- [x] Principle II (Security & Privacy by Design): PHI on-device (FR-009), Argon2id-derived backup key (Q1 resolution), pgcrypto field-level DOB encryption (FR-047), audit log on every DOB decrypt (FR-048), Ed25519+AES-256-GCM emergency QR with fragment-key client-decrypt (FR-013)
- [x] Principle III (Regulatory Compliance — Egypt + KSA + UAE): per-jurisdiction PDPL handled with supervisory authority snapshot (FR-040, FR-219); deletion satisfies Egypt PDPL + KSA PDPL + UAE PDPL (FR-031, FR-032); UAE Health Data Law residency satisfied at signup (FR-049). ⚠ **Compliance gap (Q3) explicitly documented** — encrypted DOB residency does not migrate on country-change; risk-register entry RR-001 required + UAE Apple/Google data-safety filing disclosure required.
- [x] Principle IV (DDD bounded contexts): Key Entities maps to 10 bounded-context modules per `contracts/module-package-boundaries.md`
- [x] Principle V (Offline-First): every P1 flow works offline post-signup; medication reminders fire offline ≥7 days (FR-017); SC-004 verifies
- [x] Principle VIII (Multi-Platform Consistency — RTL, locale variants ar-EG / ar-SA / ar-AE / en, jurisdiction-specific formats): FR-201..FR-219 + 98% translation completeness gate (SC-203)
- [x] Principle XI (Certifications & Standards Compliance): Certification Compliance table covers HL7 FHIR (NOT in P001), LOINC, SNOMED, ICD-10 (limited), RxNorm (NOT), DPG, Egypt PDPL, KSA PDPL, UAE PDPL + Health Data Law
- [x] Principle XII (Open-Source Ecosystem): AGPL reaffirmed in plan.md; Resend (Q5) and iCloud/Drive (Q1) added as named sub-processors with required filings updates

## Source Traceability

- [x] Session 2026-06-15 Path-ii decision (full DOB cloud encryption) → FR-047, FR-048, Key Entity "User Account Audit Log"
- [x] Session 2026-06-15 Q3 deferral (national-ID badge to P002) → Out of Scope + FR-211 (deferred surface)
- [x] Session 2026-06-15 Q4 lockout grace-clock cap → FR-046 14-day absolute cap
- [x] Session 2026-06-16 Q1 (multi-device PHI restore) → US1b, FR-009a, FR-009b, SC-002a
- [x] Session 2026-06-16 Q2 (notification body) → FR-018, FR-018a, refined SC-004
- [x] Session 2026-06-16 Q3 (residency on country-change) → FR-049 refinement, FR-302, RR-001 risk register
- [x] Session 2026-06-16 Q4 (support channels) → FR-046a, FR-046b, SC-011a
- [x] Session 2026-06-16 Q5 (OTP provider) → FR-001, FR-001a, SC-001b
- [x] `data-model.md §1-§5b` → Key Entities + Clarifications absorption
- [x] `tasks.md §1-§10` + `tasks.md §1.5` (flavors + multi-server) + `tasks.md §2.5` (design gate) → user stories + acceptance scenarios
- [x] `design/MASTER.md §1-§12` → Assumptions (brand + design contract) + voice/tone (calm, never coerces)
- [x] `design/SCREEN-INVENTORY.md` → user-story screen mapping
- [x] `contracts/` (supabase-schema.sql, crash-allowlist.json, medication-scheduler.md, module-package-boundaries.md) → Key Entities + FRs
- [x] `research.md` (Phase 0 output 2026-06-16) → Assumptions sub-processor selections

## Open clarifications

> All resolved as of Session 2026-06-16. No open items remaining at spec level.

| # | Topic | Resolution | Session |
|---|---|---|---|
| Q1 | Multi-device PHI restore behavior | iCloud Drive + Google Drive user-owned encrypted backup | 2026-06-16 |
| Q2 | Medication notification body content | Strict privacy — generic localized string | 2026-06-16 |
| Q3 | Residency on country-change for encrypted DOB | No migration — documented gap RR-001 | 2026-06-16 |
| Q4 | Lockout escape support channel | mailto + public status page | 2026-06-16 |
| Q5 | OTP email delivery provider | Resend.com via balsm.health | 2026-06-16 |

## Outstanding for downstream phases (not spec-level blockers)

- 5 design questions in `design/MASTER.md §11` (Q-D1..Q-D5) — resolved during D022 design-review session, recorded in `design/REVIEW-SIGNOFF.md`. Phase 3+ implementation tasks T071+ blocked on that signoff per Phase 2.5 gate.
- 3 Constitution-check refinements (`Retry-After` header on auth-attempt-record, backup-blob latency budget, `docs/compliance-risks.md` creation) — folded into plan.md §Outstanding Clarifications §C.
- 6 contracts files missing per `tasks.md` references: `supabase-rls.sql`, `edge-functions.md`, `emergency-token.md`, `deletion-state-machine.md`, `public-emergency-page.md`, `public-delete-page.md` — restore or regenerate alongside spec.md migration.

## Historical notes

Prior checklist version (2026-06-14) tracked: ADR-01 (Supabase identity), ADR-02 (User-owned cloud), ADR-07 (Username), ADR-09 (Geo-fence extended), ADR-10 (PHI never on Supabase), ADR-11 (Local-first), ADR-12 (Append-only timeline), BUSINESS_FEATURES § 2.1, § 2.1.4, § 2.12, PHASED_ROADMAP P001 Exit Criteria. Source-traceability mapping carried forward where FR identifiers preserved; new FR identifiers (FR-001a, FR-009a/b, FR-018a, FR-046a/b) added by 2026-06-16 clarifications absorption.

## Notes

- Spec was reconstructed 2026-06-16 from derived artifacts (data-model.md, tasks.md, design/MASTER.md, research.md, contracts/) after the prior spec.md was found absent from disk and git history.
- 5 clarifications absorbed in single Session 2026-06-16 batch; spec is plannable + tasks-ready without further clarification rounds.
- Ready for `/speckit.plan` (already run 2026-06-16) or proceed to `/speckit.tasks` (already run, 242 tasks present). No re-run required unless `data-model.md §5b` clarifications cause task changes.
- Before TestFlight / internal-test submission: PSO + Legal/PDPL owners per jurisdiction (PDPC + SDAIA + UAE Data Office) + Localization owner + Store-submission owner sign off per the reviewer list. Apple/Google data-safety filings MUST disclose Resend, iCloud, Google Drive, and DOB-residency-pinning gap before submission.
