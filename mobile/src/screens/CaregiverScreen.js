import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function CaregiverScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/log');
      setLogs(res.data);
    } catch (err) {
      console.warn("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => {
    const isSingify = item.source === 'singify';
    return (
      <View style={[styles.logCard, isSingify ? styles.cardSingify : styles.cardJiri]}>
        <View style={styles.logHeader}>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
          <View style={[styles.badge, isSingify ? styles.badgeSingify : styles.badgeJiri]}>
            <Text style={[styles.badgeText, isSingify ? styles.badgeTextSingify : styles.badgeTextJiri]}>
              {item.source.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.eventTypeText}>{item.event_type.replace(/_/g, ' ')}</Text>
        <Text style={styles.detailsText}>{item.details}</Text>
      </View>
    );
  };

  if (loading && logs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00695C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No events recorded yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginTop: 40,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardJiri: {
    borderLeftColor: '#1976D2',
  },
  cardSingify: {
    borderLeftColor: '#C2185B',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeJiri: {
    backgroundColor: '#E3F2FD',
  },
  badgeSingify: {
    backgroundColor: '#FCE4EC',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeTextJiri: {
    color: '#1976D2',
  },
  badgeTextSingify: {
    color: '#C2185B',
  },
  eventTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  }
});
