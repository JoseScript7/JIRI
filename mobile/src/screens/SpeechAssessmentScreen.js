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

export default function SpeechAssessmentScreen({ navigation }) {
  const [phase, setPhase] = useState("prompt"); // 'prompt', 'recording', 'saved'
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = () => {
    setPhase("recording");
    let time = 0;
    // Simulate recording timer
    const interval = setInterval(() => {
      time++;
      setRecordingTime(time);
      if (time >= 15) {
        // Auto stop after 15s for demo
        clearInterval(interval);
        handleStop();
      }
    }, 1000);
  };

  const handleStop = () => {
    setPhase("saved");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
        <Text style={styles.headerTitle}>My Voice</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        {phase === "prompt" && (
          <View style={styles.content}>
            <Text style={styles.promptText}>
              Look at this picture.{"\n"}What do you see?
            </Text>

            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&h=600&fit=crop",
              }} // Example: nature landscape
              style={styles.promptImage}
            />

            <TouchableOpacity style={styles.micButton} onPress={startRecording}>
              <Ionicons name="mic" size={48} color={Colors.lightText} />
              <Text style={styles.micButtonText}>Tap to talk</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === "recording" && (
          <View style={styles.content}>
            <Text style={styles.listeningText}>Listening...</Text>

            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

            <View style={styles.waveformContainer}>
              {/* Fake waveform bars */}
              {[...Array(15)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    { height: 20 + Math.random() * 40 },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Ionicons name="square" size={32} color={Colors.lightText} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === "saved" && (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Feather name="check" size={48} color={Colors.success} />
            </View>

            <Text style={styles.savedTitle}>Your story is saved.</Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Feather name="smartphone" size={24} color={Colors.primary} />
                <Text style={styles.featureText}>On this phone</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="wifi-off" size={24} color={Colors.success} />
                <Text style={styles.featureText}>No internet needed</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <JiriButton title="Done" onPress={() => navigation.goBack()} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.m,
    paddingTop: Spacing.xl,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.primary,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText: {
    ...Typography.pageTitle,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 36,
  },
  promptImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: Layout.borderRadius,
    marginBottom: Spacing.xxl,
    backgroundColor: Colors.neutral,
  },
  micButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.attention,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 40,
    ...Layout.shadow,
  },
  micButtonText: {
    ...Typography.buttonLabel,
    marginLeft: Spacing.m,
  },
  listeningText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.attention,
    marginBottom: Spacing.xl,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "300",
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginBottom: Spacing.xxl * 2,
  },
  waveformBar: {
    width: 6,
    backgroundColor: Colors.primary,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 40,
    ...Layout.shadow,
  },
  stopButtonText: {
    ...Typography.buttonLabel,
    marginLeft: Spacing.m,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  savedTitle: {
    ...Typography.pageTitle,
    marginBottom: Spacing.xxl,
  },
  featureList: {
    width: "100%",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  featureText: {
    ...Typography.body,
    fontWeight: "600",
    marginLeft: Spacing.m,
  },
  footer: {
    marginTop: "auto",
    width: "100%",
  },
});
