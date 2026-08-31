"use client";

import { useState } from "react";

import type { ActivityDay } from "@/features/github/lib/queries";

const COLOR_OPENED = "#2a78d6";
const COLOR_MERGED = "#eb6834";
const COLOR_GRIDLINE = "#e1e0d9";
const COLOR_AXIS = "#c3c2b7";
const COLOR_MUTED = "#898781";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 220;
const MARGIN = { top: 12, right: 8, bottom: 28, left: 28 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;
const BAR_RADIUS = 4;
const BAR_GAP = 2;
const MAX_BAR_WIDTH = 24;

type Tooltip = {
  date: string;
  series: "opened" | "merged";
  value: number;
  xPct: number;
  yPct: number;
};

function formatShortDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function computeTicks(maxValue: number) {
  const safeMax = Math.max(1, maxValue);

  if (safeMax <= 5) {
    return Array.from({ length: safeMax + 1 }, (_, i) => i);
  }

  const step = Math.ceil(safeMax / 4);
  const ticks: number[] = [];

  for (let tick = 0; tick <= safeMax + step; tick += step) {
    ticks.push(tick);
  }

  return ticks;
}

function roundedTopBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
) {
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

export function PullRequestActivityChart({ data }: { data: ActivityDay[] }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const maxValue = data.reduce(
    (max, day) => Math.max(max, day.opened, day.merged),
    0,
  );
  const ticks = computeTicks(maxValue);
  const yMax = ticks[ticks.length - 1] || 1;

  const groupWidth = PLOT_WIDTH / data.length;
  const barWidth = Math.min(
    MAX_BAR_WIDTH,
    (groupWidth * 0.7 - BAR_GAP) / 2,
  );

  const yForValue = (value: number) =>
    MARGIN.top + PLOT_HEIGHT - (value / yMax) * PLOT_HEIGHT;

  const showTooltip = (
    date: string,
    series: "opened" | "merged",
    value: number,
    barX: number,
    barY: number,
  ) => {
    setTooltip({
      date,
      series,
      value,
      xPct: ((barX + barWidth / 2) / VIEW_WIDTH) * 100,
      yPct: (barY / VIEW_HEIGHT) * 100,
    });
  };

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_OPENED }}
          />
          Opened
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_MERGED }}
          />
          Merged
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        width="100%"
        height={220}
        role="img"
        aria-label="Pull requests opened and merged over the last 14 days"
        onPointerLeave={() => setTooltip(null)}
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
                {tick}
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

        {data.map((day, index) => {
          const groupX = MARGIN.left + index * groupWidth;
          const groupCenter = groupX + groupWidth / 2;
          const openedX = groupCenter - barWidth - BAR_GAP / 2;
          const mergedX = groupCenter + BAR_GAP / 2;

          const openedY = yForValue(day.opened);
          const openedHeight = MARGIN.top + PLOT_HEIGHT - openedY;
          const mergedY = yForValue(day.merged);
          const mergedHeight = MARGIN.top + PLOT_HEIGHT - mergedY;

          const showLabel = index % 2 === 0;

          return (
            <g key={day.date}>
              {day.opened > 0 && (
                <path
                  d={roundedTopBarPath(openedX, openedY, barWidth, openedHeight)}
                  fill={COLOR_OPENED}
                  tabIndex={0}
                  role="img"
                  aria-label={`${formatShortDate(day.date)}: ${day.opened} opened`}
                  onPointerEnter={() =>
                    showTooltip(day.date, "opened", day.opened, openedX, openedY)
                  }
                  onFocus={() =>
                    showTooltip(day.date, "opened", day.opened, openedX, openedY)
                  }
                  onBlur={() => setTooltip(null)}
                  style={{ cursor: "pointer", outline: "none" }}
                />
              )}

              {day.merged > 0 && (
                <path
                  d={roundedTopBarPath(mergedX, mergedY, barWidth, mergedHeight)}
                  fill={COLOR_MERGED}
                  tabIndex={0}
                  role="img"
                  aria-label={`${formatShortDate(day.date)}: ${day.merged} merged`}
                  onPointerEnter={() =>
                    showTooltip(day.date, "merged", day.merged, mergedX, mergedY)
                  }
                  onFocus={() =>
                    showTooltip(day.date, "merged", day.merged, mergedX, mergedY)
                  }
                  onBlur={() => setTooltip(null)}
                  style={{ cursor: "pointer", outline: "none" }}
                />
              )}

              {showLabel && (
                <text
                  x={groupCenter}
                  y={VIEW_HEIGHT - MARGIN.bottom + 16}
                  fontSize={9}
                  fill={COLOR_MUTED}
                  textAnchor="middle"
                >
                  {formatShortDate(day.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${tooltip.xPct}%`, top: `${tooltip.yPct}%` }}
        >
          <div className="text-slate-400">{formatShortDate(tooltip.date)}</div>
          <div className="flex items-center gap-1.5 text-slate-950">
            <span
              className="inline-block size-2 rounded-full"
              style={{
                backgroundColor:
                  tooltip.series === "opened" ? COLOR_OPENED : COLOR_MERGED,
              }}
            />
            <span className="font-semibold">{tooltip.value}</span>
            <span className="text-slate-500">{tooltip.series}</span>
          </div>
        </div>
      )}

      <table className="sr-only">
        <caption>Pull requests opened and merged per day, last 14 days</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Opened</th>
            <th>Merged</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.date}>
              <td>{formatShortDate(day.date)}</td>
              <td>{day.opened}</td>
              <td>{day.merged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
