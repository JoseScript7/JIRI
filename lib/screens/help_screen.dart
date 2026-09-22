import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({Key? key}) : super(key: key);

  void _handleEmergency() {
    debugPrint('Help Stub: TRIGGERING CRITICAL EMERGENCY CALL');
  }

  void _handleCallFamily() {
    debugPrint('Help Stub: Initiating standard call to family contacts');
  }

  void _handleLost() {
    debugPrint("Help Stub: Activating 'Lost' protocol and sharing location instantly");
  }

  void _handleShareLocation() {
    debugPrint('Help Stub: Sending manual location ping to caregiver');
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
                'How can we help?',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 32),

              // 1. Safety Critical: Emergency (Dominant Button)
              _buildSafetyButton(
                label: 'Emergency · Call now',
                icon: Icons.warning_amber_rounded,
                color: JiriColors.redCoral,
                isDominant: true,
                onTap: _handleEmergency,
              ),
              const SizedBox(height: 40),

              // 2. Call Family
              _buildSafetyButton(
                label: 'Call family',
                icon: Icons.phone,
                color: JiriColors.green,
                onTap: _handleCallFamily,
              ),
              const SizedBox(height: 20),

              // 3. I'm Lost Protocol
              _buildSafetyButton(
                label: "I'm lost · Share my location",
                icon: Icons.location_on,
                color: JiriColors.primaryBlue,
                onTap: _handleLost,
              ),
              const SizedBox(height: 20),

              // 4. Manual Share Location
              _buildSafetyButton(
                label: 'Share location with caregiver',
                icon: Icons.share_location,
                color: JiriColors.teal,
                onTap: _handleShareLocation,
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSafetyButton({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    bool isDominant = false,
  }) {
    // Determine extremely high contrast styling for dominant vs standard buttons
    final Color backgroundColor = isDominant ? color : color.withOpacity(0.12);
    final Color contentColor = isDominant ? Colors.white : color;
    final double buttonHeight = isDominant ? 130.0 : 88.0; // Enforcing strict minimum > 64px

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: buttonHeight,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDominant ? Colors.transparent : color.withOpacity(0.4),
              width: 2,
            ),
            boxShadow: isDominant
                ? [
                    BoxShadow(
                      color: color.withOpacity(0.5),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    )
                  ]
                : [],
          ),
          child: Row(
            children: [
              Container(
                width: isDominant ? 64 : 52,
                height: isDominant ? 64 : 52,
                decoration: BoxDecoration(
                  color: isDominant ? Colors.white.withOpacity(0.2) : color.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: contentColor,
                  size: isDominant ? 36 : 28,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    color: contentColor,
                    fontSize: isDominant ? 24 : 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: isDominant ? 1.2 : null,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (isDominant) ...[
                const SizedBox(width: 12),
                const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 28),
              ]
            ],
          ),
        ),
      ),
    );
  }
}
