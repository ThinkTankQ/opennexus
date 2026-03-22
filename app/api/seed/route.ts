import { NextResponse } from 'next/server'
import { seedFacilities, seedATCCodes, seedSuppliers } from '@/lib/seed-utils'

export async function POST(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding not allowed in production' },
        { status: 403 }
      )
    }

    console.log('[v0] Starting database seeding...')

    await seedATCCodes()
    await seedSuppliers()
    await seedFacilities()

    return NextResponse.json({
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Seeding error:', error)
    return NextResponse.json(
      { error: 'Seeding failed', details: String(error) },
      { status: 500 }
    )
  }
}
