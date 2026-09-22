import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import 'games/pic_match_screen.dart';
import 'games/sequence_screen.dart';
import 'games/rhythm_screen.dart';

class PracticeHubScreen extends StatelessWidget {
  const PracticeHubScreen({Key? key}) : super(key: key);

  void _navigateToGame(BuildContext context, String gameName) {
    if (gameName == 'Pic Match') {
      Navigator.pushNamed(context, '/pic_match');
    } else if (gameName == 'Memory Sequence') {
      Navigator.pushNamed(context, '/sequence');
    } else if (gameName == 'Rhythm') {
      Navigator.pushNamed(context, '/rhythm');
    } else {
      // Stub navigation to respective game screens
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: Text(gameName)),
            body: Center(child: Text('$gameName Game Screen (Stub)')),
          ),
        ),
      );
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Header
              Text(
                'Brain Practice',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Keep your mind active',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 16),
              
              // 2. IRT Adaptive Status Badge
              const JiriStatusBadge(
                text: 'Adapting to you',
                color: JiriColors.teal,
                icon: Icons.trending_up,
              ),
              const SizedBox(height: 40),

              // 3. Game Grid
              Row(
                children: [
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.image_search,
                        label: 'Pic Match',
                        subtitle: 'Find the pairs',
                        color: JiriColors.green,
                        onTap: () => _navigateToGame(context, 'Pic Match'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.replay,
                        label: 'Recall',
                        subtitle: 'Remember',
                        color: JiriColors.primaryBlue,
                        onTap: () => _navigateToGame(context, 'Recall'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.format_list_numbered,
                        label: 'Memory Sequence',
                        subtitle: 'In the right order',
                        color: JiriColors.orangeAmber,
                        onTap: () => _navigateToGame(context, 'Memory Sequence'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.music_note,
                        label: 'Rhythm',
                        subtitle: 'Tap to the music',
                        color: JiriColors.purple,
                        onTap: () => _navigateToGame(context, 'Rhythm'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // 4. Full-width Fill in the Blanks
              SizedBox(
                height: 120, // Taller to match aspect somewhat
                width: double.infinity,
                child: JiriIconTile(
                  icon: Icons.edit_note,
                  label: 'Fill in the Blanks',
                  subtitle: 'Complete the word',
                  color: JiriColors.textSecondary, // Neutral tint
                  onTap: () => _navigateToGame(context, 'Fill in the Blanks'),
                ),
              ),
              
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
