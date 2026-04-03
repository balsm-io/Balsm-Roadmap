# Balsm — UI Design Guidelines

> Generic rules for creating UI designs via the Figma MCP HTML-to-Design workflow and implementing UI in Flutter across all Balsm apps.

---

## 1. Design Workflow

### 1.1 Design-First Rule
- every UI screen or component must have a Figma design before implementation
- designs are created as HTML mockups and captured to Figma via the MCP HTML-to-Design workflow
- always include the Figma design URL in the corresponding GitHub issue and PR description

### 1.2 Figma MCP Capture Process
1. create an HTML file referencing the shared design system CSS and the Figma capture script
2. build all three responsive breakpoints (mobile, tablet, desktop) side-by-side in a single file
3. test in browser before capture
4. start a local HTTP server to serve the mockup directory
5. use `generate_figma_design` to get a capture ID, open the URL in browser, and poll until `completed`

### 1.3 HTML Mockup Structure
```html
<link rel="stylesheet" href="design-system.css">
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```
- use `<meta name="viewport" content="width=2800">` so all three frames are visible side-by-side
- add only page-specific styles in a `<style>` block — never redefine design system tokens
- use `.responsive-container` > `.device-frame` > `.frame .frame-mobile/.frame-tablet/.frame-desktop`

---

## 2. Design Tokens

All visual values come from CSS custom properties defined in the design system. Never use raw hex codes, pixel values, or hardcoded font weights.

### 2.1 Color Palette
| Category | Tokens | Purpose |
|----------|--------|---------|
| Primary | `--color-primary`, `--color-primary-light`, `--color-primary-bg`, `--color-primary-gradient` | Brand identity, CTAs, active states |
| Neutral | `--color-bg`, `--color-bg-page`, `--color-surface`, `--color-border`, `--color-border-light` | Backgrounds, cards, dividers |
| Text | `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-muted` | Content hierarchy |
| Semantic | `--color-success(-bg)`, `--color-warning(-bg)`, `--color-danger(-bg)`, `--color-info(-bg)` | Status indicators, alerts |

### 2.2 Typography
- font sizes: `--font-xs` (10px) through `--font-5xl` (44px)
- font weights: `--weight-normal` (400) through `--weight-extrabold` (800)
- line heights: `--leading-tight` (1.2), `--leading-normal` (1.5), `--leading-relaxed` (1.6)
- font family: system font stack

### 2.3 Spacing
- 4px base scale: `--space-1` (4px) through `--space-16` (64px)
- always use the token, never raw pixel values

### 2.4 Border Radius
- `--radius-sm` (8px) through `--radius-full` (pill)

### 2.5 Shadows
- `--shadow-sm` through `--shadow-xl` for progressive elevation

---

## 3. Responsive Design

### 3.1 Breakpoints

| Breakpoint | Width | Navigation | Layout |
|------------|-------|------------|--------|
| Mobile | `414px` | Bottom nav | Single column, stacked cards |
| Tablet | `768px` | Bottom nav | Split panel or 2-column grid |
| Desktop | `1440px` | Sidebar | Multi-column with table views |

### 3.2 Layout Rules
- **Mobile**: single column, card-based, no tables — essential info only
- **Tablet**: split-panel or 2-column grids, more context visible
- **Desktop**: sidebar navigation, multi-column layouts, full data tables
- progressive disclosure: mobile shows essentials, desktop shows everything

---

## 4. Component Library

### 4.1 Available Components
Use the CSS classes defined in `design-system.css`. Key components include:

| Category | Components |
|----------|------------|
| Navigation | Bottom nav, sidebar, app header |
| Content | Card, stat card, list item, data table |
| Actions | Button (primary/outline/danger), FAB, quick action |
| Forms | Input field, search bar, toggle switch |
| Feedback | Badge (green/amber/red/teal), alert card |
| Layout | Grid helpers, flex utilities, content padding |
| Identity | Avatar, section title, brand header |

### 4.2 Component Usage Rules
- use existing components from the design system — don't invent new patterns for solved problems
- buttons: one primary action per header (gradient), secondary actions use outline style
- badges: always pair color with text label — don't rely on color alone
- tables: desktop only — use card-based layouts on mobile and tablet
- FAB: positioned bottom-right above bottom nav on mobile, lower-right on desktop

---

## 5. Design Principles

1. **Consistency** — every screen uses the same component classes and tokens, no one-off styles
2. **Progressive disclosure** — mobile shows essentials, tablet adds context, desktop shows full data
3. **Whitespace** — use the spacing scale generously, crowded UIs feel unprofessional
4. **Hierarchy** — clear visual priority through size, weight, and color
5. **Feedback** — use semantic colors for status, loading states for async actions
6. **Locale-aware** — currency, date format, phone format, and number format must be configurable per locale, never hardcode symbols or patterns

---

## 6. Dark Theme

- every screen should have a corresponding dark theme variant
- dark theme overrides CSS variables (surfaces become dark, text becomes light, semantic colors get brighter)
- dark variants are created by injecting CSS overrides and adjusting icon colors in SVG data URIs
- dark files are named `{screen}-dark.html`

---

## 7. Accessibility

- all text must meet WCAG AA contrast ratio (4.5:1 body, 3:1 large text)
- touch targets on mobile: minimum 44x44px
- interactive elements must have visible focus states
- never rely on color alone for meaning — always pair with text labels or icons
- support screen readers, keyboard navigation, and high contrast modes

---

## 8. Icons

- all icons use inline `<img>` tags with SVG data URIs — this is the only format Figma's capture engine renders correctly
- icon colors are set via the `fill` attribute inside the SVG data URI
- icon colors must match their context (white on colored backgrounds, semantic colors for status, default text color otherwise)
- standard icon size: 24x24px via `img[alt="icon"]` CSS rule

---

## 9. Flutter Implementation

### 9.1 Token Mapping
Map design system CSS tokens to Flutter constants in dedicated files:

| CSS | Flutter |
|-----|---------|
| Color tokens | `AppColors` — `static const` Color values |
| Spacing tokens | `AppSpacing` — `static const` double values + EdgeInsets shortcuts |
| Typography tokens | `AppTextStyles` — `static const` TextStyle values |
| Radius tokens | `AppRadius` — `static final` BorderRadius values |
| Shadow tokens | `AppShadows` — `static const` BoxShadow lists |
| Size tokens | `AppSizes` — `static const` double values for heights/widths |

### 9.2 Project Structure
```
lib/core/
├── theme/          # AppColors, AppTextStyles, AppSpacing, AppRadius, AppShadows, AppSizes, AppTheme
├── widgets/        # Reusable atomic widgets (AppCard, AppButton, AppBadge, etc.)
├── layout/         # Responsive scaffold, bottom nav, sidebar
└── shortcuts/      # Desktop keyboard shortcut definitions

lib/features/       # Feature-specific screens composed from core widgets
```

### 9.3 Widget Rules
- **atomic widgets** (`core/widgets/`) — stateless, theme-aware, no business logic
- **layout widgets** (`core/layout/`) — responsive wrappers, no screen-specific content
- **feature screens** (`features/`) — compose atomic + layout widgets with feature-specific state
- no inline styles — every visual value comes from `core/theme/` constants
- one widget per file, file name matches class name in snake_case
- every reusable widget accepts `Key? key`, uses only named parameters, and has a const constructor when possible
- never duplicate UI code — extract shared patterns into `core/widgets/`

### 9.4 Responsive Layout
- use `LayoutBuilder` with breakpoint thresholds to switch between mobile/tablet/desktop layouts
- desktop builds must include keyboard shortcuts for primary actions

---

## 10. Internationalization (UI)

- all user-facing text must support internationalization — no hardcoded strings
- layout must support both LTR and RTL rendering
- bidirectional text must be handled correctly in mixed-language content
- directional icons (arrows, progress) must mirror in RTL mode
- numbers, dates, currency, and phone formats must use locale-aware formatting

---

## Key References

- **Design System CSS**: `design-system.css` in the mockups directory
- **Business Features**: `BUSINESS_FEATURES.md` — feature requirements including i18n
- **Agent Rules**: `agents/rules/AGENTS.md`
