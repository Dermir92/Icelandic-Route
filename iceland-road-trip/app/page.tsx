"use client"

import { useState } from "react"
import Link from "next/link"
import { MountainSnow, Calendar, MapPin, Compass, ArrowRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TripGenerator from "@/components/trip-generator"
import IcelandicBackground from "@/components/icelandic-background"
import IcelandicHeroBackground from "@/components/icelandic-hero-background"

export default function Home() {
  // Add state to toggle between background themes
  const [backgroundTheme, setBackgroundTheme] = useState<"icelandic" | "whale" | "puffin">("icelandic")

  return (
    <div className="flex min-h-screen flex-col">
      <IcelandicBackground theme={backgroundTheme} />
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
              <Link
                href="/enhanced-results"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Enhanced Trip
              </Link>
              {/* Add background theme toggle buttons */}
              <div className="flex space-x-1 mr-2">
                <Button
                  variant={backgroundTheme === "icelandic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBackgroundTheme("icelandic")}
                >
                  Flag
                </Button>
                <Button
                  variant={backgroundTheme === "whale" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBackgroundTheme("whale")}
                >
                  Whale
                </Button>
                <Button
                  variant={backgroundTheme === "puffin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBackgroundTheme("puffin")}
                >
                  Puffin
                </Button>
              </div>
              <Button variant="outline" size="sm">
                English / Íslenska
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <IcelandicHeroBackground variant="icelandic" />
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Discover Iceland's Hidden Gems
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Generate spontaneous 1-7 day road trips based on real-time weather, road conditions, your interests,
                    and preferred region.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Generate Trip
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">1-7 Day Trips</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">All Regions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Compass className="h-4 w-4" />
                    <span className="text-xs">Live Conditions</span>
                  </div>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center">
                <Card className="w-full">
                  <CardContent className="p-6">
                    <TripGenerator />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Our intelligent system combines real data from authentic Icelandic sources with your preferences to
                create the perfect adventure.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 xl:gap-10 mt-10">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Popular Destinations</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Explore some of Iceland's most breathtaking locations that might be part of your adventure.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 mt-10">
              {destinations.map((destination) => (
                <Card key={destination.name} className="overflow-hidden">
                  <div className="aspect-video w-full relative bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{destination.name}</h3>
                    <p className="text-sm text-muted-foreground">{destination.region}</p>
                    <a
                      href={destination.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Authentic Data</div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Powered by Iceland's Official Tourism Resources
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Our trip suggestions are created using data from trusted Icelandic sources like inspiredbyiceland.com
                  and guidetoiceland.is.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.inspiredbyiceland.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Inspired by Iceland
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://guidetoiceland.is"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Guide to Iceland
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Real-time Data</div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Get up-to-date information on weather conditions from Veðurstofan (Icelandic Met Office) and road
                  status from Vegagerðin (Icelandic Road Administration).
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.vedur.is/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Veðurstofan
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.vegagerdin.is/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Vegagerðin
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Authentic Data",
    description: "Trip suggestions based on real information from inspiredbyiceland.com and guidetoiceland.is.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path>
        <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"></path>
        <path d="M4 12H2"></path>
        <path d="M10 12H8"></path>
        <path d="M16 12h-2"></path>
        <path d="M22 12h-2"></path>
      </svg>
    ),
  },
  {
    title: "Weather Data",
    description: "Real-time weather forecasts from Veðurstofan to ensure optimal travel conditions.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      </svg>
    ),
  },
  {
    title: "Road Conditions",
    description: "Up-to-date road status from Vegagerðin to ensure safe and accessible routes.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
        <path d="M12 13v8"></path>
        <path d="M12 3v3"></path>
      </svg>
    ),
  },
  {
    title: "Personalized Interests",
    description: "Tailor your trip based on your preferences: nature, culture, food, or adventure.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m4.93 4.93 4.24 4.24"></path>
        <path d="m14.83 9.17 4.24-4.24"></path>
        <path d="m14.83 14.83 4.24 4.24"></path>
        <path d="m9.17 14.83-4.24 4.24"></path>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    ),
  },
]

const destinations = [
  {
    name: "Blue Lagoon",
    region: "Reykjanes Peninsula",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/geothermal/the-blue-lagoon",
  },
  {
    name: "Gullfoss Waterfall",
    region: "Golden Circle",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/gullfoss",
  },
  {
    name: "Jökulsárlón Glacier Lagoon",
    region: "South Iceland",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/glaciers/jokulsarlon-glacier-lagoon",
  },
  {
    name: "Reynisfjara Black Sand Beach",
    region: "South Iceland",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/reynisfjara",
  },
  {
    name: "Kirkjufell Mountain",
    region: "Snæfellsnes Peninsula",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/mountains/kirkjufell",
  },
  {
    name: "Þingvellir National Park",
    region: "Golden Circle",
    image: "/placeholder.svg?height=400&width=600",
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/national-parks/thingvellir-national-park",
  },
]
