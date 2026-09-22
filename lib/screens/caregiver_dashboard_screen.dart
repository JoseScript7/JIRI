import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class CaregiverDashboardScreen extends StatefulWidget {
  const CaregiverDashboardScreen({Key? key}) : super(key: key);

  @override
  State<CaregiverDashboardScreen> createState() => _CaregiverDashboardScreenState();
}

class _CaregiverDashboardScreenState extends State<CaregiverDashboardScreen> {
  // Stubbed alert state to test the design (change to true to see the alert UI)
  final bool _hasAlert = false;
  final String _patientName = "Dadu";
  int _currentTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    // Generate date string safely
    final now = DateTime.now();
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final String dateString = '${weekdays[now.weekday - 1]}, ${now.day} ${months[now.month - 1]}';

    return Scaffold(
      backgroundColor: JiriColors.background, // Faint grey background
      appBar: AppBar(
        backgroundColor: Colors.white, // Solid white app bar for dashboard feel
        elevation: 1,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "$_patientName's Dashboard",
              style: const TextStyle(
                color: JiriColors.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              dateString,
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: JiriColors.textPrimary),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0), // Reduced padding for higher density
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Status Pills Row
              Row(
                children: [
                  _buildStatusPill(
                    text: 'At Home',
                    icon: Icons.location_on,
                    color: JiriColors.primaryBlue,
                  ),
                  const SizedBox(width: 8),
                  _buildStatusPill(
                    text: 'Online (synced)',
                    icon: Icons.sync,
                    color: JiriColors.green,
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 2. Alert Banner (Spans full width)
              _buildAlertBanner(),
              const SizedBox(height: 16),

              // 3. Dense 2-Column Grid for Metrics
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.3, // Squat rectangular cards
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildMetricCard(
                    title: 'Tasks',
                    value: '5/7 completed',
                    icon: Icons.check_box,
                    iconColor: JiriColors.green,
                  ),
                  _buildMetricCard(
                    title: 'Practice',
                    value: '12 min today',
                    icon: Icons.psychology,
                    iconColor: JiriColors.purple,
                  ),
                  _buildMetricCard(
                    title: 'Voice journal',
                    value: '1 new recording',
                    icon: Icons.mic,
                    iconColor: JiriColors.redCoral,
                  ),
                  _buildMetricCard(
                    title: 'Location',
                    value: 'At Home',
                    icon: Icons.home,
                    iconColor: JiriColors.primaryBlue,
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // 4. Activity Log Preview (Adding more density)
              Text(
                'Recent Activity',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 12),
              _buildActivityRow('10:00 AM', 'Completed Task: Take medicine', Icons.medication, JiriColors.green),
              _buildActivityRow('9:15 AM', 'Completed Practice: Pic Match', Icons.image_search, JiriColors.purple),
              _buildActivityRow('8:00 AM', 'Completed Task: Breakfast', Icons.wb_sunny, JiriColors.orangeAmber),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTabIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: JiriColors.primaryBlue,
        unselectedItemColor: Colors.grey.shade500,
        backgroundColor: Colors.white,
        elevation: 8,
        onTap: (index) {
          setState(() {
            _currentTabIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'People'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: 'Reports'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }

  Widget _buildStatusPill({required String text, required IconData icon, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertBanner() {
    final Color bgColor = _hasAlert ? JiriColors.redCoral : JiriColors.cardWhite;
    final Color textColor = _hasAlert ? Colors.white : JiriColors.textPrimary;
    final Color iconColor = _hasAlert ? Colors.white : JiriColors.green;
    final IconData displayIcon = _hasAlert ? Icons.warning_amber_rounded : Icons.check_circle;
    final String displayText = _hasAlert ? 'ALERT: Wandering detected' : 'All good';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _hasAlert ? JiriColors.redCoral : Colors.grey.shade300,
          width: _hasAlert ? 0 : 1,
        ),
        boxShadow: _hasAlert
            ? [
                BoxShadow(
                  color: JiriColors.redCoral.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ]
            : [],
      ),
      child: Row(
        children: [
          Icon(displayIcon, color: iconColor, size: 32),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Alerts',
                  style: TextStyle(
                    color: _hasAlert ? Colors.white70 : Colors.grey.shade600,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  displayText,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: JiriColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: iconColor, size: 28),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade500,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900, // Heavy weight for scanning
                  color: JiriColors.textPrimary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActivityRow(String time, String text, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  text,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: JiriColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
