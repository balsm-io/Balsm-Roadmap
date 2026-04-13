# Medical Coding Check

Review changed files for correct usage of medical coding standards and terminology.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that references medical codes, clinical terminology, or healthcare data models.
3. Analyze for the following:

### Correct Coding Standard Usage
Verify the correct standard is used for each data type:

| Data Type | Required Standard | Common Mistakes |
|-----------|-------------------|-----------------|
| Diagnoses | ICD-10 (ICD-10-CM/ICD-10-PCS) | Invented codes, ICD-9 codes, free-text |
| Procedures | CPT / HCPCS | Missing modifier codes, wrong code set |
| Lab tests | LOINC | Invented test codes, local codes without mapping |
| Medications | RxNorm | Brand names without RxNorm mapping, free-text drug names |
| Clinical terms | SNOMED CT | Approximated codes, invented codes |
| Radiology | RadLex, DICOM | Non-standard modality codes |
| Drug classification | WHO ATC | Missing classification, wrong level |

### Code Validation
- Medical codes accepted without validation against a reference lookup
- Free-text fields used where coded values are required
- Hardcoded medical codes in source code instead of validated lookups from a code database
- Medical codes stored as plain strings without code system identifier (must store code + system)
- Missing code system version tracking (ICD-10 updates annually)

### Terminology Consistency
- Domain terms not matching the ubiquitous language:
  - "appointment" not "reservation" or "booking"
  - "admission" not "internal reservation"
  - "dispensation" not "pharmacy fulfillment"
  - "specimen" not "sample"
  - "entity" not "organization" or "facility" (for healthcare entities)
- Inconsistent term usage between code, API, database, and documentation
- Abbreviated or invented medical terms

### Interoperability
- Clinical data structures not compatible with HL7 FHIR resource definitions
- DICOM standard not followed for imaging data
- Missing anti-corruption layer when integrating with external clinical systems
- Lab results not structured to allow LOINC-based exchange
- Medication data not structured for RxNorm-based exchange

### Code Display
- Medical codes displayed to users without human-readable descriptions
- Missing localized descriptions for medical codes (codes are universal, descriptions need i18n)
- Code descriptions hardcoded in English instead of using a terminology service

4. For each issue found, report:
   - File path and line number
   - Category: WRONG_STANDARD / MISSING_VALIDATION / TERMINOLOGY / INTEROPERABILITY / DISPLAY
   - The incorrect usage
   - The correct standard and code
   - Suggested fix

5. If no issues are found, confirm the code passes medical coding review.
