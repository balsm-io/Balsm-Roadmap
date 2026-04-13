# Download & Distribution Routing Strategy

**Balsm Healthcare Platform - App Downloads & Distribution**

---

## Overview

This document defines the routing strategy for downloading and distributing Balsm applications across all platforms (iOS, Android, Windows, macOS, Linux, Web).

---

## Download Domains

### Production Domains

```
Primary Download:
├─ download.balsm.health                # Main download hub
├─ get.balsm.health                     # Short alias (redirects to download)
└─ dl.balsm.health                      # Ultra-short alias (redirects to download)

App Store Shortcuts:
├─ ios.balsm.health                     # iOS App Store (redirect)
├─ android.balsm.health                 # Google Play Store (redirect)
└─ web.balsm.health                     # Web app (redirect to portal/app)

Release Channels:
├─ beta.balsm.health                    # Beta downloads
├─ alpha.balsm.health                   # Alpha/internal testing
└─ nightly.balsm.health                 # Nightly builds (internal)
```

---

## Download Hub Routes (`download.balsm.health`)

### Main Routes

```
/                                       # Download hub home
/app                                    # Automatic platform detection & download

# Platform-Specific Downloads
/ios                                    # iOS download
/android                                # Android download
/windows                                # Windows download
/macos                                  # macOS download
/linux                                  # Linux download
/web                                    # Web app (redirect to portal.balsm.health)

# App Types
/patient                                # Patient app (auto-detect platform)
/caregiver                              # Caregiver app (auto-detect platform)
/admin                                  # Admin app (desktop only)

# Direct Downloads (Latest Stable)
/latest/ios                             # Latest iOS IPA (TestFlight link)
/latest/android                         # Latest Android APK
/latest/windows                         # Latest Windows installer (.exe)
/latest/macos                           # Latest macOS installer (.dmg)
/latest/linux                           # Latest Linux installer (.AppImage or .deb)

# Versioned Downloads
/v{version}/ios                         # Specific version iOS
/v{version}/android                     # Specific version Android
/v{version}/windows                     # Specific version Windows
/v{version}/macos                       # Specific version macOS
/v{version}/linux                       # Specific version Linux

Examples:
/v1.2.3/android                         # Download Android v1.2.3
/v2.0.0/windows                         # Download Windows v2.0.0

# Release Channels
/stable                                 # Stable releases (default)
/beta                                   # Beta releases
/alpha                                  # Alpha releases (internal)
/nightly                                # Nightly builds (internal)

/stable/ios                             # Latest stable iOS
/beta/android                           # Latest beta Android
/alpha/windows                          # Latest alpha Windows

# Local Server Downloads
/local-server                           # Local server download page
/local-server/windows                   # Local server for Windows
/local-server/linux                     # Local server for Linux
/local-server/macos                     # Local server for macOS
/local-server/docker                    # Local server Docker image

# Release Notes & Changelog
/releases                               # All releases
/releases/{version}                     # Specific release notes
/changelog                              # Full changelog
/whats-new                              # What's new (latest release)

# QR Codes
/qr                                     # QR code generator page
/qr/ios                                 # QR for iOS download
/qr/android                             # QR for Android download
/qr/patient                             # QR for patient app
/qr/caregiver                           # QR for caregiver app

# Deep Links
/link/{action}                          # Universal/App link handler
/link/appointment/{id}                  # Deep link to appointment
/link/prescription/{id}                 # Deep link to prescription
/link/patient/{id}                      # Deep link to patient record
/link/donation/{caseId}                 # Deep link to donation case

# Enterprise Distribution
/enterprise                             # Enterprise deployment
/enterprise/mdm                         # MDM configuration profiles
/enterprise/sideload                    # Sideload packages (authenticated)
/enterprise/api                         # Enterprise API for deployments

# System Requirements
/requirements                           # System requirements overview
/requirements/ios                       # iOS requirements
/requirements/android                   # Android requirements
/requirements/windows                   # Windows requirements
/requirements/macos                     # macOS requirements
/requirements/linux                     # Linux requirements

# Support
/support                                # Download support
/support/installation                   # Installation guides
/support/troubleshooting                # Download troubleshooting
/support/verification                   # App verification & signatures
```

---

## Platform-Specific Download Pages

### iOS (`/ios`)

**Download Options:**
1. **App Store** (preferred)
   - Redirect to: `https://apps.apple.com/app/balsm/id{app-id}`
   - QR code for easy scanning

2. **TestFlight** (beta testing)
   - Redirect to: `https://testflight.apple.com/join/{beta-code}`
   - Requires TestFlight app

3. **Enterprise Distribution** (for organizations)
   - `.ipa` file download with MDM profile
   - Requires authentication

**Page Content:**
- App Store badge
- TestFlight invite link
- QR code
- Screenshots
- Feature highlights
- System requirements (iOS 15+)
- File size and version info

---

### Android (`/android`)

**Download Options:**
1. **Google Play Store** (preferred)
   - Redirect to: `https://play.google.com/store/apps/details?id=health.balsm.app`
   - QR code for easy scanning

2. **Direct APK Download** (for sideloading)
   - Download URL: `/latest/android/balsm-v{version}.apk`
   - SHA-256 checksum provided
   - Signature verification instructions

3. **F-Droid** (open-source alternative, future)
   - For privacy-conscious users

**Page Content:**
- Google Play badge
- Direct APK download button (with warning about sideloading)
- QR code
- Screenshots
- Feature highlights
- System requirements (Android 8.0+)
- File size, version, and checksum

---

### Windows (`/windows`)

**Download Options:**
1. **Microsoft Store** (preferred)
   - Redirect to: `ms-windows-store://pdp/?ProductId={product-id}`
   - Automatic updates

2. **Direct Installer Download**
   - `.exe` installer: `/latest/windows/Balsm-Setup-v{version}.exe`
   - `.msi` installer: `/latest/windows/Balsm-Setup-v{version}.msi`
   - SHA-256 checksum provided

3. **Portable Version**
   - `.zip` download: `/latest/windows/Balsm-Portable-v{version}.zip`
   - No installation required

**Page Content:**
- Microsoft Store badge
- Direct download button (EXE/MSI)
- Portable version link
- System requirements (Windows 10/11, 64-bit)
- Installation guide
- File size, version, and checksum

---

### macOS (`/macos`)

**Download Options:**
1. **Mac App Store** (preferred)
   - Redirect to: `https://apps.apple.com/app/balsm/id{app-id}`
   - Automatic updates

2. **Direct DMG Download**
   - `.dmg` installer: `/latest/macos/Balsm-v{version}.dmg`
   - Notarized and signed by Apple
   - SHA-256 checksum provided

3. **Homebrew Cask** (future)
   - `brew install --cask balsm`

**Page Content:**
- Mac App Store badge
- Direct download button (DMG)
- Installation instructions (drag to Applications)
- System requirements (macOS 11 Big Sur+, Apple Silicon & Intel)
- File size, version, and checksum

---

### Linux (`/linux`)

**Download Options:**
1. **AppImage** (universal, preferred)
   - Download: `/latest/linux/Balsm-v{version}.AppImage`
   - Works on all distributions
   - No installation required

2. **Snap Package**
   - `sudo snap install balsm`
   - Redirect to: `https://snapcraft.io/balsm`

3. **Flatpak**
   - `flatpak install flathub health.balsm.Balsm`
   - Redirect to: `https://flathub.org/apps/health.balsm.Balsm`

4. **Distribution-Specific Packages**
   - `.deb` (Debian/Ubuntu): `/latest/linux/balsm_v{version}_amd64.deb`
   - `.rpm` (Fedora/RHEL): `/latest/linux/balsm-v{version}.x86_64.rpm`
   - `.tar.gz` (source): `/latest/linux/balsm-v{version}.tar.gz`

**Page Content:**
- AppImage download button
- Snap/Flatpak badges
- Distribution-specific instructions
- System requirements (Ubuntu 20.04+, Fedora 35+, etc.)
- File size, version, and checksum

---

## Local Server Distribution (`/local-server`)

### Routes

```
/local-server                           # Local server hub
/local-server/windows                   # Windows local server
/local-server/linux                     # Linux local server
/local-server/macos                     # macOS local server
/local-server/docker                    # Docker image

# Specific Downloads
/latest/local-server/windows/Balsm-LocalServer-v{version}.exe
/latest/local-server/linux/balsm-localserver_v{version}_amd64.deb
/latest/local-server/macos/Balsm-LocalServer-v{version}.dmg
/latest/local-server/docker              # Redirect to Docker Hub

# Configuration
/local-server/setup                     # Setup wizard
/local-server/configuration             # Configuration guide
/local-server/migration                 # Data migration tool
```

**Docker Deployment:**
```bash
docker pull balsm/local-server:latest
docker pull balsm/local-server:v1.2.3
docker run -p 5000:5000 balsm/local-server:latest
```

---

## Release Channels

### Stable Channel (`/stable` or default)

**Audience**: All users (production)

**Update Frequency**: Monthly major releases, weekly patches

**Routes**:
```
/stable                                 # Stable releases overview
/stable/{platform}                      # Latest stable for platform
```

**Characteristics**:
- Thoroughly tested
- Full QA cycle
- Production-ready
- Long-term support (LTS)

---

### Beta Channel (`/beta` or `beta.balsm.health`)

**Audience**: Early adopters, testers

**Update Frequency**: Weekly

**Routes**:
```
/beta                                   # Beta releases overview
/beta/{platform}                        # Latest beta for platform
/beta/join                              # Join beta program
/beta/feedback                          # Beta feedback form
```

**Characteristics**:
- Feature-complete but not fully tested
- May have minor bugs
- Preview of upcoming features
- Opt-in required

---

### Alpha Channel (`/alpha` or `alpha.balsm.health`)

**Audience**: Internal team, select partners

**Update Frequency**: Daily

**Routes**:
```
/alpha                                  # Alpha releases (authenticated)
/alpha/{platform}                       # Latest alpha for platform
```

**Characteristics**:
- Experimental features
- May be unstable
- Requires authentication
- Internal use only

---

### Nightly Builds (`nightly.balsm.health`)

**Audience**: Developers only

**Update Frequency**: Every commit to main branch

**Characteristics**:
- Automated builds
- No QA
- Highly unstable
- Developer testing only

---

## Universal Links & Deep Links

### Universal/App Links Format

```
https://download.balsm.health/link/{action}
```

**Behavior**:
- If app installed: Opens in app
- If app not installed: Redirects to download page or web fallback

### Deep Link Examples

```
# Open specific patient record
https://download.balsm.health/link/patient/12345

# Open appointment
https://download.balsm.health/link/appointment/67890

# Open prescription
https://download.balsm.health/link/prescription/abc123

# Make donation to case
https://download.balsm.health/link/donation/case-slug

# Install add-on
https://download.balsm.health/link/addon/addon-id/install
```

### Fallback Strategy

```
1. Try to open in installed app
   └─ Success → Open in app
   └─ Fail → Continue to step 2

2. Check if on mobile web
   └─ Yes → Show "Open in App" banner with download option
   └─ No → Continue to step 3

3. Redirect to web version with same route
   └─ Example: portal.balsm.health/patients/12345
```

---

## QR Code Generation

### QR Code Routes

```
/qr                                     # QR code generator landing
/qr/ios                                 # QR for iOS App Store
/qr/android                             # QR for Google Play
/qr/patient                             # QR for patient app (platform detection)
/qr/caregiver                           # QR for caregiver app
/qr/link/{path}                         # QR for deep link
```

### QR Code API

```
GET /api/qr?url={url}&size={size}&format={format}

Parameters:
- url: Target URL to encode
- size: QR code size (default: 256px, max: 1024px)
- format: png or svg (default: png)

Response:
- Content-Type: image/png or image/svg+xml
- QR code image
```

**Example Usage:**
```html
<img src="https://download.balsm.health/api/qr?url=https://apps.apple.com/app/balsm/id12345&size=512" alt="Download iOS App">
```

---

## Auto-Update Mechanism

### Update Check API

```
GET /api/updates/check

Headers:
- User-Agent: Balsm/{version} ({platform})
- X-Channel: stable|beta|alpha

Response:
{
  "currentVersion": "1.2.3",
  "latestVersion": "1.3.0",
  "updateAvailable": true,
  "releaseDate": "2026-03-21T10:00:00Z",
  "downloadUrl": "https://download.balsm.health/v1.3.0/windows",
  "releaseNotes": "https://download.balsm.health/releases/1.3.0",
  "critical": false,
  "minSupportedVersion": "1.0.0"
}
```

### Update Download API

```
GET /api/updates/download/{platform}/{version}

Response:
- Redirect to direct download URL
- Or return binary file directly
```

### Update Metadata

```
GET /api/updates/metadata/{version}

Response:
{
  "version": "1.3.0",
  "releaseDate": "2026-03-21T10:00:00Z",
  "platforms": {
    "ios": {
      "url": "https://apps.apple.com/...",
      "size": 45000000,
      "minOSVersion": "15.0"
    },
    "android": {
      "url": "https://download.balsm.health/latest/android",
      "size": 38000000,
      "sha256": "abc123...",
      "minAPILevel": 26
    },
    "windows": {
      "url": "https://download.balsm.health/latest/windows",
      "size": 75000000,
      "sha256": "def456...",
      "minOSVersion": "10.0.19041"
    }
  },
  "changelog": "...",
  "critical": false
}
```

---

## CDN & File Storage

### CDN Strategy

**Primary CDN**: CloudFlare R2 or AWS S3 + CloudFront

```
CDN URL Pattern:
https://cdn.balsm.health/downloads/{platform}/{version}/{filename}

Examples:
https://cdn.balsm.health/downloads/windows/1.2.3/Balsm-Setup-v1.2.3.exe
https://cdn.balsm.health/downloads/android/1.2.3/balsm-v1.2.3.apk
```

**Benefits**:
- Global distribution
- Fast download speeds
- Automatic caching
- DDoS protection

### File Organization

```
downloads/
├── ios/
│   ├── 1.0.0/
│   │   └── metadata.json
│   ├── 1.1.0/
│   └── latest -> 1.2.3/
├── android/
│   ├── 1.0.0/
│   │   ├── balsm-v1.0.0.apk
│   │   └── SHA256SUMS
│   ├── 1.1.0/
│   └── latest -> 1.2.3/
├── windows/
│   ├── 1.0.0/
│   │   ├── Balsm-Setup-v1.0.0.exe
│   │   ├── Balsm-Setup-v1.0.0.msi
│   │   └── SHA256SUMS
│   └── latest -> 1.2.3/
├── macos/
├── linux/
└── local-server/
    ├── windows/
    ├── linux/
    ├── macos/
    └── docker/
```

---

## Security & Verification

### Code Signing

**iOS**:
- Signed with Apple Developer certificate
- Submitted to App Store Connect
- Automatic signature verification by iOS

**Android**:
- Signed with Balsm keystore
- SHA-256 fingerprint published
- Play App Signing enabled

**Windows**:
- Signed with EV Code Signing certificate
- SmartScreen reputation building
- SHA-256 checksum provided

**macOS**:
- Signed with Apple Developer ID
- Notarized by Apple
- Gatekeeper verification

**Linux**:
- GPG signature for packages
- SHA-256 checksum provided

### Checksum Verification

**SHA256SUMS file format:**
```
abc123...  Balsm-Setup-v1.2.3.exe
def456...  Balsm-Setup-v1.2.3.msi
```

**Verification instructions:**
```bash
# Windows (PowerShell)
certUtil -hashfile Balsm-Setup-v1.2.3.exe SHA256

# macOS/Linux
shasum -a 256 Balsm-v1.2.3.dmg

# Compare with published checksum
```

### GPG Signature (Linux)

```bash
# Import Balsm public key
curl https://download.balsm.health/keys/balsm.asc | gpg --import

# Verify signature
gpg --verify balsm_1.2.3_amd64.deb.sig balsm_1.2.3_amd64.deb
```

---

## Analytics & Tracking

### Download Tracking

Track downloads with UTM parameters:
```
/latest/windows?utm_source=website&utm_medium=download-page&utm_campaign=v1.2.3
```

### Metrics to Track

- Download counts per platform
- Download counts per version
- Download counts per channel (stable/beta)
- Conversion rate (visit → download)
- Installation success rate
- Update adoption rate
- Platform distribution
- Geographic distribution

---

## System Requirements

### iOS Requirements
```yaml
Minimum Version: iOS 15.0
Recommended: iOS 17.0+
Device: iPhone 8 or newer, iPad (6th gen) or newer
Storage: 100 MB
Internet: Required (offline mode available)
```

### Android Requirements
```yaml
Minimum Version: Android 8.0 (API 26)
Recommended: Android 13+
Architecture: ARM64, x86_64
Storage: 80 MB
RAM: 2 GB minimum, 4 GB recommended
Internet: Required (offline mode available)
```

### Windows Requirements
```yaml
OS: Windows 10 (64-bit) or Windows 11
Processor: Intel Core i3 / AMD Ryzen 3 or better
RAM: 4 GB minimum, 8 GB recommended
Storage: 200 MB
Graphics: DirectX 11 compatible
Internet: Required (offline mode available)
```

### macOS Requirements
```yaml
OS: macOS 11 Big Sur or later
Processor: Apple Silicon (M1+) or Intel Core i5 or better
RAM: 4 GB minimum, 8 GB recommended
Storage: 200 MB
Internet: Required (offline mode available)
```

### Linux Requirements
```yaml
Distribution: Ubuntu 20.04+, Fedora 35+, Debian 11+, or equivalent
Architecture: x86_64 (AMD64)
RAM: 4 GB minimum, 8 GB recommended
Storage: 200 MB
Libraries: GTK 3.0, glibc 2.31+
Internet: Required (offline mode available)
```

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1)
- ✅ Set up `download.balsm.health` with Next.js
- ✅ Platform detection and redirect logic
- ✅ Simple download pages for all platforms
- ✅ Integration with App Store / Google Play
- ✅ Direct download links for desktop platforms

### Phase 2: Core Features (Month 2)
- Auto-update API endpoints
- QR code generation
- Release notes and changelog pages
- Checksum verification and download
- Local server distribution

### Phase 3: Advanced Features (Month 3)
- Beta channel setup
- Deep linking implementation
- Enterprise distribution portal (authenticated)
- CDN integration for faster downloads
- Analytics and download tracking

### Phase 4: Optimization (Month 4)
- Universal/App Links fully implemented
- Alpha/Nightly channels (internal)
- Homebrew/Snap/Flatpak distribution
- A/B testing for download pages
- Feedback collection from beta users

---

## Related Documentation

- [website-routing-strategy.md](./website-routing-strategy.md) — Marketing website structure
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping
- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint definitions

---

*Last updated: 2026-03-21*
