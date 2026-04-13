# Data Integrity Check

Review changed files for data integrity issues in the Balsm healthcare platform.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file and analyze for the following:

### ACID Compliance
- Clinical data operations not wrapped in transactions
- Multiple database writes without transactional guarantee
- Long-running transactions that could cause lock contention
- Missing rollback handling on transaction failure

### Concurrency Control
- Patient records updated without optimistic concurrency tokens (row version / ETag)
- Silent overwrites: concurrent edits merged without conflict detection
- Missing `ConcurrencyStamp` or `RowVersion` on entities that support concurrent editing
- Appointment slots or bed assignments without proper locking/reservation

### Medical Coding Validation
- Medical data accepted without validation against coding standards:
  - ICD-10 for diagnoses
  - CPT / HCPCS for procedures
  - LOINC for lab test codes
  - RxNorm for medications
  - SNOMED CT for clinical terms
- Hardcoded medical codes instead of validated lookups
- Free-text fields used where coded values are required

### Referential Integrity
- Orphaned records: child records created without valid parent references
- Broken foreign key relationships after delete operations
- Cascade behaviors not properly configured
- Hard-delete operations on clinical data (must be soft-delete)

### Migration Safety
- Migrations missing `Down()` method (must be reversible)
- Non-descriptive migration names (must follow `Add{Feature}_{Entity}Table` pattern)
- Data-destructive migrations without data preservation step
- Schema changes that break existing data

### File Upload Integrity
- Missing file type validation
- Missing file size limits
- Missing content integrity checks (hash verification)
- Files stored without proper metadata and audit trail

### Audit Trail
- Patient record modifications missing immutable audit log entries
- Audit entries missing required fields: previous value, new value, user, timestamp
- Sensitive operations without audit log creation
- Audit records that can be modified or deleted (must be immutable)

3. For each issue found, report:
   - File path and line number
   - Category and severity (CRITICAL / HIGH / MEDIUM)
   - Description
   - Suggested fix

4. If no issues are found, confirm the code passes data integrity review.
