# MedSight Pharmaceutical System - Quick Reference

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Medicine Catalog | `/medicines` | Search and browse medicines |
| Medicine Details | `/medicines/[id]` | View pricing, availability, trends |
| Inventory Management | `/inventory` | Monitor stock levels and alerts |
| Analytics Dashboard | `/analytics` | View consumption and risk analysis |

## API Endpoints

### Search & Browse
```bash
GET /api/medicines?search=amoxicillin&form=tablet&limit=50
```

### Inventory
```bash
GET /api/facility-stock?facility_id=UUID
GET /api/facility-stock?status=LOW_STOCK
```

### Pricing
```bash
GET /api/medicine-pricing?medicine_id=UUID
GET /api/medicine-pricing?supplier_id=UUID
```

### Alerts
```bash
GET /api/stock-alerts?status=OPEN
GET /api/stock-alerts?facility_id=UUID&alert_type=STOCKOUT
```

### Analytics
```bash
GET /api/analytics?facility_id=UUID&period=30days
```

### Data Import
```bash
POST /api/medicines/import
Content-Type: application/json

{
  "medicines": [
    {
      "nappi_code": "6007502",
      "medicine_name": "Amoxicillin",
      "strength": "500mg",
      "form": "Capsule"
    }
  ]
}
```

### Seeding (Dev Only)
```bash
POST /api/seed
```

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `medicines` | Medicine master data | nappi_code, medicine_name, strength, form |
| `atc_codes` | WHO classification | code, level, description |
| `suppliers` | Pharmaceutical suppliers | supplier_name, email, phone |
| `medicine_pricing` | Pricing data | unit_price, pack_size, currency |
| `facilities` | Healthcare facilities | facility_name, district, region |
| `facility_stock` | Current inventory | quantity_on_hand, reorder_level, expiry_date |
| `stock_alerts` | Alert system | alert_type, alert_status, facility_id |
| `dispensing_logs` | Medicine usage | quantity_dispensed, dispensed_date, diagnosis |
| `stock_movements` | Inventory changes | movement_type, quantity, movement_date |
| `shipments` | Deliveries | status, expected_delivery_date, total_cost |

## Common Queries

### Find low stock medicines
```sql
SELECT m.medicine_name, fs.quantity_on_hand, fs.reorder_level
FROM facility_stock fs
JOIN medicines m ON fs.medicine_id = m.id
WHERE fs.quantity_on_hand <= fs.reorder_level
ORDER BY fs.quantity_on_hand ASC;
```

### Get expiry soon items (30 days)
```sql
SELECT m.medicine_name, f.facility_name, fs.expiry_date
FROM facility_stock fs
JOIN medicines m ON fs.medicine_id = m.id
JOIN facilities f ON fs.facility_id = f.id
WHERE fs.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND fs.expiry_date > CURRENT_DATE
ORDER BY fs.expiry_date ASC;
```

### Consumption analysis (last 30 days)
```sql
SELECT m.medicine_name, 
       SUM(dl.quantity_dispensed) as total_dispensed,
       COUNT(DISTINCT dl.facility_id) as facilities,
       AVG(dl.quantity_dispensed) as avg_per_dispensing
FROM dispensing_logs dl
JOIN medicines m ON dl.medicine_id = m.id
WHERE dl.dispensed_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY m.id, m.medicine_name
ORDER BY total_dispensed DESC
LIMIT 20;
```

### Facility stock status
```sql
SELECT f.facility_name,
       COUNT(*) as total_medicines,
       SUM(CASE WHEN fs.quantity_on_hand = 0 THEN 1 ELSE 0 END) as stockouts,
       SUM(CASE WHEN fs.quantity_on_hand <= fs.reorder_level THEN 1 ELSE 0 END) as low_stock,
       SUM(CASE WHEN fs.expiry_date <= CURRENT_DATE THEN 1 ELSE 0 END) as expired
FROM facilities f
LEFT JOIN facility_stock fs ON f.id = fs.facility_id
WHERE f.is_active = true
GROUP BY f.id, f.facility_name;
```

## Utility Functions

### Stock Analysis
```typescript
import { 
  calculateDaysOfStock,
  getAverageDailyConsumption,
  getStockStatus,
  calculateReorderQuantity 
} from '@/lib/pharmacy-utils'

// Calculate days of supply
const daysOfStock = calculateDaysOfStock(100, 5) // 20 days

// Get average daily consumption
const adc = getAverageDailyConsumption(dispensingLogs, 30)

// Determine stock status
const status = getStockStatus(50, 40, expiryDate)

// Recommend reorder quantity
const qty = calculateReorderQuantity(adc, leadTime, safetyStock)
```

## React Hooks

### Search Medicines
```typescript
import { useMedicines } from '@/lib/hooks/use-medicines'

const { medicines, loading, error } = useMedicines('amoxicillin')
```

### Get Inventory
```typescript
import { useFacilityStock, useStockAlerts } from '@/lib/hooks/use-inventory'

const { stock, loading, error } = useFacilityStock(facilityId)
const { alerts, loading, error } = useStockAlerts(facilityId, 'OPEN')
```

## Components

### Medicine Search
```typescript
<MedicineSearch 
  onSearch={(query) => setSearchQuery(query)}
  placeholder="Search medicines..."
/>
```

### Stock Status Badge
```typescript
<StockStatusBadge 
  quantity={50}
  reorderLevel={40}
  expiryDate="2025-12-31"
/>
```

### Stock Alert Card
```typescript
<StockAlertCard
  medicineName="Amoxicillin"
  alertType="LOW_STOCK"
  currentStock={15}
  reorderLevel={40}
  facilityName="Gaborone Central Hospital"
/>
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional
NODE_ENV=development
```

## Stock Status Types

| Status | Meaning | Trigger |
|--------|---------|---------|
| `OK` | Adequate stock | quantity > reorder_level |
| `LOW_STOCK` | Below reorder level | quantity <= reorder_level |
| `STOCKOUT` | No stock | quantity = 0 |
| `EXPIRED` | Past expiry date | expiry_date < today |
| `EXPIRY_SOON` | Expiring soon | expiry_date <= today + 30 days |

## Alert Types

| Alert | When | Action |
|-------|------|--------|
| `LOW_STOCK` | Stock <= reorder level | Order more |
| `STOCKOUT` | Stock = 0 | Emergency order |
| `EXPIRED` | expiry_date < today | Remove from stock |
| `EXPIRY_SOON` | expiry_date <= 30 days | Use first |
| `OVERSTOCKED` | Stock > max level | Reduce orders |

## Movement Types

| Type | Use Case |
|------|----------|
| `RECEIVED` | Incoming shipment |
| `ISSUED` | Dispensing to patients |
| `ADJUSTED` | Inventory correction |
| `TRANSFERRED` | Between facilities |
| `LOST` | Theft/damage |
| `DAMAGED` | Unusable stock |

## Troubleshooting

### No medicines showing
1. Check Supabase connection
2. Run: `curl -X POST http://localhost:3000/api/seed`
3. Check medicines table has data

### Alerts not appearing
1. Set reorder_level < quantity_on_hand
2. Set expiry_date to valid date
3. Check alert status = 'OPEN'

### Search not working
1. Verify NEXT_PUBLIC_SUPABASE_URL is set
2. Check browser console for errors
3. Ensure medicines table has data

### API returns 500
1. Check Supabase status page
2. Verify RLS policies allow SELECT
3. Check server logs for details

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Validation](https://zod.dev)

## Database Backup

```bash
# Export data from Supabase dashboard
# Settings → Backups → Export

# Or via SQL
SELECT * FROM medicines; -- export to CSV
SELECT * FROM facility_stock;
SELECT * FROM dispensing_logs;
```

## Performance Tips

1. **Use filters** - Filter by facility_id, status
2. **Limit results** - Set limit to 50-100
3. **Cache queries** - SWR hooks cache results
4. **Batch imports** - Import many medicines at once
5. **Archive old data** - Move dispensing logs > 1 year to archive

## Security Checklist

- [ ] Environment variables set in production
- [ ] Supabase RLS policies configured
- [ ] Authentication enabled in Supabase
- [ ] HTTPS enforced
- [ ] Backup strategy in place
- [ ] Access logs monitored
- [ ] API rate limiting enabled
- [ ] Input validation active

---

**For detailed information, see SETUP_GUIDE.md and PHARMACEUTICAL_SYSTEM.md**
