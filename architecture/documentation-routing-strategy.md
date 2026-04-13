# Documentation Subdomain Routing Strategy

**Balsm Healthcare Platform - Documentation & Developer Portal**

---

## Overview

Comprehensive documentation routing strategy covering API documentation, developer resources, integration guides, and end-user help content.

---

## Documentation Domains

### Production Domains

```
Primary Documentation:
├─ docs.balsm.health                    # Main documentation hub
├─ developers.balsm.health              # Developer portal (marketplace developers)
├─ api.balsm.health/swagger             # API reference (Swagger UI)
└─ help.balsm.health                    # End-user help center

Staging:
├─ docs-staging.balsm.health
├─ developers-staging.balsm.health
└─ help-staging.balsm.health

Development:
├─ docs-dev.balsm.health
├─ developers-dev.balsm.health
└─ help-dev.balsm.health
```

---

## 1. Main Documentation Hub (`docs.balsm.health`)

**Purpose**: Technical documentation for system administrators, implementers, and advanced users

### Route Structure

```
/                                       # Documentation home
/getting-started                        # Quick start guide
/getting-started/installation           # Installation guide
/getting-started/configuration          # Configuration
/getting-started/first-login            # First login walkthrough

# Architecture Documentation
/architecture                           # Architecture overview
/architecture/system-overview           # System architecture
/architecture/deployment                # Deployment options
/architecture/security                  # Security architecture
/architecture/data-model                # Data model
/architecture/bounded-contexts          # DDD bounded contexts

# API Documentation
/api                                    # API overview (redirect to api.balsm.health/swagger)
/api/getting-started                    # API quick start
/api/authentication                     # Authentication guide
/api/permissions                        # Permission system
/api/rate-limits                        # Rate limiting
/api/webhooks                           # Webhook integration
/api/pagination                         # Pagination patterns
/api/error-handling                     # Error codes & handling
/api/versioning                         # API versioning strategy
/api/changelog                          # API changelog

# Integration Guides
/integrations                           # Integration hub
/integrations/hl7                       # HL7 v2.x integration
/integrations/fhir                      # FHIR R4 integration
/integrations/dicom                     # DICOM/PACS integration
/integrations/oauth                     # OAuth 2.0 integration
/integrations/sso                       # SSO (SAML, OIDC)
/integrations/insurance                 # Insurance claim systems
/integrations/pharmacy                  # Pharmacy systems
/integrations/lab                       # Lab systems (LIMS)
/integrations/billing                   # Billing systems
/integrations/accounting                # Accounting software (QuickBooks, etc.)

# Deployment & Operations
/deployment                             # Deployment overview
/deployment/cloud                       # Cloud-only deployment
/deployment/local-server                # Local server deployment
/deployment/hybrid                      # Hybrid (local + cloud)
/deployment/multi-branch                # Multi-branch setup
/deployment/docker                      # Docker deployment
/deployment/kubernetes                  # Kubernetes deployment
/deployment/database                    # Database setup (PostgreSQL, SQLite)
/deployment/backup-restore              # Backup & restore
/deployment/migration                   # Data migration
/deployment/monitoring                  # Monitoring & observability

# Configuration
/configuration                          # Configuration overview
/configuration/environment-variables    # Environment variables
/configuration/database                 # Database configuration
/configuration/security                 # Security settings
/configuration/features                 # Feature flags
/configuration/integrations             # Integration settings
/configuration/notifications            # Notification channels
/configuration/backup                   # Backup configuration

# Security & Compliance
/security                               # Security overview
/security/hipaa                         # HIPAA compliance guide
/security/gdpr                          # GDPR compliance guide
/security/encryption                    # Encryption (at-rest, in-transit)
/security/audit-logs                    # Audit logging
/security/access-control                # Access control (PBAC)
/security/authentication                # Authentication methods
/security/authorization                 # Authorization model
/security/phi-handling                  # PHI handling guidelines
/security/penetration-testing           # Penetration testing

# Administration
/admin                                  # Admin guide
/admin/user-management                  # User management
/admin/permission-groups                # Permission groups
/admin/entity-management                # Entity/branch setup
/admin/billing-configuration            # Billing setup
/admin/reports                          # Reports & analytics
/admin/system-settings                  # System settings
/admin/maintenance                      # Maintenance mode

# SDK Documentation
/sdks                                   # SDK overview
/sdks/dotnet                            # .NET SDK
/sdks/flutter                           # Flutter SDK
/sdks/javascript                        # JavaScript SDK
/sdks/python                            # Python SDK (add-on development)
/sdks/typescript                        # TypeScript SDK

# Clinical Workflows
/workflows                              # Workflow documentation
/workflows/clinical-documentation       # Clinical documentation workflow
/workflows/prescriptions                # Prescription workflow
/workflows/appointments                 # Appointment workflow
/workflows/lab-orders                   # Lab order workflow
/workflows/imaging                      # Imaging workflow
/workflows/billing                      # Billing workflow
/workflows/pharmacy                     # Pharmacy workflow

# Reference
/reference                              # Reference overview
/reference/glossary                     # Glossary of terms
/reference/faq                          # Frequently asked questions
/reference/troubleshooting              # Troubleshooting guide
/reference/known-issues                 # Known issues
/reference/changelog                    # Platform changelog
/reference/roadmap                      # Product roadmap

# Support
/support                                # Support overview
/support/contact                        # Contact support
/support/status                         # System status (redirect to status.balsm.health)
/support/community                      # Community forums
/support/training                       # Training resources
```

---

## 2. Developer Portal (`developers.balsm.health`)

**Purpose**: Resources for marketplace add-on developers and third-party integrators

### Route Structure

```
/                                       # Developer home
/overview                               # Developer program overview

# Getting Started
/getting-started                        # Quick start for developers
/getting-started/registration           # Developer registration
/getting-started/api-keys               # Obtaining API keys
/getting-started/first-addon            # Creating first add-on
/getting-started/sandbox                # Sandbox environment

# Add-On Development
/addons                                 # Add-on development guide
/addons/overview                        # Add-on system overview
/addons/architecture                    # Add-on architecture
/addons/manifest                        # Add-on manifest file
/addons/permissions                     # Permission requirements
/addons/ui-integration                  # UI integration points
/addons/api-access                      # API access from add-ons
/addons/storage                         # Add-on data storage
/addons/configuration                   # Add-on configuration UI
/addons/localization                    # Add-on localization (i18n)
/addons/testing                         # Testing add-ons
/addons/publishing                      # Publishing to marketplace
/addons/versioning                      # Add-on versioning
/addons/updates                         # Update mechanism
/addons/analytics                       # Add-on analytics
/addons/billing                         # Monetization & billing

# API Reference
/api                                    # API reference (interactive)
/api/clinical-records                   # Clinical Records API
/api/prescriptions                      # Prescriptions API
/api/appointments                       # Appointments API
/api/labs                               # Labs API
/api/radiology                          # Radiology API
/api/pharmacy                           # Pharmacy API
/api/billing                            # Billing API
/api/marketplace                        # Marketplace API
/api/identity                           # Identity & Access API
/api/messaging                          # Messaging API

# Webhooks
/webhooks                               # Webhook overview
/webhooks/setup                         # Setting up webhooks
/webhooks/events                        # Available events
/webhooks/security                      # Webhook security (signatures)
/webhooks/retry-logic                   # Retry & failure handling
/webhooks/testing                       # Testing webhooks

# SDKs
/sdks                                   # SDK documentation
/sdks/python                            # Python SDK for add-ons
/sdks/javascript                        # JavaScript SDK
/sdks/typescript                        # TypeScript SDK

# Integration Patterns
/patterns                               # Integration patterns
/patterns/oauth                         # OAuth 2.0 integration
/patterns/rest                          # REST API patterns
/patterns/graphql                       # GraphQL (future)
/patterns/realtime                      # Real-time (SignalR)
/patterns/batch                         # Batch processing
/patterns/error-handling                # Error handling strategies

# Best Practices
/best-practices                         # Best practices overview
/best-practices/security                # Security best practices
/best-practices/performance             # Performance optimization
/best-practices/user-experience         # UX guidelines
/best-practices/accessibility           # Accessibility (WCAG)
/best-practices/mobile                  # Mobile considerations
/best-practices/offline                 # Offline support

# Certification
/certification                          # Certification overview
/certification/process                  # Certification process
/certification/requirements             # Requirements
/certification/checklist                # Pre-submission checklist
/certification/review                   # Review process
/certification/badge                    # Certified badge

# Marketplace
/marketplace                            # Marketplace guidelines
/marketplace/listing                    # Creating listing
/marketplace/screenshots                # Screenshot guidelines
/marketplace/description                # Description best practices
/marketplace/pricing                    # Pricing strategies
/marketplace/reviews                    # Managing reviews
/marketplace/promotion                  # Promotion opportunities

# Resources
/resources                              # Resource hub
/resources/tutorials                    # Step-by-step tutorials
/resources/code-samples                 # Code samples (GitHub)
/resources/case-studies                 # Developer case studies
/resources/videos                       # Video tutorials
/resources/webinars                     # Developer webinars
/resources/blog                         # Developer blog

# Community
/community                              # Developer community
/community/forums                       # Developer forums
/community/discord                      # Discord channel
/community/github                       # GitHub discussions
/community/events                       # Developer events
/community/spotlight                    # Developer spotlight

# Console
/console                                # Developer console (authenticated)
/console/dashboard                      # Dashboard
/console/apps                           # My add-ons
/console/apps/{id}                      # Add-on details
/console/apps/{id}/analytics            # Add-on analytics
/console/apps/{id}/reviews              # Reviews management
/console/apps/{id}/versions             # Version management
/console/api-keys                       # API keys management
/console/webhooks                       # Webhook configuration
/console/billing                        # Developer billing
/console/profile                        # Developer profile
/console/support                        # Developer support

# Reference
/reference                              # Reference materials
/reference/api-changelog                # API changelog
/reference/glossary                     # API glossary
/reference/faq                          # Developer FAQ
/reference/status                       # API status
/reference/roadmap                      # API roadmap
/reference/deprecations                 # Deprecation notices
```

---

## 3. API Reference (`api.balsm.health/swagger`)

**Purpose**: Interactive API documentation (OpenAPI/Swagger)

### Route Structure

```
/swagger                                # Swagger UI
/swagger/v1/swagger.json                # OpenAPI JSON spec
/swagger/v2/swagger.json                # API v2 spec (future)

# ReDoc (Alternative UI)
/docs                                   # ReDoc UI
/docs/v1                                # ReDoc v1
/docs/v2                                # ReDoc v2 (future)

# Downloadable Specs
/openapi.json                           # Download OpenAPI spec
/openapi.yaml                           # Download YAML spec
/postman.json                           # Postman collection

# API Explorer (Interactive)
/explorer                               # API explorer/playground
/explorer/clinical-records              # Clinical Records endpoints
/explorer/prescriptions                 # Prescriptions endpoints
/explorer/appointments                  # Appointments endpoints
# ... (all bounded contexts)
```

---

## 4. Help Center (`help.balsm.health`)

**Purpose**: End-user documentation for patients, caregivers, and staff

### Route Structure

```
/                                       # Help home
/search                                 # Search results

# Getting Started
/getting-started                        # Getting started hub
/getting-started/for-patients           # Patient guide
/getting-started/for-caregivers         # Caregiver guide
/getting-started/for-doctors            # Doctor guide
/getting-started/for-nurses             # Nurse guide
/getting-started/for-pharmacists        # Pharmacist guide
/getting-started/for-admin              # Admin guide

# Account & Login
/account                                # Account management
/account/create-account                 # Creating account
/account/login                          # Login help
/account/forgot-password                # Password reset
/account/two-factor                     # Two-factor authentication
/account/profile                        # Managing profile
/account/privacy                        # Privacy settings
/account/caregivers                     # Managing caregivers
/account/emergency-profile              # Emergency profile setup
/account/health-passport                # Health passport (QR code)

# Clinical Records
/clinical-records                       # Clinical records help
/clinical-records/viewing                # Viewing records
/clinical-records/timeline              # Understanding timeline
/clinical-records/entries               # Entry types
/clinical-records/attachments           # Uploading attachments
/clinical-records/sharing               # Sharing records
/clinical-records/consent               # Consent management
/clinical-records/self-reports          # Submitting self-reports

# Appointments
/appointments                           # Appointments help
/appointments/booking                   # Booking appointment
/appointments/rescheduling              # Rescheduling
/appointments/canceling                 # Canceling
/appointments/checkin                   # Check-in process
/appointments/video                     # Video appointments (telemedicine)
/appointments/questionnaire             # Pre-visit questionnaire
/appointments/house-visits              # House visits

# Prescriptions
/prescriptions                          # Prescriptions help
/prescriptions/viewing                  # Viewing prescriptions
/prescriptions/refills                  # Requesting refills
/prescriptions/pharmacy                 # Pharmacy selection
/prescriptions/delivery                 # Delivery tracking
/prescriptions/qr-code                  # QR code verification
/prescriptions/interactions             # Understanding drug interactions
/prescriptions/allergies                # Managing allergies

# Lab Results
/lab-results                            # Lab results help
/lab-results/viewing                    # Viewing results
/lab-results/understanding              # Understanding results
/lab-results/sharing                    # Sharing results
/lab-results/history                    # Result history

# Imaging
/imaging                                # Imaging help
/imaging/viewing                        # Viewing images
/imaging/reports                        # Radiology reports
/imaging/cd-access                      # Accessing CD images

# Billing & Payments
/billing                                # Billing help
/billing/invoices                       # Understanding invoices
/billing/payments                       # Making payments
/billing/insurance                      # Insurance information
/billing/claims                         # Claim status
/billing/estimates                      # Cost estimates
/billing/payment-plans                  # Payment plans

# Charitable Donations
/donations                              # Donations help
/donations/browsing                     # Browsing cases
/donations/making-donation              # Making donation
/donations/tracking                     # Tracking case updates
/donations/tax-receipt                  # Tax receipts
/donations/transparency                 # Transparency report

# Marketplace
/marketplace                            # Marketplace help
/marketplace/browsing                   # Browsing add-ons
/marketplace/installing                 # Installing add-ons
/marketplace/managing                   # Managing add-ons
/marketplace/reviews                    # Writing reviews
/marketplace/billing                    # Add-on billing

# Messages & Notifications
/messages                               # Messaging help
/messages/sending                       # Sending messages
/messages/conversations                 # Managing conversations
/notifications                          # Notifications
/notifications/settings                 # Notification settings
/notifications/push                     # Push notifications
/notifications/email                    # Email notifications
/notifications/sms                      # SMS notifications

# Privacy & Security
/privacy                                # Privacy help
/privacy/data-sharing                   # Data sharing controls
/privacy/consent                        # Consent management
/privacy/access-logs                    # Access logs
/privacy/download-data                  # Downloading my data
/privacy/delete-account                 # Account deletion

/security                               # Security help
/security/password                      # Password security
/security/two-factor                    # Two-factor authentication
/security/sessions                      # Active sessions
/security/suspicious-activity           # Reporting suspicious activity

# Troubleshooting
/troubleshooting                        # Troubleshooting hub
/troubleshooting/login-issues           # Login problems
/troubleshooting/app-crashes            # App crashes
/troubleshooting/slow-performance       # Performance issues
/troubleshooting/sync-issues            # Sync problems
/troubleshooting/connection-errors      # Connection errors

# Mobile Apps
/mobile                                 # Mobile app help
/mobile/ios                             # iOS app
/mobile/android                         # Android app
/mobile/download                        # Downloading app
/mobile/offline-mode                    # Offline mode
/mobile/biometric-login                 # Biometric login

# Contact & Support
/contact                                # Contact support
/contact/live-chat                      # Live chat
/contact/phone                          # Phone support
/contact/email                          # Email support
/contact/feedback                       # Submit feedback
/contact/bug-report                     # Report bug
```

---

## Documentation Technology Stack

### Recommended Stack

#### Main Documentation (`docs.balsm.health`)
**VitePress, Docusaurus, or GitBook**

```yaml
Technology: VitePress (Vue-based) or Docusaurus (React-based)
Source: Markdown files in Git
Search: Algolia DocSearch
Versioning: Git-based
Hosting: Vercel, Netlify, or CloudFlare Pages
CI/CD: Auto-deploy on Git push

Features:
- Full-text search
- Version selector (v1, v2)
- Dark mode
- Multi-language (i18n)
- Syntax highlighting
- Code playground
- PDF export
```

#### Developer Portal (`developers.balsm.health`)
**Next.js + Custom UI**

```yaml
Technology: Next.js 14+
Authentication: OAuth 2.0 (for console)
Database: PostgreSQL (for developer accounts, add-on metadata)
Search: Algolia or ElasticSearch
Hosting: Vercel or AWS

Features:
- Interactive API explorer
- Developer console (dashboard)
- Code samples with live editing
- Webhook playground
- Analytics dashboard
- Community forums integration
```

#### API Reference (`api.balsm.health/swagger`)
**Swagger UI + ReDoc**

```yaml
Technology:
- Swagger UI (OpenAPI 3.0)
- ReDoc (alternative UI)

Generation: Auto-generated from .NET controllers (Swashbuckle)
Features:
- Try it out (authenticated requests)
- Code generation (curl, Python, JS, C#)
- Schema explorer
- Download OpenAPI spec
```

#### Help Center (`help.balsm.health`)
**Zendesk Guide, Intercom Articles, or Custom Next.js**

```yaml
Technology: Zendesk Guide or custom Next.js
Search: Full-text search with AI-assisted search
Features:
- User-friendly UI
- Video tutorials embedded
- Screenshots and GIFs
- Live chat integration
- Feedback on articles ("Was this helpful?")
- Multi-language support
- Mobile-responsive
```

---

## Documentation Structure

### Markdown File Organization

```
docs/
├── api/
│   ├── getting-started.md
│   ├── authentication.md
│   ├── clinical-records/
│   │   ├── patients.md
│   │   ├── entries.md
│   │   └── timeline.md
│   ├── prescriptions/
│   │   ├── overview.md
│   │   └── validation.md
│   └── ...
├── integrations/
│   ├── hl7.md
│   ├── fhir.md
│   └── dicom.md
├── deployment/
│   ├── cloud.md
│   ├── local-server.md
│   └── kubernetes.md
├── security/
│   ├── hipaa.md
│   ├── gdpr.md
│   └── encryption.md
└── ...

developers/
├── getting-started/
│   ├── registration.md
│   └── first-addon.md
├── addons/
│   ├── architecture.md
│   ├── manifest.md
│   └── permissions.md
├── api/
│   └── (OpenAPI-generated)
└── ...

help/
├── getting-started/
│   ├── for-patients.md
│   └── for-caregivers.md
├── appointments/
│   ├── booking.md
│   └── rescheduling.md
└── ...
```

---

## Search & Navigation

### Global Search

All documentation sites should have:
- **Full-text search** across all content
- **AI-assisted search** (optional): Natural language queries
- **Search suggestions**: Auto-complete
- **Search filters**: By section, API version, user role

### Navigation Patterns

```
Global Navigation:
├─ Home
├─ Getting Started
├─ API Reference
├─ Integrations
├─ Deployment
├─ Security
└─ Support

Context-Aware Navigation:
- Breadcrumbs
- Previous/Next links
- Related articles sidebar
- Table of contents (auto-generated from headings)
```

---

## Versioning Strategy

### API Documentation Versioning

```
/docs/api/v1/...                        # API v1 docs
/docs/api/v2/...                        # API v2 docs (when released)
/docs/api/latest/...                    # Always points to latest

Version Selector:
[v1 (stable)] [v2 (beta)] [Latest]
```

### Document Version Control

- Docs stored in Git
- Versioned with API releases
- Git tags for major releases
- Changelog tracked in `/changelog`

---

## Localization (i18n)

### Supported Languages

```
/en/...                                 # English (default)
/ar/...                                 # Arabic (RTL)
/fr/...                                 # French

Language Selector: Always visible in header
```

### Translation Strategy

- Core documentation: Professional translation
- Community contributions: GitHub pull requests
- API reference: English only (standard in industry)
- Help center: All supported languages

---

## Content Guidelines

### Documentation Standards

#### 1. Structure
- Start with overview and use case
- Include prerequisites
- Step-by-step instructions
- Code examples with syntax highlighting
- Screenshots where helpful
- Troubleshooting section
- Related articles links

#### 2. Writing Style
- Clear, concise language
- Active voice
- Present tense
- Second person ("you")
- Avoid jargon (or explain when necessary)
- Healthcare-specific terms: Link to glossary

#### 3. Code Examples
```markdown
### Example: Create Patient Record

```http
POST /v1/clinical-records/patients
Content-Type: application/json
Authorization: Bearer {token}

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01"
}
```

Response:
```json
{
  "id": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2026-03-21T10:00:00Z"
}
```
```

---

## Content Update Workflow

### Documentation Updates

```
1. Create branch
   └─ git checkout -b docs/update-prescription-api

2. Edit markdown files
   └─ docs/api/prescriptions/overview.md

3. Preview locally
   └─ npm run dev

4. Create pull request
   └─ Automatic deployment preview (Vercel/Netlify)

5. Review & merge
   └─ Auto-deploy to production

6. Notify users
   └─ Changelog entry
```

### Documentation Ownership

| Documentation Type | Owner | Reviewers |
|-------------------|-------|-----------|
| API Reference | Backend Team | Tech Lead, DevRel |
| Architecture | Tech Lead | CTO |
| Integration Guides | Integration Team | Partners |
| Developer Portal | DevRel Team | Backend Team |
| Help Center | Product/Support | UX, Caregivers |
| Security/Compliance | Security Team | Legal, Compliance |

---

## Analytics & Feedback

### Track Metrics

- Page views per article
- Search queries (identify gaps)
- Time on page
- Feedback ("Was this helpful?")
- Copy code button clicks
- External link clicks

### Continuous Improvement

- Monthly documentation audit
- Update based on support tickets
- Address feedback comments
- Add missing topics from search queries
- Update screenshots for UI changes

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1)
- ✅ Set up `docs.balsm.health` (VitePress/Docusaurus)
- ✅ API Reference (Swagger UI)
- ✅ Getting Started guides
- ✅ API authentication docs
- ✅ Basic help articles

### Phase 2: Core Content (Month 2)
- API documentation for all bounded contexts
- Integration guides (HL7, FHIR, DICOM)
- Deployment documentation
- Security & compliance guides
- Help center content (top 20 topics)

### Phase 3: Developer Portal (Month 3)
- `developers.balsm.health` launch
- Add-on development guide
- Developer console
- Code samples & tutorials
- Webhook documentation

### Phase 4: Enhancement (Month 4)
- Interactive API explorer
- Video tutorials
- Advanced search (AI-assisted)
- Multi-language (i18n)
- Community forums

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint definitions
- [website-routing-strategy.md](./website-routing-strategy.md) — Marketing website structure
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping

---

*Last updated: 2026-03-21*
