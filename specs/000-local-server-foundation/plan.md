# Implementation Plan: Local Server Foundation (Phase 0)

**Branch**: `000-local-server-foundation` (planning performed from `main` per the user's standing override) | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/000-local-server-foundation/spec.md` and the live state of `Balsm-API-DotNet`.

## Summary

Phase 0 extends the existing `Balsm-API-DotNet` repository, which is already past the scaffolding stage. The plan reuses every existing capability and limits new code to the smallest delta required by the spec. Confirmed-existing capabilities (cited by file path):

- **Single-process Standalone host**: `src/Balsm.API/Program.cs` already calls `UseWindowsService()` + `UseSystemd()`, generates a self-signed cert via `Balsm.Supervisor.Security.CertificateService.EnsureCertificate(...)`, binds Kestrel to HTTP `:5050` + HTTPS `:5051` (the canonical default), and **loads `Balsm.Supervisor` as an in-process library** via `AddSupervisorModule(...)` + `AddApplicationPart(typeof(SupervisorRegistration).Assembly)`. Foundation phase therefore ships **one** OS service in Standalone mode; the second `balsm-supervisor.service` unit in `packaging/linux/` is reserved for split-process Network/Public deployments and is not a Phase 0 concern.
- **Modular monolith skeleton**: `src/Modules/{Customer,Entity,Identity,Inventory,POS,Prescription}/` each contain four projects (`{Module}.{Api,Application,Domain,Infrastructure}`); each Application layer already has `DependencyInjection.cs` registering MediatR + FluentValidation via `RegisterServicesFromAssembly(AssemblyReference.Assembly)`; each Api layer has `ModuleRegistration.cs` exposing `Add{Module}Module`; each Infrastructure layer has `DependencyInjection.cs` exposing `Add{Module}Infrastructure(IConfiguration)` that calls `services.AddDbContext<{Module}DbContext>(o => o.ConfigureDatabase(dbOptions))`. Domain + Application directories are empty except for `AssemblyReference.cs`.
- **SharedKernel building blocks**: `BaseEntity` (`Guid Id`, `CreatedAt/By`, `UpdatedAt/By`, `IsDeleted`, `DeletedAt/By`), `AggregateRoot` (domain events), `Result` + `Result<T>` + `Error`, `IRepository<T>`, `IUnitOfWork`, `PagedList<T>`, `PagingParams`, `IDomainEvent` + `IDomainEventDispatcher` + `DomainEventDispatcher`.
- **Shared infrastructure**: `Balsm.Infrastructure.DependencyInjection.AddSharedInfrastructure(...)` registers `IDomainEventDispatcher` and binds `DatabaseOptions`; `BaseDbContext` applies a **global query filter on `BaseEntity.IsDeleted`** and sets audit timestamps in `SaveChangesAsync`; `BaseRepository` provides EF Core CRUD; `CorrelationIdMiddleware` + `ExceptionHandlingMiddleware` already in the pipeline.
- **Supervisor (in-process)**: `Balsm.Supervisor` ships `FirstRunService` (browser-opening BackgroundService that writes a sentinel and currently invokes `https://localhost:<httpsPort>/admin/setup`), `MdnsService` (`Makaretu.Dns.Multicast 0.27.0`, registers `_balsm._tcp.local.` + responds to `<MdnsHostname>.local` A-queries), `CloudflareTunnelService` (FR-013 Public mode), `NetworkDiscoveryService`, `ConnectionInfoService`, `ServerStatusService` (status payload + mode-switch that rewrites `appsettings.Production.json`), `SelfUpdateService`, `FederationService` + `FileFederationStore`, `SyncService`. Auth: `AdminAuthService` with **PBKDF2 100k iterations**, 5-fail / 15-min lockout (matches Constitution §II); `AdminSessionService` + cookie `balsm_admin_session`; `FileCredentialStore` JSON file. Middleware: `AdminSetupRedirectMiddleware`, `AdminAuthMiddleware` (whitelists `/api/v1/admin/auth/{setup,login,status}`), `FederationAuthMiddleware`. Public-facing surface lives under `/api/v1/admin/*` and is cookie-authenticated; setup/login/status are exempted.
- **Existing endpoints in scope**: `Balsm.API.Controllers.HealthController` (`/api/v1/health`), `VersionController` (`/api/v1/version`); `Balsm.Supervisor.Controllers` provides `Auth`, `Connect`, `Control`, `FederationAdmin`, `Federation`, `Network`, `Status`, `Tunnel`, `Update` (all `/api/v1/admin/*`). `Modules.Identity.Api.Controllers.UsersController` has a placeholder `/api/v1/users/ping`. `Modules.Entity.Api.Controllers/` is empty.
- **Cross-platform packaging**: `packaging/windows/{install.ps1, install-standalone.ps1, start.bat, uninstall*.ps1}`; `packaging/macos/{build-pkg.sh, com.balsm.api.plist, com.balsm.supervisor.plist, scripts/}` (produces a `.pkg` shipped inside a `.dmg`); `packaging/linux/{balsm-api.service, balsm-supervisor.service, build-deb.sh, debian/}`.
- **Admin SPA**: `admin-ui/` (React 19 + Vite + TypeScript) with `App.tsx`, `api.ts`, `pages/{SetupPage, LoginPage, DashboardPage}`, `components/{StatusCard, ModeCard, NetworkCard, FederationCard, TunnelCard, UpdateCard, SettingsCard}`. Build output is copied to `Balsm.API/wwwroot/admin/` and served as static files (verified in `Program.cs` `UseStaticFiles` + `MapFallbackToFile`).
- **Central package pinning** (`Directory.Packages.props`): MediatR 14.1.0, FluentValidation 12.1.1, EF Core 10.0.5 (Sqlite + Postgres providers), Serilog 10.0.0, `Microsoft.Extensions.Hosting.{WindowsServices, Systemd}` 10.0.0, `Makaretu.Dns.Multicast 0.27.0`, xUnit 2.9.3, FluentAssertions 8.3.0.

The delta required by the spec is therefore: (1) fill the empty Entity + Identity Domain / Application layers with Workspace, EntityRoot, EntityType, Branch, AdminUserMirror, RecoveryCode aggregates and the CQRS handlers + validators + controllers; (2) add cross-cutting `Balsm.Infrastructure.{Lifecycle, Backup, Audit, Localization}` namespaces + an `AuditSaveChangesInterceptor` + a `MigrationGateMiddleware` + WAL PRAGMA wiring in `DatabaseServiceExtensions`; (3) extend `AdminAuthService` from PBKDF2 to Argon2id (lazy migration on next login) and add a one-time recovery code surface; (4) add system-tray UI cards / pages (Entities, Backups, Audit, Recovery) to `admin-ui/` plus i18n bundles for English + Arabic with RTL; (5) wire two new hosted services (`BackupScheduler`, `AuditRetentionJob`) into the existing `AddSharedInfrastructure` registration.

## Technical Context

**Language/Version**: .NET 10.0 (C#) for `Balsm.API`, `Balsm.Supervisor`, `Balsm.Infrastructure`, `Balsm.SharedKernel`, and all `Modules/*` projects. TypeScript 5.8 + React 19 for `admin-ui/`. PowerShell for `packaging/windows/install*.ps1`. Bash for `packaging/macos/build-pkg.sh` and `packaging/linux/build-deb.sh`.

**Primary Dependencies (already pinned in `Directory.Packages.props` — keep)**: MediatR 14.1.0 (CQRS), FluentValidation 12.1.1, EF Core 10.0.5 + Sqlite + Postgres providers, Serilog.AspNetCore 10.0.0, `Microsoft.Extensions.Hosting.{WindowsServices, Systemd}` 10.0.0, `Makaretu.Dns.Multicast 0.27.0`.

**Primary Dependencies (new — to be added to `Directory.Packages.props`)**:
- `Konscious.Security.Cryptography.Argon2` 1.3.1 — replaces PBKDF2 in `AdminAuthService` (FR-017 memory-hard requirement).
- `NCrontab` 3.3.3 — cron expression parsing for `BackupScheduler` (FR-011a) and `AuditRetentionJob` (FR-016a).

**Frontend-side new dependencies (`admin-ui/package.json`)**: `react-i18next` 14.x, `i18next` 23.x, `i18next-browser-languagedetector` 8.x — FR-019 admin UI Arabic + English with RTL.

**Storage**: SQLite (`balsm.db`) for domain data, accessed via per-module EF Core DbContexts that all derive from `Balsm.Infrastructure.Data.BaseDbContext`. Backups written under a configurable directory (default `<install-dir>/backups/`). Audit JSONL archives written to the same directory. Admin credential file remains the canonical secret store at the path managed by `Balsm.Supervisor.Auth.FileCredentialStore`; this file's JSON shape (`AdminCredentials`) gets four new fields (`passwordHashAlgorithm`, `recoveryCodeHash`, `recoveryCodeCreatedAt`, `recoveryCodeUsedAt`, `recoveryCodeRetiredAt`) — backwards-compatible with the existing layout.

**Testing**: xUnit + `WebApplicationFactory` integration tests in `tests/Balsm.API.Tests/` and `tests/Balsm.Supervisor.Tests/` (both projects already present). New integration tests use a real in-process SQLite database per Constitution §VI (no DB mocks); cover migration gate, backup/restore atomic swap, audit retention prune+export, FR-018 single-admin enforcement, recovery-code one-time-use. Admin SPA gets Vitest unit tests + Playwright end-to-end for the wizard, recovery-code, and entity flows.

**Target Platform**: Windows 10+ (registers `BalsmApi` Windows Service via `packaging/windows/install.ps1`), macOS 12+ (loads `com.balsm.api.plist` LaunchDaemon via `packaging/macos/build-pkg.sh` postinstall), Ubuntu 20.04 LTS+ Linux (`balsm-api.service` systemd unit via `packaging/linux/build-deb.sh`). Minimum hardware: 4 GB RAM, dual-core CPU, 20 GB free disk.

**Project Type**: Existing modular monolith (web application) with the Supervisor library co-hosted in the single Standalone process and a React SPA frontend served from `Balsm.API/wwwroot/admin/`.

**Performance Goals**: identical to spec (SC-002, SC-006, FR-008, FR-011).

**Constraints**:
- Reuse the existing `DatabaseOptions` (SQLite/Postgres switch) and `BaseDbContext` (soft-delete query filter, audit timestamps). Do **not** introduce a second DI registration pattern.
- Reuse cookie auth (`balsm_admin_session`) for `/api/v1/admin/*`. Do **not** introduce JWT for the local admin panel at Phase 0 — JWT remains for Federation / Network / Public clients outside the foundation surface.
- Default ports remain `:5050` (HTTP) / `:5051` (HTTPS). Spec FR-003 already aligns.
- Existing `AdminAuthMiddleware` whitelist (`/api/v1/admin/auth/{setup,login,status}`) governs all new wizard / recovery endpoints — new public endpoints MUST be added to the whitelist explicitly.
- All new endpoints under `/api/v1/admin/*` to inherit the existing cookie middleware automatically.
- No `EnsureCreated` in any production code path.
- No hard deletes on domain tables — the existing `BaseEntity.IsDeleted` query filter is sufficient.

**Scale/Scope**: 1 workspace × 1 entity × 1..N branches × 1 admin per server install.

## Constitution Check

| Principle | Status | Evidence / Notes |
|-----------|--------|------------------|
| I. Patient Safety First | N/A | No clinical data at Phase 0 |
| II. Security & Privacy by Design | PASS | `AdminAuthService` already enforces 5/15 lockout. Soft-delete enforced by `BaseDbContext`. PBKDF2 → Argon2id swap satisfies FR-017 |
| III. Regulatory Compliance | PASS | DPG + PDPL covered. Audit JSONL archive provides data-portability |
| IV. Modular Monolith with DDD | PASS | New work strictly inside existing module boundaries (`Modules/Entity`, `Modules/Identity`) plus cross-cutting infra namespaces; no cross-module DB access |
| V. Offline-First, Cloud-Enhanced | PASS | Standalone default. `CloudflareTunnelService` already provides Public mode |
| VI. Test-First Discipline | PASS | Existing test projects extended with real in-process SQLite |
| VII. Performance as a Feature | PASS | SC-002, SC-006 quantified; `AsNoTracking()` and pagination enforced by repo standards |
| VIII. Multi-Platform Consistency | **DEVIATION (2)** | (a) Linux drops `.AppImage`. (b) macOS installer is `.pkg` (existing build), not `.dmg`. See Complexity Tracking |
| IX. Ubiquitous Language | PASS | Canonical "entity" / "workspace" / "branch"; .NET command/query naming (`CreateEntityCommand`, `GetWorkspaceQuery`) per existing repo CLAUDE.md |
| X. AI Governance | N/A | No AI at Phase 0 |
| XI. Certifications & Standards Compliance | PASS | No FHIR / LOINC / SNOMED / RxNorm / ICD-10 resources introduced |

**Certification compliance gate**: identical to prior pass — no clinical resources; `/metadata` CapabilityStatement update not required.

**Gate result**: PASS with two documented deviations (installer matrix).

## Project Structure

### Documentation

```text
specs/000-local-server-foundation/
├── plan.md          # This file
├── research.md      # Phase 0
├── data-model.md    # Phase 1
├── quickstart.md    # Phase 1
├── contracts/
│   ├── http-admin-api.yaml
│   ├── cli-commands.md
│   └── mdns-service.md
└── checklists/requirements.md
```

### Source code in `Balsm-API-DotNet/` (extension, not new project)

Annotation: **(existing)** = present today; **(empty scaffold)** = directory exists but no `.cs` files beyond `AssemblyReference.cs`; **(new)** = to be added.

```text
Balsm-API-DotNet/
├── Directory.Packages.props                                                # (existing) — add Konscious.Security.Cryptography.Argon2 + NCrontab
├── src/
│   ├── Balsm.API/                                                          # (existing) single Standalone host
│   │   ├── Program.cs                                                      # (existing) — register MigrationGate, BackupScheduler, AuditRetentionJob hosted services; add RateLimitMiddleware + AuditEnricherMiddleware to pipeline
│   │   ├── Controllers/{Health,Version}Controller.cs                       # (existing) — extend Health payload (ready flag) + add /api/v1/server-info endpoint via new ServerInfoController in Balsm.API/Controllers
│   │   └── wwwroot/admin/                                                  # (existing) compiled SPA destination
│   ├── Balsm.Supervisor/                                                   # (existing — in-process library in Standalone)
│   │   ├── SupervisorRegistration.cs                                       # (existing) AddSupervisorModule — extend to register RecoveryCodeService + IPasswordHasher + Argon2idHasher
│   │   ├── Auth/
│   │   │   ├── AdminAuthService.cs                                         # (existing) PBKDF2 → Argon2id swap; lazy migration on next login; recovery-code consume path
│   │   │   ├── AdminCredentials.cs                                         # (existing) add five new fields (passwordHashAlgorithm + recovery-code fields)
│   │   │   ├── AdminSessionService.cs                                      # (existing) wire idle-timeout from ServerConfig.session_idle_minutes
│   │   │   ├── FileCredentialStore.cs                                      # (existing) extend JSON read/write; default-fill missing fields
│   │   │   ├── ICredentialStore.cs / LoginResult.cs                        # (existing)
│   │   │   ├── IPasswordHasher.cs                                          # (new) abstraction over hashers
│   │   │   ├── Pbkdf2Hasher.cs                                             # (new) verify-only path for legacy hashes
│   │   │   └── Argon2idHasher.cs                                           # (new) verify + hash path (Konscious)
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs                                           # (existing) — add /recovery/use + /recovery/regenerate endpoints; update whitelist
│   │   │   ├── ConnectController.cs / ControlController.cs                 # (existing)
│   │   │   ├── FederationAdminController.cs / FederationController.cs     # (existing)
│   │   │   ├── NetworkController.cs / StatusController.cs                  # (existing) — Status extended with cert SHA-256 + workspace name
│   │   │   ├── TunnelController.cs / UpdateController.cs                   # (existing)
│   │   ├── Middleware/
│   │   │   ├── AdminSetupRedirectMiddleware.cs                             # (existing) FR-004 redirect — unchanged
│   │   │   ├── AdminAuthMiddleware.cs                                      # (existing) cookie auth — extend public-path whitelist with /api/v1/admin/auth/recovery/*
│   │   │   └── FederationAuthMiddleware.cs                                 # (existing)
│   │   ├── Security/CertificateService.cs                                  # (existing) — add public `GetFingerprint()` returning SHA-256
│   │   ├── Services/
│   │   │   ├── FirstRunService.cs                                          # (existing) — extend to call RecoveryCodeService.GenerateAsync at setup completion and surface in the response
│   │   │   ├── MdnsService.cs                                              # (existing) — add pre-setup instance name flip + react to mode change events from ControlController
│   │   │   ├── CloudflareTunnelService.cs                                  # (existing) — refactor behind new ITunnelProvider abstraction
│   │   │   ├── ServerStatusService.cs                                      # (existing) — payload extension
│   │   │   ├── NetworkDiscoveryService.cs / ConnectionInfoService.cs       # (existing)
│   │   │   ├── SelfUpdateService.cs / FederationService.cs / FileFederationStore.cs / SyncService.cs   # (existing)
│   │   │   ├── ITunnelProvider.cs                                          # (new) FR-013 abstraction
│   │   │   ├── NullTunnelProvider.cs                                       # (new) used in Standalone + Network modes
│   │   │   └── RecoveryCodeService.cs                                      # (new) FR-018a generate / verify / retire
│   │   └── Tray/                                                           # (new) cross-platform tray surface for FR-014 + US1 AS#1
│   ├── Balsm.Infrastructure/                                               # (existing) cross-cutting
│   │   ├── DependencyInjection.cs                                          # (existing) AddSharedInfrastructure — extend to register MigrationGate, AuditSaveChangesInterceptor, BackupScheduler, AuditRetentionJob, BackupOptions, AuditOptions
│   │   ├── Configuration/
│   │   │   ├── DatabaseOptions.cs                                          # (existing)
│   │   │   └── DatabaseServiceExtensions.cs                                # (existing) — extend with SQLite PRAGMA initializer (WAL, busy_timeout, etc.)
│   │   ├── Data/
│   │   │   ├── BaseDbContext.cs                                            # (existing) soft-delete + audit fields — keep unchanged
│   │   │   └── BaseRepository.cs                                           # (existing) — keep unchanged
│   │   ├── Middleware/
│   │   │   ├── CorrelationIdMiddleware.cs / ExceptionHandlingMiddleware.cs # (existing) — keep
│   │   │   ├── MigrationGateMiddleware.cs                                  # (new) FR-010 / FR-010a / FR-011b — 503 while pending
│   │   │   ├── RateLimitMiddleware.cs                                      # (new) FR-017 wizard + login throttling (composite (email, source-ip) key)
│   │   │   └── AuditEnricherMiddleware.cs                                  # (new) populate AsyncLocal AuditContext (actor + IP)
│   │   ├── Lifecycle/                                                      # (new)
│   │   │   ├── MigrationRunner.cs                                          # (new) IHostedService — apply pending EF migrations on startup; populate ReadinessGate
│   │   │   ├── MigrationRecoveryService.cs                                 # (new) FR-010a recovery for interrupted migrations
│   │   │   └── ReadinessGate.cs                                            # (new) thread-safe boolean read by Health / MigrationGate
│   │   ├── Backup/                                                         # (new)
│   │   │   ├── SqliteOnlineBackupService.cs                                # (new) FR-011 via Microsoft.Data.Sqlite BackupDatabase
│   │   │   ├── BackupScheduler.cs                                          # (new) FR-011a — NCrontab + IHostedService
│   │   │   ├── RestoreOrchestrator.cs                                      # (new) FR-011b — atomic File.Replace + integrity_check
│   │   │   └── BackupOptions.cs                                            # (new) bound from ServerConfig
│   │   ├── Audit/                                                          # (new)
│   │   │   ├── AuditContext.cs                                             # (new) AsyncLocal ambient context (actor, source IP, correlation id)
│   │   │   ├── AuditLogWriter.cs                                           # (new) append-only writer
│   │   │   ├── AuditSaveChangesInterceptor.cs                              # (new) EF Core interceptor — captures Added / Modified / IsDeleted-flip on BaseEntity
│   │   │   ├── AuditRetentionJob.cs                                        # (new) FR-016a daily prune + JSONL export
│   │   │   └── AuditExportSink.cs                                          # (new) JSONL writer + SHA-256 + fsync
│   │   └── Localization/                                                   # (new) FR-019 server-side locale resolution
│   ├── Balsm.SharedKernel/                                                 # (existing) — keep
│   │   ├── Domain/{BaseEntity, AggregateRoot, ValueObject}.cs              # (existing) — IDs are Guid
│   │   ├── Events/{IDomainEvent, IDomainEventDispatcher, DomainEventDispatcher, IDomainEventHandler}.cs  # (existing)
│   │   ├── Pagination/{PagedList, PagingParams}.cs                         # (existing) — reuse in list endpoints
│   │   ├── Repositories/{IRepository, IUnitOfWork}.cs                      # (existing)
│   │   └── Results/{Result, Error}.cs                                      # (existing) — return type for all command handlers
│   └── Modules/
│       ├── Entity/
│       │   ├── Balsm.Entity.Domain/                                        # (empty scaffold) — add Workspace, EntityRoot, EntityType, Branch + Events
│       │   ├── Balsm.Entity.Application/                                   # (empty scaffold) — add Commands {Create,Update,Deactivate}{Workspace,Entity,Branch}Command : IRequest<Result<…>> + handlers + Queries (GetWorkspace, ListEntities, GetEntityById, ListBranches) + Validators + DTOs; DI already registers MediatR + FluentValidation
│       │   ├── Balsm.Entity.Infrastructure/                                # (existing) — extend EntityDbContext with DbSets + Configurations; add Migrations/InitialEntitySchema + repositories implementing SharedKernel IRepository<>
│       │   └── Balsm.Entity.Api/Controllers/{Workspace,Entities,Branches,EntityTypes}Controller.cs  # (new) controllers under /api/v1/admin/* using MediatR + Result mapping
│       ├── Identity/
│       │   ├── Balsm.Identity.Domain/                                      # (empty scaffold) — add AdminUserMirror (no password material) + RecoveryAudit value object
│       │   ├── Balsm.Identity.Application/                                  # (empty scaffold) — add EnforceSingleAdminPolicy + UpdateAdminLocaleCommand
│       │   ├── Balsm.Identity.Infrastructure/                              # (existing) IdentityDbContext — extend with AdminUserMirror entity + filtered unique index
│       │   └── Balsm.Identity.Api/Controllers/UsersController.cs           # (existing /ping) — extend with /me endpoint returning AdminUserMirror projection
│       ├── Customer / Inventory / POS / Prescription                        # (existing — untouched at Phase 0)
├── admin-ui/                                                                # (existing) React SPA
│   ├── package.json                                                         # (existing) — add react-i18next + i18next + i18next-browser-languagedetector
│   ├── src/
│   │   ├── App.tsx                                                          # (existing) — extend route map; mount HtmlDirSync
│   │   ├── api.ts                                                           # (existing) — extend with typed clients for Workspace/Entity/Branch/Backup/Audit/Recovery (generated from contracts/http-admin-api.yaml or hand-written; choice is implementation-phase)
│   │   ├── pages/
│   │   │   ├── SetupPage.tsx                                                # (existing) — extend with locale picker + recovery-code display step
│   │   │   ├── LoginPage.tsx                                                # (existing) — extend with 423 Locked surface
│   │   │   ├── DashboardPage.tsx                                            # (existing) — extend cards with workspace name + cert fingerprint
│   │   │   ├── EntityManagementPage.tsx                                     # (new)
│   │   │   ├── BackupsPage.tsx                                              # (new)
│   │   │   ├── AuditLogPage.tsx                                             # (new)
│   │   │   └── RecoveryPage.tsx                                             # (new)
│   │   ├── components/                                                      # (existing cards) — add EntityCard, BranchListCard, BackupListCard, AuditTable
│   │   └── i18n/                                                            # (new) en + ar JSON bundles; dir="rtl" toggle
│   └── tests/                                                               # (new) Vitest + Playwright
├── packaging/                                                                # (existing — keep)
│   ├── linux/{balsm-api.service, balsm-supervisor.service, build-deb.sh, debian/}     # (existing) — drop AppImage in debian/
│   ├── macos/{build-pkg.sh, com.balsm.api.plist, com.balsm.supervisor.plist, scripts/} # (existing) — produces .pkg
│   └── windows/{install.ps1, install-standalone.ps1, start.bat, uninstall*.ps1}        # (existing)
├── tunnel-registry/                                                         # (existing) Cloudflare Worker
├── scripts/{publish-all.sh, publish-standalone.sh}                          # (existing)
└── tests/
    ├── Balsm.API.Tests/                                                     # (existing) — extend
    └── Balsm.Supervisor.Tests/                                              # (existing) — extend
```

**Structure Decision**: Phase 0 work is an in-place extension of `Balsm-API-DotNet`. There is no new module, no new bounded context, no new process. Standalone mode runs a single Kestrel host (`Balsm.API`) with the `Balsm.Supervisor` library loaded; FR-002 is satisfied for the single OS service (`balsm-api.service` / `BalsmApi` / `com.balsm.api.plist`). All admin endpoints introduced this phase live under `/api/v1/admin/*` so they inherit `AdminAuthMiddleware` cookie auth automatically. Public endpoints (`/api/v1/health`, `/api/v1/server-info`) live outside the `/admin` prefix and bypass cookie auth. The empty `Modules/Entity` Domain + Application + Api directories are filled in-place; the empty `Modules/Identity` Domain + Application are filled with a `Guid`-keyed `AdminUserMirror` that mirrors the file-backed admin credentials for audit-join purposes only.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Linux drops `.AppImage` (Constitution §VIII) | FR-002 mandates systemd registration; the existing repo already ships `balsm-api.service` + `balsm-supervisor.service` for `.deb`; AppImage is a portable image that cannot register a system service | Shipping AppImage would either no-op service registration (violates FR-002) or duplicate the install flow with two parallel paths — no end-user benefit at this phase |
| macOS uses `.pkg` (Constitution §VIII says `.dmg`) | The existing `packaging/macos/build-pkg.sh` produces a `.pkg` that runs `pkgbuild`-style postinstall scripts to load both LaunchDaemons — only `.pkg` can register `launchd` plists at install time; `.dmg` is a disk-image wrapper, not an installer | Switching to a pure `.dmg` (drag-to-install) would force the operator to manually run a shell script to `launchctl bootstrap` the daemons, breaking FR-002's "without user intervention". The current convention is to ship the `.pkg` inside a `.dmg` for the user-facing distribution image; spec wording was updated to match |

Admin UI is React (`admin-ui/`) — not a deviation, scope of "four Flutter apps" excludes the server-resident admin SPA.
