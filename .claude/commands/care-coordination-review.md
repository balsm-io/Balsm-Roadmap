# Care Coordination Review

Review changed files touching referrals, care teams, MDT meetings, and care transitions for clinical workflow compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches referrals, care team management, MDT (multi-disciplinary team) meetings, care transitions, or discharge workflows.
3. Analyze for the following:

### Referral Completeness
- Referral records created without required clinical context:
  - Reason for referral
  - Relevant clinical history summary
  - Current medications
  - Known allergies
  - Recent lab/imaging results (if applicable)
  - Urgency level
- Referral sent to a provider/entity without consent verification
- Referral status not trackable by the originating provider (sent → received → accepted → scheduled → completed)
- Missing notification to referring provider when referral is acted upon

### Medication Reconciliation at Care Transitions
- Patient transferred between departments/providers without medication reconciliation step
- Admission medication list not compared against home medications
- Discharge medication list not reconciled with inpatient medications
- Missing documentation of discontinued, changed, or new medications at transition points
- Medication reconciliation step skippable in the transfer/discharge workflow

### MDT Meeting Compliance
- MDT meeting decisions not linked to the patient's clinical record
- Action items from MDT meetings without assigned responsible person and due date
- Missing attendance record for MDT meetings
- MDT decisions not producing actionable follow-up items in the system
- Case presentations for MDT not pulling relevant data from the patient record automatically

### Care Team Management
- Care team members accessing patient records outside their authorized scope
- Care team membership changes not reflected in real-time access control
- Missing role definition for care team members (primary, consultant, nurse coordinator, etc.)
- Care team communication channels not restricted to authorized team members
- Removed care team members retaining access to the patient record

### Discharge & Follow-Up
- Discharge without documenting follow-up plan
- Missing follow-up appointment scheduling or instructions at discharge
- Discharge summary not generated or reviewed before patient leaves
- Missing medication instruction delivery to patient at discharge
- Post-discharge follow-up tasks not tracked or reminded

### Consent & Data Sharing
- Clinical data shared with referred provider without verifying patient consent
- Referral data crossing entity boundaries without dual consent
- Care team data access not scoped to the patient's consented sharing level
- Missing audit trail for who accessed the patient's record during care coordination

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: REFERRAL / MEDICATION_RECONCILIATION / MDT / CARE_TEAM / DISCHARGE / CONSENT
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes care coordination review.
