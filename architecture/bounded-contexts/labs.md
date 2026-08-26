# Labs — Bounded Context

| | |
|---|---|
| **Plane** | Provider |
| **Classification** | Supporting |
| **Phases** | P017 |
| **Repo mapping** | new .NET module at P017 (`Modules/Labs`) |
| **PHI posture** | High: results are PHI. OTP-verified shareable result URLs; all accesses audit-logged. |

## Purpose

The full laboratory domain per ADR-13: the analyte↔test↔bundle catalog, demographic reference ranges, order snapshotting, specimen chain-of-custody, QC, reflex rules, panic values, and patient result delivery. Results attach to the **analyte**, never the test.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Analyte | Atomic measured parameter (Hemoglobin, Glucose) — defined once, LOINC-coded from day one, reused everywhere |
| Test | Orderable/billable unit (CBC, Lipid Panel) grouping analytes — many-to-many |
| Bundle | Package of tests at a discounted price — many-to-many |
| Reference Range | Demographic-keyed (sex, age band, condition, unit) low/high + critical thresholds — modeled separately from the analyte |
| Order Snapshot | Catalog contents + price frozen onto the order at booking; later catalog edits never rewrite history |
| Specimen | The physical sample with barcode + chain of custody: collection → transport → processing → resulted |
| Reflex Rule | Auto-order of follow-up tests from initial results |
| Panic Value | Critical result triggering physician alert + regulatory log entry |

"Specimen", never "sample" (ubiquitous-language rule).

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `Analyte` | LOINC, unit family | Defined once; deletion forbidden once resulted-against |
| `LabTest` / `Bundle` | analyte/test membership (m:n), price, specimen type, method, TAT, prep, availability status | Availability: active / temporarily-unavailable (+expected return) / discontinued |
| `ReferenceRange` | analyte ref, demographics key, low/high, critical-low/high | Flag computed against the range matching patient sex/age/condition at result time |
| `LabOrder` | snapshot of tests+prices, clinical indication, ordering encounter ref | Ordering a CBC yields one result row per analyte (~15); snapshot immutable |
| `Specimen` | barcode, chain-of-custody FSM, routing department | Chain of custody intact home-collection → lab (P017 exit criterion) |
| `AnalyteResult` | value, unit, flag (normal/high/low/critical), verification state | `draft → verified → released`; panic values alert + logged |
| `QCRun` / `ReagentLot` | daily QC, corrective actions, lot expiry | — |
| `ResultShareLink` | OTP, TTL, entity-configurable expiry | Every access audit-logged; PDF export |

## Integration Events

**Consumed:** `LabOrderRequested` (Clinical Records), house-visit bookings (Appointment, CF).

**Published:** `SpecimenCollected`, `ResultReleased` (→ Personal Health mirror; → ordering physician), `PanicValueDetected`, `LabCatalogPublished` (→ Balsm Network → Provider Directory).

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Clinical Records | downstream | C-S | Orders with clinical indication |
| Appointment | downstream | **CF** | House-visit collection conforms to slot/booking model as-is |
| Provider Directory | upstream | C-S via Balsm Network | Catalog publishing per sharing policy; usable offline/local without publishing |
| Analyzers / reference labs / LIS | downstream of external | **ACL** | HL7/FHIR + analyzer adapters at the boundary |
| Personal Health | upstream | C-S (ACL downstream) | Released results mirror to patient timeline |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P017 | Catalog: analyte↔test↔bundle (both m:n, ADR-13), LOINC on analytes from day one, availability states, house-visit flag, bundle discounts |
| P017 | Demographic reference ranges (sex/age band/condition/unit, low/high + critical) modeled separately; flags computed at result time |
| P017 | Orders: doctor orders from encounter with indication; catalog + price snapshotted at booking; CBC → ~15 analyte result rows |
| P017 | Specimen workflow: barcode + chain of custody (collection → transport → processing → resulted); department auto-routing |
| P017 | QC daily runs + corrective actions; reagent/control lot tracking with expiry alerts; reflex testing rules |
| P017 | Result verification (draft → verified → released); critical/panic alerts to ordering physician + regulatory panic log; cumulative trend reporting |
| P017 | Analyzer/equipment result import; reference-lab interface (HL7/FHIR/LIS) |
| P017 | House visits: service area, slots, eligible tests, pricing, max visits/day/technician; same barcode + custody as in-lab; patient status tracking |
| P017 | Patient result delivery: OTP-verified time-limited URL (no app/login), full report, PDF, configurable expiry, receipt QR, all accesses audit-logged |
| P017 | Network catalog publishing (via Balsm Network); offline/local catalog use without publishing |

Modules: .NET `Modules/Labs` (planned P017).

## Boundary Notes

- Cumulative/trend reporting is a read model here.
- House-visit service area, technician capacity, and house-visit pricing are Labs configuration; the *booking* mechanics stay Appointment's.
