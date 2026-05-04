# Persona — Cashier

> A front-desk staff member who uses **Balsm Pro** to process sales and returns at the point of sale — without access to clinical or pharmacy workflows.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Cashier` |
| **Primary modules** | POS |
| **Entity types** | Pharmacy, Medical Supply Store, Clinic, Hospital, Hybrid |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Cashiers are non-clinical staff responsible for handling transactions at the point of sale. They may be:

- A pharmacy assistant processing over-the-counter sales
- A medical supply store sales associate
- A clinic front desk staff collecting co-pays and service fees

Cashiers have a **minimal, focused permission set** — they can process sales and returns and run their shift, but cannot access clinical records, prescription workflows, or administrative settings.

---

## Goals

- Process customer sales quickly and accurately
- Handle returns and exchanges without escalation
- Balance their cash drawer at the end of a shift
- Generate a shift summary to hand off to a supervisor
- Look up product prices and availability during a sale

---

## Pain Points

- Slow checkout due to system lag or complicated workflows
- Unable to check stock without asking another staff member
- Manual cash reconciliation at shift end that is error-prone
- No visibility into whether a return is still within the return window

---

## Default Permissions (`Cashier` group)

| Module | Access Level |
|--------|-------------|
| **POS** | Sales, returns, shift reports, cash drawer management |
| **Pharmacy** | None — cannot scan or dispense prescriptions |
| **Inventory** | None |
| **Clinical** | None |
| **Scheduling** | None |
| **Admin** | None |

Permission format examples:
- `pos.sale.create`
- `pos.return.create`
- `pos.shift.open`
- `pos.shift.close`
- `pos.cash_drawer.manage`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Process Sale** | Scan or search products, apply discounts, accept cash/card/wallet, issue receipt |
| **Process Return** | Look up a previous transaction, select items to return, process refund |
| **Shift Open** | Enter opening cash float, activate the cashier session |
| **Shift Close** | Count closing cash, generate shift summary report, hand off to supervisor |
| **Cash Drawer Management** | Log cash-in / cash-out events during the shift |
| **Product Lookup** | Search products by name or barcode to check price and availability |

---

## Related Personas

- [Pharmacist](./pharmacist) — handles prescription dispensing at the same POS station
- [Inventory Manager](./inventory-manager) — manages stock that cashiers sell
- [Entity Admin](./entity-admin) — reviews shift reports and manages cashier accounts
- [Patient](./patient) — the customer completing a purchase
