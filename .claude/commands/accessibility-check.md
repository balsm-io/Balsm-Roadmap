# Accessibility Check

Review changed UI files for accessibility (a11y) compliance per WCAG guidelines and Balsm design standards.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches UI (HTML mockups, Flutter widgets, or CSS).
3. Analyze for the following:

### Color & Contrast (WCAG AA)
- Text-to-background contrast ratio below 4.5:1 for normal text
- Text-to-background contrast ratio below 3:1 for large text (18px+ or 14px+ bold)
- UI component contrast ratio below 3:1 (buttons, inputs, icons)
- Information conveyed by color alone without text label or icon (badges must pair color with text)
- Status indicators relying solely on color differentiation

### Touch Targets
- Interactive elements smaller than 44x44 CSS pixels (mobile) or 48x48dp (Flutter)
- Touch targets overlapping or too close together (minimum 8px gap)
- Small text links without sufficient clickable area padding

### Keyboard & Focus (Desktop)
- Interactive elements not focusable via keyboard (Tab navigation)
- Missing visible focus indicators on focused elements
- Focus trapped inside a component with no escape
- Keyboard shortcuts not following the Balsm shortcut map (`lib/core/shortcuts/app_shortcuts.dart`)
- Modal dialogs not trapping focus within the dialog while open

### Screen Reader Support
- Images without `alt` text (HTML) or `Semantics` labels (Flutter)
- Form fields without associated labels
- Dynamic content changes not announced to screen readers
- Decorative images not marked as decorative (`alt=""` or `excludeSemantics: true`)
- Missing semantic structure: headings, landmarks, lists
- Data tables without proper header associations

### Flutter-Specific
- Missing `Semantics` widgets on custom interactive components
- Missing `ExcludeSemantics` on purely decorative elements
- `Tooltip` not provided on icon-only buttons
- Custom widgets not supporting `MediaQuery.textScaleFactor` for text scaling
- Insufficient contrast in both light and dark themes

### RTL & Internationalization
- Layout not adapting for RTL languages
- Directional icons not mirrored for RTL
- Text overflow not handled for longer translated strings
- `TextDirection` not respected in custom layouts

### Motion & Animation
- Animations without `MediaQuery.disableAnimations` or `prefers-reduced-motion` respect
- Auto-playing animations without user control to pause/stop
- Flashing content (more than 3 flashes per second)

4. For each issue found, report:
   - File path and line number
   - WCAG criterion violated (e.g., 1.4.3 Contrast, 2.1.1 Keyboard)
   - Severity: HIGH / MEDIUM / LOW
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes accessibility review.
