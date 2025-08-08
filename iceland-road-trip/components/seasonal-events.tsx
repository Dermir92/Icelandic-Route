"use client"

import { useState } from "react"
import { CalendarIcon, Music, Utensils, Landmark, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format, isSameMonth, isWithinInterval, addDays } from "date-fns"

interface Event {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  description: string
  type: "cultural" | "food" | "music" | "nature" | "holiday"
  website?: string
}

// Mock data for Icelandic events throughout the year
const icelandicEvents: Event[] = [
  {
    id: "1",
    name: "Þorrablót",
    startDate: new Date(2025, 0, 20), // January 20
    endDate: new Date(2025, 1, 20), // February 20
    location: "Nationwide",
    description:
      "Traditional midwinter festival where Icelanders gather to eat traditional food (þorramatur), drink brennivín, and celebrate Icelandic culture. The food includes hákarl (fermented shark), svið (sheep's head), and various preserved meats.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/things-to-do/culture/traditions/thorrablot",
  },
  {
    id: "2",
    name: "Winter Lights Festival",
    startDate: new Date(2025, 1, 6), // February 6
    endDate: new Date(2025, 1, 9), // February 9
    location: "Reykjavík",
    description:
      "Annual event that celebrates both the winter world and the growing light after a long period of darkness. The festival includes light installations, cultural events, outdoor activities, and a museum night.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/event/winter-lights-festival",
  },
  {
    id: "3",
    name: "Beer Day",
    startDate: new Date(2025, 2, 1), // March 1
    endDate: new Date(2025, 2, 1), // March 1
    location: "Nationwide",
    description:
      "Celebrates the end of beer prohibition in Iceland, which lasted from 1915 to March 1, 1989. Many bars and restaurants offer special beer tastings and events.",
    type: "food",
    website: "https://guidetoiceland.is/history-culture/beer-day-in-iceland",
  },
  {
    id: "4",
    name: "Puffin Watching Season Begins",
    startDate: new Date(2025, 3, 15), // April 15
    endDate: new Date(2025, 7, 20), // August 20
    location: "Coastal areas",
    description:
      "The Atlantic puffin returns to Iceland to nest from mid-April to mid-August. Best viewing locations include the Westman Islands, Látrabjarg in the Westfjords, and Borgarfjörður Eystri in East Iceland.",
    type: "nature",
    website: "https://www.inspiredbyiceland.com/things-to-do/nature/bird-watching",
  },
  {
    id: "5",
    name: "First Day of Summer",
    startDate: new Date(2025, 3, 24), // April 24
    endDate: new Date(2025, 3, 24), // April 24
    location: "Nationwide",
    description:
      "An Icelandic public holiday celebrating the first day of summer according to the old Norse calendar. Parades, sporting events, and entertainment are organized throughout the country.",
    type: "holiday",
    website: "https://guidetoiceland.is/history-culture/the-first-day-of-summer-in-iceland",
  },
  {
    id: "6",
    name: "Reykjavík Arts Festival",
    startDate: new Date(2025, 5, 1), // June 1
    endDate: new Date(2025, 5, 16), // June 16
    location: "Reykjavík",
    description:
      "Iceland's premier cultural festival, featuring local and international artists across various disciplines including music, visual arts, dance, and theater.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/event/reykjavik-arts-festival",
  },
  {
    id: "7",
    name: "Secret Solstice Festival",
    startDate: new Date(2025, 5, 20), // June 20
    endDate: new Date(2025, 5, 22), // June 22
    location: "Reykjavík",
    description:
      "Music festival held during the summer solstice when the sun never fully sets. Features international and Icelandic musicians across multiple stages.",
    type: "music",
    website: "https://www.inspiredbyiceland.com/event/secret-solstice",
  },
  {
    id: "8",
    name: "Midnight Sun Season",
    startDate: new Date(2025, 5, 1), // June 1
    endDate: new Date(2025, 6, 31), // July 31
    location: "Nationwide",
    description:
      "Period when the sun barely sets in Iceland, creating the natural phenomenon known as the midnight sun. Perfect for extended sightseeing and photography during the 'golden hour' that lasts for hours.",
    type: "nature",
    website: "https://www.inspiredbyiceland.com/things-to-do/nature/midnight-sun",
  },
  {
    id: "9",
    name: "Icelandic National Day",
    startDate: new Date(2025, 5, 17), // June 17
    endDate: new Date(2025, 5, 17), // June 17
    location: "Nationwide",
    description:
      "Celebrates Iceland's independence from Danish rule. Features parades, speeches, concerts, and family activities throughout the country, with the largest celebrations in Reykjavík.",
    type: "holiday",
    website: "https://guidetoiceland.is/history-culture/independence-day-in-iceland",
  },
  {
    id: "10",
    name: "Bræðslan Music Festival",
    startDate: new Date(2025, 6, 25), // July 25
    endDate: new Date(2025, 6, 27), // July 27
    location: "Borgarfjörður Eystri, East Iceland",
    description:
      "Intimate music festival held in an old fish factory in a remote East Iceland village. Known for its unique atmosphere and quality performances.",
    type: "music",
    website: "https://www.inspiredbyiceland.com/event/braedslan-music-festival",
  },
  {
    id: "11",
    name: "Verslunarmannahelgi (Merchants' Weekend)",
    startDate: new Date(2025, 7, 1), // August 1
    endDate: new Date(2025, 7, 3), // August 3
    location: "Nationwide",
    description:
      "Iceland's biggest travel weekend of the year. Many Icelanders camp at various festivals around the country, with the largest being Þjóðhátíð in the Westman Islands.",
    type: "holiday",
    website: "https://guidetoiceland.is/history-culture/verslunarmannahelgi-merchants-weekend-in-iceland",
  },
  {
    id: "12",
    name: "Reykjavík Marathon",
    startDate: new Date(2025, 7, 23), // August 23
    endDate: new Date(2025, 7, 23), // August 23
    location: "Reykjavík",
    description:
      "Annual marathon event coinciding with Reykjavík Culture Night. Offers various distances from 3km fun run to full marathon.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/event/reykjavik-marathon",
  },
  {
    id: "13",
    name: "Reykjavík Culture Night",
    startDate: new Date(2025, 7, 23), // August 23
    endDate: new Date(2025, 7, 23), // August 23
    location: "Reykjavík",
    description:
      "One of Reykjavík's biggest events with hundreds of activities throughout the city, including concerts, exhibitions, and a spectacular fireworks display.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/event/reykjavik-culture-night",
  },
  {
    id: "14",
    name: "Northern Lights Season Begins",
    startDate: new Date(2025, 8, 1), // September 1
    endDate: new Date(2025, 2, 31), // March 31 (next year)
    location: "Nationwide",
    description:
      "The aurora borealis becomes visible in Iceland from late August/early September until early April, with peak visibility during the darkest winter months.",
    type: "nature",
    website: "https://www.inspiredbyiceland.com/things-to-do/nature/northern-lights",
  },
  {
    id: "15",
    name: "Réttir (Annual Sheep Round-up)",
    startDate: new Date(2025, 8, 1), // September 1
    endDate: new Date(2025, 8, 30), // September 30
    location: "Rural areas",
    description:
      "Traditional autumn event where farmers and locals gather sheep from the mountains after summer grazing. Often followed by community celebrations and dances.",
    type: "cultural",
    website: "https://guidetoiceland.is/history-culture/rettir-the-annual-sheep-round-up",
  },
  {
    id: "16",
    name: "Iceland Airwaves",
    startDate: new Date(2025, 10, 5), // November 5
    endDate: new Date(2025, 10, 8), // November 8
    location: "Reykjavík",
    description:
      "Internationally renowned music festival showcasing new music from Iceland and around the world in venues across Reykjavík.",
    type: "music",
    website: "https://www.inspiredbyiceland.com/event/iceland-airwaves",
  },
  {
    id: "17",
    name: "Icelandic Food and Fun Festival",
    startDate: new Date(2025, 1, 26), // February 26
    endDate: new Date(2025, 2, 2), // March 2
    location: "Reykjavík",
    description:
      "Culinary festival where world-renowned chefs collaborate with Reykjavík restaurants to create gourmet menus using Icelandic ingredients.",
    type: "food",
    website: "https://www.inspiredbyiceland.com/event/food-and-fun",
  },
  {
    id: "18",
    name: "Yule Lads Season",
    startDate: new Date(2025, 11, 12), // December 12
    endDate: new Date(2025, 11, 24), // December 24
    location: "Nationwide",
    description:
      "The 13 Yule Lads (Iceland's version of Santa Claus) come to town one by one during the 13 days before Christmas, leaving small gifts in children's shoes.",
    type: "holiday",
    website: "https://guidetoiceland.is/history-culture/christmas-in-iceland",
  },
  {
    id: "19",
    name: "New Year's Eve Celebrations",
    startDate: new Date(2025, 11, 31), // December 31
    endDate: new Date(2025, 11, 31), // December 31
    location: "Nationwide",
    description:
      "Iceland's biggest celebration of the year with bonfires, family gatherings, and one of the world's largest amateur fireworks displays.",
    type: "holiday",
    website: "https://www.inspiredbyiceland.com/things-to-do/culture/traditions/new-years-eve",
  },
  {
    id: "20",
    name: "Taste of Iceland",
    startDate: new Date(2025, 3, 3), // April 3
    endDate: new Date(2025, 3, 5), // April 5
    location: "Chicago and other international cities",
    description:
      "Cultural festival that brings Icelandic cuisine, music, film, and art to cities around the world. Features Icelandic chefs, musicians, and artists.",
    type: "cultural",
    website: "https://www.inspiredbyiceland.com/event/taste-of-iceland",
  },
]

interface SeasonalEventsProps {
  startDate: Date
  duration: number
}

export default function SeasonalEvents({ startDate, duration }: SeasonalEventsProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(startDate)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Calculate the end date of the trip
  const endDate = addDays(startDate, duration - 1)

  // Filter events that occur during the trip
  const eventsOnTrip = icelandicEvents.filter(
    (event) =>
      isWithinInterval(startDate, { start: event.startDate, end: event.endDate }) ||
      isWithinInterval(endDate, { start: event.startDate, end: event.endDate }) ||
      (startDate <= event.startDate && endDate >= event.endDate),
  )

  // Filter events for the selected month
  const eventsInMonth = selectedMonth
    ? icelandicEvents.filter(
        (event) => isSameMonth(event.startDate, selectedMonth) || isSameMonth(event.endDate, selectedMonth),
      )
    : []

  const getEventIcon = (type: string) => {
    switch (type) {
      case "cultural":
        return <Landmark className="h-4 w-4" />
      case "food":
        return <Utensils className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
      case "nature":
        return <Sparkles className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "cultural":
        return "Cultural"
      case "food":
        return "Food & Drink"
      case "music":
        return "Music"
      case "nature":
        return "Natural Phenomenon"
      case "holiday":
        return "Holiday"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Seasonal Events & Festivals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {eventsOnTrip.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Events During Your Trip</h3>
            <div className="space-y-3">
              {eventsOnTrip.map((event) => (
                <div key={event.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>
                          {format(event.startDate, "MMM d")} - {format(event.endDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <Badge className="flex items-center">
                      {getEventIcon(event.type)}
                      <span className="ml-1">{getEventTypeLabel(event.type)}</span>
                    </Badge>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full mt-2 text-xs h-8"
                        onClick={() => setSelectedEvent(event)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center py-4 border rounded-md">
            <p className="text-muted-foreground">No events during your selected travel dates</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Explore Events by Month</h3>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Select a month to see seasonal events</p>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-xs">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="month" onSelect={setSelectedMonth} selected={selectedMonth} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {selectedMonth && (
            <div className="space-y-3">
              {eventsInMonth.length > 0 ? (
                eventsInMonth.map((event) => (
                  <div key={event.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>
                            {format(event.startDate, "MMM d")} - {format(event.endDate, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <Badge className="flex items-center">
                        {getEventIcon(event.type)}
                        <span className="ml-1">{getEventTypeLabel(event.type)}</span>
                      </Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full mt-2 text-xs h-8"
                          onClick={() => setSelectedEvent(event)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedEvent && (
                          <>
                            <DialogHeader>
                              <DialogTitle>{selectedEvent.name}</DialogTitle>
                              <DialogDescription>
                                {format(selectedEvent.startDate, "MMMM d")} -{" "}
                                {format(selectedEvent.endDate, "MMMM d, yyyy")}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                              <div>
                                <Badge className="mb-2">{getEventTypeLabel(selectedEvent.type)}</Badge>
                                <p className="text-sm">{selectedEvent.description}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium">Location</h4>
                                <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                              </div>

                              {selectedEvent.website && (
                                <div>
                                  <Button variant="outline" className="w-full" asChild>
                                    <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer">
                                      Visit Official Website
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No events found for {format(selectedMonth, "MMMM yyyy")}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Dialog>
          {selectedEvent && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedEvent.name}</DialogTitle>
                <DialogDescription>
                  {format(selectedEvent.startDate, "MMMM d")} - {format(selectedEvent.endDate, "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Badge className="mb-2">{getEventTypeLabel(selectedEvent.type)}</Badge>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                </div>

                {selectedEvent.website && (
                  <div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer">
                        Visit Official Website
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
