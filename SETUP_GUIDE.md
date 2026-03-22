# MedSight Botswana - Pharmaceutical System Setup Guide

## Quick Start

This guide walks you through setting up and deploying the Pharmaceutical Management System for the MedSight Botswana platform.

## Prerequisites

- Node.js 18+
- Supabase account (free or paid)
- Git
- pnpm or npm

## Environment Variables

The following environment variables are required in your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These will be automatically added when you connect your Supabase integration in the v0 settings.

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the URL and Anon Key to your environment variables

### 2. Run Database Migrations

The database schema has already been created via SQL migration with the following tables:

- **medicines** - Medicine catalog with NAPPI codes
- **atc_codes** - WHO ATC classification codes
- **suppliers** - Pharmaceutical suppliers
- **medicine_pricing** - Price history and supplier pricing
- **facilities** - Healthcare facilities across Botswana
- **facility_stock** - Current inventory levels
- **dispensing_logs** - Medicine consumption records
- **stock_movements** - Inventory transaction history
- **stock_alerts** - Low stock and expiry alerts
- **shipments** - Medicine delivery tracking
- **price_history** - Price change records

### 3. Seed Initial Data

To seed the database with sample facilities, suppliers, and ATC codes:

```bash
curl -X POST http://localhost:3000/api/seed
```

This will create:
- 5 sample healthcare facilities
- 3 sample suppliers
- 13 sample ATC codes

## Import Pharmaceutical Data

### From CSV Files

The system includes data import utilities for the provided CSV files:

1. **Medicine Price List 2026** - Contains medicine names, strengths, forms, and pricing
2. **NAPPI Prices** - Contains NAPPI codes and pharmaceutical pricing data

To import medicines from your CSV data:

```javascript
// Example import in browser console or via API
const medicines = [
  {
    nappi_code: "6007502",
    medicine_name: "Amoxicillin",
    generic_name: "Amoxicillin",
    strength: "500mg",
    form: "Capsule",
    manufacturer: "Cipla Limited",
    atc_code: "J01CA04",
    is_essential_medicine: true
  }
  // ... more medicines
];

await fetch('/api/medicines/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ medicines })
});
```

## Core Features

### 1. Medicine Catalog (`/medicines`)
- Search by medicine name, NAPPI code, or generic name
- Filter by form (tablet, capsule, injection, etc.)
- View medicine details, pricing, and stock across facilities
- Real-time availability status

**API Endpoint:** `GET /api/medicines?search=amoxicillin&limit=50`

### 2. Inventory Management (`/inventory`)
- Real-time stock monitoring across all facilities
- Alert system for low stock and stockouts
- Facility-based filtering
- Stock status visualization
- Quick actions for stock adjustments

**API Endpoint:** `GET /api/facility-stock?facility_id=uuid`

### 3. Medicine Pricing (`/medicines`)
- Track pricing across suppliers
- Price history and trends
- Bulk pricing analysis
- Procurement planning

**API Endpoint:** `GET /api/medicine-pricing?medicine_id=uuid`

### 4. Analytics Dashboard (`/analytics`)
- Consumption trends by medicine
- Stock status distribution
- Price change analysis
- Top medicines by usage
- Risk scoring

**API Endpoint:** `GET /api/analytics?facility_id=uuid&period=30days`

### 5. Stock Alerts System
- Real-time alert generation
- Alert types: LOW_STOCK, STOCKOUT, EXPIRED, EXPIRY_SOON
- Facility-specific alerts
- Alert status tracking (OPEN, RESOLVED)

**API Endpoint:** `GET /api/stock-alerts?status=OPEN`

## API Reference

### GET /api/medicines
Search and list medicines
```
Query Parameters:
  - search: string (optional) - Search medicine name
  - limit: number (default: 50) - Results per page
  - atc_code: string (optional) - Filter by ATC code
  - form: string (optional) - Filter by form

Response:
{
  data: [
    {
      id: string,
      nappi_code: string,
      medicine_name: string,
      generic_name: string,
      strength: string,
      form: string,
      manufacturer: string,
      atc_code: string,
      is_essential_medicine: boolean
    }
  ]
}
```

### GET /api/facility-stock
Get facility inventory
```
Query Parameters:
  - facility_id: string (optional) - Filter by facility
  - medicine_id: string (optional) - Filter by medicine
  - status: string (optional) - Filter by stock status (OK, LOW_STOCK, STOCKOUT, EXPIRED, EXPIRY_SOON)

Response:
{
  data: [
    {
      id: string,
      facility_id: string,
      medicine_id: string,
      quantity_on_hand: number,
      reorder_level: number,
      maximum_stock_level: number,
      expiry_date: string,
      stock_status: string
    }
  ]
}
```

### GET /api/medicine-pricing
Get pricing information
```
Query Parameters:
  - medicine_id: string (optional) - Filter by medicine
  - supplier_id: string (optional) - Filter by supplier
  - date_from: string (optional) - ISO date
  - date_to: string (optional) - ISO date

Response:
{
  data: [
    {
      id: string,
      medicine_id: string,
      unit_price: number,
      pack_size: number,
      supplier_id: string,
      price_date: string,
      currency: string
    }
  ]
}
```

### GET /api/stock-alerts
Get stock alerts
```
Query Parameters:
  - facility_id: string (optional) - Filter by facility
  - status: string (optional) - OPEN or RESOLVED
  - alert_type: string (optional) - LOW_STOCK, STOCKOUT, EXPIRED, EXPIRY_SOON

Response:
{
  data: [
    {
      id: string,
      facility_id: string,
      medicine_id: string,
      alert_type: string,
      alert_status: string,
      current_stock_level: number,
      reorder_level: number,
      alert_message: string,
      created_at: string
    }
  ]
}
```

### GET /api/analytics
Get analytics data
```
Query Parameters:
  - facility_id: string (optional) - Filter by facility
  - period: string (default: 30days) - Analysis period
  - metric: string (optional) - consumption, pricing, stock_status

Response:
{
  consumption_trends: [{ medicine_name, quantity, days }],
  stock_status_distribution: { ok, low_stock, stockout, expired },
  price_analysis: [{ medicine_name, avg_price, price_change_percentage }],
  top_medicines: [{ id, name, quantity_dispensed }],
  risk_scores: [{ facility_id, risk_level, reason }]
}
```

### POST /api/medicines/import
Import medicines from CSV data
```
Body:
{
  medicines: [
    {
      nappi_code: string,
      medicine_name: string,
      generic_name: string,
      strength: string,
      form: string,
      manufacturer: string,
      atc_code: string,
      is_essential_medicine: boolean
    }
  ]
}

Response:
{
  message: "Medicines imported successfully",
  count: number,
  timestamp: string
}
```

### POST /api/seed
Seed database with sample data (Development only)
```
Response:
{
  message: "Database seeded successfully",
  timestamp: string
}
```

## Utility Functions

The system includes 12+ utility functions in `/lib/pharmacy-utils.ts`:

- `calculateDaysOfStock()` - Calculate days of stock based on consumption
- `getAverageDailyConsumption()` - Calculate ADC from dispensing logs
- `getStockStatus()` - Determine stock status (OK, LOW_STOCK, STOCKOUT, etc.)
- `calculateRiskScore()` - Risk assessment for inventory
- `calculateReorderQuantity()` - Recommend reorder quantity
- `getPriceTrend()` - Analyze price changes
- `formatStockAlert()` - Format alert messages
- And more...

## Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### Production Notes

- The `/api/seed` endpoint is disabled in production
- All database operations use Row Level Security (RLS) for security
- API requests are optimized with database indexes on common queries
- Real-time subscriptions can be added for live stock updates

## Troubleshooting

### No medicines appearing in catalog

1. Check Supabase connection: `echo $NEXT_PUBLIC_SUPABASE_URL`
2. Seed sample data: `curl -X POST http://localhost:3000/api/seed`
3. Check if medicines table has data: Supabase dashboard → medicines table

### Stock alerts not showing

1. Verify facility_stock records exist
2. Check that quantity_on_hand ≤ reorder_level
3. Verify expiry_date is set and <= 30 days from today

### API returns 500 errors

1. Check Supabase status page
2. Verify RLS policies allow SELECT on all tables
3. Check browser console for detailed error messages

## Architecture

```
/app
  /medicines              - Medicine catalog pages
  /inventory             - Inventory management
  /analytics             - Analytics dashboard
  /api
    /medicines           - Medicine search API
    /facility-stock      - Inventory API
    /medicine-pricing    - Pricing API
    /stock-alerts        - Alerts API
    /analytics           - Analytics API
    /medicines/import    - Import API
    /seed               - Database seeding

/lib
  /supabase
    /client.ts          - Browser Supabase client
    /server.ts          - Server Supabase client
  /hooks
    /use-medicines.ts   - Medicine data hooks
    /use-inventory.ts   - Inventory data hooks
  /pharmacy-utils.ts    - Utility functions
  /seed-utils.ts        - Seeding utilities

/components
  /pharmaceutical
    /medicine-search.tsx        - Search component
    /stock-status-badge.tsx     - Stock status display
    /stock-alert-card.tsx       - Alert card component
```

## Next Steps

1. Import your pharmaceutical data (CSV files)
2. Create facility and supplier records
3. Add initial stock levels for each facility
4. Test alerts by setting reorder levels
5. Monitor analytics dashboard
6. Train users on each role-specific dashboard

## Support

For issues or questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review the API endpoints in the code
3. Check browser console for error messages
4. Review Supabase logs in the dashboard
