# Quickstart — Patient App MVP (P001)

**Routing conventions**: All API routes consumed by this app follow [`architecture/routing-best-practices.md`](../../architecture/routing-best-practices.md). The `go_router` navigation in the Flutter app uses named routes matching the resource-oriented naming conventions. Web routes on `localhost:3000` follow the website routing patterns in [`architecture/website-routing-strategy.md`](../../architecture/website-routing-strategy.md).

**API subdomains**: The mobile app connects to `api.balsm.health` (`https://api.balsm.health/v1/{context}/{resource}`) in production for cloud-hosted services (auth, emergency-token resolution, account management). During local development the Flutter app targets the local Supabase stack at `localhost:54321`. For local-server-hosted endpoints (admin, workspace, entity management), the target is `local.balsm.health` in deployment or `localhost:5051` in development. See [`architecture/subdomain-route-mapping.md`](../../architecture/subdomain-route-mapping.md).

Get from cloned repo → "PSO-reviewable demo of the consumer exit-gate scenarios" in a few hours of dev time.

## What this gets you

A running Flutter app on iOS Simulator + Android Emulator, talking to a local Supabase project and a local Next.js public-pages site. End-to-end test of all four exit-gate scenarios:

1. Signup with email OTP / Google / Apple in any of EG / SA / AE / a default-class country.
2. Emergency-card lock-surface widget + scannable QR resolving to the public web page in the patient's language.
3. Medication reminder fires offline with adherence event written append-only.
4. Self-service deletion via in-app + via `localhost:3000/account/delete`.

## Prereqs

| Tool | Version | Why |
|---|---|---|
| Flutter | **3.41 stable** | App (per 2026-06-15 SDK-bump directive) |
| Dart | 3.10 | Bundled with Flutter 3.41 |
| Xcode | 17+ | iOS 16+ build + Simulator + WidgetKit |
| Android Studio | 2026.1+ (Android SDK 36, AGP 9.x) | Android build + emulator + lock-screen tile |
| Node | 22 LTS | Next.js 16 public pages |
| Deno | 2.5+ | Supabase Edge Function local runtime |
| Supabase CLI | 2.5+ | Local Supabase stack (Postgres 17 + Auth v2.6) |
| FVM | 4.x | Pin Flutter version per project |
| pnpm | 10.x | `balsm-web` package manager (lockfile committed) |

## Repo layout (three repos, this dir hosts only specs)

```
balsm_app/        # Flutter melos monorepo — this quickstart's primary
  ├── melos.yaml          # workspace + scripts
  ├── packages/
  │   ├── core/                  # shared core layer (subdirs: domain / event_bus / db / network / localization / crash / secure_storage / notifications / kit / test_kit)
  │   ├── balsm_boundary_lint/   # custom_lint rules (no-module-to-module-imports + 5 more)
  │   ├── auth/
  │   ├── disclosure/
  │   ├── home/
  │   ├── profile/
  │   ├── emergency_card/
  │   ├── medications/
  │   ├── sessions/
  │   ├── account/
  │   ├── deletion/
  │   └── geofence_block/
  └── app/                # thin runnable shell (Flutter app entry)
balsm-web/                # Next.js public pages
supabase/                 # Supabase migrations + Edge Functions
Balsm-Core/               # YOU ARE HERE — specs / plan / contracts only
```

## Setup steps (first-time only)

### 1. Start the local Supabase stack

```bash
cd ../supabase
supabase start
# → notes the JWT secret + service-role key + project URL printed on stdout
```

This brings up Postgres + Auth + Storage + Edge Runtime in Docker locally.

### 2. Apply schema + RLS

```bash
supabase db reset
# applies supabase/migrations/*.sql → schema from contracts/supabase-schema.sql + RLS from contracts/supabase-rls.sql
```

### 3. Seed denied-country blocklist (test mode — short list)

```bash
psql $LOCAL_DB_URL -c "INSERT INTO denied_country_blocklist VALUES ('CU','ofac'),('IR','ofac'),('KP','ofac'),('SY','ofac');"
```

### 4. Configure Supabase Auth providers

In Supabase Studio (`localhost:54323` by default):

- **Email**: enable, mode `OTP`, code length 6, expiry 600 s.
- **Google**: enable, paste a test OAuth client id + secret from the Google Cloud Console "Test users" project.
- **Apple**: enable, paste test Apple Service ID + Team ID + Key ID + private key from Apple Developer "Sign In with Apple" test setup.
- **Phone**: **disabled** (FR-001 directive).

### 5. Deploy Edge Functions

```bash
cd ../supabase/functions
for fn in auth-gate auth-attempt-record geofence-check handle-suggest handle-claim \
           emergency-token-mint emergency-token-revoke emergency-token-resolve \
           account-delete-intake account-delete-confirm account-delete-cancel account-delete-purge \
           apple-revoke country-change language-change; do
  supabase functions deploy $fn --no-verify-jwt  # for local dev only
done
```

### 6. Generate emergency-token signing keys

```bash
cd ../supabase
deno run --allow-all scripts/gen-emergency-keys.ts
# → writes private key into Supabase secrets, public key into balsm-web/public/.well-known/emergency-keys.json
```

### 7. Bring up the public web

```bash
cd ../balsm-web
pnpm install
pnpm dev   # → http://localhost:3000
```

### 8. Bring up the Flutter monorepo

```bash
cd ../balsm_app
fvm install                                   # honors .fvmrc (pins Flutter 3.41)
fvm flutter --version                         # → Flutter 3.41.x stable, Dart 3.10.x
dart pub global activate melos 7.0.0          # one-time
melos bootstrap                               # resolves all packages + writes pubspec overrides
melos run gen                                 # parallel build_runner across every package (drift / riverpod / freezed)
melos run analyze                             # parallel `dart analyze` per package; fails on boundary lint violation
melos run test                                # parallel `flutter test` per package

# Run the app
cd app
fvm flutter run --dart-define=SUPABASE_URL=http://localhost:54321 \
                 --dart-define=SUPABASE_ANON_KEY=<from-supabase-start-output> \
                 --dart-define=PUBLIC_WEB_BASE=http://localhost:3000
```

The `app` package is the runnable shell — it depends on `core` + every module and composes `go_router` from each module's `presentation/routes.dart`. Module packages are not directly runnable.

### Boundary lint smoke test

```bash
# Introduce a forbidden import (DO NOT COMMIT)
echo "import 'package:profile/profile.dart';" >> packages/medications/lib/medications.dart
melos run analyze
# → expected error: no-module-to-module-imports: medications cannot import profile
git checkout packages/medications/lib/medications.dart
```

(Run twice, once for `-d ios` and once for `-d android`.)

## Verify SC-001a — signup-to-home ≤90 s P50

1. Wipe app data.
2. Open the app cold → country picker pre-selects.
3. Pick "Sign up with email", enter `test+eg@balsm.local`.
4. Read the 6-digit code from the Supabase Studio Auth → Logs panel.
5. Enter the code → consolidated disclosure renders → tap Continue → home.
6. Stopwatch should read ≤ 90 s.

Repeat with Google + Apple test accounts, and with KSA + UAE country pre-selects.

## Verify US2 — emergency card visible + QR resolves

1. Open the post-signup home → tap "Complete emergency card" prompt.
2. Fill blood type `O+`, one allergy `Penicillin`, one chronic condition `Diabetes Type 1`, one emergency contact name `Mom` + phone `+201001234567`.
3. Save → tap "Mint QR" → choose TTL = 24 h.
4. **iOS**: lock the device → swipe to widgets → "Add widget" → pick "Balsm Emergency" → see blood type + top allergies + top conditions + contact name in `preferred_language`.
5. **Android**: lock the device → swipe down for quick-settings → tap the Balsm tile → see the same card.
6. Scan the QR with a second device's camera → `localhost:3000/emergency/<token>#k=<key>` opens → labels in `preferred_language` + free-text PHI verbatim + tap-to-call works.
7. In app: revoke the token → scan the old QR again → "This emergency link has expired" within 5 s (SC-014).

## Verify SC-004 — medication reminder fires offline ≥7 d

1. Add three medications:
   - `Med A` daily 08:00.
   - `Med B` weekly Friday 19:00.
   - `Med C` every-other-day 14:00.
2. Put the device in airplane mode.
3. In Xcode (iOS) / `adb shell date` (Android), advance the clock to the next scheduled fire time.
4. Notification should fire within ±60 s.
5. Tap "Taken" → check the medication history → adherence event appears with `outcome='taken'`, `scheduled_at` UTC, `actual_at` UTC.

Repeat for "Skip" (verify reason picker) and "Snooze 15 min".

## Verify US4 — self-service deletion (both paths)

### In-app

1. Settings → Account → Delete account → ≤2 taps from settings root (SC-012).
2. Re-auth with email OTP / Google / Apple.
3. Pre-confirmation screen lists exactly what is retained / hard-deleted / wiped (FR-031).
4. Tap Confirm → app signs out everywhere → sign back in → only the cancel-deletion flow appears.
5. Wait 7 days in Supabase Studio with `update user_account set deletion_grace_until = now() - interval '1 minute' where id = ...;` → trigger purge via `supabase functions invoke account-delete-purge`.
6. Verify: `auth.users` row gone, `username_reservation.released_at` set, `emergency_qr_token` rows gone, `deletion_log` row present with `apple_revoke_status` set.

### Web

1. Open `localhost:3000/account/delete` on a phone that has NEVER installed the app.
2. Same three-channel re-auth.
3. Same pre-confirmation screen + final screen.

## Verify SC-006 + SC-016 — PHI-leak guardrails

1. Run the CI fuzz harness locally:
   ```bash
   cd balsm_app
   fvm flutter test test/phi_leak_fuzz_test
   ```
2. Test exercises ≥50 synthetic PHI payloads through:
   - Sentry `beforeSend` (per `contracts/crash-allowlist.json`).
   - Dio network interceptor (per research §13).
   - Network capture asserts zero non-allowlisted field names on the wire.

## Verify SC-011 — RTL renders

1. Switch language to `ar-EG` → all screens render right-to-left.
2. Switch to `ar-SA` → same RTL, week starts Sunday, Gregorian DD/MM/YYYY (no Hijri per 2026-06-15 directive).
3. Switch to `en` → LTR.
4. Golden test suite:
   ```bash
   fvm flutter test test/golden
   ```

## Verify Q1 — global signup

1. Set the device locale + SIM to Lebanon (`LB`).
2. Open the app → country picker pre-selects Lebanon → continue → English UI by default → generic phone-pattern in emergency-contact field → signup completes → home renders.
3. Open the disclosure screen → confirms the **global** notice cites Egypt PDPC primary data-controller posture + lists local rights.
4. Set the device locale + SIM to Cuba (denied per OFAC) → "Balsm is not available in your country" — no retry.

## Verify FR-300…FR-305 — single global account

1. Sign up in EG with email `test+global@balsm.local`.
2. Mint emergency QR + save profile + add medication.
3. Sign out.
4. Change device locale + SIM to KSA.
5. Sign in with same email → home renders with `country_code=EG` data + `preferred_language=ar-EG` (last stored values).
6. Open Settings → Country → KSA → re-auth (email OTP) → re-accept SDAIA disclosure → confirm. `country_code` becomes `SA`; handle / emergency QR / medication / sessions are unchanged.

## Smoke tests for each clarification

- **Q1 (global)**: device locale = `FR` → signup completes; device locale = `CU` → blocked.
- **Q2 (single EU region)**: `supabase status` confirms project region is `eu-west-1`.
- **Q3 (national-ID deferred)**: signup completes without national-ID; emergency-card editor presents the field as optional with the EG / SA / AE country-aware validator only if the user types something.
- **Q4 (UUID v7 PKs)**: `select id from medication_dose_event limit 1;` on the on-device DB → returns a 16-byte BLOB starting with the current millisecond timestamp.
- **Q5 (deferred handle-claim)**: signup lands on home without a handle-claim step in the flow.

## Continuous Integration

- GitHub Actions workflow runs on every PR:
  1. `flutter analyze` + `flutter test` + golden diffs.
  2. `phi_leak_fuzz_test` — SC-006 + SC-016.
  3. `denied_country_blocklist` YAML diff against the embedded copy.
  4. `crash-allowlist.json` schema validation.
  5. Translation Catalog completeness ≥98% per language (SC-203).
  6. Drift schema + generated code up to date.
  7. iOS + Android release build.

## Reviewers' sign-off checklist (before store submission)

- [ ] Patient Safety Officer (Constitution Principle I LOCKED) signs off on:
  - Silent app-data-wipe UX (clarification 2026-06-14 Q4 of clarifications session).
  - Emergency-card surface.
  - Medication reminder flow.
  - Under-18 age-gate behavior.
- [ ] Legal/PDPL Egypt: PDPC controller registration filed.
- [ ] Legal/PDPL KSA: SDAIA controller registration filed.
- [ ] Legal/PDPL UAE: UAE Data Office controller registration filed.
- [ ] Localization: ≥98% completeness in `ar-EG`, `ar-SA`, `ar-AE`, `en`.
- [ ] Store-submission owner: privacy nutrition label + Data Safety form per regional storefront.
