import 'package:flutter/material.dart';
import 'dart:math';
import '../../theme/jiri_theme.dart';

class RhythmScreen extends StatefulWidget {
  const RhythmScreen({Key? key}) : super(key: key);

  @override
  State<RhythmScreen> createState() => _RhythmScreenState();
}

class _RhythmScreenState extends State<RhythmScreen> {
  bool _isPulsing = false;
  final Random _random = Random();
  late List<double> _baseHeights;

  @override
  void initState() {
    super.initState();
    // Generate random base heights for a static waveform appearance
    _baseHeights = List.generate(15, (index) => 15.0 + _random.nextDouble() * 25.0);
  }

  void _handleDrumTap() {
    debugPrint('Drum tapped: Playing beat audio');
    
    // Trigger visual pulse
    setState(() {
      _isPulsing = true;
    });

    // Quickly release the pulse to create a sharp, responsive animation
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) {
        setState(() {
          _isPulsing = false;
        });
      }
    });
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
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'Tap to the beat',
                style: Theme.of(context).textTheme.displayLarge,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 32),

            // Background Area (Cultural Scene Placeholder)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24.0),
              height: 200,
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
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Icon(
                    Icons.house, // Hut/Cultural scene placeholder
                    size: 100,
                    color: JiriColors.primaryBlue.withOpacity(0.1),
                  ),
                  Positioned(
                    bottom: 24,
                    child: Text(
                      'Cultural Scene Placeholder',
                      style: TextStyle(
                        color: Colors.grey.shade500,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(flex: 2),

            // Tappable Drum
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _handleDrumTap,
                borderRadius: BorderRadius.circular(120),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 100),
                  // Shrink slightly when tapped to mimic a drum hit
                  width: _isPulsing ? 200 : 220,
                  height: _isPulsing ? 200 : 220,
                  decoration: BoxDecoration(
                    color: JiriColors.orangeAmber,
                    shape: BoxShape.circle,
                    boxShadow: _isPulsing
                        ? []
                        : [
                            BoxShadow(
                              color: JiriColors.orangeAmber.withOpacity(0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            )
                          ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.album, // Drum placeholder icon
                      size: 100,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            
            const Spacer(flex: 3),

            // Waveform Visualization
            SizedBox(
              height: 100,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: List.generate(15, (index) {
                  final baseHeight = _baseHeights[index];
                  // If pulsing, spike the height of the bars dynamically
                  final currentHeight = _isPulsing 
                      ? (baseHeight * (_random.nextDouble() + 2.0)) // Random spike factor
                      : baseHeight;

                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 100),
                    margin: const EdgeInsets.symmetric(horizontal: 4.0),
                    width: 12,
                    height: currentHeight.clamp(10.0, 100.0), // Cap at 100px max height
                    decoration: BoxDecoration(
                      color: _isPulsing ? JiriColors.primaryBlue : JiriColors.primaryBlue.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
