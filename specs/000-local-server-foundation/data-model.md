# Phase 1 Data Model: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

Storage: SQLite (`balsm.db`) with WAL journal. Snake_case columns at the DB layer; PascalCase types at the C# layer. Every entity that represents a domain object includes a soft-delete column (`is_active` + `deactivated_at`). Hard `DELETE` is forbidden in application code except inside `AuditRetentionJob` (FR-016a) operating on `audit_log` rows that have already been exported to JSONL archive.

All timestamps are stored as UTC `TEXT` in ISO 8601 (`YYYY-MM-DDTHH:MM:SS.fffZ`) per Constitution §IX-adjacent standards.

---

## 1. Workspace *(FR-005)*

Single-row entity (enforced via a singleton invariant in the application layer plus a `UNIQUE` constraint on `id = 1`).

| Column         | Type    | Nullable | Notes |
|----------------|---------|----------|-------|
| id             | INTEGER | NO       | PK, hard-coded `1` |
| name           | TEXT    | NO       | Display name |
| slug           | TEXT    | NO       | Lowercase, used in mDNS instance name |
| created_at     | TEXT    | NO       | UTC |
| status         | TEXT    | NO       | Enum: `Active`, `Suspended` |
| locale_default | TEXT    | NO       | `en` or `ar` (FR-019) |

Invariants:
- Attempting to insert a row with `id != 1` MUST be rejected at application layer (FR-005).
- Slug MUST match `^[a-z0-9-]{3,40}$`.

State transitions: `Active ⇄ Suspended` (Suspended is reserved; no UI surface in Phase 0).

---

## 2. Entity *(FR-006)*

| Column              | Type    | Nullable | Notes |
|---------------------|---------|----------|-------|
| id                  | INTEGER | NO       | PK, identity |
| workspace_id        | INTEGER | NO       | FK → workspace.id (always `1`) |
| name                | TEXT    | NO       | |
| type                | TEXT    | NO       | FK → entity_type.code (extensible — see §3) |
| registration_number | TEXT    | YES      | Optional, free text |
| is_active           | INTEGER | NO       | 1 = active, 0 = soft-deleted |
| deactivated_at      | TEXT    | YES      | UTC; populated when `is_active` flips to 0 |
| created_at          | TEXT    | NO       | UTC |
| updated_at          | TEXT    | NO       | UTC |

Indexes: `idx_entity_workspace_active(workspace_id, is_active)`.

State transitions: `Active → Inactive (soft-delete) → Active (reactivate)`. Hard delete forbidden.

---

## 3. EntityType *(supports FR-006 extensibility)*

Seed table — admin-extensible without schema migration.

| Column      | Type    | Nullable | Notes |
|-------------|---------|----------|-------|
| code        | TEXT    | NO       | PK, e.g. `pharmacy`, `clinic`, `hospital` |
| label_en    | TEXT    | NO       | |
| label_ar    | TEXT    | NO       | |
| is_seeded   | INTEGER | NO       | 1 for built-in, 0 for admin-added |

Seeded rows: `pharmacy`, `clinic`, `hospital`.

---

## 4. Branch *(FR-007)*

| Column         | Type    | Nullable | Notes |
|----------------|---------|----------|-------|
| id             | INTEGER | NO       | PK |
| entity_id      | INTEGER | NO       | FK → entity.id |
| name           | TEXT    | NO       | |
| address_line   | TEXT    | YES      | |
| city           | TEXT    | YES      | |
| governorate    | TEXT    | YES      | Egypt-specific free text |
| phone          | TEXT    | YES      | Egyptian +20 format validation in API layer (Constitution §VIII) |
| is_active      | INTEGER | NO       | |
| deactivated_at | TEXT    | YES      | |
| created_at     | TEXT    | NO       | |
| updated_at     | TEXT    | NO       | |

Indexes: `idx_branch_entity_active(entity_id, is_active)`.

State transitions: same as Entity (Active ⇄ Soft-deleted).

---

## 5. AdminUser *(FR-018)*

Singleton enforced (Phase 0 only).

| Column              | Type    | Nullable | Notes |
|---------------------|---------|----------|-------|
| id                  | INTEGER | NO       | PK, identity |
| email               | TEXT    | NO       | UNIQUE, lowercased on insert |
| password_hash       | TEXT    | NO       | Argon2id encoded string (parameters embedded — R2) |
| display_name        | TEXT    | NO       | |
| role                | TEXT    | NO       | Fixed `SystemAdmin` at Phase 0 |
| locale              | TEXT    | NO       | `en` or `ar` |
| created_at          | TEXT    | NO       | |
| last_login_at       | TEXT    | YES      | |
| password_changed_at | TEXT    | NO       | Used for session-invalidation cross-check |

Invariants:
- Maximum one row at any time (FR-018). API rejects `POST /admin-users` with HTTP 409 once one exists.

---

## 6. RecoveryCode *(FR-018a)*

| Column        | Type    | Nullable | Notes |
|---------------|---------|----------|-------|
| id            | INTEGER | NO       | PK |
| admin_user_id | INTEGER | NO       | FK → admin_user.id |
| code_hash     | TEXT    | NO       | Argon2id hash of the raw recovery code |
| created_at    | TEXT    | NO       | |
| used_at       | TEXT    | YES      | Set when the code is consumed; row becomes inert |
| retired_at    | TEXT    | YES      | Set when a fresh code is generated after consumption |

Invariants:
- Only one row per admin_user where `used_at IS NULL AND retired_at IS NULL` (the "active" recovery code).
- Verification path uses constant-time comparison against `code_hash`.

State transitions: `Active → Used → Retired`. New `Active` row created on next admin login after a `Used` event.

---

## 7. ServerConfig *(FR-013, FR-011a, FR-016a, FR-017, FR-019)*

Singleton key-value table. One row per config key for atomic per-key updates.

| Column       | Type    | Nullable | Notes |
|--------------|---------|----------|-------|
| key          | TEXT    | NO       | PK, e.g. `mode`, `backup_cron`, `backup_retention`, `audit_retention_years`, `session_idle_minutes`, `bind_port`, `locale_default` |
| value        | TEXT    | NO       | Stringified; schema-validated per key in application layer |
| updated_at   | TEXT    | NO       | |
| updated_by   | TEXT    | NO       | Admin id or `system` |

Seeded keys + defaults:

| key                       | default        | source |
|---------------------------|----------------|--------|
| mode                      | `Standalone`   | FR-013 |
| bind_port                 | `8443`         | FR-003 |
| backup_cron               | `0 2 * * *`    | FR-011a |
| backup_retention          | `30`           | FR-011a |
| audit_retention_years     | `2`            | FR-016a |
| session_idle_minutes      | `30`           | FR-017 |
| lockout_threshold_count   | `5`            | FR-017 + R3 |
| lockout_duration_minutes  | `15`           | R3 |
| locale_default            | `en`           | FR-019 |

---

## 8. AuditLog *(FR-016 / FR-016a)*

Append-only. Application code MUST NOT issue `UPDATE` or `DELETE` against this table except inside `AuditRetentionJob`.

| Column         | Type    | Nullable | Notes |
|----------------|---------|----------|-------|
| id             | INTEGER | NO       | PK, identity (monotonic) |
| occurred_at    | TEXT    | NO       | UTC ISO 8601 |
| actor          | TEXT    | NO       | `admin:<id>`, `system`, or `cli:<command>` |
| source_ip      | TEXT    | YES      | NULL for `system` and `cli` |
| module         | TEXT    | NO       | `Identity`, `Entity`, `Branch`, `Backup`, `AuditLog`, `Lifecycle`, `Mode`, `Recovery` |
| action         | TEXT    | NO       | Verb, e.g. `Created`, `Updated`, `Deactivated`, `Restored`, `ModeChanged`, `BackupTaken`, `RecoveryUsed`, `LoginFailed` |
| target_type    | TEXT    | YES      | `Entity`, `Branch`, `AdminUser`, `Backup`, etc. |
| target_id      | TEXT    | YES      | Stringified id |
| details_json   | TEXT    | YES      | Structured payload (no PHI; see Constitution §II) |

Indexes: `idx_audit_occurred(occurred_at)`, `idx_audit_module_action(module, action)`.

---

## 9. BackupFile *(FR-011 / FR-011a / FR-011b)*

Metadata table. Files live on disk under the configured backup directory; this table provides the admin-panel listing and the retention-pruner's index.

| Column         | Type    | Nullable | Notes |
|----------------|---------|----------|-------|
| id             | INTEGER | NO       | PK |
| filename       | TEXT    | NO       | UNIQUE, e.g. `balsm-20260530-020003.db` |
| path           | TEXT    | NO       | Absolute |
| size_bytes     | INTEGER | NO       | |
| sha256         | TEXT    | NO       | Computed at write time for restore-time verification |
| created_at     | TEXT    | NO       | |
| trigger        | TEXT    | NO       | `Manual`, `Scheduled`, `PreRestore` |
| status         | TEXT    | NO       | `OK`, `Failed`, `Pruned` |

Indexes: `idx_backup_created(created_at DESC)` for reverse-chronological listing (US4 AS#3).

State transitions: `OK → Pruned (file deleted; row retained for audit)`, `Failed (no file on disk; row retained)`.

---

## 10. MigrationState *(FR-010 / FR-010a)*

| Column          | Type    | Nullable | Notes |
|-----------------|---------|----------|-------|
| id              | INTEGER | NO       | PK |
| migration_name  | TEXT    | NO       | Matches EF Core migration id |
| started_at      | TEXT    | NO       | |
| completed_at    | TEXT    | YES      | NULL while in progress; NULL + `failed_at NOT NULL` after crash |
| failed_at       | TEXT    | YES      | Set on rollback path |
| schema_checksum | TEXT    | YES      | Computed post-success; used by FR-010a recovery to detect partial state |

Invariants:
- Any row with `completed_at IS NULL AND failed_at IS NULL` at startup MUST be treated as an interrupted migration and recovered per FR-010a before the API starts serving.

---

## 11. LockoutRecord *(FR-017 / R3)*

| Column              | Type    | Nullable | Notes |
|---------------------|---------|----------|-------|
| id                  | INTEGER | NO       | PK |
| admin_email         | TEXT    | NO       | Composite key part 1 |
| source_ip           | TEXT    | NO       | Composite key part 2 |
| consecutive_failures| INTEGER | NO       | Reset to 0 on success |
| locked_until        | TEXT    | YES      | UTC; NULL when not locked |
| last_failure_at     | TEXT    | YES      | |

Indexes: `unique_lockout_key(admin_email, source_ip)`.

---

## 12. AuditArchive *(FR-016a)*

Lightweight pointer to JSONL archive files produced by the retention job. Files live on disk; this table indexes them for admin-panel surfacing and PDPL export.

| Column           | Type    | Nullable | Notes |
|------------------|---------|----------|-------|
| id               | INTEGER | NO       | PK |
| filename         | TEXT    | NO       | UNIQUE, e.g. `audit-202403.jsonl` |
| path             | TEXT    | NO       | Absolute |
| rows_exported    | INTEGER | NO       | Count from the prune batch |
| earliest_row_at  | TEXT    | NO       | Earliest `occurred_at` in archive |
| latest_row_at    | TEXT    | NO       | Latest `occurred_at` in archive |
| sha256           | TEXT    | NO       | |
| created_at       | TEXT    | NO       | Archive write time |

---

## Relationships Summary

```text
workspace (1) ──< entity (1) ──< branch (N)
workspace (1) ──< server_config (key→value)
admin_user (1) ──< recovery_code (1 active + N retired)
admin_user (1) ──< lockout_record (per source IP)
audit_log (N)   ─── exported-to ───> audit_archive (N JSONL files)
backup_file (N) (filesystem-backed; metadata only in DB)
migration_state (N) (history)
```

---

## Validation Rules Cross-Reference

| Rule | Source | Location |
|------|--------|----------|
| Workspace singleton | FR-005 | Application-layer guard + DB CHECK on PK |
| Soft-delete only on domain tables | FR-015 | Repository base class; EF interceptor |
| Audit on every write / auth-state-change | FR-016 | `AuditEnricher` middleware + domain-event handler |
| Audit retention 2 years configurable | FR-016a | `AuditRetentionJob` reads `server_config.audit_retention_years` |
| Single admin | FR-018 | Application-layer guard on Identity command handler |
| Argon2id password hash | FR-017 / R2 | `Argon2PasswordHasher` |
| 5-failure / 15-min lockout | FR-017 / Constitution §II / R3 | `LockoutTracker` |
| Recovery-code one-time-use | FR-018a | `RecoveryCodeService` |
| Backup file SHA-256 fingerprint | FR-011 | `SqliteOnlineBackupService` |
| Restore atomic swap | FR-011b / R5 | `RestoreOrchestrator` |
| Migration crash recovery | FR-010a | `MigrationRecoveryService` |

All entities listed satisfy the Key Entities section of the spec; no PHI is stored.
