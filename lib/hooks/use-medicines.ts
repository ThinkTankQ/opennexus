'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Medicine {
  id: string
  nappi_code: string | null
  medicine_name: string
  generic_name: string | null
  strength: string | null
  form: string | null
  manufacturer: string | null
  atc_code: string | null
  is_essential_medicine: boolean
  description: string | null
}

export function useMedicines(searchQuery?: string, limit = 50) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        let query = supabase
          .from('medicines')
          .select('*')
          .limit(limit)

        if (searchQuery && searchQuery.trim()) {
          query = query.ilike('medicine_name', `%${searchQuery}%`)
        }

        const { data, error: err } = await query

        if (err) throw err
        setMedicines(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch medicines'))
        setMedicines([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [searchQuery, limit])

  return { medicines, loading, error }
}

export function useMedicineDetail(medicineId: string | null) {
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!medicineId) {
      setMedicine(null)
      setLoading(false)
      return
    }

    const fetchMedicine = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error: err } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', medicineId)
          .single()

        if (err) throw err
        setMedicine(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch medicine'))
        setMedicine(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [medicineId])

  return { medicine, loading, error }
}
