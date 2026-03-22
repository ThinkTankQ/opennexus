import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const facilityId = searchParams.get('facility_id');
  const days = parseInt(searchParams.get('days') || '30');

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get stock status overview
    const { data: stockStatus, error: stockError } = await supabase
      .from('facility_stock_status')
      .select('*')
      .eq('facility_id', facilityId || '');

    if (stockError && facilityId) throw stockError;

    // Get consumption trends
    const { data: consumption, error: consumptionError } = await supabase
      .from('dispensing_logs')
      .select(`
        *,
        medicines(medicine_name, form),
        facilities(facility_name)
      `)
      .gte('dispensed_date', startDate.toISOString().split('T')[0]);

    if (consumptionError) throw consumptionError;

    // Get price trends
    const { data: prices, error: priceError } = await supabase
      .from('medicine_pricing')
      .select(`
        *,
        medicines(medicine_name)
      `)
      .gte('price_date', startDate.toISOString().split('T')[0]);

    if (priceError) throw priceError;

    // Calculate summary statistics
    const summary = {
      totalMedicines: stockStatus?.length || 0,
      lowStockCount: stockStatus?.filter((s: any) => 
        s.stock_status === 'LOW_STOCK' || s.stock_status === 'STOCKOUT'
      ).length || 0,
      totalConsumption: consumption?.reduce((sum: number, c: any) => 
        sum + (c.quantity_dispensed || 0), 0) || 0,
      priceIncreases: prices?.filter((p: any) => p.price_change_percentage > 0).length || 0,
      priceDecreases: prices?.filter((p: any) => p.price_change_percentage < 0).length || 0,
    };

    // Group consumption by medicine
    const consumptionByMedicine = consumption?.reduce((acc: any, curr: any) => {
      const key = curr.medicine_id;
      if (!acc[key]) {
        acc[key] = {
          medicine_name: curr.medicines?.medicine_name,
          total_quantity: 0,
          dispensing_count: 0,
        };
      }
      acc[key].total_quantity += curr.quantity_dispensed;
      acc[key].dispensing_count += 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      summary,
      stockStatus,
      consumption,
      consumptionByMedicine: Object.values(consumptionByMedicine),
      prices,
      timeFrame: {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        days,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
