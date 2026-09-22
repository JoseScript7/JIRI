import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function PatientProfileSetupScreen({ navigation }) {
  const [name, setName] = useState("Dadu");
  const [village, setVillage] = useState("Kohima");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Let's set up your profile</Text>
        <Text style={styles.subtitle}>This helps JIRI be personal</Text>
      </View>

      <View style={styles.photoSection}>
        <View style={styles.photoContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={20} color={Colors.lightText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Dadu"
        />

        <Text style={styles.label}>Your village / town</Text>
        <TextInput
          style={styles.input}
          value={village}
          onChangeText={setVillage}
          placeholder="e.g. Kohima"
        />

        <Text style={styles.label}>A family member / caregiver</Text>
        <View style={styles.inputLike}>
          <Text style={styles.inputText}>Lila (Daughter)</Text>
          <Feather
            name="chevron-right"
            size={24}
            color={Colors.secondaryText}
          />
        </View>

        <Text style={styles.label}>Familiar places</Text>
        <View style={styles.placesRow}>
          <View style={styles.placeBadge}>
            <Ionicons name="home" size={24} color={Colors.primary} />
            <Text style={styles.placeText}>Home</Text>
          </View>
          <View style={styles.placeBadge}>
            <Ionicons name="business" size={24} color={Colors.primary} />
            <Text style={styles.placeText}>Church</Text>
          </View>
          <View style={styles.placeBadge}>
            <Ionicons name="cart" size={24} color={Colors.primary} />
            <Text style={styles.placeText}>Market</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MainTabs")} // Simulating going to patient home
        >
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  title: {
    ...Typography.pageTitle,
    fontSize: 28,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.secondaryText,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  photoContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.s,
    marginTop: Spacing.m,
  },
  input: {
    backgroundColor: Colors.neutral,
    borderRadius: Layout.borderRadius,
    padding: Spacing.m,
    ...Typography.body,
    height: 56,
  },
  inputLike: {
    backgroundColor: Colors.neutral,
    borderRadius: Layout.borderRadius,
    padding: Spacing.m,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  placesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  placeBadge: {
    alignItems: "center",
    backgroundColor: Colors.blockLightBlue,
    padding: Spacing.m,
    borderRadius: Layout.borderRadius,
    width: "30%",
  },
  placeText: {
    ...Typography.secondaryText,
    marginTop: Spacing.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  footer: {
    paddingBottom: Spacing.xxl,
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
