# Communication Architecture

**Balsm Healthcare Platform - App, Local Server & Cloud Communication Design**

---

## Overview

Balsm operates across three tiers that must discover each other, authenticate, exchange data, handle offline scenarios, and resolve conflicts:

| Tier | Stack | Database | Role |
|---|---|---|---|
| **App** | Flutter | Local SQLite (encrypted) | User-facing client across all platforms |
| **Local Server** | .NET 10 (standalone) | SQLite (default) or PostgreSQL | On-premise server for offline operation and private data |
| **Cloud Server** | .NET 10 (hosted) | PostgreSQL | Balsm Network - authoritative for shared data |

**Design principles:**
- Cloud-first: cloud is the default deployment, local server is optional
- Cloud owns shared/clinical data, local server owns private/business data
- App connects to one target: local server (if configured) OR cloud (if no local server). Local server proxies to cloud.
- Pharmacies must operate offline for days without internet
- Multiple apps connect to the same local server concurrently
- Dual-provider DB: SQLite default for local server (zero-install, single-file backup), PostgreSQL available for larger deployments (hospitals). Same codebase, switched by config.

---

## 1. Deployment Configurations

Three first-class deployment configurations. All use the same app and server codebases.

### Config A: App + Cloud (no local server)

```
┌──────────────────┐          HTTPS           ┌──────────────────┐
│       App        │  ◄──────────────────────► │   Cloud Server   │
│  ┌────────────┐  │                           │   (PostgreSQL)   │
│  │ Local      │  │                           │                  │
│  │ SQLite     │  │                           │  Shared data     │
│  │ (private   │  │                           │  (prescriptions, │
│  │  data)     │  │                           │   identity, etc) │
│  └────────────┘  │                           └──────────────────┘
└──────────────────┘
```

- Smallest deployment. No hardware required beyond the user's device.
- Private/business data (inventory, POS, customers) stored in app's local encrypted SQLite.
- Shared/clinical data (prescriptions, patient records, identity) lives on cloud.
- App syncs shared data from cloud; private data never leaves the device.

### Config B: App + Local Server (no cloud)

```
┌──────────────────┐      HTTPS / LAN         ┌──────────────────┐
│       App        │  ◄──────────────────────► │  Local Server    │
│                  │    mDNS / QR / Manual     │   (SQLite)       │
│                  │                           │                  │
│                  │                           │  ALL data lives  │
│                  │                           │  here            │
└──────────────────┘                           └──────────────────┘
```

- Fully offline. No internet required for any workflow.
- All data (shared and private) resides on the local server.
- Ideal for rural clinics, pharmacies with unreliable internet, or data sovereignty requirements.
- No cross-entity features (patient directory, cross-pharmacy dispensation).

### Config C: App + Local Server + Cloud (full)

```
┌──────────────────┐      HTTPS / LAN         ┌──────────────────┐   HTTPS / CF Tunnel  ┌──────────────────┐
│       App        │  ◄──────────────────────► │  Local Server    │ ◄──────────────────► │   Cloud Server   │
│                  │                           │   (SQLite)       │                      │   (PostgreSQL)   │
│                  │                           │                  │                      │                  │
│  Only talks to   │                           │  Gateway to      │                      │  Authoritative   │
│  local server    │                           │  cloud for app   │                      │  for shared data │
└──────────────────┘                           └──────────────────┘                      └──────────────────┘
```

- Full setup. App only talks to local server; local server handles all cloud communication.
- Local server is the single gateway: it proxies cloud data to the app and syncs local changes to cloud.
- Private data stays on local server, never reaches cloud (unless admin opts in).
- Cloud is authoritative for shared/clinical data; local server caches it for offline use.
- Pharmacy operates for days without internet; local server syncs with cloud when connectivity returns.

---

## 2. Data Ownership Model

Data is split into two categories with different ownership rules.

### 2.1 Categories

| Category | Authoritative Owner | Examples | Syncs to Cloud? |
|---|---|---|---|
| **Shared / Clinical** | Cloud server | Prescriptions, patient records, referrals, identity, appointments, labs, radiology, messaging | Always (when connected) |
| **Private / Business** | Local server (or app SQLite if no local server) | Inventory, purchases, suppliers, customers, POS transactions, billing | Only if admin opts in |

### 2.2 Defaults Per Bounded Context

Each bounded context has a default location. The admin can override these defaults via the local server's admin panel.

| Bounded Context | Default | Rationale |
|---|---|---|
| Identity & Access | Cloud | User discovery across entities |
| Entity Management | Cloud | Entity directory, branch info |
| Prescriptions | Cloud | Cross-pharmacy dispensation |
| Clinical Records | Cloud | Patient portability across providers |
| Appointment | Cloud | Patient-facing scheduling |
| Labs | Cloud | Cross-provider lab results |
| Radiology | Cloud | Cross-provider imaging |
| Messaging | Cloud | Cross-entity communication |
| Marketplace | Cloud | Platform-wide add-ons |
| Charitable Donations | Cloud | Public donation cases |
| **Inventory** | **Local** | Business-sensitive pricing and stock levels |
| **POS** | **Local** | Private transaction history |
| **Customer** | **Local** | Business relationships, loyalty data |
| **Billing & Finance** | **Local** | Financial privacy |

### 2.3 Admin Sync Policy Configuration

Stored on the local server (JSON file, managed via admin panel):

```json
{
  "syncPolicy": {
    "prescriptions": {
      "syncToCloud": true,
      "direction": "bidirectional"
    },
    "inventory": {
      "syncToCloud": false
    },
    "customers": {
      "syncToCloud": false,
      "overriddenByAdmin": true,
      "overriddenAt": "2026-03-15T10:00:00Z"
    },
    "billing": {
      "syncToCloud": true,
      "direction": "pushOnly",
      "overriddenByAdmin": true,
      "note": "Insurance billing requires cloud sync"
    }
  }
}
```

**Sync directions per context:**
- `bidirectional`: both push and pull (default for cloud contexts)
- `pushOnly`: local server pushes to cloud, does not accept cloud updates
- `pullOnly`: local server pulls from cloud, does not push changes
- `none`: no sync (default for local contexts)

---

## 3. Write Flow

### 3.1 Decision Logic

The app always has **one target server** — either local server or cloud, never both.

```
App wants to write data
│
├── Connected to local server? (Config B or C)
│   │
│   YES ──► Write to local server (ALL data types, ALL requests)
│           │
│           └── Local server handles everything:
│               ├── Private data ──► persist locally, done
│               ├── Cloud-eligible data ──► persist locally + sync_outbox
│               └── Data not cached locally ──► proxy request to cloud,
│                   cache response, return to app
│
└── NO local server (Config A, app connects to cloud directly)
    │
    ├── Shared/clinical data?
    │   │
    │   ├── Cloud reachable ──► Write directly to cloud
    │   │
    │   └── Cloud unreachable ──► Write to app's local outbox
    │                              (sync to cloud when online)
    │
    └── Private/business data ──► Write to app's local SQLite
                                   (never leaves the device)
```

### 3.2 Write Flow With Local Server (Config B & C)

```
                          ┌─────────────────────────────────────┐
App ──write──► Local Server                                     │
                 │                                              │
                 ├── Validate (permissions, business rules)     │
                 ├── Persist to local database                  │
                 ├── Check syncPolicy for entity type           │
                 │   ├── syncToCloud: true                      │
                 │   │   └── Write SyncOutbox record            │
                 │   │       (same DB transaction)              │
                 │   └── syncToCloud: false                     │
                 │       └── Done (local only)                  │
                 ├── Return success to app                      │
                 └── [Background] SyncService pushes            │
                     outbox to cloud                            │
                          └─────────────────────────────────────┘

App ──read──► Local Server
                 │
                 ├── Data exists locally? ──► Return from cache
                 │
                 └── Data not cached? (cloud-eligible entity)
                     ├── Cloud reachable ──► Proxy to cloud,
                     │                       cache response,
                     │                       return to app
                     └── Cloud unreachable ──► Return 404 or
                                               stale cached version
```

The local server acts as a **transparent gateway**: the app sends all requests to the local server, and the local server decides whether to serve from its own data, proxy to cloud, or queue for later sync. The app never needs to know about the cloud.

### 3.3 Write Flow Without Local Server (Config A)

```
App writes shared data
  │
  ├── Online ──► POST /api/v1/{resource} to cloud
  │              └── Cloud returns created/updated entity
  │
  └── Offline ──► Insert into local outbox table
                  │  { entityType, entityId, operation,
                  │    payload, clientTimestamp }
                  │
                  └── [On reconnect] Push outbox to cloud
                      POST /api/v1/sync/push
                      Cloud returns { accepted[], conflicts[] }

App writes private data
  └── Always ──► Insert into local SQLite
                 (never syncs to cloud)
```

---

## 4. Discovery & Connection

### 4.1 App Discovers Local Server

Three methods, in order of preference:

| Method | Flow | When Used |
|---|---|---|
| **mDNS** | App listens for `_balsm._tcp.local` service type. Resolves to IP:port on LAN. | Automatic, same network |
| **QR Code** | Local server displays QR code (admin panel or startup screen). App scans. QR contains JSON: `{ url, serverName, inviteCode, version }` | First-time setup |
| **Manual URL** | User types IP address, hostname, or domain | Fallback |

**Implementation notes:**
- mDNS is implemented in `Balsm.Supervisor/Services/MdnsService.cs`
- Default mDNS hostname: `balsm` (configurable via `SupervisorOptions.MdnsHostname`)
- Uses `Makaretu.Dns.Multicast` library

**Validation handshake** (all three methods):

```
App ──► GET {serverUrl}/api/v1/server-info  (unauthenticated)

Server responds:
{
  "platform": "balsm",
  "version": "1.0.0",
  "apiVersion": "v1",
  "schemaVersion": 1,
  "serverName": "Downtown Pharmacy",
  "serverId": "a1b2c3d4-...",
  "deploymentMode": "standalone",
  "capabilities": [
    "identity", "entity", "inventory",
    "pos", "prescription", "customer"
  ],
  "syncPolicy": {
    "prescriptions": { "syncToCloud": true },
    "inventory": { "syncToCloud": false }
  }
}
```

The app validates:
1. `platform` must be `"balsm"` (not a random server)
2. `apiVersion` is compatible with this app version
3. `capabilities` list tells the app which modules are available

**Existing implementation:** `Balsm.Supervisor/Controllers/ConnectController.cs` returns basic info at `GET /connect`. This needs to be extended to the full `server-info` response above.

### 4.2 Local Server Registers with Cloud

For Config C, the local server registers with the Balsm Network to get a public URL via Cloudflare Tunnel:

```
Local Server ──► POST https://registry.balsm.cloud/register
                 {
                   "serverId": "a1b2c3d4-...",
                   "serverName": "Downtown Pharmacy",
                   "registrySecret": "shared-secret"
                 }

Registry ──► Creates Cloudflare tunnel + DNS record
             Returns: {
               "tunnelToken": "...",
               "hostname": "a1b2c3d4.api.balsm.cloud"
             }

Local Server ──► Starts cloudflared with tunnel token
                 Now reachable at https://a1b2c3d4.api.balsm.cloud
```

**Implementation:**
- Tunnel registry: `Balsm-API-DotNet/tunnel-registry/` (Cloudflare Worker, TypeScript)
- Tunnel service: `Balsm.Supervisor/Services/CloudflareTunnelService.cs`
- Config: `SupervisorOptions.RegistryUrl`, `SupervisorOptions.RegistrySecret`

### 4.3 App Connects to Cloud (Config A only)

When no local server is configured, the app connects directly to cloud.

Static URL: `https://api.balsm.cloud` (or custom domain for enterprise).

No discovery needed. The app has the cloud URL built in or configurable in settings.

**Key rule:** If a local server is configured (Config B or C), the app **never** talks to the cloud directly. All cloud communication is handled by the local server.

---

## 5. Authentication

### 5.1 App to Server (Single Target)

The app authenticates with **one server** — either local server or cloud, never both simultaneously. Same JWT-based flow regardless of target:

```
# Login
App ──► POST /api/v1/auth/token
        {
          "username": "pharmacist1",
          "password": "...",
          "deviceId": "device-uuid-v4"
        }

Server ──► {
             "accessToken": "eyJ... (JWT, 15 min expiry)",
             "refreshToken": "uuid-v4 (30 day expiry)",
             "user": { "id", "name", "permissions[]" }
           }

# Subsequent requests
App ──► Authorization: Bearer {accessToken}
        X-Device-Id: {deviceId}
        X-Correlation-Id: {uuid}

# Token refresh (automatic on 401)
App ──► POST /api/v1/auth/refresh
        { "refreshToken": "...", "deviceId": "..." }
Server ──► { "accessToken": "new-jwt", "refreshToken": "new-refresh" }
```

**Storage:** Tokens stored in platform-native secure storage:
- iOS/macOS: Keychain
- Android: EncryptedSharedPreferences
- Windows/Linux: platform keyring via `flutter_secure_storage`

**Key design point:** Each server is its own Identity Provider. There is no centralized auth service. A user who works at two pharmacies has two separate accounts (one per server).

### 5.2 App Server Connections

The app can be registered with multiple servers (e.g., a pharmacist who works at two pharmacies), but only **one server is active at a time**. The user switches between servers via a server selector in the app.

```dart
class ServerConnection {
  final String serverId;
  final String serverUrl;
  final String serverName;
  final ServerType type;         // local | cloud
  final String accessToken;      // encrypted at rest
  final String refreshToken;     // encrypted at rest
  final String deviceId;
  final DateTime lastSyncTimestamp;
  final SyncPolicy syncPolicy;   // from server-info
  final bool isActive;           // only one can be true at a time
}
```

- App stores credentials for multiple servers
- UI shows a server selector in navigation (like switching accounts)
- Each connection has independent auth state, sync watermark, and cached data
- Connections persist across app restarts
- **Only the active server receives API calls** — there is no simultaneous dual connection

### 5.3 Local Server to Cloud

Server-to-server auth uses mutual API keys (already implemented):

```
# During initial cloud registration
Local Server ──► Receives API key from cloud
Cloud ──► Receives API key from local server

# All subsequent requests
Local Server ──► POST /api/v1/sync/inbound
                 X-Balsm-ApiKey: {cloudApiKey}
                 Body: { syncBatch }

Cloud ──► Validates API key (constant-time comparison)
```

**Implementation:** `Balsm.Supervisor/Middleware/FederationAuthMiddleware.cs` handles `X-Balsm-ApiKey` validation using `CryptographicOperations.FixedTimeEquals`.

### 5.4 Server-to-Server Federation

For direct server-to-server pairing (e.g., two pharmacies sharing inventory):

```
Server A admin ──► Generate pairing code
                   Returns: { code: "X7K9M2", expiresInSeconds: 600 }

Server B admin ──► Enter code + Server A's URL
                   Server B ──► POST {serverA}/api/v1/federation/pair
                                { code, serverId, serverName, serverUrl, apiKey }
                   Server A ──► Validates code, stores pairing
                                Returns: { serverId, serverName, apiKey }
                   Server B ──► Stores pairing with Server A's API key

Both servers now exchange heartbeats every 60s.
```

**Implementation:**
- `FederationService.GenerateCode()`: 6-char alphanumeric, 10-min expiry
- `FederationService.ValidateAndCompletePairingAsync()`: validates code, stores pairing
- Pairing codes use `ConcurrentDictionary` (in-memory, not persisted)
- Pairings persisted to `federation-pairings.json` via `FileFederationStore`

---

## 6. Sync Protocol

### 6.1 Local Server to Cloud (Outbox Pattern)

Every entity mutation on the local server that is cloud-eligible writes a sync outbox record in the same database transaction:

```sql
BEGIN TRANSACTION;

  -- Entity mutation
  UPDATE prescriptions
  SET status = 'dispensed', updated_at = @now
  WHERE id = @prescriptionId;

  -- Outbox record (same transaction = guaranteed consistency)
  INSERT INTO sync_outbox (
    id, entity_type, entity_id, operation,
    json_payload, sequence_number, created_at, processed
  ) VALUES (
    @newId, 'Prescription', @prescriptionId, 'Update',
    @jsonPayload, NEXT_SEQUENCE(), @now, false
  );

COMMIT;
```

**Background SyncService** (already scaffolded in `Balsm.Supervisor/Services/SyncService.cs`):

```
Loop every 30 seconds:
  For each active cloud pairing (or cloud connection):
    1. SELECT * FROM sync_outbox
       WHERE processed = false
       ORDER BY sequence_number ASC
       LIMIT 100

    2. Build SyncBatch:
       { sourceServerId, sequenceNumber, records[], sentAt }

    3. POST {cloudUrl}/api/v1/sync/inbound
       X-Balsm-ApiKey: {cloudApiKey}
       Body: syncBatch

    4. On 202 Accepted:
       UPDATE sync_outbox SET processed = true
       WHERE sequence_number <= {acknowledged}

    5. On failure:
       Log warning, retry next cycle
       If consecutive failures > 5: exponential backoff
```

**Gap detection:** If the cloud reports a gap in sequence numbers (e.g., received seq 10, expected seq 8), the local server re-delivers from the gap.

**Hook point:** The outbox write can be integrated into `BaseDbContext.SaveChangesAsync()` by intercepting `ChangeTracker` entries and generating outbox records for cloud-eligible entity types. This uses the same pattern as the existing audit field setting.

### 6.2 Cloud to Local Server (Hybrid: Real-Time + Pull)

The local server receives cloud data through two channels simultaneously:

**Channel A: Real-Time Push (SignalR)** — for latency-sensitive data

The local server opens a persistent SignalR connection to the cloud on startup:

```
Local Server ──► wss://api.balsm.cloud/sync-hub
                 Auth: X-Balsm-ApiKey: {cloudApiKey}

Cloud pushes events as they happen:
  → { type: "prescription.created", entityId, data, updatedAt }
  → { type: "prescription.statusChanged", entityId, data, updatedAt }
  → { type: "consent.revoked", patientId, scope, updatedAt }
  → { type: "alert.critical", alertId, data, updatedAt }
  → { type: "message.received", conversationId, data, updatedAt }

Local Server:
  1. Applies record to local database
  2. Updates watermark timestamp
  3. Notifies connected apps via local SignalR hub
```

Real-time entity types:

| Entity Type | Why Real-Time |
|---|---|
| Prescriptions | Pharmacy must see new prescriptions immediately |
| Prescription status | Prevents double-dispensation across pharmacies |
| Patient consent | Consent revoked = stop showing data instantly |
| Critical alerts | Drug recalls, safety notices |
| Messaging | Users expect instant chat delivery |

**Channel B: Pull (Polling)** — for bulk/background data

The local server polls the cloud on a timer for data that doesn't need instant delivery:

```
Every 5 minutes:
  Local Server ──► GET {cloudUrl}/api/v1/sync/pull
                   ?since={lastPullTimestamp}
                   &entities=identity,entity,labs,radiology,messaging
                   &limit=100

  Cloud ──► {
              "records": [
                {
                  "entityType": "Identity",
                  "entityId": "guid",
                  "operation": "Create|Update|Delete",
                  "data": { ... },
                  "updatedAt": "2026-03-15T14:30:00Z"
                }
              ],
              "serverTimestamp": "2026-03-15T14:35:00Z",
              "hasMore": false
            }

  Local Server ──► Applies records to local database
                   Stores serverTimestamp as next watermark
                   If hasMore: immediately fetch next page
```

Pull entity types:

| Entity Type | Why Pull | Frequency |
|---|---|---|
| Identity / user directory | Rarely changes | Every 5 min |
| Entity directory (branches, departments) | Static reference data | Every 30 min |
| Historical clinical records | Stable after creation | Every 5 min |
| Lab / radiology results | Have their own delivery workflow | Every 5 min |
| Marketplace / add-ons | Catalog data | Every 30 min |

**Reconnect after disconnect:**

```
SignalR connection drops (internet outage)
  │
  └── On reconnect:
      1. Re-establish SignalR connection to cloud
      2. Catch-up pull for real-time entity types:
         GET /sync/pull?since={lastRealTimeTimestamp}
             &entities=prescriptions,consent,alerts,messaging
         (catches anything missed while disconnected)
      3. Normal pull timer resumes for batch data
```

**Sync policy integration:**

The admin-configured sync policy determines which entity types are synced at all. Within the synced types, the real-time vs. pull split is system-defined (not admin-configurable) because it's based on clinical safety requirements, not business preference.

### 6.3 App to Server (Timestamp Watermark)

The app syncs with its **active server** (either local server or cloud — whichever it is connected to):

**Pull (server to app):**

```
App ──► GET /api/v1/sync/pull
        ?since={lastSyncTimestamp}
        &entities=prescriptions,inventory,customers
        &limit=200

Server ──► {
             "records": [ ... ],
             "serverTimestamp": "...",
             "hasMore": true|false
           }

App ──► Applies records to local SQLite cache
        Stores serverTimestamp for next pull
```

**Push (app to server, for offline queue):**

```
App ──► POST /api/v1/sync/push
        {
          "records": [
            {
              "entityType": "Dispensation",
              "entityId": "guid",
              "operation": "Create",
              "data": { ... },
              "clientTimestamp": "2026-03-15T10:00:00Z",
              "clientSequence": 42
            }
          ]
        }

Server ──► {
             "accepted": [
               { "entityId": "guid", "serverTimestamp": "..." }
             ],
             "conflicts": [
               {
                 "entityId": "guid",
                 "reason": "version_mismatch",
                 "serverVersion": { ... }
               }
             ]
           }
```

### 6.4 App Offline Outbox

The app maintains a persistent outbox in local SQLite:

```sql
CREATE TABLE sync_outbox (
  id TEXT PRIMARY KEY,
  target_server_id TEXT NOT NULL,     -- which server to push to
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,             -- Create, Update, Delete
  json_payload TEXT NOT NULL,
  client_timestamp TEXT NOT NULL,
  client_sequence INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TEXT,
  created_at TEXT NOT NULL
);
```

- Entries created for every mutation while the target server is unreachable
- On connectivity restore, pushed in chronological order (`client_sequence ASC`)
- Failed entries retried with exponential backoff (max 5 retries per cycle)
- After 5 consecutive failures, entry is flagged for manual review
- Outbox is processed on a background isolate (Flutter `Isolate` / `compute`)

### 6.5 Sync Frequency

| Context | Frequency | Trigger |
|---|---|---|
| App ↔ Active Server (local or cloud) | Every 30 seconds | Timer + UI navigation |
| Local Server → Cloud (outbox push) | Every 30 seconds | Timer |
| Local Server ← Cloud (real-time push) | Instant (SignalR) | Prescriptions, consent, alerts, messaging |
| Local Server ← Cloud (batch pull) | Every 5 minutes | Identity, entity, labs |
| Background sync (app suspended) | Platform-dependent | WorkManager / BGTask |

---

## 7. Conflict Resolution

### 7.1 Strategy Per Data Category

| Data Type | Owner | Strategy |
|---|---|---|
| Shared data (prescriptions, clinical) | Cloud | **Cloud-authoritative.** If local server or app has a conflicting version, cloud wins. Local/app overwrites with cloud version. |
| Private data (inventory, POS, customers) | Local server | **Local server authoritative.** App changes are mediated by the local server. If two apps conflict, the local server's version counter determines the winner. |
| Concurrent app edits (same local server) | Local server | **Optimistic concurrency.** Entity has a `Version` field. App sends `If-Match: {version}`. Server returns `409 Conflict` if mismatch. App refreshes and retries. |
| Local → Cloud sync conflict | Cloud | **Cloud wins.** If the cloud has a newer version of a shared entity, the local server accepts the cloud version and overwrites its local copy. |

### 7.2 Optimistic Concurrency (Multi-App)

Multiple app instances (e.g., two pharmacist tablets) connecting to the same local server:

```
Pharmacist A reads inventory item (version: 3)
Pharmacist B reads inventory item (version: 3)

Pharmacist A updates quantity:
  PUT /api/v1/inventory/{id}
  If-Match: 3
  Body: { quantity: 45 }
  Server: 200 OK (version now 4)

Pharmacist B tries to update:
  PUT /api/v1/inventory/{id}
  If-Match: 3
  Body: { quantity: 50 }
  Server: 409 Conflict
  Response: { currentVersion: 4, currentData: { quantity: 45 } }

Pharmacist B's app refreshes the item, shows updated quantity,
prompts pharmacist to re-enter their change.
```

**Implementation note:** Add a `Version` (int) or `RowVersion` (byte[]) column to `BaseEntity`. EF Core supports concurrency tokens natively via `[ConcurrencyCheck]` attribute or `IsConcurrencyToken()` in model builder.

### 7.3 Conflict Resolution for Offline Push

When the app pushes its offline outbox and the server has a newer version:

```
App pushes: { entityId: "abc", operation: "Update", data: { qty: 45 }, version: 3 }
Server has: { entityId: "abc", data: { qty: 50 }, version: 5 }

For shared data (cloud-owned):
  → Server rejects the app's version
  → Returns conflict with server's current data
  → App overwrites local cache with server version
  → If critical (e.g., dispensation), flags for pharmacist review

For private data (local-owned):
  → Server applies last-write-wins (by timestamp)
  → Returns accepted with merged version
  → App updates local cache
```

---

## 8. Offline Scenarios

### 8.1 Pharmacy Offline for Days (Config C)

```
Timeline:

Day 0: Internet goes down
  ┌────────────────────────────────────────────────────────┐
  │ App ◄──LAN──► Local Server      ✗ Cloud               │
  │                                                        │
  │ - All app writes go to local server (normal)           │
  │ - Local server processes everything normally            │
  │ - Cloud-eligible changes accumulate in sync_outbox     │
  │ - SyncService detects cloud unreachable, backs off     │
  │ - Admin dashboard shows "Cloud: Disconnected"          │
  └────────────────────────────────────────────────────────┘

Day 1-3: Pharmacy operates normally
  ┌────────────────────────────────────────────────────────┐
  │ - Dispensations recorded locally                       │
  │ - Inventory updates applied locally                    │
  │ - POS transactions recorded locally                    │
  │ - New prescriptions cannot be fetched from cloud       │
  │   (only locally-cached prescriptions available)        │
  │ - Outbox grows: 500+ records pending                   │
  └────────────────────────────────────────────────────────┘

Day 3: Internet returns
  ┌────────────────────────────────────────────────────────┐
  │ SyncService detects cloud reachable                    │
  │                                                        │
  │ Step 1: Push outbox (oldest first, batches of 100)     │
  │   Local ──► POST /sync/inbound { batch 1..5 }         │
  │   Cloud ──► ACKs each batch                            │
  │   Outbox drains over ~2.5 minutes (5 batches)          │
  │                                                        │
  │ Step 2: Pull cloud changes                             │
  │   Local ──► GET /sync/pull?since={3 days ago}          │
  │   Cloud ──► Returns new prescriptions, patient updates │
  │   Local applies, may need multiple pages (hasMore)     │
  │                                                        │
  │ Step 3: Resolve conflicts                              │
  │   Cloud has updated some prescriptions ──► cloud wins  │
  │   Local's dispensation records ──► accepted by cloud    │
  │                                                        │
  │ Step 4: App syncs from local server                    │
  │   App gets the merged/reconciled state on next poll    │
  │   Pharmacist sees any conflict notifications           │
  └────────────────────────────────────────────────────────┘
```

### 8.2 App Offline Without Local Server (Config A)

```
App loses connectivity
  ┌────────────────────────────────────────────────────────┐
  │ - Cached shared data is readable (last sync snapshot)  │
  │ - Private data (inventory, POS) fully operational      │
  │   (stored in app's local SQLite)                       │
  │ - Shared data writes go to app outbox                  │
  │ - On reconnect: push outbox, pull latest from cloud    │
  │ - Conflicts resolved (cloud wins for shared data)      │
  └────────────────────────────────────────────────────────┘
```

### 8.3 Degraded Mode Behaviors

| Feature | Online (with local server) | Offline (with local server) | Online (no local server) | Offline (no local server) |
|---|---|---|---|---|
| View prescriptions | Full (local cache + cloud proxy) | Full (local cache only) | Full (from cloud) | Read-only (last sync) |
| Dispense prescription | Full | Full | Full | Queue in outbox |
| Update inventory | Full | Full | Full (local SQLite) | Full (local SQLite) |
| POS transaction | Full | Full | Full (local SQLite) | Full (local SQLite) |
| Fetch new prescription | Full (proxied from cloud) | Unavailable | Full | Unavailable |
| Patient directory search | Full (proxied from cloud) | Unavailable | Full | Unavailable |
| Cross-pharmacy features | Full (proxied from cloud) | Unavailable | Full | Unavailable |
| View patient records | Full | Cached only | Full | Cached only |

---

## 9. Pharmacy Workflow Scenario (End-to-End)

### Setup

- **Downtown Pharmacy** deployed Config C (App + Local Server + Cloud)
- Two pharmacist tablets connected to local server via WiFi
- Cloud subscription active
- Inventory and customer data = local only
- Prescriptions = synced to cloud

### Scenario: Customer Brings a Prescription

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. SCAN                                                                │
│    Pharmacist A scans prescription QR code on tablet                   │
│    App ──► Local Server: GET /api/v1/prescriptions/{id}               │
│                                                                        │
│    Local server has it?                                                 │
│    ├── YES: returns from local SQLite cache                            │
│    └── NO: proxies to cloud, caches locally, returns to app            │
│                                                                        │
│ 2. REVIEW                                                              │
│    App displays:                                                        │
│    - Prescription details (medications, dosage, doctor)                │
│    - Drug interaction warnings (checked against patient history)       │
│    - Inventory availability (from local server)                        │
│    - Insurance coverage (from local server, proxied from cloud)   │
│                                                                        │
│ 3. DISPENSE                                                            │
│    Pharmacist A confirms dispensation                                  │
│    App ──► Local Server: POST /api/v1/dispensations                    │
│            { prescriptionId, items[], paymentMethod }                  │
│                                                                        │
│    Local Server:                                                        │
│    a. Validate (stock sufficient? prescription valid? not already       │
│       dispensed?)                                                       │
│    b. BEGIN TRANSACTION                                                │
│       - Create Dispensation record                                     │
│       - Update Inventory (reduce quantities)                           │
│       - Update Prescription status = "dispensed"                       │
│       - Create POS transaction                                         │
│       - Write sync_outbox for Dispensation + Prescription              │
│         (cloud-eligible)                                               │
│       - Inventory & POS NOT in outbox (local-only per policy)          │
│       COMMIT                                                           │
│    c. Return success to app                                            │
│                                                                        │
│ 4. CONCURRENT UPDATE                                                   │
│    Pharmacist B on another tablet                                      │
│    - Next sync (30s) picks up inventory change                         │
│    - Sees updated stock quantities                                     │
│    - If Pharmacist B was also dispensing same item:                     │
│      optimistic concurrency handles it (409 → refresh → retry)        │
│                                                                        │
│ 5. CLOUD SYNC (background)                                             │
│    SyncService picks up outbox records                                 │
│    Local Server ──► Cloud: POST /api/v1/sync/inbound                  │
│    { batch: [Dispensation:Create, Prescription:Update] }               │
│    Cloud ACKs, updates its records                                     │
│                                                                        │
│ 6. PATIENT NOTIFICATION                                                │
│    Patient's app pulls from cloud on next sync                         │
│    Sees: "Your prescription has been dispensed at Downtown Pharmacy"   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Edge Case: Internet Down at Step 5

```
- Dispensation is fully recorded on local server
- Pharmacy continues operating normally
- sync_outbox accumulates
- Patient checks their app: prescription still shows "pending"
- Internet returns 2 hours later:
  SyncService pushes outbox → cloud updates → patient sees "dispensed"
```

### Edge Case: Same Prescription Dispensed at Two Pharmacies

```
- Pharmacy A and Pharmacy B both have the prescription cached
- Pharmacy A dispenses first, syncs to cloud
- Pharmacy B tries to dispense:
  If online: cloud rejects (already dispensed), local server rejects
  If offline: local server allows locally, but on sync:
    Cloud returns conflict, local server marks dispensation as "disputed"
    Admin reviews and resolves
```

---

## 10. API Contracts

### 10.1 Sync Endpoints

These endpoints exist on both local server and cloud:

```
# Pull changes since timestamp
GET /api/v1/sync/pull
  Query params:
    since: ISO-8601 timestamp (required)
    entities: comma-separated entity types (required)
    limit: max records per page (default 100, max 1000)
  Response: SyncPullResponse

# Push offline queue (app → server)
POST /api/v1/sync/push
  Body: SyncPushRequest
  Response: SyncPushResponse

# Receive inbound batch (server → server)
POST /api/v1/sync/inbound
  Headers: X-Balsm-ApiKey
  Body: SyncBatch
  Response: 202 Accepted

# Check sync status (admin)
GET /api/v1/sync/status
  Response: SyncStatusResponse

# Update sync policy (admin)
PUT /api/v1/sync/policy
  Body: SyncPolicyUpdateRequest
  Response: 200 OK
```

### 10.2 Server Info Endpoint

```
# Extended server info (unauthenticated)
GET /api/v1/server-info
  Response: ServerInfoResponse

# Response:
{
  "platform": "balsm",
  "version": "1.2.0",
  "apiVersion": "v1",
  "schemaVersion": 2,
  "serverName": "Downtown Pharmacy",
  "serverId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "deploymentMode": "standalone",
  "capabilities": ["identity", "entity", "inventory", "pos", "prescription", "customer"],
  "syncPolicy": {
    "prescriptions": { "syncToCloud": true, "direction": "bidirectional" },
    "inventory": { "syncToCloud": false }
  },
  "requiresInviteCode": true
}
```

### 10.3 Data Models for Sync

Reuse existing models from `Balsm.Supervisor/Models/FederationModels.cs`:

```csharp
// Already exists
public sealed class SyncBatch
{
    public string SourceServerId { get; set; }
    public long SequenceNumber { get; set; }
    public List<SyncRecord> Records { get; set; }
    public DateTime SentAt { get; set; }
}

public sealed class SyncRecord
{
    public string EntityType { get; set; }
    public Guid EntityId { get; set; }
    public string Operation { get; set; }    // Create, Update, Delete
    public string JsonPayload { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// New: App sync models
public sealed class SyncPullResponse
{
    public List<SyncRecord> Records { get; set; }
    public DateTime ServerTimestamp { get; set; }
    public bool HasMore { get; set; }
}

public sealed class SyncPushRequest
{
    public List<AppSyncRecord> Records { get; set; }
}

public sealed class AppSyncRecord
{
    public string EntityType { get; set; }
    public Guid EntityId { get; set; }
    public string Operation { get; set; }
    public string JsonPayload { get; set; }
    public DateTime ClientTimestamp { get; set; }
    public int ClientSequence { get; set; }
    public int? ExpectedVersion { get; set; }  // for optimistic concurrency
}

public sealed class SyncPushResponse
{
    public List<SyncAccepted> Accepted { get; set; }
    public List<SyncConflict> Conflicts { get; set; }
}

public sealed class SyncAccepted
{
    public Guid EntityId { get; set; }
    public DateTime ServerTimestamp { get; set; }
    public int NewVersion { get; set; }
}

public sealed class SyncConflict
{
    public Guid EntityId { get; set; }
    public string Reason { get; set; }          // version_mismatch, already_deleted, etc.
    public string ServerData { get; set; }       // current server version as JSON
    public int ServerVersion { get; set; }
}
```

---

## 11. Real-Time Communication

### 11.1 Cloud → Local Server (SignalR Sync Hub)

The local server maintains a persistent SignalR connection to the cloud for real-time sync of latency-sensitive data (prescriptions, consent, alerts). See section 6.2 Channel A for protocol details.

```
Local Server ──► wss://api.balsm.cloud/sync-hub  (persistent)
                 Cloud pushes prescription/consent/alert events
```

This connection also serves as a health indicator — if it drops, the local server knows the cloud is unreachable and switches to offline mode.

### 11.2 Local Server → App (SignalR Notifications)

The local server runs its own SignalR hub for connected apps:

| Feature | Protocol | Scope | Priority |
|---|---|---|---|
| Inventory change notifications | SignalR (WebSocket) | App ↔ Local Server | Phase 2 |
| New prescription arrived (from cloud) | SignalR | Local Server → App | Phase 1 |
| Sync completed notification | SignalR | Local Server → App | Phase 2 |
| Chat / messaging | SignalR | App ↔ Active Server (proxied to cloud in Config C) | Phase 2 |

### 11.3 Cloud → App (Push Notifications)

Push notifications bypass the local server entirely (delivered by platform services):

| Feature | Protocol | Priority |
|---|---|---|
| Prescription status updates | FCM / APNs | Phase 2 |
| Appointment reminders | FCM / APNs | Phase 3 |
| Critical alerts | FCM / APNs | Phase 2 |

Push notifications are supplementary — they wake the app or show a banner, but the actual data is fetched via the normal sync channel (app pulls from its active server).

### 11.4 Fallback Chain

WebSocket → Server-Sent Events → long-polling

**Implementation:** .NET SignalR is the natural choice (same stack). Flutter uses the `signalr_netcore` package.

---

## 12. Security

### 12.1 Transport

- **LAN (App ↔ Local Server):** HTTPS with self-signed certificate. App pins the certificate on first connection (trust-on-first-use). Already implemented via `Balsm.Supervisor/Security/CertificateService.cs`.
- **Internet (App ↔ Cloud):** HTTPS with CA-signed certificate. Standard TLS 1.2+.
- **Tunnel (Local ↔ Cloud):** Cloudflare Tunnel provides encrypted transport.

### 12.2 Data at Rest

| Tier | Encryption |
|---|---|
| App (local SQLite) | SQLCipher (AES-256-CBC) |
| Local Server (SQLite) | Optional SQLCipher or filesystem encryption |
| Cloud (PostgreSQL) | Encryption at rest (cloud provider managed) |

### 12.3 PHI Protection

- Patient consent tracked per data category per destination server
- Sync respects consent records: if patient hasn't consented to sharing with a particular entity, their data is excluded from sync batches
- Audit trail records every sync operation (who, what, when, where)
- Soft-delete only (`BaseEntity.IsDeleted`), never hard-delete clinical data
- Right to erasure: `IsDeleted = true` propagated via sync to all copies

### 12.4 API Security

- Rate limiting: per device (by `X-Device-Id`) and per API key
- Request signing for federation: HMAC-SHA256 over request body (future)
- Correlation IDs: `X-Correlation-Id` header propagated through all tiers for tracing
- Input validation: FluentValidation at every API boundary
- SQL injection: prevented by EF Core parameterized queries
- XSS: JSON-only API, no HTML rendering on server

---

## 13. Error Handling & Resilience

### 13.1 Retry Policy

| Operation | Max Retries | Backoff Strategy | Timeout |
|---|---|---|---|
| App API call (normal) | 3 | Exponential: 1s, 2s, 4s | 30s |
| App sync push (outbox) | 5 | Exponential: 5s, 10s, 30s, 60s, 300s | 60s |
| Local → Cloud sync (outbox) | Unlimited | Exponential: 30s → 5min cap | 120s |
| Cloud → Local SignalR reconnect | Unlimited | Exponential: 1s → 60s cap | 10s |
| Cloud → Local pull (batch) | Unlimited | Exponential: 5min → 30min cap | 120s |
| Federation heartbeat | Unlimited | Fixed: 60s | 10s |

### 13.2 Connectivity State Machine

```
                    ┌───────────┐
           ┌───────►│  ONLINE   │◄───────┐
           │        └─────┬─────┘        │
      heartbeat           │ request      heartbeat
      success             │ fails        success
           │              ▼              │
           │        ┌───────────┐        │
           ├────────│ DEGRADED  │────────┤
           │        └─────┬─────┘        │
           │              │ 3 consecutive│
           │              │ failures     │
           │              ▼              │
           │        ┌───────────┐        │
           └────────│  OFFLINE  │────────┘
                    └───────────┘
```

- **ONLINE:** Normal operation. Sync runs on standard schedule.
- **DEGRADED:** Some requests failing. Sync retries with backoff.
- **OFFLINE:** Target unreachable. Writes go to outbox. Heartbeat continues checking. Auto-transitions to ONLINE when heartbeat succeeds.

### 13.3 Version Compatibility

```
App connects to server:
  GET /api/v1/server-info
  Response includes: apiVersion, schemaVersion

App checks:
  - apiVersion matches → proceed
  - apiVersion is newer minor → proceed (backward compatible)
  - apiVersion is newer major → show upgrade prompt, block connection
  - schemaVersion mismatch → sync may need migration, warn user

Server-to-server sync:
  - Schema version included in SyncBatch
  - Receiver validates schema compatibility before applying records
  - Incompatible schema → reject batch, log error, notify admin
```

---

## 14. Monitoring & Observability

### 14.1 Correlation ID

Every request chain gets a unique correlation ID:

```
App generates UUID ──► X-Correlation-Id: {uuid}
  ├── Local Server logs with same ID
  ├── Local Server forwards to Cloud with same ID
  └── All tiers can trace a single user action across the system
```

Already partially implemented: `Balsm.Infrastructure/Middleware/CorrelationIdMiddleware.cs`

### 14.2 Sync Dashboard (Admin Panel)

The Supervisor admin panel shows:

| Metric | Description |
|---|---|
| Outbox depth | Number of unprocessed sync records |
| Last sync time | When the last successful sync completed |
| Sync latency | Time between record creation and cloud receipt |
| Connected devices | Active app connections (by device ID) |
| Federation status | Heartbeat status for each paired server |
| Conflict count | Number of unresolved sync conflicts |

### 14.3 Structured Logging

Server: Serilog with structured properties:
```
[INF] Sync batch pushed to cloud {BatchSize} records, seq {SequenceNumber}, {Duration}ms
[WRN] Sync conflict for {EntityType}/{EntityId}: cloud version {CloudVersion} > local {LocalVersion}
[ERR] Cloud unreachable, {OutboxDepth} records pending
```

App: categorized logs with log level filtering:
```
[SYNC] Pulled 25 records from local server (watermark: 2026-03-15T14:30:00Z)
[SYNC] Pushed 3 outbox records to cloud, 3 accepted, 0 conflicts
[AUTH] Token refreshed for server "Downtown Pharmacy"
```

---

## 15. Implementation Roadmap

### Phase 1 (MVP - Pharmacy)

1. Extend `ConnectController` to serve full `server-info` response with capabilities
2. Add `Version` column to `BaseEntity` for optimistic concurrency
3. Create `SyncOutbox` entity and EF Core configuration
4. Hook outbox writes into `BaseDbContext.SaveChangesAsync()` based on sync policy
5. Implement `GET /api/v1/sync/pull` and `POST /api/v1/sync/push` endpoints
6. Extend `SyncService` to push outbox records to cloud (not just log them)
7. Implement sync policy admin API (`GET/PUT /api/v1/sync/policy`)
8. Implement SignalR sync hub on cloud (`/sync-hub`) for real-time prescription/consent/alert push
9. Implement SignalR client in local server `SyncService` to receive real-time events from cloud
10. Implement local SignalR hub on local server for notifying connected apps of new prescriptions
11. Flutter: implement `ServerConnection` model and single-active-server connection manager
12. Flutter: implement local outbox table and background sync isolate

### Phase 2 (Multi-App & Real-Time)

1. Implement optimistic concurrency with `If-Match` / `409 Conflict` flow
2. Add SignalR hub for inventory change notifications (App ↔ Local Server)
3. Add push notifications via FCM/APNs (Cloud → App)
4. Sync dashboard in admin panel (outbox depth, last sync, conflicts)

### Phase 3 (Cross-Entity)

1. Cloud-side sync aggregation (pull from multiple federated servers)
2. Patient consent management for cross-entity data sharing
3. Cross-pharmacy prescription dispensation checks
4. Patient directory search across Balsm Network

---

## Appendix: Existing Code References

| File | What It Provides | Needs Extension? |
|---|---|---|
| `Supervisor/Services/FederationService.cs` | Server pairing, API key exchange | No (complete for MVP) |
| `Supervisor/Services/SyncService.cs` | Background sync loop, heartbeat, inbound queue | Yes: add outbox push logic |
| `Supervisor/Models/FederationModels.cs` | SyncBatch, SyncRecord, ServerPairing | Yes: add SyncPullResponse, SyncPushRequest/Response |
| `Supervisor/Middleware/FederationAuthMiddleware.cs` | API key auth for server-to-server | No (complete) |
| `Supervisor/Controllers/ConnectController.cs` | Basic server info at `GET /connect` | Yes: extend to full `server-info` |
| `Supervisor/Controllers/FederationController.cs` | `/pair`, `/heartbeat`, `/sync` | Yes: add `/sync/pull`, `/sync/push` |
| `Supervisor/Services/CloudflareTunnelService.cs` | CF tunnel registration | No (complete) |
| `Supervisor/Services/MdnsService.cs` | LAN discovery | No (complete) |
| `Infrastructure/Data/BaseDbContext.cs` | Audit fields, domain events | Yes: hook outbox writes |
| `SharedKernel/Domain/BaseEntity.cs` | Audit fields, soft-delete | Yes: add `Version` column |
| `Supervisor/Configuration/SupervisorOptions.cs` | Server config | Yes: add sync policy path |
