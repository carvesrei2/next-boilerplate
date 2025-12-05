'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GardenChore } from '@/types/database'
import { getUserId } from '@/lib/user-id'

export default function GardenCalendar() {
  const [chores, setChores] = useState<GardenChore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    async function fetchChores() {
      try {
        const supabase = createClient()
        const userId = getUserId()
        
        const { data, error } = await supabase
          .from('garden_chores')
          .select('*')
          .eq('user_id', userId)
          .order('scheduled_date', { ascending: true })

        if (error) throw error
        setChores(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load garden chores')
      } finally {
        setLoading(false)
      }
    }

    fetchChores()
  }, [])

  const handleToggleComplete = async (chore: GardenChore) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('garden_chores')
        .update({
          completed: !chore.completed,
          completed_at: !chore.completed ? new Date().toISOString() : null,
        })
        .eq('id', chore.id)

      if (error) throw error

      setChores(
        chores.map((c) =>
          c.id === chore.id
            ? {
                ...c,
                completed: !c.completed,
                completed_at: !c.completed ? new Date().toISOString() : null,
              }
            : c
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update chore')
    }
  }

  const getChoresForDate = (date: string) => {
    return chores.filter((chore) => chore.scheduled_date === date)
  }

  const getChoreTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      watering: '💧',
      fertilizing: '🌿',
      pruning: '✂️',
      repotting: '🪴',
      harvesting: '🌾',
      other: '📋',
    }
    return emojis[type] || '📋'
  }

  if (loading) {
    return <div className="text-center py-8">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-red-600 py-8">Error: {error}</div>
  }

  const todayChores = getChoresForDate(selectedDate)
  const upcomingChores = chores
    .filter((chore) => !chore.completed && new Date(chore.scheduled_date) >= new Date(selectedDate))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Garden Calendar</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="date-select" className="block text-sm font-medium mb-2">
            Select Date:
          </label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">
            Chores for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          {todayChores.length === 0 ? (
            <div className="text-gray-500">No chores scheduled for this date.</div>
          ) : (
            <div className="space-y-2">
              {todayChores.map((chore) => (
                <div
                  key={chore.id}
                  className={`border rounded-lg p-4 flex items-start justify-between ${
                    chore.completed ? 'bg-gray-100 opacity-75' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getChoreTypeEmoji(chore.chore_type)}</span>
                      <h4 className="font-semibold">{chore.title}</h4>
                    </div>
                    {chore.description && (
                      <p className="text-sm text-gray-600 mt-1">{chore.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 capitalize">{chore.chore_type}</p>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(chore)}
                    className={`ml-4 px-3 py-1 rounded ${
                      chore.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {chore.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {upcomingChores.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Upcoming Chores</h3>
            <div className="space-y-2">
              {upcomingChores.map((chore) => (
                <div
                  key={chore.id}
                  className="border rounded-lg p-3 flex items-center gap-2"
                >
                  <span className="text-lg">{getChoreTypeEmoji(chore.chore_type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{chore.title}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(chore.scheduled_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

