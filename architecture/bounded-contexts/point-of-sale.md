# Point of Sale — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting — highest-impact standalone deliverable (P007 impact 5/5), but well-understood retail patterns |
| **Phases** | P007 |
| **Repo mapping** | `Balsm-API-DotNet`: `Modules/POS` (shell today) |
| **PHI posture** | Low. Sales data; optional paper-prescription photo attached to a sale is handled as an opaque document. |

## Purpose

Counter trade: basket → sale → payment → receipt, plus cash-drawer discipline and end-of-day reconciliation. Distinct from Pharmacy (dispensation correctness) and from Billing & Finance (care-episode billing, claims, money movement) — none of those models a cash drawer; POS models nothing about clinical validity.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Sale | A completed walk-in transaction; generates an immutable invoice |
| Basket | The in-progress line-item collection before confirmation |
| Sale Return | The only correction mechanism — restores stock, links to the original sale |
| Cash Drawer Session | Opening balance → mid-day counts → closing balance |
| Reconciliation | Expected vs actual cash at end of day, discrepancies flagged |
| Receipt | Digital or printed proof with QR link to the sale record |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Sale` | lines (item, qty, price snapshot), VAT (14% configurable), payment method, invoice | **Immutable once completed** — corrections only via `SaleReturn`; atomic stock deduction, no partial sales |
| `SaleReturn` | lines, link to original sale | Restores stock through Inventory's published interface |
| `CashDrawerSession` | open/counts/close, per device/branch | Reconciliation computed, never edited |
| `Receipt` | render model, QR token | QR resolves to the sale record |

## Domain Events (internal)

`BasketItemAdded`, `ControlledSubstanceWarningRaised`, `DrawerOpened`, `DrawerClosed`

## Integration Events

**Published:** `SaleCompleted` (optional `customerId` → Customer Relations; invoice snapshot → Billing & Finance VAT reporting), `SaleReturned`.

**Consumed:** dispensation verdicts from Pharmacy during checkout (partnership, below).

## Boundary Decision — atomic deduction across contexts

P007 requires *atomic stock deduction on sale confirmation* and *stock never negative under concurrency*. Resolution: POS calls Inventory's published `DeductStock(saleId, lines)` **in-process, inside one local SQLite transaction**. Two schemas, one transaction, zero shared tables — the modular monolith's legitimate advantage. If contexts ever deploy separately, this seam becomes a reservation saga; the interface already isolates that change.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Inventory | downstream | C-S, sync command | `DeductStock` / `RestoreStock`; Inventory owns the invariant |
| Pharmacy | peer | **Partnership** | Controlled-substance and prescription-QR checkout: Pharmacy validates dispensation (pharmacist-only completion, prescription requirement per DR-02, blocked statuses); POS owns basket/payment/receipt. Two models, one counter interaction |
| Customer Relations | upstream | events | `SaleCompleted` builds purchase history |
| Billing & Finance | upstream | events | Invoice snapshots feed VAT reporting; Billing owns gateways/claims |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P007 | Walk-in sale: search/scan → basket → confirm → payment → receipt in <60 s; atomic stock deduction, no partial sales |
| P007 | Immutable invoices; sale returns restore stock + link to original |
| P007 | Payment methods: cash, card, credit-on-account (per-entity config); VAT 14% configurable |
| P007 | Cash drawer: opening balance, mid-day counts, closing; end-of-day reconciliation (expected vs actual, discrepancies flagged) |
| P007 | Receipts: digital/printed, QR link to sale record; thermal printing (USB/Bluetooth) across platforms |
| P007 | Controlled-substance checkout: warning banner, pharmacist-only completion, prescription attachment (default required per DR-02) |
| P007 | Paper prescription photo attachment on sale |
| P013 | Prescription-QR dispensing woven into checkout (with Pharmacy) |

Modules: .NET `Modules/POS`.

## Boundary Notes

- Payment methods (cash/card/credit-on-account) are POS configuration at P007; tokenized gateway processing arrives with Billing & Finance (P015).
- Receipt printing (thermal, USB/Bluetooth) is client/platform capability; receipt *content* is this context's render model.
- Paper prescription photo attached to a sale is an opaque attachment here — it becomes structured data only in Customer Relations (manual recording) or Prescriptions (digital, P013).
