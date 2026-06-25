# Implementation Plan: P001 — Consumer Patient App MVP

**Branch**: `001-patient-app-mvp` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-patient-app-mvp/spec.md`

> **Architecture pivot 2026-06-17**: Cloud backend is **.NET 10.0 ASP.NET Core** (not Supabase Edge Functions + Supabase Auth). Database remains PostgreSQL via EF Core 10. Flutter client calls the .NET API directly via `dio`. `supabase_flutter` SDK removed. Rationale: aligns with Constitution §Technology Stack, eliminates Supabase vendor lock-in, enables local-offline mode per Principle V. Research decisions updated in `research.md §26–§33`.

---

## Summary

Consumer patient app for Egypt, KSA, UAE. Passwordless 3-channel auth (email OTP + Google + Apple) issued by a .NET 10.0 (SDK 10.0.300) ASP.NET Core API. Cloud non-PHI stored in PostgreSQL via EF Core 10.0.8; PHI lives on-device in drift/SQLCipher. Flutter 3.41.9 / Dart 3.11 melos monorepo with 12 packages. Emergency QR, medication reminders offline ≥7 days, self-service deletion with 7-day grace, active sessions management, RTL-native 4-locale UI. Public routes (emergency QR resolver, account deletion, status page) served by Flutter Web.

---

## Technical Context

**Language/Version**: Dart 3.11 (3.11.5) / Flutter 3.41.9 stable (client) · C# / .NET 10.0 SDK 10.0.300 `net10.0` (backend) — latest installed SDKs as of 2026-06-17
**Primary Dependencies**:
- Backend: ASP.NET Core 10, EF Core 10.0.8 + Npgsql.EntityFrameworkCore.PostgreSQL 10.0.x, MediatR 14.1, FluentValidation 12.1, Serilog 10.0, Microsoft.AspNetCore.Authentication.JwtBearer, Microsoft.AspNetCore.RateLimiting, Resend .NET SDK (or direct HttpClient), BouncyCastle.Cryptography (AES-256-GCM DOB encryption), Google/Apple OIDC token validation
- Client: Flutter 3.41.9, melos ^7, drift 2.29, sqlcipher_flutter_libs, flutter_secure_storage ^9.x, dio ^5.x, flutter_local_notifications ^17.x, permission_handler ^11.x, cloud_kit (iOS backup), googleapis_auth (Android backup), sentry_flutter ^9.0, go_router ^14.x, riverpod ^2.x
**Storage**: PostgreSQL 16 (cloud non-PHI, EF Core 10.0.8 + Npgsql) · SQLite/SQLCipher (on-device PHI, drift 2.29) · iCloud Drive (iOS backup blob) · Google Drive (Android backup blob)
**Testing**: Flutter test / integration_test · xUnit + WebApplicationFactory (ASP.NET Core integration tests) · Docker Compose test DB
**Target Platform**: iOS 16+ · Android 13+ (SDK 33+) · Flutter Web (public routes) · .NET hosted service on Linux/Docker
**Project Type**: Mobile app (iOS/Android/Web) + REST API (.NET)
**Performance Goals**: SC-001a signup ≤90s wall-time · SC-001b OTP ≤30s P50 · SC-014 QR revocation ≤2s · SC-301 language switch ≤200ms · SC-013 session revoke ≤2s · SC-002a restore ≤30s P50
**Constraints**: Offline ≥7 days (medication reminders) · PHI never on wire plaintext · DOB field-level AES-256-GCM encrypted at application layer · ASP.NET Core RateLimiting handles per-email/per-IP OTP throttle · 4 first-class locales RTL-native · single global account (no per-country sharding in P001 except UAE row residency)
**Scale/Scope**: ~10k DAU Egypt-primary launch · 12 Flutter packages · 7 .NET modules · ~50 screens · ~20 API endpoints

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — all pass.*

**Certification compliance gate**:
- [x] Read `CERTIFICATIONS.md Section 3` — P001 ships ICD-10 optional free-text field only; no FHIR surfaces, no LOINC, no SNOMED, no RxNorm coded values in P001 (cert table: all deferred to P002)
- [x] System URIs: not applicable in P001 (no coded clinical values required in this phase)
- [x] Free-text permitted: allergies, conditions, medications stored verbatim → lossless P002 SNOMED/RxNorm enrichment per forward-compat decision §19
- [x] FHIR resources: N/A in P001 — no FHIR surfaces shipped per spec Certification Compliance table
- [x] Anti-corruption layer: N/A (no FHIR ↔ domain translation in P001)
- [x] `/metadata` CapabilityStatement update: **No** — not required in P001 (cert table)
- [x] New personal data collected: **Yes** — email, country, language, encrypted DOB, handle. Consent captured via `disclosure_acceptance` with supervisory authority snapshot (FR-040)
- [x] Data exportable as FHIR Bundle: **Deferred to P002** per 2026-06-15 directive (no in-app export in P001; DPG Standard compliance tracked in cert register)

**MENA jurisdiction gate**:
- [x] Target jurisdictions: Egypt, KSA, UAE (multi-jurisdiction, FR-300..FR-305)
- [x] Data residency: UAE-resident users provisioned on UAE-resident PostgreSQL instance (FR-049); all others on EU-region instance; encrypted DOB pinned at signup — known gap RR-001 documented in `docs/compliance-risks.md`
- [x] Telemedicine licensing: **N/A** — P001 is patient self-management only, no telemedicine surfaces
- [x] National exchange integration: Riayati/Malaffi/NPHIES/EHA: **N/A in P001** — deferred to P002 per cert table
- [x] DHA/DOH ADHICS: in-scope P001 surfaces reviewed; MOHAP/DHA/DOH ADHICS controls met per spec Certification Compliance table

**Open-source ecosystem gate** (Principle XII):
- [x] All new .NET modules licensed AGPL-3.0-or-later (Balsm-Core repository)
- [x] No PHI in public artifacts — `beforeSend` Sentry scrub + Dio PHI-interceptor + test fixtures use synthetic data only
- [x] Data export path: deferred to P002; `deletion_log` is anonymous; on-device PHI stays user-owned (iCloud/Drive)
- [x] Third-party dependencies pinned — EF Core 10.0.8, Npgsql.EntityFrameworkCore.PostgreSQL 10.0.x, MediatR 14.1, FluentValidation 12.1, all OSS-compatible licenses
- [x] Reproducible builds: .NET SDK pinned via `global.json`; Flutter SDK pinned via `fvm`; Docker base image pinned to SHA
- [x] DCO `Signed-off-by:` policy reaffirmed per Principle XII

---

## Project Structure

### Documentation (this feature)

```text
specs/001-patient-app-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 — all decisions inc. .NET pivot (§26-§33)
├── data-model.md        # Phase 1 — DB schema (updated for .NET auth tables)
├── quickstart.md        # Phase 1 — local dev setup
├── contracts/
│   ├── crash-allowlist.json
│   ├── medication-scheduler.md
│   ├── module-package-boundaries.md
│   ├── supabase-schema.sql       # Kept as PostgreSQL reference schema (EF migrations are authoritative)
│   └── dotnet-api-endpoints.md   # NEW — .NET REST API contract (replaces Supabase Edge Function map)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# .NET Backend — Balsm-Core/
src/
├── Balsm.API/                    # ASP.NET Core 10 web host; minimal API + controllers
│   ├── Controllers/
│   │   ├── AuthController.cs     # OTP request/verify, Google/Apple OIDC token exchange
│   │   ├── AccountController.cs  # handle claim, profile meta, country/language change
│   │   ├── EmergencyQrController.cs
│   │   ├── SessionsController.cs
│   │   └── DeletionController.cs
│   ├── Middleware/
│   │   ├── CorrelationIdMiddleware.cs
│   │   ├── PhiLeakGuardMiddleware.cs  # blocks non-allowlisted fields from log
│   │   └── AgeGateFilter.cs
│   └── Program.cs
├── Balsm.Infrastructure/         # EF Core 10 + Npgsql, DI registrations
│   ├── Data/
│   │   ├── BalsmDbContext.cs      # Multi-module DbContext composition
│   │   └── Migrations/
│   ├── Auth/
│   │   ├── JwtService.cs         # JWT issue + validation
│   │   ├── OtpService.cs         # 6-digit OTP generation + Resend delivery
│   │   ├── GoogleOidcValidator.cs
│   │   └── AppleOidcValidator.cs
│   ├── Encryption/
│   │   └── DobEncryptionService.cs  # AES-256-GCM DOB encrypt/decrypt; key from env
│   └── RateLimit/
│       └── OtpRateLimitPolicy.cs    # per-email + per-IP + global policies
├── Balsm.SharedKernel/           # Result<T>, domain exceptions, value objects
│   ├── Domain/
│   │   ├── CountryCode.cs
│   │   ├── Bcp47Tag.cs
│   │   └── UuidV7.cs
│   └── Infrastructure/
│       └── BaseDbContext.cs
└── Modules/
    ├── Auth/                     # AuthSession aggregate, OTP flow, lockout
    │   ├── Commands/
    │   │   ├── RequestOtpCommand.cs
    │   │   ├── VerifyOtpCommand.cs
    │   │   ├── ExchangeGoogleTokenCommand.cs
    │   │   └── ExchangeAppleTokenCommand.cs
    │   ├── Domain/
    │   │   ├── AuthSession.cs
    │   │   └── AccountLockout.cs
    │   └── Infrastructure/
    │       └── AuthDbContext.cs
    ├── Account/                  # user_account, handle, country/language
    │   ├── Commands/
    │   ├── Queries/
    │   ├── Domain/
    │   └── Infrastructure/
    ├── EmergencyQr/              # mint, resolve, revoke
    │   ├── Commands/
    │   ├── Queries/
    │   └── Infrastructure/
    ├── Sessions/                 # ActiveSession CRUD, revoke
    │   └── ...
    ├── Deletion/                 # FSM: ACTIVE → DELETION_REQUESTED → purge
    │   └── ...
    ├── Disclosure/               # Cloud mirror of disclosure_acceptance
    │   └── ...
    └── Geofence/                 # denied_country_blocklist read-side

tests/
├── Balsm.API.IntegrationTests/  # WebApplicationFactory + TestContainers PostgreSQL
├── Modules/
│   ├── Auth.Tests/
│   ├── Account.Tests/
│   ├── EmergencyQr.Tests/
│   └── Deletion.Tests/
└── Shared/
    └── TestFixtures/

# Flutter Client — balsm_app_flutter/
packages/
├── core/                  # Shared kernel: event bus, i18n, HTTP client (dio), value objects
│   ├── lib/src/
│   │   ├── domain/        # UuidV7, CountryCode, Bcp47Tag, Money
│   │   ├── infrastructure/
│   │   │   ├── http/      # BalsmApiClient (dio wrapper), auth interceptor
│   │   │   ├── db/        # SQLCipher drift setup, key derivation
│   │   │   └── backup/    # BackupAdapter, iCloudBackupAdapter, DriveBackupAdapter
│   │   └── notifications/ # permission_state_provider, notification scheduler
│   └── test/
├── auth/                  # AuthSession aggregate, OTP/Google/Apple flows
│   ├── lib/src/
│   │   ├── application/use_cases/
│   │   └── presentation/screens/
│   └── test/
├── profile/               # HealthProfile aggregate + PHI drift tables
├── medications/           # Medication aggregate + DoseEvent append-only
├── emergency_card/        # EmergencyCardSnapshot, QR mint + WidgetKit/QuickSettings
├── sessions/              # ActiveSession list + revoke
├── account/               # CountryCode, Bcp47Tag value objects; country/language change
├── deletion/              # DeletionRequest FSM client side
├── disclosure/            # DisclosureAcceptance; on-device canonical
├── geofence_block/        # Denied-country read + blocked signup screen
├── home/                  # Orchestration: nudges react to cross-module events
└── balsm_boundary_lint/   # custom_lint rules enforcing module boundaries

app/                       # Runnable Flutter shell (iOS/Android/Web)
├── lib/
│   ├── main_dev.dart
│   ├── main_staging.dart
│   └── main_prod.dart
└── integration_test/

# Supabase (retained for PostgreSQL migrations toolchain only in P001)
supabase/
└── supabase/
    └── migrations/        # SQL migration files applied to PostgreSQL (EF migrations primary)
```

**Structure Decision**: Option 3 (Mobile + API). .NET backend in `Balsm-Core/src/` + `Balsm-Core/tests/`. Flutter monorepo at `balsm_app_flutter/`. `supabase_flutter` SDK replaced by `core` package `BalsmApiClient` (dio). Supabase Auth replaced by `Balsm.Infrastructure.Auth` (custom JWT + OTP + OIDC validation). RLS replaced by ASP.NET Core policy-based authorization. `supabase/migrations/` directory retained as the SQL source-of-truth for schema migrations run against the managed PostgreSQL instance.

---

## Complexity Tracking

> No constitution violations requiring justification in this plan. All abstractions follow DDD Principle IV (aggregates + domain events), performance Principle VII (EF Core projections, async everywhere, pagination at DB), and offline-first Principle V (client holds PHI, .NET API holds non-PHI only).

*(Table intentionally empty — no unjustified complexity introduced.)*
