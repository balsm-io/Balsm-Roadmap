# Phase 1 Data Model: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

The data model is split across two stores that already exist in `Balsm-API-DotNet`:

1. **SQLite domain database** (`balsm.db`) accessed via per-module EF Core DbContexts (`EntityDbContext`, `IdentityDbContext`, plus the new schemas owned by `Balsm.Infrastructure.{Audit, Backup, Lifecycle, Operations}` — `Operations` (EF schema `ops`) holds local-server operational state and is deliberately not named "Platform", which canonically denotes the Platform *plane* per `architecture/bounded-contexts/README.md`). All domain aggregates derive from `Balsm.SharedKernel.Domain.AggregateRoot`, which itself derives from `BaseEntity`. `BaseEntity` (existing, do not edit unless noted) defines:
   - `Guid Id` (primary key, generated client-side by default)
   - `DateTime CreatedAt`, `string? CreatedBy`
   - `DateTime? UpdatedAt`, `string? UpdatedBy`
   - `bool IsDeleted`, `DateTime? DeletedAt`, `string? DeletedBy`
   `BaseDbContext.OnModelCreating` already applies a global query filter on `IsDeleted == false`, so soft-delete is free for every aggregate listed below. `BaseDbContext.SaveChangesAsync` sets `CreatedAt` / `UpdatedAt`; the new `AuditSaveChangesInterceptor` (Phase 0 work) sets `CreatedBy` / `UpdatedBy` / `DeletedBy` from the ambient `AuditContext`.

2. **File-backed admin credentials** (`Balsm.Supervisor.Auth.FileCredentialStore`) — already present. Phase 0 extends the on-disk JSON schema additively rather than migrating credentials into SQLite.

All EF Core column types follow EF's default mapping for the C# types listed; SQLite stores `Guid` as `TEXT`, `DateTime` as `TEXT` (ISO 8601), `bool` as `INTEGER`. Schemas listed are EF model schemas (`HasDefaultSchema(...)`) — SQLite ignores them, but they appear in PostgreSQL when that provider is selected.

---

## A. SQLite domain aggregates

### A.1 `entity.Workspace` *(FR-005)*

EF schema: `entity`. Lives in `Modules/Entity/Balsm.Entity.Domain/Workspace.cs` (new). Inherits `AggregateRoot`.

| Property         | C# type    | Notes |
|------------------|------------|-------|
| (inherited) Id   | `Guid`     | PK |
| Name             | `string`   | Display |
| Slug             | `string`   | `^[a-z0-9-]{3,40}$`; mDNS post-setup instance name |
| Status           | `WorkspaceStatus` enum | `Active`, `Suspended` |
| LocaleDefault    | `string`   | `en` or `ar` |
| (inherited audit fields) | | from `BaseEntity` |

Singleton invariant enforced at application layer (`CreateWorkspaceCommandHandler` checks `IWorkspaceRepository.AnyAsync()`). EF Core configuration adds a check constraint on a single immutable singleton tag value (`SingletonKey = "Workspace"` with unique index) so the DB cannot store two rows even if the app layer is bypassed.

Domain events: `WorkspaceUpdatedEvent`, `WorkspaceSlugChangedEvent`.

### A.2 `entity.EntityType` *(FR-006 extensibility)*

Inherits `BaseEntity` (not aggregate — value-type lookup).

| Property  | C# type | Notes |
|-----------|---------|-------|
| Id        | `Guid`  | from `BaseEntity` |
| Code      | `string`| UNIQUE, e.g. `pharmacy` |
| LabelEn   | `string`| |
| LabelAr   | `string`| |
| IsSeeded  | `bool`  | 1 for built-in |

Seeded rows on first migration: `pharmacy`, `clinic`, `hospital`.

### A.3 `entity.EntityRoot` *(FR-006)*

Named `EntityRoot` to avoid name collisions with `Microsoft.EntityFrameworkCore.Metadata.Entity*` types. Public API exposes it as `entity`. Inherits `AggregateRoot`.

| Property              | C# type | Notes |
|-----------------------|---------|-------|
| (inherited) Id        | `Guid`  | |
| WorkspaceId           | `Guid`  | FK → `Workspace.Id` |
| Name                  | `string`| |
| TypeCode              | `string`| FK → `EntityType.Code` |
| RegistrationNumber    | `string?`| Optional |

Index: `IX_EntityRoot_WorkspaceId_IsDeleted (WorkspaceId, IsDeleted)`.

Domain events: `EntityCreatedEvent`, `EntityUpdatedEvent`, `EntityDeactivatedEvent`, `EntityReactivatedEvent`.

### A.4 `entity.Branch` *(FR-007)*

Inherits `AggregateRoot`.

| Property        | C# type | Notes |
|-----------------|---------|-------|
| (inherited) Id  | `Guid`  | |
| EntityRootId    | `Guid`  | FK → `EntityRoot.Id` |
| Name            | `string`| |
| AddressLine     | `string?`| |
| City            | `string?`| |
| Governorate     | `string?`| Egypt-specific |
| Phone           | `string?`| Egyptian +20 validation in FluentValidation |

Index: `IX_Branch_EntityRootId_IsDeleted (EntityRootId, IsDeleted)`.

Domain events: `BranchCreatedEvent`, `BranchUpdatedEvent`, `BranchDeactivatedEvent`, `BranchReactivatedEvent`.

### A.5 `identity.AdminUserMirror` *(FR-018 enforcement + audit join)*

Non-secret projection of `FileCredentialStore` data. Lives in `Modules/Identity/Balsm.Identity.Domain/AdminUserMirror.cs` (new). Inherits `AggregateRoot`. **Stores no password material.**

| Property            | C# type | Notes |
|---------------------|---------|-------|
| (inherited) Id      | `Guid`  | |
| Email               | `string`| UNIQUE, lowercased on insert |
| DisplayName         | `string`| |
| Role                | `string`| Fixed `SystemAdmin` |
| Locale              | `string`| `en` or `ar` |
| LastLoginAt         | `DateTime?` | |
| PasswordChangedAt   | `DateTime`| Used for cross-session-revocation checks |

EF Core single-admin enforcement (FR-018): add a constant discriminator column `SingletonKey` (fixed value `"AdminUser"`) and a filtered unique index `IX_AdminUserMirror_Active_Single` on `SingletonKey` `HasFilter("\"IsDeleted\" = 0")` — this caps active rows at 1. (A filtered unique index on `Id` would be a no-op: `Id` is already the unique PK, so it constrains nothing and the DB would happily store N active mirrors — same pattern as the Workspace singleton in A.1.) `AdminAuthService.SetupAsync` writes both the credential file AND the mirror in the same logical transaction (no DB transaction crosses the two stores; the mirror is the dependent and is retried on next login if the prior attempt failed).

### A.6 `audit.AuditLog` *(FR-016 / FR-016a)*

Append-only. Inherits `BaseEntity` but the EF model is configured **not** to honor the soft-delete filter (`HasQueryFilter(null)` override) — the audit log shows every action, deleted or not. The retention job is the only code path allowed to `DELETE` rows; ordinary application code MUST NOT issue `UPDATE` or `DELETE` against this table.

| Property       | C# type   | Notes |
|----------------|-----------|-------|
| Id             | `Guid`    | PK (kept `Guid` for consistency with `BaseEntity`; monotonicity is provided by `OccurredAt` + `Sequence`) |
| Sequence       | `long`    | Monotonic auto-increment column (`HasAnnotation("Sqlite:Autoincrement", true)`) — used for ordering |
| OccurredAt     | `DateTime`| UTC |
| Actor          | `string`  | `admin:<guid>`, `system`, `cli:<command>` |
| SourceIp       | `string?` | NULL for `system` / `cli`. MUST be the real client IP (via `ForwardedHeadersMiddleware` trusting only the tunnel hop in Public mode), never the loopback proxy address — otherwise all remote actors record as loopback and FR-016 attribution is lost. |
| Module         | `string`  | `Entity`, `Branch`, `Identity`, `Backup`, `Audit`, `Lifecycle`, `Mode`, `Recovery`, `Auth` |
| Action         | `string`  | `Created`, `Updated`, `SoftDeleted`, `Reactivated`, `BackupTaken`, `RestoreStarted`, `RestoreCompleted`, `RestoreFailed`, `ModeChanged`, `RecoveryUsed`, `LoginFailed`, `LoginSucceeded`, `LockoutTripped`, `RecoveryCodeGenerated` |
| TargetType     | `string?` | `EntityRoot`, `Branch`, `Workspace`, `BackupFile`, etc. |
| TargetId       | `string?` | Guid or filename |
| DetailsJson    | `string?` | Structured payload (no PHI) |
| CorrelationId  | `string?` | From `CorrelationIdMiddleware` |

Indexes: `IX_AuditLog_OccurredAt_Sequence (OccurredAt DESC, Sequence DESC)`, `IX_AuditLog_Module_Action (Module, Action)`.

### A.7 `audit.AuditArchive` *(FR-016a JSONL export index)*

Inherits `BaseEntity`.

| Property        | C# type   |
|-----------------|-----------|
| Filename        | `string` UNIQUE |
| Path            | `string`  |
| RowsExported    | `int`     |
| EarliestRowAt   | `DateTime`|
| LatestRowAt     | `DateTime`|
| Sha256          | `string`  |

JSONL archives hold personal data (admin emails, source IPs) and are written to the `0700`/service-user-only backup directory. Disposal (PDPL storage-limitation): archives and their rows older than `audit_retention_years + 1` year are deleted by `AuditRetentionJob` (T133a) so exported data is not retained forever after leaving the live `AuditLog`.

### A.8 `backup.BackupFile` *(FR-011 / FR-011a / FR-011b)*

Inherits `BaseEntity`.

| Property      | C# type   | Notes |
|---------------|-----------|-------|
| Filename      | `string`  | UNIQUE |
| Path          | `string`  | absolute |
| SizeBytes     | `long`    | |
| Sha256        | `string`  | |
| Trigger       | `BackupTrigger` enum | `Manual`, `Scheduled`, `PreRestore` |
| Status        | `BackupStatus` enum  | `OK`, `Failed`, `Pruned` |

Index: `IX_BackupFile_CreatedAt (CreatedAt DESC)` for reverse-chronological listing (US4 AS#3).

At-rest protection: backup files are AES-256-GCM-encrypted with the `backupKeyBase64` credential-store key (§B) and written as `.db.enc` (no plaintext `.db` copy left on disk); `RestoreOrchestrator` decrypts before the integrity check. The backup directory is `0700`/service-user-only. A deployment that opts out of encryption MUST document full-disk-encryption as a prerequisite. There is no backup **download** endpoint — the API lists metadata only.

### A.9 `lifecycle.MigrationState` *(FR-010 / FR-010a)*

Inherits `BaseEntity`.

| Property         | C# type | Notes |
|------------------|---------|-------|
| MigrationName    | `string`| matches EF migration id |
| StartedAt        | `DateTime`| |
| CompletedAt      | `DateTime?`| NULL while in progress |
| FailedAt         | `DateTime?`| set on rollback path |
| SchemaChecksum   | `string?`| post-success |

Invariant: any row with `CompletedAt IS NULL AND FailedAt IS NULL` at startup is recovered before `ReadinessGate` flips to ready.

### A.10 `ops.ServerConfig` *(FR-011a, FR-013, FR-016a, FR-017, FR-019, FR-003)*

Inherits `BaseEntity`.

| Property    | C# type | Notes |
|-------------|---------|-------|
| Key         | `string`| UNIQUE |
| Value       | `string`| Stringified; per-key schema validated |

Seeded defaults:

| Key                       | Default        | Source |
|---------------------------|----------------|--------|
| `mode`                    | `Standalone`   | FR-013 |
| `bind_http_port`          | `5050`         | FR-003 |
| `bind_https_port`         | `5051`         | FR-003 |
| `backup_cron`             | `0 2 * * *`    | FR-011a |
| `backup_retention`        | `30`           | FR-011a |
| `backup_directory`        | `<install>/backups/` | FR-011 |
| `audit_retention_years`   | `2`            | FR-016a |
| `audit_retention_cron`    | `0 3 * * *`    | FR-016a |
| `session_idle_minutes`    | `30`           | FR-017 |
| `lockout_threshold_count` | `5`            | Constitution §II / R3 |
| `lockout_duration_minutes`| `15`           | Constitution §II / R3 |
| `locale_default`          | `en`           | FR-019 |
| `tunnel_provider`         | (empty)        | FR-013 R4 |

### A.11 `identity.LockoutRecord` *(FR-017 / R3 composite per-(email, IP))*

Sibling to the existing per-account `AdminCredentials.LockoutEnd`. Inherits `BaseEntity`. Lives in `Modules/Identity/Balsm.Identity.Domain/LockoutRecord.cs` and is mapped by `IdentityDbContext` — lockout is Identity & Access ubiquitous language (Constitution §II), so the Identity context owns this state, not shared infrastructure.

| Property              | C# type | Notes |
|-----------------------|---------|-------|
| AdminEmail            | `string`| Composite key part 1 |
| SourceIp              | `string`| Composite key part 2. MUST be the real client IP (see A.6) — in Public mode all internet traffic shares the loopback proxy address unless `ForwardedHeadersMiddleware` is configured, which would collapse per-(email,IP) lockout to per-email and enable a one-attacker lockout DoS against the real admin. |
| ConsecutiveFailures   | `int`   | reset on success |
| LockedUntil           | `DateTime?` | UTC; NULL when not locked |
| LastFailureAt         | `DateTime?` | |

Index: `UX_Lockout_Email_Ip (AdminEmail, SourceIp) UNIQUE`.

Retention (PDPL data-minimization): rows with `LastFailureAt` older than 30 days are pruned by `AuditRetentionJob` (T133a) — lockout state is transient and MUST NOT accumulate personal data (email + IP) indefinitely.

---

## B. File-store schema (`AdminCredentials` JSON)

Path: managed by `Balsm.Supervisor.Configuration.SupervisorOptions.CredentialStorePath`. Existing field shape unchanged; **six new fields added additively**. The file holds the password hash, salt, recovery-code hash, and backup key, so it MUST be written atomically (temp + rename) with mode `0600` service-user ownership on Unix / a SYSTEM+Administrators-only ACL on Windows; the mode/ACL is verified (and re-tightened) at startup (T043a).

```jsonc
{
  "username": "admin@example.com",
  "passwordHash": "<base64>",
  "salt": "<base64>",
  "passwordHashAlgorithm": "argon2id",    // NEW — defaults to "pbkdf2" on missing read
  "createdAt": "2026-05-30T10:00:00Z",
  "lastPasswordChange": "2026-05-30T10:00:00Z",
  "failedLoginAttempts": 0,
  "lockoutEnd": null,
  "recoveryCodeHash": "<argon2id-encoded>",       // NEW
  "recoveryCodeCreatedAt": "2026-05-30T10:00:00Z",// NEW
  "recoveryCodeUsedAt": null,                     // NEW
  "recoveryCodeRetiredAt": null,                  // NEW
  "backupKeyBase64": "<base64 32-byte AES-256 key>" // NEW — encrypts backups at rest (A.8); generated on first run
}
```

Backwards-compat rules:
- Missing `passwordHashAlgorithm` → treat as `pbkdf2`; trigger lazy migration on next successful login (R2).
- Missing recovery-code fields → admin prompted to generate a code on next login (audit-logged `RecoveryCodeGenerated`).
- Missing `backupKeyBase64` → generate a fresh 32-byte CSPRNG key on next backup and persist it; pre-existing plaintext backups stay readable (they were never encrypted) and are re-encrypted on the next scheduled run.

---

## C. Relationships summary

```text
workspace (1) ──< entity_root (N) ──< branch (N)
workspace (1) ──< ops.server_config (key→value)
identity.admin_user_mirror (1) ──< audit.audit_log (N, joined on actor = "admin:<id>")
backup.backup_file (N)               (rows index disk files)
audit.audit_log (N)  ──exported-to──> audit.audit_archive (N JSONL files)
lifecycle.migration_state (N)        (history; recovery checked at startup)
identity.lockout_record (N per (email, ip))

(file store)
admin_credentials.json (1) ── canonical admin password + recovery-code material
```

---

## D. Validation cross-reference

| Rule | Source | Implementation location |
|------|--------|------------------------|
| Workspace singleton | FR-005 | `CreateWorkspaceCommandHandler` + DB check |
| Soft-delete only on domain tables | FR-015 | `BaseDbContext` global query filter (existing) |
| Audit on every write / auth state change | FR-016 | `AuditSaveChangesInterceptor` + `AdminAuthService` domain events |
| Audit retention 2 years configurable | FR-016a | `AuditRetentionJob` reads `ops.server_config.audit_retention_years` |
| Single admin | FR-018 | App-layer + filtered unique index on `AdminUserMirror` |
| Argon2id password hash | FR-017 / R2 | `Argon2idHasher` + lazy migration |
| 5-failure / 15-min lockout | FR-017 / Constitution §II / R3 | `AdminAuthService` (per-account, existing) + `RateLimitMiddleware` (per-(email,IP), new) |
| Recovery code one-time use | FR-018a | `RecoveryCodeService` + file-store fields |
| Backup SHA-256 | FR-011 | `SqliteOnlineBackupService` |
| Restore atomic swap | FR-011b / R5 | `RestoreOrchestrator` |
| Migration crash recovery | FR-010a | `MigrationRecoveryService` |
| Pre-setup mDNS instance name | FR-008 | `MdnsService` extension |

No PHI is stored. Phase 0 personal data (admin email, entity contact details) is exportable via `AuditRetentionJob`'s JSONL pipeline and the planned PDPL DSR endpoint.
