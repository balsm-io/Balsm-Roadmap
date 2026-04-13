# Dark Theme

Generate a dark theme variant of an existing HTML mockup.

## Instructions

1. If $ARGUMENTS specifies a mockup file, use that. Otherwise, list HTML files in `figma-cli/mockups/` and ask the user which one to create a dark variant for.
2. Read the original HTML mockup file.
3. Read `agents/rules/UI_DESIGN.md` Section 6 for dark mode guidelines.
4. Read `figma-cli/mockups/design-system.css` to understand the token structure.
5. Create a dark variant by:

### CSS Variable Overrides
Apply dark theme overrides for all design tokens:
- Background colors: dark neutrals (e.g., `#0F1117`, `#1A1D27`, `#242736`)
- Surface colors: slightly lighter dark shades for cards and containers
- Text colors: light text on dark backgrounds with proper contrast ratios
- Border colors: subtle borders visible on dark backgrounds
- Primary colors: adjust for dark backgrounds if needed (may need lighter tint)
- Semantic colors (success, warning, danger, info): adjust background variants for dark context
- Shadows: reduce or adjust for dark mode (shadows less visible on dark backgrounds)

### SVG & Icon Adjustments
- Update SVG `fill` colors to work against dark backgrounds
- Ensure icons remain visible and maintain contrast

### Contrast Requirements
- Maintain WCAG AA contrast ratios (4.5:1 for text, 3:1 for large text and UI components)
- Test that badges, status indicators, and alerts remain distinguishable

### File Structure
- Save as `{original-name}-dark.html` in the same directory
- Keep the same layout and responsive structure — only change color-related styles
- Add a `<style>` block with CSS variable overrides at the top, scoped to prevent affecting the design system base

6. Verify the dark version renders correctly by checking for any remaining light-mode hardcoded colors.
