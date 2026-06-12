import 'package:flutter/material.dart';
import 'predict_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final diseases = [
      {'icon': '🔬', 'title': 'Skin Disease', 'sub': 'Eczema, Psoriasis, Fungal, Acne', 'route': 'skin'},
      {'icon': '🌡️', 'title': 'Diarrhea',     'sub': 'Mild / Moderate / Severe',         'route': 'diarrhea'},
      {'icon': '💧', 'title': 'Cholera',       'sub': 'Suspected / Confirmed detection',  'route': 'cholera'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('🏥 Healthcare AI'),
        backgroundColor: const Color(0xFF1A73E8),
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Disease Prediction',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            const Text('Select a disease to get AI-powered prediction',
                style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 20),
            ...diseases.map((d) => _DiseaseCard(
              icon: d['icon']!,
              title: d['title']!,
              sub: d['sub']!,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => PredictScreen(disease: d['route']!),
                ),
              ),
            )),
          ],
        ),
      ),
    );
  }
}

class _DiseaseCard extends StatelessWidget {
  final String icon, title, sub;
  final VoidCallback onTap;
  const _DiseaseCard({required this.icon, required this.title, required this.sub, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 3,
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        leading: Text(icon, style: const TextStyle(fontSize: 36)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        subtitle: Text(sub, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Color(0xFF1A73E8)),
      ),
    );
  }
}
