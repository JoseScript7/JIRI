import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function HelpScreen({ navigation }) {
  const [phase, setPhase] = useState("hub"); // 'hub', 'lost', 'notified'

  const handleLost = () => {
    setPhase("lost");
    // Simulate calling family and moving to notified state
    setTimeout(() => {
      setPhase("notified");
    }, 3000);
  };

  const handleCancel = () => {
    setPhase("hub");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            phase === "hub" ? navigation.goBack() : setPhase("hub")
          }
          style={styles.closeButton}
        >
          <Feather
            name={phase === "hub" ? "x" : "arrow-left"}
            size={32}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {phase === "hub" ? "Help" : "I am lost"}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        {phase === "hub" && (
          <View style={styles.content}>
            <Text style={styles.questionText}>How can we help?</Text>

            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.blockBlue },
                ]}
              >
                <Ionicons name="call" size={32} color={Colors.text} />
              </View>
              <Text style={styles.actionText}>Call Sarah</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleLost}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.attention },
                ]}
              >
                <Ionicons name="navigate" size={32} color={Colors.lightText} />
              </View>
              <Text style={styles.actionText}>I'm lost</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.blockYellow },
                ]}
              >
                <Ionicons name="location" size={32} color={Colors.text} />
              </View>
              <Text style={styles.actionText}>Share my location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  marginTop: Spacing.xl,
                  borderColor: Colors.danger,
                  borderWidth: 2,
                },
              ]}
              onPress={() => {}}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.danger },
                ]}
              >
                <Ionicons name="warning" size={32} color={Colors.lightText} />
              </View>
              <Text style={[styles.actionText, { color: Colors.danger }]}>
                Emergency
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === "lost" && (
          <View style={styles.contentCenter}>
            <View style={styles.pulseContainer}>
              <Ionicons name="navigate" size={64} color={Colors.attention} />
            </View>
            <Text style={styles.lostTitle}>Don't worry.</Text>
            <Text style={styles.lostSubtitle}>JIRI is helping.</Text>

            <View style={styles.mapMockup}>
              <Text style={styles.mapText}>Your location</Text>
            </View>

            <Text style={styles.callingText}>Calling Sarah...</Text>

            <View style={styles.footer}>
              <JiriButton
                title="Cancel"
                variant="outline"
                onPress={handleCancel}
              />
            </View>
          </View>
        )}

        {phase === "notified" && (
          <View style={styles.contentCenter}>
            <View style={styles.notifiedIcon}>
              <Feather name="check" size={64} color={Colors.success} />
            </View>

            <Text style={styles.notifiedTitle}>Sarah has been notified.</Text>

            <View style={styles.stayHereBox}>
              <Text style={styles.stayHereText}>Please stay right here.</Text>
            </View>

            <View style={styles.footer}>
              <JiriButton title="I am safe now" onPress={handleCancel} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.m,
    paddingTop: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 1,
    padding: Spacing.xl,
  },
  contentCenter: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: "center",
  },
  questionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.m,
    ...Layout.shadow,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  actionText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  pulseContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.l,
  },
  lostTitle: {
    ...Typography.pageTitle,
    fontSize: 36,
  },
  lostSubtitle: {
    ...Typography.body,
    fontSize: 24,
    color: Colors.secondaryText,
    marginBottom: Spacing.xxl,
  },
  mapMockup: {
    width: "100%",
    height: 150,
    backgroundColor: Colors.neutral,
    borderRadius: Layout.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  mapText: {
    ...Typography.body,
    color: Colors.secondaryText,
  },
  callingText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.attention,
  },
  notifiedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  notifiedTitle: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  stayHereBox: {
    backgroundColor: Colors.blockYellow,
    padding: Spacing.xl,
    borderRadius: Layout.borderRadius,
    width: "100%",
    alignItems: "center",
  },
  stayHereText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.attention,
  },
  footer: {
    marginTop: "auto",
    width: "100%",
  },
});
