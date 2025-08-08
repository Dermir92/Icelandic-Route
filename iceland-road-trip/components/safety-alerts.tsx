"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Info, Shield, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SafetyAlert {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high"
  region: string
  date: string
  source: "safetravel" | "vedur" | "road" | "112"
  link?: string
}

// Mock data - in a real app, this would come from SafeTravel.is API
const getMockSafetyAlerts = (region: string): SafetyAlert[] => {
  const allAlerts: SafetyAlert[] = [
    {
      id: "1",
      title: "Strong winds in highland areas",
      description: "Wind gusts up to 25-30 m/s expected in mountain passes and highland roads. Travel with caution.",
      severity: "medium",
      region: "Highlands",
      date: "2025-04-20",
      source: "vedur",
      link: "https://en.vedur.is/weather/forecasts/areas/",
    },
    {
      id: "2",
      title: "Road closures on F-roads",
      description: "Several F-roads in the highlands remain closed due to snow and poor conditions.",
      severity: "medium",
      region: "Highlands",
      date: "2025-04-20",
      source: "road",
      link: "https://www.road.is/",
    },
    {
      id: "3",
      title: "Increased volcanic activity near Fagradalsfjall",
      description:
        "Increased seismic activity detected. No immediate danger, but visitors should stay on marked paths.",
      severity: "low",
      region: "Reykjanes Peninsula",
      date: "2025-04-19",
      source: "safetravel",
      link: "https://safetravel.is/",
    },
    {
      id: "4",
      title: "High tide warning at Reynisfjara Beach",
      description: "Dangerous sneaker waves expected during high tide. Keep a safe distance from the shoreline.",
      severity: "high",
      region: "South Iceland",
      date: "2025-04-20",
      source: "safetravel",
      link: "https://safetravel.is/",
    },
    {
      id: "5",
      title: "Limited visibility in East Fjords",
      description: "Fog and low clouds reducing visibility on mountain roads in East Fjords. Drive with caution.",
      severity: "medium",
      region: "East Iceland",
      date: "2025-04-20",
      source: "vedur",
      link: "https://en.vedur.is/weather/forecasts/areas/",
    },
    {
      id: "6",
      title: "River crossing conditions",
      description:
        "Water levels rising in unbridged rivers in the highlands. Check conditions before attempting crossings.",
      severity: "medium",
      region: "Highlands",
      date: "2025-04-19",
      source: "safetravel",
      link: "https://safetravel.is/",
    },
    {
      id: "7",
      title: "Avalanche risk in Westfjords",
      description: "Increased risk of avalanches on steep slopes in the Westfjords after recent snowfall.",
      severity: "high",
      region: "Westfjords",
      date: "2025-04-20",
      source: "112",
      link: "https://safetravel.is/",
    },
  ]

  // Filter alerts by region if specified, otherwise return all
  if (region && region !== "all" && region !== "Iceland") {
    return allAlerts.filter(
      (alert) => alert.region.toLowerCase().includes(region.toLowerCase()) || alert.severity === "high",
    )
  }

  return allAlerts
}

interface SafetyAlertsProps {
  region: string
}

export default function SafetyAlerts({ region }: SafetyAlertsProps) {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call to SafeTravel.is or other safety sources
    const fetchedAlerts = getMockSafetyAlerts(region)
    setAlerts(fetchedAlerts)
  }, [region])

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3)
  const hasMoreAlerts = alerts.length > 3

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "safetravel":
        return <Shield className="h-4 w-4" />
      case "vedur":
        return <Info className="h-4 w-4" />
      case "road":
        return <AlertTriangle className="h-4 w-4" />
      case "112":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSourceName = (source: string) => {
    switch (source) {
      case "safetravel":
        return "SafeTravel.is"
      case "vedur":
        return "Veðurstofan"
      case "road":
        return "Road.is"
      case "112":
        return "112 Iceland"
      default:
        return source
    }
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Safety Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No active alerts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No safety alerts currently reported for {region}. Always check SafeTravel.is before heading out.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Safety Alerts & Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Current safety alerts and travel advisories for your trip region. Data from SafeTravel.is and other official
          sources.
        </p>

        <div className="space-y-3">
          {displayedAlerts.map((alert) => (
            <Alert key={alert.id} variant={getSeverityColor(alert.severity) as any}>
              <div className="flex items-start">
                {getSourceIcon(alert.source)}
                <div className="ml-2 flex-1">
                  <AlertTitle className="flex items-center justify-between">
                    <span>{alert.title}</span>
                    <Badge variant={getSeverityColor(alert.severity) as any} className="ml-2">
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    <p>{alert.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span>
                        {alert.region} • {new Date(alert.date).toLocaleDateString()}
                      </span>
                      <a
                        href={alert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:underline"
                      >
                        {getSourceName(alert.source)}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>

        {hasMoreAlerts && (
          <Button variant="ghost" className="w-full mt-3" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer alerts" : `Show ${alerts.length - 3} more alerts`}
          </Button>
        )}

        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://safetravel.is" target="_blank" rel="noopener noreferrer">
              SafeTravel.is
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://www.road.is" target="_blank" rel="noopener noreferrer">
              Road.is
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://en.vedur.is" target="_blank" rel="noopener noreferrer">
              Veðurstofan
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
