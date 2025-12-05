import { NextRequest, NextResponse } from 'next/server'
import { searchPlantSpecies } from '@/lib/botanical-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || undefined
    const scientific_name = searchParams.get('scientific_name') || undefined
    const common_name = searchParams.get('common_name') || undefined
    const family = searchParams.get('family') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const results = await searchPlantSpecies({
      query,
      scientific_name,
      common_name,
      family,
      limit,
      offset,
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Botanical API search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search plant species' },
      { status: 500 }
    )
  }
}

