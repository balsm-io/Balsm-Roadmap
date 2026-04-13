# Clinical Decision Support System Review

Review changed files implementing CDSS or AI-powered clinical features for governance compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches clinical decision support, diagnostic suggestions, treatment recommendations, or any AI-assisted clinical feature.
3. Analyze for the following:

### Human-in-the-Loop (Mandatory)
- AI suggestion applied to patient record without explicit doctor accept/modify/reject step
- AI-generated clinical content (summaries, reports, recommendations) finalized without human review
- Missing UI for the doctor to override, dismiss, or report incorrect AI output
- AI workflow proceeding automatically after suggestion without waiting for human action
- Automated clinical actions triggered by AI output without human confirmation

### AI Labeling & Visibility
- AI-generated suggestions not visually distinct from human-entered data
- Missing "AI-assisted" label on AI-generated content
- AI suggestions appearing as default selections in clinical forms (must require active action to adopt)
- AI contributions not distinguishable in the patient record timeline
- AI-generated summaries or notes blending with doctor-written notes without clear attribution

### Confidence & Explainability
- Clinical AI outputs missing confidence scores
- No reasoning or contributing factors provided with AI suggestions (e.g., "flagged due to elevated lab values and family history")
- Black-box model used for clinical decision support without any explainability mechanism
- Confidence thresholds not configurable by entity administrators
- Low-confidence suggestions not visually de-emphasized or flagged

### Scope & Safety Boundaries
- AI overriding rule-based prescription validation (drug interactions, allergy checks, dosage limits)
- AI with direct write access to patient records (only authorized clinical users can write)
- AI autonomously prescribing medications
- AI autonomously altering diagnosis codes or clinical entries
- AI autonomously triaging emergency situations (must always route to human responders)
- AI autonomously communicating with patients without provider review

### Data Access
- CDSS accessing patient data beyond the invoking doctor's authorization scope
- CDSS aggregating data across entities or tenants without authorization
- Patient data sent to external AI services in identifiable form
- Missing audit logging for data sent to AI services
- AI context retaining data from previous sessions or patients (context bleeding)

### Audit & Accountability
- AI suggestions not recorded in the audit trail
- Audit log missing: which model produced the suggestion, which user accepted/rejected it
- No incident reporting mechanism for incorrect or harmful AI suggestions
- Accountability for clinical decisions attributed to AI instead of the human provider
- Missing model version tracking in audit records

### Kill Switch
- No mechanism to disable the CDSS feature independently
- Disabling CDSS affects core platform operations (must not)
- No rollback mechanism to a previous model version
- No alerting mechanism when AI outputs are flagged as harmful or unreliable

### Patient-Facing Output
- AI health recommendations shown to patients without prior provider review and approval
- Patient-facing AI content missing disclaimer: "This does not replace professional medical advice"
- AI-powered symptom checker or triage tool operating without human oversight

4. For each issue found, report:
   - File path and line number
   - AI_GOVERNANCE.md section violated
   - Severity: CRITICAL (patient safety) / HIGH / MEDIUM
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes CDSS review.
