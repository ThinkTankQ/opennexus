// Botswana Districts
export const BOTSWANA_DISTRICTS = [
  "Central",
  "Ghanzi", 
  "Kgalagadi",
  "Kgatleng",
  "Kweneng",
  "North-East",
  "North-West",
  "South-East",
  "Southern",
] as const

export type District = (typeof BOTSWANA_DISTRICTS)[number]

// Risk levels
export type RiskLevel = "critical" | "warning" | "good"

// Medicine categories
export const MEDICINE_CATEGORIES = {
  tb: ["Rifampicin", "Isoniazid", "Pyrazinamide", "Ethambutol", "Rifampicin/Isoniazid FDC"],
  antimalarial: ["Artemether-Lumefantrine", "Quinine Sulphate", "Artesunate", "Sulfadoxine-Pyrimethamine"],
  chronic: ["Metformin 500mg", "Amlodipine 5mg", "Enalapril 10mg", "Hydrochlorothiazide 25mg", "Atenolol 50mg"],
} as const

export type MedicineCategory = keyof typeof MEDICINE_CATEGORIES

// User roles (Patient role removed - patient portal is for clinicians only)
export type UserRole = "cms" | "facility" | "logistics" | "clinician" | "surveillance"

export const USER_ROLES: Record<UserRole, { label: string; description: string }> = {
  cms: { label: "CMS Planner", description: "Central Medical Stores planning and procurement" },
  facility: { label: "Facility Manager", description: "Pharmacy and stock management at health facilities" },
  logistics: { label: "Logistics Team", description: "Supply chain and distribution management" },
  clinician: { label: "Clinician", description: "Healthcare providers - access patient records and prescriptions" },
  surveillance: { label: "Surveillance Team", description: "Epidemiological monitoring and analysis" },
}

// Mock district risk data
export const DISTRICT_RISK_DATA: Record<District, { riskLevel: RiskLevel; stockDays: number; facilitiesReporting: number; totalFacilities: number }> = {
  "Central": { riskLevel: "good", stockDays: 45, facilitiesReporting: 42, totalFacilities: 45 },
  "Ghanzi": { riskLevel: "warning", stockDays: 18, facilitiesReporting: 8, totalFacilities: 10 },
  "Kgalagadi": { riskLevel: "critical", stockDays: 7, facilitiesReporting: 5, totalFacilities: 8 },
  "Kgatleng": { riskLevel: "good", stockDays: 38, facilitiesReporting: 12, totalFacilities: 12 },
  "Kweneng": { riskLevel: "warning", stockDays: 22, facilitiesReporting: 28, totalFacilities: 32 },
  "North-East": { riskLevel: "good", stockDays: 52, facilitiesReporting: 15, totalFacilities: 15 },
  "North-West": { riskLevel: "warning", stockDays: 15, facilitiesReporting: 18, totalFacilities: 22 },
  "South-East": { riskLevel: "good", stockDays: 60, facilitiesReporting: 8, totalFacilities: 8 },
  "Southern": { riskLevel: "critical", stockDays: 9, facilitiesReporting: 20, totalFacilities: 25 },
}

// Mock medicine stock data
export interface MedicineStock {
  id: string
  name: string
  category: MedicineCategory
  stockOnHand: number
  monthlyConsumption: number
  daysOfStock: number
  riskLevel: RiskLevel
  inTransit: number
  lastUpdated: string
}

export const MEDICINE_STOCK_DATA: MedicineStock[] = [
  { id: "1", name: "Rifampicin 150mg", category: "tb", stockOnHand: 45000, monthlyConsumption: 12000, daysOfStock: 112, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "2", name: "Isoniazid 100mg", category: "tb", stockOnHand: 8000, monthlyConsumption: 10000, daysOfStock: 24, riskLevel: "warning", inTransit: 15000, lastUpdated: "2024-01-15" },
  { id: "3", name: "Pyrazinamide 500mg", category: "tb", stockOnHand: 3500, monthlyConsumption: 8000, daysOfStock: 13, riskLevel: "critical", inTransit: 0, lastUpdated: "2024-01-14" },
  { id: "4", name: "Ethambutol 400mg", category: "tb", stockOnHand: 22000, monthlyConsumption: 6000, daysOfStock: 110, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "5", name: "Artemether-Lumefantrine", category: "antimalarial", stockOnHand: 5200, monthlyConsumption: 4500, daysOfStock: 35, riskLevel: "good", inTransit: 8000, lastUpdated: "2024-01-15" },
  { id: "6", name: "Quinine Sulphate 300mg", category: "antimalarial", stockOnHand: 1800, monthlyConsumption: 2200, daysOfStock: 24, riskLevel: "warning", inTransit: 0, lastUpdated: "2024-01-14" },
  { id: "7", name: "Artesunate 60mg", category: "antimalarial", stockOnHand: 4500, monthlyConsumption: 1800, daysOfStock: 75, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "8", name: "Metformin 500mg", category: "chronic", stockOnHand: 2100, monthlyConsumption: 8500, daysOfStock: 7, riskLevel: "critical", inTransit: 20000, lastUpdated: "2024-01-15" },
  { id: "9", name: "Amlodipine 5mg", category: "chronic", stockOnHand: 15000, monthlyConsumption: 7200, daysOfStock: 62, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "10", name: "Enalapril 10mg", category: "chronic", stockOnHand: 6800, monthlyConsumption: 5500, daysOfStock: 37, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-14" },
]

// Mock shipment data
export interface Shipment {
  id: string
  origin: string
  destination: District
  medicines: string[]
  status: "in-transit" | "delayed" | "delivered" | "pending"
  estimatedArrival: string
  quantity: number
}

export const SHIPMENT_DATA: Shipment[] = [
  { id: "SHP-001", origin: "CMS Gaborone", destination: "Kgalagadi", medicines: ["Pyrazinamide", "Metformin"], status: "in-transit", estimatedArrival: "2024-01-17", quantity: 12000 },
  { id: "SHP-002", origin: "CMS Gaborone", destination: "Southern", medicines: ["Isoniazid", "Rifampicin"], status: "delayed", estimatedArrival: "2024-01-16", quantity: 8500 },
  { id: "SHP-003", origin: "CMS Francistown", destination: "North-West", medicines: ["Artemether-Lumefantrine"], status: "in-transit", estimatedArrival: "2024-01-18", quantity: 5000 },
  { id: "SHP-004", origin: "CMS Gaborone", destination: "Ghanzi", medicines: ["Quinine Sulphate"], status: "pending", estimatedArrival: "2024-01-20", quantity: 3000 },
]

// Mock patient data
export interface Patient {
  id: string
  name: string
  nationalId: string
  facility: string
  district: District
  condition: string
  medications: PatientMedication[]
  treatmentStartDate: string
  nextPickupDate: string
  adherenceRate: number
  riskStatus: RiskLevel
}

export interface PatientMedication {
  name: string
  dosage: string
  frequency: string
  daysSupply: number
  refillsRemaining: number
}

export const PATIENT_DATA: Patient[] = [
  {
    id: "P-001",
    name: "Kelebogile Mosweu",
    nationalId: "***-***-1234",
    facility: "Princess Marina Hospital",
    district: "South-East",
    condition: "TB Treatment",
    medications: [
      { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
      { name: "Pyrazinamide", dosage: "500mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
    ],
    treatmentStartDate: "2023-11-01",
    nextPickupDate: "2024-01-22",
    adherenceRate: 94,
    riskStatus: "good",
  },
  {
    id: "P-002",
    name: "Thabo Molefe",
    nationalId: "***-***-5678",
    facility: "Maun General Hospital",
    district: "North-West",
    condition: "Hypertension + Diabetes",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", daysSupply: 3, refillsRemaining: 2 },
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", daysSupply: 3, refillsRemaining: 2 },
    ],
    treatmentStartDate: "2022-06-15",
    nextPickupDate: "2024-01-16",
    adherenceRate: 78,
    riskStatus: "warning",
  },
  {
    id: "P-003",
    name: "Goitseone Kgosidintsi",
    nationalId: "***-***-9012",
    facility: "Tsabong Primary Hospital",
    district: "Kgalagadi",
    condition: "TB Treatment",
    medications: [
      { name: "Rifampicin", dosage: "150mg", frequency: "Once daily", daysSupply: 0, refillsRemaining: 3 },
    ],
    treatmentStartDate: "2023-12-01",
    nextPickupDate: "2024-01-14",
    adherenceRate: 65,
    riskStatus: "critical",
  },
]

// Mock continuity alerts
export interface ContinuityAlert {
  id: string
  type: "missed-pickup" | "low-adherence" | "stock-risk" | "treatment-gap"
  severity: RiskLevel
  patientId?: string
  patientName?: string
  facility?: string
  district: District
  message: string
  createdAt: string
}

export const CONTINUITY_ALERTS: ContinuityAlert[] = [
  { id: "A-001", type: "missed-pickup", severity: "critical", patientId: "P-003", patientName: "Goitseone K.", facility: "Tsabong Primary Hospital", district: "Kgalagadi", message: "Patient missed TB medication pickup - 3 days overdue", createdAt: "2024-01-15T08:00:00" },
  { id: "A-002", type: "stock-risk", severity: "critical", district: "Kgalagadi", message: "Pyrazinamide stock critically low - 7 days remaining", createdAt: "2024-01-15T06:00:00" },
  { id: "A-003", type: "low-adherence", severity: "warning", patientId: "P-002", patientName: "Thabo M.", facility: "Maun General Hospital", district: "North-West", message: "Patient adherence dropped below 80% - chronic care regimen", createdAt: "2024-01-14T14:30:00" },
  { id: "A-004", type: "stock-risk", severity: "warning", district: "Southern", message: "Isoniazid shipment delayed - may impact 45 patients", createdAt: "2024-01-14T10:00:00" },
  { id: "A-005", type: "treatment-gap", severity: "critical", district: "Southern", message: "9 TB patients at risk of treatment interruption in next 5 days", createdAt: "2024-01-15T07:00:00" },
]

// Facility data
export interface Facility {
  id: string
  name: string
  district: District
  type: "hospital" | "clinic" | "health-post"
  stockStatus: RiskLevel
  patientsServed: number
  lastReportDate: string
}

export const FACILITY_DATA: Facility[] = [
  { id: "F-001", name: "Princess Marina Hospital", district: "South-East", type: "hospital", stockStatus: "good", patientsServed: 2450, lastReportDate: "2024-01-15" },
  { id: "F-002", name: "Nyangabgwe Referral Hospital", district: "Central", type: "hospital", stockStatus: "good", patientsServed: 1890, lastReportDate: "2024-01-15" },
  { id: "F-003", name: "Maun General Hospital", district: "North-West", type: "hospital", stockStatus: "warning", patientsServed: 980, lastReportDate: "2024-01-14" },
  { id: "F-004", name: "Tsabong Primary Hospital", district: "Kgalagadi", type: "hospital", stockStatus: "critical", patientsServed: 420, lastReportDate: "2024-01-13" },
  { id: "F-005", name: "Ghanzi Primary Hospital", district: "Ghanzi", type: "hospital", stockStatus: "warning", patientsServed: 560, lastReportDate: "2024-01-14" },
  { id: "F-006", name: "Kanye Main Hospital", district: "Southern", type: "hospital", stockStatus: "critical", patientsServed: 780, lastReportDate: "2024-01-15" },
]

// National KPIs
export const NATIONAL_KPIS = {
  totalFacilities: 177,
  facilitiesReporting: 156,
  reportingRate: 88,
  nationalStockDays: 34,
  patientsOnTreatment: 12450,
  continuityRate: 91.2,
  criticalAlerts: 8,
  shipmentsInTransit: 12,
}

// Stock trend data for charts
export const STOCK_TREND_DATA = [
  { month: "Aug", tb: 85, antimalarial: 72, chronic: 68 },
  { month: "Sep", tb: 78, antimalarial: 80, chronic: 65 },
  { month: "Oct", tb: 72, antimalarial: 75, chronic: 58 },
  { month: "Nov", tb: 65, antimalarial: 68, chronic: 52 },
  { month: "Dec", tb: 58, antimalarial: 62, chronic: 45 },
  { month: "Jan", tb: 52, antimalarial: 70, chronic: 38 },
]

// Disease incidence data
export const DISEASE_INCIDENCE_DATA = [
  { month: "Aug", tb: 245, malaria: 180, hypertension: 420, diabetes: 380 },
  { month: "Sep", tb: 238, malaria: 165, hypertension: 435, diabetes: 392 },
  { month: "Oct", tb: 252, malaria: 142, hypertension: 448, diabetes: 405 },
  { month: "Nov", tb: 261, malaria: 198, hypertension: 462, diabetes: 418 },
  { month: "Dec", tb: 248, malaria: 225, hypertension: 475, diabetes: 428 },
  { month: "Jan", tb: 255, malaria: 210, hypertension: 488, diabetes: 440 },
]

// ============================================
// MEDICINE DISPENSING & TRACKING SYSTEM
// ============================================

// Medicine-to-Condition Mapping (Treatment-Condition Dataset)
export const MEDICINE_CONDITION_MAP: Record<string, { conditions: string[]; programme: string }> = {
  "Rifampicin": { conditions: ["Tuberculosis"], programme: "TB" },
  "Isoniazid": { conditions: ["Tuberculosis"], programme: "TB" },
  "Pyrazinamide": { conditions: ["Tuberculosis"], programme: "TB" },
  "Ethambutol": { conditions: ["Tuberculosis"], programme: "TB" },
  "Rifampicin/Isoniazid FDC": { conditions: ["Tuberculosis"], programme: "TB" },
  "Artemether-Lumefantrine": { conditions: ["Malaria"], programme: "Malaria" },
  "Quinine Sulphate": { conditions: ["Malaria"], programme: "Malaria" },
  "Artesunate": { conditions: ["Malaria", "Severe Malaria"], programme: "Malaria" },
  "Sulfadoxine-Pyrimethamine": { conditions: ["Malaria Prevention"], programme: "Malaria" },
  "Metformin": { conditions: ["Diabetes Type 2"], programme: "NCD" },
  "Amlodipine": { conditions: ["Hypertension"], programme: "NCD" },
  "Enalapril": { conditions: ["Hypertension", "Heart Failure"], programme: "NCD" },
  "Hydrochlorothiazide": { conditions: ["Hypertension"], programme: "NCD" },
  "Atenolol": { conditions: ["Hypertension", "Angina"], programme: "NCD" },
}

// Dispensing Record
export interface DispensingRecord {
  id: string
  medicineId: string
  medicineName: string
  quantity: number
  date: string
  facilityId: string
  facilityName: string
  district: District
  dispensingStaffId: string
  dispensingStaffName: string
  prescriptionId?: string
  patientEncounterId?: string
  patientId?: string
  programme: string
  batchNumber: string
  expiryDate: string
}

// Mock dispensing records
export const DISPENSING_RECORDS: DispensingRecord[] = [
  { id: "D-001", medicineId: "1", medicineName: "Rifampicin 150mg", quantity: 60, date: "2024-01-15", facilityId: "F-001", facilityName: "Princess Marina Hospital", district: "South-East", dispensingStaffId: "S-001", dispensingStaffName: "Nurse K. Modise", prescriptionId: "RX-4521", patientEncounterId: "E-1001", patientId: "P-001", programme: "TB", batchNumber: "BT-2024-001", expiryDate: "2025-06-15" },
  { id: "D-002", medicineId: "8", medicineName: "Metformin 500mg", quantity: 90, date: "2024-01-15", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-015", dispensingStaffName: "Nurse T. Mogapi", prescriptionId: "RX-4522", patientEncounterId: "E-1002", patientId: "P-002", programme: "NCD", batchNumber: "BT-2024-045", expiryDate: "2025-03-20" },
  { id: "D-003", medicineId: "5", medicineName: "Artemether-Lumefantrine", quantity: 24, date: "2024-01-15", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-015", dispensingStaffName: "Nurse T. Mogapi", prescriptionId: "RX-4523", patientEncounterId: "E-1003", programme: "Malaria", batchNumber: "BT-2024-089", expiryDate: "2024-12-01" },
  { id: "D-004", medicineId: "3", medicineName: "Pyrazinamide 500mg", quantity: 30, date: "2024-01-14", facilityId: "F-004", facilityName: "Tsabong Primary Hospital", district: "Kgalagadi", dispensingStaffId: "S-022", dispensingStaffName: "Nurse M. Seipei", prescriptionId: "RX-4520", patientEncounterId: "E-1004", patientId: "P-003", programme: "TB", batchNumber: "BT-2024-012", expiryDate: "2025-01-10" },
  { id: "D-005", medicineId: "9", medicineName: "Amlodipine 5mg", quantity: 30, date: "2024-01-14", facilityId: "F-006", facilityName: "Kanye Main Hospital", district: "Southern", dispensingStaffId: "S-030", dispensingStaffName: "Nurse B. Phiri", prescriptionId: "RX-4519", patientEncounterId: "E-1005", programme: "NCD", batchNumber: "BT-2024-067", expiryDate: "2025-08-22" },
  { id: "D-006", medicineId: "5", medicineName: "Artemether-Lumefantrine", quantity: 48, date: "2024-01-14", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-016", dispensingStaffName: "Nurse L. Mokgethi", programme: "Malaria", batchNumber: "BT-2024-089", expiryDate: "2024-12-01" },
  { id: "D-007", medicineId: "1", medicineName: "Rifampicin 150mg", quantity: 120, date: "2024-01-13", facilityId: "F-002", facilityName: "Nyangabgwe Referral Hospital", district: "Central", dispensingStaffId: "S-008", dispensingStaffName: "Nurse G. Tsheko", prescriptionId: "RX-4515", patientEncounterId: "E-1006", programme: "TB", batchNumber: "BT-2024-001", expiryDate: "2025-06-15" },
  { id: "D-008", medicineId: "6", medicineName: "Quinine Sulphate 300mg", quantity: 20, date: "2024-01-13", facilityId: "F-005", facilityName: "Ghanzi Primary Hospital", district: "Ghanzi", dispensingStaffId: "S-025", dispensingStaffName: "Nurse P. Kgosi", prescriptionId: "RX-4514", patientEncounterId: "E-1007", programme: "Malaria", batchNumber: "BT-2024-078", expiryDate: "2024-09-30" },
]

// Facility Inventory View
export interface FacilityInventory {
  facilityId: string
  facilityName: string
  district: District
  medicines: {
    medicineId: string
    medicineName: string
    stockOnHand: number
    nearExpiry: number
    expiryDate: string
    lowStockAlert: boolean
    reorderPoint: number
    lastDispensedDate: string
  }[]
  lastUpdated: string
}

export const FACILITY_INVENTORY: FacilityInventory[] = [
  {
    facilityId: "F-001",
    facilityName: "Princess Marina Hospital",
    district: "South-East",
    medicines: [
      { medicineId: "1", medicineName: "Rifampicin 150mg", stockOnHand: 2250, nearExpiry: 0, expiryDate: "2025-06-15", lowStockAlert: false, reorderPoint: 1000, lastDispensedDate: "2024-01-15" },
      { medicineId: "2", medicineName: "Isoniazid 100mg", stockOnHand: 400, nearExpiry: 150, expiryDate: "2024-03-20", lowStockAlert: true, reorderPoint: 500, lastDispensedDate: "2024-01-15" },
      { medicineId: "8", medicineName: "Metformin 500mg", stockOnHand: 105, nearExpiry: 0, expiryDate: "2025-03-20", lowStockAlert: true, reorderPoint: 400, lastDispensedDate: "2024-01-14" },
    ],
    lastUpdated: "2024-01-15T08:30:00"
  },
  {
    facilityId: "F-004",
    facilityName: "Tsabong Primary Hospital",
    district: "Kgalagadi",
    medicines: [
      { medicineId: "3", medicineName: "Pyrazinamide 500mg", stockOnHand: 50, nearExpiry: 50, expiryDate: "2024-02-10", lowStockAlert: true, reorderPoint: 200, lastDispensedDate: "2024-01-14" },
      { medicineId: "1", medicineName: "Rifampicin 150mg", stockOnHand: 180, nearExpiry: 0, expiryDate: "2025-06-15", lowStockAlert: true, reorderPoint: 300, lastDispensedDate: "2024-01-13" },
    ],
    lastUpdated: "2024-01-13T14:20:00"
  },
]

// ============================================
// OUTBREAK/DISEASE SPREAD DETECTION
// ============================================

// Regional Dispensing Aggregation (for outbreak detection)
export interface RegionalDispensingTrend {
  district: District
  period: string
  programme: string
  condition: string
  dispensingCount: number
  previousPeriodCount: number
  changePercent: number
  isSpike: boolean
  isTrending: boolean
}

export const REGIONAL_DISPENSING_TRENDS: RegionalDispensingTrend[] = [
  { district: "North-West", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 245, previousPeriodCount: 142, changePercent: 72.5, isSpike: true, isTrending: true },
  { district: "Kweneng", period: "2024-W02", programme: "TB", condition: "Tuberculosis", dispensingCount: 89, previousPeriodCount: 62, changePercent: 43.5, isSpike: true, isTrending: false },
  { district: "Southern", period: "2024-W02", programme: "NCD", condition: "Hypertension", dispensingCount: 312, previousPeriodCount: 298, changePercent: 4.7, isSpike: false, isTrending: false },
  { district: "Kgalagadi", period: "2024-W02", programme: "TB", condition: "Tuberculosis", dispensingCount: 34, previousPeriodCount: 28, changePercent: 21.4, isSpike: false, isTrending: true },
  { district: "Central", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 78, previousPeriodCount: 65, changePercent: 20.0, isSpike: false, isTrending: false },
  { district: "Ghanzi", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 156, previousPeriodCount: 88, changePercent: 77.3, isSpike: true, isTrending: true },
]

// Outbreak Alert
export interface OutbreakAlert {
  id: string
  district: District
  condition: string
  severity: RiskLevel
  type: "spike" | "trend" | "cluster"
  description: string
  affectedFacilities: number
  dispensingIncrease: number
  detectedAt: string
  recommendedAction: string
}

export const OUTBREAK_ALERTS: OutbreakAlert[] = [
  { id: "OB-001", district: "North-West", condition: "Malaria", severity: "critical", type: "spike", description: "72.5% increase in antimalarial dispensing detected", affectedFacilities: 8, dispensingIncrease: 72.5, detectedAt: "2024-01-14T06:00:00", recommendedAction: "Increase antimalarial stock allocation to North-West district" },
  { id: "OB-002", district: "Ghanzi", condition: "Malaria", severity: "warning", type: "spike", description: "77.3% increase in antimalarial dispensing - seasonal pattern suspected", affectedFacilities: 4, dispensingIncrease: 77.3, detectedAt: "2024-01-14T06:00:00", recommendedAction: "Monitor closely and prepare emergency stock if needed" },
  { id: "OB-003", district: "Kweneng", condition: "Tuberculosis", severity: "warning", type: "trend", description: "Unusual TB medicine consumption increase over 3 weeks", affectedFacilities: 12, dispensingIncrease: 43.5, detectedAt: "2024-01-12T12:00:00", recommendedAction: "Investigate potential TB outbreak; notify surveillance team" },
]

// Heatmap data for disease spread visualization
export interface DistrictHeatmapData {
  district: District
  tb: number
  malaria: number
  hypertension: number
  diabetes: number
  outbreakRisk: RiskLevel
  activeAlerts: number
}

export const DISTRICT_HEATMAP_DATA: DistrictHeatmapData[] = [
  { district: "Central", tb: 45, malaria: 32, hypertension: 180, diabetes: 145, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Ghanzi", tb: 28, malaria: 156, hypertension: 65, diabetes: 48, outbreakRisk: "warning", activeAlerts: 1 },
  { district: "Kgalagadi", tb: 34, malaria: 22, hypertension: 42, diabetes: 35, outbreakRisk: "warning", activeAlerts: 0 },
  { district: "Kgatleng", tb: 38, malaria: 18, hypertension: 95, diabetes: 78, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Kweneng", tb: 89, malaria: 45, hypertension: 210, diabetes: 175, outbreakRisk: "warning", activeAlerts: 1 },
  { district: "North-East", tb: 32, malaria: 28, hypertension: 88, diabetes: 72, outbreakRisk: "good", activeAlerts: 0 },
  { district: "North-West", tb: 52, malaria: 245, hypertension: 120, diabetes: 98, outbreakRisk: "critical", activeAlerts: 1 },
  { district: "South-East", tb: 65, malaria: 15, hypertension: 285, diabetes: 245, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Southern", tb: 72, malaria: 38, hypertension: 195, diabetes: 162, outbreakRisk: "warning", activeAlerts: 0 },
]

// ============================================
// PATIENT PRESCRIPTION HISTORY & TRACKING
// ============================================

// Prescription Record for treatment history
export interface PrescriptionRecord {
  id: string
  patientId: string
  prescriberId: string
  prescriberName: string
  prescribedDate: string
  facilityId: string
  facilityName: string
  facilityDistrict: District
  facilityAddress: string
  medicines: {
    name: string
    dosage: string
    quantity: number
    frequency: string
    durationDays: number
  }[]
  diagnosis: string
  status: "active" | "completed" | "discontinued"
  dispensedDate?: string
  dispensedBy?: string
}

// Clinical Visit/Encounter Record
export interface ClinicalVisit {
  id: string
  date: string
  type: "Initial Consultation" | "Follow-up" | "Lab Review" | "Treatment Review" | "Emergency" | "Discharge"
  facilityId: string
  facilityName: string
  facilityDistrict: District
  clinicianId: string
  clinicianName: string
  chiefComplaint?: string
  clinicalNotes: string
  vitals?: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    weight?: number
    oxygenSaturation?: number
  }
  labResults?: {
    testName: string
    result: string
    referenceRange: string
    status: "normal" | "abnormal" | "critical"
  }[]
  diagnosis?: string
  treatmentPlan?: string
  outcome: "Ongoing Treatment" | "Improved" | "Stable" | "Deteriorating" | "Referred" | "Discharged"
  nextAppointment?: string
}

// Treatment Milestone
export interface TreatmentMilestone {
  date: string
  event: string
  type: "start" | "phase-change" | "lab" | "adjustment" | "improvement" | "concern" | "completion"
  notes?: string
}

// Enhanced Patient with location and history
export interface PatientWithHistory extends Patient {
  homeAddress: string
  homeDistrict: District
  phoneNumber: string
  emergencyContact: string
  dateOfBirth: string
  gender: "Male" | "Female"
  prescriptionHistory: PrescriptionRecord[]
  clinicalVisits?: ClinicalVisit[]
  treatmentMilestones?: TreatmentMilestone[]
  treatmentPhase?: string
  allergies?: string[]
  chronicConditions?: string[]
}

export const PATIENTS_WITH_HISTORY: PatientWithHistory[] = [
  {
    id: "P-001",
    name: "Kelebogile Mosweu",
    nationalId: "456789012345",
    facility: "Princess Marina Hospital",
    district: "South-East",
    condition: "TB Treatment",
    homeAddress: "Plot 1234, Extension 12, Gaborone",
    homeDistrict: "South-East",
    phoneNumber: "+267 72 345 678",
    emergencyContact: "+267 71 234 567",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    medications: [
      { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
      { name: "Pyrazinamide", dosage: "500mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
    ],
    treatmentStartDate: "2023-11-01",
    nextPickupDate: "2024-01-22",
    adherenceRate: 94,
    riskStatus: "good",
    treatmentPhase: "Intensive Phase",
    allergies: ["Penicillin"],
    chronicConditions: [],
    treatmentMilestones: [
      { date: "2023-11-01", event: "TB Treatment Initiated", type: "start", notes: "Patient started on standard 4-drug regimen" },
      { date: "2023-11-15", event: "Week 2 Follow-up", type: "improvement", notes: "Symptoms improving, tolerating medication well" },
      { date: "2023-12-01", event: "Month 1 Sputum Test", type: "lab", notes: "Sputum smear still positive, continue intensive phase" },
      { date: "2023-12-11", event: "Ethambutol Discontinued", type: "adjustment", notes: "Ethambutol stopped per protocol, continuing RIF/INH/PZA" },
      { date: "2024-01-08", event: "Month 2 Review", type: "improvement", notes: "Good adherence, symptoms resolved, weight gain of 2kg" },
    ],
    clinicalVisits: [
      {
        id: "V-001",
        date: "2024-01-08",
        type: "Follow-up",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        clinicianId: "DR-001",
        clinicianName: "Dr. M. Kgosidintsi",
        chiefComplaint: "Routine TB follow-up",
        clinicalNotes: "Patient reports feeling well. No cough or night sweats. Appetite improved. Tolerating medications without side effects.",
        vitals: { bloodPressure: "118/76", heartRate: 72, temperature: 36.8, weight: 58, oxygenSaturation: 98 },
        labResults: [
          { testName: "Sputum AFB Smear", result: "Negative", referenceRange: "Negative", status: "normal" },
          { testName: "Liver Function (ALT)", result: "32 U/L", referenceRange: "7-56 U/L", status: "normal" },
        ],
        diagnosis: "Pulmonary TB - Responding to treatment",
        treatmentPlan: "Continue current regimen. Prepare for continuation phase.",
        outcome: "Improved",
        nextAppointment: "2024-02-05"
      },
      {
        id: "V-002",
        date: "2023-12-11",
        type: "Treatment Review",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        clinicianId: "DR-001",
        clinicianName: "Dr. M. Kgosidintsi",
        chiefComplaint: "Month 1 TB treatment review",
        clinicalNotes: "Completed first month of intensive phase. Sputum still positive but patient clinically improved. Weight stable.",
        vitals: { bloodPressure: "120/78", heartRate: 76, temperature: 37.0, weight: 56, oxygenSaturation: 97 },
        labResults: [
          { testName: "Sputum AFB Smear", result: "1+", referenceRange: "Negative", status: "abnormal" },
          { testName: "Liver Function (ALT)", result: "45 U/L", referenceRange: "7-56 U/L", status: "normal" },
        ],
        diagnosis: "Pulmonary TB - Intensive phase month 1",
        treatmentPlan: "Continue intensive phase. Discontinue Ethambutol per protocol.",
        outcome: "Ongoing Treatment",
        nextAppointment: "2024-01-08"
      },
      {
        id: "V-003",
        date: "2023-11-13",
        type: "Initial Consultation",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        clinicianId: "DR-002",
        clinicianName: "Dr. T. Pheto",
        chiefComplaint: "Persistent cough for 3 weeks, night sweats, weight loss",
        clinicalNotes: "Patient presents with classic TB symptoms. Sputum positive for AFB. CXR shows bilateral upper lobe infiltrates. No drug resistance on GeneXpert.",
        vitals: { bloodPressure: "115/72", heartRate: 88, temperature: 37.8, weight: 54, oxygenSaturation: 95 },
        labResults: [
          { testName: "Sputum AFB Smear", result: "3+", referenceRange: "Negative", status: "critical" },
          { testName: "GeneXpert MTB/RIF", result: "MTB Detected, RIF Sensitive", referenceRange: "Not Detected", status: "abnormal" },
          { testName: "HIV Rapid Test", result: "Non-Reactive", referenceRange: "Non-Reactive", status: "normal" },
        ],
        diagnosis: "Drug-sensitive Pulmonary Tuberculosis",
        treatmentPlan: "Initiate standard TB treatment: RHZE for 2 months intensive phase, then RH for 4 months continuation.",
        outcome: "Ongoing Treatment",
        nextAppointment: "2023-11-27"
      },
    ],
    prescriptionHistory: [
      {
        id: "RX-4521",
        patientId: "P-001",
        prescriberId: "DR-001",
        prescriberName: "Dr. M. Kgosidintsi",
        prescribedDate: "2024-01-08",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        facilityAddress: "Notwane Road, Gaborone",
        medicines: [
          { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
          { name: "Pyrazinamide", dosage: "500mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
        ],
        diagnosis: "Pulmonary Tuberculosis",
        status: "active",
        dispensedDate: "2024-01-08",
        dispensedBy: "Nurse K. Modise"
      },
      {
        id: "RX-4320",
        patientId: "P-001",
        prescriberId: "DR-001",
        prescriberName: "Dr. M. Kgosidintsi",
        prescribedDate: "2023-12-11",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        facilityAddress: "Notwane Road, Gaborone",
        medicines: [
          { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
          { name: "Pyrazinamide", dosage: "500mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
          { name: "Ethambutol", dosage: "400mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
        ],
        diagnosis: "Pulmonary Tuberculosis",
        status: "completed",
        dispensedDate: "2023-12-11",
        dispensedBy: "Nurse K. Modise"
      },
      {
        id: "RX-4115",
        patientId: "P-001",
        prescriberId: "DR-002",
        prescriberName: "Dr. T. Pheto",
        prescribedDate: "2023-11-13",
        facilityId: "F-001",
        facilityName: "Princess Marina Hospital",
        facilityDistrict: "South-East",
        facilityAddress: "Notwane Road, Gaborone",
        medicines: [
          { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
          { name: "Pyrazinamide", dosage: "500mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
          { name: "Ethambutol", dosage: "400mg", quantity: 28, frequency: "Once daily", durationDays: 28 },
        ],
        diagnosis: "Pulmonary Tuberculosis - Initial",
        status: "completed",
        dispensedDate: "2023-11-13",
        dispensedBy: "Nurse B. Tsheko"
      },
    ]
  },
  {
    id: "P-002",
    name: "Thabo Molefe",
    nationalId: "567890123456",
    facility: "Maun General Hospital",
    district: "North-West",
    condition: "Hypertension + Diabetes",
    homeAddress: "House 456, Boseja Ward, Maun",
    homeDistrict: "North-West",
    phoneNumber: "+267 74 567 890",
    emergencyContact: "+267 75 678 901",
    dateOfBirth: "1972-08-22",
    gender: "Male",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", daysSupply: 3, refillsRemaining: 2 },
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", daysSupply: 3, refillsRemaining: 2 },
    ],
    treatmentStartDate: "2022-06-15",
    nextPickupDate: "2024-01-16",
    adherenceRate: 78,
    riskStatus: "warning",
    allergies: [],
    chronicConditions: ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
    treatmentMilestones: [
      { date: "2022-06-15", event: "Diabetes & Hypertension Diagnosed", type: "start", notes: "Started on Metformin and Amlodipine" },
      { date: "2022-09-15", event: "HbA1c Improved to 7.2%", type: "improvement", notes: "Good glycemic control achieved" },
      { date: "2023-06-10", event: "Blood Pressure Well Controlled", type: "improvement", notes: "BP consistently below 140/90" },
      { date: "2023-12-02", event: "Missed Appointment", type: "concern", notes: "Patient did not attend scheduled review" },
      { date: "2024-01-02", event: "Medication Running Low", type: "concern", notes: "Patient has only 3 days supply remaining" },
    ],
    clinicalVisits: [
      {
        id: "V-004",
        date: "2024-01-02",
        type: "Follow-up",
        facilityId: "F-003",
        facilityName: "Maun General Hospital",
        facilityDistrict: "North-West",
        clinicianId: "DR-005",
        clinicianName: "Dr. K. Mothibi",
        chiefComplaint: "Routine NCD follow-up",
        clinicalNotes: "Patient admits to irregular medication use. Missed several doses over holidays. Blood sugar elevated. Need to reinforce adherence counseling.",
        vitals: { bloodPressure: "145/92", heartRate: 82, temperature: 36.6, weight: 78, oxygenSaturation: 98 },
        labResults: [
          { testName: "Random Blood Glucose", result: "11.2 mmol/L", referenceRange: "4.4-7.8 mmol/L", status: "abnormal" },
          { testName: "Blood Pressure", result: "145/92 mmHg", referenceRange: "<140/90 mmHg", status: "abnormal" },
        ],
        diagnosis: "Type 2 DM - Suboptimal control, Hypertension - Suboptimal control",
        treatmentPlan: "Continue current medications. Emphasized importance of adherence. Schedule follow-up in 2 weeks.",
        outcome: "Stable",
        nextAppointment: "2024-01-16"
      },
      {
        id: "V-005",
        date: "2023-12-02",
        type: "Follow-up",
        facilityId: "F-003",
        facilityName: "Maun General Hospital",
        facilityDistrict: "North-West",
        clinicianId: "DR-005",
        clinicianName: "Dr. K. Mothibi",
        chiefComplaint: "3-month diabetes and hypertension review",
        clinicalNotes: "Patient reports good compliance. No hypoglycemic episodes. Blood pressure well controlled on current regimen.",
        vitals: { bloodPressure: "132/84", heartRate: 76, temperature: 36.5, weight: 77, oxygenSaturation: 99 },
        labResults: [
          { testName: "HbA1c", result: "7.4%", referenceRange: "<7.0%", status: "abnormal" },
          { testName: "Fasting Blood Glucose", result: "7.8 mmol/L", referenceRange: "4.0-6.0 mmol/L", status: "abnormal" },
          { testName: "Creatinine", result: "92 umol/L", referenceRange: "62-106 umol/L", status: "normal" },
        ],
        diagnosis: "Type 2 DM - Fair control, Essential Hypertension - Controlled",
        treatmentPlan: "Continue current medications. Dietary counseling provided. Recheck HbA1c in 3 months.",
        outcome: "Stable",
        nextAppointment: "2024-03-02"
      },
    ],
    prescriptionHistory: [
      {
        id: "RX-4522",
        patientId: "P-002",
        prescriberId: "DR-005",
        prescriberName: "Dr. K. Mothibi",
        prescribedDate: "2024-01-02",
        facilityId: "F-003",
        facilityName: "Maun General Hospital",
        facilityDistrict: "North-West",
        facilityAddress: "Shorobe Road, Maun",
        medicines: [
          { name: "Metformin", dosage: "500mg", quantity: 60, frequency: "Twice daily", durationDays: 30 },
          { name: "Amlodipine", dosage: "5mg", quantity: 30, frequency: "Once daily", durationDays: 30 },
        ],
        diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension",
        status: "active",
        dispensedDate: "2024-01-02",
        dispensedBy: "Nurse T. Mogapi"
      },
      {
        id: "RX-4210",
        patientId: "P-002",
        prescriberId: "DR-005",
        prescriberName: "Dr. K. Mothibi",
        prescribedDate: "2023-12-02",
        facilityId: "F-003",
        facilityName: "Maun General Hospital",
        facilityDistrict: "North-West",
        facilityAddress: "Shorobe Road, Maun",
        medicines: [
          { name: "Metformin", dosage: "500mg", quantity: 60, frequency: "Twice daily", durationDays: 30 },
          { name: "Amlodipine", dosage: "5mg", quantity: 30, frequency: "Once daily", durationDays: 30 },
        ],
        diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension",
        status: "completed",
        dispensedDate: "2023-12-02",
        dispensedBy: "Nurse T. Mogapi"
      },
    ]
  },
  {
    id: "P-003",
    name: "Goitseone Kgosidintsi",
    nationalId: "678901234567",
    facility: "Tsabong Primary Hospital",
    district: "Kgalagadi",
    condition: "TB Treatment",
    homeAddress: "Ward 3, Tsabong Village",
    homeDistrict: "Kgalagadi",
    phoneNumber: "+267 76 789 012",
    emergencyContact: "+267 77 890 123",
    dateOfBirth: "1990-11-05",
    gender: "Male",
    medications: [
      { name: "Rifampicin", dosage: "150mg", frequency: "Once daily", daysSupply: 0, refillsRemaining: 3 },
    ],
    treatmentStartDate: "2023-12-01",
    nextPickupDate: "2024-01-14",
    adherenceRate: 65,
    riskStatus: "critical",
    treatmentPhase: "Intensive Phase",
    allergies: [],
    chronicConditions: [],
    treatmentMilestones: [
      { date: "2023-12-01", event: "TB Diagnosis & Treatment Start", type: "start", notes: "Started on standard TB regimen" },
      { date: "2023-12-15", event: "Week 2 Check", type: "concern", notes: "Patient reports difficulty taking all pills, some nausea" },
      { date: "2024-01-05", event: "Missed Medication Pickup", type: "concern", notes: "Patient 5 days overdue for medication collection" },
      { date: "2024-01-14", event: "Critical: Treatment Interruption", type: "concern", notes: "Patient has been without medication for several days" },
    ],
    clinicalVisits: [
      {
        id: "V-006",
        date: "2023-12-15",
        type: "Follow-up",
        facilityId: "F-004",
        facilityName: "Tsabong Primary Hospital",
        facilityDistrict: "Kgalagadi",
        clinicianId: "DR-008",
        clinicianName: "Dr. L. Sebina",
        chiefComplaint: "TB treatment week 2 follow-up",
        clinicalNotes: "Patient complains of nausea and loss of appetite. Has missed some doses. Cough persists. Need adherence support.",
        vitals: { bloodPressure: "110/70", heartRate: 88, temperature: 37.4, weight: 62, oxygenSaturation: 96 },
        labResults: [
          { testName: "Sputum AFB Smear", result: "2+", referenceRange: "Negative", status: "abnormal" },
        ],
        diagnosis: "Pulmonary TB - Early treatment, adherence concerns",
        treatmentPlan: "Continue regimen. Antiemetic prescribed for nausea. Community health worker assigned for DOT support.",
        outcome: "Deteriorating",
        nextAppointment: "2024-01-05"
      },
      {
        id: "V-007",
        date: "2023-12-01",
        type: "Initial Consultation",
        facilityId: "F-004",
        facilityName: "Tsabong Primary Hospital",
        facilityDistrict: "Kgalagadi",
        clinicianId: "DR-008",
        clinicianName: "Dr. L. Sebina",
        chiefComplaint: "Cough for 4 weeks, fever, weight loss",
        clinicalNotes: "Patient from remote cattle post, delayed presentation. Sputum positive. Started on TB treatment immediately.",
        vitals: { bloodPressure: "108/68", heartRate: 92, temperature: 38.2, weight: 64, oxygenSaturation: 94 },
        labResults: [
          { testName: "Sputum AFB Smear", result: "2+", referenceRange: "Negative", status: "abnormal" },
          { testName: "GeneXpert MTB/RIF", result: "MTB Detected, RIF Sensitive", referenceRange: "Not Detected", status: "abnormal" },
          { testName: "HIV Rapid Test", result: "Non-Reactive", referenceRange: "Non-Reactive", status: "normal" },
        ],
        diagnosis: "Drug-sensitive Pulmonary Tuberculosis",
        treatmentPlan: "Initiate RHZE regimen. Assign DOT supporter due to remote location.",
        outcome: "Ongoing Treatment",
        nextAppointment: "2023-12-15"
      },
    ],
    prescriptionHistory: [
      {
        id: "RX-4520",
        patientId: "P-003",
        prescriberId: "DR-008",
        prescriberName: "Dr. L. Sebina",
        prescribedDate: "2023-12-15",
        facilityId: "F-004",
        facilityName: "Tsabong Primary Hospital",
        facilityDistrict: "Kgalagadi",
        facilityAddress: "Main Road, Tsabong",
        medicines: [
          { name: "Rifampicin", dosage: "150mg", quantity: 30, frequency: "Once daily", durationDays: 30 },
          { name: "Isoniazid", dosage: "100mg", quantity: 30, frequency: "Once daily", durationDays: 30 },
          { name: "Pyrazinamide", dosage: "500mg", quantity: 30, frequency: "Once daily", durationDays: 30 },
        ],
        diagnosis: "Pulmonary Tuberculosis",
        status: "active",
        dispensedDate: "2023-12-15",
        dispensedBy: "Nurse M. Seipei"
      },
    ]
  },
]

// ============================================
// MEDICINE EXPIRY TRACKING
// ============================================

export interface MedicineExpiryAlert {
  id: string
  medicineId: string
  medicineName: string
  batchNumber: string
  quantity: number
  expiryDate: string
  daysUntilExpiry: number
  facilityId: string
  facilityName: string
  district: District
  severity: RiskLevel
  action: "dispose" | "redistribute" | "prioritize"
}

export const MEDICINE_EXPIRY_ALERTS: MedicineExpiryAlert[] = [
  { id: "EXP-001", medicineId: "3", medicineName: "Pyrazinamide 500mg", batchNumber: "BT-2024-012", quantity: 500, expiryDate: "2024-02-10", daysUntilExpiry: 25, facilityId: "F-004", facilityName: "Tsabong Primary Hospital", district: "Kgalagadi", severity: "critical", action: "prioritize" },
  { id: "EXP-002", medicineId: "2", medicineName: "Isoniazid 100mg", batchNumber: "BT-2023-145", quantity: 1200, expiryDate: "2024-03-20", daysUntilExpiry: 64, facilityId: "F-001", facilityName: "Princess Marina Hospital", district: "South-East", severity: "warning", action: "redistribute" },
  { id: "EXP-003", medicineId: "6", medicineName: "Quinine Sulphate 300mg", batchNumber: "BT-2023-078", quantity: 350, expiryDate: "2024-02-28", daysUntilExpiry: 43, facilityId: "F-005", facilityName: "Ghanzi Primary Hospital", district: "Ghanzi", severity: "warning", action: "prioritize" },
  { id: "EXP-004", medicineId: "8", medicineName: "Metformin 500mg", batchNumber: "BT-2023-200", quantity: 2500, expiryDate: "2024-04-15", daysUntilExpiry: 89, facilityId: "CMS", facilityName: "Central Medical Stores", district: "South-East", severity: "warning", action: "redistribute" },
  { id: "EXP-005", medicineId: "5", medicineName: "Artemether-Lumefantrine", batchNumber: "BT-2023-089", quantity: 180, expiryDate: "2024-01-31", daysUntilExpiry: 15, facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", severity: "critical", action: "prioritize" },
]

// ============================================
// PUSH NOTIFICATIONS / CRITICAL ALERTS
// ============================================

export interface PushNotification {
  id: string
  type: "stock-critical" | "patient-missed" | "expiry-imminent" | "outbreak-detected" | "shipment-delayed"
  title: string
  message: string
  severity: RiskLevel
  timestamp: string
  read: boolean
  actionUrl?: string
  targetRoles: UserRole[]
}

export const PUSH_NOTIFICATIONS: PushNotification[] = [
  { id: "N-001", type: "stock-critical", title: "Critical Stock Alert", message: "Pyrazinamide stock at Kgalagadi district is critically low (7 days remaining). Immediate action required.", severity: "critical", timestamp: "2024-01-15T08:00:00", read: false, actionUrl: "/dashboard/cms", targetRoles: ["cms", "logistics"] },
  { id: "N-002", type: "patient-missed", title: "Patient Missed Pickup", message: "Goitseone K. (TB Treatment) has missed medication pickup by 3 days at Tsabong Primary Hospital.", severity: "critical", timestamp: "2024-01-15T07:30:00", read: false, actionUrl: "/dashboard/clinician", targetRoles: ["clinician", "facility"] },
  { id: "N-003", type: "expiry-imminent", title: "Medicine Expiring Soon", message: "180 units of Artemether-Lumefantrine at Maun General Hospital expire in 15 days. Prioritize dispensing.", severity: "critical", timestamp: "2024-01-15T06:00:00", read: false, actionUrl: "/dashboard/facility", targetRoles: ["cms", "facility"] },
  { id: "N-004", type: "outbreak-detected", title: "Potential Outbreak Alert", message: "72.5% increase in antimalarial dispensing detected in North-West district. Investigation recommended.", severity: "warning", timestamp: "2024-01-14T14:00:00", read: true, actionUrl: "/dashboard/surveillance", targetRoles: ["surveillance", "cms"] },
  { id: "N-005", type: "shipment-delayed", title: "Shipment Delayed", message: "Shipment SHP-002 to Southern district is delayed. Expected arrival pushed to Jan 18.", severity: "warning", timestamp: "2024-01-14T10:00:00", read: true, actionUrl: "/dashboard/logistics", targetRoles: ["logistics", "cms", "facility"] },
]
