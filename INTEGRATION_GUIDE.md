# Integrating Pharmaceutical System with Existing Dashboards

## Overview

The pharmaceutical management system has been built as a modular system that integrates seamlessly with the existing MedSight dashboards. This guide shows how to connect the pharmaceutical components to existing role-based dashboards.

## Architecture

The system is designed with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         MedSight Landing Page            │
│  (Home - has links to pharmaceutical)    │
└────────────────────────────────────────┘
                      ↓
    ┌─────────────────────────────────────┐
    │      Role-Based Dashboards           │
    ├─────────────────────────────────────┤
    │ • CMS Dashboard                      │
    │ • Facility Manager Dashboard         │
    │ • Logistics Dashboard                │
    │ • Clinician Dashboard                │
    │ • Surveillance Dashboard             │
    │ • Patient Portal                     │
    └─────────────────────────────────────┘
                 ↓     ↓    ↓
         ┌──────────────────────────┐
         │ Pharmaceutical System    │
         ├──────────────────────────┤
         │ • Medicine Catalog       │
         │ • Inventory Management   │
         │ • Analytics              │
         │ • Pricing                │
         └──────────────────────────┘
                 ↓     ↓    ↓
         ┌──────────────────────────┐
         │   RESTful APIs           │
         └──────────────────────────┘
                 ↓
         ┌──────────────────────────┐
         │ Supabase PostgreSQL      │
         └──────────────────────────┘
```

## Integration Points

### 1. CMS Planner Dashboard
**Location**: `/dashboard/cms`

#### Add Pharmaceutical Components
```typescript
// Add to /app/dashboard/cms/page.tsx

import { 
  MedicineSearch, 
  StockStatusBadge 
} from '@/components/pharmaceutical'
import { useStockAlerts } from '@/lib/hooks/use-inventory'

export default function CMSDashboard() {
  const { alerts } = useStockAlerts()
  
  return (
    <div>
      {/* Existing CMS components */}
      
      {/* Add pharmaceutical alerts section */}
      <Card>
        <CardHeader>
          <CardTitle>Critical Medicine Stock Status</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.map(alert => (
            <StockAlertCard key={alert.id} {...alert} />
          ))}
        </CardContent>
      </Card>
      
      {/* Add medicine search widget */}
      <Card>
        <CardHeader>
          <CardTitle>Search Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicineSearch onSearch={handleSearch} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Use Cases**:
- National-level stock overview
- Critical alert monitoring
- Medicine search for planning
- District risk heatmap

### 2. Facility Manager Dashboard
**Location**: `/dashboard/facility`

#### Add Inventory Widgets
```typescript
// Add to /app/dashboard/facility/page.tsx

import { useFacilityStock } from '@/lib/hooks/use-inventory'
import { PharmaceuticalNav } from '@/components/pharmaceutical'

export default function FacilityDashboard() {
  const { stock } = useFacilityStock(facilityId)
  
  return (
    <div>
      {/* Navigation to pharmaceutical system */}
      <PharmaceuticalNav />
      
      {/* Quick stats */}
      <Card>
        <CardContent>
          <Stat label="Total Medicines" value={stock.length} />
          <Stat label="Low Stock Items" value={lowStockCount} />
          <Stat label="Stockouts" value={stockoutCount} />
        </CardContent>
      </Card>
      
      {/* Link to full inventory management */}
      <Button asChild>
        <Link href="/inventory">
          Manage Full Inventory
        </Link>
      </Button>
    </div>
  )
}
```

**Use Cases**:
- Facility stock management
- Order tracking
- Expiry monitoring
- Stock level alerts

### 3. Logistics Dashboard
**Location**: `/dashboard/logistics`

#### Add Shipment Tracking
```typescript
// Add to /app/dashboard/logistics/page.tsx

import { useAnalytics } from '@/lib/hooks/use-analytics'

export default function LogisticsDashboard() {
  const { shipments, deliveries } = useAnalytics()
  
  return (
    <div>
      {/* Shipment tracking */}
      <Card>
        <CardHeader>
          <CardTitle>In-Transit Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipmentList shipments={shipments.filter(s => s.status === 'IN_TRANSIT')} />
        </CardContent>
      </Card>
      
      {/* Delivery metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryMetrics deliveries={deliveries} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Use Cases**:
- Real-time shipment tracking
- Delivery schedule management
- Distribution route optimization
- Warehouse visibility

### 4. Clinician Dashboard
**Location**: `/dashboard/clinician`

#### Add Stock Availability Check
```typescript
// Add to /app/dashboard/clinician/page.tsx

import { MedicineSearch } from '@/components/pharmaceutical'

export default function ClinicianDashboard() {
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  
  return (
    <div>
      {/* Stock availability checker */}
      <Card>
        <CardHeader>
          <CardTitle>Check Medicine Stock Before Prescribing</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicineSearch onSearch={handleSearch} />
          {selectedMedicine && (
            <MedicineAvailability medicine={selectedMedicine} />
          )}
        </CardContent>
      </Card>
      
      {/* Patient continuity alerts */}
      <PatientContinuityAlerts patientId={patientId} />
    </div>
  )
}
```

**Use Cases**:
- Check medicine availability before prescribing
- Patient medication continuity alerts
- Alternative medicine suggestions if unavailable

### 5. Surveillance Dashboard
**Location**: `/dashboard/surveillance`

#### Add Disease-Medicine Correlation
```typescript
// Add to /app/dashboard/surveillance/page.tsx

import { useAnalytics } from '@/lib/hooks/use-analytics'

export default function SurveillanceDashboard() {
  const { consumption_trends } = useAnalytics()
  
  return (
    <div>
      {/* Disease incidence vs medicine consumption */}
      <Card>
        <CardHeader>
          <CardTitle>Disease-Medicine Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chart correlating TB cases with TB medicine consumption */}
          {/* Chart correlating Malaria cases with antimalarial consumption */}
          <CorrelationCharts 
            diseases={diseases} 
            medicines={consumption_trends} 
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Use Cases**:
- Correlate disease trends with medicine consumption
- Outbreak detection via medicine usage spikes
- Effectiveness monitoring

### 6. Patient Portal
**Location**: `/patient`

#### Add Medication Information
```typescript
// Add to /app/patient/page.tsx

import { useMedicines } from '@/lib/hooks/use-medicines'

export default function PatientPortal() {
  const { medicines: myMedicines } = useMedicines()
  
  return (
    <div>
      {/* My medications */}
      <Card>
        <CardHeader>
          <CardTitle>My Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {myMedicines.map(med => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </CardContent>
      </Card>
      
      {/* Pickup reminders */}
      <PickupReminders medications={myMedicines} />
      
      {/* Nearby facilities */}
      <NearbyFacilities />
    </div>
  )
}
```

**Use Cases**:
- View prescribed medications
- Pickup reminders
- Find nearby pharmacies
- Check medication availability

## Shared Components Strategy

### Create Shared Component Library

```typescript
// /components/dashboard/widgets/

export {
  MedicineStockWidget,
  StockAlertWidget,
  PricingTrendWidget,
  ConsumptionTrendWidget,
  FacilityRiskWidget,
} from './pharmaceutical-widgets'
```

### Usage in Different Dashboards

```typescript
// CMS Dashboard
<MedicineStockWidget period="national" />

// Facility Dashboard
<MedicineStockWidget facility={facilityId} />

// Clinician Dashboard
<MedicineStockWidget facility={facilityId} searchable={true} />
```

## API Integration Pattern

### Create Unified API Client

```typescript
// /lib/api/pharmaceutical-client.ts

export class PharmaceuticalClient {
  async getMedicines(query: string) { }
  async getStockStatus(facilityId: string) { }
  async getAlerts(filters?: any) { }
  async getAnalytics(params?: any) { }
  async getPricing(medicineId: string) { }
}

// Usage in any dashboard
const pharmaClient = new PharmaceuticalClient()
const medicines = await pharmaClient.getMedicines('amoxicillin')
```

## Data Flow Patterns

### Real-Time Updates

```typescript
// Subscribe to stock changes
supabase
  .from('stock_alerts')
  .on('INSERT', (payload) => {
    // Update dashboard in real-time
    setAlerts(prev => [payload.new, ...prev])
  })
  .subscribe()
```

### Cross-Dashboard Updates

```typescript
// When inventory updates, notify all dashboards
useEffect(() => {
  const unsubscribe = supabase
    .from('facility_stock')
    .on('UPDATE', ({ new: updatedStock }) => {
      // Broadcast to all connected dashboards
      window.dispatchEvent(
        new CustomEvent('stockUpdated', { detail: updatedStock })
      )
    })
    .subscribe()
  
  return unsubscribe
}, [])
```

## Permission & Access Control

### Role-Based Filters

```typescript
// Filter data based on user role
function getPharmaceuticalData(userRole: string, userId: string) {
  switch(userRole) {
    case 'cms_planner':
      return getAll() // National view
    case 'facility_manager':
      return getByFacility(userFacility) // Facility only
    case 'clinician':
      return getByFacility(userFacility) // Facility only
    case 'patient':
      return getByPatient(userId) // Own medications only
  }
}
```

### RLS Policies

The Supabase database already has RLS policies that should be enhanced:

```sql
-- CMS Planner: see all data
CREATE POLICY cms_planner_view ON medicines
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'cms_planner');

-- Facility Manager: see own facility only
CREATE POLICY facility_manager_view ON facility_stock
  FOR SELECT
  USING (
    facility_id = (
      SELECT id FROM facilities 
      WHERE manager_id = auth.uid()
    )
  );

-- Clinician: see own facility only
CREATE POLICY clinician_view ON medicines
  FOR SELECT
  USING (auth.jwt() ->> 'facility_id' IS NOT NULL);
```

## Testing Integration

### Integration Test Template

```typescript
// __tests__/integration/pharmaceutical-dashboard.test.ts

describe('Pharmaceutical Dashboard Integration', () => {
  it('should load medicine stock for facility', async () => {
    const stock = await pharmaClient.getStockStatus(facilityId)
    expect(stock).toBeDefined()
    expect(stock.length).toBeGreaterThan(0)
  })
  
  it('should update alerts in real-time', async () => {
    // Create alert
    // Verify it appears in dashboard immediately
  })
  
  it('should filter data by facility', async () => {
    // Different facilities should see only their data
  })
})
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase RLS policies updated
- [ ] Role-based filters implemented
- [ ] Real-time subscriptions tested
- [ ] API endpoints tested
- [ ] Component integration tested
- [ ] Dashboard links updated
- [ ] User permissions assigned
- [ ] Staff training completed
- [ ] Performance monitored

## Monitoring Integration Health

### Key Metrics to Monitor

```typescript
// /lib/monitoring/pharmaceutical-health.ts

export async function monitorPharmaceuticalHealth() {
  const metrics = {
    api_response_time: getAverageResponseTime(),
    database_query_time: getAverageQueryTime(),
    active_users: getActiveUserCount(),
    alert_generation_rate: getAlertRate(),
    data_freshness: getDataAge(),
  }
  
  return metrics
}
```

## Conclusion

The pharmaceutical system is designed to integrate seamlessly with all existing MedSight dashboards. Each dashboard can consume only the features it needs, from simple widgets to full-page management interfaces.

The modular API design ensures that dashboards remain independent while sharing the same underlying pharmaceutical data infrastructure.

For specific integration questions, refer to the individual dashboard documentation and the API reference in SETUP_GUIDE.md.
