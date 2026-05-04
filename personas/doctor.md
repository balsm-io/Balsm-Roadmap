# Persona — Doctor (Healthcare Professional)

> A licensed clinician who uses **Balsm Pro** to document patient encounters, write prescriptions, order tests, and manage their clinical practice.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Doctor` |
| **Primary modules** | Clinical, Scheduling |
| **Entity types** | Clinic, Hospital |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Doctors are licensed healthcare professionals who provide direct patient care. They may be:

- A general practitioner (GP) seeing outpatient visits at a clinic
- A specialist (cardiologist, dermatologist, etc.) at a clinic or hospital
- A hospital attending physician managing inpatients
- A sole practitioner operating their own entity

A doctor's Balsm Pro account is **scoped to an entity** — their clinic or hospital. If they practice at multiple entities, they have separate entity memberships under the same Balsm account.

---

## Goals

- Document patient encounters quickly and accurately (SOAP / DAP notes)
- Write prescriptions electronically and transmit them to pharmacies
- Order lab tests and imaging studies and receive results in-app
- Manage their appointment schedule and patient queue
- Access a patient's full history across previous visits
- Use AI-assisted clinical decision support (drug interactions, diagnosis hints) with their own API key (BYOK)

---

## Pain Points

- Time spent on documentation pulling focus away from patient care
- Fragmented patient history spread across paper and different systems
- Manual prescription pads that can be forged or lost
- Waiting for lab/imaging results via phone calls or paper
- No single view of the day's schedule, pending results, and messages

---

## Default Permissions (`Doctor` group)

| Module | Access Level |
|--------|-------------|
| **Clinical** | Full — create/edit notes, write prescriptions, order labs/imaging |
| **Scheduling** | Full — view/create/update/cancel appointments |
| **Inventory** | None (default; entity admin can grant read access if needed) |
| **POS** | None (default) |
| **Admin** | None |

Permission format examples:
- `clinical.note.write`
- `clinical.prescription.write`
- `clinical.lab_order.create`
- `scheduling.appointment.manage`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Patient Encounter** | Open a patient record, review history, document a SOAP/DAP note, attach diagnoses (ICD-10) |
| **ePrescription** | Write a prescription with RxNorm-coded medications; transmit electronically to the patient's chosen pharmacy |
| **Lab Orders** | Create lab test orders; receive results directly in the patient record |
| **Imaging Orders** | Create imaging requests; receive DICOM-linked reports |
| **Schedule Management** | View daily/weekly schedule; manage appointment slots |
| **Patient Queue** | See check-in status and manage walk-in flow |
| **AI Clinical Assist** | Get drug interaction warnings, differential diagnosis hints (BYOK, entity-configured) |
| **Referrals** | Generate referral letters and forward patient summaries to other providers |

---

## Related Personas

- [Nurse](./nurse) — assists with vitals, triage, and administrative tasks
- [Receptionist](./receptionist) — manages the doctor's appointment schedule
- [Pharmacist](./pharmacist) — fulfills ePrescriptions written by the doctor
- [Lab Technician](./lab-technician) — processes lab orders created by the doctor
- [Radiologist](./radiologist) — interprets imaging orders created by the doctor
- [Patient](./patient) — the person receiving care
