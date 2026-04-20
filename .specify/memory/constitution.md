<!--
  SYNC IMPACT REPORT
  Version change: 0.0.0 → 1.0.0
  Bump rationale: MAJOR — initial constitution adoption for the Balsm ecosystem

  Modified principles: N/A (initial version)

  Added sections:
    - Core Principles (10 principles)
    - Technology Stack & Constraints
    - Development Workflow & Quality Gates
    - Governance

  Removed sections: N/A (initial version)

  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ Aligned (Constitution Check section present)
    - .specify/templates/spec-template.md         ✅ Aligned (user stories, requirements, edge cases)
    - .specify/templates/tasks-template.md        ✅ Aligned (phased task structure, checkpoints)

  Follow-up TODOs: None
-->

# Balsm Healthcare Platform Constitution

## Core Principles

### I. Patient Safety First (NON-NEGOTIABLE)

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
  RxNorm, HL7 FHIR, DICOM) MUST be used correctly — approximations are forbidden
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
- Brute-force protection: 5 failed login attempts → 15-minute lockout
- Device registry with remote revocation capability MUST be maintained
- OWASP Top 10 vulnerabilities MUST be prevented — every code change MUST be
  evaluated against this list

### III. Regulatory Compliance

The platform MUST comply with healthcare regulations in Egypt and GCC markets.
When regulation conflicts with a feature request, regulation wins.

- **Egypt**: PDPL (Law 151/2020), Medical Practice Law, Law 182/1960 (narcotics),
  EDA medical device regulations, Telecommunications Law
- **Saudi Arabia**: PDPL (Royal Decree M/19), SFDA Medical Device Regulations
  (including SaMD classification), MOH Telemedicine Regulations,
  Anti-Corruption Commission regulations, Anti-Cyber Crime Law
- **GCC**: WHO Ethical Criteria for Medicinal Drug Promotion, data residency
  requirements per jurisdiction
- Controlled substance tracking MUST be implemented before pharmacy module
  launch — deferring it is not acceptable (CR-01)
- Prescription attachment for controlled substances MUST default to **required**
  (opt-out, not opt-in) (DR-02)
- Pharmaceutical analytics MUST NOT expose individual prescriber patterns that
  could facilitate kickback schemes — minimum aggregation thresholds and explicit
  anti-kickback prohibitions MUST be enforced (CR-02)
- Any AI feature that provides clinical decision support MUST undergo SaMD
  classification assessment with SFDA and EDA before deployment (CR-03)
- Cross-border telemedicine MUST verify that the provider is licensed in the
  patient's jurisdiction — unlicensed cross-border consultations MUST be blocked
- Consent MUST be collected and verified before any data sharing operation
- Data residency requirements MUST be respected — patient data MUST remain in
  the jurisdiction specified by applicable law

### IV. Modular Monolith with Domain-Driven Design

The system follows a modular monolith architecture with 13 bounded contexts.
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
  (HL7/FHIR, DICOM, insurance APIs)
- Tactical DDD patterns (aggregates, domain events, value objects, repositories,
  domain services) MUST be applied in complex contexts: Clinical Records,
  Prescriptions, Billing, Labs, Radiology
- Simple CRUD contexts (User Profile, Announcements) MUST remain lightweight —
  do not over-engineer with unnecessary patterns
- The 13 bounded contexts are: Identity & Access, Entity Management, Appointment,
  Clinical Records, Prescriptions, Pharmacy, Labs, Radiology, Billing & Finance,
  Inventory, Messaging & Notifications, Charitable Donations, Marketplace

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

Six apps from a single Flutter codebase per app, one .NET backend — consistency
across platforms is mandatory.

- All Flutter apps (Patient, Pro, Dawaa, Hub, Connect, Website) MUST share a
  common core library: authentication, networking, theming, standardized
  templates, offline sync, messaging
- A single user account MUST access multiple apps based on roles — no separate
  accounts
- Full RTL/LTR support MUST be implemented — Arabic (ar-EG) is the default
  language, English (en) is secondary
- Egypt-specific formats MUST be supported: EGP currency (LE prefix), DD/MM/YYYY
  dates, 12-hour AM/PM (ص/م), week starts Saturday, Egyptian phone validation
  (+20, 10-digit), National ID validation (14-digit with birth date, governorate,
  and gender extraction)
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
- Naming MUST be consistent across all repositories: Balsm-API-DotNet,
  balsm_app_flutter, website, Balsm-Roadmap, and docs
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
- Refer to `AI_GOVERNANCE.md` for the complete governance framework

## Technology Stack & Constraints

- **Backend**: .NET 8+ modular monolith, C#, Entity Framework Core, SQLite
  (local/embedded), PostgreSQL (cloud)
- **Frontend Apps**: Flutter (Dart) — iOS, Android, Web, macOS, Windows, Linux
- **Website**: Next.js (TypeScript) — marketing and public-facing
- **API Style**: RESTful, URI-versioned (`/api/v1/`), consistent error responses
- **Authentication**: JWT with cloud-first + local-fallback dual-mode
- **Database Migrations**: Reversible — both `Up()` and `Down()` required,
  descriptively named
- **Error Handling**: `Result<T>` for expected failures, domain-specific
  exceptions for unexpected failures, FluentValidation for API input validation
- **Logging**: Structured (key-value), always include CorrelationId, UserId,
  Action, Module — never log PHI
- **Medical Standards**: ICD-10, CPT, HCPCS, SNOMED CT, LOINC, RxNorm, HL7
  FHIR, DICOM
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
- `--force`, `--no-verify`, and destructive git operations require explicit
  approval
- Do not commit generated files, build artifacts, or environment-specific config
- When a business requirement changes, ALL affected documentation MUST be updated
  alongside code: BUSINESS_FEATURES.md, PHASED_DELIVERY_STEPS.md, GLOSSARY.md,
  NON_FUNCTIONAL_REQUIREMENTS.md, and relevant agent rules
- Code changes without corresponding documentation updates are incomplete
- All list API endpoints MUST support pagination, filtering, and sorting
- API responses MUST use a consistent error response structure with correlation
  IDs
- The phased delivery model (20 phases, 4 tiers) MUST be followed — each phase
  has explicit exit criteria that MUST pass before the next phase begins

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
- **Compliance review**: Quarterly review of constitution compliance across all
  repositories — findings documented and tracked to resolution
- **Runtime guidance**: Refer to `agents/rules/AGENTS.md` for detailed agent
  instructions and `agents/rules/CODING_STANDARDS.md` for technical patterns
- **Regulatory updates**: When Egyptian or GCC regulations change, this
  constitution MUST be updated within 30 days to reflect new requirements
- **Complexity justification**: Any deviation from simplicity (Principle IV
  tactical patterns exception, new abstractions) MUST be justified in the PR
  description with measurable benefit

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
