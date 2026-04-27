"use client"

import { useState } from "react"
import { CalendarIcon, Loader2, ArrowRight } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
  startDate: z.date({ required_error: "A start date is required." }),
  duration: z.number().min(1).max(7),
  region: z.string().min(1, { message: "Please select a region." }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest." }),
  season: z.string().min(1, { message: "Please select a season." }),
})

const interests = [
  { id: "nature",         label: "Nature & Landscapes" },
  { id: "culture",        label: "Culture & History" },
  { id: "food",           label: "Food & Cuisine" },
  { id: "adventure",      label: "Adventure" },
  { id: "relaxation",     label: "Relaxation & Wellness" },
  { id: "northern_lights",label: "Northern Lights" },
  { id: "hot_springs",    label: "Hot Springs" },
  { id: "wildlife",       label: "Wildlife Watching" },
]

const regions = [
  { value: "all",          label: "All Iceland" },
  { value: "south",        label: "South Iceland" },
  { value: "west",         label: "West Iceland" },
  { value: "north",        label: "North Iceland" },
  { value: "east",         label: "East Iceland" },
  { value: "westfjords",   label: "Westfjords" },
  { value: "highlands",    label: "Highlands" },
  { value: "reykjavik",    label: "Reykjavík & Surroundings" },
  { value: "golden_circle",label: "Golden Circle" },
  { value: "snaefellsnes", label: "Snæfellsnes Peninsula" },
]

const seasons = [
  { value: "summer", label: "☀️  Summer",  sub: "June–August · Midnight sun, open F-roads" },
  { value: "fall",   label: "🍂  Autumn",  sub: "Sep–Oct · Northern lights, fewer crowds" },
  { value: "winter", label: "❄️  Winter",  sub: "Nov–March · Aurora season, limited access" },
  { value: "spring", label: "🌿  Spring",  sub: "Apr–May · Snowmelt, puffins, quieter roads" },
]

export default function TripGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 3,
      interests: ["nature"],
      season: "summer",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    const tripData = getTrip(values)
    localStorage.setItem("tripData", JSON.stringify(tripData))
    setTimeout(() => {
      setIsGenerating(false)
      router.push("/results")
    }, 2000)
  }

  const watchedSeason = form.watch("season")
  const seasonSub = seasons.find((s) => s.value === watchedSeason)?.sub

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Row 1 — Season + Start Date */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Season
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Season" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasons.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="text-sm">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Start Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full pl-3 text-left text-sm font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "d MMM yyyy") : "Pick date"}
                        <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-40" />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Season hint — shown under the two-col row */}
        {seasonSub && (
          <p className="text-xs text-muted-foreground -mt-2">{seasonSub}</p>
        )}

        {/* Row 2 — Duration + Region */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Duration
                  <span className="ml-1.5 text-gray-900 font-bold normal-case">
                    {field.value}d
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={7}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="py-2.5"
                  />
                </FormControl>
                <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
                  <span>1 day</span>
                  <span>7 days</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Region
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="text-sm">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3 — Interests */}
        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                What interests you?
              </FormLabel>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {interests.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-gray-200 px-2.5 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) =>
                              checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((v) => v !== item.id))
                            }
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-normal cursor-pointer leading-tight">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg mt-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Building your itinerary…
            </>
          ) : (
            <>
              Generate my itinerary
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
