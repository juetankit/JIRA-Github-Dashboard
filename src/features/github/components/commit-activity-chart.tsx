"use client";

import { useRef, useState } from "react";

import type { CommitDay } from "@/features/github/lib/queries";

const COLOR_LINE = "#2a78d6";
const COLOR_GRIDLINE = "#e1e0d9";
const COLOR_AXIS = "#c3c2b7";
const COLOR_MUTED = "#898781";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 220;
const MARGIN = { top: 12, right: 8, bottom: 28, left: 28 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;

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

export function CommitActivityChart({ data }: { data: CommitDay[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = data.reduce((max, day) => Math.max(max, day.count), 0);
  const ticks = computeTicks(maxValue);
  const yMax = ticks[ticks.length - 1] || 1;

  const stepX = data.length > 1 ? PLOT_WIDTH / (data.length - 1) : 0;
  const yForValue = (value: number) =>
    MARGIN.top + PLOT_HEIGHT - (value / yMax) * PLOT_HEIGHT;

  const points = data.map((day, index) => ({
    x: MARGIN.left + index * stepX,
    y: yForValue(day.count),
    ...day,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? [
          `M${points[0].x},${MARGIN.top + PLOT_HEIGHT}`,
          ...points.map((p) => `L${p.x},${p.y}`),
          `L${points[points.length - 1].x},${MARGIN.top + PLOT_HEIGHT}`,
          "Z",
        ].join(" ")
      : "";

  const updateHoverFromClientX = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;

    const rect = svg.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    const svgX = fraction * VIEW_WIDTH;

    let closest = 0;
    let closestDistance = Infinity;
    points.forEach((p, i) => {
      const distance = Math.abs(p.x - svgX);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });

    setHoveredIndex(closest);
  };

  const hovered = hoveredIndex != null ? points[hoveredIndex] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        width="100%"
        height={220}
        role="img"
        aria-label="Commits per day over the last 14 days"
        onPointerMove={(e) => updateHoverFromClientX(e.clientX)}
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

        {areaPath && <path d={areaPath} fill={COLOR_LINE} fillOpacity={0.1} />}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={COLOR_LINE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={MARGIN.top}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={COLOR_AXIS}
            strokeWidth={1}
          />
        )}

        {points.map((p, index) => (
          <circle
            key={p.date}
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === index ? 5 : 4}
            fill={COLOR_LINE}
            stroke="#fcfcfb"
            strokeWidth={2}
          />
        ))}

        {points.map((p, index) => (
          <rect
            key={`hit-${p.date}`}
            x={p.x - stepX / 2}
            y={MARGIN.top}
            width={stepX || PLOT_WIDTH}
            height={PLOT_HEIGHT}
            fill="transparent"
            tabIndex={0}
            role="img"
            aria-label={`${formatShortDate(p.date)}: ${p.count} commits`}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            style={{ outline: "none" }}
          />
        ))}

        {points.map(
          (p, index) =>
            index % 2 === 0 && (
              <text
                key={`label-${p.date}`}
                x={p.x}
                y={VIEW_HEIGHT - MARGIN.bottom + 16}
                fontSize={9}
                fill={COLOR_MUTED}
                textAnchor="middle"
              >
                {formatShortDate(p.date)}
              </text>
            ),
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${(hovered.x / VIEW_WIDTH) * 100}%`,
            top: `${(hovered.y / VIEW_HEIGHT) * 100}%`,
          }}
        >
          <div className="text-slate-400">{formatShortDate(hovered.date)}</div>
          <div className="text-slate-950">
            <span className="font-semibold">{hovered.count}</span>{" "}
            <span className="text-slate-500">commits</span>
          </div>
        </div>
      )}

      <table className="sr-only">
        <caption>Commits per day, last 14 days</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Commits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.date}>
              <td>{formatShortDate(day.date)}</td>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
