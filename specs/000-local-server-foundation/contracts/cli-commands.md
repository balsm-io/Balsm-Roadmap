# Contract: `balsm` CLI (Phase 0 surface)

The `balsm` CLI ships in the same self-contained installer as the server and the supervisor process. It is the secondary management surface (admin panel is primary). All CLI commands MUST emit an audit log entry (FR-016) with `actor = cli:<command-name>`.

All commands return exit code `0` on success, `>0` on failure, with structured JSON to stdout on `--json`.

| Command | FR mapping | Description | Auth requirement |
|---|---|---|---|
| `balsm status` | FR-014 | Print server up/down + uptime + bind URL + mode. Open the admin panel in the default browser when `--open` flag is set. | None (local) |
| `balsm backup` | FR-011 | Trigger an on-demand backup; print absolute backup file path on success. `--dir <path>` overrides destination. | Local OS admin / root |
| `balsm backup list` | FR-011a | List backups newest-first (mirrors `GET /backups`). | Local OS admin / root |
| `balsm db restore <file>` | FR-011b | Restore from a backup file. Requires `--yes` confirmation. While running, server returns 503 to non-health endpoints. | Local OS admin / root |
| `balsm admin reset-password` | FR-018a | Prompt for a new password and reset the (single) admin's password; clear lockout; invalidate all sessions. | Local OS admin / root |
| `balsm mode <Standalone|Network|Public>` | FR-013 | Change operating mode in-process. `Public` accepts `--tunnel-provider <name>`. | Local OS admin / root |
| `balsm version` | FR-009 | Print version + build commit. | None (local) |

Auth model:
- "Local OS admin / root" means the process is allowed by the OS to read/write the install directory and the service control surface. Verified by checking effective UID (Unix) or `IsUserAnAdmin()` (Windows). No JWT involved.
- All write commands MUST print a one-line audit confirmation including the audit log row id and timestamp.

Exit codes:
| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Generic failure |
| 2 | Invalid arguments / usage |
| 3 | Insufficient OS privileges |
| 4 | Server not installed |
| 5 | Server running but unhealthy (migrations pending / restore in progress) |
| 6 | Pre-condition failed (e.g., `db restore` on a server with concurrent restore) |

JSON envelope on `--json`:
```json
{
  "command": "backup",
  "status": "ok",
  "result": {
    "file": "/Users/owner/balsm/backups/balsm-20260530-104511.db",
    "size_bytes": 4321088,
    "sha256": "…"
  },
  "audit_id": 4823
}
```
