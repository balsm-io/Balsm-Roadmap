# Platform Access — Bounded Context

| | |
|---|---|
| **Plane** | Platform |
| **Classification** | Generic — OAuth 2.0 server, API keys, rate limiting are standard patterns; the healthcare-specific part is the consent model |
| **Phases** | P022 (webhooks), P023 (OAuth server, API keys, developer portal) |
| **Repo mapping** | new module at P023; developer portal `developers.balsm.health`; self-hosted OpenAPI at `/api/docs` |
| **PHI posture** | Gate, not store: PHI reachable **only** via patient-authorized OAuth scopes; entity API keys never grant PHI (`403`). |

## Purpose

The controlled front door for third parties: OAuth 2.0 authorization server (Authorization Code + PKCE, Client Credentials), patient consent grants with partial-scope approval and per-grant revocation, entity API keys (hashed, scoped, IP-restrictable), rate limits/quotas, webhooks, and the developer portal + sandbox.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| OAuth Client | A registered third-party application (per instance; centrally registered for Network via the portal) |
| Consent Grant | A patient's per-scope approval — plain-language labels, partial approval allowed, revocable with immediate token invalidation, full history downloadable |
| Entity API Key | Named, shown once, Argon2/bcrypt-hashed, least-privilege scoped, optional IP allowlist |
| Scope | Named permission (`prescriptions.read`, `vitals.write`, …); write scopes limited to patient-reported/device data |
| Quota | Per-key/per-token limits (1,000 req/min & 100k/day entity default; 60 req/min patient token) → `429` + `Retry-After` |
| Webhook Subscription | Event delivery registration (P022), HMAC-verified |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `OAuthClient` | registration, redirect URIs, flow type | PKCE mandatory for public clients |
| `ConsentGrant` | patient, client, approved scope subset, history | Revocation invalidates all tokens under the grant immediately; consent history immutable |
| `ApiKey` | hash, scopes, expiry, IP restriction, last-used | Plaintext shown once; no PHI scope possible |
| `RateLimitPolicy` | per-key/token limits, tier overrides | Per-tenant isolation on Balsm Cloud |
| `WebhookSubscription` | client, events, endpoint, secret | HMAC-signed deliveries (constitution Principle XIV) |

## Integration Events

**Published:** `ConsentGranted`, `ConsentRevoked`, `ApiKeyRevoked` — all API calls audit-trailed (client, user/entity, endpoint, timestamp, status) visible to entity admins.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| All contexts | gate | **OHS/PL** | Scoped API surface over each context's published language; versioned `/api/v1/`, ≥24-month major-version support |
| Balsm Network | downstream | **CF** | Entity sharing controls enforced: category off → `403` regardless of token validity |
| Identity & Access | downstream | C-S | Patient identity/authn delegated; this context owns *authorization for third parties* |
| Marketplace | upstream | C-S | Add-ons consume the same surface — no privileged path |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P022 | Webhook & event subscription API (HMAC-verified per Principle XIV) |
| P023 | OAuth 2.0 server: Authorization Code + mandatory PKCE (public clients), Client Credentials (partners) |
| P023 | Patient consent: plain-language per-scope screen, partial grants, per-grant revocation (immediate token invalidation), downloadable consent history |
| P023 | Scopes: 10 patient read scopes + `vitals.write`/`self-reported.write` only — no third-party clinical writes |
| P023 | Entity API keys: named, shown-once (Argon2/bcrypt hash), scoped least-privilege, optional IP allowlist, immediate revocation, **no PHI ever** |
| P023 | Rate limits: 1,000/min + 100k/day per entity key; 60/min per patient token; `429` + `Retry-After`; per-tenant cloud quotas; paid tiers |
| P023 | Developer portal (`developers.balsm.health`): OpenAPI docs auto-generated, client registration, synthetic-data sandbox, changelog, ≥24-month version support, SDKs, forum; self-hosted `/api/docs` |
| P023 | Full per-call audit trail (client, user/entity, endpoint, timestamp, status) visible to entity admins; §1.4 sharing-control `403` enforcement |

Modules: planned P023.

## Boundary Notes

- Sandbox environment serves synthetic (non-PHI) data only (P023 exit criterion).
- Developer ToS enforcement (no re-identification, no data resale) is a policy artifact owned here.
