-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Plants table
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  botanical_name VARCHAR(255),
  species_id VARCHAR(255),
  location VARCHAR(255),
  date_planted DATE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  species_id VARCHAR(255) NOT NULL,
  botanical_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, species_id)
);

-- Garden chores table
CREATE TABLE IF NOT EXISTS garden_chores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  chore_type VARCHAR(50) NOT NULL CHECK (chore_type IN ('watering', 'fertilizing', 'pruning', 'repotting', 'harvesting', 'other')),
  scheduled_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plant schedules table
CREATE TABLE IF NOT EXISTS plant_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  chore_type VARCHAR(50) NOT NULL CHECK (chore_type IN ('watering', 'fertilizing', 'pruning', 'repotting', 'harvesting', 'other')),
  frequency_days INTEGER NOT NULL,
  last_completed TIMESTAMP WITH TIME ZONE,
  next_due_date DATE NOT NULL,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_garden_chores_user_id ON garden_chores(user_id);
CREATE INDEX IF NOT EXISTS idx_garden_chores_scheduled_date ON garden_chores(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_garden_chores_completed ON garden_chores(completed);
CREATE INDEX IF NOT EXISTS idx_plant_schedules_user_id ON plant_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_schedules_next_due_date ON plant_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_plant_schedules_active ON plant_schedules(active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_garden_chores_updated_at BEFORE UPDATE ON garden_chores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plant_schedules_updated_at BEFORE UPDATE ON plant_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
-- Note: You'll need to set up authentication and replace 'auth.uid()' with your actual auth function
-- For now, these are placeholder policies that you'll need to adjust based on your auth setup

-- Plants policies
CREATE POLICY "Users can view their own plants" ON plants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plants" ON plants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plants" ON plants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plants" ON plants
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Garden chores policies
CREATE POLICY "Users can view their own garden chores" ON garden_chores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own garden chores" ON garden_chores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own garden chores" ON garden_chores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own garden chores" ON garden_chores
  FOR DELETE USING (auth.uid() = user_id);

-- Plant schedules policies
CREATE POLICY "Users can view their own plant schedules" ON plant_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plant schedules" ON plant_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plant schedules" ON plant_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plant schedules" ON plant_schedules
  FOR DELETE USING (auth.uid() = user_id);

