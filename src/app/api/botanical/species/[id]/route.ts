import { NextRequest, NextResponse } from 'next/server'
import { getPlantSpeciesById } from '@/lib/botanical-api'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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
