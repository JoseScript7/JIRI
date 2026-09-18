import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import JiriScreen from './src/screens/JiriScreen';
import SingifyScreen from './src/screens/SingifyScreen';
import CaregiverScreen from './src/screens/CaregiverScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#0D6E6E',
            tabBarInactiveTintColor: '#94a3b8',
            headerStyle: { backgroundColor: '#FDF6EC' },
            headerTitleStyle: { color: '#0D6E6E', fontWeight: '700' },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home', tabBarIcon: () => null }} 
          />
          <Tab.Screen 
            name="JIRI" 
            component={JiriScreen} 
            options={{ title: 'JIRI Routine', tabBarIcon: () => null }} 
          />
          <Tab.Screen 
            name="Singify" 
            component={SingifyScreen} 
            options={{ title: 'Singify', tabBarIcon: () => null }} 
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
