# POS (Point of Sale) — Validation Rules

## Sale

| Field | Type | Required | Validation |
|---|---|---|---|
| branchId | UUID | Yes | Must reference an existing, active branch. Branch must not be deactivated. |
| customerId | UUID | No | If provided, must reference an existing customer within the same entity. |
| items | array | Yes | At least one SaleItem required → `POS_EMPTY_SALE` |
| paymentMethod | string | Yes | Must be one of: `cash`, `card`, `credit`. Allowed methods are configurable per entity. |
| taxRate | decimal | No | Defaults to entity-configured tax rate. Must be >= 0 and <= 100 (percentage). |
| discount | decimal | No | Must be >= 0. Cannot exceed the pre-tax subtotal. |
| notes | string | No | Max 500 chars. |
| cashierId | UUID | Yes | Must reference an existing user with POS permission in the branch. Auto-set from authenticated session. |

**Rules:**
- All items must have sufficient stock before the sale is committed — partial fulfillment is not allowed → `INVENTORY_STOCK_INSUFFICIENT`
- Completing a sale automatically reduces stock for each item → raises `SaleCompleted` event which triggers `StockReducedBySale`
- Sale is atomic — if any item fails stock validation, the entire sale is rejected (no items are deducted)
- Every completed sale generates a receipt
- Total = sum of (quantity * unitPrice) per item, minus discount, plus tax
- Tax amount = (subtotal - discount) * (taxRate / 100)
- Sale must be recorded within an active CashDrawerSession if cash drawer management is enabled for the branch

## SaleItem

| Field | Type | Required | Validation |
|---|---|---|---|
| medicationId | UUID | Yes | Must reference an existing, active medication with available stock in the branch. |
| quantity | integer | Yes | Must be > 0. Must be <= available stock for the medication in the branch. |
| unitPrice | decimal | Yes | Must be >= 0. Recorded at time of sale — price changes after the sale do not affect this record. |

**Rules:**
- Unit price is frozen at time of sale — it is a snapshot copied from the stock's sellingPrice, but the cashier can override it (e.g., for discounts)
- Same medication cannot appear twice in the same sale — combine into one line item with increased quantity
- Each SaleItem reduces the corresponding stock by quantity upon sale completion

## SaleReturn

| Field | Type | Required | Validation |
|---|---|---|---|
| saleId | UUID | Yes | Must reference an existing, completed sale. |
| returnDate | date | Yes | Cannot be in the future. Must be on or after the original sale date. |
| reason | string | No | Max 500 chars. |
| items | array | Yes | At least one SaleReturnItem required → `POS_EMPTY_RETURN` |
| cashierId | UUID | Yes | Auto-set from authenticated session. |

**Rules:**
- Sale return restores stock and links back to the original sale → raises `SaleReturnCompleted` event which triggers stock restoration
- Sale return does not modify the original sale or its invoice — it creates a separate transaction
- Multiple partial returns are allowed for the same sale
- Sale return creates a refund record (cash refund, card reversal, or credit adjustment based on original payment method)

## SaleReturnItem

| Field | Type | Required | Validation |
|---|---|---|---|
| saleItemId | UUID | Yes | Must reference an existing sale item within the linked sale. |
| quantity | integer | Yes | Must be > 0. Must be <= remaining unreturned quantity for that sale item. |

**Rules:**
- Returned quantity per item is tracked cumulatively across all returns for a sale
- Total returned quantity across all returns for a sale item must not exceed the original sold quantity → `POS_RETURN_EXCEEDS_SALE`
- Each returned item increases stock by the returned quantity

## SaleAttachment

| Field | Type | Required | Validation |
|---|---|---|---|
| saleId | UUID | Yes | Must reference an existing sale. |
| fileType | string | Yes | Must be one of: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`. |
| fileSize | long | Yes | Must be > 0 and <= 10MB (10,485,760 bytes). |
| fileName | string | Yes | Max 255 chars. Must not contain path separators or null bytes. |
| description | string | No | Max 200 chars. E.g., "Paper prescription scan". |

**Rules:**
- Attachments are immutable once uploaded — they can be deleted but not modified
- A sale can have multiple attachments (e.g., prescription photo + ID photo)
- Files must be scanned for malware before storage
- Attachments are stored with the sale audit trail for compliance

## Invoice

| Field | Type | Required | Validation |
|---|---|---|---|
| saleId | UUID | Yes | Must reference an existing, completed sale. One invoice per sale. |
| invoiceNumber | string | Yes | Auto-generated. Sequential per branch (e.g., `INV-001-0001`). |
| issuedAt | datetime | Yes | Auto-set to sale completion time. |
| subtotal | decimal | Yes | Auto-calculated from sale items. |
| discount | decimal | Yes | Copied from sale. |
| taxAmount | decimal | Yes | Auto-calculated. |
| total | decimal | Yes | Auto-calculated: subtotal - discount + taxAmount. |

**Rules:**
- Invoices are immutable once generated → `POS_INVOICE_IMMUTABLE`
- Corrections are handled through sale returns, not by modifying the invoice
- Invoice number is unique and sequential per branch — no gaps allowed in normal operation
- Invoice must include: entity name, branch name, items with quantities and prices, tax breakdown, payment method, date/time, cashier name

## CashDrawerSession

| Field | Type | Required | Validation |
|---|---|---|---|
| branchId | UUID | Yes | Must reference an existing, active branch. |
| cashierId | UUID | Yes | Must reference an existing user with POS permission. |
| openingBalance | decimal | Yes | Must be >= 0. Cash counted at start of session. |
| closingBalance | decimal | No | Must be >= 0 if provided. Cash counted at end of session. Set when session is closed. |
| openedAt | datetime | Yes | Auto-set on session creation. |
| closedAt | datetime | No | Auto-set when session is closed. |
| notes | string | No | Max 500 chars. End-of-day notes or discrepancy explanations. |

**Rules:**
- Only one active (unclosed) cash drawer session per branch at a time → `POS_DRAWER_ALREADY_OPEN`
- A session must be open before processing cash sales in the branch (card/credit sales may bypass this based on entity config)
- Expected cash = openingBalance + cash sales - cash refunds during the session
- Discrepancy = closingBalance - expected cash (positive = overage, negative = shortage)
- Cash drawer sessions cannot be reopened after closing — start a new session instead
- End-of-day summary is derived from the session: total sales, total returns, payment breakdown by method, expected vs. actual cash

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Non-empty sale | Sale must contain at least one item | `POS_EMPTY_SALE` |
| Non-empty return | Sale return must contain at least one item | `POS_EMPTY_RETURN` |
| Sufficient stock | All sale items must have sufficient stock before committing | `INVENTORY_STOCK_INSUFFICIENT` |
| Invoice immutability | Reject any modification to a generated invoice | `POS_INVOICE_IMMUTABLE` |
| Return quantity limit | Return quantity must not exceed sold quantity per item | `POS_RETURN_EXCEEDS_SALE` |
| Unique invoice number | Invoice number must be unique per branch | `POS_INVOICE_NUMBER_DUPLICATE` |
| Single open drawer | Only one active cash drawer session per branch | `POS_DRAWER_ALREADY_OPEN` |
| Active branch required | Sales and drawer sessions require an active (not deactivated) branch | `ENTITY_BRANCH_DEACTIVATED` |
| Valid payment method | Payment method must be in the entity's allowed list | `POS_INVALID_PAYMENT_METHOD` |
| Sale atomicity | If any item fails validation, entire sale is rejected — no partial deduction | Validation error on the failing item |
