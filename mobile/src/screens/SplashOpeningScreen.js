import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";

export default function SplashOpeningScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Jiri</Text>
      </View>

      <View style={styles.artworkContainer}>
        {/* Placeholder for the JIRI artwork from the blueprint */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&h=800&fit=crop",
          }}
          style={styles.artwork}
          resizeMode="cover"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.tagline}>Memory travels</Text>
        <Text style={styles.tagline}>with you</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Meaning")}
        >
          <Text style={styles.buttonText}>Let's begin →</Text>
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
    justifyContent: "space-between",
    paddingTop: Spacing.xxl * 1.5,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  logoText: {
    fontSize: 72,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -2,
  },
  artworkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: Layout.borderRadius,
  },
  footer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  tagline: {
    ...Typography.body,
    fontSize: 22,
    color: Colors.primary,
    fontWeight: "600",
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonHeight / 2, // Fully rounded like blueprint
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xxl,
  },
  buttonText: {
    ...Typography.buttonLabel,
  },
});
