import 'package:flutter/material.dart';
import '../theme/jiri_theme.dart';
import 'patient_home_screen.dart';

class PatientProfileScreen extends StatefulWidget {
  const PatientProfileScreen({Key? key}) : super(key: key);

  @override
  State<PatientProfileScreen> createState() => _PatientProfileScreenState();
}

class _PatientProfileScreenState extends State<PatientProfileScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _townController = TextEditingController();
  final TextEditingController _caregiverController = TextEditingController();
  
  // Track toggleable places
  final Set<String> _selectedPlaces = {};

  bool get _isNameValid => _nameController.text.trim().isNotEmpty;

  @override
  void initState() {
    super.initState();
    _nameController.addListener(() {
      setState(() {}); // Re-render to update Next button state
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _townController.dispose();
    _caregiverController.dispose();
    super.dispose();
  }

  void _handleAvatarTap() {
    // Stub for actual image picker
    debugPrint('Avatar tapped: Open photo picker dialog/modal');
  }

  void _togglePlace(String placeName) {
    setState(() {
      if (_selectedPlaces.contains(placeName)) {
        _selectedPlaces.remove(placeName);
      } else {
        _selectedPlaces.add(placeName);
      }
    });
  }

  void _handleNext() {
    if (_isNameValid) {
      Navigator.pushReplacementNamed(context, '/home');
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
        child: SingleChildScrollView( // Allow scrolling when keyboard is up
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Let\'s set up your profile',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'This helps JIRI be personal',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 40),

              // Avatar Picker
              Center(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: _handleAvatarTap,
                    borderRadius: BorderRadius.circular(60), // Match avatar radius
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade300,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.person,
                            size: 64,
                            color: Colors.grey.shade500,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: JiriColors.primaryBlue,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.camera_alt,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),

              // Form Fields
              _buildTextField(
                context: context,
                label: 'What should we call you?',
                placeholder: 'Dadu',
                controller: _nameController,
              ),
              const SizedBox(height: 24),
              
              _buildTextField(
                context: context,
                label: 'Your village / town',
                placeholder: 'Kohima',
                controller: _townController,
              ),
              const SizedBox(height: 24),
              
              _buildTextField(
                context: context,
                label: 'A family member / caregiver',
                placeholder: 'Lila (Daughter)',
                controller: _caregiverController,
              ),
              const SizedBox(height: 32),

              // Familiar Places section
              Text(
                'Familiar places',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  JiriIconTile(
                    icon: Icons.home,
                    label: 'Home',
                    color: JiriColors.orangeAmber,
                    isSelected: _selectedPlaces.contains('Home'),
                    onTap: () => _togglePlace('Home'),
                  ),
                  JiriIconTile(
                    icon: Icons.church,
                    label: 'Church',
                    color: JiriColors.purple,
                    isSelected: _selectedPlaces.contains('Church'),
                    onTap: () => _togglePlace('Church'),
                  ),
                  JiriIconTile(
                    icon: Icons.storefront,
                    label: 'Market',
                    color: JiriColors.green,
                    isSelected: _selectedPlaces.contains('Market'),
                    onTap: () => _togglePlace('Market'),
                  ),
                ],
              ),
              const SizedBox(height: 48),

              // Bottom Button
              JiriPrimaryButton(
                label: 'Next',
                backgroundColor: _isNameValid ? JiriColors.primaryBlue : Colors.grey.shade400,
                onPressed: _isNameValid ? _handleNext : null,
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required BuildContext context,
    required String label,
    required String placeholder,
    required TextEditingController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            color: JiriColors.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: JiriColors.textPrimary,
            fontSize: 18,
          ),
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: TextStyle(color: Colors.grey.shade400),
            filled: true,
            fillColor: JiriColors.cardWhite,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: JiriColors.primaryBlue, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
