import 'package:flutter/material.dart';
import 'dart:async';
import '../theme/jiri_theme.dart';

enum RecordingState { idle, recording, stopped }

class VoiceJournalScreen extends StatefulWidget {
  const VoiceJournalScreen({Key? key}) : super(key: key);

  @override
  State<VoiceJournalScreen> createState() => _VoiceJournalScreenState();
}

class _VoiceJournalScreenState extends State<VoiceJournalScreen> {
  RecordingState _state = RecordingState.idle;
  Timer? _timer;
  int _secondsElapsed = 0;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _toggleRecording() {
    if (_state == RecordingState.idle || _state == RecordingState.stopped) {
      // START RECORDING
      setState(() {
        _state = RecordingState.recording;
        _secondsElapsed = 0;
      });
      debugPrint('Vosk Stub: Started local microphone capture');

      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (mounted) {
          setState(() {
            _secondsElapsed++;
          });
        }
      });
    } else if (_state == RecordingState.recording) {
      // STOP RECORDING
      _timer?.cancel();
      setState(() {
        _state = RecordingState.stopped;
      });
      debugPrint('Vosk Stub: Stopped capture. Audio saved locally for transcription.');
    }
  }

  String get _formattedTime {
    final minutes = (_secondsElapsed ~/ 60).toString().padLeft(2, '0');
    final seconds = (_secondsElapsed % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
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
        title: Text(
          'Tell your story',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            color: JiriColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            
            // Subtitle Instruction
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'Look at the picture and talk about what you see',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: JiriColors.textSecondary,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 16),
            
            // Status Badge
            const JiriStatusBadge(
              text: 'Vosk · On-device',
              color: JiriColors.purple, // Purple indicating offline AI process
              icon: Icons.mic_external_on,
            ),
            const SizedBox(height: 32),

            // Large Image Area Placeholder
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24.0),
              height: 280,
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
                    Icons.photo_library, // Scenic/Personal photo placeholder
                    size: 140,
                    color: JiriColors.primaryBlue.withOpacity(0.15),
                  ),
                  Positioned(
                    bottom: 24,
                    child: Text(
                      'Personal Photo Placeholder',
                      style: TextStyle(
                        color: Colors.grey.shade400,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(),

            // Recording Status Text
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: Text(
                _state == RecordingState.recording
                    ? 'Recording... $_formattedTime'
                    : _state == RecordingState.stopped
                        ? 'Saved: $_formattedTime'
                        : 'Tap the mic to start',
                key: ValueKey<RecordingState>(_state),
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: _state == RecordingState.recording 
                      ? JiriColors.redCoral 
                      : JiriColors.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Large Recording Button
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _toggleRecording,
                borderRadius: BorderRadius.circular(100),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: _state == RecordingState.recording ? 110 : 96,
                  height: _state == RecordingState.recording ? 110 : 96,
                  decoration: BoxDecoration(
                    color: _state == RecordingState.recording 
                        ? JiriColors.redCoral.withOpacity(0.8) 
                        : JiriColors.redCoral,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: JiriColors.redCoral.withOpacity(_state == RecordingState.recording ? 0.6 : 0.3),
                        blurRadius: _state == RecordingState.recording ? 24 : 12,
                        offset: const Offset(0, 6),
                      )
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      _state == RecordingState.recording ? Icons.stop : Icons.mic,
                      color: Colors.white,
                      size: 48,
                    ),
                  ),
                ),
              ),
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}
