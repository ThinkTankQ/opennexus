import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { medicines } = await request.json()

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json(
        { error: 'Invalid medicines data' },
        { status: 400 }
      )
    }

    console.log(`[v0] Importing ${medicines.length} medicines...`)

    // Batch insert medicines
    const { data, error } = await supabase
      .from('medicines')
      .upsert(medicines, { onConflict: 'nappi_code' })
      .select()

    if (error) {
      console.error('[v0] Import error:', error)
      return NextResponse.json(
        { error: 'Failed to import medicines', details: error.message },
        { status: 500 }
      )
    }

    console.log(`[v0] Successfully imported ${data?.length || 0} medicines`)

    return NextResponse.json({
      message: 'Medicines imported successfully',
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Import error:', error)
    return NextResponse.json(
      { error: 'Import failed', details: String(error) },
      { status: 500 }
    )
  }
}
