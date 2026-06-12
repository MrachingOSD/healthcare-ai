import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// ── Change this to your backend IP when testing on a real device ──
const String BASE_URL = 'http://10.0.2.2:8000'; // Android emulator → localhost

class PredictScreen extends StatefulWidget {
  final String disease;
  const PredictScreen({super.key, required this.disease});

  @override
  State<PredictScreen> createState() => _PredictScreenState();
}

class _PredictScreenState extends State<PredictScreen> {
  final Map<String, TextEditingController> _ctrl = {};
  Map<String, dynamic>? _result;
  bool _loading = false;
  String _error = '';

  List<Map<String, String>> get _fields {
    switch (widget.disease) {
      case 'skin':
        return [
          {'key': 'redness',       'label': 'Redness (0–10)'},
          {'key': 'itching',       'label': 'Itching (0–10)'},
          {'key': 'scaling',       'label': 'Scaling (0–10)'},
          {'key': 'lesion_size',   'label': 'Lesion Size (cm)'},
          {'key': 'duration_days', 'label': 'Duration (days)'},
          {'key': 'age',           'label': 'Age'},
        ];
      case 'diarrhea':
        return [
          {'key': 'loose_stool_freq',  'label': 'Loose Stool/Day'},
          {'key': 'stomach_pain',      'label': 'Stomach Pain (0–10)'},
          {'key': 'nausea',            'label': 'Nausea (0–10)'},
          {'key': 'vomiting',          'label': 'Vomiting (0/1)'},
          {'key': 'fever',             'label': 'Fever (°C)'},
          {'key': 'dehydration_level', 'label': 'Dehydration (0–3)'},
          {'key': 'blood_in_stool',    'label': 'Blood in Stool (0/1)'},
          {'key': 'age',               'label': 'Age'},
        ];
      default: // cholera
        return [
          {'key': 'watery_stool',      'label': 'Watery Stool (0/1)'},
          {'key': 'rice_water_stool',  'label': 'Rice-water Stool (0/1)'},
          {'key': 'vomiting',          'label': 'Vomiting (0/1)'},
          {'key': 'dehydration',       'label': 'Dehydration (0–3)'},
          {'key': 'muscle_cramps',     'label': 'Muscle Cramps (0/1)'},
          {'key': 'rapid_heart_rate',  'label': 'Heart Rate (bpm)'},
          {'key': 'low_bp',            'label': 'Low BP (0/1)'},
          {'key': 'contact_with_case', 'label': 'Contact with Case (0/1)'},
          {'key': 'unsafe_water',      'label': 'Unsafe Water (0/1)'},
          {'key': 'age',               'label': 'Age'},
        ];
    }
  }

  @override
  void initState() {
    super.initState();
    for (final f in _fields) {
      _ctrl[f['key']!] = TextEditingController();
    }
  }

  @override
  void dispose() {
    for (final c in _ctrl.values) c.dispose();
    super.dispose();
  }

  Future<void> _predict() async {
    setState(() { _loading = true; _error = ''; _result = null; });
    final body = { for (final f in _fields) f['key']!: num.tryParse(_ctrl[f['key']!]!.text) ?? 0 };
    try {
      final res = await http.post(
        Uri.parse('$BASE_URL/predict/${widget.disease}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      if (res.statusCode == 200) {
        setState(() { _result = jsonDecode(res.body); });
      } else {
        setState(() { _error = 'Server error: ${res.statusCode}'; });
      }
    } catch (e) {
      setState(() { _error = 'Connection failed. Is the backend running?'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  String get _title {
    switch (widget.disease) {
      case 'skin':     return '🔬 Skin Disease';
      case 'diarrhea': return '🌡️ Diarrhea';
      default:         return '💧 Cholera';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_title),
        backgroundColor: const Color(0xFF1A73E8),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          ..._fields.map((f) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: TextField(
              controller: _ctrl[f['key']!],
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: f['label'],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                filled: true,
                fillColor: Colors.grey[50],
              ),
            ),
          )),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _loading ? null : _predict,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A73E8),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text(_loading ? 'Predicting...' : 'Predict', style: const TextStyle(fontSize: 16)),
            ),
          ),
          if (_error.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text(_error, style: const TextStyle(color: Colors.red)),
            ),
          if (_result != null)
            Container(
              margin: const EdgeInsets.only(top: 20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(12),
                border: Border(left: BorderSide(color: Colors.green.shade700, width: 4)),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Prediction Result', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green)),
                const SizedBox(height: 8),
                Text(_result!['prediction'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20))),
                const SizedBox(height: 4),
                Text('Confidence: ${_result!['confidence']}%', style: TextStyle(color: Colors.green[800])),
              ]),
            ),
        ]),
      ),
    );
  }
}
