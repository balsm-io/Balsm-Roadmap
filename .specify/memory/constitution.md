<!--
  SYNC IMPACT REPORT
  Version change: 1.7.1 → 1.8.0
  Bump rationale: MINOR — Principle IV materially amended: the canonical
  bounded-context set grows from 13 to 20 (+2 provisional), organized by three
  data-ownership planes (ADR-10), derived bottom-up from
  Balsm-Draft/PHASED_ROADMAP.md (P000–P023). No principle weakened; LOCKED
  Principle I untouched.

  Modified principles:
    - IV. Modular Monolith & DDD:
      * Canonical contexts 13 → 20: added Personal Health (Core, consumer
        plane), Provider Directory, Point of Sale, Customer Relations,
        Care Delivery, Balsm Network, Platform Access; Community and
        Population Insights listed as provisional (P021 gate; modules may not
        map to provisional contexts)
      * Core set now: Personal Health, Clinical Records, Prescriptions
      * Inventory reclassified Generic → Supporting (Egypt Law 182/1960
        controlled-substance tagging, FIFO-by-expiry, POS-atomic deduction)
      * PharmacyInventory entity moved Pharmacy → Inventory (one context owns
        stock)
      * Canonical decomposition now lives in architecture/bounded-contexts/
        (one canvas per context + context map); subdomain-map.md and
        subdomain-classification.md corrected in the same change (stale Core
        labels on Charitable Donations and Marketplace fixed to Supporting)
      * Narrow, documented exception added to the eventual-consistency rule:
        Point of Sale → Inventory DeductStock synchronous command (P007
        atomicity exit criterion)

  Templates requiring updates:
    - .specify/templates/plan-template.md  ✅ done (2026-07-11) — "Module &
      Bounded Context Mapping" section added (context, plane, repo, module,
      sub-module, owning context); Domain modeling gate now cites the
      20-context list + bounded-contexts/ canvases
    - .specify/templates/tasks-template.md ✅ done (2026-07-11) — "Module &
      Context Scope" section + per-story Bounded Context / Module line +
      declared-module path rule
    - speckit-plan / speckit-tasks skills (.claude/.agents/.opencode mirrors)
      ✅ done (2026-07-11) — mandatory module/sub-module/context detection step
      in plan; mapping extraction + scope enforcement in tasks
    - .specify/templates/spec-template.md  ⚠ still pending from 1.7.0

  Prior amendment (1.7.0 → 1.7.1): PATCH — Principles IV and XIII now link the
  `architecture/` folder (subdomain-map.md, subdomain-classification.md,
  routing strategies) as a mandatory planning-phase input. No semantic change
  to any rule.

  Version change: 1.6.0 → 1.7.0
  Bump rationale: MINOR — new Principle XIV (External Integration & Messaging
  Surfaces) added, plus materially expanded guidance in Principles II, IV, VI,
  X, XII, XIII, the Technology Stack, and the Development Workflow, derived
  from a full survey of every sibling repository in the workspace
  (Balsm-API-DotNet, balsm_app_flutter, website, docs, Balsm-AI, supabase,
  OpenWA, Balsm-Draft, db_benchmark, root workspace meta). No principle
  weakened or removed; LOCKED Principle I (Patient Safety First) untouched.

  Added principles:
    - XIV. External Integration & Messaging Surfaces: governs the WhatsApp
      gateway (OpenWA), webhooks, cloud edge functions, and third-party
      channels — no PHI over third-party messaging, HMAC-verified webhooks,
      scoped gateway credentials, RLS deny-by-default, edge-function-only
      writes for sensitive cloud fields

  Modified principles:
    - II. Security & Privacy by Design: PHI data topology (on-device SQLCipher
      PHI vs non-PHI cloud tier; sole DOB exception field-level encrypted),
      encrypted device backups, telemetry/crash-report PII scrubbing,
      data-subject erasure workflow reconciled with the soft-delete rule,
      SYSTEM_THREAT_MODEL.md consultation mandate
    - IV. Modular Monolith & DDD: implemented-module → bounded-context mapping
      requirement (per-repo module sets MUST map to the 13 contexts)
    - VI. Test-First Discipline: repo-level CI quality gates declared
      constitutional (backend per-layer coverage gates; Flutter boundary lint,
      PHI-leak fuzz, translation-completeness, golden tests)
    - X. AI Governance: AI model registry, admin kill switch, pre-deployment
      bias evaluation, AI threat-ID citation (AI01–AI16) requirements
    - XII. Open-Source Ecosystem: per-repo license registry added; existing
      license divergences (website addendum, docs MIT) surfaced for
      reconciliation; new divergences forbidden
    - XIII. Cross-Repository Rule & Skill Alignment: repo enumeration extended
      with supabase (cloud data platform), OpenWA (messaging gateway),
      Balsm-Draft (planning), db_benchmark (tooling), root workspace meta

  Added sections: None (new principle added within Core Principles; Technology
  Stack and Development Workflow extended in place)

  Removed sections: N/A

  Templates requiring updates:
    - .specify/templates/plan-template.md        ⚠ pending — add integration-
      surface (Principle XIV) + PHI-topology rows to the Constitution Check
    - .specify/templates/spec-template.md         ⚠ pending — add bounded-context
      + aggregate identification to the spec structure
    - .specify/templates/tasks-template.md        ✅ No change required

  Prior amendment (1.5.0 → 1.6.0):
    - Principle XIII added: per-repo rule + skill sources, local-first reading
      order, constitution > repo-rules > skills precedence

  Follow-up TODOs:
    - spec-template.md: add a "Domain Model" section capturing the feature's
      bounded context, aggregates, and domain events
    - Reconcile website's AGPL + Anti-White-Label/SaaS addendum and the docs
      repo's MIT license with Principle XII (explicit amendment or relicense)
    - Reconcile supabase default region (eu-west-1) with Principle III MENA
      residency (UAE rows → UAE-resident self-hosted Supabase per FR-049)
    - Publish the implemented-module → bounded-context mapping for
      Balsm-API-DotNet (Account, Auth, Customer, Deletion, Disclosure,
      EmergencyQr, Entity, Geofence, Identity, Inventory, POS, Prescription,
      Sessions) and balsm_app_flutter modules
    - website still depends on supabase-js despite the 2026-06-17 backend
      pivot note in docs — verify and reconcile
-->

# Balsm Healthcare Platform Constitution

## Core Principles

### I. Patient Safety First (NON-NEGOTIABLE, LOCKED)

> **🔒 LOCKED PRINCIPLE** — Amendments to this principle (including weakening,
> narrowing, or removing any bullet) require a **MAJOR** version bump and
> explicit board-level approval per the Governance "Locked principles" clause.
> Strengthening additions (new safety guarantees) follow the normal MINOR /
> PATCH process but MUST be reviewed by the Patient Safety Officer.

Clinical data integrity and patient safety override all other concerns — velocity,
deadlines, and convenience MUST never compromise safety-critical workflows.

- Prescription validation rules (drug interactions, allergy checks, dosage limits)
  are safety-critical — agents MUST NOT bypass, weaken, or shortcut them
- All clinical data operations MUST be ACID-compliant with optimistic concurrency
  control — silent overwrites of clinical records are forbidden
- Every modification to a patient record MUST be immutably logged with previous
  value, new value, acting user, and timestamp
- Emergency access overrides MUST be time-limited, fully audited, and trigger
  immediate patient notification
- Medical terminology and coding standards (ICD-10, CPT, SNOMED CT, LOINC,
  RxNorm, HL7 FHIR, DICOM) MUST be used correctly — approximations are forbidden;
  the full code-level rules for each standard are in `CERTIFICATIONS.md`
- AI features MUST be assistive only — they MUST never replace human clinical
  judgment (see Principle X)

### II. Security & Privacy by Design

Every operation MUST be verified against the user's permissions before execution.
Patient health information (PHI) MUST be protected at every layer.

- Every API endpoint MUST enforce authentication and permission checks — no
  exceptions
- PHI MUST never appear in logs, error messages, commit messages, AI prompts,
  test fixtures, or client-side analytics — log record IDs only
- Sensitive fields (diagnoses, medications, test results) MUST be encrypted at
  the field level in addition to transport and at-rest encryption
- All user inputs MUST be validated on both client and server — use parameterized
  queries exclusively, never concatenate user input into SQL
- Secrets, API keys, and connection strings MUST use environment variables — never
  hardcode them
- Soft-delete only for clinical and patient data — hard deletion is forbidden
- All sensitive operations MUST produce an audit log entry (who, what, when, from
  where)
- Platform-native secure token storage MUST be used (Keychain on iOS/macOS,
  EncryptedSharedPreferences on Android, OS keyring on desktop)
- Brute-force protection: 5 failed login attempts → 15-minute lockout;
  passwordless flows (OTP) MUST apply layered throttles (per-identifier,
  per-IP, and global) with CAPTCHA escalation for repeat offenders
- Device registry with remote revocation capability MUST be maintained
- OWASP Top 10 vulnerabilities MUST be prevented — every code change MUST be
  evaluated against this list
- **PHI data topology (patient app)**: PHI lives on-device in
  SQLCipher-encrypted storage; the cloud tier stores non-PHI account and
  metadata rows only. The sole cloud PHI exception is `date_of_birth`,
  field-level encrypted (pgcrypto `pgp_sym`) and audit-logged; age-gate checks
  run server-side against the encrypted value — never client-side. Adding any
  further PHI column to the cloud tier requires a constitutional amendment
- Device backup blobs (iCloud Drive on iOS, Google Drive on Android) MUST be
  encrypted before upload — a backup blob is PHI
- Crash reporting and telemetry MUST NOT capture PII/PHI —
  `SendDefaultPii=false` (or platform equivalent), no request/response body
  capture; PHI-leak fuzz tests MUST gate CI in every client and server repo
- **Data-subject erasure vs soft-delete**: the soft-delete rule protects
  clinical records; account erasure (PDPL/GDPR right-to-be-forgotten) follows
  the documented deletion workflow — a cancellable grace period (currently
  14 days), then an auditable service-role-only purge with a retained
  deletion log. Ad-hoc hard deletion outside this workflow remains forbidden
- Security-relevant specs and plans MUST consult `SYSTEM_THREAT_MODEL.md`,
  cite the applicable threat IDs, and confirm the BLOCKING mitigations

### III. Regulatory Compliance (Egypt, KSA, UAE, MENA)

The platform MUST comply with healthcare regulations across the MENA target
markets — Egypt, Kingdom of Saudi Arabia, and United Arab Emirates as primary
jurisdictions, with extensibility to the broader MENA region. When regulation
conflicts with a feature request, regulation wins.

- **Egypt**: PDPL (Law 151/2020), Medical Practice Law, Law 182/1960 (narcotics),
  Egyptian Drug Authority (EDA) medical device regulations, Telecommunications
  Law, Egyptian Healthcare Authority (EHA) eHealth requirements
- **Saudi Arabia (KSA)**: PDPL (Royal Decree M/19 of 2021) and its Implementing
  Regulations, SDAIA controller registration, SFDA Medical Device Regulations
  (including SaMD classification under MDS-G010), MOH Telemedicine Regulations,
  Anti-Corruption Commission regulations, Anti-Cyber Crime Law, NPHIES/SEHA
  national health exchange standards
- **United Arab Emirates (UAE)**: PDPL — Federal Decree-Law No. 45/2021 and
  the UAE Data Office regulations; Federal Law No. 2/2019 on the Use of
  Information and Communications Technology in Health Fields (the "Health Data
  Law") including its data residency requirement; MOHAP Telehealth Standard
  and federal practitioner licensing; Dubai Health Authority (DHA) Health Data
  Protection Regulation and Riayati national EMR integration requirements;
  Abu Dhabi DOH Healthcare Information and Cyber Security Standard (ADHICS v2)
  and Malaffi integration requirements; Emirates Drug Establishment narcotics
  and controlled substance controls
- **MENA-wide**: WHO Ethical Criteria for Medicinal Drug Promotion, data
  residency requirements per jurisdiction, Arabic-language clinical content
  accuracy, country-specific national ID formats and validation rules
- **International standards** (enforced in all code, specs, and ideas):
  - HL7 FHIR R4 — all externally exchanged resources MUST use standard R4 types;
    the API MUST expose a `/metadata` CapabilityStatement endpoint
  - LOINC — all lab observations, vital signs, and clinical document types MUST
    use LOINC codes (`system: "http://loinc.org"`); LOINC registration is required
    before shipping any lab feature
  - SNOMED CT — clinical findings, diagnoses, and procedures MUST use SNOMED CT
    concept IDs (`system: "http://snomed.info/sct"`); ICD-10 is for billing only
  - RxNorm — all medication references MUST include RxNorm RxCUI
    (`system: "http://www.nlm.nih.gov/research/umls/rxnorm"`)
  - ICD-10 — all billing diagnoses MUST use ICD-10 codes validated against the
    active code set before persistence
  - DPG Standard — all code MUST remain open-source (AGPL), platform-independent,
    privacy-by-design, and data-extractable as FHIR Bundle on request
  - Full code-level rules for all standards are in `CERTIFICATIONS.md` —
    read that file before writing any spec, plan, or code touching clinical data
- Controlled substance tracking MUST be implemented before pharmacy module
  launch in any market — deferring it is not acceptable (CR-01)
- Prescription attachment for controlled substances MUST default to **required**
  (opt-out, not opt-in) (DR-02)
- Pharmaceutical analytics MUST NOT expose individual prescriber patterns that
  could facilitate kickback schemes — minimum aggregation thresholds and explicit
  anti-kickback prohibitions MUST be enforced (CR-02)
- Any AI feature that provides clinical decision support MUST undergo SaMD
  classification assessment with the relevant regulator (SFDA in KSA, EDA in
  Egypt, MOHAP / DHA / DOH in UAE) before deployment in that market (CR-03)
- Cross-border telemedicine MUST verify that the provider is licensed in the
  patient's jurisdiction — unlicensed cross-border consultations MUST be blocked
- Consent MUST be collected and verified before any data sharing operation; the
  consent record MUST capture jurisdiction, purpose, and revocation channel
- Data residency MUST be respected per jurisdiction — UAE PHI MUST remain in the
  UAE unless an explicit federal exemption applies; KSA PHI MUST remain in KSA
  per PDPL Art. 29; Egypt PHI residency follows PDPL Art. 14 cross-border
  transfer rules

### IV. Modular Monolith with Domain-Driven Design

The system follows a modular monolith architecture with 20 canonical bounded
contexts (+2 provisional pending the P021 spec), organized by three
data-ownership planes (Consumer / Provider / Platform, per ADR-10).
Module boundaries are inviolable.

- Every bounded context MUST be a separate package/project — no two contexts in
  the same package
- Modules communicate through well-defined internal interfaces and domain events
  — never access another module's database tables or internal classes directly
- Each module follows clean architecture: API → Business Logic → Data Access —
  layer boundaries MUST be respected
- Cross-module project references are forbidden — modules depend on shared
  contracts and interfaces only
- Each bounded context owns its database schema — no shared tables between
  contexts
- Anti-corruption layers MUST be used when integrating with external systems
  (HL7/FHIR, DICOM, insurance APIs, national health exchanges)
- Tactical DDD patterns (aggregates, domain events, value objects, repositories,
  domain services) MUST be applied in the Core and complex Supporting contexts
  (Personal Health, Clinical Records, Prescriptions, Billing & Finance, Labs,
  Radiology):
  - **Aggregates MUST be small** — one aggregate root plus a minimal cluster;
    reference other aggregates by identity (ID), never by direct object reference
  - **Consistency boundaries**: immediate (transactional) consistency is
    guaranteed only *within* an aggregate; consistency *between* aggregates MUST
    be eventual, coordinated through domain events — never through a
    cross-aggregate transaction. Sole sanctioned exception: a synchronous
    published-interface command where a phase exit criterion demands
    cross-context atomicity inside one local process — currently only
    Point of Sale → Inventory `DeductStock`/`RestoreStock` (P007 "atomic stock
    deduction, no partial sales"). The never-below-zero invariant still lives
    inside Inventory's `StockLevel` aggregate, no tables are shared, and this
    seam MUST become a reservation saga if the contexts ever deploy separately
  - **Entities vs Value Objects**: model as an Entity only when identity persists
    across attribute changes; otherwise prefer an immutable Value Object (dosage,
    money, address, code) — replace, never mutate
  - **No anemic models** — invariants and business rules MUST live inside
    entities, value objects, and aggregate roots; domain services orchestrate and
    MUST NOT hold logic that belongs on the model. Data-bag objects with rules
    scattered across services are forbidden
  - **Factories MUST enforce invariants** so an aggregate cannot be constructed
    in an invalid state (an invalid instance MUST be unrepresentable)
  - **Repository interfaces belong to the domain layer; implementations to
    infrastructure.** Repository methods MUST speak the ubiquitous language
    (`FindPendingPrescriptions()`, not `GetByStatus(3)`)
- Domain events MUST be named in the past tense as immutable facts
  (`PrescriptionDispensed`, `SpecimenCollected`, `AppointmentScheduled`) — a
  published event MUST NOT be retracted or mutated. Internal domain events stay
  within a bounded context; integration events that cross a context boundary MUST
  pass through that boundary's published language and anti-corruption layer
- **A bounded context is a model boundary, not a deployment unit** — a context
  MUST NOT be equated with, or prematurely split into, a microservice purely for
  deployment; the modular monolith is the default (see Technology Stack)
- **Strategic design — every bounded context MUST be classified** so engineering
  effort matches business value:
  - **Core Domain** (deepest modeling, richest behavior, best engineers):
    Personal Health, Clinical Records, Prescriptions — the patient-owned-data
    consumer differentiation and the safety-critical clinical logic that
    differentiate Balsm (reinforces Principle I)
  - **Supporting Subdomains** (build, but do not over-engineer): Provider
    Directory, Entity Management, Inventory, Point of Sale, Customer Relations,
    Appointment, Pharmacy, Billing & Finance, Labs, Radiology, Care Delivery,
    Charitable Donations, Balsm Network, Marketplace
  - **Generic Subdomains** (prefer buy / open-source over custom modeling):
    Identity & Access, Messaging & Notifications, Platform Access
  - Classification MUST be revisited each milestone — today's differentiator may
    become tomorrow's commodity
- Simple CRUD contexts (User Profile, Announcements) MUST remain lightweight —
  do not over-engineer with unnecessary patterns
- The 20 canonical bounded contexts, organized by data-ownership plane
  (ADR-10), are:
  - **Consumer plane** (patient-owned PHI): Personal Health, Provider Directory
  - **Provider plane** (entity-owned data): Entity Management, Inventory,
    Point of Sale, Customer Relations, Appointment, Clinical Records,
    Prescriptions, Pharmacy, Billing & Finance, Labs, Radiology, Care Delivery,
    Charitable Donations
  - **Platform plane** (Balsm-owned, non-PHI): Balsm Network, Platform Access,
    Marketplace
  - **Cross-plane**: Identity & Access, Messaging & Notifications
  - **Provisional** (candidates only — confirmed or dissolved at the P021 spec;
    modules MUST NOT map to them): Community, Population Insights
- The canonical decomposition behind these contexts lives in the
  [`architecture/`](../../architecture/) folder —
  [`bounded-contexts/`](../../architecture/bounded-contexts/README.md) (context
  map + one canvas per context: aggregates, events, relationships, module and
  phase mappings),
  [`subdomain-map.md`](../../architecture/subdomain-map.md),
  [`subdomain-classification.md`](../../architecture/subdomain-classification.md),
  and the routing strategies. Every planning phase (`/speckit.plan` Phase 0
  research and the Constitution Check) MUST consult it before assigning a
  feature to a context. On conflict this constitution prevails and the
  architecture doc MUST be corrected in the same change
- **Implemented modules MUST map to the canonical contexts** — a delivery phase
  MAY decompose into a different working module set (e.g., the patient-app
  MVP's Account, Auth, Sessions, EmergencyQr, Geofence, Disclosure, Deletion
  modules → Identity & Access and Personal Health; the pharmacy track's POS →
  Point of Sale and Customer → Customer Relations), but each implemented module
  MUST be explicitly mapped to exactly one of the canonical bounded contexts in
  the owning repo's architecture docs (see the Module → Context Mapping table
  in [`bounded-contexts/README.md`](../../architecture/bounded-contexts/README.md)).
  An unmapped module is an architecture defect; a module that cannot be mapped
  signals a missing or wrong context and MUST trigger a constitution
  amendment, not a silent 21st context

### V. Offline-First, Cloud-Enhanced

The core application MUST work fully offline for day-to-day operations. Cloud
connectivity enhances but MUST NOT gate core functionality.

- Three deployment modes MUST be supported: Local/Offline (free), Balsm Network
  Cloud (paid), Self-Hosted Remote (free hosting, paid network features)
- Cloud authentication is the default — user registration and entity creation go
  through Balsm Cloud Auth API for single source of identity truth
- Local authentication serves as offline fallback — when internet is unavailable,
  the local server issues JWT tokens using cached credentials
- Offline registrations MUST queue and sync to cloud on reconnection without
  data loss
- All operational features (POS, inventory, customers, prescriptions, reports)
  MUST work fully offline after login
- The same application codebase MUST run across all three deployment modes —
  deployment mode is configuration, not a different product
- Server discovery MUST support QR code scan, manual URL entry, and mDNS local
  network discovery
- The app MUST support connecting to multiple servers simultaneously with
  independent credentials, tokens, cached data, and sync state per connection
- HTTPS MUST be enforced for all non-local connections — HTTP is allowed only
  for private IP ranges and localhost

### VI. Test-First Discipline

Code without tests for new business logic MUST NOT be submitted.

- Unit tests are required for domain and business logic — target 80% coverage
- Integration tests are required for API endpoints and all critical workflows
- Every new API endpoint MUST have a corresponding integration test
- Tests MUST be deterministic — no reliance on external services, current time,
  or random values without seeding
- Prefer in-memory or test databases over mocking data access layers
- Never skip or disable existing tests to make new code pass
- Authentication endpoints (both cloud and local paths) require 100% test coverage
- Clinical safety workflows (prescription validation, drug interactions, dosage
  checks) require exhaustive edge case coverage
- **Repo-level CI quality gates are constitutional gates** — disabling,
  bypassing, or lowering any of them requires a documented amendment-level
  justification, not a PR note:
  - Backend (`Balsm-API-DotNet`): per-layer coverage — Domain + Application
    100%; Infrastructure + Api ≥90% line / ≥80% branch; overall ≥95% line —
    plus the quality-bar checks (async-only, no-PHI-in-logs, `Result<T>` on
    handlers)
  - Flutter (`balsm_app_flutter`): `balsm_boundary_lint` module-boundary rules
    (no module→module imports, core never depends on modules, domain never
    imports Flutter, no aggregate leak into presentation, no test_kit in
    release), PHI-leak fuzz tests, translation-completeness tests, and golden
    visual-regression tests
- The 80% coverage target above is a platform-wide floor; where a repo's own
  gates are stricter, the stricter gate governs

### VII. Performance as a Feature

Performance is a first-class requirement — not an afterthought. Every code change
MUST be evaluated for its performance impact.

- Unoptimized code is treated as a defect — measure before and after any change
  claimed to improve performance
- Use projections — select only needed columns, never `SELECT *` or load full
  entities for partial reads
- Prevent N+1 queries — use eager loading (`Include`/`ThenInclude`) or batch
  queries
- Pagination MUST happen at the database level — never load all records and
  paginate in memory
- Add indexes for columns used in WHERE, JOIN, or ORDER BY on tables expected
  to exceed 10K rows
- Use `AsNoTracking()` for all read-only queries in Entity Framework
- All I/O MUST be async — never block with `.Result`, `.Wait()`, or
  `.GetAwaiter().GetResult()`
- Pass and respect `CancellationToken` through controller → handler → repository
- Use `ConfigureAwait(false)` in library and service code
- Use `Task.WhenAll()` for parallel independent operations
- Use `ValueTask<T>` for methods that frequently complete synchronously
- Server MUST start in under 10 seconds on minimum-spec hardware
- SQLite MUST handle 50 concurrent read connections without degradation

### VIII. Multi-Platform Consistency

Four apps from a single Flutter codebase per app, one .NET backend — consistency
across platforms is mandatory.

- All Flutter apps (Balsm, Balsm Pro, Balsm Connect) MUST share a
  common core library: authentication, networking, theming, standardized
  templates, offline sync, messaging
- A single user account MUST access multiple apps based on roles — no separate
  accounts
- Full RTL/LTR support MUST be implemented — Arabic (ar) is the default
  language with locale variants (ar-EG, ar-SA, ar-AE) selectable per
  deployment; English (en) is secondary
- Locale-specific formats MUST be supported per jurisdiction:
  - **Egypt**: EGP currency (LE/ج.م prefix), DD/MM/YYYY dates, 12-hour AM/PM
    (ص/م), week starts Saturday, +20 phone (10-digit), National ID (14-digit
    with birth date, governorate, gender extraction)
  - **KSA**: SAR currency (ر.س/SR), Hijri calendar option alongside Gregorian,
    +966 phone (9-digit), Iqama / National ID (10-digit) with Luhn check
  - **UAE**: AED currency (د.إ/AED), Gregorian dates, +971 phone (9-digit),
    Emirates ID (15-digit, hyphenated `784-YYYY-NNNNNNN-C`) with checksum
    validation
- Patient-facing content MUST support internationalization — no hardcoded strings
- File names in Flutter MUST be `snake_case.dart` — never camelCase or PascalCase
- Every UI screen or component MUST have a Figma design before implementation
- The backend server MUST be packaged as cross-platform installers: .msi
  (Windows), .dmg (macOS), .deb + .AppImage (Linux)

### IX. Ubiquitous Language

Domain terminology MUST be used precisely and consistently across code, APIs,
database schemas, documentation, and UI.

- Use "appointment" not "reservation" or "booking"
- Use "admission" not "internal reservation"
- Use "dispensation" not "pharmacy fulfillment"
- Use "specimen" not "sample"
- Use "entity" for healthcare organizations (clinic, hospital, pharmacy, lab)
- Use "encounter" for clinical interactions between provider and patient
- Naming difficulty is a design signal — if a domain concept is hard to name,
  the model is probably wrong; fix the model, do not settle for a vague name
- Technical-only names are naming smells and MUST be rejected in review:
  `Manager`, `Helper`, `Processor`, `Handler`, `Util(s)`, `Data`, `Info` on a
  domain type hide the concept from the domain experts who could correct it
- The same term MAY carry different meanings in different bounded contexts (a
  "Patient" in Clinical Records is not the "Patient" record in Billing) — this is
  expected and acceptable; do not force a single shared definition across
  contexts, translate at the boundary instead (see Principle IV)
- Naming MUST be consistent across all repositories: Balsm-API-DotNet,
  balsm_app_flutter, website, Balsm-Core, and docs
- .NET naming follows: `Create{Entity}Command`, `Get{Entity}ByIdQuery`,
  `{Entity}{Action}Event`, `I{Entity}Repository`, `{Entity}Dto`
- Flutter naming follows: `{Feature}{Purpose}Widget`, `{Feature}Screen`,
  `{Feature}Bloc`, `{Entity}Model`, `{Feature}Service`

### X. AI Governance — Assistive Only

AI features MUST assist clinicians — they MUST never make autonomous clinical
decisions.

- All AI outputs in clinical contexts MUST be presented as suggestions requiring
  explicit human confirmation before action
- AI models MUST NOT be trained on Balsm patient data without explicit,
  informed, revocable patient consent
- Every AI recommendation MUST be explainable — the system MUST show the
  reasoning or data sources behind the suggestion
- AI features MUST degrade gracefully — when the AI service is unavailable,
  clinical workflows MUST continue without interruption
- CDSS probability rankings, screening tools, and risk assessments MUST display
  clear disclaimers that they are informational references, not diagnoses
- Ambient scribing MUST require explicit consent from both patient and provider
  — consent MUST be revocable at any time during the session
- AI inputs MUST be sanitized against prompt injection attacks
- An **AI model registry** MUST list every active model with its purpose,
  inputs, and known limitations — an unregistered model MUST NOT run in
  production
- **Admin kill switch**: every AI feature MUST be instantly disableable by an
  administrator without a redeploy; clinical workflows MUST continue unchanged
  when it is off
- Models MUST be evaluated for demographic bias before deployment; known gaps
  MUST be disclosed; AI MUST NOT drive eligibility determinations that could
  discriminate
- Every spec or plan introducing an AI feature MUST cite the applicable AI
  threat IDs (AI01–AI16 in `SYSTEM_THREAT_MODEL.md`) and confirm the BLOCKING
  mitigations are in place
- Refer to `AI_GOVERNANCE.md` for the complete governance framework

### XI. Certifications & Standards Compliance

All ideas, requirements, specs, plans, and code MUST be compliant with the
certifications and standards defined in `CERTIFICATIONS.md`.

- **Compliance starts at idea stage** — before writing a spec or plan for any
  feature that touches clinical data, lab results, medications, diagnoses, FHIR
  resources, or patient records, read `CERTIFICATIONS.md` and identify which
  standards apply
- **Specs MUST include a Certification Compliance section** identifying applicable
  standards (FHIR R4, LOINC, SNOMED CT, ICD-10, RxNorm, DPG, Egypt PDPL,
  KSA PDPL, UAE PDPL) and any new compliance obligations introduced by the
  feature
- **Plans MUST gate on certifications** — the Constitution Check in every
  `plan.md` MUST verify that the design satisfies all applicable code-level
  compliance rules from `CERTIFICATIONS.md Section 3`
- **Code MUST not be submitted** if it introduces medical codes, FHIR resources,
  clinical data structures, or patient data flows that are not compliant with
  `CERTIFICATIONS.md`
- The certification status table in `CERTIFICATIONS.md` MUST be updated when a
  certification is obtained or a new compliance action is taken
- Refer to `CERTIFICATIONS.md` for the sequenced application roadmap, code-level
  compliance rules, per-phase checklist, and evidence artifact registry

### XII. Open-Source Ecosystem & Community Stewardship

Balsm is an open-source health-tech ecosystem. Open-source is a foundational
commitment — not a marketing badge.

- **License**: All core repositories (Balsm-Core, Balsm-API-DotNet,
  balsm_app_flutter, website, docs) MUST be released under AGPL-3.0-or-later.
  License downgrades, re-licensing, or proprietary forks are forbidden without
  a constitutional amendment
- **License registry** — the per-repo license reality MUST be tracked and kept
  reconciled with this principle:
  - Currently AGPL-3.0-or-later: Balsm-Core, Balsm-API-DotNet,
    balsm_app_flutter
  - Known divergences requiring reconciliation (explicit amendment or
    relicense): website ships AGPL **plus a Balsm Anti-White-Label/SaaS
    addendum** (the addendum's restrictions are not OSI-open); docs is
    currently **MIT**, not AGPL
  - Peripheral/tooling repositories carrying no clinical logic (OpenWA — MIT,
    db_benchmark) MAY use permissive licenses
  - Introducing any **new** license divergence in a core repository is
    forbidden
- **Public-by-default**: The default visibility for new repositories and
  documentation MUST be public. Private repositories require an explicit
  documented justification (e.g., active security disclosure embargo)
- **No PHI in public artifacts**: Issues, pull requests, commits, public
  Discussions, screenshots, and demo data MUST NOT contain real PHI. Synthetic
  test data MUST be used for all public examples
- **Contribution discipline**: All external contributions MUST go through a
  signed-off (DCO `Signed-off-by:`) pull request. Maintainer review is required;
  agent-authored commits MUST be reviewed by a human before merge
- **No vendor lock-in**: Data export MUST be available in open standards (FHIR
  Bundle, CSV, JSON) for every patient and every entity — exit cost from Balsm
  MUST be zero
- **Transparent roadmap**: The phased delivery plan, milestones, and known
  limitations MUST be published. Roadmap changes MUST be reflected in
  `PHASED_DELIVERY_STEPS.md` within 7 days
- **Reproducible builds**: Every released installer (.msi, .dmg, .deb,
  .AppImage) MUST be reproducible from a tagged commit using documented build
  instructions. Build inputs (dependency versions, SDK versions) MUST be
  pinned
- **Upstream-first**: Bugs and improvements discovered in third-party
  open-source dependencies MUST be reported upstream before being patched
  locally — local patches are temporary, upstream contribution is the durable
  fix
- **Security disclosure**: A documented coordinated vulnerability disclosure
  process MUST exist (`SECURITY.md`) with a maximum 90-day embargo from
  acknowledged report to public patch

### XIII. Cross-Repository Rule & Skill Alignment

Balsm is a multi-repository family. Each repository carries its own agent rules
and skills that encode stack-specific standards below this constitution.
Planning MUST be repo-aware: before writing any spec or plan that touches a
stack, the planner MUST load and honor that stack's current rules and skills —
not this constitution alone — reading them from the stack's local relative
project directory first, and pulling from the git remote only as a fallback.

- **Identify the affected stacks** for every feature, then consult that stack's
  own rule and skill sources:
  - **Backend — `Balsm-API-DotNet`** (.NET modular monolith): `AGENTS.md`,
    `CLAUDE.md`, `.cursor/rules/*.mdc`, and the project-scoped `dotnet-skills`
    plugin
  - **Flutter apps — `balsm_app_flutter`** (Balsm, Balsm Pro, Balsm Connect):
    `AGENTS.md`, `CLAUDE.md`, and the `flutter-*` skills in `.claude/skills/`
  - **Website — `website`** (Next.js): `AGENTS.md`, `.cursorrules`, and the
    `impeccable` skill
  - **Governance & docs — `Balsm-Core` / `docs`**: `AGENTS.md`,
    `agents/rules/CODING_STANDARDS.md`, this constitution, the
    [`architecture/`](../../architecture/) folder (subdomain map,
    classification, routing strategies — mandatory planning-phase input per
    Principle IV), and `docs/AGENTS.md`
  - **Shared toolkit — `balsm-ai` plugin**: cross-cutting skills used in every
    repo (`domain-driven-design`, `balsm-design`, the security skill set) plus
    the `balsm-reviewer` agent; `Balsm-AI/canonical/` + `plugin/` are the
    source of truth, distributed to sibling repos via `sync.mjs` — hand-editing
    a generated `AGENTS.md` is a defect, fix the canonical source instead
  - **Cloud data platform — `supabase`**: PostgreSQL schema migrations,
    RLS policies, and Deno edge functions for the patient app's non-PHI cloud
    tier — migrations and `config.toml` are governed artifacts subject to
    Principles II, III, and XIV
  - **Messaging gateway — `OpenWA`** (WhatsApp API gateway, NestJS): the
    third-party-channel rules in Principle XIV govern every integration with it
  - **Planning — `Balsm-Draft`** and the root workspace meta
    (`balsm.code-workspace`, root `.github/`, `.claude/`, `.specify/`): carry
    the same generated rule set; planning artifacts there are drafts until
    promoted into `Balsm-Core`
  - **Tooling — `db_benchmark`**: storage-engine evaluation harness;
    non-governing, but storage-engine decisions MUST cite its findings
- **Local working directory is the source of truth** — the sibling repos are
  checked out locally alongside `Balsm-Core` (e.g. `../Balsm-API-DotNet`,
  `../balsm_app_flutter`, `../website`). Planning MUST read each affected repo's
  rules and skills from its **local relative project directory first**; the
  local working tree (including uncommitted local edits) takes priority over any
  git remote, because it reflects what is actually being built here and now
- **Git remote is fallback, not primary** — `git pull` / `git fetch` a sibling
  repo only when its local checkout is missing, or to refresh a local copy known
  to be behind. Never let a remote pull overwrite or override newer local
  working-tree rules. Refresh installed skill plugins likewise from their local
  source. Planning against stale per-repo rules or skills is a planning defect,
  not a detail
- **Cross-stack features MUST reconcile all touched stacks** — a change spanning
  API + Flutter + website MUST satisfy each stack's rules simultaneously; naming
  and contracts MUST stay consistent across repos per Principle IX
- **Precedence on conflict**: this constitution wins (Governance "Supremacy");
  repo-local rules govern stack-specific detail beneath it; skills supply
  procedure and MUST NOT be read as overriding a rule or principle
- **Gate**: the Constitution Check in every `plan.md` MUST list the stacks the
  feature touches and confirm each affected stack's current rules and skills were
  pulled and consulted before Phase 0 research

### XIV. External Integration & Messaging Surfaces

Every surface where Balsm data crosses to a third-party service or channel —
the WhatsApp gateway (OpenWA), webhooks, cloud edge functions, email/SMS — is
a governed boundary, not plumbing.

- **No PHI over third-party messaging channels** — WhatsApp, SMS, and email
  carry appointment reminders, OTPs, and generic notifications only; clinical
  content MUST travel as a deep link into the authenticated app, never as
  message body text
- Patient consent MUST be recorded per channel before the first outbound
  message; opt-out MUST take effect immediately and be auditable
- Webhooks (inbound and outbound) MUST be HMAC-signed and verified — unsigned
  or badly-signed payloads MUST be rejected and logged
- Gateway credentials MUST be scoped to least-privilege permissions, hashed at
  rest, IP-allowlisted where supported, and rotatable without downtime
- Every outbound message and every gateway API operation MUST produce an audit
  log entry (Principle II audit rules apply)
- **Edge functions are the sole write path for sensitive cloud fields** (e.g.,
  the encrypted `date_of_birth`) — clients MUST NOT write such fields
  directly; server-side validation, throttling, and encryption happen in the
  function
- Cloud tables MUST be RLS deny-by-default — a user sees only their own rows;
  service-role bypass is reserved for documented system operations (purge
  crons, regulator access) and each bypass path MUST be enumerated in the
  schema docs
- An integration surface added to any repo MUST appear in the feature's spec
  with its data classification (PHI / PII / non-PHI) and its threat-model IDs

## Technology Stack & Constraints

- **License**: AGPL-3.0-or-later for all core repositories (see Principle XII)
- **Backend**: .NET 10.0 modular monolith, C#, Entity Framework Core 10.0.5, SQLite
  (local/embedded), PostgreSQL (cloud); dual deployment modes from one binary —
  Standalone (on-prem: Supervisor admin module, mDNS discovery, self-signed
  HTTPS, self-update) and Cloud (stateless, `$PORT`-driven, Docker non-root,
  Railway / Cloud Run compatible)
- **Frontend Apps**: Flutter (Dart) — iOS, Android, Web, macOS, Windows, Linux;
  melos monorepo (core package + module packages + `balsm_boundary_lint` + app
  shell); on-device storage drift + SQLCipher (encryption mandatory)
- **Website**: Next.js (TypeScript) — marketing and public-facing; deployed to
  Cloudflare Pages via `opennextjs-cloudflare`; WCAG AA minimum; Arabic-first
  RTL-native i18n; carries no PHI or clinical data
- **Cloud data platform**: Supabase — PostgreSQL + RLS + Deno edge functions;
  non-PHI tier only (Principle II PHI topology); region placement governed by
  Principle III residency
- **Messaging**: OpenWA WhatsApp gateway (Node.js / NestJS) — governed by
  Principle XIV
- **Observability**: Sentry on backend and Flutter apps — PII scrubbing
  mandatory per Principle II (`SendDefaultPii=false`, no body capture)
- **API Style**: RESTful, URI-versioned (`/api/v1/`), consistent error responses;
  every module exposes an anonymous liveness-only health endpoint
- **API contract artifacts**: OpenAPI 3.1 specs generated from code annotations
  (never hand-edited) plus per-module Insomnia v5 collections with synthetic
  data only; breaking changes tagged `x-balsm-breaking` and gated by a
  breaking-change diff in CI
- **Idempotency**: all write endpoints MUST be idempotent; client-generated
  idempotency keys required for creates — non-negotiable for payments and
  prescriptions
- **Authentication**: JWT with cloud-first + local-fallback dual-mode
- **Database Migrations**: Reversible — both `Up()` and `Down()` required,
  descriptively named; provider-specific migration projects (SQLite vs Npgsql)
  kept separate
- **Error Handling**: `Result<T>` for expected failures, domain-specific
  exceptions for unexpected failures, FluentValidation for API input validation
- **Logging**: Structured (key-value), always include CorrelationId, UserId,
  Action, Module — never log PHI
- **Medical Standards**: ICD-10, CPT, HCPCS, SNOMED CT, LOINC, RxNorm, HL7
  FHIR R4, DICOM — code-level compliance rules in `CERTIFICATIONS.md`
- **MENA Localization**: ar-EG, ar-SA, ar-AE, en — per Principle VIII; no
  hardcoded strings; jurisdiction-specific currency, calendar, ID, and phone
  validators
- **Dependency Injection**: Constructor injection only — never instantiate
  dependencies with `new` inside business logic
- **SOLID Principles**: Enforced — Single Responsibility, Open/Closed, Liskov
  Substitution, Interface Segregation, Dependency Inversion

## Development Workflow & Quality Gates

- Every feature, bug fix, and hotfix MUST be developed on a separate branch —
  never commit directly to `main`
- Commit after completing every task — do not batch multiple tasks into a single
  commit
- Commits MUST be focused (one logical change) with clear, descriptive messages
- All commits MUST carry a `Signed-off-by:` trailer (DCO) per Principle XII
- `--force`, `--no-verify`, and destructive git operations require explicit
  approval
- Do not commit generated files, build artifacts, or environment-specific config
- When a business requirement changes, ALL affected documentation MUST be updated
  alongside code: BUSINESS_FEATURES.md, PHASED_DELIVERY_STEPS.md, GLOSSARY.md,
  NON_FUNCTIONAL_REQUIREMENTS.md, CERTIFICATIONS.md (if standards or certification
  status changes), SECURITY.md (if threat surface changes), and relevant agent
  rules
- Code changes without corresponding documentation updates are incomplete
- All list API endpoints MUST support pagination, filtering, and sorting
- API responses MUST use a consistent error response structure with correlation
  IDs
- Non-trivial backend changes require C4 diagrams (Mermaid) before
  implementation per the backend repo rules — new bounded context: Levels 1–2;
  cross-module flow: Levels 3–4; skip only for typo-level changes
- API contract changes MUST run the breaking-change diff against the previous
  OpenAPI spec and flag every consumer (Flutter apps, website) — unresolved
  contract drift blocks merge (see Principle XIII)
- Accepted security risks (e.g., an unpatchable CVE in a dependency) MUST be
  documented in the owning repo with scope, rationale, and a migration path —
  silent suppression is forbidden
- The phased delivery model (20 phases, 4 tiers) MUST be followed — each phase
  has explicit exit criteria that MUST pass before the next phase begins
- MENA regulatory tracking: a documented owner MUST monitor Egypt (PDPC),
  KSA (SDAIA, SFDA, MOH), and UAE (UAE Data Office, MOHAP, DHA, DOH)
  regulatory bulletins; material changes trigger a constitution amendment per
  the Governance "Regulatory updates" clause

## Governance

This constitution is the supreme governing document for the Balsm Healthcare
Platform. It supersedes all other practices, conventions, and ad-hoc decisions.

- **Supremacy**: When any document, rule, or practice conflicts with this
  constitution, the constitution prevails
- **Compliance verification**: All pull requests and code reviews MUST verify
  compliance with these principles — non-compliance MUST be flagged and resolved
  before merge
- **Amendment process**: Amendments require (1) written proposal documenting the
  change and rationale, (2) impact analysis on dependent artifacts, (3) version
  bump following semantic versioning, and (4) propagation to all affected
  templates and documentation
- **Versioning policy**: MAJOR for backward-incompatible governance changes or
  principle removals; MINOR for new principles or materially expanded guidance;
  PATCH for clarifications, wording, and non-semantic refinements
- **Locked principles**: Principles tagged `🔒 LOCKED` (currently Principle I —
  Patient Safety First) have a raised amendment bar:
  - Any weakening, narrowing, removal, or rewording that changes meaning of a
    locked principle's bullets MUST be treated as backward-incompatible and
    requires a **MAJOR** version bump regardless of edit size
  - MAJOR bump on a locked principle additionally requires (a) written rationale
    referencing the safety incident, regulatory change, or evidence motivating
    the change, (b) sign-off from the project Patient Safety Officer and at
    least one external clinical reviewer, (c) a published 14-day public review
    window on the open-source repository per Principle XII, and (d) updated
    `CERTIFICATIONS.md` impact analysis
  - Pure strengthening additions to a locked principle (new safety guarantees
    that do not remove or relax any existing rule) follow normal MINOR / PATCH
    rules but still require Patient Safety Officer review
  - A locked principle MUST NOT be silently re-tagged as unlocked — removing the
    🔒 marker itself is a MAJOR change under this clause
- **Compliance review**: Quarterly review of constitution compliance across all
  repositories — findings documented and tracked to resolution
- **Runtime guidance**: Refer to `agents/rules/AGENTS.md` for detailed agent
  instructions and `agents/rules/CODING_STANDARDS.md` for technical patterns
- **Regulatory updates**: When Egypt, KSA, UAE, or other MENA jurisdiction
  regulations change, this constitution MUST be updated within 30 days to
  reflect new requirements
- **Open-source stewardship**: License changes, repository visibility downgrades,
  and any restriction on data export formats require a MAJOR version bump and
  an explicit amendment proposal — these touch Principle XII's non-negotiable
  guarantees
- **Complexity justification**: Any deviation from simplicity (Principle IV
  tactical patterns exception, new abstractions) MUST be justified in the PR
  description with measurable benefit

**Version**: 1.8.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-07-10
