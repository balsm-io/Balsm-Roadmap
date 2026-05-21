# Balsm Healthcare Platform — Certifications & Standards Compliance

> This document defines the certifications and open standards that Balsm targets, the sequenced plan to achieve them, and the **mandatory code-level requirements** that every AI agent and developer must follow to keep the codebase compliant. All generated code must respect these requirements.

---

## 1. Target Certifications & Recognitions

| # | Certification | Authority | Target Phase | Status |
|---|--------------|-----------|--------------|--------|
| 1 | LOINC License | Regenstrief Institute | **Now** | ⬜ Pending |
| 2 | FHIR R4 CapabilityStatement | HL7 International | **Now** | ⬜ Pending |
| 3 | Digital Public Goods (DPG) | DPGA / UNICEF | After pharmacy MVP | ⬜ Pending |
| 4 | SNOMED CT Affiliate License | SNOMED International | Phase 2–3 | ⬜ Pending |
| 5 | Egypt MOH / HIIS Alignment | Ministry of Health (EG) | Phase 2–3 | ⬜ Pending |
| 6 | HL7 Formal Conformance Testing | HL7 International | Phase 4+ | ⬜ Pending |

---

## 2. Certification Details & Application Roadmap

### 2.1 LOINC License
- **What it is:** The universal standard for identifying medical laboratory observations.
- **Why it matters:** Required for lab module (LabOrder, TestResult), vital signs, and clinical measurements.
- **Action:** Register at [loinc.org/get-started](https://loinc.org/get-started/) — free, ~1 day.
- **Blocking:** No features that use lab codes or clinical observation codes should ship without this registered.

### 2.2 FHIR R4 CapabilityStatement
- **What it is:** A machine-readable declaration of which FHIR resources, operations, and search parameters the Balsm API supports.
- **Why it matters:** HL7 FHIR R4 is the interoperability baseline for Egypt/GCC contexts. Interoperability with EMRs, national health platforms, and partner systems depends on this.
- **Action:** Run implementation against the official [FHIR Validator](https://validator.fhir.org/). Publish a `CapabilityStatement` at the `/metadata` endpoint. Self-attested; no external cost.
- **Apply at:** [hl7.org/implement/testing.cfm](https://www.hl7.org/implement/testing.cfm) for future formal testing.

### 2.3 Digital Public Goods (DPG) — DPGA
- **What it is:** Recognition from the [Digital Public Goods Alliance](https://digitalpublicgoods.net/) that Balsm qualifies as a digital public good (open-source, privacy-respecting, beneficial to society).
- **Why it matters:** The most strategically valuable badge for Balsm's positioning. OHC (Open Health Connect) holds this as their primary recognition. Unlocks access to UNICEF, WHO, government, and international funder networks.
- **9 DPG Standard indicators:** Open source license, platform independence, documentation, mechanism for extracting data, adherence to privacy laws, adherence to standards, non-harmful by design, do no harm by design, DPG Standard criteria.
- **Prerequisite:** Requires demonstrated real-world deployment and adoption. Target after first live pharmacy module deployment.
- **Apply at:** [digitalpublicgoods.net](https://www.digitalpublicgoods.net/)

### 2.4 SNOMED CT Affiliate License
- **What it is:** A license to use SNOMED CT terminology for clinical concepts (diagnoses, procedures, clinical findings).
- **Why it matters:** Required for Clinical Records, Prescriptions, and Radiology modules that encode clinical concepts. Egypt is not a SNOMED Member country, but affiliate licenses are available free/low-cost for open-source/public health projects.
- **Apply at:** [snomed.org/snomed-ct/get-snomed](https://www.snomed.org/snomed-ct/get-snomed)

### 2.5 Egypt MOH / HIIS Alignment
- **What it is:** Acknowledgment or a pilot MOU from Egypt's Ministry of Health Health Information Integration Strategy (HIIS), which is pushing national FHIR adoption.
- **Why it matters:** A stronger local credential than any international cert at early stage. Signals compliance with national digital health strategy.
- **Action:** Engage MOH-affiliated hospitals for a pilot agreement. Document alignment with HIIS data standards.

### 2.6 HL7 Formal Conformance Testing
- **What it is:** Formal third-party certification of HL7 FHIR implementation compliance.
- **Why it matters:** Required for GCC government contracts and high-trust institutional integrations.
- **Action:** Pursue after Phase 4 when targeting government procurement.
- **Apply at:** [hl7.org/implement/testing.cfm](https://www.hl7.org/implement/testing.cfm)

---

## 3. Code-Level Compliance Requirements

> These are **mandatory requirements for all generated and hand-written code**. AI agents must apply these rules without being asked.

### 3.1 FHIR R4 Compliance

- All resources exchanged externally (patient demographics, clinical observations, prescriptions, lab results, appointments) **must** be mapped to FHIR R4 resource types (`Patient`, `Observation`, `MedicationRequest`, `DiagnosticReport`, `Appointment`, etc.).
- FHIR resource representations must include `resourceType`, `id`, `meta.profile`, and all mandatory elements per the R4 specification.
- The API **must** expose a `/metadata` endpoint returning a valid `CapabilityStatement` resource documenting supported resources, operations, and search parameters.
- Use the [official FHIR R4 base profiles](https://hl7.org/fhir/R4/) — do not invent custom structures where standard ones exist.
- FHIR RESTful interactions must follow the standard HTTP verbs: `GET` for read/search, `POST` for create, `PUT` for update, `DELETE` (soft only) for delete.
- FHIR search parameters must follow naming conventions defined in R4 specs (e.g., `patient`, `subject`, `performer`, `date`).
- Implement anti-corruption layers for FHIR ↔ internal domain model translation — never leak FHIR types into the domain layer.

### 3.2 LOINC Compliance

- All laboratory observations, vital sign measurements, and clinical document types **must** be coded using LOINC codes — never use free-text or internal codes where LOINC equivalents exist.
- LOINC codes must be stored and transmitted in the format `system: "http://loinc.org"`, `code: "<LOINC code>"`, `display: "<LOINC display name>"`.
- Common bindings to enforce:
  - Vital signs: use LOINC Panel codes (e.g., `85353-1` for Vital signs panel).
  - Lab results: map to LOINC observation codes per test type.
  - Clinical document types: use LOINC document ontology codes.
- When LOINC code is unknown or unavailable, use `DataAbsentReason` — never omit or fabricate a code.

### 3.3 SNOMED CT Compliance

- Clinical findings, diagnoses, procedures, and body structures **must** be coded with SNOMED CT where applicable.
- SNOMED CT codes must use the system URI `http://snomed.info/sct`.
- ICD-10 is acceptable as a secondary/billing code alongside SNOMED CT — do not replace SNOMED with ICD-10 in clinical contexts.
- Do not store SNOMED descriptions as free text — always store concept ID alongside the display term.

### 3.4 ICD-10 Compliance

- All diagnosis codes for billing and insurance purposes **must** use ICD-10-CM codes.
- ICD-10 codes must be validated against the active code set before persistence — never store unvalidated free-text diagnoses in coded fields.

### 3.5 RxNorm Compliance

- Medication identifiers in the Prescriptions and Pharmacy modules **must** include RxNorm concept codes (`RxCUI`) where available.
- Use system URI `http://www.nlm.nih.gov/research/umls/rxnorm`.

### 3.6 DPG Standard Compliance (Design Principles)

The following principles are required by the DPG Standard and must be upheld in all code:

- **Open source:** All code must be committed under the project's AGPL license. No proprietary dependencies that restrict distribution.
- **Platform independence:** Core application logic must not be locked to a specific cloud provider, OS, or commercial platform.
- **Privacy by design:** No personal data collected without explicit purpose. Minimum data collection principle applies.
- **Do no harm by design:** No features that could weaponize data against users, enable mass surveillance, or restrict access to health services.
- **Data extractability:** All patient data must be exportable in a standard format (FHIR Bundle) on request — no data lock-in.
- **Documentation:** Every API endpoint, data model, and module must have up-to-date documentation. Undocumented features are considered incomplete.
- **Accessibility:** UI must meet WCAG 2.1 AA at minimum — healthcare interfaces serve users with disabilities and the elderly.

### 3.7 Egypt PDPL (Personal Data Protection Law) Compliance

- Collect only data necessary for the stated health purpose — no speculative data collection.
- Data subject (patient) consent must be recorded, versioned, and withdrawable.
- Cross-border transfer of personal health data is prohibited without explicit consent and legal basis.
- Data retention periods must be defined and enforced — do not retain data indefinitely.
- Patient data deletion requests must be handled within 30 days (soft-delete + anonymization; hard delete not permitted for clinical records).

---

## 4. Per-Phase Certification Checklist

Include the following in each phase plan (`PLAN.md`) and closure report:

- [ ] Identify which certifications are newly actionable in this phase
- [ ] Document any new FHIR resources or operations added and update `CapabilityStatement`
- [ ] Confirm all new lab/observation codes use LOINC
- [ ] Confirm all new clinical findings/diagnoses use SNOMED CT or ICD-10 as appropriate
- [ ] Confirm all new medication references include RxNorm `RxCUI`
- [ ] Confirm no proprietary dependencies introduced (DPG open-source requirement)
- [ ] Confirm all new UI screens meet WCAG 2.1 AA (DPG accessibility requirement)
- [ ] Confirm consent is captured for any new personal data collection (PDPL)
- [ ] Assign owner and target date for any certification application action in this phase
- [ ] Update certification status table in this file when a certification is obtained

---

## 5. Evidence Artifacts

Maintain the following as part of the project's compliance record:

| Artifact | Location | Owner |
|----------|----------|-------|
| LOINC registration confirmation | `legal/licenses/loinc-registration.pdf` | TBD |
| FHIR CapabilityStatement | `/metadata` API endpoint + `docs/fhir/capability-statement.json` | API team |
| SNOMED CT affiliate license | `legal/licenses/snomed-license.pdf` | TBD |
| DPG application & evidence package | `legal/certifications/dpg/` | TBD |
| MOH/HIIS MOU or acknowledgment letter | `legal/certifications/moh-hiis/` | TBD |
| HL7 conformance test report | `legal/certifications/hl7/` | TBD |

---

## 6. References

| Standard | Spec URL |
|----------|----------|
| FHIR R4 | https://hl7.org/fhir/R4/ |
| LOINC | https://loinc.org |
| SNOMED CT | https://snomed.org |
| ICD-10-CM | https://www.cdc.gov/nchs/icd/icd-10-cm.htm |
| RxNorm | https://www.nlm.nih.gov/research/umls/rxnorm/ |
| DPG Standard | https://digitalpublicgoods.net/standard/ |
| HL7 FHIR Conformance | https://www.hl7.org/implement/testing.cfm |
| Egypt PDPL | https://www.mcit.gov.eg/ |
