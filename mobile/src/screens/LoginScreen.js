import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>JIRI Flow</Text>
          <Text style={styles.subtitle}>Caregiver & Patient Portal</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Username or ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your ID"
            placeholderTextColor="#888"
          />

          <Text style={styles.inputLabel}>Password or PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your PIN"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Secondary Options */}
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>I forgot my PIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Deep Blue Background
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl * 1.5,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.l,
    ...Layout.shadow,
  },
  title: {
    ...Typography.pageTitle,
    color: Colors.cardBackground, // White text on blue
    fontSize: 36,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.cardBackground,
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: Spacing.xxl,
  },
  inputLabel: {
    ...Typography.secondaryText,
    color: Colors.cardBackground,
    marginBottom: Spacing.xs,
    fontWeight: "700",
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Layout.borderRadius,
    height: Layout.buttonHeight,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    ...Typography.body,
    color: Colors.text,
  },
  primaryButton: {
    backgroundColor: Colors.secondary, // Betty Orange
    width: "100%",
    height: Layout.buttonHeight,
    borderRadius: Layout.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    ...Layout.shadow,
  },
  primaryButtonText: {
    ...Typography.buttonLabel,
  },
  secondaryButton: {
    alignItems: "center",
    padding: Spacing.m,
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.cardBackground,
    textDecorationLine: "underline",
  },
});
