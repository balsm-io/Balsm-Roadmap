# Identity & Access — Validation Rules

## User Registration

| Field | Type | Required | Validation |
|---|---|---|---|
| username | string | Yes | Min 3, max 50 chars. Lowercase only + underscores only (no uppercase, no spaces, no special characters). Must be unique (case-insensitive). No leading/trailing underscores. No consecutive underscores. |
| email | string | Yes | Must be valid email format. Unique (case-insensitive). Max 254 chars. Store the original email as provided by the user. Additionally compute a normalized form for uniqueness checks only: (1) strip `+` and everything after it before `@`, (2) for Gmail/Google domains (`gmail.com`, `googlemail.com`), strip all dots from the local part, (3) lowercase. The original email is used for display and communication. The normalized form is used only for duplicate detection. |
| phoneNumber | string | No | Must be valid international format (E.164): `+` followed by country code and number, 7–15 digits total. Unique if provided. Stored in normalized E.164 format (digits only, no spaces/dashes). |
| firstName | string | Yes | Min 1, max 100 chars. Letters, spaces, hyphens, and apostrophes only. No leading/trailing whitespace. |
| lastName | string | Yes | Min 1, max 100 chars. Letters, spaces, hyphens, and apostrophes only. No leading/trailing whitespace. |
| password | string | Yes | Min 8 chars. At least one uppercase letter, one lowercase letter, one digit. No whitespace. |

## Login

| Field | Type | Required | Validation |
|---|---|---|---|
| identifier | string | Yes | Non-empty. Can be a username, email, or phone number. System auto-detects the type: contains `@` → email (normalize before lookup), starts with `+` or all digits → phone number, otherwise → username. |
| password | string | Yes | Non-empty. |

**Rules:**
- Return generic error `IDENTITY_INVALID_CREDENTIALS` — never reveal whether the identifier or password was wrong, or whether the account exists
- Lock account after 5 consecutive failed login attempts (unlock after 15 minutes)

## Session

| Field | Type | Validation |
|---|---|---|
| token | string | Generated server-side, UUID v4 |
| expiresAt | datetime | Set to now + 24 hours on creation. Extended on each authenticated request. |

**Rules:**
- Session expires after 24 hours of inactivity → `IDENTITY_SESSION_EXPIRED`
- Active POS session extends automatically (no timeout during active use)
- One user can have multiple active sessions (different devices)

## Permission Group

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 100 chars. Unique within entity (case-insensitive). |
| permissions | string[] | Yes | Non-empty array. Each permission must match format `resource:action` (e.g., `sale:create`, `stock:read`). No duplicates within the array. |

**Rules:**
- Cannot delete a permission group that is assigned to a team with active members
- Updating permissions on a group immediately affects all team members

## Team

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Yes | Min 2, max 100 chars. Unique within entity (case-insensitive). |
| entityId | UUID | Yes | Must reference an existing, active entity. |
| permissionGroupId | UUID | Yes | Must reference an existing permission group within the same entity. |

**Rules:**
- A user belongs to exactly one team per entity
- Adding a user who is already in another team within the same entity → must remove from old team first or reject

## Team Member

| Field | Type | Required | Validation |
|---|---|---|---|
| userId | UUID | Yes | Must reference an existing, active user. |
| teamId | UUID | Yes | Must reference an existing team. |

**Rules:**
- Entity owner cannot be removed from the entity → `IDENTITY_OWNER_IMMUTABLE`
- Entity owner cannot have their permissions reduced → `IDENTITY_OWNER_IMMUTABLE`
- Owner has implicit full permissions regardless of team assignment
- Cannot add the same user to a team twice

## Business Rule Validations

| Rule | Validation | Error |
|---|---|---|
| Unique username | Check case-insensitive uniqueness before insert | `IDENTITY_USERNAME_TAKEN` |
| Unique email | Normalize email (strip `+suffix`, strip dots for Gmail/Google domains, lowercase) then check uniqueness against normalized form | `IDENTITY_EMAIL_TAKEN` |
| Unique phone | Normalize phone (E.164 format, digits only) then check uniqueness | `IDENTITY_PHONE_TAKEN` |
| Password complexity | Validate on registration and password change | Return specific guidance on what's missing |
| Session expiry | Check `expiresAt` on every authenticated request | `IDENTITY_SESSION_EXPIRED` |
| Permission check | Check user's team permissions against required permission key | `IDENTITY_PERMISSION_DENIED` |
| Owner protection | Block any operation that removes owner or reduces owner permissions | `IDENTITY_OWNER_IMMUTABLE` |
