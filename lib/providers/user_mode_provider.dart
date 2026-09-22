import 'package:flutter/foundation.dart';

enum UserMode {
  patientSelf,
  caregiverSetup,
}

class UserModeProvider extends ChangeNotifier {
  static final UserModeProvider _instance = UserModeProvider._internal();
  
  factory UserModeProvider() {
    return _instance;
  }
  
  UserModeProvider._internal();

  UserMode? _selectedMode;

  UserMode? get selectedMode => _selectedMode;

  void setMode(UserMode mode) {
    _selectedMode = mode;
    notifyListeners();
  }
}
