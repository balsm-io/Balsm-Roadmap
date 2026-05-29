# Balsm Design System

> **Balsm.health · بَلسَم** — open-source healthcare for Egypt and the Arabic-speaking world. Five petals · five colors · one promise: healing, locally.

This folder is a working design system for **Balsm.health**. It contains the official brand foundations (logo, color, type), low-level visual tokens, and high-fidelity recreations of the product surfaces so that designers and design agents can produce on-brand work in minutes.

---

## What is Balsm?

Balsm is an **offline-first, locally-hosted healthcare platform** targeting clinics, pharmacies, labs, and patients — starting in Egypt. It is sold as a one-click local install (Windows / macOS / Linux) and ships from a single binary; the cloud / "Balsm Network" tier is the paid monetization layer.

The product is shipped in three slices:

1. **Slice 1 — Pharmacy Standalone.** Local server, POS, inventory, customer profiles, paper-prescription attachments. Standalone-sellable.
2. **Slice 2 — Full Care Loop.** Patient app, doctor profiles, appointments, encounters, full digital prescriptions (with QR) that link back to Slice-1 pharmacy POS.
3. **Slice 3 — Balsm Network.** Paid cloud tier — online booking, cross-entity sharing, centralized patient identity.

Differentiators vs. global competitors (OpenEMR, OpenMRS, AppFlowy-style productivity tooling, ClickUp-style ops dashboards, CARE / ohc.network):

- **Arabic-first / full RTL** — not bolted on, designed for it. The wordmark is bilingual: `بَلسَم` above `Balsm.health`.
- **Offline-default.** A dropped clinic Wi-Fi cannot stop a sale or a consult.
- **Egypt-localized.** EGP, national-ID parsing, Law 182/1960 controlled-substance schedules, 14% VAT, 27 governorates, DD/MM/YYYY.
- **Calm clinical aesthetic** — five-petal flower mark in five distinct hues; no medical-cliché iconography (no crosses, syringes, hearts) for the brand symbol itself.

### Source materials this system was built from

| Source | Why it's here | Link |
|---|---|---|
| `balsm-io/assets/brand/` | **Official brand pack** — final logo (vertical, color + white-on-ink + PNG), watercolor background pattern. This is the source of truth for color, mark, and wordmark. | https://github.com/balsm-io/assets |
| `balsm-io/Balsm-Draft` | Product roadmap, market research, business features, design-review notes, controlled-substance + RTL requirements, brand prompt history. | https://github.com/balsm-io/Balsm-Draft |
| `AppFlowy-IO/AppFlowy` | Open-source local-first productivity reference — informs the offline-sync + workspace patterns. | https://github.com/AppFlowy-IO/AppFlowy |
| ClickUp | Reference for ops-dashboard density, sidebars, and module switchers. | https://clickup.com |
| OHC Care Core | Reference for clinical-data model and open-source healthcare patterns. | https://ohc.network/product/care-core |

> **For deeper work:** open these repos directly. The Balsm-Draft repo in particular has 60k+ words of market research and a 300k-word business-feature spec that did not need to be inlined here but will be invaluable for net-new flows.

---

## Index of this design system

| File / folder | What it is |
|---|---|
| `README.md` | This document — start here. |
| `SKILL.md` | Agent-Skill manifest. Read this if you're an LLM about to design with Balsm. |
| `colors_and_type.css` | All color, type, spacing, radius, shadow, and motion tokens as CSS variables. Import this from any new artifact. |
| `brand/` | **Official brand pack** — `logo-vertical.svg`, `logo-vertical.png`, `logo-vertical-white.png` (reverse), `balsm-background.png` (watercolor pattern). |
| `preview/` | Design-system cards (typography, colors, spacing, components, brand) that populate the Design System tab. |
| `ui_kits/balsm_pharmacy/` | Pharmacy POS + admin UI kit — modular JSX components + a working interactive index.html. |

---

## Content fundamentals

**Voice:** calm, professional, human, second-person. Balsm is the patient's quiet ally; the pharmacist's reliable counter; the doctor's tidy notebook. Never salesy, never clinical-cold.

**Pronoun & address:** "you" in English. In Arabic, address users with **أنت** for direct UI affordances (`سجّل الدخول`) and use **نحن / "we"** sparingly when Balsm itself is speaking (`نحن نحفظ بياناتك محلياً`). Avoid corporate `the system` / `النظام`.

**Casing:**
- **Sentence case** for everything UI: buttons, menu items, headings, page titles. (`Add to basket`, not `Add To Basket`.)
- **Title Case** only on marketing landing-page heroes, never inside the app.
- **ALL CAPS** only for eyebrow labels with `letter-spacing: 0.16em`. Never on buttons.

**Brand naming:**
- Always **`Balsm.health`** in product surfaces, with `.health` set one weight lighter and slightly smaller. In running prose, `Balsm` alone is acceptable after first mention.
- Arabic: always **`بَلسَم`** (with the two diacritics — fatha on ب and on س). Without diacritics is incorrect.

**Tone examples (do):**
- "Stock is low. Reorder soon."
- "Saved locally. Will sync when you reconnect."
- "This medication is a controlled substance. Pharmacist sign-off required."
- Arabic: `حُفظ محلياً — سيتم المزامنة عند الاتصال.`

**Tone examples (don't):**
- ❌ "Oops! Something went wrong 😬"
- ❌ "Failure: SYNC_QUEUE_FLUSH_001"
- ❌ "Click here to learn more!!"

**Emoji:** **No** emoji in product UI. **The five-petal flower is our emoji.**

**Numbers, dates, currencies:**
- Date: `DD/MM/YYYY` (Egypt).
- Currency: prefix `LE` with a non-breaking space — `LE 245.00`.
- Phone: `+20 1X XXXX XXXX`.
- National ID: 14-digit grouped `2 9912 22 12345 6`.

**Density:** Balsm tolerates dense data tables (pharmacy POS, encounter timeline) **but** every dense surface is wrapped in generous outer padding (24–32px) and a warm cream framing so density feels intentional, not crammed.

---

## Visual foundations

### Color — the five petals

The brand has **no single primary color.** The flower mark is five petals in five distinct hues, and the design system treats them as a usable palette of categorical colors. Reach for one when you need a category (modules, departments, charts). Use them all together only in brand moments (hero, loading, watermark).

| Token | Hex | Role |
|---|---|---|
| `--petal-aqua` | `#02BBB5` | Accent · healing surfaces · "Balsm-feeling" moments |
| `--petal-emerald` | `#01C4A2` | Eyebrow labels · success-adjacent affordances |
| `--petal-blue` | `#1283FF` | **Primary action color** — CTAs, links, focus rings |
| `--petal-mint` | `#55D77F` | **Success** — sale completed, vitals normal, synced |
| `--petal-violet` | `#724DD0` | **Controlled substance** — Schedule II/III flags |

Convenience aliases for the two most-reached-for petals are `--balsm-primary` (blue) and `--balsm-accent` (aqua). Each petal has a `-600` (hover/pressed) and `-50` (soft wash chip background) sibling.

**Wordmark:** `--balsm-wordmark #6B6B60` — a warm olive gray. This is the official wordmark color and the anchor of our neutral scale (`--balsm-ink-*` skews warm, never cool / never blue-gray).

**Cream:** `--balsm-cream-100 #F4F3EC` — warm document surface used for receipts, prescriptions, marketing decks, and print surfaces. Never use cool gray (`#F5F7FA`-style) for these — it kills the warmth.

**Sun yellow:** `#E5B428` is reserved for `warning` semantic only (low stock, approval needed). Never as a primary surface.

**Clinical semantics:** Success = `--petal-mint`. Warning = sun. Danger = `#D44A3C` (warm desaturated red — never fire-engine, which reads as panic). Info = `--petal-blue`. Controlled substance = `--petal-violet`. Expiring soon = `#D97A20`.

### Typography

| Role | Family | Weights |
|---|---|---|
| Display / UI headings | **Montserrat** | 600, 700, 800 |
| Body / data / UI text | **IBM Plex Sans** | 400, 500, 600, 700 |
| Arabic (RTL) | **IBM Plex Sans Arabic** primary; **Cairo** for display headlines | 400, 600, 700 |
| Numeric / barcodes / IDs | **IBM Plex Mono** | 400, 500, 600 |

⚠️ **Font substitution flag:** The Balsm-Draft repo ships a 20 MB zip of TTF files (`Cairo,IBM_Plex_Sans,IBM_Plex_Sans_Arabic,Montserrat.zip`) too large to inline here. This system loads the **identical** families from Google Fonts CDN at the top of `colors_and_type.css`. For offline / self-hosted use (Slice 1 installer), unzip the bundle into `assets/fonts/` — no code changes needed.

> **Wordmark typeface:** the official `logo-vertical.svg` uses a custom-set wordmark with rounded geometric forms. Montserrat (700) is the closest free analog and is what this system uses for in-product brand mentions. If the brand later commissions a custom wordmark font, swap `--font-display`.

Scale lives in `colors_and_type.css` (`--fs-xs` 12 → `--fs-6xl` 72, ~1.25 modular ratio).

### Spacing & layout

- 4-px base; tokens `--space-1` (4) → `--space-24` (96).
- Page gutters: 24px mobile / 48px desktop.
- Card padding: 24px standard / 32px hero.
- Form rhythm: 12px label↔input, 16px field↔field.
- Dense tables: 12px row height, 16px horizontal cell padding.

### Backgrounds

- Dominant surface is **white**; **cream** is the warm complement.
- The signature **watercolor petal pattern** (`brand/balsm-background.png`) is the brand environment — translucent petal blobs in the five hues over a near-white wash. Used on landing hero, the local-server welcome screen, and full-bleed print covers. Never inside product chrome.
- **No hand-drawn illustrations** and **no stock-photo people**. When imagery is needed: the flower, the watercolor pattern, or a placeholder. Generic medical-stock photography (gloved hands holding tablets, doctors pointing at the camera) is on the explicit do-not list.
- **No repeating geometric patterns.** The watercolor pattern is the only pattern.

### Borders, shadows, elevation

- Borders are `--balsm-border #E1E1D9` at 1px — warm hairline, **not** cool gray.
- Shadows are warm and soft (`rgba(43, 43, 37, 0.06–0.10)`), never crisp drop shadows. Three sizes plus signatures:
  - `--shadow-sm` default, `--shadow-md` hero, `--shadow-lg` modal
  - `--shadow-brand` (blue-tinted) for primary CTAs
  - `--shadow-petal` (violet-tinted) for controlled-substance surfaces and brand moments
- Cards default to: white surface, 1px border, `--radius-lg` (14px), `--shadow-sm`. Hero cards step up to `--shadow-md` and `--radius-xl`.

### Radii

- `--radius-sm` 6px — chips, tags, small inputs
- `--radius-md` 10px — buttons, standard inputs
- `--radius-lg` 14px — **default card radius**
- `--radius-xl` 20px — hero / modal / panel
- `--radius-2xl` 28px — squircle app-icon mark
- `--radius-pill` 999px — capsules, status pills, avatars

### Motion

- Default easing `--ease-out cubic-bezier(0.16, 1, 0.3, 1)` — calm, never bouncy. Healthcare deserves stillness.
- Durations: 120ms / 200ms / 320ms.
- **Hover:** tint shift by one step (e.g. `--petal-blue` → `--petal-blue-600`) or opacity 0.85. Never scale-up on hover for clinical surfaces.
- **Press:** primary CTAs tint darker + shrink to 0.98. Secondary buttons just tint-shift.
- **Page transitions:** 200ms cross-fade. No slides, no rotations.
- **Brand loader:** the five-petal mark rotates slowly (4s linear).

### Transparency & blur

- Sticky headers: `backdrop-filter: blur(12px)` over 92%-white. Modal scrim: `rgba(43, 43, 37, 0.4)`.
- **No glassmorphism / frosted-glass cards** — reads as consumer-flashy, not clinical.

### Imagery vibe

When real imagery is required (clinic onboarding, marketing): **natural daylight, warm white balance, soft contrast, no heavy filters, real people only when explicitly licensed.** Avoid medical-stock photography. The watercolor petal pattern is the safe default.

---

## Iconography

Balsm uses **Lucide** ([lucide.dev](https://lucide.dev)) as its core icon system: outline, geometric, calm stroke weight — matches the brand voice. Comprehensive medical & commerce coverage (`pill`, `stethoscope`, `syringe`, `scan`, `package`, `barcode`). Free, open-source, CDN-available.

- **Stroke weight:** 1.75 px default in product UI, 2 px for emphasis.
- **Color:** icons inherit `currentColor`.
- **Size:** 16 / 20 / 24 px standard. 16-px is reserved for inline-with-text.

⚠️ **Substitution flag:** Balsm does not ship its own icon font / SVG set. Lucide is a deliberate stand-in chosen for stylistic fit; the brand prompt's "minimal, geometric" direction aligns exactly with Lucide's house style. The **five-petal flower** in `brand/` is the only Balsm-bespoke iconographic asset — use for brand moments, never as a generic UI icon.

**Loading Lucide:**
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="pill"></i>
<script>lucide.createIcons();</script>
```

**Emoji policy:** none in product UI. Unicode arrows (`→ ← ↑ ↓`) and bullets (`•`) are fine in copy; everything that reads as an icon must be Lucide or the brand flower.

**The flower mark:** `brand/logo-vertical.svg`. Five-petal radial symmetry, five distinct petal colors. Use as:
- App icon (squircle-clipped, ink or cream background)
- Loading spinner (slow rotate, 4s linear)
- Empty-state hero (centered, 96px)
- Watermark on prescriptions / receipts (8–10% opacity)
- Hero backdrop (with watercolor pattern)

---

## UI kits

| Kit | Surface | Notes |
|---|---|---|
| `ui_kits/balsm_pharmacy/` | Pharmacy POS + inventory + admin (Slice 1) | Most-validated surface in the roadmap; built from the brand assets, the BUSINESS_FEATURES spec, and the roadmap. Includes RTL toggle. |

The **patient app** (Slice 2) and **doctor encounter** (Slice 2) UIs are not yet built — the source materials describe them but contain no UI references. Flag any future work in those areas as **new design**, not recreation.

---

## How to use this design system

1. **Drop `colors_and_type.css` into your artifact:**
   ```html
   <link rel="stylesheet" href="path/to/colors_and_type.css">
   ```
2. **Use semantic tokens** (`var(--fg1)`, `var(--balsm-primary)`, `var(--balsm-success)`) in component code, not raw petal hexes. The petals are the palette; the semantic tokens are the contract.
3. **Headings:** use `.h1` – `.h5` classes (or `--font-display` directly). Body inherits from `<body>`.
4. **Arabic / RTL:** set `dir="rtl"` on the root; the font swap happens automatically via `[dir="rtl"]`.
5. **Lift components from `ui_kits/balsm_pharmacy/`** — buttons, inputs, cards, table rows, status pills, sidebar nav are all there.

---

## Caveats & open questions for the user

- **Fonts substituted to CDN.** The 20 MB TTF bundle wasn't imported; Google Fonts is used. If you need offline fonts, drop the bundle into `assets/fonts/`.
- **Lucide icon system** is a substitute — the brand has no shipped icon set.
- **Wordmark font** is Montserrat (the closest free analog to the official SVG-set wordmark). If a custom wordmark typeface is later commissioned, swap `--font-display`.
- **Patient app + doctor encounter UI kits are not built** — no source UI exists. Asks: do you want us to design those net-new based on the roadmap?
- **Egypt-specific** (currency, dates, IDs) is baked in. Expanding to Saudi (NPHIES) or other markets needs its own pass.
