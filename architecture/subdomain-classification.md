# Subdomain Classification

**Balsm Healthcare Platform — Domain-Driven Design Subdomain Analysis**

> Aligned with constitution v1.8.0 (20 canonical contexts + 2 provisional). Per-context canvases: [`bounded-contexts/`](./bounded-contexts/README.md). This file carries the *why* of each classification and the investment guidance.
>
> This doc is **context-keyed** (solution space). The **problem-keyed** decomposition — domain vision, 17 subdomains, subdomain → context mapping — lives in [`domain-map.md`](./domain-map.md).

---

## Overview

Subdomains fall into three strategic categories:

- **Core Domain**: competitive advantage — innovate and differentiate here
- **Supporting Subdomain**: important, custom-built, not differentiating
- **Generic Subdomain**: commodity — buy, wrap, or use off-the-shelf

Contexts are additionally organized by **data-ownership plane** (ADR-10): Consumer (patient-owned PHI), Provider (entity-owned), Platform (Balsm-owned, non-PHI), Cross-plane.

---

## Core Domains

### 1. Personal Health *(Consumer plane)*
**Why Core**: Balsm's consumer differentiation — the emergency card / lock-screen QR is the viral hook (P001 impact 5/5), and the patient-owned-data architecture (local SQLite primary + user's Drive/iCloud, Balsm holds zero PHI) is the privacy story competitors can't easily copy. The append-only timeline (ADR-12) is the substrate all provider data eventually mirrors into.
**Investment**: Maximum · **Complexity**: High · **Volatility**: High
**Canvas**: [personal-health.md](./bounded-contexts/personal-health.md)

### 2. Clinical Records *(Provider plane)*
**Why Core**: unique clinical documentation workflow, AI-assisted scribe, immutable audit trail, timeline visualization, cross-entity patient record.
**Investment**: Maximum · **Complexity**: Very High · **Volatility**: High
**Canvas**: [clinical-records.md](./bounded-contexts/clinical-records.md)

### 3. Prescriptions *(Provider plane)*
**Why Core**: safety-critical lifecycle FSM, drug interaction/allergy checking, CDSS, and the QR published language that closes the doctor→patient→pharmacy loop (the platform's viral spine, P013 impact 5/5).
**Investment**: Maximum · **Complexity**: Very High · **Volatility**: High
**Canvas**: [prescriptions.md](./bounded-contexts/prescriptions.md)

---

## Supporting Subdomains

| Context | Plane | Why Supporting | Canvas |
|---|---|---|---|
| Provider Directory | Consumer | Curated public map/search; anchors B2C→B2B handoff; standard geo patterns (OSM/PostGIS, ADR-06) | [provider-directory.md](./bounded-contexts/provider-directory.md) |
| Entity Management | Provider | Org structure (workspace/entity/branch/dept/room/bed); foundational, not complex | [entity-management.md](./bounded-contexts/entity-management.md) |
| Inventory | Provider | Stock + catalog with domain-specific rules: controlled-substance schedules (Law 182/1960), FIFO-by-expiry, never-negative invariant. *Reclassified from Generic (2026-07-10): Egyptian regulatory tagging + POS atomicity make off-the-shelf ERP a poor fit* | [inventory.md](./bounded-contexts/inventory.md) |
| Point of Sale | Provider | Highest-impact standalone deliverable (P007), but well-understood retail patterns | [point-of-sale.md](./bounded-contexts/point-of-sale.md) |
| Customer Relations | Provider | Pharmacy's model of a person + unclaimed→claim identity bridge | [customer-relations.md](./bounded-contexts/customer-relations.md) |
| Appointment | Provider | Scheduling with Balsm specifics (house visits, questionnaires, cost estimates); reused by Labs (CF) and Care Delivery | [appointment.md](./bounded-contexts/appointment.md) |
| Pharmacy | Provider | Dispensation correctness + QR verify + controlled gating; important, not differentiating | [pharmacy.md](./bounded-contexts/pharmacy.md) |
| Billing & Finance | Provider | Complex but not unique; gateways behind ACL, PCI-DSS tokenization | [billing-finance.md](./bounded-contexts/billing-finance.md) |
| Labs | Provider | Deep model (ADR-13 analyte↔test↔bundle, demographic ranges, chain of custody) but a stable, standardized domain | [labs.md](./bounded-contexts/labs.md) |
| Radiology | Provider | Standard workflow on DICOM/PACS standards behind ACL | [radiology.md](./bounded-contexts/radiology.md) |
| Care Delivery | Provider | ADT/occupancy/telehealth — operational workflow distinct from documentation | [care-delivery.md](./bounded-contexts/care-delivery.md) |
| Charitable Donations | Provider/Platform | Transparency workflow is valuable but not deep; **corrected from stale "Core" label** — constitution has classified it Supporting since v1.x | [charitable-donations.md](./bounded-contexts/charitable-donations.md) |
| Balsm Network | Platform | Federation pairing, sharing policy (§1.4), entitlements (§1.7); policy is domain, sync plumbing is SharedKernel (ADR-08) | [balsm-network.md](./bounded-contexts/balsm-network.md) |
| Marketplace | Platform | Ecosystem play; **corrected from stale "Core" label** per constitution | [marketplace.md](./bounded-contexts/marketplace.md) |

---

## Generic Subdomains

| Context | Plane | Recommendation | Canvas |
|---|---|---|---|
| Identity & Access | Cross-plane | Lean on Supabase Auth as IdP forever (ADR-03 JWT bridge — no migration); custom PBAC layer on top; dual-mode cloud/local auth is deployment, not domain | [identity-access.md](./bounded-contexts/identity-access.md) |
| Messaging & Notifications | Cross-plane | Wrap FCM/APNs/SMS/OpenWA behind adapters; no PHI over third-party channels (Principle XIV) | [messaging-notifications.md](./bounded-contexts/messaging-notifications.md) |
| Platform Access | Platform | Standard OAuth 2.0 + PKCE, API keys, rate limiting; healthcare-specific consent model is the only custom part | [platform-access.md](./bounded-contexts/platform-access.md) |

---

## Provisional (P021 — not canonical)

| Candidate | Proposed class | Dissolution alternative |
|---|---|---|
| [Community](./bounded-contexts/community.md) | Supporting | Fold into Messaging transport + Personal Health matching input |
| [Population Insights](./bounded-contexts/population-insights.md) | Supporting | Reporting pipeline inside Balsm Network |

---

## Strategic Investment Map

```
High Investment (Core)
├─ Personal Health      ████████████ (Maximum)
├─ Clinical Records     ████████████ (Maximum)
└─ Prescriptions        ████████████ (Maximum)

Moderate Investment (Supporting)
├─ Labs, Billing & Finance, Balsm Network, Care Delivery  █████
├─ Appointment, Point of Sale, Pharmacy, Inventory        ████
└─ Entity Mgmt, Customer Relations, Directory,
   Donations, Marketplace                                 ███

Low Investment (Generic — buy/wrap)
├─ Identity & Access        ██ (Supabase + PBAC layer)
├─ Messaging & Notifications ██ (provider adapters)
└─ Platform Access          ██ (standard OAuth2 stack)
```

Target split: 60-70% of engineering time on Core, 20-30% Supporting, ~10% Generic.

---

## Architecture Implications

### Core Domains
Rich domain models, full tactical DDD (aggregates, domain events, value objects, specifications); exhaustive tests (safety-critical paths constitutional: prescription validation edge cases, auth 100%); continuous refactoring.

### Supporting Subdomains
Clean architecture, domain models where warranted, good integration-test coverage, stable patterns. Do not over-engineer (constitution: simple CRUD stays lightweight).

### Generic Subdomains
Thin wrappers/adapters around services; integration tests against providers; interchangeable vendors.

---

## Evolution Strategy

Re-evaluate classification **each milestone** (constitutional requirement):
- Unique inventory optimization emerges → Inventory pressure toward Core
- AI messaging becomes differentiator → Messaging toward Supporting/Core
- Third-party prescription-safety service matures → Prescriptions pressure toward Supporting
- P021 spec confirms or dissolves the two provisional contexts

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-21 | Initial classification of 13 contexts | Based on competitive positioning analysis |
| 2026-07-10 | **13 → 20 canonical contexts** (constitution v1.8.0); three-plane organization | Derived from PHASED_ROADMAP.md P000-P023: consumer track (ADR-10 patient-owned PHI), pharmacy counter (P007/P008), network/platform tiers (P016/P023) don't map honestly into the 13. New: Personal Health, Provider Directory, Point of Sale, Customer Relations, Care Delivery, Balsm Network, Platform Access |
| 2026-07-10 | Personal Health classified Core | Emergency-card viral hook + patient-owned-data privacy architecture = consumer differentiation |
| 2026-07-10 | Charitable Donations + Marketplace corrected to Supporting | This doc was stale vs constitution; constitution prevails |
| 2026-07-10 | Inventory reclassified Generic → Supporting | Egypt Law 182/1960 controlled-substance tagging, FIFO-by-expiry, POS-atomic deduction — custom fit required |
| 2026-07-10 | `PharmacyInventory` moved Pharmacy → Inventory | One context owns stock |
| 2026-07-10 | Community + Population Insights provisional | P021 too distant to commit; dissolution alternatives documented |

---

## References

- [bounded-contexts/README.md](./bounded-contexts/README.md) — canonical context map + canvases
- [AGENTS.md](../agents/rules/AGENTS.md) — agent rules
- Constitution Principle IV (v1.8.0) — binding context list
- Eric Evans, *Domain-Driven Design* (2003); Vaughn Vernon, *Implementing DDD* (2013)
