"use client"

import { useState } from "react"
import { Camera, Clock, Sun, Moon, CloudSun, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PhotoSpot {
  id: string
  name: string
  location: string
  description: string
  bestTime: "Sunrise" | "Morning" | "Midday" | "Afternoon" | "Sunset" | "Night"
  difficulty: "Easy" | "Moderate" | "Challenging"
  type: "Landscape" | "Waterfall" | "Wildlife" | "Northern Lights" | "Architecture" | "Cultural"
  tips: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

// Mock data for photography spots based on region
const getPhotoSpots = (region: string): PhotoSpot[] => {
  const allSpots: Record<string, PhotoSpot[]> = {
    "South Iceland": [
      {
        id: "1",
        name: "Seljalandsfoss Waterfall",
        location: "South Iceland",
        description:
          "Famous waterfall that you can walk behind for unique perspectives. The cave behind the waterfall offers dramatic framing opportunities.",
        bestTime: "Sunset",
        difficulty: "Moderate",
        type: "Waterfall",
        tips: [
          "Bring a waterproof camera cover",
          "Wide angle lens recommended (16-24mm)",
          "Use a polarizing filter to reduce glare",
          "Tripod essential for long exposures",
        ],
        coordinates: {
          lat: 63.6156,
          lng: -19.9885,
        },
      },
      {
        id: "2",
        name: "Reynisfjara Black Sand Beach",
        location: "South Iceland",
        description:
          "Dramatic black sand beach with basalt columns and sea stacks. Powerful waves create dynamic scenes.",
        bestTime: "Morning",
        difficulty: "Easy",
        type: "Landscape",
        tips: [
          "Stay far from the waves - they are dangerous",
          "Use a neutral density filter for smooth water effects",
          "Include the basalt columns for scale",
          "Low angle shots work well here",
        ],
        coordinates: {
          lat: 63.4049,
          lng: -19.0499,
        },
      },
      {
        id: "3",
        name: "Jökulsárlón Glacier Lagoon",
        location: "South Iceland",
        description:
          "Stunning glacial lagoon with floating icebergs. The nearby Diamond Beach features ice chunks on black sand.",
        bestTime: "Afternoon",
        difficulty: "Easy",
        type: "Landscape",
        tips: [
          "Telephoto lens useful for isolating icebergs",
          "Polarizing filter helps reduce reflections",
          "Visit Diamond Beach across the road",
          "Blue hour creates magical blue tones in the ice",
        ],
        coordinates: {
          lat: 64.0784,
          lng: -16.2306,
        },
      },
    ],
    "Golden Circle": [
      {
        id: "4",
        name: "Gullfoss Waterfall",
        location: "Golden Circle",
        description: "Powerful two-tiered waterfall with multiple viewing platforms. Rainbows often form in the mist.",
        bestTime: "Morning",
        difficulty: "Easy",
        type: "Waterfall",
        tips: [
          "Protect gear from spray",
          "Visit on sunny days for rainbows",
          "Lower viewing platform offers dramatic angles",
          "Use ND filters for silky water effects",
        ],
        coordinates: {
          lat: 64.3271,
          lng: -20.1199,
        },
      },
      {
        id: "5",
        name: "Strokkur Geyser",
        location: "Golden Circle",
        description:
          "Active geyser that erupts every 5-10 minutes. Challenging but rewarding to capture the perfect eruption moment.",
        bestTime: "Midday",
        difficulty: "Moderate",
        type: "Landscape",
        tips: [
          "Use burst mode to capture the eruption",
          "Fast shutter speed (at least 1/1000)",
          "Watch for 2-3 eruptions to plan your shot",
          "Position with sun behind you if possible",
        ],
        coordinates: {
          lat: 64.3104,
          lng: -20.3024,
        },
      },
    ],
    "Snæfellsnes Peninsula": [
      {
        id: "6",
        name: "Kirkjufell Mountain",
        location: "Snæfellsnes Peninsula",
        description:
          "Iceland's most photographed mountain, often captured with Kirkjufellsfoss waterfall in the foreground.",
        bestTime: "Sunset",
        difficulty: "Moderate",
        type: "Landscape",
        tips: [
          "Use the waterfall as foreground interest",
          "Wide angle lens essential (14-24mm)",
          "Visit in winter for Northern Lights",
          "Arrive early to secure a good spot",
        ],
        coordinates: {
          lat: 64.9261,
          lng: -23.3064,
        },
      },
      {
        id: "7",
        name: "Arnarstapi Sea Arch",
        location: "Snæfellsnes Peninsula",
        description: "Dramatic coastal rock formations including a natural stone arch. Beautiful coastal walking path.",
        bestTime: "Afternoon",
        difficulty: "Easy",
        type: "Landscape",
        tips: [
          "Walk the coastal path for multiple compositions",
          "Include birds for scale",
          "Use a polarizer to cut glare on water",
          "Be careful near cliff edges",
        ],
        coordinates: {
          lat: 64.7697,
          lng: -23.6217,
        },
      },
    ],
    Reykjavík: [
      {
        id: "8",
        name: "Hallgrímskirkja",
        location: "Reykjavík",
        description: "Iconic church with distinctive architecture. Offers panoramic city views from the tower.",
        bestTime: "Morning",
        difficulty: "Easy",
        type: "Architecture",
        tips: [
          "Use the statue of Leif Erikson for foreground",
          "Visit tower for city panoramas (requires ticket)",
          "Wide angle lens for interior shots",
          "Early morning for fewer tourists",
        ],
        coordinates: {
          lat: 64.1417,
          lng: -21.9266,
        },
      },
      {
        id: "9",
        name: "Harpa Concert Hall",
        location: "Reykjavík",
        description:
          "Modern glass building with geometric patterns that change with light. Beautiful interior and exterior.",
        bestTime: "Sunset",
        difficulty: "Easy",
        type: "Architecture",
        tips: [
          "Visit at blue hour for best lighting",
          "Look for reflections in the harbor",
          "Explore interior for geometric patterns",
          "Use a tripod for low light interior shots",
        ],
        coordinates: {
          lat: 64.1505,
          lng: -21.9325,
        },
      },
    ],
    "North Iceland": [
      {
        id: "10",
        name: "Goðafoss Waterfall",
        location: "North Iceland",
        description: "Horseshoe-shaped waterfall with multiple composition options from both banks.",
        bestTime: "Midday",
        difficulty: "Easy",
        type: "Waterfall",
        tips: [
          "Explore both sides of the waterfall",
          "Long exposure for smooth water effect",
          "Wide angle lens recommended",
          "Winter offers ice formations",
        ],
        coordinates: {
          lat: 65.6827,
          lng: -17.5502,
        },
      },
      {
        id: "11",
        name: "Dimmuborgir Lava Formations",
        location: "North Iceland",
        description: "Dramatic volcanic rock formations resembling a fortress. Unique shapes and textures.",
        bestTime: "Morning",
        difficulty: "Moderate",
        type: "Landscape",
        tips: [
          "Follow marked paths for best viewpoints",
          "Use people for scale",
          "Side lighting enhances textures",
          "Consider black and white processing",
        ],
        coordinates: {
          lat: 65.5902,
          lng: -16.9588,
        },
      },
    ],
  }

  // Return spots for the specific region or default to South Iceland
  return allSpots[region] || allSpots["South Iceland"]
}

interface PhotographySpotsProps {
  region: string
}

export default function PhotographySpots({ region }: PhotographySpotsProps) {
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null)
  const photoSpots = getPhotoSpots(region)

  const getBestTimeIcon = (time: string) => {
    switch (time) {
      case "Sunrise":
        return <Sun className="h-4 w-4 text-orange-500" />
      case "Morning":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "Midday":
        return <Sun className="h-4 w-4 text-yellow-400" />
      case "Afternoon":
        return <CloudSun className="h-4 w-4 text-amber-500" />
      case "Sunset":
        return <Sun className="h-4 w-4 text-orange-600" />
      case "Night":
        return <Moon className="h-4 w-4 text-blue-900" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Photography Hotspots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Discover the best photography locations in {region} with expert tips on timing and equipment.
        </p>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Spots</TabsTrigger>
            <TabsTrigger value="landscape">Landscape</TabsTrigger>
            <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {photoSpots.map((spot) => (
              <div key={spot.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{spot.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{spot.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    {getBestTimeIcon(spot.bestTime)}
                    <span className="ml-1">{spot.bestTime}</span>
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{spot.type}</Badge>
                  <Badge
                    variant={
                      spot.difficulty === "Easy"
                        ? "outline"
                        : spot.difficulty === "Moderate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {spot.difficulty}
                  </Badge>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full mt-2 text-xs h-8" onClick={() => setSelectedSpot(spot)}>
                      View Photography Tips
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {selectedSpot && (
                      <>
                        <DialogHeader>
                          <DialogTitle>{selectedSpot.name}</DialogTitle>
                          <DialogDescription>Photography Guide</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium">About this Location</h4>
                            <p className="text-sm text-muted-foreground mt-1">{selectedSpot.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Best Time to Photograph</h4>
                            <div className="flex items-center mt-1">
                              {getBestTimeIcon(selectedSpot.bestTime)}
                              <span className="ml-2">{selectedSpot.bestTime}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Photography Tips</h4>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {selectedSpot.tips.map((tip, index) => (
                                <li key={index} className="text-sm">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Location</h4>
                            <p className="text-sm mt-1">
                              {selectedSpot.coordinates.lat.toFixed(4)}, {selectedSpot.coordinates.lng.toFixed(4)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add these coordinates to your GPS or mapping app
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="landscape" className="space-y-4">
            {photoSpots
              .filter((spot) => spot.type === "Landscape")
              .map((spot) => (
                <div key={spot.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{spot.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{spot.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      {getBestTimeIcon(spot.bestTime)}
                      <span className="ml-1">{spot.bestTime}</span>
                    </Badge>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full mt-2 text-xs h-8" onClick={() => setSelectedSpot(spot)}>
                        View Photography Tips
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="waterfall" className="space-y-4">
            {photoSpots
              .filter((spot) => spot.type === "Waterfall")
              .map((spot) => (
                <div key={spot.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{spot.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{spot.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      {getBestTimeIcon(spot.bestTime)}
                      <span className="ml-1">{spot.bestTime}</span>
                    </Badge>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full mt-2 text-xs h-8" onClick={() => setSelectedSpot(spot)}>
                        View Photography Tips
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
