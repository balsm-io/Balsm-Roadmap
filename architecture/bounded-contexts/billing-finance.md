# Billing & Finance — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P015; P016 (subscription money movement) |
| **Repo mapping** | new .NET module at P015 (`Modules/Billing`) |
| **PHI posture** | Moderate: bills reference encounters/medications. PCI-DSS: card data tokenized, never stored raw. |

## Purpose

Money movement and care-episode billing: invoices per encounter/sale, patient payment flows (Apple Pay / Google Pay / cards), insurance policies and claims, VAT reporting. Counter-trade invoicing stays in Point of Sale; this context owns gateways, claims, and the financial ledger.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Invoice | A payable bill for an encounter or projected from a sale |
| Payment | A settled amount against an invoice via a payment method |
| Claim | An insurance-submitted portion of a bill |
| Policy | A patient's insurance coverage record (number, coverage type) |
| VAT Report | Periodic tax aggregation across POS + billing invoices |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Invoice` | line items, VAT, status | Generated per encounter/sale; PDF export with Arabic RTL (P015 exit criterion) |
| `Payment` | method, gateway token, amount | Card data tokenized only — raw storage forbidden |
| `InsurancePolicy` / `Claim` | policy metadata, claim lifecycle | Coverage applied to bill (P015) |

## Integration Events

**Consumed:** `EncounterFinalized` (billable), `SaleCompleted` / `SaleReturned` (VAT aggregation), `SubscriptionActivated` (Balsm Network → charge).

**Published:** `InvoicePaid`, `ClaimSubmitted`, `PaymentFailed`.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Point of Sale | downstream | events | POS owns counter trade; Billing aggregates for tax + processes card payments |
| Clinical Records | downstream | events | Encounter-based billing |
| Balsm Network | peer | C-S | Network owns subscription/entitlement state; Billing executes the charge |
| Payment gateways | downstream of external | **ACL** | Tokenization at the boundary; gateway schemas never leak inward |
| Insurance partners (P021) | downstream of external | ACL | Policy/claim integration |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P015 | Payment methods per user: Apple Pay, Google Pay, credit/debit cards — PCI-DSS tokenized, never raw |
| P015 | Invoice generation per encounter and sale; patient pay flow (view bill → method → pay) |
| P015 | Insurance-aware billing (policy number, coverage type); coverage applied to bill |
| P015 | PDF export of medical documents (Arabic RTL); basic template selection |
| P015 | VAT handling with filtering + reporting |
| P016 | Subscription charge execution (entitlement state lives in Balsm Network) |
| P021 | Insurance management expansion: policies, partnerships, claims |

Modules: .NET `Modules/Billing` (planned P015).

## Boundary Notes

- MR-10 pricing transparency: pharmacy pricing handled at P007 (POS), expanded here at P015.
- Document templating/PDF export is a rendering service used by many contexts; invoice *content* is owned here.
