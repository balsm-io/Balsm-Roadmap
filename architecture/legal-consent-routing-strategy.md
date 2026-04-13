# Legal & Consent Routing Strategy

**Balsm Healthcare Platform - Legal Documents & Consent Management**

---

## Overview

This document defines the routing strategy for legal documents, consent templates, and compliance content. Given the static nature of legal content and compliance requirements, a dedicated subdomain provides better version control, audit capabilities, and team ownership.

---

## Legal Domain

### Primary Domain

```
legal.balsm.health                      # Legal & compliance hub
```

### Alternative Aliases

```
compliance.balsm.health                 # Redirect to legal (compliance-focused branding)
```

---

## Why Dedicated Subdomain?

✅ **Version Control** - Track all legal document versions in one place
✅ **Compliance Audit** - Centralized location for auditors and regulators
✅ **Performance** - Heavy CDN caching for static content
✅ **Team Ownership** - Legal/compliance team owns the subdomain
✅ **Template Management** - Centralized consent templates
✅ **Multi-Product Ready** - If Balsm expands, shared legal infrastructure
✅ **Clean URLs** - `legal.balsm.health/privacy` is professional
✅ **Isolation** - Separate deployment pipeline for legal updates
✅ **Audit Trail** - Every legal update tracked independently

---

## Legal Domain Routes (`legal.balsm.health`)

### Legal Documents

```
/                                       # Legal hub (directory of all legal documents)

# Core Legal Documents
/terms                                  # Terms of Service
/privacy                                # Privacy Policy
/cookies                                # Cookie Policy
/hipaa                                  # HIPAA Compliance Statement
/gdpr                                   # GDPR Compliance
/patient-rights                         # Patient Rights under HIPAA
/disclaimer                             # Medical Disclaimer
/acceptable-use                         # Acceptable Use Policy
/accessibility                          # Accessibility Statement (WCAG 2.1 AA)

# Business Agreements
/baa                                    # Business Associate Agreement (BAA)
/dpa                                    # Data Processing Agreement (DPA for GDPR)
/sla                                    # Service Level Agreement
/aup                                    # Acceptable Use Policy (detailed)

# Licensing
/licenses                               # Open Source Licenses
/licenses/third-party                   # Third-party software licenses

# Regulatory Compliance
/compliance                             # Compliance overview
/compliance/hipaa                       # HIPAA compliance details
/compliance/gdpr                        # GDPR compliance details
/compliance/pipeda                      # PIPEDA (Canada)
/compliance/pdpa                        # PDPA (Singapore)
/compliance/certifications              # ISO certifications, SOC 2, etc.
```

---

### Document Versioning

```
# Latest Version (Default)
/terms                                  # Latest version
/privacy                                # Latest version

# Specific Version
/terms?version=2026-03-01               # Specific version by date
/privacy?version=2026-03-01             # Specific version by date

# Version History
/terms/history                          # All versions of Terms of Service
/privacy/history                        # All versions of Privacy Policy

# Change Log
/changes                                # Change log hub
/changes?document=terms&from=2026-03-01&to=2026-06-01  # What changed
/terms/changes?from=2026-03-01&to=2026-06-01           # Terms changes
/privacy/changes?from=2026-03-01&to=2026-06-01         # Privacy changes

# Archived Versions
/archive                                # Archive of all historical documents
/archive/terms/2025-01-01               # Archived version
/archive/privacy/2025-01-01             # Archived version
```

---

### Consent Templates

```
# Consent Template Hub
/consents                               # Consent templates directory
/consents/catalog                       # Full catalog of all consent types

# Clinical Consents
/consents/treatment                     # General Treatment Consent
/consents/procedure                     # Procedure-Specific Consent
/consents/surgery                       # Surgery Consent
/consents/anesthesia                    # Anesthesia Consent
/consents/blood-transfusion             # Blood Transfusion Consent
/consents/sedation                      # Sedation Consent
/consents/biopsy                        # Biopsy Consent
/consents/vaccination                   # Vaccination Consent

# Research & Trials
/consents/research                      # Research Participation Consent
/consents/clinical-trial                # Clinical Trial Consent
/consents/biobank                       # Biobanking Consent
/consents/genetic-testing               # Genetic Testing Consent

# Data & Privacy Consents
/consents/data-sharing                  # Data Sharing Consent
/consents/hipaa-authorization           # HIPAA Authorization Form
/consents/medical-records-release       # Medical Records Release
/consents/photography                   # Photography/Video Consent
/consents/telehealth                    # Telehealth Consent

# Caregiver & Proxy Consents
/consents/caregiver-access              # Caregiver Access Consent
/consents/proxy-decision-making         # Healthcare Proxy/Power of Attorney
/consents/minor-treatment               # Parental Consent for Minor
/consents/emergency-contact             # Emergency Contact Authorization

# Insurance & Billing Consents
/consents/insurance-authorization       # Insurance Authorization
/consents/financial-responsibility      # Financial Responsibility Agreement
/consents/payment-plan                  # Payment Plan Agreement

# Organ Donation
/consents/organ-donation                # Organ Donation Registration

# Template Versions
/consents/{templateId}?version=2026-03-01  # Specific template version
/consents/{templateId}/history             # Template version history

# Template Downloads
/consents/{templateId}/pdf              # Download as PDF
/consents/{templateId}/docx             # Download as Word document
/consents/{templateId}/html             # HTML version (web display)
```

---

### Consent Template Metadata

Each consent template route returns structured data:

```json
GET /consents/treatment

{
  "id": "treatment-consent-v3",
  "title": "General Treatment Consent",
  "version": "3.0",
  "effectiveDate": "2026-03-01",
  "expiryDate": null,
  "language": "en",
  "jurisdiction": "US",
  "requiresWitness": false,
  "requiresNotarization": false,
  "content": {
    "html": "<div>...</div>",
    "markdown": "# General Treatment Consent\n\n...",
    "plainText": "General Treatment Consent..."
  },
  "sections": [
    {
      "id": "purpose",
      "title": "Purpose of Treatment",
      "content": "..."
    },
    {
      "id": "risks",
      "title": "Risks and Benefits",
      "content": "..."
    },
    {
      "id": "alternatives",
      "title": "Alternative Treatments",
      "content": "..."
    },
    {
      "id": "patient-rights",
      "title": "Patient Rights",
      "content": "You have the right to..."
    }
  ],
  "signatureFields": [
    {
      "id": "patient-signature",
      "label": "Patient Signature",
      "required": true,
      "type": "signature"
    },
    {
      "id": "patient-name",
      "label": "Patient Name (Printed)",
      "required": true,
      "type": "text"
    },
    {
      "id": "date",
      "label": "Date",
      "required": true,
      "type": "date"
    }
  ],
  "downloadUrls": {
    "pdf": "/consents/treatment/pdf",
    "docx": "/consents/treatment/docx",
    "html": "/consents/treatment/html"
  },
  "relatedDocuments": [
    "/privacy",
    "/patient-rights"
  ],
  "changeLog": "/consents/treatment/changes",
  "previousVersion": "treatment-consent-v2"
}
```

---

## API Integration

### Legal Document API

```
GET /api/documents/{documentType}
GET /api/documents/{documentType}?version={version}
GET /api/documents/{documentType}/versions
GET /api/documents/{documentType}/changes?from={from}&to={to}
```

**Example:**
```
GET legal.balsm.health/api/documents/privacy

Response:
{
  "documentType": "privacy",
  "title": "Privacy Policy",
  "version": "2026-03-01",
  "effectiveDate": "2026-03-01T00:00:00Z",
  "content": {
    "html": "...",
    "markdown": "...",
    "plainText": "..."
  },
  "downloadUrls": {
    "pdf": "/privacy/pdf",
    "html": "/privacy"
  },
  "previousVersion": "2025-12-01"
}
```

---

### Consent Template API

```
GET /api/consents
GET /api/consents/{templateId}
GET /api/consents/{templateId}?version={version}
GET /api/consents/{templateId}/versions
GET /api/consents/{templateId}/pdf
```

**Example:**
```
GET legal.balsm.health/api/consents/treatment

Response: (See JSON structure above)
```

---

## User Consent Instances (Separate from Templates)

### Portal Routes (User's Active Consents)

```
portal.balsm.health/consents/*          # User's consent instances
```

**Routes:**
```
/consents                               # My consents overview
/consents/active                        # Active consents
/consents/history                       # Consent history (revoked, expired)
/consents/pending                       # Pending consent requests

# View/Manage Specific Consent
/consents/{consentId}                   # View consent details
/consents/{consentId}/revoke            # Revoke consent
/consents/{consentId}/download          # Download signed consent PDF
/consents/{consentId}/audit             # Audit trail (who accessed this consent)

# Grant New Consent
/consents/grant/{templateId}            # Grant consent from template
/consents/grant/{templateId}/review     # Review template before signing
/consents/grant/{templateId}/sign       # E-signature page
/consents/grant/{templateId}/success    # Consent recorded successfully

# Consent Requests (from providers)
/consent-requests                       # Pending requests from providers
/consent-requests/{requestId}           # Review request
/consent-requests/{requestId}/approve   # Approve request
/consent-requests/{requestId}/deny      # Deny request
```

---

### API Routes (User Consent Instances)

```
# Already defined in api-routing-strategy.md under Clinical Records
GET    /v1/clinical-records/patients/{patientId}/consents
POST   /v1/clinical-records/patients/{patientId}/consents
GET    /v1/clinical-records/consents/{consentId}
POST   /v1/clinical-records/consents/{consentId}/revoke
GET    /v1/clinical-records/consents/{consentId}/history
```

**Consent Instance Creation (Links to Template):**
```
POST /v1/clinical-records/patients/{patientId}/consents
{
  "templateUrl": "https://legal.balsm.health/consents/treatment",
  "templateId": "treatment-consent-v3",
  "templateVersion": "2026-03-01",
  "agreedAt": "2026-03-21T10:00:00Z",
  "signature": {
    "method": "electronic",  // or "wet-signature", "biometric", "verbal"
    "signatureData": "base64-encoded-signature-image",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "geolocation": {
      "latitude": 30.0444,
      "longitude": 31.2357
    }
  },
  "witness": {
    "name": "Dr. John Smith",
    "role": "Physician",
    "signature": "base64-encoded-witness-signature"
  },
  "customFields": {
    "procedureName": "Appendectomy",
    "scheduledDate": "2026-03-25"
  }
}

Response:
{
  "id": "consent-abc123",
  "patientId": "patient-12345",
  "templateId": "treatment-consent-v3",
  "templateUrl": "https://legal.balsm.health/consents/treatment",
  "status": "active",
  "agreedAt": "2026-03-21T10:00:00Z",
  "expiresAt": null,
  "revokedAt": null,
  "certificateUrl": "/v1/clinical-records/consents/consent-abc123/certificate",
  "downloadUrl": "/v1/clinical-records/consents/consent-abc123/pdf"
}
```

---

## Legal Acceptance Tracking

### First-Time User Acceptance

When user registers or first logs in:

```
# Backend checks if user has accepted latest legal documents
GET /v1/identity/users/me/legal-acceptances

Response:
{
  "requiresAcceptance": true,
  "documents": [
    {
      "type": "terms_of_service",
      "title": "Terms of Service",
      "url": "https://legal.balsm.health/terms",
      "version": "2026-03-01",
      "userAcceptedVersion": null,
      "required": true
    },
    {
      "type": "privacy_policy",
      "title": "Privacy Policy",
      "url": "https://legal.balsm.health/privacy",
      "version": "2026-03-01",
      "userAcceptedVersion": null,
      "required": true
    },
    {
      "type": "hipaa_notice",
      "title": "HIPAA Notice of Privacy Practices",
      "url": "https://legal.balsm.health/hipaa",
      "version": "2026-01-01",
      "userAcceptedVersion": null,
      "required": true
    }
  ]
}

# User accepts documents
POST /v1/identity/users/me/legal-acceptances
{
  "acceptances": [
    {
      "documentType": "terms_of_service",
      "url": "https://legal.balsm.health/terms",
      "version": "2026-03-01",
      "acceptedAt": "2026-03-21T10:00:00Z",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "documentType": "privacy_policy",
      "url": "https://legal.balsm.health/privacy",
      "version": "2026-03-01",
      "acceptedAt": "2026-03-21T10:00:00Z",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

### Legal Document Update Flow

When legal documents are updated:

```
1. Legal team updates document at legal.balsm.health
2. New version published with effective date
3. System detects version change
4. On next user login:
   - Check if user accepted latest version
   - If not, show modal: "We've updated our Privacy Policy"
   - User must review and accept to proceed
5. Record acceptance in database
6. User can continue using platform
```

**Acceptance Modal Content:**
```
Title: "We've Updated Our Privacy Policy"

Body:
"We've made changes to our Privacy Policy, effective March 1, 2026.
Please review the updated policy before continuing."

Links:
[View Full Privacy Policy] → legal.balsm.health/privacy
[What's Changed?] → legal.balsm.health/privacy/changes?from=2025-12&to=2026-03

Actions:
[I Agree] → Records acceptance, allows user to proceed
[Review Later] → Logs out user (for non-critical updates)
[Decline] → Cannot use service (for critical updates like Terms)
```

---

## Privacy Settings Routes

### Portal Privacy Settings (`portal.balsm.health/privacy`)

```
/privacy                                # Privacy hub
/privacy/overview                       # Privacy overview & quick actions

# Data Sharing Controls
/privacy/data-sharing                   # Data sharing preferences
/privacy/share-with-caregivers          # Control caregiver access
/privacy/share-with-providers           # Control provider access
/privacy/share-with-insurance           # Control insurance access
/privacy/share-for-research             # Opt-in/out of research

# Communication Preferences
/privacy/communications                 # Communication preferences
/privacy/email                          # Email preferences
/privacy/sms                            # SMS preferences
/privacy/push-notifications             # Push notification preferences
/privacy/marketing                      # Marketing preferences

# Privacy Controls
/privacy/access-logs                    # Who accessed my data (audit)
/privacy/connected-apps                 # Third-party app permissions
/privacy/connected-apps/{appId}/revoke  # Revoke app access

# GDPR Rights
/privacy/download-data                  # Download my data (GDPR)
/privacy/export                         # Export all data
/privacy/delete-account                 # Request account deletion
/privacy/rectification                  # Request data correction

# Cookie Preferences
/privacy/cookies                        # Cookie preferences
```

---

## Compliance Reporting

### Admin/Compliance Routes

```
admin.balsm.health/compliance/*         # Compliance dashboard (admin)
```

**Routes:**
```
/compliance                             # Compliance overview
/compliance/hipaa                       # HIPAA compliance status
/compliance/gdpr                        # GDPR compliance status

# Consent Compliance
/compliance/consents                    # Consent compliance overview
/compliance/consents/missing            # Patients missing required consents
/compliance/consents/expired            # Expired consents
/compliance/consents/audit              # Consent audit report

# Data Access Audit
/compliance/access-logs                 # Data access audit logs
/compliance/access-logs/export          # Export audit logs
/compliance/breach-incidents            # Breach incident log (HIPAA)

# Legal Document Tracking
/compliance/legal-acceptances           # Legal acceptance rates
/compliance/legal-acceptances/pending   # Users who haven't accepted
/compliance/legal-acceptances/report    # Acceptance report

# Regulatory Reports
/compliance/reports                     # Compliance reports
/compliance/reports/hipaa-annual        # HIPAA annual report
/compliance/reports/gdpr-dpia           # GDPR DPIA (Data Protection Impact Assessment)
/compliance/reports/breach-notification # Breach notification report
```

---

## Content Management

### Legal Content Updates (Internal)

```
# Content Management System (CMS) for legal team
legal.balsm.health/admin/*              # Legal CMS (authenticated)
```

**Routes:**
```
/admin                                  # Legal admin dashboard
/admin/documents                        # Manage legal documents
/admin/documents/create                 # Create new document
/admin/documents/{documentId}/edit      # Edit document
/admin/documents/{documentId}/publish   # Publish new version
/admin/documents/{documentId}/versions  # Manage versions

# Consent Template Management
/admin/consents                         # Manage consent templates
/admin/consents/create                  # Create new template
/admin/consents/{templateId}/edit       # Edit template
/admin/consents/{templateId}/preview    # Preview template
/admin/consents/{templateId}/publish    # Publish new version
/admin/consents/{templateId}/retire     # Retire old template

# Workflow
/admin/drafts                           # Draft documents
/admin/review-queue                     # Documents pending review
/admin/approval-queue                   # Documents pending approval
/admin/published                        # Published documents
```

---

## Multi-Language Support

### Localized Legal Documents

```
# Default (English)
/terms                                  # English
/privacy                                # English

# Language Parameter
/terms?lang=ar                          # Arabic
/privacy?lang=ar                        # Arabic
/terms?lang=fr                          # French

# Subdomain (Alternative)
ar.legal.balsm.health/terms             # Arabic subdomain
fr.legal.balsm.health/terms             # French subdomain

# Path Prefix (Alternative)
/ar/terms                               # Arabic
/fr/terms                               # French
```

**Supported Languages:**
- English (en) - Default
- Arabic (ar) - RTL support
- French (fr)

---

## Technology Stack Recommendations

### Static Site Generator

**Recommended: VitePress or Docusaurus**

```yaml
Technology: VitePress (Vue-based)
Source: Markdown files in Git
Versioning: Git tags
Hosting: Vercel, Netlify, or CloudFront + S3

Benefits:
- Markdown-based (easy for legal team to edit)
- Git version control (full audit trail)
- Fast static site (excellent SEO)
- Built-in search
- Multi-language support
```

### Alternative: Headless CMS

**For Non-Technical Legal Team:**

```yaml
Technology: Sanity.io or Contentful
Frontend: Next.js
Deployment: Vercel

Benefits:
- WYSIWYG editor for legal team
- Version control built-in
- Approval workflows
- Scheduled publishing
- Preview mode
```

### PDF Generation

```yaml
Technology: Puppeteer or WeasyPrint
Use Case:
- Generate PDF for downloads
- Generate consent certificates
- Generate historical versions

Endpoint: /api/documents/{type}/pdf
```

---

## Security & Compliance Features

### Immutable Audit Trail

Every legal document update records:
```json
{
  "documentId": "privacy-policy",
  "version": "2026-03-01",
  "previousVersion": "2025-12-01",
  "publishedBy": "legal-admin-user-123",
  "publishedAt": "2026-03-01T00:00:00Z",
  "approvedBy": "legal-counsel-user-456",
  "approvedAt": "2026-02-25T14:30:00Z",
  "changeReason": "Updated data retention policy to comply with GDPR",
  "changesummary": "Section 3.2 updated, Section 5 added",
  "gitCommit": "abc123def456",
  "s3VersionId": "version-xyz789"
}
```

### Content Integrity

- **Digital Signatures**: Sign legal documents with cryptographic signature
- **Checksums**: SHA-256 hash of document content
- **Verification URL**: `/api/documents/{type}/verify?hash={hash}`

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1)
- ✅ Set up `legal.balsm.health` subdomain
- ✅ Deploy static site (VitePress/Docusaurus)
- ✅ Publish core legal documents (Terms, Privacy, HIPAA)
- ✅ API for document retrieval
- ✅ Basic versioning

### Phase 2: Consent Templates (Month 2)
- Consent template catalog
- PDF generation
- Template API
- Integration with Clinical Records API

### Phase 3: User Workflows (Month 3)
- Legal acceptance tracking
- User privacy settings
- Consent granting workflows (portal)
- Document update notification flow

### Phase 4: Compliance (Month 4)
- Admin compliance dashboard
- Consent compliance reports
- Access audit logs
- Legal CMS for content management

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — Clinical Records consent API
- [authentication-routing-strategy.md](./authentication-routing-strategy.md) — Legal acceptance during registration
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping

---

*Last updated: 2026-03-21*
