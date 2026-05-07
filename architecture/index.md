# Architecture Documentation

**Balsm Healthcare Platform - Architectural Decisions & Patterns**

---

## Overview

This directory contains architectural documentation, design decisions, and strategic patterns for the Balsm Healthcare Platform.

---

## Documents

### Strategic Design

#### [subdomain-classification.md](./subdomain-classification.md)
**Domain-Driven Design Subdomain Analysis**

Comprehensive classification of Balsm's 13 bounded contexts into:
- **Core Domains** (4): Clinical Records, Prescriptions, Charitable Donations, Marketplace
- **Supporting Subdomains** (6): Appointment, Labs, Radiology, Pharmacy, Billing & Finance, Entity Management
- **Generic Subdomains** (3): Identity & Access, Inventory, Messaging & Notifications

Includes investment strategies, team allocation recommendations, and architectural implications for each subdomain type.

---

#### [subdomain-map.md](./subdomain-map.md)
**Visual Subdomain Organization & Quick Reference**

Visual diagrams and heat maps showing:
- Subdomain landscape with complexity vs. strategic importance
- Context map with upstream/downstream relationships
- Team ownership structure
- Technology stack recommendations per subdomain type
- Quick reference guide for investment decisions

---

#### [communication-architecture.md](./communication-architecture.md)
**App, Local Server & Cloud Communication Design**

Three-tier architecture for Balsm:
- **App** (Flutter): User-facing client
- **Local Server** (.NET): On-premise for offline and private data
- **Cloud Server** (.NET): Balsm Network for shared data

Covers:
- Deployment configurations (Cloud-only, Local+Cloud, Multi-branch)
- Service discovery and authentication
- Offline operation and sync strategies
- Conflict resolution patterns
- Database provider abstraction (SQLite/PostgreSQL)

---

### Routing & URL Design

#### [api-routing-strategy.md](./api-routing-strategy.md)
**API Endpoint Routing by Bounded Context**

Complete REST API routing specification organized by all 13 bounded contexts:
- URL structure and versioning strategy (`/v1/{context}/{resource}`)
- Detailed endpoint listings for each subdomain (Core, Supporting, Generic)
- HTTP methods, status codes, and response formats
- Authentication, authorization (PBAC), and rate limiting
- Pagination, filtering, and field selection patterns
- Webhook support and OpenAPI documentation

Covers all endpoints from Clinical Records to Messaging & Notifications with implementation roadmap.

---

#### [website-routing-strategy.md](./website-routing-strategy.md)
**Public Website URL Structure & Navigation**

Marketing website routing and information architecture:
- Site map and top-level navigation structure
- Feature pages, solutions, and use cases
- Charitable donations public pages
- Marketplace add-on listings
- Multi-language (i18n) strategy with RTL support
- SEO optimization (meta tags, structured data, sitemap.xml)
- Landing pages for marketing campaigns
- Performance optimization strategies (SSG, ISR, SSR)

Includes technical stack recommendations (Next.js) and implementation phases.

---

#### [subdomain-route-mapping.md](./subdomain-route-mapping.md)
**Quick Reference: Subdomains → API Routes → Website Pages**

Cross-reference mapping document connecting:
- Bounded contexts to API base paths
- API routes to corresponding website pages
- Portal routes for authenticated users
- Domain mapping (marketing, portal, API subdomains)
- Feature-to-route lookup table
- URL design principles summary

Quick lookup table for navigating between business concepts, technical endpoints, and user-facing pages.

---

#### [documentation-routing-strategy.md](./documentation-routing-strategy.md)
**Documentation & Developer Portal Routing**

Comprehensive documentation subdomain strategy covering:
- Main documentation hub (`docs.balsm.health`) — technical docs, architecture, integrations, deployment
- Developer portal (`developers.balsm.health`) — add-on development, API reference, SDKs, marketplace
- API reference (`api.balsm.health/swagger`) — interactive OpenAPI/Swagger documentation
- Help center (`help.balsm.health`) — end-user guides for patients, caregivers, and staff
- Documentation technology stack (VitePress, Swagger UI, Next.js)
- Versioning, localization (i18n), and content guidelines

Includes routes for getting started, integration guides, SDK docs, troubleshooting, and community resources.

---

#### [download-routing-strategy.md](./download-routing-strategy.md)
**App Download & Distribution Routing**

Complete download and distribution strategy for Balsm applications across all platforms:
- Download hub (`download.balsm.health`) with platform detection and auto-redirect
- Platform-specific pages (iOS, Android, Windows, macOS, Linux)
- Local server distribution (Windows, Linux, macOS, Docker)
- Release channels (stable, beta, alpha, nightly)
- Universal/deep links for app-to-web handoff
- QR code generation for easy mobile downloads
- Auto-update API and version management
- CDN strategy and file organization
- Security (code signing, checksums, GPG signatures)
- System requirements for all platforms

Includes routes for App Store/Google Play redirects, direct downloads, TestFlight/beta programs, and enterprise distribution.

---

#### [share-routing-strategy.md](./share-routing-strategy.md)
**Universal Sharing & QR Code Routing**

Unified sharing and QR code subdomain strategy for all shareable content:
- Share hub (`share.balsm.health`) with short URL generation
- QR codes for health passport, prescriptions, appointments, lab results, donations
- Security features (time-limited, one-time use, consent-based sharing)
- Smart routing with deep linking (app vs. web detection)
- Analytics and access tracking
- Short code generation strategies
- Mobile optimization and offline support
- Compliance (HIPAA, GDPR) for secure sharing

Covers all sharing use cases from emergency profile QR codes to appointment check-in and prescription verification.

---

#### [authentication-routing-strategy.md](./authentication-routing-strategy.md)
**Authentication & SSO Routing**

Complete identity and authentication routing strategy:
- Integrated authentication routes (portal, app, admin login)
- Optional SSO subdomain (`sso.balsm.health`, `auth.balsm.health`) for enterprise
- OAuth 2.0 / OpenID Connect for third-party integrations
- SAML 2.0 for enterprise Single Sign-On
- MFA (Multi-Factor Authentication) flows
- Social login (Google, Apple, Facebook)
- Password reset and account management
- Session and device management
- Technology recommendations (Auth0, Keycloak)

Covers all authentication flows from basic login to enterprise SAML SSO with comprehensive security features.

---

#### [payment-routing-strategy.md](./payment-routing-strategy.md)
**Payment & Checkout Routing**

Complete payment processing and billing routing strategy:
- Integrated payment routes (portal billing, checkout flows)
- Optional payment subdomain (`pay.balsm.health`, `checkout.balsm.health`)
- Multi-gateway support (Stripe, PayTabs, HyperPay, Fawry)
- Invoice payment, appointment payment, prescription payment, donations
- Subscription management for add-ons
- Payment methods (cards, wallets, bank transfer, insurance)
- Refund and dispute handling
- PCI DSS compliance strategy
- 3D Secure / SCA support

Covers all payment flows from invoice payment to subscription billing with regional payment gateway integration.

---

#### [legal-consent-routing-strategy.md](./legal-consent-routing-strategy.md)
**Legal Documents & Consent Management Routing**

Dedicated subdomain strategy for legal and compliance content:
- Legal hub (`legal.balsm.health`) for all legal documents and consent templates
- Legal documents (Terms, Privacy Policy, HIPAA, Cookie Policy, GDPR)
- Document versioning and change tracking
- Consent templates catalog (treatment, procedure, data sharing, research)
- Template metadata and PDF generation
- Legal acceptance tracking API
- Privacy settings and GDPR data rights
- Compliance dashboard and audit reporting
- Multi-language support for legal content

Centralized legal infrastructure with audit trail, version control, and compliance features for healthcare regulations.

---

#### [community-routing-strategy.md](./community-routing-strategy.md)
**Community & Feedback Platform Routing**

Dedicated subdomain strategy for community engagement and feedback:
- Community hub (`community.balsm.health`) for public engagement platform
- Feature requests and voting system (ideas submission, voting, status tracking)
- Issue tracking and bug reports (severity levels, status updates, workarounds)
- Discussions and forums (best practices, use cases, troubleshooting, API development)
- Public roadmap and changelog (transparency on what's being built)
- Knowledge base with community-contributed guides
- Reputation system and gamification (badges, levels, leaderboards)
- User profiles and contributor recognition
- Moderation tools and strict PHI enforcement
- Integration with portal (feedback widget, in-app bug reporting)

Enables users to shape the product through feedback, vote on features, report issues, and participate in healthcare IT discussions with transparent roadmap visibility.

---

## Architectural Principles

### 1. Modular Monolith
- Each bounded context is a separate module
- Clean module boundaries with defined interfaces
- No cross-module direct dependencies

### 2. Domain-Driven Design
- 13 bounded contexts aligned with business domains
- Ubiquitous language shared between technical and domain experts
- Anti-corruption layers for external integrations

### 3. Clean Architecture
- Dependency inversion: business logic depends on abstractions
- Layer isolation: API → Domain → Data Access
- Testability through dependency injection

### 4. Cloud-First, Offline-Capable
- Cloud is the default deployment
- Local server is optional for offline scenarios
- App connects to one target (local OR cloud)
- Sync mechanisms for data consistency

### 5. Security by Design
- Permission checks on every operation
- Field-level encryption for sensitive data
- Immutable audit trails
- Never log PHI

---

## Key Architectural Patterns

### Domain Patterns

| Pattern | When to Use | Subdomains |
|---------|-------------|------------|
| **Aggregates** | Complex entities with invariants | Core, Supporting |
| **Domain Events** | Cross-context communication | All |
| **Value Objects** | Immutable domain concepts | All |
| **Repositories** | Data access abstraction | All |
| **Specifications** | Reusable business rules | Core (Prescriptions) |
| **Domain Services** | Stateless operations across entities | Core, Supporting |

### Integration Patterns

| Pattern | When to Use | Examples |
|---------|-------------|----------|
| **Anti-Corruption Layer** | External system integration | HL7/FHIR, DICOM, Insurance APIs |
| **Event-Driven** | Async cross-context communication | Clinical Records → Labs, Prescriptions → Billing |
| **Adapter/Port** | Swappable implementations | Identity (Auth0/Keycloak), Messaging (Twilio/SendGrid) |
| **CQRS** | Read-heavy operations | Clinical Records timeline, Reporting |

### Data Patterns

| Pattern | When to Use | Implementation |
|---------|-------------|----------------|
| **Database per Context** | All bounded contexts | Separate schemas, no shared tables |
| **Optimistic Concurrency** | Concurrent edits | Version tokens, conflict detection |
| **Event Sourcing** | Full audit trail | Clinical Records (for Entry timeline) |
| **Cache-Aside** | Performance optimization | Prescription drug database, Appointment slots |

---

## Technology Stack

### Backend
- **.NET 10** (C#): Cross-platform, high performance
- **PostgreSQL**: Cloud database
- **SQLite**: Local server database (default)
- **EF Core**: ORM with provider abstraction

### Frontend
- **Flutter** (Dart): Cross-platform (iOS, Android, Web, Desktop)
- **Bloc/Cubit**: State management
- **Hive/Drift**: Local encrypted storage

### Infrastructure
- **Docker**: Containerization
- **Kubernetes**: Orchestration (cloud)
- **Redis**: Caching & session store
- **RabbitMQ/Azure Service Bus**: Message queue

### External Integrations
- **Auth0/Keycloak**: Identity provider
- **Twilio**: SMS notifications
- **SendGrid**: Email
- **Firebase Cloud Messaging**: Push notifications

---

## Decision Framework

### When to Create a New Bounded Context

✅ **Create if:**
- Distinct business domain with its own language
- Independent change rate from other contexts
- Different team ownership or expertise required
- Clear boundaries and responsibilities

❌ **Don't create if:**
- Just organizing code into folders
- Solving technical concerns (use layers instead)
- Sharing data models (consider shared kernel or events)

### When to Split an Existing Context

✅ **Split if:**
- Context has grown too large (>10 aggregates)
- Multiple teams stepping on each other
- Different parts evolve at different rates
- Clear seam exists along business boundaries

❌ **Don't split if:**
- Just for code organization
- Entities are tightly coupled with many invariants
- Split would create chatty cross-context communication

---

## Documentation Standards

### Architecture Decision Records (ADRs)

Format for documenting significant architectural decisions:

```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Problem statement and background]

## Decision
[The decision made and why]

## Consequences
[Positive and negative impacts]

## Alternatives Considered
[Other options evaluated]
```

### Diagrams

Use:
- **C4 Model** for system context, containers, components
- **Context Maps** for bounded context relationships
- **Sequence Diagrams** for complex workflows
- **Entity-Relationship Diagrams** per bounded context

---

## Review & Evolution

### Quarterly Architecture Review

1. **Subdomain Reassessment**: Validate Core/Supporting/Generic classification
2. **Investment Audit**: Verify engineering time aligns with subdomain priorities
3. **Debt Evaluation**: Identify technical debt in Core domains (highest priority)
4. **Integration Health**: Review anti-corruption layers and event schemas
5. **Performance Review**: Check SLAs and identify bottlenecks

### Architecture Triggers

Events that require architectural review:

- New bounded context proposal
- Cross-context integration changes
- External system integration
- Major feature spanning multiple contexts
- Technology stack changes
- Team structure changes

---

## References

### Internal Documentation
- [AGENTS.md](../agents/rules/AGENTS.md) — Coding standards and bounded contexts
- [CODING_STANDARDS.md](../agents/rules/CODING_STANDARDS.md) — Technical patterns
- [BUSINESS_FEATURES.md](../BUSINESS_FEATURES.md) — Feature specifications
- [NON_FUNCTIONAL_REQUIREMENTS.md](../NON_FUNCTIONAL_REQUIREMENTS.md) — Performance, scalability, compliance

### External Resources
- Eric Evans, *Domain-Driven Design* (2003)
- Vaughn Vernon, *Implementing Domain-Driven Design* (2013)
- Martin Fowler, *Patterns of Enterprise Application Architecture* (2002)
- Sam Newman, *Building Microservices* (2021)
- .NET Microservices Architecture Guidance: https://learn.microsoft.com/en-us/dotnet/architecture/

---

## Contact

For questions about architectural decisions:
- **Technical Lead**: [Contact info]
- **Architecture Review Board**: [Meeting schedule]
- **Discussion**: Create an issue in `Balsm-Roadmap` repo with `architecture` label

---

*Last updated: 2026-03-21*
