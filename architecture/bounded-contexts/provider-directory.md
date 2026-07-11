# Provider Directory — Bounded Context

| | |
|---|---|
| **Plane** | Consumer (public, non-PHI data) |
| **Classification** | Supporting |
| **Phases** | P003 (map + search), P016 (entity profiles, Book Now), P017 (lab test discovery) |
| **Repo mapping** | Supabase: `public.providers` (+PostGIS); Flutter discovery module (P003); `balsm.health` website directory pages |
| **PHI posture** | None. Public curated business data only. |

## Purpose

The public, searchable map of healthcare providers — clinics, hospitals, pharmacies, labs, radiology centers — that anchors the B2C→B2B handoff. Patients discover providers here; entities publish here (via Balsm Network sharing policy from P016). It stores **projections** of provider data, never live references into provider-plane contexts.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Provider Listing | A curated, public profile of one healthcare facility (name, specialty, address, geo point, phone, hours, photos) |
| Catalog Projection | A published snapshot of an entity's offerings (e.g., lab tests with price/turnaround) — searchable, not authoritative |
| Governorate | Egyptian administrative region used as a search facet (27 seeded) |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `ProviderListing` | entity type, name, specialty, geo (PostGIS point), contact, hours, photos, deep link | Source of truth in Supabase; app uses last-cached snapshot offline (P003 exit criterion) |
| `CatalogProjection` | provider ref, offering (test/service), price, turnaround, availability + expected-return-date, house-visit flag | Rebuilt from publish events; never edited in place |

## Integration Events

**Consumed:** `EntityProfilePublished`, `LabCatalogPublished` (via Balsm Network policy gate, P016/P017); manual curation + community contributions (P003 seed path).

**Published:** none (read-optimized leaf context).

## Published Language / OHS

- Search API: by name, specialty, governorate, distance, price, turnaround, availability, house-visit support — consumed by the Flutter app and `balsm.health`.

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Entity Management / Labs | downstream | C-S via Balsm Network | Publishing passes the entity sharing policy (BRD §1.4); Directory conforms to the published catalog language |
| Balsm Network | downstream | CF | Only network-published data appears; unsubscribed entities fall out per retention rules |
| OpenStreetMap | downstream of external | ACL | `flutter_map` + OSM tiles (ADR-06); no Google Maps dependency |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P003 | OSM base map via `flutter_map` (no API key); provider cards (name, specialty, address, phone, hours, photos, Maps deep link) |
| P003 | Search by name, specialty, governorate, distance; <3 s nearby results; offline last-cached snapshot |
| P003 | Egyptian facility seed data (manual curation + community contributions) |
| P016 | Entity/doctor profiles on balsm.health; "Book Now" flows; discoverability tied to subscription |
| P017 | Patient-facing test search ("Vitamin D", "HbA1c") → labs with price/turnaround/availability/house-visit/ratings filters |

Modules: Flutter discovery package (planned P003); Supabase `public.providers` + PostGIS.

## Boundary Notes

- Ratings/reviews (P017 filter facet) belong here when introduced.
- Seed data is Balsm-curated — curation workflow is an internal concern of this context, not of Entity Management.
