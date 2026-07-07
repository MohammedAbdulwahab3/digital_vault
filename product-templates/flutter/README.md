# __PRODUCT_NAME__ — Flutter Edition

__PRODUCT_DESCRIPTION__

Purchased on PixelVault · Commercial license included (see LICENSE.txt).

## Requirements

- Flutter 3.22+ (Dart 3.4+)

## Run it

```bash
flutter pub get
flutter run
```

Works on iOS, Android and web out of the box. Sample data lives in
`lib/data.dart` — swap it for your API layer.

## Structure

```
lib/
  main.dart               # App shell, bottom navigation
  theme.dart              # Material 3 theme — recolor here
  data.dart               # Sample data
  screens/
    home_screen.dart      # Stat cards + revenue chart + activity
    insights_screen.dart  # Channel breakdown + trends
    profile_screen.dart   # Settings & account
  widgets/
    stat_card.dart
    mini_chart.dart       # CustomPainter chart, no dependencies
```

## Rebrand

Everything flows from two colors in `lib/theme.dart`:

```dart
const brand  = Color(0xFF__PRIMARY_HEX__);
const accent = Color(0xFF__ACCENT_HEX__);
```

---
© __YEAR__ PixelVault buyer license.
