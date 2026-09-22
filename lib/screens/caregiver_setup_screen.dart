import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import 'patient_home_screen.dart';

class CaregiverSetupScreen extends StatelessWidget {
  const CaregiverSetupScreen({Key? key}) : super(key: key);

  void _handleRowTap(BuildContext context, String title) {
    // Stub navigation to a placeholder configuration screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: Text(title)),
          body: Center(child: Text('Configure $title')),
        ),
      ),
    );
  }

  void _handleNext(BuildContext context) {
    Navigator.pushReplacementNamed(context, '/home');
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
                'Set up caregiver support',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'This helps keep them safe and connected',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 32),

              // Vertically scrollable list of setup items
              Expanded(
                child: ListView(
                  children: [
                    _buildSetupRow(
                      context: context,
                      icon: Icons.people,
                      iconColor: JiriColors.primaryBlue,
                      title: 'Family contacts',
                      subtitle: 'Add people',
                    ),
                    const SizedBox(height: 16),
                    _buildSetupRow(
                      context: context,
                      icon: Icons.access_time, // clock substitute
                      iconColor: JiriColors.orangeAmber,
                      title: 'Daily routine',
                      subtitle: 'Set activities',
                    ),
                    const SizedBox(height: 16),
                    _buildSetupRow(
                      context: context,
                      icon: Icons.medication,
                      iconColor: JiriColors.redCoral,
                      title: 'Medications',
                      subtitle: 'Add reminders',
                    ),
                    const SizedBox(height: 16),
                    _buildSetupRow(
                      context: context,
                      icon: Icons.home,
                      iconColor: JiriColors.green,
                      title: 'Home safe zone',
                      subtitle: 'Set location',
                    ),
                    const SizedBox(height: 16),
                    _buildSetupRow(
                      context: context,
                      icon: Icons.chat_bubble_outline,
                      iconColor: JiriColors.purple,
                      title: 'Language & voice',
                      subtitle: 'Assamese · Female voice',
                    ),
                    // Extra padding at bottom of list
                    const SizedBox(height: 16),
                  ],
                ),
              ),

              const SizedBox(height: 16),
              
              // Bottom Next button
              JiriPrimaryButton(
                label: 'Next',
                onPressed: () => _handleNext(context),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSetupRow({
    required BuildContext context,
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
  }) {
    return InkWell(
      onTap: () => _handleRowTap(context, title),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: JiriColors.cardWhite,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: JiriColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
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
            const Icon(
              Icons.chevron_right,
              color: JiriColors.textSecondary,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}
