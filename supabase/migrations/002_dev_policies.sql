-- Temporary development policies to allow inserts without authentication
-- WARNING: These policies are for development only. Remove or replace with proper auth policies before production.

-- First, check and drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

DROP POLICY IF EXISTS "Users can insert their own plants" ON plants;
DROP POLICY IF EXISTS "Users can view their own plants" ON plants;
DROP POLICY IF EXISTS "Users can update their own plants" ON plants;
DROP POLICY IF EXISTS "Users can delete their own plants" ON plants;

DROP POLICY IF EXISTS "Users can insert their own garden chores" ON garden_chores;
DROP POLICY IF EXISTS "Users can view their own garden chores" ON garden_chores;
DROP POLICY IF EXISTS "Users can update their own garden chores" ON garden_chores;
DROP POLICY IF EXISTS "Users can delete their own garden chores" ON garden_chores;

DROP POLICY IF EXISTS "Users can insert their own plant schedules" ON plant_schedules;
DROP POLICY IF EXISTS "Users can view their own plant schedules" ON plant_schedules;
DROP POLICY IF EXISTS "Users can update their own plant schedules" ON plant_schedules;
DROP POLICY IF EXISTS "Users can delete their own plant schedules" ON plant_schedules;

-- Drop dev policies if they already exist (for re-running)
DROP POLICY IF EXISTS "Dev: Allow all favorites operations" ON favorites;
DROP POLICY IF EXISTS "Dev: Allow all plants operations" ON plants;
DROP POLICY IF EXISTS "Dev: Allow all garden chores operations" ON garden_chores;
DROP POLICY IF EXISTS "Dev: Allow all plant schedules operations" ON plant_schedules;

-- Create development-friendly policies (allow all operations for now)
-- These allow any user_id to be used (from localStorage)

-- Favorites policies
CREATE POLICY "Dev: Allow all favorites operations" ON favorites
  FOR ALL USING (true) WITH CHECK (true);

-- Plants policies
CREATE POLICY "Dev: Allow all plants operations" ON plants
  FOR ALL USING (true) WITH CHECK (true);

-- Garden chores policies
CREATE POLICY "Dev: Allow all garden chores operations" ON garden_chores
  FOR ALL USING (true) WITH CHECK (true);

-- Plant schedules policies
CREATE POLICY "Dev: Allow all plant schedules operations" ON plant_schedules
  FOR ALL USING (true) WITH CHECK (true);

-- Add the missing UNIQUE constraint on favorites if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'favorites_user_id_species_id_key'
  ) THEN
    ALTER TABLE favorites ADD CONSTRAINT favorites_user_id_species_id_key 
    UNIQUE (user_id, species_id);
  END IF;
END $$;
