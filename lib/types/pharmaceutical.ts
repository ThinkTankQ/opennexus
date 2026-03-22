// Medicine-related types
export interface Medicine {
  id: string
  nappi_code: string | null
  medicine_name: string
  generic_name: string | null
  strength: string | null
  form: string | null
  manufacturer: string | null
  atc_code: string | null
  description: string | null
  ddd_value: number | null
  ddd_unit: string | null
  is_essential_medicine: boolean
  storage_requirements: string | null
  shelf_life_months: number | null
  created_at: string
  updated_at: string
}

export interface ATCCode {
  id: string
  code: string
  level: string
  description: string
  created_at: string
}

// Pricing-related types
export interface MedicinePricing {
  id: string
  medicine_id: string
  supplier_id: string | null
  unit_price: number
  currency: string
  pack_size: number
  unit_in_pack: string | null
  lead_time_days: number | null
  minimum_order_quantity: number
  price_date: string
  effective_from: string | null
  effective_until: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PriceHistory {
  id: string
  medicine_id: string
  old_price: number | null
  new_price: number
  price_change_percentage: number | null
  change_reason: string | null
  changed_by: string | null
  changed_at: string
}

// Facility and Stock-related types
export interface Facility {
  id: string
  facility_name: string
  facility_type: string | null
  district: string | null
  region: string | null
  is_active: boolean
  contact_phone: string | null
  manager_name: string | null
  created_at: string
  updated_at: string
}

export interface FacilityStock {
  id: string
  facility_id: string
  medicine_id: string
  quantity_on_hand: number
  unit_of_measure: string | null
  reorder_level: number | null
  maximum_stock_level: number | null
  last_received_date: string | null
  last_counted_date: string | null
  expiry_date: string | null
  batch_number: string | null
  storage_location: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type StockStatus = 'OK' | 'LOW_STOCK' | 'STOCKOUT' | 'EXPIRED' | 'EXPIRY_SOON'

export interface FacilityStockStatus extends FacilityStock {
  stock_status: StockStatus
  medicine_name?: string
  form?: string
  strength?: string
}

// Alert-related types
export type AlertType = 'LOW_STOCK' | 'STOCKOUT' | 'EXPIRED' | 'EXPIRY_SOON' | 'OVERSTOCKED'
export type AlertStatus = 'OPEN' | 'RESOLVED'

export interface StockAlert {
  id: string
  facility_id: string
  medicine_id: string
  alert_type: AlertType
  alert_status: AlertStatus
  current_stock_level: number | null
  reorder_level: number | null
  expiry_date: string | null
  days_until_expiry: number | null
  alert_message: string | null
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

// Movement and Shipment-related types
export type MovementType = 'RECEIVED' | 'ISSUED' | 'ADJUSTED' | 'TRANSFERRED' | 'LOST' | 'DAMAGED'

export interface StockMovement {
  id: string
  facility_id: string
  medicine_id: string
  movement_type: MovementType
  quantity: number
  unit_of_measure: string | null
  reference_number: string | null
  movement_date: string
  from_facility_id: string | null
  to_facility_id: string | null
  notes: string | null
  created_by: string | null
  created_at: string
}

export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

export interface Shipment {
  id: string
  supplier_id: string | null
  facility_id: string
  shipment_date: string
  expected_delivery_date: string | null
  actual_delivery_date: string | null
  status: ShipmentStatus
  total_items: number | null
  total_cost: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ShipmentItem {
  id: string
  shipment_id: string
  medicine_id: string
  quantity_ordered: number
  quantity_received: number | null
  unit_price: number | null
  line_total: number | null
  batch_number: string | null
  expiry_date: string | null
  received_at: string | null
}

// Dispensing Log
export interface DispensingLog {
  id: string
  facility_id: string
  medicine_id: string
  quantity_dispensed: number
  unit_of_measure: string | null
  dispensed_date: string
  dispensed_by: string | null
  patient_age_group: string | null
  diagnosis: string | null
  prescription_id: string | null
  notes: string | null
  created_at: string
}

// Supplier
export interface Supplier {
  id: string
  supplier_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Analytics-related types
export interface ConsumptionTrend {
  medicine_id: string
  medicine_name: string
  quantity_dispensed: number
  average_daily_consumption: number
  days_of_stock: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface StockStatusDistribution {
  ok: number
  low_stock: number
  stockout: number
  expired: number
  expiry_soon: number
}

export interface PriceAnalysis {
  medicine_id: string
  medicine_name: string
  average_price: number
  min_price: number
  max_price: number
  price_change_percentage: number
  last_price_change: string | null
}

export interface FacilityRisk {
  facility_id: string
  facility_name: string
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  risk_score: number
  critical_medicines: string[]
  reason: string
}

export interface AnalyticsData {
  consumption_trends: ConsumptionTrend[]
  stock_status_distribution: StockStatusDistribution
  price_analysis: PriceAnalysis[]
  top_medicines: Medicine[]
  facility_risks: FacilityRisk[]
  generated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error: string | null
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
