import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather, Ionicons } from "@expo/vector-icons";
import { JiriButton } from "../components/JiriButton";

export default function CaregiverScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("act"); // 'understand', 'act', 'refer'

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>JOSEPH'S JIRI</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Safe • At Home</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Asha")}
          >
            <Feather name="bluetooth" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="settings" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "understand" && styles.activeTab]}
          onPress={() => setActiveTab("understand")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "understand" && styles.activeTabText,
            ]}
          >
            UNDERSTAND
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "act" && styles.activeTab]}
          onPress={() => setActiveTab("act")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "act" && styles.activeTabText,
            ]}
          >
            ACT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "refer" && styles.activeTab]}
          onPress={() => setActiveTab("refer")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "refer" && styles.activeTabText,
            ]}
          >
            REFER
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {activeTab === "act" && (
          <>
            <View style={styles.alertsContainer}>
              <Text style={styles.sectionTitle}>ALERTS</Text>
              <View style={styles.alertCard}>
                <View style={styles.alertIcon}>
                  <Feather
                    name="alert-circle"
                    size={24}
                    color={Colors.attention}
                  />
                </View>
                <View style={styles.alertTextContainer}>
                  <Text style={styles.alertText}>
                    Medicine reminder not acknowledged twice.
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.alertAction}>Review</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.todayContainer}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>TODAY</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>View timeline</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timelineCard}>
                <View style={styles.timelineItem}>
                  <Feather
                    name="check-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text style={[styles.timelineText, styles.timelineDone]}>
                    Breakfast completed
                  </Text>
                </View>
                <View style={styles.timelineItem}>
                  <Feather
                    name="check-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text style={[styles.timelineText, styles.timelineDone]}>
                    Medicine acknowledged
                  </Text>
                </View>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineCircle} />
                  <Text style={styles.timelineText}>Walk (11:00)</Text>
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextText}>NEXT</Text>
                  </View>
                </View>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineCircle} />
                  <Text style={styles.timelineText}>Practice</Text>
                </View>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>ROUTINE & TASKS</Text>
            </View>

            <View style={styles.grid}>
              <TouchableOpacity style={styles.gridCard}>
                <Feather
                  name="edit"
                  size={28}
                  color={Colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.gridCardTitle}>Routine Editor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridCard}>
                <Ionicons
                  name="medical"
                  size={28}
                  color={Colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.gridCardTitle}>Medications</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === "understand" && (
          <>
            <View style={styles.insightsContainer}>
              <Text style={styles.sectionTitle}>AI INSIGHTS</Text>
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  Joseph completed all morning routine steps. The medicine
                  reminder needed two prompts. Practice was completed without
                  assistance.
                </Text>
                <View style={styles.divider} />
                <View style={styles.insightSuggestion}>
                  <Ionicons
                    name="bulb-outline"
                    size={24}
                    color={Colors.attention}
                  />
                  <Text style={styles.suggestionText}>
                    The medicine task took longer than usual today.
                  </Text>
                </View>
                <JiriButton title="Review Routine" variant="outline" />
              </View>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>DATA & REPORTS</Text>
            </View>

            <View style={styles.grid}>
              <TouchableOpacity style={styles.gridCard}>
                <Ionicons
                  name="stats-chart"
                  size={28}
                  color={Colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.gridCardTitle}>Practice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridCard}>
                <Ionicons
                  name="mic"
                  size={28}
                  color={Colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.gridCardTitle}>Voice Journal</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.insightsContainer}>
              <Text style={styles.sectionTitle}>CARE LIBRARY</Text>
              <TouchableOpacity style={styles.libraryCard}>
                <Text style={styles.libraryTitle}>Communication tips</Text>
                <Feather
                  name="chevron-right"
                  size={24}
                  color={Colors.secondaryText}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.libraryCard}>
                <Text style={styles.libraryTitle}>Understanding wandering</Text>
                <Feather
                  name="chevron-right"
                  size={24}
                  color={Colors.secondaryText}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === "refer" && (
          <>
            <Text style={styles.sectionTitle}>NEED CLINICAL SUPPORT?</Text>
            <View style={styles.referralCard}>
              <Text style={styles.referralDesc}>
                JIRI helps manage daily care, but it does not replace medical
                advice. If you notice significant changes, connect with the care
                network.
              </Text>

              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>Anita (ASHA Worker)</Text>
                  <Text style={styles.contactSubtitle}>Community Health</Text>
                </View>
                <Ionicons name="call" size={24} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="medical" size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>Primary Health Centre</Text>
                  <Text style={styles.contactSubtitle}>District 4</Text>
                </View>
                <Ionicons name="call" size={24} color={Colors.primary} />
              </TouchableOpacity>

              <JiriButton
                title="Create Care Note for ASHA"
                style={{ marginTop: Spacing.l }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: Spacing.m,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.success,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
    backgroundColor: Colors.neutral,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.secondaryText,
    letterSpacing: 1,
  },
  activeTabText: {
    color: Colors.primary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.secondaryText,
    letterSpacing: 1,
    marginBottom: Spacing.m,
    marginTop: Spacing.l,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.m,
  },
  alertsContainer: {
    marginBottom: Spacing.m,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0", // Light orange
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    borderLeftWidth: 4,
    borderLeftColor: Colors.attention,
  },
  alertIcon: {
    marginRight: Spacing.m,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertText: {
    ...Typography.body,
    fontWeight: "600",
    color: "#E65100", // Dark orange
  },
  alertAction: {
    fontWeight: "700",
    color: Colors.attention,
    marginLeft: Spacing.s,
  },
  todayContainer: {
    marginBottom: Spacing.l,
  },
  timelineCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  timelineCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.secondaryText,
    marginHorizontal: 2,
  },
  timelineText: {
    ...Typography.body,
    fontWeight: "600",
    marginLeft: Spacing.m,
  },
  timelineDone: {
    color: Colors.secondaryText,
    textDecorationLine: "line-through",
  },
  nextBadge: {
    backgroundColor: Colors.blockLightBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: Spacing.s,
  },
  nextText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.primary,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  gridCard: {
    width: "48%",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
    alignItems: "center",
    marginBottom: Spacing.m,
    ...Layout.shadow,
  },
  gridCardTitle: {
    ...Typography.body,
    fontWeight: "700",
    textAlign: "center",
  },
  insightsContainer: {
    marginBottom: Spacing.m,
  },
  insightCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  insightText: {
    ...Typography.body,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral,
    marginVertical: Spacing.l,
  },
  insightSuggestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.l,
  },
  suggestionText: {
    flex: 1,
    ...Typography.body,
    fontWeight: "600",
    marginLeft: Spacing.m,
    color: "#FF8F00",
  },
  libraryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
    marginBottom: Spacing.s,
  },
  libraryTitle: {
    ...Typography.body,
    fontWeight: "600",
  },
  referralCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  referralDesc: {
    ...Typography.body,
    color: Colors.secondaryText,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.blockLightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.body,
    fontWeight: "700",
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});
