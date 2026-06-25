---
description: "P001 tasks — UI/UX Design & Prototype Review (Phase 2.5)"
---

# P001 Tasks — Design Track

Phase 2.5 only. Blocking gate before Phase 3+ Flutter implementation. Anchored on:

- `Balsm-Core/brand/colors_and_type.css` — token source of truth
- `Balsm-Core/brand/baslm-brand-canvas.md` — voice + tone
- `Balsm-AI/plugin/skills/balsm-design/patient_app/` — prototype skeleton
- `Balsm-AI/plugin/skills/balsm-design/preview/` — preview cards reference
- `Balsm-Core/design.md` — design contract index

Outputs land under `specs/001-patient-app-mvp/design/`.

Format: `[ID] [P?] [Flutter] Description with file path`

## Phase 2.5: UI/UX Design & Prototype Review (Blocking Gate)

**Purpose**: Produce reviewable UI/UX design spec + interactive prototype for every P001 screen BEFORE Flutter implementation starts. Anchored on existing `balsm-design` skill (brand tokens in `Balsm-Core/brand/colors_and_type.css`, patient-app skeleton in `Balsm-AI/plugin/skills/balsm-design/patient_app/`, preview cards in `.../preview/`). RTL + LTR variants for all screens. PHI-safe placeholder data only.

**Goal**: Stakeholder sign-off on visual design + interaction flow per user story. No Flutter code may start until sign-off recorded.

**Independent test**: Open `design/prototype/index.html` in browser → click through all 6 user-story flows (auth, profile, emergency, medications, deletion, country-change) → switch RTL ↔ LTR toggle → switch theme (light/dark) → review report exported.

### 2.5.1 Design spec + screen inventory

- [X] D001 [Flutter] Create `design/UI-SPEC.md` — design contract for P001: imports `Balsm-Core/brand/colors_and_type.css` as token source, lists every screen mapped to FRs + SCs, locks typography scale (Display / Body / Caption), spacing scale (4/8/12/16/24/32), radii (sm/md/lg/full), motion (durations + curves), elevation, RTL mirroring rules, dark-mode contrast targets WCAG AA, focus-ring spec
- [X] D002 [Flutter] Create `design/SCREEN-INVENTORY.md` — table mapping every screen (CountryPicker, EmailSignUp, OtpVerification, SocialSignIn, ConsolidatedDisclosure, Home, HandleClaim, HealthProfileEditor, EmergencyCard, QrCodeDisplay, PublicEmergencyResolve, MedicationList, AddMedication, TodayScreen, DoseHistory, DeleteAccount, DeletionConfirm, DeletionCancelled, PublicDelete, Sessions, CountrySettings, LanguageSettings, Lockout, NotFound) to: user story, FR, SC, RTL-mirror notes, accessibility notes
- [X] D003 [Flutter] Create `design/COMPONENT-CONTRACT.md` — for every shared widget from `core/kit/shared_widgets.dart` (BalsmButton, BalsmTextField, BalsmCountryPicker, BalsmLoadingIndicator, BalsmErrorBanner, BalsmCard, BalsmListItem, BalsmDialog, BalsmBottomSheet, BalsmAppBar, BalsmBottomNav, BalsmFab) — states (default/hover/focus/active/disabled/loading/error), token bindings, RTL behavior, a11y label requirements

### 2.5.2 High-fidelity mock generation

- [X] D004 [P] [Flutter] Create `design/mocks/auth/` HTML mocks for US1 — 4 screens (country picker, email signup, OTP verification, social sign-in) × 2 dirs (LTR-en, RTL-ar) × 2 themes (light, dark) = 16 HTML files using `brand/colors_and_type.css` tokens, no JS frameworks
- [X] D005 [P] [Flutter] Create `design/mocks/disclosure/` — consolidated disclosure screen (long-scroll) × LTR/RTL × light/dark = 4 files; per-country supervisory authority strings (Egypt PDPC, KSA SDAIA, UAE Data Office) per FR-219
- [X] D006 [P] [Flutter] Create `design/mocks/home/` — Home empty state, Home with nudges (handle, emergency card, meds), Home filled = 3 screens × LTR/RTL × light/dark = 12 files
- [X] D007 [P] [Flutter] Create `design/mocks/profile/` — HealthProfileEditor sections (blood type, allergies list, allergy add modal, conditions, emergency contacts), HandleClaim with live validation states = 6 screens × LTR/RTL × light/dark = 24 files; Arabic numeral normalization preview per FR-213
- [X] D008 [P] [Flutter] Create `design/mocks/emergency_card/` — EmergencyCard view, TTL picker, QrCodeDisplay, PublicEmergencyResolve (browser variant), revoked-token state, lock-screen widget previews (iOS WidgetKit + Android tile) = 7 screens × LTR/RTL × light/dark = 28 files
- [X] D009 [P] [Flutter] Create `design/mocks/medications/` — MedicationList empty + filled, AddMedication (schedule shape picker: daily/weekly/custom), DoseHistory, TodayScreen with missed-dose banner, timezone-shift modal per FR-023, notification preview = 7 screens × LTR/RTL × light/dark = 28 files
- [X] D010 [P] [Flutter] Create `design/mocks/deletion/` — DeleteAccount pre-confirmation (FR-031 retained/deleted/wiped data list), DeletionConfirm, DeletionCancelled, PublicDelete (browser variant), PublicDeleteCancelled, PostDeletionLogin = 6 screens × LTR/RTL × light/dark = 24 files
- [X] D011 [P] [Flutter] Create `design/mocks/sessions/` — Sessions list (multiple devices), per-device detail, "Sign out everywhere" confirm = 3 screens × LTR/RTL × light/dark = 12 files
- [X] D012 [P] [Flutter] Create `design/mocks/country_lang/` — CountrySettings, LanguageSettings, country-change re-auth, re-disclosure with new authority = 4 screens × LTR/RTL × light/dark = 16 files
- [X] D013 [P] [Flutter] Create `design/mocks/auth_states/` — Lockout countdown screen, geofence-blocked screen, network-error, OTP-expired = 4 screens × LTR/RTL × light/dark = 16 files
- [X] D014 [P] [Flutter] Create `design/mocks/system/` — NotFound (FR-404), error-boundary, splash, onboarding loading = 4 screens × LTR/RTL × light/dark = 16 files

### 2.5.3 Interactive prototype

- [X] D015 [Flutter] Create `design/prototype/index.html` — interactive shell wrapping all mocks: left nav (US flows), iOS device frame (reuse `Balsm-AI/plugin/skills/balsm-design/patient_app/ios-frame.jsx` skeleton), RTL/LTR toggle, theme toggle, locale dropdown (`en`, `ar-EG`, `ar-SA`, `ar-AE`), country dropdown for re-disclosure variants
- [X] D016 [Flutter] Create `design/prototype/flows.json` — declarative flow graph: each US flow as ordered list of screen IDs + edge labels (tap targets), driving the prototype's "Next/Back" controls
- [X] D017 [Flutter] Create `design/prototype/assets/data.json` — synthetic non-PHI placeholder data (fictional names, no real numbers; matches `phi_leak_fuzz_test/corpus.dart` shape so designers and devs share fixtures)
- [X] D018 [P] [Flutter] Create `design/prototype/styles/prototype.css` — prototype chrome (nav, toolbar, frame) using same `brand/colors_and_type.css` tokens; does NOT override component styles
- [X] D019 [P] [Flutter] Create `design/prototype/scripts/prototype.js` — minimal vanilla JS: route to mock via hash, toggle dir/theme/locale via `<html dir>` + `data-theme` + `lang` attributes (no frameworks)

### 2.5.4 Review gate + sign-off

- [X] D020 [Flutter] Create `design/REVIEW-CHECKLIST.md` — 6-pillar checklist (visual hierarchy, motion + interaction, accessibility WCAG AA, RTL + locale, brand fidelity, edge states + errors) per screen, used by reviewers; reuse `gsd-ui-auditor` rubric shape
- [X] D021 [Flutter] Create `design/REVIEW-SIGNOFF.md` — empty signoff doc with stakeholder rows (PM, design lead, eng lead, compliance lead), per-flow approval columns, comments column, date column
- [X] D022 [Flutter] Run `design/prototype/index.html` review session — collect comments, file findings under `design/findings/<date>.md`, resolve or defer; second-pass mocks updated in place
- [X] D023 [Flutter] Update `design/REVIEW-SIGNOFF.md` with signatures + date — **gate unlocks Phase 3+ implementation**. Tasks T071+ may NOT start until this file shows all stakeholders signed
- [X] D024 [P] [Flutter] Export design tokens snapshot at `design/tokens-snapshot.json` — JSON dump of every token used (locked at sign-off time) so Flutter implementation can compare against expected values in a CI check

### 2.5.5 Optional design enhancements

- [X] D025 [P] [Flutter] Create `design/MOTION-SPEC.md` — per-screen motion specs (page transitions, modal enter/exit, list-item stagger, QR reveal, OTP shake on error) with durations + curves anchored to `brand/colors_and_type.css` motion tokens
- [X] D026 [P] [Flutter] Create `design/A11Y-SPEC.md` — VoiceOver / TalkBack labels per screen, focus order, touch target ≥44pt, contrast pairs verified, reduced-motion alternates, font scaling up to 200%
- [X] D027 [P] [Flutter] Create `design/COPY-SPEC.md` — UX writing per screen anchored on `brand/baslm-brand-canvas.md` voice + tone; localizations for `en`, `ar-EG`, `ar-SA`, `ar-AE`; feeds the i18n bundle creation at T100

**Checkpoint**: design spec + prototype reviewed + signed off by all stakeholders. `tokens-snapshot.json` locked. Implementation phases 3-9 may proceed referencing finalized mocks + spec.

---

