"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MountainSnow, Calendar, MapPin, ArrowLeft, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TripMap from "@/components/trip-map"
import type { TripData } from "@/lib/trip-data"
import { Skeleton } from "@/components/ui/skeleton"
import IcelandicBackground from "@/components/icelandic-background"

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <IcelandicBackground theme="icelandic" />
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <Skeleton className="w-[200px] h-[30px] mb-4" />
      <Skeleton className="w-[300px] h-[20px]" />
    </div>
  )
}

export default function ResultsPage() {
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("trip")

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

          <Tabs defaultValue="trip" className="mt-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="trip">Trip Itinerary</TabsTrigger>
              <TabsTrigger value="safety">Safety & Weather</TabsTrigger>
              <TabsTrigger value="local">Local Insights</TabsTrigger>
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="aurora">Aurora</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trip" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Trip Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This {tripData.duration}-day adventure takes you through the stunning landscapes of{" "}
                        {tripData.region}. Based on your interests, we've created a route that includes the best attractions
                        in the area. The weather forecast looks favorable, and all accessible roads on your route are
                        currently monitored for conditions.
                      </p>

                      <div className="mt-6">
                        <TripMap region={tripData.region} attractions={tripData.days.flatMap((day) => day.attractions)} />
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
                            
                          \
