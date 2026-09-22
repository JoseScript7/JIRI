import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function RhythmGameScreen({ navigation }) {
  const [phase, setPhase] = useState("listen"); // 'listen', 'tap', 'feedback'
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation for the drum beat effect
  const scaleAnim = new Animated.Value(1);

  const handlePlay = () => {
    setIsPlaying(true);
    // Simulate playing 3 beats
    let beats = 0;
    const interval = setInterval(() => {
      beats++;
      pulseAnimation();

      if (beats >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setPhase("tap");
        }, 1000);
      }
    }, 1000);
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTap = () => {
    pulseAnimation();
    // In a real app, track timing here. For now, just simulate success after 3 taps.
    // For prototype simplicity, we'll just immediately show success after one tap.
    setTimeout(() => {
      setPhase("feedback");
    }, 1500);
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
        {phase === "listen" && (
          <View style={styles.phaseContainer}>
            <Text style={styles.questionText}>LISTEN</Text>

            <View style={styles.centerArea}>
              <Animated.View
                style={[
                  styles.drumContainer,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Text style={styles.emoji}>🥁</Text>
              </Animated.View>
            </View>

            <View style={styles.footer}>
              <JiriButton
                title={isPlaying ? "Playing..." : "Play"}
                onPress={handlePlay}
                disabled={isPlaying}
                icon={
                  <Ionicons
                    name="volume-high"
                    size={24}
                    color={isPlaying ? Colors.secondaryText : Colors.lightText}
                  />
                }
              />
            </View>
          </View>
        )}

        {phase === "tap" && (
          <View style={styles.phaseContainer}>
            <Text style={styles.questionText}>Now tap with the beat</Text>

            <View style={styles.centerArea}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleTap}>
                <Animated.View
                  style={[
                    styles.drumContainer,
                    styles.drumActive,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Text style={styles.emoji}>🥁</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>Tap the drum!</Text>
          </View>
        )}

        {phase === "feedback" && (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.success },
              ]}
            >
              <Feather name="check" size={48} color={Colors.background} />
            </View>
            <Text style={[styles.feedbackText, { color: Colors.success }]}>
              Nice rhythm!
            </Text>

            <View style={[styles.footer, { width: "100%" }]}>
              <JiriButton title="Next" onPress={() => navigation.goBack()} />
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
    backgroundColor: Colors.danger, // Rhythm game theme color from Hub
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
  phaseContainer: {
    flex: 1,
  },
  questionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    marginTop: Spacing.l,
  },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drumContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.neutral,
    ...Layout.shadow,
  },
  drumActive: {
    borderColor: Colors.danger,
    backgroundColor: "#FFEBEE",
  },
  emoji: {
    fontSize: 100,
  },
  hintText: {
    ...Typography.body,
    textAlign: "center",
    color: Colors.danger,
    fontWeight: "700",
    marginBottom: Spacing.xxl,
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
