import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import 'language_setup_screen.dart';

class MeaningScreen extends StatelessWidget {
  const MeaningScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              
              // Top: "Jiri" small heading + leaf icon
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'JIRI',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: JiriColors.primaryBlue,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.eco, color: JiriColors.green, size: 22),
                ],
              ),
              const SizedBox(height: 12),
              
              // Large bold title
              Text(
                'More than a name',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 48),

              // Three bullet rows
              _buildBulletRow(
                context: context,
                icon: Icons.psychology,
                iconColor: JiriColors.purple,
                text: 'Dementia and memory loss are rising among our elderly.',
              ),
              const SizedBox(height: 32),
              
              _buildBulletRow(
                context: context,
                icon: Icons.terrain,
                iconColor: JiriColors.orangeAmber,
                text: 'Remote terrain and low connectivity often isolate families.',
              ),
              const SizedBox(height: 32),
              
              _buildBulletRow(
                context: context,
                icon: Icons.favorite,
                iconColor: JiriColors.redCoral,
                text: 'JIRI helps you stay connected, supported and independent.',
              ),
              
              const Spacer(),

              // Bottom: full-width primary blue button
              JiriPrimaryButton(
                label: 'Let\'s begin →',
                backgroundColor: JiriColors.primaryBlue,
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/language');
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBulletRow({
    required BuildContext context,
    required IconData icon,
    required Color iconColor,
    required String text,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 30),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 4.0),
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                height: 1.5, // Improves readability for multi-line text
                color: JiriColors.textPrimary,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
