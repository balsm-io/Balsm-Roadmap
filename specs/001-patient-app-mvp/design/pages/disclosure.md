# Page Override: `disclosure`

> Per-screen deviations from `../MASTER.md`. Consolidated onboarding disclosure (FR-040, FR-041, FR-219).

## Layout

- Authority chip pinned at top of scrollable content (not in app bar — better RTL flow)
- 4 sections (PHI on-device · Cloud · Emergency · Deletion) with `h3` headings, separated by `--space-6`
- Privacy/Terms inline links at bottom of last section, not pinned footer

## Components

- `disclosure__authority` uses `--balsm-info-bg` background, shield icon `--balsm-primary`
- Headings: `--font-display` 18px 600 weight
- Body: `--fs-md` `--lh-relaxed` `--fg2` (more readable than `--fg1` for long-form)

## Interaction

- **Scroll-to-bottom gate**: CTA stays disabled until scroll position reaches 95% — confirms user saw the content
- Disabled state: 0.5 opacity + cursor not-allowed
- When enabled: scale 0.95 → 1 over 300ms `--ease-out` + bg color tween
- Tap CTA records: `disclosureId`, `version`, `country_code_at_accept`, `supervisory_authority_name_at_accept`, `preferred_language_at_accept`, `accepted_at` (per data-model.md §1.5)

## Copy (per country)

| Country | Authority (en) | Authority (ar) |
|---|---|---|
| EG | Egypt PDPC | هيئة حماية البيانات الشخصية |
| SA | KSA SDAIA | الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) |
| AE | UAE Data Office | مكتب البيانات بدولة الإمارات |

The authority name is recorded verbatim into `disclosure_acceptance.supervisory_authority_name_at_accept` — never translated server-side, never reformatted. Source of truth = `core/localization/country_registry.dart`.

## A11y

- `<main>` wraps the scrollable content
- Heading hierarchy: page title `h1` (in app bar), section headings `h2`
- "Accept and continue" button has `aria-describedby` pointing to disabled-reason when locked
- After tap, focus moves to next screen (post-disclosure home/profile)

## Re-disclosure flow

- Triggered by country change (US6, FR-302)
- Banner above title: "Switching to {newCountry} requires accepting their privacy notice. {authority} applies."
- All 4 sections re-rendered; user must scroll + accept again
- Previous acceptance preserved in audit, new acceptance appended (not replaced)
