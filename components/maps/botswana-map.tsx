"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { BOTSWANA_DISTRICTS, DISTRICT_RISK_DATA, type District } from "@/lib/data"

type LeafletMap = {
  eachLayer: (fn: (layer: unknown) => void) => void
  removeLayer: (layer: unknown) => void
  fitBounds: (bounds: unknown, options?: { padding?: [number, number] }) => void
  remove: () => void
}

type RiskBand = "critical" | "high" | "medium" | "safe"

interface DistrictFeature {
  district: District
  riskBand: RiskBand
  stockDays: number
  geojson: Record<string, unknown>
}

interface BotswanaMapProps {
  onDistrictClick?: (district: District) => void
  selectedDistrict?: District | null
  className?: string
  showLabels?: boolean
}

const DISTRICT_SEARCH_QUERY: Record<District, string> = {
  Central: "Central District, Botswana",
  Ghanzi: "Ghanzi District, Botswana",
  Kgalagadi: "Kgalagadi District, Botswana",
  Kgatleng: "Kgatleng District, Botswana",
  Kweneng: "Kweneng District, Botswana",
  "North-East": "North-East District, Botswana",
  "North-West": "North-West District, Botswana",
  "South-East": "South-East District, Botswana",
  Southern: "Southern District, Botswana",
}

const RISK_STYLES: Record<RiskBand, { fill: string; label: string }> = {
  critical: { fill: "#7f0000", label: "Critical" },
  high: { fill: "#dc2626", label: "High" },
  medium: { fill: "#f97316", label: "Medium" },
  safe: { fill: "#16a34a", label: "Safe" },
}

const LEAFLET_CSS_ID = "leaflet-css"
const LEAFLET_SCRIPT_ID = "leaflet-script"
const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

function getRiskBand(stockDays: number): RiskBand {
  if (stockDays <= 10) return "critical"
  if (stockDays <= 20) return "high"
  if (stockDays <= 30) return "medium"
  return "safe"
}

async function loadLeaflet() {
  if (typeof window === "undefined") return null

  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const css = document.createElement("link")
    css.id = LEAFLET_CSS_ID
    css.rel = "stylesheet"
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    css.crossOrigin = ""
    document.head.appendChild(css)
  }

  const w = window as Window & {
    L?: any
    __leafletLoader?: Promise<any>
  }

  if (w.L) return w.L
  if (!w.__leafletLoader) {
    w.__leafletLoader = new Promise((resolve, reject) => {
      const existing = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null
      if (existing) {
        existing.addEventListener("load", () => resolve(w.L))
        existing.addEventListener("error", reject)
        return
      }

      const script = document.createElement("script")
      script.id = LEAFLET_SCRIPT_ID
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => resolve(w.L)
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  return w.__leafletLoader
}

async function fetchDistrictBoundary(district: District): Promise<DistrictFeature | null> {
  const riskData = DISTRICT_RISK_DATA[district]
  const search = encodeURIComponent(DISTRICT_SEARCH_QUERY[district])
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&limit=1&q=${search}`

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Accept-Language": "en",
    },
    cache: "force-cache",
  })

  if (!response.ok) return null

  const results = (await response.json()) as Array<{ geojson?: Record<string, unknown> }>
  const geojson = results[0]?.geojson

  if (!geojson) return null

  return {
    district,
    riskBand: getRiskBand(riskData.stockDays),
    stockDays: riskData.stockDays,
    geojson,
  }
}

export function BotswanaMap({ onDistrictClick, selectedDistrict = null, className }: BotswanaMapProps) {
  const mapHostRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const legendItems = useMemo(
    () => [
      { key: "critical", text: "Critical", detail: "≤10 days" },
      { key: "high", text: "High", detail: "11–20 days" },
      { key: "medium", text: "Medium", detail: "21–30 days" },
      { key: "safe", text: "Safe", detail: ">30 days" },
    ] as const,
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function renderMap() {
      if (!mapHostRef.current) return

      setIsLoading(true)
      setLoadError(null)

      try {
        const L = await loadLeaflet()
        if (!L || cancelled || !mapHostRef.current) return

        if (!mapRef.current) {
          const map = L.map(mapHostRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
          })

          L.tileLayer(OSM_TILE_URL, {
            maxZoom: 12,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map)

          mapRef.current = map
        }

        const map = mapRef.current
        if (!map) return

        map.eachLayer((layer: any) => {
          const isTileLayer = typeof layer.getContainer === "function"
          if (!isTileLayer) map.removeLayer(layer)
        })

        const boundaryFeatures = (
          await Promise.all(BOTSWANA_DISTRICTS.map((district) => fetchDistrictBoundary(district)))
        ).filter((feature): feature is DistrictFeature => feature !== null)

        const group = L.featureGroup()

        boundaryFeatures.forEach((feature) => {
          const style = RISK_STYLES[feature.riskBand]
          const isSelected = selectedDistrict === feature.district

          const layer = L.geoJSON(feature.geojson, {
            style: {
              color: isSelected ? "#111827" : "#ffffff",
              weight: isSelected ? 3 : 1.4,
              fillColor: style.fill,
              fillOpacity: isSelected ? 0.82 : 0.7,
            },
          })

          layer.eachLayer((geoLayer: any) => {
            geoLayer.bindTooltip(
              `<div style=\"font-weight:600\">${feature.district}</div><div>Risk: ${style.label}</div>`,
              {
                sticky: true,
                direction: "top",
                opacity: 0.95,
              },
            )

            geoLayer.on("click", () => onDistrictClick?.(feature.district))
            geoLayer.on("mouseover", () => geoLayer.setStyle({ fillOpacity: 0.9 }))
            geoLayer.on("mouseout", () => geoLayer.setStyle({ fillOpacity: isSelected ? 0.82 : 0.7 }))
          })

          layer.addTo(group)
        })

        group.addTo(map)

        if (boundaryFeatures.length > 0) {
          map.fitBounds(group.getBounds(), { padding: [18, 18] })
        }

        setIsLoading(false)
      } catch {
        if (!cancelled) {
          setLoadError("Unable to load district boundaries from OpenStreetMap.")
          setIsLoading(false)
        }
      }
    }

    renderMap()

    return () => {
      cancelled = true
    }
  }, [onDistrictClick, selectedDistrict])

  useEffect(() => {
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg border bg-background", className)}>
      <div className="h-[420px] w-full md:h-[480px]" ref={mapHostRef} aria-label="Botswana district risk map" />

      <div className="pointer-events-none absolute right-3 top-3 rounded-md border bg-background/95 p-3 shadow-sm backdrop-blur">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk legend</p>
        <div className="space-y-1.5 text-xs">
          {legendItems.map((item) => (
            <div className="flex items-center gap-2" key={item.key}>
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RISK_STYLES[item.key].fill }} />
              <span className="text-foreground">{item.text}</span>
              <span className="text-muted-foreground">({item.detail})</span>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 grid place-items-center bg-background/65 text-sm text-muted-foreground">Loading map…</div>
      )}

      {loadError && (
        <div className="absolute bottom-3 left-3 right-3 rounded-md border border-destructive/35 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {loadError}
        </div>
      )}
    </div>
  )
}
