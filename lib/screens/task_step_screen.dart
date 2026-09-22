import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class TaskStepScreen extends StatelessWidget {
  final int stepNumber;
  final int totalSteps;
  final String instructionText;
  final String? imageAsset;

  const TaskStepScreen({
    Key? key,
    required this.stepNumber,
    required this.totalSteps,
    required this.instructionText,
    this.imageAsset,
  }) : super(key: key);

  void _handleTTS() {
    // Stub for text-to-speech engine
    debugPrint('TTS Triggered: Playing "$instructionText" aloud');
  }

  void _handleDone(BuildContext context) {
    if (stepNumber < totalSteps) {
      // Navigate to the next dummy step to demonstrate reusable behavior
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => TaskStepScreen(
            stepNumber: stepNumber + 1,
            totalSteps: totalSteps,
            instructionText: 'Continue to step ${stepNumber + 1} instructions...',
          ),
        ),
      );
    } else {
      // Task complete, pop back to home
      debugPrint('Task complete!');
      Navigator.popUntil(context, (route) => route.isFirst);
    }
  }

  void _handleNeedHelp(BuildContext context) {
    debugPrint('Escalating to JIRI Flow AI Guidance');
    // Stub navigation to JIRI Flow AI guidance screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('JIRI Flow Assistance')),
          body: const Center(child: Text('AI Interactive Guidance Screen')),
        ),
      ),
    );
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
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 24.0),
            child: Center(
              child: Text(
                'Step $stepNumber of $totalSteps',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: JiriColors.textSecondary,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 32),
              
              // Illustration Area
              Container(
                height: 220,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: JiriColors.cardWhite,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade200, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Center(
                  child: imageAsset != null
                      ? Text('Image Asset: $imageAsset') // Placeholder for actual Image.asset()
                      : Icon(
                          Icons.medication, // Placeholder icon representing tablet/medicine
                          size: 96,
                          color: JiriColors.primaryBlue.withOpacity(0.5),
                        ),
                ),
              ),
              
              const Spacer(flex: 2),

              // Bold Instruction Text
              Text(
                instructionText,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                  height: 1.3, // Improve readability for multi-line instructions
                ),
              ),
              
              const SizedBox(height: 32),

              // TTS Play Button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: _handleTTS,
                  borderRadius: BorderRadius.circular(40),
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
              
              const Spacer(flex: 3),

              // Full-width Done Button
              JiriPrimaryButton(
                label: 'Done ✓',
                backgroundColor: JiriColors.green,
                onPressed: () => _handleDone(context),
              ),
              const SizedBox(height: 12),

              // Need Help Link Button
              TextButton(
                onPressed: () => _handleNeedHelp(context),
                style: TextButton.styleFrom(
                  minimumSize: const Size(double.infinity, 56), // Large tap target for accessibility
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Need help?',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: JiriColors.redCoral,
                    decoration: TextDecoration.underline,
                    decorationColor: JiriColors.redCoral,
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
