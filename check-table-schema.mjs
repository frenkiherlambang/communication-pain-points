import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.log('Could not load .env.local file');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase table schema...');
console.log('URL:', supabaseUrl);
console.log('Has Key:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchema() {
  try {
    // Check if table exists and get basic info
    console.log('\n📊 Checking table existence...');
    const { count, error: countError } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Table check failed:', countError.message);
      return;
    }

    console.log('✅ Table exists with', count, 'records');

    // Try to get table schema by querying information_schema
    console.log('\n🔍 Checking table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'customer_feedbacks' });

    if (schemaError) {
      console.log('⚠️ Could not get schema via RPC:', schemaError.message);
      
      // Alternative: try to select with limit 0 to see what columns exist
      console.log('\n🔍 Trying alternative schema check...');
      const { data: emptyData, error: emptyError } = await supabase
        .from('customer_feedbacks')
        .select('*')
        .limit(0);

      if (emptyError) {
        console.log('❌ Alternative schema check failed:', emptyError.message);
      } else {
        console.log('✅ Table accessible, but no data to show schema');
      }
    } else {
      console.log('✅ Schema data:', schemaData);
    }

    // Try to insert a minimal record to see what's required
    console.log('\n🧪 Testing minimal insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('customer_feedbacks')
      .insert({
        post_copy: 'Test post'
      })
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      console.log('Details:', insertError.details);
      console.log('Hint:', insertError.hint);
    } else {
      console.log('✅ Insert test successful:', insertData);
      
      // Clean up test record
      if (insertData?.[0]?.id) {
        await supabase
          .from('customer_feedbacks')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

    // Check RLS policies
    console.log('\n🔒 Checking RLS policies...');
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('check_rls_policies');

    if (rlsError) {
      console.log('⚠️ Could not check RLS policies:', rlsError.message);
    } else {
      console.log('✅ RLS policies:', rlsData);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkTableSchema();