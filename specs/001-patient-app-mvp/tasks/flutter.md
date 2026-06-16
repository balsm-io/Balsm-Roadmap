---
description: "P001 tasks — Flutter track"
---

# P001 Tasks — Flutter Track

Filtered from `../tasks.md`. Phase + section headers preserved. Only `[Flutter]` rows kept.

Format: `[ID] [P?] [Story?] [Project] Description with absolute file path`


## Phase 1: Setup — Project Initialization

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
### 1.5 Build flavors (dev / staging / prod) + multi-server selector

- [ ] T035c [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/config/flavor.dart` — `enum Flavor { dev, staging, prod }`; `class FlavorConfig { final Flavor flavor; final String supabaseUrl; final String supabaseAnonKey; final String? sentryDsn; final String appNameSuffix; final bool serverSelectorEnabled; }`; `FlavorConfig.current` getter reading from `--dart-define` keys `FLAVOR`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SENTRY_DSN`
- [ ] T035d [P] [Flutter] Create `../balsm_app_flutter/app/lib/main_dev.dart` — entry point: `FlavorConfig.init(Flavor.dev)`, calls `bootstrap()` then `runApp(BalsmApp())`; dev flavor sets `serverSelectorEnabled = true`
- [ ] T035e [P] [Flutter] Create `../balsm_app_flutter/app/lib/main_staging.dart` — entry point: `FlavorConfig.init(Flavor.staging)`, locks `serverSelectorEnabled = false`
- [ ] T035f [P] [Flutter] Create `../balsm_app_flutter/app/lib/main_prod.dart` — entry point: `FlavorConfig.init(Flavor.prod)`, locks `serverSelectorEnabled = false`
- [ ] T035g [P] [Flutter] Update `../balsm_app_flutter/app/lib/main.dart` to delegate to `main_dev.dart` (default for `flutter run` without `-t`); add comment: "Use `flutter run -t lib/main_<flavor>.dart --flavor <flavor>`"
- [ ] T035h [P] [Flutter] Update `../balsm_app_flutter/app/android/app/build.gradle` — add `productFlavors { dev { applicationIdSuffix ".dev"; manifestPlaceholders = [appNameSuffix: " Dev"] }; staging { applicationIdSuffix ".staging"; manifestPlaceholders = [appNameSuffix: " Staging"] }; prod { applicationIdSuffix ""; manifestPlaceholders = [appNameSuffix: ""] } }`; `flavorDimensions "default"`
- [ ] T035i [P] [Flutter] Create `../balsm_app_flutter/app/android/app/src/dev/`, `src/staging/`, `src/prod/` resource dirs each with `res/mipmap-*/ic_launcher.png` + `res/values/strings.xml` (`app_name="Balsm Dev/Staging/Balsm"`); dev icon has red corner badge, staging amber, prod clean
- [ ] T035j [P] [Flutter] Create iOS xcconfig per flavor at `../balsm_app_flutter/app/ios/Flutter/`: `Dev.xcconfig`, `Staging.xcconfig`, `Prod.xcconfig` — each sets `BUNDLE_ID_SUFFIX=.dev/.staging/(empty)`, `APP_NAME_SUFFIX= Dev/ Staging/(empty)`, `ASSETS_PATH=ios/Runner/Assets.xcassets/AppIconDev` etc.
- [ ] T035k [P] [Flutter] Update `../balsm_app_flutter/app/ios/Runner.xcodeproj/project.pbxproj` to add 3 schemes (`Runner-Dev`, `Runner-Staging`, `Runner-Prod`) each pointing to its xcconfig + entry-point Dart file via `FLUTTER_TARGET`; 3 configurations Debug/Profile/Release × 3 flavors = 9 build configs total
- [ ] T035l [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/config/server_preset.dart` — `class ServerPreset { final String label; final String url; final String anonKey; const ServerPreset({...}); }`; const list `kServerPresets = [ServerPreset(label: "Local", url: "http://localhost:54321", anonKey: "..."), ServerPreset(label: "Staging", url: "https://<staging>.supabase.co", anonKey: "..."), ServerPreset(label: "Prod", url: "https://<prod>.supabase.co", anonKey: "...")]`
- [ ] T035m [P] [Flutter] Create `../balsm_app_flutter/packages/core/lib/src/config/active_server.dart` — `class ActiveServerStore` wraps `SecureStorage`; methods `read() async → ServerPreset?`, `write(ServerPreset preset) async`, `clear() async`; key `balsm.active_server_preset`; default = `FlavorConfig.current.supabaseUrl`+`AnonKey` if no override
- [ ] T035n [P] [Flutter] Update `../balsm_app_flutter/packages/core/lib/src/network/supabase_client_wrapper.dart` (T050) to read URL+anonKey from `ActiveServerStore.read()` at init; expose `Future<void> reconfigure(ServerPreset preset)` that calls `ActiveServerStore.write()` then re-initializes Supabase client; broadcast `SupabaseReconfigured(preset)` AppEvent on the bus
- [ ] T035o [P] [Flutter] Create dev-only screen at `../balsm_app_flutter/packages/core/lib/src/dev/server_selector_screen.dart` — `if (!FlavorConfig.current.serverSelectorEnabled) Navigator.pop()` guard; lists `kServerPresets` + custom URL/anonKey form; on select calls `SupabaseClientWrapper.reconfigure()`; shows current preset + warning banner "Changing server signs you out"; persisted via `ActiveServerStore`
- [ ] T035p [P] [Flutter] Update `../balsm_app_flutter/packages/core/lib/core.dart` to conditionally export `dev/server_selector_screen.dart` only when `FlavorConfig.current.flavor == Flavor.dev`; in staging/prod the symbol does not exist (compile-time guarantee via `--dart-define-from-file`)
- [ ] T035q [P] [Flutter] Update Sentry init at `../balsm_app_flutter/packages/core/lib/src/crash/sentry_init.dart` (T057) to read DSN from `FlavorConfig.current.sentryDsn`; if null (dev flavor) → no `SentryFlutter.init` call, log to stdout instead; release name = `balsm@<version>+<build>-<flavor>`; environment = `flavor.name`
- [ ] T035r [P] [Flutter] Create `../balsm_app_flutter/.vscode/launch.json` — 3 configurations (Dev, Staging, Prod) each with `args: ["--flavor", "<flavor>", "-t", "lib/main_<flavor>.dart", "--dart-define-from-file=env/<flavor>.json"]`
- [ ] T035s [P] [Flutter] Create env files at `../balsm_app_flutter/app/env/dev.json`, `env/staging.json`, `env/prod.json` — `{ "FLAVOR": "dev", "SUPABASE_URL": "...", "SUPABASE_ANON_KEY": "...", "SENTRY_DSN": "" }`; `env/*.json` gitignored except `env/example.json` checked in
- [ ] T035t [P] [Flutter] Update `../balsm_app_flutter/melos.yaml` — add scripts: `run:dev` = `flutter run -t lib/main_dev.dart --flavor dev --dart-define-from-file=env/dev.json`; same for `run:staging`, `run:prod`; `build:android:<flavor>` = `flutter build apk --flavor <flavor> -t lib/main_<flavor>.dart --dart-define-from-file=env/<flavor>.json`; same for iOS, web

## Phase 2: Foundational — Core Shared Kernel (Blocking Prerequisites)

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

**Checkpoint**: foundation ready. All user stories below may now proceed with core shared kernel available.


## Phase 2.5: UI/UX Design & Prototype Review (Blocking Gate)

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


## Phase 3: US1 — Signup & Auth (Priority: P1)

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


## Phase 4: US1a — Handle Claim & Health Profile (Priority: P2)

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


## Phase 5: US2 — Emergency Card & QR (Priority: P2)

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


## Phase 6: US3 — Medication Reminders (Priority: P3)

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


## Phase 7: US4 — Self-Service Deletion (Priority: P3)

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


## Phase 8: US5 — Account Lockout & Sessions (Priority: P4)

### 8.1 Flutter: auth lockout UI

- [ ] T165 [P] [Flutter] [US5] Extend `auth` sign-in use case at `../balsm_app_flutter/packages/auth/lib/src/application/use_cases/sign_in_use_case.dart` to handle `LockedOut` state from `auth-gate` Edge Function, surface lockout countdown
- [ ] T166 [P] [Flutter] [US5] Create lockout screen at `../balsm_app_flutter/packages/auth/lib/src/presentation/screens/lockout_screen.dart` — shows "Too many attempts. Try again in X minutes." with timer countdown
- [ ] T167 [Flutter] [US5] Update `auth` routes to include lockout screen

**Checkpoint**: lockout boundary tested. 5 bad logins → locked → unlock after 15 min.


## Phase 9: US6 — Country & Language Change (Priority: P4)

### 9.2 Flutter: account country/language screens

- [ ] T170 [P] [Flutter] [US6] Create `account` use cases at `../balsm_app_flutter/packages/account/lib/src/application/use_cases/` — `ChangeCountryUseCase`, `ChangeLanguageUseCase`
- [ ] T171 [P] [Flutter] [US6] Create `account` screens at `../balsm_app_flutter/packages/account/lib/src/presentation/screens/` — `CountrySettingsScreen` (selectable country list, calls country-change flow = re-auth + re-disclosure), `LanguageSettingsScreen` (selectable `ar-EG`, `ar-SA`, `ar-AE`, `en`)
- [ ] T172 [P] [Flutter] [US6] Create `account` routes at `../balsm_app_flutter/packages/account/lib/src/presentation/routes.dart` — `account.settings`, `account.country`, `account.language`, `account.developer` (route only registered when `FlavorConfig.current.serverSelectorEnabled` is true)
- [ ] T172a [P] [Flutter] [US6] Update `account` settings root screen at `../balsm_app_flutter/packages/account/lib/src/presentation/screens/settings_screen.dart` to conditionally render a "Developer" section showing tile "Switch server" + active preset label — visible only when `FlavorConfig.current.flavor == Flavor.dev`; tap opens `core` `ServerSelectorScreen` (T035o); section spatially separated below regular settings with `--space-8` margin and warning icon
### 9.3 Flutter: home country-change integration

- [ ] T173 [Flutter] [US6] Update `home` screen at `../balsm_app_flutter/packages/home/lib/src/presentation/screens/home_screen.dart` to react to `CountryChanged` event — reload locale, update RTL, re-fetch country-specific data
- [ ] T174 [Flutter] [US6] Update `disclosure` screen at `../balsm_app_flutter/packages/disclosure/lib/src/presentation/screens/consolidated_disclosure_screen.dart` to support re-disclosure flow on country change (different supervisory authority name, different copy version)

**Checkpoint**: country change round-trip → re-auth → re-disclosure → RTL toggle → single account preserved across countries.


## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T175 [P] [Flutter] Create PHI-leak fuzz test at `../balsm_app_flutter/test/phi_leak_fuzz_test/sentry_allowlist_test.dart` — exercises ≥50 synthetic PHI payloads through Sentry `beforeSend` and Dio `PhiLeakInterceptor`, asserts zero non-allowlisted field names on wire (SC-006, SC-016)
- [ ] T176 [P] [Flutter] Create `../balsm_app_flutter/test/phi_leak_fuzz_test/corpus.dart` — generates synthetic Egyptian/Saudi/UAE names, phone numbers, national IDs, DOBs, allergy/condition/medication names in ar + en per `contracts/crash-allowlist.json`
- [ ] T177 [P] [Flutter] Create golden test suite at `../balsm_app_flutter/test/golden/` — RTL + LTR golden tests for every screen (auth, disclosure, home, profile, emergency_card, medications, deletion, sessions, account)
- [ ] T178 [P] [Flutter] Create localized 404 screen at `../balsm_app_flutter/packages/core/lib/src/kit/not_found_screen.dart` — `go_router` `errorBuilder` target, uses `TranslationCatalog`, RTL-aware
- [ ] T179 [P] [Flutter] Wire web-target error boundary at `../balsm_app_flutter/app/lib/web_error_boundary.dart` — `FlutterError.onError` + `PlatformDispatcher.instance.onError` route to localized error page, Sentry capture with same allowlist
- [ ] T180 [P] [Flutter] Add Flutter Web `flutter build web --release` smoke test at `../balsm_app_flutter/test/web_smoke/public_routes_test.dart` — verify `/emergency/{token}` + `/account/delete` resolve to public screens without auth redirect; verify deeplink fragment-key parser
- [ ] T181 [P] [Flutter] Create CI workflow at `../balsm_app_flutter/.github/workflows/ci.yml` — steps: flutter analyze, flutter test, golden diffs, phi_leak_fuzz_test, drift schema check, translation catalog ≥98% completeness per language, iOS + Android release build
- [ ] T183 [P] [Flutter] Extend Flutter CI workflow `../balsm_app_flutter/.github/workflows/ci.yml` with a `build-web` job — `flutter build web --release --wasm`, validate `.well-known/apple-app-site-association` content-type + JSON, validate `assetlinks.json` SHA-256 fingerprint matches release signing cert, publish artifact for Firebase Hosting / Cloudflare Pages
- [ ] T184 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/signup_to_home_test.dart` — full signup flow via Patrol
- [ ] T185 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/emergency_qr_roundtrip_test.dart` — mint QR → verify public page resolves
- [ ] T186 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/medication_reminder_test.dart` — add medication → advance clock → verify notification fires
- [ ] T187 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/deletion_flow_test.dart` — request deletion → cancel → sign in → verify no data loss
- [ ] T188 [P] [Flutter] Add E2E test at `../balsm_app_flutter/test/e2e_test/country_change_test.dart` — sign up EG → change to KSA → verify re-disclosure appears
- [ ] T189 [Flutter] Verify translation catalog completeness across all 4 locales (`en`, `ar-EG`, `ar-SA`, `ar-AE`) — every key present, ≥98% completeness per SC-203
