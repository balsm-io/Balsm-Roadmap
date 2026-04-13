# Clinical Record Audit Review

Review changed files touching patient records for audit trail, data protection, and integrity compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches patient records, clinical entries, or medical data.
3. Analyze for the following:

### Immutable Audit Trail
- Patient record created or modified without generating an audit log entry
- Audit log entry missing required fields:
  - Previous value (before the change)
  - New value (after the change)
  - User ID who made the change
  - Timestamp of the change
  - Correlation ID for tracing
  - Action type (create, update, delete, view)
- Audit records that can be updated or deleted (must be append-only/immutable)
- Bulk operations that skip per-record audit logging
- Record access (reads) on sensitive data not logged

### Soft-Delete Enforcement
- Hard-delete (`DELETE FROM` or `.Remove()`) used on clinical or patient data
- Missing soft-delete flag (`IsDeleted`, `DeletedAt`) on clinical entities
- Soft-deleted records not filtered from default queries
- Soft-deleted records still accessible without proper authorization check
- Cascading hard-deletes triggered by parent entity removal

### Field-Level Encryption
- Sensitive fields stored in plaintext:
  - Diagnoses and clinical notes
  - Medications and prescriptions
  - Test results (lab, radiology, pathology)
  - Mental health notes
  - Substance abuse records
  - HIV/STI status
  - Genetic test results
- Encryption/decryption not transparent to the application layer
- Encryption keys hardcoded or stored alongside encrypted data

### PHI Exposure
- Patient health information in log statements (must log only record IDs)
- PHI included in error messages or exception details
- PHI in API response error payloads
- PHI in cached data keys or values
- Patient data in debug output, console logs, or development helpers
- Real patient data in test fixtures or seed data

### ACID Compliance
- Multiple record updates not wrapped in a single transaction
- Missing rollback on partial failure during multi-record operations
- Read-after-write consistency not guaranteed for critical clinical flows

### Concurrency
- Patient records updated without optimistic concurrency control
- Missing concurrency tokens (RowVersion/ETag) on clinical entities
- Concurrent edits silently overwritten without conflict detection

### Consent Verification
- Patient record accessed without checking active consent status
- Data shared across providers without verifying patient consent
- Consent status changes not reflected in real-time access control

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: AUDIT_TRAIL / SOFT_DELETE / ENCRYPTION / PHI / ACID / CONCURRENCY / CONSENT
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes clinical record audit review.
