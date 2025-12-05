'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plant } from '@/types/database'
import { getUserId } from '@/lib/user-id'

export default function PlantCollection() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    botanical_name: '',
    species_id: '',
    location: '',
    date_planted: '',
    notes: '',
    image_url: '',
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    async function fetchPlants() {
      try {
        const supabase = createClient()
        const userId = getUserId()
        
        const { data, error } = await supabase
          .from('plants')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPlants(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plants')
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [])

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Please enter a plant name')
      return
    }

    setAdding(true)
    try {
      const supabase = createClient()
      const userId = getUserId()

      const { data, error } = await supabase
        .from('plants')
        .insert({
          user_id: userId,
          name: formData.name,
          botanical_name: formData.botanical_name || null,
          species_id: formData.species_id || null,
          location: formData.location || null,
          date_planted: formData.date_planted || null,
          notes: formData.notes || null,
          image_url: formData.image_url || null,
        })
        .select()

      if (error) throw error

      // Add the new plant to the list
      if (data && data[0]) {
        setPlants([data[0], ...plants])
      }

      // Reset form
      setFormData({
        name: '',
        botanical_name: '',
        species_id: '',
        location: '',
        date_planted: '',
        notes: '',
        image_url: '',
      })
      setShowAddForm(false)
      alert('Plant added to your collection!')
    } catch (err) {
      console.error('Error adding plant:', err)
      alert(err instanceof Error ? err.message : 'Failed to add plant')
    } finally {
      setAdding(false)
    }
  }

  const handleDeletePlant = async (id: string) => {
    if (!confirm('Are you sure you want to remove this plant from your collection?')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('plants').delete().eq('id', id)

      if (error) throw error

      setPlants(plants.filter((plant) => plant.id !== id))
      alert('Plant removed from collection')
    } catch (err) {
      console.error('Error deleting plant:', err)
      alert(err instanceof Error ? err.message : 'Failed to remove plant')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your plants...</div>
  }

  if (error) {
    return <div className="text-red-600 py-8">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Plant Collection</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Plant'}
        </button>
      </div>

      {showAddForm && (
        <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Add New Plant</h3>
          <form onSubmit={handleAddPlant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Plant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., My Monstera"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Botanical Name</label>
                <input
                  type="text"
                  value={formData.botanical_name}
                  onChange={(e) => setFormData({ ...formData, botanical_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Monstera deliciosa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Living Room, Garden Bed 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date Planted</label>
                <input
                  type="date"
                  value={formData.date_planted}
                  onChange={(e) => setFormData({ ...formData, date_planted: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Species ID</label>
                <input
                  type="text"
                  value={formData.species_id}
                  onChange={(e) => setFormData({ ...formData, species_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Optional: from Trefle API"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Any notes about this plant..."
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {adding ? 'Adding...' : 'Add to Collection'}
            </button>
          </form>
        </div>
      )}
      {plants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No plants yet. Add your first plant to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow relative"
            >
              {plant.image_url && (
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold text-lg">{plant.name}</h3>
              {plant.botanical_name && (
                <p className="text-sm text-gray-600 italic">{plant.botanical_name}</p>
              )}
              {plant.location && (
                <p className="text-sm text-gray-500 mt-2">📍 {plant.location}</p>
              )}
              {plant.date_planted && (
                <p className="text-sm text-gray-500">
                  Planted: {new Date(plant.date_planted).toLocaleDateString()}
                </p>
              )}
              {plant.notes && (
                <p className="text-sm mt-2 text-gray-700 line-clamp-2">{plant.notes}</p>
              )}
              <button
                onClick={() => handleDeletePlant(plant.id)}
                className="mt-3 text-sm text-red-600 hover:text-red-700"
                title="Remove from collection"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

