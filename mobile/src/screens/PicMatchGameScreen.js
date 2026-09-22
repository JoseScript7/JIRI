import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather, Ionicons } from "@expo/vector-icons";

// Mock data for the game logic
const GAME_DATA = {
  question: "Which pictures are the same?",
  images: [
    {
      id: 1,
      uri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
      isMatch: true,
    },
    {
      id: 2,
      uri: "https://images.unsplash.com/photo-1537151608804-ea2d11ccf7f4?w=400&h=400&fit=crop",
      isMatch: false,
    }, // slightly different dog
    {
      id: 3,
      uri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
      isMatch: false,
    }, // completely different dog
    {
      id: 4,
      uri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
      isMatch: true,
    }, // exact match
  ],
};

export default function PicMatchGameScreen({ navigation }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'success', 'try_again'

  const handleSelect = (id) => {
    if (gameState === "success") return; // Don't allow clicks after success

    // Toggle selection
    let newSelection = [...selectedIds];
    if (newSelection.includes(id)) {
      newSelection = newSelection.filter((item) => item !== id);
    } else {
      if (newSelection.length < 2) {
        newSelection.push(id);
      } else {
        // If 2 already selected, replace the second one
        newSelection[1] = id;
      }
    }

    setSelectedIds(newSelection);

    // Check win condition if 2 are selected
    if (newSelection.length === 2) {
      const img1 = GAME_DATA.images.find((img) => img.id === newSelection[0]);
      const img2 = GAME_DATA.images.find((img) => img.id === newSelection[1]);

      if (img1.isMatch && img2.isMatch && img1.id !== img2.id) {
        setGameState("success");
      } else {
        setGameState("try_again");
      }
    } else {
      setGameState("playing"); // Reset state if less than 2 selected
    }
  };

  const resetSelection = () => {
    setSelectedIds([]);
    setGameState("playing");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Feather name="x" size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.questionText}>{GAME_DATA.question}</Text>

        <View style={styles.grid}>
          {GAME_DATA.images.map((img) => (
            <TouchableOpacity
              key={img.id}
              style={[
                styles.imageCard,
                selectedIds.includes(img.id) && styles.imageCardSelected,
              ]}
              onPress={() => handleSelect(img.id)}
            >
              <Image source={{ uri: img.uri }} style={styles.image} />
              {selectedIds.includes(img.id) && (
                <View style={styles.selectionOverlay}>
                  <Ionicons
                    name="checkmark-circle"
                    size={48}
                    color={Colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Area */}
        <View style={styles.feedbackArea}>
          {gameState === "success" && (
            <View style={styles.feedbackContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.success },
                ]}
              >
                <Feather name="check" size={32} color={Colors.background} />
              </View>
              <Text style={styles.successText}>Nice!</Text>
            </View>
          )}

          {gameState === "try_again" && (
            <View style={styles.feedbackContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.attention },
                ]}
              >
                <Feather
                  name="refresh-cw"
                  size={32}
                  color={Colors.background}
                />
              </View>
              <Text style={styles.tryAgainText}>Let's try again.</Text>
            </View>
          )}
        </View>

        {/* Bottom Action Area */}
        <View style={styles.footer}>
          {gameState === "success" ? (
            <JiriButton
              title="Next"
              onPress={() => navigation.goBack()} // Or to next level
            />
          ) : gameState === "try_again" ? (
            <JiriButton
              title="Try again"
              variant="secondary"
              onPress={resetSelection}
            />
          ) : (
            <View style={{ height: Layout.buttonHeight }} /> // Spacer to maintain layout
          )}
        </View>
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
  },
  closeButton: {
    padding: Spacing.xs,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
  },
  questionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  imageCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: Layout.borderRadius,
    overflow: "hidden",
    marginBottom: Spacing.m,
    borderWidth: 4,
    borderColor: "transparent",
    ...Layout.shadow,
  },
  imageCardSelected: {
    borderColor: Colors.primary,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackContainer: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.s,
    ...Layout.shadow,
  },
  successText: {
    ...Typography.pageTitle,
    color: Colors.success,
  },
  tryAgainText: {
    ...Typography.pageTitle,
    color: Colors.attention,
  },
  footer: {
    marginTop: "auto",
  },
});
