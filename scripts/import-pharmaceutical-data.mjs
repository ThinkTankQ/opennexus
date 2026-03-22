#!/usr/bin/env node
/**
 * Pharmaceutical Data Import Script
 * Imports medicine data from CSV files into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.join(__dirname, '..');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('[v0] Error: Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    console.log('[v0] Starting pharmaceutical data import...');
    
    // Sample data for demonstration
    // In production, you would read from actual CSV files
    const medicines = [
      {
        nappi_code: 'MED001',
        medicine_name: 'Paracetamol 500mg',
        generic_name: 'Paracetamol',
        strength: '500mg',
        form: 'Tablet',
        manufacturer: 'Local Pharma',
        atc_code: 'N02BE01',
        is_essential_medicine: true,
        unit_price: 0.50,
        currency: 'BWP',
        pack_size: 100,
      },
      {
        nappi_code: 'MED002',
        medicine_name: 'Amoxicillin 500mg',
        generic_name: 'Amoxicillin',
        strength: '500mg',
        form: 'Capsule',
        manufacturer: 'Generic Pharma',
        atc_code: 'J01CA04',
        is_essential_medicine: true,
        unit_price: 1.20,
        currency: 'BWP',
        pack_size: 30,
      },
    ];

    // Insert medicines
    console.log('[v0] Importing medicines...');
    const { data: medicineData, error: medicineError } = await supabase
      .from('medicines')
      .insert(
        medicines.map(m => ({
          nappi_code: m.nappi_code,
          medicine_name: m.medicine_name,
          generic_name: m.generic_name,
          strength: m.strength,
          form: m.form,
          manufacturer: m.manufacturer,
          atc_code: m.atc_code,
          is_essential_medicine: m.is_essential_medicine,
        }))
      )
      .select();

    if (medicineError) {
      console.log('[v0] Error importing medicines:', medicineError.message);
    } else {
      console.log(`[v0] Successfully imported ${medicineData?.length || 0} medicines`);
    }

    // Add sample facilities
    console.log('[v0] Importing sample facilities...');
    const facilities = [
      {
        facility_name: 'Central Hospital',
        facility_type: 'Hospital',
        district: 'Gaborone',
        region: 'South East',
        is_active: true,
        manager_name: 'Dr. Khumoetsile',
      },
      {
        facility_name: 'Primary Health Clinic',
        facility_type: 'Clinic',
        district: 'Francistown',
        region: 'Central',
        is_active: true,
        manager_name: 'Sister Naledi',
      },
    ];

    const { data: facilityData, error: facilityError } = await supabase
      .from('facilities')
      .insert(facilities)
      .select();

    if (facilityError) {
      console.log('[v0] Error importing facilities:', facilityError.message);
    } else {
      console.log(`[v0] Successfully imported ${facilityData?.length || 0} facilities`);
    }

    console.log('[v0] Data import complete!');
  } catch (error) {
    console.error('[v0] Fatal error during import:', error);
    process.exit(1);
  }
}

importData();
