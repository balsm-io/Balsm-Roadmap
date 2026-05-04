# Persona — Entity Admin (Owner)

> The owner or designated administrator of a healthcare entity who uses **Balsm Pro** with full access to all enabled modules — configuring the workspace, managing staff, and overseeing operations.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Owner` |
| **Primary modules** | All enabled modules + Admin |
| **Entity types** | All entity types (Pharmacy, Medical Supply Store, Clinic, Hospital, Lab, Scan Center, Hybrid) |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Entity admins are the owners or top-level administrators of a healthcare entity registered on the Balsm platform. They may be:

- The owner of an independent pharmacy or medical supply store
- The medical director or practice manager of a clinic
- The operations director of a hospital or multi-branch chain
- The owner of a hybrid entity (pharmacy + medical supply store)

The entity admin is the **account anchor** for the entity — they cannot be removed from the entity, and their permissions cannot be reduced below full ownership access. They are responsible for all configuration, subscription management, and staff oversight.

---

## Goals

- Onboard new staff and assign them the correct permission groups
- Configure the entity's modules, settings, and billing plan
- Monitor operational KPIs: revenue, appointment volume, stock levels
- Review audit logs for compliance and security
- Manage device and session access across all staff
- Configure AI integrations (BYOK) for clinical decision support
- Oversee multi-branch operations from a single account (if applicable)

---

## Pain Points

- Setting up a new practice system from scratch is time-consuming without guided onboarding
- No single dashboard showing financial, clinical, and operational metrics together
- Staff permission management that is either too coarse (everyone is admin) or too complex to maintain
- No audit trail when something goes wrong — who changed what, when?
- Compliance requirements (HIPAA, local regulations) with no built-in compliance dashboard

---

## Default Permissions (`Owner` group)

The Owner has **implicit full permissions** on all enabled modules, regardless of team assignment. Owner permissions cannot be reduced.

| Module | Access Level |
|--------|-------------|
| **All enabled modules** | Full access |
| **Admin** | Full — staff management, payroll, reports, settings, billing, audit logs, workspace configuration |
| **Billing** | Full — manage subscription plan, view usage, update payment method |
| **Device & Session Management** | Full — revoke any device or session remotely |

---

## Key Workflows

### Staff Management
| Workflow | Description |
|----------|-------------|
| **Invite Staff** | Send an invitation link to a new staff member; assign them to a team and permission group |
| **Permission Groups** | Create custom permission groups for entity-specific roles; assign/modify existing groups |
| **Individual Overrides** | Grant or deny specific permissions to an individual user outside their group |
| **Remove Staff** | Deactivate a staff member's access; their records and audit trail are preserved |
| **Audit Log** | Review all permission changes, login events, PHI access, and configuration changes |

### Entity Configuration
| Workflow | Description |
|----------|-------------|
| **Entity Profile** | Set entity name, address, contact details, logo, and public directory listing |
| **Module Activation** | Enable or upgrade modules (e.g., add Scheduling, enable AI features) |
| **Appointment Settings** | Configure appointment types, durations, resources, and available hours |
| **Billing & Subscription** | View current plan, upgrade/downgrade, manage payment method, view invoices |
| **AI Configuration** | Enter BYOK API keys for AI-assisted features (drug interactions, clinical notes) |
| **Device Management** | View all registered devices; revoke access for lost/stolen devices |
| **Multi-branch** | Manage multiple entity locations under the same owner account; transfer stock between branches |

### Operational Oversight
| Workflow | Description |
|----------|-------------|
| **Dashboard** | View real-time KPIs: today's appointments, POS revenue, low stock alerts, pending lab results |
| **Financial Reports** | Access all financial reports across all modules and locations |
| **Staff Performance** | View productivity metrics (appointments handled, sales processed, prescriptions dispensed) |
| **Compliance Dashboard** | Review PHI access logs, consent records, and regulatory compliance items |

---

## Access Control — Owner Immutability Rules

- Entity owner **cannot be removed** from the entity → `IDENTITY_OWNER_IMMUTABLE`
- Entity owner's permissions **cannot be reduced** → `IDENTITY_OWNER_IMMUTABLE`
- Owner has implicit full permissions regardless of team assignment

---

## Module Billing Reference

| Module | Tier | Notes |
|--------|------|-------|
| POS, Inventory, Admin | Tier 0 (FREE) | Always included for local/offline use |
| Clinical | Tier 0 (FREE) | Included for local/offline use |
| Scheduling | Tier 2 (TRIAL) → Tier 1 (FREEMIUM) → Tier 3 (PAID) | Network booking feature |
| Pharmacy AI (drug interactions) | Tier 4 (METERED) | BYOK, billed per-check |
| Lab, Imaging | Tier 2 (TRIAL) → Tier 5 (ADDON) | Premium modules |

---

## Related Personas

- All other Balsm Pro personas — the entity admin creates and manages their accounts
- [System Administrator](./system-admin) — manages the underlying server infrastructure
