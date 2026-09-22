import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";

const { width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Massive Central Profile */}
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileEmoji}>👨‍🦳</Text>
        </View>
        <Text style={styles.welcomeText}>Joseph</Text>
      </View>

      {/* Grid of Soft Buttons */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.gridButton, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Text style={styles.buttonEmoji}>🗓️</Text>
          <Text style={[styles.buttonLabel, { color: Colors.cardBackground }]}>
            My Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridButton, { backgroundColor: Colors.secondary }]}
          onPress={() => navigation.navigate("MainTabs", { screen: "People" })}
        >
          <Text style={styles.buttonEmoji}>👥</Text>
          <Text style={[styles.buttonLabel, { color: Colors.cardBackground }]}>
            Network
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridButton, { backgroundColor: Colors.tertiary }]}
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "Memories" })
          }
        >
          <Text style={styles.buttonEmoji}>📚</Text>
          <Text style={[styles.buttonLabel, { color: Colors.cardBackground }]}>
            Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridButton, { backgroundColor: Colors.quaternary }]}
          onPress={() => navigation.navigate("MainTabs", { screen: "Help" })}
        >
          <Text style={styles.buttonEmoji}>❤️</Text>
          <Text style={[styles.buttonLabel, { color: Colors.cardBackground }]}>
            Support
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appointmentsContainer}>
        <Text style={styles.appointmentsTitle}>Upcoming Appointments</Text>
        <View style={styles.appointmentCard}>
          <Text style={styles.appointmentTime}>Today • 2:00 PM</Text>
          <Text style={styles.appointmentText}>Call with Sarah</Text>
        </View>
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
    paddingTop: Spacing.xxl * 1.5,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  profileCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.l,
    ...Layout.shadow,
  },
  profileEmoji: {
    fontSize: 80,
  },
  welcomeText: {
    ...Typography.pageTitle,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.xl,
  },
  gridButton: {
    width: (width - Spacing.xl * 2 - Spacing.m) / 2, // 2 columns
    aspectRatio: 1, // Square
    borderRadius: Layout.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  buttonEmoji: {
    fontSize: 48,
    marginBottom: Spacing.s,
  },
  buttonLabel: {
    ...Typography.buttonLabel,
  },
  appointmentsContainer: {
    width: "100%",
  },
  appointmentsTitle: {
    ...Typography.body,
    fontWeight: "700",
    marginBottom: Spacing.m,
  },
  appointmentCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Layout.borderRadius,
    padding: Spacing.l,
    width: "100%",
    ...Layout.shadow,
  },
  appointmentTime: {
    ...Typography.secondaryText,
    marginBottom: Spacing.xs,
  },
  appointmentText: {
    ...Typography.body,
  },
});
