import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { Feather } from "@expo/vector-icons";

export default function MeaningScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Jiri</Text>
        <Text style={styles.subtitle}>More than</Text>
        <Text style={styles.subtitle}>a name</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.listItem}>
          <Feather
            name="map"
            size={24}
            color={Colors.primary}
            style={styles.icon}
          />
          <Text style={styles.listText}>
            Inspired by Northeast India — our people, our hills, our stories.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Feather
            name="activity"
            size={24}
            color={Colors.attention}
            style={styles.icon}
          />
          <Text style={styles.listText}>
            Dementia and memory loss are rising among our elderly.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Feather
            name="wifi-off"
            size={24}
            color={Colors.success}
            style={styles.icon}
          />
          <Text style={styles.listText}>
            Remote terrain and low connectivity often isolate families.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Feather
            name="heart"
            size={24}
            color={Colors.primary}
            style={styles.icon}
          />
          <Text style={styles.listText}>
            JIRI helps you stay connected, supported and independent.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LanguageSetup")}
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
    paddingTop: Spacing.xxl * 1.5,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  logoText: {
    fontSize: 56,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -1.5,
    marginBottom: Spacing.s,
  },
  subtitle: {
    ...Typography.pageTitle,
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    alignItems: "flex-start",
  },
  icon: {
    marginRight: Spacing.m,
    marginTop: 4,
  },
  listText: {
    ...Typography.body,
    flex: 1,
  },
  footer: {
    paddingBottom: Spacing.xl,
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
