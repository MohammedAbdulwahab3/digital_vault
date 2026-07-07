import 'package:flutter/material.dart';
import '../theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: Container(
                width: 46,
                height: 46,
                decoration: const BoxDecoration(
                  gradient: brandGradient,
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Text('A',
                      style: TextStyle(
                          fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              title: const Text('Alex Morgan',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              subtitle: const Text('alex@studio.com',
                  style: TextStyle(color: textDim, fontSize: 12)),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(
              children: const [
                ListTile(
                    leading: Icon(Icons.palette_outlined),
                    title: Text('Appearance'),
                    trailing: Icon(Icons.chevron_right)),
                ListTile(
                    leading: Icon(Icons.notifications_outlined),
                    title: Text('Notifications'),
                    trailing: Icon(Icons.chevron_right)),
                ListTile(
                    leading: Icon(Icons.lock_outline),
                    title: Text('Privacy & security'),
                    trailing: Icon(Icons.chevron_right)),
                ListTile(
                    leading: Icon(Icons.help_outline),
                    title: Text('Help center'),
                    trailing: Icon(Icons.chevron_right)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
