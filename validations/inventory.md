# Inventory — Validation Rules

## Medication

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. No leading/trailing whitespace. |
| genericName | string | No | Max 200 chars. International Nonproprietary Name (INN) if applicable. |
| form | string | Yes | Must be one of: `tablet`, `capsule`, `syrup`, `injection`, `cream`, `ointment`, `drops`, `inhaler`, `suppository`, `patch`, `powder`, `solution`, `suspension`, `gel`, `spray`, `other`. |
| strength | string | No | Max 50 chars. Freeform (e.g., "500mg", "250mg/5ml"). |
| category | string | No | Max 100 chars. Entity-defined categories (e.g., "Antibiotics", "Pain Relief"). |
| manufacturer | string | No | Max 200 chars. |
| description | string | No | Max 1000 chars. |
| requiresPrescription | bool | No | Defaults to `false`. |
| isActive | bool | No | Defaults to `true`. Inactive medications cannot be added to new sales or purchase entries. |
| entityId | UUID | Yes | Must reference an existing, active entity. Medication is scoped to the entity that created it. |

**Rules:**
- Medication name must be unique within an entity (case-insensitive) → `INVENTORY_MEDICATION_NAME_DUPLICATE`
- Deactivating a medication does not affect existing stock, historical sales, or purchase records
- A medication can exist without any barcodes — barcode is optional for manual entry workflows

## MedicationBarcode

| Field | Type | Required | Validation |
|---|---|---|---|
| barcode | string | Yes | Min 4, max 50 chars. Alphanumeric, hyphens, and dots only (to support EAN-13, UPC-A, Code 128, and custom barcodes). |
| medicationId | UUID | Yes | Must reference an existing medication within the same entity. |

**Rules:**
- Barcode must be globally unique across all medications within the entity → `INVENTORY_BARCODE_DUPLICATE`
- A medication can have multiple barcodes (different suppliers, different packaging sizes) — barcode-to-medication is many-to-one
- Deleting a barcode does not affect the medication or its stock
- Barcode lookup (`GET /medications/barcode/{barcode}`) returns the full medication with stock info

## Stock

| Field | Type | Required | Validation |
|---|---|---|---|
| medicationId | UUID | Yes | Must reference an existing medication. |
| branchId | UUID | Yes | Must reference an existing, active branch within the same entity. |
| quantity | integer | Yes | Must be >= 0. Cannot go below zero — sale is rejected if insufficient. |
| batchNumber | string | No | Max 100 chars. Freeform supplier batch identifier. |
| expirationDate | date | No | If provided, must be a future date at time of stock receipt. Items without expiration (e.g., medical devices) are not flagged for expiry. |
| minimumStock | integer | No | Defaults to 0. When quantity falls below this threshold, `StockLevelLow` event is raised. |
| costPrice | decimal | No | Must be >= 0 if provided. Cost paid to supplier per unit. |
| sellingPrice | decimal | No | Must be >= 0 if provided. Retail price per unit. |

**Rules:**
- Stock is tracked per medication per branch — the combination (medicationId, branchId, batchNumber) is unique
- Stock quantity cannot go below zero → `INVENTORY_STOCK_INSUFFICIENT`
- When quantity <= minimumStock, raise `StockLevelLow` domain event (triggers dashboard alert)
- When expirationDate is within 30 days (configurable), raise `StockExpiringSoon` domain event
- Deactivating a branch freezes all stock operations for that branch
- Stock is increased by purchase entries and sale returns
- Stock is decreased by sales and purchase returns

## Supplier

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. No leading/trailing whitespace. |
| contactName | string | No | Max 150 chars. Primary contact person. |
| phone | string | No | Must be valid E.164 format if provided. |
| email | string | No | Must be valid email format if provided. Max 254 chars. |
| address | string | No | Max 500 chars. Freeform text. |
| entityId | UUID | Yes | Must reference an existing, active entity. Supplier is scoped to the entity. |
| isActive | bool | No | Defaults to `true`. Inactive suppliers cannot be used in new purchase entries. |

**Rules:**
- Supplier name must be unique within an entity (case-insensitive) → `INVENTORY_SUPPLIER_NAME_DUPLICATE`
- Deactivating a supplier does not affect existing purchase entries or stock

## PurchaseEntry

| Field | Type | Required | Validation |
|---|---|---|---|
| supplierId | UUID | Yes | Must reference an existing, active supplier within the same entity. |
| branchId | UUID | Yes | Must reference an existing, active branch within the same entity. |
| invoiceNumber | string | No | Max 100 chars. Supplier's invoice/reference number. |
| purchaseDate | date | Yes | Cannot be in the future. |
| notes | string | No | Max 1000 chars. |
| items | array | Yes | At least one PurchaseItem required → `INVENTORY_EMPTY_PURCHASE` |

**Rules:**
- Recording a purchase entry automatically increases stock for each item → raises `StockReceived` event
- Purchase entry is immutable after recording — corrections are handled through purchase returns
- Total cost is calculated from items (sum of quantity * costPrice per item)

## PurchaseItem

| Field | Type | Required | Validation |
|---|---|---|---|
| medicationId | UUID | Yes | Must reference an existing medication within the same entity. |
| quantity | integer | Yes | Must be > 0. |
| costPrice | decimal | Yes | Must be >= 0. Cost per unit from supplier. |
| expirationDate | date | No | If provided, must be a future date. |
| batchNumber | string | No | Max 100 chars. |

**Rules:**
- Each item in a purchase entry increases stock by the specified quantity
- If the medication + branch + batchNumber stock record already exists, quantity is added to it
- If no stock record exists for the combination, a new stock record is created

## PurchaseReturn

| Field | Type | Required | Validation |
|---|---|---|---|
| purchaseEntryId | UUID | Yes | Must reference an existing purchase entry. |
| returnDate | date | Yes | Cannot be in the future. Must be on or after the original purchase date. |
| reason | string | No | Max 500 chars. |
| items | array | Yes | At least one PurchaseReturnItem required. |

**Rules:**
- Purchase return reduces stock and links back to the original purchase entry → raises `StockReturnedToSupplier` event
- Cannot return more quantity than was originally purchased for each item
- Purchase return does not modify the original purchase entry — it creates a separate audit-trailed record

## PurchaseReturnItem

| Field | Type | Required | Validation |
|---|---|---|---|
| purchaseItemId | UUID | Yes | Must reference an existing purchase item within the linked purchase entry. |
| quantity | integer | Yes | Must be > 0. Must be <= remaining unreturned quantity for that item. |

**Rules:**
- Returned quantity per item is tracked cumulatively — multiple partial returns are allowed
- Total returned quantity across all returns for a purchase item must not exceed the original purchased quantity → `INVENTORY_RETURN_EXCEEDS_PURCHASE`

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Unique medication name per entity | Check case-insensitive uniqueness before insert | `INVENTORY_MEDICATION_NAME_DUPLICATE` |
| Unique barcode per entity | Check barcode uniqueness across all medications within entity | `INVENTORY_BARCODE_DUPLICATE` |
| Stock cannot go negative | Check stock >= sale quantity before completing sale | `INVENTORY_STOCK_INSUFFICIENT` |
| Medication must exist | Validate medicationId references an active medication | `INVENTORY_MEDICATION_NOT_FOUND` |
| Non-empty purchase | Purchase entry must contain at least one item | `INVENTORY_EMPTY_PURCHASE` |
| Return quantity limit | Return quantity must not exceed purchased quantity | `INVENTORY_RETURN_EXCEEDS_PURCHASE` |
| Unique supplier name per entity | Check case-insensitive uniqueness before insert | `INVENTORY_SUPPLIER_NAME_DUPLICATE` |
| Low stock alert | Raise event when stock quantity <= minimumStock threshold | Domain event (not error) |
| Expiring soon alert | Raise event when stock expiration is within configurable window | Domain event (not error) |
| Branch stock freeze | Block stock operations when branch is deactivated | `ENTITY_BRANCH_DEACTIVATED` |
