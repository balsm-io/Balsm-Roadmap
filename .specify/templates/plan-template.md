# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

**Certification compliance gate** *(required if feature touches clinical data, FHIR, lab, medications, or patient records)*:
- [ ] Read `CERTIFICATIONS.md Section 3` and identified all applicable standards for this feature
- [ ] Design uses correct system URIs: LOINC `http://loinc.org`, SNOMED `http://snomed.info/sct`, RxNorm `http://www.nlm.nih.gov/research/umls/rxnorm`
- [ ] No free-text used where a coded value (LOINC, SNOMED, ICD-10, RxNorm) is required — `DataAbsentReason` used when code is unavailable
- [ ] FHIR resources include `resourceType`, `id`, `meta.profile`, and all mandatory R4 elements
- [ ] Anti-corruption layer planned for any FHIR ↔ domain model translation
- [ ] `/metadata` CapabilityStatement update required? [Yes / No]
- [ ] New personal data collected? Consent mechanism planned? [Yes / No]
- [ ] All new data exportable as FHIR Bundle on patient request? [Yes / No]

**MENA jurisdiction gate** *(required for any feature handling personal data, telemedicine, prescriptions, or clinical workflows)*:
- [ ] Target jurisdictions identified: [Egypt / KSA / UAE / multi]
- [ ] Data residency satisfied per jurisdiction (UAE PHI in UAE per Fed. Law 2/2019; KSA PHI in KSA per PDPL Art. 29; Egypt cross-border per PDPL Art. 14)
- [ ] Telemedicine licensing check applied if cross-border (MOH KSA / MOHAP UAE / EHA Egypt)
- [ ] National exchange integration impact assessed (NPHIES KSA / Riayati UAE-MOHAP / Malaffi Abu Dhabi / EHA Egypt)
- [ ] DHA / DOH ADHICS controls satisfied if feature deploys in UAE

**Open-source ecosystem gate** *(Principle XII)*:
- [ ] All new repositories or modules licensed AGPL-3.0-or-later
- [ ] No PHI, secrets, or proprietary data in public artifacts (issues, PRs, commits, docs, screenshots)
- [ ] Data export path (FHIR Bundle / CSV / JSON) preserved for any new entity introduced
- [ ] Third-party dependencies pinned and license-audited (no GPL-incompat or non-OSS additions)
- [ ] Reproducible build inputs documented if feature changes packaging
- [ ] DCO `Signed-off-by:` commit policy reaffirmed for contributors

**Domain modeling gate** *(Principles IV & IX — required for any feature adding or changing domain logic)*:
- [ ] Owning bounded context identified (one of the 13); no cross-context table or internal-class access
- [ ] Subdomain type classified — Core / Supporting / Generic — and modeling depth matched to it
- [ ] Aggregate(s) and aggregate root(s) identified; aggregates kept small (root + minimal cluster), cross-aggregate references by ID only
- [ ] Consistency boundaries stated: transactional within an aggregate, eventual (via domain events) between aggregates
- [ ] Entity vs Value Object decided per model object (prefer immutable Value Objects); invariants placed on the model, not in services (no anemic model)
- [ ] Domain events named past-tense; internal vs integration events distinguished; integration events cross the boundary via ACL + published language
- [ ] Repository interfaces defined in the domain layer (implementations in infrastructure); methods speak the ubiquitous language
- [ ] Names map to the ubiquitous language — no `Manager` / `Helper` / `Processor` / `Util` domain types; hard-to-name concepts flagged as model smells

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
