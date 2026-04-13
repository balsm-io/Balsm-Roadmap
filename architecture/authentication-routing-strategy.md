# Authentication & SSO Routing Strategy

**Balsm Healthcare Platform - Identity, Authentication & Single Sign-On**

---

## Overview

This document defines the routing strategy for authentication, identity management, and Single Sign-On (SSO) across the Balsm Healthcare Platform.

---

## Authentication Domains

### Primary Authentication (Integrated)

```
portal.balsm.health/auth/*              # Patient/caregiver authentication
app.balsm.health/auth/*                 # Healthcare provider authentication
admin.balsm.health/auth/*               # Admin authentication
```

### Optional SSO Domain (Enterprise)

```
sso.balsm.health                        # Single Sign-On hub
auth.balsm.health                       # Authentication services (redirect to SSO)
accounts.balsm.health                   # Account management hub
```

**Recommendation**: Start with integrated authentication, add SSO subdomain only if you become an OAuth provider or support enterprise SAML.

---

## Core Authentication Routes

### Patient/Caregiver Portal (`portal.balsm.health/auth`)

```
# Login & Registration
/auth/login                             # Login page
/auth/register                          # Registration page
/auth/register/patient                  # Patient registration
/auth/register/caregiver                # Caregiver registration
/auth/logout                            # Logout

# Password Management
/auth/forgot-password                   # Forgot password
/auth/reset-password                    # Reset password (with token)
/auth/change-password                   # Change password (authenticated)

# Multi-Factor Authentication
/auth/mfa                               # MFA landing page
/auth/mfa/setup                         # Setup MFA
/auth/mfa/verify                        # Verify MFA code
/auth/mfa/backup-codes                  # View/regenerate backup codes
/auth/mfa/disable                       # Disable MFA

# Email Verification
/auth/verify-email                      # Email verification page
/auth/resend-verification               # Resend verification email

# Social Login
/auth/social/google                     # Google OAuth
/auth/social/apple                      # Apple Sign-In
/auth/social/facebook                   # Facebook Login
/auth/callback                          # OAuth callback handler

# Account Linking
/auth/link-account                      # Link social account to existing
/auth/unlink-account/{provider}         # Unlink social account

# Session Management
/auth/sessions                          # View active sessions
/auth/sessions/{sessionId}/revoke       # Revoke session
/auth/sessions/revoke-all               # Revoke all sessions

# Device Management
/auth/devices                           # Trusted devices
/auth/devices/{deviceId}/remove         # Remove device
/auth/devices/verify                    # Verify new device
```

---

### Healthcare Provider App (`app.balsm.health/auth`)

```
# Professional Login
/auth/login                             # Provider login
/auth/login/sso                         # SSO login (enterprise)
/auth/logout                            # Logout

# Organization-Specific Login
/auth/login/{organizationSlug}          # Organization-branded login

# Professional Registration
/auth/register                          # New provider signup
/auth/register/invite/{token}           # Accept organization invite

# Professional Verification
/auth/verify-license                    # Medical license verification
/auth/verify-credentials                # Credential verification

# Password & Security
/auth/forgot-password                   # Forgot password
/auth/reset-password                    # Reset password
/auth/mfa                               # MFA setup/verify

# Session Management
/auth/sessions                          # Active sessions
/auth/switch-organization               # Switch organization context
/auth/switch-role                       # Switch role (if multiple)
```

---

### Admin Dashboard (`admin.balsm.health/auth`)

```
# Admin Login
/auth/login                             # Admin login
/auth/mfa                               # MFA verification (required)
/auth/logout                            # Logout

# Admin-Specific Security
/auth/verify-admin                      # Extra verification step
/auth/sudo-mode                         # Elevated privileges mode
/auth/sudo-mode/exit                    # Exit sudo mode

# Audit & Sessions
/auth/sessions                          # View all admin sessions
/auth/activity-log                      # Admin activity log
```

---

## SSO & Enterprise Authentication (`sso.balsm.health`)

### OAuth 2.0 / OpenID Connect

```
# OAuth Authorization
/oauth/authorize                        # Authorization endpoint
/oauth/token                            # Token endpoint
/oauth/userinfo                         # UserInfo endpoint
/oauth/revoke                           # Token revocation
/oauth/introspect                       # Token introspection

# OpenID Connect Discovery
/.well-known/openid-configuration       # OIDC discovery document
/.well-known/jwks.json                  # JSON Web Key Set

# OAuth Consent
/oauth/consent                          # User consent page
/oauth/consent/approve                  # Approve consent
/oauth/consent/deny                     # Deny consent
```

### SAML 2.0 (Enterprise SSO)

```
# SAML Endpoints
/saml/login                             # SAML login initiation
/saml/acs                               # Assertion Consumer Service
/saml/slo                               # Single Logout
/saml/metadata                          # SAML metadata XML

# SAML Configuration
/saml/idp/{idpId}                       # Identity Provider config
/saml/sp/metadata                       # Service Provider metadata
```

### Enterprise Directory Integration

```
# LDAP/Active Directory
/directory/sync                         # Directory sync status
/directory/users/import                 # Import users from directory
/directory/groups/import                # Import groups from directory

# SCIM 2.0 (System for Cross-domain Identity Management)
/scim/v2/Users                          # SCIM Users endpoint
/scim/v2/Groups                         # SCIM Groups endpoint
/scim/v2/ServiceProviderConfig          # SCIM Service Provider config
```

---

## API Authentication Endpoints (`api.balsm.health/v1/identity`)

### Authentication API

```
POST   /v1/identity/auth/login          # Login
POST   /v1/identity/auth/register       # Register
POST   /v1/identity/auth/logout         # Logout
POST   /v1/identity/auth/refresh        # Refresh token
POST   /v1/identity/auth/revoke         # Revoke token

# Password Management
POST   /v1/identity/auth/forgot-password    # Request password reset
POST   /v1/identity/auth/reset-password     # Reset password with token
POST   /v1/identity/auth/change-password    # Change password (authenticated)
POST   /v1/identity/auth/validate-token     # Validate reset token

# MFA
POST   /v1/identity/auth/mfa/setup          # Setup MFA
POST   /v1/identity/auth/mfa/verify         # Verify MFA code
POST   /v1/identity/auth/mfa/disable        # Disable MFA
GET    /v1/identity/auth/mfa/backup-codes   # Get backup codes
POST   /v1/identity/auth/mfa/regenerate-codes # Regenerate backup codes

# Email Verification
POST   /v1/identity/auth/verify-email       # Verify email
POST   /v1/identity/auth/resend-verification # Resend verification

# Social Login
POST   /v1/identity/auth/social/google      # Google OAuth
POST   /v1/identity/auth/social/apple       # Apple Sign-In
POST   /v1/identity/auth/social/facebook    # Facebook Login
POST   /v1/identity/auth/social/link        # Link social account
DELETE /v1/identity/auth/social/unlink/{provider} # Unlink social account
```

### User Management API

```
GET    /v1/identity/users/me               # Current user
PATCH  /v1/identity/users/me               # Update profile
DELETE /v1/identity/users/me               # Delete account

# User CRUD (Admin)
GET    /v1/identity/users                  # List users
GET    /v1/identity/users/{userId}         # Get user
POST   /v1/identity/users                  # Create user
PATCH  /v1/identity/users/{userId}         # Update user
DELETE /v1/identity/users/{userId}         # Delete user

# User Status Management
POST   /v1/identity/users/{userId}/activate    # Activate user
POST   /v1/identity/users/{userId}/deactivate  # Deactivate user
POST   /v1/identity/users/{userId}/suspend     # Suspend user
POST   /v1/identity/users/{userId}/lock        # Lock account
POST   /v1/identity/users/{userId}/unlock      # Unlock account
```

### Session Management API

```
GET    /v1/identity/sessions               # List sessions
GET    /v1/identity/sessions/{sessionId}   # Get session
DELETE /v1/identity/sessions/{sessionId}   # Revoke session
DELETE /v1/identity/sessions               # Revoke all sessions

# Device Management
GET    /v1/identity/devices                # List trusted devices
POST   /v1/identity/devices                # Register device
DELETE /v1/identity/devices/{deviceId}     # Remove device
GET    /v1/identity/devices/{deviceId}/verify # Verify device
```

### Permissions & Roles API

```
GET    /v1/identity/users/me/permissions   # My permissions
GET    /v1/identity/users/{userId}/permissions # User permissions
POST   /v1/identity/users/{userId}/permissions # Grant permission
DELETE /v1/identity/users/{userId}/permissions/{permissionId} # Revoke permission

# Roles
GET    /v1/identity/roles                  # List roles
POST   /v1/identity/roles                  # Create role
GET    /v1/identity/roles/{roleId}         # Get role
PATCH  /v1/identity/roles/{roleId}         # Update role
DELETE /v1/identity/roles/{roleId}         # Delete role

# Permission Groups
GET    /v1/identity/permission-groups      # List permission groups
POST   /v1/identity/permission-groups      # Create group
GET    /v1/identity/permission-groups/{groupId} # Get group
PATCH  /v1/identity/permission-groups/{groupId} # Update group
DELETE /v1/identity/permission-groups/{groupId} # Delete group
```

### Teams & Organizations API

```
GET    /v1/identity/teams                  # List teams
POST   /v1/identity/teams                  # Create team
GET    /v1/identity/teams/{teamId}         # Get team
PATCH  /v1/identity/teams/{teamId}         # Update team
DELETE /v1/identity/teams/{teamId}         # Delete team

# Team Members
GET    /v1/identity/teams/{teamId}/members # List members
POST   /v1/identity/teams/{teamId}/members # Add member
DELETE /v1/identity/teams/{teamId}/members/{userId} # Remove member
```

---

## Authentication Flows

### Standard Login Flow

**Web Application:**
```
1. User visits: portal.balsm.health/auth/login
2. User enters credentials
3. POST /v1/identity/auth/login
4. If MFA enabled → Redirect to /auth/mfa/verify
5. Receive JWT access token + refresh token
6. Store tokens (httpOnly cookie or localStorage)
7. Redirect to portal.balsm.health/dashboard
```

**Mobile Application:**
```
1. User opens app → Login screen
2. User enters credentials
3. POST /v1/identity/auth/login
4. If MFA enabled → Show MFA input screen
5. Receive JWT access token + refresh token
6. Store tokens in secure storage (Keychain/Keystore)
7. Navigate to home screen
```

---

### Social Login Flow (OAuth 2.0)

**Google Sign-In:**
```
1. User clicks "Sign in with Google"
2. Redirect to: portal.balsm.health/auth/social/google
3. Backend redirects to Google OAuth:
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id={client_id}&
     redirect_uri=https://portal.balsm.health/auth/callback&
     response_type=code&
     scope=openid email profile
4. User approves on Google
5. Google redirects to: /auth/callback?code={code}
6. Backend exchanges code for Google access token
7. Backend fetches user info from Google
8. Backend creates/links Balsm account
9. Backend issues Balsm JWT tokens
10. Redirect to portal.balsm.health/dashboard
```

---

### SAML SSO Flow (Enterprise)

**SP-Initiated (Service Provider):**
```
1. User visits: app.balsm.health/auth/login/acme-corp
2. Backend identifies SAML IdP for "acme-corp"
3. Backend generates SAML AuthnRequest
4. Redirect to IdP: https://idp.acme-corp.com/sso?SAMLRequest={request}
5. User authenticates at IdP
6. IdP redirects to: app.balsm.health/auth/saml/acs
7. Backend validates SAML assertion
8. Backend creates Balsm session
9. Redirect to app.balsm.health/dashboard
```

**IdP-Initiated:**
```
1. User clicks "Balsm" in IdP portal
2. IdP redirects to: app.balsm.health/auth/saml/acs?SAMLResponse={response}
3. Backend validates SAML assertion
4. Backend creates Balsm session
5. Redirect to app.balsm.health/dashboard
```

---

### MFA Flow

**Setup MFA:**
```
1. User navigates to: portal.balsm.health/auth/mfa/setup
2. Backend generates TOTP secret
3. Frontend displays QR code (otpauth://totp/...)
4. User scans with authenticator app (Google Authenticator, Authy)
5. User enters verification code
6. POST /v1/identity/auth/mfa/verify
7. Backend validates code
8. MFA enabled
9. Backend generates backup codes
10. User saves backup codes
```

**Login with MFA:**
```
1. User logs in with username/password
2. Backend returns: { "mfaRequired": true, "mfaToken": "temp-token" }
3. Frontend redirects to: /auth/mfa/verify
4. User enters MFA code
5. POST /v1/identity/auth/mfa/verify { "mfaToken": "temp-token", "code": "123456" }
6. Backend validates MFA code
7. Backend issues full JWT tokens
8. Redirect to dashboard
```

---

### Password Reset Flow

```
1. User clicks "Forgot Password"
2. Navigate to: portal.balsm.health/auth/forgot-password
3. User enters email
4. POST /v1/identity/auth/forgot-password { "email": "user@example.com" }
5. Backend generates reset token (expires in 1 hour)
6. Backend sends email with link: portal.balsm.health/auth/reset-password?token={token}
7. User clicks link
8. User enters new password
9. POST /v1/identity/auth/reset-password { "token": "{token}", "password": "newpass" }
10. Backend validates token
11. Backend hashes and saves new password
12. Backend invalidates token
13. Redirect to /auth/login with success message
```

---

## Token Management

### JWT Token Structure

**Access Token (short-lived, 15 minutes):**
```json
{
  "sub": "user-12345",
  "email": "john.doe@example.com",
  "role": "caregiver",
  "permissions": ["clinical-records.patient.read", "prescriptions.create"],
  "entityId": "hospital-abc",
  "iat": 1709294400,
  "exp": 1709295300,
  "iss": "https://api.balsm.health",
  "aud": "balsm-app"
}
```

**Refresh Token (long-lived, 30 days):**
```json
{
  "sub": "user-12345",
  "tokenId": "refresh-abc123",
  "iat": 1709294400,
  "exp": 1711886400,
  "iss": "https://api.balsm.health",
  "aud": "balsm-app"
}
```

### Token Refresh Flow

```
1. Access token expires (15 minutes)
2. Frontend receives 401 Unauthorized
3. Frontend sends refresh token:
   POST /v1/identity/auth/refresh
   { "refreshToken": "refresh-abc123" }
4. Backend validates refresh token
5. Backend issues new access token + new refresh token
6. Frontend stores new tokens
7. Frontend retries original request with new access token
```

### Token Revocation

**Revoke Single Session:**
```
DELETE /v1/identity/sessions/{sessionId}
→ Invalidates refresh token for that session
→ User logged out from that device
```

**Revoke All Sessions (Logout Everywhere):**
```
DELETE /v1/identity/sessions
→ Invalidates all refresh tokens
→ User logged out from all devices
```

---

## Security Features

### Rate Limiting

**Login Attempts:**
```
- 5 failed attempts per email per 15 minutes
- Account locked after 10 failed attempts (requires password reset)
- Progressive delays: 1s, 2s, 4s, 8s, 16s after each failure
```

**API Endpoints:**
```
- /v1/identity/auth/login: 5 req/min per IP
- /v1/identity/auth/register: 3 req/hour per IP
- /v1/identity/auth/forgot-password: 3 req/hour per IP
- /v1/identity/auth/refresh: 10 req/min per user
```

### Account Lockout

**Triggers:**
- 10 failed login attempts
- Suspicious activity detection
- Admin manual lock

**Unlock Methods:**
- Password reset flow
- Admin manual unlock
- Automatic unlock after 24 hours (configurable)

### Password Requirements

```
Minimum Requirements:
- Length: 12 characters minimum
- Complexity: At least 3 of 4 (uppercase, lowercase, numbers, symbols)
- Not breached: Check against Have I Been Pwned API
- Not common: Check against common password list
- Not same as previous 5 passwords

Recommendations (shown to user):
- Use passphrase (e.g., "coffee-mountain-eagle-2024")
- Use password manager
- Enable MFA
```

### Session Security

**Session Expiration:**
- Idle timeout: 30 minutes (web), 7 days (mobile)
- Absolute timeout: 24 hours (web), 30 days (mobile)
- Remember me: 90 days (optional)

**Session Binding:**
- Bind to IP address (optional, can break mobile)
- Bind to User-Agent
- Bind to device fingerprint

**Concurrent Sessions:**
- Allow: 5 concurrent sessions per user (configurable)
- Oldest session revoked when limit exceeded

---

## OAuth 2.0 Provider (For Third-Party Apps)

### Authorization Code Flow

**Endpoint:** `/oauth/authorize`

**Request:**
```
GET /oauth/authorize?
  response_type=code&
  client_id=marketplace-addon-123&
  redirect_uri=https://addon.example.com/callback&
  scope=clinical-records.read prescriptions.read&
  state=random-state-abc123

User approves consent:
- Show consent screen listing requested permissions
- User clicks "Approve" or "Deny"

If approved:
  → Redirect to: https://addon.example.com/callback?code=auth-code-xyz&state=random-state-abc123

If denied:
  → Redirect to: https://addon.example.com/callback?error=access_denied&state=random-state-abc123
```

**Token Exchange:**
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=auth-code-xyz&
client_id=marketplace-addon-123&
client_secret={client_secret}&
redirect_uri=https://addon.example.com/callback

Response:
{
  "access_token": "access-token-abc",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token-xyz",
  "scope": "clinical-records.read prescriptions.read"
}
```

### Client Credentials Flow (Server-to-Server)

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=integration-server-456&
client_secret={client_secret}&
scope=labs.write radiology.write

Response:
{
  "access_token": "access-token-def",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "labs.write radiology.write"
}
```

---

## Account Management Hub (`accounts.balsm.health`)

### Account Settings

```
/                                       # Account overview
/profile                                # Edit profile
/security                               # Security settings
/security/password                      # Change password
/security/mfa                           # MFA settings
/security/sessions                      # Active sessions
/security/devices                       # Trusted devices
/privacy                                # Privacy settings
/privacy/data-sharing                   # Data sharing preferences
/privacy/consent                        # Consent management
/privacy/download-data                  # Download my data (GDPR)
/privacy/delete-account                 # Delete account
/notifications                          # Notification preferences
/caregivers                             # Manage caregivers
/emergency                              # Emergency profile
/health-passport                        # Health passport settings
/connected-apps                         # Third-party app permissions
/connected-apps/{appId}/revoke          # Revoke app access
```

---

## Implementation Recommendations

### Technology Stack

**Recommended: Auth0 (Fastest, Most Secure)**
```yaml
Pros:
  - HIPAA BAA available
  - Built-in MFA (TOTP, SMS, Email, Push)
  - Social login (Google, Apple, Facebook)
  - SAML/LDAP for enterprise
  - Passwordless authentication
  - Anomaly detection
  - Extensive documentation

Cons:
  - Cost scales with users (MAU pricing)
  - Vendor lock-in
  - Limited customization

Pricing:
  - Free: Up to 7,500 MAU
  - Essentials: $35/month + $0.05/MAU
  - Professional: $240/month + $0.13/MAU
  - Enterprise: Custom pricing
```

**Alternative: Keycloak (Self-Hosted, Open Source)**
```yaml
Pros:
  - Free and open source
  - Full control and customization
  - SAML, OAuth 2.0, OpenID Connect
  - LDAP/Active Directory integration
  - Strong community

Cons:
  - Self-hosting complexity
  - Requires infrastructure management
  - Slower to set up

Cost:
  - Software: Free
  - Infrastructure: ~$100-500/month (AWS/Azure)
  - Maintenance: DevOps time
```

**Alternative: Custom with .NET Identity**
```yaml
Pros:
  - Full control
  - No vendor lock-in
  - Cost-effective at scale

Cons:
  - Security responsibility
  - Development time (2-3 months)
  - Ongoing maintenance

Recommended Only If:
  - Strict compliance requirements prevent SaaS
  - Very large scale (1M+ users)
  - Unique authentication requirements
```

### Recommendation Matrix

| Scenario | Recommendation |
|----------|----------------|
| **Startup / MVP** | Auth0 Free tier → Upgrade as you grow |
| **SMB Healthcare** | Auth0 Essentials |
| **Enterprise Healthcare** | Auth0 Enterprise or Keycloak (self-hosted) |
| **Strict Compliance** | Keycloak (self-hosted) with full audit |
| **High Scale** | Custom .NET Identity or Keycloak |

**My Recommendation for Balsm**: Start with **Auth0**, migrate to **Keycloak** when you reach 50K MAU or strict on-premise requirements emerge.

---

## Compliance Considerations

### HIPAA Compliance

✅ **Access Controls:**
- Unique user IDs
- Automatic logoff (30 min idle)
- Encryption in transit (TLS 1.2+)
- Encryption at rest

✅ **Audit Controls:**
- Log all authentication events
- Log all access to PHI
- Immutable audit logs
- Retain logs for 6 years

✅ **Person/Entity Authentication:**
- MFA for access to PHI
- Verify identity of users
- Unique user IDs (no shared accounts)

### GDPR Compliance

✅ **Right to Access:**
- Users can download their data
- /privacy/download-data

✅ **Right to Be Forgotten:**
- Users can delete account
- /privacy/delete-account
- Anonymize (don't delete) if tied to clinical records

✅ **Consent Management:**
- Clear consent for data processing
- Easy to withdraw consent
- /privacy/consent

---

## Testing Strategy

### Unit Tests
- Password validation
- Token generation/validation
- Permission checks
- Rate limiting logic

### Integration Tests
- Login flow (success, failure)
- Social login flow
- MFA flow
- Password reset flow
- Token refresh flow
- Session management

### Security Tests
- Brute force protection
- SQL injection (auth endpoints)
- XSS (auth forms)
- CSRF protection
- Token replay attacks
- Session fixation

### Load Tests
- 1000 concurrent logins
- Token refresh under load
- MFA verification at scale

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint definitions
- [share-routing-strategy.md](./share-routing-strategy.md) — Secure sharing with consent
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping

---

*Last updated: 2026-03-21*
