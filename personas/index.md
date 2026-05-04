# Balsm Platform — User Personas

> This section documents every user persona across the Balsm platform. Each persona page covers who they are, which app they use, their key goals, the modules and permissions they need, and their primary workflows.

---

## Platform Overview

| App | Persona(s) |
|-----|-----------|
| **Balsm** (patient app) | [Patient](./patient), [Caregiver](./caregiver) |
| **Balsm Pro** (practice management) | [Doctor](./doctor), [Nurse](./nurse), [Pharmacist](./pharmacist), [Cashier](./cashier), [Receptionist](./receptionist), [Lab Technician](./lab-technician), [Radiologist](./radiologist), [Inventory Manager](./inventory-manager), [Accountant](./accountant), [Entity Admin](./entity-admin) |
| **Balsm Connect** (partner portal) | [Partner](./partner) |
| **Admin UI** (server management) | [System Administrator](./system-admin) |

---

## Quick Reference — Permissions by Persona

| Persona | Default Permission Group | Primary Modules |
|---------|-------------------------|-----------------|
| Patient | — (patient account, not a Pro user) | — |
| Caregiver | — (patient account, not a Pro user) | — |
| Doctor | `Doctor` | Clinical, Scheduling |
| Nurse | `Nurse` | Clinical (limited), Scheduling (view) |
| Pharmacist | `Pharmacist` | POS, Pharmacy, Inventory |
| Cashier | `Cashier` | POS |
| Receptionist | `Receptionist` | Scheduling, POS (co-pay only) |
| Lab Technician | `Lab Technician` | Lab, Scheduling |
| Radiologist | `Radiologist` | Imaging, Scheduling |
| Inventory Manager | `Inventory Manager` | Inventory, POS (reports only) |
| Accountant | `Accountant` | Admin (financial reports only) |
| Entity Admin / Owner | `Owner` | All enabled modules + Admin |
| Partner | — (Balsm Connect account) | Analytics, Campaigns |
| System Administrator | — (Balsm team, Admin UI only) | Server management |

---

## Permission Resolution Order

All permissions in Balsm Pro follow this resolution order (highest wins):

1. **Explicit Deny** — always blocks, regardless of group membership or grants
2. **Explicit Grant** — adds a permission not in any assigned group
3. **Group permissions** — union of all assigned permission groups
4. **No match** — deny by default

Permission format: `module.resource.action` (e.g., `clinical.prescription.write`, `pos.shift.close`)
