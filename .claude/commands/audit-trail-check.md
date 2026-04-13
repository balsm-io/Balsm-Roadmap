# Audit Trail Check

Review changed files for audit trail completeness on sensitive operations.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches patient records, clinical data, financial operations, administrative changes, or AI operations.
3. Analyze for the following:

### Patient Record Modifications
- Create, update, or delete operations on patient records missing audit log entry
- Audit entry missing required fields:
  - Previous value (snapshot before change)
  - New value (snapshot after change)
  - User ID who performed the action
  - Timestamp (UTC)
  - Action type (create, update, soft-delete, restore, view)
  - Correlation ID for request tracing
  - Module/bounded context where the action occurred
- Audit records that can be modified or deleted (must be append-only/immutable)
- Bulk operations skipping individual record audit entries

### Clinical Operations
- Prescription creation, modification, dispensation without audit entry
- Lab order placement, specimen processing, result verification without audit trail
- Radiology order and report lifecycle events not audited
- Clinical note creation or amendment without audit record
- Consent grant, modification, or revocation not audited
- Care team membership changes not logged
- Referral creation and status changes not tracked

### AI Operations
- AI suggestions not recorded: which model, what was suggested, who accepted/rejected
- Data sent to external AI services not logged
- AI chat conversations not included in the audit trail (what was asked, what was returned, by which user)
- AI feature enable/disable actions by admin not logged
- AI model version changes not recorded

### Financial Operations
- Payment processing without audit trail
- Billing code changes without audit entry
- Insurance claim submissions not logged
- Financial transaction modifications without recording the modifier and reason

### Administrative Operations
- Permission changes (grant/revoke) not audited
- Entity sharing settings changes not logged (who changed what, when)
- User account creation, deactivation, role changes not tracked
- System configuration changes not audited
- Security alert overrides not documented with reason and user

### Sensitive Data Access
- Read access to certain sensitive records not logged:
  - Mental health records
  - Substance abuse records
  - HIV/STI status
  - Records of public figures or employees
  - Records accessed during emergency override
- "Break the glass" access not logged with justification

### Structured Logging Compliance
- Audit log entries using string interpolation instead of structured logging (key-value pairs)
- Missing structured log fields: CorrelationId, UserId, Action, Module
- Log levels misused (e.g., audit events logged as Debug instead of Information)

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: PATIENT_RECORD / CLINICAL / AI / FINANCIAL / ADMIN / ACCESS / LOGGING
   - What operation is missing an audit trail
   - Suggested fix

5. If no issues are found, confirm the code passes audit trail review.
