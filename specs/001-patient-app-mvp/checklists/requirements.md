# Specification Quality Checklist: Phase 001 — Consumer Patient App (Balsm) MVP Core

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-06-14 (revised 2026-06-14 to fold multi-locale into P001 + enforce single global account across countries + remove phone-OTP / SMS auth in favor of email-OTP + Google + Apple per user directives)
**Feature**: [spec.md](../spec.md)
**Effort**: xhigh (deep multi-source pass + multi-locale merge)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
      *Annotation*: Flutter, Supabase, Cloudflare, Apple `/auth/revoke`, Google Play, App Store appear because the source roadmap (ADR-01, ADR-02, ADR-09, ADR-10, ADR-11, ADR-12) + Constitution Principle III + the compliance regime bind them at spec level. They are confined to ADR references, the Out of Scope subsection, Certification Compliance, and Assumptions. The Functional Requirements (FR-001 … FR-044 + FR-201 … FR-216 + FR-300 … FR-305) are framework-agnostic. Twilio Verify removed per 2026-06-14 directive — no SMS dependency.
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed: User Scenarios & Testing, Requirements (incl. Out of Scope, Certification Compliance, Key Entities), Success Criteria, Assumptions

## Requirement Completeness

- [ ] **No [NEEDS CLARIFICATION] markers remain** — **three** open clarifications (Q1 supported-country set, Q2 cloud non-PHI residency, Q3 Pro/Connect inheritance). All three carry documented defaults and are within the max-3 limit. To be resolved by `/speckit.clarify`; or proceed with defaults to `/speckit.plan`.
- [x] Requirements are testable and unambiguous (53 FRs covering auth + locale + single global account; every FR maps to ≥1 acceptance scenario or success criterion)
- [x] Success criteria are measurable (SC-001a…SC-016 + SC-201…SC-209 + SC-300…SC-303 all carry numeric thresholds or counted outcomes)
- [x] Success criteria are technology-agnostic
- [x] All acceptance scenarios are defined (6 user stories × 5–13 scenarios each, ≈55 scenarios total)
- [x] Edge cases are identified (≈33 distinct edge cases listed including multi-locale cases AND single-account-cross-country cases — Egypt user signing in from Riyadh, permanent EG→KSA move, second-signup attempt with same Apple ID, sign-in from non-supported country, global handle stability across country change, simultaneous handle race across countries, cross-country deletion)
- [x] Scope is clearly bounded — Out of Scope enumerates deferred features by phase + the multi-locale subset deferred (Hijri calendar entirely, additional languages, additional markets, per-country PHI residency migration)
- [x] Dependencies and assumptions identified (Assumptions enumerates ADRs cited, defaults applied, deferred work, named review owners, Q1/Q2/Q3 defaults)

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows: signup with country+language picker + 3-channel auth (US1; scenario 14 asserts phone-input never appears in onboarding), handle + profile (US1a), emergency card + locale-aware public page (US2), medication reminders (US3), deletion (US4), sessions + lockout (US5), change country/language + same-account-cross-country sign-in (US6 incl. scenarios 8–10 for single global account, scenario 4 re-auth via existing channel not phone)
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into Requirements section

## Constitution Alignment

- [x] Principle I (Patient Safety First — LOCKED): PSO review explicitly named for emergency-card, medication, AND per-jurisdiction onboarding disclosure copy
- [x] Principle II (Security & Privacy by Design): PHI on-device only (FR-009, FR-012); brute-force lockout (FR-007); device-registry + remote logout (FR-004)
- [x] Principle III (Regulatory Compliance — Egypt + KSA + UAE): per-jurisdiction PDPL handled (Egypt PDPC, KSA SDAIA, UAE Data Office); deletion satisfies Egypt PDPL Art. 12, KSA PDPL Art. 18, UAE PDPL Art. 16 (FR-032); UAE Health Data Law residency addressed (PHI on-device only in P001 keeps cloud-side scope to the non-PHI identity row per Q2 default)
- [x] Principle V (Offline-First): every P1 flow works offline post-signup
- [x] Principle VIII (Multi-Platform Consistency — RTL, locale variants ar-EG / ar-SA / ar-AE / en, jurisdiction-specific formats): satisfied by FR-201…FR-215 + Translation Catalog entity + ≥98% translation completeness gate (SC-203)
- [x] Principle XI (Certifications & Standards Compliance): Certification Compliance table updated with KSA PDPL + UAE PDPL + UAE Health Data Law rows; "deferred enrichment" preserved
- [x] Principle XII (Open-Source Ecosystem): AGPL licensing reaffirmed; public deletion URL + public emergency URL documented across four languages

## Source Traceability

- [x] ADR-01 (Supabase identity) → FR-006
- [x] ADR-02 (User-owned cloud for medical records) → US4 #8 + Out of Scope
- [x] ADR-07 (Username in `public.profiles`) → FR-002
- [x] ADR-09 (Geo-fence — **extended** from Egypt-only to supported-country set per 2026-06-14 directive) → FR-005, SC-010, US1 #8
- [x] ADR-10 (PHI never on Supabase) → FR-006, FR-009 + cross-platform-sync assumption
- [x] ADR-11 (Local-first write path) → FR-010 + 90-day device-loss re-disclosure (FR-013)
- [x] ADR-12 (Health timeline = append-only event log) → FR-021, FR-022, US3 #6
- [x] BUSINESS_FEATURES § 2.1 → FR-007, US5
- [x] BUSINESS_FEATURES § 2.1.4 → FR-008
- [x] BUSINESS_FEATURES § 2.12 (now extended to ar-EG / ar-SA / ar-AE / en per Principle VIII) → FR-035, FR-201…FR-215
- [x] PHASED_ROADMAP P001 Exit Criteria + Consumer Exit Gate → SC-007, SC-008, SC-009, SC-010, SC-011
- [x] Constitution Principle III (Egypt + KSA + UAE primary jurisdictions) → FR-005, FR-039, FR-218 family
- [x] Constitution Principle VIII (RTL/LTR, ar-EG / ar-SA / ar-AE / en variants, jurisdiction-specific formats) → FR-035, FR-209…FR-215

## Open clarifications

| # | Topic | Default if not answered | Impact |
|---|---|---|---|
| Q1 | Supported-country set at launch | EG + SA + AE only (waitlist for others) | scope |
| Q2 | Cloud non-PHI identity-row residency | Single EU region (P002 revisits when cloud PHI sync lands) | security/privacy |
| Q3 | Pro + Connect inheritance scope | Core lib hooks; Pro/Connect adopt per their phases | scope |

## Notes

- Three `[NEEDS CLARIFICATION]`-style open items carry defaults; spec is plannable with defaults applied.
- The "Implementation details" annotation in Content Quality is preserved because Apple / Google / Supabase appear as binding distribution + identity constraints, not design choices.
- Ready for `/speckit.clarify` (optional) or `/speckit.plan` (defaults accepted).
- Before `/speckit.plan` the PSO + Legal/PDPL owners per jurisdiction (PDPC + SDAIA + UAE Data Office) + Localization owner + Store-submission owner should sign off per the reviewer list at the top of spec.md.
