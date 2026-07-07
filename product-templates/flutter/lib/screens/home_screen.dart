import 'package:flutter/material.dart';
import '../data.dart';
import '../theme.dart';
import '../widgets/stat_card.dart';
import '../widgets/mini_chart.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Overview'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [for (final s in stats) StatCard(stat: s)],
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Revenue — last 30 days',
                      style: TextStyle(fontSize: 13, color: textDim)),
                  const SizedBox(height: 12),
                  MiniChart(series: revenueSeries),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(
              children: [
                for (final a in activities)
                  ListTile(
                    title: Text(a.title,
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w600)),
                    subtitle: Text(a.subtitle,
                        style: const TextStyle(fontSize: 12, color: textDim)),
                    trailing: Text(
                      a.amount,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: a.positive
                            ? const Color(0xFF34D399)
                            : const Color(0xFFF87171),
                      ),
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
