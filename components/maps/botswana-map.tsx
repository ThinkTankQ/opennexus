"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { DISTRICT_RISK_DATA, type District, type RiskLevel } from "@/lib/data"
import { BOTSWANA_GEOJSON, DISTRICT_CENTERS, BOTSWANA_CENTER, BOTSWANA_BOUNDS } from "@/lib/botswana-geojson"
import dynamic from "next/dynamic"

// Risk level color mapping
const RISK_COLORS: Record<RiskLevel, { fill: string; label: string }> = {
  critical: { fill: "#dc2626", label: "Critical" },  // Dark red
  warning: { fill: "#f97316", label: "Medium Risk" }, // Orange
  good: { fill: "#22c55e", label: "Safe" },           // Green
}

interface BotswanaMapProps {
  onDistrictClick?: (district: District) => void
  selectedDistrict?: District | null
  className?: string
  showLabels?: boolean
  compact?: boolean
}

// The actual map component that uses Leaflet
function BotswanaMapInner({ 
  onDistrictClick, 
  selectedDistrict = null,
  className,
  showLabels = true,
  compact = false
}: BotswanaMapProps) {
  const [MapContainer, setMapContainer] = useState<any>(null)
  const [TileLayer, setTileLayer] = useState<any>(null)
  const [GeoJSON, setGeoJSON] = useState<any>(null)
  const [Tooltip, setTooltip] = useState<any>(null)
  const [Marker, setMarker] = useState<any>(null)
  const [DivIcon, setDivIcon] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null)

  // Load react-leaflet components dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import("leaflet")
      const RL = await import("react-leaflet")
      await import("leaflet/dist/leaflet.css")
      
      setMapContainer(() => RL.MapContainer)
      setTileLayer(() => RL.TileLayer)
      setGeoJSON(() => RL.GeoJSON)
      setTooltip(() => RL.Tooltip)
      setMarker(() => RL.Marker)
      setDivIcon(() => L.divIcon)
      setIsLoaded(true)
    }
    loadLeaflet()
  }, [])

  // Style function for districts
  const getStyle = useCallback((feature: any) => {
    const district = feature.properties?.name as District
    const riskData = DISTRICT_RISK_DATA[district]
    const riskLevel = riskData?.riskLevel || "good"
    const isSelected = selectedDistrict === district
    const isHovered = hoveredDistrict === district
    
    return {
      fillColor: RISK_COLORS[riskLevel].fill,
      fillOpacity: isSelected ? 0.85 : isHovered ? 0.8 : 0.65,
      color: isSelected ? "#1e293b" : isHovered ? "#334155" : "#64748b",
      weight: isSelected ? 3 : isHovered ? 2.5 : 1.5,
      opacity: 1
    }
  }, [selectedDistrict, hoveredDistrict])

  // Event handlers for each feature
  const onEachFeature = useCallback((feature: any, layer: any) => {
    const district = feature.properties?.name as District
    const riskData = DISTRICT_RISK_DATA[district]
    
    layer.on({
      mouseover: (e: any) => {
        setHoveredDistrict(district)
        const l = e.target
        l.setStyle({
          fillOpacity: 0.85,
          weight: 2.5,
          color: "#334155"
        })
        l.bringToFront()
      },
      mouseout: (e: any) => {
        setHoveredDistrict(null)
        const l = e.target
        l.setStyle(getStyle(feature))
      },
      click: () => {
        onDistrictClick?.(district)
      }
    })

    // Bind tooltip
    const tooltipContent = `
      <div class="min-w-[180px]">
        <div class="font-semibold text-sm mb-2 pb-2 border-b border-gray-200">${district} District</div>
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Stock Days:</span>
            <span class="font-medium">${riskData?.stockDays || 0} days</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Facilities:</span>
            <span class="font-medium">${riskData?.facilitiesReporting || 0}/${riskData?.totalFacilities || 0}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Risk Level:</span>
            <span class="font-semibold px-2 py-0.5 rounded text-white text-[10px]" 
                  style="background-color: ${RISK_COLORS[riskData?.riskLevel || 'good'].fill}">
              ${RISK_COLORS[riskData?.riskLevel || 'good'].label.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    `
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: "leaflet-tooltip-custom",
      direction: "top",
      offset: [0, -10]
    })
  }, [onDistrictClick, getStyle])

  // GeoJSON key to force re-render when style changes
  const geoJsonKey = useMemo(() => 
    `${selectedDistrict}-${hoveredDistrict}`, 
    [selectedDistrict, hoveredDistrict]
  )

  if (!isLoaded || !MapContainer) {
    return (
      <div className={cn(
        "w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center",
        compact ? "h-[280px]" : "h-[400px] md:h-[500px]",
        className
      )}>
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Map Container */}
      <div className={cn(
        "w-full rounded-lg overflow-hidden",
        compact ? "h-[280px]" : "h-[400px] md:h-[500px]"
      )}>
        <MapContainer
          center={BOTSWANA_CENTER}
          zoom={compact ? 5.5 : 6}
          zoomControl={!compact}
          scrollWheelZoom={!compact}
          dragging={!compact}
          doubleClickZoom={!compact}
          attributionControl={false}
          maxBounds={BOTSWANA_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%", background: "#f1f5f9" }}
        >
          {/* OpenStreetMap Tile Layer - Clean, minimal style */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            maxZoom={10}
            minZoom={5}
          />
          
          {/* District Polygons */}
          <GeoJSON
            key={geoJsonKey}
            data={BOTSWANA_GEOJSON}
            style={getStyle}
            onEachFeature={onEachFeature}
          />

          {/* District Labels */}
          {showLabels && Object.entries(DISTRICT_CENTERS).map(([district, coords]) => {
            const label = compact 
              ? district.substring(0, 3).toUpperCase()
              : district === "South-East" ? "S-East" 
              : district === "North-East" ? "N-East"
              : district === "North-West" ? "N-West"
              : district

            return (
              <Marker
                key={district}
                position={coords}
                icon={DivIcon({
                  className: "district-label",
                  html: `<div class="text-[10px] md:text-xs font-semibold text-slate-700 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] pointer-events-none">${label}</div>`,
                  iconSize: [80, 20],
                  iconAnchor: [40, 10]
                })}
              />
            )
          })}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className={cn(
        "absolute bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 z-[1000]",
        compact ? "bottom-2 left-2 p-2" : "bottom-4 left-4 p-3"
      )}>
        <p className={cn(
          "font-semibold text-slate-600 mb-2",
          compact ? "text-[10px]" : "text-xs"
        )}>Stock Risk Level</p>
        <div className={cn("space-y-1.5", compact && "space-y-1")}>
          <div className="flex items-center gap-2">
            <div 
              className={cn("rounded", compact ? "w-3 h-3" : "w-4 h-4")} 
              style={{ backgroundColor: RISK_COLORS.good.fill }} 
            />
            <span className={cn("text-slate-600", compact ? "text-[10px]" : "text-xs")}>
              Safe (30+ days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className={cn("rounded", compact ? "w-3 h-3" : "w-4 h-4")} 
              style={{ backgroundColor: RISK_COLORS.warning.fill }} 
            />
            <span className={cn("text-slate-600", compact ? "text-[10px]" : "text-xs")}>
              Medium Risk (15-30 days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className={cn("rounded", compact ? "w-3 h-3" : "w-4 h-4")} 
              style={{ backgroundColor: RISK_COLORS.critical.fill }} 
            />
            <span className={cn("text-slate-600", compact ? "text-[10px]" : "text-xs")}>
              Critical ({'<'}15 days)
            </span>
          </div>
        </div>
      </div>

      {/* Hovered District Info Panel */}
      {hoveredDistrict && !compact && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 z-[1000] min-w-[160px]">
          <p className="font-semibold text-sm text-slate-800">{hoveredDistrict}</p>
          <p className="text-xs text-slate-500">District</p>
        </div>
      )}

      {/* OpenStreetMap Attribution */}
      <div className={cn(
        "absolute text-slate-400 z-[1000]",
        compact ? "bottom-2 right-2 text-[8px]" : "bottom-4 right-4 text-[10px]"
      )}>
        <a 
          href="https://www.openstreetmap.org/copyright" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-slate-600"
        >
          © OpenStreetMap
        </a>
      </div>

      {/* Custom Leaflet Styles */}
      <style jsx global>{`
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08);
          padding: 12px;
        }
        .leaflet-tooltip-custom::before {
          display: none;
        }
        .district-label {
          background: transparent !important;
          border: none !important;
          text-align: center;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px -2px rgb(0 0 0 / 0.15) !important;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #475569 !important;
          border: 1px solid #e2e8f0 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f8fafc !important;
          color: #1e293b !important;
        }
      `}</style>
    </div>
  )
}

// Export with dynamic import to prevent SSR issues
export const BotswanaMap = dynamic(
  () => Promise.resolve(BotswanaMapInner),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    )
  }
)
