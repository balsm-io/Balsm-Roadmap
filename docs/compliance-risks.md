# P001 Compliance Risk Register

| ID | Date | Description | Severity | Mitigation | Status |
|---|---|---|---|---|---|
| RR-001 | 2026-06-16 | **UAE DOB residency gap**: `date_of_birth_ciphertext` encrypted with EU-region key does not migrate when user changes country to UAE. EG-signed-up user in UAE retains EU-resident encrypted DOB, deviating from FR-049 literal reading. | MEDIUM | (i) Risk-register entry; (ii) disclosed in UAE Apple/Google data-safety filing; (iii) revisit in P002 with cross-region re-key migration | Open — P002 |
| RR-002 | 2026-06-17 | **Manual recovery phishing surface**: support-staff-issued recovery tokens create a social-engineering attack surface. Adversary could impersonate user to support, pass 2-of-4 verification, gain account access. | MEDIUM | Verification floor = 2-of-4 facts; max 3 attempts/6mo; 30-day cooling-off quarantine on old email; recovery link expires in 24h; audit log per FR-046e | Open — monitor |
| RR-003 | 2026-07-17 | **FR-049 UAE residency routing descoped in P001**: the per-country residency routing (UAE-resident DB for `country_code='AE'`) existed only in the removed Supabase `auth-gate` Edge Function; the .NET backend runs a single EU-region PostgreSQL with no regional routing. All UAE users' non-PHI rows (and the DOB ciphertext) are EU-resident, deviating from FR-049 / UAE Federal Law 2/2019. Broader than RR-001 (which is only the change-country case). | MEDIUM | (i) Risk-register entry; (ii) disclose EU residency in UAE data-safety filings; (iii) P002 residency router (per-region Npgsql connection + signup routing) | Open — P002 |
| RR-004 | 2026-07-17 | **Residual user-cloud backup blobs outlive deleted accounts**: account deletion purges cloud rows and wipes the on-device DB, but the user-owned iCloud/Drive encrypted backup blob is not deleted server-side (it's the user's data). Stale encrypted PHI blobs can persist after account erasure until the client-side `BackupAdapter.delete` runs on the deleting device. | LOW | (i) Client wipes + calls `BackupAdapter.delete` on deletion confirm; (ii) FR-031 deletion screen guides manual removal of any orphaned blob; (iii) blobs are AES-256-GCM ciphertext the recovery code is needed to open | Open — monitor |

---

*Last updated: 2026-07-17*  
*Owner: Eng Lead + Compliance Lead*
