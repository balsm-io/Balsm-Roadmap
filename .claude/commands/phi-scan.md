# PHI Scan

Deep scan of changed files for Protected Health Information exposure risks.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file thoroughly and analyze for the following PHI exposure categories:

### Logging & Debug Output
- Patient names, addresses, phone numbers, email addresses in log statements
- Clinical content (diagnoses, medications, test results, clinical notes) in logs
- Full request/response bodies logged that may contain patient data
- Patient data in `Console.WriteLine`, `print()`, `debugPrint()`, or similar debug output
- PHI in structured log message templates (even templated, the data is stored)
- Log statements containing exception messages that may include patient data from validation

### Error Messages & Responses
- API error responses including patient data in error details
- Exception messages containing clinical content or patient identifiers (beyond record IDs)
- Stack traces exposing patient data from method parameters or local variables
- Validation error messages that echo back sensitive input

### AI & External Services
- Patient data sent to external AI services in identifiable form
- AI prompts containing PHI without de-identification
- Prompts containing unnecessary patient context (must send minimum data required)
- External API calls including patient data without encryption
- Webhook payloads containing PHI

### Caching & Session
- PHI stored in cache (in-memory, distributed, or browser cache)
- Cache keys containing patient identifiers that could be enumerated
- Session data containing clinical information that persists after logout
- AI conversation context not cleared between sessions or users
- Patient data in browser local storage or cookies

### Code Artifacts
- Real patient data in test fixtures, seed data, or mock data
- PHI in code comments, TODO notes, or documentation
- Patient data in commit messages or PR descriptions
- Production data samples in configuration files
- Screenshot or log file artifacts containing patient data

### AI Chat Specific
- AI chat storing sensitive data: passwords, payment details, national IDs (must be detected and redacted)
- AI chat history not encrypted at rest
- AI chat conversations persisting after session expiry
- AI responses containing raw database content or internal system details
- AI chat data accessible across tenant boundaries

### Data in Transit
- PHI transmitted without TLS/encryption
- Patient data in URL query parameters (visible in logs, browser history, referrer headers)
- PHI in email or notification content without encryption
- Unencrypted PHI in message queue payloads

### Field-Level Check
- These fields must be encrypted at rest:
  - Diagnoses and clinical notes
  - Medications and prescriptions
  - Lab test results
  - Radiology reports and findings
  - Mental health records
  - Substance abuse records
  - HIV/STI status
  - Genetic test results
  - Social Security / National ID numbers

3. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL (direct PHI exposure) / HIGH (potential exposure) / MEDIUM (indirect risk)
   - Category: LOGGING / ERROR / AI / CACHE / ARTIFACT / CHAT / TRANSIT / ENCRYPTION
   - The offending code
   - Suggested fix

4. If no issues are found, confirm the code passes PHI scan.
