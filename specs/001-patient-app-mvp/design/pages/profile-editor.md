# Page Override: `profile-editor`

> Per-screen deviations from `../MASTER.md`. All PHI on-device (FR-009).

## Privacy

- `privacy-marker` at top: lock icon + "On-device only · never sent to Balsm servers"
- Color: `--fg3` for the marker text — informational, not alarming
- The marker persists across all profile sub-screens (Add allergy, Add condition, etc.)

## Sections (in order)

1. **Blood type** — chip selector (8 types + "Unknown")
2. **Allergies** — list of `Allergy` aggregates with severity badge (severe red, moderate amber, mild neutral)
3. **Chronic conditions** — list of `ChronicCondition` with ICD-10 code + onset year
4. **Emergency contacts** — list of `EmergencyContact` with name + relationship + phone (mono LTR)

## Components

- Each section is a `BalsmCard` with `card__title` + "Add" ghost button on the trailing edge
- Add-button opens a `BalsmBottomSheet` (not full screen) for quick entry
- Each list item: 40pt icon + name + meta + chevron (drill into edit)
- Max 50 allergies enforced — when at limit, "Add" becomes disabled with tooltip

## Form patterns

- Phone fields use `BalsmTextField` with country-aware E.164 validator from `core/localization/country_registry.dart`
- National-ID field (FR-211) deferred to P002 per Q3 resolution — DO NOT render in MVP
- Arabic numeral input auto-normalizes to Western on blur (FR-213) but displays in user's preferred numeral form

## Save behavior

- "Save" in app bar trailing action — disabled until any field changes
- On save: persist to drift `health_profile` aggregate, emit `HealthProfileUpdated` event
- Toast: "Saved on this device" (success-bg, 3s)
- Never show "Saved to cloud" — would be a lie

## A11y

- Privacy marker: `aria-label="Privacy notice: data stored on this device only"`
- Each PHI section has section landmark with `aria-labelledby` pointing to section heading
- Severity chips have `aria-label` describing severity (not just color)
- Lock icon has `accessibilityRole="image"` with descriptive label

## Empty states

- Allergies = 0 → "No known allergies — that's fine. Add any if they come up."
- Conditions = 0 → "No chronic conditions on file."
- Contacts = 0 → "Add at least one emergency contact." (encouraged but not blocking)
