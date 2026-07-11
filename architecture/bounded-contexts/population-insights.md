# Population Insights — Bounded Context (PROVISIONAL)

> ⚠️ **Provisional** — candidate context, not canonical. Confirm or dissolve when the P021 spec is written. Modules must not map here yet.

| | |
|---|---|
| **Plane** | Platform |
| **Classification (proposed)** | Supporting |
| **Phases** | P021 (partner analytics, population health dashboards) |
| **PHI posture** | Anonymized aggregates only. Hard floors: ≥50 prescriptions, ≥10 prescribers per aggregate; **no individual prescriber analytics** (anti-kickback, CR-02). |

## Purpose (proposed)

Read-only anonymized aggregation over integration events from many contexts: demand heatmaps, seasonal patterns, demographic usage, population health dashboards, partner analytics (Balsm Connect portal). A separate context because the anonymization/aggregation model (k-thresholds, suppression) is its own domain — not a projection any single context should own.

## Candidate aggregates

`AggregationPolicy` (thresholds, suppression rules — the invariant carrier), `Heatmap`/`CohortMetric` projections, `PartnerGrant` (which partner sees which aggregate).

## Key invariant

No query result below the aggregation thresholds ever leaves the context — enforced in the model, not in the UI.

## Dissolution alternative

If P021 partner analytics ships as static reports, this becomes a reporting pipeline inside Balsm Network — then delete this file.
