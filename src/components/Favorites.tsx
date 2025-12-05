'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Favorite } from '@/types/database'
import { getUserId } from '@/lib/user-id'

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const supabase = createClient()
        const userId = getUserId()
        
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setFavorites(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load favorites')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('favorites').delete().eq('id', id)

      if (error) throw error
      setFavorites(favorites.filter((fav) => fav.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove favorite')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading favorites...</div>
  }

  if (error) {
    return <div className="text-red-600 py-8">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Favorites</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No favorites yet. Search for plants and add them to your favorites!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {favorite.common_name || favorite.botanical_name}
                  </h3>
                  <p className="text-sm text-gray-600 italic">{favorite.botanical_name}</p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="ml-4 text-yellow-500 hover:text-yellow-600"
                  title="Remove from favorites"
                >
                  ⭐
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

