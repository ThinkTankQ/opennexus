'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'

interface StockAlertCardProps {
  medicineName: string
  alertType: 'LOW_STOCK' | 'STOCKOUT' | 'EXPIRED' | 'EXPIRY_SOON' | 'OVERSTOCKED'
  currentStock?: number
  reorderLevel?: number
  daysUntilExpiry?: number
  facilityName?: string
}

export function StockAlertCard({
  medicineName,
  alertType,
  currentStock,
  reorderLevel,
  daysUntilExpiry,
  facilityName,
}: StockAlertCardProps) {
  const alertConfig = {
    LOW_STOCK: { icon: TrendingDown, label: 'Low Stock', color: 'bg-orange-50 border-orange-200' },
    STOCKOUT: { icon: AlertTriangle, label: 'Stockout', color: 'bg-red-50 border-red-200' },
    EXPIRED: { icon: Clock, label: 'Expired', color: 'bg-red-50 border-red-200' },
    EXPIRY_SOON: { icon: Clock, label: 'Expiry Soon', color: 'bg-amber-50 border-amber-200' },
    OVERSTOCKED: { icon: TrendingDown, label: 'Overstocked', color: 'bg-blue-50 border-blue-200' },
  }

  const config = alertConfig[alertType]
  const Icon = config.icon

  return (
    <Card className={`${config.color}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{medicineName}</div>
            {facilityName && <div className="text-xs text-muted-foreground">{facilityName}</div>}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              {currentStock !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Stock: {currentStock} units
                </Badge>
              )}
              {reorderLevel !== undefined && currentStock !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Reorder: {reorderLevel} units
                </Badge>
              )}
              {daysUntilExpiry !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {daysUntilExpiry} days
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
