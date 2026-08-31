"use client";

import { CircleCheck, OctagonAlert, TriangleAlert } from "lucide-react";
import { useState } from "react";

import type { OpenPRAge } from "@/features/github/lib/queries";

type Bucket = "good" | "warning" | "critical";

const BUCKET_COLOR: Record<Bucket, string> = {
  good: "#0ca30c",
  warning: "#fab219",
  critical: "#d03b3b",
};

const COLOR_GRIDLINE = "#e1e0d9";
const COLOR_AXIS = "#c3c2b7";
const COLOR_MUTED = "#898781";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 180;
const MARGIN = { top: 12, right: 8, bottom: 24, left: 28 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;
const BAR_RADIUS = 4;
const MAX_BAR_WIDTH = 28;

function bucketFor(days: number): Bucket {
  if (days < 3) return "good";
  if (days <= 7) return "warning";
  return "critical";
}

function formatDays(days: number) {
  return days < 1 ? "<1d" : `${Math.round(days)}d`;
}

function computeTicks(maxValue: number) {
  const safeMax = Math.max(1, maxValue);
  const step = Math.ceil(safeMax / 4) || 1;
  const ticks: number[] = [];

  for (let tick = 0; tick <= safeMax + step; tick += step) {
    ticks.push(tick);
  }

  return ticks;
}

function roundedTopBarPath(x: number, y: number, width: number, height: number) {
  if (height <= 0) return "";

  const radius = Math.min(BAR_RADIUS, width / 2, height);

  return [
    `M${x},${y + height}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + width - radius},${y}`,
    `Q${x + width},${y} ${x + width},${y + radius}`,
    `L${x + width},${y + height}`,
    "Z",
  ].join(" ");
}

export function OpenPrAgeChart({ data }: { data: OpenPRAge[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = data.reduce((max, d) => Math.max(max, d.days), 0);
  const ticks = computeTicks(maxValue);
  const yMax = ticks[ticks.length - 1] || 1;

  const groupWidth = PLOT_WIDTH / Math.max(data.length, 1);
  const barWidth = Math.min(MAX_BAR_WIDTH, groupWidth * 0.6);

  const yForValue = (value: number) =>
    MARGIN.top + PLOT_HEIGHT - (value / yMax) * PLOT_HEIGHT;

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CircleCheck className="size-3.5" style={{ color: BUCKET_COLOR.good }} />
          Fresh (&lt;3d)
        </span>
        <span className="flex items-center gap-1.5">
          <TriangleAlert
            className="size-3.5"
            style={{ color: BUCKET_COLOR.warning }}
          />
          Aging (3–7d)
        </span>
        <span className="flex items-center gap-1.5">
          <OctagonAlert
            className="size-3.5"
            style={{ color: BUCKET_COLOR.critical }}
          />
          Stale (&gt;7d)
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          width="100%"
          height={VIEW_HEIGHT}
          role="img"
          aria-label="Age of currently open pull requests"
          onPointerLeave={() => setHoveredIndex(null)}
        >
          {ticks.map((tick) => {
            const y = yForValue(tick);
            return (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={VIEW_WIDTH - MARGIN.right}
                  y1={y}
                  y2={y}
                  stroke={COLOR_GRIDLINE}
                  strokeWidth={1}
                />
                <text
                  x={MARGIN.left - 8}
                  y={y}
                  fontSize={10}
                  fill={COLOR_MUTED}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {tick}d
                </text>
              </g>
            );
          })}

          <line
            x1={MARGIN.left}
            x2={VIEW_WIDTH - MARGIN.right}
            y1={MARGIN.top + PLOT_HEIGHT}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={COLOR_AXIS}
            strokeWidth={1}
          />

          {data.map((pr, index) => {
            const groupCenter = MARGIN.left + index * groupWidth + groupWidth / 2;
            const barX = groupCenter - barWidth / 2;
            const barY = yForValue(pr.days);
            const barHeight = MARGIN.top + PLOT_HEIGHT - barY;
            const bucket = bucketFor(pr.days);

            return (
              <g key={`${pr.repo}-${pr.label}`}>
                <path
                  d={roundedTopBarPath(barX, barY, barWidth, barHeight)}
                  fill={BUCKET_COLOR[bucket]}
                  tabIndex={0}
                  role="img"
                  aria-label={`${pr.repo} ${pr.label}: open for ${formatDays(pr.days)}`}
                  onPointerEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer", outline: "none" }}
                />

                <text
                  x={groupCenter}
                  y={VIEW_HEIGHT - MARGIN.bottom + 14}
                  fontSize={9}
                  fill={COLOR_MUTED}
                  textAnchor="middle"
                >
                  {pr.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex != null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
            style={{
              left: `${
                ((MARGIN.left + hoveredIndex * groupWidth + groupWidth / 2) /
                  VIEW_WIDTH) *
                100
              }%`,
              top: `${(yForValue(data[hoveredIndex].days) / VIEW_HEIGHT) * 100}%`,
            }}
          >
            <div className="text-slate-400">
              {data[hoveredIndex].repo} {data[hoveredIndex].label}
            </div>
            <div className="font-semibold text-slate-950">
              {formatDays(data[hoveredIndex].days)} open
            </div>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Age of currently open pull requests</caption>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Pull request</th>
            <th>Days open</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pr, index) => (
            <tr key={`${pr.repo}-${pr.label}-${index}`}>
              <td>{pr.repo}</td>
              <td>{pr.label}</td>
              <td>{Math.round(pr.days)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
