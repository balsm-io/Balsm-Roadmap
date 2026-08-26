# Community — Bounded Context (PROVISIONAL)

> ⚠️ **Provisional** — candidate context, not canonical. Confirm or dissolve when the P021 spec is written. Modules must not map here yet.

| | |
|---|---|
| **Plane** | Platform |
| **Classification (proposed)** | Supporting |
| **Phases** | P021 |
| **PHI posture** | High sensitivity: peer matching implies health-condition knowledge; strict anonymization + consent. |

## Purpose (proposed)

Patient-to-patient peer support: matching by condition, disclaimers, and content moderation (HR-04 liability controls). Kept out of Messaging & Notifications because matching/moderation is a domain model, not a transport concern.

## Candidate aggregates

`PeerMatch` (condition-based, consented), `SupportGroup`, `ModerationCase` (flag → review → action, immutable log), `Disclaimer` acceptance.

## Dissolution alternative

If P021 scoping shrinks peer support to simple moderated chat, fold matching into Personal Health (self-reported conditions as matching input) and ride Messaging's `Conversation` — then delete this file.
