import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Colors, Typography, Spacing, Layout } from "../utils/DesignSystem";
import { TaskCard } from "../components/TaskCard";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TasksScreen({ navigation }) {
  // Hardcoded daily routine reflecting Blueprint J-12
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Feather
          name="arrow-left"
          size={32}
          color={Colors.primary}
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <Text style={styles.headerTitle}>My Day</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* PAST Tasks */}
        <View style={styles.timelineSection}>
          <TaskCard
            title="Wake"
            time="7:00 AM"
            state="past"
            icon={
              <Feather name="sunrise" size={28} color={Colors.secondaryText} />
            }
          />
          <TaskCard
            title="Breakfast"
            time="8:00 AM"
            state="past"
            icon={
              <Ionicons
                name="restaurant-outline"
                size={28}
                color={Colors.secondaryText}
              />
            }
          />
        </View>

        {/* NOW Task */}
        <View style={styles.timelineSection}>
          <TaskCard
            title="Medicine"
            time="10:00 AM"
            state="now"
            icon={
              <Ionicons
                name="medical-outline"
                size={32}
                color={Colors.primary}
              />
            }
            onPress={() => navigation.navigate("Task")} // Go to JIRI Flow single-step guide
          />
        </View>

        {/* FUTURE Tasks */}
        <View style={styles.timelineSection}>
          <TaskCard
            title="Walk"
            time="11:00 AM"
            state="next"
            icon={
              <Ionicons name="walk-outline" size={28} color={Colors.primary} />
            }
          />
          <TaskCard
            title="Lunch"
            time="1:00 PM"
            state="default"
            icon={
              <Ionicons
                name="restaurant-outline"
                size={28}
                color={Colors.text}
              />
            }
          />
          <TaskCard
            title="Sarah visit"
            time="3:00 PM"
            state="default"
            icon={
              <Ionicons name="people-outline" size={28} color={Colors.text} />
            }
          />
          <TaskCard
            title="Practice"
            time="5:00 PM"
            state="default"
            icon={
              <Ionicons name="fitness-outline" size={28} color={Colors.text} />
            }
          />
          <TaskCard
            title="Dinner"
            time="7:00 PM"
            state="default"
            icon={
              <Ionicons
                name="restaurant-outline"
                size={28}
                color={Colors.text}
              />
            }
          />
          <TaskCard
            title="Sleep"
            time="9:00 PM"
            state="default"
            icon={<Feather name="moon" size={28} color={Colors.text} />}
          />
        </View>
      </ScrollView>
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
    padding: Spacing.m,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  backIcon: {
    marginRight: Spacing.m,
  },
  headerTitle: {
    ...Typography.pageTitle,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  timelineSection: {
    marginBottom: Spacing.s,
  },
});
