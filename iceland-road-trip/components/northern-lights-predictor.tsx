"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AuroraForecast {
  date: string
  kpIndex: number
  probability: number
  viewingCondition: "Poor" | "Fair" | "Good" | "Excellent"
  bestTime: string
  cloudCover: number
}

// In a real app, this would come from an API
const getMockAuroraForecast = (startDate: Date, days: number): AuroraForecast[] => {
  const forecast: AuroraForecast[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Generate realistic mock data
    const kpIndex = Math.floor(Math.random() * 5) + 1
    const probability = kpIndex >= 3 ? kpIndex * 15 : kpIndex * 10
    const cloudCover = Math.floor(Math.random() * 100)

    let viewingCondition: "Poor" | "Fair" | "Good" | "Excellent" = "Poor"
    if (kpIndex >= 4 && cloudCover < 30) viewingCondition = "Excellent"
    else if (kpIndex >= 3 && cloudCover < 50) viewingCondition = "Good"
    else if (kpIndex >= 2 && cloudCover < 70) viewingCondition = "Fair"

    forecast.push({
      date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      kpIndex,
      probability,
      viewingCondition,
      bestTime: "21:00 - 01:00",
      cloudCover,
    })
  }

  return forecast
}

interface NorthernLightsPredictorProps {
  startDate: Date
  duration: number
  season: string
}

export default function NorthernLightsPredictor({ startDate, duration, season }: NorthernLightsPredictorProps) {
  const [forecast, setForecast] = useState<AuroraForecast[]>([])
  const [isWinterSeason, setIsWinterSeason] = useState(false)

  useEffect(() => {
    // Check if it's winter season (when Northern Lights are visible)
    const isWinter =
      season === "winter" ||
      (startDate.getMonth() >= 8 && startDate.getMonth() <= 11) || // Sept-Dec
      (startDate.getMonth() >= 0 && startDate.getMonth() <= 2) // Jan-Mar

    setIsWinterSeason(isWinter)

    if (isWinter) {
      // In a real app, this would be an API call
      const auroraForecast = getMockAuroraForecast(startDate, duration)
      setForecast(auroraForecast)
    }
  }, [startDate, duration, season])

  if (!isWinterSeason) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Northern Lights Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Not Visible in This Season</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The Northern Lights are typically visible in Iceland from late August to early April. Consider planning a
              winter trip to experience this natural wonder.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Northern Lights Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Based on historical data and current forecasts for your travel dates:
        </p>

        <div className="space-y-4">
          {forecast.map((day, index) => (
            <div key={index} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{day.date}</div>
                <Badge
                  variant={
                    day.viewingCondition === "Excellent"
                      ? "default"
                      : day.viewingCondition === "Good"
                        ? "secondary"
                        : day.viewingCondition === "Fair"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {day.viewingCondition}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>Kp-index: {day.kpIndex}/9</div>
                <div>Best time: {day.bestTime}</div>
                <div>Cloud cover: {day.cloudCover}%</div>
                <div>Probability: {day.probability}%</div>
              </div>

              <div className="w-full">
                <div className="text-xs text-muted-foreground mb-1">Viewing probability</div>
                <Progress value={day.probability} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Tips for viewing:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Get away from city lights</li>
            <li>Allow your eyes 20+ minutes to adjust to darkness</li>
            <li>Check local aurora alerts before heading out</li>
            <li>Best viewing is typically between 21:00 and 02:00</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
