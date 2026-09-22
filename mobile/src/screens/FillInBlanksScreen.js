import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather } from "@expo/vector-icons";

// Mock data
const GAME_DATA = {
  question: "Complete the word",
  imageUri:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop", // Coffee
  wordParts: ["C", "O", "F", "F", "", ""],
  options: ["E", "A", "O", "I"],
  targetLetters: ["E", "E"],
  fullWord: "COFFEE",
};

export default function FillInBlanksScreen({ navigation }) {
  const [phase, setPhase] = useState("playing"); // 'playing', 'success', 'try_again'
  const [filledLetters, setFilledLetters] = useState([]);

  // Calculate current blanks
  const blanks = GAME_DATA.wordParts.map((part, index) => {
    if (part !== "") return { char: part, isBlank: false };
    // It's a blank, see if user has filled it
    const blankIndex = GAME_DATA.wordParts
      .slice(0, index)
      .filter((p) => p === "").length;
    return {
      char: filledLetters[blankIndex] || "",
      isBlank: true,
    };
  });

  const handleSelect = (letter) => {
    if (phase !== "playing") return;

    const newFilled = [...filledLetters, letter];
    setFilledLetters(newFilled);

    // If all blanks are filled, check answer
    if (newFilled.length === GAME_DATA.targetLetters.length) {
      // Check if the resulting word is correct
      let currentWord = "";
      let blankCounter = 0;
      for (let i = 0; i < GAME_DATA.wordParts.length; i++) {
        if (GAME_DATA.wordParts[i] !== "") {
          currentWord += GAME_DATA.wordParts[i];
        } else {
          currentWord += newFilled[blankCounter];
          blankCounter++;
        }
      }

      if (currentWord === GAME_DATA.fullWord) {
        setPhase("success");
      } else {
        setPhase("try_again");
      }
    }
  };

  const handleClear = () => {
    setFilledLetters([]);
    setPhase("playing");
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

        <View style={styles.centerArea}>
          {/* Word display */}
          <View style={styles.wordContainer}>
            {blanks.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.letterBox,
                  item.isBlank && styles.letterBoxBlank,
                  item.isBlank && item.char !== "" && styles.letterBoxFilled,
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    item.isBlank && { color: Colors.primary },
                  ]}
                >
                  {item.char}
                </Text>
              </View>
            ))}
          </View>

          {/* Letter Options */}
          {phase === "playing" && (
            <View style={styles.optionsContainer}>
              {GAME_DATA.options.map((letter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleSelect(letter)}
                >
                  <Text style={styles.optionText}>{letter}</Text>
                </TouchableOpacity>
              ))}
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
                  size={32}
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
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          {phase === "success" ? (
            <JiriButton title="Next" onPress={() => navigation.goBack()} />
          ) : phase === "try_again" ? (
            <JiriButton
              title="Try again"
              variant="secondary"
              onPress={handleClear}
            />
          ) : (
            <JiriButton
              title="Clear"
              variant="outline"
              onPress={handleClear}
              disabled={filledLetters.length === 0}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.blockPurple, // Theme color from Hub
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
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: Spacing.m,
  },
  questionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    marginTop: Spacing.l,
  },
  centerArea: {
    flex: 1,
    alignItems: "center",
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  letterBox: {
    width: 48,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: Colors.neutral,
    borderRadius: 8,
  },
  letterBoxBlank: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.neutral,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primary,
  },
  letterBoxFilled: {
    borderColor: Colors.primary,
  },
  letterText: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  optionButton: {
    width: 64,
    height: 64,
    backgroundColor: Colors.blockPurple,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    margin: Spacing.s,
    ...Layout.shadow,
  },
  optionText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.lightText,
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
    ...Layout.shadow,
  },
  feedbackText: {
    ...Typography.pageTitle,
  },
  footer: {
    marginTop: "auto",
  },
});
