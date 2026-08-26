# Module Package Boundary Contract

**Navigation routing**: Cross-module navigation uses `go_router` named routes (Pattern 3 below). Route-naming conventions follow [`architecture/routing-best-practices.md`](../../architecture/routing-best-practices.md) — names are lowercase with dots for hierarchy (`profile.editor`, `medication.detail`), consistent with the resource-oriented naming in the API routing strategy.

Spec refs: Constitution Principle IV (v1.8.0, 20 canonical contexts); 2026-06-15 DDD + per-module-package directive; 2026-06-15 core-layer-consolidation + module-name-prefix-drop directive; 2026-07-11 bounded-context amendment (`architecture/bounded-contexts/README.md` — modules under `modules/`, `home` folded into `app/`, `balsm_api` published-language package, `records` module added to Personal Health); research §18.

## Goal

Every domain module ships as its own Dart package under `modules/` (named after its concern, no `feature_` prefix) and maps to **exactly one** canonical bounded context per `architecture/bounded-contexts/README.md` — declared in the module README's YAML frontmatter (`context:` / `plane:` / `features:`, the machine-checkable source of truth). Several modules may map to the same context (Identity & Access owns six); no two contexts ever share a package. All cross-cutting infrastructure lives in **one** `core` package shared across every module. Compile-time imports between module packages are forbidden. Cross-module comms use only:
- `core.eventBus` (re-exported from the unified `core` package).
- `go_router` named routes.
- Read-side repository interfaces published from a module's `domain/` barrel (read-only).

## Package taxonomy (14 packages total — was 21)

### Layer 0 — Shared core layer (one package)

| Package | Role |
|---|---|
| `core` | **Single unified core layer** containing every cross-cutting concern: shared kernel (`Result<T>`, `AppFailure`, `AppEvent` base, value objects), event bus, drift database root + SQLCipher boot + UUID v7 adapter, Dio + PHI-leak interceptor (typed .NET-API clients live in `balsm_api`), Translation Catalog + Country Registry, Sentry init + allowlist scrubber, Keychain / EncryptedSharedPreferences wrapper, `flutter_local_notifications` wrapper, shared widgets + theme + RTL helpers, test doubles + fakes + golden helpers (dev-only, gated by build flavor). Internal organization is by subdirectory inside `core/lib/src/{domain,event_bus,db,network,localization,crash,secure_storage,notifications,kit,test_kit}/`. Public barrel `core/lib/core.dart` re-exports the public API of every subdirectory. |

### Layer 1 — Published language + tooling (two packages)

| Package | Role |
|---|---|
| `balsm_api` | HTTP client layer for the .NET API (`BalsmApiClient` + typed endpoint adapters) — the consumer plane's **published-language** surface (maps to the sanctioned non-context value `infrastructure`). Modules never hand-roll HTTP. |
| `balsm_boundary_lint` | Custom_lint rules; dev_dependency of every other package (`tooling`). Validates each module README's `context:` frontmatter against the canonical inventory. |

### Layer 2 — Module packages under `modules/` (10 packages; **no `feature_` prefix** per 2026-06-15 directive)

Module *concern* ≠ bounded context: the concern is what the package does; the **Bounded context** column is the canonical model boundary it belongs to (Constitution Principle IV — one context per module, many modules per context allowed).

| Package | Concern | Bounded context (canonical) | Aggregate roots | Public domain events |
|---|---|---|---|---|
| `auth` | Authentication flows | Identity & Access | `AuthSession` | `UserSignedUp`, `UserSignedIn`, `UserSignedOut`, `LockoutTriggered` |
| `disclosure` | Onboarding disclosure | Identity & Access | `DisclosureAcceptance` | `DisclosureAccepted` |
| `profile` | Health profile | Personal Health (**Core**) | `HealthProfile` (root) + `Allergy` / `ChronicCondition` / `EmergencyContact` entities | `HealthProfileUpdated` |
| `emergency_card` | Emergency card + QR | Personal Health (**Core**) | `EmergencyCardSnapshot`, `EmergencyQrToken` | `EmergencyQrTokenMinted`, `EmergencyQrTokenRevoked` |
| `medications` | Medication reminders | Personal Health (**Core**) | `Medication` (root) + append-only `DoseEvent` entity | `MedicationAdded`, `DoseTaken`, `DoseSkipped`, `DoseSnoozed`, `DoseMissed`, `DoseCorrected` |
| `records` | Patient-owned timeline (mirror entries per ADR-12) | Personal Health (**Core**) | `TimelineEntry` (append-only; `external_source` discriminator — see `architecture/bounded-contexts/personal-health.md`) | `TimelineEntryAppended` |
| `sessions` | Active sessions | Identity & Access | `ActiveSession` | `SessionRevoked` |
| `account` | Country / language settings | Identity & Access | — | `CountryChanged`, `LanguageChanged` |
| `deletion` | Deletion FSM | Identity & Access | `DeletionRequest` | `DeletionRequested`, `DeletionCancelled`, `DeletionPurged` |
| `geofence_block` | Denied-country gate | Identity & Access | — | `BlockedSignupAttempted` |

> The former `home` module was folded into `app/` on 2026-07-11 — it was presentation-only cross-context glue (greeting, nudges, locale refresh) with no domain; that is app-shell's job, not a context member.

### Layer 3 — Application shell

| Package | Role |
|---|---|
| `app` | Runnable Flutter app (`app-shell` — orchestration, not a context). Depends on `core` + `balsm_api` + every module + `flutter_riverpod` + `go_router`. `main.dart` → `bootstrap.dart` → `app.dart` → `router.dart` composes route fragments from each module's `presentation/routes.dart`. Also hosts the absorbed home surface (greeting, onboarding nudges, cross-module event listeners). |

## Why one `core` (vs the prior 10 `core_*`)

- Single barrel `core/lib/core.dart` simplifies the module-side import: `import 'package:core/core.dart';` covers all shared kernel + infrastructure.
- One `pubspec.yaml` to evolve — bumping `drift` or `sentry_flutter` updates one dep entry, not 10.
- Internal `src/` subdir organization preserves the conceptual separation that the prior `core_*` packages had. Boundary between subdirs is enforced by `custom_lint` rules inside the `core` package itself (`core_internal_no_cross_subdir_test_kit_in_release`), so the test_kit subdir cannot leak into release builds.
- Loses some isolation (changing `core.network` recompiles every consumer of `core`) — accepted trade because the patient-app surface is small and shared kernel evolves together anyway.

## `core` internal organization

```
core/
  pubspec.yaml
  lib/
    core.dart                       # public barrel — re-exports every public API below
    src/
      domain/                       # SHARED KERNEL — Result<T>, AppFailure, AppEvent, UuidV7, CountryCode, Bcp47Tag, Iso8601Timestamp, Money. Pure Dart. No Flutter import.
      event_bus/                    # Stream<AppEvent> pub/sub + replay buffer
      db/                           # drift root + SQLCipher boot + UUID v7 BLOB adapter + migration runner
      network/                      # Dio + PHI-leak interceptor (typed API surface lives in the `balsm_api` package — published language for the .NET API)
      localization/                 # Translation Catalog + Country Registry (Gregorian-only)
      crash/                        # Sentry init + allowlist scrubber (beforeSend / beforeBreadcrumb)
      secure_storage/               # Keychain / EncryptedSharedPreferences wrapper
      notifications/                # flutter_local_notifications wrapper + zonedSchedule primitives
      kit/                          # shared widgets, theme, RTL helpers
      test_kit/                     # dev-only fakes + golden helpers (gated by `bool.fromEnvironment('DEV')` build flavor)
  test/
    domain/                         # pure-Dart unit tests
    event_bus/
    db/
    network/
    ...                             # each subdir has its own test tree
```

## DDD layering per module package (unchanged from prior contract)

```
modules/<module>/
  README.md                     # YAML frontmatter: context / plane / features (machine-checkable mapping)
  pubspec.yaml                  # deps: core (+ balsm_api where the module calls the .NET API) + balsm_boundary_lint (dev_dependency)
  lib/
    <module>.dart               # PUBLIC BARREL — use cases + routes + (optional) read repositories
    src/
      domain/                   # PURE DART — no Flutter import
        aggregates/
        entities/
        value_objects/
        events/
        repositories/           # abstract interfaces
        services/
      application/              # use cases (CQRS-ish) + DTOs
        use_cases/
        dtos/
      infrastructure/           # implementations
        drift/                  # drift DAOs + mappers to/from aggregates
        adapters/               # balsm_api endpoint adapters (anti-corruption at the module edge)
      presentation/             # Flutter UI
        screens/
        widgets/
        providers/              # Riverpod providers wiring use cases → screens
        routes.dart             # StatefulShellRoute fragment for go_router
  test/
    domain/
    application/
    infrastructure/
    presentation/
```

## Public barrel API rules

Each module exports from `lib/<module>.dart`:

1. **Application-layer use cases** (e.g. `emergency_card.dart` exports `MintEmergencyQrTokenUseCase`, `RevokeEmergencyQrTokenUseCase`).
2. **Presentation routes** (a `routes.dart` fragment composed into `go_router`).
3. **Read-side repository interfaces** (optional; for cross-module read).
4. **Public domain event classes** (only the event class itself; never aggregates) — needed so cross-module listeners can do `show <EventName>` imports.

What is **NEVER** exported:
- Aggregate roots, entities, value objects (live in `src/domain/`).
- Infrastructure (drift DAOs, API adapters/mappers).
- Write-side repository implementations.

## Boundary lint rules (`balsm_boundary_lint`)

| Rule | Check |
|---|---|
| `no-module-to-module-imports` | Any `import 'package:<module>/...';` from inside another module's `lib/` → error. Allowed exception: a `show <EventName>` import where the symbol is a `*Event` class exposed by the producer's barrel (Pattern 1). |
| `core-must-not-depend-on-module` | Any `import 'package:<module>/...';` from inside `core/lib/` → error. |
| `module-barrel-exposes-only-public-api` | A module's barrel may export only files matching `src/application/**` or `src/presentation/routes.dart` or `src/domain/repositories/read_*.dart` or `src/domain/events/**` → error otherwise. |
| `no-aggregate-leak` | No file outside `src/domain/aggregates/` may import an aggregate class directly → error. |
| `domain-no-flutter-import` | `src/domain/**` files may not `import 'package:flutter/*'` → error. |
| `core-internal-no-cross-subdir-test-kit-in-release` | `core/lib/src/test_kit/**` may not be imported from any non-test, non-dev-flavor code → error. |

## Cross-module comms patterns (unchanged in shape; updated names)

### Pattern 1 — Domain event

`emergency_card` mints a token → publishes `EmergencyQrTokenMinted(jti, expiresAt)` via `core.eventBus`. The app shell (which absorbed the former `home` module) listens, dismisses the "Complete emergency card" nudge. Note: this event stays inside the Personal Health context's published surface — cross-context consumers would go through their own ACL per the Event Rules in `architecture/bounded-contexts/README.md`.

```dart
// In modules/emergency_card/lib/src/application/use_cases/mint_token.dart
import 'package:core/core.dart';

final eventBus = ref.read(eventBusProvider);
await tokenRepository.persist(token);
eventBus.publish(EmergencyQrTokenMinted(jti: token.jti, expiresAt: token.expiresAt));
```

```dart
// In app/lib/listeners/dismiss_card_prompt_on_token_mint.dart (app-shell composition root)
import 'package:core/core.dart';
import 'package:emergency_card/emergency_card.dart' show EmergencyQrTokenMinted;

ref.listen(eventBusProvider.select((b) => b.events.whereType<EmergencyQrTokenMinted>()), (prev, current) {
  ref.read(homeNudgesProvider.notifier).dismissEmergencyCardPrompt();
});
```

### Pattern 2 — Read-side repository

The app shell's home surface shows the user's display_name (lives in `account`'s aggregate). `account` publishes:

```dart
// In account/lib/src/domain/repositories/read_account_repository.dart
abstract class ReadAccountRepository {
  Stream<AccountSummary> watchAccount(UserId id);
}
```

Re-exported via `account/lib/account.dart`. `app/lib/bootstrap.dart` wires the impl. The home surface consumes the interface via Riverpod — never imports `account/src/`.

### Pattern 3 — Named route navigation

`emergency_card`'s empty-state CTA deep-links to `profile`'s editor:

```dart
context.goNamed('profile.editor', extra: {'focus': 'allergies'});
```

`profile` declares the named route in its `routes.dart`. `emergency_card` never imports `profile`.

## On-device table ownership (per module)

Each module owns its drift tables exclusively (Constitution Principle IV: a context owns its schema; within a context, table ownership is per-module — no other module touches them).

| Owner module | Bounded context | Tables |
|---|---|---|
| `profile` | Personal Health | `health_profile`, `allergy`, `chronic_condition`, `emergency_contact` |
| `medications` | Personal Health | `medication`, `medication_dose_event` |
| `disclosure` | Identity & Access | `disclosure_acceptance` |
| `emergency_card` | Personal Health | `emergency_qr_local_snapshot` (local ciphertext + key for the lock-screen widget) |
| `records` | Personal Health | (P002 — timeline tables per `architecture/bounded-contexts/personal-health.md`; skeleton only in P001) |

No cross-module FKs in P001. `core.db` runs the union drift migration.

## Test scope per layer

| Test type | Where | Tool |
|---|---|---|
| Aggregate + VO + domain event tests | `<module>/test/domain/` | `test` (pure Dart VM) |
| Use case tests with fakes | `<module>/test/application/` | `test` + `mocktail` + `core.testKit` fakes |
| Drift / API integration | `<module>/test/infrastructure/` | `test` + local .NET API test host (or recorded fixtures) + drift in-memory DB |
| Widget + golden | `<module>/test/presentation/` | `flutter_test` + `golden_toolkit` |
| Cross-module E2E | `test/e2e_test/` at workspace root | `integration_test` + `patrol` |
| PHI-leak fuzz | `test/phi_leak_fuzz_test/` at workspace root | `test` exercising every module's network paths |

## Versioning

- All packages live in the same `balsm_app` git repo and ship in lockstep.
- `melos version --all` bumps everything together.
- Not published to pub.dev in P001.
