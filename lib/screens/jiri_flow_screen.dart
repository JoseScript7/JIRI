import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class JiriFlowScreen extends StatelessWidget {
  final String instructionText;
  final IconData contextIcon;

  const JiriFlowScreen({
    Key? key,
    required this.instructionText,
    required this.contextIcon,
  }) : super(key: key);

  void _handlePlayAudio() {
    // Stub for playing TTS/audio instruction locally
    debugPrint('JIRI Flow Stub: Playing instruction audio -> "$instructionText"');
  }

  void _handleDone(BuildContext context) {
    // Stub for advancing the JIRI Flow local state machine engine
    debugPrint('JIRI Flow Stub: Step marked as done. Triggering state machine evaluation...');
    Navigator.pop(context); // Temporarily pop back to previous screen
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Branding & Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'JIRI Flow',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  color: JiriColors.primaryBlue,
                  letterSpacing: 1.2,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Guides you, step by step',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: JiriColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            
            // Status Badge
            const JiriStatusBadge(
              text: 'Offline AI',
              color: JiriColors.purple,
              icon: Icons.memory,
            ),
            const SizedBox(height: 32),

            // Task Context Illustration Area
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24.0),
              height: 240,
              width: double.infinity,
              decoration: BoxDecoration(
                color: JiriColors.cardWhite,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.grey.shade200, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Center(
                child: Icon(
                  contextIcon, 
                  size: 140,
                  color: JiriColors.primaryBlue.withOpacity(0.2),
                ),
              ),
            ),
            
            const Spacer(flex: 1),

            // Instruction Label
            Text(
              'Next step',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: JiriColors.textSecondary,
                letterSpacing: 1.5,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            
            // Actual Bold Instruction Text
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                instructionText,
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                  color: JiriColors.textPrimary,
                  height: 1.3, // Enhanced readability for multi-line
                ),
                textAlign: TextAlign.center,
              ),
            ),
            
            const SizedBox(height: 32),

            // Audio Playback Button
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _handlePlayAudio,
                borderRadius: BorderRadius.circular(60),
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: JiriColors.primaryBlue.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.volume_up,
                    color: JiriColors.primaryBlue,
                    size: 36,
                  ),
                ),
              ),
            ),
            
            const Spacer(flex: 2),

            // Confirmation Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: JiriPrimaryButton(
                label: "I've done this ✓",
                backgroundColor: JiriColors.green,
                onPressed: () => _handleDone(context),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
