import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';

class OfflineSyncScreen extends StatelessWidget {
  const OfflineSyncScreen({Key? key}) : super(key: key);

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
                'Sync with ASHA worker',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'No internet needed',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.green, // Highlights the offline capability safely
                ),
              ),
              const SizedBox(height: 48),

              // Network Diagram Container
              Container(
                padding: const EdgeInsets.all(24),
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
                child: Column(
                  children: [
                    // Node Connection Row
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildNode(
                          icon: Icons.smartphone,
                          label: 'JIRI\n(on your phone)',
                          color: JiriColors.primaryBlue,
                        ),
                        _buildConnector(),
                        _buildNode(
                          icon: Icons.bluetooth,
                          label: 'BLE\nNear by',
                          color: JiriColors.teal,
                        ),
                        _buildConnector(),
                        _buildNode(
                          icon: Icons.assignment_ind, // Represents health worker/clipboard
                          label: 'ASHA Worker\n(health device)',
                          color: JiriColors.orangeAmber,
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    
                    // Technical Explanations
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Icon(Icons.lock, size: 16, color: Colors.grey.shade600),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Encrypted sync (CRDT)',
                                  style: TextStyle(
                                    color: Colors.grey.shade700,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.cloud_upload, size: 16, color: Colors.grey.shade600),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Syncs to clinic when online',
                                  style: TextStyle(
                                    color: Colors.grey.shade700,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 48),

              // Sync Status Checklist
              Text(
                'Latest Sync Status',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textSecondary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                decoration: BoxDecoration(
                  color: JiriColors.cardWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildCheckItem('Photos'),
                    _buildCheckItem('Activities'),
                    _buildCheckItem('Voice'),
                  ],
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNode({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Expanded(
      flex: 4,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 32),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: JiriColors.textSecondary,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConnector() {
    return Expanded(
      flex: 3,
      child: Padding(
        padding: const EdgeInsets.only(top: 31.0), // Aligns line with the center of the 64px tall circles
        child: Container(
          height: 2,
          color: Colors.grey.shade300, // Subtle connecting line
        ),
      ),
    );
  }

  Widget _buildCheckItem(String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.check_circle, color: JiriColors.green, size: 24),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: JiriColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
