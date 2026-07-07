import 'package:flutter/material.dart';
import '../theme.dart';

/// Dependency-free area chart drawn with CustomPainter.
class MiniChart extends StatelessWidget {
  final List<double> series;
  const MiniChart({super.key, required this.series});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 160,
      width: double.infinity,
      child: CustomPaint(painter: _ChartPainter(series)),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<double> series;
  _ChartPainter(this.series);

  @override
  void paint(Canvas canvas, Size size) {
    final max = series.reduce((a, b) => a > b ? a : b);
    final dx = size.width / (series.length - 1);

    final line = Path();
    for (var i = 0; i < series.length; i++) {
      final x = i * dx;
      final y = size.height - (series[i] / max) * (size.height - 16);
      if (i == 0) {
        line.moveTo(x, y);
      } else {
        line.lineTo(x, y);
      }
    }

    final fill = Path.from(line)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(
      fill,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [brand.withValues(alpha: 0.30), brand.withValues(alpha: 0)],
        ).createShader(Offset.zero & size),
    );
    canvas.drawPath(
      line,
      Paint()
        ..color = brand
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant _ChartPainter old) => old.series != series;
}
