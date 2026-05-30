# Quickstart: Local Server Foundation

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-05-30

End-to-end "fresh OS → working admin panel" walkthrough used as the manual smoke-test for Phase 0 and as the script the Playwright end-to-end test automates.

---

## Prerequisites

- Target machine meets minimum spec (4 GB RAM, dual-core, 20 GB free disk).
- Installer artifact from CI for the target OS:
  - Windows: `balsm-<version>.msi`
  - macOS: `balsm-<version>.dmg`
  - Linux: `balsm-<version>.deb`
- Logged in as a user with local administrator / root privileges.

---

## Step 1 — Install

Windows:
```powershell
msiexec /i balsm-<version>.msi /qb
```

macOS:
```bash
sudo installer -pkg balsm-<version>.dmg -target /
```

Linux:
```bash
sudo apt install ./balsm-<version>.deb
```

**Expected**:
- Service registered: Windows Service `BalsmServer` / `launchctl print system/com.balsm.server` / `systemctl status balsm`.
- Installer completion dialog shows the admin panel URL `https://localhost:8443/admin`.
- Tray / menu-bar icon present and reports "Running".
- `balsm status` from a new shell prints `up`, version, mode `Standalone`, uptime.

---

## Step 2 — First-run wizard

1. Open `https://localhost:8443/admin` in a browser (accept the self-signed certificate).
2. The wizard is the only accessible UI (FR-004).
3. Pick a locale (English or العربية) — RTL applies immediately on selection.
4. Create the admin account: email, display name, password (≥12 chars).
5. Set the workspace name + slug (slug is auto-suggested from the name).
6. Wizard commits, returns a **one-time recovery code** (FR-018a). The page blocks further navigation until the admin checks "I have stored this offline."
7. Wizard redirects to the dashboard.

**Expected**:
- Dashboard shows: server status (Running), uptime, version, workspace name, navigation to Entities / Backups / Audit / Mode / Recovery.
- `GET /api/v1/server-info` now returns `workspace_name` populated.
- mDNS service instance name switches from `balsm-setup-…` to `balsm-<slug>`.

---

## Step 3 — Add an entity + two branches

1. Navigate to *Entities → New*.
2. Create entity `My Pharmacy`, type `pharmacy`.
3. Add branch `Downtown` with address + phone.
4. Add branch `Heliopolis` with address + phone.
5. Deactivate `Heliopolis`. Confirm it disappears from active lists but remains visible under "Include inactive".
6. Edit `Downtown` address; confirm change is reflected on reload.

**Expected**:
- All three operations produce audit log rows under module = `Entity` / `Branch`.
- No hard delete is possible from the UI; the `DELETE /branches/{id}` API returns `405`.

---

## Step 4 — Backup + restore round trip

1. *Backups → Backup Now*.
2. Wait until the new file appears with status `OK` (≤30 s for typical sub-1 GB DB).
3. Note the file path + SHA-256.
4. *Backups → Schedule*: set to daily 02:00 (default), retention 30.
5. Create a junk entity to dirty the DB.
6. Select the backup row → *Restore* → echo `RESTORE` in confirmation.
7. During restore: `GET /api/v1/entities` returns 503; `GET /api/v1/health` returns 200 (ready=false).
8. Restore completes, application restarts (no OS service restart), the junk entity is gone.

**Expected**:
- Audit log shows `BackupTaken`, `RestoreRequested`, `RestoreCompleted` with the SHA-256 of the source backup.
- No OS-level service restart was needed.

---

## Step 5 — Recovery code path

1. Log out.
2. Attempt login with the wrong password 5 times → expect HTTP 423 `Locked` after the 5th attempt.
3. Visit the *Recovery* page → enter admin email + the one-time recovery code + a new password.
4. Recovery succeeds; lockout cleared; token issued; the consumed recovery code is retired and a new one is generated on next login.

**Alternative CLI path**:
```bash
sudo balsm admin reset-password
```
Enter a new password at the prompt → all sessions invalidated → lockout cleared.

---

## Step 6 — mDNS discovery from a second device

1. Connect a second device to the same LAN.
2. From a terminal: `dns-sd -B _balsm._tcp` (macOS) or `avahi-browse -r _balsm._tcp` (Linux).
3. Confirm `balsm-<slug>` appears within 5 seconds.
4. Switch server to Standalone mode in *Mode* — the instance MUST disappear from discovery within ~5 seconds.
5. Switch back to Network — re-appears.

---

## Step 7 — Audit log + JSONL export

1. Open *Audit Log* in the admin panel. Verify entries from all preceding steps are present with correct `actor`, `module`, `action`, `target_*`.
2. Confirm retention is set to 2 years in *Audit → Retention*.
3. (Long-running test, simulated): manually fast-forward retention to expose at least one row, run the retention job, confirm a JSONL archive file appears in the backup directory and a row appears in *Audit → Archives*.

---

## Success criteria checklist (mirrors `spec.md` Success Criteria)

- [ ] SC-001: install completed in ≤10 minutes on all three OSes with zero manual dependency install.
- [ ] SC-002: server ready ≤10 s after OS boot.
- [ ] SC-003: a first-time admin completes wizard + first entity + one branch in ≤5 minutes.
- [ ] SC-004: second-device mDNS discovery ≤5 s.
- [ ] SC-005: backup ≤30 s for ≤1 GB DB; restore round-trip succeeds.
- [ ] SC-006: 50 concurrent read connections sustained ≥60 s, p95 read latency <100 ms.
- [ ] SC-007: server refuses non-health requests during migration / restore.
- [ ] SC-008: zero hard-deletions on domain tables; audit log present for every write/auth-state-change.
