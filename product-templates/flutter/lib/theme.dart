import 'package:flutter/material.dart';

// ── Rebrand the whole app from these two colors ──
const brand = Color(0xFF__PRIMARY_HEX__);
const accent = Color(0xFF__ACCENT_HEX__);

const bg = Color(0xFF0B0B11);
const surface = Color(0xFF14141D);
const surface2 = Color(0xFF1C1C28);
const textDim = Color(0xFF8B8BA3);

ThemeData buildTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: brand,
    brightness: Brightness.dark,
    surface: surface,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: bg,
    cardTheme: CardThemeData(
      color: surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withValues(alpha: 0.06)),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: surface,
      indicatorColor: brand.withValues(alpha: 0.25),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: bg,
      elevation: 0,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w800,
        color: Colors.white,
      ),
    ),
  );
}

const brandGradient = LinearGradient(colors: [brand, accent]);
