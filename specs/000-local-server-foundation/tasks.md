---
description: "Phase 0 task list — Local Server Foundation"
---

# Tasks: Local Server Foundation (Phase 0)

**Input**: Design documents from `/specs/000-local-server-foundation/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: NOT requested in spec — test tasks omitted. Constitution §VI test obligations are satisfied by extending the existing `tests/Balsm.API.Tests/` + `tests/Balsm.Supervisor.Tests/` projects in scope of the Polish phase.

**Optimization target**: tasks are sized for execution by cheap / fast models (Haiku-class). Each task names a single file (occasionally two related files) and a single change. When extension of existing code is needed, the task cites the exact file path from `Balsm-API-DotNet/`. The task ID order is also the recommended execution order; `[P]` marks tasks safe to run in parallel.

## Module & Context Scope

*From [plan.md §Module & Bounded Context Mapping](./plan.md) — retrofitted
2026-07-11 per Constitution 1.8.0 Principle IV. Tasks MUST stay inside these
modules; a task touching an undeclared module/context requires a plan.md
mapping update first.*

| Bounded Context | Repo | Module | Sub-module / Layer |
|-----------------|------|--------|--------------------|
| Entity Management (Provider plane) | Balsm-API-DotNet | src/Modules/Entity | Domain / Application / Api |
| Identity & Access (Cross-plane) | Balsm-API-DotNet | src/Modules/Identity | Domain (AdminUserMirror, LockoutRecord) / Application / Infrastructure |
| Identity & Access (Cross-plane) | Balsm-API-DotNet | src/Balsm.Supervisor | Auth (incl. RecoveryCodeService) / Middleware |
| — shared kernel / infra (sanctioned non-context value: `infrastructure`) | Balsm-API-DotNet | src/Balsm.Infrastructure | Lifecycle / Backup / Audit / Operations / Localization |
| — admin surface | Balsm-API-DotNet | admin-ui/ | pages / components / i18n |

> **Ubiquitous-language note**: the local server's own operational state
> (config, backups, audit, migration state) lives under
> `Balsm.Infrastructure/Operations/` (EF schema `ops`) — deliberately NOT named
> "Platform", which canonically denotes the Platform *plane* (Balsm Cloud:
> Balsm Network, Platform Access, Marketplace) per
> [`architecture/bounded-contexts/README.md`](../../architecture/bounded-contexts/README.md).
> Lockout state is Identity & Access language and lives in `Modules/Identity`.

**Primary (owning) context**: Entity Management

## Format

`[ID] [P?] [Story?] Description with absolute file path`

## Path conventions

All `.NET` paths are under `../Balsm-API-DotNet/`. All SPA paths are under `../Balsm-API-DotNet/admin-ui/`.

## Routing conventions

Endpoints cited in tasks follow [`architecture/routing-best-practices.md`](../../architecture/routing-best-practices.md):
- Response envelope with `data`/`error` + `meta.requestId`
- Pagination via `page`/`pageSize` query params
- `Idempotency-Key` on mutation endpoints that could be retried
- `X-Request-ID` on all responses
- Error codes use `{DOMAIN}_{ERROR_TYPE}` pattern

**API subdomains**: The local server resolves to `local.balsm.health` in LAN/Public mode; `api.balsm.health` is reserved for future cloud phases. All task-cited endpoints under `/api/v1/...` are relative to the active base URL depending on deployment mode. See [`architecture/subdomain-route-mapping.md`](../../architecture/subdomain-route-mapping.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: package additions + new directory scaffolding. No business logic.

- [ ] T001 Add `Konscious.Security.Cryptography.Argon2` 1.3.1 and `NCrontab` 3.3.3 `<PackageVersion>` entries to `../Balsm-API-DotNet/Directory.Packages.props`
- [ ] T002 [P] Add `react-i18next` ^14, `i18next` ^23, `i18next-browser-languagedetector` ^8 to `dependencies` in `../Balsm-API-DotNet/admin-ui/package.json` and run `npm install` to update lockfile
- [ ] T003 [P] Create empty directories: `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/`, `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/`, `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/`, `../Balsm-API-DotNet/src/Balsm.Infrastructure/Operations/`, `../Balsm-API-DotNet/src/Balsm.Infrastructure/Localization/`, `../Balsm-API-DotNet/src/Balsm.Supervisor/Tray/`, `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/`, `../Balsm-API-DotNet/admin-ui/src/i18n/en/`, `../Balsm-API-DotNet/admin-ui/src/i18n/ar/`
- [ ] T004 [P] Reference `Konscious.Security.Cryptography.Argon2` in `../Balsm-API-DotNet/src/Balsm.Supervisor/Balsm.Supervisor.csproj` (`<PackageReference Include="Konscious.Security.Cryptography.Argon2" />`)
- [ ] T005 [P] Reference `NCrontab` in `../Balsm-API-DotNet/src/Balsm.Infrastructure/Balsm.Infrastructure.csproj`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: cross-cutting infrastructure every user story depends on. **No US task may start until this phase completes.**

### Audit + Readiness building blocks

- [ ] T006 Create `AuditContext` ambient-state class (`AsyncLocal<AuditContextValue>` with `Actor`, `SourceIp`, `CorrelationId`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditContext.cs`
- [ ] T007 [P] Create `ReadinessGate` thread-safe singleton (`SetNotReady(string reason)`, `SetReady()`, `IsReady`, `Reason`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/ReadinessGate.cs`
- [ ] T008 [P] Create `AuditEnricherMiddleware` (`InvokeAsync` populates `AuditContext.Current` from session cookie + `HttpContext.Connection.RemoteIpAddress` + correlation id) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Middleware/AuditEnricherMiddleware.cs`
- [ ] T009 [P] Create `MigrationGateMiddleware` (returns HTTP 503 with JSON `{ "ready": false, "reason": "<gate.Reason>" }` when `!ReadinessGate.IsReady` AND path is neither `/api/v1/health` nor `/api/v1/server-info`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Middleware/MigrationGateMiddleware.cs`

### Operations schema (config + audit + backup + migration) + Identity lockout state

- [ ] T010 [P] Create `BackupTrigger`, `BackupStatus` enums in `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/Enums.cs` (`WorkspaceStatus` is Entity-domain language — it is created with the `Workspace` aggregate in T077, NOT here)
- [ ] T011 [P] Create `ServerConfigEntry` entity (`Key`, `Value` from `BaseEntity`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Operations/ServerConfigEntry.cs`
- [ ] T012 [P] Create `BackupFile` entity (`Filename`, `Path`, `SizeBytes`, `Sha256`, `Trigger`, `Status`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/BackupFile.cs`
- [ ] T013 [P] Create `AuditLog` entity (`Sequence`, `OccurredAt`, `Actor`, `SourceIp`, `Module`, `Action`, `TargetType`, `TargetId`, `DetailsJson`, `CorrelationId`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditLog.cs`
- [ ] T014 [P] Create `AuditArchive` entity at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditArchive.cs`
- [ ] T015 [P] Create `MigrationStateRecord` entity at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/MigrationStateRecord.cs`
- [ ] T016 [P] Create `LockoutRecord` entity at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Domain/LockoutRecord.cs` — lockout is Identity & Access ubiquitous language (Constitution §II), so the entity lives in the Identity module, not shared infrastructure (see data-model.md A.11)
- [ ] T017 Create `OperationsDbContext` with `DbSet`s for the five infrastructure entities above (`ServerConfigEntry`, `BackupFile`, `AuditLog`, `AuditArchive`, `MigrationStateRecord`) and `HasDefaultSchema("ops")` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Operations/OperationsDbContext.cs` — derive from `Balsm.Infrastructure.Data.BaseDbContext` (`LockoutRecord` belongs to `IdentityDbContext`, T057)
- [ ] T018 [P] Create EF Core `IEntityTypeConfiguration<ServerConfigEntry>` with unique index on `Key` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Operations/Configurations/ServerConfigEntryConfiguration.cs`
- [ ] T019 [P] Create `IEntityTypeConfiguration<BackupFile>` with descending index on `CreatedAt` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/Configurations/BackupFileConfiguration.cs`
- [ ] T020 [P] Create `IEntityTypeConfiguration<AuditLog>` with autoincrement on `Sequence` + indexes on `(OccurredAt DESC, Sequence DESC)` and `(Module, Action)` AND `HasQueryFilter(_ => true)` to disable global soft-delete filter at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/Configurations/AuditLogConfiguration.cs`
- [ ] T021 [P] Create `IEntityTypeConfiguration<AuditArchive>` with unique index on `Filename` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/Configurations/AuditArchiveConfiguration.cs`
- [ ] T022 [P] Create `IEntityTypeConfiguration<MigrationStateRecord>` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/Configurations/MigrationStateRecordConfiguration.cs`
- [ ] T023 [P] Create `IEntityTypeConfiguration<LockoutRecord>` with unique index on `(AdminEmail, SourceIp)` at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/Data/Configurations/LockoutRecordConfiguration.cs`
- [ ] T024 Add seed-data method `SeedDefaultConfig(ModelBuilder)` covering all 13 `ServerConfig` keys (see data-model.md A.10) in `../Balsm-API-DotNet/src/Balsm.Infrastructure/Operations/OperationsSeedData.cs`; call from `OperationsDbContext.OnModelCreating`
- [ ] T025 Generate initial EF migration `InitialOperationsSchema` for `OperationsDbContext` via `dotnet ef migrations add InitialOperationsSchema --project src/Balsm.Infrastructure --startup-project src/Balsm.API --context OperationsDbContext` (commit migration files under `../Balsm-API-DotNet/src/Balsm.Infrastructure/Migrations/Operations/`)

### Audit pipeline

- [ ] T026 Create `IAuditLogWriter` interface (`Task WriteAsync(AuditLog row, CancellationToken ct)`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/IAuditLogWriter.cs`
- [ ] T027 Create `AuditLogWriter` class persisting rows via injected `OperationsDbContext` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditLogWriter.cs`
- [ ] T028 Create `AuditSaveChangesInterceptor` (`SavingChangesAsync` walks `ChangeTracker.Entries<BaseEntity>()`, builds an `AuditLog` per Added/Modified/IsDeleted-flipped entry, calls `IAuditLogWriter.WriteAsync`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditSaveChangesInterceptor.cs`
- [ ] T028a Enforce audit-log immutability technically (not just by convention): in the `InitialOperationsSchema` migration (T025), add SQLite `BEFORE UPDATE` and `BEFORE DELETE` triggers on `AuditLog` that `RAISE(ABORT, 'audit log is append-only')`. The retention job (T133) is the sole authorized deleter — it runs its prune over a dedicated connection that drops+recreates these triggers around the delete batch (document the exact bracket in T133), so no ordinary application path can UPDATE/DELETE an audit row.

### Database options + PRAGMA wiring

- [ ] T029 Extend `../Balsm-API-DotNet/src/Balsm.Infrastructure/Configuration/DatabaseServiceExtensions.cs`: when `Provider == "sqlite"`, configure `optionsBuilder.AddInterceptors(...)` with `AuditSaveChangesInterceptor` AND attach `SqliteConnection.StateChange` handler running PRAGMAs `journal_mode=WAL`, `synchronous=NORMAL`, `busy_timeout=5000`, `foreign_keys=ON`, `temp_store=MEMORY`, `mmap_size=268435456`
- [ ] T030 Extend `../Balsm-API-DotNet/src/Balsm.Infrastructure/Data/BaseDbContext.cs` `SaveChangesAsync` to read `AuditContext.Current` and populate `BaseEntity.CreatedBy` / `UpdatedBy` / `DeletedBy` / `DeletedAt` accordingly

### Migration gate

- [ ] T031 Create `MigrationRunner` `IHostedService` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/MigrationRunner.cs` — in `StartAsync`, set `ReadinessGate.SetNotReady("migration")`, apply all `Microsoft.EntityFrameworkCore.Database.MigrateAsync()` for every registered DbContext, then `SetReady()`
- [ ] T032 Create `MigrationRecoveryService` (called from `MigrationRunner` BEFORE `MigrateAsync`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Lifecycle/MigrationRecoveryService.cs` — detects orphan `MigrationStateRecord` rows and either re-runs or rolls back

### Dependency-injection composition root

- [ ] T033 Extend `../Balsm-API-DotNet/src/Balsm.Infrastructure/DependencyInjection.cs` `AddSharedInfrastructure`: register `ReadinessGate` (singleton), `IAuditLogWriter` → `AuditLogWriter` (scoped), `AuditSaveChangesInterceptor` (scoped), `OperationsDbContext` via `AddDbContext`, and the two hosted services (`MigrationRecoveryService` then `MigrationRunner`)

### Existing-controller extensions

- [ ] T034 Extend `../Balsm-API-DotNet/src/Balsm.API/Controllers/HealthController.cs` payload to include `ready`, `version`, `uptime_seconds`, optional `not_ready_reason` — reading from injected `ReadinessGate`
- [ ] T035 Add public `string GetFingerprint()` returning `SHA-256(cert.RawData)` base64-url-encoded to `../Balsm-API-DotNet/src/Balsm.Supervisor/Security/CertificateService.cs`
- [ ] T036 Create `../Balsm-API-DotNet/src/Balsm.API/Controllers/ServerInfoController.cs` with `[Route("api/v1/server-info")]` returning `{ version, mode, workspace_name, certificate_sha256, uptime_seconds }` — `workspace_name` lookup via MediatR `GetWorkspaceQuery` (or returns empty when no workspace yet). **When `mode == Public`** (server is internet-reachable) OMIT `workspace_name` (return null) and coarsen `version` to `major.minor` so an anonymous internet caller cannot fingerprint an exact-version healthcare server tied to a named business; return the full payload only on LAN (Standalone/Network).

### Program.cs pipeline wiring

- [ ] T037 Insert `app.UseMiddleware<MigrationGateMiddleware>()` immediately after the existing `app.UseMiddleware<ExceptionHandlingMiddleware>()` line in `../Balsm-API-DotNet/src/Balsm.API/Program.cs`
- [ ] T038 Insert `app.UseMiddleware<AuditEnricherMiddleware>()` immediately after `app.UseRouting()` in `../Balsm-API-DotNet/src/Balsm.API/Program.cs`
- [ ] T038a Harden the HTTP↔HTTPS boundary in `../Balsm-API-DotNet/src/Balsm.API/Program.cs`: the HTTP `:5050` listener MUST serve ONLY `307 → https://<host>:5051<path>` redirects plus `/api/v1/health` — never the `/admin` or auth surface (use `UseHttpsRedirection` scoped so credentials can never transit cleartext); add HSTS (`UseHsts`, `max-age≥31536000`) on the HTTPS pipeline. (FR — closes the mDNS-advertised plaintext-fallback path.)
- [ ] T038b CSRF + cookie hardening: (1) issue `balsm_admin_session` with `HttpOnly; Secure; SameSite=Strict; Path=/` (set in `AdminSessionService`); (2) extend `AdminAuthMiddleware` to reject (403) any state-changing (non-GET/HEAD/OPTIONS) `/api/v1/admin/*` request that lacks the header `X-Balsm-Csrf: 1` — a custom header cannot be attached by a cross-site form/simple request, so its presence is the CSRF defense. The unauthenticated whitelist endpoints (setup/login/status/recovery/use) are exempt from the header check but stay behind `RateLimitMiddleware`.
- [ ] T038c Configure `ForwardedHeadersMiddleware` in `../Balsm-API-DotNet/src/Balsm.API/Program.cs` to trust ONLY the tunnel hop when `mode == Public` (Cloudflare `CF-Connecting-IP`); every IP-derived control (`RateLimitMiddleware` T052, `LockoutRecord` keying, audit `SourceIp`) MUST read the client IP, never the loopback proxy address — otherwise in Public mode all remote traffic collapses to one IP (lockout DoS + broken audit attribution). In Standalone/Network, forwarded headers are NOT trusted.

**Checkpoint**: foundation ready. All user stories below may now proceed in parallel by different developers.

---

## Phase 3: User Story 1 — First-Run Server Installation & Setup (Priority: P1) 🎯 MVP

**Goal**: a pharmacy admin completes a first-run wizard, receives a one-time recovery code, and lands on the dashboard. Single-admin enforcement, password hashing, lockout, and recovery flows all work end-to-end.

**Bounded Context / Module**: Identity & Access → Balsm-API-DotNet/src/Balsm.Supervisor (Auth) + src/Modules/Identity (AdminUserMirror, RecoveryCode) + admin-ui

**Independent Test**: install the package on a fresh VM, open `https://localhost:5051/admin`, complete the wizard, store the recovery code, lock the account with 5 bad logins, restore it via the recovery code, log in again successfully.

### Password hashing migration

- [ ] T039 [US1] Create `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/IPasswordHasher.cs` interface: `byte[] Hash(string password, byte[] salt)`, `bool Verify(string password, byte[] salt, byte[] storedHash)`, `string AlgorithmId { get; }`
- [ ] T040 [P] [US1] Create `Pbkdf2Hasher` (verify-only, 100k iterations to match existing) at `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/Pbkdf2Hasher.cs`
- [ ] T041 [P] [US1] Create `Argon2idHasher` (params `memorySize=65536`, `iterations=3`, `parallelism=2`, 16-byte salt, 32-byte tag) using `Konscious.Security.Cryptography.Argon2id` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/Argon2idHasher.cs`
- [ ] T042 [US1] Extend `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/AdminCredentials.cs` with five new string/DateTime fields: `PasswordHashAlgorithm` (default `"pbkdf2"` on read), `RecoveryCodeHash`, `RecoveryCodeCreatedAt`, `RecoveryCodeUsedAt`, `RecoveryCodeRetiredAt`
- [ ] T043 [US1] Extend `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/FileCredentialStore.cs` JSON read path to default-fill the five new fields when absent; write path always emits them
- [ ] T043a [US1] Harden `FileCredentialStore` on-disk protection (the file holds the password hash + salt + recovery-code hash + backup key): write via atomic temp-file + rename; set file mode `0600` service-user ownership on Unix and a SYSTEM+Administrators-only ACL on Windows; verify the mode/ACL at startup and log a warning + re-tighten if the file is world/group-readable.
- [ ] T044 [US1] Refactor `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/AdminAuthService.cs` to depend on `IEnumerable<IPasswordHasher>` (keyed by `AlgorithmId`); on `LoginAsync` use the hasher matching `creds.PasswordHashAlgorithm`; on successful verify with a non-`argon2id` hasher, immediately re-hash with the Argon2id hasher and persist
- [ ] T045 [US1] Register `Pbkdf2Hasher` + `Argon2idHasher` as `IPasswordHasher` singletons in `../Balsm-API-DotNet/src/Balsm.Supervisor/SupervisorRegistration.cs` and inject them into `AdminAuthService`

### Recovery code

- [ ] T046 [P] [US1] Create `RecoveryCodeService.GenerateAsync(CancellationToken)` returning a 16-char Base32 (`A-Z2-7`) code, hashing it with Argon2id, storing hash + created-at on the loaded `AdminCredentials` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/RecoveryCodeService.cs`
- [ ] T047 [US1] Add `RecoveryCodeService.ConsumeAsync(string email, string code, string newPassword)` to the same file, enforcing single-use so a code cannot be replayed to reset the password repeatedly: (1) reject (return failure → 401) BEFORE any comparison when `RecoveryCodeUsedAt != null || RecoveryCodeRetiredAt != null`; (2) verify `email` matches the stored admin username; (3) constant-time compare (`CryptographicOperations.FixedTimeEquals`) the code hash; (4) in the SAME credential-file write that calls `AdminAuthService.SetPasswordAsync(newPassword)`, atomically set BOTH `RecoveryCodeUsedAt` and `RecoveryCodeRetiredAt`; (5) clear lockout; return `LoginResult`
- [ ] T048 [US1] Register `RecoveryCodeService` as singleton in `../Balsm-API-DotNet/src/Balsm.Supervisor/SupervisorRegistration.cs`
- [ ] T049 [US1] Add `POST /api/v1/admin/auth/recovery/use` handler to `../Balsm-API-DotNet/src/Balsm.Supervisor/Controllers/AuthController.cs`: accepts `RecoveryUseRequest`, calls `RecoveryCodeService.ConsumeAsync`, sets the `balsm_admin_session` cookie on success
- [ ] T050 [US1] Add `POST /api/v1/admin/auth/recovery/regenerate` (cookie-auth) handler to the same `AuthController.cs` calling `RecoveryCodeService.GenerateAsync` and returning the plaintext code once
- [ ] T051 [US1] Extend the `PublicPaths` array in `../Balsm-API-DotNet/src/Balsm.Supervisor/Middleware/AdminAuthMiddleware.cs` to include `/api/v1/admin/auth/recovery/use`

### Composite (email, IP) rate limit

- [ ] T052 [US1] Create `RateLimitMiddleware` keyed by `(emailFromBody, RemoteIpAddress)`, with 5/15 policy mirroring `AdminAuthService`, at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Middleware/RateLimitMiddleware.cs` — persist trip state to the `LockoutRecord` rows in `IdentityDbContext` (resolve a scope per request; `IMemoryCache` is a read-through cache only) so lockout survives process restart per data-model.md A.11
- [ ] T053 [US1] Insert `app.UseWhen(ctx => ctx.Request.Path.StartsWithSegments("/api/v1/admin/auth"), b => b.UseMiddleware<RateLimitMiddleware>());` before `AdminAuthMiddleware` in `../Balsm-API-DotNet/src/Balsm.API/Program.cs`
- [ ] T054 [US1] Update the lockout response in `../Balsm-API-DotNet/src/Balsm.Supervisor/Controllers/AuthController.cs` `Login` to return HTTP 423 (not 401) when `LoginResult.IsLockedOut`

### First-run wizard extension (server)

- [ ] T055 [US1] Extend `POST /api/v1/admin/auth/setup` in `../Balsm-API-DotNet/src/Balsm.Supervisor/Controllers/AuthController.cs` to: (a) **anti-hijack gate** — when `Connection.RemoteIpAddress` is NOT loopback, require `FirstRunRequest.setup_token` and constant-time compare it against the one-time token generated at first run (see T055a); return 401 on missing/mismatch (loopback requests may omit it); (b) call `AdminAuthService.SetupAsync`, (c) dispatch MediatR `CreateWorkspaceCommand` from the request payload (will exist after US2 T090 — temporarily stub via injected `IMediator` and return 503 if the command type is not yet registered), (d) call `RecoveryCodeService.GenerateAsync`, (e) return `FirstRunResponse` with recovery code
- [ ] T055a [US1] Extend `FirstRunService` (`../Balsm-API-DotNet/src/Balsm.Supervisor/Services/FirstRunService.cs`) to generate a one-time 128-bit `setup_token` at first run when no admin exists yet, persist it to `<install-dir>/var/setup.token` (`0400`/service-user-only), and surface it to the operator: print to the server console/stdout, the tray "Show setup token" item, and the installer completion output. Cleared once setup completes. Add `setup_token` (nullable string) to `FirstRunRequest`.

### Admin-user mirror (Identity module fill-in)

- [ ] T056 [P] [US1] Create `AdminUserMirror` aggregate (no password material — see data-model.md A.5) at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Domain/AdminUserMirror.cs`
- [ ] T057 [US1] Extend `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/Data/IdentityDbContext.cs` with `DbSet<AdminUserMirror>` + `DbSet<LockoutRecord>` (entity from T016) and `HasDefaultSchema("identity")`
- [ ] T058 [P] [US1] Create `IEntityTypeConfiguration<AdminUserMirror>` at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/Data/Configurations/AdminUserMirrorConfiguration.cs`. Enforce the FR-018 single-admin cap the same way the Workspace singleton is enforced (data-model A.1): add a constant discriminator column `SingletonKey` (fixed value `"AdminUser"`) and a filtered unique index `IX_AdminUserMirror_Active_Single` on `SingletonKey` `HasFilter("\"IsDeleted\" = 0")`. A filtered unique index on `Id` is a no-op (the PK is already unique) and would NOT cap active rows at 1.
- [ ] T059 [US1] Generate EF migration `InitialIdentitySchema` for `IdentityDbContext` covering `AdminUserMirror` + `LockoutRecord` (commit migration files under `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/Migrations/`)
- [ ] T060 [P] [US1] Create `IAdminUserMirrorRepository` interface (extends `IRepository<AdminUserMirror>`, adds `Task<AdminUserMirror?> GetByEmailAsync(string, CancellationToken)`) at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Domain/Repositories/IAdminUserMirrorRepository.cs`
- [ ] T061 [US1] Create `AdminUserMirrorRepository` deriving from `Balsm.Infrastructure.Data.BaseRepository<AdminUserMirror, IdentityDbContext>` at `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/Repositories/AdminUserMirrorRepository.cs`
- [ ] T062 [US1] Wire `AdminAuthService.SetupAsync` / `ChangePasswordAsync` / `LoginAsync` in `../Balsm-API-DotNet/src/Balsm.Supervisor/Auth/AdminAuthService.cs` to also insert/update the `AdminUserMirror` row via `IAdminUserMirrorRepository` (resolve from `IServiceProvider.CreateScope()` since `AdminAuthService` is singleton, mirror repo is scoped)
- [ ] T063 [US1] Extend `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Api/Controllers/UsersController.cs` with `GET /api/v1/admin/users/me` and `PATCH /api/v1/admin/users/me` returning / updating the `AdminUserMirror` projection
- [ ] T064 [US1] Register `IAdminUserMirrorRepository` → `AdminUserMirrorRepository` (scoped) in `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Infrastructure/DependencyInjection.cs` `AddIdentityInfrastructure`
- [ ] T065 [US1] Add `EnforceSingleAdminPolicy` static check in `../Balsm-API-DotNet/src/Modules/Identity/Balsm.Identity.Application/Policies/EnforceSingleAdminPolicy.cs` consumed by `AdminAuthService.SetupAsync` before any mirror write

### Admin SPA — wizard / login / recovery / i18n

- [ ] T066 [P] [US1] Create `en/common.json` translation bundle with keys for: setup wizard labels, login form, lockout banner, recovery flow, dashboard nav — at `../Balsm-API-DotNet/admin-ui/src/i18n/en/common.json`
- [ ] T067 [P] [US1] Create `ar/common.json` matching key set in Arabic at `../Balsm-API-DotNet/admin-ui/src/i18n/ar/common.json`
- [ ] T068 [US1] Create `i18n.ts` (initializes `i18next` with both bundles, default language `en`, language detection) at `../Balsm-API-DotNet/admin-ui/src/i18n/i18n.ts`
- [ ] T069 [P] [US1] Create `HtmlDirSync` React component that sets `document.documentElement.dir` to `rtl` for `ar` and `ltr` otherwise at `../Balsm-API-DotNet/admin-ui/src/components/HtmlDirSync.tsx`
- [ ] T070 [US1] Import `./i18n/i18n` and mount `<HtmlDirSync />` at the top of the `<App />` component in `../Balsm-API-DotNet/admin-ui/src/App.tsx`
- [ ] T071 [US1] Extend `../Balsm-API-DotNet/admin-ui/src/pages/SetupPage.tsx` with: (a) locale dropdown bound to i18n + persisted in admin profile after setup, (b) recovery-code display step with copy button + "I have stored it offline" checkbox required to proceed
- [ ] T072 [US1] Extend `../Balsm-API-DotNet/admin-ui/src/pages/LoginPage.tsx` to render the lockout banner on HTTP 423 (countdown until `LockedUntil`)
- [ ] T073 [US1] Create `../Balsm-API-DotNet/admin-ui/src/pages/RecoveryPage.tsx` with form: email, recovery code, new password, confirm; POSTs `/api/v1/admin/auth/recovery/use`
- [ ] T074 [US1] Add route `/admin/recovery` → `RecoveryPage` in `../Balsm-API-DotNet/admin-ui/src/App.tsx` and add a "Forgot password / locked out?" link on `LoginPage`
- [ ] T075 [US1] Extend `../Balsm-API-DotNet/admin-ui/src/api.ts` with typed clients: `authSetup(req)`, `authLogin(req)`, `authLogout()`, `recoveryUse(req)`, `recoveryRegenerate()`, `getMe()`, `patchMe(req)`. The shared fetch wrapper MUST send `credentials: 'same-origin'` and attach the header `X-Balsm-Csrf: 1` to every non-GET request (the CSRF token `AdminAuthMiddleware` requires per T038b).

### CLI — admin reset

- [ ] T076 [US1] Create `AdminResetPasswordCommand` (System.CommandLine) at `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/AdminResetPasswordCommand.cs`: prompts for new password via `Console.ReadLine` w/ no-echo, verifies `geteuid() == 0` or `IsUserAnAdmin()`, calls `AdminAuthService.SetPasswordAsync` directly in-process, clears lockout, prints audit row sequence

**Checkpoint**: install → wizard → recovery → login round-trip all work via the admin panel and the CLI. User Story 1 deliverable complete.

---

## Phase 4: User Story 2 — Workspace, Entity & Branch Management (Priority: P2)

**Goal**: admin manages the single workspace and N entities × M branches under it with soft-delete only.

**Bounded Context / Module**: Entity Management → Balsm-API-DotNet/src/Modules/Entity (Workspace, EntityRoot, EntityType, Branch) + admin-ui

**Independent Test**: complete wizard (US1), then through `/admin/entities`, create one entity with two branches, deactivate one branch, edit the other, attempt to create a second workspace (expect 409), restart the server, verify everything persisted.

### Domain layer (Entity module fill-in)

- [ ] T077 [P] [US2] Create `Workspace` aggregate at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/Workspace.cs` (properties per data-model A.1; constructor `private`; static factory `Workspace.Create(name, slug, locale)` enforcing invariants; `Rename(string newName)` raising `WorkspaceUpdatedEvent`; `ChangeSlug(string newSlug)` validating `^[a-z0-9-]{3,40}$` and raising `WorkspaceSlugChangedEvent` — slug drives the mDNS instance name, so it is domain-significant) + `WorkspaceStatus` enum in the same directory (`WorkspaceStatus.cs`)
- [ ] T078 [P] [US2] Create `EntityType` entity at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/EntityType.cs`
- [ ] T079 [P] [US2] Create `EntityRoot` aggregate at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/EntityRoot.cs` (per data-model A.3; `Update`, `Deactivate`, `Reactivate` methods that flip `IsDeleted` / `DeletedAt`)
- [ ] T080 [P] [US2] Create `Branch` aggregate at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/Branch.cs` (per data-model A.4)
- [ ] T081 [P] [US2] Create domain events: `WorkspaceUpdatedEvent`, `WorkspaceSlugChangedEvent`, `EntityCreatedEvent`, `EntityUpdatedEvent`, `EntityDeactivatedEvent`, `EntityReactivatedEvent`, `BranchCreatedEvent`, `BranchUpdatedEvent`, `BranchDeactivatedEvent`, `BranchReactivatedEvent` — one record per file under `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/Events/`; all past-tense immutable facts raised by the aggregate methods (never by handlers)
- [ ] T082 [P] [US2] Create `IWorkspaceRepository`, `IEntityRepository`, `IBranchRepository`, `IEntityTypeRepository` interfaces in `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Domain/Repositories/`

### Infrastructure layer

- [ ] T083 [US2] Extend `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Infrastructure/Data/EntityDbContext.cs` with `DbSet<Workspace>`, `DbSet<EntityRoot>`, `DbSet<Branch>`, `DbSet<EntityType>`
- [ ] T084 [P] [US2] Create EF configurations under `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Infrastructure/Data/Configurations/` — one file per aggregate: `WorkspaceConfiguration.cs`, `EntityRootConfiguration.cs`, `BranchConfiguration.cs`, `EntityTypeConfiguration.cs` with indexes from data-model.md
- [ ] T085 [US2] Add seed data for `EntityType` (`pharmacy`, `clinic`, `hospital`) in `EntityType` configuration's `HasData(...)`
- [ ] T086 [US2] Generate EF migration `InitialEntitySchema` for `EntityDbContext` under `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Infrastructure/Migrations/`
- [ ] T087 [P] [US2] Create `WorkspaceRepository`, `EntityRepository`, `BranchRepository`, `EntityTypeRepository` — each deriving from `BaseRepository<T, EntityDbContext>` — under `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Infrastructure/Repositories/`
- [ ] T088 [US2] Register the four repositories (scoped) in `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Infrastructure/DependencyInjection.cs` `AddEntityInfrastructure`

### Application layer — Workspace

- [ ] T089 [P] [US2] Create `WorkspaceDto` at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/DTOs/WorkspaceDto.cs`
- [ ] T090 [P] [US2] Create `CreateWorkspaceCommand : IRequest<Result<WorkspaceDto>>` + handler (checks `IWorkspaceRepository.AnyAsync` → returns `Result.Failure(Error.Conflict("Workspace.AlreadyExists"))` if exists) at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/Commands/CreateWorkspaceCommand.cs`
- [ ] T091 [P] [US2] Create `CreateWorkspaceCommandValidator` (slug regex `^[a-z0-9-]{3,40}$`, name 1..100) at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/Validators/CreateWorkspaceCommandValidator.cs`
- [ ] T092 [P] [US2] Create `RenameWorkspaceCommand` + `ChangeWorkspaceSlugCommand` + handlers + validators under `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/` — intent-revealing commands whose handlers call `Workspace.Rename(...)` / `Workspace.ChangeSlug(...)` (never property-set); a locale change goes through `Workspace.Create`-style validation in a `ChangeWorkspaceLocaleCommand` if the PATCH carries it
- [ ] T093 [P] [US2] Create `GetWorkspaceQuery : IRequest<Result<WorkspaceDto>>` + handler at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/Queries/GetWorkspaceQuery.cs`

### Application layer — Entity

- [ ] T094 [P] [US2] Create `EntityDto` at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Application/DTOs/EntityDto.cs`
- [ ] T095 [P] [US2] Create `CreateEntityCommand` + handler + validator under `Commands/` + `Validators/`
- [ ] T096 [P] [US2] Create `UpdateEntityCommand` + handler + validator — handler mutates via `EntityRoot.Update(...)` (raises `EntityUpdatedEvent`), never via property mapping
- [ ] T097 [P] [US2] Create `DeactivateEntityCommand` + `ReactivateEntityCommand` + handlers — call `EntityRoot.Deactivate()` / `EntityRoot.Reactivate()` (which flip `IsDeleted`/`DeletedAt` and raise `EntityDeactivatedEvent` / `EntityReactivatedEvent`)
- [ ] T098 [P] [US2] Create `GetEntityByIdQuery` + handler
- [ ] T099 [P] [US2] Create `ListEntitiesQuery : IRequest<Result<PagedList<EntityDto>>>` + handler honouring `include_inactive` + paging

### Application layer — Branch

- [ ] T100 [P] [US2] Create `BranchDto`
- [ ] T101 [P] [US2] Create `CreateBranchCommand` + handler + validator (phone regex Egyptian +20)
- [ ] T102 [P] [US2] Create `UpdateBranchCommand` + handler + validator — handler mutates via `Branch.Update(...)` (raises `BranchUpdatedEvent`)
- [ ] T103 [P] [US2] Create `DeactivateBranchCommand` + `ReactivateBranchCommand` + handlers — call `Branch.Deactivate()` / `Branch.Reactivate()` (raise `BranchDeactivatedEvent` / `BranchReactivatedEvent`)
- [ ] T104 [P] [US2] Create `ListBranchesQuery` + handler

### Application layer — EntityType

- [ ] T105 [P] [US2] Create `EntityTypeDto`
- [ ] T106 [P] [US2] Create `ListEntityTypesQuery` + handler
- [ ] T107 [P] [US2] Create `CreateEntityTypeCommand` + handler + validator (`code` regex `^[a-z0-9-]+$`; uniqueness check)

### API layer — Result mapping + controllers

- [ ] T108 [US2] Create `Result` → `IActionResult` extension `ToActionResult<T>(this Result<T>)` mapping `Error.Code` prefixes (`NotFound` → 404, `Conflict` → 409, `Validation` → 422, default 400) at `../Balsm-API-DotNet/src/Balsm.API/Extensions/ResultExtensions.cs`
- [ ] T109 [US2] Create `WorkspaceController` (`[Route("api/v1/admin/workspace")]`) at `../Balsm-API-DotNet/src/Modules/Entity/Balsm.Entity.Api/Controllers/WorkspaceController.cs` with `Get`, `Post`, `Patch` actions calling MediatR — `Patch` decomposes the request body into the intent-revealing commands (`RenameWorkspaceCommand` for `name`, `ChangeWorkspaceSlugCommand` for `slug`), dispatching only the commands whose fields are present
- [ ] T110 [US2] Create `EntitiesController` (`[Route("api/v1/admin/entities")]`) at the same module's `Controllers/` with `Get` list, `Post` create, `Get/{id}`, `Patch/{id}`, `Post/{id}/deactivate`, `Post/{id}/reactivate`
- [ ] T111 [US2] Create `BranchesController` (`[Route("api/v1/admin")]`) handling `/entities/{id}/branches` GET+POST and `/branches/{id}` PATCH+DELETE-405 and `/branches/{id}/deactivate` + `/branches/{id}/reactivate` POST
- [ ] T112 [US2] Create `EntityTypesController` (`[Route("api/v1/admin/entity-types")]`) — GET + POST

### Wire-up + integration

- [ ] T113 [US2] Verify `Balsm.Entity.Application.DependencyInjection.AddEntityApplication` already registers MediatR + FluentValidation from `AssemblyReference.Assembly` (no edit needed if true)
- [ ] T114 [US2] Resolve the US1 T055 stub: confirm `CreateWorkspaceCommand` is now wired so first-run wizard creates the workspace successfully
- [ ] T115 [US2] Extend `Balsm.API/Program.cs` to call `app.MapControllers()` already covers the new controllers (no edit needed; controllers auto-discovered)

### Admin SPA — entity management

- [ ] T116 [P] [US2] Add `BranchListCard` component at `../Balsm-API-DotNet/admin-ui/src/components/BranchListCard.tsx`
- [ ] T117 [P] [US2] Add `EntityCard` component at `../Balsm-API-DotNet/admin-ui/src/components/EntityCard.tsx`
- [ ] T118 [US2] Create `../Balsm-API-DotNet/admin-ui/src/pages/EntityManagementPage.tsx` — list / create / edit / deactivate entities + branches, with `include_inactive` toggle
- [ ] T119 [US2] Add route `/admin/entities` → `EntityManagementPage` to `../Balsm-API-DotNet/admin-ui/src/App.tsx`
- [ ] T120 [US2] Extend `../Balsm-API-DotNet/admin-ui/src/api.ts` with typed clients for `workspace`, `entities`, `branches`, `entity-types`
- [ ] T121 [US2] Add Entities link to the dashboard navigation in `../Balsm-API-DotNet/admin-ui/src/pages/DashboardPage.tsx`

**Checkpoint**: workspace + entity + branch management complete via API and admin SPA — every mutation goes through an aggregate method and raises its domain event. Soft-delete enforced, 409 on duplicate workspace, 405 on hard-delete branch.

---

## Phase 5: User Story 3 — Local Network Discovery (Priority: P3)

**Goal**: same-LAN clients discover the server by mDNS within 5 seconds of ready, with the right TXT records, and the broadcast turns off in Standalone mode.

**Bounded Context / Module**: — `infrastructure` (sanctioned non-context value) → Balsm-API-DotNet/src/Balsm.Supervisor (MdnsService). Local LAN discovery is infrastructure-host plumbing per [`architecture/bounded-contexts/README.md`](../../architecture/bounded-contexts/README.md) §Module → Context Mapping; Supervisor *federation/pairing/sharing-policy* features map to Balsm Network, but none of those are in Phase 0 scope.

**Independent Test**: from a second device on the LAN, run `dns-sd -B _balsm._tcp` / `avahi-browse -r _balsm._tcp`; confirm `balsm-<slug>` resolves within 5 s with the expected TXT records; switch mode to Standalone, observe disappearance.

- [ ] T122 [US3] Extend `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/MdnsService.cs` to choose instance name: `balsm-setup-<short-server-id>` if `IsSetupCompleteAsync == false`, else `balsm-<workspace.slug>` (read via `IServiceScope` + `GetWorkspaceQuery`)
- [ ] T123 [US3] Extend `MdnsService` TXT records: `v=1`, `srv_id=<SupervisorOptions.ServerInstanceId>`, `app_ver=<assembly version>`, `mode=<ServerStatusService.GetStatus().Mode>`, `ws_name=<url-encoded>`, `wizard=required|absent`, `http_port=5050`, `https_port=5051`, `cert_sha256=<CertificateService.GetFingerprint()>`
- [ ] T124 [US3] In `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/NetworkDiscoveryService.cs`, subscribe to `NetworkChange.NetworkAddressChanged` and invoke a new `MdnsService.RestartAsync()` to re-broadcast within 10 s of any IP change
- [ ] T125 [US3] Add `public async Task RestartAsync(CancellationToken ct = default)` to `MdnsService.cs` — tears down `_serviceDiscovery` + `_mdns`, recreates them
- [ ] T126 [US3] Update `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/ServerStatusService.cs` `SwitchModeAsync` to: (a) **step-up re-auth when the target mode is `Public`** — require `ModeChange.current_password` and re-validate it via `AdminAuthService` before proceeding (internet-exposure is a privileged action; return 401 on missing/wrong password); (b) write `appsettings.Production.json` (existing behaviour), (c) emit an audit log entry `Module="Mode" Action="ModeChanged"`, (d) call `IHostApplicationLifetime.StopApplication()` so systemd / launchd / Windows Service Manager auto-restart cycles the process with the new mode

**Checkpoint**: mDNS discovery contract from `contracts/mdns-service.md` fully observable.

---

## Phase 6: User Story 4 — Database Backup & Recovery (Priority: P4)

**Goal**: admin runs on-demand backups, schedules automatic ones with retention, and restores from a backup with the server returning 503 to non-health endpoints during the swap.

**Bounded Context / Module**: — `infrastructure` (sanctioned non-context value) → Balsm-API-DotNet/src/Balsm.Infrastructure (Backup, Lifecycle, Operations)

**Independent Test**: backup, mutate DB, restore, verify mutation gone; configure schedule + retention, fast-forward, verify pruning.

### Backup core

- [ ] T127 [P] [US4] Create `BackupOptions` POCO (`Directory`, `MaxConcurrentBackups = 1`, `EncryptAtRest = true`) at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/BackupOptions.cs`. The backup directory MUST be created `0700` / service-user-only ACL (Windows: SYSTEM+Administrators). The same directory holds audit JSONL archives, which inherit the ACL.
- [ ] T128 [P] [US4] Create `IBackupService` interface at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/IBackupService.cs`: `Task<Result<BackupFile>> BackupNowAsync(BackupTrigger trigger, CancellationToken ct)`
- [ ] T129 [US4] Create `SqliteOnlineBackupService` implementing `IBackupService` — opens source `SqliteConnection` against `DatabaseOptions.ConnectionString`, opens destination against `<BackupOptions.Directory>/balsm-<yyyyMMdd-HHmmss>.db`, calls `source.BackupDatabase(destination)`, computes SHA-256, writes `BackupFile` row via `OperationsDbContext` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/SqliteOnlineBackupService.cs`. **Encrypt at rest**: when `BackupOptions.EncryptAtRest`, AES-256-GCM-encrypt the finished backup file with the `backupKeyBase64` key from the credential store (data-model B) and write `.db.enc` (never leave a plaintext `.db` copy on disk); `RestoreOrchestrator` (T131) decrypts with the same key before the integrity check. If a deployment opts out, the task MUST document full-disk-encryption as a prerequisite. The backup directory is created `0700`/service-user-only.

### Backup scheduler

- [ ] T130 [P] [US4] Create `BackupScheduler` `IHostedService` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/BackupScheduler.cs` — reads `server_config.backup_cron` via `OperationsDbContext`, uses `NCrontab.CrontabSchedule` to compute next fire, `Task.Delay`s to it, calls `IBackupService.BackupNowAsync(BackupTrigger.Scheduled, ...)`, then prunes per `backup_retention` (delete oldest files until count ≤ retention; never delete the most recent OK file)

### Restore orchestrator

- [ ] T131 [US4] Create `RestoreOrchestrator` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Backup/RestoreOrchestrator.cs` with `Task<Result> RestoreAsync(Guid backupFileId, CancellationToken ct)`: (a) look up `BackupFile` row + verify SHA-256, (b) copy to `<install>/balsm.db.restoring`, (c) run `PRAGMA integrity_check` + `PRAGMA foreign_key_check`, (d) `ReadinessGate.SetNotReady("restore")`, (e) **preserve audit history before the swap** — the live `AuditLog` lives inside `balsm.db`, so `File.Replace` would erase every audit row recorded since the backup; export all `AuditLog` rows with `OccurredAt` newer than the backup's `CreatedAt` to a dated JSONL archive via `AuditExportSink` and register the `AuditArchive` row FIRST, (f) `File.Replace(restoringPath, livePath, livePath + ".rollback")`, (g) register the retained `.rollback` file as a `PreRestore` `BackupFile` row, (h) recreate `DbContext` scopes via `IServiceScopeFactory`, (i) emit audit `RestoreCompleted` with backup SHA-256, (j) `ReadinessGate.SetReady()`. On any failure: swap back from `.rollback`, emit `RestoreFailed`, clear gate.

### Audit retention job

- [ ] T132 [P] [US4] Create `AuditExportSink` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditExportSink.cs`: `Task<AuditArchive> WriteAsync(IEnumerable<AuditLog> rows, string filename, CancellationToken ct)` — JSONL serialization, fsync, SHA-256 sum, register `AuditArchive` row
- [ ] T133 [US4] Create `AuditRetentionJob` `IHostedService` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Audit/AuditRetentionJob.cs` — `NCrontab` schedule from `server_config.audit_retention_cron`, queries `AuditLog` older than `audit_retention_years`, writes them to a dated JSONL archive via `AuditExportSink`, then deletes from `AuditLog` over a dedicated connection that drops+recreates the append-only triggers (T028a) around the delete batch (the only authorized delete path).
- [ ] T133a [US4] Add PDPL data-minimization pruning to `AuditRetentionJob` (or a sibling swept on the same schedule): (a) delete `LockoutRecord` rows whose `LastFailureAt` is older than 30 days; (b) delete `AuditArchive`-referenced JSONL files (and their rows) older than `audit_retention_years + 1` year so exported personal data (emails, IPs) is not retained forever after leaving the live table.

### Register hosted services

- [ ] T134 [US4] Extend `../Balsm-API-DotNet/src/Balsm.Infrastructure/DependencyInjection.cs` `AddSharedInfrastructure` to bind `BackupOptions` from configuration section `Backup`, register `IBackupService` → `SqliteOnlineBackupService` (scoped), `RestoreOrchestrator` (scoped), `AuditExportSink` (scoped), `BackupScheduler` + `AuditRetentionJob` as `IHostedService`

### API controllers — backups + restore + audit

- [ ] T135 [P] [US4] Create `BackupsController` (`[Route("api/v1/admin/backups")]`) at `../Balsm-API-DotNet/src/Balsm.API/Controllers/BackupsController.cs` with `GET` (paged), `POST` (on-demand backup), `GET /schedule`, `PUT /schedule` (writes `server_config.backup_cron` + `backup_retention`), `POST /{id}/restore` (delegates to `RestoreOrchestrator`; requires `confirm_phrase == "RESTORE"`)
- [ ] T136 [P] [US4] Create `AuditController` (`[Route("api/v1/admin/audit")]`) at `../Balsm-API-DotNet/src/Balsm.API/Controllers/AuditController.cs` with `GET /logs` (paged, filters), `GET /retention`, `PUT /retention`, `GET /archives` (paged)

### Admin SPA — backups + audit

- [ ] T137 [P] [US4] Create `BackupListCard` at `../Balsm-API-DotNet/admin-ui/src/components/BackupListCard.tsx`
- [ ] T138 [P] [US4] Create `AuditTable` at `../Balsm-API-DotNet/admin-ui/src/components/AuditTable.tsx` with column filters
- [ ] T139 [US4] Create `BackupsPage` at `../Balsm-API-DotNet/admin-ui/src/pages/BackupsPage.tsx` — schedule editor, retention slider, list, "Backup Now", "Restore" (confirmation dialog requiring user to type `RESTORE`)
- [ ] T140 [US4] Create `AuditLogPage` at `../Balsm-API-DotNet/admin-ui/src/pages/AuditLogPage.tsx` — `AuditTable` + retention controls + archives list
- [ ] T141 [US4] Add routes `/admin/backups` and `/admin/audit` to `../Balsm-API-DotNet/admin-ui/src/App.tsx`; add nav links on `DashboardPage`
- [ ] T142 [US4] Extend `../Balsm-API-DotNet/admin-ui/src/api.ts` with typed clients: `listBackups`, `backupNow`, `getBackupSchedule`, `putBackupSchedule`, `restoreBackup`, `listAuditLogs`, `getAuditRetention`, `putAuditRetention`, `listAuditArchives`

### CLI — backup / restore / verify / audit export

- [ ] T143 [P] [US4] Create `BackupCommand` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/BackupCommand.cs` — `balsm backup` (on-demand) + `balsm backup list`
- [ ] T144 [P] [US4] Create `DbRestoreCommand` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/DbRestoreCommand.cs` — `balsm db restore <file>` (requires `--yes`)
- [ ] T145 [P] [US4] Create `DbVerifyCommand` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/DbVerifyCommand.cs` — runs `PRAGMA integrity_check` + `PRAGMA foreign_key_check`
- [ ] T146 [P] [US4] Create `AuditExportCommand` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/AuditExportCommand.cs` — `balsm audit export --to <path> [--from <date>] [--to-date <date>]`
- [ ] T147 [US4] Wire all CLI commands into the existing CLI router program in `../Balsm-API-DotNet/src/Balsm.Supervisor/Cli/Program.cs` (create if missing — single switch on `args[0]`)

**Checkpoint**: full backup + restore + audit + retention pipeline observable from admin panel and CLI.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: clean-up, packaging hygiene, deviations honored, quickstart validated, constitution-mandated tests added.

- [ ] T148 [P] Drop `.AppImage` build hooks from `../Balsm-API-DotNet/packaging/linux/debian/` (per spec FR-001 patch + plan Complexity Tracking)
- [ ] T149 [P] Verify `../Balsm-API-DotNet/packaging/macos/com.balsm.api.plist` contains `RunAtLoad=true`, `KeepAlive=true`, owner `root:wheel`, mode `0644`; add log routing under `/Library/Logs/Balsm/` if missing
- [ ] T150 [P] Add `ExecStartPre=/usr/local/bin/balsm db verify` to `../Balsm-API-DotNet/packaging/linux/balsm-api.service`
- [ ] T151 [P] Add `ITunnelProvider` interface at `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/ITunnelProvider.cs` (`Task StartAsync`, `Task StopAsync`, `string? Url { get; }`, `TunnelStatus Status { get; }`)
- [ ] T152 Refactor `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/CloudflareTunnelService.cs` to implement `ITunnelProvider`
- [ ] T153 [P] Add `NullTunnelProvider` (no-op) at `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/NullTunnelProvider.cs`
- [ ] T154 Update `../Balsm-API-DotNet/src/Balsm.Supervisor/Controllers/TunnelController.cs` to depend on `ITunnelProvider`; register the impl selected by `server_config.tunnel_provider` in `SupervisorRegistration.cs`
- [ ] T155 [P] Create `LocalCliTokenService` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Services/LocalCliTokenService.cs` that writes a fresh 32-byte token to `<install-dir>/var/local-cli.token` (`chmod 0400` / equivalent ACL on Windows) at startup AND rotates it every 24 h (timer/hosted-service), not only once at process start
- [ ] T156 [P] Create `LocalOsTrustMiddleware` at `../Balsm-API-DotNet/src/Balsm.Infrastructure/Middleware/LocalOsTrustMiddleware.cs`. It grants CLI trust ONLY when ALL hold, else it does nothing (falls through to cookie auth): (a) `HttpContext.Connection.RemoteIpAddress.IsLoopback` is true; (b) the `X-Balsm-Local-Token` header constant-time-matches (`CryptographicOperations.FixedTimeEquals`) the `local-cli.token` file contents; (c) the request path is on an explicit allowlist of read-only CLI routes matching `contracts/cli-commands.md` (`GET /admin/status`, `GET /admin/backups`, `GET /admin/audit/logs`) — privileged CLI operations (restore, mode switch, password) MUST NOT be reachable through this header and stay on the in-process OS-privilege path; (d) the request carries NO `CF-Connecting-IP` / `X-Forwarded-*` header (in Public mode the tunnel forwards internet traffic via loopback, so loopback stops being a trust signal) — presence of those headers hard-rejects the trust path
- [ ] T157 [P] Tray surface — Windows: create `WindowsTrayHost` at `../Balsm-API-DotNet/src/Balsm.Supervisor/Tray/WindowsTrayHost.cs` (NotifyIcon, STA thread, gated by `--ui` flag)
- [ ] T158 [P] Tray surface — macOS: create `MacOsTrayHost.cs` invoking a small Cocoa helper binary
- [ ] T159 [P] Tray surface — Linux: create `LinuxTrayHost.cs` using `libappindicator3` via P/Invoke
- [ ] T160 [P] Add Argon2id / lockout / recovery-code integration tests under `../Balsm-API-DotNet/tests/Balsm.Supervisor.Tests/Auth/` using real in-process SQLite (Constitution §VI). MUST include: (a) recovery-code **replay** rejected — a second `recovery/use` with an already-consumed code returns 401 and does NOT change the password (T047); (b) recovery `email` mismatch returns 401; (c) `/admin/auth/status` returns `admin_email: null` when unauthenticated and the real email only when authenticated (T036/AuthStatus); (d) redaction — Serilog output for `/admin/auth/{setup,login,recovery/use}` contains no password / recovery-code / recovery-code-response value (T165a).
- [ ] T161 [P] Add Workspace/Entity/Branch integration tests under `../Balsm-API-DotNet/tests/Balsm.API.Tests/Entity/` using `WebApplicationFactory`
- [ ] T162 [P] Add Backup/Restore/Audit integration tests under `../Balsm-API-DotNet/tests/Balsm.API.Tests/Backup/`
- [ ] T163 [P] Add Playwright end-to-end tests for the wizard + recovery flow under `../Balsm-API-DotNet/admin-ui/tests/e2e/wizard.spec.ts`
- [ ] T164 Run the `quickstart.md` walkthrough end-to-end on macOS, Linux, and Windows; record pass/fail per SC-001..SC-008
- [ ] T165 Update `../Balsm-API-DotNet/CLAUDE.md` notes section to mention the new infrastructure namespaces (`Lifecycle`, `Backup`, `Audit`, `Operations`, `Localization`), the file-store + SQLite mirror split, and the naming rule that "Platform" is reserved for the canonical Platform plane (use `Operations` for local-server ops state)
- [ ] T165a Configure Serilog request logging in `../Balsm-API-DotNet/src/Balsm.API/Program.cs` to NEVER capture request or response bodies for `/api/v1/admin/auth/*` (setup, login, recovery/use) — those carry passwords and one-time recovery codes; add an explicit destructuring/redaction filter and cover it with the T160(d) redaction assertion.

---

## Dependencies & Execution Order

### Phase order

- Phase 1 (Setup) → Phase 2 (Foundational) → Phases 3..6 (User Stories in parallel after Foundational) → Phase 7 (Polish).
- Foundational must be 100% complete before any US task starts: it ships the `OperationsDbContext`, `AuditSaveChangesInterceptor`, `ReadinessGate`, `MigrationGateMiddleware`, and `AuditEnricherMiddleware` that every US task depends on.

### Within each user story

- **US1** must complete T056 → T064 in order (mirror repo before AdminAuthService writes to it).
- **US2** can run all `[P]` Domain tasks (T077–T082) in parallel, then T083→T088 sequentially (single DbContext file), then `[P]` Application tasks (T089–T107) in parallel, then controllers T108→T112 sequentially (some share `Balsm.API/Extensions/`).
- **US3** is small; tasks are mostly sequential within `MdnsService.cs`.
- **US4** can fan out `[P]` across `Backup`, `Audit`, controllers, SPA, and CLI sub-trees.

### Cross-story dependencies

- US1 T055 (first-run wizard creates workspace) consumes US2 T090 (`CreateWorkspaceCommand`). If US2 is not staffed in parallel, leave the T055 stub returning 503 until T090 lands.
- US1 T052 (`RateLimitMiddleware` persistence) consumes T016 (`LockoutRecord`, Phase 2) + T057/T059 (`IdentityDbContext` DbSet + migration) — wire the in-memory path first if T057 has not landed.
- US4 T131 (restore) requires Phase 2 T031 (`MigrationRunner`) + Phase 2 T009 (`MigrationGateMiddleware`).

### Parallel opportunities

- After Phase 2: US1 + US2 + US3 + US4 may run on four separate developers / agents.
- Inside Phase 2: T010–T016 are all `[P]` (different files); T018–T023 are all `[P]`.

---

## Parallel example — Phase 2 entity-config burst

```bash
# T018..T023 — six EF configurations, six different files, zero shared state
Task: T018 ServerConfigEntryConfiguration.cs
Task: T019 BackupFileConfiguration.cs
Task: T020 AuditLogConfiguration.cs
Task: T021 AuditArchiveConfiguration.cs
Task: T022 MigrationStateRecordConfiguration.cs
Task: T023 LockoutRecordConfiguration.cs
```

## Parallel example — Phase 4 (US2) domain burst

```bash
# T077..T082 — six domain aggregates / interfaces, all independent files
Task: T077 Workspace.cs
Task: T078 EntityType.cs
Task: T079 EntityRoot.cs
Task: T080 Branch.cs
Task: T081 Events/ (ten event records)
Task: T082 Repositories/ (four interfaces)
```

---

## Implementation strategy

### MVP first (US1 only)

1. Phase 1 (5 tasks) + Phase 2 (33 tasks) → foundation ready.
2. Phase 3 US1 (38 tasks: T039..T076) → admin can install, complete wizard, log in, recover from lockout.
3. **Stop and validate**: run quickstart steps 1, 2, 5.
4. Demo / ship MVP. Subsequent stories add value without breaking US1.

### Incremental delivery

- After US1 → demo.
- Add US2 → entities + branches manageable → demo.
- Add US3 → discovery from second device → demo.
- Add US4 → backup / restore / audit → demo.
- Polish → constitution-mandated tests, deviations honored, end-to-end validation.

### Parallel team strategy

- Foundation team: T006..T038.
- Dev A: US1 (Phase 3).
- Dev B: US2 (Phase 4).
- Dev C: US3 (Phase 5).
- Dev D: US4 (Phase 6).
- Polish team picks up Phase 7 after stories land.

---

## Notes for cheap-model execution

- Each task names the exact file path. Open the file (or create it if absent), apply the named change, do not refactor adjacent code.
- When a task says "extend `<existing file>`", load the file first, locate the cited symbol (e.g. `AdminAuthService.LoginAsync`), and add the new behavior without rewriting unrelated regions.
- Repository references: `BaseRepository<TEntity, TDbContext>` lives in `../Balsm-API-DotNet/src/Balsm.Infrastructure/Data/BaseRepository.cs`. Mirror its constructor + `DbSet` pattern in every new repository implementation.
- Commands always return `Result<T>` from `Balsm.SharedKernel.Results`. Validators are FluentValidation `AbstractValidator<TCommand>`. MediatR auto-discovers both via `RegisterServicesFromAssembly(AssemblyReference.Assembly)` which is already wired in every module's `DependencyInjection.cs`.
- Cookie auth, `AdminAuthMiddleware`, `AdminSetupRedirectMiddleware`, `FederationAuthMiddleware` are already in the pipeline — do not re-add them.
- All `/api/v1/admin/*` endpoints inherit cookie auth automatically. New public-by-design routes MUST also be added to the `PublicPaths` array in `AdminAuthMiddleware.cs`.
- All entity IDs are `Guid` because `BaseEntity.Id` is `Guid`. Do not introduce `int` IDs anywhere.
- Soft-delete is automatic via the global query filter in `BaseDbContext`. Do not write per-DbContext filter overrides except where data-model.md explicitly says so (the audit log table is the only override).
- Audit-log writes are automatic via `AuditSaveChangesInterceptor`. Do not call `IAuditLogWriter` from handler code unless the operation bypasses EF Core (auth events, restore lifecycle, mode change).
