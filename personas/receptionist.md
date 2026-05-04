# Persona — Receptionist

> A front-desk staff member who uses **Balsm Pro** to manage appointments, coordinate patient check-in/check-out, and collect co-payments — without access to clinical records.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm Pro |
| **Default permission group** | `Receptionist` |
| **Primary modules** | Scheduling (full), POS (co-pay collection only) |
| **Entity types** | Clinic, Hospital, Lab, Scan Center |
| **Arabic label** | بلسم - برو |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Receptionists are the first point of contact for patients at a healthcare entity. They may be:

- A clinic front desk coordinator scheduling appointments and managing the waiting room
- A hospital admissions coordinator handling patient registration and room assignments
- A lab or scan center coordinator booking test appointments and receiving patients

Receptionists have **full scheduling access** but are restricted from clinical records and advanced POS operations (they can collect a co-pay but cannot run full retail sales or close a shift).

---

## Goals

- Schedule appointments efficiently without double-booking
- Confirm and remind patients of upcoming appointments
- Check patients in on arrival and update their status in real time
- Collect co-payments and insurance co-pays at check-in
- Coordinate the waiting room and inform patients of expected wait times
- Communicate with clinical staff about patient readiness

---

## Pain Points

- Double-booking slots due to poor calendar visibility
- Patients who arrive without a scheduled appointment disrupting the flow
- Manual reminder calls before appointments consuming significant time
- No link between scheduling and payment — collecting co-pays is a separate manual step
- Difficulty managing multiple doctors' schedules simultaneously

---

## Default Permissions (`Receptionist` group)

| Module | Access Level |
|--------|-------------|
| **Scheduling** | Full — create, view, edit, cancel appointments; manage check-in/check-out; waitlist management |
| **POS** | Co-pay collection only — cannot process general sales, returns, or close a shift |
| **Clinical** | None — cannot view or edit patient records |
| **Pharmacy** | None |
| **Inventory** | None |
| **Admin** | None |

Permission format examples:
- `scheduling.appointment.create`
- `scheduling.appointment.edit`
- `scheduling.appointment.cancel`
- `scheduling.checkin.manage`
- `scheduling.waitlist.manage`
- `pos.copay.collect`

---

## Key Workflows

| Workflow | Description |
|----------|-------------|
| **Book Appointment** | Search for an open slot, assign a doctor/resource, confirm with the patient |
| **Reschedule / Cancel** | Move or cancel appointments; send notifications to patients |
| **Patient Check-In** | Mark the patient as arrived; update status visible to clinical staff |
| **Waitlist Management** | Add patients to a waitlist; notify them when a slot opens |
| **Co-pay Collection** | Collect the patient's co-payment via cash or card; issue receipt |
| **Daily Schedule View** | View all appointments for the day per doctor or resource |
| **Patient Registration** | Create or look up a patient profile during check-in |
| **Appointment Reminders** | Automated reminders via SMS/email are triggered by the system; receptionist can also send manual reminders |

---

## Related Personas

- [Doctor](./doctor) — the provider whose schedule the receptionist manages
- [Nurse](./nurse) — coordinates triage timing based on the receptionist's check-in updates
- [Patient](./patient) — the person whose appointments are being managed
- [Entity Admin](./entity-admin) — configures appointment types, slots, and resource settings
