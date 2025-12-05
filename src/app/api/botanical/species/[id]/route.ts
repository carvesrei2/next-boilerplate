import { NextRequest, NextResponse } from 'next/server'
import { getPlantSpeciesById } from '@/lib/botanical-api'

export async function GET(
  request: NextRequest,
  context: { params?: Promise<Record<string, string | string[] | undefined>> }
) {
  try {
    const params = await context.params
    const id = params?.id

    if (!id || Array.isArray(id)) {
      return NextResponse.json({ error: 'Invalid species id' }, { status: 400 })
    }

    const species = await getPlantSpeciesById(id)
    return NextResponse.json(species)
  } catch (error) {
    console.error('Botanical API get species error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get plant species' },
      { status: 500 }
    )
  }
}
