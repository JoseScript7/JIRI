import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class ClosingScreen extends StatelessWidget {
  const ClosingScreen({Key? key}) : super(key: key);

  void _handleFinish(BuildContext context) {
    debugPrint('Closing Screen Stub: Navigating to Main App or popping to Settings');
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: JiriColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: JiriColors.primaryBlue),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Splash-style Illustration (River/Wave with figures)
              Container(
                height: 240,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [JiriColors.primaryBlue, JiriColors.teal],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: JiriColors.primaryBlue.withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    )
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Decorative Wave Background
                    Positioned(
                      bottom: 0,
                      child: Icon(
                        Icons.waves,
                        size: 200,
                        color: Colors.white.withOpacity(0.1),
                      ),
                    ),
                    // Figures representing JIRI and the Patient
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Icon(Icons.person, size: 80, color: Colors.white.withOpacity(0.9)),
                        const SizedBox(width: 8),
                        Icon(Icons.person_outline, size: 60, color: Colors.white.withOpacity(0.7)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // 2. Title
              Text(
                'JIRI Stays with you',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  color: JiriColors.primaryBlue,
                ),
              ),
              const SizedBox(height: 24),

              // 3. Core Pillars (Bullet List)
              _buildBullet(Icons.language, 'In your language'),
              _buildBullet(Icons.wifi_off, 'Offline-first'),
              _buildBullet(Icons.people, 'Caregiver-connected'),
              _buildBullet(Icons.shield, 'Your data, your privacy'),
              const SizedBox(height: 8),
              
              // 4. Verbatim Safety Disclaimer (Mandatory)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: JiriColors.primaryBlue.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: JiriColors.primaryBlue.withOpacity(0.2)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info_outline, color: JiriColors.primaryBlue, size: 24),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        'Support tool, not a diagnosis — always consult a healthcare professional',
                        style: TextStyle(
                          color: Colors.grey.shade800,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 48),

              // 5. Primary Button
              JiriPrimaryButton(
                label: 'Together for brighter tomorrows →',
                onPressed: () => _handleFinish(context),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBullet(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: JiriColors.primaryBlue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: JiriColors.primaryBlue, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: JiriColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
