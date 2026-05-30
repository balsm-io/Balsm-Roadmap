# Phase 1 Data Model: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

The data model is split across two stores that already exist in `Balsm-API-DotNet`:

1. **SQLite domain database** (`balsm.db`) accessed via per-module EF Core DbContexts (`EntityDbContext`, `IdentityDbContext`, plus the new schemas owned by `Balsm.Infrastructure.{Audit, Backup, Lifecycle}`). All domain aggregates derive from `Balsm.SharedKernel.Domain.AggregateRoot`, which itself derives from `BaseEntity`. `BaseEntity` (existing, do not edit unless noted) defines:
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

EF Core filtered unique index: `IX_AdminUserMirror_Active_Single` on `Id` `HasFilter("\"IsDeleted\" = 0")` — caps active rows at 1 (FR-018). `AdminAuthService.SetupAsync` writes both the credential file AND the mirror in the same logical transaction (no DB transaction crosses the two stores; the mirror is the dependent and is retried on next login if the prior attempt failed).

### A.6 `audit.AuditLog` *(FR-016 / FR-016a)*

Append-only. Inherits `BaseEntity` but the EF model is configured **not** to honor the soft-delete filter (`HasQueryFilter(null)` override) — the audit log shows every action, deleted or not. The retention job is the only code path allowed to `DELETE` rows; ordinary application code MUST NOT issue `UPDATE` or `DELETE` against this table.

| Property       | C# type   | Notes |
|----------------|-----------|-------|
| Id             | `Guid`    | PK (kept `Guid` for consistency with `BaseEntity`; monotonicity is provided by `OccurredAt` + `Sequence`) |
| Sequence       | `long`    | Monotonic auto-increment column (`HasAnnotation("Sqlite:Autoincrement", true)`) — used for ordering |
| OccurredAt     | `DateTime`| UTC |
| Actor          | `string`  | `admin:<guid>`, `system`, `cli:<command>` |
| SourceIp       | `string?` | NULL for `system` / `cli` |
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

### A.10 `platform.ServerConfig` *(FR-011a, FR-013, FR-016a, FR-017, FR-019, FR-003)*

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

### A.11 `platform.LockoutRecord` *(FR-017 / R3 composite per-(email, IP))*

Sibling to the existing per-account `AdminCredentials.LockoutEnd`. Inherits `BaseEntity`.

| Property              | C# type | Notes |
|-----------------------|---------|-------|
| AdminEmail            | `string`| Composite key part 1 |
| SourceIp              | `string`| Composite key part 2 |
| ConsecutiveFailures   | `int`   | reset on success |
| LockedUntil           | `DateTime?` | UTC; NULL when not locked |
| LastFailureAt         | `DateTime?` | |

Index: `UX_Lockout_Email_Ip (AdminEmail, SourceIp) UNIQUE`.

---

## B. File-store schema (`AdminCredentials` JSON)

Path: managed by `Balsm.Supervisor.Configuration.SupervisorOptions.CredentialStorePath`. Existing field shape unchanged; **five new fields added additively**.

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
  "recoveryCodeRetiredAt": null                   // NEW
}
```

Backwards-compat rules:
- Missing `passwordHashAlgorithm` → treat as `pbkdf2`; trigger lazy migration on next successful login (R2).
- Missing recovery-code fields → admin prompted to generate a code on next login (audit-logged `RecoveryCodeGenerated`).

---

## C. Relationships summary

```text
workspace (1) ──< entity_root (N) ──< branch (N)
workspace (1) ──< platform.server_config (key→value)
identity.admin_user_mirror (1) ──< audit.audit_log (N, joined on actor = "admin:<id>")
backup.backup_file (N)               (rows index disk files)
audit.audit_log (N)  ──exported-to──> audit.audit_archive (N JSONL files)
lifecycle.migration_state (N)        (history; recovery checked at startup)
platform.lockout_record (N per (email, ip))

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
| Audit retention 2 years configurable | FR-016a | `AuditRetentionJob` reads `platform.server_config.audit_retention_years` |
| Single admin | FR-018 | App-layer + filtered unique index on `AdminUserMirror` |
| Argon2id password hash | FR-017 / R2 | `Argon2idHasher` + lazy migration |
| 5-failure / 15-min lockout | FR-017 / Constitution §II / R3 | `AdminAuthService` (per-account, existing) + `RateLimitMiddleware` (per-(email,IP), new) |
| Recovery code one-time use | FR-018a | `RecoveryCodeService` + file-store fields |
| Backup SHA-256 | FR-011 | `SqliteOnlineBackupService` |
| Restore atomic swap | FR-011b / R5 | `RestoreOrchestrator` |
| Migration crash recovery | FR-010a | `MigrationRecoveryService` |
| Pre-setup mDNS instance name | FR-008 | `MdnsService` extension |

No PHI is stored. Phase 0 personal data (admin email, entity contact details) is exportable via `AuditRetentionJob`'s JSONL pipeline and the planned PDPL DSR endpoint.
