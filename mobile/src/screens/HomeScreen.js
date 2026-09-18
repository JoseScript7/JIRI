import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to JIRI</Text>
        <Text style={styles.subtitle}>Select an activity below to get started.</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('Games')}
        accessibilityLabel="Go to Activities and Games"
        accessibilityRole="button"
      >
        <Text style={styles.buttonTitle}>Go to Activities</Text>
        <Text style={styles.buttonDesc}>Play games to exercise your memory.</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]} 
        onPress={() => navigation.navigate('Caregiver')}
        accessibilityLabel="Go to Caregiver Dashboard"
        accessibilityRole="button"
      >
        <Text style={styles.buttonTitle}>Caregiver Dashboard</Text>
        <Text style={styles.buttonDesc}>View reports and history.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7', // Warm, high-contrast background
    padding: 24,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A2A2A', // Dark charcoal for high WCAG AAA contrast
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: '#424242',
    lineHeight: 28,
  },
  actionButton: {
    backgroundColor: '#FFFDF7',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00695C', // Deep teal, avoiding blue focus (AbilityNet)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButton: {
    borderColor: '#616161',
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 8,
  },
  buttonDesc: {
    fontSize: 18,
    color: '#424242',
  }
});
