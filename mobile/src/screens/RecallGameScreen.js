import React, { useState, useEffect } from "react";
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

// Mock data
const GAME_DATA = {
  objectsToRemember: [
    {
      id: 1,
      name: "Cup",
      uri: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Flower",
      uri: "https://images.unsplash.com/photo-1490750967868-88cb4ecb0713?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Drum",
      uri: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&h=200&fit=crop",
    },
  ],
  options: [
    { id: 1, name: "Cup" },
    { id: 4, name: "Key" },
    { id: 5, name: "Book" },
  ],
  targetAnswer: 1, // Cup
};

export default function RecallGameScreen({ navigation }) {
  const [phase, setPhase] = useState("memorize"); // 'memorize', 'recall', 'success', 'try_again'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleContinue = () => {
    setPhase("recall");
  };

  const handleSelect = (id) => {
    setSelectedAnswer(id);
    if (id === GAME_DATA.targetAnswer) {
      setPhase("success");
    } else {
      setPhase("try_again");
    }
  };

  const resetGame = () => {
    setSelectedAnswer(null);
    setPhase("memorize"); // In a real app, load new data here
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
        {phase === "memorize" && (
          <View style={styles.phaseContainer}>
            <Text style={styles.questionText}>Remember these:</Text>

            <View style={styles.objectsContainer}>
              {GAME_DATA.objectsToRemember.map((obj) => (
                <View key={obj.id} style={styles.objectItem}>
                  <Image source={{ uri: obj.uri }} style={styles.objectImage} />
                  <Text style={styles.objectName}>{obj.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <JiriButton title="Continue" onPress={handleContinue} />
            </View>
          </View>
        )}

        {phase === "recall" && (
          <View style={styles.phaseContainer}>
            <Text style={styles.questionText}>Which one did you see?</Text>

            <View style={styles.optionsContainer}>
              {GAME_DATA.options.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.optionButton}
                  onPress={() => handleSelect(opt.id)}
                >
                  <Text style={styles.optionText}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Feedback Area (Success / Try Again) */}
        {(phase === "success" || phase === "try_again") && (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    phase === "success" ? Colors.success : Colors.attention,
                },
              ]}
            >
              <Feather
                name={phase === "success" ? "check" : "refresh-cw"}
                size={48}
                color={Colors.background}
              />
            </View>
            <Text
              style={[
                styles.feedbackText,
                {
                  color:
                    phase === "success" ? Colors.success : Colors.attention,
                },
              ]}
            >
              {phase === "success" ? "Nice!" : "Let's try again."}
            </Text>

            <View style={[styles.footer, { width: "100%" }]}>
              {phase === "success" ? (
                <JiriButton title="Next" onPress={() => navigation.goBack()} />
              ) : (
                <JiriButton
                  title="Try again"
                  variant="secondary"
                  onPress={() => setPhase("recall")}
                />
              )}
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
  },
  closeButton: {
    padding: Spacing.xs,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
  },
  phaseContainer: {
    flex: 1,
  },
  questionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  objectsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  objectItem: {
    alignItems: "center",
  },
  objectImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.s,
    backgroundColor: Colors.neutral,
  },
  objectName: {
    ...Typography.body,
    fontWeight: "600",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  optionButton: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.m,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.neutral,
    ...Layout.shadow,
  },
  optionText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.l,
    ...Layout.shadow,
  },
  feedbackText: {
    ...Typography.pageTitle,
    marginBottom: Spacing.xxl * 2,
  },
  footer: {
    marginTop: "auto",
  },
});
