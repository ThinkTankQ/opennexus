"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "./splash-screen"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if splash was already shown in this session
    const hasShownSplash = sessionStorage.getItem("medsight_splash_shown")
    if (hasShownSplash) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem("medsight_splash_shown", "true")
  }

  // Server-side render without splash
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={2500} />}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
    </>
  )
}
