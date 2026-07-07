import 'package:flutter/material.dart';
import '../data.dart';
import '../theme.dart';

class StatCard extends StatelessWidget {
  final Stat stat;
  const StatCard({super.key, required this.stat});

  @override
  Widget build(BuildContext context) {
    final deltaColor =
        stat.up ? const Color(0xFF34D399) : const Color(0xFFF87171);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(stat.label,
                style: const TextStyle(fontSize: 12, color: textDim)),
            const SizedBox(height: 6),
            Text(stat.value,
                style:
                    const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
            const SizedBox(height: 2),
            Text('${stat.up ? '▲' : '▼'} ${stat.delta}',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: deltaColor)),
          ],
        ),
      ),
    );
  }
}
