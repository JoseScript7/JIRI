import 'package:flutter/material.dart';

class JiriColors {
  static const Color background = Color(0xFFEAF3FB);
  static const Color primaryBlue = Color(0xFF2E5EAA);
  static const Color orangeAmber = Color(0xFFF5A64B);
  static const Color green = Color(0xFF4CAF7D);
  static const Color purple = Color(0xFF8B6FD1);
  static const Color redCoral = Color(0xFFE8555A);
  static const Color teal = Color(0xFF3AA6A0);
  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1A2B4C);
  static const Color textSecondary = Color(0xFF6B7A99);
}

class JiriTheme {
  static ThemeData get themeData {
    return ThemeData(
      scaffoldBackgroundColor: JiriColors.background,
      primaryColor: JiriColors.primaryBlue,
      colorScheme: const ColorScheme.light(
        primary: JiriColors.primaryBlue,
        secondary: JiriColors.orangeAmber,
        background: JiriColors.background,
        surface: JiriColors.cardWhite,
        error: JiriColors.redCoral,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          color: JiriColors.textPrimary,
          fontSize: 26,
          fontWeight: FontWeight.bold,
        ),
        displayMedium: TextStyle(
          color: JiriColors.textPrimary,
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
        titleLarge: TextStyle(
          color: JiriColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        titleMedium: TextStyle(
          color: JiriColors.textPrimary,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
        bodyLarge: TextStyle(
          color: JiriColors.textSecondary,
          fontSize: 16,
          fontWeight: FontWeight.normal,
        ),
        bodyMedium: TextStyle(
          color: JiriColors.textSecondary,
          fontSize: 14,
          fontWeight: FontWeight.normal,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 56), // Minimum tap target 56px height
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        color: JiriColors.cardWhite,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}

// --- REUSABLE WIDGETS ---

class JiriCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const JiriCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: padding,
        child: child,
      ),
    );
  }
}

class JiriPrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Color? backgroundColor;

  const JiriPrimaryButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor ?? JiriColors.primaryBlue,
        foregroundColor: Colors.white,
      ),
      onPressed: onPressed,
      child: Text(label),
    );
  }
}

class JiriIconTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? subtitle;
  final Color color;
  final VoidCallback onTap;
  final bool isSelected;

  const JiriIconTile({
    Key? key,
    required this.icon,
    required this.label,
    this.subtitle,
    required this.color,
    required this.onTap,
    this.isSelected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? color : Colors.transparent,
              width: 2,
            ),
          ),
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 36),
              const SizedBox(height: 8),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: JiriColors.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: JiriColors.textSecondary,
                    fontSize: 12,
                    fontWeight: FontWeight.normal,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class JiriStatusBadge extends StatelessWidget {
  final String text;
  final Color color;
  final IconData? icon;

  const JiriStatusBadge({
    Key? key,
    required this.text,
    required this.color,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16), // Pill shape
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, color: color, size: 16),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class JiriStepBadge extends StatelessWidget {
  final int number;
  final Color color;

  const JiriStepBadge({
    Key? key,
    required this.number,
    this.color = JiriColors.primaryBlue,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        number.toString(),
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
