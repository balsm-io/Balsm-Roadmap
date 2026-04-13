# Subdomain Map

**Balsm Healthcare Platform - Visual Subdomain Organization**

---

## Strategic Subdomain Landscape

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CORE DOMAINS                                     │
│                    (Competitive Differentiation)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │  Clinical        │  │  Prescriptions   │  │   Charitable     │     │
│  │  Records         │  │                  │  │   Donations      │     │
│  │                  │  │                  │  │                  │     │
│  │ • AI Scribe      │  │ • Drug Safety    │  │ • Case Tracking  │     │
│  │ • Timeline       │  │ • Interactions   │  │ • Transparency   │     │
│  │ • Audit Trail    │  │ • CDSS           │  │ • Social Impact  │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                           │
│  ┌──────────────────┐                                                   │
│  │  Marketplace     │                                                   │
│  │                  │                                                   │
│  │ • Add-Ons        │                                                   │
│  │ • Developer      │                                                   │
│  │ • Ecosystem      │                                                   │
│  └──────────────────┘                                                   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      SUPPORTING SUBDOMAINS                               │
│                  (Custom-Built, Domain-Specific)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Appointment │  │    Labs     │  │  Radiology  │  │  Pharmacy   │  │
│  │             │  │             │  │             │  │             │  │
│  │ • Waiting   │  │ • Orders    │  │ • DICOM     │  │ • Dispense  │  │
│  │ • Schedule  │  │ • QC        │  │ • PACS      │  │ • Delivery  │  │
│  │ • Cost Est  │  │ • LOINC     │  │ • Reports   │  │ • QR Verify │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐                                      │
│  │  Billing &  │  │   Entity    │                                      │
│  │  Finance    │  │  Management │                                      │
│  │             │  │             │                                      │
│  │ • Claims    │  │ • Branch    │                                      │
│  │ • Insurance │  │ • Dept      │                                      │
│  │ • Revenue   │  │ • Room/Bed  │                                      │
│  └─────────────┘  └─────────────┘                                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                       GENERIC SUBDOMAINS                                 │
│                    (Commodity/Buy Solutions)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │  Identity &      │  │   Inventory      │  │   Messaging &    │     │
│  │  Access          │  │                  │  │   Notifications  │     │
│  │                  │  │                  │  │                  │     │
│  │ • Auth/OAuth     │  │ • Stock          │  │ • SMS            │     │
│  │ • Permissions    │  │ • PO             │  │ • Email          │     │
│  │ • Sessions       │  │ • Vendors        │  │ • Push           │     │
│  │                  │  │                  │  │ • Chat           │     │
│  │ Consider:        │  │ Consider:        │  │ Consider:        │     │
│  │ Auth0/Keycloak   │  │ ERP Integration  │  │ Twilio/SendGrid  │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Investment Heat Map

```
                    Complexity
                    ↑
                    │
         Very High  │   ┌─────────┐  ┌─────────┐
                    │   │Clinical │  │Prescrip.│
                    │   │ Records │  │         │
                    │   └─────────┘  └─────────┘
                    │
            High    │   ┌─────────┐  ┌─────────┐  ┌─────────┐
                    │   │Billing &│  │  Labs   │  │Radiology│
                    │   │ Finance │  └─────────┘  └─────────┘
                    │   └─────────┘  ┌─────────┐
                    │                │Appoint. │
            Medium  │   ┌─────────┐  └─────────┘  ┌─────────┐
                    │   │Identity │  ┌─────────┐  │Charity  │
                    │   │& Access │  │Pharmacy │  │Donation │
                    │   └─────────┘  └─────────┘  └─────────┘
                    │   ┌─────────┐  ┌─────────┐  ┌─────────┐
            Low     │   │Messaging│  │Inventory│  │ Entity  │
                    │   │& Notif. │  └─────────┘  │  Mgmt   │
                    │   └─────────┘               └─────────┘
                    │                              ┌─────────┐
                    │                              │Market-  │
                    │                              │ place   │
                    │                              └─────────┘
                    └──────────────────────────────────────────────→
                        Low         Medium          High      Strategic
                                                              Importance
```

**Legend:**
- Top-right quadrant: Maximum investment (Core, Complex)
- Bottom-right quadrant: High investment (Strategic, Simpler)
- Top-left quadrant: Optimize/Simplify (Complex, Low value)
- Bottom-left quadrant: Automate/Outsource (Generic)

---

## Context Map (DDD Pattern)

```
┌────────────────────────────────────────────────────────────────────┐
│                         UPSTREAM CONTEXTS                           │
└────────────────────────────────────────────────────────────────────┘
                                   │
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
         ┌────────────────────┐        ┌────────────────────┐
         │  Identity & Access │        │ Entity Management  │
         │    (Generic)       │        │   (Supporting)     │
         └──────┬─────────────┘        └──────┬─────────────┘
                │                             │
                │ ACL                         │ ACL
                │                             │
                └──────────────┬──────────────┘
                               │
                               │
                    ┌──────────┴──────────────────────┐
                    │                                  │
                    ▼                                  ▼
         ┌────────────────────┐            ┌────────────────────┐
         │ Clinical Records   │◄───────────┤   Prescriptions    │
         │     (CORE)         │    Events  │      (CORE)        │
         └──────┬─────────────┘            └──────┬─────────────┘
                │                                  │
                │ Events                           │ Events
                │                                  │
       ┌────────┼────────┬─────────────────────────┼──────────┐
       │        │        │                         │          │
       ▼        ▼        ▼                         ▼          ▼
  ┌────────┐ ┌────┐ ┌─────────┐              ┌──────────┐ ┌────────┐
  │  Labs  │ │Rad.│ │Appoint. │              │ Pharmacy │ │Billing │
  │(Support)│ │(Sup)│ │(Support)│              │(Support) │ │(Support)│
  └────────┘ └────┘ └─────────┘              └──────────┘ └────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DOWNSTREAM CONTEXTS                             │
└─────────────────────────────────────────────────────────────────────┘
                    │                       │
                    ▼                       ▼
         ┌────────────────────┐  ┌────────────────────┐
         │   Messaging &      │  │   Marketplace      │
         │   Notifications    │  │      (Core)        │
         │    (Generic)       │  └────────────────────┘
         └────────────────────┘
                    │
                    ▼
         External Services:
         • Twilio (SMS)
         • SendGrid (Email)
         • Firebase (Push)
```

**Relationship Patterns:**
- **ACL** (Anti-Corruption Layer): Protects downstream context from upstream changes
- **Events**: Asynchronous communication via domain events
- **Shared Kernel**: Minimal shared code (only for value objects/contracts)

---

## Team Ownership Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLINICAL TEAM (Team A)                        │
├─────────────────────────────────────────────────────────────────┤
│ • Clinical Records (Core)                                        │
│ • Care Coordination                                              │
│ • Timeline & Audit                                               │
│ • AI Scribe Integration                                          │
│                                                                   │
│ Skills: Senior devs, Healthcare domain, AI/ML                    │
│ Size: 5-7 developers                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               PHARMACEUTICAL TEAM (Team B)                       │
├─────────────────────────────────────────────────────────────────┤
│ • Prescriptions (Core)                                           │
│ • Drug Safety & Interactions                                     │
│ • Pharmacy Operations (Supporting)                               │
│ • CDSS Integration                                               │
│                                                                   │
│ Skills: Senior devs, Pharmacy domain, Safety-critical systems    │
│ Size: 4-6 developers                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              PLATFORM TEAM (Team C)                              │
├─────────────────────────────────────────────────────────────────┤
│ • Marketplace (Core)                                             │
│ • Charitable Donations (Core)                                    │
│ • Identity & Access (Generic)                                    │
│ • Entity Management (Supporting)                                 │
│                                                                   │
│ Skills: Mid-senior devs, Platform/API design, Security           │
│ Size: 4-5 developers                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            CLINICAL OPERATIONS TEAM (Team D)                     │
├─────────────────────────────────────────────────────────────────┤
│ • Appointments (Supporting)                                      │
│ • Labs (Supporting)                                              │
│ • Radiology (Supporting)                                         │
│                                                                   │
│ Skills: Mid-level devs, Healthcare workflows, Integration        │
│ Size: 4-5 developers                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            BUSINESS OPERATIONS TEAM (Team E)                     │
├─────────────────────────────────────────────────────────────────┤
│ • Billing & Finance (Supporting)                                 │
│ • Inventory (Generic)                                            │
│ • Messaging & Notifications (Generic)                            │
│                                                                   │
│ Skills: Mid-level devs, ERP/Financial domain, Integrations       │
│ Size: 3-4 developers                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Recommendations

### Core Domains
**Rich Domain Models with Full DDD Tactical Patterns**

```yaml
Clinical Records:
  Architecture: Onion Architecture
  Patterns:
    - Aggregates (PatientRecord, Entry)
    - Domain Events (RecordUpdated, ConsentGranted)
    - Value Objects (Timeline, CareTeamMember)
    - Repositories (UnitOfWork)
    - Domain Services (AuditLogger, TimelineBuilder)
  Testing: 90%+ coverage
  Performance: Cache-aside pattern, CQRS for read-heavy operations

Prescriptions:
  Architecture: Hexagonal Architecture
  Patterns:
    - Aggregates (Prescription, Medication)
    - Domain Events (PrescriptionCreated, DrugInteractionDetected)
    - Value Objects (Dosage, DrugCode)
    - Specifications (DrugInteractionSpec, AllergySpec)
    - Domain Services (SafetyValidator, InteractionChecker)
  Testing: 95%+ coverage (safety-critical)
  Performance: Real-time validation, in-memory cache for drug database
```

### Supporting Subdomains
**Clean Architecture with Selective DDD Patterns**

```yaml
Appointment:
  Architecture: Clean Architecture
  Patterns:
    - Aggregates (Appointment, Schedule)
    - Domain Events (AppointmentBooked, SlotReleased)
    - Repositories
  Testing: 80%+ coverage
  Performance: Slot availability caching

Labs:
  Architecture: Clean Architecture
  Patterns:
    - Aggregates (LabOrder, Specimen)
    - Domain Events (ResultPublished)
    - Domain Services (QualityControlService)
  Testing: 80%+ coverage
  Performance: Batch processing for bulk results
```

### Generic Subdomains
**Thin Wrappers Around Services**

```yaml
Identity & Access:
  Architecture: Adapter/Port Pattern
  Integration: Auth0 / Keycloak (OAuth 2.0 / OIDC)
  Custom: PBAC permission layer
  Testing: Integration tests with identity provider
  Performance: Token caching, session management

Messaging & Notifications:
  Architecture: Adapter pattern
  Integration:
    - Twilio (SMS)
    - SendGrid (Email)
    - Firebase Cloud Messaging (Push)
  Testing: Mock external services in tests
  Performance: Queue-based delivery, batch notifications
```

---

## Quick Reference: When to Invest

| Subdomain | Invest Time | Build Quality | Innovation | Buy vs Build |
|-----------|-------------|---------------|------------|--------------|
| **Core** | 60-70% | Highest | Continuous | Always Build |
| **Supporting** | 20-30% | High | Periodic | Build (custom fit) |
| **Generic** | 5-10% | Good Enough | Minimal | Buy/Integrate |

---

## Next Actions

1. **Review & Validate**: Present to leadership and technical stakeholders
2. **Team Formation**: Organize teams around subdomain ownership
3. **Technology Audit**: Evaluate current implementations against classification
4. **Investment Plan**: Create quarterly OKRs aligned with subdomain priorities
5. **Quarterly Reassessment**: Review classification as business strategy evolves

---

## Related Documents

- [subdomain-classification.md](./subdomain-classification.md) — Detailed analysis and rationale
- [communication-architecture.md](./communication-architecture.md) — Inter-context communication patterns
- [AGENTS.md](../agents/rules/AGENTS.md) — Bounded context definitions and coding rules
- [BUSINESS_FEATURES.md](../BUSINESS_FEATURES.md) — Feature specifications per subdomain
