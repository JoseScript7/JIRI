import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'theme/jiri_theme.dart';
import 'providers/language_preference.dart';
import 'providers/user_mode_provider.dart';

// Import all screens
import 'screens/meaning_screen.dart';
import 'screens/language_setup_screen.dart';
import 'screens/choose_mode_screen.dart';
import 'screens/patient_profile_screen.dart';
import 'screens/caregiver_setup_screen.dart';
import 'screens/patient_home_screen.dart';
import 'screens/my_day_screen.dart';
import 'screens/memories_screen.dart';
import 'screens/practice_hub_screen.dart';
import 'screens/help_screen.dart';
import 'screens/games/pic_match_screen.dart';
import 'screens/games/sequence_screen.dart';
import 'screens/games/rhythm_screen.dart';
import 'screens/voice_journal_screen.dart';
import 'screens/offline_sync_screen.dart';
import 'screens/caregiver_dashboard_screen.dart';
import 'screens/closing_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguagePreference()),
        ChangeNotifierProvider(create: (_) => UserModeProvider()),
      ],
      child: const JiriApp(),
    ),
  );
}

class JiriApp extends StatelessWidget {
  const JiriApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JIRI',
      theme: JiriTheme.themeData,
      initialRoute: '/',
      routes: {
        '/': (context) => const MeaningScreen(),
        '/language': (context) => const LanguageSetupScreen(),
        '/mode': (context) => const ChooseModeScreen(),
        '/patient_setup': (context) => const PatientProfileScreen(),
        '/caregiver_setup': (context) => const CaregiverSetupScreen(),
        '/home': (context) => const PatientHomeScreen(),
        '/my_day': (context) => const MyDayScreen(),
        '/memories': (context) => const MemoriesScreen(),
        '/practice': (context) => const PracticeHubScreen(),
        '/help': (context) => const HelpScreen(),
        '/pic_match': (context) => const PicMatchScreen(),
        '/sequence': (context) => const SequenceScreen(),
        '/rhythm': (context) => const RhythmScreen(),
        '/voice_journal': (context) => const VoiceJournalScreen(),
        '/offline_sync': (context) => const OfflineSyncScreen(),
        '/caregiver_dashboard': (context) => const CaregiverDashboardScreen(),
        '/closing': (context) => const ClosingScreen(),
      },
    );
  }
}
