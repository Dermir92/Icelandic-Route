"use client"

import { useState } from "react"
import { Calculator, PlusCircle, MinusCircle, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface BudgetItem {
  id: string
  name: string
  cost: number
  category: string
}

interface BudgetPlannerProps {
  duration: number
  region: string
}

export default function BudgetPlanner({ duration, region }: BudgetPlannerProps) {
  const [budgetStyle, setBudgetStyle] = useState<"budget" | "standard" | "luxury">("standard")
  const [customItems, setCustomItems] = useState<BudgetItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemCost, setNewItemCost] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("accommodation")

  // Base costs per day in ISK (Icelandic Króna)
  const baseCosts = {
    budget: {
      accommodation: 15000,
      food: 8000,
      activities: 5000,
      transportation: 7000,
    },
    standard: {
      accommodation: 30000,
      food: 15000,
      activities: 10000,
      transportation: 10000,
    },
    luxury: {
      accommodation: 60000,
      food: 25000,
      activities: 20000,
      transportation: 15000,
    },
  }

  // Regional cost adjustments
  const regionMultipliers: Record<string, number> = {
    Reykjavík: 1.2,
    "Golden Circle": 1.1,
    "South Iceland": 1.0,
    "North Iceland": 0.9,
    "East Iceland": 0.9,
    "West Iceland": 0.95,
    Westfjords: 1.05,
    Highlands: 1.15,
    "Snæfellsnes Peninsula": 1.05,
    Iceland: 1.0, // Default for "All Iceland"
  }

  const regionMultiplier = regionMultipliers[region] || 1.0

  // Calculate daily costs based on selected budget style and region
  const dailyCosts = {
    accommodation: baseCosts[budgetStyle].accommodation * regionMultiplier,
    food: baseCosts[budgetStyle].food * regionMultiplier,
    activities: baseCosts[budgetStyle].activities * regionMultiplier,
    transportation: baseCosts[budgetStyle].transportation * regionMultiplier,
  }

  // Calculate total costs
  const totalAccommodation = dailyCosts.accommodation * (duration - 1) // One less night than days
  const totalFood = dailyCosts.food * duration
  const totalActivities = dailyCosts.activities * duration
  const totalTransportation = dailyCosts.transportation * duration

  const customItemsTotal = customItems.reduce((sum, item) => sum + item.cost, 0)

  const totalCost = totalAccommodation + totalFood + totalActivities + totalTransportation + customItemsTotal

  // Convert ISK to other currencies (approximate conversion rates)
  const currencies = {
    ISK: totalCost,
    USD: totalCost / 140,
    EUR: totalCost / 150,
    GBP: totalCost / 175,
  }

  const addCustomItem = () => {
    if (newItemName && newItemCost) {
      const cost = Number.parseFloat(newItemCost)
      if (!isNaN(cost)) {
        setCustomItems([
          ...customItems,
          {
            id: Date.now().toString(),
            name: newItemName,
            cost,
            category: newItemCategory,
          },
        ])
        setNewItemName("")
        setNewItemCost("")
      }
    }
  }

  const removeCustomItem = (id: string) => {
    setCustomItems(customItems.filter((item) => item.id !== id))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Trip Budget Planner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Travel Style</Label>
            <Select
              value={budgetStyle}
              onValueChange={(value: "budget" | "standard" | "luxury") => setBudgetStyle(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (Hostels, Self-catering)</SelectItem>
                <SelectItem value="standard">Standard (3-star hotels, Casual dining)</SelectItem>
                <SelectItem value="luxury">Luxury (4-5 star hotels, Fine dining)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="custom">Custom Items</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Accommodation</Label>
                  <div className="text-2xl font-bold">{Math.round(totalAccommodation).toLocaleString()} ISK</div>
                  <div className="text-xs text-muted-foreground">{duration - 1} nights</div>
                </div>

                <div className="space-y-2">
                  <Label>Food & Drinks</Label>
                  <div className="text-2xl font-bold">{Math.round(totalFood).toLocaleString()} ISK</div>
                  <div className="text-xs text-muted-foreground">{duration} days</div>
                </div>

                <div className="space-y-2">
                  <Label>Activities</Label>
                  <div className="text-2xl font-bold">{Math.round(totalActivities).toLocaleString()} ISK</div>
                  <div className="text-xs text-muted-foreground">{duration} days</div>
                </div>

                <div className="space-y-2">
                  <Label>Transportation</Label>
                  <div className="text-2xl font-bold">{Math.round(totalTransportation).toLocaleString()} ISK</div>
                  <div className="text-xs text-muted-foreground">{duration} days</div>
                </div>

                {customItemsTotal > 0 && (
                  <div className="space-y-2">
                    <Label>Custom Items</Label>
                    <div className="text-2xl font-bold">{Math.round(customItemsTotal).toLocaleString()} ISK</div>
                    <div className="text-xs text-muted-foreground">{customItems.length} items</div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">Total Estimated Cost</Label>
                  <div className="text-3xl font-bold">{Math.round(totalCost).toLocaleString()} ISK</div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{Math.round(currencies.USD).toLocaleString()} USD</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">€</span>
                    <span>{Math.round(currencies.EUR).toLocaleString()} EUR</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">£</span>
                    <span>{Math.round(currencies.GBP).toLocaleString()} GBP</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <div className="space-y-6">
                <div>
                  <Label>Daily Accommodation Cost</Label>
                  <div className="flex items-center mt-2">
                    <Slider
                      value={[dailyCosts.accommodation]}
                      min={5000}
                      max={100000}
                      step={1000}
                      className="flex-1 mr-4"
                      disabled
                    />
                    <span className="w-24 text-right">{Math.round(dailyCosts.accommodation).toLocaleString()} ISK</span>
                  </div>
                </div>

                <div>
                  <Label>Daily Food Cost</Label>
                  <div className="flex items-center mt-2">
                    <Slider
                      value={[dailyCosts.food]}
                      min={3000}
                      max={50000}
                      step={500}
                      className="flex-1 mr-4"
                      disabled
                    />
                    <span className="w-24 text-right">{Math.round(dailyCosts.food).toLocaleString()} ISK</span>
                  </div>
                </div>

                <div>
                  <Label>Daily Activities Cost</Label>
                  <div className="flex items-center mt-2">
                    <Slider
                      value={[dailyCosts.activities]}
                      min={0}
                      max={50000}
                      step={1000}
                      className="flex-1 mr-4"
                      disabled
                    />
                    <span className="w-24 text-right">{Math.round(dailyCosts.activities).toLocaleString()} ISK</span>
                  </div>
                </div>

                <div>
                  <Label>Daily Transportation Cost</Label>
                  <div className="flex items-center mt-2">
                    <Slider
                      value={[dailyCosts.transportation]}
                      min={0}
                      max={30000}
                      step={1000}
                      className="flex-1 mr-4"
                      disabled
                    />
                    <span className="w-24 text-right">
                      {Math.round(dailyCosts.transportation).toLocaleString()} ISK
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                  <p>Note: These are estimated costs based on average prices in {region}.</p>
                  <p>Actual costs may vary based on specific accommodations, activities, and personal preferences.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                  <div>
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g., Blue Lagoon Entry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-cost">Cost (ISK)</Label>
                    <Input
                      id="item-cost"
                      value={newItemCost}
                      onChange={(e) => setNewItemCost(e.target.value)}
                      placeholder="e.g., 12000"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-category">Category</Label>
                    <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                      <SelectTrigger id="item-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="food">Food & Drinks</SelectItem>
                        <SelectItem value="activities">Activities</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addCustomItem} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Custom Item
                </Button>

                {customItems.length > 0 ? (
                  <div className="border rounded-md p-2 mt-4">
                    <Label className="mb-2 block">Custom Items</Label>
                    {customItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{item.cost.toLocaleString()} ISK</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCustomItem(item.id)}
                            className="h-8 w-8"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">No custom items added yet</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
