---
name: balsm-design
description: Use this skill to generate well-branded interfaces and assets for Balsm.health (بَلسَم), an open-source healthcare platform for Egypt and the Arabic-speaking world. Includes the official five-petal flower mark, the five-color petal palette, warm olive-gray neutrals, type system (Montserrat / IBM Plex Sans / IBM Plex Sans Arabic / Cairo), Lucide iconography, and a Pharmacy POS UI kit. Use for production work or for throwaway prototypes, mockups, decks, and marketing surfaces.
user-invocable: true
---

## How to use this skill

Read the README.md file in this skill — it is the canonical map of the design system and explains content fundamentals, voice, the five-petal color philosophy, type, spacing, iconography, and the UI kit.

When creating visual artifacts (slides, mockups, throwaway prototypes, screenshots), **copy the relevant assets out** and write static HTML files for the user to view. The minimum starter for any new artifact is:

```html
<link rel="stylesheet" href="path/to/colors_and_type.css">
<link rel="icon" type="image/svg+xml" href="path/to/brand/logo-vertical.svg">
```

When working on production code, copy `colors_and_type.css` into the codebase and read the token list there — the file is the single source of truth for color, type, spacing, radius, shadow, and motion tokens.

## Key files in this skill

- `README.md` — the design system manual. Read first.
- `colors_and_type.css` — every CSS token (petals, neutrals, type, spacing, radii, shadows, motion). Import this from any artifact.
- `brand/logo-vertical.svg` — official five-petal flower + bilingual wordmark. Use as-is; do not redraw.
- `brand/logo-vertical-white.png` — reverse lockup for dark surfaces.
- `brand/balsm-background.png` — the signature watercolor petal pattern (hero backdrops only).
- `preview/` — design-system reference cards for every token group.
- `ui_kits/balsm_pharmacy/` — high-fidelity Pharmacy POS recreation. Components are factored as small JSX files (`atoms.jsx`, `shell.jsx`, `pos.jsx`, `inventory.jsx`, `customers.jsx`) — lift them as needed.

## Non-negotiables

1. **Brand name** is always `Balsm.health` (with `.health` one weight lighter) in product surfaces. Arabic is `بَلسَم` **with diacritics** (fatha on ب and on س). Without diacritics is incorrect.
2. **The flower mark has FIVE colors** — aqua, emerald, blue, mint, violet. Never recolor it to a single hue.
3. **No medical-cliché iconography** for brand symbols (no cross, syringe, heart). Lucide `pill` / `stethoscope` / `syringe` are fine inside the product, never as a logo replacement.
4. **No emoji in product UI.** The flower is our emoji. Marketing decks may use a single 🌿 sparingly; everything else is iconography.
5. **Arabic is first-class.** Every new surface must work with `dir="rtl"` and the `--font-arabic` family. The `[dir="rtl"]` selectors in `colors_and_type.css` swap fonts automatically.
6. **Voice is calm, second-person, sentence case.** "Saved locally. Will sync when you reconnect." — not "Oops! Saved! ✨".
7. **Egyptian formatting:** dates `DD/MM/YYYY`, currency `LE 245.00`, phones `+20 1X XXXX XXXX`, national ID 14-digit grouped.

## When the user invokes this skill with no other guidance

Ask what they want to build. Some good clarifying questions:

- Which Balsm surface — Pharmacy POS / Inventory / Admin (Slice 1, already kitted), or net-new Patient app / Doctor encounter (Slice 2, not kitted)?
- Is this a deck, a clickable prototype, a marketing landing page, a single screen mock, or production code?
- English, Arabic, or bilingual?
- Do you have content (real medication list, customer records, copy), or should we use the placeholder data from `ui_kits/balsm_pharmacy/`?

Then act as an expert designer who outputs HTML artifacts (or production code if requested). Pull tokens from `colors_and_type.css`, components from the UI kit, and the flower mark from `brand/`. Stay calm in tone, generous in spacing, and warm in surface treatment.
