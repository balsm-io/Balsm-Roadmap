# P001 — Requirements ↔ Flutter Implementation Gap Analysis

> **Generated**: 2026-06-28
> **Scope**: Cross-check of the P001 spec set (`spec.md`, `data-model.md`, `plan.md`, `tasks.md`, `design/SCREEN-INVENTORY.md`, `contracts/`) against the **actual Flutter code** in `Balsm-Draft/balsm_app_flutter/` (melos monorepo: `packages/{account,auth,core,deletion,disclosure,emergency_card,geofence_block,home,medications,profile,sessions}` + `app/`).
> **Method**: Read every requirement (FR-*/SC-*/US-*), located the corresponding code, and recorded where code is **missing**, **stubbed (throws / returns null / TODO)**, or **diverges** from the requirement. File:line citations are to `balsm_app_flutter/`.
> **Not in scope here**: the design-track artifact gaps (mocks/specs) — those are tracked separately in `design/GAPS.md`.

---

## How to read this

Severity:
- **Critical** — breaks a P1/P2 user story end-to-end, or causes guaranteed app-store rejection.
- **High** — a mandated FR is absent or non-functional; story works only partially.
- **Medium** — FR implemented partially or behind a stub; degraded but not blocking.
- **Low** — divergence / tech-debt / hygiene; correct behavior reachable.

Status:
- **Missing** — no implementation exists.
- **Stub** — code exists but throws `UnimplementedError`, returns `null`, or is a `TODO`.
- **Partial** — works for the happy path but misses required sub-behavior.
- **Divergent** — implemented differently than the spec mandates.

---

## Summary table

| # | Gap | Requirements | Severity | Status |
|---|---|---|---|---|
| G1 | Disclosure acceptance never persists — accept flow always fails | FR-040, SC-205, US1 | **Critical** | Stub |
| G2 | Localization not wired into the app (delegates, catalog load, RTL) | FR-201, FR-205, FR-207, FR-301; SC-203, SC-301 | **Critical** | Missing/Partial |
| G3 | Age-gate / DOB never collected or enforced (dead use case) | FR-301a, FR-301b; SC-301a | **Critical** | Stub/Missing |
| G4 | Hardcoded English strings across most screens | FR-205, FR-207; SC-203 | **High** | Partial |
| G5 | iCloud backup adapter stubbed — iOS forced onto Google Drive | FR-009a, US1b | **High** | Stub/Divergent |
| G6 | Public `/status` page missing | FR-046a, FR-046b; SC-011a | **High** | Missing |
| G7 | `chronic_condition` schema omits ICD-10 code + onset year | FR-010 | **Medium** | Partial |
| G8 | reCAPTCHA Enterprise not integrated | FR-045c; SC-016a | **Medium** | Stub |
| G9 | Timezone-shift detection + confirm modal missing | FR-023, US3.6 | **Medium** | Missing |
| G10 | Native lock-screen widget / Quick Settings tile missing | US2.5 | **Medium** | Missing |
| G11 | Sessions list missing approximate location + device metadata | FR-035 | **Medium** | Partial |
| G12 | Account recovery claim screen is a TODO | FR-046c, FR-046e | **Medium** | Stub |
| G13 | PHI persisted via raw SQL; profile vs medication ID type mismatch | data-model, contracts | **Medium** | Divergent |
| G14 | Handle suggestions derived from display name, not from taken/reserved context | FR-008 | **Low** | Partial |
| G15 | Parallel out-of-scope prototype app (`patient_app/`) committed | Out-of-scope list | **Low** | Divergent |

---

## Critical gaps

### G1 — Disclosure acceptance never persists; the accept flow always fails
**Requirements**: FR-040 (record snapshots of country/authority/language/version/accepted_at), SC-205 (100% of acceptance records carry valid snapshots), US1 (accept disclosure → reach home).

**Expected**: Accepting the consolidated disclosure persists an on-device `disclosure_acceptance` record (data-model marks on-device as canonical) and lets the user reach home.

**Actual**:
- `packages/disclosure/lib/src/infrastructure/drift/disclosure_dao.dart:18-37` — both `insert(...)` and `watchAcceptance(...)` `throw UnimplementedError('… awaiting schema migration M002')`.
- `packages/disclosure/lib/src/application/use_cases/accept_disclosure_use_case.dart:40-46` — "Step 1: persist on-device" calls `_dao.insert(acceptance)`, the throw is caught, and the use case returns `AppResult.failure(StorageFailure(...))`.
- Net effect: the **on-device persist step always fails**, so `AcceptDisclosureUseCase.execute` returns failure even though the cloud POST may succeed. No acceptance snapshot is stored locally; there is no `disclosure_acceptance` table in `core/.../app_database.dart` `_phiSchema`.

**Impact**: US1 acceptance scenario ("tap Accept → reach home") cannot complete cleanly; SC-205 (valid local snapshot) is 0%. Country-change re-disclosure (FR-044/FR-302) inherits the same failure.

**Remediation**: Add a `disclosure_acceptance` table to `_phiSchema` (or generated Drift), implement `DisclosureDao.insert/watchAcceptance` with raw SQL like the profile/medication DAOs, and confirm the disclosure screen advances on success.

---

### G2 — Localization is not wired into the running app
**Requirements**: FR-201 (4 first-class locales en, ar-EG, ar-SA, ar-AE), FR-205 (≥98% key coverage), FR-207 (fallback to `en` without breakage), FR-301 (language changeable at any time without re-auth), SC-203 (CI gate ≥98%), SC-301 (language change re-renders ≤200ms). The entire spec is "RTL-native".

**Expected**: App-level locale state drives `MaterialApp` with `localizationsDelegates`, `supportedLocales`, and a `locale`; switching locale re-renders the whole UI (incl. RTL).

**Actual**:
- `app/lib/app.dart:60-66` — `MaterialApp.router` has **no** `localizationsDelegates`, **no** `supportedLocales`, **no** `locale`. No `flutter_localizations`, no `Directionality` driven by locale at the root.
- No Flutter gen-l10n setup at all: there is **no `l10n.yaml` and no `.arb` files** anywhere in the repo.
- Localization is a custom `TranslationCatalog` (`packages/core/lib/src/localization/translation_catalog.dart`) that loads JSON from `packages/core/assets/i18n/<locale>.json`. Those four files exist but hold only **~83 keys each** — far short of full-UI coverage.
- `TranslationCatalog.load(...)` is **never called** anywhere in `app/` or `packages/` (only the class definition and `translate` calls exist). With `load()` un-invoked, `_bundles` stays empty and `translate()` returns the **key string** as fallback.
- `translate()` is referenced in only **two** screens — `auth/.../lockout_screen.dart` and `disclosure/.../consolidated_disclosure_screen.dart`. Every other screen renders literal `Text('...')`.
- The account module has `change_language_use_case.dart` + `language_settings_screen.dart`, but because `MaterialApp` has no reactive `locale`, a language change cannot re-render the app (SC-301 unmeasurable).

**Impact**: The product's headline "multi-locale, RTL-native" is not functional in the app. FR-201/205/207/301 unmet; SC-203/SC-301 cannot pass.

**Remediation**: Add `flutter_localizations` + a locale provider; set `localizationsDelegates`/`supportedLocales`/`locale` on `MaterialApp.router`; call `TranslationCatalog.load([...])` during `bootstrap()`; route all UI strings through the catalog (or migrate to gen-l10n `.arb`); add the SC-203 CI coverage gate.

---

### G3 — Age-gate / DOB collection is dead code; never enforced
**Requirements**: FR-301a (collect DOB at signup, validate ≥18, soft-block under-18 to a P002 waitlist screen), FR-301b (validate the in-app DOB against cloud-side encrypted DOB on every age-gated action — emergency-card mint, medication add, deletion intake — fail closed), SC-301a (100% of <18 signups soft-blocked, zero reach home).

**Expected**: Signup captures DOB; `AgeGateUseCase` runs at signup and before each age-gated action.

**Actual**:
- `packages/auth/lib/src/application/use_cases/age_gate_use_case.dart` exists and correctly computes `age < 18`, but a repo-wide search finds **no callsite** — it is invoked nowhere.
- `packages/auth/lib/src/presentation/screens/email_sign_up_screen.dart` collects **no DOB**; `sign_up_use_case.dart` has **no `dateOfBirth` parameter** in any of its email/Google/Apple flows.
- The `/auth/under-18` route and `auth_under_eighteen_screen.dart` exist but are **unreachable** (nothing navigates to them).
- FR-301b cross-checks at med-add / card-mint / deletion intake: **absent** (no age-gate calls in `medications/`, `emergency_card/`, or `deletion/`).

**Impact**: Under-18 users are not blocked (SC-301a = 0%); a documented store/compliance requirement (PDPL + the 2026-06-17 Q1 clarification) is unmet.

**Remediation**: Add a DOB field to signup, call `AgeGateUseCase` at signup (route to `/auth/under-18` on fail), and add fail-closed DOB checks before emergency-card mint, medication add, and deletion intake (FR-301b).

---

## High gaps

### G4 — Hardcoded English strings across most screens
**Requirements**: FR-205 (≥98% coverage per first-class locale), FR-207 (fallback without breakage), SC-203 (CI gate).

**Actual** (examples): `auth/.../auth_recovery_claim_screen.dart:41,48,49,71,80`, `auth/.../auth_recovery_explainer_screen.dart:41-46`, `home/.../home_screen.dart:180` all use literal `Text('...')` English. This is the UI-level symptom of G2 and remains even if the catalog is wired until strings are externalized. No CI coverage check exists.

**Remediation**: Externalize all user-facing strings into the catalog/`.arb`; add the SC-203 release gate.

---

### G5 — iCloud backup adapter is a stub; iOS is forced onto Google Drive
**Requirements**: FR-009a (multi-device restore via user-owned cloud — **iCloud Drive on iOS**, Google Drive on Android), US1b (restore on a new device). Spec Assumption: "iOS users have an Apple ID with iCloud Drive enabled."

**Actual**:
- `packages/core/lib/src/backup/icloud_backup_adapter.dart:11-22` — `upload`/`download` `throw UnimplementedError('iCloud backup pending a maintained plugin.')`; `hasBackup` returns `false`.
- `app/lib/bootstrap.dart:48-66` — both `backupServiceProvider` and `restoreServiceProvider` are wired with `DriveBackupAdapter()` on **all platforms** (comment: "Google Drive on both platforms (iCloud adapter deferred)").

**Impact**: An iOS user without a Google account cannot back up or restore (US1b acceptance #1/#2 fail on iOS as specified). Diverges from FR-009a and from the sub-processor disclosures the spec assumes (iCloud on iOS).

**Remediation**: Implement an iCloud adapter (CloudKit / `NSUbiquitousKeyValueStore` via platform channel) and select it on iOS; until then, document the divergence in `docs/compliance-risks.md` and the data-safety filings.

---

### G6 — Public `/status` page is missing
**Requirements**: FR-046a (every hard-blocking screen exposes a support channel reachable without app auth), FR-046b (public `{BASE_URL}/status` with service health + incident feed), SC-011a (support email **or** status page reachable in ≤2 taps from lockout). Q4 (2026-06-16) wired `/status` alongside `/emergency/{token}` and `/account/delete`.

**Actual**: No `/status` route exists in any `presentation/routes.dart` or in `app/lib/router.dart`; `_publicPrefixes` lists `/auth`, `/emergency/public/`, `/account/delete`, `/account/delete-cancelled` — **no `/status`**. No status screen widget exists.

**Impact**: FR-046b unmet; SC-011a partially met only via `mailto:` (status-page leg absent). The lockout/blocked/404 screens cannot link to status.

**Remediation**: Add a public `/status` Flutter Web route + screen (service health + incident feed) and link it from `auth-lockout`, `auth-blocked`, and `not-found`.

---

## Medium gaps

### G7 — `chronic_condition` omits ICD-10 code + onset year
**Requirements**: FR-010 (chronic conditions with **optional ICD-10 code + onset year**); SCREEN-INVENTORY `profile-editor` cites FR-010.

**Actual**: `core/.../app_database.dart` `_phiSchema` `chronic_condition` table has only `id, health_profile_id, name, created_at`. `profile/.../profile_dao.dart` `_getConditions`/`addCondition` read/write **only `name`**. The `ChronicCondition` aggregate and the editor therefore cannot persist ICD-10 or onset year.

**Remediation**: Add `icd10_code TEXT` + `onset_year INTEGER` columns, map them in `ProfileDao`, and surface them in the profile editor.

> Note: `allergy` carries an `is_controlled_substance` column — controlled-substance is a **medication** attribute (FR-020), not an allergy attribute. Likely schema mis-placement; verify against `data-model.md`.

---

### G8 — reCAPTCHA Enterprise not integrated
**Requirements**: FR-045c (invisible CAPTCHA on the email signup form when per-email/per-IP rate exceeded in prior 24h), SC-016a (≥99.5% complete with no challenge).

**Actual**: `packages/core/lib/src/config/recaptcha_adapter.dart:7` — `getToken` is a `TODO: integrate flutter_recaptcha_enterprise SDK` and `return null`. No auth screen invokes it; `balsm_auth_adapter.dart:36` only comments that `captcha_token` "is added by the interceptor / caller if needed" — no caller adds it.

**Remediation**: Integrate the reCAPTCHA Enterprise SDK, gate it on the throttle signal, and attach `captcha_token` to `/auth/otp/request`.

---

### G9 — Timezone-shift detection + confirmation modal missing
**Requirements**: FR-023 / US3 scenario 6 (on app foreground after a timezone shift, present a confirmation modal asking whether to recompute reminder times); SCREEN-INVENTORY `meds-tz-shift`.

**Actual**: The `timezone` package is used by `medications/.../medication_scheduler.dart` and `core/.../notification_service.dart` for scheduling, but there is **no foreground TZ-shift detector and no confirm modal**. The `medications` screen set has no `tz_shift` screen (`add`, `today`, `dose_history`, `list`, `schedule_format` only).

**Remediation**: On foreground, compare current device TZ to the last-stored TZ; if changed, show a recompute-confirm modal and re-schedule on accept.

---

### G10 — Native lock-screen widget / Quick Settings tile missing
**Requirements**: US2 scenario 5 (iOS 16+ Lock Screen widget showing blood type + top allergies/conditions + primary contact); spec Assumption/Edge Case (Android Quick Settings tile; widgets read from shared app group / SharedPreferences without launching the app). Lock-screen widgets are explicitly **in scope** (only watchOS/WearOS native apps are out).

**Actual**: No iOS WidgetKit extension and no Android Quick Settings tile exist under `app/ios` or `app/android`. `emergency_card/.../widgets/emergency_lock_screen_widget.dart` is an **in-app Flutter widget**, not a native home/lock-screen surface, and does not satisfy the "render without app open" edge case.

**Remediation**: Add a native iOS WidgetKit extension and an Android QS tile that read a snapshot from a shared app group / SharedPreferences.

---

### G11 — Sessions list missing approximate location + device metadata
**Requirements**: FR-035 (list active sessions with device label, **type, first-seen, last-activity, approximate location**), US5.

**Actual**: `sessions/.../domain/aggregates/active_session.dart` models `deviceLabel`, `deviceType`, `firstSeenAt`, `lastActivityAt`, but has **no location field**. `sessions/.../presentation/screens/sessions_screen.dart:231` renders only a relative "Active <time>" string — device type, first-seen, and approximate location are not displayed.

**Remediation**: Add an `approxLocation` field to `ActiveSession`/its JSON contract and render type + first-seen + approximate location per row.

---

### G12 — Account-recovery claim screen is a TODO
**Requirements**: FR-046c/FR-046d/FR-046e (support-mediated recovery: claim via deep link, re-key DOB, no PHI restore).

**Actual**: `packages/auth/lib/src/presentation/screens/auth_recovery_claim_screen.dart:28` — `// TODO: call RecoveryClaimUseCase with widget.token → navigate to home on success.` The `RecoveryClaimUseCase` and adapter (`/auth/recovery/claim`) exist, but the screen does not call them, so the deep-link claim path is inert. (The explainer screen exists with hardcoded English copy — see G4.)

**Remediation**: Wire the claim screen to `RecoveryClaimUseCase` and handle success/error + navigation.

---

### G13 — PHI persisted via raw SQL; profile vs medication ID type mismatch
**Requirements**: `data-model.md` + `contracts/` describe the on-device schema; FR-019 append-only dose events.

**Actual**:
- `core/.../app_database.dart:9` — `@DriftDatabase(tables: [])` is empty; all PHI tables are created in `beforeOpen` via raw `_phiSchema` and queried with `customSelect/customInsert` (DAOs note "TODO: drift table annotations + build_runner"). Functional, but no generated, type-safe Drift layer.
- **ID type inconsistency**: `profile_dao.dart` writes/reads UUIDs as **BLOB** (`Variable.withBlob(profile.id.toBytes())`, `row.read<Uint8List>('id')`) while the `_phiSchema` declares `id TEXT`; `medication_dao.dart` writes UUIDs as **TEXT** (`m.id.toString()`). Mixed BLOB/TEXT storage in TEXT-affinity columns plus `ProfileDao._uuidFromBlob` reconstructing hex and calling `UuidV7.fromString(hex)` is a correctness/round-trip risk and diverges from a single data-model contract.
- Positive: append-only is enforced at the storage layer via `dose_events_no_update` / `dose_events_no_delete` triggers (FR-019 ✓).

**Remediation**: Pick one UUID storage encoding across all PHI tables; either complete the generated Drift migration or document the raw-SQL schema as the contract and align the DAOs.

---

## Low gaps

### G14 — Handle suggestions derived from display name, not taken/reserved context
**Requirements**: FR-008 (suggest **3 alternative handles when a chosen handle is taken or reserved**).

**Actual**: `account/.../handle_claim_screen.dart:103` `_suggestions(displayName)` derives up to 3 suggestions from the display name regardless of whether the typed handle is taken/reserved. Spec intent is server-context-aware alternatives on a conflict.

**Remediation**: Generate/fetch suggestions in response to a taken/reserved result (ideally from the API on conflict).

---

### G15 — Parallel out-of-scope prototype app committed
**Requirements**: P001 "Out of Scope" list (no trends, appointments, map, prescriptions, records, quick-log, body-map).

**Actual**: `app/lib/patient_app/` contains a second, separate UI (`screens/{trends,appointments,map_screen,prescriptions,records,quicklog_sheet,...}`, `shell.dart` with `_Placeholder` tabs) — the React reference-port prototype. It is **not wired into `app/lib/router.dart`** (the real P001 app) and implements out-of-scope surfaces.

**Impact**: Dead/divergent code that can confuse progress signals and bloat the build. Matches the `design/GAPS.md` note that `reference-prototype/` is a porting reference, not P001.

**Remediation**: Remove or quarantine `app/lib/patient_app/` (and its `main_patient.dart` entrypoint) once any needed BalsmKit widgets are ported, to keep one source of truth.

---

## What IS implemented (so the gaps are in context)

To avoid over-reading the list above, these requirement areas are present and substantially wired:

- **Auth API surface** — `balsm_auth_adapter.dart`: OTP request/verify, Google, Apple, sign-out, refresh, recovery-claim; 423-lockout handling with `Retry-After` (FR-001, FR-007).
- **On-device PHI persistence** — profile + medications DAOs work via raw SQL against the SQLCipher-backed `AppDatabase`; dose events are append-only via DB triggers (FR-009, FR-019).
- **Emergency QR** — mint/revoke/resolve use cases; public resolve reads the AES key from the URL fragment (`#k=`) and never sends it to the server (FR-013 fragment handling, FR-014/FR-015).
- **Emergency snapshot reader** — wired in `bootstrap.dart` to the profile DAO (PHI stays on-device).
- **Backup/restore pipeline** — debouncer, snapshot service, conflict resolver, recovery code, restore prompt (FR-009c/d/e) — functional on the Drive path (see G5 for the iCloud gap).
- **Deletion** — pre-confirm, confirm (typed "DELETE"), cancelled, post-deletion-login, public delete screens + request/cancel use cases (FR-031/FR-032).
- **Sessions** — list/revoke/sign-out-everywhere use cases + screen (FR-035 partial — see G11; FR-036 ✓).
- **Notifications** — local notification service, permission-change event + re-request sheet, missed-dose detector, deep-link to Today (FR-017/017a/017b/017c, FR-018/018a).
- **PHI-leak guard** — `phi_leak_interceptor.dart` + Sentry init (SC-006/SC-016 scaffolding present; verify the fuzz test).
- **Geofence** — denied-countries adapter + blocked-signup event (FR-005, FR-218).

---

## Suggested remediation order

1. **G1** — make disclosure acceptance persist (unblocks US1 → home).
2. **G3** — collect DOB + enforce age gate (store/compliance blocker).
3. **G2 / G4** — wire localization + RTL and externalize strings (headline product promise; SC-203/SC-301 gates).
4. **G6** — add the public `/status` route (store + Q4 resolution).
5. **G5** — implement the iCloud backup adapter (iOS US1b).
6. **G7, G11, G13** — close the data-model gaps (ICD-10/onset, session location, UUID encoding).
7. **G8, G9, G10, G12** — CAPTCHA, timezone-shift modal, native widgets, recovery-claim wiring.
8. **G14, G15** — suggestion context + remove the out-of-scope prototype.
