-- Pharmaceutical Management System Schema
-- Create tables for medicine data, pricing, inventory, and dispensing

-- Enable UUID and other extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ATC Classification Table
CREATE TABLE IF NOT EXISTS atc_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(7) UNIQUE NOT NULL,
  level VARCHAR(1) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nappi_code VARCHAR(50) UNIQUE,
  medicine_name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  strength VARCHAR(100),
  form VARCHAR(100),
  manufacturer VARCHAR(255),
  atc_code VARCHAR(7) REFERENCES atc_codes(code),
  description TEXT,
  ddd_value DECIMAL(10, 4),
  ddd_unit VARCHAR(50),
  is_essential_medicine BOOLEAN DEFAULT FALSE,
  storage_requirements TEXT,
  shelf_life_months INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for medicine searches
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines USING GIN(medicine_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicines_nappi ON medicines(nappi_code);
CREATE INDEX IF NOT EXISTS idx_medicines_generic ON medicines(generic_name);

-- Suppliers/Manufacturers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medicine Pricing Table
CREATE TABLE IF NOT EXISTS medicine_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  unit_price DECIMAL(12, 4) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BWP',
  pack_size INTEGER NOT NULL,
  unit_in_pack VARCHAR(50),
  lead_time_days INTEGER,
  minimum_order_quantity INTEGER DEFAULT 1,
  price_date DATE NOT NULL,
  effective_from DATE,
  effective_until DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_medicine ON medicine_pricing(medicine_id);
CREATE INDEX IF NOT EXISTS idx_pricing_supplier ON medicine_pricing(supplier_id);
CREATE INDEX IF NOT EXISTS idx_pricing_date ON medicine_pricing(price_date);

-- Price History Table (for tracking price changes)
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  old_price DECIMAL(12, 4),
  new_price DECIMAL(12, 4) NOT NULL,
  price_change_percentage DECIMAL(8, 2),
  change_reason VARCHAR(255),
  changed_by VARCHAR(255),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Facilities/Healthcare Centers Table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_name VARCHAR(255) NOT NULL,
  facility_type VARCHAR(100),
  district VARCHAR(100),
  region VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  contact_phone VARCHAR(20),
  manager_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Facility Stock/Inventory Table
CREATE TABLE IF NOT EXISTS facility_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  unit_of_measure VARCHAR(50),
  reorder_level INTEGER,
  maximum_stock_level INTEGER,
  last_received_date DATE,
  last_counted_date DATE,
  expiry_date DATE,
  batch_number VARCHAR(100),
  storage_location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(facility_id, medicine_id)
);

CREATE INDEX IF NOT EXISTS idx_stock_facility ON facility_stock(facility_id);
CREATE INDEX IF NOT EXISTS idx_stock_medicine ON facility_stock(medicine_id);
CREATE INDEX IF NOT EXISTS idx_stock_quantity ON facility_stock(quantity_on_hand);

-- Dispensing/Consumption Log
CREATE TABLE IF NOT EXISTS dispensing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  quantity_dispensed INTEGER NOT NULL,
  unit_of_measure VARCHAR(50),
  dispensed_date DATE NOT NULL,
  dispensed_by VARCHAR(255),
  patient_age_group VARCHAR(50),
  diagnosis VARCHAR(255),
  prescription_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispensing_facility ON dispensing_logs(facility_id);
CREATE INDEX IF NOT EXISTS idx_dispensing_medicine ON dispensing_logs(medicine_id);
CREATE INDEX IF NOT EXISTS idx_dispensing_date ON dispensing_logs(dispensed_date);

-- Stock Movements (Received/Issued)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  movement_type VARCHAR(50) NOT NULL, -- 'RECEIVED', 'ISSUED', 'ADJUSTMENT', 'LOSS'
  quantity INTEGER NOT NULL,
  unit_of_measure VARCHAR(50),
  reference_number VARCHAR(100),
  movement_date DATE NOT NULL,
  from_facility_id UUID REFERENCES facilities(id),
  to_facility_id UUID REFERENCES facilities(id),
  notes TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movements_facility ON stock_movements(facility_id);
CREATE INDEX IF NOT EXISTS idx_movements_medicine ON stock_movements(medicine_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON stock_movements(movement_date);

-- Stock Shortage Alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'STOCKOUT', 'LOW_STOCK', 'EXPIRY_SOON', 'EXPIRED'
  alert_status VARCHAR(50) DEFAULT 'OPEN', -- 'OPEN', 'ACKNOWLEDGED', 'RESOLVED'
  current_stock_level INTEGER,
  reorder_level INTEGER,
  expiry_date DATE,
  days_until_expiry INTEGER,
  alert_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_alerts_facility ON stock_alerts(facility_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON stock_alerts(alert_status);

-- Shipments/Deliveries
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  shipment_date DATE NOT NULL,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'
  total_items INTEGER,
  total_cost DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shipment Details
CREATE TABLE IF NOT EXISTS shipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id),
  quantity_ordered INTEGER NOT NULL,
  quantity_received INTEGER,
  unit_price DECIMAL(12, 4),
  line_total DECIMAL(15, 2),
  batch_number VARCHAR(100),
  expiry_date DATE,
  received_at TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispensing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create public RLS policies (for demo - adjust for production security)
CREATE POLICY "Allow all read access" ON medicines FOR SELECT USING (true);
CREATE POLICY "Allow all read access" ON medicine_pricing FOR SELECT USING (true);
CREATE POLICY "Allow all read access" ON facility_stock FOR SELECT USING (true);
CREATE POLICY "Allow all read access" ON dispensing_logs FOR SELECT USING (true);
CREATE POLICY "Allow all read access" ON stock_movements FOR SELECT USING (true);
CREATE POLICY "Allow all read access" ON stock_alerts FOR SELECT USING (true);

-- Create views for common queries
CREATE OR REPLACE VIEW medicine_with_pricing AS
SELECT 
  m.id,
  m.nappi_code,
  m.medicine_name,
  m.generic_name,
  m.strength,
  m.form,
  m.manufacturer,
  m.is_essential_medicine,
  mp.unit_price,
  mp.currency,
  mp.pack_size,
  mp.supplier_id,
  mp.price_date
FROM medicines m
LEFT JOIN medicine_pricing mp ON m.id = mp.medicine_id;

CREATE OR REPLACE VIEW facility_stock_status AS
SELECT 
  fs.id,
  fs.facility_id,
  fs.medicine_id,
  m.medicine_name,
  m.form,
  m.strength,
  fs.quantity_on_hand,
  fs.reorder_level,
  fs.maximum_stock_level,
  fs.expiry_date,
  CASE 
    WHEN fs.quantity_on_hand = 0 THEN 'STOCKOUT'
    WHEN fs.quantity_on_hand <= fs.reorder_level THEN 'LOW_STOCK'
    WHEN fs.expiry_date IS NOT NULL AND fs.expiry_date <= CURRENT_DATE THEN 'EXPIRED'
    WHEN fs.expiry_date IS NOT NULL AND fs.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRY_SOON'
    ELSE 'OK'
  END AS stock_status
FROM facility_stock fs
JOIN medicines m ON fs.medicine_id = m.id;
