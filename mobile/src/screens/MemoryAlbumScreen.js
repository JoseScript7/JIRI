import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../utils/LanguageContext";

const { width } = Dimensions.get("window");

export default function MemoryAlbumScreen({ navigation }) {
  const { t } = useLanguage();

  const memories = [
    { id: 1, title: "Family Picnic", date: "Oct 12, 2023", icon: "📸" },
    { id: 2, title: "Voice Note from Sarah", date: "Nov 5, 2023", icon: "🎙️" },
    { id: 3, title: "Grandson's Birthday", date: "Dec 2, 2023", icon: "🎉" },
  ];

  return (
    <LinearGradient colors={["#F8FAFC", "#E2E8F0"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("memoryAlbum")}</Text>
          <Text style={styles.subtitle}>Cherish your memories and notes.</Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add New Memory</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          {memories.map((mem) => (
            <View key={mem.id} style={styles.memoryCard}>
              <View style={styles.memoryIconBox}>
                <Text style={styles.memoryIcon}>{mem.icon}</Text>
              </View>
              <Text style={styles.memoryTitle} numberOfLines={2}>
                {mem.title}
              </Text>
              <Text style={styles.memoryDate}>{mem.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 22,
    color: "#475569",
    lineHeight: 32,
    fontWeight: "500",
  },
  addBtn: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  memoryCard: {
    width: (width - 64) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  memoryIconBox: {
    width: "100%",
    height: (width - 64) / 2 - 32,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  memoryIcon: {
    fontSize: 48,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  memoryDate: {
    fontSize: 12,
    color: "#64748B",
  },
});
