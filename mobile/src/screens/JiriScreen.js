import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function JiriScreen() {
  return (
    <View style={styles.container}>
      {/* Assuming JIRI Flow runs some local UI or we can show a placeholder. 
          JIRI Flow is mostly backend and voice driven, but it does have the dashboard at 8000. 
          For the mobile interface, it would ideally be a native UI, but here we just show the dashboard. */}
      <WebView
        source={{ uri: "http://localhost:8000/static/configure.html" }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  webview: {
    flex: 1,
  },
});
