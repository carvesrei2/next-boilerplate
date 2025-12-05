'use client'

import { useState } from 'react'
import PlantCollection from '@/components/PlantCollection'
import PlantSearch from '@/components/PlantSearch'
import Favorites from '@/components/Favorites'
import GardenCalendar from '@/components/GardenCalendar'

type Tab = 'collection' | 'search' | 'favorites' | 'calendar'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('collection')

  const tabs = [
    { id: 'collection' as Tab, label: 'My Plants', icon: '🌱' },
    { id: 'search' as Tab, label: 'Search', icon: '🔍' },
    { id: 'favorites' as Tab, label: 'Favorites', icon: '⭐' },
    { id: 'calendar' as Tab, label: 'Calendar', icon: '📅' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🌿 Plant & Garden Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your plant collection and garden schedules
          </p>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'collection' && <PlantCollection />}
        {activeTab === 'search' && <PlantSearch />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'calendar' && <GardenCalendar />}
      </main>
    </div>
  )
}
