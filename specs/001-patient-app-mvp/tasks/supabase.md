---
description: "P001 tasks — Supabase track"
---

# P001 Tasks — Supabase Track

Filtered from `../tasks.md`. Phase + section headers preserved. Only `[Supabase]` rows kept.

Format: `[ID] [P?] [Story?] [Project] Description with absolute file path`


## Phase 1: Setup — Project Initialization

### 1.1 Supabase project init

- [ ] T001 [P] [Supabase] Create `../supabase/supabase/config.toml` with project name `balsm-p001`, region `eu-west-1`, auth settings (email OTP enabled, code length 6, expiry 600s, Google + Apple providers enabled, Phone disabled)
- [ ] T002 [P] [Supabase] Create `../supabase/supabase/migrations/00001_initial_schema.sql` — paste the full content from `contracts/supabase-schema.sql` (all 10 tables + indexes + triggers + seeds)
- [ ] T003 [P] [Supabase] Create `../supabase/supabase/seed.sql` — insert denied-country seed rows (CU, IR, KP, SY) and reserved-handle blocklist seed rows (admin, balsm, support, api, help, null, health)
- [ ] T004 [P] [Supabase] Create RLS policy file at `../supabase/supabase/migrations/00002_rls_policies.sql` — `user_account` SELECT own row only, UPDATE own row only when `deletion_state = 'ACTIVE'`, INSERT for signup flow, DELETE forbidden
### 1.2 Edge Functions scaffolding

- [ ] T005 [P] [Supabase] Create Edge Function directory structure at `../supabase/supabase/functions/` with empty `deno.json` and `import_map.json` — all 20 functions listed below get their own subdirectory in later phases:
- [ ] T006 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/supabase-client.ts` — re-exports `createClient` from `npm:@supabase/supabase-js` with service-role key
- [ ] T007 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/cors.ts` — exports `corsHeaders` object with `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type`
- [ ] T008 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/response.ts` — exports `json(data, status)` and `error(message, status)` helpers wrapping `new Response`

## Phase 3: US1 — Signup & Auth (Priority: P1)

### 3.1 Supabase: auth-gate Edge Function

- [ ] T071 [P] [Supabase] [US1] Create `../supabase/supabase/functions/auth-gate/index.ts` — reads `X-Client-Country-Code` header, checks `denied_country_blocklist` (reject 403 if denied), checks `account_lockout` for the identifier (reject 423 if locked), calls Supabase Auth sign-in or sign-up, returns result
- [ ] T072 [P] [Supabase] [US1] Create `../supabase/supabase/functions/geofence-check/index.ts` — accepts `country_code` param, queries `denied_country_blocklist`, returns `{ allowed: boolean, source?: string }`
- [ ] T073 [P] [Supabase] [US1] Create `../supabase/supabase/functions/auth-attempt-record/index.ts` — called after every failed auth attempt, upserts `account_lockout` row: increments `failed_attempts`, resets `rolling_window_started_at` if outside 10-min window, sets `locked_until` when attempts >= 5

**Checkpoint**: signup-to-home round-trip complete. User can pick country, sign up with email OTP / Google / Apple, accept disclosure, land on home. Verified by SC-001a.


## Phase 4: US1a — Handle Claim & Health Profile (Priority: P2)

### 4.1 Supabase: handle Edge Functions

- [ ] T106 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/reserved-handle-check/index.ts` — accepts `handle`, returns `{ reserved: boolean }` by querying `reserved_handle_blocklist`
- [ ] T107 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/handle-claim/index.ts` — validates handle format `^[a-z0-9_.]{3,30}$`, checks `reserved_handle_blocklist`, checks `username_reservation` for uniqueness, inserts `username_reservation` row + updates `user_account.handle`, returns `204`
- [ ] T108 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/handle-suggest/index.ts` — accepts `display_name`, returns 3 handle suggestions by appending random digits

**Checkpoint**: handle claim + health profile CRUD complete. All PHI stored on-device only.


## Phase 5: US2 — Emergency Card & QR (Priority: P2)

### 5.1 Supabase: emergency-token Edge Functions

- [ ] T119 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-mint/index.ts` — service-role function: accepts `user_id`, `ciphertext` (bytea), `profile_etag`, `ttl_seconds`; sets `revoked_at` on prior active token in same TX; inserts new `emergency_qr_token` row; returns `{ jti, expires_at }`
- [ ] T120 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-revoke/index.ts` — sets `revoked_at = now()` on `emergency_qr_token` where `jti = $1 AND user_id = $2`
- [ ] T121 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-resolve/index.ts` — public (no auth) function: queries `emergency_qr_token` where `jti = $1 AND revoked_at IS NULL AND expires_at > now()`; returns `{ ciphertext, profile_etag, expires_at, user_id }` or 404

**Checkpoint**: emergency card + QR full round-trip. Mint → scan → public page resolves → revoke → page returns "Expired".


## Phase 7: US4 — Self-Service Deletion (Priority: P3)

### 7.1 Supabase: deletion Edge Functions

- [ ] T146 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-intake/index.ts` — sets `deletion_state = 'DELETION_REQUESTED'`, `deletion_confirmed_at = now()`, `deletion_grace_until = now() + 7 days`, inserts `deletion_log` row with `reason_code = 'user_request'`
- [ ] T147 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-confirm/index.ts` — (intake already set the state; this function is called after re-auth in web flow) verifies `deletion_state = 'DELETION_REQUESTED'`, calls Apple `/auth/revoke` if Apple provider, updates `deletion_log.apple_revoke_status`
- [ ] T148 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-cancel/index.ts` — sets `deletion_state = 'DELETION_CANCELLED'` → after next sign-in the client transitions back to `ACTIVE`, inserts `deletion_log` row with `reason_code = 'cancelled'`
- [ ] T149 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-purge/index.ts` — cron-triggered: queries `user_account` where `deletion_state = 'DELETION_REQUESTED' AND deletion_grace_until < now()`, deletes each matching `auth.users` row (CASCADE removes all related rows), updates `username_reservation.released_at`
- [ ] T150 [P] [Supabase] [US4] Create `../supabase/supabase/functions/apple-revoke/index.ts` — calls Apple's `/auth/revoke` endpoint with the user's Apple refresh token, returns status

**Checkpoint**: full deletion FSM observable — in-app request, cancel, web path, purge cron. Sessions screen shows active devices.


## Phase 9: US6 — Country & Language Change (Priority: P4)

### 9.1 Supabase: country/language Edge Functions

- [ ] T168 [P] [Supabase] [US6] Create `../supabase/supabase/functions/country-change/index.ts` — validates new country not denied, updates `user_account.country_code` and re-snapshots `preferred_language` defaults for the new country, triggers fresh disclosure acceptance
- [ ] T169 [P] [Supabase] [US6] Create `../supabase/supabase/functions/language-change/index.ts` — updates `user_account.preferred_language`

**Checkpoint**: country change round-trip → re-auth → re-disclosure → RTL toggle → single account preserved across countries.


## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T182 [P] [Supabase] Create CI workflow at `../supabase/.github/workflows/ci.yml` — steps: supabase db diff, Edge Function typecheck via deno check, migration dry-run
