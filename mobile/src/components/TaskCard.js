import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather } from "@expo/vector-icons";

export const TaskCard = ({ title, time, state = "default", onPress, icon }) => {
  const getConfig = () => {
    switch (state) {
      case "now":
        return {
          bgColor: Colors.blockYellow,
          label: "NOW",
          labelColor: Colors.attention,
        };
      case "next":
        return {
          bgColor: Colors.blockLightBlue,
          label: "NEXT",
          labelColor: Colors.primary,
        };
      case "past":
        return {
          bgColor: Colors.neutral,
          label: "DONE",
          labelColor: Colors.success,
        };
      default:
        return {
          bgColor: Colors.cardBackground,
          label: "",
          labelColor: Colors.text,
        };
    }
  };

  const config = getConfig();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: config.bgColor }]}
      onPress={onPress}
      disabled={state === "past"}
    >
      <View style={styles.labelContainer}>
        {state === "past" ? (
          <Feather name="check-circle" size={20} color={config.labelColor} />
        ) : (
          <Text style={[styles.label, { color: config.labelColor }]}>
            {config.label}
          </Text>
        )}
      </View>

      <View style={styles.iconContainer}>
        {icon ? (
          icon
        ) : (
          <Feather name="activity" size={28} color={Colors.primary} />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            state === "past" && {
              textDecorationLine: "line-through",
              color: Colors.secondaryText,
            },
          ]}
        >
          {title}
        </Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>

      {state !== "past" && (
        <Feather name="chevron-right" size={28} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.m,
    ...Layout.shadow,
  },
  labelContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  time: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 4,
  },
});
