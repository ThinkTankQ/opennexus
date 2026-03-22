# Pharmaceutical Management System

A comprehensive database, API, and web application for managing pharmaceutical medicines, pricing, inventory, and analytics for healthcare facilities in Botswana.

## Overview

This system provides:
- **Database Schema**: PostgreSQL-based relational database for medicines, pricing, inventory, facilities, and dispensing logs
- **RESTful API**: Endpoints for medicines, facility stock, pricing, stock alerts, and analytics
- **Web Application**: User-friendly interface for medicine catalog, inventory management, and analytics
- **Utilities**: Pharmacy calculation functions for stock analysis, consumption forecasting, and risk assessment

## Database Schema

### Core Tables

#### `medicines`
Stores medicine information including NAPPI codes, strength, form, and ATC classification.

```sql
- id (UUID, PK)
- nappi_code (VARCHAR, UNIQUE)
- medicine_name (VARCHAR)
- generic_name (VARCHAR)
- strength (VARCHAR)
- form (VARCHAR)
- manufacturer (VARCHAR)
- atc_code (VARCHAR, FK)
- is_essential_medicine (BOOLEAN)
- storage_requirements (TEXT)
- shelf_life_months (INTEGER)
```

#### `atc_codes`
ATC classification codes for medicines (WHO standard).

```sql
- id (UUID, PK)
- code (VARCHAR, UNIQUE)
- level (VARCHAR)
- description (TEXT)
```

#### `suppliers`
Supplier and manufacturer information.

```sql
- id (UUID, PK)
- supplier_name (VARCHAR)
- contact_person (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- is_active (BOOLEAN)
```

#### `medicine_pricing`
Medicine pricing from different suppliers with historical tracking.

```sql
- id (UUID, PK)
- medicine_id (UUID, FK)
- supplier_id (UUID, FK)
- unit_price (DECIMAL)
- currency (VARCHAR, default: 'BWP')
- pack_size (INTEGER)
- price_date (DATE)
- effective_from (DATE)
- effective_until (DATE)
```

#### `facilities`
Healthcare facilities across Botswana.

```sql
- id (UUID, PK)
- facility_name (VARCHAR)
- facility_type (VARCHAR) -- Hospital, Clinic, etc.
- district (VARCHAR)
- region (VARCHAR)
- is_active (BOOLEAN)
- manager_name (VARCHAR)
```

#### `facility_stock`
Current medicine inventory levels at each facility.

```sql
- id (UUID, PK)
- facility_id (UUID, FK)
- medicine_id (UUID, FK)
- quantity_on_hand (INTEGER)
- reorder_level (INTEGER)
- maximum_stock_level (INTEGER)
- last_received_date (DATE)
- last_counted_date (DATE)
- expiry_date (DATE)
- batch_number (VARCHAR)
- UNIQUE(facility_id, medicine_id)
```

#### `dispensing_logs`
Record of medicine dispensing/consumption.

```sql
- id (UUID, PK)
- facility_id (UUID, FK)
- medicine_id (UUID, FK)
- quantity_dispensed (INTEGER)
- dispensed_date (DATE)
- dispensed_by (VARCHAR)
- patient_age_group (VARCHAR)
- diagnosis (VARCHAR)
- prescription_id (VARCHAR)
```

#### `stock_movements`
Track all stock movements (received, issued, adjusted, lost).

```sql
- id (UUID, PK)
- facility_id (UUID, FK)
- medicine_id (UUID, FK)
- movement_type (VARCHAR) -- RECEIVED, ISSUED, ADJUSTMENT, LOSS
- quantity (INTEGER)
- movement_date (DATE)
- reference_number (VARCHAR)
```

#### `stock_alerts`
Alerts for low stock, stockouts, and expiring medicines.

```sql
- id (UUID, PK)
- facility_id (UUID, FK)
- medicine_id (UUID, FK)
- alert_type (VARCHAR) -- STOCKOUT, LOW_STOCK, EXPIRY_SOON, EXPIRED
- alert_status (VARCHAR) -- OPEN, ACKNOWLEDGED, RESOLVED
- current_stock_level (INTEGER)
- reorder_level (INTEGER)
- expiry_date (DATE)
```

#### `shipments` & `shipment_items`
Track medicine shipments from suppliers to facilities.

### Views

#### `medicine_with_pricing`
Combines medicine details with current pricing information.

#### `facility_stock_status`
Shows current stock status with calculated status (STOCKOUT, LOW_STOCK, ADEQUATE, OVERSTOCKED).

## API Endpoints

### Medicines
- `GET /api/medicines` - List all medicines with search and pagination
- `POST /api/medicines` - Create new medicine record

**Query Parameters:**
- `search`: Search by name, generic name, or NAPPI code
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Facility Stock
- `GET /api/facility-stock` - Get stock levels with status
- `POST /api/facility-stock` - Add new stock record
- `PATCH /api/facility-stock` - Update stock levels

**Query Parameters:**
- `facility_id`: Filter by facility
- `medicine_id`: Filter by medicine

### Medicine Pricing
- `GET /api/medicine-pricing` - Get pricing information
- `POST /api/medicine-pricing` - Add new pricing record

**Query Parameters:**
- `medicine_id`: Filter by medicine
- `supplier_id`: Filter by supplier

### Stock Alerts
- `GET /api/stock-alerts` - Get active alerts
- `POST /api/stock-alerts` - Create new alert
- `PATCH /api/stock-alerts` - Update alert status

**Query Parameters:**
- `facility_id`: Filter by facility
- `alert_status`: Filter by status (OPEN, ACKNOWLEDGED, RESOLVED)
- `alert_type`: Filter by alert type

### Analytics
- `GET /api/analytics` - Get comprehensive analytics data

**Query Parameters:**
- `facility_id`: Specific facility (optional)
- `days`: Time period (default: 30)

## Web Application Pages

### `/medicines` - Medicine Catalog
Browse and search all available medicines with details about strength, form, manufacturer, and pricing.

**Features:**
- Full-text search by medicine name, generic name, or NAPPI code
- Filter by medicine form (Tablet, Capsule, etc.)
- Advanced filtering options
- Medicine detail view with pricing and stock information

### `/medicines/[id]` - Medicine Details
Detailed view of a single medicine including:
- Medicine information and specifications
- Pricing from different suppliers
- Stock levels across facilities
- DDD values and storage requirements

### `/inventory` - Inventory Management
Monitor and manage medicine stock across facilities.

**Features:**
- Real-time stock level monitoring
- Alerts for low stock and stockouts
- Expiry date tracking
- Facility filtering
- Medicine search
- Status filtering (Adequate, Low Stock, Stockout, Expiry Soon)

### `/analytics` - Analytics Dashboard
Comprehensive analytics with visualizations:
- Total medicines count
- Low stock items count
- Consumption trends
- Price change analysis
- Stock status distribution
- Top consumed medicines
- Key insights and alerts

## Utility Functions (`lib/pharmacy-utils.ts`)

### Stock Analysis Functions

```typescript
calculateDaysOfStock(quantityOnHand, dailyConsumption)
// Calculate how many days of stock remain

calculateAverageDailyConsumption(dispensingLogs, daysToAnalyze)
// Calculate average daily consumption from dispensing logs

getStockStatus(quantityOnHand, reorderLevel, maximumLevel)
// Determine stock status: STOCKOUT, LOW_STOCK, ADEQUATE, OVERSTOCKED

calculateRiskScore(stockStatus, daysOfStock, expiryDaysRemaining)
// Calculate risk score (0-100) for stock management decisions

calculateReorderQuantity(averageDailyConsumption, leadTimeDays, maximumStockLevel)
// Calculate optimal reorder quantity
```

### Pricing Functions

```typescript
calculatePriceTrend(priceHistory)
// Analyze price trends and calculate percentage change

isCriticalMedicine(isEssentialMedicine, quantityOnHand, reorderLevel)
// Identify critical medicines needing immediate attention
```

## Data Import

### Process Data Script (`scripts/process_pharmaceutical_data.py`)
Processes CSV files containing medicine and pricing data:
1. Loads medicine price list CSV
2. Loads NAPPI prices CSV
3. Deduplicates medicines by NAPPI code
4. Merges pricing data
5. Exports to JSON format for Supabase import

### Import Data Script (`scripts/import-pharmaceutical-data.mjs`)
Node.js script to import processed data into Supabase with Supabase client library.

## Row Level Security (RLS)

All main tables have RLS enabled with public read access:
```sql
CREATE POLICY "Allow all read access" ON medicines FOR SELECT USING (true);
```

For production, update these policies to restrict access by user role and facility.

## Usage Examples

### Search for Medicines
```bash
curl "http://localhost:3000/api/medicines?search=paracetamol&limit=10"
```

### Get Facility Stock
```bash
curl "http://localhost:3000/api/facility-stock?facility_id=<facility-id>"
```

### Get Analytics
```bash
curl "http://localhost:3000/api/analytics?facility_id=<facility-id>&days=30"
```

### Create Stock Alert
```bash
curl -X POST "http://localhost:3000/api/stock-alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": "<facility-id>",
    "medicine_id": "<medicine-id>",
    "alert_type": "LOW_STOCK",
    "alert_status": "OPEN",
    "current_stock_level": 50,
    "reorder_level": 100
  }'
```

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for server-side operations

## Security Considerations

1. **Row Level Security**: Enable RLS policies for multi-tenant scenarios
2. **API Authentication**: Add authentication middleware for production
3. **Data Validation**: Input validation on all endpoints
4. **Rate Limiting**: Implement rate limiting on public endpoints
5. **Data Privacy**: Ensure compliance with health data privacy regulations

## Future Enhancements

1. **Real-time Alerts**: WebSocket integration for immediate stock notifications
2. **Forecasting**: Machine learning models for demand forecasting
3. **Optimization**: Algorithm for optimal stock level recommendations
4. **Mobile App**: Native mobile application for facilities
5. **Integration**: APIs for third-party health systems
6. **Reporting**: Advanced reporting and export capabilities

## Support

For questions or issues:
- Check the API documentation in each route file
- Review utility function documentation in `lib/pharmacy-utils.ts`
- Examine the database schema in `scripts/01-create-schema.sql`
