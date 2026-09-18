import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function MemoryGameScreen() {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  // Fetch words directly from the backend
  const fetchWords = async () => {
    setLoading(true);
    try {
      // In a real app, use the actual IP of the machine if not running web
      const res = await axios.get('http://localhost:4000/api/games/memory');
      setWords(res.data.words || ['Apple', 'Book', 'Car']);
      setCurrentIndex(0);
      setFinished(false);
    } catch (err) {
      console.warn("Failed to fetch words, using fallbacks.", err);
      setWords(['Apple', 'Book', 'Car']);
      setCurrentIndex(0);
      setFinished(false);
    } finally {
      setLoading(false);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00695C" />
        <Text style={styles.infoText}>Loading words...</Text>
      </View>
    );
  }

  // Initial State
  if (currentIndex === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>You will see a list of words one by one. Try to remember them.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={fetchWords} accessibilityLabel="Start Activity">
          <Text style={styles.buttonText}>Start Activity</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Finished State
  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>That was the last word.</Text>
        <Text style={styles.instruction}>Please tell your caregiver the words you remember.</Text>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentIndex(-1)} accessibilityLabel="Restart Activity">
          <Text style={styles.buttonTextDark}>Restart Activity</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Active State: Showing one word at a time, large and high contrast (COGA Guidelines)
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{words[currentIndex]}</Text>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={nextWord} accessibilityLabel="Show Next Word">
        <Text style={styles.buttonText}>Show Next Word</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    padding: 24,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 24,
    color: '#2A2A2A',
    marginBottom: 40,
    lineHeight: 34,
    textAlign: 'left', // Left aligned to avoid "rivers of white"
  },
  infoText: {
    fontSize: 20,
    color: '#2A2A2A',
    marginTop: 20,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 64, // Massive typography for low vision
    fontWeight: 'bold',
    color: '#2A2A2A',
  },
  primaryButton: {
    backgroundColor: '#00695C', // Deep teal
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#00695C',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // High contrast white on teal
  },
  buttonTextDark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2A2A',
  }
});
