# P001 Screen Inventory

> Per-screen mapping to user stories, functional requirements, success criteria, RTL behavior, accessibility notes. Drives `pages/<id>.md` override files + mock prioritization in `prototype/`.

## Conventions

- **ID**: kebab-case route fragment matching `pages/<id>.md` and prototype `data-screen` attribute.
- **US**: source user story (US1, US1a, US2, US3, US4, US5, US6).
- **Mock prio**: P0 = hero, must be in initial prototype; P1 = secondary; P2 = polish, defer to second pass.
- **Variants**: combinations to mock = locales × themes × states. Multiplier in last column.

## 24 P001 Screens

| ID | Screen | US | FR | SC | Mock prio | RTL notes | A11y critical | Variants |
|---|---|---|---|---|---|---|---|---|
| `auth-country` | Country picker (signup) | US1 | FR-201, FR-218, FR-300 | SC-001a | **P0** | List in RTL, search bar in RTL, flag stays LTR | Search announced; country selected announced | 4 |
| `auth-email` | Email signup | US1 | FR-001 (no phone OTP), FR-300 | SC-001a | **P0** | Email field forced LTR (latin email always); label RTL | Email keyboard type; autocomplete `email` | 4 |
| `auth-otp` | OTP verification | US1 | FR-001, FR-045 | SC-001a | **P0** | OTP boxes LTR (digits enter L→R); label RTL | iOS one-time-code keyboard; per-digit aria-label | 8 (incl. error + locked variants) |
| `auth-social` | Google/Apple sign-in | US1 | FR-001 | SC-001a | **P1** | Apple/Google buttons inherit Latin lockup; label RTL | Native sign-in widgets retain a11y | 4 |
| `auth-lockout` | Locked-out screen | US5 | FR-045, FR-046 | SC-005, SC-011 | **P1** | Countdown timer LTR mono; label RTL | aria-live polite, announce minute-by-minute not second | 4 |
| `auth-blocked` | Geofence denied | US1 | FR-218 | SC-201 | **P1** | Country name in user locale; flag LTR | Clear cause + alternative (web link to denial reason) | 4 |
| `disclosure` | Consolidated disclosure | US1 | FR-040, FR-041, FR-219 | SC-001a, SC-205 | **P0** | RTL reading flow, scroll bottom unlocks CTA | Long-form text aria-readable; "Accept" announces consent | 4 (× 3 supervisory authorities = 12 variants) |
| `home` | Home (filled w/ nudges) | US1 | FR-006 | SC-001a | **P0** | Bottom nav order RTL-aware (Q1 in MASTER); nudge cards mirror | Greeting includes user's name; nudges have aria-described-by | 4 |
| `home-empty` | Home (post-signup empty) | US1 | FR-006 | SC-001a | **P1** | Same as home | Empty state announces "Welcome, complete your profile" | 4 |
| `account-handle` | Handle claim | US1a | FR-007, FR-008 | SC-002 | **P0** | Handle field LTR (latin-only handles); label RTL; suggestions chip list mirrors | Live validation announced on blur; conflict states clear | 4 (+ conflict, success states) |
| `profile-editor` | Health profile editor | US1a | FR-009, FR-010, FR-211, FR-213 | SC-002 | **P0** | RTL section layout; blood type chips wrap; allergies/conditions list mirrors | Lock icon next to each PHI section announces "On-device only"; required fields announce | 4 |
| `profile-emergency-contacts` | Emergency contacts list | US1a | FR-010 | SC-002 | **P1** | Phone numbers mono LTR even in RTL layout; name LTR/RTL by content | Tap-to-call has confirm dialog | 4 |
| `emergency-card` | Emergency card view | US2 | FR-011, FR-013, FR-014 | SC-003 | **P0** | RTL info-block layout; blood type emphasis | Card content aria-labelled; QR has long-press hint | 4 |
| `emergency-qr` | QR display (TTL picker) | US2 | FR-013, FR-014 | SC-003, SC-014 | **P0** | TTL chips mirror; QR canvas LTR (modules are direction-neutral) | Countdown announces remaining time; revoke confirmable | 4 |
| `emergency-public` | Public emergency resolve (Flutter Web) | US2 | FR-014, FR-216 | SC-003, SC-014, SC-202 | **P0** | RTL labels in user's preferred_language; tap-to-call LTR phone | Print-friendly; screen-reader-friendly card; offline graceful | 4 |
| `meds-list` | Medication list | US3 | FR-016, FR-017 | SC-004 | **P0** | List mirrors; dose status badges mirror; FAB on trailing edge in RTL | Each med announces name + next dose time; controlled flag announced | 4 (filled + empty) |
| `meds-add` | Add medication | US3 | FR-016 | SC-004 | **P0** | Schedule picker (daily/weekly/custom) chips wrap; time picker uses system | Form labels visible; validation inline; helper text persistent | 4 |
| `meds-today` | Today screen (upcoming + missed) | US3 | FR-018, FR-019 | SC-004 | **P0** | Time pills LTR mono; med rows RTL layout | Missed-dose banner aria-live polite; "Mark taken" announces success | 4 |
| `meds-dose-history` | Dose history | US3 | FR-018, FR-019 | SC-004 | **P1** | Timeline mirrors; outcomes badges (taken/skipped/missed) mirror | Append-only invariant communicated via "Correction" affordance, never delete | 4 |
| `meds-tz-shift` | Timezone shift confirm modal | US3 | FR-023 | SC-004 | **P2** | Side-by-side comparison RTL-aware | Modal escape (cancel keeps old TZ) | 4 |
| `deletion-preconfirm` | Delete account (pre-confirm) | US4 | FR-031, FR-032 | SC-012 | **P0** | Retained/Deleted/Wiped lists mirror; danger CTA bottom; spatially separate from "Cancel" | Destructive emphasis (red) + icon + label; aria-describes consequences | 4 |
| `deletion-confirm` | Delete account (final confirm) | US4 | FR-031 | SC-012 | **P0** | Re-auth same as auth-email (component reuse); typed-confirmation field LTR | Typed-confirm visible label; "DELETE" must be exact | 4 |
| `deletion-cancelled` | Deletion cancelled / grace | US4 | FR-032 | SC-012 | **P1** | Grace countdown mono LTR; layout RTL | aria-live announces grace ends in N days | 4 |
| `deletion-public` | Public deletion (Flutter Web) | US4 | FR-031 | SC-012 | **P1** | Similar to in-app preconfirm; web-only chrome (header w/ logo) | Same as in-app; print-friendly | 4 |
| `post-deletion-login` | Sign-in during grace | US4 | FR-032 | SC-012 | **P1** | Two-button choice: Cancel deletion / Proceed | First button focused on mount | 4 |
| `sessions-list` | Active sessions | US4, US5 | FR-035, FR-036 | SC-013 | **P0** | Device rows mirror; revoke button trailing in RTL | Each device announced; "Sign out everywhere" has confirm | 4 |
| `account-country` | Change country | US6 | FR-201, FR-300, FR-302 | SC-302 | **P1** | Same as auth-country; re-auth flow notice | Notice announced before triggering re-auth | 4 |
| `account-language` | Change language | US6 | FR-216, FR-301 | SC-301 | **P1** | Language picker (en, ar-EG, ar-SA, ar-AE); preview RTL toggle live | Selection triggers live preview; restart hint | 4 |
| `not-found` | NotFound (404) | — | (system) | SC-404 | **P2** | Localized; back-to-home CTA | Heading announces "Page not found" | 4 |

**Total mockable**: 24 screens × 4 base variants (LTR-en, RTL-ar-EG, LTR-en-dark, RTL-ar-EG-dark) = **96 base mocks**, plus state variants (error / success / loading / empty) bump to ≈140 total per D004-D014.

## Mock Prioritization for First Review

**P0 (16 screens)** — must be in initial prototype for D022 review:
auth-country, auth-email, auth-otp, disclosure, home, account-handle, profile-editor, emergency-card, emergency-qr, emergency-public, meds-list, meds-add, meds-today, deletion-preconfirm, deletion-confirm, sessions-list.

**P1 (9 screens)** — second pass after first review:
auth-social, auth-lockout, auth-blocked, home-empty, profile-emergency-contacts, meds-dose-history, deletion-cancelled, deletion-public, post-deletion-login, account-country, account-language.

**P2 (2 screens)** — polish before sign-off:
meds-tz-shift, not-found.

## Per-Screen Override Files (`pages/`)

Skeleton files created for each P0 screen. Each override may override:
- Color tokens (e.g. emergency uses warmer danger-bg)
- Spacing rhythm (e.g. profile-editor uses tighter 12px sections)
- Component variants (e.g. emergency uses `BalsmCard.elevated`)
- Specific motion (e.g. OTP shake on error)
- Per-screen copy (en + ar variants)

If a `pages/<id>.md` file is empty/absent, MASTER.md rules apply.
