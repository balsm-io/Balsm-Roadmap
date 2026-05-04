# Persona — Inventory Manager

> A staff member responsible for managing stock levels, procurement, supplier relationships, and expiry tracking across the entity's inventory.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Inventory Manager` |
| **Primary modules** | Inventory (full), POS (reports only) |
| **Entity types** | All entity types (Pharmacy, Medical Supply Store, Clinic, Hospital, Lab, Scan Center, Hybrid) |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Inventory managers are responsible for ensuring that stock is always accurate, available, and within shelf-life. They may be:

- A pharmacy stock manager overseeing medication procurement and expiry
- A medical supply store manager managing equipment and consumables
- A hospital supply chain coordinator managing multi-department inventory
- A clinic administrator handling consumables and medical supplies

---

## Goals

- Maintain accurate real-time stock counts across all product categories
- Prevent stockouts by setting reorder points and receiving low-stock alerts
- Track and remove items approaching or past expiry
- Manage purchase orders and supplier relationships
- Coordinate warehouse transfers between branches or storage locations
- Generate inventory reports for management review

---

## Pain Points

- Discrepancies between physical stock and system records due to poor tracking
- Items expiring unnoticed and causing financial loss or compliance risk
- No automated reordering — manually watching stock levels takes time
- Supplier management done in spreadsheets separate from the inventory system
- No audit trail for stock adjustments, making loss investigation difficult

---

## Default Permissions (`Inventory Manager` group)

| Module | Access Level |
|--------|-------------|
| **Inventory** | Full — stock management, purchase orders, reorder settings, expiry tracking, adjustments, warehouse transfers |
| **POS** | Reports only — view sales reports to correlate with stock movement; cannot process sales |
| **Clinical** | None |
| **Pharmacy** | None |
| **Scheduling** | None |
| **Admin** | None |

Permission format examples:
- `inventory.stock.read`
- `inventory.stock.adjust`
- `inventory.stock.write`
- `inventory.purchase_order.create`
- `inventory.supplier.manage`
- `inventory.expiry.manage`
- `inventory.transfer.create`
- `pos.report.read`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Stock Count** | View real-time stock levels by product, category, or location; reconcile physical counts |
| **Reorder Management** | Set minimum stock thresholds; receive low-stock alerts; generate or auto-create purchase orders |
| **Expiry Tracking** | View items by expiry date; flag near-expiry and expired batches; initiate write-offs |
| **Purchase Orders** | Create and track purchase orders sent to suppliers; receive deliveries and update stock |
| **Supplier Management** | Manage supplier contact details, lead times, and pricing |
| **Stock Adjustments** | Log manual adjustments (spoilage, damage, corrections) with reason codes and audit trail |
| **Warehouse Transfers** | Transfer stock between branches, storerooms, or departments |
| **Inventory Reports** | Generate stock valuation, movement, and expiry reports |
| **Barcode Management** | Assign, print, and scan barcodes for product identification |

---

## Related Personas

- [Pharmacist](./pharmacist) — has read-only inventory access; relies on the inventory manager for stock accuracy
- [Cashier](./cashier) — processes sales that consume inventory tracked by the inventory manager
- [Entity Admin](./entity-admin) — reviews inventory reports and approves major procurement decisions
