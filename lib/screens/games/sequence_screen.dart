import 'package:flutter/material.dart';
import 'dart:async';
import '../../theme/jiri_theme.dart';

enum SequencePhase {
  showing,
  tapping,
  evaluating,
}

class SequenceScreen extends StatefulWidget {
  const SequenceScreen({Key? key}) : super(key: key);

  @override
  State<SequenceScreen> createState() => _SequenceScreenState();
}

class _SequenceScreenState extends State<SequenceScreen> {
  // Game State
  SequencePhase _phase = SequencePhase.showing;
  final int _sequenceLength = 3;
  
  List<IconData> _correctSequence = [];
  List<IconData> _shuffledOptions = [];
  List<IconData> _userSequence = [];
  
  String? _feedbackMessage;
  Color? _feedbackColor;

  // Pool of instrument/item icons
  final List<IconData> _iconPool = [
    Icons.music_note, // Represents a general instrument/rhythm
    Icons.piano,
    Icons.speaker,    // Represents drum/speaker
    Icons.headphones,
    Icons.mic,
  ];

  @override
  void initState() {
    super.initState();
    _startNewRound();
  }

  void _startNewRound() {
    _userSequence.clear();
    _feedbackMessage = null;
    
    // Pick random items for the sequence
    final shuffledPool = List<IconData>.from(_iconPool)..shuffle();
    _correctSequence = shuffledPool.take(_sequenceLength).toList();
    
    // Options are the same items but shuffled so their physical position changes
    _shuffledOptions = List<IconData>.from(_correctSequence)..shuffle();
    
    _startShowingPhase();
  }

  void _startShowingPhase() {
    setState(() {
      _phase = SequencePhase.showing;
      _userSequence.clear();
    });

    // Play TTS/Audio cue when showing
    _playAudioCue();

    // Show for 3.5 seconds, then switch to tapping phase
    Future.delayed(const Duration(milliseconds: 3500), () {
      if (mounted && _phase == SequencePhase.showing) {
        setState(() {
          _phase = SequencePhase.tapping;
        });
      }
    });
  }

  void _playAudioCue() {
    debugPrint('TTS/Audio Triggered: Playing sequence cues aloud');
  }

  void _onOptionTap(IconData selectedIcon) async {
    if (_phase != SequencePhase.tapping) return;
    
    // Prevent selecting the same icon twice if they already tapped it
    if (_userSequence.contains(selectedIcon)) return;

    setState(() {
      _userSequence.add(selectedIcon);
    });

    // If sequence is fully entered, evaluate it
    if (_userSequence.length == _sequenceLength) {
      setState(() {
        _phase = SequencePhase.evaluating;
      });

      bool isCorrect = true;
      for (int i = 0; i < _sequenceLength; i++) {
        if (_userSequence[i] != _correctSequence[i]) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect) {
        // MATCH SCENARIO
        setState(() {
          _feedbackMessage = "Perfect! ✓";
          _feedbackColor = JiriColors.green;
        });

        await Future.delayed(const Duration(milliseconds: 1500));
        if (mounted) {
          // Trigger next round or end game
          _startNewRound(); 
        }
      } else {
        // MISMATCH SCENARIO - Errorless Learning
        setState(() {
          // Gentle, neutral feedback without harsh penalties
          _feedbackMessage = "Let's review the order";
          _feedbackColor = JiriColors.orangeAmber; 
        });

        await Future.delayed(const Duration(milliseconds: 1500));
        if (mounted) {
          // Gently return to showing phase so they can re-memorize it
          _startShowingPhase();
        }
      }
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
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'Remember the order',
                style: Theme.of(context).textTheme.displayLarge,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 16),

            // Feedback Overlay Area
            SizedBox(
              height: 56,
              child: Center(
                child: _feedbackMessage != null
                    ? AnimatedOpacity(
                        opacity: 1.0,
                        duration: const Duration(milliseconds: 300),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          decoration: BoxDecoration(
                            color: _feedbackColor?.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: _feedbackColor!, width: 2),
                          ),
                          child: Text(
                            _feedbackMessage!,
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: _feedbackColor,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ),
                      )
                    : const SizedBox.shrink(),
              ),
            ),
            const SizedBox(height: 24),

            // Top Display: The Sequence or Placeholders
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(_sequenceLength, (index) {
                  return _buildSequenceSlot(index);
                }),
              ),
            ),
            const SizedBox(height: 48),

            // Speaker Icon to Replay Audio
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _playAudioCue,
                borderRadius: BorderRadius.circular(32),
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: JiriColors.primaryBlue.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.volume_up,
                    color: JiriColors.primaryBlue,
                    size: 32,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),

            // Instruction Text
            Text(
              _phase == SequencePhase.showing 
                  ? 'Watch carefully...' 
                  : 'Tap in the same order',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: JiriColors.textPrimary,
              ),
            ),
            const SizedBox(height: 24),

            // Tappable Options Area
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(_sequenceLength, (index) {
                    final icon = _shuffledOptions[index];
                    final isSelected = _userSequence.contains(icon);
                    // Find out what number (1, 2, 3) order this was tapped in
                    final tapOrder = _userSequence.indexOf(icon) + 1;

                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: _buildOptionButton(icon, isSelected, tapOrder),
                      ),
                    );
                  }),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSequenceSlot(int index) {
    // If in showing phase, reveal the correct answer.
    // If in tapping/evaluating phase, show what the user has tapped so far.
    IconData? displayIcon;
    if (_phase == SequencePhase.showing) {
      displayIcon = _correctSequence[index];
    } else {
      if (index < _userSequence.length) {
        displayIcon = _userSequence[index];
      }
    }

    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: displayIcon != null ? JiriColors.cardWhite : Colors.grey.shade200,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: displayIcon != null ? JiriColors.primaryBlue : Colors.grey.shade300,
          width: 2,
        ),
        boxShadow: displayIcon != null
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                )
              ]
            : [],
      ),
      child: Center(
        child: displayIcon != null
            ? Icon(displayIcon, size: 40, color: JiriColors.primaryBlue)
            : Text(
                '?',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade400,
                ),
              ),
      ),
    );
  }

  Widget _buildOptionButton(IconData icon, bool isSelected, int tapOrder) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _onOptionTap(icon),
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 100, // Large square button
          decoration: BoxDecoration(
            color: isSelected ? Colors.grey.shade300 : JiriColors.cardWhite,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? Colors.grey.shade400 : JiriColors.primaryBlue,
              width: 2,
            ),
            boxShadow: isSelected
                ? []
                : [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(
                icon, 
                size: 40, 
                color: isSelected ? Colors.grey.shade500 : JiriColors.primaryBlue,
              ),
              // Show the numbered badge (1, 2, 3...) indicating order tapped
              if (isSelected && tapOrder > 0)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(
                      color: JiriColors.primaryBlue,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      tapOrder.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
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
