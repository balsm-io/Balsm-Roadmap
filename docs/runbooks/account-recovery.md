# Account Recovery Runbook (P001)

**Audience**: Support staff · **Classification**: Internal  
**Policy ref**: FR-046c/d/e · Q5 2026-06-17 resolution

---

## Verification floor

Support MUST confirm ≥ 2 of 4 facts before issuing a recovery token:

1. Email address on record
2. Full legal name (as entered during signup)
3. Country of registration
4. Date of birth (≥18 years old confirmed via age-gate)

**Hard limit**: max 3 recovery attempts per account per 6-month rolling window.

---

## Token-issuance procedure

1. Verify identity (≥2 of 4 facts above)
2. In admin panel → "Issue Recovery Token" → enter new email address + expiry (24h)
3. System signs JWT with `recovery_v1` claim and emails recovery link to new address
4. Link calls `account-recover-claim` Edge Function which:
   - Marks old email `quarantine_until = now() + 30 days`
   - Rekeys `date_of_birth_ciphertext` to new email's key derivation
   - Returns auth session for new email

---

## 30-day cooling-off communication template

> Subject: Your Balsm account recovery is complete
>
> Your account has been recovered to [NEW_EMAIL]. Your original email address will remain quarantined for 30 days as a security measure. During this period, neither address can be used to initiate another recovery.
>
> Important: your on-device health data (medications, health profile) was stored only on your previous device and cannot be restored through this process.
>
> If you did not request this recovery, contact us immediately at security@balsm.health.

---

## Audit log requirements (PDPL data-minimization)

- Log: recovery request timestamp, verification method count, new email hash (SHA-256), token expiry
- Do NOT log: old/new email plaintext, verification answers, DOB
- Retention: 2 years per PDPL right-to-access audit trail

---

## Risk register

- RR-002: Manual recovery bypasses social-engineering phishing risk — mitigated by 2-of-4 floor + 3 attempts/6mo cap
