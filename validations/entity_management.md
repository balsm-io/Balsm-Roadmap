# Entity Management — Validation Rules

## Entity

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. No leading/trailing whitespace. |
| entityType | enum | Yes | Must be `pharmacy` (only supported type in Phase 1). |
| ownerId | UUID | Yes | Must reference an existing, active user. Auto-set to the creating user. |

**Rules:**
- Every entity must have exactly one owner at all times
- Ownership transfer is atomic — old owner loses ownership when new owner gains it
- The creating user automatically becomes the owner and gets full permissions
- A default branch is auto-created when an entity is created
- Entity cannot be deleted if it has active branches with stock or pending sales

## Branch

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 200 chars. Unique within entity (case-insensitive). No leading/trailing whitespace. |
| entityId | UUID | Yes | Must reference an existing, active entity. |
| address | string | No | Max 500 chars. |
| phone | string | No | Valid phone format if provided. Max 20 chars. |

**Rules:**
- Branch names must be unique within an entity → `ENTITY_BRANCH_NAME_DUPLICATE`
- Deactivating a branch:
  - Active sales in-progress must complete first (reject deactivation if sales are in-progress)
  - Stock entries are frozen (no new sales or purchase entries against this branch)
  - POS is disabled for this branch
  - Triggers `BranchDeactivated` event
- A deactivated branch can be reactivated
- The default branch (auto-created with entity) cannot be deactivated if it's the only branch
- Cannot delete a branch — only deactivate

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Single owner | Exactly one ownerId per entity, always set | Domain validation |
| Ownership transfer | Old owner loses ownership atomically when new owner is set | Domain validation |
| Branch name uniqueness | Case-insensitive unique constraint within entityId | `ENTITY_BRANCH_NAME_DUPLICATE` |
| Deactivation guard | Check no in-progress sales before deactivating | Custom error |
| Entity exists | Any reference to entityId must point to an existing entity | `ENTITY_NOT_FOUND` |
