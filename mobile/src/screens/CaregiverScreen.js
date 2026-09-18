import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CaregiverScreen() {
  return (
    <View style={styles.container}>
      {/* 
        This points to the JIRI Flow unified dashboard running on port 8000. 
        It integrates both JIRI Flow physical routine signals and Singify cognitive signals. 
      */}
      <WebView 
        source={{ uri: 'http://localhost:8000/static/dashboard.html' }} 
        style={styles.webview} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6EC',
  },
  webview: {
    flex: 1,
  },
});
