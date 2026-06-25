# .NET API Contract — P001 Consumer Patient App

**Version**: 1.0 · **Date**: 2026-06-17
**Replaces**: Supabase Edge Function interface map (removed per 2026-06-17 pivot).
**Base URL**: `{BALSM_API_BASE_URL}` (dev: `http://localhost:5000`, staging/prod: TBD at deployment phase)
**Auth**: `Authorization: Bearer <access_token>` (JWT HS256, 15-min expiry). Refresh via `POST /auth/refresh`.

All responses follow:
```json
{ "data": <payload>, "error": null }
{ "data": null, "error": { "code": "...", "message": "...", "correlationId": "..." } }
```

---

## Auth Module

### `POST /auth/otp/request`
Request email OTP. Rate-limited: 3/10min per email, 10/60min per IP, 10k/60min global.
```json
Request:  { "email": "user@example.com", "country_code": "EG", "captcha_token": "..." }
Response: { "data": { "expires_in_seconds": 600 } }
Errors:   429 TooManyRequests (per-email/IP/global), 403 GeofenceBlocked
```

### `POST /auth/otp/verify`
Verify OTP and issue JWT pair.
```json
Request:  { "email": "user@example.com", "code": "123456", "device_id": "<uuid>", "device_label": "iPhone 15" }
Response: { "data": { "access_token": "...", "refresh_token": "...", "user_id": "<uuid>", "is_new_user": true } }
Errors:   400 InvalidCode, 410 CodeExpired, 423 AccountLocked (+ Retry-After header)
```

### `POST /auth/google`
Exchange Google ID token for Balsm JWT.
```json
Request:  { "id_token": "<google_id_token>", "device_id": "<uuid>", "device_label": "..." }
Response: { "data": { "access_token": "...", "refresh_token": "...", "user_id": "<uuid>", "is_new_user": true } }
Errors:   400 InvalidToken, 403 GeofenceBlocked, 423 AccountLocked
```

### `POST /auth/apple`
Exchange Apple ID token for Balsm JWT. Accepts `hide-my-email` relay.
```json
Request:  { "id_token": "<apple_id_token>", "authorization_code": "...", "device_id": "<uuid>", "device_label": "..." }
Response: { "data": { "access_token": "...", "refresh_token": "...", "user_id": "<uuid>", "is_new_user": true } }
```

### `POST /auth/refresh`
Refresh access token using refresh token.
```json
Request:  { "refresh_token": "...", "device_id": "<uuid>" }
Response: { "data": { "access_token": "...", "refresh_token": "..." } }
Errors:   401 TokenExpired, 401 TokenRevoked
```

### `POST /auth/sign-out`
Revoke refresh token for current device.
```json
Request:  {} (auth header required)
Response: { "data": { "signed_out": true } }
```

### `POST /auth/recovery/claim`
Claim a support-issued recovery token (FR-046c).
```json
Request:  { "recovery_token": "...", "new_email": "...", "device_id": "<uuid>", "device_label": "..." }
Response: { "data": { "access_token": "...", "refresh_token": "..." } }
Errors:   400 InvalidToken, 410 TokenExpired, 409 CoolingOffActive
```

---

## Account Module

### `GET /account/self`
Get current user account. Decrypts DOB; appends audit log row (FR-048).
```json
Response: { "data": { "user_id": "...", "handle": "...", "display_name": "...", "country_code": "EG", "preferred_language": "ar-EG", "deletion_state": "ACTIVE", "dob_year": 1990 } }
```

### `POST /account/handle/claim`
Claim a globally-unique handle (FR-002, FR-003).
```json
Request:  { "handle": "noor.health" }
Response: { "data": { "handle": "noor.health", "claimed_at": "..." } }
Errors:   409 HandleTaken, 409 HandleReserved, 422 HandleInvalidFormat
          (on 409 HandleTaken: suggestions array with 3 alternatives per FR-008)
```

### `POST /account/handle/check`
Check handle availability.
```json
Request:  { "handle": "noor.health" }
Response: { "data": { "available": true } }
```

### `POST /account/dob`
Set date of birth (encrypted at .NET layer before insert, FR-047).
```json
Request:  { "date_of_birth": "1990-03-15" }
Response: { "data": { "dob_set": true } }
Errors:   422 UnderEighteen (soft-block per FR-301a)
```

### `PATCH /account/country`
Change country (requires re-auth via `reauth_token` from prior OTP/OIDC verify, FR-302).
```json
Request:  { "country_code": "SA", "reauth_token": "...", "disclosure_acceptance_id": "..." }
Response: { "data": { "country_code": "SA" } }
Errors:   401 ReauthRequired, 409 DisclosureNotAccepted
```

### `PATCH /account/language`
Change preferred language (no re-auth, FR-301).
```json
Request:  { "preferred_language": "ar-SA" }
Response: { "data": { "preferred_language": "ar-SA" } }
```

---

## Emergency QR Module

### `POST /emergency-qr/mint`
Mint a new QR token. Revokes prior active token. Age-gated (FR-301b).
```json
Request:  { "ciphertext": "<base64>", "profile_etag": "<hex8>", "ttl_seconds": 86400 }
Response: { "data": { "jti": "<uuid>", "token_url": "{BASE_URL}/emergency/<jti>", "expires_at": "..." } }
Errors:   403 AgeGateBlocked, 422 InvalidTtl
```

### `GET /emergency-qr/active`
Get current user's active QR token summary.
```json
Response: { "data": { "jti": "...", "expires_at": "...", "ttl_seconds": 86400 } | null }
```

### `POST /emergency-qr/{jti}/revoke`
Revoke a QR token.
```json
Response: { "data": { "revoked": true } }
```

### `GET /emergency-qr/resolve/{jti}` *(public, no auth)*
Resolve a QR token for the public emergency page.
```json
Response: { "data": { "ciphertext": "<base64>", "preferred_language": "ar-EG" } }
Errors:   404 TokenNotFound, 410 TokenExpiredOrRevoked
```

---

## Sessions Module

### `GET /sessions`
List active sessions for the current user (FR-035).
```json
Response: { "data": [ { "session_id": "...", "device_id": "...", "device_label": "...", "device_type": "phone", "first_seen_at": "...", "last_activity_at": "...", "is_current": true } ] }
```

### `DELETE /sessions/{session_id}`
Revoke a session (FR-035).
```json
Response: { "data": { "revoked": true } }
Errors:   400 CannotRevokeCurrentSession (use sign-out instead)
```

### `DELETE /sessions`
Revoke all sessions except current (FR-036).
```json
Response: { "data": { "revoked_count": 3 } }
```

---

## Deletion Module

### `POST /deletion/intake`
Enter deletion grace period (FR-031, FR-032). Age-gated (FR-301b). Revokes QR tokens immediately (FR-034).
```json
Request:  { "reauth_token": "..." }
Response: { "data": { "deletion_state": "DELETION_REQUESTED", "grace_until": "...", "apple_revoke_queued": true } }
```

### `POST /deletion/cancel`
Cancel deletion during grace period (FR-032).
```json
Request:  {} (auth required — user signed back in)
Response: { "data": { "deletion_state": "ACTIVE" } }
Errors:   409 GracePeriodExpired
```

---

## Disclosure Module

### `POST /disclosure/accept`
Record a disclosure acceptance (cloud mirror, FR-040).
```json
Request:  { "disclosure_id": "onboarding_consolidated", "version": "2.1.0", "country_code": "EG", "supervisory_authority_name": "PDPC", "preferred_language": "ar-EG" }
Response: { "data": { "accepted_at": "..." } }
```

---

## Geofence

Geofence check is enforced server-side at auth endpoints (not a standalone endpoint). Returns `403 GeofenceBlocked` with `{ "country_code": "IR", "reason": "ofac" }` when signup attempted from a denied country.
