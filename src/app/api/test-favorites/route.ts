import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try to insert a test favorite to check if RLS policies allow it
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const testData = {
      user_id: testUserId,
      species_id: 'test-species-123',
      botanical_name: 'Test Plant',
      common_name: 'Test',
    }
    
    // First, try to delete any existing test entry
    await supabase
      .from('favorites')
      .delete()
      .eq('species_id', 'test-species-123')
      .eq('user_id', testUserId)
    
    // Try to insert
    const { data, error } = await supabase
      .from('favorites')
      .insert(testData)
      .select()
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        message: 'RLS policies are blocking inserts. Please run migration 002_dev_policies.sql',
        migrationNeeded: true,
      }, { status: 403 })
    }
    
    // Clean up test data
    await supabase
      .from('favorites')
      .delete()
      .eq('species_id', 'test-species-123')
      .eq('user_id', testUserId)
    
    return NextResponse.json({
      success: true,
      message: 'Migration appears to be working correctly!',
      migrationNeeded: false,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      migrationNeeded: true,
    }, { status: 500 })
  }
}

