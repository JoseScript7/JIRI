import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class MemoriesScreen extends StatelessWidget {
  const MemoriesScreen({Key? key}) : super(key: key);

  void _navigateToCategory(BuildContext context, String categoryName) {
    if (categoryName == 'Songs') {
      Navigator.pushNamed(context, '/singify');
    } else if (categoryName == 'Stories') {
      Navigator.pushNamed(context, '/voice_journal');
    } else {
      // Stub navigation to placeholder detail screens for each memory category
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: Text(categoryName)),
            body: Center(child: Text('$categoryName Details (Stub)')),
          ),
        ),
      );
    }
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
              Text(
                'Memories',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'People · Places · Stories',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textSecondary,
                ),
              ),
              const SizedBox(height: 40),

              // 2x2 Memory Grid
              Row(
                children: [
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 0.85, // Taller than wide to emphasize images
                      child: _buildMemoryCard(
                        title: 'My Family',
                        subtitle: 'Photos & voices',
                        icon: Icons.family_restroom,
                        color: JiriColors.primaryBlue,
                        onTap: () => _navigateToCategory(context, 'My Family'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 0.85,
                      child: _buildMemoryCard(
                        title: 'Our Places',
                        subtitle: 'Villages & hills',
                        icon: Icons.landscape,
                        color: JiriColors.green,
                        onTap: () => _navigateToCategory(context, 'Our Places'),
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
                      aspectRatio: 0.85,
                      child: _buildMemoryCard(
                        title: 'Songs',
                        subtitle: 'Familiar songs',
                        icon: Icons.music_note,
                        color: JiriColors.orangeAmber,
                        onTap: () => _navigateToCategory(context, 'Songs'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 0.85,
                      child: _buildMemoryCard(
                        title: 'Stories',
                        subtitle: 'Our history',
                        icon: Icons.menu_book,
                        color: JiriColors.purple,
                        onTap: () => _navigateToCategory(context, 'Stories'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  // Custom Memory Card distinct from the functional JiriIconTile
  Widget _buildMemoryCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          decoration: BoxDecoration(
            color: color.withOpacity(0.05),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: color.withOpacity(0.2), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Large Image/Icon Area
              Expanded(
                flex: 5,
                child: Container(
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.15),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                  ),
                  child: Center(
                    child: Icon(icon, size: 72, color: color), // Placeholder for real photos
                  ),
                ),
              ),
              // Text Area
              Expanded(
                flex: 4,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: JiriColors.textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 14,
                          color: JiriColors.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
