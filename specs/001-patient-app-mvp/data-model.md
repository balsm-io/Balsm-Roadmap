# Phase 1 Data Model — Patient App MVP (P001)

Two storage planes — strictly separate.

- **Cloud plane (PostgreSQL 16, EF Core 10 + Npgsql, single EU region)** — non-PHI only per ADR-10 + Q2 resolution. **Application-layer authorization** via ASP.NET Core policies (not PostgreSQL RLS — removed 2026-06-17 pivot, research §28). Email is the recovery identifier.
- **On-device plane (SQLite via drift, SQLCipher-encrypted)** — all PHI. UUID v7 primary keys across every PHI table per Q4 resolution + ADR-12. Append-only triggers on `medication_dose_event`.

Cross-references use `[[name]]` style for related tables in the same plane; cross-plane links are described in prose.

---

## 1. Cloud plane (Supabase Postgres — non-PHI)

### 1.1 `public.user_identities` *(replaces Supabase-managed `auth.users` — 2026-06-17 pivot)*

Custom-managed by `Balsm.Modules.Auth`. Three providers per FR-001: `email` (OTP), `google` (OIDC), `apple` (OIDC). Phone provider **disabled**.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Identity row id. |
| `user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | Links to account aggregate. |
| `provider` | text | NOT NULL CHECK (provider IN ('email','google','apple')) | |
| `provider_subject` | text | NOT NULL | OAuth `sub` for Google/Apple; lowercased email for email provider. |
| `email_normalized` | citext | NULLABLE | Populated for `email` + `google` providers; Apple `hide-my-email` relay accepted verbatim. |
| `email_confirmed_at` | timestamptz | NULLABLE | Set on first successful OTP verify or OIDC email-verified claim. |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |

**Unique constraints**: `UNIQUE(provider, provider_subject)` — prevents duplicate identities; `UNIQUE(email_normalized) WHERE provider = 'email'` — one email account.

**Replaces**: `auth.users.id` FK — `public.user_account.id` is now a generated UUID with no dependency on a managed auth table. `raw_app_meta_data.provider` → `user_identities.provider`. `raw_user_meta_data.country_code_at_signup` → captured in `user_account.country_code` at signup.

**JWT sessions** (replaces Supabase sessions): `public.user_refresh_token (id uuid PK, user_id uuid FK, token_hash text NOT NULL, device_id uuid NOT NULL, expires_at timestamptz NOT NULL, revoked_at timestamptz)` — issued by `Balsm.Infrastructure.Auth.JwtService`; 30-day expiry; revoked on sign-out or session-revoke.

### 1.2 `public.user_account`

Spec entities: **User Account (cloud, non-PHI)** + global-account invariants from FR-300…FR-305.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Generated UUID; no FK to managed auth table (2026-06-17 pivot). Referenced by `user_identities.user_id`. |
| `handle` | citext | UNIQUE, NULLABLE | FR-002 — 3–30 chars, `[a-z0-9_.]`, case-insensitive, country-agnostic. NULL until post-signup claim. |
| `display_name` | text | NULLABLE | FR-006. |
| `bio` | text | NULLABLE | FR-006. |
| `date_of_birth_ciphertext` | bytea | NULLABLE | **PHI** per 2026-06-15 Path-ii clarification. Field-level encrypted via **AES-256-GCM in .NET application layer** (`DobEncryptionService`; key from `DOB_ENCRYPTION_KEY` env var, rotated annually); replaces pgcrypto pgp_sym per research §30. Decrypted on demand by .NET endpoints (`POST /auth/otp/verify` age-gate, `GET /account/self`); NEVER appears as plaintext in DB logs, replication, or backups. Captured lazily on first age-gated action. |
| `country_code` | char(2) | NOT NULL | FR-202 — ISO 3166-1 alpha-2; per-user **attribute**, not partition. |
| `preferred_language` | text | NOT NULL | FR-205 — BCP 47 tag (`ar-EG`, `ar-SA`, `ar-AE`, `en` first-class; any other valid BCP 47 → falls back to `en` if not in catalog). |
| `deletion_state` | text | NOT NULL DEFAULT 'ACTIVE', CHECK (deletion_state IN ('ACTIVE','DELETION_REQUESTED','DELETION_CANCELLED')) | Research §12 FSM. |
| `deletion_confirmed_at` | timestamptz | NULLABLE | Set when entering DELETION_REQUESTED; anchor for FR-046 14-day absolute ceiling. |
| `deletion_grace_until` | timestamptz | NULLABLE | Set when entering DELETION_REQUESTED; cron purges when now() > value. May be shifted forward by FR-046 lockout-pause logic, capped at `deletion_confirmed_at + 14 days`. |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | Trigger refreshes on every UPDATE. |

**Uniqueness invariants enforced by RLS + DB constraints (FR-300, FR-302, SC-300)**:
- Email uniqueness via `auth.users.email` (Supabase native).
- Apple `sub` + Google `sub` uniqueness via partial unique indexes on `auth.identities` (Supabase native).
- Handle uniqueness: `UNIQUE (lower(handle))` enforced by `citext`.

**RLS** (FR-303 + FR-304):
- SELECT: a user can read their own row at any time (including during DELETION_REQUESTED → only the cancel-deletion path is allowed; the client UI never reads any other row).
- UPDATE: a user can update their own row only when `deletion_state = 'ACTIVE'` AND only the columns whitelisted for self-edit (handle, display_name, bio, country_code, preferred_language, date_of_birth_ciphertext). `date_of_birth_ciphertext` writes go through Edge Function `set-dob` which re-encrypts with the current key; direct UPDATE from the client is blocked.
- DELETE: forbidden (deletion goes through the FSM, not raw DELETE).
- Public emergency-page lookup: no row read; emergency QR resolution uses the signed token's `uid` to JOIN `emergency_qr_token` → `user_account` only via Edge Function service-role.

### 1.3 `public.active_session`

Spec entity: **Active Session** (FR-004 + US5).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | |
| `user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | |
| `device_id` | uuid | NOT NULL | Client-generated at first launch; persisted in flutter_secure_storage. |
| `device_label` | text | NOT NULL | User-editable. |
| `device_type` | text | NOT NULL CHECK (device_type IN ('phone','tablet','desktop','web')) | |
| `first_seen_at` | timestamptz | NOT NULL DEFAULT now() | |
| `last_activity_at` | timestamptz | NOT NULL DEFAULT now() | Refreshed by per-request Edge middleware. |
| `revoked_at` | timestamptz | NULLABLE | Set by remote logout (US5 #2/#3). |

**Lifecycle**: created on successful auth → updated on every authenticated request → revoked on user-initiated logout / "sign out everywhere" / deletion grace entry. Hard-deleted at purge (day 7).

**Index**: `(user_id, revoked_at)` partial WHERE revoked_at IS NULL — covers the sessions screen + the "sign out everywhere except current" query.

### 1.4 `public.account_lockout`

Spec entity: **Account Lockout** (FR-007 + SC-013).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `identifier` | text | PRIMARY KEY | Lowercased email OR Apple `sub` OR Google `sub` OR handle. |
| `identifier_type` | text | NOT NULL CHECK (identifier_type IN ('email','apple_sub','google_sub','handle')) | |
| `failed_attempts` | smallint | NOT NULL DEFAULT 0 | Reset on success OR rolling-window expiry. |
| `rolling_window_started_at` | timestamptz | NOT NULL DEFAULT now() | 10-min sliding window. |
| `locked_until` | timestamptz | NULLABLE | Set when attempts ≥ 5; lockout = 15 min. |

**Lifecycle**: incremented by `auth-attempt-record` Edge Function on every failed credential or OTP entry; consulted by `auth-gate` Edge Function before delegating to Supabase Auth.

### 1.5 `public.username_reservation`

Spec entity: **Username Reservation** (FR-002, FR-003, FR-304).

Separated from `user_account.handle` so handles can be released-and-re-claimed without dropping `user_account` rows (case: deletion purge releases the handle for a future signup).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `handle_normalized` | citext | PRIMARY KEY | Lowercased handle. |
| `user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | |
| `claimed_at` | timestamptz | NOT NULL DEFAULT now() | |
| `released_at` | timestamptz | NULLABLE | NULL = active; non-NULL = released back to the pool. |

**Reserved blocklist** (FR-003): seeded as rows with `user_id = NULL` would violate FK; instead enforced by an Edge Function check against a separate `reserved_handle_blocklist (handle_normalized text PRIMARY KEY)` table read on every claim attempt.

### 1.6 `public.emergency_qr_token`

Spec entity: **Emergency QR Token** (FR-016, FR-017, FR-018, FR-034).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `jti` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Token id; appears in the signed payload. |
| `user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | Binds token to originating user (FR-034). |
| `ciphertext` | bytea | NOT NULL | AES-256-GCM ciphertext of the emergency-card snapshot; symmetric key lives in the URL fragment client-side per research §6. |
| `profile_etag` | char(8) | NOT NULL | Hex8 hash of the encrypted snapshot at mint time; stale-detect on resolve. |
| `ttl_seconds` | int | NOT NULL CHECK (ttl_seconds IN (3600, 21600, 86400, 604800)) | FR-017 — overrides ±1 h / ±6 h / ±24 h / ±7 d. Default 86400. |
| `expires_at` | timestamptz | NOT NULL | Computed `created_at + ttl_seconds * interval '1 second'`. |
| `revoked_at` | timestamptz | NULLABLE | Set on user-initiated revoke OR on new-mint (FR-018). |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |

**Lifecycle**: new mint sets `revoked_at = now()` on the user's prior active row in the same transaction. Resolve query (Edge Function): `WHERE jti = $1 AND revoked_at IS NULL AND expires_at > now()`.

**Index**: `(user_id) WHERE revoked_at IS NULL AND expires_at > now()` — uniqueness-style (one active token per user, FR-018).

### 1.7 `public.deletion_log`

Spec entity: **Deletion Log Row** (FR-029, FR-031, retained 2 years).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | |
| `user_id_hash` | text | NOT NULL | SHA-256 of the deleted user's UUID — irreversible link for compliance audit. |
| `country_code_at_deletion` | char(2) | NOT NULL | Spec scenario US4 #4. |
| `reason_code` | text | NULLABLE CHECK (reason_code IS NULL OR reason_code IN ('user_request','cancelled','support_request')) | "cancelled" rows captured at FR-203 cancel-deletion. |
| `apple_revoke_status` | text | NULLABLE CHECK (apple_revoke_status IN ('not_applicable','succeeded','failed_final','failed_retrying')) | FR-029. |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |
| `purge_at` | timestamptz | NOT NULL | Set to `created_at + interval '2 years'`; a cron drops the row. |

**Lifecycle**: inserted on (a) confirm-deletion → grace start, (b) cancel-deletion → mark cancelled, (c) day-7 purge → mark Apple revoke final outcome. Retained 2 years per spec; auto-deleted past `purge_at`.

### 1.8 `public.reserved_handle_blocklist`

Static lookup populated from spec FR-003 minimum list + ops-extensible additions.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `handle_normalized` | citext | PRIMARY KEY | Reserved literal. |
| `added_by` | text | NOT NULL DEFAULT 'system' | "system" / Trust & Safety operator name. |
| `added_at` | timestamptz | NOT NULL DEFAULT now() | |

**Seed**: `admin`, `balsm`, `support`, `api`, `help`, `null`, `health` — extensible by Trust & Safety.

### 1.9 `public.disclosure_acceptance`

Cloud mirror of the on-device `disclosure_acceptance` table (the latter is canonical for offline operation; the cloud row supports cross-device acceptance audit per FR-040 + SC-207).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | |
| `user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | |
| `disclosure_id` | text | NOT NULL | Stable string id per disclosure surface (`onboarding_consolidated`, `device_loss_90d`, etc.). |
| `version` | text | NOT NULL | Semantic version of the rendered copy. |
| `country_code_at_accept` | char(2) | NOT NULL | FR-040 snapshot. |
| `supervisory_authority_name_at_accept` | text | NOT NULL | FR-219 — `PDPC` / `SDAIA` / `UAE Data Office` / `Egypt PDPC (global default)` snapshot. |
| `preferred_language_at_accept` | text | NOT NULL | BCP 47 of the copy actually shown. |
| `accepted_at` | timestamptz | NOT NULL DEFAULT now() | |

**Uniqueness**: `(user_id, disclosure_id, version)` UNIQUE — re-acceptance produces a new row only when version differs (FR-220 country-switch case).

### 1.10 `public.denied_country_blocklist` (static, in-code-and-DB-mirror)

Q1-resolution introduces this. Union of OFAC sanctions + Apple App Store denied + Google Play denied country codes. Stored as a Postgres table mirrored from a YAML source-of-truth in the repo.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `country_code` | char(2) | PRIMARY KEY | ISO 3166-1 alpha-2. |
| `source` | text | NOT NULL CHECK (source IN ('ofac','apple_denied','google_denied','manual')) | |
| `added_at` | timestamptz | NOT NULL DEFAULT now() | |

**Lifecycle**: refreshed by a quarterly CI job that diffs against the upstream lists; manual additions reviewed by Legal.

### 1.11 Supabase Storage bucket `avatars/` — **REMOVED 2026-06-15**

Per Q-clarification 2026-06-15: no user-uploaded avatars in P001. The bucket is not provisioned. UI renders initials derived from `display_name` (client-side computation; no storage cost, no moderation pipeline, no Apple/Google UGC obligation).

### 1.12 `public.user_account_audit_log` — **NEW 2026-06-15 (Path-ii)**

Per FR-048. Per-SELECT entry for every read of `user_account` (Constitution Principle II + the `date_of_birth` PHI exception scope).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | |
| `target_user_id` | uuid | NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE | Always self in P001 (RLS prevents reading another user's row). |
| `actor_user_id` | uuid | NOT NULL | From `auth.uid()`. Equal to target_user_id in P001. |
| `read_at` | timestamptz | NOT NULL DEFAULT now() | |
| `source_ip` | inet | NULLABLE | From Cloudflare-injected header. |
| `correlation_id` | uuid | NOT NULL | Echoed from request. |

Lifecycle: inserted by an `AFTER SELECT` analogue (Postgres can't trigger on SELECT, so the audit row is INSERTed from the Edge Function path that wraps every authenticated user_account read — `get-self`). Hard-deleted alongside `user_account` on day-7 purge (ON DELETE CASCADE).

**Index**: `(target_user_id, read_at DESC)` — covers compliance-audit queries.

### 1.13 Residency partitioning (UAE) — **NEW 2026-06-15 (Path-ii / FR-049)**

The cloud schema is **identical** across regions but the Supabase project that hosts a user's row depends on the user's `country_code`:

- `country_code = 'AE'` → UAE-resident self-hosted Supabase project (UAE Federal Law 2/2019 Health Data Law residency).
- All other `country_code` values → single EU-region Supabase project.

Application-layer routing: at signup, `auth-gate` reads the resolved country code and routes the new account to the appropriate project. Sign-in: client tries EU first; on 404, retries against UAE. (Future P002: a residency router service replaces this client-side fallback.)

Cross-region constraints in P001:
- Username uniqueness is **NOT** federated across regions in P001 — usernames live per-project. A handle claimed in EU is unavailable to UAE users and vice-versa; collisions surface as 409 at second-claim time. P002 ships a central username service.
- Sessions, deletion logs, audit logs, emergency-QR tokens all stay regional (no federation needed in P001).

---

## 2. On-device plane (SQLite via drift, SQLCipher-encrypted, PHI)

All tables below have `id BLOB(16) PRIMARY KEY NOT NULL` populated with **UUID v7** at insert (Q4 resolution + ADR-12 + research §9). All timestamps are stored as `INTEGER` UTC milliseconds since epoch; display zone resolved per country at render time (FR-215).

### 2.1 `health_profile`

Spec entity: **Health Profile (on-device PHI)** — FR-009.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `user_id` | TEXT | NOT NULL | Supabase user id (string form). |
| `full_name` | TEXT | NULLABLE | PHI; on-device only. |
| `dob` | INTEGER | NULLABLE | Full DOB in UTC ms; cloud carries only year. |
| `blood_type` | TEXT | NULLABLE CHECK (blood_type IS NULL OR blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')) | |
| `phone_personal` | TEXT | NULLABLE | NOT an auth identifier — personal record only. |
| `email_personal` | TEXT | NULLABLE | Beyond the auth email — personal record only. |
| `national_id` | TEXT | NULLABLE | FR-211 validator per `country_code` (EG 14-digit / SA Luhn 10 / AE 15-char `784-YYYY-NNNNNNN-C` / default open). |
| `created_at` | INTEGER | NOT NULL | UTC ms. |
| `updated_at` | INTEGER | NOT NULL | UTC ms. |

One row per device per user; if multiple devices, each carries its own copy (no on-device sync in P001).

### 2.2 `allergy`

Spec entity: **Allergy** (subset of Health Profile).

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `health_profile_id` | BLOB(16) | NOT NULL REFERENCES health_profile(id) | |
| `category` | TEXT | NOT NULL CHECK (category IN ('medication','food','environmental','other')) | |
| `name` | TEXT | NOT NULL | Free text — SNOMED CT enrichment deferred to P002 (cert table). |
| `severity` | TEXT | NULLABLE CHECK (severity IS NULL OR severity IN ('mild','moderate','severe','life_threatening')) | |
| `priority` | INTEGER | NOT NULL DEFAULT 0 | Sort key for emergency-card top-3. |
| `created_at` | INTEGER | NOT NULL | |
| `updated_at` | INTEGER | NOT NULL | |

**Index**: `(health_profile_id, priority DESC)` — covers the emergency-card top-3 query.

### 2.3 `chronic_condition`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `health_profile_id` | BLOB(16) | NOT NULL REFERENCES health_profile(id) | |
| `name` | TEXT | NOT NULL | Free text — SNOMED CT enrichment deferred (cert table). |
| `priority` | INTEGER | NOT NULL DEFAULT 0 | Sort key for emergency-card top-2. |
| `created_at` | INTEGER | NOT NULL | |
| `updated_at` | INTEGER | NOT NULL | |

### 2.4 `emergency_contact`

Spec entity: **Emergency Contact**.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `health_profile_id` | BLOB(16) | NOT NULL REFERENCES health_profile(id) | |
| `name` | TEXT | NOT NULL | |
| `relationship` | TEXT | NULLABLE | |
| `phone_primary` | TEXT | NOT NULL | FR-210 — any international format. |
| `phone_alternate` | TEXT | NULLABLE | |
| `priority` | INTEGER | NOT NULL DEFAULT 0 | Sort key for emergency-card primary. |
| `created_at` | INTEGER | NOT NULL | |
| `updated_at` | INTEGER | NOT NULL | |

### 2.5 `medication`

Spec entity: **Medication**.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `user_id` | TEXT | NOT NULL | |
| `name` | TEXT | NOT NULL | Free text — RxNorm enrichment deferred (cert table). |
| `dose` | TEXT | NOT NULL | Free text. |
| `schedule_kind` | TEXT | NOT NULL CHECK (schedule_kind IN ('daily','weekly','custom')) | |
| `schedule_payload` | TEXT | NOT NULL | JSON — daily: `{ "times": ["08:00","20:00"] }`; weekly: `{ "weekday": "fri", "time": "19:00" }`; custom: `{ "interval_days": 2, "time": "14:00" }`. |
| `start_date` | INTEGER | NOT NULL | UTC ms. |
| `end_date` | INTEGER | NULLABLE | UTC ms; NULL = open-ended. |
| `notes` | TEXT | NULLABLE | |
| `created_at` | INTEGER | NOT NULL | |
| `updated_at` | INTEGER | NOT NULL | |

### 2.6 `medication_dose_event` (append-only)

Spec entity: **Medication Dose Event** — FR-021, FR-022, ADR-12, SC-015. Schema per research §9.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7 — time-sortable. |
| `medication_id` | BLOB(16) | NOT NULL REFERENCES medication(id) | |
| `outcome` | TEXT | NOT NULL CHECK (outcome IN ('taken','skipped','snoozed','missed','correction')) | |
| `scheduled_at` | INTEGER | NOT NULL | UTC ms. |
| `actual_at` | INTEGER | NOT NULL | UTC ms. |
| `reason` | TEXT | NULLABLE | Free text — `traveling` / `not_home` / `felt_better` / `out_of_meds` / `other` per US3 #2. |
| `note` | TEXT | NULLABLE | Free text. |
| `parent_event_id` | BLOB(16) | NULLABLE REFERENCES medication_dose_event(id) | Set on `outcome='correction'`. |
| `created_at` | INTEGER | NOT NULL | UTC ms — used by the append-only trigger to forbid past-dated inserts. |

**Triggers** (research §9):
```sql
CREATE TRIGGER med_dose_event_no_update BEFORE UPDATE ON medication_dose_event
  BEGIN SELECT RAISE(ABORT, 'append-only: use correction outcome instead'); END;
CREATE TRIGGER med_dose_event_no_delete BEFORE DELETE ON medication_dose_event
  BEGIN SELECT RAISE(ABORT, 'append-only: deletion forbidden'); END;
```

**Index**: `(medication_id, scheduled_at)` — covers "Today" + history.

### 2.7 `disclosure_acceptance` (on-device canonical)

Spec entity: **Onboarding Disclosure Record** — FR-040, FR-219.

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | BLOB(16) | PRIMARY KEY | UUID v7. |
| `user_id` | TEXT | NOT NULL | |
| `disclosure_id` | TEXT | NOT NULL | Same vocabulary as cloud mirror 1.9. |
| `version` | TEXT | NOT NULL | |
| `country_code_at_accept` | TEXT | NOT NULL | |
| `supervisory_authority_name_at_accept` | TEXT | NOT NULL | |
| `preferred_language_at_accept` | TEXT | NOT NULL | |
| `accepted_at` | INTEGER | NOT NULL | UTC ms. |

**Uniqueness**: `(user_id, disclosure_id, version)` UNIQUE.

---

## 3. State machines

### 3.1 Deletion FSM (research §12)

```
ACTIVE
   │  (re-auth + confirm)
   ▼
DELETION_REQUESTED ───(re-auth + cancel)──► DELETION_CANCELLED ──► ACTIVE
   │
   │  (cron at grace_until)
   ▼
DELETION_PURGED  (row hard-deleted; deletion_log row remains 2 years)
```

Cancel from DELETION_CANCELLED → re-request → resets a fresh 7-day grace (FR-028 + US4 #6).

### 3.2 Emergency QR token lifecycle

```
MINTED  ──(user revokes)──►  REVOKED  (revoked_at set; resolve fails)
   │
   ├──(new mint)──►  REVOKED + new MINTED row  (FR-018 prior-token invalidation)
   │
   └──(now() > expires_at)──►  EXPIRED  (resolve fails; row remains until housekeeping)
```

### 3.3 Account-lockout window

```
attempts=0,window_started=t0
   │  (failed attempt)
   ▼
attempts=N,window_started=t0
   │  (5th attempt within 10 min)
   ▼
LOCKED  locked_until = now() + 15 min
   │  (locked_until elapses)
   ▼
attempts=0,window_started=NULL
```

Successful auth at any state resets attempts=0.

### 3.4 Medication-dose lifecycle (per scheduled dose)

```
SCHEDULED  ──(fire time, online or offline)──►  NOTIFICATION_FIRED
   │
   ├──(user taps Taken)──►  TAKEN  (insert dose_event with outcome='taken')
   ├──(user taps Skip)──►   SKIPPED  (insert dose_event with outcome='skipped' + reason)
   ├──(user taps Snooze)─►  SNOOZED  (insert dose_event with outcome='snoozed'; reschedule +15 min)
   └──(no action for 30+ min)──►  MISSED  (auto-insert dose_event with outcome='missed' on next foreground)
```

Correction events come later via the `parent_event_id` link.

---

## 4. Cross-plane data flow

| Surface | Reads from | Writes to | PHI? |
|---|---|---|---|
| Signup / sign-in | `auth.users`, `account_lockout`, `denied_country_blocklist` | `auth.users`, `user_account`, `active_session`, `disclosure_acceptance` (both planes) | No |
| Handle claim | `username_reservation`, `reserved_handle_blocklist` | `user_account`, `username_reservation` | No |
| Health profile editor | on-device `health_profile` + 3 children | on-device `health_profile` + 3 children | **Yes — never on wire (FR-012)** |
| Medication editor | on-device `medication` | on-device `medication` | **Yes** |
| Dose notification | on-device `medication` | on-device `medication_dose_event` | **Yes** |
| Emergency QR mint | on-device `health_profile` snapshot → ciphertext + key | `emergency_qr_token` (ciphertext only) + URL fragment (key, never sent) | **Yes (ciphertext only crosses wire)** |
| Emergency QR resolve (public web) | `emergency_qr_token` | none (read-only) | **Yes (ciphertext crosses wire; key arrives via URL fragment, never reaches server)** |
| Deletion grace | `user_account`, `active_session`, `auth.users`, `apple-revoke` Edge Function | `deletion_log` (insert) → cron purges everything else day 7 | No (PHI wiped client-side immediately per FR-030) |

---

## 5. Validation rules (consolidated from FRs)

| Rule | Source | Where enforced |
|---|---|---|
| Handle: 3–30 chars, `[a-z0-9_.]`, globally unique case-insensitive, not in reserved blocklist | FR-002, FR-003, FR-304 | Edge Function `handle-claim` + DB unique constraint on `username_reservation` |
| Email: format + DNS MX optional + Apple `hide-my-email` accepted | FR-001 | Supabase Auth + client UI |
| OTP code: 6 digits, 10-min expiry, 3 requests / 10 min per email | research §2 / §2a | Supabase Auth config + Edge Function rate limiter |
| Lockout: 5 failures / 10-min rolling → 15-min lockout, per-identifier | FR-007, SC-013 | `auth-attempt-record` Edge Function + `account_lockout` table |
| Phone (emergency contact only): any international format | FR-210 | Drift validator |
| Phone (first-class country hint): EG `+20` 10-digit / SA `+966` 9 / AE `+971` 9 | FR-209 (hint role) | Drift validator + country-aware UI hint |
| National-ID (optional): EG 14-digit + governorate / gender extraction / SA Luhn 10 / AE `784-YYYY-NNNNNNN-C` checksum / default open | FR-211, FR-213 | Drift validator |
| Country code: ISO 3166-1 alpha-2; must NOT be in `denied_country_blocklist` at signup | FR-005, FR-202 | Edge Function `geofence-check` |
| Preferred language: valid BCP 47; first-class `ar-EG` / `ar-SA` / `ar-AE` / `en`; others fall back to `en` | FR-205, FR-207 | Client + Translation Catalog gate |
| QR token TTL: one of 3600 / 21600 / 86400 / 604800 seconds | FR-017 | DB CHECK + mint Edge Function |
| QR token: bound to originating `user_id` | FR-034 | Mint Edge Function + resolve query |
| Dose event: append-only | FR-022 | SQLite trigger + drift DAO restriction |
| Numeric input: accept Latin + Eastern-Arabic-Indic; normalize to Latin at save | FR-213, SC-209 | Client form layer |
| Emergency-card label localization (public page) | FR-216 | Cloudflare Worker SSR per `Accept-Language` + token `preferred_language` snapshot |
| Disclosure acceptance: requires `country_code` + `supervisory_authority_name` + `preferred_language` snapshots | FR-040 | Both planes' `disclosure_acceptance` tables; client gates the next step |
| Country change post-signup: requires fresh re-auth + fresh disclosure-version acceptance | FR-203, FR-044 | Edge Function `country-change` |

---

## 5a. DDD aggregate root + domain-event mapping (per 2026-06-15 directives)

Per `contracts/module-package-boundaries.md`, every PHI-touching context owns a Dart package (named after the context, no `feature_` prefix) with an aggregate root. The on-device drift tables described above are owned exclusively by the listed module; cross-module reads go through the read-side repository interface published from the owner's `domain/repositories/` barrel.

| Owner module | Aggregate root | Internal entities | Drift tables owned | Domain events emitted on mutation |
|---|---|---|---|---|
| `profile` | `HealthProfile` | `Allergy`, `ChronicCondition`, `EmergencyContact` | `health_profile`, `allergy`, `chronic_condition`, `emergency_contact` | `HealthProfileUpdated` |
| `medications` | `Medication` | append-only `DoseEvent` | `medication`, `medication_dose_event` | `MedicationAdded`, `DoseTaken`, `DoseSkipped`, `DoseSnoozed`, `DoseMissed`, `DoseCorrected` |
| `disclosure` | `DisclosureAcceptance` | — | `disclosure_acceptance` | `DisclosureAccepted` |
| `emergency_card` | `EmergencyCardSnapshot` + `EmergencyQrToken` | — | `emergency_qr_local_snapshot` (on-device); cloud `emergency_qr_token` accessed via cross-plane adapter | `EmergencyQrTokenMinted`, `EmergencyQrTokenRevoked` |
| `auth` | `AuthSession` | — | (cloud `auth.users` + `account_lockout` via Edge Function) | `UserSignedUp`, `UserSignedIn`, `UserSignedOut`, `LockoutTriggered` |
| `sessions` | `ActiveSession` | — | (cloud `active_session`) | `SessionRevoked` |
| `account` | (no aggregate — value-object only on `CountryCode`, `Bcp47Tag`) | — | (cloud `user_account.country_code` + `preferred_language` only) | `CountryChanged`, `LanguageChanged` |
| `deletion` | `DeletionRequest` | — | (cloud `user_account.deletion_state` + `deletion_log`) | `DeletionRequested`, `DeletionCancelled`, `DeletionPurged` |
| `geofence_block` | (read-only) | — | (cloud `denied_country_blocklist`) | `BlockedSignupAttempted` |
| `home` | (orchestration only) | — | (none) | (consumer of cross-module events) |

**Invariants enforced inside aggregates** (not in DB):

- `HealthProfile.addAllergy(Allergy)` rejects when more than 50 allergies exist (UX hard cap; spec doesn't mandate but the aggregate enforces it to keep the lock-surface snapshot bounded).
- `Medication.recordDose(DoseEvent)` rejects any `outcome='correction'` whose `parent_event_id` does not reference an existing dose event on the same medication.
- `EmergencyQrToken.revoke()` is idempotent and disallows further `mint()` until a fresh token instance is created.
- `DeletionRequest.cancel()` is allowed only from `DELETION_REQUESTED` state; throws `InvalidStateTransition` otherwise.
- `ActiveSession.revoke()` cannot un-revoke (one-way transition).

**Value objects in shared kernel** (`core/lib/src/domain/`; used across multiple aggregates):

- `UuidV7` — wraps the 16-byte RFC 9562 identifier; provides `.timestamp` accessor for time-sort.
- `CountryCode` — ISO 3166-1 alpha-2 with denied-list awareness.
- `Bcp47Tag` — language tag with first-class / default-class classification.
- `Iso8601Timestamp` — UTC milliseconds wrapper.
- `Money` — currency code + minor units (EGP / SAR / AED / generic for default-class).

## 5b. Clarifications

### Session 2026-06-16

> Recorded here because `spec.md` is absent. When `spec.md` is regenerated these MUST be merged into a `## Clarifications` section there.

- **Q1**: Multi-device sign-in PHI restore behavior → **A**: User-owned encrypted backup. iOS uses iCloud Drive (`com.apple.developer.icloud-services` documents container), Android uses Google Drive (`AppFolder` scope via `DriveScopes.SCOPE_APPDATA`). Balsm client encrypts the drift export with a key derived from `Argon2id(user_otp_token || device_secret)` and uploads the ciphertext blob. New-device sign-in: after first OTP success, prompts "Restore from your backup?" — user accepts, blob downloads, drift database rehydrated. Balsm servers never see plaintext or key. Rationale: meets FR-009 literally (no PHI on Balsm servers) while solving the multi-device-restore gap.
  - **Affected FRs**: FR-009 (clarified — PHI never reaches Balsm; user-cloud is the patient's data, not Balsm's), new FR-009a (multi-device restore via user-owned cloud), new FR-009b (restore is explicit opt-in, defaults to off)
  - **Affected SCs**: new SC-002a "Restore from backup completes in ≤30s P50 on second-device sign-in"
  - **Affected tasks**: new tasks needed under `core` for `BackupAdapter` + per-platform implementations + drift export/import; restore prompt screen after auth-otp success when backup-blob detected
  - **Implementation impact**: ~6 new tasks (T112-class), 1 new screen, 2 platform-channel implementations

- **Q2**: Medication reminder notification body content → **A**: Strict privacy. Notification body fixed to localized "Time for your medication" / "موعد دوائك" / etc. Drug name, dose, schedule never appear in `notification.body`, `notification.title`, `subtitle`, `summary`, or watchOS/Android Wear preview. Drug name only inside the app after unlock. Multi-dose-at-same-time collision resolved by deep-link payload → `meds.today` screen which lists the due doses. Rationale: matches MASTER.md §9 PHI rule literally; matches Balsm voice; accepted UX cost for poly-pharmacy patients (mitigation: deep-link straight to today screen).
  - **Affected FRs**: FR-018 (clarified — notification CONTENT bounded to localized generic string), new FR-018a (deep-link payload routes to `meds.today` with the due-dose ID highlighted)
  - **Affected SCs**: clarification on SC-004 — "notification fires" measured by OS delivery, not by user reading drug name in notification
  - **Affected tasks**: T138 (medication scheduler) — add notification-body redaction guard in code; T145 (notification tap handler) — route deep-link payload to `meds.today` with highlighted due-dose; T175 (PHI-leak fuzz test) — extend corpus to include `flutter_local_notifications` payload assertion
  - **Implementation impact**: ~3 task updates, no new screens

- **Q3**: Country change after Path-ii encrypted DOB stored — residency handling → **A**: No migration. Encrypted DOB stays on the originally-provisioned Supabase project regardless of `country_code` changes. `user_account.country_code` becomes the user-facing locale + supervisory-authority field; it does NOT drive row residency post-creation.
  - **⚠️ COMPLIANCE GAP — documented intentionally**: UAE Federal Law 2/2019 + UAE Health Data Office 2024-Q3 guidance treats encrypted PHI as PHI. An EG-signed-up user who relocates to UAE retains EU-resident encrypted DOB. This is a known divergence from FR-049's letter. Must be tracked on the compliance risk register and disclosed in the UAE-app-store privacy filing.
  - **Affected FRs**: FR-049 (clarified — residency pinned at signup, not mutable; document gap explicitly); FR-302 (clarified — country-change updates country_code only, no row migration)
  - **Affected SCs**: SC-302 (clarified — country-change ≤2s, no migration latency budget)
  - **Affected tasks**: T168 (country-change Edge Function) — explicit comment that row is not migrated; T146-T149 (deletion functions) — deletion still works regardless of country_code drift; new task to add a compliance-risk-register entry under repo `docs/compliance-risks.md`
  - **Risk mitigations to add**: (i) on signup, the chosen country is the *durable residency* — change UI copy on country picker to convey this without scaring user; (ii) UAE residents MUST sign up with country=AE — denied_country_blocklist doesn't help here; consider a soft warning on country picker if device-locale is AE but user picks non-AE; (iii) document the gap in privacy notice + app-store data-safety filings; (iv) revisit in P002 when cross-project migration tooling exists
  - **Implementation impact**: ~3 task updates, copy edits on auth-country screen, 1 new compliance-risk-register doc

- **Q4**: Lockout escape path / support contact channel → **B**: Two channels — `mailto:support@balsm.health` (renders via device mail client; no auth required) + public status page at `{BASE_URL}/status`. Both reachable from `auth-lockout`, `auth-blocked` (geofence), `not-found`, and `meds-tz-shift` error states. Status page is a static Flutter Web route hosted alongside `/emergency/{token}` and `/account/delete`, showing current Supabase health, scheduled maintenance, and a feed of recent incidents. Rationale: zero ops headcount, works for phone-stolen recovery via second device, handles outage queries without flooding email. P002 may add in-app contact form for authenticated users.
  - **Affected FRs**: new FR-046a "All hard-blocking screens (lockout, geofence-blocked, 404) MUST expose at least one support channel reachable without app auth"; new FR-046b "Public status page MUST display at `{BASE_URL}/status` showing service health"
  - **Affected SCs**: new SC-011a "Locked-out user can reach support email or status page in ≤2 taps from lockout screen"
  - **Affected tasks**: T166 (lockout screen) — wire mailto: + status link; new task to create Flutter Web `/status` public route (T133b-class); new task to add status page to AASA + assetlinks deeplink allowlist; T193 design copy task in `findings/_template.md` to specify support copy
  - **Implementation impact**: ~3 task updates, 1 new public web route + cron-checked status feed, copy edits across lockout/geofence/404 screens

- **Q5**: OTP delivery provider → **B**: Resend.com via custom domain `noreply@balsm.health`. SPF + DKIM + DMARC aligned at DNS level. Resend EU region (Frankfurt) matches our EU-resident Supabase project default; Resend Egypt-EG region considered when available. Free tier 3000 emails/day; paid $20/mo for 50k. DPA via Resend's standard data-processing agreement; named sub-processor on Apple/Google data-safety filings. Templates stored in `supabase/templates/auth-otp/{en,ar-EG,ar-SA,ar-AE}.html` and sent via Supabase Auth's custom SMTP setting pointing at Resend's SMTP endpoint with API key in Supabase secrets.
  - **Affected FRs**: clarification on FR-001 (OTP delivery via Resend; not Supabase default); new FR-001a "OTP email rendered from versioned localized template; subject + body + sender match user's `preferred_language`"
  - **Affected SCs**: SC-001a OTP-delivery-to-inbox ≤30s P50, ≤90s P99 (Resend SLA)
  - **Affected tasks**: T001 (Supabase config.toml) — set custom SMTP to Resend host + port 587; secret `RESEND_API_KEY` in Supabase project secrets; new task to create 4 localized OTP templates under `supabase/templates/auth-otp/`; new task in CI to validate template render with sample tokens
  - **DPA + filings**: add Resend to (i) privacy notice sub-processor list, (ii) Apple/Google data-safety email-collection field, (iii) UAE/KSA/EG DPA registers
  - **Implementation impact**: ~4 task updates/additions, 4 email templates, 1 secret bootstrap, 3 regulatory filing updates

## 6. P002 forward-compat notes

- Every PHI table uses UUID v7 PKs so a future P002 cloud-sync can merge N devices without remap (Q4 resolution).
- Every clinical free-text field (allergy name, condition name, medication name, dose) preserves the user's literal input verbatim so P002 SNOMED CT / RxNorm enrichment is lossless (cert compliance table).
- `disclosure_acceptance` carries the `supervisory_authority_name_at_accept` snapshot so future copy edits don't invalidate historical consent.
- Cloud `user_account` carries `country_code` + `preferred_language` so a P002 cloud-PHI-sync residency decision per country has a clean attribute to switch on.
- Deletion FSM separates `user_account.deletion_state` from `deletion_log` so the deletion audit survives the purge — a P002 PHI sync target can read the FSM directly without rejoining tables.
