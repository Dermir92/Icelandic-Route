"use client"

import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { getTrip } from "@/lib/trip-data"

const formSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  duration: z.number().min(1).max(7),
  region: z.string().min(1, {
    message: "Please select a region.",
  }),
  interests: z.array(z.string()).min(1, {
    message: "Please select at least one interest.",
  }),
  season: z.string().min(1, {
    message: "Please select a season.",
  }),
})

const interests = [
  { id: "nature", label: "Nature & Landscapes" },
  { id: "culture", label: "Culture & History" },
  { id: "food", label: "Food & Cuisine" },
  { id: "adventure", label: "Adventure & Activities" },
  { id: "relaxation", label: "Relaxation & Wellness" },
  { id: "northern_lights", label: "Northern Lights" },
  { id: "hot_springs", label: "Hot Springs" },
  { id: "wildlife", label: "Wildlife Watching" },
]

const regions = [
  { value: "all", label: "All Iceland" },
  { value: "south", label: "South Iceland" },
  { value: "west", label: "West Iceland" },
  { value: "north", label: "North Iceland" },
  { value: "east", label: "East Iceland" },
  { value: "westfjords", label: "Westfjords" },
  { value: "highlands", label: "Highlands" },
  { value: "reykjavik", label: "Reykjavík & Surroundings" },
  { value: "golden_circle", label: "Golden Circle" },
  { value: "snaefellsnes", label: "Snæfellsnes Peninsula" },
]

const seasons = [
  { value: "summer", label: "Summer (June-August)" },
  { value: "winter", label: "Winter (November-March)" },
  { value: "spring", label: "Spring (April-May)" },
  { value: "fall", label: "Fall (September-October)" },
]

export default function TripGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 2,
      interests: ["nature"],
      season: "summer",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)

    // In a real application, we would send this data to the server
    console.log(values)

    // Generate trip data based on form values
    const tripData = getTrip(values)

    // Store trip data in localStorage for the results page to access
    localStorage.setItem("tripData", JSON.stringify(tripData))

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      router.push("/results")
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When would you like to start your adventure?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a season" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Different seasons offer unique experiences in Iceland.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Trip Duration: {field.value} {field.value === 1 ? "day" : "days"}
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={7}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>How many days would you like your trip to be?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select a region or choose "All Iceland" for a surprise.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Interests</FormLabel>
                  <FormDescription>Select what you're interested in experiencing.</FormDescription>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interests.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your trip...
            </>
          ) : (
            "Generate Trip"
          )}
        </Button>
      </form>
    </Form>
  )
}
