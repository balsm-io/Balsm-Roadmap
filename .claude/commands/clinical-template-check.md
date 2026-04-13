# Clinical Template Check

Review changed files that define or modify medical data entry templates and structured clinical forms.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches clinical forms, medical data entry templates, clinical note structures, or standardized data entry components.
3. Analyze for the following:

### Required Fields Enforcement
- Clinical templates with required fields that can be submitted empty
- Required fields not validated on both client and server side
- Required fields differing between client and server validation
- Conditional required fields (required based on another field's value) not enforced

### Coded Terminology
- Diagnosis fields accepting free-text without ICD-10 code selection
- Procedure fields without CPT/HCPCS code mapping
- Lab test fields without LOINC code association
- Medication fields without RxNorm code linkage
- Clinical term fields without SNOMED CT code option
- Free-text fields used where a coded/structured field should be offered (with optional free-text for additional context)

### Template Versioning
- Templates modified in place without version tracking
- No mechanism to view which template version was used for a historical record
- Template version changes not generating a changelog entry
- Active patient records referencing a deleted or replaced template version

### Clinical Note Format Compliance
- SOAP note templates not enforcing all four sections (Subjective, Objective, Assessment, Plan)
- DAP note templates not enforcing all three sections (Data, Assessment, Plan)
- Templates allowing submission of clinical notes without the minimum required sections
- Section labels inconsistent with standard medical documentation formats

### Validation Rules
- Dosage fields without min/max range validation
- Missing valid unit enforcement (mg, mL, units, etc.)
- Vital signs without plausible range checks (e.g., heart rate 0-300, temp 30-45°C)
- Age/weight-dependent validation rules not enforced
- Date fields allowing future dates where clinically inappropriate (e.g., date of symptom onset in the future)
- Numeric fields without appropriate precision constraints

### Standardized Core Fields
- Standard fields (patient demographics, vitals, allergies) customizable in ways that could break interoperability
- Core clinical fields (diagnosis, medication, procedure) modifiable by entity customization
- Missing distinction between standardized core fields and entity-customizable fields

### Accessibility & Usability
- Form fields without labels or descriptions
- Complex medical forms without section grouping or progressive disclosure
- Missing placeholder text or help text for clinical fields
- Form submission without confirmation on forms containing irreversible clinical data

### Localization
- Clinical templates with hardcoded string labels instead of localized keys
- Template labels not supporting RTL layout
- Medical terminology displayed in one language only without multilingual support

4. For each issue found, report:
   - File path and line number
   - Severity: HIGH / MEDIUM / LOW
   - Category: REQUIRED_FIELDS / CODING / VERSIONING / FORMAT / VALIDATION / CORE_FIELDS / ACCESSIBILITY / LOCALIZATION
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes clinical template review.
