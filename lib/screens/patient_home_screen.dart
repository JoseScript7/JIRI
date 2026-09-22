import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import 'task_step_screen.dart';
import 'practice_hub_screen.dart';
import 'my_day_screen.dart';
import 'memories_screen.dart';
import 'help_screen.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({Key? key}) : super(key: key);

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> {
  // Stubbed patient name
  final String _patientName = "Dadu";

  void _navigateTo(BuildContext context, String title) {
    // Stub navigation to respective feature screens
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => Scaffold(
          appBar: AppBar(title: Text(title)),
          body: Center(child: Text('$title Screen')),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Safely format date/time without relying on external intl package
    final now = DateTime.now();
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final String dateString = '${weekdays[now.weekday - 1]}, ${now.day} ${months[now.month - 1]}';
    
    final int hour = now.hour == 0 ? 12 : (now.hour > 12 ? now.hour - 12 : now.hour);
    final String period = now.hour >= 12 ? 'PM' : 'AM';
    final String min = now.minute.toString().padLeft(2, '0');
    final String timeString = '$hour:$min $period';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Top Greeting Section
              Text(
                'Good morning, $_patientName',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32),
              ),
              const SizedBox(height: 8),
              Text(
                '$dateString • $timeString',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              
              // Location Pill
              const JiriStatusBadge(
                text: 'You are at Home',
                color: JiriColors.green,
                icon: Icons.home,
              ),
              const SizedBox(height: 40),

              // 2. NOW Card (Orange Background)
              _buildActionCard(
                context: context,
                title: 'NOW',
                subtitle: 'Have your breakfast',
                icon: Icons.wb_sunny,
                backgroundColor: JiriColors.orangeAmber,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const TaskStepScreen(
                        stepNumber: 1,
                        totalSteps: 4,
                        instructionText: 'Eat a bowl of warm porridge.',
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 16),

              // 3. NEXT Card (Red Accent)
              _buildActionCard(
                context: context,
                title: 'NEXT',
                subtitle: 'Take medicine · 10:00 AM',
                icon: Icons.medication,
                backgroundColor: JiriColors.cardWhite,
                accentColor: JiriColors.redCoral,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const TaskStepScreen(
                        stepNumber: 1,
                        totalSteps: 2,
                        instructionText: 'Take 1 tablet with water.',
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 48),

              // 4. Interactive Grid Section (2-Columns)
              Row(
                children: [
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.people,
                        label: 'People',
                        color: JiriColors.primaryBlue,
                        onTap: () => _navigateTo(context, 'People'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.calendar_today,
                        label: 'My Day',
                        color: JiriColors.green,
                        onTap: () {
                          Navigator.pushNamed(context, '/my_day');
                        },
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
                        icon: Icons.favorite,
                        label: 'Memories',
                        color: JiriColors.orangeAmber,
                        onTap: () {
                          Navigator.pushNamed(context, '/memories');
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1.0,
                      child: JiriIconTile(
                        icon: Icons.psychology,
                        label: 'Practice',
                        color: JiriColors.purple,
                        onTap: () {
                          Navigator.pushNamed(context, '/practice');
                        },
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // 5. Full-width Help Tile
              SizedBox(
                height: 120, // Tall enough for accessibility, wide as screen
                width: double.infinity,
                child: JiriIconTile(
                  icon: Icons.phone,
                  label: 'Help',
                  color: JiriColors.redCoral,
                  onTap: () {
                    Navigator.pushNamed(context, '/help');
                  },
                ),
              ),
              
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color backgroundColor,
    Color? accentColor,
    required VoidCallback onTap,
  }) {
    // Determine high contrast text colors based on card background
    final bool isDarkBackground = backgroundColor != JiriColors.cardWhite;
    final Color textColor = isDarkBackground ? Colors.white : JiriColors.textPrimary;
    final Color effectiveIconColor = isDarkBackground ? Colors.white : (accentColor ?? JiriColors.textPrimary);
    
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(16),
          border: !isDarkBackground && accentColor != null 
              ? Border.all(color: accentColor.withOpacity(0.3), width: 2)
              : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: isDarkBackground ? Colors.white.withOpacity(0.25) : effectiveIconColor.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: effectiveIconColor, size: 36),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: isDarkBackground ? Colors.white.withOpacity(0.9) : effectiveIconColor,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: textColor,
                      fontSize: 22, // Extra large for legibility
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(Icons.chevron_right, color: textColor, size: 36),
          ],
        ),
      ),
    );
  }
}
