import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  // Hardcoded date/time for the wireframe replica
  const currentDate = "Mon, 18 Aug 2025";
  const currentTime = "9:12 AM";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header section matching Screen 7 */}
        <View style={styles.header}>
          <Feather
            name="sun"
            size={32}
            color={Colors.attention}
            style={styles.weatherIcon}
          />
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Good morning</Text>
            <Text style={styles.nameText}>Dadu</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
          </View>
        </View>

        <View style={styles.locationBadgeContainer}>
          <View style={styles.locationBadge}>
            <Ionicons
              name="home"
              size={16}
              color={Colors.success}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.locationText}>You are at Home</Text>
          </View>
        </View>

        {/* NOW Task */}
        <TouchableOpacity
          style={[styles.taskStrip, { backgroundColor: Colors.blockYellow }]}
          onPress={() => navigation.navigate("Tasks")} // Or JIRI Flow task
        >
          <View style={styles.taskLabelContainer}>
            <Text style={[styles.taskLabel, { color: Colors.attention }]}>
              NOW
            </Text>
          </View>
          <View style={styles.taskIconContainer}>
            <Ionicons
              name="restaurant-outline"
              size={32}
              color={Colors.primary}
            />
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>Have your breakfast</Text>
          </View>
          <Feather name="chevron-right" size={24} color={Colors.primary} />
        </TouchableOpacity>

        {/* NEXT Task */}
        <TouchableOpacity
          style={[
            styles.taskStrip,
            { backgroundColor: Colors.blockLightBlue, marginTop: Spacing.s },
          ]}
        >
          <View style={styles.taskLabelContainer}>
            <Text style={[styles.taskLabel, { color: Colors.primary }]}>
              NEXT
            </Text>
          </View>
          <View style={styles.taskIconContainer}>
            <FontAwesome5 name="pills" size={24} color={Colors.danger} />
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>Take medicine</Text>
            <Text style={styles.taskTime}>10:00 AM</Text>
          </View>
          <Feather name="chevron-right" size={24} color={Colors.primary} />
        </TouchableOpacity>

        {/* 2x2 Navigation Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.gridBlock, { backgroundColor: Colors.blockBlue }]}
              onPress={() => navigation.navigate("People")}
            >
              <Ionicons name="people" size={40} color={Colors.lightText} />
              <Text style={styles.gridText}>People</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridBlock, { backgroundColor: Colors.blockGreen }]}
              onPress={() => navigation.navigate("Tasks")} // Represents My Day timeline
            >
              <Ionicons name="calendar" size={40} color={Colors.lightText} />
              <Text style={styles.gridText}>My Day</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.gridBlock,
                { backgroundColor: Colors.blockOrange },
              ]}
              onPress={() => navigation.navigate("Memories")}
            >
              <Ionicons name="images" size={40} color={Colors.lightText} />
              <Text style={styles.gridText}>Memories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gridBlock,
                { backgroundColor: Colors.blockPurple },
              ]}
              onPress={() => navigation.navigate("PracticeHub")} // Assume we add this route
            >
              <Ionicons name="fitness" size={40} color={Colors.lightText} />
              <Text style={styles.gridText}>Practice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Button */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate("Help")}
        >
          <Ionicons
            name="call"
            size={28}
            color={Colors.lightText}
            style={{ marginRight: Spacing.s }}
          />
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.m,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.s,
    marginTop: Spacing.l,
  },
  weatherIcon: {
    marginRight: Spacing.m,
  },
  greetingContainer: {
    alignItems: "center",
  },
  greetingText: {
    fontSize: 20,
    color: Colors.text,
  },
  nameText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  locationBadgeContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.success,
  },
  taskStrip: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    ...Layout.shadow,
  },
  taskLabelContainer: {
    width: 50,
    alignItems: "center",
  },
  taskLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  taskIconContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.cardBackground,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.s,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  taskTime: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  gridContainer: {
    marginTop: Spacing.xl,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.m,
  },
  gridBlock: {
    width: "48%",
    aspectRatio: 1.5,
    borderRadius: Layout.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    ...Layout.shadow,
  },
  gridText: {
    ...Typography.body,
    color: Colors.lightText,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  helpButton: {
    backgroundColor: Colors.danger,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonHeight / 2,
    marginTop: Spacing.m,
    marginBottom: Spacing.xxl,
    ...Layout.shadow,
  },
  helpText: {
    ...Typography.buttonLabel,
  },
});
