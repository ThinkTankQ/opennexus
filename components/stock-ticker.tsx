"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  TrendingDown,
  Package,
  Truck,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  MEDICINE_STOCK_DATA, 
  DISTRICT_RISK_DATA,
  SHIPMENT_DATA,
  type RiskLevel 
} from "@/lib/data"

// Status chip component
function StatusChip({ 
  status, 
  label, 
  count 
}: { 
  status: RiskLevel | "in-transit"
  label: string 
  count: number 
}) {
  const styles = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    good: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "in-transit": "bg-blue-100 text-blue-800 border-blue-200",
  }
  
  const icons = {
    critical: AlertCircle,
    warning: AlertTriangle,
    good: CheckCircle,
    "in-transit": Truck,
  }
  
  const Icon = icons[status]
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium",
      styles[status]
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{count}</span>
      <span className="text-xs opacity-75">{label}</span>
    </div>
  )
}

// Individual ticker item
function TickerItem({ 
  icon: Icon, 
  message, 
  severity,
  href,
}: { 
  icon: React.ElementType
  message: string
  severity: RiskLevel
  href?: string
}) {
  const severityStyles = {
    critical: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100",
    warning: "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100",
    good: "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  }
  
  const content = (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-colors cursor-pointer",
      severityStyles[severity]
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  )
  
  if (href) {
    return <Link href={href}>{content}</Link>
  }
  
  return content
}

export function StockTicker() {
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Calculate national counts
  const stockCounts = {
    good: MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "good").length,
    warning: MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "warning").length,
    critical: MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "critical").length,
  }
  
  const districtCounts = {
    good: Object.values(DISTRICT_RISK_DATA).filter(d => d.riskLevel === "good").length,
    warning: Object.values(DISTRICT_RISK_DATA).filter(d => d.riskLevel === "warning").length,
    critical: Object.values(DISTRICT_RISK_DATA).filter(d => d.riskLevel === "critical").length,
  }
  
  const inTransitCount = SHIPMENT_DATA.filter(s => s.status === "in-transit").length
  
  // Generate insight messages
  const insights: { icon: React.ElementType; message: string; severity: RiskLevel; href?: string }[] = []
  
  // Critical medicine alerts
  MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "critical").forEach(med => {
    insights.push({
      icon: AlertCircle,
      message: `${med.name}: Only ${med.daysOfStock} days stock remaining`,
      severity: "critical",
      href: "/dashboard/cms",
    })
  })
  
  // Warning medicine alerts
  MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "warning").forEach(med => {
    insights.push({
      icon: AlertTriangle,
      message: `${med.name}: ${med.daysOfStock} days stock - monitor closely`,
      severity: "warning",
      href: "/dashboard/cms",
    })
  })
  
  // District alerts
  Object.entries(DISTRICT_RISK_DATA).forEach(([district, data]) => {
    if (data.riskLevel === "critical") {
      insights.push({
        icon: TrendingDown,
        message: `${district} District: Critical stock levels (${data.stockDays} days)`,
        severity: "critical",
        href: "/dashboard/cms",
      })
    }
  })
  
  // In-transit shipments
  SHIPMENT_DATA.filter(s => s.status === "in-transit").forEach(shipment => {
    insights.push({
      icon: Truck,
      message: `Shipment to ${shipment.destination}: ${shipment.medicines.join(", ")} arriving ${shipment.estimatedArrival}`,
      severity: "good",
      href: "/dashboard/logistics",
    })
  })
  
  // Delayed shipments
  SHIPMENT_DATA.filter(s => s.status === "delayed").forEach(shipment => {
    insights.push({
      icon: Clock,
      message: `Delayed: Shipment to ${shipment.destination} - ${shipment.medicines.join(", ")}`,
      severity: "warning",
      href: "/dashboard/logistics",
    })
  })
  
  // Good stock messages
  const goodMedicines = MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "good" && m.daysOfStock > 60)
  if (goodMedicines.length > 0) {
    insights.push({
      icon: CheckCircle,
      message: `${goodMedicines.length} medicines with 60+ days stock - healthy supply`,
      severity: "good",
      href: "/dashboard/cms",
    })
  }
  
  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    const content = contentRef.current
    if (!scrollContainer || !content) return
    
    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame
    
    const animate = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed
        
        // Reset when first set of items is fully scrolled
        const contentWidth = content.scrollWidth / 2
        if (scrollPosition >= contentWidth) {
          scrollPosition = 0
        }
        
        scrollContainer.scrollLeft = scrollPosition
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationId)
  }, [isPaused])
  
  return (
    <div className="w-full bg-card border-t border-b">
      {/* Summary bar */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">National Stock Overview</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip status="good" label="Good" count={stockCounts.good} />
              <StatusChip status="warning" label="Warning" count={stockCounts.warning} />
              <StatusChip status="critical" label="Critical" count={stockCounts.critical} />
              <div className="h-4 w-px bg-border mx-1" />
              <StatusChip status="in-transit" label="Shipments" count={inTransitCount} />
            </div>
            
            <Link href="/dashboard/cms" className="text-sm text-primary hover:underline font-medium">
              View Details
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scrolling ticker */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="marquee"
        aria-label="Stock insights ticker"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className="overflow-x-hidden py-3"
        >
          <div 
            ref={contentRef}
            className="inline-flex items-center gap-4 px-4"
          >
            {/* Duplicate content for seamless loop */}
            {[...insights, ...insights].map((insight, index) => (
              <TickerItem
                key={index}
                icon={insight.icon}
                message={insight.message}
                severity={insight.severity}
                href={insight.href}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-full right-4 mb-1">
          <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded shadow-sm border">
            Paused
          </span>
        </div>
      )}
    </div>
  )
}

// Compact version for dashboard headers
export function StockTickerCompact() {
  const criticalCount = MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "critical").length
  const warningCount = MEDICINE_STOCK_DATA.filter(m => m.riskLevel === "warning").length
  
  const criticalMedicine = MEDICINE_STOCK_DATA.find(m => m.riskLevel === "critical")
  
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <StatusChip status="critical" label="Critical" count={criticalCount} />
        <StatusChip status="warning" label="Warning" count={warningCount} />
      </div>
      
      {criticalMedicine && (
        <div className="hidden md:flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{criticalMedicine.name}: {criticalMedicine.daysOfStock} days remaining</span>
        </div>
      )}
    </div>
  )
}
