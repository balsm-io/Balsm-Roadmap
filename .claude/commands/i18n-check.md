# Internationalization Check

Scan changed files for internationalization (i18n) and localization issues in the Balsm platform.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file and analyze for the following:

### Hardcoded Strings
- User-facing text not wrapped in localization functions (e.g., `tr()`, `AppLocalizations`, `l10n`)
- Hardcoded strings in widget code that should be localized
- Error messages, labels, placeholders, tooltips, and button text not using i18n
- Hardcoded strings in API error responses that are displayed to users
- Toast/snackbar messages with hardcoded text

### RTL Support
- `left`/`right` used instead of logical properties (`start`/`end`, `inline-start`/`inline-end`)
- `TextDirection` not respected in layout calculations
- Icons or directional indicators not mirrored for RTL
- `EdgeInsets.only(left:)` instead of `EdgeInsetsDirectional.only(start:)`
- `Alignment.centerLeft` instead of `AlignmentDirectional.centerStart`
- Hardcoded `TextAlign.left` instead of `TextAlign.start`
- Row children order not adaptable for RTL

### Number, Date & Currency Formatting
- Hardcoded date formats (e.g., `MM/dd/yyyy`) instead of locale-aware formatting
- Hardcoded number formatting (decimal separators, thousands separators)
- Hardcoded currency symbols or formatting
- Phone number formats not supporting international patterns
- Hardcoded time formats (12h/24h) instead of locale-based

### Medical Content
- Medical terminology hardcoded in one language
- Drug names and clinical terms not supporting multilingual display
- ICD-10 / CPT code descriptions hardcoded in English

### Design System
- Inline color literals (`Color(0xFF...)`) instead of theme constants
- Inline spacing (`EdgeInsets.all(16)`) instead of spacing constants from `lib/core/theme/`
- Hardcoded font sizes instead of text style tokens

3. For each issue found, report:
   - File path and line number
   - Category: HARDCODED_STRING / RTL / FORMAT / MEDICAL / DESIGN_SYSTEM
   - The offending code
   - Suggested fix

4. If no issues are found, confirm the code passes i18n review.
