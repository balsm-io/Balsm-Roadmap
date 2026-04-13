# AI Governance Check

Review changed files for compliance with Balsm AI governance rules (AI_GOVERNANCE.md).

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches AI-related features and analyze for the following:

### Decision Support Only (Section 2.1)
- AI autonomously making clinical decisions, prescribing medications, or altering patient records
- AI-generated suggestions NOT clearly labeled as "AI-assisted"
- AI suggestions appearing as default selections in clinical forms (must require active action to adopt)
- Missing explicit accept/modify/reject step for AI suggestions before they enter the patient record

### Scope Boundaries (Section 2.2)
- AI overriding prescription validation rules (drug interactions, allergy checks, dosage limits)
- AI with direct write access to patient records (only authorized clinical users may write)
- AI autonomously communicating with patients without provider review

### Clinical Validation (Section 2.3)
- Clinical AI outputs missing confidence scores
- Black-box models used for clinical decision support without explainability
- AI models deployed without validation documentation

### Data Privacy (Section 3)
- Patient data used for AI training without explicit, separate opt-in consent
- AI features accessing data beyond the invoking user's authorization scope
- Patient data sent to external AI services in identifiable form
- External AI service usage not disclosed to entity administrators
- Missing audit logging for data sent to external AI services

### AI Chat Security (Section 3.4)
- AI chat conversations containing PHI not encrypted at rest
- AI chat not respecting RBAC and data access boundaries
- AI chat sessions not terminated on logout/session expiry
- Missing rate limiting on AI chat endpoints
- AI responses not sanitized for injection (scripts, links, executable content)
- Sensitive data (passwords, payment details, IDs) not redacted from chat storage

### Data Leakage Prevention (Section 3.5)
- Data leaking between users/sessions/tenants through cached context or shared model state
- Prompts containing unnecessary context (must send minimum data required)
- Previous conversation context influencing current session responses
- AI responses returning raw database content or infrastructure details

### Transparency (Section 4)
- Users not informed they are interacting with AI-generated content
- AI-driven decisions not auditable
- Missing reasoning/contributing factors on clinical AI suggestions

### Human Oversight (Section 5)
- Clinical AI workflows missing mandatory human approval step
- AI-generated content finalized without human review
- Missing mechanism to override, dismiss, or report incorrect AI outputs
- AI actions not attributed in audit logs (must record: AI origin, model used, user who accepted/rejected)

### Kill Switch (Section 5.3)
- No mechanism to disable the AI feature independently without affecting core operations
- AI feature cannot be deactivated across instances in case of harmful outputs

### Patient-Facing AI (Section 8)
- AI health recommendations shown to patients without provider review
- AI used for autonomous emergency triage
- Patient-facing AI content missing disclaimer about not replacing medical advice

3. For each issue found, report:
   - File path and line number
   - AI_GOVERNANCE.md section violated
   - Severity: CRITICAL / HIGH / MEDIUM
   - Description
   - Suggested fix

4. If no issues are found, confirm the code passes AI governance review.
