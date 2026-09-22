import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class SingifySongScreen extends StatelessWidget {
  final String songTitle;

  const SingifySongScreen({
    Key? key,
    required this.songTitle,
  }) : super(key: key);

  void _handlePlay() {
    // Stub for connecting to the actual Singify backend audio player
    debugPrint('Singify Play Stub: Playing instrumental/vocal track for $songTitle');
  }

  void _handleRecord() {
    // Stub for starting microphone capture and karaoke lyric sync logic
    debugPrint('Singify Record Stub: Starting microphone capture and lyrics sync for $songTitle');
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
            // Branding Title
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'Songs of our land',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  color: JiriColors.primaryBlue,
                  letterSpacing: 1.2,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 12),
            
            // Offline Status Badge
            const JiriStatusBadge(
              text: 'Available offline',
              color: JiriColors.green,
              icon: Icons.check_circle,
            ),
            const SizedBox(height: 32),

            // Scenic Background Area Placeholder
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
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Icon(
                    Icons.landscape, // Hills/flowers placeholder icon
                    size: 140,
                    color: JiriColors.primaryBlue.withOpacity(0.15),
                  ),
                  Positioned(
                    bottom: 24,
                    child: Text(
                      'Scenic Background (Hills/Flowers)',
                      style: TextStyle(
                        color: Colors.grey.shade400,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(flex: 1),

            // Reusable Song Title Display
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                songTitle,
                style: Theme.of(context).textTheme.displayMedium,
                textAlign: TextAlign.center,
              ),
            ),
            
            const Spacer(flex: 2),

            // Action Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Play Button
                Column(
                  children: [
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: _handlePlay,
                        borderRadius: BorderRadius.circular(80),
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: JiriColors.primaryBlue,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: JiriColors.primaryBlue.withOpacity(0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 6),
                              )
                            ],
                          ),
                          child: const Icon(Icons.play_arrow, color: Colors.white, size: 48),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Listen',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: JiriColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 48), 
                // Sing Along / Record Button
                Column(
                  children: [
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: _handleRecord,
                        borderRadius: BorderRadius.circular(80),
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: JiriColors.redCoral,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: JiriColors.redCoral.withOpacity(0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 6),
                              )
                            ],
                          ),
                          child: const Icon(Icons.mic, color: Colors.white, size: 40),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Sing along',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: JiriColors.redCoral,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            
            const Spacer(flex: 2),

            // Caregiver Sync / Status Line
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.sync, color: Colors.grey.shade400, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Sync: Sang for 3 minutes',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
