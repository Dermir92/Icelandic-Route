"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MountainSnow, Calendar, MapPin, ArrowLeft, Clock, Cloud, Thermometer, Car, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TripMap from "@/components/trip-map"
import type { TripData } from "@/lib/trip-data"
import { Skeleton } from "@/components/ui/skeleton"
import IcelandicBackground from "@/components/icelandic-background"
import SafetyAlerts from "@/components/safety-alerts"
import AuroraForecast from "@/components/aurora-forecast"
import LocalInsights from "@/components/local-insights"
import WildlifeTracker from "@/components/wildlife-tracker"

export default function EnhancedResultsPage() {
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("itinerary")

  useEffect(() => {
    // Get trip data from localStorage
    const storedTripData = localStorage.getItem("tripData")
    if (storedTripData) {
      setTripData(JSON.parse(storedTripData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!tripData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <IcelandicBackground theme="icelandic" />
        <h1 className="text-2xl font-bold mb-4">No trip data found</h1>
        <p className="text-muted-foreground mb-6">Please generate a trip from the home page.</p>
        <Button asChild>
          <Link href="/">Go to Home Page</Link>
        </Button>
      </div>
    )
  }

  // Parse the start date string to a Date object
  const startDate = new Date(tripData.startDate)

  return (
    <div className="flex min-h-screen flex-col">
      <IcelandicBackground theme="icelandic" animated={false} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <MountainSnow className="h-6 w-6 text-blue-600" />
            <span>Ferðalög</span>
            <span className="text-sm font-normal text-muted-foreground hidden sm:inline-block">
              | Iceland Road Trip Generator
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                About
              </Link>
              <Button variant="outline" size="sm">
                English / Íslenska
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">{tripData.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {tripData.startDate} - {tripData.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{tripData.region}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="itinerary" className="mt-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="aurora">Aurora</TabsTrigger>
              <TabsTrigger value="local">Local Tips</TabsTrigger>
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Trip Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This {tripData.duration}-day adventure takes you through the stunning landscapes of{" "}
                        {tripData.region}. Based on your interests, we've created a route that includes the best
                        attractions in the area. The weather forecast looks favorable, and all accessible roads on your
                        route are currently monitored for conditions.
                      </p>

                      <div className="mt-6">
                        <TripMap
                          region={tripData.region}
                          attractions={tripData.days.flatMap((day) => day.attractions)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="day1">
                    <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
                      {tripData.days.map((_, index) => (
                        <TabsTrigger key={index} value={`day${index + 1}`}>
                          Day {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {tripData.days.map((day, dayIndex) => (
                      <TabsContent key={dayIndex} value={`day${dayIndex + 1}`} className="space-y-4 mt-4">
                        {day.attractions.map((attraction, attrIndex) => (
                          <Card key={attrIndex}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle>{attraction.name}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{attraction.timeOfDay}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="aspect-video w-full relative bg-muted rounded-md mb-4">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img
                                    src={attraction.image || "/placeholder.svg"}
                                    alt={attraction.name}
                                    className="object-cover w-full h-full rounded-md"
                                  />
                                </div>
                              </div>
                              <p className="text-muted-foreground">{attraction.description}</p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
                                  <Cloud className="mr-1 h-3 w-3" />
                                  {day.weatherSummary.condition}
                                </div>
                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
                                  <Thermometer className="mr-1 h-3 w-3" />
                                  {day.weatherSummary.temperature}
                                </div>
                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-green-600">
                                  <Car className="mr-1 h-3 w-3" />
                                  Road conditions monitored
                                </div>
                              </div>
                              <div className="mt-4">
                                <a
                                  href={attraction.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  Source:{" "}
                                  {attraction.sourceUrl.includes("inspiredbyiceland")
                                    ? "Inspired by Iceland"
                                    : "Guide to Iceland"}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {day.accommodation && (
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle>Overnight at {day.accommodation.name}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>Evening</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground">{day.accommodation.description}</p>
                              <div className="mt-4">
                                <a
                                  href={day.accommodation.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  Source:{" "}
                                  {day.accommodation.sourceUrl.includes("inspiredbyiceland")
                                    ? "Inspired by Iceland"
                                    : "Guide to Iceland"}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Weather Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tripData.weatherForecast.map((forecast, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">{forecast.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cloud className="h-5 w-5" />
                              <span>{forecast.temperature}</span>
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground mt-2">
                          Data from Veðurstofan (Icelandic Met Office). Weather conditions can change rapidly in
                          Iceland.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Road Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tripData.roadConditions.map((condition, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>{condition.road}</span>
                            <span
                              className={`font-medium ${
                                condition.status === "Open"
                                  ? "text-green-600"
                                  : condition.status === "Caution"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {condition.status}
                            </span>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground mt-2">
                          Data from Vegagerðin (Icelandic Road Administration). Always check road.is before traveling.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Recommended Gear</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {tripData.recommendedGear.map((gear, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-600"
                            >
                              <polyline points="9 11 12 14 22 4"></polyline>
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            {gear}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Data Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        This trip was generated using data from authentic Icelandic tourism sources:
                      </p>
                      <ul className="space-y-2">
                        {tripData.sourceWebsites.map((source, index) => (
                          <li key={index}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {source.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                        <li>
                          <a
                            href="https://safetravel.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            SafeTravel.is
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://en.vedur.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Icelandic Met Office
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Download Trip PDF</Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Modify Trip</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="space-y-6">
                  <SafetyAlerts region={tripData.region} />
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Emergency Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Emergency Number</h3>
                          <p className="text-2xl font-bold text-red-600">112</p>
                          <p className="text-xs text-muted-foreground">Works throughout Iceland</p>
                        </div>

                        <div>
                          <h3 className="font-medium">ICE-SAR (Search and Rescue)</h3>
                          <p className="text-sm">Download the 112 Iceland app to send your location in emergencies</p>
                          <Button variant="outline" size="sm" className="mt-2 text-xs" asChild>
                            <a href="https://safetravel.is/112-iceland-app" target="_blank" rel="noopener noreferrer">
                              Learn More
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-medium">Travel Registration</h3>
                          <p className="text-sm">
                            Register your travel plan with SafeTravel.is before venturing into remote areas
                          </p>
                          <Button variant="outline" size="sm" className="mt-2 text-xs" asChild>
                            <a href="https://safetravel.is/travel-plan" target="_blank" rel="noopener noreferrer">
                              Register Travel Plan
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Safety Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li>
                          <a
                            href="https://safetravel.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            SafeTravel.is - Official Safety Information
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.road.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Road.is - Road Conditions
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://en.vedur.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Veðurstofan - Weather Forecasts
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.almannavarnir.is/english/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Department of Civil Protection
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="aurora" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="space-y-6">
                  <AuroraForecast startDate={startDate} duration={tripData.duration} region={tripData.region} />
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Aurora Photography Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <span className="font-medium">Camera:</span>
                          <span className="text-sm">DSLR or mirrorless with manual mode</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">Lens:</span>
                          <span className="text-sm">Wide angle with fast aperture (f/2.8 or wider)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">Settings:</span>
                          <span className="text-sm">ISO 1600-3200, f/2.8, 15-30 sec exposure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">Gear:</span>
                          <span className="text-sm">
                            Tripod, remote shutter, extra batteries (cold drains them quickly)
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Best Aurora Viewing Spots in {tripData.region}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tripData.region === "Reykjavík" && (
                          <>
                            <li className="text-sm">
                              <span className="font-medium">Grótta Lighthouse</span> - Located at the tip of
                              Seltjarnarnes peninsula
                            </li>
                            <li className="text-sm">
                              <span className="font-medium">Öskjuhlíð</span> - Forested area near Perlan
                            </li>
                          </>
                        )}
                        {tripData.region === "South Iceland" && (
                          <>
                            <li className="text-sm">
                              <span className="font-medium">Þingvellir National Park</span> - Dark skies and beautiful
                              reflections on the lake
                            </li>
                            <li className="text-sm">
                              <span className="font-medium">Jökulsárlón Glacier Lagoon</span> - Aurora reflections on
                              the icebergs
                            </li>
                          </>
                        )}
                        {tripData.region === "North Iceland" && (
                          <>
                            <li className="text-sm">
                              <span className="font-medium">Lake Mývatn</span> - Dark skies with reflections on the
                              water
                            </li>
                            <li className="text-sm">
                              <span className="font-medium">Goðafoss Waterfall</span> - Dramatic foreground for aurora
                              photos
                            </li>
                          </>
                        )}
                        {tripData.region === "Snæfellsnes Peninsula" && (
                          <>
                            <li className="text-sm">
                              <span className="font-medium">Kirkjufell Mountain</span> - Iceland's most photographed
                              aurora location
                            </li>
                            <li className="text-sm">
                              <span className="font-medium">Búðir Black Church</span> - Iconic foreground for aurora
                              photography
                            </li>
                          </>
                        )}
                        <li className="text-sm">
                          <span className="font-medium">Any area away from city lights</span> - The darker the location,
                          the better
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://en.vedur.is/weather/forecasts/aurora" target="_blank" rel="noopener noreferrer">
                      Official Aurora Forecast
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="local" className="mt-6">
              <LocalInsights region={tripData.region} />
            </TabsContent>

            <TabsContent value="wildlife" className="mt-6">
              <WildlifeTracker region={tripData.region} startDate={startDate} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Ferðalög. All rights reserved. Data from{" "}
            <a
              href="https://www.inspiredbyiceland.com/"
              className="font-medium underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Iceland
            </a>{" "}
            and{" "}
            <a
              href="https://guidetoiceland.is/"
              className="font-medium underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Guide to Iceland
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <IcelandicBackground theme="icelandic" />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex-1 flex justify-end">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-6" />
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container">
          <Skeleton className="h-6 w-full max-w-md mx-auto" />
        </div>
      </footer>
    </div>
  )
}
