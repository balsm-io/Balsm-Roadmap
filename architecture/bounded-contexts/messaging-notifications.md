# Messaging & Notifications — Bounded Context

| | |
|---|---|
| **Plane** | Cross-plane |
| **Classification** | Generic — standard channel patterns; buy/wrap (FCM, APNs, SMS, WhatsApp gateway) |
| **Phases** | P011 onward (appointment notifications); consumer local notifications from P001 |
| **Repo mapping** | thin .NET module + provider adapters; Flutter local-notification scheduler in `core` |
| **PHI posture** | **No PHI over third-party messaging channels** (constitution Principle XIV). Notification content is minimal + reference-based. |

## Purpose

Every context's outbound human communication, behind one door: notifications (push/local/SMS), conversations, announcements. Contexts emit `NotificationRequested`; this context owns channel selection, delivery, retries, and preferences. Nobody else talks to FCM/APNs/Twilio/OpenWA directly.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Notification | A single outbound message to a user on a channel |
| Announcement | Broadcast content to a cohort |
| Conversation | A threaded message exchange (in-app) |
| Channel | Delivery mechanism: local (offline-capable), push, SMS, WhatsApp gateway |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Notification` | recipient, template ref, channel, state | PHI-free payloads: identifiers + deep links, never clinical content |
| `Conversation` / `Message` | participants, thread | — |
| `Announcement` | cohort, content, schedule | — |

## Integration Events

**Consumed:** `NotificationRequested` from all contexts (booking confirmations, reminders, cancellations, panic alerts, deletion notices…).

**Published:** `NotificationDelivered` / `NotificationFailed`.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| All contexts | downstream | C-S | One inbound contract (`NotificationRequested`); requesters never choose transports |
| FCM / APNs / SMS / OpenWA WhatsApp gateway | downstream of external | **ACL** | Provider SDKs wrapped; HMAC-verified webhooks per Principle XIV |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P001 | Local-notification plumbing for offline medication reminders (scheduling logic = Personal Health) |
| P011 | Appointment notifications: booking confirmation, configurable reminder, cancellation |
| P017 | Panic-value physician alerts; house-visit status notifications (delivery channel) |
| P021 | Peer-support conversation transport (matching/moderation = provisional Community context) |

Modules: thin .NET module + provider adapters (planned P011); Flutter scheduler plumbing in `core`.

## Boundary Notes

- Consumer medication reminders (P001) fire as *local* notifications with no server — the scheduling logic is Personal Health's; the notification permission/scheduler plumbing is shared client infrastructure.
- Peer-support chat (P021) would ride `Conversation` transport; matching/moderation is the provisional Community context.
