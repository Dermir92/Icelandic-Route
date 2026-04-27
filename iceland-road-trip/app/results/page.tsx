"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  MountainSnow,
  Calendar,
  MapPin,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Package,
  ExternalLink,
  Bed,
  CloudSun,
  Shield,
  Map,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import TripMap from "@/components/trip-map"
import SafetyAlerts from "@/components/safety-alerts"
import AuroraForecast from "@/components/aurora-forecast"
import type { TripData } from "@/lib/trip-data"

// ── Helpers ──────────────────────────────────────────────────

function roadStatusBadge(status: string): { className: string; label: string } {
  if (status === "Closed")
    return { className: "bg-red-50 text-red-700 border border-red-200", label: "Closed — check road.is" }
  if (status === "Caution")
    return { className: "bg-amber-50 text-amber-700 border border-amber-200", label: "Caution — verify live" }
  // "Open" — never show confirmed green since data is illustrative
  return { className: "bg-slate-50 text-slate-600 border border-slate-200", label: "Verify at road.is" }
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="container px-4 md:px-6 py-10 space-y-4 max-w-4xl mx-auto">
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-64 rounded-xl" />
        <Skeleton className="w-2/3 h-48 rounded-xl" />
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default function ResultsPage() {
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTripData = localStorage.getItem("tripData")
    if (storedTripData) {
      try {
        setTripData(JSON.parse(storedTripData))
      } catch {
        // malformed — fall through to null state
      }
    }
    setLoading(false)
  }, [])

  if (loading) return <LoadingSkeleton />

  if (!tripData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 bg-slate-50">
        <MountainSnow className="h-10 w-10 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">No trip data found</h1>
        <p className="text-muted-foreground text-center max-w-sm text-sm">
          Please generate a trip from the home page first.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md"
        style={{ backgroundColor: "rgba(8, 15, 29, 0.96)" }}
      >
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <MountainSnow className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold text-sm">Ferðalög</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 text-sm"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              New trip
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto">

          {/* ── Trip summary banner ── */}
          <div
            className="rounded-2xl overflow-hidden mb-7 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #080f1d 0%, #0b1d36 50%, #0d2e52 100%)",
            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold text-white leading-tight">
                    {tripData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="flex items-center gap-1.5 text-sm text-blue-200/90">
                      <Calendar className="h-3.5 w-3.5" />
                      {tripData.startDate} – {tripData.endDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-blue-200/90">
                      <MapPin className="h-3.5 w-3.5" />
                      {tripData.region}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-600/25 px-2.5 py-0.5 text-xs text-blue-200">
                      {tripData.duration} {tripData.duration === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conditions disclaimer */}
              <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 p-3.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-100/75 leading-relaxed">
                  Road conditions, weather, and safety information shown are{" "}
                  <strong className="text-amber-200/90 font-medium">illustrative only</strong>.
                  Always verify live conditions at{" "}
                  <a href="https://road.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">
                    road.is
                  </a>
                  ,{" "}
                  <a href="https://en.vedur.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">
                    vedur.is
                  </a>
                  , and{" "}
                  <a href="https://safetravel.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">
                    safetravel.is
                  </a>{" "}
                  before departure. Register your trip with SafeTravel.is. Call 112 in emergencies.
                </p>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultValue="itinerary">
            <TabsList className="w-full grid grid-cols-3 mb-6 h-10">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="safety">Safety &amp; Weather</TabsTrigger>
              <TabsTrigger value="aurora">Aurora</TabsTrigger>
            </TabsList>

            {/* ────── Itinerary tab ────── */}
            <TabsContent value="itinerary" className="space-y-0">
              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

                {/* Main column */}
                <div className="space-y-6">

                  {/* Route map */}
                  <TripMap
                    region={tripData.region}
                    attractions={tripData.days.flatMap((d) => d.attractions)}
                  />

                  {/* Timeline itinerary */}
                  <div className="space-y-8">
                    {tripData.days.map((day, dayIndex) => (
                      <div key={dayIndex}>
                        {/* Day header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow shadow-blue-600/30 flex-shrink-0">
                            {dayIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              Day {dayIndex + 1}
                            </h3>
                            <p className="text-xs text-muted-foreground">{day.date}</p>
                          </div>
                          <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-white rounded-full border px-2.5 py-1">
                            <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                            {day.weatherSummary.condition}, {day.weatherSummary.temperature}
                          </span>
                        </div>

                        {/* Timeline line + stops */}
                        <div className="ml-[1.125rem] border-l-2 border-blue-100 pl-6 space-y-3">
                          {day.attractions.map((attraction, attrIndex) => (
                            <div key={attrIndex} className="relative">
                              {/* Timeline dot */}
                              <div className="absolute -left-[1.625rem] top-3.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-400" />

                              <div className="bg-white rounded-xl border border-slate-200/80 p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <h4 className="font-semibold text-gray-900 leading-snug text-[15px]">
                                    {attraction.name}
                                  </h4>
                                  {attraction.timeOfDay && (
                                    <span className="flex-shrink-0 flex items-center gap-1 text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                                      <Clock className="h-3 w-3" />
                                      {attraction.timeOfDay}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                                  {attraction.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-50">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {attraction.location}
                                  </span>

                                  {attraction.roadInfo && (() => {
                                    const badge = roadStatusBadge(attraction.roadInfo.status)
                                    return (
                                      <a
                                        href="https://road.is"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-xs rounded-full px-2 py-0.5 font-medium hover:opacity-80 transition-opacity ${badge.className}`}
                                      >
                                        {attraction.roadInfo.roadNumber} · {badge.label}
                                      </a>
                                    )
                                  })()}

                                  <a
                                    href={attraction.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 ml-auto"
                                  >
                                    Learn more
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Accommodation */}
                          {day.accommodation && (
                            <div className="relative">
                              <div className="absolute -left-[1.625rem] top-3 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-slate-400" />
                              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                <Bed className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-700">
                                    {day.accommodation.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {day.accommodation.location}
                                  </span>
                                </div>
                                <a
                                  href={day.accommodation.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                                >
                                  View
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-4">

                  {/* Road conditions */}
                  <Card className="border-slate-200/80 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                        <Map className="h-4 w-4 text-slate-400" />
                        Road Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                        Illustrative only — verify live at{" "}
                        <a href="https://road.is" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                          road.is
                        </a>
                        .
                      </p>
                      <div className="space-y-2">
                        {tripData.roadConditions.map((rc, i) => {
                          const badge = roadStatusBadge(rc.status)
                          return (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <span className="text-sm text-gray-700 truncate">{rc.road}</span>
                              <span className={`text-xs rounded-full px-2 py-0.5 font-medium whitespace-nowrap flex-shrink-0 ${badge.className}`}>
                                {badge.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gear */}
                  <Card className="border-slate-200/80 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                        <Package className="h-4 w-4 text-slate-400" />
                        Recommended Gear
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <ul className="space-y-2">
                        {tripData.recommendedGear.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5 font-bold select-none">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Weather forecast */}
                  <Card className="border-slate-200/80 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                        <CloudSun className="h-4 w-4 text-slate-400" />
                        Weather Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {tripData.weatherForecast.slice(0, 5).map((day, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 text-xs">{day.date}</span>
                            <span className="text-base">{day.icon}</span>
                            <span className="text-gray-600 text-xs">{day.condition}</span>
                            <span className="font-medium text-gray-800 text-xs">{day.temperature}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                        Illustrative —{" "}
                        <a href="https://en.vedur.is" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          vedur.is
                        </a>{" "}
                        for live data.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Data sources */}
                  <Card className="border-slate-200/80 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold text-gray-800">Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <ul className="space-y-2">
                        {tripData.sourceWebsites.map((src, i) => (
                          <li key={i}>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {src.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ────── Safety & Weather tab ────── */}
            <TabsContent value="safety" className="space-y-6">
              <SafetyAlerts region={tripData.region} />

              {/* Weather cards */}
              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="px-5 pt-5 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CloudSun className="h-4 w-4 text-amber-500" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tripData.weatherForecast.map((day, i) => (
                      <div
                        key={i}
                        className="text-center rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                      >
                        <p className="text-xs font-medium text-gray-700">{day.date}</p>
                        <p className="text-2xl mt-1.5">{day.icon}</p>
                        <p className="text-xs text-muted-foreground mt-1">{day.condition}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{day.temperature}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Illustrative forecast — check{" "}
                    <a href="https://en.vedur.is" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      en.vedur.is
                    </a>{" "}
                    for live weather data.
                  </p>
                </CardContent>
              </Card>

              {/* Safety reminder */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 leading-relaxed">
                  <strong className="font-semibold">Before your trip:</strong> Register your itinerary at{" "}
                  <a href="https://safetravel.is" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                    safetravel.is
                  </a>
                  . If you encounter an emergency, call{" "}
                  <strong className="font-semibold">112</strong>. Iceland&apos;s mountain rescue teams (ICE-SAR) are volunteer-run — please travel responsibly.
                </div>
              </div>
            </TabsContent>

            {/* ────── Aurora tab ────── */}
            <TabsContent value="aurora">
              <AuroraForecast
                startDate={new Date(tripData.startDate)}
                duration={tripData.duration}
                region={tripData.region}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t border-white/10 mt-8"
        style={{ backgroundColor: "#080f1d" }}
      >
        <div className="container px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <MountainSnow className="h-4 w-4 text-blue-400" />
            Plan a new trip
          </Link>
          <p className="text-xs text-white/30 text-center leading-relaxed">
            Always verify at{" "}
            <a href="https://safetravel.is" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-300 underline">safetravel.is</a>
            {" "}·{" "}
            <a href="https://road.is" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-300 underline">road.is</a>
            {" "}·{" "}
            <a href="https://en.vedur.is" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-300 underline">vedur.is</a>
            {" "}· All conditions data is illustrative.
          </p>
        </div>
      </footer>
    </div>
  )
}
