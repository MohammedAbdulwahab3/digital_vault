import { channels, revenueSeries } from "@/lib/data";

export function Sidebar() {
  const links = [
    ["📊", "Overview", true],
    ["📈", "Analytics", false],
    ["👥", "Customers", false],
    ["📦", "Orders", false],
    ["⚙️", "Settings", false],
  ] as const;
  return (
    <aside className="sidebar">
      <span className="logo">__PRODUCT_NAME__</span>
      {links.map(([icon, label, active]) => (
        <a key={label} href="#" className={active ? "active" : ""}>
          <span>{icon}</span> {label}
        </a>
      ))}
    </aside>
  );
}

export function StatCard({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="card">
      <h3>{label}</h3>
      <div className="value">{value}</div>
      <div className={`delta ${up ? "up" : "down"}`}>
        {up ? "▲" : "▼"} {delta} vs last month
      </div>
    </div>
  );
}

/** Dependency-free SVG area chart. */
export function RevenueChart() {
  const w = 560;
  const h = 200;
  const max = Math.max(...revenueSeries);
  const x = (i: number) => (i / (revenueSeries.length - 1)) * w;
  const y = (v: number) => h - (v / max) * (h - 20);
  const path = revenueSeries
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%" }}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#fill)" />
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
    </svg>
  );
}

export function ChannelBars() {
  const max = Math.max(...channels.map((c) => c.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {channels.map((c) => (
        <div key={c.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-dim)",
              marginBottom: 4,
            }}
          >
            <span>{c.label}</span>
            <span>{c.value}%</span>
          </div>
          <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 4 }}>
            <div
              style={{
                width: `${(c.value / max) * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(90deg, var(--brand), var(--accent))",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
