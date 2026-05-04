# Persona — Accountant

> A financial staff member who uses **Balsm Pro** to view financial reports and reconcile revenue — without access to staff management or clinical data.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Accountant` |
| **Primary modules** | Admin (financial reports only) |
| **Entity types** | All entity types |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Accountants are financial professionals responsible for the financial health and reporting of the entity. They may be:

- An in-house bookkeeper at a clinic or pharmacy
- An external accountant who logs in periodically to pull reports
- A finance manager at a multi-branch hospital group

Accountants have a **narrow, read-focused permission set** scoped entirely to financial reporting. They cannot view staff details, change any settings, access clinical records, or touch POS operations — ensuring a clear separation of duties.

---

## Goals

- Access daily, weekly, and monthly revenue and expense reports
- Reconcile POS sales data with bank and payment processor records
- Export financial data in formats compatible with accounting software (e.g., Excel, CSV)
- View outstanding invoices, billing summaries, and subscription costs
- Audit payment transactions for discrepancies

---

## Pain Points

- Financial data scattered across POS receipts, bank statements, and manual spreadsheets
- No direct access to the system — relying on an admin to pull and export reports manually
- Reports that mix financial data with staff or clinical information the accountant should not see
- No exportable audit trail for payment reconciliation

---

## Default Permissions (`Accountant` group)

| Module | Access Level |
|--------|-------------|
| **Admin** | Financial reports only — view revenue, expense, billing, and transaction reports |
| **Admin — Staff Management** | **Denied** — cannot view staff profiles, salaries, or HR data |
| **POS** | None — cannot process sales or access the POS terminal |
| **Clinical** | None |
| **Pharmacy** | None |
| **Inventory** | None |
| **Scheduling** | None |

Permission format examples:
- `admin.report.financial`
- `admin.billing.read`
- `admin.staff.manage` → **Explicit Deny**

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Revenue Reports** | View daily/weekly/monthly revenue summaries broken down by service, product, or payment method |
| **Transaction Audit** | Review individual payment transactions; filter by date, type, or amount |
| **Billing Statements** | View Balsm subscription and usage-based billing statements for the entity |
| **Financial Export** | Export reports as CSV or Excel for use in external accounting software |
| **Reconciliation View** | Compare POS sales totals against payment method breakdowns for end-of-day or end-of-month reconciliation |

---

## Related Personas

- [Entity Admin](./entity-admin) — grants the accountant their access; reviews broader financial health alongside accountant reports
- [Cashier](./cashier) — generates POS shift reports that feed into accountant reconciliation
