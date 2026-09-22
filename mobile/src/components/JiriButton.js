import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Typography, Layout, Spacing } from "../utils/DesignSystem";

/**
 * Reusable JiriButton component mapping to the new design system sizes.
 * Supports variants: 'primary', 'secondary', 'danger', 'outline'
 */
export const JiriButton = ({
  title,
  onPress,
  variant = "primary",
  icon = null,
  disabled = false,
  style = {},
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral;
    switch (variant) {
      case "primary":
        return Colors.primary;
      case "secondary":
        return Colors.secondary;
      case "danger":
        return Colors.danger;
      case "outline":
        return "transparent";
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.secondaryText;
    if (variant === "outline") return Colors.primary;
    return Colors.lightText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === "outline" && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && icon}
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: Layout.buttonHeight, // 64dp for large touch targets
    borderRadius: Layout.buttonHeight / 2, // Pill shape
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    ...Layout.shadow,
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    ...Typography.buttonLabel,
    marginLeft: Spacing.s, // Space between icon and text if icon exists
  },
});
