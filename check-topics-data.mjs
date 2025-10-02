#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log('🔍 Checking topics data...\n');

  // Check topics table
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('*')
    .limit(5);

  if (topicsError) {
    console.log('❌ Error fetching topics:', topicsError.message);
  } else {
    console.log(`✅ Topics table: ${topics.length} topics found`);
    if (topics.length > 0) {
      console.log('   Sample topics:');
      topics.forEach(t => console.log(`   - ${t.name} (${t.category || 'no category'})`));
    }
  }

  // Check topic_statistics view
  const { data: stats, error: statsError } = await supabase
    .from('topic_statistics')
    .select('*')
    .limit(5);

  if (statsError) {
    console.log('\n❌ Error fetching topic_statistics:', statsError.message);
  } else {
    console.log(`\n✅ Topic_statistics view: ${stats.length} topics with stats`);
    if (stats.length > 0) {
      console.log('   Sample stats:');
      stats.forEach(s => console.log(`   - ${s.topic_name}: ${s.feedback_count} feedbacks, ${s.positive_percentage}% positive`));
    }
  }

  if (topics?.length === 0) {
    console.log('\n⚠️  No topics found in database.');
    console.log('   You need to populate topics from customer_feedbacks.topic column');
  }
}

checkData();
