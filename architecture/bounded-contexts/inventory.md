# Inventory — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting — controlled-substance classification (Egypt Law 182/1960) and FIFO-by-expiry are domain-specific; not commodity ERP |
| **Phases** | P006 |
| **Repo mapping** | `Balsm-API-DotNet`: `Modules/Inventory` (shell today) |
| **PHI posture** | None. Stock and catalog data. |

## Purpose

Medication catalog and stock truth for a pharmacy (later: any entity). Owns the hard invariant of the counter flow: **stock never goes below zero**, even under concurrent deductions. `PharmacyInventory` previously listed under the Pharmacy context belongs here — one context owns stock.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Catalog Item | A medication definition: name, generic, brand, category, form, strength, unit |
| Barcode | One scannable code bound to a catalog item — many per item (supplier/packaging variants) |
| Stock Level | Quantity on hand per item per branch, with batch expiry dates |
| FIFO Rotation | Oldest-expiry batch is sold first |
| Controlled Substance | Item flagged per Egypt Law 182/1960 schedules; pre-tagged flags are irremovable |
| Dead Stock | Items unsold for a configurable period |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `CatalogItem` | definitions + multiple barcodes + `isControlledSubstance` / `controlledSubstanceClass` | Pre-tagged controlled flags cannot be removed; admin may add, never strip |
| `StockLevel` | per item per branch, batches with expiry, min-threshold | **Never below zero** — DB-level enforcement + concurrency-safe deduction |
| `PurchaseEntry` / `PurchaseReturn` | supplier stock-in / stock-out linked to original purchase | Return references its purchase |

## Domain Events (internal)

`StockReceived`, `BatchExpiring`, `ThresholdBreached`

## Integration Events

**Published:** `StockDeducted`, `LowStockDetected`, `ExpiryApproaching`, `DeadStockIdentified`.

**Consumed:** none — deduction arrives as a **synchronous command** (below), not an event.

## Published Language / OHS

- `DeductStock(saleId, lines)` / `RestoreStock(returnId, lines)` — the published interface Point of Sale calls in-process. Atomicity requirement (P007: no partial sales) makes this a sync command inside one local transaction; an async event cannot satisfy the exit criterion "stock cannot go negative under concurrent deductions" together with "atomic stock deduction on sale confirmation."
- Alert thresholds (30/60/90-day expiry, low-stock per item per branch) — read surface for dashboards (P008).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Point of Sale | upstream | C-S, sync command | POS calls `DeductStock`; Inventory alone owns the invariant; single SQLite transaction spans both schemas without table sharing (modular-monolith advantage) |
| Pharmacy | upstream | C-S | Dispensation consumes stock via the same published interface |
| Egypt Law 182/1960 schedules | downstream of external | ACL | Schedule import pipeline; pre-tagged data versioned |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P006 | Medication catalog + multi-barcode per medication (supplier/packaging variants); camera + USB scanning support |
| P006 | Expiry tracking with 30/60/90-day alerts; low-stock thresholds per item per branch; dead-stock identification |
| P006 | Stock never below zero (DB-level, concurrency-safe); FIFO rotation by oldest expiry |
| P006 | Purchase entry + purchase return (linked to original purchase) |
| P006 | Controlled-substance classification: Law 182/1960 pre-tagged (irremovable) + admin-taggable |
| P007 | `DeductStock`/`RestoreStock` published interface for POS (sanctioned sync command) |

Modules: .NET `Modules/Inventory`.

## Boundary Notes

- Barcode *scanning* (camera/USB) is client capability; barcode *identity* lives here.
- Sync conflicts (P009): last-write-wins by `UpdatedAt` for stock operations, with conflict warning on simultaneous edits — plumbing in SharedKernel, policy documented here.
