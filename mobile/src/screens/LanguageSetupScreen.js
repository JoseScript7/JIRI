import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../utils/LanguageContext";

const LANGUAGES = [
  { id: "as", name: "অসমীয়া", subtitle: "Assamese" },
  { id: "mni", name: "মৈতৈলোন", subtitle: "Manipuri (Meitei)" },
  { id: "brx", name: "बड़ो", subtitle: "Bodo" },
  { id: "en", name: "English", subtitle: "(English)" },
];

export default function LanguageSetupScreen({ navigation }) {
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState(language || "en");

  const handleNext = () => {
    setLanguage(selected);
    navigation.navigate("ChooseMode");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.subtitle}>You can change this anytime</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.langCard,
              selected === lang.id && styles.langCardSelected,
            ]}
            onPress={() => setSelected(lang.id)}
          >
            <View style={styles.langTextContainer}>
              <Text
                style={[
                  styles.langPrimary,
                  selected === lang.id && styles.langPrimarySelected,
                ]}
              >
                {lang.name}
              </Text>
              <Text style={styles.langSecondary}>{lang.subtitle}</Text>
            </View>
            <View
              style={[
                styles.radioIndicator,
                selected === lang.id && styles.radioIndicatorSelected,
              ]}
            >
              {selected === lang.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.offlineNote}>
          <Feather name="wifi-off" size={20} color={Colors.success} />
          <View style={styles.offlineNoteTextContainer}>
            <Text style={styles.offlineNoteTitle}>OFFLINE-FIRST</Text>
            <Text style={styles.offlineNoteDesc}>Works without internet</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl * 1.5,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.pageTitle,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.secondaryText,
  },
  listContainer: {
    flex: 1,
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.l,
    borderRadius: Layout.borderRadius,
    borderWidth: 2,
    borderColor: Colors.neutral,
    marginBottom: Spacing.m,
    backgroundColor: Colors.cardBackground,
  },
  langCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F7FF",
  },
  langTextContainer: {
    flex: 1,
  },
  langPrimary: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  langPrimarySelected: {
    color: Colors.primary,
  },
  langSecondary: {
    ...Typography.secondaryText,
  },
  radioIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral,
    justifyContent: "center",
    alignItems: "center",
  },
  radioIndicatorSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
  offlineNote: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.m,
  },
  offlineNoteTextContainer: {
    marginLeft: Spacing.m,
  },
  offlineNoteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.success,
    letterSpacing: 0.5,
  },
  offlineNoteDesc: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonHeight / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    ...Typography.buttonLabel,
  },
});
