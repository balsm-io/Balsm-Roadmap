# Domain-Driven Design Review

Review all changed or staged files for DDD and modular monolith violations in the Balsm platform.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file and analyze for the following:

### Bounded Context Boundaries
The system has 20 canonical bounded contexts (+2 provisional) — the authoritative list with aggregates lives in `agents/rules/AGENTS.md` §2.2 and `architecture/bounded-contexts/README.md`. Verify no boundary violations:
- **Personal Health** (Core) — HealthProfile, TimelineEntry, MedicationSchedule, EmergencyCardSnapshot
- **Provider Directory** — ProviderListing, CatalogProjection
- **Entity Management** — Workspace, Entity, Branch, Department, Room, Bed
- **Inventory** — CatalogItem, StockLevel, PurchaseEntry, ControlledSubstanceClassification
- **Point of Sale** — Sale, Basket, SaleReturn, CashDrawerSession, Receipt
- **Customer Relations** — Customer, PaperPrescriptionNote
- **Appointment** — Appointment, Slot, Schedule, WaitingList, HouseVisit
- **Clinical Records** (Core) — Encounter, PatientRecord, ClinicalNote, Referral, Consent, AuditTrailEntry
- **Prescriptions** (Core) — Prescription, Medication, DrugInteraction, RecurringPrescription
- **Pharmacy** — Dispensation, QRVerification, DeliveryOrder
- **Billing & Finance** — Invoice, Claim, Payment, InsurancePolicy, VATReport
- **Labs** — Analyte, LabTest, Bundle, ReferenceRange, LabOrder, Specimen, AnalyteResult
- **Radiology** — ImagingOrder, Study, RadiologyReport
- **Care Delivery** — Admission, BedOccupancy, DischargeSummary, TeleconsultSession
- **Charitable Donations** — Charity, DonationCase, Donation
- **Balsm Network** — FederationPairing, SharingPolicy, Subscription, Entitlement
- **Platform Access** — OAuthClient, ConsentGrant, ApiKey, WebhookSubscription
- **Marketplace** — AddOn, AddOnDeveloper, AddOnReview
- **Identity & Access** — User, Account, Session, DeletionRequest, Permission, PermissionGroup, Guardianship
- **Messaging & Notifications** — Conversation, Message, Notification

Sole sanctioned synchronous cross-context call: Point of Sale → Inventory `DeductStock`/`RestoreStock` (constitution v1.8.0 Principle IV). Everything else crossing a boundary must be an integration event.

### Module Structure Violations
- Cross-module project references (modules must depend on shared contracts only)
- Direct access to another module's database tables or internal classes
- Code in one module importing types from another module's Domain/Application layer
- Shared database tables between contexts (each context owns its schema)

### Communication Violations
- Direct method calls between bounded contexts (must use domain events)
- Missing anti-corruption layers for external system integrations (HL7/FHIR, DICOM, insurance APIs)
- Tight coupling through shared entities across contexts

### Ubiquitous Language
- Wrong terminology: "reservation" instead of "appointment", "booking" instead of "appointment", "sample" instead of "specimen", "fulfillment" instead of "dispensation"
- Inconsistent naming between code, API endpoints, database schemas, and documentation
- Invented abbreviations or synonyms for domain terms

### Tactical Patterns
- Complex contexts (Clinical Records, Prescriptions, Billing, Labs, Radiology) missing DDD patterns: aggregates, domain events, value objects, repositories, domain services
- Simple CRUD contexts over-engineered with unnecessary DDD patterns
- Domain logic in application services, handlers, or controllers instead of domain models
- Anemic domain models (entities with only getters/setters and no behavior)

### Code Organization
- .NET: Module not under `src/Modules/{ContextName}/` with proper layer split (Domain/Application/Infrastructure/Api)
- Flutter: Package not under `packages/{context_name}/` with feature-based organization
- Shared types not in `Balsm.SharedKernel` (.NET) or `packages/shared/` (Flutter)

3. For each violation, report:
   - File path and line number
   - Violation type and severity
   - Which bounded contexts are involved
   - Suggested fix

4. If no issues are found, confirm the code follows DDD conventions.
