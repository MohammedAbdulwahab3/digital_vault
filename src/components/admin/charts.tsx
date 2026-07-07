"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";

/*
 * Chart colors validated (dataviz six checks) against surface #12121a:
 * revenue series #a855f7 · category bars #0891b2
 */
const LINE = "#a855f7";
const BAR = "#0891b2";

export type RevenuePoint = { label: string; value: number };

/** Single-series revenue area chart with crosshair + tooltip and table view. */
export function RevenueChart({ points }: { points: RevenuePoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const W = 640;
  const H = 220;
  const PAD = { top: 16, right: 12, bottom: 28, left: 52 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;

  const max = Math.max(...points.map((p) => p.value), 1);
  // Round the axis top to a clean step
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;

  const x = (i: number) =>
    PAD.left + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / top) * ih;

  const path = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" "),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points, top]
  );

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  if (showTable) {
    return (
      <div>
        <TableToggle showTable={showTable} onToggle={() => setShowTable(false)} />
        <div className="max-h-56 overflow-y-auto">
          <table className="data-table">
            <thead>
              <tr><th>Day</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.label}>
                  <td>{p.label}</td>
                  <td>{formatPrice(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TableToggle showTable={showTable} onToggle={() => setShowTable(true)} />
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * W;
            const idx = Math.round(((px - PAD.left) / iw) * (points.length - 1));
            setHover(Math.max(0, Math.min(points.length - 1, idx)));
          }}
          role="img"
          aria-label="Daily revenue for the last 30 days"
        >
          {/* Grid */}
          {gridLines.map((g) => (
            <g key={g}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={PAD.top + ih * (1 - g)}
                y2={PAD.top + ih * (1 - g)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={PAD.top + ih * (1 - g) + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="#8888a0"
              >
                {formatPrice(top * g)}
              </text>
            </g>
          ))}
          {/* X labels: first, middle, last */}
          {[0, Math.floor((points.length - 1) / 2), points.length - 1].map((i) => (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
              fontSize="10"
              fill="#8888a0"
            >
              {points[i]?.label}
            </text>
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE} stopOpacity="0.25" />
              <stop offset="100%" stopColor={LINE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${path} L${x(points.length - 1)},${PAD.top + ih} L${x(0)},${PAD.top + ih} Z`}
            fill="url(#rev-fill)"
          />
          {/* Line */}
          <path d={path} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" />

          {/* Crosshair + hovered point */}
          {hover !== null && points[hover] && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={PAD.top + ih}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={x(hover)}
                cy={y(points[hover].value)}
                r="4.5"
                fill={LINE}
                stroke="#12121a"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {hover !== null && points[hover] && (
          <div
            className="glass-strong pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg px-3 py-1.5 text-xs shadow-xl"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              top: `${((y(points[hover].value) - 42) / H) * 100}%`,
            }}
          >
            <span className="text-fog-2">{points[hover].label}</span>{" "}
            <strong>{formatPrice(points[hover].value)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export type CategoryBar = { label: string; value: number; display: string };

/** Horizontal single-hue bar chart (magnitude by length) with hover + table view. */
export function CategoryBarChart({ bars, unit }: { bars: CategoryBar[]; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(...bars.map((b) => b.value), 1);

  if (showTable) {
    return (
      <div>
        <TableToggle showTable={showTable} onToggle={() => setShowTable(false)} />
        <table className="data-table">
          <thead>
            <tr><th>Category</th><th>{unit}</th></tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.label}>
                <td>{b.label}</td>
                <td>{b.display}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <TableToggle showTable={showTable} onToggle={() => setShowTable(true)} />
      <div className="flex flex-col gap-2.5">
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            className="group"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-fog-2">{bar.label}</span>
              <span className={hover === i ? "font-bold text-fog" : "text-fog-2"}>
                {bar.display}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-[4px] bg-white/[0.04]">
              <div
                className="h-full rounded-[4px] transition-all duration-500"
                style={{
                  width: `${Math.max((bar.value / max) * 100, 1.5)}%`,
                  background: BAR,
                  opacity: hover === null || hover === i ? 1 : 0.45,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableToggle({ showTable, onToggle }: { showTable: boolean; onToggle: () => void }) {
  return (
    <div className="mb-3 flex justify-end">
      <button
        onClick={onToggle}
        className="text-[11px] font-medium text-fog-2 underline-offset-4 transition hover:text-fog hover:underline"
      >
        {showTable ? "◫ View chart" : "▤ View data"}
      </button>
    </div>
  );
}
