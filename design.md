# Balsm Design

> **Balsm.health · بَلسَم** — open-source healthcare for Egypt and the Arabic-speaking world. Five petals · five colors · one promise: healing, locally.

This file is the **design contract** for every Balsm surface (Pharmacy, Patient app, Doctor encounter, marketing, print). It synthesizes the canonical design system that lives under [agents/skills/balsm-design/](agents/skills/balsm-design/) — point any designer or agent there for full assets, preview cards, and UI kits.

Source bundle: `claude.ai/design` handoff `2cciG9JbwwrxjgwScIChKA`, ingested 2026-05-30.

---

## 1. Skill manifest

| Path | Role |
|---|---|
| [agents/skills/balsm-design/SKILL.md](agents/skills/balsm-design/SKILL.md) | Agent-Skill entrypoint. Read first if you are an LLM. |
| [agents/skills/balsm-design/README.md](agents/skills/balsm-design/README.md) | Full design-system manual (long-form). |
| [agents/skills/balsm-design/HANDOFF.md](agents/skills/balsm-design/HANDOFF.md) | Original `claude.ai/design` handoff note. |
| [agents/skills/balsm-design/colors_and_type.css](agents/skills/balsm-design/colors_and_type.css) | Single source of truth — every CSS token. |
| [agents/skills/balsm-design/brand/](agents/skills/balsm-design/brand/) | Logo (color / reverse / PNG), watercolor pattern. Bundled copy; **canonical brand pack lives in-repo at [brand/](brand/)**. |
| [agents/skills/balsm-design/preview/](agents/skills/balsm-design/preview/) | Reference cards for colors, type, spacing, components, brand. |
| [agents/skills/balsm-design/ui_kits/balsm_pharmacy/](agents/skills/balsm-design/ui_kits/balsm_pharmacy/) | Slice 1 — Pharmacy POS / Inventory / Customers / Admin (modular JSX + working `index.html`). |
| [agents/skills/balsm-design/patient_app/](agents/skills/balsm-design/patient_app/) | Slice 2 — Patient app prototype (iOS frame, auth + self-report flow, EN/AR/RTL). |
| [agents/skills/balsm-design/chats/](agents/skills/balsm-design/chats/) | Original design conversations — intent, rationale, font + logo decisions. |

---

## 2. Product slices the design covers

1. **Slice 1 — Pharmacy Standalone.** Local server, POS, inventory, customer profiles, paper-Rx attachment. UI kit complete.
2. **Slice 2 — Full Care Loop.** Patient app, doctor profile, appointments, encounters, digital Rx (QR) → links to Slice-1 POS. Patient app prototype complete; doctor encounter is net-new design territory.
3. **Slice 3 — Balsm Network.** Paid cloud tier — online booking, cross-entity sharing, centralized patient identity. No UI yet.

---

## 3. Brand non-negotiables

1. **Name.** Always `Balsm.health` in product (`.health` one weight lighter, smaller). Arabic: `بَلسَم` **with diacritics** (fatha on ب and on س). Without diacritics is incorrect.
2. **Mark.** Five-petal flower in **five distinct hues** — aqua, emerald, blue, mint, violet. Never recolor to a single hue except in the documented mono / reverse lockups (§7).
3. **No medical-cliché iconography** for brand symbols (no cross, syringe, heart). Lucide `pill` / `stethoscope` / `syringe` are fine **inside** the product, never as a logo replacement.
4. **No emoji in product UI.** The flower is our emoji. Marketing decks may use a single `🌿` sparingly.
5. **Arabic is first-class.** Every surface must work with `dir="rtl"` and `--font-arabic`. `[dir="rtl"]` selectors swap fonts automatically.
6. **Voice.** Calm, second-person, sentence case. `"Saved locally. Will sync when you reconnect."` — not `"Oops! Saved! ✨"`.
7. **Egyptian formatting.** Dates `DD/MM/YYYY`, currency `LE 245.00` (non-breaking space), phones `+20 1X XXXX XXXX`, national ID 14-digit grouped `2 9912 22 12345 6`.

---

## 4. Color — the five petals

The brand has **no single primary color.** The mark is five petals in five hues; the design system treats them as a categorical palette. Reach for one when you need a category (modules, departments, charts). Use all five together only in brand moments (hero, loading, watermark).

| Token | Hex | Role |
|---|---|---|
| `--petal-aqua` | `#02BBB5` | Accent · healing surfaces · "Balsm-feeling" moments |
| `--petal-emerald` | `#01C4A2` | Eyebrow labels · success-adjacent affordances |
| `--petal-blue` | `#1283FF` | **Primary action** — CTAs, links, focus rings |
| `--petal-mint` | `#55D77F` | **Success** — sale completed, vitals normal, synced |
| `--petal-violet` | `#724DD0` | **Controlled substance** — Schedule II/III flags |

Each petal has `-600` (hover/pressed) and `-50` (soft wash background) siblings. Aliases: `--balsm-primary` (blue), `--balsm-accent` (aqua).

**Wordmark color:** `--balsm-wordmark #6B6B60` — warm olive gray, anchor of the neutral scale (`--balsm-ink-*` skews warm, never cool / never blue-gray).

**Cream:** `--balsm-cream-100 #F4F3EC` — warm document surface for receipts, prescriptions, marketing decks, print. Never substitute cool gray.

**Semantic clinical state:**
- Success = `--petal-mint`
- Warning = `#E5B428` (sun) — low stock, approval needed
- Danger = `#D44A3C` (warm desaturated red — never fire-engine, which reads as panic)
- Info = `--petal-blue`
- Controlled substance = `--petal-violet`
- Expiring soon = `#D97A20`

Full token list: [colors_and_type.css](agents/skills/balsm-design/colors_and_type.css).

---

## 5. Typography

| Role | Family | Weights |
|---|---|---|
| Display / UI headings | **Montserrat** | 600, 700, 800 |
| Body / data / UI text | **IBM Plex Sans** | 400, 500, 600, 700 |
| Arabic (RTL) | **IBM Plex Sans Arabic** primary; **Cairo** for display headlines | 400, 600, 700 |
| Numeric / barcodes / IDs | **IBM Plex Mono** | 400, 500, 600 |

- Scale: `--fs-xs` 12 → `--fs-6xl` 72 (16px base, ~1.25 modular).
- Classes: `.h-display`, `.h1`–`.h5`, `.p`, `.p-sm`, `.meta`, `.code`, `.eyebrow`, `.wordmark`, `.wordmark-ar`.
- Eyebrows: `text-transform: uppercase; letter-spacing: 0.16em` — emerald color.
- Wordmark default: Montserrat 700 (closest free analog to the custom-set SVG wordmark). Swap `--font-display` if a custom wordmark face is later commissioned.

**Substitution flags (open with product team):**
- Fonts loaded from Google Fonts CDN. Offline installer (Slice 1) needs the 20 MB TTF bundle unzipped into `assets/fonts/`. See [Balsm-Draft](https://github.com/balsm-health/Balsm-Draft).
- **Lucide** is a deliberate icon substitute — Balsm ships no own icon set.

---

## 6. Spacing · radii · shadows · motion

**Spacing** (4-px base): `--space-1` 4 → `--space-24` 96. Page gutters 24 (mobile) / 48 (desktop). Card padding 24 (standard) / 32 (hero). Form rhythm 12 (label↔input), 16 (field↔field). Dense tables: 12-px row, 16-px horizontal cell padding.

**Radii:** `sm` 6 (chips), `md` 10 (buttons / inputs), `lg` 14 (**card default**), `xl` 20 (hero / modal), `2xl` 28 (squircle app icon), `pill` 999.

**Shadows.** Warm, soft `rgba(43, 43, 37, 0.06–0.10)` — never crisp drop shadows.
- `--shadow-sm` default · `--shadow-md` hero · `--shadow-lg` modal
- `--shadow-brand` (blue-tinted) for primary CTAs
- `--shadow-petal` (violet-tinted) for controlled-substance surfaces and brand moments

**Motion.** Default ease `cubic-bezier(0.16, 1, 0.3, 1)` — calm, never bouncy. Healthcare deserves stillness.
- Durations 120 / 200 / 320 ms.
- Hover: tint shift one step, or opacity 0.85. **Never scale-up on hover** for clinical surfaces.
- Press: primary CTAs tint darker + shrink to 0.98. Secondary just tint-shift.
- Page transitions: 200ms cross-fade. No slides, no rotations.
- Brand loader: five-petal mark rotates slowly (4s linear).

**Transparency.** Sticky headers `backdrop-filter: blur(12px)` over 92% white. Modal scrim `rgba(43, 43, 37, 0.4)`. **No glassmorphism / frosted-glass cards** — reads consumer-flashy, not clinical.

---

## 7. Brand mark — lockup family

| Use | Treatment |
|---|---|
| **Primary** — app icon, web, marketing, storefront | Full 5-color flower + bilingual wordmark |
| **Reverse** — dark UI, splash, photos, signage | All-white knockout (flower + wordmark) |
| **Mono ink** — receipts watermark, stamps, fax, 16-px favicon | Single `--balsm-wordmark #6B6B60`, or solid `--petal-blue` |
| **Mono brand** — single color but on-brand | Solid `--petal-emerald #01C4A2` — closest to historic "Balsm green," most legible single hue |

Flower mark usage: app icon (squircle-clipped, ink or cream bg) · loading spinner (4s linear rotate) · empty-state hero (centered, 96px) · prescription/receipt watermark (8–10% opacity) · hero backdrop (over the watercolor pattern).

**Backgrounds.** Dominant surface = white; cream is the warm complement. Watercolor petal pattern (`brand/balsm-background.png`) is the brand environment — translucent petal blobs in the five hues over a near-white wash. Used on landing hero, local-server welcome screen, full-bleed print covers. **Never inside product chrome.** No repeating geometric patterns. No hand-drawn illustrations. No stock-photo people. No generic medical stock photography.

---

## 8. Iconography

[Lucide](https://lucide.dev) — outline, geometric, calm stroke weight.

- Stroke 1.75 px default; 2 px for emphasis.
- Color inherits `currentColor`.
- Sizes 16 / 20 / 24 px. 16-px reserved for inline-with-text.
- Comprehensive medical + commerce coverage: `pill`, `stethoscope`, `syringe`, `scan`, `package`, `barcode`.

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="pill"></i>
<script>lucide.createIcons();</script>
```

**Emoji policy.** None in product UI. Unicode arrows (`→ ← ↑ ↓`) and bullets (`•`) OK in copy; anything that reads as an icon must be Lucide or the brand flower.

---

## 9. Voice & copy

Calm · professional · human · second-person. Balsm is the patient's quiet ally, the pharmacist's reliable counter, the doctor's tidy notebook. Never salesy, never clinical-cold.

**Casing.** Sentence case for all UI (buttons, menu items, headings, page titles). Title Case only on marketing landing-page heroes. ALL CAPS only for eyebrow labels at `letter-spacing: 0.16em`.

**Address.** EN: "you". AR: **`أنت`** for direct affordances (`سجّل الدخول`); **`نحن / "we"`** sparingly when Balsm itself is speaking (`نحن نحفظ بياناتك محلياً`). Avoid corporate `the system` / `النظام`.

**Tone examples — do:**
- "Stock is low. Reorder soon."
- "Saved locally. Will sync when you reconnect."
- "This medication is a controlled substance. Pharmacist sign-off required."
- `حُفظ محلياً — سيتم المزامنة عند الاتصال.`

**Tone examples — don't:**
- "Oops! Something went wrong 😬"
- "Failure: SYNC_QUEUE_FLUSH_001"
- "Click here to learn more!!"

**Density.** Balsm tolerates dense data tables (POS, encounter timeline), but every dense surface is wrapped in generous 24–32 px outer padding and a warm cream framing so density feels intentional, not crammed.

---

## 10. How to use this design

1. **Drop the tokens** into any new artifact:
   ```html
   <link rel="stylesheet" href="agents/skills/balsm-design/colors_and_type.css">
   <link rel="icon" type="image/svg+xml" href="brand/logo-vertical.svg">
   ```
2. **Use semantic tokens** (`var(--fg1)`, `var(--balsm-primary)`, `var(--balsm-success)`) in component code, not raw petal hex. Petals are the palette; semantic tokens are the contract.
3. **Headings:** `.h1`–`.h5`. Body inherits from `<body>`.
4. **Arabic / RTL:** set `dir="rtl"` on the root; font swap happens via `[dir="rtl"]`.
5. **Lift components** from `ui_kits/balsm_pharmacy/` for any pharmacy / inventory / admin surface. Lift from `patient_app/` for patient-side mobile.
6. **Sources:** every new component should cite a preview card in [preview/](agents/skills/balsm-design/preview/) and a UI-kit element it derives from.

For the Figma MCP HTML-to-Design capture workflow (mockup → Figma → Flutter), see [agents/rules/UI_DESIGN.md](agents/rules/UI_DESIGN.md).

---

## 11. Open questions / caveats

- **Fonts.** Substituted to Google Fonts CDN. For the offline installer, drop the 20 MB TTF bundle from [Balsm-Draft](https://github.com/balsm-health/Balsm-Draft) into `assets/fonts/`.
- **Icons.** Lucide is a substitute; no Balsm-bespoke set exists.
- **Wordmark face.** Montserrat is the closest free analog to the official SVG-set wordmark. Swap `--font-display` if a custom wordmark is commissioned.
- **Doctor encounter UI** is unbuilt — no source UI exists. Net-new design, not recreation.
- **Slice 3 (Balsm Network)** has no UI yet.
- **Egypt-specific** formatting (currency, dates, IDs, controlled-substance schedules) is baked in. Saudi (NPHIES) or other markets need their own pass.

---

## 12. Reference repos

| Repo | Why |
|---|---|
| [balsm-io/assets](https://github.com/balsm-health/assets) | Canonical brand pack (logo, watercolor pattern). |
| [balsm-io/Balsm-Draft](https://github.com/balsm-health/Balsm-Draft) | Roadmap, market research, business-feature spec, controlled-substance + RTL requirements. |
| [AppFlowy-IO/AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | Offline-first / local-first reference. |
| [ClickUp](https://clickup.com) | Ops-dashboard density, sidebars, module switchers. |
| [OHC Care Core](https://ohc.network/product/care-core) | Clinical data model + open-source healthcare patterns. |
