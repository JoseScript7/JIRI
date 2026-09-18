import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>JIRI & Singify</Text>
      <Text style={styles.subtitle}>Mobile Integration Prototype</Text>
      
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JIRI')}>
        <Text style={styles.cardTitle}>JIRI Flow</Text>
        <Text style={styles.cardDesc}>Morning Routine Assistance</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Singify')}>
        <Text style={styles.cardTitle}>Singify</Text>
        <Text style={styles.cardDesc}>Karaoke & Cognitive Games</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6EC',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D6E6E',
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F0D9B5',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
  }
});
