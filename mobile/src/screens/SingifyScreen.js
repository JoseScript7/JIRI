import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function SingifyScreen() {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'http://localhost:5173/' }} 
        style={styles.webview} 
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
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
