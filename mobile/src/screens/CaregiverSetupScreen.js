import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function CaregiverSetupScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Set up caregiver support</Text>
        <Text style={styles.subtitle}>
          This helps keep them safe and connected
        </Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#E1F5FE" }]}>
            <Feather name="users" size={24} color={Colors.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Family contacts</Text>
            <Text style={styles.menuSubtitle}>Add people</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#FFF8E1" }]}>
            <Feather name="list" size={24} color={Colors.attention} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Daily routine</Text>
            <Text style={styles.menuSubtitle}>Set activities</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#FFEBEE" }]}>
            <Feather name="briefcase" size={24} color={Colors.danger} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Medications</Text>
            <Text style={styles.menuSubtitle}>Add reminders</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}>
            <Feather name="map-pin" size={24} color={Colors.success} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Home safe zone</Text>
            <Text style={styles.menuSubtitle}>Set location</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="language" size={24} color={Colors.blockPurple} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Language & voice</Text>
            <Text style={styles.menuSubtitle}>Assamese - Female voice</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Caregiver")} // Simulating going to caregiver dashboard
        >
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  title: {
    ...Typography.pageTitle,
    fontSize: 28,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.secondaryText,
  },
  menu: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.neutral,
    borderRadius: Layout.borderRadius,
    backgroundColor: Colors.cardBackground,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...Typography.body,
    fontWeight: "700",
  },
  menuSubtitle: {
    ...Typography.secondaryText,
    fontSize: 14,
  },
  footer: {
    paddingBottom: Spacing.xxl,
    marginTop: "auto",
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonHeight / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    ...Typography.buttonLabel,
  },
});
