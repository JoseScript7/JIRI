import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";

export default function PeopleScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PEOPLE I KNOW</Text>

      <View style={styles.grid}>
        {/* Sarah */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>PHOTO</Text>
          </View>
          <Text style={styles.nameText}>Sarah</Text>
          <Text style={styles.relationText}>Daughter</Text>
        </TouchableOpacity>

        {/* David */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>PHOTO</Text>
          </View>
          <Text style={styles.nameText}>David</Text>
          <Text style={styles.relationText}>Son</Text>
        </TouchableOpacity>

        {/* Mary */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>PHOTO</Text>
          </View>
          <Text style={styles.nameText}>Mary</Text>
          <Text style={styles.relationText}>Doctor</Text>
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
  title: {
    ...Typography.pageTitle,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: Colors.cardBackground,
    borderRadius: Layout.borderRadius,
    padding: Spacing.m,
    marginBottom: Spacing.l,
    alignItems: "center",
    ...Layout.shadow,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  imageText: {
    color: Colors.textSecondary,
    fontWeight: "bold",
  },
  nameText: {
    ...Typography.body,
    fontWeight: "bold",
  },
  relationText: {
    ...Typography.secondaryText,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
});
