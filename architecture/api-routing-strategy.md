# API Routing Strategy

**Balsm Healthcare Platform - API Subdomain Routing & Versioning**

---

## Overview

This document defines the routing strategy for the Balsm .NET API, organized by bounded contexts (subdomains) with versioning, authentication, and URL structure guidelines.

---

## Base URL Structure

### Production Environments

```
Cloud API:      https://api.balsm.health/v1
Local Server:   https://local.balsm.health/v1  (or custom domain)
Staging:        https://api-staging.balsm.health/v1
Development:    https://api-dev.balsm.health/v1
```

### URL Pattern

```
{base-url}/{version}/{bounded-context}/{resource}/{id?}/{action?}
```

**Examples:**
```
https://api.balsm.health/v1/clinical-records/patients/12345/entries
https://api.balsm.health/v1/prescriptions/12345/validate
https://api.balsm.health/v1/appointments/slots/available
```

---

## API Versioning Strategy

### Semantic API Versioning

- **v1, v2, v3**: Major versions (breaking changes)
- Breaking changes require new major version
- Maintain n-1 version for 12 months minimum
- Deprecation warnings 6 months before sunset

### Version Header (Alternative)

```http
GET /clinical-records/patients/12345
Accept: application/vnd.balsm.v1+json
```

**Recommendation**: Start with URL-based versioning (simpler for clients), migrate to header-based for v2+.

---

## Routing by Bounded Context

### Core Domains

#### 1. Clinical Records (`/clinical-records`)

**Base Path**: `/v1/clinical-records`

##### Patient Records
```
GET    /patients                          # List patients (filtered by permissions)
GET    /patients/{patientId}             # Get patient record
POST   /patients                          # Create patient record
PATCH  /patients/{patientId}             # Update patient demographics
DELETE /patients/{patientId}             # Soft delete (requires special permission)

# Timeline & Entries
GET    /patients/{patientId}/timeline    # Get full timeline
GET    /patients/{patientId}/entries     # List entries
POST   /patients/{patientId}/entries     # Create entry (AI scribe)
GET    /entries/{entryId}                # Get specific entry
PATCH  /entries/{entryId}                # Amend entry (creates audit trail)
POST   /entries/{entryId}/attachments    # Upload attachment

# Care Team
GET    /patients/{patientId}/care-team   # Get care team
POST   /patients/{patientId}/care-team   # Add care team member
DELETE /patients/{patientId}/care-team/{memberId}
```

##### Referrals
```
GET    /referrals                         # List all referrals (filtered)
POST   /patients/{patientId}/referrals   # Create referral
GET    /referrals/{referralId}           # Get referral
PATCH  /referrals/{referralId}           # Update referral status
```

##### Consent Management
```
GET    /patients/{patientId}/consents    # List consents
POST   /patients/{patientId}/consents    # Grant consent
POST   /consents/{consentId}/revoke      # Revoke consent
GET    /consents/{consentId}/history     # Audit trail
```

##### Self-Reports & Follow-Ups
```
GET    /patients/{patientId}/self-reports      # List self-reports
POST   /patients/{patientId}/self-reports      # Submit self-report (patient portal)
GET    /patients/{patientId}/discharge-followups
POST   /patients/{patientId}/discharge-followups
```

---

#### 2. Prescriptions (`/prescriptions`)

**Base Path**: `/v1/prescriptions`

##### Prescription Management
```
GET    /prescriptions                           # List all (filtered)
GET    /patients/{patientId}/prescriptions      # Patient prescriptions
POST   /patients/{patientId}/prescriptions      # Create prescription
GET    /prescriptions/{prescriptionId}          # Get prescription
PATCH  /prescriptions/{prescriptionId}          # Update prescription
POST   /prescriptions/{prescriptionId}/cancel   # Cancel prescription

# Validation & Safety Checks
POST   /prescriptions/{prescriptionId}/validate # Real-time validation
POST   /prescriptions/interactions/check        # Check drug interactions
POST   /prescriptions/allergies/check           # Check patient allergies
```

##### Recurring Prescriptions
```
GET    /prescriptions/recurring                      # List recurring
POST   /prescriptions/{prescriptionId}/make-recurring
PATCH  /prescriptions/recurring/{id}                 # Update schedule
POST   /prescriptions/recurring/{id}/pause           # Pause recurring
POST   /prescriptions/recurring/{id}/resume          # Resume recurring
```

##### Medication Database
```
GET    /medications                    # Search medications
GET    /medications/{code}             # Get medication details
GET    /medications/{code}/interactions # Get known interactions
```

---

#### 3. Charitable Donations (`/charitable-donations`)

**Base Path**: `/v1/charitable-donations`

##### Charities
```
GET    /charities                      # List registered charities
GET    /charities/{charityId}          # Get charity details
POST   /charities                      # Register charity (admin)
PATCH  /charities/{charityId}          # Update charity
```

##### Donation Cases
```
GET    /cases                          # List all cases (public/filtered)
GET    /cases/{caseId}                 # Get case details
POST   /cases                          # Create case (charity)
PATCH  /cases/{caseId}                 # Update case
POST   /cases/{caseId}/updates         # Post case update
GET    /cases/{caseId}/updates         # Get case updates
```

##### Donations
```
GET    /donations                      # List donations (filtered)
POST   /cases/{caseId}/donations       # Make donation
GET    /donations/{donationId}         # Get donation receipt
GET    /donations/{donationId}/certificate # Tax certificate
```

---

#### 4. Marketplace (`/marketplace`)

**Base Path**: `/v1/marketplace`

##### Add-On Listings
```
GET    /addons                         # List available add-ons
GET    /addons/{addonId}               # Get add-on details
GET    /addons/{addonId}/reviews       # Get reviews
POST   /addons/{addonId}/reviews       # Submit review
POST   /addons/{addonId}/install       # Install add-on
```

##### Developer Portal
```
POST   /developers/register            # Register as developer
GET    /developers/me/addons           # My add-ons
POST   /developers/me/addons           # Submit add-on
PATCH  /developers/me/addons/{addonId} # Update add-on
GET    /developers/me/addons/{addonId}/analytics # Usage analytics
```

##### Admin Review
```
GET    /admin/addons/pending           # Pending approval
POST   /admin/addons/{addonId}/approve # Approve add-on
POST   /admin/addons/{addonId}/reject  # Reject add-on
```

---

### Supporting Subdomains

#### 5. Appointments (`/appointments`)

**Base Path**: `/v1/appointments`

##### Appointment Management
```
GET    /appointments                   # List appointments (filtered)
GET    /appointments/{appointmentId}   # Get appointment
POST   /appointments                   # Book appointment
PATCH  /appointments/{appointmentId}   # Update appointment
POST   /appointments/{appointmentId}/cancel # Cancel appointment
POST   /appointments/{appointmentId}/checkin # Patient check-in
```

##### Scheduling
```
GET    /schedules                      # List schedules
GET    /schedules/{scheduleId}/slots   # Get available slots
POST   /schedules/{scheduleId}/slots/available # Check slot availability
```

##### Waiting List
```
GET    /waitinglist                    # Get waiting list
POST   /waitinglist                    # Add to waiting list
DELETE /waitinglist/{entryId}          # Remove from waiting list
```

##### House Visits
```
GET    /house-visits                   # List house visits
POST   /appointments/{appointmentId}/convert-to-house-visit
```

##### Questionnaires & Cost Estimates
```
GET    /appointments/{appointmentId}/questionnaire # Get pre-visit questionnaire
POST   /appointments/{appointmentId}/questionnaire # Submit questionnaire
GET    /appointments/{appointmentId}/cost-estimate # Get cost estimate
```

---

#### 6. Labs (`/labs`)

**Base Path**: `/v1/labs`

##### Lab Orders
```
GET    /orders                         # List lab orders
GET    /orders/{orderId}               # Get order
POST   /patients/{patientId}/orders    # Create lab order
PATCH  /orders/{orderId}               # Update order
POST   /orders/{orderId}/cancel        # Cancel order
```

##### Specimens
```
GET    /specimens/{specimenId}         # Get specimen
POST   /specimens/{specimenId}/collect # Mark collected
POST   /specimens/{specimenId}/receive # Mark received
POST   /specimens/{specimenId}/reject  # Reject specimen
```

##### Results
```
GET    /orders/{orderId}/results       # Get results
POST   /orders/{orderId}/results       # Enter results
POST   /results/{resultId}/verify      # Verify results (QC)
POST   /results/{resultId}/publish     # Publish to patient record
```

##### Quality Control
```
GET    /qc/pending                     # Pending QC items
POST   /qc/{itemId}/approve            # Approve QC
POST   /qc/{itemId}/reject             # Reject QC
```

---

#### 7. Radiology (`/radiology`)

**Base Path**: `/v1/radiology`

##### Imaging Orders
```
GET    /orders                         # List imaging orders
POST   /patients/{patientId}/orders    # Create imaging order
GET    /orders/{orderId}               # Get order
PATCH  /orders/{orderId}               # Update order
```

##### Studies
```
GET    /studies/{studyId}              # Get study
POST   /studies/{studyId}/images       # Upload images
GET    /studies/{studyId}/images       # List images
GET    /studies/{studyId}/dicom        # Get DICOM metadata
```

##### Reports
```
GET    /orders/{orderId}/report        # Get radiology report
POST   /orders/{orderId}/report        # Create report
PATCH  /reports/{reportId}             # Update report (draft)
POST   /reports/{reportId}/finalize    # Finalize report
```

##### PACS Integration
```
GET    /pacs/studies/{studyId}         # Query PACS
POST   /pacs/studies/{studyId}/retrieve # Retrieve from PACS
```

---

#### 8. Pharmacy (`/pharmacy`)

**Base Path**: `/v1/pharmacy`

##### Dispensation
```
GET    /dispensations                  # List dispensations
POST   /prescriptions/{prescriptionId}/dispense # Dispense prescription
GET    /dispensations/{dispensationId} # Get dispensation
POST   /dispensations/{dispensationId}/verify # Verify QR code
```

##### Inventory
```
GET    /inventory                      # List pharmacy inventory
GET    /inventory/{itemId}             # Get item
PATCH  /inventory/{itemId}             # Update stock level
POST   /inventory/restock              # Restock items
```

##### Delivery
```
GET    /deliveries                     # List deliveries
POST   /dispensations/{dispensationId}/delivery # Create delivery
PATCH  /deliveries/{deliveryId}        # Update delivery status
GET    /deliveries/{deliveryId}/track  # Track delivery
```

---

#### 9. Billing & Finance (`/billing`)

**Base Path**: `/v1/billing`

##### Bills
```
GET    /bills                          # List bills
GET    /bills/{billId}                 # Get bill
POST   /patients/{patientId}/bills     # Create bill
PATCH  /bills/{billId}                 # Update bill
POST   /bills/{billId}/finalize        # Finalize bill
```

##### Payments
```
GET    /payments                       # List payments
POST   /bills/{billId}/payments        # Record payment
GET    /payments/{paymentId}           # Get payment receipt
POST   /payments/{paymentId}/refund    # Refund payment
```

##### Insurance Claims
```
GET    /claims                         # List claims
POST   /bills/{billId}/claims          # Submit claim
GET    /claims/{claimId}               # Get claim status
PATCH  /claims/{claimId}               # Update claim
```

##### Insurance Policies
```
GET    /patients/{patientId}/policies  # List patient policies
POST   /patients/{patientId}/policies  # Add policy
GET    /policies/{policyId}/verify     # Verify coverage
```

---

#### 10. Entity Management (`/entities`)

**Base Path**: `/v1/entities`

##### Organizations
```
GET    /entities                       # List entities (hospitals, clinics)
GET    /entities/{entityId}            # Get entity
POST   /entities                       # Create entity (admin)
PATCH  /entities/{entityId}            # Update entity
```

##### Branches
```
GET    /entities/{entityId}/branches   # List branches
POST   /entities/{entityId}/branches   # Create branch
GET    /branches/{branchId}            # Get branch
PATCH  /branches/{branchId}            # Update branch
```

##### Departments
```
GET    /branches/{branchId}/departments # List departments
POST   /branches/{branchId}/departments # Create department
GET    /departments/{departmentId}      # Get department
```

##### Rooms & Beds
```
GET    /departments/{departmentId}/rooms # List rooms
POST   /departments/{departmentId}/rooms # Create room
GET    /rooms/{roomId}/beds              # List beds
POST   /rooms/{roomId}/beds              # Create bed
PATCH  /beds/{bedId}/status              # Update bed status (occupied/available)
```

---

### Generic Subdomains

#### 11. Identity & Access (`/identity`)

**Base Path**: `/v1/identity`

##### Authentication
```
POST   /auth/login                     # Login
POST   /auth/logout                    # Logout
POST   /auth/refresh                   # Refresh token
POST   /auth/forgot-password           # Forgot password
POST   /auth/reset-password            # Reset password
POST   /auth/verify-otp                # Verify OTP
```

##### Users & Accounts
```
GET    /users/me                       # Current user
PATCH  /users/me                       # Update profile
GET    /users/{userId}                 # Get user (admin)
POST   /users                          # Create user (admin)
PATCH  /users/{userId}/activate        # Activate user
PATCH  /users/{userId}/deactivate      # Deactivate user
```

##### Permissions & Teams
```
GET    /users/me/permissions           # My permissions
GET    /permissions                    # List all permissions
GET    /permission-groups              # List permission groups
POST   /permission-groups              # Create permission group
GET    /teams                          # List teams
POST   /teams                          # Create team
POST   /teams/{teamId}/members         # Add team member
```

##### Caregivers & Emergency Profiles
```
GET    /users/me/caregivers            # My caregivers
POST   /users/me/caregivers            # Add caregiver
GET    /users/me/emergency-profile     # Get emergency profile
PATCH  /users/me/emergency-profile     # Update emergency profile
GET    /users/me/health-passport       # Get health passport (QR)
```

---

#### 12. Inventory (`/inventory`)

**Base Path**: `/v1/inventory`

##### Items
```
GET    /items                          # List inventory items
GET    /items/{itemId}                 # Get item
POST   /items                          # Create item
PATCH  /items/{itemId}                 # Update item
GET    /items/{itemId}/stock           # Get stock levels
```

##### Purchase Orders
```
GET    /purchase-orders                # List POs
POST   /purchase-orders                # Create PO
GET    /purchase-orders/{poId}         # Get PO
PATCH  /purchase-orders/{poId}         # Update PO
POST   /purchase-orders/{poId}/receive # Receive items
```

##### Vendors
```
GET    /vendors                        # List vendors
POST   /vendors                        # Create vendor
GET    /vendors/{vendorId}             # Get vendor
```

---

#### 13. Messaging & Notifications (`/messaging`)

**Base Path**: `/v1/messaging`

##### Conversations
```
GET    /conversations                  # List conversations
GET    /conversations/{conversationId} # Get conversation
POST   /conversations                  # Start conversation
POST   /conversations/{conversationId}/messages # Send message
PATCH  /conversations/{conversationId}/read # Mark as read
```

##### Notifications
```
GET    /notifications                  # List notifications
GET    /notifications/unread           # Unread notifications
PATCH  /notifications/{notificationId}/read # Mark as read
PATCH  /notifications/read-all         # Mark all as read
DELETE /notifications/{notificationId} # Dismiss notification
```

##### Announcements
```
GET    /announcements                  # List announcements
POST   /announcements                  # Create announcement (admin)
GET    /announcements/{announcementId} # Get announcement
```

---

## Cross-Cutting Concerns

### Health Check & Monitoring

```
GET    /health                         # Health check
GET    /health/ready                   # Readiness probe
GET    /health/live                    # Liveness probe
GET    /metrics                        # Prometheus metrics (requires auth)
```

### Search & Reporting

```
GET    /search?q={query}&context={bounded-context} # Global search
POST   /reports/generate               # Generate report
GET    /reports/{reportId}             # Get report
GET    /reports/{reportId}/download    # Download report (PDF/CSV)
```

---

## Authentication & Authorization

### Authentication Methods

1. **JWT Bearer Token** (Primary)
   ```http
   Authorization: Bearer {access_token}
   ```

2. **API Key** (For add-ons, integrations)
   ```http
   X-API-Key: {api_key}
   ```

3. **OAuth 2.0** (For third-party integrations)
   ```
   /v1/oauth/authorize
   /v1/oauth/token
   ```

### Permission-Based Access Control (PBAC)

Every endpoint validates:
- User authentication
- User has required permission(s)
- User has access to requested resource (e.g., patient, entity)

**Permission Format**: `{bounded-context}.{resource}.{action}`

Examples:
- `clinical-records.patient.read`
- `prescriptions.prescription.create`
- `billing.bill.finalize`

---

## HTTP Methods & Status Codes

### HTTP Methods

| Method | Use Case | Idempotent |
|--------|----------|------------|
| GET | Retrieve resource(s) | Yes |
| POST | Create new resource or non-idempotent action | No |
| PUT | Full resource replacement | Yes |
| PATCH | Partial resource update | No (use with care) |
| DELETE | Remove resource (soft delete) | Yes |

### Standard Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 OK | Success | GET, PATCH, DELETE |
| 201 Created | Resource created | POST |
| 204 No Content | Success, no body | DELETE, PATCH (no return) |
| 400 Bad Request | Validation error | Invalid input |
| 401 Unauthorized | Missing/invalid auth | No token, expired token |
| 403 Forbidden | No permission | User lacks permission |
| 404 Not Found | Resource not exists | Invalid ID |
| 409 Conflict | Conflict | Duplicate, version mismatch |
| 422 Unprocessable Entity | Business rule violation | Drug interaction, invalid prescription |
| 429 Too Many Requests | Rate limit | Too many requests |
| 500 Internal Server Error | Server error | Unexpected error |
| 503 Service Unavailable | Service down | Maintenance, overload |

---

## Request/Response Patterns

### Standard Response Format

```json
{
  "data": { /* resource or array */ },
  "meta": {
    "timestamp": "2026-03-21T10:30:00Z",
    "requestId": "uuid"
  },
  "links": {
    "self": "/v1/patients/12345",
    "related": "/v1/patients/12345/entries"
  }
}
```

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-21T10:30:00Z",
    "requestId": "uuid"
  }
}
```

### Pagination

```http
GET /v1/patients?page=2&pageSize=20&sortBy=lastName&sortOrder=asc
```

Response:
```json
{
  "data": [ /* items */ ],
  "meta": {
    "page": 2,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "links": {
    "first": "/v1/patients?page=1&pageSize=20",
    "prev": "/v1/patients?page=1&pageSize=20",
    "self": "/v1/patients?page=2&pageSize=20",
    "next": "/v1/patients?page=3&pageSize=20",
    "last": "/v1/patients?page=8&pageSize=20"
  }
}
```

### Filtering

```http
GET /v1/appointments?status=scheduled&from=2026-03-01&to=2026-03-31&departmentId=123
```

### Field Selection (Sparse Fieldsets)

```http
GET /v1/patients/12345?fields=firstName,lastName,dateOfBirth
```

---

## Rate Limiting

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1709294400
```

### Default Limits

| User Type | Requests/Minute | Requests/Hour |
|-----------|-----------------|---------------|
| Patient Portal | 60 | 1000 |
| Caregiver | 300 | 5000 |
| Add-On (Free) | 100 | 2000 |
| Add-On (Paid) | 500 | 10000 |
| System Admin | 1000 | 20000 |

---

## Webhook Support

### Subscription Endpoints

```
POST   /v1/webhooks/subscriptions      # Subscribe to event
GET    /v1/webhooks/subscriptions      # List subscriptions
DELETE /v1/webhooks/subscriptions/{id} # Unsubscribe
```

### Available Events

```
clinical-records.entry.created
prescriptions.prescription.created
prescriptions.interaction.detected
appointments.appointment.booked
appointments.appointment.canceled
billing.payment.received
charitable-donations.donation.received
```

---

## OpenAPI/Swagger Documentation

### Swagger UI

```
https://api.balsm.health/swagger
https://api.balsm.health/swagger/v1/swagger.json
```

### ReDoc

```
https://api.balsm.health/docs
```

---

## Implementation Roadmap

### Phase 1 (MVP) - Months 1-3
- ✅ Identity & Access
- ✅ Entity Management
- ✅ Clinical Records (core features)
- ✅ Appointments
- ✅ Prescriptions (basic)
- ✅ Messaging & Notifications

### Phase 2 (Core Expansion) - Months 4-6
- Labs
- Radiology
- Pharmacy
- Billing & Finance (basic)
- Prescriptions (advanced: drug interactions, CDSS)

### Phase 3 (Platform Features) - Months 7-9
- Marketplace & Add-Ons
- Charitable Donations
- Inventory
- Advanced Reporting

### Phase 4 (Optimization) - Months 10-12
- Webhook support
- GraphQL alternative API
- Real-time subscriptions (SignalR)
- Performance optimization & caching
- API v2 planning

---

## Related Documentation

- [subdomain-classification.md](./subdomain-classification.md) — Subdomain strategic analysis
- [communication-architecture.md](./communication-architecture.md) — Three-tier architecture
- [CODING_STANDARDS.md](../agents/rules/CODING_STANDARDS.md) — API coding standards
- [website-routing-strategy.md](./website-routing-strategy.md) — Public website routing

---

*Last updated: 2026-03-21*
