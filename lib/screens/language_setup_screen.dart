import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import '../providers/language_preference.dart';
import 'choose_mode_screen.dart';

class LanguageSetupScreen extends StatefulWidget {
  const LanguageSetupScreen({Key? key}) : super(key: key);

  @override
  State<LanguageSetupScreen> createState() => _LanguageSetupScreenState();
}

class _LanguageSetupScreenState extends State<LanguageSetupScreen> {
  final LanguagePreference _languagePreference = LanguagePreference();
  String? _selectedLanguageCode;

  final List<Map<String, String>> _languages = [
    {'code': 'as', 'script': 'অসমীয়া', 'english': 'Assamese'},
    {'code': 'mni', 'script': 'মৈতৈলোন', 'english': 'Manipuri/Meitei'},
    {'code': 'brx', 'script': 'बड़ो', 'english': 'Bodo'},
    {'code': 'en', 'script': 'English', 'english': 'English'},
  ];

  @override
  void initState() {
    super.initState();
    // Initialize with whatever is currently in the provider
    _selectedLanguageCode = _languagePreference.selectedLanguageCode;
  }

  void _handleLanguageSelect(String code) {
    setState(() {
      _selectedLanguageCode = code;
    });
  }

  void _handleNext() {
    if (_selectedLanguageCode != null) {
      // Save state to provider
      _languagePreference.selectLanguage(_selectedLanguageCode!);
      
      Navigator.pushNamed(context, '/mode');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: JiriColors.primaryBlue),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title & Subtitle
              Text(
                'Choose your language',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'You can change this anytime',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 32),
              
              // Language List
              Expanded(
                child: ListView.separated(
                  itemCount: _languages.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final lang = _languages[index];
                    final isSelected = _selectedLanguageCode == lang['code'];
                    
                    return InkWell(
                      onTap: () => _handleLanguageSelect(lang['code']!),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: JiriColors.cardWhite,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? JiriColors.primaryBlue : Colors.transparent,
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lang['script']!,
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontSize: 22,
                                    color: isSelected ? JiriColors.primaryBlue : JiriColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  lang['english']!,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: JiriColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                            
                            // Radio circle showing selection state
                            Container(
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected ? JiriColors.primaryBlue : Colors.grey.shade400,
                                  width: 2,
                                ),
                                color: isSelected ? JiriColors.primaryBlue : Colors.transparent,
                              ),
                              child: isSelected 
                                ? const Icon(Icons.check, size: 18, color: Colors.white)
                                : null,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),
              
              // Offline-First Badge
              const Center(
                child: JiriStatusBadge(
                  text: 'OFFLINE-FIRST — Works without internet',
                  color: JiriColors.teal,
                  icon: Icons.wifi_off,
                ),
              ),
              
              const SizedBox(height: 32),

              // Bottom Next button
              JiriPrimaryButton(
                label: 'Next',
                backgroundColor: _selectedLanguageCode != null 
                  ? JiriColors.primaryBlue 
                  : Colors.grey.shade400,
                onPressed: _selectedLanguageCode != null ? _handleNext : null,
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
