#!/usr/bin/env python3
"""
Pharmaceutical Data Processing and Import Script
Processes CSV files and prepares data for Supabase import
"""

import csv
import json
import sys
from pathlib import Path
from typing import Dict, List, Set

def load_medicine_price_list(filepath: str) -> List[Dict]:
    """Load Medicine Price List 2026 CSV"""
    medicines = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row or not any(row.values()):
                    continue
                medicines.append({
                    'nappi_code': row.get('NAPPI Code', '').strip(),
                    'medicine_name': row.get('Medicine Name', '').strip(),
                    'generic_name': row.get('Generic Name', '').strip(),
                    'strength': row.get('Strength', '').strip(),
                    'form': row.get('Form', '').strip(),
                    'manufacturer': row.get('Manufacturer', '').strip(),
                    'atc_code': row.get('ATC Code', '').strip(),
                    'ddd_value': float(row.get('DDD Value', 0)) if row.get('DDD Value') else None,
                    'ddd_unit': row.get('DDD Unit', '').strip(),
                    'is_essential_medicine': row.get('Essential Medicine', 'No').lower() == 'yes',
                    'storage_requirements': row.get('Storage Requirements', '').strip(),
                })
        print(f"[v0] Loaded {len(medicines)} medicines from Medicine Price List")
        return medicines
    except Exception as e:
        print(f"[v0] Error loading medicine price list: {e}")
        return []

def load_nappi_prices(filepath: str) -> List[Dict]:
    """Load NAPPI Prices CSV"""
    prices = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row or not any(row.values()):
                    continue
                prices.append({
                    'nappi_code': row.get('NAPPI Code', '').strip(),
                    'unit_price': float(row.get('Unit Price', 0)) if row.get('Unit Price') else 0,
                    'currency': row.get('Currency', 'BWP').strip(),
                    'pack_size': int(row.get('Pack Size', 1)) if row.get('Pack Size') else 1,
                    'price_date': row.get('Price Date', '').strip(),
                })
        print(f"[v0] Loaded {len(prices)} price records from NAPPI Prices")
        return prices
    except Exception as e:
        print(f"[v0] Error loading NAPPI prices: {e}")
        return []

def deduplicate_medicines(medicines: List[Dict]) -> List[Dict]:
    """Remove duplicates by NAPPI code, keeping latest"""
    seen = {}
    for med in medicines:
        nappi = med.get('nappi_code')
        if nappi and nappi not in seen:
            seen[nappi] = med
    return list(seen.values())

def merge_price_data(medicines: List[Dict], prices: List[Dict]) -> List[Dict]:
    """Merge price data into medicines"""
    price_map = {p['nappi_code']: p for p in prices if p.get('nappi_code')}
    
    for med in medicines:
        nappi = med.get('nappi_code')
        if nappi in price_map:
            price_data = price_map[nappi]
            med['unit_price'] = price_data.get('unit_price', 0)
            med['currency'] = price_data.get('currency', 'BWP')
            med['pack_size'] = price_data.get('pack_size', 1)
            med['price_date'] = price_data.get('price_date', '')
    
    return medicines

def export_for_supabase(medicines: List[Dict], output_dir: str) -> None:
    """Export processed data in Supabase-compatible format"""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Export medicines
    medicines_data = []
    for med in medicines:
        if med.get('medicine_name'):
            medicines_data.append({
                'nappi_code': med.get('nappi_code') or None,
                'medicine_name': med.get('medicine_name'),
                'generic_name': med.get('generic_name') or None,
                'strength': med.get('strength') or None,
                'form': med.get('form') or None,
                'manufacturer': med.get('manufacturer') or None,
                'atc_code': med.get('atc_code') or None,
                'ddd_value': med.get('ddd_value'),
                'ddd_unit': med.get('ddd_unit') or None,
                'is_essential_medicine': med.get('is_essential_medicine', False),
                'storage_requirements': med.get('storage_requirements') or None,
            })
    
    with open(f'{output_dir}/medicines.json', 'w', encoding='utf-8') as f:
        json.dump(medicines_data, f, indent=2, ensure_ascii=False)
    
    print(f"[v0] Exported {len(medicines_data)} medicines to {output_dir}/medicines.json")

def main():
    # Define file paths
    data_dir = Path('/vercel/share/v0-project/data')
    output_dir = Path('/vercel/share/v0-project/data/processed')
    
    # Define CSV files
    medicine_price_file = str(data_dir / 'Medicine-Price-List-2026.csv')
    nappi_price_file = str(data_dir / 'NAPPI-Prices.csv')

    
    print(f"[v0] Processing pharmaceutical data...")
    print(f"[v0] Medicine Price List: {medicine_price_file}")
    print(f"[v0] NAPPI Prices: {nappi_price_file}")
    
    # Load data
    medicines = load_medicine_price_list(medicine_price_file)
    prices = load_nappi_prices(nappi_price_file)
    
    # Process data
    medicines = deduplicate_medicines(medicines)
    medicines = merge_price_data(medicines, prices)
    
    # Export
    export_for_supabase(medicines, str(output_dir))
    
    print(f"[v0] Data processing complete!")
    print(f"[v0] Total medicines processed: {len(medicines)}")

if __name__ == '__main__':
    main()
