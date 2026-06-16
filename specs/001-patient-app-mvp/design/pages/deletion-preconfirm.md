# Page Override: `deletion-preconfirm`

> Per-screen deviations from `../MASTER.md`. FR-031 (retained/deleted/wiped breakdown). SC-012 (≤2 taps from settings root).

## Layout

- Title: "Before you go — here's exactly what happens"
- 3 categorized cards in this order:
  1. **Deleted now** (danger-bg, trash icon, red text)
  2. **Wiped from this phone** (neutral card, lock icon)
  3. **Retained for 2 years** (info banner background, clock icon)
- Grace-period banner below cards
- Pinned CTA pair: Cancel (ghost) + Delete account (danger)

## Color usage

- "Deleted now" card uses `--balsm-danger-bg` background + `--balsm-danger` border 1.5px — visually serious without being alarming
- "Wiped" card uses neutral `--balsm-surface` — these are *yours* being deleted, not Balsm's
- "Retained" card uses `--balsm-info-bg` — required-by-regulator context

## Copy

- Avoid coercive language ("Are you SURE?", "You'll lose...")
- Honest matter-of-fact list — not retention dark patterns
- Cite retention reason: "required by regulators" so user knows it's not Balsm's choice

## CTA pair

- Equal-width buttons in a row — both are legitimate choices
- Cancel: ghost button, left/leading (RTL flips correctly)
- Delete: danger button, right/trailing — but spatially separated by `--space-3` gap minimum
- Per MASTER §4 `destructive-emphasis`: red bg + icon + label, never red text alone

## Routing

- Reached from Settings → Account → Delete account
- Counts as 2 taps from settings root (SC-012)
- "Cancel" returns to Settings → Account
- "Delete account" routes to `deletion-confirm` (re-auth + OTP + typed-confirm gate)

## Telemetry

- Page view event: `deletion_preconfirm_viewed` with `country_code` only (no user_id, no PII)
- Cancel tap: `deletion_cancelled_at_preconfirm`
- Continue tap: `deletion_proceeded_to_confirm`

## A11y

- Each card has `role="region"` + `aria-labelledby` pointing to its title
- Lists use semantic `<ul>`/`<li>`
- "Delete account" CTA has `aria-describedby` pointing to the grace banner so screen reader announces "7 days to change your mind" before the action
