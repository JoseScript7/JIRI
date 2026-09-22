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

// Mock data
const GAME_DATA = {
  sequence: [
    {
      id: 1,
      name: "Cup",
      uri: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Cloth",
      uri: "https://images.unsplash.com/photo-1584050218779-786d790f9eec?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Drum",
      uri: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&h=200&fit=crop",
    },
  ],
};

export default function MemoryGameScreen({ navigation }) {
  const [phase, setPhase] = useState("memorize"); // 'memorize', 'reproduce', 'success', 'try_again'
  const [userSequence, setUserSequence] = useState([]);

  const handleContinue = () => {
    setPhase("reproduce");
  };

  const handleSelect = (obj) => {
    const newSeq = [...userSequence, obj];
    setUserSequence(newSeq);

    if (newSeq.length === GAME_DATA.sequence.length) {
      // Check if correct
      const isCorrect = newSeq.every(
        (val, index) => val.id === GAME_DATA.sequence[index].id,
      );
      if (isCorrect) {
        setPhase("success");
      } else {
        setPhase("try_again");
      }
    }
  };

  const resetGame = () => {
    setUserSequence([]);
    setPhase("memorize");
  };

  const retryReproduce = () => {
    setUserSequence([]);
    setPhase("reproduce");
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
            <Text style={styles.questionText}>Remember this order</Text>

            <View style={styles.sequenceContainer}>
              {GAME_DATA.sequence.map((obj, index) => (
                <View key={obj.id} style={styles.sequenceItemRow}>
                  <Text style={styles.numberText}>{index + 1} ➔</Text>
                  <Image
                    source={{ uri: obj.uri }}
                    style={styles.objectImageSmall}
                  />
                  <Text style={styles.objectName}>{obj.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <JiriButton title="Continue" onPress={handleContinue} />
            </View>
          </View>
        )}

        {phase === "reproduce" && (
          <View style={styles.phaseContainer}>
            <Text style={styles.questionText}>Tap them in order</Text>

            {/* Answer Slots */}
            <View style={styles.slotsContainer}>
              {GAME_DATA.sequence.map((_, i) => (
                <View key={i} style={styles.slot}>
                  {userSequence[i] ? (
                    <Image
                      source={{ uri: userSequence[i].uri }}
                      style={styles.slotImage}
                    />
                  ) : (
                    <Text style={styles.slotNumber}>{i + 1}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Options (shuffled in real app) */}
            <View style={styles.optionsContainer}>
              {[...GAME_DATA.sequence]
                .sort((a, b) => b.id - a.id)
                .map((obj) => {
                  const isSelected = userSequence.some(
                    (item) => item.id === obj.id,
                  );
                  return (
                    <TouchableOpacity
                      key={obj.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardDisabled,
                      ]}
                      onPress={() => !isSelected && handleSelect(obj)}
                      disabled={isSelected}
                    >
                      <Image
                        source={{ uri: obj.uri }}
                        style={[
                          styles.optionImage,
                          isSelected && { opacity: 0.3 },
                        ]}
                      />
                      <Text
                        style={[
                          styles.optionName,
                          isSelected && { color: Colors.secondaryText },
                        ]}
                      >
                        {obj.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}

        {/* Feedback Area */}
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
                  onPress={retryReproduce}
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
  sequenceContainer: {
    alignItems: "center",
  },
  sequenceItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.l,
    width: 200,
  },
  numberText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    marginRight: Spacing.l,
    width: 60,
  },
  objectImageSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: Spacing.m,
    backgroundColor: Colors.neutral,
  },
  objectName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.xxl * 1.5,
  },
  slot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.neutral,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
  },
  slotNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondaryText,
  },
  slotImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionCard: {
    alignItems: "center",
    width: "30%",
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.neutral,
  },
  optionName: {
    ...Typography.body,
    fontWeight: "600",
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
