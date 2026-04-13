# Design Mockup

Generate an HTML mockup for a UI screen using the Balsm design system, ready for Figma capture.

## Instructions

1. Ask the user which screen or component they want to design (if not already specified as $ARGUMENTS).
2. Read the design system CSS at `figma-cli/mockups/design-system.css` to understand available tokens and components.
3. Read `agents/rules/UI_DESIGN.md` for the full design guidelines.
4. Create an HTML mockup file following this structure:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=2800">
  <title>{Screen Name} — Balsm</title>
  <link rel="stylesheet" href="design-system.css">
  <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
  <style>
    /* Page-specific styles only — never redefine design system tokens */
  </style>
</head>
<body>
  <div class="responsive-container">
    <div class="device-frame">
      <div class="frame frame-mobile" style="width: 414px;">
        <!-- Mobile layout: single column, bottom nav, card-based, no tables -->
      </div>
    </div>
    <div class="device-frame">
      <div class="frame frame-tablet" style="width: 768px;">
        <!-- Tablet layout: split panel or 2-column grid, bottom nav -->
      </div>
    </div>
    <div class="device-frame">
      <div class="frame frame-desktop" style="width: 1440px;">
        <!-- Desktop layout: sidebar nav, multi-column, full data tables -->
      </div>
    </div>
  </div>
</body>
</html>
```

5. Design rules to follow:
   - All colors, spacing, font sizes, radii, and shadows from CSS custom properties (tokens) — never raw hex or pixel values
   - Use existing component CSS classes (`.card`, `.btn`, `.badge`, `.stat-card`, `.data-table`, etc.)
   - One primary action per header (gradient button), secondary actions use outline
   - Badges: always pair color with text label — never color alone
   - Tables: desktop only — use cards on mobile/tablet
   - FAB: bottom-right above bottom nav on mobile, lower-right on desktop
   - Progressive disclosure: mobile shows essentials, desktop shows everything
   - Content must be realistic but use synthetic/placeholder data — never real patient info
   - Support RTL layout (use logical properties: `inline-start`/`inline-end`, not `left`/`right`)

6. Save the file to `figma-cli/mockups/{screen-name}.html`.
7. Verify the file is valid HTML and can be opened in a browser.
