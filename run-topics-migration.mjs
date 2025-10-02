#!/usr/bin/env node

/**
 * Run Topics Migration
 * 
 * This script runs the migration to set up the topics many-to-many relationship.
 * It will:
 * 1. Create the topics table
 * 2. Create the customer_feedback_topic pivot table
 * 3. Create the topic_statistics and customer_feedbacks_with_topics views
 * 4. Optionally migrate existing data from customer_feedbacks.topic column
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase configuration');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting Topics Migration...\n');

    // Read the migration file
    const migrationPath = join(__dirname, 'migrations', '001_customer_feedback_topics_many_to_many.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split the migration into individual statements
    // Remove comments and split by semicolons
    const statements = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // Skip empty statements
      if (!stmt || stmt.length < 10) continue;

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      // Show a preview of the statement
      const preview = stmt.substring(0, 80).replace(/\s+/g, ' ');
      console.log(`   ${preview}${stmt.length > 80 ? '...' : ''}`);

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_string: stmt });
        
        if (error) {
          // Try direct query if RPC doesn't work
          const { error: queryError } = await supabase.from('_').select('*').limit(0);
          
          if (queryError) {
            console.error(`   ⚠️  Warning: ${error.message}`);
            console.log('   Continuing with next statement...\n');
          }
        } else {
          console.log('   ✅ Success\n');
        }
      } catch (err) {
        console.error(`   ⚠️  Warning: ${err.message}`);
        console.log('   Continuing with next statement...\n');
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log('\n📊 Verifying created objects...\n');

    // Verify the topics table exists
    const { data: topicsData, error: topicsError } = await supabase
      .from('topics')
      .select('count')
      .limit(0);

    if (!topicsError) {
      console.log('✅ Topics table exists');
    } else {
      console.log('❌ Topics table not found:', topicsError.message);
    }

    // Verify the pivot table exists
    const { data: pivotData, error: pivotError } = await supabase
      .from('customer_feedback_topic')
      .select('count')
      .limit(0);

    if (!pivotError) {
      console.log('✅ Customer_feedback_topic pivot table exists');
    } else {
      console.log('❌ Customer_feedback_topic table not found:', pivotError.message);
    }

    // Check if we can query the view
    const { data: statsData, error: statsError } = await supabase
      .from('topic_statistics')
      .select('*')
      .limit(1);

    if (!statsError) {
      console.log('✅ Topic_statistics view exists');
      console.log(`📈 Found ${statsData?.length || 0} topics\n`);
    } else {
      console.log('❌ Topic_statistics view not found:', statsError.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('Migration process completed!');
    console.log('='.repeat(60));
    console.log('\n⚠️  IMPORTANT: If you see errors above, you may need to run');
    console.log('the migration manually using the Supabase SQL Editor:');
    console.log('\n1. Go to your Supabase Dashboard → SQL Editor');
    console.log('2. Open: migrations/001_customer_feedback_topics_many_to_many.sql');
    console.log('3. Copy and paste the entire file');
    console.log('4. Click "Run"\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nPlease run the migration manually:');
    console.error('1. Go to your Supabase Dashboard → SQL Editor');
    console.error('2. Open: migrations/001_customer_feedback_topics_many_to_many.sql');
    console.error('3. Copy and paste the entire file');
    console.error('4. Click "Run"');
    process.exit(1);
  }
}

runMigration();

