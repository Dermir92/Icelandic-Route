"use client"

import type { Attraction } from "@/lib/trip-data"

interface TripMapProps {
  region: string
  attractions: Attraction[]
}

// Approximate SVG paths for each region (viewBox 0 0 600 220)
const ROUTE_PATHS: Record<string, string> = {
  "Golden Circle":
    "M 120 110 C 180 50, 340 50, 400 110 C 460 170, 340 200, 240 195 C 140 190, 80 170, 120 110",
  "South Iceland":
    "M 50 130 C 140 100, 240 150, 340 120 C 420 100, 480 130, 560 115",
  "Snæfellsnes Peninsula":
    "M 80 150 C 150 100, 260 85, 360 110 C 440 130, 480 125, 520 140 C 460 180, 360 195, 250 185 C 150 175, 90 185, 80 150",
  "West Iceland":
    "M 70 160 C 130 110, 220 90, 320 120 C 410 145, 460 130, 530 140",
  "North Iceland":
    "M 50 140 C 140 90, 260 80, 360 110 C 450 135, 500 125, 550 135",
  "Westfjords":
    "M 70 130 C 120 70, 190 55, 260 85 C 320 110, 350 130, 390 120 C 430 110, 460 130, 490 150",
  "Highlands":
    "M 90 170 C 180 130, 270 110, 360 135 C 440 155, 480 145, 530 155",
  "Reykjavík & Surroundings":
    "M 110 150 C 170 110, 260 105, 330 130 C 390 150, 420 145, 470 140",
  "East Iceland":
    "M 60 135 C 150 90, 270 85, 370 115 C 450 140, 500 135, 555 145",
  "All Iceland":
    "M 60 120 C 140 70, 260 75, 360 105 C 450 130, 500 115, 560 125 C 480 185, 360 205, 250 195 C 150 185, 80 190, 60 120",
}

// Place markers evenly along a horizontal sweep (approximate positions)
function getMarkerPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1)
    // Gentle S-curve distribution across the viewBox
    const x = 60 + t * 490
    const y = 125 + Math.sin(t * Math.PI) * 45 - Math.cos(t * Math.PI * 2) * 15
    return { x: Math.round(x), y: Math.round(y) }
  })
}

export default function TripMap({ region, attractions }: TripMapProps) {
  const routePath = ROUTE_PATHS[region] ?? ROUTE_PATHS["All Iceland"]
  const displayed = attractions.slice(0, 7)
  const positions = getMarkerPositions(displayed.length)

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200/80 bg-white">
      {/* Map preview area */}
      <div
        className="relative w-full"
        style={{
          background:
            "linear-gradient(170deg, #d6e8f0 0%, #e4eedd 45%, #dce8d8 100%)",
        }}
      >
        {/* Subtle topographic rings */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <ellipse cx="50%" cy="50%" rx="38%" ry="32%" fill="none" stroke="#8aabb0" strokeWidth="0.8" />
          <ellipse cx="50%" cy="50%" rx="28%" ry="22%" fill="none" stroke="#8aabb0" strokeWidth="0.8" />
          <ellipse cx="50%" cy="50%" rx="18%" ry="14%" fill="none" stroke="#8aabb0" strokeWidth="0.6" />
          <ellipse cx="30%" cy="40%" rx="14%" ry="10%" fill="none" stroke="#a0b8a8" strokeWidth="0.6" />
          <ellipse cx="70%" cy="60%" rx="12%" ry="8%" fill="none" stroke="#a0b8a8" strokeWidth="0.6" />
        </svg>

        <svg
          viewBox="0 0 600 220"
          className="w-full"
          style={{ height: 200 }}
          aria-label={`Approximate route preview through ${region}`}
        >
          {/* Terrain fill hint */}
          <ellipse cx="300" cy="115" rx="240" ry="80" fill="rgba(160,185,155,0.18)" />

          {/* Route glow / shadow */}
          <path
            d={routePath}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Route dashed line */}
          <path
            d={routePath}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="7 4"
          />

          {/* Numbered markers */}
          {displayed.map((_, i) => {
            const { x, y } = positions[i]
            return (
              <g key={i}>
                {/* White halo */}
                <circle cx={x} cy={y} r="13" fill="white" opacity="0.9" />
                {/* Marker fill */}
                <circle cx={x} cy={y} r="10" fill="#1d4ed8" />
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {i + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 flex-1">
            {displayed.map((attr, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs text-slate-600"
              >
                <span className="inline-flex w-4 h-4 rounded-full bg-blue-700 text-white items-center justify-center font-bold flex-shrink-0"
                  style={{ fontSize: 9 }}>
                  {i + 1}
                </span>
                <span className="truncate" style={{ maxWidth: 120 }}>
                  {attr.name}
                </span>
              </span>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">
            Map preview · full routing coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
