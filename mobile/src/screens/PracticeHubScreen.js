import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function PracticeHubScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Feather
          name="arrow-left"
          size={32}
          color={Colors.primary}
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <View>
          <Text style={styles.headerTitle}>Brain Practice</Text>
          <View style={styles.adaptiveBadge}>
            <Ionicons
              name="arrow-down-circle"
              size={16}
              color={Colors.attention}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.adaptiveText}>Adapting to you</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.gridBlock, { backgroundColor: Colors.blockGreen }]}
              onPress={() => navigation.navigate("PicMatchGame")}
            >
              <Ionicons name="image" size={40} color={Colors.lightText} />
              <Text style={styles.gridTitle}>Pic Match</Text>
              <Text style={styles.gridSubtitle}>Find the pairs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridBlock, { backgroundColor: Colors.blockBlue }]}
              onPress={() => navigation.navigate("RecallGame")}
            >
              <Ionicons name="eye" size={40} color={Colors.lightText} />
              <Text style={styles.gridTitle}>Recall</Text>
              <Text style={styles.gridSubtitle}>Remember</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.gridBlock,
                { backgroundColor: Colors.blockOrange },
              ]}
              onPress={() => navigation.navigate("MemoryGame")}
            >
              <Ionicons name="apps" size={40} color={Colors.lightText} />
              <Text style={styles.gridTitle}>Memory Sequence</Text>
              <Text style={styles.gridSubtitle}>In the right order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridBlock, { backgroundColor: Colors.danger }]}
              onPress={() => navigation.navigate("RhythmGame")}
            >
              <Ionicons
                name="musical-notes"
                size={40}
                color={Colors.lightText}
              />
              <Text style={styles.gridTitle}>Rhythm</Text>
              <Text style={styles.gridSubtitle}>Tap to the music</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.fullWidthBlock}
          onPress={() => navigation.navigate("FillInBlanks")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="pencil" size={32} color={Colors.lightText} />
          </View>
          <View style={styles.fullWidthTextContainer}>
            <Text style={styles.fullWidthTitle}>Fill in the Blanks</Text>
            <Text style={styles.fullWidthSubtitle}>Complete the word</Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.m,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  backIcon: {
    marginRight: Spacing.m,
  },
  headerTitle: {
    ...Typography.pageTitle,
    marginBottom: 4,
  },
  adaptiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blockYellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  adaptiveText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.attention,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  gridContainer: {
    marginBottom: Spacing.m,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.m,
  },
  gridBlock: {
    width: "48%",
    aspectRatio: 1.1,
    borderRadius: Layout.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.s,
    ...Layout.shadow,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.lightText,
    marginTop: Spacing.s,
    textAlign: "center",
  },
  gridSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 4,
  },
  fullWidthBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blockPurple,
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    ...Layout.shadow,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  fullWidthTextContainer: {
    flex: 1,
  },
  fullWidthTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.lightText,
  },
  fullWidthSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
});
