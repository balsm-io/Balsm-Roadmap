# Graph Report - .  (2026-05-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 259 nodes · 282 edges · 50 communities (16 shown, 34 thin omitted)
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c3273c86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `User Personas Index` - 19 edges
2. `ASP.NET Core API` - 14 edges
3. `Balsm Pro (Practice Management App)` - 11 edges
4. `API Routing Strategy` - 10 edges
5. `Healthcare Threat Modeling Skill` - 9 edges
6. `Certifications & Standards Compliance` - 8 edges
7. `Glossary & Abbreviations` - 8 edges
8. `Command: DDD Review (Bounded Contexts)` - 8 edges
9. `AI Rules & Governance` - 7 edges
10. `PHI (Protected Health Information)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `PMS (Pharmacy Management System)` --semantically_similar_to--> `Bounded Context: Pharmacy`  [INFERRED] [semantically similar]
  GLOSSARY.md → .claude/commands/ddd-review.md
- `LMS (Labs Management System)` --semantically_similar_to--> `Bounded Context: Labs`  [INFERRED] [semantically similar]
  GLOSSARY.md → .claude/commands/ddd-review.md
- `Free Tier (Individual, Small Entity, Non-Commercial)` --conceptually_related_to--> `Persona — Doctor`  [INFERRED]
  legal/baslm-commercial-license-bcl-v1.4.md → personas/doctor.md
- `Clinical AI Rules (Decision Support Only)` --rationale_for--> `Bounded Context: Prescriptions`  [INFERRED]
  AI_GOVERNANCE.md → .claude/commands/ddd-review.md
- `Command: Prescription Safety Review` --references--> `RxNorm Compliance`  [INFERRED]
  .claude/commands/prescription-safety.md → CERTIFICATIONS.md

## Communities (50 total, 34 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (41): Core Domains (Clinical Records, Prescriptions, Charitable Donations, Marketplace), Subdomain Map, Generic Subdomains (Identity & Access, Inventory, Messaging), Supporting Subdomains (Appointments, Labs, Radiology, Pharmacy, Billing, Entity Management), API Route Patterns by Subdomain, Subdomain to Route Mapping, Website Routing Strategy, Patient/Caregiver Portal (portal.balsm.health) (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (32): Bounded Context: Billing & Finance, Bounded Context: Identity & Access, Bounded Context: Labs, Bounded Context: Marketplace (Add-ons), Bounded Context: Pharmacy, Bounded Context: Prescriptions, Digital Public Goods (DPG) Standard, Egypt MOH / HIIS Alignment (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (30): AI Chat & Conversation Security, Clinical AI Rules (Decision Support Only), AI Data Privacy & Training Rules, Human Oversight & Accountability, AI Rules & Governance, AI Transparency & Explainability, Bounded Context: Clinical Records, Command: AI Governance Check (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (20): Appointment Controller, ASP.NET Core API, Balsm Network, Balsm Desktop App, DICOM, Federation Gate, FHIR Controller, FHIR R4 (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (13): API Routing Strategy, Authentication & SSO Routing Strategy, C4 Architecture Model, Communication Architecture (App/Local/Cloud), Community & Feedback Routing Strategy, Documentation Subdomain Routing Strategy, Download & Distribution Routing Strategy, Architecture Documentation Index (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (9): devDependencies, @mermaid-js/mermaid-cli, vitepress, scripts, docs:build, docs:dev, docs:diagrams, docs:preview (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (10): Agent Instructions (AGENTS.md), Graphify Agent Rule (always_on trigger), Graphify Workflow, Balsm Healthcare Platform, Graphify Claude Skill Entry (.claude/CLAUDE.md), Active Technology Stack (.NET 10 / SQLite / React), Command: Accessibility Check (WCAG), Command: i18n Check (RTL/Localization) (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (6): AI/ML Threat Library, Healthcare Threat Library, Healthcare Threat Modeling Skill, Regulatory Quick Reference, STRIDE Threat Modeling Methodology, Threat Model Document Template

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (9): chat.promptFilesRecommendations, speckit.constitution, speckit.implement, speckit.plan, speckit.specify, speckit.tasks, chat.tools.terminal.autoApprove, .specify/scripts/bash/ (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (9): speckit-analyze Skill, speckit-checklist Skill, speckit-clarify Skill, speckit-constitution Skill, speckit-implement Skill, speckit-plan Skill, speckit-specify Skill, speckit-tasks Skill (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (8): Auth Controller, LoginCommand, AuthMode CloudDefault, AuthMode LocalFallback, RegisterCommand, AuthService, IOAuthAuthorizationService, UserRepository

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (7): Family Member / Caregiver, Entity Admin Actor, Healthcare Professional, Patient, Pharmacist Actor, Balsm Healthcare Platform, External Systems

### Community 12 - "Community 12"
Cohesion: 0.40
Nodes (5): Baslm Commercial License (BCL) v1.4, Dual-License Model (AGPL v3 + BCL), Free Tier (Individual, Small Entity, Non-Commercial), Large Deployment Definition, SaaS Deployment Definition

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (5): Clinic Entity Type, Hospital Entity Type, Clinical Module, Imaging Module, Scheduling Module

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): AGENTS.md (agents/rules), Copilot Instructions (Balsm-Roadmap), graphify Skill

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (3): API Cluster, Load Balancer, Observability (Logs/Metrics)

## Knowledge Gaps
- **129 isolated node(s):** `type`, `docs:dev`, `docs:build`, `docs:preview`, `docs:diagrams` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AI Rules & Governance` connect `Community 2` to `Community 6`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `PHI (Protected Health Information)` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Balsm Healthcare Platform` connect `Community 6` to `Community 2`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ASP.NET Core API` (e.g. with `mDNS Broadcaster` and `QR Code Generator`) actually correct?**
  _`ASP.NET Core API` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `API Routing Strategy` (e.g. with `DDD Subdomain Classification (13 Bounded Contexts)` and `Authentication & SSO Routing Strategy`) actually correct?**
  _`API Routing Strategy` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `type`, `docs:dev`, `docs:build` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._