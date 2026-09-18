import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function SingifyScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      <Text style={styles.subtitle}>Select an activity below.</Text>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('MemoryGame')}
        accessibilityLabel="Start Memory Activity"
        accessibilityRole="button"
      >
        <Text style={styles.buttonTitle}>Memory Activity</Text>
        <Text style={styles.buttonDesc}>Remember a sequence of words.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('RecallGame')}
        accessibilityLabel="Start Story Recall Activity"
        accessibilityRole="button"
      >
        <Text style={styles.buttonTitle}>Story Recall</Text>
        <Text style={styles.buttonDesc}>Listen to a story and retell it using your voice.</Text>
      </TouchableOpacity>
      
      {/* Note: Other games would follow the same pattern here. Focusing on Memory and Recall for the prototype as requested. */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: '#424242',
    lineHeight: 28,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#FFFDF7',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00695C', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
