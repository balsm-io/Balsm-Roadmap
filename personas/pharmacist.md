# Persona — Pharmacist

> A licensed pharmacist who uses **Balsm Pro** to dispense medications, scan ePrescriptions, check for drug interactions, and manage pharmacy inventory.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Pharmacist` |
| **Primary modules** | POS (full), Pharmacy (full), Inventory (read) |
| **Entity types** | Pharmacy, Hospital, Hybrid (Pharmacy + Medical Supply) |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Pharmacists are licensed professionals who dispense prescription and over-the-counter medications. They may be:

- A community pharmacist running a standalone pharmacy
- A hospital pharmacist managing inpatient medication dispensing
- A pharmacist in a hybrid (pharmacy + medical supply) entity

Pharmacists interact closely with the **Pharmacy module** (prescription workflows, drug interaction checks, controlled substance tracking) and the **POS module** (sales and payment processing).

---

## Goals

- Scan and validate ePrescriptions via QR code quickly
- Check for drug interactions before dispensing
- Process sales and returns efficiently at the POS
- Track stock levels and receive low-stock alerts
- Stay compliant with controlled substance regulations
- Verify their own licensing status is recorded and current

---

## Pain Points

- Paper prescriptions that can be forged, lost, or misread
- Manual drug interaction checks that slow down dispensing
- Inventory discrepancies between physical stock and system records
- Controlled substance tracking done on separate paper logs
- No automatic linkage between a dispensed item and the prescription record

---

## Default Permissions (`Pharmacist` group)

| Module | Access Level |
|--------|-------------|
| **POS** | Full — sales, returns, payment processing, shift reports, cash drawer |
| **Pharmacy** | Full — ePrescription scanning, drug interaction checks, controlled substance tracking |
| **Inventory** | Read — view stock levels, view expiry alerts; no write access by default |
| **Clinical** | None |
| **Scheduling** | None |
| **Admin** | None |

Permission format examples:
- `pos.sale.create`
- `pos.return.create`
- `pos.shift.close`
- `pharmacy.prescription.dispense`
- `pharmacy.drug_interaction.check`
- `pharmacy.controlled_substance.log`
- `inventory.stock.read`

> Entity admins can grant `inventory.stock.write` to pharmacists who also handle stock management.

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **ePrescription Scan** | Scan a patient's prescription QR code to retrieve the digital prescription, verify validity, and process dispensing |
| **Drug Interaction Check** | Automatically check the prescription against the patient's medication list and flag contraindications (AI-assisted, BYOK) |
| **Controlled Substance Tracking** | Log controlled drug dispensing with required details (patient, quantity, prescriber, batch number) |
| **POS Sale** | Process over-the-counter and prescription sales; accept multiple payment methods |
| **Return Processing** | Handle medication returns with reason codes and inventory adjustment |
| **Shift Management** | Open and close shifts; generate shift cash and sales reports |
| **Inventory View** | Check stock levels, view expiry dates, and flag items needing reorder |
| **Licensing Verification** | System stores pharmacist license number and expiry date; alerts on approaching expiry |

---

## Pharmacy Module — AI Features

Drug interaction checks are **Tier 4 (METERED)** with BYOK:
- The entity provides their own AI API key
- Usage is tracked and billed per-check beyond the free tier
- Checks are logged for regulatory audit purposes

---

## Related Personas

- [Cashier](./cashier) — handles POS sales without pharmacy-level access
- [Inventory Manager](./inventory-manager) — manages stock levels and procurement
- [Doctor](./doctor) — writes ePrescriptions fulfilled by the pharmacist
- [Patient](./patient) — collects dispensed medications
- [Entity Admin](./entity-admin) — manages pharmacy licensing records and settings
