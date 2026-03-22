import { Badge } from '@/components/ui/badge'

interface StockStatusBadgeProps {
  quantity: number
  reorderLevel?: number | null
  expiryDate?: string | null
}

export function StockStatusBadge({ quantity, reorderLevel, expiryDate }: StockStatusBadgeProps) {
  // Check expiry status first
  if (expiryDate) {
    const expiryTime = new Date(expiryDate).getTime()
    const now = new Date().getTime()
    const daysUntilExpiry = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0) {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (daysUntilExpiry <= 30) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Expiry Soon ({daysUntilExpiry}d)</Badge>
    }
  }

  // Check stock level
  if (quantity === 0) {
    return <Badge variant="destructive">Stockout</Badge>
  }

  if (reorderLevel && quantity <= reorderLevel) {
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Low Stock</Badge>
  }

  return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
}
