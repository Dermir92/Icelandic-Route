"use client"

import { useState, useEffect } from "react"
import { Bird, Fish, Calendar, MapPin, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

interface WildlifeSpotting {
  id: string
  species: string
  type: "bird" | "marine" | "land"
  locations: {
    name: string
    region: string
    coordinates: {
      lat: number
      lng: number
    }
    bestTime: string
    probability: "Low" | "Medium" | "High" | "Very High"
  }[]
  seasonStart: number // 0-11 (Jan-Dec)
  seasonEnd: number // 0-11 (Jan-Dec)
  description: string
  tips: string[]
  imageUrl: string
  sourceUrl: string
}

// Mock data - in a real app, this would come from Icelandic Institute of Natural History or Whales of Iceland
const getMockWildlifeData = (): WildlifeSpotting[] => {
  return [
    {
      id: "1",
      species: "Atlantic Puffin",
      type: "bird",
      locations: [
        {
          name: "Látrabjarg",
          region: "Westfjords",
          coordinates: { lat: 65.5022, lng: -24.5309 },
          bestTime: "Morning or evening",
          probability: "Very High",
        },
        {
          name: "Vestmannaeyjar (Westman Islands)",
          region: "South Iceland",
          coordinates: { lat: 63.4427, lng: -20.2699 },
          bestTime: "Daytime",
          probability: "Very High",
        },
        {
          name: "Borgarfjörður Eystri",
          region: "East Iceland",
          coordinates: { lat: 65.5259, lng: -13.8172 },
          bestTime: "Evening",
          probability: "High",
        },
      ],
      seasonStart: 4, // May
      seasonEnd: 7, // August
      description:
        "The Atlantic Puffin, known as 'lundi' in Icelandic, is often called the 'clown of the sea' due to its colorful beak. Iceland hosts over 60% of the world's Atlantic Puffin breeding population.",
      tips: [
        "Bring binoculars for better viewing",
        "Keep a respectful distance from nesting sites",
        "Visit during breeding season (May-August)",
        "Early morning or evening offers the best light for photography",
      ],
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.ni.is/biota/animalia/chordata/aves/charadriiformes/lundi-fratercula-arctica",
    },
    {
      id: "2",
      species: "Humpback Whale",
      type: "marine",
      locations: [
        {
          name: "Húsavík",
          region: "North Iceland",
          coordinates: { lat: 66.0449, lng: -17.3389 },
          bestTime: "Morning tours",
          probability: "High",
        },
        {
          name: "Eyjafjörður",
          region: "North Iceland",
          coordinates: { lat: 65.8361, lng: -18.2143 },
          bestTime: "Afternoon",
          probability: "Medium",
        },
        {
          name: "Reykjavík",
          region: "Reykjavík",
          coordinates: { lat: 64.1466, lng: -21.9426 },
          bestTime: "Morning",
          probability: "Medium",
        },
      ],
      seasonStart: 3, // April
      seasonEnd: 9, // October
      description:
        "Humpback whales are known for their acrobatic displays, including breaching and tail-slapping. They migrate to Icelandic waters during summer months to feed in the nutrient-rich waters.",
      tips: [
        "Book tours with responsible whale watching companies",
        "Bring seasickness medication if prone to motion sickness",
        "Dress warmly even in summer - it's colder on the water",
        "Be patient - wildlife viewing requires time",
      ],
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://whalesoficeland.is/whales/humpback-whale/",
    },
    {
      id: "3",
      species: "Arctic Fox",
      type: "land",
      locations: [
        {
          name: "Hornstrandir Nature Reserve",
          region: "Westfjords",
          coordinates: { lat: 66.45, lng: -22.45 },
          bestTime: "Early morning or late evening",
          probability: "High",
        },
        {
          name: "Þórsmörk",
          region: "South Iceland",
          coordinates: { lat: 63.681, lng: -19.5085 },
          bestTime: "Dawn or dusk",
          probability: "Low",
        },
      ],
      seasonStart: 0, // January
      seasonEnd: 11, // December (year-round)
      description:
        "The Arctic Fox is Iceland's only native land mammal. It changes color seasonally - white in winter and brown/gray in summer. The Hornstrandir Nature Reserve offers the best chance to see these elusive animals.",
      tips: [
        "Move slowly and quietly to avoid startling them",
        "Use a telephoto lens for photography",
        "Never feed wild foxes",
        "Join a guided tour for better chances of spotting them",
      ],
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.ni.is/biota/animalia/chordata/mammalia/carnivora/tofur-vulpes-lagopus",
    },
    {
      id: "4",
      species: "Reindeer",
      type: "land",
      locations: [
        {
          name: "East Iceland",
          region: "East Iceland",
          coordinates: { lat: 65.0, lng: -15.0 },
          bestTime: "Winter months",
          probability: "Medium",
        },
      ],
      seasonStart: 0, // January
      seasonEnd: 11, // December (year-round, but easier to spot in winter)
      description:
        "Reindeer were introduced to Iceland in the 18th century and now roam wild in East Iceland. They tend to stay in the highlands during summer and move to lower elevations in winter.",
      tips: [
        "Drive slowly on roads in East Iceland, especially in winter",
        "Look for herds in fields near the Ring Road",
        "Join a specialized reindeer safari for guaranteed sightings",
        "Respect their space and observe from a distance",
      ],
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.ni.is/biota/animalia/chordata/mammalia/artiodactyla/hreindyr-rangifer-tarandus",
    },
    {
      id: "5",
      species: "Orca (Killer Whale)",
      type: "marine",
      locations: [
        {
          name: "Snæfellsnes Peninsula",
          region: "Snæfellsnes Peninsula",
          coordinates: { lat: 64.8, lng: -23.0 },
          bestTime: "Winter months",
          probability: "Medium",
        },
        {
          name: "Vestmannaeyjar",
          region: "South Iceland",
          coordinates: { lat: 63.4427, lng: -20.2699 },
          bestTime: "February-March",
          probability: "Medium",
        },
      ],
      seasonStart: 0, // January
      seasonEnd: 3, // April
      description:
        "Orcas, or killer whales, visit Icelandic waters primarily in winter months when they follow herring schools. The west coast, particularly around the Snæfellsnes Peninsula, offers good viewing opportunities.",
      tips: [
        "Winter months offer the best chance for sightings",
        "Look for birds circling above the water - they often indicate feeding activity below",
        "Specialized orca watching tours operate in winter",
        "Bring good camera equipment with fast shutter speeds",
      ],
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://whalesoficeland.is/whales/killer-whale/",
    },
  ]
}

interface WildlifeTrackerProps {
  region: string
  startDate: Date
}

export default function WildlifeTracker({ region, startDate }: WildlifeTrackerProps) {
  const [wildlifeData, setWildlifeData] = useState<WildlifeSpotting[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    // In a real app, this would be an API call to wildlife data sources
    const allWildlife = getMockWildlifeData()
    setWildlifeData(allWildlife)
  }, [])

  // Filter wildlife by region if specified
  const filteredByRegion =
    region && region !== "all" && region !== "Iceland"
      ? wildlifeData.filter((animal) =>
          animal.locations.some((location) => location.region.toLowerCase().includes(region.toLowerCase())),
        )
      : wildlifeData

  // Further filter by selected type
  const filteredWildlife =
    selectedType === "all" ? filteredByRegion : filteredByRegion.filter((animal) => animal.type === selectedType)

  // Check if wildlife is in season during the trip
  const tripMonth = startDate.getMonth()
  const inSeasonWildlife = filteredWildlife.filter((animal) => {
    if (animal.seasonStart <= animal.seasonEnd) {
      // Normal season (e.g., May to August)
      return tripMonth >= animal.seasonStart && tripMonth <= animal.seasonEnd
    } else {
      // Season spans year boundary (e.g., November to March)
      return tripMonth >= animal.seasonStart || tripMonth <= animal.seasonEnd
    }
  })

  // Get relevant locations for the selected region
  const getRelevantLocations = (animal: WildlifeSpotting) => {
    if (region && region !== "all" && region !== "Iceland") {
      return animal.locations.filter((location) => location.region.toLowerCase().includes(region.toLowerCase()))
    }
    return animal.locations
  }

  const getMonthName = (monthIndex: number) => {
    return new Date(0, monthIndex).toLocaleString("default", { month: "long" })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bird":
        return <Bird className="h-4 w-4" />
      case "marine":
        return <Fish className="h-4 w-4" />
      case "land":
        return <MapPin className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Bird className="mr-2 h-5 w-5" />
          Wildlife Viewing Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Discover Iceland's incredible wildlife and the best places to see them during your trip. Data from the
          Icelandic Institute of Natural History and Whales of Iceland.
        </p>

        <Tabs defaultValue="all" onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Wildlife</TabsTrigger>
            <TabsTrigger value="bird">Birds</TabsTrigger>
            <TabsTrigger value="marine">Marine</TabsTrigger>
            <TabsTrigger value="land">Land</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {inSeasonWildlife.length > 0 ? (
              <div className="space-y-4">
                {inSeasonWildlife.map((animal) => {
                  const relevantLocations = getRelevantLocations(animal)

                  if (relevantLocations.length === 0) return null

                  return (
                    <div key={animal.id} className="border rounded-md overflow-hidden">
                      <div className="aspect-video w-full relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={animal.imageUrl || "/placeholder.svg"}
                            alt={animal.species}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{animal.species}</h3>
                          <Badge className="flex items-center">
                            {getTypeIcon(animal.type)}
                            <span className="ml-1 capitalize">{animal.type}</span>
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">{animal.description}</p>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Best viewing season</h4>
                          <p className="text-xs text-muted-foreground">
                            {getMonthName(animal.seasonStart)} - {getMonthName(animal.seasonEnd)}
                            {tripMonth >= animal.seasonStart && tripMonth <= animal.seasonEnd && (
                              <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                                In Season
                              </Badge>
                            )}
                          </p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Where to see in {region}</h4>
                          <ul className="mt-1 space-y-2">
                            {relevantLocations.map((location, index) => (
                              <li key={index} className="text-xs flex justify-between items-center">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {location.name}
                                </span>
                                <Badge
                                  variant={
                                    location.probability === "Very High"
                                      ? "default"
                                      : location.probability === "High"
                                        ? "secondary"
                                        : location.probability === "Medium"
                                          ? "outline"
                                          : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {location.probability}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Viewing tips</h4>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {animal.tips.slice(0, 2).map((tip, index) => (
                              <li key={index} className="text-xs text-muted-foreground">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button variant="outline" size="sm" className="w-full mt-3 text-xs" asChild>
                          <a href={animal.sourceUrl} target="_blank" rel="noopener noreferrer">
                            Learn More
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No wildlife in season</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The wildlife you're looking for isn't typically active during {format(startDate, "MMMM")} in {region}.
                  Try a different season or region for better wildlife viewing opportunities.
                </p>
              </div>
            )}
          </div>
        </Tabs>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://www.ni.is" target="_blank" rel="noopener noreferrer">
              Icelandic Institute of Natural History
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://whalesoficeland.is" target="_blank" rel="noopener noreferrer">
              Whales of Iceland
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
