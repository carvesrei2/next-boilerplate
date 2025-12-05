export interface Plant {
  id: string
  user_id: string
  name: string
  botanical_name?: string
  species_id?: string
  location?: string
  date_planted?: string
  notes?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  species_id: string
  botanical_name: string
  common_name?: string
  created_at: string
}

export interface GardenChore {
  id: string
  user_id: string
  plant_id?: string
  title: string
  description?: string
  chore_type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'harvesting' | 'other'
  scheduled_date: string
  completed: boolean
  completed_at?: string | null
  created_at: string
  updated_at: string
}

export interface PlantSchedule {
  id: string
  user_id: string
  plant_id: string
  chore_type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'harvesting' | 'other'
  frequency_days: number
  last_completed?: string
  next_due_date: string
  notes?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface BotanicalSpecies {
  id: string
  scientific_name: string
  common_name?: string
  family?: string
  genus?: string
  description?: string
  care_instructions?: string
  watering_frequency?: string
  light_requirements?: string
  temperature_range?: string
  image_url?: string
}
