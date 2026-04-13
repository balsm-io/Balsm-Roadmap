# Subdomain to Route Mapping

**Quick Reference: Bounded Contexts → API Routes → Website Pages**

---

## Quick Lookup Table

| Bounded Context | Classification | API Base Path | Website Pages | Portal Routes |
|----------------|----------------|---------------|---------------|---------------|
| **Clinical Records** | Core | `/v1/clinical-records` | `/features/clinical-records`<br>`/features/ai-scribe` | `/patients/{id}/records`<br>`/patients/{id}/timeline` |
| **Prescriptions** | Core | `/v1/prescriptions` | `/features/prescriptions` | `/prescriptions` |
| **Charitable Donations** | Core | `/v1/charitable-donations` | `/charitable-donations`<br>`/charitable-donations/cases` | `/donations/my-donations` |
| **Marketplace** | Core | `/v1/marketplace` | `/marketplace`<br>`/marketplace/addons/{slug}` | `/marketplace/installed` |
| **Appointments** | Supporting | `/v1/appointments` | `/features/appointments` | `/appointments` |
| **Labs** | Supporting | `/v1/labs` | `/features/labs-radiology` | `/lab-results` |
| **Radiology** | Supporting | `/v1/radiology` | `/features/labs-radiology` | `/imaging` |
| **Pharmacy** | Supporting | `/v1/pharmacy` | `/features/for-pharmacies` | `/pharmacy/dispensations` |
| **Billing & Finance** | Supporting | `/v1/billing` | `/features/billing` | `/billing/invoices` |
| **Entity Management** | Supporting | `/v1/entities` | `/features/for-hospitals` | `/settings/organization` |
| **Identity & Access** | Generic | `/v1/identity` | `/login` (redirect)<br>`/legal/privacy` | `/profile`<br>`/settings/security` |
| **Inventory** | Generic | `/v1/inventory` | — | `/inventory` |
| **Messaging** | Generic | `/v1/messaging` | — | `/messages`<br>`/notifications` |

### Documentation & Support Routes

| Resource Type | Domain | Key Routes | Purpose |
|--------------|--------|------------|---------|
| **Technical Docs** | `docs.balsm.health` | `/getting-started`<br>`/api`<br>`/integrations`<br>`/deployment`<br>`/security` | Architecture, deployment, integrations, admin guides |
| **Developer Portal** | `developers.balsm.health` | `/getting-started`<br>`/addons`<br>`/api`<br>`/console` | Add-on development, API reference, developer console |
| **API Reference** | `api.balsm.health` | `/swagger`<br>`/docs` (ReDoc)<br>`/openapi.json` | Interactive API documentation (OpenAPI/Swagger) |
| **Help Center** | `help.balsm.health` | `/getting-started`<br>`/account`<br>`/appointments`<br>`/prescriptions`<br>`/billing` | End-user help (patients, caregivers, staff) |
| **Downloads** | `download.balsm.health` | `/ios`<br>`/android`<br>`/windows`<br>`/macos`<br>`/linux`<br>`/local-server` | App downloads for all platforms, release channels, QR codes |
| **Share & QR** | `share.balsm.health` | `/{shortCode}`<br>`/health-passport/{hash}`<br>`/prescription/{id}`<br>`/appointment/{id}/checkin`<br>`/lab-result/{hash}` | Universal sharing, QR codes, time-limited links, consent-based sharing |
| **Authentication** | Integrated (see below) | `portal.balsm.health/auth/*`<br>`app.balsm.health/auth/*`<br>`sso.balsm.health` (opt.) | Login, MFA, OAuth, SAML SSO, social login, password reset |
| **Payment** | Integrated (see below) | `portal.balsm.health/billing/*`<br>`portal.balsm.health/checkout/*`<br>`pay.balsm.health` (opt.) | Invoice payment, checkout, subscriptions, refunds |
| **Legal & Consent** | `legal.balsm.health` | `/terms`<br>`/privacy`<br>`/hipaa`<br>`/consents/*` | Legal documents, consent templates, GDPR compliance, versioning |
| **Community** | `community.balsm.health` | `/ideas`<br>`/issues`<br>`/discussions`<br>`/roadmap`<br>`/changelog`<br>`/kb` | Feature requests, bug reports, forums, roadmap, knowledge base |
| **System Status** | `status.balsm.health` | `/` | Real-time system status and uptime monitoring |

---

## API Route Patterns by Subdomain

### Core Domains

#### Clinical Records
```
API Base: /v1/clinical-records

Key Endpoints:
├─ /patients                            # List/create patients
├─ /patients/{id}                       # Patient details
├─ /patients/{id}/timeline              # Full timeline
├─ /patients/{id}/entries               # Clinical entries
├─ /entries/{id}                        # Entry details
├─ /patients/{id}/care-team             # Care team
├─ /referrals                           # Referrals
├─ /patients/{id}/consents              # Consent management
└─ /patients/{id}/self-reports          # Patient self-reports

Website:
├─ /features/clinical-records           # Feature page
├─ /features/ai-scribe                  # AI scribe marketing
└─ /resources/guides/clinical-docs      # Getting started guide

Portal:
├─ /patients                            # Patient list
├─ /patients/{id}/records               # Patient record view
├─ /patients/{id}/timeline              # Timeline view
└─ /patients/{id}/add-entry             # Add entry form
```

#### Prescriptions
```
API Base: /v1/prescriptions

Key Endpoints:
├─ /prescriptions                       # List/create prescriptions
├─ /prescriptions/{id}                  # Prescription details
├─ /prescriptions/{id}/validate         # Validate prescription
├─ /prescriptions/interactions/check    # Check drug interactions
├─ /prescriptions/recurring             # Recurring prescriptions
├─ /medications                         # Medication database
└─ /medications/{code}/interactions     # Interaction database

Website:
├─ /features/prescriptions              # Feature page
└─ /features/clinical-records           # Part of clinical workflow

Portal:
├─ /prescriptions                       # Prescription list
├─ /prescriptions/new                   # New prescription form
└─ /prescriptions/{id}                  # Prescription details
```

#### Charitable Donations
```
API Base: /v1/charitable-donations

Key Endpoints:
├─ /charities                           # List charities
├─ /charities/{id}                      # Charity details
├─ /cases                               # Donation cases
├─ /cases/{id}                          # Case details
├─ /cases/{id}/updates                  # Case updates
├─ /cases/{id}/donations                # Donate to case
└─ /donations/{id}                      # Donation receipt

Website:
├─ /charitable-donations                # Program overview
├─ /charitable-donations/how-it-works   # How it works
├─ /charitable-donations/cases          # Browse cases
├─ /charitable-donations/cases/{slug}   # Case page
├─ /charitable-donations/charities      # Charities list
└─ /charitable-donations/impact         # Impact report

Portal:
├─ /donations/browse                    # Browse cases
├─ /donations/donate/{caseId}           # Donation flow
└─ /donations/my-donations              # My donation history
```

#### Marketplace
```
API Base: /v1/marketplace

Key Endpoints:
├─ /addons                              # List add-ons
├─ /addons/{id}                         # Add-on details
├─ /addons/{id}/reviews                 # Reviews
├─ /addons/{id}/install                 # Install add-on
├─ /developers/register                 # Developer registration
├─ /developers/me/addons                # My add-ons (developer)
└─ /admin/addons/pending                # Admin approval queue

Website:
├─ /marketplace                         # Marketplace landing
├─ /marketplace/addons                  # Browse add-ons
├─ /marketplace/addons/{slug}           # Add-on page
├─ /marketplace/categories/{category}   # Category browse
├─ /marketplace/developers              # Developer program
└─ /marketplace/developers/docs         # Developer docs

Portal:
├─ /marketplace                         # Browse add-ons
├─ /marketplace/installed               # Installed add-ons
└─ /marketplace/settings/{addonId}      # Add-on settings
```

---

### Supporting Subdomains

#### Appointments
```
API Base: /v1/appointments

Key Endpoints:
├─ /appointments                        # List/book appointments
├─ /appointments/{id}                   # Appointment details
├─ /appointments/{id}/checkin           # Check-in
├─ /schedules/{id}/slots                # Available slots
├─ /waitinglist                         # Waiting list
├─ /house-visits                        # House visits
└─ /appointments/{id}/questionnaire     # Pre-visit questionnaire

Website:
├─ /features/appointments               # Feature page
└─ /solutions/primary-care              # Use case page

Portal:
├─ /appointments                        # Appointment list
├─ /appointments/book                   # Book appointment
└─ /appointments/{id}                   # Appointment details
```

#### Labs
```
API Base: /v1/labs

Key Endpoints:
├─ /orders                              # Lab orders
├─ /orders/{id}                         # Order details
├─ /orders/{id}/results                 # Lab results
├─ /specimens/{id}                      # Specimen tracking
└─ /qc/pending                          # Quality control queue

Website:
├─ /features/labs-radiology             # Combined feature page
└─ /solutions/diagnostic-centers        # Use case

Portal:
├─ /lab-results                         # Lab results list
└─ /lab-results/{orderId}               # Result details
```

#### Radiology
```
API Base: /v1/radiology

Key Endpoints:
├─ /orders                              # Imaging orders
├─ /studies/{id}                        # Study details
├─ /studies/{id}/images                 # Images
├─ /orders/{id}/report                  # Radiology report
└─ /pacs/studies/{id}                   # PACS integration

Website:
├─ /features/labs-radiology             # Combined feature page
└─ /solutions/diagnostic-centers        # Use case

Portal:
├─ /imaging                             # Imaging list
└─ /imaging/{studyId}                   # Study viewer
```

#### Pharmacy
```
API Base: /v1/pharmacy

Key Endpoints:
├─ /dispensations                       # Dispensation list
├─ /prescriptions/{id}/dispense         # Dispense prescription
├─ /dispensations/{id}/verify           # QR verification
├─ /inventory                           # Pharmacy inventory
└─ /deliveries                          # Delivery tracking

Website:
├─ /features/for-pharmacies             # Pharmacy features
└─ /solutions/pharmacies                # Pharmacy use case

Portal:
├─ /pharmacy/dispensations              # Dispensation queue
├─ /pharmacy/inventory                  # Inventory management
└─ /pharmacy/deliveries                 # Delivery tracking
```

#### Billing & Finance
```
API Base: /v1/billing

Key Endpoints:
├─ /bills                               # Bills
├─ /bills/{id}                          # Bill details
├─ /bills/{id}/payments                 # Record payment
├─ /claims                              # Insurance claims
├─ /patients/{id}/policies              # Insurance policies
└─ /payments/{id}                       # Payment receipt

Website:
├─ /features/billing                    # Billing features
├─ /pricing                             # Platform pricing
└─ /solutions/multi-location            # Enterprise billing

Portal:
├─ /billing/invoices                    # Invoice list
├─ /billing/payments                    # Payment history
└─ /billing/insurance                   # Insurance management
```

#### Entity Management
```
API Base: /v1/entities

Key Endpoints:
├─ /entities                            # Organizations/entities
├─ /entities/{id}/branches              # Branches
├─ /branches/{id}/departments           # Departments
├─ /departments/{id}/rooms              # Rooms
└─ /rooms/{id}/beds                     # Beds

Website:
├─ /features/for-hospitals              # Hospital features
└─ /solutions/multi-location            # Multi-branch solution

Portal:
├─ /settings/organization               # Organization settings
├─ /settings/branches                   # Branch management
└─ /settings/departments                # Department management
```

---

### Generic Subdomains

#### Identity & Access
```
API Base: /v1/identity

Key Endpoints:
├─ /auth/login                          # Login
├─ /auth/logout                         # Logout
├─ /auth/refresh                        # Refresh token
├─ /users/me                            # Current user profile
├─ /users/me/permissions                # My permissions
├─ /teams                               # Teams
└─ /permission-groups                   # Permission groups

Website:
├─ /login (redirect to portal)          # Login redirect
├─ /legal/privacy                       # Privacy policy
└─ /legal/hipaa                         # HIPAA compliance

Portal:
├─ /profile                             # User profile
├─ /settings/security                   # Security settings
└─ /settings/permissions                # Permission management (admin)
```

#### Inventory
```
API Base: /v1/inventory

Key Endpoints:
├─ /items                               # Inventory items
├─ /items/{id}/stock                    # Stock levels
├─ /purchase-orders                     # Purchase orders
└─ /vendors                             # Vendors

Website:
└─ (No public pages)

Portal:
├─ /inventory                           # Inventory list
├─ /inventory/purchase-orders           # PO management
└─ /inventory/vendors                   # Vendor management
```

#### Messaging & Notifications
```
API Base: /v1/messaging

Key Endpoints:
├─ /conversations                       # Conversations
├─ /conversations/{id}/messages         # Messages
├─ /notifications                       # Notifications
├─ /notifications/unread                # Unread notifications
└─ /announcements                       # Announcements

Website:
└─ (No public pages)

Portal:
├─ /messages                            # Messages inbox
├─ /messages/{conversationId}           # Conversation view
└─ /notifications                       # Notification center
```

---

## Domain Mapping

### Production Domains

```
Marketing Site:
├─ balsm.health                         # Main website (Next.js)
├─ www.balsm.health                     # Redirect to balsm.health
├─ ar.balsm.health                      # Arabic site (RTL)
└─ fr.balsm.health                      # French site

Application:
├─ portal.balsm.health                  # Patient/caregiver portal (Flutter Web)
├─ app.balsm.health                     # Caregiver web app (Flutter Web)
└─ admin.balsm.health                   # Admin dashboard (Flutter Web)

API:
├─ api.balsm.health                     # Cloud API (.NET)
└─ local.balsm.health                   # Local server (default DNS, or custom)

Documentation:
├─ docs.balsm.health                    # Technical documentation (VitePress/Docusaurus)
├─ developers.balsm.health              # Developer portal & add-on docs
├─ api.balsm.health/swagger             # API reference (Swagger UI)
├─ api.balsm.health/docs                # API reference (ReDoc)
└─ help.balsm.health                    # End-user help center

Downloads & Distribution:
├─ download.balsm.health                # Download hub (all platforms)
├─ get.balsm.health                     # Short alias (redirect)
├─ dl.balsm.health                      # Ultra-short alias (redirect)
├─ ios.balsm.health                     # iOS App Store (redirect)
├─ android.balsm.health                 # Google Play Store (redirect)
├─ beta.balsm.health                    # Beta downloads
├─ alpha.balsm.health                   # Alpha downloads (internal)
└─ cdn.balsm.health                     # CDN for download files

Sharing & QR Codes:
├─ share.balsm.health                   # Universal sharing hub & QR codes
├─ qr.balsm.health                      # Alias for share (redirect)
└─ s.balsm.health                       # Ultra-short alias (redirect)

Authentication (Optional - Enterprise):
├─ sso.balsm.health                     # Single Sign-On hub
├─ auth.balsm.health                    # Authentication services (redirect to SSO)
└─ accounts.balsm.health                # Account management hub

Payment (Optional):
├─ pay.balsm.health                     # Payment processing hub
├─ checkout.balsm.health                # Checkout flows
└─ secure.balsm.health                  # Secure payment pages

Legal & Compliance:
├─ legal.balsm.health                   # Legal documents & consent templates
└─ compliance.balsm.health              # Redirect to legal (alternative naming)

Monitoring:
├─ status.balsm.health                  # Status page
└─ metrics.balsm.health                 # Metrics dashboard (internal)
```

### Environment Domains

```
Staging:
├─ staging.balsm.health                 # Staging website
├─ portal-staging.balsm.health          # Staging portal
├─ api-staging.balsm.health             # Staging API
├─ docs-staging.balsm.health            # Staging docs
├─ developers-staging.balsm.health      # Staging developer portal
├─ help-staging.balsm.health            # Staging help center
├─ download-staging.balsm.health        # Staging downloads
└─ share-staging.balsm.health           # Staging share/QR codes

Development:
├─ dev.balsm.health                     # Dev website
├─ portal-dev.balsm.health              # Dev portal
├─ api-dev.balsm.health                 # Dev API
├─ docs-dev.balsm.health                # Dev docs
├─ developers-dev.balsm.health          # Dev developer portal
├─ help-dev.balsm.health                # Dev help center
├─ download-dev.balsm.health            # Dev downloads
└─ share-dev.balsm.health               # Dev share/QR codes

Local:
├─ localhost:3000                       # Website
├─ localhost:5000                       # Portal
├─ localhost:5001                       # API
├─ localhost:3001                       # Documentation (local preview)
├─ localhost:3002                       # Download hub (local preview)
└─ localhost:3003                       # Share/QR (local preview)
```

---

## URL Design Principles Summary

### API URLs
- ✅ Use nouns for resources: `/patients`, `/prescriptions`
- ✅ Use HTTP verbs for actions: GET, POST, PATCH, DELETE
- ✅ Use sub-resources for relationships: `/patients/{id}/entries`
- ✅ Use query parameters for filtering: `?status=active&date=2026-03-21`
- ✅ Version in URL: `/v1/...`
- ✅ Lowercase with hyphens: `/clinical-records`

### Website URLs
- ✅ Human-readable slugs: `/features/clinical-records`
- ✅ Hierarchical structure: `/marketplace/addons/{slug}`
- ✅ Consistent naming: Use same terms as API where applicable
- ✅ SEO-friendly: Keywords in URL
- ✅ Language prefix (optional): `/en/features`, `/ar/features`

### Portal URLs
- ✅ Resource-focused: `/patients/{id}/records`
- ✅ Action paths: `/appointments/book`
- ✅ Settings namespace: `/settings/organization`
- ✅ Clear hierarchy: `/marketplace/installed`

---

## Cross-Reference: Features → Subdomains → Routes

| Feature | Subdomain(s) | API Routes | Website | Portal |
|---------|--------------|-----------|---------|--------|
| **Clinical Documentation** | Clinical Records | `/v1/clinical-records/patients`<br>`/v1/clinical-records/entries` | `/features/clinical-records` | `/patients/{id}/records` |
| **AI Scribe** | Clinical Records | `/v1/clinical-records/entries` (AI-assisted) | `/features/ai-scribe` | `/patients/{id}/add-entry` |
| **e-Prescriptions** | Prescriptions | `/v1/prescriptions` | `/features/prescriptions` | `/prescriptions` |
| **Drug Safety** | Prescriptions | `/v1/prescriptions/interactions/check` | `/features/prescriptions` | `/prescriptions/new` |
| **Appointment Booking** | Appointments | `/v1/appointments` | `/features/appointments` | `/appointments/book` |
| **Lab Orders** | Labs | `/v1/labs/orders` | `/features/labs-radiology` | `/lab-results` |
| **Imaging** | Radiology | `/v1/radiology/studies` | `/features/labs-radiology` | `/imaging` |
| **Dispensation** | Pharmacy | `/v1/pharmacy/dispensations` | `/features/for-pharmacies` | `/pharmacy/dispensations` |
| **Billing** | Billing & Finance | `/v1/billing/bills` | `/features/billing` | `/billing/invoices` |
| **Insurance Claims** | Billing & Finance | `/v1/billing/claims` | `/features/billing` | `/billing/insurance` |
| **Charity Cases** | Charitable Donations | `/v1/charitable-donations/cases` | `/charitable-donations/cases` | `/donations/browse` |
| **Donations** | Charitable Donations | `/v1/charitable-donations/donations` | `/charitable-donations/donate` | `/donations/my-donations` |
| **Add-Ons** | Marketplace | `/v1/marketplace/addons` | `/marketplace/addons` | `/marketplace` |
| **Messages** | Messaging | `/v1/messaging/conversations` | — | `/messages` |
| **Notifications** | Messaging | `/v1/messaging/notifications` | — | `/notifications` |
| **User Profile** | Identity & Access | `/v1/identity/users/me` | — | `/profile` |
| **Permissions** | Identity & Access | `/v1/identity/permissions` | — | `/settings/permissions` |
| **Organization** | Entity Management | `/v1/entities` | `/features/for-hospitals` | `/settings/organization` |
| **Inventory** | Inventory | `/v1/inventory/items` | — | `/inventory` |

---

## Migration Path (If Applicable)

### Deprecated Routes → New Routes

If migrating from a legacy system, map old URLs to new:

```
Old API:
/api/patient/{id}                 → /v1/clinical-records/patients/{id}
/api/prescription/create          → POST /v1/prescriptions
/api/appointment/list             → GET /v1/appointments

Old Website:
/products                         → /features
/product/ehr                      → /features/clinical-records
/pricing-plans                    → /pricing
```

Implement 301 redirects for all moved URLs.

---

## Implementation Checklist

### API Routing
- [ ] Define routes per bounded context
- [ ] Implement versioning (`/v1`)
- [ ] Add authentication middleware
- [ ] Add permission checks per endpoint
- [ ] Implement rate limiting
- [ ] Generate OpenAPI/Swagger docs
- [ ] Add health check endpoints
- [ ] Configure CORS

### Website Routing
- [ ] Set up Next.js routing
- [ ] Implement i18n (multi-language)
- [ ] Create sitemap.xml
- [ ] Configure redirects
- [ ] Add meta tags (SEO)
- [ ] Implement structured data (Schema.org)
- [ ] Set up analytics tracking
- [ ] Configure domain & SSL

### Portal Routing
- [ ] Set up authenticated routes
- [ ] Implement route guards
- [ ] Add loading states
- [ ] Configure deep linking
- [ ] Handle 404 / unauthorized pages

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — Complete API endpoint reference
- [website-routing-strategy.md](./website-routing-strategy.md) — Complete website URL structure
- [subdomain-classification.md](./subdomain-classification.md) — Subdomain strategic analysis
- [communication-architecture.md](./communication-architecture.md) — Three-tier architecture

---

*Last updated: 2026-03-21*
