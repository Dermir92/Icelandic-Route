"use client"

import Link from "next/link"
import {
  MountainSnow,
  Shield,
  AlertTriangle,
  ExternalLink,
  Compass,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Wind,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import TripGenerator from "@/components/trip-generator"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* ── Navigation ───────────────────────────���──────── */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <MountainSnow className="h-5 w-5 text-blue-700" />
            <span className="font-bold text-gray-900 text-base tracking-tight">Ferðalög</span>
            <span className="hidden sm:inline text-gray-400 text-sm font-normal">
              Iceland Road Trips
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="#what-you-get"
              className="hidden md:block text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
            >
              How it works
            </Link>
            <Link
              href="#seasons"
              className="hidden md:block text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
            >
              Seasons
            </Link>
            <Link
              href="/enhanced-results"
              className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
            >
              Sample trip
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm h-8 px-4 rounded-full ml-2"
            >
              <a href="#plan">Plan my trip</a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero — cinematic Iceland gradient ───────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background: [
              "linear-gradient(",
              "  175deg,",
              "  #020c1a 0%,",
              "  #040f22 12%,",
              "  #071828 25%,",
              "  #0a2240 40%,",
              "  #0c2e4c 54%,",
              "  #0b2830 67%,",
              "  #091e14 80%,",
              "  #050d09 90%,",
              "  #020608 100%",
              ")",
            ].join(""),
          }}
        >
          {/* Aurora glow layers */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Blue sky glow — top */}
            <div
              className="absolute"
              style={{
                top: "-5%", left: "10%", width: "80%", height: "60%",
                background: "radial-gradient(ellipse at 50% 30%, rgba(25,90,210,0.11) 0%, transparent 65%)",
                filter: "blur(50px)",
              }}
            />
            {/* Green aurora band — mid */}
            <div
              className="absolute"
              style={{
                top: "28%", left: "-20%", right: "-20%", height: "38%",
                background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(0,185,105,0.07) 0%, transparent 68%)",
                filter: "blur(35px)",
              }}
            />
            {/* Warm glow — bottom right */}
            <div
              className="absolute"
              style={{
                bottom: "0%", right: "0%", width: "50%", height: "40%",
                background: "radial-gradient(circle at 70% 80%, rgba(25,80,180,0.05) 0%, transparent 65%)",
                filter: "blur(60px)",
              }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-10 container px-4 md:px-6 max-w-5xl mx-auto">
            {/* Upper: editorial text — centered */}
            <div className="text-center pt-14 md:pt-20 pb-10 md:pb-12">
              <span className="inline-block text-xs font-medium text-blue-300/80 tracking-widest uppercase mb-5">
                Free &nbsp;·&nbsp; No account needed &nbsp;·&nbsp; Instant results
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-white leading-[1.05] tracking-tight">
                Build a safer<br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #93c5fd 0%, #67e8f9 100%)",
                  }}
                >
                  Iceland road trip.
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
                Choose your season, region and travel style. Get a day-by-day
                itinerary shaped around Icelandic road conditions, weather
                patterns, and seasonal access.
              </p>

              {/* Trust indicators */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {heroTrust.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-white/50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400/70 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Lower: trip generator widget — centered */}
            <div id="plan" className="pb-14 md:pb-20">
              <Card className="max-w-lg mx-auto shadow-2xl border-0 ring-1 ring-white/10 overflow-hidden">
                {/* Card header strip */}
                <div
                  className="px-6 py-4 border-b border-gray-100"
                  style={{ background: "linear-gradient(135deg, #0f2645 0%, #0a1e38 100%)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-white font-semibold text-base">Plan your trip</h2>
                      <p className="text-blue-300/70 text-xs mt-0.5">Season-aware · Day-by-day itinerary</p>
                    </div>
                    <MountainSnow className="h-5 w-5 text-blue-400/60" />
                  </div>
                </div>
                <CardContent className="p-5 bg-white">
                  <TripGenerator />
                </CardContent>
              </Card>

              {/* Data disclaimer — under card */}
              <p className="text-center text-xs text-white/25 mt-4 flex items-center justify-center gap-1.5 max-w-sm mx-auto">
                <AlertTriangle className="h-3 w-3 text-amber-400/40 flex-shrink-0" />
                Road &amp; weather data is illustrative. Always verify at{" "}
                <a href="https://road.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">road.is</a>{" "}
                and{" "}
                <a href="https://safetravel.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">safetravel.is</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ── What your itinerary includes ────────────────── */}
        <section id="what-you-get" className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-700 tracking-widest uppercase mb-3">What&apos;s included</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Your day-by-day Iceland itinerary
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
                Every generated trip includes the following — no account, no payment.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {itineraryFeatures.map((f) => (
                <div key={f.title} className="flex flex-col gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <f.icon className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Iceland by season ───────────────────────────── */}
        <section id="seasons" className="w-full py-16 md:py-24" style={{ backgroundColor: "#faf8f4" }}>
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-amber-700 tracking-widest uppercase mb-3">When to go</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Iceland through the seasons
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
                Iceland&apos;s roads, daylight, and landscapes change completely by season. Your trip should reflect that.
              </p>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {seasonCards.map((s) => (
                <div
                  key={s.name}
                  className="relative rounded-2xl overflow-hidden flex flex-col justify-end"
                  style={{ background: s.gradient, minHeight: 280 }}
                >
                  {/* Badge */}
                  <span className={`absolute top-4 left-4 text-xs font-medium rounded-full px-2.5 py-1 ${s.badgeClass}`}>
                    {s.badge}
                  </span>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-3xl mb-2">{s.emoji}</div>
                    <h3 className="text-xl font-bold text-white">{s.name}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{s.period}</p>
                    <ul className="mt-3 space-y-1">
                      {s.highlights.map((h) => (
                        <li key={h} className="text-white/70 text-xs flex items-start gap-1.5">
                          <span className="text-white/30 mt-0.5">·</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#plan"
                      className="mt-4 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      Plan for {s.name}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular route ideas ─────────────────────────── */}
        <section className="w-full py-16 md:py-24" style={{ backgroundColor: "#0d1f35" }}>
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-3">Get inspired</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Choose your route style
              </h2>
              <p className="mt-3 text-white/50 max-w-md mx-auto leading-relaxed">
                Not sure where to start? These popular route styles give you a starting point — then generate your custom itinerary.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {routeIdeas.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl overflow-hidden border border-white/10 flex flex-col"
                  style={{ background: r.gradient }}
                >
                  <div className="p-6 flex-1">
                    <span className="inline-block text-xs font-medium text-white/50 border border-white/20 rounded-full px-2.5 py-0.5 mb-4">
                      {r.duration}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">{r.name}</h3>
                    <p className="text-white/50 text-xs mt-1">{r.subtitle}</p>
                    <p className="text-white/65 text-sm mt-3 leading-relaxed">{r.description}</p>
                    <p className="text-white/35 text-xs mt-3 flex items-center gap-1">
                      <Compass className="h-3 w-3" />
                      {r.regions}
                    </p>
                  </div>
                  <div className="px-6 pb-5">
                    <a
                      href="#plan"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-300 hover:text-blue-200 transition-colors font-medium"
                    >
                      Start planning
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Travel safely ───────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white border-t border-gray-100">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-[1fr_340px] items-start">
              {/* Left: editorial safety copy */}
              <div>
                <p className="text-xs font-semibold text-red-600 tracking-widest uppercase mb-3">Travel safety</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Always check before you go.
                </h2>
                <p className="mt-4 text-gray-500 leading-relaxed max-w-lg">
                  Iceland&apos;s weather can shift in minutes. Roads close without notice. Glacial rivers rise rapidly
                  after rain. What was passable this morning may not be this afternoon.
                </p>
                <p className="mt-3 text-gray-500 leading-relaxed max-w-lg">
                  Road conditions, weather forecasts, and safety alerts on this site are{" "}
                  <strong className="text-gray-700 font-medium">illustrative only</strong>, built from published
                  data structures. Always verify live conditions before departure.
                </p>

                {/* Safety callout */}
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 leading-relaxed">
                    <strong className="font-semibold">Register your trip</strong> at{" "}
                    <a
                      href="https://safetravel.is"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      safetravel.is
                    </a>{" "}
                    before heading into remote areas. Iceland&apos;s mountain rescue (ICE-SAR) is volunteer-run — please
                    travel responsibly. Call{" "}
                    <strong className="font-semibold">112</strong> in emergencies.
                  </div>
                </div>
              </div>

              {/* Right: official source cards */}
              <div className="space-y-3">
                {officialSources.map((src) => (
                  <a
                    key={src.name}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <src.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        {src.name}
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{src.description}</p>
                      <span className="inline-block mt-1.5 text-xs text-red-600 font-medium">
                        {src.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#0d1f35" }} className="border-t border-white/10">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto py-10 md:py-12">
          <div className="grid gap-8 sm:grid-cols-[auto_1fr] items-start">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <MountainSnow className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-white text-base">Ferðalög</span>
              </div>
              <p className="text-white/40 text-sm mt-2 max-w-[200px] leading-relaxed">
                Iceland road trip planning. Season-aware, safety-first.
              </p>
            </div>

            {/* Attribution */}
            <div className="sm:text-right">
              <p className="text-xs text-white/30 leading-relaxed">
                Trip data from{" "}
                <a href="https://www.inspiredbyiceland.com/" className="hover:text-white/60 underline" target="_blank" rel="noreferrer">
                  Inspired by Iceland
                </a>{" "}
                and{" "}
                <a href="https://guidetoiceland.is/" className="hover:text-white/60 underline" target="_blank" rel="noreferrer">
                  Guide to Iceland
                </a>
                .<br />
                Safety sources:{" "}
                <a href="https://safetravel.is/" className="hover:text-white/60 underline" target="_blank" rel="noreferrer">SafeTravel.is</a>
                {" "}·{" "}
                <a href="https://www.road.is/" className="hover:text-white/60 underline" target="_blank" rel="noreferrer">Vegagerðin</a>
                {" "}·{" "}
                <a href="https://en.vedur.is/" className="hover:text-white/60 underline" target="_blank" rel="noreferrer">Veðurstofan</a>
                .<br />
                <span className="text-white/20">All road, weather and safety conditions shown are illustrative.</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Static data ──────────────────────────────────────────────

const heroTrust = [
  "Season-aware itineraries",
  "46+ curated attractions",
  "Road & weather guidance",
  "Safety reminders included",
]

const itineraryFeatures = [
  {
    icon: Calendar,
    title: "Day-by-day stops",
    description:
      "Each day mapped with suggested attractions, timing, and overnight accommodation — adapted to your chosen region.",
  },
  {
    icon: Snowflake,
    title: "Seasonal guidance",
    description:
      "Routes and timing notes adapt to your travel season — summer roads vs winter access vs spring snowmelt.",
  },
  {
    icon: ShieldCheck,
    title: "Road & safety notes",
    description:
      "Illustrative road conditions and seasonal weather patterns with direct links to official Icelandic safety resources.",
  },
]

const seasonCards = [
  {
    name: "Summer",
    period: "June – August",
    emoji: "☀️",
    highlights: [
      "Midnight sun — near 24h daylight",
      "Open highland F-roads",
      "Puffins and wildflowers",
      "Peak hiking season",
    ],
    badge: "Most popular",
    badgeClass: "bg-amber-400/20 text-amber-100 border border-amber-400/20",
    gradient:
      "linear-gradient(160deg, #0e2e3a 0%, #185a38 45%, #267028 100%)",
  },
  {
    name: "Autumn",
    period: "September – October",
    emoji: "🍂",
    highlights: [
      "First northern lights",
      "Golden birch forests",
      "Fewer crowds",
      "Whale watching season",
    ],
    badge: "Best value",
    badgeClass: "bg-orange-400/20 text-orange-100 border border-orange-400/20",
    gradient:
      "linear-gradient(160deg, #2a1605 0%, #5a3018 48%, #7a5010 100%)",
  },
  {
    name: "Winter",
    period: "November – March",
    emoji: "❄️",
    highlights: [
      "Aurora hunting",
      "Ice cave season",
      "Snow-covered landscapes",
      "Dramatic winter light",
    ],
    badge: "Aurora season",
    badgeClass: "bg-blue-400/20 text-blue-100 border border-blue-400/20",
    gradient:
      "linear-gradient(160deg, #020810 0%, #051428 38%, #060e1e 72%, #030810 100%)",
  },
  {
    name: "Spring",
    period: "April – May",
    emoji: "🌿",
    highlights: [
      "Snowmelt waterfalls at peak",
      "Puffins return",
      "Roads reopening",
      "Smaller crowds",
    ],
    badge: "Hidden gem",
    badgeClass: "bg-green-400/20 text-green-100 border border-green-400/20",
    gradient:
      "linear-gradient(160deg, #0a2028 0%, #0e3322 40%, #1d5e2a 72%, #277525 100%)",
  },
]

const routeIdeas = [
  {
    name: "The Ring Road",
    subtitle: "Iceland's iconic circular highway",
    duration: "7–10 days",
    description:
      "Circumnavigate Iceland on Route 1. Volcanoes, glaciers, fjords and waterfalls — every major landscape, one continuous route.",
    regions: "All regions · Ring Road 1",
    gradient: "linear-gradient(145deg, #0a1a30 0%, #0e2a52 100%)",
  },
  {
    name: "South Coast & Golden Circle",
    subtitle: "Iceland's most accessible route",
    duration: "2–4 days",
    description:
      "Geysers, waterfalls, glaciers and black sand beaches — all within a few hours of Reykjavík. Perfect first Iceland trip.",
    regions: "South Iceland · Golden Circle",
    gradient: "linear-gradient(145deg, #0a1e2a 0%, #0e3045 100%)",
  },
  {
    name: "Westfjords Discovery",
    subtitle: "Remote Iceland at its most dramatic",
    duration: "4–6 days",
    description:
      "Towering bird cliffs, deserted fjords and empty roads. A genuine sense of standing at the edge of the world.",
    regions: "Westfjords · West Iceland",
    gradient: "linear-gradient(145deg, #0a1c14 0%, #0e2e1e 100%)",
  },
]

const officialSources = [
  {
    name: "SafeTravel.is",
    url: "https://safetravel.is",
    icon: Shield,
    description: "Iceland's official travel safety platform. Register your trip and check alerts.",
    label: "Always check before remote travel",
  },
  {
    name: "Vegagerðin — road.is",
    url: "https://www.road.is",
    icon: Compass,
    description: "Icelandic Road Administration. Live road conditions and closures.",
    label: "Check road status before you drive",
  },
  {
    name: "Veðurstofan — vedur.is",
    url: "https://en.vedur.is",
    icon: Wind,
    description: "Icelandic Met Office. Weather forecasts, wind warnings, and aurora activity.",
    label: "Live weather and aurora forecasts",
  },
]
