# Phase 0 Research: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

This document resolves the `NEEDS CLARIFICATION` items and dependency-selection questions arising from the Technical Context section of `plan.md`. Each entry records the decision, the rationale, and the alternatives considered.

---

## R1. mDNS / Bonjour library for .NET 10

- **Decision**: Use **`Tmds.MDns`** (cross-platform pure-managed Multicast DNS client and responder) for both broadcast and discovery flows.
- **Rationale**:
  - Pure managed code → ships inside the self-contained executable; no native Bonjour runtime dependency on Windows / Linux (avoids `mDNSResponder` / `avahi-daemon` install requirement that would break FR-001's "zero manual dependency" success criterion).
  - Active maintenance; supports concurrent service registration (needed for the pre-setup → post-setup name flip in FR-008).
  - Compatible with NET 8/9/10 target frameworks.
- **Alternatives considered**:
  - `Zeroconf` (Novotnyllc/Zeroconf) — discovery-only on most platforms; would require a separate responder library; rejected.
  - `Makaretu.Dns.Multicast` — viable; smaller community, fewer responder examples; held in reserve.
  - System `dns-sd` / `avahi-browse` shell-outs — violates self-contained binary goal; rejected.

## R2. Argon2id password hashing implementation

- **Decision**: Use **`Konscious.Security.Cryptography.Argon2`** with parameters: `memorySize = 64 MiB`, `iterations = 3`, `parallelism = 2 lanes`, 16-byte salt, 32-byte tag.
- **Rationale**:
  - Pure managed Argon2id implementation — no libsodium native dependency on installer targets.
  - Parameters meet OWASP 2024 minimum (`64 MiB / t=3 / p=2`) for non-interactive server-side hashing without exceeding the 4 GB RAM minimum-spec hardware budget (single hash uses ≤64 MiB transient memory; login concurrency on a single-admin server is ~1).
  - Compatible with `IPasswordHasher<TUser>` ASP.NET Core abstraction so the existing Identity module can adopt it through DI swap without surface changes.
- **Alternatives considered**:
  - `libsodium-net` binding — adds native dep, complicates cross-platform packaging; rejected.
  - `Microsoft.AspNetCore.Cryptography.KeyDerivation` (PBKDF2-SHA256) — FR-017 requires *memory-hard* algorithm; PBKDF2 is not memory-hard; rejected.
  - bcrypt — not memory-hard; rejected on the same grounds.

## R3. Login / wizard rate-limit + lockout policy

- **Decision**: **5 consecutive failed authentication attempts from a single source (admin email + source IP composite key) → 15-minute lockout** for the affected admin, with exponential backoff (1s → 2s → 4s → 8s → 16s) on the 1st through 5th attempt before the lockout trips. Lockout MUST be cleared by either (a) the 15-minute window elapsing, (b) successful CLI `balsm admin reset-password`, or (c) successful recovery-code use.
- **Rationale**: Mirrors Constitution §II "Brute-force protection: 5 failed login attempts → 15-minute lockout" verbatim and extends it with the backoff window the spec FR-017 calls for. Composite source-key prevents a malicious LAN host from locking out the admin from the admin's own browser.
- **Alternatives considered**:
  - Per-IP only — vulnerable to admin self-lockout from shared NAT environments.
  - Per-account only — vulnerable to LAN-based denial-of-service on the admin.
  - CAPTCHA after N failures — out of scope (no third-party service dep at foundation phase).

## R4. Reverse-tunnel provider for FR-013 Public mode

- **Decision**: Implement a **provider-plugin interface** (`ITunnelProvider`) under `Balsm.Infrastructure/Networking/Tunnel/`, with **Cloudflare Tunnel** as the **first concrete implementation** wired via the existing `tunnel-registry` workspace artifacts. The provider is **swappable via configuration** (no spec-level vendor lock — spec FR-013 generalised after the review pass).
- **Rationale**:
  - Cloudflare Tunnel matches existing repo investment (`tunnel-registry/`), is outbound-only (no inbound firewall holes — important for pharmacy LANs), and has a stable cloudflared binary on all three target OSes.
  - The interface preserves the door for ngrok, Tailscale Funnel, or self-hosted FRP as planning-phase substitutes without a spec change.
- **Alternatives considered**:
  - Direct port-forward / UPnP — requires inbound firewall rules; rejected (operational and security burden).
  - Tailscale Funnel — viable; deferred as future provider.
  - SSH reverse tunnel — requires SSH server bootstrap; rejected for foundation phase.

## R5. SQLite online backup transfer step + restore atomic-swap pattern

- **Decision**:
  - **Backup**: Use `Microsoft.Data.Sqlite`'s `SqliteConnection.BackupDatabase(destination)` (which wraps `sqlite3_backup_*`). Page step = `-1` (single shot for files ≤1 GB on minimum-spec hardware; meets FR-011 30 s budget); for larger files, fall back to `pageSize = 1024 pages` per step with `Thread.Sleep(5)` yield to keep WAL writers progressing.
  - **Restore**: Write the incoming backup to `<install-dir>/balsm.db.restoring`, run `PRAGMA integrity_check` and `PRAGMA foreign_key_check`, then within a stopped EF Core context perform a `File.Replace(restoring, live, live + ".rollback")` for cross-platform atomic rename + automatic rollback target. On success delete `.rollback`; on failure swap back from `.rollback` and emit a `RestoreFailed` audit event.
- **Rationale**: Wraps SQLite's official online backup API per FR-011's explicit mandate, satisfies FR-011b's "leave previous database untouched" by exploiting `File.Replace`'s built-in three-way atomic swap (works on NTFS, APFS, ext4/xfs).
- **Alternatives considered**:
  - `cp` / `File.Copy` while running — forbidden by FR-011.
  - `VACUUM INTO` — viable for backup but doesn't satisfy the online-backup-API mandate as explicitly stated in FR-011.
  - Manual two-phase commit with WAL checkpoint — adds complexity over `File.Replace` and offers no integrity gain.

## R6. Self-signed certificate provisioning

- **Decision**: Generate a 2048-bit RSA self-signed certificate at first launch using `System.Security.Cryptography.X509Certificates.CertificateRequest` (no external `mkcert` binary). Common Name = the resolved hostname; Subject Alternative Names = `localhost`, `127.0.0.1`, the host's primary LAN IPv4, and the mDNS hostname (`balsm-<workspace-slug>.local`). 825-day validity. Fingerprint exposed via FR-009 `/api/v1/server-info`.
- **Rationale**: Pure managed → satisfies FR-001 "zero manual dependency"; SAN coverage avoids client certificate-name-mismatch errors when reaching the server via mDNS hostname; 825 days is the maximum modern browser-accepted validity for non-CA-issued certificates (auto-renewal job scheduled at day 730 — tracked as a future phase concern, not Phase 0).
- **Alternatives considered**:
  - Shipping `mkcert` — requires installing a local CA on every client, dramatically increases support surface.
  - Let's Encrypt via cloudflared-tunnel hostname — only works in Public mode; cannot be the default.

## R7. Cron-style scheduler for FR-011a / FR-016a

- **Decision**: Use **`NCrontab`** for cron expression parsing combined with **`IHostedService`** background workers (one per scheduled job — `BackupScheduler`, `AuditRetentionJob`). Default schedules expressed as `0 2 * * *` (daily 02:00 server-local) and `0 3 * * *` respectively.
- **Rationale**: Tiny, single-package dependency; no Quartz/Hangfire database tables; aligns with the constitution's "no over-engineering in simple contexts" guidance. Hosted services hook into the ASP.NET Core lifetime → automatically stop during restore (FR-011b) and during migration (FR-010).
- **Alternatives considered**:
  - Quartz.NET — overkill for two jobs at foundation phase.
  - Hangfire — adds a separate dashboard surface that overlaps with the admin panel.
  - Bare `Task.Delay` loops — fragile across DST transitions; rejected.

## R8. Admin UI accessibility baseline

- **Decision**: Target **WCAG 2.1 Level AA** as the design baseline for the React admin UI; explicitly defer formal audit / VPAT generation to a later phase. Implementation contract: keyboard-only navigation, visible focus ring, `aria-*` on interactive components, colour contrast ≥4.5:1 for text, RTL mirroring for Arabic via CSS logical properties.
- **Rationale**: AA is the public-sector benchmark (Egypt PDPL guidance defers to international norms here); fully achievable without a third-party design-system swap; matches `admin-ui` current React 19 + Vite stack.
- **Alternatives considered**:
  - Level AAA — disproportionate cost for a single-admin internal panel.
  - "No formal level" — leaves the lowest-impact deferred item from clarify session unresolved.

## R9. macOS `launchd` LaunchDaemon plist template

- **Decision**: Install at `/Library/LaunchDaemons/com.balsm.server.plist` with `RunAtLoad = true`, `KeepAlive = true`, `StandardOutPath` and `StandardErrorPath` routed under `/Library/Logs/Balsm/`, owner `root:wheel`, mode `0644`. Service started via `launchctl bootstrap system <plist>` from the `.dmg` postinstall script.
- **Rationale**: System-domain LaunchDaemons are the correct surface for a server that must survive user logout / fast user switching. KeepAlive auto-restarts on crash, satisfying FR-002 "auto-start on OS boot without user intervention" extension to "stay running."
- **Alternatives considered**:
  - LaunchAgent (user domain) — does not run pre-login; rejected.
  - Manual `nohup` from `.dmg` — no service supervision; rejected.

## R10. SQLite concurrency configuration

- **Decision**: Configure `journal_mode = WAL`, `synchronous = NORMAL`, `busy_timeout = 5000`, `foreign_keys = ON`, `temp_store = MEMORY`, `mmap_size = 268435456` (256 MB). Single writer connection (pooled `Microsoft.Data.Sqlite` writer), unbounded reader pool for endpoints that use `AsNoTracking()`.
- **Rationale**: WAL is the only mode that supports the 50-concurrent-reader SC-006 target on SQLite. `synchronous=NORMAL` is safe under WAL (recovery is consistent up to the last checkpoint) and meaningfully faster on consumer SSDs found in pharmacy hardware. `busy_timeout` absorbs short writer waits without surfacing `SQLITE_BUSY` to API callers.
- **Alternatives considered**:
  - `synchronous = FULL` — slows writes ~3x for negligible safety gain under WAL with a working `fsync` on modern filesystems.
  - `journal_mode = DELETE` — single-reader-at-a-time blocks all writers; cannot meet SC-006.

---

## Outstanding planner-deferred items (low impact)

- **D1**: Maximum branches per entity bound — left unspecified; expected practical ceiling well under any SQLite concern. Will be addressed in a later phase if it becomes a UI concern.
- **D2**: WCAG AAA pursuit — deferred per R8.

All NEEDS CLARIFICATION items from `plan.md` Technical Context are resolved.
