'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserId } from '@/lib/user-id'

interface SearchResult {
  id: string | number
  scientific_name: string
  common_name?: string
  family?: string
  family_common_name?: string
  description?: string
  image_url?: string
  images?: {
    flower?: Array<{ url: string }>
    leaf?: Array<{ url: string }>
    habit?: Array<{ url: string }>
    fruit?: Array<{ url: string }>
    bark?: Array<{ url: string }>
    other?: Array<{ url: string }>
  }
}

export default function PlantSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/botanical/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search plants')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCollection = async (species: SearchResult) => {
    try {
      const supabase = createClient()
      const userId = getUserId()

      const { error } = await supabase.from('plants').insert({
        user_id: userId,
        name: species.common_name || species.scientific_name,
        botanical_name: species.scientific_name,
        species_id: String(species.id),
        image_url: species.image_url || species.images?.flower?.[0]?.url || species.images?.habit?.[0]?.url || null,
      })

      if (error) {
        if (error.code === '23505') {
          alert('This plant is already in your collection!')
          return
        }
        throw error
      }

      alert('Added to your collection! Check the "My Plants" tab.')
    } catch (err) {
      console.error('Error adding to collection:', err)
      alert(err instanceof Error ? err.message : 'Failed to add to collection')
    }
  }

  const handleAddToFavorites = async (species: SearchResult) => {
    try {
      const supabase = createClient()
      const userId = getUserId()
      
      console.log('Adding favorite:', { userId, species_id: species.id, botanical_name: species.scientific_name })
      
      const { data, error } = await supabase.from('favorites').insert({
        user_id: userId,
        species_id: String(species.id),
        botanical_name: species.scientific_name,
        common_name: species.common_name,
      }).select()

      if (error) {
        // Only log if there's actually useful information
        if (error.message || error.code) {
          console.error('Supabase error:', {
            message: error.message || 'No message',
            code: error.code || 'No code',
            ...(error.details && { details: error.details }),
            ...(error.hint && { hint: error.hint }),
          })
        }
        
        // If it's a unique constraint error, the favorite already exists
        if (error.code === '23505') {
          alert('This plant is already in your favorites!')
          return
        }
        
        // If it's a permission error, the RLS policies are blocking
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
          alert('Permission denied. Please make sure you have run the database migration (002_dev_policies.sql) in Supabase.')
          return
        }
        
        throw new Error(error.message || `Database error: ${error.code || 'Unknown error'}`)
      }
      
      console.log('Successfully added favorite:', data)
      alert('Added to favorites!')
    } catch (err) {
      console.error('Error adding to favorites:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null
        ? JSON.stringify(err)
        : 'Failed to add to favorites'
      
      alert(`Error: ${errorMessage}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Search Plants</h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a plant..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="text-red-600">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((species) => (
              <div
                key={species.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold">{species.common_name || species.scientific_name}</h4>
                    <p className="text-sm text-gray-600 italic">{species.scientific_name}</p>
                    {species.family && (
                      <p className="text-xs text-gray-500 mt-1">
                        Family: {species.family_common_name || species.family}
                      </p>
                    )}
                    {species.description && (
                      <p className="text-sm mt-2 text-gray-700 line-clamp-3">
                        {species.description}
                      </p>
                    )}
                    {(species.image_url || species.images?.flower?.[0]?.url || species.images?.habit?.[0]?.url) && (
                      <img
                        src={species.image_url || species.images?.flower?.[0]?.url || species.images?.habit?.[0]?.url}
                        alt={species.common_name || species.scientific_name}
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCollection(species)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      title="Add to collection"
                    >
                      🌱 Add to Collection
                    </button>
                    <button
                      onClick={() => handleAddToFavorites(species)}
                      className="px-3 py-2 text-yellow-500 hover:text-yellow-600 border border-yellow-500 rounded transition-colors"
                      title="Add to favorites"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

