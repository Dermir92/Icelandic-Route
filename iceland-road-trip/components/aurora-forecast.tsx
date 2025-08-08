"use client"

import { useState, useEffect } from "react"
import { Sparkles, Clock, Cloud, Moon, Sun, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { format, addDays } from "date-fns"

interface AuroraForecastDay {
  date: Date
  kpIndex: number
  cloudCover: number
  probability: number
  viewingQuality: "Poor" | "Fair" | "Good" | "Excellent"
  bestTimeStart: string
  bestTimeEnd: string
  moonPhase:
    | "New"
    | "Waxing Crescent"
    | "First Quarter"
    | "Waxing Gibbous"
    | "Full"
    | "Waning Gibbous"
    | "Last Quarter"
    | "Waning Crescent"
  location: string
}

// Mock data - in a real app, this would come from Iceland Aurora (en.vedur.is/weather/forecasts/aurora)
const getMockAuroraForecast = (startDate: Date, duration: number, region: string): AuroraForecastDay[] => {
  const forecast: AuroraForecastDay[] = []

  // Only generate aurora forecasts for winter months (September to April)
  const month = startDate.getMonth()
  const isWinterSeason = month >= 8 || month <= 3

  if (!isWinterSeason) {
    return []
  }

  // Generate realistic mock data for each day
  for (let i = 0; i < duration; i++) {
    const date = addDays(startDate, i)

    // More realistic KP index values (0-9 scale)
    const kpIndex = Math.min(9, Math.max(0, Math.floor(Math.random() * 6) + (Math.random() > 0.7 ? 2 : 0)))

    // Cloud cover affects visibility dramatically
    const cloudCover = Math.floor(Math.random() * 100)

    // Calculate probability based on KP index and cloud cover
    let probability = Math.max(0, kpIndex * 15 - cloudCover * 0.5)
    probability = Math.min(95, Math.max(0, probability)) // Cap between 0-95%

    // Determine viewing quality
    let viewingQuality: "Poor" | "Fair" | "Good" | "Excellent"
    if (probability > 70) viewingQuality = "Excellent"
    else if (probability > 50) viewingQuality = "Good"
    else if (probability > 30) viewingQuality = "Fair"
    else viewingQuality = "Poor"

    // Best viewing times (typically between 21:00 and 02:00)
    const bestTimeStart = "21:00"
    const bestTimeEnd = "02:00"

    // Moon phases affect visibility (full moon reduces visibility)
    const moonPhases: Array<
      | "New"
      | "Waxing Crescent"
      | "First Quarter"
      | "Waxing Gibbous"
      | "Full"
      | "Waning Gibbous"
      | "Last Quarter"
      | "Waning Crescent"
    > = [
      "New",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent",
    ]
    const moonPhase = moonPhases[(date.getDate() + month) % 8]

    // If full moon, reduce probability
    if (moonPhase === "Full") {
      probability = Math.max(0, probability - 15)
    }

    // Different regions have different viewing conditions
    let location
    switch (region) {
      case "North Iceland":
        location = "Lake Mývatn area"
        break
      case "Reykjavík":
        location = "Grótta lighthouse"
        break
      case "South Iceland":
        location = "Þingvellir National Park"
        break
      case "Snæfellsnes Peninsula":
        location = "Kirkjufell mountain"
        break
      default:
        location = "Away from city lights"
    }

    forecast.push({
      date,
      kpIndex,
      cloudCover,
      probability,
      viewingQuality,
      bestTimeStart,
      bestTimeEnd,
      moonPhase,
      location,
    })
  }

  return forecast
}

interface AuroraForecastProps {
  startDate: Date
  duration: number
  region: string
}

export default function AuroraForecast({ startDate, duration, region }: AuroraForecastProps) {
  const [forecast, setForecast] = useState<AuroraForecastDay[]>([])
  const [isWinterSeason, setIsWinterSeason] = useState(false)

  useEffect(() => {
    // Check if it's aurora season (September to April)
    const month = startDate.getMonth()
    const winterSeason = month >= 8 || month <= 3
    setIsWinterSeason(winterSeason)

    if (winterSeason) {
      // In a real app, this would be an API call to Iceland Aurora forecast
      const auroraForecast = getMockAuroraForecast(startDate, duration, region)
      setForecast(auroraForecast)
    }
  }, [startDate, duration, region])

  if (!isWinterSeason) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Aurora Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Sun className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Not Aurora Season</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The Northern Lights are typically visible in Iceland from late August to early April when there are dark
              nights. Your trip is during the brighter months when aurora viewing is not possible.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const bestViewingDay = forecast.reduce(
    (best, current) => (current.probability > best.probability ? current : best),
    forecast[0],
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          Aurora Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Northern Lights forecast from Iceland Aurora (Veðurstofan) for your travel dates.
        </p>

        {bestViewingDay && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <h3 className="text-sm font-medium flex items-center">
              <Sparkles className="mr-1 h-4 w-4" />
              Best Viewing Opportunity
            </h3>
            <p className="text-sm mt-1">
              {format(bestViewingDay.date, "EEEE, MMMM d")} - {bestViewingDay.probability}% chance at{" "}
              {bestViewingDay.location}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {forecast.map((day, index) => (
            <div key={index} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{format(day.date, "EEE, MMM d")}</div>
                <Badge
                  variant={
                    day.viewingQuality === "Excellent"
                      ? "default"
                      : day.viewingQuality === "Good"
                        ? "secondary"
                        : day.viewingQuality === "Fair"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {day.viewingQuality}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>Kp-index: {day.kpIndex}/9</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {day.bestTimeStart} - {day.bestTimeEnd}
                  </span>
                </div>
                <div className="flex items-center">
                  <Cloud className="h-3 w-3 mr-1" />
                  <span>Cloud cover: {day.cloudCover}%</span>
                </div>
                <div className="flex items-center">
                  <Moon className="h-3 w-3 mr-1" />
                  <span>Moon: {day.moonPhase}</span>
                </div>
              </div>

              <div className="w-full">
                <div className="text-xs text-muted-foreground mb-1">Viewing probability: {day.probability}%</div>
                <Progress value={day.probability} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Recommended viewing location: <strong>{forecast[0]?.location || "Away from city lights"}</strong>
          </p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Check cloud cover before heading out</li>
            <li>Allow 20-30 minutes for your eyes to adjust to darkness</li>
            <li>Bring warm clothes, hot drinks, and a camera with tripod</li>
          </ul>
        </div>

        <Button variant="outline" size="sm" className="w-full mt-4 text-xs" asChild>
          <a href="https://en.vedur.is/weather/forecasts/aurora" target="_blank" rel="noopener noreferrer">
            View Official Aurora Forecast
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
