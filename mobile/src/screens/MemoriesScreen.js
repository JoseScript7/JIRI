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

const CATEGORIES = [
  { id: "family", title: "Family", icon: "users", color: Colors.blockOrange },
  { id: "places", title: "Places", icon: "map-pin", color: Colors.blockGreen },
  { id: "songs", title: "Songs", icon: "music", color: Colors.blockBlue },
  {
    id: "stories",
    title: "Stories",
    icon: "book-open",
    color: Colors.blockYellow,
  },
];

const MOCK_MEMORY = {
  title: "Sarah",
  subtitle: "My daughter",
  image:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop",
};

export default function MemoriesScreen({ navigation }) {
  const [activeMemory, setActiveMemory] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            activeMemory ? setActiveMemory(null) : navigation.goBack()
          }
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={32} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeMemory ? "Memory" : "Memories"}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {!activeMemory ? (
          <View>
            <TouchableOpacity
              style={styles.villageHero}
              onPress={() => setActiveMemory("village")}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1596704173872-972175a0044b?w=800&h=400&fit=crop",
                }}
                style={styles.heroImage}
              />
              <View style={styles.heroOverlay}>
                <Ionicons name="home" size={32} color={Colors.lightText} />
                <Text style={styles.heroTitle}>My Village</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.grid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.gridCard, { backgroundColor: cat.color }]}
                  onPress={() => setActiveMemory("person")}
                >
                  <View style={styles.iconCircle}>
                    <Feather name={cat.icon} size={32} color={Colors.text} />
                  </View>
                  <Text style={styles.gridCardTitle}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.memoryDetail}>
            <View style={styles.memoryImageContainer}>
              <Image
                source={{ uri: MOCK_MEMORY.image }}
                style={styles.memoryImage}
              />
            </View>

            <Text style={styles.memoryTitle}>{MOCK_MEMORY.title}</Text>
            <Text style={styles.memorySubtitle}>{MOCK_MEMORY.subtitle}</Text>

            <TouchableOpacity style={styles.playVoiceButton}>
              <Ionicons name="volume-high" size={32} color={Colors.lightText} />
              <Text style={styles.playVoiceText}>Play voice story</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <JiriButton title="Next" onPress={() => setActiveMemory(null)} />
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
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.pageTitle,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  villageHero: {
    width: "100%",
    height: 180,
    borderRadius: Layout.borderRadius,
    overflow: "hidden",
    marginBottom: Spacing.l,
    ...Layout.shadow,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.lightText,
    marginTop: Spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: Layout.borderRadius,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    alignItems: "center",
    justifyContent: "center",
    ...Layout.shadow,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.s,
  },
  gridCardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  memoryDetail: {
    alignItems: "center",
    padding: Spacing.m,
  },
  memoryImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: Layout.borderRadius,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: Colors.neutral,
    ...Layout.shadow,
  },
  memoryImage: {
    width: "100%",
    height: "100%",
  },
  memoryTitle: {
    ...Typography.pageTitle,
    fontSize: 36,
  },
  memorySubtitle: {
    ...Typography.body,
    fontSize: 24,
    color: Colors.secondaryText,
    marginBottom: Spacing.xxl,
  },
  playVoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 40,
    width: "100%",
    justifyContent: "center",
    ...Layout.shadow,
  },
  playVoiceText: {
    ...Typography.buttonLabel,
    marginLeft: Spacing.s,
  },
  spacer: {
    height: Spacing.xxl,
  },
});
