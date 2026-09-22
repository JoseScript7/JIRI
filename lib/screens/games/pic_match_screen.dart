import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';
import '../../theme/jiri_theme.dart';

class CardItem {
  final int id;
  final IconData icon;
  bool isFlipped;
  bool isMatched;

  CardItem({
    required this.id,
    required this.icon,
    this.isFlipped = false,
    this.isMatched = false,
  });
}

class PicMatchScreen extends StatefulWidget {
  const PicMatchScreen({Key? key}) : super(key: key);

  @override
  State<PicMatchScreen> createState() => _PicMatchScreenState();
}

class _PicMatchScreenState extends State<PicMatchScreen> {
  late List<CardItem> _cards;
  List<int> _flippedIndices = [];
  bool _isProcessing = false;
  
  // Feedback state
  String? _feedbackMessage;
  Color? _feedbackColor;

  // Placeholder icons representing pairs to match
  final List<IconData> _pairIcons = [
    Icons.pets,            // Dog/Animal
    Icons.local_florist,   // Flower
    Icons.directions_car,  // Car
    Icons.flight,          // Airplane
  ];

  @override
  void initState() {
    super.initState();
    _initializeGame();
  }

  void _initializeGame() {
    // 2 columns, multi-row -> let's do 4 pairs (8 cards)
    final iconsToUse = _pairIcons.take(4).toList();
    _cards = [];
    
    int idCounter = 0;
    for (var icon in iconsToUse) {
      _cards.add(CardItem(id: idCounter++, icon: icon));
      _cards.add(CardItem(id: idCounter++, icon: icon)); // Create exact pair
    }
    
    // Shuffle cards randomly
    _cards.shuffle(Random());
  }

  void _onCardTap(int index) async {
    // Prevent tapping if busy, or if card is already flipped/matched
    if (_isProcessing) return;
    if (_cards[index].isFlipped || _cards[index].isMatched) return;

    setState(() {
      _cards[index].isFlipped = true;
      _flippedIndices.add(index);
    });

    if (_flippedIndices.length == 2) {
      _isProcessing = true;
      final int firstIndex = _flippedIndices[0];
      final int secondIndex = _flippedIndices[1];

      if (_cards[firstIndex].icon == _cards[secondIndex].icon) {
        // MATCH SCENARIO
        setState(() {
          _cards[firstIndex].isMatched = true;
          _cards[secondIndex].isMatched = true;
          _feedbackMessage = "Great! ✓";
          _feedbackColor = JiriColors.green;
        });

        // Clear feedback message after a short delay
        await Future.delayed(const Duration(milliseconds: 1500));
        
        if (mounted) {
          setState(() {
            _feedbackMessage = null;
            _flippedIndices.clear();
            
            // Check for game over
            if (_cards.every((card) => card.isMatched)) {
              _feedbackMessage = "You did it! 🎉";
              _feedbackColor = JiriColors.primaryBlue;
            } else {
              _isProcessing = false;
            }
          });
        }
      } else {
        // MISMATCH SCENARIO - Errorless Learning
        // Neutral delay, gently flip back. No harsh red penalties.
        await Future.delayed(const Duration(milliseconds: 1200));
        
        if (mounted) {
          setState(() {
            _cards[firstIndex].isFlipped = false;
            _cards[secondIndex].isFlipped = false;
            _flippedIndices.clear();
            _isProcessing = false;
          });
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
                'Find the matching picture',
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
            const SizedBox(height: 16),

            // Game Grid (2 Columns)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.0,
                  ),
                  itemCount: _cards.length,
                  itemBuilder: (context, index) {
                    return _buildCard(_cards[index], index);
                  },
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(CardItem card, int index) {
    // Matched State: Greyed out with a green checkmark
    if (card.isMatched) {
      return Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade300, width: 2),
        ),
        child: Center(
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(card.icon, size: 64, color: Colors.grey.shade400),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: JiriColors.green,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, color: Colors.white, size: 24),
              ),
            ],
          ),
        ),
      );
    }

    // Playable State: Tappable InkWell
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _onCardTap(index),
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          decoration: BoxDecoration(
            color: card.isFlipped ? JiriColors.primaryBlue.withOpacity(0.1) : JiriColors.primaryBlue,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: JiriColors.primaryBlue,
              width: 2,
            ),
            boxShadow: card.isFlipped
                ? [] // Flatten when flipped
                : [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
          ),
          child: Center(
            child: card.isFlipped
                ? Icon(card.icon, size: 64, color: JiriColors.primaryBlue) // Show icon
                : const Icon(Icons.help_outline, size: 48, color: Colors.white), // Hidden back
          ),
        ),
      ),
    );
  }
}
