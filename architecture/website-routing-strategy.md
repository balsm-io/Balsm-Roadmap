# Website Routing Strategy

**Balsm Healthcare Platform - Public Website URL Structure**

---

## Overview

This document defines the routing strategy for the Balsm public-facing marketing website. The website is separate from the clinical application and contains NO protected health information (PHI).

---

## Base URL Structure

### Production

```
Primary:    https://balsm.health
Alternate:  https://www.balsm.health (redirects to primary)
```

### Environments

```
Production:  https://balsm.health
Staging:     https://staging.balsm.health
Development: https://dev.balsm.health
Local:       http://localhost:3000
```

---

## Site Architecture

### Marketing Site (Public)
- No authentication required
- SEO-optimized
- Multi-language support (i18n)
- WCAG 2.1 AA compliant
- Next.js/React

### Patient/Caregiver Portal
- Separate subdomain: `https://portal.balsm.health`
- Authenticated access
- Connects to API
- Flutter Web build

---

## Website Route Map

### Top-Level Navigation

```
/                           # Home
/about                      # About Balsm
/features                   # Platform features
/pricing                    # Pricing plans
/charitable-donations       # Social impact/charity program
/marketplace                # Add-on marketplace (public view)
/blog                       # Blog/news
/careers                    # Careers
/contact                    # Contact us
/legal                      # Legal hub
```

---

## Detailed Routes

### 1. Home (`/`)

**Purpose**: Landing page, value proposition

**URL**: `https://balsm.health/`

**Content**:
- Hero section
- Key differentiators
- Feature highlights
- Social impact mission
- CTA: Start free trial / Book demo

**SEO**:
- Title: "Balsm - Healthcare Platform for Modern Care"
- Description: "Complete healthcare management platform with AI-assisted clinical records, prescriptions, appointments, and social impact."

---

### 2. About (`/about`)

**Routes**:
```
/about                      # About Balsm
/about/mission              # Mission & vision
/about/team                 # Leadership team
/about/story                # Our story
/about/press                # Press kit & media
```

**Content**:
- Company mission and values
- Social impact focus
- Leadership bios
- Timeline/milestones
- Press releases

---

### 3. Features (`/features`)

**Routes** (organized by user persona):

```
/features                           # Features overview
/features/for-doctors               # For physicians
/features/for-hospitals             # For hospitals/clinics
/features/for-patients              # For patients
/features/for-pharmacies            # For pharmacies
/features/for-labs                  # For labs

# Feature-specific pages
/features/clinical-records          # Clinical documentation
/features/ai-scribe                 # AI-assisted scribe
/features/prescriptions             # e-Prescriptions & safety
/features/appointments              # Scheduling
/features/telemedicine              # Telemedicine
/features/labs-radiology            # Labs & radiology
/features/billing                   # Billing & insurance
/features/analytics                 # Analytics & reporting
/features/offline                   # Offline-first design
```

**Content per feature page**:
- Value proposition
- Key capabilities
- Screenshots/demos
- Use cases
- Testimonials
- CTA: Learn more / Try now

---

### 4. Pricing (`/pricing`)

**Routes**:
```
/pricing                    # Pricing plans
/pricing/compare            # Compare plans
/pricing/calculator         # Cost calculator
/pricing/enterprise         # Enterprise inquiry
```

**Plans** (example):
- **Starter**: Small clinics (1-5 doctors)
- **Professional**: Medium clinics (6-20 doctors)
- **Enterprise**: Hospitals (21+ doctors)
- **Add-Ons**: Marketplace add-ons

**Content**:
- Plan comparison table
- Feature matrix
- Add-on pricing
- FAQ
- CTA: Start trial / Contact sales

---

### 5. Charitable Donations (`/charitable-donations`)

**Routes**:
```
/charitable-donations                   # Charity program overview
/charitable-donations/how-it-works      # How it works
/charitable-donations/cases             # Browse donation cases
/charitable-donations/cases/{slug}      # Individual case page
/charitable-donations/charities         # Registered charities
/charitable-donations/charities/{slug}  # Charity profile
/charitable-donations/donate            # Make donation
/charitable-donations/impact            # Impact report
```

**Content**:
- Social impact mission
- How donations work
- Case browsing (public, non-PHI)
- Case updates timeline
- Transparency reports
- CTA: Browse cases / Donate now

**Example URLs**:
```
/charitable-donations/cases/heart-surgery-for-ahmed
/charitable-donations/charities/cairo-childrens-hospital
```

---

### 6. Marketplace (`/marketplace`)

**Routes**:
```
/marketplace                        # Add-on marketplace
/marketplace/addons                 # Browse add-ons
/marketplace/addons/{slug}          # Add-on details page
/marketplace/categories/{category}  # Browse by category
/marketplace/developers             # Developer program
/marketplace/developers/apply       # Apply to be developer
/marketplace/developers/docs        # Developer documentation
```

**Categories**:
- Clinical Decision Support
- Analytics & Reporting
- Integrations (HL7, FHIR, DICOM)
- Telemedicine Enhancements
- Patient Engagement
- Revenue Cycle Management

**Content**:
- Add-on listings
- Ratings & reviews
- Screenshots
- Pricing
- Installation guide
- Developer portal info

**Example URLs**:
```
/marketplace/addons/advanced-analytics-pro
/marketplace/addons/fhir-integration-suite
/marketplace/categories/clinical-decision-support
```

---

### 7. Solutions (Use Cases)

**Routes**:
```
/solutions                          # Solutions overview
/solutions/primary-care             # Primary care clinics
/solutions/specialty-clinics        # Specialty clinics
/solutions/hospitals                # Hospitals
/solutions/diagnostic-centers       # Labs & radiology centers
/solutions/pharmacies               # Pharmacies
/solutions/telemedicine             # Telemedicine providers
/solutions/multi-location           # Multi-location practices
```

**Content per solution**:
- Persona-specific pain points
- How Balsm solves them
- Feature highlights
- Case studies
- ROI calculator
- CTA: Schedule demo

---

### 8. Resources (`/resources`)

**Routes**:
```
/resources                          # Resource hub
/resources/blog                     # Blog
/resources/blog/{slug}              # Blog post
/resources/guides                   # Implementation guides
/resources/guides/{slug}            # Guide page
/resources/webinars                 # Webinars
/resources/webinars/{slug}          # Webinar page
/resources/case-studies             # Case studies
/resources/case-studies/{slug}      # Case study
/resources/videos                   # Video library
/resources/whitepapers              # Whitepapers
/resources/whitepapers/{slug}       # Whitepaper download
/resources/help                     # Help center (public)
```

**Blog Categories**:
```
/resources/blog/category/product-updates
/resources/blog/category/clinical-excellence
/resources/blog/category/healthcare-technology
/resources/blog/category/social-impact
```

**Example URLs**:
```
/resources/blog/introducing-ai-scribe-for-clinical-documentation
/resources/guides/getting-started-with-balsm
/resources/case-studies/cairo-clinic-improves-efficiency-by-40-percent
```

---

### 9. Company (`/company`)

**Routes**:
```
/company                # Company hub (redirect to /about)
/company/careers        # Careers
/company/careers/{slug} # Job posting
/company/contact        # Contact us
/company/partners       # Partners & integrations
/company/security       # Security & compliance
/company/privacy        # Privacy policy
```

**Careers**:
```
/company/careers                    # Open positions
/company/careers/engineering        # Engineering roles
/company/careers/clinical           # Clinical roles
/company/careers/sales              # Sales roles
/company/careers/senior-backend-engineer # Job posting example
```

---

### 10. Legal (`/legal`)

**Routes**:
```
/legal                      # Legal hub
/legal/terms                # Terms of service
/legal/privacy              # Privacy policy
/legal/hipaa                # HIPAA compliance
/legal/cookies              # Cookie policy
/legal/gdpr                 # GDPR compliance
/legal/accessibility        # Accessibility statement
/legal/licenses             # Open source licenses
```

**Content**:
- Terms of Service
- Privacy Policy
- HIPAA Business Associate Agreement
- Cookie Policy
- Data Processing Agreement (GDPR)
- Accessibility Statement (WCAG 2.1 AA)

---

### 11. Support & Help

**Routes**:
```
/support                    # Support hub
/support/contact            # Contact support
/support/faq                # FAQ
/support/system-status      # System status page
/support/documentation      # Public documentation
```

**System Status**:
- Real-time status dashboard
- Uptime monitoring
- Incident history
- Maintenance schedule

---

### 12. Localization (i18n)

**Language Routes**:

**Option 1: Subdomain** (Recommended)
```
https://balsm.health        # English (default)
https://ar.balsm.health     # Arabic
https://fr.balsm.health     # French
```

**Option 2: Path Prefix**
```
https://balsm.health/en     # English
https://balsm.health/ar     # Arabic (RTL support)
https://balsm.health/fr     # French
```

**Option 3: Domain TLD**
```
https://balsm.health        # English (global)
https://balsm.eg            # Egypt
https://balsm.sa            # Saudi Arabia
```

**Supported Languages (Phase 1)**:
- English (en)
- Arabic (ar) - RTL support
- French (fr)

**Language Switcher**: Always accessible in header/footer

---

## Landing Pages (Marketing Campaigns)

### Campaign-Specific Pages

```
/lp/{campaign-slug}         # Landing page for ad campaigns
/demo                       # Book a demo
/trial                      # Start free trial
/request-quote              # Request enterprise quote
```

**Examples**:
```
/lp/doctors-productivity
/lp/hospital-transformation
/lp/pharmacy-management
/demo?source=google-ads&campaign=doctors-q1
```

**Features**:
- No navigation (focused conversion)
- UTM parameter tracking
- A/B testing support
- Form submission to CRM

---

## Authentication & Portal Redirects

### Portal Login

```
https://portal.balsm.health              # Patient/caregiver portal
https://portal.balsm.health/login        # Login page
https://portal.balsm.health/register     # Registration
https://portal.balsm.health/forgot       # Forgot password
```

### Admin/Caregiver Login

```
https://app.balsm.health                 # Caregiver web app
https://app.balsm.health/login           # Login
```

### Redirects from Marketing Site

```
/login       → https://portal.balsm.health/login
/register    → https://portal.balsm.health/register
/app         → https://app.balsm.health
```

---

## SEO & Technical Considerations

### URL Best Practices

✅ **Do**:
- Use lowercase letters
- Use hyphens (-) for word separation
- Keep URLs short and descriptive
- Use meaningful slugs
- Include keywords naturally
- Use canonical URLs

❌ **Don't**:
- Use underscores (_)
- Use special characters or spaces
- Create deep nesting (max 3-4 levels)
- Use session IDs or query parameters for content
- Change URLs without 301 redirects

### Meta Tags (Example)

```html
<!-- Home Page -->
<title>Balsm - Healthcare Platform for Modern Care</title>
<meta name="description" content="Complete healthcare management platform with AI-assisted clinical records, e-prescriptions, appointments, and social impact. HIPAA compliant and offline-capable.">
<meta name="keywords" content="healthcare platform, EHR, EMR, e-prescriptions, telemedicine, HIPAA compliant">

<!-- Open Graph -->
<meta property="og:title" content="Balsm - Healthcare Platform for Modern Care">
<meta property="og:description" content="Complete healthcare management platform with AI-assisted clinical records, e-prescriptions, appointments, and social impact.">
<meta property="og:image" content="https://balsm.health/images/og-image.png">
<meta property="og:url" content="https://balsm.health">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Balsm - Healthcare Platform for Modern Care">
<meta name="twitter:description" content="Complete healthcare management platform with AI-assisted clinical records, e-prescriptions, appointments, and social impact.">
<meta name="twitter:image" content="https://balsm.health/images/twitter-card.png">
```

### Structured Data (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Balsm",
  "applicationCategory": "HealthApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "operatingSystem": "Web, iOS, Android, Windows, macOS, Linux",
  "description": "Complete healthcare management platform",
  "author": {
    "@type": "Organization",
    "name": "Balsm"
  }
}
```

### Sitemap

```xml
/sitemap.xml                # Main sitemap
/sitemap-pages.xml          # Static pages
/sitemap-blog.xml           # Blog posts
/sitemap-marketplace.xml    # Marketplace add-ons
/sitemap-donations.xml      # Charity cases
```

### Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /lp/

Sitemap: https://balsm.health/sitemap.xml
```

---

## Analytics & Tracking

### UTM Parameters

```
?utm_source=google
&utm_medium=cpc
&utm_campaign=doctors-q1
&utm_term=healthcare-platform
&utm_content=ad-variant-a
```

### Events to Track

- Page views
- CTA clicks (demo, trial, contact)
- Form submissions
- Video plays
- Download (whitepapers, guides)
- Donation initiated
- Marketplace add-on views
- Newsletter signups

---

## Redirects & Aliases

### Common Redirects

```
/home               → /
/about-us           → /about
/contact-us         → /contact
/blog/feed          → /resources/blog (with RSS)
/privacy-policy     → /legal/privacy
/terms-of-service   → /legal/terms
```

### Legacy URL Support

If migrating from old site:
```
/old-path           → /new-path (301 redirect)
/products/ehr       → /features/clinical-records
```

---

## Performance Optimization

### Static Generation (SSG)

Pre-render at build time:
- Home
- About
- Features
- Pricing
- Legal pages

### Incremental Static Regeneration (ISR)

Regenerate periodically:
- Blog posts
- Marketplace add-ons
- Charity cases
- Job postings

### Server-Side Rendering (SSR)

For dynamic content:
- Search results
- Filtered marketplace views
- User-specific content (if authenticated)

### Client-Side Rendering (CSR)

For interactive components:
- Pricing calculator
- Donation flow
- Contact forms

---

## Implementation Roadmap

### Phase 1: Core Pages (Month 1)
- ✅ Home
- ✅ About
- ✅ Features (overview)
- ✅ Pricing
- ✅ Contact
- ✅ Legal (Privacy, Terms)

### Phase 2: Content Expansion (Month 2)
- Blog
- Resources hub
- Feature detail pages
- Solutions (use cases)
- Help center

### Phase 3: Platform Features (Month 3)
- Marketplace (public view)
- Charitable Donations (public cases)
- Developer portal
- Partner directory

### Phase 4: Optimization (Month 4)
- Multi-language (i18n)
- Advanced analytics
- A/B testing
- Performance optimization
- SEO audit & fixes

---

## Technical Stack Recommendation

### Framework
**Next.js 14+** (React)
- Server-side rendering (SSR)
- Static site generation (SSG)
- Incremental static regeneration (ISR)
- Built-in routing
- Image optimization
- i18n support

### Hosting
- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Netlify**

### CMS (Optional)
- **Sanity.io** (for blog, case studies)
- **Contentful**
- **Strapi** (self-hosted)

### Analytics
- **Google Analytics 4**
- **Plausible** (privacy-focused alternative)
- **Posthog** (product analytics)

### A/B Testing
- **Vercel Edge Config**
- **Optimizely**
- **Google Optimize** (sunset - use alternatives)

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint routing by subdomain
- [subdomain-classification.md](./subdomain-classification.md) — Subdomain strategic analysis
- [UI_DESIGN.md](../agents/rules/UI_DESIGN.md) — Design system and components
- [CODING_STANDARDS.md](../agents/rules/CODING_STANDARDS.md) — Technical standards

---

*Last updated: 2026-03-21*
