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

// Mock data
const PLAYLISTS = [
  { id: "fav", title: "My favourites", icon: "heart" },
  { id: "home", title: "Songs from home", icon: "home" },
  { id: "family", title: "Family songs", icon: "users" },
  { id: "festival", title: "Festival songs", icon: "star" },
  { id: "recent", title: "Recently played", icon: "clock" },
];

const MOCK_SONG = {
  title: "Bihu Geet",
  image:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
  lyrics: "Aahoi Bihu aahoi...",
};

export default function SingifyScreen({ navigation }) {
  const [phase, setPhase] = useState("hub"); // 'hub', 'player', 'singing', 'done'
  const [activePlaylist, setActivePlaylist] = useState(null);

  const handleSelectPlaylist = (id) => {
    setActivePlaylist(id);
    setPhase("player");
  };

  const handleSing = () => {
    setPhase("singing");
    // Simulate singing completion after 3 seconds
    setTimeout(() => {
      setPhase("done");
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            phase === "hub" ? navigation.goBack() : setPhase("hub")
          }
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={32} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {phase === "hub" ? "Our Songs" : MOCK_SONG.title}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {phase === "hub" && (
          <View>
            {PLAYLISTS.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={styles.playlistCard}
                onPress={() => handleSelectPlaylist(list.id)}
              >
                <View style={styles.playlistIconContainer}>
                  <Feather name={list.icon} size={28} color={Colors.primary} />
                </View>
                <Text style={styles.playlistTitle}>{list.title}</Text>
                <Feather
                  name="chevron-right"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(phase === "player" || phase === "singing" || phase === "done") && (
          <View style={styles.playerContainer}>
            <View style={styles.albumArtContainer}>
              <Image
                source={{ uri: MOCK_SONG.image }}
                style={styles.albumArt}
              />
            </View>

            <Text style={styles.songTitle}>{MOCK_SONG.title}</Text>

            <View style={styles.lyricsContainer}>
              <Text style={styles.lyricsText}>{MOCK_SONG.lyrics}</Text>
            </View>

            {phase === "player" && (
              <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.playCircle}>
                  <Ionicons name="play" size={32} color={Colors.lightText} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.singCircle}
                  onPress={handleSing}
                >
                  <Ionicons name="mic" size={32} color={Colors.lightText} />
                  <Text style={styles.singText}>Sing</Text>
                </TouchableOpacity>
              </View>
            )}

            {phase === "singing" && (
              <View style={styles.singingState}>
                <View style={styles.pulseCircle}>
                  <Ionicons name="mic" size={48} color={Colors.attention} />
                </View>
                <Text style={styles.listeningText}>Listening...</Text>
              </View>
            )}

            {phase === "done" && (
              <View style={styles.doneState}>
                <Feather name="check-circle" size={48} color={Colors.success} />
                <Text style={styles.doneText}>Great singing!</Text>
                <JiriButton
                  title="Continue"
                  onPress={() => setPhase("hub")}
                  style={{ marginTop: Spacing.xl }}
                />
              </View>
            )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  backButton: {
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
    paddingBottom: Spacing.xxl,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.neutral,
    ...Layout.shadow,
  },
  playlistIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blockBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  playlistTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  playerContainer: {
    alignItems: "center",
  },
  albumArtContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: "hidden",
    marginBottom: Spacing.l,
    borderWidth: 4,
    borderColor: Colors.neutral,
    ...Layout.shadow,
  },
  albumArt: {
    width: "100%",
    height: "100%",
  },
  songTitle: {
    ...Typography.pageTitle,
    marginBottom: Spacing.l,
  },
  lyricsContainer: {
    backgroundColor: Colors.neutral,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    width: "100%",
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  lyricsText: {
    fontSize: 24,
    color: Colors.text,
    fontStyle: "italic",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.l,
  },
  singCircle: {
    flexDirection: "row",
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.attention,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.l,
  },
  singText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.lightText,
    marginLeft: Spacing.s,
  },
  singingState: {
    alignItems: "center",
  },
  pulseCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  listeningText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.attention,
  },
  doneState: {
    alignItems: "center",
    width: "100%",
  },
  doneText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.success,
    marginTop: Spacing.s,
  },
});
