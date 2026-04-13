# Share & QR Code Routing Strategy

**Balsm Healthcare Platform - Universal Sharing & QR Code Management**

---

## Overview

This document defines the routing strategy for the unified sharing and QR code subdomain. All shareable content and QR codes across the Balsm platform are consolidated under a single domain for consistency, security, and analytics.

---

## Share Domain

### Primary Domain

```
share.balsm.health                      # Universal sharing hub
```

### Alternative Aliases

```
qr.balsm.health                         # Redirect to share.balsm.health
s.balsm.health                          # Ultra-short alias (redirect)
```

**Recommendation**: Use `share.balsm.health` as primary, with `s.balsm.health` for ultra-short QR codes.

---

## Core Principles

### 1. Universal Short Links
All shareable content gets a short, memorable URL:
```
share.balsm.health/{shortCode}          # e.g., share.balsm.health/abc123
```

### 2. Smart Routing
Server detects content type from short code and routes appropriately:
- Mobile browser → App prompt or mobile-optimized page
- Desktop browser → Web portal or information page
- App installed → Deep link into app

### 3. Security First
- Time-limited links (expire after X hours/days)
- One-time use links (expire after first access)
- Consent-based sharing (requires patient approval)
- Encrypted payload in URL hash
- Audit trail for all accesses

### 4. Context Preservation
Short links maintain context:
```
share.balsm.health/abc123
  → Resolves to: /prescription/67890
  → Includes: User permissions, expiration, access count
```

---

## Route Structure

### Universal Short Link (Primary Pattern)

```
/{shortCode}                            # Universal resolver
```

**Examples:**
```
share.balsm.health/a7k2m               # Health passport
share.balsm.health/p9x4z               # Prescription
share.balsm.health/d3h8n               # Donation case
share.balsm.health/r2q5t               # Lab result
```

**Behavior:**
1. Server looks up `shortCode` in database
2. Validates permissions, expiration, access count
3. Logs access (analytics, audit trail)
4. Redirects to appropriate target (app or web)

---

### Typed Routes (Human-Readable Alternative)

For contexts where clear labeling is important:

```
# Health Passport & Emergency Profile
/health-passport/{hash}                 # Patient health passport (QR)
/emergency/{hash}                       # Emergency profile
/medical-id/{patientId}                 # Medical ID (public, limited info)

# Clinical Records
/record/{hash}                          # Medical record share (consent-based)
/record/{hash}/view                     # View record (web)
/entry/{hash}                           # Single clinical entry share
/timeline/{hash}                        # Patient timeline share

# Prescriptions
/prescription/{id}                      # Prescription details
/prescription/{id}/verify               # QR verification (pharmacy)
/rx/{shortCode}                         # Ultra-short prescription link

# Appointments
/appointment/{id}                       # Appointment details
/appointment/{id}/checkin               # Check-in QR code
/appointment/{id}/directions            # Clinic directions
/appointment/{id}/video                 # Telemedicine join link

# Lab Results
/lab-result/{hash}                      # Lab result (time-limited)
/lab/{shortCode}                        # Short lab result link
/specimen/{id}                          # Specimen tracking

# Imaging/Radiology
/imaging/{hash}                         # Imaging study share
/scan/{shortCode}                       # Short imaging link
/dicom/{hash}                           # DICOM viewer link

# Charitable Donations
/donation/{caseSlug}                    # Donation case
/case/{shortCode}                       # Short donation case link
/charity/{charityId}                    # Charity profile

# Referrals
/referral/{id}                          # Doctor referral
/refer/{shortCode}                      # Short referral link

# App Downloads
/download/{platform}                    # Platform-specific download
/app                                    # Auto-detect platform download
/get                                    # Alias for /app

# Add-Ons
/addon/{addonId}                        # Add-on details (marketplace)
/install/{addonId}                      # One-click add-on install

# Care Team
/care-team/{hash}                       # Care team collaboration link
/team/{shortCode}                       # Short care team link

# Consent & Authorization
/consent/{hash}                         # Consent form
/authorize/{hash}                       # Authorization request
```

---

## QR Code Generation

### QR Code API

```
GET /api/qr/generate

Body (JSON):
{
  "targetUrl": "https://share.balsm.health/prescription/12345",
  "size": 512,
  "format": "png",
  "errorCorrection": "M",
  "foregroundColor": "#000000",
  "backgroundColor": "#FFFFFF",
  "logo": "balsm-icon.png"
}

Response:
- Content-Type: image/png or image/svg+xml
- QR code image
```

### QR Code Display Pages

```
/qr/{shortCode}                         # Display QR code with info
/qr/{shortCode}/download                # Download QR as image
/qr/{shortCode}/print                   # Print-optimized QR page
```

**Example:**
```
share.balsm.health/qr/abc123
  → Shows: QR code + Instructions + Expiration time
```

---

## Security Features

### 1. Time-Limited Links

**Use Cases:**
- Lab results (24-48 hours)
- Temporary record sharing (1 week)
- Appointment check-in (valid only on appointment day)

**Implementation:**
```json
{
  "shortCode": "abc123",
  "target": "/lab-result/67890",
  "expiresAt": "2026-03-25T23:59:59Z",
  "expired": false
}
```

**Expired Link Page:**
```
share.balsm.health/abc123
  → "This link has expired. Please request a new one."
```

---

### 2. One-Time Use Links

**Use Cases:**
- Prescription pickup (QR scanned once by pharmacy)
- Consent forms (sign once)
- Secure document download

**Implementation:**
```json
{
  "shortCode": "xyz789",
  "target": "/prescription/12345/verify",
  "maxAccessCount": 1,
  "accessCount": 0,
  "used": false
}
```

**After First Access:**
```
share.balsm.health/xyz789
  → "This link has already been used and is no longer valid."
```

---

### 3. Consent-Based Sharing

**Use Cases:**
- Medical record sharing (patient must approve)
- Care team invitations (patient must accept)
- Referral sharing (patient must consent)

**Flow:**
1. Doctor requests share link
2. Patient receives notification (app/SMS/email)
3. Patient approves/denies
4. If approved, link is activated
5. Recipient accesses link

**Implementation:**
```json
{
  "shortCode": "def456",
  "target": "/record/patient-12345",
  "requiresConsent": true,
  "consentStatus": "pending",
  "requestedBy": "Dr. Smith",
  "patientId": "12345",
  "approvedAt": null
}
```

---

### 4. Access Control

**IP Whitelisting** (Optional for enterprise):
```json
{
  "shortCode": "ghi789",
  "allowedIPs": ["192.168.1.0/24"],
  "deniedIPs": []
}
```

**Geographic Restrictions** (Optional):
```json
{
  "shortCode": "jkl012",
  "allowedCountries": ["EG", "SA", "AE"],
  "deniedCountries": []
}
```

**Device Restrictions**:
```json
{
  "shortCode": "mno345",
  "allowedDevices": ["mobile", "tablet"],
  "deniedDevices": ["desktop"]
}
```

---

## Short Code Generation

### Format Options

**Option 1: Random Alphanumeric (Recommended)**
```
Length: 6 characters
Character set: a-z, A-Z, 0-9 (excluding confusing characters: 0, O, I, l)
Example: a7K2mP
Collision probability: ~56 billion combinations
```

**Option 2: Pronounceable**
```
Length: 8 characters
Pattern: consonant-vowel-consonant-vowel (CVCVCVCV)
Example: pabetosu
Easier to communicate verbally
```

**Option 3: Numeric**
```
Length: 8 digits
Example: 12345678
For SMS-friendly sharing
```

**Option 4: Hash-Based**
```
SHA256(targetUrl + timestamp + salt) → Take first 8 chars
Example: f3a9c2d1
Deterministic but secure
```

---

## Analytics & Tracking

### Metrics to Track

```
Per Short Link:
- Total access count
- Unique visitor count
- Geographic distribution (country, city)
- Device types (mobile, desktop, tablet)
- Browser types
- App vs. web access
- Time to first access
- Access patterns (time of day, day of week)
- Conversion rate (view → action)
```

### Analytics API

```
GET /api/analytics/{shortCode}

Response:
{
  "shortCode": "abc123",
  "created": "2026-03-21T10:00:00Z",
  "expires": "2026-03-28T10:00:00Z",
  "totalAccess": 42,
  "uniqueVisitors": 38,
  "lastAccessed": "2026-03-25T14:30:00Z",
  "devices": {
    "mobile": 35,
    "desktop": 5,
    "tablet": 2
  },
  "countries": {
    "EG": 30,
    "SA": 8,
    "AE": 4
  },
  "conversions": 12
}
```

---

## Deep Linking Integration

### Behavior Matrix

| Condition | Action |
|-----------|--------|
| **Mobile + App Installed** | Open in app directly |
| **Mobile + No App** | Show "Open in App" banner → Download CTA |
| **Desktop + App Installed** | Prompt to open in desktop app (optional) |
| **Desktop + No App** | Open in web portal |

### Universal Link Format

```
share.balsm.health/{shortCode}
  → App opens: balsm://share/{shortCode}
  → Web opens: portal.balsm.health/{resolved-path}
```

### Smart Banner

When app is not installed:
```html
<div class="app-banner">
  <img src="/icons/balsm-icon.png" alt="Balsm">
  <div>
    <strong>Open in Balsm</strong>
    <p>View this prescription in the app</p>
  </div>
  <a href="https://download.balsm.health/app">Get App</a>
  <button>Continue in Browser</button>
</div>
```

---

## Use Case Details

### 1. Health Passport (Emergency Profile)

**Route**: `/health-passport/{hash}`

**QR Code Contains:**
- Patient name
- Blood type
- Allergies
- Emergency contacts
- Current medications
- Chronic conditions

**Access**: Public (no authentication)

**Expiration**: Never (permanent until patient disables)

**Security**:
- Read-only
- No PHI beyond emergency essentials
- Access logged for patient review

**Use Case**: Emergency responders scan QR code on patient's phone lock screen or medical ID bracelet.

---

### 2. Prescription Verification

**Route**: `/prescription/{id}/verify`

**QR Code Contains:**
- Prescription ID
- Patient name (initials only)
- Medication name & dose
- Prescribing doctor
- Issue date
- Verification hash

**Access**: Pharmacy staff only (requires pharmacy authentication)

**Expiration**: 90 days after prescription issue

**Security**:
- One-time verification (flagged after dispensed)
- Encrypted QR payload
- Audit trail with pharmacy ID

**Flow:**
1. Patient receives prescription with QR code
2. Patient goes to pharmacy
3. Pharmacist scans QR
4. System verifies prescription validity
5. System marks as dispensed
6. QR becomes invalid for future scans

---

### 3. Appointment Check-In

**Route**: `/appointment/{id}/checkin`

**QR Code Contains:**
- Appointment ID
- Patient name
- Appointment date/time
- Department/room
- Check-in token

**Access**: Clinic staff or self-service kiosk

**Expiration**: Valid only on appointment day (6 AM - midnight)

**Flow:**
1. Patient arrives at clinic
2. Scans QR at kiosk or shows to receptionist
3. System marks patient as checked in
4. Updates waiting queue
5. Sends notification to assigned caregiver

---

### 4. Lab Result Sharing

**Route**: `/lab-result/{hash}`

**QR Code Contains:**
- Lab order ID
- Patient name (hashed)
- Time-limited access token
- Result summary

**Access**: Patient or authorized caregivers only

**Expiration**: 48 hours after result publication

**Security**:
- Requires authentication if PHI details
- Time-limited link
- Access logged

**Flow:**
1. Lab publishes results
2. Patient receives notification with share link
3. Patient shares link with doctor (via QR or copy-paste)
4. Doctor accesses results within 48 hours
5. Link expires automatically

---

### 5. Donation Case Sharing

**Route**: `/donation/{caseSlug}`

**QR Code Contains:**
- Case ID
- Case title & summary
- Current donation amount
- Goal amount
- Call-to-action

**Access**: Public (no authentication)

**Expiration**: Until case is closed

**Flow:**
1. Charity creates donation case
2. QR code generated
3. QR printed on flyers, posters, social media
4. Donors scan → redirected to donation page
5. Donors make contribution

---

## Mobile Optimization

### Responsive Design

All share pages must be mobile-optimized:
- Fast loading (< 2 seconds)
- Touch-friendly buttons (min 44x44pt)
- Large fonts (min 16px body text)
- No horizontal scrolling
- Viewport meta tag configured

### Offline Support

For critical shares (health passport), implement offline caching:
```javascript
// Service Worker caches QR data
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/health-passport/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1)
- ✅ Set up `share.balsm.health` subdomain
- ✅ Short code generation service
- ✅ Basic resolver (shortCode → target lookup)
- ✅ Analytics tracking
- ✅ Time-limited links
- ✅ Health passport QR
- ✅ Prescription verification QR

### Phase 2: Core Features (Month 2)
- Appointment check-in QR
- Lab result sharing
- One-time use links
- Consent-based sharing
- Deep linking (universal links)
- Smart app banners

### Phase 3: Advanced Features (Month 3)
- QR code customization (logo, colors)
- Access control (IP, geographic, device)
- Advanced analytics dashboard
- Bulk QR generation (for clinics)
- QR printing templates

### Phase 4: Optimization (Month 4)
- Offline support for critical QR codes
- A/B testing for conversion optimization
- Custom short domains for enterprises
- Integration with CRM for marketing QR codes
- Performance optimization (CDN, caching)

---

## API Endpoints

### Short Link Management

```
POST /api/share/create
  → Create new short link

GET /api/share/{shortCode}
  → Get short link details

PATCH /api/share/{shortCode}
  → Update short link (extend expiration, etc.)

DELETE /api/share/{shortCode}
  → Deactivate short link

GET /api/share/list
  → List all short links (filtered by user)
```

### QR Code Generation

```
POST /api/qr/generate
  → Generate QR code image

GET /api/qr/{shortCode}
  → Get QR code for existing short link
```

### Analytics

```
GET /api/analytics/{shortCode}
  → Get analytics for short link

POST /api/analytics/{shortCode}/event
  → Track custom event (e.g., conversion)
```

### Consent Management

```
POST /api/consent/{shortCode}/request
  → Request patient consent for sharing

GET /api/consent/{shortCode}/status
  → Check consent status

POST /api/consent/{shortCode}/approve
  → Patient approves sharing

POST /api/consent/{shortCode}/deny
  → Patient denies sharing
```

---

## Security Best Practices

### 1. HTTPS Only
All `share.balsm.health` traffic must be HTTPS with HSTS enabled.

### 2. Rate Limiting
Prevent abuse:
```
- 10 requests per minute per IP
- 100 requests per hour per IP
- 1000 requests per day per user
```

### 3. CAPTCHA
For sensitive shares (health passport, prescriptions), require CAPTCHA on first access from new device.

### 4. Audit Trail
Log all accesses:
```json
{
  "timestamp": "2026-03-21T14:30:00Z",
  "shortCode": "abc123",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "country": "EG",
  "device": "mobile",
  "authenticated": false,
  "userId": null,
  "action": "view"
}
```

### 5. Content Security Policy (CSP)
Prevent XSS:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.balsm.health;
```

---

## Compliance Considerations

### HIPAA Compliance
- ✅ PHI encrypted in transit (HTTPS)
- ✅ PHI encrypted at rest (database)
- ✅ Access logged (audit trail)
- ✅ Time-limited access (automatic expiration)
- ✅ Patient consent required for sharing
- ✅ Business Associate Agreement (BAA) for third-party QR scanning

### GDPR Compliance
- ✅ Right to be forgotten (deactivate all shares)
- ✅ Data portability (export share history)
- ✅ Consent management (clear opt-in/opt-out)
- ✅ Data minimization (only necessary info in QR)

---

## Testing Strategy

### QR Code Testing
- ✅ Scan with multiple devices (iOS, Android)
- ✅ Test with different QR readers
- ✅ Verify readability at different sizes
- ✅ Test with poor lighting conditions
- ✅ Validate error correction levels

### Link Testing
- ✅ Test expiration logic (time-based, count-based)
- ✅ Test consent flow (approval, denial, timeout)
- ✅ Test deep linking (app vs. web)
- ✅ Test analytics tracking
- ✅ Load testing (concurrent accesses)

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint definitions
- [download-routing-strategy.md](./download-routing-strategy.md) — App download routing
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping
- [website-routing-strategy.md](./website-routing-strategy.md) — Marketing website structure

---

*Last updated: 2026-03-21*
