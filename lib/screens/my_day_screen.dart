import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

enum TimelineStatus { done, next, upcoming }

class TimelineItem {
  final String time;
  final String title;
  final TimelineStatus status;

  TimelineItem({
    required this.time,
    required this.title,
    required this.status,
  });
}

class MyDayScreen extends StatefulWidget {
  const MyDayScreen({Key? key}) : super(key: key);

  @override
  State<MyDayScreen> createState() => _MyDayScreenState();
}

class _MyDayScreenState extends State<MyDayScreen> {
  // Driven by a simple data model per requirements
  final List<TimelineItem> _schedule = [
    TimelineItem(time: '7:00 AM', title: 'Wake up', status: TimelineStatus.done),
    TimelineItem(time: '8:00 AM', title: 'Breakfast', status: TimelineStatus.done),
    TimelineItem(time: '10:00 AM', title: 'Take medicine', status: TimelineStatus.next),
    TimelineItem(time: '11:00 AM', title: 'Short walk', status: TimelineStatus.upcoming),
    TimelineItem(time: '1:00 PM', title: 'Lunch', status: TimelineStatus.upcoming),
    TimelineItem(time: '4:00 PM', title: 'Family call', status: TimelineStatus.upcoming),
    TimelineItem(time: '5:00 PM', title: 'Practice', status: TimelineStatus.upcoming),
    TimelineItem(time: '7:00 PM', title: 'Dinner', status: TimelineStatus.upcoming),
    TimelineItem(time: '9:00 PM', title: 'Sleep', status: TimelineStatus.upcoming),
  ];

  @override
  Widget build(BuildContext context) {
    // Generate date without intl package for safety
    final now = DateTime.now();
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final String dateString = '${weekdays[now.weekday - 1]}, ${now.day} ${months[now.month - 1]}';

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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'My Day',
                style: Theme.of(context).textTheme.displayLarge,
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                dateString,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textSecondary,
                ),
              ),
            ),
            const SizedBox(height: 32),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                itemCount: _schedule.length,
                itemBuilder: (context, index) {
                  final item = _schedule[index];
                  final isFirst = index == 0;
                  final isLast = index == _schedule.length - 1;
                  return _buildTimelineRow(item, isFirst, isLast, context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineRow(TimelineItem item, bool isFirst, bool isLast, BuildContext context) {
    Color dotColor;
    Widget dotContent;
    
    // Status visual mapping
    switch (item.status) {
      case TimelineStatus.done:
        dotColor = JiriColors.green;
        dotContent = const Icon(Icons.check, size: 16, color: Colors.white);
        break;
      case TimelineStatus.next:
        dotColor = JiriColors.orangeAmber;
        dotContent = Container(
          margin: const EdgeInsets.all(4),
          decoration: const BoxDecoration(
            color: JiriColors.orangeAmber,
            shape: BoxShape.circle,
          ),
        );
        break;
      case TimelineStatus.upcoming:
        dotColor = Colors.grey.shade400;
        dotContent = const SizedBox.shrink(); // Empty center
        break;
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Timeline Graphic Column
          SizedBox(
            width: 32,
            child: Column(
              children: [
                // Top line segment
                Container(
                  width: 2,
                  height: 24, // Align dot with the text baseline
                  color: isFirst ? Colors.transparent : Colors.grey.shade300,
                ),
                // Status Dot
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: item.status == TimelineStatus.done ? dotColor : JiriColors.background,
                    border: Border.all(color: dotColor, width: 2.5),
                    shape: BoxShape.circle,
                  ),
                  child: dotContent,
                ),
                // Bottom connecting line stretching to next item
                Expanded(
                  child: Container(
                    width: 2,
                    color: isLast ? Colors.transparent : Colors.grey.shade300,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          
          // 2. Content Column
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: 22.0, bottom: 32.0), // Padding controls row height and line length
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        item.time,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: JiriColors.textSecondary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (item.status == TimelineStatus.next) ...[
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: JiriColors.orangeAmber.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: JiriColors.orangeAmber, width: 1.5),
                          ),
                          child: const Text(
                            'Next',
                            style: TextStyle(
                              color: JiriColors.orangeAmber,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ]
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.title,
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: item.status == TimelineStatus.upcoming 
                          ? Colors.grey.shade400 
                          : JiriColors.textPrimary,
                      fontSize: 24,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
