# Phased Delivery Steps

This document outlines the essential steps and deliverables for the Balsm MVP and technical foundation. Each section addresses a critical area for successful phased delivery.

---

## 1. MVP Scope & Phasing
- Define clear breakdown of Phase 1, Phase 2, Phase 3
- Prioritize bounded contexts for each phase
- Specify feature inclusion/exclusion per phase
- Keep eye on the overall roadmap and long-term vision
- Ensure each phase delivers standalone value while building towards the full vision

## 2. Technical Architecture Document
- Document tech stack decisions (database, message broker, cache, search engine, file storage, container orchestration)
- Describe module communication patterns
- Outline authentication flow
- Define multi-tenancy strategy
- Detail event-driven design

## 3. Data Model / ERD
- Map entity relationships per bounded context
- List key entities and their attributes
- Visualize relationships (ERD diagrams)

## 4. API Design
- Specify core resource structure for the phase modules
- Define endpoint patterns and naming conventions
- Document request/response formats

## 5. UI/UX Wireframes
- Create Figma designs for every UI screen and component before implementation
- Include the Figma URL in the corresponding GitHub issue and PR description
- Design user flows for the Flutter app
- Create screen layouts for key modules
- Address role-based view switching

## 6. Project Scaffolding
- Establish initial structure for Balsm-API-DotNet and balsm_app_flutter
- Ensure modular monolith architecture alignment
- Set up folder structure, build scripts, and CI/CD basics

## 7. Business Rules
- Document explicit business rules for each bounded context in the phase
- Cover: validation, state transitions, access control, immutability, conflicts
- State enforcement point for each rule (domain / API / UI / database)
- Note edge cases and exceptions

## 8. User Journeys
- Map end-to-end user journeys for each actor in the phase
- Define: actor, goal, preconditions, steps, postconditions, alternative/error paths
- Use as acceptance test blueprints
- Cover both happy paths and failure/recovery paths

## 9. Domain Events Catalog
- Define all domain events for each bounded context in the phase
- Each event: name (past tense, PascalCase), payload, publisher, subscribers
- Events are the contract between bounded contexts — naming must be stable

## 10. Ubiquitous Language
- Define shared vocabulary for all bounded contexts in the phase
- Each term: canonical name, definition, rejected synonyms, owning context
- One concept, one name, everywhere (code, API, database, docs, UI)

## 11. Sequence Diagrams
- Generate a Mermaid sequence diagram for each feature in the phase
- Show: participants, request-response flow, domain events, error paths
- One diagram per feature

## 12. Acceptance Criteria
- Define testable acceptance criteria for every feature (Given/When/Then)
- Include both positive and negative criteria
- Feature is "done" only when all its criteria pass

## 13. Testing Strategy
- Define testing layers: unit, integration, E2E
- Map business rules to unit tests, user journeys to E2E tests
- Set coverage targets per layer

## 14. Permission Matrix
- Map every feature to permission keys and allowed actors
- Define default permission groups for common team types
- Note contextual restrictions (e.g., "own branch only")

## 15. Notification Map
- List all notifications triggered by the phase's features
- Define: trigger event, recipient, channel, content summary, priority
- Notifications must trace back to a domain event

## 16. Error Codes & Responses
- Define a standardized error catalog per bounded context
- Each error: unique code, HTTP status, EN/AR messages, resolution hint
- Error codes are stable — once published, never renamed

## 17. Migration & Seed Data
- List schema migrations required for the phase
- Define seed/reference data needed for features to function
- Include rollback scripts for each migration

## 18. Dependency Map
- Define build order and dependencies between features in the phase
- Identify hard blockers vs. soft dependencies
- Identify critical path and parallelizable work

## 19. Risks & Assumptions
- Document known risks and assumptions for the phase
- Assess impact (high/medium/low) and define mitigation
- Validate assumptions early

## 20. Localization Checklist
- Identify new user-facing strings needing EN and AR translations
- Note RTL layout considerations for new screens
- Address locale-specific formatting (dates, numbers, currency)

## 21. Rollback Plan
- Define rollback method per component (app, API, database, config)
- Note data impact of rollback
- Define decision criteria for triggering a rollback

---

> Use this checklist to guide each phase plan. Technical details belong in the technical documentation — this outlines what to deliver, not how.
