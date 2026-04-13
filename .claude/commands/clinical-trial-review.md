# Clinical Trial Review

Review changed files touching clinical research, trial matching, or data export for research compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches clinical trials, research data, anonymized exports, or patient recruitment.
3. Analyze for the following:

### Research Consent
- Patient data queried for research purposes without explicit research-specific consent
- Research consent bundled with treatment consent (must be separate)
- Missing mechanism for patients to withdraw research consent
- Patient data not excluded from research datasets after consent withdrawal
- Consent for AI data usage not separate from research consent (three distinct consent types: treatment, research, AI training)

### Data De-Identification & Anonymization
- Exported research datasets containing identifiable patient information:
  - Full names
  - Dates of birth (only year or age range allowed)
  - Addresses (only region/city allowed)
  - Phone numbers, email addresses
  - National ID numbers, passport numbers
  - Medical record numbers (must use study-specific pseudonyms)
  - Photos or biometric data
  - Any combination of quasi-identifiers that could re-identify (age + gender + rare diagnosis + ZIP code)
- De-identification not following HIPAA Safe Harbor or Expert Determination method
- Anonymization applied at export time but original linked data accessible through the export system
- Missing k-anonymity or similar re-identification risk assessment on exported datasets

### Research Data Repository
- Research datasets stored alongside clinical production data without access boundary
- Research data access not restricted to authorized research personnel only
- Missing audit trail for research dataset access and downloads
- Research datasets not versioned (reproducibility requirement)
- Missing data provenance tracking (which patients contributed, under which consent version)

### Clinical Trial Matching
- Trial matching algorithm accessing patient data beyond what the patient consented to share for research
- Trial eligibility criteria matching using identifiable data sent to external systems
- Matched patients contacted without provider intermediary (provider must review and approve contact)
- Trial matching results stored in a way that links patient identity to trial interest (must be pseudonymized)

### Regulatory Compliance
- Research data exports not formatted per regulatory requirements (CDISC, SDTM)
- Missing IRB/Ethics committee approval tracking for research activities
- Research activities proceeding without documented ethics approval
- Missing adverse event reporting integration between clinical and research systems

### Data Sharing Agreements
- Research data shared with external institutions without a data sharing agreement on file
- Data sharing agreement terms not enforced programmatically (e.g., usage limits, retention periods)
- Missing tracking of which external institutions hold exported research data

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: CONSENT / DE_IDENTIFICATION / REPOSITORY / TRIAL_MATCHING / REGULATORY / DATA_SHARING
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes clinical trial review.
