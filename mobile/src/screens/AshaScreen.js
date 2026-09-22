import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function AshaScreen({ navigation }) {
  const [phase, setPhase] = useState("home"); // 'home', 'visit', 'syncing', 'synced'

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            phase === "home" ? navigation.goBack() : setPhase("home")
          }
          style={styles.closeButton}
        >
          <Feather
            name={phase === "home" ? "x" : "arrow-left"}
            size={32}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ASHA Workflow</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {phase === "home" && (
          <View>
            <Text style={styles.sectionTitle}>TODAY'S VISITS</Text>

            <TouchableOpacity
              style={styles.patientCard}
              onPress={() => setPhase("visit")}
            >
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Joseph</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: Colors.attention },
                    ]}
                  />
                  <Text style={styles.statusText}>Sync pending</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.patientCard}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Maya</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: Colors.success },
                    ]}
                  />
                  <Text style={styles.statusText}>Up to date</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.patientCard}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Rina</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: Colors.success },
                    ]}
                  />
                  <Text style={styles.statusText}>Up to date</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {phase === "visit" && (
          <View>
            <View style={styles.visitHeader}>
              <Text style={styles.visitName}>Joseph</Text>
              <Text style={styles.visitSubtitle}>Last visit: 12 Sep</Text>
            </View>

            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Feather name="list" size={24} color={Colors.primary} />
                <Text style={styles.dataText}>Routine</Text>
              </View>
              <View style={styles.dataItem}>
                <Feather name="activity" size={24} color={Colors.primary} />
                <Text style={styles.dataText}>Practice</Text>
              </View>
              <View style={styles.dataItem}>
                <Feather name="mic" size={24} color={Colors.primary} />
                <Text style={styles.dataText}>Voice</Text>
              </View>
              <View style={styles.dataItem}>
                <Feather name="shield" size={24} color={Colors.primary} />
                <Text style={styles.dataText}>Safety</Text>
              </View>
            </View>

            <JiriButton
              title="SYNC NOW"
              icon={
                <Feather name="bluetooth" size={24} color={Colors.lightText} />
              }
              onPress={() => {
                setPhase("syncing");
                setTimeout(() => setPhase("synced"), 2000);
              }}
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {phase === "syncing" && (
          <View style={styles.centerContent}>
            <Text style={styles.syncingTitle}>CONNECTING</Text>

            <View style={styles.syncFlow}>
              <View style={styles.deviceBox}>
                <Feather name="smartphone" size={32} color={Colors.primary} />
                <Text style={styles.deviceText}>Joseph's Phone</Text>
              </View>

              <View style={styles.bleIndicator}>
                <Feather name="arrow-down" size={24} color={Colors.attention} />
                <Text style={styles.bleText}>BLE</Text>
                <Feather name="arrow-down" size={24} color={Colors.attention} />
              </View>

              <View style={styles.deviceBox}>
                <Feather name="tablet" size={32} color={Colors.primary} />
                <Text style={styles.deviceText}>ASHA Device</Text>
              </View>
            </View>
          </View>
        )}

        {phase === "synced" && (
          <View>
            <View style={styles.successHeader}>
              <Feather name="check-circle" size={48} color={Colors.success} />
              <Text style={styles.successTitle}>Synced</Text>
            </View>

            <View style={styles.syncList}>
              <View style={styles.syncItem}>
                <Feather name="check" size={20} color={Colors.success} />
                <Text style={styles.syncItemText}>Routine data</Text>
              </View>
              <View style={styles.syncItem}>
                <Feather name="check" size={20} color={Colors.success} />
                <Text style={styles.syncItemText}>Practice results</Text>
              </View>
              <View style={styles.syncItem}>
                <Feather name="check" size={20} color={Colors.success} />
                <Text style={styles.syncItemText}>Voice journal</Text>
              </View>
              <View style={styles.syncItem}>
                <Feather name="check" size={20} color={Colors.success} />
                <Text style={styles.syncItemText}>Memory updates</Text>
              </View>
              <View style={styles.syncItem}>
                <Feather name="check" size={20} color={Colors.success} />
                <Text style={styles.syncItemText}>Safety events</Text>
              </View>
            </View>

            <JiriButton title="Done" onPress={() => setPhase("home")} />
          </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.m,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.pageTitle,
    fontSize: 24,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.secondaryText,
    marginBottom: Spacing.l,
    letterSpacing: 1,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    ...Typography.body,
    color: Colors.secondaryText,
  },
  visitHeader: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  visitName: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.text,
  },
  visitSubtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dataItem: {
    width: "48%",
    backgroundColor: Colors.neutral,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  dataText: {
    ...Typography.body,
    fontWeight: "600",
    marginTop: Spacing.s,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xxl,
  },
  syncingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: 2,
    marginBottom: Spacing.xxl * 2,
  },
  syncFlow: {
    alignItems: "center",
  },
  deviceBox: {
    width: 200,
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  deviceText: {
    ...Typography.body,
    fontWeight: "700",
    marginTop: Spacing.s,
  },
  bleIndicator: {
    alignItems: "center",
    paddingVertical: Spacing.l,
  },
  bleText: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.attention,
    marginVertical: Spacing.xs,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  successTitle: {
    ...Typography.pageTitle,
    color: Colors.success,
    marginTop: Spacing.s,
  },
  syncList: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.xl,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
    marginBottom: Spacing.xxl,
  },
  syncItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  syncItemText: {
    ...Typography.body,
    fontWeight: "600",
    marginLeft: Spacing.m,
  },
});
