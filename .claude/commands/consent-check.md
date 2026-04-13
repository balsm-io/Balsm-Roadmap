# Consent Check

Review changed files for patient consent enforcement and data sharing compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches data sharing, cross-entity communication, AI data usage, or patient data access.
3. Analyze for the following:

### Data Sharing Without Consent
- Patient data shared across entities/providers without consent verification
- Referral data sent without checking patient consent for the specific data categories
- Lab results, imaging, or clinical records shared without active consent
- Patient data crossing entity boundaries without dual consent (entity admin + patient)
- Patient data included in analytics or reports without consent check
- Data sharing operations missing consent status query before execution

### AI Data Consent
- Patient data used for AI model training without explicit, separate opt-in consent
- AI data consent bundled with general terms of service (must be a distinct opt-in)
- Missing mechanism for patients to withdraw AI data consent
- Patient data not excluded from future training cycles after consent withdrawal
- AI chat conversations used as training data without consent from all parties

### Consent Lifecycle
- Missing consent versioning (patients must consent to the current version)
- Expired consent treated as valid (consent must have validity periods)
- Consent withdrawal not propagated to all systems that hold the data
- Missing audit trail for consent grant/revocation (who, when, what scope)
- Consent status changes not triggering immediate access control updates

### Granular Consent
- All-or-nothing consent model instead of per-category consent:
  - Clinical records
  - Lab results
  - Imaging results
  - Prescriptions
  - Mental health records
  - Substance abuse records
  - HIV/STI status
  - Genetic data
  - Research participation
  - AI data usage
- Missing per-provider consent (patient may consent to share with Provider A but not Provider B)
- Missing per-purpose consent (treatment vs. research vs. billing)

### Patient Rights
- No mechanism for patients to view their current consent settings
- No mechanism for patients to export their consent history
- No mechanism for patients to request deletion of data shared under revoked consent
- AI chat history not viewable/exportable/deletable by the patient

### Disclosure
- Patients not informed when AI was involved in their care
- Missing disclosure in patient records when AI assisted in clinical decisions
- External AI service providers not disclosed to entity administrators

### Emergency Override
- No documented emergency override process for accessing records without consent
- Emergency overrides not logged with justification and automatic review trigger

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: DATA_SHARING / AI_CONSENT / LIFECYCLE / GRANULAR / PATIENT_RIGHTS / DISCLOSURE / EMERGENCY
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes consent review.
