# Prescription Safety Review

Review changed files touching prescription, medication, or dispensation logic for patient safety compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches prescriptions, medications, dispensation, or pharmacy logic.
3. Analyze for the following safety-critical issues:

### Drug Interaction Checks
- Drug interaction validation bypassed, weakened, or short-circuited
- New medication added to a prescription without checking against existing medications
- Interaction severity levels not surfaced to the prescribing doctor
- Interaction check results not logged for audit trail
- Missing or incomplete drug-drug, drug-allergy, and drug-condition checks

### Allergy Enforcement
- Allergy check skipped or made optional in the prescription workflow
- Allergy alerts dismissible without requiring documented clinical justification
- Patient allergy list not queried before prescription creation
- Cross-reactivity checks missing (e.g., penicillin family)

### Dosage Validation
- Missing dosage range validation (min/max dose per age, weight, condition)
- Dosage limits bypassable without override documentation
- Pediatric and geriatric dosage adjustments not enforced
- Missing frequency and duration validation
- Renal/hepatic dose adjustment rules not checked

### Dispensation Safety
- Dispensation endpoint not idempotent (duplicate request could dispense twice)
- Missing idempotency key check on dispensation operations
- Dispensation proceeding without valid, active prescription
- Partial dispensation not properly tracked (remaining quantity)
- Dispensed medication not reconciled against prescribed medication

### AI Prescription Suggestions
- AI medication suggestions appearing as default selections (must require active doctor action)
- AI suggestions missing "AI-assisted" label
- AI suggestions saved to record without explicit doctor accept/modify/reject
- AI overriding rule-based safety checks (interactions, allergies, dosage limits)
- Missing confidence score on AI medication recommendations

### Audit & Traceability
- Prescription creation/modification missing audit trail entries
- Missing prescriber identification on prescription records
- Dispensation records missing pharmacist and timestamp
- Override of safety alerts not documented with reason and user
- Missing chain: prescription → dispensation → patient receipt

### Controlled Substance Rules
- Controlled substances not flagged for additional verification
- Missing DEA/regulatory schedule classification checking
- Refill limits not enforced for controlled substances
- Missing prescription validity/expiry date enforcement

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL (patient safety risk) / HIGH / MEDIUM
   - Description of the safety gap
   - Suggested fix

5. If no issues are found, confirm the code passes prescription safety review.
