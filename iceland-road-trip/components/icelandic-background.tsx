"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type BackgroundTheme = "icelandic" | "glacier" | "volcanic" | "waterfall" | "moss" | "whale" | "puffin"

interface IcelandicBackgroundProps {
  theme?: BackgroundTheme
  animated?: boolean
}

export default function IcelandicBackground({ theme = "icelandic", animated = true }: IcelandicBackgroundProps = {}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${getBackgroundClasses(theme, animated)}`} />
        {theme === "icelandic" && animated && <IcelandicFlagEffect />}
        {theme === "whale" && <WhaleBackground />}
        {theme === "puffin" && <PuffinBackground />}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] dark:opacity-[0.02]" />
      </div>
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        }
        
        @media (prefers-color-scheme: dark) {
          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }
        }
        
        .icelandic-beam {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          opacity: 0.3;
          filter: blur(80px);
          transform: translateX(-50%) translateY(-50%);
          background: linear-gradient(90deg, 
            rgba(2, 71, 254, 0) 0%, 
            rgba(2, 71, 254, 0.5) 50%, 
            rgba(2, 71, 254, 0) 100%);
          animation: icelandic-flow 15s ease infinite alternate;
        }
        
        .icelandic-beam:nth-child(2) {
          animation-duration: 25s;
          animation-delay: -5s;
          opacity: 0.2;
          filter: blur(100px);
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.5) 50%, 
            rgba(255, 255, 255, 0) 100%);
        }
        
        .icelandic-beam:nth-child(3) {
          animation-duration: 30s;
          animation-delay: -10s;
          opacity: 0.2;
          filter: blur(120px);
          background: linear-gradient(90deg, 
            rgba(220, 30, 40, 0) 0%, 
            rgba(220, 30, 40, 0.5) 50%, 
            rgba(220, 30, 40, 0) 100%);
        }
        
        @keyframes icelandic-flow {
          0% {
            transform: translateX(-70%) translateY(-20%) rotate(-10deg);
            width: 100%;
            height: 20%;
          }
          50% {
            transform: translateX(0%) translateY(-40%) rotate(15deg);
            width: 150%;
            height: 30%;
          }
          100% {
            transform: translateX(70%) translateY(-20%) rotate(-5deg);
            width: 100%;
            height: 25%;
          }
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </>
  )
}

function IcelandicFlagEffect() {
  return (
    <>
      <div className="icelandic-beam" />
      <div className="icelandic-beam" />
      <div className="icelandic-beam" />
    </>
  )
}

function WhaleBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 dark:opacity-10 floating">
        <Image src="/images/whale-illustration.png" alt="Whale illustration" fill className="object-contain" />
      </div>
    </div>
  )
}

function PuffinBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950" />
      <div
        className="absolute top-10 left-10 w-1/3 h-1/3 opacity-20 dark:opacity-10 floating"
        style={{ animationDelay: "-2s" }}
      >
        <Image src="/images/puffin-illustration.png" alt="Puffin illustration" fill className="object-contain" />
      </div>
    </div>
  )
}

function getBackgroundClasses(theme: BackgroundTheme, animated: boolean): string {
  switch (theme) {
    case "icelandic":
      return `bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950 ${
        animated ? "transition-colors duration-5000" : ""
      }`
    case "glacier":
      return "bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-blue-950 dark:via-blue-900 dark:to-slate-900"
    case "volcanic":
      return "bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950"
    case "waterfall":
      return "bg-gradient-to-b from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-slate-900"
    case "moss":
      return "bg-gradient-to-b from-green-50 via-green-100 to-white dark:from-green-950 dark:via-green-900 dark:to-slate-900"
    case "whale":
    case "puffin":
      return "" // Background handled by the respective component
    default:
      return "bg-background"
  }
}
