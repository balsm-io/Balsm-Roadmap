# Feature Specification: Local Server Foundation (Phase 0)

**Feature Branch**: `000-local-server-foundation`  
**Created**: 2026-05-29  
**Status**: Draft  
**Phase**: P000 — Foundation Gate (blocks all .NET phases P001–P021)

---

## Clarifications

### Session 2026-05-30

- Q: Admin password recovery path when single admin is locked out? → A: CLI `balsm admin reset-password` as primary recovery + one-time offline recovery code generated during first-run wizard as secondary fallback.
- Q: Automated backup schedule and retention policy? → A: Configurable interval (default daily at 02:00 local) and configurable retention count (default 30); both admin-editable from admin panel.
- Q: Database restore behavior and surface? → A: Restore available from both admin panel and CLI; during restore the server refuses all non-health API requests (per FR-010 pattern) and automatically restarts on completion.
- Q: Audit log retention and storage? → A: Append-only SQLite table with configurable retention (default 2 years); on prune, expired rows MUST be auto-exported to a dated JSONL archive in the backup directory before deletion.
- Q: Backup file destination? → A: Local filesystem path only (configurable). Remote replication / cloud sync is out of scope for Phase 0 and remains an OS-level admin responsibility.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First-Run Server Installation & Setup (Priority: P1)

A pharmacy IT admin (or technically capable owner) installs the Balsm server on their
Windows, macOS, or Linux machine. After running the installer, a guided first-run wizard
in the admin panel walks them through creating an admin account and confirming the workspace
name. When they finish, the server is live, HTTPS is active, and the admin panel is reachable.

**Why this priority**: Nothing else works without a running server. This is the literal starting
point for every downstream pharmacy workflow.

**Independent Test**: Install the package on a fresh OS, open a browser to the local admin URL,
complete the first-run wizard, and confirm the dashboard loads with no errors.

**Acceptance Scenarios**:

1. **Given** a clean Windows/macOS/Linux machine with no Balsm software, **When** the user runs
   the OS-native installer package, **Then** the server process starts automatically, is registered
   as a system service (auto-start on boot), and the admin panel URL is displayed in the installer
   completion dialog AND surfaced via the OS system tray / menu bar icon (and `balsm status` CLI).

2. **Given** the server is freshly installed, **When** the admin visits the admin panel for the
   first time, **Then** a first-run setup wizard is presented requiring admin account creation and
   workspace name confirmation before any other screen is accessible; on completion the wizard
   MUST display a one-time recovery code (per FR-018a) with explicit instructions to store it
   offline before the admin can leave the wizard.

3. **Given** the first-run wizard has been completed, **When** the admin logs into the admin panel,
   **Then** the dashboard shows server status (running / uptime / version), the workspace name, and
   navigation to all management areas.

4. **Given** the server is already running, **When** the OS restarts, **Then** the server resumes
   automatically without any manual intervention.

---

### User Story 2 — Workspace, Entity & Branch Management (Priority: P2)

The admin uses the admin panel to configure the pharmacy's organisational structure: the workspace
(one per server), its main entity (the pharmacy), and any branches (physical locations). Staff
applications use this structure to know which pharmacy and branch they are working in.

**Why this priority**: The workspace/entity/branch hierarchy is the organisational foundation that
all later modules (Inventory, POS, Prescriptions) anchor their data to.

**Independent Test**: Through the admin panel, create a workspace, add an entity with two branches,
edit one branch's address, then deactivate the other branch. Verify the changes persist across a
server restart.

**Acceptance Scenarios**:

1. **Given** a configured server, **When** the admin attempts to create a second workspace,
   **Then** the system rejects the request and explains that only one workspace is allowed per
   server installation.

2. **Given** the single workspace exists, **When** the admin creates an entity with a name, type
   (pharmacy / clinic / hospital), and at least one branch, **Then** the entity and branch appear
   in the entity list with all provided details.

3. **Given** an entity with branches exists, **When** the admin deactivates a branch, **Then** the
   branch is marked inactive and no longer appears in active selections, but its history is preserved
   (soft-delete, not hard-delete).

4. **Given** entity data exists, **When** the admin edits an entity's name or branch details,
   **Then** changes are saved immediately and reflected everywhere the entity is displayed.

---

### User Story 3 — Local Network Discovery (Priority: P3)

A pharmacist on the same local network opens a client application (mobile or desktop). The app
automatically finds the Balsm server without the pharmacist having to type any IP address or
hostname. The app shows the discovered server and lets the pharmacist connect with one tap.

**Why this priority**: Manual IP configuration is a support burden and adoption blocker for
non-technical pharmacy staff.

**Independent Test**: Connect a second device to the same LAN, open a client application (or
a browser using the mDNS hostname), and confirm the server is reachable by name without manually
entering the server's IP.

**Acceptance Scenarios**:

1. **Given** the server is running in Network or Public mode, **When** a client device on the same
   LAN scans for Balsm servers, **Then** the server appears by name (mDNS) within 5 seconds.

2. **Given** the server is running in Standalone mode (localhost-only), **When** a remote device
   attempts mDNS discovery, **Then** the server is NOT discoverable from outside the local machine.

3. **Given** the server hostname changes (e.g., device rename), **When** discovery is performed,
   **Then** the updated hostname is broadcast and clients find the server under the new name.

---

### User Story 4 — Database Backup & Recovery (Priority: P4)

The admin triggers a database backup from the admin panel or CLI. A backup file is saved to a
known local folder. If the database is ever lost or corrupted, the admin can restore from that
backup file and the server returns to the last backed-up state.

**Why this priority**: Data safety is non-negotiable — a pharmacy losing its records is a clinical
and regulatory risk.

**Independent Test**: Trigger a backup via admin panel, locate the backup file, delete the live
database, run the restore command, restart the server, and confirm all prior data is intact.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** the admin clicks "Backup Now" in the admin panel or
   runs the CLI backup command, **Then** a timestamped backup file is created in the designated
   backup directory within 30 seconds.

2. **Given** a backup file exists and the database is empty or corrupt, **When** the admin runs the
   restore command (CLI) or selects the backup in the admin panel and confirms, **Then** the server
   refuses non-health requests during restore, all data from the backup is restored, and the server
   automatically resumes full operation without an OS-level service restart.

3. **Given** multiple backup files exist, **When** the admin views the backup list, **Then** files
   are listed in reverse chronological order with file size and creation timestamp.

---

### Edge Cases

- What happens if the server port is already in use on first launch?
  → Server MUST report the conflict clearly and suggest an alternative port; it MUST NOT silently
  fail or crash.
- What happens when the database file is locked by another process during backup?
  → Backup operation MUST use SQLite's online backup API (no file copy while locked); it MUST
  complete successfully or fail with a clear user-facing error.
- What happens if mDNS is blocked by a firewall on the host machine?
  → Server continues to operate; mDNS failure is logged as a warning, not a fatal error.
- What happens if the server is force-killed during a migration?
  → On next start, the server MUST detect incomplete migrations and re-run or roll back cleanly;
  it MUST NOT serve requests until the database is in a consistent state.
- What happens when two Balsm servers are on the same LAN?
  → Each broadcasts its own mDNS service with a unique instance name derived from workspace name +
  server ID; clients discover both and present them as separate choices.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST install as a self-contained package on Windows (`.msi`), macOS (`.pkg`,
  packaged from a `.dmg` distribution image), and Linux (`.deb`) without requiring any separate
  runtime installation by the user. Packages MUST integrate with the host service manager (see
  FR-002); installer formats that cannot register a system service are out of scope for this phase.

- **FR-002**: Server process MUST register as a system service (Windows Service on Windows,
  `launchd` LaunchDaemon on macOS, `systemd` unit on Linux) and auto-start on OS boot without
  user intervention.

- **FR-003**: Admin panel MUST be served at a well-known local URL on a configurable port.
  Default binding is HTTP `:5050` and HTTPS `:5051` (matching the existing
  `Balsm-API-DotNet` Kestrel configuration), with the admin panel exposed at
  `https://localhost:5051/admin` using a locally-issued self-signed certificate after
  installation. Server MUST NOT bind to privileged ports (<1024) by default.

- **FR-004**: On first launch (no admin account present), the server MUST redirect all admin panel
  UI requests to a first-run wizard; the wizard MUST be the only accessible UI until completed.
  Operational endpoints `GET /api/v1/health` and `GET /api/v1/server-info` (FR-009) MUST remain
  accessible during the pre-setup state to allow monitoring and installer verification.

- **FR-005**: System MUST enforce a hard limit of one workspace per server installation; attempts
  to create a second workspace MUST be rejected with an explanatory error.

- **FR-006**: Workspace MUST expose full CRUD operations for entities of a configurable type
  (initial seeded values: pharmacy, clinic, hospital; the type list MUST be extensible without
  schema changes), including soft-delete (deactivation); hard deletion is forbidden.

- **FR-007**: Each entity MUST support one or more branches with name, address, phone, and
  active/inactive status; branches MUST also support soft-delete only.

- **FR-008**: Server MUST broadcast its presence via mDNS on the local network when operating in
  Network or Public mode; the broadcast MUST be observable by a same-LAN client within 5 seconds
  of the server reaching ready state. mDNS MUST be suppressed in Standalone mode.

- **FR-009**: Server MUST expose `GET /api/v1/health` and `GET /api/v1/server-info` endpoints
  returning the server's version, uptime, workspace name, operating mode, and TLS certificate
  fingerprint.

- **FR-010**: Server MUST apply all pending database schema migrations automatically on startup;
  `EnsureCreated` MUST NOT be used in any production code path. Server MUST refuse to accept
  any non-health API requests while migrations are pending, in progress, or in a failed state.

- **FR-010a**: If the server is terminated mid-migration, on next start it MUST detect the
  incomplete migration via a transaction journal or migration-state table, attempt to resume or
  roll back to the last consistent schema version, and MUST NOT serve non-health requests until
  the database reaches a known-good state.

- **FR-011**: Admin MUST be able to trigger a full database backup via the admin panel and via a
  CLI command using SQLite's online backup API (never a raw file copy of a live database);
  backup MUST complete within 30 seconds for databases up to 1 GB on minimum-spec hardware.
  Backup files MUST be written to a configurable local filesystem directory (default
  `<install-dir>/backups/`). Remote replication, cloud storage targets, and off-site sync are
  out of scope for Phase 0; admins MAY use OS-level tooling (rsync, file-sync agents) against
  the backup directory.

- **FR-011a** (scheduled backups + retention): Server MUST run an automatic full backup on a
  configurable interval, defaulting to daily at 02:00 server-local time. Both the schedule
  (cron-style expression or simple interval selector) and the retention count MUST be editable
  from the admin panel. Retention defaults to the most recent 30 successful backup files; older
  files MUST be deleted automatically after a new successful backup brings the count above the
  configured retention. A scheduled backup failure (disk full, permission error, etc.) MUST be
  surfaced in the admin dashboard, written to the audit log (FR-016), and MUST NOT cause
  retention pruning to delete the most recent known-good backup.

- **FR-011b** (restore): Admin MUST be able to restore from a backup file via both the admin panel
  (selecting a file from the backup list) and the CLI (`balsm db restore <path>`). Both surfaces
  MUST require an explicit confirmation step. While a restore is in progress the server MUST
  refuse all non-health/non-server-info requests with HTTP 503, mirroring the migration-pending
  behavior in FR-010. On successful completion the server MUST restart its application-level
  state automatically (no OS-level service restart required) and emit an audit log entry
  (FR-016) including the backup file fingerprint and the admin actor. A failed restore MUST
  leave the previous database untouched (atomic swap) and surface the failure on the dashboard.

- **FR-012**: Server MUST start and be ready to accept connections within 10 seconds on a machine
  meeting minimum hardware specifications.

- **FR-013**: Server MUST support three operating modes — Standalone (localhost-only), Network
  (LAN-accessible), and Public (internet-exposed via an outbound reverse tunnel provider; specific
  provider selection is a planning-phase decision). Mode MUST be configurable from the admin panel.
  Mode changes MAY trigger an automatic in-process restart orchestrated by the host's service
  manager (Windows Service / launchd / systemd), but MUST NOT require the operator to manually
  restart the OS service, log in to a shell, or re-run installation; the restart MUST complete
  within 10 seconds and the admin panel MUST reload without the admin re-authenticating.

- **FR-014**: A status indicator (system tray icon or CLI `status` command) MUST allow the admin
  to see whether the server is running and open the admin panel from the OS taskbar or terminal.

- **FR-015**: Deletion operations on all domain tables MUST be implemented as soft-delete
  (marking a row inactive); hard `DELETE` is forbidden in production code paths.

- **FR-016**: Every create, update, soft-delete, mode change, backup, restore, recovery, and
  authentication-state-change operation MUST emit a structured audit log entry containing actor
  (admin user id or `system`), action verb, target entity type and id, timestamp (UTC, ISO 8601),
  originating module, and source IP / interface. Entries MUST be stored in an append-only SQLite
  table — no UPDATE or DELETE statements are permitted by application code outside the retention
  pruning job defined in FR-016a.

- **FR-016a** (audit retention + export): Audit log retention MUST be configurable from the
  admin panel; default is 2 years. A daily prune job MUST identify rows older than the retention
  threshold, export them to a dated JSONL archive file (e.g.,
  `audit-YYYYMM.jsonl`) in the configured backup directory, verify the archive is written and
  fsync-flushed, and only then delete the pruned rows from the table. Archive files MUST follow
  the same retention semantics as backup files for storage planning but are NEVER auto-deleted
  by this job.

- **FR-017** (security baseline): TLS MUST be 1.2 minimum with modern cipher suites only; admin
  passwords MUST be hashed with a memory-hard algorithm (Argon2id or equivalent); the first-run
  wizard and admin login endpoints MUST rate-limit failed attempts (lockout or exponential backoff
  after 5 consecutive failures from the same source); admin sessions MUST expire after a
  configurable idle period (default 30 minutes).

- **FR-018**: Exactly one admin user MAY exist during Phase 0; the API MUST reject attempts to
  create a second admin until a future phase introduces multi-admin support.

- **FR-018a** (admin recovery): System MUST provide two independent recovery paths for a
  locked-out or password-lost admin: (1) a CLI command `balsm admin reset-password` runnable by a
  user with local OS administrator / root privileges on the host machine, which sets a new
  password and clears any active lockout; and (2) a one-time recovery code generated during the
  first-run wizard, displayed to the admin exactly once, stored only as a salted hash, and usable
  through the admin panel to reset the password. Successful use of either path MUST invalidate
  all existing admin sessions and emit an audit log entry (FR-016). Using the recovery code MUST
  immediately retire it and prompt generation of a fresh code on next login.

- **FR-019** (localization): Admin panel UI MUST support English and Arabic, with right-to-left
  layout for Arabic; locale MUST be selectable in the first-run wizard and persisted per admin user.

### Certification Compliance

| Standard     | Applies? | Obligation |
|--------------|----------|------------|
| HL7 FHIR R4  | No       | No clinical resources exposed at this phase |
| LOINC        | No       | No lab or observation data |
| SNOMED CT    | No       | No clinical findings or diagnoses |
| ICD-10       | No       | No diagnosis codes |
| RxNorm       | No       | No medication data |
| DPG Standard | Yes      | Admin account and workspace entity data constitute personal data; data MUST be exportable on request |
| Egypt PDPL   | Yes      | Admin credentials and entity contact details are personal data; consent and data minimisation principles apply |

**New compliance obligations this feature introduces**: Admin user account (name, email, password
hash) and entity contact details (pharmacy name, address, phone) are personal data subject to
Egypt PDPL Law 151/2020. No PHI is collected at this phase.

### Key Entities

- **Server Instance**: Represents the installed server process. Attributes: version, mode
  (Standalone / Network / Public), port, TLS certificate fingerprint, uptime. Certificate
  fingerprint is exposed via `/api/v1/server-info` (FR-009) for client trust pinning.
- **Workspace**: The single logical container for all pharmacy operations on this server.
  Attributes: name, created-at, status. One-to-one with Server Instance.
- **Entity**: A registered health facility (pharmacy, clinic, hospital). Attributes: name, type,
  registration number (optional), active/inactive. Belongs to Workspace.
- **Branch**: A physical operating location of an Entity. Attributes: name, address, phone,
  active/inactive. Belongs to Entity; Entity has 1–N Branches.
- **Admin User**: The system administrator. Attributes: email, hashed password (Argon2id per
  FR-017), display name, role, preferred locale (en / ar per FR-019). Created during first-run
  wizard; FR-018 enforces a single admin in Phase 0.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Server installs successfully on all three operating systems (Windows, macOS, Linux)
  in under 10 minutes on standard consumer hardware, with zero manual dependency installation steps.

- **SC-002**: Server is fully operational (accepting connections, migrations applied, admin panel
  reachable) within 10 seconds of OS boot completion on minimum-spec hardware.

- **SC-003**: A first-time admin user with no prior Balsm experience completes the first-run setup
  wizard and creates the first entity with one branch in under 5 minutes.

- **SC-004**: All client applications on the same local network discover the server automatically
  via mDNS within 5 seconds — zero manual IP configuration required.

- **SC-005**: Admin initiates and receives a complete database backup file within 30 seconds for
  databases up to 1 GB via admin panel or CLI; the backup file can be used to fully restore the
  server to that state.

- **SC-006**: Database sustains 50 concurrent read connections issuing a steady read workload
  (≥10 requests/second/connection) for at least 60 seconds with zero timeouts, zero connection
  errors, and p95 read latency under 100 ms on minimum-spec hardware.

- **SC-007**: All database schema changes are applied automatically on server startup with no
  manual steps; the server refuses to serve requests if migrations are incomplete.

- **SC-008**: Zero hard-deletions occur in any domain database table — all deactivation operations
  use soft-delete (FR-015); audit log entries (FR-016) are present for 100% of create / update /
  soft-delete / mode-change / backup / restore operations sampled in acceptance testing.

---

## Assumptions

- The server is installed on a pharmacy-owned machine (Windows 10+, macOS 12+, or Ubuntu 20.04+
  LTS equivalent); server-grade hardware is not required.
- Minimum hardware specification: 4 GB RAM, dual-core CPU, 20 GB free disk space.
- The installing user has local administrator / root privileges on the target machine.
- The pharmacy has a local area network (router + switch) connecting workstations and mobile
  devices; internet connectivity is not required for core server operation.
- The server operates in Standalone mode by default; Network/Public modes are opt-in.
- No PHI or clinical records are stored at this phase — the data managed is organisational
  (workspace, entities, branches) and administrative (admin user account).
- The mDNS service name format is `balsm-<workspace-slug>._balsm._tcp.local` once the first-run
  wizard sets the workspace slug. Prior to first-run completion, the server broadcasts a
  pre-setup instance name `balsm-setup-<short-server-id>._balsm._tcp.local` so initial clients
  can discover the server and reach its first-run wizard.
- The admin panel is the primary management interface; a CLI is a secondary interface for
  scripting and recovery scenarios (e.g., backup/restore).
