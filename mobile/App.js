import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SingifyScreen from './src/screens/SingifyScreen';
import MemoryGameScreen from './src/screens/MemoryGameScreen';
import RecallGameScreen from './src/screens/RecallGameScreen';
import CaregiverScreen from './src/screens/CaregiverScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for games to keep tab bar clean
function GamesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFDF7', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
        headerTitleStyle: { color: '#2A2A2A', fontSize: 24, fontWeight: '700' },
        headerTintColor: '#2A2A2A',
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="GamesHub" component={SingifyScreen} options={{ title: 'Activities' }} />
      <Stack.Screen name="MemoryGame" component={MemoryGameScreen} options={{ title: 'Memory Activity' }} />
      <Stack.Screen name="RecallGame" component={RecallGameScreen} options={{ title: 'Story Recall' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#2A2A2A',
            tabBarInactiveTintColor: '#757575',
            tabBarLabelStyle: { fontSize: 16, fontWeight: '600', paddingBottom: 5 },
            tabBarStyle: { backgroundColor: '#FFFDF7', height: 70 },
            headerStyle: { backgroundColor: '#FFFDF7', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
            headerTitleStyle: { color: '#2A2A2A', fontSize: 24, fontWeight: '700' },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home', tabBarIcon: () => null }} 
          />
          <Tab.Screen 
            name="Games" 
            component={GamesStack} 
            options={{ headerShown: false, tabBarIcon: () => null }} 
          />
          <Tab.Screen 
            name="Caregiver" 
            component={CaregiverScreen} 
            options={{ title: 'Dashboard', tabBarIcon: () => null }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
