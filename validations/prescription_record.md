# Prescription Record — Validation Rules

## PrescriptionRecord

| Field | Type | Required | Validation |
|---|---|---|---|
| customerId | UUID | Yes | Must reference an existing customer within the same entity → `PRESCRIPTION_CUSTOMER_REQUIRED` |
| doctorName | string | Yes | Min 2, max 200 chars. No leading/trailing whitespace. |
| medication | string | Yes | Min 1, max 500 chars. Freeform text describing prescribed medication(s). Phase 1 is manual text entry only. |
| dosage | string | No | Max 200 chars. Freeform text (e.g., "500mg twice daily for 7 days"). |
| prescriptionDate | date | Yes | Cannot be in the future. |
| notes | string | No | Max 1000 chars. Additional instructions or observations. |
| saleId | UUID | No | Optional link to the sale where this prescription was dispensed. If provided, must reference an existing sale within the same entity. |
| branchId | UUID | Yes | Must reference an existing branch within the same entity. The branch where the prescription was recorded. |
| recordedBy | UUID | Yes | Must reference an existing user with prescription recording permission. Auto-set from authenticated session. |

**Rules:**
- Every prescription must be linked to a customer → `PRESCRIPTION_CUSTOMER_REQUIRED`
- Phase 1 prescriptions are manual text entries — the pharmacist types the doctor name, medication, and dosage from a paper prescription
- A prescription can optionally be linked to a sale (the dispensing transaction) — this link is informational and does not affect stock or sale logic
- Prescription records are immutable after creation — corrections require creating a new record with a note referencing the original
- Prescriptions are queryable by customer (full prescription history) and by date range
- Prescription records participate in sync — they are included in the sync outbox and respect entity data sharing controls
- Phase 2 will introduce verified digital prescriptions from the doctor app — Phase 1 records will be preserved as-is and tagged as "manual entry"
- Phase 2 digital prescriptions follow the lifecycle `draft` → `issued` → (`cancelled` | `superseded` | `dispensed` | `expired`) — drafts are editable, issued prescriptions are immutable (see BUSINESS_FEATURES.md section 5.5 for full rules)

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Customer required | prescriptionRecord must have a valid customerId | `PRESCRIPTION_CUSTOMER_REQUIRED` |
| Customer must exist | customerId must reference an existing, active customer within the same entity | `CUSTOMER_NOT_FOUND` |
| Valid branch | branchId must reference an existing, active branch within the same entity | `ENTITY_BRANCH_NOT_FOUND` |
| Valid sale reference | If saleId is provided, it must reference an existing sale within the same entity | `POS_SALE_NOT_FOUND` |
| Immutability | Reject updates to existing prescription records | `PRESCRIPTION_IMMUTABLE` |
| Dispensing blocked | Pharmacy cannot dispense a prescription with status `cancelled`, `superseded`, or `expired` | `PRESCRIPTION_NOT_DISPENSABLE` |
