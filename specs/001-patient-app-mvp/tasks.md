---
description: "P001 task list — Patient App MVP"
---

# Tasks: Patient App MVP (P001)

**Input**: Design documents from `/specs/001-patient-app-mvp/`
**Prerequisites**: [data-model.md](./data-model.md), [quickstart.md](./quickstart.md), [contracts/](./contracts/)

## Per-project split (for cheap-model dispatch)

This file is the canonical, phase-ordered master list. For agents focused on one repo, use the filtered per-project files — same task IDs, same `[P]` markers, fewer distractions:

- **Design** (27 tasks, Phase 2.5, BLOCKING GATE) — [`tasks/design.md`](./tasks/design.md) → `design/` (UI-SPEC, mocks, prototype, sign-off)
- **Flutter** (196 tasks: 27 design + 169 implementation) — [`tasks/flutter.md`](./tasks/flutter.md) → `balsm_app_flutter/` (mobile + web targets, public routes via Flutter Web, deeplinks via Universal/App Links)
- **Supabase** (25 tasks) — [`tasks/supabase.md`](./tasks/supabase.md) → `supabase/`
- **Cross-cutting** (2 tasks) — [`tasks/cross-cutting.md`](./tasks/cross-cutting.md) → walkthrough + AGENTS.md

> Phase 2.5 design tasks (D001-D027) are ALSO labeled `[Flutter]` and re-emitted into `tasks/flutter.md`, so the Flutter agent track sees them in execution order. The `tasks/design.md` file is the focused dispatch file when working only on design.

> Decision 2026-06-16: dropped Next.js `balsm-web` repo. Flutter Web hosts public routes (`/emergency/{token}`, `/account/delete`). Universal Links (iOS) + App Links (Android) deep-link to installed app when present, fallback to Flutter Web when not.

Phase boundaries + `[P]` parallelism rules from the master file still apply. A task's ID is globally unique — pull dependencies across files by ID.


**Repo layout** (two repos — all paths below are relative from `Balsm-Core/specs/001-patient-app-mvp/tasks.md`):

```
balsm_app_flutter/        # Flutter melos monorepo — mobile + web targets
  melos.yaml
  packages/
    core/                 # unified core layer (domain, event_bus, db, network, localization, crash, secure_storage, notifications, kit, deeplink, test_kit)
    balsm_boundary_lint/  # custom_lint rules
    auth/
    disclosure/
    home/
    profile/
    emergency_card/       # incl. public route /emergency/{token}
    medications/
    sessions/
    account/
    deletion/             # incl. public route /account/delete
    geofence_block/
  app/                    # runnable shell — builds for iOS, Android, Web
    ios/
      Runner/
        Runner.entitlements           # com.apple.developer.associated-domains
    android/
      app/src/main/AndroidManifest.xml # autoVerify=true intent filters
    web/
      index.html
      .well-known/
        apple-app-site-association
        assetlinks.json

supabase/                 # Supabase migrations + Edge Functions
  supabase/
    migrations/
    functions/            # 20+ Edge Functions
```

**Optimization target**: tasks are sized for execution by cheap / fast models (Haiku-class). Each task names a single file and a single change. When extension of existing code is needed, the task cites the exact file path. The task ID order is also the recommended execution order; `[P]` marks tasks safe to run in parallel.

## Format

`[ID] [P?] [Story?] [Flutter|Supabase] Description with absolute file path`

## Project labels

- `[Flutter]` — `balsm_app_flutter/` (mobile + web targets)
- `[Supabase]` — `supabase/`
- No label — applies to multiple repos

## Path conventions

- Flutter: `../balsm_app_flutter/`
- Supabase: `../supabase/`

---

## Phase 1: Setup — Project Initialization

**Purpose**: Scaffold both repos with directory structure, dependency declarations, build tool config, Flutter Web target, and deeplink manifests. No business logic.

### 1.1 Supabase project init

- [ ] T001 [P] [Supabase] Create `../supabase/supabase/config.toml` with project name `balsm-p001`, region `eu-west-1`, auth settings (email OTP enabled, code length 6, expiry 600s, Google + Apple providers enabled, Phone disabled)
- [ ] T002 [P] [Supabase] Create `../supabase/supabase/migrations/00001_initial_schema.sql` — paste the full content from `contracts/supabase-schema.sql` (all 10 tables + indexes + triggers + seeds)
- [ ] T003 [P] [Supabase] Create `../supabase/supabase/seed.sql` — insert denied-country seed rows (CU, IR, KP, SY) and reserved-handle blocklist seed rows (admin, balsm, support, api, help, null, health)
- [ ] T004 [P] [Supabase] Create RLS policy file at `../supabase/supabase/migrations/00002_rls_policies.sql` — `user_account` SELECT own row only, UPDATE own row only when `deletion_state = 'ACTIVE'`, INSERT for signup flow, DELETE forbidden

### 1.2 Edge Functions scaffolding

- [ ] T005 [P] [Supabase] Create Edge Function directory structure at `../supabase/supabase/functions/` with empty `deno.json` and `import_map.json` — all 20 functions listed below get their own subdirectory in later phases:
  - `auth-gate`, `auth-attempt-record`, `geofence-check`, `handle-claim`, `handle-suggest`, `emergency-token-mint`, `emergency-token-revoke`, `emergency-token-resolve`, `account-delete-intake`, `account-delete-confirm`, `account-delete-cancel`, `account-delete-purge`, `apple-revoke`, `country-change`, `language-change`, `set-dob`, `age-gate-check`, `get-self`, `reserved-handle-check`
- [ ] T006 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/supabase-client.ts` — re-exports `createClient` from `npm:@supabase/supabase-js` with service-role key
- [ ] T007 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/cors.ts` — exports `corsHeaders` object with `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type`
- [ ] T008 [P] [Supabase] Create Edge Function shared library at `../supabase/supabase/functions/_shared/response.ts` — exports `json(data, status)` and `error(message, status)` helpers wrapping `new Response`

### 1.3 Flutter repo init

- [ ] T009 [P] [Flutter] Create `../balsm_app_flutter/melos.yaml` — workspace config with packages `['packages/*', 'app']`, scripts for `gen` (parallel build_runner), `analyze` (parallel dart analyze), `test` (parallel flutter test), `e2e` (integration_test)
- [ ] T010 [P] [Flutter] Create `../balsm_app_flutter/pubspec.yaml` — workspace root pubspec with `name: balsm_app`, `publish_to: none`, dev_dependencies `melos: ^7.0.0`
- [ ] T011 [P] [Flutter] Create `../balsm_app_flutter/.fvmrc` — pinning Flutter `3.41.0-stable`
- [ ] T012 [P] [Flutter] Create `../balsm_app_flutter/packages/core/pubspec.yaml` — `name: core`, dependencies: `flutter`, `drift: ^2.29`, `sqlite3_flutter_libs`, `sqlcipher_flutter_libs`, `dio: ^5.8`, `supabase_flutter: ^2.10`, `sentry_flutter: ^9.0`, `flutter_riverpod: ^2.6`, `flutter_local_notifications: ^18.0`, `flutter_secure_storage: ^9.2`, `freezed_annotation`, `json_annotation`, `intl: ^0.20`
- [ ] T013 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/core.dart` — empty public barrel file with comment `// Re-export all public APIs from src/subdirs`
- [ ] T014 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/domain/` — scaffold directory with empty `.gitkeep` files for `aggregates/`, `value_objects/`, `events/`
- [ ] T015 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/event_bus/` — scaffold directory with `.gitkeep`
- [ ] T016 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/db/` — scaffold directory with `.gitkeep`
- [ ] T017 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/network/` — scaffold directory with `.gitkeep`
- [ ] T018 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/localization/` — scaffold directory with `.gitkeep`
- [ ] T019 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/crash/` — scaffold directory with `.gitkeep`
- [ ] T020 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/secure_storage/` — scaffold directory with `.gitkeep`
- [ ] T021 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/notifications/` — scaffold directory with `.gitkeep`
- [ ] T022 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/kit/` — scaffold directory with `.gitkeep`
- [ ] T022a [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/deeplink/` — scaffold directory with `.gitkeep` (will hold `DeeplinkRouter` in T133)
- [ ] T023 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/test_kit/` — scaffold directory with `.gitkeep`
- [ ] T024 [P] [Flutter] Create `../balsm_app_flutter/packages/balsm_boundary_lint/pubspec.yaml` — `name: balsm_boundary_lint`, dependencies: `custom_lint_builder`, `analyzer`, `source_span`
- [ ] T025 [P] [Flutter] For each of the 10 module packages, create `../balsm_app_flutter/packages/{auth,disclosure,home,profile,emergency_card,medications,sessions,account,deletion,geofence_block}/pubspec.yaml` — `name: <name>`, dependencies: `core`, `flutter_riverpod`, `go_router`, `intl`, dev_dependencies: `balsm_boundary_lint`, `mocktail`, `golden_toolkit`
- [ ] T026 [P] [Flutter] For each of the 10 module packages, create the DDD layer directory structure:
  - `lib/<name>.dart` (empty barrel)
  - `lib/src/domain/aggregates/`, `lib/src/domain/entities/`, `lib/src/domain/value_objects/`, `lib/src/domain/events/`, `lib/src/domain/repositories/`
  - `lib/src/application/use_cases/`, `lib/src/application/dtos/`
  - `lib/src/infrastructure/drift/`, `lib/src/infrastructure/supabase/`, `lib/src/infrastructure/adapters/`
  - `lib/src/presentation/screens/`, `lib/src/presentation/widgets/`, `lib/src/presentation/providers/`, `lib/src/presentation/routes.dart`
- [ ] T027 [P] [Flutter] Create `../balsm_app_flutter/app/pubspec.yaml` — `name: app`, dependencies: `core`, `auth`, `disclosure`, `home`, `profile`, `emergency_card`, `medications`, `sessions`, `account`, `deletion`, `geofence_block`, `flutter_riverpod`, `go_router`
- [ ] T028 [P] [Flutter] Create `../balsm_app_flutter/app/lib/main.dart` — calls `bootstrap()` then `runApp(BalsmApp())`
- [ ] T029 [P] [Flutter] Create `../balsm_app_flutter/app/lib/app.dart` — `BalsmApp` StatelessWidget wrapping `ProviderScope` + `MaterialApp.router` with `go_router`
- [ ] T030 [P] [Flutter] Create `../balsm_app_flutter/app/lib/bootstrap.dart` — registers all repository implementations, drift database, and providers

### 1.4 Flutter Web + deeplinking setup

- [ ] T031 [P] [Flutter] Create `../balsm_app_flutter/app/web/index.html` — minimal HTML shell, `<base href="/">`, meta viewport, Flutter bootstrap script tag, preload + favicon for PWA install
- [ ] T032 [P] [Flutter] Create `../balsm_app_flutter/app/web/manifest.json` — PWA manifest with `name: Balsm`, `display: standalone`, theme color, icons (192/512), localized `lang` switch via `<html lang>`
- [ ] T033 [P] [Flutter] Update `../balsm_app_flutter/app/pubspec.yaml` to enable web target — add `app_links: ^6.3` (universal/app links) and `url_strategy: ^0.3` (path URL strategy, no `#`); confirm `flutter: web: true` in the runner config
- [ ] T034 [P] [Flutter] Create `../balsm_app_flutter/app/web/.well-known/apple-app-site-association` — JSON binding bundle ID `health.balsm.app` to paths `/emergency/*` and `/account/delete`, served as `application/json` with no extension (iOS Universal Links per AASA spec)
- [ ] T035 [P] [Flutter] Create `../balsm_app_flutter/app/web/.well-known/assetlinks.json` — Android Digital Asset Links JSON: `relation: ["delegate_permission/common.handle_all_urls"]`, `target.namespace: android_app`, `package_name: health.balsm.app`, `sha256_cert_fingerprints: [...]` (filled by CI from signing config)
- [ ] T035a [P] [Flutter] Create `../balsm_app_flutter/app/ios/Runner/Runner.entitlements` — add `com.apple.developer.associated-domains` with `applinks:{BASE_URL}` (build-time substituted per FR-216)
- [ ] T035b [P] [Flutter] Update `../balsm_app_flutter/app/android/app/src/main/AndroidManifest.xml` — add `<intent-filter android:autoVerify="true">` for `https://{BASE_URL}/emergency/*` and `https://{BASE_URL}/account/delete`, `DEFAULT` + `BROWSABLE` categories, `VIEW` action

---

## Phase 2: Foundational — Core Shared Kernel (Blocking Prerequisites)

**Purpose**: Cross-cutting infrastructure every user story depends on. **No US task may start until this phase completes.**

### 2.1 Core: domain value objects

- [ ] T036 [P] [Flutter] Create `UuidV7` value object at `../balsm_app_flutter/packages/core/lib/src/domain/value_objects/uuid_v7.dart` — 16-byte RFC 9562 UUID v7 with `.timestamp` accessor, `UuidV7.generate()` factory, JSON serialization
- [ ] T037 [P] [Flutter] Create `CountryCode` value object at `../balsm_app_flutter/packages/core/lib/src/domain/value_objects/country_code.dart` — ISO 3166-1 alpha-2 wrapper with `.isDenied` check against injected denied-list, `.defaultTimezone` IANA zone resolution, `ar-SA` / `ar-EG` / `ar-AE` / `en` locale mapping
- [ ] T038 [P] [Flutter] Create `Bcp47Tag` value object at `../balsm_app_flutter/packages/core/lib/src/domain/value_objects/bcp47_tag.dart` — language tag with `.isFirstClass` (true for `ar-EG`, `ar-SA`, `ar-AE`, `en`), `.fallback` to `en`, `.isRtl`
- [ ] T039 [P] [Flutter] Create `Iso8601Timestamp` value object at `../balsm_app_flutter/packages/core/lib/src/domain/value_objects/iso8601_timestamp.dart` — UTC milliseconds wrapper with `.toDateTime`, `.toIso8601String`, `.fromDateTime` factory
- [ ] T040 [P] [Flutter] Create `AppResult<T>` at `../balsm_app_flutter/packages/core/lib/src/domain/app_result.dart` — `Result<T>` type with `.isSuccess`, `.isFailure`, `.value`, `.error`, static factories `Result.success(T)`, `Result.failure(AppFailure)`
- [ ] T041 [P] [Flutter] Create `AppFailure` sealed class at `../balsm_app_flutter/packages/core/lib/src/domain/app_failure.dart` — `ValidationFailure(String message)`, `NotFoundFailure`, `ConflictFailure`, `UnauthorizedFailure`, `NetworkFailure`, `StorageFailure`
- [ ] T042 [P] [Flutter] Create `AppEvent` base sealed class at `../balsm_app_flutter/packages/core/lib/src/domain/events/app_event.dart` — abstract `String get eventName`, `Map<String, dynamic> toJson()`
- [ ] T043 [P] [Flutter] Create `Money` value object at `../balsm_app_flutter/packages/core/lib/src/domain/value_objects/money.dart` — currency code + minor units, EGP / SAR / AED / default-class factory constructors
- [ ] T044 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export all 8 value objects + `AppResult` + `AppFailure` + `AppEvent`

### 2.2 Core: event bus

- [ ] T045 [P] [Flutter] Create `EventBus` at `../balsm_app_flutter/packages/core/lib/src/event_bus/event_bus.dart` — `Stream<AppEvent>` pub/sub via `StreamController.broadcast()`, `publish(AppEvent event)`, `Stream<AppEvent> get events`, Riverpod provider `eventBusProvider`
- [ ] T046 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export `EventBus` and `eventBusProvider`

### 2.3 Core: drift database root

- [ ] T047 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/db/app_database.dart` — drift `AppDatabase` class with SQLCipher encryption key from `flutter_secure_storage`, WAL mode PRAGMAs, migration runner, `@Database` annotation including all module table classes as the database grows
- [ ] T048 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/db/uuid_v7_converter.dart` — `TypeConverter<UuidV7, Uint8List>` for drift BLOB columns
- [ ] T049 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export `AppDatabase` and `uuidV7Converter`

### 2.4 Core: network + Supabase wrapper

- [ ] T050 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/network/supabase_client_wrapper.dart` — anti-corruption layer wrapping `SupabaseClient`, exposes typed methods `signInWithEmail(email)`, `signInWithGoogle()`, `signInWithApple()`, `signOut()`, `onAuthStateChange` stream
- [ ] T051 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/network/phi_leak_interceptor.dart` — Dio interceptor that scrubs request/response body fields matching the allowlist from `contracts/crash-allowlist.json` before any logging/transport
- [ ] T052 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/network/dio_client_provider.dart` — Riverpod provider `dioClientProvider` returning a `Dio` instance with `PhiLeakInterceptor`, base URL from `SupabaseClientWrapper`
- [ ] T053 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export network layer

### 2.5 Core: localization + country + translation catalog

- [ ] T054 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/localization/translation_catalog.dart` — `TranslationCatalog` class loading JSON bundles from `assets/i18n/{locale}.json`, `String translate(String key, {String? locale})`, `bool hasTranslation(String key, String locale)`, Riverpod provider `translationCatalogProvider`
- [ ] T055 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/localization/country_registry.dart` — `CountryRegistry` with country metadata: ISO code, default IANA timezone, first-class BCP 47 tags, Gregorian-only calendar flag, phone format hint, national-ID validator per FR-211, supervisory authority name per FR-219
- [ ] T056 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export localization layer

### 2.6 Core: crash reporting (Sentry)

- [ ] T057 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/crash/sentry_init.dart` — `initSentry()` function calling `SentryFlutter.init` with `beforeSend` callback that scrubs all non-allowlisted fields per `contracts/crash-allowlist.json`, `beforeBreadcrumb` similar scrub, `environment` from build flavor
- [ ] T058 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export `initSentry`

### 2.7 Core: secure storage wrapper

- [ ] T059 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/secure_storage/secure_storage_wrapper.dart` — wraps `flutter_secure_storage`, typed methods `readToken(String key)`, `writeToken(String key, String value)`, `deleteToken(String key)`, `clearAll()`, Riverpod provider `secureStorageProvider`
- [ ] T060 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export secure storage wrapper

### 2.8 Core: notifications wrapper

- [ ] T061 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/notifications/notification_service.dart` — wraps `FlutterLocalNotificationsPlugin`, `initialize()` with Android + iOS channel config, `zonedSchedule(int id, String title, String body, TZDateTime dateTime, ...)` for medication reminders, `cancel(int id)`, `cancelAll()`, Riverpod provider `notificationServiceProvider`
- [ ] T062 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export notification service

### 2.9 Core: shared widgets + theme + RTL

- [ ] T063 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/kit/theme.dart` — `BalsmTheme` with light + dark `ThemeData`, typography scale, color palette, `RtlWrapper` widget that flips `Directionality` based on `Bcp47Tag.isRtl`
- [ ] T064 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/kit/shared_widgets.dart` — `BalsmButton`, `BalsmTextField` (with Arabic numeral normalization per FR-213), `BalsmCountryPicker`, `BalsmLoadingIndicator`, `BalsmErrorBanner`
- [ ] T065 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export kit layer

### 2.10 Core: test kit

- [ ] T066 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/test_kit/fakes.dart` — `FakeEventBus`, `FakeSupabaseClientWrapper`, `FakeSecureStorage`, `FakeNotificationService`, `FakeTranslationCatalog`, `FakeCountryRegistry` — all gated by `bool.fromEnvironment('DEV')`
- [ ] T067 [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/test_kit/golden_helpers.dart` — `goldenTest(String name, Widget widget)` helper wrapping `golden_toolkit` with RTL + LTR variants
- [ ] T068 [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to re-export test_kit gated on `bool.fromEnvironment('DEV')`
- [ ] T069 [Flutter] Update `../balsm_app_flutter/app/lib/main.dart` to call `initSentry()` before `bootstrap()`

### 2.11 Boundary lint rules

- [ ] T070 [P] [Flutter] Create 6 custom_lint rule files at `../balsm_app_flutter/packages/balsm_boundary_lint/lib/src/rules/`:
  - `no_module_to_module_imports.dart` — error on `import 'package:<context>/...'` from outside that module
  - `core_must_not_depend_on_module.dart` — error on `import 'package:<context>/...'` from inside core/
  - `module_barrel_exposes_only_public_api.dart` — barrel may export only `application/`, `presentation/routes.dart`, `domain/repositories/read_*.dart`, `domain/events/**`
  - `no_aggregate_leak.dart` — no import of aggregate classes outside `src/domain/aggregates/`
  - `domain_no_flutter_import.dart` — `src/domain/**` may not import `package:flutter/*`
  - `core_internal_no_cross_subdir_test_kit_in_release.dart` — test_kit imports blocked in non-dev flavors

**Checkpoint**: foundation ready. All user stories below may now proceed with core shared kernel available.

---

## Phase 2.5: UI/UX Design & Prototype Review (Blocking Gate)

**Purpose**: Produce reviewable UI/UX design spec + interactive prototype for every P001 screen BEFORE Flutter implementation starts. Anchored on existing `balsm-design` skill (brand tokens in `Balsm-Core/brand/colors_and_type.css`, patient-app skeleton in `Balsm-AI/plugin/skills/balsm-design/patient_app/`, preview cards in `.../preview/`). RTL + LTR variants for all screens. PHI-safe placeholder data only.

**Goal**: Stakeholder sign-off on visual design + interaction flow per user story. No Flutter code may start until sign-off recorded.

**Independent test**: Open `design/prototype/index.html` in browser → click through all 6 user-story flows (auth, profile, emergency, medications, deletion, country-change) → switch RTL ↔ LTR toggle → switch theme (light/dark) → review report exported.

### 2.5.1 Design spec + screen inventory

- [ ] D001 [Flutter] Create `design/UI-SPEC.md` — design contract for P001: imports `Balsm-Core/brand/colors_and_type.css` as token source, lists every screen mapped to FRs + SCs, locks typography scale (Display / Body / Caption), spacing scale (4/8/12/16/24/32), radii (sm/md/lg/full), motion (durations + curves), elevation, RTL mirroring rules, dark-mode contrast targets WCAG AA, focus-ring spec
- [ ] D002 [Flutter] Create `design/SCREEN-INVENTORY.md` — table mapping every screen (CountryPicker, EmailSignUp, OtpVerification, SocialSignIn, ConsolidatedDisclosure, Home, HandleClaim, HealthProfileEditor, EmergencyCard, QrCodeDisplay, PublicEmergencyResolve, MedicationList, AddMedication, TodayScreen, DoseHistory, DeleteAccount, DeletionConfirm, DeletionCancelled, PublicDelete, Sessions, CountrySettings, LanguageSettings, Lockout, NotFound) to: user story, FR, SC, RTL-mirror notes, accessibility notes
- [ ] D003 [Flutter] Create `design/COMPONENT-CONTRACT.md` — for every shared widget from `core/kit/shared_widgets.dart` (BalsmButton, BalsmTextField, BalsmCountryPicker, BalsmLoadingIndicator, BalsmErrorBanner, BalsmCard, BalsmListItem, BalsmDialog, BalsmBottomSheet, BalsmAppBar, BalsmBottomNav, BalsmFab) — states (default/hover/focus/active/disabled/loading/error), token bindings, RTL behavior, a11y label requirements

### 2.5.2 High-fidelity mock generation

- [ ] D004 [P] [Flutter] Create `design/mocks/auth/` HTML mocks for US1 — 4 screens (country picker, email signup, OTP verification, social sign-in) × 2 dirs (LTR-en, RTL-ar) × 2 themes (light, dark) = 16 HTML files using `brand/colors_and_type.css` tokens, no JS frameworks
- [ ] D005 [P] [Flutter] Create `design/mocks/disclosure/` — consolidated disclosure screen (long-scroll) × LTR/RTL × light/dark = 4 files; per-country supervisory authority strings (Egypt PDPC, KSA SDAIA, UAE Data Office) per FR-219
- [ ] D006 [P] [Flutter] Create `design/mocks/home/` — Home empty state, Home with nudges (handle, emergency card, meds), Home filled = 3 screens × LTR/RTL × light/dark = 12 files
- [ ] D007 [P] [Flutter] Create `design/mocks/profile/` — HealthProfileEditor sections (blood type, allergies list, allergy add modal, conditions, emergency contacts), HandleClaim with live validation states = 6 screens × LTR/RTL × light/dark = 24 files; Arabic numeral normalization preview per FR-213
- [ ] D008 [P] [Flutter] Create `design/mocks/emergency_card/` — EmergencyCard view, TTL picker, QrCodeDisplay, PublicEmergencyResolve (browser variant), revoked-token state, lock-screen widget previews (iOS WidgetKit + Android tile) = 7 screens × LTR/RTL × light/dark = 28 files
- [ ] D009 [P] [Flutter] Create `design/mocks/medications/` — MedicationList empty + filled, AddMedication (schedule shape picker: daily/weekly/custom), DoseHistory, TodayScreen with missed-dose banner, timezone-shift modal per FR-023, notification preview = 7 screens × LTR/RTL × light/dark = 28 files
- [ ] D010 [P] [Flutter] Create `design/mocks/deletion/` — DeleteAccount pre-confirmation (FR-031 retained/deleted/wiped data list), DeletionConfirm, DeletionCancelled, PublicDelete (browser variant), PublicDeleteCancelled, PostDeletionLogin = 6 screens × LTR/RTL × light/dark = 24 files
- [ ] D011 [P] [Flutter] Create `design/mocks/sessions/` — Sessions list (multiple devices), per-device detail, "Sign out everywhere" confirm = 3 screens × LTR/RTL × light/dark = 12 files
- [ ] D012 [P] [Flutter] Create `design/mocks/country_lang/` — CountrySettings, LanguageSettings, country-change re-auth, re-disclosure with new authority = 4 screens × LTR/RTL × light/dark = 16 files
- [ ] D013 [P] [Flutter] Create `design/mocks/auth_states/` — Lockout countdown screen, geofence-blocked screen, network-error, OTP-expired = 4 screens × LTR/RTL × light/dark = 16 files
- [ ] D014 [P] [Flutter] Create `design/mocks/system/` — NotFound (FR-404), error-boundary, splash, onboarding loading = 4 screens × LTR/RTL × light/dark = 16 files

### 2.5.3 Interactive prototype

- [ ] D015 [Flutter] Create `design/prototype/index.html` — interactive shell wrapping all mocks: left nav (US flows), iOS device frame (reuse `Balsm-AI/plugin/skills/balsm-design/patient_app/ios-frame.jsx` skeleton), RTL/LTR toggle, theme toggle, locale dropdown (`en`, `ar-EG`, `ar-SA`, `ar-AE`), country dropdown for re-disclosure variants
- [ ] D016 [Flutter] Create `design/prototype/flows.json` — declarative flow graph: each US flow as ordered list of screen IDs + edge labels (tap targets), driving the prototype's "Next/Back" controls
- [ ] D017 [Flutter] Create `design/prototype/assets/data.json` — synthetic non-PHI placeholder data (fictional names, no real numbers; matches `phi_leak_fuzz_test/corpus.dart` shape so designers and devs share fixtures)
- [ ] D018 [P] [Flutter] Create `design/prototype/styles/prototype.css` — prototype chrome (nav, toolbar, frame) using same `brand/colors_and_type.css` tokens; does NOT override component styles
- [ ] D019 [P] [Flutter] Create `design/prototype/scripts/prototype.js` — minimal vanilla JS: route to mock via hash, toggle dir/theme/locale via `<html dir>` + `data-theme` + `lang` attributes (no frameworks)

### 2.5.4 Review gate + sign-off

- [ ] D020 [Flutter] Create `design/REVIEW-CHECKLIST.md` — 6-pillar checklist (visual hierarchy, motion + interaction, accessibility WCAG AA, RTL + locale, brand fidelity, edge states + errors) per screen, used by reviewers; reuse `gsd-ui-auditor` rubric shape
- [ ] D021 [Flutter] Create `design/REVIEW-SIGNOFF.md` — empty signoff doc with stakeholder rows (PM, design lead, eng lead, compliance lead), per-flow approval columns, comments column, date column
- [ ] D022 [Flutter] Run `design/prototype/index.html` review session — collect comments, file findings under `design/findings/<date>.md`, resolve or defer; second-pass mocks updated in place
- [ ] D023 [Flutter] Update `design/REVIEW-SIGNOFF.md` with signatures + date — **gate unlocks Phase 3+ implementation**. Tasks T071+ may NOT start until this file shows all stakeholders signed
- [ ] D024 [P] [Flutter] Export design tokens snapshot at `design/tokens-snapshot.json` — JSON dump of every token used (locked at sign-off time) so Flutter implementation can compare against expected values in a CI check

### 2.5.5 Optional design enhancements

- [ ] D025 [P] [Flutter] Create `design/MOTION-SPEC.md` — per-screen motion specs (page transitions, modal enter/exit, list-item stagger, QR reveal, OTP shake on error) with durations + curves anchored to `brand/colors_and_type.css` motion tokens
- [ ] D026 [P] [Flutter] Create `design/A11Y-SPEC.md` — VoiceOver / TalkBack labels per screen, focus order, touch target ≥44pt, contrast pairs verified, reduced-motion alternates, font scaling up to 200%
- [ ] D027 [P] [Flutter] Create `design/COPY-SPEC.md` — UX writing per screen anchored on `brand/baslm-brand-canvas.md` voice + tone; localizations for `en`, `ar-EG`, `ar-SA`, `ar-AE`; feeds the i18n bundle creation at T100

**Checkpoint**: design spec + prototype reviewed + signed off by all stakeholders. `tokens-snapshot.json` locked. Implementation phases 3-9 may proceed referencing finalized mocks + spec.

---

## Phase 3: US1 — Signup & Auth (Priority: P1)

**Goal**: Patient signs up with email OTP / Google / Apple, country picker pre-selects, denied countries blocked, disclosure accepted, lands on home. Signup-to-home ≤90s P50 (SC-001a).

**Independent Test**: Fresh install → app opens → country picker → enter email → receive OTP → enter OTP → consolidated disclosure → tap Continue → home renders with name.

### 3.1 Supabase: auth-gate Edge Function

- [ ] T071 [P] [Supabase] [US1] Create `../supabase/supabase/functions/auth-gate/index.ts` — reads `X-Client-Country-Code` header, checks `denied_country_blocklist` (reject 403 if denied), checks `account_lockout` for the identifier (reject 423 if locked), calls Supabase Auth sign-in or sign-up, returns result
- [ ] T072 [P] [Supabase] [US1] Create `../supabase/supabase/functions/geofence-check/index.ts` — accepts `country_code` param, queries `denied_country_blocklist`, returns `{ allowed: boolean, source?: string }`
- [ ] T073 [P] [Supabase] [US1] Create `../supabase/supabase/functions/auth-attempt-record/index.ts` — called after every failed auth attempt, upserts `account_lockout` row: increments `failed_attempts`, resets `rolling_window_started_at` if outside 10-min window, sets `locked_until` when attempts >= 5

### 3.2 Flutter: auth module

- [ ] T074 [P] [Flutter] [US1] Create `auth` aggregate `AuthSession` at `../balsm_app_flutter/packages/auth/lib/src/domain/aggregates/auth_session.dart` — sealed state: `Unauthenticated`, `Authenticated(userId, email, provider, sessionToken)`, `LockedOut(until, identifier)`
- [ ] T075 [P] [Flutter] [US1] Create `auth` domain events at `../balsm_app_flutter/packages/auth/lib/src/domain/events/` — `UserSignedUp(userId, email, provider, countryCode)`, `UserSignedIn(userId, email, provider)`, `UserSignedOut(userId)`, `LockoutTriggered(identifier, lockedUntil)`
- [ ] T076 [P] [Flutter] [US1] Create `auth` `ReadAuthRepository` interface at `../balsm_app_flutter/packages/auth/lib/src/domain/repositories/read_auth_repository.dart` — `Stream<AuthSession> watchSession()`
- [ ] T077 [P] [Flutter] [US1] Create `auth` Supabase adapter at `../balsm_app_flutter/packages/auth/lib/src/infrastructure/supabase/supabase_auth_adapter.dart` — implements auth operations using `core`'s `SupabaseClientWrapper`, calls Edge Functions `auth-gate` + `geofence-check` + `auth-attempt-record`
- [ ] T078 [P] [Flutter] [US1] Create `auth` signup use case at `../balsm_app_flutter/packages/auth/lib/src/application/use_cases/sign_up_use_case.dart` — accepts `email | google | apple` + `countryCode`, validates country via `geofence-check`, calls `auth-gate` Edge Function, dispatches `UserSignedUp` event
- [ ] T079 [P] [Flutter] [US1] Create `auth` sign-in use case at `../balsm_app_flutter/packages/auth/lib/src/application/use_cases/sign_in_use_case.dart` — accepts `email | google | apple` + `countryCode`, handles lockout state, dispatches `UserSignedIn` event
- [ ] T080 [P] [Flutter] [US1] Create `auth` sign-out use case at `../balsm_app_flutter/packages/auth/lib/src/application/use_cases/sign_out_use_case.dart` — calls `signOut`, dispatches `UserSignedOut`
- [ ] T081 [P] [Flutter] [US1] Create `auth` providers at `../balsm_app_flutter/packages/auth/lib/src/presentation/providers/auth_providers.dart` — `authSessionProvider` (StreamProvider), `signUpProvider`, `signInProvider`, `signOutProvider`
- [ ] T082 [P] [Flutter] [US1] Create `auth` screens at `../balsm_app_flutter/packages/auth/lib/src/presentation/screens/` — `CountryPickerScreen`, `EmailSignUpScreen`, `OtpVerificationScreen`, `SocialSignInScreen`
- [ ] T083 [P] [Flutter] [US1] Create `auth` routes at `../balsm_app_flutter/packages/auth/lib/src/presentation/routes.dart` — `StatefulShellRoute` fragment with named routes `auth.countryPicker`, `auth.emailSignUp`, `auth.otpVerification`, `auth.socialSignIn`
- [ ] T084 [Flutter] [US1] Update `../balsm_app_flutter/packages/auth/lib/auth.dart` public barrel to export use cases, read repository interface, domain events, routes

### 3.3 Flutter: disclosure module

- [ ] T085 [P] [Flutter] [US1] Create `disclosure` aggregate `DisclosureAcceptance` at `../balsm_app_flutter/packages/disclosure/lib/src/domain/aggregates/disclosure_acceptance.dart` — properties: `disclosureId`, `version`, `countryCodeAtAccept`, `supervisoryAuthorityNameAtAccept`, `preferredLanguageAtAccept`, `acceptedAt`
- [ ] T086 [P] [Flutter] [US1] Create `disclosure` domain event `DisclosureAccepted` at `../balsm_app_flutter/packages/disclosure/lib/src/domain/events/disclosure_accepted.dart`
- [ ] T087 [P] [Flutter] [US1] Create `disclosure` use case at `../balsm_app_flutter/packages/disclosure/lib/src/application/use_cases/accept_disclosure_use_case.dart` — persists on-device disclosure_acceptance row + syncs to cloud mirror via Supabase
- [ ] T088 [P] [Flutter] [US1] Create `disclosure` drift DAO at `../balsm_app_flutter/packages/disclosure/lib/src/infrastructure/drift/disclosure_dao.dart` — `insert(DisclosureAcceptance)`, `watchAcceptance(disclosureId, version)`
- [ ] T089 [P] [Flutter] [US1] Create `disclosure` screens at `../balsm_app_flutter/packages/disclosure/lib/src/presentation/screens/` — `ConsolidatedDisclosureScreen` rendering the consolidated onboarding disclosure (localized per FR-040, RTL per preferred language)
- [ ] T090 [P] [Flutter] [US1] Create `disclosure` routes at `../balsm_app_flutter/packages/disclosure/lib/src/presentation/routes.dart` — `disclosure.onboarding` route
- [ ] T091 [Flutter] [US1] Update `../balsm_app_flutter/packages/disclosure/lib/disclosure.dart` public barrel

### 3.4 Flutter: geofence_block module

- [ ] T092 [P] [Flutter] [US1] Create `geofence_block` read-side repository at `../balsm_app_flutter/packages/geofence_block/lib/src/domain/repositories/read_denied_countries_repository.dart` — `Future<bool> isDenied(String countryCode)` calling Edge Function `geofence-check`, `Stream<List<String>> watchDeniedCountryCodes()` from cloud or cached list
- [ ] T093 [P] [Flutter] [US1] Create `geofence_block` domain event `BlockedSignupAttempted(countryCode, source)` at `../balsm_app_flutter/packages/geofence_block/lib/src/domain/events/blocked_signup_attempted.dart`
- [ ] T094 [Flutter] [US1] Update `../balsm_app_flutter/packages/geofence_block/lib/geofence_block.dart` public barrel

### 3.5 Flutter: home module skeleton

- [ ] T095 [P] [Flutter] [US1] Create `home` screens at `../balsm_app_flutter/packages/home/lib/src/presentation/screens/` — `HomeScreen` showing user display_name, nudge cards (complete emergency card, medication reminders placeholder), country/language info
- [ ] T096 [P] [Flutter] [US1] Create `home` routes at `../balsm_app_flutter/packages/home/lib/src/presentation/routes.dart` — `home` as initial route after auth
- [ ] T097 [Flutter] [US1] Update `../balsm_app_flutter/packages/home/lib/home.dart` public barrel

### 3.6 Flutter: app shell composition

- [ ] T098 [Flutter] [US1] Compose `go_router` in `../balsm_app_flutter/app/lib/router.dart` — import route fragments from every module, compose auth guard (redirect unauthenticated to `auth.countryPicker`), shell route for authenticated screens with bottom nav
- [ ] T099 [Flutter] [US1] Wire `bootstrap()` in `../balsm_app_flutter/app/lib/bootstrap.dart` — register all repository implementations for auth, disclosure, geofence_block, home; call `AppDatabase` init
- [ ] T100 [Flutter] [US1] Create i18n JSON translation bundles at `../balsm_app_flutter/packages/core/assets/i18n/` — `en.json`, `ar-EG.json`, `ar-SA.json`, `ar-AE.json` — with all keys for signup screens, disclosure text, country picker, home, error messages (at least 98% completeness per SC-203)

### 3.7 Flutter: account module (signup creates row)

- [ ] T101 [P] [Flutter] [US1] Create `account` value objects at `../balsm_app_flutter/packages/account/lib/src/domain/value_objects/` — `AccountSummary(id, handle, displayName, countryCode, preferredLanguage, deletionState)` read-only projection
- [ ] T102 [P] [Flutter] [US1] Create `account` domain events at `../balsm_app_flutter/packages/account/lib/src/domain/events/` — `CountryChanged(userId, oldCountry, newCountry)`, `LanguageChanged(userId, oldLanguage, newLanguage)`
- [ ] T103 [P] [Flutter] [US1] Create `account` read repository interface at `../balsm_app_flutter/packages/account/lib/src/domain/repositories/read_account_repository.dart` — `Future<AccountSummary?> getAccount(String userId)`, `Stream<AccountSummary> watchAccount(String userId)`
- [ ] T104 [P] [Flutter] [US1] Create `account` Supabase adapter at `../balsm_app_flutter/packages/account/lib/src/infrastructure/supabase/supabase_account_adapter.dart` — queries `user_account` table via Supabase client, returns `AccountSummary`
- [ ] T105 [Flutter] [US1] Update `../balsm_app_flutter/packages/account/lib/account.dart` public barrel

**Checkpoint**: signup-to-home round-trip complete. User can pick country, sign up with email OTP / Google / Apple, accept disclosure, land on home. Verified by SC-001a.

---

## Phase 4: US1a — Handle Claim & Health Profile (Priority: P2)

**Goal**: Patient claims a unique handle, completes their health profile (blood type, allergies, conditions, emergency contacts). On-device PHI storage only.

**Independent Test**: Complete US1 → tap "Claim handle" → enter `mypharmacy` → success → tap "Complete profile" → fill blood type + 1 allergy + 1 condition + 1 contact → save → restart app → data persists.

### 4.1 Supabase: handle Edge Functions

- [ ] T106 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/reserved-handle-check/index.ts` — accepts `handle`, returns `{ reserved: boolean }` by querying `reserved_handle_blocklist`
- [ ] T107 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/handle-claim/index.ts` — validates handle format `^[a-z0-9_.]{3,30}$`, checks `reserved_handle_blocklist`, checks `username_reservation` for uniqueness, inserts `username_reservation` row + updates `user_account.handle`, returns `204`
- [ ] T108 [P] [Supabase] [US1a] Create `../supabase/supabase/functions/handle-suggest/index.ts` — accepts `display_name`, returns 3 handle suggestions by appending random digits

### 4.2 Flutter: profile module (on-device PHI)

- [ ] T109 [P] [Flutter] [US1a] Create `profile` aggregates at `../balsm_app_flutter/packages/profile/lib/src/domain/aggregates/` — `HealthProfile` root with embedded `Allergy`, `ChronicCondition`, `EmergencyContact` entities per data-model.md §2.1–§2.4
- [ ] T110 [P] [Flutter] [US1a] Create `profile` domain event `HealthProfileUpdated` at `../balsm_app_flutter/packages/profile/lib/src/domain/events/health_profile_updated.dart`
- [ ] T111 [P] [Flutter] [US1a] Create `profile` drift DAOs at `../balsm_app_flutter/packages/profile/lib/src/infrastructure/drift/` — `ProfileDao` with CRUD for `health_profile`, `allergy`, `chronic_condition`, `emergency_contact` tables using UUID v7 PKs, `watchProfile` StreamProvider
- [ ] T112 [P] [Flutter] [US1a] Create `profile` use cases at `../balsm_app_flutter/packages/profile/lib/src/application/use_cases/` — `UpdateHealthProfileUseCase`, `AddAllergyUseCase`, `RemoveAllergyUseCase`, `AddChronicConditionUseCase`, `AddEmergencyContactUseCase`
- [ ] T113 [P] [Flutter] [US1a] Create `profile` screens at `../balsm_app_flutter/packages/profile/lib/src/presentation/screens/` — `HealthProfileEditorScreen` with sections for blood type, allergies (up to 50), chronic conditions, emergency contacts; Arabic numeral normalization per FR-213; national-ID field with country-aware validator per FR-211
- [ ] T114 [P] [Flutter] [US1a] Create `profile` routes at `../balsm_app_flutter/packages/profile/lib/src/presentation/routes.dart` — `profile.editor`
- [ ] T115 [Flutter] [US1a] Update `../balsm_app_flutter/packages/profile/lib/profile.dart` public barrel

### 4.3 Flutter: account handle-claim surface

- [ ] T116 [P] [Flutter] [US1a] Create `account` handle claim screen at `../balsm_app_flutter/packages/account/lib/src/presentation/screens/handle_claim_screen.dart` — text input with live validation (3-30 chars, `[a-z0-9_.]`), suggestions button, calls `handle-claim` Edge Function, shows 409 on conflict
- [ ] T117 [P] [Flutter] [US1a] Create `account` handle claim use case at `../balsm_app_flutter/packages/account/lib/src/application/use_cases/claim_handle_use_case.dart`
- [ ] T118 [Flutter] [US1a] Update `home` screen at `../balsm_app_flutter/packages/home/lib/src/presentation/screens/home_screen.dart` to show nudge "Claim your handle" if `user_account.handle` is null

**Checkpoint**: handle claim + health profile CRUD complete. All PHI stored on-device only.

---

## Phase 5: US2 — Emergency Card & QR (Priority: P2)

**Goal**: Patient fills emergency card data, mints QR with configurable TTL, public web page resolves QR. Lock-screen widget on iOS, quick-settings tile on Android. SC-014 token revocation.

**Independent Test**: Complete US1 → tap "Complete emergency card" prompt → fill blood type + 1 allergy + 1 condition + 1 contact → save → mint QR → scan with second device → public page opens with data → revoke token → scan again → "Expired".

### 5.1 Supabase: emergency-token Edge Functions

- [ ] T119 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-mint/index.ts` — service-role function: accepts `user_id`, `ciphertext` (bytea), `profile_etag`, `ttl_seconds`; sets `revoked_at` on prior active token in same TX; inserts new `emergency_qr_token` row; returns `{ jti, expires_at }`
- [ ] T120 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-revoke/index.ts` — sets `revoked_at = now()` on `emergency_qr_token` where `jti = $1 AND user_id = $2`
- [ ] T121 [P] [Supabase] [US2] Create `../supabase/supabase/functions/emergency-token-resolve/index.ts` — public (no auth) function: queries `emergency_qr_token` where `jti = $1 AND revoked_at IS NULL AND expires_at > now()`; returns `{ ciphertext, profile_etag, expires_at, user_id }` or 404

### 5.2 Flutter: emergency_card module

- [ ] T122 [P] [Flutter] [US2] Create `emergency_card` aggregates at `../balsm_app_flutter/packages/emergency_card/lib/src/domain/aggregates/` — `EmergencyCardSnapshot` (PHI fields from health_profile for QR payload), `EmergencyQrToken` (jti, expiresAt, revokedAt, ttl)
- [ ] T123 [P] [Flutter] [US2] Create `emergency_card` domain events at `../balsm_app_flutter/packages/emergency_card/lib/src/domain/events/` — `EmergencyQrTokenMinted(jti, expiresAt)`, `EmergencyQrTokenRevoked(jti)`
- [ ] T124 [P] [Flutter] [US2] Create `emergency_card` use cases at `../balsm_app_flutter/packages/emergency_card/lib/src/application/use_cases/` — `MintEmergencyQrTokenUseCase` (reads HealthProfile snapshot from profile module via read repository, encrypts with client-generated key, calls mint Edge Function), `RevokeEmergencyQrTokenUseCase`, `ResolveEmergencyQrTokenUseCase`
- [ ] T125 [P] [Flutter] [US2] Create `emergency_card` screens at `../balsm_app_flutter/packages/emergency_card/lib/src/presentation/screens/` — `EmergencyCardScreen` (view snapshot, mint QR with TTL picker), `QrCodeDisplayScreen` (renders scannable QR with URL `https://<host>/emergency/<token>#k=<key>`)
- [ ] T126 [P] [Flutter] [US2] Create `emergency_card` lock-screen widgets: `../balsm_app_flutter/packages/emergency_card/lib/src/presentation/widgets/emergency_lock_screen_widget.dart` — shared widget used by both iOS WidgetKit extension and Android quick-settings tile
- [ ] T127 [P] [Flutter] [US2] Create `emergency_card` iOS WidgetKit extension at `../balsm_app_flutter/packages/emergency_card/ios/` — SwiftUI widget showing blood type + top 3 allergies + top 2 conditions + primary contact name, updated via app group user defaults
- [ ] T128 [P] [Flutter] [US2] Create `emergency_card` Android quick-settings tile at `../balsm_app_flutter/packages/emergency_card/android/` — `TileService` subclass showing same data via RemoteViews
- [ ] T129 [P] [Flutter] [US2] Create `emergency_card` routes at `../balsm_app_flutter/packages/emergency_card/lib/src/presentation/routes.dart` — `emergency.card`, `emergency.qrDisplay`
- [ ] T130 [Flutter] [US2] Update `../balsm_app_flutter/packages/emergency_card/lib/emergency_card.dart` public barrel

### 5.3 Flutter Web + deeplink: emergency QR public route

- [ ] T131 [P] [Flutter] [US2] Create `emergency_card` public screen at `../balsm_app_flutter/packages/emergency_card/lib/src/presentation/screens/public_emergency_resolve_screen.dart` — no-auth screen: reads `token` from route param, reads fragment key via `dart:html` (Web) / `app_links` (mobile deeplink), calls `emergency-token-resolve` Edge Function, AES-256-GCM-decrypts ciphertext using fragment key, renders blood type, allergies, conditions, contact; RTL-aware; tap-to-call (`tel:`); print-friendly CSS via `flutter_html` or custom view
- [ ] T132 [P] [Flutter] [US2] Add public route to `../balsm_app_flutter/packages/emergency_card/lib/src/presentation/routes.dart` — `emergency.publicResolve` mapped to path `/emergency/:token` with `noAuthRequired: true` guard bypass; consumes URL fragment `#k=...` for the decryption key (fragment never sent to Edge Function)
- [ ] T133 [P] [Flutter] [US2] Create deeplink handler at `../balsm_app_flutter/packages/core/lib/src/deeplink/deeplink_router.dart` — listens to `app_links` stream, on `https://{BASE_URL}/emergency/{token}#k=...` parses token + key, navigates app via `go_router` to `emergency.publicResolve`; same handler covers mobile (Universal/App Links) and web (path URL strategy)
- [ ] T133a [P] [Flutter] [US2] Add `../balsm_app_flutter/app/web/.well-known/emergency-keys.json` — Ed25519 public key file for emergency token signature verification, served by Flutter Web static assets, generated by CI from `contracts/emergency-token.md` spec

**Checkpoint**: emergency card + QR full round-trip. Mint → scan → public page resolves → revoke → page returns "Expired".

---

## Phase 6: US3 — Medication Reminders (Priority: P3)

**Goal**: Patient adds medications with daily/weekly/custom schedules, notifications fire at correct times offline ≥7 days (SC-004). Dose events logged as append-only. Missed dose detection on foreground.

**Independent Test**: Add 3 medications (daily 08:00, weekly Fri 19:00, every-other-day 14:00) → airplane mode → advance clock → notification fires ±60s → tap Taken → verify dose event appears.

### 6.1 Flutter: medications module

- [ ] T134 [P] [Flutter] [US3] Create `medications` aggregate `Medication` at `../balsm_app_flutter/packages/medications/lib/src/domain/aggregates/medication.dart` — properties per data-model.md §2.5, `recordDose(DoseEvent)` method enforcing invariants (correction parent_event_id check), `isExpired()` check against `endDate`
- [ ] T135 [P] [Flutter] [US3] Create `medications` entity `DoseEvent` at `../balsm_app_flutter/packages/medications/lib/src/domain/entities/dose_event.dart` — outcomes: `taken`, `skipped`, `snoozed`, `missed`, `correction`; append-only invariant (no UPDATE/DELETE)
- [ ] T136 [P] [Flutter] [US3] Create `medications` domain events at `../balsm_app_flutter/packages/medications/lib/src/domain/events/` — `MedicationAdded`, `DoseTaken`, `DoseSkipped`, `DoseSnoozed`, `DoseMissed`, `DoseCorrected`
- [ ] T137 [P] [Flutter] [US3] Create `medications` drift DAO at `../balsm_app_flutter/packages/medications/lib/src/infrastructure/drift/medication_dao.dart` — CRUD for `medication` table, insert-only for `medication_dose_event` with SQLite triggers preventing UPDATE/DELETE per `contracts/medication-scheduler.md`
- [ ] T138 [P] [Flutter] [US3] Create `medications` scheduler at `../balsm_app_flutter/packages/medications/lib/src/infrastructure/drift/medication_scheduler.dart` — per `contracts/medication-scheduler.md`: daily heartbeat at 03:00 rebuilding next 30 days of OS-native triggers, `zonedSchedule` with `exactAllowWhileIdle`, timezone-shift confirmation modal (FR-023)
- [ ] T139 [P] [Flutter] [US3] Create `medications` missed-dose detector at `../balsm_app_flutter/packages/medications/lib/src/infrastructure/drift/missed_dose_detector.dart` — on app foreground: queries scheduled doses `scheduled_at < now() - 30 min` with no matching event, inserts `outcome='missed'` event
- [ ] T140 [P] [Flutter] [US3] Create `medications` use cases at `../balsm_app_flutter/packages/medications/lib/src/application/use_cases/` — `AddMedicationUseCase` (includes schedule rebuild), `RecordDoseOutcomeUseCase`, `EditMedicationUseCase`, `DeleteMedicationUseCase`, `NotifyMissedDosesUseCase`
- [ ] T141 [P] [Flutter] [US3] Create `medications` screens at `../balsm_app_flutter/packages/medications/lib/src/presentation/screens/` — `MedicationListScreen`, `AddMedicationScreen` (with schedule shape picker: daily/weekly/custom), `DoseHistoryScreen`, `TodayScreen` (shows upcoming + missed doses)
- [ ] T142 [P] [Flutter] [US3] Create `medications` routes at `../balsm_app_flutter/packages/medications/lib/src/presentation/routes.dart` — `medications.list`, `medications.add`, `medications.detail`
- [ ] T143 [Flutter] [US3] Update `../balsm_app_flutter/packages/medications/lib/medications.dart` public barrel
- [ ] T144 [Flutter] [US3] Update `home` screen to show medication nudge if no medications added, and a "Today" summary card

### 6.2 Flutter: core notifications wiring

- [ ] T145 [Flutter] [US3] Wire notification tap handling in `../balsm_app_flutter/app/lib/app.dart` — on notification tap, deep-link to medication detail or today screen

**Checkpoint**: medication reminders fire offline ≥7d, dose events logged append-only, missed doses detected on foreground.

---

## Phase 7: US4 — Self-Service Deletion (Priority: P3)

**Goal**: Patient deletes their account from in-app or web. Deletion FSM: request → grace 7 days → purge. Cancel from grace restores account. SC-012 ≤2 taps from settings root.

**Independent Test**: Settings → Delete account → re-auth → confirm → app signs out → sign back in → only cancel-deletion flow → cancel → account restored. Second path: open web deletion URL → same flow.

### 7.1 Supabase: deletion Edge Functions

- [ ] T146 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-intake/index.ts` — sets `deletion_state = 'DELETION_REQUESTED'`, `deletion_confirmed_at = now()`, `deletion_grace_until = now() + 7 days`, inserts `deletion_log` row with `reason_code = 'user_request'`
- [ ] T147 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-confirm/index.ts` — (intake already set the state; this function is called after re-auth in web flow) verifies `deletion_state = 'DELETION_REQUESTED'`, calls Apple `/auth/revoke` if Apple provider, updates `deletion_log.apple_revoke_status`
- [ ] T148 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-cancel/index.ts` — sets `deletion_state = 'DELETION_CANCELLED'` → after next sign-in the client transitions back to `ACTIVE`, inserts `deletion_log` row with `reason_code = 'cancelled'`
- [ ] T149 [P] [Supabase] [US4] Create `../supabase/supabase/functions/account-delete-purge/index.ts` — cron-triggered: queries `user_account` where `deletion_state = 'DELETION_REQUESTED' AND deletion_grace_until < now()`, deletes each matching `auth.users` row (CASCADE removes all related rows), updates `username_reservation.released_at`
- [ ] T150 [P] [Supabase] [US4] Create `../supabase/supabase/functions/apple-revoke/index.ts` — calls Apple's `/auth/revoke` endpoint with the user's Apple refresh token, returns status

### 7.2 Flutter: deletion module

- [ ] T151 [P] [Flutter] [US4] Create `deletion` aggregate `DeletionRequest` at `../balsm_app_flutter/packages/deletion/lib/src/domain/aggregates/deletion_request.dart` — FSM: `ACTIVE` → `DELETION_REQUESTED` → cancellable back to `ACTIVE` or proceed to purge; `cancel()` allowed only from `DELETION_REQUESTED` state
- [ ] T152 [P] [Flutter] [US4] Create `deletion` domain events at `../balsm_app_flutter/packages/deletion/lib/src/domain/events/` — `DeletionRequested`, `DeletionCancelled`, `DeletionPurged`
- [ ] T153 [P] [Flutter] [US4] Create `deletion` use cases at `../balsm_app_flutter/packages/deletion/lib/src/application/use_cases/` — `RequestDeletionUseCase` (calls `account-delete-intake`), `CancelDeletionUseCase` (calls `account-delete-cancel`)
- [ ] T154 [P] [Flutter] [US4] Create `deletion` screens at `../balsm_app_flutter/packages/deletion/lib/src/presentation/screens/` — `DeleteAccountScreen` (pre-confirmation listing retained/deleted/wiped data per FR-031, ≤2 taps from settings root per SC-012), `DeletionConfirmScreen`, `DeletionCancelledScreen`, `PostDeletionLoginScreen` (shows only cancel-deletion flow)
- [ ] T155 [P] [Flutter] [US4] Create `deletion` routes at `../balsm_app_flutter/packages/deletion/lib/src/presentation/routes.dart` — `deletion.request`, `deletion.confirm`, `deletion.cancelled`
- [ ] T156 [Flutter] [US4] Update `../balsm_app_flutter/packages/deletion/lib/deletion.dart` public barrel

### 7.3 Flutter Web + deeplink: account deletion public route

- [ ] T157 [P] [Flutter] [US4] Create `deletion` public screen at `../balsm_app_flutter/packages/deletion/lib/src/presentation/screens/public_delete_screen.dart` — public route `/account/delete`: 3-channel re-auth (email OTP / Google / Apple) via `auth` use cases, pre-confirmation screen matching in-app copy (FR-031), confirm button calls `account-delete-intake`, navigates to done screen; same widget for web and mobile (mobile reached via deeplink)
- [ ] T158 [P] [Flutter] [US4] Create `deletion` cancellation public screen at `../balsm_app_flutter/packages/deletion/lib/src/presentation/screens/public_delete_cancelled_screen.dart` — route `/account/delete-cancelled`: shown when user signs back in during grace period, re-auth then `account-delete-cancel`
- [ ] T158a [P] [Flutter] [US4] Extend `core` `DeeplinkRouter` (T133) to register `/account/delete` and `/account/delete-cancelled` handlers — navigate via `go_router` to public deletion screens regardless of platform (web direct URL, mobile via Universal/App Links)

### 7.4 Flutter: sessions module

- [ ] T159 [P] [Flutter] [US4] Create `sessions` aggregate `ActiveSession` at `../balsm_app_flutter/packages/sessions/lib/src/domain/aggregates/active_session.dart` — id, deviceId, deviceLabel, deviceType, firstSeenAt, lastActivityAt, revokedAt (one-way transition)
- [ ] T160 [P] [Flutter] [US4] Create `sessions` domain event `SessionRevoked` at `../balsm_app_flutter/packages/sessions/lib/src/domain/events/session_revoked.dart`
- [ ] T161 [P] [Flutter] [US4] Create `sessions` use cases at `../balsm_app_flutter/packages/sessions/lib/src/application/use_cases/` — `ListActiveSessionsUseCase`, `RevokeSessionUseCase`, `SignOutEverywhereUseCase`
- [ ] T162 [P] [Flutter] [US4] Create `sessions` screens at `../balsm_app_flutter/packages/sessions/lib/src/presentation/screens/` — `SessionsScreen` (list active devices, tap to revoke, "Sign out everywhere" button)
- [ ] T163 [P] [Flutter] [US4] Create `sessions` routes at `../balsm_app_flutter/packages/sessions/lib/src/presentation/routes.dart` — `sessions.list`
- [ ] T164 [Flutter] [US4] Update `../balsm_app_flutter/packages/sessions/lib/sessions.dart` public barrel

**Checkpoint**: full deletion FSM observable — in-app request, cancel, web path, purge cron. Sessions screen shows active devices.

---

## Phase 8: US5 — Account Lockout & Sessions (Priority: P4)

**Goal**: 5 failed attempts in 10-min rolling window → 15-min lockout. Sessions listed and remotely revocable.

**Independent Test**: Sign in with wrong password 5 times → "Locked" screen with countdown → wait 15 min (or skip by testing DB clock) → sign in successfully.

### 8.1 Flutter: auth lockout UI

- [ ] T165 [P] [Flutter] [US5] Extend `auth` sign-in use case at `../balsm_app_flutter/packages/auth/lib/src/application/use_cases/sign_in_use_case.dart` to handle `LockedOut` state from `auth-gate` Edge Function, surface lockout countdown
- [ ] T166 [P] [Flutter] [US5] Create lockout screen at `../balsm_app_flutter/packages/auth/lib/src/presentation/screens/lockout_screen.dart` — shows "Too many attempts. Try again in X minutes." with timer countdown
- [ ] T167 [Flutter] [US5] Update `auth` routes to include lockout screen

### 8.2 Supabase: lockout

No additional Supabase tasks — `auth-attempt-record` (T073) and `account_lockout` table already handle the lockout state machine from Phase 3.

**Checkpoint**: lockout boundary tested. 5 bad logins → locked → unlock after 15 min.

---

## Phase 9: US6 — Country & Language Change (Priority: P4)

**Goal**: Patient changes country post-signup (re-auth + re-disclosure), changes language with RTL toggle. Single global account across countries (FR-300…FR-305).

**Independent Test**: Sign up in EG → Settings → Change country to KSA → re-auth → re-accept SDAIA disclosure → confirm → country = SA, all data preserved. Change language to العربية → RTL renders.

### 9.1 Supabase: country/language Edge Functions

- [ ] T168 [P] [Supabase] [US6] Create `../supabase/supabase/functions/country-change/index.ts` — validates new country not denied, updates `user_account.country_code` and re-snapshots `preferred_language` defaults for the new country, triggers fresh disclosure acceptance
- [ ] T169 [P] [Supabase] [US6] Create `../supabase/supabase/functions/language-change/index.ts` — updates `user_account.preferred_language`

### 9.2 Flutter: account country/language screens

- [ ] T170 [P] [Flutter] [US6] Create `account` use cases at `../balsm_app_flutter/packages/account/lib/src/application/use_cases/` — `ChangeCountryUseCase`, `ChangeLanguageUseCase`
- [ ] T171 [P] [Flutter] [US6] Create `account` screens at `../balsm_app_flutter/packages/account/lib/src/presentation/screens/` — `CountrySettingsScreen` (selectable country list, calls country-change flow = re-auth + re-disclosure), `LanguageSettingsScreen` (selectable `ar-EG`, `ar-SA`, `ar-AE`, `en`)
- [ ] T172 [P] [Flutter] [US6] Create `account` routes at `../balsm_app_flutter/packages/account/lib/src/presentation/routes.dart` — `account.settings`, `account.country`, `account.language`

### 9.3 Flutter: home country-change integration

- [ ] T173 [Flutter] [US6] Update `home` screen at `../balsm_app_flutter/packages/home/lib/src/presentation/screens/home_screen.dart` to react to `CountryChanged` event — reload locale, update RTL, re-fetch country-specific data
- [ ] T174 [Flutter] [US6] Update `disclosure` screen at `../balsm_app_flutter/packages/disclosure/lib/src/presentation/screens/consolidated_disclosure_screen.dart` to support re-disclosure flow on country change (different supervisory authority name, different copy version)

**Checkpoint**: country change round-trip → re-auth → re-disclosure → RTL toggle → single account preserved across countries.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: PHI-leak guardrails, CI/CD, E2E tests, localization completeness.

- [ ] T175 [P] [Flutter] Create PHI-leak fuzz test at `../balsm_app_flutter/test/phi_leak_fuzz_test/sentry_allowlist_test.dart` — exercises ≥50 synthetic PHI payloads through Sentry `beforeSend` and Dio `PhiLeakInterceptor`, asserts zero non-allowlisted field names on wire (SC-006, SC-016)
- [ ] T176 [P] [Flutter] Create `../balsm_app_flutter/test/phi_leak_fuzz_test/corpus.dart` — generates synthetic Egyptian/Saudi/UAE names, phone numbers, national IDs, DOBs, allergy/condition/medication names in ar + en per `contracts/crash-allowlist.json`
- [ ] T177 [P] [Flutter] Create golden test suite at `../balsm_app_flutter/test/golden/` — RTL + LTR golden tests for every screen (auth, disclosure, home, profile, emergency_card, medications, deletion, sessions, account)
- [ ] T178 [P] [Flutter] Create localized 404 screen at `../balsm_app_flutter/packages/core/lib/src/kit/not_found_screen.dart` — `go_router` `errorBuilder` target, uses `TranslationCatalog`, RTL-aware
- [ ] T179 [P] [Flutter] Wire web-target error boundary at `../balsm_app_flutter/app/lib/web_error_boundary.dart` — `FlutterError.onError` + `PlatformDispatcher.instance.onError` route to localized error page, Sentry capture with same allowlist
- [ ] T180 [P] [Flutter] Add Flutter Web `flutter build web --release` smoke test at `../balsm_app_flutter/test/web_smoke/public_routes_test.dart` — verify `/emergency/{token}` + `/account/delete` resolve to public screens without auth redirect; verify deeplink fragment-key parser
- [ ] T181 [P] [Flutter] Create CI workflow at `../balsm_app_flutter/.github/workflows/ci.yml` — steps: flutter analyze, flutter test, golden diffs, phi_leak_fuzz_test, drift schema check, translation catalog ≥98% completeness per language, iOS + Android release build
- [ ] T182 [P] [Supabase] Create CI workflow at `../supabase/.github/workflows/ci.yml` — steps: supabase db diff, Edge Function typecheck via deno check, migration dry-run
- [ ] T183 [P] [Flutter] Extend Flutter CI workflow `../balsm_app_flutter/.github/workflows/ci.yml` with a `build-web` job — `flutter build web --release --wasm`, validate `.well-known/apple-app-site-association` content-type + JSON, validate `assetlinks.json` SHA-256 fingerprint matches release signing cert, publish artifact for Firebase Hosting / Cloudflare Pages
- [ ] T184 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/signup_to_home_test.dart` — full signup flow via Patrol
- [ ] T185 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/emergency_qr_roundtrip_test.dart` — mint QR → verify public page resolves
- [ ] T186 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/medication_reminder_test.dart` — add medication → advance clock → verify notification fires
- [ ] T187 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/deletion_flow_test.dart` — request deletion → cancel → sign in → verify no data loss
- [ ] T188 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/country_change_test.dart` — sign up EG → change to KSA → verify re-disclosure appears
- [ ] T189 [Flutter] Verify translation catalog completeness across all 4 locales (`en`, `ar-EG`, `ar-SA`, `ar-AE`) — every key present, ≥98% completeness per SC-203
- [ ] T190 Run the `quickstart.md` walkthrough end-to-end on iOS Simulator + Android Emulator; record pass/fail per SC-001a, US2, SC-004, US4, SC-006, SC-016, SC-011, Q1, FR-300..FR-305
- [ ] T191 Update `../balsm_app_flutter/AGENTS.md` notes section to mention the project structure (12 packages, boundary lint rules, core shared kernel)

---

## Dependencies & Execution Order

### Phase order

```
Phase 1 (Setup)
  │
  ▼
Phase 2 (Foundational — Core + Boundary Lint)
  │
  ▼
Phase 2.5 (UI/UX Design + Prototype Review) ── BLOCKING GATE: stakeholder sign-off required
  │
  ├──► Phase 3 (US1 — Signup & Auth) ────────── P1, blocks everything
  │         │
  │         ├──► Phase 4 (US1a — Handle + Profile) ── P2
  │         ├──► Phase 5 (US2 — Emergency Card) ──── P2
  │         ├──► Phase 6 (US3 — Medications) ─────── P3
  │         ├──► Phase 7 (US4 — Deletion) ────────── P3
  │         └──► Phase 8 (US5 — Lockout) ─────────── P4
  │
  └──► Phase 9 (US6 — Country Change) ────────── P4
          │
          ▼
      Phase 10 (Polish & Cross-Cutting)
```

### Within each user story

- **US1** tasks: Supabase Edge Functions (T071-T073) may run in parallel with Flutter module (T074-T100).
- **US1a**: Supabase handle Edge Functions (T106-T108) parallel with Flutter profile module (T109-T118).
- **US2**: Two tracks (Supabase T119-T121, Flutter T122-T133a — incl. Flutter Web public route + deeplink) fully parallel.
- **US3**: Flutter medications module (T134-T144) then core notifications wiring (T145).
- **US4**: Tracks (Supabase T146-T150, Flutter deletion T151-T156 + public T157-T158a, Flutter sessions T159-T164) fully parallel.
- **US5**: Flutter lockout UI only (T165-T167) — Supabase lockout already deployed.
- **US6**: Supabase Edge Functions (T168-T169) parallel with Flutter screens (T170-T174).

### Parallel opportunities

- Phase 1 strongly parallel — 35 tasks across 3 repos, marked `[P]`.
- Phase 2 strongly parallel — 35 tasks across core subdirectories and lint rules.
- Phases 3-6 may run on separate developers/agents after Phase 2 completes.
- Phase 9 depends on auth being available (re-auth flow), so cannot start before US1.

---

## Parallel execution examples

### Phase 1 burst (Supabase + Flutter + Web)

```bash
# Supabase track (8 tasks)
Task: T001 supabase/config.toml
Task: T002 migration 00001_initial_schema.sql
Task: T003 seed.sql
Task: T004 migration 00002_rls_policies.sql
Task: T005 Edge Function directory scaffold
Task: T006 _shared/supabase-client.ts
Task: T007 _shared/cors.ts
Task: T008 _shared/response.ts

# Flutter track (22 tasks)
Task: T009 melos.yaml
Task: T010 pubspec.yaml
...
Task: T030 bootstrap.dart

# Web track (5 tasks)
Task: T031 package.json
...
Task: T035 supabase-client.ts
```

### Phase 3 (US1) parallel tracks

```bash
# Edge Functions (3 tasks)
Task: T071 auth-gate/index.ts
Task: T072 geofence-check/index.ts
Task: T073 auth-attempt-record/index.ts

# Flutter auth module (11 tasks)
Task: T074 auth_session.dart
Task: T075 domain events (5 files)
Task: T076 read_auth_repository.dart
...
Task: T084 auth.dart barrel

# Flutter disclosure module (7 tasks)
Task: T085 disclosure_acceptance.dart
...
Task: T091 disclosure.dart barrel

# Flutter geofence_block module (3 tasks)
Task: T092 read_denied_countries_repository.dart
...
Task: T094 geofence_block.dart barrel
```

---

## Implementation strategy

### MVP first (US1 only)

1. Phase 1 (35 tasks) + Phase 2 (35 tasks) → foundation ready
2. Phase 3 US1 (34 tasks) → signup-to-home round-trip complete
3. **Stop and validate**: run quickstart step SC-001a
4. Demo / ship MVP. Subsequent stories add value without breaking US1.

### Incremental delivery

- After US1 → demo signup flow + disclosure + home
- Add US1a → handle claim + health profile → demo
- Add US2 → emergency card + QR + public web page → demo
- Add US3 → medication reminders offline → demo
- Add US4 → deletion FSM both paths → demo
- Add US5 → lockout + sessions → demo
- Add US6 → country change + RTL → demo
- Polish → CI, E2E, PHI-leak fuzz, completeness checks

### Parallel team strategy

- Foundation team: Phase 1 + Phase 2 (70 tasks, well-parallelized)
- Dev A: US1 (Phase 3, 34 tasks) — auth-heavy
- Dev B: US1a + US2 (Phases 4+5) — profile + emergency card
- Dev C: US3 (Phase 6) — medication scheduler
- Dev D: US4 + US5 (Phases 7+8) — deletion + sessions
- Dev E: US6 (Phase 9) — country/language
- Polish team picks up Phase 10 after stories land

---

## Notes for cheap-model execution

- Each task names the exact file path. Open the file (or create it if absent), apply the named change, do not refactor adjacent code.
- When a task says "extend `<existing file>`", load the file first, locate the cited symbol, and add the new behavior without rewriting unrelated regions.
- Every module follows the same DDD template (domain/ → application/ → infrastructure/ → presentation/). Copy-paste the pattern from a completed module to bootstrap a new one.
- All drift DAOs must use `UuidV7` for all PHI table PKs (UUID v7 per Q4 resolution).
- All drift tables with PHI must go through `SQLCipher` encryption (handled by `core.db.AppDatabase`).
- All Supabase Edge Functions use the `_shared/` library for `createClient`, `corsHeaders`, and response helpers.
- All `[P]` tasks in the same phase may run in parallel — they touch different files.
- Test tasks (T175-T188) are collected in Phase 10; they reference patterns found in `core/test_kit/` and can be written last.
