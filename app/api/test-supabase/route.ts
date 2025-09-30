import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection and count
    const { count, error: countError } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      return NextResponse.json({
        success: false,
        error: countError.message,
        details: countError,
        message: 'Failed to connect to Supabase or table does not exist'
      }, { status: 500 })
    }

    // Test if we can actually fetch data
    const { data: sampleData, error: fetchError } = await supabase
      .from('customer_feedbacks')
      .select('*')
      .limit(5)

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: fetchError.message,
        details: fetchError,
        message: 'Table exists but cannot fetch data (possibly RLS policy issue)'
      }, { status: 500 })
    }

    // Test table schema by trying to insert minimal data
    const { error: schemaError } = await supabase
      .from('customer_feedbacks')
      .insert({})
      .select()

    const schemaResult = {
      error: schemaError?.message || 'No error',
      details: schemaError?.details || 'No details',
      hint: schemaError?.hint || 'No hint'
    }

    // Try a simple insert with just required fields
    const { data: insertData, error: insertError } = await supabase
      .from('customer_feedbacks')
      .insert({
        post_copy: 'Test post',
        date: '2025-01-01',
        time: '12:00:00'
      })
      .select()

    let insertResult = null
    if (insertError) {
      insertResult = {
        success: false,
        error: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        message: 'Cannot insert data'
      }
    } else {
      insertResult = {
        success: true,
        message: 'Insert test successful',
        insertedRecord: insertData?.[0]
      }
      
      // Clean up test record
      if (insertData?.[0]?.id) {
        await supabase
          .from('customer_feedbacks')
          .delete()
          .eq('id', insertData[0].id)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tableExists: true,
      recordCount: count || 0,
      sampleRecords: sampleData || [],
      schemaTest: schemaResult,
      insertTest: insertResult,
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Unexpected error occurred'
    }, { status: 500 })
  }
}