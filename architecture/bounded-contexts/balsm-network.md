# Balsm Network — Bounded Context

| | |
|---|---|
| **Plane** | Platform |
| **Classification** | Supporting |
| **Phases** | P009 (sync policy), P016 (federation, sharing, subscriptions) — ⚠️ partially built out of order |
| **Repo mapping** | `Balsm.Supervisor`: pairing codes, `X-Balsm-ApiKey` federation auth, Cloudflare tunnel registry, heartbeat, mode switcher; Balsm Cloud multi-tenant deployment (P016) |
| **PHI posture** | None by design: only opt-in shared categories transit; sharing policy is the PHI gate. |

## Purpose

The gatekeeper between local instances and the network: federation pairing, tunnel registry, **entity data-sharing policy** (BRD §1.4 — opt-in per category, nothing shared by default), discoverability, and subscription **entitlements** (feature access tiers, BUSINESS_FEATURES §1.7). Owns *policy*; the sync *mechanism* (outbox, watermark, heartbeat, bounded channels) is SharedKernel/Supervisor infrastructure per ADR-08 — one engine for device↔server and server↔cloud.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Pairing | Establishing trust between a local instance and the network via a 6-char, 10-min-TTL code |
| Sharing Policy | Per-entity, per-category opt-in controls over what leaves the instance |
| Entitlement | What a subscription tier permits (`FREE`, `FREEMIUM`, `TRIAL`, `PAID`, `METERED`, `ADDON`) with its measurement dimension |
| Federation | A self-hosted server participating in the network |
| Mode | Instance exposure: `Standalone` / `Network` / `Public` (Cloudflare tunnel) |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `FederationPairing` | code, TTL, instance identity, API key | Code single-use, 10-min TTL |
| `SharingPolicy` | entity ref, category grants | **Nothing shared by default**; entity admin controls exactly what is published (P016 exit criterion) |
| `Subscription` / `Entitlement` | tier, features, measurement dimensions, expiry | Expiry → 3-month data retention + patient-data preservation option; Billing executes charges |
| `TunnelRegistration` / `InstanceRegistration` | tunnel identity, heartbeat state, mode | HTTPS required for all non-local connections |

## Integration Events

**Consumed:** `EntityProfilePublished`, `LabCatalogPublished` and any cross-instance flow — all pass the sharing policy gate.

**Published:** `SubscriptionActivated` / `SubscriptionExpired` (→ Billing, → feature gating), `InstancePaired`, policy-filtered projections (→ Provider Directory).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| All cross-instance flows | gatekeeper | **OHS** | Nothing leaves a local instance except through sharing policy |
| Provider Directory | upstream | C-S | Publishes policy-filtered projections |
| Billing & Finance | peer | C-S | Network owns entitlement state; Billing owns money movement |
| Platform Access | upstream | C-S | Third-party API access conforms to sharing policy (§1.4 → `403`) |
| Identity & Access | downstream | CF | Supabase JWT bridge validated by .NET cloud (ADR-03) |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P009 | Sync *policy* over the single mechanism (ADR-08): outbox flush order, watermark pull, LWW conflict policy, visible sync status contract |
| P016 | Balsm Network Cloud deployment (multi-tenant PostgreSQL); backend switcher (Cloud/Local/Self-hosted); self-hosted federation |
| P016 | Pairing codes (6-char, 10-min TTL) + `X-Balsm-ApiKey` federation auth + Cloudflare tunnel registry + heartbeat — ✅ built (out of order) |
| P016 | Entity data-sharing controls (opt-in per category, nothing by default, §1.4) |
| P016 | Subscription management: discoverability + online booking entitlements; expiry → 3-month retention + patient-data preservation |
| P016 | Instance-to-instance sync (local ↔ cloud); HTTPS for all non-local connections |
| P016 | AI BYOK configuration distribution (settings transit; gateway itself = infrastructure) |

Modules: `Balsm.Supervisor` federation/pairing/policy features; cloud deployment (planned P016).

## Boundary Notes

- **ADR needed (flagged in roadmap P009):** current `SyncService` merges P009 device↔server outbox with P016 server↔cloud federation. This canvas resolves the *context* question — both flows are one mechanism (SharedKernel) governed by this context's policy — but the implementation disambiguation ADR is still owed.
- AI BYOK *configuration distribution* (P016 deliverable) is entity settings transiting the network; the AI gateway itself is generic infrastructure.
