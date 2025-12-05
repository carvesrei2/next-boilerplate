/**
 * Script to check if Supabase migration has been run
 * Run with: node scripts/check-migration.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkMigration() {
  console.log('🔍 Checking if migration has been run...\n')
  
  const tablesToCheck = ['plants', 'favorites', 'garden_chores', 'plant_schedules']
  const results = {}
  
  for (const tableName of tablesToCheck) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          results[tableName] = { exists: false, error: 'Table does not exist' }
        } else {
          results[tableName] = { exists: false, error: error.message }
        }
      } else {
        results[tableName] = { exists: true }
      }
    } catch (err) {
      results[tableName] = { exists: false, error: err.message }
    }
  }
  
  console.log('📊 Migration Status:\n')
  let allExist = true
  
  for (const [tableName, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`✅ ${tableName} - EXISTS`)
    } else {
      console.log(`❌ ${tableName} - MISSING`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
      allExist = false
    }
  }
  
  console.log('\n' + '='.repeat(50))
  if (allExist) {
    console.log('✅ All tables exist! Migration has been run successfully.')
  } else {
    console.log('❌ Some tables are missing. Please run the migration.')
    console.log('\nTo run the migration:')
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor')
    console.log('4. Copy and paste the contents of: supabase/migrations/001_initial_schema.sql')
    console.log('5. Click "Run"')
  }
}

checkMigration().catch(console.error)

