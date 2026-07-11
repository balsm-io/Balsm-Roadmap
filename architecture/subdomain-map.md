# Subdomain Map

**Balsm Healthcare Platform — Visual Subdomain Organization**

> Canonical context definitions + canvases: [`bounded-contexts/`](./bounded-contexts/README.md). This file is the visual overview. Classification rationale: [`subdomain-classification.md`](./subdomain-classification.md). Aligned with constitution v1.8.0 (20 canonical contexts, three data-ownership planes per ADR-10).

---

## Strategic Subdomain Landscape

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              CORE DOMAINS                                  │
│                       (Competitive Differentiation)                        │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │ Personal Health  │  │ Clinical Records │  │  Prescriptions   │        │
│  │ (Consumer plane) │  │ (Provider plane) │  │ (Provider plane) │        │
│  │                  │  │                  │  │                  │        │
│  │ • Emergency Card │  │ • Encounters     │  │ • Lifecycle FSM  │        │
│  │ • Timeline (ADR-12)│ │ • AI Scribe     │  │ • QR Dispensing  │        │
│  │ • Patient-owned  │  │ • Immutability   │  │ • Drug Safety    │        │
│  │   PHI (ADR-10)   │  │ • Audit Trail    │  │ • CDSS           │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                         SUPPORTING SUBDOMAINS                              │
│                     (Custom-Built, Domain-Specific)                        │
├───────────────────────────────────────────────────────────────────────────┤
│ Consumer plane:                                                            │
│  ┌───────────────┐                                                         │
│  │Provider       │                                                         │
│  │Directory      │                                                         │
│  └───────────────┘                                                         │
│ Provider plane:                                                            │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │  Entity   │ │ Inventory │ │ Point of  │ │ Customer  │ │Appointment│   │
│  │Management │ │           │ │   Sale    │ │ Relations │ │           │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Pharmacy  │ │ Billing & │ │   Labs    │ │ Radiology │ │   Care    │   │
│  │           │ │  Finance  │ │ (ADR-13)  │ │           │ │ Delivery  │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│  ┌───────────┐                                                            │
│  │Charitable │                                                            │
│  │ Donations │                                                            │
│  └───────────┘                                                            │
│ Platform plane:                                                            │
│  ┌───────────┐ ┌───────────┐   provisional: ┌───────────┐ ┌───────────┐  │
│  │   Balsm   │ │Marketplace│                │ Community*│ │Population │  │
│  │  Network  │ │           │                │           │ │ Insights* │  │
│  └───────────┘ └───────────┘                └───────────┘ └───────────┘  │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                          GENERIC SUBDOMAINS                                │
│                        (Commodity / Buy / Wrap)                            │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │ Identity &       │  │ Messaging &      │  │ Platform Access  │        │
│  │ Access           │  │ Notifications    │  │                  │        │
│  │                  │  │                  │  │ • OAuth2 + PKCE  │        │
│  │ • Supabase Auth  │  │ • FCM/APNs/SMS   │  │ • API Keys       │        │
│  │ • JWT bridge     │  │ • WhatsApp gw    │  │ • Rate Limits    │        │
│  │   (ADR-03)       │  │ • No PHI (XIV)   │  │ • Consent Grants │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└───────────────────────────────────────────────────────────────────────────┘

* provisional — confirmed or dissolved at P021 spec time
```

---

## Three Data-Ownership Planes (ADR-10)

```
CONSUMER PLANE                PROVIDER PLANE               PLATFORM PLANE
patient-owned PHI             entity-owned data            Balsm-owned, non-PHI
─────────────────             ──────────────────           ───────────────────
Local SQLite (primary)        .NET local server            Balsm Cloud (Postgres)
+ Drive/iCloud (optional)     SQLite per-module schema     multi-tenant

Personal Health ★             Entity Mgmt   Inventory      Balsm Network
Provider Directory            Point of Sale Customer Rel.  Platform Access
                              Appointment   Clinical ★     Marketplace
                              Prescriptions ★ Pharmacy     (Community*)
                              Billing  Labs  Radiology     (Population Insights*)
                              Care Delivery  Donations

              CROSS-PLANE: Identity & Access (JWT bridge, ADR-03)
                           Messaging & Notifications
```

Same word, different model per plane: a consumer-plane "Record" is a patient-owned append-only ledger entry; a provider-plane "Record" is an entity-owned encounter log. They meet only through mirror entries behind an ACL (ADR-12, `external_source`).

---

## Context Map (summary)

Full relationship matrix + mermaid diagram: [`bounded-contexts/README.md`](./bounded-contexts/README.md#context-map).

Key structural facts:

- **Identity & Access** is the universal upstream — Supabase-issued JWT validated everywhere (ADR-03), including offline local servers (cached public key).
- **The care loop**: Appointment → Clinical Records → Prescriptions → Pharmacy → (mirror) Personal Health.
- **The counter loop**: Point of Sale ↔ Pharmacy (partnership) → Inventory (sync `DeductStock` command, single local transaction) → Customer Relations / Billing (events).
- **Balsm Network** is the gatekeeper: nothing crosses instances except through the entity sharing policy (BRD §1.4).
- **Platform Access** is the only third-party door: patient PHI via OAuth consent only; entity API keys never grant PHI.
- **Messaging & Notifications** is everyone's downstream; no context talks to FCM/APNs/Twilio/OpenWA directly.

---

## Investment Heat Map

```
                Complexity
                ↑
     Very High  │  Clinical Records ★   Prescriptions ★   Labs
                │
         High   │  Personal Health ★    Billing & Finance  Balsm Network
                │  Care Delivery        Radiology
                │
       Medium   │  Appointment  Point of Sale  Pharmacy   Platform Access
                │  Identity & Access    Charitable Donations  Marketplace
                │
          Low   │  Inventory  Customer Relations  Entity Mgmt
                │  Messaging & Notif.   Provider Directory
                └────────────────────────────────────────────→
                   Low            Medium            High
                              Strategic Importance

★ = Core Domain (max investment)
```

---

## Quick Reference: When to Invest

| Subdomain type | Invest time | Build quality | Buy vs build |
|---|---|---|---|
| **Core** (Personal Health, Clinical Records, Prescriptions) | 60-70% | Highest | Always build |
| **Supporting** (14 contexts) | 20-30% | High | Build (custom fit) |
| **Generic** (Identity, Messaging, Platform Access) | 5-10% | Good enough | Buy/wrap (Supabase Auth, FCM/APNs, standard OAuth2 server) |

---

## Related Documents

- [bounded-contexts/README.md](./bounded-contexts/README.md) — canonical context map, canvases, module/phase mappings
- [subdomain-classification.md](./subdomain-classification.md) — classification rationale + decision log
- [communication-architecture.md](./communication-architecture.md) — inter-context communication patterns
- [AGENTS.md](../agents/rules/AGENTS.md) — agent rules referencing the contexts
- Constitution Principle IV — the binding rule set (v1.8.0)
