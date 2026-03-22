import { createClient } from '@/lib/supabase/server'

// Sample facilities for Botswana
export const SAMPLE_FACILITIES = [
  {
    facility_name: 'Gaborone Central Hospital',
    facility_type: 'Hospital',
    district: 'Gaborone',
    region: 'South-East',
    manager_name: 'Dr. Thabo Masilo',
    contact_phone: '+267-3916000',
  },
  {
    facility_name: 'Francistown Primary Hospital',
    facility_type: 'Hospital',
    district: 'Francistown',
    region: 'Central',
    manager_name: 'Dr. Lebile Seroke',
    contact_phone: '+267-2416000',
  },
  {
    facility_name: 'Molepolole Primary Hospital',
    facility_type: 'Hospital',
    district: 'Molepolole',
    region: 'South-Central',
    manager_name: 'Dr. Kago Ramokone',
    contact_phone: '+267-5911000',
  },
  {
    facility_name: 'Selibe Phikwe Health Centre',
    facility_type: 'Health Centre',
    district: 'Selibe-Phikwe',
    region: 'Central',
    manager_name: 'Nurse Palesa Sekgosi',
    contact_phone: '+267-2600300',
  },
  {
    facility_name: 'Kasane Health Clinic',
    facility_type: 'Clinic',
    district: 'Kasane',
    region: 'North-West',
    manager_name: 'Nurse Thandi Mthembu',
    contact_phone: '+267-6250800',
  },
]

// Sample ATC codes for key disease areas
export const SAMPLE_ATC_CODES = [
  { code: 'A01', level: '1', description: 'Stomatological preparations' },
  { code: 'A02', level: '1', description: 'Antacids' },
  { code: 'J01', level: '1', description: 'Antibacterials for systemic use' },
  { code: 'J01CA', level: '3', description: 'Beta-lactam antibacterials, penicillins' },
  { code: 'J01CA04', level: '5', description: 'Amoxicillin' },
  { code: 'L01', level: '1', description: 'Antineoplastic agents' },
  { code: 'P01', level: '1', description: 'Antiprotozoals' },
  { code: 'P01B', level: '2', description: 'Antimalarials' },
  { code: 'P01BB', level: '3', description: 'Blood schizontocides' },
  { code: 'P01BB01', level: '5', description: 'Chloroquine' },
  { code: 'C02', level: '1', description: 'Antihypertensives' },
  { code: 'C02AC', level: '3', description: 'Selective alpha-1-adrenoreceptor agonists' },
  { code: 'C03', level: '1', description: 'Diuretics' },
]

// Sample suppliers
export const SAMPLE_SUPPLIERS = [
  {
    supplier_name: 'Central Medical Stores',
    contact_person: 'Mr. Thabo Nkomo',
    email: 'contact@cms.org.bw',
    phone: '+267-3970500',
    address: 'Unit 3 Plot 5, Fairgrounds',
    city: 'Gaborone',
    country: 'Botswana',
  },
  {
    supplier_name: 'Pharmalogic Solutions',
    contact_person: 'Ms. Mpilo Dlamini',
    email: 'sales@pharmalogic.bw',
    phone: '+267-3912345',
    address: 'Suite 201, Building A, Industrial Park',
    city: 'Gaborone',
    country: 'Botswana',
  },
  {
    supplier_name: 'Global Pharmaceuticals',
    contact_person: 'Dr. Ahmed Hassan',
    email: 'procurement@globalpharm.com',
    phone: '+44-2071234567',
    address: '123 Pharma Avenue',
    city: 'London',
    country: 'United Kingdom',
  },
]

export async function seedFacilities() {
  const supabase = await createClient()

  for (const facility of SAMPLE_FACILITIES) {
    const { error } = await supabase
      .from('facilities')
      .insert([{ ...facility, is_active: true }])
      .select()

    if (error && !error.message.includes('duplicate')) {
      console.error('[v0] Error seeding facility:', error)
    }
  }

  console.log('[v0] Facilities seeded successfully')
}

export async function seedATCCodes() {
  const supabase = await createClient()

  for (const atc of SAMPLE_ATC_CODES) {
    const { error } = await supabase
      .from('atc_codes')
      .insert([atc])
      .select()

    if (error && !error.message.includes('duplicate')) {
      console.error('[v0] Error seeding ATC code:', error)
    }
  }

  console.log('[v0] ATC codes seeded successfully')
}

export async function seedSuppliers() {
  const supabase = await createClient()

  for (const supplier of SAMPLE_SUPPLIERS) {
    const { error } = await supabase
      .from('suppliers')
      .insert([{ ...supplier, is_active: true }])
      .select()

    if (error && !error.message.includes('duplicate')) {
      console.error('[v0] Error seeding supplier:', error)
    }
  }

  console.log('[v0] Suppliers seeded successfully')
}
