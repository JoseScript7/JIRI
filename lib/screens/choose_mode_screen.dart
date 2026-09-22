import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import '../providers/user_mode_provider.dart';
import 'patient_profile_screen.dart';
import 'caregiver_setup_screen.dart';

class ChooseModeScreen extends StatelessWidget {
  const ChooseModeScreen({Key? key}) : super(key: key);

  void _handleModeSelect(BuildContext context, UserMode mode) {
    // Store the selected mode
    UserModeProvider().setMode(mode);
    
    // Route to appropriate setup flow based on mode
    String nextRoute = mode == UserMode.patientSelf ? '/patient_setup' : '/caregiver_setup';
    Navigator.pushNamed(context, nextRoute);
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
              Text(
                'How will you use JIRI?',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 48),

              // "For me" Card
              _buildModeCard(
                context: context,
                mode: UserMode.patientSelf,
                title: 'For me',
                subtitle: 'I want to use JIRI on my own',
                icon: Icons.elderly,
                color: JiriColors.orangeAmber,
                onTap: () => _handleModeSelect(context, UserMode.patientSelf),
              ),

              const SizedBox(height: 24),

              // "For someone I care for" Card
              _buildModeCard(
                context: context,
                mode: UserMode.caregiverSetup,
                title: 'For someone I care for',
                subtitle: 'I am setting up for my family member',
                icon: Icons.family_restroom,
                color: JiriColors.green,
                onTap: () => _handleModeSelect(context, UserMode.caregiverSetup),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModeCard({
    required BuildContext context,
    required UserMode mode,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3), width: 2),
        ),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 36),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: JiriColors.textPrimary,
                      fontSize: 22,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: JiriColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(Icons.arrow_forward_ios, color: color, size: 24),
          ],
        ),
      ),
    );
  }
}
