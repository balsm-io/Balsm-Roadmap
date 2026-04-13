# Subdomain Classification

**Balsm Healthcare Platform - Domain-Driven Design Subdomain Analysis**

---

## Overview

In Domain-Driven Design, subdomains are classified into three strategic categories:

- **Core Domain**: Your competitive advantage, where you innovate and differentiate
- **Supporting Subdomain**: Important for the business but not differentiating, custom-built to fit your needs
- **Generic Subdomain**: Common solutions that could be bought or use off-the-shelf solutions

This classification guides investment priorities, team allocation, and architectural decisions.

---

## Subdomain Classification

### Core Domains (Competitive Advantage)

These are the subdomains that make Balsm unique and provide competitive differentiation in the healthcare market.

#### 1. Clinical Records
**Bounded Context**: Clinical Records
**Why Core**:
- Balsm's unique clinical documentation workflow and AI-assisted scribe features
- Immutable audit trail and timeline visualization
- Integration of care team coordination
- Self-report and discharge follow-up workflows

**Investment**: Maximum — this is where Balsm's innovation happens
**Complexity**: Very High
**Volatility**: High — evolves with clinical best practices and AI capabilities

**Key Entities**: PatientRecord, Entry, CareTeam, Referral, Consent, SelfReport, DischargeFollowUp, Timeline

---

#### 2. Prescriptions
**Bounded Context**: Prescriptions
**Why Core**:
- Advanced drug interaction detection and allergy checking
- Pharmacovigilance integration
- Recurring prescription management with intelligent scheduling
- Real-time validity checking and clinical decision support

**Investment**: Maximum — patient safety and clinical quality differentiator
**Complexity**: Very High
**Volatility**: High — regulatory changes, new drug databases, safety rules

**Key Entities**: Prescription, Medication, DrugInteraction, Validity, RecurringPrescription

---

#### 3. Charitable Donations
**Bounded Context**: Charitable Donations
**Why Core**:
- Unique to Balsm's social impact mission
- Transparent donation tracking and case updates
- Integration with clinical care for charity patients

**Investment**: High — unique market differentiator for social impact
**Complexity**: Medium
**Volatility**: Medium — business rules evolve with charity programs

**Key Entities**: Charity, DonationCase, Donation, CaseUpdate

---

#### 4. Marketplace
**Bounded Context**: Marketplace
**Why Core**:
- Balsm's platform extensibility strategy
- Third-party developer ecosystem
- Add-on review and approval workflows

**Investment**: High — enables ecosystem growth and revenue expansion
**Complexity**: Medium-High
**Volatility**: Medium — evolves with platform strategy

**Key Entities**: AddOn, AddOnDeveloper, AddOnReview, AddOnListing

---

### Supporting Subdomains (Custom-Built, Domain-Specific)

These subdomains require custom solutions tailored to Balsm's healthcare workflows but don't provide primary competitive differentiation.

#### 5. Appointment
**Bounded Context**: Appointment
**Why Supporting**:
- Standard scheduling with Balsm-specific features (house visits, questionnaires, cost estimates)
- Waiting list management
- Integration with clinical workflow

**Investment**: Moderate — important but well-understood domain
**Complexity**: Medium-High
**Volatility**: Low-Medium

**Key Entities**: Appointment, Slot, Schedule, WaitingList, HouseVisit, Questionnaire, CostEstimate

---

#### 6. Labs
**Bounded Context**: Labs
**Why Supporting**:
- Standard lab workflow with quality control
- LOINC integration
- Specimen tracking

**Investment**: Moderate — critical but not differentiating
**Complexity**: Medium-High
**Volatility**: Low — stable domain

**Key Entities**: LabOrder, Specimen, TestResult, QualityControl

---

#### 7. Radiology
**Bounded Context**: Radiology
**Why Supporting**:
- Standard radiology workflow
- DICOM/PACS integration
- Structured reporting

**Investment**: Moderate — critical but standardized
**Complexity**: Medium-High
**Volatility**: Low — stable domain with DICOM standards

**Key Entities**: ImagingOrder, Study, RadiologyReport, PACS

---

#### 8. Pharmacy
**Bounded Context**: Pharmacy
**Why Supporting**:
- Dispensation workflow specific to Balsm's model
- QR code verification
- Delivery tracking

**Investment**: Moderate — important for operational workflow
**Complexity**: Medium
**Volatility**: Low-Medium

**Key Entities**: Pharmacy, PharmacyInventory, Dispensation, QRCode, Delivery

---

#### 9. Billing & Finance
**Bounded Context**: Billing & Finance
**Why Supporting**:
- Healthcare billing is complex but not unique to Balsm
- Insurance integration required
- Revenue tracking specific to multi-entity model

**Investment**: Moderate — essential but not differentiating
**Complexity**: High
**Volatility**: Medium — regulatory and insurance changes

**Key Entities**: Bill, Claim, Payment, InsurancePolicy, Revenue

---

#### 10. Entity Management
**Bounded Context**: Entity Management
**Why Supporting**:
- Multi-tenant organization structure specific to Balsm's model
- Branch, department, room, bed hierarchy

**Investment**: Moderate — foundational but not complex
**Complexity**: Medium
**Volatility**: Low

**Key Entities**: Entity, Branch, Department, Room, Bed

---

### Generic Subdomains (Commodity Solutions)

These subdomains solve common problems that don't require Balsm-specific implementations. Consider using or integrating third-party solutions.

#### 11. Identity & Access
**Bounded Context**: Identity & Access
**Why Generic**:
- Standard authentication, authorization, session management
- Permission-based access control
- Could use Auth0, Keycloak, or similar

**Investment**: Low-Moderate — use existing solutions where possible
**Complexity**: Medium
**Volatility**: Low
**Recommendation**: Consider OAuth/OIDC provider, custom PBAC layer on top

**Key Entities**: User, Account, Permission, PermissionGroup, Team, Session, Authentication, Caregiver, EmergencyProfile, HealthPassport

---

#### 12. Inventory
**Bounded Context**: Inventory
**Why Generic**:
- Standard inventory management
- Purchase orders, vendor management, stock tracking
- Off-the-shelf ERP integration possible

**Investment**: Low — minimize custom code
**Complexity**: Medium
**Volatility**: Low
**Recommendation**: Integrate with existing inventory system or use lightweight ERP

**Key Entities**: Item, PurchaseOrder, Vendor, StockLevel

---

#### 13. Messaging & Notifications
**Bounded Context**: Messaging & Notifications
**Why Generic**:
- Standard messaging and notification patterns
- Could use Twilio, SendGrid, Firebase, etc.

**Investment**: Low — use third-party services
**Complexity**: Low-Medium
**Volatility**: Low
**Recommendation**: Use notification service provider + thin wrapper

**Key Entities**: Conversation, Message, Notification, Announcement

---

## Strategic Investment Map

```
High Investment (Core Domains)
├─ Clinical Records ████████████ (Maximum)
├─ Prescriptions ████████████ (Maximum)
├─ Charitable Donations ███████ (High)
└─ Marketplace ███████ (High)

Moderate Investment (Supporting Subdomains)
├─ Appointment ████ (Moderate)
├─ Labs ████ (Moderate)
├─ Radiology ████ (Moderate)
├─ Pharmacy ████ (Moderate)
├─ Billing & Finance ████ (Moderate)
└─ Entity Management ████ (Moderate)

Low Investment (Generic Subdomains)
├─ Identity & Access ██ (Low-Moderate, leverage existing)
├─ Inventory ██ (Low, integrate/buy)
└─ Messaging & Notifications ██ (Low, use services)
```

---

## Team Allocation Recommendations

### Core Domain Teams (Highly Skilled, Domain Experts)

**Clinical Records Team**
- Senior developers with healthcare domain knowledge
- Clinical SME collaboration
- AI/ML specialists for ambient scribe features

**Prescriptions Team**
- Senior developers with pharmaceutical knowledge
- Pharmacist SME on team
- Focus on safety-critical systems

**Charitable Donations Team**
- Mid-senior developers
- Social impact/NGO domain knowledge

**Marketplace Team**
- Senior developers with platform/API design expertise
- Developer experience (DX) focus

### Supporting Domain Teams (Solid Developers)

**Clinical Operations Team** (Appointment, Labs, Radiology, Pharmacy)
- Mid-level developers
- Healthcare workflow knowledge
- Integration specialists

**Business Operations Team** (Billing, Entity Management)
- Mid-level developers
- Financial/ERP domain knowledge

### Generic Subdomain Teams (Junior-Mid Level)

**Infrastructure Team** (Identity, Messaging, Inventory)
- Junior-mid developers
- Focus on integration, not invention
- DevOps/SRE collaboration

---

## Architecture Implications

### Core Domains
- **Architecture**: Rich domain models, tactical DDD patterns (aggregates, domain events, value objects)
- **Testing**: Extensive unit, integration, and domain tests
- **Documentation**: Comprehensive business rule documentation
- **Refactoring**: Continuous improvement and innovation

### Supporting Subdomains
- **Architecture**: Clean architecture, domain models where needed
- **Testing**: Good test coverage, focus on integration tests
- **Documentation**: Workflow and integration documentation
- **Refactoring**: Periodic improvement, stable patterns

### Generic Subdomains
- **Architecture**: Thin wrappers around third-party services or simple CRUD
- **Testing**: Integration tests with external services
- **Documentation**: Integration guides
- **Refactoring**: Minimal, consider replacement with better solutions

---

## Integration Strategy

### Core Domains
- Custom integrations, owned by Balsm
- Anti-corruption layers for external systems
- Domain events for cross-context communication

### Supporting Subdomains
- Standard integration patterns
- Adapter/port architecture for flexibility
- Shared kernel where appropriate

### Generic Subdomains
- Use standard protocols (OAuth, SMTP, REST, WebSocket)
- Vendor SDKs and libraries
- Interchangeable adapters

---

## Evolution Strategy

### Regular Review (Quarterly)
- Re-evaluate subdomain classification as business evolves
- Move subdomains between categories as strategy changes
- Examples:
  - If Balsm develops unique inventory optimization → move Inventory to Supporting
  - If AI messaging becomes a differentiator → move Messaging to Core
  - If third-party prescription service emerges → consider moving Prescriptions to Supporting

### Investment Rebalancing
- Track effort spent per subdomain
- Ensure 60-70% of engineering time is on Core Domains
- 20-30% on Supporting Subdomains
- 10% on Generic Subdomains

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-21 | Initial subdomain classification | Based on Balsm's competitive positioning and technical analysis of 13 bounded contexts |
| | Clinical Records classified as Core | AI-assisted documentation and unique workflow is key differentiator |
| | Prescriptions classified as Core | Safety-critical, complex rules, competitive advantage in clinical decision support |
| | Identity classified as Generic | Standard auth patterns, consider Auth0/Keycloak integration |
| | Messaging classified as Generic | Standard patterns, use Twilio/SendGrid/Firebase |

---

## References

- [AGENTS.md](../agents/rules/AGENTS.md) — Bounded context definitions
- [communication-architecture.md](./communication-architecture.md) — Communication patterns
- Eric Evans, *Domain-Driven Design* (2003) — Subdomain classification theory
- Vaughn Vernon, *Implementing Domain-Driven Design* (2013) — Strategic design patterns
