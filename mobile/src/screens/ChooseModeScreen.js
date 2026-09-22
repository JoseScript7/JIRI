import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";

export default function ChooseModeScreen({ navigation }) {
  const handleSelectMode = (mode) => {
    // In a real app, save mode to AsyncStorage here
    if (mode === "patient") {
      navigation.navigate("PatientProfileSetup");
    } else {
      navigation.navigate("CaregiverSetup");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How will you use JIRI?</Text>
      </View>

      <View style={styles.content}>
        {/* Patient Mode Card */}
        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => handleSelectMode("patient")}
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>For me</Text>
              <Text style={styles.cardDesc}>I want to use JIRI on my own</Text>
            </View>
            <View
              style={[styles.avatarContainer, { backgroundColor: "#FDE68A" }]}
            >
              {/* Fallback emoji if image isn't available */}
              <Text style={styles.avatarEmoji}>👴🏽</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Caregiver Mode Card */}
        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: "#E1F5FE" }]}
          onPress={() => handleSelectMode("caregiver")}
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>For someone I care for</Text>
              <Text style={styles.cardDesc}>
                I am setting up JIRI for my family member
              </Text>
            </View>
            <View
              style={[styles.avatarContainer, { backgroundColor: "#BBDEFB" }]}
            >
              <Text style={styles.avatarEmoji}>👩🏽‍⚕️</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl * 1.5,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.pageTitle,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: Spacing.xxl,
  },
  modeCard: {
    backgroundColor: "#FFF8E1", // Default yellow tint for patient mode
    borderRadius: Layout.borderRadius,
    padding: Spacing.l,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: "transparent",
    ...Layout.shadow,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.m,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardDesc: {
    ...Typography.secondaryText,
    color: Colors.text,
    lineHeight: 22,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 32,
  },
  arrowContainer: {
    alignItems: "flex-end",
  },
  arrow: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: "700",
  },
});
