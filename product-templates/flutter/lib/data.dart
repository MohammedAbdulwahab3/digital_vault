// Sample data — swap for your real API layer.

class Stat {
  final String label, value, delta;
  final bool up;
  const Stat(this.label, this.value, this.delta, this.up);
}

const stats = [
  Stat('Total Revenue', '\$48,290', '+12.4%', true),
  Stat('Active Users', '3,842', '+8.1%', true),
  Stat('Conversion', '4.7%', '-0.3%', false),
  Stat('Avg. Order', '\$86.20', '+2.9%', true),
];

const revenueSeries = <double>[
  32, 45, 38, 52, 48, 61, 55, 67, 62, 78, 71, 84, 80, 92, 88, 96, 90, 104,
  98, 112, 108, 118, 114, 126, 120, 132, 128, 138, 134, 146,
];

class Activity {
  final String title, subtitle, amount;
  final bool positive;
  const Activity(this.title, this.subtitle, this.amount, this.positive);
}

const activities = [
  Activity('Order #4821 — Alex Chen', 'Today · Paid', '+\$129.00', true),
  Activity('Order #4820 — Sarah Miller', 'Today · Paid', '+\$59.00', true),
  Activity('Refund #4790 — J. Park', 'Yesterday', '-\$49.00', false),
  Activity('Order #4818 — Nina Osei', 'Yesterday · Paid', '+\$86.00', true),
  Activity('Order #4817 — Leo Tanaka', 'Jul 4 · Paid', '+\$174.00', true),
];

class Channel {
  final String label;
  final int value;
  const Channel(this.label, this.value);
}

const channels = [
  Channel('Organic search', 42),
  Channel('Direct', 27),
  Channel('Referral', 18),
  Channel('Social', 13),
];
