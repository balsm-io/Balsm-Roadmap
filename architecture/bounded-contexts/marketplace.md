# Marketplace — Bounded Context

| | |
|---|---|
| **Plane** | Platform |
| **Classification** | Supporting (constitution v1.8.0; earlier "Core" label in `subdomain-classification.md` was stale) |
| **Phases** | P022 |
| **Repo mapping** | new module at P022; private marketplace variant for self-hosted deployments |
| **PHI posture** | None directly; add-on *access* to data is entirely mediated by Platform Access + sharing policy. |

## Purpose

The add-on ecosystem: listings, developer onboarding, review/approval workflow, ratings, and sandboxed plugin distribution — including a private marketplace for self-hosted deployments.

## Ubiquitous Language

| Term | Meaning in this context |
|---|---|
| Add-On | A distributable, sandboxed extension |
| Listing | The public catalog entry with pricing/rating |
| Review Workflow | Submission → security/quality review → approval → publication |

## Aggregates

| Aggregate Root | Contents | Key invariants |
|---|---|---|
| `AddOn` | versions, sandbox manifest, requested scopes | Publishable only after review approval; scopes requested here, granted via Platform Access |
| `AddOnDeveloper` | identity, agreement state | — |
| `AddOnListing` / `AddOnReview` | catalog entry, ratings; review records | Review verdicts immutable |

## Relationships

| With | Direction | Pattern | Contract |
|---|---|---|---|
| Platform Access | downstream | C-S | Add-ons get no privileged path — same OAuth/API-key surface, same scopes |
| Balsm Network | downstream | CF | Distribution respects entitlements (ADDON tier) |
| Billing & Finance | peer | C-S | Marketplace commission settlement |

## Feature Reference

| Phase | Deliverable |
|---|---|
| P022 | Add-on marketplace: sandboxed plugins, developer tools, review/rating system |
| P022 | Private marketplace for self-hosted deployments |

Modules: planned P022.
