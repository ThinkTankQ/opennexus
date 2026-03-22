#!/usr/bin/env python3
"""
Pharmaceutical Data Import Script
Processes Medicine Price List and NAPPI CSV files and imports to Supabase
"""

import csv
import os
import sys
from datetime import datetime
from typing import Dict, List, Tuple
import asyncio

try:
    import psycopg
    from psycopg import sql
except ImportError:
    print("Error: psycopg3 is required. Install it with: pip install psycopg[binary]")
    sys.exit(1)

# Get database connection string from environment
DB_URL = os.getenv("POSTGRES_URL")
if not DB_URL:
    print("Error: POSTGRES_URL environment variable not set")
    sys.exit(1)

class MedicineDataImporter:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.conn = None
        
    async def connect(self):
        """Connect to Supabase PostgreSQL"""
        try:
            self.conn = await psycopg.AsyncConnection.connect(self.db_url)
            print("[v0] Connected to Supabase PostgreSQL")
        except Exception as e:
            print(f"Error connecting to database: {e}")
            sys.exit(1)
    
    async def close(self):
        """Close database connection"""
        if self.conn:
            await self.conn.close()
    
    async def import_medicines_from_nappi(self, csv_file: str) -> int:
        """Import medicines from NAPPI CSV file"""
        print(f"[v0] Starting NAPPI import from {csv_file}")
        count = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    try:
                        # Extract data from NAPPI CSV
                        nappi_code = row.get('NAPPI Code', '').strip()
                        medicine_name = row.get('Medicine Name', '').strip()
                        generic_name = row.get('Generic Name', '').strip()
                        strength = row.get('Strength', '').strip()
                        form = row.get('Form', '').strip()
                        manufacturer = row.get('Manufacturer', '').strip()
                        
                        if not medicine_name:
                            continue
                        
                        # Insert medicine into database
                        async with self.conn.cursor() as cur:
                            await cur.execute(
                                """
                                INSERT INTO medicines 
                                (nappi_code, medicine_name, generic_name, strength, form, manufacturer)
                                VALUES (%s, %s, %s, %s, %s, %s)
                                ON CONFLICT (nappi_code) DO NOTHING
                                RETURNING id
                                """,
                                (nappi_code, medicine_name, generic_name, strength, form, manufacturer)
                            )
                            result = await cur.fetchone()
                            if result:
                                count += 1
                        
                        if count % 100 == 0:
                            await self.conn.commit()
                            print(f"[v0] Imported {count} medicines...")
                    
                    except Exception as e:
                        print(f"Error importing row: {e}")
                        continue
            
            await self.conn.commit()
            print(f"[v0] Successfully imported {count} medicines from NAPPI")
            return count
            
        except FileNotFoundError:
            print(f"Error: File not found: {csv_file}")
            return 0
    
    async def import_pricing_from_medicine_list(self, csv_file: str) -> int:
        """Import medicine pricing from Medicine Price List CSV"""
        print(f"[v0] Starting medicine pricing import from {csv_file}")
        count = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    try:
                        nappi_code = row.get('NAPPI Code', '').strip()
                        medicine_name = row.get('Medicine Name', '').strip()
                        strength = row.get('Strength', '').strip()
                        form = row.get('Form', '').strip()
                        unit_price_str = row.get('Unit Price', '0').strip()
                        pack_size_str = row.get('Pack Size', '1').strip()
                        
                        if not medicine_name or not unit_price_str:
                            continue
                        
                        # Parse numeric values
                        try:
                            unit_price = float(unit_price_str.replace(',', ''))
                            pack_size = int(pack_size_str) if pack_size_str else 1
                        except ValueError:
                            continue
                        
                        # Get medicine ID from database
                        async with self.conn.cursor() as cur:
                            await cur.execute(
                                "SELECT id FROM medicines WHERE medicine_name = %s AND strength = %s AND form = %s",
                                (medicine_name, strength, form)
                            )
                            result = await cur.fetchone()
                            
                            if result:
                                medicine_id = result[0]
                                # Insert pricing
                                await cur.execute(
                                    """
                                    INSERT INTO medicine_pricing 
                                    (medicine_id, unit_price, pack_size, price_date)
                                    VALUES (%s, %s, %s, %s)
                                    ON CONFLICT DO NOTHING
                                    """,
                                    (medicine_id, unit_price, pack_size, datetime.now().date())
                                )
                                count += 1
                        
                        if count % 100 == 0:
                            await self.conn.commit()
                            print(f"[v0] Imported {count} pricing records...")
                    
                    except Exception as e:
                        print(f"Error importing pricing row: {e}")
                        continue
            
            await self.conn.commit()
            print(f"[v0] Successfully imported {count} pricing records")
            return count
            
        except FileNotFoundError:
            print(f"Error: File not found: {csv_file}")
            return 0
    
    async def import_sample_facilities(self) -> int:
        """Import sample facilities for Botswana"""
        print("[v0] Importing sample facilities")
        
        facilities = [
            ("Gaborone Private Hospital", "General Hospital", "Gaborone", "Southeast", "+267 395 1400"),
            ("Francistown Hospital", "General Hospital", "Francistown", "Northeast", "+267 240 3200"),
            ("Maun Health Clinic", "Clinic", "Maun", "Central", "+267 686 0600"),
            ("Kasane Primary Health Care", "Clinic", "Kasane", "Northern", "+267 625 0224"),
            ("Goodhope Clinic", "Clinic", "Goodhope", "Southeast", "+267 390 1177"),
        ]
        
        count = 0
        try:
            async with self.conn.cursor() as cur:
                for name, ftype, district, region, phone in facilities:
                    await cur.execute(
                        """
                        INSERT INTO facilities 
                        (facility_name, facility_type, district, region, contact_phone)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT DO NOTHING
                        RETURNING id
                        """,
                        (name, ftype, district, region, phone)
                    )
                    result = await cur.fetchone()
                    if result:
                        count += 1
            
            await self.conn.commit()
            print(f"[v0] Imported {count} sample facilities")
            return count
        except Exception as e:
            print(f"Error importing facilities: {e}")
            return 0
    
    async def run_import(self, nappi_file: str, pricing_file: str):
        """Run complete import process"""
        await self.connect()
        try:
            # Import medicines
            medicines_count = await self.import_medicines_from_nappi(nappi_file)
            
            # Import pricing
            pricing_count = await self.import_pricing_from_medicine_list(pricing_file)
            
            # Import sample facilities
            facilities_count = await self.import_sample_facilities()
            
            print("\n" + "="*50)
            print("Import Summary:")
            print(f"  Medicines: {medicines_count}")
            print(f"  Pricing Records: {pricing_count}")
            print(f"  Facilities: {facilities_count}")
            print("="*50)
            
        finally:
            await self.close()

async def main():
    """Main entry point"""
    # Get file paths from command line or use defaults
    nappi_file = sys.argv[1] if len(sys.argv) > 1 else "user_read_only_context/text_attachments/NAppi-Prices-ikcwr.csv"
    pricing_file = sys.argv[2] if len(sys.argv) > 2 else "user_read_only_context/text_attachments/Medicine-Price-List-2026-UPDATED-hHdiV.csv"
    
    importer = MedicineDataImporter(DB_URL)
    await importer.run_import(nappi_file, pricing_file)

if __name__ == "__main__":
    asyncio.run(main())
