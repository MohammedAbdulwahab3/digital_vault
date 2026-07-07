import 'package:flutter/material.dart';
import '../data.dart';
import '../theme.dart';

class InsightsScreen extends StatelessWidget {
  const InsightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final max = channels.map((c) => c.value).reduce((a, b) => a > b ? a : b);
    return Scaffold(
      appBar: AppBar(title: const Text('Insights')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Traffic channels',
                      style: TextStyle(fontSize: 13, color: textDim)),
                  const SizedBox(height: 16),
                  for (final c in channels) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(c.label, style: const TextStyle(fontSize: 13)),
                        Text('${c.value}%',
                            style: const TextStyle(
                                fontSize: 13, color: textDim)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: c.value / max,
                        minHeight: 8,
                        backgroundColor: surface2,
                        valueColor: const AlwaysStoppedAnimation(brand),
                      ),
                    ),
                    const SizedBox(height: 14),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
