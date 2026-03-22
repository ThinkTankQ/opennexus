import { z } from 'zod'

// Medicine validation
export const MedicineSchema = z.object({
  nappi_code: z.string().optional().nullable(),
  medicine_name: z.string().min(1, 'Medicine name is required'),
  generic_name: z.string().optional().nullable(),
  strength: z.string().optional().nullable(),
  form: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  atc_code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_essential_medicine: z.boolean().default(false),
})

export type MedicineInput = z.infer<typeof MedicineSchema>

// Facility validation
export const FacilitySchema = z.object({
  facility_name: z.string().min(1, 'Facility name is required'),
  facility_type: z.enum(['Hospital', 'Health Centre', 'Clinic', 'Dispensary']).optional(),
  district: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  manager_name: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type FacilityInput = z.infer<typeof FacilitySchema>

// Stock validation
export const FacilityStockSchema = z.object({
  facility_id: z.string().uuid('Invalid facility ID'),
  medicine_id: z.string().uuid('Invalid medicine ID'),
  quantity_on_hand: z.number().int().min(0, 'Quantity cannot be negative'),
  reorder_level: z.number().int().min(0).optional().nullable(),
  maximum_stock_level: z.number().int().min(0).optional().nullable(),
  expiry_date: z.string().datetime().optional().nullable(),
  batch_number: z.string().optional().nullable(),
  storage_location: z.string().optional().nullable(),
})

export type FacilityStockInput = z.infer<typeof FacilityStockSchema>

// Pricing validation
export const MedicinePricingSchema = z.object({
  medicine_id: z.string().uuid('Invalid medicine ID'),
  supplier_id: z.string().uuid('Invalid supplier ID').optional().nullable(),
  unit_price: z.number().positive('Unit price must be greater than 0'),
  pack_size: z.number().int().positive('Pack size must be greater than 0'),
  currency: z.string().length(3).default('BWP'),
  lead_time_days: z.number().int().positive().optional().nullable(),
  minimum_order_quantity: z.number().int().positive().default(1),
})

export type MedicinePricingInput = z.infer<typeof MedicinePricingSchema>

// Alert validation
export const StockAlertSchema = z.object({
  facility_id: z.string().uuid('Invalid facility ID'),
  medicine_id: z.string().uuid('Invalid medicine ID'),
  alert_type: z.enum(['LOW_STOCK', 'STOCKOUT', 'EXPIRED', 'EXPIRY_SOON', 'OVERSTOCKED']),
  alert_status: z.enum(['OPEN', 'RESOLVED']).default('OPEN'),
  alert_message: z.string().optional().nullable(),
})

export type StockAlertInput = z.infer<typeof StockAlertSchema>

// Dispensing log validation
export const DispensingLogSchema = z.object({
  facility_id: z.string().uuid('Invalid facility ID'),
  medicine_id: z.string().uuid('Invalid medicine ID'),
  quantity_dispensed: z.number().int().positive('Quantity must be greater than 0'),
  dispensed_date: z.string().date('Invalid date format'),
  dispensed_by: z.string().optional().nullable(),
  patient_age_group: z.enum(['0-5', '5-18', '18-65', '65+']).optional().nullable(),
  diagnosis: z.string().optional().nullable(),
})

export type DispensingLogInput = z.infer<typeof DispensingLogSchema>

// Supplier validation
export const SupplierSchema = z.object({
  supplier_name: z.string().min(1, 'Supplier name is required'),
  contact_person: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type SupplierInput = z.infer<typeof SupplierSchema>

// Stock movement validation
export const StockMovementSchema = z.object({
  facility_id: z.string().uuid('Invalid facility ID'),
  medicine_id: z.string().uuid('Invalid medicine ID'),
  movement_type: z.enum(['RECEIVED', 'ISSUED', 'ADJUSTED', 'TRANSFERRED', 'LOST', 'DAMAGED']),
  quantity: z.number().int(),
  movement_date: z.string().date('Invalid date format'),
  reference_number: z.string().optional().nullable(),
  from_facility_id: z.string().uuid().optional().nullable(),
  to_facility_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type StockMovementInput = z.infer<typeof StockMovementSchema>

// Search query validation
export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query required'),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
  filters: z.record(z.string()).optional(),
})

export type SearchQuery = z.infer<typeof SearchQuerySchema>

// Batch import validation
export const BatchMedicineImportSchema = z.object({
  medicines: z.array(MedicineSchema).min(1, 'At least one medicine required'),
})

export type BatchMedicineImport = z.infer<typeof BatchMedicineImportSchema>
