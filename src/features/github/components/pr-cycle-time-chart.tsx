"use client";

import { useState } from "react";

import type { CycleTimeSample } from "@/features/github/lib/queries";

const COLOR_BAR = "#2a78d6";
const COLOR_GRIDLINE = "#e1e0d9";
const COLOR_AXIS = "#c3c2b7";
const COLOR_MUTED = "#898781";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 180;
const MARGIN = { top: 12, right: 8, bottom: 24, left: 32 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;
const BAR_RADIUS = 4;
const MAX_BAR_WIDTH = 28;

function formatDuration(hours: number) {
  if (hours < 1) return "<1h";
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${(hours / 24).toFixed(1)}d`;
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

export function PrCycleTimeChart({
  samples,
  medianHours,
}: {
  samples: CycleTimeSample[];
  medianHours: number | null;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = samples.reduce((max, s) => Math.max(max, s.hours), 0);
  const ticks = computeTicks(maxValue);
  const yMax = ticks[ticks.length - 1] || 1;

  const groupWidth = PLOT_WIDTH / Math.max(samples.length, 1);
  const barWidth = Math.min(MAX_BAR_WIDTH, groupWidth * 0.6);

  const yForValue = (value: number) =>
    MARGIN.top + PLOT_HEIGHT - (value / yMax) * PLOT_HEIGHT;

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500">
          Median time to merge
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          {medianHours != null ? formatDuration(medianHours) : "—"}
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          width="100%"
          height={VIEW_HEIGHT}
          role="img"
          aria-label="Time to merge for recently merged pull requests"
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
                  {tick}h
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

          {samples.map((sample, index) => {
            const groupCenter = MARGIN.left + index * groupWidth + groupWidth / 2;
            const barX = groupCenter - barWidth / 2;
            const barY = yForValue(sample.hours);
            const barHeight = MARGIN.top + PLOT_HEIGHT - barY;

            return (
              <g key={`${sample.label}-${index}`}>
                <path
                  d={roundedTopBarPath(barX, barY, barWidth, barHeight)}
                  fill={COLOR_BAR}
                  tabIndex={0}
                  role="img"
                  aria-label={`${sample.label}: ${formatDuration(sample.hours)} to merge`}
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
                  {sample.label}
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
              top: `${(yForValue(samples[hoveredIndex].hours) / VIEW_HEIGHT) * 100}%`,
            }}
          >
            <div className="text-slate-400">{samples[hoveredIndex].label}</div>
            <div className="font-semibold text-slate-950">
              {formatDuration(samples[hoveredIndex].hours)}
            </div>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Time to merge, most recently merged pull requests</caption>
        <thead>
          <tr>
            <th>Pull request</th>
            <th>Hours to merge</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample, index) => (
            <tr key={`${sample.label}-${index}`}>
              <td>{sample.label}</td>
              <td>{Math.round(sample.hours)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
