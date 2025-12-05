import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if tables exist by trying to query them
    const tablesToCheck = ['plants', 'favorites', 'garden_chores', 'plant_schedules']
    const results: Record<string, boolean> = {}
    
    for (const tableName of tablesToCheck) {
      try {
        // Try to query the table with a limit of 0 to just check if it exists
        const { error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        results[tableName] = !error
      } catch (err) {
        results[tableName] = false
      }
    }
    
    // Also check if we can connect to Supabase at all
    const { data: healthCheck, error: healthError } = await supabase
      .from('plants')
      .select('count', { count: 'exact', head: true })
    
    const allTablesExist = Object.values(results).every(exists => exists)
    
    return NextResponse.json({
      connected: !healthError,
      tables: results,
      allTablesExist,
      message: allTablesExist 
        ? 'All tables exist! Migration appears to have been run.' 
        : 'Some tables are missing. Please run the migration.',
      missingTables: Object.entries(results)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name)
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to check database',
        connected: false
      },
      { status: 500 }
    )
  }
}

