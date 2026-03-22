import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { calculatePriceTrend } from '@/lib/pharmacy-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const medicineId = searchParams.get('medicine_id');
  const supplierId = searchParams.get('supplier_id');

  try {
    let query = supabase
      .from('medicine_pricing')
      .select(`
        *,
        medicines(medicine_name, nappi_code),
        suppliers(supplier_name)
      `);

    if (medicineId) {
      query = query.eq('medicine_id', medicineId);
    }

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }

    const { data, error } = await query.order('price_date', { ascending: false });

    if (error) throw error;

    // Calculate price trends
    const withTrends = data?.map((item: any) => ({
      ...item,
      trend: calculatePriceTrend([
        { price: item.unit_price, date: new Date(item.price_date) },
      ]),
    }));

    return NextResponse.json(withTrends);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('medicine_pricing')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
