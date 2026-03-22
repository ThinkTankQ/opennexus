"use client"

import { Clock, AlertTriangle, ArrowRight, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MEDICINE_EXPIRY_ALERTS, type MedicineExpiryAlert } from "@/lib/data"

interface ExpiryAlertsProps {
  maxItems?: number
  compact?: boolean
  showHeader?: boolean
}

export function ExpiryAlerts({ maxItems = 5, compact = false, showHeader = true }: ExpiryAlertsProps) {
  const alerts = MEDICINE_EXPIRY_ALERTS.slice(0, maxItems)
  const criticalCount = alerts.filter(a => a.severity === "critical").length

  const getExpiryProgress = (daysUntilExpiry: number) => {
    // 90 days is considered safe, 0 is expired
    return Math.max(0, Math.min(100, (daysUntilExpiry / 90) * 100))
  }

  const getActionLabel = (action: MedicineExpiryAlert["action"]) => {
    switch (action) {
      case "dispose": return "Schedule Disposal"
      case "redistribute": return "Redistribute Stock"
      case "prioritize": return "Prioritize Dispensing"
    }
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              alert.severity === "critical"
                ? "bg-destructive/5 border-destructive/30"
                : "bg-accent/5 border-accent/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className={`h-4 w-4 ${
                alert.severity === "critical" ? "text-destructive" : "text-accent-foreground"
              }`} />
              <div>
                <p className="text-sm font-medium">{alert.medicineName}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.quantity.toLocaleString()} units - {alert.facilityName}
                </p>
              </div>
            </div>
            <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
              {alert.daysUntilExpiry}d
            </Badge>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Expiring Medicines</CardTitle>
            </div>
            {criticalCount > 0 && (
              <Badge variant="destructive">
                {criticalCount} Critical
              </Badge>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "" : "pt-6"}>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.severity === "critical"
                  ? "bg-destructive/5 border-destructive/30"
                  : "bg-accent/5 border-accent/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{alert.medicineName}</h4>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                      {alert.daysUntilExpiry} days
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Batch: {alert.batchNumber} | {alert.quantity.toLocaleString()} units
                  </p>
                </div>
                <AlertTriangle className={`h-5 w-5 ${
                  alert.severity === "critical" ? "text-destructive" : "text-accent-foreground"
                }`} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium">{alert.expiryDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{alert.facilityName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">District</span>
                  <span>{alert.district}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span>{alert.daysUntilExpiry} / 90 days</span>
                </div>
                <Progress 
                  value={getExpiryProgress(alert.daysUntilExpiry)} 
                  className={`h-2 ${
                    alert.severity === "critical" ? "[&>div]:bg-destructive" : "[&>div]:bg-accent"
                  }`}
                />
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
              >
                {getActionLabel(alert.action)}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Summary card for quick overview
export function ExpirySummaryCard() {
  const criticalCount = MEDICINE_EXPIRY_ALERTS.filter(a => a.daysUntilExpiry <= 30).length
  const warningCount = MEDICINE_EXPIRY_ALERTS.filter(a => a.daysUntilExpiry > 30 && a.daysUntilExpiry <= 60).length
  const totalQuantity = MEDICINE_EXPIRY_ALERTS.reduce((sum, a) => sum + a.quantity, 0)

  return (
    <Card className="bg-accent/5 border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Clock className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{MEDICINE_EXPIRY_ALERTS.length}</p>
            <p className="text-sm text-muted-foreground">
              Items expiring soon ({totalQuantity.toLocaleString()} units)
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-sm">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm">{warningCount} Warning</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
