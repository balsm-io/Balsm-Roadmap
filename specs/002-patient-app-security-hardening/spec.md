# Feature Specification: Patient App Security Hardening (P001 remediation)

**Feature Branch**: `002-patient-app-security-hardening`
**Created**: 2026-07-17
**Status**: Draft
**Input**: Remediation of the 2026-07-17 security review of the P001 patient-app spec set. The review produced 1 CRITICAL, 11 HIGH, 15 MEDIUM, 10 LOW findings against `specs/001-patient-app-mvp/`. This feature turns those findings into implemented changes in the **already-built** P001 code: `../balsm_app/` (Flutter) and `../Balsm-API-DotNet/` (.NET patient API).

> **Why a new feature and not an edit to 001**: P001's tasks are largely `[x]` (implemented). In SpecKit, a change reaches code only as an *unchecked* task; rewording a done task does not re-trigger it. This feature isolates the security deltas as their own spec → plan → tasks → implement cycle against existing code, keeping P001 intact and giving the change-set its own compliance checklist + analyze gate. The corrected P001 contracts/data-model (committed on the 001 branch) are the design baseline; the `SEC-D01–09` (dotnet) and `SEC-F01–10` (flutter) task stubs appended to `001/tasks/{dotnet,flutter}.md` are the seed for this feature's `tasks.md`.

> **Out of scope**: the 000 local-server-foundation findings (admin CSRF, mDNS TOFU, LocalOsTrust, recovery-code replay, backup-at-rest, etc.). That code is not yet implemented (`000/tasks.md` is 0/165), so its fixes are already unchecked tasks there and are built during 000's own implementation — not here.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Close account-takeover surfaces (Priority: P1)

A patient (or the platform) is protected from full account compromise via the unauthenticated recovery/OIDC/backup surfaces. An attacker who obtains a recovery token, an unverified-email social identity, or a user's cloud backup blob cannot take over the account.

**Why this priority**: These are the highest-severity findings (HIGH). Each is a complete account-takeover primitive; unfixed, one request or one leaked artifact yields full access to a patient's identity and (via backup) their PHI.

**Independent Test**: Attempt each attack against a staging build and confirm it fails: replay a used recovery token (→ 401), present an OIDC identity with an unverified email matching a victim (→ 403, no link), and brute-force an exfiltrated backup blob offline (infeasible — 256-bit DEK).

**Acceptance Scenarios**:

1. **Given** a support-issued recovery token already consumed once, **When** it is replayed to `POST /auth/recovery/claim`, **Then** the API returns `401 TokenReplayed` and the account is unchanged.
2. **Given** a recovery token older than its ≤72h TTL or beyond the per-IP rate limit, **When** claimed, **Then** it is rejected and every attempt is audit-logged.
3. **Given** a Google/Apple identity asserting `emailVerified=false` for a victim's email, **When** exchanged, **Then** the API returns `403` and never links to the existing account (identities link by `(provider, providerSubject)` only, with `aud` pinned).
4. **Given** a user's encrypted cloud backup blob, **When** an attacker without the user's backup recovery code tries to open it, **Then** decryption is infeasible (random 256-bit DEK wrapped by an Argon2id-derived key; no OTP-derived key material).

### User Story 2 - Eliminate PHI leakage (Priority: P1)

Patient health information never leaves the trusted surface: not on the lock screen, not in crash telemetry, not in URLs.

**Why this priority**: Contains the sole CRITICAL finding (drug name + dose mandated in the notification payload) plus HIGH PHI-scrub gaps. PHI exposure is a Constitution Principle I + PDPL violation and a likely app-store rejection.

**Independent Test**: Fire a medication reminder and inspect the OS notification (no drug name/dose); run the PHI-leak fuzz corpus (incl. Arabic clinical terms, Eastern-Arabic-Indic digits, and `#k=` URL-fragment vectors) and assert zero leaks on both client and server.

**Acceptance Scenarios**:

1. **Given** a due medication dose, **When** the reminder fires, **Then** the notification title/body is a fixed localized generic string and the drug name/dose appear only behind the device unlock (deep-link carries the dose id only).
2. **Given** a crash whose exception text contains Arabic clinical terms or Eastern-Arabic-Indic-digit identifiers, **When** captured by Sentry, **Then** the denylist redacts them and the fuzz test asserts on value content, not just field names.
3. **Given** the public emergency page opened via `…/emergency/{jti}#k=<key>`, **When** the page loads, **Then** the fragment is dropped from history and stripped from every captured URL, so the AES key never reaches telemetry.
4. **Given** the lock-screen emergency widget, **When** first used, **Then** it is disabled by default and requires explicit in-app opt-in recording a disclosure snapshot.

### User Story 3 - Harden session and token lifecycle (Priority: P2)

Session revocation is effective within seconds, refresh tokens cannot be replayed, and signing keys can rotate.

**Why this priority**: MEDIUM. Stolen-device response (SC-013 ≤2s) and refresh-token theft are real risks, but require an already-compromised token to exploit.

**Independent Test**: Revoke a session and confirm its in-flight access token is rejected within one request; replay a rotated refresh token and confirm the whole device token family is revoked.

**Acceptance Scenarios**:

1. **Given** a revoked `ActiveSession`, **When** its still-valid (unexpired) access token is presented, **Then** the auth middleware rejects it via the `session_id` claim check (≤2s effective revocation).
2. **Given** a refresh token that has already been rotated, **When** it is presented again, **Then** the API returns `401 TokenRevoked` and revokes all tokens for that `device_id`.
3. **Given** a rotated signing key, **When** a token signed by the previous key is validated, **Then** it still validates within the dual-key `kid` window.

### User Story 4 - Correct authorization and abuse-resistance gaps (Priority: P2)

Every endpoint enforces the right auth posture; erasure is never blocked; enumeration and lockout-DoS are mitigated.

**Why this priority**: MEDIUM. Each gap degrades a control (a stolen token schedules deletion, handles enumerate, a lockout DoSes a victim) without being a direct takeover.

**Independent Test**: Confirm deletion intake requires a fresh re-auth token and is not age-gated; confirm handle-check requires auth + rate limit; confirm a not-owned session/QR id returns 404; confirm Public-mode traffic is attributed to the real client IP.

**Acceptance Scenarios**:

1. **Given** only a stolen bearer token, **When** `POST /deletion/intake` is called, **Then** it is rejected for lack of a fresh `reauth_token`; and a user with no stored DOB can still complete deletion (no age gate on erasure).
2. **Given** an unauthenticated caller, **When** it probes `POST /account/handle/check`, **Then** the request is rejected (auth required) and rate-limited with uniform timing.
3. **Given** a `session_id`/`jti` not owned by the caller, **When** revoke/delete is attempted, **Then** the API returns `404` (not 403), preventing existence probing.
4. **Given** the server in Public mode behind the tunnel, **When** requests arrive, **Then** rate-limit/lockout/audit key on the real client IP (forwarded-header trust), so one attacker cannot lock out a victim by identifier.

### User Story 5 - Data-model and residency integrity (Priority: P2)

On-device PHI stores round-trip correctly, DOB encryption is rotation-safe with no nonce reuse, and residency posture is honestly recorded.

**Why this priority**: MEDIUM. UUID encoding drift can orphan the append-only dose chain (integrity of a clinical audit trail); DOB nonce reuse is a latent crypto break; the residency gap is a documented compliance exposure.

**Independent Test**: Write→read→join round-trip across every on-device PHI table with TEXT UUIDs; confirm each DOB encryption uses a fresh stored 96-bit nonce and a `dob_key_version`; confirm the residency descope is recorded in the risk register.

**Acceptance Scenarios**:

1. **Given** any on-device PHI table, **When** a UUID PK/FK is written and re-read and joined, **Then** the value round-trips as canonical TEXT and the `medication_dose_event.parent_event_id` correction chain remains intact.
2. **Given** a DOB set twice, **When** encrypted, **Then** each ciphertext carries a distinct random 96-bit nonce (never counter-derived) and a `dob_key_version` enabling incremental rotation.
3. **Given** the P001 single-EU-region deployment, **When** an auditor reviews FR-049, **Then** the descope and residual-blob risks are recorded (RR-003/RR-004) and the superseded Postgres schema no longer prescribes a Postgres-session DOB key.

> **Scope note (dependants forward-compat, non-security)**: the US5 PHI-table pass also added a nullable `health_profile_id` column (+ index, convergent backfill) to `medications` and `health_record`, anchoring them to `health_profile` like the other PHI tables. This is schema-only forward-compat for the dependants feature (P00X); no query filters on it and no behavior changes until that spec. Done here solely to avoid a second data migration over encrypted PHI tables later.

### User Story 6 - Residual defense-in-depth hardening (Priority: P3)

Remaining LOW-severity gaps are closed: on-device key protection class, OTP pepper, public-endpoint rate limits + no-store, ciphertext size caps, web-build surface scoping, and secrets loaded from a managed store.

**Why this priority**: LOW. Individually minor; collectively they raise the floor and remove foot-guns.

**Independent Test**: Verify each control in isolation (Keychain accessibility class, OTP HMAC pepper source distinct from JWT key, `Cache-Control: no-store` on resolve, 16 KB mint cap, web build serving only public routes, secrets absent from committed env files).

**Acceptance Scenarios**:

1. **Given** the SQLCipher DB key, **When** stored, **Then** it is a 256-bit CSPRNG value in the iOS Keychain (`…AfterFirstUnlockThisDeviceOnly`, non-synchronizable) / Android Keystore.
2. **Given** the public emergency resolve endpoint, **When** called repeatedly, **Then** it is per-IP rate-limited and responses carry `Cache-Control: no-store`.
3. **Given** the web release build, **When** loaded, **Then** it serves only `/emergency/*`, `/account/delete*`, `/status` and disables authenticated flows (web `flutter_secure_storage` degrades to localStorage).

### Edge Cases

- What happens when a recovery token's `jti` store is unavailable at claim time? (Fail closed — reject rather than risk a replay.)
- How does the age gate behave when DOB is present but undecryptable? (Deny — fail closed — everywhere except deletion intake, which is never gated.)
- What happens to an in-flight access token at the exact moment its session is revoked? (Next request is rejected; no grace beyond one request.)
- How does UUID normalization handle rows already written in the divergent BLOB encoding (gaps.md G13)? (Migration/normalization step required, not just new-write correctness.)
- What happens on web where `history.replaceState` is unavailable or the page is opened in a context that logs the full referrer? (Fragment must be dropped before any capture path runs.)

## Requirements *(mandatory)*

### Functional Requirements

Account-takeover surfaces (US1):
- **FR-001**: `POST /auth/recovery/claim` MUST use a ≥128-bit random token signed with a key/`typ` distinct from the access-token key, TTL ≤72h, single-use (persisted `jti` burned on first use; replay → `401 TokenReplayed`), per-IP + global rate-limited, audit-logged per attempt, with a security notification to the quarantined identity.
- **FR-002**: OIDC exchange MUST pin `aud` to Balsm client IDs, reject `emailVerified=false` with `403`, and link identities by `(provider, providerSubject)` only — never merge into an existing account by email match absent provider-asserted verified email.
- **FR-003**: The user-cloud backup blob MUST be sealed with a random 256-bit DEK wrapped by `Argon2id(user backup recovery code ≥80 bits)`; no key material may derive from the OTP; the wrapped DEK is stored beside the blob and restore unwraps via the recovery code.
- **FR-004**: The admin one-time recovery code (000 surface — cross-referenced only) is out of scope here.

PHI leakage (US2):
- **FR-010**: Medication reminder notifications MUST render a fixed localized generic title/body with no drug name, dose, or schedule in any visible field or wearable preview; the due-dose id travels only in the deep-link payload.
- **FR-011**: Crash/telemetry scrubbing MUST redact Arabic clinical terms and Eastern-Arabic-Indic / Extended-Arabic-Indic digit identifiers, cover the `DD/MM/YYYY` date mask, and the fuzz gate MUST assert on exception `value` content, not only field names.
- **FR-012**: All captured URLs MUST have fragments and tokenized path segments stripped; the public emergency page MUST drop `#k=` from history immediately after reading the key.
- **FR-013**: The lock-screen emergency widget MUST default to disabled and require explicit opt-in recording a disclosure snapshot; its app-group storage uses `.completeUntilFirstUserAuthentication`.

Session & token lifecycle (US3):
- **FR-020**: Access tokens MUST carry a `session_id` claim validated against a live `ActiveSession` each request, so revocation is effective ≤2s (SC-013); tokens carry a `kid` header with a dual-key validation window.
- **FR-021**: Refresh MUST be single-use with reuse detection — a replayed rotated token returns `401 TokenRevoked` and revokes the device token family; refresh tokens are stored only as SHA-256 of a ≥256-bit random value.

Authorization & abuse resistance (US4):
- **FR-030**: `POST /deletion/intake` MUST require a fresh server-validated `reauth_token` and MUST NOT be age-gated (erasure is a data-subject right).
- **FR-031**: `POST /account/handle/check` MUST require auth, be rate-limited, and use uniform response timing.
- **FR-032**: Owner-scoped resources (`DELETE /sessions/{id}`, `POST /emergency-qr/{jti}/revoke`) MUST return `404` for unknown-or-not-owned ids.
- **FR-033**: The admin/patient cookie surface (000) uses CSRF + `SameSite`; for the patient API, all IP-derived controls MUST resolve the real client IP via trusted forwarded-header handling in Public mode, and a lockout event MUST NOT shift a deletion-grace deadline; unverified-source failures require CAPTCHA before counting toward per-identifier lockout.

Data-model & residency (US5):
- **FR-040**: Every UUID column in every on-device PHI table MUST be stored as canonical lowercase-hyphenated TEXT; a round-trip + cross-table-join integrity test MUST pass (closes gaps.md G13).
- **FR-041**: DOB encryption MUST use a per-encryption random 96-bit nonce stored with the ciphertext (never counter-derived), a master-key + per-user HKDF-subkey hierarchy from a managed secret store, and a per-row `dob_key_version` for incremental rotation; `GET /account/self` returns a derived `dob_year` without per-read decryption.
- **FR-042**: The residency posture MUST be recorded honestly: FR-049 per-country routing is descoped for P001 (single EU region), tracked as RR-003/RR-004, and the superseded Postgres schema MUST NOT prescribe a Postgres-session DOB key.

Residual hardening (US6):
- **FR-050**: The SQLCipher key MUST be a 256-bit CSPRNG value in the iOS Keychain (`…AfterFirstUnlockThisDeviceOnly`, non-synchronizable) / Android Keystore (StrongBox where available).
- **FR-051**: The OTP HMAC pepper MUST load from the secret store, distinct from the JWT signing key; OTP verify MUST also be per-IP rate-limited.
- **FR-052**: `GET /emergency-qr/resolve/{jti}` MUST be per-IP rate-limited with `Cache-Control: no-store`; mint `ciphertext` MUST be capped at 16 KB.
- **FR-053**: The web release build MUST serve only the public routes (`/emergency/*`, `/account/delete*`, `/status`) and disable authenticated flows in P001.
- **FR-054**: All backend secrets (JWT signing key, DOB master key, `RESEND_API_KEY`, reCAPTCHA secret, Apple ES256 `.p8`) MUST load from a managed secret store, never a committed env file, with documented rotation.

### Certification Compliance *(required for features touching clinical data, lab results, medications, diagnoses, FHIR resources, or patient records)*

| Standard | Applies? | Obligation |
|----------|----------|------------|
| HL7 FHIR R4 | No | No new FHIR resources; no `/metadata` change. |
| LOINC | No | No lab/observation codes. |
| SNOMED CT | No | No clinical findings introduced. |
| ICD-10 | No | No diagnosis codes. |
| RxNorm | No | No medication coding changes (medication data already on-device). |
| DPG Standard | Yes | Strengthens data-protection posture; no new personal data collected. |
| Egypt PDPL (Law 151/2020) | Yes | Improves data-minimization (lockout/audit retention, crash scrub), erasure (deletion never age-gated), and encryption of DOB PHI. No new collection. |
| KSA PDPL (Royal Decree M/19) | Yes | Same protections; no residency change (single EU region — RR-003 records the KSA/UAE exposure). |
| UAE PDPL (Fed. Decree-Law 45/2021) + Health Data Law (Fed. Law 2/2019) | Yes | FR-049 residency remains descoped (RR-003); this feature does not add UAE residency — it records the gap honestly. |

**New compliance obligations this feature introduces**: None new — it closes gaps against existing obligations. It formally records residency + residual-blob risks (RR-003, RR-004).

### Key Entities *(include if feature involves data)*

- **Recovery token**: short-lived, single-use, `jti`-tracked credential for support-mediated recovery; distinct signing key.
- **Refresh token family**: per-device chain of rotated refresh tokens; reuse of a superseded member revokes the whole family.
- **ActiveSession**: bound to access tokens via `session_id`; revocation invalidates in-flight tokens.
- **DOB ciphertext record**: AES-256-GCM ciphertext + stored 96-bit nonce + `dob_key_version`; plus a derived non-PHI `dob_year`.
- **Backup blob**: ciphertext + wrapped DEK stored in the user's cloud; opened only with the user's backup recovery code.
- **On-device PHI UUIDs**: canonical TEXT across all PHI tables (PK + FK).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero medication notifications contain a drug name or dose (verified by the reminder-payload assertion in the PHI fuzz suite).
- **SC-002**: 100% of replayed recovery tokens and rotated refresh tokens are rejected (integration tests green).
- **SC-003**: Session revocation is effective within ≤2s / one request (measured against SC-013).
- **SC-004**: The PHI-leak fuzz suite passes on both client and server with the expanded corpus (Arabic terms, Eastern-Arabic-Indic digits, URL-fragment vectors) and asserts on exception `value` content.
- **SC-005**: The on-device UUID round-trip + join integrity test passes for every PHI table (gaps.md G13 closed).
- **SC-006**: No account-erasure path is blocked by the age gate; deletion intake requires a fresh re-auth token.
- **SC-007**: Static/CI checks confirm no backend secret is present in a committed env file and every DOB ciphertext carries a distinct stored nonce + key version.
- **SC-008**: `/speckit.analyze` reports full spec↔plan↔tasks coverage and the `security` checklist passes before implementation of each priority tier.

## Assumptions

- The P001 code in `../balsm_app/` and `../Balsm-API-DotNet/` is the implementation target; this feature edits existing code rather than greenfield.
- The corrected P001 contracts + data-model (committed on the `001-patient-app-mvp` branch) are the authoritative design baseline; where this spec and those artifacts agree, the artifacts are canonical.
- The `SEC-D01–09` and `SEC-F01–10` task stubs in `001/tasks/{dotnet,flutter}.md` seed this feature's `tasks.md` and are superseded by it once `/speckit.tasks` runs.
- A managed secret store (KMS / platform secret facility) is available in staging/prod for FR-054; local dev may use an untracked file.
- Implementation proceeds in priority tiers (P1 → P3) with diff review between tiers, not one unattended `/speckit.implement` pass, given the security surface and the two-repo blast radius.
