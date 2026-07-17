# Contract: mDNS Service Advertisement (FR-008)

Implemented by `Balsm.Supervisor.Services.MdnsService` (already exists) using `Makaretu.Dns.Multicast 0.27.0` (pinned in `Directory.Packages.props`). This contract documents the wire-level expectations the implementation must continue to satisfy.

## Service type

```
_balsm._tcp.local.
```

## Instance name

Two lifecycle states:

| State | Instance name | Trigger |
|---|---|---|
| Pre-setup (no workspace yet) | `balsm-setup-<short-server-id>._balsm._tcp.local.` | Server reached ready state but `AdminAuthService.IsSetupCompleteAsync` returns false |
| Post-setup | `balsm-<workspace-slug>._balsm._tcp.local.` | Workspace row committed and `Workspace.Slug` is available |

`<short-server-id>` is the first 8 hex chars of the server instance UUID stored in `Balsm.Supervisor.Configuration.SupervisorOptions.ServerInstanceId` (stable across restarts).

Clients MUST treat both instance prefixes as Balsm servers.

## A-record responder

`MdnsService` already registers a `QueryReceived` handler that resolves `<MdnsHostname>.local` (default `balsm.local`) to the host's primary LAN IPv4 / IPv6. Keep this handler unchanged.

## Port

The instance is advertised at the server's configured bind port — by default `5051` (HTTPS) per `ServerConfig.bind_https_port`. The TXT record carries the HTTP port for discovery only; the HTTP `:5050` listener serves ONLY `307 → HTTPS` redirects plus `/api/v1/health`. Clients MUST NOT send credentials, auth, or any `/admin` API call over plain HTTP — there is no cleartext fallback for the API surface.

## TXT record fields

| Key | Required | Example | Meaning |
|---|---|---|---|
| `v` | Yes | `v=1` | Protocol version of this advertisement schema |
| `srv_id` | Yes | `srv_id=a1b2c3d4e5f6…` | Stable server UUID |
| `app_ver` | Yes | `app_ver=0.5.0` | Server application version (from `VersionController`) |
| `mode` | Yes | `mode=Network` | Operating mode — when `Standalone`, the responder MUST NOT register the service at all |
| `ws_name` | Post-setup | `ws_name=My%20Pharmacy` | URL-encoded workspace display name |
| `wizard` | Pre-setup | `wizard=required` | Hints client to route to first-run wizard |
| `http_port` | Yes | `http_port=5050` | Redirect-only HTTP port (`307 → HTTPS` + `/api/v1/health`); NOT for API/credential traffic |
| `https_port` | Yes | `https_port=5051` | HTTPS port |
| `cert_sha256` | Yes | `cert_sha256=<base64url>` | SHA-256 fingerprint of the serving TLS cert (from `CertificateService.GetFingerprint()`). **Hint only** — mDNS is unauthenticated and spoofable, so a client MUST confirm this fingerprint out-of-band (admin panel / tray / installer output) before pinning, and MUST hard-fail on a later pin change rather than silently re-learn it (defeats a rogue `_balsm._tcp` advertiser MITM). |

## Visibility timing

Per FR-008, broadcast MUST be observable by a same-LAN listener within **5 seconds** of the server reaching ready state.

## Standalone mode

In `Standalone`, `MdnsService.ExecuteAsync` MUST short-circuit (the existing `EnableMdns` flag already does this for static configuration; FR-013 mode switch triggers an in-process service-manager restart per R4, so `MdnsService` simply reads the new `mode` value on next start and does not register).

## Re-broadcast on hostname change

If the OS hostname changes (US3 AS#3), the responder MUST re-announce the service with the updated `A`/`AAAA` records within 10 seconds. `Makaretu.Dns` does not auto-detect this; `NetworkDiscoveryService` MUST subscribe to `NetworkChange.NetworkAddressChanged` and trigger `MdnsService.Restart()`.

## Conflict resolution (two servers on the same LAN)

`Makaretu.Dns` appends `_<n>` to the instance name when a conflict is detected. Clients display both instances as separate choices (spec Edge Case line 142).
