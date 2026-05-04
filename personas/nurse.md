# Persona — Nurse

> A licensed nursing professional who uses **Balsm Pro** to document vitals, assist with patient care, and support clinical workflows — with prescribing access denied by default.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Nurse` |
| **Primary modules** | Clinical (limited), Scheduling (view) |
| **Entity types** | Clinic, Hospital |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Nurses are licensed clinical staff who provide hands-on patient care and documentation support. They may be:

- A clinic nurse handling triage and pre-consultation vitals
- A hospital floor nurse managing inpatient care tasks
- A specialty nurse (e.g., oncology, ICU) with extended responsibilities

Nurses operate with a **restricted Clinical access profile** — they can document vitals and nursing notes, but cannot write prescriptions by default. Entity admins can promote individual nurses with explicit grants (e.g., for nurse practitioners with prescribing authority in jurisdictions that allow it).

---

## Goals

- Record patient vitals quickly before the doctor's consultation
- Document nursing observations and interventions
- View the patient's existing records and care plan
- Track pending tasks and patient assignments for their shift
- Communicate with the treating physician without leaving the system

---

## Pain Points

- Duplicating vital data that gets re-entered by the doctor
- No quick task list for shift handover
- Unable to see the full schedule to coordinate triage timing
- Paper-based vital sheets that get lost or are illegible

---

## Default Permissions (`Nurse` group)

| Module | Access Level |
|--------|-------------|
| **Clinical** | View all records; write vitals and nursing notes; **prescribe — denied by default** |
| **Scheduling** | View only — cannot create/edit appointments |
| **Inventory** | None (default) |
| **POS** | None (default) |
| **Admin** | None |

Permission format examples:
- `clinical.record.read`
- `clinical.vitals.write`
- `clinical.nursing_note.write`
- `clinical.prescription.write` → **Explicit Deny** (default)
- `scheduling.appointment.read`

> Entity admins can grant `clinical.prescription.write` to individual nurse practitioners who hold prescribing authority.

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Triage & Vitals** | Record blood pressure, temperature, weight, pulse, oxygen saturation before consultation |
| **Nursing Notes** | Document observations, interventions, and care plan progress |
| **Patient History Review** | View existing records, allergies, and medication lists |
| **Schedule View** | See the day's patient list and check-in status to coordinate triage order |
| **Task Management** | Track pending care tasks (e.g., administer medication, follow-up call) |
| **Shift Handover** | Review active patients and outstanding tasks for handoff |

---

## Related Personas

- [Doctor](./doctor) — the treating physician the nurse supports
- [Receptionist](./receptionist) — manages scheduling and check-in
- [Patient](./patient) — the person receiving nursing care
- [Entity Admin](./entity-admin) — can grant individual nurses elevated permissions
