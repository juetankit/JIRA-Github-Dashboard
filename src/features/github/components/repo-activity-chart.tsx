"use client";

import { useState } from "react";

import type { RepoActivity } from "@/features/github/lib/queries";

// Sequential blue ramp, darkest -> lightest, copied verbatim from the
// dataviz skill's reference palette (steps 700 down to 400). Rank 0 (most
// active repo) gets the darkest step; each subsequent rank steps lighter.
const RAMP = ["#0d366b", "#104281", "#184f95", "#1c5cab", "#256abf", "#2a78d6", "#3987e5"];

const VIEW_WIDTH = 640;
const ROW_HEIGHT = 32;
const BAR_THICKNESS = 20;
const LABEL_WIDTH = 150;
const VALUE_WIDTH = 40;
const MARGIN_TOP = 8;
const BAR_AREA_WIDTH = VIEW_WIDTH - LABEL_WIDTH - VALUE_WIDTH;

function truncate(label: string, max = 20) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export function RepoActivityChart({ data }: { data: RepoActivity[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxTotal = data.reduce((max, row) => Math.max(max, row.total), 0) || 1;
  const viewHeight = MARGIN_TOP * 2 + data.length * ROW_HEIGHT;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
        width="100%"
        height={viewHeight}
        role="img"
        aria-label="Pull request and commit activity by repository, last 30 days"
        onPointerLeave={() => setHoveredIndex(null)}
      >
        {data.map((row, index) => {
          const y = MARGIN_TOP + index * ROW_HEIGHT + (ROW_HEIGHT - BAR_THICKNESS) / 2;
          const barWidth = (row.total / maxTotal) * BAR_AREA_WIDTH;
          const color = RAMP[Math.min(index, RAMP.length - 1)];

          return (
            <g key={row.repo}>
              <text
                x={LABEL_WIDTH - 10}
                y={y + BAR_THICKNESS / 2}
                fontSize={11}
                fill="#0b0b0b"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {truncate(row.repo)}
              </text>

              <rect
                x={LABEL_WIDTH}
                y={y}
                width={Math.max(barWidth, 2)}
                height={BAR_THICKNESS}
                rx={4}
                fill={color}
                tabIndex={0}
                role="img"
                aria-label={`${row.repo}: ${row.total} total (${row.prCount} pull requests, ${row.commitCount} commits)`}
                onPointerEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                style={{ cursor: "pointer", outline: "none" }}
              />

              <text
                x={LABEL_WIDTH + Math.max(barWidth, 2) + 6}
                y={y + BAR_THICKNESS / 2}
                fontSize={11}
                fontWeight={600}
                fill="#0b0b0b"
                dominantBaseline="middle"
              >
                {row.total}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredIndex != null && (
        <div
          className="pointer-events-none absolute z-10 -translate-y-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${(LABEL_WIDTH / VIEW_WIDTH) * 100}%`,
            top: `${
              ((MARGIN_TOP + hoveredIndex * ROW_HEIGHT) / viewHeight) * 100
            }%`,
          }}
        >
          <div className="font-semibold text-slate-950">
            {data[hoveredIndex].repo}
          </div>
          <div className="text-slate-500">
            {data[hoveredIndex].prCount} PRs · {data[hoveredIndex].commitCount}{" "}
            commits
          </div>
        </div>
      )}

      <table className="sr-only">
        <caption>Activity by repository, last 30 days</caption>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Pull requests</th>
            <th>Commits</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.repo}>
              <td>{row.repo}</td>
              <td>{row.prCount}</td>
              <td>{row.commitCount}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
