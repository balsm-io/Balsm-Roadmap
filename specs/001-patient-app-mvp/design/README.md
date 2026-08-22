# P001 Design Folder

Generated 2026-06-16 by `/ui-ux-pro-max` skill, anchored on `Balsm-Core/brand/design-system/` (then mirrored in the `balsm-design` plugin skill; the skill is now a pointer).

## Folder map

```
design/
  MASTER.md              # Design contract (single source of truth)
  SCREEN-INVENTORY.md    # 24 screens × US × FR × SC × variant matrix
  REVIEW-CHECKLIST.md    # 6-pillar review rubric
  REVIEW-SIGNOFF.md      # Stakeholder approval doc — gate to Phase 3+
  tokens.css             # Snapshot of brand tokens (for prototype only)

  pages/                 # Per-screen overrides (override MASTER when present)
    disclosure.md
    emergency-qr.md
    profile-editor.md
    deletion-preconfirm.md

  prototype/             # Interactive HTML prototype
    index.html           # Open in browser to review
    styles/prototype.css
    scripts/prototype.js
    flows.json
    assets/data.json     # Translations (en + ar-EG) + screen metadata

  findings/              # Review-session output
    _template.md
```

## How to view the prototype

The prototype is a single HTML page. Open it in any modern browser:

```bash
# Option A: open directly (file:// — works, but localStorage scoped to file://)
open prototype/index.html

# Option B: serve locally (recommended — clean localStorage namespace)
cd prototype && python3 -m http.server 8765
# then visit http://localhost:8765
```

### Controls

- **Left rail**: click any screen to load it. Use ↑/↓ arrow keys to step through.
- **Top toolbar**:
  - **Locale**: switch between `en`, `ar-EG`, `ar-SA`, `ar-AE` (RTL auto-applied for `ar-*`)
  - **Theme**: Light / Dark — verify contrast in both
  - **Frame**: iOS (default) / Web (forces Flutter Web frame, auto-selected for public routes)
- **Right notes panel**: shows current screen's US / FR / SC / layout / a11y / RTL notes from `assets/data.json` `meta`

### Verifying a flow

Use the `flows.json` map mentally — e.g. for **US1 signup → home**:
`auth-country → auth-email → auth-otp → disclosure → home`. Click through each and check transitions.

For **US2 emergency QR roundtrip**:
`home → emergency-card → emergency-qr → emergency-public` (last forces Web frame).

For **US4 deletion (web path)**:
`deletion-public → deletion-confirm`.

## Review workflow (D020-D023 in `../tasks.md`)

1. **D020/D021** — already produced: `REVIEW-CHECKLIST.md`, `REVIEW-SIGNOFF.md`.
2. **D022 — Schedule a session**:
   - Open prototype with all 4 stakeholder reviewers (PM, Design lead, Eng lead, Compliance lead).
   - Walk through every P0 screen × LTR-en-light + RTL-ar-EG-light + LTR-en-dark.
   - Score against `REVIEW-CHECKLIST.md` 6 pillars.
   - Log findings to `findings/YYYY-MM-DD.md` (use `_template.md`).
3. **D023 — Resolve blockers**:
   - Update mocks or override files (`pages/`).
   - Update `MASTER.md` if the rule itself changed.
   - Re-run review on changed screens only.
   - Once no blockers remain, fill `REVIEW-SIGNOFF.md` with 4 stakeholder signatures.
   - Commit titled `[Design] sign-off complete YYYY-MM-DD`.
   - **This commit unlocks Phase 3+ implementation tasks (T071+) in `../tasks.md`.**

## What's NOT in this prototype yet

- **P1 screens** (auth-blocked done; auth-lockout done; rest pending): home-empty, profile-emergency-contacts, meds-dose-history, deletion-cancelled, post-deletion-login, account-country, deletion-confirmed-success, app boot/splash
- **P2 screens**: meds-tz-shift modal (icon-only hint shown today)
- **Dark mode parity verification** — paint exists but contrast checks deferred to review session
- **Real i18n bundles** for `ar-SA` / `ar-AE` (only `en` + `ar-EG` carried fully; ar-SA/ar-AE fall back to en in prototype — the live Flutter app gets full bundles from `core/assets/i18n/`)
- **Live RTL number normalization** — prototype shows static values; live app gets the Arabic-Indic → Western conversion at input time (FR-213)
- **Real QR encoding** — prototype uses a stylized SVG pattern (not a scannable code, by design — no real PHI in prototype)

These gaps are documented and will be filled in the second-pass review.

## Authority of files

When in doubt:
1. `Balsm-Core/brand/design-system/colors_and_type.css` wins over `tokens.css` (snapshot can drift; the design system is canonical)
2. `pages/<id>.md` wins over `MASTER.md` for the specified screen
3. `MASTER.md` wins over `SCREEN-INVENTORY.md` notes
4. Findings (resolved) win over earlier prototype state — update both prototype + override doc when fixing

## Updating tokens snapshot

After any brand token change in `Balsm-Core/brand/design-system/colors_and_type.css`:
```bash
cp ../../brand/design-system/colors_and_type.css tokens.css
# then re-open prototype/index.html to verify
```

A CI job checks `tokens.css` matches the brand source on every PR touching `design/`.
