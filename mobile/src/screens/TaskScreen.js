import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { JiriButton } from "../components/JiriButton";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TaskScreen({ navigation, route }) {
  // Hardcoded JIRI Flow state for the "Medicine" task (Blueprint J-14)
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(2);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigation.navigate("MainTabs"); // Done
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack(); // Back to timeline
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={32} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Step {currentStep} of {totalSteps}
        </Text>
        <View style={{ width: 32 }} /> {/* Balance the flex layout */}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Large Visual Cue */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&h=600&fit=crop",
            }}
            style={styles.taskImage}
            resizeMode="cover"
          />
        </View>

        {/* Text Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Take 1 tablet with water.</Text>
        </View>

        {/* Voice Play Button */}
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="volume-high" size={32} color={Colors.lightText} />
          <Text style={styles.voiceButtonText}>Play</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Persistent Footer Actions */}
      <View style={styles.footer}>
        <JiriButton title="Done ✓" variant="success" onPress={handleNext} />
        <View style={styles.footerSpacer} />
        <JiriButton
          title="Need help?"
          variant="outline"
          icon={
            <Ionicons
              name="help-buoy-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => navigation.navigate("Help")}
        />
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
  backButton: {
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
    padding: Spacing.xl,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: Layout.borderRadius,
    overflow: "hidden",
    backgroundColor: Colors.neutral,
    marginBottom: Spacing.xl,
    ...Layout.shadow,
  },
  taskImage: {
    width: "100%",
    height: "100%",
  },
  instructionContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.m,
  },
  instructionText: {
    ...Typography.pageTitle,
    textAlign: "center",
    lineHeight: 40,
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    borderRadius: 32,
    ...Layout.shadow,
  },
  voiceButtonText: {
    ...Typography.buttonLabel,
    marginLeft: Spacing.s,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral,
    backgroundColor: Colors.background,
  },
  footerSpacer: {
    height: Spacing.m,
  },
});
