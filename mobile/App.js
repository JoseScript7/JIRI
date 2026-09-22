import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LanguageProvider } from "./src/utils/LanguageContext";

// Phase 2-6: Onboarding & Setup
import SplashOpeningScreen from "./src/screens/SplashOpeningScreen";
import MeaningScreen from "./src/screens/MeaningScreen";
import LanguageSetupScreen from "./src/screens/LanguageSetupScreen";
import ChooseModeScreen from "./src/screens/ChooseModeScreen";
import PatientProfileSetupScreen from "./src/screens/PatientProfileSetupScreen";
import CaregiverSetupScreen from "./src/screens/CaregiverSetupScreen";

// Phase 7-9: Core Patient Hub
import HomeScreen from "./src/screens/HomeScreen";
import PeopleScreen from "./src/screens/PeopleScreen";
import MemoriesScreen from "./src/screens/MemoriesScreen";
import HelpScreen from "./src/screens/HelpScreen";

// Phase 10: Guided Tasks
import TasksScreen from "./src/screens/TasksScreen";
import TaskScreen from "./src/screens/TaskScreen";

// Phase 11: Games & Practice
import PracticeHubScreen from "./src/screens/PracticeHubScreen";
import RecallGameScreen from "./src/screens/RecallGameScreen";
import RhythmGameScreen from "./src/screens/RhythmGameScreen";
import MemoryGameScreen from "./src/screens/MemoryGameScreen";
import PicMatchGameScreen from "./src/screens/PicMatchGameScreen";
import FillInBlanksScreen from "./src/screens/FillInBlanksScreen";

// Phase 12-13: Media & Voice
import SpeechAssessmentScreen from "./src/screens/SpeechAssessmentScreen";
import SingifyScreen from "./src/screens/SingifyScreen";

// Phase 18: Caregiver & ASHA Dashboards
import CaregiverScreen from "./src/screens/CaregiverScreen";
import AshaScreen from "./src/screens/AshaScreen";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["http://localhost:8081", "exp://"],
  config: {
    screens: {
      SplashOpening: "",
      Meaning: "meaning",
      LanguageSetup: "language",
      ChooseMode: "mode",
      PatientProfileSetup: "patient-setup",
      CaregiverSetup: "caregiver-setup",
      MainTabs: "home", // Keeping MainTabs route name for compatibility temporarily
      People: "people",
      Memories: "memories",
      Help: "help",
      Tasks: "myday",
      Task: "task",
      PracticeHub: "practice",
      RecallGame: "game/recall",
      RhythmGame: "game/rhythm",
      MemoryGame: "game/memory",
      PicMatchGame: "game/picmatch",
      FillInBlanks: "game/fillinblanks",
      SpeechAssessment: "assessment/speech",
      Singify: "singify",
      Caregiver: "caregiver/dashboard",
      Asha: "asha",
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LanguageProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="SplashOpening"
          >
            {/* Onboarding Flow */}
            <Stack.Screen
              name="SplashOpening"
              component={SplashOpeningScreen}
            />
            <Stack.Screen name="Meaning" component={MeaningScreen} />
            <Stack.Screen
              name="LanguageSetup"
              component={LanguageSetupScreen}
            />
            <Stack.Screen name="ChooseMode" component={ChooseModeScreen} />
            <Stack.Screen
              name="PatientProfileSetup"
              component={PatientProfileSetupScreen}
            />
            <Stack.Screen
              name="CaregiverSetup"
              component={CaregiverSetupScreen}
            />

            {/* Core Patient Hub (Replaces old MainTabs) */}
            <Stack.Screen name="MainTabs" component={HomeScreen} />
            <Stack.Screen name="People" component={PeopleScreen} />
            <Stack.Screen name="Memories" component={MemoriesScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />

            {/* Tasks / JIRI Flow */}
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen name="Task" component={TaskScreen} />

            {/* Game Screens */}
            <Stack.Screen name="PracticeHub" component={PracticeHubScreen} />
            <Stack.Screen name="RecallGame" component={RecallGameScreen} />
            <Stack.Screen name="RhythmGame" component={RhythmGameScreen} />
            <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
            <Stack.Screen name="PicMatchGame" component={PicMatchGameScreen} />
            <Stack.Screen name="FillInBlanks" component={FillInBlanksScreen} />

            {/* Media & Voice */}
            <Stack.Screen
              name="SpeechAssessment"
              component={SpeechAssessmentScreen}
            />
            <Stack.Screen name="Singify" component={SingifyScreen} />

            {/* Caregiver & ASHA Dashboards */}
            <Stack.Screen name="Caregiver" component={CaregiverScreen} />
            <Stack.Screen name="Asha" component={AshaScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
