# Healthcare Threat Library

A starting catalog of threats commonly relevant to healthcare and regulated systems, organised by STRIDE. Treat this as a checklist to **trigger thinking**, not as content to copy into the output verbatim. Every threat in your final document should be re-grounded in the specific system you're modelling — generic threats are low value.

> **Table of contents**
>
> - [Spoofing (S)](#spoofing-s)
> - [Tampering (T)](#tampering-t)
> - [Repudiation (R)](#repudiation-r)
> - [Information Disclosure (I)](#information-disclosure-i)
> - [Denial of Service (D)](#denial-of-service-d)
> - [Elevation of Privilege (E)](#elevation-of-privilege-e)

***

## Spoofing (S)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Credential stuffing / password brute force | Reused/leaked passwords replayed against the auth endpoint | bcrypt cost ≥ 12, per-account/per-IP throttle, breached-password screen, MFA mandatory for clinical/financial roles, constant-time response |
| Stolen token / device impersonation | Refresh token or device-id exfiltrated from device storage and replayed | Refresh-token rotation on every use, server-side invalidation, device registry, secure-enclave-bound device keys, expiring offline-cached creds |
| Invite-code brute force | Short/low-entropy invite codes guessed or enumerated | ≥ 40 bits entropy, single-use, 24h expiry, per-IP rate limit, role bound at code creation (not redemption) |
| Rogue server on local network | Attacker advertises mDNS/SSDP/etc as the legitimate server, harvests credentials | Cert-fingerprint pinning at first connect, HTTPS for non-loopback, signed nonce in enrolment QR |
| Patient-identity / unclaimed-profile fraud | Attacker enumerates phone or national ID, claims unclaimed profile | 2-of-N verification (ID + DOB, OTP, in-person), no auto-link on search, claim-attempt rate limiting + audit |
| Prescription QR forgery | Attacker generates a QR that mimics the digital format | Ed25519/ECDSA signature on QR, dispenser verifies signature + lifecycle state, key-bundle refresh ≥ 24h |
| Telemedicine cross-border licensing fraud | Doctor without licence in patient's jurisdiction issues prescription | Jurisdiction recorded at credential upload, verified against MOH/SFDA registers, blocked at issuance not at dispense |
| Federation peer impersonation | Compromised peer joins the federation graph | mTLS with platform-issued certs, dual-side admin approval, peer fingerprint on every federated record |
| SAML / OIDC assertion forgery | Forged assertion accepted by SP due to weak signature validation | Strict signature validation, audience/issuer checks, key pinning, token-replay protection |

## Tampering (T)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Local DB file tampering | Filesystem access to the local server / device modifies SQLite directly | SQLCipher (or equivalent) with OS-keystore-wrapped key, per-row HMAC for critical fields, FS perms |
| Sync outbox / inbox poisoning | Forged or replayed sync records injected into a peer's queue | Origin signatures on every record, idempotency keys (UUIDv7 + sequence), reject duplicates/out-of-order |
| Conflict-resolution clock abuse | Attacker forwards the system clock to win last-write-wins | Server-side `UpdatedAt`, ±5min skew bound, NTP-required, server-authoritative for clinical/financial |
| Clinical record ghost-edits | Late edit overwrites an immutable note | Append-only with addenda, original never overwritten, post-finalisation update rejected at framework layer |
| Prescription lifecycle bypass | Direct API call moves prescription back to `Issued` | State machine on server, allowed transitions enumerated, reverse transitions rejected, every transition audited |
| Controlled-substance inventory manipulation | Pharmacist edits stock to conceal diversion | `IsControlled` server-derived from schedule (not user-editable), pharmacist-role + reason + paper-Rx attached, daily reconciliation |
| Invoice / payment tampering | Line items altered post-payment for refund fraud | Append-only invoices, refunds as new linked docs, daily Z-reports hash-chained, gateway HMAC + nonce |
| Backup file tampering | Backup modified offline and used for restore | Encrypted backups with separate key, manifest hash-tree, restore is itself audited |
| HL7 / FHIR / DICOM tampering at integration boundary | Result attached to wrong patient or modified in transit | mTLS to LIS/PACS, payload signature where supported, Draft→Verified→Released enforced server-side, patient-binding hash check |
| Webhook tampering | Replayed/forged webhook from "gateway" sets policy/payment status | HMAC per-integration secret, nonce + ±5min timestamp, idempotent handlers |
| Configuration / deployment-mode tampering | Attacker switches deployment mode or rotates signing keys via direct edit | Mode change requires Owner + MFA + audit, KMS-managed signing keys, file-integrity monitoring |

## Repudiation (R)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Audit-log suppression / deletion | DB-level access deletes audit rows after malicious action | Append-only table, no UPDATE/DELETE in app layer, hash-chained rows, daily verifier, separate audited purge for retention |
| Clock manipulation to forge timestamps | Audit timestamps backdated | Server-side receipt time, NTP-synced, both client-claimed and server-receipt times recorded, mismatch flagged |
| Shared / generic accounts | Multiple staff use one login; controlled-substance dispense unattributable | Forbid shared logins for sensitive roles at user creation, concurrent-session detection, periodic admin review |
| Deniable offline actions | Action performed offline never reaches cloud — device wiped before sync | Local audit hash-chain even before sync, audit sync prioritised and non-skippable, "device returned without offload" logged |
| Cross-server attribution loss | Federated record arrives without verifiable origin | Origin signature on federated records, verification failure ⇒ quarantine, never silent merge |
| AI suggestion accept/reject log gaps | AI influenced a decision, accept/reject not recorded | Audit row for every AI suggestion: model ID, prompt hash, response hash, accept/reject/ignore, action taken |

## Information Disclosure (I)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Cross-tenant data leakage | Missing `WHERE EntityId = …` filter, mis-scoped cache | Repository injects tenant filter from auth context, raw dynamic SQL forbidden, RLS on cloud, CI test runs cross-tenant assertions |
| PHI in logs / error responses | Stack traces include patient name/ID, request body echoed | Logger deny-list (no entity payloads), error scrubber for ID/phone/email patterns, validation on log shipper |
| PII exposure via search / autocomplete | Phone/ID search returns full summary cards; autocomplete enumerates | Minimal-fields search results, ≥6-digit prefix for ID/phone, rate limit, opening full record creates audit row |
| Re-identification via small-N analytics | Aggregates exposed for groups small enough to reverse | k-anonymity threshold at query time, suppression below threshold, differential privacy where applicable |
| Backup / export leakage | Unencrypted backup on USB, FHIR export emailed | Encrypted backups with separate key, exports require permission + watermark + audit, second-admin approval beyond N records |
| PHI on lost / stolen mobile device | Encrypted-cache key extracted, jailbroken device reads DB | OS-secure-storage key, remote-revoke wipes cache on next launch, idle-lock, root/jailbreak detection |
| Public unauthenticated info disclosure | `/server-info` reveals workspace name, version, build hash | Strict allowlist of fields strictly required for pairing; everything else requires auth |
| LAN traffic eavesdropping | "Local-only HTTP" loophole; attacker on same WiFi captures Rx/POS/JWT | HTTPS for all non-loopback, TOFU pinning for self-signed, plain HTTP refused |
| Federation oversharing | Default sharing scope broader than admin understood | Default scope is `none`, per-class opt-in, dual consent for patient records, "what is shared with whom" dashboard |
| DICOM metadata PHI leakage | DICOM exported with patient name/DOB/accession in tags | DICOM PS3.15 Basic Confidentiality Profile applied on export, viewers respect redaction |
| Prescriber analytics anti-kickback exposure | Per-prescriber dashboards expose individuals below threshold | Suppression below jurisdiction-specific threshold (e.g., ≥50 Rx, ≥10 prescribers), no per-prescriber partner views |
| Cross-border data transfer without consent | PHI shipped to disallowed region (e.g., AI BYOK call) | Egress classification by data residency, BYOK key region tag, gateway refuses out-of-region |
| Marketplace / plugin out-of-scope reads | Add-on declared narrow scope but reads beyond | Permission-scoped API gateway (no direct DB), entity isolation enforced at gateway, declared permissions verified at every call |

## Denial of Service (D)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Account-lockout DoS | Attacker triggers 5-failed lockout for legitimate users | IP/device throttle (not just account), MFA recovery path, admin force-unlock |
| API resource exhaustion | Unbounded query, large upload, N+1 endpoint | Per-user/per-IP/per-entity rate limits, default pagination + LIMIT, upload caps with streaming, worker memory cap |
| Sync queue flooding | Compromised device pushes millions of records | Per-device batch caps, outbox monitoring, circuit breaker pauses non-clinical first, anomaly alert |
| SQLite WAL bloat / disk fill | Long read transaction prevents checkpoint; disk fills | Bounded read tx, periodic checkpoint, WAL/DB size monitoring, auto-checkpoint at threshold |
| Ransomware on local server | Endpoint malware encrypts SQLite + backups | Object-lock cloud backup ≥ 30 days, quarterly DR drills, read-only "view-mode" fallback on devices, OS hardening baseline |
| Cloud-outage cascade into local fallback | Cloud-issued token unverifiable offline; staff locked out | Local-only validation path identical to cloud, offline-cache lifetime ≥ 7 days, "cloud is down" runbook visible to admin |
| Webhook / integration retry storm | Misbehaving 3rd-party causes retry pile-up | Isolated worker pool, exp-backoff with jitter, dead-letter, per-integration circuit breaker |
| Patient-app public-endpoint abuse | Bots flood registration / appointment booking, exhaust SMS quota | CAPTCHA / Turnstile, per-phone SMS quota (≤5/day), per-entity cost cap with alert |

## Elevation of Privilege (E)

| Common threat | Typical attack vector | Typical mitigation pattern |
| --- | --- | --- |
| Permission-override misuse | Owner grants explicit permission overriding intended deny | Fixed precedence (Deny > Grant > Group > Default Deny), dangerous permissions require dual-control + audit, diff-preview on save |
| Permission-group escalation | User silently added to group with dangerous permissions | 24h notice on dangerous-group additions, explicit confirmation in admin UI, owner notification |
| Invite redemption privilege carry-over | Code created for "Cashier" used to claim "Pharmacist" | Role bound at creation, redemption cannot upgrade, escalation goes through grant flow |
| Stale access after offboarding | Revoked staff retains offline session | Server-side immediate invalidation on cloud, local revocation list ≤5min when online, ≤24h offline grace, ghost-session sweep |
| OAuth scope escalation | Public-API client requests broader scope mid-flow | PKCE required, state validated, scopes narrowed at AS, consent shows scopes verbatim, refresh cannot widen |
| Marketplace add-on sandbox escape | Plugin reaches in-process state via reflection/deserialisation | Out-of-process gateway only (no in-process plugins), context derived from platform not plugin, signed releases + revocation |
| Federation trust escalation | Self-hosted instance gains write paths it shouldn't | Per-class, per-direction grants, no "issue on behalf" via federation, peer revoke purges trust within 1h |
| SQL / ORM bypass | Dynamic LINQ / raw SQL bypasses tenant scoping | Forbidden in tenant-scoped contexts unless via repository, parameterised queries, static analysis in CI, fuzzed query tests |
| Service-to-service mTLS misconfig | Skipped peer-cert verification; attacker impersonates peer | mTLS required, CI asserts disabling verification fails build, short-lived certs (≤24h), automated rotation |
| Patient-app horizontal escalation | Patient A reads/writes Patient B by tweaking parameter | Endpoint scopes by authenticated patient ID, IDOR test in CI, family-linkage requires 2-way consent |
| Server-side request forgery (SSRF) | Webhook / fetch URL points to internal service | Egress allowlist, deny RFC1918/cloud-metadata addresses, SSRF-aware HTTP client |
