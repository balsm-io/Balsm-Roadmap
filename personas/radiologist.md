# Persona — Radiologist

> A diagnostic imaging physician who uses **Balsm Pro** to receive imaging orders, review DICOM studies, and produce structured radiology reports.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Radiologist` |
| **Primary modules** | Imaging (full), Scheduling (view) |
| **Entity types** | Scan Center, Hospital |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Radiologists are licensed physicians who specialize in interpreting medical images. They may be:

- A radiologist at a standalone scan center reading CT, MRI, and X-ray studies
- A hospital radiologist managing inpatient and emergency imaging workflows
- A teleradiology physician interpreting studies remotely from a different location

Radiologists receive imaging orders, perform studies (via imaging technologists), interpret DICOM images through the integrated PACS interface, and produce structured reports delivered back to the requesting physician and the patient.

---

## Goals

- Receive imaging orders and manage the reading worklist
- Access DICOM studies directly from the PACS interface within Balsm Pro
- Produce structured reports using standardized RadLex terminology
- Deliver reports to the requesting physician in real time
- Track turnaround times and meet reporting SLAs
- Archive studies with correct patient linkage for future comparison

---

## Pain Points

- Disconnected PACS and reporting systems requiring duplicate logins
- Reports delivered by fax or phone to referring physicians
- No structured worklist linked to the appointment and order
- Studies stored in silos with no easy access to prior comparisons
- Manual report distribution with no delivery confirmation

---

## Default Permissions (`Radiologist` group)

| Module | Access Level |
|--------|-------------|
| **Imaging** | Full — receive orders, manage worklist, view DICOM studies (PACS), create/release reports |
| **Scheduling** | View only — see the day's imaging appointments |
| **Clinical** | None — cannot view full patient records |
| **Lab** | None |
| **POS** | None |
| **Admin** | None |

Permission format examples:
- `imaging.order.receive`
- `imaging.study.view`
- `imaging.report.create`
- `imaging.report.release`
- `scheduling.appointment.read`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Receive Imaging Order** | Accept incoming imaging requests (X-ray, CT, MRI, ultrasound) from referring physicians |
| **Worklist Management** | Prioritize studies (STAT, urgent, routine); assign to technologists |
| **PACS Viewer** | Open DICOM studies in the integrated PACS interface; pan, zoom, window/level, measure |
| **Prior Comparison** | Load prior studies for the same patient to compare findings over time |
| **Structured Report** | Author reports using RadLex standardized terminology with finding sections, impression, and recommendations |
| **Report Release** | Review and electronically sign the report; deliver to the requesting physician and patient record |
| **Scheduling View** | View the day's imaging appointments to anticipate order volume |
| **Addendum** | Append corrections or additions to a released report with audit trail |

---

## Imaging Module — Integration Notes

- DICOM integration via PACS interface — the entity connects their existing PACS or uses Balsm's integrated viewer
- Studies are linked to the patient record and imaging order by study instance UID
- Reports are structured as FHIR `DiagnosticReport` resources when connected to Balsm Network

---

## Related Personas

- [Doctor](./doctor) — creates imaging orders and receives completed reports
- [Receptionist](./receptionist) — schedules imaging appointments
- [Patient](./patient) — undergoes imaging studies and receives reports
- [Entity Admin](./entity-admin) — configures imaging modalities, PACS connection, and reporting templates
