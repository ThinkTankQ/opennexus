import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const facilityId = searchParams.get('facility_id');
  const alertStatus = searchParams.get('alert_status');
  const alertType = searchParams.get('alert_type');

  try {
    let query = supabase
      .from('stock_alerts')
      .select(`
        *,
        facilities(facility_name, district),
        medicines(medicine_name, form, strength)
      `);

    if (facilityId) {
      query = query.eq('facility_id', facilityId);
    }

    if (alertStatus) {
      query = query.eq('alert_status', alertStatus);
    }

    if (alertType) {
      query = query.eq('alert_type', alertType);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
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
      .from('stock_alerts')
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('stock_alerts')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
