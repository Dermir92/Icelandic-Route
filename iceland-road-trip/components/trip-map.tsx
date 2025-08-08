"use client"

import { useEffect, useRef } from "react"
import type { Attraction } from "@/lib/trip-data"

interface TripMapProps {
  region: string
  attractions: Attraction[]
}

export default function TripMap({ region, attractions }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, we would use a mapping library like Leaflet or Google Maps
    // For this example, we'll just display a placeholder
    if (mapRef.current) {
      const mapContainer = mapRef.current

      // Clear any existing content
      while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild)
      }

      // Create a simple placeholder map
      const canvas = document.createElement("canvas")
      canvas.width = mapContainer.clientWidth
      canvas.height = 300
      mapContainer.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a simple map placeholder
        ctx.fillStyle = "#e5e7eb" // Light gray background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw a "road"
        ctx.strokeStyle = "#1e40af" // Blue line for the route
        ctx.lineWidth = 3
        ctx.beginPath()

        // Adjust the path based on region
        if (region === "Golden Circle") {
          // Circular route
          ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2)
        } else if (region === "South Iceland") {
          // Horizontal route along the south
          ctx.moveTo(50, 150)
          ctx.bezierCurveTo(canvas.width * 0.3, 180, canvas.width * 0.6, 200, canvas.width - 50, 150)
        } else if (region === "Snæfellsnes Peninsula") {
          // Peninsula shape
          ctx.moveTo(50, 150)
          ctx.bezierCurveTo(canvas.width * 0.3, 100, canvas.width * 0.7, 100, canvas.width - 50, 150)
          ctx.lineTo(canvas.width - 50, 200)
          ctx.bezierCurveTo(canvas.width * 0.7, 250, canvas.width * 0.3, 250, 50, 200)
          ctx.closePath()
        } else {
          // Default route
          ctx.moveTo(50, 150)
          ctx.bezierCurveTo(canvas.width * 0.3, 100, canvas.width * 0.6, 200, canvas.width - 50, 150)
        }
        ctx.stroke()

        // Draw "locations" for each attraction
        attractions.forEach((attraction, index) => {
          const x = 50 + ((index + 1) * (canvas.width - 100)) / (attractions.length + 1)
          const y = 150 + Math.sin(index * 0.7) * 50

          ctx.fillStyle = "#1e40af"
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "#000000"
          ctx.font = "12px Arial"
          ctx.fillText(attraction.name, x + 10, y + 5)
        })

        // Add a note
        ctx.fillStyle = "#6b7280"
        ctx.font = "italic 12px Arial"
        ctx.fillText("Interactive map would be implemented with Leaflet or Google Maps API", 20, canvas.height - 20)
      }

      return () => {
        if (mapContainer.contains(canvas)) {
          mapContainer.removeChild(canvas)
        }
      }
    }
  }, [region, attractions])

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px] bg-muted rounded-md border"
      aria-label={`Map showing the road trip route through ${region}`}
    ></div>
  )
}
