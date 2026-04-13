# Legacy System Migration & Integration Guide
**Balsm Healthcare Platform - Migration, Integration & Federation**

---

## Overview
This guide covers three scenarios for connecting hospitals and healthcare entities with Balsm:

1. **Full Migration**: Hospitals transitioning FROM legacy HIS/EMR systems TO Balsm Cloud as their primary system. Data is migrated, legacy system is retired.

2. **Integration (No Migration)**: Clients keeping their existing systems and CONNECTING them to Balsm modules via APIs, HL7, or other interfaces. Both systems coexist.

3. **Self-Hosted + Federation**: Clients deploying Balsm (open source) on their own infrastructure and CONNECTING to the Global Balsm Network for cross-hospital features while keeping all clinical data local.

Choose the right approach based on client needs, existing system capabilities, data sovereignty requirements, and strategic goals.

---

## Migration Strategy

### Phased Approach (RECOMMENDED)
**Subsystem-by-subsystem migration is the industry best practice** for healthcare systems.

#### Why Phased Migration?
- ✅ **Patient Safety**: Minimizes risk and ensures care continuity during transition
- ✅ **Staff Adoption**: Teams learn gradually without overwhelming them
- ✅ **Early Detection**: Issues identified and resolved before scaling hospital-wide
- ✅ **Rollback Safety**: Can revert individual subsystems without affecting entire hospital
- ✅ **Validation**: Data accuracy verified per subsystem before proceeding
- ✅ **Resource Management**: IT team focuses on one area at a time

#### Recommended 4-Phase Migration Sequence

**Phase 1: Back Office Operations (Lowest Risk)**
- Start with: Scheduling, registration, billing, HR/payroll, inventory management
- Why first: No direct patient care impact, staff can adapt without clinical pressure
- Timeline: 2-4 weeks per subsystem
- Success criteria: Staff comfortable with new system, billing cycles complete successfully

**Phase 2: Outpatient Services**
- Migrate: Outpatient clinics, outpatient pharmacy, outpatient labs, radiology
- Why second: Lower patient volumes, scheduled appointments, less urgency than inpatient
- Timeline: 4-8 weeks per department
- Success criteria: Smooth patient check-ins, prescriptions filled without delays

**Phase 3: General Inpatient Wards**
- Migrate: Non-critical inpatient departments, nursing stations, general wards
- Why third: Higher complexity but system proven stable by this phase
- Timeline: 6-10 weeks per department group
- Success criteria: Nursing workflows smooth, medication administration accurate

**Phase 4: Critical Care (Last)**
- Migrate: ER, ICU, OR, NICU, Trauma only after system proven stable
- Why last: Highest risk, life-critical workflows must be flawless
- Timeline: 8-12 weeks with extensive parallel operation period
- Success criteria: Zero clinical errors, staff confidence high, emergency workflows tested

#### Migration Timeline Estimates
- **Small Hospital** (<100 beds): 3-6 months total
- **Medium Hospital** (100-500 beds): 6-12 months total
- **Large Hospital** (>500 beds): 12-18 months total

#### Per-Subsystem Migration Steps
Each subsystem follows this sequence:
1. **Data Migration** → Extract and import historical data
2. **Staff Training** → Role-specific training for new system
3. **Parallel Operation** → Run both systems side-by-side (2-4 weeks typical)
4. **Validation** → Verify data accuracy and workflow completeness
5. **Cutover** → Go-live with new system, legacy system becomes read-only backup
6. **Stabilization** → 24/7 support for first week post-cutover

#### Cutover Timing Best Practices
- Schedule during **low-volume periods** (avoid Mondays, holidays, peak flu season)
- **Weekend cutovers** preferred for non-emergency departments
- **Night shifts** for emergency/critical care (lowest patient volume)
- Avoid major events (conferences, staff vacations, system-wide code updates)

---

### Big Bang Migration (NOT RECOMMENDED)

**Only suitable for very small clinics (<5 staff)**

#### Why Big Bang Fails in Hospitals
- ❌ **Catastrophic Failure Risk**: Single point of failure affects entire hospital
- ❌ **Staff Overwhelm**: Too much to learn at once, increases errors
- ❌ **No Rollback Path**: Reverting entire hospital is operationally impossible
- ❌ **Patient Safety Risk**: System-wide issues can compromise care quality
- ❌ **Support Overload**: IT team cannot handle hospital-wide issues simultaneously

---

## Test Environment & Validation (MANDATORY)

### Dedicated Staging Environment Per Hospital
**Every hospital MUST have a standalone test/staging environment before production migration.**

#### Environment Architecture
- **Production Environment**: Live hospital system (not touched until final cutover)
- **Staging Environment**: Isolated copy of Balsm system for this specific hospital
- **Test Data**: Migrated data from legacy system loaded into staging
- **Complete Isolation**: Staging has no connection to production - zero risk

#### Migration Testing Workflow

**Step 1: Initial Migration to Staging**
1. Extract data from legacy system
2. Transform and load data into staging environment
3. Staging environment is a complete, functional Balsm instance
4. Contains ONLY this hospital's data (multi-tenant isolation)

**Step 2: Data Integrity Validation**
- Run automated data quality checks (see Data Quality section)
- Compare record counts: legacy vs. staging
- Verify referential integrity (patient → visits → prescriptions all linked)
- Check data completeness (required fields populated)
- Validate business rules (dates logical, codes valid)

**Step 3: User Acceptance Testing (UAT)**
- **Clinical staff testing**: Doctors, nurses test real workflows
- **Administrative testing**: Front desk, billing staff test their processes
- **Scenario-based testing**: Simulate typical patient visit, emergency, discharge
- **Performance testing**: Run system under realistic load
- **Integration testing**: Verify pharmacy, lab, radiology interfaces work

**Step 4: Staff Training on Staging**
- Staff train using REAL migrated data (their own patients, familiar cases)
- Practice workflows in safe environment without patient care risk
- Build confidence before production go-live
- Identify workflow issues early

**Step 5: Issue Resolution & Re-Migration**
- Fix any data quality issues discovered during testing
- Correct ETL pipeline issues
- Re-run migration to staging with fixes applied
- Repeat validation until 100% success criteria met

**Step 6: Production Migration**
- ONLY after staging validation successful
- Extract fresh data from legacy system (includes recent updates since staging)
- Run proven ETL pipeline (same process that worked in staging)
- Load into production environment
- Final validation checks on production data

#### Benefits of Test Environment Approach
- ✅ **Zero Production Risk**: No chance of corrupting live production system
- ✅ **Safe Testing**: Staff experiment without fear of breaking anything
- ✅ **Issue Discovery**: Find and fix problems before they impact patient care
- ✅ **Training Value**: Staff learn on real data, not fake demos
- ✅ **Stakeholder Confidence**: Leadership sees working system before committing
- ✅ **Regulatory Compliance**: Demonstrate due diligence for auditors

#### Staging Environment Lifecycle
- **Created**: 2-3 weeks before planned go-live
- **Active Testing**: 1-2 weeks of intensive UAT
- **Training Period**: 1-2 weeks of staff training
- **Go-Live**: Migrate to production using proven process
- **Post Go-Live**: Keep staging environment for 30 days as reference
- **Decommission**: Archive or repurpose after successful stabilization

#### Success Criteria Checklist
Before migrating to production, staging must demonstrate:
- [ ] >99.9% data migration accuracy (verified by reconciliation reports)
- [ ] All critical workflows tested and passing
- [ ] All user roles trained and signed off
- [ ] Performance meets or exceeds legacy system
- [ ] No critical or high-severity bugs outstanding
- [ ] Leadership approval obtained
- [ ] IT team confident in migration process

---

## Data Migration Tools & Capabilities

### Supported Legacy Systems
- **Epic** (EpicCare, Beacon, Cadence, Resolute)
- **Cerner** (Millennium, PowerChart, FirstNet)
- **Meditech** (Expanse, 6.x, MAGIC)
- **AllScripts** (Sunrise, TouchWorks, Professional)
- **McKesson** (Paragon, Horizon, Star)
- **Proprietary/Custom Systems** (via custom data mapping)

### Data Import Methods

#### 1. HL7 Message Parsing
- Parse HL7 v2.x and v3 message formats
- Import ADT (patient demographics), ORM (orders), ORU (results), DFT (billing)
- Automatic message validation and error reporting

#### 2. DICOM Image Migration
- Import radiology images (X-ray, CT, MRI, ultrasound)
- Import pathology slides and endoscopy images
- Preserve image metadata (patient ID, study date, modality)
- Automatic DICOM tag validation

#### 3. API-Based Migration
- RESTful API integration for modern systems
- SOAP web services for older systems
- OAuth 2.0 authentication support
- Rate limiting and retry logic

#### 4. Database Direct Connection
- SQL Server, Oracle, MySQL, PostgreSQL connectivity
- Read-only access to prevent legacy data corruption
- Intelligent schema detection and mapping

#### 5. File-Based Import
- CSV/Excel for structured tabular data
- PDF import for scanned documents and reports
- Image files (JPEG, PNG) for photos and scanned records

### Data Types Migrated

#### Core Clinical Data
- **Patient Demographics**: Name, DOB, gender, contact, insurance, emergency contacts
- **Medical History**: Diagnoses, past illnesses, surgeries, hospitalizations
- **Medications**: Current medications, past medications, dosages, prescribing doctors
- **Allergies**: Drug allergies, food allergies, severity, reactions
- **Immunizations**: Vaccine history, dates, lot numbers, administering providers
- **Vital Signs**: Historical BP, pulse, temperature, O2 saturation, BMI

#### Visit & Encounter Data
- **Appointment History**: Past appointments, no-shows, cancellations
- **Clinical Notes**: SOAP notes, progress notes, discharge summaries
- **Visit Records**: Chief complaints, assessments, treatment plans

#### Laboratory & Imaging
- **Lab Results**: Complete test history with reference ranges, abnormal flags
- **Radiology Reports**: Imaging study reports with impressions
- **DICOM Images**: Complete image archives with viewing capabilities

#### Financial Data
- **Billing History**: Claims, invoices, payments, refunds
- **Insurance Claims**: Submitted, approved, denied, pending claims
- **Patient Ledgers**: Balance history, payment plans, collections

#### Operational Data
- **Prescriptions**: Prescription history, refills, pharmacy fill records
- **Documents**: Consent forms, advanced directives, legal documents
- **Provider Schedules**: Historical scheduling patterns for planning

---

## Data Quality & Validation

### ETL Pipeline
- **Extract**: Pull data from legacy systems via configured methods
- **Transform**: Clean, standardize, and map data to Balsm schema
- **Load**: Import validated data into Balsm with integrity checks

### Automated Validation Checks
- **Missing data detection**: Identify required fields with null/empty values
- **Format validation**: Phone numbers, emails, dates, codes match expected patterns
- **Referential integrity**: Patient references exist, doctor IDs valid, visit dates logical
- **Duplicate detection**: Flag potential duplicate patient records
- **Range validation**: Dates realistic, vital signs within biological limits
- **Code mapping**: ICD-10, CPT, LOINC, RxNorm codes validated

### Manual Review Workflow
- Flagged records routed to review queue for human verification
- Side-by-side comparison of source vs. migrated data
- Decision tracking (approved, corrected, excluded)
- Audit log of all manual decisions

### Reconciliation Reports
- **Record count comparison**: Source vs. target counts per data type
- **Completeness reports**: Percentage of required fields populated
- **Data quality scores**: Overall migration quality metrics
- **Exception reports**: List of records requiring attention

---

## Parallel Operation & Synchronization

### Dual System Operation
- Legacy and Balsm run simultaneously during transition
- Staff can reference legacy system as needed
- Gradual confidence building in new system

### Data Synchronization
- **One-way sync**: New data entered in Balsm only (legacy read-only)
- **Bidirectional sync** (if needed): Complex but possible for extended transitions
- **Sync frequency**: Real-time for critical data, batch for historical

### System Comparison Tools
- Side-by-side view of patient records in both systems
- Workflow mapping documents (how to do X in new system)
- Quick reference guides for common tasks

---

## Rollback & Risk Management

### Rollback Capabilities
- **Subsystem rollback**: Revert individual department to legacy system
- **Data snapshot**: Keep legacy system in standby mode for 3-6 months
- **Activation triggers**: Defined criteria for when to rollback (error rate thresholds)

### Risk Mitigation
- **Go/No-Go checklists** before each cutover
- **24/7 war room** during cutover weekends
- **Escalation procedures** for critical issues
- **Backup communication channels** (phones, radios) if system down

---

## Training & Change Management

### Role-Based Training
- **Physicians**: EHR navigation, clinical documentation, CPOE
- **Nurses**: Medication administration, vital signs entry, care plans
- **Pharmacists**: Prescription review, dispensing, inventory
- **Front Desk**: Scheduling, registration, insurance verification
- **Billing Staff**: Claims submission, payment posting, reporting

### Training Delivery Methods
- **Live instructor-led sessions** for complex workflows
- **Video tutorials** for on-demand learning
- **Quick reference cards** for common tasks
- **Super users** (power users who train peers)
- **Practice environment** (sandbox system for safe learning)

### User Adoption Support
- **Side-by-side guides**: "Old system vs. new system" comparison
- **Dedicated support hotline** during transition
- **On-site support staff** (go-live and first week)
- **Feedback loops**: Staff suggestions for improvements

---

## Compliance & Audit

### Regulatory Compliance
- **HIPAA compliance**: Encrypted data transfer, access controls, audit trails
- **Local health authority requirements**: Meet country/region-specific regulations
- **Data retention policies**: Archive historical data per legal requirements

### Audit Trails
- **Migration activity log**: Who migrated what data, when
- **Data modification tracking**: Changes made during cleanup
- **Access logs**: Who viewed/edited migrated data
- **Compliance reports**: Generate for auditors/regulators

---

## Post-Migration Support

### Stabilization Period
- **First 24 hours**: On-site support team, all hands on deck
- **First week**: Extended support hours (6am-midnight)
- **First month**: Daily check-ins with department heads
- **First quarter**: Weekly issue review meetings

### Data Cleanup & Optimization
- **Duplicate resolution**: Merge duplicate patient records
- **Data enrichment**: Complete missing optional fields
- **Performance tuning**: Optimize queries for large historical datasets
- **Archival strategy**: Move old records to cold storage if needed

### Continuous Improvement
- **User feedback collection**: Surveys, focus groups
- **Workflow optimization**: Refine processes based on usage patterns
- **Training updates**: Address common mistakes and confusion

---

## Bridge Interfaces for Non-Migratable Systems

### When Full Migration Isn't Possible
Some legacy systems cannot be fully replaced immediately due to:
- Specialized equipment integration (lab analyzers, imaging devices)
- Contractual obligations (vendor contracts not expired)
- Regulatory requirements (certified systems for specific procedures)

### Middleware Bridge Solution
- **HL7 interface engine** translates messages between systems
- **Real-time data sync** keeps both systems updated
- **API gateway** allows Balsm to read/write legacy system data
- **Gradual migration** as contracts expire or devices upgraded

### Bridge Use Cases
- **Lab Information Systems (LIS)**: Keep specialized LIS, interface results to Balsm
- **Radiology PACS**: Maintain PACS, order exams and view images from Balsm
- **Pharmacy**: Interface with robotic dispensing systems
- **Medical devices**: ECG machines, patient monitors send data to Balsm

---

## External System Integration (No Migration)

### Scenario Overview
When a client wants to **keep their existing system** and integrate Balsm modules with it (not migrate to Balsm), follow these integration best practices.

**Common Use Cases:**
- Hospital has custom-built HIS, wants to add Balsm's pharmacy module
- Clinic uses specialized EMR, wants Balsm's patient app for engagement
- Lab chain wants to integrate with Balsm network for referrals
- Insurance company wants claims integration with Balsm-connected hospitals

---

### Integration Architecture Options

#### Option 1: API-Based Integration (RECOMMENDED)
**Best for: Modern systems with development capability**

```
┌─────────────────┐         REST/GraphQL API         ┌─────────────────┐
│  Client System  │ ◄───────────────────────────────► │  Balsm API     │
│  (HIS/EMR/LIS)  │                                   │  Gateway        │
└─────────────────┘                                   └─────────────────┘
```

**Setup Steps:**
1. **API Credentials**: Client registers for Balsm API access
2. **Sandbox Testing**: Develop and test integrations in sandbox environment
3. **Data Mapping**: Map client's data model to Balsm API schema
4. **Authentication**: Implement OAuth 2.0 / API key authentication
5. **Error Handling**: Build retry logic, error logging, alerting
6. **Production Deployment**: Deploy to production after sandbox validation

**Balsm API Capabilities:**
- Patient demographics sync (create, read, update)
- Appointment booking and management
- Prescription creation and status tracking
- Lab order placement and result retrieval
- Billing and claims exchange
- Document upload and retrieval

#### Option 2: HL7/FHIR Message Exchange
**Best for: Healthcare systems with HL7 interfaces**

```
┌─────────────────┐       HL7 v2 / FHIR R4       ┌─────────────────┐
│  Client System  │ ◄─────────────────────────► │  Balsm HL7     │
│  (HIS/EMR)      │                              │  Interface      │
└─────────────────┘                              └─────────────────┘
```

**Supported Message Types:**
- **ADT**: Patient admission, discharge, transfer
- **ORM/OML**: Orders (lab, radiology, pharmacy)
- **ORU**: Results (lab, radiology)
- **SIU**: Scheduling (appointments)
- **DFT**: Financial transactions (billing)
- **MDM**: Medical document management

**FHIR Resources Supported:**
- Patient, Practitioner, Organization
- Appointment, Encounter, Condition
- MedicationRequest, Observation, DiagnosticReport
- Claim, Coverage, ExplanationOfBenefit

#### Option 3: Webhook-Based Integration
**Best for: Event-driven architectures**

```
┌─────────────────┐                              ┌─────────────────┐
│  Client System  │ ◄──── Webhook callbacks ──── │  Balsm Events  │
│  (Listener)     │                              │  Publisher      │
└─────────────────┘                              └─────────────────┘
```

**Balsm Webhook Events:**
- `appointment.created`, `appointment.updated`, `appointment.cancelled`
- `prescription.created`, `prescription.dispensed`
- `lab_result.ready`, `radiology_report.ready`
- `patient.registered`, `patient.updated`
- `payment.received`, `claim.processed`

#### Option 4: File-Based Exchange
**Best for: Legacy systems with limited integration capabilities**

```
┌─────────────────┐       SFTP / Shared Storage       ┌─────────────────┐
│  Client System  │ ◄───────────────────────────────► │  Balsm File    │
│  (Export/Import)│                                   │  Gateway        │
└─────────────────┘                                   └─────────────────┘
```

**Supported Formats:**
- CSV/Excel for structured data (patients, appointments)
- HL7 batch files (.hl7)
- DICOM files for imaging
- PDF/CDA documents

**Exchange Schedule:**
- Real-time (for critical data)
- Hourly/Daily batches (for non-urgent data)
- On-demand (manual triggers)

---

### Integration Best Practices

#### 1. Start with Sandbox Environment
- **Never integrate directly to production**
- Use Balsm sandbox with test data first
- Validate all data flows and error handling
- Run performance tests with realistic volumes

#### 2. Define Data Ownership
Establish **single source of truth** for each data type:

| Data Type | Owner | Direction |
|-----------|-------|-----------|
| Patient Demographics | Client System | Client → Balsm |
| Appointments | Depends on use case | Bidirectional |
| Lab Results | Lab System | Lab → Balsm → Client |
| Prescriptions | Balsm Pharmacy | Balsm → Client |

#### 3. Handle Conflicts
When data exists in both systems:
- **Master system wins**: Define which system is authoritative
- **Timestamp-based**: Most recent update wins
- **Manual review**: Flag conflicts for human resolution
- **No-overwrite fields**: Some fields protected from sync

#### 4. Implement Idempotency
- Same message sent twice should NOT create duplicates
- Use unique IDs for all records (patient ID, order ID, etc.)
- Check for existence before creating new records

#### 5. Error Handling & Retry Logic
- **Retry failed requests** with exponential backoff
- **Dead letter queue** for permanently failed messages
- **Alert notifications** for integration failures
- **Audit log** of all integration transactions

#### 6. Security Requirements
- **TLS 1.2+** for all API calls
- **OAuth 2.0** or API key authentication
- **IP whitelisting** for sensitive endpoints
- **Data encryption** at rest and in transit
- **HIPAA BAA** signed between parties (if PHI exchanged)

#### 7. Monitoring & Observability
- **Health check endpoints** to verify connectivity
- **Transaction logging** with correlation IDs
- **Error rate dashboards** for proactive monitoring
- **SLA tracking** for response times and availability

---

### Integration Testing Checklist

Before going live with integration:

**Connectivity**
- [ ] API authentication working
- [ ] Firewall rules configured (both directions)
- [ ] SSL certificates valid
- [ ] Network latency acceptable

**Data Quality**
- [ ] All required fields populated
- [ ] Data formats match (dates, codes, IDs)
- [ ] Character encoding correct (UTF-8)
- [ ] No data truncation or corruption

**Business Logic**
- [ ] Patient matching working correctly
- [ ] Duplicate detection functioning
- [ ] Business rules validated (e.g., age restrictions, formulary)
- [ ] Workflow sequences correct (order → result → report)

**Error Handling**
- [ ] Invalid requests rejected gracefully
- [ ] Retry logic working
- [ ] Error notifications being sent
- [ ] Manual intervention workflow defined

**Performance**
- [ ] Response times within SLA
- [ ] Throughput handles peak volumes
- [ ] No memory leaks during extended operation
- [ ] Batch processing completes in time window

---

### Integration Support & Documentation

#### Balsm Developer Resources
- **API Documentation**: OpenAPI/Swagger specs for all endpoints
- **SDK Libraries**: Pre-built libraries for common languages (Java, .NET, Python, Node.js)
- **Code Samples**: Example integrations for common use cases
- **Sandbox Environment**: Full Balsm instance with test data
- **Developer Portal**: Self-service API key management

#### Support Tiers for Integration Partners
- **Standard**: Email support, 48-hour response time
- **Premium**: Phone + email, 4-hour response time, dedicated TAM
- **Enterprise**: 24/7 support, on-site integration assistance, SLA guarantees

---

## Success Metrics

### Key Performance Indicators (KPIs)
- **Data migration accuracy**: >99.9% data integrity target
- **User adoption rate**: >90% staff using new system within 30 days
- **Clinical workflow time**: ≤ legacy system time (no slowdown)
- **Error rate**: <1% clinical documentation errors
- **Support ticket volume**: Declining trend week-over-week
- **User satisfaction**: >80% satisfaction score in surveys

### Go-Live Success Criteria
- All data migrated and validated
- All staff trained and signed off
- Parallel operation period completed successfully
- No critical issues outstanding
- Leadership approval obtained

---

## Migration Project Team

### Required Roles
- **Project Manager**: Overall migration coordination
- **Clinical Informaticist**: Clinical workflow expert
- **Data Migration Specialist**: ETL and data quality
- **Technical Lead**: Integration and interfaces
- **Training Coordinator**: User training and support
- **Super Users** (per department): Peer trainers

### Vendor Responsibilities (Balsm)
- Migration tools and automation
- Technical support and troubleshooting
- Training materials and documentation
- On-site support during go-live

### Hospital Responsibilities
- Legacy system data access
- Staff time for training
- Decision-making and approvals
- Feedback and issue reporting

---

## Federated Architecture: Self-Hosted Balsm with Global Network

### Overview
Balsm is **open source**, allowing clients to deploy their own Balsm instance on their infrastructure while still connecting to the **Global Balsm Network** for cross-hospital features.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL BALSM NETWORK                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Balsm Cloud│  │ Hospital A  │  │ Hospital B  │  │ Pharmacy Chain X    │ │
│  │ (Multi-     │  │ (Self-      │  │ (Self-      │  │ (Balsm Cloud)      │ │
│  │  Tenant)    │◄─►│  Hosted)   │◄─►│  Hosted)   │◄─►│                     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         ▲               ▲               ▲                   ▲               │
│         │               │               │                   │               │
│         └───────────────┴───────────────┴───────────────────┘               │
│                         Federation Protocol                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Deployment Options

#### Option 1: Balsm Cloud (Multi-Tenant SaaS)
- Hosted and managed by Balsm
- Automatic updates, backups, security patches
- No infrastructure management required
- Pay-per-use or subscription pricing
- Default connection to Global Network

#### Option 2: Self-Hosted (On-Premise / Private Cloud)
- Hospital deploys Balsm on own servers (Docker/Kubernetes)
- Full control over data, infrastructure, and customization
- Hospital responsible for updates, backups, security
- **Optional**: Connect to Global Balsm Network for network benefits
- Suitable for: Government hospitals, military, high-security requirements

#### Option 3: Hybrid
- Core clinical data on-premise (self-hosted)
- Patient app and engagement on Balsm Cloud
- Connected via federation protocol

---

### Federation Protocol

#### What is Federation?
Federation allows independent Balsm instances to communicate and share data securely - similar to how email servers work (Gmail can email Outlook).

#### Authentication & Registration Flow

Federation uses **core Balsm user authentication first**, then layers instance registration on top.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FEDERATION AUTH FLOW                            │
│                                                                     │
│  Step 1: Normal User Auth     Step 2: Instance Registration         │
│  ─────────────────────────    ───────────────────────────────       │
│  Hospital admin creates       Admin registers their self-hosted     │
│  a normal Balsm account      instance under their verified         │
│  (same as any user)           user account                          │
│           │                              │                          │
│           ▼                              ▼                          │
│  ┌─────────────────┐          ┌─────────────────────┐               │
│  │ Balsm Core Auth │    ──►  │ Federation Registry │               │
│  │ (OAuth 2.0 / SSO)│         │ (Instance binding)  │               │
│  └─────────────────┘          └─────────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

**Step 1: Core Balsm Account (Normal User)**
1. Hospital admin creates a standard Balsm account (same signup as any user)
2. Verifies identity via email/phone (standard user verification)
3. Admin now has a normal authenticated Balsm user session
4. This account becomes the **Organization Owner** for federation

**Step 2: Organization & Instance Registration**
5. Logged-in admin registers their organization (hospital name, license, address)
6. Balsm team verifies the organization (prevents fraud, validates medical license)
7. Organization is approved and linked to admin's user account

**Step 3: Instance Binding**
8. Admin registers their self-hosted instance under the verified organization
9. Instance receives unique `instance_id` and `api_key` for federation
10. TLS certificates issued for secure instance-to-network communication

**Step 4: Federation Activation**
11. Federation agreement signed (legal terms for data sharing and privacy)
12. Instance becomes visible to other federated nodes
13. Admin can invite other hospital staff as co-admins

**Why User Auth First?**
- Reuses existing Balsm authentication infrastructure (no separate system)
- Hospital admin is already a known, verified Balsm user
- Simplifies onboarding - familiar signup flow
- Enables role-based permissions (who can manage federation settings)
- Single identity for both personal use and organization management

#### Federation Features

**1. Patient Identity Federation (EMPI)**
- Patients can have a **Global Balsm ID** that works across all instances
- Patient creates account on any Balsm instance, gets global ID
- When visiting another hospital in the network, their records are discoverable
- Patient controls consent for cross-hospital data sharing

```
┌──────────────────┐                    ┌──────────────────┐
│  Hospital A      │                    │  Hospital B      │
│  (Self-Hosted)   │                    │  (Balsm Cloud)  │
│                  │   Patient visits   │                  │
│  Patient record  │ ◄────────────────► │  Can access      │
│  created here    │   with consent     │  linked records  │
└──────────────────┘                    └──────────────────┘
```

**2. Cross-Network Referrals**
- Doctor at Hospital A refers patient to specialist at Hospital B
- Referral includes relevant medical records (with patient consent)
- Specialist receives referral notification in their Balsm instance
- Complete referral tracking across the network

**3. Pharmacy Network Access**
- Prescription written at self-hosted Hospital A
- Patient can fill prescription at any Balsm-connected pharmacy
- Pharmacy queries prescription via Global Network
- Dispense recorded and synced back to originating hospital

**4. Lab & Imaging Network**
- Hospital A orders lab test, patient chooses nearby Lab Chain B
- Order transmitted via federation
- Results returned to Hospital A automatically

**5. Emergency Data Access**
- Patient arrives at ER unconscious
- ER can query Global Network for patient records (with emergency override)
- Critical info (allergies, medications, conditions) retrieved
- Full audit trail of emergency access

---

### Federated vs. Local-Only Modules

Not all modules need federation - only those that benefit from cross-hospital communication.

#### 🌐 FEDERATED MODULES (Connected to Global Network)

| Module | Why Federate | What's Shared |
|--------|--------------|---------------|
| **Patient Identity (EMPI)** | Find patients across network | Global ID, basic demographics |
| **Pharmacy Network** | Fill prescriptions at any pharmacy | Prescription tokens, dispense records |
| **Referral Exchange** | Send referrals between hospitals | Referral request, relevant records |
| **Lab Network** | Order labs at external chains | Orders, results |
| **Radiology Network** | Order imaging at external centers | Orders, reports, images |
| **Emergency Data Access** | Access critical info in emergencies | Allergies, medications, conditions |
| **Provider Directory** | Find doctors across network | Provider profiles, specialties, availability |
| **Insurance/Claims** | Cross-hospital billing | Eligibility, claims, payments |
| **Blood Bank Network** | Find blood in emergencies | Blood inventory, requests |
| **Appointment Booking** | Book at any network hospital | Available slots (not patient data) |

#### 🔒 LOCAL-ONLY MODULES (Never Federated)

| Module | Why Local Only |
|--------|----------------|
| **Clinical Documentation** | SOAP notes, progress notes too sensitive, no cross-hospital need |
| **Internal Scheduling** | Staff schedules, OR scheduling - internal operations only |
| **Inventory Management** | Hospital supplies - internal operations |
| **HR/Payroll** | Employee data - strictly internal |
| **Accounting** | Financial records - strictly internal |
| **Internal Messaging** | Staff communication - internal only |
| **Quality/Compliance** | Audits, incident reports - internal governance |
| **Admin/Settings** | System configuration - instance-specific |

#### Module Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GLOBAL BALSM NETWORK                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  FEDERATED SERVICES                                                │ │
│  │  • Patient Identity (EMPI)    • Provider Directory                 │ │
│  │  • Pharmacy Network           • Insurance/Claims                   │ │
│  │  • Referral Exchange          • Blood Bank Network                 │ │
│  │  • Lab Network                • Emergency Data Access              │ │
│  │  • Radiology Network          • Public Appointment Slots           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ Federation Protocol
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     SELF-HOSTED HOSPITAL INSTANCE                       │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │  LOCAL ONLY                 │  │  FEDERATED (with consent)       │  │
│  │  ────────────────────────── │  │  ──────────────────────────     │  │
│  │  • Clinical Documentation   │  │  • Patient Registry             │  │
│  │  • Internal Scheduling      │  │  • Prescriptions                │  │
│  │  • Inventory Management     │  │  • Referrals                    │  │
│  │  • HR/Payroll               │  │  • Lab Orders/Results           │  │
│  │  • Accounting               │  │  • Provider Profiles            │  │
│  │  • Quality/Compliance       │  │  • Emergency Summary            │  │
│  │  • Admin/Settings           │  │  • Appointment Slots            │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Federation Levels (Hospital Choice)

Hospitals can choose their level of federation participation:

| Level | Modules Federated | Use Case |
|-------|-------------------|----------|
| **None** | Zero | Fully isolated (military, max security) |
| **Minimal** | EMPI + Emergency only | Basic patient portability |
| **Standard** | + Pharmacy + Referrals + Labs | Most common choice |
| **Full** | All federated modules | Maximum network benefits |

**Key Principle**: Federate = Cross-hospital patient care features. Local = Internal operations and sensitive clinical details.

---

### Data Sovereignty & Privacy

#### What Stays Local (Self-Hosted Instance)
- **All clinical data** remains on hospital's servers
- Patient records, visits, prescriptions, results - never leave local instance
- Full HIPAA/local regulation compliance
- Hospital has complete data ownership

#### What Syncs to Global Network
Only with appropriate consent and agreements:

| Data Type | Sync Behavior | Patient Consent Required |
|-----------|---------------|--------------------------|
| Global Patient ID | Synced | Yes (at registration) |
| Public Provider Directory | Synced | No (business info) |
| Referral Requests | On-demand (when created) | Yes (per referral) |
| Prescription Token | Hash only (for verification) | Yes (at prescription) |
| Emergency Summary | On-demand (emergency access) | Emergency override |
| Full Medical Records | NEVER synced automatically | Explicit export only |

#### Privacy Controls
- **Patient consent management**: Patients control what's shared
- **Opt-out option**: Patients can be "network invisible"
- **Data minimization**: Only minimum necessary data shared
- **Audit trails**: Complete log of all cross-network access
- **Right to deletion**: Patient can request global ID removal

---

### Technical Requirements for Self-Hosted + Federation

#### Infrastructure Requirements
- **Docker/Kubernetes**: Container orchestration platform
- **Database**: PostgreSQL 14+ (or managed equivalent)
- **Storage**: Minimum 500GB (scales with patient volume)
- **Network**: Outbound HTTPS (port 443) for federation
- **SSL Certificate**: Valid TLS certificate for instance domain

#### Federation Connectivity
- **Stable internet**: Required for real-time federation features
- **Firewall rules**: Allow outbound to federation.balsm.health
- **Webhook endpoint**: Expose endpoint for incoming federation events
- **IP whitelisting**: Option to restrict federation to known IPs

#### Security Requirements
- **Core Balsm Auth**: Federation authenticates through standard Balsm OAuth 2.0 first
- **TLS 1.3**: All federation traffic encrypted
- **mTLS**: Mutual TLS authentication between instances
- **Instance API keys**: Instance-specific keys issued after user auth + org verification
- **JWT tokens**: Short-lived tokens for cross-instance requests (derived from user session)
- **Audit logging**: All federation activity logged and tied to authenticated user/org

---

### Federation Sync Modes

#### Real-Time Federation (Default)
- Instant sync for time-sensitive data
- Referrals, prescription verifications, emergency access
- Requires stable internet connection

#### Batch Federation (Optional)
- Scheduled sync for less urgent data
- Provider directories, aggregate analytics
- Works even with intermittent connectivity

#### Offline Mode
- Self-hosted instance works fully offline
- Local functionality continues without network
- Federation queues requests until reconnection
- Sync resumes automatically when online

---

### Self-Hosted Deployment Guide

#### Step 1: Obtain Balsm Source
```bash
# Clone from official repository
git clone https://github.com/balsm-health/balsm.git

# Or download release package
wget https://releases.balsm.health/v2.x/balsm-2.x.tar.gz
```

#### Step 2: Configure Environment
```yaml
# config/balsm.yaml
instance:
  name: "Al-Shifa Hospital"
  domain: "balsm.alshifa.hospital"
  timezone: "Asia/Riyadh"
  
database:
  host: "postgres.internal"
  port: 5432
  name: "balsm_prod"
  
federation:
  enabled: true
  hub_url: "https://federation.balsm.health"
  instance_id: "will-be-assigned"
  api_key: "will-be-assigned"
```

#### Step 3: Deploy with Docker Compose
```bash
docker-compose up -d
```

#### Step 4: Register for Federation
1. Create a normal Balsm account at https://balsm.health/signup (if not already registered)
2. Log in and navigate to Organization Management
3. Register your organization (hospital name, medical license, address)
4. Wait for organization verification (typically 1-3 business days)
5. Once approved, register your self-hosted instance under the organization
6. Receive `instance_id` and `api_key`
7. Update `config/balsm.yaml` with credentials and restart

#### Step 5: Test Federation
```bash
# Verify federation connectivity
balsm-cli federation test

# Check sync status
balsm-cli federation status
```

---

### Federation Governance

#### Network Policies
- All federated instances agree to common privacy standards
- Minimum security requirements enforced
- Regular security audits for compliance
- Non-compliant instances can be suspended

#### Dispute Resolution
- Cross-instance data disputes handled by Federation Council
- Patient complaints escalated through defined process
- Technical issues handled by Federation Support Team

#### Version Compatibility
- Federation protocol versioned independently
- Backward compatibility maintained for 2 major versions
- Self-hosted instances must update within 6 months of new release
- Automatic compatibility checks prevent broken connections

---

### Benefits of Joining Global Network

| Feature | Standalone | Federated |
|---------|------------|-----------|
| Core clinical functionality | ✅ | ✅ |
| Local patient management | ✅ | ✅ |
| Cross-hospital referrals | ❌ | ✅ |
| Network pharmacy access | ❌ | ✅ |
| Patient data portability | ❌ | ✅ |
| Emergency data access | ❌ | ✅ |
| Provider directory | Local only | Network-wide |
| Software updates | Manual | Automated notifications |
| Community support | Forums | Forums + Federation Support |

---

## Conclusion

Balsm supports three connection models to meet different client needs:

### 1. Full Migration (Cloud)
- Transition from legacy system to Balsm Cloud
- Phased approach, subsystem by subsystem
- Data quality focus with validation and reconciliation
- Strong training, risk management, and 24/7 support

### 2. Integration (Keep Existing System)
- Connect existing HIS/EMR to Balsm via APIs
- Define clear data ownership and sync rules
- Test in sandbox before production
- Maintain proper security and monitoring

### 3. Self-Hosted + Federation (Open Source)
- Deploy Balsm on own infrastructure
- Full data sovereignty and control
- Optional: Join Global Network for cross-hospital features
- Best of both worlds: local control + network benefits

**Key Principles for All Approaches:**
1. **Test first** - Always validate in staging/sandbox before production
2. **Phased rollout** - Minimize risk with gradual deployment
3. **Training investment** - Staff adoption determines success
4. **Patient safety first** - Never compromise care during transitions
5. **Documentation** - Maintain audit trails for compliance

With proper planning and execution, hospitals can connect to Balsm in the way that best fits their needs while preserving data integrity and ensuring continuous quality care.

---

**Document Version**: 2.1  
**Last Updated**: March 6, 2026  
**Contact**: integration@balsm.health
