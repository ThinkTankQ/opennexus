/**
 * Pharmacy and Inventory Utility Functions
 */

export interface MedicineInventory {
  quantity_on_hand: number;
  reorder_level: number;
  maximum_stock_level: number;
  unit_of_measure: string;
}

export interface ConsumptionData {
  dispensed_quantity: number;
  dispensed_date: Date;
}

/**
 * Calculate days of stock remaining
 */
export function calculateDaysOfStock(
  quantityOnHand: number,
  dailyConsumption: number
): number {
  if (dailyConsumption === 0) return Infinity;
  return Math.round(quantityOnHand / dailyConsumption);
}

/**
 * Calculate average daily consumption from dispensing logs
 */
export function calculateAverageDailyConsumption(
  dispensingLogs: ConsumptionData[],
  daysToAnalyze: number = 30
): number {
  if (dispensingLogs.length === 0) return 0;

  const totalQuantity = dispensingLogs.reduce(
    (sum, log) => sum + log.dispensed_quantity,
    0
  );

  return totalQuantity / daysToAnalyze;
}

/**
 * Determine stock status
 */
export function getStockStatus(
  quantityOnHand: number,
  reorderLevel: number,
  maximumLevel: number
): 'STOCKOUT' | 'LOW_STOCK' | 'ADEQUATE' | 'OVERSTOCKED' {
  if (quantityOnHand === 0) return 'STOCKOUT';
  if (quantityOnHand <= reorderLevel) return 'LOW_STOCK';
  if (quantityOnHand > maximumLevel) return 'OVERSTOCKED';
  return 'ADEQUATE';
}

/**
 * Calculate risk score for stock management
 */
export function calculateRiskScore(
  stockStatus: string,
  daysOfStock: number,
  expiryDaysRemaining: number
): number {
  let score = 0;

  // Stock status scoring (0-40 points)
  switch (stockStatus) {
    case 'STOCKOUT':
      score += 40;
      break;
    case 'LOW_STOCK':
      score += 25;
      break;
    case 'OVERSTOCKED':
      score += 10;
      break;
    default:
      score += 0;
  }

  // Days of stock scoring (0-35 points)
  if (daysOfStock < 7) score += 35;
  else if (daysOfStock < 14) score += 25;
  else if (daysOfStock < 30) score += 15;
  else if (daysOfStock > 90) score += 10;

  // Expiry risk scoring (0-25 points)
  if (expiryDaysRemaining < 0) score += 25; // Already expired
  else if (expiryDaysRemaining < 30) score += 20; // Expiring soon
  else if (expiryDaysRemaining < 60) score += 10;

  return Math.min(score, 100);
}

/**
 * Format days of stock for display
 */
export function formatDaysOfStock(days: number): string {
  if (!isFinite(days)) return 'N/A';
  if (days < 1) return '< 1 day';
  if (days === 1) return '1 day';
  return `${Math.round(days)} days`;
}

/**
 * Calculate reorder quantity based on consumption and lead time
 */
export function calculateReorderQuantity(
  averageDailyConsumption: number,
  leadTimeDays: number,
  maximumStockLevel: number,
  currentQuantity: number
): number {
  const safetyStock = averageDailyConsumption * 14; // 2 weeks safety
  const reorderPoint = averageDailyConsumption * leadTimeDays + safetyStock;
  const reorderQuantity = maximumStockLevel - currentQuantity;

  return Math.max(0, Math.round(reorderQuantity));
}

/**
 * Generate price trend analysis
 */
export interface PriceData {
  price: number;
  date: Date;
}

export function calculatePriceTrend(priceHistory: PriceData[]): {
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
  averagePrice: number;
} {
  if (priceHistory.length < 2) {
    return { trend: 'stable', percentageChange: 0, averagePrice: 0 };
  }

  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const oldestPrice = sortedHistory[0].price;
  const latestPrice = sortedHistory[sortedHistory.length - 1].price;
  const averagePrice =
    sortedHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length;

  const percentageChange =
    oldestPrice === 0
      ? 0
      : ((latestPrice - oldestPrice) / oldestPrice) * 100;

  const trend: 'up' | 'down' | 'stable' =
    Math.abs(percentageChange) < 5
      ? 'stable'
      : percentageChange > 0
        ? 'up'
        : 'down';

  return { trend, percentageChange: Math.round(percentageChange * 100) / 100, averagePrice };
}

/**
 * Identify critical medicines (essential and low stock)
 */
export function isCriticalMedicine(
  isEssentialMedicine: boolean,
  quantityOnHand: number,
  reorderLevel: number
): boolean {
  return isEssentialMedicine && quantityOnHand <= reorderLevel;
}
