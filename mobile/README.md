# JIRI Mobile App

This is an Expo React Native application that wraps the **JIRI Flow** and **Singify** web applications into a single, unified mobile experience for elder care.

## Architecture

To rapidly prototype the unified mobile experience, this app uses `react-native-webview` to embed the local web interfaces served by the respective backends:
1. **JIRI Flow**: Native UI wrapping the configuration and routing logic.
2. **Singify**: The interactive Karaoke and Cognitive Games hub.
3. **Caregiver Dashboard**: A unified timeline merging physical routine signals (from JIRI Flow) and cognitive signals (from Singify).

## Running the App

1. Ensure both backends are running:
   - JIRI Flow: `cd ../jiri-flow && python -m app.api.server`
   - Singify Backend: `cd ../singify/backend && npm run dev`
   - Singify Frontend: `cd ../singify/frontend && npm run dev`
2. Start the Expo mobile app:
   ```bash
   cd mobile
   npm run start
   ```
3. Use the Expo Go app on your phone, or press `i` to open in iOS simulator, or `a` for Android emulator.
