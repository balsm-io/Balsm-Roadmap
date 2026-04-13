# Pharmacovigilance Check

Review changed files touching adverse event reporting, medication safety monitoring, or post-market surveillance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches adverse drug reactions (ADRs), medication side effects, safety reporting, or post-market surveillance.
3. Analyze for the following:

### Adverse Event Reporting Structure
- Adverse event reports missing required fields:
  - Patient identifier (anonymized)
  - Reporter identifier and role (physician, pharmacist, patient, nurse)
  - Suspect medication(s) with dosage, frequency, route, start/stop dates
  - Adverse event description with onset date and duration
  - Severity classification (mild, moderate, severe, life-threatening, fatal)
  - Outcome (recovered, recovering, not recovered, fatal, unknown)
  - Causality assessment (certain, probable, possible, unlikely, unrelated)
  - Concomitant medications
  - Relevant medical history
- Adverse event report submitted without minimum required fields validated

### Causality Assessment
- Causal link between medication and adverse event not captured or tracked
- Missing structured causality assessment methodology (WHO-UMC, Naranjo algorithm, or equivalent)
- Causality assessment not reviewable or updatable as new information becomes available
- Missing timeline correlation between drug administration and event onset

### Regulatory Reporting
- Serious adverse events not flagged for expedited regulatory reporting (typically 15 days for serious, 90 days for non-serious)
- Missing regulatory report format compliance:
  - MedWatch (FDA) format for US
  - CIOMS form for WHO/international
  - E2B(R3) format for ICH electronic reporting
- Adverse event terminology not mapped to MedDRA (Medical Dictionary for Regulatory Activities)
- Missing periodic safety update report (PSUR/PBRER) data aggregation capability

### Signal Detection
- Adverse event data not aggregated for pattern detection
- Missing threshold-based alerting for unusual frequency of similar adverse events
- No mechanism to link adverse events across patients for the same medication
- Adverse event trends not reportable to entity administrators or safety officers

### Patient Safety Integration
- Adverse event reported for a medication but the drug interaction database not updated
- Future prescriptions of the flagged medication not triggering a warning referencing the patient's reported adverse event
- Missing feedback loop: ADR report → patient allergy/intolerance list update
- Adverse event for a medication class not generalizing to related medications

### Audit & Traceability
- Adverse event reports modifiable without maintaining full version history
- Missing audit trail: who reported, when, who reviewed, what actions were taken
- Follow-up actions on adverse event reports not tracked to completion
- Missing timeline: event → report → review → regulatory submission → resolution

### Data Privacy in Reporting
- Patient-identifiable information included in external regulatory submissions
- Adverse event data shared with pharmaceutical companies containing patient identifiers
- Missing de-identification for adverse event case reports shared externally
- Reporter identity exposed in published safety data

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL (patient safety) / HIGH (regulatory compliance) / MEDIUM
   - Category: REPORTING_STRUCTURE / CAUSALITY / REGULATORY / SIGNAL_DETECTION / PATIENT_SAFETY / AUDIT / PRIVACY
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes pharmacovigilance review.
