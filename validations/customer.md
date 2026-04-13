# Customer Profiles — Validation Rules

## Customer

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. Letters, spaces, hyphens, and apostrophes only. No leading/trailing whitespace. |
| phones | string[] | No | Each entry must be valid E.164 format (`+` followed by country code and number, 7-15 digits total). Stored in normalized format (digits only, no spaces/dashes). No duplicate entries within the same customer. |
| emails | string[] | No | Each entry must be valid email format. No duplicate entries within the same customer. |
| nationalId | string | No | Max 30 chars. Alphanumeric only. |
| dateOfBirth | date | No | Cannot be in the future. Cannot be more than 150 years in the past. |
| gender | string | No | Must be one of: `male`, `female`, `prefer_not_say`. |
| address | string | No | Max 500 chars. Freeform text. |
| notes | string | No | Max 1000 chars. Internal pharmacy notes (e.g., "allergic to penicillin"). |
| entityId | UUID | Yes | Must reference an existing, active entity. Customer is scoped to the entity. |
| patientId | UUID | No | Optional link to a Balsm Network patient account. Set when the customer claims their account or is matched during network sync. |
| isDependent | bool | No | Defaults to `false`. Set to `true` when the account is created as a dependent (minor under 18). |
| isActive | bool | No | Defaults to `true`. |

**Rules:**
- Customer is optional on a sale — walk-in sales without customer records are allowed
- Each phone number, if provided, must be unique within the entity (case-insensitive, normalized E.164) → `CUSTOMER_PHONE_DUPLICATE`
- National ID, if provided, must be unique within the entity → `CUSTOMER_NATIONAL_ID_DUPLICATE`
- Customer profile includes derived data: purchase history (from sales) and prescription records (from PrescriptionRecord)
- Customer is local to the pharmacy in offline mode — no network access required
- When connecting to Balsm Network, an existing customer can be linked to a patient account by matching phone, email, or national ID — existing data is preserved
- Deactivating a customer does not affect historical sales or prescription records

---

## Dependent Accounts (Minors)

### CustomerGuardian

| Field | Type | Required | Validation |
|---|---|---|---|
| dependentId | UUID | Yes | Must reference an existing, active customer with `isDependent = true`. |
| guardianId | UUID | Yes | Must reference an existing, active customer in the same entity. Must be 18 or older. |
| isPrimary | bool | No | Defaults to `false`. Exactly one guardian per dependent must be marked as primary. The customer who created the dependent account is the primary guardian. |
| isActive | bool | No | Defaults to `true`. |

**Rules:**
- A customer (parent/guardian) can create dependent accounts for children under 18 years old
- A dependent can have **multiple guardians** — each linked via a CustomerGuardian record
- The customer who creates the dependent account becomes the **primary guardian**
- All guardians have full control over the dependent account: can view, edit, and manage purchases and prescriptions
- Only the primary guardian can add or remove other guardians
- `dateOfBirth` is required when creating a dependent account — must confirm the child is under 18
- When a dependent turns 18, they gain the ability to remove guardians themselves — `isDependent` is cleared and the user gains full control
- Turning 18 does **not** automatically deactivate CustomerGuardian records — the user must explicitly remove guardians if desired
- Family relationships (FamilyMember records) are **not affected** when a dependent turns 18 or removes guardians
- A guardian can voluntarily release control of a dependent account early
- A dependent account cannot be a guardian of another account → `DEPENDENT_CANNOT_BE_GUARDIAN`
- A dependent must have at least one active guardian at all times → `DEPENDENT_NO_GUARDIAN`
- Deactivating a guardian does not deactivate their dependents — if no other guardians remain, the dependent becomes independent

| Rule | Validation | Error |
|---|---|---|
| Dependent must be under 18 | dateOfBirth is required and must indicate age < 18 at time of creation | `DEPENDENT_AGE_INVALID` |
| Guardian must be an adult | Guardian's dateOfBirth must indicate age >= 18 | `GUARDIAN_AGE_INVALID` |
| Dependent cannot be guardian | A customer with `isDependent = true` cannot create dependent accounts | `DEPENDENT_CANNOT_BE_GUARDIAN` |
| Guardian must exist | guardianId must reference an existing, active customer in the same entity | `GUARDIAN_NOT_FOUND` |
| Duplicate guardian | Same guardian cannot be linked to the same dependent twice | `GUARDIAN_DUPLICATE` |
| Must have primary guardian | Exactly one guardian per dependent must be marked as primary | `GUARDIAN_PRIMARY_REQUIRED` |
| At least one guardian | A dependent must have at least one active guardian | `DEPENDENT_NO_GUARDIAN` |
| Only primary can manage guardians | Only the primary guardian can add or remove other guardians | `GUARDIAN_PERMISSION_DENIED` |

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Unique phone per entity | Normalize each phone (E.164) then check uniqueness across all customers within entity | `CUSTOMER_PHONE_DUPLICATE` |
| Unique national ID per entity | Check case-insensitive uniqueness within entity | `CUSTOMER_NATIONAL_ID_DUPLICATE` |
| Customer must exist (when referenced) | Validate customerId references an active customer | `CUSTOMER_NOT_FOUND` |
| Valid entity reference | Customer's entityId must reference an active entity | `ENTITY_NOT_FOUND` |

---

## Family

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. No leading/trailing whitespace. |
| createdBy | UUID | Yes | Must reference an existing, active customer. The customer who created the family becomes the family owner. |
| entityId | UUID | Yes | Must reference an existing, active entity. Family is scoped to the entity. |
| isActive | bool | No | Defaults to `true`. |

**Rules:**
- A customer can create multiple families
- A customer can belong to multiple families
- Only the family owner can add or remove members
- Deactivating a family does not affect member customer records or their historical data

## Family Member

| Field | Type | Required | Validation |
|---|---|---|---|
| familyId | UUID | Yes | Must reference an existing, active family. |
| customerId | UUID | Yes | Must reference an existing, active customer within the same entity. |
| relationship | string | Yes | Must be one of: `spouse`, `child`, `parent`, `sibling`, `grandparent`, `grandchild`, `relative`, `guardian`, `other`. |
| isActive | bool | No | Defaults to `true`. |

**Rules:**
- The family owner is automatically a member with relationship `self` (implicit, not stored as a FamilyMember record)
- A customer cannot be added to the same family twice → `FAMILY_MEMBER_DUPLICATE`
- Relationship describes the member's relation to the family owner
- Removing a member from a family does not affect their customer record

## Family Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Unique member per family | Check that customerId is not already an active member of the family | `FAMILY_MEMBER_DUPLICATE` |
| Family must exist (when referenced) | Validate familyId references an active family | `FAMILY_NOT_FOUND` |
| Only owner can manage members | Verify the requesting customer is the family owner | `FAMILY_PERMISSION_DENIED` |
| Same entity scope | Family and all its members must belong to the same entity | `FAMILY_ENTITY_MISMATCH` |

---

## Account Delegation

### CustomerDelegation

| Field | Type | Required | Validation |
|---|---|---|---|
| ownerId | UUID | Yes | The customer granting delegation. Must reference an existing, active customer. |
| delegateId | UUID | Yes | The customer receiving delegation. Must reference an existing, active customer in the same entity. Cannot be the same as ownerId. |
| permissions | string[] | Yes | At least one permission required. Must be a subset of: `view_profile`, `edit_profile`, `view_purchases`, `make_purchases`, `view_prescriptions`, `manage_prescriptions`, `book_appointments`, `manage_appointments`. |
| expiresAt | datetime | No | If provided, must be in the future. Delegation is automatically deactivated after expiry. |
| isActive | bool | No | Defaults to `true`. |

**Rules:**
- A customer can delegate account management to one or more other customers
- The owner controls which permissions the delegate receives — delegation is **not** full access by default
- The owner can revoke delegation at any time
- The delegate can voluntarily give up delegation
- A dependent account cannot delegate to others → `DEPENDENT_CANNOT_DELEGATE`
- A delegation does not transfer ownership — the owner retains full control
- Delegations are scoped to the same entity
- Expired delegations are treated as inactive
- Every action performed by a delegate or guardian on behalf of the account owner must record `performedBy` (the acting user) and `onBehalfOf` (the account owner) for audit attribution — this applies to all operations: bookings, purchases, prescription actions, and profile edits

| Rule | Validation | Error |
|---|---|---|
| Cannot self-delegate | ownerId and delegateId must be different | `DELEGATION_SELF_REFERENCE` |
| Duplicate delegation | Same owner-delegate pair cannot have multiple active delegations | `DELEGATION_DUPLICATE` |
| Dependent cannot delegate | A customer with `isDependent = true` cannot create delegations | `DEPENDENT_CANNOT_DELEGATE` |
| Owner must exist | ownerId must reference an existing, active customer | `DELEGATION_OWNER_NOT_FOUND` |
| Delegate must exist | delegateId must reference an existing, active customer in the same entity | `DELEGATION_DELEGATE_NOT_FOUND` |
| Valid permissions | permissions must be a non-empty subset of allowed values | `DELEGATION_INVALID_PERMISSIONS` |
| Expiry in future | expiresAt, if provided, must be in the future | `DELEGATION_EXPIRY_INVALID` |
