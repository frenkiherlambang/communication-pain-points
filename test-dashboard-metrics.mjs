// Test script for dashboard metrics with real Supabase connection
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
try {
  const envContent = readFileSync(join(__dirname, '.env.local'), 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('//') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.log('Could not load .env.local file:', error.message);
}

console.log('Testing Dashboard Metrics with Real Supabase Connection...\n');

async function testDashboardMetrics() {
  try {
    console.log('Environment Variables Check:');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not Set');
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('\n❌ Environment variables not properly configured');
      return;
    }
    
    // Test Supabase connection
    const { createClient } = await import('@supabase/supabase-js');
    console.log('\n✅ Supabase client library is available');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client created successfully');
    
    // Test database connection and check table schema
    console.log('\n🔍 Testing database connection and checking table schema...');
    
    // First, let's see what data exists in the table
    const { data: allData, error: allDataError } = await supabase
      .from('customer_feedbacks')
      .select('*')
      .limit(1);
    
    if (allDataError) {
      console.log('❌ Database connection failed:', allDataError.message);
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    if (allData && allData.length > 0) {
      console.log('\n📋 Table schema (columns found in first record):');
      const columns = Object.keys(allData[0]);
      columns.forEach(col => console.log(`  - ${col}`));
      
      console.log('\n📊 Sample record:');
      console.log(JSON.stringify(allData[0], null, 2));
    } else {
      console.log('\n📋 Table exists but is empty. Let\'s check if we can insert data...');
      
      // Try to get table info by attempting a select with common column names
      const commonColumns = ['id', 'created_at', 'updated_at'];
      for (const col of commonColumns) {
        try {
          const { data, error } = await supabase
            .from('customer_feedbacks')
            .select(col)
            .limit(1);
          
          if (!error) {
            console.log(`✅ Column '${col}' exists`);
          }
        } catch (e) {
          console.log(`❌ Column '${col}' does not exist`);
        }
      }
    }
    
    // Test getting total count
    console.log('\n📊 Testing getTotalFeedbackCount equivalent...');
    const { count, error: countError } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Count query failed:', countError.message);
    } else {
      console.log('✅ Total feedback count:', count || 0);
    }
    
    // Check if the table needs to be created with proper schema
    if (count === 0) {
      console.log('\n💡 The table is empty. You may need to:');
      console.log('1. Run the SQL commands from SUPABASE_SETUP.md to create the proper schema');
      console.log('2. Insert sample data for testing');
      console.log('3. Set up Row Level Security policies');
      
      console.log('\n📝 Expected columns for dashboard-metrics.ts:');
      const expectedColumns = [
        'id', 'sentiment', 'type_of_post', 'topic', 'status', 
        'date', 'time', 'date_responses', 'created_at', 'updated_at'
      ];
      expectedColumns.forEach(col => console.log(`  - ${col}`));
    }
    
    console.log('\n🎉 Database connection test completed!');
    console.log('📝 Next steps:');
    console.log('  1. If table is empty, run the SQL setup from SUPABASE_SETUP.md');
    console.log('  2. Insert sample data for testing');
    console.log('  3. The dashboard-metrics.ts functions will work once data is available');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDashboardMetrics();