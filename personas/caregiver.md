# Persona — Caregiver

> A family member or trusted person who manages the health of a **dependent** (child under 18 or a person who needs assisted care) through the **Balsm app**.

---

## Profile

| Attribute | Detail |
|-----------|--------|
| **App** | Balsm (patient-facing, multi-platform) |
| **Account type** | Patient account with guardian access to one or more dependent accounts |
| **Arabic label** | بلسم |
| **Platforms** | iOS, Android, Web, macOS, Windows, Linux |

---

## Who They Are

Caregivers are adults (18+) who use their own Balsm account to manage the health of someone who cannot fully manage it themselves:

- A parent managing health records and appointments for their children
- An adult child managing care for an elderly parent
- A legal guardian acting on behalf of a patient with limited capacity

A single caregiver can manage **multiple dependent accounts**. One caregiver is designated the **primary guardian** — the person who created the dependent account. Additional guardians can be added by the primary guardian.

---

## Goals

- Manage appointments, prescriptions, and medical records on behalf of dependents
- Receive health notifications for their dependents
- Coordinate care across multiple family members from a single account
- Grant trusted relatives (e.g., the other parent) co-guardian access
- Maintain oversight until the dependent is ready for full autonomy

---

## Pain Points

- Managing health records across multiple children using separate apps or paper
- No visibility into whether a dependent picked up their medication or attended an appointment
- Difficulty transitioning management to the dependent as they age
- Sharing access with another guardian without exposing their own credentials

---

## Key Features / Workflows

| Workflow | Description |
|----------|-------------|
| **Create Dependent Account** | Add a child under 18 as a dependent (requires date of birth) |
| **Guardian Dashboard** | View and manage all dependents from one unified view |
| **Appointments** | Book, reschedule, and cancel appointments for a dependent |
| **Prescriptions & Medications** | View and act on prescriptions issued to a dependent |
| **Medical Records** | Access and share a dependent's health history |
| **Notifications** | Receive health alerts on behalf of the dependent |
| **Add Co-Guardian** | Invite another adult to share guardian access (primary guardian only) |
| **Transition at 18** | When a dependent turns 18, the dependent gains control; guardians remain until the dependent removes them |

---

## Guardian Rules

- A dependent must have **at least one active guardian** at all times
- Only the **primary guardian** can add or remove other guardians
- A dependent account cannot itself be a guardian of another account
- When a dependent turns 18, they gain the ability to remove guardians independently
- Guardians can voluntarily release control before the dependent turns 18

---

## Data & Privacy

- Caregivers access dependent PHI under the dependent's consent model
- All guardian changes are recorded in the audit log
- Dependents retain their own health records when they transition to full autonomy

---

## Related Personas

- [Patient](./patient) — the dependent when managing their own health
- [Doctor](./doctor) — may interact with caregivers during dependent consultations
- [Receptionist](./receptionist) — books appointments on behalf of patients/dependents
