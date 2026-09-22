import 'package:flutter/foundation.dart';

/// A simple singleton provider class to store the language preference
/// so that it can be referenced across different screens easily.
class LanguagePreference extends ChangeNotifier {
  static final LanguagePreference _instance = LanguagePreference._internal();
  
  factory LanguagePreference() {
    return _instance;
  }
  
  LanguagePreference._internal();

  String? _selectedLanguageCode;

  String? get selectedLanguageCode => _selectedLanguageCode;

  void selectLanguage(String code) {
    _selectedLanguageCode = code;
    notifyListeners();
  }
}
