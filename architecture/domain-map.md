# Domain Map

**Balsm Healthcare Platform — Problem-Space Decomposition**

> The **problem-space** companion to [`bounded-contexts/`](./bounded-contexts/README.md) (solution space). Subdomains are *discovered* business problems — they exist whether or not Balsm writes software. Bounded contexts are *designed* models that solve them. Derived from [`Balsm-Draft/PHASED_ROADMAP.md`](../../Balsm-Draft/PHASED_ROADMAP.md) (P000–P023). Aligned with constitution v1.8.0.

---

## Domain Vision Statement

> Balsm digitizes the Egyptian/MENA care loop — patient → doctor → prescription → pharmacy → records — at near-zero infrastructure cost for providers (offline-first local servers) while making personal health data patient-owned and portable (device + user's own cloud; Balsm holds no PHI).
>
> **Differentiation:** the emergency-accessible, patient-owned health record, and the safety-checked digital prescription loop.
> **Revenue:** network subscriptions once the loop is proven locally (Tier C onward).

---

## Hierarchy: Domain → Domain Areas → Subdomains

Domain areas are **narrative groupings for orientation only** — no architectural rules attach to them. Boundaries live at the subdomain (problem) and bounded-context (solution) levels. Do not treat an area as a mega-context.

Areas ≠ data-ownership planes: planes (ADR-10) cut by *data owner* and govern architecture; areas cut by *actor's world* and govern conversation.

```
BALSM — Connected Healthcare (Egypt/MENA)
│
├── 1. CONSUMER HEALTH  ..................... the patient's world
│   ├── Personal Health Stewardship ★CORE      (P001-003, P021)
│   └── Care Relationship & Discovery          (P003, P016)
│
├── 2. CARE DELIVERY  ....................... the clinician's world
│   ├── Clinical Care Documentation ★CORE      (P012, P020)
│   ├── Medication Safety & Prescribing ★CORE  (P013, P020)
│   ├── Care Scheduling                        (P011)
│   ├── Diagnostics                            (P017-018)
│   └── Inpatient & Remote Care                (P019)
│
├── 3. PHARMACY & COMMERCE  ................. the counter's world
│   ├── Pharmacy Retail Operations             (P006-008)
│   ├── Medication Dispensing                  (P007, P013)
│   └── Healthcare Commerce                    (P007, P015)
│
├── 4. PLATFORM & NETWORK  .................. the business-model's world
│   ├── Network & Federation                   (P009, P016 — revenue engine)
│   ├── Ecosystem & Extensibility              (P022-023)
│   ├── Social Impact                          (P021)
│   ├── Population Health Insight              (P021)
│   └── Organization Management                (P000, P005, P014)
│
└── 5. FOUNDATION (generic)  ................ everyone's plumbing
    ├── Identity & Trust                       (P001, P004)
    └── Communication                          (P011+)
```

Core bets sit only in areas 1–2: one consumer bet (stewardship), two clinical bets (documentation, prescribing). Areas 3–5 are Supporting/Generic by design — the counter and platform tiers win on execution, not differentiation.

---

## Subdomain Inventory

### Core Subdomains — the bets

Problems whose solution differentiates Balsm. Deepest modeling, best effort, richest behavior.

#### 1. Personal Health Stewardship ★

- **Problem:** People cannot carry, control, or share their own health information; emergencies happen with zero medical context available.
- **Why Core:** The emergency card / lock-screen QR is the viral hook (P001 scored 15/15); patient-owned storage (ADR-10) is the privacy story competitors cannot cheaply copy.
- **Phases:** P001, P002, P003 (family), P021 (triage, PROs)
- **Context(s):** [Personal Health](./bounded-contexts/personal-health.md)

#### 2. Clinical Care Documentation ★

- **Problem:** Encounters go undocumented or paper-bound; records fragment across providers; no audit trail exists.
- **Why Core:** Immutable, auditable, cross-entity clinical documentation with AI-assisted capture is the professional-side differentiator.
- **Phases:** P012, P020 (ambient scribe)
- **Context(s):** [Clinical Records](./bounded-contexts/clinical-records.md)

#### 3. Medication Safety & Prescribing ★

- **Problem:** Handwritten prescriptions are forgeable, uncheckable, and unsafe — no interaction or allergy checking exists at the point of prescribing.
- **Why Core:** The safety-checked digital prescription loop (doctor → QR → pharmacy) is the platform's viral spine and its patient-safety claim (Principle I).
- **Phases:** P013, P020 (CDSS)
- **Context(s):** [Prescriptions](./bounded-contexts/prescriptions.md)

### Supporting Subdomains — necessary, custom-fit, not the bet

#### 4. Pharmacy Retail Operations

- **Problem:** Egyptian pharmacies run stock, sales, and cash on paper.
- **Phases:** P006, P007, P008
- **Context(s):** [Inventory](./bounded-contexts/inventory.md) + [Point of Sale](./bounded-contexts/point-of-sale.md) + [Customer Relations](./bounded-contexts/customer-relations.md) — **1:3**, one business capability, three colliding-if-merged models

#### 5. Medication Dispensing

- **Problem:** Verifying prescription authenticity and complying with controlled-substance law (182/1960) at the counter.
- **Phases:** P007, P013
- **Context(s):** [Pharmacy](./bounded-contexts/pharmacy.md)

#### 6. Care Scheduling

- **Problem:** Booking chaos, no-shows, walk-in queues.
- **Phases:** P011 (+P017 house visits reuse, P019 telehealth booking)
- **Context(s):** [Appointment](./bounded-contexts/appointment.md)

#### 7. Care Relationship & Discovery

- **Problem:** Patients cannot find, evaluate, or reach providers.
- **Phases:** P003, P016, P017 (test search)
- **Context(s):** [Provider Directory](./bounded-contexts/provider-directory.md) (+ the discoverability slice of [Balsm Network](./bounded-contexts/balsm-network.md) — the one documented subdomain/context blur)

#### 8. Diagnostics

- **Problem:** Order-to-result workflows with quality control, chain of custody, and patient result delivery.
- **Phases:** P017 (labs), P018 (imaging)
- **Context(s):** [Labs](./bounded-contexts/labs.md) + [Radiology](./bounded-contexts/radiology.md) — **1:2**, same problem shape, incompatible models (analytes/ranges/QC vs DICOM/RadLex)

#### 9. Inpatient & Remote Care

- **Problem:** Beds, admissions, discharge continuity, and care at distance.
- **Phases:** P019
- **Context(s):** [Care Delivery](./bounded-contexts/care-delivery.md)

#### 10. Healthcare Commerce

- **Problem:** Getting paid — bills, insurance, VAT, card compliance.
- **Phases:** P007 (counter payments), P015
- **Context(s):** [Billing & Finance](./bounded-contexts/billing-finance.md)

#### 11. Organization Management

- **Problem:** Multi-branch healthcare organizations need structure — entities, branches, departments, staff.
- **Phases:** P000, P005, P014
- **Context(s):** [Entity Management](./bounded-contexts/entity-management.md)

#### 12. Network & Federation

- **Problem:** Isolated local installations must join a paid network safely — consented sharing, discoverability, entitlements. **This is the revenue engine.**
- **Phases:** P009, P016
- **Context(s):** [Balsm Network](./bounded-contexts/balsm-network.md)

#### 13. Ecosystem & Extensibility

- **Problem:** Third parties want to build on the platform safely.
- **Phases:** P022, P023
- **Context(s):** [Marketplace](./bounded-contexts/marketplace.md) + [Platform Access](./bounded-contexts/platform-access.md) — **1:2**, listing/review vs authorization

#### 14. Social Impact

- **Problem:** Medical-case charity and peer support — MENA-viral, mission-aligned.
- **Phases:** P021
- **Context(s):** [Charitable Donations](./bounded-contexts/charitable-donations.md) (+ provisional [Community](./bounded-contexts/community.md))

#### 15. Population Health Insight

- **Problem:** Partners and public health need aggregate demand/health patterns without individual exposure.
- **Phases:** P021
- **Context(s):** provisional [Population Insights](./bounded-contexts/population-insights.md)

### Generic Subdomains — real problems, commodity solutions

#### 16. Identity & Trust

- **Problem:** Who is who — patients, staff, devices, and consent to act for another.
- **Buy/wrap:** Supabase Auth as IdP forever (ADR-03), custom PBAC layer.
- **Phases:** P001, P004, P010, P014
- **Context(s):** [Identity & Access](./bounded-contexts/identity-access.md)

#### 17. Communication

- **Problem:** Reaching people on channels they actually read.
- **Buy/wrap:** FCM/APNs/SMS/WhatsApp-gateway adapters; no PHI over third-party channels (Principle XIV).
- **Phases:** P011+
- **Context(s):** [Messaging & Notifications](./bounded-contexts/messaging-notifications.md)

---

## Subdomain → Context Mapping (summary)

| # | Subdomain | Class | Context(s) |
|---|---|---|---|
| 1 | Personal Health Stewardship | **Core** | Personal Health |
| 2 | Clinical Care Documentation | **Core** | Clinical Records |
| 3 | Medication Safety & Prescribing | **Core** | Prescriptions |
| 4 | Pharmacy Retail Operations | Supporting | Inventory + Point of Sale + Customer Relations |
| 5 | Medication Dispensing | Supporting | Pharmacy |
| 6 | Care Scheduling | Supporting | Appointment |
| 7 | Care Relationship & Discovery | Supporting | Provider Directory (+ Balsm Network slice) |
| 8 | Diagnostics | Supporting | Labs + Radiology |
| 9 | Inpatient & Remote Care | Supporting | Care Delivery |
| 10 | Healthcare Commerce | Supporting | Billing & Finance |
| 11 | Organization Management | Supporting | Entity Management |
| 12 | Network & Federation | Supporting | Balsm Network |
| 13 | Ecosystem & Extensibility | Supporting | Marketplace + Platform Access |
| 14 | Social Impact | Supporting | Charitable Donations (+ Community*) |
| 15 | Population Health Insight | Supporting | Population Insights* |
| 16 | Identity & Trust | Generic | Identity & Access |
| 17 | Communication | Generic | Messaging & Notifications |

\* provisional contexts — P021 gate.

**Invariants of the mapping:**

- Core problems ↔ Core contexts align 3↔3 — the investment story is consistent across problem and solution space.
- No context serves two subdomains — no model pulled by two problem masters (sole documented blur: Balsm Network's discoverability slice serving subdomain 7).
- Roadmap tiers ≈ subdomain activation order: Tier A → 1, 4, 5, 16 · Tier B → 2, 3, 6, 10, 11 · Tier C → 7, 8, 9, 12 · Tier D → 13, 14, 15.

---

## Evolution Triggers

Classification is a bet about the market — revisit each milestone (constitutional):

| Trigger | Reclassification pressure |
|---|---|
| Inventory optimization becomes a selling point pharmacies switch for | Pharmacy Retail Operations → Core |
| A mature third-party prescription-safety service emerges in MENA | Medication Safety & Prescribing → Supporting (buy the checker, keep the loop) |
| Network subscriptions dominate revenue and competitors copy the loop | Network & Federation → Core |
| Emergency card commoditized by OS vendors (Apple/Google health cards) | Personal Health Stewardship differentiation shifts to timeline/records portability |
| P021 spec lands | Confirm or dissolve Community + Population Insights; re-cut Social Impact / Insight subdomains if scope shrank |

---

## Related Documents

- [bounded-contexts/README.md](./bounded-contexts/README.md) — solution space: context map, canvases, module/phase mappings
- [subdomain-classification.md](./subdomain-classification.md) — context-keyed classification + investment guidance
- [subdomain-map.md](./subdomain-map.md) — visual overview
- Constitution Principle IV (v1.8.0)

## Decision Log

| Date | Decision |
|---|---|
| 2026-07-11 | Initial problem-space decomposition from PHASED_ROADMAP.md: 1 domain, 5 narrative domain areas, 17 subdomains (3 Core / 12 Supporting / 2 Generic); subdomain→context mapping with three 1:N rows (Retail Ops 1:3, Diagnostics 1:2, Ecosystem 1:2); domain areas declared rule-free narrative groupings. |
