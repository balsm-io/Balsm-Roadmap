# Phase 0 Research: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

Grounded in a fresh scan of `Balsm-API-DotNet`. Each decision states (a) the live repo's current state, (b) the spec-driven delta, (c) the chosen path, and (d) rejected alternatives. Conflicts between spec and code are resolved unilaterally per the user's "do not assume you can ask" directive.

---

## R1. mDNS library

- **Current state**: `Balsm.Supervisor.Services.MdnsService` (`Makaretu.Dns.Multicast 0.27.0`, pinned in `Directory.Packages.props`) — registers `_balsm._tcp.local.` and responds to A-queries for `<MdnsHostname>.local`.
- **Decision**: Keep `Makaretu.Dns.Multicast`. Do not introduce `Tmds.MDns`. Add a pre-setup vs post-setup instance-name flip and broadcast suppression in Standalone mode.
- **Delta**: Subscribe `MdnsService` to a new `ModeChangedEvent` published by `ServerStatusService` so it can tear down / reregister on mode change. Subscribe to `NetworkChange.NetworkAddressChanged` for hostname-change re-broadcast (FR-008 US3 AS#3).
- **Alternatives rejected**: `Tmds.MDns` (would discard working code), `Zeroconf` (discovery-only).

## R2. Password hashing — PBKDF2 → Argon2id

- **Current state**: `Balsm.Supervisor.Auth.AdminAuthService` uses PBKDF2 100k iterations, 32-byte salt, 32-byte hash; 5-fail / 15-min lockout already matches Constitution §II. Persisted via `FileCredentialStore` JSON (`AdminCredentials`).
- **Decision**: Add `Konscious.Security.Cryptography.Argon2 1.3.1` to `Directory.Packages.props`. Introduce `IPasswordHasher` abstraction with two implementations: `Pbkdf2Hasher` (verify-only; legacy) and `Argon2idHasher` (verify + hash; params `memorySize = 64 MiB`, `iterations = 3`, `parallelism = 2`, 16-byte salt, 32-byte tag). Add `passwordHashAlgorithm` field to `AdminCredentials`; default to `pbkdf2` on read for backwards compatibility. Lazy-migrate: on a successful PBKDF2 verify, re-hash with Argon2id and overwrite the stored credential atomically.
- **Conflict resolution**: spec FR-017 demands memory-hard hash; existing code uses PBKDF2 which is not. Resolved by adding the new dep and migrating in-place; no admin password reset is forced.
- **Alternatives rejected**: keep PBKDF2 at 600k iterations (still not memory-hard — violates FR-017 letter); libsodium-net (native dep); bcrypt (not memory-hard).

## R3. Composite-lockout rate limit

- **Current state**: per-account counter in `AdminCredentials.FailedLoginAttempts` + `LockoutEnd`. No per-IP component.
- **Decision**: Keep the existing per-account counter (durable). Add a sibling per-`(email, source_ip)` lockout via the new `RateLimitMiddleware` backed by `IMemoryCache` with the same 5/15 policy. Lockout response: HTTP 423.
- **Delta**: Middleware sits ahead of `AdminAuthMiddleware` on `/api/v1/admin/auth/login` and `/api/v1/admin/auth/setup`.

## R4. FR-013 mode-switch behavior + tunnel provider abstraction

- **Current state**: `Balsm.Supervisor.Services.ServerStatusService.SwitchModeAsync(string mode, int port, …)` rewrites `appsettings.Production.json` with the new bind URL and mode, then **requires a process restart** to take effect. `Balsm.Supervisor.Services.CloudflareTunnelService` is the only tunnel implementation; `TunnelController` depends on it directly.
- **Decision**: (1) Introduce `ITunnelProvider` (`Start`, `Stop`, `GetStatus`, `GetUrl`) in `Balsm.Supervisor.Services`. Refactor `CloudflareTunnelService` to implement it. Add `NullTunnelProvider` for Standalone + Network. `TunnelController` depends on `ITunnelProvider`. (2) Accept the existing config-file-then-restart mechanism — but redesign the operator surface so the restart is invisible: after `SwitchModeAsync` writes the file, the host calls `IHostApplicationLifetime.StopApplication()`; the OS service manager (`systemd Restart=always` / `launchd KeepAlive=true` / `Windows Service Recovery`) brings the process back within ~5 seconds. The admin panel polls `/api/v1/health` and reloads on `ready=true`.
- **Conflict resolution**: spec FR-013 was patched to allow service-manager-driven in-process restart while explicitly forbidding any operator manual restart.
- **Alternatives rejected**: True in-process Kestrel reload via `IServer.StartAsync` cycling — fragile across platforms; over-scoped for foundation phase.

## R5. SQLite online backup + atomic restore

- **Current state**: Not implemented.
- **Decision**:
  - **Backup**: `Balsm.Infrastructure.Backup.SqliteOnlineBackupService` opens a source `SqliteConnection` against the live `balsm.db` and a destination `SqliteConnection` against `<backup-dir>/balsm-<yyyyMMdd-HHmmss>.db`, then calls `SqliteConnection.BackupDatabase(destination)`. Compute SHA-256 of the resulting file; write a `BackupFile` row via `BackupRepository`.
  - **Restore**: `RestoreOrchestrator` writes the chosen backup to `<install-dir>/balsm.db.restoring`, runs `PRAGMA integrity_check` and `PRAGMA foreign_key_check`. On both passing: (a) raise `ReadinessGate.SetNotReady(reason: "restore")` — `MigrationGateMiddleware` immediately starts returning 503 for non-health/non-server-info; (b) dispose all `IServiceScope`-cached EF Core DbContexts (use `IHostApplicationLifetime` + a `ScopedDbResetService` that recreates them); (c) `File.Replace(restoringPath, livePath, livePath + ".rollback")` — cross-platform atomic three-way swap; (d) reopen DbContexts; (e) clear `ReadinessGate`; (f) emit `RestoreCompleted` audit. On any failure swap back from `.rollback`, emit `RestoreFailed`, clear the gate.
- **Alternatives rejected**: raw `File.Copy` while running (forbidden by FR-011), `VACUUM INTO` (FR-011 explicitly mandates the online backup API).

## R6. Self-signed certificate fingerprint

- **Current state**: `Balsm.Supervisor.Security.CertificateService.EnsureCertificate(...)` exists.
- **Decision**: Add `CertificateService.GetFingerprint()` returning the SHA-256 of the loaded certificate's raw data, base64-url-encoded. Surface via `/api/v1/server-info` and the mDNS TXT record `cert_sha256`.
- **Alternatives rejected**: mkcert / external CA — already rejected by existing repo design.

## R7. Cron scheduler

- **Decision**: Add `NCrontab 3.3.3` to central pinning. Two `IHostedService` workers in `Balsm.Infrastructure.{Backup, Audit}`: `BackupScheduler` reads `server_config.backup_cron`, `AuditRetentionJob` reads `server_config.audit_retention_cron`. Each computes next-fire via `CrontabSchedule.GetNextOccurrence(DateTime.UtcNow)` and `Task.Delay`s to it. Both are registered in `AddSharedInfrastructure(...)`.
- **Alternatives rejected**: Quartz.NET, Hangfire — over-engineered for two jobs.

## R8. Admin UI accessibility + i18n

- **Current state**: `admin-ui/` has React 19 + Vite + 7 cards + 3 pages; no `i18n/` directory.
- **Decision**: Add `react-i18next` + `i18next` + `i18next-browser-languagedetector` to `admin-ui/package.json`. Resource bundles under `admin-ui/src/i18n/{en,ar}/common.json`. Add an `HtmlDirSync` component that flips `document.documentElement.dir` based on locale. Use CSS logical properties on all new pages. Target WCAG 2.1 AA. Persist the chosen locale per admin via the new `PATCH /api/v1/admin/users/me` endpoint.
- **Alternatives rejected**: LinguiJS / Format.JS — heavier for two locales.

## R9. macOS LaunchDaemon plists

- **Current state**: `packaging/macos/com.balsm.api.plist` and `packaging/macos/com.balsm.supervisor.plist` already exist; loaded by `packaging/macos/build-pkg.sh`. Installer is `.pkg` (not `.dmg`).
- **Decision**: Keep both plists. Audit each for `RunAtLoad = true`, `KeepAlive = true`, `Owner = root:wheel`, `Mode = 0644`, log paths under `/Library/Logs/Balsm/`. In Standalone foundation deployment only `com.balsm.api.plist` is loaded — the supervisor plist remains shipped for future split-process Network/Public deployments.
- **Conflict resolution**: spec FR-001 patched to `.pkg` (with `.dmg` distribution wrapper). Constitution §VIII deviation logged in Complexity Tracking.

## R10. SQLite concurrency PRAGMAs

- **Current state**: `BaseDbContext` does not set PRAGMAs; the connection string is whatever appears in `appsettings*.json:Database:ConnectionString`.
- **Decision**: Extend `Balsm.Infrastructure.Configuration.DatabaseServiceExtensions.ConfigureDatabase(...)` so that when `Provider == "sqlite"` it registers a `SqliteConnection.StateChange` handler that runs the PRAGMA set: `journal_mode = WAL`, `synchronous = NORMAL`, `busy_timeout = 5000`, `foreign_keys = ON`, `temp_store = MEMORY`, `mmap_size = 268435456`.
- **Rationale**: WAL is required for SC-006 (50 concurrent readers).

## R11. EF Core audit integration

- **Current state**: `BaseDbContext.SaveChangesAsync` already sets `CreatedAt` / `UpdatedAt` on `BaseEntity` and dispatches `AggregateRoot.DomainEvents` via `IDomainEventDispatcher`. Soft-delete is enforced via a global query filter on `IsDeleted`. **The new `CreatedBy` / `UpdatedBy` / `DeletedBy` columns on `BaseEntity` are not yet populated in code.**
- **Decision**: Extend `BaseDbContext.SaveChangesAsync` (or attach a new EF Core `SaveChangesInterceptor`) to read the ambient `AuditContext` (AsyncLocal populated by `AuditEnricherMiddleware`) and populate `CreatedBy` / `UpdatedBy` / `DeletedBy` / `DeletedAt` on every change. Also publish an `AuditLogRow` per change to the new `AuditLogWriter`. For authentication events that bypass EF (login success/failure, recovery use), `AdminAuthService` directly emits `LoginSucceededEvent` / `LoginFailedEvent` / `RecoveryUsedEvent` which the writer captures via `IDomainEventDispatcher`.
- **Rationale**: Centralises audit on the single chokepoint every domain write must pass.

## R12. Port defaults + endpoint namespace reconciliation

- **Current state**: `Balsm.API/Program.cs` defaults to HTTP `:5050` / HTTPS `:5051`. Public admin endpoints already live under `/api/v1/admin/*`; `AdminAuthMiddleware` whitelists `/api/v1/admin/auth/{setup,login,status}`. All other `/api/v1/admin/*` routes require a `balsm_admin_session` cookie.
- **Decision**: Adopt these defaults as canonical. Spec FR-003 already aligns. All new endpoints introduced by Phase 0 (Workspace, Entity, Branch, Backup, Restore, Audit, Recovery, Mode, ServerInfo) follow the existing path-prefix convention:
  - `/api/v1/health` — public (existing)
  - `/api/v1/server-info` — public (new)
  - `/api/v1/admin/auth/setup` — public, FR-004 first-run (existing route name; extended payload)
  - `/api/v1/admin/auth/login` — public, FR-017 login (existing)
  - `/api/v1/admin/auth/status` — public, session check (existing)
  - `/api/v1/admin/auth/recovery/use` — public, FR-018a (new; add to whitelist)
  - `/api/v1/admin/auth/recovery/regenerate` — cookie-auth (new)
  - `/api/v1/admin/workspace` — cookie-auth (new)
  - `/api/v1/admin/entities`, `/api/v1/admin/entities/{id}`, `/api/v1/admin/entities/{id}/branches`, `/api/v1/admin/entity-types` — cookie-auth (new)
  - `/api/v1/admin/branches/{id}`, `/api/v1/admin/branches/{id}/deactivate` — cookie-auth (new)
  - `/api/v1/admin/backups`, `/api/v1/admin/backups/schedule`, `/api/v1/admin/backups/{id}/restore` — cookie-auth (new)
  - `/api/v1/admin/audit/logs`, `/api/v1/admin/audit/retention`, `/api/v1/admin/audit/archives` — cookie-auth (new)
  - `/api/v1/admin/mode` — cookie-auth (extended; existing in `ControlController`)
  - `/api/v1/admin/status` — cookie-auth (existing in `StatusController`; payload extended)
- **Rationale**: Adopting the existing prefix means all new endpoints inherit `AdminAuthMiddleware` cookie auth for free; no JWT introduction at Phase 0.
- **Conflict resolution**: spec contract earlier proposed JWT bearer auth and a `/first-run/*` namespace; that was inconsistent with the live code. Updated.

## R13. CQRS pattern for new module work

- **Current state**: MediatR 14.1.0 + FluentValidation 12.1.1 already pinned; every module's `Application/DependencyInjection.cs` calls `RegisterServicesFromAssembly(AssemblyReference.Assembly)`. No Commands / Queries / Handlers exist yet.
- **Decision**: All new commands return `IRequest<Result>` or `IRequest<Result<TDto>>` using `Balsm.SharedKernel.Results`. Naming follows the existing repo convention from `CLAUDE.md`: `Create{Entity}Command`, `Update{Entity}Command`, `Deactivate{Entity}Command`, `Get{Entity}ByIdQuery`, `List{Entity}Query`. One FluentValidation `AbstractValidator<T>` per command/query.
- **Repository pattern**: implement `IWorkspaceRepository`, `IEntityRepository`, `IBranchRepository`, `IAdminUserMirrorRepository` deriving from `Balsm.SharedKernel.Repositories.IRepository<T>`; concrete classes inherit `Balsm.Infrastructure.Data.BaseRepository<T, TDbContext>` (existing).
- **Result mapping**: controllers convert `Result<T>` to HTTP via a single `IActionResult ToActionResult<T>(this Result<T> result)` extension (new) — 200 / 201 / 400 / 404 / 409 / 422 mapped from `Error.Code`.

## R14. Single-admin enforcement surface (FR-018)

- **Current state**: `AdminAuthService.SetupAsync` already throws `InvalidOperationException` if credentials exist. No DB-level mirror.
- **Decision**: Keep file-based AdminCredentials as the canonical secret store. Mirror non-secret fields (`Id Guid`, `Email`, `DisplayName`, `Role`, `Locale`, `LastLoginAt`, `PasswordChangedAt`) into `identity.AdminUserMirror` so the Identity module can join with the audit log and the Admin SPA's `/me` endpoint can return a single source of truth. Mirror write happens in `AdminAuthService.SetupAsync` / `ChangePasswordAsync` / `LoginAsync` via a new `IAdminUserMirrorRepository`. EF filtered unique index on `Email` where `IsDeleted = 0` enforces FR-018 at the DB level.

## R15. Recovery code generation + retirement

- **Decision**: `Balsm.Supervisor.Services.RecoveryCodeService` generates a 16-char Base32 code (`A-Z2-7`, no ambiguous chars) using `RandomNumberGenerator.GetBytes(10)` → Base32. Hashes with Argon2id; stores hash + created-at on `AdminCredentials`. Verification uses constant-time comparison. On consumption: sets `recoveryCodeUsedAt`, returns success. The next successful login triggers automatic regeneration of a fresh code surfaced via a one-time banner on the dashboard (FR-018a).

---

## Resolved planner-deferred items

- WCAG level — AA (R8).
- Tunnel vendor — Cloudflare first via `ITunnelProvider` (R4).
- macOS installer — `.pkg` (R9).
- Mode-switch semantics — service-manager auto-restart, no operator action (R4).
- Endpoint namespace + auth — cookie-based `/api/v1/admin/*` (R12).
- Domain ID type — `Guid` (matches existing `BaseEntity`).
- CQRS framework — MediatR + Result<T> (R13).

## Still deferred (low impact)

- Maximum branches-per-entity bound.
- Migration of admin credentials from the file store into SQLite — left for a later phase to avoid forcing a credential reformat now.

All NEEDS CLARIFICATION items from `plan.md` Technical Context are resolved.
