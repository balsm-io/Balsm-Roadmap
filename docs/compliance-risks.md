# P001 Compliance Risk Register

| ID | Date | Description | Severity | Mitigation | Status |
|---|---|---|---|---|---|
| RR-001 | 2026-06-16 | **UAE DOB residency gap**: `date_of_birth_ciphertext` encrypted with EU-region key does not migrate when user changes country to UAE. EG-signed-up user in UAE retains EU-resident encrypted DOB, deviating from FR-049 literal reading. | MEDIUM | (i) Risk-register entry; (ii) disclosed in UAE Apple/Google data-safety filing; (iii) revisit in P002 with cross-region re-key migration | Open — P002 |
| RR-002 | 2026-06-17 | **Manual recovery phishing surface**: support-staff-issued recovery tokens create a social-engineering attack surface. Adversary could impersonate user to support, pass 2-of-4 verification, gain account access. | MEDIUM | Verification floor = 2-of-4 facts; max 3 attempts/6mo; 30-day cooling-off quarantine on old email; recovery link expires in 24h; audit log per FR-046e | Open — monitor |

---

*Last updated: 2026-06-17*  
*Owner: Eng Lead + Compliance Lead*
