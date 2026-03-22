'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface FacilityStock {
  id: string
  facility_id: string
  medicine_id: string
  quantity_on_hand: number
  unit_of_measure: string | null
  reorder_level: number | null
  maximum_stock_level: number | null
  expiry_date: string | null
  batch_number: string | null
  storage_location: string | null
}

export interface StockAlert {
  id: string
  facility_id: string
  medicine_id: string
  alert_type: string
  alert_status: string
  current_stock_level: number | null
  reorder_level: number | null
  expiry_date: string | null
  days_until_expiry: number | null
  alert_message: string | null
}

export function useFacilityStock(facilityId?: string) {
  const [stock, setStock] = useState<FacilityStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        let query = supabase
          .from('facility_stock')
          .select('*')

        if (facilityId) {
          query = query.eq('facility_id', facilityId)
        }

        const { data, error: err } = await query

        if (err) throw err
        setStock(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stock'))
        setStock([])
      } finally {
        setLoading(false)
      }
    }

    fetchStock()
  }, [facilityId])

  return { stock, loading, error }
}

export function useStockAlerts(facilityId?: string, status = 'OPEN') {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        let query = supabase
          .from('stock_alerts')
          .select('*')
          .eq('alert_status', status)

        if (facilityId) {
          query = query.eq('facility_id', facilityId)
        }

        const { data, error: err } = await query

        if (err) throw err
        setAlerts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch alerts'))
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [facilityId, status])

  return { alerts, loading, error }
}
