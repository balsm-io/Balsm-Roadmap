---
description: "P001 UI tasks — Flutter widget + screen implementation. Self-contained: all values, widget trees, copy, and Dart signatures inlined. No external file lookups needed."
---

# P001 Tasks — Flutter UI Track (Cheaper-Model Edition)

> ⚠️ **SUPERSEDED (2026-07-17).** This file is an alternate UI decomposition that was never executed at these paths. Its capability is delivered by the executed BalsmKit T-track (`core/kit/_tokens.dart` = `BalsmColors`, `theme.dart`, `kit/widgets/balsm_*.dart`, `shared_widgets.dart`) + the module screens in `tasks/flutter.md`. Its structure also predates the 2026-07-11 bounded-context amendment: P001 domain modules live under `modules/` (not `packages/`), and `home` was folded into `app/` (app-shell) — the tree below is historical. Do NOT execute UI001–UI054 from this file; UI055 (app-wide `flutter analyze` gate) was met via the T-track. Kept for traceability only.

**Design source**: Derived from `design/MASTER.md` + all `design/pages/*.md` (values inlined below — implementor does NOT need to read those files).

**Flutter project root**: `../balsm_app/` (relative to this file = `balsm_app/` sibling to `Balsm-Core/`).

**Packages structure**:
```
balsm_app/
  packages/
    core/          → shared widgets, theme, kit
    auth/          → auth screens
    disclosure/    → disclosure screen
    home/          → home screen
    profile/       → health profile editor
    emergency_card/→ emergency card + QR
    medications/   → medication management
    deletion/      → account deletion
    sessions/      → active sessions
    account/       → handle claim + settings
    geofence_block/→ country blocking
  app/             → shell + router
```

**Color constants** (use these exact hex values everywhere):
```dart
// Light mode
static const primary    = Color(0xFF1283FF); // blue — CTAs, focus, active nav
static const accent     = Color(0xFF02BBB5); // aqua — secondary CTA, info
static const mint       = Color(0xFF55D77F); // mint — success, dose taken
static const emerald    = Color(0xFF01C4A2); // emerald — eyebrow, brand moments
static const violet     = Color(0xFF724DD0); // violet — controlled meds flag
static const surface    = Color(0xFFFFFFFF); // white — cards, sheets
static const surfaceAlt = Color(0xFFF4F3EC); // cream — screen background
static const border     = Color(0xFFE1E1D9); // dividers, input borders
static const borderFocus= Color(0xFF1283FF); // focus ring (3px solid)
static const fg1        = Color(0xFF2B2B25); // primary text
static const fg2        = Color(0xFF56564C); // secondary text / captions
static const fg3        = Color(0xFF6B6B60); // placeholders, disabled labels
static const danger     = Color(0xFFD44A3C); // errors, delete, missed dose
static const warning    = Color(0xFFE5B428); // low stock, expiring
// Dark mode overrides
static const darkSurface    = Color(0xFF1A1A14);
static const darkSurfaceAlt = Color(0xFF2B2B25);
static const darkBorder     = Color(0xFF3D3D34);
static const darkFg1        = Color(0xFFF6F6F2);
static const darkPrimary    = Color(0xFF5FA0FF);
```

**Spacing** (use as `double` constants):
```dart
const s2 = 8.0;   // --space-2
const s3 = 12.0;  // --space-3
const s4 = 16.0;  // --space-4
const s6 = 24.0;  // --space-6
const s8 = 32.0;  // --space-8
```

**Border radii**: `sm=4, md=8, lg=12, xl=16, full=999`

**Key packages** (already in pubspec): `flutter_riverpod`, `go_router`, `drift`, `dio` (the .NET API client — no `supabase_flutter`), `flutter_local_notifications`, `flutter_secure_storage`, `qr_flutter`, `url_launcher`, `lucide_icons` (or `icons_plus`)

---

## Phase 1: Core Kit Widget Implementations

### 1.1 Theme

- [ ] UI001 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_colors.dart`.
  Define `abstract final class BalsmColors` with all `static const Color` fields listed in the "Color constants" table at the top of this file (primary, accent, mint, emerald, violet, surface, surfaceAlt, border, borderFocus, fg1, fg2, fg3, danger, warning, darkSurface, darkSurfaceAlt, darkBorder, darkFg1, darkPrimary).
  No methods needed — pure constants class.
  Export from `packages/core/lib/core.dart` by adding: `export 'src/kit/balsm_colors.dart';`

- [ ] UI002 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_spacing.dart`.
  Define `abstract final class BalsmSpacing` with:
  ```dart
  static const double s2 = 8.0;
  static const double s3 = 12.0;
  static const double s4 = 16.0;
  static const double s6 = 24.0;
  static const double s8 = 32.0;
  static const double radSm = 4.0;
  static const double radMd = 8.0;
  static const double radLg = 12.0;
  static const double radXl = 16.0;
  static const double radFull = 999.0;
  static const double minTouchTarget = 44.0;
  ```
  Export from `core.dart`.

- [ ] UI003 Create file `../balsm_app/packages/core/lib/src/kit/balsm_theme.dart`.
  Define `class BalsmTheme` with static method `ThemeData light()` and `ThemeData dark()`.
  Light theme:
  - `scaffoldBackgroundColor`: `Color(0xFFF4F3EC)`
  - `colorScheme`: `ColorScheme.light(primary: Color(0xFF1283FF), secondary: Color(0xFF02BBB5), surface: Color(0xFFFFFFFF), error: Color(0xFFD44A3C))`
  - `textTheme`: `TextTheme` with these `TextStyle` values:
    - `displayLarge` → Montserrat, 64px, w800
    - `headlineLarge` → Montserrat, 32px, w700
    - `headlineMedium` → Montserrat, 24px, w700
    - `titleLarge` → Montserrat, 20px, w600
    - `bodyLarge` → IBM Plex Sans, 16px, w400, h=1.65
    - `bodyMedium` → IBM Plex Sans, 14px, w500
    - `bodySmall` → IBM Plex Sans, 12px, w400
    - `labelSmall` → IBM Plex Sans, 12px, w600, letterSpacing=0.16 (eyebrow)
  - `inputDecorationTheme`: border `OutlineInputBorder(radius=8, borderSide Color(0xFFE1E1D9))`, focusedBorder `borderSide Color(0xFF1283FF) width=3`
  - `elevatedButtonTheme`: `ElevatedButtonThemeData` with style: bg=`Color(0xFF1283FF)`, fg=white, radius=8, minSize=`Size(double.infinity, 52)`, textStyle=`bodyMedium`
  Dark theme: same structure with dark-mode color overrides (darkSurface, darkFg1, darkPrimary from BalsmColors).
  Export from `core.dart`.

- [ ] UI004 Create file `../balsm_app/packages/core/lib/src/kit/rtl_helper.dart`.
  Define:
  ```dart
  bool isRtl(BuildContext context) =>
    Directionality.of(context) == TextDirection.rtl;
  
  class RtlWrapper extends StatelessWidget {
    final Widget child;
    final bool forceRtl; // optional override
    const RtlWrapper({required this.child, this.forceRtl = false});
    @override Widget build(BuildContext context) {
      // Read locale from nearest Localizations; if ar-* → RTL
      final locale = Localizations.localeOf(context);
      final rtl = forceRtl || locale.languageCode == 'ar';
      return Directionality(
        textDirection: rtl ? TextDirection.rtl : TextDirection.ltr,
        child: child,
      );
    }
  }
  ```
  Export from `core.dart`.

### 1.2 Navigation

- [ ] UI005 Create file `../balsm_app/packages/core/lib/src/kit/balsm_bottom_nav.dart`.
  Define `class BalsmBottomNav extends StatelessWidget`.
  Constructor: `const BalsmBottomNav({required int currentIndex, required void Function(int) onTap})`.
  Build method:
  - Detect RTL with `isRtl(context)`.
  - Define tabs (always in this logical order): `[(icon: home, label: 'Home'), (icon: shield, label: 'Card'), (icon: pill, label: 'Meds'), (icon: devices, label: 'Sessions'), (icon: settings, label: 'Settings')]`.
  - In RTL: **reverse the display order** but map taps back to logical indices.
  - Use `NavigationBar` widget with `selectedIndex: currentIndex`, `onDestinationSelected: onTap`.
  - `NavigationBarTheme` override: `indicatorColor: Color(0xFF1283FF).withOpacity(0.1)`, selected label+icon color `Color(0xFF1283FF)`, unselected `Color(0xFF56564C)`.
  - Height 56, background `Color(0xFFFFFFFF)`, top border `Border(top: BorderSide(color: Color(0xFFE1E1D9)))`.
  - Each `NavigationDestination` has `semanticLabel` matching label.
  Use icon package: `Icons` from Flutter or Lucide — use `Icons.home`, `Icons.shield`, `Icons.medication`, `Icons.devices`, `Icons.settings` as fallback.
  Export from `core.dart`.

### 1.3 App Bar

- [ ] UI006 Create file `../balsm_app/packages/core/lib/src/kit/balsm_app_bar.dart`.
  Define `class BalsmAppBar extends StatelessWidget implements PreferredSizeWidget`.
  Named constructors:
  ```dart
  // Standard: shows title text + optional trailing widgets
  const BalsmAppBar.standard({required String title, List<Widget>? trailing});
  // Wordmark: shows "Balsm" brand text, no back button
  const BalsmAppBar.wordmark({List<Widget>? trailing});
  // Backable: shows back chevron + title + optional trailing
  const BalsmAppBar.backable({required String title, List<Widget>? trailing});
  ```
  `preferredSize` → `Size.fromHeight(56)`.
  Back button: `IconButton(icon: Icon(isRtl ? Icons.arrow_forward_ios : Icons.arrow_back_ios, size: 20), onPressed: () => Navigator.of(context).maybePop())`.
  Background: `Color(0xFFFFFFFF)`, elevation 0, bottom border `Color(0xFFE1E1D9)`.
  Title style: Montserrat SemiBold 20px `Color(0xFF2B2B25)`.
  All trailing `IconButton` min 44×44pt.
  Export from `core.dart`.

### 1.4 Card

- [ ] UI007 Create file `../balsm_app/packages/core/lib/src/kit/balsm_card.dart`.
  Define `class BalsmCard extends StatelessWidget`.
  Named constructors:
  ```dart
  const BalsmCard({required Widget child, EdgeInsets? padding, VoidCallback? onTap});
  const BalsmCard.accented({required Widget child, required Color accentColor, EdgeInsets? padding, VoidCallback? onTap});
  const BalsmCard.elevated({required Widget child, EdgeInsets? padding, VoidCallback? onTap});
  ```
  Base card: `Container` with `decoration: BoxDecoration(color: Color(0xFFFFFFFF), borderRadius: BorderRadius.circular(12), border: Border.all(color: Color(0xFFE1E1D9)))`. Default padding `EdgeInsets.all(16)`. Wrap in `InkWell` if `onTap` provided.
  `.accented`: adds `border` override — `Border(left: BorderSide(color: accentColor, width: 4))` in LTR, `Border(right: BorderSide(color: accentColor, width: 4))` in RTL (detect with `Directionality.of(context)`). Replace full border with just top+bottom+leading-side.
  `.elevated`: adds `BoxShadow(color: Color(0x1A000000), blurRadius: 8, offset: Offset(0,2))`.
  Wrap all in `Semantics(container: true)`.
  Export from `core.dart`.

### 1.5 Chip

- [ ] UI008 Create file `../balsm_app/packages/core/lib/src/kit/balsm_chip.dart`.
  Define `class BalsmChip extends StatelessWidget`.
  Constructor:
  ```dart
  const BalsmChip({
    required String label,
    bool selected = false,
    VoidCallback? onTap,
    BalsmChipVariant variant = BalsmChipVariant.standard,
    String? semanticLabel,
  });
  enum BalsmChipVariant { standard, severe, moderate, mild }
  ```
  Visual:
  - `standard` unselected: border `Color(0xFFE1E1D9)`, bg transparent, text `Color(0xFF56564C)`.
  - `standard` selected: border `Color(0xFF1283FF)`, bg `Color(0xFF1283FF).withOpacity(0.08)`, text `Color(0xFF1283FF)`.
  - `severe`: bg `Color(0xFFD44A3C).withOpacity(0.1)`, text `Color(0xFFD44A3C)`.
  - `moderate`: bg `Color(0xFFE5B428).withOpacity(0.1)`, text `Color(0xFFE5B428)`.
  - `mild`: bg `Color(0xFFE1E1D9)`, text `Color(0xFF56564C)`.
  Render as `GestureDetector(onTap: onTap, child: Container(...))` with min height 36, horizontal padding 12, radius 999.
  Wrap in `Semantics(label: semanticLabel ?? label, button: onTap != null, selected: selected)`.
  Min touch target: wrap in `ConstrainedBox(constraints: BoxConstraints(minWidth: 44, minHeight: 44))`.
  Export from `core.dart`.

### 1.6 OTP Input

- [ ] UI009 Create file `../balsm_app/packages/core/lib/src/kit/balsm_otp_input.dart`.
  Define `class BalsmOtpInput extends StatefulWidget`.
  Constructor: `const BalsmOtpInput({required void Function(String) onCompleted, bool hasError = false})`.
  State creates 6 `TextEditingController`s + 6 `FocusNode`s.
  Each box: `Container(width: 48, height: 56)` with `BoxDecoration(borderRadius: BorderRadius.circular(8), border: Border.all(color: hasError ? Color(0xFFD44A3C) : Color(0xFFE1E1D9), width: hasError ? 2 : 1))`. Text style: `IBM Plex Mono, 24px, center, Color(0xFF2B2B25)`.
  Boxes always `TextDirection.ltr` regardless of app locale — wrap in `Directionality(textDirection: TextDirection.ltr)`.
  Auto-advance: `onChanged` moves focus to next box on digit entry; on delete empty box, moves to previous.
  Paste: `onChanged` detects paste of 6 chars → distribute across all boxes → call `onCompleted`.
  iOS: `keyboardType: TextInputType.number`, `textInputAction: TextInputAction.next`, `autofillHints: [AutofillHints.oneTimeCode]`.
  Android: same + `autofillHints: [AutofillHints.oneTimeCode]`.
  Error shake animation: `AnimationController(vsync: this, duration: Duration(milliseconds: 400))`. Use `TweenSequence` with 4 oscillations ±4px on X axis. Trigger with public method `shake()` or react to `hasError` change via `didUpdateWidget`.
  On 6 digits complete: call `onCompleted(sixDigitString)`.
  Each box `Semantics(label: 'Digit ${n+1} of 6', textField: true)`.
  On error: `SemanticsService.announce('Code is incorrect. Please try again.', TextDirection.ltr)`.
  Export from `core.dart`.

### 1.7 Countdown Timer

- [ ] UI010 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_countdown_timer.dart`.
  Define `class BalsmCountdownTimer extends StatefulWidget`.
  Constructor: `const BalsmCountdownTimer({required Duration initial, required VoidCallback onExpired})`.
  State: holds `Duration _remaining`. `initState` starts `Timer.periodic(Duration(seconds: 1), ...)` decrementing `_remaining`. When `_remaining <= Duration.zero`: cancel timer, call `onExpired()`.
  Display: format as `'${_remaining.inMinutes.toString().padLeft(2,'0')}:${(_remaining.inSeconds % 60).toString().padLeft(2,'0')}'`. Text style: `IBM Plex Mono, 14px, Color(0xFF6B6B60)`. Always `TextDirection.ltr`.
  Announce via `SemanticsService.announce` only at each full minute change (not every second). Use `aria-live: polite` semantic equivalent: `Semantics(liveRegion: true, child: Text(...))`.
  `dispose()` cancels timer.
  Export from `core.dart`.

### 1.8 Bottom Sheet

- [ ] UI011 Create file `../balsm_app/packages/core/lib/src/kit/balsm_bottom_sheet.dart`.
  Define top-level functions (not a class):
  ```dart
  Future<T?> showBalsmTimePicker<T>(BuildContext context, {TimeOfDay? initial, required void Function(TimeOfDay) onConfirm})
  Future<T?> showBalsmDatePicker<T>(BuildContext context, {DateTime? initial, required void Function(DateTime) onConfirm})
  Future<T?> showBalsmFormSheet<T>(BuildContext context, {required String title, required Widget content, required String saveLabel, required VoidCallback onSave, bool saveEnabled = true})
  ```
  All use `showModalBottomSheet(context, isScrollControlled: true, backgroundColor: transparent, builder: ...)`.
  Sheet container: `Container(decoration: BoxDecoration(color: Color(0xFFFFFFFF), borderRadius: BorderRadius.vertical(top: Radius.circular(16))))`.
  Drag handle: `Container(width: 32, height: 4, decoration: BoxDecoration(color: Color(0xFFE1E1D9), borderRadius: BorderRadius.circular(2)))` centered at top, margin bottom 8.
  `showBalsmTimePicker`: on iOS use `CupertinoTimerPicker`, on Android use `showTimePicker` wrapped to match sheet style.
  `showBalsmDatePicker`: on iOS `CupertinoDatePicker`, on Android `showDatePicker`.
  `showBalsmFormSheet`: title `TextStyle(fontSize: 18, fontWeight: w600, color: Color(0xFF2B2B25))`, save `BalsmButton.primary` at bottom.
  Export from `core.dart`.

### 1.9 List Item

- [ ] UI012 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_list_item.dart`.
  Define `class BalsmListItem extends StatelessWidget`.
  Constructor:
  ```dart
  const BalsmListItem({
    required String title,
    String? subtitle,
    Widget? leading,      // icon or avatar
    Widget? trailing,     // chevron, badge, button
    VoidCallback? onTap,
    String? semanticLabel,
  });
  ```
  Render as `InkWell(onTap: onTap, child: Padding(padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12), child: Row(...)))`.
  Min height 56pt. `leading` in 40×40 container. Title style `bodyLarge` 16px `Color(0xFF2B2B25)`. Subtitle `bodySmall` 12px `Color(0xFF6B6B60)`.
  In RTL (`Directionality.of(context) == TextDirection.rtl`): leading becomes trailing visually (Row reversal via `textDirection`). Chevron icon: `Icons.chevron_right` in LTR, `Icons.chevron_left` in RTL.
  Wrap in `Semantics(label: semanticLabel, button: onTap != null)`.
  Export from `core.dart`.

### 1.10 Privacy Marker

- [ ] UI013 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_privacy_marker.dart`.
  Define `class BalsmPrivacyMarker extends StatelessWidget`.
  No constructor params (text is fixed).
  Render:
  ```
  Semantics(
    label: 'Privacy notice: data stored on this device only',
    child: Row(children: [
      Icon(Icons.lock_outline, size: 14, color: Color(0xFF6B6B60)),
      SizedBox(width: 4),
      Text(
        'On-device only · never sent to Balsm servers',
        style: TextStyle(fontSize: 12, color: Color(0xFF6B6B60)),
      ),
    ])
  )
  ```
  Export from `core.dart`.

### 1.11 Severity Badge

- [ ] UI014 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_severity_badge.dart`.
  Define `enum Severity { severe, moderate, mild }`.
  Define `class BalsmSeverityBadge extends StatelessWidget`.
  Constructor: `const BalsmSeverityBadge(this.severity)`.
  Maps to `BalsmChip` with:
  - `severe` → `BalsmChipVariant.severe`, label `'Severe'`, semanticLabel `'Severity: Severe'`
  - `moderate` → `BalsmChipVariant.moderate`, label `'Moderate'`, semanticLabel `'Severity: Moderate'`
  - `mild` → `BalsmChipVariant.mild`, label `'Mild'`, semanticLabel `'Severity: Mild'`
  Export from `core.dart`.

### 1.12 Dialog

- [ ] UI015 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_dialog.dart`.
  Define top-level functions:
  ```dart
  Future<bool?> showBalsmConfirmDialog(BuildContext context, {
    required String title,
    required String body,
    required String confirmLabel,
    bool isDangerous = false,
  })
  ```
  Uses `showDialog(barrierDismissible: false, builder: ...)`.
  `AlertDialog` with `title: Text(title, style: 18px w600)`, `content: Text(body, style: 16px)`.
  Actions: `TextButton('Cancel', onPressed: () => Navigator.pop(context, false))` + `TextButton(confirmLabel, style: isDangerous → TextStyle(color: Color(0xFFD44A3C)), onPressed: () => Navigator.pop(context, true))`.
  `Semantics` on dialog: `namesRoute: true, scopesRoute: true`.
  Export from `core.dart`.

### 1.13 Button

- [ ] UI016 Create file `../balsm_app/packages/core/lib/src/kit/balsm_button.dart`.
  Define `class BalsmButton extends StatelessWidget`.
  Named constructors:
  ```dart
  const BalsmButton.primary({required String label, required VoidCallback? onPressed, bool isLoading = false});
  const BalsmButton.ghost({required String label, required VoidCallback? onPressed, Widget? leading});
  const BalsmButton.danger({required String label, required VoidCallback? onPressed});
  ```
  Primary: full-width `ElevatedButton`, bg `Color(0xFF1283FF)`, fg white, height 52, radius 8, label style 16px w500. Loading: `CircularProgressIndicator.adaptive(color: white)` replaces label.
  Ghost: `TextButton`, fg `Color(0xFF1283FF)`, no background. With leading: `Row(leading, SizedBox(4), Text)`.
  Danger: same as primary but bg `Color(0xFFD44A3C)`.
  All disabled when `onPressed == null`: opacity 0.5.
  All min height 44pt per a11y.
  Export from `core.dart`.

### 1.14 Error Banner

- [ ] UI017 [P] Create file `../balsm_app/packages/core/lib/src/kit/balsm_error_banner.dart`.
  Define `class BalsmErrorBanner extends StatelessWidget`.
  Constructor: `const BalsmErrorBanner({required String message})`.
  Render: `Container(color: Color(0xFFD44A3C).withOpacity(0.1), padding: EdgeInsets.all(12), child: Row([Icon(Icons.error_outline, color: Color(0xFFD44A3C), size: 16), SizedBox(8), Expanded(Text(message, style: 14px color(0xFFD44A3C)))]))`.
  `Semantics(liveRegion: true, label: message)`.
  Export from `core.dart`.

### 1.15 Barrel update

- [ ] UI018 Update `../balsm_app/packages/core/lib/core.dart` — add exports for all new kit files:
  ```dart
  export 'src/kit/balsm_colors.dart';
  export 'src/kit/balsm_spacing.dart';
  export 'src/kit/balsm_theme.dart';
  export 'src/kit/rtl_helper.dart';
  export 'src/kit/balsm_bottom_nav.dart';
  export 'src/kit/balsm_app_bar.dart';
  export 'src/kit/balsm_card.dart';
  export 'src/kit/balsm_chip.dart';
  export 'src/kit/balsm_otp_input.dart';
  export 'src/kit/balsm_countdown_timer.dart';
  export 'src/kit/balsm_bottom_sheet.dart';
  export 'src/kit/balsm_list_item.dart';
  export 'src/kit/balsm_privacy_marker.dart';
  export 'src/kit/balsm_severity_badge.dart';
  export 'src/kit/balsm_dialog.dart';
  export 'src/kit/balsm_button.dart';
  export 'src/kit/balsm_error_banner.dart';
  ```

---

## Phase 2: Auth Screens (US1)

- [ ] UI019 [P] [US1] Create `../balsm_app/packages/auth/lib/src/presentation/screens/country_picker_screen.dart`.
  Class: `class CountryPickerScreen extends ConsumerWidget`. Route: `auth.countryPicker`.
  Imports: `core` package (BalsmAppBar, BalsmListItem, BalsmButton, BalsmColors), `auth` providers.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.wordmark(),
    body: Column([
      Padding(16, child: TextField(  // search field
        decoration: InputDecoration(
          prefixIcon: Icon(Icons.search, color: Color(0xFF6B6B60)),
          hintText: 'Search countries',  // AR: 'ابحث عن دولة'
          border: OutlineInputBorder(radius=8, color=Color(0xFFE1E1D9)),
        ),
        autofocus: true,
      )),
      Expanded(ListView.builder(
        // items = CountryRegistry entries filtered by search query
        // each: BalsmListItem(
        //   leading: Text(flag_emoji, style: 28px),  // country flag emoji
        //   title: countryName_in_current_locale,
        //   subtitle: '+${phonePrefix}',
        //   trailing: currentCountry == item ? Icon(Icons.check, color: Color(0xFF1283FF)) : null,
        //   onTap: () => context.go('/auth/email', extra: selectedCountry),
        // )
      )),
    ]),
  )
  ```
  Denied countries: filter using `ref.read(deniedCountriesProvider)` — do not show in list.
  Semantics: list `Semantics(label: 'Country list')`, each item `Semantics(label: '$name, $prefix', button: true)`.
  On select: navigate to `EmailSignUpScreen` passing `countryCode`.

- [ ] UI020 [P] [US1] Create `../balsm_app/packages/auth/lib/src/presentation/screens/email_sign_up_screen.dart`.
  Class: `class EmailSignUpScreen extends ConsumerStatefulWidget`. Route: `auth.emailSignUp`.
  State holds: `String _email = ''`, `bool _emailValid = false`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(title: ''),
    body: Padding(horizontal: 24, child: Column([
      SizedBox(height: 32),
      Text('CREATE YOUR ACCOUNT',  // eyebrow
        style: TextStyle(fontSize: 12, fontWeight: w600, letterSpacing: 0.16, color: Color(0xFF01C4A2))),
      SizedBox(height: 8),
      Text('Sign up with your email',  // h1
        style: TextStyle(fontSize: 28, fontWeight: w700, color: Color(0xFF2B2B25))),
      SizedBox(height: 32),
      TextFormField(
        keyboardType: TextInputType.emailAddress,
        textDirection: TextDirection.ltr,  // email always LTR
        autocorrect: false,
        autofillHints: [AutofillHints.email],
        decoration: InputDecoration(label: Text('Email address')),
        onChanged: (v) => setState(() { _email = v; _emailValid = _isValidEmail(v); }),
      ),
      SizedBox(height: 24),
      BalsmButton.primary(
        label: 'Continue',  // AR: 'متابعة'
        onPressed: _emailValid ? () => _sendOtp() : null,
      ),
      SizedBox(height: 16),
      Row([Divider(), Text('or', style: 14px color(0xFF6B6B60)), Divider()]),
      SizedBox(height: 16),
      BalsmButton.ghost(label: 'Continue with Google', leading: Image.asset('assets/google_logo.png', 16), onPressed: _signInWithGoogle),
      SizedBox(height: 8),
      BalsmButton.ghost(label: 'Continue with Apple', leading: Icon(Icons.apple, 16), onPressed: _signInWithApple),
    ])),
  )
  ```
  `_isValidEmail`: regex `r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'`.
  `_sendOtp()`: call `ref.read(signUpProvider.notifier).sendOtp(_email, countryCode)` → navigate to `OtpVerificationScreen`.
  `_signInWithGoogle/Apple`: call provider → on success navigate to `disclosure.onboarding`.

- [ ] UI021 [P] [US1] Create `../balsm_app/packages/auth/lib/src/presentation/screens/otp_verification_screen.dart`.
  Class: `class OtpVerificationScreen extends ConsumerStatefulWidget`. Route: `auth.otpVerification`. Receives `String maskedEmail` via route extras.
  State holds: `bool _hasError = false`, `bool _canResend = false`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(title: ''),
    body: Padding(24, child: Column([
      Text('VERIFY YOUR EMAIL',  // eyebrow, color: Color(0xFF01C4A2)
        style: TextStyle(fontSize: 12, fontWeight: w600, letterSpacing: 0.16)),
      SizedBox(8),
      Text('Enter the 6-digit code sent to $maskedEmail',
        style: TextStyle(fontSize: 22, fontWeight: w700, color: Color(0xFF2B2B25))),
      SizedBox(32),
      BalsmOtpInput(
        hasError: _hasError,
        onCompleted: (code) => _verifyCode(code),
      ),
      SizedBox(16),
      if (_hasError) BalsmErrorBanner(message: 'Code is incorrect. Please try again.'),
      SizedBox(16),
      if (!_canResend)
        BalsmCountdownTimer(
          initial: Duration(seconds: 59),
          onExpired: () => setState(() => _canResend = true),
        ),
      if (_canResend)
        BalsmButton.ghost(
          label: 'Resend code',
          leading: Icon(Icons.refresh, size: 16),
          onPressed: _resendOtp,
        ),
    ])),
  )
  ```
  `_verifyCode(code)`: call `ref.read(verifyOtpProvider.notifier).verify(maskedEmail, code)`. On success → `disclosure.onboarding`. On error: `setState(() => _hasError = true)`. On lockout → navigate `auth.lockout`.
  `_resendOtp()`: calls `ref.read(signUpProvider.notifier).resendOtp()`, resets timer: `setState(() { _canResend = false; _hasError = false; })`.

- [ ] UI022 [P] [US1] Create `../balsm_app/packages/auth/lib/src/presentation/screens/social_sign_in_screen.dart`.
  Class: `class SocialSignInScreen extends ConsumerWidget`. Route: `auth.socialSignIn`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.wordmark(),
    body: Padding(24, child: Column(mainAxisAlignment: center, [
      Text('Sign in', style: 28px w700 Color(0xFF2B2B25)),
      SizedBox(32),
      BalsmButton.ghost(label: 'Continue with Google', onPressed: _signInWithGoogle),
      SizedBox(12),
      BalsmButton.ghost(label: 'Continue with Apple', onPressed: _signInWithApple),
      SizedBox(24),
      TextButton(onPressed: () => context.go('/auth/email'), child: Text('Use email instead')),
    ])),
  )
  ```
  `_signInWithGoogle/Apple`: call provider → on success → `home` if already disclosed, else `disclosure.onboarding`.

- [ ] UI023 [P] [US5] Create `../balsm_app/packages/auth/lib/src/presentation/screens/lockout_screen.dart`.
  Class: `class LockoutScreen extends ConsumerWidget`. Route: `auth.lockout`. Receives `Duration lockedFor` via extras.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    body: Center(child: Padding(24, child: Column(mainAxisAlignment: center, [
      Icon(Icons.lock_outline, size: 64, color: Color(0xFFD44A3C)),
      SizedBox(24),
      Text('Too many attempts',
        style: TextStyle(fontSize: 28, fontWeight: w700, color: Color(0xFF2B2B25)),
        textAlign: TextAlign.center),
      SizedBox(12),
      Text('Please wait before trying again.',
        style: TextStyle(fontSize: 16, color: Color(0xFF56564C)),
        textAlign: TextAlign.center),
      SizedBox(24),
      BalsmCountdownTimer(
        initial: lockedFor,
        onExpired: () => context.go('/auth/country'),
      ),
    ]))),
  )
  ```
  No back button. When timer expires: auto-navigate to `CountryPickerScreen`.
  Timer `Semantics(liveRegion: true)` — announces each minute.

- [ ] UI024 [P] [US1] Create `../balsm_app/packages/auth/lib/src/presentation/screens/geofence_blocked_screen.dart`.
  Class: `class GeofenceBlockedScreen extends ConsumerWidget`. Route: `auth.blocked`. Receives `String countryName` via extras.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    body: Center(child: Padding(24, child: Column(mainAxisAlignment: center, [
      Text('🚫', style: 64px),
      SizedBox(24),
      Text('Not available in $countryName',
        style: 28px w700 Color(0xFF2B2B25), textAlign: center),
      SizedBox(12),
      Text('Balsm is not currently available in your country.',
        style: 16px Color(0xFF56564C), textAlign: center),
      SizedBox(32),
      BalsmButton.ghost(label: 'Go back', onPressed: () => context.go('/auth/country')),
    ]))),
  )
  ```
  No back button. `countryName` displayed in user's locale.

---

## Phase 3: Disclosure (US1)

- [ ] UI025 [US1] Create `../balsm_app/packages/disclosure/lib/src/presentation/screens/consolidated_disclosure_screen.dart`.
  Class: `class ConsolidatedDisclosureScreen extends ConsumerStatefulWidget`. Route: `disclosure.onboarding`.
  Receives `String countryCode` via route extras.
  State holds: `bool _scrolledToBottom = false`, `ScrollController _scrollController`.
  `initState`: add scroll listener; set `_scrolledToBottom = true` when `_scrollController.position.atEdge && _scrollController.position.pixels > 0`.
  Supervisory authority lookup from `countryCode`:
  - `'EG'` → `'Egypt Personal Data Protection Commission (PDPC)'`
  - `'SA'` → `'Saudi Data and AI Authority (SDAIA)'`
  - `'AE'` → `'UAE Data Protection Office'`
  - default → `'relevant data protection authority'`
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.standard(title: 'Privacy & Terms'),
    body: Column([
      Expanded(SingleChildScrollView(
        controller: _scrollController,
        padding: EdgeInsets.all(24),
        child: Column([
          Text('YOUR PRIVACY MATTERS', style: eyebrow Color(0xFF01C4A2)),
          SizedBox(8),
          Text('How we protect your health data',
            style: 24px w700 Color(0xFF2B2B25)),
          SizedBox(24),
          // Disclosure body text (localized from i18n bundle)
          // Must include: supervisory authority name, data retention, user rights
          Text(disclosureBody, style: 16px Color(0xFF2B2B25), height: 1.65),
          SizedBox(8),
          Text('Supervised by: $supervisoryAuthority',
            style: 14px w600 Color(0xFF56564C)),
          SizedBox(32),
        ]),
      )),
      Padding(EdgeInsets.all(24), child: BalsmButton.primary(
        label: 'I Accept',  // AR: 'أوافق'
        // Disabled until scrolled to bottom
        onPressed: _scrolledToBottom ? _accept : null,
      )),
    ]),
  )
  ```
  `_accept()`: call `ref.read(acceptDisclosureProvider.notifier).accept(countryCode)` → navigate `home`.
  When "I Accept" becomes enabled: `SemanticsService.announce('Accept button is now available', TextDirection.ltr)`.

---

## Phase 4: Home (US1)

- [ ] UI026 [P] [US1] Create `../balsm_app/packages/home/lib/src/presentation/screens/home_screen.dart`.
  Class: `class HomeScreen extends ConsumerWidget`. Route: `home`.
  Reads: `ref.watch(accountSummaryProvider)` for display name. `ref.watch(homeNudgesProvider)` for nudge list (returns `List<HomeNudge>` where nudge has `type`, `title`, `subtitle`, `route`).
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.wordmark(trailing: [
      IconButton(icon: Icon(Icons.language), onPressed: () => context.go('/account/language'), tooltip: 'Change language'),
      IconButton(icon: Icon(Icons.notifications_outlined), onPressed: () {}, tooltip: 'Notifications'),
    ]),
    body: ListView(padding: EdgeInsets.all(16), children: [
      // Greeting card
      BalsmCard(padding: EdgeInsets.all(24), child: Column(crossAxisAlignment: start, [
        Text('Welcome back, ${account.displayName}',
          style: 20px w600 Color(0xFF2B2B25)),
        SizedBox(4),
        Text('Your health, your data, your system.',
          style: 16px Color(0xFF56564C)),
      ])),
      SizedBox(16),
      // Nudge cards (only shown if nudge list non-empty)
      ...nudges.map((n) => Padding(
        bottom: 8,
        child: BalsmCard.accented(
          accentColor: _nudgeColor(n.type),  // emergency→Color(0xFF01C4A2), meds→Color(0xFF1283FF), profile→Color(0xFF55D77F)
          child: ListTile(
            leading: Icon(_nudgeIcon(n.type), color: _nudgeColor(n.type)),
            title: Text(n.title, style: 16px w500 Color(0xFF2B2B25)),
            subtitle: Text(n.subtitle, style: 14px Color(0xFF56564C)),
            trailing: Icon(Icons.chevron_right, color: Color(0xFF6B6B60)),
            onTap: () => context.go(n.route),
          ),
        ),
      )),
    ]),
    bottomNavigationBar: BalsmBottomNav(currentIndex: 0, onTap: _onNavTap),
  )
  ```
  `_onNavTap(index)`: `[home, emergency.card, medications.list, sessions.list, account.settings][index]` → `context.go(route)`.
  Semantics: greeting card `Semantics(label: 'Greeting: Welcome back ${account.displayName}')`. Nudge cards `Semantics(label: '${n.title}: ${n.subtitle}', button: true)`.

- [ ] UI027 [P] [US1] Create `../balsm_app/packages/home/lib/src/presentation/screens/home_empty_screen.dart`.
  Class: `class HomeEmptyScreen extends ConsumerWidget`. Used when nudges list is empty AND no data yet.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.wordmark(trailing: [...same as HomeScreen...]),
    body: Center(child: Padding(24, child: Column(mainAxisAlignment: center, [
      // Brand flower illustration placeholder (use Icon or Image.asset)
      Icon(Icons.local_florist, size: 96, color: Color(0xFF6B6B60).withOpacity(0.2)),
      SizedBox(24),
      Text('Welcome to Balsm',  // AR: 'أهلاً بك في بلسم'
        style: 24px w700 Color(0xFF2B2B25), textAlign: center),
      SizedBox(8),
      Text('Start by adding your emergency card or a medication.',
        style: 16px Color(0xFF56564C), textAlign: center),
      SizedBox(32),
      BalsmButton.primary(
        label: 'Add emergency card',
        onPressed: () => context.go('/emergency/card'),
      ),
      SizedBox(12),
      BalsmButton.ghost(
        label: 'Add medication',
        onPressed: () => context.go('/medications/add'),
      ),
    ]))),
    bottomNavigationBar: BalsmBottomNav(currentIndex: 0, onTap: _onNavTap),
  )
  ```

---

## Phase 5: Handle Claim (US1a)

- [ ] UI028 [P] [US1a] Create `../balsm_app/packages/account/lib/src/presentation/screens/handle_claim_screen.dart`.
  Class: `class HandleClaimScreen extends ConsumerStatefulWidget`. Route: `account.handleClaim`.
  State holds: `String _handle = ''`, `String? _errorText`, `bool _isValid = false`, `List<String> _suggestions = []`.
  Validation on change: regex `r'^[a-z0-9_.]{3,30}$'`. If invalid: `_errorText = 'Handle must be 3–30 characters: letters, numbers, _ or .'`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(title: 'Claim your handle'),
    body: Padding(24, child: Column([
      Text('Choose a unique handle that others can use to find your emergency card.',
        style: 16px Color(0xFF56564C)),
      SizedBox(24),
      TextFormField(
        textDirection: TextDirection.ltr,  // handles always LTR
        decoration: InputDecoration(
          labelText: 'Handle',
          prefixText: '@',
          errorText: _errorText,
          hintText: 'e.g. johndoe',
        ),
        onChanged: (v) => _onHandleChanged(v.toLowerCase()),
      ),
      SizedBox(16),
      if (_suggestions.isNotEmpty) ...[
        Text('Suggestions:', style: 14px Color(0xFF6B6B60)),
        SizedBox(8),
        Wrap(spacing: 8, children: _suggestions.map((s) =>
          BalsmChip(label: '@$s', onTap: () => _selectSuggestion(s)),
        ).toList()),
      ],
      Spacer(),
      BalsmButton.primary(
        label: 'Claim handle',  // AR: 'طالب بالاسم'
        onPressed: _isValid ? _claimHandle : null,
      ),
    ])),
  )
  ```
  `_claimHandle()`: call `ref.read(claimHandleProvider.notifier).claim(_handle)`. On 409 conflict: `setState(() => _errorText = 'Handle taken. Try another.')` + `SemanticsService.announce('Handle taken. Try another.', TextDirection.ltr)`. On success: `context.pop()` + show SnackBar `'Handle claimed'`.

---

## Phase 6: Profile Editor (US1a)

- [ ] UI029 [US1a] Create `../balsm_app/packages/profile/lib/src/presentation/screens/health_profile_editor_screen.dart`.
  Class: `class HealthProfileEditorScreen extends ConsumerStatefulWidget`. Route: `profile.editor`.
  State tracks: `bool _isDirty = false` (any field changed).
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(
      title: 'Health profile',
      trailing: [
        TextButton(
          'Save',
          onPressed: _isDirty ? _save : null,
          style: TextStyle(color: _isDirty ? Color(0xFF1283FF) : Color(0xFF6B6B60)),
        ),
      ],
    ),
    body: ListView([
      BalsmPrivacyMarker(),  // pinned at top of list
      SizedBox(16),
      // Section 1: Blood type
      BalsmCard(child: Column([
        _sectionHeader('Blood type', Icons.water_drop_outlined),
        SizedBox(12),
        Wrap(spacing: 8, children: ['A+','A−','B+','B−','AB+','AB−','O+','O−','Unknown'].map((bt) =>
          BalsmChip(
            label: bt,
            selected: _bloodType == bt,
            onTap: () => setState(() { _bloodType = bt; _isDirty = true; }),
          ),
        ).toList()),
      ])),
      SizedBox(12),
      // Section 2: Allergies
      BalsmCard(child: Column([
        _sectionHeader('Allergies', Icons.warning_amber_outlined,
          trailing: allergies.length < 50
            ? TextButton('+ Add', onPressed: _openAllergySheet)
            : Tooltip('Maximum 50 allergies', child: TextButton('+ Add', onPressed: null))
        ),
        if (allergies.isEmpty)
          Text('No known allergies — that\'s fine. Add any if they come up.',
            style: 14px Color(0xFF6B6B60)),
        ...allergies.map((a) => BalsmListItem(
          leading: Icon(Icons.warning_amber, color: Color(0xFFD44A3C)),
          title: a.name,
          trailing: BalsmSeverityBadge(a.severity),
        )),
      ])),
      SizedBox(12),
      // Section 3: Chronic conditions
      BalsmCard(child: Column([
        _sectionHeader('Chronic conditions', Icons.medical_services_outlined,
          trailing: TextButton('+ Add', onPressed: _openConditionSheet)),
        if (conditions.isEmpty)
          Text('No chronic conditions on file.', style: 14px Color(0xFF6B6B60)),
        ...conditions.map((c) => BalsmListItem(
          leading: Icon(Icons.medical_services, color: Color(0xFF1283FF)),
          title: c.name,
          subtitle: '${c.icd10Code} · Since ${c.onsetYear}',
        )),
      ])),
      SizedBox(12),
      // Section 4: Emergency contacts
      BalsmCard(child: Column([
        _sectionHeader('Emergency contacts', Icons.phone_outlined,
          trailing: TextButton('+ Add', onPressed: _openContactSheet)),
        if (contacts.isEmpty)
          Text('Add at least one emergency contact.', style: 14px Color(0xFF56564C)),
        ...contacts.map((c) => BalsmListItem(
          leading: Icon(Icons.person_outline, color: Color(0xFF02BBB5)),
          title: c.name,
          subtitle: Directionality(ltr, child: Text(c.phone, style: IBMPlexMono)),
        )),
      ])),
      SizedBox(24),
    ]),
  )
  ```
  `_sectionHeader(title, icon, {trailing})`: returns `Row([Icon(icon, 20, Color(0xFF56564C)), SizedBox(8), Text(title, 16px w600), Spacer(), trailing])`.
  `_save()`: call `ref.read(updateProfileProvider.notifier).save(profile)` → show `SnackBar('Saved on this device', Color(0xFF55D77F))`. Never show "Saved to cloud".
  Each section has `Semantics(label: '$sectionTitle section')`.
  National-ID field: DO NOT implement (deferred to P002).

- [ ] UI030 [P] [US1a] Create `../balsm_app/packages/profile/lib/src/presentation/widgets/allergy_bottom_sheet.dart`.
  Function: `Future<void> showAllergyBottomSheet(BuildContext context, {required void Function(String name, Severity severity) onAdd})`.
  Calls `showBalsmFormSheet(context, title: 'Add allergy', content: ..., saveLabel: 'Add', onSave: ...)`.
  Content inside sheet:
  - `TextField(label: 'Allergy name', autofocus: true)`
  - `SizedBox(16)`
  - `Text('Severity', 14px w500)`
  - `SizedBox(8)`
  - Severity radio chips row: `Row([BalsmChip(label:'Severe',selected:_sev==severe,...), BalsmChip(label:'Moderate',...), BalsmChip(label:'Mild',...)])` — `role=radiogroup`.
  Save enabled when name non-empty + severity selected.
  On save: call `onAdd(name, severity)`.

- [ ] UI031 [P] [US1a] Create `../balsm_app/packages/profile/lib/src/presentation/widgets/condition_bottom_sheet.dart`.
  Function: `Future<void> showConditionBottomSheet(BuildContext context, {required void Function(String name, String? icd10, int? onsetYear) onAdd})`.
  Content inside sheet:
  - `TextField(label: 'Condition name', autofocus: true)`
  - `SizedBox(12)`
  - `TextField(label: 'ICD-10 code (optional)', hint: 'e.g. E11.9')`
  - `SizedBox(12)`
  - `TextField(label: 'Year of onset (optional)', keyboardType: numberPad, inputFormatters: [LengthLimitingTextInputFormatter(4)])`
  Save enabled when name non-empty.

- [ ] UI032 [P] [US1a] Create `../balsm_app/packages/profile/lib/src/presentation/widgets/contact_bottom_sheet.dart`.
  Function: `Future<void> showContactBottomSheet(BuildContext context, {required String countryCode, required void Function(String name, String relationship, String phone) onAdd})`.
  Content inside sheet:
  - `TextField(label: 'Full name')`
  - `SizedBox(12)`
  - `TextField(label: 'Relationship', hint: 'e.g. Spouse, Parent')`
  - `SizedBox(12)`
  - `TextField(label: 'Phone number', keyboardType: phone, textDirection: ltr)` — validate E.164 format for `countryCode` using `libphonenumber_plugin` or simple regex `r'^\+[1-9]\d{7,14}$'`.
  Save enabled when name + phone valid.

---

## Phase 7: Emergency Card (US2)

- [ ] UI033 [P] [US2] Create `../balsm_app/packages/emergency_card/lib/src/presentation/screens/emergency_card_screen.dart`.
  Class: `class EmergencyCardScreen extends ConsumerWidget`. Route: `emergency.card`.
  Reads: `ref.watch(healthProfileProvider)`, `ref.watch(emergencyQrTokenProvider)`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.standard('Emergency Card', trailing: [
      IconButton(icon: Icon(Icons.edit_outlined), tooltip: 'Edit profile',
        onPressed: () => context.push('/profile/editor')),
    ]),
    body: ListView(padding: EdgeInsets.all(16), children: [
      // Blood type card
      BalsmCard.accented(accentColor: Color(0xFF01C4A2), child: Column(crossAxisAlignment: center, [
        Text('BLOOD TYPE', style: TextStyle(fontSize: 12, fontWeight: w600, letterSpacing: 0.16, color: Color(0xFF01C4A2))),
        SizedBox(8),
        Directionality(ltr, child: Text(
          profile.bloodType ?? '—',
          style: TextStyle(fontFamily: 'IBMPlexMono', fontSize: 48, fontWeight: w700, color: Color(0xFF2B2B25)),
        )),
      ])),
      SizedBox(16),
      // Allergies section
      BalsmCard(child: Column([
        _sectionRow('Allergies', Icons.warning_amber_outlined, Color(0xFFD44A3C)),
        if (profile.allergies.isEmpty)
          _emptyState('No allergies recorded.', onTap: () => context.push('/profile/editor')),
        ...profile.allergies.map((a) => BalsmListItem(
          leading: Icon(Icons.warning_amber, 20, Color(0xFFD44A3C)),
          title: a.name,
          trailing: BalsmSeverityBadge(a.severity),
          semanticLabel: '${a.name}, severity: ${a.severity.name}',
        )),
      ])),
      SizedBox(12),
      // Conditions section
      BalsmCard(child: Column([
        _sectionRow('Chronic conditions', Icons.medical_services_outlined, Color(0xFF1283FF)),
        if (profile.conditions.isEmpty) _emptyState('No chronic conditions on file.'),
        ...profile.conditions.map((c) => BalsmListItem(
          leading: Icon(Icons.medical_services, 20, Color(0xFF1283FF)),
          title: c.name,
          subtitle: c.icd10Code,
        )),
      ])),
      SizedBox(12),
      // Emergency contacts section
      BalsmCard(child: Column([
        _sectionRow('Emergency contacts', Icons.phone_outlined, Color(0xFF02BBB5)),
        if (profile.contacts.isEmpty) _emptyState('Add at least one contact.'),
        ...profile.contacts.map((c) => BalsmListItem(
          leading: Icon(Icons.person_outline, 20, Color(0xFF02BBB5)),
          title: c.name,
          subtitle: c.relationship,
          trailing: Directionality(ltr, child: Text(c.phone, style: IBMPlexMono 14px)),
        )),
      ])),
      SizedBox(80),  // space for pinned button
    ]),
    bottomNavigationBar: Padding(16, child: BalsmButton.primary(
      label: 'Generate QR',  // AR: 'إنشاء رمز QR'
      // Enabled only when: bloodType != null && contacts.length >= 1
      onPressed: (profile.bloodType != null && profile.contacts.isNotEmpty)
        ? () => context.push('/emergency/qr')
        : null,
    )),
  )
  ```
  `_sectionRow(title, icon, color)`: `Row([Icon(icon,20,color), SizedBox(8), Text(title,16px w600), Spacer()])`.
  `_emptyState(text, {onTap})`: `Text(text, 14px Color(0xFF6B6B60))` + optional ghost TextButton 'Add'.
  If QR button disabled: `Semantics(label: 'Generate QR — add blood type and at least one contact to enable')`.
  RTL: `BalsmCard.accented` flips border side automatically (handled by BalsmCard). All icons flip via `BalsmListItem`.

- [ ] UI034 [P] [US2] Create `../balsm_app/packages/emergency_card/lib/src/presentation/screens/qr_code_display_screen.dart`.
  Class: `class QrCodeDisplayScreen extends ConsumerStatefulWidget`. Route: `emergency.qrDisplay`.
  Reads: `ref.watch(emergencyQrTokenProvider)`.
  State holds: `int _selectedTtlIndex = 0` (TTLs: `[1h, 4h, 12h, 24h, 7d]` → `[3600, 14400, 43200, 86400, 604800]` seconds).
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(title: 'Emergency QR'),
    body: Padding(24, child: Column([
      // TTL selector
      Text('Valid for:', style: 14px Color(0xFF56564C)),
      SizedBox(8),
      Semantics(label: 'Token duration', child: Row(
        children: ['1h','4h','12h','24h','7d'].mapIndexed((i, label) =>
          Padding(right: 8, child: BalsmChip(
            label: label,
            selected: _selectedTtlIndex == i,
            onTap: () => setState(() => _selectedTtlIndex = i),
          )),
        ).toList(),
      )),
      SizedBox(24),
      // QR code or loading/expired state
      if (token != null && !token.isExpired)
        Center(child: QrImageView(
          data: 'https://${baseUrl}/emergency/${token.jti}#k=${token.clientKey}',
          size: 256,
          backgroundColor: Colors.white,
        )),
      if (token == null || token.isExpired)
        Column(center, [
          Icon(Icons.qr_code_scanner, 96, Color(0xFF6B6B60).withOpacity(0.3)),
          SizedBox(16),
          Text('QR code expired', 16px Color(0xFF56564C)),
          SizedBox(12),
          BalsmButton.ghost(label: 'Generate new', onPressed: _mintToken),
        ]),
      SizedBox(16),
      if (token != null && !token.isExpired) ...[
        Semantics(liveRegion: true, child: BalsmCountdownTimer(
          initial: token.expiresAt.difference(DateTime.now()),
          onExpired: () => ref.invalidate(emergencyQrTokenProvider),
        )),
        SizedBox(16),
        BalsmButton.ghost(
          label: 'Revoke QR',
          onPressed: () async {
            final confirmed = await showBalsmConfirmDialog(context,
              title: 'Revoke QR?',
              body: 'The QR code will immediately stop working.',
              confirmLabel: 'Revoke',
              isDangerous: true,
            );
            if (confirmed == true) ref.read(revokeQrProvider.notifier).revoke(token.jti);
          },
        ),
      ],
    ])),
  )
  ```
  `_mintToken()`: call `ref.read(mintQrProvider.notifier).mint(ttlSeconds: _ttlValues[_selectedTtlIndex])`.
  `baseUrl` from `FlavorConfig.current.apiBaseUrl` domain.

- [ ] UI035 [P] [US2] Create `../balsm_app/packages/emergency_card/lib/src/presentation/screens/public_emergency_resolve_screen.dart`.
  Class: `class PublicEmergencyResolveScreen extends ConsumerWidget`. Route: `/emergency/:token`. No auth required.
  Receives: `String tokenJti` from route param. Fragment key (`#k=...`) extracted via `dart:html` on web: `window.location.hash.replaceFirst('#k=', '')`. On mobile: passed via extras from `DeeplinkRouter`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: AppBar(title: Text('Emergency Medical Info'), backgroundColor: Color(0xFFD44A3C), foregroundColor: white),
    body: Consumer(builder: (context, ref, _) {
      final state = ref.watch(resolveEmergencyProvider(tokenJti));
      return state.when(
        loading: () => Center(CircularProgressIndicator()),
        error: (e, _) => Center(Column([
          Icon(Icons.error_outline, 48, Color(0xFFD44A3C)),
          SizedBox(16),
          Text(e.isExpired ? 'This QR code has expired.' : 'Unable to load — network error.',
            16px center Color(0xFF56564C)),
        ])),
        data: (card) => ListView(padding: EdgeInsets.all(24), children: [
          // Blood type (large, centered)
          Center(child: Column([
            Text('BLOOD TYPE', eyebrow Color(0xFF01C4A2)),
            SizedBox(8),
            Directionality(ltr, child: Text(card.bloodType, 64px IBMPlexMono w700 Color(0xFF2B2B25))),
          ])),
          SizedBox(24),
          // Allergies
          if (card.allergies.isNotEmpty) ...[
            Text('Allergies', 18px w600),
            ...card.allergies.map((a) => ListTile(leading: Icon(Icons.warning, Color(0xFFD44A3C)), title: Text(a.name), trailing: BalsmSeverityBadge(a.severity))),
          ],
          // Conditions
          if (card.conditions.isNotEmpty) ...[
            Text('Conditions', 18px w600),
            ...card.conditions.map((c) => ListTile(leading: Icon(Icons.medical_services, Color(0xFF1283FF)), title: Text(c.name))),
          ],
          // Contacts with tap-to-call
          if (card.contacts.isNotEmpty) ...[
            Text('Emergency Contacts', 18px w600),
            ...card.contacts.map((c) => ListTile(
              leading: Icon(Icons.phone, Color(0xFF02BBB5)),
              title: Text(c.name),
              subtitle: Directionality(ltr, child: Text(c.phone)),
              onTap: () => launchUrl(Uri.parse('tel:${c.phone}')),
            )),
          ],
        ]),
      );
    }),
  )
  ```
  RTL: apply `RtlWrapper` using `card.preferredLanguage` to determine direction.
  AES-256-GCM decryption: `resolveEmergencyProvider` uses fragment key to decrypt ciphertext from Edge Function response.

---

## Phase 8: Medications (US3)

- [ ] UI036 [P] [US3] Create `../balsm_app/packages/medications/lib/src/presentation/screens/medication_list_screen.dart`.
  Class: `class MedicationListScreen extends ConsumerWidget`. Route: `medications.list`.
  Reads: `ref.watch(medicationsProvider)` → `AsyncValue<List<Medication>>`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.standard('Medications'),
    body: medications.when(
      loading: () => Center(CircularProgressIndicator()),
      error: (e,_) => Center(BalsmErrorBanner(message: 'Failed to load medications')),
      data: (meds) => meds.isEmpty
        ? Center(Column([
            Icon(Icons.medication, 64, Color(0xFF6B6B60).withOpacity(0.3)),
            SizedBox(16),
            Text('No medications added.', 18px w600 Color(0xFF2B2B25)),
            SizedBox(8),
            Text('Tap + to add one.', 16px Color(0xFF56564C)),
          ]))
        : ListView.separated(
            padding: EdgeInsets.all(16),
            separatorBuilder: (_, __) => SizedBox(8),
            itemBuilder: (_, i) {
              final m = meds[i];
              return BalsmListItem(
                leading: Icon(Icons.medication,
                  color: m.isControlled ? Color(0xFF724DD0) : Color(0xFF1283FF)),
                title: m.name,
                subtitle: 'Next: ${m.nextDoseTime}',  // mono time
                trailing: m.hasMissedDose
                  ? BalsmChip(label: 'Missed', variant: BalsmChipVariant.severe)
                  : null,
                semanticLabel: '${m.name}, next dose ${m.nextDoseTime}${m.isControlled ? ', controlled medication' : ''}',
                onTap: () => context.push('/medications/${m.id}'),
              );
            },
            itemCount: meds.length,
          ),
    ),
    floatingActionButton: FloatingActionButton(
      backgroundColor: Color(0xFF1283FF),
      onPressed: () => context.push('/medications/add'),
      child: Icon(Icons.add, color: Colors.white),
      // RTL: floatingActionButtonLocation = isRtl ? StartFloat : EndFloat
    ),
    floatingActionButtonLocation: isRtl(context)
      ? FloatingActionButtonLocation.startFloat
      : FloatingActionButtonLocation.endFloat,
    bottomNavigationBar: BalsmBottomNav(currentIndex: 2, onTap: _onNavTap),
  )
  ```

- [ ] UI037 [P] [US3] Create `../balsm_app/packages/medications/lib/src/presentation/screens/add_medication_screen.dart`.
  Class: `class AddMedicationScreen extends ConsumerStatefulWidget`. Route: `medications.add`.
  State: `_name`, `_dose`, `_scheduleType` (`daily`/`weekly`/`custom`), `_times` (list), `_weekdays` (list), `_startDate`, `_endDate`, `_notes`, `_isControlled`, `_isDirty`.
  Save enabled: `_name.isNotEmpty && _dose.isNotEmpty && _times.isNotEmpty`.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.backable('Add Medication', trailing: [
      TextButton('Save', onPressed: _canSave ? _save : null),
    ]),
    body: SingleChildScrollView(padding: EdgeInsets.all(16), child: Column([
      // 1. Name
      TextField(label: 'Medication name', autofocus: true, onChanged: (v) => setState(()=>_name=v)),
      SizedBox(16),
      // 2. Dose
      TextField(
        label: 'Dose',
        hint: 'e.g., 500 mg, 1 tablet, 5 ml',
        textDirection: ltr,  // mono for dose
        onChanged: (v) => setState(()=>_dose=v),
      ),
      SizedBox(16),
      // 3. Schedule type
      Text('Schedule', 16px w500),
      SizedBox(8),
      Semantics(label: 'Schedule type', child: Row([
        BalsmChip(label:'Daily', selected:_scheduleType=='daily', onTap: ()=>_setType('daily')),
        SizedBox(8),
        BalsmChip(label:'Weekly', selected:_scheduleType=='weekly', onTap: ()=>_setType('weekly')),
        SizedBox(8),
        BalsmChip(label:'Custom', selected:_scheduleType=='custom', onTap: ()=>_setType('custom')),
      ])),
      SizedBox(12),
      // Daily: time picker chips
      if (_scheduleType == 'daily') _buildTimeChips(),
      // Weekly: 7 weekday chips + time
      if (_scheduleType == 'weekly') _buildWeekdayPicker(),
      // Custom: interval + time
      if (_scheduleType == 'custom') _buildCustomSchedule(),
      SizedBox(16),
      // 4. Start date
      ListTile(
        leading: Icon(Icons.calendar_today),
        title: Text('Start date'),
        trailing: Text(_startDate.toString().substring(0,10), style: IBMPlexMono),
        onTap: () => showBalsmDatePicker(context, initial: _startDate, onConfirm: (d) => setState(()=>_startDate=d)),
      ),
      // 5. End date
      SwitchListTile(
        title: Text('No end date'),
        value: _noEndDate,
        onChanged: (v) => setState(()=>_noEndDate=v),
      ),
      if (!_noEndDate) ListTile(
        leading: Icon(Icons.event),
        title: Text('End date'),
        trailing: Text(_endDate?.toString().substring(0,10) ?? 'Pick date', style: IBMPlexMono),
        onTap: () => showBalsmDatePicker(context, onConfirm: (d) => setState(()=>_endDate=d)),
      ),
      SizedBox(16),
      // 6. Notes
      TextField(label: 'Notes (optional)', maxLines: 3, onChanged: (v) => setState(()=>_notes=v)),
      SizedBox(16),
      // 7. Controlled toggle
      SwitchListTile(
        value: _isControlled,
        onChanged: (v) => setState(()=>_isControlled=v),
        title: Text('Schedule II/III medication'),
        activeColor: Color(0xFF724DD0),
      ),
      SizedBox(24),
      BalsmButton.primary(label: 'Save medication', onPressed: _canSave ? _save : null),
    ])),
  )
  ```
  `_buildTimeChips()`: shows added times as chips + `[+ Add time]` chip. Tap existing: remove. Tap add: `showBalsmTimePicker`.
  `_buildWeekdayPicker()`: 7 `BalsmChip`s (Mon–Sun) multi-select + one time picker.
  `_buildCustomSchedule()`: `TextField(keyboardType: number, label: 'Every N hours')` + time picker.
  `_save()`: call `ref.read(addMedicationProvider.notifier).add(medication)` → `context.pop()`.

- [ ] UI038 [P] [US3] Create `../balsm_app/packages/medications/lib/src/presentation/screens/today_screen.dart`.
  Class: `class TodayScreen extends ConsumerWidget`. Route: `medications.today`.
  Reads: `ref.watch(todayDosesProvider)` → doses grouped by time slot (morning/afternoon/evening/night). `ref.watch(missedDosesProvider)` → count.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.standard('Today'),
    body: Column([
      // Missed dose banner
      if (missedCount > 0)
        Semantics(liveRegion: true, child: Container(
          color: Color(0xFFD44A3C).withOpacity(0.1),
          padding: EdgeInsets.all(12),
          child: Text('$missedCount missed dose${missedCount>1?'s':''}',
            style: 14px w500 Color(0xFFD44A3C)),
        )),
      // Time zone shift banner (if detected)
      if (tzShiftDetected)
        GestureDetector(
          onTap: _showTzShiftModal,
          child: Container(color: Color(0xFFE5B428).withOpacity(0.1),
            child: Text('Timezone changed — tap to update schedule', 14px Color(0xFFE5B428))),
        ),
      Expanded(ListView(children: [
        ...timeSlots.map((slot) => Column([
          Padding(EdgeInsets.symmetric(horizontal:16, vertical:8),
            child: Text(slot.label, style: 12px w600 Color(0xFF6B6B60))),
          ...slot.doses.map((dose) => Card(margin: EdgeInsets.symmetric(horizontal:16,vertical:4),
            child: ListTile(
              leading: Icon(Icons.medication,
                color: dose.isMissed ? Color(0xFFD44A3C) : Color(0xFF1283FF)),
              title: Text(dose.medicationName, 16px w500),
              subtitle: Directionality(ltr, child: Text(dose.scheduledTime, IBMPlexMono 14px Color(0xFF6B6B60))),
              trailing: Row(mainAxisSize: min, children: [
                if (!dose.hasOutcome) BalsmButton.primary(label:'Taken', onPressed: ()=>_markTaken(dose)),
                if (!dose.hasOutcome) SizedBox(4),
                if (!dose.hasOutcome) BalsmButton.ghost(label:'Skip', onPressed: ()=>_skipDose(dose)),
                if (dose.hasOutcome) BalsmChip(
                  label: dose.outcome,
                  variant: dose.outcome=='missed' ? severe : dose.outcome=='taken' ? BalsmChipVariant.standard : BalsmChipVariant.mild,
                  selected: dose.outcome=='taken',
                ),
              ]),
            ),
          )),
        ])),
      ])),
    ]),
    bottomNavigationBar: BalsmBottomNav(currentIndex: 2, onTap: _onNavTap),
  )
  ```
  `_markTaken(dose)`: call `ref.read(recordDoseProvider.notifier).record(dose.id, 'taken')`. On success: `SemanticsService.announce('Marked as taken', TextDirection.ltr)`.
  `_skipDose(dose)`: same with `'skipped'`.

- [ ] UI039 [P] [US3] Create `../balsm_app/packages/medications/lib/src/presentation/screens/dose_history_screen.dart`.
  Class: `class DoseHistoryScreen extends ConsumerWidget`. Route: `medications.history`. Receives `String medicationId`.
  Reads: `ref.watch(doseHistoryProvider(medicationId))` → `List<DoseEvent>` grouped by date.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.backable('Dose History'),
    body: ListView.builder(
      itemCount: groupedDays.length,
      itemBuilder: (_, i) {
        final day = groupedDays[i];
        return Column([
          Padding(h:16,v:8, child: Text(day.dateLabel, 12px w600 Color(0xFF6B6B60))),
          ...day.events.map((e) => ListTile(
            leading: BalsmChip(
              label: e.outcome,
              variant: _outcomeVariant(e.outcome),
              // taken→selected, missed→severe, skipped→mild, correction→standard
            ),
            title: Directionality(ltr, child: Text(e.timeLabel, IBMPlexMono 14px)),
            subtitle: e.notes != null ? Text(e.notes!, 12px Color(0xFF6B6B60)) : null,
            trailing: e.isCorrection ? Tooltip('Correction', child: Icon(Icons.edit, 16, Color(0xFF6B6B60))) : null,
          )),
        ]);
      },
    ),
  )
  ```
  No delete/edit buttons shown. Correction events show icon only (append-only).

- [ ] UI040 [P] [US3] Create `../balsm_app/packages/medications/lib/src/presentation/widgets/timezone_shift_modal.dart`.
  Function: `Future<void> showTimezoneShiftModal(BuildContext context, {required String oldTz, required String newTz, required VoidCallback onUpdate, required VoidCallback onKeep})`.
  Uses `showModalBottomSheet(isDismissible: false, ...)`.
  Content:
  ```
  Column([
    DragHandle(),
    Text('Timezone changed', 18px w600),
    SizedBox(16),
    Row(mainAxisAlignment: spaceEvenly, [
      Column([Text('Old', 12px Color(0xFF6B6B60)), Text(oldTz, 14px IBMPlexMono w500)]),
      Icon(Icons.arrow_forward, Color(0xFF6B6B60)),
      Column([Text('New', 12px Color(0xFF6B6B60)), Text(newTz, 14px IBMPlexMono w500)]),
    ]),
    SizedBox(24),
    BalsmButton.primary(label: 'Update schedule', onPressed: () { Navigator.pop(context); onUpdate(); }),
    SizedBox(8),
    BalsmButton.ghost(label: 'Keep old times', onPressed: () { Navigator.pop(context); onKeep(); }),
  ])
  ```
  Not dismissible on barrier tap. Back button = keep old times.

---

## Phase 9: Deletion (US4)

- [ ] UI041 [P] [US4] Create `../balsm_app/packages/deletion/lib/src/presentation/screens/delete_account_screen.dart`.
  Class: `class DeleteAccountScreen extends ConsumerWidget`. Route: `deletion.request`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable('Delete Account'),
    body: ListView(padding: EdgeInsets.all(16), children: [
      // Retained data card
      BalsmCard(child: Column([
        Row([Icon(Icons.history, Color(0xFF56564C)), SizedBox(8), Text('Retained for 30 days', 16px w600)]),
        SizedBox(8),
        _dataFateItem('Your username / handle'),
      ])),
      SizedBox(12),
      // Deleted data card
      BalsmCard(child: Column([
        Row([Icon(Icons.delete_outline, Color(0xFFE5B428)), SizedBox(8), Text('Deleted after 30 days', 16px w600)]),
        SizedBox(8),
        _dataFateItem('Health profile (allergies, conditions, blood type)'),
        _dataFateItem('Medication records and dose history'),
        _dataFateItem('Emergency card snapshots'),
      ])),
      SizedBox(12),
      // Wiped immediately card
      BalsmCard(child: Column([
        Row([Icon(Icons.delete_forever, Color(0xFFD44A3C)), SizedBox(8), Text('Wiped immediately', 16px w600 Color(0xFFD44A3C))]),
        SizedBox(8),
        _dataFateItem('All active sessions and tokens'),
        _dataFateItem('Encryption keys on this device'),
      ])),
      SizedBox(48),  // spatial separation from danger CTA
      Semantics(label: 'Warning: this will begin account deletion',
        child: BalsmButton.danger(
          label: 'Delete my account',
          onPressed: () => context.push('/deletion/confirm'),
        )),
      SizedBox(12),
      Center(child: TextButton('Cancel', onPressed: () => context.pop())),
    ]),
  )
  ```
  `_dataFateItem(text)`: `Padding(v:4, child: Row([Icon(Icons.circle, 6, Color(0xFF56564C)), SizedBox(8), Text(text, 14px Color(0xFF56564C))]))`.

- [ ] UI042 [P] [US4] Create `../balsm_app/packages/deletion/lib/src/presentation/screens/deletion_confirm_screen.dart`.
  Class: `class DeletionConfirmScreen extends ConsumerStatefulWidget`. Route: `deletion.confirm`.
  State: `bool _reAuthDone = false`, `String _confirmText = ''`.
  Save enabled: `_reAuthDone && _confirmText == 'DELETE'`.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.backable('Confirm Deletion'),
    body: Padding(24, child: Column([
      Text('Re-authenticate to continue', 18px w600),
      SizedBox(16),
      // Re-auth buttons (reuse auth components)
      BalsmButton.ghost(label: 'Verify with email OTP', onPressed: _reAuthEmail),
      SizedBox(8),
      BalsmButton.ghost(label: 'Verify with Google', onPressed: _reAuthGoogle),
      SizedBox(8),
      BalsmButton.ghost(label: 'Verify with Apple', onPressed: _reAuthApple),
      if (_reAuthDone) ...[
        SizedBox(24),
        Divider(),
        SizedBox(24),
        Text('Type DELETE to confirm', 16px w500),
        SizedBox(8),
        TextField(
          textDirection: ltr,
          decoration: InputDecoration(hintText: 'DELETE', labelText: 'Confirmation'),
          onChanged: (v) => setState(() => _confirmText = v),
        ),
        SizedBox(8),
        Text('This action cannot be undone.', 14px Color(0xFFD44A3C)),
      ],
      Spacer(),
      BalsmButton.danger(
        label: 'Delete my account',
        onPressed: (_reAuthDone && _confirmText == 'DELETE') ? _submitDeletion : null,
      ),
    ])),
  )
  ```
  `_submitDeletion()`: call `ref.read(requestDeletionProvider.notifier).request()` → navigate to `home` (account now in deletion-requested state).
  Typed confirmation field: `aria-required=true`, exact case-sensitive match.

- [ ] UI043 [P] [US4] Create `../balsm_app/packages/deletion/lib/src/presentation/screens/deletion_cancelled_screen.dart`.
  Class: `class DeletionCancelledScreen extends ConsumerWidget`. Route: `deletion.cancelled`.
  Reads: `ref.watch(deletionStateProvider)` → `gracePeriodEndsAt`.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.standard('Deletion Cancelled'),
    body: Center(child: Padding(24, child: Column(mainAxisAlignment: center, [
      Icon(Icons.check_circle_outline, 64, Color(0xFF55D77F)),
      SizedBox(24),
      Text('Your account will not be deleted', 24px w700 Color(0xFF2B2B25), textAlign: center),
      SizedBox(12),
      Text('You still have ${graceDays} days in your grace period.',
        16px Color(0xFF56564C), textAlign: center),
      SizedBox(8),
      Semantics(liveRegion: true,
        child: Text('Grace period ends: ${gracePeriodEndsAt}', 14px IBMPlexMono Color(0xFF6B6B60))),
      SizedBox(32),
      BalsmButton.primary(label: 'Cancel deletion', onPressed: _cancelDeletion),
    ]))),
  )
  ```
  `_cancelDeletion()`: call `ref.read(cancelDeletionProvider.notifier).cancel()` → navigate to `home`.

- [ ] UI044 [P] [US4] Create `../balsm_app/packages/deletion/lib/src/presentation/screens/public_delete_screen.dart`.
  Class: `class PublicDeleteScreen extends ConsumerStatefulWidget`. Route: `/account/delete`. No auth required on mount.
  Reuses auth components (email OTP / Google / Apple) → on re-auth shows deletion preconfirm → on confirm calls deletion API.
  Header (web chrome): `AppBar(title: Row([Image.asset('assets/balsm_logo.png', 24), SizedBox(8), Text('Balsm')]), backgroundColor: white)`.
  Body: same content as `DeleteAccountScreen` but preceded by re-auth step.
  After re-auth: show data fate cards + danger CTA → call `RequestDeletionUseCase` → show done state ("Your account deletion has been requested").

---

## Phase 10: Sessions (US4/US5)

- [ ] UI045 [P] [US4] Create `../balsm_app/packages/sessions/lib/src/presentation/screens/sessions_screen.dart`.
  Class: `class SessionsScreen extends ConsumerWidget`. Route: `sessions.list`.
  Reads: `ref.watch(activeSessionsProvider)` → `List<ActiveSession>` where first item is current device.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.standard('Active Sessions'),
    body: ListView(padding: EdgeInsets.all(16), children: [
      // Current session card
      Semantics(currentSemanticEvent: SemanticsEvent, child: BalsmCard(
        decoration: BoxDecoration(
          border: Border.all(color: Color(0xFF1283FF), width: 2),
          borderRadius: BorderRadius.circular(12),
          color: Color(0xFF1283FF).withOpacity(0.04),
        ),
        child: Column(crossAxisAlignment: start, [
          Text('CURRENT DEVICE', style: eyebrow Color(0xFF1283FF)),
          SizedBox(8),
          Row([
            Icon(_deviceIcon(sessions.first.deviceType), 24, Color(0xFF2B2B25)),
            SizedBox(8),
            Text(sessions.first.deviceLabel, 16px w500),
          ]),
          SizedBox(4),
          Text('Active now', style: TextStyle(fontFamily: 'IBMPlexMono', fontSize: 14, color: Color(0xFF55D77F))),
        ]),
      )),
      SizedBox(16),
      // Other sessions
      ...sessions.skip(1).map((s) => Padding(
        bottom: 8,
        child: BalsmCard(child: ListTile(
          leading: Icon(_deviceIcon(s.deviceType), 28, Color(0xFF56564C)),
          title: Text(s.deviceLabel.isNotEmpty ? s.deviceLabel : 'Unknown ${s.deviceType}', 16px w500),
          subtitle: Text(
            '${s.deviceType} · ${_relativeTime(s.lastActivityAt)}',
            style: TextStyle(fontFamily: 'IBMPlexMono', fontSize: 12, color: Color(0xFF6B6B60)),
          ),
          trailing: IconButton(
            icon: Icon(Icons.logout, Color(0xFF56564C)),
            tooltip: 'Sign out of ${s.deviceLabel}',
            onPressed: () async {
              final ok = await showBalsmConfirmDialog(context,
                title: 'Sign out?',
                body: 'Sign out of "${s.deviceLabel}"?',
                confirmLabel: 'Sign out',
                isDangerous: false);
              if (ok==true) ref.read(revokeSessionProvider.notifier).revoke(s.id);
            },
          ),
          semanticsLabel: '${s.deviceLabel}, ${s.deviceType}, last active ${_relativeTime(s.lastActivityAt)}',
        )),
      )),
      SizedBox(24),
      // Sign out everywhere
      BalsmButton.danger(
        label: 'Sign out everywhere',
        onPressed: () async {
          final ok = await showBalsmConfirmDialog(context,
            title: 'Sign out everywhere?',
            body: 'Sign out of all other devices? You\'ll stay signed in here.',
            confirmLabel: 'Sign out everywhere',
            isDangerous: true);
          if (ok==true) ref.read(signOutEverywhereProvider.notifier).execute();
        },
      ),
    ]),
    bottomNavigationBar: BalsmBottomNav(currentIndex: 3, onTap: _onNavTap),
  )
  ```
  `_deviceIcon(type)`: `{'phone': Icons.smartphone, 'tablet': Icons.tablet, 'desktop': Icons.computer, 'web': Icons.language}[type] ?? Icons.devices`.
  `_relativeTime(dt)`: returns `'Active now'` if within 5min, `'2h ago'`, `'Yesterday'`, `'3 days ago'` etc.
  Current device card: `Semantics(label: 'Current device: ${sessions.first.deviceLabel}', selected: true)`.

---

## Phase 11: Account Settings (US6)

- [ ] UI046 [P] [US6] Create `../balsm_app/packages/account/lib/src/presentation/screens/country_settings_screen.dart`.
  Class: `class CountrySettingsScreen extends ConsumerWidget`. Route: `account.country`.
  Reuses `CountryPickerScreen` widget but adds:
  - Warning banner at top: `Container(color: Color(0xFFE5B428).withOpacity(0.1), padding: 12, child: Text('Changing country requires re-authentication and re-disclosure.', 14px Color(0xFFE5B428)))`.
  - On select: `showBalsmConfirmDialog('Change country to $name?', 'This will sign you out on all devices.', 'Change', isDangerous: true)`. On confirm: call `ChangeCountryUseCase` → navigate to re-auth flow → re-disclosure.
  Warning banner has `Semantics(liveRegion: true)` so it's announced before user interacts.

- [ ] UI047 [P] [US6] Create `../balsm_app/packages/account/lib/src/presentation/screens/language_settings_screen.dart`.
  Class: `class LanguageSettingsScreen extends ConsumerStatefulWidget`. Route: `account.language`.
  State: `String _selectedLocale` (current locale from provider).
  Languages list: `[('en', 'English', false), ('ar-EG', 'العربية (مصر)', true), ('ar-SA', 'العربية (السعودية)', true), ('ar-AE', 'العربية (الإمارات)', true)]`.
  Widget tree:
  ```
  Scaffold(
    appBar: BalsmAppBar.backable('Language'),
    body: ListView(children: languages.map((lang) => ListTile(
      title: Directionality(
        textDirection: lang.isRtl ? TextDirection.rtl : TextDirection.ltr,
        child: Text(lang.nativeName, 16px),
      ),
      trailing: _selectedLocale == lang.code
        ? Icon(Icons.check, Color(0xFF1283FF))
        : null,
      semanticsLabel: '${lang.nativeName}, ${lang.isRtl ? 'right to left' : 'left to right'}',
      onTap: () => _selectLanguage(lang.code),
    )).toList()),
  )
  ```
  `_selectLanguage(code)`: call `ChangeLanguageUseCase` → update locale provider → show `SnackBar('Language changed. Restart for full effect.')`.
  Each selected item `Semantics(selected: true)`.

- [ ] UI048 [P] Implement `NotFoundScreen` at `../balsm_app/packages/core/lib/src/kit/not_found_screen.dart`.
  Class: `class NotFoundScreen extends StatelessWidget`. Used as `go_router`'s `errorBuilder`.
  Widget tree:
  ```
  Scaffold(
    backgroundColor: Color(0xFFF4F3EC),
    appBar: BalsmAppBar.backable(''),
    body: Center(child: Padding(24, child: Column(mainAxisAlignment: center, [
      Text('404', style: TextStyle(fontSize: 72, fontWeight: w800, color: Color(0xFF01C4A2), fontFamily: 'Montserrat')),
      SizedBox(8),
      Semantics(header: true, child: Text('Page not found',
        style: 24px w700 Color(0xFF2B2B25), textAlign: center)),
      SizedBox(8),
      Text('The page you\'re looking for doesn\'t exist.',
        style: 16px Color(0xFF56564C), textAlign: center),
      SizedBox(32),
      BalsmButton.primary(label: 'Go home', onPressed: () => context.go('/home')),
    ]))),
  )
  ```
  Export from `core.dart`.

---

## Phase 12: i18n Keys

> Wire all English strings used in screens above to i18n JSON bundles. Arabic translations provided inline per design spec.

- [ ] UI049 [Flutter] Create or update `../balsm_app/packages/core/assets/i18n/en.json` with all auth copy keys:
  ```json
  {
    "auth.country.search": "Search countries",
    "auth.email.eyebrow": "CREATE YOUR ACCOUNT",
    "auth.email.title": "Sign up with your email",
    "auth.email.field": "Email address",
    "auth.email.cta": "Continue",
    "auth.email.google": "Continue with Google",
    "auth.email.apple": "Continue with Apple",
    "auth.otp.eyebrow": "VERIFY YOUR EMAIL",
    "auth.otp.title": "Enter the 6-digit code sent to {email}",
    "auth.otp.error": "Code is incorrect. Please try again.",
    "auth.otp.resend": "Resend code",
    "auth.otp.timer": "Resend code in {time}",
    "auth.lockout.title": "Too many attempts",
    "auth.lockout.body": "Please wait before trying again.",
    "auth.blocked.title": "Not available in {country}",
    "auth.blocked.body": "Balsm is not currently available in your country.",
    "auth.blocked.back": "Go back"
  }
  ```

- [ ] UI050 [Flutter] Add to `../balsm_app/packages/core/assets/i18n/ar-EG.json` (Egyptian Arabic):
  ```json
  {
    "auth.country.search": "ابحث عن دولة",
    "auth.email.eyebrow": "إنشاء حسابك",
    "auth.email.title": "سجّل ببريدك الإلكتروني",
    "auth.email.field": "البريد الإلكتروني",
    "auth.email.cta": "متابعة",
    "auth.otp.eyebrow": "تحقّق من بريدك الإلكتروني",
    "auth.otp.title": "أدخل الرمز المكوّن من 6 أرقام المرسل إلى {email}",
    "auth.otp.error": "الرمز غير صحيح. يرجى المحاولة مرة أخرى.",
    "auth.otp.resend": "إعادة إرسال الرمز",
    "auth.lockout.title": "محاولات كثيرة جداً",
    "auth.blocked.title": "غير متاح في {country}"
  }
  ```

- [ ] UI051 [P] [Flutter] Add home + disclosure copy keys to `en.json`:
  ```json
  {
    "home.greeting": "Welcome back, {name}",
    "home.tagline": "Your health, your data, your system.",
    "home.nudge.emergency": "Complete your emergency card",
    "home.nudge.meds": "Add your medications",
    "home.nudge.profile": "Complete your health profile",
    "home.empty.title": "Welcome to Balsm",
    "home.empty.subtitle": "Start by adding your emergency card or a medication.",
    "home.empty.cta1": "Add emergency card",
    "home.empty.cta2": "Add medication",
    "disclosure.title": "Privacy & Terms",
    "disclosure.eyebrow": "YOUR PRIVACY MATTERS",
    "disclosure.heading": "How we protect your health data",
    "disclosure.accept": "I Accept"
  }
  ```

- [ ] UI052 [P] [Flutter] Add emergency + medications + sessions + deletion copy keys to `en.json`:
  ```json
  {
    "emergency.title": "Emergency Card",
    "emergency.blood": "Blood type",
    "emergency.allergies": "Allergies",
    "emergency.conditions": "Chronic conditions",
    "emergency.contacts": "Emergency contacts",
    "emergency.generate": "Generate QR",
    "emergency.severity.severe": "Severe",
    "emergency.severity.moderate": "Moderate",
    "emergency.severity.mild": "Mild",
    "meds.add.title": "Add medication",
    "meds.add.name": "Medication name",
    "meds.add.dose": "Dose",
    "meds.add.dose.help": "e.g., 500 mg, 1 tablet, 5 ml",
    "meds.add.daily": "Daily",
    "meds.add.weekly": "Weekly",
    "meds.add.custom": "Custom",
    "meds.add.save": "Save medication",
    "meds.add.controlled": "Schedule II/III medication",
    "sessions.title": "Active Sessions",
    "sessions.current": "Current device",
    "sessions.active.now": "Active now",
    "sessions.revoke": "Sign out",
    "sessions.revoke.all": "Sign out everywhere",
    "sessions.confirm.all": "Sign out of all other devices? You'll stay signed in here.",
    "deletion.preconfirm.title": "Delete Account",
    "deletion.preconfirm.retained": "Retained for 30 days",
    "deletion.preconfirm.deleted": "Deleted after 30 days",
    "deletion.preconfirm.wiped": "Wiped immediately",
    "deletion.preconfirm.cta": "Delete my account",
    "deletion.confirm.title": "Confirm Deletion",
    "deletion.confirm.type": "Type DELETE to confirm",
    "deletion.confirm.cta": "Delete my account"
  }
  ```

---

## Phase 13: RTL + Accessibility Validation

- [ ] UI053 [P] [Flutter] Create `../balsm_app/test/golden/rtl_golden_test.dart`.
  Write `testWidgets` golden tests for RTL layout verification:
  - Wrap each screen in `Directionality(TextDirection.rtl)` + `Localizations(locale: Locale('ar', 'EG'))`.
  - Capture golden for: `CountryPickerScreen`, `HomeScreen`, `EmergencyCardScreen`, `MedicationListScreen`, `SessionsScreen`.
  - Assert goldens match by running `flutter test --update-goldens` once to generate baselines.
  - Golden files saved to `test/golden/rtl_goldens/`.
  - Test names follow `'RTL - {ScreenName} - {description}'`.

- [ ] UI054 [P] [Flutter] Create `../balsm_app/test/a11y/touch_targets_test.dart`.
  Write `testWidgets` for each interactive screen, assert:
  - All `ElevatedButton`, `TextButton`, `IconButton`, `GestureDetector` with `onTap` have semantic bounds ≥ 44×44pt.
  - Use `tester.getSize(find.byType(ElevatedButton))` to verify dimensions.
  - Screens to cover: auth screens, home, emergency card, add medication, sessions.

- [X] UI055 [Flutter] Run `flutter analyze` on `balsm_app/` and fix all errors and warnings before marking UI tasks complete. Command: `cd ../balsm_app && flutter analyze`. Expected: 0 errors. Warnings from generated files (`.g.dart`, `.freezed.dart`) may be ignored.

---

## Dependency Graph

```
UI001–UI004 (theme, spacing, RTL helper)
  └─ UI005–UI017 (all kit widgets — fully parallel)
     └─ UI018 (barrel update)
        ├─ UI019–UI024 (auth screens — parallel)    → US1
        ├─ UI025 (disclosure)                        → US1
        ├─ UI026–UI027 (home screens — parallel)     → US1
        ├─ UI028 (handle claim)                      → US1a
        ├─ UI029–UI032 (profile — sequential then parallel) → US1a
        ├─ UI033–UI035 (emergency — parallel)        → US2
        ├─ UI036–UI040 (medications — parallel)      → US3
        ├─ UI041–UI044 (deletion — parallel)         → US4
        ├─ UI045 (sessions)                          → US4/US5
        └─ UI046–UI048 (account settings — parallel) → US6
           └─ UI049–UI052 (i18n — parallel per domain) → all
              └─ UI053–UI055 (audit + analyze)       → all
```

## Parallel Execution

**Phase 1**: UI001–UI004 first (must be sequential). Then UI005–UI017 all parallel. UI018 last in phase.

**Phases 2–11**: Each phase fully parallel internally. Phases independent of each other (separate packages).

**Phase 12**: All i18n tasks parallel.

**Phase 13**: UI053–UI054 parallel. UI055 sequential after both.

## Summary

| Phase | Tasks | What |
|---|---|---|
| 1 — Kit | UI001–UI018 | 18 widget tasks: theme, colors, spacing, RTL, nav, appbar, card, chip, OTP, countdown, sheet, listitem, privacy marker, severity badge, dialog, button, error banner, barrel |
| 2 — Auth | UI019–UI024 | 6 screens: country picker, email signup, OTP, social, lockout, geofence blocked |
| 3 — Disclosure | UI025 | 1 screen: consolidated disclosure with scroll-to-unlock + authority lookup |
| 4 — Home | UI026–UI027 | 2 screens: home filled (nudge cards) + empty (brand illustration) |
| 5 — Handle | UI028 | 1 screen: handle claim with live validation |
| 6 — Profile | UI029–UI032 | 4: editor + 3 add-bottom-sheets (allergy, condition, contact) |
| 7 — Emergency | UI033–UI035 | 3 screens: card view, QR display, public resolve |
| 8 — Meds | UI036–UI040 | 5: list, add, today, history, timezone modal |
| 9 — Deletion | UI041–UI044 | 4 screens: preconfirm, typed confirm, cancelled, public web |
| 10 — Sessions | UI045 | 1 screen: current + others + sign-out-everywhere |
| 11 — Account | UI046–UI048 | 3: country settings, language settings, not-found |
| 12 — i18n | UI049–UI052 | 4 JSON update tasks (auth, home/disclosure, emergency/meds/sessions/deletion) |
| 13 — Audit | UI053–UI055 | 2 test files + flutter analyze |
| **Total** | **55** | |

## MVP Scope

Implement in this order for fastest testable UI:
1. `UI001–UI018` (all kit widgets)
2. `UI019–UI025` (auth + disclosure — gets user to home)
3. `UI026` (home screen)
4. Verify SC-001a: country picker → email → OTP → disclosure → home round-trip works.
