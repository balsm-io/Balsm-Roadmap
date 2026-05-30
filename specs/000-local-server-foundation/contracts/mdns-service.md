# Contract: mDNS Service Advertisement (FR-008)

## Service type

```
_balsm._tcp.local.
```

## Instance name

Two distinct lifecycles:

| State | Instance name | Trigger |
|---|---|---|
| Pre-setup (no workspace yet) | `balsm-setup-<short-server-id>._balsm._tcp.local.` | Server reached ready state but first-run wizard not complete |
| Post-setup | `balsm-<workspace-slug>._balsm._tcp.local.` | First-run wizard committed; workspace slug exists |

`<short-server-id>` is the first 8 hex chars of the server instance UUID, stable across restarts.

Clients MUST treat both instance prefixes as Balsm servers.

## Port

The instance is advertised at the server's configured bind port (`server_config.bind_port`, default `8443`).

## TXT record fields

Each is a key=value pair. Keys are lowercase.

| Key | Required | Example | Meaning |
|---|---|---|---|
| `v` | Yes | `v=1` | Protocol version of this advertisement schema |
| `srv_id` | Yes | `srv_id=a1b2c3d4e5f6…` | Stable server UUID |
| `app_ver` | Yes | `app_ver=0.5.0` | Server application version |
| `mode` | Yes | `mode=Network` | Operating mode — never broadcast in `Standalone` (whole record is suppressed) |
| `ws_name` | When post-setup | `ws_name=My%20Pharmacy` | URL-encoded workspace display name |
| `wizard` | When pre-setup | `wizard=required` | Hints client to route to first-run wizard |
| `cert_sha256` | Yes | `cert_sha256=<base64-url>` | SHA-256 fingerprint of the serving TLS cert, base64-url-encoded; clients pin trust against this on first connection |

## Visibility timing

Per FR-008, broadcast MUST be observable by a same-LAN listener within **5 seconds** of the server reaching ready state.

## Standalone mode

In `Standalone`, the responder MUST NOT register the service and MUST stop any prior registration if the mode is switched to Standalone at runtime.

## Re-broadcast on hostname change

If the OS hostname changes (US3 AS#3), the responder MUST re-announce the service with the updated `A`/`AAAA` records within 10 seconds.

## Conflict resolution (two servers on the same LAN)

mDNS conflict resolution suffix `_<n>` MAY be appended automatically by the responder library; clients display both instances as separate choices (Edge Case in spec line 142).
