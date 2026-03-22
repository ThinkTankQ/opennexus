# Pharmaceutical Management System - Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │ Medicine         │  │ Inventory        │  │ Analytics        │
│  │ Catalog Page     │  │ Management Page  │  │ Dashboard        │
│  │ /medicines       │  │ /inventory       │  │ /analytics       │
│  └─────────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
│            │                     │                     │
│  ┌─────────▼─────────────────────▼─────────────────────▼────────┐
│  │          React Components & Custom Hooks                     │
│  ├─────────────────────────────────────────────────────────────┤
│  │ • MedicineSearch         • useMedicines()                    │
│  │ • StockStatusBadge       • useMedicineDetail()               │
│  │ • StockAlertCard         • useFacilityStock()                │
│  │ • PharmaceuticalNav      • useStockAlerts()                  │
│  └─────────────────────────────────────────────────────────────┘
│            │
└────────────┼──────────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────────────┐
│            Network Layer (HTTP/HTTPS)                            │
├─────────────────────────────────────────────────────────────────┤
│  RESTful API Requests with JSON                                 │
│  • GET /api/medicines                                           │
│  • GET /api/facility-stock                                      │
│  • GET /api/medicine-pricing                                    │
│  • GET /api/stock-alerts                                        │
│  • GET /api/analytics                                           │
│  • POST /api/medicines/import                                   │
│  • POST /api/seed                                               │
└────────────┬──────────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────────────┐
│            API Layer (Next.js Route Handlers)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Medicines   │  │ Facility     │  │ Pricing      │           │
│  │  API Router  │  │ Stock API    │  │ API Router   │           │
│  │  - Search    │  │ - Filter     │  │ - Trends     │           │
│  │  - Import    │  │ - Status     │  │ - Analysis   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                   │
│  ┌──────▼─────────────────▼─────────────────▼──────────────────┐
│  │                Query Optimization                           │
│  │  • Input validation (Zod schemas)                           │
│  │  • Error handling & logging                                 │
│  │  • Response formatting                                      │
│  └───────────────────────────────────────────────────────────┘
│             │
│  ┌──────────▼──────────────────────────────────────────────────┐
│  │         Supabase Client (Server-side)                       │
│  │  • Authentication                                           │
│  │  • Database connection pooling                              │
│  │  • Session management                                       │
│  └──────────┬───────────────────────────────────────────────────┘
│             │
└─────────────┼────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│            Data Layer (PostgreSQL via Supabase)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │  Medicine Data       │    │  Facility Data       │           │
│  ├──────────────────────┤    ├──────────────────────┤           │
│  │ • medicines          │    │ • facilities         │           │
│  │ • atc_codes          │    │ • facility_stock     │           │
│  │ • medicine_pricing   │    │ • stock_movements    │           │
│  │ • price_history      │    │ • dispensing_logs    │           │
│  └──────────────────────┘    └──────────────────────┘           │
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │  Supply Chain Data   │    │  Alert Data          │           │
│  ├──────────────────────┤    ├──────────────────────┤           │
│  │ • suppliers          │    │ • stock_alerts       │           │
│  │ • shipments          │    │ (types: LOW_STOCK,   │           │
│  │ • shipment_items     │    │  STOCKOUT, EXPIRED)  │           │
│  └──────────────────────┘    └──────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database Features                                        │  │
│  │  ✓ Row Level Security (RLS) on all tables                │  │
│  │  ✓ Indexes on common queries                             │  │
│  │  ✓ SQL Views for analytics                               │  │
│  │  ✓ Composite primary keys                                │  │
│  │  ✓ Foreign key relationships                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
┌─ Application
│  ├─ Pages
│  │  ├─ /medicines
│  │  │  ├─ MedicineSearch
│  │  │  ├─ MedicineCard
│  │  │  └─ Pagination
│  │  │
│  │  ├─ /medicines/[id]
│  │  │  ├─ MedicineHeader
│  │  │  ├─ PricingSection
│  │  │  ├─ StockStatus
│  │  │  └─ Charts
│  │  │
│  │  ├─ /inventory
│  │  │  ├─ AlertSummary
│  │  │  ├─ Filters
│  │  │  ├─ InventoryTable
│  │  │  │  └─ StockStatusBadge
│  │  │  └─ Actions
│  │  │
│  │  └─ /analytics
│  │     ├─ KeyMetrics
│  │     ├─ ConsumptionChart
│  │     ├─ StockDistribution
│  │     └─ RiskAssessment
│  │
│  └─ Shared Components
│     ├─ pharmaceutical-nav
│     ├─ medicine-search
│     ├─ stock-status-badge
│     └─ stock-alert-card
```

## Data Flow Diagram

### Search Flow
```
┌──────────────────┐
│ User searches    │
│ "Amoxicillin"    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ MedicineSearch Component     │
│ (Debounced input)            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ useMedicines Hook            │
│ (React + SWR caching)        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ GET /api/medicines?search=...│
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Supabase Client              │
│ (Server-side connection)     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ SELECT * FROM medicines      │
│ WHERE medicine_name ilike... │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ PostgreSQL Full-Text Search  │
│ (GIN index on name)          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Results returned as JSON     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ useMedicines stores in cache │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Components re-render         │
│ Display medicine cards       │
└──────────────────────────────┘
```

### Alert Generation Flow
```
┌──────────────────────────────────┐
│ Stock quantity updated           │
│ (Dispensing or receipt)          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ facility_stock table updated     │
│ (quantity_on_hand decreased)     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Database trigger executes        │
│ (Check alert conditions)         │
└────────┬─────────────────────────┘
         │
         ▼
   ┌─────┴──────────────────────────┐
   │                                │
   ▼                                ▼
Low Stock?                      Expiry Soon?
quantity ≤ reorder_level       expiry_date ≤ +30 days
   │ YES                           │ YES
   │                              │
   ├──────────────┬───────────────┤
   │              │               │
   ▼              ▼               ▼
Create        Create         Create
LOW_STOCK     STOCKOUT       EXPIRY_SOON
Alert         Alert           Alert
   │              │               │
   └──────────────┼───────────────┘
                  │
                  ▼
        ┌─────────────────────────┐
        │ INSERT INTO stock_alerts│
        │ (alert_type, facility)  │
        └────────┬────────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │ useStockAlerts Hook     │
        │ fetches alerts          │
        └────────┬────────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │ StockAlertCard renders  │
        │ on /inventory page      │
        └─────────────────────────┘
```

## State Management Architecture

```
┌─────────────────────────────────────────┐
│  Component State (Local)                │
│  • Search input value                   │
│  • Selected filters                     │
│  • UI toggles (modal open/close)        │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Hook State (SWR Caching)               │
│  • medicines cache                      │
│  • facility_stock cache                 │
│  • stock_alerts cache                   │
│  • auto-revalidation on focus           │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Server State (Database)                │
│  • medicines table                      │
│  • facility_stock table                 │
│  • dispensing_logs table                │
│  • stock_alerts table                   │
│  • Single source of truth               │
└─────────────────────────────────────────┘
```

## Database Table Relationships

```
┌─────────────────┐
│   facilities    │
├─────────────────┤
│ id (PK)         │
│ facility_name   │
│ district        │
│ region          │
└────────┬────────┘
         │ 1:N
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
   ┌──────────────────┐      ┌──────────────────┐
   │facility_stock    │      │ dispensing_logs  │
   ├──────────────────┤      ├──────────────────┤
   │id (FK)           │      │id                │
   │facility_id (FK)  │      │facility_id (FK)  │
   │medicine_id (FK)  │      │medicine_id (FK)  │
   │quantity_on_hand  │      │quantity_dispensed│
   │reorder_level     │      │dispensed_date    │
   │expiry_date       │      └──────────────────┘
   └──────────────────┘

┌─────────────────┐
│   medicines     │
├─────────────────┤
│ id (PK)         │
│ nappi_code      │
│ medicine_name   │
│ generic_name    │
│ strength        │
│ form            │
│ atc_code (FK)   │
└────────┬────────┘
         │ 1:N
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌──────────────────┐    ┌──────────────────┐
│medicine_pricing  │    │stock_alerts      │
├──────────────────┤    ├──────────────────┤
│id                │    │id                │
│medicine_id (FK)  │    │facility_id (FK)  │
│supplier_id (FK)  │    │medicine_id (FK)  │
│unit_price        │    │alert_type        │
│pack_size         │    │alert_status      │
│price_date        │    │created_at        │
└──────────────────┘    └──────────────────┘

┌─────────────────┐
│  suppliers      │
├─────────────────┤
│ id (PK)         │
│ supplier_name   │
│ contact_person  │
│ email           │
│ phone           │
└─────────────────┘

┌─────────────────┐
│  atc_codes      │
├─────────────────┤
│ code (PK)       │
│ level           │
│ description     │
└─────────────────┘
```

## API Request/Response Flow

### Example: Get Stock Status

```
CLIENT REQUEST:
GET /api/facility-stock?facility_id=abc123&status=LOW_STOCK

SERVER PROCESSING:
1. Parse query parameters
2. Validate with Zod schema
3. Create Supabase client
4. Execute SQL query:
   SELECT fs.*, m.medicine_name, m.form, m.strength
   FROM facility_stock fs
   JOIN medicines m ON fs.medicine_id = m.id
   WHERE fs.facility_id = 'abc123'
     AND fs.quantity_on_hand <= fs.reorder_level
   ORDER BY fs.quantity_on_hand ASC

5. Determine stock_status via calculateStockStatus()
6. Format response

CLIENT RESPONSE:
{
  "data": [
    {
      "id": "stock-123",
      "facility_id": "fac-123",
      "medicine_id": "med-123",
      "medicine_name": "Amoxicillin",
      "form": "Capsule",
      "strength": "500mg",
      "quantity_on_hand": 15,
      "reorder_level": 40,
      "stock_status": "LOW_STOCK",
      "expiry_date": "2025-12-31"
    }
    // ... more items
  ],
  "error": null,
  "timestamp": "2025-03-22T10:30:00Z"
}

BROWSER:
1. Hook receives response
2. Updates SWR cache
3. Component re-renders
4. StockStatusBadge shows "Low Stock"
5. User sees alert
```

## Security Architecture

```
┌────────────────────────────────┐
│   Authentication Layer         │
├────────────────────────────────┤
│ • Supabase Auth (JWT tokens)   │
│ • HTTP-only cookies            │
│ • Session management           │
│ • HTTPS enforcement            │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Authorization Layer           │
├────────────────────────────────┤
│ • Role-based access control    │
│ • Row Level Security (RLS)     │
│ • Policy-based filtering       │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Validation Layer              │
├────────────────────────────────┤
│ • Input validation (Zod)       │
│ • Type checking (TypeScript)   │
│ • SQL injection prevention     │
│ • XSS protection (React)       │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Database Security             │
├────────────────────────────────┤
│ • Parameterized queries        │
│ • Row-level policies           │
│ • Encrypted credentials        │
│ • Access audit logs            │
└────────────────────────────────┘
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────┐
│  Frontend Optimization              │
├─────────────────────────────────────┤
│ • Component lazy loading            │
│ • SWR caching & deduplication       │
│ • Debounced search input            │
│ • Server-side rendering ready       │
│ • CSS-in-JS minimization            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Network Optimization               │
├─────────────────────────────────────┤
│ • API response compression (gzip)   │
│ • Pagination (limit 50-100)         │
│ • Selective field queries           │
│ • Request deduplication             │
│ • CDN for static assets             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Database Optimization              │
├─────────────────────────────────────┤
│ • Composite indexes                 │
│ • Query optimization                │
│ • Connection pooling                │
│ • Prepared statements               │
│ • Statistics & monitoring           │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────┐
│  Version Control (GitHub)            │
└────────────────┬─────────────────────┘
                 │ Push
                 ▼
┌──────────────────────────────────────┐
│  Vercel CI/CD Pipeline               │
├──────────────────────────────────────┤
│ 1. Run tests & linting               │
│ 2. Build Next.js app                 │
│ 3. Build optimizations               │
│ 4. Deploy to Vercel CDN              │
└────────────────┬─────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│  Vercel Production                   │
├──────────────────────────────────────┤
│ • Global edge network                │
│ • Automatic scaling                  │
│ • SSL/HTTPS                          │
│ • Analytics & monitoring             │
└────────────────┬─────────────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │  Supabase Backend │
         │  (PostgreSQL DB)  │
         └───────────────────┘
```

## Scalability Plan

```
Current Single-Facility: 1 facility, ~1,000 medicines, ~100 users
         ↓
Growth Stage 1: 5 facilities, ~5,000 medicines, ~500 users
         ↓
Growth Stage 2: 50 facilities, ~25,000 medicines, ~5,000 users
         ↓
National Scale: 177 facilities, ~100,000 medicines, ~50,000 users

Scaling Strategy:
• Database: Supabase auto-scaling
• API: Vercel serverless functions (auto-scale)
• Storage: CDN via Vercel
• Caching: Add Redis layer if needed
• Analytics: BigQuery integration if needed
```

---

This architecture ensures:
- **Modularity**: Independent components & services
- **Scalability**: Horizontal scaling ready
- **Security**: Multi-layer protection
- **Performance**: Optimized at all levels
- **Maintainability**: Clear separation of concerns
- **Reliability**: Error handling & redundancy
