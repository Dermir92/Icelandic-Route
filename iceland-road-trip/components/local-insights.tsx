"use client"

import { useState } from "react"
import { User, ThumbsUp, MessageSquare, ExternalLink, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LocalTip {
  id: string
  author: {
    name: string
    avatar?: string
    isLocal: boolean
    location: string
  }
  title: string
  content: string
  category: "food" | "hidden-gem" | "activity" | "transport" | "accommodation" | "culture"
  region: string
  likes: number
  comments: number
  source: "iheartreykjavik" | "visiticeland" | "community" | "nordicvisitor"
  sourceUrl?: string
  date: string
}

// Mock data - in a real app, this would come from I Heart Reykjavík, Visit Iceland, etc.
const getMockLocalTips = (region: string): LocalTip[] => {
  const allTips: LocalTip[] = [
    {
      id: "1",
      author: {
        name: "Auður",
        avatar: "/placeholder.svg?height=40&width=40",
        isLocal: true,
        location: "Reykjavík",
      },
      title: "The best hot dog in Reykjavík isn't at Bæjarins Beztu",
      content:
        "While Bæjarins Beztu is famous, locals prefer Pylsuvagninn in Hafnarfjörður or Pylsuhúsið downtown. Ask for 'ein með öllu' (one with everything) for the authentic experience.",
      category: "food",
      region: "Reykjavík",
      likes: 47,
      comments: 12,
      source: "iheartreykjavik",
      sourceUrl: "https://iheartreykjavik.net/2019/07/the-hot-dog-the-national-food-of-iceland/",
      date: "2025-02-15",
    },
    {
      id: "2",
      author: {
        name: "Gunnar",
        avatar: "/placeholder.svg?height=40&width=40",
        isLocal: true,
        location: "Akureyri",
      },
      title: "Secret thermal river near Hveragerði",
      content:
        "Most tourists visit the crowded Reykjadalur hot spring, but if you hike 20 minutes further up the valley, you'll find a secluded spot with fewer people and equally warm water.",
      category: "hidden-gem",
      region: "South Iceland",
      likes: 89,
      comments: 23,
      source: "community",
      date: "2025-03-10",
    },
    {
      id: "3",
      author: {
        name: "Visit Iceland",
        isLocal: true,
        location: "Iceland",
      },
      title: "Best time to visit Jökulsárlón",
      content:
        "Visit Jökulsárlón Glacier Lagoon in the early morning or late evening to avoid tour buses. The light is magical during these hours, and you'll have more space to enjoy the floating icebergs.",
      category: "activity",
      region: "South Iceland",
      likes: 124,
      comments: 18,
      source: "visiticeland",
      sourceUrl: "https://visiticeland.com/article/jokulsarlon-glacier-lagoon",
      date: "2025-01-22",
    },
    {
      id: "4",
      author: {
        name: "Kristín",
        avatar: "/placeholder.svg?height=40&width=40",
        isLocal: true,
        location: "Ísafjörður",
      },
      title: "Westfjords driving tip",
      content:
        "When driving in the Westfjords, download offline maps and fill up your tank whenever possible. Gas stations are few and far between, and mobile coverage can be spotty in remote areas.",
      category: "transport",
      region: "Westfjords",
      likes: 56,
      comments: 7,
      source: "community",
      date: "2025-03-05",
    },
    {
      id: "5",
      author: {
        name: "Nordic Visitor",
        isLocal: true,
        location: "Reykjavík",
      },
      title: "Authentic farm stay in North Iceland",
      content:
        "For an authentic Icelandic experience, book a farm stay in North Iceland. Many working farms offer accommodation and the chance to interact with Icelandic horses, sheep, and experience rural life.",
      category: "accommodation",
      region: "North Iceland",
      likes: 42,
      comments: 9,
      source: "nordicvisitor",
      sourceUrl: "https://www.nordicvisitor.com/blog/farm-stays-in-iceland/",
      date: "2025-02-28",
    },
    {
      id: "6",
      author: {
        name: "Björn",
        avatar: "/placeholder.svg?height=40&width=40",
        isLocal: true,
        location: "Höfn",
      },
      title: "Local food festival in East Iceland",
      content:
        "If you're visiting East Iceland in summer, check out the local food festivals in small villages. Höfn's lobster festival and Djúpivogur's blueberry festival offer the best local cuisine and culture.",
      category: "food",
      region: "East Iceland",
      likes: 31,
      comments: 5,
      source: "community",
      date: "2025-01-15",
    },
    {
      id: "7",
      author: {
        name: "I Heart Reykjavík",
        isLocal: true,
        location: "Reykjavík",
      },
      title: "Swimming pool etiquette",
      content:
        "When visiting Icelandic swimming pools, remember that showering naked before entering the pool is mandatory. This is strictly enforced and considered basic hygiene, not something to skip!",
      category: "culture",
      region: "Iceland",
      likes: 103,
      comments: 34,
      source: "iheartreykjavik",
      sourceUrl: "https://iheartreykjavik.net/2013/05/iceland-swimming-pool-etiquette/",
      date: "2025-03-20",
    },
    {
      id: "8",
      author: {
        name: "Visit Iceland",
        isLocal: true,
        location: "Iceland",
      },
      title: "Snæfellsnes Peninsula hidden beaches",
      content:
        "While Djúpalónssandur is popular, visit the nearby Dritvík cove for equally stunning black pebble beaches with fewer tourists. Look for the remains of the old fishing stations and enjoy the solitude.",
      category: "hidden-gem",
      region: "Snæfellsnes Peninsula",
      likes: 67,
      comments: 11,
      source: "visiticeland",
      sourceUrl: "https://visiticeland.com/article/snaefellsnes-peninsula",
      date: "2025-02-10",
    },
  ]

  // Filter tips by region if specified, otherwise return all
  if (region && region !== "all" && region !== "Iceland") {
    const regionTips = allTips.filter(
      (tip) => tip.region.toLowerCase().includes(region.toLowerCase()) || tip.region === "Iceland",
    )

    // If no specific tips for this region, return general Iceland tips
    return regionTips.length > 0 ? regionTips : allTips.filter((tip) => tip.region === "Iceland")
  }

  return allTips
}

interface LocalInsightsProps {
  region: string
}

export default function LocalInsights({ region }: LocalInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const localTips = getMockLocalTips(region)

  const filteredTips = selectedCategory ? localTips.filter((tip) => tip.category === selectedCategory) : localTips

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "food":
        return "Food & Drink"
      case "hidden-gem":
        return "Hidden Gem"
      case "activity":
        return "Activity"
      case "transport":
        return "Transportation"
      case "accommodation":
        return "Accommodation"
      case "culture":
        return "Cultural Tip"
      default:
        return category
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return "🍽️"
      case "hidden-gem":
        return "💎"
      case "activity":
        return "🏞️"
      case "transport":
        return "🚗"
      case "accommodation":
        return "🏠"
      case "culture":
        return "🇮🇸"
      default:
        return "💡"
    }
  }

  const getSourceName = (source: string) => {
    switch (source) {
      case "iheartreykjavik":
        return "I Heart Reykjavík"
      case "visiticeland":
        return "Visit Iceland"
      case "community":
        return "Local Community"
      case "nordicvisitor":
        return "Nordic Visitor"
      default:
        return source
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Local Insights & Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Authentic recommendations from locals and Icelandic travel experts for your trip to {region}.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Tips
          </Button>
          {Array.from(new Set(localTips.map((tip) => tip.category))).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryIcon(category)} {getCategoryLabel(category)}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {tip.author.avatar && (
                    <AvatarImage src={tip.author.avatar || "/placeholder.svg"} alt={tip.author.name} />
                  )}
                  <AvatarFallback>{tip.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium flex items-center">
                      {tip.author.name}
                      {tip.author.isLocal && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="ml-2 text-xs">
                                Local
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Icelandic local or expert</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {getCategoryIcon(tip.category)} {getCategoryLabel(tip.category)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{tip.author.location}</span>
                  </div>
                  <h4 className="font-medium mt-2">{tip.title}</h4>
                  <p className="text-sm mt-1 text-muted-foreground">
                    {expandedTip === tip.id
                      ? tip.content
                      : `${tip.content.substring(0, 120)}${tip.content.length > 120 ? "..." : ""}`}
                  </p>
                  {tip.content.length > 120 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs"
                      onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                    >
                      {expandedTip === tip.id ? "Show less" : "Read more"}
                    </Button>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {tip.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {tip.comments}
                      </span>
                    </div>
                    {tip.sourceUrl && (
                      <a
                        href={tip.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        {getSourceName(tip.source)}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://iheartreykjavik.net" target="_blank" rel="noopener noreferrer">
              I Heart Reykjavík
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://visiticeland.com" target="_blank" rel="noopener noreferrer">
              Visit Iceland
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href="https://www.nordicvisitor.com" target="_blank" rel="noopener noreferrer">
              Nordic Visitor
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
