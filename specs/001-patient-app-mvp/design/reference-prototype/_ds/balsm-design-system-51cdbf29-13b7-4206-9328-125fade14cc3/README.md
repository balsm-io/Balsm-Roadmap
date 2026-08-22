# Balsm Design System

> **Balsm.health · بلسم** — the community-owned healthcare OS for the Arab world.
> **Open. Arab. Owned.** · مفتوح. عربي. مملوك.

---

## Brand Promise
> **"Your care. Your data. Your system."**
> رعايتك. بياناتك. نظامك.

Balsm promises that your healthcare — whether you give it or receive it — belongs to you. Your data stays yours. Your system works when you need it, where you need it, in the language you think in. No vendor between you and your care. No internet required to deliver it. No compromise on who you are.

---

## Purpose & Mission

**Balsm exists because healthcare in the Arab world deserves infrastructure worthy of it.**

**Mission:** To build the open standard for healthcare operations across MENA — free for every provider to own, run, and trust — so that clinics in Cairo and hospitals in Riyadh operate with the same reliability, privacy, and dignity as anywhere else in the world.

**Vision:** A future where every person in the Arab world — from the Atlantic to the Gulf — receives care from providers who own their tools, trust their data, and speak their language. Not a product vision. A civilization one.

> **من الإسكندرية إلى أسوان — نفس بلسم، نفس الموثوقية.**
> From Alexandria to Aswan — the same Balsm, the same reliability.

---

## Positioning

**The Category:** Community-Owned Healthcare OS — infrastructure that belongs to the people who use it, built on open standards, designed for Arabic-speaking care, resilient enough to run without a single byte of cloud dependency.

**Three Words:** Open. Arab. Owned. · مفتوح. عربي. مملوك.

**One-line:** The community-owned healthcare OS for the Arab world.
نظام التشغيل الصحي المملوك للمجتمع — للعالم العربي.

---

## Core Values

| # | القيمة | Value | Principle |
|---|---|---|---|
| ١ | الانفتاح | Openness | The code is open. The roadmap is open. The decisions are open. |
| ٢ | السيادة | Sovereignty | Your data. Your infrastructure. Your rules. |
| ٣ | المجتمع | Community | The ecosystem outlasts any product. |
| ٤ | العروبة | Arabic-First | Arabic is not a translation — it's the original. |
| ٥ | الصمود | Resilience | Works in Aswan as well as it works in Alexandria. Offline-first is a value, not a feature. |
| ٦ | الإتقان | Excellence | Healthcare deserves better than good enough. |

---

## Target Audience

**Primary — المريض:** The Arab patient — urban and underserved equally, from Alexandria to Aswan — who navigates a fragmented healthcare system with no continuous record, no visibility into their own data. Patient demand pulls providers onto Balsm; bottom-up adoption.

**Secondary — المهنيون:** Pharmacists, doctors, nurses, lab operators — who live inside Balsm daily.

**Economic Buyer:** The clinic/hospital operations manager — choosing Balsm because it is self-hosted, PDPL-compliant, and costs nothing to own.

**Geographic sequencing:** Launch: Egypt (Alexandria → Aswan simultaneously) · Expansion: GCC Phase 3+ · Vision: المحيط إلى الخليج.

---

## Brand Personality

Balsm carries two complementary qualities in equal measure:

**Serious when it counts.** In clinical contexts, compliance language, and data handling — precise, measured, trustworthy. A seasoned professional who never overpromises and always delivers. No fluff, no shortcuts.

**Optimistic where it matters.** In onboarding, community, and product vision — warm, encouraging, quietly proud. Believing genuinely that the Arab world deserves world-class, self-owned healthcare infrastructure.

If Balsm were a person: a trusted healthcare professional who believes deeply in open systems and the people who use them. Patient with complexity. Honest about tradeoffs. Never performative.

| Trait | Where it shows |
|---|---|
| **Seriousness** | Clinical copy, compliance, error messages, data handling, documentation |
| **Optimism** | Onboarding, marketing, community, open-source, patient-facing flows |

---

## Voice & Tone

### The 14 Brand Words
**Trustworthy · Honest · Reliable · Transparent · Human · Empowering · Accessible · Visionary · Warm · Caring · Clear · Refined · Welcoming · Optimistic**

موثوق · صادق · مضمون · شفّاف · إنساني · مُمكِّن · في متناول الجميع · رؤيوي · دافئ · مُعتنٍ · واضح · مُصقول · مُرحِّب · متفائل

### Two Registers

#### 🩺 Clinical / Technical Register
*For: docs, compliance, error messages, data handling, API references, security notices*

Active words: **Trustworthy · Reliable · Honest · Transparent · Clear · Refined**

Rules:
- Be precise. One meaning per sentence.
- Never soften a hard truth with filler.
- Error messages explain what happened and what to do — they never blame.
- Use correct Arabic medical terminology, not transliterated English.

#### 🌿 Product / Patient / Community Register
*For: onboarding, patient app, marketing, open-source community, contributor docs*

Active words: **Warm · Empowering · Caring · Accessible · Welcoming · Optimistic · Human · Visionary**

Rules:
- Write like a trusted colleague, not a company.
- Arabic is always first-class — never an afterthought.
- Optimism is earned, not assumed.
- Data sovereignty language: the patient/provider is always in control.

### Voice Examples

**Do:**
- "Your health record is yours. It doesn't go anywhere you didn't choose."
- "Recorded. On your device, by design."
- "Works in Aswan as well as it works in Cairo."
- "This medication is a controlled substance. Pharmacist sign-off required."
- Arabic: `بياناتك. ملكك وحدك.`

**Don't:**
- ❌ "Oops! Something went wrong 😬"
- ❌ "Saved locally. Will sync when you reconnect." *(apologetic framing)*
- ❌ "Failure: SYNC_QUEUE_FLUSH_001"
- ❌ "Click here to learn more!!"
- ❌ Anything that sounds cold & corporate, hyped, preachy, or timid/apologetic.

---

## Brand Experience

### Three Defining Moments
Three moments capture everything Balsm promises to feel like:

1. A patient in Cairo opens Balsm and sees — for the first time — their complete health journey in one place. Every prescription, every visit, every lab result. Theirs. In Arabic. Finally whole.
2. A pharmacist in a village outside Aswan dispenses medication. The internet has been down for two days. Balsm hasn't noticed.
3. A developer in Alexandria finds Balsm on GitHub. Reads the code. Reads the mission. Feels pride that this was built here, by people who understand here.

### Every Touchpoint Must Be
| Standard | What it means |
|---|---|
| **Frictionless** | Just works, without asking the user to think about infrastructure |
| **Warm** | Feels like a trusted colleague, not a cold system |
| **Trustworthy** | Every interaction reinforces confidence in Balsm |

**The one-line experience promise:**
*Balsm makes healthcare feel like it finally belongs to you.*
بلسم يشعرك بأن الرعاية الصحية أخيراً في مكانها الصحيح.

---

## Product Architecture

The product ships as three surfaces:

| Surface | Scope | Status |
|---|---|---|
| **Balsm Pharmacy** | Pharmacy POS · Inventory · Admin | UI kit built → `ui_kits/balsm_pharmacy/` |
| **Balsm Care** | Patient app · Doctor encounter · Full care loop | Patient app prototype built → `patient_app/` |
| **Balsm Network** | Paid cloud tier | Not yet designed |

**Differentiators:** Arabic-first / full RTL · Offline-default · Egypt-localized (EGP, NID, Law 182/1960, 27 governorates, DD/MM/YYYY) · Calm clinical aesthetic — five-petal mark, no medical-cliché iconography.

---

## Content Fundamentals

**Voice:** calm, human, second-person. Balsm is the patient's quiet ally; the pharmacist's reliable counter; the doctor's tidy notebook. Never salesy, never clinical-cold.

**Pronoun:** "you" in English. Arabic: **أنت** for direct affordances; **نحن** sparingly for Balsm speaking.

**Casing:**
- **Sentence case** everywhere in UI (buttons, headings, menu items).
- **Title Case** only on marketing heroes. Never inside the app.
- **ALL CAPS** only for eyebrow labels with `letter-spacing: 0.16em`.

**Brand naming:**
- **`Balsm.health`** in product surfaces — `.health` set one weight lighter + slightly smaller.
- Arabic: always **`بلسم`** with both diacritics (fatha on ب and on س). Without diacritics is incorrect.
- Short form: `Balsm` alone is acceptable in running prose after first mention.

**Emoji:** None in product UI. The five-petal flower is our emoji.

**Numbers/dates/currency:** `DD/MM/YYYY` · `LE 245.00` · `+20 1X XXXX XXXX` · NID 14-digit grouped `2 9912 22 12345 6`.

---

## Visual Foundations

### Color — the five petals

The brand has **no single primary color.** Five petals, five hues. Reach for one when you need a category color. Use all five only in brand moments.

| Token | Hex | Role |
|---|---|---|
| `--petal-aqua` | `#02BBB5` | Healing surfaces · "Balsm-feeling" moments |
| `--petal-emerald` | `#01C4A2` | Eyebrow labels · success-adjacent |
| `--petal-blue` | `#1283FF` | **Primary action** — CTAs, links, focus rings |
| `--petal-mint` | `#55D77F` | **Success** — dispensed, synced, vitals normal |
| `--petal-violet` | `#724DD0` | **Controlled substance** — Schedule II/III flags |

Aliases: `--balsm-primary` (blue) · `--balsm-accent` (aqua). Each petal has `-600` (hover/pressed) and `-50` (soft wash) siblings.

**Neutral anchor:** `--balsm-wordmark #6B6B60` — warm olive gray. The `--balsm-ink-*` scale skews warm, never cool/blue-gray.

**Cream:** `--balsm-cream-100 #F4F3EC` — receipts, prescriptions, print surfaces. Never cool gray.

**Clinical semantics:** Success = mint · Warning = sun `#E5B428` · Danger = `#D44A3C` (warm red, never fire-engine) · Controlled = violet · Expiring = `#D97A20`.

### Typography

| Role | Family | Weights |
|---|---|---|
| Display / headings | **Montserrat** | 600, 700, 800 |
| Body / data / UI | **IBM Plex Sans** | 400, 500, 600, 700 |
| Arabic / RTL | **IBM Plex Sans Arabic** + **Cairo** (display) | 400, 600, 700 |
| Numeric / IDs | **IBM Plex Mono** | 400, 500, 600 |

Scale: `--fs-xs` 12px → `--fs-6xl` 72px (~1.25 modular ratio). Lives in `colors_and_type.css`.

### Spacing, Radii, Shadows

- 4px base. Tokens `--space-1` (4) → `--space-24` (96).
- Gutters: 24px mobile / 48px desktop. Card pad: 24px. Hero pad: 32px.
- `--radius-lg` 14px default card · `--radius-xl` 20px hero/modal · `--radius-pill` 999px.
- Shadows: warm, soft (`rgba(43,43,37,0.06–0.10)`). Never crisp. `--shadow-brand` (blue-tinted) for primary CTAs.

### Motion

- `--ease-out cubic-bezier(0.16,1,0.3,1)` — calm. Healthcare deserves stillness.
- 120ms / 200ms / 320ms.
- **No bouncing.** No slides or rotations on page transitions. 200ms cross-fade only.
- Hover: tint shift one step. Press: tint darker + scale 0.98. Never scale-up on hover for clinical surfaces.

### Backgrounds & Imagery

- The signature watercolor petal pattern (`brand/balsm-background.png`) — hero backdrops, welcome screens, full-bleed print covers. **Never inside product chrome.**
- **No hand-drawn illustrations. No stock-photo people.** When imagery is needed: the flower, the watercolor pattern, or a placeholder.
- **No repeating geometric patterns.** The watercolor petal pattern is the only pattern.
- No glassmorphism. No frosted-glass cards — reads as consumer-flashy, not clinical.

---

## Iconography

**Lucide** ([lucide.dev](https://lucide.dev)) — outline, geometric, calm. Stroke weight 1.75px default / 2px emphasis. Size 16 / 20 / 24px.

The **five-petal flower mark** (`brand/logo-vertical.svg`) is the only Balsm-bespoke icon. Use as app icon, loading spinner (4s slow rotate), empty-state hero, or watermark on prescriptions (8–10% opacity). **Never redraw it.**

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="pill"></i>
<script>lucide.createIcons();</script>
```

---

## Design System Files

| File / folder | What it is |
|---|---|
| `README.md` | This document — canonical brand + design reference |
| `SKILL.md` | Agent-Skill manifest — read if you are an LLM designing with Balsm |
| `colors_and_type.css` | All CSS tokens (color, type, spacing, radii, shadows, motion) |
| `brand/` | Logo SVG, white reverse PNG, watercolor background |
| `uploads/balsm-brand-canvas.md` | Brand Model Canvas — mission, voice, values, positioning (canonical) |
| `ui_kits/balsm_pharmacy/` | Balsm Pharmacy — POS + admin UI kit |
| `patient_app/` | Balsm Care — patient app prototype, auth + self-reporting |

---

## Responsive & Adaptive Design

**All Balsm surfaces must work across every device.** This is a non-negotiable — not a stretch goal.

### Breakpoints

| Name | Width | Layout context |
|---|---|---|
| `xs` | 375px | Small phone — 4-col grid, full-viewport app |
| `sm` | 480px | Large phone |
| `md` | 768px | Tablet portrait — 8-col grid, side panels emerge |
| `lg` | 1024px | Tablet landscape / small laptop — 12-col grid, sidebar nav |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop — max-width containers |

Breakpoints live as `--bp-*` tokens in `colors_and_type.css`. Because CSS can't use custom properties in `@media` queries, reference the raw pixel values in media queries; the tokens are for JS consumption.

### Adaptive layout strategy

**Mobile (< 600px):** Full-viewport. No chrome. Touch targets ≥ 44px. Safe-area insets. Single-column.

**Tablet (768px – 1024px):** Two-column layouts. Side panels emerge. Phone-in-frame for mobile-app prototypes.

**Desktop (1024px+):** Sidebar navigation. Multi-column grids. Hover states. Max-width container (`--container-xl: 1200px`) centered.

### Rules

- Use `clamp()` for fluid type (`.fluid-display`, `.fluid-body` classes provided).
- Use `.container` for page-level width control — adapts gutter automatically.
- Use `.card-grid` for card collections — 1 → 2 → 3 → 4 columns.
- Use `.row-md` for stacks that become rows at tablet width.
- Use `.show-mobile` / `.hide-mobile` / `.show-desktop` for adaptive visibility.
- **Never** let a desktop viewport show a stretched single-column phone layout.
- **Mobile-app prototypes** (patient app, phone flows): show iOS/Android frame on tablet+, full-viewport on phones.

### Responsive tokens

```css
/* Adaptive gutters */
--gutter:      16px;  /* mobile */
--gutter-md:   24px;  /* tablet */
--gutter-lg:   48px;  /* desktop */

/* Type scale — auto-escalates at breakpoints via @media in colors_and_type.css */
--fs-base: 14px → 15px (tablet) → 16px (desktop)
--fs-md:   16px → 17px (tablet) → 18px (desktop)

/* Grid columns */
--cols-mobile:  4
--cols-tablet:  8
--cols-desktop: 12
```

---

## How to Use This Design System

1. **Import tokens:** `<link rel="stylesheet" href="path/to/colors_and_type.css">`
2. **Use semantic tokens** (`var(--fg1)`, `var(--balsm-primary)`, `var(--balsm-success)`) — not raw hex.
3. **Check voice register** before writing copy — clinical or product/patient?
4. **Test against experience standard:** Is every touchpoint frictionless + warm + trustworthy?
5. **RTL:** set `dir="rtl"` on root; `--font-arabic` swaps automatically via `[dir="rtl"]` selectors.
6. **Lift components** from `ui_kits/balsm_pharmacy/` or `patient_app/` — don't reinvent buttons, cards, inputs.

---

## Source Materials

| Source | Why it's here |
|---|---|
| `uploads/balsm-brand-canvas.md` | **Canonical brand reference** — locked. Mission, voice, values, positioning. |
| `balsm-health/assets/brand/` | Official brand pack — logo, watercolor background |
| `balsm-health/Balsm-Draft` | Product roadmap, business features, controlled-substance + RTL requirements |
| AppFlowy-IO/AppFlowy | Offline-sync + workspace patterns reference |

> For deeper work: the Balsm-Draft repo has 60k+ words of market research and a 300k-word business-feature spec.

---

## Caveats

- **Fonts:** loaded from Google Fonts CDN. For offline/self-hosted, drop the TTF bundle into `assets/fonts/`.
- **Icons:** Lucide is a deliberate substitute — the brand has no shipped icon set of its own.
- **Wordmark font:** Montserrat 700 is the closest free analog to the official SVG wordmark. Swap `--font-display` if a custom typeface is later commissioned.
- **Egypt-specific** (currency, dates, IDs, governorates) is baked in. Expanding to Saudi (NPHIES) or other markets needs a dedicated pass.
