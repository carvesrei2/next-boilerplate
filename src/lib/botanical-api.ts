/**
 * Trefle API client for fetching plant species data
 * Documentation: https://docs.trefle.io/
 */

const TREFLE_API_BASE_URL = process.env.NEXT_PUBLIC_BOTANICAL_API_URL || 'https://trefle.io/api/v1'
const TREFLE_API_TOKEN = process.env.BOTANICAL_API_TOKEN

export interface BotanicalApiResponse {
  id: string | number
  scientific_name: string
  common_name?: string
  family?: string
  genus?: string
  family_common_name?: string
  image_url?: string
  year?: number
  bibliography?: string
  author?: string
  status?: string
  rank?: string
  observations?: string
  vegetable?: boolean
  edible_part?: string[]
  edible?: boolean
  images?: {
    flower?: Array<{ url: string }>
    leaf?: Array<{ url: string }>
    habit?: Array<{ url: string }>
    fruit?: Array<{ url: string }>
    bark?: Array<{ url: string }>
    other?: Array<{ url: string }>
  }
  // Trefle-specific fields
  slug?: string
  link?: string
}

export interface TrefleSearchResponse {
  data: BotanicalApiResponse[]
  links?: {
    self?: string
    first?: string
    last?: string
    prev?: string
    next?: string
  }
  meta?: {
    total?: number
  }
}

export interface BotanicalApiSearchParams {
  query?: string
  scientific_name?: string
  common_name?: string
  family?: string
  limit?: number
  page?: number
}

/**
 * Search for plant species using Trefle API
 * Documentation: https://docs.trefle.io/reference#operation/searchPlants
 */
export async function searchPlantSpecies(
  params: BotanicalApiSearchParams
): Promise<BotanicalApiResponse[]> {
  if (!TREFLE_API_TOKEN) {
    throw new Error('Trefle API token is not configured')
  }

  const searchParams = new URLSearchParams()
  searchParams.append('token', TREFLE_API_TOKEN)
  
  if (params.query) {
    searchParams.append('q', params.query)
  }
  if (params.scientific_name) {
    searchParams.append('filter[scientific_name]', params.scientific_name)
  }
  if (params.common_name) {
    searchParams.append('filter[common_name]', params.common_name)
  }
  if (params.family) {
    searchParams.append('filter[family]', params.family)
  }
  if (params.page) {
    searchParams.append('page', params.page.toString())
  }

  // Trefle uses /plants/search endpoint
  const response = await fetch(`${TREFLE_API_BASE_URL}/plants/search?${searchParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Trefle API error: ${response.statusText} - ${errorText}`)
  }

  const data: TrefleSearchResponse = await response.json()
  return data.data || []
}

/**
 * Get a specific plant species by ID using Trefle API
 * Documentation: https://docs.trefle.io/reference#operation/getPlant
 */
export async function getPlantSpeciesById(id: string | number): Promise<BotanicalApiResponse> {
  if (!TREFLE_API_TOKEN) {
    throw new Error('Trefle API token is not configured')
  }

  const response = await fetch(
    `${TREFLE_API_BASE_URL}/plants/${id}?token=${TREFLE_API_TOKEN}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Trefle API error: ${response.statusText} - ${errorText}`)
  }

  const data: { data: BotanicalApiResponse } = await response.json()
  return data.data
}

