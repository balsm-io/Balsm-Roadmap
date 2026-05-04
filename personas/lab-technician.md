# Persona — Lab Technician

> A laboratory professional who uses **Balsm Pro** to process test orders, track specimens, enter results, and manage quality control in the lab.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Lab Technician` |
| **Primary modules** | Lab (full), Scheduling (view) |
| **Entity types** | Lab, Hospital |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Lab technicians are trained laboratory professionals responsible for processing diagnostic tests. They may be:

- A medical laboratory technologist at a standalone diagnostic lab
- A hospital lab technician handling inpatient and outpatient test orders
- A point-of-care testing technician at a clinic with an in-house lab

Lab technicians receive test orders from doctors, collect or receive specimens, perform analysis, and enter results — which are then made available to the ordering physician and the patient.

---

## Goals

- Receive and track incoming test orders without manual paperwork
- Manage specimen collection, labeling, and tracking through analysis
- Enter test results with LOINC-coded values against reference ranges
- Flag critical values for immediate physician notification
- Maintain quality control records for accreditation
- View the day's pending orders to manage workload

---

## Pain Points

- Paper-based lab requisitions that get lost or misread
- Manual result entry into systems that aren't linked to the ordering doctor's record
- No automatic flagging of critical or out-of-range values
- Specimen tracking gaps causing lost samples and repeat collections
- Quality control records maintained in separate paper logs

---

## Default Permissions (`Lab Technician` group)

| Module | Access Level |
|--------|-------------|
| **Lab** | Full — receive orders, track specimens, enter and release results, QC management |
| **Scheduling** | View only — see the day's appointment list for coordination |
| **Clinical** | None — cannot view full patient records |
| **POS** | None |
| **Inventory** | None (entity admin can grant read access for lab supplies) |
| **Admin** | None |

Permission format examples:
- `lab.order.receive`
- `lab.specimen.track`
- `lab.result.enter`
- `lab.result.release`
- `lab.qc.manage`
- `scheduling.appointment.read`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Receive Lab Order** | Accept incoming test orders from doctors; assign to the workqueue |
| **Specimen Collection & Tracking** | Log specimen collection (tube type, time, collector); track through processing stages |
| **Specimen Labeling** | Generate barcode labels linked to the order for positive patient identification |
| **Result Entry** | Enter numeric or categorical results against LOINC-coded test definitions with reference ranges |
| **Critical Value Flagging** | Automatically flag results outside critical ranges; trigger immediate physician notification |
| **Result Release** | Review and approve results before releasing to the ordering physician and patient |
| **Quality Control** | Log QC runs, record control values, flag out-of-control runs per Westgard rules |
| **Workload View** | See all pending orders for the day; prioritize STAT vs. routine |

---

## Related Personas

- [Doctor](./doctor) — creates lab orders and receives results
- [Receptionist](./receptionist) — schedules lab appointments that feed into the order queue
- [Patient](./patient) — provides the specimen and receives results
- [Entity Admin](./entity-admin) — configures test catalog, reference ranges, and QC settings
