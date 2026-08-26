# Routing Best Practices

**Balsm Healthcare Platform — Cross-Cutting Routing Conventions & Standards**

---

## Overview

This document consolidates cross-cutting routing patterns that apply across all API, website, and portal routing strategies. It fills gaps not covered in the individual routing strategy documents.

---

## 1. Idempotency

### Idempotency-Key Pattern

For non-idempotent operations (POST, PATCH) that should be safe to retry (payments, prescription creation):

```http
POST /v1/billing/payments
Idempotency-Key: 8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d
```

**Rules:**
- Client generates a UUID v4 key per request
- Server deduplicates within a 24-hour window
- Response for duplicate key returns original status + body
- Idempotency-Key is **required** for payment/checkout endpoints
- Idempotency-Key is **optional** for standard POST create operations
- Server returns `409 Conflict` if an in-flight request with the same key exists

### Idempotent Methods Reference

| Method | Naturally Idempotent | Notes |
|--------|---------------------|-------|
| GET | Yes | Safe — no side effects |
| PUT | Yes | Full replacement — same body = same result |
| DELETE | Yes | Soft-delete — second call returns 200/404 |
| PATCH | No | Use Idempotency-Key header |
| POST | No | Use Idempotency-Key header |

---

## 2. Conditional Requests (Caching & Optimistic Concurrency)

### ETag-Based Caching

```http
GET /v1/clinical-records/patients/12345
If-None-Match: "abc123def"

Response (304 Not Modified):
  Status: 304
  (empty body — client uses cached version)
```

### Optimistic Concurrency

```http
PATCH /v1/clinical-records/entries/67890
If-Match: "abc123def"

Content-Type: application/json
Body: { "content": "Updated entry text" }

Response (200 OK):
  ETag: "def456ghi"
```

**Rules:**
- All GET responses include `ETag` header with SHA-256 hash of response body
- All GET responses include `Last-Modified` header
- Clients **should** send `If-None-Match` on GET requests to save bandwidth
- Mutating endpoints (PATCH, PUT, DELETE) **should** require `If-Match`
- `412 Precondition Failed` occurs when ETag doesn't match (resource changed)

---

## 3. Bulk Operations

### Batch Endpoint

```http
POST /v1/batch
Content-Type: application/json

{
  "operations": [
    { "method": "POST", "path": "/v1/clinical-records/patients", "body": { /*...*/ } },
    { "method": "PATCH", "path": "/v1/clinical-records/patients/2/entries/5", "body": { /*...*/ } },
    { "method": "DELETE", "path": "/v1/inventory/items/99" }
  ]
}
```

**Rules:**
- Operations execute in order (sequentially, not parallel)
- Failure in one operation does not roll back previous operations
- Each operation returns its own status code in the response
- Maximum 25 operations per batch request
- Batch endpoints **require** authentication with batch permission

---

## 4. API Deprecation Lifecycle

### Deprecation Headers

```http
GET /v1/patients
Deprecation: true
Sunset: Sat, 01 Mar 2027 00:00:00 GMT
Link: </v2/patients>; rel="successor-version"
```

### Sunset Policy

| Phase | Duration | Headers | Client Action |
|-------|----------|---------|---------------|
| **Announce** | Days 1–180 | `Deprecation: true` | Migrate to new version |
| **Grace** | Days 181–360 | `Deprecation: true`, `Sunset: <date>` | Migration required |
| **Hard-deprecated** | Days 361–365 | Returns `400` with `error.code: "DEPRECATED"` | Migration overdue |
| **Removed** | Day 366+ | `404 Not Found` | — |

### Process

1. **File ADR**: Document the deprecation rationale
2. **Announce**: Update CHANGELOG, add `Deprecation: true` header
3. **Migrate**: Support n-1 version for 12 months minimum
4. **Sunset**: After 12 months, 301 redirect old paths
5. **Remove**: After 18 months, return 404

---

## 5. Request Tracing

### Correlation ID

All requests **must** receive a correlation ID for debugging and monitoring:

```http
# Client → Server
X-Correlation-ID: 8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d
# (optional — server generates one if absent)

# Server → Client (always present)
X-Request-ID: e5f4a3b2-1c0d-9e8f-7a6b-5c4d3e2f1a0b
```

**Rules:**
- Server generates `X-Request-ID` for every request if absent
- Server propagates `X-Correlation-ID` through async workflows (webhooks, background jobs)
- Both IDs are included in all structured logs
- Log format: `[X-Request-ID] [X-Correlation-ID] {message}`

---

## 6. CORS Configuration

### Allowed Origins by Environment

| Environment | Allowed Origins |
|------------|-----------------|
| Production | `https://balsm.health`, `https://portal.balsm.health`, `https://app.balsm.health`, `https://admin.balsm.health`, `https://*.balsm.health` |
| Staging | `https://staging.balsm.health`, `https://portal-staging.balsm.health`, `https://app-staging.balsm.health` |
| Development | `http://localhost:*` |

### CORS Headers

```http
Access-Control-Allow-Origin: https://portal.balsm.health
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Idempotency-Key, X-Correlation-ID, If-Match, If-None-Match
Access-Control-Expose-Headers: X-Request-ID, X-RateLimit-Remaining, X-RateLimit-Reset, ETag, Deprecation, Sunset
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true
```

- Preflight (`OPTIONS`) responses are cached for 24 hours (`Access-Control-Max-Age`)
- Credentials are allowed (cookies/JWT in Authorization header)

---

## 7. Query Parameter Conventions

### Standard Parameter Names

| Purpose | Parameter | Example | Applies To |
|---------|-----------|---------|------------|
| **Page number** | `page` | `?page=2` | All list endpoints |
| **Page size** | `pageSize` | `?pageSize=20` | All list endpoints |
| **Max page size** | — | Hard limit: 100 | Server-enforced |
| **Cursor (alternative)** | `cursor` | `?cursor=eyJpZCI6IDUwfQ==` | High-volume list endpoints |
| **Sort field** | `sort` | `?sort=lastName` | All list endpoints |
| **Sort direction** | `sort` prefix | `?sort=-createdAt` (desc) / `?sort=createdAt` (asc) | All list endpoints |
| **Field selection** | `fields` | `?fields=id,firstName,lastName` | All detail endpoints |
| **Include related** | `include` | `?include=entries,careTeam` | Detail endpoints |
| **Filter (eq)** | `{field}` | `?status=active` | All list endpoints |
| **Filter (range)** | `{field}From` / `{field}To` | `?createdFrom=2026-01-01&createdTo=2026-06-01` | Date ranges |
| **Filter (in)** | `{field}In` | `?statusIn=scheduled,confirmed` | Multi-value filter |
| **Full-text search** | `q` | `?q=john` | Search-enabled endpoints |

### Cursor-Based Pagination (for High-Volume Lists)

```http
GET /v1/clinical-records/entries?cursor=eyJpZCI6IDUwfQ==&limit=50

Response:
{
  "data": [ /* items */ ],
  "meta": {
    "nextCursor": "eyJpZCI6IDEwMH0=",
    "hasMore": true
  },
  "links": {
    "next": "/v1/clinical-records/entries?cursor=eyJpZCI6IDEwMH0=&limit=50"
  }
}
```

---

## 8. HTTP Status Code Quick Reference

### 2xx Success

| Code | When to Use | Example |
|------|-------------|---------|
| 200 | GET, PATCH, PUT, POST (custom action) | `GET /v1/patients/12345` |
| 201 | POST (resource created) | `POST /v1/patients` |
| 202 | Accepted for async processing | `POST /v1/reports/generate` |
| 204 | Success, no body | `DELETE /v1/patients/12345` |

### 4xx Client Error

| Code | When to Use | Example |
|------|-------------|---------|
| 400 | Malformed request, validation error | Invalid JSON, missing required field |
| 401 | Missing or invalid authentication | Expired/revoked JWT |
| 403 | Authenticated but not authorized | Missing permission |
| 404 | Resource not found | Invalid ID |
| 405 | Method not allowed | POST on read-only resource |
| 409 | Conflict | Duplicate resource, stale ETag |
| 412 | Precondition failed | `If-Match` ETag mismatch |
| 415 | Unsupported media type | Wrong Content-Type |
| 422 | Business rule violation | Drug interaction detected |
| 429 | Rate limit exceeded | Too many requests |

### 5xx Server Error

| Code | When to Use | Retry Strategy |
|------|-------------|---------------|
| 500 | Unexpected internal error | Do not retry automatically |
| 502 | Bad gateway | Retry with backoff (3x max) |
| 503 | Service unavailable | Retry after `Retry-After` header |
| 504 | Gateway timeout | Retry with backoff (3x max) |

---

## 9. Response Envelope

### Success

```json
{
  "data": { /* single resource or array */ },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-03-21T10:30:00Z"
  },
  "links": {
    "self": "/v1/patients/12345"
  }
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [
      { "field": "email", "message": "Invalid email format", "code": "INVALID_FORMAT" }
    ]
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-03-21T10:30:00Z"
  }
}
```

### Error Code Naming Convention

```
PATTERN:  {DOMAIN}_{ERROR_TYPE}
EXAMPLE:  CLINICAL_RECORDS_PATIENT_NOT_FOUND
EXAMPLE:  PRESCRIPTIONS_DRUG_INTERACTION_DETECTED
EXAMPLE:  BILLING_PAYMENT_DECLINED
EXAMPLE:  AUTH_TOKEN_EXPIRED
EXAMPLE:  VALIDATION_INVALID_EMAIL
EXAMPLE:  RATE_LIMIT_EXCEEDED
```

---

## 10. URL Naming Conventions

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Lowercase with hyphens | `/clinical-records` | `/clinicalRecords`, `/clinical_records` |
| Plural nouns for collections | `/patients`, `/prescriptions` | `/patient`, `/prescription` |
| Singular for single resource | `/patients/{id}` | `/patients/{id}/patient` |
| Nouns for resources, verbs for actions | `POST /prescriptions/{id}/cancel` | `POST /cancel-prescription` |
| Consistent depth (max 3 levels) | `/v1/{context}/{resource}/{id}/{action}` | Deep nesting like `/a/b/c/d/e/f` |
| Version prefix | `/v1/prescriptions` | `/api/prescriptions` |
| Query for filtering, path for identity | `?status=active` | `/patients/active/` |

---

## Related Documents

- [api-routing-strategy.md](./api-routing-strategy.md) — Complete API endpoint reference
- [website-routing-strategy.md](./website-routing-strategy.md) — Public website URL structure
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Cross-reference mapping
- [authentication-routing-strategy.md](./authentication-routing-strategy.md) — Auth routing
- [payment-routing-strategy.md](./payment-routing-strategy.md) — Payment routing

---

*Last updated: 2026-06-16*
