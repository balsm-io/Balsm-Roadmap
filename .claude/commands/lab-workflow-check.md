# Lab Workflow Check

Review changed files touching laboratory operations for clinical safety and workflow compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches lab orders, specimens, test results, QC, or lab workflows.
3. Analyze for the following:

### Specimen Tracking & Chain of Custody
- Specimen created or moved without barcode/label validation
- Chain of custody not maintained: every handoff (collection → transport → reception → testing → archive) must be recorded with user, timestamp, and location
- Missing barcode generation or validation on specimen collection
- Specimen-to-patient linkage breakable or not verified at each step
- House visit specimens not following the same chain-of-custody rules as in-lab specimens

### Critical Value Alerts
- Life-threatening lab results not triggering immediate notification to the ordering physician
- Critical value alert delivery not confirmed (must ensure the physician received the alert)
- Critical value notification failing silently (must have fallback notification channel)
- Missing panic value notification log for regulatory compliance
- Critical value thresholds hardcoded instead of configurable per entity/test

### Result Verification & Release
- Lab results released/accessible to patients or doctors without verification and approval workflow
- Missing two-step verification for abnormal results (technician reviews, pathologist/supervisor approves)
- Results overwritten without maintaining the original value and reason for correction
- Result corrections not generating a new audit trail entry
- Auto-released results without human verification

### Quality Control
- Test results generated without a passing daily QC run for that test/instrument
- QC failures not blocking the release of results from the affected instrument
- Missing corrective action documentation when QC fails
- QC data not tracked per instrument, per reagent lot, per control lot
- Reagent or control lot used past expiration date without system-level block

### Reflex Testing
- Reflex testing rules (auto-order follow-up tests based on initial results) not configured or enforced
- Reflex orders generated without clinical context from the original order
- Reflex test results not linked to the original triggering result

### Lab Coding & Standards
- Lab tests not mapped to LOINC codes
- Test results missing reference ranges
- Missing units of measurement on numeric results
- Missing abnormal flags (H/L/HH/LL/Critical)
- Microbiology results missing organism identification and antibiotic susceptibility data structure

### Lab House Visit Integration
- House visit specimen collection not following the same barcode and tracking standards
- Technician's collection record not connected to the lab's intake workflow
- Missing patient preparation instructions delivery with house visit booking confirmation
- House visit status tracking gaps (assigned → en route → collected → received at lab → results ready)

### Online Results Sharing
- Shareable result URLs accessible without identity verification
- Result URLs without configurable expiry periods
- URL access not logged for security audit
- PHI in the URL itself (must use opaque tokens, not patient identifiers)

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL (patient safety) / HIGH / MEDIUM
   - Category: SPECIMEN / CRITICAL_VALUE / VERIFICATION / QC / REFLEX / CODING / HOUSE_VISIT / SHARING
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes lab workflow review.
