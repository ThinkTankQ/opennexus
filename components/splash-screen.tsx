"use client"

import { useEffect, useState } from "react"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface SplashScreenProps {
  onComplete?: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
    }, duration - 500)

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        isFading && "opacity-0"
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Logo and Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping" />
          <div className="relative flex h-24 w-24 items-center justify-center bg-primary rounded-3xl shadow-lg">
            <Activity className="h-12 w-12 text-primary-foreground animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">MedSight Botswana</h1>
          <p className="text-muted-foreground mt-1">Medicine Intelligence Platform</p>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading system...</p>
        </div>

        {/* Government Branding */}
        <div className="absolute -bottom-24 text-center">
          <p className="text-xs text-muted-foreground">Ministry of Health and Wellness</p>
          <p className="text-xs text-muted-foreground">Republic of Botswana</p>
        </div>
      </div>

      {/* Botswana Colors Strip */}
      <div className="absolute bottom-0 left-0 right-0 flex h-2">
        <div className="flex-1 bg-[#75aadb]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#75aadb]" />
      </div>
    </div>
  )
}

export function useSplashScreen(duration = 2000) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if splash was already shown in this session
    const hasShownSplash = sessionStorage.getItem("medsight_splash_shown")
    if (hasShownSplash) {
      setShowSplash(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem("medsight_splash_shown", "true")
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return showSplash
}
