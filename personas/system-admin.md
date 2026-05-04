# Persona — System Administrator

> A member of the Balsm operations team who manages the server infrastructure, tenant provisioning, and platform-level configuration through the **Admin UI** embedded in the Balsm API.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Admin UI (React/Vite, served at `/admin` from the Balsm API) |
| **Account type** | Platform-level admin (Balsm team — not an entity user) |
| **Access** | Admin UI only — not a Balsm Pro or Balsm App user in this role |
| **Platforms** | Web only (accessed via browser at the server's admin endpoint) |

---

## Who They Are

System administrators are members of the Balsm team (or designated IT staff for self-hosted deployments) who manage the infrastructure that all entities run on. They are responsible for:

- **Cloud deployments** — the Balsm Network cloud infrastructure serving multiple entities
- **Self-hosted deployments** — on-premise or private cloud servers installed at a healthcare entity's site
- **Standalone deployments** — single-executable installations on local hardware

This persona does **not** correspond to an **Entity Admin** — system administrators operate at the platform level and have no access to clinical records or entity business data.

---

## Goals

- Provision new tenant entities and manage their configuration
- Monitor server health, resource usage, and API performance
- Manage platform-level authentication and security settings
- Rotate and manage encryption keys and API credentials
- Review platform-level audit logs and security events
- Manage database migrations and scheduled maintenance
- Configure deployment-specific settings (database path, storage backend, email relay)

---

## Pain Points

- No visibility into which tenants are consuming disproportionate resources
- Database migrations that require manual coordination and downtime windows
- Security key rotation requiring system downtime
- No centralized alert system for critical server events (disk full, high CPU, auth failures)
- Managing multiple self-hosted instances with inconsistent configurations

---

## Key Features / Workflows

| Workflow | Description |
|----------|-------------|
| **Tenant Provisioning** | Create and configure new entity accounts; set subscription tier and enabled modules |
| **Server Health Dashboard** | Monitor CPU, memory, disk, and API response time; view active sessions |
| **Database Management** | Run pending migrations; view migration history; initiate backups and restores |
| **Security Settings** | Configure JWT signing keys, TLS certificates, session timeout policies, and MFA enforcement |
| **Key Management** | Rotate encryption keys (AES); manage per-entity BYOK API key registration |
| **Audit Log Review** | Review platform-level security events: failed logins, permission escalations, unusual access patterns |
| **Deployment Configuration** | Set database engine (SQLite vs. PostgreSQL), file storage backend (local vs. S3/Azure Blob), email relay settings |
| **Update Management** | Apply platform updates; manage rollback points |
| **Admin Account Management** | Create and manage other Admin UI user accounts; enforce MFA for admin access |

---

## Deployment Modes

| Mode | Description |
|------|-------------|
| **Standalone** | Single executable with embedded admin panel; SQLite database; runs on local hardware; no internet required |
| **Self-Hosted** | API deployed on entity's own server or private cloud; PostgreSQL or SQLite; internet optional |
| **Balsm Network (Cloud)** | Multi-tenant cloud deployment managed by Balsm; system admin operates the shared infrastructure |

---

## Security Requirements

- Admin UI access requires **MFA** by default
- Additional verification step (`/auth/verify-admin`) on login
- All admin sessions are logged and can be reviewed at `/auth/sessions`
- Admin activity log is immutable and available at `/auth/activity-log`
- Admin accounts are separate from entity user accounts — no cross-contamination of access scopes

---

## Related Personas

- [Entity Admin](./entity-admin) — manages their entity's configuration within the bounds the system admin has provisioned
- [Partner](./partner) — partner account provisioning and data access approvals may be managed at the system level
